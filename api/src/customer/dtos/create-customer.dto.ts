/**
 * App: Customer Registration
 * Package: api
 * File: create-customer.dto.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T06:25:09Z
 * Exports: CreateCustomerDto, PostalAddressDto, PhoneNumberDto, PrivacySettingsDto
 * Description: DTO definitions for validating and documenting customer create
 *              requests.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PostalAddressDto {
  @ApiProperty({ description: 'Primary street information', example: '123 Market St' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  line1!: string;

  @ApiPropertyOptional({ description: 'Additional address line', example: 'Apt 4B' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  line2?: string;

  @ApiProperty({ description: 'City or locality', example: 'Austin' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  city!: string;

  @ApiProperty({ description: 'State, province, or region', example: 'TX' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  state!: string;

  @ApiProperty({ description: 'Postal or ZIP code', example: '73301' })
  @IsString()
  @MaxLength(20)
  postalCode!: string;

  @ApiProperty({ description: 'ISO 3166-1 alpha-2 country code', example: 'US' })
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  country!: string;
}

export class PhoneNumberDto {
  @ApiProperty({ description: 'Phone number type', enum: ['mobile', 'home', 'work', 'other'] })
  @IsString()
  @IsIn(['mobile', 'home', 'work', 'other'])
  type!: string;

  @ApiProperty({ description: 'E.164 formatted phone number', example: '+15555550123' })
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/)
  number!: string;
}

export class PrivacySettingsDto {
  @ApiProperty({ description: 'Opt-in for marketing emails', example: true })
  @IsBoolean()
  marketingEmailsEnabled!: boolean;

  @ApiProperty({ description: 'Indicates whether MFA is enabled', example: false })
  @IsBoolean()
  twoFactorEnabled!: boolean;
}

export class CreateCustomerDto {
  @ApiPropertyOptional({ description: 'Customer identifier (UUID)', example: '11111111-1111-1111-1111-111111111111' })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ description: 'Customer given name', example: 'Jane' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  firstName!: string;

  @ApiPropertyOptional({ description: 'Customer middle name or initial', example: 'Q' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  middleName?: string;

  @ApiProperty({ description: 'Customer family name', example: 'Doe' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  lastName!: string;

  @ApiProperty({
    description: 'Unique email addresses for the customer',
    example: ['jane.doe@example.com'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsEmail({}, { each: true })
  emails!: string[];

  @ApiProperty({ description: 'Phone numbers associated with the customer', type: [PhoneNumberDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PhoneNumberDto)
  phoneNumbers!: PhoneNumberDto[];

  @ApiProperty({ description: 'Customer postal address', type: PostalAddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PostalAddressDto)
  address?: PostalAddressDto;

  @ApiProperty({ description: 'Customer privacy preferences', type: PrivacySettingsDto })
  @ValidateNested()
  @Type(() => PrivacySettingsDto)
  privacySettings!: PrivacySettingsDto;
}
