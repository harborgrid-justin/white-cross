/**
 * @fileoverview Helper utilities for Redux Slice Factory
 * @module stores/sliceFactory/helpers
 * @category Utilities
 */

import { createEntityAdapter } from '@reduxjs/toolkit';
import type { WritableDraft } from '@reduxjs/toolkit';
import type { BaseEntity, LoadingState } from '../types/entityTypes';
import type { EnhancedEntityState, ApiError } from './types';

/**
 * Create initial state for enhanced entity state
 */
export function createInitialEnhancedState<T extends BaseEntity>(
  adapter: ReturnType<typeof createEntityAdapter<T, string>>,
  customState?: Partial<EnhancedEntityState<T>>
): EnhancedEntityState<T> {
  return {
    ...adapter.getInitialState(),
    loading: {
      list: { status: 'idle', isLoading: false, error: null },
      detail: { status: 'idle', isLoading: false, error: null },
      create: { status: 'idle', isLoading: false, error: null },
      update: { status: 'idle', isLoading: false, error: null },
      delete: { status: 'idle', isLoading: false, error: null },
      bulk: { status: 'idle', isLoading: false, error: null },
    },
    pagination: {
      page: 1,
      pageSize: 25,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    sort: {
      field: 'createdAt',
      direction: 'desc',
    },
    filters: {
      active: {},
      search: '',
      presets: {},
    },
    selection: {
      selectedIds: [],
      focusedId: null,
      isAllSelected: false,
      mode: 'multiple',
    },
    ui: {
      viewMode: 'list',
      showFilters: false,
      showSidebar: true,
      density: 'normal',
      visibleColumns: [],
      columnWidths: {},
    },
    cache: {
      lastFetched: 0,
      isStale: true,
    },
    ...customState,
  };
}

/**
 * Helper function to safely extract error information
 */
export function extractErrorInfo(error: unknown): ApiError {
  if (error instanceof Error) {
    return {
      message: error.message,
      status: (error as { status?: number }).status,
      code: (error as { code?: string }).code,
      validationErrors: (error as { validationErrors?: Record<string, string[]> }).validationErrors,
    };
  }

  if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>;
    return {
      message: (err.message as string) || 'An error occurred',
      status: err.status as number,
      code: err.code as string,
      validationErrors: err.validationErrors as Record<string, string[]>,
    };
  }

  return {
    message: String(error) || 'An unknown error occurred',
  };
}

/**
 * Helper function to update loading state
 */
export function updateLoadingState<T extends BaseEntity>(
  state: WritableDraft<EnhancedEntityState<T>>,
  operation: keyof EnhancedEntityState<T>['loading'],
  loading: Partial<LoadingState>
): void {
  state.loading[operation] = { ...state.loading[operation], ...loading };
}

/**
 * Create entity adapter with default configuration
 */
export function createStandardEntityAdapter<T extends BaseEntity>() {
  return createEntityAdapter<T, string>({
    selectId: (entity: T) => entity.id,
    sortComparer: (a: T, b: T) => {
      // Default sort by updatedAt descending
      if (!a.updatedAt || !b.updatedAt) return 0;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    },
  });
}

/**
 * Validate entity data before processing
 */
export function validateEntity<T extends BaseEntity>(entity: T): boolean {
  return Boolean(
    entity &&
    typeof entity.id === 'string' &&
    entity.id.length > 0 &&
    entity.createdAt &&
    entity.updatedAt
  );
}

/**
 * Create error action payload for rejected thunks
 */
export function createErrorPayload(error: unknown, operation: string, entityName: string): ApiError {
  const errorInfo = extractErrorInfo(error);
  return {
    ...errorInfo,
    message: errorInfo.message || `Failed to ${operation} ${entityName}`,
  };
}

/**
 * Check if cache is stale based on timestamp and threshold
 */
export function isCacheStale(lastFetched: number, thresholdMs: number = 300000): boolean {
  return Date.now() - lastFetched > thresholdMs;
}

/**
 * Normalize entity for consistent data structure
 */
export function normalizeEntity<T extends BaseEntity>(entity: T): T {
  return {
    ...entity,
    createdAt: entity.createdAt || new Date().toISOString(),
    updatedAt: entity.updatedAt || new Date().toISOString(),
  };
}

/**
 * Calculate pagination metadata
 */
export function calculatePagination(
  page: number,
  pageSize: number,
  total: number
): {
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} {
  const totalPages = Math.ceil(total / pageSize);
  return {
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

/**
 * Generate consistent action type names
 */
export function createActionTypes(name: string): Record<string, string> {
  return {
    FETCH_LIST_PENDING: `${name}/fetchList/pending`,
    FETCH_LIST_FULFILLED: `${name}/fetchList/fulfilled`,
    FETCH_LIST_REJECTED: `${name}/fetchList/rejected`,
    FETCH_BY_ID_PENDING: `${name}/fetchById/pending`,
    FETCH_BY_ID_FULFILLED: `${name}/fetchById/fulfilled`,
    FETCH_BY_ID_REJECTED: `${name}/fetchById/rejected`,
    CREATE_PENDING: `${name}/create/pending`,
    CREATE_FULFILLED: `${name}/create/fulfilled`,
    CREATE_REJECTED: `${name}/create/rejected`,
    UPDATE_PENDING: `${name}/update/pending`,
    UPDATE_FULFILLED: `${name}/update/fulfilled`,
    UPDATE_REJECTED: `${name}/update/rejected`,
    DELETE_PENDING: `${name}/delete/pending`,
    DELETE_FULFILLED: `${name}/delete/fulfilled`,
    DELETE_REJECTED: `${name}/delete/rejected`,
    BULK_DELETE_PENDING: `${name}/bulkDelete/pending`,
    BULK_DELETE_FULFILLED: `${name}/bulkDelete/fulfilled`,
    BULK_DELETE_REJECTED: `${name}/bulkDelete/rejected`,
    BULK_UPDATE_PENDING: `${name}/bulkUpdate/pending`,
    BULK_UPDATE_FULFILLED: `${name}/bulkUpdate/fulfilled`,
    BULK_UPDATE_REJECTED: `${name}/bulkUpdate/rejected`,
  };
}

/**
 * Deep merge two objects
 */
export function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = result[key];
      
      if (
        typeof sourceValue === 'object' &&
        sourceValue !== null &&
        !Array.isArray(sourceValue) &&
        typeof targetValue === 'object' &&
        targetValue !== null &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(targetValue as Record<string, unknown>, sourceValue as Record<string, unknown>) as T[Extract<keyof T, string>];
      } else {
        result[key] = sourceValue as T[Extract<keyof T, string>];
      }
    }
  }
  
  return result;
}
