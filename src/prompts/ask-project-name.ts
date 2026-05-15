import { input } from '@inquirer/prompts';
import chalk from 'chalk';
import { validateAndNormalizeName } from '../utils/names.js';
import { logger } from '../utils/logger.js';

export async function askProjectName(defaultName = 'my-app'): Promise<string> {
  const raw = await input({
    message: chalk.bold('Project name:'),
    default: defaultName,
    validate(value) {
      const result = validateAndNormalizeName(value);
      if (!result.valid) return result.warnings[0] ?? 'Invalid name.';
      return true;
    },
  });

  const result = validateAndNormalizeName(raw);

  for (const warning of result.warnings) {
    logger.warn(warning);
  }

  return result.normalized;
}
