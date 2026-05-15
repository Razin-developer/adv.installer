import path from 'path';
import fs from 'fs-extra';
import { select, input, Separator } from '@inquirer/prompts';
import chalk from 'chalk';

export async function selectFolder(startPath: string): Promise<string> {
  let current = path.resolve(startPath);

  for (;;) {
    const entries = await fs.readdir(current, { withFileTypes: true }).catch(() => []);
    const dirs = entries
      .filter(e => e.isDirectory() && !e.name.startsWith('.'))
      .sort((a, b) => a.name.localeCompare(b.name));

    const choices = [
      {
        name: chalk.green('✓  Use this folder'),
        value: 'SELECT',
        short: current,
      },
      {
        name: chalk.yellow('↑  Go up one level'),
        value: 'UP',
        short: '..',
      },
      {
        name: chalk.blue('＋  Create new folder here'),
        value: 'NEW',
        short: 'new folder',
      },
      new Separator(chalk.dim('── Subfolders ──')),
      ...dirs.map(d => ({
        name: chalk.dim('📁 ') + d.name,
        value: path.join(current, d.name),
        short: d.name,
      })),
    ];

    if (dirs.length === 0) {
      choices.splice(3, 1); // Remove separator when there are no dirs
    }

    const displayPath = current.replace(/\\/g, '/');
    const choice = await select<string>({
      message: chalk.bold('Current: ') + chalk.dim(displayPath),
      choices,
      pageSize: 12,
    });

    if (choice === 'SELECT') {
      return current;
    }

    if (choice === 'UP') {
      const parent = path.dirname(current);
      if (parent !== current) current = parent;
      continue;
    }

    if (choice === 'NEW') {
      const folderName = await input({
        message: 'Folder name:',
        validate: v => v.trim().length > 0 || 'Name cannot be empty.',
      });
      const newPath = path.join(current, folderName.trim());
      await fs.ensureDir(newPath);
      current = newPath;
      continue;
    }

    // User selected a subdirectory
    current = choice;
  }
}
