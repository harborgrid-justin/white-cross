/**
 * Swagger/OpenAPI Response Builders Service
 *
 * Production-ready TypeScript utilities for response templates,
 * error schemas, pagination, file downloads, and response headers.
 * Compliant with OpenAPI 3.0/3.1 response specifications.
 *
 * @module swagger-response-builders
 * @version 1.0.0
 */

import { Injectable } from '@nestjs/common';
import { Type } from '@nestjs/common';

// Import all response builders
import * as successBuilders from './swagger/responses/success-builders';
import * as errorBuilders from './swagger/responses/error-builders';
import * as paginationBuilders from './swagger/responses/pagination-builders';
import * as fileBuilders from './swagger/responses/file-builders';
import * as headerUtilities from './swagger/responses/header-utilities';

import { BaseService } from '../common/base';
// Re-export all response builders for backward compatibility
export * from './swagger/responses';

/**
 * Service class for managing Swagger response builders.
 * Provides centralized access to all response building utilities.
 */
@Injectable()
export class SwaggerResponseBuildersService extends BaseService {
  /**
   * Get success response builders
   */
  get success() {
    return {
      createSuccessResponse: successBuilders.createSuccessResponse,
      createCreatedResponse: successBuilders.createCreatedResponse,
      createAcceptedResponse: successBuilders.createAcceptedResponse,
      createNoContentResponse: successBuilders.createNoContentResponse,
      createPartialContentResponse: successBuilders.createPartialContentResponse,
      createMultiStatusResponse: successBuilders.createMultiStatusResponse,
      createNotModifiedResponse: successBuilders.createNotModifiedResponse,
      createSuccessResponseWithHeaders: successBuilders.createSuccessResponseWithHeaders,
    };
  }

  /**
   * Get error response builders
   */
  get error() {
    return {
      createBadRequestError: errorBuilders.createBadRequestError,
      createUnauthorizedError: errorBuilders.createUnauthorizedError,
      createForbiddenError: errorBuilders.createForbiddenError,
      createNotFoundError: errorBuilders.createNotFoundError,
      createConflictError: errorBuilders.createConflictError,
      createGoneError: errorBuilders.createGoneError,
      createUnprocessableEntityError: errorBuilders.createUnprocessableEntityError,
      createTooManyRequestsError: errorBuilders.createTooManyRequestsError,
      createInternalServerError: errorBuilders.createInternalServerError,
      createServiceUnavailableError: errorBuilders.createServiceUnavailableError,
    };
  }

  /**
   * Get pagination response builders
   */
  get pagination() {
    return {
      createCursorPaginatedResponse: paginationBuilders.createCursorPaginatedResponse,
      createOffsetPaginatedResponse: paginationBuilders.createOffsetPaginatedResponse,
      createLinkHeaderPaginatedResponse: paginationBuilders.createLinkHeaderPaginatedResponse,
      createKeysetPaginatedResponse: paginationBuilders.createKeysetPaginatedResponse,
      createInfiniteScrollResponse: paginationBuilders.createInfiniteScrollResponse,
      createBatchPaginatedResponse: paginationBuilders.createBatchPaginatedResponse,
      createGroupedPaginatedResponse: paginationBuilders.createGroupedPaginatedResponse,
      createAggregatedPaginatedResponse: paginationBuilders.createAggregatedPaginatedResponse,
    };
  }

  /**
   * Get file response builders
   */
  get file() {
    return {
      createFileDownloadResponse: fileBuilders.createFileDownloadResponse,
      createStreamingFileResponse: fileBuilders.createStreamingFileResponse,
      createZipDownloadResponse: fileBuilders.createZipDownloadResponse,
      createCsvExportResponse: fileBuilders.createCsvExportResponse,
      createExcelExportResponse: fileBuilders.createExcelExportResponse,
      createImageResponse: fileBuilders.createImageResponse,
    };
  }

  /**
   * Get header utilities
   */
  get headers() {
    return {
      createCorsHeaders: headerUtilities.createCorsHeaders,
      createCacheControlHeaders: headerUtilities.createCacheControlHeaders,
      createSecurityHeaders: headerUtilities.createSecurityHeaders,
      createContentDispositionHeader: headerUtilities.createContentDispositionHeader,
      createETagHeader: headerUtilities.createETagHeader,
      createLastModifiedHeader: headerUtilities.createLastModifiedHeader,
      createTrackingHeaders: headerUtilities.createTrackingHeaders,
      createRateLimitHeaders: headerUtilities.createRateLimitHeaders,
      createPaginationHeaders: headerUtilities.createPaginationHeaders,
      createDeprecationHeaders: headerUtilities.createDeprecationHeaders,
    };
  }

  /**
   * Create a custom response builder
   * @param type - Response type
   * @param status - HTTP status code
   * @param description - Response description
   * @param options - Additional options
   * @returns Custom response decorator
   */
  createCustomResponse<T>(
    type: Type<T>,
    status: number,
    description: string,
    options?: {
      headers?: Record<string, unknown>;
      isArray?: boolean;
    },
  ) {
    return successBuilders.createSuccessResponse(type, description, options?.isArray);
  }
}
