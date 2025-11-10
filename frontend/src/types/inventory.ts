/**
 * @fileoverview Inventory Type Definitions
 * @module types/inventory
 *
 * @description
 * TypeScript type definitions for inventory management.
 * Provides type safety for inventory data structures.
 *
 * @since 1.0.0
 */

export interface InventoryItem {
  id: string | number
  name: string
  description?: string
  sku?: string
  category?: string
  categoryId?: string | number
  location?: string
  locationId?: string | number
  quantity: number
  unit: string
  minStockLevel?: number
  maxStockLevel?: number
  reorderPoint?: number
  cost?: number
  price?: number
  supplier?: string
  supplierId?: string | number
  expirationDate?: string | Date
  lotNumber?: string
  status: 'active' | 'inactive' | 'discontinued' | 'low-stock' | 'out-of-stock'
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface InventoryCategory {
  id: string | number
  name: string
  description?: string
  parentId?: string | number
  itemCount?: number
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface InventoryLocation {
  id: string | number
  name: string
  description?: string
  type?: 'warehouse' | 'clinic' | 'office' | 'vehicle' | 'other'
  address?: string
  capacity?: number
  itemCount?: number
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface InventoryOrder {
  id: string | number
  orderNumber?: string
  supplierId?: string | number
  supplier?: InventoryVendor
  status: 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled'
  orderDate: string | Date
  expectedDate?: string | Date
  receivedDate?: string | Date
  items: InventoryOrderItem[]
  totalCost?: number
  notes?: string
  orderedBy?: string
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface InventoryOrderItem {
  id: string | number
  orderId: string | number
  itemId: string | number
  item?: InventoryItem
  quantity: number
  unitCost?: number
  totalCost?: number
  received?: number
  status: 'pending' | 'partial' | 'received' | 'cancelled'
}

export interface InventoryVendor {
  id: string | number
  name: string
  contactName?: string
  email?: string
  phone?: string
  address?: string
  website?: string
  notes?: string
  status: 'active' | 'inactive'
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface InventoryTransaction {
  id: string | number
  itemId: string | number
  item?: InventoryItem
  type: 'receive' | 'issue' | 'transfer' | 'adjustment' | 'return' | 'discard'
  quantity: number
  previousQuantity?: number
  newQuantity?: number
  fromLocation?: string
  toLocation?: string
  reason?: string
  notes?: string
  performedBy: string
  createdAt: string | Date
}

export interface StockAlert {
  id: string | number
  itemId: string | number
  item?: InventoryItem
  type: 'low-stock' | 'out-of-stock' | 'expiring-soon' | 'expired'
  severity: 'info' | 'warning' | 'critical'
  message: string
  createdAt: string | Date
  acknowledged?: boolean
  acknowledgedBy?: string
  acknowledgedAt?: string | Date
}

// Alias types for backward compatibility
export type PurchaseOrder = InventoryOrder
export type Vendor = InventoryVendor
