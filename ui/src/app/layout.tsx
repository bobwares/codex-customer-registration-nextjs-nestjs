/**
 * # App: Customer Registration
 * # Package: ui.app
 * # File: src/app/layout.tsx
 * # Version: 0.1.0
 * # Turns: 1
 * # Author: AI Agent
 * # Date: 2025-09-18T19:33:35Z
 * # Exports: metadata, RootLayout
 * # Description: Root layout applying global metadata and Tailwind styling across pages.
 */
import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Customer Registration Portal',
  description: 'Register customers and manage onboarding preferences.',
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <main className="mx-auto w-full max-w-3xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
