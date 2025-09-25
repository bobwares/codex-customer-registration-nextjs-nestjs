/**
 * App: Customer Registration
 * Package: api
 * File: customer-response.dto.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T06:25:09Z
 * Exports: CustomerResponseDto
 * Description: DTO returned from customer endpoints including related contact
 *              information.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PhoneNumberDto, PostalAddressDto, PrivacySettingsDto } from './create-customer.dto';

export class CustomerResponseDto {
  @ApiProperty({ description: 'Customer identifier', example: '11111111-1111-1111-1111-111111111111' })
  id!: string;

  @ApiProperty({ description: 'Customer given name', example: 'Jane' })
  firstName!: string;

  @ApiPropertyOptional({ description: 'Customer middle name or initial', example: 'Q' })
  middleName?: string | null;

  @ApiProperty({ description: 'Customer family name', example: 'Doe' })
  lastName!: string;

  @ApiProperty({ description: 'Email addresses', type: [String] })
  emails!: string[];

  @ApiProperty({ description: 'Phone numbers', type: [PhoneNumberDto] })
  phoneNumbers!: PhoneNumberDto[];

  @ApiPropertyOptional({ description: 'Postal address', type: PostalAddressDto })
  address?: PostalAddressDto | null;

  @ApiProperty({ description: 'Privacy preferences', type: PrivacySettingsDto })
  privacySettings!: PrivacySettingsDto;
}
