import { Command } from 'commander';
import { createRequire } from 'node:module';
import type { PackageManager } from './types/installer.js';
import { runInstallCommand } from './commands/install.command.js';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json') as { version: string };
const PACKAGE_MANAGERS = new Set<PackageManager>(['pnpm', 'npm', 'yarn', 'bun']);

function parsePackageManager(value: string): PackageManager {
  if (!PACKAGE_MANAGERS.has(value as PackageManager)) {
    throw new Error(`Invalid package manager: ${value}. Use one of pnpm, npm, yarn, or bun.`);
  }

  return value as PackageManager;
}

function applySharedInstallOptions(command: Command): Command {
  return command
    .option(
      '-q, --quick <preset>',
      'Skip most prompts and use a preset (nextjs, react, tauri, express, hono, expo, ai-chat)'
    )
    .option('--name <project-name>', 'Set the project name without prompting')
    .option('--dir <path>', 'Set the target directory without prompting')
    .option(
      '--package-manager <pm>',
      'Choose a package manager (pnpm, npm, yarn, bun)',
      parsePackageManager
    )
    .option('--skip-install', 'Do not install dependencies after scaffolding', false)
    .option('-y, --yes', 'Skip the final confirmation prompt', false)
    .option('--dry-run', 'Show what would happen without creating any files', false)
    .option('--verbose', 'Show additional output including commands being run', false)
    .option('--no-color', 'Disable colored output');
}

async function handleInstall(options: {
  quick?: string;
  name?: string;
  dir?: string;
  packageManager?: PackageManager;
  skipInstall?: boolean;
  yes?: boolean;
  dryRun?: boolean;
  verbose?: boolean;
  noColor?: boolean;
}): Promise<void> {
  if (options.noColor) {
    process.env.NO_COLOR = '1';
  }

  await runInstallCommand({
    quick: options.quick,
    projectName: options.name,
    targetDir: options.dir,
    packageManager: options.packageManager,
    installDeps: options.skipInstall ? false : undefined,
    confirm: options.yes ? false : undefined,
    dryRun: options.dryRun ?? false,
    verbose: options.verbose ?? false,
  });
}

export function createCli(): Command {
  const program = new Command();

  program
    .name('adv')
    .description('Advanced project initializer')
    .version(packageJson.version, '-v, --version', 'Print the version')
    .showHelpAfterError();

  applySharedInstallOptions(
    program.command('install').alias('init').description('Initialize a new project')
  ).action(handleInstall);

  program.addHelpText('after', `
Examples:
  adv                                 Start the interactive setup
  adv install                         Run the installer explicitly
  adv init                            Alias for install
  npx adv-installer                   Run the installer without a global install
  adv install --quick nextjs          Quick Next.js + Tailwind + shadcn setup
  adv --quick express --name api      Non-interactive Express scaffold
  adv install --quick react           Quick React + Vite + Tailwind setup
  adv install --quick express         Quick Express + TypeScript API
  adv install --dry-run               Preview what would be created
  adv install --verbose               Show all commands being run
  `);

  return program;
}
