/**
 * WC-GEN-284 | transactionService.ts - General utility functions and operations
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
 * Inventory Transaction Service
 *
 * Handles inventory transactions with comprehensive validation.
 * Manages stock movements and transaction history.
 */

import { logger } from '../../utils/logger';
import { InventoryTransaction, InventoryItem, User, sequelize } from '../../database/models';
import { InventoryTransactionType } from '../../database/types/enums';
import { CreateInventoryTransactionData } from './types';
import { StockService } from './stockService';

export class TransactionService {
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
        const currentStock = await StockService.getCurrentStock(data.inventoryItemId);
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
   * Get transactions for an inventory item
   */
  static async getTransactionsByItem(
    inventoryItemId: string,
    page: number = 1,
    limit: number = 20,
    type?: InventoryTransactionType
  ) {
    try {
      const offset = (page - 1) * limit;
      const whereClause: any = { inventoryItemId };

      if (type) {
        whereClause.type = type;
      }

      const { rows: transactions, count: total } = await InventoryTransaction.findAndCountAll({
        where: whereClause,
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

      return {
        transactions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting transactions by item:', error);
      throw error;
    }
  }

  /**
   * Get recent transactions across all items
   */
  static async getRecentTransactions(limit: number = 10) {
    try {
      const transactions = await InventoryTransaction.findAll({
        limit,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: InventoryItem,
            as: 'inventoryItem',
            attributes: ['id', 'name', 'category']
          },
          {
            model: User,
            as: 'performedBy',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      return transactions;
    } catch (error) {
      logger.error('Error getting recent transactions:', error);
      throw error;
    }
  }

  /**
   * Get transaction by ID
   */
  static async getTransactionById(id: string) {
    try {
      const transaction = await InventoryTransaction.findByPk(id, {
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

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      return transaction;
    } catch (error) {
      logger.error('Error getting transaction by ID:', error);
      throw error;
    }
  }

  /**
   * Get transaction statistics for date range
   */
  static async getTransactionStats(startDate: Date, endDate: Date) {
    try {
      const stats = await InventoryTransaction.findAll({
        where: {
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        },
        attributes: [
          'type',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity']
        ],
        group: ['type'],
        raw: true
      });

      return stats;
    } catch (error) {
      logger.error('Error getting transaction stats:', error);
      throw error;
    }
  }

  /**
   * Validate transaction data before creation
   */
  private static validateTransactionData(data: CreateInventoryTransactionData): void {
    // Validate required fields
    if (!data.inventoryItemId) {
      throw new Error('Inventory item ID is required');
    }

    if (!data.type) {
      throw new Error('Transaction type is required');
    }

    if (!data.performedBy) {
      throw new Error('Performed by user ID is required');
    }

    // Validate quantity
    if (typeof data.quantity !== 'number' || isNaN(data.quantity)) {
      throw new Error('Quantity must be a valid number');
    }

    if (data.quantity === 0) {
      throw new Error('Quantity cannot be zero');
    }

    // Validate unit cost if provided
    if (data.unitCost !== undefined && (typeof data.unitCost !== 'number' || isNaN(data.unitCost) || data.unitCost < 0)) {
      throw new Error('Unit cost must be a non-negative number');
    }

    // Validate dates
    if (data.expirationDate && !(data.expirationDate instanceof Date)) {
      throw new Error('Expiration date must be a valid Date object');
    }
  }

  /**
   * Bulk create transactions (for imports or batch operations)
   */
  static async bulkCreateTransactions(transactions: CreateInventoryTransactionData[]) {
    const dbTransaction = await sequelize.transaction();

    try {
      const createdTransactions = [];

      for (const txnData of transactions) {
        // Validate each transaction
        this.validateTransactionData(txnData);

        // Create transaction using the single transaction method
        const transaction = await this.createInventoryTransaction(txnData);
        createdTransactions.push(transaction);
      }

      await dbTransaction.commit();

      logger.info(`Bulk created ${createdTransactions.length} inventory transactions`);
      return createdTransactions;
    } catch (error) {
      await dbTransaction.rollback();
      logger.error('Error bulk creating transactions:', error);
      throw error;
    }
  }
}
