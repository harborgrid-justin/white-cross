/**
 * Billing API Type Definitions
 *
 * Comprehensive type definitions for billing and payment management.
 * Provides type safety for invoices, payments, analytics, and settings.
 *
 * @module services/modules/billingApi/types
 * @category Types
 */

// =====================
// ENUMS & CONSTANTS
// =====================

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
export type InvoicePriority = 'low' | 'medium' | 'high' | 'urgent';
export type PaymentMethod = 'cash' | 'check' | 'credit-card' | 'debit-card' | 'bank-transfer' | 'insurance';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
export type PaymentType = 'payment' | 'refund' | 'adjustment' | 'write-off' | 'transfer';
export type ServiceCategory = 'consultation' | 'treatment' | 'medication' | 'supplies' | 'equipment' | 'other';

// =====================
// CORE ENTITIES
// =====================

/**
 * Patient address information
 */
export interface PatientAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

/**
 * Invoice line item representing a billable service or product
 */
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

/**
 * Payment record for tracking financial transactions
 */
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
  metadata?: Record<string, unknown>;
}

/**
 * Comprehensive billing invoice
 */
export interface BillingInvoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  patientEmail?: string;
  patientPhone?: string;
  patientAddress?: PatientAddress;
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

/**
 * Billing analytics data
 */
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

/**
 * Billing system settings and configuration
 */
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

/**
 * Request payload for creating a new invoice
 */
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

/**
 * Request payload for updating an existing invoice
 */
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

/**
 * Request payload for creating a payment record
 */
export interface CreatePaymentRequest {
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
  transactionId?: string;
  authorizationCode?: string;
}

/**
 * Request payload for processing a refund
 */
export interface ProcessRefundRequest {
  paymentId: string;
  amount: number;
  reason: string;
  refundMethod?: PaymentMethod;
}

/**
 * Filters for querying invoices
 */
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

/**
 * Filters for querying payments
 */
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
// ANALYTICS TYPES
// =====================

/**
 * Revenue trend data point
 */
export interface RevenueTrend {
  period: string;
  revenue: number;
  invoiceCount: number;
  averageValue: number;
}

/**
 * Payment method analytics
 */
export interface PaymentMethodAnalytics {
  method: PaymentMethod;
  count: number;
  amount: number;
}

/**
 * Payment analytics summary
 */
export interface PaymentAnalytics {
  totalPayments: number;
  totalAmount: number;
  averagePaymentTime: number;
  paymentMethods: PaymentMethodAnalytics[];
  refundRate: number;
  chargebackRate: number;
}
