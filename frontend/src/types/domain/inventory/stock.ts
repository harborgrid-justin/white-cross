/**
 * WF-COMP-328 | stock.ts - Stock level and batch tracking type definitions
 * Purpose: Types for stock level monitoring and batch management
 * Upstream: None | Dependencies: enums
 * Downstream: Stock management components | Called by: Stock services
 * Related: core-entities, alerts
 * Exports: StockLevel, StockLevelWithDetails, Batch, BatchFilter
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Stock tracking → Batch management → Expiration monitoring
 * LLM Context: Stock level and batch tracking types
 */

import type { StockStatus } from './enums';

/**
 * Stock Level - Current stock level for an inventory item
 * Represents the current quantity and thresholds for an item
 */
export interface StockLevel {
  id: string;
  itemId: string;
  currentLevel: number;
  minimumLevel: number;
  maximumLevel?: number;
  reorderPoint: number;
  locationId?: string;
  status?: StockStatus;
  lastUpdated?: string;
}

/**
 * Stock Level with Item Details
 * Extended stock level information including item metadata
 */
export interface StockLevelWithDetails extends StockLevel {
  itemName: string;
  itemSku: string;
  category: string;
  unitOfMeasure: string;
}

/**
 * Batch - Inventory batch with expiration tracking
 * Represents a specific batch of inventory items with expiration date
 */
export interface Batch {
  id: string;
  itemId: string;
  batchNumber: string;
  quantity: number;
  expirationDate: string;
  receivedDate: string;
  cost?: number;
  supplier?: string;
  notes?: string;
}

/**
 * Batch Filter Parameters
 * Query parameters for filtering batches
 */
export interface BatchFilter {
  itemId?: string;
  expiringWithinDays?: number;
  includeExpired?: boolean;
}
