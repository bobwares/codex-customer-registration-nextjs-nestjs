/**
 * App: Customer Registration
 * Package: api
 * File: data-source.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-24T22:04:40Z
 * Exports: AppDataSource,getDataSourceOptions
 * Description: Configures the shared TypeORM DataSource using environment variables sourced from ai/context/.env.
 */
import 'reflect-metadata';
import * as path from 'node:path';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

const envPath = path.resolve(__dirname, '../../..', 'ai', 'context', '.env');
dotenv.config({ path: envPath });

const requiredEnv = [
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_USERNAME',
  'DATABASE_PASSWORD',
  'DATABASE_NAME',
  'DATABASE_SCHEMA',
  'DATABASE_SSL',
];

const missingEnv = requiredEnv.filter((key) => !(process.env[key] && process.env[key] !== ''));

if (missingEnv.length > 0) {
  const details = missingEnv.map((key) => `- ${key}`).join('\n');
  throw new Error(
    `Database configuration is incomplete. Provide the following variables in ai/context/.env:\n${details}`,
  );
}

const sslEnabled = String(process.env.DATABASE_SSL).toLowerCase() === 'true';

export function getDataSourceOptions(): DataSourceOptions {
  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT ?? 5432),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    schema: process.env.DATABASE_SCHEMA,
    ssl: sslEnabled,
    entities:
      process.env.NODE_ENV === 'production'
        ? ['dist/**/*.entity.js']
        : ['src/**/*.entity.ts'],
    migrations: ['dist/migrations/*.js'],
    synchronize: false,
    logging: false,
  };
}

export const AppDataSource = new DataSource(getDataSourceOptions());
