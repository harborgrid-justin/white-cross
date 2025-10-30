/**
 * Billing Management API
 * Comprehensive API client for invoice management, payment processing, 
 * billing analytics, and financial reporting
 * 
 * @module services/modules/billingApi
 * @category Services
 * @author White Cross Healthcare Platform
 * @version 1.0.0
 */

import type { ApiClient } from '../core/ApiClient';
import { apiClient } from '../core/ApiClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import { ApiResponse, PaginatedResponse } from '../types';
import { z } from 'zod';

// =====================
// TYPE DEFINITIONS
// =====================

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
export type InvoicePriority = 'low' | 'medium' | 'high' | 'urgent';
export type PaymentMethod = 'cash' | 'check' | 'credit-card' | 'debit-card' | 'bank-transfer' | 'insurance';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
export type PaymentType = 'payment' | 'refund' | 'adjustment' | 'write-off' | 'transfer';
export type ServiceCategory = 'consultation' | 'treatment' | 'medication' | 'supplies' | 'equipment' | 'other';

export interface BillingInvoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  patientEmail?: string;
  patientPhone?: string;
  patientAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  providerId: string;
  providerName: string;
  serviceDate: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  priority: InvoicePriority;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  payments: PaymentRecord[];
  notes?: string;
  terms?: string;
  insuranceClaimId?: string;
  insuranceStatus?: 'pending' | 'processing' | 'approved' | 'denied';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  category: ServiceCategory;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  total: number;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  reference?: string;
  notes?: string;
  status: PaymentStatus;
  type: PaymentType;
  patientId: string;
  patientName: string;
  invoiceId: string;
  invoiceNumber: string;
  processedBy: string;
  processedAt: string;
  transactionId?: string;
  authorizationCode?: string;
  refundedAmount?: number;
  refundReason?: string;
  metadata?: Record<string, any>;
}

export interface BillingAnalytics {
  totalRevenue: number;
  monthlyRevenue: number;
  averageInvoiceValue: number;
  collectionRate: number;
  outstandingBalance: number;
  overdueAmount: number;
  paymentTrends: Array<{
    period: string;
    amount: number;
    count: number;
  }>;
  topServices: Array<{
    category: ServiceCategory;
    revenue: number;
    count: number;
  }>;
  paymentMethods: Array<{
    method: PaymentMethod;
    amount: number;
    percentage: number;
  }>;
}

export interface BillingSettings {
  invoicePrefix: string;
  invoiceNumberFormat: string;
  defaultTerms: string;
  defaultDueDays: number;
  taxRate: number;
  lateFeeRate: number;
  autoSendReminders: boolean;
  reminderSchedule: number[];
  paymentMethods: PaymentMethod[];
  emailTemplates: {
    invoice: string;
    reminder: string;
    receipt: string;
  };
}

// =====================
// REQUEST/RESPONSE TYPES
// =====================

export interface CreateInvoiceRequest {
  patientId: string;
  providerId: string;
  serviceDate: string;
  dueDate?: string;
  priority?: InvoicePriority;
  lineItems: Omit<InvoiceLineItem, 'id' | 'total'>[];
  discountAmount?: number;
  notes?: string;
  terms?: string;
  insuranceClaimId?: string;
}

export interface UpdateInvoiceRequest {
  patientId?: string;
  providerId?: string;
  serviceDate?: string;
  dueDate?: string;
  priority?: InvoicePriority;
  status?: InvoiceStatus;
  lineItems?: Omit<InvoiceLineItem, 'id' | 'total'>[];
  discountAmount?: number;
  notes?: string;
  terms?: string;
}

export interface CreatePaymentRequest {
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
  transactionId?: string;
  authorizationCode?: string;
}

export interface ProcessRefundRequest {
  paymentId: string;
  amount: number;
  reason: string;
  refundMethod?: PaymentMethod;
}

export interface InvoiceFilters {
  status?: InvoiceStatus[];
  priority?: InvoicePriority[];
  patientId?: string;
  providerId?: string;
  startDate?: string;
  endDate?: string;
  amountMin?: number;
  amountMax?: number;
  overdue?: boolean;
}

export interface PaymentFilters {
  status?: PaymentStatus[];
  method?: PaymentMethod[];
  type?: PaymentType[];
  invoiceId?: string;
  patientId?: string;
  startDate?: string;
  endDate?: string;
  amountMin?: number;
  amountMax?: number;
}

// =====================
// VALIDATION SCHEMAS
// =====================

const createInvoiceSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  providerId: z.string().uuid('Invalid provider ID'),
  serviceDate: z.string().datetime('Invalid service date'),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  lineItems: z.array(z.object({
    description: z.string().min(1, 'Description is required'),
    category: z.enum(['consultation', 'treatment', 'medication', 'supplies', 'equipment', 'other']),
    quantity: z.number().positive('Quantity must be positive'),
    unitPrice: z.number().nonnegative('Unit price must be non-negative'),
    discount: z.number().nonnegative('Discount must be non-negative').optional(),
    taxRate: z.number().nonnegative('Tax rate must be non-negative').optional(),
  })).min(1, 'At least one line item is required'),
  discountAmount: z.number().nonnegative().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  insuranceClaimId: z.string().optional(),
});

const createPaymentSchema = z.object({
  invoiceId: z.string().uuid('Invalid invoice ID'),
  amount: z.number().positive('Amount must be positive'),
  method: z.enum(['cash', 'check', 'credit-card', 'debit-card', 'bank-transfer', 'insurance']),
  reference: z.string().optional(),
  notes: z.string().optional(),
  transactionId: z.string().optional(),
  authorizationCode: z.string().optional(),
});

// =====================
// API ENDPOINTS
// =====================

const BILLING_ENDPOINTS = {
  // Invoices
  INVOICES: '/billing/invoices',
  INVOICE_BY_ID: (id: string) => `/billing/invoices/${id}`,
  INVOICE_PDF: (id: string) => `/billing/invoices/${id}/pdf`,
  INVOICE_SEND: (id: string) => `/billing/invoices/${id}/send`,
  INVOICE_VOID: (id: string) => `/billing/invoices/${id}/void`,
  
  // Payments
  PAYMENTS: '/billing/payments',
  PAYMENT_BY_ID: (id: string) => `/billing/payments/${id}`,
  PAYMENT_REFUND: (id: string) => `/billing/payments/${id}/refund`,
  PAYMENT_VOID: (id: string) => `/billing/payments/${id}/void`,
  
  // Analytics
  ANALYTICS: '/billing/analytics',
  REVENUE_TRENDS: '/billing/analytics/revenue-trends',
  PAYMENT_ANALYTICS: '/billing/analytics/payments',
  COLLECTION_METRICS: '/billing/analytics/collections',
  
  // Reports
  REPORTS: '/billing/reports',
  AGING_REPORT: '/billing/reports/aging',
  REVENUE_REPORT: '/billing/reports/revenue',
  PAYMENT_REPORT: '/billing/reports/payments',
  TAX_REPORT: '/billing/reports/tax',
  
  // Settings
  SETTINGS: '/billing/settings',
  
  // Notifications
  NOTIFICATIONS: '/billing/notifications',
  SEND_REMINDER: '/billing/notifications/reminder',
  SEND_STATEMENT: '/billing/notifications/statement',
} as const;

// =====================
// ERROR UTILITIES
// =====================

function createApiError(error: unknown, fallbackMessage: string): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(fallbackMessage);
}

// =====================
// BILLING API CLASS
// =====================

/**
 * Billing API Client
 * Provides comprehensive billing and payment management functionality
 */
export class BillingApi {
  constructor(private readonly client: ApiClient) {}

  // ==========================================
  // INVOICE MANAGEMENT
  // ==========================================

  /**
   * Get invoices with filtering and pagination
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
      if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
        const zodError = error as Record<string, unknown>;
        const errors = zodError.errors as Array<{ message: string }> | undefined;
        throw new Error(`Validation error: ${errors?.[0]?.message || 'Validation failed'}`);
      }
      throw createApiError(error, 'Failed to create invoice');
    }
  }

  /**
   * Update invoice
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

  // ==========================================
  // PAYMENT MANAGEMENT
  // ==========================================

  /**
   * Get payments with filtering and pagination
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
      if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
        const zodError = error as Record<string, unknown>;
        const errors = zodError.errors as Array<{ message: string }> | undefined;
        throw new Error(`Validation error: ${errors?.[0]?.message || 'Validation failed'}`);
      }
      throw createApiError(error, 'Failed to record payment');
    }
  }

  /**
   * Process refund
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

  // ==========================================
  // ANALYTICS & REPORTING
  // ==========================================

  /**
   * Get billing analytics
   */
  async getBillingAnalytics(startDate?: string, endDate?: string): Promise<BillingAnalytics> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await this.client.get<ApiResponse<BillingAnalytics>>(
        `${BILLING_ENDPOINTS.ANALYTICS}?${params.toString()}`
      );

      if (!response.data || ('success' in response.data && !response.data.success)) {
        throw new Error('Invalid response format or API error');
      }

      if ('data' in response.data && response.data.data) {
        return response.data.data;
      }

      // Fallback for direct data response
      return response.data as unknown as BillingAnalytics;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch billing analytics');
    }
  }

  /**
   * Get revenue trends
   */
  async getRevenueTrends(period: 'daily' | 'weekly' | 'monthly' = 'monthly', months: number = 12): Promise<Array<{
    period: string;
    revenue: number;
    invoiceCount: number;
    averageValue: number;
  }>> {
    try {
      const params = new URLSearchParams({
        period,
        months: String(months),
      });

      const response = await this.client.get<ApiResponse<Array<{
        period: string;
        revenue: number;
        invoiceCount: number;
        averageValue: number;
      }>>>(
        `${BILLING_ENDPOINTS.REVENUE_TRENDS}?${params.toString()}`
      );

      if (!response.data || ('success' in response.data && !response.data.success)) {
        throw new Error('Invalid response format or API error');
      }

      if ('data' in response.data && response.data.data) {
        return response.data.data;
      }

      // Fallback for direct data response
      return response.data as unknown as Array<{
        period: string;
        revenue: number;
        invoiceCount: number;
        averageValue: number;
      }>;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch revenue trends');
    }
  }

  /**
   * Get payment analytics
   */
  async getPaymentAnalytics(startDate?: string, endDate?: string): Promise<{
    totalPayments: number;
    totalAmount: number;
    averagePaymentTime: number;
    paymentMethods: Array<{
      method: PaymentMethod;
      count: number;
      amount: number;
    }>;
    refundRate: number;
    chargebackRate: number;
  }> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await this.client.get<ApiResponse<{
        totalPayments: number;
        totalAmount: number;
        averagePaymentTime: number;
        paymentMethods: Array<{
          method: PaymentMethod;
          count: number;
          amount: number;
        }>;
        refundRate: number;
        chargebackRate: number;
      }>>(
        `${BILLING_ENDPOINTS.PAYMENT_ANALYTICS}?${params.toString()}`
      );

      if (!response.data || ('success' in response.data && !response.data.success)) {
        throw new Error('Invalid response format or API error');
      }

      if ('data' in response.data && response.data.data) {
        return response.data.data;
      }

      // Fallback for direct data response
      return response.data as unknown as {
        totalPayments: number;
        totalAmount: number;
        averagePaymentTime: number;
        paymentMethods: Array<{
          method: PaymentMethod;
          count: number;
          amount: number;
        }>;
        refundRate: number;
        chargebackRate: number;
      };
    } catch (error) {
      throw createApiError(error, 'Failed to fetch payment analytics');
    }
  }

  // ==========================================
  // SETTINGS & CONFIGURATION
  // ==========================================

  /**
   * Get billing settings
   */
  async getBillingSettings(): Promise<BillingSettings> {
    try {
      const response = await this.client.get<ApiResponse<BillingSettings>>(
        BILLING_ENDPOINTS.SETTINGS
      );

      if (!response.data || ('success' in response.data && !response.data.success)) {
        throw new Error('Invalid response format or API error');
      }

      if ('data' in response.data && response.data.data) {
        return response.data.data;
      }

      // Fallback for direct data response
      return response.data as unknown as BillingSettings;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch billing settings');
    }
  }

  /**
   * Update billing settings
   */
  async updateBillingSettings(settings: Partial<BillingSettings>): Promise<BillingSettings> {
    try {
      const response = await this.client.put<ApiResponse<BillingSettings>>(
        BILLING_ENDPOINTS.SETTINGS,
        settings
      );

      if (!response.data || ('success' in response.data && !response.data.success)) {
        throw new Error('Invalid response format or API error');
      }

      if ('data' in response.data && response.data.data) {
        return response.data.data;
      }

      // Fallback for direct data response
      return response.data as unknown as BillingSettings;
    } catch (error) {
      throw createApiError(error, 'Failed to update billing settings');
    }
  }

  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  /**
   * Send payment reminder
   */
  async sendPaymentReminder(invoiceId: string, message?: string): Promise<{ success: boolean }> {
    try {
      const response = await this.client.post<ApiResponse<{ success: boolean }>>(
        BILLING_ENDPOINTS.SEND_REMINDER,
        { invoiceId, message }
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
      throw createApiError(error, 'Failed to send payment reminder');
    }
  }

  /**
   * Send billing statement
   */
  async sendStatement(patientId: string, startDate?: string, endDate?: string): Promise<{ success: boolean }> {
    try {
      const response = await this.client.post<ApiResponse<{ success: boolean }>>(
        BILLING_ENDPOINTS.SEND_STATEMENT,
        { patientId, startDate, endDate }
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
      throw createApiError(error, 'Failed to send statement');
    }
  }
}

// =====================
// FACTORY & SINGLETON
// =====================

export function createBillingApi(client: ApiClient): BillingApi {
  return new BillingApi(client);
}

/**
 * Singleton instance of BillingApi
 * Pre-configured with the default apiClient
 */
export const billingApi = createBillingApi(apiClient);
