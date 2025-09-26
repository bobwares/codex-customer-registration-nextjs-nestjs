/**
 * App: Customer Registration
 * Package: api/src/customer/dtos
 * File: customer-response.dto.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-26T05:00:13Z
 * Exports: CustomerResponseDto
 * Description: Response DTO returned by the API representing a customer aggregate with nested contact information.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PhoneNumberDto } from './phone-number.dto';
import { PostalAddressDto } from './postal-address.dto';
import { PrivacySettingsDto } from './privacy-settings.dto';

export class CustomerResponseDto {
  @ApiProperty({ description: 'Unique identifier for the customer', format: 'uuid' })
  public id!: string;

  @ApiProperty({ description: 'Customer first name' })
  public firstName!: string;

  @ApiPropertyOptional({ description: 'Customer middle name' })
  public middleName?: string | null;

  @ApiProperty({ description: 'Customer last name' })
  public lastName!: string;

  @ApiProperty({ description: 'Collection of customer emails', type: [String] })
  public emails!: string[];

  @ApiProperty({ description: 'Set of phone numbers for the customer', type: [PhoneNumberDto] })
  public phoneNumbers!: PhoneNumberDto[];

  @ApiPropertyOptional({ description: 'Mailing address for the customer', type: PostalAddressDto, nullable: true })
  public address?: PostalAddressDto | null;

  @ApiProperty({ description: 'Privacy configuration for the customer', type: PrivacySettingsDto })
  public privacySettings!: PrivacySettingsDto;

  @ApiProperty({ description: 'Timestamp the customer record was created', example: '2025-09-26T00:00:00.000Z' })
  public createdAt!: string;

  @ApiProperty({ description: 'Timestamp the customer record was last updated', example: '2025-09-26T00:00:00.000Z' })
  public updatedAt!: string;
}
