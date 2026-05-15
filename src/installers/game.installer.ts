import path from 'path';
import fs from 'fs-extra';
import type { PackageManager, ScaffoldCommand } from '../types/installer.js';

export function buildGameCommand(
  framework: string,
  projectName: string,
  parentDir: string,
  pm: PackageManager
): ScaffoldCommand {
  switch (framework) {
    case 'phaser':
    case 'threejs':
    case 'kaboom':
    case 'godot':
    case 'unity':
      // These don't have mainstream official CLI scaffolders.
      // We write a sensible starter structure ourselves.
      return {
        cmd: 'echo',
        args: [`Game scaffold: ${framework} for ${projectName}`],
        cwd: parentDir,
        description: `Creating ${framework} project structure`,
      };
    default:
      throw new Error(`Unknown game framework: ${framework}`);
  }
}

interface GameDep {
  [key: string]: string;
}

const GAME_DEPS: Record<string, { deps: GameDep; devDeps: GameDep }> = {
  phaser: {
    deps: { phaser: '^3.80.0' },
    devDeps: { vite: '^5.0.0', typescript: '^5.0.0' },
  },
  threejs: {
    deps: { three: '^0.163.0' },
    devDeps: { '@types/three': '^0.163.0', vite: '^5.0.0', typescript: '^5.0.0' },
  },
  kaboom: {
    deps: { kaboom: '^3001.0.0' },
    devDeps: { vite: '^5.0.0', typescript: '^5.0.0' },
  },
  godot: { deps: {}, devDeps: {} },
  unity: { deps: {}, devDeps: {} },
};

export async function scaffoldGameFiles(
  framework: string,
  projectDir: string,
  projectName: string
): Promise<void> {
  await fs.ensureDir(projectDir);

  const { deps, devDeps } = GAME_DEPS[framework] ?? { deps: {}, devDeps: {} };

  if (Object.keys(deps).length > 0) {
    const pkg = {
      name: projectName,
      version: '0.1.0',
      type: 'module',
      scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
      dependencies: deps,
      devDependencies: devDeps,
    };
    await fs.writeJSON(path.join(projectDir, 'package.json'), pkg, { spaces: 2 });
    await fs.ensureDir(path.join(projectDir, 'src'));
    await fs.writeFile(path.join(projectDir, 'src', 'main.ts'), `// ${framework} starter\nconsole.log('Hello ${framework}!');\n`);
  } else {
    // Godot / Unity: just create the folder structure
    const dirs = framework === 'godot'
      ? ['scenes', 'scripts', 'assets/sprites', 'assets/sounds']
      : ['Assets/Scripts', 'Assets/Scenes', 'Assets/Sprites', 'ProjectSettings'];

    for (const dir of dirs) {
      await fs.ensureDir(path.join(projectDir, dir));
    }
    await fs.writeFile(path.join(projectDir, 'README.md'), `# ${projectName}\n\nA ${framework} project.\n`);
  }
}
