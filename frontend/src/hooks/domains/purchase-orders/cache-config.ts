/**
 * Purchase Orders Cache Configuration
 *
 * Provides cache configuration constants and invalidation utilities.
 *
 * @module hooks/domains/purchase-orders/cache-config
 */

import { QueryClient } from '@tanstack/react-query';
import { purchaseOrderKeys } from './query-keys';

/**
 * Cache configuration for purchase order queries.
 *
 * Stale times determine how long data remains fresh before refetching:
 * - Approvals: 2min (time-sensitive, needs frequent updates)
 * - PO details: 10min (moderate update frequency)
 * - Receipts: 15min (infrequent changes after creation)
 * - Default: 5min (general queries)
 *
 * @constant PURCHASE_ORDERS_CACHE_CONFIG
 */
export const PURCHASE_ORDERS_CACHE_CONFIG = {
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  PO_STALE_TIME: 10 * 60 * 1000, // 10 minutes
  APPROVALS_STALE_TIME: 2 * 60 * 1000, // 2 minutes - critical for workflow
  RECEIPTS_STALE_TIME: 15 * 60 * 1000, // 15 minutes
} as const;

/**
 * Invalidates all purchase order related queries in React Query cache.
 *
 * If poId is provided, invalidates specific PO queries. Otherwise invalidates
 * all PO queries globally.
 *
 * @param {QueryClient} queryClient - React Query client instance
 * @param {string} [poId] - Optional specific PO ID to invalidate
 *
 * @example
 * ```ts
 * // Invalidate specific PO after update
 * invalidatePOQueries(queryClient, 'po-123');
 *
 * // Invalidate all PO queries after bulk operation
 * invalidatePOQueries(queryClient);
 * ```
 */
export const invalidatePOQueries = (queryClient: QueryClient, poId?: string) => {
  if (poId) {
    queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.purchaseOrderDetails(poId) });
    queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lineItems(poId) });
    queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.receipts(poId) });
  }
  queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all });
};
