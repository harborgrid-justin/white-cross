import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Receipt,
  Banknote,
  CreditCard,
  Building,
  Wallet
} from 'lucide-react';
import { InvoiceStatus, InvoicePriority, PaymentMethod } from '../BillingCard';
import type { LucideIcon } from 'lucide-react';

/**
 * Status configuration
 */
export interface StatusConfig {
  color: string;
  icon: LucideIcon;
  label: string;
}

/**
 * Priority configuration
 */
export interface PriorityConfig {
  color: string;
  dot: string;
}

/**
 * Formats currency amount to USD format
 *
 * @param amount - The numeric amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

/**
 * Gets status configuration including color, icon, and label
 *
 * @param status - The invoice status
 * @returns Status configuration object
 */
export const getStatusConfig = (status: InvoiceStatus): StatusConfig => {
  const configs: Record<InvoiceStatus, StatusConfig> = {
    draft: {
      color: 'text-gray-600 bg-gray-100 border-gray-200',
      icon: FileText,
      label: 'Draft'
    },
    sent: {
      color: 'text-blue-600 bg-blue-100 border-blue-200',
      icon: Clock,
      label: 'Sent'
    },
    paid: {
      color: 'text-green-600 bg-green-100 border-green-200',
      icon: CheckCircle,
      label: 'Paid'
    },
    overdue: {
      color: 'text-red-600 bg-red-100 border-red-200',
      icon: AlertTriangle,
      label: 'Overdue'
    },
    cancelled: {
      color: 'text-gray-600 bg-gray-100 border-gray-200',
      icon: FileText,
      label: 'Cancelled'
    },
    refunded: {
      color: 'text-orange-600 bg-orange-100 border-orange-200',
      icon: Receipt,
      label: 'Refunded'
    }
  };
  return configs[status];
};

/**
 * Gets priority configuration including color and dot styles
 *
 * @param priority - The invoice priority
 * @returns Priority configuration object
 */
export const getPriorityConfig = (priority: InvoicePriority): PriorityConfig => {
  const configs: Record<InvoicePriority, PriorityConfig> = {
    low: { color: 'text-gray-600', dot: 'bg-gray-400' },
    medium: { color: 'text-yellow-600', dot: 'bg-yellow-400' },
    high: { color: 'text-orange-600', dot: 'bg-orange-400' },
    urgent: { color: 'text-red-600', dot: 'bg-red-400' }
  };
  return configs[priority];
};

/**
 * Gets payment method icon component
 *
 * @param method - The payment method
 * @returns Lucide icon component
 */
export const getPaymentMethodIcon = (method: PaymentMethod): LucideIcon => {
  const icons: Record<PaymentMethod, LucideIcon> = {
    cash: Banknote,
    check: FileText,
    'credit-card': CreditCard,
    'debit-card': CreditCard,
    'bank-transfer': Building,
    insurance: Building
  };
  return icons[method] || Wallet;
};

/**
 * Calculates days until due date
 *
 * @param dueDate - The due date string (ISO format)
 * @returns Number of days until due (negative if overdue)
 */
export const getDaysUntilDue = (dueDate: string): number => {
  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Calculates payment progress percentage
 *
 * @param amountPaid - Amount that has been paid
 * @param totalAmount - Total invoice amount
 * @returns Payment percentage (0-100)
 */
export const calculatePaymentPercentage = (amountPaid: number, totalAmount: number): number => {
  if (totalAmount <= 0) return 0;
  return Math.round((amountPaid / totalAmount) * 100);
};
