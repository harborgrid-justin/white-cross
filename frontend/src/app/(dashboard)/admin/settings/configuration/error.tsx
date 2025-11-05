'use client';

import { ErrorPage } from '@/components/common/ErrorPage';
import { RefreshCw, Settings } from 'lucide-react';

interface ConfigurationErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ConfigurationError({ error, reset }: ConfigurationErrorProps) {
  return (
    <ErrorPage
      error={error}
      reset={reset}
      title="Configuration Error"
      message="An error occurred while loading configuration settings."
      context="Configuration"
      useContainer={false}
      primaryAction={{
        label: 'Try Again',
        onClick: reset,
        icon: RefreshCw,
      }}
      secondaryAction={{
        label: 'Admin Settings',
        href: '/admin/settings',
        icon: Settings,
      }}
      tertiaryAction={{
        label: 'Back to Admin',
        href: '/admin',
      }}
      footerMessage="This error has been logged for investigation."
    />
  );
}
