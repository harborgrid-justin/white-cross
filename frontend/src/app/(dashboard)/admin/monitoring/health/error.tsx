'use client';

import { ErrorPage } from '@/components/common/ErrorPage';
import { RefreshCw, Heart } from 'lucide-react';

interface HealthMonitoringErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function HealthMonitoringError({ error, reset }: HealthMonitoringErrorProps) {
  return (
    <ErrorPage
      error={error}
      reset={reset}
      title="Health Monitoring Error"
      message="An error occurred while loading health monitoring data."
      context="Health Monitoring"
      useContainer={false}
      primaryAction={{
        label: 'Try Again',
        onClick: reset,
        icon: RefreshCw,
      }}
      secondaryAction={{
        label: 'Monitoring Dashboard',
        href: '/admin/monitoring',
        icon: Heart,
      }}
      tertiaryAction={{
        label: 'Back to Admin',
        href: '/admin',
      }}
      footerMessage="This error has been logged for investigation. Check the system status or contact the development team if this problem persists."
    />
  );
}
