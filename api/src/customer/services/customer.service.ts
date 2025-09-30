/**
 * # App: Customer Registration API
 * # Package: api/src/customer/services
 * # File: customer.service.ts
 * # Version: 0.1.0
 * # Turns: 3
 * # Author: Codex Agent
 * # Date: 2025-09-30T17:20:00Z
 * # Exports: CustomerService, CreateCustomerPayload, UpdateCustomerProfilePayload
 * # Description: Domain service that orchestrates persistence workflows for customer profiles using TypeORM repositories.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  CustomerEmailEntity,
  CustomerEntity,
  CustomerPhoneNumberEntity,
  PostalAddressEntity,
  PrivacySettingsEntity,
} from '../entities';

export interface CreateCustomerPayload {
  customerId: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  address?: CustomerAddressInput;
  privacySettings: CustomerPrivacySettingsInput;
  emails?: string[];
  phoneNumbers?: CustomerPhoneInput[];
}

export interface UpdateCustomerProfilePayload {
  firstName?: string;
  middleName?: string | null;
  lastName?: string;
  address?: CustomerAddressInput | null;
  privacySettings?: Partial<CustomerPrivacySettingsInput>;
  emails?: string[];
  phoneNumbers?: CustomerPhoneInput[];
}

export interface CustomerAddressInput {
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CustomerPrivacySettingsInput {
  marketingEmailsEnabled: boolean;
  twoFactorEnabled: boolean;
}

export interface CustomerPhoneInput {
  type: string;
  number: string;
}

@Injectable()
export class CustomerService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async createCustomer(payload: CreateCustomerPayload): Promise<CustomerEntity> {
    return this.dataSource.transaction(async (manager) => {
      const privacy = manager.create(PrivacySettingsEntity, payload.privacySettings);
      await manager.save(privacy);

      let address: PostalAddressEntity | null = null;
      if (payload.address) {
        address = manager.create(PostalAddressEntity, {
          ...payload.address,
          line2: payload.address.line2 ?? null,
        });
        await manager.save(address);
      }

      const customer = manager.create(CustomerEntity, {
        customerId: payload.customerId,
        firstName: payload.firstName,
        middleName: payload.middleName ?? null,
        lastName: payload.lastName,
        addressId: address?.addressId ?? null,
        privacySettingsId: privacy.privacySettingsId,
        emails: (payload.emails ?? []).map((email) =>
          manager.create(CustomerEmailEntity, {
            email,
            customerId: payload.customerId,
          }),
        ),
        phoneNumbers: (payload.phoneNumbers ?? []).map((phone) =>
          manager.create(CustomerPhoneNumberEntity, {
            customerId: payload.customerId,
            type: phone.type,
            number: phone.number,
          }),
        ),
      });

      customer.address = address ?? null;
      customer.privacySettings = privacy;

      await manager.save(customer);

      return manager.findOneOrFail(CustomerEntity, {
        where: { customerId: payload.customerId },
        relations: {
          address: true,
          privacySettings: true,
          emails: true,
          phoneNumbers: true,
        },
      });
    });
  }

  async listCustomers(): Promise<CustomerEntity[]> {
    return this.customerRepository.find({
      relations: {
        address: true,
        privacySettings: true,
        emails: true,
        phoneNumbers: true,
      },
      order: {
        lastName: 'ASC',
        firstName: 'ASC',
      },
    });
  }

  async findCustomerById(customerId: string): Promise<CustomerEntity | null> {
    return this.customerRepository.findOne({
      where: { customerId },
      relations: {
        address: true,
        privacySettings: true,
        emails: true,
        phoneNumbers: true,
      },
    });
  }

  async updateCustomerProfile(
    customerId: string,
    changes: UpdateCustomerProfilePayload,
  ): Promise<CustomerEntity> {
    return this.dataSource.transaction(async (manager) => {
      const customer = await manager.findOneOrFail(CustomerEntity, {
        where: { customerId },
        relations: {
          address: true,
          privacySettings: true,
          emails: true,
          phoneNumbers: true,
        },
      });

      if (changes.firstName !== undefined) {
        customer.firstName = changes.firstName;
      }
      if (changes.middleName !== undefined) {
        customer.middleName = changes.middleName;
      }
      if (changes.lastName !== undefined) {
        customer.lastName = changes.lastName;
      }

      if (changes.address === null) {
        customer.address = null;
        customer.addressId = null;
      } else if (changes.address) {
        if (customer.address) {
          manager.merge(PostalAddressEntity, customer.address, {
            ...changes.address,
            line2: changes.address.line2 ?? null,
          });
          await manager.save(customer.address);
          customer.addressId = customer.address.addressId;
        } else {
          const newAddress = manager.create(PostalAddressEntity, {
            ...changes.address,
            line2: changes.address.line2 ?? null,
          });
          await manager.save(newAddress);
          customer.address = newAddress;
          customer.addressId = newAddress.addressId;
        }
      }

      if (changes.privacySettings) {
        manager.merge(
          PrivacySettingsEntity,
          customer.privacySettings,
          changes.privacySettings,
        );
        await manager.save(customer.privacySettings);
      }

      if (changes.emails) {
        await manager.delete(CustomerEmailEntity, { customerId });
        customer.emails = changes.emails.map((email) =>
          manager.create(CustomerEmailEntity, {
            email,
            customerId,
          }),
        );
      }

      if (changes.phoneNumbers) {
        await manager.delete(CustomerPhoneNumberEntity, { customerId });
        customer.phoneNumbers = changes.phoneNumbers.map((phone) =>
          manager.create(CustomerPhoneNumberEntity, {
            customerId,
            type: phone.type,
            number: phone.number,
          }),
        );
      }

      await manager.save(customer);

      return manager.findOneOrFail(CustomerEntity, {
        where: { customerId },
        relations: {
          address: true,
          privacySettings: true,
          emails: true,
          phoneNumbers: true,
        },
      });
    });
  }

  async deleteCustomer(customerId: string): Promise<void> {
    await this.customerRepository.delete(customerId);
  }
}
