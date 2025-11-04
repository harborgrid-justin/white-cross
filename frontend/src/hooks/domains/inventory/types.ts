/**
 * Inventory Management Types
 *
 * Shared TypeScript types and interfaces for inventory hooks.
 *
 * @module hooks/domains/inventory/types
 */

/**
 * Filter criteria for inventory queries.
 *
 * Supports pagination, category/supplier filtering, location-based queries,
 * and stock level/maintenance status filtering.
 *
 * @interface InventoryFilters
 * @property {number} [page] - Page number for pagination (1-indexed)
 * @property {number} [limit] - Items per page (default: 20)
 * @property {string} [category] - Filter by category ID or name
 * @property {string} [supplier] - Filter by supplier/vendor ID
 * @property {string} [location] - Filter by storage location ID
 * @property {boolean} [lowStock] - Show only low stock items (below reorder point)
 * @property {boolean} [needsMaintenance] - Show items requiring maintenance
 * @property {boolean} [isActive] - Filter by active/inactive status
 */
export interface InventoryFilters {
  page?: number;
  limit?: number;
  category?: string;
  supplier?: string;
  location?: string;
  lowStock?: boolean;
  needsMaintenance?: boolean;
  isActive?: boolean;
}
