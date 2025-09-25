/**
 * App: Customer Registration
 * Package: api
 * File: validate-connection.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-25T06:25:09Z
 * Exports: (script)
 * Description: CLI helper that attempts to establish and close a TypeORM
 *              connection, emitting the outcome for CI diagnostics.
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
