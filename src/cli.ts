import { Command } from 'commander';
import { createRequire } from 'node:module';
import { runInstallCommand } from './commands/install.command.js';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json') as { version: string };

export function createCli(): Command {
  const program = new Command();

  program
    .name('adv')
    .description('Advanced project initializer')
    .version(packageJson.version, '-v, --version', 'Print the version');

  program
    .command('install')
    .description('Initialize a new project interactively')
    .option('-q, --quick <preset>', 'Skip most prompts and use a preset (nextjs, react, tauri, express, hono, expo, ai-chat)')
    .option('--dry-run', 'Show what would happen without creating any files', false)
    .option('--verbose', 'Show additional output including commands being run', false)
    .option('--no-color', 'Disable colored output')
    .action(async options => {
      if (options.noColor) {
        process.env.NO_COLOR = '1';
      }

      await runInstallCommand({
        quick: options.quick,
        dryRun: options.dryRun,
        verbose: options.verbose,
      });
    });

  // Make `adv` with no subcommand show help
  program.addHelpText('afterAll', `
Examples:
  adv install                         Start the interactive setup
  adv install --quick nextjs          Quick Next.js + Tailwind + shadcn setup
  adv install --quick react           Quick React + Vite + Tailwind setup
  adv install --quick express         Quick Express + TypeScript API
  adv install --dry-run               Preview what would be created
  adv install --verbose               Show all commands being run
  `);

  return program;
}
