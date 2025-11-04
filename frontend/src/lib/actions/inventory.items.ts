/**
 * @fileoverview Inventory Item CRUD Operations
 * @module lib/actions/inventory.items
 *
 * Server actions for inventory item create, read, update, and delete operations.
 * HIPAA-compliant with audit logging for controlled substances.
 *
 * @example
 * ```typescript
 * 'use client';
 *
 * import { useActionState } from 'react';
 * import { createInventoryItemAction } from '@/lib/actions/inventory.items';
 *
 * function InventoryForm() {
 *   const [state, formAction, isPending] = useActionState(createInventoryItemAction, { errors: {} });
 *   return <form action={formAction}>...</form>;
 * }
 * ```
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import type { InventoryItemFilter } from '@/schemas/inventory.schemas';
import { auditLog } from '@/lib/audit';
import type { ActionResult } from './inventory.types';
import { getAuthToken, createAuditContext, enhancedFetch, BACKEND_URL } from './inventory.utils';

// ==========================================
// INVENTORY ITEM OPERATIONS
// ==========================================

/**
 * Create new inventory item
 */
export async function createInventoryItemAction(
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
      name: formData.get('name'),
      description: formData.get('description') || undefined,
      sku: formData.get('sku') || undefined,
      category: formData.get('category'),
      subcategory: formData.get('subcategory') || undefined,
      unitOfMeasure: formData.get('unitOfMeasure'),
      unitCost: formData.get('unitCost') ? Number(formData.get('unitCost')) : undefined,
      manufacturer: formData.get('manufacturer') || undefined,
      supplier: formData.get('supplier') || undefined,
      minStockLevel: formData.get('minStockLevel') ? Number(formData.get('minStockLevel')) : undefined,
      maxStockLevel: formData.get('maxStockLevel') ? Number(formData.get('maxStockLevel')) : undefined,
      reorderPoint: formData.get('reorderPoint') ? Number(formData.get('reorderPoint')) : undefined,
      reorderQuantity: formData.get('reorderQuantity') ? Number(formData.get('reorderQuantity')) : undefined,
      isControlledSubstance: formData.get('isControlledSubstance') === 'true',
      controlledSubstanceSchedule: formData.get('controlledSubstanceSchedule') || undefined,
      requiresExpiration: formData.get('requiresExpiration') === 'true',
      requiresBatchNumber: formData.get('requiresBatchNumber') === 'true',
      active: formData.get('active') !== 'false', // Default to true
      notes: formData.get('notes') || undefined
    };

    const response = await enhancedFetch(`${BACKEND_URL}/inventory/items`, {
      method: 'POST',
      body: JSON.stringify(rawData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create inventory item');
    }

    const result = await response.json();

    // Audit logging for controlled substances
    if (rawData.isControlledSubstance) {
      await auditLog({
        ...auditContext,
        action: 'CREATE_CONTROLLED_SUBSTANCE',
        resource: 'Inventory',
        resourceId: result.data.id,
        details: `Created controlled substance: ${rawData.name} (Schedule ${rawData.controlledSubstanceSchedule})`,
        success: true
      });
    }

    // Enhanced cache invalidation
    revalidateTag('inventory', 'default');
    revalidateTag('inventory-items', 'default');
    revalidatePath('/inventory/items');

    return {
      success: true,
      data: result.data,
      message: 'Inventory item created successfully'
    };
  } catch (error) {
    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to create inventory item']
      }
    };
  }
}

/**
 * Get inventory items with enhanced caching
 */
export async function getInventoryItemsAction(filter?: InventoryItemFilter) {
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

    const response = await enhancedFetch(`${BACKEND_URL}/inventory/items?${params.toString()}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch inventory items');
    }

    const result = await response.json();

    return {
      success: true,
      data: result.data || result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch inventory items'
    };
  }
}

/**
 * Get inventory item by ID with stock levels
 */
export async function getInventoryItemAction(itemId: string, includeStock = true) {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const url = `${BACKEND_URL}/inventory/items/${itemId}${
      includeStock ? '?includeStock=true' : ''
    }`;

    const response = await enhancedFetch(url, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch inventory item');
    }

    const result = await response.json();

    return {
      success: true,
      data: result.data || result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch inventory item'
    };
  }
}

/**
 * Update inventory item
 */
export async function updateInventoryItemAction(
  itemId: string,
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
      name: formData.get('name') || undefined,
      description: formData.get('description') || undefined,
      category: formData.get('category') || undefined,
      subcategory: formData.get('subcategory') || undefined,
      unitOfMeasure: formData.get('unitOfMeasure') || undefined,
      unitCost: formData.get('unitCost') ? Number(formData.get('unitCost')) : undefined,
      manufacturer: formData.get('manufacturer') || undefined,
      supplier: formData.get('supplier') || undefined,
      minStockLevel: formData.get('minStockLevel') ? Number(formData.get('minStockLevel')) : undefined,
      maxStockLevel: formData.get('maxStockLevel') ? Number(formData.get('maxStockLevel')) : undefined,
      reorderPoint: formData.get('reorderPoint') ? Number(formData.get('reorderPoint')) : undefined,
      reorderQuantity: formData.get('reorderQuantity') ? Number(formData.get('reorderQuantity')) : undefined,
      isControlledSubstance: formData.get('isControlledSubstance') ? formData.get('isControlledSubstance') === 'true' : undefined,
      controlledSubstanceSchedule: formData.get('controlledSubstanceSchedule') || undefined,
      requiresExpiration: formData.get('requiresExpiration') ? formData.get('requiresExpiration') === 'true' : undefined,
      requiresBatchNumber: formData.get('requiresBatchNumber') ? formData.get('requiresBatchNumber') === 'true' : undefined,
      active: formData.get('active') ? formData.get('active') === 'true' : undefined,
      notes: formData.get('notes') || undefined
    };

    const response = await enhancedFetch(`${BACKEND_URL}/inventory/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(rawData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update inventory item');
    }

    const result = await response.json();

    // Audit logging for controlled substances
    if (rawData.isControlledSubstance) {
      await auditLog({
        ...auditContext,
        action: 'UPDATE_CONTROLLED_SUBSTANCE',
        resource: 'Inventory',
        resourceId: itemId,
        details: `Updated controlled substance inventory item ${itemId}`,
        changes: rawData,
        success: true
      });
    }

    // Enhanced cache invalidation
    revalidateTag('inventory', 'default');
    revalidateTag('inventory-items', 'default');
    revalidateTag(`inventory-item-${itemId}`, 'default');
    revalidatePath('/inventory/items');
    revalidatePath(`/inventory/items/${itemId}`);

    return {
      success: true,
      data: result.data,
      message: 'Inventory item updated successfully'
    };
  } catch (error) {
    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to update inventory item']
      }
    };
  }
}

/**
 * Delete inventory item (soft delete)
 */
export async function deleteInventoryItemAction(itemId: string): Promise<ActionResult> {
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
    const response = await enhancedFetch(`${BACKEND_URL}/inventory/items/${itemId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete inventory item');
    }

    // Audit logging
    await auditLog({
      ...auditContext,
      action: 'DELETE_INVENTORY_ITEM',
      resource: 'Inventory',
      resourceId: itemId,
      details: `Deleted inventory item ${itemId}`,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('inventory', 'default');
    revalidateTag('inventory-items', 'default');
    revalidateTag(`inventory-item-${itemId}`, 'default');
    revalidatePath('/inventory/items');

    return {
      success: true,
      message: 'Inventory item deleted successfully'
    };
  } catch (error) {
    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to delete inventory item']
      }
    };
  }
}
