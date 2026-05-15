import { execa } from 'execa';
import type { ScaffoldCommand } from '../types/installer.js';
import { AdvInstallerError } from './errors.js';

export interface RunCommandOptions {
  cwd: string;
  dryRun?: boolean;
  verbose?: boolean;
  stdio?: 'inherit' | 'pipe';
}

export async function runCommand(
  cmd: string,
  args: string[],
  options: RunCommandOptions
): Promise<void> {
  const { cwd, dryRun = false, verbose = false, stdio = 'inherit' } = options;

  if (dryRun) {
    console.log(`  [dry-run] ${cmd} ${args.join(' ')}`);
    console.log(`  [dry-run] cwd: ${cwd}`);
    return;
  }

  if (verbose) {
    console.log(`  > ${cmd} ${args.join(' ')}`);
  }

  try {
    await execa(cmd, args, {
      cwd,
      stdio,
      reject: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new AdvInstallerError(
      `Command failed: ${cmd} ${args.join(' ')}\n${message}`,
      'run-command',
      `${cmd} ${args.join(' ')}`
    );
  }
}

export async function runScaffoldCommand(
  command: ScaffoldCommand,
  options: Omit<RunCommandOptions, 'cwd'>
): Promise<void> {
  return runCommand(command.cmd, command.args, {
    ...options,
    cwd: command.cwd,
  });
}
