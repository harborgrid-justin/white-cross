/**
 * LOC: NETAPIDOC001
 * File: /reuse/san/network-api-documentation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - SAN API controllers
 *   - Network service documentation
 *   - API gateway implementations
 */

/**
 * File: /reuse/san/network-api-documentation-kit.ts
 * Locator: WC-UTL-NETAPIDOC-001
 * Purpose: Comprehensive Network API Documentation Utilities - OpenAPI/Swagger generators for SAN virtual networks
 *
 * Upstream: Independent utility module for network API documentation
 * Downstream: ../backend/*, Network controllers, API documentation generators
 * Dependencies: TypeScript 5.x, @nestjs/swagger 7.x, Node 18+
 * Exports: 38 utility functions for OpenAPI schema generation, Swagger decorators, API documentation builders
 *
 * LLM Context: Comprehensive network API documentation utilities for generating production-ready OpenAPI 3.0
 * specifications for software-defined enterprise virtual networks. Provides schema generators, decorators,
 * documentation builders, security definitions, and export utilities essential for scalable network API infrastructure.
 */

import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiProperty,
  ApiParam,
  ApiQuery,
  ApiHeader,
  ApiSecurity,
  ApiBearerAuth,
  ApiBasicAuth,
  ApiOAuth2,
  ApiCookieAuth,
  getSchemaPath,
} from '@nestjs/swagger';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface OpenApiInfo {
  title: string;
  description: string;
  version: string;
  termsOfService?: string;
  contact?: {
    name: string;
    url?: string;
    email?: string;
  };
  license?: {
    name: string;
    url?: string;
  };
}

interface OpenApiServer {
  url: string;
  description: string;
  variables?: Record<string, {
    default: string;
    description?: string;
    enum?: string[];
  }>;
}

interface OpenApiTag {
  name: string;
  description: string;
  externalDocs?: {
    description: string;
    url: string;
  };
}

interface OpenApiSecurityScheme {
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
  description?: string;
  name?: string;
  in?: 'query' | 'header' | 'cookie';
  scheme?: string;
  bearerFormat?: string;
  flows?: {
    implicit?: OAuthFlow;
    password?: OAuthFlow;
    clientCredentials?: OAuthFlow;
    authorizationCode?: OAuthFlow;
  };
  openIdConnectUrl?: string;
}

interface OAuthFlow {
  authorizationUrl?: string;
  tokenUrl?: string;
  refreshUrl?: string;
  scopes: Record<string, string>;
}

interface ApiEndpointDoc {
  summary: string;
  description: string;
  tags: string[];
  operationId?: string;
  deprecated?: boolean;
  security?: Array<Record<string, string[]>>;
}

interface ApiParameterDoc {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  description: string;
  required: boolean;
  schema: any;
  example?: any;
  examples?: Record<string, any>;
}

interface ApiResponseDoc {
  statusCode: number;
  description: string;
  schema?: any;
  headers?: Record<string, any>;
  examples?: Record<string, any>;
}

interface ApiRequestBodyDoc {
  description: string;
  required: boolean;
  content: Record<string, {
    schema: any;
    example?: any;
    examples?: Record<string, any>;
  }>;
}

interface NetworkApiExample {
  summary: string;
  description?: string;
  value: any;
}

interface ApiDocumentationConfig {
  title: string;
  description: string;
  version: string;
  baseUrl: string;
  tags: OpenApiTag[];
  securitySchemes: Record<string, OpenApiSecurityScheme>;
  externalDocs?: {
    description: string;
    url: string;
  };
}

// ============================================================================
// OPENAPI INFO & METADATA (1-5)
// ============================================================================

/**
 * Generates OpenAPI info object for network API documentation.
 *
 * @param {string} title - API title
 * @param {string} description - API description
 * @param {string} version - API version
 * @param {Partial<OpenApiInfo>} [options] - Additional options
 * @returns {OpenApiInfo} OpenAPI info object
 *
 * @example
 * ```typescript
 * const info = generateNetworkApiInfo(
 *   'Network Management API',
 *   'Enterprise virtual network management and orchestration',
 *   '1.0.0',
 *   {
 *     contact: { name: 'API Team', email: 'api@example.com' },
 *     license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' }
 *   }
 * );
 * ```
 */
export const generateNetworkApiInfo = (
  title: string,
  description: string,
  version: string,
  options?: Partial<OpenApiInfo>,
): OpenApiInfo => {
  return {
    title,
    description,
    version,
    termsOfService: options?.termsOfService,
    contact: options?.contact,
    license: options?.license,
  };
};

/**
 * Generates OpenAPI server configuration for multiple environments.
 *
 * @param {string} environment - Environment name (production, staging, development)
 * @param {string} baseUrl - Base URL for the environment
 * @param {string} description - Server description
 * @returns {OpenApiServer} OpenAPI server object
 *
 * @example
 * ```typescript
 * const server = generateNetworkApiServer(
 *   'production',
 *   'https://api.network.example.com',
 *   'Production network API server'
 * );
 * ```
 */
export const generateNetworkApiServer = (
  environment: string,
  baseUrl: string,
  description: string,
): OpenApiServer => {
  return {
    url: baseUrl,
    description: `${description} (${environment})`,
    variables: {
      environment: {
        default: environment,
        description: 'API environment',
        enum: ['production', 'staging', 'development'],
      },
    },
  };
};

/**
 * Creates OpenAPI tag definition for network resource grouping.
 *
 * @param {string} name - Tag name
 * @param {string} description - Tag description
 * @param {string} [docsUrl] - External documentation URL
 * @returns {OpenApiTag} OpenAPI tag object
 *
 * @example
 * ```typescript
 * const tag = createNetworkApiTag(
 *   'Networks',
 *   'Virtual network management operations',
 *   'https://docs.example.com/networks'
 * );
 * ```
 */
export const createNetworkApiTag = (
  name: string,
  description: string,
  docsUrl?: string,
): OpenApiTag => {
  const tag: OpenApiTag = {
    name,
    description,
  };

  if (docsUrl) {
    tag.externalDocs = {
      description: `Learn more about ${name}`,
      url: docsUrl,
    };
  }

  return tag;
};

/**
 * Generates standard network API tags for SAN operations.
 *
 * @returns {OpenApiTag[]} Array of network API tags
 *
 * @example
 * ```typescript
 * const tags = generateStandardNetworkTags();
 * // Returns tags for: Networks, Subnets, Routes, Firewalls, VPNs, etc.
 * ```
 */
export const generateStandardNetworkTags = (): OpenApiTag[] => {
  return [
    { name: 'Networks', description: 'Virtual network management and configuration' },
    { name: 'Subnets', description: 'Subnet creation, modification, and deletion' },
    { name: 'Routes', description: 'Network routing table management' },
    { name: 'Firewalls', description: 'Firewall rules and security policies' },
    { name: 'VPNs', description: 'VPN gateway and tunnel management' },
    { name: 'Load Balancers', description: 'Load balancer configuration and monitoring' },
    { name: 'IP Addresses', description: 'IP address allocation and management' },
    { name: 'DNS', description: 'DNS zone and record management' },
    { name: 'Monitoring', description: 'Network monitoring and metrics' },
    { name: 'Security', description: 'Network security and compliance' },
  ];
};

/**
 * Creates external documentation reference for OpenAPI spec.
 *
 * @param {string} description - Documentation description
 * @param {string} url - Documentation URL
 * @returns {{ description: string; url: string }} External docs object
 *
 * @example
 * ```typescript
 * const externalDocs = createExternalDocsReference(
 *   'Network API Documentation',
 *   'https://docs.example.com/network-api'
 * );
 * ```
 */
export const createExternalDocsReference = (
  description: string,
  url: string,
): { description: string; url: string } => {
  return { description, url };
};

// ============================================================================
// SECURITY SCHEME DEFINITIONS (6-10)
// ============================================================================

/**
 * Generates Bearer token security scheme for JWT authentication.
 *
 * @param {string} [description] - Security scheme description
 * @param {string} [bearerFormat] - Bearer token format (e.g., 'JWT')
 * @returns {OpenApiSecurityScheme} OpenAPI security scheme
 *
 * @example
 * ```typescript
 * const bearerAuth = generateBearerAuthScheme(
 *   'JWT token obtained from /auth/login',
 *   'JWT'
 * );
 * ```
 */
export const generateBearerAuthScheme = (
  description?: string,
  bearerFormat = 'JWT',
): OpenApiSecurityScheme => {
  return {
    type: 'http',
    scheme: 'bearer',
    bearerFormat,
    description: description || 'Enter JWT Bearer token',
  };
};

/**
 * Generates API Key security scheme for header-based authentication.
 *
 * @param {string} headerName - Header name for API key
 * @param {string} [description] - Security scheme description
 * @returns {OpenApiSecurityScheme} OpenAPI security scheme
 *
 * @example
 * ```typescript
 * const apiKeyAuth = generateApiKeyScheme('X-API-Key', 'API key for authentication');
 * ```
 */
export const generateApiKeyScheme = (
  headerName: string,
  description?: string,
): OpenApiSecurityScheme => {
  return {
    type: 'apiKey',
    in: 'header',
    name: headerName,
    description: description || `API key passed in ${headerName} header`,
  };
};

/**
 * Generates OAuth2 security scheme with multiple flows.
 *
 * @param {string} authorizationUrl - OAuth2 authorization URL
 * @param {string} tokenUrl - OAuth2 token URL
 * @param {Record<string, string>} scopes - OAuth2 scopes
 * @param {string} [description] - Security scheme description
 * @returns {OpenApiSecurityScheme} OpenAPI security scheme
 *
 * @example
 * ```typescript
 * const oauth2 = generateOAuth2Scheme(
 *   'https://auth.example.com/authorize',
 *   'https://auth.example.com/token',
 *   { 'read:networks': 'Read network data', 'write:networks': 'Modify networks' }
 * );
 * ```
 */
export const generateOAuth2Scheme = (
  authorizationUrl: string,
  tokenUrl: string,
  scopes: Record<string, string>,
  description?: string,
): OpenApiSecurityScheme => {
  return {
    type: 'oauth2',
    description: description || 'OAuth2 authentication',
    flows: {
      authorizationCode: {
        authorizationUrl,
        tokenUrl,
        scopes,
      },
    },
  };
};

/**
 * Generates Basic authentication security scheme.
 *
 * @param {string} [description] - Security scheme description
 * @returns {OpenApiSecurityScheme} OpenAPI security scheme
 *
 * @example
 * ```typescript
 * const basicAuth = generateBasicAuthScheme('HTTP Basic Authentication');
 * ```
 */
export const generateBasicAuthScheme = (description?: string): OpenApiSecurityScheme => {
  return {
    type: 'http',
    scheme: 'basic',
    description: description || 'HTTP Basic Authentication',
  };
};

/**
 * Generates comprehensive security schemes for network API.
 *
 * @returns {Record<string, OpenApiSecurityScheme>} Security schemes object
 *
 * @example
 * ```typescript
 * const securitySchemes = generateNetworkSecuritySchemes();
 * // Returns: { bearerAuth, apiKey, oauth2 }
 * ```
 */
export const generateNetworkSecuritySchemes = (): Record<string, OpenApiSecurityScheme> => {
  return {
    bearerAuth: generateBearerAuthScheme('JWT Bearer token for API authentication', 'JWT'),
    apiKey: generateApiKeyScheme('X-API-Key', 'API key for service authentication'),
    oauth2: generateOAuth2Scheme(
      'https://auth.network.example.com/authorize',
      'https://auth.network.example.com/token',
      {
        'read:networks': 'Read network resources',
        'write:networks': 'Create and modify network resources',
        'delete:networks': 'Delete network resources',
        'admin:networks': 'Full administrative access',
      },
      'OAuth2 authorization for network management',
    ),
  };
};

// ============================================================================
// ENDPOINT DOCUMENTATION GENERATORS (11-18)
// ============================================================================

/**
 * Generates API operation documentation for network endpoints.
 *
 * @param {string} summary - Operation summary
 * @param {string} description - Detailed operation description
 * @param {string[]} tags - Operation tags
 * @param {Partial<ApiEndpointDoc>} [options] - Additional options
 * @returns {ApiEndpointDoc} API endpoint documentation
 *
 * @example
 * ```typescript
 * const doc = generateNetworkOperationDoc(
 *   'Create Virtual Network',
 *   'Creates a new virtual network with specified configuration',
 *   ['Networks'],
 *   { operationId: 'createNetwork', security: [{ bearerAuth: [] }] }
 * );
 * ```
 */
export const generateNetworkOperationDoc = (
  summary: string,
  description: string,
  tags: string[],
  options?: Partial<ApiEndpointDoc>,
): ApiEndpointDoc => {
  return {
    summary,
    description,
    tags,
    operationId: options?.operationId,
    deprecated: options?.deprecated || false,
    security: options?.security,
  };
};

/**
 * Creates NestJS decorator for network endpoint documentation.
 *
 * @param {string} summary - Operation summary
 * @param {string} description - Operation description
 * @param {string} tag - Primary tag
 * @returns {MethodDecorator} NestJS decorator
 *
 * @example
 * ```typescript
 * class NetworkController {
 *   @createNetworkEndpointDecorator('Get network', 'Retrieves network by ID', 'Networks')
 *   async getNetwork() { ... }
 * }
 * ```
 */
export const createNetworkEndpointDecorator = (
  summary: string,
  description: string,
  tag: string,
): MethodDecorator => {
  return applyDecorators(
    ApiTags(tag),
    ApiOperation({ summary, description }),
  );
};

/**
 * Generates parameter documentation for path parameters.
 *
 * @param {string} name - Parameter name
 * @param {string} description - Parameter description
 * @param {any} [schema] - Parameter schema
 * @returns {ApiParameterDoc} Parameter documentation
 *
 * @example
 * ```typescript
 * const param = generatePathParameterDoc(
 *   'networkId',
 *   'Unique identifier of the network',
 *   { type: 'string', format: 'uuid' }
 * );
 * ```
 */
export const generatePathParameterDoc = (
  name: string,
  description: string,
  schema?: any,
): ApiParameterDoc => {
  return {
    name,
    in: 'path',
    description,
    required: true,
    schema: schema || { type: 'string' },
  };
};

/**
 * Generates query parameter documentation.
 *
 * @param {string} name - Parameter name
 * @param {string} description - Parameter description
 * @param {boolean} required - Whether parameter is required
 * @param {any} [schema] - Parameter schema
 * @returns {ApiParameterDoc} Parameter documentation
 *
 * @example
 * ```typescript
 * const param = generateQueryParameterDoc(
 *   'region',
 *   'Filter networks by region',
 *   false,
 *   { type: 'string', enum: ['us-east', 'us-west', 'eu-west'] }
 * );
 * ```
 */
export const generateQueryParameterDoc = (
  name: string,
  description: string,
  required: boolean,
  schema?: any,
): ApiParameterDoc => {
  return {
    name,
    in: 'query',
    description,
    required,
    schema: schema || { type: 'string' },
  };
};

/**
 * Creates pagination query parameters documentation.
 *
 * @returns {ApiParameterDoc[]} Array of pagination parameters
 *
 * @example
 * ```typescript
 * const paginationParams = createPaginationParametersDocs();
 * // Returns: page, limit, sort, order parameters
 * ```
 */
export const createPaginationParametersDocs = (): ApiParameterDoc[] => {
  return [
    {
      name: 'page',
      in: 'query',
      description: 'Page number (1-based)',
      required: false,
      schema: { type: 'integer', minimum: 1, default: 1 },
    },
    {
      name: 'limit',
      in: 'query',
      description: 'Number of items per page',
      required: false,
      schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
    },
    {
      name: 'sort',
      in: 'query',
      description: 'Field to sort by',
      required: false,
      schema: { type: 'string' },
    },
    {
      name: 'order',
      in: 'query',
      description: 'Sort order',
      required: false,
      schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' },
    },
  ];
};

/**
 * Generates filter parameters documentation for network queries.
 *
 * @param {string[]} filterableFields - Fields that can be filtered
 * @returns {ApiParameterDoc[]} Array of filter parameters
 *
 * @example
 * ```typescript
 * const filters = generateFilterParametersDocs(['region', 'status', 'type']);
 * ```
 */
export const generateFilterParametersDocs = (filterableFields: string[]): ApiParameterDoc[] => {
  return filterableFields.map(field => ({
    name: field,
    in: 'query',
    description: `Filter by ${field}`,
    required: false,
    schema: { type: 'string' },
  }));
};

/**
 * Creates header parameter documentation.
 *
 * @param {string} name - Header name
 * @param {string} description - Header description
 * @param {boolean} required - Whether header is required
 * @param {any} [schema] - Header schema
 * @returns {ApiParameterDoc} Header parameter documentation
 *
 * @example
 * ```typescript
 * const header = createHeaderParameterDoc(
 *   'X-Request-ID',
 *   'Unique request identifier for tracing',
 *   true,
 *   { type: 'string', format: 'uuid' }
 * );
 * ```
 */
export const createHeaderParameterDoc = (
  name: string,
  description: string,
  required: boolean,
  schema?: any,
): ApiParameterDoc => {
  return {
    name,
    in: 'header',
    description,
    required,
    schema: schema || { type: 'string' },
  };
};

/**
 * Generates standard network API headers documentation.
 *
 * @returns {ApiParameterDoc[]} Array of standard headers
 *
 * @example
 * ```typescript
 * const headers = generateStandardNetworkHeaders();
 * // Returns: X-Request-ID, X-Correlation-ID, X-Client-Version
 * ```
 */
export const generateStandardNetworkHeaders = (): ApiParameterDoc[] => {
  return [
    {
      name: 'X-Request-ID',
      in: 'header',
      description: 'Unique request identifier',
      required: false,
      schema: { type: 'string', format: 'uuid' },
    },
    {
      name: 'X-Correlation-ID',
      in: 'header',
      description: 'Correlation identifier for distributed tracing',
      required: false,
      schema: { type: 'string' },
    },
    {
      name: 'X-Client-Version',
      in: 'header',
      description: 'Client application version',
      required: false,
      schema: { type: 'string' },
    },
  ];
};

// ============================================================================
// RESPONSE DOCUMENTATION (19-24)
// ============================================================================

/**
 * Generates success response documentation.
 *
 * @param {number} statusCode - HTTP status code
 * @param {string} description - Response description
 * @param {any} schema - Response schema
 * @returns {ApiResponseDoc} Response documentation
 *
 * @example
 * ```typescript
 * const response = generateSuccessResponseDoc(
 *   200,
 *   'Network retrieved successfully',
 *   { $ref: '#/components/schemas/Network' }
 * );
 * ```
 */
export const generateSuccessResponseDoc = (
  statusCode: number,
  description: string,
  schema: any,
): ApiResponseDoc => {
  return {
    statusCode,
    description,
    schema,
  };
};

/**
 * Generates error response documentation.
 *
 * @param {number} statusCode - HTTP status code
 * @param {string} description - Error description
 * @returns {ApiResponseDoc} Error response documentation
 *
 * @example
 * ```typescript
 * const errorResponse = generateErrorResponseDoc(404, 'Network not found');
 * ```
 */
export const generateErrorResponseDoc = (
  statusCode: number,
  description: string,
): ApiResponseDoc => {
  return {
    statusCode,
    description,
    schema: {
      type: 'object',
      properties: {
        error: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            message: { type: 'string' },
            statusCode: { type: 'number' },
            timestamp: { type: 'string', format: 'date-time' },
            traceId: { type: 'string' },
            details: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
  };
};

/**
 * Generates standard CRUD response documentation.
 *
 * @param {string} resourceName - Resource name (e.g., 'Network')
 * @param {any} schema - Resource schema
 * @returns {ApiResponseDoc[]} Array of response documentations
 *
 * @example
 * ```typescript
 * const responses = generateCrudResponseDocs('Network', NetworkSchema);
 * // Returns: 200, 201, 400, 401, 404, 500 responses
 * ```
 */
export const generateCrudResponseDocs = (
  resourceName: string,
  schema: any,
): ApiResponseDoc[] => {
  return [
    generateSuccessResponseDoc(200, `${resourceName} retrieved successfully`, schema),
    generateSuccessResponseDoc(201, `${resourceName} created successfully`, schema),
    generateErrorResponseDoc(400, 'Bad request - validation failed'),
    generateErrorResponseDoc(401, 'Unauthorized - authentication required'),
    generateErrorResponseDoc(404, `${resourceName} not found`),
    generateErrorResponseDoc(500, 'Internal server error'),
  ];
};

/**
 * Generates paginated response documentation.
 *
 * @param {string} resourceName - Resource name
 * @param {any} itemSchema - Schema for individual items
 * @returns {ApiResponseDoc} Paginated response documentation
 *
 * @example
 * ```typescript
 * const response = generatePaginatedResponseDoc('Networks', NetworkSchema);
 * ```
 */
export const generatePaginatedResponseDoc = (
  resourceName: string,
  itemSchema: any,
): ApiResponseDoc => {
  return {
    statusCode: 200,
    description: `${resourceName} retrieved successfully`,
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: itemSchema,
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            limit: { type: 'integer' },
            total: { type: 'integer' },
            totalPages: { type: 'integer' },
          },
        },
      },
    },
  };
};

/**
 * Generates bulk operation response documentation.
 *
 * @param {string} operation - Operation name (create, update, delete)
 * @returns {ApiResponseDoc} Bulk operation response
 *
 * @example
 * ```typescript
 * const response = generateBulkOperationResponseDoc('create');
 * ```
 */
export const generateBulkOperationResponseDoc = (operation: string): ApiResponseDoc => {
  return {
    statusCode: 200,
    description: `Bulk ${operation} operation completed`,
    schema: {
      type: 'object',
      properties: {
        successful: { type: 'integer', description: 'Number of successful operations' },
        failed: { type: 'integer', description: 'Number of failed operations' },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              status: { type: 'string', enum: ['success', 'failed'] },
              error: { type: 'string' },
            },
          },
        },
      },
    },
  };
};

/**
 * Generates async operation response documentation.
 *
 * @param {string} operationName - Operation name
 * @returns {ApiResponseDoc} Async operation response
 *
 * @example
 * ```typescript
 * const response = generateAsyncOperationResponseDoc('Network deployment');
 * ```
 */
export const generateAsyncOperationResponseDoc = (operationName: string): ApiResponseDoc => {
  return {
    statusCode: 202,
    description: `${operationName} accepted and processing`,
    schema: {
      type: 'object',
      properties: {
        operationId: { type: 'string', description: 'Unique operation identifier' },
        status: { type: 'string', enum: ['pending', 'processing', 'completed', 'failed'] },
        statusUrl: { type: 'string', description: 'URL to check operation status' },
        estimatedCompletion: { type: 'string', format: 'date-time' },
      },
    },
  };
};

// ============================================================================
// REQUEST BODY DOCUMENTATION (25-28)
// ============================================================================

/**
 * Generates request body documentation.
 *
 * @param {string} description - Request body description
 * @param {any} schema - Request body schema
 * @param {boolean} required - Whether body is required
 * @returns {ApiRequestBodyDoc} Request body documentation
 *
 * @example
 * ```typescript
 * const requestBody = generateRequestBodyDoc(
 *   'Network creation payload',
 *   NetworkCreateSchema,
 *   true
 * );
 * ```
 */
export const generateRequestBodyDoc = (
  description: string,
  schema: any,
  required: boolean,
): ApiRequestBodyDoc => {
  return {
    description,
    required,
    content: {
      'application/json': {
        schema,
      },
    },
  };
};

/**
 * Generates multipart form data request documentation.
 *
 * @param {string} description - Request description
 * @param {Record<string, any>} fields - Form fields schema
 * @returns {ApiRequestBodyDoc} Multipart request documentation
 *
 * @example
 * ```typescript
 * const requestBody = generateMultipartRequestDoc(
 *   'Network configuration upload',
 *   {
 *     file: { type: 'string', format: 'binary' },
 *     name: { type: 'string' },
 *     description: { type: 'string' }
 *   }
 * );
 * ```
 */
export const generateMultipartRequestDoc = (
  description: string,
  fields: Record<string, any>,
): ApiRequestBodyDoc => {
  return {
    description,
    required: true,
    content: {
      'multipart/form-data': {
        schema: {
          type: 'object',
          properties: fields,
        },
      },
    },
  };
};

/**
 * Generates patch request documentation for partial updates.
 *
 * @param {string} resourceName - Resource name
 * @param {any} schema - Schema for patchable fields
 * @returns {ApiRequestBodyDoc} Patch request documentation
 *
 * @example
 * ```typescript
 * const requestBody = generatePatchRequestDoc('Network', NetworkPatchSchema);
 * ```
 */
export const generatePatchRequestDoc = (
  resourceName: string,
  schema: any,
): ApiRequestBodyDoc => {
  return {
    description: `Partial update for ${resourceName}. Only include fields to be updated.`,
    required: true,
    content: {
      'application/json': {
        schema,
      },
    },
  };
};

/**
 * Generates bulk operation request documentation.
 *
 * @param {string} operation - Operation name
 * @param {any} itemSchema - Schema for individual items
 * @returns {ApiRequestBodyDoc} Bulk request documentation
 *
 * @example
 * ```typescript
 * const requestBody = generateBulkRequestDoc('create', NetworkCreateSchema);
 * ```
 */
export const generateBulkRequestDoc = (
  operation: string,
  itemSchema: any,
): ApiRequestBodyDoc => {
  return {
    description: `Bulk ${operation} operation - array of items`,
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: itemSchema,
          minItems: 1,
          maxItems: 100,
        },
      },
    },
  };
};

// ============================================================================
// EXAMPLES GENERATION (29-32)
// ============================================================================

/**
 * Creates API example with summary and value.
 *
 * @param {string} summary - Example summary
 * @param {any} value - Example value
 * @param {string} [description] - Example description
 * @returns {NetworkApiExample} API example object
 *
 * @example
 * ```typescript
 * const example = createApiExample(
 *   'Basic network',
 *   { name: 'production-net', cidr: '10.0.0.0/16' },
 *   'Example of a basic production network'
 * );
 * ```
 */
export const createApiExample = (
  summary: string,
  value: any,
  description?: string,
): NetworkApiExample => {
  return {
    summary,
    description,
    value,
  };
};

/**
 * Generates network creation request examples.
 *
 * @returns {Record<string, NetworkApiExample>} Examples object
 *
 * @example
 * ```typescript
 * const examples = generateNetworkCreateExamples();
 * // Returns: basic, advanced, multi-region examples
 * ```
 */
export const generateNetworkCreateExamples = (): Record<string, NetworkApiExample> => {
  return {
    basic: createApiExample(
      'Basic Network',
      {
        name: 'production-network',
        cidr: '10.0.0.0/16',
        region: 'us-east-1',
        description: 'Production virtual network',
      },
      'Simple network with basic configuration',
    ),
    advanced: createApiExample(
      'Advanced Network',
      {
        name: 'enterprise-network',
        cidr: '172.16.0.0/12',
        region: 'us-west-2',
        description: 'Enterprise network with advanced features',
        enableDnsHostnames: true,
        enableDnsSupport: true,
        tags: {
          Environment: 'Production',
          Team: 'Infrastructure',
        },
      },
      'Network with DNS and tagging enabled',
    ),
  };
};

/**
 * Generates error response examples.
 *
 * @param {string} errorType - Error type (validation, notFound, unauthorized)
 * @returns {Record<string, NetworkApiExample>} Error examples
 *
 * @example
 * ```typescript
 * const examples = generateErrorExamples('validation');
 * ```
 */
export const generateErrorExamples = (errorType: string): Record<string, NetworkApiExample> => {
  const examples: Record<string, Record<string, NetworkApiExample>> = {
    validation: {
      validationError: createApiExample(
        'Validation Error',
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Request validation failed',
            statusCode: 400,
            timestamp: '2024-01-01T00:00:00.000Z',
            details: [
              { field: 'cidr', message: 'Invalid CIDR format' },
              { field: 'name', message: 'Name is required' },
            ],
          },
        },
        'Example of validation error response',
      ),
    },
    notFound: {
      notFoundError: createApiExample(
        'Not Found Error',
        {
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Network not found',
            statusCode: 404,
            timestamp: '2024-01-01T00:00:00.000Z',
          },
        },
        'Example of resource not found error',
      ),
    },
    unauthorized: {
      unauthorizedError: createApiExample(
        'Unauthorized Error',
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
            statusCode: 401,
            timestamp: '2024-01-01T00:00:00.000Z',
          },
        },
        'Example of unauthorized error',
      ),
    },
  };

  return examples[errorType] || {};
};

/**
 * Generates paginated response example.
 *
 * @param {string} resourceName - Resource name
 * @param {any[]} items - Example items
 * @param {number} total - Total number of items
 * @returns {NetworkApiExample} Paginated response example
 *
 * @example
 * ```typescript
 * const example = generatePaginatedExample('Networks', [network1, network2], 50);
 * ```
 */
export const generatePaginatedExample = (
  resourceName: string,
  items: any[],
  total: number,
): NetworkApiExample => {
  return createApiExample(
    `Paginated ${resourceName}`,
    {
      data: items,
      pagination: {
        page: 1,
        limit: 20,
        total,
        totalPages: Math.ceil(total / 20),
      },
    },
    `Example of paginated ${resourceName} response`,
  );
};

// ============================================================================
// SWAGGER DECORATORS (33-36)
// ============================================================================

/**
 * Creates comprehensive CRUD endpoint decorator.
 *
 * @param {string} operation - CRUD operation (create, read, update, delete)
 * @param {string} resourceName - Resource name
 * @param {string} tag - API tag
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * class NetworkController {
 *   @createCrudDecorator('create', 'Network', 'Networks')
 *   async createNetwork() { ... }
 * }
 * ```
 */
export const createCrudDecorator = (
  operation: string,
  resourceName: string,
  tag: string,
): MethodDecorator => {
  const operations: Record<string, { summary: string; description: string }> = {
    create: {
      summary: `Create ${resourceName}`,
      description: `Creates a new ${resourceName} with the provided configuration`,
    },
    read: {
      summary: `Get ${resourceName}`,
      description: `Retrieves ${resourceName} by identifier`,
    },
    update: {
      summary: `Update ${resourceName}`,
      description: `Updates an existing ${resourceName}`,
    },
    delete: {
      summary: `Delete ${resourceName}`,
      description: `Deletes ${resourceName} by identifier`,
    },
    list: {
      summary: `List ${resourceName}s`,
      description: `Retrieves a paginated list of ${resourceName}s`,
    },
  };

  const op = operations[operation] || operations.read;

  return applyDecorators(
    ApiTags(tag),
    ApiOperation({ summary: op.summary, description: op.description }),
  );
};

/**
 * Creates decorator for authenticated network endpoints.
 *
 * @param {string} summary - Operation summary
 * @param {string} description - Operation description
 * @param {string} tag - API tag
 * @param {string[]} [securitySchemes] - Security schemes to apply
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * class NetworkController {
 *   @createAuthenticatedEndpointDecorator(
 *     'Create network',
 *     'Creates a new virtual network',
 *     'Networks',
 *     ['bearerAuth']
 *   )
 *   async createNetwork() { ... }
 * }
 * ```
 */
export const createAuthenticatedEndpointDecorator = (
  summary: string,
  description: string,
  tag: string,
  securitySchemes: string[] = ['bearerAuth'],
): MethodDecorator => {
  const decorators = [
    ApiTags(tag),
    ApiOperation({ summary, description }),
  ];

  securitySchemes.forEach(scheme => {
    if (scheme === 'bearerAuth') {
      decorators.push(ApiBearerAuth());
    } else if (scheme === 'basicAuth') {
      decorators.push(ApiBasicAuth());
    }
  });

  return applyDecorators(...decorators);
};

/**
 * Creates decorator for paginated list endpoints.
 *
 * @param {string} resourceName - Resource name
 * @param {string} tag - API tag
 * @param {Type<any>} responseType - Response DTO type
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * class NetworkController {
 *   @createPaginatedListDecorator('Network', 'Networks', NetworkDto)
 *   async listNetworks() { ... }
 * }
 * ```
 */
export const createPaginatedListDecorator = (
  resourceName: string,
  tag: string,
  responseType: Type<any>,
): MethodDecorator => {
  const paginationParams = createPaginationParametersDocs();

  return applyDecorators(
    ApiTags(tag),
    ApiOperation({
      summary: `List ${resourceName}s`,
      description: `Retrieves a paginated list of ${resourceName}s with filtering and sorting`,
    }),
    ...paginationParams.map(param =>
      ApiQuery({
        name: param.name,
        required: param.required,
        description: param.description,
        type: param.schema.type,
      }),
    ),
    ApiResponse({
      status: 200,
      description: `${resourceName}s retrieved successfully`,
      type: responseType,
    }),
  );
};

/**
 * Creates decorator for async operation endpoints.
 *
 * @param {string} operationName - Operation name
 * @param {string} tag - API tag
 * @returns {MethodDecorator} Composite decorator
 *
 * @example
 * ```typescript
 * class NetworkController {
 *   @createAsyncOperationDecorator('Network deployment', 'Networks')
 *   async deployNetwork() { ... }
 * }
 * ```
 */
export const createAsyncOperationDecorator = (
  operationName: string,
  tag: string,
): MethodDecorator => {
  return applyDecorators(
    ApiTags(tag),
    ApiOperation({
      summary: operationName,
      description: `Initiates ${operationName} as an asynchronous operation`,
    }),
    ApiResponse({
      status: 202,
      description: 'Operation accepted and processing',
      schema: {
        type: 'object',
        properties: {
          operationId: { type: 'string' },
          status: { type: 'string' },
          statusUrl: { type: 'string' },
        },
      },
    }),
  );
};

// ============================================================================
// DOCUMENTATION EXPORT & UTILITIES (37-38)
// ============================================================================

/**
 * Generates complete OpenAPI documentation configuration for network API.
 *
 * @param {Partial<ApiDocumentationConfig>} config - Documentation configuration
 * @returns {any} Complete OpenAPI configuration object
 *
 * @example
 * ```typescript
 * const openApiConfig = generateCompleteApiDocumentation({
 *   title: 'Network Management API',
 *   description: 'Enterprise virtual network management',
 *   version: '1.0.0',
 *   baseUrl: 'https://api.network.example.com'
 * });
 * ```
 */
export const generateCompleteApiDocumentation = (
  config: Partial<ApiDocumentationConfig>,
): any => {
  return {
    openapi: '3.0.0',
    info: generateNetworkApiInfo(
      config.title || 'Network API',
      config.description || 'Network management API',
      config.version || '1.0.0',
    ),
    servers: [
      generateNetworkApiServer('production', config.baseUrl || 'https://api.example.com', 'Production'),
      generateNetworkApiServer('staging', config.baseUrl?.replace('api', 'api-staging') || 'https://api-staging.example.com', 'Staging'),
    ],
    tags: config.tags || generateStandardNetworkTags(),
    components: {
      securitySchemes: config.securitySchemes || generateNetworkSecuritySchemes(),
    },
    externalDocs: config.externalDocs,
  };
};

/**
 * Exports OpenAPI documentation to JSON format.
 *
 * @param {any} documentation - OpenAPI documentation object
 * @param {boolean} [pretty] - Whether to format JSON
 * @returns {string} JSON string of documentation
 *
 * @example
 * ```typescript
 * const json = exportApiDocumentationJson(openApiConfig, true);
 * fs.writeFileSync('openapi.json', json);
 * ```
 */
export const exportApiDocumentationJson = (documentation: any, pretty = true): string => {
  return JSON.stringify(documentation, null, pretty ? 2 : 0);
};

export default {
  // OpenAPI Info & Metadata
  generateNetworkApiInfo,
  generateNetworkApiServer,
  createNetworkApiTag,
  generateStandardNetworkTags,
  createExternalDocsReference,

  // Security Scheme Definitions
  generateBearerAuthScheme,
  generateApiKeyScheme,
  generateOAuth2Scheme,
  generateBasicAuthScheme,
  generateNetworkSecuritySchemes,

  // Endpoint Documentation Generators
  generateNetworkOperationDoc,
  createNetworkEndpointDecorator,
  generatePathParameterDoc,
  generateQueryParameterDoc,
  createPaginationParametersDocs,
  generateFilterParametersDocs,
  createHeaderParameterDoc,
  generateStandardNetworkHeaders,

  // Response Documentation
  generateSuccessResponseDoc,
  generateErrorResponseDoc,
  generateCrudResponseDocs,
  generatePaginatedResponseDoc,
  generateBulkOperationResponseDoc,
  generateAsyncOperationResponseDoc,

  // Request Body Documentation
  generateRequestBodyDoc,
  generateMultipartRequestDoc,
  generatePatchRequestDoc,
  generateBulkRequestDoc,

  // Examples Generation
  createApiExample,
  generateNetworkCreateExamples,
  generateErrorExamples,
  generatePaginatedExample,

  // Swagger Decorators
  createCrudDecorator,
  createAuthenticatedEndpointDecorator,
  createPaginatedListDecorator,
  createAsyncOperationDecorator,

  // Documentation Export & Utilities
  generateCompleteApiDocumentation,
  exportApiDocumentationJson,
};
