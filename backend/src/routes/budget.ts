/**
 * LOC: 63286DA2D6
 * WC-RTE-BUD-030 | Budget Management & Financial Tracking API Routes
 *
 * UPSTREAM (imports from):
 *   - budgetService.ts (services/budgetService.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (index.ts)
 */

/**
 * WC-RTE-BUD-030 | Budget Management & Financial Tracking API Routes
 * Purpose: Comprehensive budget management system with category management, transaction tracking, spending analysis, and fiscal year reporting
 * Upstream: ../services/budgetService, JWT authentication | Dependencies: @hapi/hapi, budget service, joi validation
 * Downstream: Financial dashboard, budget reporting, administrative interface | Called by: Budget management components, financial reporting systems
 * Related: Administration routes, purchase order management, vendor management
 * Exports: budgetRoutes (8 route handlers) | Key Services: Budget categories, transactions, spending trends, fiscal year summaries
 * Last Updated: 2025-10-18 | File Type: .ts | Security: JWT authentication required for all endpoints
 * Critical Path: Auth validation → Budget service operations → Financial data processing → Response formatting
 * LLM Context: Healthcare organization budget management system with fiscal year tracking, spending category organization, transaction logging, and comprehensive financial reporting for school district and healthcare facility budget oversight
 */

import { ServerRoute } from '@hapi/hapi';
import { BudgetService } from '../services/budgetService';
import Joi from 'joi';

// Get budget categories
const getBudgetCategoriesHandler = async (request: any, h: any) => {
  try {
    const fiscalYear = request.query.fiscalYear ? parseInt(request.query.fiscalYear) : undefined;
    const activeOnly = request.query.activeOnly !== 'false';

    const categories = await BudgetService.getBudgetCategories(fiscalYear, activeOnly);

    return h.response({
      success: true,
      data: { categories }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get budget category by ID
const getBudgetCategoryByIdHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const category = await BudgetService.getBudgetCategoryById(id);

    return h.response({
      success: true,
      data: { category }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(404);
  }
};

// Create budget category
const createBudgetCategoryHandler = async (request: any, h: any) => {
  try {
    const category = await BudgetService.createBudgetCategory(request.payload);

    return h.response({
      success: true,
      data: { category }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Update budget category
const updateBudgetCategoryHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const category = await BudgetService.updateBudgetCategory(id, request.payload);

    return h.response({
      success: true,
      data: { category }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Get budget summary
const getBudgetSummaryHandler = async (request: any, h: any) => {
  try {
    const fiscalYear = request.query.fiscalYear ? parseInt(request.query.fiscalYear) : undefined;
    const summary = await BudgetService.getBudgetSummary(fiscalYear);

    return h.response({
      success: true,
      data: { summary }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get budget transactions
const getBudgetTransactionsHandler = async (request: any, h: any) => {
  try {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;

    const filters: any = {};
    if (request.query.categoryId) filters.categoryId = request.query.categoryId;
    if (request.query.startDate) filters.startDate = new Date(request.query.startDate);
    if (request.query.endDate) filters.endDate = new Date(request.query.endDate);

    const result = await BudgetService.getBudgetTransactions(page, limit, filters);

    return h.response({
      success: true,
      data: result
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Create budget transaction
const createBudgetTransactionHandler = async (request: any, h: any) => {
  try {
    const transaction = await BudgetService.createBudgetTransaction(request.payload);

    return h.response({
      success: true,
      data: { transaction }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Get spending trends
const getSpendingTrendsHandler = async (request: any, h: any) => {
  try {
    const fiscalYear = request.query.fiscalYear ? parseInt(request.query.fiscalYear) : undefined;
    const categoryId = request.query.categoryId;

    const trends = await BudgetService.getSpendingTrends(fiscalYear, categoryId);

    return h.response({
      success: true,
      data: { trends }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Define budget routes for Hapi
export const budgetRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/budget/categories',
    handler: getBudgetCategoriesHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          fiscalYear: Joi.number().integer().min(2000).max(2100).optional(),
          activeOnly: Joi.boolean().default(true)
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/budget/categories/{id}',
    handler: getBudgetCategoryByIdHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/budget/categories',
    handler: createBudgetCategoryHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          name: Joi.string().trim().required(),
          fiscalYear: Joi.number().integer().min(2000).max(2100).required(),
          allocatedAmount: Joi.number().required()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/budget/categories/{id}',
    handler: updateBudgetCategoryHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          name: Joi.string().trim().optional(),
          allocatedAmount: Joi.number().optional(),
          isActive: Joi.boolean().optional()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/budget/summary',
    handler: getBudgetSummaryHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          fiscalYear: Joi.number().integer().min(2000).max(2100).optional()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/budget/transactions',
    handler: getBudgetTransactionsHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(100).default(20),
          categoryId: Joi.string().optional(),
          startDate: Joi.date().iso().optional(),
          endDate: Joi.date().iso().optional()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/budget/transactions',
    handler: createBudgetTransactionHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          categoryId: Joi.string().required(),
          amount: Joi.number().required(),
          description: Joi.string().trim().required()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/budget/trends',
    handler: getSpendingTrendsHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          fiscalYear: Joi.number().integer().min(2000).max(2100).optional(),
          categoryId: Joi.string().optional()
        })
      }
    }
  }
];
