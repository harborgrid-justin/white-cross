/**
 * LOC: F3CBE170EE
 * WC-GEN-282 | stockService.ts - General utility functions and operations
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
 */

/**
 * WC-GEN-282 | stockService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ../../database/types/enums | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Stock Management Service
 *
 * Handles stock levels, adjustments, and stock-related calculations.
 * Provides centralized stock management functionality.
 */

import { QueryTypes } from 'sequelize';
import { logger } from '../../utils/logger';
import { InventoryTransaction, InventoryItem, User, sequelize } from '../../database/models';
import { InventoryTransactionType } from '../../database/types/enums';
import { StockAdjustmentResult, StockHistoryResponse } from './types';

export class StockService {
  /**
   * Get current stock level for an item
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
