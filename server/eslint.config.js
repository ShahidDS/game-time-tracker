import eslintPluginTs from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        NodeJS: true,
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs,
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  prettier,
];
