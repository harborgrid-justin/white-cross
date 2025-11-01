/**
 * Complete Inventory Management API
 *
 * Enterprise-grade API client with 100% backend coverage including:
 * - Complete CRUD operations
 * - Stock management (adjustments, transfers)
 * - Supplier/vendor management
 * - Purchase order tracking
 * - Low stock & expiration alerts
 * - Usage analytics and cost analysis
 * - Maintenance tracking
 *
 * @module services/modules/inventoryApi
 */

import type { ApiClient } from '../core/ApiClient';
import { apiClient } from '../core/ApiClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../types';
import { z } from 'zod';
import { createApiError, createValidationError } from '../core/errors';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  sku?: string;
  supplier?: string;
  unitCost: number;
  currentStock: number;
  reorderLevel: number;
  reorderQuantity: number;
  location?: string;
  locationId?: string;
  notes?: string;
  isActive: boolean;
  lastRestockDate?: string;
  expirationDate?: string;
  batchNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryTransaction {
  id: string;
  inventoryItemId: string;
  type: TransactionType;
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  balanceAfter: number;
  reason?: string;
  batchNumber?: string;
  expirationDate?: string;
  fromLocation?: string;
  toLocation?: string;
  purchaseOrderId?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export type TransactionType =
  | 'PURCHASE'
  | 'USAGE'
  | 'ADJUSTMENT'
  | 'TRANSFER'
  | 'DISPOSAL'
  | 'RETURN'
  | 'LOSS'
  | 'DAMAGE';

export interface MaintenanceLog {
  id: string;
  inventoryItemId: string;
  type: MaintenanceType;
  description: string;
  cost?: number;
  performedDate: string;
  nextMaintenanceDate?: string;
  vendor?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export type MaintenanceType =
  | 'ROUTINE'
  | 'REPAIR'
  | 'CALIBRATION'
  | 'INSPECTION'
  | 'CLEANING'
  | 'REPLACEMENT';

export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  taxId?: string;
  paymentTerms?: string;
  rating?: number;
  isPreferred: boolean;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplier?: Supplier;
  orderDate: string;
  expectedDate?: string;
  receivedDate?: string;
  status: PurchaseOrderStatus;
  totalAmount: number;
  notes?: string;
  items: PurchaseOrderItem[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type PurchaseOrderStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'APPROVED'
  | 'ORDERED'
  | 'RECEIVED'
  | 'CANCELLED';

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  inventoryItemId: string;
  inventoryItem?: InventoryItem;
  quantity: number;
  unitCost: number;
  totalCost: number;
  receivedQuantity?: number;
}

export interface InventoryAlert {
  id: string;
  type: AlertType;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  inventoryItemId: string;
  inventoryItem?: InventoryItem;
  message: string;
  threshold?: number;
  currentValue?: number;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  createdAt: string;
}

export type AlertType =
  | 'LOW_STOCK'
  | 'EXPIRING_SOON'
  | 'EXPIRED'
  | 'MAINTENANCE_DUE'
  | 'OVER_STOCK'
  | 'NO_STOCK';

// Stock Transfer Types
export interface StockTransfer {
  id: string;
  inventoryItemId: string;
  fromLocation: string;
  fromLocationId?: string;
  toLocation: string;
  toLocationId?: string;
  quantity: number;
  reason: string;
  status: TransferStatus;
  requestedBy: string;
  approvedBy?: string;
  completedBy?: string;
  requestedAt: string;
  approvedAt?: string;
  completedAt?: string;
  notes?: string;
}

export type TransferStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'IN_TRANSIT'
  | 'COMPLETED'
  | 'CANCELLED';

export interface StockTransferCreate {
  inventoryItemId: string;
  fromLocation: string;
  toLocation: string;
  quantity: number;
  reason: string;
  notes?: string;
}

// Low Stock & Expiring Items
export interface LowStockItem {
  item: InventoryItem;
  currentStock: number;
  reorderLevel: number;
  reorderQuantity: number;
  deficit: number;
  lastUsageDate?: string;
  averageDailyUsage?: number;
  daysUntilStockout?: number;
  suggestedOrderQuantity: number;
}

export interface ExpiringItem {
  item: InventoryItem;
  expirationDate: string;
  daysUntilExpiration: number;
  currentStock: number;
  estimatedValue: number;
  severity: 'EXPIRED' | 'CRITICAL' | 'WARNING' | 'INFO';
  batchNumber?: string;
}

// Cost Analysis Types
export interface CostAnalysis {
  totalInventoryValue: number;
  categoryBreakdown: Array<{
    category: string;
    value: number;
    itemCount: number;
    percentage: number;
  }>;
  supplierBreakdown: Array<{
    supplier: string;
    totalSpend: number;
    orderCount: number;
    averageOrderValue: number;
  }>;
  monthlySpend: Array<{
    month: string;
    purchases: number;
    usage: number;
    waste: number;
    netChange: number;
  }>;
  optimization: {
    overStockedItems: Array<{
      itemId: string;
      itemName: string;
      currentStock: number;
      optimalStock: number;
      excessValue: number;
    }>;
    underStockedItems: Array<{
      itemId: string;
      itemName: string;
      currentStock: number;
      optimalStock: number;
      deficitValue: number;
    }>;
    slowMovingItems: Array<{
      itemId: string;
      itemName: string;
      lastUsageDate: string;
      daysInactive: number;
      currentValue: number;
    }>;
    potentialSavings: number;
  };
  metrics: {
    inventoryTurnoverRatio: number;
    daysInventoryOutstanding: number;
    carryingCost: number;
    stockoutRate: number;
    wastePercentage: number;
  };
}

export interface UsageTrend {
  itemId: string;
  itemName: string;
  category: string;
  period: string;
  dataPoints: Array<{
    date: string;
    usage: number;
    purchases: number;
    stockLevel: number;
  }>;
  averageUsage: number;
  trendDirection: 'INCREASING' | 'STABLE' | 'DECREASING';
  seasonalPattern: boolean;
  forecast: Array<{
    date: string;
    predictedUsage: number;
    confidence: number;
  }>;
}

// Request/Response Types
export interface InventoryFilters extends PaginationParams {
  category?: string;
  supplier?: string;
  location?: string;
  lowStock?: boolean;
  needsMaintenance?: boolean;
  isActive?: boolean;
  search?: string;
}

export interface CreateInventoryItemRequest {
  name: string;
  category: string;
  description?: string;
  sku?: string;
  supplier?: string;
  unitCost: number;
  initialStock?: number;
  reorderLevel: number;
  reorderQuantity: number;
  location?: string;
  notes?: string;
}

export interface UpdateInventoryItemRequest {
  name?: string;
  category?: string;
  description?: string;
  sku?: string;
  supplier?: string;
  unitCost?: number;
  reorderLevel?: number;
  reorderQuantity?: number;
  location?: string;
  notes?: string;
  isActive?: boolean;
}

export interface StockAdjustmentRequest {
  quantity: number;
  reason: string;
  notes?: string;
}

export interface StockAdjustmentResponse {
  transaction: InventoryTransaction;
  newStock: number;
  previousStock: number;
}

export interface CreateSupplierRequest {
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  taxId?: string;
  paymentTerms?: string;
  rating?: number;
  isPreferred?: boolean;
  notes?: string;
}

export interface CreatePurchaseOrderRequest {
  orderNumber: string;
  supplierId: string;
  orderDate: string;
  expectedDate?: string;
  notes?: string;
  items: Array<{
    inventoryItemId: string;
    quantity: number;
    unitCost: number;
  }>;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const createInventoryItemSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(255),
  category: z.string().min(1, 'Category is required').max(100),
  description: z.string().max(5000).optional(),
  sku: z.string().max(50).optional(),
  supplier: z.string().max(255).optional(),
  unitCost: z.number().nonnegative('Unit cost must be non-negative').max(99999999.99),
  initialStock: z.number().int().nonnegative().optional(),
  reorderLevel: z.number().int().nonnegative().max(1000000),
  reorderQuantity: z.number().int().positive().max(1000000),
  location: z.string().max(255).optional(),
  notes: z.string().max(10000).optional(),
});

const stockAdjustmentSchema = z.object({
  quantity: z.number().int().refine((val) => val !== 0, 'Quantity cannot be zero'),
  reason: z.string().min(1, 'Reason is required').max(5000),
  notes: z.string().max(10000).optional(),
});

const stockTransferSchema = z.object({
  inventoryItemId: z.string().uuid('Invalid inventory item ID'),
  fromLocation: z.string().min(1, 'From location is required').max(255),
  toLocation: z.string().min(1, 'To location is required').max(255),
  quantity: z.number().int().positive('Quantity must be positive').max(1000000),
  reason: z.string().min(1, 'Reason is required').max(5000),
  notes: z.string().max(10000).optional(),
}).refine((data) => data.fromLocation !== data.toLocation, {
  message: 'From and To locations must be different',
  path: ['toLocation']
});

const createSupplierSchema = z.object({
  name: z.string().min(1, 'Supplier name is required').max(255),
  contactName: z.string().max(255).optional(),
  email: z.string().email('Must be a valid email').max(255).optional().or(z.literal('')),
  phone: z.string().max(50).optional(),
  address: z.string().max(1000).optional(),
  website: z.string().url('Must be a valid URL').max(255).optional().or(z.literal('')),
  taxId: z.string().max(50).optional(),
  paymentTerms: z.string().max(255).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  isPreferred: z.boolean().optional(),
  notes: z.string().max(10000).optional(),
});

const createPurchaseOrderSchema = z.object({
  orderNumber: z.string().min(1, 'Order number is required').max(50),
  supplierId: z.string().uuid('Invalid supplier ID'),
  orderDate: z.string().min(1, 'Order date is required'),
  expectedDate: z.string().optional(),
  notes: z.string().max(10000).optional(),
  items: z.array(z.object({
    inventoryItemId: z.string().uuid('Invalid inventory item ID'),
    quantity: z.number().int().positive('Quantity must be positive').max(1000000),
    unitCost: z.number().nonnegative('Unit cost must be non-negative').max(99999999.99),
  })).min(1, 'At least one item is required'),
});

// ==========================================
// API CLIENT CLASS
// ==========================================

export class InventoryApi {
  private readonly baseEndpoint = API_ENDPOINTS.INVENTORY.BASE;

  constructor(private readonly client: ApiClient) {}

  // ==========================================
  // INVENTORY ITEMS OPERATIONS
  // ==========================================

  /**
   * Get all inventory items with filtering and pagination
   */
  async getInventoryItems(filters: InventoryFilters = {}): Promise<PaginatedResponse<InventoryItem>> {
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
      if (filters.search) params.append('search', filters.search);

      const response = await this.client.get<ApiResponse<PaginatedResponse<InventoryItem>>>(
        `${this.baseEndpoint}?${params.toString()}`
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch inventory items');
    }
  }

  /**
   * Get single inventory item by ID
   */
  async getInventoryItem(id: string): Promise<InventoryItem> {
    try {
      if (!id) throw new Error('Inventory item ID is required');

      const response = await this.client.get<ApiResponse<InventoryItem>>(
        `${this.baseEndpoint}/${id}`
      );

      return response.data.data!;
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

      const response = await this.client.post<ApiResponse<InventoryItem>>(
        this.baseEndpoint,
        data
      );

      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.errors[0]?.message || 'Validation error',
          error.errors[0]?.path.join('.'),
          error.errors.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
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

      const response = await this.client.put<ApiResponse<InventoryItem>>(
        `${this.baseEndpoint}/${id}`,
        data
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to update inventory item');
    }
  }

  /**
   * Delete inventory item (soft delete)
   */
  async deleteInventoryItem(id: string): Promise<void> {
    try {
      if (!id) throw new Error('Inventory item ID is required');

      await this.client.delete(`${this.baseEndpoint}/${id}`);
    } catch (error) {
      throw createApiError(error, 'Failed to delete inventory item');
    }
  }

  /**
   * Search inventory items
   */
  async searchInventoryItems(query: string, limit: number = 20): Promise<InventoryItem[]> {
    try {
      if (!query) throw new Error('Search query is required');

      const response = await this.client.get<ApiResponse<{ items: InventoryItem[] }>>(
        `${this.baseEndpoint}/search?query=${encodeURIComponent(query)}&limit=${limit}`
      );

      return response.data.data!.items;
    } catch (error) {
      throw createApiError(error, 'Failed to search inventory items');
    }
  }

  // ==========================================
  // STOCK MANAGEMENT OPERATIONS
  // ==========================================

  /**
   * Get current stock level for an item
   */
  async getCurrentStock(id: string): Promise<number> {
    try {
      if (!id) throw new Error('Inventory item ID is required');

      const response = await this.client.get<ApiResponse<{ currentStock: number }>>(
        `${this.baseEndpoint}/${id}/stock`
      );

      return response.data.data!.currentStock;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch current stock');
    }
  }

  /**
   * Adjust stock with audit trail (manual corrections, loss, damage)
   */
  async adjustStock(id: string, data: StockAdjustmentRequest): Promise<StockAdjustmentResponse> {
    try {
      if (!id) throw new Error('Inventory item ID is required');
      stockAdjustmentSchema.parse(data);

      const response = await this.client.post<ApiResponse<StockAdjustmentResponse>>(
        `${this.baseEndpoint}/${id}/adjust`,
        data
      );

      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.errors[0]?.message || 'Validation error',
          error.errors[0]?.path.join('.'),
          error.errors.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to adjust stock');
    }
  }

  /**
   * Transfer stock between locations
   */
  async transferStock(data: StockTransferCreate): Promise<StockTransfer> {
    try {
      stockTransferSchema.parse(data);

      const response = await this.client.post<ApiResponse<StockTransfer>>(
        `${this.baseEndpoint}/stock/transfer`,
        data
      );

      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.errors[0]?.message || 'Validation error',
          error.errors[0]?.path.join('.'),
          error.errors.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to transfer stock');
    }
  }

  /**
   * Get stock transfer history
   */
  async getStockTransfers(filters?: {
    inventoryItemId?: string;
    fromLocation?: string;
    toLocation?: string;
    status?: TransferStatus;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<StockTransfer>> {
    try {
      const params = new URLSearchParams();
      if (filters?.inventoryItemId) params.append('inventoryItemId', filters.inventoryItemId);
      if (filters?.fromLocation) params.append('fromLocation', filters.fromLocation);
      if (filters?.toLocation) params.append('toLocation', filters.toLocation);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));

      const response = await this.client.get<ApiResponse<PaginatedResponse<StockTransfer>>>(
        `${this.baseEndpoint}/stock/transfers?${params.toString()}`
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch stock transfers');
    }
  }

  /**
   * Approve stock transfer
   */
  async approveStockTransfer(transferId: string, approvedBy: string): Promise<StockTransfer> {
    try {
      if (!transferId) throw new Error('Transfer ID is required');

      const response = await this.client.post<ApiResponse<StockTransfer>>(
        `${this.baseEndpoint}/stock/transfers/${transferId}/approve`,
        { approvedBy }
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to approve stock transfer');
    }
  }

  /**
   * Complete stock transfer
   */
  async completeStockTransfer(transferId: string, completedBy: string): Promise<StockTransfer> {
    try {
      if (!transferId) throw new Error('Transfer ID is required');

      const response = await this.client.post<ApiResponse<StockTransfer>>(
        `${this.baseEndpoint}/stock/transfers/${transferId}/complete`,
        { completedBy }
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to complete stock transfer');
    }
  }

  /**
   * Get low stock items
   */
  async getLowStockItems(): Promise<LowStockItem[]> {
    try {
      const response = await this.client.get<ApiResponse<{ items: LowStockItem[] }>>(
        `${this.baseEndpoint}/stock/low`
      );

      return response.data.data!.items;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch low stock items');
    }
  }

  /**
   * Get expiring items
   */
  async getExpiringItems(daysAhead: number = 30): Promise<ExpiringItem[]> {
    try {
      const response = await this.client.get<ApiResponse<{ items: ExpiringItem[] }>>(
        `${this.baseEndpoint}/stock/expiring?daysAhead=${daysAhead}`
      );

      return response.data.data!.items;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch expiring items');
    }
  }

  /**
   * Get stock history for an item
   */
  async getStockHistory(id: string, page: number = 1, limit: number = 50): Promise<PaginatedResponse<InventoryTransaction>> {
    try {
      if (!id) throw new Error('Inventory item ID is required');

      const response = await this.client.get<ApiResponse<PaginatedResponse<InventoryTransaction>>>(
        `${this.baseEndpoint}/${id}/history?page=${page}&limit=${limit}`
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch stock history');
    }
  }

  // ==========================================
  // TRANSACTIONS OPERATIONS
  // ==========================================

  /**
   * Create inventory transaction
   */
  async createTransaction(data: {
    inventoryItemId: string;
    type: TransactionType;
    quantity: number;
    unitCost?: number;
    reason?: string;
    batchNumber?: string;
    expirationDate?: string;
    notes?: string;
  }): Promise<InventoryTransaction> {
    try {
      const response = await this.client.post<ApiResponse<InventoryTransaction>>(
        `${this.baseEndpoint}/transactions`,
        data
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to create inventory transaction');
    }
  }

  /**
   * Get all transactions with filters
   */
  async getTransactions(filters?: {
    inventoryItemId?: string;
    type?: TransactionType;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<InventoryTransaction>> {
    try {
      const params = new URLSearchParams();
      if (filters?.inventoryItemId) params.append('inventoryItemId', filters.inventoryItemId);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));

      const response = await this.client.get<ApiResponse<PaginatedResponse<InventoryTransaction>>>(
        `${this.baseEndpoint}/transactions?${params.toString()}`
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch transactions');
    }
  }

  // ==========================================
  // SUPPLIER MANAGEMENT
  // ==========================================

  /**
   * Get all suppliers
   */
  async getSuppliers(isActive?: boolean): Promise<Supplier[]> {
    try {
      const params = new URLSearchParams();
      if (isActive !== undefined) params.append('isActive', String(isActive));

      const response = await this.client.get<ApiResponse<{ suppliers: Supplier[] }>>(
        `${this.baseEndpoint}/suppliers?${params.toString()}`
      );

      return response.data.data!.suppliers;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch suppliers');
    }
  }

  /**
   * Get supplier by ID
   */
  async getSupplier(id: string): Promise<Supplier> {
    try {
      if (!id) throw new Error('Supplier ID is required');

      const response = await this.client.get<ApiResponse<Supplier>>(
        `${this.baseEndpoint}/suppliers/${id}`
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch supplier');
    }
  }

  /**
   * Create new supplier
   */
  async createSupplier(data: CreateSupplierRequest): Promise<Supplier> {
    try {
      createSupplierSchema.parse(data);

      const response = await this.client.post<ApiResponse<Supplier>>(
        `${this.baseEndpoint}/suppliers`,
        data
      );

      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.errors[0]?.message || 'Validation error',
          error.errors[0]?.path.join('.'),
          error.errors.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to create supplier');
    }
  }

  /**
   * Update supplier
   */
  async updateSupplier(id: string, data: Partial<CreateSupplierRequest>): Promise<Supplier> {
    try {
      if (!id) throw new Error('Supplier ID is required');

      const response = await this.client.put<ApiResponse<Supplier>>(
        `${this.baseEndpoint}/suppliers/${id}`,
        data
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to update supplier');
    }
  }

  /**
   * Delete supplier (soft delete)
   */
  async deleteSupplier(id: string): Promise<void> {
    try {
      if (!id) throw new Error('Supplier ID is required');

      await this.client.delete(`${this.baseEndpoint}/suppliers/${id}`);
    } catch (error) {
      throw createApiError(error, 'Failed to delete supplier');
    }
  }

  /**
   * Get supplier performance metrics
   */
  async getSupplierPerformance(supplierId?: string): Promise<Array<{
    supplier: Supplier;
    totalOrders: number;
    totalSpend: number;
    averageDeliveryTime: number;
    onTimeDeliveryRate: number;
    qualityRating: number;
    lastOrderDate?: string;
  }>> {
    try {
      const params = supplierId ? `?supplierId=${supplierId}` : '';

      const response = await this.client.get<ApiResponse<{ performance: any[] }>>(
        `${this.baseEndpoint}/suppliers/performance${params}`
      );

      return response.data.data!.performance;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch supplier performance');
    }
  }

  // ==========================================
  // PURCHASE ORDER MANAGEMENT
  // ==========================================

  /**
   * Get purchase orders with optional filters
   */
  async getPurchaseOrders(filters?: {
    status?: PurchaseOrderStatus;
    supplierId?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<PurchaseOrder>> {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.supplierId) params.append('supplierId', filters.supplierId);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));

      const response = await this.client.get<ApiResponse<PaginatedResponse<PurchaseOrder>>>(
        `${this.baseEndpoint}/purchase-orders?${params.toString()}`
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch purchase orders');
    }
  }

  /**
   * Get purchase order by ID
   */
  async getPurchaseOrder(id: string): Promise<PurchaseOrder> {
    try {
      if (!id) throw new Error('Purchase order ID is required');

      const response = await this.client.get<ApiResponse<PurchaseOrder>>(
        `${this.baseEndpoint}/purchase-orders/${id}`
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch purchase order');
    }
  }

  /**
   * Create purchase order
   */
  async createPurchaseOrder(data: CreatePurchaseOrderRequest): Promise<PurchaseOrder> {
    try {
      createPurchaseOrderSchema.parse(data);

      const response = await this.client.post<ApiResponse<PurchaseOrder>>(
        `${this.baseEndpoint}/purchase-orders`,
        data
      );

      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.errors[0]?.message || 'Validation error',
          error.errors[0]?.path.join('.'),
          error.errors.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
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

      const response = await this.client.put<ApiResponse<PurchaseOrder>>(
        `${this.baseEndpoint}/purchase-orders/${id}/status`,
        { status, receivedDate }
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to update purchase order status');
    }
  }

  /**
   * Generate purchase order for low stock items
   */
  async generatePurchaseOrder(supplierId: string): Promise<PurchaseOrder> {
    try {
      if (!supplierId) throw new Error('Supplier ID is required');

      const response = await this.client.post<ApiResponse<PurchaseOrder>>(
        `${this.baseEndpoint}/purchase-orders/generate`,
        { supplierId }
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to generate purchase order');
    }
  }

  // ==========================================
  // MAINTENANCE OPERATIONS
  // ==========================================

  /**
   * Create maintenance log
   */
  async createMaintenanceLog(data: {
    inventoryItemId: string;
    type: MaintenanceType;
    description: string;
    cost?: number;
    performedDate: string;
    nextMaintenanceDate?: string;
    vendor?: string;
    notes?: string;
  }): Promise<MaintenanceLog> {
    try {
      const response = await this.client.post<ApiResponse<MaintenanceLog>>(
        `${this.baseEndpoint}/maintenance`,
        data
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to create maintenance log');
    }
  }

  /**
   * Get maintenance schedule
   */
  async getMaintenanceSchedule(filters?: {
    startDate?: string;
    endDate?: string;
    inventoryItemId?: string;
  }): Promise<MaintenanceLog[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.inventoryItemId) params.append('inventoryItemId', filters.inventoryItemId);

      const response = await this.client.get<ApiResponse<{ schedule: MaintenanceLog[] }>>(
        `${this.baseEndpoint}/maintenance/schedule?${params.toString()}`
      );

      return response.data.data!.schedule;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch maintenance schedule');
    }
  }

  // ==========================================
  // ALERTS OPERATIONS
  // ==========================================

  /**
   * Get inventory alerts
   */
  async getInventoryAlerts(filters?: {
    type?: AlertType;
    severity?: 'INFO' | 'WARNING' | 'CRITICAL';
    acknowledged?: boolean;
  }): Promise<InventoryAlert[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.severity) params.append('severity', filters.severity);
      if (filters?.acknowledged !== undefined) params.append('acknowledged', String(filters.acknowledged));

      const response = await this.client.get<ApiResponse<{ alerts: InventoryAlert[] }>>(
        `${this.baseEndpoint}/alerts?${params.toString()}`
      );

      return response.data.data!.alerts;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch inventory alerts');
    }
  }

  /**
   * Acknowledge alert
   */
  async acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<InventoryAlert> {
    try {
      if (!alertId) throw new Error('Alert ID is required');

      const response = await this.client.post<ApiResponse<InventoryAlert>>(
        `${this.baseEndpoint}/alerts/${alertId}/acknowledge`,
        { acknowledgedBy }
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to acknowledge alert');
    }
  }

  // ==========================================
  // ANALYTICS OPERATIONS
  // ==========================================

  /**
   * Get inventory valuation by category
   */
  async getInventoryValuation(): Promise<Array<{
    category: string;
    itemCount: number;
    totalValue: number;
    averageValue: number;
  }>> {
    try {
      const response = await this.client.get<ApiResponse<{ valuation: any[] }>>(
        `${this.baseEndpoint}/analytics/valuation`
      );

      return response.data.data!.valuation;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch inventory valuation');
    }
  }

  /**
   * Get usage trends and analytics
   */
  async getUsageAnalytics(filters: {
    startDate: string;
    endDate: string;
    category?: string;
    itemId?: string;
  }): Promise<UsageTrend[]> {
    try {
      const params = new URLSearchParams({
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
      if (filters.category) params.append('category', filters.category);
      if (filters.itemId) params.append('itemId', filters.itemId);

      const response = await this.client.get<ApiResponse<{ trends: UsageTrend[] }>>(
        `${this.baseEndpoint}/analytics/usage-trends?${params.toString()}`
      );

      return response.data.data!.trends;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch usage analytics');
    }
  }

  /**
   * Get comprehensive cost analysis and optimization recommendations
   */
  async getCostAnalysis(filters?: {
    startDate?: string;
    endDate?: string;
    category?: string;
  }): Promise<CostAnalysis> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.category) params.append('category', filters.category);

      const response = await this.client.get<ApiResponse<CostAnalysis>>(
        `${this.baseEndpoint}/analytics/cost-analysis?${params.toString()}`
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch cost analysis');
    }
  }

  /**
   * Get comprehensive inventory statistics
   */
  async getInventoryStats(): Promise<{
    totalItems: number;
    totalValue: number;
    lowStockCount: number;
    expiringCount: number;
    maintenanceDueCount: number;
    categoryBreakdown: Array<{ category: string; count: number; value: number }>;
    topUsedItems: Array<{ itemId: string; name: string; usageCount: number }>;
    recentTransactions: number;
  }> {
    try {
      const response = await this.client.get<ApiResponse<any>>(
        `${this.baseEndpoint}/statistics`
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch inventory statistics');
    }
  }

  // ==========================================
  // BULK OPERATIONS
  // ==========================================

  /**
   * Bulk import inventory items
   */
  async bulkImportItems(items: CreateInventoryItemRequest[]): Promise<{
    imported: number;
    failed: number;
    errors: Array<{ index: number; error: string; item: CreateInventoryItemRequest }>;
  }> {
    try {
      // Validate all items
      items.forEach((item, index) => {
        try {
          createInventoryItemSchema.parse(item);
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new Error(`Validation error at index ${index}: ${error.errors[0].message}`);
          }
        }
      });

      const response = await this.client.post<ApiResponse<any>>(
        `${this.baseEndpoint}/bulk-import`,
        { items }
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to bulk import items');
    }
  }

  /**
   * Export inventory to CSV/Excel
   */
  async exportInventory(format: 'csv' | 'excel' = 'csv', filters?: InventoryFilters): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      params.append('format', format);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.supplier) params.append('supplier', filters.supplier);
      if (filters?.location) params.append('location', filters.location);
      if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));

      const response = await this.client.get(
        `${this.baseEndpoint}/export?${params.toString()}`,
        { responseType: 'blob' }
      );

      return response.data;
    } catch (error) {
      throw createApiError(error, 'Failed to export inventory');
    }
  }
}

// ==========================================
// FACTORY FUNCTION
// ==========================================

export function createInventoryApi(client: ApiClient): InventoryApi {
  return new InventoryApi(client);
}

/**
 * Singleton instance of InventoryApi
 * Pre-configured with the default apiClient
 */
export const inventoryApi = createInventoryApi(apiClient);
