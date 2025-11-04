/**
 * @fileoverview Server Actions for Inventory Management
 * @module app/inventory/actions
 *
 * Next.js App Router Server Actions for inventory item CRUD operations, stock management,
 * and multi-location tracking. HIPAA-compliant with audit logging for controlled substances.
 *
 * This is a barrel file that re-exports from specialized modules for better organization.
 * Each module is under 300 lines for improved maintainability.
 *
 * @example
 * ```typescript
 * 'use client';
 *
 * import { useActionState } from 'react';
 * import { createInventoryItemAction } from '@/lib/actions/inventory.actions';
 *
 * function InventoryForm() {
 *   const [state, formAction, isPending] = useActionState(createInventoryItemAction, { errors: {} });
 *   return <form action={formAction}>...</form>;
 * }
 * ```
 */

'use server';

// Re-export types
export type { ActionResult, PaginatedResult, InventoryStats } from './inventory.types';

// Re-export utility functions
export { BACKEND_URL, getAuthToken, getCurrentUserId, createAuditContext, enhancedFetch } from './inventory.utils';

// Re-export inventory item operations
export {
  createInventoryItemAction,
  getInventoryItemsAction,
  getInventoryItemAction,
  updateInventoryItemAction,
  deleteInventoryItemAction
} from './inventory.items';

// Re-export stock level operations
export {
  getStockLevelsAction,
  createStockLevelAction
} from './inventory.stock';

// Re-export location operations
export {
  getInventoryLocationsAction,
  createInventoryLocationAction
} from './inventory.locations';

// Re-export batch operations
export {
  getExpiringBatchesAction,
  createBatchAction
} from './inventory.batches';

// Re-export analytics operations
export {
  getInventoryCategoriesAction,
  getInventoryStats,
  getInventoryDashboardData
} from './inventory.analytics';
