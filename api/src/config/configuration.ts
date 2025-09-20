/**
 * App: Customer Registration
 * Package: api/src/config
 * File: configuration.ts
 * Version: 0.1.0
 * Turns: 2
 * Author: Codex Agent
 * Date: 2025-09-20T04:22:15Z
 * Exports: default
 * Description: Loads application configuration from environment variables,
 *              providing defaults for local development.
 */
export default () => ({
  app: {
    port: parseInt(process.env.PORT ?? '3000', 10),
  },
  database: {
    type: process.env.DATABASE_TYPE ?? 'postgres',
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    username: process.env.DATABASE_USERNAME ?? 'customer_service',
    password: process.env.DATABASE_PASSWORD ?? 'customer_service',
    name: process.env.DATABASE_NAME ?? 'customer_service',
    schema: process.env.DATABASE_SCHEMA ?? 'public',
    ssl: process.env.DATABASE_SSL === 'true',
    path: process.env.DATABASE_PATH,
  },
});
