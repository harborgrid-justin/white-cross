/**
 * @fileoverview Query Builder Interfaces and Types
 * @module database/services/query-builder/interfaces
 * @description Common interfaces and types for query building operations
 *
 * @version 1.0.0
 */

import { Transaction, WhereOptions, OrderItem, IncludeOptions, GroupOption } from 'sequelize';

/**
 * Pagination parameters
 */
export interface PaginationOptions {
  page: number;
  limit: number;
  offset?: number;
}

/**
 * Sort options
 */
export interface SortOptions {
  field: string;
  direction: 'ASC' | 'DESC';
  nulls?: 'FIRST' | 'LAST';
}

/**
 * Filter operator types
 */
export enum FilterOperator {
  EQ = 'eq',
  NE = 'ne',
  GT = 'gt',
  GTE = 'gte',
  LT = 'lt',
  LTE = 'lte',
  IN = 'in',
  NOT_IN = 'notIn',
  LIKE = 'like',
  ILIKE = 'iLike',
  NOT_LIKE = 'notLike',
  BETWEEN = 'between',
  IS_NULL = 'isNull',
  NOT_NULL = 'notNull',
  CONTAINS = 'contains',
  CONTAINED = 'contained',
  OVERLAP = 'overlap',
  REGEXP = 'regexp',
}

/**
 * Filter definition
 */
export interface Filter {
  field: string;
  operator: FilterOperator;
  value?: unknown;
  caseSensitive?: boolean;
}

/**
 * Query builder configuration
 */
export interface QueryBuilderConfig<T = unknown> {
  where?: WhereOptions<T>;
  include?: IncludeOptions[];
  order?: OrderItem[];
  attributes?: string[] | { include?: string[]; exclude?: string[] };
  group?: GroupOption;
  having?: WhereOptions<T>;
  limit?: number;
  offset?: number;
  distinct?: boolean;
  subQuery?: boolean;
  transaction?: Transaction;
}

/**
 * Paginated query result
 */
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Dynamic query parameters from request
 */
export interface DynamicQueryParams {
  filters?: Filter[];
  search?: { term: string; fields: string[] };
  sort?: SortOptions[];
  page?: number;
  limit?: number;
  include?: string[];
}

/**
 * Include configuration for N+1 prevention
 */
export interface IncludeConfig {
  association: string;
  required?: boolean;
  attributes?: string[];
  where?: WhereOptions<unknown>;
  nested?: IncludeConfig[];
  separate?: boolean;
}

/**
 * Spatial query operators
 */
export type SpatialOperator = 'intersects' | 'contains' | 'within' | 'distance';

/**
 * Array query operators
 */
export type ArrayOperator = 'contains' | 'contained' | 'overlap' | 'any';

/**
 * JSON query operators
 */
export type JSONOperator = FilterOperator.EQ | FilterOperator.CONTAINS | FilterOperator.CONTAINED;
