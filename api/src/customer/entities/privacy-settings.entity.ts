/**
 * App: Customer Registration
 * Package: api
 * File: privacy-settings.entity.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-25T06:25:09Z
 * Exports: PrivacySettings
 * Description: TypeORM entity capturing marketing privacy preferences for a
 *              customer record.
 */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from './customer.entity';

@Entity({ name: 'privacy_settings', schema: 'customer_domain' })
export class PrivacySettings {
  @PrimaryGeneratedColumn({ name: 'privacy_settings_id', type: 'integer' })
  id!: number;

  @Column({ name: 'marketing_emails_enabled', type: 'boolean' })
  marketingEmailsEnabled!: boolean;

  @Column({ name: 'two_factor_enabled', type: 'boolean' })
  twoFactorEnabled!: boolean;

  @OneToMany(() => Customer, (customer) => customer.privacySettings)
  customers?: Customer[];
}
