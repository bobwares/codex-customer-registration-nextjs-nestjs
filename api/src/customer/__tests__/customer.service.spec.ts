/**
 * App: Customer Registration
 * Package: api
 * File: customer.service.spec.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-24T22:07:12Z
 * Exports: (tests)
 * Description: Unit tests validating the customer service orchestration across repositories.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerService } from '../customer.service';
import { Customer } from '../entities/customer.entity';
import { PostalAddress } from '../entities/postal_address.entity';
import { PrivacySettings } from '../entities/privacy_settings.entity';
import { CustomerEmail } from '../entities/customer_email.entity';
import { CustomerPhoneNumber } from '../entities/customer_phone_number.entity';
import { CreateCustomerDto } from '../dtos/create-customer.dto';

function createMockRepository<T extends object>() {
  return {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
  } as unknown as jest.Mocked<Repository<T>>;
}

describe('CustomerService', () => {
  let service: CustomerService;
  let customerRepository: jest.Mocked<Repository<Customer>>;
  let addressRepository: jest.Mocked<Repository<PostalAddress>>;
  let privacyRepository: jest.Mocked<Repository<PrivacySettings>>;
  let emailRepository: jest.Mocked<Repository<CustomerEmail>>;
  let phoneRepository: jest.Mocked<Repository<CustomerPhoneNumber>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        { provide: getRepositoryToken(Customer), useValue: createMockRepository<Customer>() },
        {
          provide: getRepositoryToken(PostalAddress),
          useValue: createMockRepository<PostalAddress>(),
        },
        {
          provide: getRepositoryToken(PrivacySettings),
          useValue: createMockRepository<PrivacySettings>(),
        },
        { provide: getRepositoryToken(CustomerEmail), useValue: createMockRepository<CustomerEmail>() },
        {
          provide: getRepositoryToken(CustomerPhoneNumber),
          useValue: createMockRepository<CustomerPhoneNumber>(),
        },
      ],
    }).compile();

    service = module.get(CustomerService);
    customerRepository = module.get(getRepositoryToken(Customer));
    addressRepository = module.get(getRepositoryToken(PostalAddress));
    privacyRepository = module.get(getRepositoryToken(PrivacySettings));
    emailRepository = module.get(getRepositoryToken(CustomerEmail));
    phoneRepository = module.get(getRepositoryToken(CustomerPhoneNumber));
  });

  it('creates a customer with related records', async () => {
    const dto: CreateCustomerDto = {
      id: '11111111-1111-4111-8111-111111111111',
      firstName: 'Alice',
      lastName: 'Smith',
      address: {
        line1: '100 Market St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
        country: 'US',
      },
      privacySettings: {
        marketingEmailsEnabled: true,
        twoFactorEnabled: false,
      },
      emails: ['alice@example.com'],
      phoneNumbers: [{ type: 'mobile', number: '+15555550101' }],
    };

    const savedAddress: PostalAddress = {
      postal_address_id: 1,
      line1: dto.address.line1,
      line2: null,
      city: dto.address.city,
      state: dto.address.state,
      postal_code: dto.address.postalCode,
      country: dto.address.country,
      customers: [],
    };
    const savedPrivacy: PrivacySettings = {
      privacy_settings_id: 1,
      marketing_emails_enabled: true,
      two_factor_enabled: false,
      customers: [],
    };
    const savedCustomer: Customer = {
      customer_id: dto.id,
      first_name: dto.firstName,
      middle_name: null,
      last_name: dto.lastName,
      address: savedAddress,
      address_id: savedAddress.postal_address_id,
      privacySettings: savedPrivacy,
      privacy_settings_id: savedPrivacy.privacy_settings_id,
      emails: [],
      phoneNumbers: [],
    };

    addressRepository.save.mockResolvedValue(savedAddress);
    privacyRepository.save.mockResolvedValue(savedPrivacy);
    customerRepository.create.mockReturnValue(savedCustomer);
    customerRepository.save.mockResolvedValue(savedCustomer);
    emailRepository.delete.mockResolvedValue({} as any);
    emailRepository.create.mockImplementation((payload) => payload as any);
    emailRepository.save.mockResolvedValue([] as any);
    phoneRepository.delete.mockResolvedValue({} as any);
    phoneRepository.create.mockImplementation((payload) => payload as any);
    phoneRepository.save.mockResolvedValue([] as any);
    savedCustomer.emails = [{ email: 'alice@example.com' } as CustomerEmail];
    savedCustomer.phoneNumbers = [
      { type: 'mobile', number: '+15555550101' } as CustomerPhoneNumber,
    ];
    customerRepository.findOne.mockResolvedValue(savedCustomer);

    const result = await service.create(dto);

    expect(addressRepository.save).toHaveBeenCalled();
    expect(privacyRepository.save).toHaveBeenCalled();
    expect(customerRepository.save).toHaveBeenCalledWith(savedCustomer);
    expect(emailRepository.save).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ email: 'alice@example.com' })]),
    );
    expect(phoneRepository.save).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ number: '+15555550101' })]),
    );
    expect(result.id).toBe(dto.id);
    expect(result.emails).toEqual(dto.emails);
  });

  it('removes a customer and dependent entities', async () => {
    const entity: Customer = {
      customer_id: '22222222-2222-4222-8222-222222222222',
      first_name: 'Bob',
      middle_name: null,
      last_name: 'Jones',
      address: { postal_address_id: 2 } as PostalAddress,
      address_id: 2,
      privacySettings: { privacy_settings_id: 3 } as PrivacySettings,
      privacy_settings_id: 3,
      emails: [],
      phoneNumbers: [],
    };

    customerRepository.findOne.mockResolvedValue(entity);
    customerRepository.remove.mockResolvedValue(entity as any);
    addressRepository.delete.mockResolvedValue({} as any);
    privacyRepository.delete.mockResolvedValue({} as any);

    await service.remove(entity.customer_id);

    expect(customerRepository.remove).toHaveBeenCalledWith(entity);
    expect(addressRepository.delete).toHaveBeenCalledWith(2);
    expect(privacyRepository.delete).toHaveBeenCalledWith(3);
  });
});
