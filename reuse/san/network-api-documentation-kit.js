"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportApiDocumentationJson = exports.generateCompleteApiDocumentation = exports.createAsyncOperationDecorator = exports.createPaginatedListDecorator = exports.createAuthenticatedEndpointDecorator = exports.createCrudDecorator = exports.generatePaginatedExample = exports.generateErrorExamples = exports.generateNetworkCreateExamples = exports.createApiExample = exports.generateBulkRequestDoc = exports.generatePatchRequestDoc = exports.generateMultipartRequestDoc = exports.generateRequestBodyDoc = exports.generateAsyncOperationResponseDoc = exports.generateBulkOperationResponseDoc = exports.generatePaginatedResponseDoc = exports.generateCrudResponseDocs = exports.generateErrorResponseDoc = exports.generateSuccessResponseDoc = exports.generateStandardNetworkHeaders = exports.createHeaderParameterDoc = exports.generateFilterParametersDocs = exports.createPaginationParametersDocs = exports.generateQueryParameterDoc = exports.generatePathParameterDoc = exports.createNetworkEndpointDecorator = exports.generateNetworkOperationDoc = exports.generateNetworkSecuritySchemes = exports.generateBasicAuthScheme = exports.generateOAuth2Scheme = exports.generateApiKeyScheme = exports.generateBearerAuthScheme = exports.createExternalDocsReference = exports.generateStandardNetworkTags = exports.createNetworkApiTag = exports.generateNetworkApiServer = exports.generateNetworkApiInfo = void 0;
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
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
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
const generateNetworkApiInfo = (title, description, version, options) => {
    return {
        title,
        description,
        version,
        termsOfService: options?.termsOfService,
        contact: options?.contact,
        license: options?.license,
    };
};
exports.generateNetworkApiInfo = generateNetworkApiInfo;
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
const generateNetworkApiServer = (environment, baseUrl, description) => {
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
exports.generateNetworkApiServer = generateNetworkApiServer;
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
const createNetworkApiTag = (name, description, docsUrl) => {
    const tag = {
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
exports.createNetworkApiTag = createNetworkApiTag;
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
const generateStandardNetworkTags = () => {
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
exports.generateStandardNetworkTags = generateStandardNetworkTags;
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
const createExternalDocsReference = (description, url) => {
    return { description, url };
};
exports.createExternalDocsReference = createExternalDocsReference;
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
const generateBearerAuthScheme = (description, bearerFormat = 'JWT') => {
    return {
        type: 'http',
        scheme: 'bearer',
        bearerFormat,
        description: description || 'Enter JWT Bearer token',
    };
};
exports.generateBearerAuthScheme = generateBearerAuthScheme;
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
const generateApiKeyScheme = (headerName, description) => {
    return {
        type: 'apiKey',
        in: 'header',
        name: headerName,
        description: description || `API key passed in ${headerName} header`,
    };
};
exports.generateApiKeyScheme = generateApiKeyScheme;
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
const generateOAuth2Scheme = (authorizationUrl, tokenUrl, scopes, description) => {
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
exports.generateOAuth2Scheme = generateOAuth2Scheme;
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
const generateBasicAuthScheme = (description) => {
    return {
        type: 'http',
        scheme: 'basic',
        description: description || 'HTTP Basic Authentication',
    };
};
exports.generateBasicAuthScheme = generateBasicAuthScheme;
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
const generateNetworkSecuritySchemes = () => {
    return {
        bearerAuth: (0, exports.generateBearerAuthScheme)('JWT Bearer token for API authentication', 'JWT'),
        apiKey: (0, exports.generateApiKeyScheme)('X-API-Key', 'API key for service authentication'),
        oauth2: (0, exports.generateOAuth2Scheme)('https://auth.network.example.com/authorize', 'https://auth.network.example.com/token', {
            'read:networks': 'Read network resources',
            'write:networks': 'Create and modify network resources',
            'delete:networks': 'Delete network resources',
            'admin:networks': 'Full administrative access',
        }, 'OAuth2 authorization for network management'),
    };
};
exports.generateNetworkSecuritySchemes = generateNetworkSecuritySchemes;
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
const generateNetworkOperationDoc = (summary, description, tags, options) => {
    return {
        summary,
        description,
        tags,
        operationId: options?.operationId,
        deprecated: options?.deprecated || false,
        security: options?.security,
    };
};
exports.generateNetworkOperationDoc = generateNetworkOperationDoc;
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
const createNetworkEndpointDecorator = (summary, description, tag) => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)(tag), (0, swagger_1.ApiOperation)({ summary, description }));
};
exports.createNetworkEndpointDecorator = createNetworkEndpointDecorator;
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
const generatePathParameterDoc = (name, description, schema) => {
    return {
        name,
        in: 'path',
        description,
        required: true,
        schema: schema || { type: 'string' },
    };
};
exports.generatePathParameterDoc = generatePathParameterDoc;
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
const generateQueryParameterDoc = (name, description, required, schema) => {
    return {
        name,
        in: 'query',
        description,
        required,
        schema: schema || { type: 'string' },
    };
};
exports.generateQueryParameterDoc = generateQueryParameterDoc;
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
const createPaginationParametersDocs = () => {
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
exports.createPaginationParametersDocs = createPaginationParametersDocs;
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
const generateFilterParametersDocs = (filterableFields) => {
    return filterableFields.map(field => ({
        name: field,
        in: 'query',
        description: `Filter by ${field}`,
        required: false,
        schema: { type: 'string' },
    }));
};
exports.generateFilterParametersDocs = generateFilterParametersDocs;
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
const createHeaderParameterDoc = (name, description, required, schema) => {
    return {
        name,
        in: 'header',
        description,
        required,
        schema: schema || { type: 'string' },
    };
};
exports.createHeaderParameterDoc = createHeaderParameterDoc;
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
const generateStandardNetworkHeaders = () => {
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
exports.generateStandardNetworkHeaders = generateStandardNetworkHeaders;
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
const generateSuccessResponseDoc = (statusCode, description, schema) => {
    return {
        statusCode,
        description,
        schema,
    };
};
exports.generateSuccessResponseDoc = generateSuccessResponseDoc;
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
const generateErrorResponseDoc = (statusCode, description) => {
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
exports.generateErrorResponseDoc = generateErrorResponseDoc;
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
const generateCrudResponseDocs = (resourceName, schema) => {
    return [
        (0, exports.generateSuccessResponseDoc)(200, `${resourceName} retrieved successfully`, schema),
        (0, exports.generateSuccessResponseDoc)(201, `${resourceName} created successfully`, schema),
        (0, exports.generateErrorResponseDoc)(400, 'Bad request - validation failed'),
        (0, exports.generateErrorResponseDoc)(401, 'Unauthorized - authentication required'),
        (0, exports.generateErrorResponseDoc)(404, `${resourceName} not found`),
        (0, exports.generateErrorResponseDoc)(500, 'Internal server error'),
    ];
};
exports.generateCrudResponseDocs = generateCrudResponseDocs;
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
const generatePaginatedResponseDoc = (resourceName, itemSchema) => {
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
exports.generatePaginatedResponseDoc = generatePaginatedResponseDoc;
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
const generateBulkOperationResponseDoc = (operation) => {
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
exports.generateBulkOperationResponseDoc = generateBulkOperationResponseDoc;
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
const generateAsyncOperationResponseDoc = (operationName) => {
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
exports.generateAsyncOperationResponseDoc = generateAsyncOperationResponseDoc;
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
const generateRequestBodyDoc = (description, schema, required) => {
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
exports.generateRequestBodyDoc = generateRequestBodyDoc;
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
const generateMultipartRequestDoc = (description, fields) => {
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
exports.generateMultipartRequestDoc = generateMultipartRequestDoc;
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
const generatePatchRequestDoc = (resourceName, schema) => {
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
exports.generatePatchRequestDoc = generatePatchRequestDoc;
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
const generateBulkRequestDoc = (operation, itemSchema) => {
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
exports.generateBulkRequestDoc = generateBulkRequestDoc;
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
const createApiExample = (summary, value, description) => {
    return {
        summary,
        description,
        value,
    };
};
exports.createApiExample = createApiExample;
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
const generateNetworkCreateExamples = () => {
    return {
        basic: (0, exports.createApiExample)('Basic Network', {
            name: 'production-network',
            cidr: '10.0.0.0/16',
            region: 'us-east-1',
            description: 'Production virtual network',
        }, 'Simple network with basic configuration'),
        advanced: (0, exports.createApiExample)('Advanced Network', {
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
        }, 'Network with DNS and tagging enabled'),
    };
};
exports.generateNetworkCreateExamples = generateNetworkCreateExamples;
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
const generateErrorExamples = (errorType) => {
    const examples = {
        validation: {
            validationError: (0, exports.createApiExample)('Validation Error', {
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
            }, 'Example of validation error response'),
        },
        notFound: {
            notFoundError: (0, exports.createApiExample)('Not Found Error', {
                error: {
                    code: 'RESOURCE_NOT_FOUND',
                    message: 'Network not found',
                    statusCode: 404,
                    timestamp: '2024-01-01T00:00:00.000Z',
                },
            }, 'Example of resource not found error'),
        },
        unauthorized: {
            unauthorizedError: (0, exports.createApiExample)('Unauthorized Error', {
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required',
                    statusCode: 401,
                    timestamp: '2024-01-01T00:00:00.000Z',
                },
            }, 'Example of unauthorized error'),
        },
    };
    return examples[errorType] || {};
};
exports.generateErrorExamples = generateErrorExamples;
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
const generatePaginatedExample = (resourceName, items, total) => {
    return (0, exports.createApiExample)(`Paginated ${resourceName}`, {
        data: items,
        pagination: {
            page: 1,
            limit: 20,
            total,
            totalPages: Math.ceil(total / 20),
        },
    }, `Example of paginated ${resourceName} response`);
};
exports.generatePaginatedExample = generatePaginatedExample;
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
const createCrudDecorator = (operation, resourceName, tag) => {
    const operations = {
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
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)(tag), (0, swagger_1.ApiOperation)({ summary: op.summary, description: op.description }));
};
exports.createCrudDecorator = createCrudDecorator;
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
const createAuthenticatedEndpointDecorator = (summary, description, tag, securitySchemes = ['bearerAuth']) => {
    const decorators = [
        (0, swagger_1.ApiTags)(tag),
        (0, swagger_1.ApiOperation)({ summary, description }),
    ];
    securitySchemes.forEach(scheme => {
        if (scheme === 'bearerAuth') {
            decorators.push((0, swagger_1.ApiBearerAuth)());
        }
        else if (scheme === 'basicAuth') {
            decorators.push((0, swagger_1.ApiBasicAuth)());
        }
    });
    return (0, common_1.applyDecorators)(...decorators);
};
exports.createAuthenticatedEndpointDecorator = createAuthenticatedEndpointDecorator;
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
const createPaginatedListDecorator = (resourceName, tag, responseType) => {
    const paginationParams = (0, exports.createPaginationParametersDocs)();
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)(tag), (0, swagger_1.ApiOperation)({
        summary: `List ${resourceName}s`,
        description: `Retrieves a paginated list of ${resourceName}s with filtering and sorting`,
    }), ...paginationParams.map(param => (0, swagger_1.ApiQuery)({
        name: param.name,
        required: param.required,
        description: param.description,
        type: param.schema.type,
    })), (0, swagger_1.ApiResponse)({
        status: 200,
        description: `${resourceName}s retrieved successfully`,
        type: responseType,
    }));
};
exports.createPaginatedListDecorator = createPaginatedListDecorator;
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
const createAsyncOperationDecorator = (operationName, tag) => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)(tag), (0, swagger_1.ApiOperation)({
        summary: operationName,
        description: `Initiates ${operationName} as an asynchronous operation`,
    }), (0, swagger_1.ApiResponse)({
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
    }));
};
exports.createAsyncOperationDecorator = createAsyncOperationDecorator;
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
const generateCompleteApiDocumentation = (config) => {
    return {
        openapi: '3.0.0',
        info: (0, exports.generateNetworkApiInfo)(config.title || 'Network API', config.description || 'Network management API', config.version || '1.0.0'),
        servers: [
            (0, exports.generateNetworkApiServer)('production', config.baseUrl || 'https://api.example.com', 'Production'),
            (0, exports.generateNetworkApiServer)('staging', config.baseUrl?.replace('api', 'api-staging') || 'https://api-staging.example.com', 'Staging'),
        ],
        tags: config.tags || (0, exports.generateStandardNetworkTags)(),
        components: {
            securitySchemes: config.securitySchemes || (0, exports.generateNetworkSecuritySchemes)(),
        },
        externalDocs: config.externalDocs,
    };
};
exports.generateCompleteApiDocumentation = generateCompleteApiDocumentation;
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
const exportApiDocumentationJson = (documentation, pretty = true) => {
    return JSON.stringify(documentation, null, pretty ? 2 : 0);
};
exports.exportApiDocumentationJson = exportApiDocumentationJson;
exports.default = {
    // OpenAPI Info & Metadata
    generateNetworkApiInfo: exports.generateNetworkApiInfo,
    generateNetworkApiServer: exports.generateNetworkApiServer,
    createNetworkApiTag: exports.createNetworkApiTag,
    generateStandardNetworkTags: exports.generateStandardNetworkTags,
    createExternalDocsReference: exports.createExternalDocsReference,
    // Security Scheme Definitions
    generateBearerAuthScheme: exports.generateBearerAuthScheme,
    generateApiKeyScheme: exports.generateApiKeyScheme,
    generateOAuth2Scheme: exports.generateOAuth2Scheme,
    generateBasicAuthScheme: exports.generateBasicAuthScheme,
    generateNetworkSecuritySchemes: exports.generateNetworkSecuritySchemes,
    // Endpoint Documentation Generators
    generateNetworkOperationDoc: exports.generateNetworkOperationDoc,
    createNetworkEndpointDecorator: exports.createNetworkEndpointDecorator,
    generatePathParameterDoc: exports.generatePathParameterDoc,
    generateQueryParameterDoc: exports.generateQueryParameterDoc,
    createPaginationParametersDocs: exports.createPaginationParametersDocs,
    generateFilterParametersDocs: exports.generateFilterParametersDocs,
    createHeaderParameterDoc: exports.createHeaderParameterDoc,
    generateStandardNetworkHeaders: exports.generateStandardNetworkHeaders,
    // Response Documentation
    generateSuccessResponseDoc: exports.generateSuccessResponseDoc,
    generateErrorResponseDoc: exports.generateErrorResponseDoc,
    generateCrudResponseDocs: exports.generateCrudResponseDocs,
    generatePaginatedResponseDoc: exports.generatePaginatedResponseDoc,
    generateBulkOperationResponseDoc: exports.generateBulkOperationResponseDoc,
    generateAsyncOperationResponseDoc: exports.generateAsyncOperationResponseDoc,
    // Request Body Documentation
    generateRequestBodyDoc: exports.generateRequestBodyDoc,
    generateMultipartRequestDoc: exports.generateMultipartRequestDoc,
    generatePatchRequestDoc: exports.generatePatchRequestDoc,
    generateBulkRequestDoc: exports.generateBulkRequestDoc,
    // Examples Generation
    createApiExample: exports.createApiExample,
    generateNetworkCreateExamples: exports.generateNetworkCreateExamples,
    generateErrorExamples: exports.generateErrorExamples,
    generatePaginatedExample: exports.generatePaginatedExample,
    // Swagger Decorators
    createCrudDecorator: exports.createCrudDecorator,
    createAuthenticatedEndpointDecorator: exports.createAuthenticatedEndpointDecorator,
    createPaginatedListDecorator: exports.createPaginatedListDecorator,
    createAsyncOperationDecorator: exports.createAsyncOperationDecorator,
    // Documentation Export & Utilities
    generateCompleteApiDocumentation: exports.generateCompleteApiDocumentation,
    exportApiDocumentationJson: exports.exportApiDocumentationJson,
};
//# sourceMappingURL=network-api-documentation-kit.js.map