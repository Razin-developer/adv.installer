import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import type { PackageManager } from '../types/installer.js';
import { detectPackageManager } from '../utils/package-manager.js';

export async function askPackageManager(cwd: string): Promise<PackageManager> {
  const detected = await detectPackageManager(cwd);

  const hint = (pm: PackageManager) =>
    detected === pm ? chalk.dim(' (detected)') : '';

  return select<PackageManager>({
    message: chalk.bold('Package manager:'),
    default: detected ?? 'pnpm',
    choices: [
      { name: 'pnpm' + hint('pnpm'), value: 'pnpm', short: 'pnpm' },
      { name: 'npm' + hint('npm'), value: 'npm', short: 'npm' },
      { name: 'yarn' + hint('yarn'), value: 'yarn', short: 'yarn' },
      { name: 'bun' + hint('bun'), value: 'bun', short: 'bun' },
    ],
  });
}
