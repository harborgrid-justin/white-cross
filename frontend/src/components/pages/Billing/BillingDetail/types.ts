/**
 * BillingDetail Types
 *
 * Centralized type definitions for the BillingDetail component and its sub-components.
 */

// Re-export types from BillingCard
export type {
  BillingInvoice,
  InvoiceStatus,
  PaymentMethod,
  InvoicePriority,
  ServiceCategory,
  InvoiceLineItem,
  PaymentRecord
} from '../BillingCard';

/**
 * Detail view tab types
 */
export type BillingDetailTab = 'overview' | 'payments' | 'services' | 'history' | 'documents';

/**
 * Props for the BillingDetail component
 */
export interface BillingDetailProps {
  /** Invoice data */
  invoice?: BillingInvoice;
  /** Loading state */
  loading?: boolean;
  /** Active tab */
  activeTab?: BillingDetailTab;
  /** Custom CSS classes */
  className?: string;
  /** Tab change handler */
  onTabChange?: (tab: BillingDetailTab) => void;
  /** Edit invoice handler */
  onEditInvoice?: (invoice: BillingInvoice) => void;
  /** Delete invoice handler */
  onDeleteInvoice?: (invoice: BillingInvoice) => void;
  /** Download invoice handler */
  onDownloadInvoice?: (invoice: BillingInvoice) => void;
  /** Send invoice handler */
  onSendInvoice?: (invoice: BillingInvoice) => void;
  /** Print invoice handler */
  onPrintInvoice?: (invoice: BillingInvoice) => void;
  /** Share invoice handler */
  onShareInvoice?: (invoice: BillingInvoice) => void;
  /** Record payment handler */
  onRecordPayment?: (invoice: BillingInvoice) => void;
  /** Edit payment handler */
  onEditPayment?: (payment: PaymentRecord) => void;
  /** Delete payment handler */
  onDeletePayment?: (payment: PaymentRecord) => void;
  /** Add service handler */
  onAddService?: (invoice: BillingInvoice) => void;
  /** Edit service handler */
  onEditService?: (service: InvoiceLineItem) => void;
  /** Delete service handler */
  onDeleteService?: (service: InvoiceLineItem) => void;
  /** View patient handler */
  onViewPatient?: (patientId: string) => void;
  /** View provider handler */
  onViewProvider?: (providerId: string) => void;
  /** Back handler */
  onBack?: () => void;
}

/**
 * Props for InvoiceOverview component
 */
export interface InvoiceOverviewProps {
  /** Invoice data */
  invoice: BillingInvoice;
  /** Edit invoice handler */
  onEditInvoice?: (invoice: BillingInvoice) => void;
  /** Download invoice handler */
  onDownloadInvoice?: (invoice: BillingInvoice) => void;
  /** Send invoice handler */
  onSendInvoice?: (invoice: BillingInvoice) => void;
  /** Print invoice handler */
  onPrintInvoice?: (invoice: BillingInvoice) => void;
  /** Record payment handler */
  onRecordPayment?: (invoice: BillingInvoice) => void;
  /** View patient handler */
  onViewPatient?: (patientId: string) => void;
}

/**
 * Props for PaymentHistory component
 */
export interface PaymentHistoryProps {
  /** Invoice data */
  invoice: BillingInvoice;
  /** Record payment handler */
  onRecordPayment?: (invoice: BillingInvoice) => void;
  /** Edit payment handler */
  onEditPayment?: (payment: PaymentRecord) => void;
  /** Delete payment handler */
  onDeletePayment?: (payment: PaymentRecord) => void;
}

/**
 * Props for ServiceLineItems component
 */
export interface ServiceLineItemsProps {
  /** Invoice data */
  invoice: BillingInvoice;
  /** Add service handler */
  onAddService?: (invoice: BillingInvoice) => void;
  /** Edit service handler */
  onEditService?: (service: InvoiceLineItem) => void;
  /** Delete service handler */
  onDeleteService?: (service: InvoiceLineItem) => void;
}

/**
 * Props for InvoiceHistory component
 */
export interface InvoiceHistoryProps {
  /** Invoice data */
  invoice: BillingInvoice;
}

/**
 * Props for InvoiceDocuments component
 */
export interface InvoiceDocumentsProps {
  /** Invoice data */
  invoice: BillingInvoice;
}

/**
 * Status configuration interface
 */
export interface StatusConfig {
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
}

/**
 * Payment method configuration interface
 */
export interface PaymentMethodConfig {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}
