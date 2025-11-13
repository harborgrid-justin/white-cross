import { Logger } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

/**
 * Base Controller class providing common functionality for all controllers.
 * Eliminates duplication of Logger initialization and common controller patterns.
 */
export abstract class BaseController {
  protected readonly logger: Logger;

  constructor(context?: string) {
    this.logger = new Logger(context || this.constructor.name);
  }

  /**
   * Log controller operation
   */
  protected logInfo(message: string, context?: any): void {
    this.logger.log(message, context);
  }

  /**
   * Log controller error
   */
  protected logError(message: string, error?: any, context?: any): void {
    this.logger.error(message, error?.stack || error, context);
  }

  /**
   * Log controller warning
   */
  protected logWarning(message: string, context?: any): void {
    this.logger.warn(message, context);
  }

  /**
   * Common API response decorators for standard HTTP responses
   */
  protected static getStandardApiResponses() {
    return [
      ApiResponse({ status: 401, description: 'Unauthorized - Authentication required' }),
      ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' }),
      ApiResponse({ status: 500, description: 'Internal server error' }),
    ];
  }

  /**
   * Common API response decorators for entity not found
   */
  protected static getNotFoundApiResponse(entityName: string = 'Resource') {
    return ApiResponse({ status: 404, description: `${entityName} not found` });
  }

  /**
   * Common API response decorators for validation errors
   */
  protected static getValidationErrorApiResponse() {
    return ApiResponse({ status: 400, description: 'Bad request - Validation error' });
  }
}
