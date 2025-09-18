/**
 * # App: Customer Registration
 * # Package: api.customers.entities
 * # File: src/customers/entities/privacy-settings.entity.ts
 * # Version: 0.1.0
 * # Turns: 1
 * # Author: AI Agent
 * # Date: 2025-09-18T19:33:35Z
 * # Exports: PrivacySettings
 * # Description: TypeORM entity modeling opt-in privacy preferences linked to a customer account.
 */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Customer } from './customer.entity';

@Entity({ name: 'privacy_settings', schema: 'customer_domain' })
export class PrivacySettings {
  @PrimaryGeneratedColumn({ name: 'privacy_settings_id', type: 'integer' })
  privacySettingsId!: number;

  @Column({ name: 'marketing_emails_enabled', type: 'boolean' })
  marketingEmailsEnabled!: boolean;

  @Column({ name: 'two_factor_enabled', type: 'boolean' })
  twoFactorEnabled!: boolean;

  @OneToMany(() => Customer, (customer) => customer.privacySettings)
  customers!: Customer[];
}
