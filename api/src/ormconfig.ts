/**
 * App: Customer Registration
 * Package: api/src
 * File: ormconfig.ts
 * Version: 0.1.0
 * Turns: 2
 * Author: Codex Agent
 * Date: 2025-09-20T04:22:15Z
 * Exports: default
 * Description: Constructs a TypeORM DataSource instance used by CLI commands
 *              for running and generating migrations.
 */
import { DataSource } from 'typeorm';
import { dataSourceOptions } from './database/database.config';

const dataSource = new DataSource({
  ...dataSourceOptions,
  entities: ['dist/**/*.entity.js', 'src/**/*.entity.ts'],
  migrations: ['dist/migrations/*.js', 'src/migrations/*.ts'],
});

export default dataSource;
