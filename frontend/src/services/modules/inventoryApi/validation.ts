/**
 * Validation schemas for Inventory Management API
 *
 * Contains all Zod validation schemas for request/response data validation
 * including inventory items, stock adjustments, transfers, suppliers, and purchase orders.
 *
 * @module services/modules/inventoryApi/validation
 */

import { z } from 'zod';

// ==========================================
// INVENTORY ITEM VALIDATION
// ==========================================

export const createInventoryItemSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(255),
  category: z.string().min(1, 'Category is required').max(100),
  description: z.string().max(5000).optional(),
  sku: z.string().max(50).optional(),
  supplier: z.string().max(255).optional(),
  unitCost: z.number().nonnegative('Unit cost must be non-negative').max(99999999.99),
  initialStock: z.number().int().nonnegative().optional(),
  reorderLevel: z.number().int().nonnegative().max(1000000),
  reorderQuantity: z.number().int().positive().max(1000000),
  location: z.string().max(255).optional(),
  notes: z.string().max(10000).optional(),
});

// ==========================================
// STOCK MANAGEMENT VALIDATION
// ==========================================

export const stockAdjustmentSchema = z.object({
  quantity: z.number().int().refine((val) => val !== 0, 'Quantity cannot be zero'),
  reason: z.string().min(1, 'Reason is required').max(5000),
  notes: z.string().max(10000).optional(),
});

export const stockTransferSchema = z.object({
  inventoryItemId: z.string().uuid('Invalid inventory item ID'),
  fromLocation: z.string().min(1, 'From location is required').max(255),
  toLocation: z.string().min(1, 'To location is required').max(255),
  quantity: z.number().int().positive('Quantity must be positive').max(1000000),
  reason: z.string().min(1, 'Reason is required').max(5000),
  notes: z.string().max(10000).optional(),
}).refine((data) => data.fromLocation !== data.toLocation, {
  message: 'From and To locations must be different',
  path: ['toLocation']
});

// ==========================================
// SUPPLIER VALIDATION
// ==========================================

export const createSupplierSchema = z.object({
  name: z.string().min(1, 'Supplier name is required').max(255),
  contactName: z.string().max(255).optional(),
  email: z.string().email('Must be a valid email').max(255).optional().or(z.literal('')),
  phone: z.string().max(50).optional(),
  address: z.string().max(1000).optional(),
  website: z.string().url('Must be a valid URL').max(255).optional().or(z.literal('')),
  taxId: z.string().max(50).optional(),
  paymentTerms: z.string().max(255).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  isPreferred: z.boolean().optional(),
  notes: z.string().max(10000).optional(),
});

// ==========================================
// PURCHASE ORDER VALIDATION
// ==========================================

export const createPurchaseOrderSchema = z.object({
  orderNumber: z.string().min(1, 'Order number is required').max(50),
  supplierId: z.string().uuid('Invalid supplier ID'),
  orderDate: z.string().min(1, 'Order date is required'),
  expectedDate: z.string().optional(),
  notes: z.string().max(10000).optional(),
  items: z.array(z.object({
    inventoryItemId: z.string().uuid('Invalid inventory item ID'),
    quantity: z.number().int().positive('Quantity must be positive').max(1000000),
    unitCost: z.number().nonnegative('Unit cost must be non-negative').max(99999999.99),
  })).min(1, 'At least one item is required'),
});

// ==========================================
// TRANSACTION VALIDATION
// ==========================================

export const createTransactionSchema = z.object({
  inventoryItemId: z.string().uuid('Invalid inventory item ID'),
  type: z.enum(['PURCHASE', 'USAGE', 'ADJUSTMENT', 'TRANSFER', 'DISPOSAL', 'RETURN', 'LOSS', 'DAMAGE']),
  quantity: z.number().int().refine((val) => val !== 0, 'Quantity cannot be zero'),
  unitCost: z.number().nonnegative('Unit cost must be non-negative').max(99999999.99).optional(),
  reason: z.string().max(5000).optional(),
  batchNumber: z.string().max(50).optional(),
  expirationDate: z.string().optional(),
  notes: z.string().max(10000).optional(),
});

// ==========================================
// MAINTENANCE VALIDATION
// ==========================================

export const createMaintenanceLogSchema = z.object({
  inventoryItemId: z.string().uuid('Invalid inventory item ID'),
  type: z.enum(['ROUTINE', 'REPAIR', 'CALIBRATION', 'INSPECTION', 'CLEANING', 'REPLACEMENT']),
  description: z.string().min(1, 'Description is required').max(5000),
  cost: z.number().nonnegative('Cost must be non-negative').max(99999999.99).optional(),
  performedDate: z.string().min(1, 'Performed date is required'),
  nextMaintenanceDate: z.string().optional(),
  vendor: z.string().max(255).optional(),
  notes: z.string().max(10000).optional(),
});

// ==========================================
// ALERT VALIDATION
// ==========================================

export const acknowledgeAlertSchema = z.object({
  acknowledgedBy: z.string().min(1, 'Acknowledged by is required').max(255),
});

// ==========================================
// FILTER VALIDATION
// ==========================================

export const inventoryFiltersSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(1000).optional(),
  category: z.string().max(100).optional(),
  supplier: z.string().max(255).optional(),
  location: z.string().max(255).optional(),
  lowStock: z.boolean().optional(),
  needsMaintenance: z.boolean().optional(),
  isActive: z.boolean().optional(),
  search: z.string().max(255).optional(),
});

export const analyticsFiltersSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  category: z.string().max(100).optional(),
  itemId: z.string().uuid().optional(),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return start <= end;
}, {
  message: 'Start date must be before or equal to end date',
  path: ['endDate']
});

// ==========================================
// BULK OPERATIONS VALIDATION
// ==========================================

export const bulkImportSchema = z.object({
  items: z.array(createInventoryItemSchema).min(1, 'At least one item is required').max(1000, 'Maximum 1000 items allowed'),
});

export const exportFiltersSchema = z.object({
  format: z.enum(['csv', 'excel']).default('csv'),
  category: z.string().max(100).optional(),
  supplier: z.string().max(255).optional(),
  location: z.string().max(255).optional(),
  isActive: z.boolean().optional(),
});
