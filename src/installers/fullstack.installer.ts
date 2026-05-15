import type { PackageManager, ScaffoldCommand } from '../types/installer.js';

export function buildFullstackCommand(
  framework: string,
  projectName: string,
  parentDir: string,
  pm: PackageManager
): ScaffoldCommand {
  switch (framework) {
    case 'nextjs-saas':
    case 'nextjs':
      return buildNextjsSaasCommand(projectName, parentDir, pm);
    case 't3':
      return buildT3Command(projectName, parentDir, pm);
    case 'nuxt-fullstack':
      return {
        cmd: 'npx',
        args: ['nuxi@latest', 'init', projectName],
        cwd: parentDir,
        description: 'Creating Nuxt full stack project',
        interactive: true,
      };
    case 'sveltekit-fullstack':
      return {
        cmd: 'npx',
        args: ['sv', 'create', projectName],
        cwd: parentDir,
        description: 'Creating SvelteKit full stack project',
        interactive: true,
      };
    case 'mern':
    case 'nextjs-express':
      // These compound stacks don't have a single official scaffolder.
      // We fall back to the Next.js scaffolder for the frontend.
      return buildNextjsSaasCommand(projectName, parentDir, pm);
    default:
      throw new Error(`Unknown fullstack preset: ${framework}`);
  }
}

function buildNextjsSaasCommand(
  projectName: string,
  parentDir: string,
  pm: PackageManager
): ScaffoldCommand {
  const pmFlag: Record<PackageManager, string> = {
    pnpm: '--use-pnpm',
    npm: '--use-npm',
    yarn: '--use-yarn',
    bun: '--use-bun',
  };
  const base = pm === 'pnpm' ? 'pnpm' : pm === 'yarn' ? 'yarn' : pm === 'bun' ? 'bun' : 'npm';
  const createArg = pm === 'pnpm' ? 'next-app' : 'next-app@latest';

  return {
    cmd: base,
    args: ['create', createArg, projectName, '--typescript', '--tailwind', '--eslint', '--app', pmFlag[pm]],
    cwd: parentDir,
    description: 'Creating Next.js SaaS starter',
    interactive: true,
  };
}

function buildT3Command(
  projectName: string,
  parentDir: string,
  pm: PackageManager
): ScaffoldCommand {
  if (pm === 'npm') {
    return {
      cmd: 'npm',
      args: ['create', 't3-app@latest', projectName],
      cwd: parentDir,
      description: 'Creating T3 app',
      interactive: true,
    };
  }
  return {
    cmd: pm,
    args: ['create', 't3-app@latest', projectName],
    cwd: parentDir,
    description: 'Creating T3 app',
    interactive: true,
  };
}
