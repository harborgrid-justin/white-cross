/**
 * @fileoverview Purchase Order Management Server Actions - Next.js v14+ Compatible
 * @module app/purchase-orders/actions
 *
 * HIPAA-compliant server actions for purchase order management with comprehensive
 * caching, audit logging, and error handling.
 *
 * This file serves as the main entry point for all purchase order operations,
 * re-exporting functionality from specialized modules:
 * - Types and interfaces (purchase-orders.types.ts)
 * - Cache functions (purchase-orders.cache.ts)
 * - CRUD operations (purchase-orders.crud.ts)
 * - Approval workflow (purchase-orders.approvals.ts)
 * - Status management (purchase-orders.status.ts)
 * - Form handling (purchase-orders.forms.ts)
 * - Utility functions (purchase-orders.utils.ts)
 * - Dashboard analytics (purchase-orders.dashboard.ts)
 *
 * NOTE: This barrel file does NOT have 'use server' directive.
 * The 'use server' directive is present in implementation files that define
 * actual Server Actions. Barrel files cannot have 'use server' when re-exporting.
 */

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export type {
  ActionResult,
  PurchaseOrder,
  PurchaseOrderItem,
  PurchaseOrderApproval,
  CreatePurchaseOrderData,
  UpdatePurchaseOrderData,
  PurchaseOrderFilters,
  PurchaseOrderAnalytics
} from './purchase-orders.types';

export { PURCHASE_ORDER_CACHE_TAGS } from './purchase-orders.types';

// ==========================================
// CACHE FUNCTIONS
// ==========================================

export {
  getPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderAnalytics,
  getPurchaseOrderItems
} from './purchase-orders.cache';

// ==========================================
// CRUD OPERATIONS
// ==========================================

export {
  createPurchaseOrderAction,
  updatePurchaseOrderAction
} from './purchase-orders.crud';

// ==========================================
// APPROVAL WORKFLOW
// ==========================================

export {
  submitPurchaseOrderAction,
  approvePurchaseOrderAction,
  rejectPurchaseOrderAction
} from './purchase-orders.approvals';

// ==========================================
// STATUS MANAGEMENT
// ==========================================

export {
  cancelPurchaseOrderAction
} from './purchase-orders.status';

// ==========================================
// FORM HANDLING
// ==========================================

export {
  createPurchaseOrderFromForm
} from './purchase-orders.forms';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export {
  purchaseOrderExists,
  getPurchaseOrderCount,
  getPurchaseOrderOverview,
  clearPurchaseOrderCache
} from './purchase-orders.utils';

// ==========================================
// DASHBOARD FUNCTIONS
// ==========================================

export {
  getPurchaseOrdersStats,
  getPurchaseOrdersDashboardData
} from './purchase-orders.dashboard';
