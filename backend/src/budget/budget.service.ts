import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BudgetCategory, BudgetTransaction } from '@/database';
import {
  BudgetRecommendationDto,
  BudgetRecommendationType,
  BudgetSummaryDto,
  BudgetTransactionFiltersDto,
  CreateBudgetCategoryDto,
  CreateBudgetTransactionDto,
  SpendingTrendDto,
  UpdateBudgetCategoryDto,
  UpdateBudgetTransactionDto,
} from '@/budget/dto';

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
    @InjectModel(BudgetCategory)
    private readonly budgetCategoryModel: typeof BudgetCategory,
    @InjectModel(BudgetTransaction)
    private readonly budgetTransactionModel: typeof BudgetTransaction,
  ) {}

  /**
   * Get budget categories with optional filtering
   */
  async getBudgetCategories(
    fiscalYear?: number,
    activeOnly: boolean = true,
  ): Promise<BudgetCategory[]> {
    const currentYear = fiscalYear || new Date().getFullYear();

    const where: any = { fiscalYear: currentYear };
    if (activeOnly) {
      where.isActive = true;
    }

    const categories = await this.budgetCategoryModel.findAll({
      where,
      include: [
        {
          model: this.budgetTransactionModel,
          as: 'transactions',
          order: [['transactionDate', 'DESC']],
        },
      ],
      order: [['name', 'ASC']],
    });

    // Limit transactions to last 5 for each category
    categories.forEach((category) => {
      if (category.transactions) {
        category.transactions = category.transactions.slice(0, 5) as any;
      }
    });

    return categories;
  }

  /**
   * Get budget category by ID with all transactions
   */
  async getBudgetCategoryById(id: string): Promise<BudgetCategory> {
    const category = await this.budgetCategoryModel.findOne({
      where: { id },
      include: [
        {
          model: this.budgetTransactionModel,
          as: 'transactions',
          order: [['transactionDate', 'DESC']],
        },
      ],
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
    const existing = await this.budgetCategoryModel.findOne({
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

    const category = await this.budgetCategoryModel.create({
      name: createDto.name,
      description: createDto.description || null,
      fiscalYear: createDto.fiscalYear,
      allocatedAmount: createDto.allocatedAmount,
      spentAmount: 0,
      isActive: true,
    } as any);

    this.logger.log(
      `Budget category created: ${category.name} for FY${category.fiscalYear}`,
    );

    return category;
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
      const existing = await this.budgetCategoryModel.findOne({
        where: {
          name: updateDto.name,
          fiscalYear: category.fiscalYear,
          isActive: true,
          id: { [Op.ne]: id },
        },
      });

      if (existing) {
        throw new ConflictException(
          `Budget category '${updateDto.name}' already exists for fiscal year ${category.fiscalYear}`,
        );
      }
    }

    Object.assign(category, updateDto);
    await category.save();

    this.logger.log(`Budget category updated: ${category.name}`);

    return category;
  }

  /**
   * Delete budget category (soft delete)
   */
  async deleteBudgetCategory(id: string): Promise<{ success: boolean }> {
    const category = await this.getBudgetCategoryById(id);

    category.isActive = false;
    await category.save();

    this.logger.log(`Budget category soft deleted: ${category.name}`);

    return { success: true };
  }

  /**
   * Create budget transaction with automatic spent amount update
   */
  async createBudgetTransaction(
    createDto: CreateBudgetTransactionDto,
  ): Promise<BudgetTransaction> {
    const sequelize = this.budgetCategoryModel.sequelize!;
    return await sequelize.transaction(async (transaction) => {
      // Verify category exists and is active
      const category = await this.budgetCategoryModel.findOne({
        where: { id: createDto.categoryId },
        transaction,
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
      const transactionRecord = await this.budgetTransactionModel.create(
        {
          categoryId: createDto.categoryId,
          amount: createDto.amount,
          description: createDto.description,
          transactionDate: new Date(),
          referenceId: createDto.referenceId || null,
          referenceType: createDto.referenceType || null,
          notes: createDto.notes || null,
        } as any,
        { transaction },
      );

      // Update category spent amount
      category.spentAmount = Number(category.spentAmount) + createDto.amount;
      await category.save({ transaction });

      this.logger.log(
        `Budget transaction created: $${createDto.amount} for ${category.name}`,
      );

      // Reload with category relation
      const result = await this.budgetTransactionModel.findOne({
        where: { id: transactionRecord.id },
        include: [
          {
            model: this.budgetCategoryModel,
            as: 'category',
          },
        ],
        transaction,
      });

      if (!result) {
        throw new Error('Failed to reload transaction after creation');
      }

      return result;
    });
  }

  /**
   * Update budget transaction
   */
  async updateBudgetTransaction(
    id: string,
    updateDto: UpdateBudgetTransactionDto,
  ): Promise<BudgetTransaction> {
    const sequelize = this.budgetTransactionModel.sequelize!;
    return await sequelize.transaction(async (transaction) => {
      const transactionRecord = await this.budgetTransactionModel.findOne({
        where: { id },
        include: [
          {
            model: this.budgetCategoryModel,
            as: 'category',
          },
        ],
        transaction,
      });

      if (!transactionRecord) {
        throw new NotFoundException(
          `Budget transaction with ID ${id} not found`,
        );
      }

      const oldAmount = Number(transactionRecord.amount);
      const newAmount =
        updateDto.amount !== undefined ? updateDto.amount : oldAmount;
      const amountDifference = newAmount - oldAmount;

      // Update category spent amount if amount changed
      if (amountDifference !== 0) {
        const category = await this.budgetCategoryModel.findOne({
          where: { id: transactionRecord.categoryId },
          transaction,
        });

        if (category) {
          category.spentAmount =
            Number(category.spentAmount) + amountDifference;
          await category.save({ transaction });
        }
      }

      Object.assign(transactionRecord, updateDto);
      await transactionRecord.save({ transaction });

      this.logger.log(`Budget transaction updated: ${transactionRecord.id}`);

      const result = await this.budgetTransactionModel.findOne({
        where: { id: transactionRecord.id },
        include: [
          {
            model: this.budgetCategoryModel,
            as: 'category',
          },
        ],
        transaction,
      });

      if (!result) {
        throw new Error('Failed to reload transaction after update');
      }

      return result;
    });
  }

  /**
   * Delete budget transaction
   */
  async deleteBudgetTransaction(id: string): Promise<{ success: boolean }> {
    const sequelize = this.budgetTransactionModel.sequelize!;
    return await sequelize.transaction(async (transaction) => {
      const transactionRecord = await this.budgetTransactionModel.findOne({
        where: { id },
        transaction,
      });

      if (!transactionRecord) {
        throw new NotFoundException(
          `Budget transaction with ID ${id} not found`,
        );
      }

      const amount = Number(transactionRecord.amount);

      // Update category spent amount
      const category = await this.budgetCategoryModel.findOne({
        where: { id: transactionRecord.categoryId },
        transaction,
      });

      if (category) {
        category.spentAmount = Math.max(
          0,
          Number(category.spentAmount) - amount,
        );
        await category.save({ transaction });
      }

      await transactionRecord.destroy({ transaction });

      this.logger.log(`Budget transaction deleted: ${id} ($${amount})`);

      return { success: true };
    });
  }

  /**
   * Get budget transactions with pagination and filters
   */
  async getBudgetTransactions(filters: BudgetTransactionFiltersDto) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.startDate) {
      where.transactionDate = {
        ...where.transactionDate,
        [Op.gte]: new Date(filters.startDate),
      };
    }

    if (filters.endDate) {
      where.transactionDate = {
        ...where.transactionDate,
        [Op.lte]: new Date(filters.endDate),
      };
    }

    const { rows: transactions, count: total } =
      await this.budgetTransactionModel.findAndCountAll({
        where,
        include: [
          {
            model: this.budgetCategoryModel,
            as: 'category',
          },
        ],
        order: [['transactionDate', 'DESC']],
        offset,
        limit,
      });

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

    const result = await this.budgetCategoryModel.findAll({
      where: {
        fiscalYear: currentYear,
        isActive: true,
      },
      attributes: [
        [
          this.budgetCategoryModel.sequelize!.fn(
            'SUM',
            this.budgetCategoryModel.sequelize!.col('allocatedAmount'),
          ),
          'totalAllocated',
        ],
        [
          this.budgetCategoryModel.sequelize!.fn(
            'SUM',
            this.budgetCategoryModel.sequelize!.col('spentAmount'),
          ),
          'totalSpent',
        ],
        [
          this.budgetCategoryModel.sequelize!.fn(
            'COUNT',
            this.budgetCategoryModel.sequelize!.col('id'),
          ),
          'categoryCount',
        ],
      ],
      raw: true,
    });

    // Manual count for over-budget categories
    const categories = await this.budgetCategoryModel.findAll({
      where: { fiscalYear: currentYear, isActive: true },
    });

    const overBudget = categories.filter(
      (c) => Number(c.spentAmount) > Number(c.allocatedAmount),
    ).length;

    const totalAllocated = Number((result[0] as any).totalAllocated) || 0;
    const totalSpent = Number((result[0] as any).totalSpent) || 0;
    const totalRemaining = totalAllocated - totalSpent;
    const utilizationPercentage =
      totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

    return {
      fiscalYear: currentYear,
      totalAllocated,
      totalSpent,
      totalRemaining,
      utilizationPercentage: Math.round(utilizationPercentage * 100) / 100,
      categoryCount: parseInt((result[0] as any).categoryCount, 10) || 0,
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

    const where: any = {};
    where['$category.fiscalYear$'] = currentYear;

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const results = await this.budgetTransactionModel.findAll({
      where,
      include: [
        {
          model: this.budgetCategoryModel,
          as: 'category',
          attributes: [],
        },
      ],
      attributes: [
        [
          this.budgetTransactionModel.sequelize!.fn(
            'DATE_TRUNC',
            'month',
            this.budgetTransactionModel.sequelize!.col('transactionDate'),
          ),
          'month',
        ],
        [
          this.budgetTransactionModel.sequelize!.fn(
            'SUM',
            this.budgetTransactionModel.sequelize!.col('amount'),
          ),
          'totalSpent',
        ],
        [
          this.budgetTransactionModel.sequelize!.fn(
            'COUNT',
            this.budgetTransactionModel.sequelize!.col('id'),
          ),
          'transactionCount',
        ],
      ],
      group: [
        this.budgetTransactionModel.sequelize!.fn(
          'DATE_TRUNC',
          'month',
          this.budgetTransactionModel.sequelize!.col('transactionDate'),
        ),
      ],
      order: [
        [
          this.budgetTransactionModel.sequelize!.fn(
            'DATE_TRUNC',
            'month',
            this.budgetTransactionModel.sequelize!.col('transactionDate'),
          ),
          'ASC',
        ],
      ],
      raw: true,
    });

    return (results as any[]).map((result) => ({
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

    const categories = await this.budgetCategoryModel.findAll({
      where: { fiscalYear: currentYear, isActive: true },
      include: [
        {
          model: this.budgetTransactionModel,
          as: 'transactions',
          order: [['transactionDate', 'DESC']],
        },
      ],
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
          category.transactions = category.transactions.slice(0, 10) as any;
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
    const categories = await this.budgetCategoryModel.findAll({
      where: {
        name: categoryName,
        fiscalYear: years,
        isActive: true,
      },
      order: [['fiscalYear', 'ASC']],
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
      this.budgetCategoryModel.findAll({
        where: { fiscalYear: currentYear, isActive: true },
      }),
      this.budgetCategoryModel.findAll({
        where: { fiscalYear: previousYear, isActive: true },
      }),
    ]);

    return currentCategories.map(
      (current) => {
        const previous = previousCategories.find(
          (p) => p.name === current.name,
        );

        const currentAllocated = Number(current.allocatedAmount);
        const currentSpent = Number(current.spentAmount);
        const currentUtilization =
          currentAllocated > 0 ? (currentSpent / currentAllocated) * 100 : 0;

        let recommendation: BudgetRecommendationType =
          BudgetRecommendationType.MAINTAIN;
        let suggestedAmount = currentAllocated;
        let reason = 'Current allocation is appropriate';

        if (previous) {
          const previousSpent = Number(previous.spentAmount);
          const previousAllocated = Number(previous.allocatedAmount);
          const previousUtilization =
            previousAllocated > 0
              ? (previousSpent / previousAllocated) * 100
              : 0;

          // Over 90% utilization suggests need for increase
          if (currentUtilization > 90) {
            recommendation = BudgetRecommendationType.INCREASE;
            suggestedAmount = Math.ceil(currentSpent * 1.1); // 10% buffer
            reason = `High utilization (${Math.round(currentUtilization)}%) indicates budget pressure`;
          }
          // Under 60% utilization suggests potential decrease
          else if (currentUtilization < 60 && previousUtilization < 60) {
            recommendation = BudgetRecommendationType.DECREASE;
            suggestedAmount = Math.ceil(
              ((currentSpent + previousSpent) / 2) * 1.05,
            );
            reason = `Consistent low utilization (${Math.round(currentUtilization)}%) across years`;
          }
          // Trending upward spending
          else if (currentSpent > previousSpent * 1.2) {
            recommendation = BudgetRecommendationType.INCREASE;
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
