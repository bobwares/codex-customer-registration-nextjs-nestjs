/**
 * App: Customer Registration
 * Package: api
 * File: address.dto.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-24T22:07:12Z
 * Exports: AddressDto
 * Description: Validation schema for customer postal address payloads.
 */
import { IsOptional, IsString, Length } from 'class-validator';

export class AddressDto {
  @IsString()
  @Length(1, 255)
  line1!: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  line2?: string;

  @IsString()
  @Length(1, 100)
  city!: string;

  @IsString()
  @Length(1, 50)
  state!: string;

  @IsString()
  @Length(1, 20)
  postalCode!: string;

  @IsString()
  @Length(2, 2)
  country!: string;
}
