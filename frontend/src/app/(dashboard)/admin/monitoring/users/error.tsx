'use client';

import { ErrorPage } from '@/components/common/ErrorPage';
import { RefreshCw, Users } from 'lucide-react';

interface UserMonitoringErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function UserMonitoringError({ error, reset }: UserMonitoringErrorProps) {
  return (
    <ErrorPage
      error={error}
      reset={reset}
      title="User Monitoring Error"
      message="An error occurred while loading user monitoring data."
      context="User Monitoring"
      useContainer={false}
      primaryAction={{
        label: 'Try Again',
        onClick: reset,
        icon: RefreshCw,
      }}
      secondaryAction={{
        label: 'Monitoring Dashboard',
        href: '/admin/monitoring',
        icon: Users,
      }}
      tertiaryAction={{
        label: 'Back to Admin',
        href: '/admin',
      }}
      footerMessage="This error has been logged for investigation. Check the system status or contact the development team if this problem persists."
    />
  );
}
