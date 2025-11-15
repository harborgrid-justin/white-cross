/**
 * @fileoverview Stock Reservation Operations Server Actions
 * @module app/transactions/reservations
 *
 * Handles stock reservation and release operations with HIPAA-compliant audit logging.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { serverPost } from '@/lib/api/server';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLogWithContext, AUDIT_ACTIONS } from '@/lib/audit';
import type {
  ActionResult,
  Transaction,
  ReserveStock,
  ReleaseReservedStock,
} from './transactions.types';

// ==========================================
// STOCK RESERVATION OPERATIONS
// ==========================================

/**
 * Reserve stock for future use
 */
export async function reserveStock(data: ReserveStock): Promise<ActionResult<Transaction>> {
  try {
    const transaction = await serverPost<Transaction>(
      `${API_ENDPOINTS.INVENTORY.BASE}/transactions/reserve`,
      data,
      {
        cache: 'no-store',
        next: {
          tags: [
            'inventory-stock',
            `stock-item-${data.itemId}`,
            `stock-location-${data.locationId}`
          ]
        }
      }
    );

    await auditLogWithContext({
      userId: data.performedBy,
      action: AUDIT_ACTIONS.CREATE_APPOINTMENT,
      resource: 'inventory_transaction',
      resourceId: transaction.id,
      details: JSON.stringify({
        itemId: data.itemId,
        quantity: data.quantity,
        locationId: data.locationId,
        reservedFor: data.reservedFor
      }),
    });

    revalidateTag('inventory-stock', 'default');
    revalidateTag(`stock-item-${data.itemId}`, 'default');
    revalidateTag(`stock-location-${data.locationId}`, 'default');
    revalidatePath('/inventory/stock');

    return {
      success: true,
      data: transaction,
      message: 'Stock reserved successfully',
    };
  } catch (error) {
    console.error('Failed to reserve stock:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reserve stock',
    };
  }
}

/**
 * Release reserved stock
 */
export async function releaseReservedStock(
  data: ReleaseReservedStock
): Promise<ActionResult<Transaction>> {
  try {
    const transaction = await serverPost<Transaction>(
      `${API_ENDPOINTS.INVENTORY.BASE}/transactions/release`,
      data,
      {
        cache: 'no-store',
        next: {
          tags: [
            'inventory-stock',
            `stock-item-${data.itemId}`,
            `stock-location-${data.locationId}`
          ]
        }
      }
    );

    await auditLogWithContext({
      userId: data.performedBy,
      action: AUDIT_ACTIONS.DELETE_APPOINTMENT,
      resource: 'inventory_transaction',
      resourceId: transaction.id,
      details: JSON.stringify({
        itemId: data.itemId,
        quantity: data.quantity,
        locationId: data.locationId
      }),
    });

    revalidateTag('inventory-stock', 'default');
    revalidateTag(`stock-item-${data.itemId}`, 'default');
    revalidateTag(`stock-location-${data.locationId}`, 'default');
    revalidatePath('/inventory/stock');

    return {
      success: true,
      data: transaction,
      message: 'Reserved stock released successfully',
    };
  } catch (error) {
    console.error('Failed to release stock:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to release stock',
    };
  }
}
