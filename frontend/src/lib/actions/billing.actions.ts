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
 *
 * This file serves as the main entry point and re-exports from focused modules:
 * - billing.types.ts - Type definitions and interfaces
 * - billing.cache.ts - Caching functions and configuration
 * - billing.invoices.ts - Invoice CRUD operations
 * - billing.payments.ts - Payment operations
 * - billing.forms.ts - Form data handling
 * - billing.utils.ts - Utility and dashboard functions
 */

'use server';

// ==========================================
// TYPE EXPORTS
// ==========================================

export type {
  ApiResponse,
  ActionResult,
  Invoice,
  InvoiceLineItem,
  CreateInvoiceData,
  UpdateInvoiceData,
  InvoiceFilters,
  Payment,
  CreatePaymentData,
  PaymentFilters,
  BillingAnalytics,
  BillingStats,
  BillingRecord
} from './billing.types';

// ==========================================
// CACHE EXPORTS
// ==========================================

export {
  BILLING_CACHE_TAGS,
  getInvoice,
  getInvoices,
  getPayment,
  getPayments,
  getBillingAnalytics,
  getBillingStats,
  clearBillingCache
} from './billing.cache';

// ==========================================
// INVOICE OPERATION EXPORTS
// ==========================================

export {
  createInvoiceAction,
  updateInvoiceAction,
  sendInvoiceAction,
  voidInvoiceAction,
  invoiceExists,
  getInvoiceCount
} from './billing.invoices';

// ==========================================
// PAYMENT OPERATION EXPORTS
// ==========================================

export {
  createPaymentAction,
  refundPaymentAction,
  paymentExists,
  getPaymentCount
} from './billing.payments';

// ==========================================
// FORM HANDLING EXPORTS
// ==========================================

export {
  createInvoiceFromForm,
  createPaymentFromForm
} from './billing.forms';

// ==========================================
// UTILITY EXPORTS
// ==========================================

export {
  getRevenueSummary,
  getBillingDashboardData
} from './billing.utils';
