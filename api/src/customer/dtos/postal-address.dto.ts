/**
 * App: Customer Registration
 * Package: api/src/customer/dtos
 * File: postal-address.dto.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-26T04:59:50Z
 * Exports: PostalAddressDto
 * Description: DTO modeling a customer's postal address with validation rules aligned to the persisted schema.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, MaxLength, MinLength } from 'class-validator';

export class PostalAddressDto {
  @ApiProperty({ description: 'Primary street address line', example: '123 Main St', maxLength: 255 })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  public line1!: string;

  @ApiPropertyOptional({ description: 'Secondary street information', example: 'Apt 4B', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  public line2?: string;

  @ApiProperty({ description: 'City or locality', example: 'Springfield', maxLength: 100 })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  public city!: string;

  @ApiProperty({ description: 'State, province, or region', example: 'IL', maxLength: 100 })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  public state!: string;

  @ApiProperty({ description: 'Postal or ZIP code', example: '62704', maxLength: 20 })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  public postalCode!: string;

  @ApiProperty({ description: 'ISO 3166-1 alpha-2 country code', example: 'US', minLength: 2, maxLength: 2 })
  @IsString()
  @Length(2, 2)
  public country!: string;
}
