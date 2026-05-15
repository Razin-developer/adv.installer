import path from 'path';
import { select, input } from '@inquirer/prompts';
import chalk from 'chalk';
import { selectFolder } from './folder-selector.js';

type DirectoryOption = 'current' | 'browse' | 'custom';

export async function askDirectory(projectName: string): Promise<string> {
  const cwd = process.cwd();
  const defaultPath = path.join(cwd, projectName);
  const displayDefault = `./${projectName}`;

  const choice = await select<DirectoryOption>({
    message: chalk.bold('Where should the project be created?'),
    choices: [
      {
        name: `Inside current directory  ${chalk.dim(displayDefault)}`,
        value: 'current',
        short: displayDefault,
      },
      {
        name: 'Browse and choose a folder',
        value: 'browse',
        short: 'browse',
      },
      {
        name: 'Type a custom path',
        value: 'custom',
        short: 'custom',
      },
    ],
  });

  if (choice === 'current') {
    return defaultPath;
  }

  if (choice === 'browse') {
    const parentDir = await selectFolder(cwd);
    return path.join(parentDir, projectName);
  }

  // custom
  const typed = await input({
    message: chalk.bold('Path:'),
    default: defaultPath,
    validate: v => v.trim().length > 0 || 'Path cannot be empty.',
  });

  return path.resolve(typed.trim());
}
