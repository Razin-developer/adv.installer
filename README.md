# adv-installer

`adv-installer` is an npm CLI for scaffolding modern projects with presets, add-ons, and sensible defaults.

Install it globally once, then run `adv` anywhere:

```bash
npm install -g adv-installer
adv --version
adv
```

If you want a one-off run without a global install:

```bash
npx adv-installer
```

## Why use it

- One CLI for websites, mobile apps, desktop apps, APIs, full-stack starters, games, and AI projects
- Interactive flow for guided setup, plus quick presets for common stacks
- Optional add-ons like Tailwind CSS, shadcn/ui, Git, README generation, ESLint, and Prettier
- Non-interactive flags for smoke tests and scripted scaffolding
- Standard npm packaging and release flow

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
adv-installer --version
```

## Command behavior

- Global install exposes both `adv` and `adv-installer`.
- `npx adv-installer` works directly and starts the installer without requiring `install`.
- `adv init` is an alias for `adv install`.
- `npm run link:global` makes the local checkout behave like a globally installed package while developing.

## Usage

```bash
adv
```

Explicit command forms also work:

```bash
adv install
adv init
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
adv --help
adv --version
adv install --dry-run
adv install --verbose
adv --quick express --name api --dir ./api --package-manager npm --skip-install --yes
```

If an upstream generator like `create-next-app`, Astro, T3, Expo, or another scaffolder asks follow-up questions, adv leaves that interaction visible in the terminal so you can answer it directly.

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
node dist/index.js --help
```

Link the package globally while developing:

```bash
npm run link:global
adv --version
adv-installer --version
```

Remove that global link later:

```bash
npm run unlink:global
```

## Build and release workflow

### 1. Validate the package

```bash
npm run lint
npm run test
npm run build
npm run check:publish
```

`npm run check:publish` shows exactly which files would be shipped.

### 2. Make sure the package name is available

```bash
npm view adv-installer
```

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

If you publish under a scope and want public access:

```bash
npm publish --access public
```

### 6. Verify the published CLI

From a fresh terminal:

```bash
npm install -g adv-installer
adv --version
adv-installer --help
adv init --quick express --name api --dir ./api --package-manager npm --skip-install --yes
```

One-off `npx` verification:

```bash
npx adv-installer --version
npx adv-installer --quick express --name api --dir ./api --package-manager npm --skip-install --yes
```

## Tailwind and shadcn behavior

- If the selected scaffold already includes Tailwind CSS, adv skips re-adding it.
- For Vite-based starters, adv installs missing Tailwind packages, updates the Vite config, and updates the entry stylesheet.
- For Astro projects, adv uses the official `astro add tailwind` integration command.
- Quick presets that use shadcn/ui default to the essential component set instead of installing every component.

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
| `npm run link:global` | Create a global `adv` command with `npm link` |
| `npm run unlink:global` | Remove the development global link |
| `npm run check:publish` | Lint, test, and dry-run the npm package contents |
| `npm run smoke:package` | Pack the CLI, install it globally, and smoke-test `adv` plus `npx` flows |

## Notes

- `adv --version` works after a global install because the package exposes the `adv` binary through the `bin` field in [package.json](C:/Users/razin/Desktop/Coding/test/package.json).
- `npx adv-installer` works because the package also exposes an `adv-installer` binary and the root command starts the installer directly.
- `npm pack` creates the standard npm tarball if you want to inspect the distributable artifact locally.
- Some upstream scaffolders may still install dependencies even when the CLI requests skip-install mode.

## License

MIT
