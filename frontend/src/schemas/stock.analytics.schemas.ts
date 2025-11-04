/**
 * Stock Analytics Schemas
 * Zod validation schemas for stock usage analytics and metrics
 */

import { z } from 'zod';
import { UsagePeriodEnum } from './stock.base.schemas';

// ============================================================================
// Stock Usage Analytics
// ============================================================================

/**
 * Schema for stock usage analytics over a time period
 * Tracks consumption patterns, turnover rates, and efficiency metrics
 */
export const StockUsageAnalyticsSchema = z.object({
  itemId: z.string().uuid(),
  itemName: z.string(),
  locationId: z.string().uuid().optional(),

  // Time period
  period: UsagePeriodEnum,
  startDate: z.date(),
  endDate: z.date(),

  // Usage statistics
  totalIssued: z.number(),
  totalReceived: z.number(),
  averageDaily: z.number(),
  trend: z.enum(['increasing', 'decreasing', 'stable']),

  // Efficiency metrics
  turnoverRate: z.number().optional(), // times per period
  daysOnHand: z.number().optional(),
  stockoutDays: z.number().optional(),
});

/**
 * Schema for filtering usage analytics queries
 * Allows flexible filtering by item, location, category, and time period
 */
export const UsageAnalyticsFilterSchema = z.object({
  itemId: z.string().uuid().optional(),
  locationId: z.string().uuid().optional(),
  category: z.string().optional(),
  period: UsagePeriodEnum.default('monthly'),
  startDate: z.date(),
  endDate: z.date(),
  includeZeroUsage: z.boolean().default(false),
});

// ============================================================================
// Dashboard Statistics
// ============================================================================

/**
 * Schema for inventory dashboard statistics
 * Provides high-level overview of inventory health and activity
 */
export const InventoryDashboardStatsSchema = z.object({
  // Overall metrics
  totalItems: z.number(),
  totalLocations: z.number(),
  totalValue: z.number(),

  // Stock status
  inStockItems: z.number(),
  lowStockItems: z.number(),
  outOfStockItems: z.number(),

  // Alerts
  activeAlerts: z.number(),
  criticalAlerts: z.number(),
  expiringItems: z.number(), // Next 30 days

  // Recent activity
  recentTransactions: z.number(), // Last 7 days
  pendingTransfers: z.number(),

  // Categories breakdown
  byCategory: z.array(z.object({
    category: z.string(),
    itemCount: z.number(),
    totalValue: z.number(),
    lowStockCount: z.number(),
  })),

  // Top items by usage
  topUsedItems: z.array(z.object({
    itemId: z.string().uuid(),
    itemName: z.string(),
    usageCount: z.number(),
    usageQuantity: z.number(),
  })).optional(),

  // Timestamp
  generatedAt: z.date().default(() => new Date()),
});

// ============================================================================
// Type Exports
// ============================================================================

export type StockUsageAnalytics = z.infer<typeof StockUsageAnalyticsSchema>;
export type UsageAnalyticsFilter = z.infer<typeof UsageAnalyticsFilterSchema>;
export type InventoryDashboardStats = z.infer<typeof InventoryDashboardStatsSchema>;
