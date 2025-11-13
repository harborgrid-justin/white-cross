/**
 * Success Response Builders
 *
 * Functions for creating OpenAPI response decorators for successful HTTP operations
 * (200, 201, 202, 204, 206, 207, 304 status codes).
 *
 * @module swagger/responses/success-builders
 * @version 1.0.0
 */

import { Type } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { HeaderDefinition } from './types';

/**
 * Creates standard success response (200 OK).
 * Standard successful response with typed data.
 *
 * @param type - Response data type
 * @param description - Response description
 * @param isArray - Whether response is array
 * @returns Success response decorator
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
 */
export function createAcceptedResponse(
  description = 'Request accepted for processing',
  statusUrl = true
) {
  const schema: Record<string, unknown> = {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: description },
      jobId: { type: 'string', format: 'uuid', description: 'Background job identifier' },
    },
  };

  if (statusUrl) {
    (schema.properties as Record<string, unknown>).statusUrl = {
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