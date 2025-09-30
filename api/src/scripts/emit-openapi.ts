/**
 * # App: Customer Registration API
 * # Package: api/src/scripts
 * # File: emit-openapi.ts
 * # Version: 0.1.0
 * # Turns: 4
 * # Author: Codex Agent
 * # Date: 2025-09-30T18:10:00Z
 * # Exports: none
 * # Description: Bootstraps a lightweight Nest application with stubbed providers to emit OpenAPI documents
 * #              in JSON and YAML formats for documentation tooling.
 */
import 'reflect-metadata';
import * as path from 'node:path';
import { promises as fs } from 'node:fs';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HealthModule } from '../health/health.module';
import { stringify } from 'yaml';
import { ProblemDetail } from '../common/http/problem-detail';
import { ResponseCustomerDto } from '../customer/dtos/response-customer.dto';
import {
  CustomerAddressDto,
  CustomerPhoneNumberDto,
  CustomerPrivacySettingsDto,
} from '../customer/dtos/create-customer.dto';
import { CustomerController } from '../customer/controllers/customer.controller';
import {
  CustomerService,
  CreateCustomerPayload,
  UpdateCustomerProfilePayload,
} from '../customer/services/customer.service';
import { CustomerEntity } from '../customer/entities';

const stubCustomerService = {
  createCustomer: async (_payload: CreateCustomerPayload): Promise<CustomerEntity> => {
    throw new Error('Not implemented');
  },
  listCustomers: async (): Promise<CustomerEntity[]> => {
    throw new Error('Not implemented');
  },
  findCustomerById: async (_id: string): Promise<CustomerEntity | null> => {
    throw new Error('Not implemented');
  },
  updateCustomerProfile: async (
    _id: string,
    _changes: UpdateCustomerProfilePayload,
  ): Promise<CustomerEntity> => {
    throw new Error('Not implemented');
  },
  deleteCustomer: async (_id: string): Promise<void> => {
    throw new Error('Not implemented');
  },
} as unknown as CustomerService;

@Module({
  imports: [HealthModule],
  controllers: [CustomerController],
  providers: [{ provide: CustomerService, useValue: stubCustomerService }],
})
class DocumentationModule {}

async function emit(): Promise<void> {
  const app = await NestFactory.create(DocumentationModule, { logger: false });
  await app.init();

  const pkg = JSON.parse(
    await fs.readFile(path.resolve(__dirname, '..', '..', 'package.json'), 'utf8'),
  ) as { version?: string };

  const config = new DocumentBuilder()
    .setTitle('Customer Registration API')
    .setDescription('HTTP API for managing the customer onboarding lifecycle.')
    .setVersion(pkg.version ?? '1.0.0')
    .addTag('Customer')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      ProblemDetail,
      ResponseCustomerDto,
      CustomerAddressDto,
      CustomerPhoneNumberDto,
      CustomerPrivacySettingsDto,
    ],
    deepScanRoutes: true,
  });

  const outputDir = path.resolve(__dirname, '..', '..', 'openapi');
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, 'openapi.json'), JSON.stringify(document, null, 2));
  await fs.writeFile(path.join(outputDir, 'openapi.yaml'), stringify(document));

  await app.close();
}

emit().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exitCode = 1;
});
