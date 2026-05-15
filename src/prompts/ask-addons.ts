import { select, checkbox, Separator } from '@inquirer/prompts';
import chalk from 'chalk';
import type { UILibrary, ShadcnComponentChoice, AddonKey } from '../types/installer.js';
import { ALL_COMPONENTS } from '../config/shadcn-components.js';

export async function askTailwind(): Promise<boolean> {
  const answer = await select<'yes' | 'no'>({
    message: chalk.bold('Add Tailwind CSS?'),
    choices: [
      { name: 'Yes', value: 'yes', short: 'Yes' },
      { name: 'No', value: 'no', short: 'No' },
    ],
  });
  return answer === 'yes';
}

export async function askUiLibrary(tailwindEnabled: boolean): Promise<UILibrary> {
  if (!tailwindEnabled) return 'none';

  return select<UILibrary>({
    message: chalk.bold('Add a UI library?'),
    choices: [
      { name: 'shadcn/ui', value: 'shadcn', short: 'shadcn/ui' },
      { name: 'DaisyUI', value: 'daisyui', short: 'DaisyUI' },
      { name: 'None', value: 'none', short: 'None' },
    ],
  });
}

export async function askShadcnComponents(): Promise<{
  choice: ShadcnComponentChoice;
  manual?: string[];
}> {
  const choice = await select<ShadcnComponentChoice>({
    message: chalk.bold('Which shadcn/ui components?'),
    choices: [
      {
        name: 'Essential components  ' + chalk.dim('button, card, input, dialog, and more'),
        value: 'essential',
        short: 'Essential',
      },
      {
        name: 'All supported components  ' + chalk.dim(`${ALL_COMPONENTS.length} components`),
        value: 'all',
        short: 'All',
      },
      {
        name: 'Choose manually',
        value: 'manual',
        short: 'Manual',
      },
      {
        name: 'Skip component install',
        value: 'skip',
        short: 'Skip',
      },
    ],
  });

  if (choice === 'manual') {
    const selected = await checkbox<string>({
      message: chalk.bold('Select components:'),
      choices: ALL_COMPONENTS.map(c => ({ name: c, value: c })),
      pageSize: 15,
    });
    return { choice, manual: selected };
  }

  return { choice };
}

export async function askAddons(): Promise<AddonKey[]> {
  return checkbox<AddonKey>({
    message: chalk.bold('Select add-ons:'),
    choices: [
      new Separator(chalk.dim('── Project setup ──')),
      { name: 'Initialize Git', value: 'git', checked: true },
      { name: 'Add README.md', value: 'readme', checked: true },
      { name: 'Add .env.example', value: 'env-example', checked: false },
      { name: 'Add Prettier config', value: 'prettier', checked: false },
      { name: 'Add ESLint config', value: 'eslint', checked: false },
      { name: 'Add basic folder structure', value: 'folder-structure', checked: false },
      new Separator(chalk.dim('── After setup ──')),
      { name: 'Open in VS Code', value: 'open-vscode', checked: false },
      { name: 'Start dev server', value: 'start-dev', checked: false },
    ],
    pageSize: 12,
  });
}
