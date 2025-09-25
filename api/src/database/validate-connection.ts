/**
 * App: Customer Registration
 * Package: api/src/database
 * File: validate-connection.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-25T19:36:06Z
 * Exports: (none)
 * Description: Verifies that the TypeORM DataSource can connect to the configured database.
 */
import { AppDataSource } from './data-source';

void (async () => {
  try {
    const dataSource = await AppDataSource.initialize();
    await dataSource.query('SELECT 1');
    await dataSource.destroy();
     
    console.log('DB connection OK');
  } catch (error) {
     
    console.error('DB connection failed', error);
    process.exitCode = 1;
  }
})();
