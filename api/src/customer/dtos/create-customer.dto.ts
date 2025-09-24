/**
 * App: Customer Registration
 * Package: api
 * File: create-customer.dto.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-24T22:07:12Z
 * Exports: CreateCustomerDto
 * Description: DTO defining the payload required to create a customer aggregate.
 */
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from './address.dto';
import { PhoneNumberDto } from './phone-number.dto';
import { PrivacySettingsDto } from './privacy-settings.dto';

export class CreateCustomerDto {
  @IsUUID()
  id!: string;

  @IsString()
  @Length(1, 255)
  firstName!: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  middleName?: string;

  @IsString()
  @Length(1, 255)
  lastName!: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address!: AddressDto;

  @ValidateNested()
  @Type(() => PrivacySettingsDto)
  privacySettings!: PrivacySettingsDto;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  emails!: string[];

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PhoneNumberDto)
  phoneNumbers!: PhoneNumberDto[];
}
