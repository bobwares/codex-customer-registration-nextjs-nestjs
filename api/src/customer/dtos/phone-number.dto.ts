/**
 * App: Customer Registration
 * Package: api/src/customer/dtos
 * File: phone-number.dto.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T20:04:09Z
 * Exports: PhoneNumberDto
 * Description: Describes the phone number payload for customer requests and responses with validation and documentation metadata.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class PhoneNumberDto {
  @ApiProperty({
    description: 'Category of the phone number.',
    enum: ['mobile', 'home', 'work', 'other'],
    example: 'mobile',
  })
  @IsString()
  @IsIn(['mobile', 'home', 'work', 'other'])
  public type!: string;

  @ApiProperty({
    description: 'Phone number formatted according to the E.164 specification.',
    example: '+12065551212',
  })
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/)
  public number!: string;

  @ApiProperty({
    description: 'Optional extension for the phone number.',
    example: '123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  public extension?: string | null;
}
