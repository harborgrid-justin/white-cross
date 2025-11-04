/**
 * Inventory Domain Hooks - Central Export Hub
 *
 * Provides comprehensive hooks for inventory management including:
 * - Stock level tracking and alerts
 * - CRUD operations for inventory items
 * - Stock adjustments and history
 * - Medication inventory with batch/expiration tracking
 * - Real-time statistics and metrics
 *
 * @module hooks/domains/inventory
 */

// Inventory Management Hooks (now modularized)
export * from './useInventory';
export * from './useInventoryManagement';

// Direct exports from modular hooks for convenience
export type { InventoryFilters } from './types';
export { useInventory, useInventoryItem } from './useInventory.queries';
export { useInventoryAlerts, useInventoryStats } from './useInventory.alerts';
export { useStockHistory } from './useInventory.history';
export { useStockAdjustment } from './useInventory.mutations';
