import type { PackageManager, ScaffoldCommand } from '../types/installer.js';

export function buildDesktopCommand(
  framework: string,
  projectName: string,
  parentDir: string,
  pm: PackageManager
): ScaffoldCommand {
  switch (framework) {
    case 'tauri-react':
      return buildTauriCommand(projectName, parentDir, pm, 'react-ts');
    case 'tauri-vue':
      return buildTauriCommand(projectName, parentDir, pm, 'vue-ts');
    case 'tauri-svelte':
      return buildTauriCommand(projectName, parentDir, pm, 'svelte-ts');
    case 'electron-react':
      return {
        cmd: 'npx',
        args: ['create-electron-app@latest', projectName, '--template', 'webpack-typescript'],
        cwd: parentDir,
        description: 'Creating Electron + React project',
      };
    case 'neutralino':
      return {
        cmd: 'npx',
        args: ['@neutralinojs/neu', 'create', projectName],
        cwd: parentDir,
        description: 'Creating Neutralino project',
      };
    default:
      throw new Error(`Unknown desktop framework: ${framework}`);
  }
}

function buildTauriCommand(
  projectName: string,
  parentDir: string,
  pm: PackageManager,
  template: string
): ScaffoldCommand {
  if (pm === 'npm') {
    return {
      cmd: 'npm',
      args: ['create', 'tauri-app@latest', projectName, '--', '--template', template],
      cwd: parentDir,
      description: 'Creating Tauri project',
    };
  }
  return {
    cmd: pm,
    args: ['create', 'tauri-app@latest', projectName, '--template', template],
    cwd: parentDir,
    description: 'Creating Tauri project',
  };
}
