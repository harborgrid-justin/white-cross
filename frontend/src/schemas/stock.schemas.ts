/**
 * Stock Management Schemas
 * Zod validation schemas for stock operations, alerts, and reporting
 */

import { z } from 'zod';
import { TransactionTypeEnum, AdjustmentReasonEnum } from './transaction.schemas';

// ============================================================================
// Stock Alert Schemas
// ============================================================================

export const AlertPriorityEnum = z.enum(['critical', 'high', 'medium', 'low', 'info']);

export const AlertStatusEnum = z.enum(['active', 'acknowledged', 'resolved', 'dismissed']);

export const LowStockAlertSchema = z.object({
  id: z.string().uuid().optional(),
  itemId: z.string().uuid(),
  itemName: z.string(),
  sku: z.string(),
  locationId: z.string().uuid(),
  locationName: z.string(),

  // Quantity information
  currentQuantity: z.number(),
  availableQuantity: z.number(),
  reorderPoint: z.number(),
  reorderQuantity: z.number(),

  // Alert metadata
  priority: AlertPriorityEnum,
  status: AlertStatusEnum.default('active'),
  suggestedAction: z.string(),

  // Calculations
  daysUntilStockout: z.number().optional(),
  averageDailyUsage: z.number().optional(),

  // Tracking
  acknowledgedBy: z.string().uuid().optional().nullable(),
  acknowledgedAt: z.date().optional().nullable(),

  // Timestamps
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const ExpirationAlertSchema = z.object({
  id: z.string().uuid().optional(),
  itemId: z.string().uuid(),
  itemName: z.string(),
  batchId: z.string().uuid(),
  batchNumber: z.string(),
  locationId: z.string().uuid(),
  locationName: z.string(),

  // Expiration information
  expirationDate: z.date(),
  daysUntilExpiration: z.number(),
  quantity: z.number(),

  // Alert metadata
  priority: AlertPriorityEnum,
  status: AlertStatusEnum.default('active'),
  suggestedAction: z.string(),

  // Tracking
  acknowledgedBy: z.string().uuid().optional().nullable(),
  acknowledgedAt: z.date().optional().nullable(),
  actionTaken: z.string().max(500).optional(),

  // Timestamps
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const OverstockAlertSchema = z.object({
  id: z.string().uuid().optional(),
  itemId: z.string().uuid(),
  itemName: z.string(),
  locationId: z.string().uuid(),
  locationName: z.string(),

  // Quantity information
  currentQuantity: z.number(),
  maxStockLevel: z.number(),
  overageQuantity: z.number(),

  // Alert metadata
  priority: AlertPriorityEnum.default('low'),
  status: AlertStatusEnum.default('active'),
  suggestedAction: z.string(),

  // Timestamps
  createdAt: z.date().optional(),
});

// ============================================================================
// Stock Level Management
// ============================================================================

export const StockLevelThresholdsSchema = z.object({
  itemId: z.string().uuid(),
  locationId: z.string().uuid(),

  // Threshold levels
  reorderPoint: z.number().min(0),
  reorderQuantity: z.number().min(0),
  minimumLevel: z.number().min(0).optional(),
  maximumLevel: z.number().min(0).optional(),
  safetyStock: z.number().min(0).optional(),

  // Auto-reorder settings
  autoReorder: z.boolean().default(false),
  preferredSupplierId: z.string().uuid().optional().nullable(),

  // Lead time (days)
  leadTimeDays: z.number().min(0).default(7),
});

export const UpdateStockLevelThresholdsSchema = StockLevelThresholdsSchema.omit({
  itemId: true,
  locationId: true,
}).partial();

// ============================================================================
// Stock Valuation
// ============================================================================

export const StockValuationMethodEnum = z.enum([
  'FIFO',    // First In, First Out
  'LIFO',    // Last In, First Out
  'WAC',     // Weighted Average Cost
  'specific', // Specific identification (batch-based)
]);

export const StockValuationSchema = z.object({
  itemId: z.string().uuid(),
  locationId: z.string().uuid().optional(),

  // Valuation data
  quantity: z.number(),
  unitCost: z.number(),
  totalValue: z.number(),

  // Method used
  valuationMethod: StockValuationMethodEnum,

  // Date
  valuationDate: z.date().default(() => new Date()),
});

export const LocationStockValuationSchema = z.object({
  locationId: z.string().uuid(),
  locationName: z.string(),
  totalValue: z.number(),
  itemCount: z.number(),
  items: z.array(StockValuationSchema),
  valuationDate: z.date(),
});

export const TotalStockValuationSchema = z.object({
  totalValue: z.number(),
  totalItems: z.number(),
  totalLocations: z.number(),
  byLocation: z.array(LocationStockValuationSchema),
  byCategory: z.array(z.object({
    category: z.string(),
    totalValue: z.number(),
    itemCount: z.number(),
  })),
  valuationMethod: StockValuationMethodEnum,
  valuationDate: z.date(),
});

// ============================================================================
// Stock Usage Analytics
// ============================================================================

export const UsagePeriodEnum = z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']);

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
// Reorder Recommendations
// ============================================================================

export const ReorderRecommendationSchema = z.object({
  itemId: z.string().uuid(),
  itemName: z.string(),
  sku: z.string(),
  locationId: z.string().uuid(),
  locationName: z.string(),

  // Current state
  currentQuantity: z.number(),
  reorderPoint: z.number(),
  reorderQuantity: z.number(),

  // Calculations
  averageDailyUsage: z.number(),
  daysUntilStockout: z.number(),
  leadTimeDays: z.number(),
  safetyStock: z.number(),

  // Recommendation
  recommendedOrderQuantity: z.number(),
  recommendedOrderDate: z.date(),
  priority: AlertPriorityEnum,
  reason: z.string(),

  // Supplier information
  preferredSupplier: z.string().optional(),
  estimatedCost: z.number().optional(),

  // Generated at
  generatedAt: z.date().default(() => new Date()),
});

export const BulkReorderRecommendationsSchema = z.object({
  locationId: z.string().uuid().optional(),
  includeAllLocations: z.boolean().default(false),
  minimumPriority: AlertPriorityEnum.default('low'),
  recommendations: z.array(ReorderRecommendationSchema),
  totalEstimatedCost: z.number().optional(),
  generatedAt: z.date(),
});

// ============================================================================
// Stock Transfer Recommendations
// ============================================================================

export const StockTransferRecommendationSchema = z.object({
  itemId: z.string().uuid(),
  itemName: z.string(),

  // Source location (has excess)
  fromLocationId: z.string().uuid(),
  fromLocationName: z.string(),
  fromCurrentQuantity: z.number(),
  fromExcessQuantity: z.number(),

  // Destination location (needs stock)
  toLocationId: z.string().uuid(),
  toLocationName: z.string(),
  toCurrentQuantity: z.number(),
  toDeficitQuantity: z.number(),

  // Recommendation
  recommendedTransferQuantity: z.number(),
  priority: AlertPriorityEnum,
  reason: z.string(),

  // Generated at
  generatedAt: z.date().default(() => new Date()),
});

// ============================================================================
// Inventory Reports
// ============================================================================

export const StockLevelReportSchema = z.object({
  locationId: z.string().uuid().optional(),
  category: z.string().optional(),
  reportDate: z.date().default(() => new Date()),
  items: z.array(z.object({
    itemId: z.string().uuid(),
    itemName: z.string(),
    sku: z.string(),
    category: z.string(),
    locationName: z.string(),
    quantity: z.number(),
    availableQuantity: z.number(),
    reservedQuantity: z.number(),
    reorderPoint: z.number(),
    unitCost: z.number().optional(),
    totalValue: z.number().optional(),
    status: z.enum(['in_stock', 'low', 'critical', 'out_of_stock']),
  })),
  summary: z.object({
    totalItems: z.number(),
    inStock: z.number(),
    lowStock: z.number(),
    criticalStock: z.number(),
    outOfStock: z.number(),
    totalValue: z.number().optional(),
  }),
});

export const TransactionSummaryReportSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  locationId: z.string().uuid().optional(),

  // Transaction counts by type
  transactionsByType: z.record(z.string(), z.number()),

  // Volume metrics
  totalReceived: z.number(),
  totalIssued: z.number(),
  totalAdjustments: z.number(),
  totalTransfers: z.number(),

  // Value metrics
  valueReceived: z.number().optional(),
  valueIssued: z.number().optional(),

  // Top items
  topReceivedItems: z.array(z.object({
    itemId: z.string().uuid(),
    itemName: z.string(),
    quantity: z.number(),
  })).optional(),
  topIssuedItems: z.array(z.object({
    itemId: z.string().uuid(),
    itemName: z.string(),
    quantity: z.number(),
  })).optional(),
});

export const ExpirationReportSchema = z.object({
  reportDate: z.date().default(() => new Date()),
  daysAhead: z.number().default(90),
  locationId: z.string().uuid().optional(),

  // Expiring items grouped by urgency
  expiredItems: z.array(z.object({
    itemId: z.string().uuid(),
    itemName: z.string(),
    batchNumber: z.string(),
    locationName: z.string(),
    expirationDate: z.date(),
    daysExpired: z.number(),
    quantity: z.number(),
    estimatedValue: z.number().optional(),
  })),

  expiringCritical: z.array(z.object({
    itemId: z.string().uuid(),
    itemName: z.string(),
    batchNumber: z.string(),
    locationName: z.string(),
    expirationDate: z.date(),
    daysUntilExpiration: z.number(),
    quantity: z.number(),
    estimatedValue: z.number().optional(),
  })), // < 30 days

  expiringWarning: z.array(z.any()), // 30-60 days
  expiringInfo: z.array(z.any()), // 60-90 days

  summary: z.object({
    totalExpired: z.number(),
    totalExpiringCritical: z.number(),
    totalExpiringWarning: z.number(),
    totalExpiringInfo: z.number(),
    totalValue: z.number().optional(),
  }),
});

export const VarianceReportSchema = z.object({
  locationId: z.string().uuid(),
  reportDate: z.date().default(() => new Date()),
  countedBy: z.string().uuid(),

  // Items with discrepancies
  variances: z.array(z.object({
    itemId: z.string().uuid(),
    itemName: z.string(),
    sku: z.string(),
    systemQuantity: z.number(),
    countedQuantity: z.number(),
    variance: z.number(), // countedQuantity - systemQuantity
    variancePercentage: z.number(),
    varianceValue: z.number().optional(),
    reason: z.string().optional(),
  })),

  summary: z.object({
    totalItemsCounted: z.number(),
    itemsWithVariance: z.number(),
    totalAbsoluteVariance: z.number(),
    totalVarianceValue: z.number().optional(),
    accuracyPercentage: z.number(),
  }),
});

// ============================================================================
// Dashboard Statistics
// ============================================================================

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

export type LowStockAlert = z.infer<typeof LowStockAlertSchema>;
export type ExpirationAlert = z.infer<typeof ExpirationAlertSchema>;
export type OverstockAlert = z.infer<typeof OverstockAlertSchema>;

export type StockLevelThresholds = z.infer<typeof StockLevelThresholdsSchema>;
export type UpdateStockLevelThresholds = z.infer<typeof UpdateStockLevelThresholdsSchema>;

export type StockValuation = z.infer<typeof StockValuationSchema>;
export type LocationStockValuation = z.infer<typeof LocationStockValuationSchema>;
export type TotalStockValuation = z.infer<typeof TotalStockValuationSchema>;

export type StockUsageAnalytics = z.infer<typeof StockUsageAnalyticsSchema>;
export type UsageAnalyticsFilter = z.infer<typeof UsageAnalyticsFilterSchema>;

export type ReorderRecommendation = z.infer<typeof ReorderRecommendationSchema>;
export type BulkReorderRecommendations = z.infer<typeof BulkReorderRecommendationsSchema>;
export type StockTransferRecommendation = z.infer<typeof StockTransferRecommendationSchema>;

export type StockLevelReport = z.infer<typeof StockLevelReportSchema>;
export type TransactionSummaryReport = z.infer<typeof TransactionSummaryReportSchema>;
export type ExpirationReport = z.infer<typeof ExpirationReportSchema>;
export type VarianceReport = z.infer<typeof VarianceReportSchema>;

export type InventoryDashboardStats = z.infer<typeof InventoryDashboardStatsSchema>;

export type AlertPriority = z.infer<typeof AlertPriorityEnum>;
export type AlertStatus = z.infer<typeof AlertStatusEnum>;
export type StockValuationMethod = z.infer<typeof StockValuationMethodEnum>;
export type UsagePeriod = z.infer<typeof UsagePeriodEnum>;
