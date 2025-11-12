/**
 * WF-COMP-328 | statistics.ts - Inventory statistics and analytics type definitions
 * Purpose: Types for inventory statistics, analytics, and dashboard data
 * Upstream: None | Dependencies: enums, core-entities
 * Downstream: Dashboard components, analytics views | Called by: Statistics services
 * Related: responses, core-entities
 * Exports: Statistics interfaces, breakdown types, dashboard data
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Data aggregation → Statistics calculation → Dashboard display
 * LLM Context: Inventory statistics and analytics types for reporting
 */

import type { InventoryTransactionType } from './enums';

/**
 * Inventory Statistics Overview
 * High-level statistics for inventory management dashboard
 */
export interface InventoryStatsOverview {
  totalItems: number;
  activeItems: number;
  inactiveItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  criticalAlerts: number;
  highAlerts: number;
  mediumAlerts: number;
}

/**
 * Category Breakdown Statistics
 * Detailed breakdown of inventory by category
 */
export interface CategoryBreakdownStats {
  category: string;
  itemCount: number;
  totalQuantity: number;
  totalValue: number;
}

/**
 * Category Breakdown for Dashboard
 * Simplified category breakdown for dashboard display
 */
export interface CategoryBreakdown {
  category: string;
  itemCount: number;
  totalValue: number;
  lowStockCount?: number;
  outOfStockCount?: number;
}

/**
 * Inventory Dashboard Statistics
 * Comprehensive dashboard statistics
 */
export interface InventoryDashboardStats {
  totalItems: number;
  totalValue: number;
  totalLocations: number;
  lowStockAlerts: number;
  expiringItems: number;
  categoryBreakdown?: CategoryBreakdown[];
  recentTransactions?: number;
}

/**
 * Stock Status Breakdown
 * Distribution of items by stock status
 */
export interface StockStatusBreakdown {
  adequate: number;
  low: number;
  critical: number;
  outOfStock: number;
}

/**
 * Category Count Breakdown
 * Count of items in predefined categories
 */
export interface CategoryCount {
  medical: number;
  supplies: number;
  equipment: number;
  pharmaceuticals: number;
  maintenance: number;
  other: number;
}

/**
 * Comprehensive Inventory Statistics
 * Complete statistics set for inventory analysis
 */
export interface InventoryStats {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  expiringItems: number;
  totalValue: number;
  avgStockLevel: number;
  recentTransactions: number;
  categories: CategoryCount;
  stockStatus: StockStatusBreakdown;
}

/**
 * Recent Activity Item
 * Represents a recent inventory transaction for activity feeds
 */
export interface RecentActivityItem {
  id: string;
  type: InventoryTransactionType;
  quantity: number;
  createdAt: string;
  inventoryItem: {
    id: string;
    name: string;
    category: string;
  };
  performedBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

/**
 * Top Used Item
 * Analytics data for most frequently used inventory items
 */
export interface TopUsedItem {
  id: string;
  name: string;
  category: string;
  usageCount: number;
  totalUsed: number;
}

/**
 * Inventory Statistics Response
 * Complete response for statistics dashboard
 */
export interface InventoryStatsResponse {
  overview: InventoryStatsOverview;
  categoryBreakdown: CategoryBreakdownStats[];
  recentActivity: RecentActivityItem[];
  topUsedItems: TopUsedItem[];
}
