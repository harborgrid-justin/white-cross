'use client';

/**
 * Admin Route Error Boundary
 * Catches and handles errors in admin pages
 *
 * @module app/admin/error
 */

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, RefreshCw, ArrowLeft, Shield } from 'lucide-react';

interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error Boundary for Admin Routes
 *
 * Displays a user-friendly error page for admin-related errors.
 * Provides options to retry or navigate to safe areas.
 */
export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    // Log error to monitoring service with admin context
    console.error('[Admin Error]', error);

    // TODO: Send to external monitoring service with high priority
    // Example: Sentry.captureException(error, {
    //   tags: { route: 'admin', priority: 'high' },
    //   level: 'error'
    // });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gray-50">
      <Card className="max-w-md w-full">
        <div className="p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Administrative Error
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            An error occurred while performing an administrative operation.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Error Details (Development Only)
              </summary>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto max-h-40">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
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
            <Link href="/admin/settings">
              <Button variant="secondary">
                <Shield className="h-4 w-4 mr-2" />
                Admin Settings
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

          <div className="mt-6 text-sm text-gray-500">
            <p>This error has been logged for investigation.</p>
            <p className="mt-1">Contact the development team if this problem persists.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}



