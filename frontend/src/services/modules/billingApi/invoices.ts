/**
 * Invoice Management API
 *
 * Handles all invoice-related operations including CRUD operations,
 * email delivery, PDF generation, and status management.
 *
 * @module services/modules/billingApi/invoices
 * @category API
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse, PaginatedResponse } from '../../types';
import {
  BillingInvoice,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  InvoiceFilters,
} from './types';
import { createInvoiceSchema, createApiError, isZodError, formatZodError } from './schemas';
import { BILLING_ENDPOINTS } from './endpoints';

/**
 * Invoice Management API Client
 *
 * Provides comprehensive invoice management functionality including
 * creation, updates, retrieval, and special operations like PDF generation
 * and email delivery.
 */
export class InvoiceManagementApi {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get invoices with filtering and pagination
   *
   * @param page - Page number (1-indexed)
   * @param limit - Number of items per page
   * @param filters - Optional filters for querying invoices
   * @returns Paginated list of invoices
   * @throws Error if the API request fails
   */
  async getInvoices(
    page: number = 1,
    limit: number = 20,
    filters: InvoiceFilters = {}
  ): Promise<PaginatedResponse<BillingInvoice>> {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      // Add filters
      if (filters.status?.length) {
        filters.status.forEach(status => params.append('status', status));
      }
      if (filters.priority?.length) {
        filters.priority.forEach(priority => params.append('priority', priority));
      }
      if (filters.patientId) params.append('patientId', filters.patientId);
      if (filters.providerId) params.append('providerId', filters.providerId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.amountMin !== undefined) params.append('amountMin', String(filters.amountMin));
      if (filters.amountMax !== undefined) params.append('amountMax', String(filters.amountMax));
      if (filters.overdue !== undefined) params.append('overdue', String(filters.overdue));

      const response = await this.client.get<PaginatedResponse<BillingInvoice>>(
        `${BILLING_ENDPOINTS.INVOICES}?${params.toString()}`
      );

      return response.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch invoices');
    }
  }

  /**
   * Get invoice by ID
   *
   * @param id - Invoice ID
   * @returns Invoice details
   * @throws Error if invoice not found or API request fails
   */
  async getInvoiceById(id: string): Promise<BillingInvoice> {
    try {
      if (!id) throw new Error('Invoice ID is required');

      const response = await this.client.get<ApiResponse<BillingInvoice>>(
        BILLING_ENDPOINTS.INVOICE_BY_ID(id)
      );

      if (!response.data || ('success' in response.data && !response.data.success)) {
        throw new Error('Invalid response format or API error');
      }

      if ('data' in response.data && response.data.data) {
        return response.data.data;
      }

      // Fallback for direct data response
      return response.data as unknown as BillingInvoice;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch invoice');
    }
  }

  /**
   * Create new invoice
   *
   * @param data - Invoice creation request data
   * @returns Created invoice
   * @throws Error if validation fails or API request fails
   */
  async createInvoice(data: CreateInvoiceRequest): Promise<BillingInvoice> {
    try {
      createInvoiceSchema.parse(data);

      const response = await this.client.post<ApiResponse<BillingInvoice>>(
        BILLING_ENDPOINTS.INVOICES,
        data
      );

      if (!response.data || ('success' in response.data && !response.data.success)) {
        throw new Error('Invalid response format or API error');
      }

      if ('data' in response.data && response.data.data) {
        return response.data.data;
      }

      // Fallback for direct data response
      return response.data as unknown as BillingInvoice;
    } catch (error) {
      if (isZodError(error)) {
        throw new Error(`Validation error: ${formatZodError(error)}`);
      }
      throw createApiError(error, 'Failed to create invoice');
    }
  }

  /**
   * Update invoice
   *
   * @param id - Invoice ID
   * @param data - Invoice update request data
   * @returns Updated invoice
   * @throws Error if invoice not found or API request fails
   */
  async updateInvoice(id: string, data: UpdateInvoiceRequest): Promise<BillingInvoice> {
    try {
      if (!id) throw new Error('Invoice ID is required');

      const response = await this.client.put<ApiResponse<BillingInvoice>>(
        BILLING_ENDPOINTS.INVOICE_BY_ID(id),
        data
      );

      if (!response.data || ('success' in response.data && !response.data.success)) {
        throw new Error('Invalid response format or API error');
      }

      if ('data' in response.data && response.data.data) {
        return response.data.data;
      }

      // Fallback for direct data response
      return response.data as unknown as BillingInvoice;
    } catch (error) {
      throw createApiError(error, 'Failed to update invoice');
    }
  }

  /**
   * Delete invoice
   *
   * @param id - Invoice ID
   * @returns Success indicator
   * @throws Error if invoice not found or API request fails
   */
  async deleteInvoice(id: string): Promise<{ success: boolean }> {
    try {
      if (!id) throw new Error('Invoice ID is required');

      await this.client.delete<ApiResponse<{ success: boolean }>>(
        BILLING_ENDPOINTS.INVOICE_BY_ID(id)
      );

      return { success: true };
    } catch (error) {
      throw createApiError(error, 'Failed to delete invoice');
    }
  }

  /**
   * Send invoice via email
   *
   * @param id - Invoice ID
   * @param email - Optional override email address
   * @returns Success indicator
   * @throws Error if invoice not found or email delivery fails
   */
  async sendInvoice(id: string, email?: string): Promise<{ success: boolean }> {
    try {
      if (!id) throw new Error('Invoice ID is required');

      const response = await this.client.post<ApiResponse<{ success: boolean }>>(
        BILLING_ENDPOINTS.INVOICE_SEND(id),
        { email }
      );

      if (!response.data || ('success' in response.data && !response.data.success)) {
        throw new Error('Invalid response format or API error');
      }

      if ('data' in response.data && response.data.data) {
        return response.data.data;
      }

      // Fallback for direct data response
      return response.data as unknown as { success: boolean };
    } catch (error) {
      throw createApiError(error, 'Failed to send invoice');
    }
  }

  /**
   * Download invoice as PDF
   *
   * @param id - Invoice ID
   * @returns PDF blob data
   * @throws Error if invoice not found or PDF generation fails
   */
  async downloadInvoicePDF(id: string): Promise<Blob> {
    try {
      if (!id) throw new Error('Invoice ID is required');

      const response = await this.client.get<Blob>(
        BILLING_ENDPOINTS.INVOICE_PDF(id),
        { responseType: 'blob' }
      );

      return response.data as unknown as Blob;
    } catch (error) {
      throw createApiError(error, 'Failed to download invoice PDF');
    }
  }

  /**
   * Void invoice
   *
   * @param id - Invoice ID
   * @param reason - Reason for voiding the invoice
   * @returns Voided invoice
   * @throws Error if invoice not found or API request fails
   */
  async voidInvoice(id: string, reason: string): Promise<BillingInvoice> {
    try {
      if (!id) throw new Error('Invoice ID is required');

      const response = await this.client.post<ApiResponse<BillingInvoice>>(
        BILLING_ENDPOINTS.INVOICE_VOID(id),
        { reason }
      );

      if (!response.data || ('success' in response.data && !response.data.success)) {
        throw new Error('Invalid response format or API error');
      }

      if ('data' in response.data && response.data.data) {
        return response.data.data;
      }

      // Fallback for direct data response
      return response.data as unknown as BillingInvoice;
    } catch (error) {
      throw createApiError(error, 'Failed to void invoice');
    }
  }
}
