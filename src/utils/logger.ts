import chalk from 'chalk';

export const logger = {
  info(message: string) {
    console.log(chalk.cyan('  i') + '  ' + message);
  },

  success(message: string) {
    console.log(chalk.green('  ✓') + '  ' + message);
  },

  warn(message: string) {
    console.log(chalk.yellow('  !') + '  ' + chalk.yellow(message));
  },

  error(message: string) {
    console.log(chalk.red('  ✗') + '  ' + chalk.red(message));
  },

  step(message: string) {
    console.log(chalk.bold.blue('  →') + '  ' + message);
  },

  blank() {
    console.log('');
  },

  dim(message: string) {
    console.log(chalk.dim('  ' + message));
  },
};
