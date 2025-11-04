'use client';

/**
 * Authentication Route Error Boundary
 * Catches and handles errors in authentication flows
 *
 * @module app/(auth)/error
 */

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, RefreshCw, LogIn } from 'lucide-react';

interface AuthErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error Boundary for Authentication Routes
 *
 * Displays a user-friendly error page for authentication-related errors.
 * Provides options to retry or return to login.
 */
export default function AuthError({ error, reset }: AuthErrorProps) {
  useEffect(() => {
    // Item 234: Log error to monitoring service
    console.error('[Auth Error]', error);

    // Send to Sentry in production
    if (process.env.NODE_ENV === 'production') {
      import('@/monitoring/sentry').then(({ captureException }) => {
        captureException(error, { route: 'auth' }, 'error');
      }).catch(err => {
        console.error('Failed to send error to Sentry:', err);
      });
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gray-50">
      <Card className="max-w-md w-full">
        <div className="p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/20 mb-6">
            <AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Authentication Error
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            An error occurred while processing your authentication request.
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
            <Button variant="default" onClick={reset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Link href="/login">
              <Button variant="secondary">
                <LogIn className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>If this problem persists, contact your system administrator.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}



