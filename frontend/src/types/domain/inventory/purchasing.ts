/**
 * WF-COMP-328 | purchasing.ts - Purchase order and vendor type definitions
 * Purpose: Types for purchase order management and vendor relationships
 * Upstream: BaseEntity from core/common | Dependencies: core-entities, enums
 * Downstream: Purchase order components, vendor management | Called by: Purchasing API
 * Related: core-entities, requests, responses
 * Exports: Vendor, PurchaseOrder, PurchaseOrderItem, GeneratedPurchaseOrder
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Purchase order creation → Vendor selection → Item receiving
 * LLM Context: Purchase order and vendor management types
 */

import type { BaseEntity } from '../../core/common';
import type { PurchaseOrderStatus } from './enums';
import type { InventoryItem } from './core-entities';

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
 * Generated Purchase Order - Purchase order summary from generation
 * Used when automatically generating purchase orders from low stock items
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
