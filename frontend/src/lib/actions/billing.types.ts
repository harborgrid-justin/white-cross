/**
 * @fileoverview Billing Type Definitions
 * @module app/billing/types
 *
 * TypeScript type definitions and interfaces for billing operations.
 * Shared types used across all billing modules.
 */

'use server';

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ==========================================
// ACTION RESULT TYPES
// ==========================================

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

// ==========================================
// INVOICE TYPES
// ==========================================

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

export interface InvoiceFilters {
  status?: Invoice['status'];
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

// ==========================================
// PAYMENT TYPES
// ==========================================

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

export interface PaymentFilters {
  status?: Payment['status'];
  paymentMethod?: Payment['paymentMethod'];
  invoiceId?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ==========================================
// ANALYTICS TYPES
// ==========================================

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
// BILLING RECORD TYPES
// ==========================================

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
