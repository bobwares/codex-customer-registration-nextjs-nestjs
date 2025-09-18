/**
 * App: Customer Registration
 * Package: api.config
 * File: config/data-source.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T00:12:49Z
 * Exports: appDataSource, resolveDataSourceOptions
 * Description: Constructs a TypeORM DataSource for running migrations outside the NestJS
 *              runtime.
 */
import { DataSource, DataSourceOptions } from 'typeorm';

import { Customer } from '../customers/customer.entity';
import { CustomerEmail } from '../customers/customer-email.entity';
import { CustomerPhoneNumber } from '../customers/customer-phone-number.entity';
import { PostalAddress } from '../customers/postal-address.entity';
import { PrivacySettings } from '../customers/privacy-settings.entity';

export function resolveDataSourceOptions(): DataSourceOptions {
  if (process.env.NODE_ENV === 'test') {
    return {
      type: 'sqlite',
      database: ':memory:',
      entities: [Customer, CustomerEmail, CustomerPhoneNumber, PostalAddress, PrivacySettings],
      synchronize: true,
    };
  }

  if (process.env.DATABASE_URL) {
    return {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Customer, CustomerEmail, CustomerPhoneNumber, PostalAddress, PrivacySettings],
      migrations: ['dist/migrations/*.js'],
      synchronize: false,
    };
  }

  const host = process.env.DB_HOST ?? 'localhost';
  const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432;
  const username = process.env.DB_USER ?? 'postgres';
  const password = process.env.DB_PASSWORD ?? 'postgres';
  const database = process.env.DB_NAME ?? 'customer_db';
  const schema = process.env.DB_SCHEMA ?? 'public';

  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    schema,
    entities: [Customer, CustomerEmail, CustomerPhoneNumber, PostalAddress, PrivacySettings],
    migrations: ['dist/migrations/*.js'],
    synchronize: false,
  };
}

export const appDataSource = new DataSource(resolveDataSourceOptions());
