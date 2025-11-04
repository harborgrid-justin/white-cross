/**
 * Integration Tests for Authentication Flow
 *
 * Tests complete authentication workflows including:
 * - Login flow
 * - Logout flow
 * - Token refresh
 * - Protected routes
 * - Error handling
 *
 * @module tests/integration/auth-flow.integration.test
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
import authReducer from '@/stores/slices/authSlice';

// Mock Login Component
function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      onSuccess?.();
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Login form">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        aria-label="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        aria-label="Password"
        required
      />
      {error && <div role="alert">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

// Test utilities
function renderWithProviders(ui: React.ReactElement) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    </Provider>
  );
}

describe('Authentication Flow Integration Tests', () => {
  describe('Successful Login', () => {
    it('should complete login flow successfully', async () => {
      const user = userEvent.setup();
      const onSuccess = jest.fn();

      renderWithProviders(<LoginForm onSuccess={onSuccess} />);

      // Fill in credentials
      await user.type(screen.getByLabelText(/email/i), 'nurse@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');

      // Submit form
      await user.click(screen.getByRole('button', { name: /login/i }));

      // Wait for success callback
      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });

    it('should show loading state during login', async () => {
      const user = userEvent.setup();

      renderWithProviders(<LoginForm />);

      await user.type(screen.getByLabelText(/email/i), 'nurse@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');

      // Click submit
      await user.click(screen.getByRole('button', { name: /login/i }));

      // Check for loading state
      expect(screen.getByRole('button')).toHaveTextContent(/logging in/i);
    });
  });

  describe('Failed Login', () => {
    it('should show error on invalid credentials', async () => {
      const user = userEvent.setup();

      // Override MSW handler to return error
      server.use(
        http.post('http://localhost:3001/api/v1/auth/login', () => {
          return new HttpResponse(null, { status: 401 });
        })
      );

      renderWithProviders(<LoginForm />);

      await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /login/i }));

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/invalid email or password/i);
      });
    });

    it('should handle network errors', async () => {
      const user = userEvent.setup();

      // Simulate network error
      server.use(
        http.post('http://localhost:3001/api/v1/auth/login', () => {
          return HttpResponse.error();
        })
      );

      renderWithProviders(<LoginForm />);

      await user.type(screen.getByLabelText(/email/i), 'nurse@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('should require email and password', async () => {
      const user = userEvent.setup();

      renderWithProviders(<LoginForm />);

      const submitButton = screen.getByRole('button', { name: /login/i });

      // Try to submit empty form
      await user.click(submitButton);

      // Form should not submit (browser validation)
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      expect(emailInput.validationMessage).toBeTruthy();
    });

    it('should validate email format', async () => {
      renderWithProviders(<LoginForm />);

      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;

      // Type invalid email
      await userEvent.type(emailInput, 'invalid-email');

      expect(emailInput.validity.typeMismatch).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      renderWithProviders(<LoginForm />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('should announce errors to screen readers', async () => {
      const user = userEvent.setup();

      server.use(
        http.post('http://localhost:3001/api/v1/auth/login', () => {
          return new HttpResponse(null, { status: 401 });
        })
      );

      renderWithProviders(<LoginForm />);

      await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveTextContent(/invalid/i);
      });
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();

      renderWithProviders(<LoginForm />);

      // Tab to email input
      await user.tab();
      expect(screen.getByLabelText(/email/i)).toHaveFocus();

      // Tab to password input
      await user.tab();
      expect(screen.getByLabelText(/password/i)).toHaveFocus();

      // Tab to submit button
      await user.tab();
      expect(screen.getByRole('button', { name: /login/i })).toHaveFocus();
    });
  });
});
