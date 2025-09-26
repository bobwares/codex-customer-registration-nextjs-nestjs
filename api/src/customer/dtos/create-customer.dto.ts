/**
 * App: Customer Registration
 * Package: api/src/customer/dtos
 * File: create-customer.dto.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-26T05:00:02Z
 * Exports: CreateCustomerDto
 * Description: DTO defining the payload required to create a customer record including nested address, privacy, and contact data.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PhoneNumberDto } from './phone-number.dto';
import { PostalAddressDto } from './postal-address.dto';
import { PrivacySettingsDto } from './privacy-settings.dto';

export class CreateCustomerDto {
  @ApiPropertyOptional({ description: 'Externally supplied identifier for the customer', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  public id?: string;

  @ApiProperty({ description: 'Customer first name', example: 'Jane', maxLength: 255 })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  public firstName!: string;

  @ApiPropertyOptional({ description: 'Customer middle name', example: 'Ann', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  public middleName?: string;

  @ApiProperty({ description: 'Customer last name', example: 'Doe', maxLength: 255 })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  public lastName!: string;

  @ApiProperty({
    description: 'Unique set of customer email addresses',
    example: ['jane.doe@example.com'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  public emails!: string[];

  @ApiProperty({
    description: 'Collection of phone numbers associated with the customer',
    type: [PhoneNumberDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PhoneNumberDto)
  public phoneNumbers!: PhoneNumberDto[];

  @ApiPropertyOptional({ description: 'Physical mailing address for the customer', type: PostalAddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PostalAddressDto)
  public address?: PostalAddressDto;

  @ApiProperty({ description: 'Privacy preferences associated with the customer', type: PrivacySettingsDto })
  @ValidateNested()
  @Type(() => PrivacySettingsDto)
  public privacySettings!: PrivacySettingsDto;
}
