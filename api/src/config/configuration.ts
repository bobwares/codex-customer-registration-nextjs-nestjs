/**
 * # App: Customer Registration API
 * # Package: api.src.config
 * # File: configuration.ts
 * # Version: 0.1.0
 * # Author: Codex Agent
 * # Date: 2025-01-01T00:00:00Z
 * # Description: Provides the configuration factory that maps environment variables to structured configuration
 * #              objects for the application and database settings.
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
