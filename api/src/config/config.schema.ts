/**
 * # App: Customer Registration
 * # Package: api.config
 * # File: src/config/config.schema.ts
 * # Version: 0.1.0
 * # Turns: 1
 * # Author: AI Agent
 * # Date: 2025-09-18T19:33:35Z
 * # Exports: configValidationSchema
 * # Description: Declares Joi validation for environment variables consumed by the API runtime.
 */
import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().integer().min(1).max(65535).default(3000),
  LOG_LEVEL: Joi.string().valid('debug', 'info', 'warn', 'error').default('debug'),
  DATABASE_HOST: Joi.string().hostname().default('localhost'),
  DATABASE_PORT: Joi.number().integer().min(1).max(65535).default(5432),
  DATABASE_USER: Joi.string().min(1).default('postgres'),
  DATABASE_PASSWORD: Joi.string().min(1).default('postgres'),
  DATABASE_NAME: Joi.string().min(1).default('customer_domain'),
  DATABASE_SCHEMA: Joi.string().min(1).default('customer_domain'),
  DATABASE_SSL: Joi.boolean().truthy('true').falsy('false').default(false),
  DATABASE_URL: Joi.string().uri().optional(),
});
