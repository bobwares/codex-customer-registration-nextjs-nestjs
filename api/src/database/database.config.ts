/**
 * App: Customer Registration
 * Package: api/src/database
 * File: database.config.ts
 * Version: 0.1.0
 * Turns: 2
 * Author: Codex Agent
 * Date: 2025-09-20T04:22:15Z
 * Exports: buildDataSourceOptions, dataSourceOptions
 * Description: Builds TypeORM data source options based on environment
 *              configuration supporting PostgreSQL by default and SQLite for
 *              isolated testing scenarios.
 */
import type { DataSourceOptions } from 'typeorm';

type SupportedDrivers = 'postgres' | 'sqlite';

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key];
  if (!value && fallback === undefined) {
    throw new Error(`Missing required environment variable ${key}`);
  }
  return value ?? fallback ?? '';
}

export function buildDataSourceOptions(): DataSourceOptions {
  const driver = (process.env.DATABASE_TYPE ?? 'postgres') as SupportedDrivers;

  if (driver === 'sqlite') {
    return {
      type: 'sqlite',
      database: process.env.DATABASE_PATH ?? ':memory:',
      synchronize: true,
      entities: ['dist/**/*.entity.js', 'src/**/*.entity.ts'],
      migrations: ['dist/migrations/*.js', 'src/migrations/*.ts'],
    } satisfies DataSourceOptions;
  }

  return {
    type: 'postgres',
    host: getEnv('DATABASE_HOST', 'localhost'),
    port: parseInt(getEnv('DATABASE_PORT', '5432'), 10),
    username: getEnv('DATABASE_USERNAME', 'customer_service'),
    password: getEnv('DATABASE_PASSWORD', 'customer_service'),
    database: getEnv('DATABASE_NAME', 'customer_service'),
    schema: getEnv('DATABASE_SCHEMA', 'public'),
    ssl: getEnv('DATABASE_SSL', 'false') === 'true',
    synchronize: false,
    logging: false,
    entities: ['dist/**/*.entity.js', 'src/**/*.entity.ts'],
    migrations: ['dist/migrations/*.js', 'src/migrations/*.ts'],
    migrationsTableName: 'migrations',
  } satisfies DataSourceOptions;
}

export const dataSourceOptions = buildDataSourceOptions();
