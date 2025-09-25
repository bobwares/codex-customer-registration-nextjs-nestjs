/**
 * App: Customer Registration
 * Package: api
 * File: eslint.config.js
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-25T19:06:09Z
 * Exports: module.exports
 * Description: Provides a flat-config bridge so ESLint v9 can consume the legacy .eslintrc.js configuration.
 */
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = compat.config(require('./.eslintrc.js'));
