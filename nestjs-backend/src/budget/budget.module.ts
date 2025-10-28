import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { BudgetCategory } from './entities/budget-category.entity';
import { BudgetTransaction } from './entities/budget-transaction.entity';

/**
 * Budget Module
 *
 * Provides comprehensive budget management functionality including:
 * - Budget category management with fiscal year support
 * - Budget transaction tracking with automatic spent amount updates
 * - Financial reporting and analytics
 * - Budget recommendations and variance tracking
 *
 * Exports BudgetService for use in other modules.
 */
@Module({
  imports: [TypeOrmModule.forFeature([BudgetCategory, BudgetTransaction])],
  providers: [BudgetService],
  controllers: [BudgetController],
  exports: [BudgetService],
})
export class BudgetModule {}
