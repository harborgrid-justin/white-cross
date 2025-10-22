/**
 * @fileoverview SQL Input Sanitizer and Query Builder
 * @module shared/security/sqlSanitizer
 * @description Enterprise-grade SQL sanitization utilities to prevent SQL injection attacks
 * in raw queries and dynamic SQL operations.
 *
 * Key Features:
 * - Whitelist-based sort field validation
 * - SQL injection pattern detection
 * - Safe sort order validation
 * - Pagination parameter sanitization
 * - LIKE pattern escaping
 * - Protection against large result set attacks
 *
 * @security
 * - Prevents SQL injection through whitelist validation
 * - Validates all dynamic SQL inputs
 * - Escapes special characters in LIKE patterns
 * - Enforces maximum pagination limits
 * - Logs all injection attempts
 * - Type-safe parameter validation
 *
 * Security Principles:
 * 1. Whitelist-only: Only pre-approved fields allowed in ORDER BY
 * 2. Parameterization: Always use parameterized queries when possible
 * 3. Validation: Strict validation of all dynamic SQL components
 * 4. Logging: Log all suspected injection attempts
 * 5. Limits: Enforce limits on result set sizes
 *
 * @requires ../logging/logger
 *
 * @example Basic usage
 * ```typescript
 * import { validateSortField, validateSortOrder, validatePagination } from './sqlSanitizer';
 *
 * // Validate sort parameters
 * const field = validateSortField('firstName', 'students');
 * const order = validateSortOrder('ASC');
 *
 * // Validate pagination
 * const { page, limit, offset } = validatePagination(1, 50);
 *
 * // Build safe query
 * const query = `SELECT * FROM students ORDER BY ${field} ${order} LIMIT ${limit} OFFSET ${offset}`;
 * ```
 *
 * @example LIKE pattern escaping
 * ```typescript
 * import { buildSafeLikePattern } from './sqlSanitizer';
 *
 * const searchTerm = req.query.search;
 * const pattern = buildSafeLikePattern(searchTerm, 'contains');
 * const query = `SELECT * FROM students WHERE firstName LIKE ?`;
 * db.query(query, [pattern]);
 * ```
 *
 * LOC: 45F543B57B
 * UPSTREAM: ../logging/logger
 * DOWNSTREAM: Services, repositories, database queries
 *
 * @version 1.0.0
 * @since 2025-10-17
 */

import { logger } from '../logging/logger';

/**
 * @constant ALLOWED_SORT_FIELDS
 * @description Whitelist of allowed sort fields by entity type for ORDER BY clauses
 * @readonly
 *
 * CRITICAL SECURITY: Only these fields can be used in ORDER BY clauses to prevent SQL injection.
 * Any attempt to use non-whitelisted fields will be rejected and logged.
 *
 * @type {Record<string, string[]>}
 *
 * @example
 * ```typescript
 * // Valid - field is whitelisted
 * const field = validateSortField('firstName', 'students'); // OK
 *
 * // Invalid - throws SqlInjectionError
 * const field = validateSortField('malicious_field', 'students'); // ERROR
 * ```
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
 * @constant ALLOWED_SORT_ORDERS
 * @description Allowed sort orders for SQL ORDER BY clauses
 * @readonly
 * @type {readonly ['ASC', 'DESC', 'asc', 'desc']}
 */
export const ALLOWED_SORT_ORDERS = ['ASC', 'DESC', 'asc', 'desc'] as const;

/**
 * @typedef {typeof ALLOWED_SORT_ORDERS[number]} SortOrder
 * @description Type representing valid sort orders (ASC or DESC, case-insensitive)
 */
export type SortOrder = typeof ALLOWED_SORT_ORDERS[number];

/**
 * @class SqlInjectionError
 * @extends Error
 * @description Custom error thrown when SQL injection attempt is detected
 *
 * @property {string} name - Error name ('SqlInjectionError')
 * @property {string} message - Error message
 * @property {string} attemptedValue - The value that triggered the injection detection
 *
 * @example
 * ```typescript
 * try {
 *   validateSortField('malicious_field; DROP TABLE users--', 'students');
 * } catch (error) {
 *   if (error instanceof SqlInjectionError) {
 *     console.error('Injection attempt:', error.attemptedValue);
 *   }
 * }
 * ```
 */
export class SqlInjectionError extends Error {
  constructor(message: string, public attemptedValue: string) {
    super(message);
    this.name = 'SqlInjectionError';
  }
}

/**
 * @function validateSortField
 * @description Validates a sort field against a whitelist to prevent SQL injection
 * @param {string} field - The field name to validate
 * @param {string} entityType - The entity type (students, inventory, healthRecords, etc.)
 * @returns {string} The validated field name
 * @throws {SqlInjectionError} If field is not in the whitelist or entity type is invalid
 *
 * @security CRITICAL - Prevents SQL injection in ORDER BY clauses
 *
 * @example
 * ```typescript
 * // Valid usage
 * const field = validateSortField('firstName', 'students');
 * // Returns: 'firstName'
 *
 * // Invalid field - throws error
 * try {
 *   validateSortField('unknown_field', 'students');
 * } catch (error) {
 *   // SqlInjectionError: Invalid sort field: unknown_field
 * }
 *
 * // SQL injection attempt - throws error
 * try {
 *   validateSortField('name; DROP TABLE--', 'students');
 * } catch (error) {
 *   // SqlInjectionError logged and thrown
 * }
 * ```
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
 * @function validateSortOrder
 * @description Validates a sort order string to prevent SQL injection
 * @param {string} order - The sort order to validate (ASC, DESC, asc, desc)
 * @returns {'ASC' | 'DESC'} Uppercase validated sort order
 * @throws {SqlInjectionError} If order is not ASC or DESC
 *
 * @security Prevents SQL injection in ORDER BY clauses
 *
 * @example
 * ```typescript
 * validateSortOrder('asc');  // Returns: 'ASC'
 * validateSortOrder('DESC'); // Returns: 'DESC'
 * validateSortOrder('invalid'); // Throws: SqlInjectionError
 * ```
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
 * @interface PaginationParams
 * @description Validated and sanitized pagination parameters
 *
 * @property {number} page - Current page number (1-indexed)
 * @property {number} limit - Number of items per page
 * @property {number} offset - SQL OFFSET value (calculated from page and limit)
 */
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

/**
 * @function validatePagination
 * @description Validates and sanitizes pagination parameters to prevent abuse
 * @param {number | string} [page] - Page number (defaults to 1)
 * @param {number | string} [limit] - Items per page (defaults to 50)
 * @param {number} [maxLimit=1000] - Maximum allowed limit (prevents large result set attacks)
 * @returns {PaginationParams} Validated pagination parameters
 * @throws {SqlInjectionError} If page or limit are invalid
 *
 * @security
 * - Enforces maximum limit to prevent DoS attacks
 * - Validates numeric input
 * - Prevents negative values
 * - Logs when max limit is exceeded
 *
 * @example
 * ```typescript
 * // Valid usage
 * const { page, limit, offset } = validatePagination(2, 50);
 * // Returns: { page: 2, limit: 50, offset: 50 }
 *
 * // With string inputs (from query params)
 * const params = validatePagination(req.query.page, req.query.limit);
 *
 * // Exceeds max limit - enforced to 1000
 * const params = validatePagination(1, 5000);
 * // Returns: { page: 1, limit: 1000, offset: 0 }
 *
 * // Invalid inputs - throws error
 * try {
 *   validatePagination(-1, 50); // Throws: SqlInjectionError
 * } catch (error) {
 *   console.error('Invalid pagination');
 * }
 * ```
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
 * @function buildSafeLikePattern
 * @description Builds a safe LIKE pattern for SQL search queries by escaping special characters
 * @param {string} searchTerm - The search term to escape
 * @param {'starts' | 'ends' | 'contains'} [matchType='contains'] - Type of match pattern
 * @returns {string} Escaped LIKE pattern safe for SQL queries
 *
 * @security
 * - Escapes SQL LIKE special characters (%, _, \)
 * - Prevents SQL injection in LIKE clauses
 * - Always use with parameterized queries
 *
 * Match Types:
 * - 'starts': Pattern matches start of string (term%)
 * - 'ends': Pattern matches end of string (%term)
 * - 'contains': Pattern matches anywhere in string (%term%)
 *
 * @example
 * ```typescript
 * // Contains match (default)
 * const pattern = buildSafeLikePattern('John');
 * // Returns: '%John%'
 * db.query('SELECT * FROM students WHERE firstName LIKE ?', [pattern]);
 *
 * // Starts with match
 * const pattern = buildSafeLikePattern('Doe', 'starts');
 * // Returns: 'Doe%'
 *
 * // Escapes special characters
 * const pattern = buildSafeLikePattern('50%_off');
 * // Returns: '%50\\%\\_off%'
 *
 * // Empty search term
 * const pattern = buildSafeLikePattern('');
 * // Returns: '%' (matches everything)
 * ```
 *
 * @warning Always use with parameterized queries, never string concatenation
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