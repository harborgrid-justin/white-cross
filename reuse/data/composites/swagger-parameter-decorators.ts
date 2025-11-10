/**
 * Swagger/OpenAPI Parameter Decorators
 *
 * Production-ready TypeScript utilities for path, query, header,
 * and cookie parameters with comprehensive validation.
 * Compliant with OpenAPI 3.0/3.1 parameter specifications.
 *
 * @module swagger-parameter-decorators
 * @version 1.0.0
 */

import { applyDecorators } from '@nestjs/common';
import {
  ApiParam,
  ApiQuery,
  ApiHeader,
  ApiExtension,
} from '@nestjs/swagger';

/**
 * Type definitions for parameter configuration
 */

export interface ParameterOptions {
  /** Parameter name */
  name: string;
  /** Parameter description */
  description?: string;
  /** Whether parameter is required */
  required?: boolean;
  /** Parameter schema */
  schema?: any;
  /** Example value */
  example?: any;
  /** Whether parameter is deprecated */
  deprecated?: boolean;
}

export interface ValidationOptions {
  /** Minimum value (numbers) */
  minimum?: number;
  /** Maximum value (numbers) */
  maximum?: number;
  /** Minimum length (strings) */
  minLength?: number;
  /** Maximum length (strings) */
  maxLength?: number;
  /** Regular expression pattern */
  pattern?: string;
  /** Enum values */
  enum?: any[];
  /** Format hint */
  format?: string;
}

// ============================================================================
// PATH PARAMETER BUILDERS (8 functions)
// ============================================================================

/**
 * Creates UUID path parameter decorator.
 * Path parameter for UUID identifiers with validation.
 *
 * @param name - Parameter name (default: 'id')
 * @param description - Parameter description
 * @param required - Whether parameter is required
 * @returns UUID path parameter decorator
 *
 * @example
 * ```typescript
 * @Get('users/:id')
 * @createUuidPathParam('id', 'User unique identifier')
 * async getUser(@Param('id') id: string) {
 *   return this.userService.findOne(id);
 * }
 * ```
 */
export function createUuidPathParam(
  name = 'id',
  description = 'UUID identifier',
  required = true
) {
  return ApiParam({
    name,
    description,
    required,
    schema: {
      type: 'string',
      format: 'uuid',
      pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
      example: '123e4567-e89b-12d3-a456-426614174000',
    },
  });
}

/**
 * Creates integer path parameter decorator.
 * Path parameter for integer values with range validation.
 *
 * @param name - Parameter name
 * @param description - Parameter description
 * @param minimum - Minimum value
 * @param maximum - Maximum value
 * @returns Integer path parameter decorator
 *
 * @example
 * ```typescript
 * @Get('items/:itemId')
 * @createIntegerPathParam('itemId', 'Item ID', 1, 999999)
 * async getItem(@Param('itemId') itemId: number) {
 *   return this.itemService.findOne(itemId);
 * }
 * ```
 */
export function createIntegerPathParam(
  name: string,
  description: string,
  minimum?: number,
  maximum?: number
) {
  const schema: any = {
    type: 'integer',
    example: minimum || 1,
  };

  if (minimum !== undefined) schema.minimum = minimum;
  if (maximum !== undefined) schema.maximum = maximum;

  return ApiParam({
    name,
    description,
    required: true,
    schema,
  });
}

/**
 * Creates string path parameter decorator.
 * Path parameter for string values with pattern validation.
 *
 * @param name - Parameter name
 * @param description - Parameter description
 * @param pattern - Regular expression pattern
 * @param example - Example value
 * @returns String path parameter decorator
 *
 * @example
 * ```typescript
 * @Get('users/:username')
 * @createStringPathParam('username', 'Username', '^[a-zA-Z0-9_-]{3,20}$', 'john_doe')
 * async getUserByUsername(@Param('username') username: string) {
 *   return this.userService.findByUsername(username);
 * }
 * ```
 */
export function createStringPathParam(
  name: string,
  description: string,
  pattern?: string,
  example?: string
) {
  const schema: any = {
    type: 'string',
    ...(example && { example }),
  };

  if (pattern) schema.pattern = pattern;

  return ApiParam({
    name,
    description,
    required: true,
    schema,
  });
}

/**
 * Creates enum path parameter decorator.
 * Path parameter constrained to enum values.
 *
 * @param name - Parameter name
 * @param enumValues - Array of allowed values
 * @param description - Parameter description
 * @returns Enum path parameter decorator
 *
 * @example
 * ```typescript
 * @Get('reports/:type')
 * @createEnumPathParam('type', ['daily', 'weekly', 'monthly'], 'Report type')
 * async getReport(@Param('type') type: string) {
 *   return this.reportService.generate(type);
 * }
 * ```
 */
export function createEnumPathParam(
  name: string,
  enumValues: any[],
  description: string
) {
  return ApiParam({
    name,
    description: `${description} | Allowed values: ${enumValues.join(', ')}`,
    required: true,
    schema: {
      type: typeof enumValues[0],
      enum: enumValues,
      example: enumValues[0],
    },
  });
}

/**
 * Creates date path parameter decorator.
 * Path parameter for date values in ISO 8601 format.
 *
 * @param name - Parameter name
 * @param description - Parameter description
 * @param format - Date format ('date' or 'date-time')
 * @returns Date path parameter decorator
 *
 * @example
 * ```typescript
 * @Get('events/:date')
 * @createDatePathParam('date', 'Event date', 'date')
 * async getEventsByDate(@Param('date') date: string) {
 *   return this.eventService.findByDate(date);
 * }
 * ```
 */
export function createDatePathParam(
  name: string,
  description: string,
  format: 'date' | 'date-time' = 'date'
) {
  return ApiParam({
    name,
    description,
    required: true,
    schema: {
      type: 'string',
      format,
      example: format === 'date' ? '2024-01-15' : '2024-01-15T10:30:00Z',
    },
  });
}

/**
 * Creates slug path parameter decorator.
 * Path parameter for URL-friendly slugs.
 *
 * @param name - Parameter name
 * @param description - Parameter description
 * @returns Slug path parameter decorator
 *
 * @example
 * ```typescript
 * @Get('articles/:slug')
 * @createSlugPathParam('slug', 'Article URL slug')
 * async getArticle(@Param('slug') slug: string) {
 *   return this.articleService.findBySlug(slug);
 * }
 * ```
 */
export function createSlugPathParam(
  name: string,
  description: string
) {
  return ApiParam({
    name,
    description,
    required: true,
    schema: {
      type: 'string',
      pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
      example: 'my-article-slug',
    },
  });
}

/**
 * Creates version path parameter decorator.
 * Path parameter for API version strings.
 *
 * @param name - Parameter name
 * @param supportedVersions - Array of supported versions
 * @param description - Parameter description
 * @returns Version path parameter decorator
 *
 * @example
 * ```typescript
 * @Get(':version/users')
 * @createVersionPathParam('version', ['v1', 'v2', 'v3'], 'API version')
 * async getUsers(@Param('version') version: string) {
 *   return this.userService.findAll(version);
 * }
 * ```
 */
export function createVersionPathParam(
  name: string,
  supportedVersions: string[],
  description = 'API version'
) {
  return ApiParam({
    name,
    description: `${description} | Supported: ${supportedVersions.join(', ')}`,
    required: true,
    schema: {
      type: 'string',
      enum: supportedVersions,
      pattern: '^v\\d+$',
      example: supportedVersions[supportedVersions.length - 1],
    },
  });
}

/**
 * Creates composite path parameter decorator.
 * Multiple path parameters grouped together.
 *
 * @param parameters - Array of parameter definitions
 * @returns Multiple path parameters decorator
 *
 * @example
 * ```typescript
 * @Get('tenants/:tenantId/users/:userId')
 * @createCompositePathParams([
 *   { name: 'tenantId', description: 'Tenant ID', schema: { type: 'string', format: 'uuid' } },
 *   { name: 'userId', description: 'User ID', schema: { type: 'string', format: 'uuid' } }
 * ])
 * async getTenantUser(@Param('tenantId') tenantId: string, @Param('userId') userId: string) {
 *   return this.userService.findTenantUser(tenantId, userId);
 * }
 * ```
 */
export function createCompositePathParams(parameters: ParameterOptions[]) {
  const decorators = parameters.map(param =>
    ApiParam({
      name: param.name,
      description: param.description,
      required: param.required !== false,
      schema: param.schema,
      ...(param.example && { example: param.example }),
      ...(param.deprecated && { deprecated: param.deprecated }),
    })
  );

  return applyDecorators(...decorators);
}

// ============================================================================
// QUERY PARAMETER DECORATORS (10 functions)
// ============================================================================

/**
 * Creates pagination query parameters decorator.
 * Standard pagination parameters (page, limit).
 *
 * @param defaultPage - Default page number
 * @param defaultLimit - Default items per page
 * @param maxLimit - Maximum items per page
 * @returns Pagination query parameters decorator
 *
 * @example
 * ```typescript
 * @Get('users')
 * @createPaginationQueryParams(1, 20, 100)
 * async listUsers(@Query('page') page: number, @Query('limit') limit: number) {
 *   return this.userService.findPaginated(page, limit);
 * }
 * ```
 */
export function createPaginationQueryParams(
  defaultPage = 1,
  defaultLimit = 20,
  maxLimit = 100
) {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: `Page number (default: ${defaultPage})`,
      schema: {
        type: 'integer',
        minimum: 1,
        default: defaultPage,
        example: defaultPage,
      },
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: `Items per page (default: ${defaultLimit}, max: ${maxLimit})`,
      schema: {
        type: 'integer',
        minimum: 1,
        maximum: maxLimit,
        default: defaultLimit,
        example: defaultLimit,
      },
    })
  );
}

/**
 * Creates sorting query parameters decorator.
 * Standard sorting parameters (sortBy, sortOrder).
 *
 * @param allowedFields - Array of fields allowed for sorting
 * @param defaultField - Default sort field
 * @returns Sorting query parameters decorator
 *
 * @example
 * ```typescript
 * @Get('products')
 * @createSortingQueryParams(['name', 'price', 'createdAt'], 'createdAt')
 * async listProducts(@Query('sortBy') sortBy: string, @Query('sortOrder') sortOrder: string) {
 *   return this.productService.findSorted(sortBy, sortOrder);
 * }
 * ```
 */
export function createSortingQueryParams(
  allowedFields: string[],
  defaultField?: string
) {
  return applyDecorators(
    ApiQuery({
      name: 'sortBy',
      required: false,
      type: String,
      description: `Field to sort by | Allowed: ${allowedFields.join(', ')}`,
      schema: {
        type: 'string',
        enum: allowedFields,
        ...(defaultField && { default: defaultField, example: defaultField }),
      },
    }),
    ApiQuery({
      name: 'sortOrder',
      required: false,
      type: String,
      description: 'Sort order',
      schema: {
        type: 'string',
        enum: ['asc', 'desc'],
        default: 'asc',
        example: 'asc',
      },
    })
  );
}

/**
 * Creates search query parameter decorator.
 * Full-text search query parameter.
 *
 * @param searchableFields - Fields included in search
 * @param minLength - Minimum search term length
 * @returns Search query parameter decorator
 *
 * @example
 * ```typescript
 * @Get('users/search')
 * @createSearchQueryParam(['name', 'email', 'phone'], 3)
 * async searchUsers(@Query('q') query: string) {
 *   return this.userService.search(query);
 * }
 * ```
 */
export function createSearchQueryParam(
  searchableFields: string[],
  minLength = 2
) {
  return ApiQuery({
    name: 'q',
    required: false,
    type: String,
    description: `Search query | Searches in: ${searchableFields.join(', ')}`,
    schema: {
      type: 'string',
      minLength,
      example: 'search term',
    },
  });
}

/**
 * Creates filter query parameters decorator.
 * Multiple filter parameters for advanced filtering.
 *
 * @param filters - Map of filter names to their configurations
 * @returns Filter query parameters decorator
 *
 * @example
 * ```typescript
 * @Get('products')
 * @createFilterQueryParams({
 *   category: { type: 'string', enum: ['electronics', 'books', 'clothing'] },
 *   minPrice: { type: 'number', minimum: 0 },
 *   maxPrice: { type: 'number', minimum: 0 },
 *   inStock: { type: 'boolean' }
 * })
 * async filterProducts(@Query() filters: any) {
 *   return this.productService.findFiltered(filters);
 * }
 * ```
 */
export function createFilterQueryParams(
  filters: Record<string, { type: string; enum?: any[]; minimum?: number; maximum?: number }>
) {
  const decorators = Object.entries(filters).map(([name, config]) => {
    const schema: any = { type: config.type };

    if (config.enum) schema.enum = config.enum;
    if (config.minimum !== undefined) schema.minimum = config.minimum;
    if (config.maximum !== undefined) schema.maximum = config.maximum;

    return ApiQuery({
      name,
      required: false,
      description: `Filter by ${name}`,
      schema,
    });
  });

  return applyDecorators(...decorators);
}

/**
 * Creates date range query parameters decorator.
 * Start and end date parameters for date filtering.
 *
 * @param startName - Start date parameter name
 * @param endName - End date parameter name
 * @param format - Date format ('date' or 'date-time')
 * @returns Date range query parameters decorator
 *
 * @example
 * ```typescript
 * @Get('orders')
 * @createDateRangeQueryParams('startDate', 'endDate', 'date')
 * async getOrders(@Query('startDate') start: string, @Query('endDate') end: string) {
 *   return this.orderService.findByDateRange(start, end);
 * }
 * ```
 */
export function createDateRangeQueryParams(
  startName = 'startDate',
  endName = 'endDate',
  format: 'date' | 'date-time' = 'date'
) {
  const example = format === 'date' ? '2024-01-01' : '2024-01-01T00:00:00Z';

  return applyDecorators(
    ApiQuery({
      name: startName,
      required: false,
      type: String,
      description: 'Start date for range filter',
      schema: {
        type: 'string',
        format,
        example,
      },
    }),
    ApiQuery({
      name: endName,
      required: false,
      type: String,
      description: 'End date for range filter',
      schema: {
        type: 'string',
        format,
        example,
      },
    })
  );
}

/**
 * Creates array query parameter decorator.
 * Query parameter accepting multiple values.
 *
 * @param name - Parameter name
 * @param itemType - Type of array items
 * @param description - Parameter description
 * @param required - Whether parameter is required
 * @returns Array query parameter decorator
 *
 * @example
 * ```typescript
 * @Get('users')
 * @createArrayQueryParam('ids', 'string', 'User IDs', false)
 * async getUsersByIds(@Query('ids') ids: string[]) {
 *   return this.userService.findByIds(ids);
 * }
 * ```
 */
export function createArrayQueryParam(
  name: string,
  itemType: 'string' | 'number' | 'boolean',
  description: string,
  required = false
) {
  return ApiQuery({
    name,
    required,
    type: [itemType === 'string' ? String : itemType === 'number' ? Number : Boolean],
    description: `${description} (comma-separated)`,
    schema: {
      type: 'array',
      items: { type: itemType },
    },
    style: 'form',
    explode: false,
  });
}

/**
 * Creates boolean query parameter decorator.
 * Boolean flag query parameter.
 *
 * @param name - Parameter name
 * @param description - Parameter description
 * @param defaultValue - Default boolean value
 * @returns Boolean query parameter decorator
 *
 * @example
 * ```typescript
 * @Get('users')
 * @createBooleanQueryParam('active', 'Filter active users only', true)
 * async listUsers(@Query('active') active: boolean) {
 *   return this.userService.findByActive(active);
 * }
 * ```
 */
export function createBooleanQueryParam(
  name: string,
  description: string,
  defaultValue?: boolean
) {
  return ApiQuery({
    name,
    required: false,
    type: Boolean,
    description,
    schema: {
      type: 'boolean',
      ...(defaultValue !== undefined && { default: defaultValue }),
      example: defaultValue !== undefined ? defaultValue : true,
    },
  });
}

/**
 * Creates enum query parameter decorator.
 * Query parameter with enum values.
 *
 * @param name - Parameter name
 * @param enumValues - Array of allowed values
 * @param description - Parameter description
 * @param required - Whether parameter is required
 * @returns Enum query parameter decorator
 *
 * @example
 * ```typescript
 * @Get('orders')
 * @createEnumQueryParam('status', ['pending', 'processing', 'completed'], 'Order status')
 * async getOrders(@Query('status') status: string) {
 *   return this.orderService.findByStatus(status);
 * }
 * ```
 */
export function createEnumQueryParam(
  name: string,
  enumValues: any[],
  description: string,
  required = false
) {
  return ApiQuery({
    name,
    required,
    description: `${description} | Allowed: ${enumValues.join(', ')}`,
    schema: {
      type: typeof enumValues[0],
      enum: enumValues,
      example: enumValues[0],
    },
  });
}

/**
 * Creates range query parameter decorator.
 * Numeric range parameter (min/max).
 *
 * @param name - Base parameter name
 * @param description - Parameter description
 * @param minValue - Minimum allowed value
 * @param maxValue - Maximum allowed value
 * @returns Range query parameters decorator
 *
 * @example
 * ```typescript
 * @Get('products')
 * @createRangeQueryParam('price', 'Price range', 0, 10000)
 * async getProducts(@Query('minPrice') min: number, @Query('maxPrice') max: number) {
 *   return this.productService.findByPriceRange(min, max);
 * }
 * ```
 */
export function createRangeQueryParam(
  name: string,
  description: string,
  minValue?: number,
  maxValue?: number
) {
  return applyDecorators(
    ApiQuery({
      name: `min${name.charAt(0).toUpperCase() + name.slice(1)}`,
      required: false,
      type: Number,
      description: `Minimum ${description}`,
      schema: {
        type: 'number',
        ...(minValue !== undefined && { minimum: minValue }),
        ...(maxValue !== undefined && { maximum: maxValue }),
      },
    }),
    ApiQuery({
      name: `max${name.charAt(0).toUpperCase() + name.slice(1)}`,
      required: false,
      type: Number,
      description: `Maximum ${description}`,
      schema: {
        type: 'number',
        ...(minValue !== undefined && { minimum: minValue }),
        ...(maxValue !== undefined && { maximum: maxValue }),
      },
    })
  );
}

/**
 * Creates fields query parameter decorator.
 * Field selection/projection parameter.
 *
 * @param availableFields - Array of available fields
 * @param description - Parameter description
 * @returns Fields query parameter decorator
 *
 * @example
 * ```typescript
 * @Get('users')
 * @createFieldsQueryParam(['id', 'name', 'email', 'createdAt'])
 * async listUsers(@Query('fields') fields: string) {
 *   return this.userService.findWithFields(fields);
 * }
 * ```
 */
export function createFieldsQueryParam(
  availableFields: string[],
  description = 'Fields to include in response'
) {
  return ApiQuery({
    name: 'fields',
    required: false,
    type: String,
    description: `${description} | Available: ${availableFields.join(', ')}`,
    schema: {
      type: 'string',
      pattern: `^(${availableFields.join('|')})(,(${availableFields.join('|')}))*$`,
      example: availableFields.slice(0, 3).join(','),
    },
  });
}

// ============================================================================
// HEADER PARAMETER UTILITIES (8 functions)
// ============================================================================

/**
 * Creates API key header parameter decorator.
 * Custom API key header.
 *
 * @param headerName - Header name
 * @param description - Header description
 * @param required - Whether header is required
 * @returns API key header decorator
 *
 * @example
 * ```typescript
 * @Get('protected')
 * @createApiKeyHeader('X-API-Key', 'API authentication key')
 * async protectedEndpoint(@Headers('x-api-key') apiKey: string) {
 *   return this.service.getData(apiKey);
 * }
 * ```
 */
export function createApiKeyHeader(
  headerName = 'X-API-Key',
  description = 'API authentication key',
  required = true
) {
  return ApiHeader({
    name: headerName,
    description,
    required,
    schema: {
      type: 'string',
      example: 'your-api-key-here',
    },
  });
}

/**
 * Creates authorization header decorator.
 * Standard Authorization header.
 *
 * @param scheme - Auth scheme (Bearer, Basic, etc.)
 * @param description - Header description
 * @returns Authorization header decorator
 *
 * @example
 * ```typescript
 * @Get('users')
 * @createAuthorizationHeader('Bearer', 'JWT authentication token')
 * async listUsers(@Headers('authorization') auth: string) {
 *   return this.userService.findAll();
 * }
 * ```
 */
export function createAuthorizationHeader(
  scheme = 'Bearer',
  description = 'Authentication token'
) {
  return ApiHeader({
    name: 'Authorization',
    description: `${description} | Format: ${scheme} <token>`,
    required: true,
    schema: {
      type: 'string',
      pattern: `^${scheme} .+$`,
      example: `${scheme} eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`,
    },
  });
}

/**
 * Creates custom request ID header decorator.
 * Request tracking/correlation ID header.
 *
 * @param headerName - Header name
 * @param required - Whether header is required
 * @returns Request ID header decorator
 *
 * @example
 * ```typescript
 * @Post('orders')
 * @createRequestIdHeader('X-Request-ID', false)
 * async createOrder(@Headers('x-request-id') requestId: string) {
 *   return this.orderService.create(requestId);
 * }
 * ```
 */
export function createRequestIdHeader(
  headerName = 'X-Request-ID',
  required = false
) {
  return ApiHeader({
    name: headerName,
    description: 'Unique request identifier for tracking',
    required,
    schema: {
      type: 'string',
      format: 'uuid',
      example: '123e4567-e89b-12d3-a456-426614174000',
    },
  });
}

/**
 * Creates content type header decorator.
 * Request content type specification.
 *
 * @param allowedTypes - Array of allowed content types
 * @returns Content type header decorator
 *
 * @example
 * ```typescript
 * @Post('data')
 * @createContentTypeHeader(['application/json', 'application/xml'])
 * async submitData(@Headers('content-type') contentType: string, @Body() data: any) {
 *   return this.dataService.process(data, contentType);
 * }
 * ```
 */
export function createContentTypeHeader(
  allowedTypes: string[] = ['application/json']
) {
  return ApiHeader({
    name: 'Content-Type',
    description: `Request content type | Allowed: ${allowedTypes.join(', ')}`,
    required: true,
    schema: {
      type: 'string',
      enum: allowedTypes,
      example: allowedTypes[0],
    },
  });
}

/**
 * Creates accept header decorator.
 * Response content type negotiation.
 *
 * @param supportedTypes - Array of supported response types
 * @returns Accept header decorator
 *
 * @example
 * ```typescript
 * @Get('data')
 * @createAcceptHeader(['application/json', 'application/xml', 'text/csv'])
 * async getData(@Headers('accept') accept: string) {
 *   return this.dataService.getInFormat(accept);
 * }
 * ```
 */
export function createAcceptHeader(
  supportedTypes: string[] = ['application/json']
) {
  return ApiHeader({
    name: 'Accept',
    description: `Desired response content type | Supported: ${supportedTypes.join(', ')}`,
    required: false,
    schema: {
      type: 'string',
      enum: supportedTypes,
      example: supportedTypes[0],
    },
  });
}

/**
 * Creates accept-language header decorator.
 * Localization/language preference header.
 *
 * @param supportedLanguages - Array of supported language codes
 * @returns Accept-Language header decorator
 *
 * @example
 * ```typescript
 * @Get('content')
 * @createAcceptLanguageHeader(['en-US', 'es-ES', 'fr-FR'])
 * async getContent(@Headers('accept-language') language: string) {
 *   return this.contentService.getLocalized(language);
 * }
 * ```
 */
export function createAcceptLanguageHeader(
  supportedLanguages: string[] = ['en-US']
) {
  return ApiHeader({
    name: 'Accept-Language',
    description: `Preferred language | Supported: ${supportedLanguages.join(', ')}`,
    required: false,
    schema: {
      type: 'string',
      enum: supportedLanguages,
      example: supportedLanguages[0],
    },
  });
}

/**
 * Creates ETag header decorator for conditional requests.
 * Entity tag for cache validation.
 *
 * @param required - Whether header is required
 * @returns ETag conditional header decorators
 *
 * @example
 * ```typescript
 * @Put('resource/:id')
 * @createETagHeader(true)
 * async updateResource(@Param('id') id: string, @Headers('if-match') etag: string) {
 *   return this.resourceService.updateIfMatch(id, etag);
 * }
 * ```
 */
export function createETagHeader(required = false) {
  return applyDecorators(
    ApiHeader({
      name: 'If-Match',
      description: 'ETag for conditional update (optimistic locking)',
      required,
      schema: {
        type: 'string',
        pattern: '^"?[a-zA-Z0-9]+"?$',
        example: '"33a64df551425fcc"',
      },
    }),
    ApiHeader({
      name: 'If-None-Match',
      description: 'ETag for conditional GET (cache validation)',
      required: false,
      schema: {
        type: 'string',
        pattern: '^"?[a-zA-Z0-9]+"?$',
        example: '"33a64df551425fcc"',
      },
    })
  );
}

/**
 * Creates user agent header decorator.
 * Client user agent information.
 *
 * @param required - Whether header is required
 * @returns User-Agent header decorator
 *
 * @example
 * ```typescript
 * @Get('metrics')
 * @createUserAgentHeader(true)
 * async trackUsage(@Headers('user-agent') userAgent: string) {
 *   return this.metricsService.track(userAgent);
 * }
 * ```
 */
export function createUserAgentHeader(required = false) {
  return ApiHeader({
    name: 'User-Agent',
    description: 'Client user agent string',
    required,
    schema: {
      type: 'string',
      example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });
}

// ============================================================================
// COOKIE PARAMETER HANDLERS (6 functions)
// ============================================================================

/**
 * Creates session cookie parameter decorator.
 * Session identifier cookie.
 *
 * @param cookieName - Cookie name
 * @param description - Cookie description
 * @param required - Whether cookie is required
 * @returns Session cookie parameter decorator
 *
 * @example
 * ```typescript
 * @Get('profile')
 * @createSessionCookie('sessionid', 'Session identifier')
 * async getProfile(@Cookies('sessionid') sessionId: string) {
 *   return this.userService.getProfileBySession(sessionId);
 * }
 * ```
 */
export function createSessionCookie(
  cookieName = 'sessionid',
  description = 'Session identifier',
  required = true
) {
  return ApiExtension('x-cookie-param', {
    name: cookieName,
    description,
    required,
    schema: {
      type: 'string',
      format: 'uuid',
    },
    in: 'cookie',
  });
}

/**
 * Creates authentication token cookie decorator.
 * JWT or auth token in cookie.
 *
 * @param cookieName - Cookie name
 * @param description - Cookie description
 * @returns Auth token cookie decorator
 *
 * @example
 * ```typescript
 * @Get('dashboard')
 * @createAuthTokenCookie('auth_token', 'Authentication token')
 * async getDashboard(@Cookies('auth_token') token: string) {
 *   return this.dashboardService.getData(token);
 * }
 * ```
 */
export function createAuthTokenCookie(
  cookieName = 'auth_token',
  description = 'Authentication token'
) {
  return ApiExtension('x-cookie-param', {
    name: cookieName,
    description,
    required: true,
    schema: {
      type: 'string',
    },
    in: 'cookie',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
}

/**
 * Creates CSRF token cookie decorator.
 * Cross-site request forgery protection token.
 *
 * @param cookieName - Cookie name
 * @returns CSRF token cookie decorator
 *
 * @example
 * ```typescript
 * @Post('transfer')
 * @createCsrfTokenCookie('csrf_token')
 * async transfer(@Cookies('csrf_token') csrfToken: string) {
 *   return this.transferService.process(csrfToken);
 * }
 * ```
 */
export function createCsrfTokenCookie(cookieName = 'csrf_token') {
  return ApiExtension('x-cookie-param', {
    name: cookieName,
    description: 'CSRF protection token',
    required: true,
    schema: {
      type: 'string',
      pattern: '^[a-zA-Z0-9-_]{32,}$',
    },
    in: 'cookie',
  });
}

/**
 * Creates preference cookie decorator.
 * User preferences in cookie.
 *
 * @param cookieName - Cookie name
 * @param description - Cookie description
 * @returns Preference cookie decorator
 *
 * @example
 * ```typescript
 * @Get('content')
 * @createPreferenceCookie('user_prefs', 'User preferences')
 * async getContent(@Cookies('user_prefs') prefs: string) {
 *   return this.contentService.getPersonalized(prefs);
 * }
 * ```
 */
export function createPreferenceCookie(
  cookieName: string,
  description: string
) {
  return ApiExtension('x-cookie-param', {
    name: cookieName,
    description,
    required: false,
    schema: {
      type: 'string',
    },
    in: 'cookie',
  });
}

/**
 * Creates tracking cookie decorator.
 * Analytics/tracking cookie.
 *
 * @param cookieName - Cookie name
 * @param description - Cookie description
 * @returns Tracking cookie decorator
 *
 * @example
 * ```typescript
 * @Get('page')
 * @createTrackingCookie('analytics_id', 'Analytics tracking ID')
 * async getPage(@Cookies('analytics_id') analyticsId: string) {
 *   return this.analyticsService.track(analyticsId);
 * }
 * ```
 */
export function createTrackingCookie(
  cookieName: string,
  description: string
) {
  return ApiExtension('x-cookie-param', {
    name: cookieName,
    description,
    required: false,
    schema: {
      type: 'string',
      format: 'uuid',
    },
    in: 'cookie',
  });
}

/**
 * Creates consent cookie decorator.
 * Cookie consent tracking.
 *
 * @param cookieName - Cookie name
 * @returns Consent cookie decorator
 *
 * @example
 * ```typescript
 * @Get('content')
 * @createConsentCookie('cookie_consent')
 * async getContent(@Cookies('cookie_consent') consent: string) {
 *   return this.contentService.getWithConsent(consent);
 * }
 * ```
 */
export function createConsentCookie(cookieName = 'cookie_consent') {
  return ApiExtension('x-cookie-param', {
    name: cookieName,
    description: 'Cookie consent preferences',
    required: false,
    schema: {
      type: 'string',
      enum: ['accepted', 'rejected', 'partial'],
    },
    in: 'cookie',
  });
}

// ============================================================================
// PARAMETER VALIDATION COMPOSERS (6 functions)
// ============================================================================

/**
 * Creates validated string parameter.
 * String parameter with comprehensive validation.
 *
 * @param name - Parameter name
 * @param location - Parameter location
 * @param validation - Validation options
 * @returns Validated string parameter decorator
 *
 * @example
 * ```typescript
 * @Get('users')
 * @createValidatedStringParam('username', 'query', {
 *   minLength: 3,
 *   maxLength: 20,
 *   pattern: '^[a-zA-Z0-9_]+$'
 * })
 * async findUser(@Query('username') username: string) {
 *   return this.userService.findByUsername(username);
 * }
 * ```
 */
export function createValidatedStringParam(
  name: string,
  location: 'path' | 'query' | 'header',
  validation: ValidationOptions
) {
  const schema: any = {
    type: 'string',
    ...(validation.minLength && { minLength: validation.minLength }),
    ...(validation.maxLength && { maxLength: validation.maxLength }),
    ...(validation.pattern && { pattern: validation.pattern }),
    ...(validation.format && { format: validation.format }),
    ...(validation.enum && { enum: validation.enum }),
  };

  const decorator = location === 'path' ? ApiParam : location === 'query' ? ApiQuery : ApiHeader;

  return decorator({
    name,
    required: location === 'path',
    schema,
  });
}

/**
 * Creates validated number parameter.
 * Number parameter with range validation.
 *
 * @param name - Parameter name
 * @param location - Parameter location
 * @param validation - Validation options
 * @returns Validated number parameter decorator
 *
 * @example
 * ```typescript
 * @Get('products')
 * @createValidatedNumberParam('price', 'query', {
 *   minimum: 0,
 *   maximum: 10000
 * })
 * async findProducts(@Query('price') price: number) {
 *   return this.productService.findByPrice(price);
 * }
 * ```
 */
export function createValidatedNumberParam(
  name: string,
  location: 'path' | 'query' | 'header',
  validation: ValidationOptions
) {
  const schema: any = {
    type: 'number',
    ...(validation.minimum !== undefined && { minimum: validation.minimum }),
    ...(validation.maximum !== undefined && { maximum: validation.maximum }),
  };

  const decorator = location === 'path' ? ApiParam : location === 'query' ? ApiQuery : ApiHeader;

  return decorator({
    name,
    required: location === 'path',
    schema,
  });
}

/**
 * Creates validated array parameter.
 * Array parameter with item validation.
 *
 * @param name - Parameter name
 * @param itemType - Type of array items
 * @param validation - Validation options
 * @returns Validated array parameter decorator
 *
 * @example
 * ```typescript
 * @Get('users')
 * @createValidatedArrayParam('ids', 'string', {
 *   minLength: 1,
 *   maxLength: 50
 * })
 * async findUsers(@Query('ids') ids: string[]) {
 *   return this.userService.findByIds(ids);
 * }
 * ```
 */
export function createValidatedArrayParam(
  name: string,
  itemType: 'string' | 'number' | 'boolean',
  validation: ValidationOptions
) {
  const schema: any = {
    type: 'array',
    items: {
      type: itemType,
      ...(validation.pattern && { pattern: validation.pattern }),
      ...(validation.enum && { enum: validation.enum }),
    },
  };

  return ApiQuery({
    name,
    required: false,
    schema,
    style: 'form',
    explode: false,
  });
}

/**
 * Creates conditional parameter.
 * Parameter required only if condition met.
 *
 * @param name - Parameter name
 * @param condition - Condition description
 * @param validation - Validation options
 * @returns Conditional parameter decorator
 *
 * @example
 * ```typescript
 * @Post('users')
 * @createConditionalParam('parentId', 'Required when type is "child"', {
 *   format: 'uuid'
 * })
 * async createUser(@Body() dto: CreateUserDto) {
 *   return this.userService.create(dto);
 * }
 * ```
 */
export function createConditionalParam(
  name: string,
  condition: string,
  validation: ValidationOptions
) {
  const schema: any = {
    type: 'string',
    description: `Conditionally required: ${condition}`,
    ...(validation.format && { format: validation.format }),
    ...(validation.pattern && { pattern: validation.pattern }),
  };

  return applyDecorators(
    ApiQuery({
      name,
      required: false,
      schema,
    }),
    ApiExtension('x-conditional-param', {
      name,
      condition,
    })
  );
}

/**
 * Creates mutually exclusive parameters.
 * Parameters where only one can be provided.
 *
 * @param paramNames - Array of mutually exclusive parameter names
 * @param description - Mutual exclusion description
 * @returns Mutually exclusive parameters decorator
 *
 * @example
 * ```typescript
 * @Get('search')
 * @createMutuallyExclusiveParams(['email', 'phone', 'username'], 'Provide only one identifier')
 * async search(@Query() params: any) {
 *   return this.userService.search(params);
 * }
 * ```
 */
export function createMutuallyExclusiveParams(
  paramNames: string[],
  description: string
) {
  const decorators = paramNames.map(name =>
    ApiQuery({
      name,
      required: false,
      type: String,
      description: `${description} (mutually exclusive with: ${paramNames.filter(p => p !== name).join(', ')})`,
    })
  );

  return applyDecorators(
    ...decorators,
    ApiExtension('x-mutually-exclusive', {
      parameters: paramNames,
      description,
    })
  );
}

/**
 * Creates dependent parameters.
 * Parameters where one requires another.
 *
 * @param primaryParam - Primary parameter
 * @param dependentParams - Parameters dependent on primary
 * @returns Dependent parameters decorator
 *
 * @example
 * ```typescript
 * @Get('search')
 * @createDependentParams('advanced', ['field', 'operator', 'value'])
 * async advancedSearch(@Query() params: any) {
 *   return this.searchService.advanced(params);
 * }
 * ```
 */
export function createDependentParams(
  primaryParam: string,
  dependentParams: string[]
) {
  const decorators = [
    ApiQuery({
      name: primaryParam,
      required: false,
      type: Boolean,
      description: `Enable advanced mode (requires: ${dependentParams.join(', ')})`,
    }),
    ...dependentParams.map(name =>
      ApiQuery({
        name,
        required: false,
        type: String,
        description: `Required when ${primaryParam} is enabled`,
      })
    ),
  ];

  return applyDecorators(
    ...decorators,
    ApiExtension('x-dependent-params', {
      primary: primaryParam,
      dependent: dependentParams,
    })
  );
}
