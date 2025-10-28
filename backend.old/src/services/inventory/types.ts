/**
 * LOC: 376759C594
 * WC-GEN-285 | types.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - alertsService.ts (services/inventory/alertsService.ts)
 *   - inventoryQueriesService.ts (services/inventory/inventoryQueriesService.ts)
 *   - inventoryRepository.ts (services/inventory/inventoryRepository.ts)
 *   - maintenanceService.ts (services/inventory/maintenanceService.ts)
 *   - purchaseOrderService.ts (services/inventory/purchaseOrderService.ts)
 *   - ... and 4 more
 */

/**
 * WC-GEN-285 | types.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../database/types/enums | Dependencies: ../../database/types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: interfaces | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Type definitions for Inventory Service
 *
 * Contains all interfaces, types, and enums used across inventory operations.
 * Centralizes type definitions for better maintainability and type safety.
 */

import { InventoryTransactionType, MaintenanceType, PurchaseOrderStatus } from '../../database/types/enums';

/**
 * Data structure for creating a new inventory item
 */
export interface CreateInventoryItemData {
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
 * Data structure for updating an existing inventory item
 */
export interface UpdateInventoryItemData {
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
 * Data structure for creating an inventory transaction
 */
export interface CreateInventoryTransactionData {
  inventoryItemId: string;
  type: InventoryTransactionType;
  quantity: number;
  unitCost?: number;
  reason?: string;
  batchNumber?: string;
  expirationDate?: Date;
  performedBy: string;
  notes?: string;
}

/**
 * Data structure for creating a maintenance log entry
 */
export interface CreateMaintenanceLogData {
  inventoryItemId: string;
  type: MaintenanceType;
  description: string;
  performedBy: string;
  cost?: number;
  nextMaintenanceDate?: Date;
  vendor?: string;
  notes?: string;
}

/**
 * Data structure for creating a vendor record
 */
export interface CreateVendorData {
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
 * Data structure for creating a purchase order
 */
export interface CreatePurchaseOrderData {
  orderNumber: string;
  vendorId: string;
  orderDate: Date;
  expectedDate?: Date;
  notes?: string;
  items: Array<{
    inventoryItemId: string;
    quantity: number;
    unitCost: number;
  }>;
}

/**
 * Filters for querying inventory items
 */
export interface InventoryFilters {
  category?: string;
  supplier?: string;
  location?: string;
  lowStock?: boolean;
  needsMaintenance?: boolean;
  isActive?: boolean;
}

/**
 * Alert types for inventory monitoring
 */
export interface InventoryAlert {
  id: string;
  type: 'LOW_STOCK' | 'EXPIRED' | 'NEAR_EXPIRY' | 'MAINTENANCE_DUE' | 'OUT_OF_STOCK';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  itemId: string;
  itemName: string;
  daysUntilAction?: number;
}

/**
 * Result structure from stock level queries
 */
export interface StockQueryResult {
  id: string;
  name: string;
  category: string;
  description: string | null;
  sku: string | null;
  supplier: string | null;
  unitCost: number | null;
  reorderLevel: number;
  reorderQuantity: number;
  location: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  currentStock: number;
  isLowStock: boolean;
  earliestExpiration: Date | null;
  nextMaintenanceDate?: Date | null;
}

/**
 * Pagination metadata structure
 */
export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Paginated response structure for inventory items
 */
export interface PaginatedInventoryItems {
  items: StockQueryResult[];
  pagination: PaginationMetadata;
}

/**
 * Stock history response structure
 */
export interface StockHistoryResponse {
  history: any[];
  pagination: PaginationMetadata;
}

/**
 * Stock adjustment result
 */
export interface StockAdjustmentResult {
  transaction: any;
  previousStock: number;
  newStock: number;
  adjustment: number;
}

/**
 * Purchase order status transition map
 */
export interface StatusTransitionMap {
  [key: string]: PurchaseOrderStatus[];
}

/**
 * Generated purchase order structure
 */
export interface GeneratedPurchaseOrder {
  orderNumber: string;
  orderDate: Date;
  items: Array<{
    item: any;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }>;
  totalCost: number;
  status: PurchaseOrderStatus;
}
