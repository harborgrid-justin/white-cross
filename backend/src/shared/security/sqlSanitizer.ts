/**
 * WC-GEN-323 | sqlSanitizer.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../logging/logger | Dependencies: ../logging/logger
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes, interfaces, types, constants, functions, default export | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * SQL Input Sanitizer and Query Builder
 * Prevents SQL injection attacks in raw queries
 *
 * Security: Validates and sanitizes all dynamic SQL inputs
 * Use Case: For complex queries that can't use ORM parameterization
 */

import { logger } from '../logging/logger';

/**
 * Allowed sort fields whitelist by entity type
 * CRITICAL: Only these fields can be used in ORDER BY clauses
 */
export const ALLOWED_SORT_FIELDS: Record<string, string[]> = {
  inventory: ['name', 'quantity', 'category', 'createdAt', 'updatedAt', 'expirationDate'],
  healthRecords: ['date', 'type', 'createdAt', 'title', 'provider'],
  students: ['firstName', 'lastName', 'grade', 'studentNumber', 'createdAt'],
  medications: ['name', 'category', 'stockQuantity', 'expirationDate'],
  appointments: ['scheduledAt', 'status', 'type', 'createdAt'],
  users: ['firstName', 'lastName', 'email', 'role', 'createdAt'],
  reports: ['createdAt', 'type', 'status']
};

/**
 * Allowed sort orders
 */
export const ALLOWED_SORT_ORDERS = ['ASC', 'DESC', 'asc', 'desc'] as const;
export type SortOrder = typeof ALLOWED_SORT_ORDERS[number];

/**
 * Validation error for SQL injection attempts
 */
export class SqlInjectionError extends Error {
  constructor(message: string, public attemptedValue: string) {
    super(message);
    this.name = 'SqlInjectionError';
  }
}

/**
 * Validate sort field against whitelist
 * Throws SqlInjectionError if validation fails
 */
export function validateSortField(field: string, entityType: string): string {
  const allowedFields = ALLOWED_SORT_FIELDS[entityType];

  if (!allowedFields) {
    logger.error('Invalid entity type for sort validation', { entityType });
    throw new SqlInjectionError(
      `Invalid entity type: ${entityType}`,
      entityType
    );
  }

  if (!allowedFields.includes(field)) {
    logger.warn('SQL injection attempt detected - invalid sort field', {
      field,
      entityType,
      allowedFields
    });
    throw new SqlInjectionError(
      `Invalid sort field: ${field}. Allowed fields: ${allowedFields.join(', ')}`,
      field
    );
  }

  return field;
}

/**
 * Validate sort order
 * Throws SqlInjectionError if validation fails
 */
export function validateSortOrder(order: string): 'ASC' | 'DESC' {
  const upperOrder = order.toUpperCase();

  if (!ALLOWED_SORT_ORDERS.map(o => o.toUpperCase()).includes(upperOrder)) {
    logger.warn('SQL injection attempt detected - invalid sort order', { order });
    throw new SqlInjectionError(
      `Invalid sort order: ${order}. Allowed: ASC, DESC`,
      order
    );
  }

  return upperOrder as 'ASC' | 'DESC';
}

/**
 * Pagination parameters with safe defaults
 * Prevents large result set attacks
 */
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

/**
 * Validate and sanitize pagination parameters
 */
export function validatePagination(
  page?: number | string,
  limit?: number | string,
  maxLimit: number = 1000
): PaginationParams {
  const validatedPage = parseInt(String(page || 1), 10);
  const requestedLimit = parseInt(String(limit || 50), 10);

  if (isNaN(validatedPage) || validatedPage < 1) {
    throw new SqlInjectionError('Invalid page number', String(page));
  }

  if (isNaN(requestedLimit) || requestedLimit < 1) {
    throw new SqlInjectionError('Invalid limit value', String(limit));
  }

  // Enforce maximum limit
  const validatedLimit = Math.min(requestedLimit, maxLimit);

  if (requestedLimit > maxLimit) {
    logger.warn('Pagination limit exceeded maximum', {
      requested: requestedLimit,
      enforced: maxLimit
    });
  }

  return {
    page: validatedPage,
    limit: validatedLimit,
    offset: (validatedPage - 1) * validatedLimit
  };
}

/**
 * Build safe LIKE pattern for search queries
 * Escapes special characters and prevents injection
 */
export function buildSafeLikePattern(
  searchTerm: string,
  matchType: 'starts' | 'ends' | 'contains' = 'contains'
): string {
  if (!searchTerm) return '%';

  // Escape special LIKE characters
  const escaped = searchTerm
    .replace(/\\/g, '\\\\')  // Escape backslash first
    .replace(/%/g, '\\%')    // Escape percent
    .replace(/_/g, '\\_');   // Escape underscore

  switch (matchType) {
    case 'starts':
      return `${escaped}%`;
    case 'ends':
      return `%${escaped}`;
    case 'contains':
    default:
      return `%${escaped}%`;
  }
}

export default {
  validateSortField,
  validateSortOrder,
  validatePagination,
  buildSafeLikePattern,
  SqlInjectionError
};