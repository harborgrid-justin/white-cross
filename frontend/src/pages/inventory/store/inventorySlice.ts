/**
 * Inventory Slice
 * 
 * Redux slice for managing inventory items using the slice factory.
 * Handles CRUD operations for medical supplies and equipment inventory.
 */

import { createEntitySlice, EntityApiService } from '../../../stores/sliceFactory';
import { inventoryApi } from '../../../services';

// Inventory item interface (simplified for now)
interface InventoryItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  maxQuantity?: number;
  cost: number;
  supplier?: string;
  location?: string;
  expirationDate?: string;
  batchNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Inventory creation data
interface CreateInventoryData {
  name: string;
  category: string;
  description?: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  maxQuantity?: number;
  cost: number;
  supplier?: string;
  location?: string;
  expirationDate?: string;
  batchNumber?: string;
}

// Inventory update data
interface UpdateInventoryData {
  name?: string;
  category?: string;
  description?: string;
  quantity?: number;
  unit?: string;
  minQuantity?: number;
  maxQuantity?: number;
  cost?: number;
  supplier?: string;
  location?: string;
  expirationDate?: string;
  batchNumber?: string;
  isActive?: boolean;
}

// Inventory filters
interface InventoryFilters {
  category?: string;
  supplier?: string;
  location?: string;
  lowStock?: boolean;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// Create API service adapter for inventory
const inventoryApiService: EntityApiService<InventoryItem, CreateInventoryData, UpdateInventoryData> = {
  async getAll(params?: InventoryFilters) {
    const response = await inventoryApi.getAll(params);
    return {
      data: response.data?.items || [],
      total: response.data?.pagination?.total,
      pagination: response.data?.pagination,
    };
  },

  async getById(id: string) {
    const response = await inventoryApi.getById(id);
    return { data: response.data };
  },

  async create(data: CreateInventoryData) {
    const response = await inventoryApi.create(data);
    return { data: response.data };
  },

  async update(id: string, data: UpdateInventoryData) {
    const response = await inventoryApi.update(id, data);
    return { data: response.data };
  },

  async delete(id: string) {
    await inventoryApi.delete(id);
    return { success: true };
  },
};

// Create the inventory slice using the entity factory
const inventorySliceFactory = createEntitySlice<InventoryItem, CreateInventoryData, UpdateInventoryData>(
  'inventory',
  inventoryApiService,
  {
    enableBulkOperations: true,
  }
);

// Export the slice and its components
export const inventorySlice = inventorySliceFactory.slice;
export const inventoryReducer = inventorySlice.reducer;
export const inventoryActions = inventorySliceFactory.actions;
export const inventorySelectors = inventorySliceFactory.adapter.getSelectors((state: any) => state.inventory);
export const inventoryThunks = inventorySliceFactory.thunks;

// Export custom selectors
export const selectActiveInventory = (state: any): InventoryItem[] => {
  const allItems = inventorySelectors.selectAll(state) as InventoryItem[];
  return allItems.filter(item => item.isActive);
};

export const selectInventoryByCategory = (state: any, category: string): InventoryItem[] => {
  const allItems = inventorySelectors.selectAll(state) as InventoryItem[];
  return allItems.filter(item => item.category === category);
};

export const selectLowStockItems = (state: any): InventoryItem[] => {
  const allItems = inventorySelectors.selectAll(state) as InventoryItem[];
  return allItems.filter(item => item.quantity <= item.minQuantity);
};

export const selectInventoryBySupplier = (state: any, supplier: string): InventoryItem[] => {
  const allItems = inventorySelectors.selectAll(state) as InventoryItem[];
  return allItems.filter(item => item.supplier === supplier);
};

export const selectInventoryByLocation = (state: any, location: string): InventoryItem[] => {
  const allItems = inventorySelectors.selectAll(state) as InventoryItem[];
  return allItems.filter(item => item.location === location);
};

export const selectExpiringItems = (state: any, days: number = 30): InventoryItem[] => {
  const allItems = inventorySelectors.selectAll(state) as InventoryItem[];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + days);
  
  return allItems.filter(item => {
    if (!item.expirationDate) return false;
    const expirationDate = new Date(item.expirationDate);
    return expirationDate <= cutoffDate;
  }).sort((a, b) => new Date(a.expirationDate!).getTime() - new Date(b.expirationDate!).getTime());
};

export const selectInventoryValue = (state: any): number => {
  const allItems = inventorySelectors.selectAll(state) as InventoryItem[];
  return allItems.reduce((total, item) => total + (item.quantity * item.cost), 0);
};
