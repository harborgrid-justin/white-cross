/**
 * Swagger/OpenAPI Response Builders
 *
 * Production-ready TypeScript utilities for response templates,
 * error schemas, pagination, file downloads, and response headers.
 * Compliant with OpenAPI 3.0/3.1 response specifications.
 *
 * @module swagger-response-builders
 * @version 1.0.0
 */

import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiResponse,
  ApiExtraModels,
  getSchemaPath,
  ApiProduces,
  ApiExtension,
} from '@nestjs/swagger';

/**
 * Type definitions for response configuration
 */

export interface ResponseOptions {
  /** HTTP status code */
  status: number;
  /** Response description */
  description: string;
  /** Response type */
  type?: Type<any>;
  /** Whether response is array */
  isArray?: boolean;
  /** Response headers */
  headers?: Record<string, HeaderDefinition>;
  /** Content types */
  contentTypes?: string[];
  /** Example response */
  example?: any;
}

export interface HeaderDefinition {
  /** Header description */
  description: string;
  /** Header schema */
  schema?: any;
  /** Example value */
  example?: any;
  /** Whether header is required */
  required?: boolean;
}

export interface PaginationMetadata {
  /** Current page number */
  page: number;
  /** Items per page */
  limit: number;
  /** Total items */
  total: number;
  /** Total pages */
  totalPages: number;
  /** Has next page */
  hasNextPage: boolean;
  /** Has previous page */
  hasPreviousPage: boolean;
}

export interface ErrorDetail {
  /** Error field */
  field?: string;
  /** Error message */
  message: string;
  /** Error code */
  code?: string;
  /** Additional context */
  context?: any;
}

// ============================================================================
// SUCCESS RESPONSE TEMPLATES (8 functions)
// ============================================================================

/**
 * Creates standard success response (200 OK).
 * Standard successful response with typed data.
 *
 * @param type - Response data type
 * @param description - Response description
 * @param isArray - Whether response is array
 * @returns Success response decorator
 *
 * @example
 * ```typescript
 * @createSuccessResponse(UserDto, 'User retrieved successfully')
 * async getUser(@Param('id') id: string) {
 *   return this.userService.findOne(id);
 * }
 * ```
 */
export function createSuccessResponse<T>(
  type: Type<T>,
  description = 'Successful operation',
  isArray = false
) {
  return applyDecorators(
    ApiExtraModels(type),
    ApiResponse({
      status: 200,
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
 * Creates created response (201 Created).
 * Response for successful resource creation.
 *
 * @param type - Created resource type
 * @param description - Response description
 * @param locationHeader - Whether to include Location header
 * @returns Created response decorator
 *
 * @example
 * ```typescript
 * @createCreatedResponse(UserDto, 'User created successfully', true)
 * async createUser(@Body() createUserDto: CreateUserDto) {
 *   return this.userService.create(createUserDto);
 * }
 * ```
 */
export function createCreatedResponse<T>(
  type: Type<T>,
  description = 'Resource created successfully',
  locationHeader = true
) {
  const headers: Record<string, HeaderDefinition> = {};

  if (locationHeader) {
    headers['Location'] = {
      description: 'URI of the created resource',
      schema: { type: 'string', format: 'uri' },
      example: '/api/v1/users/123e4567-e89b-12d3-a456-426614174000',
    };
  }

  return applyDecorators(
    ApiExtraModels(type),
    ApiResponse({
      status: 201,
      description,
      schema: { $ref: getSchemaPath(type) },
      headers,
    })
  );
}

/**
 * Creates accepted response (202 Accepted).
 * Response for asynchronous operations accepted for processing.
 *
 * @param description - Response description
 * @param statusUrl - Whether to include status check URL
 * @returns Accepted response decorator
 *
 * @example
 * ```typescript
 * @createAcceptedResponse('Job accepted for processing', true)
 * async processLargeFile(@Body() fileDto: FileDto) {
 *   return this.processingService.enqueueJob(fileDto);
 * }
 * ```
 */
export function createAcceptedResponse(
  description = 'Request accepted for processing',
  statusUrl = true
) {
  const schema: any = {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: description },
      jobId: { type: 'string', format: 'uuid', description: 'Background job identifier' },
    },
  };

  if (statusUrl) {
    schema.properties.statusUrl = {
      type: 'string',
      format: 'uri',
      description: 'URL to check job status',
      example: '/api/v1/jobs/123e4567-e89b-12d3-a456-426614174000/status',
    };
  }

  return ApiResponse({
    status: 202,
    description,
    schema,
  });
}

/**
 * Creates no content response (204 No Content).
 * Response for successful operations with no response body.
 *
 * @param description - Response description
 * @returns No content response decorator
 *
 * @example
 * ```typescript
 * @createNoContentResponse('User deleted successfully')
 * async deleteUser(@Param('id') id: string) {
 *   await this.userService.remove(id);
 * }
 * ```
 */
export function createNoContentResponse(
  description = 'Successful operation with no content'
) {
  return ApiResponse({
    status: 204,
    description,
  });
}

/**
 * Creates partial content response (206 Partial Content).
 * Response for range requests and partial data delivery.
 *
 * @param type - Response data type
 * @param description - Response description
 * @returns Partial content response decorator
 *
 * @example
 * ```typescript
 * @createPartialContentResponse(DataChunkDto, 'Partial data chunk')
 * async getDataRange(@Headers('range') range: string) {
 *   return this.dataService.getRange(range);
 * }
 * ```
 */
export function createPartialContentResponse<T>(
  type: Type<T>,
  description = 'Partial content'
) {
  return applyDecorators(
    ApiExtraModels(type),
    ApiResponse({
      status: 206,
      description,
      schema: { $ref: getSchemaPath(type) },
      headers: {
        'Content-Range': {
          description: 'Range of returned content',
          schema: { type: 'string' },
          example: 'bytes 0-1023/2048',
        },
        'Accept-Ranges': {
          description: 'Unit of ranges accepted',
          schema: { type: 'string' },
          example: 'bytes',
        },
      },
    })
  );
}

/**
 * Creates multi-status response (207 Multi-Status).
 * Response for batch operations with multiple results.
 *
 * @param type - Individual result type
 * @param description - Response description
 * @returns Multi-status response decorator
 *
 * @example
 * ```typescript
 * @createMultiStatusResponse(BatchResultDto, 'Batch operation results')
 * async batchUpdateUsers(@Body() updates: UpdateUserDto[]) {
 *   return this.userService.batchUpdate(updates);
 * }
 * ```
 */
export function createMultiStatusResponse<T>(
  type: Type<T>,
  description = 'Multi-status response with individual operation results'
) {
  return applyDecorators(
    ApiExtraModels(type),
    ApiResponse({
      status: 207,
      description,
      schema: {
        type: 'object',
        properties: {
          success: { type: 'integer', description: 'Number of successful operations' },
          failed: { type: 'integer', description: 'Number of failed operations' },
          results: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                index: { type: 'integer', description: 'Index in batch' },
                status: { type: 'integer', description: 'HTTP status code' },
                data: { $ref: getSchemaPath(type) },
                error: { type: 'string', description: 'Error message if failed' },
              },
            },
          },
        },
      },
    })
  );
}

/**
 * Creates not modified response (304 Not Modified).
 * Response for conditional requests when resource unchanged.
 *
 * @param description - Response description
 * @returns Not modified response decorator
 *
 * @example
 * ```typescript
 * @createNotModifiedResponse('Resource not modified since last request')
 * async getConditional(@Headers('if-none-match') etag: string) {
 *   return this.service.getIfModified(etag);
 * }
 * ```
 */
export function createNotModifiedResponse(
  description = 'Not Modified - Resource unchanged since last request'
) {
  return ApiResponse({
    status: 304,
    description,
    headers: {
      'ETag': {
        description: 'Entity tag for cache validation',
        schema: { type: 'string' },
        example: '"33a64df551425fcc55e4d42a148795d9f25f89d4"',
      },
      'Cache-Control': {
        description: 'Cache directives',
        schema: { type: 'string' },
        example: 'max-age=3600',
      },
    },
  });
}

/**
 * Creates success response with custom headers.
 * Success response with additional custom headers.
 *
 * @param type - Response data type
 * @param headers - Custom headers definition
 * @param description - Response description
 * @returns Success response with headers decorator
 *
 * @example
 * ```typescript
 * @createSuccessResponseWithHeaders(UserDto, {
 *   'X-Total-Count': { description: 'Total users', schema: { type: 'integer' } },
 *   'X-Request-ID': { description: 'Request ID', schema: { type: 'string' } }
 * })
 * async listUsers() {
 *   return this.userService.findAll();
 * }
 * ```
 */
export function createSuccessResponseWithHeaders<T>(
  type: Type<T>,
  headers: Record<string, HeaderDefinition>,
  description = 'Successful operation with custom headers'
) {
  return applyDecorators(
    ApiExtraModels(type),
    ApiResponse({
      status: 200,
      description,
      schema: { $ref: getSchemaPath(type) },
      headers,
    })
  );
}

// ============================================================================
// ERROR RESPONSE BUILDERS (10 functions)
// ============================================================================

/**
 * Creates bad request error response (400).
 * Validation error response with detailed field errors.
 *
 * @param description - Error description
 * @param includeValidationDetails - Whether to include field-level details
 * @returns Bad request error decorator
 *
 * @example
 * ```typescript
 * @createBadRequestError('Invalid input data', true)
 * async createUser(@Body() dto: CreateUserDto) {
 *   return this.userService.create(dto);
 * }
 * ```
 */
export function createBadRequestError(
  description = 'Bad Request - Invalid input data',
  includeValidationDetails = true
) {
  const schema: any = {
    type: 'object',
    properties: {
      statusCode: { type: 'integer', example: 400 },
      message: {
        oneOf: [
          { type: 'string' },
          { type: 'array', items: { type: 'string' } },
        ],
        example: 'Validation failed',
      },
      error: { type: 'string', example: 'Bad Request' },
    },
  };

  if (includeValidationDetails) {
    schema.properties.validationErrors = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field: { type: 'string', description: 'Field name' },
          message: { type: 'string', description: 'Validation error message' },
          constraint: { type: 'string', description: 'Validation constraint violated' },
          value: { description: 'Invalid value provided' },
        },
      },
    };
  }

  return ApiResponse({
    status: 400,
    description,
    schema,
  });
}

/**
 * Creates unauthorized error response (401).
 * Authentication required or failed response.
 *
 * @param description - Error description
 * @param authenticateHeader - WWW-Authenticate header value
 * @returns Unauthorized error decorator
 *
 * @example
 * ```typescript
 * @createUnauthorizedError('Authentication required', 'Bearer realm="API"')
 * async protectedEndpoint() {
 *   return this.service.getData();
 * }
 * ```
 */
export function createUnauthorizedError(
  description = 'Unauthorized - Authentication required or failed',
  authenticateHeader?: string
) {
  const headers: Record<string, HeaderDefinition> = {};

  if (authenticateHeader) {
    headers['WWW-Authenticate'] = {
      description: 'Authentication challenge',
      schema: { type: 'string' },
      example: authenticateHeader,
    };
  }

  return ApiResponse({
    status: 401,
    description,
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
    headers,
  });
}

/**
 * Creates forbidden error response (403).
 * Insufficient permissions response.
 *
 * @param description - Error description
 * @param reason - Specific reason for forbidden access
 * @returns Forbidden error decorator
 *
 * @example
 * ```typescript
 * @createForbiddenError('Insufficient permissions', 'Requires admin role')
 * async adminOnlyEndpoint() {
 *   return this.adminService.getData();
 * }
 * ```
 */
export function createForbiddenError(
  description = 'Forbidden - Insufficient permissions',
  reason?: string
) {
  const schema: any = {
    type: 'object',
    properties: {
      statusCode: { type: 'integer', example: 403 },
      message: { type: 'string', example: 'Forbidden resource' },
      error: { type: 'string', example: 'Forbidden' },
    },
  };

  if (reason) {
    schema.properties.reason = { type: 'string', example: reason };
  }

  return ApiResponse({
    status: 403,
    description,
    schema,
  });
}

/**
 * Creates not found error response (404).
 * Resource not found response.
 *
 * @param description - Error description
 * @param resourceType - Type of resource not found
 * @returns Not found error decorator
 *
 * @example
 * ```typescript
 * @createNotFoundError('User not found', 'User')
 * async getUser(@Param('id') id: string) {
 *   return this.userService.findOne(id);
 * }
 * ```
 */
export function createNotFoundError(
  description = 'Not Found - Resource does not exist',
  resourceType?: string
) {
  const schema: any = {
    type: 'object',
    properties: {
      statusCode: { type: 'integer', example: 404 },
      message: { type: 'string', example: `${resourceType || 'Resource'} not found` },
      error: { type: 'string', example: 'Not Found' },
    },
  };

  if (resourceType) {
    schema.properties.resourceType = { type: 'string', example: resourceType };
  }

  return ApiResponse({
    status: 404,
    description,
    schema,
  });
}

/**
 * Creates conflict error response (409).
 * Resource conflict response (e.g., duplicate).
 *
 * @param description - Error description
 * @param conflictField - Field causing the conflict
 * @returns Conflict error decorator
 *
 * @example
 * ```typescript
 * @createConflictError('User with this email already exists', 'email')
 * async createUser(@Body() dto: CreateUserDto) {
 *   return this.userService.create(dto);
 * }
 * ```
 */
export function createConflictError(
  description = 'Conflict - Resource already exists or conflicts with current state',
  conflictField?: string
) {
  const schema: any = {
    type: 'object',
    properties: {
      statusCode: { type: 'integer', example: 409 },
      message: { type: 'string', example: 'Resource conflict' },
      error: { type: 'string', example: 'Conflict' },
    },
  };

  if (conflictField) {
    schema.properties.conflictingField = { type: 'string', example: conflictField };
  }

  return ApiResponse({
    status: 409,
    description,
    schema,
  });
}

/**
 * Creates gone error response (410).
 * Resource permanently deleted or no longer available.
 *
 * @param description - Error description
 * @returns Gone error decorator
 *
 * @example
 * ```typescript
 * @createGoneError('User account permanently deleted')
 * async getDeletedUser(@Param('id') id: string) {
 *   return this.userService.findOne(id);
 * }
 * ```
 */
export function createGoneError(
  description = 'Gone - Resource permanently removed'
) {
  return ApiResponse({
    status: 410,
    description,
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer', example: 410 },
        message: { type: 'string', example: 'Resource no longer available' },
        error: { type: 'string', example: 'Gone' },
        deletedAt: { type: 'string', format: 'date-time', description: 'Deletion timestamp' },
      },
    },
  });
}

/**
 * Creates unprocessable entity error response (422).
 * Semantic validation error response.
 *
 * @param description - Error description
 * @returns Unprocessable entity error decorator
 *
 * @example
 * ```typescript
 * @createUnprocessableEntityError('Business rule validation failed')
 * async createOrder(@Body() dto: CreateOrderDto) {
 *   return this.orderService.create(dto);
 * }
 * ```
 */
export function createUnprocessableEntityError(
  description = 'Unprocessable Entity - Semantic validation failed'
) {
  return ApiResponse({
    status: 422,
    description,
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer', example: 422 },
        message: { type: 'string', example: 'Unprocessable entity' },
        error: { type: 'string', example: 'Unprocessable Entity' },
        validationErrors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string' },
              message: { type: 'string' },
              constraint: { type: 'string' },
            },
          },
        },
      },
    },
  });
}

/**
 * Creates too many requests error response (429).
 * Rate limit exceeded response.
 *
 * @param description - Error description
 * @param includeRetryAfter - Whether to include Retry-After header
 * @returns Too many requests error decorator
 *
 * @example
 * ```typescript
 * @createTooManyRequestsError('Rate limit exceeded', true)
 * async rateLimitedEndpoint() {
 *   return this.service.getData();
 * }
 * ```
 */
export function createTooManyRequestsError(
  description = 'Too Many Requests - Rate limit exceeded',
  includeRetryAfter = true
) {
  const headers: Record<string, HeaderDefinition> = {
    'X-RateLimit-Limit': {
      description: 'Request limit per time window',
      schema: { type: 'integer' },
      example: 100,
    },
    'X-RateLimit-Remaining': {
      description: 'Remaining requests in current window',
      schema: { type: 'integer' },
      example: 0,
    },
    'X-RateLimit-Reset': {
      description: 'Time when rate limit resets (Unix timestamp)',
      schema: { type: 'integer' },
      example: 1640000000,
    },
  };

  if (includeRetryAfter) {
    headers['Retry-After'] = {
      description: 'Seconds to wait before retrying',
      schema: { type: 'integer' },
      example: 60,
    };
  }

  return ApiResponse({
    status: 429,
    description,
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer', example: 429 },
        message: { type: 'string', example: 'Too many requests' },
        error: { type: 'string', example: 'Too Many Requests' },
      },
    },
    headers,
  });
}

/**
 * Creates internal server error response (500).
 * Server error response with tracking information.
 *
 * @param description - Error description
 * @param includeTrackingId - Whether to include tracking ID
 * @returns Internal server error decorator
 *
 * @example
 * ```typescript
 * @createInternalServerError('Unexpected server error', true)
 * async riskyOperation() {
 *   return this.service.performOperation();
 * }
 * ```
 */
export function createInternalServerError(
  description = 'Internal Server Error - Unexpected server error occurred',
  includeTrackingId = true
) {
  const schema: any = {
    type: 'object',
    properties: {
      statusCode: { type: 'integer', example: 500 },
      message: { type: 'string', example: 'Internal server error' },
      error: { type: 'string', example: 'Internal Server Error' },
      timestamp: { type: 'string', format: 'date-time' },
      path: { type: 'string', description: 'Request path' },
    },
  };

  if (includeTrackingId) {
    schema.properties.trackingId = {
      type: 'string',
      format: 'uuid',
      description: 'Error tracking identifier',
    };
  }

  return ApiResponse({
    status: 500,
    description,
    schema,
  });
}

/**
 * Creates service unavailable error response (503).
 * Temporary service unavailability response.
 *
 * @param description - Error description
 * @param retryAfterSeconds - Suggested retry delay in seconds
 * @returns Service unavailable error decorator
 *
 * @example
 * ```typescript
 * @createServiceUnavailableError('Service temporarily unavailable', 300)
 * async maintenanceEndpoint() {
 *   return this.service.getData();
 * }
 * ```
 */
export function createServiceUnavailableError(
  description = 'Service Unavailable - Temporary unavailability',
  retryAfterSeconds?: number
) {
  const headers: Record<string, HeaderDefinition> = {};

  if (retryAfterSeconds) {
    headers['Retry-After'] = {
      description: 'Seconds to wait before retrying',
      schema: { type: 'integer' },
      example: retryAfterSeconds,
    };
  }

  return ApiResponse({
    status: 503,
    description,
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer', example: 503 },
        message: { type: 'string', example: 'Service Unavailable' },
        error: { type: 'string', example: 'Service Unavailable' },
        retryAfter: { type: 'integer', description: 'Retry after seconds' },
      },
    },
    headers,
  });
}

// ============================================================================
// PAGINATION RESPONSE PATTERNS (8 functions)
// ============================================================================

/**
 * Creates paginated response with cursor pagination.
 * Cursor-based pagination for large datasets.
 *
 * @param type - Item type
 * @param description - Response description
 * @returns Cursor paginated response decorator
 *
 * @example
 * ```typescript
 * @createCursorPaginatedResponse(UserDto, 'Paginated users with cursor')
 * async listUsers(@Query('cursor') cursor: string, @Query('limit') limit: number) {
 *   return this.userService.findPaginatedCursor(cursor, limit);
 * }
 * ```
 */
export function createCursorPaginatedResponse<T>(
  type: Type<T>,
  description = 'Cursor-paginated response'
) {
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
          },
          pagination: {
            type: 'object',
            properties: {
              nextCursor: { type: 'string', nullable: true, description: 'Cursor for next page' },
              prevCursor: { type: 'string', nullable: true, description: 'Cursor for previous page' },
              hasMore: { type: 'boolean', description: 'Whether more items exist' },
            },
          },
        },
      },
    })
  );
}

/**
 * Creates paginated response with offset pagination.
 * Offset-based pagination (page/limit style).
 *
 * @param type - Item type
 * @param description - Response description
 * @returns Offset paginated response decorator
 *
 * @example
 * ```typescript
 * @createOffsetPaginatedResponse(ProductDto, 'Paginated products')
 * async listProducts(@Query('page') page: number, @Query('limit') limit: number) {
 *   return this.productService.findPaginated(page, limit);
 * }
 * ```
 */
export function createOffsetPaginatedResponse<T>(
  type: Type<T>,
  description = 'Offset-paginated response'
) {
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
          },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer', example: 1, description: 'Current page number' },
              limit: { type: 'integer', example: 20, description: 'Items per page' },
              total: { type: 'integer', example: 100, description: 'Total items' },
              totalPages: { type: 'integer', example: 5, description: 'Total pages' },
              hasNextPage: { type: 'boolean', example: true },
              hasPreviousPage: { type: 'boolean', example: false },
            },
          },
        },
      },
    })
  );
}

/**
 * Creates paginated response with link headers (RFC 5988).
 * Pagination using Link headers for HATEOAS compliance.
 *
 * @param type - Item type
 * @param description - Response description
 * @returns Link header paginated response decorator
 *
 * @example
 * ```typescript
 * @createLinkHeaderPaginatedResponse(ItemDto, 'Paginated with Link headers')
 * async listItems(@Query('page') page: number) {
 *   return this.itemService.findPaginated(page);
 * }
 * ```
 */
export function createLinkHeaderPaginatedResponse<T>(
  type: Type<T>,
  description = 'Paginated response with Link headers'
) {
  return applyDecorators(
    ApiExtraModels(type),
    ApiResponse({
      status: 200,
      description,
      schema: {
        type: 'array',
        items: { $ref: getSchemaPath(type) },
      },
      headers: {
        'Link': {
          description: 'Pagination links (RFC 5988)',
          schema: { type: 'string' },
          example: '</api/items?page=2>; rel="next", </api/items?page=1>; rel="prev"',
        },
        'X-Total-Count': {
          description: 'Total number of items',
          schema: { type: 'integer' },
          example: 100,
        },
      },
    })
  );
}

/**
 * Creates paginated response with keyset pagination.
 * Keyset pagination for ordered datasets (more efficient than offset).
 *
 * @param type - Item type
 * @param description - Response description
 * @returns Keyset paginated response decorator
 *
 * @example
 * ```typescript
 * @createKeysetPaginatedResponse(MessageDto, 'Keyset paginated messages')
 * async listMessages(@Query('after') after: string, @Query('limit') limit: number) {
 *   return this.messageService.findAfter(after, limit);
 * }
 * ```
 */
export function createKeysetPaginatedResponse<T>(
  type: Type<T>,
  description = 'Keyset-paginated response'
) {
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
          },
          pagination: {
            type: 'object',
            properties: {
              after: { type: 'string', nullable: true, description: 'Key of last item' },
              before: { type: 'string', nullable: true, description: 'Key of first item' },
              hasMore: { type: 'boolean' },
            },
          },
        },
      },
    })
  );
}

/**
 * Creates infinite scroll response.
 * Response optimized for infinite scroll UI pattern.
 *
 * @param type - Item type
 * @param description - Response description
 * @returns Infinite scroll response decorator
 *
 * @example
 * ```typescript
 * @createInfiniteScrollResponse(FeedItemDto, 'Infinite scroll feed')
 * async getFeed(@Query('since') since: string, @Query('count') count: number) {
 *   return this.feedService.getItemsSince(since, count);
 * }
 * ```
 */
export function createInfiniteScrollResponse<T>(
  type: Type<T>,
  description = 'Infinite scroll response'
) {
  return applyDecorators(
    ApiExtraModels(type),
    ApiResponse({
      status: 200,
      description,
      schema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: { $ref: getSchemaPath(type) },
          },
          nextToken: { type: 'string', nullable: true, description: 'Token for loading more' },
          hasMore: { type: 'boolean', description: 'Whether more items available' },
        },
      },
    })
  );
}

/**
 * Creates batch response with pagination.
 * Paginated batch processing results.
 *
 * @param type - Result item type
 * @param description - Response description
 * @returns Batch paginated response decorator
 *
 * @example
 * ```typescript
 * @createBatchPaginatedResponse(BatchResultDto, 'Paginated batch results')
 * async getBatchResults(@Query('batchId') batchId: string, @Query('page') page: number) {
 *   return this.batchService.getResults(batchId, page);
 * }
 * ```
 */
export function createBatchPaginatedResponse<T>(
  type: Type<T>,
  description = 'Paginated batch results'
) {
  return applyDecorators(
    ApiExtraModels(type),
    ApiResponse({
      status: 200,
      description,
      schema: {
        type: 'object',
        properties: {
          batchId: { type: 'string', format: 'uuid' },
          totalOperations: { type: 'integer' },
          successCount: { type: 'integer' },
          failureCount: { type: 'integer' },
          results: {
            type: 'array',
            items: { $ref: getSchemaPath(type) },
          },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer' },
              limit: { type: 'integer' },
              total: { type: 'integer' },
            },
          },
        },
      },
    })
  );
}

/**
 * Creates grouped paginated response.
 * Pagination with results grouped by category.
 *
 * @param type - Item type
 * @param description - Response description
 * @returns Grouped paginated response decorator
 *
 * @example
 * ```typescript
 * @createGroupedPaginatedResponse(ItemDto, 'Paginated grouped items')
 * async listGroupedItems(@Query('groupBy') groupBy: string, @Query('page') page: number) {
 *   return this.itemService.findGroupedPaginated(groupBy, page);
 * }
 * ```
 */
export function createGroupedPaginatedResponse<T>(
  type: Type<T>,
  description = 'Grouped paginated response'
) {
  return applyDecorators(
    ApiExtraModels(type),
    ApiResponse({
      status: 200,
      description,
      schema: {
        type: 'object',
        properties: {
          groups: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                key: { type: 'string', description: 'Group key' },
                count: { type: 'integer', description: 'Items in group' },
                items: {
                  type: 'array',
                  items: { $ref: getSchemaPath(type) },
                },
              },
            },
          },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer' },
              limit: { type: 'integer' },
              totalGroups: { type: 'integer' },
              totalItems: { type: 'integer' },
            },
          },
        },
      },
    })
  );
}

/**
 * Creates aggregated paginated response.
 * Pagination with aggregate statistics.
 *
 * @param type - Item type
 * @param description - Response description
 * @returns Aggregated paginated response decorator
 *
 * @example
 * ```typescript
 * @createAggregatedPaginatedResponse(TransactionDto, 'Paginated with aggregates')
 * async listTransactions(@Query('page') page: number) {
 *   return this.transactionService.findWithAggregates(page);
 * }
 * ```
 */
export function createAggregatedPaginatedResponse<T>(
  type: Type<T>,
  description = 'Paginated response with aggregates'
) {
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
          },
          aggregates: {
            type: 'object',
            properties: {
              sum: { type: 'number', description: 'Sum of values' },
              average: { type: 'number', description: 'Average value' },
              min: { type: 'number', description: 'Minimum value' },
              max: { type: 'number', description: 'Maximum value' },
              count: { type: 'integer', description: 'Total count' },
            },
          },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer' },
              limit: { type: 'integer' },
              total: { type: 'integer' },
            },
          },
        },
      },
    })
  );
}

// ============================================================================
// FILE DOWNLOAD RESPONSES (6 functions)
// ============================================================================

/**
 * Creates file download response.
 * Binary file download with content disposition.
 *
 * @param mimeType - File MIME type
 * @param filename - Default filename
 * @param description - Response description
 * @returns File download response decorator
 *
 * @example
 * ```typescript
 * @createFileDownloadResponse('application/pdf', 'report.pdf', 'PDF report download')
 * async downloadReport(@Param('id') id: string) {
 *   return this.reportService.generatePdf(id);
 * }
 * ```
 */
export function createFileDownloadResponse(
  mimeType: string,
  filename?: string,
  description = 'File download'
) {
  const headers: Record<string, HeaderDefinition> = {
    'Content-Type': {
      description: 'File MIME type',
      schema: { type: 'string' },
      example: mimeType,
    },
  };

  if (filename) {
    headers['Content-Disposition'] = {
      description: 'File disposition',
      schema: { type: 'string' },
      example: `attachment; filename="${filename}"`,
    };
  }

  return applyDecorators(
    ApiProduces(mimeType),
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
      headers,
    })
  );
}

/**
 * Creates streaming file response.
 * Chunked file streaming response.
 *
 * @param mimeType - File MIME type
 * @param description - Response description
 * @returns Streaming file response decorator
 *
 * @example
 * ```typescript
 * @createStreamingFileResponse('video/mp4', 'Video stream')
 * async streamVideo(@Param('id') id: string, @Res() res: Response) {
 *   return this.videoService.streamFile(id, res);
 * }
 * ```
 */
export function createStreamingFileResponse(
  mimeType: string,
  description = 'Streaming file response'
) {
  return applyDecorators(
    ApiProduces(mimeType),
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
          description: 'Stream content type',
          schema: { type: 'string' },
          example: mimeType,
        },
        'Transfer-Encoding': {
          description: 'Transfer encoding',
          schema: { type: 'string' },
          example: 'chunked',
        },
        'Cache-Control': {
          description: 'Cache directives',
          schema: { type: 'string' },
          example: 'no-cache',
        },
      },
    })
  );
}

/**
 * Creates ZIP archive download response.
 * Multiple files packaged as ZIP.
 *
 * @param description - Response description
 * @param filename - ZIP filename
 * @returns ZIP download response decorator
 *
 * @example
 * ```typescript
 * @createZipDownloadResponse('Download multiple files', 'documents.zip')
 * async downloadBatch(@Body() fileIds: string[]) {
 *   return this.fileService.createZip(fileIds);
 * }
 * ```
 */
export function createZipDownloadResponse(
  description = 'ZIP archive download',
  filename = 'archive.zip'
) {
  return createFileDownloadResponse('application/zip', filename, description);
}

/**
 * Creates CSV export response.
 * CSV file export for data download.
 *
 * @param description - Response description
 * @param filename - CSV filename
 * @returns CSV export response decorator
 *
 * @example
 * ```typescript
 * @createCsvExportResponse('Export users to CSV', 'users.csv')
 * async exportUsers(@Query() filters: UserFilterDto) {
 *   return this.userService.exportToCsv(filters);
 * }
 * ```
 */
export function createCsvExportResponse(
  description = 'CSV export',
  filename = 'export.csv'
) {
  return createFileDownloadResponse('text/csv', filename, description);
}

/**
 * Creates Excel export response.
 * Excel spreadsheet export.
 *
 * @param description - Response description
 * @param filename - Excel filename
 * @returns Excel export response decorator
 *
 * @example
 * ```typescript
 * @createExcelExportResponse('Export to Excel', 'report.xlsx')
 * async exportToExcel(@Query() params: ExportParams) {
 *   return this.exportService.generateExcel(params);
 * }
 * ```
 */
export function createExcelExportResponse(
  description = 'Excel export',
  filename = 'export.xlsx'
) {
  return createFileDownloadResponse(
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    filename,
    description
  );
}

/**
 * Creates image response with transformations.
 * Image download with transformation metadata.
 *
 * @param format - Image format (jpeg, png, webp)
 * @param description - Response description
 * @returns Image response decorator
 *
 * @example
 * ```typescript
 * @createImageResponse('jpeg', 'Transformed image')
 * async getImage(@Param('id') id: string, @Query() transform: ImageTransformDto) {
 *   return this.imageService.transform(id, transform);
 * }
 * ```
 */
export function createImageResponse(
  format: 'jpeg' | 'png' | 'webp' | 'gif' = 'jpeg',
  description = 'Image response'
) {
  const mimeType = `image/${format}`;

  return applyDecorators(
    ApiProduces(mimeType),
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
          description: 'Image MIME type',
          schema: { type: 'string' },
          example: mimeType,
        },
        'Cache-Control': {
          description: 'Image cache directives',
          schema: { type: 'string' },
          example: 'public, max-age=31536000',
        },
        'ETag': {
          description: 'Image version tag',
          schema: { type: 'string' },
        },
      },
    })
  );
}

// ============================================================================
// RESPONSE HEADER BUILDERS (10 functions)
// ============================================================================

/**
 * Creates CORS headers for response.
 * Cross-Origin Resource Sharing headers.
 *
 * @param allowedOrigins - Allowed origin patterns
 * @param allowedMethods - Allowed HTTP methods
 * @param allowedHeaders - Allowed request headers
 * @returns CORS headers configuration
 *
 * @example
 * ```typescript
 * @createCorsHeaders(['https://example.com'], ['GET', 'POST'], ['Content-Type', 'Authorization'])
 * async corsEndpoint() {
 *   return this.service.getData();
 * }
 * ```
 */
export function createCorsHeaders(
  allowedOrigins: string[],
  allowedMethods: string[] = ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: string[] = ['Content-Type', 'Authorization']
) {
  const headers: Record<string, HeaderDefinition> = {
    'Access-Control-Allow-Origin': {
      description: 'Allowed origins',
      schema: { type: 'string' },
      example: allowedOrigins.join(', '),
    },
    'Access-Control-Allow-Methods': {
      description: 'Allowed HTTP methods',
      schema: { type: 'string' },
      example: allowedMethods.join(', '),
    },
    'Access-Control-Allow-Headers': {
      description: 'Allowed request headers',
      schema: { type: 'string' },
      example: allowedHeaders.join(', '),
    },
  };

  return ApiExtension('x-cors-headers', headers);
}

/**
 * Creates cache control headers.
 * HTTP caching directives.
 *
 * @param maxAge - Cache max age in seconds
 * @param isPublic - Whether cache is public or private
 * @param revalidate - Whether to revalidate
 * @returns Cache control headers configuration
 *
 * @example
 * ```typescript
 * @createCacheControlHeaders(3600, true, true)
 * async cachedEndpoint() {
 *   return this.service.getData();
 * }
 * ```
 */
export function createCacheControlHeaders(
  maxAge: number,
  isPublic = true,
  revalidate = false
) {
  const directives: string[] = [
    isPublic ? 'public' : 'private',
    `max-age=${maxAge}`,
  ];

  if (revalidate) {
    directives.push('must-revalidate');
  }

  return ApiExtension('x-cache-control', {
    'Cache-Control': {
      description: 'Cache control directives',
      schema: { type: 'string' },
      example: directives.join(', '),
    },
    'ETag': {
      description: 'Entity tag for cache validation',
      schema: { type: 'string' },
    },
  });
}

/**
 * Creates security headers.
 * Security-related HTTP headers.
 *
 * @param includeHsts - Include HTTP Strict Transport Security
 * @param includeXssProtection - Include XSS protection headers
 * @returns Security headers configuration
 *
 * @example
 * ```typescript
 * @createSecurityHeaders(true, true)
 * async secureEndpoint() {
 *   return this.service.getData();
 * }
 * ```
 */
export function createSecurityHeaders(
  includeHsts = true,
  includeXssProtection = true
) {
  const headers: Record<string, HeaderDefinition> = {
    'X-Content-Type-Options': {
      description: 'Prevent MIME type sniffing',
      schema: { type: 'string' },
      example: 'nosniff',
    },
    'X-Frame-Options': {
      description: 'Clickjacking protection',
      schema: { type: 'string' },
      example: 'DENY',
    },
  };

  if (includeHsts) {
    headers['Strict-Transport-Security'] = {
      description: 'HSTS policy',
      schema: { type: 'string' },
      example: 'max-age=31536000; includeSubDomains',
    };
  }

  if (includeXssProtection) {
    headers['X-XSS-Protection'] = {
      description: 'XSS filter',
      schema: { type: 'string' },
      example: '1; mode=block',
    };
  }

  return ApiExtension('x-security-headers', headers);
}

/**
 * Creates content disposition header.
 * Content disposition for downloads.
 *
 * @param filename - Attachment filename
 * @param inline - Whether to display inline
 * @returns Content disposition header configuration
 *
 * @example
 * ```typescript
 * @createContentDispositionHeader('document.pdf', false)
 * async downloadDocument() {
 *   return this.documentService.getFile();
 * }
 * ```
 */
export function createContentDispositionHeader(
  filename: string,
  inline = false
) {
  const disposition = inline ? 'inline' : 'attachment';

  return ApiExtension('x-content-disposition', {
    'Content-Disposition': {
      description: 'Content disposition',
      schema: { type: 'string' },
      example: `${disposition}; filename="${filename}"`,
    },
  });
}

/**
 * Creates ETag header for versioning.
 * Entity tag for cache validation.
 *
 * @param strong - Whether ETag is strong or weak
 * @returns ETag header configuration
 *
 * @example
 * ```typescript
 * @createETagHeader(true)
 * async versionedResource() {
 *   return this.service.getData();
 * }
 * ```
 */
export function createETagHeader(strong = true) {
  return ApiExtension('x-etag', {
    'ETag': {
      description: strong ? 'Strong entity tag' : 'Weak entity tag',
      schema: { type: 'string' },
      example: strong ? '"33a64df551425fcc"' : 'W/"33a64df551425fcc"',
    },
  });
}

/**
 * Creates Last-Modified header.
 * Resource modification timestamp.
 *
 * @returns Last-Modified header configuration
 *
 * @example
 * ```typescript
 * @createLastModifiedHeader()
 * async getResource() {
 *   return this.service.getData();
 * }
 * ```
 */
export function createLastModifiedHeader() {
  return ApiExtension('x-last-modified', {
    'Last-Modified': {
      description: 'Resource last modification timestamp',
      schema: { type: 'string', format: 'date-time' },
      example: 'Wed, 21 Oct 2015 07:28:00 GMT',
    },
  });
}

/**
 * Creates custom tracking headers.
 * Request/response tracking headers.
 *
 * @param includeRequestId - Include request ID
 * @param includeCorrelationId - Include correlation ID
 * @returns Tracking headers configuration
 *
 * @example
 * ```typescript
 * @createTrackingHeaders(true, true)
 * async trackedEndpoint() {
 *   return this.service.getData();
 * }
 * ```
 */
export function createTrackingHeaders(
  includeRequestId = true,
  includeCorrelationId = true
) {
  const headers: Record<string, HeaderDefinition> = {};

  if (includeRequestId) {
    headers['X-Request-ID'] = {
      description: 'Unique request identifier',
      schema: { type: 'string', format: 'uuid' },
    };
  }

  if (includeCorrelationId) {
    headers['X-Correlation-ID'] = {
      description: 'Correlation ID for distributed tracing',
      schema: { type: 'string', format: 'uuid' },
    };
  }

  return ApiExtension('x-tracking-headers', headers);
}

/**
 * Creates rate limit headers.
 * Rate limiting information headers.
 *
 * @param limit - Rate limit
 * @param window - Time window
 * @returns Rate limit headers configuration
 *
 * @example
 * ```typescript
 * @createRateLimitHeaders(100, '1m')
 * async rateLimitedEndpoint() {
 *   return this.service.getData();
 * }
 * ```
 */
export function createRateLimitHeaders(limit: number, window: string) {
  return ApiExtension('x-rate-limit-headers', {
    'X-RateLimit-Limit': {
      description: 'Request limit per window',
      schema: { type: 'integer' },
      example: limit,
    },
    'X-RateLimit-Remaining': {
      description: 'Remaining requests',
      schema: { type: 'integer' },
    },
    'X-RateLimit-Reset': {
      description: 'Reset timestamp',
      schema: { type: 'integer' },
    },
  });
}

/**
 * Creates pagination headers.
 * Pagination metadata in headers.
 *
 * @returns Pagination headers configuration
 *
 * @example
 * ```typescript
 * @createPaginationHeaders()
 * async paginatedEndpoint() {
 *   return this.service.findPaginated();
 * }
 * ```
 */
export function createPaginationHeaders() {
  return ApiExtension('x-pagination-headers', {
    'X-Total-Count': {
      description: 'Total number of items',
      schema: { type: 'integer' },
    },
    'X-Page': {
      description: 'Current page number',
      schema: { type: 'integer' },
    },
    'X-Per-Page': {
      description: 'Items per page',
      schema: { type: 'integer' },
    },
    'X-Total-Pages': {
      description: 'Total number of pages',
      schema: { type: 'integer' },
    },
  });
}

/**
 * Creates deprecation warning headers.
 * API deprecation notification headers.
 *
 * @param sunsetDate - Date when endpoint will be removed
 * @param alternativeUrl - Alternative endpoint URL
 * @returns Deprecation headers configuration
 *
 * @example
 * ```typescript
 * @createDeprecationHeaders('2025-12-31', '/api/v2/users')
 * async deprecatedEndpoint() {
 *   return this.service.getData();
 * }
 * ```
 */
export function createDeprecationHeaders(
  sunsetDate?: string,
  alternativeUrl?: string
) {
  const headers: Record<string, HeaderDefinition> = {
    'Deprecation': {
      description: 'Deprecation notice',
      schema: { type: 'string' },
      example: 'true',
    },
  };

  if (sunsetDate) {
    headers['Sunset'] = {
      description: 'Sunset date (RFC 8594)',
      schema: { type: 'string', format: 'date' },
      example: sunsetDate,
    };
  }

  if (alternativeUrl) {
    headers['Link'] = {
      description: 'Alternative endpoint',
      schema: { type: 'string' },
      example: `<${alternativeUrl}>; rel="alternate"`,
    };
  }

  return ApiExtension('x-deprecation-headers', headers);
}
