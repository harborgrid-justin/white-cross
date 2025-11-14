/**
 * Suppliers and Purchase Orders Management for Inventory Management API
 *
 * Handles supplier management, purchase order operations, and vendor performance tracking.
 * Provides comprehensive supplier and procurement functionality.
 *
 * @module services/modules/inventoryApi/suppliers
 */

import type { ApiClient } from '../../core/ApiClient';
import type { ApiResponse, PaginatedResponse } from '../../types';
import type {
  Supplier,
  PurchaseOrder,
  PurchaseOrderStatus,
  CreateSupplierRequest,
  CreatePurchaseOrderRequest,
} from './types';
import { createSupplierSchema, createPurchaseOrderSchema } from './validation';
import { createApiError, createValidationError } from '../../core/errors';
import { API_ENDPOINTS } from '@/constants/api';
import { z } from 'zod';

/**
 * Suppliers and Purchase Orders API Operations
 */
export class SuppliersApi {
  private readonly baseEndpoint = API_ENDPOINTS.INVENTORY.BASE;

  constructor(private readonly client: ApiClient) {}

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
   * Search suppliers
   */
  async searchSuppliers(query: string, limit: number = 20): Promise<Supplier[]> {
    try {
      if (!query) throw new Error('Search query is required');

      const response = await this.client.get<ApiResponse<{ suppliers: Supplier[] }>>(
        `${this.baseEndpoint}/suppliers/search?query=${encodeURIComponent(query)}&limit=${limit}`
      );

      return response.data.data!.suppliers;
    } catch (error) {
      throw createApiError(error, 'Failed to search suppliers');
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
    metrics: {
      averageOrderValue: number;
      monthsActive: number;
      orderFrequency: number;
      returnRate: number;
      defectRate: number;
    };
  }>> {
    try {
      const params = supplierId ? `?supplierId=${supplierId}` : '';

      const response = await this.client.get<ApiResponse<{ 
        performance: Array<{
          supplier: Supplier;
          totalOrders: number;
          totalSpend: number;
          averageDeliveryTime: number;
          onTimeDeliveryRate: number;
          qualityRating: number;
          lastOrderDate?: string;
          metrics: {
            averageOrderValue: number;
            monthsActive: number;
            orderFrequency: number;
            returnRate: number;
            defectRate: number;
          };
        }>
      }>>(
        `${this.baseEndpoint}/suppliers/performance${params}`
      );

      return response.data.data!.performance;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch supplier performance');
    }
  }

  /**
   * Get supplier contact history
   */
  async getSupplierContacts(supplierId: string): Promise<Array<{
    id: string;
    type: 'EMAIL' | 'PHONE' | 'MEETING' | 'ORDER' | 'SUPPORT';
    subject: string;
    description?: string;
    contactedBy: string;
    contactDate: string;
    outcome?: string;
    followUpRequired: boolean;
    followUpDate?: string;
  }>> {
    try {
      if (!supplierId) throw new Error('Supplier ID is required');

      const response = await this.client.get<ApiResponse<{ 
        contacts: Array<{
          id: string;
          type: 'EMAIL' | 'PHONE' | 'MEETING' | 'ORDER' | 'SUPPORT';
          subject: string;
          description?: string;
          contactedBy: string;
          contactDate: string;
          outcome?: string;
          followUpRequired: boolean;
          followUpDate?: string;
        }>
      }>>(
        `${this.baseEndpoint}/suppliers/${supplierId}/contacts`
      );

      return response.data.data!.contacts;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch supplier contacts');
    }
  }

  /**
   * Add supplier contact log
   */
  async addSupplierContact(supplierId: string, data: {
    type: 'EMAIL' | 'PHONE' | 'MEETING' | 'ORDER' | 'SUPPORT';
    subject: string;
    description?: string;
    outcome?: string;
    followUpRequired?: boolean;
    followUpDate?: string;
  }): Promise<{
    id: string;
    type: 'EMAIL' | 'PHONE' | 'MEETING' | 'ORDER' | 'SUPPORT';
    subject: string;
    description?: string;
    contactedBy: string;
    contactDate: string;
    outcome?: string;
    followUpRequired: boolean;
    followUpDate?: string;
  }> {
    try {
      if (!supplierId) throw new Error('Supplier ID is required');
      if (!data.subject) throw new Error('Contact subject is required');

      const response = await this.client.post<ApiResponse<{
        id: string;
        type: 'EMAIL' | 'PHONE' | 'MEETING' | 'ORDER' | 'SUPPORT';
        subject: string;
        description?: string;
        contactedBy: string;
        contactDate: string;
        outcome?: string;
        followUpRequired: boolean;
        followUpDate?: string;
      }>>(
        `${this.baseEndpoint}/suppliers/${supplierId}/contacts`,
        data
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to add supplier contact');
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
      throw createApiError(error, 'Failed to create purchase order');
    }
  }

  /**
   * Update purchase order
   */
  async updatePurchaseOrder(id: string, data: Partial<CreatePurchaseOrderRequest>): Promise<PurchaseOrder> {
    try {
      if (!id) throw new Error('Purchase order ID is required');

      const response = await this.client.put<ApiResponse<PurchaseOrder>>(
        `${this.baseEndpoint}/purchase-orders/${id}`,
        data
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to update purchase order');
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
   * Cancel purchase order
   */
  async cancelPurchaseOrder(id: string, reason: string): Promise<PurchaseOrder> {
    try {
      if (!id) throw new Error('Purchase order ID is required');
      if (!reason) throw new Error('Cancellation reason is required');

      const response = await this.client.put<ApiResponse<PurchaseOrder>>(
        `${this.baseEndpoint}/purchase-orders/${id}/cancel`,
        { reason }
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to cancel purchase order');
    }
  }

  /**
   * Generate purchase order for low stock items
   */
  async generatePurchaseOrder(supplierId: string, options?: {
    includeCategories?: string[];
    excludeCategories?: string[];
    minimumValue?: number;
    urgentOnly?: boolean;
  }): Promise<PurchaseOrder> {
    try {
      if (!supplierId) throw new Error('Supplier ID is required');

      const response = await this.client.post<ApiResponse<PurchaseOrder>>(
        `${this.baseEndpoint}/purchase-orders/generate`,
        { supplierId, ...options }
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to generate purchase order');
    }
  }

  /**
   * Receive purchase order items
   */
  async receivePurchaseOrderItems(id: string, items: Array<{
    purchaseOrderItemId: string;
    receivedQuantity: number;
    batchNumber?: string;
    expirationDate?: string;
    notes?: string;
  }>): Promise<PurchaseOrder> {
    try {
      if (!id) throw new Error('Purchase order ID is required');
      if (!items.length) throw new Error('At least one item is required');

      const response = await this.client.post<ApiResponse<PurchaseOrder>>(
        `${this.baseEndpoint}/purchase-orders/${id}/receive`,
        { items }
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to receive purchase order items');
    }
  }

  /**
   * Get purchase order history for supplier
   */
  async getSupplierPurchaseHistory(supplierId: string, filters?: {
    dateFrom?: string;
    dateTo?: string;
    status?: PurchaseOrderStatus;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<PurchaseOrder>> {
    try {
      if (!supplierId) throw new Error('Supplier ID is required');

      const params = new URLSearchParams();
      params.append('supplierId', supplierId);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.page) params.append('page', String(filters.page));
      if (filters?.limit) params.append('limit', String(filters.limit));

      const response = await this.client.get<ApiResponse<PaginatedResponse<PurchaseOrder>>>(
        `${this.baseEndpoint}/purchase-orders?${params.toString()}`
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch supplier purchase history');
    }
  }

  /**
   * Get pending approvals
   */
  async getPendingApprovals(): Promise<Array<{
    purchaseOrder: PurchaseOrder;
    requiredApprovals: string[];
    currentApprovals: Array<{
      approvedBy: string;
      approvedAt: string;
      comments?: string;
    }>;
    pendingApprovals: string[];
    canApprove: boolean;
  }>> {
    try {
      const response = await this.client.get<ApiResponse<{ 
        approvals: Array<{
          purchaseOrder: PurchaseOrder;
          requiredApprovals: string[];
          currentApprovals: Array<{
            approvedBy: string;
            approvedAt: string;
            comments?: string;
          }>;
          pendingApprovals: string[];
          canApprove: boolean;
        }>
      }>>(
        `${this.baseEndpoint}/purchase-orders/pending-approvals`
      );

      return response.data.data!.approvals;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch pending approvals');
    }
  }

  /**
   * Approve purchase order
   */
  async approvePurchaseOrder(id: string, comments?: string): Promise<PurchaseOrder> {
    try {
      if (!id) throw new Error('Purchase order ID is required');

      const response = await this.client.post<ApiResponse<PurchaseOrder>>(
        `${this.baseEndpoint}/purchase-orders/${id}/approve`,
        { comments }
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to approve purchase order');
    }
  }

  /**
   * Reject purchase order
   */
  async rejectPurchaseOrder(id: string, reason: string): Promise<PurchaseOrder> {
    try {
      if (!id) throw new Error('Purchase order ID is required');
      if (!reason) throw new Error('Rejection reason is required');

      const response = await this.client.post<ApiResponse<PurchaseOrder>>(
        `${this.baseEndpoint}/purchase-orders/${id}/reject`,
        { reason }
      );

      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to reject purchase order');
    }
  }
}
