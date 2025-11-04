/**
 * Vendor Contract Query Hooks
 *
 * Provides TanStack Query hooks for fetching vendor contract data including
 * individual contracts and contract lists with filters.
 *
 * @module hooks/domains/vendors/queries/useVendorContractQueries
 */

import { useQuery } from '@tanstack/react-query';
import { vendorKeys } from '../config';
import type { VendorContract } from '../config';

/**
 * Fetches a single vendor contract by ID.
 *
 * @param {string} contractId - Unique contract identifier
 * @returns TanStack Query result with contract data and query states
 */
export const useVendorContract = (contractId: string) => {
  return useQuery({
    queryKey: vendorKeys.contract(contractId),
    queryFn: async (): Promise<VendorContract> => {
      const response = await fetch(`/api/vendor-contracts/${contractId}`);
      if (!response.ok) throw new Error('Failed to fetch contract');
      return response.json();
    },
    enabled: !!contractId,
  });
};

/**
 * Fetches vendor contracts with optional filters.
 *
 * @param {string} vendorId - Optional vendor ID to filter contracts
 * @param {object} filters - Optional filters for status and type
 * @returns TanStack Query result with contract list and query states
 */
export const useVendorContracts = (vendorId?: string, filters?: {
  status?: 'DRAFT' | 'UNDER_REVIEW' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  type?: 'MASTER_AGREEMENT' | 'PURCHASE_ORDER' | 'SERVICE_CONTRACT' | 'CONSULTING';
}) => {
  return useQuery({
    queryKey: vendorKeys.contracts(vendorId),
    queryFn: async (): Promise<VendorContract[]> => {
      const params = new URLSearchParams();
      if (vendorId) params.append('vendorId', vendorId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.type) params.append('type', filters.type);

      const response = await fetch(`/api/vendor-contracts?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch contracts');
      return response.json();
    },
  });
};
