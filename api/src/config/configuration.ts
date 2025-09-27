/**
 * App: Customer Registration
 * Package: api/src/config
 * File: configuration.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-27T14:26:25Z
 * Exports: default
 * Description: Provides the configuration factory supplying application and database settings from environment variables.
 */
export default () => ({
  app: {
    name: process.env.APP_NAME ?? 'backend',
    env: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '3000', 10),
  },
  db: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    user: process.env.DATABASE_USER,
    pass: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    schema: process.env.DATABASE_SCHEMA ?? 'public',
    ssl: (process.env.DATABASE_SSL ?? 'false').toLowerCase() === 'true',
  },
});
