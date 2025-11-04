/**
 * Vendor Payment Query Hooks
 *
 * Provides TanStack Query hooks for fetching vendor payment data with filters.
 *
 * @module hooks/domains/vendors/queries/useVendorPaymentQueries
 */

import { useQuery } from '@tanstack/react-query';
import { vendorKeys } from '../config';
import type { VendorPayment } from '../config';

/**
 * Fetches vendor payments with optional filters.
 *
 * @param {string} vendorId - Optional vendor ID to filter payments
 * @param {object} filters - Optional filters for status and date range
 * @returns TanStack Query result with payment list and query states
 */
export const useVendorPayments = (vendorId?: string, filters?: {
  status?: 'PENDING' | 'APPROVED' | 'PAID' | 'OVERDUE' | 'DISPUTED' | 'CANCELLED';
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: vendorKeys.payments(vendorId),
    queryFn: async (): Promise<VendorPayment[]> => {
      const params = new URLSearchParams();
      if (vendorId) params.append('vendorId', vendorId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`/api/vendor-payments?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch payments');
      return response.json();
    },
  });
};
