/**
 * WF-COMP-281 | inventoryApi.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../config/apiConfig, ../types | Dependencies: ../config/apiConfig, ../types, zod
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, constants, classes | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Inventory Management API
 * Enterprise-grade API client for inventory tracking, stock management, and purchase orders
 */

import type { ApiClient } from '../core/ApiClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import { ApiResponse, PaginatedResponse } from '../types';
import { z } from 'zod';
import type {
  InventoryItem,
  InventoryTransaction,
  MaintenanceLog,
  Vendor,
  PurchaseOrder,
  InventoryAlert,
  InventoryFilters,
  CreateInventoryItemRequest,
  UpdateInventoryItemRequest,
  CreateInventoryTransactionRequest,
  StockAdjustmentRequest,
  StockAdjustmentResponse,
  CreateMaintenanceLogRequest,
  CreateVendorRequest,
  CreatePurchaseOrderRequest,
  GeneratePurchaseOrderRequest,
  MaintenanceScheduleParams,
  UsageAnalyticsParams,
  InventoryItemsResponse,
  InventoryItemWithStockResponse,
  StockHistoryResponse,
  InventoryValuationResponse,
  UsageAnalyticsResponse,
  SupplierPerformanceResponse,
  InventoryStatsResponse,
  GeneratedPurchaseOrder,
  InventoryTransactionType,
  MaintenanceType,
  PurchaseOrderStatus,
} from '../../types/inventory';

// =====================
// VALIDATION SCHEMAS
// =====================

const createInventoryItemSchema = z.object({
  name: z.string()
    .min(1, 'Item name is required')
    .max(255, 'Item name cannot exceed 255 characters'),
  category: z.string()
    .min(1, 'Category is required')
    .max(100, 'Category cannot exceed 100 characters'),
  description: z.string()
    .max(5000, 'Description cannot exceed 5000 characters')
    .optional(),
  sku: z.string()
    .max(50, 'SKU cannot exceed 50 characters')
    .optional(),
  supplier: z.string()
    .max(255, 'Supplier name cannot exceed 255 characters')
    .optional(),
  unitCost: z.number()
    .nonnegative('Unit cost must be non-negative')
    .max(99999999.99, 'Unit cost cannot exceed $99,999,999.99')
    .optional(),
  reorderLevel: z.number()
    .int('Reorder level must be an integer')
    .nonnegative('Reorder level must be non-negative')
    .max(1000000, 'Reorder level cannot exceed 1,000,000'),
  reorderQuantity: z.number()
    .int('Reorder quantity must be an integer')
    .positive('Reorder quantity must be positive')
    .max(1000000, 'Reorder quantity cannot exceed 1,000,000'),
  location: z.string()
    .max(255, 'Location cannot exceed 255 characters')
    .optional(),
  notes: z.string()
    .max(10000, 'Notes cannot exceed 10,000 characters')
    .optional(),
});

const createTransactionSchema = z.object({
  inventoryItemId: z.string().uuid('Invalid inventory item ID'),
  type: z.enum(['PURCHASE', 'USAGE', 'ADJUSTMENT', 'TRANSFER', 'DISPOSAL']),
  quantity: z.number()
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1')
    .max(1000000, 'Quantity cannot exceed 1,000,000'),
  unitCost: z.number()
    .nonnegative('Unit cost must be non-negative')
    .max(99999999.99, 'Unit cost cannot exceed $99,999,999.99')
    .optional(),
  reason: z.string()
    .max(5000, 'Reason cannot exceed 5000 characters')
    .optional(),
  batchNumber: z.string()
    .max(100, 'Batch number cannot exceed 100 characters')
    .regex(/^[A-Za-z0-9-_]*$/, 'Batch number can only contain alphanumeric characters, hyphens, and underscores')
    .optional(),
  expirationDate: z.string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const expDate = new Date(date);
      return expDate >= new Date('1900-01-01');
    }, 'Expiration date cannot be before 1900'),
  notes: z.string()
    .max(10000, 'Notes cannot exceed 10,000 characters')
    .optional(),
}).refine((data) => {
  if ((data.type === 'ADJUSTMENT' || data.type === 'DISPOSAL') && !data.reason?.trim()) {
    return false;
  }
  return true;
}, {
  message: 'Reason is required for adjustment and disposal transactions',
  path: ['reason']
});

const stockAdjustmentSchema = z.object({
  quantity: z.number()
    .int('Quantity must be an integer')
    .refine((val) => val !== 0, 'Quantity cannot be zero')
    .refine((val) => Math.abs(val) <= 1000000, 'Quantity cannot exceed 1,000,000 in absolute value'),
  reason: z.string()
    .min(1, 'Reason is required for stock adjustments')
    .max(5000, 'Reason cannot exceed 5000 characters'),
});

const createMaintenanceLogSchema = z.object({
  inventoryItemId: z.string().uuid('Invalid inventory item ID'),
  type: z.enum(['ROUTINE', 'REPAIR', 'CALIBRATION', 'INSPECTION', 'CLEANING']),
  description: z.string()
    .min(1, 'Description is required')
    .max(5000, 'Description cannot exceed 5000 characters'),
  cost: z.number()
    .nonnegative('Cost must be non-negative')
    .max(99999999.99, 'Cost cannot exceed $99,999,999.99')
    .optional(),
  nextMaintenanceDate: z.string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const maintDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return maintDate >= today;
    }, 'Next maintenance date should be in the future'),
  vendor: z.string()
    .max(255, 'Vendor name cannot exceed 255 characters')
    .optional(),
  notes: z.string()
    .max(10000, 'Notes cannot exceed 10,000 characters')
    .optional(),
});

const createVendorSchema = z.object({
  name: z.string()
    .min(1, 'Vendor name is required')
    .max(255, 'Vendor name cannot exceed 255 characters'),
  contactName: z.string()
    .max(255, 'Contact name cannot exceed 255 characters')
    .optional(),
  email: z.string()
    .email('Must be a valid email address')
    .max(255, 'Email cannot exceed 255 characters')
    .optional()
    .or(z.literal('')),
  phone: z.string()
    .max(50, 'Phone number cannot exceed 50 characters')
    .optional(),
  address: z.string()
    .max(1000, 'Address cannot exceed 1000 characters')
    .optional(),
  website: z.string()
    .url('Must be a valid URL')
    .max(255, 'Website URL cannot exceed 255 characters')
    .optional()
    .or(z.literal('')),
  taxId: z.string()
    .max(50, 'Tax ID cannot exceed 50 characters')
    .optional(),
  paymentTerms: z.string()
    .max(255, 'Payment terms cannot exceed 255 characters')
    .optional(),
  notes: z.string()
    .max(10000, 'Notes cannot exceed 10,000 characters')
    .optional(),
  rating: z.number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5')
    .optional(),
});

const createPurchaseOrderSchema = z.object({
  orderNumber: z.string()
    .min(1, 'Order number is required')
    .max(50, 'Order number cannot exceed 50 characters'),
  vendorId: z.string().uuid('Invalid vendor ID'),
  orderDate: z.string().min(1, 'Order date is required'),
  expectedDate: z.string().optional(),
  notes: z.string()
    .max(10000, 'Notes cannot exceed 10,000 characters')
    .optional(),
  items: z.array(z.object({
    inventoryItemId: z.string().uuid('Invalid inventory item ID'),
    quantity: z.number()
      .int('Quantity must be an integer')
      .positive('Quantity must be positive')
      .max(1000000, 'Quantity cannot exceed 1,000,000'),
    unitCost: z.number()
      .nonnegative('Unit cost must be non-negative')
      .max(99999999.99, 'Unit cost cannot exceed $99,999,999.99'),
  })).min(1, 'At least one item is required'),
}).refine((data) => {
  if (data.expectedDate && data.orderDate) {
    return new Date(data.expectedDate) >= new Date(data.orderDate);
  }
  return true;
}, {
  message: 'Expected date must be on or after the order date',
  path: ['expectedDate']
});

// =====================
// INVENTORY API CLASS
// =====================

/**
 * Inventory API Client
 * Provides comprehensive inventory management functionality
 */
export class InventoryApi {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get all inventory items with filtering and pagination
   */
  async getInventoryItems(filters: InventoryFilters = {}): Promise<InventoryItemsResponse> {
    try {
      const params = new URLSearchParams();

      if (filters.page) params.append('page', String(filters.page));
      if (filters.limit) params.append('limit', String(filters.limit));
      if (filters.category) params.append('category', filters.category);
      if (filters.supplier) params.append('supplier', filters.supplier);
      if (filters.location) params.append('location', filters.location);
      if (filters.lowStock !== undefined) params.append('lowStock', String(filters.lowStock));
      if (filters.needsMaintenance !== undefined) params.append('needsMaintenance', String(filters.needsMaintenance));
      if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));

      const response = await this.client.get<ApiResponse<InventoryItemsResponse>>(
        `${API_ENDPOINTS.INVENTORY.BASE}?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch inventory items');
    }
  }

  /**
   * Get single inventory item by ID with stock and transaction history
   */
  async getInventoryItem(id: string): Promise<InventoryItemWithStockResponse> {
    try {
      if (!id) throw new Error('Inventory item ID is required');

      const response = await this.client.get<ApiResponse<{ item: InventoryItemWithStockResponse }>>(
        API_ENDPOINTS.INVENTORY.BY_ID(id)
      );

      return response.data.data.item;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch inventory item');
    }
  }

  /**
   * Create new inventory item
   */
  async createInventoryItem(data: CreateInventoryItemRequest): Promise<InventoryItem> {
    try {
      createInventoryItemSchema.parse(data);

      const response = await this.client.post<ApiResponse<{ item: InventoryItem }>>(
        API_ENDPOINTS.INVENTORY.BASE,
        data
      );

      return response.data.data.item;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw createApiError(error, 'Failed to create inventory item');
    }
  }

  /**
   * Update inventory item
   */
  async updateInventoryItem(id: string, data: UpdateInventoryItemRequest): Promise<InventoryItem> {
    try {
      if (!id) throw new Error('Inventory item ID is required');

      const response = await this.client.put<ApiResponse<{ item: InventoryItem }>>(
        API_ENDPOINTS.INVENTORY.BY_ID(id),
        data
      );

      return response.data.data.item;
    } catch (error) {
      throw createApiError(error, 'Failed to update inventory item');
    }
  }

  /**
   * Delete inventory item (soft delete)
   */
  async deleteInventoryItem(id: string): Promise<{ success: boolean }> {
    try {
      if (!id) throw new Error('Inventory item ID is required');

      const response = await this.client.delete<ApiResponse<{ item: InventoryItem }>>(
        API_ENDPOINTS.INVENTORY.BY_ID(id)
      );

      return { success: true };
    } catch (error) {
      throw createApiError(error, 'Failed to delete inventory item');
    }
  }

  /**
   * Create inventory transaction (purchase, usage, disposal, etc.)
   */
  async createTransaction(data: CreateInventoryTransactionRequest): Promise<InventoryTransaction> {
    try {
      createTransactionSchema.parse(data);

      const response = await this.client.post<ApiResponse<{ transaction: InventoryTransaction }>>(
        API_ENDPOINTS.INVENTORY.TRANSACTIONS,
        data
      );

      return response.data.data.transaction;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw createApiError(error, 'Failed to create inventory transaction');
    }
  }

  /**
   * Get current stock level for an item
   */
  async getCurrentStock(id: string): Promise<number> {
    try {
      if (!id) throw new Error('Inventory item ID is required');

      const response = await this.client.get<ApiResponse<{ currentStock: number }>>(
        API_ENDPOINTS.INVENTORY.STOCK(id)
      );

      return response.data.data.currentStock;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch current stock');
    }
  }

  /**
   * Adjust stock with audit trail
   */
  async adjustStock(id: string, data: StockAdjustmentRequest): Promise<StockAdjustmentResponse> {
    try {
      if (!id) throw new Error('Inventory item ID is required');
      stockAdjustmentSchema.parse(data);

      const response = await this.client.post<ApiResponse<StockAdjustmentResponse>>(
        API_ENDPOINTS.INVENTORY.ADJUST(id),
        data
      );

      return response.data.data;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw createApiError(error, 'Failed to adjust stock');
    }
  }

  /**
   * Get stock history for an item with pagination
   */
  async getStockHistory(id: string, page: number = 1, limit: number = 50): Promise<StockHistoryResponse> {
    try {
      if (!id) throw new Error('Inventory item ID is required');

      const response = await this.client.get<ApiResponse<StockHistoryResponse>>(
        `${API_ENDPOINTS.INVENTORY.HISTORY(id)}?page=${page}&limit=${limit}`
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch stock history');
    }
  }

  /**
   * Get inventory alerts (low stock, expiration, maintenance due)
   */
  async getInventoryAlerts(): Promise<InventoryAlert[]> {
    try {
      const response = await this.client.get<ApiResponse<{ alerts: InventoryAlert[] }>>(
        API_ENDPOINTS.INVENTORY.ALERTS
      );

      return response.data.data.alerts;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch inventory alerts');
    }
  }

  /**
   * Create maintenance log for an item
   */
  async createMaintenanceLog(data: CreateMaintenanceLogRequest): Promise<MaintenanceLog> {
    try {
      createMaintenanceLogSchema.parse(data);

      const response = await this.client.post<ApiResponse<{ maintenanceLog: MaintenanceLog }>>(
        API_ENDPOINTS.INVENTORY.MAINTENANCE,
        data
      );

      return response.data.data.maintenanceLog;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw createApiError(error, 'Failed to create maintenance log');
    }
  }

  /**
   * Get maintenance schedule for a date range
   */
  async getMaintenanceSchedule(params: MaintenanceScheduleParams = {}): Promise<MaintenanceLog[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);

      const response = await this.client.get<ApiResponse<{ schedule: MaintenanceLog[] }>>(
        `${API_ENDPOINTS.INVENTORY.MAINTENANCE_SCHEDULE}?${queryParams.toString()}`
      );

      return response.data.data.schedule;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch maintenance schedule');
    }
  }

  /**
   * Get inventory valuation by category
   */
  async getInventoryValuation(): Promise<InventoryValuationResponse[]> {
    try {
      const response = await this.client.get<ApiResponse<{ valuation: InventoryValuationResponse[] }>>(
        API_ENDPOINTS.INVENTORY.VALUATION
      );

      return response.data.data.valuation;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch inventory valuation');
    }
  }

  /**
   * Get usage analytics for date range
   */
  async getUsageAnalytics(params: UsageAnalyticsParams): Promise<UsageAnalyticsResponse[]> {
    try {
      const queryParams = new URLSearchParams({
        startDate: params.startDate,
        endDate: params.endDate,
      });

      const response = await this.client.get<ApiResponse<{ analytics: UsageAnalyticsResponse[] }>>(
        `${API_ENDPOINTS.INVENTORY.USAGE_ANALYTICS}?${queryParams.toString()}`
      );

      return response.data.data.analytics;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch usage analytics');
    }
  }

  /**
   * Get supplier performance metrics
   */
  async getSupplierPerformance(): Promise<SupplierPerformanceResponse[]> {
    try {
      const response = await this.client.get<ApiResponse<{ performance: SupplierPerformanceResponse[] }>>(
        API_ENDPOINTS.INVENTORY.SUPPLIER_PERFORMANCE
      );

      return response.data.data.performance;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch supplier performance');
    }
  }

  /**
   * Search inventory items
   */
  async searchInventoryItems(query: string, limit: number = 20): Promise<InventoryItem[]> {
    try {
      if (!query) throw new Error('Search query is required');

      const response = await this.client.get<ApiResponse<{ items: InventoryItem[] }>>(
        `${API_ENDPOINTS.INVENTORY.SEARCH(query)}?limit=${limit}`
      );

      return response.data.data.items;
    } catch (error) {
      throw createApiError(error, 'Failed to search inventory items');
    }
  }

  /**
   * Get comprehensive inventory statistics
   */
  async getInventoryStats(): Promise<InventoryStatsResponse> {
    try {
      const response = await this.client.get<ApiResponse<InventoryStatsResponse>>(
        API_ENDPOINTS.INVENTORY.STATS
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch inventory statistics');
    }
  }

  /**
   * Generate purchase order for low stock items
   */
  async generatePurchaseOrder(data: GeneratePurchaseOrderRequest): Promise<GeneratedPurchaseOrder> {
    try {
      const response = await this.client.post<ApiResponse<{ purchaseOrder: GeneratedPurchaseOrder }>>(
        API_ENDPOINTS.INVENTORY.PURCHASE_ORDER,
        data
      );

      return response.data.data.purchaseOrder;
    } catch (error) {
      throw createApiError(error, 'Failed to generate purchase order');
    }
  }

  // =====================
  // VENDOR MANAGEMENT
  // =====================

  /**
   * Get all vendors
   */
  async getVendors(isActive?: boolean): Promise<Vendor[]> {
    try {
      const params = new URLSearchParams();
      if (isActive !== undefined) params.append('isActive', String(isActive));

      const response = await this.client.get<ApiResponse<{ vendors: Vendor[] }>>(
        `${API_ENDPOINTS.INVENTORY.VENDORS}?${params.toString()}`
      );

      return response.data.data.vendors;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch vendors');
    }
  }

  /**
   * Create new vendor
   */
  async createVendor(data: CreateVendorRequest): Promise<Vendor> {
    try {
      createVendorSchema.parse(data);

      const response = await this.client.post<ApiResponse<{ vendor: Vendor }>>(
        API_ENDPOINTS.INVENTORY.VENDORS,
        data
      );

      return response.data.data.vendor;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw createApiError(error, 'Failed to create vendor');
    }
  }

  /**
   * Update vendor
   */
  async updateVendor(id: string, data: Partial<CreateVendorRequest>): Promise<Vendor> {
    try {
      if (!id) throw new Error('Vendor ID is required');

      const response = await this.client.put<ApiResponse<{ vendor: Vendor }>>(
        API_ENDPOINTS.INVENTORY.VENDOR_BY_ID(id),
        data
      );

      return response.data.data.vendor;
    } catch (error) {
      throw createApiError(error, 'Failed to update vendor');
    }
  }

  // =====================
  // PURCHASE ORDER MANAGEMENT
  // =====================

  /**
   * Get purchase orders with optional filters
   */
  async getPurchaseOrders(status?: PurchaseOrderStatus, vendorId?: string): Promise<PurchaseOrder[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (vendorId) params.append('vendorId', vendorId);

      const response = await this.client.get<ApiResponse<{ purchaseOrders: PurchaseOrder[] }>>(
        `${API_ENDPOINTS.INVENTORY.PURCHASE_ORDERS}?${params.toString()}`
      );

      return response.data.data.purchaseOrders;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch purchase orders');
    }
  }

  /**
   * Create purchase order
   */
  async createPurchaseOrder(data: CreatePurchaseOrderRequest): Promise<PurchaseOrder> {
    try {
      createPurchaseOrderSchema.parse(data);

      const response = await this.client.post<ApiResponse<{ purchaseOrder: PurchaseOrder }>>(
        API_ENDPOINTS.INVENTORY.PURCHASE_ORDERS,
        data
      );

      return response.data.data.purchaseOrder;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw createApiError(error, 'Failed to create purchase order');
    }
  }

  /**
   * Update purchase order status
   */
  async updatePurchaseOrderStatus(
    id: string,
    status: PurchaseOrderStatus,
    receivedDate?: string
  ): Promise<PurchaseOrder> {
    try {
      if (!id) throw new Error('Purchase order ID is required');

      const response = await this.client.put<ApiResponse<{ purchaseOrder: PurchaseOrder }>>(
        API_ENDPOINTS.INVENTORY.PURCHASE_ORDER_BY_ID(id),
        { status, receivedDate }
      );

      return response.data.data.purchaseOrder;
    } catch (error) {
      throw createApiError(error, 'Failed to update purchase order status');
    }
  }
}

// Export factory function
export function createInventoryApi(client: ApiClient): InventoryApi {
  return new InventoryApi(client);
}
