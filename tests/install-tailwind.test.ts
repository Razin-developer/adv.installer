import os from 'node:os';
import path from 'node:path';
import fs from 'fs-extra';
import { afterEach, describe, expect, it } from 'vitest';
import { installTailwind } from '../src/addons/install-tailwind.js';

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map(dir => fs.remove(dir)));
});

async function createTempProject(): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'adv-tailwind-'));
  tempDirs.push(dir);
  return dir;
}

describe('installTailwind', () => {
  it('skips when a Next.js project already has Tailwind available', async () => {
    const projectDir = await createTempProject();

    await fs.writeJson(path.join(projectDir, 'package.json'), {
      dependencies: {
        tailwindcss: '^4.0.0',
      },
    });

    const result = await installTailwind(projectDir, 'nextjs', 'npm');

    expect(result.status).toBe('already-configured');
  });

  it('updates an existing Vite project when Tailwind packages are already installed', async () => {
    const projectDir = await createTempProject();

    await fs.writeJson(path.join(projectDir, 'package.json'), {
      devDependencies: {
        tailwindcss: '^4.0.0',
        '@tailwindcss/vite': '^4.0.0',
      },
    });

    await fs.ensureDir(path.join(projectDir, 'src'));
    await fs.writeFile(
      path.join(projectDir, 'vite.config.ts'),
      `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`
    );
    await fs.writeFile(
      path.join(projectDir, 'src', 'index.css'),
      `:root {
  color: #111;
}
`
    );

    const result = await installTailwind(projectDir, 'react-vite', 'npm');
    const viteConfig = await fs.readFile(path.join(projectDir, 'vite.config.ts'), 'utf8');
    const css = await fs.readFile(path.join(projectDir, 'src', 'index.css'), 'utf8');

    expect(result.status).toBe('configured');
    expect(viteConfig).toContain("import tailwindcss from '@tailwindcss/vite';");
    expect(viteConfig).toContain('plugins: [react(), tailwindcss()]');
    expect(css).toContain('@import "tailwindcss";');
  });
});
