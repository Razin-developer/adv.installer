import path from 'path';
import fs from 'fs-extra';

export function resolveTargetDir(parentDir: string, projectName: string): string {
  return path.resolve(parentDir, projectName);
}

export function getParentDir(targetDir: string): string {
  return path.dirname(targetDir);
}

export function getProjectName(targetDir: string): string {
  return path.basename(targetDir);
}

export async function isDirEmpty(dirPath: string): Promise<boolean> {
  try {
    const entries = await fs.readdir(dirPath);
    return entries.length === 0;
  } catch {
    // Directory doesn't exist — treat as empty
    return true;
  }
}

export async function dirExists(dirPath: string): Promise<boolean> {
  return fs.pathExists(dirPath);
}

// Normalizes path separators to forward slashes for display
export function toDisplayPath(p: string): string {
  return p.replace(/\\/g, '/');
}
