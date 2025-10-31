'use client';

/**
 * Forms Route Error Boundary
 * Catches and handles errors in form pages
 *
 * @module app/(dashboard)/forms/error
 */

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/layout/Card';
import { AlertCircle, RefreshCw, FileText, ArrowLeft } from 'lucide-react';

interface FormsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error Boundary for Forms Routes
 *
 * Displays a user-friendly error page for form-related errors.
 * Provides guidance on form data preservation and recovery.
 */
export default function FormsError({ error, reset }: FormsErrorProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('[Forms Error]', error);

    // TODO: Send to external monitoring service
    // Example: Sentry.captureException(error, {
    //   tags: { route: 'forms', category: 'form-submission' }
    // });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <Card className="max-w-md w-full">
        <div className="p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/20 mb-6">
            <AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Form Error
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            An error occurred while processing your form. Your data may have been saved as a draft.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Error Details (Development Only)
              </summary>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto max-h-40">
                {error.message}
              </pre>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" onClick={reset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Link href="/forms">
              <Button variant="secondary">
                <FileText className="h-4 w-4 mr-2" />
                All Forms
              </Button>
            </Link>
          </div>

          <div className="mt-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
              Form Data Protection
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
              Your form data is automatically saved as you type. Check your drafts if you were filling out a form when this error occurred.
            </p>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            <p>Need help? Contact your system administrator.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
