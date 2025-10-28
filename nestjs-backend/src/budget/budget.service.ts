import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, MoreThan } from 'typeorm';
import { BudgetCategory } from './entities/budget-category.entity';
import { BudgetTransaction } from './entities/budget-transaction.entity';
import { CreateBudgetCategoryDto } from './dto/create-budget-category.dto';
import { UpdateBudgetCategoryDto } from './dto/update-budget-category.dto';
import { CreateBudgetTransactionDto } from './dto/create-budget-transaction.dto';
import { UpdateBudgetTransactionDto } from './dto/update-budget-transaction.dto';
import { BudgetTransactionFiltersDto } from './dto/budget-transaction-filters.dto';
import { BudgetSummaryDto } from './dto/budget-summary.dto';
import { SpendingTrendDto } from './dto/spending-trend.dto';
import { BudgetRecommendationDto } from './dto/budget-recommendation.dto';

/**
 * Budget Service
 *
 * Comprehensive budget management service for fiscal year tracking,
 * expense management, and financial reporting.
 *
 * Business Rules:
 * - Fiscal year runs July 1 - June 30
 * - Spent amounts automatically updated on transaction create/update/delete
 * - Over-budget spending allowed but generates warnings
 * - Categories soft-deleted to preserve historical data
 * - Transactions hard-deleted with automatic spent amount adjustment
 */
@Injectable()
export class BudgetService {
  private readonly logger = new Logger(BudgetService.name);

  constructor(
    @InjectRepository(BudgetCategory)
    private readonly budgetCategoryRepository: Repository<BudgetCategory>,
    @InjectRepository(BudgetTransaction)
    private readonly budgetTransactionRepository: Repository<BudgetTransaction>,
  ) {}

  /**
   * Get budget categories with optional filtering
   */
  async getBudgetCategories(
    fiscalYear?: number,
    activeOnly: boolean = true,
  ): Promise<BudgetCategory[]> {
    const currentYear = fiscalYear || new Date().getFullYear();

    const queryBuilder = this.budgetCategoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.transactions', 'transaction')
      .where('category.fiscalYear = :fiscalYear', { fiscalYear: currentYear });

    if (activeOnly) {
      queryBuilder.andWhere('category.isActive = :isActive', { isActive: true });
    }

    queryBuilder
      .orderBy('category.name', 'ASC')
      .addOrderBy('transaction.transactionDate', 'DESC');

    const categories = await queryBuilder.getMany();

    // Limit transactions to last 5 for each category
    categories.forEach(category => {
      if (category.transactions) {
        category.transactions = category.transactions.slice(0, 5);
      }
    });

    return categories;
  }

  /**
   * Get budget category by ID with all transactions
   */
  async getBudgetCategoryById(id: string): Promise<BudgetCategory> {
    const category = await this.budgetCategoryRepository.findOne({
      where: { id },
      relations: ['transactions'],
      order: {
        transactions: {
          transactionDate: 'DESC',
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Budget category with ID ${id} not found`);
    }

    return category;
  }

  /**
   * Create a new budget category
   */
  async createBudgetCategory(
    createDto: CreateBudgetCategoryDto,
  ): Promise<BudgetCategory> {
    // Check for duplicate category name in same fiscal year
    const existing = await this.budgetCategoryRepository.findOne({
      where: {
        name: createDto.name,
        fiscalYear: createDto.fiscalYear,
        isActive: true,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Budget category '${createDto.name}' already exists for fiscal year ${createDto.fiscalYear}`,
      );
    }

    const category = this.budgetCategoryRepository.create({
      ...createDto,
      spentAmount: 0,
    });

    const saved = await this.budgetCategoryRepository.save(category);

    this.logger.log(
      `Budget category created: ${saved.name} for FY${saved.fiscalYear}`,
    );

    return saved;
  }

  /**
   * Update budget category
   */
  async updateBudgetCategory(
    id: string,
    updateDto: UpdateBudgetCategoryDto,
  ): Promise<BudgetCategory> {
    const category = await this.getBudgetCategoryById(id);

    // Check for duplicate name if name is being changed
    if (updateDto.name && updateDto.name !== category.name) {
      const existing = await this.budgetCategoryRepository.findOne({
        where: {
          name: updateDto.name,
          fiscalYear: category.fiscalYear,
          isActive: true,
          id: Not(id),
        },
      });

      if (existing) {
        throw new ConflictException(
          `Budget category '${updateDto.name}' already exists for fiscal year ${category.fiscalYear}`,
        );
      }
    }

    Object.assign(category, updateDto);
    const updated = await this.budgetCategoryRepository.save(category);

    this.logger.log(`Budget category updated: ${updated.name}`);

    return updated;
  }

  /**
   * Delete budget category (soft delete)
   */
  async deleteBudgetCategory(id: string): Promise<{ success: boolean }> {
    const category = await this.getBudgetCategoryById(id);

    category.isActive = false;
    await this.budgetCategoryRepository.save(category);

    this.logger.log(`Budget category soft deleted: ${category.name}`);

    return { success: true };
  }

  /**
   * Create budget transaction with automatic spent amount update
   */
  async createBudgetTransaction(
    createDto: CreateBudgetTransactionDto,
  ): Promise<BudgetTransaction> {
    return await this.budgetCategoryRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // Verify category exists and is active
        const category = await transactionalEntityManager.findOne(BudgetCategory, {
          where: { id: createDto.categoryId },
        });

        if (!category) {
          throw new NotFoundException(
            `Budget category with ID ${createDto.categoryId} not found`,
          );
        }

        if (!category.isActive) {
          throw new BadRequestException(
            'Cannot add transactions to inactive budget category',
          );
        }

        // Check if transaction would exceed budget
        const newSpent = Number(category.spentAmount) + createDto.amount;
        const allocated = Number(category.allocatedAmount);

        if (newSpent > allocated) {
          this.logger.warn(
            `Transaction would exceed budget for ${category.name}: $${newSpent} > $${allocated}`,
          );
        }

        // Create transaction
        const transaction = transactionalEntityManager.create(BudgetTransaction, {
          ...createDto,
          transactionDate: new Date(),
        });

        const savedTransaction = await transactionalEntityManager.save(transaction);

        // Update category spent amount
        category.spentAmount = Number(category.spentAmount) + createDto.amount;
        await transactionalEntityManager.save(category);

        this.logger.log(
          `Budget transaction created: $${createDto.amount} for ${category.name}`,
        );

        // Reload with category relation
        return await transactionalEntityManager.findOne(BudgetTransaction, {
          where: { id: savedTransaction.id },
          relations: ['category'],
        });
      },
    );
  }

  /**
   * Update budget transaction
   */
  async updateBudgetTransaction(
    id: string,
    updateDto: UpdateBudgetTransactionDto,
  ): Promise<BudgetTransaction> {
    return await this.budgetTransactionRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const transaction = await transactionalEntityManager.findOne(
          BudgetTransaction,
          {
            where: { id },
            relations: ['category'],
          },
        );

        if (!transaction) {
          throw new NotFoundException(`Budget transaction with ID ${id} not found`);
        }

        const oldAmount = Number(transaction.amount);
        const newAmount = updateDto.amount !== undefined ? updateDto.amount : oldAmount;
        const amountDifference = newAmount - oldAmount;

        // Update category spent amount if amount changed
        if (amountDifference !== 0) {
          const category = await transactionalEntityManager.findOne(
            BudgetCategory,
            {
              where: { id: transaction.categoryId },
            },
          );

          if (category) {
            category.spentAmount = Number(category.spentAmount) + amountDifference;
            await transactionalEntityManager.save(category);
          }
        }

        Object.assign(transaction, updateDto);
        const updated = await transactionalEntityManager.save(transaction);

        this.logger.log(`Budget transaction updated: ${updated.id}`);

        return await transactionalEntityManager.findOne(BudgetTransaction, {
          where: { id: updated.id },
          relations: ['category'],
        });
      },
    );
  }

  /**
   * Delete budget transaction
   */
  async deleteBudgetTransaction(id: string): Promise<{ success: boolean }> {
    return await this.budgetTransactionRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const transaction = await transactionalEntityManager.findOne(
          BudgetTransaction,
          {
            where: { id },
          },
        );

        if (!transaction) {
          throw new NotFoundException(`Budget transaction with ID ${id} not found`);
        }

        const amount = Number(transaction.amount);

        // Update category spent amount
        const category = await transactionalEntityManager.findOne(BudgetCategory, {
          where: { id: transaction.categoryId },
        });

        if (category) {
          category.spentAmount = Math.max(
            0,
            Number(category.spentAmount) - amount,
          );
          await transactionalEntityManager.save(category);
        }

        await transactionalEntityManager.remove(transaction);

        this.logger.log(`Budget transaction deleted: ${id} ($${amount})`);

        return { success: true };
      },
    );
  }

  /**
   * Get budget transactions with pagination and filters
   */
  async getBudgetTransactions(filters: BudgetTransactionFiltersDto) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.budgetTransactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category');

    if (filters.categoryId) {
      queryBuilder.andWhere('transaction.categoryId = :categoryId', {
        categoryId: filters.categoryId,
      });
    }

    if (filters.startDate) {
      queryBuilder.andWhere('transaction.transactionDate >= :startDate', {
        startDate: new Date(filters.startDate),
      });
    }

    if (filters.endDate) {
      queryBuilder.andWhere('transaction.transactionDate <= :endDate', {
        endDate: new Date(filters.endDate),
      });
    }

    queryBuilder
      .orderBy('transaction.transactionDate', 'DESC')
      .skip(skip)
      .take(limit);

    const [transactions, total] = await queryBuilder.getManyAndCount();

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get comprehensive budget summary for a fiscal year
   */
  async getBudgetSummary(fiscalYear?: number): Promise<BudgetSummaryDto> {
    const currentYear = fiscalYear || new Date().getFullYear();

    const result = await this.budgetCategoryRepository
      .createQueryBuilder('category')
      .select('SUM(category.allocatedAmount)', 'totalAllocated')
      .addSelect('SUM(category.spentAmount)', 'totalSpent')
      .addSelect('COUNT(category.id)', 'categoryCount')
      .where('category.fiscalYear = :fiscalYear', { fiscalYear: currentYear })
      .andWhere('category.isActive = :isActive', { isActive: true })
      .getRawOne();

    // Manual count for over-budget categories
    const categories = await this.budgetCategoryRepository.find({
      where: { fiscalYear: currentYear, isActive: true },
    });

    const overBudget = categories.filter(
      (c) => Number(c.spentAmount) > Number(c.allocatedAmount),
    ).length;

    const totalAllocated = Number(result.totalAllocated) || 0;
    const totalSpent = Number(result.totalSpent) || 0;
    const totalRemaining = totalAllocated - totalSpent;
    const utilizationPercentage =
      totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

    return {
      fiscalYear: currentYear,
      totalAllocated,
      totalSpent,
      totalRemaining,
      utilizationPercentage: Math.round(utilizationPercentage * 100) / 100,
      categoryCount: parseInt(result.categoryCount, 10) || 0,
      overBudgetCount: overBudget,
    };
  }

  /**
   * Get spending trends by month
   */
  async getSpendingTrends(
    fiscalYear?: number,
    categoryId?: string,
  ): Promise<SpendingTrendDto[]> {
    const currentYear = fiscalYear || new Date().getFullYear();

    const queryBuilder = this.budgetTransactionRepository
      .createQueryBuilder('transaction')
      .leftJoin('transaction.category', 'category')
      .select("DATE_TRUNC('month', transaction.transactionDate)", 'month')
      .addSelect('SUM(transaction.amount)', 'totalSpent')
      .addSelect('COUNT(transaction.id)', 'transactionCount')
      .where('category.fiscalYear = :fiscalYear', { fiscalYear: currentYear });

    if (categoryId) {
      queryBuilder.andWhere('transaction.categoryId = :categoryId', {
        categoryId,
      });
    }

    queryBuilder
      .groupBy("DATE_TRUNC('month', transaction.transactionDate)")
      .orderBy('month', 'ASC');

    const results = await queryBuilder.getRawMany();

    return results.map((result) => ({
      month: new Date(result.month),
      totalSpent: Number(result.totalSpent),
      transactionCount: parseInt(result.transactionCount, 10),
    }));
  }

  /**
   * Get over-budget categories
   */
  async getOverBudgetCategories(fiscalYear?: number) {
    const currentYear = fiscalYear || new Date().getFullYear();

    const categories = await this.budgetCategoryRepository.find({
      where: { fiscalYear: currentYear, isActive: true },
      relations: ['transactions'],
      order: {
        transactions: {
          transactionDate: 'DESC',
        },
      },
    });

    const overBudget = categories
      .filter((c) => Number(c.spentAmount) > Number(c.allocatedAmount))
      .map((category) => {
        const allocated = Number(category.allocatedAmount);
        const spent = Number(category.spentAmount);
        const overAmount = spent - allocated;
        const overPercentage = (overAmount / allocated) * 100;

        // Limit transactions to last 10
        if (category.transactions) {
          category.transactions = category.transactions.slice(0, 10);
        }

        return {
          ...category,
          overAmount,
          overPercentage: Math.round(overPercentage * 100) / 100,
        };
      });

    // Sort by over amount descending
    overBudget.sort((a, b) => b.overAmount - a.overAmount);

    return overBudget;
  }

  /**
   * Get category year comparison
   */
  async getCategoryYearComparison(categoryName: string, years: number[]) {
    const categories = await this.budgetCategoryRepository.find({
      where: years.map((year) => ({
        name: categoryName,
        fiscalYear: year,
        isActive: true,
      })),
      order: { fiscalYear: 'ASC' },
    });

    return categories.map((category) => ({
      fiscalYear: category.fiscalYear,
      allocatedAmount: Number(category.allocatedAmount),
      spentAmount: Number(category.spentAmount),
      remainingAmount: category.remainingAmount,
      utilizationPercentage: category.utilizationPercentage,
    }));
  }

  /**
   * Get budget recommendations based on historical spending
   */
  async getBudgetRecommendations(
    fiscalYear?: number,
  ): Promise<BudgetRecommendationDto[]> {
    const currentYear = fiscalYear || new Date().getFullYear();
    const previousYear = currentYear - 1;

    const [currentCategories, previousCategories] = await Promise.all([
      this.budgetCategoryRepository.find({
        where: { fiscalYear: currentYear, isActive: true },
      }),
      this.budgetCategoryRepository.find({
        where: { fiscalYear: previousYear, isActive: true },
      }),
    ]);

    const recommendations: BudgetRecommendationDto[] = currentCategories.map(
      (current) => {
        const previous = previousCategories.find((p) => p.name === current.name);

        const currentAllocated = Number(current.allocatedAmount);
        const currentSpent = Number(current.spentAmount);
        const currentUtilization =
          currentAllocated > 0 ? (currentSpent / currentAllocated) * 100 : 0;

        let recommendation: 'INCREASE' | 'DECREASE' | 'MAINTAIN' = 'MAINTAIN';
        let suggestedAmount = currentAllocated;
        let reason = 'Current allocation is appropriate';

        if (previous) {
          const previousSpent = Number(previous.spentAmount);
          const previousAllocated = Number(previous.allocatedAmount);
          const previousUtilization =
            previousAllocated > 0 ? (previousSpent / previousAllocated) * 100 : 0;

          // Over 90% utilization suggests need for increase
          if (currentUtilization > 90) {
            recommendation = 'INCREASE';
            suggestedAmount = Math.ceil(currentSpent * 1.1); // 10% buffer
            reason = `High utilization (${Math.round(currentUtilization)}%) indicates budget pressure`;
          }
          // Under 60% utilization suggests potential decrease
          else if (currentUtilization < 60 && previousUtilization < 60) {
            recommendation = 'DECREASE';
            suggestedAmount = Math.ceil(((currentSpent + previousSpent) / 2) * 1.05);
            reason = `Consistent low utilization (${Math.round(currentUtilization)}%) across years`;
          }
          // Trending upward spending
          else if (currentSpent > previousSpent * 1.2) {
            recommendation = 'INCREASE';
            suggestedAmount = Math.ceil(currentSpent * 1.15);
            reason = 'Spending trending upward compared to previous year';
          }
        }

        return {
          categoryName: current.name,
          currentAllocated,
          currentSpent,
          currentUtilization: Math.round(currentUtilization * 100) / 100,
          recommendation,
          suggestedAmount,
          reason,
        };
      },
    );

    return recommendations;
  }

  /**
   * Export budget data for a fiscal year
   */
  async exportBudgetData(fiscalYear?: number) {
    const currentYear = fiscalYear || new Date().getFullYear();

    const [categories, summary] = await Promise.all([
      this.getBudgetCategories(currentYear, false),
      this.getBudgetSummary(currentYear),
    ]);

    const categoriesWithTransactions = await Promise.all(
      categories.map(async (category) => {
        const { transactions } = await this.getBudgetTransactions({
          categoryId: category.id,
          page: 1,
          limit: 10000, // Large limit for export
        });

        return {
          ...category,
          transactions,
        };
      }),
    );

    this.logger.log(`Budget data exported for FY${currentYear}`);

    return {
      exportDate: new Date().toISOString(),
      fiscalYear: currentYear,
      summary,
      categories: categoriesWithTransactions,
    };
  }
}
