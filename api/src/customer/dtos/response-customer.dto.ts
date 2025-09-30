/**
 * # App: Customer Registration API
 * # Package: api/src/customer/dtos
 * # File: response-customer.dto.ts
 * # Version: 0.1.0
 * # Turns: 4
 * # Author: Codex Agent
 * # Date: 2025-09-30T18:10:00Z
 * # Exports: ResponseCustomerDto
 * # Description: Represents the serialized customer payload returned from REST endpoints with Swagger metadata
 * #              to document identifiers, contact methods, address, and privacy preferences.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CustomerAddressDto,
  CustomerPhoneNumberDto,
  CustomerPrivacySettingsDto,
} from './create-customer.dto';

export class ResponseCustomerDto {
  @ApiProperty({ description: 'Unique identifier for the customer profile.', example: '8d5b1c5b-4744-45f5-9a65-8eaa0fbecf2a' })
  id!: string;

  @ApiProperty({ description: 'Customer\'s given name.', example: 'Jane' })
  firstName!: string;

  @ApiPropertyOptional({ description: 'Customer\'s middle name or initial.', example: 'Alexandra', nullable: true })
  middleName!: string | null;

  @ApiProperty({ description: 'Customer\'s family name.', example: 'Doe' })
  lastName!: string;

  @ApiProperty({ description: 'List of the customer\'s email addresses.', type: [String] })
  emails!: string[];

  @ApiPropertyOptional({ description: 'List of the customer\'s phone numbers.', type: () => [CustomerPhoneNumberDto] })
  phoneNumbers!: CustomerPhoneNumberDto[];

  @ApiPropertyOptional({ description: 'Postal address of the customer.', type: () => CustomerAddressDto, nullable: true })
  address!: CustomerAddressDto | null;

  @ApiProperty({ description: 'Customer privacy preferences.', type: () => CustomerPrivacySettingsDto })
  privacySettings!: CustomerPrivacySettingsDto;
}
