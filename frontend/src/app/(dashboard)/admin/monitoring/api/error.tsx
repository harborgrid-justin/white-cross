'use client';

/**
 * API Monitoring Route Error Boundary
 * Catches and handles errors in API monitoring pages
 *
 * @module app/admin/monitoring/api/error
 */

import { ErrorPage } from '@/components/common/ErrorPage';
import { RefreshCw, Activity } from 'lucide-react';

interface ApiMonitoringErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error Boundary for API Monitoring Routes
 *
 * Displays a user-friendly error page for API monitoring-related errors.
 * Provides options to retry or navigate to safe areas.
 */
export default function ApiMonitoringError({ error, reset }: ApiMonitoringErrorProps) {
  return (
    <ErrorPage
      error={error}
      reset={reset}
      title="API Monitoring Error"
      message="An error occurred while loading API monitoring data."
      context="API Monitoring"
      useContainer={false}
      primaryAction={{
        label: 'Try Again',
        onClick: reset,
        icon: RefreshCw,
      }}
      secondaryAction={{
        label: 'Monitoring Dashboard',
        href: '/admin/monitoring',
        icon: Activity,
      }}
      tertiaryAction={{
        label: 'Back to Admin',
        href: '/admin',
      }}
      footerMessage="This error has been logged for investigation. Check the system status or contact the development team if this problem persists."
    />
  );
}
