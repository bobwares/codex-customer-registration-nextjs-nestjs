import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'postal_addresses', schema: 'customer_domain' })
export class PostalAddressEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'address_id' })
  addressId!: number;

  @Column({ type: 'varchar', name: 'line1', length: 255 })
  line1!: string;

  @Column({ type: 'varchar', name: 'line2', length: 255, nullable: true })
  line2: string | null = null;

  @Column({ type: 'varchar', name: 'city', length: 100 })
  city!: string;

  @Column({ type: 'varchar', name: 'state', length: 100 })
  state!: string;

  @Column({ type: 'varchar', name: 'postal_code', length: 20 })
  postalCode!: string;

  @Column({ type: 'varchar', name: 'country', length: 2 })
  country!: string;

  @OneToMany(() => CustomerEntity, (customer) => customer.address)
  customers?: CustomerEntity[];
}

@Entity({ name: 'privacy_settings', schema: 'customer_domain' })
export class PrivacySettingsEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'privacy_settings_id' })
  privacySettingsId!: number;

  @Column({ type: 'boolean', name: 'marketing_emails_enabled' })
  marketingEmailsEnabled!: boolean;

  @Column({ type: 'boolean', name: 'two_factor_enabled' })
  twoFactorEnabled!: boolean;

  @OneToMany(() => CustomerEntity, (customer) => customer.privacySettings)
  customers?: CustomerEntity[];
}

@Index('ix_customers__address_id', ['addressId'])
@Index('ix_customers__privacy_settings_id', ['privacySettingsId'])
@Entity({ name: 'customers', schema: 'customer_domain' })
export class CustomerEntity {
  @PrimaryColumn('uuid', { name: 'customer_id', default: () => 'gen_random_uuid()' })
  customerId!: string;

  @Column({ type: 'varchar', name: 'first_name', length: 255 })
  firstName!: string;

  @Column({ type: 'varchar', name: 'middle_name', length: 255, nullable: true })
  middleName: string | null = null;

  @Column({ type: 'varchar', name: 'last_name', length: 255 })
  lastName!: string;

  @Column({ type: 'integer', name: 'address_id', nullable: true })
  addressId: number | null = null;

  @Column({ type: 'integer', name: 'privacy_settings_id', nullable: true })
  privacySettingsId: number | null = null;

  @Column({ type: 'timestamptz', name: 'created_at', default: () => 'now()' })
  createdAt!: Date;

  @Column({ type: 'timestamptz', name: 'updated_at', default: () => 'now()' })
  updatedAt!: Date;

  @ManyToOne(() => PostalAddressEntity, (address) => address.customers, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'address_id', referencedColumnName: 'addressId' })
  address?: PostalAddressEntity | null;

  @ManyToOne(() => PrivacySettingsEntity, (settings) => settings.customers, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'privacy_settings_id', referencedColumnName: 'privacySettingsId' })
  privacySettings?: PrivacySettingsEntity | null;

  @OneToMany(() => CustomerEmailEntity, (email) => email.customer)
  emails?: CustomerEmailEntity[];

  @OneToMany(() => CustomerPhoneNumberEntity, (phone) => phone.customer)
  phoneNumbers?: CustomerPhoneNumberEntity[];
}

@Unique('uq_customer_emails__customer_id_email', ['customerId', 'email'])
@Index('ix_customer_emails__customer_id', ['customerId'])
@Index('idx_customer_email_primary', ['customerId'], { where: '"is_primary" IS TRUE' })
@Entity({ name: 'customer_emails', schema: 'customer_domain' })
export class CustomerEmailEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'email_id' })
  emailId!: number;

  @Column({ type: 'uuid', name: 'customer_id' })
  customerId!: string;

  @Column({ type: 'varchar', name: 'email', length: 320 })
  email!: string;

  @Column({ type: 'boolean', name: 'is_primary' })
  isPrimary!: boolean;

  @Column({ type: 'timestamptz', name: 'created_at', default: () => 'now()' })
  createdAt!: Date;

  @ManyToOne(() => CustomerEntity, (customer) => customer.emails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'customerId' })
  customer!: CustomerEntity;
}

@Unique('uq_customer_phone_numbers__customer_id_number', ['customerId', 'number'])
@Index('ix_customer_phone_numbers__customer_id', ['customerId'])
@Entity({ name: 'customer_phone_numbers', schema: 'customer_domain' })
export class CustomerPhoneNumberEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'phone_id' })
  phoneId!: number;

  @Column({ type: 'uuid', name: 'customer_id' })
  customerId!: string;

  @Column({ type: 'varchar', name: 'type', length: 20 })
  kind!: string;

  @Column({ type: 'varchar', name: 'number', length: 20 })
  phoneNumber!: string;

  @Column({ type: 'timestamptz', name: 'created_at', default: () => 'now()' })
  createdAt!: Date;

  @ManyToOne(() => CustomerEntity, (customer) => customer.phoneNumbers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'customerId' })
  customer!: CustomerEntity;
}
