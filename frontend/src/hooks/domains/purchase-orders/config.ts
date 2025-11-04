/**
 * Purchase Orders Configuration and Type Definitions
 *
 * Re-exports all purchase orders domain exports from modular files.
 * This file maintains backward compatibility while enabling better code organization.
 *
 * @module hooks/domains/purchase-orders/config
 */

// Query Keys
export { purchaseOrderKeys } from './query-keys';

// Cache Configuration
export { PURCHASE_ORDERS_CACHE_CONFIG, invalidatePOQueries } from './cache-config';

// Types
export type {
  PurchaseOrder,
  POContact,
  POAddress,
  POLineItem,
  POApprovalWorkflow,
  POApprovalLevel,
  POReceipt,
  POReceiptLineItem,
  PODocument,
  POAnalytics,
} from './types';

// Utilities
export {
  calculatePOTotals,
  getPOStatusColor,
  canEditPO,
  canCancelPO,
  getNextPOStatus,
} from './utils';
