/**
 * # App: Customer Registration API
 * # Package: api/src/database
 * # File: data-source.ts
 * # Version: 0.1.0
 * # Turns: 3
 * # Author: Codex Agent
 * # Date: 2025-09-30T17:20:00Z
 * # Exports: AppDataSource
 * # Description: TypeORM DataSource configured for CLI and runtime tooling with shared naming strategy.
 */
import 'reflect-metadata';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import {
  CustomerEmailEntity,
  CustomerEntity,
  CustomerPhoneNumberEntity,
  PostalAddressEntity,
  PrivacySettingsEntity,
} from '../customer/entities';

const envFiles = [
  resolve(__dirname, '..', '..', 'ai', 'context', '.env'),
  resolve(__dirname, '..', '..', '.env'),
];

envFiles
  .filter((filePath) => existsSync(filePath))
  .forEach((filePath) => {
    loadEnv({ path: filePath, override: false });
  });

const databaseHost = process.env.DATABASE_HOST ?? 'localhost';
const databasePort = Number(process.env.DATABASE_PORT ?? 5432);
const databaseUsername =
  process.env.DATABASE_USERNAME ?? process.env.DATABASE_USER ?? 'postgres';
const databasePassword = process.env.DATABASE_PASSWORD ?? '';
const databaseName = process.env.DATABASE_NAME ?? 'postgres';
const databaseSchema = process.env.DATABASE_SCHEMA ?? 'public';
const databaseSsl =
  (process.env.DATABASE_SSL ?? 'false').toString().toLowerCase() === 'true';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: databaseHost,
  port: databasePort,
  username: databaseUsername,
  password: databasePassword,
  database: databaseName,
  schema: databaseSchema,
  ssl: databaseSsl,
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  logging: false,
  entities: [
    CustomerEntity,
    CustomerEmailEntity,
    CustomerPhoneNumberEntity,
    PostalAddressEntity,
    PrivacySettingsEntity,
  ],
  migrations: ['dist/migrations/*.js'],
});
