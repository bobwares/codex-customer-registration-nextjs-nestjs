/**
 * App: Customer Registration
 * Package: api/src/customer/services
 * File: customer.service.ts
 * Version: 0.1.1
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-25T19:36:06Z
 * Exports: CustomerService, CreateCustomerInput, UpdateCustomerInput
 * Description: Provides repository-backed persistence operations for the customer domain aggregates and projections.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CustomerEntity } from '../entities/customer.entity';
import { CustomerEmailEntity } from '../entities/customer_email.entity';
import { CustomerPhoneNumberEntity } from '../entities/customer_phone_number.entity';
import { CustomerProfileView } from '../entities/customer_profile_view.entity';
import { PostalAddressEntity } from '../entities/postal_address.entity';
import { PrivacySettingsEntity } from '../entities/privacy_settings.entity';

type CreatePostalAddressInput = {
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type CreatePrivacySettingsInput = {
  marketingEmailsEnabled: boolean;
  twoFactorEnabled: boolean;
};

type CreateCustomerEmailInput = {
  email: string;
  isPrimary: boolean;
};

type CreateCustomerPhoneInput = {
  type: string;
  number: string;
  extension?: string | null;
};

export type CreateCustomerInput = {
  customerId?: string;
  name: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  email: string;
  addressId?: number;
  privacySettingsId?: number;
  address?: CreatePostalAddressInput;
  privacySettings?: CreatePrivacySettingsInput;
  emails?: CreateCustomerEmailInput[];
  phoneNumbers?: CreateCustomerPhoneInput[];
};

export type UpdateCustomerInput = Partial<Omit<CreateCustomerInput, 'customerId'>> & {
  address?: CreatePostalAddressInput | null;
  privacySettings?: CreatePrivacySettingsInput | null;
  emails?: CreateCustomerEmailInput[] | null;
  phoneNumbers?: CreateCustomerPhoneInput[] | null;
};

@Injectable()
export class CustomerService {
  public constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
    @InjectRepository(CustomerEmailEntity)
    private readonly customerEmailRepository: Repository<CustomerEmailEntity>,
    @InjectRepository(CustomerPhoneNumberEntity)
    private readonly customerPhoneRepository: Repository<CustomerPhoneNumberEntity>,
    @InjectRepository(PostalAddressEntity)
    private readonly addressRepository: Repository<PostalAddressEntity>,
    @InjectRepository(PrivacySettingsEntity)
    private readonly privacyRepository: Repository<PrivacySettingsEntity>,
    @InjectRepository(CustomerProfileView)
    private readonly profileRepository: Repository<CustomerProfileView>,
  ) {}

  public async createCustomer(input: CreateCustomerInput): Promise<CustomerEntity> {
    return this.customerRepository.manager.transaction(async (entityManager) => {
      const address = input.address
        ? await entityManager.getRepository(PostalAddressEntity).save(
            this.addressRepository.create({
              line1: input.address.line1,
              line2: input.address.line2 ?? null,
              city: input.address.city,
              state: input.address.state,
              postalCode: input.address.postalCode,
              country: input.address.country,
            }),
          )
        : undefined;

      const privacy = input.privacySettings
        ? await entityManager.getRepository(PrivacySettingsEntity).save(
            this.privacyRepository.create({
              marketingEmailsEnabled: input.privacySettings.marketingEmailsEnabled,
              twoFactorEnabled: input.privacySettings.twoFactorEnabled,
            }),
          )
        : undefined;

      const customer = this.customerRepository.create({
        name: input.name,
        firstName: input.firstName,
        middleName: input.middleName ?? null,
        lastName: input.lastName,
        email: input.email,
      });

      if (input.customerId) {
        customer.customerId = input.customerId;
      }

      customer.addressId = address?.addressId ?? input.addressId ?? null;
      customer.privacySettingsId = privacy?.privacySettingsId ?? input.privacySettingsId ?? null;

      const savedCustomer: CustomerEntity = await entityManager
        .getRepository(CustomerEntity)
        .save(customer);

      if (input.emails?.length) {
        const emailEntities = input.emails.map((email) =>
          this.customerEmailRepository.create({
            customerId: savedCustomer.customerId,
            email: email.email,
            isPrimary: email.isPrimary,
          }),
        );
        await entityManager.getRepository(CustomerEmailEntity).save(emailEntities);
      }

      if (input.phoneNumbers?.length) {
        const phoneEntities = input.phoneNumbers.map((phone) =>
          this.customerPhoneRepository.create({
            customerId: savedCustomer.customerId,
            type: phone.type,
            number: phone.number,
            extension: phone.extension ?? null,
          }),
        );
        await entityManager.getRepository(CustomerPhoneNumberEntity).save(phoneEntities);
      }

      const reloaded = await entityManager.getRepository(CustomerEntity).findOne({
        where: { customerId: savedCustomer.customerId },
        relations: {
          address: true,
          privacySettings: true,
          emails: true,
          phoneNumbers: true,
        },
      });

      if (!reloaded) {
        throw new Error('Failed to reload persisted customer record.');
      }

      return reloaded;
    });
  }

  public async findCustomerById(customerId: string): Promise<CustomerEntity | null> {
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

  public async listCustomerProfiles(customerIds?: string[]): Promise<CustomerProfileView[]> {
    if (!customerIds?.length) {
      return this.profileRepository.find();
    }
    return this.profileRepository.find({ where: { customerId: In(customerIds) } });
  }

  public async updateCustomer(customerId: string, updates: UpdateCustomerInput): Promise<CustomerEntity> {
    return this.customerRepository.manager.transaction(async (entityManager) => {
      const repository = entityManager.getRepository(CustomerEntity);
      const existing = await repository.findOne({ where: { customerId } });
      if (!existing) {
        throw new NotFoundException(`Customer ${customerId} was not found.`);
      }

      if (updates.address === null) {
        existing.addressId = null;
      } else if (updates.address) {
        const address = await entityManager.getRepository(PostalAddressEntity).save(
          this.addressRepository.create({
            line1: updates.address.line1,
            line2: updates.address.line2 ?? null,
            city: updates.address.city,
            state: updates.address.state,
            postalCode: updates.address.postalCode,
            country: updates.address.country,
          }),
        );
        existing.addressId = address.addressId;
      } else if (updates.addressId !== undefined) {
        existing.addressId = updates.addressId;
      }

      if (updates.privacySettings === null) {
        existing.privacySettingsId = null;
      } else if (updates.privacySettings) {
        const privacy = await entityManager.getRepository(PrivacySettingsEntity).save(
          this.privacyRepository.create({
            marketingEmailsEnabled: updates.privacySettings.marketingEmailsEnabled,
            twoFactorEnabled: updates.privacySettings.twoFactorEnabled,
          }),
        );
        existing.privacySettingsId = privacy.privacySettingsId;
      } else if (updates.privacySettingsId !== undefined) {
        existing.privacySettingsId = updates.privacySettingsId;
      }

      if (updates.name !== undefined) {
        existing.name = updates.name;
      }
      if (updates.firstName !== undefined) {
        existing.firstName = updates.firstName;
      }
      if (updates.middleName !== undefined) {
        existing.middleName = updates.middleName;
      }
      if (updates.lastName !== undefined) {
        existing.lastName = updates.lastName;
      }
      if (updates.email !== undefined) {
        existing.email = updates.email;
      }

      await repository.save(existing);

      if (updates.emails) {
        await entityManager.getRepository(CustomerEmailEntity).delete({ customerId });
        if (updates.emails.length) {
          const emailEntities = updates.emails.map((email) =>
            this.customerEmailRepository.create({
              customerId,
              email: email.email,
              isPrimary: email.isPrimary,
            }),
          );
          await entityManager.getRepository(CustomerEmailEntity).save(emailEntities);
        }
      }

      if (updates.phoneNumbers) {
        await entityManager.getRepository(CustomerPhoneNumberEntity).delete({ customerId });
        if (updates.phoneNumbers.length) {
          const phoneEntities = updates.phoneNumbers.map((phone) =>
            this.customerPhoneRepository.create({
              customerId,
              type: phone.type,
              number: phone.number,
              extension: phone.extension ?? null,
            }),
          );
          await entityManager.getRepository(CustomerPhoneNumberEntity).save(phoneEntities);
        }
      }

      const reloaded = await repository.findOne({
        where: { customerId },
        relations: {
          address: true,
          privacySettings: true,
          emails: true,
          phoneNumbers: true,
        },
      });

      if (!reloaded) {
        throw new Error(`Customer ${customerId} could not be reloaded after update.`);
      }

      return reloaded;
    });
  }

  public async removeCustomer(customerId: string): Promise<void> {
    await this.customerRepository.manager.transaction(async (entityManager) => {
      const repository = entityManager.getRepository(CustomerEntity);
      const existing = await repository.findOne({ where: { customerId } });
      if (!existing) {
        throw new NotFoundException(`Customer ${customerId} was not found.`);
      }
      await repository.delete(customerId);
    });
  }
}
