/**
 * @fileoverview Login Page - Primary Authentication Interface using Server Actions
 *
 * This page implements the main authentication interface for White Cross Healthcare Platform
 * using Next.js server actions for secure server-side authentication. It provides secure 
 * credential-based login with JWT token management, comprehensive error handling, and 
 * follows HIPAA security requirements and WCAG 2.1 AA accessibility standards.
 *
 * @module app/login/page
 * @category Authentication
 * @subcategory Pages
 *
 * @route /login - Primary authentication endpoint
 * @route /login?redirect=/path - Login with redirect after success
 * @route /login?error=session_expired - Login with error context
 *
 * @requires react
 * @requires next/navigation
 * @requires handleLoginSubmission - Server action for form processing
 *
 * @security
 * - Server-side JWT token authentication with secure HttpOnly cookies
 * - Password visibility toggle for user convenience
 * - CSRF protection through Next.js server actions
 * - Rate limiting on authentication attempts (server-side)
 * - No password storage in client state or localStorage
 * - Server actions handle all authentication logic
 *
 * @compliance HIPAA
 * - User authentication required before PHI access
 * - Session timeout enforcement (server-side)
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
 * @since 1.0.0
 */

'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { handleLoginSubmission } from './actions';

/**
 * Submit Button Component with loading state
 * Uses React 19 useFormStatus hook to show loading state during server action execution
 */
function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-busy={pending}
    >
      {pending ? (
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
  );
}

/**
 * Login Page Component using Server Actions
 *
 * Implements a comprehensive authentication interface with email/password credentials
 * using Next.js server actions for secure server-side processing. The component manages 
 * form state through useFormState and handles authentication flow while maintaining 
 * security best practices.
 *
 * **Authentication Flow:**
 * 1. User enters email and password
 * 2. Form submitted via server action
 * 3. Server action validates credentials and generates JWT tokens
 * 4. Tokens stored in HttpOnly cookies (server-side)
 * 5. User redirected to dashboard on success
 * 6. Errors displayed in form state
 *
 * **State Management:**
 * - Form state: Managed by useFormState with server actions
 * - Show password: Client-side toggle for password visibility
 * - URL error parameters: Handled via useSearchParams
 * - Server errors: Returned from server action and displayed
 *
 * **Error Handling:**
 * - URL error parameters (session_expired, unauthorized, invalid_token)
 * - Server action errors (invalid credentials, validation errors)
 * - All errors displayed in accessible alert component
 *
 * **Security Features:**
 * - All authentication logic handled server-side
 * - Password never stored in client state
 * - Server actions provide CSRF protection
 * - Error messages don't expose system details
 * - HttpOnly cookies prevent XSS attacks
 *
 * @returns {JSX.Element} The login page with server action form
 */
export default function LoginPage() {
  const searchParams = useSearchParams();
  const [formState, formAction] = useActionState(handleLoginSubmission, { success: false });
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Extract error context from URL query parameters
   */
  const errorParam = searchParams.get('error');

  /**
   * Process URL error parameters into user-friendly error messages
   * Using useMemo to avoid the eslint warning about setState in useEffect
   */
  const urlError = useMemo(() => {
    if (!errorParam) return '';
    
    switch (errorParam) {
      case 'invalid_token':
        return 'Your session has expired. Please log in again.';
      case 'session_expired':
        return 'Your session has expired due to inactivity. Please log in again.';
      case 'unauthorized':
        return 'You need to log in to access that page.';
      default:
        return 'An error occurred. Please try logging in again.';
    }
  }, [errorParam]);

  /**
   * Get the error message to display
   * Priority: URL errors > Server action form errors
   */
  const getErrorMessage = () => {
    if (urlError) return urlError;
    if (formState.errors?._form?.[0]) return formState.errors._form[0];
    if (formState.errors?.email?.[0]) return formState.errors.email[0];
    if (formState.errors?.password?.[0]) return formState.errors.password[0];
    return '';
  };

  const errorMessage = getErrorMessage();

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
        {errorMessage && (
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
                <h3 className="text-sm font-medium text-red-800">{errorMessage}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {formState.success && (
          <div
            className="rounded-md bg-green-50 p-4"
            role="alert"
            aria-live="polite"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.23a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Login successful! Redirecting...</h3>
              </div>
            </div>
          </div>
        )}

        {/* Login Form with Server Action */}
        <form className="mt-8 space-y-6" action={formAction} noValidate>
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
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  formState.errors?.email ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
                aria-required="true"
                aria-invalid={formState.errors?.email ? true : false}
                aria-describedby={formState.errors?.email ? 'email-error' : undefined}
              />
              {formState.errors?.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                  {formState.errors.email[0]}
                </p>
              )}
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
                className={`appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border ${
                  formState.errors?.password ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
                aria-required="true"
                aria-invalid={formState.errors?.password ? true : false}
                aria-describedby={formState.errors?.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
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
              {formState.errors?.password && (
                <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">
                  {formState.errors.password[0]}
                </p>
              )}
            </div>
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
            <SubmitButton />
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
