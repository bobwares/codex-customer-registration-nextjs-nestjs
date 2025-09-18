/**
 * App: Customer Registration
 * Package: api/src/customer/infrastructure
 * File: configuration.ts
 * Version: 0.1.0
 * Turns: [1]
 * Author: ChatGPT
 * Date: 2025-09-18T16:44:28Z
 * Exports: default configuration
 * Description: Provides structured configuration for the customer registration API.
 */
export default () => ({
  port: Number(process.env.PORT || 3001),
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    name: process.env.DB_NAME || 'customer_registration',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },
});
