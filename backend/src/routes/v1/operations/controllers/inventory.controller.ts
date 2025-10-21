/**
 * Inventory Controller
 * Business logic for inventory management, stock control, and purchase orders
 */

import { ResponseToolkit } from '@hapi/hapi';
import { ItemOperations } from '../../../../services/inventory/itemOperations';
import { StockService } from '../../../../services/inventory/stockService';
import { OrderOperations } from '../../../../services/inventory/orderOperations';
import { SupplierOperations } from '../../../../services/inventory/supplierOperations';
import { AnalyticsService } from '../../../../services/inventory/analyticsService';
import { AuthenticatedRequest } from '../../../shared/types/route.types';
import {
  successResponse,
  createdResponse,
  paginatedResponse
} from '../../../shared/utils';
import { parsePagination, buildPaginationMeta } from '../../../shared/utils';

export class InventoryController {
  /**
   * Get all inventory items with pagination and filters
   */
  static async listItems(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { page, limit } = parsePagination(request.query);
    const filters: any = {};

    if (request.query.category) filters.category = request.query.category;
    if (request.query.supplier) filters.supplier = request.query.supplier;
    if (request.query.location) filters.location = request.query.location;
    if (request.query.lowStock !== undefined) filters.lowStock = request.query.lowStock === 'true' || request.query.lowStock === true;
    if (request.query.isActive !== undefined) filters.isActive = request.query.isActive === 'true' || request.query.isActive === true;

    const result = await ItemOperations.getInventoryItems(page, limit, filters);

    return paginatedResponse(
      h,
      result.items,
      buildPaginationMeta(page, limit, result.pagination.total)
    );
  }

  /**
   * Get single inventory item by ID
   */
  static async getItem(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const item = await ItemOperations.getInventoryItem(id);

    // Get current stock level
    const currentStock = await StockService.getCurrentStock(id);

    return successResponse(h, {
      item: {
        ...item.toJSON(),
        currentStock
      }
    });
  }

  /**
   * Create new inventory item
   */
  static async createItem(request: AuthenticatedRequest, h: ResponseToolkit) {
    const item = await ItemOperations.createInventoryItem(request.payload);
    return createdResponse(h, { item });
  }

  /**
   * Update inventory item
   */
  static async updateItem(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const item = await ItemOperations.updateInventoryItem(id, request.payload);
    return successResponse(h, { item });
  }

  /**
   * Delete inventory item (soft delete)
   */
  static async deleteItem(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const item = await ItemOperations.deleteInventoryItem(id);
    return successResponse(h, {
      item,
      message: 'Inventory item archived successfully'
    });
  }

  /**
   * Get current stock levels across all items or specific item
   */
  static async getStockLevels(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { page, limit } = parsePagination(request.query);
    const filters: any = { isActive: true };

    const result = await ItemOperations.getInventoryItems(page, limit, filters);

    return paginatedResponse(
      h,
      result.items,
      buildPaginationMeta(page, limit, result.pagination.total)
    );
  }

  /**
   * Adjust stock levels (add/remove inventory)
   */
  static async adjustStock(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const { quantity, reason } = request.payload;
    const performedBy = request.auth.credentials.userId;

    const result = await StockService.adjustStock(id, quantity, reason, performedBy);

    return successResponse(h, {
      transaction: result.transaction,
      previousStock: result.previousStock,
      newStock: result.newStock,
      adjustment: result.adjustment
    });
  }

  /**
   * Get low stock alerts
   */
  static async getLowStockAlerts(request: AuthenticatedRequest, h: ResponseToolkit) {
    const lowStockItems = await StockService.getLowStockItems();
    const outOfStockItems = await StockService.getOutOfStockItems();

    return successResponse(h, {
      alerts: {
        lowStock: lowStockItems,
        outOfStock: outOfStockItems,
        totalAlerts: lowStockItems.length + outOfStockItems.length
      }
    });
  }

  /**
   * Record physical stock count
   */
  static async recordStockCount(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const { countedQuantity, notes } = request.payload;
    const performedBy = request.auth.credentials.userId;

    // Get current stock
    const currentStock = await StockService.getCurrentStock(id);

    // Calculate adjustment needed
    const adjustment = countedQuantity - currentStock;

    if (adjustment !== 0) {
      const result = await StockService.adjustStock(
        id,
        adjustment,
        `Physical stock count - ${notes || 'Regular inventory count'}`,
        performedBy
      );

      return successResponse(h, {
        message: 'Stock count recorded and adjusted',
        previousStock: currentStock,
        countedQuantity,
        adjustment,
        newStock: result.newStock
      });
    }

    return successResponse(h, {
      message: 'Stock count recorded - no adjustment needed',
      countedQuantity,
      currentStock
    });
  }

  /**
   * Get stock history for an item
   */
  static async getStockHistory(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const { page, limit } = parsePagination(request.query);

    const result = await StockService.getStockHistory(id, page, limit);

    return paginatedResponse(
      h,
      result.history,
      buildPaginationMeta(page, limit, result.pagination.total)
    );
  }

  /**
   * Get all purchase orders with filters
   */
  static async listPurchaseOrders(request: AuthenticatedRequest, h: ResponseToolkit) {
    const status = request.query.status as any;
    const vendorId = request.query.vendorId as string | undefined;

    const orders = await OrderOperations.getPurchaseOrders(status, vendorId);

    return successResponse(h, { orders });
  }

  /**
   * Create new purchase order
   */
  static async createPurchaseOrder(request: AuthenticatedRequest, h: ResponseToolkit) {
    const order = await OrderOperations.createPurchaseOrder({
      ...request.payload,
      orderDate: new Date(request.payload.orderDate),
      expectedDate: request.payload.expectedDate ? new Date(request.payload.expectedDate) : undefined
    });

    return createdResponse(h, { order });
  }

  /**
   * Receive purchase order (update stock)
   */
  static async receivePurchaseOrder(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const { status, receivedDate } = request.payload;

    const order = await OrderOperations.updatePurchaseOrderStatus(
      id,
      status,
      receivedDate ? new Date(receivedDate) : undefined
    );

    return successResponse(h, {
      order,
      message: `Purchase order ${status.toLowerCase()} successfully`
    });
  }

  /**
   * Get all suppliers/vendors
   */
  static async listSuppliers(request: AuthenticatedRequest, h: ResponseToolkit) {
    const isActive = request.query.isActive !== undefined
      ? request.query.isActive === 'true' || request.query.isActive === true
      : undefined;

    const suppliers = await SupplierOperations.getVendors(isActive);

    return successResponse(h, { suppliers });
  }

  /**
   * Create new supplier
   */
  static async createSupplier(request: AuthenticatedRequest, h: ResponseToolkit) {
    const supplier = await SupplierOperations.createVendor(request.payload);
    return createdResponse(h, { supplier });
  }

  /**
   * Update supplier
   */
  static async updateSupplier(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const supplier = await SupplierOperations.updateVendor(id, request.payload);
    return successResponse(h, { supplier });
  }

  /**
   * Get inventory analytics
   */
  static async getAnalytics(request: AuthenticatedRequest, h: ResponseToolkit) {
    const stats = await AnalyticsService.getInventoryStats();
    const valuation = await AnalyticsService.getInventoryValuation();
    const topUsedItems = await AnalyticsService.getTopUsedItems(30);

    return successResponse(h, {
      statistics: stats,
      valuation,
      topUsedItems
    });
  }

  /**
   * Get usage report
   */
  static async getUsageReport(request: AuthenticatedRequest, h: ResponseToolkit) {
    const startDate = request.query.startDate
      ? new Date(request.query.startDate as string)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: 30 days ago

    const endDate = request.query.endDate
      ? new Date(request.query.endDate as string)
      : new Date(); // Default: now

    const usageAnalytics = await AnalyticsService.getUsageAnalytics(startDate, endDate);
    const turnover = await AnalyticsService.getInventoryTurnover(startDate, endDate);

    return successResponse(h, {
      period: {
        startDate,
        endDate,
        days: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      },
      usage: usageAnalytics,
      turnover: turnover.slice(0, 10) // Top 10 turnover items
    });
  }

  /**
   * Get supplier performance analytics
   */
  static async getSupplierPerformance(request: AuthenticatedRequest, h: ResponseToolkit) {
    const performance = await AnalyticsService.getSupplierPerformance();
    return successResponse(h, { performance });
  }
}
