/**
 * @fileoverview Server Actions for Inventory Management
 * @module actions/inventory
 *
 * Next.js Server Actions for inventory item CRUD operations, stock management,
 * and multi-location tracking. HIPAA-compliant with audit logging for controlled substances.
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { apiClient } from '@/services/core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';
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

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
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

// ==========================================
// INVENTORY ITEM OPERATIONS
// ==========================================

/**
 * Create new inventory item
 */
export async function createInventoryItem(
  data: CreateInventoryItem
): Promise<ActionResult<InventoryItem>> {
  try {
    const response = await apiClient.post<InventoryItem>(
      API_ENDPOINTS.INVENTORY.ITEMS,
      data
    );

    revalidateTag('inventory-items');
    revalidatePath('/inventory/items');

    return {
      success: true,
      data: response.data,
      message: 'Inventory item created successfully',
    };
  } catch (error) {
    console.error('Failed to create inventory item:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create inventory item',
    };
  }
}

/**
 * Get inventory item by ID with stock levels
 */
export async function getInventoryItem(
  itemId: string,
  includeStock = true
): Promise<ActionResult<InventoryItemWithStock>> {
  try {
    const url = `${API_ENDPOINTS.INVENTORY.ITEMS}/${itemId}${
      includeStock ? '?includeStock=true' : ''
    }`;
    const response = await apiClient.get<InventoryItemWithStock>(url);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch inventory item:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch inventory item',
    };
  }
}

/**
 * Get all inventory items with filtering and pagination
 */
export async function getInventoryItems(
  filter?: InventoryItemFilter
): Promise<ActionResult<PaginatedResult<InventoryItemWithStock>>> {
  try {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get<PaginatedResult<InventoryItemWithStock>>(
      `${API_ENDPOINTS.INVENTORY.ITEMS}?${params.toString()}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch inventory items:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch inventory items',
    };
  }
}

/**
 * Update inventory item
 */
export async function updateInventoryItem(
  itemId: string,
  data: UpdateInventoryItem
): Promise<ActionResult<InventoryItem>> {
  try {
    const response = await apiClient.put<InventoryItem>(
      `${API_ENDPOINTS.INVENTORY.ITEMS}/${itemId}`,
      data
    );

    revalidateTag('inventory-items');
    revalidateTag(`inventory-item-${itemId}`);
    revalidatePath('/inventory/items');
    revalidatePath(`/inventory/items/${itemId}`);

    return {
      success: true,
      data: response.data,
      message: 'Inventory item updated successfully',
    };
  } catch (error) {
    console.error('Failed to update inventory item:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update inventory item',
    };
  }
}

/**
 * Delete inventory item (soft delete)
 */
export async function deleteInventoryItem(itemId: string): Promise<ActionResult<void>> {
  try {
    await apiClient.delete(`${API_ENDPOINTS.INVENTORY.ITEMS}/${itemId}`);

    revalidateTag('inventory-items');
    revalidateTag(`inventory-item-${itemId}`);
    revalidatePath('/inventory/items');

    return {
      success: true,
      message: 'Inventory item deleted successfully',
    };
  } catch (error) {
    console.error('Failed to delete inventory item:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete inventory item',
    };
  }
}

/**
 * Search inventory items by name or SKU
 */
export async function searchInventoryItems(
  query: string
): Promise<ActionResult<InventoryItemWithStock[]>> {
  try {
    const response = await apiClient.get<InventoryItemWithStock[]>(
      `${API_ENDPOINTS.INVENTORY.ITEMS}/search?q=${encodeURIComponent(query)}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to search inventory items:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to search inventory items',
    };
  }
}

// ==========================================
// LOCATION OPERATIONS
// ==========================================

/**
 * Create new inventory location
 */
export async function createInventoryLocation(
  data: CreateInventoryLocation
): Promise<ActionResult<InventoryLocation>> {
  try {
    const response = await apiClient.post<InventoryLocation>(
      API_ENDPOINTS.INVENTORY.LOCATIONS,
      data
    );

    revalidateTag('inventory-locations');
    revalidatePath('/inventory/locations');

    return {
      success: true,
      data: response.data,
      message: 'Location created successfully',
    };
  } catch (error) {
    console.error('Failed to create location:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create location',
    };
  }
}

/**
 * Get all inventory locations
 */
export async function getInventoryLocations(
  includeInactive = false
): Promise<ActionResult<InventoryLocation[]>> {
  try {
    const response = await apiClient.get<InventoryLocation[]>(
      `${API_ENDPOINTS.INVENTORY.LOCATIONS}?includeInactive=${includeInactive}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch locations:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch locations',
    };
  }
}

/**
 * Get inventory location by ID
 */
export async function getInventoryLocation(
  locationId: string
): Promise<ActionResult<InventoryLocation>> {
  try {
    const response = await apiClient.get<InventoryLocation>(
      `${API_ENDPOINTS.INVENTORY.LOCATIONS}/${locationId}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch location:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch location',
    };
  }
}

/**
 * Update inventory location
 */
export async function updateInventoryLocation(
  locationId: string,
  data: UpdateInventoryLocation
): Promise<ActionResult<InventoryLocation>> {
  try {
    const response = await apiClient.put<InventoryLocation>(
      `${API_ENDPOINTS.INVENTORY.LOCATIONS}/${locationId}`,
      data
    );

    revalidateTag('inventory-locations');
    revalidateTag(`inventory-location-${locationId}`);
    revalidatePath('/inventory/locations');

    return {
      success: true,
      data: response.data,
      message: 'Location updated successfully',
    };
  } catch (error) {
    console.error('Failed to update location:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update location',
    };
  }
}

// ==========================================
// STOCK LEVEL OPERATIONS
// ==========================================

/**
 * Get stock level for item at specific location
 */
export async function getStockLevel(
  itemId: string,
  locationId: string
): Promise<ActionResult<StockLevelWithDetails>> {
  try {
    const response = await apiClient.get<StockLevelWithDetails>(
      `${API_ENDPOINTS.INVENTORY.STOCK}/${itemId}/${locationId}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch stock level:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch stock level',
    };
  }
}

/**
 * Get all stock levels with filtering
 */
export async function getStockLevels(filter?: {
  itemId?: string;
  locationId?: string;
  belowReorderPoint?: boolean;
}): Promise<ActionResult<StockLevelWithDetails[]>> {
  try {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get<StockLevelWithDetails[]>(
      `${API_ENDPOINTS.INVENTORY.STOCK}?${params.toString()}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch stock levels:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch stock levels',
    };
  }
}

/**
 * Initialize stock level for item at location
 */
export async function createStockLevel(
  data: CreateStockLevel
): Promise<ActionResult<StockLevel>> {
  try {
    const response = await apiClient.post<StockLevel>(
      API_ENDPOINTS.INVENTORY.STOCK,
      data
    );

    revalidateTag('inventory-stock');
    revalidateTag(`stock-item-${data.itemId}`);
    revalidateTag(`stock-location-${data.locationId}`);
    revalidatePath('/inventory/stock');

    return {
      success: true,
      data: response.data,
      message: 'Stock level initialized successfully',
    };
  } catch (error) {
    console.error('Failed to create stock level:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create stock level',
    };
  }
}

// ==========================================
// BATCH OPERATIONS
// ==========================================

/**
 * Create new batch
 */
export async function createBatch(data: CreateBatch): Promise<ActionResult<Batch>> {
  try {
    const response = await apiClient.post<Batch>(
      API_ENDPOINTS.INVENTORY.BATCHES,
      data
    );

    revalidateTag('inventory-batches');
    revalidateTag(`item-batches-${data.itemId}`);
    revalidatePath('/inventory/stock');

    return {
      success: true,
      data: response.data,
      message: 'Batch created successfully',
    };
  } catch (error) {
    console.error('Failed to create batch:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create batch',
    };
  }
}

/**
 * Get batches with filtering
 */
export async function getBatches(filter?: BatchFilter): Promise<ActionResult<Batch[]>> {
  try {
    const params = new URLSearchParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined) {
          if (value instanceof Date) {
            params.append(key, value.toISOString());
          } else {
            params.append(key, String(value));
          }
        }
      });
    }

    const response = await apiClient.get<Batch[]>(
      `${API_ENDPOINTS.INVENTORY.BATCHES}?${params.toString()}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch batches:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch batches',
    };
  }
}

/**
 * Get expiring batches within specified days
 */
export async function getExpiringBatches(
  daysAhead: number = 90,
  locationId?: string
): Promise<ActionResult<Batch[]>> {
  try {
    const params = new URLSearchParams({ daysAhead: String(daysAhead) });
    if (locationId) {
      params.append('locationId', locationId);
    }

    const response = await apiClient.get<Batch[]>(
      `${API_ENDPOINTS.INVENTORY.BATCHES}/expiring?${params.toString()}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch expiring batches:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch expiring batches',
    };
  }
}

// ==========================================
// BULK OPERATIONS
// ==========================================

/**
 * Bulk import inventory items
 */
export async function bulkImportItems(items: CreateInventoryItem[]): Promise<
  ActionResult<{
    imported: number;
    failed: number;
    errors?: string[];
  }>
> {
  try {
    const response = await apiClient.post<{
      imported: number;
      failed: number;
      errors?: string[];
    }>(`${API_ENDPOINTS.INVENTORY.ITEMS}/bulk-import`, {
      items,
      skipDuplicates: true,
      updateExisting: false,
    });

    revalidateTag('inventory-items');
    revalidatePath('/inventory/items');

    return {
      success: true,
      data: response.data,
      message: `Successfully imported ${response.data.imported} items`,
    };
  } catch (error) {
    console.error('Failed to bulk import items:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to bulk import items',
    };
  }
}

// ==========================================
// CATEGORY OPERATIONS
// ==========================================

/**
 * Get all item categories with counts
 */
export async function getInventoryCategories(): Promise<
  ActionResult<
    Array<{
      category: string;
      subcategories: string[];
      itemCount: number;
    }>
  >
> {
  try {
    const response = await apiClient.get<
      Array<{
        category: string;
        subcategories: string[];
        itemCount: number;
      }>
    >(`${API_ENDPOINTS.INVENTORY.ITEMS}/categories`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch categories',
    };
  }
}
