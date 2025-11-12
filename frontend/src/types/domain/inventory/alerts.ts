/**
 * WF-COMP-328 | alerts.ts - Inventory alert type definitions
 * Purpose: Alert interfaces for inventory monitoring and notifications
 * Upstream: None | Dependencies: enums
 * Downstream: Alert components, notification system | Called by: Alert services
 * Related: stock, core-entities
 * Exports: InventoryAlert, LowStockAlert, ExpirationAlert
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Alert generation → Notification → User action
 * LLM Context: Inventory alert types for monitoring and notifications
 */

import type {
  InventoryAlertType,
  InventoryAlertSeverity,
  AlertPriority,
} from './enums';

/**
 * Inventory Alert - System-generated alerts for inventory management
 * Generic alert interface for various inventory conditions
 */
export interface InventoryAlert {
  id: string;
  type: InventoryAlertType;
  severity: InventoryAlertSeverity;
  message: string;
  itemId: string;
  itemName: string;
  daysUntilAction?: number;
}

/**
 * Low Stock Alert - Specific alert for items below reorder point
 * Triggered when inventory quantity falls below the reorder threshold
 */
export interface LowStockAlert {
  id: string;
  itemId: string;
  itemName: string;
  currentQuantity: number;
  reorderPoint: number;
  minimumLevel?: number;
  locationId?: string;
  locationName: string;
  priority: AlertPriority;
  createdAt: string;
  acknowledgedAt?: string;
}

/**
 * Expiration Alert - Alert for items expiring soon
 * Triggered when inventory items approach or pass expiration date
 */
export interface ExpirationAlert {
  id: string;
  itemId: string;
  itemName: string;
  batchId: string;
  batchNumber: string;
  quantity: number;
  expirationDate: string;
  daysUntilExpiration: number;
  priority: AlertPriority;
  locationId?: string;
  locationName?: string;
  createdAt: string;
  acknowledgedAt?: string;
}
