/**
 * @fileoverview Billing Management Server Actions - Next.js v14+ Compatible
 * @module app/billing/actions
 *
 * HIPAA-compliant server actions for billing and financial management with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all billing operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Core API integrations
import { serverGet, serverPost, serverPut, serverDelete, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';

// Types
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Utils
import { formatDate } from '@/utils/dateUtils';
import { validateEmail, validatePhone } from '@/utils/validation/userValidation';
import { generateId } from '@/utils/generators';
import { formatName, formatPhone } from '@/utils/formatters';

// ==========================================
// CONFIGURATION
// ==========================================

// Custom cache tags for billing
export const BILLING_CACHE_TAGS = {
  INVOICES: 'billing-invoices',
  PAYMENTS: 'billing-payments',
  ANALYTICS: 'billing-analytics',
  REPORTS: 'billing-reports',
  SETTINGS: 'billing-settings',
} as const;

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'void';
  dueDate: string;
  issueDate: string;
  paidDate?: string;
  description: string;
  lineItems: InvoiceLineItem[];
  taxAmount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateInvoiceData {
  customerId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  dueDate: string;
  description: string;
  lineItems: Omit<InvoiceLineItem, 'id'>[];
  taxRate?: number;
}

export interface UpdateInvoiceData {
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  amount?: number;
  dueDate?: string;
  description?: string;
  lineItems?: Omit<InvoiceLineItem, 'id'>[];
  status?: Invoice['status'];
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  paymentMethod: 'credit_card' | 'bank_transfer' | 'check' | 'cash' | 'other';
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'void';
  transactionId?: string;
  processedDate?: string;
  refundedDate?: string;
  refundAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentData {
  invoiceId: string;
  amount: number;
  currency: string;
  paymentMethod: Payment['paymentMethod'];
  transactionId?: string;
}

export interface BillingAnalytics {
  totalRevenue: number;
  totalInvoices: number;
  totalPayments: number;
  averageInvoiceAmount: number;
  outstandingAmount: number;
  overdueAmount: number;
  collectionRate: number;
  periodComparison: {
    revenue: { current: number; previous: number; change: number };
    invoices: { current: number; previous: number; change: number };
    payments: { current: number; previous: number; change: number };
  };
}

export interface InvoiceFilters {
  status?: Invoice['status'];
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface PaymentFilters {
  status?: Payment['status'];
  paymentMethod?: Payment['paymentMethod'];
  invoiceId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface BillingRecord {
  id: string;
  studentId: string;
  studentName: string;
  serviceType: 'medical-consultation' | 'medication-dispensing' | 'emergency-care' | 'routine-checkup' | 'immunization';
  description: string;
  amount: number;
  status: 'draft' | 'pending' | 'submitted' | 'approved' | 'paid' | 'denied' | 'partial' | 'overdue';
  insuranceProvider?: string;
  claimNumber?: string;
  dateOfService: string;
  billingDate: string;
  dueDate: string;
  paymentDate?: string;
  notes?: string;
  attachments?: string[];
}

export interface BillingStats {
  totalBilled: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  claimsPending: number;
  claimsApproved: number;
  claimsDenied: number;
}

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get invoice by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getInvoice = cache(async (id: string): Promise<Invoice | null> => {
  try {
    const response = await serverGet<ApiResponse<Invoice>>(
      API_ENDPOINTS.BILLING.INVOICE_BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [`invoice-${id}`, BILLING_CACHE_TAGS.INVOICES] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get invoice:', error);
    return null;
  }
});

/**
 * Get all invoices with caching
 */
export const getInvoices = cache(async (filters?: InvoiceFilters): Promise<Invoice[]> => {
  try {
    const response = await serverGet<ApiResponse<Invoice[]>>(
      API_ENDPOINTS.BILLING.INVOICES,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [BILLING_CACHE_TAGS.INVOICES, 'invoice-list'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get invoices:', error);
    return [];
  }
});

/**
 * Get payment by ID with caching
 */
export const getPayment = cache(async (id: string): Promise<Payment | null> => {
  try {
    const response = await serverGet<ApiResponse<Payment>>(
      API_ENDPOINTS.BILLING.PAYMENT_BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [`payment-${id}`, BILLING_CACHE_TAGS.PAYMENTS] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get payment:', error);
    return null;
  }
});

/**
 * Get all payments with caching
 */
export const getPayments = cache(async (filters?: PaymentFilters): Promise<Payment[]> => {
  try {
    const response = await serverGet<ApiResponse<Payment[]>>(
      API_ENDPOINTS.BILLING.PAYMENTS,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [BILLING_CACHE_TAGS.PAYMENTS, 'payment-list'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get payments:', error);
    return [];
  }
});

/**
 * Get billing analytics with caching
 */
export const getBillingAnalytics = cache(async (filters?: Record<string, unknown>): Promise<BillingAnalytics | null> => {
  try {
    const response = await serverGet<ApiResponse<BillingAnalytics>>(
      API_ENDPOINTS.BILLING.ANALYTICS,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATS,
          tags: [BILLING_CACHE_TAGS.ANALYTICS, 'billing-stats'] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get billing analytics:', error);
    return null;
  }
});

// ==========================================
// INVOICE OPERATIONS
// ==========================================

/**
 * Create a new invoice
 * Includes audit logging and cache invalidation
 */
export async function createInvoiceAction(data: CreateInvoiceData): Promise<ActionResult<Invoice>> {
  try {
    // Validate required fields
    if (!data.customerId || !data.customerName || !data.customerEmail || !data.amount || !data.dueDate) {
      return {
        success: false,
        error: 'Missing required fields: customerId, customerName, customerEmail, amount, dueDate'
      };
    }

    // Validate email format
    if (!validateEmail(data.customerEmail)) {
      return {
        success: false,
        error: 'Invalid email format'
      };
    }

    // Validate amount
    if (data.amount <= 0) {
      return {
        success: false,
        error: 'Invoice amount must be greater than 0'
      };
    }

    const response = await serverPost<ApiResponse<Invoice>>(
      API_ENDPOINTS.BILLING.INVOICES,
      data,
      {
        cache: 'no-store',
        next: { tags: [BILLING_CACHE_TAGS.INVOICES] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create invoice');
    }

    // AUDIT LOG - Invoice creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Invoice',
      resourceId: response.data.id,
      details: `Created invoice for ${data.customerName} - $${data.amount}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(BILLING_CACHE_TAGS.INVOICES, 'default');
    revalidateTag('invoice-list', 'default');
    revalidatePath('/billing/invoices', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Invoice created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create invoice';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Invoice',
      details: `Failed to create invoice: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Update invoice
 * Includes audit logging and cache invalidation
 */
export async function updateInvoiceAction(
  invoiceId: string,
  data: UpdateInvoiceData
): Promise<ActionResult<Invoice>> {
  try {
    if (!invoiceId) {
      return {
        success: false,
        error: 'Invoice ID is required'
      };
    }

    // Validate email if provided
    if (data.customerEmail && !validateEmail(data.customerEmail)) {
      return {
        success: false,
        error: 'Invalid email format'
      };
    }

    // Validate amount if provided
    if (data.amount !== undefined && data.amount <= 0) {
      return {
        success: false,
        error: 'Invoice amount must be greater than 0'
      };
    }

    const response = await serverPut<ApiResponse<Invoice>>(
      API_ENDPOINTS.BILLING.INVOICE_BY_ID(invoiceId),
      data,
      {
        cache: 'no-store',
        next: { tags: [BILLING_CACHE_TAGS.INVOICES, `invoice-${invoiceId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update invoice');
    }

    // AUDIT LOG - Invoice update
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Invoice',
      resourceId: invoiceId,
      details: 'Updated invoice information',
      changes: data as Record<string, unknown>,
      success: true
    });

    // Cache invalidation
    revalidateTag(BILLING_CACHE_TAGS.INVOICES, 'default');
    revalidateTag(`invoice-${invoiceId}`, 'default');
    revalidateTag('invoice-list', 'default');
    revalidatePath('/billing/invoices', 'page');
    revalidatePath(`/billing/invoices/${invoiceId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Invoice updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update invoice';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Invoice',
      resourceId: invoiceId,
      details: `Failed to update invoice: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Send invoice to customer
 * Includes audit logging and cache invalidation
 */
export async function sendInvoiceAction(invoiceId: string): Promise<ActionResult<void>> {
  try {
    if (!invoiceId) {
      return {
        success: false,
        error: 'Invoice ID is required'
      };
    }

    await serverPost<ApiResponse<void>>(
      API_ENDPOINTS.BILLING.INVOICE_SEND(invoiceId),
      {},
      {
        cache: 'no-store',
        next: { tags: [BILLING_CACHE_TAGS.INVOICES, `invoice-${invoiceId}`] }
      }
    );

    // AUDIT LOG - Invoice sent
    await auditLog({
      action: AUDIT_ACTIONS.EXPORT_DATA,
      resource: 'Invoice',
      resourceId: invoiceId,
      details: 'Sent invoice to customer',
      success: true
    });

    // Cache invalidation
    revalidateTag(BILLING_CACHE_TAGS.INVOICES, 'default');
    revalidateTag(`invoice-${invoiceId}`, 'default');
    revalidatePath('/billing/invoices', 'page');
    revalidatePath(`/billing/invoices/${invoiceId}`, 'page');

    return {
      success: true,
      message: 'Invoice sent successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to send invoice';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.EXPORT_DATA,
      resource: 'Invoice',
      resourceId: invoiceId,
      details: `Failed to send invoice: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Void invoice
 * Includes audit logging and cache invalidation
 */
export async function voidInvoiceAction(invoiceId: string): Promise<ActionResult<Invoice>> {
  try {
    if (!invoiceId) {
      return {
        success: false,
        error: 'Invoice ID is required'
      };
    }

    const response = await serverPost<ApiResponse<Invoice>>(
      API_ENDPOINTS.BILLING.INVOICE_VOID(invoiceId),
      {},
      {
        cache: 'no-store',
        next: { tags: [BILLING_CACHE_TAGS.INVOICES, `invoice-${invoiceId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to void invoice');
    }

    // AUDIT LOG - Invoice voided
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_DOCUMENT,
      resource: 'Invoice',
      resourceId: invoiceId,
      details: 'Voided invoice',
      success: true
    });

    // Cache invalidation
    revalidateTag(BILLING_CACHE_TAGS.INVOICES, 'default');
    revalidateTag(`invoice-${invoiceId}`, 'default');
    revalidateTag('invoice-list', 'default');
    revalidatePath('/billing/invoices', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Invoice voided successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to void invoice';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.DELETE_DOCUMENT,
      resource: 'Invoice',
      resourceId: invoiceId,
      details: `Failed to void invoice: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// PAYMENT OPERATIONS
// ==========================================

/**
 * Create payment
 * Includes audit logging and cache invalidation
 */
export async function createPaymentAction(data: CreatePaymentData): Promise<ActionResult<Payment>> {
  try {
    // Validate required fields
    if (!data.invoiceId || !data.amount || !data.currency || !data.paymentMethod) {
      return {
        success: false,
        error: 'Missing required fields: invoiceId, amount, currency, paymentMethod'
      };
    }

    // Validate amount
    if (data.amount <= 0) {
      return {
        success: false,
        error: 'Payment amount must be greater than 0'
      };
    }

    const response = await serverPost<ApiResponse<Payment>>(
      API_ENDPOINTS.BILLING.PAYMENTS,
      data,
      {
        cache: 'no-store',
        next: { tags: [BILLING_CACHE_TAGS.PAYMENTS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create payment');
    }

    // AUDIT LOG - Payment creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Payment',
      resourceId: response.data.id,
      details: `Created payment for invoice ${data.invoiceId} - $${data.amount}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(BILLING_CACHE_TAGS.PAYMENTS, 'default');
    revalidateTag(BILLING_CACHE_TAGS.INVOICES, 'default');
    revalidateTag('payment-list', 'default');
    revalidateTag(`invoice-${data.invoiceId}`, 'default');
    revalidatePath('/billing/payments', 'page');
    revalidatePath('/billing/invoices', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Payment created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create payment';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'Payment',
      details: `Failed to create payment: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Refund payment
 * Includes audit logging and cache invalidation
 */
export async function refundPaymentAction(
  paymentId: string,
  refundAmount?: number
): Promise<ActionResult<Payment>> {
  try {
    if (!paymentId) {
      return {
        success: false,
        error: 'Payment ID is required'
      };
    }

    const refundData = refundAmount ? { amount: refundAmount } : {};

    const response = await serverPost<ApiResponse<Payment>>(
      API_ENDPOINTS.BILLING.PAYMENT_REFUND(paymentId),
      refundData,
      {
        cache: 'no-store',
        next: { tags: [BILLING_CACHE_TAGS.PAYMENTS, `payment-${paymentId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to refund payment');
    }

    // AUDIT LOG - Payment refunded
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Payment',
      resourceId: paymentId,
      details: `Refunded payment${refundAmount ? ` - $${refundAmount}` : ''}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(BILLING_CACHE_TAGS.PAYMENTS, 'default');
    revalidateTag(`payment-${paymentId}`, 'default');
    revalidateTag('payment-list', 'default');
    revalidatePath('/billing/payments', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Payment refunded successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to refund payment';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'Payment',
      resourceId: paymentId,
      details: `Failed to refund payment: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// FORM HANDLING OPERATIONS
// ==========================================

/**
 * Create invoice from form data
 * Form-friendly wrapper for createInvoiceAction
 */
export async function createInvoiceFromForm(formData: FormData): Promise<ActionResult<Invoice>> {
  const lineItems: Omit<InvoiceLineItem, 'id'>[] = [];
  
  // Parse line items from form data
  let itemIndex = 0;
  while (formData.has(`lineItems[${itemIndex}].description`)) {
    const description = formData.get(`lineItems[${itemIndex}].description`) as string;
    const quantity = parseFloat(formData.get(`lineItems[${itemIndex}].quantity`) as string) || 1;
    const unitPrice = parseFloat(formData.get(`lineItems[${itemIndex}].unitPrice`) as string) || 0;
    
    if (description && unitPrice > 0) {
      lineItems.push({
        description,
        quantity,
        unitPrice,
        totalPrice: quantity * unitPrice
      });
    }
    itemIndex++;
  }

  const invoiceData: CreateInvoiceData = {
    customerId: formData.get('customerId') as string,
    customerName: formData.get('customerName') as string,
    customerEmail: formData.get('customerEmail') as string,
    amount: parseFloat(formData.get('amount') as string) || 0,
    currency: formData.get('currency') as string || 'USD',
    dueDate: formData.get('dueDate') as string,
    description: formData.get('description') as string,
    lineItems,
    taxRate: parseFloat(formData.get('taxRate') as string) || 0,
  };

  const result = await createInvoiceAction(invoiceData);
  
  if (result.success && result.data) {
    redirect(`/billing/invoices/${result.data.id}`);
  }
  
  return result;
}

/**
 * Create payment from form data
 * Form-friendly wrapper for createPaymentAction
 */
export async function createPaymentFromForm(formData: FormData): Promise<ActionResult<Payment>> {
  const paymentData: CreatePaymentData = {
    invoiceId: formData.get('invoiceId') as string,
    amount: parseFloat(formData.get('amount') as string) || 0,
    currency: formData.get('currency') as string || 'USD',
    paymentMethod: formData.get('paymentMethod') as Payment['paymentMethod'],
    transactionId: formData.get('transactionId') as string || undefined,
  };

  const result = await createPaymentAction(paymentData);
  
  if (result.success && result.data) {
    revalidatePath('/billing/payments', 'page');
  }
  
  return result;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if invoice exists
 */
export async function invoiceExists(invoiceId: string): Promise<boolean> {
  const invoice = await getInvoice(invoiceId);
  return invoice !== null;
}

/**
 * Check if payment exists
 */
export async function paymentExists(paymentId: string): Promise<boolean> {
  const payment = await getPayment(paymentId);
  return payment !== null;
}

/**
 * Get invoice count
 */
export const getInvoiceCount = cache(async (filters?: InvoiceFilters): Promise<number> => {
  try {
    const invoices = await getInvoices(filters);
    return invoices.length;
  } catch {
    return 0;
  }
});

/**
 * Get payment count
 */
export const getPaymentCount = cache(async (filters?: PaymentFilters): Promise<number> => {
  try {
    const payments = await getPayments(filters);
    return payments.length;
  } catch {
    return 0;
  }
});

/**
 * Get revenue summary
 */
export async function getRevenueSummary(): Promise<{
  totalRevenue: number;
  monthlyRevenue: number;
  outstandingAmount: number;
  overdueAmount: number;
}> {
  try {
    const analytics = await getBillingAnalytics();
    
    return {
      totalRevenue: analytics?.totalRevenue || 0,
      monthlyRevenue: analytics?.periodComparison.revenue.current || 0,
      outstandingAmount: analytics?.outstandingAmount || 0,
      overdueAmount: analytics?.overdueAmount || 0,
    };
  } catch {
    return {
      totalRevenue: 0,
      monthlyRevenue: 0,
      outstandingAmount: 0,
      overdueAmount: 0,
    };
  }
}

// ==========================================
// DASHBOARD DATA FUNCTIONS
// ==========================================

/**
 * Get billing statistics for dashboard
 * Provides comprehensive billing metrics with proper caching
 */
export const getBillingStats = cache(async (): Promise<BillingStats> => {
  try {
    // Fetch invoices for stats calculation
    const invoices = await serverGet<Invoice[]>(
      `${API_ENDPOINTS.BILLING?.BASE || '/api/billing'}/invoices`,
      {
        next: { 
          revalidate: 300, // 5 minutes
          tags: ['billing-stats', 'billing-dashboard'] 
        }
      }
    );

    // Calculate stats from invoices 
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    const pendingInvoices = invoices.filter(inv => inv.status === 'sent');
    const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');

    const stats: BillingStats = {
      totalBilled: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
      totalPaid: paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
      totalPending: pendingInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
      totalOverdue: overdueInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
      claimsPending: pendingInvoices.length,
      claimsApproved: paidInvoices.length,
      claimsDenied: invoices.filter(inv => inv.status === 'cancelled').length,
    };

    // PHI protection audit log
    await auditLog({
      action: AUDIT_ACTIONS.EXPORT_DATA,
      resource: 'billing_stats',
      resourceId: 'dashboard-stats',
      details: 'Retrieved billing statistics for dashboard display'
    });

    return stats;
  } catch (error) {
    console.error('Error fetching billing stats:', error);
    // Return default stats on error
    return {
      totalBilled: 0,
      totalPaid: 0,
      totalPending: 0,
      totalOverdue: 0,
      claimsPending: 0,
      claimsApproved: 0,
      claimsDenied: 0,
    };
  }
});

/**
 * Get comprehensive billing dashboard data
 * Combines billing records and statistics for dashboard display
 */
export async function getBillingDashboardData() {
  try {
    // Fetch both billing records and stats in parallel for optimal performance
    const [billingRecords, stats] = await Promise.all([
      getInvoices(),
      getBillingStats()
    ]);

    // Transform invoices to billing records format
    const records: BillingRecord[] = billingRecords.map(invoice => ({
      id: invoice.id,
      studentId: invoice.customerId,
      studentName: invoice.customerName,
      serviceType: 'medical-consultation' as const,
      description: invoice.description,
      amount: invoice.totalAmount,
      status: invoice.status === 'paid' ? 'paid' : 
             invoice.status === 'sent' ? 'pending' :
             invoice.status === 'overdue' ? 'overdue' : 'draft',
      dateOfService: invoice.issueDate,
      billingDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      paymentDate: invoice.paidDate,
      notes: `Invoice #${invoice.invoiceNumber}`,
    }));

    // HIPAA compliance audit logging
    await auditLog({
      action: AUDIT_ACTIONS.EXPORT_DATA,
      resource: 'billing_dashboard',
      resourceId: 'dashboard-view',
      details: `Retrieved ${records.length} billing records for dashboard`
    });

    return {
      billingRecords: records,
      stats
    };
  } catch (error) {
    console.error('Error fetching billing dashboard data:', error);
    
    // Return empty data structure on error
    return {
      billingRecords: [] as BillingRecord[],
      stats: {
        totalBilled: 0,
        totalPaid: 0,
        totalPending: 0,
        totalOverdue: 0,
        claimsPending: 0,
        claimsApproved: 0,
        claimsDenied: 0,
      } as BillingStats
    };
  }
}

/**
 * Clear billing cache
 */
export async function clearBillingCache(resourceType?: string, resourceId?: string): Promise<void> {
  if (resourceType && resourceId) {
    revalidateTag(`${resourceType}-${resourceId}`, 'default');
  }
  
  // Clear all billing caches
  Object.values(BILLING_CACHE_TAGS).forEach(tag => {
    revalidateTag(tag, 'default');
  });

  // Clear list caches
  revalidateTag('invoice-list', 'default');
  revalidateTag('payment-list', 'default');
  revalidateTag('billing-stats', 'default');

  // Clear paths
  revalidatePath('/billing', 'page');
  revalidatePath('/billing/invoices', 'page');
  revalidatePath('/billing/payments', 'page');
  revalidatePath('/billing/analytics', 'page');
}
