/**
 * Purchase Order API Client
 * Handles all purchase order operations including creation, approval workflow,
 * receiving, fulfillment, and order management
 */

import { apiInstance } from '../config/apiConfig';
import { ApiResponse } from '../utils/apiUtils';
import { z } from 'zod';
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
} from '../../types/purchaseOrders';

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
  private readonly baseUrl = '/api/purchase-orders';

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
        ? `${this.baseUrl}?${queryString.toString()}`
        : this.baseUrl;

      const response = await apiInstance.get<ApiResponse<PurchaseOrdersResponse>>(url);

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch purchase orders');
    }
  }

  /**
   * Get purchase order by ID with full details
   */
  async getPurchaseOrderById(id: string): Promise<PurchaseOrder> {
    try {
      if (!id) throw new Error('Purchase order ID is required');

      const response = await apiInstance.get<ApiResponse<PurchaseOrderDetailResponse>>(
        `${this.baseUrl}/${id}`
      );

      return response.data.data.order;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch purchase order');
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

      const response = await apiInstance.post<ApiResponse<{ order: PurchaseOrder }>>(
        this.baseUrl,
        formattedData
      );

      return response.data.data.order;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to create purchase order');
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

      const response = await apiInstance.put<ApiResponse<{ order: PurchaseOrder }>>(
        `${this.baseUrl}/${id}`,
        formattedData
      );

      return response.data.data.order;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to update purchase order');
    }
  }

  /**
   * Approve purchase order
   */
  async approvePurchaseOrder(id: string, approvedBy: string): Promise<PurchaseOrder> {
    try {
      if (!id) throw new Error('Purchase order ID is required');
      if (!approvedBy) throw new Error('Approver ID is required');

      const response = await apiInstance.post<ApiResponse<{ order: PurchaseOrder }>>(
        `${this.baseUrl}/${id}/approve`,
        { approvedBy }
      );

      return response.data.data.order;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to approve purchase order');
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

      const response = await apiInstance.post<ApiResponse<{ order: PurchaseOrder }>>(
        `${this.baseUrl}/${id}/receive`,
        data
      );

      return response.data.data.order;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to receive items');
    }
  }

  /**
   * Cancel purchase order
   */
  async cancelPurchaseOrder(id: string, reason?: string): Promise<PurchaseOrder> {
    try {
      if (!id) throw new Error('Purchase order ID is required');

      const response = await apiInstance.post<ApiResponse<{ order: PurchaseOrder }>>(
        `${this.baseUrl}/${id}/cancel`,
        { reason }
      );

      return response.data.data.order;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to cancel purchase order');
    }
  }

  /**
   * Delete purchase order (only for PENDING orders)
   */
  async deletePurchaseOrder(id: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!id) throw new Error('Purchase order ID is required');

      const response = await apiInstance.delete<ApiResponse<{ success: boolean; message: string }>>(
        `${this.baseUrl}/${id}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to delete purchase order');
    }
  }

  /**
   * Get items needing reorder based on stock levels
   */
  async getItemsNeedingReorder(): Promise<ReorderItem[]> {
    try {
      const response = await apiInstance.get<ApiResponse<ReorderItemsResponse>>(
        `${this.baseUrl}/reorder/needed`
      );

      return response.data.data.items;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch reorder items');
    }
  }

  /**
   * Get purchase order statistics
   */
  async getPurchaseOrderStatistics(): Promise<PurchaseOrderStatistics> {
    try {
      const response = await apiInstance.get<ApiResponse<PurchaseOrderStatistics>>(
        `${this.baseUrl}/statistics`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch statistics');
    }
  }

  /**
   * Get vendor purchase order history
   */
  async getVendorPurchaseHistory(vendorId: string, limit: number = 10): Promise<VendorOrderHistory> {
    try {
      if (!vendorId) throw new Error('Vendor ID is required');

      const response = await apiInstance.get<ApiResponse<VendorOrderHistoryResponse>>(
        `${this.baseUrl}/vendor/${vendorId}/history?limit=${limit}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch vendor purchase history');
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
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch pending orders');
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
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch orders by status');
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
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch recent orders');
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
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch orders requiring receiving');
    }
  }

  /**
   * Export purchase order to PDF or CSV
   */
  async exportPurchaseOrder(id: string, format: 'pdf' | 'csv' = 'pdf'): Promise<Blob> {
    try {
      if (!id) throw new Error('Purchase order ID is required');

      const response = await apiInstance.get(
        `${this.baseUrl}/${id}/export?format=${format}`,
        {
          responseType: 'blob',
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to export purchase order');
    }
  }

  /**
   * Print purchase order
   */
  async printPurchaseOrder(id: string): Promise<Blob> {
    try {
      if (!id) throw new Error('Purchase order ID is required');

      const response = await apiInstance.get(
        `${this.baseUrl}/${id}/print`,
        {
          responseType: 'blob',
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to print purchase order');
    }
  }

  /**
   * Send purchase order to vendor via email
   */
  async sendOrderToVendor(id: string, email?: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!id) throw new Error('Purchase order ID is required');

      const response = await apiInstance.post<ApiResponse<{ success: boolean; message: string }>>(
        `${this.baseUrl}/${id}/send`,
        { email }
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to send order to vendor');
    }
  }

  /**
   * Duplicate purchase order (create a copy)
   */
  async duplicatePurchaseOrder(id: string): Promise<PurchaseOrder> {
    try {
      if (!id) throw new Error('Purchase order ID is required');

      const response = await apiInstance.post<ApiResponse<{ order: PurchaseOrder }>>(
        `${this.baseUrl}/${id}/duplicate`
      );

      return response.data.data.order;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to duplicate purchase order');
    }
  }

  /**
   * Add note/comment to purchase order
   */
  async addOrderNote(id: string, note: string): Promise<PurchaseOrder> {
    try {
      if (!id) throw new Error('Purchase order ID is required');
      if (!note || note.trim().length === 0) throw new Error('Note is required');

      const response = await apiInstance.post<ApiResponse<{ order: PurchaseOrder }>>(
        `${this.baseUrl}/${id}/notes`,
        { note }
      );

      return response.data.data.order;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to add note to order');
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
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to get order fulfillment status');
    }
  }
}

// Export singleton instance
export const purchaseOrderApi = new PurchaseOrderApi();

// Export default for convenience
export default purchaseOrderApi;
