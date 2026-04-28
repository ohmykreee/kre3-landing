// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static'
import path from 'path'
import { readFileSync } from 'fs'

const target = () => {
  const examplePath = 'src/lib/config/example.ts'
  const defaultPath = 'src/lib/config/default/default.ts'
  try {
    const content = readFileSync(path.resolve(process.cwd(), defaultPath), { encoding: 'utf8' })
    return content && process.env.MODE !== 'test' ? defaultPath : examplePath
  } catch {
    return examplePath
  }
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter({
      // default options are shown. On some platforms
      // these options are set automatically — see below
      pages: 'build',
      assets: 'build',
      fallback: '404.html',
      precompress: false,
      strict: true
    }),
    inlineStyleThreshold: 2048,
    alias: {
      '$site-config': target()
    }
  }
}

export default config
