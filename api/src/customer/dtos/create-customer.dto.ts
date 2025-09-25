/**
 * App: Customer Registration
 * Package: api/src/customer/dtos
 * File: create-customer.dto.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T20:04:09Z
 * Exports: CreateCustomerDto
 * Description: Defines the payload contract for creating customers, enforcing schema-derived validation and documenting fields for OpenAPI.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PhoneNumberDto } from './phone-number.dto';
import { PostalAddressDto } from './postal-address.dto';
import { PrivacySettingsDto } from './privacy-settings.dto';

export class CreateCustomerDto {
  @ApiPropertyOptional({ description: 'Client supplied identifier for idempotent creation.', format: 'uuid', example: 'f2b71327-1a73-4f68-9f47-1b29d1a3cb75' })
  @IsOptional()
  @IsUUID(4)
  public id?: string;

  @ApiProperty({ description: 'Customer first name.', example: 'Jane' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  public firstName!: string;

  @ApiPropertyOptional({ description: 'Customer middle name or initial.', example: 'Q.' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  public middleName?: string | null;

  @ApiProperty({ description: 'Customer last name.', example: 'Doe' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  public lastName!: string;

  @ApiProperty({ description: 'Primary email addresses for contacting the customer.', example: ['jane.doe@example.com'], minItems: 1 })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsEmail({}, { each: true })
  public emails!: string[];

  @ApiPropertyOptional({ description: 'Phone numbers associated with the customer.', type: [PhoneNumberDto], minItems: 1 })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PhoneNumberDto)
  public phoneNumbers?: PhoneNumberDto[];

  @ApiPropertyOptional({ description: 'Mailing address for the customer.', type: PostalAddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PostalAddressDto)
  public address?: PostalAddressDto;

  @ApiProperty({ description: 'Customer privacy preferences.', type: PrivacySettingsDto })
  @ValidateNested()
  @Type(() => PrivacySettingsDto)
  public privacySettings!: PrivacySettingsDto;
}
