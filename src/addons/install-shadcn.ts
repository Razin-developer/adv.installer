import { runCommand } from '../utils/run-command.js';

interface RunOpts {
  dryRun?: boolean;
  verbose?: boolean;
}

export async function installShadcn(
  projectDir: string,
  components: string[],
  opts: RunOpts = {}
): Promise<void> {
  // Initialise shadcn — this sets up tailwind.config.ts, globals.css, etc.
  await runCommand('npx', ['shadcn@latest', 'init', '--yes'], {
    cwd: projectDir,
    ...opts,
    stdio: 'inherit',
  });

  if (components.length === 0) return;

  // Add components in one call to keep it fast
  await runCommand('npx', ['shadcn@latest', 'add', ...components], {
    cwd: projectDir,
    ...opts,
    stdio: 'inherit',
  });
}
