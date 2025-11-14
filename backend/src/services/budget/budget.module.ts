import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { BudgetCategory, BudgetTransaction } from '@/database';

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
  imports: [SequelizeModule.forFeature([BudgetCategory, BudgetTransaction])],
  providers: [BudgetService],
  controllers: [BudgetController],
  exports: [BudgetService],
})
export class BudgetModule {}
