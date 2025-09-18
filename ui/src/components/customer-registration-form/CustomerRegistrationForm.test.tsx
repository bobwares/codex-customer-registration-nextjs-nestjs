/**
 * App: Customer Registration
 * Package: ui/src/components/customer-registration-form
 * File: CustomerRegistrationForm.test.tsx
 * Version: 0.1.0
 * Turns: [1]
 * Author: ChatGPT
 * Date: 2025-09-18T16:44:28Z
 * Description: Ensures the registration form validates inputs and triggers submission handler.
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import CustomerRegistrationForm from './CustomerRegistrationForm';

describe('CustomerRegistrationForm', () => {
  it('requires first name, last name, and email', async () => {
    const handleSubmit = jest.fn().mockResolvedValue(undefined);

    render(<CustomerRegistrationForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Johnson' } });
    fireEvent.change(screen.getByPlaceholderText(/customer@example.com/i), {
      target: { value: 'alice@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit registration/i }));

    await waitFor(() => expect(handleSubmit).toHaveBeenCalled());
    expect(handleSubmit.mock.calls[0][0]).toMatchObject({
      firstName: 'Alice',
      lastName: 'Johnson',
      emails: ['alice@example.com'],
    });
  });

  it('shows validation error when email missing', async () => {
    render(<CustomerRegistrationForm onSubmit={jest.fn()} />);

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Johnson' } });
    fireEvent.change(screen.getByPlaceholderText(/customer@example.com/i), { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /submit registration/i }));

    await waitFor(() => screen.getByRole('alert'));
    expect(screen.getByRole('alert')).toHaveTextContent(/required/);
  });
});
