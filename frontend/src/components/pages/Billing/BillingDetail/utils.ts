/**
 * BillingDetail Utilities
 *
 * Shared utility functions for billing detail views and calculations.
 */

import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Receipt,
  CreditCard,
  Banknote,
  Building,
  Shield,
  Wallet
} from 'lucide-react';
import type { InvoiceStatus, PaymentMethod, StatusConfig, PaymentMethodConfig } from './types';

/**
 * Formats currency amount to USD
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

/**
 * Gets status configuration with color, icon, label, and description
 */
export const getStatusConfig = (status: InvoiceStatus): StatusConfig => {
  const configs: Record<InvoiceStatus, StatusConfig> = {
    draft: {
      color: 'text-gray-600 bg-gray-100 border-gray-200',
      icon: FileText,
      label: 'Draft',
      description: 'Invoice is being prepared'
    },
    sent: {
      color: 'text-blue-600 bg-blue-100 border-blue-200',
      icon: Clock,
      label: 'Sent',
      description: 'Invoice has been sent to patient'
    },
    paid: {
      color: 'text-green-600 bg-green-100 border-green-200',
      icon: CheckCircle,
      label: 'Paid',
      description: 'Invoice has been fully paid'
    },
    overdue: {
      color: 'text-red-600 bg-red-100 border-red-200',
      icon: AlertTriangle,
      label: 'Overdue',
      description: 'Payment is past due date'
    },
    cancelled: {
      color: 'text-gray-600 bg-gray-100 border-gray-200',
      icon: X,
      label: 'Cancelled',
      description: 'Invoice has been cancelled'
    },
    refunded: {
      color: 'text-orange-600 bg-orange-100 border-orange-200',
      icon: Receipt,
      label: 'Refunded',
      description: 'Payment has been refunded'
    }
  };
  return configs[status];
};

/**
 * Gets payment method icon and label configuration
 */
export const getPaymentMethodConfig = (method: PaymentMethod): PaymentMethodConfig => {
  const configs: Record<PaymentMethod, PaymentMethodConfig> = {
    cash: { icon: Banknote, label: 'Cash' },
    check: { icon: FileText, label: 'Check' },
    'credit-card': { icon: CreditCard, label: 'Credit Card' },
    'debit-card': { icon: CreditCard, label: 'Debit Card' },
    'bank-transfer': { icon: Building, label: 'Bank Transfer' },
    insurance: { icon: Shield, label: 'Insurance' }
  };
  return configs[method] || { icon: Wallet, label: 'Other' };
};

/**
 * Calculates number of days overdue
 * Returns 0 if not overdue
 */
export const getDaysOverdue = (dueDate: string): number => {
  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = now.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

/**
 * Calculates payment percentage
 */
export const calculatePaymentPercentage = (amountPaid: number, totalAmount: number): number => {
  return totalAmount > 0 ? Math.round((amountPaid / totalAmount) * 100) : 0;
};

/**
 * Formats date to localized string
 */
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString();
};

/**
 * Formats date and time to localized string
 */
export const formatDateTime = (date: string): string => {
  const d = new Date(date);
  return `${d.toLocaleDateString()} at ${d.toLocaleTimeString()}`;
};
