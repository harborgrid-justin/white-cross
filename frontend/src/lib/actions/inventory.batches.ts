/**
 * @fileoverview Batch Operations
 * @module lib/actions/inventory.batches
 *
 * Server actions for inventory batch management, expiration tracking, and queries.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { auditLog } from '@/lib/audit';
import type { ActionResult } from './inventory.types';
import { API_ENDPOINTS } from '@/constants/api';
import { serverGet, serverPost } from '@/lib/api/nextjs-client';

// ==========================================
// BATCH OPERATIONS
// ==========================================

/**
 * Get expiring batches with enhanced caching
 */
export async function getExpiringBatchesAction(daysAhead: number = 90, locationId?: string) {
  try {
    const params = new URLSearchParams({ daysAhead: String(daysAhead) });
    if (locationId) {
      params.append('locationId', locationId);
    }

    const url = `${API_ENDPOINTS.INVENTORY.BASE}/batches/expiring?${params.toString()}`;

    const result = await serverGet(url, {
      tags: ['expiring-batches', 'inventory']
    });

    return {
      success: true,
      data: result.data || result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch expiring batches'
    };
  }
}

/**
 * Create new batch
 */
export async function createBatchAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const rawData = {
      itemId: formData.get('itemId'),
      locationId: formData.get('locationId'),
      batchNumber: formData.get('batchNumber'),
      expirationDate: formData.get('expirationDate') || undefined,
      manufactureDate: formData.get('manufactureDate') || undefined,
      supplier: formData.get('supplier') || undefined,
      quantity: formData.get('quantity') ? Number(formData.get('quantity')) : 0,
      unitCost: formData.get('unitCost') ? Number(formData.get('unitCost')) : undefined,
      notes: formData.get('notes') || undefined
    };

    const result = await serverPost(`${API_ENDPOINTS.INVENTORY.BASE}/batches`, rawData, {
      tags: ['inventory', 'inventory-batches', `item-batches-${rawData.itemId}`]
    });

    // Audit logging
    await auditLog({
      action: 'CREATE_BATCH',
      resource: 'Inventory',
      resourceId: result.data.id,
      details: `Created batch ${rawData.batchNumber} for item ${rawData.itemId}`,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('inventory', 'default');
    revalidateTag('inventory-batches', 'default');
    revalidateTag(`item-batches-${rawData.itemId}`, 'default');
    revalidatePath('/inventory/stock');

    return {
      success: true,
      data: result.data,
      message: 'Batch created successfully'
    };
  } catch (error) {
    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to create batch']
      }
    };
  }
}
