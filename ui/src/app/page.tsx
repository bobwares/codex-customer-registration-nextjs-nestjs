/**
 * App: Customer Registration
 * Package: ui/src/app
 * File: page.tsx
 * Version: 0.1.0
 * Turns: [1]
 * Author: ChatGPT
 * Date: 2025-09-18T16:44:28Z
 * Exports: default CustomerRegistrationPage
 * Description: Renders the customer registration form and handles optimistic submission feedback.
 */
import CustomerRegistrationForm from '../components/customer-registration-form/CustomerRegistrationForm';

export default function CustomerRegistrationPage(): JSX.Element {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-800">Register a new customer</h2>
        <p className="text-sm text-slate-600">
          Capture and validate customer data before onboarding downstream systems.
        </p>
      </div>
      <CustomerRegistrationForm />
    </section>
  );
}
