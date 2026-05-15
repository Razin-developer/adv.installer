import { select } from '@inquirer/prompts';
import chalk from 'chalk';

export async function askInstallDeps(): Promise<boolean> {
  const answer = await select<'yes' | 'no'>({
    message: chalk.bold('Install dependencies now?'),
    choices: [
      { name: 'Yes  ' + chalk.dim('install right away'), value: 'yes', short: 'Yes' },
      { name: 'No   ' + chalk.dim('I will install later'), value: 'no', short: 'No' },
    ],
  });
  return answer === 'yes';
}
