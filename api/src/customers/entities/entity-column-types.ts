/**
 * # App: Customer Registration
 * # Package: api.customers.entities
 * # File: src/customers/entities/entity-column-types.ts
 * # Version: 0.1.0
 * # Turns: 1
 * # Author: AI Agent
 * # Date: 2025-09-18T20:10:00Z
 * # Exports: TIMESTAMP_COLUMN_TYPE, UUID_COLUMN_TYPE
 * # Description: Shared column type helpers that provide SQLite-compatible mappings during automated tests.
 */
import { ColumnType } from 'typeorm';

const isTestEnvironment = (): boolean => process.env.NODE_ENV === 'test';

const resolveColumnType = (testType: ColumnType, defaultType: ColumnType): ColumnType =>
  (isTestEnvironment() ? testType : defaultType);

export const TIMESTAMP_COLUMN_TYPE: ColumnType = resolveColumnType('datetime', 'timestamptz');

export const UUID_COLUMN_TYPE: ColumnType = resolveColumnType('text', 'uuid');
