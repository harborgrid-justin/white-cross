/**
 * WF-COMP-272 | budgetApi.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../config/apiConfig, ../types | Dependencies: ../config/apiConfig, ../types, zod
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, constants, classes | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Budget Management API
 * Enterprise-grade API client for fiscal year budgeting, spending tracking, and financial analytics
 */

import type { ApiClient } from '../core/ApiClient';
import { apiClient } from '../core/ApiClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import { ApiResponse, PaginatedResponse } from '../types';
import { z } from 'zod';
import { createApiError, createValidationError } from '../core/errors';
import type {
  BudgetCategory,
  BudgetTransaction,
  BudgetCategoryWithMetrics,
  BudgetSummary,
  SpendingTrend,
  CategoryYearComparison,
  OverBudgetCategory,
  BudgetRecommendationItem,
  BudgetExportData,
  CreateBudgetCategoryRequest,
  UpdateBudgetCategoryRequest,
  CreateBudgetTransactionRequest,
  UpdateBudgetTransactionRequest,
  BudgetTransactionFilters,
  BudgetCategoryParams,
  BudgetCategoriesResponse,
  BudgetTransactionsResponse,
  SpendingTrendsResponse,
  CategoryComparisonResponse,
  OverBudgetCategoriesResponse,
  BudgetRecommendationsResponse,
} from '../../types/budget';
import { BudgetRecommendation } from '../../types/budget';

// =====================
// VALIDATION SCHEMAS
// =====================

const createBudgetCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  fiscalYear: z.number().int().min(2000).max(2100, 'Invalid fiscal year'),
  allocatedAmount: z.number().nonnegative('Allocated amount must be non-negative'),
});

const updateBudgetCategorySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  allocatedAmount: z.number().nonnegative().optional(),
  isActive: z.boolean().optional(),
});

const createBudgetTransactionSchema = z.object({
  categoryId: z.string().uuid('Invalid category ID'),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
  referenceId: z.string().optional(),
  referenceType: z.string().optional(),
  notes: z.string().optional(),
});

const updateBudgetTransactionSchema = z.object({
  amount: z.number().positive().optional(),
  description: z.string().min(1).optional(),
  notes: z.string().optional(),
});

// =====================
// BUDGET API CLASS
// =====================

/**
 * Budget API Client
 * Provides comprehensive budget management and fiscal tracking functionality
 */
export class BudgetApi {
  constructor(private readonly client: ApiClient) {}
  /**
   * Get budget categories for a fiscal year
   */
  async getBudgetCategories(params: BudgetCategoryParams = {}): Promise<BudgetCategoryWithMetrics[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params.fiscalYear) queryParams.append('fiscalYear', String(params.fiscalYear));
      if (params.activeOnly !== undefined) queryParams.append('activeOnly', String(params.activeOnly));

      const response = await this.client.get<ApiResponse<BudgetCategoriesResponse>>(
        `${API_ENDPOINTS.BUDGET.CATEGORIES}?${queryParams.toString()}`
      );

      if (!response.data.data) {
        throw new Error('Invalid response from server');
      }
      return response.data.data.categories;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch budget categories');
    }
  }

  /**
   * Get budget category by ID with all transactions
   */
  async getBudgetCategoryById(id: string): Promise<BudgetCategoryWithMetrics> {
    try {
      if (!id) throw new Error('Budget category ID is required');

      const response = await this.client.get<ApiResponse<{ category: BudgetCategoryWithMetrics }>>(
        API_ENDPOINTS.BUDGET.CATEGORY_BY_ID(id)
      );

      if (!response.data.data) {
        throw new Error('Invalid response from server');
      }
      return response.data.data.category;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch budget category');
    }
  }

  /**
   * Create new budget category
   */
  async createBudgetCategory(data: CreateBudgetCategoryRequest): Promise<BudgetCategory> {
    try {
      createBudgetCategorySchema.parse(data);

      const response = await this.client.post<ApiResponse<{ category: BudgetCategory }>>(
        API_ENDPOINTS.BUDGET.CATEGORIES,
        data
      );

      if (!response.data.data) {
        throw new Error('Invalid response from server');
      }
      return response.data.data.category;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to create budget category');
    }
  }

  /**
   * Update budget category
   */
  async updateBudgetCategory(id: string, data: UpdateBudgetCategoryRequest): Promise<BudgetCategory> {
    try {
      if (!id) throw new Error('Budget category ID is required');
      updateBudgetCategorySchema.parse(data);

      const response = await this.client.put<ApiResponse<{ category: BudgetCategory }>>(
        API_ENDPOINTS.BUDGET.CATEGORY_BY_ID(id),
        data
      );

      if (!response.data.data) {
        throw new Error('Invalid response from server');
      }
      return response.data.data.category;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to update budget category');
    }
  }

  /**
   * Delete budget category (soft delete)
   */
  async deleteBudgetCategory(id: string): Promise<{ success: boolean }> {
    try {
      if (!id) throw new Error('Budget category ID is required');

      await this.client.delete<ApiResponse<{ success: boolean }>>(
        API_ENDPOINTS.BUDGET.CATEGORY_BY_ID(id)
      );

      return { success: true };
    } catch (error) {
      throw createApiError(error, 'Failed to delete budget category');
    }
  }

  /**
   * Get comprehensive budget summary for a fiscal year
   */
  async getBudgetSummary(fiscalYear?: number): Promise<BudgetSummary> {
    try {
      const params = fiscalYear ? `?fiscalYear=${fiscalYear}` : '';

      const response = await this.client.get<ApiResponse<{ summary: BudgetSummary }>>(
        `${API_ENDPOINTS.BUDGET.SUMMARY}${params}`
      );

      if (!response.data.data) {
        throw new Error('Invalid response from server');
      }
      return response.data.data.summary;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch budget summary');
    }
  }

  /**
   * Get budget transactions with pagination and filters
   */
  async getBudgetTransactions(
    page: number = 1,
    limit: number = 20,
    filters: BudgetTransactionFilters = {}
  ): Promise<BudgetTransactionsResponse> {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await this.client.get<ApiResponse<BudgetTransactionsResponse>>(
        `${API_ENDPOINTS.BUDGET.TRANSACTIONS}?${params.toString()}`
      );

      if (!response.data.data) {
        throw new Error('Invalid response from server');
      }
      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch budget transactions');
    }
  }

  /**
   * Create budget transaction with automatic spent amount update
   */
  async createBudgetTransaction(data: CreateBudgetTransactionRequest): Promise<BudgetTransaction> {
    try {
      createBudgetTransactionSchema.parse(data);

      const response = await this.client.post<ApiResponse<{ transaction: BudgetTransaction }>>(
        API_ENDPOINTS.BUDGET.TRANSACTIONS,
        data
      );

      if (!response.data.data) {
        throw new Error('Invalid response from server');
      }
      return response.data.data.transaction;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to create budget transaction');
    }
  }

  /**
   * Update budget transaction
   */
  async updateBudgetTransaction(
    id: string,
    data: UpdateBudgetTransactionRequest
  ): Promise<BudgetTransaction> {
    try {
      if (!id) throw new Error('Budget transaction ID is required');
      updateBudgetTransactionSchema.parse(data);

      const response = await this.client.put<ApiResponse<{ transaction: BudgetTransaction }>>(
        API_ENDPOINTS.BUDGET.TRANSACTION_BY_ID(id),
        data
      );

      if (!response.data.data) {
        throw new Error('Invalid response from server');
      }
      return response.data.data.transaction;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError(
          error.issues[0]?.message || 'Validation error',
          error.issues[0]?.path.join('.'),
          error.issues.reduce((acc: Record<string, string[]>, err: z.ZodIssue) => {
            const path = err.path.join('.');
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<string, string[]>),
          error
        );
      }
      throw createApiError(error, 'Failed to update budget transaction');
    }
  }

  /**
   * Delete budget transaction
   */
  async deleteBudgetTransaction(id: string): Promise<{ success: boolean }> {
    try {
      if (!id) throw new Error('Budget transaction ID is required');

      await this.client.delete<ApiResponse<{ success: boolean }>>(
        API_ENDPOINTS.BUDGET.TRANSACTION_BY_ID(id)
      );

      return { success: true };
    } catch (error) {
      throw createApiError(error, 'Failed to delete budget transaction');
    }
  }

  // =====================
  // ANALYTICS & REPORTING
  // =====================

  /**
   * Get spending trends by month for analysis
   */
  async getSpendingTrends(fiscalYear?: number, categoryId?: string): Promise<SpendingTrend[]> {
    try {
      const params = new URLSearchParams();
      if (fiscalYear) params.append('fiscalYear', String(fiscalYear));
      if (categoryId) params.append('categoryId', categoryId);

      const response = await this.client.get<ApiResponse<SpendingTrendsResponse>>(
        `${API_ENDPOINTS.BUDGET.TRENDS}?${params.toString()}`
      );

      if (!response.data.data) {
        throw new Error('Invalid response from server');
      }
      return response.data.data.trends;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch spending trends');
    }
  }

  /**
   * Get category spending comparison across fiscal years
   */
  async getCategoryYearComparison(
    categoryName: string,
    years: number[]
  ): Promise<CategoryYearComparison[]> {
    try {
      if (!categoryName) throw new Error('Category name is required');
      if (!years || years.length === 0) throw new Error('Years array is required');

      const response = await this.client.post<ApiResponse<CategoryComparisonResponse>>(
        API_ENDPOINTS.BUDGET.YEAR_COMPARISON,
        { categoryName, years }
      );

      if (!response.data.data) {
        throw new Error('Invalid response from server');
      }
      return response.data.data.comparison;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch category year comparison');
    }
  }

  /**
   * Get over-budget categories for a fiscal year
   */
  async getOverBudgetCategories(fiscalYear?: number): Promise<OverBudgetCategoriesResponse> {
    try {
      const params = fiscalYear ? `?fiscalYear=${fiscalYear}` : '';

      const response = await this.client.get<ApiResponse<OverBudgetCategoriesResponse>>(
        `${API_ENDPOINTS.BUDGET.OVER_BUDGET}${params}`
      );

      if (!response.data.data) {
        throw new Error('Invalid response from server');
      }
      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch over-budget categories');
    }
  }

  /**
   * Get budget allocation recommendations based on historical spending
   */
  async getBudgetRecommendations(fiscalYear?: number): Promise<BudgetRecommendationItem[]> {
    try {
      const params = fiscalYear ? `?fiscalYear=${fiscalYear}` : '';

      const response = await this.client.get<ApiResponse<BudgetRecommendationsResponse>>(
        `${API_ENDPOINTS.BUDGET.RECOMMENDATIONS}${params}`
      );

      if (!response.data.data) {
        throw new Error('Invalid response from server');
      }
      return response.data.data.recommendations;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch budget recommendations');
    }
  }

  /**
   * Export budget data for a fiscal year
   */
  async exportBudgetData(fiscalYear?: number): Promise<BudgetExportData> {
    try {
      const params = fiscalYear ? `?fiscalYear=${fiscalYear}` : '';

      const response = await this.client.get<ApiResponse<BudgetExportData>>(
        `${API_ENDPOINTS.BUDGET.EXPORT}${params}`
      );

      if (!response.data.data) {
        throw new Error('Invalid response from server');
      }
      return response.data.data;
    } catch (error) {
      throw createApiError(error, 'Failed to export budget data');
    }
  }

  // =====================
  // UTILITY METHODS
  // =====================

  /**
   * Get current fiscal year
   */
  getCurrentFiscalYear(): number {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    // Assuming fiscal year starts in July (month 6)
    return month >= 6 ? year + 1 : year;
  }

  /**
   * Get fiscal years for dropdown/selection
   */
  getFiscalYearOptions(range: number = 5): number[] {
    const currentYear = this.getCurrentFiscalYear();
    const years: number[] = [];

    for (let i = range; i >= -range; i--) {
      years.push(currentYear - i);
    }

    return years;
  }

  /**
   * Calculate utilization percentage
   */
  calculateUtilization(category: BudgetCategory): number {
    if (category.allocatedAmount === 0) return 0;
    return (category.spentAmount / category.allocatedAmount) * 100;
  }

  /**
   * Check if category is over budget
   */
  isOverBudget(category: BudgetCategory): boolean {
    return category.spentAmount > category.allocatedAmount;
  }

  /**
   * Check if category is approaching limit (>90% utilization)
   */
  isApproachingLimit(category: BudgetCategoryWithMetrics): boolean {
    return category.utilizationPercentage > 90 && category.utilizationPercentage <= 100;
  }

  /**
   * Format currency for display
   */
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  }

  /**
   * Format percentage for display
   */
  formatPercentage(percentage: number): string {
    return `${percentage.toFixed(2)}%`;
  }

  /**
   * Get budget status badge color
   */
  getStatusColor(utilizationPercentage: number): string {
    if (utilizationPercentage > 110) return 'critical'; // Over 110%
    if (utilizationPercentage > 100) return 'error'; // Over budget
    if (utilizationPercentage > 90) return 'warning'; // Approaching limit
    if (utilizationPercentage > 60) return 'success'; // On track
    return 'info'; // Under budget
  }

  /**
   * Get recommendation badge color
   */
  getRecommendationColor(recommendation: BudgetRecommendation): string {
    switch (recommendation) {
      case BudgetRecommendation.INCREASE:
        return 'warning';
      case BudgetRecommendation.DECREASE:
        return 'info';
      case BudgetRecommendation.MAINTAIN:
      default:
        return 'success';
    }
  }
}

export function createBudgetApi(client: ApiClient): BudgetApi {
  return new BudgetApi(client);
}

/**
 * Singleton instance of BudgetApi
 * Pre-configured with the default apiClient
 */
export const budgetApi = createBudgetApi(apiClient);
