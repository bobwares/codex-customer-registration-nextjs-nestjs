/**
 * App: Customer Registration
 * Package: api/src/database
 * File: data-source.ts
 * Version: 0.1.0
 * Turns: 2
 * Author: Codex Agent
 * Date: 2025-09-27T17:08:26Z
 * Exports: dataSourceOptions, AppDataSource
 * Description: Configures the TypeORM DataSource by loading environment variables and exposing
 *              migration and entity discovery for CLI operations.
 */
import { config } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

const envPath = resolve(process.cwd(), '.env');
if (existsSync(envPath)) {
  config({ path: envPath });
} else {
  config();
}

const requiredEnvVars = [
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
  'DATABASE_NAME',
];
const missingEnvVars = requiredEnvVars.filter((key) =>
  (process.env[key] ?? '').toString().trim() === '',
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required database environment variables: ${missingEnvVars.join(', ')}`,
  );
}

const isSslEnabled = (process.env.DATABASE_SSL ?? 'false')
  .toString()
  .toLowerCase() === 'true';

const databaseHost = process.env.DATABASE_HOST as string;
const databasePort = Number.parseInt(process.env.DATABASE_PORT ?? '5432', 10);
const databaseUser = process.env.DATABASE_USER as string;
const databasePassword = process.env.DATABASE_PASSWORD as string;
const databaseName = process.env.DATABASE_NAME as string;
const databaseSchema = process.env.DATABASE_SCHEMA ?? 'public';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: databaseHost,
  port: databasePort,
  username: databaseUser,
  password: databasePassword,
  database: databaseName,
  schema: databaseSchema,
  ssl: isSslEnabled ? { rejectUnauthorized: false } : false,
  synchronize: false,
  logging: false,
  entities: [resolve(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [resolve(__dirname, '..', 'migrations', '*.{ts,js}')],
  migrationsTableName: 'typeorm_migrations',
};

export const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
