import type { PackageManager, ScaffoldCommand } from '../types/installer.js';

export function buildMobileCommand(
  framework: string,
  projectName: string,
  parentDir: string,
  _pm: PackageManager
): ScaffoldCommand {
  switch (framework) {
    case 'expo':
      return {
        cmd: 'npx',
        args: ['create-expo-app@latest', projectName, '--template', 'blank-typescript'],
        cwd: parentDir,
        description: 'Creating Expo project',
      };
    case 'react-native-cli':
      return {
        cmd: 'npx',
        args: ['@react-native-community/cli', 'init', projectName],
        cwd: parentDir,
        description: 'Creating React Native project',
      };
    case 'flutter':
      return {
        cmd: 'flutter',
        args: ['create', projectName],
        cwd: parentDir,
        description: 'Creating Flutter project',
      };
    case 'kotlin-android':
      // No official CLI; we create a basic folder structure
      return {
        cmd: 'echo',
        args: [`Kotlin Android starter: ${projectName}`],
        cwd: parentDir,
        description: 'Creating Kotlin Android folder structure',
      };
    default:
      throw new Error(`Unknown mobile framework: ${framework}`);
  }
}
