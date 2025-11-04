/**
 * @fileoverview Stock Level Operations
 * @module lib/actions/inventory.stock
 *
 * Server actions for inventory stock level management and queries.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { auditLog } from '@/lib/audit';
import type { ActionResult } from './inventory.types';
import { getAuthToken, createAuditContext, enhancedFetch, BACKEND_URL } from './inventory.utils';

// ==========================================
// STOCK LEVEL OPERATIONS
// ==========================================

/**
 * Get stock levels with enhanced caching
 */
export async function getStockLevelsAction(filter?: {
  itemId?: string;
  locationId?: string;
  belowReorderPoint?: boolean;
}) {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    const response = await enhancedFetch(`${BACKEND_URL}/inventory/stock?${params.toString()}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stock levels');
    }

    const result = await response.json();

    return {
      success: true,
      data: result.data || result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch stock levels'
    };
  }
}

/**
 * Create stock level for item at location
 */
export async function createStockLevelAction(
  _prevState: ActionResult,
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
      currentStock: formData.get('currentStock') ? Number(formData.get('currentStock')) : 0,
      reservedStock: formData.get('reservedStock') ? Number(formData.get('reservedStock')) : 0,
      reorderPoint: formData.get('reorderPoint') ? Number(formData.get('reorderPoint')) : undefined,
      maxStockLevel: formData.get('maxStockLevel') ? Number(formData.get('maxStockLevel')) : undefined,
      lastCountDate: formData.get('lastCountDate') || undefined
    };

    const response = await enhancedFetch(`${BACKEND_URL}/inventory/stock`, {
      method: 'POST',
      body: JSON.stringify(rawData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create stock level');
    }

    const result = await response.json();

    // Audit logging
    await auditLog({
      ...auditContext,
      action: 'CREATE_STOCK_LEVEL',
      resource: 'Inventory',
      details: `Initialized stock level for item ${rawData.itemId} at location ${rawData.locationId}`,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('inventory', 'default');
    revalidateTag('stock-levels', 'default');
    revalidateTag(`stock-item-${rawData.itemId}`, 'default');
    revalidateTag(`stock-location-${rawData.locationId}`, 'default');
    revalidatePath('/inventory/stock');

    return {
      success: true,
      data: result.data,
      message: 'Stock level initialized successfully'
    };
  } catch (error) {
    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to create stock level']
      }
    };
  }
}
