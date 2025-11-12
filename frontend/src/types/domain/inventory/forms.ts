/**
 * WF-COMP-328 | forms.ts - Inventory form data type definitions
 * Purpose: Form data interfaces for inventory management forms
 * Upstream: None | Dependencies: requests, enums
 * Downstream: Form components, validation | Called by: Form handlers
 * Related: requests, core-entities
 * Exports: Form data types for inventory, transactions, maintenance, vendors, purchase orders
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: User input → Form state → Validation → Submission
 * LLM Context: Form data types for inventory management forms
 */

import type {
  CreateInventoryItemRequest,
  CreateVendorRequest,
  CreatePurchaseOrderRequest,
} from './requests';
import type { InventoryTransactionType, MaintenanceType } from './enums';

/**
 * Inventory Item Form Data
 * Form state for inventory item creation/editing
 * Extends create request with optional id for edit mode
 */
export interface InventoryItemFormData extends CreateInventoryItemRequest {
  id?: string;
}

/**
 * Inventory Transaction Form Data
 * Form state for recording inventory transactions
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
 * Form state for maintenance log entries
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
 * Form state for vendor creation/editing
 * Extends create request with optional id and isActive for edit mode
 */
export interface VendorFormData extends CreateVendorRequest {
  id?: string;
  isActive?: boolean;
}

/**
 * Purchase Order Form Data
 * Form state for purchase order creation/editing
 * Extends create request with optional id for edit mode
 */
export interface PurchaseOrderFormData extends CreatePurchaseOrderRequest {
  id?: string;
}
