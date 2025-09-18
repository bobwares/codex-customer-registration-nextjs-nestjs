/**
 * # App: Customer Registration
 * # Package: api.config
 * # File: .eslintrc.js
 * # Version: 0.1.0
 * # Turns: 1
 * # Author: AI Agent
 * # Date: 2025-09-18T19:33:35Z
 * # Exports: ESLint configuration for the NestJS API workspace.
 * # Description: Configures ESLint with TypeScript, NestJS, and Prettier integrations for the API codebase.
 */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json'],
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:import/recommended', 'plugin:import/typescript', 'prettier'],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
  ignorePatterns: ['dist', 'node_modules'],
};
