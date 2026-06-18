import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { createCli } from '../src/cli.js';

const packageJson = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
) as {
  bin: Record<string, string>;
};

describe('createCli', () => {
  it('shows the npm and init entrypoints in help output', () => {
    const program = createCli();
    let help = '';

    program.configureOutput({
      writeOut: value => {
        help += value;
      },
      writeErr: value => {
        help += value;
      },
    });
    program.outputHelp();

    expect(help).toContain('npx adv-installer');
    expect(help).toContain('adv init');
    expect(help).toContain('adv --quick express --name api');
    expect(help).toContain('install|init [options]');
  });

  it('publishes both adv binaries', () => {
    expect(packageJson.bin).toEqual({
      adv: 'dist/index.js',
      'adv-installer': 'dist/index.js',
    });
  });
});
