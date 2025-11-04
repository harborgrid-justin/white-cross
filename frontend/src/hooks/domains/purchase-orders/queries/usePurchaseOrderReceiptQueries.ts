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
import {
  purchaseOrderKeys,
  PURCHASE_ORDERS_CACHE_CONFIG,
  POReceipt,
} from '../config';

// Mock API functions (replace with actual API calls)
const mockPurchaseOrderAPI = {
  getReceipts: async (poId: string): Promise<POReceipt[]> => {
    return [];
  },
  getReceiptById: async (id: string): Promise<POReceipt> => {
    return {} as POReceipt;
  },
};

// Receipt Queries
export const useReceipts = (
  poId: string,
  options?: UseQueryOptions<POReceipt[], Error>
) => {
  return useQuery({
    queryKey: purchaseOrderKeys.receipts(poId),
    queryFn: () => mockPurchaseOrderAPI.getReceipts(poId),
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.RECEIPTS_STALE_TIME,
    enabled: !!poId,
    ...options,
  });
};

export const useReceiptDetails = (
  id: string,
  options?: UseQueryOptions<POReceipt, Error>
) => {
  return useQuery({
    queryKey: purchaseOrderKeys.receiptDetails(id),
    queryFn: () => mockPurchaseOrderAPI.getReceiptById(id),
    staleTime: PURCHASE_ORDERS_CACHE_CONFIG.RECEIPTS_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};
