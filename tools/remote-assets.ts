import { createHash } from 'crypto'
import { createWriteStream, existsSync, mkdirSync, promises as fs, rmSync } from 'fs'
import path from 'path'
import type { DevEnvironment, Plugin } from 'vite'

export interface RemoteAssetsRule {
  match: RegExp
  ext?: string
}

export interface RemoteAssetsOptions {
  assetsDir?: string
  rules?: RemoteAssetsRule[]
  resolveMode?: 'relative' | '@fs' | ((moduleId: string, url: string) => 'relative' | '@fs')
  awaitDownload?: boolean
}

const DEFAULT_RULES: RemoteAssetsRule[] = [
  {
    match: /\b(https?:\/\/[\w#&?./-]*?\.(?:png|jpe?g|svg|ico|webp))(?=[`'")\]])/gi
  }
]

interface Replacement {
  start: number
  end: number
  value: string
}

type Environment = Pick<DevEnvironment, 'moduleGraph'>

function slash(str: string) {
  return str.replace(/\\/g, '/')
}

function isValidHttpUrl(str: string) {
  try {
    const url = new URL(str)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function hashUrl(url: string) {
  return createHash('sha256').update(url).digest('hex').slice(0, 32)
}

function extnameOf(url: string) {
  try {
    return path.extname(new URL(url).pathname)
  } catch {
    return path.extname(url)
  }
}

async function download(url: string, filepath: string) {
  const response = await fetch(url)
  if (response.status === 429) {
    const retryAfter = Number(response.headers.get('retry-after') || 0)
    if (!retryAfter) throw new Error(`${url}: 429 without retry-after header`)
    await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000))
    return download(url, filepath)
  }
  if (!response.ok) throw new Error(`${url}: ${response.status}`)

  const buffer = Buffer.from(await response.arrayBuffer())
  await new Promise<void>((resolve, reject) => {
    const writer = createWriteStream(filepath)
    writer.on('error', reject)
    writer.on('finish', resolve)
    writer.end(buffer)
  })
}

export function remoteAssets(options: RemoteAssetsOptions = {}): Plugin {
  const {
    assetsDir = 'node_modules/.remote-assets',
    rules = DEFAULT_RULES,
    resolveMode = 'relative',
    awaitDownload = true
  } = options

  let dir = ''
  const tasks = new Map<string, Promise<void>>()
  const environments: Environment[] = []

  async function transformCode(code: string, id: string) {
    const replacements: Replacement[] = []
    const downloads: Promise<void>[] = []

    for (const rule of rules) {
      rule.match.lastIndex = 0
      let match: RegExpExecArray | null

      while ((match = rule.match.exec(code))) {
        const url = match[0]
        if (!url) {
          rule.match.lastIndex++
          continue
        }
        if (!isValidHttpUrl(url)) continue

        const filename = `${hashUrl(url)}${rule.ext ?? extnameOf(url)}`
        const filepath = slash(path.resolve(dir, filename))

        if (!existsSync(filepath)) {
          let task = tasks.get(filepath)
          if (!task) {
            task = (async () => {
              try {
                await download(url, filepath)
              } catch (error) {
                await fs.rm(filepath, { force: true })
                throw error
              } finally {
                tasks.delete(filepath)
              }
            })()
            tasks.set(filepath, task)
          }
          downloads.push(task)
        }

        const mode = typeof resolveMode === 'function' ? resolveMode(id, url) : resolveMode
        let value: string

        if (mode === 'relative') {
          value = slash(path.relative(path.dirname(id), `${dir}/${filename}`))
          if (value[0] !== '.') value = `./${value}`
        } else {
          let assetPath = `${dir}/${filename}`
          if (!assetPath.startsWith('/')) assetPath = `/${assetPath}`
          value = `/@fs${assetPath}`
        }

        replacements.push({
          start: match.index,
          end: match.index + url.length,
          value
        })
      }
    }

    if (!replacements.length) return null

    if (awaitDownload) {
      await Promise.all(downloads)
    } else if (downloads.length) {
      Promise.all(downloads)
        .then(() => {
          for (const environment of environments) {
            const module = environment.moduleGraph.getModuleById(id)
            if (module) environment.moduleGraph.invalidateModule(module)
          }
        })
        .catch(() => {})
    }

    replacements.sort((a, b) => a.start - b.start)

    let result = ''
    let last = 0
    for (const replacement of replacements) {
      if (replacement.start < last) continue
      result += code.slice(last, replacement.start) + replacement.value
      last = replacement.end
    }
    result += code.slice(last)

    result = result.replace(/(?:\.\.\/)+static\/assets\//g, '/assets/')

    return { code: result, map: null }
  }

  return {
    name: 'tools:remote-assets',
    enforce: 'pre',
    configResolved(resolved) {
      dir = slash(path.resolve(resolved.root, assetsDir))

      if (('force' in resolved.server && resolved.server.force) || resolved.optimizeDeps.force) {
        rmSync(dir, { recursive: true, force: true })
      }
      mkdirSync(dir, { recursive: true })
    },
    configureServer(server) {
      if ('environments' in server && server.environments) {
        environments.push(...Object.values(server.environments))
      } else {
        environments.push(server as unknown as Environment)
      }
    },
    async transform(code, id) {
      return transformCode(code, id)
    },
    transformIndexHtml: {
      order: 'pre',
      async handler(code, ctx) {
        return (await transformCode(code, ctx.filename))?.code
      }
    }
  }
}
