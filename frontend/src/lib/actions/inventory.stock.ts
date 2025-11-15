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
import { API_ENDPOINTS } from '@/constants/api';
import { serverGet, serverPost } from '@/lib/api/server';

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
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    const url = params.toString() ? `${API_ENDPOINTS.INVENTORY.BASE}/stock?${params.toString()}` : `${API_ENDPOINTS.INVENTORY.BASE}/stock`;

    const result = await serverGet(url, {
      tags: ['inventory', 'stock-levels']
    });

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

    const result = await serverPost(`${API_ENDPOINTS.INVENTORY.BASE}/stock`, rawData, {
      tags: ['inventory', 'stock-levels', `stock-item-${rawData.itemId}`, `stock-location-${rawData.locationId}`]
    });

    // Audit logging
    await auditLog({
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
