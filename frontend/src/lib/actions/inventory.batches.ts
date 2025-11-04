/**
 * @fileoverview Batch Operations
 * @module lib/actions/inventory.batches
 *
 * Server actions for inventory batch management, expiration tracking, and queries.
 */

'use server';
'use cache';

import { revalidatePath, revalidateTag } from 'next/cache';
import { cacheLife, cacheTag } from 'next/cache';
import { auditLog } from '@/lib/audit';
import type { ActionResult } from './inventory.types';
import { getAuthToken, createAuditContext, enhancedFetch, BACKEND_URL } from './inventory.utils';

// ==========================================
// BATCH OPERATIONS
// ==========================================

/**
 * Get expiring batches with enhanced caching
 */
export async function getExpiringBatchesAction(daysAhead: number = 90, locationId?: string) {
  cacheLife('max');
  cacheTag('inventory', 'expiring-batches');

  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const params = new URLSearchParams({ daysAhead: String(daysAhead) });
    if (locationId) {
      params.append('locationId', locationId);
    }

    const response = await enhancedFetch(`${BACKEND_URL}/inventory/batches/expiring?${params.toString()}`, {
      method: 'GET',
      next: {
        revalidate: 3600, // 1 hour cache for expiration alerts
        tags: ['expiring-batches', 'inventory']
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch expiring batches');
    }

    const result = await response.json();

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
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const token = await getAuthToken();
  const auditContext = await createAuditContext();

  if (!token) {
    return {
      errors: {
        _form: ['Authentication required']
      }
    };
  }

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

    const response = await enhancedFetch(`${BACKEND_URL}/inventory/batches`, {
      method: 'POST',
      body: JSON.stringify(rawData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create batch');
    }

    const result = await response.json();

    // Audit logging
    await auditLog({
      ...auditContext,
      action: 'CREATE_BATCH',
      resource: 'Inventory',
      resourceId: result.data.id,
      details: `Created batch ${rawData.batchNumber} for item ${rawData.itemId}`,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('inventory', {});
    revalidateTag('inventory-batches', {});
    revalidateTag(`item-batches-${rawData.itemId}`, {});
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
