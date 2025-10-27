/**
 * WF-COMP-275 | budgetSlice.ts - Budget Redux slice
 * Purpose: Budget page Redux slice with budget API integration
 * Related: budgetApi.ts
 * Last Updated: 2025-10-21 | File Type: .ts
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { budgetApi } from '../../services/modules/budgetApi';
import {
  BudgetCategory,
  BudgetTransaction,
  BudgetCategoryWithMetrics,
  BudgetSummary,
  SpendingTrend,
  CategoryYearComparison,
  OverBudgetCategory,
  BudgetRecommendationItem,
  CreateBudgetCategoryRequest,
  UpdateBudgetCategoryRequest,
  CreateBudgetTransactionRequest,
  UpdateBudgetTransactionRequest,
  BudgetTransactionFilters,
  BudgetCategoryParams,
} from '../../types/budget';

// Budget API Service Adapter
export class BudgetApiService {
  // Categories
  async getBudgetCategories(params: BudgetCategoryParams = {}) {
    return budgetApi.getBudgetCategories(params);
  }

  async getBudgetCategoryById(id: string) {
    return budgetApi.getBudgetCategoryById(id);
  }

  async createBudgetCategory(data: CreateBudgetCategoryRequest) {
    return budgetApi.createBudgetCategory(data);
  }

  async updateBudgetCategory(id: string, data: UpdateBudgetCategoryRequest) {
    return budgetApi.updateBudgetCategory(id, data);
  }

  async deleteBudgetCategory(id: string) {
    return budgetApi.deleteBudgetCategory(id);
  }

  // Summary
  async getBudgetSummary(fiscalYear?: number) {
    return budgetApi.getBudgetSummary(fiscalYear);
  }

  // Transactions
  async getBudgetTransactions(page: number = 1, limit: number = 20, filters: BudgetTransactionFilters = {}) {
    return budgetApi.getBudgetTransactions(page, limit, filters);
  }

  async createBudgetTransaction(data: CreateBudgetTransactionRequest) {
    return budgetApi.createBudgetTransaction(data);
  }

  async updateBudgetTransaction(id: string, data: UpdateBudgetTransactionRequest) {
    return budgetApi.updateBudgetTransaction(id, data);
  }

  async deleteBudgetTransaction(id: string) {
    return budgetApi.deleteBudgetTransaction(id);
  }

  // Analytics
  async getSpendingTrends(fiscalYear?: number, categoryId?: string) {
    return budgetApi.getSpendingTrends(fiscalYear, categoryId);
  }

  async getCategoryYearComparison(categoryName: string, years: number[]) {
    return budgetApi.getCategoryYearComparison(categoryName, years);
  }

  async getOverBudgetCategories(fiscalYear?: number) {
    return budgetApi.getOverBudgetCategories(fiscalYear);
  }

  async getBudgetRecommendations(fiscalYear?: number) {
    return budgetApi.getBudgetRecommendations(fiscalYear);
  }

  async exportBudgetData(fiscalYear?: number) {
    return budgetApi.exportBudgetData(fiscalYear);
  }

  // Utility methods
  getCurrentFiscalYear() {
    return budgetApi.getCurrentFiscalYear();
  }

  getFiscalYearOptions(range: number = 5) {
    return budgetApi.getFiscalYearOptions(range);
  }
}

// Create budget API service instance
export const budgetApiService = new BudgetApiService();

// State interface
export interface BudgetState {
  // Categories
  categories: BudgetCategoryWithMetrics[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  
  // Selected Category
  selectedCategory: BudgetCategoryWithMetrics | null;
  selectedCategoryLoading: boolean;
  selectedCategoryError: string | null;
  
  // Summary
  summary: BudgetSummary | null;
  summaryLoading: boolean;
  summaryError: string | null;
  
  // Transactions
  transactions: BudgetTransaction[];
  transactionsLoading: boolean;
  transactionsError: string | null;
  transactionsPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Analytics
  spendingTrends: SpendingTrend[];
  spendingTrendsLoading: boolean;
  spendingTrendsError: string | null;
  
  categoryComparison: CategoryYearComparison[];
  categoryComparisonLoading: boolean;
  categoryComparisonError: string | null;
  
  overBudgetCategories: OverBudgetCategory[];
  overBudgetCategoriesLoading: boolean;
  overBudgetCategoriesError: string | null;
  
  recommendations: BudgetRecommendationItem[];
  recommendationsLoading: boolean;
  recommendationsError: string | null;
  
  // UI State
  currentFiscalYear: number;
  selectedFiscalYears: number[];
}

// Initial state
const initialState: BudgetState = {
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  
  selectedCategory: null,
  selectedCategoryLoading: false,
  selectedCategoryError: null,
  
  summary: null,
  summaryLoading: false,
  summaryError: null,
  
  transactions: [],
  transactionsLoading: false,
  transactionsError: null,
  transactionsPagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
  
  spendingTrends: [],
  spendingTrendsLoading: false,
  spendingTrendsError: null,
  
  categoryComparison: [],
  categoryComparisonLoading: false,
  categoryComparisonError: null,
  
  overBudgetCategories: [],
  overBudgetCategoriesLoading: false,
  overBudgetCategoriesError: null,
  
  recommendations: [],
  recommendationsLoading: false,
  recommendationsError: null,
  
  currentFiscalYear: budgetApi.getCurrentFiscalYear(),
  selectedFiscalYears: budgetApi.getFiscalYearOptions(),
};

// Async thunks
export const fetchBudgetCategories = createAsyncThunk(
  'budget/fetchCategories',
  async (params: BudgetCategoryParams = {}) => {
    const categories = await budgetApiService.getBudgetCategories(params);
    return categories;
  }
);

export const fetchBudgetCategoryById = createAsyncThunk(
  'budget/fetchCategoryById',
  async (id: string) => {
    const category = await budgetApiService.getBudgetCategoryById(id);
    return category;
  }
);

export const fetchBudgetSummary = createAsyncThunk(
  'budget/fetchSummary',
  async (fiscalYear?: number) => {
    const summary = await budgetApiService.getBudgetSummary(fiscalYear);
    return summary;
  }
);

export const fetchBudgetTransactions = createAsyncThunk(
  'budget/fetchTransactions',
  async ({ page = 1, limit = 20, filters = {} }: { page?: number; limit?: number; filters?: BudgetTransactionFilters } = {}) => {
    const response = await budgetApiService.getBudgetTransactions(page, limit, filters);
    return response;
  }
);

export const fetchSpendingTrends = createAsyncThunk(
  'budget/fetchSpendingTrends',
  async ({ fiscalYear, categoryId }: { fiscalYear?: number; categoryId?: string } = {}) => {
    const trends = await budgetApiService.getSpendingTrends(fiscalYear, categoryId);
    return trends;
  }
);

export const fetchCategoryYearComparison = createAsyncThunk(
  'budget/fetchCategoryComparison',
  async ({ categoryName, years }: { categoryName: string; years: number[] }) => {
    const comparison = await budgetApiService.getCategoryYearComparison(categoryName, years);
    return comparison;
  }
);

export const fetchOverBudgetCategories = createAsyncThunk(
  'budget/fetchOverBudgetCategories',
  async (fiscalYear?: number) => {
    const response = await budgetApiService.getOverBudgetCategories(fiscalYear);
    return response.categories;
  }
);

export const fetchBudgetRecommendations = createAsyncThunk(
  'budget/fetchRecommendations',
  async (fiscalYear?: number) => {
    const recommendations = await budgetApiService.getBudgetRecommendations(fiscalYear);
    return recommendations;
  }
);

// Slice
const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    // Clear errors
    clearCategoriesError: (state) => {
      state.categoriesError = null;
    },
    clearSelectedCategoryError: (state) => {
      state.selectedCategoryError = null;
    },
    clearSummaryError: (state) => {
      state.summaryError = null;
    },
    clearTransactionsError: (state) => {
      state.transactionsError = null;
    },
    clearSpendingTrendsError: (state) => {
      state.spendingTrendsError = null;
    },
    clearCategoryComparisonError: (state) => {
      state.categoryComparisonError = null;
    },
    clearOverBudgetCategoriesError: (state) => {
      state.overBudgetCategoriesError = null;
    },
    clearRecommendationsError: (state) => {
      state.recommendationsError = null;
    },
    
    // Set fiscal year
    setCurrentFiscalYear: (state, action) => {
      state.currentFiscalYear = action.payload;
    },
    
    // Clear selected category
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {
    // Categories
    builder
      .addCase(fetchBudgetCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchBudgetCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchBudgetCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.error.message || 'Failed to fetch budget categories';
      })

    // Selected Category
      .addCase(fetchBudgetCategoryById.pending, (state) => {
        state.selectedCategoryLoading = true;
        state.selectedCategoryError = null;
      })
      .addCase(fetchBudgetCategoryById.fulfilled, (state, action) => {
        state.selectedCategoryLoading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchBudgetCategoryById.rejected, (state, action) => {
        state.selectedCategoryLoading = false;
        state.selectedCategoryError = action.error.message || 'Failed to fetch budget category';
      })

    // Summary
      .addCase(fetchBudgetSummary.pending, (state) => {
        state.summaryLoading = true;
        state.summaryError = null;
      })
      .addCase(fetchBudgetSummary.fulfilled, (state, action) => {
        state.summaryLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchBudgetSummary.rejected, (state, action) => {
        state.summaryLoading = false;
        state.summaryError = action.error.message || 'Failed to fetch budget summary';
      })

    // Transactions
      .addCase(fetchBudgetTransactions.pending, (state) => {
        state.transactionsLoading = true;
        state.transactionsError = null;
      })
      .addCase(fetchBudgetTransactions.fulfilled, (state, action) => {
        state.transactionsLoading = false;
        state.transactions = action.payload.transactions;
        state.transactionsPagination = {
          page: action.payload.pagination.page,
          limit: action.payload.pagination.limit,
          total: action.payload.pagination.total,
          totalPages: action.payload.pagination.pages || 0
        };
      })
      .addCase(fetchBudgetTransactions.rejected, (state, action) => {
        state.transactionsLoading = false;
        state.transactionsError = action.error.message || 'Failed to fetch budget transactions';
      })

    // Spending Trends
      .addCase(fetchSpendingTrends.pending, (state) => {
        state.spendingTrendsLoading = true;
        state.spendingTrendsError = null;
      })
      .addCase(fetchSpendingTrends.fulfilled, (state, action) => {
        state.spendingTrendsLoading = false;
        state.spendingTrends = action.payload;
      })
      .addCase(fetchSpendingTrends.rejected, (state, action) => {
        state.spendingTrendsLoading = false;
        state.spendingTrendsError = action.error.message || 'Failed to fetch spending trends';
      })

    // Category Comparison
      .addCase(fetchCategoryYearComparison.pending, (state) => {
        state.categoryComparisonLoading = true;
        state.categoryComparisonError = null;
      })
      .addCase(fetchCategoryYearComparison.fulfilled, (state, action) => {
        state.categoryComparisonLoading = false;
        state.categoryComparison = action.payload;
      })
      .addCase(fetchCategoryYearComparison.rejected, (state, action) => {
        state.categoryComparisonLoading = false;
        state.categoryComparisonError = action.error.message || 'Failed to fetch category comparison';
      })

    // Over Budget Categories
      .addCase(fetchOverBudgetCategories.pending, (state) => {
        state.overBudgetCategoriesLoading = true;
        state.overBudgetCategoriesError = null;
      })
      .addCase(fetchOverBudgetCategories.fulfilled, (state, action) => {
        state.overBudgetCategoriesLoading = false;
        state.overBudgetCategories = action.payload;
      })
      .addCase(fetchOverBudgetCategories.rejected, (state, action) => {
        state.overBudgetCategoriesLoading = false;
        state.overBudgetCategoriesError = action.error.message || 'Failed to fetch over-budget categories';
      })

    // Recommendations
      .addCase(fetchBudgetRecommendations.pending, (state) => {
        state.recommendationsLoading = true;
        state.recommendationsError = null;
      })
      .addCase(fetchBudgetRecommendations.fulfilled, (state, action) => {
        state.recommendationsLoading = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchBudgetRecommendations.rejected, (state, action) => {
        state.recommendationsLoading = false;
        state.recommendationsError = action.error.message || 'Failed to fetch budget recommendations';
      });
  },
});

// Selectors
export const selectBudgetCategories = (state: { budget: BudgetState }) => state.budget.categories;
export const selectCategoriesLoading = (state: { budget: BudgetState }) => state.budget.categoriesLoading;
export const selectCategoriesError = (state: { budget: BudgetState }) => state.budget.categoriesError;

export const selectSelectedCategory = (state: { budget: BudgetState }) => state.budget.selectedCategory;
export const selectSelectedCategoryLoading = (state: { budget: BudgetState }) => state.budget.selectedCategoryLoading;
export const selectSelectedCategoryError = (state: { budget: BudgetState }) => state.budget.selectedCategoryError;

export const selectBudgetSummary = (state: { budget: BudgetState }) => state.budget.summary;
export const selectSummaryLoading = (state: { budget: BudgetState }) => state.budget.summaryLoading;
export const selectSummaryError = (state: { budget: BudgetState }) => state.budget.summaryError;

export const selectBudgetTransactions = (state: { budget: BudgetState }) => state.budget.transactions;
export const selectTransactionsLoading = (state: { budget: BudgetState }) => state.budget.transactionsLoading;
export const selectTransactionsError = (state: { budget: BudgetState }) => state.budget.transactionsError;
export const selectTransactionsPagination = (state: { budget: BudgetState }) => state.budget.transactionsPagination;

export const selectSpendingTrends = (state: { budget: BudgetState }) => state.budget.spendingTrends;
export const selectSpendingTrendsLoading = (state: { budget: BudgetState }) => state.budget.spendingTrendsLoading;
export const selectSpendingTrendsError = (state: { budget: BudgetState }) => state.budget.spendingTrendsError;

export const selectCategoryComparison = (state: { budget: BudgetState }) => state.budget.categoryComparison;
export const selectCategoryComparisonLoading = (state: { budget: BudgetState }) => state.budget.categoryComparisonLoading;
export const selectCategoryComparisonError = (state: { budget: BudgetState }) => state.budget.categoryComparisonError;

export const selectOverBudgetCategories = (state: { budget: BudgetState }) => state.budget.overBudgetCategories;
export const selectOverBudgetCategoriesLoading = (state: { budget: BudgetState }) => state.budget.overBudgetCategoriesLoading;
export const selectOverBudgetCategoriesError = (state: { budget: BudgetState }) => state.budget.overBudgetCategoriesError;

export const selectBudgetRecommendations = (state: { budget: BudgetState }) => state.budget.recommendations;
export const selectRecommendationsLoading = (state: { budget: BudgetState }) => state.budget.recommendationsLoading;
export const selectRecommendationsError = (state: { budget: BudgetState }) => state.budget.recommendationsError;

export const selectCurrentFiscalYear = (state: { budget: BudgetState }) => state.budget.currentFiscalYear;
export const selectFiscalYearOptions = (state: { budget: BudgetState }) => state.budget.selectedFiscalYears;

// Derived selectors
export const selectCategoriesWithStatus = (state: { budget: BudgetState }) => {
  return state.budget.categories.map(category => ({
    ...category,
    status: budgetApi.getStatusColor(category.utilizationPercentage),
    isOverBudget: budgetApi.isOverBudget(category),
    isApproachingLimit: budgetApi.isApproachingLimit(category),
  }));
};

// Export actions and reducer
export const {
  clearCategoriesError,
  clearSelectedCategoryError,
  clearSummaryError,
  clearTransactionsError,
  clearSpendingTrendsError,
  clearCategoryComparisonError,
  clearOverBudgetCategoriesError,
  clearRecommendationsError,
  setCurrentFiscalYear,
  clearSelectedCategory,
} = budgetSlice.actions;

export default budgetSlice.reducer;
