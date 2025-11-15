/**
 * @fileoverview Purchase Order Status Management
 * @module lib/actions/purchase-orders.status
 *
 * Status management operations for purchase orders including cancellation
 * with HIPAA-compliant audit logging.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { serverPost, NextApiClientError, type ApiResponse } from '@/lib/api/server';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import {
  PURCHASE_ORDER_CACHE_TAGS,
  type PurchaseOrder,
  type ActionResult
} from './purchase-orders.types';

// ==========================================
// STATUS MANAGEMENT OPERATIONS
// ==========================================

/**
 * Cancel purchase order
 * Includes audit logging and cache invalidation
 */
export async function cancelPurchaseOrderAction(
  purchaseOrderId: string,
  reason: string
): Promise<ActionResult<PurchaseOrder>> {
  try {
    if (!purchaseOrderId) {
      return {
        success: false,
        error: 'Purchase order ID is required'
      };
    }

    if (!reason) {
      return {
        success: false,
        error: 'Cancellation reason is required'
      };
    }

    const response = await serverPost<ApiResponse<PurchaseOrder>>(
      `/api/purchase-orders/${purchaseOrderId}/cancel`,
      { reason },
      {
        cache: 'no-store',
        next: { tags: [PURCHASE_ORDER_CACHE_TAGS.ORDERS, `purchase-order-${purchaseOrderId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to cancel purchase order');
    }

    // AUDIT LOG - Purchase order cancellation
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'PurchaseOrder',
      resourceId: purchaseOrderId,
      details: `Cancelled purchase order ${response.data.orderNumber}: ${reason}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(PURCHASE_ORDER_CACHE_TAGS.ORDERS, 'default');
    revalidateTag(`purchase-order-${purchaseOrderId}`, 'default');
    revalidateTag('purchase-order-list', 'default');
    revalidatePath('/purchase-orders', 'page');
    revalidatePath(`/purchase-orders/${purchaseOrderId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Purchase order cancelled successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to cancel purchase order';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'PurchaseOrder',
      resourceId: purchaseOrderId,
      details: `Failed to cancel purchase order: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}
