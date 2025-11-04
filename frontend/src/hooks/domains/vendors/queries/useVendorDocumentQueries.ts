/**
 * Vendor Document Query Hooks
 *
 * Provides TanStack Query hooks for fetching vendor document data with filters.
 *
 * @module hooks/domains/vendors/queries/useVendorDocumentQueries
 */

import { useQuery } from '@tanstack/react-query';
import { vendorKeys } from '../config';
import type { VendorDocument } from '../config';

/**
 * Fetches vendor documents with optional filters.
 *
 * @param {string} vendorId - Vendor ID to fetch documents for
 * @param {object} filters - Optional filters for document type and status
 * @returns TanStack Query result with document list and query states
 */
export const useVendorDocuments = (vendorId: string, filters?: {
  type?: 'W9' | 'INSURANCE_CERT' | 'LICENSE' | 'CERTIFICATION' | 'CONTRACT' | 'OTHER';
  status?: 'CURRENT' | 'EXPIRED' | 'EXPIRING_SOON' | 'MISSING';
}) => {
  return useQuery({
    queryKey: vendorKeys.documents(vendorId),
    queryFn: async (): Promise<VendorDocument[]> => {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.status) params.append('status', filters.status);

      const response = await fetch(`/api/vendors/${vendorId}/documents?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch documents');
      return response.json();
    },
    enabled: !!vendorId,
  });
};
