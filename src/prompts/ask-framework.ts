import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import type { ProjectType } from '../types/installer.js';
import type { FrameworkChoice } from '../types/installer.js';
import {
  WEBSITE_FRAMEWORKS,
  MOBILE_FRAMEWORKS,
  DESKTOP_FRAMEWORKS,
  BACKEND_FRAMEWORKS,
  FULLSTACK_PRESETS,
  GAME_FRAMEWORKS,
  AI_PRESETS,
  QUICK_SETUP_OPTIONS,
} from '../config/frameworks.js';

function frameworksForType(projectType: ProjectType): FrameworkChoice[] {
  const map: Partial<Record<ProjectType, FrameworkChoice[]>> = {
    website: WEBSITE_FRAMEWORKS,
    mobile: MOBILE_FRAMEWORKS,
    desktop: DESKTOP_FRAMEWORKS,
    backend: BACKEND_FRAMEWORKS,
    fullstack: FULLSTACK_PRESETS,
    game: GAME_FRAMEWORKS,
    ai: AI_PRESETS,
    quick: QUICK_SETUP_OPTIONS,
  };
  return map[projectType] ?? [];
}

function promptLabel(projectType: ProjectType): string {
  const labels: Partial<Record<ProjectType, string>> = {
    website: 'Which framework?',
    mobile: 'Which mobile framework?',
    desktop: 'Which desktop framework?',
    backend: 'Which backend framework?',
    fullstack: 'Which full stack preset?',
    game: 'Which game framework?',
    ai: 'Which AI preset?',
    quick: 'Which quick setup?',
  };
  return labels[projectType] ?? 'Which framework?';
}

export async function askFramework(projectType: ProjectType): Promise<string> {
  const frameworks = frameworksForType(projectType);

  return select<string>({
    message: chalk.bold(promptLabel(projectType)),
    choices: frameworks.map(f => ({
      name: f.name + (f.description ? chalk.dim('  ' + f.description) : ''),
      value: f.value,
      short: f.name,
    })),
  });
}
