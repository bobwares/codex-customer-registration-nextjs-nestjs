/**
 * App: Customer Registration
 * Package: api/src/customer
 * File: customer.service.ts
 * Version: 0.2.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-26T05:12:14Z
 * Exports: CustomerService
 * Description: Service encapsulating CRUD operations for customers and mapping between DTOs and persisted entities.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { CustomerEntity } from './entities/customer.entity';
import { PostalAddressEntity } from './entities/postal-address.entity';
import { PrivacySettingsEntity } from './entities/privacy-settings.entity';
import { CustomerEmailEntity } from './entities/customer-email.entity';
import { CustomerPhoneNumberEntity } from './entities/customer-phone-number.entity';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { CustomerResponseDto } from './dtos/customer-response.dto';
import { PostalAddressDto } from './dtos/postal-address.dto';
import { PrivacySettingsDto } from './dtos/privacy-settings.dto';

@Injectable()
export class CustomerService {
  private readonly relations = {
    address: true,
    privacySettings: true,
    emails: true,
    phoneNumbers: true,
  } as const;

  public constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  public async create(dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    return this.customerRepository.manager.transaction(async (manager) => {
      const customerId = dto.id ?? randomUUID();
      const privacy = await manager.save(
        manager.create(PrivacySettingsEntity, this.buildPrivacySettings(dto.privacySettings)),
      );
      const address = dto.address
        ? await manager.save(manager.create(PostalAddressEntity, this.buildAddress(dto.address)))
        : null;

      const customer = manager.create(CustomerEntity, {
        customerId,
        firstName: dto.firstName,
        middleName: dto.middleName ?? null,
        lastName: dto.lastName,
        privacySettings: privacy,
        address,
        emails: dto.emails.map((email, index) =>
          manager.create(CustomerEmailEntity, {
            customerId,
            email,
            isPrimary: index === 0,
          }),
        ),
        phoneNumbers: dto.phoneNumbers.map((phone) =>
          manager.create(CustomerPhoneNumberEntity, {
            customerId,
            type: phone.type,
            number: phone.number,
          }),
        ),
      });

      await manager.save(customer);
      const persisted = await manager.findOne(CustomerEntity, {
        where: { customerId },
        relations: this.relations,
      });
      if (!persisted) {
        throw new NotFoundException(`Customer ${customerId} could not be reloaded after creation.`);
      }
      return this.toResponseDto(persisted);
    });
  }

  public async findAll(): Promise<CustomerResponseDto[]> {
    const entities = await this.customerRepository.find({ relations: this.relations });
    return entities.map((entity) => this.toResponseDto(entity));
  }

  public async findOne(id: string): Promise<CustomerResponseDto> {
    const entity = await this.customerRepository.findOne({ where: { customerId: id }, relations: this.relations });
    if (!entity) {
      throw new NotFoundException(`Customer ${id} not found.`);
    }
    return this.toResponseDto(entity);
  }

  public async update(id: string, dto: UpdateCustomerDto): Promise<CustomerResponseDto> {
    return this.customerRepository.manager.transaction(async (manager) => {
      const entity = await manager.findOne(CustomerEntity, {
        where: { customerId: id },
        relations: this.relations,
      });
      if (!entity) {
        throw new NotFoundException(`Customer ${id} not found.`);
      }

      if (dto.firstName !== undefined) {
        entity.firstName = dto.firstName;
      }
      if (dto.middleName !== undefined) {
        entity.middleName = dto.middleName ?? null;
      }
      if (dto.lastName !== undefined) {
        entity.lastName = dto.lastName;
      }
      if (dto.privacySettings !== undefined) {
        entity.privacySettings.marketingEmailsEnabled = dto.privacySettings.marketingEmailsEnabled;
        entity.privacySettings.twoFactorEnabled = dto.privacySettings.twoFactorEnabled;
        await manager.save(entity.privacySettings);
      }
      if (dto.address !== undefined) {
        if (dto.address) {
          if (entity.address) {
            entity.address.line1 = dto.address.line1;
            entity.address.line2 = dto.address.line2 ?? null;
            entity.address.city = dto.address.city;
            entity.address.state = dto.address.state;
            entity.address.postalCode = dto.address.postalCode;
            entity.address.country = dto.address.country;
            await manager.save(entity.address);
          } else {
            entity.address = await manager.save(
              manager.create(PostalAddressEntity, this.buildAddress(dto.address)),
            );
          }
        } else if (entity.address) {
          await manager.remove(entity.address);
          entity.address = null;
        }
      }
      if (dto.emails !== undefined) {
        if (entity.emails.length > 0) {
          await manager.remove(entity.emails);
        }
        entity.emails = dto.emails.map((email, index) =>
          manager.create(CustomerEmailEntity, {
            customerId: entity.customerId,
            email,
            isPrimary: index === 0,
          }),
        );
      }
      if (dto.phoneNumbers !== undefined) {
        if (entity.phoneNumbers.length > 0) {
          await manager.remove(entity.phoneNumbers);
        }
        entity.phoneNumbers = dto.phoneNumbers.map((phone) =>
          manager.create(CustomerPhoneNumberEntity, {
            customerId: entity.customerId,
            type: phone.type,
            number: phone.number,
          }),
        );
      }

      await manager.save(entity);
      const updated = await manager.findOne(CustomerEntity, {
        where: { customerId: id },
        relations: this.relations,
      });
      if (!updated) {
        throw new NotFoundException(`Customer ${id} not found.`);
      }
      return this.toResponseDto(updated);
    });
  }

  public async remove(id: string): Promise<void> {
    await this.customerRepository.manager.transaction(async (manager) => {
      const entity = await manager.findOne(CustomerEntity, {
        where: { customerId: id },
        relations: this.relations,
      });
      if (!entity) {
        throw new NotFoundException(`Customer ${id} not found.`);
      }
      await manager.remove(entity);
    });
  }

  private buildPrivacySettings(dto: PrivacySettingsDto): PrivacySettingsEntity {
    return Object.assign(new PrivacySettingsEntity(), {
      marketingEmailsEnabled: dto.marketingEmailsEnabled,
      twoFactorEnabled: dto.twoFactorEnabled,
    });
  }

  private buildAddress(dto: PostalAddressDto): PostalAddressEntity {
    return Object.assign(new PostalAddressEntity(), {
      line1: dto.line1,
      line2: dto.line2 ?? null,
      city: dto.city,
      state: dto.state,
      postalCode: dto.postalCode,
      country: dto.country,
    });
  }

  private toResponseDto(entity: CustomerEntity): CustomerResponseDto {
    const dto = new CustomerResponseDto();
    dto.id = entity.customerId;
    dto.firstName = entity.firstName;
    dto.middleName = entity.middleName ?? null;
    dto.lastName = entity.lastName;
    dto.emails = (entity.emails ?? [])
      .slice()
      .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
      .map((email) => email.email);
    dto.phoneNumbers = (entity.phoneNumbers ?? []).map((phone) => ({
      type: phone.type,
      number: phone.number,
    }));
    dto.address = entity.address
      ? (() => {
          const address: PostalAddressDto = {
            line1: entity.address.line1,
            city: entity.address.city,
            state: entity.address.state,
            postalCode: entity.address.postalCode,
            country: entity.address.country,
          };
          if (entity.address.line2) {
            address.line2 = entity.address.line2;
          }
          return address;
        })()
      : null;
    dto.privacySettings = {
      marketingEmailsEnabled: entity.privacySettings.marketingEmailsEnabled,
      twoFactorEnabled: entity.privacySettings.twoFactorEnabled,
    };
    dto.createdAt = entity.createdAt.toISOString();
    dto.updatedAt = entity.updatedAt.toISOString();
    return dto;
  }
}
