import { select, Separator } from '@inquirer/prompts';
import chalk from 'chalk';
import type { ProjectType } from '../types/installer.js';
import { PROJECT_TYPES } from '../config/project-types.js';

export async function askProjectType(): Promise<ProjectType> {
  return select<ProjectType>({
    message: chalk.bold('What do you want to build?'),
    choices: [
      new Separator(chalk.dim('── Applications ──')),
      ...PROJECT_TYPES.slice(0, 5).map(t => ({
        name: t.name + chalk.dim('  ' + t.description),
        value: t.value,
        short: t.name,
      })),
      new Separator(chalk.dim('── Specialized ──')),
      ...PROJECT_TYPES.slice(5).map(t => ({
        name: t.name + chalk.dim('  ' + t.description),
        value: t.value,
        short: t.name,
      })),
    ],
  });
}
