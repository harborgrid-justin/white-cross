/**
 * @fileoverview Purchase Order Cache Functions
 * @module lib/actions/purchase-orders.cache
 *
 * Cached data retrieval functions for purchase orders with Next.js cache integration.
 * Uses React cache() for automatic memoization and Next.js revalidation strategies.
 */

'use server';

import { cache } from 'react';
import { serverGet, type ApiResponse } from '@/lib/api/nextjs-client';
import { CACHE_TTL } from '@/lib/cache/constants';
import {
  PURCHASE_ORDER_CACHE_TAGS,
  type PurchaseOrder,
  type PurchaseOrderItem,
  type PurchaseOrderFilters,
  type PurchaseOrderAnalytics,
} from './purchase-orders.types';

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get purchase order by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getPurchaseOrder = cache(async (id: string): Promise<PurchaseOrder | null> => {
  try {
    const response = await serverGet<ApiResponse<PurchaseOrder>>(
      `/api/purchase-orders/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [`purchase-order-${id}`, PURCHASE_ORDER_CACHE_TAGS.ORDERS]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get purchase order:', error);
    return null;
  }
});

/**
 * Get all purchase orders with caching
 */
export const getPurchaseOrders = cache(async (filters?: PurchaseOrderFilters): Promise<PurchaseOrder[]> => {
  try {
    const response = await serverGet<ApiResponse<PurchaseOrder[]>>(
      `/api/purchase-orders`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [PURCHASE_ORDER_CACHE_TAGS.ORDERS, 'purchase-order-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get purchase orders:', error);
    return [];
  }
});

/**
 * Get purchase order analytics with caching
 */
export const getPurchaseOrderAnalytics = cache(async (filters?: Record<string, unknown>): Promise<PurchaseOrderAnalytics | null> => {
  try {
    const response = await serverGet<ApiResponse<PurchaseOrderAnalytics>>(
      `/api/purchase-orders/analytics`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATS,
          tags: ['purchase-order-analytics', 'purchase-order-stats']
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get purchase order analytics:', error);
    return null;
  }
});

/**
 * Get purchase order items with caching
 */
export const getPurchaseOrderItems = cache(async (purchaseOrderId: string): Promise<PurchaseOrderItem[]> => {
  try {
    const response = await serverGet<ApiResponse<PurchaseOrderItem[]>>(
      `/api/purchase-orders/${purchaseOrderId}/items`,
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [`purchase-order-items-${purchaseOrderId}`, PURCHASE_ORDER_CACHE_TAGS.ITEMS]
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get purchase order items:', error);
    return [];
  }
});
