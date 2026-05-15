import path from 'path';
import fs from 'fs-extra';
import ora from 'ora';
import type { InstallOptions, ScaffoldCommand } from '../types/installer.js';
import { runScaffoldCommand, runCommand } from '../utils/run-command.js';
import { buildInstallCommand } from '../utils/package-manager.js';
import { logger } from '../utils/logger.js';
import { AdvInstallerError } from '../utils/errors.js';
import { buildWebsiteCommand } from './website.installer.js';
import { buildMobileCommand } from './mobile.installer.js';
import { buildDesktopCommand } from './desktop.installer.js';
import { buildBackendCommand, scaffoldBackendFiles } from './backend.installer.js';
import { buildFullstackCommand } from './fullstack.installer.js';
import { buildGameCommand, scaffoldGameFiles } from './game.installer.js';
import { buildAiCommand, scaffoldAiFiles } from './ai.installer.js';
import { initGit } from '../addons/init-git.js';
import { installTailwind } from '../addons/install-tailwind.js';
import { installShadcn } from '../addons/install-shadcn.js';
import { installDaisyUI } from '../addons/install-tailwind.js';
import { writeReadme } from '../addons/write-readme.js';
import { writeEnvExample } from '../addons/write-env-example.js';
import { writePrettierConfig } from '../addons/write-prettier-config.js';
import { writeEslintConfig } from '../addons/write-eslint-config.js';
import { ESSENTIAL_COMPONENTS, ALL_COMPONENTS } from '../config/shadcn-components.js';
import { hasInstalledNodeModules } from '../utils/project-state.js';

function resolveScaffoldCommand(options: InstallOptions): ScaffoldCommand | null {
  const { projectType, framework, projectName, targetDir, packageManager, installDeps } = options;
  const parentDir = path.dirname(targetDir);

  switch (projectType) {
    case 'website':
      return buildWebsiteCommand(framework, projectName, parentDir, packageManager, installDeps);
    case 'mobile':
      return buildMobileCommand(framework, projectName, parentDir, packageManager);
    case 'desktop':
      return buildDesktopCommand(framework, projectName, parentDir, packageManager);
    case 'backend':
      return buildBackendCommand(framework, projectName, parentDir, packageManager);
    case 'fullstack':
      return buildFullstackCommand(framework, projectName, parentDir, packageManager);
    case 'game':
      return buildGameCommand(framework, projectName, parentDir, packageManager);
    case 'ai':
      return buildAiCommand(framework, projectName, parentDir, packageManager);
    case 'quick':
      // Quick setup reuses website/backend installers based on the preset framework
      return buildWebsiteCommand(framework, projectName, parentDir, packageManager, installDeps);
    default:
      return null;
  }
}

// Frameworks that write their own files instead of using a scaffold command
const FILE_ONLY_TYPES: Record<string, boolean> = {
  'backend:express': true,
  'backend:fastify': true,
  'backend:flask': true,
  'backend:django': true,
  'game:phaser': true,
  'game:threejs': true,
  'game:kaboom': true,
  'game:godot': true,
  'game:unity': true,
  'ai:flask-ai': true,
  'ai:computer-vision': true,
  'ai:ollama': true,
  'ai:langchain': true,
};

function isFileOnlyScaffold(projectType: string, framework: string): boolean {
  return Boolean(FILE_ONLY_TYPES[`${projectType}:${framework}`]);
}

async function runFileOnlyScaffold(options: InstallOptions): Promise<void> {
  const { projectType, framework, targetDir, projectName, packageManager } = options;

  await fs.ensureDir(targetDir);

  if (projectType === 'backend' && (framework === 'express' || framework === 'fastify')) {
    await scaffoldBackendFiles(framework, targetDir, projectName, packageManager);
  } else if (projectType === 'game') {
    await scaffoldGameFiles(framework, targetDir, projectName);
  } else if (projectType === 'ai') {
    await scaffoldAiFiles(framework, targetDir, projectName);
  }
}

export async function createProject(options: InstallOptions): Promise<string[]> {
  const { targetDir, packageManager, installDeps, tailwind, uiLibrary, addons, dryRun, verbose } =
    options;

  const runOpts = { dryRun, verbose };
  const nextSteps: string[] = [];

  // --- Scaffold the project ---
  if (isFileOnlyScaffold(options.projectType, options.framework)) {
    if (!dryRun) {
      const spinner = ora('Writing project files...').start();
      try {
        await runFileOnlyScaffold(options);
        spinner.succeed('Project files written.');
      } catch (err) {
        spinner.fail('Failed to write project files.');
        throw err;
      }
    } else {
      logger.info('[dry-run] Would write project files to disk.');
    }
  } else {
    const command = resolveScaffoldCommand(options);
    if (!command) throw new AdvInstallerError('Could not resolve scaffold command.', 'scaffold');

    if (command.interactive) {
      logger.info(`${command.description}...`);
      logger.info('If the framework asks follow-up questions, answer them directly here.');
      logger.blank();

      await runScaffoldCommand(command, { ...runOpts, stdio: 'inherit' });

      logger.blank();
      logger.success(`${command.description} done.`);
    } else {
      const spinner = ora(command.description + '...').start();
      try {
        await runScaffoldCommand(command, { ...runOpts, stdio: 'inherit' });
        spinner.succeed(command.description + ' done.');
      } catch (err) {
        spinner.fail(command.description + ' failed.');
        throw err;
      }
    }
  }

  // --- Add-ons ---

  if (tailwind) {
    const spinner = ora('Setting up Tailwind CSS...').start();
    try {
      const result = await installTailwind(targetDir, options.framework, packageManager, runOpts);

      if (result.status === 'configured') {
        spinner.succeed(result.detail);
      } else if (result.status === 'already-configured') {
        spinner.info(result.detail);
      } else {
        spinner.warn(result.detail);
      }
    } catch {
      spinner.warn('Could not set up Tailwind automatically. Run manually.');
    }
  }

  if (uiLibrary === 'shadcn') {
    const spinner = ora('Initialising shadcn/ui...').start();
    try {
      const components = resolveComponents(options);
      await installShadcn(targetDir, components, runOpts);
      spinner.succeed('shadcn/ui ready.');
    } catch {
      spinner.warn('Could not set up shadcn/ui automatically. Run manually.');
    }
  } else if (uiLibrary === 'daisyui') {
    const spinner = ora('Adding DaisyUI...').start();
    try {
      await installDaisyUI(targetDir, packageManager, runOpts);
      spinner.succeed('DaisyUI added.');
    } catch {
      spinner.warn('Could not add DaisyUI automatically.');
    }
  }

  if (addons.includes('git')) {
    await initGit(targetDir, runOpts).catch(() => logger.warn('git init skipped.'));
  }

  if (addons.includes('readme')) {
    await writeReadme(targetDir, options).catch(() => logger.warn('README write skipped.'));
  }

  if (addons.includes('env-example')) {
    await writeEnvExample(targetDir).catch(() => logger.warn('.env.example write skipped.'));
  }

  if (addons.includes('prettier')) {
    await writePrettierConfig(targetDir).catch(() => logger.warn('Prettier config write skipped.'));
  }

  if (addons.includes('eslint')) {
    await writeEslintConfig(targetDir).catch(() => logger.warn('ESLint config write skipped.'));
  }

  // --- Install dependencies ---
  if (installDeps) {
    const alreadyInstalled = dryRun ? false : await hasInstalledNodeModules(targetDir);

    if (alreadyInstalled) {
      logger.info('Dependencies already appear to be installed by the scaffold. Skipping extra install.');
    } else {
      const { cmd, args } = buildInstallCommand(packageManager);
      const spinner = ora(`Installing dependencies with ${packageManager}...`).start();
      try {
        await runCommand(cmd, args, { cwd: targetDir, ...runOpts, stdio: 'inherit' });
        spinner.succeed('Dependencies installed.');
      } catch {
        spinner.fail('Dependency install failed.');
        nextSteps.push(`${packageManager} install`);
      }
    }
  } else {
    nextSteps.push(`${packageManager} install`);
  }

  // --- Post-setup actions ---
  if (addons.includes('open-vscode')) {
    if (!dryRun) {
      await runCommand('code', [targetDir], { cwd: targetDir, stdio: 'pipe' }).catch(() =>
        logger.warn('Could not open VS Code. Is the `code` command available in PATH?')
      );
    }
  }

  const projectRelPath = `./${path.basename(targetDir)}`;
  nextSteps.unshift(`cd ${projectRelPath}`);

  if (addons.includes('start-dev')) {
    nextSteps.push(`${packageManager} run dev`);
  }

  return nextSteps;
}

function resolveComponents(options: InstallOptions): string[] {
  switch (options.shadcnComponents) {
    case 'essential':
      return ESSENTIAL_COMPONENTS;
    case 'all':
      return ALL_COMPONENTS;
    case 'manual':
      return options.selectedShadcnComponents ?? [];
    default:
      return [];
  }
}
