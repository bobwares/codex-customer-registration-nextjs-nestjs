/**
 * App: Customer Registration
 * Package: backend
 * File: eslint.config.js
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-23T21:41:08Z
 * Exports: module.exports
 * Description: Provides a flat-config equivalent of the legacy ESLint configuration for compatibility with ESLint v9.
 */
const tsEslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');
const prettierConfig = require('eslint-config-prettier');

const recommendedTsRules = tsEslint.configs.recommended.rules ?? {};
const recommendedImportRules = importPlugin.configs?.recommended?.rules ?? {};
const typescriptImportRules = importPlugin.configs?.typescript?.rules ?? {};

module.exports = [
  {
    files: ['**/*.ts'],
    ignores: ['.eslintrc.js'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tsEslint,
      import: importPlugin
    },
    settings: {
      ...(importPlugin.configs?.recommended?.settings ?? {}),
      ...(importPlugin.configs?.typescript?.settings ?? {})
    },
    rules: {
      ...recommendedTsRules,
      ...recommendedImportRules,
      ...typescriptImportRules,
      ...(prettierConfig.rules ?? {}),
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
];
