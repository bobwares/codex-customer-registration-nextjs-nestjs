/**
 * App: Customer Registration
 * Package: api/src/customer/entities
 * File: customer_profile_view.entity.ts
 * Version: 0.1.2
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-25T19:36:06Z
 * Exports: CustomerProfileView
 * Description: Projects read-optimized customer profile data from customers, addresses, and privacy settings.
 */
import { DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { PostalAddressEntity } from './postal_address.entity';
import { PrivacySettingsEntity } from './privacy_settings.entity';

const schemaName = process.env.DATABASE_SCHEMA;

const viewOptions = {
  name: 'customer_profile_view',
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder(CustomerEntity, 'customer')
      .leftJoin(PostalAddressEntity, 'address', 'address.address_id = customer.address_id')
      .leftJoin(
        PrivacySettingsEntity,
        'privacy',
        'privacy.privacy_settings_id = customer.privacy_settings_id',
      )
      .select('customer.customer_id', 'customer_id')
      .addSelect('customer.name', 'name')
      .addSelect('customer.first_name', 'first_name')
      .addSelect('customer.middle_name', 'middle_name')
      .addSelect('customer.last_name', 'last_name')
      .addSelect('customer.email', 'email')
      .addSelect('address.line1', 'line1')
      .addSelect('address.line2', 'line2')
      .addSelect('address.city', 'city')
      .addSelect('address.state', 'state')
      .addSelect('address.postal_code', 'postal_code')
      .addSelect('address.country', 'country')
      .addSelect('privacy.marketing_emails_enabled', 'marketing_emails_enabled')
      .addSelect('privacy.two_factor_enabled', 'two_factor_enabled'),
  ...(schemaName ? { schema: schemaName } : {}),
} as const;

@ViewEntity(viewOptions)
export class CustomerProfileView {
  @ViewColumn({ name: 'customer_id' })
  public customerId!: string;

  @ViewColumn({ name: 'name' })
  public name!: string;

  @ViewColumn({ name: 'first_name' })
  public firstName!: string;

  @ViewColumn({ name: 'middle_name' })
  public middleName?: string | null;

  @ViewColumn({ name: 'last_name' })
  public lastName!: string;

  @ViewColumn({ name: 'email' })
  public email!: string;

  @ViewColumn({ name: 'line1' })
  public line1?: string | null;

  @ViewColumn({ name: 'line2' })
  public line2?: string | null;

  @ViewColumn({ name: 'city' })
  public city?: string | null;

  @ViewColumn({ name: 'state' })
  public state?: string | null;

  @ViewColumn({ name: 'postal_code' })
  public postalCode?: string | null;

  @ViewColumn({ name: 'country' })
  public country?: string | null;

  @ViewColumn({ name: 'marketing_emails_enabled' })
  public marketingEmailsEnabled?: boolean | null;

  @ViewColumn({ name: 'two_factor_enabled' })
  public twoFactorEnabled?: boolean | null;
}
