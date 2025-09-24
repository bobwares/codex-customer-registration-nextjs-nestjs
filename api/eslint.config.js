/**
 * App: Customer Registration
 * Package: api
 * File: eslint.config.js
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-24T00:32:42Z
 * Exports: module.exports (ESLint flat config)
 * Description: Provides a flat ESLint configuration that reuses the legacy .eslintrc.js rules for compatibility with ESLint 9.
 */
const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  js.configs.recommended,
  ...compat.config(require('./.eslintrc.js')),
];
