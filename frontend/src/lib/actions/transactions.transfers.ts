/**
 * @fileoverview Transfer Order Operations Server Actions
 * @module app/transactions/transfers
 *
 * Handles transfer order creation and approval with HIPAA-compliant audit logging.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { serverPost } from '@/lib/api/server';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLogWithContext, AUDIT_ACTIONS } from '@/lib/audit';
import type {
  ActionResult,
  TransferOrder,
  CreateTransferOrder,
  ApproveTransferOrder,
} from './transactions.types';

// ==========================================
// TRANSFER ORDER OPERATIONS
// ==========================================

/**
 * Create new transfer order with audit logging
 */
export async function createTransferOrder(
  data: CreateTransferOrder
): Promise<ActionResult<TransferOrder>> {
  try {
    const transferOrder = await serverPost<TransferOrder>(
      `${API_ENDPOINTS.INVENTORY.BASE}/transfer-orders`,
      data,
      {
        cache: 'no-store',
        next: { tags: ['transfer-orders'] }
      }
    );

    await auditLogWithContext({
      userId: data.requestedBy,
      action: AUDIT_ACTIONS.CREATE_APPOINTMENT,
      resource: 'transfer_order',
      resourceId: transferOrder.id,
      details: JSON.stringify({
        fromLocationId: data.fromLocationId,
        toLocationId: data.toLocationId,
        itemCount: data.items.length
      }),
    });

    revalidateTag('transfer-orders', 'default');
    revalidatePath('/inventory/transfers');

    return {
      success: true,
      data: transferOrder,
      message: 'Transfer order created successfully',
    };
  } catch (error) {
    console.error('Failed to create transfer order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create transfer order',
    };
  }
}

/**
 * Approve transfer order
 */
export async function approveTransferOrder(
  data: ApproveTransferOrder
): Promise<ActionResult<TransferOrder>> {
  try {
    const transferOrder = await serverPost<TransferOrder>(
      `${API_ENDPOINTS.INVENTORY.BASE}/transfer-orders/${data.transferOrderId}/approve`,
      data,
      {
        cache: 'no-store',
        next: {
          tags: [
            'transfer-orders',
            `transfer-order-${data.transferOrderId}`
          ]
        }
      }
    );

    await auditLogWithContext({
      userId: data.approvedBy,
      action: AUDIT_ACTIONS.UPDATE_APPOINTMENT,
      resource: 'transfer_order',
      resourceId: data.transferOrderId,
      details: JSON.stringify({ itemAdjustments: data.itemAdjustments }),
    });

    revalidateTag('transfer-orders', 'default');
    revalidateTag(`transfer-order-${data.transferOrderId}`, 'default');
    revalidatePath('/inventory/transfers');

    return {
      success: true,
      data: transferOrder,
      message: 'Transfer order approved successfully',
    };
  } catch (error) {
    console.error('Failed to approve transfer order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to approve transfer order',
    };
  }
}
