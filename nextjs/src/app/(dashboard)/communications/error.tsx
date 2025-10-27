'use client';

/**
 * Communications Route Error Boundary
 * Handles errors in communications routes with contextual recovery
 */

import { GenericDomainError } from '@/components/errors/GenericDomainError';
import { MessageSquare } from 'lucide-react';

export default function CommunicationsError({
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
      domain="Communications"
      domainIcon={<MessageSquare className="h-8 w-8 text-red-600 dark:text-red-400" />}
      customMessage="Unable to load communications. Messages may not be visible."
    />
  );
}
