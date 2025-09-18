/**
 * App: Customer Registration
 * Package: api
 * File: .eslintrc.js
 * Version: 0.1.0
 * Turns: [1]
 * Author: ChatGPT
 * Date: 2025-09-18T16:44:28Z
 * Exports: module.exports
 * Description: ESLint configuration aligning with NestJS and TypeScript best practices.
 */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json'],
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier'
  ],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      }
    ]
  },
  ignorePatterns: ['.eslintrc.js'],
};
