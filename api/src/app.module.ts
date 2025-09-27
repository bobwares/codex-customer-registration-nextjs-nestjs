/**
 * # App: Customer Registration API
 * # Package: api.src
 * # File: app.module.ts
 * # Version: 0.1.0
 * # Author: Codex Agent
 * # Date: 2025-01-01T00:00:00Z
 * # Description: Defines the root AppModule that configures the global ConfigModule. The module loads configuration
 * #              values, sets the .env file path, and enforces Joi validation for environment variables.
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [configuration],
      validationSchema,
    }),
    HealthModule,
  ],
})
export class AppModule {}
