/**
 * App: Customer Registration
 * Package: api
 * File: data-source.ts
 * Version: 0.2.0
 * Turns: 2-3
 * Author: Codex Agent
 * Date: 2025-09-25T06:25:09Z
 * Exports: AppDataSource, getDataSourceOptions
 * Description: Centralizes TypeORM configuration with environment-driven
 *              settings and reusable helpers for CLI and Nest modules.
 */
import 'reflect-metadata';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { DataSource, DataSourceOptions, DefaultNamingStrategy } from 'typeorm';
import { snakeCase } from '../utilities/snake-case';
import * as dotenv from 'dotenv';

class SnakeNamingStrategy extends DefaultNamingStrategy {
  tableName(className: string, customName?: string): string {
    return customName ?? snakeCase(className);
  }

  columnName(propertyName: string, customName?: string, embeddedPrefixes: string[] = []): string {
    const prefix = embeddedPrefixes.map((prefixPart) => snakeCase(prefixPart)).join('');
    return snakeCase(prefix + (customName ?? propertyName));
  }

  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }
}

const envPath = path.resolve(__dirname, '..', '..', '..', 'ai', 'context', '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

function ensureEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(`Database configuration is incomplete. Missing environment variable ${name}.`);
  }
  return value;
}

function getBool(name: string, defaultValue = false): boolean {
  const value = process.env[name];
  if (value === undefined) {
    return defaultValue;
  }
  return value.toLowerCase() === 'true';
}

function getInt(name: string, defaultValue?: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === '') {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Database configuration is incomplete. Missing environment variable ${name}.`);
  }
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    throw new Error(`${name} must be a valid integer. Received: ${raw}`);
  }
  return parsed;
}

export function getDataSourceOptions(): DataSourceOptions {
  const isTsEnv = __filename.endsWith('.ts');
  const schema = process.env.DATABASE_SCHEMA;
  const options: DataSourceOptions = {
    type: 'postgres',
    host: ensureEnv('DATABASE_HOST'),
    port: getInt('DATABASE_PORT'),
    username: ensureEnv('DATABASE_USERNAME'),
    password: ensureEnv('DATABASE_PASSWORD'),
    database: ensureEnv('DATABASE_NAME'),
    schema: schema && schema !== '' ? schema : undefined,
    synchronize: false,
    logging: false,
    namingStrategy: new SnakeNamingStrategy(),
    entities: [
      path.resolve(__dirname, '..', '**', isTsEnv ? '*.entity.ts' : '*.entity.js'),
    ],
    migrations: [
      path.resolve(
        __dirname,
        '..',
        '..',
        isTsEnv ? 'migrations',
        isTsEnv ? '*.ts' : '*.js',
      ),
    ],
    migrationsRun: false,
    extra: getBool('DATABASE_SSL')
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : undefined,
  };

  return options;
}

export const AppDataSource = new DataSource(getDataSourceOptions());
