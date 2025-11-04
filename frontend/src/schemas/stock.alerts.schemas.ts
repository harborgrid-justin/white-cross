/**
 * Stock Alert Schemas
 * Zod validation schemas for stock alerts (low stock, expiration, overstock)
 */

import { z } from 'zod';
import { AlertPriorityEnum, AlertStatusEnum } from './stock.base.schemas';

// ============================================================================
// Low Stock Alerts
// ============================================================================

/**
 * Schema for low stock level alerts
 * Triggers when current quantity falls below reorder point
 */
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

// ============================================================================
// Expiration Alerts
// ============================================================================

/**
 * Schema for product expiration alerts
 * Warns about items approaching or past expiration date
 */
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

// ============================================================================
// Overstock Alerts
// ============================================================================

/**
 * Schema for overstock alerts
 * Triggers when quantity exceeds maximum stock level
 */
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
// Type Exports
// ============================================================================

export type LowStockAlert = z.infer<typeof LowStockAlertSchema>;
export type ExpirationAlert = z.infer<typeof ExpirationAlertSchema>;
export type OverstockAlert = z.infer<typeof OverstockAlertSchema>;
