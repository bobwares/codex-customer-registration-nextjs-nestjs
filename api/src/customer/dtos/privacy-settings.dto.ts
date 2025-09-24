/**
 * App: Customer Registration
 * Package: api
 * File: privacy-settings.dto.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-24T22:07:12Z
 * Exports: PrivacySettingsDto
 * Description: Validation schema for customer privacy preference payloads.
 */
import { IsBoolean } from 'class-validator';

export class PrivacySettingsDto {
  @IsBoolean()
  marketingEmailsEnabled!: boolean;

  @IsBoolean()
  twoFactorEnabled!: boolean;
}
