# adv-installer

`adv-installer` is an npm CLI tool for setting up modern projects with presets, add-ons, and smart defaults.

You only need to install it globally once. After that, you can run `adv` anywhere:

```bash
npm install -g adv-installer
adv --version
adv
```

If you prefer to run it once without a global install:

```bash
npx adv-installer
```

## Why use it

- One CLI for websites, mobile apps, desktop apps, APIs, full-stack starters, games, and AI projects.
- Interactive setup for guided installation, plus quick presets for common stacks.
- Optional add-ons such as Tailwind CSS, shadcn/ui, Git, README generation, ESLint, and Prettier.
- Non-interactive flags for smoke tests and automated setup.
- Standard npm packaging and release flow.

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

Check the installation from any terminal:

```bash
adv --version
adv-installer --version
```

## Command behavior

- A global install makes both `adv` and `adv-installer` available.
- `npx adv-installer` works right away and starts the installer without needing `install`.
- `adv init` is another way to say `adv install`.
- `npm run link:global` allows the local checkout to act like a globally installed package during development.

## Usage

```bash
adv
```

You can also use explicit command forms:

```bash
adv install
adv init
```

Quick presets are available:

```bash
adv install --quick nextjs
adv install --quick react
adv install --quick tauri
adv install --quick express
adv install --quick hono
adv install --quick expo
adv install --quick ai-chat
```

Useful flags you can use:

```bash
adv --help
adv --version
adv install --dry-run
adv install --verbose
adv --quick express --name api --dir ./api --package-manager npm --skip-install --yes
```

If an upstream generator like `create-next-app`, Astro, T3, Expo, or any other scaffolder asks follow-up questions, adv keeps that interaction visible in the terminal so you can respond directly.

## What the CLI can scaffold

| Type        | Frameworks / Presets                                                                  |
| ----------- | ------------------------------------------------------------------------------------- |
| Website     | Next.js, React + Vite, Vue + Vite, Nuxt, Angular, SvelteKit, Astro, Remix, SolidStart |
| Mobile      | Expo, React Native CLI, Flutter, Kotlin Android                                       |
| Desktop     | Tauri + React, Tauri + Vue, Tauri + Svelte, Electron + React, Neutralino              |
| Backend API | Express, Hono, Fastify, NestJS, Flask, Django                                         |
| Full Stack  | Next.js SaaS, T3 Stack, MERN, Nuxt Full Stack, SvelteKit Full Stack                   |
| Game Dev    | Phaser, Three.js, Kaboom, Godot, Unity                                                |
| AI Projects | Next.js AI Chat, Flask AI API, Computer Vision, Ollama, LangChain                     |

## Local development

```bash
npm install
npm run dev
```

Build the CLI output that will be published:

```bash
npm run build
```

Test the built command directly:

```bash
node dist/index.js --version
node dist/index.js --help
```

Link the package globally while you develop:

```bash
npm run link:global
adv --version
adv-installer --version
```

You can remove that global link later:

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

`npm run check:publish` shows exactly which files will be published.

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

Open a fresh terminal and run:

```bash
npm install -g adv-installer
adv --version
adv-installer --help
adv init --quick express --name api --dir ./api --package-manager npm --skip-install --yes
```

For one-off `npx` verification:

```bash
npx adv-installer --version
npx adv-installer --quick express --name api --dir ./api --package-manager npm --skip-install --yes
```

## Tailwind and shadcn behavior

- If the chosen scaffold already has Tailwind CSS, adv skips adding it again.
- For Vite-based starters, adv installs any missing Tailwind packages, updates the Vite config, and modifies the entry stylesheet.
- For Astro projects, adv uses the official `astro add tailwind` integration command.
- Quick presets that involve shadcn/ui default to the essential component set instead of installing all available components.

## Website docs

The marketing site is located in [web](/C:/Users/razin/Desktop/Coding/test/web).

To run it locally:

```bash
cd web
npm install
npm run dev
```

To build it for production:

```bash
cd web
npm run build
```

## Project scripts

| Script                  | Purpose                                                            |
| ----------------------- | ------------------------------------------------------------------ |
| `npm run dev`           | Run the CLI from TypeScript source                                 |
| `npm run build`         | Compile the CLI to `dist/`                                         |
| `npm run lint`          | Lint `src/` and `tests/`                                           |
| `npm run test`          | Run Vitest once                                                    |
| `npm run test:watch`    | Run Vitest in watch mode                                           |
| `npm run format`        | Format source and tests with Prettier                              |
| `npm run link:global`   | Create a global `adv` command using `npm link`                     |
| `npm run unlink:global` | Remove the development global link                                 |
| `npm run check:publish` | Lint, test, and prepare the npm package contents                   |
| `npm run smoke:package` | Pack the CLI, install it globally, and test `adv` plus `npx` flows |

## Notes

- `adv --version` works after a global install because the package exposes the `adv` binary through the `bin` field in [package.json](C:/Users/razin/Desktop/Coding/test/package.json).
- `npx adv-installer` works as the package also exposes an `adv-installer` binary. The root command starts the installer directly.
- `npm pack` creates a standard npm tarball if you want to check the distributable artifact locally.
- Some upstream scaffolders may still install dependencies even if the CLI requests to skip installation.

## License

MIT
