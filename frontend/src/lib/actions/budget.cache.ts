/**
 * @fileoverview Budget Cache Operations
 * @module lib/actions/budget.cache
 *
 * Cached data fetching functions for budget management with Next.js cache integration.
 * Provides optimized data retrieval with automatic memoization and revalidation.
 */

'use server';

import { cache } from 'react';

// Core API integrations
import { serverGet } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { CACHE_TTL } from '@/lib/cache/constants';

// Types
import type { ApiResponse } from '@/types/api';
import type {
  BudgetCategory,
  BudgetTransaction,
  BudgetSummary,
  BudgetFilters,
  TransactionFilters,
  BUDGET_CACHE_TAGS,
} from './budget.types';

// Import cache tags
import { BUDGET_CACHE_TAGS as CACHE_TAGS } from './budget.types';

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get budget category by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getBudgetCategory = cache(async (id: string): Promise<BudgetCategory | null> => {
  try {
    const response = await serverGet<ApiResponse<BudgetCategory>>(
      API_ENDPOINTS.BUDGET.CATEGORY_BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [`budget-category-${id}`, CACHE_TAGS.CATEGORIES]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get budget category:', error);
    return null;
  }
});

/**
 * Get all budget categories with caching
 */
export const getBudgetCategories = cache(async (filters?: BudgetFilters): Promise<BudgetCategory[]> => {
  try {
    const response = await serverGet<ApiResponse<BudgetCategory[]>>(
      API_ENDPOINTS.BUDGET.CATEGORIES,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [CACHE_TAGS.CATEGORIES, 'budget-category-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get budget categories:', error);
    return [];
  }
});

/**
 * Get budget transaction by ID with caching
 */
export const getBudgetTransaction = cache(async (id: string): Promise<BudgetTransaction | null> => {
  try {
    const response = await serverGet<ApiResponse<BudgetTransaction>>(
      API_ENDPOINTS.BUDGET.TRANSACTION_BY_ID(id),
      undefined,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [`budget-transaction-${id}`, CACHE_TAGS.TRANSACTIONS]
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get budget transaction:', error);
    return null;
  }
});

/**
 * Get all budget transactions with caching
 */
export const getBudgetTransactions = cache(async (filters?: TransactionFilters): Promise<BudgetTransaction[]> => {
  try {
    const response = await serverGet<ApiResponse<BudgetTransaction[]>>(
      API_ENDPOINTS.BUDGET.TRANSACTIONS,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.SESSION,
          tags: [CACHE_TAGS.TRANSACTIONS, 'budget-transaction-list']
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get budget transactions:', error);
    return [];
  }
});

/**
 * Get budget summary with caching
 */
export const getBudgetSummary = cache(async (filters?: Record<string, unknown>): Promise<BudgetSummary | null> => {
  try {
    const response = await serverGet<ApiResponse<BudgetSummary>>(
      API_ENDPOINTS.BUDGET.SUMMARY,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: {
          revalidate: CACHE_TTL.STATS,
          tags: [CACHE_TAGS.SUMMARY, 'budget-stats']
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get budget summary:', error);
    return null;
  }
});
