import path from 'path';
import fs from 'fs-extra';

const prettierConfig = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 100,
  arrowParens: 'avoid',
};

export async function writePrettierConfig(projectDir: string): Promise<void> {
  const configPath = path.join(projectDir, 'prettier.config.cjs');
  const exists = await fs.pathExists(configPath);
  if (exists) return;

  const content = `/** @type {import('prettier').Config} */
module.exports = ${JSON.stringify(prettierConfig, null, 2)};
`;
  await fs.writeFile(configPath, content);
}
