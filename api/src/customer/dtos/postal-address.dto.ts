/**
 * App: Customer Registration
 * Package: api/src/customer/dtos
 * File: postal-address.dto.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T20:04:09Z
 * Exports: PostalAddressDto
 * Description: Captures structured postal address information for customer operations with validation and OpenAPI annotations.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, MaxLength, MinLength } from 'class-validator';

export class PostalAddressDto {
  @ApiProperty({ description: 'Primary street address.', example: '123 Market Street' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  public line1!: string;

  @ApiProperty({ description: 'Secondary address information such as apartment or suite.', example: 'Apt 4B', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  public line2?: string | null;

  @ApiProperty({ description: 'City or locality component of the address.', example: 'San Francisco' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  public city!: string;

  @ApiProperty({ description: 'State, province, or region.', example: 'CA' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  public state!: string;

  @ApiProperty({ description: 'Postal or ZIP code.', example: '94103' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  public postalCode!: string;

  @ApiProperty({ description: 'Two-letter ISO 3166-1 alpha-2 country code.', example: 'US' })
  @IsString()
  @Length(2, 2)
  public country!: string;
}
