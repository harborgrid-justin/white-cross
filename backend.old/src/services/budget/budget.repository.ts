
/**
 * @fileoverview Budget Repository
 * @module services/budget/repository
 * @description Data access layer for budget categories and transactions
 *
 * This repository provides all database operations for budget management,
 * including CRUD operations, complex queries, and aggregations for fiscal
 * year reporting and analysis.
 *
 * Key Features:
 * - Budget category CRUD operations
 * - Budget transaction management
 * - Fiscal year summaries and aggregations
 * - Spending trend analysis
 * - Over-budget category detection
 * - Year-over-year comparisons
 * - Transaction filtering and pagination
 *
 * @business All queries use fiscal year as primary filter
 * @business Active status used to soft-delete categories
 * @business Aggregations calculate totals, averages, and utilization
 *
 * @requires ../../database/models
 */

import { Op } from 'sequelize';
import {
  BudgetCategory,
  BudgetTransaction,
  sequelize
} from '../../database/models';

/**
 * Budget Repository - Data Access Layer
 *
 * @class BudgetRepository
 */
export class BudgetRepository {
  async getBudgetCategories(fiscalYear: number, activeOnly: boolean) {
    const whereClause: any = { fiscalYear: fiscalYear };
    if (activeOnly) {
      whereClause.isActive = true;
    }

    return await BudgetCategory.findAll({
      where: whereClause,
      include: [
        {
          model: BudgetTransaction,
          as: 'transactions',
          limit: 5,
          order: [['transactionDate', 'DESC']],
          separate: true
        }
      ],
      order: [['name', 'ASC']]
    });
  }

  async getBudgetCategoryById(id: string) {
    return await BudgetCategory.findByPk(id, {
      include: [
        {
          model: BudgetTransaction,
          as: 'transactions',
          order: [['transactionDate', 'DESC']]
        }
      ]
    });
  }

  async findBudgetCategory(where: any) {
    return await BudgetCategory.findOne({ where });
  }

  async createBudgetCategory(data: any) {
    return await BudgetCategory.create({
      ...data,
      spentAmount: 0
    });
  }

  async updateBudgetCategory(category: BudgetCategory, data: any) {
    return await category.update(data);
  }

  async deleteBudgetCategory(category: BudgetCategory) {
    return await category.update({ isActive: false });
  }

  async createBudgetTransaction(data: any, transaction: any) {
    return await BudgetTransaction.create(
      {
        ...data,
        transactionDate: new Date()
      },
      { transaction }
    );
  }

  async findBudgetTransactionById(id: string, transaction: any) {
    return await BudgetTransaction.findByPk(id, {
      include: [{ model: BudgetCategory, as: 'category' }],
      transaction
    });
  }

  async updateBudgetTransaction(budgetTransaction: BudgetTransaction, data: any, transaction: any) {
    return await budgetTransaction.update(data, { transaction });
  }

  async deleteBudgetTransaction(budgetTransaction: BudgetTransaction, transaction: any) {
    return await budgetTransaction.destroy({ transaction });
  }

  async getBudgetSummary(fiscalYear: number) {
    return await BudgetCategory.findAll({
      where: {
        fiscalYear: fiscalYear,
        isActive: true
      },
      attributes: [
        [sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('allocatedAmount')), 0), 'totalAllocated'],
        [sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('spentAmount')), 0), 'totalSpent'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'categoryCount']
      ],
      raw: true
    });
  }

  async countOverBudgetCategories(fiscalYear: number) {
    return await BudgetCategory.count({
      where: {
        fiscalYear: fiscalYear,
        isActive: true,
        [Op.and]: sequelize.where(
          sequelize.col('spentAmount'),
          Op.gt,
          sequelize.col('allocatedAmount')
        )
      }
    });
  }

  async getBudgetTransactions(page: number, limit: number, filters: any) {
    const offset = (page - 1) * limit;

    const whereClause: any = {};

    if (filters.categoryId) {
      whereClause.categoryId = filters.categoryId;
    }

    if (filters.startDate || filters.endDate) {
      whereClause.transactionDate = {};
      if (filters.startDate) {
        whereClause.transactionDate[Op.gte] = filters.startDate;
      }
      if (filters.endDate) {
        whereClause.transactionDate[Op.lte] = filters.endDate;
      }
    }

    return await BudgetTransaction.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: BudgetCategory,
          as: 'category',
          attributes: ['id', 'name', 'fiscalYear', 'allocatedAmount', 'spentAmount']
        }
      ],
      offset,
      limit,
      order: [['transactionDate', 'DESC']],
      distinct: true
    });
  }

  async getSpendingTrends(fiscalYear: number, categoryId?: string) {
    const whereClause: any = {
      '$category.fiscalYear$': fiscalYear
    };

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    return await BudgetTransaction.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('transactionDate')), 'month'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalSpent'],
        [sequelize.fn('COUNT', sequelize.col('BudgetTransaction.id')), 'transactionCount']
      ],
      include: [
        {
          model: BudgetCategory,
          as: 'category',
          attributes: [],
          required: true
        }
      ],
      where: whereClause,
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('transactionDate'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('transactionDate')), 'ASC']],
      raw: true
    });
  }

  async getCategoryYearComparison(categoryName: string, years: number[]) {
    return await BudgetCategory.findAll({
      where: {
        name: categoryName,
        fiscalYear: { [Op.in]: years },
        isActive: true
      },
      attributes: [
        'fiscalYear',
        'allocatedAmount',
        'spentAmount',
        [sequelize.literal('("allocatedAmount" - "spentAmount")'), 'remainingAmount'],
        [
          sequelize.literal(
            'CASE WHEN "allocatedAmount" > 0 THEN ("spentAmount" / "allocatedAmount" * 100) ELSE 0 END'
          ),
          'utilizationPercentage'
        ]
      ],
      order: [['fiscalYear', 'ASC']],
      raw: true
    });
  }

  async getOverBudgetCategories(fiscalYear: number) {
    return await BudgetCategory.findAll({
      where: {
        fiscalYear: fiscalYear,
        isActive: true,
        [Op.and]: sequelize.where(
          sequelize.col('spentAmount'),
          Op.gt,
          sequelize.col('allocatedAmount')
        )
      },
      include: [
        {
          model: BudgetTransaction,
          as: 'transactions',
          limit: 10,
          order: [['transactionDate', 'DESC']],
          separate: true
        }
      ],
      order: [
        [sequelize.literal('("spentAmount" - "allocatedAmount")'), 'DESC']
      ]
    });
  }

  async getBudgetCategoriesForRecommendations(fiscalYear: number) {
    return await BudgetCategory.findAll({
      where: { fiscalYear: fiscalYear, isActive: true },
      attributes: ['name', 'allocatedAmount', 'spentAmount']
    });
  }
}

export const budgetRepository = new BudgetRepository();
