/**
 * @fileoverview Shared Controller Utilities
 * @module common/shared
 * @description Common utilities and patterns shared between controllers
 */

import { Logger } from '@nestjs/common';
import { 
  ApiResponse, 
  ApiOperation, 
  ApiTags, 
  ApiParam, 
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Request, Response } from 'express';

/**
 * Common response structure for API endpoints
 */
export interface ApiResponseWrapper<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
  path: string;
}

/**
 * Common pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Common controller utilities
 */
export class ControllerUtilities {
  /**
   * Creates a standardized logger instance for controllers
   */
  static createControllerLogger(controllerName: string): Logger {
    return new Logger(controllerName);
  }

  /**
   * Creates a standardized success response
   */
  static createSuccessResponse<T>(
    data: T,
    message?: string,
    path?: string,
  ): ApiResponseWrapper<T> {
    return {
      success: true,
      data,
      message: message || 'Operation completed successfully',
      timestamp: new Date().toISOString(),
      path: path || '',
    };
  }

  /**
   * Creates a standardized error response
   */
  static createErrorResponse(
    error: string,
    message?: string,
    path?: string,
  ): ApiResponseWrapper {
    return {
      success: false,
      error,
      message: message || 'Operation failed',
      timestamp: new Date().toISOString(),
      path: path || '',
    };
  }

  /**
   * Handles common controller errors and returns standardized response
   */
  static handleControllerError(
    logger: Logger,
    error: unknown,
    operation: string,
    req: Request,
  ): ApiResponseWrapper {
    const errorMessage = (error as Error).message || 'Unknown error occurred';
    const logMessage = `Error in ${operation}: ${errorMessage}`;
    
    logger.error(logMessage, error);
    
    return this.createErrorResponse(
      errorMessage,
      `Failed to ${operation}`,
      req.path,
    );
  }

  /**
   * Logs successful controller operations
   */
  static logControllerSuccess(
    logger: Logger,
    operation: string,
    additionalInfo?: Record<string, any>,
  ): void {
    const additional = additionalInfo 
      ? ` - ${Object.entries(additionalInfo).map(([k, v]) => `${k}: ${v}`).join(', ')}`
      : '';
    
    logger.log(`Successfully completed ${operation}${additional}`);
  }

  /**
   * Common validation for pagination parameters
   */
  static validatePaginationParams(params: PaginationParams): PaginationParams {
    return {
      page: Math.max(1, params.page || 1),
      limit: Math.min(100, Math.max(1, params.limit || 10)),
      sortBy: params.sortBy,
      sortOrder: params.sortOrder === 'DESC' ? 'DESC' : 'ASC',
    };
  }

  /**
   * Common Swagger decorators for CRUD endpoints
   */
  static getSwaggerDecorators() {
    return {
      /**
       * Standard decorators for GET all endpoints
       */
      getAll: (entityName: string, description?: string) => [
        ApiOperation({ 
          summary: `Get all ${entityName}s`, 
          description: description || `Retrieve a paginated list of ${entityName}s`,
        }),
        ApiResponse({ 
          status: 200, 
          description: `Successfully retrieved ${entityName}s`,
        }),
        ApiResponse({ 
          status: 400, 
          description: 'Bad request - invalid parameters',
        }),
        ApiResponse({ 
          status: 401, 
          description: 'Unauthorized - authentication required',
        }),
        ApiResponse({ 
          status: 500, 
          description: 'Internal server error',
        }),
        ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' }),
        ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
        ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort field' }),
        ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Sort order' }),
        ApiBearerAuth(),
      ],

      /**
       * Standard decorators for GET by ID endpoints
       */
      getById: (entityName: string, description?: string) => [
        ApiOperation({ 
          summary: `Get ${entityName} by ID`, 
          description: description || `Retrieve a specific ${entityName} by its ID`,
        }),
        ApiResponse({ 
          status: 200, 
          description: `Successfully retrieved ${entityName}`,
        }),
        ApiResponse({ 
          status: 400, 
          description: 'Bad request - invalid ID format',
        }),
        ApiResponse({ 
          status: 401, 
          description: 'Unauthorized - authentication required',
        }),
        ApiResponse({ 
          status: 404, 
          description: `${entityName} not found`,
        }),
        ApiResponse({ 
          status: 500, 
          description: 'Internal server error',
        }),
        ApiParam({ name: 'id', type: String, description: `${entityName} ID` }),
        ApiBearerAuth(),
      ],

      /**
       * Standard decorators for POST endpoints
       */
      create: (entityName: string, dtoClass?: any, description?: string) => [
        ApiOperation({ 
          summary: `Create ${entityName}`, 
          description: description || `Create a new ${entityName}`,
        }),
        ApiResponse({ 
          status: 201, 
          description: `Successfully created ${entityName}`,
        }),
        ApiResponse({ 
          status: 400, 
          description: 'Bad request - validation failed',
        }),
        ApiResponse({ 
          status: 401, 
          description: 'Unauthorized - authentication required',
        }),
        ApiResponse({ 
          status: 409, 
          description: 'Conflict - resource already exists',
        }),
        ApiResponse({ 
          status: 500, 
          description: 'Internal server error',
        }),
        ...(dtoClass ? [ApiBody({ type: dtoClass })] : []),
        ApiBearerAuth(),
      ],

      /**
       * Standard decorators for PUT/PATCH endpoints
       */
      update: (entityName: string, dtoClass?: any, description?: string) => [
        ApiOperation({ 
          summary: `Update ${entityName}`, 
          description: description || `Update an existing ${entityName}`,
        }),
        ApiResponse({ 
          status: 200, 
          description: `Successfully updated ${entityName}`,
        }),
        ApiResponse({ 
          status: 400, 
          description: 'Bad request - validation failed',
        }),
        ApiResponse({ 
          status: 401, 
          description: 'Unauthorized - authentication required',
        }),
        ApiResponse({ 
          status: 404, 
          description: `${entityName} not found`,
        }),
        ApiResponse({ 
          status: 500, 
          description: 'Internal server error',
        }),
        ApiParam({ name: 'id', type: String, description: `${entityName} ID` }),
        ...(dtoClass ? [ApiBody({ type: dtoClass })] : []),
        ApiBearerAuth(),
      ],

      /**
       * Standard decorators for DELETE endpoints
       */
      delete: (entityName: string, description?: string) => [
        ApiOperation({ 
          summary: `Delete ${entityName}`, 
          description: description || `Delete a ${entityName} by ID`,
        }),
        ApiResponse({ 
          status: 200, 
          description: `Successfully deleted ${entityName}`,
        }),
        ApiResponse({ 
          status: 401, 
          description: 'Unauthorized - authentication required',
        }),
        ApiResponse({ 
          status: 404, 
          description: `${entityName} not found`,
        }),
        ApiResponse({ 
          status: 500, 
          description: 'Internal server error',
        }),
        ApiParam({ name: 'id', type: String, description: `${entityName} ID` }),
        ApiBearerAuth(),
      ],
    };
  }

  /**
   * Common endpoint wrapper that handles errors and standardizes responses
   */
  static async executeEndpoint<T>(
    operation: () => Promise<T>,
    logger: Logger,
    operationName: string,
    req: Request,
  ): Promise<ApiResponseWrapper<T>> {
    try {
      logger.debug(`Starting ${operationName}`);
      const result = await operation();
      this.logControllerSuccess(logger, operationName);
      return this.createSuccessResponse(result, undefined, req.path);
    } catch (error) {
      return this.handleControllerError(logger, error, operationName, req);
    }
  }

  /**
   * Common validation for UUID parameters
   */
  static validateUuidParam(id: string, paramName: string = 'id'): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error(`Invalid ${paramName} format. Must be a valid UUID.`);
    }
  }

  /**
   * Common search parameter validation
   */
  static validateSearchParams(searchTerm?: string, minLength: number = 2): string | undefined {
    if (!searchTerm) return undefined;
    
    const trimmed = searchTerm.trim();
    if (trimmed.length < minLength) {
      throw new Error(`Search term must be at least ${minLength} characters long`);
    }
    
    return trimmed;
  }

  /**
   * Common date range validation
   */
  static validateDateRange(startDate?: string, endDate?: string): { startDate?: Date; endDate?: Date } {
    const result: { startDate?: Date; endDate?: Date } = {};
    
    if (startDate) {
      result.startDate = new Date(startDate);
      if (isNaN(result.startDate.getTime())) {
        throw new Error('Invalid start date format');
      }
    }
    
    if (endDate) {
      result.endDate = new Date(endDate);
      if (isNaN(result.endDate.getTime())) {
        throw new Error('Invalid end date format');
      }
    }
    
    if (result.startDate && result.endDate && result.startDate > result.endDate) {
      throw new Error('Start date must be before end date');
    }
    
    return result;
  }

  /**
   * Creates standard health check response
   */
  static createHealthCheckResponse(serviceName: string, version?: string): ApiResponseWrapper<any> {
    return this.createSuccessResponse({
      service: serviceName,
      status: 'healthy',
      version: version || '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    }, 'Service is healthy');
  }

  /**
   * Common rate limiting headers helper
   */
  static setRateLimitHeaders(
    res: Response,
    limit: number,
    remaining: number,
    resetTime: Date,
  ): void {
    res.setHeader('X-RateLimit-Limit', limit.toString());
    res.setHeader('X-RateLimit-Remaining', remaining.toString());
    res.setHeader('X-RateLimit-Reset', resetTime.toISOString());
  }

  /**
   * Common CORS headers helper
   */
  static setCorsHeaders(res: Response, allowedOrigins: string[] = ['*']): void {
    const origin = allowedOrigins.includes('*') ? '*' : allowedOrigins.join(',');
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
}

/**
 * Common decorator factory for applying standard Swagger tags
 */
export function ApiTagsAndAuth(tags: string[]): ClassDecorator {
  return function <T extends new (...args: any[]) => any>(constructor: T) {
    ApiTags(...tags)(constructor);
    ApiBearerAuth()(constructor);
    return constructor;
  };
}
