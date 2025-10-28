/**
 * LOC: 2B0BD1838A
 * WC-GEN-355 | sqlSanitizer.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-355 | sqlSanitizer.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../logger | Dependencies: ../logger
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

import { logger } from '../logger';

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
 *
 * @param field - Field name to validate
 * @param entityType - Entity type to check against
 * @returns Validated field name
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
 *
 * @param order - Sort order to validate
 * @returns Validated sort order in uppercase
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
 * Validate date input
 * Ensures input is a valid Date object
 *
 * @param date - Date value to validate
 * @param fieldName - Name of field for error messages
 * @returns Validated Date object
 */
export function validateDateInput(date: any, fieldName: string): Date {
  if (!date) {
    throw new SqlInjectionError(`Missing required date field: ${fieldName}`, String(date));
  }

  if (!(date instanceof Date)) {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      logger.warn('Invalid date input detected', { date, fieldName });
      throw new SqlInjectionError(
        `Invalid date for ${fieldName}: ${date}`,
        String(date)
      );
    }
    return parsedDate;
  }

  if (isNaN(date.getTime())) {
    logger.warn('Invalid date object detected', { date, fieldName });
    throw new SqlInjectionError(
      `Invalid date object for ${fieldName}`,
      String(date)
    );
  }

  return date;
}

/**
 * Validate integer input
 * Ensures input is a valid integer within optional bounds
 *
 * @param value - Value to validate
 * @param fieldName - Name of field for error messages
 * @param min - Optional minimum value
 * @param max - Optional maximum value
 * @returns Validated integer
 */
export function validateIntegerInput(
  value: any,
  fieldName: string,
  min?: number,
  max?: number
): number {
  const num = parseInt(value, 10);

  if (isNaN(num)) {
    logger.warn('Invalid integer input detected', { value, fieldName });
    throw new SqlInjectionError(
      `Invalid integer for ${fieldName}: ${value}`,
      String(value)
    );
  }

  if (min !== undefined && num < min) {
    throw new SqlInjectionError(
      `${fieldName} must be at least ${min}`,
      String(value)
    );
  }

  if (max !== undefined && num > max) {
    throw new SqlInjectionError(
      `${fieldName} must be at most ${max}`,
      String(value)
    );
  }

  return num;
}

/**
 * Validate UUID input
 * Ensures input is a valid UUID v4
 *
 * @param value - UUID string to validate
 * @param fieldName - Name of field for error messages
 * @returns Validated UUID string
 */
export function validateUuidInput(value: string, fieldName: string): string {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(value)) {
    logger.warn('Invalid UUID input detected', { value, fieldName });
    throw new SqlInjectionError(
      `Invalid UUID for ${fieldName}: ${value}`,
      value
    );
  }

  return value;
}

/**
 * Validate enum input
 * Ensures input is one of allowed values
 *
 * @param value - Value to validate
 * @param allowedValues - Array of allowed values
 * @param fieldName - Name of field for error messages
 * @returns Validated enum value
 */
export function validateEnumInput<T extends string>(
  value: string,
  allowedValues: readonly T[],
  fieldName: string
): T {
  if (!allowedValues.includes(value as T)) {
    logger.warn('Invalid enum input detected', { value, fieldName, allowedValues });
    throw new SqlInjectionError(
      `Invalid value for ${fieldName}: ${value}. Allowed: ${allowedValues.join(', ')}`,
      value
    );
  }

  return value as T;
}

/**
 * Safe SQL identifier builder for Sequelize
 * Use for dynamic table/column names in ORDER BY, GROUP BY
 *
 * @param field - Validated field name
 * @param order - Validated sort order
 * @returns SQL fragment string
 */
export function buildSafeOrderBy(field: string, order: 'ASC' | 'DESC'): string {
  // field and order are already validated, safe to concatenate
  return `${field} ${order}`;
}

/**
 * Safe date range builder for WHERE clauses
 * Prevents injection in date comparisons
 *
 * @param columnName - Column name to filter (must be validated)
 * @param startDate - Start date (optional)
 * @param endDate - End date (optional)
 * @returns Object with conditions for Sequelize where clause
 */
export function buildSafeDateRange(
  columnName: string,
  startDate?: Date,
  endDate?: Date
): { [key: string]: any } {
  const conditions: any = {};

  if (startDate && endDate) {
    conditions[columnName] = {
      $gte: startDate,
      $lte: endDate
    };
  } else if (startDate) {
    conditions[columnName] = { $gte: startDate };
  } else if (endDate) {
    conditions[columnName] = { $lte: endDate };
  }

  return conditions;
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
 *
 * @param page - Page number (1-indexed)
 * @param limit - Results per page
 * @param maxLimit - Maximum allowed limit (default 1000)
 * @returns Validated pagination parameters
 */
export function validatePagination(
  page?: number | string,
  limit?: number | string,
  maxLimit: number = 1000
): PaginationParams {
  const validatedPage = validateIntegerInput(page || 1, 'page', 1);
  const requestedLimit = validateIntegerInput(limit || 50, 'limit', 1, maxLimit);

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
 *
 * @param searchTerm - User input search term
 * @param matchType - Type of match (starts, ends, contains)
 * @returns Sanitized LIKE pattern
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

/**
 * Safe array value builder for IN clauses
 * Validates array inputs for Sequelize queries
 *
 * @param values - Array of values
 * @param validator - Optional validator function for each value
 * @returns Validated array of values
 */
export function buildSafeInClause<T>(
  values: T[],
  validator?: (value: T) => boolean
): T[] {
  if (!Array.isArray(values) || values.length === 0) {
    throw new SqlInjectionError('Empty array not allowed for IN clause', '[]');
  }

  // Validate each value if validator provided
  if (validator) {
    const invalidValues = values.filter(v => !validator(v));
    if (invalidValues.length > 0) {
      logger.warn('Invalid values detected in IN clause', { invalidValues });
      throw new SqlInjectionError(
        'Invalid values in array',
        JSON.stringify(invalidValues)
      );
    }
  }

  // Return validated array for use with Sequelize Op.in
  return values;
}

/**
 * Audit log for detected SQL injection attempts
 * HIPAA requires logging security incidents
 */
export async function logSqlInjectionAttempt(
  error: SqlInjectionError,
  context: {
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    endpoint?: string;
  }
): Promise<void> {
  logger.error('SQL INJECTION ATTEMPT DETECTED', {
    attemptedValue: error.attemptedValue,
    errorMessage: error.message,
    userId: context.userId,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    endpoint: context.endpoint,
    timestamp: new Date().toISOString()
  });

  // TODO: Integrate with security incident tracking system
  // This should trigger alerts for security team
}

export default {
  validateSortField,
  validateSortOrder,
  validateDateInput,
  validateIntegerInput,
  validateUuidInput,
  validateEnumInput,
  buildSafeOrderBy,
  buildSafeDateRange,
  validatePagination,
  buildSafeLikePattern,
  buildSafeInClause,
  logSqlInjectionAttempt,
  SqlInjectionError
};
