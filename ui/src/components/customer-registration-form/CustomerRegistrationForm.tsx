/**
 * App: Customer Registration
 * Package: ui/src/components/customer-registration-form
 * File: CustomerRegistrationForm.tsx
 * Version: 0.1.0
 * Turns: [1]
 * Author: ChatGPT
 * Date: 2025-09-18T16:44:28Z
 * Exports: CustomerRegistrationForm
 * Description: Controlled form that collects customer registration details and submits them to the API.
 */
'use client';

import { useCallback, useState } from 'react';

import {
  CustomerRegistrationPayload,
  PostalAddress,
  createEmptyCustomer,
  PhoneNumber,
} from '../../lib/customer';

interface CustomerRegistrationFormProps {
  onSubmit?: (payload: CustomerRegistrationPayload) => Promise<void> | void;
}

function sanitizeEmails(emails: string[]): string[] {
  return emails
    .map((email) => email.trim())
    .filter((email) => email.length > 0);
}

export default function CustomerRegistrationForm({
  onSubmit,
}: CustomerRegistrationFormProps): JSX.Element {
  const [formState, setFormState] = useState<CustomerRegistrationPayload>(createEmptyCustomer);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const updateField = useCallback(<K extends keyof CustomerRegistrationPayload>(key: K, value: CustomerRegistrationPayload[K]) => {
    setFormState((current) => ({ ...current, [key]: value }));
  }, []);

  const updatePhone = useCallback(
    (index: number, value: Partial<PhoneNumber>) => {
      setFormState((current) => ({
        ...current,
        phoneNumbers: current.phoneNumbers.map((phone, idx) =>
          idx === index ? { ...phone, ...value } : phone
        ),
      }));
    },
    []
  );

  const updateAddress = useCallback((value: Partial<PostalAddress>) => {
    setFormState((current) => ({
      ...current,
      address: { ...(current.address ?? ({} as PostalAddress)), ...value },
    }));
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setStatus('submitting');
      setError(null);

      try {
        const payload: CustomerRegistrationPayload = {
          ...formState,
          emails: sanitizeEmails(formState.emails),
          phoneNumbers: formState.phoneNumbers.filter((phone) => phone.number.trim().length > 0),
        };

        if (!payload.firstName.trim() || !payload.lastName.trim() || payload.emails.length === 0) {
          throw new Error('First name, last name, and at least one email are required.');
        }

        if (onSubmit) {
          await onSubmit(payload);
        } else {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/customers`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
        }

        setStatus('success');
      } catch (submissionError) {
        setStatus('error');
        setError(submissionError instanceof Error ? submissionError.message : 'Unexpected error');
      }
    },
    [formState, onSubmit]
  );

  const resetForm = useCallback(() => {
    setFormState(createEmptyCustomer());
    setStatus('idle');
    setError(null);
  }, []);

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col text-sm font-medium text-slate-600">
          First Name
          <input
            className="mt-1 rounded border border-slate-300 px-3 py-2 text-sm"
            name="firstName"
            value={formState.firstName}
            onChange={(event) => updateField('firstName', event.target.value)}
            required
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-600">
          Last Name
          <input
            className="mt-1 rounded border border-slate-300 px-3 py-2 text-sm"
            name="lastName"
            value={formState.lastName}
            onChange={(event) => updateField('lastName', event.target.value)}
            required
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-600">
          Middle Name
          <input
            className="mt-1 rounded border border-slate-300 px-3 py-2 text-sm"
            name="middleName"
            value={formState.middleName ?? ''}
            onChange={(event) => updateField('middleName', event.target.value)}
          />
        </label>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">Emails</h2>
        {formState.emails.map((email, index) => (
          <input
            key={index}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            type="email"
            value={email}
            required={index === 0}
            placeholder="customer@example.com"
            onChange={(event) =>
              setFormState((current) => {
                const next = [...current.emails];
                next[index] = event.target.value;
                return { ...current, emails: next };
              })
            }
          />
        ))}
        <button
          type="button"
          className="rounded border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100"
          onClick={() => setFormState((current) => ({ ...current, emails: [...current.emails, ''] }))}
        >
          Add Email
        </button>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">Phone Numbers</h2>
        {formState.phoneNumbers.map((phone, index) => (
          <div key={index} className="flex flex-col gap-2 md:flex-row">
            <select
              className="rounded border border-slate-300 px-3 py-2 text-sm"
              value={phone.type}
              onChange={(event) => updatePhone(index, { type: event.target.value as PhoneNumber['type'] })}
            >
              <option value="mobile">Mobile</option>
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </select>
            <input
              className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
              placeholder="+15555550123"
              value={phone.number}
              onChange={(event) => updatePhone(index, { number: event.target.value })}
            />
          </div>
        ))}
        <button
          type="button"
          className="rounded border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100"
          onClick={() =>
            setFormState((current) => ({
              ...current,
              phoneNumbers: [...current.phoneNumbers, { type: 'mobile', number: '' }],
            }))
          }
        >
          Add Phone
        </button>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">Address</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            placeholder="Street Address"
            value={formState.address?.line1 ?? ''}
            onChange={(event) => updateAddress({ line1: event.target.value })}
          />
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            placeholder="Apartment, suite, etc."
            value={formState.address?.line2 ?? ''}
            onChange={(event) => updateAddress({ line2: event.target.value })}
          />
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            placeholder="City"
            value={formState.address?.city ?? ''}
            onChange={(event) => updateAddress({ city: event.target.value })}
          />
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            placeholder="State"
            value={formState.address?.state ?? ''}
            onChange={(event) => updateAddress({ state: event.target.value })}
          />
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            placeholder="Postal Code"
            value={formState.address?.postalCode ?? ''}
            onChange={(event) => updateAddress({ postalCode: event.target.value })}
          />
          <input
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            placeholder="Country"
            value={formState.address?.country ?? ''}
            onChange={(event) => updateAddress({ country: event.target.value })}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-700">Privacy Settings</h2>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={formState.privacySettings.marketingEmailsEnabled}
            onChange={(event) =>
              updateField('privacySettings', {
                ...formState.privacySettings,
                marketingEmailsEnabled: event.target.checked,
              })
            }
          />
          Receive marketing emails
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={formState.privacySettings.twoFactorEnabled}
            onChange={(event) =>
              updateField('privacySettings', {
                ...formState.privacySettings,
                twoFactorEnabled: event.target.checked,
              })
            }
          />
          Enable two-factor authentication
        </label>
      </section>

      {status === 'error' && error ? (
        <p className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      {status === 'success' ? (
        <p className="rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700" role="status">
          Customer registered successfully.
        </p>
      ) : null}

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Submitting…' : 'Submit Registration'}
        </button>
        <button
          type="button"
          className="rounded border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
          onClick={resetForm}
        >
          Reset
        </button>
      </div>
    </form>
  );
}
