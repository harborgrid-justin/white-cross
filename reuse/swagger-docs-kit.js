"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSwaggerSchema = exports.createSwaggerDeepLink = exports.mergeSchemas = exports.getErrorName = exports.createHeaderParameter = exports.createQueryParameter = exports.createPathParameter = exports.createRealisticExample = exports.generateExampleFromSchema = exports.createWebhooksDefinition = exports.createWebhookSchema = exports.createMultiFieldFileUpload = exports.createFileUploadSchema = exports.createCursorPaginationParameters = exports.createPaginationParameters = exports.createResourceTags = exports.createTagGroup = exports.createSwaggerTag = exports.createDeprecationNotice = exports.createVersionedApiDoc = exports.createBasicAuth = exports.createOpenIdConnectScheme = exports.createOAuth2Scheme = exports.createApiKeyAuth = exports.createBearerAuth = exports.createRequestBodyWithExamples = exports.createMultiContentRequestBody = exports.createRequestBody = exports.createCommonErrorResponses = exports.createValidationErrorSchema = exports.createErrorSchema = exports.createHateoasResponse = exports.createPaginatedResponse = exports.createMultipleResponses = exports.createResponseSchema = exports.createAllOfSchema = exports.createOneOfSchema = exports.createDiscriminatorSchema = exports.createReferenceSchema = exports.createEnumSchema = exports.createArraySchema = exports.createSwaggerSchema = void 0;
// ============================================================================
// SCHEMA GENERATORS
// ============================================================================
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
const createSwaggerSchema = (options) => {
    const schema = {
        type: options.type,
    };
    if (options.description)
        schema.description = options.description;
    if (options.example !== undefined)
        schema.example = options.example;
    if (options.format)
        schema.format = options.format;
    if (options.enum)
        schema.enum = options.enum;
    if (options.pattern)
        schema.pattern = options.pattern;
    if (options.minimum !== undefined)
        schema.minimum = options.minimum;
    if (options.maximum !== undefined)
        schema.maximum = options.maximum;
    if (options.minLength !== undefined)
        schema.minLength = options.minLength;
    if (options.maxLength !== undefined)
        schema.maxLength = options.maxLength;
    if (options.items)
        schema.items = options.items;
    if (options.properties)
        schema.properties = options.properties;
    if (options.nullable)
        schema.nullable = options.nullable;
    if (options.deprecated)
        schema.deprecated = options.deprecated;
    return schema;
};
exports.createSwaggerSchema = createSwaggerSchema;
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
const createArraySchema = (itemSchema, description, minItems, maxItems) => {
    const schema = {
        type: 'array',
        items: itemSchema,
    };
    if (description)
        schema.description = description;
    if (minItems !== undefined)
        schema.minItems = minItems;
    if (maxItems !== undefined)
        schema.maxItems = maxItems;
    return schema;
};
exports.createArraySchema = createArraySchema;
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
const createEnumSchema = (values, type, description) => {
    return {
        type,
        enum: values,
        description: description || `Allowed values: ${values.join(', ')}`,
    };
};
exports.createEnumSchema = createEnumSchema;
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
const createReferenceSchema = (componentName, isArray = false) => {
    const ref = { $ref: `#/components/schemas/${componentName}` };
    return isArray ? { type: 'array', items: ref } : ref;
};
exports.createReferenceSchema = createReferenceSchema;
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
const createDiscriminatorSchema = (propertyName, mapping) => {
    return {
        discriminator: {
            propertyName,
            mapping,
        },
    };
};
exports.createDiscriminatorSchema = createDiscriminatorSchema;
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
const createOneOfSchema = (schemas, description) => {
    const schema = { oneOf: schemas };
    if (description)
        schema.description = description;
    return schema;
};
exports.createOneOfSchema = createOneOfSchema;
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
const createAllOfSchema = (schemas, description) => {
    const schema = { allOf: schemas };
    if (description)
        schema.description = description;
    return schema;
};
exports.createAllOfSchema = createAllOfSchema;
// ============================================================================
// RESPONSE DOCUMENTATION
// ============================================================================
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
const createResponseSchema = (options) => {
    const response = {
        description: options.description,
    };
    if (options.schema) {
        response.content = {
            'application/json': {
                schema: options.isArray
                    ? { type: 'array', items: options.schema }
                    : options.schema,
            },
        };
        if (options.example) {
            response.content['application/json'].example = options.example;
        }
    }
    if (options.headers) {
        response.headers = options.headers;
    }
    return response;
};
exports.createResponseSchema = createResponseSchema;
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
const createMultipleResponses = (responses) => {
    const responseObj = {};
    responses.forEach((resp) => {
        responseObj[resp.status.toString()] = (0, exports.createResponseSchema)(resp);
    });
    return responseObj;
};
exports.createMultipleResponses = createMultipleResponses;
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
const createPaginatedResponse = (itemSchema, paginationConfig) => {
    const config = paginationConfig || {
        pageParam: 'page',
        limitParam: 'limit',
        totalParam: 'total',
        dataParam: 'data',
    };
    return {
        type: 'object',
        properties: {
            [config.dataParam]: {
                type: 'array',
                items: itemSchema,
            },
            [config.pageParam]: {
                type: 'integer',
                description: 'Current page number',
            },
            [config.limitParam]: {
                type: 'integer',
                description: 'Items per page',
            },
            [config.totalParam]: {
                type: 'integer',
                description: 'Total number of items',
            },
            totalPages: {
                type: 'integer',
                description: 'Total number of pages',
            },
            hasNextPage: {
                type: 'boolean',
                description: 'Whether next page exists',
            },
            hasPreviousPage: {
                type: 'boolean',
                description: 'Whether previous page exists',
            },
        },
    };
};
exports.createPaginatedResponse = createPaginatedResponse;
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
const createHateoasResponse = (dataSchema, linkRels) => {
    const defaultRels = linkRels || ['self', 'next', 'previous'];
    const linkProperties = {};
    defaultRels.forEach((rel) => {
        linkProperties[rel] = {
            type: 'object',
            properties: {
                href: { type: 'string', format: 'uri' },
                method: { type: 'string', enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
            },
        };
    });
    return {
        type: 'object',
        properties: {
            data: dataSchema,
            _links: {
                type: 'object',
                properties: linkProperties,
            },
        },
    };
};
exports.createHateoasResponse = createHateoasResponse;
// ============================================================================
// ERROR RESPONSE SCHEMAS
// ============================================================================
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
const createErrorSchema = (statusCode, description) => {
    return {
        type: 'object',
        properties: {
            statusCode: {
                type: 'integer',
                example: statusCode,
            },
            error: {
                type: 'string',
                example: (0, exports.getErrorName)(statusCode),
            },
            message: {
                type: 'string',
                description: description || 'Error message',
            },
            timestamp: {
                type: 'string',
                format: 'date-time',
                description: 'Error occurrence timestamp',
            },
            path: {
                type: 'string',
                description: 'Request path',
            },
            correlationId: {
                type: 'string',
                format: 'uuid',
                description: 'Request correlation ID for tracking',
            },
        },
    };
};
exports.createErrorSchema = createErrorSchema;
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
const createValidationErrorSchema = () => {
    return {
        type: 'object',
        properties: {
            statusCode: {
                type: 'integer',
                example: 400,
            },
            error: {
                type: 'string',
                example: 'Bad Request',
            },
            message: {
                type: 'string',
                example: 'Validation failed',
            },
            errors: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        field: {
                            type: 'string',
                            description: 'Field name that failed validation',
                        },
                        message: {
                            type: 'string',
                            description: 'Validation error message',
                        },
                        constraint: {
                            type: 'string',
                            description: 'Validation constraint that failed',
                        },
                    },
                },
            },
            timestamp: {
                type: 'string',
                format: 'date-time',
            },
        },
    };
};
exports.createValidationErrorSchema = createValidationErrorSchema;
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
const createCommonErrorResponses = () => {
    return {
        '400': {
            description: 'Bad Request - Invalid input',
            content: {
                'application/json': {
                    schema: (0, exports.createValidationErrorSchema)(),
                },
            },
        },
        '401': {
            description: 'Unauthorized - Authentication required',
            content: {
                'application/json': {
                    schema: (0, exports.createErrorSchema)(401, 'Authentication credentials missing or invalid'),
                },
            },
        },
        '403': {
            description: 'Forbidden - Insufficient permissions',
            content: {
                'application/json': {
                    schema: (0, exports.createErrorSchema)(403, 'User does not have permission to access this resource'),
                },
            },
        },
        '404': {
            description: 'Not Found - Resource does not exist',
            content: {
                'application/json': {
                    schema: (0, exports.createErrorSchema)(404, 'The requested resource was not found'),
                },
            },
        },
        '500': {
            description: 'Internal Server Error',
            content: {
                'application/json': {
                    schema: (0, exports.createErrorSchema)(500, 'An unexpected error occurred'),
                },
            },
        },
    };
};
exports.createCommonErrorResponses = createCommonErrorResponses;
// ============================================================================
// REQUEST BODY EXAMPLES
// ============================================================================
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
const createRequestBody = (schema, example, description, required = true) => {
    return {
        required,
        description,
        content: {
            'application/json': {
                schema,
                example,
            },
        },
    };
};
exports.createRequestBody = createRequestBody;
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
const createMultiContentRequestBody = (contentTypes, description, required = true) => {
    const content = {};
    Object.entries(contentTypes).forEach(([mimeType, config]) => {
        content[mimeType] = {
            schema: config.schema,
        };
        if (config.example) {
            content[mimeType].example = config.example;
        }
    });
    return {
        required,
        description,
        content,
    };
};
exports.createMultiContentRequestBody = createMultiContentRequestBody;
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
const createRequestBodyWithExamples = (schema, examples, description) => {
    const exampleObjects = {};
    Object.entries(examples).forEach(([name, exampleConfig]) => {
        exampleObjects[name] = {
            summary: exampleConfig.summary,
            description: exampleConfig.description,
            value: exampleConfig.value,
        };
        if (exampleConfig.externalValue) {
            exampleObjects[name].externalValue = exampleConfig.externalValue;
        }
    });
    return {
        description,
        content: {
            'application/json': {
                schema,
                examples: exampleObjects,
            },
        },
    };
};
exports.createRequestBodyWithExamples = createRequestBodyWithExamples;
// ============================================================================
// SECURITY SCHEME DEFINITIONS
// ============================================================================
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
const createBearerAuth = (format = 'JWT', description) => {
    return {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: format,
        description: description || `Bearer token authentication using ${format}`,
    };
};
exports.createBearerAuth = createBearerAuth;
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
const createApiKeyAuth = (name, location, description) => {
    return {
        type: 'apiKey',
        name,
        in: location,
        description: description || `API key authentication via ${location}`,
    };
};
exports.createApiKeyAuth = createApiKeyAuth;
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
const createOAuth2Scheme = (flows, description) => {
    return {
        type: 'oauth2',
        flows,
        description: description || 'OAuth2 authentication',
    };
};
exports.createOAuth2Scheme = createOAuth2Scheme;
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
const createOpenIdConnectScheme = (openIdConnectUrl, description) => {
    return {
        type: 'openIdConnect',
        openIdConnectUrl,
        description: description || 'OpenID Connect authentication',
    };
};
exports.createOpenIdConnectScheme = createOpenIdConnectScheme;
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
const createBasicAuth = (description) => {
    return {
        type: 'http',
        scheme: 'basic',
        description: description || 'Basic HTTP authentication',
    };
};
exports.createBasicAuth = createBasicAuth;
// ============================================================================
// API VERSIONING DOCUMENTATION
// ============================================================================
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
const createVersionedApiDoc = (config) => {
    const doc = {
        openapi: '3.0.0',
        info: {
            title: config.title,
            version: config.version,
            description: config.description,
        },
        servers: [],
    };
    if (config.deprecated) {
        doc.info.description += '\n\n**⚠️ DEPRECATED**: This API version is deprecated and will be removed in a future release.';
    }
    if (config.basePath) {
        doc.servers.push({
            url: config.basePath,
            description: `API version ${config.version}`,
        });
    }
    return doc;
};
exports.createVersionedApiDoc = createVersionedApiDoc;
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
const createDeprecationNotice = (currentVersion, sunsetDate, migrationGuideUrl) => {
    let description = `**DEPRECATED**: This endpoint is deprecated and will be removed on ${sunsetDate}.`;
    if (migrationGuideUrl) {
        description += `\n\nPlease migrate to the latest API version. See [Migration Guide](${migrationGuideUrl}) for details.`;
    }
    return {
        deprecated: true,
        description,
        headers: {
            'Sunset': {
                description: 'Date when this endpoint will be removed',
                schema: {
                    type: 'string',
                    format: 'date',
                    example: sunsetDate,
                },
            },
            'Deprecation': {
                description: 'Indicates this endpoint is deprecated',
                schema: {
                    type: 'string',
                    example: 'true',
                },
            },
        },
    };
};
exports.createDeprecationNotice = createDeprecationNotice;
// ============================================================================
// TAG ORGANIZATION
// ============================================================================
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
const createSwaggerTag = (options) => {
    const tag = {
        name: options.name,
        description: options.description,
    };
    if (options.externalDocs) {
        tag.externalDocs = options.externalDocs;
    }
    return tag;
};
exports.createSwaggerTag = createSwaggerTag;
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
const createTagGroup = (prefix, tags) => {
    return tags.map((tag) => ({
        name: `${prefix} - ${tag.name}`,
        description: tag.description,
    }));
};
exports.createTagGroup = createTagGroup;
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
const createResourceTags = (resources, suffix = 'Management') => {
    return resources.map((resource) => ({
        name: `${resource} ${suffix}`,
        description: `Endpoints for managing ${resource.toLowerCase()}`,
    }));
};
exports.createResourceTags = createResourceTags;
// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================
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
const createPaginationParameters = (defaultLimit = 20, maxLimit = 100) => {
    return [
        {
            name: 'page',
            in: 'query',
            description: 'Page number (1-based)',
            required: false,
            schema: {
                type: 'integer',
                minimum: 1,
                default: 1,
            },
            example: 1,
        },
        {
            name: 'limit',
            in: 'query',
            description: 'Number of items per page',
            required: false,
            schema: {
                type: 'integer',
                minimum: 1,
                maximum: maxLimit,
                default: defaultLimit,
            },
            example: defaultLimit,
        },
    ];
};
exports.createPaginationParameters = createPaginationParameters;
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
const createCursorPaginationParameters = (defaultLimit = 20) => {
    return [
        {
            name: 'cursor',
            in: 'query',
            description: 'Cursor for pagination (base64 encoded)',
            required: false,
            schema: {
                type: 'string',
            },
            example: 'eyJpZCI6MTAwfQ==',
        },
        {
            name: 'limit',
            in: 'query',
            description: 'Number of items to return',
            required: false,
            schema: {
                type: 'integer',
                minimum: 1,
                maximum: 100,
                default: defaultLimit,
            },
            example: defaultLimit,
        },
    ];
};
exports.createCursorPaginationParameters = createCursorPaginationParameters;
// ============================================================================
// FILE UPLOAD DOCUMENTATION
// ============================================================================
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
const createFileUploadSchema = (options) => {
    const schema = {
        required: options.required,
        content: {
            'multipart/form-data': {
                schema: {
                    type: 'object',
                    properties: {
                        [options.fieldName]: options.multiple
                            ? {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    format: 'binary',
                                },
                            }
                            : {
                                type: 'string',
                                format: 'binary',
                            },
                    },
                },
            },
        },
    };
    if (options.description) {
        schema.description = options.description;
    }
    if (options.maxSize || options.allowedMimeTypes) {
        let description = options.description || '';
        if (options.maxSize) {
            description += `\nMaximum file size: ${(options.maxSize / 1024 / 1024).toFixed(2)} MB`;
        }
        if (options.allowedMimeTypes) {
            description += `\nAllowed types: ${options.allowedMimeTypes.join(', ')}`;
        }
        schema.description = description.trim();
    }
    return schema;
};
exports.createFileUploadSchema = createFileUploadSchema;
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
const createMultiFieldFileUpload = (fields, metadata) => {
    const properties = {};
    Object.entries(fields).forEach(([key, options]) => {
        properties[options.fieldName] = options.multiple
            ? {
                type: 'array',
                items: {
                    type: 'string',
                    format: 'binary',
                },
                description: options.description,
            }
            : {
                type: 'string',
                format: 'binary',
                description: options.description,
            };
    });
    if (metadata) {
        Object.assign(properties, metadata);
    }
    return {
        content: {
            'multipart/form-data': {
                schema: {
                    type: 'object',
                    properties,
                },
            },
        },
    };
};
exports.createMultiFieldFileUpload = createMultiFieldFileUpload;
// ============================================================================
// WEBHOOK DOCUMENTATION
// ============================================================================
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
const createWebhookSchema = (options) => {
    const webhook = {
        post: {
            summary: `Webhook: ${options.eventType}`,
            description: options.description,
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                event: {
                                    type: 'string',
                                    enum: [options.eventType],
                                    description: 'Event type identifier',
                                },
                                timestamp: {
                                    type: 'string',
                                    format: 'date-time',
                                    description: 'Event timestamp',
                                },
                                data: options.payloadSchema,
                            },
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Webhook received successfully',
                },
            },
        },
    };
    if (options.signatureHeader) {
        webhook.post.parameters = [
            {
                name: options.signatureHeader,
                in: 'header',
                required: true,
                schema: { type: 'string' },
                description: 'Webhook signature for verification',
            },
        ];
    }
    return webhook;
};
exports.createWebhookSchema = createWebhookSchema;
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
const createWebhooksDefinition = (webhooks) => {
    const webhooksObj = {};
    webhooks.forEach((webhook) => {
        webhooksObj[webhook.eventType] = (0, exports.createWebhookSchema)(webhook);
    });
    return webhooksObj;
};
exports.createWebhooksDefinition = createWebhooksDefinition;
// ============================================================================
// EXAMPLE GENERATORS
// ============================================================================
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
const generateExampleFromSchema = (schema) => {
    if (schema.example !== undefined) {
        return schema.example;
    }
    switch (schema.type) {
        case 'string':
            if (schema.format === 'email')
                return 'user@example.com';
            if (schema.format === 'uuid')
                return '123e4567-e89b-12d3-a456-426614174000';
            if (schema.format === 'date-time')
                return new Date().toISOString();
            if (schema.format === 'date')
                return '2025-01-01';
            if (schema.enum)
                return schema.enum[0];
            return 'string';
        case 'number':
        case 'integer':
            if (schema.minimum !== undefined)
                return schema.minimum;
            if (schema.maximum !== undefined)
                return schema.maximum;
            return 0;
        case 'boolean':
            return false;
        case 'array':
            if (schema.items) {
                return [(0, exports.generateExampleFromSchema)(schema.items)];
            }
            return [];
        case 'object':
            if (schema.properties) {
                const example = {};
                Object.entries(schema.properties).forEach(([key, propSchema]) => {
                    example[key] = (0, exports.generateExampleFromSchema)(propSchema);
                });
                return example;
            }
            return {};
        default:
            return null;
    }
};
exports.generateExampleFromSchema = generateExampleFromSchema;
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
const createRealisticExample = (dataType, options) => {
    const examples = {
        user: {
            id: options?.includeId ? '550e8400-e29b-41d4-a716-446655440000' : undefined,
            email: 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            createdAt: '2025-01-01T12:00:00Z',
        },
        address: {
            street: '123 Main Street',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62701',
            country: 'USA',
        },
        patient: {
            id: options?.includeId ? 'pat-123456' : undefined,
            firstName: 'Jane',
            lastName: 'Smith',
            dateOfBirth: '1985-06-15',
            gender: 'female',
            phone: '+1-555-123-4567',
            email: 'jane.smith@example.com',
        },
        appointment: {
            id: options?.includeId ? 'apt-789012' : undefined,
            patientId: 'pat-123456',
            providerId: 'prov-456789',
            scheduledAt: '2025-02-15T10:00:00Z',
            duration: 30,
            status: 'scheduled',
            type: 'consultation',
        },
        medication: {
            id: options?.includeId ? 'med-345678' : undefined,
            name: 'Lisinopril',
            dosage: '10mg',
            frequency: 'once daily',
            prescribedBy: 'Dr. Johnson',
            prescribedDate: '2025-01-15',
        },
    };
    return examples[dataType] || {};
};
exports.createRealisticExample = createRealisticExample;
// ============================================================================
// PARAMETER DOCUMENTATION
// ============================================================================
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
const createPathParameter = (name, description, type = 'string', format) => {
    return {
        name,
        in: 'path',
        required: true,
        description,
        schema: {
            type,
            format,
        },
    };
};
exports.createPathParameter = createPathParameter;
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
const createQueryParameter = (name, description, schema, required = false) => {
    return {
        name,
        in: 'query',
        required,
        description,
        schema,
    };
};
exports.createQueryParameter = createQueryParameter;
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
const createHeaderParameter = (name, description, required = false) => {
    return {
        name,
        in: 'header',
        required,
        description,
        schema: {
            type: 'string',
        },
    };
};
exports.createHeaderParameter = createHeaderParameter;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
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
const getErrorName = (statusCode) => {
    const errorNames = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        405: 'Method Not Allowed',
        409: 'Conflict',
        422: 'Unprocessable Entity',
        429: 'Too Many Requests',
        500: 'Internal Server Error',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        504: 'Gateway Timeout',
    };
    return errorNames[statusCode] || 'Error';
};
exports.getErrorName = getErrorName;
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
const mergeSchemas = (...schemas) => {
    return {
        allOf: schemas,
    };
};
exports.mergeSchemas = mergeSchemas;
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
const createSwaggerDeepLink = (baseUrl, operationId) => {
    return `${baseUrl}#/operations/${operationId}`;
};
exports.createSwaggerDeepLink = createSwaggerDeepLink;
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
const validateSwaggerSchema = (schema) => {
    const errors = [];
    if (!schema.type && !schema.$ref && !schema.allOf && !schema.oneOf && !schema.anyOf) {
        errors.push('Schema must have a type or reference');
    }
    if (schema.type === 'array' && !schema.items) {
        errors.push('Array schema must define items');
    }
    if (schema.type === 'object' && !schema.properties && !schema.additionalProperties) {
        errors.push('Object schema should define properties or additionalProperties');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateSwaggerSchema = validateSwaggerSchema;
//# sourceMappingURL=swagger-docs-kit.js.map