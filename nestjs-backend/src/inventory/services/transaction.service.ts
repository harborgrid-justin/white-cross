import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryTransaction } from '../entities/inventory-transaction.entity';
import { CreateInventoryTransactionDto } from '../dto/create-inventory-transaction.dto';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectRepository(InventoryTransaction)
    private readonly transactionRepository: Repository<InventoryTransaction>,
  ) {}

  /**
   * Create inventory transaction
   */
  async createTransaction(data: CreateInventoryTransactionDto): Promise<InventoryTransaction> {
    try {
      const transaction = this.transactionRepository.create({
        ...data,
        expirationDate: data.expirationDate ? new Date(data.expirationDate) : null,
      });

      const savedTransaction = await this.transactionRepository.save(transaction);

      this.logger.log(
        `Inventory transaction created: ${savedTransaction.type} - ${savedTransaction.quantity} units`,
      );

      return savedTransaction;
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
      const transactions = await this.transactionRepository.find({
        where: { inventoryItemId },
        order: { createdAt: 'DESC' },
      });

      return transactions;
    } catch (error) {
      this.logger.error('Error getting transactions:', error);
      throw error;
    }
  }
}
