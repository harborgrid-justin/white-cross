/**
 * Utility functions for BillingHeader component
 *
 * This module contains helper functions used by the BillingHeader
 * component and its subcomponents.
 */

import { BillingFilterOptions } from './types';

/**
 * Formats a number as currency (USD)
 *
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "$1,234")
 *
 * @example
 * formatCurrency(1234.56) // Returns "$1,235"
 * formatCurrency(0) // Returns "$0"
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Calculates the number of active filters
 *
 * @param filters - The filter options to count
 * @returns Total count of active filters
 *
 * @example
 * getActiveFilterCount({
 *   status: ['paid', 'sent'],
 *   priority: [],
 *   paymentMethod: ['cash'],
 *   dateRange: 'month',
 *   amountRange: { min: 0, max: 10000 }
 * }) // Returns 3 (2 status + 1 payment method + 1 date range)
 */
export const getActiveFilterCount = (filters: BillingFilterOptions): number => {
  return (
    filters.status.length +
    filters.priority.length +
    filters.paymentMethod.length +
    (filters.dateRange ? 1 : 0) +
    (filters.amountRange.min > 0 || filters.amountRange.max < 10000 ? 1 : 0)
  );
};

/**
 * Creates a default/empty filter state
 *
 * @returns Default BillingFilterOptions with no active filters
 */
export const createDefaultFilters = (): BillingFilterOptions => ({
  status: [],
  priority: [],
  paymentMethod: [],
  dateRange: '',
  amountRange: { min: 0, max: 10000 }
});
