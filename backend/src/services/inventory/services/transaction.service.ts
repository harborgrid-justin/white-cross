import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RequestContextService } from '@/common/context/request-context.service';
import { BaseService } from '@/common/base';
import { InventoryTransaction } from '@/database/models';
import { CreateInventoryTransactionDto } from '../dto/create-inventory-transaction.dto';

@Injectable()
export class InventoryTransactionService extends BaseService {
  constructor(
    protected readonly requestContext: RequestContextService,
    @InjectModel(InventoryTransaction)
    private readonly transactionModel: typeof InventoryTransaction,
  ) {
    super(requestContext);
  }

  /**
   * Create inventory transaction
   */
  async createTransaction(
    data: CreateInventoryTransactionDto,
  ): Promise<InventoryTransaction> {
    try {
      const transaction = await this.transactionModel.create({
        ...data,
        expirationDate: data.expirationDate
          ? new Date(data.expirationDate)
          : undefined,
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
  async getTransactionsByItem(
    inventoryItemId: string,
  ): Promise<InventoryTransaction[]> {
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
