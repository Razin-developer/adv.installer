import chalk from 'chalk';
import type { InstallOptions } from '../types/installer.js';
import { toDisplayPath } from './paths.js';

function drawBox(lines: string[], width = 50): string {
  const pad = (s: string, w: number) => s + ' '.repeat(Math.max(0, w - visibleLength(s)));
  const top = chalk.dim('╭' + '─'.repeat(width + 2) + '╮');
  const bottom = chalk.dim('╰' + '─'.repeat(width + 2) + '╯');
  const middle = lines.map(line => chalk.dim('│') + ' ' + pad(line, width) + ' ' + chalk.dim('│'));
  return [top, ...middle, bottom].join('\n');
}

// Returns the visible length of a string after stripping ANSI escape codes
function visibleLength(str: string): number {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1B\[[0-9;]*m/g, '').length;
}

export function showWelcome(): void {
  console.log('');
  console.log(
    drawBox(
      [
        '',
        chalk.bold.cyan('        adv.installer        '),
        chalk.dim('  Advanced Project Initializer  '),
        '',
        chalk.dim('  "Start modern projects       '),
        chalk.dim('       beautifully."          '),
        '',
      ],
      34
    )
  );
  console.log('');
}

export function showSummary(options: InstallOptions): void {
  const check = chalk.green('✓');
  const cross = chalk.dim('✗');

  const rows: Array<[string, string]> = [
    ['Type', options.projectType],
    ['Framework', options.framework],
    ['Name', chalk.bold(options.projectName)],
    ['Path', chalk.dim(toDisplayPath(options.targetDir))],
    ['Package manager', options.packageManager],
    ['Install deps', options.installDeps ? chalk.green('Yes') : chalk.dim('No')],
    ['Tailwind', options.tailwind ? chalk.green('Yes') : chalk.dim('No')],
    ['UI library', options.uiLibrary === 'none' ? chalk.dim('None') : options.uiLibrary],
  ];

  if (options.addons.length > 0) {
    rows.push(['Add-ons', options.addons.join(', ')]);
  }

  const labelWidth = 16;
  const lines = [
    chalk.bold('  Project Summary'),
    '',
    ...rows.map(([label, value]) => {
      const padded = (label + ':').padEnd(labelWidth);
      return chalk.dim(padded) + value;
    }),
  ];

  console.log('');
  console.log(drawBox(lines, 50));
  console.log('');
}

export function showSuccess(projectName: string, targetDir: string, nextSteps: string[]): void {
  console.log('');
  console.log(chalk.bold.green('  ✓ Project created successfully!'));
  console.log('');
  console.log(chalk.dim('  Path: ') + toDisplayPath(targetDir));
  console.log('');

  if (nextSteps.length > 0) {
    console.log(chalk.bold('  Next steps:'));
    console.log('');
    for (const step of nextSteps) {
      console.log(chalk.cyan('    $') + '  ' + step);
    }
  }

  console.log('');
  console.log(chalk.dim(`  Happy coding, ${projectName}!`));
  console.log('');
}

export function showCancelled(): void {
  console.log('');
  console.log(chalk.dim('  Cancelled.'));
  console.log('');
}

export function showError(message: string, step?: string, command?: string): void {
  console.log('');
  console.log(chalk.red.bold('  Something went wrong.'));
  console.log('');
  console.log(chalk.red('  ' + message));

  if (step) {
    console.log(chalk.dim('  Step: ') + step);
  }
  if (command) {
    console.log(chalk.dim('  Command: ') + command);
  }

  console.log('');
}
