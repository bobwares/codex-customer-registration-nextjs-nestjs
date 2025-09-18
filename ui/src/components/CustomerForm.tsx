/**
 * App: Customer Registration
 * Package: ui.components
 * File: components/CustomerForm.tsx
 * Version: 0.1.1
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T00:12:49Z
 * Exports: CustomerForm
 * Description: Controlled form used to create or update customer profiles.
 */
import React, { useState } from 'react';

import { CustomerPayload } from '../types';

export interface CustomerFormProps {
  initial?: Partial<CustomerPayload>;
  onSubmit: (payload: CustomerPayload) => Promise<void>;
}

const createDefaultPayload = (): CustomerPayload => ({
  firstName: '',
  middleName: '',
  lastName: '',
  emails: [''],
  phoneNumbers: [{ type: 'mobile', number: '' }],
  address: {
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  },
  privacySettings: {
    marketingEmailsEnabled: true,
    twoFactorEnabled: true,
  },
});

export const CustomerForm: React.FC<CustomerFormProps> = ({ initial, onSubmit }) => {
  const defaults = createDefaultPayload();
  const [payload, setPayload] = useState<CustomerPayload>({
    ...defaults,
    ...initial,
    emails: initial?.emails ?? defaults.emails,
    phoneNumbers: initial?.phoneNumbers ?? defaults.phoneNumbers,
    address: {
      ...defaults.address!,
      ...(initial?.address ?? {}),
    },
  });
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof CustomerPayload, value: unknown): void => {
    setPayload((prev) => ({ ...prev, [field]: value } as CustomerPayload));
  };

  const submit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        ...payload,
        emails: payload.emails.filter((email) => email.trim().length > 0),
        phoneNumbers: payload.phoneNumbers.filter((phone) => phone.number.trim().length > 0),
      });
      setPayload(createDefaultPayload());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="customer-form" onSubmit={submit}>
      <div className="field-group">
        <label htmlFor="firstName">First name</label>
        <input
          id="firstName"
          value={payload.firstName}
          onChange={(event) => updateField('firstName', event.target.value)}
          required
        />
      </div>
      <div className="field-group">
        <label htmlFor="middleName">Middle name</label>
        <input
          id="middleName"
          value={payload.middleName ?? ''}
          onChange={(event) => updateField('middleName', event.target.value)}
        />
      </div>
      <div className="field-group">
        <label htmlFor="lastName">Last name</label>
        <input
          id="lastName"
          value={payload.lastName}
          onChange={(event) => updateField('lastName', event.target.value)}
          required
        />
      </div>
      <div className="field-group">
        <label htmlFor="email">Primary email</label>
        <input
          id="email"
          type="email"
          value={payload.emails[0] ?? ''}
          onChange={(event) => updateField('emails', [event.target.value])}
          required
        />
      </div>
      <div className="field-group">
        <label htmlFor="phone">Primary phone</label>
        <input
          id="phone"
          value={payload.phoneNumbers[0]?.number ?? ''}
          onChange={(event) =>
            updateField('phoneNumbers', [{ type: 'mobile', number: event.target.value }])
          }
        />
      </div>
      <fieldset>
        <legend>Privacy</legend>
        <label>
          <input
            type="checkbox"
            checked={payload.privacySettings.marketingEmailsEnabled}
            onChange={(event) =>
              updateField('privacySettings', {
                ...payload.privacySettings,
                marketingEmailsEnabled: event.target.checked,
              })
            }
          />
          Marketing emails
        </label>
        <label>
          <input
            type="checkbox"
            checked={payload.privacySettings.twoFactorEnabled}
            onChange={(event) =>
              updateField('privacySettings', {
                ...payload.privacySettings,
                twoFactorEnabled: event.target.checked,
              })
            }
          />
          Two-factor authentication
        </label>
      </fieldset>
      {error ? <p className="error">{error}</p> : null}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save Customer'}
      </button>
    </form>
  );
};
