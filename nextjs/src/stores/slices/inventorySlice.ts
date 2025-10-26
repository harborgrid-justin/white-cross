/**
 * WF-COMP-280 | inventorySlice.ts - Inventory Redux slice
 * Purpose: Inventory page Redux slice with comprehensive inventory API integration
 * Related: inventoryApi from services/index.ts
 * Last Updated: 2025-10-21 | File Type: .ts
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { inventoryApi } from '../../../services';

// Inventory item interface
export interface InventoryItem {
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
  needsMaintenance?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Inventory transaction interface
export interface InventoryTransaction {
  id: string;
  inventoryItemId: string;
  type: 'PURCHASE' | 'USAGE' | 'ADJUSTMENT' | 'TRANSFER' | 'DISPOSAL';
  quantity: number;
  unitCost?: number;
  reason?: string;
  batchNumber?: string;
  expirationDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Maintenance log interface
export interface MaintenanceLog {
  id: string;
  inventoryItemId: string;
  type: 'ROUTINE' | 'REPAIR' | 'CALIBRATION' | 'INSPECTION' | 'CLEANING';
  description: string;
  cost?: number;
  nextMaintenanceDate?: string;
  vendor?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Analytics interfaces
export interface InventoryAlert {
  id: string;
  type: 'LOW_STOCK' | 'EXPIRED' | 'EXPIRING_SOON' | 'MAINTENANCE_DUE';
  itemId: string;
  itemName: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: string;
}

export interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
  expiredCount: number;
  maintenanceDueCount: number;
  categoryCounts: Record<string, number>;
  locationCounts: Record<string, number>;
  supplierCounts: Record<string, number>;
}

export interface UsageAnalytics {
  itemId: string;
  itemName: string;
  totalUsed: number;
  averageUsage: number;
  trend: 'INCREASING' | 'DECREASING' | 'STABLE';
  lastUsed?: string;
}

export interface SupplierPerformance {
  supplierId: string;
  supplierName: string;
  totalOrders: number;
  onTimeDeliveries: number;
  averageDeliveryTime: number;
  qualityRating: number;
  costEfficiency: number;
}

// Request interfaces
export interface CreateInventoryItemRequest {
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

export interface UpdateInventoryItemRequest {
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
  needsMaintenance?: boolean;
  isActive?: boolean;
}

export interface CreateTransactionRequest {
  inventoryItemId: string;
  type: 'PURCHASE' | 'USAGE' | 'ADJUSTMENT' | 'TRANSFER' | 'DISPOSAL';
  quantity: number;
  unitCost?: number;
  reason?: string;
  batchNumber?: string;
  expirationDate?: string;
  notes?: string;
}

export interface CreateMaintenanceRequest {
  inventoryItemId: string;
  type: 'ROUTINE' | 'REPAIR' | 'CALIBRATION' | 'INSPECTION' | 'CLEANING';
  description: string;
  cost?: number;
  nextMaintenanceDate?: string;
  vendor?: string;
  notes?: string;
}

export interface InventoryFilters {
  page?: number;
  limit?: number;
  category?: string;
  supplier?: string;
  location?: string;
  lowStock?: boolean;
  needsMaintenance?: boolean;
  isActive?: boolean;
  search?: string;
}

// Inventory API Service Adapter
export class InventoryApiService {
  // Core inventory management
  async getAllItems(params: InventoryFilters = {}) {
    return inventoryApi.getAll(params);
  }

  async getItemById(id: string) {
    return inventoryApi.getById(id);
  }

  async createItem(item: CreateInventoryItemRequest) {
    return inventoryApi.create(item);
  }

  async updateItem(id: string, item: UpdateInventoryItemRequest) {
    return inventoryApi.update(id, item);
  }

  async deleteItem(id: string) {
    return inventoryApi.delete(id);
  }

  // Stock management
  async getCurrentStock(id: string) {
    return inventoryApi.getCurrentStock(id);
  }

  async adjustStock(id: string, quantity: number, reason: string) {
    return inventoryApi.adjustStock(id, quantity, reason);
  }

  async getStockHistory(id: string, page = 1, limit = 20) {
    return inventoryApi.getStockHistory(id, page, limit);
  }

  // Transactions
  async createTransaction(transaction: CreateTransactionRequest) {
    return inventoryApi.createTransaction(transaction);
  }

  // Maintenance
  async createMaintenanceLog(maintenance: CreateMaintenanceRequest) {
    return inventoryApi.createMaintenanceLog(maintenance);
  }

  async getMaintenanceSchedule(startDate?: string, endDate?: string) {
    return inventoryApi.getMaintenanceSchedule(startDate, endDate);
  }

  // Analytics and reporting
  async getAlerts() {
    return inventoryApi.getAlerts();
  }

  async getStats() {
    return inventoryApi.getStats();
  }

  async getUsageAnalytics(startDate?: string, endDate?: string) {
    return inventoryApi.getUsageAnalytics(startDate, endDate);
  }

  async getSupplierPerformance() {
    return inventoryApi.getSupplierPerformance();
  }

  async getValuation() {
    return inventoryApi.getValuation();
  }

  // Purchase orders
  async generatePurchaseOrder(items: Array<{ inventoryItemId: string; quantity: number }>) {
    return inventoryApi.generatePurchaseOrder(items);
  }

  // Search
  async searchItems(query: string, limit = 10) {
    return inventoryApi.search(query, limit);
  }
}

// Create inventory API service instance
export const inventoryApiService = new InventoryApiService();

// State interface
export interface InventoryState {
  // Items
  items: InventoryItem[];
  itemsLoading: boolean;
  itemsError: string | null;
  
  // Selected Item
  selectedItem: InventoryItem | null;
  selectedItemLoading: boolean;
  selectedItemError: string | null;
  
  // Stock History
  stockHistory: InventoryTransaction[];
  stockHistoryLoading: boolean;
  stockHistoryError: string | null;
  stockHistoryPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Maintenance
  maintenanceSchedule: MaintenanceLog[];
  maintenanceScheduleLoading: boolean;
  maintenanceScheduleError: string | null;
  
  // Analytics
  alerts: InventoryAlert[];
  alertsLoading: boolean;
  alertsError: string | null;
  
  stats: InventoryStats | null;
  statsLoading: boolean;
  statsError: string | null;
  
  usageAnalytics: UsageAnalytics[];
  usageAnalyticsLoading: boolean;
  usageAnalyticsError: string | null;
  
  supplierPerformance: SupplierPerformance[];
  supplierPerformanceLoading: boolean;
  supplierPerformanceError: string | null;
  
  valuation: { totalValue: number; breakdown: Array<{ category: string; value: number }> } | null;
  valuationLoading: boolean;
  valuationError: string | null;
  
  // Search
  searchResults: InventoryItem[];
  searchLoading: boolean;
  searchError: string | null;
  
  // UI State
  filters: InventoryFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Initial state
const initialState: InventoryState = {
  items: [],
  itemsLoading: false,
  itemsError: null,
  
  selectedItem: null,
  selectedItemLoading: false,
  selectedItemError: null,
  
  stockHistory: [],
  stockHistoryLoading: false,
  stockHistoryError: null,
  stockHistoryPagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
  
  maintenanceSchedule: [],
  maintenanceScheduleLoading: false,
  maintenanceScheduleError: null,
  
  alerts: [],
  alertsLoading: false,
  alertsError: null,
  
  stats: null,
  statsLoading: false,
  statsError: null,
  
  usageAnalytics: [],
  usageAnalyticsLoading: false,
  usageAnalyticsError: null,
  
  supplierPerformance: [],
  supplierPerformanceLoading: false,
  supplierPerformanceError: null,
  
  valuation: null,
  valuationLoading: false,
  valuationError: null,
  
  searchResults: [],
  searchLoading: false,
  searchError: null,
  
  filters: { page: 1, limit: 20 },
  pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
};

// Async thunks
export const fetchInventoryItems = createAsyncThunk(
  'inventory/fetchItems',
  async (params: InventoryFilters = {}) => {
    const response = await inventoryApiService.getAllItems(params);
    return response;
  }
);

export const fetchInventoryItemById = createAsyncThunk(
  'inventory/fetchItemById',
  async (id: string) => {
    const response = await inventoryApiService.getItemById(id);
    return response;
  }
);

export const fetchStockHistory = createAsyncThunk(
  'inventory/fetchStockHistory',
  async ({ id, page = 1, limit = 20 }: { id: string; page?: number; limit?: number }) => {
    const response = await inventoryApiService.getStockHistory(id, page, limit);
    return response;
  }
);

export const fetchMaintenanceSchedule = createAsyncThunk(
  'inventory/fetchMaintenanceSchedule',
  async ({ startDate, endDate }: { startDate?: string; endDate?: string } = {}) => {
    const response = await inventoryApiService.getMaintenanceSchedule(startDate, endDate);
    return response;
  }
);

export const fetchInventoryAlerts = createAsyncThunk(
  'inventory/fetchAlerts',
  async () => {
    const response = await inventoryApiService.getAlerts();
    return response;
  }
);

export const fetchInventoryStats = createAsyncThunk(
  'inventory/fetchStats',
  async () => {
    const response = await inventoryApiService.getStats();
    return response;
  }
);

export const fetchUsageAnalytics = createAsyncThunk(
  'inventory/fetchUsageAnalytics',
  async ({ startDate, endDate }: { startDate?: string; endDate?: string } = {}) => {
    const response = await inventoryApiService.getUsageAnalytics(startDate, endDate);
    return response;
  }
);

export const fetchSupplierPerformance = createAsyncThunk(
  'inventory/fetchSupplierPerformance',
  async () => {
    const response = await inventoryApiService.getSupplierPerformance();
    return response;
  }
);

export const fetchInventoryValuation = createAsyncThunk(
  'inventory/fetchValuation',
  async () => {
    const response = await inventoryApiService.getValuation();
    return response;
  }
);

export const searchInventoryItems = createAsyncThunk(
  'inventory/searchItems',
  async ({ query, limit = 10 }: { query: string; limit?: number }) => {
    const response = await inventoryApiService.searchItems(query, limit);
    return response;
  }
);

// Slice
const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    // Clear errors
    clearItemsError: (state) => {
      state.itemsError = null;
    },
    clearSelectedItemError: (state) => {
      state.selectedItemError = null;
    },
    clearStockHistoryError: (state) => {
      state.stockHistoryError = null;
    },
    clearMaintenanceScheduleError: (state) => {
      state.maintenanceScheduleError = null;
    },
    clearAlertsError: (state) => {
      state.alertsError = null;
    },
    clearStatsError: (state) => {
      state.statsError = null;
    },
    clearUsageAnalyticsError: (state) => {
      state.usageAnalyticsError = null;
    },
    clearSupplierPerformanceError: (state) => {
      state.supplierPerformanceError = null;
    },
    clearValuationError: (state) => {
      state.valuationError = null;
    },
    clearSearchError: (state) => {
      state.searchError = null;
    },
    
    // Set filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Clear selected item
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },
    
    // Clear search results
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    // Items
    builder
      .addCase(fetchInventoryItems.pending, (state) => {
        state.itemsLoading = true;
        state.itemsError = null;
      })
      .addCase(fetchInventoryItems.fulfilled, (state, action) => {
        state.itemsLoading = false;
        state.items = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination = {
            page: action.payload.pagination.page || 1,
            limit: action.payload.pagination.limit || 20,
            total: action.payload.pagination.total || 0,
            totalPages: action.payload.pagination.pages || 0
          };
        }
      })
      .addCase(fetchInventoryItems.rejected, (state, action) => {
        state.itemsLoading = false;
        state.itemsError = action.error.message || 'Failed to fetch inventory items';
      })

    // Selected Item
      .addCase(fetchInventoryItemById.pending, (state) => {
        state.selectedItemLoading = true;
        state.selectedItemError = null;
      })
      .addCase(fetchInventoryItemById.fulfilled, (state, action) => {
        state.selectedItemLoading = false;
        state.selectedItem = action.payload.data;
      })
      .addCase(fetchInventoryItemById.rejected, (state, action) => {
        state.selectedItemLoading = false;
        state.selectedItemError = action.error.message || 'Failed to fetch inventory item';
      })

    // Stock History
      .addCase(fetchStockHistory.pending, (state) => {
        state.stockHistoryLoading = true;
        state.stockHistoryError = null;
      })
      .addCase(fetchStockHistory.fulfilled, (state, action) => {
        state.stockHistoryLoading = false;
        state.stockHistory = action.payload.data || [];
        if (action.payload.pagination) {
          state.stockHistoryPagination = {
            page: action.payload.pagination.page || 1,
            limit: action.payload.pagination.limit || 20,
            total: action.payload.pagination.total || 0,
            totalPages: action.payload.pagination.pages || 0
          };
        }
      })
      .addCase(fetchStockHistory.rejected, (state, action) => {
        state.stockHistoryLoading = false;
        state.stockHistoryError = action.error.message || 'Failed to fetch stock history';
      })

    // Maintenance Schedule
      .addCase(fetchMaintenanceSchedule.pending, (state) => {
        state.maintenanceScheduleLoading = true;
        state.maintenanceScheduleError = null;
      })
      .addCase(fetchMaintenanceSchedule.fulfilled, (state, action) => {
        state.maintenanceScheduleLoading = false;
        state.maintenanceSchedule = action.payload.data || [];
      })
      .addCase(fetchMaintenanceSchedule.rejected, (state, action) => {
        state.maintenanceScheduleLoading = false;
        state.maintenanceScheduleError = action.error.message || 'Failed to fetch maintenance schedule';
      })

    // Alerts
      .addCase(fetchInventoryAlerts.pending, (state) => {
        state.alertsLoading = true;
        state.alertsError = null;
      })
      .addCase(fetchInventoryAlerts.fulfilled, (state, action) => {
        state.alertsLoading = false;
        state.alerts = action.payload.data || [];
      })
      .addCase(fetchInventoryAlerts.rejected, (state, action) => {
        state.alertsLoading = false;
        state.alertsError = action.error.message || 'Failed to fetch inventory alerts';
      })

    // Stats
      .addCase(fetchInventoryStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchInventoryStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchInventoryStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.error.message || 'Failed to fetch inventory stats';
      })

    // Usage Analytics
      .addCase(fetchUsageAnalytics.pending, (state) => {
        state.usageAnalyticsLoading = true;
        state.usageAnalyticsError = null;
      })
      .addCase(fetchUsageAnalytics.fulfilled, (state, action) => {
        state.usageAnalyticsLoading = false;
        state.usageAnalytics = action.payload.data || [];
      })
      .addCase(fetchUsageAnalytics.rejected, (state, action) => {
        state.usageAnalyticsLoading = false;
        state.usageAnalyticsError = action.error.message || 'Failed to fetch usage analytics';
      })

    // Supplier Performance
      .addCase(fetchSupplierPerformance.pending, (state) => {
        state.supplierPerformanceLoading = true;
        state.supplierPerformanceError = null;
      })
      .addCase(fetchSupplierPerformance.fulfilled, (state, action) => {
        state.supplierPerformanceLoading = false;
        state.supplierPerformance = action.payload.data || [];
      })
      .addCase(fetchSupplierPerformance.rejected, (state, action) => {
        state.supplierPerformanceLoading = false;
        state.supplierPerformanceError = action.error.message || 'Failed to fetch supplier performance';
      })

    // Valuation
      .addCase(fetchInventoryValuation.pending, (state) => {
        state.valuationLoading = true;
        state.valuationError = null;
      })
      .addCase(fetchInventoryValuation.fulfilled, (state, action) => {
        state.valuationLoading = false;
        state.valuation = action.payload.data;
      })
      .addCase(fetchInventoryValuation.rejected, (state, action) => {
        state.valuationLoading = false;
        state.valuationError = action.error.message || 'Failed to fetch inventory valuation';
      })

    // Search
      .addCase(searchInventoryItems.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchInventoryItems.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.data || [];
      })
      .addCase(searchInventoryItems.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.error.message || 'Failed to search inventory items';
      });
  },
});

// Selectors
export const selectInventoryItems = (state: { inventory: InventoryState }) => state.inventory.items;
export const selectItemsLoading = (state: { inventory: InventoryState }) => state.inventory.itemsLoading;
export const selectItemsError = (state: { inventory: InventoryState }) => state.inventory.itemsError;

export const selectSelectedItem = (state: { inventory: InventoryState }) => state.inventory.selectedItem;
export const selectSelectedItemLoading = (state: { inventory: InventoryState }) => state.inventory.selectedItemLoading;
export const selectSelectedItemError = (state: { inventory: InventoryState }) => state.inventory.selectedItemError;

export const selectStockHistory = (state: { inventory: InventoryState }) => state.inventory.stockHistory;
export const selectStockHistoryLoading = (state: { inventory: InventoryState }) => state.inventory.stockHistoryLoading;
export const selectStockHistoryError = (state: { inventory: InventoryState }) => state.inventory.stockHistoryError;
export const selectStockHistoryPagination = (state: { inventory: InventoryState }) => state.inventory.stockHistoryPagination;

export const selectMaintenanceSchedule = (state: { inventory: InventoryState }) => state.inventory.maintenanceSchedule;
export const selectMaintenanceScheduleLoading = (state: { inventory: InventoryState }) => state.inventory.maintenanceScheduleLoading;
export const selectMaintenanceScheduleError = (state: { inventory: InventoryState }) => state.inventory.maintenanceScheduleError;

export const selectInventoryAlerts = (state: { inventory: InventoryState }) => state.inventory.alerts;
export const selectAlertsLoading = (state: { inventory: InventoryState }) => state.inventory.alertsLoading;
export const selectAlertsError = (state: { inventory: InventoryState }) => state.inventory.alertsError;

export const selectInventoryStats = (state: { inventory: InventoryState }) => state.inventory.stats;
export const selectStatsLoading = (state: { inventory: InventoryState }) => state.inventory.statsLoading;
export const selectStatsError = (state: { inventory: InventoryState }) => state.inventory.statsError;

export const selectUsageAnalytics = (state: { inventory: InventoryState }) => state.inventory.usageAnalytics;
export const selectUsageAnalyticsLoading = (state: { inventory: InventoryState }) => state.inventory.usageAnalyticsLoading;
export const selectUsageAnalyticsError = (state: { inventory: InventoryState }) => state.inventory.usageAnalyticsError;

export const selectSupplierPerformance = (state: { inventory: InventoryState }) => state.inventory.supplierPerformance;
export const selectSupplierPerformanceLoading = (state: { inventory: InventoryState }) => state.inventory.supplierPerformanceLoading;
export const selectSupplierPerformanceError = (state: { inventory: InventoryState }) => state.inventory.supplierPerformanceError;

export const selectInventoryValuation = (state: { inventory: InventoryState }) => state.inventory.valuation;
export const selectValuationLoading = (state: { inventory: InventoryState }) => state.inventory.valuationLoading;
export const selectValuationError = (state: { inventory: InventoryState }) => state.inventory.valuationError;

export const selectSearchResults = (state: { inventory: InventoryState }) => state.inventory.searchResults;
export const selectSearchLoading = (state: { inventory: InventoryState }) => state.inventory.searchLoading;
export const selectSearchError = (state: { inventory: InventoryState }) => state.inventory.searchError;

export const selectFilters = (state: { inventory: InventoryState }) => state.inventory.filters;
export const selectPagination = (state: { inventory: InventoryState }) => state.inventory.pagination;

// Derived selectors
export const selectActiveItems = (state: { inventory: InventoryState }) => {
  return state.inventory.items.filter(item => item.isActive);
};

export const selectLowStockItems = (state: { inventory: InventoryState }) => {
  return state.inventory.items.filter(item => item.quantity <= item.minQuantity);
};

export const selectItemsByCategory = (state: { inventory: InventoryState }, category: string) => {
  return state.inventory.items.filter(item => item.category === category);
};

export const selectItemsByLocation = (state: { inventory: InventoryState }, location: string) => {
  return state.inventory.items.filter(item => item.location === location);
};

export const selectExpiringItems = (state: { inventory: InventoryState }, days: number = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + days);
  
  return state.inventory.items
    .filter(item => {
      if (!item.expirationDate) return false;
      const expirationDate = new Date(item.expirationDate);
      return expirationDate <= cutoffDate;
    })
    .sort((a, b) => new Date(a.expirationDate!).getTime() - new Date(b.expirationDate!).getTime());
};

export const selectCriticalAlerts = (state: { inventory: InventoryState }) => {
  return state.inventory.alerts.filter(alert => alert.severity === 'CRITICAL');
};

// Export actions and reducer
export const {
  clearItemsError,
  clearSelectedItemError,
  clearStockHistoryError,
  clearMaintenanceScheduleError,
  clearAlertsError,
  clearStatsError,
  clearUsageAnalyticsError,
  clearSupplierPerformanceError,
  clearValuationError,
  clearSearchError,
  setFilters,
  clearSelectedItem,
  clearSearchResults,
} = inventorySlice.actions;

export default inventorySlice.reducer;
