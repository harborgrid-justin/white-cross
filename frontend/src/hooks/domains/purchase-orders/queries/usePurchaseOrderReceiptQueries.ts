/**
 * Purchase Order Receipt Query Hooks
 *
 * Provides React Query hooks for purchase order receipt operations:
 * - Receipt listing by purchase order
 * - Receipt details and history
 * - Receiving status tracking
 *
 * @module hooks/domains/purchase-orders/queries/receipts
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { serverGet } from '@/lib/api/server';
import { PURCHASE_ORDERS_ENDPOINTS } from '@/constants/api/admin';
import { useApiError } from '../../../shared/useApiError';
import {
  purchaseOrderKeys,
  PURCHASE_ORDERS_CACHE_CONFIG,
  POReceipt,
} from '../config';

// Receipt Queries
export const useReceipts = (
  poId: string,
  options?: UseQueryOptions<POReceipt[], Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: purchaseOrderKeys.receipts(poId),
    queryFn: async () => {
      try {
        const response = await serverGet(`${PURCHASE_ORDERS_ENDPOINTS.BY_ID(poId)}/receipts`);
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.RECEIPTS_STALE_TIME,
    enabled: !!poId,
    ...options,
    meta: {
      errorMessage: 'Failed to load receipts'
    },
  });
};

export const useReceiptDetails = (
  id: string,
  options?: UseQueryOptions<POReceipt, Error>
) => {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: purchaseOrderKeys.receiptDetails(id),
    queryFn: async () => {
      try {
        const response = await serverGet(`${PURCHASE_ORDERS_ENDPOINTS.BASE}/receipts/${id}`);
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.RECEIPTS_STALE_TIME,
    enabled: !!id,
    ...options,
    meta: {
      errorMessage: 'Failed to load receipt details'
    },
  });
};
