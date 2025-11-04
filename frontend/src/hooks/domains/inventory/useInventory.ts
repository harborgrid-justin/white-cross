/**
 * Inventory Management Hooks - Re-export Module
 *
 * This file has been refactored into smaller, focused modules for better maintainability.
 * All functionality is preserved and re-exported from the new module structure.
 *
 * Module breakdown:
 * - types.ts - Shared TypeScript interfaces and types
 * - useInventory.queries.ts - Query hooks (useInventory, useInventoryItem)
 * - useInventory.alerts.ts - Alert and statistics hooks
 * - useInventory.history.ts - Stock history tracking
 * - useInventory.mutations.ts - Mutation hooks (stock adjustments)
 *
 * @module hooks/domains/inventory/useInventory
 */

// Re-export all types
export type { InventoryFilters } from './types';

// Re-export query hooks (CRUD operations and single item queries)
export { useInventory, useInventoryItem } from './useInventory.queries';

// Re-export alert and statistics hooks
export { useInventoryAlerts, useInventoryStats } from './useInventory.alerts';

// Re-export history tracking hooks
export { useStockHistory } from './useInventory.history';

// Re-export mutation hooks
export { useStockAdjustment } from './useInventory.mutations';
