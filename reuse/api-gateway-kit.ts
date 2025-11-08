/**
 * LOC: APIGW1234567
 * File: /reuse/api-gateway-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - API gateway implementations
 *   - NestJS middleware and interceptors
 *   - Backend API controllers
 */

/**
 * File: /reuse/api-gateway-kit.ts
 * Locator: WC-UTL-APIGW-001
 * Purpose: Comprehensive API Gateway Utilities - versioning, routing, transformation, security, rate limiting, caching
 *
 * Upstream: Independent utility module for API gateway implementation
 * Downstream: ../backend/*, API controllers, middleware, gateway services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for API gateway, versioning, rate limiting, caching, security, transformation
 *
 * LLM Context: Comprehensive API gateway utilities for implementing production-ready API gateway patterns.
 * Provides versioning, routing, request/response transformation, API composition, rate limiting, caching,
 * security headers, CORS, request logging, tracing, and error formatting. Essential for scalable API infrastructure.
 */

import { Request, Response, NextFunction } from 'express';
import { Model, DataTypes, Sequelize, Op } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ApiVersion {
  version: string;
  prefix: string;
  deprecated?: boolean;
  sunsetDate?: Date;
  supportedFormats: string[];
}

interface RouteConfig {
  path: string;
  method: string;
  version: string;
  handler: string;
  authentication: boolean;
  rateLimit?: RateLimitConfig;
  cache?: CacheConfig;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  strategy: 'fixed' | 'sliding' | 'token-bucket';
  keyGenerator?: (req: Request) => string;
}

interface RateLimitEntry {
  key: string;
  count: number;
  resetTime: number;
  tokens?: number;
}

interface CacheConfig {
  ttl: number;
  strategy: 'private' | 'public' | 'no-cache';
  varyBy?: string[];
  tags?: string[];
}

interface TransformConfig {
  input?: {
    rename?: Record<string, string>;
    remove?: string[];
    defaults?: Record<string, any>;
  };
  output?: {
    rename?: Record<string, string>;
    remove?: string[];
    wrap?: string;
  };
}

interface AggregationRequest {
  requests: Array<{
    id: string;
    url: string;
    method: string;
    headers?: Record<string, string>;
    body?: any;
  }>;
  parallel?: boolean;
  continueOnError?: boolean;
}

interface AggregationResponse {
  results: Array<{
    id: string;
    status: number;
    data: any;
    error?: string;
  }>;
  duration: number;
}

interface ApiKeyValidationResult {
  valid: boolean;
  apiKey?: any;
  error?: string;
  scopes?: string[];
}

interface SecurityHeaders {
  [key: string]: string;
}

interface CorsConfig {
  origins: string[] | string;
  methods: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  credentials: boolean;
  maxAge: number;
}

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: Record<string, HealthCheckDetail>;
}

interface HealthCheckDetail {
  status: 'pass' | 'fail' | 'warn';
  responseTime?: number;
  message?: string;
  details?: any;
}

interface RequestTrace {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  timestamp: number;
  duration?: number;
  metadata: Record<string, any>;
}

interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    statusCode: number;
    timestamp: string;
    traceId?: string;
    details?: any[];
    path?: string;
  };
}

interface SanitizationRules {
  trim?: boolean;
  lowercase?: boolean;
  uppercase?: boolean;
  removeHTML?: boolean;
  allowedTags?: string[];
  maxLength?: number;
}

interface ValidationRule {
  field: string;
  type: 'string' | 'number' | 'boolean' | 'email' | 'url' | 'uuid' | 'date';
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
}

// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================

/**
 * Sequelize model for API Keys with scopes, rate limits, and expiration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ApiKey model
 *
 * @example
 * ```typescript
 * const ApiKey = createApiKeyModel(sequelize);
 * const key = await ApiKey.create({
 *   key: 'ak_live_abc123',
 *   name: 'Production API Key',
 *   scopes: ['read:users', 'write:users'],
 *   rateLimit: 1000,
 *   expiresAt: new Date('2025-12-31')
 * });
 * ```
 */
export const createApiKeyModel = (sequelize: Sequelize) => {
  class ApiKey extends Model {
    public id!: number;
    public key!: string;
    public name!: string;
    public scopes!: string[];
    public rateLimit!: number;
    public rateLimitWindow!: number;
    public enabled!: boolean;
    public expiresAt!: Date | null;
    public lastUsedAt!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ApiKey.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      key: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'Unique API key identifier',
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Friendly name for the API key',
      },
      scopes: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Array of permission scopes',
      },
      rateLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1000,
        comment: 'Maximum requests per window',
      },
      rateLimitWindow: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3600000,
        comment: 'Rate limit window in milliseconds',
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether the key is active',
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Expiration timestamp',
      },
      lastUsedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last usage timestamp',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'api_keys',
      timestamps: true,
      indexes: [
        { fields: ['key'], unique: true },
        { fields: ['enabled'] },
        { fields: ['expiresAt'] },
      ],
    },
  );

  return ApiKey;
};

/**
 * Sequelize model for API Gateway Routes with versioning and configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GatewayRoute model
 *
 * @example
 * ```typescript
 * const GatewayRoute = createGatewayRouteModel(sequelize);
 * const route = await GatewayRoute.create({
 *   path: '/api/v1/users',
 *   method: 'GET',
 *   version: 'v1',
 *   targetUrl: 'http://user-service/users',
 *   authRequired: true
 * });
 * ```
 */
export const createGatewayRouteModel = (sequelize: Sequelize) => {
  class GatewayRoute extends Model {
    public id!: number;
    public path!: string;
    public method!: string;
    public version!: string;
    public targetUrl!: string;
    public authRequired!: boolean;
    public rateLimit!: Record<string, any> | null;
    public cacheConfig!: Record<string, any> | null;
    public transformConfig!: Record<string, any> | null;
    public enabled!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  GatewayRoute.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      path: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Route path pattern',
      },
      method: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'HTTP method (GET, POST, etc.)',
      },
      version: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'API version',
      },
      targetUrl: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        comment: 'Upstream service URL',
      },
      authRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether authentication is required',
      },
      rateLimit: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Rate limiting configuration',
      },
      cacheConfig: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Caching configuration',
      },
      transformConfig: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Request/response transformation config',
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether the route is active',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'gateway_routes',
      timestamps: true,
      indexes: [
        { fields: ['path', 'method', 'version'], unique: true },
        { fields: ['enabled'] },
        { fields: ['version'] },
      ],
    },
  );

  return GatewayRoute;
};

/**
 * Sequelize model for Rate Limit tracking per API key and endpoint.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RateLimitLog model
 *
 * @example
 * ```typescript
 * const RateLimitLog = createRateLimitLogModel(sequelize);
 * const log = await RateLimitLog.create({
 *   identifier: 'apikey:ak_123',
 *   endpoint: '/api/v1/users',
 *   requestCount: 1,
 *   windowStart: new Date()
 * });
 * ```
 */
export const createRateLimitLogModel = (sequelize: Sequelize) => {
  class RateLimitLog extends Model {
    public id!: number;
    public identifier!: string;
    public endpoint!: string;
    public requestCount!: number;
    public windowStart!: Date;
    public windowEnd!: Date;
    public blocked!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  RateLimitLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      identifier: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'API key or IP identifier',
      },
      endpoint: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'API endpoint path',
      },
      requestCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of requests in window',
      },
      windowStart: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Start of rate limit window',
      },
      windowEnd: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'End of rate limit window',
      },
      blocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether requests were blocked',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'rate_limit_logs',
      timestamps: true,
      indexes: [
        { fields: ['identifier', 'endpoint', 'windowStart'] },
        { fields: ['windowEnd'] },
      ],
    },
  );

  return RateLimitLog;
};

// ============================================================================
// API VERSIONING & ROUTING (4-7)
// ============================================================================

/**
 * Extracts API version from request URL, header, or query parameter.
 *
 * @param {Request} req - Express request object
 * @param {string} [defaultVersion='v1'] - Default version if not specified
 * @returns {string} API version string
 *
 * @example
 * ```typescript
 * // From URL: /api/v2/users
 * const version = extractApiVersion(req); // 'v2'
 *
 * // From header: X-API-Version: v3
 * const version = extractApiVersion(req); // 'v3'
 * ```
 */
export const extractApiVersion = (req: Request, defaultVersion = 'v1'): string => {
  // Check URL path first
  const pathMatch = req.path.match(/\/(v\d+)\//);
  if (pathMatch) {
    return pathMatch[1];
  }

  // Check custom header
  const headerVersion = req.headers['x-api-version'] as string;
  if (headerVersion) {
    return headerVersion.startsWith('v') ? headerVersion : `v${headerVersion}`;
  }

  // Check query parameter
  const queryVersion = req.query.version as string;
  if (queryVersion) {
    return queryVersion.startsWith('v') ? queryVersion : `v${queryVersion}`;
  }

  return defaultVersion;
};

/**
 * Creates versioned route path with proper prefix.
 *
 * @param {string} basePath - Base path without version
 * @param {string} version - API version
 * @param {string} [prefix='/api'] - API prefix
 * @returns {string} Versioned route path
 *
 * @example
 * ```typescript
 * const path = createVersionedRoute('/users', 'v2');
 * // Result: '/api/v2/users'
 * ```
 */
export const createVersionedRoute = (
  basePath: string,
  version: string,
  prefix = '/api',
): string => {
  const cleanPath = basePath.startsWith('/') ? basePath : `/${basePath}`;
  const cleanVersion = version.startsWith('v') ? version : `v${version}`;
  return `${prefix}/${cleanVersion}${cleanPath}`;
};

/**
 * Validates if API version is supported and checks deprecation status.
 *
 * @param {string} version - API version to validate
 * @param {ApiVersion[]} supportedVersions - Array of supported versions
 * @returns {{ valid: boolean; deprecated: boolean; message?: string }} Validation result
 *
 * @example
 * ```typescript
 * const versions = [
 *   { version: 'v1', prefix: '/api/v1', deprecated: true, supportedFormats: ['json'] },
 *   { version: 'v2', prefix: '/api/v2', supportedFormats: ['json', 'xml'] }
 * ];
 * const result = validateApiVersion('v1', versions);
 * // Result: { valid: true, deprecated: true, message: 'API version v1 is deprecated' }
 * ```
 */
export const validateApiVersion = (
  version: string,
  supportedVersions: ApiVersion[],
): { valid: boolean; deprecated: boolean; message?: string } => {
  const versionConfig = supportedVersions.find(v => v.version === version);

  if (!versionConfig) {
    return {
      valid: false,
      deprecated: false,
      message: `API version ${version} is not supported`,
    };
  }

  if (versionConfig.deprecated) {
    const sunsetMsg = versionConfig.sunsetDate
      ? ` Sunset date: ${versionConfig.sunsetDate.toISOString()}`
      : '';
    return {
      valid: true,
      deprecated: true,
      message: `API version ${version} is deprecated.${sunsetMsg}`,
    };
  }

  return { valid: true, deprecated: false };
};

/**
 * Middleware factory for routing requests based on API version.
 *
 * @param {Record<string, (req: Request, res: Response, next: NextFunction) => void>} versionHandlers - Version-specific handlers
 * @param {string} [defaultVersion='v1'] - Default version
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * const versionRouter = createVersionRouter({
 *   v1: (req, res, next) => { res.json({ version: 'v1' }); },
 *   v2: (req, res, next) => { res.json({ version: 'v2' }); }
 * });
 * app.use('/api/users', versionRouter);
 * ```
 */
export const createVersionRouter = (
  versionHandlers: Record<string, (req: Request, res: Response, next: NextFunction) => void>,
  defaultVersion = 'v1',
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const version = extractApiVersion(req, defaultVersion);
    const handler = versionHandlers[version];

    if (!handler) {
      return res.status(400).json({
        error: {
          code: 'UNSUPPORTED_VERSION',
          message: `API version ${version} is not supported`,
          supportedVersions: Object.keys(versionHandlers),
        },
      });
    }

    handler(req, res, next);
  };
};

// ============================================================================
// REQUEST/RESPONSE TRANSFORMATION (8-11)
// ============================================================================

/**
 * Transforms request body based on configuration (rename, remove, defaults).
 *
 * @param {any} body - Request body
 * @param {TransformConfig['input']} config - Transformation configuration
 * @returns {any} Transformed request body
 *
 * @example
 * ```typescript
 * const transformed = transformRequestBody(
 *   { first_name: 'John', age: 30 },
 *   {
 *     rename: { first_name: 'firstName' },
 *     defaults: { status: 'active' }
 *   }
 * );
 * // Result: { firstName: 'John', age: 30, status: 'active' }
 * ```
 */
export const transformRequestBody = (body: any, config?: TransformConfig['input']): any => {
  if (!config || typeof body !== 'object' || body === null) {
    return body;
  }

  let result = { ...body };

  // Apply field renaming
  if (config.rename) {
    Object.entries(config.rename).forEach(([oldKey, newKey]) => {
      if (oldKey in result) {
        result[newKey] = result[oldKey];
        delete result[oldKey];
      }
    });
  }

  // Remove specified fields
  if (config.remove) {
    config.remove.forEach(key => {
      delete result[key];
    });
  }

  // Apply defaults for missing fields
  if (config.defaults) {
    Object.entries(config.defaults).forEach(([key, value]) => {
      if (!(key in result)) {
        result[key] = value;
      }
    });
  }

  return result;
};

/**
 * Transforms response data based on configuration (rename, remove, wrap).
 *
 * @param {any} data - Response data
 * @param {TransformConfig['output']} config - Transformation configuration
 * @returns {any} Transformed response data
 *
 * @example
 * ```typescript
 * const transformed = transformResponseBody(
 *   { id: 1, name: 'John' },
 *   {
 *     rename: { id: 'userId' },
 *     wrap: 'user'
 *   }
 * );
 * // Result: { user: { userId: 1, name: 'John' } }
 * ```
 */
export const transformResponseBody = (data: any, config?: TransformConfig['output']): any => {
  if (!config || data === null || data === undefined) {
    return data;
  }

  let result = typeof data === 'object' ? { ...data } : data;

  // Apply field renaming
  if (config.rename && typeof result === 'object') {
    Object.entries(config.rename).forEach(([oldKey, newKey]) => {
      if (oldKey in result) {
        result[newKey] = result[oldKey];
        delete result[oldKey];
      }
    });
  }

  // Remove specified fields
  if (config.remove && typeof result === 'object') {
    config.remove.forEach(key => {
      delete result[key];
    });
  }

  // Wrap in container field
  if (config.wrap) {
    result = { [config.wrap]: result };
  }

  return result;
};

/**
 * Converts response data to specified format (JSON, XML, CSV).
 *
 * @param {any} data - Response data
 * @param {string} format - Output format
 * @returns {string} Formatted response string
 *
 * @example
 * ```typescript
 * const csv = convertResponseFormat(
 *   [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }],
 *   'csv'
 * );
 * // Result: 'id,name\n1,John\n2,Jane'
 * ```
 */
export const convertResponseFormat = (data: any, format: string): string => {
  switch (format.toLowerCase()) {
    case 'json':
      return JSON.stringify(data, null, 2);

    case 'xml': {
      const toXml = (obj: any, rootName = 'root'): string => {
        if (Array.isArray(obj)) {
          return obj.map(item => toXml(item, 'item')).join('');
        }
        if (typeof obj === 'object' && obj !== null) {
          const entries = Object.entries(obj)
            .map(([key, value]) => {
              if (typeof value === 'object') {
                return `<${key}>${toXml(value, key)}</${key}>`;
              }
              return `<${key}>${value}</${key}>`;
            })
            .join('');
          return `<${rootName}>${entries}</${rootName}>`;
        }
        return String(obj);
      };
      return `<?xml version="1.0" encoding="UTF-8"?>${toXml(data, 'response')}`;
    }

    case 'csv': {
      if (Array.isArray(data) && data.length > 0) {
        const headers = Object.keys(data[0]);
        const rows = data.map(row => headers.map(h => row[h]).join(','));
        return [headers.join(','), ...rows].join('\n');
      }
      return '';
    }

    default:
      return JSON.stringify(data);
  }
};

/**
 * Middleware for automatic content negotiation based on Accept header.
 *
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {NextFunction} next - Next middleware
 *
 * @example
 * ```typescript
 * app.use(contentNegotiationMiddleware);
 * app.get('/api/v1/users', (req, res) => {
 *   res.locals.data = [{ id: 1, name: 'John' }];
 *   // Automatically formatted based on Accept header
 * });
 * ```
 */
export const contentNegotiationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const originalJson = res.json.bind(res);

  res.json = function (data: any) {
    const acceptHeader = req.headers.accept || 'application/json';

    if (acceptHeader.includes('application/xml')) {
      const xml = convertResponseFormat(data, 'xml');
      return res.type('application/xml').send(xml);
    }

    if (acceptHeader.includes('text/csv')) {
      const csv = convertResponseFormat(data, 'csv');
      return res.type('text/csv').send(csv);
    }

    return originalJson(data);
  };

  next();
};

// ============================================================================
// API COMPOSITION & AGGREGATION (12-15)
// ============================================================================

/**
 * Executes multiple API requests in parallel and aggregates results.
 *
 * @param {AggregationRequest} request - Aggregation request configuration
 * @returns {Promise<AggregationResponse>} Aggregated response
 *
 * @example
 * ```typescript
 * const result = await aggregateApiRequests({
 *   requests: [
 *     { id: 'users', url: '/api/v1/users', method: 'GET' },
 *     { id: 'posts', url: '/api/v1/posts', method: 'GET' }
 *   ],
 *   parallel: true
 * });
 * // Result: { results: [{ id: 'users', status: 200, data: [...] }, ...], duration: 150 }
 * ```
 */
export const aggregateApiRequests = async (
  request: AggregationRequest,
): Promise<AggregationResponse> => {
  const startTime = Date.now();
  const results: AggregationResponse['results'] = [];

  if (request.parallel) {
    const promises = request.requests.map(async req => {
      try {
        const response = await fetch(req.url, {
          method: req.method,
          headers: req.headers,
          body: req.body ? JSON.stringify(req.body) : undefined,
        });

        const data = await response.json();
        return {
          id: req.id,
          status: response.status,
          data,
        };
      } catch (error: any) {
        if (request.continueOnError) {
          return {
            id: req.id,
            status: 500,
            data: null,
            error: error.message,
          };
        }
        throw error;
      }
    });

    const settled = await Promise.allSettled(promises);
    settled.forEach(result => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else if (request.continueOnError) {
        results.push({
          id: 'unknown',
          status: 500,
          data: null,
          error: result.reason?.message || 'Unknown error',
        });
      }
    });
  } else {
    // Sequential execution
    for (const req of request.requests) {
      try {
        const response = await fetch(req.url, {
          method: req.method,
          headers: req.headers,
          body: req.body ? JSON.stringify(req.body) : undefined,
        });

        const data = await response.json();
        results.push({
          id: req.id,
          status: response.status,
          data,
        });
      } catch (error: any) {
        if (request.continueOnError) {
          results.push({
            id: req.id,
            status: 500,
            data: null,
            error: error.message,
          });
        } else {
          throw error;
        }
      }
    }
  }

  return {
    results,
    duration: Date.now() - startTime,
  };
};

/**
 * Merges multiple API responses into a single unified response.
 *
 * @param {any[]} responses - Array of API responses
 * @param {string} mergeStrategy - Strategy: 'flat', 'nested', 'indexed'
 * @returns {any} Merged response
 *
 * @example
 * ```typescript
 * const merged = mergeApiResponses(
 *   [{ users: [...] }, { posts: [...] }],
 *   'flat'
 * );
 * // Result: { users: [...], posts: [...] }
 * ```
 */
export const mergeApiResponses = (responses: any[], mergeStrategy: string): any => {
  switch (mergeStrategy) {
    case 'flat':
      return responses.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    case 'nested':
      return { data: responses };

    case 'indexed':
      return responses.reduce((acc, curr, index) => {
        acc[`response_${index}`] = curr;
        return acc;
      }, {} as Record<string, any>);

    default:
      return responses;
  }
};

/**
 * Creates a batch request handler for processing multiple operations.
 *
 * @param {Function} singleHandler - Handler for single operation
 * @returns {Function} Batch handler function
 *
 * @example
 * ```typescript
 * const singleHandler = async (data) => processUser(data);
 * const batchHandler = createBatchRequestHandler(singleHandler);
 * const results = await batchHandler([user1, user2, user3]);
 * ```
 */
export const createBatchRequestHandler = (
  singleHandler: (data: any) => Promise<any>,
) => {
  return async (items: any[]): Promise<any[]> => {
    const results = await Promise.allSettled(items.map(item => singleHandler(item)));

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return {
          success: true,
          data: result.value,
          index,
        };
      } else {
        return {
          success: false,
          error: result.reason?.message || 'Unknown error',
          index,
        };
      }
    });
  };
};

/**
 * Implements GraphQL-style field selection for REST responses.
 *
 * @param {any} data - Response data
 * @param {string[]} fields - Fields to include
 * @returns {any} Filtered response with selected fields
 *
 * @example
 * ```typescript
 * const filtered = selectResponseFields(
 *   { id: 1, name: 'John', email: 'john@example.com', password: 'secret' },
 *   ['id', 'name', 'email']
 * );
 * // Result: { id: 1, name: 'John', email: 'john@example.com' }
 * ```
 */
export const selectResponseFields = (data: any, fields: string[]): any => {
  if (Array.isArray(data)) {
    return data.map(item => selectResponseFields(item, fields));
  }

  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const result: Record<string, any> = {};

  fields.forEach(field => {
    const parts = field.split('.');
    if (parts.length === 1) {
      if (field in data) {
        result[field] = data[field];
      }
    } else {
      // Nested field selection
      const [parent, ...rest] = parts;
      if (parent in data) {
        result[parent] = selectResponseFields(data[parent], [rest.join('.')]);
      }
    }
  });

  return result;
};

// ============================================================================
// GATEWAY SECURITY (16-19)
// ============================================================================

/**
 * Validates API key and retrieves associated permissions.
 *
 * @param {string} apiKey - API key to validate
 * @param {Model} ApiKeyModel - Sequelize ApiKey model
 * @returns {Promise<ApiKeyValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateApiKey('ak_live_abc123', ApiKeyModel);
 * if (result.valid) {
 *   console.log('Scopes:', result.scopes);
 * }
 * ```
 */
export const validateApiKey = async (
  apiKey: string,
  ApiKeyModel: any,
): Promise<ApiKeyValidationResult> => {
  try {
    const key = await ApiKeyModel.findOne({
      where: {
        key: apiKey,
        enabled: true,
      },
    });

    if (!key) {
      return {
        valid: false,
        error: 'Invalid or disabled API key',
      };
    }

    // Check expiration
    if (key.expiresAt && new Date(key.expiresAt) < new Date()) {
      return {
        valid: false,
        error: 'API key has expired',
      };
    }

    // Update last used timestamp
    await key.update({ lastUsedAt: new Date() });

    return {
      valid: true,
      apiKey: key,
      scopes: key.scopes || [],
    };
  } catch (error: any) {
    return {
      valid: false,
      error: error.message,
    };
  }
};

/**
 * Middleware for API key authentication.
 *
 * @param {Model} ApiKeyModel - Sequelize ApiKey model
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.use('/api/v1', apiKeyAuthMiddleware(ApiKeyModel));
 * ```
 */
export const apiKeyAuthMiddleware = (ApiKeyModel: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const apiKey =
      req.headers['x-api-key'] ||
      req.headers.authorization?.replace('Bearer ', '') ||
      req.query.api_key;

    if (!apiKey) {
      return res.status(401).json({
        error: {
          code: 'MISSING_API_KEY',
          message: 'API key is required',
          statusCode: 401,
        },
      });
    }

    const validation = await validateApiKey(apiKey as string, ApiKeyModel);

    if (!validation.valid) {
      return res.status(401).json({
        error: {
          code: 'INVALID_API_KEY',
          message: validation.error,
          statusCode: 401,
        },
      });
    }

    // Attach API key data to request
    (req as any).apiKey = validation.apiKey;
    (req as any).scopes = validation.scopes;

    next();
  };
};

/**
 * Validates if request has required scopes for the operation.
 *
 * @param {string[]} requiredScopes - Required scopes
 * @param {string[]} userScopes - User's scopes
 * @returns {boolean} Whether user has required scopes
 *
 * @example
 * ```typescript
 * const hasAccess = validateScopes(
 *   ['read:users', 'write:users'],
 *   ['read:users', 'write:users', 'admin']
 * );
 * // Result: true
 * ```
 */
export const validateScopes = (requiredScopes: string[], userScopes: string[]): boolean => {
  if (requiredScopes.length === 0) {
    return true;
  }

  return requiredScopes.every(scope => {
    // Check exact match
    if (userScopes.includes(scope)) {
      return true;
    }

    // Check wildcard match (e.g., 'users:*' matches 'users:read')
    const [resource, action] = scope.split(':');
    return userScopes.some(userScope => {
      const [userResource, userAction] = userScope.split(':');
      return userResource === resource && userAction === '*';
    });
  });
};

/**
 * Generates secure API key with prefix and random bytes.
 *
 * @param {string} [prefix='ak'] - API key prefix
 * @param {string} [environment='live'] - Environment (live, test)
 * @returns {string} Generated API key
 *
 * @example
 * ```typescript
 * const key = generateApiKey('ak', 'live');
 * // Result: 'ak_live_7h3k2m9p4q8r5s1t6u0v2w3x'
 * ```
 */
export const generateApiKey = (prefix = 'ak', environment = 'live'): string => {
  const crypto = require('crypto');
  const randomBytes = crypto.randomBytes(16).toString('hex');
  return `${prefix}_${environment}_${randomBytes}`;
};

// ============================================================================
// RATE LIMITING (20-23)
// ============================================================================

/**
 * In-memory rate limiter using sliding window algorithm.
 *
 * @param {RateLimitConfig} config - Rate limit configuration
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * const limiter = createRateLimiter({
 *   windowMs: 60000,
 *   maxRequests: 100,
 *   strategy: 'sliding'
 * });
 * app.use('/api/v1', limiter);
 * ```
 */
export const createRateLimiter = (config: RateLimitConfig) => {
  const requests = new Map<string, RateLimitEntry>();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = config.keyGenerator
      ? config.keyGenerator(req)
      : (req as any).apiKey?.key || req.ip || 'anonymous';

    const now = Date.now();
    const entry = requests.get(key);

    if (!entry || now > entry.resetTime) {
      // New window
      requests.set(key, {
        key,
        count: 1,
        resetTime: now + config.windowMs,
      });

      res.setHeader('X-RateLimit-Limit', config.maxRequests);
      res.setHeader('X-RateLimit-Remaining', config.maxRequests - 1);
      res.setHeader('X-RateLimit-Reset', new Date(now + config.windowMs).toISOString());

      return next();
    }

    if (entry.count >= config.maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

      res.setHeader('X-RateLimit-Limit', config.maxRequests);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());
      res.setHeader('Retry-After', retryAfter);

      return res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests',
          statusCode: 429,
          retryAfter,
        },
      });
    }

    entry.count++;
    requests.set(key, entry);

    res.setHeader('X-RateLimit-Limit', config.maxRequests);
    res.setHeader('X-RateLimit-Remaining', config.maxRequests - entry.count);
    res.setHeader('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());

    next();
  };
};

/**
 * Token bucket rate limiter for burst traffic handling.
 *
 * @param {number} capacity - Bucket capacity
 * @param {number} refillRate - Tokens per second
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * const limiter = createTokenBucketLimiter(100, 10);
 * app.use('/api/v1/upload', limiter);
 * ```
 */
export const createTokenBucketLimiter = (capacity: number, refillRate: number) => {
  const buckets = new Map<string, RateLimitEntry>();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = (req as any).apiKey?.key || req.ip || 'anonymous';
    const now = Date.now();

    let bucket = buckets.get(key);

    if (!bucket) {
      bucket = {
        key,
        count: 0,
        tokens: capacity,
        resetTime: now,
      };
      buckets.set(key, bucket);
    }

    // Refill tokens
    const timePassed = (now - bucket.resetTime) / 1000;
    const tokensToAdd = timePassed * refillRate;
    bucket.tokens = Math.min(capacity, bucket.tokens! + tokensToAdd);
    bucket.resetTime = now;

    if (bucket.tokens! < 1) {
      const waitTime = Math.ceil((1 - bucket.tokens!) / refillRate);

      res.setHeader('X-RateLimit-Limit', capacity);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('Retry-After', waitTime);

      return res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Token bucket exhausted',
          statusCode: 429,
          retryAfter: waitTime,
        },
      });
    }

    bucket.tokens!--;
    buckets.set(key, bucket);

    res.setHeader('X-RateLimit-Limit', capacity);
    res.setHeader('X-RateLimit-Remaining', Math.floor(bucket.tokens!));

    next();
  };
};

/**
 * Persists rate limit data to database for distributed systems.
 *
 * @param {string} identifier - Rate limit key
 * @param {string} endpoint - API endpoint
 * @param {Model} RateLimitModel - Sequelize model
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await persistRateLimitLog('apikey:ak_123', '/api/v1/users', RateLimitLogModel);
 * ```
 */
export const persistRateLimitLog = async (
  identifier: string,
  endpoint: string,
  RateLimitModel: any,
): Promise<void> => {
  const now = new Date();
  const windowStart = new Date(now.getTime() - 3600000); // 1 hour window

  await RateLimitModel.create({
    identifier,
    endpoint,
    requestCount: 1,
    windowStart,
    windowEnd: now,
    blocked: false,
  });
};

/**
 * Retrieves rate limit usage statistics for an identifier.
 *
 * @param {string} identifier - Rate limit key
 * @param {number} windowMs - Time window in milliseconds
 * @param {Model} RateLimitModel - Sequelize model
 * @returns {Promise<{ count: number; remaining: number }>} Usage stats
 *
 * @example
 * ```typescript
 * const stats = await getRateLimitStats('apikey:ak_123', 60000, RateLimitLogModel);
 * // Result: { count: 45, remaining: 55 }
 * ```
 */
export const getRateLimitStats = async (
  identifier: string,
  windowMs: number,
  RateLimitModel: any,
): Promise<{ count: number; remaining: number }> => {
  const windowStart = new Date(Date.now() - windowMs);

  const logs = await RateLimitModel.findAll({
    where: {
      identifier,
      windowStart: {
        [Op.gte]: windowStart,
      },
    },
  });

  const count = logs.reduce((sum: number, log: any) => sum + log.requestCount, 0);

  return {
    count,
    remaining: Math.max(0, 1000 - count), // Assuming 1000 as default limit
  };
};

// ============================================================================
// REQUEST VALIDATION & SANITIZATION (24-27)
// ============================================================================

/**
 * Validates request body against defined rules.
 *
 * @param {any} body - Request body to validate
 * @param {ValidationRule[]} rules - Validation rules
 * @returns {{ valid: boolean; errors: any[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateRequestBody(
 *   { email: 'invalid', age: 'not-a-number' },
 *   [
 *     { field: 'email', type: 'email', required: true },
 *     { field: 'age', type: 'number', required: true, min: 0, max: 120 }
 *   ]
 * );
 * ```
 */
export const validateRequestBody = (
  body: any,
  rules: ValidationRule[],
): { valid: boolean; errors: any[] } => {
  const errors: any[] = [];

  rules.forEach(rule => {
    const value = body[rule.field];

    // Required check
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push({
        field: rule.field,
        message: `${rule.field} is required`,
        code: 'REQUIRED_FIELD',
      });
      return;
    }

    if (value === undefined || value === null) {
      return; // Skip optional fields
    }

    // Type validation
    switch (rule.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push({
            field: rule.field,
            message: `${rule.field} must be a string`,
            code: 'INVALID_TYPE',
          });
        }
        break;

      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          errors.push({
            field: rule.field,
            message: `${rule.field} must be a number`,
            code: 'INVALID_TYPE',
          });
        } else {
          if (rule.min !== undefined && value < rule.min) {
            errors.push({
              field: rule.field,
              message: `${rule.field} must be at least ${rule.min}`,
              code: 'MIN_VALUE',
            });
          }
          if (rule.max !== undefined && value > rule.max) {
            errors.push({
              field: rule.field,
              message: `${rule.field} must be at most ${rule.max}`,
              code: 'MAX_VALUE',
            });
          }
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push({
            field: rule.field,
            message: `${rule.field} must be a valid email`,
            code: 'INVALID_EMAIL',
          });
        }
        break;

      case 'url':
        try {
          new URL(value);
        } catch {
          errors.push({
            field: rule.field,
            message: `${rule.field} must be a valid URL`,
            code: 'INVALID_URL',
          });
        }
        break;

      case 'uuid':
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(value)) {
          errors.push({
            field: rule.field,
            message: `${rule.field} must be a valid UUID`,
            code: 'INVALID_UUID',
          });
        }
        break;
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      errors.push({
        field: rule.field,
        message: `${rule.field} format is invalid`,
        code: 'INVALID_FORMAT',
      });
    }

    // Custom validation
    if (rule.custom && !rule.custom(value)) {
      errors.push({
        field: rule.field,
        message: `${rule.field} failed custom validation`,
        code: 'CUSTOM_VALIDATION_FAILED',
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitizes string input to prevent XSS and injection attacks.
 *
 * @param {string} input - Input string to sanitize
 * @param {SanitizationRules} [rules] - Sanitization rules
 * @returns {string} Sanitized string
 *
 * @example
 * ```typescript
 * const clean = sanitizeInput('<script>alert("xss")</script>Hello', {
 *   removeHTML: true,
 *   trim: true
 * });
 * // Result: 'Hello'
 * ```
 */
export const sanitizeInput = (input: string, rules?: SanitizationRules): string => {
  let result = input;

  if (rules?.trim) {
    result = result.trim();
  }

  if (rules?.lowercase) {
    result = result.toLowerCase();
  }

  if (rules?.uppercase) {
    result = result.toUpperCase();
  }

  if (rules?.removeHTML) {
    if (rules.allowedTags && rules.allowedTags.length > 0) {
      // Simple tag whitelisting (basic implementation)
      const allowedPattern = rules.allowedTags.join('|');
      result = result.replace(
        new RegExp(`<(?!\/?(${allowedPattern})(\s|>))[^>]*>`, 'gi'),
        '',
      );
    } else {
      // Remove all HTML tags
      result = result.replace(/<[^>]*>/g, '');
    }
  }

  if (rules?.maxLength && result.length > rules.maxLength) {
    result = result.substring(0, rules.maxLength);
  }

  // Basic SQL injection prevention
  result = result.replace(/['";\\]/g, '');

  return result;
};

/**
 * Sanitizes entire request body recursively.
 *
 * @param {any} body - Request body
 * @param {SanitizationRules} [rules] - Sanitization rules
 * @returns {any} Sanitized body
 *
 * @example
 * ```typescript
 * const clean = sanitizeRequestBody({
 *   name: '  John  ',
 *   bio: '<script>alert("xss")</script>Developer'
 * }, { trim: true, removeHTML: true });
 * // Result: { name: 'John', bio: 'Developer' }
 * ```
 */
export const sanitizeRequestBody = (body: any, rules?: SanitizationRules): any => {
  if (typeof body === 'string') {
    return sanitizeInput(body, rules);
  }

  if (Array.isArray(body)) {
    return body.map(item => sanitizeRequestBody(item, rules));
  }

  if (typeof body === 'object' && body !== null) {
    const sanitized: Record<string, any> = {};
    Object.entries(body).forEach(([key, value]) => {
      sanitized[key] = sanitizeRequestBody(value, rules);
    });
    return sanitized;
  }

  return body;
};

/**
 * Middleware for automatic request validation and sanitization.
 *
 * @param {ValidationRule[]} rules - Validation rules
 * @param {SanitizationRules} [sanitizationRules] - Sanitization rules
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.post('/api/v1/users',
 *   requestValidationMiddleware([
 *     { field: 'email', type: 'email', required: true },
 *     { field: 'age', type: 'number', min: 0, max: 120 }
 *   ], { trim: true, removeHTML: true }),
 *   (req, res) => { ... }
 * );
 * ```
 */
export const requestValidationMiddleware = (
  rules: ValidationRule[],
  sanitizationRules?: SanitizationRules,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Sanitize first
    if (sanitizationRules) {
      req.body = sanitizeRequestBody(req.body, sanitizationRules);
    }

    // Then validate
    const validation = validateRequestBody(req.body, rules);

    if (!validation.valid) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          statusCode: 400,
          details: validation.errors,
        },
      });
    }

    next();
  };
};

// ============================================================================
// RESPONSE CACHING (28-31)
// ============================================================================

/**
 * In-memory cache manager with TTL support.
 */
class CacheManager {
  private cache = new Map<string, { data: any; expires: number; tags: string[] }>();

  set(key: string, data: any, ttl: number, tags: string[] = []): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
      tags,
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidateByTag(tag: string): void {
    this.cache.forEach((value, key) => {
      if (value.tags.includes(tag)) {
        this.cache.delete(key);
      }
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

const cacheManager = new CacheManager();

/**
 * Creates cache key from request parameters.
 *
 * @param {Request} req - Express request
 * @param {string[]} [varyBy] - Fields to vary cache by
 * @returns {string} Cache key
 *
 * @example
 * ```typescript
 * const key = createCacheKey(req, ['userId', 'locale']);
 * // Result: 'GET:/api/v1/users:userId=123:locale=en'
 * ```
 */
export const createCacheKey = (req: Request, varyBy?: string[]): string => {
  const parts = [req.method, req.path];

  if (varyBy) {
    varyBy.forEach(field => {
      const value = (req.query[field] || req.headers[field.toLowerCase()]) as string;
      if (value) {
        parts.push(`${field}=${value}`);
      }
    });
  }

  return parts.join(':');
};

/**
 * Response caching middleware with configurable TTL and strategies.
 *
 * @param {CacheConfig} config - Cache configuration
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.get('/api/v1/users',
 *   responseCacheMiddleware({
 *     ttl: 60000,
 *     strategy: 'public',
 *     varyBy: ['userId'],
 *     tags: ['users']
 *   }),
 *   (req, res) => { ... }
 * );
 * ```
 */
export const responseCacheMiddleware = (config: CacheConfig) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const cacheKey = createCacheKey(req, config.varyBy);
    const cached = cacheManager.get(cacheKey);

    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', `${config.strategy}, max-age=${Math.floor(config.ttl / 1000)}`);
      return res.json(cached);
    }

    res.setHeader('X-Cache', 'MISS');

    // Intercept res.json to cache the response
    const originalJson = res.json.bind(res);
    res.json = function (data: any) {
      cacheManager.set(cacheKey, data, config.ttl, config.tags || []);
      res.setHeader('Cache-Control', `${config.strategy}, max-age=${Math.floor(config.ttl / 1000)}`);
      return originalJson(data);
    };

    next();
  };
};

/**
 * Invalidates cached responses by key or tag.
 *
 * @param {string} keyOrTag - Cache key or tag to invalidate
 * @param {boolean} [isTag=false] - Whether to invalidate by tag
 *
 * @example
 * ```typescript
 * // Invalidate specific cache key
 * invalidateCache('GET:/api/v1/users:userId=123');
 *
 * // Invalidate all caches with 'users' tag
 * invalidateCache('users', true);
 * ```
 */
export const invalidateCache = (keyOrTag: string, isTag = false): void => {
  if (isTag) {
    cacheManager.invalidateByTag(keyOrTag);
  } else {
    cacheManager.invalidate(keyOrTag);
  }
};

/**
 * Generates ETag for response data.
 *
 * @param {any} data - Response data
 * @returns {string} ETag value
 *
 * @example
 * ```typescript
 * const etag = generateETag({ id: 1, name: 'John' });
 * res.setHeader('ETag', etag);
 * ```
 */
export const generateETag = (data: any): string => {
  const crypto = require('crypto');
  const hash = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
  return `"${hash}"`;
};

// ============================================================================
// API DOCUMENTATION HELPERS (32-35)
// ============================================================================

/**
 * Generates OpenAPI parameter definition.
 *
 * @param {string} name - Parameter name
 * @param {string} location - Parameter location (query, header, path)
 * @param {string} type - Parameter type
 * @param {boolean} required - Whether required
 * @param {string} [description] - Parameter description
 * @returns {any} OpenAPI parameter object
 *
 * @example
 * ```typescript
 * const param = generateOpenApiParameter('userId', 'path', 'string', true, 'User ID');
 * ```
 */
export const generateOpenApiParameter = (
  name: string,
  location: string,
  type: string,
  required: boolean,
  description?: string,
): any => {
  return {
    name,
    in: location,
    required,
    description: description || `${name} parameter`,
    schema: {
      type,
    },
  };
};

/**
 * Generates OpenAPI response definition.
 *
 * @param {number} statusCode - HTTP status code
 * @param {string} description - Response description
 * @param {any} [schema] - Response schema
 * @returns {any} OpenAPI response object
 *
 * @example
 * ```typescript
 * const response = generateOpenApiResponse(200, 'Successful response', {
 *   type: 'object',
 *   properties: { id: { type: 'number' }, name: { type: 'string' } }
 * });
 * ```
 */
export const generateOpenApiResponse = (
  statusCode: number,
  description: string,
  schema?: any,
): any => {
  return {
    [statusCode]: {
      description,
      content: schema
        ? {
            'application/json': {
              schema,
            },
          }
        : undefined,
    },
  };
};

/**
 * Generates complete OpenAPI operation object for an endpoint.
 *
 * @param {string} method - HTTP method
 * @param {string} summary - Operation summary
 * @param {any[]} parameters - Operation parameters
 * @param {any} responses - Operation responses
 * @param {string[]} [tags] - Operation tags
 * @returns {any} OpenAPI operation object
 *
 * @example
 * ```typescript
 * const operation = generateOpenApiOperation(
 *   'GET',
 *   'Get user by ID',
 *   [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
 *   { 200: { description: 'Success' } },
 *   ['Users']
 * );
 * ```
 */
export const generateOpenApiOperation = (
  method: string,
  summary: string,
  parameters: any[],
  responses: any,
  tags?: string[],
): any => {
  return {
    [method.toLowerCase()]: {
      summary,
      tags: tags || [],
      parameters,
      responses,
      security: [{ apiKey: [] }],
    },
  };
};

/**
 * Extracts API documentation metadata from route handlers.
 *
 * @param {any} handler - Route handler function
 * @returns {any} Extracted metadata
 *
 * @example
 * ```typescript
 * const metadata = extractApiMetadata(userController.getUser);
 * // Result: { summary: 'Get user', description: '...', parameters: [...] }
 * ```
 */
export const extractApiMetadata = (handler: any): any => {
  const metadata: any = {
    summary: handler.name || 'Unknown operation',
    description: handler.toString().match(/\/\*\*([\s\S]*?)\*\//)?.[1]?.trim() || '',
    parameters: [],
    responses: {},
  };

  // Extract JSDoc comments if available
  const jsdocMatch = handler.toString().match(/@swagger\s+([\s\S]*?)(?=\*\/|$)/);
  if (jsdocMatch) {
    try {
      const swaggerData = JSON.parse(jsdocMatch[1]);
      Object.assign(metadata, swaggerData);
    } catch {
      // Ignore parse errors
    }
  }

  return metadata;
};

// ============================================================================
// HEALTH CHECKS & STATUS (36-38)
// ============================================================================

/**
 * Performs comprehensive health check of API gateway and dependencies.
 *
 * @param {Record<string, () => Promise<HealthCheckDetail>>} checks - Health check functions
 * @returns {Promise<HealthCheckResult>} Health check result
 *
 * @example
 * ```typescript
 * const result = await performHealthCheck({
 *   database: async () => {
 *     const start = Date.now();
 *     await sequelize.authenticate();
 *     return { status: 'pass', responseTime: Date.now() - start };
 *   },
 *   redis: async () => {
 *     await redis.ping();
 *     return { status: 'pass' };
 *   }
 * });
 * ```
 */
export const performHealthCheck = async (
  checks: Record<string, () => Promise<HealthCheckDetail>>,
): Promise<HealthCheckResult> => {
  const results: Record<string, HealthCheckDetail> = {};
  const checkPromises = Object.entries(checks).map(async ([name, checkFn]) => {
    try {
      const result = await checkFn();
      results[name] = result;
    } catch (error: any) {
      results[name] = {
        status: 'fail',
        message: error.message,
      };
    }
  });

  await Promise.all(checkPromises);

  const allPassed = Object.values(results).every(r => r.status === 'pass');
  const anyWarning = Object.values(results).some(r => r.status === 'warn');

  return {
    status: allPassed ? 'healthy' : anyWarning ? 'degraded' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: results,
  };
};

/**
 * Creates a health check endpoint handler.
 *
 * @param {Record<string, () => Promise<HealthCheckDetail>>} checks - Health check functions
 * @returns {Function} Express handler
 *
 * @example
 * ```typescript
 * app.get('/health', createHealthCheckEndpoint({
 *   database: async () => ({ status: 'pass' }),
 *   cache: async () => ({ status: 'pass' })
 * }));
 * ```
 */
export const createHealthCheckEndpoint = (
  checks: Record<string, () => Promise<HealthCheckDetail>>,
) => {
  return async (req: Request, res: Response) => {
    const result = await performHealthCheck(checks);
    const statusCode = result.status === 'healthy' ? 200 : result.status === 'degraded' ? 200 : 503;

    res.status(statusCode).json(result);
  };
};

/**
 * Gets API gateway runtime status and metrics.
 *
 * @returns {any} Status information
 *
 * @example
 * ```typescript
 * const status = getGatewayStatus();
 * // Result: { uptime: 3600, memory: {...}, cpu: {...}, ... }
 * ```
 */
export const getGatewayStatus = (): any => {
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();

  return {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: {
      rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB',
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
      external: Math.round(memoryUsage.external / 1024 / 1024) + ' MB',
    },
    cpu: {
      user: cpuUsage.user,
      system: cpuUsage.system,
    },
    nodeVersion: process.version,
    platform: process.platform,
    pid: process.pid,
  };
};

// ============================================================================
// CORS & SECURITY HEADERS (39-41)
// ============================================================================

/**
 * Creates CORS middleware with configuration.
 *
 * @param {CorsConfig} config - CORS configuration
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.use(createCorsMiddleware({
 *   origins: ['https://app.example.com'],
 *   methods: ['GET', 'POST', 'PUT', 'DELETE'],
 *   allowedHeaders: ['Content-Type', 'Authorization'],
 *   credentials: true,
 *   maxAge: 86400
 * }));
 * ```
 */
export const createCorsMiddleware = (config: CorsConfig) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;

    // Check if origin is allowed
    const isAllowed =
      config.origins === '*' ||
      (Array.isArray(config.origins) && origin && config.origins.includes(origin));

    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }

    res.setHeader('Access-Control-Allow-Methods', config.methods.join(', '));
    res.setHeader('Access-Control-Allow-Headers', config.allowedHeaders.join(', '));

    if (config.exposedHeaders.length > 0) {
      res.setHeader('Access-Control-Expose-Headers', config.exposedHeaders.join(', '));
    }

    if (config.credentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    res.setHeader('Access-Control-Max-Age', config.maxAge.toString());

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(204).send();
    }

    next();
  };
};

/**
 * Applies security headers to responses (HSTS, CSP, X-Frame-Options, etc.).
 *
 * @param {Partial<SecurityHeaders>} [customHeaders] - Custom security headers
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.use(securityHeadersMiddleware({
 *   'Content-Security-Policy': "default-src 'self'"
 * }));
 * ```
 */
export const securityHeadersMiddleware = (customHeaders?: Partial<SecurityHeaders>) => {
  const defaultHeaders: SecurityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    ...customHeaders,
  };

  return (req: Request, res: Response, next: NextFunction) => {
    Object.entries(defaultHeaders).forEach(([header, value]) => {
      res.setHeader(header, value);
    });
    next();
  };
};

/**
 * Validates Content-Type header for POST/PUT/PATCH requests.
 *
 * @param {string[]} allowedTypes - Allowed content types
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.use(validateContentType(['application/json', 'multipart/form-data']));
 * ```
 */
export const validateContentType = (allowedTypes: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const contentType = req.headers['content-type']?.split(';')[0];

      if (!contentType || !allowedTypes.some(type => contentType.includes(type))) {
        return res.status(415).json({
          error: {
            code: 'UNSUPPORTED_MEDIA_TYPE',
            message: 'Content-Type not supported',
            statusCode: 415,
            allowedTypes,
          },
        });
      }
    }

    next();
  };
};

// ============================================================================
// REQUEST LOGGING & TRACING (42-44)
// ============================================================================

/**
 * Generates unique trace ID for request tracking.
 *
 * @returns {string} Trace ID
 *
 * @example
 * ```typescript
 * const traceId = generateTraceId();
 * // Result: 'trace_1a2b3c4d5e6f7g8h'
 * ```
 */
export const generateTraceId = (): string => {
  const crypto = require('crypto');
  return `trace_${crypto.randomBytes(8).toString('hex')}`;
};

/**
 * Request logging middleware with trace ID.
 *
 * @param {Function} [logger] - Custom logger function
 * @returns {Function} Express middleware
 *
 * @example
 * ```typescript
 * app.use(requestLoggingMiddleware(console.log));
 * ```
 */
export const requestLoggingMiddleware = (logger?: (data: any) => void) => {
  const log = logger || console.log;

  return (req: Request, res: Response, next: NextFunction) => {
    const traceId = req.headers['x-trace-id'] as string || generateTraceId();
    const startTime = Date.now();

    // Attach trace ID to request
    (req as any).traceId = traceId;
    res.setHeader('X-Trace-Id', traceId);

    // Log request
    log({
      type: 'request',
      traceId,
      method: req.method,
      path: req.path,
      query: req.query,
      headers: req.headers,
      ip: req.ip,
      timestamp: new Date().toISOString(),
    });

    // Intercept response to log it
    const originalSend = res.send.bind(res);
    res.send = function (data: any) {
      const duration = Date.now() - startTime;

      log({
        type: 'response',
        traceId,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        timestamp: new Date().toISOString(),
      });

      return originalSend(data);
    };

    next();
  };
};

/**
 * Creates request trace object with metadata.
 *
 * @param {Request} req - Express request
 * @param {Partial<RequestTrace>} metadata - Additional metadata
 * @returns {RequestTrace} Request trace object
 *
 * @example
 * ```typescript
 * const trace = createRequestTrace(req, { userId: '123', operation: 'getUserProfile' });
 * ```
 */
export const createRequestTrace = (req: Request, metadata?: Partial<RequestTrace>): RequestTrace => {
  const traceId = (req as any).traceId || generateTraceId();
  const spanId = require('crypto').randomBytes(8).toString('hex');

  return {
    traceId,
    spanId,
    parentSpanId: req.headers['x-parent-span-id'] as string,
    timestamp: Date.now(),
    metadata: {
      method: req.method,
      path: req.path,
      query: req.query,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      ...metadata,
    },
  };
};

// ============================================================================
// ERROR RESPONSE FORMATTING (45)
// ============================================================================

/**
 * Formats error into standardized API error response.
 *
 * @param {Error | any} error - Error object
 * @param {Request} [req] - Express request for trace ID
 * @returns {ApiErrorResponse} Formatted error response
 *
 * @example
 * ```typescript
 * try {
 *   throw new Error('User not found');
 * } catch (error) {
 *   const response = formatErrorResponse(error, req);
 *   res.status(response.error.statusCode).json(response);
 * }
 * ```
 */
export const formatErrorResponse = (error: Error | any, req?: Request): ApiErrorResponse => {
  const statusCode = error.statusCode || error.status || 500;
  const code = error.code || 'INTERNAL_ERROR';
  const message = error.message || 'An unexpected error occurred';
  const traceId = req ? (req as any).traceId : undefined;

  return {
    error: {
      code,
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      traceId,
      details: error.details || error.errors || undefined,
      path: req?.path,
    },
  };
};

export default {
  // Sequelize Models
  createApiKeyModel,
  createGatewayRouteModel,
  createRateLimitLogModel,

  // API Versioning & Routing
  extractApiVersion,
  createVersionedRoute,
  validateApiVersion,
  createVersionRouter,

  // Request/Response Transformation
  transformRequestBody,
  transformResponseBody,
  convertResponseFormat,
  contentNegotiationMiddleware,

  // API Composition & Aggregation
  aggregateApiRequests,
  mergeApiResponses,
  createBatchRequestHandler,
  selectResponseFields,

  // Gateway Security
  validateApiKey,
  apiKeyAuthMiddleware,
  validateScopes,
  generateApiKey,

  // Rate Limiting
  createRateLimiter,
  createTokenBucketLimiter,
  persistRateLimitLog,
  getRateLimitStats,

  // Request Validation & Sanitization
  validateRequestBody,
  sanitizeInput,
  sanitizeRequestBody,
  requestValidationMiddleware,

  // Response Caching
  createCacheKey,
  responseCacheMiddleware,
  invalidateCache,
  generateETag,

  // API Documentation Helpers
  generateOpenApiParameter,
  generateOpenApiResponse,
  generateOpenApiOperation,
  extractApiMetadata,

  // Health Checks & Status
  performHealthCheck,
  createHealthCheckEndpoint,
  getGatewayStatus,

  // CORS & Security Headers
  createCorsMiddleware,
  securityHeadersMiddleware,
  validateContentType,

  // Request Logging & Tracing
  generateTraceId,
  requestLoggingMiddleware,
  createRequestTrace,

  // Error Response Formatting
  formatErrorResponse,
};
