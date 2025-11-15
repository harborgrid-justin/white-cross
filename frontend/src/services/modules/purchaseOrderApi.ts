/**
 * @fileoverview Purchase Order API Client
 * @module services/modules/purchaseOrderApi
 * @category Services - Inventory Management
 *
 * @deprecated MIGRATION COMPLETE - Use purchase-orders.actions.ts instead
 * Server actions are available and recommended for all purchase order operations.
 *
 * MIGRATION STATUS:
 * - Purchase order CRUD -> Available in purchase-orders.actions.ts
 * - Approval workflow -> Available in purchase-orders.approvals.ts
 * - Receiving items -> Available in purchase-orders.status.ts
 * - Analytics/Dashboard -> Available in purchase-orders.dashboard.ts
 * - Form handling -> Available in purchase-orders.forms.ts
 * - RECOMMENDATION: Migrate all code to use purchase-orders.actions.ts
 * - Target deprecation date: March 2026
 *
 * WF-COMP-290 | Purchase Order API Client
 * Handles all purchase order operations including creation, approval workflow,
 * receiving, fulfillment, and order management.
 *
 * For new implementations, prefer @/lib/actions/purchase-orders.actions
 */

import type { ApiClient } from '@/services/core/ApiClient';
import { apiClient } from '@/services/core'; // Updated: Import from new centralized core
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '../utils/apiUtils';
import { z } from 'zod';
import { createApiError } from '../core/errors';
import {
  PurchaseOrder,
  PurchaseOrderFilters,
  CreatePurchaseOrderData,
  UpdatePurchaseOrderData,
  PurchaseOrdersResponse,
  PurchaseOrderDetailResponse,
  ReceiveItemsData,
  PurchaseOrderStatistics,
  ReorderItem,
  ReorderItemsResponse,
  VendorOrderHistory,
  VendorOrderHistoryResponse,
  ApproveOrderData,
  CancelOrderData,
  PurchaseOrderStatus,
} from '../../types/domain/purchaseOrders';

// =====================
// VALIDATION SCHEMAS
// =====================

const createOrderItemSchema = z.object({
  inventoryItemId: z.string().min(1, 'Inventory item is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(999999),
  unitCost: z.number().min(0.01, 'Unit cost must be greater than 0').max(999999.99),
  notes: z.string().optional(),
});

const createPurchaseOrderSchema = z.object({
  vendorId: z.string().min(1, 'Vendor is required'),
  items: z.array(createOrderItemSchema).min(1, 'At least one item is required').max(100),
  expectedDate: z.string().optional(),
  notes: z.string().optional(),
  tax: z.number().min(0).optional(),
  shipping: z.number().min(0).optional(),
});

const updatePurchaseOrderSchema = z.object({
  status: z.nativeEnum(PurchaseOrderStatus).optional(),
  expectedDate: z.string().optional(),
  receivedDate: z.string().optional(),
  notes: z.string().optional(),
  approvedBy: z.string().optional(),
  tax: z.number().min(0).optional(),
  shipping: z.number().min(0).optional(),
});

const receiveItemSchema = z.object({
  purchaseOrderItemId: z.string().min(1, 'Purchase order item ID is required'),
  receivedQty: z.number().min(1, 'Received quantity must be at least 1'),
  condition: z.enum(['GOOD', 'DAMAGED', 'INCOMPLETE']).optional(),
  notes: z.string().optional(),
});

const receiveItemsSchema = z.object({
  items: z.array(receiveItemSchema).min(1, 'At least one item is required'),
});

// =====================
// PURCHASE ORDER API CLASS
// =====================

export class PurchaseOrderApi {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Get all purchase orders with filtering and pagination
   */
  async getPurchaseOrders(filters: PurchaseOrderFilters = {}): Promise<PurchaseOrdersResponse> {
    try {
      const queryString = new URLSearchParams();

      if (filters.page) queryString.append('page', String(filters.page));
      if (filters.limit) queryString.append('limit', String(filters.limit));
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          filters.status.forEach((s) => queryString.append('status', s));
        } else {
          queryString.append('status', filters.status);
        }
      }
      if (filters.vendorId) queryString.append('vendorId', filters.vendorId);
      if (filters.startDate) {
        const date = typeof filters.startDate === 'string' ? filters.startDate : filters.startDate.toISOString();
        queryString.append('startDate', date);
      }
      if (filters.endDate) {
        const date = typeof filters.endDate === 'string' ? filters.endDate : filters.endDate.toISOString();
        queryString.append('endDate', date);
      }
      if (filters.search) queryString.append('search', filters.search);

      const url = queryString.toString()
        ? API_ENDPOINTS.PURCHASE_ORDERS.BASE + `?${queryString.toString()}`
        : API_ENDPOINTS.PURCHASE_ORDERS.BASE;

      const response = await this.client.get<ApiResponse<PurchaseOrdersResponse>>(url);

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch purchase orders');
    }
  }

  /**
   * Get purchase order by ID with full details
   */
  async getPurchaseOrderById(id: string): Promise<PurchaseOrder> {
    try {
      if (!id) throw new Error('Purchase order ID is required');

      const response = await this.client.get<ApiResponse<PurchaseOrderDetailResponse>>(
        API_ENDPOINTS.PURCHASE_ORDERS.BY_ID(id)
      );

      return response.data.data.order;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch purchase order');
    }
  }

  /**
   * Create new purchase order
   */
  async createPurchaseOrder(orderData: CreatePurchaseOrderData): Promise<PurchaseOrder> {
    try {
      // Validate data
      createPurchaseOrderSchema.parse(orderData);

      // Format dates if needed
      const formattedData = {
        ...orderData,
        expectedDate: orderData.expectedDate
          ? typeof orderData.expectedDate === 'string'
            ? orderData.expectedDate
            : orderData.expectedDate.toISOString()
          : undefined,
      };

      const response = await this.client.post<ApiResponse<{ order: PurchaseOrder }>>(
        API_ENDPOINTS.PURCHASE_ORDERS.BASE,
        formattedData
      );

      return response.data.data.order;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw createApiError(error, 'Failed to create purchase order');
    }
  }

  /**
   * Update purchase order
   */
  async updatePurchaseOrder(id: string, orderData: UpdatePurchaseOrderData): Promise<PurchaseOrder> {
    try {
      if (!id) throw new Error('Purchase order ID is required');

      // Validate data
      updatePurchaseOrderSchema.parse(orderData);

      // Format dates if needed
      const formattedData = {
        ...orderData,
        expectedDate: orderData.expectedDate
          ? typeof orderData.expectedDate === 'string'
            ? orderData.expectedDate
            : orderData.expectedDate.toISOString()
          : undefined,
        receivedDate: orderData.receivedDate
          ? typeof orderData.receivedDate === 'string'
            ? orderData.receivedDate
            : orderData.receivedDate.toISOString()
          : undefined,
      };

      const response = await this.client.put<ApiResponse<{ order: PurchaseOrder }>>(
        API_ENDPOINTS.PURCHASE_ORDERS.BY_ID(id),
        formattedData
      );

      return response.data.data.order;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw createApiError(error, 'Failed to update purchase order');
    }
  }

  /**
   * Approve purchase order
   */
  async approvePurchaseOrder(id: string, approvedBy: string): Promise<PurchaseOrder> {
    try {
      if (!id) throw new Error('Purchase order ID is required');
      if (!approvedBy) throw new Error('Approver ID is required');

      const response = await this.client.post<ApiResponse<{ order: PurchaseOrder }>>(
        API_ENDPOINTS.PURCHASE_ORDERS.APPROVE(id),
        { approvedBy }
      );

      return response.data.data.order;
    } catch (error) {
      throw createApiError(error, 'Failed to approve purchase order');
    }
  }

  /**
   * Receive items from purchase order
   */
  async receiveItems(id: string, data: ReceiveItemsData, performedBy: string): Promise<PurchaseOrder> {
    try {
      if (!id) throw new Error('Purchase order ID is required');
      if (!performedBy) throw new Error('Performer ID is required');

      // Validate data
      receiveItemsSchema.parse(data);

      const response = await this.client.post<ApiResponse<{ order: PurchaseOrder }>>(
        API_ENDPOINTS.PURCHASE_ORDERS.RECEIVE(id),
        data
      );

      return response.data.data.order;
    } catch (error) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw createApiError(error, 'Failed to receive items');
    }
  }

  /**
   * Cancel purchase order
   */
  async cancelPurchaseOrder(id: string, reason?: string): Promise<PurchaseOrder> {
    try {
      if (!id) throw new Error('Purchase order ID is required');

      const response = await this.client.post<ApiResponse<{ order: PurchaseOrder }>>(
        API_ENDPOINTS.PURCHASE_ORDERS.CANCEL(id),
        { reason }
      );

      return response.data.data.order;
    } catch (error) {
      throw createApiError(error, 'Failed to cancel purchase order');
    }
  }

  /**
   * Delete purchase order (only for PENDING orders)
   */
  async deletePurchaseOrder(id: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!id) throw new Error('Purchase order ID is required');

      const response = await this.client.delete<ApiResponse<{ success: boolean; message: string }>>(
        API_ENDPOINTS.PURCHASE_ORDERS.BY_ID(id)
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to delete purchase order');
    }
  }

  /**
   * Get items needing reorder based on stock levels
   */
  async getItemsNeedingReorder(): Promise<ReorderItem[]> {
    try {
      const response = await this.client.get<ApiResponse<ReorderItemsResponse>>(
        API_ENDPOINTS.PURCHASE_ORDERS.REORDER_NEEDED
      );

      return response.data.data.items;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch reorder items');
    }
  }

  /**
   * Get purchase order statistics
   */
  async getPurchaseOrderStatistics(): Promise<PurchaseOrderStatistics> {
    try {
      const response = await this.client.get<ApiResponse<PurchaseOrderStatistics>>(
        API_ENDPOINTS.PURCHASE_ORDERS.STATISTICS
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch statistics');
    }
  }

  /**
   * Get vendor purchase order history
   */
  async getVendorPurchaseHistory(vendorId: string, limit: number = 10): Promise<VendorOrderHistory> {
    try {
      if (!vendorId) throw new Error('Vendor ID is required');

      const response = await this.client.get<ApiResponse<VendorOrderHistoryResponse>>(
        API_ENDPOINTS.PURCHASE_ORDERS.VENDOR_HISTORY(vendorId) + `?limit=${limit}`
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch vendor purchase history');
    }
  }

  /**
   * Get pending purchase orders requiring approval
   */
  async getPendingOrders(): Promise<PurchaseOrder[]> {
    try {
      const response = await this.getPurchaseOrders({
        status: PurchaseOrderStatus.PENDING,
        limit: 100,
      });

      return response.orders;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch pending orders');
    }
  }

  /**
   * Get orders by status
   */
  async getOrdersByStatus(status: PurchaseOrderStatus, page: number = 1, limit: number = 20): Promise<PurchaseOrdersResponse> {
    try {
      return await this.getPurchaseOrders({
        status,
        page,
        limit,
      });
    } catch (error) {
      throw createApiError(error, 'Failed to fetch orders by status');
    }
  }

  /**
   * Get recent purchase orders
   */
  async getRecentOrders(limit: number = 10): Promise<PurchaseOrder[]> {
    try {
      const response = await this.getPurchaseOrders({
        limit,
        sortBy: 'orderDate',
        order: 'desc',
      });

      return response.orders;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch recent orders');
    }
  }

  /**
   * Get orders requiring receiving
   */
  async getOrdersRequiringReceiving(): Promise<PurchaseOrder[]> {
    try {
      const response = await this.getPurchaseOrders({
        status: [
          PurchaseOrderStatus.APPROVED,
          PurchaseOrderStatus.ORDERED,
          PurchaseOrderStatus.PARTIALLY_RECEIVED,
        ],
        limit: 100,
      });

      return response.orders;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch orders requiring receiving');
    }
  }

  /**
   * Export purchase order to PDF or CSV
   */
  async exportPurchaseOrder(id: string, format: 'pdf' | 'csv' = 'pdf'): Promise<Blob> {
    try {
      if (!id) throw new Error('Purchase order ID is required');

      const response = await this.client.get(
        API_ENDPOINTS.PURCHASE_ORDERS.EXPORT(id) + `?format=${format}`,
        {
          responseType: 'blob',
        }
      );

      return response.data;
    } catch (error) {
      throw createApiError(error, 'Failed to export purchase order');
    }
  }

  /**
   * Print purchase order
   */
  async printPurchaseOrder(id: string): Promise<Blob> {
    try {
      if (!id) throw new Error('Purchase order ID is required');

      const response = await this.client.get(
        API_ENDPOINTS.PURCHASE_ORDERS.PRINT(id),
        {
          responseType: 'blob',
        }
      );

      return response.data;
    } catch (error) {
      throw createApiError(error, 'Failed to print purchase order');
    }
  }

  /**
   * Send purchase order to vendor via email
   */
  async sendOrderToVendor(id: string, email?: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!id) throw new Error('Purchase order ID is required');

      const response = await this.client.post<ApiResponse<{ success: boolean; message: string }>>(
        API_ENDPOINTS.PURCHASE_ORDERS.SEND(id),
        { email }
      );

      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to send order to vendor');
    }
  }

  /**
   * Duplicate purchase order (create a copy)
   */
  async duplicatePurchaseOrder(id: string): Promise<PurchaseOrder> {
    try {
      if (!id) throw new Error('Purchase order ID is required');

      const response = await this.client.post<ApiResponse<{ order: PurchaseOrder }>>(
        API_ENDPOINTS.PURCHASE_ORDERS.DUPLICATE(id)
      );

      return response.data.data.order;
    } catch (error) {
      throw createApiError(error, 'Failed to duplicate purchase order');
    }
  }

  /**
   * Add note/comment to purchase order
   */
  async addOrderNote(id: string, note: string): Promise<PurchaseOrder> {
    try {
      if (!id) throw new Error('Purchase order ID is required');
      if (!note || note.trim().length === 0) throw new Error('Note is required');

      const response = await this.client.post<ApiResponse<{ order: PurchaseOrder }>>(
        API_ENDPOINTS.PURCHASE_ORDERS.NOTES(id),
        { note }
      );

      return response.data.data.order;
    } catch (error) {
      throw createApiError(error, 'Failed to add note to order');
    }
  }

  /**
   * Get order fulfillment status
   */
  async getOrderFulfillmentStatus(id: string): Promise<{
    totalItems: number;
    receivedItems: number;
    pendingItems: number;
    fulfillmentPercentage: number;
  }> {
    try {
      if (!id) throw new Error('Purchase order ID is required');

      const order = await this.getPurchaseOrderById(id);

      const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      const receivedItems = order.items?.reduce((sum, item) => sum + item.receivedQty, 0) || 0;
      const pendingItems = totalItems - receivedItems;
      const fulfillmentPercentage = totalItems > 0 ? Math.round((receivedItems / totalItems) * 100) : 0;

      return {
        totalItems,
        receivedItems,
        pendingItems,
        fulfillmentPercentage,
      };
    } catch (error) {
      throw createApiError(error, 'Failed to get order fulfillment status');
    }
  }
}

/**
 * Factory function for creating PurchaseOrderApi instances
 * @deprecated Use purchase-orders.actions.ts instead
 */
export function createPurchaseOrderApi(client: ApiClient): PurchaseOrderApi {
  return new PurchaseOrderApi(client);
}

/**
 * Singleton instance of PurchaseOrderApi
 * Pre-configured with the default apiClient from core services
 *
 * @deprecated MIGRATION COMPLETE - Use purchase-orders.actions.ts instead
 *
 * Server actions are now available for all purchase order operations:
 *
 * Migration guide:
 * - Instead of: purchaseOrderApi.createPurchaseOrder(data)
 * - Use: createPurchaseOrderAction(data) from purchase-orders.actions.ts
 *
 * - Instead of: purchaseOrderApi.approvePurchaseOrder(id, approvedBy)
 * - Use: approvePurchaseOrderAction(id, approvedBy) from purchase-orders.actions.ts
 *
 * - Instead of: purchaseOrderApi.receiveItems(id, data, performedBy)
 * - Use: receiveItemsAction from purchase-orders.status.ts
 *
 * - Instead of: purchaseOrderApi.getPurchaseOrders(filters)
 * - Use: getPurchaseOrders(filters) from purchase-orders.cache.ts
 *
 * All functionality is available with better caching, type safety, and Next.js integration.
 *
 * Target deprecation: March 2026
 */
export const purchaseOrderApi = createPurchaseOrderApi(apiClient);

/**
 * @deprecated Use purchase-orders.actions.ts instead
 */
export default purchaseOrderApi;
