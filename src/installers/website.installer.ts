import type { PackageManager, ScaffoldCommand } from '../types/installer.js';

// Returns the scaffold command for the chosen website framework.
// We separate building from running so this can be unit-tested without side effects.
export function buildWebsiteCommand(
  framework: string,
  projectName: string,
  parentDir: string,
  pm: PackageManager,
  installDeps: boolean
): ScaffoldCommand {
  switch (framework) {
    case 'nextjs':
      return buildNextjsCommand(projectName, parentDir, pm, installDeps);
    case 'react-vite':
      return buildViteCommand(projectName, parentDir, pm, 'react-ts');
    case 'vue-vite':
      return buildViteCommand(projectName, parentDir, pm, 'vue-ts');
    case 'nuxt':
      return { cmd: 'npx', args: ['nuxi@latest', 'init', projectName], cwd: parentDir, description: 'Creating Nuxt project' };
    case 'angular':
      return { cmd: 'npx', args: ['@angular/cli', 'new', projectName, '--skip-tests'], cwd: parentDir, description: 'Creating Angular project' };
    case 'sveltekit':
      return { cmd: 'npx', args: ['sv', 'create', projectName], cwd: parentDir, description: 'Creating SvelteKit project' };
    case 'astro':
      return buildAstroCommand(projectName, parentDir, pm);
    case 'remix':
      return { cmd: 'npx', args: ['create-remix@latest', projectName], cwd: parentDir, description: 'Creating Remix project' };
    case 'solidstart':
      return buildSolidCommand(projectName, parentDir, pm);
    default:
      throw new Error(`Unknown website framework: ${framework}`);
  }
}

function buildNextjsCommand(
  projectName: string,
  parentDir: string,
  pm: PackageManager,
  installDeps: boolean
): ScaffoldCommand {
  const pmFlag: Record<PackageManager, string> = {
    pnpm: '--use-pnpm',
    npm: '--use-npm',
    yarn: '--use-yarn',
    bun: '--use-bun',
  };

  const args = pm === 'pnpm'
    ? ['create', 'next-app', projectName, '--typescript', '--tailwind', '--eslint', '--app', '--src-dir', '--import-alias', '@/*', pmFlag[pm]]
    : ['create', 'next-app@latest', projectName, '--typescript', '--tailwind', '--eslint', '--app', '--src-dir', '--import-alias', '@/*', pmFlag[pm]];

  // create-next-app does not have a reliable --skip-install flag across versions.
  // If the user chose not to install deps, we document it here and let the scaffold
  // run its default (which typically installs). The extra install step is skipped later.
  if (!installDeps) {
    args.push('--skip-install');
  }

  return {
    cmd: pm === 'pnpm' ? 'pnpm' : pm === 'yarn' ? 'yarn' : pm === 'bun' ? 'bun' : 'npm',
    args,
    cwd: parentDir,
    description: 'Creating Next.js project',
  };
}

function buildViteCommand(
  projectName: string,
  parentDir: string,
  pm: PackageManager,
  template: string
): ScaffoldCommand {
  // Vite's create command does not auto-install deps, so installDeps is not needed here.
  if (pm === 'npm') {
    return {
      cmd: 'npm',
      args: ['create', 'vite@latest', projectName, '--', '--template', template],
      cwd: parentDir,
      description: 'Creating Vite project',
    };
  }

  return {
    cmd: pm,
    args: ['create', 'vite', projectName, '--template', template],
    cwd: parentDir,
    description: 'Creating Vite project',
  };
}

function buildAstroCommand(
  projectName: string,
  parentDir: string,
  pm: PackageManager
): ScaffoldCommand {
  if (pm === 'npm') {
    return { cmd: 'npm', args: ['create', 'astro@latest', projectName], cwd: parentDir, description: 'Creating Astro project' };
  }
  return { cmd: pm, args: ['create', 'astro@latest', projectName], cwd: parentDir, description: 'Creating Astro project' };
}

function buildSolidCommand(
  projectName: string,
  parentDir: string,
  pm: PackageManager
): ScaffoldCommand {
  if (pm === 'npm') {
    return { cmd: 'npm', args: ['create', 'solid@latest', projectName], cwd: parentDir, description: 'Creating SolidStart project' };
  }
  return { cmd: pm, args: ['create', 'solid@latest', projectName], cwd: parentDir, description: 'Creating SolidStart project' };
}

export function getWebsiteDevCommand(framework: string): string {
  const map: Record<string, string> = {
    nextjs: 'dev',
    'react-vite': 'dev',
    'vue-vite': 'dev',
    nuxt: 'dev',
    angular: 'start',
    sveltekit: 'dev',
    astro: 'dev',
    remix: 'dev',
    solidstart: 'dev',
  };
  return map[framework] ?? 'dev';
}
