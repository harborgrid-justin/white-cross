/**
 * @fileoverview GraphQL Query Builder Utilities
 *
 * Utilities for building dynamic GraphQL queries and variables
 *
 * @module graphql/utils/queryBuilder
 * @since 1.0.0
 */

import { DocumentNode } from 'graphql';

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

/**
 * Build pagination variables
 */
export const buildPaginationVariables = (
  params: PaginationParams = {}
): PaginationParams => {
  return {
    page: params.page || 1,
    limit: params.limit || 20,
    orderBy: params.orderBy || 'createdAt',
    orderDirection: params.orderDirection || 'DESC',
  };
};

/**
 * Build filter variables
 */
export const buildFilterVariables = <T>(filters: Partial<T>): Partial<T> => {
  // Remove undefined and null values
  return Object.entries(filters).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
};

/**
 * Build search variables
 */
export const buildSearchVariables = (
  query: string,
  limit: number = 10
) => {
  return {
    query: query.trim(),
    limit,
  };
};

/**
 * Build date range variables
 */
export const buildDateRangeVariables = (
  startDate?: Date | string,
  endDate?: Date | string
) => {
  return {
    startDate: startDate ? new Date(startDate).toISOString() : undefined,
    endDate: endDate ? new Date(endDate).toISOString() : undefined,
  };
};

/**
 * Merge query variables
 */
export const mergeVariables = <T extends Record<string, any>>(
  ...variableSets: Partial<T>[]
): T => {
  return variableSets.reduce(
    (merged, vars) => ({ ...merged, ...vars }),
    {} as T
  );
};

/**
 * Build complete query variables
 */
export const buildQueryVariables = <T>(
  filters?: Partial<T>,
  pagination?: PaginationParams,
  additionalVars?: Record<string, any>
) => {
  return mergeVariables(
    buildPaginationVariables(pagination),
    filters ? { filters: buildFilterVariables(filters) } : {},
    additionalVars || {}
  );
};

/**
 * Extract pagination info from response
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const extractPaginationInfo = (data: any): PaginationInfo | null => {
  const pagination = data?.pagination;

  if (!pagination) return null;

  return {
    page: pagination.page,
    limit: pagination.limit,
    total: pagination.total,
    totalPages: pagination.totalPages,
    hasNextPage: pagination.page < pagination.totalPages,
    hasPreviousPage: pagination.page > 1,
  };
};

/**
 * Build optimistic response for create mutation
 */
export const buildOptimisticCreateResponse = <T>(
  mutationName: string,
  input: Partial<T>,
  typename: string
): any => {
  return {
    __typename: 'Mutation',
    [mutationName]: {
      __typename: typename,
      id: `temp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...input,
    },
  };
};

/**
 * Build optimistic response for update mutation
 */
export const buildOptimisticUpdateResponse = <T>(
  mutationName: string,
  id: string,
  input: Partial<T>,
  existing: T,
  typename: string
): any => {
  return {
    __typename: 'Mutation',
    [mutationName]: {
      __typename: typename,
      ...existing,
      ...input,
      id,
      updatedAt: new Date().toISOString(),
    },
  };
};

/**
 * Build optimistic response for delete mutation
 */
export const buildOptimisticDeleteResponse = (
  mutationName: string
): any => {
  return {
    __typename: 'Mutation',
    [mutationName]: {
      __typename: 'DeleteResponse',
      success: true,
      message: 'Item deleted successfully',
    },
  };
};
