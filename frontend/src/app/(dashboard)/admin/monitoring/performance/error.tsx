'use client';

import { ErrorPage } from '@/components/common/ErrorPage';
import { RefreshCw, Zap } from 'lucide-react';

interface PerformanceMonitoringErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PerformanceMonitoringError({ error, reset }: PerformanceMonitoringErrorProps) {
  return (
    <ErrorPage
      error={error}
      reset={reset}
      title="Performance Monitoring Error"
      message="An error occurred while loading performance monitoring data."
      context="Performance Monitoring"
      useContainer={false}
      primaryAction={{
        label: 'Try Again',
        onClick: reset,
        icon: RefreshCw,
      }}
      secondaryAction={{
        label: 'Monitoring Dashboard',
        href: '/admin/monitoring',
        icon: Zap,
      }}
      tertiaryAction={{
        label: 'Back to Admin',
        href: '/admin',
      }}
      footerMessage="This error has been logged for investigation. Check the system status or contact the development team if this problem persists."
    />
  );
}
