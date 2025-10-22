/**
 * @fileoverview Stock Management Service
 * @module services/inventory/stock
 * @description Real-time stock level tracking with reorder point monitoring and audit trails
 *
 * This service provides comprehensive stock management functionality including real-time
 * inventory tracking, stock adjustments with full audit trails, reorder point monitoring,
 * and stock level analytics for school health supplies.
 *
 * Key Features:
 * - Real-time stock level calculation from transaction history
 * - Stock adjustment tracking with reason codes
 * - Low stock and out-of-stock detection
 * - Reorder point management and alerts
 * - Complete stock history with running totals
 * - User attribution for all stock changes
 * - Transaction-based inventory accuracy
 *
 * @business Stock calculated from transaction ledger (sum of all transactions)
 * @business Low stock alert when currentStock <= reorderLevel
 * @business Out of stock when currentStock = 0
 * @business All adjustments require reason code for audit trail
 * @business Critical supplies (EpiPens, insulin) should have higher reorder levels
 *
 * @requires ../../database/models
 * @requires ../../database/types/enums
 *
 * LOC: F3CBE170EE
 * WC-GEN-282 | stockService.ts - Stock Management Service
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - index.ts (database/models/index.ts)
 *   - enums.ts (database/types/enums.ts)
 *   - types.ts (services/inventory/types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - inventoryQueriesService.ts (services/inventory/inventoryQueriesService.ts)
 *   - transactionService.ts (services/inventory/transactionService.ts)
 *   - inventoryService.ts (services/inventoryService.ts)
 *   - alertsService.ts (services/inventory/alertsService.ts)
 */

/**
 * WC-GEN-282 | stockService.ts - Stock Management Service with Reorder Logic
 * Purpose: Real-time inventory tracking with reorder point management and audit trails
 * Upstream: ../../utils/logger, ../../database/models, ../../database/types/enums | Dependencies: Transaction ledger, inventory items
 * Downstream: Alerts service, queries service, transaction service | Called by: Inventory operations, reorder workflows
 * Related: AlertsService, TransactionService, PurchaseOrderService
 * Exports: StockService class | Key Services: Stock calculations, adjustments, low stock detection
 * Last Updated: 2025-10-22 | File Type: .ts
 * Critical Path: Transaction creation → Stock calculation → Reorder check → Alert generation
 * LLM Context: School health inventory with automated reorder triggers and compliance tracking
 */

import { QueryTypes } from 'sequelize';
import { logger } from '../../utils/logger';
import { InventoryTransaction, InventoryItem, User, sequelize } from '../../database/models';
import { InventoryTransactionType } from '../../database/types/enums';
import { StockAdjustmentResult, StockHistoryResponse } from './types';

/**
 * Stock Management Service
 *
 * @class StockService
 * @static
 */
export class StockService {
  /**
   * Get current stock level for an item
   *
   * @method getCurrentStock
   * @static
   * @async
   * @param {string} inventoryItemId - Inventory item UUID
   * @returns {Promise<number>} Current stock quantity (sum of all transactions)
   *
   * @business Calculates stock as SUM(quantity) from all inventory_transactions
   * @business Positive quantities = stock in, negative = stock out
   * @business Returns 0 if no transactions exist for item
   *
   * @example
   * const currentStock = await StockService.getCurrentStock('item-uuid-123');
   * // Returns: 45 (units in stock)
   */
  static async getCurrentStock(inventoryItemId: string): Promise<number> {
    try {
      const result = await InventoryTransaction.findOne({
        where: { inventoryItemId },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity']
        ],
        raw: true
      }) as any;

      return Number(result?.totalQuantity) || 0;
    } catch (error) {
      logger.error('Error getting current stock:', error);
      throw error;
    }
  }

  /**
   * Adjust stock with audit trail and transaction support
   *
   * @method adjustStock
   * @static
   * @async
   * @param {string} id - Inventory item UUID
   * @param {number} quantity - Adjustment quantity (positive = add, negative = remove)
   * @param {string} reason - Reason code for adjustment (required for audit)
   * @param {string} performedBy - User UUID who performed adjustment
   * @returns {Promise<StockAdjustmentResult>} Adjustment result with before/after stock levels
   * @returns {Promise<StockAdjustmentResult.transaction>} Created inventory transaction
   * @returns {Promise<StockAdjustmentResult.previousStock>} Stock level before adjustment
   * @returns {Promise<StockAdjustmentResult.newStock>} Stock level after adjustment
   * @returns {Promise<StockAdjustmentResult.adjustment>} Quantity adjusted
   * @throws {Error} Inventory item not found
   *
   * @business Creates ADJUSTMENT type transaction in ledger
   * @business Positive quantity increases stock, negative decreases
   * @business Reason required for compliance and audit trail
   * @business User attribution maintained for all changes
   * @business Common reasons: 'damaged', 'expired', 'found', 'lost', 'stolen', 'correction'
   *
   * @example
   * // Remove expired items
   * const result = await StockService.adjustStock(
   *   'item-uuid-123',
   *   -10,
   *   'expired',
   *   'user-uuid-456'
   * );
   * // Returns: { previousStock: 50, newStock: 40, adjustment: -10, ... }
   *
   * @example
   * // Add found items during physical count
   * const result = await StockService.adjustStock(
   *   'item-uuid-123',
   *   5,
   *   'found during physical inventory count',
   *   'user-uuid-456'
   * );
   */
  static async adjustStock(
    id: string,
    quantity: number,
    reason: string,
    performedBy: string
  ): Promise<StockAdjustmentResult> {
    const transaction = await sequelize.transaction();

    try {
      const item = await InventoryItem.findByPk(id, { transaction });

      if (!item) {
        throw new Error('Inventory item not found');
      }

      // Get current stock before adjustment
      const currentStock = await this.getCurrentStock(id);

      // Create adjustment transaction
      const inventoryTransaction = await InventoryTransaction.create({
        inventoryItemId: id,
        type: InventoryTransactionType.ADJUSTMENT,
        quantity,
        reason,
        notes: `Stock adjusted from ${currentStock} to ${currentStock + quantity}. Reason: ${reason}`,
        performedById: performedBy
      }, { transaction });

      await transaction.commit();

      // Reload with associations
      await inventoryTransaction.reload({
        include: [
          {
            model: InventoryItem,
            as: 'inventoryItem'
          },
          {
            model: User,
            as: 'performedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      const newStock = currentStock + quantity;

      logger.info(
        `Stock adjusted for ${item.name}: ${currentStock} -> ${newStock} (${quantity > 0 ? '+' : ''}${quantity}) by ${performedBy}`
      );

      return {
        transaction: inventoryTransaction,
        previousStock: currentStock,
        newStock,
        adjustment: quantity
      };
    } catch (error) {
      await transaction.rollback();
      logger.error('Error adjusting stock:', error);
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
  ): Promise<StockHistoryResponse> {
    try {
      const offset = (page - 1) * limit;

      const { rows: transactions, count: total } = await InventoryTransaction.findAndCountAll({
        where: { inventoryItemId },
        include: [
          {
            model: User,
            as: 'performedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        order: [['createdAt', 'DESC']],
        offset,
        limit,
        distinct: true
      });

      // Calculate running stock totals
      const history = [];
      let runningTotal = 0;

      // Get all transactions in chronological order to calculate running totals
      const allTransactions = await InventoryTransaction.findAll({
        where: { inventoryItemId },
        order: [['createdAt', 'ASC']],
        attributes: ['id', 'quantity']
      });

      // Build running total map
      const runningTotals = new Map<string, number>();
      for (const txn of allTransactions) {
        runningTotal += txn.quantity;
        runningTotals.set(txn.id, runningTotal);
      }

      // Add running totals to paginated results
      for (const txn of transactions) {
        history.push({
          ...txn.get({ plain: true }),
          stockAfterTransaction: runningTotals.get(txn.id) || 0
        });
      }

      return {
        history,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting stock history:', error);
      throw error;
    }
  }

  /**
   * Check if item is low stock
   */
  static async isLowStock(inventoryItemId: string): Promise<boolean> {
    try {
      const item = await InventoryItem.findByPk(inventoryItemId);
      if (!item) {
        throw new Error('Inventory item not found');
      }

      const currentStock = await this.getCurrentStock(inventoryItemId);
      return currentStock <= item.reorderLevel;
    } catch (error) {
      logger.error('Error checking low stock:', error);
      throw error;
    }
  }

  /**
   * Check if item is out of stock
   */
  static async isOutOfStock(inventoryItemId: string): Promise<boolean> {
    try {
      const currentStock = await this.getCurrentStock(inventoryItemId);
      return currentStock === 0;
    } catch (error) {
      logger.error('Error checking out of stock:', error);
      throw error;
    }
  }

  /**
   * Get items with low stock
   */
  static async getLowStockItems() {
    try {
      const lowStockItems = await sequelize.query(`
        SELECT
          i.*,
          COALESCE(stock.totalQuantity, 0)::integer as "currentStock"
        FROM inventory_items i
        LEFT JOIN (
          SELECT
            "inventoryItemId",
            SUM(quantity) as totalQuantity
          FROM inventory_transactions
          GROUP BY "inventoryItemId"
        ) stock ON i.id = stock."inventoryItemId"
        WHERE i."isActive" = true
        AND COALESCE(stock.totalQuantity, 0) <= i."reorderLevel"
        AND COALESCE(stock.totalQuantity, 0) > 0
        ORDER BY COALESCE(stock.totalQuantity, 0) ASC
      `, {
        type: QueryTypes.SELECT
      });

      return lowStockItems;
    } catch (error) {
      logger.error('Error getting low stock items:', error);
      throw error;
    }
  }

  /**
   * Get items that are out of stock
   */
  static async getOutOfStockItems() {
    try {
      const outOfStockItems = await sequelize.query(`
        SELECT
          i.*,
          COALESCE(stock.totalQuantity, 0)::integer as "currentStock"
        FROM inventory_items i
        LEFT JOIN (
          SELECT
            "inventoryItemId",
            SUM(quantity) as totalQuantity
          FROM inventory_transactions
          GROUP BY "inventoryItemId"
        ) stock ON i.id = stock."inventoryItemId"
        WHERE i."isActive" = true
        AND COALESCE(stock.totalQuantity, 0) = 0
        ORDER BY i.name ASC
      `, {
        type: QueryTypes.SELECT
      });

      return outOfStockItems;
    } catch (error) {
      logger.error('Error getting out of stock items:', error);
      throw error;
    }
  }
}
