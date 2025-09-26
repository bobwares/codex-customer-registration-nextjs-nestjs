/**
 * App: Customer Registration
 * Package: api/src/customer/dtos
 * File: privacy-settings.dto.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-26T04:59:54Z
 * Exports: PrivacySettingsDto
 * Description: DTO capturing customer privacy preferences ensuring both flags are provided and documented.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class PrivacySettingsDto {
  @ApiProperty({ description: 'Whether the customer receives marketing emails', example: true })
  @IsBoolean()
  public marketingEmailsEnabled!: boolean;

  @ApiProperty({ description: 'Whether multi-factor authentication is enabled for the customer', example: true })
  @IsBoolean()
  public twoFactorEnabled!: boolean;
}
