/**
 * @fileoverview Inventory Location Operations
 * @module lib/actions/inventory.locations
 *
 * Server actions for inventory location management and queries.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { auditLog } from '@/lib/audit';
import type { ActionResult } from './inventory.types';
import { API_ENDPOINTS } from '@/constants/api';
import { serverGet, serverPost } from '@/lib/api/nextjs-client';

// ==========================================
// LOCATION OPERATIONS
// ==========================================

/**
 * Get all inventory locations
 */
export async function getInventoryLocationsAction(includeInactive = false) {
  try {
    const url = `${API_ENDPOINTS.INVENTORY.BASE}/locations?includeInactive=${includeInactive}`;

    const result = await serverGet(url, {
      tags: ['inventory', 'inventory-locations']
    });

    return {
      success: true,
      data: result.data || result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch locations'
    };
  }
}

/**
 * Create new inventory location
 */
export async function createInventoryLocationAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const rawData = {
      name: formData.get('name'),
      description: formData.get('description') || undefined,
      type: formData.get('type'),
      building: formData.get('building') || undefined,
      room: formData.get('room') || undefined,
      address: formData.get('address') || undefined,
      isSecure: formData.get('isSecure') === 'true',
      requiresKeycard: formData.get('requiresKeycard') === 'true',
      temperatureControlled: formData.get('temperatureControlled') === 'true',
      minTemperature: formData.get('minTemperature') ? Number(formData.get('minTemperature')) : undefined,
      maxTemperature: formData.get('maxTemperature') ? Number(formData.get('maxTemperature')) : undefined,
      active: formData.get('active') !== 'false', // Default to true
      notes: formData.get('notes') || undefined
    };

    const result = await serverPost(`${API_ENDPOINTS.INVENTORY.BASE}/locations`, rawData, {
      tags: ['inventory', 'inventory-locations']
    });

    // Audit logging
    await auditLog({
      action: 'CREATE_INVENTORY_LOCATION',
      resource: 'Inventory',
      resourceId: result.data.id,
      details: `Created inventory location: ${rawData.name}`,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('inventory', 'default');
    revalidateTag('inventory-locations', 'default');
    revalidatePath('/inventory/locations');

    return {
      success: true,
      data: result.data,
      message: 'Location created successfully'
    };
  } catch (error) {
    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to create location']
      }
    };
  }
}
