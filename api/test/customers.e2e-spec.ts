/**
 * App: Customer Registration
 * Package: api
 * File: customers.e2e-spec.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T06:25:09Z
 * Exports: (tests)
 * Description: End-to-end tests that exercise the customer CRUD HTTP endpoints
 *              using an in-memory PostgreSQL emulator.
 */
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import * as request from 'supertest';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomerModule } from '../src/customer/customer.module';
import { Customer } from '../src/customer/entities/customer.entity';
import { PostalAddress } from '../src/customer/entities/postal-address.entity';
import { PrivacySettings } from '../src/customer/entities/privacy-settings.entity';
import { CustomerEmail } from '../src/customer/entities/customer-email.entity';
import { CustomerPhoneNumber } from '../src/customer/entities/customer-phone-number.entity';
import { HealthModule } from '../src/health/health.module';

jest.setTimeout(20000);

const entities = [Customer, PostalAddress, PrivacySettings, CustomerEmail, CustomerPhoneNumber];

describe('CustomerController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    const db = newDb({ autoCreateForeignKeyIndices: true });
    db.public.registerFunction({ name: 'version', returns: DataType.text, implementation: () => 'PostgreSQL 16' });
    db.public.registerFunction({ name: 'current_database', returns: DataType.text, implementation: () => 'customer_registration' });
    db.public.registerFunction({
      name: 'obj_description',
      args: [DataType.regclass, DataType.text],
      returns: DataType.text,
      implementation: () => null,
    });
    moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: async () => ({
            type: 'postgres',
            entities,
            synchronize: true,
          }),
          dataSourceFactory: async (options) => {
            dataSource = await db.adapters.createTypeormDataSource(options);
            await dataSource.initialize();
            await dataSource.query('CREATE SCHEMA IF NOT EXISTS customer_domain');
            await dataSource.synchronize();
            return dataSource;
          },
        }),
        CustomerModule,
        HealthModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true, forbidUnknownValues: true }),
    );

    const config = new DocumentBuilder().setTitle('Test API').setVersion('1.0.0').build();
    const document = SwaggerModule.createDocument(app, config, {
      include: [CustomerModule, HealthModule],
    });
    const httpAdapter = app.getHttpAdapter();
    httpAdapter.get('/api/openapi.json', (req: unknown, res: any) => res.json(document));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await moduleRef.close();
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  });

  afterEach(async () => {
    await dataSource.getRepository(CustomerEmail).delete({});
    await dataSource.getRepository(CustomerPhoneNumber).delete({});
    await dataSource.getRepository(Customer).delete({});
    await dataSource.getRepository(PostalAddress).delete({});
    await dataSource.getRepository(PrivacySettings).delete({});
  });

  it('supports the full CRUD lifecycle', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/customers')
      .send({
        firstName: 'Dana',
        lastName: 'Lopez',
        emails: ['dana@example.com'],
        phoneNumbers: [{ type: 'mobile', number: '+15555550105' }],
        address: {
          line1: '30 Main St',
          city: 'Austin',
          state: 'TX',
          postalCode: '73301',
          country: 'US',
        },
        privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: false },
      })
      .expect(HttpStatus.CREATED);

    const customerId = createResponse.body.id;
    expect(customerId).toBeDefined();

    const listResponse = await request(app.getHttpServer()).get('/customers').expect(200);
    expect(listResponse.body).toHaveLength(1);

    const getResponse = await request(app.getHttpServer())
      .get(`/customers/${customerId}`)
      .expect(200);
    expect(getResponse.body.firstName).toBe('Dana');

    await request(app.getHttpServer())
      .put(`/customers/${customerId}`)
      .send({
        firstName: 'Danielle',
        emails: ['dana@example.com', 'danielle@example.com'],
        phoneNumbers: [{ type: 'home', number: '+15555550106' }],
        privacySettings: { marketingEmailsEnabled: false, twoFactorEnabled: true },
      })
      .expect(200);

    await request(app.getHttpServer()).delete(`/customers/${customerId}`).expect(204);
  });

  it('exposes the OpenAPI document', async () => {
    const response = await request(app.getHttpServer()).get('/api/openapi.json').expect(200);
    expect(response.body.paths['/customers']).toBeDefined();
    expect(response.body.info.version).toBe('1.0.0');
  });
});
