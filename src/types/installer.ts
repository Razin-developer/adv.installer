export type ProjectType =
  | 'website'
  | 'mobile'
  | 'desktop'
  | 'backend'
  | 'fullstack'
  | 'game'
  | 'ai'
  | 'quick';

export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

export type UILibrary = 'shadcn' | 'daisyui' | 'none';

export type ShadcnComponentChoice = 'essential' | 'all' | 'manual' | 'skip';

export type AddonKey =
  | 'git'
  | 'readme'
  | 'env-example'
  | 'prettier'
  | 'eslint'
  | 'folder-structure'
  | 'open-vscode'
  | 'start-dev';

export interface InstallOptions {
  projectType: ProjectType;
  framework: string;
  projectName: string;
  targetDir: string;
  packageManager: PackageManager;
  installDeps: boolean;
  tailwind: boolean;
  uiLibrary: UILibrary;
  shadcnComponents?: ShadcnComponentChoice;
  selectedShadcnComponents?: string[];
  addons: AddonKey[];
  dryRun: boolean;
  verbose: boolean;
}

export interface ScaffoldCommand {
  cmd: string;
  args: string[];
  cwd: string;
  description: string;
  interactive?: boolean;
}

export interface QuickPreset {
  key: string;
  projectType: ProjectType;
  framework: string;
  tailwind: boolean;
  uiLibrary: UILibrary;
  defaultAddons: AddonKey[];
  description: string;
}

export interface FrameworkChoice {
  name: string;
  value: string;
  description?: string;
}
