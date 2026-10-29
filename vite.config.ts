import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import cssnano from 'cssnano'
import { staticCopy } from './tools/static-copy'
import { remoteAssets } from './tools/remote-assets'

export default defineConfig({
  plugins: [
    staticCopy(),
    remoteAssets({
      assetsDir: 'static/assets',
      resolveMode: 'relative',
      awaitDownload: true
    }),
    sveltekit()
  ],
  build: {
    sourcemap: false,
    assetsInlineLimit: (filePath) => {
      if (filePath.endsWith('.woff2') || filePath.endsWith('.woff')) {
        return false // opt out web fonts
      }
    }
  },
  css: {
    postcss: {
      plugins: [
        cssnano({
          preset: 'default'
        })
      ]
    }
  }
})
