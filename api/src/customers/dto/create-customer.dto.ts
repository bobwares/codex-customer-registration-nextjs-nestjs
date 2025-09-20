/**
 * App: Customer Registration
 * Package: api/src/customers/dto
 * File: create-customer.dto.ts
 * Version: 0.1.0
 * Turns: 2
 * Author: Codex Agent
 * Date: 2025-09-20T04:22:15Z
 * Exports: PhoneNumberDto, PostalAddressDto, PrivacySettingsDto, CreateCustomerDto
 * Description: Defines validation schemas for incoming requests to create a
 *              customer aligned with the JSON schema domain model.
 */
import { Type } from 'class-transformer';
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
  ValidateNested,
} from 'class-validator';

export class PhoneNumberDto {
  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/)
  number!: string;
}

export class PostalAddressDto {
  @IsString()
  @IsNotEmpty()
  line1!: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  state!: string;

  @IsString()
  @IsNotEmpty()
  postalCode!: string;

  @IsString()
  @Matches(/^[A-Z]{2}$/)
  country!: string;
}

export class PrivacySettingsDto {
  @IsBoolean()
  marketingEmailsEnabled!: boolean;

  @IsBoolean()
  twoFactorEnabled!: boolean;
}

export class CreateCustomerDto {
  @IsUUID()
  id!: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsEmail({}, { each: true })
  @ArrayUnique()
  emails!: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhoneNumberDto)
  phoneNumbers?: PhoneNumberDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PostalAddressDto)
  address?: PostalAddressDto;

  @ValidateNested()
  @Type(() => PrivacySettingsDto)
  privacySettings!: PrivacySettingsDto;
}
