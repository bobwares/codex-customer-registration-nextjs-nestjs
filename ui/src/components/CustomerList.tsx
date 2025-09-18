/**
 * App: Customer Registration
 * Package: ui.components
 * File: components/CustomerList.tsx
 * Version: 0.1.0
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T00:12:49Z
 * Exports: CustomerList
 * Description: Presents a tabular view of customer profiles and emits selection events.
 */
import React from 'react';

import { Customer } from '../types';

export interface CustomerListProps {
  customers: Customer[];
  onSelect: (customer: Customer) => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({ customers, onSelect }) => {
  if (customers.length === 0) {
    return <p>No customers found. Add the first one using the form.</p>;
  }

  return (
    <table className="customer-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Marketing Opt-In</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <tr key={customer.id} onClick={() => onSelect(customer)}>
            <td>
              {customer.firstName} {customer.lastName}
            </td>
            <td>{customer.emails[0]}</td>
            <td>{customer.phoneNumbers[0]?.number ?? '—'}</td>
            <td>{customer.privacySettings?.marketingEmailsEnabled ? 'Yes' : 'No'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
