/**
 * @fileoverview Purchase Orders Constants
 * @module lib/actions/purchase-orders/constants
 *
 * Runtime constant values for purchase order management.
 * Separated from type definitions for proper type-only imports.
 */

// ==========================================
// CACHE CONFIGURATION
// ==========================================

/**
 * Cache tags for purchase order operations
 */
export const PURCHASE_ORDER_CACHE_TAGS = {
  ORDERS: 'purchase-orders',
  ITEMS: 'purchase-order-items',
  VENDORS: 'purchase-order-vendors',
  APPROVALS: 'purchase-order-approvals',
  BUDGETS: 'purchase-order-budgets',
} as const;
