/**
 * # App: Customer Registration API
 * # Package: api/src/customer/entities
 * # File: privacy-settings.entity.ts
 * # Version: 0.1.0
 * # Turns: 3
 * # Author: Codex Agent
 * # Date: 2025-09-30T17:20:00Z
 * # Exports: PrivacySettingsEntity
 * # Description: TypeORM entity capturing opt-in preferences required during customer enrollment.
 */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CustomerEntity } from './customer.entity';

@Entity({ name: 'privacy_settings', schema: 'customer_domain' })
export class PrivacySettingsEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'privacy_settings_id' })
  privacySettingsId!: number;

  @Column({ type: 'boolean', name: 'marketing_emails_enabled' })
  marketingEmailsEnabled!: boolean;

  @Column({ type: 'boolean', name: 'two_factor_enabled' })
  twoFactorEnabled!: boolean;

  @OneToMany(() => CustomerEntity, (customer) => customer.privacySettings)
  customers!: CustomerEntity[];
}
