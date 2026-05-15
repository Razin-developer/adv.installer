# adv-installer

`adv-installer` is a globally installable npm CLI for scaffolding modern projects without having to remember every framework-specific setup command.

Install it globally once, then run `adv` anywhere:

```bash
npm install -g adv-installer
adv --version
adv install
```

## Why use it

- One command for websites, mobile apps, desktop apps, APIs, full-stack projects, games, and AI starters
- Guided interactive flow with sensible defaults
- Quick presets for common stacks
- Optional add-ons like Tailwind CSS, shadcn/ui, Git, README, ESLint, and Prettier
- Dry-run mode to preview changes before creating anything

## Install

Requires Node.js `18+`.

```bash
# npm
npm install -g adv-installer

# pnpm
pnpm add -g adv-installer

# yarn
yarn global add adv-installer

# bun
bun add -g adv-installer
```

Verify from any terminal:

```bash
adv --version
```

If you do not want a permanent global install, you can also run it with:

```bash
npx adv-installer install
```

## npm command behavior

- Global install exposes the `adv` command everywhere through the package `bin` field.
- `adv --version` always reflects the installed package version.
- `npx adv-installer install` works for one-off runs without keeping the CLI globally installed.
- `npm run link:global` makes the local checkout behave like a globally installed package while developing.

## Usage

```bash
adv install
```

Quick presets:

```bash
adv install --quick nextjs
adv install --quick react
adv install --quick tauri
adv install --quick express
adv install --quick hono
adv install --quick expo
adv install --quick ai-chat
```

Useful flags:

```bash
adv install --dry-run
adv install --verbose
adv --help
```

If an upstream generator like `create-next-app`, Astro, T3, Expo, or another scaffolder asks its own follow-up questions, adv now leaves that interaction visible in the terminal so you can answer it directly instead of hiding it behind a spinner.

## What the CLI can scaffold

| Type | Frameworks / Presets |
|------|----------------------|
| Website | Next.js, React + Vite, Vue + Vite, Nuxt, Angular, SvelteKit, Astro, Remix, SolidStart |
| Mobile | Expo, React Native CLI, Flutter, Kotlin Android |
| Desktop | Tauri + React, Tauri + Vue, Tauri + Svelte, Electron + React, Neutralino |
| Backend API | Express, Hono, Fastify, NestJS, Flask, Django |
| Full Stack | Next.js SaaS, T3 Stack, MERN, Nuxt Full Stack, SvelteKit Full Stack |
| Game Dev | Phaser, Three.js, Kaboom, Godot, Unity |
| AI Projects | Next.js AI Chat, Flask AI API, Computer Vision, Ollama, LangChain |

## Local development

```bash
npm install
npm run dev
```

Build the published CLI output:

```bash
npm run build
```

Test the built command directly:

```bash
node dist/index.js --version
node dist/index.js install --dry-run
```

Link the package globally on your machine while developing:

```bash
npm run link:global
adv --version
```

Remove the global link later if needed:

```bash
npm unlink -g adv-installer
```

## Build and release workflow

Use this flow when you want to publish the package to npm.

### 1. Validate the package

```bash
npm run lint
npm run test
npm run build
npm run check:publish
```

`npm run check:publish` shows exactly which files would be shipped.

### 2. Make sure the package name is available

Check whether `adv-installer` is available on npm:

```bash
npm view adv-installer
```

If that name is already taken, update the `name` field in [package.json](C:/Users/razin/Desktop/Coding/test/package.json) before publishing.

### 3. Sign in to npm

```bash
npm login
```

### 4. Bump the version

```bash
npm version patch
# or
npm version minor
# or
npm version major
```

### 5. Publish

```bash
npm publish
```

If you are publishing under an npm scope and want public access:

```bash
npm publish --access public
```

### 6. Verify the published CLI

From a fresh terminal:

```bash
npm install -g adv-installer
adv --version
```

## Tailwind behavior

- If the selected scaffold already includes Tailwind CSS, adv skips re-adding it.
- For Vite-based starters, adv installs any missing Tailwind packages and also updates the project files needed to make Tailwind actually work.
- That includes editing the Vite config to register `@tailwindcss/vite` and updating the entry stylesheet to import Tailwind.
- For Astro projects, adv uses the official `astro add tailwind` integration command.

## Website docs

The marketing site lives in [web](/C:/Users/razin/Desktop/Coding/test/web).

Run it locally:

```bash
cd web
npm install
npm run dev
```

Build it for production:

```bash
cd web
npm run build
```

## Project scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Run the CLI from TypeScript source |
| `npm run build` | Compile the CLI to `dist/` |
| `npm run lint` | Lint `src/` and `tests/` |
| `npm run test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run format` | Format source and tests with Prettier |
| `npm run link:global` | Create a global `adv` command on your machine with `npm link` |
| `npm run check:publish` | Lint, test, and dry-run the npm package contents |

## Notes

- `adv --version` works everywhere after a global npm install because the package exposes the `adv` binary through the `bin` field in [package.json](C:/Users/razin/Desktop/Coding/test/package.json).
- `npm pack` creates the standard npm tarball if you want to inspect the distributable artifact locally. This project no longer relies on a custom ZIP output flow.
- Some upstream scaffolders may still install dependencies even when the CLI requests a skip-install mode.

## License

MIT
