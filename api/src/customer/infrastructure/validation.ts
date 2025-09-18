/**
 * App: Customer Registration
 * Package: api/src/customer/infrastructure
 * File: validation.ts
 * Version: 0.1.0
 * Turns: [1]
 * Author: ChatGPT
 * Date: 2025-09-18T16:44:28Z
 * Exports: validationSchema
 * Description: Validates environment configuration using Joi schema definitions.
 */
import * as Joi from 'joi';

const validationSchema = Joi.object({
  PORT: Joi.number().default(3001),
  DB_HOST: Joi.string().hostname().required(),
  DB_PORT: Joi.number().default(5432),
  DB_NAME: Joi.string().default('customer_registration'),
  DB_USER: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().allow('').default('postgres'),
});

export default validationSchema;
