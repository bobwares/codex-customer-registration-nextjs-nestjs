/**
 * App: Customer Registration
 * Package: api
 * File: phone-number.dto.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-24T22:07:12Z
 * Exports: PhoneNumberDto
 * Description: Validation schema for customer phone number payloads.
 */
import { IsIn, IsString, Length } from 'class-validator';

export class PhoneNumberDto {
  @IsIn(['mobile', 'home', 'work', 'other'])
  type!: 'mobile' | 'home' | 'work' | 'other';

  @IsString()
  @Length(1, 20)
  number!: string;
}
