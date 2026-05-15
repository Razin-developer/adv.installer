import path from 'path';
import fs from 'fs-extra';
import type { PackageManager } from '../types/installer.js';

// Detect package manager by checking for lockfiles in the given directory
export async function detectPackageManager(cwd: string): Promise<PackageManager | null> {
  const checks: Array<[string, PackageManager]> = [
    ['pnpm-lock.yaml', 'pnpm'],
    ['yarn.lock', 'yarn'],
    ['bun.lockb', 'bun'],
    ['package-lock.json', 'npm'],
  ];

  for (const [lockfile, pm] of checks) {
    if (await fs.pathExists(path.join(cwd, lockfile))) {
      return pm;
    }
  }

  return null;
}

// Returns the install command for the given package manager
export function buildInstallCommand(pm: PackageManager): { cmd: string; args: string[] } {
  const commands: Record<PackageManager, { cmd: string; args: string[] }> = {
    pnpm: { cmd: 'pnpm', args: ['install'] },
    npm: { cmd: 'npm', args: ['install'] },
    yarn: { cmd: 'yarn', args: [] },
    bun: { cmd: 'bun', args: ['install'] },
  };
  return commands[pm];
}

// Returns the "create" command prefix for scaffold tools
export function getCreateCommand(pm: PackageManager): string {
  const map: Record<PackageManager, string> = {
    pnpm: 'pnpm',
    npm: 'npm',
    yarn: 'yarn',
    bun: 'bun',
  };
  return map[pm];
}

// Returns the dlx/exec runner (equivalent of npx) for the given pm
export function getDlxCommand(pm: PackageManager): { cmd: string; prefix: string[] } {
  const map: Record<PackageManager, { cmd: string; prefix: string[] }> = {
    pnpm: { cmd: 'pnpm', prefix: ['dlx'] },
    npm: { cmd: 'npx', prefix: [] },
    yarn: { cmd: 'yarn', prefix: ['dlx'] },
    bun: { cmd: 'bunx', prefix: [] },
  };
  return map[pm];
}
