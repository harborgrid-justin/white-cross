/**
 * LOC: DOC-DOWN-APIGW-001
 * File: /reuse/document/composites/downstream/api-gateway-controllers.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/core (v10.x)
 *   - ../document-api-integration-composite
 *   - ../document-compliance-audit-composite
 *   - ../document-notification-tracking-composite
 *
 * DOWNSTREAM (imported by):
 *   - Main application bootstrap
 *   - API route handlers
 *   - Request/response interceptors
 *   - Authentication middleware
 */

/**
 * File: /reuse/document/composites/downstream/api-gateway-controllers.ts
 * Locator: WC-DOWN-APIGW-001
 * Purpose: API Gateway Controllers - Production-grade REST API endpoint management and request routing
 *
 * Upstream: @nestjs/common, @nestjs/core, api-integration/compliance/notification composites
 * Downstream: Main application controllers, route handlers, request interceptors
 * Dependencies: NestJS 10.x, TypeScript 5.x, class-validator 0.x, class-transformer 0.x
 * Exports: 15 controller methods for comprehensive API gateway functionality
 *
 * LLM Context: Production-grade API gateway controller implementations for White Cross healthcare platform.
 * Provides comprehensive REST API endpoint management, request validation, response formatting,
 * rate limiting, request correlation tracking, error handling, and API documentation generation.
 * Implements best practices for healthcare API standards including HIPAA compliance awareness,
 * audit logging, and secure request/response handling.
 */

import {
  Injectable,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Res,
  Req,
  Param,
  Query,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * API request metadata structure
 *
 * @property {string} requestId - Unique request identifier for correlation
 * @property {string} timestamp - Request timestamp in ISO 8601 format
 * @property {string} userId - Authenticated user identifier
 * @property {string} endpoint - API endpoint path
 * @property {string} method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @property {Record<string, unknown>} headers - Request headers
 * @property {unknown} body - Request body payload
 * @property {string} ipAddress - Client IP address
 * @property {string} userAgent - Client user agent string
 */
export interface ApiRequestMetadata {
  requestId: string;
  timestamp: string;
  userId?: string;
  endpoint: string;
  method: string;
  headers: Record<string, unknown>;
  body?: unknown;
  ipAddress: string;
  userAgent: string;
}

/**
 * Standardized API response structure
 *
 * @property {boolean} success - Whether request succeeded
 * @property {unknown} data - Response payload
 * @property {string} [message] - Optional success message
 * @property {string} requestId - Correlation request ID
 * @property {number} statusCode - HTTP status code
 * @property {Record<string, unknown>} [metadata] - Optional response metadata
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  requestId: string;
  statusCode: number;
  metadata?: Record<string, unknown>;
}

/**
 * API error response structure
 *
 * @property {boolean} success - Always false for errors
 * @property {string} error - Error message
 * @property {string} errorCode - Standardized error code
 * @property {string} requestId - Correlation request ID
 * @property {number} statusCode - HTTP status code
 * @property {string} [timestamp] - Error timestamp
 * @property {unknown} [details] - Additional error details
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  errorCode: string;
  requestId: string;
  statusCode: number;
  timestamp?: string;
  details?: unknown;
}

/**
 * Rate limit configuration
 *
 * @property {number} maxRequests - Maximum requests allowed
 * @property {number} windowMs - Time window in milliseconds
 * @property {string} [keyGenerator] - Custom key generation function identifier
 */
export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: string;
}

/**
 * Route metadata for documentation and validation
 *
 * @property {string} path - Route path pattern
 * @property {string} method - HTTP method
 * @property {string} description - Route description
 * @property {string[]} tags - OpenAPI tags
 * @property {boolean} requiresAuth - Authentication requirement
 * @property {string[]} [roles] - Required user roles
 */
export interface RouteMetadata {
  path: string;
  method: string;
  description: string;
  tags: string[];
  requiresAuth: boolean;
  roles?: string[];
}

/**
 * Gateway configuration
 *
 * @property {string} apiVersion - Current API version (semver)
 * @property {string} baseUrl - API base URL
 * @property {RateLimitConfig} rateLimit - Rate limiting configuration
 * @property {boolean} enableDocumentation - Enable OpenAPI documentation
 * @property {boolean} enableCors - Enable CORS
 * @property {string[]} corsOrigins - Allowed CORS origins
 */
export interface GatewayConfig {
  apiVersion: string;
  baseUrl: string;
  rateLimit: RateLimitConfig;
  enableDocumentation: boolean;
  enableCors: boolean;
  corsOrigins: string[];
}

// ============================================================================
// API GATEWAY CONTROLLER SERVICE
// ============================================================================

/**
 * ApiGatewayController: Manages REST API endpoints and request routing
 *
 * Provides comprehensive API gateway functionality including:
 * - Request validation and routing
 * - Response formatting and serialization
 * - Error handling and recovery
 * - Rate limiting and throttling
 * - Request correlation tracking
 * - API documentation generation
 *
 * @class ApiGatewayController
 * @decorator @Controller
 */
@Controller('api')
@Injectable()
export class ApiGatewayController {
  private readonly logger = new Logger(ApiGatewayController.name);
  private readonly requestStore: Map<string, ApiRequestMetadata> = new Map();
  private readonly routeRegistry: Map<string, RouteMetadata> = new Map();

  constructor(
    @Inject('GATEWAY_CONFIG') private readonly config: GatewayConfig,
  ) {
    this.initializeRouteRegistry();
  }

  /**
   * Initialize route registry with all registered routes
   *
   * @description Populates route registry with metadata for all API endpoints
   * Useful for generating documentation and validating requests
   *
   * @returns {void}
   *
   * @example
   * ```typescript
   * controller.initializeRouteRegistry();
   * ```
   */
  private initializeRouteRegistry(): void {
    try {
      const routes: RouteMetadata[] = [
        {
          path: '/documents/:id',
          method: 'GET',
          description: 'Retrieve document by ID',
          tags: ['documents'],
          requiresAuth: true,
          roles: ['read:documents'],
        },
        {
          path: '/documents',
          method: 'POST',
          description: 'Create new document',
          tags: ['documents'],
          requiresAuth: true,
          roles: ['write:documents'],
        },
        {
          path: '/documents/:id',
          method: 'PUT',
          description: 'Update document',
          tags: ['documents'],
          requiresAuth: true,
          roles: ['write:documents'],
        },
        {
          path: '/documents/:id',
          method: 'DELETE',
          description: 'Delete document',
          tags: ['documents'],
          requiresAuth: true,
          roles: ['delete:documents'],
        },
      ];

      routes.forEach((route) => {
        const key = `${route.method} ${route.path}`;
        this.routeRegistry.set(key, route);
      });

      this.logger.log(
        `Route registry initialized with ${routes.length} routes`,
      );
    } catch (error) {
      this.logger.error(
        'Failed to initialize route registry',
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  /**
   * Extract request metadata from incoming request
   *
   * @description Captures comprehensive request metadata for correlation and audit logging
   * Includes request ID, timestamps, user information, and headers
   *
   * @param {Request} req - Express request object
   * @returns {ApiRequestMetadata} Extracted request metadata
   *
   * @throws {Error} If metadata extraction fails
   *
   * @example
   * ```typescript
   * const metadata = controller.extractRequestMetadata(req);
   * console.log(metadata.requestId); // Unique correlation ID
   * ```
   */
  extractRequestMetadata(req: Request): ApiRequestMetadata {
    try {
      const requestId =
        (req.headers['x-request-id'] as string) || uuidv4();
      const timestamp = new Date().toISOString();
      const userId = (req.headers['x-user-id'] as string) || 'anonymous';
      const ipAddress =
        (req.headers['x-forwarded-for'] as string) ||
        req.socket.remoteAddress ||
        'unknown';

      return {
        requestId,
        timestamp,
        userId,
        endpoint: req.path,
        method: req.method,
        headers: req.headers,
        body: req.body,
        ipAddress,
        userAgent: req.headers['user-agent'] || 'unknown',
      };
    } catch (error) {
      this.logger.error(
        'Failed to extract request metadata',
        error instanceof Error ? error.message : String(error),
      );
      throw new InternalServerErrorException(
        'Failed to process request metadata',
      );
    }
  }

  /**
   * Format successful API response
   *
   * @description Standardizes successful response format with metadata and correlation ID
   * Ensures consistent response structure across all endpoints
   *
   * @template T - Response data type
   * @param {T} data - Response payload
   * @param {string} requestId - Correlation request ID
   * @param {string} [message] - Optional success message
   * @param {Record<string, unknown>} [metadata] - Optional response metadata
   * @returns {ApiResponse<T>} Formatted API response
   *
   * @example
   * ```typescript
   * const response = controller.formatSuccessResponse(
   *   { id: '123', name: 'Test' },
   *   'req-123',
   *   'Document retrieved successfully'
   * );
   * ```
   */
  formatSuccessResponse<T = unknown>(
    data: T,
    requestId: string,
    message?: string,
    metadata?: Record<string, unknown>,
  ): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
      requestId,
      statusCode: HttpStatus.OK,
      metadata,
    };
  }

  /**
   * Format error API response
   *
   * @description Standardizes error response format with error codes and details
   * Maintains consistency in error handling across all endpoints
   *
   * @param {string} error - Error message
   * @param {string} errorCode - Standardized error code
   * @param {string} requestId - Correlation request ID
   * @param {number} statusCode - HTTP status code
   * @param {unknown} [details] - Additional error details
   * @returns {ApiErrorResponse} Formatted error response
   *
   * @example
   * ```typescript
   * const errorResponse = controller.formatErrorResponse(
   *   'Document not found',
   *   'DOC_NOT_FOUND',
   *   'req-123',
   *   HttpStatus.NOT_FOUND
   * );
   * ```
   */
  formatErrorResponse(
    error: string,
    errorCode: string,
    requestId: string,
    statusCode: number,
    details?: unknown,
  ): ApiErrorResponse {
    return {
      success: false,
      error,
      errorCode,
      requestId,
      statusCode,
      timestamp: new Date().toISOString(),
      details,
    };
  }

  /**
   * Validate request headers for required fields
   *
   * @description Ensures all required headers are present and valid
   * Validates authorization, content-type, and custom headers
   *
   * @param {Record<string, unknown>} headers - Request headers
   * @param {string[]} requiredHeaders - List of required header names
   * @returns {boolean} Whether all required headers are present
   *
   * @throws {BadRequestException} If required headers are missing
   *
   * @example
   * ```typescript
   * const isValid = controller.validateRequestHeaders(
   *   req.headers,
   *   ['authorization', 'content-type']
   * );
   * ```
   */
  validateRequestHeaders(
    headers: Record<string, unknown>,
    requiredHeaders: string[],
  ): boolean {
    try {
      const missingHeaders = requiredHeaders.filter(
        (header) => !headers[header.toLowerCase()],
      );

      if (missingHeaders.length > 0) {
        throw new BadRequestException(
          `Missing required headers: ${missingHeaders.join(', ')}`,
        );
      }

      return true;
    } catch (error) {
      this.logger.warn(
        'Header validation failed',
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  /**
   * Check if request is rate limited
   *
   * @description Evaluates rate limit status for requesting client
   * Tracks requests per time window and enforces limits
   *
   * @param {string} clientId - Client identifier (IP or user ID)
   * @returns {boolean} Whether request exceeds rate limit
   *
   * @example
   * ```typescript
   * if (controller.isRateLimited(clientId)) {
   *   throw new TooManyRequestsException();
   * }
   * ```
   */
  isRateLimited(clientId: string): boolean {
    try {
      // Implementation would track requests per client
      // This is a simplified version
      const clientRequests = Array.from(this.requestStore.values()).filter(
        (req) => req.ipAddress === clientId,
      );

      const recentRequests = clientRequests.filter(
        (req) =>
          new Date(req.timestamp).getTime() >
          Date.now() - this.config.rateLimit.windowMs,
      );

      return recentRequests.length >= this.config.rateLimit.maxRequests;
    } catch (error) {
      this.logger.error(
        'Rate limit check failed',
        error instanceof Error ? error.message : String(error),
      );
      return false;
    }
  }

  /**
   * Store request in registry for correlation and analysis
   *
   * @description Persists request metadata for audit trail and correlation
   * Enables request tracing across distributed system
   *
   * @param {ApiRequestMetadata} metadata - Request metadata
   * @returns {void}
   *
   * @example
   * ```typescript
   * const metadata = controller.extractRequestMetadata(req);
   * controller.storeRequest(metadata);
   * ```
   */
  storeRequest(metadata: ApiRequestMetadata): void {
    try {
      this.requestStore.set(metadata.requestId, metadata);

      // Clean up old requests (older than 1 hour)
      const oneHourAgo = Date.now() - 3600000;
      for (const [id, req] of this.requestStore.entries()) {
        if (new Date(req.timestamp).getTime() < oneHourAgo) {
          this.requestStore.delete(id);
        }
      }
    } catch (error) {
      this.logger.error(
        'Failed to store request',
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  /**
   * Retrieve request by ID from registry
   *
   * @description Fetches stored request metadata for correlation and debugging
   * Useful for tracing request flow through system
   *
   * @param {string} requestId - Request ID to retrieve
   * @returns {ApiRequestMetadata | undefined} Request metadata or undefined if not found
   *
   * @example
   * ```typescript
   * const request = controller.getRequest('req-123');
   * if (request) {
   *   console.log(`Request from ${request.ipAddress}`);
   * }
   * ```
   */
  getRequest(requestId: string): ApiRequestMetadata | undefined {
    try {
      return this.requestStore.get(requestId);
    } catch (error) {
      this.logger.error(
        'Failed to retrieve request',
        error instanceof Error ? error.message : String(error),
      );
      return undefined;
    }
  }

  /**
   * Get route metadata for endpoint
   *
   * @description Retrieves metadata for given endpoint including auth requirements and tags
   * Useful for validation and documentation generation
   *
   * @param {string} method - HTTP method
   * @param {string} path - Request path
   * @returns {RouteMetadata | undefined} Route metadata or undefined if not found
   *
   * @example
   * ```typescript
   * const routeMeta = controller.getRouteMetadata('POST', '/documents');
   * if (routeMeta?.requiresAuth) {
   *   // Validate authentication
   * }
   * ```
   */
  getRouteMetadata(
    method: string,
    path: string,
  ): RouteMetadata | undefined {
    try {
      const key = `${method} ${path}`;
      return this.routeRegistry.get(key);
    } catch (error) {
      this.logger.error(
        'Failed to retrieve route metadata',
        error instanceof Error ? error.message : String(error),
      );
      return undefined;
    }
  }

  /**
   * Get all registered routes
   *
   * @description Retrieves all registered route metadata
   * Useful for generating API documentation and route listing
   *
   * @returns {RouteMetadata[]} Array of all registered route metadata
   *
   * @example
   * ```typescript
   * const routes = controller.getAllRoutes();
   * console.log(`Total routes: ${routes.length}`);
   * ```
   */
  getAllRoutes(): RouteMetadata[] {
    try {
      return Array.from(this.routeRegistry.values());
    } catch (error) {
      this.logger.error(
        'Failed to retrieve routes',
        error instanceof Error ? error.message : String(error),
      );
      return [];
    }
  }

  /**
   * Register new route metadata
   *
   * @description Dynamically registers new route with metadata
   * Enables runtime route registration for plugins and extensions
   *
   * @param {RouteMetadata} metadata - Route metadata to register
   * @returns {boolean} Whether registration succeeded
   *
   * @example
   * ```typescript
   * const registered = controller.registerRoute({
   *   path: '/documents/export',
   *   method: 'POST',
   *   description: 'Export documents',
   *   tags: ['documents'],
   *   requiresAuth: true,
   * });
   * ```
   */
  registerRoute(metadata: RouteMetadata): boolean {
    try {
      const key = `${metadata.method} ${metadata.path}`;
      this.routeRegistry.set(key, metadata);
      this.logger.log(`Route registered: ${key}`);
      return true;
    } catch (error) {
      this.logger.error(
        'Failed to register route',
        error instanceof Error ? error.message : String(error),
      );
      return false;
    }
  }

  /**
   * Unregister route metadata
   *
   * @description Removes route metadata from registry
   * Useful for disabling endpoints at runtime
   *
   * @param {string} method - HTTP method
   * @param {string} path - Request path
   * @returns {boolean} Whether unregistration succeeded
   *
   * @example
   * ```typescript
   * const unregistered = controller.unregisterRoute('POST', '/documents');
   * ```
   */
  unregisterRoute(method: string, path: string): boolean {
    try {
      const key = `${method} ${path}`;
      const deleted = this.routeRegistry.delete(key);
      if (deleted) {
        this.logger.log(`Route unregistered: ${key}`);
      }
      return deleted;
    } catch (error) {
      this.logger.error(
        'Failed to unregister route',
        error instanceof Error ? error.message : String(error),
      );
      return false;
    }
  }

  /**
   * Get health status of API gateway
   *
   * @description Returns current health status including uptime and metrics
   * Used for monitoring and load balancer health checks
   *
   * @returns {object} Health status object
   *
   * @example
   * ```typescript
   * const health = controller.getHealthStatus();
   * console.log(`Gateway health: ${health.status}`);
   * ```
   */
  getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    uptime: number;
    requestsProcessed: number;
    activeRequests: number;
  } {
    try {
      return {
        status: 'healthy',
        uptime: process.uptime(),
        requestsProcessed: this.requestStore.size,
        activeRequests: Array.from(this.requestStore.values()).filter(
          (req) =>
            new Date(req.timestamp).getTime() >
            Date.now() - 60000, // Last minute
        ).length,
      };
    } catch (error) {
      this.logger.error(
        'Failed to retrieve health status',
        error instanceof Error ? error.message : String(error),
      );
      return {
        status: 'unhealthy',
        uptime: process.uptime(),
        requestsProcessed: 0,
        activeRequests: 0,
      };
    }
  }

  /**
   * Generate API documentation for registered routes
   *
   * @description Generates OpenAPI/Swagger compatible documentation
   * Includes endpoint descriptions, parameters, and response schemas
   *
   * @returns {Record<string, unknown>} OpenAPI specification object
   *
   * @example
   * ```typescript
   * const docs = controller.generateApiDocumentation();
   * // docs can be used with Swagger UI
   * ```
   */
  generateApiDocumentation(): Record<string, unknown> {
    try {
      const routes = this.getAllRoutes();
      const paths: Record<string, unknown> = {};

      routes.forEach((route) => {
        if (!paths[route.path]) {
          paths[route.path] = {};
        }
        (paths[route.path] as Record<string, unknown>)[
          route.method.toLowerCase()
        ] = {
          tags: route.tags,
          description: route.description,
          security: route.requiresAuth ? [{ bearerAuth: [] }] : [],
          responses: {
            200: { description: 'Successful response' },
            400: { description: 'Bad request' },
            401: { description: 'Unauthorized' },
            404: { description: 'Not found' },
            500: { description: 'Internal server error' },
          },
        };
      });

      return {
        openapi: '3.0.0',
        info: {
          title: 'White Cross Healthcare API',
          version: this.config.apiVersion,
        },
        servers: [{ url: this.config.baseUrl }],
        paths,
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      };
    } catch (error) {
      this.logger.error(
        'Failed to generate API documentation',
        error instanceof Error ? error.message : String(error),
      );
      return {};
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  ApiGatewayController,
  ApiRequestMetadata,
  ApiResponse,
  ApiErrorResponse,
  RateLimitConfig,
  RouteMetadata,
  GatewayConfig,
};
