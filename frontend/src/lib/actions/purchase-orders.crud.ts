/**
 * @fileoverview Purchase Order CRUD Operations
 * @module lib/actions/purchase-orders.crud
 *
 * Create, read, and update operations for purchase orders with HIPAA-compliant
 * audit logging and cache invalidation.
 */

'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { serverPost, serverPut, NextApiClientError, type ApiResponse } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import {
  PURCHASE_ORDER_CACHE_TAGS,
  type PurchaseOrder,
  type CreatePurchaseOrderData,
  type UpdatePurchaseOrderData,
  type ActionResult
} from './purchase-orders.types';

// ==========================================
// PURCHASE ORDER CRUD OPERATIONS
// ==========================================

/**
 * Create a new purchase order
 * Includes audit logging and cache invalidation
 */
export async function createPurchaseOrderAction(data: CreatePurchaseOrderData): Promise<ActionResult<PurchaseOrder>> {
  try {
    // Validate required fields
    if (!data.vendorId || !data.department || !data.budgetCode || !data.items || data.items.length === 0) {
      return {
        success: false,
        error: 'Missing required fields: vendorId, department, budgetCode, items'
      };
    }

    // Validate items
    for (const item of data.items) {
      if (!item.itemName || !item.quantity || !item.unitPrice) {
        return {
          success: false,
          error: 'Each item must have itemName, quantity, and unitPrice'
        };
      }
    }

    const response = await serverPost<ApiResponse<PurchaseOrder>>(
      API_ENDPOINTS.PURCHASE_ORDERS.BASE,
      data,
      {
        cache: 'no-store',
        next: { tags: [PURCHASE_ORDER_CACHE_TAGS.ORDERS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create purchase order');
    }

    // AUDIT LOG - Purchase order creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'PurchaseOrder',
      resourceId: response.data.id,
      details: `Created purchase order ${response.data.orderNumber} for vendor ${data.vendorId}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(PURCHASE_ORDER_CACHE_TAGS.ORDERS, 'default');
    revalidateTag('purchase-order-list', 'default');
    revalidatePath('/purchase-orders', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Purchase order created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create purchase order';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'PurchaseOrder',
      details: `Failed to create purchase order: ${errorMessage}`,
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
 * Update purchase order
 * Includes audit logging and cache invalidation
 */
export async function updatePurchaseOrderAction(
  purchaseOrderId: string,
  data: UpdatePurchaseOrderData
): Promise<ActionResult<PurchaseOrder>> {
  try {
    if (!purchaseOrderId) {
      return {
        success: false,
        error: 'Purchase order ID is required'
      };
    }

    const response = await serverPut<ApiResponse<PurchaseOrder>>(
      `/api/purchase-orders/${purchaseOrderId}`,
      data,
      {
        cache: 'no-store',
        next: { tags: [PURCHASE_ORDER_CACHE_TAGS.ORDERS, `purchase-order-${purchaseOrderId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update purchase order');
    }

    // AUDIT LOG - Purchase order update
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'PurchaseOrder',
      resourceId: purchaseOrderId,
      details: `Updated purchase order ${response.data.orderNumber}`,
      changes: data as Record<string, unknown>,
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
      message: 'Purchase order updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update purchase order';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'PurchaseOrder',
      resourceId: purchaseOrderId,
      details: `Failed to update purchase order: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}
