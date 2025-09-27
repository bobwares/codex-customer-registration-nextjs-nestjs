/**
 * App: Customer Registration
 * Package: api
 * File: eslint.config.js
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-27T14:26:25Z
 * Exports: default ESLint flat config
 * Description: Provides an ESLint flat configuration equivalent to the legacy .eslintrc.js for NestJS TypeScript sources.
 */
import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  ...compat.config({
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: 'tsconfig.eslint.json',
      tsconfigRootDir: __dirname,
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'import'],
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:import/typescript',
      'plugin:import/recommended',
      'prettier',
    ],
    env: {
      node: true,
      jest: true,
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }),
];
