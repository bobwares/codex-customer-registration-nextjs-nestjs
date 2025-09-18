/**
 * # App: Customer Registration
 * # Package: api.customers.dtos
 * # File: src/customers/dto/create-customer.dto.ts
 * # Version: 0.1.0
 * # Turns: 1
 * # Author: AI Agent
 * # Date: 2025-09-18T19:33:35Z
 * # Exports: CustomerAddressDto, CustomerPhoneNumberDto, CustomerPrivacySettingsDto, CreateCustomerDto
 * # Description: Validation DTO capturing required fields to create a customer aggregate and nested relations.
 */
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';

export class CustomerAddressDto {
  @IsString()
  @Length(1, 255)
  line1!: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  line2?: string;

  @IsString()
  @Length(1, 120)
  city!: string;

  @IsString()
  @Length(1, 80)
  state!: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  postalCode?: string;

  @IsString()
  @Length(2, 2)
  country!: string;
}

export class CustomerPhoneNumberDto {
  @IsString()
  @IsIn(['mobile', 'home', 'work', 'other'])
  type!: string;

  @IsString()
  @Length(1, 20)
  number!: string;
}

export class CustomerPrivacySettingsDto {
  @IsBoolean()
  marketingEmailsEnabled!: boolean;

  @IsBoolean()
  twoFactorEnabled!: boolean;
}

export class CreateCustomerDto {
  @IsUUID()
  id!: string;

  @IsString()
  @Length(1, 120)
  firstName!: string;

  @IsOptional()
  @IsString()
  @Length(1, 120)
  middleName?: string;

  @IsString()
  @Length(1, 120)
  lastName!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsEmail({}, { each: true })
  emails!: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomerPhoneNumberDto)
  phoneNumbers?: CustomerPhoneNumberDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomerAddressDto)
  address?: CustomerAddressDto;

  @ValidateNested()
  @Type(() => CustomerPrivacySettingsDto)
  privacySettings!: CustomerPrivacySettingsDto;
}
