/**
 * App: Customer Registration
 * Package: ui/src/lib
 * File: customer.ts
 * Version: 0.1.1
 * Turns: [1]
 * Author: ChatGPT
 * Date: 2025-09-18T16:44:28Z
 * Exports: CustomerRegistrationPayload, PrivacySettings, PostalAddress, PhoneNumber, createEmptyCustomer
 * Description: Shared customer domain types and helpers for the UI layer.
 */
export interface PhoneNumber {
  type: 'mobile' | 'home' | 'work' | 'other';
  number: string;
}

export interface PostalAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PrivacySettings {
  marketingEmailsEnabled: boolean;
  twoFactorEnabled: boolean;
}

export interface CustomerRegistrationPayload {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  emails: string[];
  phoneNumbers: PhoneNumber[];
  address?: PostalAddress;
  privacySettings: PrivacySettings;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `customer-${Math.random().toString(36).slice(2, 10)}`;
}

export function createEmptyCustomer(): CustomerRegistrationPayload {
  return {
    id: generateId(),
    firstName: '',
    middleName: '',
    lastName: '',
    emails: [''],
    phoneNumbers: [{ type: 'mobile', number: '' }],
    privacySettings: {
      marketingEmailsEnabled: true,
      twoFactorEnabled: true,
    },
  };
}
