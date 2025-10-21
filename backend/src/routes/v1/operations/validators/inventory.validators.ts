/**
 * Inventory Validators
 * Validation schemas for inventory management endpoints
 * Ensures data integrity for items, stock, orders, and suppliers
 */

import Joi from 'joi';
import { paginationSchema } from '../../../shared/validators';

/**
 * INVENTORY ITEM CATEGORIES
 * Healthcare-specific inventory categories
 */
const INVENTORY_CATEGORIES = [
  'MEDICATION',
  'MEDICAL_SUPPLY',
  'EQUIPMENT',
  'FIRST_AID',
  'OFFICE_SUPPLY',
  'PPE',
  'OTHER'
];

/**
 * STOCK STATUS TYPES
 */
const STOCK_STATUS = [
  'IN_STOCK',
  'LOW_STOCK',
  'OUT_OF_STOCK',
  'DISCONTINUED',
  'EXPIRED'
];

/**
 * PURCHASE ORDER STATUS TYPES
 */
const PURCHASE_ORDER_STATUS = [
  'PENDING',
  'APPROVED',
  'ORDERED',
  'PARTIALLY_RECEIVED',
  'RECEIVED',
  'CANCELLED'
];

/**
 * QUERY SCHEMAS
 */

export const listItemsQuerySchema = Joi.object({
  ...paginationSchema.describe('Pagination parameters').extract(['page', 'limit']),
  category: Joi.string()
    .valid(...INVENTORY_CATEGORIES)
    .optional()
    .description('Filter by inventory category'),
  supplier: Joi.string()
    .trim()
    .optional()
    .description('Filter by supplier name (partial match)'),
  location: Joi.string()
    .trim()
    .optional()
    .description('Filter by storage location (partial match)'),
  lowStock: Joi.boolean()
    .optional()
    .description('Filter for items at or below reorder level'),
  isActive: Joi.boolean()
    .optional()
    .description('Filter by active status (true = active, false = archived)')
});

export const stockLevelsQuerySchema = Joi.object({
  ...paginationSchema.describe('Pagination parameters').extract(['page', 'limit'])
});

export const stockHistoryQuerySchema = Joi.object({
  ...paginationSchema.describe('Pagination parameters').extract(['page', 'limit'])
});

export const listPurchaseOrdersQuerySchema = Joi.object({
  status: Joi.string()
    .valid(...PURCHASE_ORDER_STATUS)
    .optional()
    .description('Filter by order status'),
  vendorId: Joi.string()
    .uuid()
    .optional()
    .description('Filter by vendor/supplier ID')
});

export const listSuppliersQuerySchema = Joi.object({
  isActive: Joi.boolean()
    .optional()
    .description('Filter by active status')
});

export const analyticsQuerySchema = Joi.object({
  // No query params needed for general analytics
});

export const usageReportQuerySchema = Joi.object({
  startDate: Joi.date()
    .iso()
    .optional()
    .description('Report start date (ISO 8601 format, defaults to 30 days ago)'),
  endDate: Joi.date()
    .iso()
    .optional()
    .description('Report end date (ISO 8601 format, defaults to now)')
});

/**
 * PARAMETER SCHEMAS
 */

export const itemIdParamSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .description('Inventory item UUID')
});

export const purchaseOrderIdParamSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .description('Purchase order UUID')
});

export const supplierIdParamSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .description('Supplier/vendor UUID')
});

/**
 * PAYLOAD SCHEMAS
 */

export const createItemSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .required()
    .description('Item name (1-200 characters)'),
  category: Joi.string()
    .valid(...INVENTORY_CATEGORIES)
    .required()
    .description('Item category (MEDICATION, MEDICAL_SUPPLY, EQUIPMENT, etc.)'),
  description: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .allow(null, '')
    .description('Detailed item description (max 1000 characters)'),
  sku: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow(null, '')
    .description('Stock Keeping Unit / Product Code'),
  supplier: Joi.string()
    .trim()
    .max(200)
    .optional()
    .allow(null, '')
    .description('Primary supplier/vendor name'),
  unitCost: Joi.number()
    .min(0)
    .max(999999.99)
    .precision(2)
    .optional()
    .allow(null)
    .description('Cost per unit in dollars (max $999,999.99)'),
  reorderLevel: Joi.number()
    .integer()
    .min(0)
    .max(1000000)
    .required()
    .description('Stock level that triggers reorder alert'),
  reorderQuantity: Joi.number()
    .integer()
    .min(1)
    .max(1000000)
    .required()
    .description('Quantity to order when reorder level is reached'),
  location: Joi.string()
    .trim()
    .max(200)
    .optional()
    .allow(null, '')
    .description('Storage location (e.g., "Nurse Office - Cabinet A")'),
  notes: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .allow(null, '')
    .description('Additional notes or special handling instructions')
});

export const updateItemSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .optional()
    .description('Item name (1-200 characters)'),
  category: Joi.string()
    .valid(...INVENTORY_CATEGORIES)
    .optional()
    .description('Item category'),
  description: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .allow(null, '')
    .description('Item description'),
  sku: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow(null, '')
    .description('SKU / Product Code'),
  supplier: Joi.string()
    .trim()
    .max(200)
    .optional()
    .allow(null, '')
    .description('Supplier name'),
  unitCost: Joi.number()
    .min(0)
    .max(999999.99)
    .precision(2)
    .optional()
    .allow(null)
    .description('Cost per unit'),
  reorderLevel: Joi.number()
    .integer()
    .min(0)
    .max(1000000)
    .optional()
    .description('Reorder trigger level'),
  reorderQuantity: Joi.number()
    .integer()
    .min(1)
    .max(1000000)
    .optional()
    .description('Reorder quantity'),
  location: Joi.string()
    .trim()
    .max(200)
    .optional()
    .allow(null, '')
    .description('Storage location'),
  notes: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .allow(null, '')
    .description('Notes'),
  isActive: Joi.boolean()
    .optional()
    .description('Active status (false = archived)')
}).min(1); // At least one field must be provided

export const adjustStockSchema = Joi.object({
  quantity: Joi.number()
    .integer()
    .min(-1000000)
    .max(1000000)
    .required()
    .not(0)
    .description('Quantity adjustment (positive = add, negative = remove, cannot be 0)'),
  reason: Joi.string()
    .trim()
    .min(5)
    .max(500)
    .required()
    .description('Reason for stock adjustment (5-500 characters)')
});

export const recordStockCountSchema = Joi.object({
  countedQuantity: Joi.number()
    .integer()
    .min(0)
    .max(1000000)
    .required()
    .description('Actual quantity counted during physical inventory'),
  notes: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow(null, '')
    .description('Stock count notes or observations')
});

export const createPurchaseOrderSchema = Joi.object({
  orderNumber: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .description('Unique purchase order number (e.g., PO-2024-001)'),
  vendorId: Joi.string()
    .uuid()
    .required()
    .description('Vendor/supplier UUID'),
  orderDate: Joi.date()
    .iso()
    .required()
    .description('Order date (ISO 8601 format)'),
  expectedDate: Joi.date()
    .iso()
    .optional()
    .allow(null)
    .description('Expected delivery date (ISO 8601 format)'),
  notes: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .allow(null, '')
    .description('Order notes or special instructions'),
  items: Joi.array()
    .items(
      Joi.object({
        inventoryItemId: Joi.string()
          .uuid()
          .required()
          .description('Inventory item UUID'),
        quantity: Joi.number()
          .integer()
          .min(1)
          .max(1000000)
          .required()
          .description('Quantity to order'),
        unitCost: Joi.number()
          .min(0)
          .max(999999.99)
          .precision(2)
          .required()
          .description('Cost per unit for this order')
      })
    )
    .min(1)
    .max(100)
    .required()
    .description('Array of items to order (1-100 items)')
});

export const receivePurchaseOrderSchema = Joi.object({
  status: Joi.string()
    .valid('RECEIVED', 'PARTIALLY_RECEIVED', 'CANCELLED')
    .required()
    .description('New order status'),
  receivedDate: Joi.date()
    .iso()
    .optional()
    .allow(null)
    .description('Date order was received (defaults to now if status is RECEIVED)')
});

export const createSupplierSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .required()
    .description('Vendor/supplier name (1-200 characters)'),
  contactName: Joi.string()
    .trim()
    .max(200)
    .optional()
    .allow(null, '')
    .description('Primary contact person name'),
  email: Joi.string()
    .trim()
    .email()
    .max(200)
    .optional()
    .allow(null, '')
    .description('Contact email address'),
  phone: Joi.string()
    .trim()
    .pattern(/^[\d\s\-\(\)\+\.ext]+$/)
    .max(50)
    .optional()
    .allow(null, '')
    .description('Contact phone number'),
  address: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow(null, '')
    .description('Business address'),
  website: Joi.string()
    .trim()
    .uri()
    .max(200)
    .optional()
    .allow(null, '')
    .description('Company website URL'),
  taxId: Joi.string()
    .trim()
    .max(50)
    .optional()
    .allow(null, '')
    .description('Tax ID / EIN'),
  paymentTerms: Joi.string()
    .trim()
    .max(200)
    .optional()
    .allow(null, '')
    .description('Payment terms (e.g., "Net 30", "Due on receipt")'),
  notes: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .allow(null, '')
    .description('Supplier notes'),
  rating: Joi.number()
    .min(1)
    .max(5)
    .optional()
    .allow(null)
    .description('Supplier rating (1-5 stars)')
});

export const updateSupplierSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .optional()
    .description('Vendor/supplier name'),
  contactName: Joi.string()
    .trim()
    .max(200)
    .optional()
    .allow(null, '')
    .description('Contact person name'),
  email: Joi.string()
    .trim()
    .email()
    .max(200)
    .optional()
    .allow(null, '')
    .description('Contact email'),
  phone: Joi.string()
    .trim()
    .pattern(/^[\d\s\-\(\)\+\.ext]+$/)
    .max(50)
    .optional()
    .allow(null, '')
    .description('Contact phone'),
  address: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow(null, '')
    .description('Address'),
  website: Joi.string()
    .trim()
    .uri()
    .max(200)
    .optional()
    .allow(null, '')
    .description('Website URL'),
  taxId: Joi.string()
    .trim()
    .max(50)
    .optional()
    .allow(null, '')
    .description('Tax ID'),
  paymentTerms: Joi.string()
    .trim()
    .max(200)
    .optional()
    .allow(null, '')
    .description('Payment terms'),
  notes: Joi.string()
    .trim()
    .max(1000)
    .optional()
    .allow(null, '')
    .description('Notes'),
  rating: Joi.number()
    .min(1)
    .max(5)
    .optional()
    .allow(null)
    .description('Rating (1-5)'),
  isActive: Joi.boolean()
    .optional()
    .description('Active status')
}).min(1); // At least one field must be provided
