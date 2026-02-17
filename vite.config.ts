import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import RemoteAssets from 'vite-plugin-remote-assets';

export default defineConfig({
	plugins: [
		RemoteAssets({
      assetsDir: 'static/assets',
			resolveMode: "relative",
			awaitDownload: true,
		}),
		{
      name: 'fix-remote-assets-path',
      enforce: 'post',
      transform(code) {
        if (code.includes('/static/assets')) {
					const regex = /(?:\.\.\/)+static\/assets\//g;
          return {
            code: code.replace(regex, "/assets/"), // Ugly fix of assets path error for SSG
            map: null
          };
        }
      }
    },
		sveltekit(),
	],
  build: {
    sourcemap: false
  }
});