/**
 * App: Customer Registration
 * Package: api.scripts
 * File: scripts/run-migrations.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T00:12:49Z
 * Exports: none
 * Description: Command-line entry point to execute pending TypeORM migrations.
 */
import { appDataSource } from '../config/data-source';

async function run(): Promise<void> {
  await appDataSource.initialize();
  try {
    await appDataSource.runMigrations();
  } finally {
    await appDataSource.destroy();
  }
}

void run();
