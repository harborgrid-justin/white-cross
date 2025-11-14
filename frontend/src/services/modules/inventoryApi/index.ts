/**
 * Inventory Management API - Unified Interface
 *
 * Complete inventory management solution with modular architecture.
 * Provides unified access to all inventory operations including items, stock,
 * suppliers, purchase orders, analytics, and maintenance.
 *
 * @module services/modules/inventoryApi
 */

import { apiClient } from '../../core/ApiClient';
import type { ApiClient } from '../../core/ApiClient';

// Import individual API classes
import { InventoryItemsApi } from './inventory';
import { StockManagementApi } from './stock';
import { SuppliersApi } from './suppliers';
import { AnalyticsApi } from './analytics';

// Re-export all types for convenience
export type * from './types';
export type * from './validation';

// Re-export individual API classes
export { InventoryItemsApi } from './inventory';
export { StockManagementApi } from './stock';
export { SuppliersApi } from './suppliers';
export { AnalyticsApi } from './analytics';

/**
 * Unified Inventory Management API
 * 
 * Combines all inventory-related operations into a single interface
 * while maintaining separation of concerns through modular architecture.
 */
export class InventoryApi {
  public readonly inventory: InventoryItemsApi;
  public readonly stock: StockManagementApi;
  public readonly suppliers: SuppliersApi;
  public readonly analytics: AnalyticsApi;

  constructor(client: ApiClient) {
    this.inventory = new InventoryItemsApi(client);
    this.stock = new StockManagementApi(client);
    this.suppliers = new SuppliersApi(client);
    this.analytics = new AnalyticsApi(client);
  }

  // ==========================================
  // LEGACY COMPATIBILITY LAYER
  // ==========================================
  // These methods provide backward compatibility with the original API
  // by delegating to the appropriate modular services

  // Inventory Items (delegate to inventory module)
  getInventoryItems(...args: Parameters<InventoryItemsApi['getInventoryItems']>) {
    return this.inventory.getInventoryItems(...args);
  }

  getInventoryItem(...args: Parameters<InventoryItemsApi['getInventoryItem']>) {
    return this.inventory.getInventoryItem(...args);
  }

  createInventoryItem(...args: Parameters<InventoryItemsApi['createInventoryItem']>) {
    return this.inventory.createInventoryItem(...args);
  }

  updateInventoryItem(...args: Parameters<InventoryItemsApi['updateInventoryItem']>) {
    return this.inventory.updateInventoryItem(...args);
  }

  deleteInventoryItem(...args: Parameters<InventoryItemsApi['deleteInventoryItem']>) {
    return this.inventory.deleteInventoryItem(...args);
  }

  searchInventoryItems(...args: Parameters<InventoryItemsApi['searchInventoryItems']>) {
    return this.inventory.searchInventoryItems(...args);
  }

  // Stock Management (delegate to stock module)
  getCurrentStock(...args: Parameters<StockManagementApi['getCurrentStock']>) {
    return this.stock.getCurrentStock(...args);
  }

  adjustStock(...args: Parameters<StockManagementApi['adjustStock']>) {
    return this.stock.adjustStock(...args);
  }

  transferStock(...args: Parameters<StockManagementApi['transferStock']>) {
    return this.stock.transferStock(...args);
  }

  getStockTransfers(...args: Parameters<StockManagementApi['getStockTransfers']>) {
    return this.stock.getStockTransfers(...args);
  }

  approveStockTransfer(...args: Parameters<StockManagementApi['approveStockTransfer']>) {
    return this.stock.approveStockTransfer(...args);
  }

  completeStockTransfer(...args: Parameters<StockManagementApi['completeStockTransfer']>) {
    return this.stock.completeStockTransfer(...args);
  }

  getLowStockItems(...args: Parameters<StockManagementApi['getLowStockItems']>) {
    return this.stock.getLowStockItems(...args);
  }

  getExpiringItems(...args: Parameters<StockManagementApi['getExpiringItems']>) {
    return this.stock.getExpiringItems(...args);
  }

  getStockHistory(...args: Parameters<StockManagementApi['getStockHistory']>) {
    return this.stock.getStockHistory(...args);
  }

  createTransaction(...args: Parameters<StockManagementApi['createTransaction']>) {
    return this.stock.createTransaction(...args);
  }

  getTransactions(...args: Parameters<StockManagementApi['getTransactions']>) {
    return this.stock.getTransactions(...args);
  }

  // Suppliers (delegate to suppliers module)
  getSuppliers(...args: Parameters<SuppliersApi['getSuppliers']>) {
    return this.suppliers.getSuppliers(...args);
  }

  getSupplier(...args: Parameters<SuppliersApi['getSupplier']>) {
    return this.suppliers.getSupplier(...args);
  }

  createSupplier(...args: Parameters<SuppliersApi['createSupplier']>) {
    return this.suppliers.createSupplier(...args);
  }

  updateSupplier(...args: Parameters<SuppliersApi['updateSupplier']>) {
    return this.suppliers.updateSupplier(...args);
  }

  deleteSupplier(...args: Parameters<SuppliersApi['deleteSupplier']>) {
    return this.suppliers.deleteSupplier(...args);
  }

  getSupplierPerformance(...args: Parameters<SuppliersApi['getSupplierPerformance']>) {
    return this.suppliers.getSupplierPerformance(...args);
  }

  // Purchase Orders (delegate to suppliers module)
  getPurchaseOrders(...args: Parameters<SuppliersApi['getPurchaseOrders']>) {
    return this.suppliers.getPurchaseOrders(...args);
  }

  getPurchaseOrder(...args: Parameters<SuppliersApi['getPurchaseOrder']>) {
    return this.suppliers.getPurchaseOrder(...args);
  }

  createPurchaseOrder(...args: Parameters<SuppliersApi['createPurchaseOrder']>) {
    return this.suppliers.createPurchaseOrder(...args);
  }

  updatePurchaseOrderStatus(...args: Parameters<SuppliersApi['updatePurchaseOrderStatus']>) {
    return this.suppliers.updatePurchaseOrderStatus(...args);
  }

  generatePurchaseOrder(...args: Parameters<SuppliersApi['generatePurchaseOrder']>) {
    return this.suppliers.generatePurchaseOrder(...args);
  }

  // Analytics & Reporting (delegate to analytics module)
  getInventoryValuation(...args: Parameters<AnalyticsApi['getInventoryValuation']>) {
    return this.analytics.getInventoryValuation(...args);
  }

  getUsageAnalytics(...args: Parameters<AnalyticsApi['getUsageAnalytics']>) {
    return this.analytics.getUsageAnalytics(...args);
  }

  getCostAnalysis(...args: Parameters<AnalyticsApi['getCostAnalysis']>) {
    return this.analytics.getCostAnalysis(...args);
  }

  getInventoryStats(...args: Parameters<AnalyticsApi['getInventoryStats']>) {
    return this.analytics.getInventoryStats(...args);
  }

  // Maintenance (delegate to analytics module)
  createMaintenanceLog(...args: Parameters<AnalyticsApi['createMaintenanceLog']>) {
    return this.analytics.createMaintenanceLog(...args);
  }

  getMaintenanceSchedule(...args: Parameters<AnalyticsApi['getMaintenanceSchedule']>) {
    return this.analytics.getMaintenanceSchedule(...args);
  }

  // Alerts (delegate to analytics module)
  getInventoryAlerts(...args: Parameters<AnalyticsApi['getInventoryAlerts']>) {
    return this.analytics.getInventoryAlerts(...args);
  }

  acknowledgeAlert(...args: Parameters<AnalyticsApi['acknowledgeAlert']>) {
    return this.analytics.acknowledgeAlert(...args);
  }

  // Bulk Operations (delegate to analytics module)
  bulkImportItems(...args: Parameters<AnalyticsApi['bulkImportItems']>) {
    return this.analytics.bulkImportItems(...args);
  }

  exportInventory(...args: Parameters<AnalyticsApi['exportInventory']>) {
    return this.analytics.exportInventory(...args);
  }
}

/**
 * Factory function to create InventoryApi instance
 */
export function createInventoryApi(client: ApiClient): InventoryApi {
  return new InventoryApi(client);
}

/**
 * Singleton instance of InventoryApi
 * Pre-configured with the default apiClient
 */
export const inventoryApi = createInventoryApi(apiClient);

// Default export for convenience
export default inventoryApi;
