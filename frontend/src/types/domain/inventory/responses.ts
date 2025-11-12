/**
 * WF-COMP-328 | responses.ts - Inventory API response type definitions
 * Purpose: Response interfaces for inventory API operations
 * Upstream: None | Dependencies: core-entities
 * Downstream: API services, hooks, components | Called by: Inventory API client
 * Related: requests, statistics
 * Exports: API response types, paginated responses, analytics responses
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: API response → Data parsing → State management → UI update
 * LLM Context: API response types for inventory operations
 */

import type { InventoryItem, InventoryTransaction } from './core-entities';

/**
 * Paginated Inventory Items Response
 * Response for paginated inventory item queries
 */
export interface InventoryItemsResponse {
  items: InventoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Inventory Item with Current Stock Response
 * Response including current stock level calculation
 */
export interface InventoryItemWithStockResponse extends InventoryItem {
  currentStock: number;
}

/**
 * Stock History Response
 * Paginated response for inventory transaction history
 */
export interface StockHistoryResponse {
  history: InventoryTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Inventory Valuation Response
 * Response for inventory valuation by category
 */
export interface InventoryValuationResponse {
  category: string;
  itemCount: number;
  totalValue: number;
  totalQuantity: number;
}

/**
 * Usage Analytics Response
 * Response for inventory usage analytics and trends
 */
export interface UsageAnalyticsResponse {
  name: string;
  category: string;
  transactionCount: number;
  totalUsage: number;
  averageUsage: number;
  totalPurchased: number;
}

/**
 * Supplier Performance Response
 * Analytics response for supplier performance metrics
 */
export interface SupplierPerformanceResponse {
  supplier: string;
  itemCount: number;
  averageUnitCost: number;
  totalPurchased: number;
  totalSpent: number;
}
