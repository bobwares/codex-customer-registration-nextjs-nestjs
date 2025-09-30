/**
 * # App: Customer Registration API
 * # Package: api/src/customer/dtos
 * # File: update-customer.dto.ts
 * # Version: 0.1.0
 * # Turns: 4
 * # Author: Codex Agent
 * # Date: 2025-09-30T18:10:00Z
 * # Exports: UpdateCustomerDto
 * # Description: Extends the create customer DTO to support partial updates, capturing optional address,
 * #              phone, and privacy changes for PUT operations with validation metadata.
 */
import { ApiPropertyOptional, PartialType, OmitType } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  CreateCustomerDto,
  CustomerAddressDto,
  CustomerPhoneNumberDto,
  CustomerPrivacySettingsDto,
} from './create-customer.dto';

export class UpdateCustomerDto extends PartialType(
  OmitType(CreateCustomerDto, ['id', 'address', 'phoneNumbers', 'privacySettings'] as const),
) {
  @ApiPropertyOptional({
    description: 'Updated postal address. Provide `null` to remove the current address.',
    type: () => CustomerAddressDto,
    nullable: true,
  })
  @ValidateNested()
  @Type(() => CustomerAddressDto)
  @IsOptional()
  declare address?: CustomerAddressDto | null;

  @ApiPropertyOptional({
    description: 'Updated phone numbers. Provide an empty array to remove all numbers.',
    type: () => [CustomerPhoneNumberDto],
  })
  @ValidateNested({ each: true })
  @Type(() => CustomerPhoneNumberDto)
  @IsOptional()
  declare phoneNumbers?: CustomerPhoneNumberDto[];

  @ApiPropertyOptional({ description: 'Updated privacy preferences.', type: () => CustomerPrivacySettingsDto })
  @ValidateNested()
  @Type(() => CustomerPrivacySettingsDto)
  @IsOptional()
  declare privacySettings?: CustomerPrivacySettingsDto;
}
