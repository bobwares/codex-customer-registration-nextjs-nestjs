/**
 * App: Customer Registration
 * Package: ui.pages
 * File: pages/index.tsx
 * Version: 0.1.0
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T00:12:49Z
 * Exports: HomePage, getServerSideProps
 * Description: Landing page that lists customers and provides a creation form with live
 *              updates sourced from the API.
 */
import Head from 'next/head';
import React, { useCallback, useState } from 'react';
import useSWR from 'swr';

import { CustomerForm } from '../components/CustomerForm';
import { CustomerList } from '../components/CustomerList';
import { apiBaseUrl, fetchJson } from '../lib/api';
import { Customer, CustomerPayload } from '../types';

async function createCustomer(payload: CustomerPayload): Promise<Customer> {
  const response = await fetch(`${apiBaseUrl}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Failed to create customer');
  }
  return (await response.json()) as Customer;
}

export const HomePage: React.FC = () => {
  const { data, mutate } = useSWR<Customer[]>(`${apiBaseUrl}/customers`, fetchJson);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleSubmit = useCallback(
    async (payload: CustomerPayload) => {
      const customer = await createCustomer(payload);
      await mutate(async (current) =>
        current ? [...current, customer] : [customer],
        { revalidate: true },
      );
      setSelectedCustomer(customer);
    },
    [mutate],
  );

  return (
    <>
      <Head>
        <title>Customer Registration</title>
      </Head>
      <main>
        <h1>Customer Registration</h1>
        <section>
          <h2>Customers</h2>
          <CustomerList customers={data ?? []} onSelect={setSelectedCustomer} />
        </section>
        <section>
          <h2>Add a Customer</h2>
          <CustomerForm initial={selectedCustomer ?? undefined} onSubmit={handleSubmit} />
        </section>
      </main>
    </>
  );
};

export default HomePage;
