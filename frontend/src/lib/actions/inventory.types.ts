/**
 * @fileoverview Shared Types for Inventory Management
 * @module lib/actions/inventory.types
 *
 * Common type definitions used across inventory action modules.
 */

/**
 * Standard action result format for form submissions
 */
export interface ActionResult<T = unknown> {
  success?: boolean;
  data?: T;
  errors?: Record<string, string[]> & {
    _form?: string[];
  };
  message?: string;
}

/**
 * Paginated result format for list queries
 */
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Inventory Statistics Interface
 * Dashboard metrics for inventory management overview
 */
export interface InventoryStats {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  expiringItems: number;
  totalValue: number;
  avgStockLevel: number;
  recentTransactions: number;
  categories: {
    medical: number;
    supplies: number;
    equipment: number;
    pharmaceuticals: number;
    maintenance: number;
    other: number;
  };
  stockStatus: {
    adequate: number;
    low: number;
    critical: number;
    outOfStock: number;
  };
}
