/**
 * @deprecated - Migrated to Server Actions (REMOVAL DATE: 2026-06-30)
 *
 * This service module is deprecated. Please migrate to Server Actions.
 *
 * **QUICK MIGRATION GUIDE**:
 * ```typescript
 * // ❌ OLD: Service Module Pattern
 * import { billingApi } from '@/services/modules/billingApi';
 * const invoices = await billingApi.invoices.getInvoices(1, 20);
 * const result = await billingApi.invoices.createInvoice(data);
 * const payments = await billingApi.payments.getPayments(1, 20);
 *
 * // ✅ NEW: Server Actions Pattern
 * import { getInvoices, getPayments } from '@/lib/actions/billing.cache';
 * import { createInvoiceAction } from '@/lib/actions/billing.invoices';
 * import { recordPaymentAction } from '@/lib/actions/billing.payments';
 *
 * // Server Component (cached queries)
 * const invoices = await getInvoices({ page: 1, limit: 20 });
 * const payments = await getPayments({ page: 1, limit: 20 });
 *
 * // Client Component (mutations)
 * const invoiceResult = await createInvoiceAction(data);
 * const paymentResult = await recordPaymentAction(data);
 * ```
 *
 * **MIGRATION TARGETS**:
 * - Invoice operations → `@/lib/actions/billing.invoices`
 * - Payment operations → `@/lib/actions/billing.payments`
 * - Analytics/queries → `@/lib/actions/billing.cache`
 * - Utilities → `@/lib/actions/billing.utils`
 *
 * **BENEFITS**:
 * - Server Actions with 'use server' directive
 * - Automatic cache invalidation
 * - Built-in audit logging
 * - Type-safe error handling
 *
 * This file maintained for backward compatibility only.
 * Will be removed on 2026-06-30.
 */

/**
 * Billing Management API - Unified Interface
 *
 * Complete billing management solution with modular architecture.
 * Provides unified access to all billing operations including invoices,
 * payments, analytics, and settings.
 *
 * @module services/modules/billingApi
 * @category Services
 *
 * @deprecated Use Server Actions instead:
 * - Invoice operations: @/lib/actions/billing.invoices
 * - Payment operations: @/lib/actions/billing.payments
 * - Analytics: @/lib/actions/billing.utils
 * - Cached reads: @/lib/actions/billing.cache
 */

import { apiClient } from '../../core/ApiClient';
import type { ApiClient } from '../../core/ApiClient';

// Import individual API classes
import { InvoiceManagementApi } from './invoices';
import { PaymentManagementApi } from './payments';
import { AnalyticsReportingApi } from './analytics';
import { SettingsNotificationsApi } from './settings';

// Re-export all types for convenience
export type * from './types';

// Re-export individual API classes
export { InvoiceManagementApi } from './invoices';
export { PaymentManagementApi } from './payments';
export { AnalyticsReportingApi } from './analytics';
export { SettingsNotificationsApi } from './settings';

// Re-export validation schemas and utilities
export { createInvoiceSchema, createPaymentSchema, createApiError } from './schemas';
export { BILLING_ENDPOINTS } from './endpoints';

/**
 * Unified Billing Management API
 *
 * Combines all billing-related operations into a single interface
 * while maintaining separation of concerns through modular architecture.
 *
 * @example
 * ```typescript
 * // Using modular API (recommended for new code)
 * const invoices = await billingApi.invoices.getInvoices(1, 20);
 * const payment = await billingApi.payments.recordPayment(paymentData);
 *
 * // Using backward compatible API (legacy support)
 * const invoices = await billingApi.getInvoices(1, 20);
 * const payment = await billingApi.recordPayment(paymentData);
 * ```
 */
export class BillingApi {
  public readonly invoices: InvoiceManagementApi;
  public readonly payments: PaymentManagementApi;
  public readonly analytics: AnalyticsReportingApi;
  public readonly settings: SettingsNotificationsApi;

  constructor(client: ApiClient) {
    this.invoices = new InvoiceManagementApi(client);
    this.payments = new PaymentManagementApi(client);
    this.analytics = new AnalyticsReportingApi(client);
    this.settings = new SettingsNotificationsApi(client);
  }

  // ==========================================
  // LEGACY COMPATIBILITY LAYER
  // ==========================================
  // These methods provide backward compatibility with the original API
  // by delegating to the appropriate modular services

  // ==========================================
  // Invoice Methods (delegate to invoices module)
  // ==========================================

  /**
   * Get invoices with filtering and pagination
   * @deprecated Use billingApi.invoices.getInvoices() instead
   */
  getInvoices(...args: Parameters<InvoiceManagementApi['getInvoices']>) {
    return this.invoices.getInvoices(...args);
  }

  /**
   * Get invoice by ID
   * @deprecated Use billingApi.invoices.getInvoiceById() instead
   */
  getInvoiceById(...args: Parameters<InvoiceManagementApi['getInvoiceById']>) {
    return this.invoices.getInvoiceById(...args);
  }

  /**
   * Create new invoice
   * @deprecated Use billingApi.invoices.createInvoice() instead
   */
  createInvoice(...args: Parameters<InvoiceManagementApi['createInvoice']>) {
    return this.invoices.createInvoice(...args);
  }

  /**
   * Update invoice
   * @deprecated Use billingApi.invoices.updateInvoice() instead
   */
  updateInvoice(...args: Parameters<InvoiceManagementApi['updateInvoice']>) {
    return this.invoices.updateInvoice(...args);
  }

  /**
   * Delete invoice
   * @deprecated Use billingApi.invoices.deleteInvoice() instead
   */
  deleteInvoice(...args: Parameters<InvoiceManagementApi['deleteInvoice']>) {
    return this.invoices.deleteInvoice(...args);
  }

  /**
   * Send invoice via email
   * @deprecated Use billingApi.invoices.sendInvoice() instead
   */
  sendInvoice(...args: Parameters<InvoiceManagementApi['sendInvoice']>) {
    return this.invoices.sendInvoice(...args);
  }

  /**
   * Download invoice as PDF
   * @deprecated Use billingApi.invoices.downloadInvoicePDF() instead
   */
  downloadInvoicePDF(...args: Parameters<InvoiceManagementApi['downloadInvoicePDF']>) {
    return this.invoices.downloadInvoicePDF(...args);
  }

  /**
   * Void invoice
   * @deprecated Use billingApi.invoices.voidInvoice() instead
   */
  voidInvoice(...args: Parameters<InvoiceManagementApi['voidInvoice']>) {
    return this.invoices.voidInvoice(...args);
  }

  // ==========================================
  // Payment Methods (delegate to payments module)
  // ==========================================

  /**
   * Get payments with filtering and pagination
   * @deprecated Use billingApi.payments.getPayments() instead
   */
  getPayments(...args: Parameters<PaymentManagementApi['getPayments']>) {
    return this.payments.getPayments(...args);
  }

  /**
   * Record new payment
   * @deprecated Use billingApi.payments.recordPayment() instead
   */
  recordPayment(...args: Parameters<PaymentManagementApi['recordPayment']>) {
    return this.payments.recordPayment(...args);
  }

  /**
   * Process refund
   * @deprecated Use billingApi.payments.processRefund() instead
   */
  processRefund(...args: Parameters<PaymentManagementApi['processRefund']>) {
    return this.payments.processRefund(...args);
  }

  /**
   * Void payment
   * @deprecated Use billingApi.payments.voidPayment() instead
   */
  voidPayment(...args: Parameters<PaymentManagementApi['voidPayment']>) {
    return this.payments.voidPayment(...args);
  }

  // ==========================================
  // Analytics Methods (delegate to analytics module)
  // ==========================================

  /**
   * Get billing analytics
   * @deprecated Use billingApi.analytics.getBillingAnalytics() instead
   */
  getBillingAnalytics(...args: Parameters<AnalyticsReportingApi['getBillingAnalytics']>) {
    return this.analytics.getBillingAnalytics(...args);
  }

  /**
   * Get revenue trends
   * @deprecated Use billingApi.analytics.getRevenueTrends() instead
   */
  getRevenueTrends(...args: Parameters<AnalyticsReportingApi['getRevenueTrends']>) {
    return this.analytics.getRevenueTrends(...args);
  }

  /**
   * Get payment analytics
   * @deprecated Use billingApi.analytics.getPaymentAnalytics() instead
   */
  getPaymentAnalytics(...args: Parameters<AnalyticsReportingApi['getPaymentAnalytics']>) {
    return this.analytics.getPaymentAnalytics(...args);
  }

  // ==========================================
  // Settings & Notifications Methods (delegate to settings module)
  // ==========================================

  /**
   * Get billing settings
   * @deprecated Use billingApi.settings.getBillingSettings() instead
   */
  getBillingSettings(...args: Parameters<SettingsNotificationsApi['getBillingSettings']>) {
    return this.settings.getBillingSettings(...args);
  }

  /**
   * Update billing settings
   * @deprecated Use billingApi.settings.updateBillingSettings() instead
   */
  updateBillingSettings(...args: Parameters<SettingsNotificationsApi['updateBillingSettings']>) {
    return this.settings.updateBillingSettings(...args);
  }

  /**
   * Send payment reminder
   * @deprecated Use billingApi.settings.sendPaymentReminder() instead
   */
  sendPaymentReminder(...args: Parameters<SettingsNotificationsApi['sendPaymentReminder']>) {
    return this.settings.sendPaymentReminder(...args);
  }

  /**
   * Send billing statement
   * @deprecated Use billingApi.settings.sendStatement() instead
   */
  sendStatement(...args: Parameters<SettingsNotificationsApi['sendStatement']>) {
    return this.settings.sendStatement(...args);
  }
}

/**
 * Factory function to create BillingApi instance
 *
 * @param client - ApiClient instance to use for HTTP requests
 * @returns A new BillingApi instance
 */
export function createBillingApi(client: ApiClient): BillingApi {
  return new BillingApi(client);
}

/**
 * Singleton instance of BillingApi
 * Pre-configured with the default apiClient
 */
export const billingApi = createBillingApi(apiClient);

// Default export for convenience
export default billingApi;
