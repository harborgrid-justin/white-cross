/**
 * LOC: APIDOC123
 * File: /reuse/api-documentation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - API controllers and DTOs
 *   - Swagger configuration modules
 *   - API documentation generators
 */
/**
 * File: /reuse/api-documentation-kit.ts
 * Locator: WC-UTL-APIDOC-001
 * Purpose: Comprehensive API Documentation Utilities - OpenAPI schema builders, Swagger decorators, response documentation
 *
 * Upstream: Independent utility module for API documentation and OpenAPI specifications
 * Downstream: ../backend/*, API controllers, DTOs, Swagger modules, documentation services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, @nestjs/swagger 7.x, OpenAPI 3.0+
 * Exports: 48 utility functions for OpenAPI schema generation, Swagger decorators, API documentation, examples, validation
 *
 * LLM Context: Comprehensive API documentation utilities for implementing production-ready OpenAPI/Swagger documentation in White Cross system.
 * Provides schema builders, decorator factories, response documenters, security scheme helpers, versioning, deprecation markers,
 * pagination documentation, and API client generation helpers. Essential for building well-documented, discoverable healthcare APIs.
 */
import { Type } from '@nestjs/common';
import { ApiPropertyOptions, ApiResponseOptions, ApiOperationOptions, ApiParamOptions, ApiQueryOptions, ApiHeaderOptions, ApiBodyOptions } from '@nestjs/swagger';
interface OpenApiSchemaOptions {
    type: 'object' | 'array' | 'string' | 'number' | 'integer' | 'boolean';
    format?: string;
    description?: string;
    example?: any;
    required?: boolean;
    nullable?: boolean;
    enum?: any[];
    default?: any;
    minimum?: number;
    maximum?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    items?: OpenApiSchemaOptions;
    properties?: Record<string, OpenApiSchemaOptions>;
    additionalProperties?: boolean | OpenApiSchemaOptions;
}
interface ApiResponseSchema {
    statusCode: number;
    description: string;
    type?: Type<any>;
    isArray?: boolean;
    example?: any;
    headers?: Record<string, any>;
}
interface SwaggerSecurityScheme {
    type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
    name?: string;
    in?: 'query' | 'header' | 'cookie';
    scheme?: 'basic' | 'bearer' | 'digest';
    bearerFormat?: string;
    flows?: OAuth2FlowsConfig;
    openIdConnectUrl?: string;
}
interface OAuth2FlowsConfig {
    implicit?: OAuth2Flow;
    password?: OAuth2Flow;
    clientCredentials?: OAuth2Flow;
    authorizationCode?: OAuth2Flow;
}
interface OAuth2Flow {
    authorizationUrl?: string;
    tokenUrl?: string;
    refreshUrl?: string;
    scopes: Record<string, string>;
}
interface ApiExampleConfig {
    name: string;
    summary?: string;
    description?: string;
    value: any;
}
interface ApiDeprecationInfo {
    deprecated: boolean;
    deprecatedSince?: string;
    removalDate?: string;
    alternative?: string;
    reason?: string;
}
interface RateLimitDocumentation {
    limit: number;
    window: string;
    headers: string[];
    description?: string;
}
interface WebhookDocumentation {
    event: string;
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    path: string;
    payloadType: Type<any>;
    description?: string;
}
/**
 * 1. Creates a complete OpenAPI schema object from options.
 *
 * @param {OpenApiSchemaOptions} options - Schema configuration options
 * @returns {Record<string, any>} OpenAPI schema object
 *
 * @example
 * ```typescript
 * const schema = createOpenApiSchema({
 *   type: 'object',
 *   description: 'User object',
 *   properties: {
 *     id: { type: 'integer', example: 1 },
 *     name: { type: 'string', minLength: 1, maxLength: 100 }
 *   }
 * });
 * ```
 */
export declare const createOpenApiSchema: (options: OpenApiSchemaOptions) => Record<string, any>;
/**
 * 2. Creates an OpenAPI schema for a paginated response.
 *
 * @param {Type<any>} itemType - Type of items in the array
 * @param {string} [description] - Description of the paginated response
 * @returns {Record<string, any>} OpenAPI schema for pagination
 *
 * @example
 * ```typescript
 * const schema = createPaginatedSchema(UserDto, 'Paginated list of users');
 * // Results in schema with items array and pagination metadata
 * ```
 */
export declare const createPaginatedSchema: (itemType: Type<any>, description?: string) => Record<string, any>;
/**
 * 3. Creates an OpenAPI schema for error responses.
 *
 * @param {string} [description] - Description of the error
 * @param {boolean} [includeDetails] - Whether to include error details array
 * @returns {Record<string, any>} OpenAPI error schema
 *
 * @example
 * ```typescript
 * const errorSchema = createErrorSchema('Validation failed', true);
 * // Includes statusCode, message, error, and optional details array
 * ```
 */
export declare const createErrorSchema: (description?: string, includeDetails?: boolean) => Record<string, any>;
/**
 * 4. Creates an OpenAPI schema for file upload requests.
 *
 * @param {boolean} [multiple] - Whether multiple files are allowed
 * @param {string[]} [allowedTypes] - Allowed MIME types
 * @returns {Record<string, any>} OpenAPI file upload schema
 *
 * @example
 * ```typescript
 * const uploadSchema = createFileUploadSchema(false, ['image/png', 'image/jpeg']);
 * ```
 */
export declare const createFileUploadSchema: (multiple?: boolean, allowedTypes?: string[]) => Record<string, any>;
/**
 * 5. Creates an OpenAPI reference to a schema component.
 *
 * @param {string} schemaName - Name of the schema in components
 * @returns {Record<string, string>} OpenAPI reference object
 *
 * @example
 * ```typescript
 * const ref = createSchemaRef('UserDto');
 * // Result: { $ref: '#/components/schemas/UserDto' }
 * ```
 */
export declare const createSchemaRef: (schemaName: string) => Record<string, string>;
/**
 * 6. Creates an OpenAPI schema with discriminator for polymorphism.
 *
 * @param {string} discriminatorProperty - Property name for discrimination
 * @param {Record<string, string>} mapping - Mapping of discriminator values to schema names
 * @param {Type<any>} baseType - Base type for the discriminated union
 * @returns {Record<string, any>} OpenAPI schema with discriminator
 *
 * @example
 * ```typescript
 * const schema = createDiscriminatedSchema('type', {
 *   dog: 'DogDto',
 *   cat: 'CatDto'
 * }, AnimalDto);
 * ```
 */
export declare const createDiscriminatedSchema: (discriminatorProperty: string, mapping: Record<string, string>, baseType: Type<any>) => Record<string, any>;
/**
 * 7. Creates an OpenAPI schema with allOf composition.
 *
 * @param {string[]} schemaNames - Names of schemas to combine
 * @param {Record<string, any>} [additionalProperties] - Additional properties to add
 * @returns {Record<string, any>} OpenAPI allOf schema
 *
 * @example
 * ```typescript
 * const schema = createAllOfSchema(['BaseDto', 'TimestampsDto'], {
 *   customField: { type: 'string' }
 * });
 * ```
 */
export declare const createAllOfSchema: (schemaNames: string[], additionalProperties?: Record<string, any>) => Record<string, any>;
/**
 * 8. Creates an OpenAPI schema for enum values with descriptions.
 *
 * @param {any[]} enumValues - Enum values
 * @param {Record<string, string>} [descriptions] - Descriptions for each enum value
 * @param {string} [type] - Enum type (default: 'string')
 * @returns {Record<string, any>} OpenAPI enum schema
 *
 * @example
 * ```typescript
 * const schema = createEnumSchema(
 *   ['active', 'inactive', 'pending'],
 *   { active: 'User is active', inactive: 'User is deactivated' }
 * );
 * ```
 */
export declare const createEnumSchema: (enumValues: any[], descriptions?: Record<string, string>, type?: string) => Record<string, any>;
/**
 * 9. Creates ApiProperty decorator options for class properties.
 *
 * @param {Partial<ApiPropertyOptions>} options - Property configuration
 * @returns {ApiPropertyOptions} Complete ApiProperty options
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @ApiProperty(createPropertyDecorator({
 *     description: 'User email address',
 *     example: 'user@example.com',
 *     format: 'email'
 *   }))
 *   email: string;
 * }
 * ```
 */
export declare const createPropertyDecorator: (options: Partial<ApiPropertyOptions>) => ApiPropertyOptions;
/**
 * 10. Creates ApiResponse decorator options for endpoint responses.
 *
 * @param {ApiResponseSchema} schema - Response schema configuration
 * @returns {ApiResponseOptions} Complete ApiResponse options
 *
 * @example
 * ```typescript
 * @ApiResponse(createResponseDecorator({
 *   statusCode: 200,
 *   description: 'User successfully retrieved',
 *   type: UserDto
 * }))
 * ```
 */
export declare const createResponseDecorator: (schema: ApiResponseSchema) => ApiResponseOptions;
/**
 * 11. Creates ApiOperation decorator options for endpoint documentation.
 *
 * @param {string} summary - Short summary of the operation
 * @param {string} [description] - Detailed description
 * @param {string[]} [tags] - Tags for grouping
 * @returns {ApiOperationOptions} Complete ApiOperation options
 *
 * @example
 * ```typescript
 * @ApiOperation(createOperationDecorator(
 *   'Create new user',
 *   'Creates a new user account with the provided information',
 *   ['Users']
 * ))
 * ```
 */
export declare const createOperationDecorator: (summary: string, description?: string, tags?: string[]) => ApiOperationOptions;
/**
 * 12. Creates ApiParam decorator options for path parameters.
 *
 * @param {string} name - Parameter name
 * @param {string} description - Parameter description
 * @param {any} [type] - Parameter type
 * @param {any} [example] - Example value
 * @returns {ApiParamOptions} Complete ApiParam options
 *
 * @example
 * ```typescript
 * @ApiParam(createParamDecorator('id', 'User unique identifier', String, 'abc123'))
 * ```
 */
export declare const createParamDecorator: (name: string, description: string, type?: any, example?: any) => ApiParamOptions;
/**
 * 13. Creates ApiQuery decorator options for query parameters.
 *
 * @param {string} name - Query parameter name
 * @param {boolean} required - Whether parameter is required
 * @param {string} [description] - Parameter description
 * @param {any} [type] - Parameter type
 * @param {any} [example] - Example value
 * @returns {ApiQueryOptions} Complete ApiQuery options
 *
 * @example
 * ```typescript
 * @ApiQuery(createQueryDecorator('page', false, 'Page number', Number, 1))
 * ```
 */
export declare const createQueryDecorator: (name: string, required?: boolean, description?: string, type?: any, example?: any) => ApiQueryOptions;
/**
 * 14. Creates ApiHeader decorator options for header parameters.
 *
 * @param {string} name - Header name
 * @param {string} description - Header description
 * @param {boolean} [required] - Whether header is required
 * @param {string} [example] - Example value
 * @returns {ApiHeaderOptions} Complete ApiHeader options
 *
 * @example
 * ```typescript
 * @ApiHeader(createHeaderDecorator('X-API-Version', 'API version', false, 'v1'))
 * ```
 */
export declare const createHeaderDecorator: (name: string, description: string, required?: boolean, example?: string) => ApiHeaderOptions;
/**
 * 15. Creates ApiBody decorator options for request body.
 *
 * @param {Type<any>} type - DTO type for the body
 * @param {string} [description] - Body description
 * @param {any} [examples] - Example values
 * @returns {ApiBodyOptions} Complete ApiBody options
 *
 * @example
 * ```typescript
 * @ApiBody(createBodyDecorator(CreateUserDto, 'User creation data'))
 * ```
 */
export declare const createBodyDecorator: (type: Type<any>, description?: string, examples?: any) => ApiBodyOptions;
/**
 * 16. Creates a complete set of CRUD operation decorators.
 *
 * @param {string} resourceName - Name of the resource (e.g., 'User')
 * @param {Type<any>} dto - DTO type for the resource
 * @param {Type<any>} createDto - DTO type for creation
 * @param {Type<any>} updateDto - DTO type for updates
 * @returns {Record<string, ApiOperationOptions>} CRUD operation decorators
 *
 * @example
 * ```typescript
 * const operations = createCrudOperationDecorators('User', UserDto, CreateUserDto, UpdateUserDto);
 * // Returns: { create, findAll, findOne, update, remove }
 * ```
 */
export declare const createCrudOperationDecorators: (resourceName: string, dto: Type<any>, createDto: Type<any>, updateDto: Type<any>) => Record<string, ApiOperationOptions>;
/**
 * 17. Creates standard success response documentation.
 *
 * @param {Type<any>} type - Response DTO type
 * @param {string} description - Response description
 * @param {number} [statusCode] - HTTP status code (default: 200)
 * @returns {ApiResponseOptions} Success response options
 *
 * @example
 * ```typescript
 * @ApiResponse(createSuccessResponseDoc(UserDto, 'User successfully retrieved'))
 * ```
 */
export declare const createSuccessResponseDoc: (type: Type<any>, description: string, statusCode?: number) => ApiResponseOptions;
/**
 * 18. Creates standard error response documentation for common HTTP errors.
 *
 * @param {number} statusCode - HTTP error status code
 * @param {string} [customMessage] - Custom error message
 * @returns {ApiResponseOptions} Error response options
 *
 * @example
 * ```typescript
 * @ApiResponse(createErrorResponseDoc(404, 'User not found'))
 * @ApiResponse(createErrorResponseDoc(400, 'Invalid input data'))
 * ```
 */
export declare const createErrorResponseDoc: (statusCode: number, customMessage?: string) => ApiResponseOptions;
/**
 * 19. Creates documentation for paginated list responses.
 *
 * @param {Type<any>} itemType - Type of items in the list
 * @param {string} description - Response description
 * @returns {ApiResponseOptions} Paginated response options
 *
 * @example
 * ```typescript
 * @ApiResponse(createPaginatedResponseDoc(UserDto, 'Paginated list of users'))
 * ```
 */
export declare const createPaginatedResponseDoc: (itemType: Type<any>, description: string) => ApiResponseOptions;
/**
 * 20. Creates documentation for array responses without pagination.
 *
 * @param {Type<any>} itemType - Type of items in the array
 * @param {string} description - Response description
 * @returns {ApiResponseOptions} Array response options
 *
 * @example
 * ```typescript
 * @ApiResponse(createArrayResponseDoc(TagDto, 'List of all tags'))
 * ```
 */
export declare const createArrayResponseDoc: (itemType: Type<any>, description: string) => ApiResponseOptions;
/**
 * 21. Creates documentation for created resource responses (201).
 *
 * @param {Type<any>} type - Created resource DTO type
 * @param {string} resourceName - Name of the resource
 * @returns {ApiResponseOptions} Created response options
 *
 * @example
 * ```typescript
 * @ApiResponse(createCreatedResponseDoc(UserDto, 'User'))
 * ```
 */
export declare const createCreatedResponseDoc: (type: Type<any>, resourceName: string) => ApiResponseOptions;
/**
 * 22. Creates documentation for no-content responses (204).
 *
 * @param {string} description - Response description
 * @returns {ApiResponseOptions} No content response options
 *
 * @example
 * ```typescript
 * @ApiResponse(createNoContentResponseDoc('User successfully deleted'))
 * ```
 */
export declare const createNoContentResponseDoc: (description: string) => ApiResponseOptions;
/**
 * 23. Creates complete CRUD response documentation set.
 *
 * @param {Type<any>} dto - Resource DTO type
 * @param {string} resourceName - Name of the resource
 * @returns {Record<string, ApiResponseOptions[]>} Complete CRUD response docs
 *
 * @example
 * ```typescript
 * const responses = createCrudResponseDocs(UserDto, 'User');
 * // Apply with: @ApiResponse(...responses.create)
 * ```
 */
export declare const createCrudResponseDocs: (dto: Type<any>, resourceName: string) => Record<string, ApiResponseOptions[]>;
/**
 * 24. Creates documentation for file download responses.
 *
 * @param {string} mimeType - MIME type of the file
 * @param {string} description - Download description
 * @returns {ApiResponseOptions} File download response options
 *
 * @example
 * ```typescript
 * @ApiResponse(createFileDownloadResponseDoc('application/pdf', 'Download report as PDF'))
 * ```
 */
export declare const createFileDownloadResponseDoc: (mimeType: string, description: string) => ApiResponseOptions;
/**
 * 25. Creates documentation for pagination query parameters.
 *
 * @param {number} [defaultLimit] - Default page size
 * @param {number} [maxLimit] - Maximum page size
 * @returns {ApiQueryOptions[]} Array of pagination query parameter docs
 *
 * @example
 * ```typescript
 * createPaginationQueryDocs(20, 100).forEach(doc => @ApiQuery(doc))
 * ```
 */
export declare const createPaginationQueryDocs: (defaultLimit?: number, maxLimit?: number) => ApiQueryOptions[];
/**
 * 26. Creates documentation for search query parameters.
 *
 * @param {string[]} searchableFields - Fields that can be searched
 * @returns {ApiQueryOptions[]} Array of search query parameter docs
 *
 * @example
 * ```typescript
 * createSearchQueryDocs(['name', 'email', 'phone']).forEach(doc => @ApiQuery(doc))
 * ```
 */
export declare const createSearchQueryDocs: (searchableFields: string[]) => ApiQueryOptions[];
/**
 * 27. Creates documentation for filter query parameters.
 *
 * @param {string[]} filterableFields - Fields that can be filtered
 * @returns {ApiQueryOptions[]} Array of filter query parameter docs
 *
 * @example
 * ```typescript
 * createFilterQueryDocs(['status', 'role', 'department']).forEach(doc => @ApiQuery(doc))
 * ```
 */
export declare const createFilterQueryDocs: (filterableFields: string[]) => ApiQueryOptions[];
/**
 * 28. Creates documentation for date range query parameters.
 *
 * @param {string} fieldName - Name of the date field
 * @returns {ApiQueryOptions[]} Array of date range query parameter docs
 *
 * @example
 * ```typescript
 * createDateRangeQueryDocs('createdAt').forEach(doc => @ApiQuery(doc))
 * ```
 */
export declare const createDateRangeQueryDocs: (fieldName: string) => ApiQueryOptions[];
/**
 * 29. Creates documentation for file upload request body.
 *
 * @param {boolean} multiple - Whether multiple files are allowed
 * @param {string[]} [allowedTypes] - Allowed MIME types
 * @param {number} [maxSize] - Maximum file size in bytes
 * @returns {ApiBodyOptions} File upload body documentation
 *
 * @example
 * ```typescript
 * @ApiBody(createFileUploadBodyDoc(false, ['image/png', 'image/jpeg'], 5242880))
 * ```
 */
export declare const createFileUploadBodyDoc: (multiple?: boolean, allowedTypes?: string[], maxSize?: number) => ApiBodyOptions;
/**
 * 30. Creates documentation for multipart form data with mixed fields.
 *
 * @param {Record<string, OpenApiSchemaOptions>} fields - Form fields
 * @param {boolean} [hasFile] - Whether form includes file upload
 * @returns {ApiBodyOptions} Multipart form data documentation
 *
 * @example
 * ```typescript
 * @ApiBody(createMultipartFormDoc({
 *   name: { type: 'string', required: true },
 *   age: { type: 'integer' }
 * }, true))
 * ```
 */
export declare const createMultipartFormDoc: (fields: Record<string, OpenApiSchemaOptions>, hasFile?: boolean) => ApiBodyOptions;
/**
 * 31. Creates security scheme for Bearer JWT authentication.
 *
 * @param {string} [description] - Security scheme description
 * @returns {SwaggerSecurityScheme} Bearer JWT security scheme
 *
 * @example
 * ```typescript
 * const jwtScheme = createBearerAuthScheme('JWT token obtained from /auth/login');
 * ```
 */
export declare const createBearerAuthScheme: (description?: string) => SwaggerSecurityScheme;
/**
 * 32. Creates security scheme for API Key authentication.
 *
 * @param {string} name - Name of the API key header/query parameter
 * @param {'header' | 'query' | 'cookie'} location - Where the API key is sent
 * @param {string} [description] - Security scheme description
 * @returns {SwaggerSecurityScheme} API Key security scheme
 *
 * @example
 * ```typescript
 * const apiKeyScheme = createApiKeyScheme('X-API-Key', 'header', 'API key for authentication');
 * ```
 */
export declare const createApiKeyScheme: (name: string, location: "header" | "query" | "cookie", description?: string) => SwaggerSecurityScheme;
/**
 * 33. Creates security scheme for OAuth2 authentication.
 *
 * @param {OAuth2FlowsConfig} flows - OAuth2 flow configurations
 * @param {string} [description] - Security scheme description
 * @returns {SwaggerSecurityScheme} OAuth2 security scheme
 *
 * @example
 * ```typescript
 * const oauth2Scheme = createOAuth2Scheme({
 *   authorizationCode: {
 *     authorizationUrl: 'https://auth.example.com/oauth/authorize',
 *     tokenUrl: 'https://auth.example.com/oauth/token',
 *     scopes: { 'read:users': 'Read user data', 'write:users': 'Modify user data' }
 *   }
 * });
 * ```
 */
export declare const createOAuth2Scheme: (flows: OAuth2FlowsConfig, description?: string) => SwaggerSecurityScheme;
/**
 * 34. Creates security scheme for Basic authentication.
 *
 * @param {string} [description] - Security scheme description
 * @returns {SwaggerSecurityScheme} Basic auth security scheme
 *
 * @example
 * ```typescript
 * const basicScheme = createBasicAuthScheme('HTTP Basic authentication');
 * ```
 */
export declare const createBasicAuthScheme: (description?: string) => SwaggerSecurityScheme;
/**
 * 35. Creates combined security documentation for endpoints with multiple auth methods.
 *
 * @param {string[]} schemes - Security scheme names
 * @param {Record<string, string[]>} [scopes] - Scopes for each scheme
 * @returns {Record<string, string[]>[]} Security requirements array
 *
 * @example
 * ```typescript
 * const security = createCombinedSecurityDoc(['bearer', 'apiKey']);
 * // Results in: [{ bearer: [] }, { apiKey: [] }]
 * ```
 */
export declare const createCombinedSecurityDoc: (schemes: string[], scopes?: Record<string, string[]>) => Record<string, string[]>[];
/**
 * 36. Creates security documentation for public/unauthenticated endpoints.
 *
 * @returns {Record<string, never>} Empty security object for public endpoints
 *
 * @example
 * ```typescript
 * @ApiSecurity(createPublicEndpointDoc())
 * ```
 */
export declare const createPublicEndpointDoc: () => Record<string, never>;
/**
 * 37. Creates API tag documentation for grouping endpoints.
 *
 * @param {string} name - Tag name
 * @param {string} description - Tag description
 * @param {string} [externalDocsUrl] - URL to external documentation
 * @returns {Record<string, any>} Tag documentation object
 *
 * @example
 * ```typescript
 * const userTag = createApiTag('Users', 'User management endpoints', 'https://docs.example.com/users');
 * ```
 */
export declare const createApiTag: (name: string, description: string, externalDocsUrl?: string) => Record<string, any>;
/**
 * 38. Creates deprecation documentation for endpoints.
 *
 * @param {ApiDeprecationInfo} info - Deprecation information
 * @returns {Record<string, any>} Deprecation documentation
 *
 * @example
 * ```typescript
 * const deprecation = createDeprecationDoc({
 *   deprecated: true,
 *   deprecatedSince: '2024-01-01',
 *   removalDate: '2024-06-01',
 *   alternative: 'Use /api/v2/users instead',
 *   reason: 'Moving to new API version'
 * });
 * ```
 */
export declare const createDeprecationDoc: (info: ApiDeprecationInfo) => Record<string, any>;
/**
 * 39. Creates API versioning documentation in operation description.
 *
 * @param {string} version - API version (e.g., 'v1', 'v2')
 * @param {string} description - Operation description
 * @returns {string} Versioned operation description
 *
 * @example
 * ```typescript
 * const desc = createVersionedOperationDoc('v2', 'Get user details');
 * // Result: "[API v2] Get user details"
 * ```
 */
export declare const createVersionedOperationDoc: (version: string, description: string) => string;
/**
 * 40. Creates rate limit documentation headers.
 *
 * @param {RateLimitDocumentation} config - Rate limit configuration
 * @returns {Record<string, any>} Rate limit header documentation
 *
 * @example
 * ```typescript
 * const rateLimitHeaders = createRateLimitDoc({
 *   limit: 100,
 *   window: '1 hour',
 *   headers: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset']
 * });
 * ```
 */
export declare const createRateLimitDoc: (config: RateLimitDocumentation) => Record<string, any>;
/**
 * 41. Creates custom metadata extension fields (x-*).
 *
 * @param {Record<string, any>} metadata - Custom metadata key-value pairs
 * @returns {Record<string, any>} Metadata with x- prefix
 *
 * @example
 * ```typescript
 * const customMeta = createCustomMetadata({
 *   'internal-only': true,
 *   'rate-limit-tier': 'premium',
 *   'cache-duration': 300
 * });
 * // Result: { 'x-internal-only': true, 'x-rate-limit-tier': 'premium', ... }
 * ```
 */
export declare const createCustomMetadata: (metadata: Record<string, any>) => Record<string, any>;
/**
 * 42. Creates external documentation reference.
 *
 * @param {string} url - URL to external documentation
 * @param {string} [description] - Description of external docs
 * @returns {Record<string, string>} External docs object
 *
 * @example
 * ```typescript
 * const externalDocs = createExternalDocsRef(
 *   'https://docs.example.com/api/users',
 *   'Comprehensive user API documentation'
 * );
 * ```
 */
export declare const createExternalDocsRef: (url: string, description?: string) => Record<string, string>;
/**
 * 43. Creates multiple examples for a request/response.
 *
 * @param {ApiExampleConfig[]} examples - Array of example configurations
 * @returns {Record<string, any>} Examples object for OpenAPI
 *
 * @example
 * ```typescript
 * const examples = createMultipleExamples([
 *   { name: 'success', summary: 'Successful response', value: { id: 1, name: 'John' } },
 *   { name: 'error', summary: 'Error response', value: { error: 'Not found' } }
 * ]);
 * ```
 */
export declare const createMultipleExamples: (examples: ApiExampleConfig[]) => Record<string, any>;
/**
 * 44. Generates example value based on OpenAPI schema type.
 *
 * @param {OpenApiSchemaOptions} schema - OpenAPI schema
 * @returns {any} Generated example value
 *
 * @example
 * ```typescript
 * const example = generateExampleFromSchema({ type: 'string', format: 'email' });
 * // Result: 'user@example.com'
 * ```
 */
export declare const generateExampleFromSchema: (schema: OpenApiSchemaOptions) => any;
/**
 * 45. Creates validation schema documentation with constraints.
 *
 * @param {Record<string, any>} validationRules - Validation rules object
 * @returns {string} Formatted validation documentation
 *
 * @example
 * ```typescript
 * const validationDoc = createValidationDoc({
 *   minLength: 3,
 *   maxLength: 50,
 *   pattern: '^[a-zA-Z0-9]+$'
 * });
 * // Result: "- Minimum length: 3\n- Maximum length: 50\n- Pattern: ^[a-zA-Z0-9]+$"
 * ```
 */
export declare const createValidationDoc: (validationRules: Record<string, any>) => string;
/**
 * 46. Creates webhook endpoint documentation.
 *
 * @param {WebhookDocumentation} webhook - Webhook configuration
 * @returns {Record<string, any>} Webhook documentation object
 *
 * @example
 * ```typescript
 * const webhookDoc = createWebhookDoc({
 *   event: 'user.created',
 *   method: 'POST',
 *   path: '/webhooks/user-created',
 *   payloadType: UserCreatedEventDto,
 *   description: 'Triggered when a new user is created'
 * });
 * ```
 */
export declare const createWebhookDoc: (webhook: WebhookDocumentation) => Record<string, any>;
/**
 * 47. Creates schema for API health check endpoint.
 *
 * @returns {Record<string, any>} Health check schema
 *
 * @example
 * ```typescript
 * @ApiResponse({ status: 200, schema: createHealthCheckSchema() })
 * ```
 */
export declare const createHealthCheckSchema: () => Record<string, any>;
/**
 * 48. Creates documentation for API client generation hints.
 *
 * @param {string} clientLanguage - Target client language (typescript, python, java, etc.)
 * @param {Record<string, any>} hints - Client generation hints
 * @returns {Record<string, any>} Client generation metadata
 *
 * @example
 * ```typescript
 * const clientHints = createClientGenerationHints('typescript', {
 *   packageName: '@myorg/api-client',
 *   outputPath: './src/generated',
 *   generateInterfaces: true
 * });
 * ```
 */
export declare const createClientGenerationHints: (clientLanguage: string, hints: Record<string, any>) => Record<string, any>;
declare const _default: {
    createOpenApiSchema: (options: OpenApiSchemaOptions) => Record<string, any>;
    createPaginatedSchema: (itemType: Type<any>, description?: string) => Record<string, any>;
    createErrorSchema: (description?: string, includeDetails?: boolean) => Record<string, any>;
    createFileUploadSchema: (multiple?: boolean, allowedTypes?: string[]) => Record<string, any>;
    createSchemaRef: (schemaName: string) => Record<string, string>;
    createDiscriminatedSchema: (discriminatorProperty: string, mapping: Record<string, string>, baseType: Type<any>) => Record<string, any>;
    createAllOfSchema: (schemaNames: string[], additionalProperties?: Record<string, any>) => Record<string, any>;
    createEnumSchema: (enumValues: any[], descriptions?: Record<string, string>, type?: string) => Record<string, any>;
    createPropertyDecorator: (options: Partial<ApiPropertyOptions>) => ApiPropertyOptions;
    createResponseDecorator: (schema: ApiResponseSchema) => ApiResponseOptions;
    createOperationDecorator: (summary: string, description?: string, tags?: string[]) => ApiOperationOptions;
    createParamDecorator: (name: string, description: string, type?: any, example?: any) => ApiParamOptions;
    createQueryDecorator: (name: string, required?: boolean, description?: string, type?: any, example?: any) => ApiQueryOptions;
    createHeaderDecorator: (name: string, description: string, required?: boolean, example?: string) => ApiHeaderOptions;
    createBodyDecorator: (type: Type<any>, description?: string, examples?: any) => ApiBodyOptions;
    createCrudOperationDecorators: (resourceName: string, dto: Type<any>, createDto: Type<any>, updateDto: Type<any>) => Record<string, ApiOperationOptions>;
    createSuccessResponseDoc: (type: Type<any>, description: string, statusCode?: number) => ApiResponseOptions;
    createErrorResponseDoc: (statusCode: number, customMessage?: string) => ApiResponseOptions;
    createPaginatedResponseDoc: (itemType: Type<any>, description: string) => ApiResponseOptions;
    createArrayResponseDoc: (itemType: Type<any>, description: string) => ApiResponseOptions;
    createCreatedResponseDoc: (type: Type<any>, resourceName: string) => ApiResponseOptions;
    createNoContentResponseDoc: (description: string) => ApiResponseOptions;
    createCrudResponseDocs: (dto: Type<any>, resourceName: string) => Record<string, ApiResponseOptions[]>;
    createFileDownloadResponseDoc: (mimeType: string, description: string) => ApiResponseOptions;
    createPaginationQueryDocs: (defaultLimit?: number, maxLimit?: number) => ApiQueryOptions[];
    createSearchQueryDocs: (searchableFields: string[]) => ApiQueryOptions[];
    createFilterQueryDocs: (filterableFields: string[]) => ApiQueryOptions[];
    createDateRangeQueryDocs: (fieldName: string) => ApiQueryOptions[];
    createFileUploadBodyDoc: (multiple?: boolean, allowedTypes?: string[], maxSize?: number) => ApiBodyOptions;
    createMultipartFormDoc: (fields: Record<string, OpenApiSchemaOptions>, hasFile?: boolean) => ApiBodyOptions;
    createBearerAuthScheme: (description?: string) => SwaggerSecurityScheme;
    createApiKeyScheme: (name: string, location: "header" | "query" | "cookie", description?: string) => SwaggerSecurityScheme;
    createOAuth2Scheme: (flows: OAuth2FlowsConfig, description?: string) => SwaggerSecurityScheme;
    createBasicAuthScheme: (description?: string) => SwaggerSecurityScheme;
    createCombinedSecurityDoc: (schemes: string[], scopes?: Record<string, string[]>) => Record<string, string[]>[];
    createPublicEndpointDoc: () => Record<string, never>;
    createApiTag: (name: string, description: string, externalDocsUrl?: string) => Record<string, any>;
    createDeprecationDoc: (info: ApiDeprecationInfo) => Record<string, any>;
    createVersionedOperationDoc: (version: string, description: string) => string;
    createRateLimitDoc: (config: RateLimitDocumentation) => Record<string, any>;
    createCustomMetadata: (metadata: Record<string, any>) => Record<string, any>;
    createExternalDocsRef: (url: string, description?: string) => Record<string, string>;
    createMultipleExamples: (examples: ApiExampleConfig[]) => Record<string, any>;
    generateExampleFromSchema: (schema: OpenApiSchemaOptions) => any;
    createValidationDoc: (validationRules: Record<string, any>) => string;
    createWebhookDoc: (webhook: WebhookDocumentation) => Record<string, any>;
    createHealthCheckSchema: () => Record<string, any>;
    createClientGenerationHints: (clientLanguage: string, hints: Record<string, any>) => Record<string, any>;
};
export default _default;
//# sourceMappingURL=api-documentation-kit.d.ts.map