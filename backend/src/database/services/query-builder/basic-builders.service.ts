/**
 * @fileoverview Basic Query Builder Functions
 * @module databa@/services/query-builder/basic-builders
 * @description Basic query building functions for filters, pagination, and sorting
 *
 * @version 1.0.0
 */

import { Logger } from '@nestjs/common';
import { Op, WhereOptions, OrderItem } from 'sequelize';
import { Filter, FilterOperator, SortOptions, PaginationOptions } from './interfaces';

/**
 * Build a basic where clause from filters
 */
export function buildWhereClause<T = unknown>(filters: Filter[]): WhereOptions<T> {
  const logger = new Logger('QueryBuilder::buildWhereClause');
  const where: WhereOptions<T> = {};

  filters.forEach((filter) => {
    try {
      const { field, operator, value, caseSensitive } = filter;

      switch (operator) {
        case FilterOperator.EQ:
          (where as Record<string, unknown>)[field] = value;
          break;

        case FilterOperator.NE:
          (where as Record<string, unknown>)[field] = { [Op.ne]: value };
          break;

        case FilterOperator.GT:
          (where as Record<string, unknown>)[field] = { [Op.gt]: value };
          break;

        case FilterOperator.GTE:
          (where as Record<string, unknown>)[field] = { [Op.gte]: value };
          break;

        case FilterOperator.LT:
          (where as Record<string, unknown>)[field] = { [Op.lt]: value };
          break;

        case FilterOperator.LTE:
          (where as Record<string, unknown>)[field] = { [Op.lte]: value };
          break;

        case FilterOperator.IN:
          (where as Record<string, unknown>)[field] = { [Op.in]: value };
          break;

        case FilterOperator.NOT_IN:
          (where as Record<string, unknown>)[field] = { [Op.notIn]: value };
          break;

        case FilterOperator.LIKE:
          (where as Record<string, unknown>)[field] = caseSensitive
            ? { [Op.like]: value }
            : { [Op.iLike]: value };
          break;

        case FilterOperator.ILIKE:
          (where as Record<string, unknown>)[field] = { [Op.iLike]: value };
          break;

        case FilterOperator.NOT_LIKE:
          (where as Record<string, unknown>)[field] = { [Op.notLike]: value };
          break;

        case FilterOperator.BETWEEN:
          (where as Record<string, unknown>)[field] = { [Op.between]: value };
          break;

        case FilterOperator.IS_NULL:
          (where as Record<string, unknown>)[field] = { [Op.is]: null };
          break;

        case FilterOperator.NOT_NULL:
          (where as Record<string, unknown>)[field] = { [Op.not]: null };
          break;

        case FilterOperator.CONTAINS:
          (where as Record<string, unknown>)[field] = { [Op.contains]: value };
          break;

        case FilterOperator.CONTAINED:
          (where as Record<string, unknown>)[field] = { [Op.contained]: value };
          break;

        case FilterOperator.OVERLAP:
          (where as Record<string, unknown>)[field] = { [Op.overlap]: value };
          break;

        case FilterOperator.REGEXP:
          (where as Record<string, unknown>)[field] = { [Op.regexp]: value };
          break;

        default:
          logger.warn(`Unknown filter operator: ${operator}`);
      }
    } catch (error) {
      logger.error(`Failed to build filter for field ${filter.field}`, error);
    }
  });

  return where;
}

/**
 * Build complex AND/OR where clause
 */
export function buildLogicalWhere<T = unknown>(
  conditions: WhereOptions<T>[],
  operator: 'AND' | 'OR' = 'AND'
): WhereOptions<T> {
  if (conditions.length === 0) {
    return {};
  }

  if (conditions.length === 1) {
    return conditions[0];
  }

  const op = operator === 'AND' ? Op.and : Op.or;
  return { [op]: conditions } as WhereOptions<T>;
}

/**
 * Build date range filter
 */
export function buildDateRangeFilter<T = unknown>(
  field: string,
  startDate?: Date,
  endDate?: Date
): WhereOptions<T> {
  const where: WhereOptions<T> = {};

  if (startDate && endDate) {
    (where as Record<string, unknown>)[field] = { [Op.between]: [startDate, endDate] };
  } else if (startDate) {
    (where as Record<string, unknown>)[field] = { [Op.gte]: startDate };
  } else if (endDate) {
    (where as Record<string, unknown>)[field] = { [Op.lte]: endDate };
  }

  return where;
}

/**
 * Build full-text search filter across multiple fields
 */
export function buildFullTextSearch<T = unknown>(
  searchTerm: string,
  fields: string[],
  caseSensitive: boolean = false
): WhereOptions<T> {
  if (!searchTerm || fields.length === 0) {
    return {};
  }

  const searchPattern = `%${searchTerm}%`;
  const operator = caseSensitive ? Op.like : Op.iLike;

  return {
    [Op.or]: fields.map((field) => ({
      [field]: { [operator]: searchPattern }
    }))
  } as WhereOptions<T>;
}

/**
 * Build pagination options
 */
export function buildPagination(page: number, limit: number): PaginationOptions {
  const validPage = Math.max(1, page);
  const validLimit = Math.max(1, Math.min(limit, 1000)); // Max 1000 per page

  return {
    page: validPage,
    limit: validLimit,
    offset: (validPage - 1) * validLimit
  };
}

/**
 * Build cursor-based pagination
 */
export function buildCursorPagination<T = unknown>(
  cursor: unknown,
  cursorField: string,
  direction: 'next' | 'prev' = 'next',
  limit: number = 20
): { where: WhereOptions<T>; limit: number; order: OrderItem[] } {
  const where: WhereOptions<T> = {};
  const order: OrderItem[] = [];

  if (cursor) {
    (where as Record<string, unknown>)[cursorField] = direction === 'next'
      ? { [Op.gt]: cursor }
      : { [Op.lt]: cursor };
  }

  order.push([cursorField, direction === 'next' ? 'ASC' : 'DESC']);

  return { where, limit: limit + 1, order }; // +1 to check if there's a next page
}

/**
 * Build order clause from sort options
 */
export function buildOrderClause(sorts: SortOptions[]): OrderItem[] {
  return sorts.map((sort) => {
    const orderItem: OrderItem = [sort.field, sort.direction];

    if (sort.nulls) {
      return [...orderItem, `NULLS ${sort.nulls}`] as OrderItem;
    }

    return orderItem;
  });
}

/**
 * Build attributes selection with inclusion/exclusion
 */
export function buildAttributes(
  include?: string[],
  exclude?: string[]
): { include?: string[]; exclude?: string[] } | string[] {
  if (!include && !exclude) {
    return [];
  }

  const attributes: { include?: string[]; exclude?: string[] } = {};

  if (include) {
    return include;
  }

  if (exclude) {
    attributes.exclude = exclude;
  }

  return attributes;
}
