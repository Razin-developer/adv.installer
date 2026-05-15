import path from 'node:path';
import fs from 'fs-extra';
import type { PackageManager } from '../types/installer.js';
import { runCommand } from '../utils/run-command.js';
import { hasPackageDependency } from '../utils/project-state.js';

interface RunOpts {
  dryRun?: boolean;
  verbose?: boolean;
}

export interface TailwindSetupResult {
  status: 'configured' | 'already-configured' | 'skipped';
  detail: string;
}

export async function installTailwind(
  projectDir: string,
  framework: string,
  pm: PackageManager,
  opts: RunOpts = {}
): Promise<TailwindSetupResult> {
  const alreadyConfigured = await isTailwindConfigured(projectDir, framework);
  if (alreadyConfigured) {
    return {
      status: 'already-configured',
      detail: 'Tailwind CSS is already configured for this project.',
    };
  }

  switch (framework) {
    case 'nextjs':
    case 'nextjs-ai-chat':
    case 'nuxt':
    case 'sveltekit':
    case 'remix':
    case 'solidstart':
      return {
        status: 'already-configured',
        detail: `The ${framework} scaffold already sets up Tailwind CSS.`,
      };
    case 'react-vite':
    case 'vue-vite':
      await ensureViteTailwind(projectDir, pm, opts);
      return {
        status: 'configured',
        detail: 'Installed Tailwind CSS and updated the Vite config and entry stylesheet.',
      };
    case 'astro':
      await runCommand('npx', ['astro', 'add', 'tailwind', '--yes'], {
        cwd: projectDir,
        ...opts,
        stdio: 'inherit',
      });
      return {
        status: 'configured',
        detail: 'Installed the official Astro Tailwind integration.',
      };
    default:
      return {
        status: 'skipped',
        detail: `Automatic Tailwind setup is not implemented yet for ${framework}.`,
      };
  }
}

export async function installDaisyUI(
  projectDir: string,
  pm: PackageManager,
  opts: RunOpts = {}
): Promise<void> {
  const alreadyInstalled = await hasPackageDependency(projectDir, 'daisyui');
  if (alreadyInstalled) {
    return;
  }

  const installArgs =
    pm === 'yarn'
      ? ['add', '--dev', 'daisyui@latest']
      : ['install', '--save-dev', 'daisyui@latest'];

  await runCommand(pm, installArgs, { cwd: projectDir, ...opts, stdio: 'pipe' });
}

async function ensureViteTailwind(
  projectDir: string,
  pm: PackageManager,
  opts: RunOpts
): Promise<void> {
  const missingPackages: string[] = [];

  if (!(await hasPackageDependency(projectDir, 'tailwindcss'))) {
    missingPackages.push('tailwindcss');
  }

  if (!(await hasPackageDependency(projectDir, '@tailwindcss/vite'))) {
    missingPackages.push('@tailwindcss/vite');
  }

  if (missingPackages.length > 0) {
    const installArgs =
      pm === 'yarn'
        ? ['add', '--dev', ...missingPackages]
        : ['install', '--save-dev', ...missingPackages];

    await runCommand(pm, installArgs, { cwd: projectDir, ...opts, stdio: 'pipe' });
  }

  await ensureViteConfigUsesTailwind(projectDir);
  await ensureEntryCssImportsTailwind(projectDir);
}

async function isTailwindConfigured(projectDir: string, framework: string): Promise<boolean> {
  const hasTailwindPackage = await hasPackageDependency(projectDir, 'tailwindcss');

  if (framework === 'react-vite' || framework === 'vue-vite') {
    return (
      hasTailwindPackage &&
      (await hasPackageDependency(projectDir, '@tailwindcss/vite')) &&
      (await viteConfigHasTailwindPlugin(projectDir)) &&
      (await entryCssHasTailwindImport(projectDir))
    );
  }

  if (framework === 'astro') {
    return hasTailwindPackage;
  }

  return hasTailwindPackage;
}

async function viteConfigHasTailwindPlugin(projectDir: string): Promise<boolean> {
  const viteConfigPath = await findFirstExisting(projectDir, [
    'vite.config.ts',
    'vite.config.js',
    'vite.config.mjs',
  ]);

  if (!viteConfigPath) {
    return false;
  }

  const content = await fs.readFile(viteConfigPath, 'utf8');
  return (
    content.includes("@tailwindcss/vite") &&
    (content.includes('tailwindcss()') || content.includes('tailwindcss(),'))
  );
}

async function entryCssHasTailwindImport(projectDir: string): Promise<boolean> {
  const cssPath = await findFirstExisting(projectDir, [
    'src/index.css',
    'src/style.css',
    'src/app.css',
    'src/global.css',
  ]);

  if (!cssPath) {
    return false;
  }

  const content = await fs.readFile(cssPath, 'utf8');
  return content.includes('@import "tailwindcss";');
}

async function ensureViteConfigUsesTailwind(projectDir: string): Promise<void> {
  const viteConfigPath = await findFirstExisting(projectDir, [
    'vite.config.ts',
    'vite.config.js',
    'vite.config.mjs',
  ]);

  if (!viteConfigPath) {
    throw new Error('Could not find a Vite config file to update for Tailwind CSS.');
  }

  let content = await fs.readFile(viteConfigPath, 'utf8');

  if (!content.includes("@tailwindcss/vite")) {
    if (!content.includes("from 'vite'") && !content.includes('from "vite"')) {
      throw new Error('The Vite config file has an unexpected shape.');
    }

    content = `import tailwindcss from '@tailwindcss/vite';\n${content}`;
  }

  if (!content.includes('tailwindcss()')) {
    content = addPluginToViteConfig(content, 'tailwindcss()');
  }

  await fs.writeFile(viteConfigPath, content);
}

function addPluginToViteConfig(content: string, pluginCall: string): string {
  const pluginArrayMatch = content.match(/plugins\s*:\s*\[([\s\S]*?)\]/m);

  if (pluginArrayMatch) {
    const existingPlugins = pluginArrayMatch[1].trim();
    const nextPlugins = existingPlugins ? `${existingPlugins}, ${pluginCall}` : pluginCall;
    return content.replace(pluginArrayMatch[0], `plugins: [${nextPlugins}]`);
  }

  const defineConfigMatch = content.match(/defineConfig\s*\(\s*\{/m);
  if (!defineConfigMatch || defineConfigMatch.index === undefined) {
    throw new Error('Could not add the Tailwind Vite plugin to the Vite config file.');
  }

  const insertAt = defineConfigMatch.index + defineConfigMatch[0].length;
  return `${content.slice(0, insertAt)}\n  plugins: [${pluginCall}],${content.slice(insertAt)}`;
}

async function ensureEntryCssImportsTailwind(projectDir: string): Promise<void> {
  const cssPath = await findFirstExisting(projectDir, [
    'src/index.css',
    'src/style.css',
    'src/app.css',
    'src/global.css',
  ]);

  if (!cssPath) {
    throw new Error('Could not find a CSS entry file to add Tailwind CSS to.');
  }

  const content = await fs.readFile(cssPath, 'utf8');

  if (content.includes('@import "tailwindcss";')) {
    return;
  }

  const nextContent = content.trimStart().startsWith('@charset')
    ? content.replace(/(@charset\s+[^;]+;\s*)/m, `$1@import "tailwindcss";\n`)
    : `@import "tailwindcss";\n\n${content}`;

  await fs.writeFile(cssPath, nextContent);
}

async function findFirstExisting(projectDir: string, relativePaths: string[]): Promise<string | null> {
  for (const relativePath of relativePaths) {
    const fullPath = path.join(projectDir, relativePath);
    if (await fs.pathExists(fullPath)) {
      return fullPath;
    }
  }

  return null;
}
