import tseslint from 'typescript-eslint';

export default tseslint.config({
  files: ['src/**/*.ts', 'tests/**/*.ts'],
  extends: [tseslint.configs.recommended],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
});
