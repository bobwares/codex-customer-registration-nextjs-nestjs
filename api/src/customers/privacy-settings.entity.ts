/**
 * App: Customer Registration
 * Package: api.customers
 * File: privacy-settings.entity.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T00:12:49Z
 * Exports: PrivacySettings
 * Description: Captures marketing and security preferences for a customer with a one-to-many
 *              relationship from privacy settings to customers.
 */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Customer } from './customer.entity';

@Entity({ name: 'privacy_settings' })
export class PrivacySettings {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ name: 'marketing_emails_enabled' })
  marketingEmailsEnabled!: boolean;

  @Column({ name: 'two_factor_enabled' })
  twoFactorEnabled!: boolean;

  @OneToMany(() => Customer, (customer) => customer.privacySettings)
  customers!: Customer[];
}
