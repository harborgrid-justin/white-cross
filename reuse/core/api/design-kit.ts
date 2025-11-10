/**
 * @fileoverview API Design Kit
 * @module core/api/design-kit
 *
 * Comprehensive API design patterns and best practices toolkit including
 * REST conventions, HATEOAS, resource naming, and API design validation.
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * REST resource configuration
 */
export interface ResourceConfig {
  /** Resource name (singular) */
  name: string;
  /** Resource plural name */
  plural?: string;
  /** Resource identifier field */
  idField?: string;
  /** Allowed operations */
  operations?: Array<'list' | 'get' | 'create' | 'update' | 'delete'>;
}

/**
 * HATEOAS link definition
 */
export interface HATEOASLink {
  /** Link relation type */
  rel: string;
  /** Link URL */
  href: string;
  /** HTTP method */
  method?: string;
  /** Link type */
  type?: string;
}

/**
 * API response wrapper with metadata
 */
export interface ApiResponse<T = any> {
  /** Response data */
  data: T;
  /** Response metadata */
  meta?: {
    /** Pagination info */
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    /** Request timestamp */
    timestamp?: string;
    /** Request ID */
    requestId?: string;
  };
  /** HATEOAS links */
  links?: HATEOASLink[];
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  /** Page number (1-based) */
  page?: number;
  /** Items per page */
  limit?: number;
  /** Offset (alternative to page) */
  offset?: number;
}

/**
 * Sort parameters
 */
export interface SortParams {
  /** Field to sort by */
  sortBy?: string;
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Filter parameters
 */
export interface FilterParams {
  /** Filter conditions */
  [key: string]: any;
}

/**
 * Query parameters combining pagination, sort, and filter
 */
export interface QueryParams extends PaginationParams, SortParams, FilterParams {}

/**
 * Parses and validates pagination parameters from request
 *
 * @param req - Express request
 * @param defaults - Default pagination values
 * @returns Validated pagination parameters
 */
export function parsePaginationParams(
  req: Request,
  defaults: { page?: number; limit?: number } = {}
): Required<PaginationParams> {
  const page = parseInt(req.query.page as string) || defaults.page || 1;
  const limit = parseInt(req.query.limit as string) || defaults.limit || 20;
  const offset = (page - 1) * limit;

  // Validate ranges
  const validatedPage = Math.max(1, page);
  const validatedLimit = Math.min(Math.max(1, limit), 100); // Max 100 items per page

  return {
    page: validatedPage,
    limit: validatedLimit,
    offset: (validatedPage - 1) * validatedLimit,
  };
}

/**
 * Parses sort parameters from request
 *
 * @param req - Express request
 * @param allowedFields - List of fields that can be sorted
 * @returns Sort parameters
 */
export function parseSortParams(
  req: Request,
  allowedFields: string[] = []
): SortParams {
  const sortBy = req.query.sortBy as string;
  const sortOrder = (req.query.sortOrder as string)?.toLowerCase() as 'asc' | 'desc';

  // Validate sort field
  if (sortBy && allowedFields.length > 0 && !allowedFields.includes(sortBy)) {
    throw new Error(`Invalid sort field: ${sortBy}. Allowed: ${allowedFields.join(', ')}`);
  }

  // Validate sort order
  if (sortOrder && !['asc', 'desc'].includes(sortOrder)) {
    throw new Error('Sort order must be "asc" or "desc"');
  }

  return {
    sortBy,
    sortOrder: sortOrder || 'asc',
  };
}

/**
 * Creates HATEOAS links for a resource
 *
 * @param baseUrl - Base URL for links
 * @param resourceId - Resource identifier
 * @param config - Resource configuration
 * @returns Array of HATEOAS links
 */
export function createHATEOASLinks(
  baseUrl: string,
  resourceId: string | number,
  config: ResourceConfig
): HATEOASLink[] {
  const links: HATEOASLink[] = [
    {
      rel: 'self',
      href: `${baseUrl}/${resourceId}`,
      method: 'GET',
    },
  ];

  const { operations = ['list', 'get', 'create', 'update', 'delete'] } = config;

  if (operations.includes('update')) {
    links.push({
      rel: 'update',
      href: `${baseUrl}/${resourceId}`,
      method: 'PUT',
    });
    links.push({
      rel: 'patch',
      href: `${baseUrl}/${resourceId}`,
      method: 'PATCH',
    });
  }

  if (operations.includes('delete')) {
    links.push({
      rel: 'delete',
      href: `${baseUrl}/${resourceId}`,
      method: 'DELETE',
    });
  }

  if (operations.includes('list')) {
    links.push({
      rel: 'collection',
      href: baseUrl,
      method: 'GET',
    });
  }

  return links;
}

/**
 * Wraps response data with standard API response format
 *
 * @param data - Response data
 * @param options - Response options
 * @returns Formatted API response
 */
export function wrapApiResponse<T>(
  data: T,
  options: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
    links?: HATEOASLink[];
    requestId?: string;
  } = {}
): ApiResponse<T> {
  const response: ApiResponse<T> = {
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: options.requestId,
    },
  };

  if (options.pagination) {
    response.meta!.pagination = {
      ...options.pagination,
      totalPages: Math.ceil(options.pagination.total / options.pagination.limit),
    };
  }

  if (options.links) {
    response.links = options.links;
  }

  return response;
}

/**
 * Creates standard CRUD routes for a resource
 *
 * @param config - Resource configuration
 * @param handlers - CRUD operation handlers
 * @returns Array of route configurations
 */
export function createRESTRoutes(
  config: ResourceConfig,
  handlers: {
    list?: RequestHandler;
    get?: RequestHandler;
    create?: RequestHandler;
    update?: RequestHandler;
    delete?: RequestHandler;
  }
): Array<{
  method: string;
  path: string;
  handler: RequestHandler;
}> {
  const { name, plural = `${name}s`, operations = ['list', 'get', 'create', 'update', 'delete'] } = config;
  const basePath = `/${plural}`;
  const routes: Array<{ method: string; path: string; handler: RequestHandler }> = [];

  if (operations.includes('list') && handlers.list) {
    routes.push({
      method: 'GET',
      path: basePath,
      handler: handlers.list,
    });
  }

  if (operations.includes('get') && handlers.get) {
    routes.push({
      method: 'GET',
      path: `${basePath}/:id`,
      handler: handlers.get,
    });
  }

  if (operations.includes('create') && handlers.create) {
    routes.push({
      method: 'POST',
      path: basePath,
      handler: handlers.create,
    });
  }

  if (operations.includes('update') && handlers.update) {
    routes.push({
      method: 'PUT',
      path: `${basePath}/:id`,
      handler: handlers.update,
    });
    routes.push({
      method: 'PATCH',
      path: `${basePath}/:id`,
      handler: handlers.update,
    });
  }

  if (operations.includes('delete') && handlers.delete) {
    routes.push({
      method: 'DELETE',
      path: `${basePath}/:id`,
      handler: handlers.delete,
    });
  }

  return routes;
}

/**
 * Validates resource naming conventions
 *
 * @param name - Resource name to validate
 * @returns Validation result
 */
export function validateResourceName(name: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check if name is kebab-case
  if (!/^[a-z]+(-[a-z]+)*$/.test(name)) {
    errors.push('Resource name must be lowercase kebab-case (e.g., "user-profile")');
  }

  // Check if name is plural
  if (!name.endsWith('s')) {
    errors.push('Resource name should be plural (e.g., "users" not "user")');
  }

  // Check length
  if (name.length < 2) {
    errors.push('Resource name is too short');
  }

  if (name.length > 50) {
    errors.push('Resource name is too long (max 50 characters)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Creates middleware for adding request ID
 *
 * @returns Express middleware function
 */
export function createRequestIdMiddleware(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestId =
      (req.headers['x-request-id'] as string) ||
      `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-ID', requestId);

    next();
  };
}

/**
 * Creates API response middleware for consistent formatting
 *
 * @param options - Formatting options
 * @returns Express middleware function
 */
export function createResponseFormatterMiddleware(
  options: {
    includeLinks?: boolean;
    includeTimestamp?: boolean;
  } = {}
): RequestHandler {
  const { includeLinks = true, includeTimestamp = true } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);

    res.json = function (data: any) {
      const formatted = wrapApiResponse(data, {
        requestId: req.headers['x-request-id'] as string,
        ...(includeLinks && data.links ? { links: data.links } : {}),
      });

      if (!includeTimestamp && formatted.meta) {
        delete formatted.meta.timestamp;
      }

      return originalJson(formatted);
    };

    next();
  };
}

/**
 * API Design Kit - Main export
 */
export default {
  parsePaginationParams,
  parseSortParams,
  createHATEOASLinks,
  wrapApiResponse,
  createRESTRoutes,
  validateResourceName,
  createRequestIdMiddleware,
  createResponseFormatterMiddleware,
};
