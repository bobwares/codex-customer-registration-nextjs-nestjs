/**
 * # App: Customer Registration
 * # Package: api.config
 * # File: src/ormconfig.ts
 * # Version: 0.1.1
 * # Turns: 1
 * # Author: AI Agent
 * # Date: 2025-09-18T19:47:41Z
 * # Exports: createOrmConfig
 * # Description: Builds the TypeORM connection options using environment-aware configuration values.
 */
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppConfig } from './config/configuration';
import { CustomerEmail } from './customers/entities/customer-email.entity';
import { CustomerPhoneNumber } from './customers/entities/customer-phone-number.entity';
import { Customer } from './customers/entities/customer.entity';
import { PostalAddress } from './customers/entities/postal-address.entity';
import { PrivacySettings } from './customers/entities/privacy-settings.entity';

export const createOrmConfig = (configService: ConfigService<AppConfig>): TypeOrmModuleOptions => {
  const nodeEnv = process.env.NODE_ENV ?? 'development';

  if (nodeEnv === 'test') {
    return {
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [Customer, CustomerEmail, CustomerPhoneNumber, PostalAddress, PrivacySettings],
      synchronize: true,
      logging: false,
    } satisfies TypeOrmModuleOptions;
  }

  const databaseConfig = configService.get('database', { infer: true });

  const sslOption = databaseConfig?.ssl
    ? {
        rejectUnauthorized: false,
      }
    : undefined;

  return {
    type: 'postgres',
    host: databaseConfig?.host,
    port: databaseConfig?.port,
    username: databaseConfig?.user,
    password: databaseConfig?.password,
    database: databaseConfig?.name,
    schema: databaseConfig?.schema,
    ssl: sslOption,
    autoLoadEntities: false,
    synchronize: false,
    entities: [Customer, CustomerEmail, CustomerPhoneNumber, PostalAddress, PrivacySettings],
    migrations: [],
  } satisfies TypeOrmModuleOptions;
};
