'use client';

/**
 * Inventory Route Error Boundary
 * Handles errors in inventory routes with contextual recovery
 */

import { GenericDomainError } from '@/components/errors/GenericDomainError';
import { Package } from 'lucide-react';

export default function InventoryError({
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
      domain="Inventory"
      domainIcon={<Package className="h-8 w-8 text-red-600 dark:text-red-400" />}
      customMessage="Unable to load inventory data. Stock levels and medication inventory may not be visible."
    />
  );
}
