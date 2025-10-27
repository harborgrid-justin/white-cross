'use client';

/**
 * Documents Route Error Boundary
 * Handles errors in documents routes with contextual recovery
 */

import { GenericDomainError } from '@/components/errors/GenericDomainError';
import { FileText } from 'lucide-react';

export default function DocumentsError({
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
      domain="Documents"
      domainIcon={<FileText className="h-8 w-8 text-red-600 dark:text-red-400" />}
      customMessage="Unable to load documents. Files and document templates may not be accessible."
    />
  );
}
