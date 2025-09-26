/**
 * App: Customer Registration
 * Package: api/src/customer/dtos
 * File: phone-number.dto.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-26T04:59:14Z
 * Exports: PhoneNumberDto
 * Description: DTO capturing a customer's phone number type and E.164 formatted value with validation and OpenAPI metadata.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class PhoneNumberDto {
  @ApiProperty({
    description: 'Classification for the phone number',
    example: 'mobile',
    enum: ['mobile', 'home', 'work', 'other'],
  })
  @IsString()
  @IsIn(['mobile', 'home', 'work', 'other'])
  public type!: string;

  @ApiProperty({
    description: 'Phone number expressed in E.164 format',
    example: '+15551234567',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @Matches(/^(?:\+?[1-9]\d{1,14})$/)
  public number!: string;
}
