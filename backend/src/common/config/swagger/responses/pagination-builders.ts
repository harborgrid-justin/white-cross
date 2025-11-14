import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { Type } from '@nestjs/common';
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
  description = 'Cursor-paginated response',
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
              prevCursor: {
                type: 'string',
                nullable: true,
                description: 'Cursor for previous page',
              },
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
  description = 'Offset-paginated response',
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
  description = 'Paginated response with Link headers',
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
  description = 'Keyset-paginated response',
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
  description = 'Infinite scroll response',
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
  description = 'Paginated batch results',
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
  description = 'Grouped paginated response',
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
  description = 'Paginated response with aggregates',
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


