/**
 * # App: Customer Registration API
 * # Package: api/src/database
 * # File: validate-connection.ts
 * # Version: 0.1.0
 * # Turns: 3
 * # Author: Codex Agent
 * # Date: 2025-09-30T17:20:00Z
 * # Description: CLI utility that validates the TypeORM connection configuration using a lightweight query.
 */
import { AppDataSource } from './data-source';

(async () => {
  try {
    const dataSource = await AppDataSource.initialize();
    await dataSource.query('SELECT 1');
    await dataSource.destroy();
    // eslint-disable-next-line no-console
    console.log('DB connection OK');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('DB connection failed', error);
    process.exit(1);
  }
})();
