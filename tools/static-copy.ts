import { createReadStream, cpSync, existsSync, statSync } from 'fs'
import path from 'path'
import type { Plugin, ResolvedConfig } from 'vite'

export interface StaticCopyOptions {
  dest?: string
}

const MIME_TYPES: Record<string, string> = {
  txt: 'text/plain; charset=utf-8',
  html: 'text/html; charset=utf-8',
  htm: 'text/html; charset=utf-8',
  css: 'text/css; charset=utf-8',
  js: 'text/javascript; charset=utf-8',
  mjs: 'text/javascript; charset=utf-8',
  json: 'application/json; charset=utf-8',
  xml: 'application/xml; charset=utf-8',
  webmanifest: 'application/manifest+json; charset=utf-8',
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  avif: 'image/avif',
  ico: 'image/x-icon',
  woff: 'font/woff',
  woff2: 'font/woff2',
  ttf: 'font/ttf',
  otf: 'font/otf',
  pdf: 'application/pdf',
  wasm: 'application/wasm',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mp3: 'audio/mpeg',
  ogg: 'audio/ogg'
}

function resolveSource(root: string) {
  const defaultDir = path.resolve(root, 'src/lib/config/default/static')
  if (process.env.MODE !== 'test' && existsSync(defaultDir)) return defaultDir

  const exampleDir = path.resolve(root, 'src/lib/config/static')
  return existsSync(exampleDir) ? exampleDir : null
}

export function staticCopy(options: StaticCopyOptions = {}): Plugin[] {
  const { dest = 'build' } = options
  let root = process.cwd()
  let source: string | null = null

  const resolve = (config: ResolvedConfig) => {
    root = config.root
    source = resolveSource(config.root)
  }

  const serve: Plugin = {
    name: 'tools:static-copy-serve',
    apply: 'serve',
    configResolved: resolve,
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!source || (req.method !== 'GET' && req.method !== 'HEAD') || !req.url) {
          return next()
        }

        let pathname: string
        try {
          pathname = decodeURIComponent(req.url.split('?')[0].split('#')[0])
        } catch {
          return next()
        }

        const file = path.resolve(source, `.${pathname}`)
        if (file !== source && !file.startsWith(`${source}${path.sep}`)) return next()

        let stat
        try {
          stat = statSync(file)
        } catch {
          return next()
        }
        if (!stat.isFile()) return next()

        const ext = path.extname(file).slice(1).toLowerCase()
        res.setHeader('Content-Type', MIME_TYPES[ext] ?? 'application/octet-stream')
        res.setHeader('Content-Length', stat.size)

        if (req.method === 'HEAD') {
          res.end()
          return
        }

        createReadStream(file).pipe(res)
      })
    }
  }

  const build: Plugin = {
    name: 'tools:static-copy-build',
    apply: 'build',
    enforce: 'post',
    configResolved: resolve,
    closeBundle: {
      sequential: true,
      handler() {
        if (!this.environment.config.build.ssr || !source) return

        const outDir = path.resolve(root, dest)
        if (!existsSync(outDir)) return

        cpSync(source, outDir, { recursive: true, force: true })
      }
    }
  }

  return [serve, build]
}
