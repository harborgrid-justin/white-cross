'use client';

import { ErrorPage } from '@/components/common/ErrorPage';
import { Calendar, RefreshCw } from 'lucide-react';

interface AppointmentsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppointmentsError({ error, reset }: AppointmentsErrorProps) {
  return (
    <ErrorPage
      error={error}
      reset={reset}
      title="Appointments Error"
      message="An error occurred while loading appointment data."
      context="Appointments"
      primaryAction={{
        label: 'Try Again',
        onClick: reset,
        icon: RefreshCw,
      }}
      secondaryAction={{
        label: 'Go to Appointments',
        href: '/appointments',
        icon: Calendar,
      }}
      tertiaryAction={{
        label: 'Back to Dashboard',
        href: '/dashboard',
      }}
    />
  );
}


