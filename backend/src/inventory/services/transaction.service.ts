import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InventoryTransaction } from '../entities/inventory-transaction.entity';
import { CreateInventoryTransactionDto } from '../dto/create-inventory-transaction.dto';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectModel(InventoryTransaction)
    private readonly transactionModel: typeof InventoryTransaction,
  ) {}

  /**
   * Create inventory transaction
   */
  async createTransaction(data: CreateInventoryTransactionDto): Promise<InventoryTransaction> {
    try {
      const transaction = await this.transactionModel.create({
        ...data,
        expirationDate: data.expirationDate ? new Date(data.expirationDate) : undefined,
      } as any);

      this.logger.log(
        `Inventory transaction created: ${transaction.type} - ${transaction.quantity} units`,
      );

      return transaction;
    } catch (error) {
      this.logger.error('Error creating inventory transaction:', error);
      throw error;
    }
  }

  /**
   * Get transactions for an item
   */
  async getTransactionsByItem(inventoryItemId: string): Promise<InventoryTransaction[]> {
    try {
      const transactions = await this.transactionModel.findAll({
        where: { inventoryItemId },
        order: [['createdAt', 'DESC']],
      });

      return transactions;
    } catch (error) {
      this.logger.error('Error getting transactions:', error);
      throw error;
    }
  }
}
