'use client';

/**
 * Analytics Route Error Boundary
 * Handles errors in analytics routes with contextual recovery
 */

import { GenericDomainError } from '@/components/errors/GenericDomainError';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsError({
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
      domain="Analytics"
      domainIcon={<BarChart3 className="h-8 w-8 text-red-600 dark:text-red-400" />}
      customMessage="Unable to load analytics data. Reports and charts may not be available."
      customRecoverySteps={[
        'Click "Try Again" to reload analytics',
        'Check if data is still being processed',
        'Verify your permissions for analytics access',
        'Contact IT support if error persists',
      ]}
    />
  );
}
