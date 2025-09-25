/**
 * App: Customer Registration
 * Package: api
 * File: snake-case.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-25T06:25:09Z
 * Exports: snakeCase
 * Description: Converts PascalCase or camelCase identifiers to snake_case to
 *              support consistent naming strategies.
 */
export function snakeCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toLowerCase();
}
