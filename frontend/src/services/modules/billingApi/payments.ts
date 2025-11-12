/**
 * Payment Management API
 *
 * Handles all payment-related operations including recording payments,
 * processing refunds, and managing payment status.
 *
 * @module services/modules/billingApi/payments
 * @category API
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse, PaginatedResponse } from '../../types';
import {
  PaymentRecord,
  CreatePaymentRequest,
  ProcessRefundRequest,
  PaymentFilters,
} from './types';
import { createPaymentSchema, createApiError, isZodError, formatZodError } from './schemas';
import { BILLING_ENDPOINTS } from './endpoints';

/**
 * Payment Management API Client
 *
 * Provides comprehensive payment management functionality including
 * payment recording, refund processing, and payment history retrieval.
 */
export class PaymentManagementApi {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get payments with filtering and pagination
   *
   * @param page - Page number (1-indexed)
   * @param limit - Number of items per page
   * @param filters - Optional filters for querying payments
   * @returns Paginated list of payment records
   * @throws Error if the API request fails
   */
  async getPayments(
    page: number = 1,
    limit: number = 20,
    filters: PaymentFilters = {}
  ): Promise<PaginatedResponse<PaymentRecord>> {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      // Add filters
      if (filters.status?.length) {
        filters.status.forEach(status => params.append('status', status));
      }
      if (filters.method?.length) {
        filters.method.forEach(method => params.append('method', method));
      }
      if (filters.type?.length) {
        filters.type.forEach(type => params.append('type', type));
      }
      if (filters.invoiceId) params.append('invoiceId', filters.invoiceId);
      if (filters.patientId) params.append('patientId', filters.patientId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.amountMin !== undefined) params.append('amountMin', String(filters.amountMin));
      if (filters.amountMax !== undefined) params.append('amountMax', String(filters.amountMax));

      const response = await this.client.get<PaginatedResponse<PaymentRecord>>(
        `${BILLING_ENDPOINTS.PAYMENTS}?${params.toString()}`
      );

      return response.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch payments');
    }
  }

  /**
   * Record new payment
   *
   * @param data - Payment creation request data
   * @returns Created payment record
   * @throws Error if validation fails or API request fails
   */
  async recordPayment(data: CreatePaymentRequest): Promise<PaymentRecord> {
    try {
      createPaymentSchema.parse(data);

      const response = await this.client.post<ApiResponse<PaymentRecord>>(
        BILLING_ENDPOINTS.PAYMENTS,
        data
      );

      if (!response.data || ('success' in response.data && !response.data.success)) {
        throw new Error('Invalid response format or API error');
      }

      if ('data' in response.data && response.data.data) {
        return response.data.data;
      }

      // Fallback for direct data response
      return response.data as unknown as PaymentRecord;
    } catch (error) {
      if (isZodError(error)) {
        throw new Error(`Validation error: ${formatZodError(error)}`);
      }
      throw createApiError(error, 'Failed to record payment');
    }
  }

  /**
   * Process refund
   *
   * @param data - Refund processing request data
   * @returns Updated payment record with refund information
   * @throws Error if payment not found or refund processing fails
   */
  async processRefund(data: ProcessRefundRequest): Promise<PaymentRecord> {
    try {
      const response = await this.client.post<ApiResponse<PaymentRecord>>(
        BILLING_ENDPOINTS.PAYMENT_REFUND(data.paymentId),
        {
          amount: data.amount,
          reason: data.reason,
          refundMethod: data.refundMethod,
        }
      );

      if (!response.data || ('success' in response.data && !response.data.success)) {
        throw new Error('Invalid response format or API error');
      }

      if ('data' in response.data && response.data.data) {
        return response.data.data;
      }

      // Fallback for direct data response
      return response.data as unknown as PaymentRecord;
    } catch (error) {
      throw createApiError(error, 'Failed to process refund');
    }
  }

  /**
   * Void payment
   *
   * @param id - Payment ID
   * @param reason - Reason for voiding the payment
   * @returns Voided payment record
   * @throws Error if payment not found or API request fails
   */
  async voidPayment(id: string, reason: string): Promise<PaymentRecord> {
    try {
      if (!id) throw new Error('Payment ID is required');

      const response = await this.client.post<ApiResponse<PaymentRecord>>(
        BILLING_ENDPOINTS.PAYMENT_VOID(id),
        { reason }
      );

      if (!response.data || ('success' in response.data && !response.data.success)) {
        throw new Error('Invalid response format or API error');
      }

      if ('data' in response.data && response.data.data) {
        return response.data.data;
      }

      // Fallback for direct data response
      return response.data as unknown as PaymentRecord;
    } catch (error) {
      throw createApiError(error, 'Failed to void payment');
    }
  }
}
