import { describe, it, expect } from 'vitest';
import { buildInstallCommand, getCreateCommand, getDlxCommand } from '../src/utils/package-manager';
import type { PackageManager } from '../src/types/installer';

const PACKAGE_MANAGERS: PackageManager[] = ['pnpm', 'npm', 'yarn', 'bun'];

describe('buildInstallCommand', () => {
  it('builds pnpm install command', () => {
    const { cmd, args } = buildInstallCommand('pnpm');
    expect(cmd).toBe('pnpm');
    expect(args).toContain('install');
  });

  it('builds npm install command', () => {
    const { cmd, args } = buildInstallCommand('npm');
    expect(cmd).toBe('npm');
    expect(args).toContain('install');
  });

  it('builds yarn command with no args', () => {
    const { cmd, args } = buildInstallCommand('yarn');
    expect(cmd).toBe('yarn');
    expect(args).toHaveLength(0);
  });

  it('builds bun install command', () => {
    const { cmd, args } = buildInstallCommand('bun');
    expect(cmd).toBe('bun');
    expect(args).toContain('install');
  });
});

describe('getCreateCommand', () => {
  it('returns the correct create command for each pm', () => {
    const expected: Record<PackageManager, string> = {
      pnpm: 'pnpm',
      npm: 'npm',
      yarn: 'yarn',
      bun: 'bun',
    };
    for (const pm of PACKAGE_MANAGERS) {
      expect(getCreateCommand(pm)).toBe(expected[pm]);
    }
  });
});

describe('getDlxCommand', () => {
  it('returns npx for npm', () => {
    const { cmd, prefix } = getDlxCommand('npm');
    expect(cmd).toBe('npx');
    expect(prefix).toHaveLength(0);
  });

  it('returns pnpm dlx for pnpm', () => {
    const { cmd, prefix } = getDlxCommand('pnpm');
    expect(cmd).toBe('pnpm');
    expect(prefix).toContain('dlx');
  });

  it('returns bunx for bun', () => {
    const { cmd } = getDlxCommand('bun');
    expect(cmd).toBe('bunx');
  });

  it('returns yarn dlx for yarn', () => {
    const { cmd, prefix } = getDlxCommand('yarn');
    expect(cmd).toBe('yarn');
    expect(prefix).toContain('dlx');
  });
});
