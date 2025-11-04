/**
 * BillingDetail Module Exports
 *
 * Centralized exports for the BillingDetail component and its sub-components.
 */

// Main component
export { default } from './BillingDetail';
export { default as BillingDetail } from './BillingDetail';

// Tab components
export { default as InvoiceOverview } from './InvoiceOverview';
export { default as PaymentHistory } from './PaymentHistory';
export { default as ServiceLineItems } from './ServiceLineItems';
export { default as InvoiceHistory } from './InvoiceHistory';
export { default as InvoiceDocuments } from './InvoiceDocuments';

// Types
export type {
  BillingDetailTab,
  BillingDetailProps,
  InvoiceOverviewProps,
  PaymentHistoryProps,
  ServiceLineItemsProps,
  InvoiceHistoryProps,
  InvoiceDocumentsProps,
  StatusConfig,
  PaymentMethodConfig
} from './types';

// Re-export types from BillingCard for convenience
export type {
  BillingInvoice,
  InvoiceStatus,
  PaymentMethod,
  InvoicePriority,
  ServiceCategory,
  InvoiceLineItem,
  PaymentRecord
} from './types';

// Utilities
export {
  formatCurrency,
  getStatusConfig,
  getPaymentMethodConfig,
  getDaysOverdue,
  calculatePaymentPercentage,
  formatDate,
  formatDateTime
} from './utils';
