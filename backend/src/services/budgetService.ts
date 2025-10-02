import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

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

export class BudgetService {
  /**
   * Get budget categories for a fiscal year
   */
  static async getBudgetCategories(fiscalYear?: number, activeOnly: boolean = true) {
    try {
      const currentYear = fiscalYear || new Date().getFullYear();
      
      const where: any = { fiscalYear: currentYear };
      if (activeOnly) {
        where.isActive = true;
      }

      const categories = await prisma.budgetCategory.findMany({
        where,
        include: {
          transactions: {
            orderBy: { transactionDate: 'desc' },
            take: 5
          }
        },
        orderBy: { name: 'asc' }
      });

      // Calculate remaining and utilization for each category
      const enrichedCategories = categories.map(category => ({
        ...category,
        remainingAmount: Number(category.allocatedAmount) - Number(category.spentAmount),
        utilizationPercentage: Number(category.allocatedAmount) > 0 
          ? (Number(category.spentAmount) / Number(category.allocatedAmount)) * 100 
          : 0
      }));

      return enrichedCategories;
    } catch (error) {
      logger.error('Error fetching budget categories:', error);
      throw new Error('Failed to fetch budget categories');
    }
  }

  /**
   * Get budget category by ID
   */
  static async getBudgetCategoryById(id: string) {
    try {
      const category = await prisma.budgetCategory.findUnique({
        where: { id },
        include: {
          transactions: {
            orderBy: { transactionDate: 'desc' }
          }
        }
      });

      if (!category) {
        throw new Error('Budget category not found');
      }

      return {
        ...category,
        remainingAmount: Number(category.allocatedAmount) - Number(category.spentAmount),
        utilizationPercentage: Number(category.allocatedAmount) > 0 
          ? (Number(category.spentAmount) / Number(category.allocatedAmount)) * 100 
          : 0
      };
    } catch (error) {
      logger.error('Error fetching budget category:', error);
      throw error;
    }
  }

  /**
   * Create budget category
   */
  static async createBudgetCategory(data: CreateBudgetCategoryData) {
    try {
      // Check for duplicate category name in the same fiscal year
      const existing = await prisma.budgetCategory.findFirst({
        where: {
          name: data.name,
          fiscalYear: data.fiscalYear,
          isActive: true
        }
      });

      if (existing) {
        throw new Error('Budget category with this name already exists for this fiscal year');
      }

      const category = await prisma.budgetCategory.create({
        data
      });

      logger.info(`Budget category created: ${category.name} for FY${category.fiscalYear}`);
      return category;
    } catch (error) {
      logger.error('Error creating budget category:', error);
      throw error;
    }
  }

  /**
   * Update budget category
   */
  static async updateBudgetCategory(id: string, data: UpdateBudgetCategoryData) {
    try {
      const category = await prisma.budgetCategory.update({
        where: { id },
        data
      });

      logger.info(`Budget category updated: ${category.name}`);
      return category;
    } catch (error) {
      logger.error('Error updating budget category:', error);
      throw error;
    }
  }

  /**
   * Create budget transaction
   */
  static async createBudgetTransaction(data: CreateBudgetTransactionData) {
    try {
      // Verify category exists
      const category = await prisma.budgetCategory.findUnique({
        where: { id: data.categoryId }
      });

      if (!category) {
        throw new Error('Budget category not found');
      }

      // Check if transaction would exceed budget
      const newSpent = Number(category.spentAmount) + data.amount;
      if (newSpent > Number(category.allocatedAmount)) {
        logger.warn(`Transaction would exceed budget for ${category.name}: ${newSpent} > ${category.allocatedAmount}`);
      }

      // Create transaction and update category spent amount
      const [transaction] = await prisma.$transaction([
        prisma.budgetTransaction.create({
          data
        }),
        prisma.budgetCategory.update({
          where: { id: data.categoryId },
          data: {
            spentAmount: {
              increment: data.amount
            }
          }
        })
      ]);

      logger.info(`Budget transaction created: $${data.amount} for ${category.name}`);
      return transaction;
    } catch (error) {
      logger.error('Error creating budget transaction:', error);
      throw error;
    }
  }

  /**
   * Get budget summary for fiscal year
   */
  static async getBudgetSummary(fiscalYear?: number) {
    try {
      const currentYear = fiscalYear || new Date().getFullYear();

      const summary = await prisma.$queryRaw`
        SELECT 
          COALESCE(SUM("allocatedAmount"), 0) as totalAllocated,
          COALESCE(SUM("spentAmount"), 0) as totalSpent,
          COUNT(*) as categoryCount,
          COUNT(CASE WHEN "spentAmount" > "allocatedAmount" THEN 1 END) as overBudgetCount
        FROM budget_categories
        WHERE "fiscalYear" = ${currentYear}
        AND "isActive" = true
      `;

      const summaryData = (summary as any[])[0];

      return {
        fiscalYear: currentYear,
        totalAllocated: summaryData.totalAllocated,
        totalSpent: summaryData.totalSpent,
        totalRemaining: summaryData.totalAllocated - summaryData.totalSpent,
        utilizationPercentage: summaryData.totalAllocated > 0 
          ? (summaryData.totalSpent / summaryData.totalAllocated) * 100 
          : 0,
        categoryCount: summaryData.categoryCount,
        overBudgetCount: summaryData.overBudgetCount
      };
    } catch (error) {
      logger.error('Error getting budget summary:', error);
      throw error;
    }
  }

  /**
   * Get budget transactions with filters
   */
  static async getBudgetTransactions(
    page: number = 1,
    limit: number = 20,
    filters: {
      categoryId?: string;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ) {
    try {
      const skip = (page - 1) * limit;
      
      const where: any = {};
      
      if (filters.categoryId) {
        where.categoryId = filters.categoryId;
      }
      
      if (filters.startDate || filters.endDate) {
        where.transactionDate = {};
        if (filters.startDate) where.transactionDate.gte = filters.startDate;
        if (filters.endDate) where.transactionDate.lte = filters.endDate;
      }
      
      const [transactions, total] = await Promise.all([
        prisma.budgetTransaction.findMany({
          where,
          include: {
            category: true
          },
          skip,
          take: limit,
          orderBy: { transactionDate: 'desc' }
        }),
        prisma.budgetTransaction.count({ where })
      ]);

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
      throw new Error('Failed to fetch budget transactions');
    }
  }

  /**
   * Get spending trends over time
   */
  static async getSpendingTrends(fiscalYear?: number, categoryId?: string) {
    try {
      const currentYear = fiscalYear || new Date().getFullYear();
      
      const categoryFilter = categoryId ? `AND bc.id = '${categoryId}'` : '';

      const trends = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', bt."transactionDate") as month,
          SUM(bt.amount) as totalSpent,
          COUNT(*) as transactionCount
        FROM budget_transactions bt
        INNER JOIN budget_categories bc ON bt."categoryId" = bc.id
        WHERE bc."fiscalYear" = ${currentYear}
        ${categoryFilter}
        GROUP BY DATE_TRUNC('month', bt."transactionDate")
        ORDER BY month ASC
      `;

      return trends;
    } catch (error) {
      logger.error('Error getting spending trends:', error);
      throw error;
    }
  }
}
