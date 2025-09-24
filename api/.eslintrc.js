/**
 * App: Customer Registration
 * Package: api
 * File: .eslintrc.js
 * Version: 0.1.1
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-24T00:39:15Z
 * Exports: module.exports (ESLint configuration)
 * Description: Configures ESLint for the NestJS TypeScript project using TypeScript ESLint and Prettier integrations.
 */
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:import/recommended',
    'prettier'
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off'
  }
};
