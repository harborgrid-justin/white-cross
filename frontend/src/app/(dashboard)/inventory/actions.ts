/**
 * @fileoverview Server Actions for Inventory Management
 * @module app/inventory/actions
 *
 * Next.js v16 App Router Server Actions for inventory item CRUD operations, stock management,
 * and multi-location tracking. HIPAA-compliant with audit logging for controlled substances.
 * Enhanced with Next.js v16 caching capabilities and revalidation patterns.
 *
 * @example
 * ```typescript
 * 'use client';
 *
 * import { useActionState } from 'react';
 * import { createInventoryItemAction } from '@/lib/actions/inventory.actions';
 *
 * function InventoryForm() {
 *   const [state, formAction, isPending] = useActionState(createInventoryItemAction, { errors: {} });
 *   return <form action={formAction}>...</form>;
 * }
 * ```
 */

'use server';
'use cache';

import { cookies } from 'next/headers';
import { headers } from 'next/headers';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z, type ZodIssue } from 'zod';
import { cacheLife, cacheTag } from 'next/cache';

// Import inventory schemas
import type {
  InventoryItem,
  CreateInventoryItem,
  UpdateInventoryItem,
  InventoryItemFilter,
  InventoryItemWithStock,
  InventoryLocation,
  CreateInventoryLocation,
  UpdateInventoryLocation,
  StockLevel,
  CreateStockLevel,
  UpdateStockLevel,
  StockLevelWithDetails,
  Batch,
  CreateBatch,
  BatchFilter,
} from '@/schemas/inventory.schemas';

// Import audit logging utilities
import {
  auditLog,
  AUDIT_ACTIONS,
  extractIPAddress,
  extractUserAgent
} from '@/lib/audit';

// Use server-side or fallback to public env variable or default
const BACKEND_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ActionResult<T = unknown> {
  success?: boolean;
  data?: T;
  errors?: Record<string, string[]> & {
    _form?: string[];
  };
  message?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get auth token from cookies
 */
async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value || null;
}

/**
 * Get current user ID from cookies
 */
async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('user_id')?.value || null;
}

/**
 * Create audit context from headers
 */
async function createAuditContext() {
  const headersList = await headers();
  const request = {
    headers: headersList
  } as Request;

  const userId = await getCurrentUserId();
  return {
    userId,
    ipAddress: extractIPAddress(request),
    userAgent: extractUserAgent(request)
  };
}

/**
 * Enhanced fetch with Next.js v16 capabilities
 */
async function enhancedFetch(url: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
    next: {
      revalidate: 300, // 5 minute cache
      tags: ['inventory', 'stock']
    }
  });
}

// ==========================================
// INVENTORY ITEM OPERATIONS
// ==========================================

/**
 * Create new inventory item
 */
export async function createInventoryItemAction(
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
    revalidateTag('inventory');
    revalidateTag('inventory-items');
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
  cacheLife('max');
  cacheTag('inventory', 'inventory-items');

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
  cacheLife('max');
  cacheTag('inventory', `inventory-item-${itemId}`);

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
    revalidateTag('inventory');
    revalidateTag('inventory-items');
    revalidateTag(`inventory-item-${itemId}`);
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
    revalidateTag('inventory');
    revalidateTag('inventory-items');
    revalidateTag(`inventory-item-${itemId}`);
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
  cacheLife('max');
  cacheTag('inventory', 'stock-levels');

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
    revalidateTag('inventory');
    revalidateTag('stock-levels');
    revalidateTag(`stock-item-${rawData.itemId}`);
    revalidateTag(`stock-location-${rawData.locationId}`);
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

// ==========================================
// LOCATION OPERATIONS
// ==========================================

/**
 * Get all inventory locations
 */
export async function getInventoryLocationsAction(includeInactive = false) {
  cacheLife('max');
  cacheTag('inventory', 'inventory-locations');

  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await enhancedFetch(`${BACKEND_URL}/inventory/locations?includeInactive=${includeInactive}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }

    const result = await response.json();

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

    const response = await enhancedFetch(`${BACKEND_URL}/inventory/locations`, {
      method: 'POST',
      body: JSON.stringify(rawData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create location');
    }

    const result = await response.json();

    // Audit logging
    await auditLog({
      ...auditContext,
      action: 'CREATE_INVENTORY_LOCATION',
      resource: 'Inventory',
      resourceId: result.data.id,
      details: `Created inventory location: ${rawData.name}`,
      success: true
    });

    // Enhanced cache invalidation
    revalidateTag('inventory');
    revalidateTag('inventory-locations');
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
    revalidateTag('inventory');
    revalidateTag('inventory-batches');
    revalidateTag(`item-batches-${rawData.itemId}`);
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

// ==========================================
// ANALYTICS OPERATIONS
// ==========================================

/**
 * Get inventory categories with counts
 */
export async function getInventoryCategoriesAction() {
  cacheLife('max');
  cacheTag('inventory', 'inventory-categories');

  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await enhancedFetch(`${BACKEND_URL}/inventory/items/categories`, {
      method: 'GET',
      next: {
        revalidate: 3600, // 1 hour cache for categories
        tags: ['inventory-categories', 'inventory']
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const result = await response.json();

    return {
      success: true,
      data: result.data || result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch categories'
    };
  }
}

/**
 * Inventory Statistics Interface
 * Dashboard metrics for inventory management overview
 */
export interface InventoryStats {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  expiringItems: number;
  totalValue: number;
  avgStockLevel: number;
  recentTransactions: number;
  categories: {
    medical: number;
    supplies: number;
    equipment: number;
    pharmaceuticals: number;
    maintenance: number;
    other: number;
  };
  stockStatus: {
    adequate: number;
    low: number;
    critical: number;
    outOfStock: number;
  };
}

/**
 * Get Inventory Statistics
 * Dashboard overview of inventory management metrics
 * 
 * @returns Promise<InventoryStats>
 */
export async function getInventoryStats(): Promise<InventoryStats> {
  try {
    console.log('[Inventory] Loading inventory statistics');

    // Get inventory items and stock levels
    const itemsResult = await getInventoryItemsAction();
    const stockResult = await getStockLevelsAction();
    const expiringResult = await getExpiringBatchesAction(30); // Items expiring in 30 days

    if (!itemsResult.success || !stockResult.success || !expiringResult.success) {
      throw new Error('Failed to load inventory data');
    }

    const items = itemsResult.data || [];
    const stockLevels = stockResult.data || [];
    const expiringBatches = expiringResult.data || [];

    // Calculate statistics
    const totalItems = items.length;
    const lowStockItems = stockLevels.filter((stock: StockLevel) =>
      stock.currentLevel <= stock.minimumLevel && stock.currentLevel > 0
    ).length;
    const outOfStockItems = stockLevels.filter((stock: StockLevel) => stock.currentLevel === 0).length;
    const expiringItems = expiringBatches.length;

    // Calculate total value (mock calculation)
    const totalValue = items.reduce((sum: number, item: InventoryItem) => sum + (item.unitCost || 0) * (item.currentStock || 0), 0);
    const avgStockLevel = stockLevels.length > 0
      ? stockLevels.reduce((sum: number, stock: StockLevel) => sum + stock.currentLevel, 0) / stockLevels.length
      : 0;

    const stats: InventoryStats = {
      totalItems,
      lowStockItems,
      outOfStockItems,
      expiringItems,
      totalValue,
      avgStockLevel,
      recentTransactions: 45, // Mock value - would come from transaction log
      categories: {
        medical: items.filter((i: InventoryItem) => i.category === 'MEDICAL').length,
        supplies: items.filter((i: InventoryItem) => i.category === 'SUPPLIES').length,
        equipment: items.filter((i: InventoryItem) => i.category === 'EQUIPMENT').length,
        pharmaceuticals: items.filter((i: InventoryItem) => i.category === 'PHARMACEUTICALS').length,
        maintenance: items.filter((i: InventoryItem) => i.category === 'MAINTENANCE').length,
        other: items.filter((i: InventoryItem) => !['MEDICAL', 'SUPPLIES', 'EQUIPMENT', 'PHARMACEUTICALS', 'MAINTENANCE'].includes(i.category)).length
      },
      stockStatus: {
        adequate: stockLevels.filter((stock: StockLevel) => stock.currentLevel > stock.minimumLevel).length,
        low: lowStockItems,
        critical: stockLevels.filter((stock: StockLevel) => stock.currentLevel <= (stock.minimumLevel * 0.5) && stock.currentLevel > 0).length,
        outOfStock: outOfStockItems
      }
    };

    console.log('[Inventory] Inventory statistics loaded successfully');
    return stats;

  } catch (error) {
    console.error('[Inventory] Failed to load inventory statistics:', error);
    
    // Return safe defaults on error
    return {
      totalItems: 0,
      lowStockItems: 0,
      outOfStockItems: 0,
      expiringItems: 0,
      totalValue: 0,
      avgStockLevel: 0,
      recentTransactions: 0,
      categories: {
        medical: 0,
        supplies: 0,
        equipment: 0,
        pharmaceuticals: 0,
        maintenance: 0,
        other: 0
      },
      stockStatus: {
        adequate: 0,
        low: 0,
        critical: 0,
        outOfStock: 0
      }
    };
  }
}

/**
 * Get Inventory Dashboard Data
 * Combined dashboard data for inventory overview
 * 
 * @returns Promise<{stats: InventoryStats}>
 */
export async function getInventoryDashboardData() {
  try {
    console.log('[Inventory] Loading dashboard data');

    const stats = await getInventoryStats();

    console.log('[Inventory] Dashboard data loaded successfully');
    return { stats };

  } catch (error) {
    console.error('[Inventory] Failed to load dashboard data:', error);
    
    return {
      stats: await getInventoryStats() // Will return safe defaults
    };
  }
}
