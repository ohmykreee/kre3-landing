# Kre3-landing

My personal landing page at [kre3.net](https://kre3.net). Using Svelte 5 & SvelteKit.

## How to Build

### Environment

- node === 24.13.1 (higher minor version is OK, higher major version might be OK due to backwards compatibility)
- npm (you can use your own fav package manager cause the `package.json` and `package-lock.json` are npm standardized)

### Setup Project

1. run `git clone https://github.com/ohmykreee/kre3-landing` to clone the whole project,

2. run `npm install --include=dev` to install all the deps,

3. copy `src/lib/config/example.ts` to `src/lib/config/default/default.ts`, and change to your own info.

BE CAUTIOUS that you must make `default.ts`'s structure correct, or DO NOT leave `default.ts` empty, or the site will not work. (the `_loader.ts` will first try to load `default.ts` then `example.ts` when it isn't exist.)

4. change the code the config file not covered and happy hacking

5. `npm run dev -- --bind=0.0.0.0` to run a dev server binding 0.0.0.0, `npm run lint` to do lint and formart check, `npm run format` to use prettier to format, `npm run build` to generate static site file to `build` casue it's a SSG project.

## License & trademark

- Code: Released under the (MIT license)[https://github.com/ohmykreee/kre3-landing/blob/main/LICENSE].
- Assets & Branding: All Rights Reserved. This includes logos, graphics, and design files which may not be reused or redistributed without permission.
