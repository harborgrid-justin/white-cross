import {
  Clock,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  X,
  Receipt,
  Banknote,
  FileText,
  CreditCard,
  Building,
  Shield,
  Wallet
} from 'lucide-react';
import { PaymentMethod } from '../BillingCard';
import { PaymentStatus, PaymentType, PaymentFilterOptions } from './types';

/**
 * Status configuration interface
 */
export interface StatusConfig {
  color: string;
  icon: typeof Clock;
  label: string;
}

/**
 * Payment method configuration interface
 */
export interface PaymentMethodConfig {
  icon: typeof Banknote;
  label: string;
  color: string;
}

/**
 * Payment type configuration interface
 */
export interface PaymentTypeConfig {
  color: string;
  label: string;
}

/**
 * Formats currency amount
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

/**
 * Gets payment status configuration
 */
export const getStatusConfig = (status: PaymentStatus): StatusConfig => {
  const configs: Record<PaymentStatus, StatusConfig> = {
    pending: {
      color: 'text-yellow-600 bg-yellow-100 border-yellow-200',
      icon: Clock,
      label: 'Pending'
    },
    processing: {
      color: 'text-blue-600 bg-blue-100 border-blue-200',
      icon: RefreshCw,
      label: 'Processing'
    },
    completed: {
      color: 'text-green-600 bg-green-100 border-green-200',
      icon: CheckCircle,
      label: 'Completed'
    },
    failed: {
      color: 'text-red-600 bg-red-100 border-red-200',
      icon: AlertTriangle,
      label: 'Failed'
    },
    cancelled: {
      color: 'text-gray-600 bg-gray-100 border-gray-200',
      icon: X,
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
 * Gets payment method configuration
 */
export const getPaymentMethodConfig = (method: PaymentMethod): PaymentMethodConfig => {
  const configs: Record<PaymentMethod, PaymentMethodConfig> = {
    cash: { icon: Banknote, label: 'Cash', color: 'text-green-600' },
    check: { icon: FileText, label: 'Check', color: 'text-blue-600' },
    'credit-card': { icon: CreditCard, label: 'Credit Card', color: 'text-purple-600' },
    'debit-card': { icon: CreditCard, label: 'Debit Card', color: 'text-indigo-600' },
    'bank-transfer': { icon: Building, label: 'Bank Transfer', color: 'text-gray-600' },
    insurance: { icon: Shield, label: 'Insurance', color: 'text-blue-600' }
  };
  return configs[method] || { icon: Wallet, label: 'Other', color: 'text-gray-600' };
};

/**
 * Gets payment type configuration
 */
export const getPaymentTypeConfig = (type: PaymentType): PaymentTypeConfig => {
  const configs: Record<PaymentType, PaymentTypeConfig> = {
    payment: { color: 'bg-green-100 text-green-800', label: 'Payment' },
    refund: { color: 'bg-orange-100 text-orange-800', label: 'Refund' },
    adjustment: { color: 'bg-blue-100 text-blue-800', label: 'Adjustment' },
    'write-off': { color: 'bg-red-100 text-red-800', label: 'Write-off' },
    transfer: { color: 'bg-purple-100 text-purple-800', label: 'Transfer' }
  };
  return configs[type];
};

/**
 * Gets active filter count
 */
export const getActiveFilterCount = (filters: PaymentFilterOptions): number => {
  return filters.status.length +
         filters.method.length +
         filters.type.length +
         (filters.dateRange ? 1 : 0) +
         (filters.amountRange.min > 0 || filters.amountRange.max < 10000 ? 1 : 0);
};

/**
 * Calculates success rate percentage
 */
export const calculateSuccessRate = (totalPayments: number, failedPayments: number): number => {
  return totalPayments > 0 ? Math.round(((totalPayments - failedPayments) / totalPayments) * 100) : 0;
};
