/**
 * # App: Customer Registration
 * # Package: ui.app
 * # File: src/app/page.tsx
 * # Version: 0.1.0
 * # Turns: 1
 * # Author: AI Agent
 * # Date: 2025-09-18T19:33:35Z
 * # Exports: CustomerRegistrationPage
 * # Description: Renders the customer registration form and submits onboarding data to the API.
 */
'use client';

import { FormEvent, useMemo, useState } from 'react';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  marketingEmailsEnabled: boolean;
  twoFactorEnabled: boolean;
}

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

const initialState: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  marketingEmailsEnabled: true,
  twoFactorEnabled: false,
};

export default function CustomerRegistrationPage(): JSX.Element {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [status, setStatus] = useState<SubmissionState>('idle');
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api',
    [],
  );

  const isDisabled =
    status === 'submitting' || formState.firstName.trim() === '' || formState.lastName.trim() === '' || !formState.email;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setStatus('submitting');
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: crypto.randomUUID(),
          firstName: formState.firstName,
          lastName: formState.lastName,
          emails: [formState.email],
          privacySettings: {
            marketingEmailsEnabled: formState.marketingEmailsEnabled,
            twoFactorEnabled: formState.twoFactorEnabled,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Registration failed with status ${response.status}`);
      }

      setStatus('success');
      setFormState(initialState);
    } catch (submissionError: unknown) {
      setStatus('error');
      setError(submissionError instanceof Error ? submissionError.message : 'Unknown error');
    }
  };

  return (
    <section className="space-y-8">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Customer Registration</h1>
        <p className="text-slate-600">
          Capture essential contact details and privacy preferences before activating a new account.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 shadow">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col text-left text-sm font-medium text-slate-700">
            First Name
            <input
              className="mt-1 rounded border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring"
              type="text"
              name="firstName"
              value={formState.firstName}
              onChange={(event) =>
                setFormState((state) => ({ ...state, firstName: event.target.value }))
              }
              required
            />
          </label>

          <label className="flex flex-col text-left text-sm font-medium text-slate-700">
            Last Name
            <input
              className="mt-1 rounded border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring"
              type="text"
              name="lastName"
              value={formState.lastName}
              onChange={(event) =>
                setFormState((state) => ({ ...state, lastName: event.target.value }))
              }
              required
            />
          </label>
        </div>

        <label className="flex flex-col text-left text-sm font-medium text-slate-700">
          Primary Email
          <input
            className="mt-1 rounded border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring"
            type="email"
            name="email"
            value={formState.email}
            onChange={(event) => setFormState((state) => ({ ...state, email: event.target.value }))}
            required
          />
        </label>

        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-slate-700">Privacy Preferences</legend>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={formState.marketingEmailsEnabled}
              onChange={(event) =>
                setFormState((state) => ({
                  ...state,
                  marketingEmailsEnabled: event.target.checked,
                }))
              }
            />
            Receive marketing emails
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={formState.twoFactorEnabled}
              onChange={(event) =>
                setFormState((state) => ({ ...state, twoFactorEnabled: event.target.checked }))
              }
            />
            Enable two-factor authentication
          </label>
        </fieldset>

        <button
          type="submit"
          disabled={isDisabled}
          className="w-full rounded bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {status === 'submitting' ? 'Submitting…' : 'Register Customer'}
        </button>

        {status === 'success' && (
          <p className="rounded bg-emerald-50 p-3 text-sm text-emerald-700">
            Customer registered successfully.
          </p>
        )}

        {status === 'error' && error && (
          <p className="rounded bg-rose-50 p-3 text-sm text-rose-700">{error}</p>
        )}
      </form>
    </section>
  );
}
