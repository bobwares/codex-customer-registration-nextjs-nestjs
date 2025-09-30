/**
 * # App: Customer Registration API
 * # Package: api/src/customer/dtos
 * # File: create-customer.dto.ts
 * # Version: 0.1.0
 * # Turns: 4
 * # Author: Codex Agent
 * # Date: 2025-09-30T18:10:00Z
 * # Exports: CustomerPrivacySettingsDto, CustomerAddressDto, CustomerPhoneNumberDto, CreateCustomerDto
 * # Description: Defines request payload structures for creating customers, including nested address, phone,
 * #              and privacy preference DTOs with validation and Swagger metadata annotations.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CustomerPrivacySettingsDto {
  @ApiProperty({ description: 'Whether the customer opts in to marketing emails.', example: true })
  @IsBoolean()
  marketingEmailsEnabled!: boolean;

  @ApiProperty({ description: 'Whether the customer has two-factor authentication enabled.', example: true })
  @IsBoolean()
  twoFactorEnabled!: boolean;
}

export class CustomerAddressDto {
  @ApiProperty({ description: 'Street address, P.O. box, company name, c/o', example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  line1!: string;

  @ApiPropertyOptional({ description: 'Apartment, suite, unit, building, floor, etc.', example: 'Apt 4B' })
  @IsOptional()
  @IsString()
  line2?: string | null;

  @ApiProperty({ description: 'City or locality', example: 'Springfield' })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty({ description: 'State, province, or region', example: 'IL' })
  @IsString()
  @IsNotEmpty()
  state!: string;

  @ApiProperty({ description: 'ZIP or postal code', example: '62704' })
  @IsString()
  @IsNotEmpty()
  postalCode!: string;

  @ApiProperty({ description: 'ISO 3166-1 alpha-2 country code', example: 'US' })
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  country!: string;
}

export class CustomerPhoneNumberDto {
  @ApiProperty({ description: 'Type of phone number', example: 'mobile', enum: ['mobile', 'home', 'work', 'other'] })
  @IsString()
  @IsNotEmpty()
  type!: string;

  @ApiProperty({ description: 'Phone number in E.164 format', example: '+15558675309' })
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/)
  number!: string;
}

export class CreateCustomerDto {
  @ApiProperty({ description: 'Unique identifier for the customer profile.', example: '8d5b1c5b-4744-45f5-9a65-8eaa0fbecf2a' })
  @IsUUID()
  id!: string;

  @ApiProperty({ description: 'Customer\'s given name.', example: 'Jane' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiPropertyOptional({ description: 'Customer\'s middle name or initial.', example: 'Alexandra' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  middleName?: string | null;

  @ApiProperty({ description: 'Customer\'s family name.', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ description: 'List of the customer\'s email addresses.', type: [String], example: ['jane.doe@example.com'] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsEmail({}, { each: true })
  emails!: string[];

  @ApiPropertyOptional({
    description: 'List of the customer\'s phone numbers.',
    type: () => [CustomerPhoneNumberDto],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CustomerPhoneNumberDto)
  phoneNumbers?: CustomerPhoneNumberDto[];

  @ApiPropertyOptional({ description: 'Postal address of the customer.', type: () => CustomerAddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CustomerAddressDto)
  address?: CustomerAddressDto;

  @ApiProperty({ description: 'Customer privacy preferences.', type: () => CustomerPrivacySettingsDto })
  @ValidateNested()
  @Type(() => CustomerPrivacySettingsDto)
  privacySettings!: CustomerPrivacySettingsDto;
}
