'use client';

import { ErrorPage } from '@/components/common/ErrorPage';
import { RefreshCw, MapPin } from 'lucide-react';

interface DistrictsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DistrictsError({ error, reset }: DistrictsErrorProps) {
  return (
    <ErrorPage
      error={error}
      reset={reset}
      title="Districts Error"
      message="An error occurred while loading district data."
      context="Districts"
      useContainer={false}
      primaryAction={{
        label: 'Try Again',
        onClick: reset,
        icon: RefreshCw,
      }}
      secondaryAction={{
        label: 'Admin Settings',
        href: '/admin/settings',
        icon: MapPin,
      }}
      tertiaryAction={{
        label: 'Back to Admin',
        href: '/admin',
      }}
      footerMessage="This error has been logged for investigation."
    />
  );
}
