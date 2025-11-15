/**
 * @fileoverview Inventory Management API - DEPRECATED Legacy Service Layer
 *
 * ⚠️ DEPRECATION WARNING ⚠️
 * This service module is deprecated and will be removed in v2.0.0 (scheduled: 2026-06-30).
 * Please migrate to the new server actions pattern: @/lib/actions/inventory.*
 *
 * Migration documentation: /src/services/modules/DEPRECATED.md
 * New implementation: /src/lib/actions/inventory.actions.ts
 *
 * CRITICAL CHANGES REQUIRED:
 * 1. Replace client-side API calls with server actions
 * 2. Update imports from services to actions
 * 3. Adapt to new Next.js 14+ App Router patterns
 * 4. Review cache invalidation strategies for inventory
 *
 * @module services/modules/inventoryApi
 * @deprecated since v1.5.0 - Use @/lib/actions/inventory.* instead
 */

// Re-export everything from the modular structure for backward compatibility
export * from './inventoryApi/index';

// Default export for backward compatibility
export { inventoryApi as default } from './inventoryApi/index';

// ==========================================
// MIGRATION GUIDE - Inventory API
// ==========================================
// Complete migration path from legacy service to new server actions
// Removal date: v2.0.0 (June 30, 2026)
//
// NEW ARCHITECTURE:
// - Server actions with 'use server' directive
// - Next.js cache integration (revalidateTag/revalidatePath)
// - HIPAA-compliant audit logging for controlled substances
// - Improved type safety and error handling
// - Better performance with built-in caching
// - Multi-location inventory tracking
//
// ==========================================
// INVENTORY ITEM OPERATIONS MIGRATION
// ==========================================
//
// CREATE INVENTORY ITEM
// ---------------------
// Before:
//   import { inventoryApi } from '@/services/modules/inventoryApi';
//   const item = await inventoryApi.inventory.createInventoryItem({
//     name: 'Bandages',
//     category: 'MEDICAL_SUPPLIES',
//     unitOfMeasure: 'box',
//     unitCost: 5.99,
//     minStockLevel: 10
//   });
//
// After (Form Action):
//   'use client';
//   import { useActionState } from 'react';
//   import { createInventoryItemAction } from '@/lib/actions/inventory.items';
//
//   function InventoryForm() {
//     const [state, formAction, isPending] = useActionState(
//       createInventoryItemAction,
//       { success: false }
//     );
//     return (
//       <form action={formAction}>
//         <input name="name" defaultValue="Bandages" />
//         <input name="category" defaultValue="MEDICAL_SUPPLIES" />
//         <input name="unitOfMeasure" defaultValue="box" />
//         <input name="unitCost" type="number" defaultValue="5.99" />
//         <button type="submit" disabled={isPending}>Create</button>
//       </form>
//     );
//   }
//
// GET INVENTORY ITEMS (with filters)
// ----------------------------------
// Before:
//   const items = await inventoryApi.inventory.getInventoryItems({
//     category: 'MEDICAL_SUPPLIES',
//     active: true
//   });
//
// After:
//   import { getInventoryItemsAction } from '@/lib/actions/inventory.items';
//   const result = await getInventoryItemsAction({
//     category: 'MEDICAL_SUPPLIES',
//     active: true
//   });
//   if (result.success) {
//     const items = result.data;
//   }
//
// GET SINGLE INVENTORY ITEM
// -------------------------
// Before:
//   const item = await inventoryApi.inventory.getInventoryItem('item-id');
//
// After:
//   import { getInventoryItemAction } from '@/lib/actions/inventory.items';
//   const result = await getInventoryItemAction('item-id', true); // includeStock
//   if (result.success) {
//     const item = result.data;
//   }
//
// UPDATE INVENTORY ITEM
// ---------------------
// Before:
//   const updated = await inventoryApi.inventory.updateInventoryItem('item-id', {
//     unitCost: 6.99,
//     minStockLevel: 15
//   });
//
// After:
//   import { updateInventoryItemAction } from '@/lib/actions/inventory.items';
//   // Use with form or manually construct FormData
//   const formData = new FormData();
//   formData.set('unitCost', '6.99');
//   formData.set('minStockLevel', '15');
//   const result = await updateInventoryItemAction('item-id', {}, formData);
//
// DELETE INVENTORY ITEM (soft delete)
// ------------------------------------
// Before:
//   await inventoryApi.inventory.deleteInventoryItem('item-id');
//
// After:
//   import { deleteInventoryItemAction } from '@/lib/actions/inventory.items';
//   const result = await deleteInventoryItemAction('item-id');
//
// SEARCH INVENTORY ITEMS
// ----------------------
// Before:
//   const results = await inventoryApi.inventory.searchInventoryItems({
//     search: 'bandage',
//     category: 'MEDICAL_SUPPLIES'
//   });
//
// After:
//   import { getInventoryItemsAction } from '@/lib/actions/inventory.items';
//   const result = await getInventoryItemsAction({
//     search: 'bandage',
//     category: 'MEDICAL_SUPPLIES'
//   });
//
// ==========================================
// STOCK MANAGEMENT OPERATIONS MIGRATION
// ==========================================
//
// GET STOCK LEVELS
// ----------------
// Before:
//   const stock = await inventoryApi.stock.getCurrentStock('item-id');
//   // OR get low stock items
//   const lowStock = await inventoryApi.stock.getLowStockItems();
//
// After:
//   import { getStockLevelsAction } from '@/lib/actions/inventory.stock';
//   const result = await getStockLevelsAction('item-id');
//   if (result.success) {
//     const stockLevels = result.data;
//   }
//
// CREATE STOCK LEVEL (for new location)
// --------------------------------------
// Before:
//   await inventoryApi.stock.createStockLevel({
//     inventoryItemId: 'item-id',
//     locationId: 'location-id',
//     quantity: 100
//   });
//
// After:
//   import { createStockLevelAction } from '@/lib/actions/inventory.stock';
//   const result = await createStockLevelAction({
//     inventoryItemId: 'item-id',
//     locationId: 'location-id',
//     quantity: 100
//   });
//
// ADJUST STOCK
// ------------
// Before:
//   await inventoryApi.stock.adjustStock('item-id', {
//     locationId: 'location-id',
//     quantity: -5, // negative for deduction
//     reason: 'Used in treatment',
//     transactionType: 'USAGE'
//   });
//
// After:
//   // Stock adjustments now through transactions API
//   import { createStockLevelAction } from '@/lib/actions/inventory.stock';
//   // Adjust quantity in stock level update
//
// TRANSFER STOCK (between locations)
// ----------------------------------
// Before:
//   await inventoryApi.stock.transferStock({
//     itemId: 'item-id',
//     fromLocationId: 'location-1',
//     toLocationId: 'location-2',
//     quantity: 10,
//     reason: 'Rebalancing inventory'
//   });
//
// After:
//   // Use transactions API for transfers
//   import { getStockLevelsAction } from '@/lib/actions/inventory.stock';
//   // Implement transfer logic with stock level updates
//
// GET EXPIRING ITEMS
// ------------------
// Before:
//   const expiring = await inventoryApi.stock.getExpiringItems({
//     daysUntilExpiration: 30
//   });
//
// After:
//   import { getExpiringBatchesAction } from '@/lib/actions/inventory.batches';
//   const result = await getExpiringBatchesAction(30); // days
//   if (result.success) {
//     const expiringBatches = result.data;
//   }
//
// ==========================================
// BATCH OPERATIONS MIGRATION
// ==========================================
//
// CREATE BATCH (for expiration tracking)
// ---------------------------------------
// Before:
//   await inventoryApi.stock.createTransaction({
//     itemId: 'item-id',
//     batchNumber: 'BATCH-001',
//     expirationDate: '2026-12-31',
//     quantity: 50
//   });
//
// After:
//   import { createBatchAction } from '@/lib/actions/inventory.batches';
//   const result = await createBatchAction({
//     inventoryItemId: 'item-id',
//     batchNumber: 'BATCH-001',
//     expirationDate: '2026-12-31',
//     quantity: 50
//   });
//
// GET EXPIRING BATCHES
// --------------------
// Before:
//   const batches = await inventoryApi.stock.getExpiringItems(30);
//
// After:
//   import { getExpiringBatchesAction } from '@/lib/actions/inventory.batches';
//   const result = await getExpiringBatchesAction(30);
//
// ==========================================
// LOCATION OPERATIONS MIGRATION
// ==========================================
//
// GET INVENTORY LOCATIONS
// -----------------------
// Before:
//   // Not directly available in old API
//
// After:
//   import { getInventoryLocationsAction } from '@/lib/actions/inventory.locations';
//   const result = await getInventoryLocationsAction();
//   if (result.success) {
//     const locations = result.data;
//   }
//
// CREATE INVENTORY LOCATION
// -------------------------
// Before:
//   // Not directly available in old API
//
// After:
//   import { createInventoryLocationAction } from '@/lib/actions/inventory.locations';
//   const result = await createInventoryLocationAction({
//     name: 'Main Storage',
//     description: 'Primary inventory location',
//     type: 'WAREHOUSE'
//   });
//
// ==========================================
// ANALYTICS & REPORTING MIGRATION
// ==========================================
//
// GET INVENTORY STATISTICS
// ------------------------
// Before:
//   const stats = await inventoryApi.analytics.getInventoryStats();
//
// After:
//   import { getInventoryStats } from '@/lib/actions/inventory.analytics';
//   const result = await getInventoryStats();
//   if (result.success) {
//     const stats = result.data;
//   }
//
// GET INVENTORY DASHBOARD DATA
// ----------------------------
// Before:
//   const dashboard = await inventoryApi.analytics.getInventoryStats();
//
// After:
//   import { getInventoryDashboardData } from '@/lib/actions/inventory.analytics';
//   const result = await getInventoryDashboardData();
//   if (result.success) {
//     const dashboardData = result.data;
//   }
//
// GET CATEGORIES
// --------------
// Before:
//   // Categories were hardcoded or fetched separately
//
// After:
//   import { getInventoryCategoriesAction } from '@/lib/actions/inventory.analytics';
//   const result = await getInventoryCategoriesAction();
//   const categories = result.data;
//
// GET USAGE ANALYTICS
// -------------------
// Before:
//   const analytics = await inventoryApi.analytics.getUsageAnalytics({
//     startDate: '2025-01-01',
//     endDate: '2025-12-31'
//   });
//
// After:
//   // Use inventory stats with date range
//   import { getInventoryStats } from '@/lib/actions/inventory.analytics';
//   const result = await getInventoryStats();
//
// GET INVENTORY VALUATION
// -----------------------
// Before:
//   const valuation = await inventoryApi.analytics.getInventoryValuation();
//
// After:
//   import { getInventoryStats } from '@/lib/actions/inventory.analytics';
//   const result = await getInventoryStats();
//   const totalValue = result.data?.totalValue;
//
// COST ANALYSIS
// -------------
// Before:
//   const costs = await inventoryApi.analytics.getCostAnalysis({
//     period: 'monthly'
//   });
//
// After:
//   // Use stats or custom analytics
//   import { getInventoryStats } from '@/lib/actions/inventory.analytics';
//
// ==========================================
// SUPPLIER OPERATIONS MIGRATION
// ==========================================
//
// GET SUPPLIERS
// -------------
// Before:
//   const suppliers = await inventoryApi.suppliers.getSuppliers();
//
// After:
//   // Suppliers moved to separate vendors module
//   import { getVendors } from '@/lib/actions/vendors.crud';
//   const result = await getVendors();
//
// CREATE SUPPLIER
// ---------------
// Before:
//   await inventoryApi.suppliers.createSupplier({
//     name: 'Medical Supplies Co.',
//     contactEmail: 'contact@medsupply.com'
//   });
//
// After:
//   import { createVendor } from '@/lib/actions/vendors.crud';
//   const result = await createVendor({
//     name: 'Medical Supplies Co.',
//     contactEmail: 'contact@medsupply.com'
//   });
//
// ==========================================
// PURCHASE ORDER OPERATIONS MIGRATION
// ==========================================
//
// GET PURCHASE ORDERS
// -------------------
// Before:
//   const orders = await inventoryApi.suppliers.getPurchaseOrders({
//     status: 'PENDING'
//   });
//
// After:
//   import { getPurchaseOrders } from '@/lib/actions/purchase-orders.crud';
//   const result = await getPurchaseOrders({ status: 'PENDING' });
//
// CREATE PURCHASE ORDER
// ---------------------
// Before:
//   await inventoryApi.suppliers.createPurchaseOrder({
//     supplierId: 'supplier-id',
//     items: [
//       { inventoryItemId: 'item-id', quantity: 100, unitPrice: 5.99 }
//     ]
//   });
//
// After:
//   import { createPurchaseOrder } from '@/lib/actions/purchase-orders.crud';
//   const result = await createPurchaseOrder({
//     vendorId: 'vendor-id',
//     items: [
//       { inventoryItemId: 'item-id', quantity: 100, unitPrice: 5.99 }
//     ]
//   });
//
// UPDATE PURCHASE ORDER STATUS
// ----------------------------
// Before:
//   await inventoryApi.suppliers.updatePurchaseOrderStatus('po-id', 'APPROVED');
//
// After:
//   import { updatePurchaseOrderStatus } from '@/lib/actions/purchase-orders.status';
//   const result = await updatePurchaseOrderStatus('po-id', 'APPROVED');
//
// ==========================================
// CONTROLLED SUBSTANCES MIGRATION
// ==========================================
//
// HIPAA/DEA Compliance for Controlled Substances
// -----------------------------------------------
// Before:
//   const item = await inventoryApi.inventory.createInventoryItem({
//     name: 'Medication X',
//     isControlledSubstance: true,
//     controlledSubstanceSchedule: 'II'
//   });
//
// After:
//   // Automatic audit logging for controlled substances
//   import { createInventoryItemAction } from '@/lib/actions/inventory.items';
//   // FormData with isControlledSubstance='true'
//   // Audit log created automatically in action
//
// ==========================================
// BULK OPERATIONS MIGRATION
// ==========================================
//
// BULK IMPORT
// -----------
// Before:
//   await inventoryApi.analytics.bulkImportItems(itemsData);
//
// After:
//   // Use individual create operations or implement custom bulk action
//   import { createInventoryItemAction } from '@/lib/actions/inventory.items';
//   for (const item of itemsData) {
//     await createInventoryItemAction({}, createFormData(item));
//   }
//
// EXPORT INVENTORY
// ----------------
// Before:
//   const exportData = await inventoryApi.analytics.exportInventory({
//     format: 'csv'
//   });
//
// After:
//   // Implement custom export using getInventoryItemsAction
//   import { getInventoryItemsAction } from '@/lib/actions/inventory.items';
//   const result = await getInventoryItemsAction();
//   // Convert to CSV/Excel format
//
// ==========================================
// ERROR HANDLING CHANGES
// ==========================================
//
// Before (throws exceptions):
//   try {
//     const item = await inventoryApi.inventory.getInventoryItem('id');
//   } catch (error) {
//     console.error(error);
//   }
//
// After (returns result object):
//   import { getInventoryItemAction } from '@/lib/actions/inventory.items';
//   const result = await getInventoryItemAction('id');
//   if (!result.success) {
//     console.error(result.error);
//   } else {
//     const item = result.data;
//   }
//
// ==========================================
// TYPE IMPORTS MIGRATION
// ==========================================
//
// Before:
//   import type { InventoryItem } from '@/services/modules/inventoryApi';
//
// After:
//   import type { InventoryItem } from '@/types/domain/inventory.types';
//   import type { ActionResult } from '@/lib/actions/inventory.types';
//
// ==========================================
// FORM INTEGRATION EXAMPLE
// ==========================================
//
// Client Component with Form Action:
//   'use client';
//   import { useActionState } from 'react';
//   import { createInventoryItemAction } from '@/lib/actions/inventory.items';
//
//   export function CreateInventoryForm() {
//     const [state, formAction, isPending] = useActionState(
//       createInventoryItemAction,
//       { success: false }
//     );
//
//     return (
//       <form action={formAction}>
//         <input name="name" required />
//         <select name="category" required>
//           <option value="MEDICAL_SUPPLIES">Medical Supplies</option>
//           <option value="MEDICATIONS">Medications</option>
//         </select>
//         <input name="unitOfMeasure" required />
//         <input name="unitCost" type="number" step="0.01" />
//         <input name="minStockLevel" type="number" />
//         <label>
//           <input name="isControlledSubstance" type="checkbox" />
//           Controlled Substance
//         </label>
//         <button type="submit" disabled={isPending}>
//           {isPending ? 'Creating...' : 'Create Item'}
//         </button>
//         {state.error && <div className="error">{state.error}</div>}
//       </form>
//     );
//   }
//
// ==========================================
// MIGRATION CHECKLIST
// ==========================================
// [ ] Update inventory item CRUD operations to new actions
// [ ] Migrate stock management to stock/batch actions
// [ ] Move supplier operations to vendors module
// [ ] Update purchase order integration
// [ ] Replace analytics calls with new analytics actions
// [ ] Update location management to new locations actions
// [ ] Convert bulk operations to individual or batch actions
// [ ] Update error handling from try/catch to result checking
// [ ] Update form integrations to use useActionState
// [ ] Update type imports to use @/types/domain
// [ ] Test controlled substance audit logging
// [ ] Verify multi-location inventory tracking
// [ ] Update unit tests to mock server actions
// [ ] Remove old service imports after migration
//
// ==========================================
// BREAKING CHANGES SUMMARY
// ==========================================
// 1. Methods return ActionResult<T> instead of throwing
// 2. Form-based APIs use FormData instead of objects
// 3. Supplier operations moved to vendors module
// 4. Stock adjustments use new transaction pattern
// 5. Batch/expiration tracking separated into batches module
// 6. Location management explicit in new API
// 7. Analytics consolidated into stats/dashboard endpoints
// 8. Automatic cache invalidation (no manual clearing)
//
// ==========================================
// SUPPORT & QUESTIONS
// ==========================================
// For migration assistance, see:
// - /src/services/modules/DEPRECATED.md
// - /src/lib/actions/inventory.actions.ts
// - /src/lib/actions/inventory.items.ts
// - /src/lib/actions/inventory.stock.ts
// - Team migration channel: #api-migration-support
//
// Deprecation Timeline:
// - v1.5.0 (Nov 2025): Deprecation warnings added
// - v1.8.0 (Mar 2026): Warning level increased
// - v2.0.0 (Jun 2026): Complete removal
