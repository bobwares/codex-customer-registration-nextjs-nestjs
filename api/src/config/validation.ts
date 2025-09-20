/**
 * App: Customer Registration
 * Package: api/src/config
 * File: validation.ts
 * Version: 0.1.0
 * Turns: 2
 * Author: Codex Agent
 * Date: 2025-09-20T04:22:15Z
 * Exports: validationSchema
 * Description: Joi validation schema ensuring required environment variables
 *              for database connectivity are present and typed correctly.
 */
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  DATABASE_TYPE: Joi.string().valid('postgres', 'sqlite').default('postgres'),
  DATABASE_HOST: Joi.when('DATABASE_TYPE', {
    is: 'postgres',
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  DATABASE_PORT: Joi.when('DATABASE_TYPE', {
    is: 'postgres',
    then: Joi.number().default(5432),
    otherwise: Joi.number().optional(),
  }),
  DATABASE_USERNAME: Joi.when('DATABASE_TYPE', {
    is: 'postgres',
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  DATABASE_PASSWORD: Joi.when('DATABASE_TYPE', {
    is: 'postgres',
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  DATABASE_NAME: Joi.when('DATABASE_TYPE', {
    is: 'postgres',
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  DATABASE_SCHEMA: Joi.string().default('public'),
  DATABASE_SSL: Joi.boolean().default(false),
  DATABASE_PATH: Joi.string().optional(),
});
