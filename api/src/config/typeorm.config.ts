/**
 * App: Customer Registration
 * Package: api.config
 * File: config/typeorm.config.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T00:12:49Z
 * Exports: buildTypeOrmOptions
 * Description: Provides dynamic TypeORM configuration leveraging the resolved database
 *              settings and registering all customer domain entities.
 */
import { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import databaseConfig from './database.config';
import { Customer } from '../customers/customer.entity';
import { CustomerEmail } from '../customers/customer-email.entity';
import { CustomerPhoneNumber } from '../customers/customer-phone-number.entity';
import { PostalAddress } from '../customers/postal-address.entity';
import { PrivacySettings } from '../customers/privacy-settings.entity';

export function buildTypeOrmOptions(
  config: ConfigType<typeof databaseConfig>,
): TypeOrmModuleOptions {
  const isTest = process.env.NODE_ENV === 'test';
  if (isTest) {
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
      schema: config.schema,
      autoLoadEntities: false,
      entities: [Customer, CustomerEmail, CustomerPhoneNumber, PostalAddress, PrivacySettings],
      migrationsRun: false,
      synchronize: false,
      ssl: config.ssl ? { rejectUnauthorized: false } : undefined,
    };
  }

  return {
    type: 'postgres',
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database,
    schema: config.schema,
    autoLoadEntities: false,
    entities: [Customer, CustomerEmail, CustomerPhoneNumber, PostalAddress, PrivacySettings],
    migrationsRun: false,
    synchronize: false,
    ssl: config.ssl ? { rejectUnauthorized: false } : undefined,
  };
}

export type DatabaseConfig = ConfigType<typeof databaseConfig>;
export { databaseConfig };
