/**
 * WC-GEN-281 | stockOperations.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ../../database/types/enums | Dependencies: ../../utils/logger, ../../database/models, ../../database/types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Stock Operations Module
 *
 * Handles stock level management including:
 * - Creating inventory transactions
 * - Calculating current stock levels
 * - Stock adjustments with audit trail
 * - Stock history tracking
 */

import { logger } from '../../utils/logger';
import {
  InventoryItem,
  InventoryTransaction,
  User,
  sequelize
} from '../../database/models';
import { InventoryTransactionType } from '../../database/types/enums';
import {
  CreateInventoryTransactionData,
  StockHistoryResponse,
  StockAdjustmentResult
} from './types';

export class StockOperations {
  /**
   * Create inventory transaction with comprehensive validation
   */
  static async createInventoryTransaction(data: CreateInventoryTransactionData) {
    const dbTransaction = await sequelize.transaction();

    try {
      // Verify inventory item exists and is active
      const item = await InventoryItem.findByPk(data.inventoryItemId, { transaction: dbTransaction });

      if (!item) {
        throw new Error('Inventory item not found');
      }

      if (!item.isActive) {
        throw new Error('Cannot create transaction for inactive inventory item');
      }

      // Validate quantity
      if (!data.quantity || data.quantity === 0) {
        throw new Error('Quantity must be a non-zero value');
      }

      // For usage and disposal, make quantity negative
      let quantity = data.quantity;
      if ([InventoryTransactionType.USAGE, InventoryTransactionType.DISPOSAL].includes(data.type) && quantity > 0) {
        quantity = -quantity;
      }

      // For usage and disposal, ensure we have enough stock
      if (quantity < 0) {
        const currentStock = await this.getCurrentStock(data.inventoryItemId);
        const newStock = currentStock + quantity;

        if (newStock < 0) {
          throw new Error(
            `Insufficient stock. Current stock: ${currentStock}, ` +
            `requested: ${Math.abs(quantity)}, available: ${currentStock}`
          );
        }
      }

      // Validate expiration date for purchases
      if (data.type === InventoryTransactionType.PURCHASE && data.expirationDate) {
        const expirationDate = new Date(data.expirationDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (expirationDate < today) {
          throw new Error('Cannot add inventory with an expiration date in the past');
        }
      }

      // Validate batch number format if provided
      if (data.batchNumber && !/^[A-Za-z0-9-_]+$/.test(data.batchNumber)) {
        throw new Error('Batch number can only contain alphanumeric characters, hyphens, and underscores');
      }

      // Require reason for adjustments and disposals
      if ([InventoryTransactionType.ADJUSTMENT, InventoryTransactionType.DISPOSAL].includes(data.type)) {
        if (!data.reason || data.reason.trim().length === 0) {
          throw new Error(`Reason is required for ${data.type.toLowerCase()} transactions`);
        }
      }

      const transaction = await InventoryTransaction.create({
        inventoryItemId: data.inventoryItemId,
        type: data.type,
        quantity,
        unitCost: data.unitCost,
        reason: data.reason,
        batchNumber: data.batchNumber,
        expirationDate: data.expirationDate,
        notes: data.notes,
        performedById: data.performedBy
      }, { transaction: dbTransaction });

      await dbTransaction.commit();

      // Reload with associations
      await transaction.reload({
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

      logger.info(`Inventory transaction created: ${data.type} ${Math.abs(quantity)} of ${item.name}`);
      return transaction;
    } catch (error) {
      await dbTransaction.rollback();
      logger.error('Error creating inventory transaction:', error);
      throw error;
    }
  }

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
}
