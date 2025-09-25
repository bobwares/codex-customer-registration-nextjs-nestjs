/**
 * App: Customer Registration
 * Package: api/src/customer/entities
 * File: privacy_settings.entity.ts
 * Version: 0.1.2
 * Turns: 3, 4
 * Author: Codex Agent
 * Date: 2025-09-25T20:04:09Z
 * Exports: PrivacySettingsEntity
 * Description: Maps the privacy_settings table capturing customer communication and security preferences.
 */
import type { EntityOptions } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerEntity } from './customer.entity';

const schemaName = process.env.DATABASE_SCHEMA;
const entityOptions: EntityOptions = {
  name: 'privacy_settings',
  ...(schemaName ? { schema: schemaName } : {}),
};

const timestampColumnType = process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamptz';

@Entity(entityOptions)
export class PrivacySettingsEntity {
  @PrimaryGeneratedColumn({ name: 'privacy_settings_id', type: 'integer' })
  public privacySettingsId!: number;

  @Column({ name: 'marketing_emails_enabled', type: 'boolean' })
  public marketingEmailsEnabled!: boolean;

  @Column({ name: 'two_factor_enabled', type: 'boolean' })
  public twoFactorEnabled!: boolean;

  @CreateDateColumn({ name: 'created_at', type: timestampColumnType })
  public createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: timestampColumnType })
  public updatedAt!: Date;

  @OneToMany(() => CustomerEntity, (customer) => customer.privacySettings)
  public customers?: CustomerEntity[];
}
