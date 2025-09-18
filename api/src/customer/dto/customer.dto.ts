/**
 * App: Customer Registration
 * Package: api/src/customer/dto
 * File: customer.dto.ts
 * Version: 0.1.0
 * Turns: [1]
 * Author: ChatGPT
 * Date: 2025-09-18T16:44:28Z
 * Exports: CustomerDto
 * Description: View model returned from customer service methods mapping TypeORM entities.
 */
import { Customer } from '../entities/customer.entity';

export class CustomerDto {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly middleName: string | null,
    public readonly lastName: string,
    public readonly emails: string[],
    public readonly phoneNumbers: Array<{ type: string; number: string }>,
    public readonly address:
      | {
          line1: string;
          line2?: string | null;
          city: string;
          state: string;
          postalCode: string;
          country: string;
        }
      | null,
    public readonly privacySettings: {
      marketingEmailsEnabled: boolean;
      twoFactorEnabled: boolean;
    }
  ) {}

  static fromEntity(entity: Customer): CustomerDto {
    return new CustomerDto(
      entity.id,
      entity.firstName,
      entity.middleName ?? null,
      entity.lastName,
      entity.emails?.map((email) => email.email) ?? [],
      entity.phones?.map((phone) => ({ type: phone.phoneType, number: phone.phoneNumber })) ?? [],
      entity.address
        ? {
            line1: entity.address.line1,
            line2: entity.address.line2,
            city: entity.address.city,
            state: entity.address.state,
            postalCode: entity.address.postalCode,
            country: entity.address.country,
          }
        : null,
      {
        marketingEmailsEnabled: entity.marketingEmailsEnabled,
        twoFactorEnabled: entity.twoFactorEnabled,
      }
    );
  }
}
