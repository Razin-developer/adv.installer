import path from 'path';
import fs from 'fs-extra';
import type { PackageManager, ScaffoldCommand } from '../types/installer.js';

export function buildBackendCommand(
  framework: string,
  projectName: string,
  parentDir: string,
  pm: PackageManager
): ScaffoldCommand {
  switch (framework) {
    case 'hono':
      return buildHonoCommand(projectName, parentDir, pm);
    case 'nestjs':
      return {
        cmd: 'npx',
        args: ['-y', '@nestjs/cli', 'new', projectName, '--package-manager', pm, '--skip-git'],
        cwd: parentDir,
        description: 'Creating NestJS project',
      };
    case 'flask':
      return {
        cmd: 'echo',
        args: [`Flask starter: ${projectName} (see scaffold below)`],
        cwd: parentDir,
        description: 'Generating Flask project structure',
      };
    case 'django':
      return {
        cmd: 'django-admin',
        args: ['startproject', projectName],
        cwd: parentDir,
        description: 'Creating Django project',
      };
    // Express and Fastify are scaffolded with fs-extra in scaffoldBackendFiles
    case 'express':
    case 'fastify':
      return {
        cmd: 'echo',
        args: [`${framework} scaffold will be written to disk`],
        cwd: parentDir,
        description: `Creating ${framework} project files`,
      };
    default:
      throw new Error(`Unknown backend framework: ${framework}`);
  }
}

function buildHonoCommand(
  projectName: string,
  parentDir: string,
  pm: PackageManager
): ScaffoldCommand {
  if (pm === 'npm') {
    return {
      cmd: 'npm',
      args: ['create', 'hono@latest', projectName],
      cwd: parentDir,
      description: 'Creating Hono project',
    };
  }
  return {
    cmd: pm,
    args: ['create', 'hono@latest', projectName],
    cwd: parentDir,
    description: 'Creating Hono project',
  };
}

// For Express and Fastify we write the files ourselves since there is no
// widely-used official scaffolder for these.
export async function scaffoldBackendFiles(
  framework: string,
  projectDir: string,
  projectName: string,
  pm: PackageManager
): Promise<void> {
  const isExpress = framework === 'express';
  const depName = isExpress ? 'express' : 'fastify';
  const depTypes = isExpress ? '"@types/express": "^4.17.0",' : '';

  const packageJson = {
    name: projectName,
    version: '0.1.0',
    type: 'module' as const,
    scripts: {
      dev: 'tsx src/index.ts',
      build: 'tsc',
      start: 'node dist/index.js',
    },
    dependencies: isExpress
      ? { express: '^4.18.0' }
      : { fastify: '^4.26.0' },
    devDependencies: {
      ...(isExpress ? { '@types/express': '^4.17.0' } : {}),
      '@types/node': '^20.0.0',
      tsx: '^4.0.0',
      typescript: '^5.0.0',
    },
  };

  const tsconfig = {
    compilerOptions: {
      target: 'ES2022',
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      outDir: 'dist',
      rootDir: 'src',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist'],
  };

  const indexTs = isExpress
    ? `import express from 'express';

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Hello from Express!' });
});

app.listen(port, () => {
  console.log(\`Server running on http://localhost:\${port}\`);
});
`
    : `import Fastify from 'fastify';

const app = Fastify({ logger: true });
const port = Number(process.env.PORT ?? 3000);

app.get('/', async () => {
  return { message: 'Hello from Fastify!' };
});

app.listen({ port }, err => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
`;

  await fs.ensureDir(path.join(projectDir, 'src'));
  await fs.writeJSON(path.join(projectDir, 'package.json'), packageJson, { spaces: 2 });
  await fs.writeJSON(path.join(projectDir, 'tsconfig.json'), tsconfig, { spaces: 2 });
  await fs.writeFile(path.join(projectDir, 'src', 'index.ts'), indexTs);
  await fs.writeFile(path.join(projectDir, '.gitignore'), 'node_modules/\ndist/\n.env\n');
}
