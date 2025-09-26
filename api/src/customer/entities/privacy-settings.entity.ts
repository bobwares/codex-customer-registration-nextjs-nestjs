/**
 * App: Customer Registration
 * Package: api/src/customer/entities
 * File: privacy-settings.entity.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-26T04:58:44Z
 * Exports: PrivacySettingsEntity
 * Description: TypeORM entity modeling the privacy_settings table to manage marketing and security preferences per customer.
 */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'privacy_settings', schema: 'customer_domain' })
export class PrivacySettingsEntity {
  @PrimaryGeneratedColumn({ name: 'privacy_settings_id', type: 'integer' })
  public privacySettingsId!: number;

  @Column({ name: 'marketing_emails_enabled', type: 'boolean' })
  public marketingEmailsEnabled!: boolean;

  @Column({ name: 'two_factor_enabled', type: 'boolean' })
  public twoFactorEnabled!: boolean;
}
