/**
 * Inventory Management Schemas
 * Zod validation schemas for inventory items, stock levels, and multi-location tracking
 *
 * @module schemas/inventory
 * @description Barrel export for all inventory-related schemas including
 * items, locations, stock levels, batches, and alerts.
 */

// Base inventory schemas
export {
  InventoryItemCategoryEnum,
  UnitOfMeasureEnum,
  DEAScheduleEnum,
  LocationTypeEnum,
  InventoryItemSchema,
  InventoryLocationSchema,
  CreateInventoryItemSchema,
  UpdateInventoryItemSchema,
  CreateInventoryLocationSchema,
  UpdateInventoryLocationSchema,
  type InventoryItem,
  type CreateInventoryItem,
  type UpdateInventoryItem,
  type InventoryLocation,
  type CreateInventoryLocation,
  type UpdateInventoryLocation,
} from './inventory.base.schemas';

// Stock and batch tracking
export {
  StockLevelSchema,
  CreateStockLevelSchema,
  UpdateStockLevelSchema,
  BatchSchema,
  CreateBatchSchema,
  PhysicalCountSchema,
  type StockLevel,
  type CreateStockLevel,
  type UpdateStockLevel,
  type Batch,
  type CreateBatch,
  type PhysicalCount,
} from './inventory.stock.schemas';

// Queries and responses
export {
  InventoryItemFilterSchema,
  StockLevelFilterSchema,
  BatchFilterSchema,
  InventoryItemWithStockSchema,
  StockLevelWithDetailsSchema,
  LowStockAlertSchema,
  ExpirationAlertSchema,
  BulkImportItemSchema,
  type InventoryItemFilter,
  type StockLevelFilter,
  type BatchFilter,
  type InventoryItemWithStock,
  type StockLevelWithDetails,
  type LowStockAlert,
  type ExpirationAlert,
  type BulkImportItem,
} from './inventory.queries.schemas';
