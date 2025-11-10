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
import { Type } from '@nestjs/common';
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
export declare const generateNetworkApiInfo: (title: string, description: string, version: string, options?: Partial<OpenApiInfo>) => OpenApiInfo;
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
export declare const generateNetworkApiServer: (environment: string, baseUrl: string, description: string) => OpenApiServer;
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
export declare const createNetworkApiTag: (name: string, description: string, docsUrl?: string) => OpenApiTag;
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
export declare const generateStandardNetworkTags: () => OpenApiTag[];
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
export declare const createExternalDocsReference: (description: string, url: string) => {
    description: string;
    url: string;
};
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
export declare const generateBearerAuthScheme: (description?: string, bearerFormat?: string) => OpenApiSecurityScheme;
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
export declare const generateApiKeyScheme: (headerName: string, description?: string) => OpenApiSecurityScheme;
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
export declare const generateOAuth2Scheme: (authorizationUrl: string, tokenUrl: string, scopes: Record<string, string>, description?: string) => OpenApiSecurityScheme;
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
export declare const generateBasicAuthScheme: (description?: string) => OpenApiSecurityScheme;
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
export declare const generateNetworkSecuritySchemes: () => Record<string, OpenApiSecurityScheme>;
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
export declare const generateNetworkOperationDoc: (summary: string, description: string, tags: string[], options?: Partial<ApiEndpointDoc>) => ApiEndpointDoc;
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
export declare const createNetworkEndpointDecorator: (summary: string, description: string, tag: string) => MethodDecorator;
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
export declare const generatePathParameterDoc: (name: string, description: string, schema?: any) => ApiParameterDoc;
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
export declare const generateQueryParameterDoc: (name: string, description: string, required: boolean, schema?: any) => ApiParameterDoc;
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
export declare const createPaginationParametersDocs: () => ApiParameterDoc[];
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
export declare const generateFilterParametersDocs: (filterableFields: string[]) => ApiParameterDoc[];
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
export declare const createHeaderParameterDoc: (name: string, description: string, required: boolean, schema?: any) => ApiParameterDoc;
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
export declare const generateStandardNetworkHeaders: () => ApiParameterDoc[];
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
export declare const generateSuccessResponseDoc: (statusCode: number, description: string, schema: any) => ApiResponseDoc;
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
export declare const generateErrorResponseDoc: (statusCode: number, description: string) => ApiResponseDoc;
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
export declare const generateCrudResponseDocs: (resourceName: string, schema: any) => ApiResponseDoc[];
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
export declare const generatePaginatedResponseDoc: (resourceName: string, itemSchema: any) => ApiResponseDoc;
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
export declare const generateBulkOperationResponseDoc: (operation: string) => ApiResponseDoc;
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
export declare const generateAsyncOperationResponseDoc: (operationName: string) => ApiResponseDoc;
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
export declare const generateRequestBodyDoc: (description: string, schema: any, required: boolean) => ApiRequestBodyDoc;
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
export declare const generateMultipartRequestDoc: (description: string, fields: Record<string, any>) => ApiRequestBodyDoc;
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
export declare const generatePatchRequestDoc: (resourceName: string, schema: any) => ApiRequestBodyDoc;
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
export declare const generateBulkRequestDoc: (operation: string, itemSchema: any) => ApiRequestBodyDoc;
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
export declare const createApiExample: (summary: string, value: any, description?: string) => NetworkApiExample;
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
export declare const generateNetworkCreateExamples: () => Record<string, NetworkApiExample>;
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
export declare const generateErrorExamples: (errorType: string) => Record<string, NetworkApiExample>;
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
export declare const generatePaginatedExample: (resourceName: string, items: any[], total: number) => NetworkApiExample;
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
export declare const createCrudDecorator: (operation: string, resourceName: string, tag: string) => MethodDecorator;
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
export declare const createAuthenticatedEndpointDecorator: (summary: string, description: string, tag: string, securitySchemes?: string[]) => MethodDecorator;
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
export declare const createPaginatedListDecorator: (resourceName: string, tag: string, responseType: Type<any>) => MethodDecorator;
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
export declare const createAsyncOperationDecorator: (operationName: string, tag: string) => MethodDecorator;
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
export declare const generateCompleteApiDocumentation: (config: Partial<ApiDocumentationConfig>) => any;
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
export declare const exportApiDocumentationJson: (documentation: any, pretty?: boolean) => string;
declare const _default: {
    generateNetworkApiInfo: (title: string, description: string, version: string, options?: Partial<OpenApiInfo>) => OpenApiInfo;
    generateNetworkApiServer: (environment: string, baseUrl: string, description: string) => OpenApiServer;
    createNetworkApiTag: (name: string, description: string, docsUrl?: string) => OpenApiTag;
    generateStandardNetworkTags: () => OpenApiTag[];
    createExternalDocsReference: (description: string, url: string) => {
        description: string;
        url: string;
    };
    generateBearerAuthScheme: (description?: string, bearerFormat?: string) => OpenApiSecurityScheme;
    generateApiKeyScheme: (headerName: string, description?: string) => OpenApiSecurityScheme;
    generateOAuth2Scheme: (authorizationUrl: string, tokenUrl: string, scopes: Record<string, string>, description?: string) => OpenApiSecurityScheme;
    generateBasicAuthScheme: (description?: string) => OpenApiSecurityScheme;
    generateNetworkSecuritySchemes: () => Record<string, OpenApiSecurityScheme>;
    generateNetworkOperationDoc: (summary: string, description: string, tags: string[], options?: Partial<ApiEndpointDoc>) => ApiEndpointDoc;
    createNetworkEndpointDecorator: (summary: string, description: string, tag: string) => MethodDecorator;
    generatePathParameterDoc: (name: string, description: string, schema?: any) => ApiParameterDoc;
    generateQueryParameterDoc: (name: string, description: string, required: boolean, schema?: any) => ApiParameterDoc;
    createPaginationParametersDocs: () => ApiParameterDoc[];
    generateFilterParametersDocs: (filterableFields: string[]) => ApiParameterDoc[];
    createHeaderParameterDoc: (name: string, description: string, required: boolean, schema?: any) => ApiParameterDoc;
    generateStandardNetworkHeaders: () => ApiParameterDoc[];
    generateSuccessResponseDoc: (statusCode: number, description: string, schema: any) => ApiResponseDoc;
    generateErrorResponseDoc: (statusCode: number, description: string) => ApiResponseDoc;
    generateCrudResponseDocs: (resourceName: string, schema: any) => ApiResponseDoc[];
    generatePaginatedResponseDoc: (resourceName: string, itemSchema: any) => ApiResponseDoc;
    generateBulkOperationResponseDoc: (operation: string) => ApiResponseDoc;
    generateAsyncOperationResponseDoc: (operationName: string) => ApiResponseDoc;
    generateRequestBodyDoc: (description: string, schema: any, required: boolean) => ApiRequestBodyDoc;
    generateMultipartRequestDoc: (description: string, fields: Record<string, any>) => ApiRequestBodyDoc;
    generatePatchRequestDoc: (resourceName: string, schema: any) => ApiRequestBodyDoc;
    generateBulkRequestDoc: (operation: string, itemSchema: any) => ApiRequestBodyDoc;
    createApiExample: (summary: string, value: any, description?: string) => NetworkApiExample;
    generateNetworkCreateExamples: () => Record<string, NetworkApiExample>;
    generateErrorExamples: (errorType: string) => Record<string, NetworkApiExample>;
    generatePaginatedExample: (resourceName: string, items: any[], total: number) => NetworkApiExample;
    createCrudDecorator: (operation: string, resourceName: string, tag: string) => MethodDecorator;
    createAuthenticatedEndpointDecorator: (summary: string, description: string, tag: string, securitySchemes?: string[]) => MethodDecorator;
    createPaginatedListDecorator: (resourceName: string, tag: string, responseType: Type<any>) => MethodDecorator;
    createAsyncOperationDecorator: (operationName: string, tag: string) => MethodDecorator;
    generateCompleteApiDocumentation: (config: Partial<ApiDocumentationConfig>) => any;
    exportApiDocumentationJson: (documentation: any, pretty?: boolean) => string;
};
export default _default;
//# sourceMappingURL=network-api-documentation-kit.d.ts.map