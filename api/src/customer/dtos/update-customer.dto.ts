/**
 * App: Customer Registration
 * Package: api
 * File: update-customer.dto.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-24T22:07:12Z
 * Exports: UpdateCustomerDto
 * Description: DTO defining the mutable fields for updating an existing customer aggregate.
 */
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from './address.dto';
import { PhoneNumberDto } from './phone-number.dto';
import { PrivacySettingsDto } from './privacy-settings.dto';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  middleName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  lastName?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PrivacySettingsDto)
  privacySettings?: PrivacySettingsDto;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  emails?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PhoneNumberDto)
  phoneNumbers?: PhoneNumberDto[];
}
