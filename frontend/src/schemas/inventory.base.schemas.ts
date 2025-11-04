/**
 * @fileoverview Base inventory schemas
 * @module schemas/inventory.base
 *
 * Base schemas for inventory items, locations, and enums.
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

export type InventoryItem = z.infer<typeof InventoryItemSchema>;

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

export type InventoryLocation = z.infer<typeof InventoryLocationSchema>;

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

export type CreateInventoryItem = z.infer<typeof CreateInventoryItemSchema>;

export const UpdateInventoryItemSchema = CreateInventoryItemSchema.partial();

export type UpdateInventoryItem = z.infer<typeof UpdateInventoryItemSchema>;

export const CreateInventoryLocationSchema = InventoryLocationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateInventoryLocation = z.infer<typeof CreateInventoryLocationSchema>;

export const UpdateInventoryLocationSchema = CreateInventoryLocationSchema.partial();

export type UpdateInventoryLocation = z.infer<typeof UpdateInventoryLocationSchema>;
