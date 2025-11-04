'use client';

/**
 * Billing Route Error Boundary
 * Catches and handles errors in billing pages
 *
 * @module app/(dashboard)/billing/error
 */

import { ErrorPage } from '@/components/common/ErrorPage';
import { Card } from '@/components/ui/card';
import { RefreshCw, DollarSign } from 'lucide-react';

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
  return (
    <>
      <ErrorPage
        error={error}
        reset={reset}
        title="Billing Error"
        message="An error occurred while processing your billing request. No charges have been made."
        context="Billing"
        useContainer={false}
        primaryAction={{
          label: 'Try Again',
          onClick: reset,
          icon: RefreshCw,
        }}
        secondaryAction={{
          label: 'Billing Home',
          href: '/billing',
          icon: DollarSign,
        }}
        tertiaryAction={{
          label: 'Back to Dashboard',
          href: '/dashboard',
        }}
        footerMessage=""
      />

      {/* Financial security notice */}
      <div className="max-w-lg mx-auto mt-4 px-4">
        <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
            Important: Your financial data is secure
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
            This error did not result in any charges or data loss. If you need immediate assistance with billing, contact your administrator.
          </p>
        </Card>
      </div>
    </>
  );
}



