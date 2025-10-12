/**
 * Inventory Page Type Definitions
 *
 * Page-specific types for the inventory management module
 */

/**
 * Tab types for inventory views
 */
export type InventoryTab = 'items' | 'vendors' | 'orders' | 'budget' | 'analytics';

/**
 * Sort columns available for inventory
 */
export type InventorySortColumn = 'name' | 'category' | 'quantity' | 'reorderLevel';

/**
 * Filter form state interface
 */
export interface InventoryFilters {
  searchQuery: string;
  selectedCategory: string;
  alertLevel: string;
  stockStatus: string;
}

/**
 * Inventory item interface
 */
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  unit: string;
  unitCost: number;
  lastRestocked?: string;
  expiryDate?: string;
  location?: string;
}

/**
 * Inventory alert interface
 */
export interface InventoryAlert {
  id: string;
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  itemId: string;
  createdAt: string;
}

/**
 * Vendor interface
 */
export interface Vendor {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
}

/**
 * Purchase order interface
 */
export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  vendorId: string;
  vendor?: Vendor;
  status: 'PENDING' | 'APPROVED' | 'RECEIVED' | 'CANCELLED';
  orderDate: string;
  expectedDate?: string;
  receivedDate?: string;
  totalAmount: number;
  items: PurchaseOrderItem[];
}

/**
 * Purchase order item interface
 */
export interface PurchaseOrderItem {
  id: string;
  itemId: string;
  item?: InventoryItem;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

/**
 * Budget category interface
 */
export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  remaining: number;
  fiscalYear: string;
}
