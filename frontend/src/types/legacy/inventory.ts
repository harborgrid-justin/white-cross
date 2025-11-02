/**
 * WF-COMP-328 | inventory.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: functions, interfaces, types | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Inventory Management Types
 * Enterprise-grade type definitions for inventory tracking and management
 */

import type { BaseEntity, PaginationParams, DateRangeFilter } from './common';

// =====================
// ENUMS
// =====================

export enum InventoryTransactionType {
  PURCHASE = 'PURCHASE',
  USAGE = 'USAGE',
  ADJUSTMENT = 'ADJUSTMENT',
  TRANSFER = 'TRANSFER',
  DISPOSAL = 'DISPOSAL',
}

export enum MaintenanceType {
  ROUTINE = 'ROUTINE',
  REPAIR = 'REPAIR',
  CALIBRATION = 'CALIBRATION',
  INSPECTION = 'INSPECTION',
  CLEANING = 'CLEANING',
}

export enum PurchaseOrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  ORDERED = 'ORDERED',
  PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

export type InventoryAlertType =
  | 'LOW_STOCK'
  | 'EXPIRED'
  | 'NEAR_EXPIRY'
  | 'MAINTENANCE_DUE'
  | 'OUT_OF_STOCK';

export type InventoryAlertSeverity =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

export type AlertPriority = 'critical' | 'high' | 'normal' | 'low';

export type InventoryStatus =
  | 'IN_STOCK'
  | 'LOW_STOCK'
  | 'OUT_OF_STOCK'
  | 'EXPIRED'
  | 'EXPIRING_SOON';

export type StockStatus = 'optimal' | 'reorder' | 'low' | 'out' | 'adequate' | 'critical';

// =====================
// CORE ENTITIES
// =====================

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

/**
 * Vendor - Supplier information for inventory items
 * @aligned_with backend/src/database/models/inventory/Vendor.ts
 */
export interface Vendor extends BaseEntity {
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
  isActive: boolean;
}

/**
 * Purchase Order - Tracks purchase orders for inventory items
 * @aligned_with backend/src/database/models/inventory/PurchaseOrder.ts
 */
export interface PurchaseOrder extends BaseEntity {
  orderNumber: string;
  vendorId: string;
  orderDate: string;
  expectedDate?: string;
  receivedDate?: string;
  notes?: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: PurchaseOrderStatus;
  approvedBy?: string;
  approvedAt?: string;

  // Associations
  vendor?: Vendor;
  items?: PurchaseOrderItem[];
}

/**
 * Purchase Order Item - Line items in a purchase order
 * @aligned_with backend/src/database/models/inventory/PurchaseOrderItem.ts
 *
 * Note: Backend model has timestamps: false (only createdAt, no updatedAt)
 */
export interface PurchaseOrderItem extends BaseEntity {
  purchaseOrderId: string;
  inventoryItemId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  receivedQty: number;
  notes?: string;

  // Associations
  inventoryItem?: InventoryItem;
}

/**
 * Inventory Alert - System-generated alerts for inventory management
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

/**
 * Stock Level - Current stock level for an inventory item
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
 */
export interface StockLevelWithDetails extends StockLevel {
  itemName: string;
  itemSku: string;
  category: string;
  unitOfMeasure: string;
}

/**
 * Batch - Inventory batch with expiration tracking
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
 */
export interface BatchFilter {
  itemId?: string;
  expiringWithinDays?: number;
  includeExpired?: boolean;
}

// =====================
// REQUEST/RESPONSE TYPES
// =====================

/**
 * Inventory Filters - Query parameters for filtering inventory items
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
 */
export interface StockAdjustmentRequest {
  quantity: number;
  reason: string;
}

/**
 * Stock Adjustment Response
 */
export interface StockAdjustmentResponse {
  transaction: InventoryTransaction;
  previousStock: number;
  newStock: number;
  adjustment: number;
}

/**
 * Create Maintenance Log Request
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
 */
export interface GeneratePurchaseOrderRequest {
  items: Array<{
    inventoryItemId: string;
    quantity: number;
  }>;
}

/**
 * Maintenance Schedule Query Parameters
 */
export interface MaintenanceScheduleParams {
  startDate?: string;
  endDate?: string;
}

/**
 * Usage Analytics Query Parameters
 */
export interface UsageAnalyticsParams extends DateRangeFilter {
  startDate: string;
  endDate: string;
}

// =====================
// API RESPONSE TYPES
// =====================

/**
 * Paginated Inventory Items Response
 */
export interface InventoryItemsResponse {
  items: InventoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Inventory Item with Current Stock Response
 */
export interface InventoryItemWithStockResponse extends InventoryItem {
  currentStock: number;
}

/**
 * Stock History Response
 */
export interface StockHistoryResponse {
  history: InventoryTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Inventory Valuation Response
 */
export interface InventoryValuationResponse {
  category: string;
  itemCount: number;
  totalValue: number;
  totalQuantity: number;
}

/**
 * Usage Analytics Response
 */
export interface UsageAnalyticsResponse {
  name: string;
  category: string;
  transactionCount: number;
  totalUsage: number;
  averageUsage: number;
  totalPurchased: number;
}

/**
 * Supplier Performance Response
 */
export interface SupplierPerformanceResponse {
  supplier: string;
  itemCount: number;
  averageUnitCost: number;
  totalPurchased: number;
  totalSpent: number;
}

/**
 * Inventory Statistics Overview
 */
export interface InventoryStatsOverview {
  totalItems: number;
  activeItems: number;
  inactiveItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  criticalAlerts: number;
  highAlerts: number;
  mediumAlerts: number;
}

/**
 * Category Breakdown Statistics
 */
export interface CategoryBreakdownStats {
  category: string;
  itemCount: number;
  totalQuantity: number;
  totalValue: number;
}

/**
 * Category Breakdown for Dashboard
 */
export interface CategoryBreakdown {
  category: string;
  itemCount: number;
  totalValue: number;
  lowStockCount?: number;
  outOfStockCount?: number;
}

/**
 * Inventory Dashboard Statistics
 */
export interface InventoryDashboardStats {
  totalItems: number;
  totalValue: number;
  totalLocations: number;
  lowStockAlerts: number;
  expiringItems: number;
  categoryBreakdown?: CategoryBreakdown[];
  recentTransactions?: number;
}

/**
 * Stock Status Breakdown
 */
export interface StockStatusBreakdown {
  adequate: number;
  low: number;
  critical: number;
  outOfStock: number;
}

/**
 * Category Count Breakdown
 */
export interface CategoryCount {
  medical: number;
  supplies: number;
  equipment: number;
  pharmaceuticals: number;
  maintenance: number;
  other: number;
}

/**
 * Comprehensive Inventory Statistics
 */
export interface InventoryStats {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  expiringItems: number;
  totalValue: number;
  avgStockLevel: number;
  recentTransactions: number;
  categories: CategoryCount;
  stockStatus: StockStatusBreakdown;
}

/**
 * Recent Activity Item
 */
export interface RecentActivityItem {
  id: string;
  type: InventoryTransactionType;
  quantity: number;
  createdAt: string;
  inventoryItem: {
    id: string;
    name: string;
    category: string;
  };
  performedBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

/**
 * Top Used Item
 */
export interface TopUsedItem {
  id: string;
  name: string;
  category: string;
  usageCount: number;
  totalUsed: number;
}

/**
 * Inventory Statistics Response
 */
export interface InventoryStatsResponse {
  overview: InventoryStatsOverview;
  categoryBreakdown: CategoryBreakdownStats[];
  recentActivity: RecentActivityItem[];
  topUsedItems: TopUsedItem[];
}

/**
 * Purchase Order Summary (for generation)
 */
export interface GeneratedPurchaseOrder {
  orderNumber: string;
  orderDate: string;
  items: Array<{
    item: InventoryItem;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }>;
  totalCost: number;
  status: PurchaseOrderStatus;
}

// =====================
// FORM DATA TYPES
// =====================

/**
 * Inventory Item Form Data
 */
export interface InventoryItemFormData extends CreateInventoryItemRequest {
  id?: string;
}

/**
 * Inventory Transaction Form Data
 */
export interface InventoryTransactionFormData {
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
 * Maintenance Log Form Data
 */
export interface MaintenanceLogFormData {
  inventoryItemId: string;
  type: MaintenanceType;
  description: string;
  cost?: number;
  nextMaintenanceDate?: string;
  vendor?: string;
  notes?: string;
}

/**
 * Vendor Form Data
 */
export interface VendorFormData extends CreateVendorRequest {
  id?: string;
  isActive?: boolean;
}

/**
 * Purchase Order Form Data
 */
export interface PurchaseOrderFormData extends CreatePurchaseOrderRequest {
  id?: string;
}

// =====================
// TYPE GUARDS
// =====================

/**
 * Check if an inventory item is low in stock
 */
export function isLowStock(item: InventoryItem): boolean {
  return (item.currentStock ?? 0) <= item.reorderLevel;
}

/**
 * Check if an inventory item is out of stock
 */
export function isOutOfStock(item: InventoryItem): boolean {
  return (item.currentStock ?? 0) === 0;
}

/**
 * Check if maintenance is due
 */
export function isMaintenanceDue(log: MaintenanceLog): boolean {
  if (!log.nextMaintenanceDate) return false;
  return new Date(log.nextMaintenanceDate) <= new Date();
}

/**
 * Check if an item is expiring soon (within 30 days)
 */
export function isExpiringSoon(item: InventoryItem): boolean {
  if (!item.earliestExpiration) return false;
  const expirationDate = new Date(item.earliestExpiration);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  return expirationDate <= thirtyDaysFromNow;
}

/**
 * Check if an item has expired
 */
export function isExpired(item: InventoryItem): boolean {
  if (!item.earliestExpiration) return false;
  return new Date(item.earliestExpiration) < new Date();
}
