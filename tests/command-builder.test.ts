import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildWebsiteCommand } from '../src/installers/website.installer';
import { buildBackendCommand } from '../src/installers/backend.installer';
import { buildDesktopCommand } from '../src/installers/desktop.installer';
import type { PackageManager } from '../src/types/installer';

const PARENT = '/projects';
const NAME = 'my-app';

describe('buildWebsiteCommand — Next.js', () => {
  it('uses pnpm create next-app for pnpm', () => {
    const cmd = buildWebsiteCommand('nextjs', NAME, PARENT, 'pnpm', true);
    expect(cmd.cmd).toBe('pnpm');
    expect(cmd.args).toContain('next-app');
    expect(cmd.cwd).toBe(PARENT);
  });

  it('uses npm create next-app@latest for npm', () => {
    const cmd = buildWebsiteCommand('nextjs', NAME, PARENT, 'npm', true);
    expect(cmd.cmd).toBe('npm');
    expect(cmd.args).toContain('next-app@latest');
  });

  it('passes --skip-install when installDeps is false', () => {
    const cmd = buildWebsiteCommand('nextjs', NAME, PARENT, 'pnpm', false);
    expect(cmd.args).toContain('--skip-install');
  });

  it('does not pass --skip-install when installDeps is true', () => {
    const cmd = buildWebsiteCommand('nextjs', NAME, PARENT, 'pnpm', true);
    expect(cmd.args).not.toContain('--skip-install');
  });
});

describe('buildWebsiteCommand — Vite', () => {
  it('uses correct template for react-vite', () => {
    const cmd = buildWebsiteCommand('react-vite', NAME, PARENT, 'pnpm', true);
    expect(cmd.args).toContain('react-ts');
  });

  it('uses correct template for vue-vite', () => {
    const cmd = buildWebsiteCommand('vue-vite', NAME, PARENT, 'pnpm', true);
    expect(cmd.args).toContain('vue-ts');
  });

  it('passes -- separator for npm vite', () => {
    const cmd = buildWebsiteCommand('react-vite', NAME, PARENT, 'npm', true);
    expect(cmd.cmd).toBe('npm');
    expect(cmd.args).toContain('--');
  });
});

describe('buildBackendCommand — Hono', () => {
  it('uses correct pm command for pnpm', () => {
    const cmd = buildBackendCommand('hono', NAME, PARENT, 'pnpm');
    expect(cmd.cmd).toBe('pnpm');
    expect(cmd.args.some(a => a.includes('hono'))).toBe(true);
  });

  it('uses npm for npm', () => {
    const cmd = buildBackendCommand('hono', NAME, PARENT, 'npm');
    expect(cmd.cmd).toBe('npm');
  });
});

describe('buildDesktopCommand — Tauri', () => {
  it('builds tauri-react command', () => {
    const cmd = buildDesktopCommand('tauri-react', NAME, PARENT, 'pnpm');
    expect(cmd.args.some(a => a.includes('tauri-app'))).toBe(true);
    expect(cmd.args).toContain('react-ts');
  });

  it('builds tauri-vue command', () => {
    const cmd = buildDesktopCommand('tauri-vue', NAME, PARENT, 'pnpm');
    expect(cmd.args).toContain('vue-ts');
  });

  it('uses npm with -- separator', () => {
    const cmd = buildDesktopCommand('tauri-react', NAME, PARENT, 'npm');
    expect(cmd.args).toContain('--');
  });
});

describe('install command — no deps behavior', () => {
  it('does not include install args in the scaffold command itself', () => {
    // The scaffold command should never contain 'install' for file-only scaffolds.
    // The install step happens separately in create-project.ts.
    const cmd = buildBackendCommand('hono', NAME, PARENT, 'pnpm');
    expect(cmd.args.join(' ')).not.toContain('pnpm install');
  });
});
