/**
 * Billing API Endpoints
 *
 * Centralized definition of all billing-related API endpoints.
 * Provides type-safe endpoint path generation.
 *
 * @module services/modules/billingApi/endpoints
 * @category Configuration
 */

/**
 * Billing API endpoint definitions
 */
export const BILLING_ENDPOINTS = {
  // ==========================================
  // INVOICES
  // ==========================================
  INVOICES: '/billing/invoices',
  INVOICE_BY_ID: (id: string) => `/billing/invoices/${id}`,
  INVOICE_PDF: (id: string) => `/billing/invoices/${id}/pdf`,
  INVOICE_SEND: (id: string) => `/billing/invoices/${id}/send`,
  INVOICE_VOID: (id: string) => `/billing/invoices/${id}/void`,

  // ==========================================
  // PAYMENTS
  // ==========================================
  PAYMENTS: '/billing/payments',
  PAYMENT_BY_ID: (id: string) => `/billing/payments/${id}`,
  PAYMENT_REFUND: (id: string) => `/billing/payments/${id}/refund`,
  PAYMENT_VOID: (id: string) => `/billing/payments/${id}/void`,

  // ==========================================
  // ANALYTICS
  // ==========================================
  ANALYTICS: '/billing/analytics',
  REVENUE_TRENDS: '/billing/analytics/revenue-trends',
  PAYMENT_ANALYTICS: '/billing/analytics/payments',
  COLLECTION_METRICS: '/billing/analytics/collections',

  // ==========================================
  // REPORTS
  // ==========================================
  REPORTS: '/billing/reports',
  AGING_REPORT: '/billing/reports/aging',
  REVENUE_REPORT: '/billing/reports/revenue',
  PAYMENT_REPORT: '/billing/reports/payments',
  TAX_REPORT: '/billing/reports/tax',

  // ==========================================
  // SETTINGS
  // ==========================================
  SETTINGS: '/billing/settings',

  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  NOTIFICATIONS: '/billing/notifications',
  SEND_REMINDER: '/billing/notifications/reminder',
  SEND_STATEMENT: '/billing/notifications/statement',
} as const;
