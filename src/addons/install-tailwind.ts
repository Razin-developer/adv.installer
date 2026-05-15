import type { PackageManager } from '../types/installer.js';
import { runCommand } from '../utils/run-command.js';

interface RunOpts {
  dryRun?: boolean;
  verbose?: boolean;
}

// Tailwind v4 ships as a Vite plugin. For Next.js, it is included via create-next-app.
// For Vite-based projects we add the plugin manually.
export async function installTailwind(
  projectDir: string,
  framework: string,
  pm: PackageManager,
  opts: RunOpts = {}
): Promise<void> {
  // Next.js and SvelteKit handle Tailwind in their own scaffolders — skip.
  const handled = ['nextjs', 'sveltekit', 'nuxt', 'remix', 'solidstart', 'nextjs-ai-chat'];
  if (handled.includes(framework)) return;

  // Vite-based: install @tailwindcss/vite and tailwindcss
  const installArgs = pm === 'yarn'
    ? ['add', '--dev', 'tailwindcss', '@tailwindcss/vite']
    : ['install', '--save-dev', 'tailwindcss', '@tailwindcss/vite'];

  await runCommand(pm, installArgs, { cwd: projectDir, ...opts, stdio: 'pipe' });
}

export async function installDaisyUI(
  projectDir: string,
  pm: PackageManager,
  opts: RunOpts = {}
): Promise<void> {
  const installArgs = pm === 'yarn'
    ? ['add', '--dev', 'daisyui@latest']
    : ['install', '--save-dev', 'daisyui@latest'];

  await runCommand(pm, installArgs, { cwd: projectDir, ...opts, stdio: 'pipe' });
}
