/**
 * LOC: SWGR1234567
 * File: /reuse/swagger-docs-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - API controllers and services
 *   - NestJS Swagger configuration
 *   - OpenAPI documentation generators
 */
/**
 * File: /reuse/swagger-docs-kit.ts
 * Locator: WC-UTL-SWGR-001
 * Purpose: Comprehensive Swagger/OpenAPI Documentation Utilities - Schema generators, response docs, security schemes
 *
 * Upstream: Independent utility module for API documentation
 * Downstream: ../backend/*, API controllers, Swagger configuration, documentation generators
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/swagger, OpenAPI 3.0+
 * Exports: 45 utility functions for Swagger/OpenAPI documentation, schema generation, security definitions
 *
 * LLM Context: Comprehensive Swagger/OpenAPI documentation utilities for White Cross healthcare system.
 * Provides schema generators, response documentation helpers, security scheme builders, API versioning,
 * custom decorators, tag organization, error schemas, pagination docs, file upload specs, webhook docs,
 * OAuth flows, and example generators. Essential for maintaining comprehensive API documentation.
 */
interface SwaggerSchemaOptions {
    type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
    description?: string;
    example?: any;
    required?: boolean;
    format?: string;
    enum?: any[];
    pattern?: string;
    minimum?: number;
    maximum?: number;
    minLength?: number;
    maxLength?: number;
    items?: any;
    properties?: Record<string, any>;
    nullable?: boolean;
    deprecated?: boolean;
}
interface SwaggerResponseOptions {
    status: number;
    description: string;
    schema?: any;
    example?: any;
    headers?: Record<string, any>;
    isArray?: boolean;
}
interface SwaggerSecurityScheme {
    type: 'http' | 'apiKey' | 'oauth2' | 'openIdConnect';
    scheme?: string;
    bearerFormat?: string;
    in?: 'header' | 'query' | 'cookie';
    name?: string;
    flows?: any;
    openIdConnectUrl?: string;
    description?: string;
}
interface SwaggerTagOptions {
    name: string;
    description: string;
    externalDocs?: {
        description: string;
        url: string;
    };
}
interface SwaggerPaginationSchema {
    pageParam: string;
    limitParam: string;
    totalParam: string;
    dataParam: string;
    maxLimit?: number;
    defaultLimit?: number;
}
interface SwaggerFileUploadOptions {
    fieldName: string;
    maxSize?: number;
    allowedMimeTypes?: string[];
    required?: boolean;
    multiple?: boolean;
    description?: string;
}
interface SwaggerWebhookOptions {
    eventType: string;
    description: string;
    payloadSchema: any;
    signatureHeader?: string;
    retryPolicy?: any;
}
interface SwaggerOAuthFlow {
    authorizationUrl?: string;
    tokenUrl?: string;
    refreshUrl?: string;
    scopes: Record<string, string>;
}
interface SwaggerExampleOptions {
    summary?: string;
    description?: string;
    value: any;
    externalValue?: string;
}
interface SwaggerParameterOptions {
    name: string;
    in: 'path' | 'query' | 'header' | 'cookie';
    description?: string;
    required?: boolean;
    schema: any;
    example?: any;
    deprecated?: boolean;
}
interface SwaggerVersionConfig {
    version: string;
    title: string;
    description: string;
    basePath?: string;
    deprecated?: boolean;
}
/**
 * Creates a comprehensive OpenAPI schema definition with validation rules.
 *
 * @param {SwaggerSchemaOptions} options - Schema configuration options
 * @returns {Record<string, any>} OpenAPI schema object
 *
 * @example
 * ```typescript
 * const userSchema = createSwaggerSchema({
 *   type: 'object',
 *   description: 'User entity',
 *   required: true,
 *   properties: {
 *     id: { type: 'string', format: 'uuid' },
 *     email: { type: 'string', format: 'email' }
 *   }
 * });
 * ```
 */
export declare const createSwaggerSchema: (options: SwaggerSchemaOptions) => Record<string, any>;
/**
 * Generates an array schema with item type specification.
 *
 * @param {Record<string, any>} itemSchema - Schema for array items
 * @param {string} [description] - Array description
 * @param {number} [minItems] - Minimum array length
 * @param {number} [maxItems] - Maximum array length
 * @returns {Record<string, any>} Array schema object
 *
 * @example
 * ```typescript
 * const userListSchema = createArraySchema(
 *   { type: 'object', properties: { name: { type: 'string' } } },
 *   'List of users',
 *   1,
 *   100
 * );
 * ```
 */
export declare const createArraySchema: (itemSchema: Record<string, any>, description?: string, minItems?: number, maxItems?: number) => Record<string, any>;
/**
 * Creates an enum schema with allowed values and descriptions.
 *
 * @param {any[]} values - Allowed enum values
 * @param {string} type - Data type of enum values
 * @param {string} [description] - Enum description
 * @returns {Record<string, any>} Enum schema object
 *
 * @example
 * ```typescript
 * const statusEnum = createEnumSchema(
 *   ['active', 'inactive', 'pending'],
 *   'string',
 *   'User account status'
 * );
 * ```
 */
export declare const createEnumSchema: (values: any[], type: string, description?: string) => Record<string, any>;
/**
 * Generates a reference schema for reusable components.
 *
 * @param {string} componentName - Name of the component to reference
 * @param {boolean} [isArray=false] - Whether to return array of references
 * @returns {Record<string, any>} Reference schema object
 *
 * @example
 * ```typescript
 * const userRef = createReferenceSchema('User');
 * const usersArrayRef = createReferenceSchema('User', true);
 * ```
 */
export declare const createReferenceSchema: (componentName: string, isArray?: boolean) => Record<string, any>;
/**
 * Creates a discriminator schema for polymorphic types.
 *
 * @param {string} propertyName - Property used for discrimination
 * @param {Record<string, string>} mapping - Mapping of values to schemas
 * @returns {Record<string, any>} Discriminator configuration
 *
 * @example
 * ```typescript
 * const discriminator = createDiscriminatorSchema('type', {
 *   'patient': '#/components/schemas/Patient',
 *   'provider': '#/components/schemas/Provider'
 * });
 * ```
 */
export declare const createDiscriminatorSchema: (propertyName: string, mapping: Record<string, string>) => Record<string, any>;
/**
 * Generates a oneOf schema for union types.
 *
 * @param {Record<string, any>[]} schemas - Array of possible schemas
 * @param {string} [description] - Schema description
 * @returns {Record<string, any>} OneOf schema object
 *
 * @example
 * ```typescript
 * const paymentMethod = createOneOfSchema([
 *   { $ref: '#/components/schemas/CreditCard' },
 *   { $ref: '#/components/schemas/BankAccount' }
 * ], 'Payment method options');
 * ```
 */
export declare const createOneOfSchema: (schemas: Record<string, any>[], description?: string) => Record<string, any>;
/**
 * Creates an allOf schema for composition and inheritance.
 *
 * @param {Record<string, any>[]} schemas - Array of schemas to combine
 * @param {string} [description] - Schema description
 * @returns {Record<string, any>} AllOf schema object
 *
 * @example
 * ```typescript
 * const extendedUser = createAllOfSchema([
 *   { $ref: '#/components/schemas/BaseUser' },
 *   { type: 'object', properties: { role: { type: 'string' } } }
 * ], 'User with role');
 * ```
 */
export declare const createAllOfSchema: (schemas: Record<string, any>[], description?: string) => Record<string, any>;
/**
 * Creates a standardized API response schema with metadata.
 *
 * @param {SwaggerResponseOptions} options - Response configuration
 * @returns {Record<string, any>} Response schema object
 *
 * @example
 * ```typescript
 * const successResponse = createResponseSchema({
 *   status: 200,
 *   description: 'User retrieved successfully',
 *   schema: { $ref: '#/components/schemas/User' },
 *   example: { id: '123', name: 'John Doe' }
 * });
 * ```
 */
export declare const createResponseSchema: (options: SwaggerResponseOptions) => Record<string, any>;
/**
 * Generates multiple response schemas for different status codes.
 *
 * @param {SwaggerResponseOptions[]} responses - Array of response configurations
 * @returns {Record<string, any>} Multiple responses object
 *
 * @example
 * ```typescript
 * const responses = createMultipleResponses([
 *   { status: 200, description: 'Success', schema: userSchema },
 *   { status: 404, description: 'Not found', schema: errorSchema }
 * ]);
 * ```
 */
export declare const createMultipleResponses: (responses: SwaggerResponseOptions[]) => Record<string, any>;
/**
 * Creates a paginated response schema wrapper.
 *
 * @param {Record<string, any>} itemSchema - Schema for individual items
 * @param {SwaggerPaginationSchema} [paginationConfig] - Pagination configuration
 * @returns {Record<string, any>} Paginated response schema
 *
 * @example
 * ```typescript
 * const paginatedUsers = createPaginatedResponse(
 *   { $ref: '#/components/schemas/User' },
 *   { pageParam: 'page', limitParam: 'limit', totalParam: 'total', dataParam: 'data' }
 * );
 * ```
 */
export declare const createPaginatedResponse: (itemSchema: Record<string, any>, paginationConfig?: SwaggerPaginationSchema) => Record<string, any>;
/**
 * Creates a response schema with HATEOAS links.
 *
 * @param {Record<string, any>} dataSchema - Schema for response data
 * @param {string[]} [linkRels] - Link relation types to include
 * @returns {Record<string, any>} Response schema with links
 *
 * @example
 * ```typescript
 * const hateoasResponse = createHateoasResponse(
 *   { $ref: '#/components/schemas/User' },
 *   ['self', 'edit', 'delete']
 * );
 * ```
 */
export declare const createHateoasResponse: (dataSchema: Record<string, any>, linkRels?: string[]) => Record<string, any>;
/**
 * Creates a standardized error response schema.
 *
 * @param {number} statusCode - HTTP status code
 * @param {string} [description] - Error description
 * @returns {Record<string, any>} Error response schema
 *
 * @example
 * ```typescript
 * const notFoundError = createErrorSchema(404, 'Resource not found');
 * ```
 */
export declare const createErrorSchema: (statusCode: number, description?: string) => Record<string, any>;
/**
 * Creates a validation error response schema with field-level errors.
 *
 * @returns {Record<string, any>} Validation error schema
 *
 * @example
 * ```typescript
 * const validationError = createValidationErrorSchema();
 * ```
 */
export declare const createValidationErrorSchema: () => Record<string, any>;
/**
 * Creates a comprehensive set of common error responses.
 *
 * @returns {Record<string, any>} Common error responses object
 *
 * @example
 * ```typescript
 * const commonErrors = createCommonErrorResponses();
 * // Use in endpoint: @ApiResponses(commonErrors)
 * ```
 */
export declare const createCommonErrorResponses: () => Record<string, any>;
/**
 * Creates a request body schema with examples.
 *
 * @param {Record<string, any>} schema - Body schema
 * @param {any} example - Example value
 * @param {string} [description] - Body description
 * @param {boolean} [required=true] - Whether body is required
 * @returns {Record<string, any>} Request body configuration
 *
 * @example
 * ```typescript
 * const createUserBody = createRequestBody(
 *   userSchema,
 *   { name: 'John', email: 'john@example.com' },
 *   'User creation data',
 *   true
 * );
 * ```
 */
export declare const createRequestBody: (schema: Record<string, any>, example: any, description?: string, required?: boolean) => Record<string, any>;
/**
 * Creates a request body with multiple content types.
 *
 * @param {Record<string, { schema: any; example?: any }>} contentTypes - Content type configurations
 * @param {string} [description] - Body description
 * @param {boolean} [required=true] - Whether body is required
 * @returns {Record<string, any>} Multi-content request body
 *
 * @example
 * ```typescript
 * const multiTypeBody = createMultiContentRequestBody({
 *   'application/json': { schema: jsonSchema, example: jsonExample },
 *   'application/xml': { schema: xmlSchema, example: xmlExample }
 * }, 'User data in multiple formats');
 * ```
 */
export declare const createMultiContentRequestBody: (contentTypes: Record<string, {
    schema: any;
    example?: any;
}>, description?: string, required?: boolean) => Record<string, any>;
/**
 * Creates multiple named examples for a request body.
 *
 * @param {Record<string, any>} schema - Body schema
 * @param {Record<string, SwaggerExampleOptions>} examples - Named examples
 * @param {string} [description] - Body description
 * @returns {Record<string, any>} Request body with multiple examples
 *
 * @example
 * ```typescript
 * const bodyWithExamples = createRequestBodyWithExamples(
 *   userSchema,
 *   {
 *     'basicUser': { summary: 'Basic user', value: { name: 'John' } },
 *     'adminUser': { summary: 'Admin user', value: { name: 'Admin', role: 'admin' } }
 *   }
 * );
 * ```
 */
export declare const createRequestBodyWithExamples: (schema: Record<string, any>, examples: Record<string, SwaggerExampleOptions>, description?: string) => Record<string, any>;
/**
 * Creates a Bearer token authentication security scheme.
 *
 * @param {string} [format='JWT'] - Token format
 * @param {string} [description] - Scheme description
 * @returns {SwaggerSecurityScheme} Bearer auth scheme
 *
 * @example
 * ```typescript
 * const bearerAuth = createBearerAuth('JWT', 'JWT authentication token');
 * ```
 */
export declare const createBearerAuth: (format?: string, description?: string) => SwaggerSecurityScheme;
/**
 * Creates an API key security scheme.
 *
 * @param {string} name - Header/query parameter name
 * @param {'header' | 'query' | 'cookie'} location - Where the API key is sent
 * @param {string} [description] - Scheme description
 * @returns {SwaggerSecurityScheme} API key scheme
 *
 * @example
 * ```typescript
 * const apiKeyAuth = createApiKeyAuth('X-API-Key', 'header', 'API key in header');
 * ```
 */
export declare const createApiKeyAuth: (name: string, location: "header" | "query" | "cookie", description?: string) => SwaggerSecurityScheme;
/**
 * Creates an OAuth2 security scheme with multiple flows.
 *
 * @param {Record<string, SwaggerOAuthFlow>} flows - OAuth flow configurations
 * @param {string} [description] - Scheme description
 * @returns {SwaggerSecurityScheme} OAuth2 scheme
 *
 * @example
 * ```typescript
 * const oauth = createOAuth2Scheme({
 *   authorizationCode: {
 *     authorizationUrl: 'https://auth.example.com/oauth/authorize',
 *     tokenUrl: 'https://auth.example.com/oauth/token',
 *     scopes: { 'read:users': 'Read user data', 'write:users': 'Modify users' }
 *   }
 * });
 * ```
 */
export declare const createOAuth2Scheme: (flows: Record<string, SwaggerOAuthFlow>, description?: string) => SwaggerSecurityScheme;
/**
 * Creates an OpenID Connect security scheme.
 *
 * @param {string} openIdConnectUrl - OpenID Connect discovery URL
 * @param {string} [description] - Scheme description
 * @returns {SwaggerSecurityScheme} OpenID Connect scheme
 *
 * @example
 * ```typescript
 * const oidc = createOpenIdConnectScheme(
 *   'https://auth.example.com/.well-known/openid-configuration'
 * );
 * ```
 */
export declare const createOpenIdConnectScheme: (openIdConnectUrl: string, description?: string) => SwaggerSecurityScheme;
/**
 * Creates Basic HTTP authentication scheme.
 *
 * @param {string} [description] - Scheme description
 * @returns {SwaggerSecurityScheme} Basic auth scheme
 *
 * @example
 * ```typescript
 * const basicAuth = createBasicAuth('Basic HTTP authentication');
 * ```
 */
export declare const createBasicAuth: (description?: string) => SwaggerSecurityScheme;
/**
 * Creates version-specific API documentation configuration.
 *
 * @param {SwaggerVersionConfig} config - Version configuration
 * @returns {Record<string, any>} Version documentation config
 *
 * @example
 * ```typescript
 * const v1Config = createVersionedApiDoc({
 *   version: '1.0',
 *   title: 'White Cross API v1',
 *   description: 'Legacy API version',
 *   basePath: '/api/v1',
 *   deprecated: true
 * });
 * ```
 */
export declare const createVersionedApiDoc: (config: SwaggerVersionConfig) => Record<string, any>;
/**
 * Creates a version deprecation notice decorator configuration.
 *
 * @param {string} currentVersion - Current API version
 * @param {string} sunsetDate - Deprecation sunset date
 * @param {string} [migrationGuideUrl] - URL to migration guide
 * @returns {Record<string, any>} Deprecation configuration
 *
 * @example
 * ```typescript
 * const deprecation = createDeprecationNotice('1.0', '2025-12-31', 'https://docs.example.com/migration');
 * ```
 */
export declare const createDeprecationNotice: (currentVersion: string, sunsetDate: string, migrationGuideUrl?: string) => Record<string, any>;
/**
 * Creates a Swagger tag with documentation.
 *
 * @param {SwaggerTagOptions} options - Tag configuration
 * @returns {Record<string, any>} Tag object
 *
 * @example
 * ```typescript
 * const usersTag = createSwaggerTag({
 *   name: 'Users',
 *   description: 'User management endpoints',
 *   externalDocs: {
 *     description: 'User API documentation',
 *     url: 'https://docs.example.com/users'
 *   }
 * });
 * ```
 */
export declare const createSwaggerTag: (options: SwaggerTagOptions) => Record<string, any>;
/**
 * Creates multiple related tags with a common prefix.
 *
 * @param {string} prefix - Tag prefix
 * @param {Array<{ name: string; description: string }>} tags - Tag configurations
 * @returns {Record<string, any>[]} Array of tag objects
 *
 * @example
 * ```typescript
 * const authTags = createTagGroup('Auth', [
 *   { name: 'Login', description: 'Login endpoints' },
 *   { name: 'Registration', description: 'User registration' }
 * ]);
 * // Results in tags: 'Auth - Login', 'Auth - Registration'
 * ```
 */
export declare const createTagGroup: (prefix: string, tags: Array<{
    name: string;
    description: string;
}>) => Record<string, any>[];
/**
 * Creates tags organized by resource type.
 *
 * @param {string[]} resources - Resource names
 * @param {string} [suffix='Management'] - Suffix for tag names
 * @returns {Record<string, any>[]} Resource tags
 *
 * @example
 * ```typescript
 * const tags = createResourceTags(['Users', 'Patients', 'Appointments']);
 * // Results in: 'Users Management', 'Patients Management', 'Appointments Management'
 * ```
 */
export declare const createResourceTags: (resources: string[], suffix?: string) => Record<string, any>[];
/**
 * Creates query parameters for offset-based pagination.
 *
 * @param {number} [defaultLimit=20] - Default items per page
 * @param {number} [maxLimit=100] - Maximum items per page
 * @returns {SwaggerParameterOptions[]} Pagination parameters
 *
 * @example
 * ```typescript
 * const paginationParams = createPaginationParameters(25, 100);
 * ```
 */
export declare const createPaginationParameters: (defaultLimit?: number, maxLimit?: number) => SwaggerParameterOptions[];
/**
 * Creates cursor-based pagination parameters.
 *
 * @param {number} [defaultLimit=20] - Default items per page
 * @returns {SwaggerParameterOptions[]} Cursor pagination parameters
 *
 * @example
 * ```typescript
 * const cursorParams = createCursorPaginationParameters(50);
 * ```
 */
export declare const createCursorPaginationParameters: (defaultLimit?: number) => SwaggerParameterOptions[];
/**
 * Creates file upload request body schema.
 *
 * @param {SwaggerFileUploadOptions} options - File upload configuration
 * @returns {Record<string, any>} File upload schema
 *
 * @example
 * ```typescript
 * const uploadSchema = createFileUploadSchema({
 *   fieldName: 'file',
 *   maxSize: 5242880, // 5MB
 *   allowedMimeTypes: ['image/png', 'image/jpeg'],
 *   required: true,
 *   description: 'Profile picture upload'
 * });
 * ```
 */
export declare const createFileUploadSchema: (options: SwaggerFileUploadOptions) => Record<string, any>;
/**
 * Creates a multi-field file upload schema with metadata.
 *
 * @param {Record<string, SwaggerFileUploadOptions>} fields - Upload field configurations
 * @param {Record<string, any>} [metadata] - Additional metadata fields
 * @returns {Record<string, any>} Multi-field upload schema
 *
 * @example
 * ```typescript
 * const multiUpload = createMultiFieldFileUpload({
 *   avatar: { fieldName: 'avatar', maxSize: 2097152, allowedMimeTypes: ['image/png'] },
 *   document: { fieldName: 'document', maxSize: 10485760, allowedMimeTypes: ['application/pdf'] }
 * }, {
 *   title: { type: 'string', description: 'Document title' }
 * });
 * ```
 */
export declare const createMultiFieldFileUpload: (fields: Record<string, SwaggerFileUploadOptions>, metadata?: Record<string, any>) => Record<string, any>;
/**
 * Creates a webhook callback schema.
 *
 * @param {SwaggerWebhookOptions} options - Webhook configuration
 * @returns {Record<string, any>} Webhook callback schema
 *
 * @example
 * ```typescript
 * const webhook = createWebhookSchema({
 *   eventType: 'user.created',
 *   description: 'Triggered when a new user is created',
 *   payloadSchema: { $ref: '#/components/schemas/User' },
 *   signatureHeader: 'X-Webhook-Signature'
 * });
 * ```
 */
export declare const createWebhookSchema: (options: SwaggerWebhookOptions) => Record<string, any>;
/**
 * Creates multiple webhook definitions.
 *
 * @param {SwaggerWebhookOptions[]} webhooks - Array of webhook configurations
 * @returns {Record<string, any>} Webhooks object
 *
 * @example
 * ```typescript
 * const webhooks = createWebhooksDefinition([
 *   { eventType: 'user.created', description: 'User created', payloadSchema: userSchema },
 *   { eventType: 'user.updated', description: 'User updated', payloadSchema: userSchema }
 * ]);
 * ```
 */
export declare const createWebhooksDefinition: (webhooks: SwaggerWebhookOptions[]) => Record<string, any>;
/**
 * Generates example values based on schema type and format.
 *
 * @param {Record<string, any>} schema - OpenAPI schema
 * @returns {any} Generated example value
 *
 * @example
 * ```typescript
 * const example = generateExampleFromSchema({
 *   type: 'object',
 *   properties: {
 *     name: { type: 'string' },
 *     age: { type: 'integer' }
 *   }
 * });
 * // Result: { name: 'string', age: 0 }
 * ```
 */
export declare const generateExampleFromSchema: (schema: Record<string, any>) => any;
/**
 * Creates realistic example data for common data types.
 *
 * @param {string} dataType - Type of data to generate
 * @param {Record<string, any>} [options] - Generation options
 * @returns {any} Realistic example data
 *
 * @example
 * ```typescript
 * const userExample = createRealisticExample('user', { includeId: true });
 * const addressExample = createRealisticExample('address');
 * ```
 */
export declare const createRealisticExample: (dataType: string, options?: Record<string, any>) => any;
/**
 * Creates a path parameter definition.
 *
 * @param {string} name - Parameter name
 * @param {string} description - Parameter description
 * @param {string} [type='string'] - Parameter type
 * @param {string} [format] - Parameter format
 * @returns {SwaggerParameterOptions} Path parameter
 *
 * @example
 * ```typescript
 * const idParam = createPathParameter('id', 'Resource identifier', 'string', 'uuid');
 * ```
 */
export declare const createPathParameter: (name: string, description: string, type?: string, format?: string) => SwaggerParameterOptions;
/**
 * Creates query parameter definitions with validation.
 *
 * @param {string} name - Parameter name
 * @param {string} description - Parameter description
 * @param {Record<string, any>} schema - Parameter schema
 * @param {boolean} [required=false] - Whether parameter is required
 * @returns {SwaggerParameterOptions} Query parameter
 *
 * @example
 * ```typescript
 * const filterParam = createQueryParameter(
 *   'status',
 *   'Filter by status',
 *   { type: 'string', enum: ['active', 'inactive'] },
 *   false
 * );
 * ```
 */
export declare const createQueryParameter: (name: string, description: string, schema: Record<string, any>, required?: boolean) => SwaggerParameterOptions;
/**
 * Creates header parameter definition.
 *
 * @param {string} name - Header name
 * @param {string} description - Header description
 * @param {boolean} [required=false] - Whether header is required
 * @returns {SwaggerParameterOptions} Header parameter
 *
 * @example
 * ```typescript
 * const correlationIdHeader = createHeaderParameter(
 *   'X-Correlation-ID',
 *   'Request correlation ID for tracking',
 *   true
 * );
 * ```
 */
export declare const createHeaderParameter: (name: string, description: string, required?: boolean) => SwaggerParameterOptions;
/**
 * Gets standard HTTP error name for status code.
 *
 * @param {number} statusCode - HTTP status code
 * @returns {string} Error name
 *
 * @example
 * ```typescript
 * const errorName = getErrorName(404); // 'Not Found'
 * ```
 */
export declare const getErrorName: (statusCode: number) => string;
/**
 * Merges multiple OpenAPI schemas using allOf.
 *
 * @param {...Record<string, any>[]} schemas - Schemas to merge
 * @returns {Record<string, any>} Merged schema
 *
 * @example
 * ```typescript
 * const merged = mergeSchemas(baseSchema, extensionSchema, anotherSchema);
 * ```
 */
export declare const mergeSchemas: (...schemas: Record<string, any>[]) => Record<string, any>;
/**
 * Creates a deep link to a specific section in Swagger UI.
 *
 * @param {string} baseUrl - Swagger UI base URL
 * @param {string} operationId - Operation ID to link to
 * @returns {string} Deep link URL
 *
 * @example
 * ```typescript
 * const link = createSwaggerDeepLink('https://api.example.com/docs', 'getUserById');
 * // Result: 'https://api.example.com/docs#/operations/getUserById'
 * ```
 */
export declare const createSwaggerDeepLink: (baseUrl: string, operationId: string) => string;
/**
 * Validates OpenAPI schema structure (basic validation).
 *
 * @param {Record<string, any>} schema - Schema to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateSwaggerSchema(mySchema);
 * if (!result.valid) {
 *   console.error('Schema errors:', result.errors);
 * }
 * ```
 */
export declare const validateSwaggerSchema: (schema: Record<string, any>) => {
    valid: boolean;
    errors: string[];
};
export {};
//# sourceMappingURL=swagger-docs-kit.d.ts.map