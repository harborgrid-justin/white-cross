import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { RequestContextService } from '../../shared/context/request-context.service';
import { BaseService } from "../../common/base";
import { InventoryItem } from '../entities/inventory-item.entity';
import { InventoryTransaction, InventoryTransactionType } from '../entities/inventory-transaction.entity';
import { StockAdjustmentDto } from '../dto/stock-adjustment.dto';

export interface StockAdjustmentResult {
  transaction: InventoryTransaction;
  previousStock: number;
  newStock: number;
  adjustment: number;
}

export interface StockHistoryResponse {
  history: (InventoryTransaction & { stockAfterTransaction: number })[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

@Injectable()
export class InventoryStockManagementService extends BaseService {
  constructor(
    protected readonly requestContext: RequestContextService,
    @InjectModel(InventoryItem)
    private readonly inventoryItemModel: typeof InventoryItem,
    @InjectModel(InventoryTransaction)
    private readonly transactionModel: typeof InventoryTransaction,
    private readonly sequelize: Sequelize,
  ) {
    super(requestContext);
  }

  /**
   * Get current stock level for an item
   * Calculates stock as SUM(quantity) from all inventory_transactions
   */
  async getCurrentStock(inventoryItemId: string): Promise<number> {
    try {
      const result = await this.transactionModel.sum('quantity', {
        where: { inventoryItemId },
      });

      return Number(result) || 0;
    } catch (error) {
      this.logger.error('Error getting current stock:', error);
      throw error;
    }
  }

  /**
   * Adjust stock with audit trail and transaction support
   */
  async adjustStock(
    id: string,
    adjustmentData: StockAdjustmentDto,
  ): Promise<StockAdjustmentResult> {
    const sequelizeTransaction = await this.sequelize.transaction();

    try {
      const item = await this.inventoryItemModel.findByPk(id);

      if (!item) {
        throw new NotFoundException('Inventory item not found');
      }

      // Get current stock before adjustment
      const currentStock = await this.getCurrentStock(id);

      // Create adjustment transaction
      const transaction = await this.transactionModel.create(
        {
          inventoryItemId: id,
          type: InventoryTransactionType.ADJUSTMENT,
          quantity: adjustmentData.quantity,
          reason: adjustmentData.reason,
          notes: `Stock adjusted from ${currentStock} to ${currentStock + adjustmentData.quantity}. Reason: ${adjustmentData.reason}`,
          performedById: adjustmentData.performedById,
        } as any,
        { transaction: sequelizeTransaction },
      );

      await sequelizeTransaction.commit();

      const newStock = currentStock + adjustmentData.quantity;

      this.logger.log(
        `Stock adjusted for ${item.name}: ${currentStock} -> ${newStock} (${adjustmentData.quantity > 0 ? '+' : ''}${adjustmentData.quantity}) by ${adjustmentData.performedById}`,
      );

      return {
        transaction,
        previousStock: currentStock,
        newStock,
        adjustment: adjustmentData.quantity,
      };
    } catch (error) {
      await sequelizeTransaction.rollback();
      this.logger.error('Error adjusting stock:', error);
      throw error;
    }
  }

  /**
   * Get stock history for an item
   */
  async getStockHistory(
    inventoryItemId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<StockHistoryResponse> {
    try {
      const offset = (page - 1) * limit;

      const { rows: transactions, count: total } =
        await this.transactionModel.findAndCountAll({
          where: { inventoryItemId },
          order: [['createdAt', 'DESC']],
          limit,
          offset,
        });

      // Calculate running stock totals
      const history: (InventoryTransaction & {
        stockAfterTransaction: number;
      })[] = [];

      // Get all transactions in chronological order to calculate running totals
      const allTransactions = await this.transactionModel.findAll({
        where: { inventoryItemId },
        order: [['createdAt', 'ASC']],
        attributes: ['id', 'quantity'],
      });

      // Build running total map
      const runningTotals = new Map<string, number>();
      let runningTotal = 0;

      for (const txn of allTransactions) {
        runningTotal += txn.quantity;
        runningTotals.set(txn.id, runningTotal);
      }

      // Add running totals to paginated results
      for (const txn of transactions) {
        history.push({
          ...txn.get({ plain: true }),
          stockAfterTransaction: runningTotals.get(txn.id) || 0,
        } as any);
      }

      return {
        history,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error('Error getting stock history:', error);
      throw error;
    }
  }

  /**
   * Check if item is low stock
   */
  async isLowStock(inventoryItemId: string): Promise<boolean> {
    try {
      const item = await this.inventoryItemModel.findByPk(inventoryItemId);

      if (!item) {
        throw new NotFoundException('Inventory item not found');
      }

      const currentStock = await this.getCurrentStock(inventoryItemId);
      return currentStock <= item.reorderLevel;
    } catch (error) {
      this.logger.error('Error checking low stock:', error);
      throw error;
    }
  }

  /**
   * Check if item is out of stock
   */
  async isOutOfStock(inventoryItemId: string): Promise<boolean> {
    try {
      const currentStock = await this.getCurrentStock(inventoryItemId);
      return currentStock === 0;
    } catch (error) {
      this.logger.error('Error checking out of stock:', error);
      throw error;
    }
  }

  /**
   * Get items with low stock
   */
  async getLowStockItems(): Promise<any[]> {
    try {
      const query = `
        SELECT
          i.*,
          COALESCE(stock.total_quantity, 0)::integer as "currentStock"
        FROM inventory_items i
        LEFT JOIN (
          SELECT
            inventory_item_id,
            SUM(quantity) as total_quantity
          FROM inventory_transactions
          GROUP BY inventory_item_id
        ) stock ON i.id = stock.inventory_item_id
        WHERE i.is_active = true
        AND COALESCE(stock.total_quantity, 0) <= i.reorder_level
        AND COALESCE(stock.total_quantity, 0) > 0
        ORDER BY COALESCE(stock.total_quantity, 0) ASC
      `;

      const [lowStockItems] = await this.sequelize.query(query, {
        type: QueryTypes.SELECT,
      });
      return lowStockItems as any[];
    } catch (error) {
      this.logger.error('Error getting low stock items:', error);
      throw error;
    }
  }

  /**
   * Get items that are out of stock
   */
  async getOutOfStockItems(): Promise<any[]> {
    try {
      const query = `
        SELECT
          i.*,
          COALESCE(stock.total_quantity, 0)::integer as "currentStock"
        FROM inventory_items i
        LEFT JOIN (
          SELECT
            inventory_item_id,
            SUM(quantity) as total_quantity
          FROM inventory_transactions
          GROUP BY inventory_item_id
        ) stock ON i.id = stock.inventory_item_id
        WHERE i.is_active = true
        AND COALESCE(stock.total_quantity, 0) = 0
        ORDER BY i.name ASC
      `;

      const [outOfStockItems] = await this.sequelize.query(query, {
        type: QueryTypes.SELECT,
      });
      return outOfStockItems as any[];
    } catch (error) {
      this.logger.error('Error getting out of stock items:', error);
      throw error;
    }
  }
}
