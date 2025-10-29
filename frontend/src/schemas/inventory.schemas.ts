/**
 * Inventory Management Schemas
 * Zod validation schemas for inventory items, stock levels, and multi-location tracking
 */

import { z } from 'zod';

// ============================================================================
// Enums
// ============================================================================

export const InventoryItemCategoryEnum = z.enum([
  'medical_supplies',
  'medications',
  'equipment',
  'disposables',
  'first_aid',
  'personal_protective_equipment',
  'office_supplies',
  'cleaning_supplies',
  'other'
]);

export const UnitOfMeasureEnum = z.enum([
  'each',
  'box',
  'case',
  'bottle',
  'vial',
  'tube',
  'packet',
  'roll',
  'pair',
  'set',
  'gallon',
  'liter',
  'milliliter',
  'gram',
  'kilogram',
  'milligram',
  'ounce',
  'pound'
]);

export const DEAScheduleEnum = z.enum(['I', 'II', 'III', 'IV', 'V']);

export const LocationTypeEnum = z.enum([
  'clinic',
  'storage',
  'mobile',
  'emergency',
  'pharmacy',
  'nurse_office'
]);

// ============================================================================
// Base Schemas
// ============================================================================

export const InventoryItemSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Item name is required').max(255),
  description: z.string().max(1000).optional(),
  sku: z.string().min(1, 'SKU is required').max(100),
  barcode: z.string().max(100).optional().nullable(),
  category: InventoryItemCategoryEnum,
  subcategory: z.string().max(100).optional(),
  unit: UnitOfMeasureEnum,

  // Reorder management
  reorderPoint: z.number().min(0).default(0),
  reorderQuantity: z.number().min(0).default(0),

  // Controlled substance tracking
  isControlledSubstance: z.boolean().default(false),
  deaSchedule: DEAScheduleEnum.optional().nullable(),

  // Tracking requirements
  requiresBatchTracking: z.boolean().default(false),
  requiresExpirationDate: z.boolean().default(false),

  // Supplier information
  manufacturer: z.string().max(255).optional(),
  supplierInfo: z.record(z.any()).optional(), // JSONB field

  // Pricing (for valuation)
  unitCost: z.number().min(0).optional(),

  // Metadata
  metadata: z.record(z.any()).optional(),

  // Timestamps
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional().nullable(),
});

export const InventoryLocationSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Location name is required').max(255),
  code: z.string().min(1, 'Location code is required').max(50),
  type: LocationTypeEnum,
  address: z.string().max(500).optional(),
  contactInfo: z.record(z.any()).optional(), // JSONB: {phone, email, manager}
  isActive: z.boolean().default(true),

  // Security settings
  requiresAuthorization: z.boolean().default(false),
  authorizedUserIds: z.array(z.string().uuid()).optional(),

  // Metadata
  metadata: z.record(z.any()).optional(),

  // Timestamps
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const StockLevelSchema = z.object({
  id: z.string().uuid().optional(),
  itemId: z.string().uuid('Valid item ID is required'),
  locationId: z.string().uuid('Valid location ID is required'),

  // Quantities
  quantity: z.number().min(0, 'Quantity cannot be negative'),
  reservedQuantity: z.number().min(0).default(0),
  // availableQuantity is computed: quantity - reservedQuantity

  // Physical count tracking
  lastCountedAt: z.date().optional().nullable(),
  lastCountedBy: z.string().uuid().optional().nullable(),

  // Timestamps
  updatedAt: z.date().optional(),
});

export const BatchSchema = z.object({
  id: z.string().uuid().optional(),
  itemId: z.string().uuid('Valid item ID is required'),
  locationId: z.string().uuid('Valid location ID is required'),

  // Batch identification
  batchNumber: z.string().min(1, 'Batch number is required').max(100),
  lotNumber: z.string().max(100).optional(),

  // Dates
  expirationDate: z.date().optional().nullable(),
  manufactureDate: z.date().optional(),
  receivedDate: z.date(),

  // Quantity and cost
  quantity: z.number().min(0),
  unitCost: z.number().min(0).optional(),

  // Supplier information
  supplier: z.string().max(255).optional(),
  purchaseOrderId: z.string().uuid().optional().nullable(),

  // Metadata
  metadata: z.record(z.any()).optional(),

  // Timestamps
  createdAt: z.date().optional(),
});

// ============================================================================
// Create/Update DTOs
// ============================================================================

export const CreateInventoryItemSchema = InventoryItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
}).refine(
  (data) => {
    // If controlled substance, DEA schedule is required
    if (data.isControlledSubstance && !data.deaSchedule) {
      return false;
    }
    return true;
  },
  {
    message: 'DEA schedule is required for controlled substances',
    path: ['deaSchedule'],
  }
);

export const UpdateInventoryItemSchema = CreateInventoryItemSchema.partial();

export const CreateInventoryLocationSchema = InventoryLocationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateInventoryLocationSchema = CreateInventoryLocationSchema.partial();

export const CreateStockLevelSchema = StockLevelSchema.omit({
  id: true,
  updatedAt: true,
});

export const UpdateStockLevelSchema = z.object({
  quantity: z.number().min(0).optional(),
  reservedQuantity: z.number().min(0).optional(),
  lastCountedAt: z.date().optional(),
  lastCountedBy: z.string().uuid().optional(),
});

export const CreateBatchSchema = BatchSchema.omit({
  id: true,
  createdAt: true,
});

// ============================================================================
// Query/Filter Schemas
// ============================================================================

export const InventoryItemFilterSchema = z.object({
  search: z.string().optional(),
  category: InventoryItemCategoryEnum.optional(),
  subcategory: z.string().optional(),
  isControlledSubstance: z.boolean().optional(),
  requiresBatchTracking: z.boolean().optional(),
  locationId: z.string().uuid().optional(),
  belowReorderPoint: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.enum(['name', 'sku', 'category', 'quantity', 'updatedAt']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export const StockLevelFilterSchema = z.object({
  itemId: z.string().uuid().optional(),
  locationId: z.string().uuid().optional(),
  belowReorderPoint: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export const BatchFilterSchema = z.object({
  itemId: z.string().uuid().optional(),
  locationId: z.string().uuid().optional(),
  expiringBefore: z.date().optional(),
  expiringAfter: z.date().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// ============================================================================
// Response Schemas
// ============================================================================

export const InventoryItemWithStockSchema = InventoryItemSchema.extend({
  stockLevels: z.array(
    StockLevelSchema.extend({
      location: InventoryLocationSchema.optional(),
      availableQuantity: z.number(),
    })
  ).optional(),
  totalQuantity: z.number().optional(),
  totalAvailableQuantity: z.number().optional(),
  batches: z.array(BatchSchema).optional(),
});

export const StockLevelWithDetailsSchema = StockLevelSchema.extend({
  item: InventoryItemSchema.optional(),
  location: InventoryLocationSchema.optional(),
  availableQuantity: z.number(),
  batches: z.array(BatchSchema).optional(),
});

// ============================================================================
// Alert Schemas
// ============================================================================

export const LowStockAlertSchema = z.object({
  id: z.string().uuid(),
  itemId: z.string().uuid(),
  itemName: z.string(),
  sku: z.string(),
  locationId: z.string().uuid(),
  locationName: z.string(),
  currentQuantity: z.number(),
  availableQuantity: z.number(),
  reorderPoint: z.number(),
  reorderQuantity: z.number(),
  suggestedAction: z.string(),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  daysUntilStockout: z.number().optional(),
});

export const ExpirationAlertSchema = z.object({
  id: z.string().uuid(),
  itemId: z.string().uuid(),
  itemName: z.string(),
  batchId: z.string().uuid(),
  batchNumber: z.string(),
  locationId: z.string().uuid(),
  locationName: z.string(),
  expirationDate: z.date(),
  daysUntilExpiration: z.number(),
  quantity: z.number(),
  priority: z.enum(['critical', 'warning', 'info']),
  suggestedAction: z.string(),
});

// ============================================================================
// Bulk Operations
// ============================================================================

export const BulkImportItemSchema = z.object({
  items: z.array(CreateInventoryItemSchema),
  skipDuplicates: z.boolean().default(true),
  updateExisting: z.boolean().default(false),
});

export const PhysicalCountSchema = z.object({
  locationId: z.string().uuid(),
  countedBy: z.string().uuid(),
  countedAt: z.date().default(() => new Date()),
  items: z.array(
    z.object({
      itemId: z.string().uuid(),
      countedQuantity: z.number().min(0),
      notes: z.string().optional(),
    })
  ),
});

// ============================================================================
// Type Exports
// ============================================================================

export type InventoryItem = z.infer<typeof InventoryItemSchema>;
export type CreateInventoryItem = z.infer<typeof CreateInventoryItemSchema>;
export type UpdateInventoryItem = z.infer<typeof UpdateInventoryItemSchema>;

export type InventoryLocation = z.infer<typeof InventoryLocationSchema>;
export type CreateInventoryLocation = z.infer<typeof CreateInventoryLocationSchema>;
export type UpdateInventoryLocation = z.infer<typeof UpdateInventoryLocationSchema>;

export type StockLevel = z.infer<typeof StockLevelSchema>;
export type CreateStockLevel = z.infer<typeof CreateStockLevelSchema>;
export type UpdateStockLevel = z.infer<typeof UpdateStockLevelSchema>;

export type Batch = z.infer<typeof BatchSchema>;
export type CreateBatch = z.infer<typeof CreateBatchSchema>;

export type InventoryItemFilter = z.infer<typeof InventoryItemFilterSchema>;
export type StockLevelFilter = z.infer<typeof StockLevelFilterSchema>;
export type BatchFilter = z.infer<typeof BatchFilterSchema>;

export type InventoryItemWithStock = z.infer<typeof InventoryItemWithStockSchema>;
export type StockLevelWithDetails = z.infer<typeof StockLevelWithDetailsSchema>;

export type LowStockAlert = z.infer<typeof LowStockAlertSchema>;
export type ExpirationAlert = z.infer<typeof ExpirationAlertSchema>;

export type BulkImportItem = z.infer<typeof BulkImportItemSchema>;
export type PhysicalCount = z.infer<typeof PhysicalCountSchema>;
