/**
 * App: Customer Registration
 * Package: ui
 * File: types.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T00:12:49Z
 * Exports: Customer, CustomerPayload
 * Description: Shared TypeScript interfaces for customer data exchanged with the API.
 */
export interface Customer {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  emails: string[];
  phoneNumbers: { type: string; number: string }[];
  address?: {
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;
  privacySettings: {
    marketingEmailsEnabled: boolean;
    twoFactorEnabled: boolean;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerPayload {
  firstName: string;
  middleName?: string;
  lastName: string;
  emails: string[];
  phoneNumbers: { type: string; number: string }[];
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  privacySettings: {
    marketingEmailsEnabled: boolean;
    twoFactorEnabled: boolean;
  };
}
