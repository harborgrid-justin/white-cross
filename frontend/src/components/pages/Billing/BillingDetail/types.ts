/**
 * @fileoverview BillingDetail Types
 * @module components/pages/Billing/BillingDetail/types
 * @category Healthcare - Billing Management
 */

import React from 'react';
import { BillingInvoice, InvoiceLineItem, PaymentRecord } from '../BillingCard';

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
 * Status configuration for invoice statuses
 */
export interface StatusConfig {
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
}

/**
 * Payment method configuration
 */
export interface PaymentMethodConfig {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

/**
 * Tab configuration for navigation
 */
export interface TabConfig {
  id: BillingDetailTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}
