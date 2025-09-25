/**
 * App: Customer Registration
 * Package: api/src/customer/dtos
 * File: customer-response.dto.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T20:04:09Z
 * Exports: CustomerResponseDto
 * Description: Structures the customer representation returned by the API, aligning with the published schema and documenting each field.
 */
import { ApiProperty } from '@nestjs/swagger';
import { PhoneNumberDto } from './phone-number.dto';
import { PostalAddressDto } from './postal-address.dto';
import { PrivacySettingsDto } from './privacy-settings.dto';

export class CustomerResponseDto {
  @ApiProperty({ description: 'Unique identifier for the customer.', format: 'uuid', example: 'f2b71327-1a73-4f68-9f47-1b29d1a3cb75' })
  public id!: string;

  @ApiProperty({ description: 'Customer first name.', example: 'Jane' })
  public firstName!: string;

  @ApiProperty({ description: 'Customer middle name or initial.', example: 'Q.', nullable: true })
  public middleName?: string | null;

  @ApiProperty({ description: 'Customer last name.', example: 'Doe' })
  public lastName!: string;

  @ApiProperty({ description: 'Display name constructed from first and last name.', example: 'Jane Doe' })
  public displayName!: string;

  @ApiProperty({ description: 'Primary email address for the customer.', example: 'jane.doe@example.com' })
  public primaryEmail!: string;

  @ApiProperty({ description: 'Collection of all customer email addresses.', example: ['jane.doe@example.com', 'jane.work@example.com'] })
  public emails!: string[];

  @ApiProperty({ description: 'Phone numbers associated with the customer.', type: [PhoneNumberDto], required: false })
  public phoneNumbers?: PhoneNumberDto[];

  @ApiProperty({ description: 'Mailing address for the customer.', type: PostalAddressDto, nullable: true })
  public address?: PostalAddressDto | null;

  @ApiProperty({ description: 'Customer privacy preferences.', type: PrivacySettingsDto, nullable: true })
  public privacySettings?: PrivacySettingsDto | null;

  @ApiProperty({ description: 'Timestamp when the customer record was created.', example: '2025-09-25T19:36:06.000Z' })
  public createdAt!: string;

  @ApiProperty({ description: 'Timestamp when the customer record was last updated.', example: '2025-09-25T19:36:06.000Z' })
  public updatedAt!: string;
}
