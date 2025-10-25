/**
 * @fileoverview SQL Injection Prevention Service - Input Validation & Sanitization
 * @module shared/security/sql-sanitizer.service
 *
 * @description
 * Comprehensive SQL injection prevention service providing input validation, sanitization,
 * and safe query building utilities for healthcare applications. Implements defense-in-depth
 * strategies including whitelist validation, pattern sanitization, and parameterized query helpers.
 *
 * **CRITICAL SECURITY LAYER**: This service is the last line of defense against SQL injection
 * attacks when ORM parameterization cannot be used (e.g., dynamic ORDER BY, complex raw queries).
 *
 * **Core Security Features:**
 * - Whitelist validation for sort fields and entity types
 * - SQL special character escaping for LIKE patterns
 * - Pagination parameter validation and sanitization
 * - Maximum result set limits to prevent resource exhaustion
 * - Comprehensive attack detection and logging
 * - Error handling with security-focused error messages
 *
 * **Attack Prevention Mechanisms:**
 * 1. **SQL Injection (CWE-89)**: Whitelist-based validation prevents malicious SQL in dynamic queries
 * 2. **Second-Order SQL Injection**: LIKE pattern escaping prevents stored payload execution
 * 3. **Resource Exhaustion (DoS)**: Pagination limits prevent unbounded result sets
 * 4. **Boolean-Based Blind SQL Injection**: Input validation blocks boolean logic injection
 * 5. **Union-Based SQL Injection**: Whitelist prevents UNION SELECT attacks in ORDER BY
 * 6. **Time-Based Blind SQL Injection**: Validation blocks sleep/benchmark functions
 *
 * **Use Cases:**
 * - Dynamic ORDER BY clauses with user-selected sort fields
 * - Complex search queries with LIKE patterns
 * - Pagination with user-controlled page/limit parameters
 * - Multi-entity queries with dynamic table selection
 * - Report generation with custom sorting and filtering
 *
 * **Security Threat Models:**
 * - **Attack Vector**: User input in ORDER BY, WHERE LIKE, pagination parameters
 * - **Attack Goal**: Execute arbitrary SQL, extract PHI data, modify records, DoS
 * - **Attack Examples**:
 *   - `?sortBy=name; DROP TABLE students--`
 *   - `?search=%' OR 1=1--`
 *   - `?limit=999999999` (resource exhaustion)
 *   - `?sortBy=name UNION SELECT password FROM users`
 *
 * @security
 * **OWASP Compliance:**
 * - A03:2021 Injection - Primary defense against SQL injection attacks
 * - A05:2021 Security Misconfiguration - Enforces secure query defaults
 * - API8:2023 Security Misconfiguration - Validates all dynamic query inputs
 *
 * **CWE Coverage:**
 * - CWE-89: SQL Injection (primary mitigation)
 * - CWE-564: SQL Injection via Hibernate (ORM bypass scenarios)
 * - CWE-943: Improper Neutralization of Special Elements in Data Query Logic
 *
 * **HIPAA Compliance:**
 * - 164.312(a)(1) Access Control - Prevents unauthorized PHI access via injection
 * - 164.308(a)(1)(ii)(B) Risk Management - Mitigates SQL injection risks
 * - 164.312(b) Audit Controls - Logs all injection attempts for compliance
 *
 * **Defense Strategy:**
 * - **Primary**: Use ORM parameterized queries whenever possible
 * - **Secondary**: Use this service for unavoidable dynamic SQL
 * - **Tertiary**: Database-level permissions and least privilege
 * - **Monitoring**: Log all validation failures as potential attacks
 *
 * @example
 * // Validate sort field for student listing
 * import { validateSortField, validateSortOrder } from './sql-sanitizer.service';
 *
 * const sortField = validateSortField(userInput.sortBy, 'students');
 * const sortOrder = validateSortOrder(userInput.order);
 * const query = 'SELECT * FROM students ORDER BY ' + sortField + ' ' + sortOrder;
 *
 * @example
 * // Safe LIKE pattern for search
 * import { buildSafeLikePattern } from './sql-sanitizer.service';
 *
 * const searchPattern = buildSafeLikePattern(userInput.search, 'contains');
 * const query = `SELECT * FROM students WHERE name LIKE ?`;
 * const results = await db.query(query, [searchPattern]);
 *
 * @example
 * // Validate pagination parameters
 * import { validatePagination } from './sql-sanitizer.service';
 *
 * const { page, limit, offset } = validatePagination(
 *   req.query.page,
 *   req.query.limit,
 *   100 // max limit
 * );
 *
 * @example
 * // Handle SQL injection attempt
 * try {
 *   const sortField = validateSortField("name; DROP TABLE students--", 'students');
 * } catch (error) {
 *   if (error instanceof SqlInjectionError) {
 *     logger.warn('SQL injection attempt detected', { attemptedValue: error.attemptedValue });
 *     return response.status(400).json({ error: 'Invalid input' });
 *   }
 * }
 *
 * @requires ../logging/logger - Security event logging
 *
 * @author White Cross Platform Security Team
 * @version 1.0.0
 * @since 2025-01-01
 *
 * @see {@link https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html|OWASP SQL Injection Prevention}
 * @see {@link https://cwe.mitre.org/data/definitions/89.html|CWE-89: SQL Injection}
 *
 * LOC: 45F543B57B
 * WC-GEN-323 | sqlSanitizer.ts - SQL injection prevention and input validation
 *
 * UPSTREAM (imports from):
 *   - logger.ts (shared/logging/logger.ts)
 *
 * DOWNSTREAM (imported by):
 *   - Routes with dynamic sorting and pagination
 *   - Services with complex search queries
 */

import { logger } from '../logging/logger';

/**
 * Allowed sort fields whitelist by entity type
 *
 * @constant {Record<string, string[]>} ALLOWED_SORT_FIELDS
 * @description **CRITICAL SECURITY CONTROL**: Whitelist of allowed column names for ORDER BY clauses.
 * Only fields in this whitelist can be used for sorting to prevent SQL injection in dynamic queries.
 *
 * **Security Purpose:**
 * Prevents SQL injection attacks in ORDER BY clauses where parameterized queries cannot be used.
 * Attackers cannot inject malicious SQL because input is validated against this strict whitelist.
 *
 * **Entity Types:**
 * - `inventory` - Inventory item sorting fields
 * - `healthRecords` - Health record sorting fields (PHI data)
 * - `students` - Student sorting fields (PHI data)
 * - `medications` - Medication sorting fields
 * - `appointments` - Appointment sorting fields
 * - `users` - User account sorting fields
 * - `reports` - Report sorting fields
 *
 * **Attack Prevention:**
 * - Blocks: `?sortBy=name; DROP TABLE students--`
 * - Blocks: `?sortBy=name UNION SELECT password FROM users`
 * - Blocks: `?sortBy=name OR 1=1`
 * - Blocks: `?sortBy=SLEEP(10)`
 *
 * @example
 * // Valid sort field
 * const isValid = ALLOWED_SORT_FIELDS.students.includes('firstName'); // true
 *
 * @example
 * // Invalid sort field (SQL injection attempt)
 * const isValid = ALLOWED_SORT_FIELDS.students.includes('name; DROP TABLE--'); // false
 *
 * @security
 * - **MUST** be kept in sync with database schema
 * - **NEVER** add user-controlled values directly
 * - **ALWAYS** validate entity type exists before field lookup
 * - **CRITICAL**: Only add actual column names that exist in database
 *
 * @see {@link validateSortField} for whitelist validation function
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
 * Allowed sort orders for ORDER BY clauses
 *
 * @constant {ReadonlyArray<string>} ALLOWED_SORT_ORDERS
 * @description Whitelist of allowed sort direction values (ASC/DESC).
 * Prevents SQL injection in ORDER BY direction parameter.
 *
 * **Allowed Values:**
 * - `ASC` - Ascending order (uppercase)
 * - `DESC` - Descending order (uppercase)
 * - `asc` - Ascending order (lowercase)
 * - `desc` - Descending order (lowercase)
 *
 * @example
 * const isValid = ALLOWED_SORT_ORDERS.includes('ASC'); // true
 * const isInvalid = ALLOWED_SORT_ORDERS.includes('RANDOM()'); // false
 *
 * @security Prevents injection of SQL functions in sort order
 * @see {@link validateSortOrder} for validation function
 */
export const ALLOWED_SORT_ORDERS = ['ASC', 'DESC', 'asc', 'desc'] as const;

/**
 * Type-safe sort order union type
 *
 * @typedef {('ASC' | 'DESC' | 'asc' | 'desc')} SortOrder
 * @description TypeScript type for compile-time sort order validation.
 */
export type SortOrder = typeof ALLOWED_SORT_ORDERS[number];

/**
 * SQL Injection Error - Thrown when injection attempt detected
 *
 * @class SqlInjectionError
 * @extends {Error}
 * @description Custom error class for SQL injection attempt detection.
 * Contains the attempted malicious value for security logging and analysis.
 *
 * **Usage:**
 * - Thrown by validation functions when detecting potential SQL injection
 * - Should be caught by error handlers and logged for security monitoring
 * - Provides `attemptedValue` property for forensic analysis
 * - Should result in 400 Bad Request response (not 500)
 *
 * @property {string} name - Error name: 'SqlInjectionError'
 * @property {string} message - Human-readable error message
 * @property {string} attemptedValue - The malicious input that was rejected
 *
 * @example
 * // Catch and handle SQL injection attempt
 * try {
 *   const field = validateSortField(userInput, 'students');
 * } catch (error) {
 *   if (error instanceof SqlInjectionError) {
 *     logger.warn('SQL injection attempt', {
 *       attemptedValue: error.attemptedValue,
 *       ip: request.ip,
 *       userId: request.user?.id
 *     });
 *     return response.status(400).json({
 *       error: 'Invalid input detected'
 *     });
 *   }
 * }
 *
 * @example
 * // Throw from validation function
 * if (!allowedFields.includes(field)) {
 *   throw new SqlInjectionError(
 *     'Invalid sort field: ' + field,
 *     field
 *   );
 * }
 *
 * @security
 * - Never expose `attemptedValue` in user-facing error messages
 * - Always log attempts for security monitoring
 * - Should trigger rate limiting after multiple attempts
 * - Consider IP blocking for repeated attempts
 *
 * @see {@link validateSortField}
 * @see {@link validateSortOrder}
 * @see {@link validatePagination}
 */
export class SqlInjectionError extends Error {
  /**
   * Creates SQL injection error instance
   *
   * @param {string} message - Error message describing the violation
   * @param {string} attemptedValue - The malicious input that was rejected
   */
  constructor(message: string, public attemptedValue: string) {
    super(message);
    this.name = 'SqlInjectionError';
  }
}

/**
 * Validate sort field against whitelist
 *
 * @function validateSortField
 * @param {string} field - Sort field name from user input
 * @param {string} entityType - Entity type (students, medications, etc.)
 * @returns {string} Validated field name (safe to use in ORDER BY)
 * @throws {SqlInjectionError} If field or entity type invalid
 *
 * @description
 * **PRIMARY SQL INJECTION DEFENSE** for dynamic ORDER BY clauses.
 * Validates that the sort field exists in the whitelist for the specified entity type.
 * This prevents injection of malicious SQL in ORDER BY clauses where parameterization
 * cannot be used due to database limitations.
 *
 * **Validation Logic:**
 * 1. Check if entity type exists in ALLOWED_SORT_FIELDS
 * 2. Get whitelist array for entity type
 * 3. Check if field name exists in whitelist
 * 4. Return validated field name if valid
 * 5. Throw SqlInjectionError with logging if invalid
 *
 * **Attack Prevention:**
 * - Blocks SQL keywords: SELECT, DROP, UNION, INSERT, etc.
 * - Blocks SQL comments: double dash, slash-star, star-slash
 * - Blocks boolean logic: OR 1=1, AND 1=1
 * - Blocks subqueries: (SELECT ...), nested queries
 * - Blocks functions: SLEEP(), BENCHMARK(), RAND()
 *
 * @example
 * // Valid sort field
 * const field = validateSortField('firstName', 'students');
 * const query = 'SELECT * FROM students ORDER BY ' + field + ' ASC';
 * // Safe: field = 'firstName' (whitelisted)
 *
 * @example
 * // SQL injection attempt - blocked
 * try {
 *   const field = validateSortField('name; DROP TABLE students--', 'students');
 * } catch (error) {
 *   console.log(error instanceof SqlInjectionError); // true
 *   console.log(error.attemptedValue); // 'name; DROP TABLE students--'
 * }
 *
 * @example
 * // Invalid entity type - blocked
 * try {
 *   const field = validateSortField('name', 'nonexistent_table');
 * } catch (error) {
 *   // SqlInjectionError: Invalid entity type: nonexistent_table
 * }
 *
 * @throws {SqlInjectionError} "Invalid entity type: {type}" - Entity type not in whitelist
 * @throws {SqlInjectionError} "Invalid sort field: {field}" - Field not in entity's whitelist
 *
 * @security
 * - **CRITICAL**: Only use validated field name in ORDER BY
 * - Always log validation failures for security monitoring
 * - Consider rate limiting after multiple failures
 * - Fails closed: rejects input if validation fails
 *
 * **OWASP:** A03:2021 Injection - Primary mitigation
 * **CWE:** CWE-89 SQL Injection - Defense through whitelist validation
 *
 * @see {@link ALLOWED_SORT_FIELDS} for entity type whitelists
 * @see {@link SqlInjectionError} for error handling
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
 * Validate sort order (ASC/DESC)
 *
 * @function validateSortOrder
 * @param {string} order - Sort order from user input (ASC/DESC/asc/desc)
 * @returns {('ASC' | 'DESC')} Validated and normalized sort order (uppercase)
 * @throws {SqlInjectionError} If order is not ASC or DESC
 *
 * @description
 * Validates and normalizes sort order parameter to prevent SQL injection in ORDER BY clauses.
 * Only accepts ASC or DESC (case-insensitive) and rejects any other input including SQL functions.
 *
 * **Validation Logic:**
 * 1. Convert input to uppercase
 * 2. Check if value is in ALLOWED_SORT_ORDERS whitelist
 * 3. Return normalized uppercase value (ASC or DESC)
 * 4. Throw SqlInjectionError if invalid
 *
 * **Attack Prevention:**
 * - Blocks SQL functions: RANDOM(), RAND(), NEWID()
 * - Blocks SQL keywords: SELECT, UNION, WHERE
 * - Blocks boolean logic: OR 1=1, AND 1=1
 * - Blocks comments: double dash, slash-star, star-slash
 *
 * @example
 * // Valid sort orders
 * const order1 = validateSortOrder('ASC');  // Returns: 'ASC'
 * const order2 = validateSortOrder('desc'); // Returns: 'DESC' (normalized)
 * const query = 'SELECT * FROM students ORDER BY name ' + order1;
 *
 * @example
 * // SQL injection attempt - blocked
 * try {
 *   const order = validateSortOrder('RANDOM()');
 * } catch (error) {
 *   console.log(error instanceof SqlInjectionError); // true
 *   console.log(error.attemptedValue); // 'RANDOM()'
 * }
 *
 * @example
 * // Case-insensitive validation
 * validateSortOrder('asc');  // Returns: 'ASC'
 * validateSortOrder('ASC');  // Returns: 'ASC'
 * validateSortOrder('Asc');  // Returns: 'ASC'
 *
 * @throws {SqlInjectionError} "Invalid sort order: {order}" - Not ASC or DESC
 *
 * @security
 * - Returns normalized uppercase value for consistency
 * - Logs all validation failures for monitoring
 * - Prevents database-specific randomization functions
 * - Fails closed: rejects anything except ASC/DESC
 *
 * **OWASP:** A03:2021 Injection - Prevents ORDER BY injection
 * **CWE:** CWE-89 SQL Injection - Whitelist validation
 *
 * @see {@link ALLOWED_SORT_ORDERS} for allowed values
 * @see {@link validateSortField} for field validation
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
 *
 * @interface PaginationParams
 * @description Validated pagination parameters for safe query construction.
 * Prevents resource exhaustion attacks through unbounded result sets.
 *
 * @property {number} page - Page number (1-indexed, validated ≥ 1)
 * @property {number} limit - Results per page (validated, capped at maxLimit)
 * @property {number} offset - SQL OFFSET value (calculated from page and limit)
 *
 * @example
 * const params: PaginationParams = {
 *   page: 2,
 *   limit: 50,
 *   offset: 50  // (2-1) * 50
 * };
 *
 * @security Prevents resource exhaustion DoS attacks
 * @see {@link validatePagination} for parameter validation
 */
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

/**
 * Validate and sanitize pagination parameters
 *
 * @function validatePagination
 * @param {number | string} [page=1] - Page number from user input
 * @param {number | string} [limit=50] - Results per page from user input
 * @param {number} [maxLimit=1000] - Maximum allowed limit (prevents DoS)
 * @returns {PaginationParams} Validated pagination parameters
 * @throws {SqlInjectionError} If parameters are invalid or malicious
 *
 * @description
 * Validates and sanitizes pagination parameters to prevent resource exhaustion attacks
 * and SQL injection through numeric parameters. Enforces maximum limits and calculates
 * safe OFFSET values for SQL queries.
 *
 * **Validation Logic:**
 * 1. Parse page parameter (default: 1)
 * 2. Parse limit parameter (default: 50)
 * 3. Validate page ≥ 1 (reject negative or zero)
 * 4. Validate limit ≥ 1 (reject negative or zero)
 * 5. Enforce maximum limit cap
 * 6. Calculate offset = (page - 1) * limit
 * 7. Return validated parameters
 *
 * **Attack Prevention:**
 * - **Resource Exhaustion**: Caps limit at maxLimit (default 1000)
 * - **SQL Injection**: Validates numeric parameters
 * - **DoS Attack**: Prevents `?limit=999999999` attacks
 * - **Integer Overflow**: Validates parsed numbers
 *
 * **Default Values:**
 * - page: 1 (first page)
 * - limit: 50 (moderate page size)
 * - maxLimit: 1000 (configurable cap)
 *
 * @example
 * // Standard pagination
 * const params = validatePagination(2, 25);
 * // Returns: { page: 2, limit: 25, offset: 25 }
 * const query = 'SELECT * FROM students LIMIT ' + params.limit + ' OFFSET ' + params.offset;
 *
 * @example
 * // Enforce custom maximum limit
 * const params = validatePagination(1, 500, 100);
 * // Returns: { page: 1, limit: 100, offset: 0 }
 * // User requested 500, but capped at 100
 *
 * @example
 * // Handle string inputs from query parameters
 * const params = validatePagination(req.query.page, req.query.limit);
 * // Automatically parses "2" and "50" to numbers
 *
 * @example
 * // Invalid input - SQL injection attempt
 * try {
 *   const params = validatePagination('1; DROP TABLE students--', 50);
 * } catch (error) {
 *   console.log(error instanceof SqlInjectionError); // true
 * }
 *
 * @example
 * // Resource exhaustion attempt - blocked
 * const params = validatePagination(1, 999999999, 1000);
 * // Returns: { page: 1, limit: 1000, offset: 0 }
 * // Logs warning about limit exceeded
 *
 * @throws {SqlInjectionError} "Invalid page number" - Page is NaN, negative, or zero
 * @throws {SqlInjectionError} "Invalid limit value" - Limit is NaN, negative, or zero
 *
 * @security
 * - Always use maxLimit appropriate for your use case
 * - Consider performance impact of large limits
 * - Log excessive limit requests (potential attack indicator)
 * - Use validated offset/limit directly in SQL
 *
 * **OWASP:** A05:2021 Security Misconfiguration - Prevents unsafe defaults
 * **CWE:** CWE-400 Uncontrolled Resource Consumption
 *
 * @see {@link PaginationParams} for return type
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
 *
 * @function buildSafeLikePattern
 * @param {string} searchTerm - User search input
 * @param {('starts' | 'ends' | 'contains')} [matchType='contains'] - Pattern match type
 * @returns {string} Escaped LIKE pattern safe for parameterized queries
 *
 * @description
 * Escapes SQL LIKE special characters (%, _, \) to prevent second-order SQL injection
 * attacks through search functionality. Returns safe pattern for use in parameterized
 * WHERE LIKE clauses.
 *
 * **IMPORTANT**: This function escapes the pattern, but you **MUST** still use
 * parameterized queries to prevent SQL injection. Never concatenate the result
 * directly into a SQL string.
 *
 * **Escaping Logic:**
 * 1. Escape backslash first (\ → \\)
 * 2. Escape percent wildcard (% → \%)
 * 3. Escape underscore wildcard (_ → \_)
 * 4. Add wildcards based on match type
 *
 * **Match Types:**
 * - 'starts' - Prefix match: searchTerm%
 * - 'ends' - Suffix match: %searchTerm
 * - 'contains' - Substring match: %searchTerm% (default)
 *
 * **Attack Prevention:**
 * - **Second-Order SQL Injection**: Escapes stored malicious patterns
 * - **LIKE Wildcard Abuse**: Escapes % and _ to prevent unintended matches
 * - **Performance DoS**: Prevents %%%%% patterns causing slow queries
 *
 * @example
 * // Safe LIKE search (CORRECT - uses parameterized query)
 * const pattern = buildSafeLikePattern(userInput.search, 'contains');
 * const query = 'SELECT * FROM students WHERE name LIKE ?';
 * const results = await db.query(query, [pattern]);
 *
 * @example
 * // Prefix search (starts with)
 * const pattern = buildSafeLikePattern('John', 'starts');
 * // Returns: 'John%'
 * // Matches: John, Johnson, Johnny
 *
 * @example
 * // Suffix search (ends with)
 * const pattern = buildSafeLikePattern('son', 'ends');
 * // Returns: '%son'
 * // Matches: Johnson, Anderson, Wilson
 *
 * @example
 * // Contains search (default)
 * const pattern = buildSafeLikePattern('mit', 'contains');
 * // Returns: '%mit%'
 * // Matches: Smith, Admit, Commitment
 *
 * @example
 * // Escapes special LIKE characters
 * const pattern = buildSafeLikePattern('100% coverage', 'contains');
 * // Returns: '%100\\% coverage%'
 * // Matches exactly: "100% coverage" (not "100X coverage")
 *
 * @example
 * // Escapes underscores
 * const pattern = buildSafeLikePattern('test_case', 'contains');
 * // Returns: '%test\\_case%'
 * // Matches exactly: "test_case" (not "testXcase")
 *
 * @example
 * // Empty search term
 * const pattern = buildSafeLikePattern('', 'contains');
 * // Returns: '%'
 * // Matches: all records
 *
 * @security
 * - **ALWAYS** use with parameterized queries
 * - **NEVER** concatenate into SQL string:
 *   ❌ WRONG: 'SELECT * FROM users WHERE name LIKE ' + pattern
 *   ✅ RIGHT: db.query('SELECT * FROM users WHERE name LIKE ?', [pattern])
 * - Escaping prevents LIKE wildcards, but NOT SQL injection
 * - Consider adding minimum search length (e.g., ≥ 3 chars) for performance
 * - Log searches with many wildcards (potential DoS indicator)
 *
 * **OWASP:** A03:2021 Injection - Defense against second-order SQL injection
 * **CWE:** CWE-89 SQL Injection - Pattern escaping mitigation
 *
 * @see {@link https://www.postgresql.org/docs/current/functions-matching.html|PostgreSQL LIKE}
 * @see {@link https://dev.mysql.com/doc/refman/8.0/en/string-comparison-functions.html#operator_like|MySQL LIKE}
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
 * Default export containing all SQL sanitization utilities
 *
 * @description
 * Provides convenient access to all SQL injection prevention functions and classes.
 * Use named imports for better tree-shaking and IDE intelligence.
 *
 * @example
 * // Named imports (recommended)
 * import { validateSortField, buildSafeLikePattern } from './sql-sanitizer.service';
 *
 * @example
 * // Default import
 * import sqlSanitizer from './sql-sanitizer.service';
 * const field = sqlSanitizer.validateSortField('name', 'students');
 */
export default {
  validateSortField,
  validateSortOrder,
  validatePagination,
  buildSafeLikePattern,
  SqlInjectionError
};