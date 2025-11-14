/**
 * @fileoverview Forgot Password Page - Password Reset Request Interface
 *
 * This page allows users to request a password reset link via email.
 * Implements HIPAA-compliant password recovery with secure server actions.
 *
 * @module app/forgot-password/page
 * @category Authentication
 * @route /forgot-password - Password reset request
 */

'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { requestPasswordResetAction } from '@/identity-access/actions/auth.actions';

/**
 * Submit Button Component with loading state
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
          Sending reset link...
        </>
      ) : (
        'Send reset link'
      )}
    </button>
  );
}

/**
 * Forgot Password Page Component
 */
export default function ForgotPasswordPage() {
  const [formState, formAction] = useActionState(requestPasswordResetAction, { success: false });
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  // Show success message after submission
  if (formState.success && !emailSubmitted) {
    setEmailSubmitted(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {/* Success Message */}
        {emailSubmitted && formState.success && (
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
                <h3 className="text-sm font-medium text-green-800">
                  Check your email
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    If an account exists with that email address, we&apos;ve sent you a password reset link. 
                    Please check your inbox and spam folder.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {formState.errors?._form && (
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
                <h3 className="text-sm font-medium text-red-800">
                  {formState.errors._form[0]}
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {!emailSubmitted && (
          <form className="mt-8 space-y-6" action={formAction} noValidate>
            <div className="rounded-md shadow-sm">
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
                  className={`appearance-none relative block w-full px-3 py-2 border ${
                    formState.errors?.email ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
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
            </div>

            {/* Submit Button */}
            <div>
              <SubmitButton />
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to login
              </Link>
            </div>
          </form>
        )}

        {/* If email was submitted, show option to try again */}
        {emailSubmitted && (
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Didn&apos;t receive the email?
            </p>
            <button
              onClick={() => setEmailSubmitted(false)}
              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try another email address
            </button>
            <div>
              <Link
                href="/login"
                className="font-medium text-gray-600 hover:text-gray-500"
              >
                Back to login
              </Link>
            </div>
          </div>
        )}

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
