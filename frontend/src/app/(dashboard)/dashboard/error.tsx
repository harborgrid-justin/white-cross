'use client';

/**
 * Dashboard Route Error Boundary
 * Handles errors in dashboard with contextual recovery
 */

import { GenericDomainError } from '@/components/errors/GenericDomainError';
import { LayoutDashboard } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <GenericDomainError
      error={error}
      reset={reset}
      domain="Dashboard"
      domainIcon={<LayoutDashboard className="h-8 w-8 text-red-600 dark:text-red-400" />}
      customMessage="Unable to load dashboard data. Some widgets or metrics may not be visible."
      customRecoverySteps={[
        'Click "Try Again" to reload dashboard',
        'Check your network connection',
        'Try accessing specific modules directly',
        'Contact IT support if error persists',
      ]}
    />
  );
}
