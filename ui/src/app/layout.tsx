/**
 * App: Customer Registration
 * Package: ui/src/app
 * File: layout.tsx
 * Version: 0.1.1
 * Turns: [1]
 * Author: ChatGPT
 * Date: 2025-09-18T16:44:28Z
 * Exports: metadata, RootLayout
 * Description: Defines global layout and metadata for the Customer Registration Next.js app.
 */
import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Customer Registration',
  description: 'Register new customers and manage onboarding workflows.',
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <div className="min-h-screen">
          <header className="border-b border-slate-200 bg-white shadow-sm">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
              <h1 className="text-xl font-semibold">Customer Registration Portal</h1>
              <p className="text-sm text-slate-500">Secure onboarding experience</p>
            </div>
          </header>
          <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
