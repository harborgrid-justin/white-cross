import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
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
  history: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

@Injectable()
export class StockManagementService {
  private readonly logger = new Logger(StockManagementService.name);

  constructor(
    @InjectRepository(InventoryItem)
    private readonly inventoryItemRepository: Repository<InventoryItem>,
    @InjectRepository(InventoryTransaction)
    private readonly transactionRepository: Repository<InventoryTransaction>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Get current stock level for an item
   * Calculates stock as SUM(quantity) from all inventory_transactions
   */
  async getCurrentStock(inventoryItemId: string): Promise<number> {
    try {
      const result = await this.transactionRepository
        .createQueryBuilder('transaction')
        .select('SUM(transaction.quantity)', 'totalQuantity')
        .where('transaction.inventoryItemId = :inventoryItemId', { inventoryItemId })
        .getRawOne();

      return Number(result?.totalQuantity) || 0;
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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const item = await this.inventoryItemRepository.findOne({ where: { id } });

      if (!item) {
        throw new NotFoundException('Inventory item not found');
      }

      // Get current stock before adjustment
      const currentStock = await this.getCurrentStock(id);

      // Create adjustment transaction
      const transaction = this.transactionRepository.create({
        inventoryItemId: id,
        type: InventoryTransactionType.ADJUSTMENT,
        quantity: adjustmentData.quantity,
        reason: adjustmentData.reason,
        notes: `Stock adjusted from ${currentStock} to ${currentStock + adjustmentData.quantity}. Reason: ${adjustmentData.reason}`,
        performedById: adjustmentData.performedById,
      });

      const savedTransaction = await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();

      const newStock = currentStock + adjustmentData.quantity;

      this.logger.log(
        `Stock adjusted for ${item.name}: ${currentStock} -> ${newStock} (${adjustmentData.quantity > 0 ? '+' : ''}${adjustmentData.quantity}) by ${adjustmentData.performedById}`,
      );

      return {
        transaction: savedTransaction,
        previousStock: currentStock,
        newStock,
        adjustment: adjustmentData.quantity,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error adjusting stock:', error);
      throw error;
    } finally {
      await queryRunner.release();
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

      const [transactions, total] = await this.transactionRepository.findAndCount({
        where: { inventoryItemId },
        order: { createdAt: 'DESC' },
        skip: offset,
        take: limit,
      });

      // Calculate running stock totals
      const history = [];

      // Get all transactions in chronological order to calculate running totals
      const allTransactions = await this.transactionRepository.find({
        where: { inventoryItemId },
        order: { createdAt: 'ASC' },
        select: ['id', 'quantity'],
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
          ...txn,
          stockAfterTransaction: runningTotals.get(txn.id) || 0,
        });
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
      const item = await this.inventoryItemRepository.findOne({ where: { id: inventoryItemId } });

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

      const lowStockItems = await this.dataSource.query(query);
      return lowStockItems;
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

      const outOfStockItems = await this.dataSource.query(query);
      return outOfStockItems;
    } catch (error) {
      this.logger.error('Error getting out of stock items:', error);
      throw error;
    }
  }
}
