'use client';

import { ErrorPage } from '@/components/common/ErrorPage';
import { RefreshCw, FileText } from 'lucide-react';

interface AuditLogsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AuditLogsError({ error, reset }: AuditLogsErrorProps) {
  return (
    <ErrorPage
      error={error}
      reset={reset}
      title="Audit Logs Error"
      message="An error occurred while loading audit logs."
      context="Audit Logs"
      useContainer={false}
      primaryAction={{
        label: 'Try Again',
        onClick: reset,
        icon: RefreshCw,
      }}
      secondaryAction={{
        label: 'Admin Settings',
        href: '/admin/settings',
        icon: FileText,
      }}
      tertiaryAction={{
        label: 'Back to Admin',
        href: '/admin',
      }}
      footerMessage="This error has been logged for investigation. Check the system status or contact the development team if this problem persists."
    />
  );
}
