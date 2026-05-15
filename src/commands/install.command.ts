import { select, confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import type { InstallOptions, ProjectType } from '../types/installer.js';
import { resolveQuickPreset } from '../config/quick-presets.js';
import { askProjectType } from '../prompts/ask-project-type.js';
import { askFramework } from '../prompts/ask-framework.js';
import { askProjectName } from '../prompts/ask-project-name.js';
import { askDirectory } from '../prompts/ask-directory.js';
import { askPackageManager } from '../prompts/ask-package-manager.js';
import { askInstallDeps } from '../prompts/ask-install-deps.js';
import { askTailwind, askUiLibrary, askShadcnComponents, askAddons } from '../prompts/ask-addons.js';
import { createProject } from '../installers/create-project.js';
import { showWelcome, showSummary, showSuccess, showCancelled, showError } from '../utils/terminal.js';
import { dirExists, isDirEmpty } from '../utils/paths.js';
import { isUserCancel, isAdvInstallerError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export interface InstallCommandFlags {
  quick?: string;
  dryRun: boolean;
  verbose: boolean;
}

export async function runInstallCommand(flags: InstallCommandFlags): Promise<void> {
  try {
    showWelcome();
    await runFlow(flags);
  } catch (error) {
    if (isUserCancel(error)) {
      showCancelled();
      process.exit(0);
    }

    if (isAdvInstallerError(error)) {
      showError(error.message, error.step, flags.verbose ? error.command : undefined);
    } else {
      showError(
        error instanceof Error ? error.message : 'An unexpected error occurred.',
        undefined,
        undefined
      );
    }

    process.exit(1);
  }
}

async function runFlow(flags: InstallCommandFlags): Promise<void> {
  let options: InstallOptions;

  if (flags.quick) {
    options = await buildQuickOptions(flags.quick, flags);
  } else {
    options = await buildInteractiveOptions(flags);
  }

  // Check if target directory already exists and is not empty
  const exists = await dirExists(options.targetDir);
  if (exists) {
    const empty = await isDirEmpty(options.targetDir);
    if (!empty) {
      const decision = await handleNonEmptyDir(options.targetDir);
      if (decision === 'cancel') {
        showCancelled();
        return;
      }
      if (decision === 'choose-another') {
        const newDir = await askDirectory(options.projectName);
        options = { ...options, targetDir: newDir };
      }
      // 'continue' — proceed as-is
    }
  }

  // Show summary and ask for confirmation
  showSummary(options);

  const confirmed = await confirm({
    message: chalk.bold('Create this project?'),
    default: true,
  });

  if (!confirmed) {
    showCancelled();
    return;
  }

  logger.blank();

  const nextSteps = await createProject(options);

  showSuccess(options.projectName, options.targetDir, nextSteps);
}

async function buildInteractiveOptions(flags: InstallCommandFlags): Promise<InstallOptions> {
  const projectType = await askProjectType();
  const framework = await askFramework(projectType);

  logger.blank();

  const projectName = await askProjectName();
  const targetDir = await askDirectory(projectName);

  logger.blank();

  const packageManager = await askPackageManager(process.cwd());
  const installDeps = await askInstallDeps();

  logger.blank();

  // Tailwind and UI library only make sense for UI projects
  const uiTypes: ProjectType[] = ['website', 'fullstack', 'desktop', 'ai', 'quick'];
  const showUiPrompts = uiTypes.includes(projectType);

  const tailwind = showUiPrompts ? await askTailwind() : false;
  const uiLibrary = showUiPrompts ? await askUiLibrary(tailwind) : 'none';

  let shadcnComponents: InstallOptions['shadcnComponents'];
  let selectedShadcnComponents: string[] | undefined;

  if (uiLibrary === 'shadcn') {
    const { choice, manual } = await askShadcnComponents();
    shadcnComponents = choice;
    selectedShadcnComponents = manual;
  }

  logger.blank();

  const addons = await askAddons();

  return {
    projectType,
    framework,
    projectName,
    targetDir,
    packageManager,
    installDeps,
    tailwind,
    uiLibrary,
    shadcnComponents,
    selectedShadcnComponents,
    addons,
    dryRun: flags.dryRun,
    verbose: flags.verbose,
  };
}

async function buildQuickOptions(presetKey: string, flags: InstallCommandFlags): Promise<InstallOptions> {
  const preset = resolveQuickPreset(presetKey);

  if (!preset) {
    logger.error(`Unknown preset: ${chalk.bold(presetKey)}`);
    logger.info('Available presets: nextjs, react, tauri, express, hono, expo, ai-chat');
    process.exit(1);
  }

  logger.info(`Quick setup: ${chalk.bold(preset.description)}`);
  logger.blank();

  const projectName = await askProjectName();
  const targetDir = await askDirectory(projectName);

  logger.blank();

  const packageManager = await askPackageManager(process.cwd());
  const installDeps = await askInstallDeps();

  return {
    projectType: preset.projectType,
    framework: preset.framework,
    projectName,
    targetDir,
    packageManager,
    installDeps,
    tailwind: preset.tailwind,
    uiLibrary: preset.uiLibrary,
    shadcnComponents: preset.uiLibrary === 'shadcn' ? 'essential' : undefined,
    addons: preset.defaultAddons,
    dryRun: flags.dryRun,
    verbose: flags.verbose,
  };
}

async function handleNonEmptyDir(dirPath: string): Promise<'continue' | 'cancel' | 'choose-another'> {
  return select({
    message: chalk.yellow(`The directory is not empty: ${dirPath}`),
    choices: [
      { name: 'Cancel', value: 'cancel' as const },
      { name: 'Continue anyway', value: 'continue' as const },
      { name: 'Choose another folder', value: 'choose-another' as const },
    ],
  });
}
