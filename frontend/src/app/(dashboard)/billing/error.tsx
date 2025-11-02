'use client';

/**
 * Billing Route Error Boundary
 * Catches and handles errors in billing pages
 *
 * @module app/(dashboard)/billing/error
 */

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, RefreshCw, DollarSign, ArrowLeft } from 'lucide-react';

interface BillingErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error Boundary for Billing Routes
 *
 * Displays a user-friendly error page for billing-related errors.
 * Financial errors are treated with high priority due to compliance requirements.
 */
export default function BillingError({ error, reset }: BillingErrorProps) {
  useEffect(() => {
    // Log error to monitoring service with billing context
    console.error('[Billing Error]', error);

    // TODO: Send to external monitoring service with high priority
    // Financial errors should trigger alerts
    // Example: Sentry.captureException(error, {
    //   tags: { route: 'billing', priority: 'high', category: 'financial' },
    //   level: 'error'
    // });

    // TODO: Audit log for financial operation failures
    // auditLog({
    //   action: 'BILLING_ERROR',
    //   resource: 'Billing',
    //   success: false,
    //   errorMessage: error.message
    // });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <Card className="max-w-md w-full">
        <div className="p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Billing Error
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            An error occurred while processing your billing request. No charges have been made.
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
            <Link href="/billing">
              <Button variant="secondary">
                <DollarSign className="h-4 w-4 mr-2" />
                Billing Home
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
              Important: Your financial data is secure
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
              This error did not result in any charges or data loss. If you need immediate assistance with billing, contact your administrator.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}



