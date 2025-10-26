/**
 * Inventory Page Type Definitions
 * Purpose: Type definitions for comprehensive inventory management functionality
 * Related: inventorySlice.ts, inventory components
 *
 * Provides type safety for:
 * - Inventory item management
 * - Stock tracking and adjustments
 * - Vendor management
 * - Transaction history
 * - Maintenance scheduling
 * - Reports and analytics
 */

// Re-export types from inventorySlice for convenience
export type {
  InventoryItem,
  InventoryTransaction,
  MaintenanceLog,
  InventoryAlert,
  InventoryStats,
  UsageAnalytics,
  SupplierPerformance,
  CreateInventoryItemRequest,
  UpdateInventoryItemRequest,
  CreateTransactionRequest,
  CreateMaintenanceRequest,
  InventoryFilters
} from './store/inventorySlice';

// ============================================================================
// ADDITIONAL INVENTORY TYPES
// ============================================================================

/**
 * Inventory transaction types
 */
export type InventoryTransactionType =
  | 'PURCHASE'
  | 'USAGE'
  | 'ADJUSTMENT'
  | 'TRANSFER'
  | 'DISPOSAL'
  | 'RETURN'
  | 'DAMAGE'
  | 'LOSS'
  | 'DONATION';

/**
 * Inventory alert types
 */
export type InventoryAlertType =
  | 'LOW_STOCK'
  | 'EXPIRED'
  | 'EXPIRING_SOON'
  | 'MAINTENANCE_DUE'
  | 'OVERSTOCK'
  | 'REORDER_POINT'
  | 'USAGE_ANOMALY';

/**
 * Alert severity levels
 */
export type AlertSeverity =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

/**
 * Maintenance log types
 */
export type MaintenanceType =
  | 'ROUTINE'
  | 'REPAIR'
  | 'CALIBRATION'
  | 'INSPECTION'
  | 'CLEANING'
  | 'REPLACEMENT'
  | 'UPGRADE';

/**
 * Inventory item categories
 */
export type InventoryCategory =
  | 'MEDICATION'
  | 'SUPPLIES'
  | 'EQUIPMENT'
  | 'CONSUMABLES'
  | 'INSTRUMENTS'
  | 'PPE'
  | 'DIAGNOSTIC'
  | 'OTHER';

/**
 * Stock movement types
 */
export type StockMovementType =
  | 'IN'
  | 'OUT'
  | 'ADJUSTMENT'
  | 'TRANSFER_IN'
  | 'TRANSFER_OUT';

/**
 * Report types
 */
export type ReportType =
  | 'STOCK_LEVELS'
  | 'VALUATION'
  | 'MOVEMENT'
  | 'VARIANCE'
  | 'USAGE'
  | 'EXPIRATION'
  | 'VENDOR_PERFORMANCE'
  | 'AUDIT';

// ============================================================================
// EXTENDED INVENTORY INTERFACES
// ============================================================================

/**
 * Vendor information
 */
export interface Vendor {
  id: string;
  name: string;
  code?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  taxId?: string;
  paymentTerms?: string;
  categories: InventoryCategory[];
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  rating?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Purchase order
 */
export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  vendorId: string;
  vendorName: string;
  orderDate: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';
  items: PurchaseOrderItem[];
  subtotal: number;
  tax?: number;
  shipping?: number;
  total: number;
  notes?: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Purchase order item
 */
export interface PurchaseOrderItem {
  id: string;
  inventoryItemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity?: number;
  notes?: string;
}

/**
 * Stock location
 */
export interface StockLocation {
  id: string;
  name: string;
  code?: string;
  description?: string;
  locationType: 'WAREHOUSE' | 'ROOM' | 'CABINET' | 'REFRIGERATOR' | 'LOCKED' | 'OTHER';
  parentLocationId?: string;
  isActive: boolean;
  capacity?: number;
  currentUtilization?: number;
  responsiblePersonId?: string;
  responsiblePersonName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Stock transfer
 */
export interface StockTransfer {
  id: string;
  transferNumber: string;
  inventoryItemId: string;
  itemName: string;
  fromLocationId: string;
  fromLocationName: string;
  toLocationId: string;
  toLocationName: string;
  quantity: number;
  unit: string;
  reason: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  requestedBy: string;
  requestedByName?: string;
  requestedAt: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  completedBy?: string;
  completedByName?: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Inventory count (physical inventory)
 */
export interface InventoryCount {
  id: string;
  countNumber: string;
  countDate: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'RECONCILED';
  locationId?: string;
  locationName?: string;
  category?: InventoryCategory;
  countedBy: string;
  countedByName?: string;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  items: InventoryCountItem[];
  totalVariance: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Inventory count item
 */
export interface InventoryCountItem {
  id: string;
  inventoryItemId: string;
  itemName: string;
  expectedQuantity: number;
  countedQuantity: number;
  variance: number;
  varianceValue: number;
  reason?: string;
  adjustmentMade: boolean;
  notes?: string;
}

/**
 * Reorder point settings
 */
export interface ReorderPoint {
  id: string;
  inventoryItemId: string;
  itemName: string;
  minimumQuantity: number;
  reorderQuantity: number;
  maximumQuantity?: number;
  leadTimeDays: number;
  averageDailyUsage?: number;
  safetyStock?: number;
  isActive: boolean;
  lastTriggered?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Usage analytics detail
 */
export interface UsageAnalyticsDetail {
  itemId: string;
  itemName: string;
  category: InventoryCategory;
  location: string;
  period: {
    start: string;
    end: string;
  };
  totalUsed: number;
  averageDailyUsage: number;
  peakUsage: {
    date: string;
    quantity: number;
  };
  minimumUsage: {
    date: string;
    quantity: number;
  };
  trend: 'INCREASING' | 'DECREASING' | 'STABLE';
  forecast: {
    nextMonth: number;
    nextQuarter: number;
  };
}

/**
 * Inventory valuation detail
 */
export interface InventoryValuationDetail {
  totalValue: number;
  byCategory: Array<{
    category: InventoryCategory;
    value: number;
    percentage: number;
  }>;
  byLocation: Array<{
    location: string;
    value: number;
    percentage: number;
  }>;
  byVendor: Array<{
    vendorId: string;
    vendorName: string;
    value: number;
    percentage: number;
  }>;
  calculatedAt: string;
}

// ============================================================================
// FILTER INTERFACES
// ============================================================================

/**
 * Transaction filters
 */
export interface TransactionFilters {
  itemId?: string;
  type?: InventoryTransactionType;
  dateFrom?: string;
  dateTo?: string;
  locationId?: string;
  performedBy?: string;
  page?: number;
  limit?: number;
}

/**
 * Vendor filters
 */
export interface VendorFilters {
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  category?: InventoryCategory;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

/**
 * Transfer filters
 */
export interface TransferFilters {
  status?: 'PENDING' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  fromLocationId?: string;
  toLocationId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

/**
 * Report filters
 */
export interface ReportFilters {
  reportType: ReportType;
  dateFrom: string;
  dateTo: string;
  category?: InventoryCategory;
  locationId?: string;
  vendorId?: string;
  includeInactive?: boolean;
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

/**
 * Sort options for inventory lists
 */
export type InventorySortBy =
  | 'name'
  | 'category'
  | 'quantity'
  | 'value'
  | 'location'
  | 'lastUpdated'
  | 'expirationDate';

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * View mode for inventory lists
 */
export type InventoryViewMode = 'list' | 'grid' | 'compact';

/**
 * Inventory form data
 */
export interface InventoryFormData {
  name: string;
  category: InventoryCategory;
  description?: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  maxQuantity?: number;
  cost: number;
  supplier?: string;
  location: string;
  expirationDate?: string;
  batchNumber?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  pagination?: PaginationMeta;
  error?: string;
}

/**
 * Batch operation result
 */
export interface BatchOperationResult {
  success: number;
  failed: number;
  errors: Array<{
    id: string;
    error: string;
  }>;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Check if item is low stock
 */
export const isLowStock = (item: { quantity: number; minQuantity: number }): boolean => {
  return item.quantity <= item.minQuantity;
};

/**
 * Check if item is expired
 */
export const isExpired = (expirationDate?: string): boolean => {
  if (!expirationDate) return false;
  return new Date(expirationDate) < new Date();
};

/**
 * Check if item is expiring soon (within specified days)
 */
export const isExpiringSoon = (expirationDate?: string, days: number = 30): boolean => {
  if (!expirationDate) return false;
  const expDate = new Date(expirationDate);
  const warningDate = new Date();
  warningDate.setDate(warningDate.getDate() + days);
  return expDate <= warningDate && expDate > new Date();
};

/**
 * Calculate item value
 */
export const calculateItemValue = (item: { quantity: number; cost: number }): number => {
  return item.quantity * item.cost;
};
