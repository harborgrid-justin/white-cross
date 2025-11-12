/**
 * Swagger/OpenAPI Custom Decorators
 *
 * Enterprise-ready TypeScript decorators for comprehensive API documentation
 * using @nestjs/swagger and OpenAPI 3.0/3.1 specifications.
 *
 * @module swagger-decorators
 * @version 1.0.0
 */

import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiHeader,
  ApiSecurity,
  ApiTags,
  ApiExtraModels,
  getSchemaPath,
  ApiProperty,
  ApiPropertyOptional,
  ApiExtension,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';

/**
 * Type definitions for decorator options
 * These interfaces provide strong typing for all decorator configuration options
 */

/**
 * Pagination configuration options for paginated endpoints
 */
export interface PaginationOptions {
  /** Default page number (default: 1) */
  defaultPage?: number;
  /** Default items per page (default: 20) */
  defaultLimit?: number;
  /** Maximum items per page (default: 100) */
  maxLimit?: number;
  /** Custom description for pagination parameters */
  description?: string;
}

/**
 * Rate limiting configuration for endpoints
 */
export interface RateLimitOptions {
  /** Maximum number of requests allowed in the time window */
  limit: number;
  /** Time window for rate limiting (e.g., '1m', '1h', '1d') */
  window: string;
  /** Custom description for rate limit */
  description?: string;
}

/**
 * Cache configuration for responses
 */
export interface CacheOptions {
  /** Time-to-live in seconds for cached responses */
  ttl: number;
  /** Optional cache key pattern */
  key?: string;
  /** Custom description for caching behavior */
  description?: string;
}

/**
 * Authentication configuration for endpoints
 */
export interface AuthOptions {
  /** Array of security scheme names (e.g., ['bearer', 'api_key']) */
  schemes: string[];
  /** Optional OAuth2 scopes required for the endpoint */
  scopes?: string[];
  /** Custom description for authentication requirements */
  description?: string;
}

/**
 * File download/upload response configuration
 */
export interface FileResponseOptions {
  /** MIME type of the file (e.g., 'application/pdf', 'image/png') */
  mimeType: string;
  /** Optional filename for Content-Disposition header */
  filename?: string;
  /** Custom description for file response */
  description?: string;
}

/**
 * Example value configuration for requests/responses
 */
export interface ExampleOptions {
  /** Short summary of the example */
  summary?: string;
  /** Detailed description of the example */
  description?: string;
  /** The actual example value (can be any type) */
  value: any;
}

// ============================================================================
// API OPERATION DECORATORS (8 functions)
// ============================================================================

/**
 * Enhanced API operation decorator with additional metadata and security.
 * Provides a comprehensive way to document API endpoints with full OpenAPI 3.0 compliance.
 *
 * @param summary - Short operation summary (recommended: < 50 characters)
 * @param description - Detailed operation description (supports CommonMark syntax)
 * @param tags - Array of operation tags for grouping in documentation
 * @param deprecated - Whether the operation is deprecated
 * @returns Combined decorator
 *
 * @example
 * ```typescript
 * // Basic usage
 * @ApiOperationCustom('Get user', 'Retrieves a user by their unique identifier', ['users'])
 * async getUser(@Param('id') id: string) {
 *   return this.userService.findOne(id);
 * }
 *
 * // With deprecation
 * @ApiOperationCustom(
 *   'Get user (deprecated)',
 *   'Legacy endpoint. Use GET /v2/users/:id instead.',
 *   ['users', 'deprecated'],
 *   true
 * )
 * async getUserLegacy(@Param('id') id: string) {
 *   return this.userService.findOne(id);
 * }
 *
 * // Multiple tags for cross-referencing
 * @ApiOperationCustom(
 *   'Create order',
 *   'Creates a new order and associates it with the authenticated user',
 *   ['orders', 'users', 'commerce']
 * )
 * async createOrder(@Body() createOrderDto: CreateOrderDto) {
 *   return this.orderService.create(createOrderDto);
 * }
 * ```
 */
export function ApiOperationCustom(
  summary: string,
  description: string,
  tags?: string[],
  deprecated = false
) {
  const decorators = [
    ApiOperation({ summary, description, deprecated }),
  ];

  if (tags && tags.length > 0) {
    decorators.push(ApiTags(...tags));
  }

  return applyDecorators(...decorators);
}

/**
 * API operation decorator with built-in authentication requirements.
 *
 * @param summary - Operation summary
 * @param description - Operation description
 * @param authSchemes - Array of required authentication schemes
 * @param scopes - Optional OAuth2 scopes
 * @returns Combined decorator
 *
 * @example
 * ```typescript
 * @ApiOperationWithAuth('Create order', 'Creates a new order', ['bearer'], ['orders:write'])
 * async createOrder(@Body() dto: CreateOrderDto) { }
 * ```
 */
export function ApiOperationWithAuth(
  summary: string,
  description: string,
  authSchemes: string[],
  scopes: string[] = []
) {
  const decorators = [
    ApiOperation({ summary, description }),
    ...authSchemes.map(scheme =>
      scopes.length > 0
        ? ApiSecurity(scheme, scopes)
        : ApiSecurity(scheme)
    ),
  ];

  return applyDecorators(...decorators);
}

/**
 * API operation decorator for paginated responses.
 *
 * @param summary - Operation summary
 * @param description - Operation description
 * @param responseType - The response item type
 * @param options - Pagination configuration options
 * @returns Combined decorator
 *
 * @example
 * ```typescript
 * @ApiOperationPaginated('List users', 'Get paginated users', UserDto)
 * async listUsers(@Query() pagination: PaginationDto) { }
 * ```
 */
export function ApiOperationPaginated<T>(
  summary: string,
  description: string,
  responseType: Type<T>,
  options: PaginationOptions = {}
) {
  const {
    defaultPage = 1,
    defaultLimit = 20,
    maxLimit = 100,
    description: paginationDesc = 'Pagination parameters'
  } = options;

  return applyDecorators(
    ApiOperation({ summary, description }),
    ApiQuery({ name: 'page', required: false, type: Number, description: `Page number (default: ${defaultPage})` }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: `Items per page (default: ${defaultLimit}, max: ${maxLimit})` }),
    ApiExtraModels(responseType),
    ApiResponse({
      status: 200,
      description: 'Paginated response',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(responseType) },
          },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'number' },
              limit: { type: 'number' },
              total: { type: 'number' },
              totalPages: { type: 'number' },
            },
          },
        },
      },
    })
  );
}

/**
 * API operation decorator for async/streaming operations.
 *
 * @param summary - Operation summary
 * @param description - Operation description
 * @param streamType - Type of streaming (sse, websocket, long-polling)
 * @returns Combined decorator
 *
 * @example
 * ```typescript
 * @ApiOperationAsync('Stream events', 'Real-time event stream', 'sse')
 * async streamEvents(@Res() res: Response) { }
 * ```
 */
export function ApiOperationAsync(
  summary: string,
  description: string,
  streamType: 'sse' | 'websocket' | 'long-polling' = 'sse'
) {
  return applyDecorators(
    ApiOperation({
      summary,
      description: `${description}\n\nStream Type: ${streamType}`
    }),
    ApiExtension('x-stream-type', streamType),
    ApiResponse({
      status: 200,
      description: 'Streaming response',
      content: {
        'text/event-stream': {
          schema: { type: 'string' }
        }
      }
    })
  );
}

/**
 * API operation decorator for bulk operations.
 *
 * @param summary - Operation summary
 * @param description - Operation description
 * @param itemType - Type of items in bulk operation
 * @param maxItems - Maximum number of items allowed
 * @returns Combined decorator
 *
 * @example
 * ```typescript
 * @ApiOperationBulk('Bulk create users', 'Create multiple users', CreateUserDto, 100)
 * async bulkCreateUsers(@Body() users: CreateUserDto[]) { }
 * ```
 */
export function ApiOperationBulk<T>(
  summary: string,
  description: string,
  itemType: Type<T>,
  maxItems = 1000
) {
  return applyDecorators(
    ApiOperation({
      summary,
      description: `${description}\n\nMax items: ${maxItems}`
    }),
    ApiExtraModels(itemType),
    ApiBody({
      description: `Array of items (max: ${maxItems})`,
      schema: {
        type: 'array',
        items: { $ref: getSchemaPath(itemType) },
        maxItems,
      },
    }),
    ApiResponse({
      status: 207,
      description: 'Multi-Status response with individual operation results',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'number' },
          failed: { type: 'number' },
          results: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                index: { type: 'number' },
                status: { type: 'string' },
                data: { type: 'object' },
                error: { type: 'string' },
              },
            },
          },
        },
      },
    })
  );
}

/**
 * API operation decorator for conditional operations.
 *
 * @param summary - Operation summary
 * @param description - Operation description
 * @param condition - Condition description
 * @returns Combined decorator
 *
 * @example
 * ```typescript
 * @ApiOperationConditional('Update if modified', 'Updates resource if not modified', 'ETag matches')
 * async updateIfNotModified(@Body() dto: UpdateDto, @Headers('if-match') etag: string) { }
 * ```
 */
export function ApiOperationConditional(
  summary: string,
  description: string,
  condition: string
) {
  return applyDecorators(
    ApiOperation({
      summary,
      description: `${description}\n\nCondition: ${condition}`
    }),
    ApiHeader({
      name: 'If-Match',
      required: false,
      description: 'ETag for conditional update',
    }),
    ApiHeader({
      name: 'If-None-Match',
      required: false,
      description: 'ETag for conditional creation',
    }),
    ApiResponse({ status: 304, description: 'Not Modified - Condition not met' }),
    ApiResponse({ status: 412, description: 'Precondition Failed - Condition check failed' })
  );
}

/**
 * API operation decorator for cached responses.
 *
 * @param summary - Operation summary
 * @param description - Operation description
 * @param cacheOptions - Cache configuration
 * @returns Combined decorator
 *
 * @example
 * ```typescript
 * @ApiOperationCached('Get config', 'Retrieves cached config', { ttl: 300 })
 * async getConfig() { }
 * ```
 */
export function ApiOperationCached(
  summary: string,
  description: string,
  cacheOptions: CacheOptions
) {
  const { ttl, key, description: cacheDesc } = cacheOptions;

  return applyDecorators(
    ApiOperation({
      summary,
      description: `${description}\n\nCache TTL: ${ttl}s${key ? ` | Key: ${key}` : ''}`
    }),
    ApiExtension('x-cache-ttl', ttl),
    key ? ApiExtension('x-cache-key', key) : () => {},
    ApiHeader({
      name: 'Cache-Control',
      required: false,
      description: 'Cache control directives',
    }),
    ApiResponse({
      status: 200,
      description: 'Response may be served from cache',
      headers: {
        'Cache-Control': {
          description: 'Cache control directives',
          schema: { type: 'string' },
        },
        'ETag': {
          description: 'Entity tag for cache validation',
          schema: { type: 'string' },
        },
      },
    })
  );
}

/**
 * API operation decorator for rate-limited operations.
 *
 * @param summary - Operation summary
 * @param description - Operation description
 * @param rateLimitOptions - Rate limit configuration
 * @returns Combined decorator
 *
 * @example
 * ```typescript
 * @ApiOperationRateLimit('Send email', 'Sends email', { limit: 10, window: '1m' })
 * async sendEmail(@Body() dto: EmailDto) { }
 * ```
 */
export function ApiOperationRateLimit(
  summary: string,
  description: string,
  rateLimitOptions: RateLimitOptions
) {
  const { limit, window, description: rateLimitDesc } = rateLimitOptions;

  return applyDecorators(
    ApiOperation({
      summary,
      description: `${description}\n\nRate Limit: ${limit} requests per ${window}`
    }),
    ApiExtension('x-rate-limit', { limit, window }),
    ApiResponse({
      status: 429,
      description: 'Too Many Requests - Rate limit exceeded',
      headers: {
        'X-RateLimit-Limit': {
          description: 'Request limit per time window',
          schema: { type: 'number' },
        },
        'X-RateLimit-Remaining': {
          description: 'Remaining requests in current window',
          schema: { type: 'number' },
        },
        'X-RateLimit-Reset': {
          description: 'Time when rate limit resets (Unix timestamp)',
          schema: { type: 'number' },
        },
      },
    })
  );
}

// ============================================================================
// RESPONSE SCHEMA DECORATORS (10 functions)
// ============================================================================

/**
 * Typed response schema decorator with status code.
 *
 * @param status - HTTP status code
 * @param type - Response type class
 * @param description - Response description
 * @param isArray - Whether response is an array
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiResponseSchema(200, UserDto, 'User retrieved successfully')
 * async getUser(@Param('id') id: string) { }
 * ```
 */
export function ApiResponseSchema<T>(
  status: number,
  type: Type<T>,
  description: string,
  isArray = false
) {
  return applyDecorators(
    ApiExtraModels(type),
    ApiResponse({
      status,
      description,
      schema: isArray
        ? {
            type: 'array',
            items: { $ref: getSchemaPath(type) },
          }
        : { $ref: getSchemaPath(type) },
    })
  );
}

/**
 * Paginated response decorator with comprehensive metadata.
 * Follows common pagination patterns with complete OpenAPI 3.0 schema definition.
 *
 * @param type - Item type class for the paginated items
 * @param description - Response description
 * @returns Decorator
 *
 * @example
 * ```typescript
 * // Basic paginated response
 * @ApiResponsePaginated(ProductDto, 'Paginated list of products')
 * @Get('products')
 * async listProducts(
 *   @Query('page') page: number = 1,
 *   @Query('limit') limit: number = 20
 * ) {
 *   return this.productService.findPaginated(page, limit);
 * }
 *
 * // With sorting and filtering
 * @ApiResponsePaginated(UserDto, 'Paginated users with filters applied')
 * @ApiQuery({ name: 'sortBy', required: false })
 * @ApiQuery({ name: 'status', enum: UserStatus, required: false })
 * @Get('users')
 * async listUsers(
 *   @Query('page') page: number,
 *   @Query('limit') limit: number,
 *   @Query('sortBy') sortBy?: string,
 *   @Query('status') status?: UserStatus
 * ) {
 *   return this.userService.findPaginated({ page, limit, sortBy, status });
 * }
 * ```
 *
 * Expected response format:
 * ```json
 * {
 *   "data": [...items],
 *   "pagination": {
 *     "page": 1,
 *     "limit": 20,
 *     "total": 100,
 *     "totalPages": 5,
 *     "hasNextPage": true,
 *     "hasPreviousPage": false
 *   }
 * }
 * ```
 */
export function ApiResponsePaginated<T>(type: Type<T>, description = 'Paginated response') {
  return applyDecorators(
    ApiExtraModels(type),
    ApiResponse({
      status: 200,
      description,
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(type) },
            description: 'Array of items for the current page',
          },
          pagination: {
            type: 'object',
            description: 'Pagination metadata',
            properties: {
              page: { type: 'number', example: 1, description: 'Current page number (1-indexed)' },
              limit: { type: 'number', example: 20, description: 'Number of items per page' },
              total: { type: 'number', example: 100, description: 'Total number of items across all pages' },
              totalPages: { type: 'number', example: 5, description: 'Total number of pages' },
              hasNextPage: { type: 'boolean', example: true, description: 'Whether there is a next page available' },
              hasPreviousPage: { type: 'boolean', example: false, description: 'Whether there is a previous page available' },
            },
            required: ['page', 'limit', 'total', 'totalPages', 'hasNextPage', 'hasPreviousPage'],
          },
        },
        required: ['data', 'pagination'],
      },
    })
  );
}

/**
 * Array response decorator.
 *
 * @param type - Item type class
 * @param description - Response description
 * @param minItems - Minimum array length
 * @param maxItems - Maximum array length
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiResponseArray(TagDto, 'List of tags', 0, 50)
 * async getTags() { }
 * ```
 */
export function ApiResponseArray<T>(
  type: Type<T>,
  description = 'Array response',
  minItems?: number,
  maxItems?: number
) {
  return applyDecorators(
    ApiExtraModels(type),
    ApiResponse({
      status: 200,
      description,
      schema: {
        type: 'array',
        items: { $ref: getSchemaPath(type) },
        ...(minItems !== undefined && { minItems }),
        ...(maxItems !== undefined && { maxItems }),
      },
    })
  );
}

/**
 * Union type response decorator (multiple possible types).
 *
 * @param types - Array of possible response types
 * @param description - Response description
 * @param discriminatorProperty - Property name for discriminating types
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiResponseUnion([SuccessResponseDto, ErrorResponseDto], 'Operation result', 'status')
 * async performOperation() { }
 * ```
 */
export function ApiResponseUnion<T>(
  types: Type<T>[],
  description = 'Union type response',
  discriminatorProperty?: string
) {
  const schemas = types.map(type => ({ $ref: getSchemaPath(type) }));

  return applyDecorators(
    ApiExtraModels(...types),
    ApiResponse({
      status: 200,
      description,
      schema: {
        oneOf: schemas,
        ...(discriminatorProperty && {
          discriminator: {
            propertyName: discriminatorProperty,
          },
        }),
      },
    })
  );
}

/**
 * File download response decorator.
 *
 * @param options - File response options
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiResponseFile({ mimeType: 'application/pdf', filename: 'report.pdf' })
 * async downloadReport(@Param('id') id: string) { }
 * ```
 */
export function ApiResponseFile(options: FileResponseOptions) {
  const { mimeType, filename, description = 'File download' } = options;

  return applyDecorators(
    ApiResponse({
      status: 200,
      description,
      content: {
        [mimeType]: {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      headers: {
        'Content-Type': {
          description: 'MIME type of the file',
          schema: { type: 'string', example: mimeType },
        },
        ...(filename && {
          'Content-Disposition': {
            description: 'File download disposition',
            schema: { type: 'string', example: `attachment; filename="${filename}"` },
          },
        }),
      },
    })
  );
}

/**
 * Streaming response decorator.
 *
 * @param description - Response description
 * @param contentType - Stream content type
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiResponseStream('Real-time data stream', 'text/event-stream')
 * async streamData(@Res() res: Response) { }
 * ```
 */
export function ApiResponseStream(
  description = 'Streaming response',
  contentType = 'text/event-stream'
) {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description,
      content: {
        [contentType]: {
          schema: { type: 'string' },
        },
      },
      headers: {
        'Content-Type': {
          description: 'Stream content type',
          schema: { type: 'string', example: contentType },
        },
        'Cache-Control': {
          description: 'Cache control for streaming',
          schema: { type: 'string', example: 'no-cache' },
        },
        'Connection': {
          description: 'Connection type',
          schema: { type: 'string', example: 'keep-alive' },
        },
      },
    })
  );
}

/**
 * Standard error responses decorator.
 * Adds common error response documentation (400, 401, 403, 404, 500).
 *
 * @returns Combined decorator with all standard error responses
 *
 * @example
 * ```typescript
 * @ApiResponseStandardErrors()
 * @ApiResponseSchema(200, UserDto, 'User retrieved successfully')
 * @Get('users/:id')
 * async getUser(@Param('id') id: string) {
 *   return this.userService.findOne(id);
 * }
 * ```
 */
export function ApiResponseStandardErrors() {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: 'Bad Request - Invalid input data',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: { type: 'string', example: 'Validation failed' },
          error: { type: 'string', example: 'Bad Request' },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Authentication required or failed',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 401 },
          message: { type: 'string', example: 'Unauthorized' },
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 403 },
          message: { type: 'string', example: 'Forbidden resource' },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found - Resource does not exist',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Resource not found' },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: 'Internal Server Error - Unexpected server error',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 500 },
          message: { type: 'string', example: 'Internal server error' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    })
  );
}

/**
 * Conflict response decorator (409).
 * Used when a request conflicts with the current state of the resource.
 *
 * @param description - Custom conflict description
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiResponseConflict('User with this email already exists')
 * @Post('users')
 * async createUser(@Body() createUserDto: CreateUserDto) {
 *   return this.userService.create(createUserDto);
 * }
 * ```
 */
export function ApiResponseConflict(description = 'Conflict - Resource already exists or conflicts with current state') {
  return ApiResponse({
    status: 409,
    description,
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: 'Resource conflict' },
        error: { type: 'string', example: 'Conflict' },
        conflictingField: { type: 'string', example: 'email', description: 'Field causing the conflict' },
      },
    },
  });
}

/**
 * Unprocessable Entity response decorator (422).
 * Used when the request is well-formed but contains semantic errors.
 *
 * @param description - Custom validation description
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiResponseUnprocessableEntity('Validation failed for business rules')
 * @Post('orders')
 * async createOrder(@Body() createOrderDto: CreateOrderDto) {
 *   return this.orderService.create(createOrderDto);
 * }
 * ```
 */
export function ApiResponseUnprocessableEntity(description = 'Unprocessable Entity - Semantic validation failed') {
  return ApiResponse({
    status: 422,
    description,
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 422 },
        message: { type: 'string', example: 'Unprocessable entity' },
        error: { type: 'string', example: 'Unprocessable Entity' },
        validationErrors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string', example: 'orderDate' },
              message: { type: 'string', example: 'Order date cannot be in the past' },
              constraint: { type: 'string', example: 'futureDate' },
            },
          },
        },
      },
    },
  });
}

// ============================================================================
// REQUEST BODY DECORATORS (6 functions)
// ============================================================================

/**
 * Typed request body schema decorator.
 *
 * @param type - Request body type class
 * @param description - Body description
 * @param required - Whether body is required
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiBodySchema(CreateUserDto, 'User creation data')
 * async createUser(@Body() dto: CreateUserDto) { }
 * ```
 */
export function ApiBodySchema<T>(
  type: Type<T>,
  description = 'Request body',
  required = true
) {
  return applyDecorators(
    ApiExtraModels(type),
    ApiBody({
      description,
      type,
      required,
    })
  );
}

/**
 * Array request body decorator.
 *
 * @param type - Item type class
 * @param description - Body description
 * @param minItems - Minimum array length
 * @param maxItems - Maximum array length
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiBodyArray(CreateProductDto, 'Array of products to create', 1, 100)
 * async bulkCreateProducts(@Body() products: CreateProductDto[]) { }
 * ```
 */
export function ApiBodyArray<T>(
  type: Type<T>,
  description = 'Array request body',
  minItems = 1,
  maxItems = 1000
) {
  return applyDecorators(
    ApiExtraModels(type),
    ApiBody({
      description: `${description} (min: ${minItems}, max: ${maxItems})`,
      schema: {
        type: 'array',
        items: { $ref: getSchemaPath(type) },
        minItems,
        maxItems,
      },
    })
  );
}

/**
 * Partial schema body decorator (for PATCH operations).
 *
 * @param type - Base type class
 * @param description - Body description
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiBodyPartial(UpdateUserDto, 'Partial user update data')
 * async updateUser(@Param('id') id: string, @Body() dto: Partial<UpdateUserDto>) { }
 * ```
 */
export function ApiBodyPartial<T>(
  type: Type<T>,
  description = 'Partial update body'
) {
  return applyDecorators(
    ApiExtraModels(type),
    ApiBody({
      description: `${description} (all fields optional)`,
      schema: {
        allOf: [
          { $ref: getSchemaPath(type) },
        ],
        // Mark all properties as optional
        properties: {},
        required: [],
      },
    })
  );
}

/**
 * Multipart form data body decorator for file uploads.
 * Supports file uploads with additional form fields.
 *
 * @param fields - Field definitions with types
 * @param description - Body description
 * @returns Decorator
 *
 * @example
 * ```typescript
 * // Single file upload with metadata
 * @ApiBodyMultipart({
 *   file: 'binary',
 *   name: 'string',
 *   description: 'string',
 *   tags: 'array'
 * }, 'Upload file with metadata')
 * @Post('upload')
 * async uploadFile(
 *   @UploadedFile() file: Express.Multer.File,
 *   @Body() body: { name: string; description: string; tags: string[] }
 * ) {
 *   return this.fileService.upload(file, body);
 * }
 *
 * // Multiple files upload
 * @ApiBodyMultipart({
 *   files: 'binary',
 *   category: 'string',
 *   isPublic: 'boolean'
 * }, 'Upload multiple files')
 * @Post('upload-multiple')
 * async uploadMultiple(
 *   @UploadedFiles() files: Express.Multer.File[],
 *   @Body() body: { category: string; isPublic: boolean }
 * ) {
 *   return this.fileService.uploadMultiple(files, body);
 * }
 * ```
 */
export function ApiBodyMultipart(
  fields: Record<string, 'string' | 'number' | 'boolean' | 'binary' | 'array'>,
  description = 'Multipart form data'
) {
  const properties: Record<string, any> = {};

  Object.entries(fields).forEach(([name, type]) => {
    if (type === 'binary') {
      properties[name] = {
        type: 'string',
        format: 'binary',
        description: `Binary file data for field '${name}'`
      };
    } else if (type === 'array') {
      properties[name] = {
        type: 'array',
        items: { type: 'string' },
        description: `Array of values for field '${name}'`
      };
    } else {
      properties[name] = { type, description: `${type} value for field '${name}'` };
    }
  });

  return applyDecorators(
    ApiBody({
      description,
      schema: {
        type: 'object',
        properties,
      },
    })
  );
}

/**
 * File upload body decorator with validation constraints.
 *
 * @param fieldName - Name of the file field
 * @param options - File upload options
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiBodyFileUpload('avatar', {
 *   maxSize: 5242880, // 5MB
 *   allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
 *   description: 'User avatar image'
 * })
 * @Post('avatar')
 * async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
 *   return this.userService.updateAvatar(file);
 * }
 * ```
 */
export function ApiBodyFileUpload(
  fieldName = 'file',
  options: {
    maxSize?: number;
    allowedMimeTypes?: string[];
    description?: string;
    required?: boolean;
  } = {}
) {
  const {
    maxSize,
    allowedMimeTypes,
    description = 'File upload',
    required = true
  } = options;

  const constraints: string[] = [];
  if (maxSize) {
    constraints.push(`Max size: ${(maxSize / 1024 / 1024).toFixed(2)}MB`);
  }
  if (allowedMimeTypes && allowedMimeTypes.length > 0) {
    constraints.push(`Allowed types: ${allowedMimeTypes.join(', ')}`);
  }

  const fullDescription = constraints.length > 0
    ? `${description} | ${constraints.join(' | ')}`
    : description;

  return applyDecorators(
    ApiBody({
      description: fullDescription,
      required,
      schema: {
        type: 'object',
        properties: {
          [fieldName]: {
            type: 'string',
            format: 'binary',
            description: fullDescription,
          },
        },
        ...(required && { required: [fieldName] }),
      },
    })
  );
}

/**
 * Content negotiation decorator for endpoints that accept multiple content types.
 *
 * @param contentTypes - Array of supported content types
 * @param schemas - Schema for each content type
 * @param description - Body description
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiBodyContentNegotiation(
 *   ['application/json', 'application/xml'],
 *   {
 *     'application/json': { $ref: getSchemaPath(CreateUserDto) },
 *     'application/xml': { type: 'string', example: '<user><name>John</name></user>' }
 *   },
 *   'User data in JSON or XML format'
 * )
 * @Post('users')
 * async createUser(@Body() data: any, @Headers('content-type') contentType: string) {
 *   return this.userService.create(data, contentType);
 * }
 * ```
 */
export function ApiBodyContentNegotiation(
  contentTypes: string[],
  schemas: Record<string, any>,
  description = 'Request body with content negotiation'
) {
  const content: Record<string, any> = {};
  contentTypes.forEach(type => {
    if (schemas[type]) {
      content[type] = { schema: schemas[type] };
    }
  });

  return applyDecorators(
    ApiBody({
      description: `${description} | Supported: ${contentTypes.join(', ')}`,
      content,
    })
  );
}

// ============================================================================
// PARAMETER DECORATORS (8 functions)
// ============================================================================

/**
 * Enum query parameter decorator.
 *
 * @param name - Parameter name
 * @param enumType - Enum type
 * @param description - Parameter description
 * @param required - Whether parameter is required
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiQueryEnum('status', UserStatus, 'User status filter')
 * async getUsers(@Query('status') status: UserStatus) { }
 * ```
 */
export function ApiQueryEnum(
  name: string,
  enumType: object,
  description = '',
  required = false
) {
  return ApiQuery({
    name,
    enum: enumType,
    description: `${description} | Possible values: ${Object.values(enumType).join(', ')}`,
    required,
  });
}

/**
 * Array query parameter decorator.
 *
 * @param name - Parameter name
 * @param description - Parameter description
 * @param required - Whether parameter is required
 * @param itemType - Type of array items
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiQueryArray('ids', 'Array of user IDs', false, 'string')
 * async getUsersByIds(@Query('ids') ids: string[]) { }
 * ```
 */
export function ApiQueryArray(
  name: string,
  description = '',
  required = false,
  itemType: 'string' | 'number' | 'boolean' = 'string'
) {
  return ApiQuery({
    name,
    description: `${description} (comma-separated values)`,
    required,
    type: 'array',
    items: { type: itemType },
    style: 'form',
    explode: false,
  });
}

/**
 * Pagination query parameters decorator.
 *
 * @param options - Pagination options
 * @returns Combined decorator
 *
 * @example
 * ```typescript
 * @ApiQueryPagination({ defaultPage: 1, defaultLimit: 20, maxLimit: 100 })
 * async listItems(@Query() pagination: PaginationDto) { }
 * ```
 */
export function ApiQueryPagination(options: PaginationOptions = {}) {
  const {
    defaultPage = 1,
    defaultLimit = 20,
    maxLimit = 100,
  } = options;

  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: `Page number (default: ${defaultPage})`,
      example: defaultPage,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: `Items per page (default: ${defaultLimit}, max: ${maxLimit})`,
      example: defaultLimit,
    }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      type: String,
      description: 'Field to sort by',
    }),
    ApiQuery({
      name: 'sortOrder',
      required: false,
      enum: ['asc', 'desc'],
      description: 'Sort order',
    })
  );
}

/**
 * Search query parameters decorator.
 *
 * @param searchFields - Searchable field names
 * @param description - Search description
 * @returns Combined decorator
 *
 * @example
 * ```typescript
 * @ApiQuerySearch(['name', 'email', 'phone'])
 * async searchUsers(@Query('q') query: string) { }
 * ```
 */
export function ApiQuerySearch(
  searchFields: string[],
  description = 'Search query'
) {
  return applyDecorators(
    ApiQuery({
      name: 'q',
      required: false,
      type: String,
      description: `${description} | Searches in: ${searchFields.join(', ')}`,
    }),
    ApiQuery({
      name: 'searchFields',
      required: false,
      type: 'array',
      items: { type: 'string', enum: searchFields },
      description: 'Specific fields to search in',
    })
  );
}

/**
 * ID path parameter decorator.
 *
 * @param name - Parameter name
 * @param description - Parameter description
 * @param format - ID format (uuid, number, string)
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiPathId('id', 'User ID', 'uuid')
 * async getUser(@Param('id') id: string) { }
 * ```
 */
export function ApiPathId(
  name = 'id',
  description = 'Resource ID',
  format: 'uuid' | 'number' | 'string' = 'uuid'
) {
  const schema: any = {};

  if (format === 'uuid') {
    schema.type = 'string';
    schema.format = 'uuid';
    schema.pattern = '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
  } else if (format === 'number') {
    schema.type = 'integer';
    schema.minimum = 1;
  } else {
    schema.type = 'string';
  }

  return ApiParam({
    name,
    description,
    schema,
  });
}

/**
 * UUID path parameter decorator.
 *
 * @param name - Parameter name
 * @param description - Parameter description
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiPathUuid('userId', 'User unique identifier')
 * async getUser(@Param('userId') userId: string) { }
 * ```
 */
export function ApiPathUuid(name: string, description = 'UUID parameter') {
  return ApiParam({
    name,
    description,
    schema: {
      type: 'string',
      format: 'uuid',
      pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
    },
  });
}

/**
 * Authorization header parameter decorator.
 *
 * @param scheme - Auth scheme (Bearer, Basic, etc.)
 * @param description - Header description
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiHeaderAuth('Bearer', 'JWT authentication token')
 * async protectedEndpoint() { }
 * ```
 */
export function ApiHeaderAuth(
  scheme = 'Bearer',
  description = 'Authentication header'
) {
  return ApiHeader({
    name: 'Authorization',
    description: `${description} | Format: ${scheme} <token>`,
    required: true,
    schema: {
      type: 'string',
      example: `${scheme} eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`,
    },
  });
}

/**
 * Custom header parameter decorator.
 *
 * @param name - Header name
 * @param description - Header description
 * @param required - Whether header is required
 * @param example - Example value
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiHeaderCustom('X-Request-ID', 'Request tracking ID', false, '123e4567-e89b-12d3-a456-426614174000')
 * async handleRequest(@Headers('x-request-id') requestId: string) { }
 * ```
 */
export function ApiHeaderCustom(
  name: string,
  description: string,
  required = false,
  example?: string
) {
  return ApiHeader({
    name,
    description,
    required,
    schema: {
      type: 'string',
      ...(example && { example }),
    },
  });
}

// ============================================================================
// SECURITY REQUIREMENT DECORATORS (4 functions)
// ============================================================================

/**
 * JWT authentication security decorator.
 *
 * @param scopes - Required OAuth2 scopes
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiSecurityJWT(['read:users', 'write:users'])
 * async manageUsers() { }
 * ```
 */
export function ApiSecurityJWT(scopes: string[] = []) {
  return applyDecorators(
    ApiSecurity('bearer', scopes),
    ApiHeaderAuth('Bearer', 'JWT authentication token'),
    ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' }),
    ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  );
}

/**
 * API key authentication security decorator.
 *
 * @param location - Where API key is provided (header, query, cookie)
 * @param name - API key parameter name
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiSecurityApiKey('header', 'X-API-Key')
 * async apiKeyProtectedEndpoint() { }
 * ```
 */
export function ApiSecurityApiKey(
  location: 'header' | 'query' | 'cookie' = 'header',
  name = 'X-API-Key'
) {
  const decorators = [
    ApiSecurity('api_key'),
    ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing API key' }),
  ];

  if (location === 'header') {
    decorators.push(ApiHeader({ name, description: 'API Key', required: true }));
  } else if (location === 'query') {
    decorators.push(ApiQuery({ name, description: 'API Key', required: true }));
  }

  return applyDecorators(...decorators);
}

/**
 * OAuth2 authentication security decorator.
 *
 * @param scopes - Required OAuth2 scopes
 * @param flow - OAuth2 flow type
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiSecurityOAuth2(['read:data', 'write:data'], 'authorizationCode')
 * async oauth2ProtectedEndpoint() { }
 * ```
 */
export function ApiSecurityOAuth2(
  scopes: string[],
  flow: 'authorizationCode' | 'implicit' | 'clientCredentials' | 'password' = 'authorizationCode'
) {
  return applyDecorators(
    ApiSecurity('oauth2', scopes),
    ApiExtension('x-oauth2-flow', flow),
    ApiResponse({ status: 401, description: 'Unauthorized - OAuth2 authentication failed' }),
    ApiResponse({ status: 403, description: 'Forbidden - Insufficient OAuth2 scopes' })
  );
}

/**
 * Multiple authentication schemes decorator.
 *
 * @param schemes - Array of security scheme configurations
 * @returns Combined decorator
 *
 * @example
 * ```typescript
 * @ApiSecurityMultiple([
 *   { name: 'bearer', scopes: ['read'] },
 *   { name: 'api_key', scopes: [] }
 * ])
 * async multiAuthEndpoint() { }
 * ```
 */
export function ApiSecurityMultiple(
  schemes: Array<{ name: string; scopes?: string[] }>
) {
  const decorators = schemes.map(scheme =>
    ApiSecurity(scheme.name, scheme.scopes || [])
  );

  decorators.push(
    ApiResponse({ status: 401, description: 'Unauthorized - Authentication required' }),
    ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  );

  return applyDecorators(...decorators);
}

// ============================================================================
// EXAMPLE VALUE DECORATORS (3 functions)
// ============================================================================

/**
 * Request example decorator.
 *
 * @param example - Example request data
 * @param summary - Example summary
 * @param description - Example description
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiExampleRequest({ name: 'John', email: 'john@example.com' }, 'Basic user')
 * async createUser(@Body() dto: CreateUserDto) { }
 * ```
 */
export function ApiExampleRequest(
  example: any,
  summary = 'Example request',
  description = ''
) {
  return ApiExtension('x-request-example', {
    summary,
    description,
    value: example,
  });
}

/**
 * Response example decorator.
 *
 * @param status - HTTP status code
 * @param example - Example response data
 * @param summary - Example summary
 * @param description - Example description
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiExampleResponse(200, { id: '123', name: 'John' }, 'Successful response')
 * async getUser(@Param('id') id: string) { }
 * ```
 */
export function ApiExampleResponse(
  status: number,
  example: any,
  summary = 'Example response',
  description = ''
) {
  return ApiExtension(`x-response-example-${status}`, {
    summary,
    description,
    value: example,
  });
}

/**
 * Multiple examples decorator for complex scenarios.
 *
 * @param examples - Array of example configurations
 * @returns Combined decorator
 *
 * @example
 * ```typescript
 * @ApiExampleMultiple([
 *   { summary: 'Success', value: { status: 'ok' } },
 *   { summary: 'Error', value: { status: 'error', message: 'Failed' } }
 * ])
 * async complexOperation() { }
 * ```
 */
export function ApiExampleMultiple(examples: ExampleOptions[]) {
  const decorators = examples.map((example, index) =>
    ApiExtension(`x-example-${index}`, {
      summary: example.summary,
      description: example.description,
      value: example.value,
    })
  );

  return applyDecorators(...decorators);
}

// ============================================================================
// DEPRECATED ENDPOINT DECORATORS (2 functions)
// ============================================================================

/**
 * Mark endpoint as deprecated.
 *
 * @param reason - Deprecation reason
 * @param sunsetDate - Date when endpoint will be removed (ISO 8601)
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiDeprecated('Use /v2/users instead', '2025-12-31')
 * async getUsers() { }
 * ```
 */
export function ApiDeprecated(reason: string, sunsetDate?: string) {
  const decorators = [
    ApiOperation({ deprecated: true }),
    ApiExtension('x-deprecation-reason', reason),
  ];

  if (sunsetDate) {
    decorators.push(ApiExtension('x-sunset-date', sunsetDate));
    decorators.push(
      ApiHeader({
        name: 'Sunset',
        required: false,
        description: 'Date when this endpoint will be removed',
        schema: { type: 'string', example: sunsetDate },
      })
    );
  }

  decorators.push(
    ApiResponse({
      status: 299,
      description: `Deprecated - ${reason}`,
      headers: {
        'Deprecation': {
          description: 'Indicates that the endpoint is deprecated',
          schema: { type: 'string', example: 'true' },
        },
        'Link': {
          description: 'Link to alternative endpoint',
          schema: { type: 'string' },
        },
      },
    })
  );

  return applyDecorators(...decorators);
}

/**
 * Mark endpoint as deprecated with alternative.
 *
 * @param alternativeEndpoint - Alternative endpoint path
 * @param reason - Deprecation reason
 * @param sunsetDate - Date when endpoint will be removed
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiDeprecatedWithAlternative('/api/v2/users', 'API v1 is being phased out', '2025-12-31')
 * async getUsers() { }
 * ```
 */
export function ApiDeprecatedWithAlternative(
  alternativeEndpoint: string,
  reason: string,
  sunsetDate?: string
) {
  const decorators = [
    ApiOperation({
      deprecated: true,
      description: `**DEPRECATED**: ${reason}\n\nUse \`${alternativeEndpoint}\` instead.`
    }),
    ApiExtension('x-deprecation-reason', reason),
    ApiExtension('x-alternative-endpoint', alternativeEndpoint),
  ];

  if (sunsetDate) {
    decorators.push(ApiExtension('x-sunset-date', sunsetDate));
  }

  decorators.push(
    ApiResponse({
      status: 299,
      description: `Deprecated - ${reason}`,
      headers: {
        'Deprecation': {
          description: 'Indicates that the endpoint is deprecated',
          schema: { type: 'string', example: 'true' },
        },
        'Link': {
          description: 'Link to alternative endpoint',
          schema: { type: 'string', example: `<${alternativeEndpoint}>; rel="alternate"` },
        },
        ...(sunsetDate && {
          'Sunset': {
            description: 'Date when this endpoint will be removed',
            schema: { type: 'string', example: sunsetDate },
          },
        }),
      },
    })
  );

  return applyDecorators(...decorators);
}

// ============================================================================
// API TAG DECORATORS (3 functions)
// ============================================================================

/**
 * Custom tags decorator with additional metadata.
 *
 * @param tags - Array of tag names
 * @param description - Tags description
 * @param externalDocs - External documentation URL
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiTagsCustom(['users', 'admin'], 'User management', 'https://docs.example.com/users')
 * class UsersController { }
 * ```
 */
export function ApiTagsCustom(
  tags: string[],
  description?: string,
  externalDocs?: string
) {
  const decorators = [ApiTags(...tags)];

  if (description || externalDocs) {
    decorators.push(
      ApiExtension('x-tags-metadata', {
        tags,
        description,
        externalDocs,
      })
    );
  }

  return applyDecorators(...decorators);
}

/**
 * Grouped tags decorator for organizing endpoints.
 *
 * @param group - Tag group name
 * @param tags - Array of tags in this group
 * @param priority - Display priority
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiTagsGrouped('User Management', ['users', 'profiles', 'authentication'], 1)
 * class UserModule { }
 * ```
 */
export function ApiTagsGrouped(
  group: string,
  tags: string[],
  priority = 0
) {
  return applyDecorators(
    ApiTags(...tags),
    ApiExtension('x-tag-group', {
      name: group,
      tags,
      priority,
    })
  );
}

/**
 * Versioned tags decorator.
 *
 * @param tags - Array of tag names
 * @param version - API version
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiTagsVersioned(['users'], 'v2')
 * class UsersV2Controller { }
 * ```
 */
export function ApiTagsVersioned(tags: string[], version: string) {
  const versionedTags = tags.map(tag => `${version}/${tag}`);

  return applyDecorators(
    ApiTags(...versionedTags),
    ApiExtension('x-api-version', version),
    ApiExtension('x-original-tags', tags)
  );
}

// ============================================================================
// EXTERNAL DOCS DECORATORS (2 functions)
// ============================================================================

/**
 * External documentation decorator.
 *
 * @param url - Documentation URL
 * @param description - Documentation description
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiExternalDocs('https://docs.example.com/api/users', 'User API Documentation')
 * class UsersController { }
 * ```
 */
export function ApiExternalDocs(url: string, description = 'External documentation') {
  return ApiExtension('x-external-docs', {
    description,
    url,
  });
}

/**
 * Multiple external documentation sources decorator.
 *
 * @param docs - Array of documentation sources
 * @returns Combined decorator
 *
 * @example
 * ```typescript
 * @ApiExternalDocsMultiple([
 *   { url: 'https://docs.example.com/api', description: 'API Docs' },
 *   { url: 'https://docs.example.com/guide', description: 'Developer Guide' }
 * ])
 * class ApiController { }
 * ```
 */
export function ApiExternalDocsMultiple(
  docs: Array<{ url: string; description: string }>
) {
  return ApiExtension('x-external-docs-multiple', docs);
}

// ============================================================================
// CALLBACK DECORATORS (2 functions)
// ============================================================================

/**
 * Callback definition decorator for async operations.
 *
 * @param name - Callback name
 * @param url - Callback URL expression
 * @param method - HTTP method for callback
 * @param requestBody - Callback request body schema
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiCallback('orderStatusUpdate', '{$request.body#/callbackUrl}', 'post', OrderStatusDto)
 * async createOrder(@Body() dto: CreateOrderDto) { }
 * ```
 */
export function ApiCallback<T>(
  name: string,
  url: string,
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  requestBody?: Type<T>
) {
  const callback: any = {
    [url]: {
      [method]: {
        description: `${name} callback`,
        ...(requestBody && {
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: getSchemaPath(requestBody) },
              },
            },
          },
        }),
      },
    },
  };

  const decorators = [
    ApiExtension('x-callback', { name, callback }),
  ];

  if (requestBody) {
    decorators.push(ApiExtraModels(requestBody));
  }

  return applyDecorators(...decorators);
}

/**
 * Multiple callbacks decorator.
 *
 * @param callbacks - Array of callback definitions
 * @returns Combined decorator
 *
 * @example
 * ```typescript
 * @ApiCallbackMultiple([
 *   { name: 'onSuccess', url: '{$request.body#/successUrl}', method: 'post' },
 *   { name: 'onError', url: '{$request.body#/errorUrl}', method: 'post' }
 * ])
 * async processAsync(@Body() dto: AsyncProcessDto) { }
 * ```
 */
export function ApiCallbackMultiple(
  callbacks: Array<{
    name: string;
    url: string;
    method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    requestBody?: Type<any>;
  }>
) {
  const decorators = callbacks.flatMap(callback => {
    const decs = [
      ApiExtension(`x-callback-${callback.name}`, {
        url: callback.url,
        method: callback.method,
      }),
    ];

    if (callback.requestBody) {
      decs.push(ApiExtraModels(callback.requestBody));
    }

    return decs;
  });

  return applyDecorators(...decorators);
}

// ============================================================================
// WEBHOOK DECORATORS (2 functions)
// ============================================================================

/**
 * Webhook definition decorator.
 *
 * @param name - Webhook name
 * @param method - HTTP method
 * @param payloadType - Webhook payload type
 * @param description - Webhook description
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiWebhook('orderCreated', 'post', OrderCreatedDto, 'Fired when order is created')
 * class WebhookController { }
 * ```
 */
export function ApiWebhook<T>(
  name: string,
  method: 'post' | 'put' | 'patch',
  payloadType: Type<T>,
  description = ''
) {
  return applyDecorators(
    ApiExtension('x-webhook', {
      name,
      method,
      description,
    }),
    ApiExtraModels(payloadType),
    ApiBody({
      description: `${name} webhook payload`,
      type: payloadType,
    })
  );
}

/**
 * Secured webhook decorator with signature verification.
 *
 * @param name - Webhook name
 * @param payloadType - Webhook payload type
 * @param signatureHeader - Header name for signature
 * @param algorithm - Signature algorithm
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiWebhookSecurity('paymentProcessed', PaymentDto, 'X-Webhook-Signature', 'HMAC-SHA256')
 * class PaymentWebhookController { }
 * ```
 */
export function ApiWebhookSecurity<T>(
  name: string,
  payloadType: Type<T>,
  signatureHeader = 'X-Webhook-Signature',
  algorithm = 'HMAC-SHA256'
) {
  return applyDecorators(
    ApiExtension('x-webhook-security', {
      name,
      signatureHeader,
      algorithm,
    }),
    ApiExtraModels(payloadType),
    ApiHeader({
      name: signatureHeader,
      description: `Webhook signature for verification (${algorithm})`,
      required: true,
    }),
    ApiBody({
      description: `${name} webhook payload`,
      type: payloadType,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid webhook signature',
    })
  );
}

// ============================================================================
// DISCRIMINATOR DECORATORS (2 functions)
// ============================================================================

/**
 * Schema discriminator decorator for polymorphic types.
 *
 * @param propertyName - Discriminator property name
 * @param types - Array of possible types
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiDiscriminator('type', [DogDto, CatDto, BirdDto])
 * class Animal { }
 * ```
 */
export function ApiDiscriminator<T>(
  propertyName: string,
  types: Type<T>[]
) {
  return applyDecorators(
    ApiExtraModels(...types),
    ApiExtension('x-discriminator', {
      propertyName,
      mapping: types.reduce((acc, type) => {
        acc[type.name] = getSchemaPath(type);
        return acc;
      }, {} as Record<string, string>),
    })
  );
}

/**
 * Discriminator mapping decorator with custom mapping.
 *
 * @param propertyName - Discriminator property name
 * @param mapping - Custom discriminator value to schema mapping
 * @param types - Array of schema types
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiDiscriminatorMapping('paymentMethod', {
 *   card: CardPaymentDto,
 *   bank: BankTransferDto
 * }, [CardPaymentDto, BankTransferDto])
 * class Payment { }
 * ```
 */
export function ApiDiscriminatorMapping<T>(
  propertyName: string,
  mapping: Record<string, Type<T>>,
  types: Type<T>[]
) {
  const schemaMapping: Record<string, string> = {};
  Object.entries(mapping).forEach(([key, type]) => {
    schemaMapping[key] = getSchemaPath(type);
  });

  return applyDecorators(
    ApiExtraModels(...types),
    ApiExtension('x-discriminator', {
      propertyName,
      mapping: schemaMapping,
    })
  );
}

// ============================================================================
// COMPOSITION DECORATORS (4 functions)
// ============================================================================

/**
 * oneOf composition decorator (exactly one of the schemas).
 *
 * @param types - Array of possible schema types
 * @param discriminator - Optional discriminator property
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiSchemaOneOf([SuccessResponseDto, ErrorResponseDto], 'status')
 * class ApiResponse { }
 * ```
 */
export function ApiSchemaOneOf<T>(
  types: Type<T>[],
  discriminator?: string
) {
  return applyDecorators(
    ApiExtraModels(...types),
    ApiExtension('x-schema-composition', {
      type: 'oneOf',
      schemas: types.map(type => getSchemaPath(type)),
      ...(discriminator && { discriminator: { propertyName: discriminator } }),
    })
  );
}

/**
 * anyOf composition decorator (any of the schemas, can match multiple).
 *
 * @param types - Array of possible schema types
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiSchemaAnyOf([EmailContactDto, PhoneContactDto, AddressContactDto])
 * class ContactInfo { }
 * ```
 */
export function ApiSchemaAnyOf<T>(types: Type<T>[]) {
  return applyDecorators(
    ApiExtraModels(...types),
    ApiExtension('x-schema-composition', {
      type: 'anyOf',
      schemas: types.map(type => getSchemaPath(type)),
    })
  );
}

/**
 * allOf composition decorator (must match all schemas - inheritance).
 *
 * @param types - Array of schema types to combine
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiSchemaAllOf([BaseEntityDto, TimestampsDto, AuditDto])
 * class FullEntity { }
 * ```
 */
export function ApiSchemaAllOf<T>(types: Type<T>[]) {
  return applyDecorators(
    ApiExtraModels(...types),
    ApiExtension('x-schema-composition', {
      type: 'allOf',
      schemas: types.map(type => getSchemaPath(type)),
    })
  );
}

/**
 * not composition decorator (must not match schema).
 *
 * @param type - Schema type that must not match
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiSchemaNot(AdminUserDto)
 * class RegularUser { }
 * ```
 */
export function ApiSchemaNot<T>(type: Type<T>) {
  return applyDecorators(
    ApiExtraModels(type),
    ApiExtension('x-schema-composition', {
      type: 'not',
      schema: getSchemaPath(type),
    })
  );
}

// ============================================================================
// SCHEMA REFERENCE DECORATORS (2 functions)
// ============================================================================

/**
 * Schema reference decorator for reusable components.
 *
 * @param type - Referenced schema type
 * @param description - Reference description
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiSchemaRef(UserDto, 'References the User schema')
 * class OrderDto {
 *   @ApiProperty() user: UserDto;
 * }
 * ```
 */
export function ApiSchemaRef<T>(type: Type<T>, description = '') {
  return applyDecorators(
    ApiExtraModels(type),
    ApiExtension('x-schema-ref', {
      $ref: getSchemaPath(type),
      description,
    })
  );
}

/**
 * Circular reference decorator for self-referencing schemas.
 *
 * @param type - Schema type with circular reference
 * @param propertyName - Property that creates circular reference
 * @returns Decorator
 *
 * @example
 * ```typescript
 * @ApiSchemaRefCircular(CategoryDto, 'children')
 * class CategoryDto {
 *   @ApiProperty({ type: () => [CategoryDto] })
 *   children: CategoryDto[];
 * }
 * ```
 */
export function ApiSchemaRefCircular<T>(
  type: Type<T>,
  propertyName: string
) {
  return applyDecorators(
    ApiExtraModels(type),
    ApiExtension('x-circular-reference', {
      schema: getSchemaPath(type),
      property: propertyName,
      description: `Circular reference on property '${propertyName}'`,
    })
  );
}
