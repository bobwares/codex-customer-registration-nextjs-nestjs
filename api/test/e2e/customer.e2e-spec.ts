/**
 * App: Customer Registration
 * Package: api/test/e2e
 * File: customer.e2e-spec.ts
 * Version: 0.2.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T20:33:11Z
 * Exports: (none)
 * Description: Verifies the customer CRUD HTTP endpoints end-to-end using an in-memory SQLite database and Supertest client.
 */
import { BadRequestException, INestApplication, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import request = require('supertest');
import type { ValidationError } from 'class-validator';
import { CustomerModule } from '../../src/customer/customer.module';
import { CustomerEntity } from '../../src/customer/entities/customer.entity';
import { CustomerEmailEntity } from '../../src/customer/entities/customer_email.entity';
import { CustomerPhoneNumberEntity } from '../../src/customer/entities/customer_phone_number.entity';
import { PostalAddressEntity } from '../../src/customer/entities/postal_address.entity';
import { PrivacySettingsEntity } from '../../src/customer/entities/privacy_settings.entity';
import { CustomerProfileView } from '../../src/customer/entities/customer_profile_view.entity';
import { RequestIdMiddleware } from '../../src/common/middleware/request-id.middleware';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import type { PinoLogger } from 'nestjs-pino';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { NextFunction, Request, Response } from 'express';

const loggerStub: PinoLogger = {
  setContext: () => undefined,
  assign: () => undefined,
  child: () => loggerStub,
  debug: () => undefined,
  error: () => undefined,
  fatal: () => undefined,
  info: () => undefined,
  trace: () => undefined,
  warn: () => undefined,
} as unknown as PinoLogger;

describe('CustomerController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [
        PostalAddressEntity,
        PrivacySettingsEntity,
        CustomerEntity,
        CustomerEmailEntity,
        CustomerPhoneNumberEntity,
        CustomerProfileView,
      ],
      synchronize: true,
    });
    await dataSource.initialize();

    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'sqlite',
            database: ':memory:',
            dropSchema: true,
            entities: [
              PostalAddressEntity,
              PrivacySettingsEntity,
              CustomerEntity,
              CustomerEmailEntity,
              CustomerPhoneNumberEntity,
              CustomerProfileView,
            ],
            synchronize: true,
          }),
          dataSourceFactory: async () => dataSource,
        }),
        CustomerModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    const validationPipe = new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = formatValidationErrors(errors);
        if (containsWhitelistViolations(errors)) {
          return new BadRequestException(messages);
        }
        return new UnprocessableEntityException(messages);
      },
    });
    app.useGlobalPipes(validationPipe);
    app.useGlobalFilters(new HttpExceptionFilter(loggerStub));
    const requestIdMiddleware = new RequestIdMiddleware();
    app.use((req: Request, res: Response, next: NextFunction) => requestIdMiddleware.use(req, res, next));

    const swaggerConfig = new DocumentBuilder()
      .setTitle('Customer Registration API')
      .setDescription('REST API for managing customer onboarding records.')
      .setVersion('test')
      .addTag('Customer')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('/api/docs', app, document);
    const httpServer = app.getHttpAdapter().getInstance();
    httpServer.get('/api/openapi.json', (_: unknown, res: { json: (body: unknown) => void }) => {
      res.json(document);
    });

    await app.init();
  });

  beforeEach(async () => {
    await dataSource.synchronize(true);
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /customers creates a customer', async () => {
    const response = await request(app.getHttpServer())
      .post('/customers')
      .send(buildCreatePayload())
      .expect(201);

    expect(response.body).toMatchObject({
      firstName: 'Jane',
      lastName: 'Doe',
      emails: ['jane.doe@example.com', 'jane.work@example.com'],
    });
    expect(response.headers['x-request-id']).toBeDefined();
  });

  it('GET /customers/:id returns the persisted customer', async () => {
    const createResponse = await request(app.getHttpServer()).post('/customers').send(buildCreatePayload());

    const response = await request(app.getHttpServer())
      .get(`/customers/${createResponse.body.id}`)
      .expect(200);

    expect(response.body.id).toEqual(createResponse.body.id);
    expect(response.body.primaryEmail).toBe('jane.doe@example.com');
  });

  it('PUT /customers/:id updates fields', async () => {
    const createResponse = await request(app.getHttpServer()).post('/customers').send(buildCreatePayload());

    const response = await request(app.getHttpServer())
      .put(`/customers/${createResponse.body.id}`)
      .send({ lastName: 'Smith', emails: ['jane.smith@example.com'] })
      .expect(200);

    expect(response.body.lastName).toBe('Smith');
    expect(response.body.primaryEmail).toBe('jane.smith@example.com');
  });

  it('DELETE /customers/:id removes the record', async () => {
    const createResponse = await request(app.getHttpServer()).post('/customers').send(buildCreatePayload());

    await request(app.getHttpServer()).delete(`/customers/${createResponse.body.id}`).expect(204);
    await request(app.getHttpServer()).get(`/customers/${createResponse.body.id}`).expect(404);
  });

  it('POST /customers rejects unknown fields with 400', async () => {
    const response = await request(app.getHttpServer())
      .post('/customers')
      .send({
        ...buildCreatePayload(),
        unknownField: 'value',
      })
      .expect(400);

    const messages = normalizeMessages(response.body.message);
    expect(messages).toEqual(expect.arrayContaining([expect.stringContaining('unknownField should not exist')]));
  });

  it('POST /customers enforces validation rules with 422', async () => {
    const response = await request(app.getHttpServer())
      .post('/customers')
      .send({
        ...buildCreatePayload(),
        emails: ['not-an-email'],
      })
      .expect(422);

    const messages = normalizeMessages(response.body.message);
    expect(messages).toEqual(expect.arrayContaining([expect.stringContaining('emails must be an email')]));
  });

  it('GET /api/openapi.json returns documented paths', async () => {
    const response = await request(app.getHttpServer()).get('/api/openapi.json').expect(200);
    expect(response.body.paths['/customers']).toBeDefined();
    expect(response.body.paths['/customers/{id}']).toBeDefined();
  });
});

function buildCreatePayload() {
  return {
    firstName: 'Jane',
    middleName: 'Q.',
    lastName: 'Doe',
    emails: ['jane.doe@example.com', 'jane.work@example.com'],
    phoneNumbers: [
      {
        type: 'mobile',
        number: '+15551234567',
      },
    ],
    address: {
      line1: '123 Market Street',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94103',
      country: 'US',
    },
    privacySettings: {
      marketingEmailsEnabled: true,
      twoFactorEnabled: false,
    },
  };
}

function normalizeMessages(message: unknown): string[] {
  if (Array.isArray(message)) {
    return message;
  }
  if (typeof message === 'string') {
    return [message];
  }
  return [];
}

function formatValidationErrors(errors: ValidationError[]): string[] {
  return errors
    .map((error) => {
      if (error.constraints) {
        return Object.values(error.constraints);
      }
      if (error.children?.length) {
        return formatValidationErrors(error.children);
      }
      return [`${error.property} is invalid`];
    })
    .flat();
}

function containsWhitelistViolations(errors: ValidationError[]): boolean {
  return errors.some((error) => {
    if (error.constraints) {
      return Object.keys(error.constraints).some((constraint) =>
        ['whitelistValidation', 'forbiddenProperty'].includes(constraint),
      );
    }
    return error.children ? containsWhitelistViolations(error.children) : false;
  });
}
