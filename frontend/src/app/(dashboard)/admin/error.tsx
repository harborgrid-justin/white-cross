'use client';

/**
 * Admin Route Error Boundary
 * Catches and handles errors in admin pages
 *
 * @module app/admin/error
 */

import { ErrorPage } from '@/components/common/ErrorPage';
import { RefreshCw, Shield } from 'lucide-react';

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
  return (
    <ErrorPage
      error={error}
      reset={reset}
      title="Administrative Error"
      message="An error occurred while performing an administrative operation."
      context="Admin"
      useContainer={false}
      primaryAction={{
        label: 'Try Again',
        onClick: reset,
        icon: RefreshCw,
      }}
      secondaryAction={{
        label: 'Admin Settings',
        href: '/admin/settings',
        icon: Shield,
      }}
      tertiaryAction={{
        label: 'Back to Dashboard',
        href: '/dashboard',
      }}
      footerMessage="This error has been logged for investigation. Contact the development team if this problem persists."
    />
  );
}



