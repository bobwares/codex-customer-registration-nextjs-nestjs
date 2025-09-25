/**
 * App: Customer Registration
 * Package: api/src/database
 * File: data-source.ts
 * Version: 0.1.3
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-25T19:36:06Z
 * Exports: AppDataSource, getDataSourceOptions
 * Description: Configures the shared TypeORM DataSource using environment variables from ai/context/.env.
 */
import 'reflect-metadata';
import * as path from 'node:path';
import * as dotenv from 'dotenv';
import type { DataSourceOptions } from 'typeorm';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { CustomerEntity } from '../customer/entities/customer.entity';
import { CustomerEmailEntity } from '../customer/entities/customer_email.entity';
import { CustomerPhoneNumberEntity } from '../customer/entities/customer_phone_number.entity';
import { PostalAddressEntity } from '../customer/entities/postal_address.entity';
import { PrivacySettingsEntity } from '../customer/entities/privacy_settings.entity';
import { CustomerProfileView } from '../customer/entities/customer_profile_view.entity';

dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', 'ai', 'context', '.env') });

const REQUIRED_ENV_VARS = [
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_USERNAME',
  'DATABASE_PASSWORD',
  'DATABASE_NAME',
];

const OPTIONAL_ENV_VARS = ['DATABASE_SCHEMA', 'DATABASE_SSL'];

type EnvValueOptions = {
  fallback?: string;
  optional?: boolean;
};

function getEnv(name: string, options: EnvValueOptions = {}): string {
  const value = process.env[name];
  if ((value === undefined || value === '') && !options.optional) {
    throw new Error(
      `Database configuration is incomplete. Missing ${name}. Ensure it exists in ai/context/.env`,
    );
  }
  return value ?? options.fallback ?? '';
}

function getInt(name: string, fallback?: number): number {
  const value = process.env[name];
  if (value === undefined || value === '') {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(
      `Database configuration is incomplete. Missing ${name}. Ensure it exists in ai/context/.env`,
    );
  }
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`${name} must be an integer but received "${value}".`);
  }
  return parsed;
}

function getBool(name: string, fallback = false): boolean {
  const value = process.env[name];
  if (value === undefined || value === '') {
    return fallback;
  }
  return value.toLowerCase() === 'true';
}

export function getDataSourceOptions(): DataSourceOptions {
  REQUIRED_ENV_VARS.forEach((key) => getEnv(key));
  OPTIONAL_ENV_VARS.forEach((key) => getEnv(key, { optional: true }));

  const schema = getEnv('DATABASE_SCHEMA', { optional: true });
  const sslEnabled = getBool('DATABASE_SSL');
  const isCompiled = __filename.endsWith('.js');

  const options: DataSourceOptions = {
    type: 'postgres',
    host: getEnv('DATABASE_HOST'),
    port: getInt('DATABASE_PORT'),
    username: getEnv('DATABASE_USERNAME'),
    password: getEnv('DATABASE_PASSWORD'),
    database: getEnv('DATABASE_NAME'),
    synchronize: false,
    logging: false,
    namingStrategy: new SnakeNamingStrategy(),
    entities: [
      PostalAddressEntity,
      PrivacySettingsEntity,
      CustomerEntity,
      CustomerEmailEntity,
      CustomerPhoneNumberEntity,
      CustomerProfileView,
    ],
    migrations: [
      isCompiled
        ? path.resolve(__dirname, '..', 'migrations', '*.js')
        : path.resolve(__dirname, '..', 'migrations', '*.ts'),
    ],
  };

  if (schema) {
    (options as { schema?: string }).schema = schema;
  }
  if (sslEnabled) {
    (options as { ssl?: boolean | Record<string, unknown> }).ssl = { rejectUnauthorized: false };
  }

  return options;
}

export const AppDataSource = new DataSource(getDataSourceOptions());
