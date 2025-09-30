/**
 * # App: Customer Registration API
 * # Package: api/test
 * # File: customers.e2e-spec.ts
 * # Version: 0.1.0
 * # Turns: 4
 * # Author: Codex Agent
 * # Date: 2025-09-30T18:10:00Z
 * # Description: End-to-end tests validating CRUD operations for the customer API and OpenAPI document emission
 * #              using in-memory service stubs.
 * #
 * # Test Suites
 * # - Customer E2E: Boots a testing module with stubbed services to exercise RESTful CRUD flows and spec routes.
 */
import { INestApplication, ValidationPipe, HttpStatus, Module } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as request from 'supertest';
import { JsonLogger } from '../src/common/logging/json-logger.service';
import { HttpExceptionFilter, ProblemDetail } from '../src/common/http';
import { ResponseCustomerDto } from '../src/customer/dtos/response-customer.dto';
import { CustomerAddressDto, CustomerPhoneNumberDto, CustomerPrivacySettingsDto } from '../src/customer/dtos/create-customer.dto';
import {
  CustomerService,
  CreateCustomerPayload,
  UpdateCustomerProfilePayload,
} from '../src/customer/services/customer.service';
import {
  CustomerEmailEntity,
  CustomerEntity,
  CustomerPhoneNumberEntity,
  PostalAddressEntity,
  PrivacySettingsEntity,
} from '../src/customer/entities';
import { CustomerController } from '../src/customer/controllers/customer.controller';

class InMemoryCustomerService {
  private readonly customers = new Map<string, CustomerEntity>();
  private privacyId = 1;
  private addressId = 1;
  private emailId = 1;
  private phoneId = 1;

  async createCustomer(payload: CreateCustomerPayload): Promise<CustomerEntity> {
    const entity = this.buildEntity(payload.customerId, payload);
    this.customers.set(payload.customerId, entity);
    return this.clone(entity);
  }

  async listCustomers(): Promise<CustomerEntity[]> {
    return [...this.customers.values()]
      .sort((a, b) => `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`))
      .map((entity) => this.clone(entity));
  }

  async findCustomerById(customerId: string): Promise<CustomerEntity | null> {
    const found = this.customers.get(customerId);
    return found ? this.clone(found) : null;
  }

  async updateCustomerProfile(
    customerId: string,
    changes: UpdateCustomerProfilePayload,
  ): Promise<CustomerEntity> {
    const existing = this.customers.get(customerId);
    if (!existing) {
      throw new Error('Customer not found');
    }

    if (changes.firstName !== undefined) {
      existing.firstName = changes.firstName;
    }
    if (changes.middleName !== undefined) {
      existing.middleName = changes.middleName ?? null;
    }
    if (changes.lastName !== undefined) {
      existing.lastName = changes.lastName;
    }
    if (changes.address !== undefined) {
      existing.address = changes.address ? this.buildAddress(changes.address) : null;
    }
    if (changes.privacySettings) {
      existing.privacySettings = this.buildPrivacy(
        changes.privacySettings,
        existing.privacySettings.privacySettingsId,
      );
    }
    if (changes.emails) {
      existing.emails = changes.emails.map((email) => this.buildEmail(customerId, email));
    }
    if (changes.phoneNumbers) {
      existing.phoneNumbers = changes.phoneNumbers.map((phone) => this.buildPhone(customerId, phone));
    }

    this.customers.set(customerId, existing);
    return this.clone(existing);
  }

  async deleteCustomer(customerId: string): Promise<void> {
    this.customers.delete(customerId);
  }

  // Helper builders
  private buildEntity(id: string, payload: CreateCustomerPayload): CustomerEntity {
    const entity = new CustomerEntity();
    entity.customerId = id;
    entity.firstName = payload.firstName;
    entity.middleName = payload.middleName ?? null;
    entity.lastName = payload.lastName;
    entity.address = payload.address ? this.buildAddress(payload.address) : null;
    entity.privacySettings = this.buildPrivacy(payload.privacySettings);
    entity.emails = (payload.emails ?? []).map((email) => this.buildEmail(id, email));
    entity.phoneNumbers = (payload.phoneNumbers ?? []).map((phone) => this.buildPhone(id, phone));
    return entity;
  }

  private buildAddress(address: CustomerAddressDto): PostalAddressEntity {
    const entity = new PostalAddressEntity();
    entity.addressId = this.addressId++;
    entity.line1 = address.line1;
    entity.line2 = address.line2 ?? null;
    entity.city = address.city;
    entity.state = address.state;
    entity.postalCode = address.postalCode;
    entity.country = address.country;
    return entity;
  }

  private buildPrivacy(
    settings: Partial<CustomerPrivacySettingsDto>,
    id = this.privacyId++,
  ): PrivacySettingsEntity {
    const entity = new PrivacySettingsEntity();
    entity.privacySettingsId = id;
    entity.marketingEmailsEnabled = settings.marketingEmailsEnabled ?? false;
    entity.twoFactorEnabled = settings.twoFactorEnabled ?? false;
    return entity;
  }

  private buildEmail(customerId: string, email: string): CustomerEmailEntity {
    const entity = new CustomerEmailEntity();
    entity.emailId = this.emailId++;
    entity.customerId = customerId;
    entity.email = email;
    return entity;
  }

  private buildPhone(customerId: string, phone: CustomerPhoneNumberDto): CustomerPhoneNumberEntity {
    const entity = new CustomerPhoneNumberEntity();
    entity.phoneId = this.phoneId++;
    entity.customerId = customerId;
    entity.type = phone.type;
    entity.number = phone.number;
    return entity;
  }

  private clone(entity: CustomerEntity): CustomerEntity {
    return JSON.parse(JSON.stringify(entity));
  }
}

describe('Customer CRUD (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const service = new InMemoryCustomerService();

    @Module({
      controllers: [CustomerController],
      providers: [
        JsonLogger,
        { provide: CustomerService, useValue: service },
      ],
    })
    class CustomerTestModule {}

    const moduleRef = await Test.createTestingModule({
      imports: [CustomerTestModule],
    }).compile();

    app = moduleRef.createNestApplication();
    const jsonLogger = app.get(JsonLogger);
    jsonLogger.configure(['error', 'warn', 'log']);
    app.useLogger(jsonLogger);
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    const httpAdapterHost = app.get(HttpAdapterHost);
    app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost, jsonLogger));

    const swaggerConfig = new DocumentBuilder()
      .setTitle('Customer Registration API')
      .setDescription('HTTP API for managing the customer onboarding lifecycle.')
      .setVersion('0.0.1-test')
      .addTag('Customer')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig, {
      extraModels: [
        ProblemDetail,
        ResponseCustomerDto,
        CustomerAddressDto,
        CustomerPhoneNumberDto,
        CustomerPrivacySettingsDto,
      ],
      deepScanRoutes: true,
    });
    SwaggerModule.setup('api/docs', app, document, {
      jsonDocumentUrl: '/api/openapi.json',
      yamlDocumentUrl: '/api/openapi.yaml',
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('performs full CRUD workflow', async () => {
    const payload = {
      id: '2e425f69-a29f-4bc5-9f9e-0c49230fdaa2',
      firstName: 'Ada',
      lastName: 'Lovelace',
      emails: ['ada@example.com'],
      phoneNumbers: [{ type: 'mobile', number: '+447911123456' }],
      address: {
        line1: '12 Analytical Engine Way',
        city: 'London',
        state: 'London',
        postalCode: 'SW1A 1AA',
        country: 'GB',
      },
      privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: true },
    };

    const created = await request(app.getHttpServer()).post('/customers').send(payload).expect(HttpStatus.CREATED);
    expect(created.body).toMatchObject({ id: payload.id, firstName: 'Ada' });

    const fetched = await request(app.getHttpServer()).get(`/customers/${payload.id}`).expect(HttpStatus.OK);
    expect(fetched.body).toMatchObject({ id: payload.id, address: expect.objectContaining({ city: 'London' }) });

    await request(app.getHttpServer())
      .put(`/customers/${payload.id}`)
      .send({ firstName: 'Augusta', privacySettings: { marketingEmailsEnabled: false, twoFactorEnabled: true } })
      .expect(HttpStatus.OK);

    const list = await request(app.getHttpServer()).get('/customers').expect(HttpStatus.OK);
    expect(list.body).toHaveLength(1);
    expect(list.body[0]).toMatchObject({ firstName: 'Augusta' });

    await request(app.getHttpServer()).delete(`/customers/${payload.id}`).expect(HttpStatus.NO_CONTENT);
    await request(app.getHttpServer()).get(`/customers/${payload.id}`).expect(HttpStatus.NOT_FOUND);
  });

  it('exposes generated OpenAPI specification', async () => {
    const response = await request(app.getHttpServer()).get('/api/openapi.json').expect(HttpStatus.OK);
    expect(response.body.paths['/customers']).toBeDefined();
    expect(response.body.paths['/customers/{id}']).toBeDefined();
  });
});
