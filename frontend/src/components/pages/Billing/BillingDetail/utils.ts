/**
 * @fileoverview BillingDetail Utilities
 * @module components/pages/Billing/BillingDetail/utils
 * @category Healthcare - Billing Management
 */

import {
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Receipt,
  Banknote,
  CreditCard,
  Building,
  Shield,
  Wallet,
  User,
  Calendar,
  History,
  Tag,
  Eye,
  Printer,
  Share2,
  Trash2
} from 'lucide-react';

import { InvoiceStatus, PaymentMethod } from '../BillingCard';
import { StatusConfig, PaymentMethodConfig, TabConfig, BillingDetailTab } from './types';

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
 * Gets status configuration for invoice statuses
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
 * Gets payment method configuration
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
 * Calculates days overdue from due date
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
export const getPaymentPercentage = (totalAmount: number, amountPaid: number): number => {
  return totalAmount > 0 ? Math.round((amountPaid / totalAmount) * 100) : 0;
};

/**
 * Tab configurations for navigation
 */
export const TAB_CONFIGS: TabConfig[] = [
  { id: 'overview', label: 'Overview', icon: Eye },
  { id: 'payments', label: 'Payments', icon: DollarSign },
  { id: 'services', label: 'Services', icon: Tag },
  { id: 'history', label: 'History', icon: History },
  { id: 'documents', label: 'Documents', icon: FileText }
];

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
  const dateObj = new Date(date);
  return `${dateObj.toLocaleDateString()} at ${dateObj.toLocaleTimeString()}`;
};

/**
 * Gets CSS classes for payment percentage bar
 */
export const getPaymentProgressColor = (percentage: number): string => {
  return percentage === 100 ? 'bg-green-600' : 'bg-blue-600';
};

/**
 * Gets CSS classes for balance due amount
 */
export const getBalanceDueColor = (balanceDue: number): string => {
  return balanceDue > 0 ? 'text-red-600' : 'text-green-600';
};

/**
 * Gets CSS classes for insurance status
 */
export const getInsuranceStatusColor = (status?: string): string => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'denied':
      return 'bg-red-100 text-red-800';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Capitalizes first letter of string
 */
export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Formats service category for display
 */
export const formatServiceCategory = (category: string): string => {
  return category.replace('-', ' ');
};
