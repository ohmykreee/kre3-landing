# Kre3-landing

![CI/CD](https://github.com/ohmykreee/kre3-landing/actions/workflows/lint-deploy.yaml/badge.svg)
![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=flat&logo=svelte&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)

My personal landing page at [kre3.net](https://kre3.net). Using Svelte 5 & SvelteKit.

## How to Build

### Environment

- node === 24.13.1 (higher minor version is OK, higher major version might be OK due to backwards compatibility)
- pnpm === 11.0.6 (or higher)

### Setup Project

1. run `git clone https://github.com/ohmykreee/kre3-landing` to clone the whole project,

2. run `pnpm i` to install all the deps,

3. copy `src/lib/config/example.ts` to `src/lib/config/default/default.ts`, and change to your own info,

BE CAUTIOUS that you must make `default.ts`'s structure correct, or DO NOT leave `default.ts` empty, or the site will not work. (the `_loader.ts` will first try to load `default.ts` then `example.ts` when it isn't exist.)

4. change the code the config file not covered and happy hacking,

5. `pnpm dev --host=0.0.0.0` to run a dev server binding 0.0.0.0, `pnpm lint` to do lint and format check, `pnpm format` to use prettier to format, `pnpm build` to generate static site file to `build` casue it's a SSG project.

6. use `MODE=test pnpm dev --host=0.0.0.0` to handily select example config file.

### About Github CI/CD

The workflows files here do cloning your config file from a repo and do a `pnpm lint` first, when no error present then do `pnpm build` and publish static file to Cloudflare Pages.

1. To clone your config file from your repo, you should provide `CONFIG_REPO_URL` in your "Actions secrets and variables". If your repo is private, you need to : 1. Create a new SSH key pair, 2. Put the public key in the private repo's Deploy keys, 3. Put the private key in this repo's Actions secrets `PRIVATE_SSH_KEY`. (If you use private repo, the `CONFIG_REPO_URL` should use this format: `git@github.com:USERNAME/REPO_NAME.git`)
2. To publish static file to Cloudflare Pages, you should provide secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, and **env** `CLOUDFLARE_PROJECT_NAME`.

## License & trademark

- Code: Released under the [MIT license](https://github.com/ohmykreee/kre3-landing/blob/main/LICENSE).
- Assets & Branding: All Rights Reserved. This includes logos, graphics, and design files which may not be reused or redistributed without permission.
