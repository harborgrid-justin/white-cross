"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClientGenerationHints = exports.createHealthCheckSchema = exports.createWebhookDoc = exports.createValidationDoc = exports.generateExampleFromSchema = exports.createMultipleExamples = exports.createExternalDocsRef = exports.createCustomMetadata = exports.createRateLimitDoc = exports.createVersionedOperationDoc = exports.createDeprecationDoc = exports.createApiTag = exports.createPublicEndpointDoc = exports.createCombinedSecurityDoc = exports.createBasicAuthScheme = exports.createOAuth2Scheme = exports.createApiKeyScheme = exports.createBearerAuthScheme = exports.createMultipartFormDoc = exports.createFileUploadBodyDoc = exports.createDateRangeQueryDocs = exports.createFilterQueryDocs = exports.createSearchQueryDocs = exports.createPaginationQueryDocs = exports.createFileDownloadResponseDoc = exports.createCrudResponseDocs = exports.createNoContentResponseDoc = exports.createCreatedResponseDoc = exports.createArrayResponseDoc = exports.createPaginatedResponseDoc = exports.createErrorResponseDoc = exports.createSuccessResponseDoc = exports.createCrudOperationDecorators = exports.createBodyDecorator = exports.createHeaderDecorator = exports.createQueryDecorator = exports.createParamDecorator = exports.createOperationDecorator = exports.createResponseDecorator = exports.createPropertyDecorator = exports.createEnumSchema = exports.createAllOfSchema = exports.createDiscriminatedSchema = exports.createSchemaRef = exports.createFileUploadSchema = exports.createErrorSchema = exports.createPaginatedSchema = exports.createOpenApiSchema = void 0;
// ============================================================================
// 1. OPENAPI SCHEMA BUILDERS
// ============================================================================
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
const createOpenApiSchema = (options) => {
    const schema = {
        type: options.type,
    };
    if (options.format)
        schema.format = options.format;
    if (options.description)
        schema.description = options.description;
    if (options.example !== undefined)
        schema.example = options.example;
    if (options.nullable)
        schema.nullable = options.nullable;
    if (options.enum)
        schema.enum = options.enum;
    if (options.default !== undefined)
        schema.default = options.default;
    if (options.minimum !== undefined)
        schema.minimum = options.minimum;
    if (options.maximum !== undefined)
        schema.maximum = options.maximum;
    if (options.minLength !== undefined)
        schema.minLength = options.minLength;
    if (options.maxLength !== undefined)
        schema.maxLength = options.maxLength;
    if (options.pattern)
        schema.pattern = options.pattern;
    if (options.items)
        schema.items = (0, exports.createOpenApiSchema)(options.items);
    if (options.properties) {
        schema.properties = Object.entries(options.properties).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: (0, exports.createOpenApiSchema)(value),
        }), {});
    }
    if (options.additionalProperties !== undefined) {
        schema.additionalProperties =
            typeof options.additionalProperties === 'boolean'
                ? options.additionalProperties
                : (0, exports.createOpenApiSchema)(options.additionalProperties);
    }
    return schema;
};
exports.createOpenApiSchema = createOpenApiSchema;
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
const createPaginatedSchema = (itemType, description) => {
    return {
        type: 'object',
        description: description || 'Paginated response',
        properties: {
            items: {
                type: 'array',
                items: { $ref: `#/components/schemas/${itemType.name}` },
            },
            total: { type: 'integer', description: 'Total number of items' },
            page: { type: 'integer', description: 'Current page number' },
            pageSize: { type: 'integer', description: 'Items per page' },
            totalPages: { type: 'integer', description: 'Total number of pages' },
        },
        required: ['items', 'total', 'page', 'pageSize', 'totalPages'],
    };
};
exports.createPaginatedSchema = createPaginatedSchema;
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
const createErrorSchema = (description, includeDetails = false) => {
    const properties = {
        statusCode: { type: 'integer', example: 400 },
        message: { type: 'string', example: 'An error occurred' },
        error: { type: 'string', example: 'Bad Request' },
    };
    if (includeDetails) {
        properties.details = {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    field: { type: 'string' },
                    message: { type: 'string' },
                    code: { type: 'string' },
                },
            },
        };
    }
    return {
        type: 'object',
        description: description || 'Error response',
        properties,
        required: ['statusCode', 'message', 'error'],
    };
};
exports.createErrorSchema = createErrorSchema;
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
const createFileUploadSchema = (multiple = false, allowedTypes) => {
    const fileSchema = {
        type: 'string',
        format: 'binary',
        ...(allowedTypes && { description: `Allowed types: ${allowedTypes.join(', ')}` }),
    };
    if (multiple) {
        return {
            type: 'array',
            items: fileSchema,
        };
    }
    return fileSchema;
};
exports.createFileUploadSchema = createFileUploadSchema;
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
const createSchemaRef = (schemaName) => {
    return { $ref: `#/components/schemas/${schemaName}` };
};
exports.createSchemaRef = createSchemaRef;
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
const createDiscriminatedSchema = (discriminatorProperty, mapping, baseType) => {
    return {
        oneOf: Object.values(mapping).map((schemaName) => (0, exports.createSchemaRef)(schemaName)),
        discriminator: {
            propertyName: discriminatorProperty,
            mapping: Object.entries(mapping).reduce((acc, [key, value]) => ({
                ...acc,
                [key]: `#/components/schemas/${value}`,
            }), {}),
        },
    };
};
exports.createDiscriminatedSchema = createDiscriminatedSchema;
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
const createAllOfSchema = (schemaNames, additionalProperties) => {
    const allOf = schemaNames.map((name) => (0, exports.createSchemaRef)(name));
    if (additionalProperties) {
        allOf.push({
            type: 'object',
            properties: additionalProperties,
        });
    }
    return { allOf };
};
exports.createAllOfSchema = createAllOfSchema;
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
const createEnumSchema = (enumValues, descriptions, type = 'string') => {
    const schema = {
        type,
        enum: enumValues,
    };
    if (descriptions) {
        schema.description = Object.entries(descriptions)
            .map(([value, desc]) => `- ${value}: ${desc}`)
            .join('\n');
    }
    return schema;
};
exports.createEnumSchema = createEnumSchema;
// ============================================================================
// 2. SWAGGER DECORATOR FACTORIES
// ============================================================================
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
const createPropertyDecorator = (options) => {
    return {
        required: options.required ?? true,
        description: options.description || '',
        example: options.example,
        type: options.type,
        format: options.format,
        enum: options.enum,
        nullable: options.nullable ?? false,
        isArray: options.isArray ?? false,
        minimum: options.minimum,
        maximum: options.maximum,
        minLength: options.minLength,
        maxLength: options.maxLength,
        pattern: options.pattern,
        default: options.default,
        ...options,
    };
};
exports.createPropertyDecorator = createPropertyDecorator;
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
const createResponseDecorator = (schema) => {
    return {
        status: schema.statusCode,
        description: schema.description,
        type: schema.type,
        isArray: schema.isArray ?? false,
        ...(schema.example && { schema: { example: schema.example } }),
        ...(schema.headers && { headers: schema.headers }),
    };
};
exports.createResponseDecorator = createResponseDecorator;
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
const createOperationDecorator = (summary, description, tags) => {
    return {
        summary,
        description: description || summary,
        ...(tags && { tags }),
    };
};
exports.createOperationDecorator = createOperationDecorator;
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
const createParamDecorator = (name, description, type, example) => {
    return {
        name,
        description,
        required: true,
        type: type || String,
        ...(example && { example }),
    };
};
exports.createParamDecorator = createParamDecorator;
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
const createQueryDecorator = (name, required = false, description, type, example) => {
    return {
        name,
        required,
        description: description || name,
        type: type || String,
        ...(example !== undefined && { example }),
    };
};
exports.createQueryDecorator = createQueryDecorator;
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
const createHeaderDecorator = (name, description, required = false, example) => {
    return {
        name,
        description,
        required,
        ...(example && { example }),
    };
};
exports.createHeaderDecorator = createHeaderDecorator;
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
const createBodyDecorator = (type, description, examples) => {
    return {
        type,
        description: description || `Request body of type ${type.name}`,
        ...(examples && { examples }),
    };
};
exports.createBodyDecorator = createBodyDecorator;
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
const createCrudOperationDecorators = (resourceName, dto, createDto, updateDto) => {
    return {
        create: {
            summary: `Create ${resourceName}`,
            description: `Creates a new ${resourceName.toLowerCase()}`,
        },
        findAll: {
            summary: `Get all ${resourceName}s`,
            description: `Retrieves a list of all ${resourceName.toLowerCase()}s`,
        },
        findOne: {
            summary: `Get ${resourceName} by ID`,
            description: `Retrieves a single ${resourceName.toLowerCase()} by its ID`,
        },
        update: {
            summary: `Update ${resourceName}`,
            description: `Updates an existing ${resourceName.toLowerCase()}`,
        },
        remove: {
            summary: `Delete ${resourceName}`,
            description: `Deletes a ${resourceName.toLowerCase()}`,
        },
    };
};
exports.createCrudOperationDecorators = createCrudOperationDecorators;
// ============================================================================
// 3. REQUEST/RESPONSE DOCUMENTATION HELPERS
// ============================================================================
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
const createSuccessResponseDoc = (type, description, statusCode = 200) => {
    return {
        status: statusCode,
        description,
        type,
    };
};
exports.createSuccessResponseDoc = createSuccessResponseDoc;
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
const createErrorResponseDoc = (statusCode, customMessage) => {
    const errorMessages = {
        400: 'Bad Request - Invalid input data',
        401: 'Unauthorized - Authentication required',
        403: 'Forbidden - Insufficient permissions',
        404: 'Not Found - Resource does not exist',
        409: 'Conflict - Resource already exists',
        422: 'Unprocessable Entity - Validation failed',
        429: 'Too Many Requests - Rate limit exceeded',
        500: 'Internal Server Error',
        503: 'Service Unavailable',
    };
    return {
        status: statusCode,
        description: customMessage || errorMessages[statusCode] || 'Error',
        schema: (0, exports.createErrorSchema)(customMessage || errorMessages[statusCode]),
    };
};
exports.createErrorResponseDoc = createErrorResponseDoc;
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
const createPaginatedResponseDoc = (itemType, description) => {
    return {
        status: 200,
        description,
        schema: (0, exports.createPaginatedSchema)(itemType, description),
    };
};
exports.createPaginatedResponseDoc = createPaginatedResponseDoc;
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
const createArrayResponseDoc = (itemType, description) => {
    return {
        status: 200,
        description,
        type: itemType,
        isArray: true,
    };
};
exports.createArrayResponseDoc = createArrayResponseDoc;
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
const createCreatedResponseDoc = (type, resourceName) => {
    return {
        status: 201,
        description: `${resourceName} successfully created`,
        type,
    };
};
exports.createCreatedResponseDoc = createCreatedResponseDoc;
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
const createNoContentResponseDoc = (description) => {
    return {
        status: 204,
        description,
    };
};
exports.createNoContentResponseDoc = createNoContentResponseDoc;
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
const createCrudResponseDocs = (dto, resourceName) => {
    return {
        create: [
            (0, exports.createCreatedResponseDoc)(dto, resourceName),
            (0, exports.createErrorResponseDoc)(400),
            (0, exports.createErrorResponseDoc)(422),
        ],
        findAll: [
            (0, exports.createArrayResponseDoc)(dto, `List of ${resourceName}s`),
            (0, exports.createErrorResponseDoc)(400),
        ],
        findOne: [
            (0, exports.createSuccessResponseDoc)(dto, `${resourceName} found`),
            (0, exports.createErrorResponseDoc)(404),
        ],
        update: [
            (0, exports.createSuccessResponseDoc)(dto, `${resourceName} updated`),
            (0, exports.createErrorResponseDoc)(400),
            (0, exports.createErrorResponseDoc)(404),
            (0, exports.createErrorResponseDoc)(422),
        ],
        remove: [(0, exports.createNoContentResponseDoc)(`${resourceName} deleted`), (0, exports.createErrorResponseDoc)(404)],
    };
};
exports.createCrudResponseDocs = createCrudResponseDocs;
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
const createFileDownloadResponseDoc = (mimeType, description) => {
    return {
        status: 200,
        description,
        content: {
            [mimeType]: {
                schema: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    };
};
exports.createFileDownloadResponseDoc = createFileDownloadResponseDoc;
// ============================================================================
// 4. PARAMETER & BODY DOCUMENTATION UTILITIES
// ============================================================================
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
const createPaginationQueryDocs = (defaultLimit = 20, maxLimit = 100) => {
    return [
        (0, exports.createQueryDecorator)('page', false, 'Page number (1-indexed)', Number, 1),
        (0, exports.createQueryDecorator)('limit', false, `Items per page (max: ${maxLimit})`, Number, defaultLimit),
        (0, exports.createQueryDecorator)('sortBy', false, 'Field to sort by', String, 'createdAt'),
        (0, exports.createQueryDecorator)('sortOrder', false, 'Sort order', String, 'desc'),
    ];
};
exports.createPaginationQueryDocs = createPaginationQueryDocs;
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
const createSearchQueryDocs = (searchableFields) => {
    return [
        (0, exports.createQueryDecorator)('q', false, `Search query (searches: ${searchableFields.join(', ')})`, String, 'search term'),
        (0, exports.createQueryDecorator)('fields', false, 'Fields to search in (comma-separated)', String),
    ];
};
exports.createSearchQueryDocs = createSearchQueryDocs;
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
const createFilterQueryDocs = (filterableFields) => {
    return filterableFields.map((field) => (0, exports.createQueryDecorator)(field, false, `Filter by ${field}`, String));
};
exports.createFilterQueryDocs = createFilterQueryDocs;
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
const createDateRangeQueryDocs = (fieldName) => {
    return [
        (0, exports.createQueryDecorator)(`${fieldName}From`, false, `Filter ${fieldName} from date (ISO 8601)`, String, '2024-01-01T00:00:00Z'),
        (0, exports.createQueryDecorator)(`${fieldName}To`, false, `Filter ${fieldName} to date (ISO 8601)`, String, '2024-12-31T23:59:59Z'),
    ];
};
exports.createDateRangeQueryDocs = createDateRangeQueryDocs;
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
const createFileUploadBodyDoc = (multiple = false, allowedTypes, maxSize) => {
    let description = multiple ? 'Upload multiple files' : 'Upload a single file';
    if (allowedTypes) {
        description += `\n\nAllowed types: ${allowedTypes.join(', ')}`;
    }
    if (maxSize) {
        description += `\n\nMax size: ${(maxSize / 1024 / 1024).toFixed(2)} MB`;
    }
    return {
        description,
        schema: {
            type: 'object',
            properties: {
                file: (0, exports.createFileUploadSchema)(multiple, allowedTypes),
            },
        },
    };
};
exports.createFileUploadBodyDoc = createFileUploadBodyDoc;
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
const createMultipartFormDoc = (fields, hasFile = false) => {
    const properties = Object.entries(fields).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: (0, exports.createOpenApiSchema)(value),
    }), {});
    if (hasFile) {
        properties['file'] = (0, exports.createFileUploadSchema)(false);
    }
    return {
        description: 'Multipart form data',
        schema: {
            type: 'object',
            properties,
        },
    };
};
exports.createMultipartFormDoc = createMultipartFormDoc;
// ============================================================================
// 5. SECURITY & AUTHENTICATION DOCUMENTATION
// ============================================================================
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
const createBearerAuthScheme = (description) => {
    return {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        ...(description && { description }),
    };
};
exports.createBearerAuthScheme = createBearerAuthScheme;
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
const createApiKeyScheme = (name, location, description) => {
    return {
        type: 'apiKey',
        name,
        in: location,
        ...(description && { description }),
    };
};
exports.createApiKeyScheme = createApiKeyScheme;
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
const createOAuth2Scheme = (flows, description) => {
    return {
        type: 'oauth2',
        flows,
        ...(description && { description }),
    };
};
exports.createOAuth2Scheme = createOAuth2Scheme;
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
const createBasicAuthScheme = (description) => {
    return {
        type: 'http',
        scheme: 'basic',
        ...(description && { description }),
    };
};
exports.createBasicAuthScheme = createBasicAuthScheme;
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
const createCombinedSecurityDoc = (schemes, scopes) => {
    return schemes.map((scheme) => ({
        [scheme]: scopes?.[scheme] || [],
    }));
};
exports.createCombinedSecurityDoc = createCombinedSecurityDoc;
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
const createPublicEndpointDoc = () => {
    return {};
};
exports.createPublicEndpointDoc = createPublicEndpointDoc;
// ============================================================================
// 6. API ORGANIZATION & METADATA
// ============================================================================
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
const createApiTag = (name, description, externalDocsUrl) => {
    const tag = {
        name,
        description,
    };
    if (externalDocsUrl) {
        tag.externalDocs = {
            description: 'External documentation',
            url: externalDocsUrl,
        };
    }
    return tag;
};
exports.createApiTag = createApiTag;
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
const createDeprecationDoc = (info) => {
    let description = '⚠️ **DEPRECATED**\n\n';
    if (info.deprecatedSince) {
        description += `Deprecated since: ${info.deprecatedSince}\n`;
    }
    if (info.removalDate) {
        description += `Scheduled for removal: ${info.removalDate}\n`;
    }
    if (info.reason) {
        description += `\nReason: ${info.reason}\n`;
    }
    if (info.alternative) {
        description += `\nAlternative: ${info.alternative}\n`;
    }
    return {
        deprecated: true,
        description,
    };
};
exports.createDeprecationDoc = createDeprecationDoc;
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
const createVersionedOperationDoc = (version, description) => {
    return `[API ${version}] ${description}`;
};
exports.createVersionedOperationDoc = createVersionedOperationDoc;
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
const createRateLimitDoc = (config) => {
    const headers = {};
    const description = config.description || `Rate limit: ${config.limit} requests per ${config.window}`;
    config.headers.forEach((headerName) => {
        headers[headerName] = {
            description,
            schema: {
                type: 'string',
            },
        };
    });
    return headers;
};
exports.createRateLimitDoc = createRateLimitDoc;
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
const createCustomMetadata = (metadata) => {
    return Object.entries(metadata).reduce((acc, [key, value]) => ({
        ...acc,
        [`x-${key}`]: value,
    }), {});
};
exports.createCustomMetadata = createCustomMetadata;
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
const createExternalDocsRef = (url, description) => {
    return {
        url,
        description: description || 'External documentation',
    };
};
exports.createExternalDocsRef = createExternalDocsRef;
// ============================================================================
// 7. EXAMPLE & VALIDATION GENERATORS
// ============================================================================
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
const createMultipleExamples = (examples) => {
    return examples.reduce((acc, example) => ({
        ...acc,
        [example.name]: {
            summary: example.summary,
            description: example.description,
            value: example.value,
        },
    }), {});
};
exports.createMultipleExamples = createMultipleExamples;
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
const generateExampleFromSchema = (schema) => {
    if (schema.example !== undefined) {
        return schema.example;
    }
    if (schema.enum && schema.enum.length > 0) {
        return schema.enum[0];
    }
    switch (schema.type) {
        case 'string':
            if (schema.format === 'email')
                return 'user@example.com';
            if (schema.format === 'uri')
                return 'https://example.com';
            if (schema.format === 'date')
                return '2024-01-01';
            if (schema.format === 'date-time')
                return '2024-01-01T00:00:00Z';
            if (schema.format === 'uuid')
                return '123e4567-e89b-12d3-a456-426614174000';
            return 'string';
        case 'number':
        case 'integer':
            return schema.minimum ?? 0;
        case 'boolean':
            return true;
        case 'array':
            return schema.items ? [(0, exports.generateExampleFromSchema)(schema.items)] : [];
        case 'object':
            if (schema.properties) {
                return Object.entries(schema.properties).reduce((acc, [key, value]) => ({
                    ...acc,
                    [key]: (0, exports.generateExampleFromSchema)(value),
                }), {});
            }
            return {};
        default:
            return null;
    }
};
exports.generateExampleFromSchema = generateExampleFromSchema;
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
const createValidationDoc = (validationRules) => {
    const rules = [];
    if (validationRules.minLength !== undefined) {
        rules.push(`- Minimum length: ${validationRules.minLength}`);
    }
    if (validationRules.maxLength !== undefined) {
        rules.push(`- Maximum length: ${validationRules.maxLength}`);
    }
    if (validationRules.minimum !== undefined) {
        rules.push(`- Minimum value: ${validationRules.minimum}`);
    }
    if (validationRules.maximum !== undefined) {
        rules.push(`- Maximum value: ${validationRules.maximum}`);
    }
    if (validationRules.pattern) {
        rules.push(`- Pattern: ${validationRules.pattern}`);
    }
    if (validationRules.format) {
        rules.push(`- Format: ${validationRules.format}`);
    }
    return rules.join('\n');
};
exports.createValidationDoc = createValidationDoc;
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
const createWebhookDoc = (webhook) => {
    return {
        [webhook.event]: {
            [webhook.method.toLowerCase()]: {
                summary: `Webhook: ${webhook.event}`,
                description: webhook.description || `Webhook triggered for ${webhook.event} event`,
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: `#/components/schemas/${webhook.payloadType.name}`,
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Webhook successfully processed',
                    },
                },
            },
        },
    };
};
exports.createWebhookDoc = createWebhookDoc;
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
const createHealthCheckSchema = () => {
    return {
        type: 'object',
        properties: {
            status: {
                type: 'string',
                enum: ['ok', 'degraded', 'down'],
                example: 'ok',
            },
            timestamp: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-01T00:00:00Z',
            },
            uptime: {
                type: 'number',
                description: 'Uptime in seconds',
                example: 3600,
            },
            services: {
                type: 'object',
                additionalProperties: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', enum: ['ok', 'degraded', 'down'] },
                        responseTime: { type: 'number', description: 'Response time in ms' },
                    },
                },
            },
        },
        required: ['status', 'timestamp', 'uptime'],
    };
};
exports.createHealthCheckSchema = createHealthCheckSchema;
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
const createClientGenerationHints = (clientLanguage, hints) => {
    return {
        [`x-client-${clientLanguage}`]: hints,
    };
};
exports.createClientGenerationHints = createClientGenerationHints;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // OpenAPI Schema Builders
    createOpenApiSchema: exports.createOpenApiSchema,
    createPaginatedSchema: exports.createPaginatedSchema,
    createErrorSchema: exports.createErrorSchema,
    createFileUploadSchema: exports.createFileUploadSchema,
    createSchemaRef: exports.createSchemaRef,
    createDiscriminatedSchema: exports.createDiscriminatedSchema,
    createAllOfSchema: exports.createAllOfSchema,
    createEnumSchema: exports.createEnumSchema,
    // Swagger Decorator Factories
    createPropertyDecorator: exports.createPropertyDecorator,
    createResponseDecorator: exports.createResponseDecorator,
    createOperationDecorator: exports.createOperationDecorator,
    createParamDecorator: exports.createParamDecorator,
    createQueryDecorator: exports.createQueryDecorator,
    createHeaderDecorator: exports.createHeaderDecorator,
    createBodyDecorator: exports.createBodyDecorator,
    createCrudOperationDecorators: exports.createCrudOperationDecorators,
    // Request/Response Documentation
    createSuccessResponseDoc: exports.createSuccessResponseDoc,
    createErrorResponseDoc: exports.createErrorResponseDoc,
    createPaginatedResponseDoc: exports.createPaginatedResponseDoc,
    createArrayResponseDoc: exports.createArrayResponseDoc,
    createCreatedResponseDoc: exports.createCreatedResponseDoc,
    createNoContentResponseDoc: exports.createNoContentResponseDoc,
    createCrudResponseDocs: exports.createCrudResponseDocs,
    createFileDownloadResponseDoc: exports.createFileDownloadResponseDoc,
    // Parameter & Body Utilities
    createPaginationQueryDocs: exports.createPaginationQueryDocs,
    createSearchQueryDocs: exports.createSearchQueryDocs,
    createFilterQueryDocs: exports.createFilterQueryDocs,
    createDateRangeQueryDocs: exports.createDateRangeQueryDocs,
    createFileUploadBodyDoc: exports.createFileUploadBodyDoc,
    createMultipartFormDoc: exports.createMultipartFormDoc,
    // Security & Authentication
    createBearerAuthScheme: exports.createBearerAuthScheme,
    createApiKeyScheme: exports.createApiKeyScheme,
    createOAuth2Scheme: exports.createOAuth2Scheme,
    createBasicAuthScheme: exports.createBasicAuthScheme,
    createCombinedSecurityDoc: exports.createCombinedSecurityDoc,
    createPublicEndpointDoc: exports.createPublicEndpointDoc,
    // API Organization & Metadata
    createApiTag: exports.createApiTag,
    createDeprecationDoc: exports.createDeprecationDoc,
    createVersionedOperationDoc: exports.createVersionedOperationDoc,
    createRateLimitDoc: exports.createRateLimitDoc,
    createCustomMetadata: exports.createCustomMetadata,
    createExternalDocsRef: exports.createExternalDocsRef,
    // Example & Validation Generators
    createMultipleExamples: exports.createMultipleExamples,
    generateExampleFromSchema: exports.generateExampleFromSchema,
    createValidationDoc: exports.createValidationDoc,
    createWebhookDoc: exports.createWebhookDoc,
    createHealthCheckSchema: exports.createHealthCheckSchema,
    createClientGenerationHints: exports.createClientGenerationHints,
};
//# sourceMappingURL=api-documentation-kit.js.map