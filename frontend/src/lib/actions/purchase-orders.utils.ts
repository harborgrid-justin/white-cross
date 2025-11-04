/**
 * @fileoverview Purchase Order Utility Functions
 * @module lib/actions/purchase-orders.utils
 *
 * Utility and helper functions for purchase order operations including
 * existence checks, counting, and cache management.
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';
import type { PurchaseOrderFilters } from './purchase-orders.types';
import { PURCHASE_ORDER_CACHE_TAGS } from './purchase-orders.types';
import { getPurchaseOrder, getPurchaseOrders } from './purchase-orders.cache';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if purchase order exists
 */
export async function purchaseOrderExists(purchaseOrderId: string): Promise<boolean> {
  const purchaseOrder = await getPurchaseOrder(purchaseOrderId);
  return purchaseOrder !== null;
}

/**
 * Get purchase order count
 */
export const getPurchaseOrderCount = cache(async (filters?: PurchaseOrderFilters): Promise<number> => {
  try {
    const orders = await getPurchaseOrders(filters);
    return orders.length;
  } catch {
    return 0;
  }
});

/**
 * Get purchase order overview
 */
export async function getPurchaseOrderOverview(): Promise<{
  totalOrders: number;
  pendingApproval: number;
  approvedOrders: number;
  totalValue: number;
  recentOrders: number;
}> {
  try {
    const orders = await getPurchaseOrders();

    return {
      totalOrders: orders.length,
      pendingApproval: orders.filter(o => o.status === 'pending').length,
      approvedOrders: orders.filter(o => o.status === 'approved').length,
      totalValue: orders.reduce((sum, o) => sum + o.total, 0),
      recentOrders: orders.filter(o => {
        const createdAt = new Date(o.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdAt >= weekAgo;
      }).length,
    };
  } catch {
    return {
      totalOrders: 0,
      pendingApproval: 0,
      approvedOrders: 0,
      totalValue: 0,
      recentOrders: 0,
    };
  }
}

/**
 * Clear purchase order cache
 */
export async function clearPurchaseOrderCache(purchaseOrderId?: string): Promise<void> {
  if (purchaseOrderId) {
    revalidateTag(`purchase-order-${purchaseOrderId}`, 'default');
    revalidateTag(`purchase-order-items-${purchaseOrderId}`, 'default');
  }

  // Clear all purchase order caches
  Object.values(PURCHASE_ORDER_CACHE_TAGS).forEach(tag => {
    revalidateTag(tag, 'default');
  });

  // Clear list caches
  revalidateTag('purchase-order-list', 'default');
  revalidateTag('purchase-order-stats', 'default');
  revalidateTag('purchase-order-dashboard', 'default');

  // Clear paths
  revalidatePath('/purchase-orders', 'page');
  revalidatePath('/purchase-orders/analytics', 'page');
}
