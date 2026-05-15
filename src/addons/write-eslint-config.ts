import path from 'path';
import fs from 'fs-extra';

export async function writeEslintConfig(projectDir: string): Promise<void> {
  const configPath = path.join(projectDir, 'eslint.config.js');
  const exists = await fs.pathExists(configPath);
  if (exists) return;

  const content = `import tseslint from 'typescript-eslint';

export default tseslint.config({
  files: ['src/**/*.ts', 'src/**/*.tsx'],
  extends: [tseslint.configs.recommended],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
});
`;
  await fs.writeFile(configPath, content);
}
