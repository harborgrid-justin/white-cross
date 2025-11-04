/**
 * @fileoverview Stock Operations Server Actions
 * @module app/transactions/stock
 *
 * Handles stock receipt, issue, and adjustment operations with HIPAA-compliant audit logging.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { apiClient } from '@/services/core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLogWithContext, AUDIT_ACTIONS } from '@/lib/audit';
import type {
  ActionResult,
  Transaction,
  ReceiveStock,
  IssueStock,
  AdjustStock,
} from './transactions.types';

// ==========================================
// STOCK RECEIPT OPERATIONS
// ==========================================

/**
 * Receive stock into inventory with HIPAA audit logging
 */
export async function receiveStock(data: ReceiveStock): Promise<ActionResult<Transaction>> {
  try {
    const response = await apiClient.post<Transaction>(
      `${API_ENDPOINTS.INVENTORY.BASE}/transactions/receive`,
      data
    );

    await auditLogWithContext({
      userId: data.performedBy,
      action: AUDIT_ACTIONS.CREATE_APPOINTMENT,
      resource: 'inventory_transaction',
      resourceId: response.data.id,
      details: JSON.stringify({ itemId: data.itemId, quantity: data.quantity, locationId: data.locationId }),
    });

    revalidateTag('inventory-transactions', 'default');
    revalidateTag('inventory-stock', 'default');
    revalidateTag(`stock-item-${data.itemId}`, 'default');
    revalidateTag(`stock-location-${data.locationId}`, 'default');
    revalidatePath('/inventory/stock');
    revalidatePath('/inventory/transactions');

    return {
      success: true,
      data: response.data,
      message: 'Stock received successfully',
    };
  } catch (error) {
    console.error('Failed to receive stock:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to receive stock',
    };
  }
}

/**
 * Bulk receive multiple items with HIPAA audit logging
 */
export async function bulkReceiveStock(
  items: ReceiveStock[]
): Promise<ActionResult<Transaction[]>> {

  try {
    const response = await apiClient.post<Transaction[]>(
      `${API_ENDPOINTS.INVENTORY.BASE}/transactions/receive/bulk`,
      { items }
    );

    await auditLogWithContext({
      userId: items[0]?.performedBy || 'system',
      action: AUDIT_ACTIONS.CREATE_APPOINTMENT,
      resource: 'inventory_transactions',
      details: JSON.stringify({ itemCount: items.length, totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0) }),
    });

    revalidateTag('inventory-transactions', 'default');
    revalidateTag('inventory-stock', 'default');
    revalidatePath('/inventory/stock');
    revalidatePath('/inventory/transactions');

    return {
      success: true,
      data: response.data,
      message: `Successfully received ${items.length} items`,
    };
  } catch (error) {
    console.error('Failed to bulk receive stock:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to bulk receive stock',
    };
  }
}

// ==========================================
// STOCK ISSUE OPERATIONS
// ==========================================

/**
 * Issue stock from inventory with HIPAA audit logging
 */
export async function issueStock(data: IssueStock): Promise<ActionResult<Transaction>> {
  try {
    const response = await apiClient.post<Transaction>(
      `${API_ENDPOINTS.INVENTORY.BASE}/transactions/issue`,
      data
    );

    await auditLogWithContext({
      userId: data.performedBy,
      action: AUDIT_ACTIONS.UPDATE_APPOINTMENT,
      resource: 'inventory_transaction',
      resourceId: response.data.id,
      details: JSON.stringify({
        itemId: data.itemId,
        quantity: data.quantity,
        locationId: data.locationId,
        issuedTo: data.issuedTo,
        referenceType: data.referenceType
      }),
    });

    revalidateTag('inventory-transactions', 'default');
    revalidateTag('inventory-stock', 'default');
    revalidateTag(`stock-item-${data.itemId}`, 'default');
    revalidateTag(`stock-location-${data.locationId}`, 'default');
    revalidatePath('/inventory/stock');
    revalidatePath('/inventory/transactions');

    // If controlled substance, revalidate audit trail
    revalidateTag('controlled-substance-audit', 'default');

    return {
      success: true,
      data: response.data,
      message: 'Stock issued successfully',
    };
  } catch (error) {
    console.error('Failed to issue stock:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to issue stock',
    };
  }
}

// ==========================================
// STOCK ADJUSTMENT OPERATIONS
// ==========================================

/**
 * Adjust stock level with audit logging
 */
export async function adjustStock(data: AdjustStock): Promise<ActionResult<Transaction>> {
  try {
    const response = await apiClient.post<Transaction>(
      `${API_ENDPOINTS.INVENTORY.BASE}/transactions/adjust`,
      data
    );

    await auditLogWithContext({
      userId: data.performedBy,
      action: AUDIT_ACTIONS.UPDATE_APPOINTMENT,
      resource: 'inventory_transaction',
      resourceId: response.data.id,
      details: JSON.stringify({
        itemId: data.itemId,
        newQuantity: data.newQuantity,
        locationId: data.locationId,
        reason: data.reason
      }),
    });

    revalidateTag('inventory-transactions', 'default');
    revalidateTag('inventory-stock', 'default');
    revalidateTag(`stock-item-${data.itemId}`, 'default');
    revalidateTag(`stock-location-${data.locationId}`, 'default');
    revalidatePath('/inventory/stock');
    revalidatePath('/inventory/transactions');

    return {
      success: true,
      data: response.data,
      message: 'Stock adjusted successfully',
    };
  } catch (error) {
    console.error('Failed to adjust stock:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to adjust stock',
    };
  }
}
