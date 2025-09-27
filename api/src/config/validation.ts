/**
 * App: Customer Registration
 * Package: api/src/config
 * File: validation.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-27T14:26:25Z
 * Exports: validationSchema
 * Description: Defines Joi validation schema to ensure required environment variables are provided with valid values.
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
