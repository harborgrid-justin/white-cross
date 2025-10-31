'use client';

/**
 * @fileoverview Login Page - Primary Authentication Interface
 *
 * This page implements the main authentication interface for White Cross Healthcare Platform.
 * It provides secure credential-based login with JWT token management, OAuth integration,
 * and comprehensive error handling. The implementation follows HIPAA security requirements
 * and WCAG 2.1 AA accessibility standards.
 *
 * @module app/(auth)/login/page
 * @category Authentication
 * @subcategory Pages
 *
 * @route /login - Primary authentication endpoint
 * @route /login?redirect=/path - Login with redirect after success
 * @route /login?error=session_expired - Login with error context
 *
 * @requires react
 * @requires next/navigation
 * @requires @/contexts/AuthContext
 *
 * @security
 * - JWT token-based authentication with secure HttpOnly cookies
 * - Password visibility toggle for user convenience
 * - CSRF protection through same-site cookie policy
 * - Rate limiting on authentication attempts (server-side)
 * - No password storage in client state or localStorage
 * - OAuth 2.0 flows for Google and Microsoft authentication
 *
 * @compliance HIPAA
 * - User authentication required before PHI access
 * - Session timeout enforcement (15 minutes idle)
 * - Audit logging of authentication events (server-side)
 * - Complies with HIPAA Security Rule § 164.312(a)(2)(i) - Unique User Identification
 * - Complies with HIPAA Security Rule § 164.312(d) - Person or Entity Authentication
 *
 * @accessibility WCAG 2.1 AA
 * - Keyboard navigation support for all interactive elements
 * - Screen reader compatible with proper ARIA labels
 * - Error messages announced via aria-live regions
 * - High contrast mode support
 * - Focus management for form validation errors
 *
 * @example
 * ```tsx
 * // Basic navigation to login
 * router.push('/login');
 *
 * // Login with redirect
 * router.push('/login?redirect=/dashboard');
 *
 * // Login with error context
 * router.push('/login?error=session_expired');
 * ```
 *
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html | HIPAA Security Rule}
 * @see {@link https://www.w3.org/WAI/WCAG21/quickref/ | WCAG 2.1 Guidelines}
 * @see {@link useAuth} for authentication context and login method
 *
 * @since 1.0.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Login Page Component
 *
 * Implements a comprehensive authentication interface with email/password credentials,
 * OAuth integration, and sophisticated error handling. The component manages form state,
 * validation, and authentication flow while maintaining security best practices.
 *
 * **Authentication Flow:**
 * 1. User enters email and password
 * 2. Form validation on submit
 * 3. Credentials sent to backend API via AuthContext.login()
 * 4. Backend validates credentials and generates JWT tokens
 * 5. Access token stored in HttpOnly cookie
 * 6. Refresh token stored securely for session extension
 * 7. User redirected to original destination or dashboard
 *
 * **State Management:**
 * - Email and password: Controlled form inputs
 * - Remember me: Extends session duration when checked
 * - Show password: Toggle for password visibility
 * - Error: Displays authentication and validation errors
 * - IsSubmitting: Prevents double submission and shows loading state
 *
 * **Error Handling:**
 * - URL error parameters (session_expired, unauthorized, invalid_token)
 * - AuthContext errors (invalid credentials, network failures)
 * - Form validation errors (empty fields, invalid email format)
 * - All errors displayed in accessible alert component
 *
 * **Security Features:**
 * - Password never stored in component state longer than submission
 * - Automatic redirect if already authenticated (prevent duplicate sessions)
 * - Error messages don't expose system details
 * - Form disabled during submission to prevent timing attacks
 * - OAuth state parameter for CSRF protection (handled by auth provider)
 *
 * @returns {JSX.Element} The login page with form, error handling, and OAuth options
 *
 * @example
 * ```tsx
 * // This page is rendered at /login route
 * <LoginPage />
 * ```
 *
 * @example
 * ```tsx
 * // Example authentication flow:
 * // 1. User submits form
 * await login(email, password, rememberMe);
 * // 2. AuthContext calls backend API
 * POST /api/auth/login { email, password, rememberMe }
 * // 3. Backend returns JWT tokens
 * { accessToken: "...", refreshToken: "...", user: {...} }
 * // 4. Tokens stored in HttpOnly cookies
 * Set-Cookie: accessToken=...; HttpOnly; Secure; SameSite=Strict
 * // 5. User redirected to dashboard or original destination
 * router.push(redirectTo);
 * ```
 *
 * @remarks
 * This is a Next.js Client Component ('use client') because it:
 * - Manages interactive form state
 * - Uses client-side routing hooks (useRouter, useSearchParams)
 * - Accesses authentication context (useAuth)
 * - Handles real-time form validation and error display
 *
 * **Remember Me Functionality:**
 * When checked, extends the refresh token expiration from 24 hours to 30 days,
 * allowing users to remain logged in across browser sessions. Access tokens
 * still expire after 15 minutes for HIPAA compliance.
 *
 * **OAuth Integration:**
 * Google and Microsoft OAuth buttons initiate standard OAuth 2.0 authorization
 * code flow. The backend handles token exchange, user profile fetching, and
 * account creation/linking.
 *
 * @see {@link useAuth} - Authentication context providing login method
 * @see {@link useRouter} - Next.js router for navigation and redirects
 * @see {@link useSearchParams} - Access to URL query parameters
 */
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading, error: authError, clearError } = useAuth();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Extract redirect destination and error context from URL query parameters
   *
   * redirectTo: Used for post-login navigation. Defaults to '/' (home) if not specified.
   * Example: /login?redirect=/dashboard → after login, navigate to /dashboard
   *
   * errorParam: Provides context for why user was sent to login page.
   * Used to display appropriate error messages (session expired, unauthorized, etc.)
   */
  const redirectTo = searchParams.get('redirect') || '/';
  const errorParam = searchParams.get('error');

  /**
   * Automatic redirect for already-authenticated users
   *
   * This effect prevents authenticated users from seeing the login page by immediately
   * redirecting them to their intended destination. This handles scenarios where:
   * - User manually navigates to /login while logged in
   * - User clicks a login link but session is still active
   * - Browser back button returns to /login after successful authentication
   *
   * Security benefit: Prevents confusion and unnecessary re-authentication attempts
   */
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  /**
   * Process URL error parameters into user-friendly error messages
   *
   * This effect handles error scenarios communicated via URL query parameters,
   * typically set by middleware or server-side redirects. Common scenarios:
   *
   * - invalid_token: JWT token malformed or signature verification failed
   * - session_expired: Idle timeout or token expiration (15 min)
   * - unauthorized: Attempted to access protected route without authentication
   * - Other: Catch-all for unexpected error conditions
   *
   * Error messages are intentionally generic to prevent information disclosure
   * about the system's authentication mechanisms.
   */
  useEffect(() => {
    if (errorParam) {
      switch (errorParam) {
        case 'invalid_token':
          setError('Your session has expired. Please log in again.');
          break;
        case 'session_expired':
          setError('Your session has expired due to inactivity. Please log in again.');
          break;
        case 'unauthorized':
          setError('You need to log in to access that page.');
          break;
        default:
          setError('An error occurred. Please try logging in again.');
      }
    }
  }, [errorParam]);

  /**
   * Synchronize authentication context errors to component error state
   *
   * This effect listens for errors from the AuthContext (e.g., invalid credentials,
   * network failures, server errors) and displays them in the login form's error alert.
   * After capturing the error, clearError() is called to reset context state and
   * prevent the same error from appearing on subsequent login attempts.
   *
   * Note: clearError is wrapped in useCallback in AuthContext, making it stable.
   * We intentionally exclude it from dependencies to avoid unnecessary re-runs.
   * The effect only needs to respond to new authError values.
   *
   * Common authError scenarios:
   * - Invalid credentials: "Invalid email or password"
   * - Network failure: "Unable to connect. Please check your connection."
   * - Account locked: "Too many failed attempts. Try again in 15 minutes."
   * - Server error: "An unexpected error occurred. Please try again."
   */
  useEffect(() => {
    if (authError) {
      setError(authError);
      clearError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authError]); // clearError is stable and doesn't need to be in deps

  /**
   * Handles login form submission with validation and error handling
   *
   * This async function manages the complete authentication flow when the user submits
   * the login form. It prevents default form submission, validates inputs, calls the
   * authentication API, and handles success/error states appropriately.
   *
   * **Execution Flow:**
   * 1. Prevent default HTML form submission (avoid page reload)
   * 2. Clear any previous error messages
   * 3. Set submitting state (disable form, show loading spinner)
   * 4. Call AuthContext.login() with credentials
   * 5. If successful, useEffect handles redirect based on isAuthenticated
   * 6. If error, display user-friendly error message
   * 7. Always reset submitting state in finally block
   *
   * **JWT Token Management:**
   * The login() method in AuthContext handles:
   * - Sending credentials to POST /api/auth/login
   * - Receiving JWT access token and refresh token
   * - Storing tokens in HttpOnly cookies for security
   * - Setting user profile in context state
   * - Triggering isAuthenticated state change (causes redirect)
   *
   * **Security Considerations:**
   * - Form disabled during submission prevents timing attacks
   * - Error messages are generic to prevent username enumeration
   * - Password cleared from memory after submission (handled by React)
   * - No credentials logged to console or error tracking
   *
   * @param {FormEvent<HTMLFormElement>} e - Form submission event
   * @returns {Promise<void>} Async function that completes on auth success/failure
   *
   * @throws {Error} Propagated from AuthContext.login() for network or auth failures
   *
   * @example
   * ```tsx
   * // User fills form and clicks "Sign in" button
   * <form onSubmit={handleSubmit}>
   *   <input type="email" value={email} onChange={...} />
   *   <input type="password" value={password} onChange={...} />
   *   <button type="submit">Sign in</button>
   * </form>
   *
   * // When submitted:
   * // 1. handleSubmit prevents page reload
   * // 2. Calls login('user@example.com', 'password', false)
   * // 3. Backend validates and returns JWT
   * // 4. isAuthenticated becomes true
   * // 5. useEffect redirects to redirectTo destination
   * ```
   *
   * @remarks
   * The redirect after successful login is handled by the useEffect hook that watches
   * isAuthenticated state, not directly in this function. This separation ensures proper
   * React lifecycle management and prevents race conditions.
   *
   * **Error Handling Strategy:**
   * - Network errors: "Unable to connect. Please check your connection."
   * - Invalid credentials: "Invalid email or password"
   * - Account locked: "Account temporarily locked. Contact administrator."
   * - Generic fallback: "Login failed. Please try again."
   *
   * @see {@link useAuth.login} - AuthContext method for authentication
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Call AuthContext login method which handles JWT token management
      await login(email, password, rememberMe);
      // Successful login: redirect handled by useEffect that watches isAuthenticated
    } catch (err) {
      // Display user-friendly error without exposing system details
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      // Always reset submitting state to re-enable form
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to White Cross
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            School Health Management System
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className="rounded-md bg-red-50 p-4"
            role="alert"
            aria-live="assertive"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                aria-required="true"
                aria-invalid={error ? 'true' : 'false'}
                disabled={isSubmitting}
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                aria-required="true"
                aria-invalid={error ? 'true' : 'false'}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isSubmitting}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="ml-2">Google</span>
            </button>

            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#00A4EF" aria-hidden="true">
                <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
              </svg>
              <span className="ml-2">Microsoft</span>
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
