# adv-installer

`adv-installer` is a straightforward npm CLI tool that helps you create new projects more quickly.

Instead of trying to remember various commands for different frameworks, you can use one command called `adv`. It will help you start websites, APIs, mobile apps, desktop apps, games, full-stack projects, and AI projects.

## Install

You need **Node.js 18 or newer**.

Install it globally once:

```bash
npm install -g adv-installer
```

After installing, you can check if it works:

```bash
adv --version
adv
```

You can also use the full command name:

```bash
adv-installer --version
```

If you do not want to install it globally, you can run it one time using:

```bash
npx adv-installer
```

## Why I made this

When I start a new project, I often have to look for the correct setup command repeatedly.

For example:

- Next.js has one command
- Vite has another command
- Expo has another command
- Express needs a different setup
- AI projects need extra packages
- Tailwind and shadcn also need setup

I created `adv-installer` to keep all these common starters in one CLI.

The goal is simple:

> Choose what you want to build, answer a few questions, and start coding faster.

## What it can do

`adv-installer` can help set up projects like:

| Type        | Presets                                                                               |
| ----------- | ------------------------------------------------------------------------------------- |
| Website     | Next.js, React + Vite, Vue + Vite, Nuxt, Angular, SvelteKit, Astro, Remix, SolidStart |
| Mobile      | Expo, React Native CLI, Flutter, Kotlin Android                                       |
| Desktop     | Tauri + React, Tauri + Vue, Tauri + Svelte, Electron + React, Neutralino              |
| Backend API | Express, Hono, Fastify, NestJS, Flask, Django                                         |
| Full Stack  | Next.js SaaS, T3 Stack, MERN, Nuxt Full Stack, SvelteKit Full Stack                   |
| Game Dev    | Phaser, Three.js, Kaboom, Godot, Unity                                                |
| AI Projects | Next.js AI Chat, Flask AI API, Computer Vision, Ollama, LangChain                     |

## Basic usage

Run the CLI:

```bash
adv
```

You can also use:

```bash
adv install
adv init
```

Both options are supported.

## Quick presets

If you already know what you want, you can use quick commands:

```bash
adv install --quick nextjs
adv install --quick react
adv install --quick tauri
adv install --quick express
adv install --quick hono
adv install --quick expo
adv install --quick ai-chat
```

Example:

```bash
adv install --quick express
```

This will start an Express project setup.

## Useful commands

Show help:

```bash
adv --help
```

Check version:

```bash
adv --version
```

Run without actually creating the project:

```bash
adv install --dry-run
```

Show more details while running:

```bash
adv install --verbose
```

Example with flags:

```bash
adv --quick express --name api --dir ./api --package-manager npm --skip-install --yes
```

This creates an Express project called `api` inside the `./api` folder.

## Add-ons

Depending on the project, `adv-installer` can help with add-ons like:

- Tailwind CSS
- shadcn/ui
- Git setup
- README generation
- ESLint
- Prettier

It tries not to add the same thing twice.

For example, if the project already has Tailwind CSS, it will skip adding it again.

## Tailwind and shadcn

Tailwind behavior depends on the project type.

For Vite projects, the CLI can install missing Tailwind packages and update the necessary files.

For Astro projects, it uses the official Astro Tailwind setup command.

For shadcn/ui, quick presets only install the important components by default instead of adding everything.

## Upstream scaffolders

Some frameworks have their own setup tools.

For example:

- `create-next-app`
- Expo setup tools
- Astro setup tools
- T3 setup tools

If one of these tools asks more questions, `adv-installer` shows them in your terminal so you can answer normally.

## Local development

Clone the project, then install dependencies:

```bash
npm install
```

Run the CLI in development mode:

```bash
npm run dev
```

Build the CLI:

```bash
npm run build
```

Test the built output:

```bash
node dist/index.js --version
node dist/index.js --help
```

## Link locally

During development, you can link the package globally:

```bash
npm run link:global
```

Then test:

```bash
adv --version
adv-installer --version
```

To remove the global link:

```bash
npm run unlink:global
```

## Before publishing

Run these commands before publishing:

```bash
npm run lint
npm run test
npm run build
npm run check:publish
```

`check:publish` helps you see what files will be included in the npm package.

You can also check the package name:

```bash
npm view adv-installer
```

## Publish to npm

Log in to npm:

```bash
npm login
```

Bump the version:

```bash
npm version patch
```

Or use:

```bash
npm version minor
npm version major
```

Publish:

```bash
npm publish
```

If publishing under a scope and it should be public:

```bash
npm publish --access public
```

## After publishing

Open a new terminal and test the published CLI:

```bash
npm install -g adv-installer
adv --version
adv-installer --help
```

Try creating a test project:

```bash
adv init --quick express --name api --dir ./api --package-manager npm --skip-install --yes
```

You can also test with `npx`:

```bash
npx adv-installer --version
npx adv-installer --quick express --name api --dir ./api --package-manager npm --skip-install --yes
```

## Website docs

The website for this project is inside the `web` folder.

Run it locally:

```bash
cd web
npm install
npm run dev
```

Build it:

```bash
cd web
npm run build
```

## Scripts

| Script                  | What it does                                    |
| ----------------------- | ----------------------------------------------- |
| `npm run dev`           | Runs the CLI from the TypeScript source         |
| `npm run build`         | Builds the CLI into the `dist` folder           |
| `npm run lint`          | Checks the source and test files                |
| `npm run test`          | Runs tests once                                 |
| `npm run test:watch`    | Runs tests in watch mode                        |
| `npm run format`        | Formats the code using Prettier                 |
| `npm run link:global`   | Links the local CLI globally                    |
| `npm run unlink:global` | Removes the local global link                   |
| `npm run check:publish` | Checks the package before publishing            |
| `npm run smoke:package` | Packs and tests the CLI like a real npm package |

## Notes

- A global install makes both `adv` and `adv-installer` commands available.
- `npx adv-installer` runs the CLI without needing a global install.
- `adv init` and `adv install` both work.
- Some framework setup tools may still install dependencies even when skipping the install is requested.
- `npm pack` can be used if you want to check the package file before publishing.

## License

MIT
