/**
 * App: Customer Registration
 * Package: ui.components.tests
 * File: components/CustomerForm.test.tsx
 * Version: 0.1.1
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T00:12:49Z
 * Exports: none
 * Description: Exercises the customer form submission workflow.
 */
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { CustomerForm } from './CustomerForm';

describe('CustomerForm', () => {
  it('submits entered data', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<CustomerForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('First name'), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByLabelText('Last name'), { target: { value: 'Lovelace' } });
    fireEvent.change(screen.getByLabelText('Primary email'), {
      target: { value: 'ada@example.com' },
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: 'Save Customer' }));
    });

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });
});
