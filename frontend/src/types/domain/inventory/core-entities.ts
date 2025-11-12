/**
 * WF-COMP-328 | core-entities.ts - Core inventory entity type definitions
 * Purpose: Primary entity interfaces for inventory management
 * Upstream: BaseEntity from core/common | Dependencies: React ecosystem, enums
 * Downstream: Services, components, hooks | Called by: Inventory API layer
 * Related: purchasing, alerts, stock, requests, responses
 * Exports: InventoryItem, InventoryTransaction, MaintenanceLog | Key Features: Core entities
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Entity definitions → API contracts → Component state
 * LLM Context: Core inventory entities, aligned with backend models
 */

import type { BaseEntity } from '../../core/common';
import type { InventoryTransactionType, MaintenanceType } from './enums';

/**
 * Inventory Item - Represents a trackable item in the inventory system
 * @aligned_with backend/src/database/models/inventory/InventoryItem.ts
 */
export interface InventoryItem extends BaseEntity {
  name: string;
  category: string;
  description?: string;
  sku?: string;
  supplier?: string;
  unitCost?: number;
  reorderLevel: number;
  reorderQuantity: number;
  location?: string;
  notes?: string;
  isActive: boolean;

  // Calculated fields (from service/query)
  currentStock?: number;
  isLowStock?: boolean;
  earliestExpiration?: string;
  nextMaintenanceDate?: string;

  // Associations
  transactions?: InventoryTransaction[];
  maintenanceLogs?: MaintenanceLog[];
}

/**
 * Inventory Transaction - Tracks all inventory movements
 * @aligned_with backend/src/database/models/inventory/InventoryTransaction.ts
 *
 * Note: Backend model has timestamps: false (only createdAt, no updatedAt)
 * Transactions are immutable once created.
 */
export interface InventoryTransaction extends BaseEntity {
  inventoryItemId: string;
  type: InventoryTransactionType;
  quantity: number;
  unitCost?: number;
  reason?: string;
  batchNumber?: string;
  expirationDate?: string;
  notes?: string;
  performedById: string;

  // Associations
  inventoryItem?: InventoryItem;
  performedBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  // Calculated field for history tracking
  stockAfterTransaction?: number;
}

/**
 * Maintenance Log - Tracks maintenance activities for inventory items
 * @aligned_with backend/src/database/models/inventory/MaintenanceLog.ts
 */
export interface MaintenanceLog extends BaseEntity {
  inventoryItemId: string;
  type: MaintenanceType;
  description: string;
  performedById: string;
  cost?: number;
  nextMaintenanceDate?: string;
  vendor?: string;
  notes?: string;

  // Associations
  inventoryItem?: InventoryItem;
  performedBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
