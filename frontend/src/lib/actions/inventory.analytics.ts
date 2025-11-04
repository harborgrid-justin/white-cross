/**
 * @fileoverview Analytics and Dashboard Operations
 * @module lib/actions/inventory.analytics
 *
 * Server actions for inventory analytics, statistics, and dashboard data.
 */

'use server';
'use cache';

import { cacheLife, cacheTag } from 'next/cache';
import type { InventoryItem, StockLevel } from '@/schemas/inventory.schemas';
import type { InventoryStats } from './inventory.types';
import { getAuthToken, enhancedFetch, BACKEND_URL } from './inventory.utils';
import { getInventoryItemsAction } from './inventory.items';
import { getStockLevelsAction } from './inventory.stock';
import { getExpiringBatchesAction } from './inventory.batches';

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
    const lowStockItems = stockLevels.filter((stock: StockLevel) => {
      // Find corresponding item to get reorder point
      const item = items.find((i: InventoryItem) => i.id === stock.itemId);
      const reorderPoint = item?.reorderPoint || 0;
      return stock.quantity <= reorderPoint && stock.quantity > 0;
    }).length;
    const outOfStockItems = stockLevels.filter((stock: StockLevel) => stock.quantity === 0).length;
    const expiringItems = expiringBatches.length;

    // Calculate total value
    const totalValue = items.reduce((sum: number, item: InventoryItem) => {
      const itemStock = stockLevels.find((s: StockLevel) => s.itemId === item.id);
      const quantity = itemStock?.quantity || 0;
      return sum + (item.unitCost || 0) * quantity;
    }, 0);
    const avgStockLevel = stockLevels.length > 0
      ? stockLevels.reduce((sum: number, stock: StockLevel) => sum + stock.quantity, 0) / stockLevels.length
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
        medical: items.filter((i: InventoryItem) => i.category === 'medical_supplies').length,
        supplies: items.filter((i: InventoryItem) => ['office_supplies', 'cleaning_supplies'].includes(i.category)).length,
        equipment: items.filter((i: InventoryItem) => i.category === 'equipment').length,
        pharmaceuticals: items.filter((i: InventoryItem) => i.category === 'medications').length,
        maintenance: items.filter((i: InventoryItem) => i.category === 'disposables').length,
        other: items.filter((i: InventoryItem) => i.category === 'other').length
      },
      stockStatus: {
        adequate: stockLevels.filter((stock: StockLevel) => {
          const item = items.find((i: InventoryItem) => i.id === stock.itemId);
          const reorderPoint = item?.reorderPoint || 0;
          return stock.quantity > reorderPoint;
        }).length,
        low: lowStockItems,
        critical: stockLevels.filter((stock: StockLevel) => {
          const item = items.find((i: InventoryItem) => i.id === stock.itemId);
          const reorderPoint = item?.reorderPoint || 0;
          return stock.quantity <= (reorderPoint * 0.5) && stock.quantity > 0;
        }).length,
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
