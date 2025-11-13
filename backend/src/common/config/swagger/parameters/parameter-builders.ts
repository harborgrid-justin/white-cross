/**
 * OpenAPI Parameter Builders
 *
 * Utilities for defining global and common parameters for OpenAPI documents.
 * Includes pagination, sorting, filtering, and custom header parameters.
 *
 * @module swagger/parameters/parameter-builders
 * @version 1.0.0
 */

import { ParameterObject } from '../types';

/**
 * Parameter configuration interface for custom parameters
 */
interface ParameterConfig {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  description?: string;
  required?: boolean;
  schema?: {
    type?: 'string' | 'number' | 'integer' | 'boolean' | 'array';
    format?: string;
    enum?: unknown[];
    minimum?: number;
    maximum?: number;
    pattern?: string;
    default?: unknown;
  };
}

/**
 * Defines global parameters that apply to all operations.
 *
 * @param parameters - Array of parameter definitions
 * @returns Map of parameter names to parameter objects
 *
 * @example
 * ```typescript
 * const globalParams = defineGlobalParameters([
 *   { name: 'X-Request-ID', in: 'header', required: false, schema: { type: 'string' } },
 *   { name: 'X-API-Version', in: 'header', required: true, schema: { type: 'string' } }
 * ]);
 * ```
 */
export function defineGlobalParameters(parameters: ParameterConfig[]): Record<string, ParameterObject> {
  const paramMap: Record<string, ParameterObject> = {};

  parameters.forEach((param) => {
    paramMap[param.name] = {
      name: param.name,
      in: param.in,
      description: param.description || '',
      required: param.required || false,
      schema: param.schema || { type: 'string' },
    };
  });

  return paramMap;
}

/**
 * Defines common query parameters (pagination, sorting, filtering).
 *
 * @param includePagination - Include pagination parameters
 * @param includeSorting - Include sorting parameters
 * @param includeFiltering - Include filtering parameters
 * @returns Map of common query parameter definitions
 *
 * @example
 * ```typescript
 * const queryParams = defineCommonQueryParams(true, true, false);
 * ```
 */
export function defineCommonQueryParams(
  includePagination = true,
  includeSorting = true,
  includeFiltering = false,
): Record<string, ParameterObject> {
  const params: Record<string, ParameterObject> = {};

  if (includePagination) {
    params.page = {
      name: 'page',
      in: 'query',
      description: 'Page number for pagination (1-based)',
      required: false,
      schema: { type: 'integer', minimum: 1, default: 1 },
    };
    params.limit = {
      name: 'limit',
      in: 'query',
      description: 'Number of items per page',
      required: false,
      schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
    };
    params.offset = {
      name: 'offset',
      in: 'query',
      description: 'Number of items to skip (0-based)',
      required: false,
      schema: { type: 'integer', minimum: 0, default: 0 },
    };
  }

  if (includeSorting) {
    params.sortBy = {
      name: 'sortBy',
      in: 'query',
      description: 'Field name to sort by',
      required: false,
      schema: { type: 'string' },
    };
    params.sortOrder = {
      name: 'sortOrder',
      in: 'query',
      description: 'Sort order (ascending or descending)',
      required: false,
      schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' },
    };
    params.orderBy = {
      name: 'orderBy',
      in: 'query',
      description: 'Alternative sorting parameter with field:direction format',
      required: false,
      schema: { type: 'string', pattern: '^[a-zA-Z_][a-zA-Z0-9_]*:(asc|desc)$' },
    };
  }

  if (includeFiltering) {
    params.filter = {
      name: 'filter',
      in: 'query',
      description: 'Filter expression using query syntax',
      required: false,
      schema: { type: 'string' },
    };
    params.fields = {
      name: 'fields',
      in: 'query',
      description: 'Comma-separated list of fields to include in response',
      required: false,
      schema: { type: 'string', pattern: '^[a-zA-Z_][a-zA-Z0-9_]*(,[a-zA-Z_][a-zA-Z0-9_]*)*$' },
    };
    params.q = {
      name: 'q',
      in: 'query',
      description: 'Search query string',
      required: false,
      schema: { type: 'string' },
    };
  }

  return params;
}

/**
 * Defines common header parameters.
 *
 * @param headers - Array of header names to include
 * @returns Map of common header parameter definitions
 *
 * @example
 * ```typescript
 * const headerParams = defineCommonHeaders([
 *   'X-Request-ID',
 *   'X-Correlation-ID',
 *   'X-API-Version'
 * ]);
 * ```
 */
export function defineCommonHeaders(
  headers: Array<'X-Request-ID' | 'X-Correlation-ID' | 'X-API-Version' | 'Accept-Language' | string>,
): Record<string, ParameterObject> {
  const headerMap: Record<string, ParameterObject> = {};

  const headerDefinitions: Record<string, ParameterObject> = {
    'X-Request-ID': {
      name: 'X-Request-ID',
      in: 'header',
      description: 'Unique request identifier for tracking and debugging',
      required: false,
      schema: { type: 'string', format: 'uuid' },
    },
    'X-Correlation-ID': {
      name: 'X-Correlation-ID',
      in: 'header',
      description: 'Correlation ID for distributed tracing across services',
      required: false,
      schema: { type: 'string', format: 'uuid' },
    },
    'X-API-Version': {
      name: 'X-API-Version',
      in: 'header',
      description: 'Specific API version to use for this request',
      required: false,
      schema: { type: 'string', pattern: '^v\\d+(\\.\\d+)?(\\.\\d+)?$' },
    },
    'Accept-Language': {
      name: 'Accept-Language',
      in: 'header',
      description: 'Preferred language for localized responses',
      required: false,
      schema: { type: 'string', example: 'en-US,en;q=0.9' },
    },
    'X-Client-Version': {
      name: 'X-Client-Version',
      in: 'header',
      description: 'Client application version',
      required: false,
      schema: { type: 'string' },
    },
    'X-User-Agent': {
      name: 'X-User-Agent',
      in: 'header',
      description: 'Custom user agent string',
      required: false,
      schema: { type: 'string' },
    },
  };

  headers.forEach((header) => {
    if (headerDefinitions[header]) {
      headerMap[header] = headerDefinitions[header];
    } else {
      // Custom header
      headerMap[header] = {
        name: header,
        in: 'header',
        description: `${header} custom header`,
        required: false,
        schema: { type: 'string' },
      };
    }
  });

  return headerMap;
}

/**
 * Defines path parameters with validation.
 *
 * @param pathParams - Array of path parameter configurations
 * @returns Map of path parameter definitions
 *
 * @example
 * ```typescript
 * const pathParams = definePathParameters([
 *   { name: 'id', description: 'Resource ID', format: 'uuid' },
 *   { name: 'userId', description: 'User ID', type: 'integer' }
 * ]);
 * ```
 */
export function definePathParameters(
  pathParams: Array<{
    name: string;
    description?: string;
    type?: 'string' | 'integer' | 'number';
    format?: string;
    pattern?: string;
  }>,
): Record<string, ParameterObject> {
  const paramMap: Record<string, ParameterObject> = {};

  pathParams.forEach((param) => {
    paramMap[param.name] = {
      name: param.name,
      in: 'path',
      description: param.description || `${param.name} parameter`,
      required: true, // Path parameters are always required
      schema: {
        type: param.type || 'string',
        ...(param.format && { format: param.format }),
        ...(param.pattern && { pattern: param.pattern }),
      },
    };
  });

  return paramMap;
}

/**
 * Common parameter presets for different use cases
 */
export const PARAMETER_PRESETS = {
  /**
   * Standard REST API parameters
   */
  REST_API: () => ({
    ...defineCommonQueryParams(true, true, true),
    ...defineCommonHeaders(['X-Request-ID', 'Accept-Language']),
  }),

  /**
   * Pagination-only parameters
   */
  PAGINATION_ONLY: () => defineCommonQueryParams(true, false, false),

  /**
   * Search and filtering parameters
   */
  SEARCH_AND_FILTER: () => defineCommonQueryParams(false, false, true),

  /**
   * Complete set including tracing headers
   */
  COMPLETE_SET: () => ({
    ...defineCommonQueryParams(true, true, true),
    ...defineCommonHeaders(['X-Request-ID', 'X-Correlation-ID', 'X-API-Version', 'Accept-Language']),
  }),

  /**
   * Resource management parameters (CRUD operations)
   */
  RESOURCE_MANAGEMENT: () => ({
    ...definePathParameters([
      { name: 'id', description: 'Resource identifier', format: 'uuid' },
    ]),
    ...defineCommonQueryParams(false, false, true),
    ...defineCommonHeaders(['X-Request-ID']),
  }),
} as const;

/**
 * Builds pagination parameters with custom limits.
 *
 * @param defaultLimit - Default number of items per page
 * @param maxLimit - Maximum allowed items per page
 * @returns Pagination parameter definitions
 *
 * @example
 * ```typescript
 * const paginationParams = buildPaginationParameters(10, 50);
 * ```
 */
export function buildPaginationParameters(
  defaultLimit = 20,
  maxLimit = 100,
): Record<string, ParameterObject> {
  return {
    page: {
      name: 'page',
      in: 'query',
      description: 'Page number (1-based indexing)',
      required: false,
      schema: { type: 'integer', minimum: 1, default: 1 },
    },
    limit: {
      name: 'limit',
      in: 'query',
      description: `Number of items per page (max: ${maxLimit})`,
      required: false,
      schema: { type: 'integer', minimum: 1, maximum: maxLimit, default: defaultLimit },
    },
  };
}

/**
 * Builds search parameters for full-text search functionality.
 *
 * @param includeFilters - Include additional filter parameters
 * @returns Search parameter definitions
 *
 * @example
 * ```typescript
 * const searchParams = buildSearchParameters(true);
 * ```
 */
export function buildSearchParameters(includeFilters = false): Record<string, ParameterObject> {
  const params: Record<string, ParameterObject> = {
    q: {
      name: 'q',
      in: 'query',
      description: 'Search query string',
      required: false,
      schema: { type: 'string' },
    },
    searchFields: {
      name: 'searchFields',
      in: 'query',
      description: 'Comma-separated list of fields to search in',
      required: false,
      schema: { type: 'string' },
    },
  };

  if (includeFilters) {
    params.category = {
      name: 'category',
      in: 'query',
      description: 'Filter by category',
      required: false,
      schema: { type: 'string' },
    };
    params.tags = {
      name: 'tags',
      in: 'query',
      description: 'Filter by tags (comma-separated)',
      required: false,
      schema: { type: 'string' },
    };
    params.dateFrom = {
      name: 'dateFrom',
      in: 'query',
      description: 'Filter records from this date (ISO 8601 format)',
      required: false,
      schema: { type: 'string', format: 'date' },
    };
    params.dateTo = {
      name: 'dateTo',
      in: 'query',
      description: 'Filter records up to this date (ISO 8601 format)',
      required: false,
      schema: { type: 'string', format: 'date' },
    };
  }

  return params;
}

/**
 * Builds API versioning parameters.
 *
 * @param supportedVersions - Array of supported API versions
 * @param defaultVersion - Default version if not specified
 * @returns API versioning parameter definitions
 *
 * @example
 * ```typescript
 * const versionParams = buildVersioningParameters(['v1', 'v2', 'v3'], 'v2');
 * ```
 */
export function buildVersioningParameters(
  supportedVersions: string[],
  defaultVersion?: string,
): Record<string, ParameterObject> {
  return {
    'api-version': {
      name: 'api-version',
      in: 'query',
      description: 'API version to use for this request',
      required: false,
      schema: {
        type: 'string',
        enum: supportedVersions,
        ...(defaultVersion && { default: defaultVersion }),
      },
    },
    'X-API-Version': {
      name: 'X-API-Version',
      in: 'header',
      description: 'API version specified via header',
      required: false,
      schema: {
        type: 'string',
        enum: supportedVersions,
        ...(defaultVersion && { default: defaultVersion }),
      },
    },
  };
}
