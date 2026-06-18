import { createCli } from './cli.js';

const program = createCli();

const argv = [...process.argv];
const userArgs = argv.slice(2);
const firstArg = userArgs[0];
const explicitCommands = new Set(['install', 'init', 'help']);
const rootOnlyFlags = new Set(['-h', '--help', '-v', '--version']);
const shouldDefaultToInstall =
  userArgs.length === 0 ||
  (!!firstArg && firstArg.startsWith('-') && !rootOnlyFlags.has(firstArg));

if (shouldDefaultToInstall && !explicitCommands.has(firstArg ?? '')) {
  argv.splice(2, 0, 'install');
}

program.parse(argv);
