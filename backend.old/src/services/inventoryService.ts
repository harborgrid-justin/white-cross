/**
 * @fileoverview Inventory Management Service Orchestrator
 * @module services/inventory
 * @description Main orchestrator for comprehensive school health inventory management system
 *
 * This service provides a unified API for all inventory operations, delegating to specialized
 * services for stock management, purchase orders, vendor management, maintenance scheduling,
 * and analytics reporting.
 *
 * Key Features:
 * - Stock level tracking and reorder point management
 * - Purchase order creation and workflow management
 * - Vendor management and performance tracking
 * - Equipment maintenance scheduling
 * - Expiration date monitoring and alerts
 * - Comprehensive analytics and reporting
 * - Audit trail for all inventory transactions
 *
 * @business Reorder alerts when quantity <= reorderLevel
 * @business Critical medical supplies (EpiPens, insulin, AEDs) require higher reorder levels
 * @business 30-day expiration warnings for medications and supplies
 * @business Annual equipment maintenance requirements
 *
 * @requires ./inventory/inventoryRepository
 * @requires ./inventory/stockService
 * @requires ./inventory/transactionService
 * @requires ./inventory/alertsService
 * @requires ./inventory/maintenanceService
 * @requires ./inventory/purchaseOrderService
 * @requires ./inventory/vendorService
 * @requires ./inventory/analyticsService
 *
 * LOC: 333D84BEB6
 * WC-SVC-INV-019 | inventoryService.ts - Inventory Management Service Orchestrator
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - enums.ts (database/types/enums.ts)
 *   - inventoryRepository.ts (services/inventory/inventoryRepository.ts)
 *   - stockService.ts (services/inventory/stockService.ts)
 *   - transactionService.ts (services/inventory/transactionService.ts)
 *   - ... and 6 more
 *
 * DOWNSTREAM (imported by):
 *   - inventory.ts (routes/inventory.ts)
 */

/**
 * WC-SVC-INV-019 | inventoryService.ts - Inventory Management Service Orchestrator
 * Purpose: Comprehensive inventory system with stock tracking, purchase orders, vendor management, maintenance scheduling, and analytics
 * Upstream: ./inventory/* modules, ../database/types/enums | Dependencies: Modular inventory services, stock operations
 * Downstream: routes/inventory.ts, purchaseOrderService, maintenanceService, dashboardService | Called by: Inventory routes, asset tracking
 * Related: medicationService, vendorService, purchaseOrderService, auditService, alertsService
 * Exports: InventoryService orchestrator, inventory types | Key Services: Stock management, purchase orders, maintenance, analytics
 * Last Updated: 2025-10-18 | File Type: .ts | HIPAA: No PHI - handles medical supplies and equipment inventory only
 * Critical Path: Stock operation → Validation → Transaction logging → Alert generation → Audit trail
 * LLM Context: Main orchestrator for school health inventory management - delegates to specialized modules in ./inventory/
 */

import { logger } from '../utils/logger';
import { PurchaseOrderStatus } from '../database/types/enums';

// Import all specialized services
import { InventoryRepository } from './inventory/inventoryRepository';
import { StockService } from './inventory/stockService';
import { TransactionService } from './inventory/transactionService';
import { AlertsService } from './inventory/alertsService';
import { MaintenanceService } from './inventory/maintenanceService';
import { PurchaseOrderService } from './inventory/purchaseOrderService';
import { VendorService } from './inventory/vendorService';
import { AnalyticsService } from './inventory/analyticsService';
import { InventoryQueriesService } from './inventory/inventoryQueriesService';

// Import types from the specialized modules
import type {
  CreateInventoryItemData,
  UpdateInventoryItemData,
  CreateInventoryTransactionData,
  CreateMaintenanceLogData,
  CreateVendorData,
  CreatePurchaseOrderData,
  InventoryFilters,
  InventoryAlert
} from './inventory/types';

/**
 * Main Inventory Service - Orchestrates all inventory-related operations
 *
 * This service acts as the main entry point for all inventory functionality,
 * delegating to specialized services while maintaining the original API interface.
 *
 * @class InventoryService
 * @static
 */
export class InventoryService {
  // ========================================
  // INVENTORY ITEMS CRUD OPERATIONS
  // ========================================

  /**
   * Get inventory items with pagination and filters
   *
   * @method getInventoryItems
   * @static
   * @async
   * @param {number} [page=1] - Page number (1-indexed)
   * @param {number} [limit=20] - Items per page
   * @param {InventoryFilters} [filters={}] - Optional filters (category, location, status, etc.)
   * @returns {Promise<Object>} Paginated inventory items with stock levels
   * @returns {Promise<Object.items>} Array of inventory items
   * @returns {Promise<Object.pagination>} Pagination metadata
   *
   * @business Returns items with current stock levels calculated from transactions
   * @business Inactive items excluded by default unless explicitly requested
   *
   * @example
   * const result = await InventoryService.getInventoryItems(1, 20, { category: 'MEDICATION' });
   * // Returns: { items: [...], pagination: { page: 1, limit: 20, total: 45, pages: 3 } }
   */
  static async getInventoryItems(
    page: number = 1,
    limit: number = 20,
    filters: InventoryFilters = {}
  ) {
    try {
      return await InventoryQueriesService.getInventoryItems(page, limit, filters);
    } catch (error) {
      logger.error('Error in InventoryService.getInventoryItems:', error);
      throw error;
    }
  }

  /**
   * Get single inventory item by ID with current stock and associations
   */
  static async getInventoryItem(id: string) {
    try {
      return await InventoryQueriesService.getInventoryItemDetails(id);
    } catch (error) {
      logger.error('Error in InventoryService.getInventoryItem:', error);
      throw error;
    }
  }

  /**
   * Create new inventory item
   */
  static async createInventoryItem(data: CreateInventoryItemData) {
    try {
      return await InventoryRepository.createInventoryItem(data);
    } catch (error) {
      logger.error('Error in InventoryService.createInventoryItem:', error);
      throw error;
    }
  }

  /**
   * Update inventory item
   */
  static async updateInventoryItem(id: string, data: UpdateInventoryItemData) {
    try {
      return await InventoryRepository.updateInventoryItem(id, data);
    } catch (error) {
      logger.error('Error in InventoryService.updateInventoryItem:', error);
      throw error;
    }
  }

  /**
   * Delete inventory item (soft delete)
   */
  static async deleteInventoryItem(id: string) {
    try {
      return await InventoryRepository.deleteInventoryItem(id);
    } catch (error) {
      logger.error('Error in InventoryService.deleteInventoryItem:', error);
      throw error;
    }
  }

  /**
   * Search inventory items
   */
  static async searchInventoryItems(query: string, limit: number = 20) {
    try {
      return await InventoryQueriesService.searchInventoryItems(query, limit);
    } catch (error) {
      logger.error('Error in InventoryService.searchInventoryItems:', error);
      throw error;
    }
  }

  // ========================================
  // STOCK MANAGEMENT OPERATIONS
  // ========================================

  /**
   * Get current stock level for an item
   */
  static async getCurrentStock(inventoryItemId: string): Promise<number> {
    try {
      return await StockService.getCurrentStock(inventoryItemId);
    } catch (error) {
      logger.error('Error in InventoryService.getCurrentStock:', error);
      throw error;
    }
  }

  /**
   * Adjust stock with audit trail and transaction support
   */
  static async adjustStock(
    id: string,
    quantity: number,
    reason: string,
    performedBy: string
  ) {
    try {
      return await StockService.adjustStock(id, quantity, reason, performedBy);
    } catch (error) {
      logger.error('Error in InventoryService.adjustStock:', error);
      throw error;
    }
  }

  /**
   * Get stock history for an item
   */
  static async getStockHistory(
    inventoryItemId: string,
    page: number = 1,
    limit: number = 50
  ) {
    try {
      return await StockService.getStockHistory(inventoryItemId, page, limit);
    } catch (error) {
      logger.error('Error in InventoryService.getStockHistory:', error);
      throw error;
    }
  }

  // ========================================
  // TRANSACTION OPERATIONS
  // ========================================

  /**
   * Create inventory transaction with comprehensive validation
   */
  static async createInventoryTransaction(data: CreateInventoryTransactionData) {
    try {
      return await TransactionService.createInventoryTransaction(data);
    } catch (error) {
      logger.error('Error in InventoryService.createInventoryTransaction:', error);
      throw error;
    }
  }

  // ========================================
  // ALERTS AND MONITORING
  // ========================================

  /**
   * Get inventory alerts
   */
  static async getInventoryAlerts(): Promise<InventoryAlert[]> {
    try {
      return await AlertsService.getInventoryAlerts();
    } catch (error) {
      logger.error('Error in InventoryService.getInventoryAlerts:', error);
      throw error;
    }
  }

  // ========================================
  // MAINTENANCE OPERATIONS
  // ========================================

  /**
   * Create maintenance log
   */
  static async createMaintenanceLog(data: CreateMaintenanceLogData) {
    try {
      return await MaintenanceService.createMaintenanceLog(data);
    } catch (error) {
      logger.error('Error in InventoryService.createMaintenanceLog:', error);
      throw error;
    }
  }

  /**
   * Get maintenance schedule
   */
  static async getMaintenanceSchedule(startDate: Date, endDate: Date) {
    try {
      return await MaintenanceService.getMaintenanceSchedule(startDate, endDate);
    } catch (error) {
      logger.error('Error in InventoryService.getMaintenanceSchedule:', error);
      throw error;
    }
  }

  // ========================================
  // PURCHASE ORDER OPERATIONS
  // ========================================

  /**
   * Create purchase order with comprehensive validation
   */
  static async createPurchaseOrder(data: CreatePurchaseOrderData) {
    try {
      return await PurchaseOrderService.createPurchaseOrder(data);
    } catch (error) {
      logger.error('Error in InventoryService.createPurchaseOrder:', error);
      throw error;
    }
  }

  /**
   * Generate purchase order for low stock items
   */
  static async generatePurchaseOrder(items: Array<{ inventoryItemId: string; quantity: number }>) {
    try {
      return await PurchaseOrderService.generatePurchaseOrder(items);
    } catch (error) {
      logger.error('Error in InventoryService.generatePurchaseOrder:', error);
      throw error;
    }
  }

  /**
   * Get purchase orders
   */
  static async getPurchaseOrders(status?: PurchaseOrderStatus, vendorId?: string) {
    try {
      return await PurchaseOrderService.getPurchaseOrders(status, vendorId);
    } catch (error) {
      logger.error('Error in InventoryService.getPurchaseOrders:', error);
      throw error;
    }
  }

  /**
   * Update purchase order status with workflow validation
   */
  static async updatePurchaseOrderStatus(id: string, status: PurchaseOrderStatus, receivedDate?: Date) {
    try {
      return await PurchaseOrderService.updatePurchaseOrderStatus(id, status, receivedDate);
    } catch (error) {
      logger.error('Error in InventoryService.updatePurchaseOrderStatus:', error);
      throw error;
    }
  }

  // ========================================
  // VENDOR OPERATIONS
  // ========================================

  /**
   * Create vendor
   */
  static async createVendor(data: CreateVendorData) {
    try {
      return await VendorService.createVendor(data);
    } catch (error) {
      logger.error('Error in InventoryService.createVendor:', error);
      throw error;
    }
  }

  /**
   * Get all vendors
   */
  static async getVendors(isActive?: boolean) {
    try {
      return await VendorService.getVendors(isActive);
    } catch (error) {
      logger.error('Error in InventoryService.getVendors:', error);
      throw error;
    }
  }

  /**
   * Update vendor
   */
  static async updateVendor(id: string, data: Partial<CreateVendorData>) {
    try {
      return await VendorService.updateVendor(id, data);
    } catch (error) {
      logger.error('Error in InventoryService.updateVendor:', error);
      throw error;
    }
  }

  // ========================================
  // ANALYTICS AND REPORTING
  // ========================================

  /**
   * Get inventory valuation
   */
  static async getInventoryValuation() {
    try {
      return await AnalyticsService.getInventoryValuation();
    } catch (error) {
      logger.error('Error in InventoryService.getInventoryValuation:', error);
      throw error;
    }
  }

  /**
   * Get usage analytics
   */
  static async getUsageAnalytics(startDate: Date, endDate: Date) {
    try {
      return await AnalyticsService.getUsageAnalytics(startDate, endDate);
    } catch (error) {
      logger.error('Error in InventoryService.getUsageAnalytics:', error);
      throw error;
    }
  }

  /**
   * Get supplier performance
   */
  static async getSupplierPerformance() {
    try {
      return await AnalyticsService.getSupplierPerformance();
    } catch (error) {
      logger.error('Error in InventoryService.getSupplierPerformance:', error);
      throw error;
    }
  }

  /**
   * Get inventory statistics
   */
  static async getInventoryStats() {
    try {
      return await AnalyticsService.getInventoryStats();
    } catch (error) {
      logger.error('Error in InventoryService.getInventoryStats:', error);
      throw error;
    }
  }

  // ========================================
  // CONVENIENCE METHODS & LEGACY SUPPORT
  // ========================================

  /**
   * Get recent activity (private method made public for backward compatibility)
   */
  static async getRecentActivity() {
    try {
      return await TransactionService.getRecentTransactions(10);
    } catch (error) {
      logger.error('Error in InventoryService.getRecentActivity:', error);
      throw error;
    }
  }

  /**
   * Get top used items (private method made public for backward compatibility)
   */
  static async getTopUsedItems() {
    try {
      return await AnalyticsService.getTopUsedItems(10);
    } catch (error) {
      logger.error('Error in InventoryService.getTopUsedItems:', error);
      throw error;
    }
  }
}

// Export all types for backward compatibility
export type {
  CreateInventoryItemData,
  UpdateInventoryItemData,
  CreateInventoryTransactionData,
  CreateMaintenanceLogData,
  CreateVendorData,
  CreatePurchaseOrderData,
  InventoryFilters,
  InventoryAlert
};

// Log service initialization
logger.info('InventoryService orchestrator initialized with modular architecture');
