/**
 * App: Customer Registration
 * Package: ui.tests
 * File: src/app/page.test.tsx
 * Version: 0.1.3
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T20:21:56Z
 * Exports: (test suite)
 * Description: Validates the customer registration form renders and submits data.
 */
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CustomerRegistrationPage from './page';

describe('CustomerRegistrationPage', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response);
    (globalThis as unknown as { fetch: typeof fetch }).fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    fetchMock.mockReset();
    delete (globalThis as { fetch?: typeof fetch }).fetch;
  });

  it('renders the form inputs', () => {
    render(<CustomerRegistrationPage />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/primary email/i)).toBeInTheDocument();
  });

  it('submits form data to the API', async () => {
    render(<CustomerRegistrationPage />);
    const user = userEvent.setup();

    await act(async () => {
      await user.type(screen.getByLabelText(/first name/i), 'Amy');
      await user.type(screen.getByLabelText(/last name/i), 'Pond');
      await user.type(screen.getByLabelText(/primary email/i), 'amy.pond@example.com');

      await user.click(screen.getByRole('button', { name: /register customer/i }));
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(
      await screen.findByText(/customer registered successfully/i),
    ).toBeInTheDocument();
  });
});
