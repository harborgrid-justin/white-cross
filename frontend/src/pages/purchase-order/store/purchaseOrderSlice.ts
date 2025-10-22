import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { purchaseOrderApi } from '../../../services/modules/purchaseOrderApi';
import {
  PurchaseOrder,
  PurchaseOrderFilters,
  CreatePurchaseOrderData,
  UpdatePurchaseOrderData,
  PurchaseOrdersResponse,
  ReceiveItemsData,
  PurchaseOrderStatistics,
  ReorderItem,
  VendorOrderHistory,
  PurchaseOrderStatus,
} from '../../../types/purchaseOrders';

// =====================
// SERVICE ADAPTER CLASS
// =====================

export class PurchaseOrderApiService {
  // Core purchase order operations
  async getPurchaseOrders(filters: PurchaseOrderFilters = {}): Promise<PurchaseOrdersResponse> {
    return purchaseOrderApi.getPurchaseOrders(filters);
  }

  async getPurchaseOrderById(id: string): Promise<PurchaseOrder> {
    return purchaseOrderApi.getPurchaseOrderById(id);
  }

  async createPurchaseOrder(orderData: CreatePurchaseOrderData): Promise<PurchaseOrder> {
    return purchaseOrderApi.createPurchaseOrder(orderData);
  }

  async updatePurchaseOrder(id: string, orderData: UpdatePurchaseOrderData): Promise<PurchaseOrder> {
    return purchaseOrderApi.updatePurchaseOrder(id, orderData);
  }

  async deletePurchaseOrder(id: string): Promise<{ success: boolean; message: string }> {
    return purchaseOrderApi.deletePurchaseOrder(id);
  }

  // Workflow operations
  async approvePurchaseOrder(id: string, approvedBy: string): Promise<PurchaseOrder> {
    return purchaseOrderApi.approvePurchaseOrder(id, approvedBy);
  }

  async cancelPurchaseOrder(id: string, reason?: string): Promise<PurchaseOrder> {
    return purchaseOrderApi.cancelPurchaseOrder(id, reason);
  }

  async receiveItems(id: string, data: ReceiveItemsData, performedBy: string): Promise<PurchaseOrder> {
    return purchaseOrderApi.receiveItems(id, data, performedBy);
  }

  // Status-based queries
  async getPendingOrders(): Promise<PurchaseOrder[]> {
    return purchaseOrderApi.getPendingOrders();
  }

  async getOrdersByStatus(status: PurchaseOrderStatus, page: number = 1, limit: number = 20): Promise<PurchaseOrdersResponse> {
    return purchaseOrderApi.getOrdersByStatus(status, page, limit);
  }

  async getRecentOrders(limit: number = 10): Promise<PurchaseOrder[]> {
    return purchaseOrderApi.getRecentOrders(limit);
  }

  async getOrdersRequiringReceiving(): Promise<PurchaseOrder[]> {
    return purchaseOrderApi.getOrdersRequiringReceiving();
  }

  // Analytics and reporting
  async getPurchaseOrderStatistics(): Promise<PurchaseOrderStatistics> {
    return purchaseOrderApi.getPurchaseOrderStatistics();
  }

  async getVendorPurchaseHistory(vendorId: string, limit: number = 10): Promise<VendorOrderHistory> {
    return purchaseOrderApi.getVendorPurchaseHistory(vendorId, limit);
  }

  async getItemsNeedingReorder(): Promise<ReorderItem[]> {
    return purchaseOrderApi.getItemsNeedingReorder();
  }

  // Document operations
  async exportPurchaseOrder(id: string, format: 'pdf' | 'csv' = 'pdf'): Promise<Blob> {
    return purchaseOrderApi.exportPurchaseOrder(id, format);
  }

  async printPurchaseOrder(id: string): Promise<Blob> {
    return purchaseOrderApi.printPurchaseOrder(id);
  }

  async sendOrderToVendor(id: string, email?: string): Promise<{ success: boolean; message: string }> {
    return purchaseOrderApi.sendOrderToVendor(id, email);
  }

  // Additional operations
  async duplicatePurchaseOrder(id: string): Promise<PurchaseOrder> {
    return purchaseOrderApi.duplicatePurchaseOrder(id);
  }

  async addOrderNote(id: string, note: string): Promise<PurchaseOrder> {
    return purchaseOrderApi.addOrderNote(id, note);
  }

  async getOrderFulfillmentStatus(id: string): Promise<{
    totalItems: number;
    receivedItems: number;
    pendingItems: number;
    fulfillmentPercentage: number;
  }> {
    return purchaseOrderApi.getOrderFulfillmentStatus(id);
  }
}

// Create service instance
const purchaseOrderService = new PurchaseOrderApiService();

// =====================
// ASYNC THUNKS
// =====================

export const fetchPurchaseOrders = createAsyncThunk(
  'purchaseOrder/fetchPurchaseOrders',
  async (filters: PurchaseOrderFilters = {}) => {
    return await purchaseOrderService.getPurchaseOrders(filters);
  }
);

export const fetchPurchaseOrderById = createAsyncThunk(
  'purchaseOrder/fetchPurchaseOrderById',
  async (id: string) => {
    return await purchaseOrderService.getPurchaseOrderById(id);
  }
);

export const createPurchaseOrder = createAsyncThunk(
  'purchaseOrder/createPurchaseOrder',
  async (orderData: CreatePurchaseOrderData) => {
    return await purchaseOrderService.createPurchaseOrder(orderData);
  }
);

export const updatePurchaseOrder = createAsyncThunk(
  'purchaseOrder/updatePurchaseOrder',
  async ({ id, orderData }: { id: string; orderData: UpdatePurchaseOrderData }) => {
    return await purchaseOrderService.updatePurchaseOrder(id, orderData);
  }
);

export const deletePurchaseOrder = createAsyncThunk(
  'purchaseOrder/deletePurchaseOrder',
  async (id: string) => {
    return await purchaseOrderService.deletePurchaseOrder(id);
  }
);

export const approvePurchaseOrder = createAsyncThunk(
  'purchaseOrder/approvePurchaseOrder',
  async ({ id, approvedBy }: { id: string; approvedBy: string }) => {
    return await purchaseOrderService.approvePurchaseOrder(id, approvedBy);
  }
);

export const cancelPurchaseOrder = createAsyncThunk(
  'purchaseOrder/cancelPurchaseOrder',
  async ({ id, reason }: { id: string; reason?: string }) => {
    return await purchaseOrderService.cancelPurchaseOrder(id, reason);
  }
);

export const receiveItems = createAsyncThunk(
  'purchaseOrder/receiveItems',
  async ({ id, data, performedBy }: { id: string; data: ReceiveItemsData; performedBy: string }) => {
    return await purchaseOrderService.receiveItems(id, data, performedBy);
  }
);

export const fetchPendingOrders = createAsyncThunk(
  'purchaseOrder/fetchPendingOrders',
  async () => {
    return await purchaseOrderService.getPendingOrders();
  }
);

export const fetchOrdersByStatus = createAsyncThunk(
  'purchaseOrder/fetchOrdersByStatus',
  async ({ status, page, limit }: { status: PurchaseOrderStatus; page?: number; limit?: number }) => {
    return await purchaseOrderService.getOrdersByStatus(status, page, limit);
  }
);

export const fetchRecentOrders = createAsyncThunk(
  'purchaseOrder/fetchRecentOrders',
  async (limit: number = 10) => {
    return await purchaseOrderService.getRecentOrders(limit);
  }
);

export const fetchOrdersRequiringReceiving = createAsyncThunk(
  'purchaseOrder/fetchOrdersRequiringReceiving',
  async () => {
    return await purchaseOrderService.getOrdersRequiringReceiving();
  }
);

export const fetchPurchaseOrderStatistics = createAsyncThunk(
  'purchaseOrder/fetchPurchaseOrderStatistics',
  async () => {
    return await purchaseOrderService.getPurchaseOrderStatistics();
  }
);

export const fetchVendorPurchaseHistory = createAsyncThunk(
  'purchaseOrder/fetchVendorPurchaseHistory',
  async ({ vendorId, limit }: { vendorId: string; limit?: number }) => {
    return await purchaseOrderService.getVendorPurchaseHistory(vendorId, limit);
  }
);

export const fetchItemsNeedingReorder = createAsyncThunk(
  'purchaseOrder/fetchItemsNeedingReorder',
  async () => {
    return await purchaseOrderService.getItemsNeedingReorder();
  }
);

export const exportPurchaseOrder = createAsyncThunk(
  'purchaseOrder/exportPurchaseOrder',
  async ({ id, format }: { id: string; format?: 'pdf' | 'csv' }) => {
    return await purchaseOrderService.exportPurchaseOrder(id, format);
  }
);

export const sendOrderToVendor = createAsyncThunk(
  'purchaseOrder/sendOrderToVendor',
  async ({ id, email }: { id: string; email?: string }) => {
    return await purchaseOrderService.sendOrderToVendor(id, email);
  }
);

export const duplicatePurchaseOrder = createAsyncThunk(
  'purchaseOrder/duplicatePurchaseOrder',
  async (id: string) => {
    return await purchaseOrderService.duplicatePurchaseOrder(id);
  }
);

export const addOrderNote = createAsyncThunk(
  'purchaseOrder/addOrderNote',
  async ({ id, note }: { id: string; note: string }) => {
    return await purchaseOrderService.addOrderNote(id, note);
  }
);

export const fetchOrderFulfillmentStatus = createAsyncThunk(
  'purchaseOrder/fetchOrderFulfillmentStatus',
  async (id: string) => {
    return await purchaseOrderService.getOrderFulfillmentStatus(id);
  }
);

// =====================
// INITIAL STATE
// =====================

interface PurchaseOrderState {
  // Core data
  purchaseOrders: PurchaseOrder[];
  currentPurchaseOrder: PurchaseOrder | null;
  pendingOrders: PurchaseOrder[];
  recentOrders: PurchaseOrder[];
  ordersRequiringReceiving: PurchaseOrder[];
  itemsNeedingReorder: ReorderItem[];
  vendorHistory: VendorOrderHistory | null;

  // Analytics
  statistics: PurchaseOrderStatistics | null;
  fulfillmentStatus: {
    totalItems: number;
    receivedItems: number;
    pendingItems: number;
    fulfillmentPercentage: number;
  } | null;

  // UI state
  selectedOrders: string[];
  filters: PurchaseOrderFilters;
  
  // Pagination
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };

  // Loading states
  loading: {
    orders: boolean;
    currentOrder: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    approving: boolean;
    canceling: boolean;
    receiving: boolean;
    statistics: boolean;
    pendingOrders: boolean;
    recentOrders: boolean;
    reorderItems: boolean;
    exporting: boolean;
    sending: boolean;
    duplicating: boolean;
    fulfillmentStatus: boolean;
  };

  // Error states
  error: {
    orders: string | null;
    currentOrder: string | null;
    creating: string | null;
    updating: string | null;
    deleting: string | null;
    approving: string | null;
    canceling: string | null;
    receiving: string | null;
    statistics: string | null;
    pendingOrders: string | null;
    recentOrders: string | null;
    reorderItems: string | null;
    exporting: string | null;
    sending: string | null;
    duplicating: string | null;
    fulfillmentStatus: string | null;
  };
}

const initialState: PurchaseOrderState = {
  purchaseOrders: [],
  currentPurchaseOrder: null,
  pendingOrders: [],
  recentOrders: [],
  ordersRequiringReceiving: [],
  itemsNeedingReorder: [],
  vendorHistory: null,
  statistics: null,
  fulfillmentStatus: null,
  selectedOrders: [],
  filters: {},
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  },
  loading: {
    orders: false,
    currentOrder: false,
    creating: false,
    updating: false,
    deleting: false,
    approving: false,
    canceling: false,
    receiving: false,
    statistics: false,
    pendingOrders: false,
    recentOrders: false,
    reorderItems: false,
    exporting: false,
    sending: false,
    duplicating: false,
    fulfillmentStatus: false,
  },
  error: {
    orders: null,
    currentOrder: null,
    creating: null,
    updating: null,
    deleting: null,
    approving: null,
    canceling: null,
    receiving: null,
    statistics: null,
    pendingOrders: null,
    recentOrders: null,
    reorderItems: null,
    exporting: null,
    sending: null,
    duplicating: null,
    fulfillmentStatus: null,
  },
};

// =====================
// SLICE
// =====================

const purchaseOrderSlice = createSlice({
  name: 'purchaseOrder',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<PurchaseOrderFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSelectedOrders: (state, action: PayloadAction<string[]>) => {
      state.selectedOrders = action.payload;
    },
    toggleOrderSelection: (state, action: PayloadAction<string>) => {
      const orderId = action.payload;
      if (state.selectedOrders.includes(orderId)) {
        state.selectedOrders = state.selectedOrders.filter(id => id !== orderId);
      } else {
        state.selectedOrders.push(orderId);
      }
    },
    clearSelectedOrders: (state) => {
      state.selectedOrders = [];
    },
    clearCurrentOrder: (state) => {
      state.currentPurchaseOrder = null;
    },
    clearErrors: (state) => {
      Object.keys(state.error).forEach(key => {
        state.error[key as keyof typeof state.error] = null;
      });
    },
  },
  extraReducers: (builder) => {
    // Fetch purchase orders
    builder
      .addCase(fetchPurchaseOrders.pending, (state) => {
        state.loading.orders = true;
        state.error.orders = null;
      })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.loading.orders = false;
        state.purchaseOrders = action.payload.orders;
        state.pagination = {
          currentPage: action.payload.pagination.page,
          totalPages: action.payload.pagination.pages,
          totalItems: action.payload.pagination.total,
          itemsPerPage: action.payload.pagination.limit,
        };
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.loading.orders = false;
        state.error.orders = action.error.message || 'Failed to fetch purchase orders';
      });

    // Fetch purchase order by ID
    builder
      .addCase(fetchPurchaseOrderById.pending, (state) => {
        state.loading.currentOrder = true;
        state.error.currentOrder = null;
      })
      .addCase(fetchPurchaseOrderById.fulfilled, (state, action) => {
        state.loading.currentOrder = false;
        state.currentPurchaseOrder = action.payload;
      })
      .addCase(fetchPurchaseOrderById.rejected, (state, action) => {
        state.loading.currentOrder = false;
        state.error.currentOrder = action.error.message || 'Failed to fetch purchase order';
      });

    // Create purchase order
    builder
      .addCase(createPurchaseOrder.pending, (state) => {
        state.loading.creating = true;
        state.error.creating = null;
      })
      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.purchaseOrders.unshift(action.payload);
      })
      .addCase(createPurchaseOrder.rejected, (state, action) => {
        state.loading.creating = false;
        state.error.creating = action.error.message || 'Failed to create purchase order';
      });

    // Update purchase order
    builder
      .addCase(updatePurchaseOrder.pending, (state) => {
        state.loading.updating = true;
        state.error.updating = null;
      })
      .addCase(updatePurchaseOrder.fulfilled, (state, action) => {
        state.loading.updating = false;
        const index = state.purchaseOrders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.purchaseOrders[index] = action.payload;
        }
        if (state.currentPurchaseOrder && state.currentPurchaseOrder.id === action.payload.id) {
          state.currentPurchaseOrder = action.payload;
        }
      })
      .addCase(updatePurchaseOrder.rejected, (state, action) => {
        state.loading.updating = false;
        state.error.updating = action.error.message || 'Failed to update purchase order';
      });

    // Delete purchase order
    builder
      .addCase(deletePurchaseOrder.pending, (state) => {
        state.loading.deleting = true;
        state.error.deleting = null;
      })
      .addCase(deletePurchaseOrder.fulfilled, (state, action) => {
        state.loading.deleting = false;
        // Remove from current list - the action payload contains success message
        // We need to track the deleted ID separately or refetch the list
      })
      .addCase(deletePurchaseOrder.rejected, (state, action) => {
        state.loading.deleting = false;
        state.error.deleting = action.error.message || 'Failed to delete purchase order';
      });

    // Approve purchase order
    builder
      .addCase(approvePurchaseOrder.pending, (state) => {
        state.loading.approving = true;
        state.error.approving = null;
      })
      .addCase(approvePurchaseOrder.fulfilled, (state, action) => {
        state.loading.approving = false;
        const index = state.purchaseOrders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.purchaseOrders[index] = action.payload;
        }
        if (state.currentPurchaseOrder && state.currentPurchaseOrder.id === action.payload.id) {
          state.currentPurchaseOrder = action.payload;
        }
      })
      .addCase(approvePurchaseOrder.rejected, (state, action) => {
        state.loading.approving = false;
        state.error.approving = action.error.message || 'Failed to approve purchase order';
      });

    // Cancel purchase order
    builder
      .addCase(cancelPurchaseOrder.pending, (state) => {
        state.loading.canceling = true;
        state.error.canceling = null;
      })
      .addCase(cancelPurchaseOrder.fulfilled, (state, action) => {
        state.loading.canceling = false;
        const index = state.purchaseOrders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.purchaseOrders[index] = action.payload;
        }
        if (state.currentPurchaseOrder && state.currentPurchaseOrder.id === action.payload.id) {
          state.currentPurchaseOrder = action.payload;
        }
      })
      .addCase(cancelPurchaseOrder.rejected, (state, action) => {
        state.loading.canceling = false;
        state.error.canceling = action.error.message || 'Failed to cancel purchase order';
      });

    // Receive items
    builder
      .addCase(receiveItems.pending, (state) => {
        state.loading.receiving = true;
        state.error.receiving = null;
      })
      .addCase(receiveItems.fulfilled, (state, action) => {
        state.loading.receiving = false;
        const index = state.purchaseOrders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.purchaseOrders[index] = action.payload;
        }
        if (state.currentPurchaseOrder && state.currentPurchaseOrder.id === action.payload.id) {
          state.currentPurchaseOrder = action.payload;
        }
      })
      .addCase(receiveItems.rejected, (state, action) => {
        state.loading.receiving = false;
        state.error.receiving = action.error.message || 'Failed to receive items';
      });

    // Fetch pending orders
    builder
      .addCase(fetchPendingOrders.pending, (state) => {
        state.loading.pendingOrders = true;
        state.error.pendingOrders = null;
      })
      .addCase(fetchPendingOrders.fulfilled, (state, action) => {
        state.loading.pendingOrders = false;
        state.pendingOrders = action.payload;
      })
      .addCase(fetchPendingOrders.rejected, (state, action) => {
        state.loading.pendingOrders = false;
        state.error.pendingOrders = action.error.message || 'Failed to fetch pending orders';
      });

    // Fetch recent orders
    builder
      .addCase(fetchRecentOrders.fulfilled, (state, action) => {
        state.recentOrders = action.payload;
      });

    // Fetch orders requiring receiving
    builder
      .addCase(fetchOrdersRequiringReceiving.fulfilled, (state, action) => {
        state.ordersRequiringReceiving = action.payload;
      });

    // Fetch statistics
    builder
      .addCase(fetchPurchaseOrderStatistics.pending, (state) => {
        state.loading.statistics = true;
        state.error.statistics = null;
      })
      .addCase(fetchPurchaseOrderStatistics.fulfilled, (state, action) => {
        state.loading.statistics = false;
        state.statistics = action.payload;
      })
      .addCase(fetchPurchaseOrderStatistics.rejected, (state, action) => {
        state.loading.statistics = false;
        state.error.statistics = action.error.message || 'Failed to fetch statistics';
      });

    // Fetch vendor history
    builder
      .addCase(fetchVendorPurchaseHistory.fulfilled, (state, action) => {
        state.vendorHistory = action.payload;
      });

    // Fetch items needing reorder
    builder
      .addCase(fetchItemsNeedingReorder.pending, (state) => {
        state.loading.reorderItems = true;
        state.error.reorderItems = null;
      })
      .addCase(fetchItemsNeedingReorder.fulfilled, (state, action) => {
        state.loading.reorderItems = false;
        state.itemsNeedingReorder = action.payload;
      })
      .addCase(fetchItemsNeedingReorder.rejected, (state, action) => {
        state.loading.reorderItems = false;
        state.error.reorderItems = action.error.message || 'Failed to fetch reorder items';
      });

    // Send order to vendor
    builder
      .addCase(sendOrderToVendor.pending, (state) => {
        state.loading.sending = true;
        state.error.sending = null;
      })
      .addCase(sendOrderToVendor.fulfilled, (state) => {
        state.loading.sending = false;
      })
      .addCase(sendOrderToVendor.rejected, (state, action) => {
        state.loading.sending = false;
        state.error.sending = action.error.message || 'Failed to send order to vendor';
      });

    // Duplicate order
    builder
      .addCase(duplicatePurchaseOrder.pending, (state) => {
        state.loading.duplicating = true;
        state.error.duplicating = null;
      })
      .addCase(duplicatePurchaseOrder.fulfilled, (state, action) => {
        state.loading.duplicating = false;
        state.purchaseOrders.unshift(action.payload);
      })
      .addCase(duplicatePurchaseOrder.rejected, (state, action) => {
        state.loading.duplicating = false;
        state.error.duplicating = action.error.message || 'Failed to duplicate purchase order';
      });

    // Fetch fulfillment status
    builder
      .addCase(fetchOrderFulfillmentStatus.pending, (state) => {
        state.loading.fulfillmentStatus = true;
        state.error.fulfillmentStatus = null;
      })
      .addCase(fetchOrderFulfillmentStatus.fulfilled, (state, action) => {
        state.loading.fulfillmentStatus = false;
        state.fulfillmentStatus = action.payload;
      })
      .addCase(fetchOrderFulfillmentStatus.rejected, (state, action) => {
        state.loading.fulfillmentStatus = false;
        state.error.fulfillmentStatus = action.error.message || 'Failed to fetch fulfillment status';
      });
  },
});

// =====================
// ACTIONS & SELECTORS
// =====================

export const {
  setFilters,
  clearFilters,
  setSelectedOrders,
  toggleOrderSelection,
  clearSelectedOrders,
  clearCurrentOrder,
  clearErrors,
} = purchaseOrderSlice.actions;

// Selectors
export const selectPurchaseOrders = (state: { purchaseOrder: PurchaseOrderState }) => state.purchaseOrder.purchaseOrders;
export const selectCurrentPurchaseOrder = (state: { purchaseOrder: PurchaseOrderState }) => state.purchaseOrder.currentPurchaseOrder;
export const selectPendingOrders = (state: { purchaseOrder: PurchaseOrderState }) => state.purchaseOrder.pendingOrders;
export const selectRecentOrders = (state: { purchaseOrder: PurchaseOrderState }) => state.purchaseOrder.recentOrders;
export const selectOrdersRequiringReceiving = (state: { purchaseOrder: PurchaseOrderState }) => state.purchaseOrder.ordersRequiringReceiving;
export const selectItemsNeedingReorder = (state: { purchaseOrder: PurchaseOrderState }) => state.purchaseOrder.itemsNeedingReorder;
export const selectVendorHistory = (state: { purchaseOrder: PurchaseOrderState }) => state.purchaseOrder.vendorHistory;
export const selectPurchaseOrderStatistics = (state: { purchaseOrder: PurchaseOrderState }) => state.purchaseOrder.statistics;
export const selectFulfillmentStatus = (state: { purchaseOrder: PurchaseOrderState }) => state.purchaseOrder.fulfillmentStatus;
export const selectSelectedOrders = (state: { purchaseOrder: PurchaseOrderState }) => state.purchaseOrder.selectedOrders;
export const selectPurchaseOrderFilters = (state: { purchaseOrder: PurchaseOrderState }) => state.purchaseOrder.filters;
export const selectPurchaseOrderPagination = (state: { purchaseOrder: PurchaseOrderState }) => state.purchaseOrder.pagination;
export const selectPurchaseOrderLoading = (state: { purchaseOrder: PurchaseOrderState }) => state.purchaseOrder.loading;
export const selectPurchaseOrderErrors = (state: { purchaseOrder: PurchaseOrderState }) => state.purchaseOrder.error;

// Advanced selectors
export const selectOrdersByStatus = (state: { purchaseOrder: PurchaseOrderState }, status: PurchaseOrderStatus) =>
  state.purchaseOrder.purchaseOrders.filter(order => order.status === status);

export const selectOrdersTotal = (state: { purchaseOrder: PurchaseOrderState }) =>
  state.purchaseOrder.purchaseOrders.reduce((sum, order) => sum + (order.total || 0), 0);

export const selectOrdersThisMonth = (state: { purchaseOrder: PurchaseOrderState }) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return state.purchaseOrder.purchaseOrders.filter(
    order => new Date(order.orderDate) >= startOfMonth
  );
};

export default purchaseOrderSlice.reducer;
