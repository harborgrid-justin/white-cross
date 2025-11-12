/**
 * WF-COMP-328 | enums.ts - Inventory type enumerations and type aliases
 * Purpose: Core enums and type aliases for inventory management
 * Upstream: None | Dependencies: None
 * Downstream: All inventory type modules | Called by: Inventory components
 * Related: core-entities, purchasing, alerts, stock
 * Exports: enums, type aliases | Key Features: Transaction types, statuses, alert types
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Type definitions → Component props → Runtime validation
 * LLM Context: Inventory enum definitions, part of refactored type system
 */

/**
 * Inventory Transaction Types
 * Defines all possible inventory transaction operations
 */
export enum InventoryTransactionType {
  PURCHASE = 'PURCHASE',
  USAGE = 'USAGE',
  ADJUSTMENT = 'ADJUSTMENT',
  TRANSFER = 'TRANSFER',
  DISPOSAL = 'DISPOSAL',
}

/**
 * Maintenance Types
 * Categories of maintenance activities for inventory items
 */
export enum MaintenanceType {
  ROUTINE = 'ROUTINE',
  REPAIR = 'REPAIR',
  CALIBRATION = 'CALIBRATION',
  INSPECTION = 'INSPECTION',
  CLEANING = 'CLEANING',
}

/**
 * Purchase Order Status
 * Lifecycle states of purchase orders
 */
export enum PurchaseOrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  ORDERED = 'ORDERED',
  PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

/**
 * Inventory Alert Types
 * Categories of system-generated inventory alerts
 */
export type InventoryAlertType =
  | 'LOW_STOCK'
  | 'EXPIRED'
  | 'NEAR_EXPIRY'
  | 'MAINTENANCE_DUE'
  | 'OUT_OF_STOCK';

/**
 * Inventory Alert Severity Levels
 * Indicates urgency of inventory alerts
 */
export type InventoryAlertSeverity =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

/**
 * Alert Priority Levels
 * General priority classification for alerts
 */
export type AlertPriority = 'critical' | 'high' | 'normal' | 'low';

/**
 * Inventory Status
 * Current state of inventory items
 */
export type InventoryStatus =
  | 'IN_STOCK'
  | 'LOW_STOCK'
  | 'OUT_OF_STOCK'
  | 'EXPIRED'
  | 'EXPIRING_SOON';

/**
 * Stock Status
 * Detailed stock level classification
 */
export type StockStatus = 'optimal' | 'reorder' | 'low' | 'out' | 'adequate' | 'critical';
