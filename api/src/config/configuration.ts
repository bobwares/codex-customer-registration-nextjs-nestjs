/**
 * # App: Customer Registration
 * # Package: api.config
 * # File: src/config/configuration.ts
 * # Version: 0.1.0
 * # Turns: 1
 * # Author: AI Agent
 * # Date: 2025-09-18T19:33:35Z
 * # Exports: configuration
 * # Description: Maps environment variables to strongly typed configuration segments consumed throughout the API.
 */
export interface HttpConfig {
  port: number;
  logLevel: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  name: string;
  schema: string;
  ssl: boolean;
}

export interface AppConfig {
  http: HttpConfig;
  database: DatabaseConfig;
}

export const configuration = (): AppConfig => ({
  http: {
    port: parseInt(process.env.PORT ?? '3000', 10),
    logLevel: process.env.LOG_LEVEL ?? 'debug',
  },
  database: {
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    user: process.env.DATABASE_USER ?? 'postgres',
    password: process.env.DATABASE_PASSWORD ?? 'postgres',
    name: process.env.DATABASE_NAME ?? 'customer_domain',
    schema: process.env.DATABASE_SCHEMA ?? 'customer_domain',
    ssl: (process.env.DATABASE_SSL ?? 'false').toLowerCase() === 'true',
  },
});
