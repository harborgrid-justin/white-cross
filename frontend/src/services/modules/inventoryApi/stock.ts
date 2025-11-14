/**
 * Stock Management Operations for Inventory Management API
 *
 * Handles stock adjustments, transfers, tracking, and low stock/expiring items monitoring.
 * Provides comprehensive stock-level operations with audit trails.
 *
 * @module services/modules/inventoryApi/stock
 */

import type { ApiClient } from '../../core/ApiClient';
import type { ApiResponse, PaginatedResponse } from '../../types';
import type {
  InventoryTransaction,
  TransactionType,
  StockTransfer,
  StockTransferCreate,
  TransferStatus,
  StockAdjustmentRequest,
  StockAdjustmentResponse,
  LowStockItem,
  ExpiringItem,
} from './types';
import { stockAdjustmentSchema, stockTransferSchema } from './validation';
import { createApiError, createValidationError } from '../../core/errors';
import { API_ENDPOINTS } from '@/constants/api';
import { z } from 'zod';

/**
 * Stock Management API Operations
 */
export class StockManagementApi {
  private readonly baseEndpoint = API_ENDPOINTS.INVENTORY.BASE;

  constructor(private readonly client: ApiClient) {}

  // ==========================================
  // STOCK LEVEL OPERATIONS
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
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
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
  // STOCK TRANSFER OPERATIONS
  // ==========================================

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
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
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
   * Get single stock transfer by ID
   */
  async getStockTransfer(transferId: string): Promise<StockTransfer> {
    try {
      if (!transferId) throw new Error('Transfer ID is required');

      const response = await this.client.get<ApiResponse<StockTransfer>>(
        `${this.baseEndpoint}/stock/transfers/${transferId}`
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch stock transfer');
    }
  }

  /**
   * Approve stock transfer
   */
  async approveStockTransfer(transferId: string, approvedBy: string): Promise<StockTransfer> {
    try {
      if (!transferId) throw new Error('Transfer ID is required');
      if (!approvedBy) throw new Error('Approved by is required');

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
      if (!completedBy) throw new Error('Completed by is required');

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
   * Cancel stock transfer
   */
  async cancelStockTransfer(transferId: string, cancelledBy: string, reason?: string): Promise<StockTransfer> {
    try {
      if (!transferId) throw new Error('Transfer ID is required');
      if (!cancelledBy) throw new Error('Cancelled by is required');

      const response = await this.client.post<ApiResponse<StockTransfer>>(
        `${this.baseEndpoint}/stock/transfers/${transferId}/cancel`,
        { cancelledBy, reason }
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to cancel stock transfer');
    }
  }

  // ==========================================
  // LOW STOCK & EXPIRING ITEMS
  // ==========================================

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
   * Get out of stock items
   */
  async getOutOfStockItems(): Promise<Array<{
    item: {
      id: string;
      name: string;
      category: string;
      supplier?: string;
      reorderLevel: number;
      reorderQuantity: number;
    };
    lastStockDate?: string;
    estimatedRestockDate?: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }>> {
    try {
      const response = await this.client.get<ApiResponse<{ 
        items: Array<{
          item: {
            id: string;
            name: string;
            category: string;
            supplier?: string;
            reorderLevel: number;
            reorderQuantity: number;
          };
          lastStockDate?: string;
          estimatedRestockDate?: string;
          priority: 'HIGH' | 'MEDIUM' | 'LOW';
        }>
      }>>(
        `${this.baseEndpoint}/stock/out-of-stock`
      );

      return response.data.data!.items;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch out of stock items');
    }
  }

  // ==========================================
  // TRANSACTION OPERATIONS
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
      if (!data.inventoryItemId) throw new Error('Inventory item ID is required');
      if (!data.type) throw new Error('Transaction type is required');
      if (data.quantity === 0) throw new Error('Quantity cannot be zero');

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

  /**
   * Get transaction by ID
   */
  async getTransaction(transactionId: string): Promise<InventoryTransaction> {
    try {
      if (!transactionId) throw new Error('Transaction ID is required');

      const response = await this.client.get<ApiResponse<InventoryTransaction>>(
        `${this.baseEndpoint}/transactions/${transactionId}`
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch transaction');
    }
  }

  // ==========================================
  // BATCH OPERATIONS
  // ==========================================

  /**
   * Get batches for an item
   */
  async getItemBatches(itemId: string): Promise<Array<{
    batchNumber: string;
    quantity: number;
    expirationDate?: string;
    receivedDate: string;
    unitCost?: number;
    supplier?: string;
  }>> {
    try {
      if (!itemId) throw new Error('Item ID is required');

      const response = await this.client.get<ApiResponse<{ 
        batches: Array<{
          batchNumber: string;
          quantity: number;
          expirationDate?: string;
          receivedDate: string;
          unitCost?: number;
          supplier?: string;
        }>
      }>>(
        `${this.baseEndpoint}/${itemId}/batches`
      );

      return response.data.data!.batches;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch item batches');
    }
  }

  /**
   * Update batch information
   */
  async updateBatch(itemId: string, batchNumber: string, data: {
    quantity?: number;
    expirationDate?: string;
    notes?: string;
  }): Promise<{
    batchNumber: string;
    quantity: number;
    expirationDate?: string;
    notes?: string;
    updatedAt: string;
  }> {
    try {
      if (!itemId) throw new Error('Item ID is required');
      if (!batchNumber) throw new Error('Batch number is required');

      const response = await this.client.put<ApiResponse<{
        batchNumber: string;
        quantity: number;
        expirationDate?: string;
        notes?: string;
        updatedAt: string;
      }>>(
        `${this.baseEndpoint}/${itemId}/batches/${batchNumber}`,
        data
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to update batch');
    }
  }
}
