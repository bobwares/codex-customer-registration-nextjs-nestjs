/**
 * App: Customer Registration
 * Package: api
 * File: validate-connection.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-24T22:04:40Z
 * Exports: (script)
 * Description: Validates the configured TypeORM connection by executing a lightweight query.
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
