import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execa } from 'execa';

const repoRoot = process.cwd();
const packageJson = JSON.parse(await fs.readFile(path.join(repoRoot, 'package.json'), 'utf8'));

const args = process.argv.slice(2);
const packageSpecFlagIndex = args.indexOf('--package-spec');
const packageSpec =
  packageSpecFlagIndex >= 0 && args[packageSpecFlagIndex + 1]
    ? args[packageSpecFlagIndex + 1]
    : null;
const keepTemp = args.includes('--keep-temp');

async function run(cmd, cmdArgs, options = {}) {
  const { stdout } = await execa(cmd, cmdArgs, {
    cwd: repoRoot,
    stdio: 'pipe',
    ...options,
  });
  return stdout.trim();
}

async function unlinkGlobalPackage() {
  await execa('npm', ['unlink', '-g', packageJson.name], {
    cwd: repoRoot,
    stdio: 'pipe',
    reject: false,
  });
  await execa('npm', ['uninstall', '-g', packageJson.name], {
    cwd: repoRoot,
    stdio: 'pipe',
    reject: false,
  });
}

async function createPackageSpec() {
  if (packageSpec) {
    return { installSpec: packageSpec, npxSpec: packageSpec, tarballPath: null };
  }

  const output = await run('npm', ['pack']);
  const tarballName = output.split(/\r?\n/).at(-1);

  assert.ok(tarballName, 'npm pack did not return a tarball name');

  const tarballPath = path.join(repoRoot, tarballName);
  return { installSpec: tarballPath, npxSpec: tarballPath, tarballPath };
}

async function readVersion(command, cmdArgs) {
  return run(command, cmdArgs);
}

async function readHelp(command, cmdArgs) {
  return run(command, cmdArgs);
}

async function main() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'adv-installer-smoke-'));
  const { installSpec, npxSpec, tarballPath } = await createPackageSpec();

  try {
    console.log(`Smoke workspace: ${tempRoot}`);
    console.log(`Package spec: ${installSpec}`);

    await unlinkGlobalPackage();

    console.log('Installing package globally...');
    await execa('npm', ['install', '-g', installSpec], {
      cwd: repoRoot,
      stdio: 'inherit',
    });

    console.log('Checking global binaries...');
    const advVersion = await readVersion('adv', ['--version']);
    const advInstallerVersion = await readVersion('adv-installer', ['--version']);
    assert.equal(advVersion, packageJson.version);
    assert.equal(advInstallerVersion, packageJson.version);

    const advHelp = await readHelp('adv', ['--help']);
    const advInstallerHelp = await readHelp('adv-installer', ['--help']);
    const advInstallerInstallHelp = await readHelp('adv-installer', ['install', '--help']);
    assert.match(advHelp, /adv init/);
    assert.match(advHelp, /npx adv-installer/);
    assert.match(advInstallerHelp, /install\|init \[options\]/);
    assert.match(advInstallerInstallHelp, /--quick <preset>/);

    console.log('Scaffolding with the global adv init alias...');
    const globalProjectDir = path.join(tempRoot, 'global-express');
    await execa(
      'adv',
      [
        'init',
        '--quick',
        'express',
        '--name',
        'global-express',
        '--dir',
        globalProjectDir,
        '--package-manager',
        'npm',
        '--skip-install',
        '--yes',
      ],
      { cwd: repoRoot, stdio: 'inherit' }
    );

    const globalPackageJson = JSON.parse(
      await fs.readFile(path.join(globalProjectDir, 'package.json'), 'utf8')
    );
    assert.equal(globalPackageJson.name, 'global-express');

    console.log('Scaffolding with npx adv-installer...');
    const npxProjectDir = path.join(tempRoot, 'npx-express');
    await execa(
      'npx',
      [
        '--yes',
        '--package',
        npxSpec,
        'adv-installer',
        '--quick',
        'express',
        '--name',
        'npx-express',
        '--dir',
        npxProjectDir,
        '--package-manager',
        'npm',
        '--skip-install',
        '--yes',
      ],
      { cwd: repoRoot, stdio: 'inherit' }
    );

    const npxPackageJson = JSON.parse(
      await fs.readFile(path.join(npxProjectDir, 'package.json'), 'utf8')
    );
    assert.equal(npxPackageJson.name, 'npx-express');

    console.log('Deleting smoke projects...');
    await fs.rm(globalProjectDir, { recursive: true, force: true });
    await fs.rm(npxProjectDir, { recursive: true, force: true });
    assert.equal(
      await fs
        .access(globalProjectDir)
        .then(() => true)
        .catch(() => false),
      false
    );
    assert.equal(
      await fs
        .access(npxProjectDir)
        .then(() => true)
        .catch(() => false),
      false
    );

    console.log('Smoke test completed successfully.');
  } finally {
    await unlinkGlobalPackage();

    if (!keepTemp) {
      await fs.rm(tempRoot, { recursive: true, force: true });
      if (tarballPath) {
        await fs.rm(tarballPath, { force: true });
      }
    }
  }
}

await main();
