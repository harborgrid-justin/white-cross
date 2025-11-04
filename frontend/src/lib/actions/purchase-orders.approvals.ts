/**
 * @fileoverview Purchase Order Approval Workflow
 * @module lib/actions/purchase-orders.approvals
 *
 * Approval workflow functions for purchase orders including submit, approve, and reject
 * operations with HIPAA-compliant audit logging.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { serverPost, NextApiClientError } from '@/lib/api/nextjs-client';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import type { ApiResponse } from '@/types/api';
import type { PurchaseOrder, ActionResult } from './purchase-orders.types';
import { PURCHASE_ORDER_CACHE_TAGS } from './purchase-orders.types';

// ==========================================
// APPROVAL WORKFLOW OPERATIONS
// ==========================================

/**
 * Submit purchase order for approval
 * Includes audit logging and cache invalidation
 */
export async function submitPurchaseOrderAction(purchaseOrderId: string): Promise<ActionResult<PurchaseOrder>> {
  try {
    if (!purchaseOrderId) {
      return {
        success: false,
        error: 'Purchase order ID is required'
      };
    }

    const response = await serverPost<ApiResponse<PurchaseOrder>>(
      `/api/purchase-orders/${purchaseOrderId}/submit`,
      {},
      {
        cache: 'no-store',
        next: { tags: [PURCHASE_ORDER_CACHE_TAGS.ORDERS, `purchase-order-${purchaseOrderId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to submit purchase order');
    }

    // AUDIT LOG - Purchase order submission
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'PurchaseOrder',
      resourceId: purchaseOrderId,
      details: `Submitted purchase order ${response.data.orderNumber} for approval`,
      success: true
    });

    // Cache invalidation
    revalidateTag(PURCHASE_ORDER_CACHE_TAGS.ORDERS, 'default');
    revalidateTag(PURCHASE_ORDER_CACHE_TAGS.APPROVALS, 'default');
    revalidateTag(`purchase-order-${purchaseOrderId}`, 'default');
    revalidateTag('purchase-order-list', 'default');
    revalidatePath('/purchase-orders', 'page');
    revalidatePath(`/purchase-orders/${purchaseOrderId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Purchase order submitted for approval successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to submit purchase order';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'PurchaseOrder',
      resourceId: purchaseOrderId,
      details: `Failed to submit purchase order: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Approve purchase order
 * Includes audit logging and cache invalidation
 */
export async function approvePurchaseOrderAction(
  purchaseOrderId: string,
  comments?: string
): Promise<ActionResult<PurchaseOrder>> {
  try {
    if (!purchaseOrderId) {
      return {
        success: false,
        error: 'Purchase order ID is required'
      };
    }

    const response = await serverPost<ApiResponse<PurchaseOrder>>(
      `/api/purchase-orders/${purchaseOrderId}/approve`,
      { comments },
      {
        cache: 'no-store',
        next: { tags: [PURCHASE_ORDER_CACHE_TAGS.ORDERS, PURCHASE_ORDER_CACHE_TAGS.APPROVALS, `purchase-order-${purchaseOrderId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to approve purchase order');
    }

    // AUDIT LOG - Purchase order approval
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'PurchaseOrder',
      resourceId: purchaseOrderId,
      details: `Approved purchase order ${response.data.orderNumber}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(PURCHASE_ORDER_CACHE_TAGS.ORDERS, 'default');
    revalidateTag(PURCHASE_ORDER_CACHE_TAGS.APPROVALS, 'default');
    revalidateTag(`purchase-order-${purchaseOrderId}`, 'default');
    revalidateTag('purchase-order-list', 'default');
    revalidatePath('/purchase-orders', 'page');
    revalidatePath(`/purchase-orders/${purchaseOrderId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Purchase order approved successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to approve purchase order';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'PurchaseOrder',
      resourceId: purchaseOrderId,
      details: `Failed to approve purchase order: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Reject purchase order
 * Includes audit logging and cache invalidation
 */
export async function rejectPurchaseOrderAction(
  purchaseOrderId: string,
  comments: string
): Promise<ActionResult<PurchaseOrder>> {
  try {
    if (!purchaseOrderId) {
      return {
        success: false,
        error: 'Purchase order ID is required'
      };
    }

    if (!comments) {
      return {
        success: false,
        error: 'Rejection comments are required'
      };
    }

    const response = await serverPost<ApiResponse<PurchaseOrder>>(
      `/api/purchase-orders/${purchaseOrderId}/reject`,
      { comments },
      {
        cache: 'no-store',
        next: { tags: [PURCHASE_ORDER_CACHE_TAGS.ORDERS, PURCHASE_ORDER_CACHE_TAGS.APPROVALS, `purchase-order-${purchaseOrderId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to reject purchase order');
    }

    // AUDIT LOG - Purchase order rejection
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'PurchaseOrder',
      resourceId: purchaseOrderId,
      details: `Rejected purchase order ${response.data.orderNumber}: ${comments}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(PURCHASE_ORDER_CACHE_TAGS.ORDERS, 'default');
    revalidateTag(PURCHASE_ORDER_CACHE_TAGS.APPROVALS, 'default');
    revalidateTag(`purchase-order-${purchaseOrderId}`, 'default');
    revalidateTag('purchase-order-list', 'default');
    revalidatePath('/purchase-orders', 'page');
    revalidatePath(`/purchase-orders/${purchaseOrderId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Purchase order rejected successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to reject purchase order';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'PurchaseOrder',
      resourceId: purchaseOrderId,
      details: `Failed to reject purchase order: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}
