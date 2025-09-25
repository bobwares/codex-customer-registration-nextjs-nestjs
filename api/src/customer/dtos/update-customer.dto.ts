/**
 * App: Customer Registration
 * Package: api/src/customer/dtos
 * File: update-customer.dto.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T20:04:09Z
 * Exports: UpdateCustomerDto
 * Description: Captures partial updates for customers, allowing nullable nested resources while reusing validation semantics.
 */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { PhoneNumberDto } from './phone-number.dto';
import { PostalAddressDto } from './postal-address.dto';
import { PrivacySettingsDto } from './privacy-settings.dto';

export class UpdateCustomerDto {
  @ApiPropertyOptional({ description: 'Customer first name.', example: 'Jane' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  public firstName?: string;

  @ApiPropertyOptional({ description: 'Customer middle name or initial.', example: 'Q.', nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  public middleName?: string | null;

  @ApiPropertyOptional({ description: 'Customer last name.', example: 'Doe' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  public lastName?: string;

  @ApiPropertyOptional({ description: 'Primary email addresses for contacting the customer.', example: ['jane.doe@example.com'], minItems: 1, nullable: true })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsEmail({}, { each: true })
  public emails?: string[] | null;

  @ApiPropertyOptional({ description: 'Phone numbers associated with the customer.', type: [PhoneNumberDto], minItems: 1, nullable: true })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PhoneNumberDto)
  public phoneNumbers?: PhoneNumberDto[] | null;

  @ApiPropertyOptional({ description: 'Mailing address for the customer.', type: PostalAddressDto, nullable: true })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @ValidateNested()
  @Type(() => PostalAddressDto)
  public address?: PostalAddressDto | null;

  @ApiPropertyOptional({ description: 'Customer privacy preferences.', type: PrivacySettingsDto, nullable: true })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @ValidateNested()
  @Type(() => PrivacySettingsDto)
  public privacySettings?: PrivacySettingsDto | null;
}
