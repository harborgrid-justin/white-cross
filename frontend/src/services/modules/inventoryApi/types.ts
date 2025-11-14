/**
 * Type definitions for Inventory Management API
 *
 * Contains all interfaces, enums, and type definitions for the inventory system
 * including items, transactions, suppliers, purchase orders, alerts, and analytics.
 *
 * @module services/modules/inventoryApi/types
 */

import type { PaginationParams } from '../../types';

// ==========================================
// CORE INVENTORY TYPES
// ==========================================

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  sku?: string;
  supplier?: string;
  unitCost: number;
  currentStock: number;
  reorderLevel: number;
  reorderQuantity: number;
  location?: string;
  locationId?: string;
  notes?: string;
  isActive: boolean;
  lastRestockDate?: string;
  expirationDate?: string;
  batchNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryTransaction {
  id: string;
  inventoryItemId: string;
  type: TransactionType;
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  balanceAfter: number;
  reason?: string;
  batchNumber?: string;
  expirationDate?: string;
  fromLocation?: string;
  toLocation?: string;
  purchaseOrderId?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export type TransactionType =
  | 'PURCHASE'
  | 'USAGE'
  | 'ADJUSTMENT'
  | 'TRANSFER'
  | 'DISPOSAL'
  | 'RETURN'
  | 'LOSS'
  | 'DAMAGE';

// ==========================================
// MAINTENANCE TYPES
// ==========================================

export interface MaintenanceLog {
  id: string;
  inventoryItemId: string;
  type: MaintenanceType;
  description: string;
  cost?: number;
  performedDate: string;
  nextMaintenanceDate?: string;
  vendor?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export type MaintenanceType =
  | 'ROUTINE'
  | 'REPAIR'
  | 'CALIBRATION'
  | 'INSPECTION'
  | 'CLEANING'
  | 'REPLACEMENT';

// ==========================================
// SUPPLIER TYPES
// ==========================================

export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  taxId?: string;
  paymentTerms?: string;
  rating?: number;
  isPreferred: boolean;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// PURCHASE ORDER TYPES
// ==========================================

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplier?: Supplier;
  orderDate: string;
  expectedDate?: string;
  receivedDate?: string;
  status: PurchaseOrderStatus;
  totalAmount: number;
  notes?: string;
  items: PurchaseOrderItem[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type PurchaseOrderStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'APPROVED'
  | 'ORDERED'
  | 'RECEIVED'
  | 'CANCELLED';

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  inventoryItemId: string;
  inventoryItem?: InventoryItem;
  quantity: number;
  unitCost: number;
  totalCost: number;
  receivedQuantity?: number;
}

// ==========================================
// ALERT TYPES
// ==========================================

export interface InventoryAlert {
  id: string;
  type: AlertType;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  inventoryItemId: string;
  inventoryItem?: InventoryItem;
  message: string;
  threshold?: number;
  currentValue?: number;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  createdAt: string;
}

export type AlertType =
  | 'LOW_STOCK'
  | 'EXPIRING_SOON'
  | 'EXPIRED'
  | 'MAINTENANCE_DUE'
  | 'OVER_STOCK'
  | 'NO_STOCK';

// ==========================================
// STOCK TRANSFER TYPES
// ==========================================

export interface StockTransfer {
  id: string;
  inventoryItemId: string;
  fromLocation: string;
  fromLocationId?: string;
  toLocation: string;
  toLocationId?: string;
  quantity: number;
  reason: string;
  status: TransferStatus;
  requestedBy: string;
  approvedBy?: string;
  completedBy?: string;
  requestedAt: string;
  approvedAt?: string;
  completedAt?: string;
  notes?: string;
}

export type TransferStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'IN_TRANSIT'
  | 'COMPLETED'
  | 'CANCELLED';

export interface StockTransferCreate {
  inventoryItemId: string;
  fromLocation: string;
  toLocation: string;
  quantity: number;
  reason: string;
  notes?: string;
}

// ==========================================
// LOW STOCK & EXPIRING ITEMS
// ==========================================

export interface LowStockItem {
  item: InventoryItem;
  currentStock: number;
  reorderLevel: number;
  reorderQuantity: number;
  deficit: number;
  lastUsageDate?: string;
  averageDailyUsage?: number;
  daysUntilStockout?: number;
  suggestedOrderQuantity: number;
}

export interface ExpiringItem {
  item: InventoryItem;
  expirationDate: string;
  daysUntilExpiration: number;
  currentStock: number;
  estimatedValue: number;
  severity: 'EXPIRED' | 'CRITICAL' | 'WARNING' | 'INFO';
  batchNumber?: string;
}

// ==========================================
// ANALYTICS TYPES
// ==========================================

export interface CostAnalysis {
  totalInventoryValue: number;
  categoryBreakdown: Array<{
    category: string;
    value: number;
    itemCount: number;
    percentage: number;
  }>;
  supplierBreakdown: Array<{
    supplier: string;
    totalSpend: number;
    orderCount: number;
    averageOrderValue: number;
  }>;
  monthlySpend: Array<{
    month: string;
    purchases: number;
    usage: number;
    waste: number;
    netChange: number;
  }>;
  optimization: {
    overStockedItems: Array<{
      itemId: string;
      itemName: string;
      currentStock: number;
      optimalStock: number;
      excessValue: number;
    }>;
    underStockedItems: Array<{
      itemId: string;
      itemName: string;
      currentStock: number;
      optimalStock: number;
      deficitValue: number;
    }>;
    slowMovingItems: Array<{
      itemId: string;
      itemName: string;
      lastUsageDate: string;
      daysInactive: number;
      currentValue: number;
    }>;
    potentialSavings: number;
  };
  metrics: {
    inventoryTurnoverRatio: number;
    daysInventoryOutstanding: number;
    carryingCost: number;
    stockoutRate: number;
    wastePercentage: number;
  };
}

export interface UsageTrend {
  itemId: string;
  itemName: string;
  category: string;
  period: string;
  dataPoints: Array<{
    date: string;
    usage: number;
    purchases: number;
    stockLevel: number;
  }>;
  averageUsage: number;
  trendDirection: 'INCREASING' | 'STABLE' | 'DECREASING';
  seasonalPattern: boolean;
  forecast: Array<{
    date: string;
    predictedUsage: number;
    confidence: number;
  }>;
}

// ==========================================
// REQUEST/RESPONSE TYPES
// ==========================================

export interface InventoryFilters extends PaginationParams {
  category?: string;
  supplier?: string;
  location?: string;
  lowStock?: boolean;
  needsMaintenance?: boolean;
  isActive?: boolean;
  search?: string;
}

export interface CreateInventoryItemRequest {
  name: string;
  category: string;
  description?: string;
  sku?: string;
  supplier?: string;
  unitCost: number;
  initialStock?: number;
  reorderLevel: number;
  reorderQuantity: number;
  location?: string;
  notes?: string;
}

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

export interface StockAdjustmentRequest {
  quantity: number;
  reason: string;
  notes?: string;
}

export interface StockAdjustmentResponse {
  transaction: InventoryTransaction;
  newStock: number;
  previousStock: number;
}

export interface CreateSupplierRequest {
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  taxId?: string;
  paymentTerms?: string;
  rating?: number;
  isPreferred?: boolean;
  notes?: string;
}

export interface CreatePurchaseOrderRequest {
  orderNumber: string;
  supplierId: string;
  orderDate: string;
  expectedDate?: string;
  notes?: string;
  items: Array<{
    inventoryItemId: string;
    quantity: number;
    unitCost: number;
  }>;
}
