import { runCommand } from '../utils/run-command.js';

interface RunOpts {
  dryRun?: boolean;
  verbose?: boolean;
}

export async function initGit(projectDir: string, opts: RunOpts = {}): Promise<void> {
  await runCommand('git', ['init'], { cwd: projectDir, ...opts, stdio: 'pipe' });
  await runCommand('git', ['add', '-A'], { cwd: projectDir, ...opts, stdio: 'pipe' });
  await runCommand('git', ['commit', '-m', 'Initial commit'], {
    cwd: projectDir,
    ...opts,
    stdio: 'pipe',
  });
}
