/**
 * App: Customer Registration
 * Package: api/src/customer/dtos
 * File: privacy-settings.dto.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T20:04:09Z
 * Exports: PrivacySettingsDto
 * Description: Represents privacy preferences for a customer and enforces boolean semantics in API requests.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class PrivacySettingsDto {
  @ApiProperty({ description: 'Indicates whether the customer has opted in to marketing communications.', example: true })
  @IsBoolean()
  public marketingEmailsEnabled!: boolean;

  @ApiProperty({ description: 'Determines if multi-factor authentication is enabled for the customer.', example: false })
  @IsBoolean()
  public twoFactorEnabled!: boolean;
}
