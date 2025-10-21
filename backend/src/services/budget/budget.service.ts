
import { logger } from '../../utils/logger';
import { handleSequelizeError } from '../../utils/sequelizeErrorHandler';
import {
  BudgetCategory,
  BudgetTransaction,
  sequelize
} from '../../database/models';
import { budgetRepository } from './budget.repository';

export interface CreateBudgetCategoryData {
  name: string;
  description?: string;
  fiscalYear: number;
  allocatedAmount: number;
}

export interface UpdateBudgetCategoryData {
  name?: string;
  description?: string;
  allocatedAmount?: number;
  isActive?: boolean;
}

export interface CreateBudgetTransactionData {
  categoryId: string;
  amount: number;
  description: string;
  referenceId?: string;
  referenceType?: string;
  notes?: string;
}

export interface BudgetCategoryWithMetrics {
  id: string;
  name: string;
  description?: string;
  fiscalYear: number;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  utilizationPercentage: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  transactions?: BudgetTransaction[];
}

export interface BudgetSummary {
  fiscalYear: number;
  totalAllocated: number;
  totalSpent: number;
  totalRemaining: number;
  utilizationPercentage: number;
  categoryCount: number;
  overBudgetCount: number;
}

export interface BudgetTransactionFilters {
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface SpendingTrend {
  month: Date;
  totalSpent: number;
  transactionCount: number;
}

export class BudgetService {
  /**
   * Get budget categories for a fiscal year with optional filtering
   * @param fiscalYear - The fiscal year to filter by (defaults to current year)
   * @param activeOnly - Whether to return only active categories
   * @returns Array of budget categories with calculated metrics
   */
  static async getBudgetCategories(
    fiscalYear?: number,
    activeOnly: boolean = true
  ): Promise<BudgetCategoryWithMetrics[]> {
    try {
      const currentYear = fiscalYear || new Date().getFullYear();

      const categories = await budgetRepository.getBudgetCategories(currentYear, activeOnly);

      // Calculate remaining and utilization for each category
      const enrichedCategories: BudgetCategoryWithMetrics[] = categories.map((category) => {
        const allocated = Number(category.allocatedAmount);
        const spent = Number(category.spentAmount);
        const remaining = allocated - spent;
        const utilization = allocated > 0 ? (spent / allocated) * 100 : 0;

        return {
          ...category.get({ plain: true }),
          remainingAmount: remaining,
          utilizationPercentage: Math.round(utilization * 100) / 100 // Round to 2 decimals
        };
      });

      return enrichedCategories;
    } catch (error) {
      logger.error('Error fetching budget categories:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Get budget category by ID with all transactions
   * @param id - Budget category ID
   * @returns Budget category with metrics and full transaction list
   */
  static async getBudgetCategoryById(id: string): Promise<BudgetCategoryWithMetrics> {
    try {
      const category = await budgetRepository.getBudgetCategoryById(id);

      if (!category) {
        throw new Error('Budget category not found');
      }

      const allocated = Number(category.allocatedAmount);
      const spent = Number(category.spentAmount);
      const remaining = allocated - spent;
      const utilization = allocated > 0 ? (spent / allocated) * 100 : 0;

      return {
        ...category.get({ plain: true }),
        remainingAmount: remaining,
        utilizationPercentage: Math.round(utilization * 100) / 100
      };
    } catch (error) {
      logger.error('Error fetching budget category:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Create a new budget category
   * @param data - Budget category creation data
   * @returns Created budget category
   */
  static async createBudgetCategory(data: CreateBudgetCategoryData): Promise<BudgetCategory> {
    try {
      // Check for duplicate category name in the same fiscal year
      const existing = await budgetRepository.findBudgetCategory({
        name: data.name,
        fiscalYear: data.fiscalYear,
        isActive: true
      });

      if (existing) {
        throw new Error('Budget category with this name already exists for this fiscal year');
      }

      const category = await budgetRepository.createBudgetCategory(data);

      logger.info(`Budget category created: ${category.name} for FY${category.fiscalYear}`);
      return category;
    } catch (error) {
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Update budget category
   * @param id - Budget category ID
   * @param data - Fields to update
   * @returns Updated budget category
   */
  static async updateBudgetCategory(
    id: string,
    data: UpdateBudgetCategoryData
  ): Promise<BudgetCategory> {
    try {
      const category = await budgetRepository.getBudgetCategoryById(id);

      if (!category) {
        throw new Error('Budget category not found');
      }

      // If changing name, check for duplicates in the same fiscal year
      if (data.name && data.name !== category.name) {
        const existing = await budgetRepository.findBudgetCategory({
          name: data.name,
          fiscalYear: category.fiscalYear,
          isActive: true,
          id: { [Symbol.for('Op.ne')]: id } // Using Symbol for Op.ne
        });

        if (existing) {
          throw new Error('Budget category with this name already exists for this fiscal year');
        }
      }

      await budgetRepository.updateBudgetCategory(category, data);

      logger.info(`Budget category updated: ${category.name}`);
      return category;
    } catch (error) {
      logger.error('Error updating budget category:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Delete (soft delete) budget category
   * @param id - Budget category ID
   * @returns Success status
   */
  static async deleteBudgetCategory(id: string): Promise<{ success: boolean }> {
    try {
      const category = await budgetRepository.getBudgetCategoryById(id);

      if (!category) {
        throw new Error('Budget category not found');
      }

      // Soft delete by marking as inactive
      await budgetRepository.deleteBudgetCategory(category);

      logger.info(`Budget category deleted (soft): ${category.name}`);
      return { success: true };
    } catch (error) {
      logger.error('Error deleting budget category:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Create budget transaction with automatic spent amount update
   * @param data - Transaction data
   * @returns Created transaction with category information
   */
  static async createBudgetTransaction(
    data: CreateBudgetTransactionData
  ): Promise<BudgetTransaction> {
    const transaction = await sequelize.transaction();

    try {
      // Verify category exists
      const category = await budgetRepository.getBudgetCategoryById(data.categoryId);

      if (!category) {
        await transaction.rollback();
        throw new Error('Budget category not found');
      }

      if (!category.isActive) {
        await transaction.rollback();
        throw new Error('Cannot add transactions to inactive budget category');
      }

      // Check if transaction would exceed budget
      const newSpent = Number(category.spentAmount) + data.amount;
      const allocated = Number(category.allocatedAmount);

      if (newSpent > allocated) {
        logger.warn(
          `Transaction would exceed budget for ${category.name}: $${newSpent} > $${allocated}`
        );
      }

      // Create transaction
      const budgetTransaction = await budgetRepository.createBudgetTransaction(data, transaction);

      // Update category spent amount
      await budgetRepository.updateBudgetCategory(category, {
        spentAmount: Number(category.spentAmount) + data.amount
      });

      await transaction.commit();

      // Reload with associations
      await budgetTransaction.reload({
        include: [
          {
            model: BudgetCategory,
            as: 'category'
          }
        ]
      });

      logger.info(`Budget transaction created: $${data.amount} for ${category.name}`);
      return budgetTransaction;
    } catch (error) {
      await transaction.rollback();
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Update budget transaction
   * @param id - Transaction ID
   * @param data - Fields to update
   * @returns Updated transaction
   */
  static async updateBudgetTransaction(
    id: string,
    data: Partial<CreateBudgetTransactionData>
  ): Promise<BudgetTransaction> {
    const transaction = await sequelize.transaction();

    try {
      const budgetTransaction = await budgetRepository.findBudgetTransactionById(id, transaction);

      if (!budgetTransaction) {
        await transaction.rollback();
        throw new Error('Budget transaction not found');
      }

      const oldAmount = Number(budgetTransaction.amount);
      const newAmount = data.amount !== undefined ? data.amount : oldAmount;
      const amountDifference = newAmount - oldAmount;

      // If amount changed, update category spent amount
      if (amountDifference !== 0) {
        const category = await budgetRepository.getBudgetCategoryById(budgetTransaction.categoryId);

        if (category) {
          await budgetRepository.updateBudgetCategory(category,
            {
              spentAmount: Number(category.spentAmount) + amountDifference
            }
          );
        }
      }

      await budgetRepository.updateBudgetTransaction(budgetTransaction, data, transaction);

      await transaction.commit();

      // Reload with associations
      await budgetTransaction.reload({
        include: [
          {
            model: BudgetCategory,
            as: 'category'
          }
        ]
      });

      logger.info(`Budget transaction updated: ${budgetTransaction.id}`);
      return budgetTransaction;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error updating budget transaction:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Delete budget transaction
   * @param id - Transaction ID
   * @returns Success status
   */
  static async deleteBudgetTransaction(id: string): Promise<{ success: boolean }> {
    const transaction = await sequelize.transaction();

    try {
      const budgetTransaction = await budgetRepository.findBudgetTransactionById(id, transaction);

      if (!budgetTransaction) {
        await transaction.rollback();
        throw new Error('Budget transaction not found');
      }

      const amount = Number(budgetTransaction.amount);

      // Update category spent amount
      const category = await budgetRepository.getBudgetCategoryById(budgetTransaction.categoryId);

      if (category) {
        await budgetRepository.updateBudgetCategory(category,
          {
            spentAmount: Math.max(0, Number(category.spentAmount) - amount)
          }
        );
      }

      await budgetRepository.deleteBudgetTransaction(budgetTransaction, transaction);

      await transaction.commit();

      logger.info(`Budget transaction deleted: ${id} ($${amount})`);
      return { success: true };
    } catch (error) {
      await transaction.rollback();
      logger.error('Error deleting budget transaction:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Get comprehensive budget summary for a fiscal year
   * @param fiscalYear - The fiscal year (defaults to current year)
   * @returns Budget summary with aggregated metrics
   */
  static async getBudgetSummary(fiscalYear?: number): Promise<BudgetSummary> {
    try {
      const currentYear = fiscalYear || new Date().getFullYear();

      // Use Sequelize aggregate functions instead of raw SQL
      const categories = await budgetRepository.getBudgetSummary(currentYear);

      const summaryData = categories[0] as any;

      // Count over-budget categories separately
      const overBudgetCount = await budgetRepository.countOverBudgetCategories(currentYear);

      const totalAllocated = Number(summaryData.totalAllocated) || 0;
      const totalSpent = Number(summaryData.totalSpent) || 0;
      const totalRemaining = totalAllocated - totalSpent;
      const utilizationPercentage = totalAllocated > 0
        ? (totalSpent / totalAllocated) * 100
        : 0;

      return {
        fiscalYear: currentYear,
        totalAllocated,
        totalSpent,
        totalRemaining,
        utilizationPercentage: Math.round(utilizationPercentage * 100) / 100,
        categoryCount: parseInt(summaryData.categoryCount, 10) || 0,
        overBudgetCount
      };
    } catch (error) {
      logger.error('Error getting budget summary:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Get budget transactions with pagination and filters
   * @param page - Page number (1-indexed)
   * @param limit - Items per page
   * @param filters - Optional filters for category, date range
   * @returns Paginated transaction list
   */
  static async getBudgetTransactions(
    page: number = 1,
    limit: number = 20,
    filters: BudgetTransactionFilters = {}
  ) {
    try {
      const { rows: transactions, count: total } = await budgetRepository.getBudgetTransactions(page, limit, filters);

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
      logger.error('Error fetching budget transactions:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Get spending trends by month for analysis
   * @param fiscalYear - The fiscal year to analyze
   * @param categoryId - Optional category filter
   * @returns Monthly spending trends with transaction counts
   */
  static async getSpendingTrends(
    fiscalYear?: number,
    categoryId?: string
  ): Promise<SpendingTrend[]> {
    try {
      const currentYear = fiscalYear || new Date().getFullYear();

      const trends = await budgetRepository.getSpendingTrends(currentYear, categoryId);

      return trends.map((trend: any) => ({
        month: new Date(trend.month),
        totalSpent: Number(trend.totalSpent),
        transactionCount: parseInt(trend.transactionCount, 10)
      }));
    } catch (error) {
      logger.error('Error getting spending trends:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Get category spending comparison across fiscal years
   * @param categoryName - Category name to compare
   * @param years - Array of fiscal years to compare
   * @returns Spending comparison data
   */
  static async getCategoryYearComparison(
    categoryName: string,
    years: number[]
  ) {
    try {
      const categories = await budgetRepository.getCategoryYearComparison(categoryName, years);

      return categories.map((cat: any) => ({
        fiscalYear: cat.fiscalYear,
        allocatedAmount: Number(cat.allocatedAmount),
        spentAmount: Number(cat.spentAmount),
        remainingAmount: Number(cat.remainingAmount),
        utilizationPercentage: Math.round(Number(cat.utilizationPercentage) * 100) / 100
      }));
    } catch (error) {
      logger.error('Error getting category year comparison:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Get over-budget categories for a fiscal year
   * @param fiscalYear - The fiscal year to check
   * @returns List of categories that exceeded their budget
   */
  static async getOverBudgetCategories(fiscalYear?: number) {
    try {
      const currentYear = fiscalYear || new Date().getFullYear();

      const categories = await budgetRepository.getOverBudgetCategories(currentYear);

      return categories.map((category) => {
        const allocated = Number(category.allocatedAmount);
        const spent = Number(category.spentAmount);
        const overAmount = spent - allocated;
        const overPercentage = (overAmount / allocated) * 100;

        return {
          ...category.get({ plain: true }),
          overAmount,
          overPercentage: Math.round(overPercentage * 100) / 100
        };
      });
    } catch (error) {
      logger.error('Error getting over-budget categories:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Get budget allocation recommendations based on historical spending
   * @param fiscalYear - The fiscal year to analyze
   * @returns Recommendations for budget allocation
   */
  static async getBudgetRecommendations(fiscalYear?: number) {
    try {
      const currentYear = fiscalYear || new Date().getFullYear();
      const previousYear = currentYear - 1;

      const [currentCategories, previousCategories] = await Promise.all([
        budgetRepository.getBudgetCategoriesForRecommendations(currentYear),
        budgetRepository.getBudgetCategoriesForRecommendations(previousYear)
      ]);

      const recommendations = currentCategories.map((current) => {
        const previous = previousCategories.find((p) => p.name === current.name);

        const currentAllocated = Number(current.allocatedAmount);
        const currentSpent = Number(current.spentAmount);
        const currentUtilization = currentAllocated > 0
          ? (currentSpent / currentAllocated) * 100
          : 0;

        let recommendation = 'MAINTAIN';
        let suggestedAmount = currentAllocated;
        let reason = 'Current allocation is appropriate';

        if (previous) {
          const previousSpent = Number(previous.spentAmount);
          const previousAllocated = Number(previous.allocatedAmount);
          const previousUtilization = previousAllocated > 0
            ? (previousSpent / previousAllocated) * 100
            : 0;

          // Over 90% utilization suggests need for increase
          if (currentUtilization > 90) {
            recommendation = 'INCREASE';
            suggestedAmount = Math.ceil(currentSpent * 1.1); // 10% buffer
            reason = `High utilization (${Math.round(currentUtilization)}%) indicates budget pressure`;
          }
          // Under 60% utilization suggests potential decrease
          else if (currentUtilization < 60 && previousUtilization < 60) {
            recommendation = 'DECREASE';
            suggestedAmount = Math.ceil((currentSpent + previousSpent) / 2 * 1.05); // Average + 5%
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
          reason
        };
      });

      return recommendations;
    } catch (error) {
      logger.error('Error generating budget recommendations:', error);
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Export budget data for a fiscal year
   * @param fiscalYear - The fiscal year to export
   * @returns Complete budget data with categories and transactions
   */
  static async exportBudgetData(fiscalYear?: number) {
    try {
      const currentYear = fiscalYear || new Date().getFullYear();

      const [categories, summary] = await Promise.all([
        this.getBudgetCategories(currentYear, false),
        this.getBudgetSummary(currentYear)
      ]);

      const exportData = {
        exportDate: new Date().toISOString(),
        fiscalYear: currentYear,
        summary,
        categories: await Promise.all(
          categories.map(async (category) => {
            const transactions = await budgetRepository.getBudgetTransactions(1, 1000000, { categoryId: category.id }); // Assuming a large enough limit for export

            return {
              ...category,
              transactions: transactions.transactions.map((t) => t.get({ plain: true }))
            };
          })
        )
      };

      logger.info(`Budget data exported for FY${currentYear}`);
      return exportData;
    } catch (error) {
      logger.error('Error exporting budget data:', error);
      throw handleSequelizeError(error as Error);
    }
  }
}
