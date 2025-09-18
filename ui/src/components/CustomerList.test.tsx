/**
 * App: Customer Registration
 * Package: ui.components.tests
 * File: components/CustomerList.test.tsx
 * Version: 0.1.0
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T00:12:49Z
 * Exports: none
 * Description: Verifies rendering of the customer list component.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { CustomerList } from './CustomerList';
import { Customer } from '../types';

describe('CustomerList', () => {
  it('renders customers in a table', () => {
    const customers: Customer[] = [
      {
        id: '1',
        firstName: 'Ada',
        lastName: 'Lovelace',
        emails: ['ada@example.com'],
        phoneNumbers: [{ type: 'mobile', number: '+14155550100' }],
        address: null,
        privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const onSelect = jest.fn();
    render(<CustomerList customers={customers} onSelect={onSelect} />);

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Ada Lovelace'));
    expect(onSelect).toHaveBeenCalledWith(customers[0]);
  });
});
