/**
 * Barrel file for inventory module
 * Provides clean public API
 */

// Module files
export * from './inventory.controller';
export * from './inventory.service';

// Submodules
export * from './dto';
export {
  InventoryItem,
  InventoryItemAttributes,
  InventoryTransaction,
  InventoryTransactionType,
  MaintenanceLog,
  MaintenanceType,
  PurchaseOrderItem,
  PurchaseOrder,
  PurchaseOrderStatus,
  Vendor,
} from '@/database/models';
export * from './services';

