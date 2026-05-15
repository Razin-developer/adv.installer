import path from 'node:path';
import fs from 'fs-extra';

interface PackageJsonShape {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export async function readPackageJson(projectDir: string): Promise<PackageJsonShape | null> {
  const packageJsonPath = path.join(projectDir, 'package.json');

  if (!(await fs.pathExists(packageJsonPath))) {
    return null;
  }

  return fs.readJson(packageJsonPath) as Promise<PackageJsonShape>;
}

export async function hasPackageDependency(
  projectDir: string,
  packageName: string
): Promise<boolean> {
  const packageJson = await readPackageJson(projectDir);

  if (!packageJson) {
    return false;
  }

  return Boolean(
    packageJson.dependencies?.[packageName] || packageJson.devDependencies?.[packageName]
  );
}

export async function hasInstalledNodeModules(projectDir: string): Promise<boolean> {
  return fs.pathExists(path.join(projectDir, 'node_modules'));
}
