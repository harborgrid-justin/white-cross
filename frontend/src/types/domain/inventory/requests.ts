/**
 * WF-COMP-328 | requests.ts - Inventory API request type definitions
 * Purpose: Request interfaces and filters for inventory API operations
 * Upstream: PaginationParams, DateRangeFilter from core/common | Dependencies: enums, core-entities
 * Downstream: API services, hooks | Called by: Inventory API client
 * Related: responses, forms
 * Exports: Create/Update request types, filters, query parameters
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: User input → Form validation → API request → Backend
 * LLM Context: API request types for inventory operations
 */

import type { PaginationParams, DateRangeFilter } from '../../core/common';
import type { InventoryTransactionType, MaintenanceType } from './enums';
import type { InventoryTransaction } from './core-entities';

/**
 * Inventory Filters - Query parameters for filtering inventory items
 * Used for searching and filtering inventory lists
 */
export interface InventoryFilters extends PaginationParams {
  category?: string;
  supplier?: string;
  location?: string;
  lowStock?: boolean;
  needsMaintenance?: boolean;
  isActive?: boolean;
}

/**
 * Create Inventory Item Request
 * Payload for creating a new inventory item
 */
export interface CreateInventoryItemRequest {
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
}

/**
 * Update Inventory Item Request
 * Payload for updating an existing inventory item
 * All fields optional to support partial updates
 */
export interface UpdateInventoryItemRequest {
  name?: string;
  category?: string;
  description?: string;
  sku?: string;
  supplier?: string;
  unitCost?: number;
  reorderLevel?: number;
  reorderQuantity?: number;
  location?: string;
  notes?: string;
  isActive?: boolean;
}

/**
 * Create Inventory Transaction Request
 * Payload for recording a new inventory transaction
 */
export interface CreateInventoryTransactionRequest {
  inventoryItemId: string;
  type: InventoryTransactionType;
  quantity: number;
  unitCost?: number;
  reason?: string;
  batchNumber?: string;
  expirationDate?: string;
  notes?: string;
}

/**
 * Stock Adjustment Request
 * Simplified payload for stock adjustments
 */
export interface StockAdjustmentRequest {
  quantity: number;
  reason: string;
}

/**
 * Stock Adjustment Response
 * Response containing adjustment details and stock changes
 */
export interface StockAdjustmentResponse {
  transaction: InventoryTransaction;
  previousStock: number;
  newStock: number;
  adjustment: number;
}

/**
 * Create Maintenance Log Request
 * Payload for creating a maintenance log entry
 */
export interface CreateMaintenanceLogRequest {
  inventoryItemId: string;
  type: MaintenanceType;
  description: string;
  cost?: number;
  nextMaintenanceDate?: string;
  vendor?: string;
  notes?: string;
}

/**
 * Create Vendor Request
 * Payload for creating a new vendor
 */
export interface CreateVendorRequest {
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  taxId?: string;
  paymentTerms?: string;
  notes?: string;
  rating?: number;
}

/**
 * Create Purchase Order Request
 * Payload for creating a new purchase order
 */
export interface CreatePurchaseOrderRequest {
  orderNumber: string;
  vendorId: string;
  orderDate: string;
  expectedDate?: string;
  notes?: string;
  items: Array<{
    inventoryItemId: string;
    quantity: number;
    unitCost: number;
  }>;
}

/**
 * Generate Purchase Order Request
 * Payload for automatically generating purchase orders from low stock items
 */
export interface GeneratePurchaseOrderRequest {
  items: Array<{
    inventoryItemId: string;
    quantity: number;
  }>;
}

/**
 * Maintenance Schedule Query Parameters
 * Parameters for querying maintenance schedules
 */
export interface MaintenanceScheduleParams {
  startDate?: string;
  endDate?: string;
}

/**
 * Usage Analytics Query Parameters
 * Parameters for querying usage analytics and trends
 */
export interface UsageAnalyticsParams extends DateRangeFilter {
  startDate: string;
  endDate: string;
}
