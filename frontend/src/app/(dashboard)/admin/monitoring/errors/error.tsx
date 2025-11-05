'use client';

/**
 * Error Monitoring Route Error Boundary
 * Catches and handles errors in error monitoring pages
 *
 * @module app/admin/monitoring/errors/error
 */

import { ErrorPage } from '@/components/common/ErrorPage';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface ErrorMonitoringErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error Boundary for Error Monitoring Routes
 *
 * Displays a user-friendly error page for error monitoring-related errors.
 * Provides options to retry or navigate to safe areas.
 */
export default function ErrorMonitoringError({ error, reset }: ErrorMonitoringErrorProps) {
  return (
    <ErrorPage
      error={error}
      reset={reset}
      title="Error Monitoring Error"
      message="An error occurred while loading error monitoring data."
      context="Error Monitoring"
      useContainer={false}
      primaryAction={{
        label: 'Try Again',
        onClick: reset,
        icon: RefreshCw,
      }}
      secondaryAction={{
        label: 'Monitoring Dashboard',
        href: '/admin/monitoring',
        icon: AlertTriangle,
      }}
      tertiaryAction={{
        label: 'Back to Admin',
        href: '/admin',
      }}
      footerMessage="This error has been logged for investigation. Check the system status or contact the development team if this problem persists."
    />
  );
}
