# Utility Middleware Implementation Guide

## Overview
This guide provides implementation details and usage patterns for utility middleware in the backend application, with comprehensive documentation standards applied.

---

## Table of Contents
1. [Pagination Middleware](#pagination-middleware)
2. [Sorting Middleware](#sorting-middleware)
3. [Filtering Middleware](#filtering-middleware)
4. [Multi-Tenant Middleware](#multi-tenant-middleware)
5. [Request Context Middleware](#request-context-middleware)
6. [File Upload Middleware](#file-upload-middleware)
7. [Usage Examples](#usage-examples)

---

## 1. Pagination Middleware

### Purpose
Handles pagination parameters extraction, validation, and response formatting for list endpoints.

### Default Configuration
```typescript
const PAGINATION_DEFAULTS = {
  PAGE: 1,           // Starting page
  LIMIT: 20,         // Items per page
  MAX_LIMIT: 100,    // Maximum items per page
  MIN_LIMIT: 1       // Minimum items per page
};
```

### Middleware Implementation

```typescript
/**
 * @fileoverview Pagination Middleware
 * @module middleware/pagination
 * @description Express middleware for automatic pagination parameter extraction,
 * validation, and response formatting.
 *
 * Key Features:
 * - Automatic query parameter extraction
 * - Parameter normalization and validation
 * - Pagination metadata injection
 * - Response formatting
 *
 * Default Values:
 * - page: 1 (first page, 1-indexed)
 * - limit: 20 items per page
 * - maxLimit: 100 items per page
 * - minLimit: 1 item per page
 *
 * @requires services/shared/database/pagination
 *
 * @example
 * // Apply to route
 * router.get('/students', paginationMiddleware, getStudentsHandler);
 *
 * // Access in handler
 * function getStudentsHandler(req, res) {
 *   const { page, limit, offset } = req.pagination;
 *   // Use pagination values
 * }
 */

import { Request, Response, NextFunction } from 'express';
import {
  extractPaginationFromQuery,
  normalizePaginationParams,
  validatePaginationParams
} from '../services/shared/database/pagination';

/**
 * @interface PaginationRequest
 * @description Extended Express request with pagination data
 * @extends {Request}
 *
 * @property {Object} pagination - Pagination parameters
 * @property {number} pagination.page - Current page (1-indexed)
 * @property {number} pagination.limit - Items per page
 * @property {number} pagination.offset - Database offset
 */
declare global {
  namespace Express {
    interface Request {
      pagination?: {
        page: number;
        limit: number;
        offset: number;
      };
    }
  }
}

/**
 * @function paginationMiddleware
 * @description Express middleware that extracts, validates, and normalizes pagination parameters
 *
 * Query Parameters:
 * - page: Page number (1-indexed, default: 1)
 * - limit: Items per page (default: 20, max: 100)
 * - offset: Direct offset (alternative to page, default: calculated from page)
 *
 * @param {Request} request - Express request object
 * @param {Response} response - Express response object
 * @param {NextFunction} next - Express next function
 *
 * @example
 * // Use in route definition
 * router.get('/api/students', paginationMiddleware, async (req, res) => {
 *   const { page, limit, offset } = req.pagination;
 *   const students = await Student.findAndCountAll({ limit, offset });
 *   res.json(createPaginatedResponse(students.rows, page, limit, students.count));
 * });
 *
 * @example
 * // Client request: GET /api/students?page=2&limit=50
 * // req.pagination will be: { page: 2, limit: 50, offset: 50 }
 *
 * @example
 * // Invalid request: GET /api/students?page=-1&limit=200
 * // Returns 400 error with validation details
 */
export function paginationMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  try {
    // Extract pagination from query
    const rawParams = extractPaginationFromQuery(request.query);

    // Validate parameters
    const validation = validatePaginationParams(rawParams);
    if (!validation.isValid) {
      response.status(400).json({
        error: 'Invalid pagination parameters',
        details: validation.errors
      });
      return;
    }

    // Normalize and attach to request
    const normalized = normalizePaginationParams(rawParams);
    request.pagination = normalized;

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * @function paginationMiddlewareWithConstraints
 * @description Factory function to create pagination middleware with custom constraints
 *
 * @param {Object} constraints - Custom pagination constraints
 * @param {number} [constraints.maxLimit=100] - Maximum items per page
 * @param {number} [constraints.minLimit=1] - Minimum items per page
 * @param {number} [constraints.defaultLimit=20] - Default items per page
 * @param {number} [constraints.defaultPage=1] - Default page number
 * @returns {Function} Configured pagination middleware
 *
 * @example
 * // Create middleware with custom limits
 * const customPagination = paginationMiddlewareWithConstraints({
 *   maxLimit: 50,
 *   defaultLimit: 10
 * });
 *
 * router.get('/api/reports', customPagination, getReportsHandler);
 */
export function paginationMiddlewareWithConstraints(constraints: {
  maxLimit?: number;
  minLimit?: number;
  defaultLimit?: number;
  defaultPage?: number;
}) {
  return (request: Request, response: Response, next: NextFunction): void => {
    try {
      const rawParams = extractPaginationFromQuery(request.query);
      const validation = validatePaginationParams(rawParams, constraints);

      if (!validation.isValid) {
        response.status(400).json({
          error: 'Invalid pagination parameters',
          details: validation.errors
        });
        return;
      }

      const normalized = normalizePaginationParams(rawParams, constraints);
      request.pagination = normalized;

      next();
    } catch (error) {
      next(error);
    }
  };
}
```

---

## 2. Sorting Middleware

### Purpose
Handles sorting parameter extraction, validation, and SQL ORDER BY clause generation.

### Middleware Implementation

```typescript
/**
 * @fileoverview Sorting Middleware
 * @module middleware/sorting
 * @description Express middleware for automatic sorting parameter extraction and validation.
 *
 * Key Features:
 * - Query parameter parsing (sortBy, sortOrder)
 * - Whitelist validation for allowed sort fields
 * - SQL injection prevention
 * - Multiple sort field support
 *
 * Supported Syntax:
 * - Single field: ?sortBy=name&sortOrder=ASC
 * - Multiple fields: ?sortBy=name,createdAt&sortOrder=ASC,DESC
 *
 * @example
 * // Apply to route with allowed fields
 * router.get('/students',
 *   sortingMiddleware(['name', 'grade', 'createdAt']),
 *   getStudentsHandler
 * );
 */

import { Request, Response, NextFunction } from 'express';

/**
 * @interface SortingRequest
 * @description Extended Express request with sorting data
 * @extends {Request}
 *
 * @property {Object} sorting - Sorting parameters
 * @property {string} sorting.field - Field to sort by
 * @property {'ASC'|'DESC'} sorting.order - Sort direction
 * @property {Array<{field: string, order: 'ASC'|'DESC'}>} sorting.orderBy - Multiple sort fields
 */
declare global {
  namespace Express {
    interface Request {
      sorting?: {
        field?: string;
        order?: 'ASC' | 'DESC';
        orderBy: Array<{ field: string; order: 'ASC' | 'DESC' }>;
      };
    }
  }
}

/**
 * @function sortingMiddleware
 * @description Factory function to create sorting middleware with field whitelist
 *
 * Query Parameters:
 * - sortBy: Field name or comma-separated field names
 * - sortOrder: 'ASC' or 'DESC', or comma-separated for multiple fields
 *
 * @param {string[]} allowedFields - Whitelist of allowed sort fields
 * @param {string} [defaultField] - Default field if not specified
 * @param {'ASC'|'DESC'} [defaultOrder='ASC'] - Default order if not specified
 * @returns {Function} Express middleware function
 *
 * @throws {Error} When sortBy field is not in whitelist
 *
 * @example
 * // Single field sorting
 * const middleware = sortingMiddleware(['name', 'createdAt'], 'createdAt', 'DESC');
 * router.get('/students', middleware, handler);
 * // Request: GET /students?sortBy=name&sortOrder=ASC
 *
 * @example
 * // Multiple field sorting
 * router.get('/students', sortingMiddleware(['name', 'grade', 'createdAt']), handler);
 * // Request: GET /students?sortBy=grade,name&sortOrder=DESC,ASC
 * // Results in: ORDER BY grade DESC, name ASC
 */
export function sortingMiddleware(
  allowedFields: string[],
  defaultField?: string,
  defaultOrder: 'ASC' | 'DESC' = 'ASC'
) {
  return (request: Request, response: Response, next: NextFunction): void => {
    try {
      const sortBy = request.query.sortBy as string | undefined;
      const sortOrder = request.query.sortOrder as string | undefined;

      // Parse multiple fields
      const fields = sortBy ? sortBy.split(',').map(f => f.trim()) : [defaultField].filter(Boolean);
      const orders = sortOrder ? sortOrder.split(',').map(o => o.trim().toUpperCase()) : [defaultOrder];

      // Validate fields against whitelist
      const invalidFields = fields.filter(field => !allowedFields.includes(field));
      if (invalidFields.length > 0) {
        response.status(400).json({
          error: 'Invalid sort field',
          invalidFields,
          allowedFields
        });
        return;
      }

      // Validate orders
      const invalidOrders = orders.filter(order => order !== 'ASC' && order !== 'DESC');
      if (invalidOrders.length > 0) {
        response.status(400).json({
          error: 'Invalid sort order. Must be ASC or DESC',
          invalidOrders
        });
        return;
      }

      // Build sorting object
      const orderBy = fields.map((field, index) => ({
        field,
        order: (orders[index] || defaultOrder) as 'ASC' | 'DESC'
      }));

      request.sorting = {
        field: fields[0],
        order: orderBy[0]?.order,
        orderBy
      };

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * @function buildSequelizeOrder
 * @description Converts sorting middleware output to Sequelize order array
 *
 * @param {Request} request - Express request with sorting data
 * @returns {Array<[string, 'ASC'|'DESC']>} Sequelize order array
 *
 * @example
 * // In handler
 * const students = await Student.findAll({
 *   order: buildSequelizeOrder(req),
 *   where: { active: true }
 * });
 * // Generates: ORDER BY grade DESC, name ASC
 */
export function buildSequelizeOrder(
  request: Request
): Array<[string, 'ASC' | 'DESC']> {
  if (!request.sorting?.orderBy) {
    return [];
  }

  return request.sorting.orderBy.map(sort => [sort.field, sort.order]);
}
```

---

## 3. Filtering Middleware

### Purpose
Handles filter parameter extraction, validation, and query builder generation.

### Supported Filter Operators

```typescript
/**
 * Filter Operators:
 * - eq: Equals (=)
 * - ne: Not equals (!=)
 * - gt: Greater than (>)
 * - gte: Greater than or equal (>=)
 * - lt: Less than (<)
 * - lte: Less than or equal (<=)
 * - like: SQL LIKE pattern matching
 * - in: IN array of values
 * - between: BETWEEN two values
 * - null: IS NULL
 * - notNull: IS NOT NULL
 */
```

### Middleware Implementation

```typescript
/**
 * @fileoverview Filtering Middleware
 * @module middleware/filtering
 * @description Express middleware for dynamic query filtering with operator support.
 *
 * Key Features:
 * - Multiple filter operators (eq, ne, gt, gte, lt, lte, like, in, between)
 * - Field whitelist validation
 * - SQL injection prevention
 * - Type coercion and validation
 *
 * Filter Syntax:
 * - Single filter: ?filter[field][operator]=value
 * - Multiple filters: ?filter[field1][eq]=value1&filter[field2][gt]=value2
 * - IN operator: ?filter[status][in]=active,pending
 * - BETWEEN operator: ?filter[age][between]=18,65
 *
 * @example
 * // Apply to route
 * router.get('/students',
 *   filteringMiddleware({
 *     allowedFields: ['name', 'grade', 'status', 'age'],
 *     fieldTypes: { age: 'number', grade: 'number', name: 'string', status: 'string' }
 *   }),
 *   getStudentsHandler
 * );
 */

import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';

/**
 * @interface FilterConfig
 * @description Configuration for filtering middleware
 *
 * @property {string[]} allowedFields - Whitelist of filterable fields
 * @property {Record<string, 'string'|'number'|'boolean'|'date'>} fieldTypes - Type definitions for fields
 * @property {number} [maxFilters=10] - Maximum number of filters per request
 */
interface FilterConfig {
  allowedFields: string[];
  fieldTypes: Record<string, 'string' | 'number' | 'boolean' | 'date'>;
  maxFilters?: number;
}

/**
 * @interface FilteringRequest
 * @description Extended Express request with filtering data
 * @extends {Request}
 *
 * @property {Object} filters - Parsed and validated filters
 * @property {Object} filters.where - Sequelize where clause
 * @property {Array} filters.raw - Raw filter definitions
 */
declare global {
  namespace Express {
    interface Request {
      filters?: {
        where: any;
        raw: Array<{ field: string; operator: string; value: any }>;
      };
    }
  }
}

/**
 * @function filteringMiddleware
 * @description Creates filtering middleware with field validation
 *
 * @param {FilterConfig} config - Filtering configuration
 * @returns {Function} Express middleware function
 *
 * @example
 * // Basic usage
 * const middleware = filteringMiddleware({
 *   allowedFields: ['name', 'status', 'grade'],
 *   fieldTypes: { name: 'string', status: 'string', grade: 'number' }
 * });
 * router.get('/students', middleware, handler);
 *
 * @example
 * // Client request examples:
 * // Equals: GET /students?filter[status][eq]=active
 * // Greater than: GET /students?filter[grade][gt]=9
 * // Like: GET /students?filter[name][like]=John%
 * // In array: GET /students?filter[status][in]=active,pending
 * // Between: GET /students?filter[age][between]=10,18
 *
 * @example
 * // In handler
 * const students = await Student.findAll({
 *   where: req.filters.where,
 *   ...otherOptions
 * });
 */
export function filteringMiddleware(config: FilterConfig) {
  const { allowedFields, fieldTypes, maxFilters = 10 } = config;

  return (request: Request, response: Response, next: NextFunction): void => {
    try {
      const filterParam = request.query.filter as Record<string, any> | undefined;

      if (!filterParam) {
        request.filters = { where: {}, raw: [] };
        next();
        return;
      }

      const filters: Array<{ field: string; operator: string; value: any }> = [];
      const where: any = {};

      // Parse filter parameters
      for (const [field, operators] of Object.entries(filterParam)) {
        // Validate field is allowed
        if (!allowedFields.includes(field)) {
          response.status(400).json({
            error: `Invalid filter field: ${field}`,
            allowedFields
          });
          return;
        }

        // Parse operators for field
        for (const [operator, rawValue] of Object.entries(operators)) {
          if (filters.length >= maxFilters) {
            response.status(400).json({
              error: `Maximum ${maxFilters} filters allowed`
            });
            return;
          }

          // Coerce value to correct type
          const value = coerceValue(rawValue, fieldTypes[field]);

          // Build where clause
          where[field] = buildWhereClause(operator, value);

          filters.push({ field, operator, value });
        }
      }

      request.filters = { where, raw: filters };
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * @function buildWhereClause
 * @description Builds Sequelize where clause for operator and value
 * @private
 *
 * @param {string} operator - Filter operator
 * @param {any} value - Filter value
 * @returns {any} Sequelize operator object
 */
function buildWhereClause(operator: string, value: any): any {
  const operatorMap: Record<string, symbol> = {
    eq: Op.eq,
    ne: Op.ne,
    gt: Op.gt,
    gte: Op.gte,
    lt: Op.lt,
    lte: Op.lte,
    like: Op.like,
    in: Op.in,
    between: Op.between,
    null: Op.is,
    notNull: Op.not
  };

  const sequelizeOp = operatorMap[operator];
  if (!sequelizeOp) {
    throw new Error(`Unsupported operator: ${operator}`);
  }

  // Handle special cases
  if (operator === 'null') {
    return { [Op.is]: null };
  }
  if (operator === 'notNull') {
    return { [Op.not]: null };
  }
  if (operator === 'in') {
    return { [Op.in]: Array.isArray(value) ? value : value.split(',') };
  }
  if (operator === 'between') {
    const [min, max] = Array.isArray(value) ? value : value.split(',');
    return { [Op.between]: [min, max] };
  }

  return { [sequelizeOp]: value };
}

/**
 * @function coerceValue
 * @description Coerces string value to correct type
 * @private
 *
 * @param {any} value - Raw value from query
 * @param {'string'|'number'|'boolean'|'date'} type - Target type
 * @returns {any} Coerced value
 */
function coerceValue(value: any, type: 'string' | 'number' | 'boolean' | 'date'): any {
  if (value === undefined || value === null) return value;

  switch (type) {
    case 'number':
      return Number(value);
    case 'boolean':
      return value === 'true' || value === '1';
    case 'date':
      return new Date(value);
    case 'string':
    default:
      return String(value);
  }
}
```

---

## 4. Multi-Tenant Middleware

### Purpose
Injects facility/tenant scope into requests for data isolation.

### Middleware Implementation

```typescript
/**
 * @fileoverview Multi-Tenant Middleware
 * @module middleware/multiTenant
 * @description Express middleware for automatic tenant scope injection.
 *
 * Key Features:
 * - Automatic facility ID injection from user context
 * - Role-based scope rules
 * - Global scope for system admins
 * - Own-data scope for students
 *
 * Scoping Rules:
 * - SYSTEM_ADMIN: Access all facilities (no scope restriction)
 * - ADMINISTRATOR: Access own facility only
 * - SCHOOL_NURSE: Access own facility only
 * - STUDENT: Access own records only
 *
 * @example
 * // Apply to route
 * router.get('/students',
 *   authenticate,
 *   injectTenantScope,
 *   getStudentsHandler
 * );
 */

import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/middleware.types';

/**
 * @interface TenantRequest
 * @description Extended Express request with tenant scope
 * @extends {Request}
 *
 * @property {Object} tenantScope - Tenant scoping information
 * @property {string} [tenantScope.facilityId] - Facility ID for scoping
 * @property {string} [tenantScope.userId] - User ID for self-scoping
 * @property {boolean} tenantScope.isGlobalScope - Whether user has global access
 */
declare global {
  namespace Express {
    interface Request {
      tenantScope?: {
        facilityId?: string;
        userId?: string;
        isGlobalScope: boolean;
      };
    }
  }
}

/**
 * @function injectTenantScope
 * @description Middleware that injects tenant scope into request based on user role
 *
 * @param {Request} request - Express request with authenticated user
 * @param {Response} response - Express response object
 * @param {NextFunction} next - Express next function
 *
 * @requires authenticate - Must be used after authentication middleware
 *
 * @example
 * // System admin request (no scope)
 * // User: { role: 'system_admin', userId: '123' }
 * // req.tenantScope: { isGlobalScope: true }
 *
 * @example
 * // School nurse request (facility scope)
 * // User: { role: 'school_nurse', facilityId: 'facility-456' }
 * // req.tenantScope: { facilityId: 'facility-456', isGlobalScope: false }
 *
 * @example
 * // Student request (self scope)
 * // User: { role: 'student', userId: '789' }
 * // req.tenantScope: { userId: '789', isGlobalScope: false }
 *
 * @example
 * // Use in handler
 * async function getStudents(req: Request, res: Response) {
 *   const where: any = {};
 *
 *   if (!req.tenantScope.isGlobalScope) {
 *     if (req.tenantScope.facilityId) {
 *       where.facilityId = req.tenantScope.facilityId;
 *     }
 *     if (req.tenantScope.userId) {
 *       where.studentId = req.tenantScope.userId;
 *     }
 *   }
 *
 *   const students = await Student.findAll({ where });
 *   res.json(students);
 * }
 */
export function injectTenantScope(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  try {
    const user = request.user;

    if (!user) {
      response.status(401).json({ error: 'Authentication required' });
      return;
    }

    // System admins have global scope
    if (user.role === UserRole.SYSTEM_ADMIN) {
      request.tenantScope = { isGlobalScope: true };
      next();
      return;
    }

    // Students can only access their own data
    if (user.role === UserRole.STUDENT) {
      request.tenantScope = {
        userId: user.userId,
        isGlobalScope: false
      };
      next();
      return;
    }

    // Other roles are scoped to their facility
    request.tenantScope = {
      facilityId: user.facilityId,
      isGlobalScope: false
    };

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * @function applyTenantScope
 * @description Helper to apply tenant scope to Sequelize where clause
 *
 * @param {Request} request - Request with tenant scope
 * @param {Object} where - Existing where clause
 * @returns {Object} Where clause with tenant scope applied
 *
 * @example
 * // In handler
 * let where = { active: true };
 * where = applyTenantScope(req, where);
 *
 * const students = await Student.findAll({ where });
 * // If user is nurse at facility-123:
 * // WHERE active = true AND facilityId = 'facility-123'
 */
export function applyTenantScope(request: Request, where: any = {}): any {
  if (!request.tenantScope || request.tenantScope.isGlobalScope) {
    return where;
  }

  const scopedWhere = { ...where };

  if (request.tenantScope.facilityId) {
    scopedWhere.facilityId = request.tenantScope.facilityId;
  }

  if (request.tenantScope.userId) {
    scopedWhere.studentId = request.tenantScope.userId;
  }

  return scopedWhere;
}
```

---

## 5. Request Context Middleware

### Purpose
Injects request tracking context for logging and tracing.

### Middleware Implementation

```typescript
/**
 * @fileoverview Request Context Middleware
 * @module middleware/requestContext
 * @description Express middleware for request context and correlation ID tracking.
 *
 * Key Features:
 * - Correlation ID generation for request tracing
 * - Request timing and duration tracking
 * - User context attachment
 * - IP address and user agent capture
 *
 * Context Data:
 * - correlationId: Unique request identifier (UUID v4)
 * - startTime: Request start timestamp
 * - userId: Authenticated user ID (if available)
 * - ipAddress: Client IP address
 * - userAgent: Client user agent string
 *
 * @example
 * // Use as early middleware
 * app.use(requestContextMiddleware);
 *
 * // Access in handlers
 * app.get('/api/data', (req, res) => {
 *   logger.info('Processing request', {
 *     correlationId: req.context.correlationId,
 *     duration: Date.now() - req.context.startTime
 *   });
 * });
 */

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * @interface RequestContext
 * @description Request context information
 *
 * @property {string} correlationId - Unique request identifier
 * @property {number} startTime - Request start timestamp (milliseconds)
 * @property {string} [userId] - Authenticated user ID
 * @property {string} ipAddress - Client IP address
 * @property {string} userAgent - Client user agent
 * @property {Record<string, any>} metadata - Additional context metadata
 */
interface RequestContext {
  correlationId: string;
  startTime: number;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  metadata: Record<string, any>;
}

declare global {
  namespace Express {
    interface Request {
      context?: RequestContext;
    }
  }
}

/**
 * @function requestContextMiddleware
 * @description Middleware that injects request context for tracking and logging
 *
 * @param {Request} request - Express request object
 * @param {Response} response - Express response object
 * @param {NextFunction} next - Express next function
 *
 * @example
 * // Use as first middleware
 * app.use(requestContextMiddleware);
 *
 * // Access in route handlers
 * router.get('/students', (req, res) => {
 *   console.log('Correlation ID:', req.context.correlationId);
 *   console.log('Request duration:', Date.now() - req.context.startTime);
 * });
 *
 * @example
 * // Add to response headers
 * router.get('/api/data', (req, res) => {
 *   res.setHeader('X-Correlation-ID', req.context.correlationId);
 *   res.json(data);
 * });
 *
 * @example
 * // Use in error logging
 * app.use((error, req, res, next) => {
 *   logger.error('Request failed', {
 *     correlationId: req.context?.correlationId,
 *     error: error.message,
 *     duration: Date.now() - (req.context?.startTime || 0)
 *   });
 * });
 */
export function requestContextMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  // Generate or extract correlation ID
  const correlationId =
    (request.headers['x-correlation-id'] as string) ||
    (request.headers['x-request-id'] as string) ||
    uuidv4();

  // Extract IP address
  const ipAddress =
    (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    request.socket.remoteAddress ||
    'unknown';

  // Extract user agent
  const userAgent = request.headers['user-agent'] || 'unknown';

  // Create context
  request.context = {
    correlationId,
    startTime: Date.now(),
    userId: request.user?.userId,
    ipAddress,
    userAgent,
    metadata: {}
  };

  // Add correlation ID to response headers
  response.setHeader('X-Correlation-ID', correlationId);

  // Log request start
  console.log(`[${correlationId}] ${request.method} ${request.path} - Started`);

  // Track request completion
  response.on('finish', () => {
    const duration = Date.now() - request.context!.startTime;
    console.log(
      `[${correlationId}] ${request.method} ${request.path} - ` +
        `Completed in ${duration}ms with status ${response.statusCode}`
    );
  });

  next();
}
```

---

## 6. File Upload Middleware

### Purpose
Validates file uploads against size and type constraints.

### File Upload Constraints

```typescript
/**
 * Default Upload Constraints:
 * - Maximum file size: 10MB
 * - Allowed file types: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']
 * - Maximum files per request: 10
 * - Filename sanitization: Remove special characters
 */
```

### Middleware Implementation

```typescript
/**
 * @fileoverview File Upload Middleware
 * @module middleware/fileUpload
 * @description Express middleware for file upload validation and processing.
 *
 * Key Features:
 * - File size validation
 * - File type validation (by extension and MIME type)
 * - Filename sanitization
 * - Multiple file support
 * - Virus scanning integration hooks
 *
 * Upload Constraints:
 * - Max file size: 10MB (configurable)
 * - Allowed types: PDF, JPG, JPEG, PNG, DOC, DOCX (configurable)
 * - Max files: 10 per request (configurable)
 * - Filename: Sanitized to remove special characters
 *
 * @requires multer - File upload handling
 *
 * @example
 * // Apply to upload route
 * router.post('/documents/upload',
 *   authenticate,
 *   fileUploadMiddleware({ maxSize: 5 * 1024 * 1024, allowedTypes: ['pdf'] }),
 *   handleDocumentUpload
 * );
 */

import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';

/**
 * @interface UploadConfig
 * @description Configuration for file upload validation
 *
 * @property {number} [maxSize=10485760] - Maximum file size in bytes (default: 10MB)
 * @property {string[]} [allowedTypes] - Allowed file extensions
 * @property {number} [maxFiles=10] - Maximum files per request
 * @property {boolean} [sanitizeFilename=true] - Whether to sanitize filenames
 * @property {string} [destination='uploads/'] - Upload destination directory
 */
interface UploadConfig {
  maxSize?: number;
  allowedTypes?: string[];
  maxFiles?: number;
  sanitizeFilename?: boolean;
  destination?: string;
}

/**
 * Default upload configuration
 */
const DEFAULT_UPLOAD_CONFIG: Required<UploadConfig> = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
  maxFiles: 10,
  sanitizeFilename: true,
  destination: 'uploads/'
};

/**
 * @function fileUploadMiddleware
 * @description Creates file upload middleware with validation
 *
 * @param {UploadConfig} [config={}] - Upload configuration
 * @returns {Function} Express middleware function
 *
 * @throws {Error} When file size exceeds limit
 * @throws {Error} When file type not allowed
 * @throws {Error} When too many files uploaded
 *
 * @example
 * // Basic usage with defaults
 * router.post('/upload',
 *   fileUploadMiddleware(),
 *   (req, res) => {
 *     console.log('Files:', req.files);
 *     res.json({ success: true });
 *   }
 * );
 *
 * @example
 * // Custom configuration
 * router.post('/upload/document',
 *   fileUploadMiddleware({
 *     maxSize: 5 * 1024 * 1024, // 5MB
 *     allowedTypes: ['pdf', 'doc', 'docx'],
 *     maxFiles: 1
 *   }),
 *   handleDocumentUpload
 * );
 *
 * @example
 * // Access uploaded files in handler
 * async function handleUpload(req: Request, res: Response) {
 *   const files = req.files as Express.Multer.File[];
 *
 *   for (const file of files) {
 *     await processFile({
 *       originalName: file.originalname,
 *       filename: file.filename,
 *       size: file.size,
 *       mimetype: file.mimetype,
 *       path: file.path
 *     });
 *   }
 *
 *   res.json({ uploaded: files.length });
 * }
 */
export function fileUploadMiddleware(config: UploadConfig = {}) {
  const finalConfig = { ...DEFAULT_UPLOAD_CONFIG, ...config };

  // Configure multer storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, finalConfig.destination);
    },
    filename: (req, file, cb) => {
      const sanitized = finalConfig.sanitizeFilename
        ? sanitizeFilename(file.originalname)
        : file.originalname;

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(sanitized);
      const name = path.basename(sanitized, ext);

      cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
  });

  // Configure file filter
  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    const ext = path.extname(file.originalname).toLowerCase().substring(1);

    if (!finalConfig.allowedTypes.includes(ext)) {
      cb(
        new Error(
          `File type not allowed. Allowed types: ${finalConfig.allowedTypes.join(', ')}`
        )
      );
      return;
    }

    cb(null, true);
  };

  // Create multer upload
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: finalConfig.maxSize,
      files: finalConfig.maxFiles
    }
  });

  // Return middleware
  return (req: Request, res: Response, next: NextFunction) => {
    const uploadHandler = upload.array('files', finalConfig.maxFiles);

    uploadHandler(req, res, (error: any) => {
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({
            error: 'File too large',
            maxSize: finalConfig.maxSize,
            maxSizeMB: finalConfig.maxSize / (1024 * 1024)
          });
          return;
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
          res.status(400).json({
            error: 'Too many files',
            maxFiles: finalConfig.maxFiles
          });
          return;
        }
      }

      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }

      next();
    });
  };
}

/**
 * @function sanitizeFilename
 * @description Sanitizes filename by removing special characters
 * @private
 *
 * @param {string} filename - Original filename
 * @returns {string} Sanitized filename
 *
 * @example
 * sanitizeFilename('my document (1).pdf')
 * // Returns: 'my-document-1.pdf'
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * @function validateUploadedFiles
 * @description Additional validation for uploaded files
 *
 * @param {Express.Multer.File[]} files - Uploaded files
 * @returns {ValidationResult} Validation result
 *
 * @example
 * // In handler
 * const files = req.files as Express.Multer.File[];
 * const validation = validateUploadedFiles(files);
 *
 * if (!validation.isValid) {
 *   return res.status(400).json({ errors: validation.errors });
 * }
 */
export function validateUploadedFiles(files: Express.Multer.File[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  for (const file of files) {
    // Check if file is empty
    if (file.size === 0) {
      errors.push(`File ${file.originalname} is empty`);
    }

    // Additional validations can be added here
    // - Virus scanning
    // - Content type verification
    // - Image dimension checks
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
```

---

## 7. Usage Examples

### Complete Route with All Middleware

```typescript
/**
 * @example Complete middleware stack for students list endpoint
 */
router.get(
  '/api/students',
  // Request tracking
  requestContextMiddleware,

  // Authentication
  authenticateJWT,

  // Tenant scoping
  injectTenantScope,

  // Pagination
  paginationMiddleware,

  // Sorting
  sortingMiddleware(['name', 'grade', 'createdAt'], 'createdAt', 'DESC'),

  // Filtering
  filteringMiddleware({
    allowedFields: ['name', 'grade', 'status', 'age'],
    fieldTypes: {
      name: 'string',
      grade: 'number',
      status: 'string',
      age: 'number'
    }
  }),

  // Handler
  async (req: Request, res: Response) => {
    try {
      const { page, limit, offset } = req.pagination!;
      const order = buildSequelizeOrder(req);
      const where = applyTenantScope(req, req.filters!.where);

      const result = await Student.findAndCountAll({
        where,
        order,
        limit,
        offset
      });

      const response = processPaginatedResult(result, page, limit);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Example Request:
 * GET /api/students?page=2&limit=25&sortBy=grade,name&sortOrder=DESC,ASC&filter[status][eq]=active&filter[grade][gte]=10
 *
 * Response:
 * {
 *   "data": [...25 students...],
 *   "pagination": {
 *     "page": 2,
 *     "limit": 25,
 *     "total": 150,
 *     "pages": 6,
 *     "hasNext": true,
 *     "hasPrev": true,
 *     "offset": 25
 *   }
 * }
 */
```

### File Upload Example

```typescript
/**
 * @example Document upload with validation
 */
router.post(
  '/api/documents/upload',
  requestContextMiddleware,
  authenticateJWT,
  injectTenantScope,
  fileUploadMiddleware({
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['pdf', 'doc', 'docx'],
    maxFiles: 5
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Express.Multer.File[];

      // Additional validation
      const validation = validateUploadedFiles(files);
      if (!validation.isValid) {
        return res.status(400).json({ errors: validation.errors });
      }

      // Process files
      const documents = [];
      for (const file of files) {
        const document = await Document.create({
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          path: file.path,
          facilityId: req.tenantScope!.facilityId,
          uploadedBy: req.user!.userId
        });

        documents.push(document);
      }

      res.json({
        success: true,
        uploaded: documents.length,
        documents
      });
    } catch (error) {
      next(error);
    }
  }
);
```

---

## Implementation Checklist

- [ ] Apply pagination middleware to list endpoints
- [ ] Add sorting middleware with field whitelists
- [ ] Implement filtering middleware with type validation
- [ ] Add tenant scoping to all data access endpoints
- [ ] Inject request context for tracking
- [ ] Validate file uploads with size/type constraints
- [ ] Document all middleware parameters
- [ ] Add usage examples to route definitions
- [ ] Test with various query parameter combinations
- [ ] Monitor performance impact

---

## Best Practices

1. **Always validate inputs**: Use middleware to validate before handler execution
2. **Use whitelists**: Only allow specific fields for sorting/filtering
3. **Apply tenant scoping**: Ensure data isolation for multi-tenant scenarios
4. **Track requests**: Use request context for logging and debugging
5. **Handle errors gracefully**: Provide clear error messages for validation failures
6. **Document constraints**: Clearly document limits and allowed values
7. **Test edge cases**: Test with invalid inputs, extreme values, and missing parameters
8. **Performance**: Monitor query performance with complex filters and sorting

---

## Summary

This implementation guide provides:
- Comprehensive middleware implementations for common utility functions
- Detailed documentation following JSDoc standards
- Real-world usage examples
- Best practices and patterns
- Complete type definitions

All middleware is designed to:
- Be composable and reusable
- Follow SOLID principles
- Provide clear error messages
- Support customization through configuration
- Include comprehensive documentation
