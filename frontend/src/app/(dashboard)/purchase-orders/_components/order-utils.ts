/**
 * Purchase Order Utilities
 *
 * Shared utility functions for purchase order formatting, calculations, and helpers
 */

import type { PurchaseOrderStatus } from '@/types/domain/purchaseOrders';

/**
 * Format currency amount to USD
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date string to readable format
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Get status badge color classes
 */
export const getStatusBadgeClasses = (status: PurchaseOrderStatus): string => {
  const styles: Record<PurchaseOrderStatus, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-blue-100 text-blue-800',
    ORDERED: 'bg-indigo-100 text-indigo-800',
    PARTIALLY_RECEIVED: 'bg-purple-100 text-purple-800',
    RECEIVED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };
  return styles[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Format status for display (replace underscores with spaces)
 */
export const formatStatus = (status: PurchaseOrderStatus): string => {
  return status.replace(/_/g, ' ');
};

/**
 * Calculate percentage for progress bar
 */
export const calculatePercentage = (current: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
};

/**
 * Determine if order is overdue
 */
export const isOrderOverdue = (expectedDate: string, status: PurchaseOrderStatus): boolean => {
  if (status === 'RECEIVED' || status === 'CANCELLED') return false;
  const expected = new Date(expectedDate);
  const now = new Date();
  return expected < now;
};

/**
 * Get days until/since expected date
 */
export const getDaysUntilExpected = (expectedDate: string): number => {
  const expected = new Date(expectedDate);
  const now = new Date();
  const diffTime = expected.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
