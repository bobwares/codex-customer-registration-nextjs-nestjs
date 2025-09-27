/**
 * # App: Customer Registration API
 * # Package: api.src.config
 * # File: validation.ts
 * # Version: 0.1.0
 * # Author: Codex Agent
 * # Date: 2025-01-01T00:00:00Z
 * # Description: Defines the Joi validation schema that verifies required environment variables for the
 * #              application and database configuration before the NestJS app boots.
 */
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  APP_NAME: Joi.string().default('backend'),
  PORT: Joi.number().integer().min(1).max(65535).default(3000),
  DATABASE_HOST: Joi.string().hostname().required(),
  DATABASE_PORT: Joi.number().integer().min(1).max(65535).default(5432),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().allow('').required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_SCHEMA: Joi.string().default('public'),
  DATABASE_SSL: Joi.boolean().truthy('true').falsy('false').default(false),
});
