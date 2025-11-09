"use strict";
/**
 * LOC: SWG-KIT-001
 * File: /reuse/swagger-openapi-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - API controllers and DTOs
 *   - Swagger configuration modules
 *   - OpenAPI documentation generators
 *   - NestJS application modules
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiCostSchema = exports.createQuotaUsageSchema = exports.createRateLimitHeaders = exports.createMetricsSchema = exports.createHealthCheckSchema = exports.createAccessModifierSchema = exports.createCustomFormatSchema = exports.createConditionalSchema = exports.createBatchOperationResponse = exports.createEventStreamResponse = exports.createHATEOASLinks = exports.createCallbackDocumentation = exports.createWebhookDocumentation = exports.createVersionedOperation = exports.createEndpointDeprecation = exports.createApiVersionInfo = exports.createValidationDocumentation = exports.generateExampleFromSchema = exports.createNamedExamples = exports.createApiTagGroups = exports.createServerConfigurations = exports.createOpenApiInfo = exports.createSwaggerUIConfiguration = exports.createCombinedSecurityRequirements = exports.createOpenIdConnectScheme = exports.createOAuth2SecurityScheme = exports.createApiKeySecurityScheme = exports.createBearerSecurityScheme = exports.createMultipartFormBody = exports.createFileUploadBody = exports.createDateRangeParams = exports.createSearchFilterParams = exports.createPaginationParams = exports.createMultiContentResponse = exports.createFileDownloadResponse = exports.createPaginatedResponse = exports.createStandardErrorResponses = exports.createSuccessResponses = exports.createArrayPropertyDecorator = exports.createEnumPropertyDecorator = exports.createCommonPropertyDecorator = exports.createApiPropertyWithValidation = exports.createNestedObjectSchema = exports.createComposedSchema = exports.createPolymorphicSchema = exports.createSchemaReference = exports.buildOpenApiSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// 1. ADVANCED SCHEMA BUILDERS
// ============================================================================
/**
 * 1. Creates a comprehensive OpenAPI schema from builder configuration.
 *
 * @param {SwaggerSchemaBuilder} config - Schema builder configuration
 * @returns {Record<string, any>} Complete OpenAPI schema object
 *
 * @example
 * ```typescript
 * const schema = buildOpenApiSchema({
 *   type: 'object',
 *   description: 'Patient record',
 *   required: true,
 *   properties: {
 *     id: { type: 'string', format: 'uuid', readOnly: true },
 *     name: { type: 'string', minLength: 1, maxLength: 100 },
 *     age: { type: 'integer', minimum: 0, maximum: 150 }
 *   }
 * });
 * ```
 */
const buildOpenApiSchema = (config) => {
    const schema = {
        type: config.type,
    };
    // Basic properties
    if (config.format)
        schema.format = config.format;
    if (config.description)
        schema.description = config.description;
    if (config.example !== undefined)
        schema.example = config.example;
    if (config.examples)
        schema.examples = config.examples;
    if (config.nullable)
        schema.nullable = config.nullable;
    if (config.deprecated)
        schema.deprecated = config.deprecated;
    if (config.enum)
        schema.enum = config.enum;
    if (config.default !== undefined)
        schema.default = config.default;
    if (config.readOnly)
        schema.readOnly = config.readOnly;
    if (config.writeOnly)
        schema.writeOnly = config.writeOnly;
    // Numeric constraints
    if (config.minimum !== undefined)
        schema.minimum = config.minimum;
    if (config.maximum !== undefined)
        schema.maximum = config.maximum;
    if (config.exclusiveMinimum)
        schema.exclusiveMinimum = config.exclusiveMinimum;
    if (config.exclusiveMaximum)
        schema.exclusiveMaximum = config.exclusiveMaximum;
    // String constraints
    if (config.minLength !== undefined)
        schema.minLength = config.minLength;
    if (config.maxLength !== undefined)
        schema.maxLength = config.maxLength;
    if (config.pattern)
        schema.pattern = config.pattern;
    // Array constraints
    if (config.minItems !== undefined)
        schema.minItems = config.minItems;
    if (config.maxItems !== undefined)
        schema.maxItems = config.maxItems;
    if (config.uniqueItems)
        schema.uniqueItems = config.uniqueItems;
    if (config.items)
        schema.items = (0, exports.buildOpenApiSchema)(config.items);
    // Object properties
    if (config.properties) {
        schema.properties = Object.entries(config.properties).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: (0, exports.buildOpenApiSchema)(value),
        }), {});
    }
    if (config.additionalProperties !== undefined) {
        schema.additionalProperties =
            typeof config.additionalProperties === 'boolean'
                ? config.additionalProperties
                : (0, exports.buildOpenApiSchema)(config.additionalProperties);
    }
    // Composition
    if (config.allOf)
        schema.allOf = config.allOf.map(exports.buildOpenApiSchema);
    if (config.oneOf)
        schema.oneOf = config.oneOf.map(exports.buildOpenApiSchema);
    if (config.anyOf)
        schema.anyOf = config.anyOf.map(exports.buildOpenApiSchema);
    // Discriminator
    if (config.discriminator)
        schema.discriminator = config.discriminator;
    // Extensions
    if (config.xml)
        schema.xml = config.xml;
    if (config.externalDocs)
        schema.externalDocs = config.externalDocs;
    return schema;
};
exports.buildOpenApiSchema = buildOpenApiSchema;
/**
 * 2. Creates a schema reference to a component schema.
 *
 * @param {string} schemaName - Name of the schema component
 * @param {boolean} [isArray] - Whether this is an array of the schema
 * @returns {Record<string, any>} OpenAPI reference object
 *
 * @example
 * ```typescript
 * const ref = createSchemaReference('PatientDto', true);
 * // Result: { type: 'array', items: { $ref: '#/components/schemas/PatientDto' } }
 * ```
 */
const createSchemaReference = (schemaName, isArray = false) => {
    const ref = { $ref: `#/components/schemas/${schemaName}` };
    return isArray ? { type: 'array', items: ref } : ref;
};
exports.createSchemaReference = createSchemaReference;
/**
 * 3. Creates a polymorphic schema with discriminator support.
 *
 * @param {string} discriminatorProperty - Property name used for discrimination
 * @param {Record<string, string>} typeMapping - Mapping of discriminator values to schema names
 * @param {string} [baseSchema] - Optional base schema name
 * @returns {Record<string, any>} OpenAPI polymorphic schema
 *
 * @example
 * ```typescript
 * const schema = createPolymorphicSchema('type', {
 *   inpatient: 'InpatientDto',
 *   outpatient: 'OutpatientDto',
 *   emergency: 'EmergencyDto'
 * }, 'BasePatientDto');
 * ```
 */
const createPolymorphicSchema = (discriminatorProperty, typeMapping, baseSchema) => {
    const schemas = Object.values(typeMapping).map((schema) => ({ $ref: `#/components/schemas/${schema}` }));
    const discriminator = {
        propertyName: discriminatorProperty,
        mapping: Object.entries(typeMapping).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: `#/components/schemas/${value}`,
        }), {}),
    };
    if (baseSchema) {
        return {
            allOf: [
                { $ref: `#/components/schemas/${baseSchema}` },
                {
                    oneOf: schemas,
                    discriminator,
                },
            ],
        };
    }
    return {
        oneOf: schemas,
        discriminator,
    };
};
exports.createPolymorphicSchema = createPolymorphicSchema;
/**
 * 4. Creates a schema with composition using allOf, oneOf, or anyOf.
 *
 * @param {'allOf' | 'oneOf' | 'anyOf'} compositionType - Type of composition
 * @param {string[]} schemaNames - Names of schemas to compose
 * @param {Record<string, SwaggerSchemaBuilder>} [additionalProperties] - Extra properties to add
 * @returns {Record<string, any>} Composed OpenAPI schema
 *
 * @example
 * ```typescript
 * const schema = createComposedSchema('allOf', ['BaseDto', 'TimestampsDto'], {
 *   customField: { type: 'string', description: 'Custom field' }
 * });
 * ```
 */
const createComposedSchema = (compositionType, schemaNames, additionalProperties) => {
    const schemas = schemaNames.map((name) => ({ $ref: `#/components/schemas/${name}` }));
    if (additionalProperties) {
        schemas.push({
            type: 'object',
            properties: Object.entries(additionalProperties).reduce((acc, [key, value]) => ({
                ...acc,
                [key]: (0, exports.buildOpenApiSchema)(value),
            }), {}),
        });
    }
    return { [compositionType]: schemas };
};
exports.createComposedSchema = createComposedSchema;
/**
 * 5. Creates a deeply nested object schema with automatic property building.
 *
 * @param {Record<string, any>} structure - Nested structure definition
 * @param {string} [description] - Schema description
 * @returns {Record<string, any>} OpenAPI nested object schema
 *
 * @example
 * ```typescript
 * const schema = createNestedObjectSchema({
 *   patient: {
 *     personal: { name: 'string', age: 'number' },
 *     medical: { conditions: 'array<string>', allergies: 'array<string>' }
 *   }
 * }, 'Patient information');
 * ```
 */
const createNestedObjectSchema = (structure, description) => {
    const convertToSchema = (value) => {
        if (typeof value === 'string') {
            if (value.startsWith('array<')) {
                const itemType = value.slice(6, -1);
                return {
                    type: 'array',
                    items: convertToSchema(itemType),
                };
            }
            return { type: value };
        }
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            return {
                type: 'object',
                properties: Object.entries(value).reduce((acc, [key, val]) => ({
                    ...acc,
                    [key]: convertToSchema(val),
                }), {}),
            };
        }
        return value;
    };
    return {
        type: 'object',
        ...(description && { description }),
        properties: Object.entries(structure).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: convertToSchema(value),
        }), {}),
    };
};
exports.createNestedObjectSchema = createNestedObjectSchema;
// ============================================================================
// 2. ADVANCED DECORATOR FACTORIES
// ============================================================================
/**
 * 6. Creates a complete ApiProperty decorator with validation constraints.
 *
 * @param {Partial<ApiPropertyOptions>} options - Base property options
 * @param {ValidationConstraints} [validation] - Validation constraints
 * @returns {ApiPropertyOptions} Complete property decorator options
 *
 * @example
 * ```typescript
 * class PatientDto {
 *   @ApiProperty(createApiPropertyWithValidation({
 *     description: 'Patient email',
 *     example: 'patient@hospital.com'
 *   }, {
 *     format: 'email',
 *     maxLength: 255
 *   }))
 *   email: string;
 * }
 * ```
 */
const createApiPropertyWithValidation = (options, validation) => {
    const merged = {
        required: options.required ?? true,
        description: options.description || '',
        example: options.example,
        ...options,
    };
    if (validation) {
        if (validation.minLength !== undefined)
            merged.minLength = validation.minLength;
        if (validation.maxLength !== undefined)
            merged.maxLength = validation.maxLength;
        if (validation.minimum !== undefined)
            merged.minimum = validation.minimum;
        if (validation.maximum !== undefined)
            merged.maximum = validation.maximum;
        if (validation.pattern)
            merged.pattern = validation.pattern;
        if (validation.format)
            merged.format = validation.format;
        if (validation.enum)
            merged.enum = validation.enum;
        if (validation.uniqueItems)
            merged.uniqueItems = validation.uniqueItems;
    }
    return merged;
};
exports.createApiPropertyWithValidation = createApiPropertyWithValidation;
/**
 * 7. Creates a reusable decorator for common property patterns.
 *
 * @param {string} pattern - Pattern name (uuid, email, url, date, datetime, phone, etc.)
 * @param {Partial<ApiPropertyOptions>} [overrides] - Property overrides
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @createCommonPropertyDecorator('uuid', { description: 'User ID' })
 *   id: string;
 *
 *   @createCommonPropertyDecorator('email')
 *   email: string;
 * }
 * ```
 */
const createCommonPropertyDecorator = (pattern, overrides) => {
    const patterns = {
        uuid: {
            type: String,
            format: 'uuid',
            example: '123e4567-e89b-12d3-a456-426614174000',
        },
        email: {
            type: String,
            format: 'email',
            example: 'user@example.com',
        },
        url: {
            type: String,
            format: 'uri',
            example: 'https://example.com',
        },
        date: {
            type: String,
            format: 'date',
            example: '2024-01-01',
        },
        datetime: {
            type: String,
            format: 'date-time',
            example: '2024-01-01T12:00:00Z',
        },
        phone: {
            type: String,
            pattern: '^\\+?[1-9]\\d{1,14}$',
            example: '+1234567890',
        },
        currency: {
            type: Number,
            format: 'double',
            minimum: 0,
            example: 99.99,
        },
        ipv4: {
            type: String,
            format: 'ipv4',
            example: '192.168.1.1',
        },
        ipv6: {
            type: String,
            format: 'ipv6',
            example: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
        },
    };
    return (0, swagger_1.ApiProperty)({ ...patterns[pattern], ...overrides });
};
exports.createCommonPropertyDecorator = createCommonPropertyDecorator;
/**
 * 8. Creates a decorator for enum properties with descriptions.
 *
 * @param {any} enumType - Enum object
 * @param {Record<string, string>} [descriptions] - Descriptions for each enum value
 * @param {Partial<ApiPropertyOptions>} [options] - Additional options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * enum PatientStatus { Active = 'active', Inactive = 'inactive' }
 * class PatientDto {
 *   @createEnumPropertyDecorator(PatientStatus, {
 *     active: 'Patient is currently active',
 *     inactive: 'Patient is inactive'
 *   })
 *   status: PatientStatus;
 * }
 * ```
 */
const createEnumPropertyDecorator = (enumType, descriptions, options) => {
    const enumValues = Object.values(enumType);
    let description = options?.description || 'Enum field';
    if (descriptions) {
        description += '\n\nPossible values:\n';
        description += Object.entries(descriptions)
            .map(([key, desc]) => `- ${key}: ${desc}`)
            .join('\n');
    }
    return (0, swagger_1.ApiProperty)({
        enum: enumValues,
        description,
        example: enumValues[0],
        ...options,
    });
};
exports.createEnumPropertyDecorator = createEnumPropertyDecorator;
/**
 * 9. Creates a decorator for array properties with item schema.
 *
 * @param {Type<any> | string} itemType - Type of array items (DTO class or primitive)
 * @param {Partial<ApiPropertyOptions>} [options] - Additional options
 * @returns {PropertyDecorator} Property decorator
 *
 * @example
 * ```typescript
 * class AppointmentDto {
 *   @createArrayPropertyDecorator(PatientDto, {
 *     description: 'List of patients',
 *     minItems: 1,
 *     maxItems: 10
 *   })
 *   patients: PatientDto[];
 * }
 * ```
 */
const createArrayPropertyDecorator = (itemType, options) => {
    const baseOptions = {
        isArray: true,
        type: typeof itemType === 'string' ? itemType : itemType,
        ...options,
    };
    return (0, swagger_1.ApiProperty)(baseOptions);
};
exports.createArrayPropertyDecorator = createArrayPropertyDecorator;
// ============================================================================
// 3. RESPONSE DOCUMENTATION GENERATORS
// ============================================================================
/**
 * 10. Creates a complete success response with multiple status codes.
 *
 * @param {Type<any>} type - Response DTO type
 * @param {string} description - Response description
 * @param {number[]} [statusCodes] - Status codes to document (default: [200])
 * @returns {Record<number, ApiResponseOptions>} Response options by status code
 *
 * @example
 * ```typescript
 * const responses = createSuccessResponses(PatientDto, 'Patient retrieved', [200, 201]);
 * // Apply: Object.entries(responses).forEach(([code, opts]) => @ApiResponse(opts))
 * ```
 */
const createSuccessResponses = (type, description, statusCodes = [200]) => {
    return statusCodes.reduce((acc, code) => ({
        ...acc,
        [code]: {
            status: code,
            description: `${description} (${code})`,
            type,
        },
    }), {});
};
exports.createSuccessResponses = createSuccessResponses;
/**
 * 11. Creates error response documentation for all common HTTP errors.
 *
 * @param {Record<number, string>} [customMessages] - Custom error messages by status code
 * @returns {Record<number, ApiResponseOptions>} Complete error response set
 *
 * @example
 * ```typescript
 * const errorResponses = createStandardErrorResponses({
 *   404: 'Patient not found',
 *   409: 'Patient already exists'
 * });
 * ```
 */
const createStandardErrorResponses = (customMessages) => {
    const defaultMessages = {
        400: 'Bad Request - Invalid input data',
        401: 'Unauthorized - Authentication required',
        403: 'Forbidden - Insufficient permissions',
        404: 'Not Found - Resource does not exist',
        409: 'Conflict - Resource already exists',
        422: 'Unprocessable Entity - Validation failed',
        429: 'Too Many Requests - Rate limit exceeded',
        500: 'Internal Server Error',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        504: 'Gateway Timeout',
    };
    const messages = { ...defaultMessages, ...customMessages };
    return Object.entries(messages).reduce((acc, [code, message]) => ({
        ...acc,
        [Number(code)]: {
            status: Number(code),
            description: message,
            schema: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number', example: Number(code) },
                    message: { type: 'string', example: message },
                    error: { type: 'string' },
                    timestamp: { type: 'string', format: 'date-time' },
                },
            },
        },
    }), {});
};
exports.createStandardErrorResponses = createStandardErrorResponses;
/**
 * 12. Creates paginated response documentation with metadata.
 *
 * @param {Type<any>} itemType - Type of items in the array
 * @param {string} description - Response description
 * @param {boolean} [includeLinks] - Include HATEOAS links
 * @returns {ApiResponseOptions} Paginated response options
 *
 * @example
 * ```typescript
 * @ApiResponse(createPaginatedResponse(PatientDto, 'Paginated patients', true))
 * ```
 */
const createPaginatedResponse = (itemType, description, includeLinks = false) => {
    const schema = {
        type: 'object',
        properties: {
            data: {
                type: 'array',
                items: { $ref: (0, swagger_1.getSchemaPath)(itemType) },
            },
            metadata: {
                type: 'object',
                properties: {
                    page: { type: 'number', example: 1 },
                    pageSize: { type: 'number', example: 20 },
                    total: { type: 'number', example: 100 },
                    totalPages: { type: 'number', example: 5 },
                    hasNext: { type: 'boolean', example: true },
                    hasPrevious: { type: 'boolean', example: false },
                },
            },
        },
    };
    if (includeLinks) {
        schema.properties.links = {
            type: 'object',
            properties: {
                self: { type: 'string', format: 'uri' },
                first: { type: 'string', format: 'uri' },
                prev: { type: 'string', format: 'uri', nullable: true },
                next: { type: 'string', format: 'uri', nullable: true },
                last: { type: 'string', format: 'uri' },
            },
        };
    }
    return {
        status: 200,
        description,
        schema,
    };
};
exports.createPaginatedResponse = createPaginatedResponse;
/**
 * 13. Creates file download response documentation.
 *
 * @param {string | string[]} mimeTypes - MIME type(s) of downloadable file
 * @param {string} description - Download description
 * @param {Record<string, string>} [headers] - Response headers
 * @returns {ApiResponseOptions} File download response options
 *
 * @example
 * ```typescript
 * @ApiResponse(createFileDownloadResponse(
 *   ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
 *   'Download patient report',
 *   { 'Content-Disposition': 'attachment; filename="report.pdf"' }
 * ))
 * ```
 */
const createFileDownloadResponse = (mimeTypes, description, headers) => {
    const types = Array.isArray(mimeTypes) ? mimeTypes : [mimeTypes];
    const content = types.reduce((acc, type) => ({
        ...acc,
        [type]: {
            schema: {
                type: 'string',
                format: 'binary',
            },
        },
    }), {});
    return {
        status: 200,
        description,
        content,
        ...(headers && {
            headers: Object.entries(headers).reduce((acc, [key, value]) => ({
                ...acc,
                [key]: {
                    description: value,
                    schema: { type: 'string' },
                },
            }), {}),
        }),
    };
};
exports.createFileDownloadResponse = createFileDownloadResponse;
/**
 * 14. Creates multiple content-type response documentation.
 *
 * @param {ContentTypeConfig[]} contentTypes - Array of content type configurations
 * @param {string} description - Response description
 * @param {number} [statusCode] - HTTP status code (default: 200)
 * @returns {ApiResponseOptions} Multi-content response options
 *
 * @example
 * ```typescript
 * @ApiResponse(createMultiContentResponse([
 *   { mimeType: 'application/json', schema: PatientDto, example: {...} },
 *   { mimeType: 'application/xml', schema: PatientDto }
 * ], 'Patient data in multiple formats'))
 * ```
 */
const createMultiContentResponse = (contentTypes, description, statusCode = 200) => {
    const content = contentTypes.reduce((acc, config) => ({
        ...acc,
        [config.mimeType]: {
            schema: config.schema,
            ...(config.example && { example: config.example }),
            ...(config.examples && { examples: config.examples }),
            ...(config.encoding && { encoding: config.encoding }),
        },
    }), {});
    return {
        status: statusCode,
        description,
        content,
    };
};
exports.createMultiContentResponse = createMultiContentResponse;
// ============================================================================
// 4. REQUEST BODY & PARAMETER UTILITIES
// ============================================================================
/**
 * 15. Creates comprehensive pagination query parameters documentation.
 *
 * @param {number} [defaultLimit] - Default page size
 * @param {number} [maxLimit] - Maximum page size
 * @param {string[]} [sortableFields] - Fields that can be sorted
 * @returns {ApiQueryOptions[]} Array of query parameter options
 *
 * @example
 * ```typescript
 * createPaginationParams(20, 100, ['name', 'createdAt', 'updatedAt'])
 *   .forEach(param => @ApiQuery(param))
 * ```
 */
const createPaginationParams = (defaultLimit = 20, maxLimit = 100, sortableFields) => {
    const params = [
        {
            name: 'page',
            required: false,
            type: Number,
            description: 'Page number (1-indexed)',
            example: 1,
            schema: { minimum: 1, default: 1 },
        },
        {
            name: 'limit',
            required: false,
            type: Number,
            description: `Items per page (max: ${maxLimit})`,
            example: defaultLimit,
            schema: { minimum: 1, maximum: maxLimit, default: defaultLimit },
        },
    ];
    if (sortableFields && sortableFields.length > 0) {
        params.push({
            name: 'sortBy',
            required: false,
            type: String,
            description: `Field to sort by. Available fields: ${sortableFields.join(', ')}`,
            enum: sortableFields,
            example: sortableFields[0],
        }, {
            name: 'sortOrder',
            required: false,
            type: String,
            description: 'Sort order',
            enum: ['asc', 'desc'],
            example: 'desc',
        });
    }
    return params;
};
exports.createPaginationParams = createPaginationParams;
/**
 * 16. Creates search and filter query parameters documentation.
 *
 * @param {string[]} searchableFields - Fields searchable by text query
 * @param {Record<string, any>} [filterFields] - Fields filterable with their types
 * @returns {ApiQueryOptions[]} Array of query parameter options
 *
 * @example
 * ```typescript
 * createSearchFilterParams(
 *   ['name', 'email', 'phone'],
 *   { status: ['active', 'inactive'], department: 'string' }
 * ).forEach(param => @ApiQuery(param))
 * ```
 */
const createSearchFilterParams = (searchableFields, filterFields) => {
    const params = [
        {
            name: 'q',
            required: false,
            type: String,
            description: `Search query. Searches in: ${searchableFields.join(', ')}`,
            example: 'search term',
        },
    ];
    if (filterFields) {
        Object.entries(filterFields).forEach(([field, config]) => {
            const param = {
                name: field,
                required: false,
                description: `Filter by ${field}`,
            };
            if (Array.isArray(config)) {
                param.enum = config;
                param.type = String;
            }
            else {
                param.type = config;
            }
            params.push(param);
        });
    }
    return params;
};
exports.createSearchFilterParams = createSearchFilterParams;
/**
 * 17. Creates date range query parameters documentation.
 *
 * @param {string[]} dateFields - Date fields that support range queries
 * @returns {ApiQueryOptions[]} Array of date range query parameters
 *
 * @example
 * ```typescript
 * createDateRangeParams(['createdAt', 'updatedAt', 'appointmentDate'])
 *   .forEach(param => @ApiQuery(param))
 * ```
 */
const createDateRangeParams = (dateFields) => {
    const params = [];
    dateFields.forEach((field) => {
        params.push({
            name: `${field}From`,
            required: false,
            type: String,
            description: `Start date for ${field} range (ISO 8601)`,
            example: '2024-01-01T00:00:00Z',
            schema: { format: 'date-time' },
        }, {
            name: `${field}To`,
            required: false,
            type: String,
            description: `End date for ${field} range (ISO 8601)`,
            example: '2024-12-31T23:59:59Z',
            schema: { format: 'date-time' },
        });
    });
    return params;
};
exports.createDateRangeParams = createDateRangeParams;
/**
 * 18. Creates file upload body documentation with validation.
 *
 * @param {boolean} multiple - Allow multiple files
 * @param {string[]} [allowedTypes] - Allowed MIME types
 * @param {number} [maxSizeBytes] - Maximum file size in bytes
 * @param {Record<string, SwaggerSchemaBuilder>} [additionalFields] - Extra form fields
 * @returns {ApiBodyOptions} File upload body options
 *
 * @example
 * ```typescript
 * @ApiBody(createFileUploadBody(
 *   true,
 *   ['image/png', 'image/jpeg', 'application/pdf'],
 *   10485760,
 *   { description: { type: 'string', required: false } }
 * ))
 * ```
 */
const createFileUploadBody = (multiple, allowedTypes, maxSizeBytes, additionalFields) => {
    let description = multiple ? 'Upload multiple files' : 'Upload a single file';
    if (allowedTypes) {
        description += `\n\nAllowed types: ${allowedTypes.join(', ')}`;
    }
    if (maxSizeBytes) {
        const maxSizeMB = (maxSizeBytes / 1024 / 1024).toFixed(2);
        description += `\n\nMax size per file: ${maxSizeMB} MB`;
    }
    const properties = {
        file: multiple
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
    };
    if (additionalFields) {
        Object.entries(additionalFields).forEach(([key, schema]) => {
            properties[key] = (0, exports.buildOpenApiSchema)(schema);
        });
    }
    return {
        description,
        required: true,
        schema: {
            type: 'object',
            properties,
        },
    };
};
exports.createFileUploadBody = createFileUploadBody;
/**
 * 19. Creates multipart form-data body documentation.
 *
 * @param {Record<string, SwaggerSchemaBuilder>} fields - Form fields
 * @param {string[]} [requiredFields] - Required field names
 * @returns {ApiBodyOptions} Multipart form body options
 *
 * @example
 * ```typescript
 * @ApiBody(createMultipartFormBody({
 *   patientId: { type: 'string', format: 'uuid' },
 *   notes: { type: 'string', maxLength: 500 },
 *   attachment: { type: 'string', format: 'binary' }
 * }, ['patientId']))
 * ```
 */
const createMultipartFormBody = (fields, requiredFields) => {
    const properties = Object.entries(fields).reduce((acc, [key, schema]) => ({
        ...acc,
        [key]: (0, exports.buildOpenApiSchema)(schema),
    }), {});
    return {
        description: 'Multipart form data',
        required: true,
        schema: {
            type: 'object',
            properties,
            ...(requiredFields && { required: requiredFields }),
        },
    };
};
exports.createMultipartFormBody = createMultipartFormBody;
// ============================================================================
// 5. SECURITY SCHEME CONFIGURATIONS
// ============================================================================
/**
 * 20. Creates complete Bearer JWT security scheme with scopes.
 *
 * @param {Record<string, string>} [scopes] - Available scopes and descriptions
 * @param {string} [description] - Custom description
 * @returns {SecuritySchemeConfig} Bearer security scheme
 *
 * @example
 * ```typescript
 * const bearerScheme = createBearerSecurityScheme({
 *   'patient:read': 'Read patient data',
 *   'patient:write': 'Modify patient data',
 *   'admin': 'Full administrative access'
 * });
 * ```
 */
const createBearerSecurityScheme = (scopes, description) => {
    let desc = description ||
        'JWT Bearer authentication. Include token in Authorization header: "Bearer <token>"';
    if (scopes) {
        desc += '\n\nAvailable scopes:\n';
        desc += Object.entries(scopes)
            .map(([scope, scopeDesc]) => `- ${scope}: ${scopeDesc}`)
            .join('\n');
    }
    return {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: desc,
    };
};
exports.createBearerSecurityScheme = createBearerSecurityScheme;
/**
 * 21. Creates API Key security scheme for header, query, or cookie.
 *
 * @param {string} name - Parameter name
 * @param {'header' | 'query' | 'cookie'} location - Where the key is sent
 * @param {string} [description] - Custom description
 * @returns {SecuritySchemeConfig} API Key security scheme
 *
 * @example
 * ```typescript
 * const apiKeyScheme = createApiKeySecurityScheme(
 *   'X-API-Key',
 *   'header',
 *   'API key provided during registration'
 * );
 * ```
 */
const createApiKeySecurityScheme = (name, location, description) => {
    return {
        type: 'apiKey',
        name,
        in: location,
        description: description || `API Key authentication via ${location}: ${name}`,
    };
};
exports.createApiKeySecurityScheme = createApiKeySecurityScheme;
/**
 * 22. Creates comprehensive OAuth2 security scheme with multiple flows.
 *
 * @param {OAuth2Flows} flows - OAuth2 flow configurations
 * @param {string} [description] - Custom description
 * @returns {SecuritySchemeConfig} OAuth2 security scheme
 *
 * @example
 * ```typescript
 * const oauth2Scheme = createOAuth2SecurityScheme({
 *   authorizationCode: {
 *     authorizationUrl: 'https://auth.example.com/oauth/authorize',
 *     tokenUrl: 'https://auth.example.com/oauth/token',
 *     refreshUrl: 'https://auth.example.com/oauth/refresh',
 *     scopes: {
 *       'read': 'Read access',
 *       'write': 'Write access',
 *       'admin': 'Admin access'
 *     }
 *   }
 * });
 * ```
 */
const createOAuth2SecurityScheme = (flows, description) => {
    return {
        type: 'oauth2',
        flows,
        description: description || 'OAuth 2.0 authentication',
    };
};
exports.createOAuth2SecurityScheme = createOAuth2SecurityScheme;
/**
 * 23. Creates OpenID Connect security scheme.
 *
 * @param {string} openIdConnectUrl - OpenID Connect discovery URL
 * @param {string} [description] - Custom description
 * @returns {SecuritySchemeConfig} OpenID Connect security scheme
 *
 * @example
 * ```typescript
 * const oidcScheme = createOpenIdConnectScheme(
 *   'https://auth.example.com/.well-known/openid-configuration',
 *   'OpenID Connect authentication with SSO support'
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
 * 24. Creates combined security requirements (AND/OR logic).
 *
 * @param {Array<Record<string, string[]>>} requirements - Security requirement alternatives
 * @param {'AND' | 'OR'} logic - Combination logic
 * @returns {Array<Record<string, string[]>>} Security requirements array
 *
 * @example
 * ```typescript
 * // Requires BOTH bearer AND apiKey
 * const andSecurity = createCombinedSecurityRequirements([
 *   { bearer: ['admin'] },
 *   { apiKey: [] }
 * ], 'AND');
 *
 * // Requires EITHER bearer OR apiKey
 * const orSecurity = createCombinedSecurityRequirements([
 *   { bearer: ['user'] },
 *   { apiKey: [] }
 * ], 'OR');
 * ```
 */
const createCombinedSecurityRequirements = (requirements, logic) => {
    if (logic === 'AND') {
        // Combine all into single object for AND logic
        return [
            requirements.reduce((acc, req) => ({
                ...acc,
                ...req,
            }), {}),
        ];
    }
    // Return array of alternatives for OR logic
    return requirements;
};
exports.createCombinedSecurityRequirements = createCombinedSecurityRequirements;
// ============================================================================
// 6. SWAGGER UI CUSTOMIZATION
// ============================================================================
/**
 * 25. Creates complete Swagger UI configuration with custom theme.
 *
 * @param {string} title - Application title
 * @param {object} [customization] - UI customization options
 * @returns {object} Swagger UI configuration
 *
 * @example
 * ```typescript
 * const swaggerConfig = createSwaggerUIConfiguration('White Cross API', {
 *   logo: '/assets/logo.png',
 *   primaryColor: '#1976d2',
 *   persistAuthorization: true,
 *   tryItOutEnabled: true
 * });
 * ```
 */
const createSwaggerUIConfiguration = (title, customization) => {
    const customCss = `
    .swagger-ui .topbar {
      background-color: ${customization?.primaryColor || '#1976d2'};
    }
    ${customization?.logo ? `.swagger-ui .topbar-wrapper img { content: url(${customization.logo}); }` : ''}
  `;
    return {
        customSiteTitle: title,
        customCss,
        customfavIcon: '/favicon.ico',
        swaggerOptions: {
            persistAuthorization: customization?.persistAuthorization ?? true,
            displayRequestDuration: customization?.displayRequestDuration ?? true,
            filter: customization?.filter ?? true,
            tryItOutEnabled: customization?.tryItOutEnabled ?? true,
            syntaxHighlight: customization?.syntaxHighlight ?? true,
            defaultModelsExpandDepth: customization?.defaultModelsExpandDepth ?? 1,
            defaultModelExpandDepth: customization?.defaultModelExpandDepth ?? 1,
            deepLinking: customization?.deepLinking ?? true,
        },
    };
};
exports.createSwaggerUIConfiguration = createSwaggerUIConfiguration;
/**
 * 26. Creates OpenAPI document info section with contact and license.
 *
 * @param {string} title - API title
 * @param {string} version - API version
 * @param {string} description - API description
 * @param {object} [metadata] - Additional metadata
 * @returns {object} OpenAPI info object
 *
 * @example
 * ```typescript
 * const info = createOpenApiInfo(
 *   'White Cross Healthcare API',
 *   '1.0.0',
 *   'Comprehensive healthcare management API',
 *   {
 *     contact: { name: 'API Team', email: 'api@whitecross.com' },
 *     license: { name: 'Proprietary' },
 *     termsOfService: 'https://whitecross.com/terms'
 *   }
 * );
 * ```
 */
const createOpenApiInfo = (title, version, description, metadata) => {
    return {
        title,
        version,
        description,
        ...(metadata?.contact && { contact: metadata.contact }),
        ...(metadata?.license && { license: metadata.license }),
        ...(metadata?.termsOfService && { termsOfService: metadata.termsOfService }),
    };
};
exports.createOpenApiInfo = createOpenApiInfo;
/**
 * 27. Creates server configurations for multiple environments.
 *
 * @param {ServerConfig[]} servers - Server configurations
 * @returns {object[]} OpenAPI servers array
 *
 * @example
 * ```typescript
 * const servers = createServerConfigurations([
 *   { url: 'https://api.whitecross.com/v1', description: 'Production' },
 *   { url: 'https://staging-api.whitecross.com/v1', description: 'Staging' },
 *   { url: 'http://localhost:3000', description: 'Local Development',
 *     variables: { port: { default: '3000', enum: ['3000', '3001'] } }
 *   }
 * ]);
 * ```
 */
const createServerConfigurations = (servers) => {
    return servers.map((server) => ({
        url: server.url,
        ...(server.description && { description: server.description }),
        ...(server.variables && { variables: server.variables }),
    }));
};
exports.createServerConfigurations = createServerConfigurations;
/**
 * 28. Creates organized tag groups for API documentation.
 *
 * @param {SwaggerTagConfig[]} tags - Tag configurations
 * @returns {object[]} OpenAPI tags array
 *
 * @example
 * ```typescript
 * const tags = createApiTagGroups([
 *   { name: 'Patients', description: 'Patient management endpoints',
 *     externalDocs: { url: 'https://docs.whitecross.com/patients' } },
 *   { name: 'Appointments', description: 'Appointment scheduling' },
 *   { name: 'Authentication', description: 'Auth and security' }
 * ]);
 * ```
 */
const createApiTagGroups = (tags) => {
    return tags.map((tag) => ({
        name: tag.name,
        description: tag.description,
        ...(tag.externalDocs && { externalDocs: tag.externalDocs }),
    }));
};
exports.createApiTagGroups = createApiTagGroups;
// ============================================================================
// 7. EXAMPLE & VALIDATION GENERATORS
// ============================================================================
/**
 * 29. Creates multiple named examples for request/response documentation.
 *
 * @param {Record<string, ApiExampleObject>} examples - Named example objects
 * @returns {Record<string, any>} OpenAPI examples object
 *
 * @example
 * ```typescript
 * const examples = createNamedExamples({
 *   success: {
 *     summary: 'Successful response',
 *     value: { id: '123', name: 'John Doe', status: 'active' }
 *   },
 *   partial: {
 *     summary: 'Partial data',
 *     description: 'When some fields are missing',
 *     value: { id: '456', name: 'Jane Doe' }
 *   }
 * });
 * ```
 */
const createNamedExamples = (examples) => {
    return Object.entries(examples).reduce((acc, [name, example]) => ({
        ...acc,
        [name]: {
            ...(example.summary && { summary: example.summary }),
            ...(example.description && { description: example.description }),
            ...(example.value && { value: example.value }),
            ...(example.externalValue && { externalValue: example.externalValue }),
        },
    }), {});
};
exports.createNamedExamples = createNamedExamples;
/**
 * 30. Generates realistic example data from schema definition.
 *
 * @param {SwaggerSchemaBuilder} schema - Schema to generate example from
 * @param {Record<string, any>} [overrides] - Override specific field values
 * @returns {any} Generated example value
 *
 * @example
 * ```typescript
 * const example = generateExampleFromSchema({
 *   type: 'object',
 *   properties: {
 *     id: { type: 'string', format: 'uuid' },
 *     email: { type: 'string', format: 'email' },
 *     age: { type: 'integer', minimum: 0 }
 *   }
 * }, { age: 30 });
 * ```
 */
const generateExampleFromSchema = (schema, overrides) => {
    if (schema.example !== undefined) {
        return schema.example;
    }
    if (schema.enum && schema.enum.length > 0) {
        return schema.enum[0];
    }
    if (schema.default !== undefined) {
        return schema.default;
    }
    switch (schema.type) {
        case 'string':
            if (schema.format === 'email')
                return 'user@example.com';
            if (schema.format === 'uri' || schema.format === 'url')
                return 'https://example.com';
            if (schema.format === 'date')
                return '2024-01-01';
            if (schema.format === 'date-time')
                return '2024-01-01T12:00:00Z';
            if (schema.format === 'uuid')
                return '123e4567-e89b-12d3-a456-426614174000';
            if (schema.format === 'ipv4')
                return '192.168.1.1';
            if (schema.format === 'ipv6')
                return '2001:0db8:85a3:0000:0000:8a2e:0370:7334';
            if (schema.format === 'password')
                return 'SecureP@ssw0rd123';
            if (schema.pattern)
                return 'pattern-match';
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
                const example = Object.entries(schema.properties).reduce((acc, [key, value]) => ({
                    ...acc,
                    [key]: (0, exports.generateExampleFromSchema)(value),
                }), {});
                return overrides ? { ...example, ...overrides } : example;
            }
            return {};
        case 'null':
            return null;
        default:
            return null;
    }
};
exports.generateExampleFromSchema = generateExampleFromSchema;
/**
 * 31. Creates validation constraint documentation strings.
 *
 * @param {ValidationConstraints} constraints - Validation constraints
 * @returns {string} Formatted constraint documentation
 *
 * @example
 * ```typescript
 * const validationDoc = createValidationDocumentation({
 *   minLength: 8,
 *   maxLength: 100,
 *   pattern: '^[a-zA-Z0-9]+$',
 *   format: 'email'
 * });
 * // Result: "- Min length: 8\n- Max length: 100\n- Pattern: ^[a-zA-Z0-9]+$\n- Format: email"
 * ```
 */
const createValidationDocumentation = (constraints) => {
    const docs = [];
    if (constraints.minLength !== undefined) {
        docs.push(`Min length: ${constraints.minLength}`);
    }
    if (constraints.maxLength !== undefined) {
        docs.push(`Max length: ${constraints.maxLength}`);
    }
    if (constraints.minimum !== undefined) {
        docs.push(`Min value: ${constraints.minimum}`);
    }
    if (constraints.maximum !== undefined) {
        docs.push(`Max value: ${constraints.maximum}`);
    }
    if (constraints.pattern) {
        docs.push(`Pattern: ${constraints.pattern}`);
    }
    if (constraints.format) {
        docs.push(`Format: ${constraints.format}`);
    }
    if (constraints.enum) {
        docs.push(`Allowed values: ${constraints.enum.join(', ')}`);
    }
    if (constraints.multipleOf !== undefined) {
        docs.push(`Multiple of: ${constraints.multipleOf}`);
    }
    if (constraints.uniqueItems) {
        docs.push('Items must be unique');
    }
    return docs.map((doc) => `- ${doc}`).join('\n');
};
exports.createValidationDocumentation = createValidationDocumentation;
// ============================================================================
// 8. API VERSIONING & DEPRECATION
// ============================================================================
/**
 * 32. Creates API version documentation with deprecation info.
 *
 * @param {ApiVersionConfig} config - Version configuration
 * @returns {object} Version metadata object
 *
 * @example
 * ```typescript
 * const versionInfo = createApiVersionInfo({
 *   version: 'v1',
 *   deprecated: true,
 *   deprecatedSince: '2024-01-01',
 *   sunsetDate: '2024-06-01',
 *   alternativeVersion: 'v2'
 * });
 * ```
 */
const createApiVersionInfo = (config) => {
    const info = {
        version: config.version,
    };
    if (config.deprecated) {
        info.deprecated = true;
        info['x-deprecated-since'] = config.deprecatedSince;
        info['x-sunset-date'] = config.sunsetDate;
        info['x-alternative-version'] = config.alternativeVersion;
        let deprecationMessage = `⚠️ API version ${config.version} is deprecated`;
        if (config.deprecatedSince) {
            deprecationMessage += ` since ${config.deprecatedSince}`;
        }
        if (config.sunsetDate) {
            deprecationMessage += ` and will be sunset on ${config.sunsetDate}`;
        }
        if (config.alternativeVersion) {
            deprecationMessage += `. Please migrate to ${config.alternativeVersion}`;
        }
        info['x-deprecation-message'] = deprecationMessage;
    }
    return info;
};
exports.createApiVersionInfo = createApiVersionInfo;
/**
 * 33. Creates endpoint deprecation decorator with migration info.
 *
 * @param {string} reason - Deprecation reason
 * @param {string} [alternativeEndpoint] - Alternative endpoint to use
 * @param {string} [sunsetDate] - When endpoint will be removed
 * @returns {object} Deprecation metadata
 *
 * @example
 * ```typescript
 * @ApiOperation({
 *   ...createEndpointDeprecation(
 *     'Replaced with more efficient implementation',
 *     'GET /api/v2/patients',
 *     '2024-06-01'
 *   )
 * })
 * ```
 */
const createEndpointDeprecation = (reason, alternativeEndpoint, sunsetDate) => {
    let description = `⚠️ **DEPRECATED**\n\n${reason}`;
    if (alternativeEndpoint) {
        description += `\n\n**Alternative**: Use \`${alternativeEndpoint}\` instead.`;
    }
    if (sunsetDate) {
        description += `\n\n**Sunset Date**: This endpoint will be removed on ${sunsetDate}.`;
    }
    return {
        deprecated: true,
        description,
    };
};
exports.createEndpointDeprecation = createEndpointDeprecation;
/**
 * 34. Creates version-specific operation documentation.
 *
 * @param {string} version - API version
 * @param {string} summary - Operation summary
 * @param {string} [description] - Detailed description
 * @returns {ApiOperationOptions} Versioned operation options
 *
 * @example
 * ```typescript
 * @ApiOperation(createVersionedOperation('v2', 'Get patient', 'Retrieves patient with enhanced data'))
 * ```
 */
const createVersionedOperation = (version, summary, description) => {
    return {
        summary: `[${version}] ${summary}`,
        description: description || summary,
        tags: [`${version}`],
    };
};
exports.createVersionedOperation = createVersionedOperation;
// ============================================================================
// 9. WEBHOOKS & CALLBACKS
// ============================================================================
/**
 * 35. Creates webhook endpoint documentation.
 *
 * @param {string} eventName - Webhook event name
 * @param {Type<any>} payloadType - Webhook payload DTO type
 * @param {string} description - Webhook description
 * @returns {object} Webhook documentation object
 *
 * @example
 * ```typescript
 * const webhook = createWebhookDocumentation(
 *   'patient.created',
 *   PatientCreatedEventDto,
 *   'Triggered when a new patient is created in the system'
 * );
 * ```
 */
const createWebhookDocumentation = (eventName, payloadType, description) => {
    return {
        [eventName]: {
            post: {
                summary: `Webhook: ${eventName}`,
                description,
                tags: ['Webhooks'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: (0, swagger_1.getSchemaPath)(payloadType) },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Webhook successfully processed',
                    },
                    401: {
                        description: 'Invalid webhook signature',
                    },
                },
            },
        },
    };
};
exports.createWebhookDocumentation = createWebhookDocumentation;
/**
 * 36. Creates callback documentation for async operations.
 *
 * @param {CallbackConfig[]} callbacks - Callback configurations
 * @returns {object} Callbacks documentation
 *
 * @example
 * ```typescript
 * const callbacks = createCallbackDocumentation([
 *   {
 *     expression: '{$request.body#/callbackUrl}',
 *     operation: {
 *       post: {
 *         requestBody: { content: { 'application/json': { schema: ResultDto } } },
 *         responses: { 200: { description: 'Callback received' } }
 *       }
 *     }
 *   }
 * ]);
 * ```
 */
const createCallbackDocumentation = (callbacks) => {
    return callbacks.reduce((acc, callback) => ({
        ...acc,
        [callback.expression]: callback.operation,
    }), {});
};
exports.createCallbackDocumentation = createCallbackDocumentation;
// ============================================================================
// 10. ADVANCED RESPONSE PATTERNS
// ============================================================================
/**
 * 37. Creates HATEOAS links documentation.
 *
 * @param {LinkConfig[]} links - Link configurations
 * @returns {object} Links documentation
 *
 * @example
 * ```typescript
 * const links = createHATEOASLinks([
 *   { operationId: 'getPatient', description: 'Get patient details' },
 *   { operationId: 'updatePatient', description: 'Update patient' },
 *   { operationId: 'deletePatient', description: 'Delete patient' }
 * ]);
 * ```
 */
const createHATEOASLinks = (links) => {
    return links.reduce((acc, link, index) => ({
        ...acc,
        [`link${index + 1}`]: {
            ...(link.operationRef && { operationRef: link.operationRef }),
            ...(link.operationId && { operationId: link.operationId }),
            ...(link.parameters && { parameters: link.parameters }),
            ...(link.requestBody && { requestBody: link.requestBody }),
            ...(link.description && { description: link.description }),
            ...(link.server && { server: link.server }),
        },
    }), {});
};
exports.createHATEOASLinks = createHATEOASLinks;
/**
 * 38. Creates event stream (SSE) response documentation.
 *
 * @param {Type<any>} eventType - Event payload type
 * @param {string} description - Stream description
 * @returns {ApiResponseOptions} SSE response options
 *
 * @example
 * ```typescript
 * @ApiResponse(createEventStreamResponse(
 *   PatientUpdateEventDto,
 *   'Real-time patient updates via Server-Sent Events'
 * ))
 * ```
 */
const createEventStreamResponse = (eventType, description) => {
    return {
        status: 200,
        description,
        content: {
            'text/event-stream': {
                schema: {
                    type: 'string',
                    description: 'Server-Sent Events stream',
                    example: `event: update\ndata: ${JSON.stringify((0, exports.generateExampleFromSchema)({ type: 'object' }))}\n\n`,
                },
            },
        },
        headers: {
            'Content-Type': {
                description: 'SSE content type',
                schema: { type: 'string', example: 'text/event-stream' },
            },
            'Cache-Control': {
                description: 'Disable caching for SSE',
                schema: { type: 'string', example: 'no-cache' },
            },
            Connection: {
                description: 'Keep connection alive',
                schema: { type: 'string', example: 'keep-alive' },
            },
        },
    };
};
exports.createEventStreamResponse = createEventStreamResponse;
/**
 * 39. Creates batch operation response documentation.
 *
 * @param {Type<any>} itemType - Single item type
 * @param {boolean} [includeErrors] - Include error details per item
 * @returns {ApiResponseOptions} Batch response options
 *
 * @example
 * ```typescript
 * @ApiResponse(createBatchOperationResponse(PatientDto, true))
 * ```
 */
const createBatchOperationResponse = (itemType, includeErrors = true) => {
    const schema = {
        type: 'object',
        properties: {
            successful: {
                type: 'array',
                items: { $ref: (0, swagger_1.getSchemaPath)(itemType) },
                description: 'Successfully processed items',
            },
            total: {
                type: 'number',
                description: 'Total items in batch',
            },
            successCount: {
                type: 'number',
                description: 'Number of successful operations',
            },
        },
    };
    if (includeErrors) {
        schema.properties.failed = {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    index: { type: 'number', description: 'Item index in batch' },
                    item: { $ref: (0, swagger_1.getSchemaPath)(itemType) },
                    error: {
                        type: 'object',
                        properties: {
                            code: { type: 'string' },
                            message: { type: 'string' },
                        },
                    },
                },
            },
            description: 'Failed items with error details',
        };
        schema.properties.failureCount = {
            type: 'number',
            description: 'Number of failed operations',
        };
    }
    return {
        status: 207,
        description: 'Multi-Status - Batch operation results',
        schema,
    };
};
exports.createBatchOperationResponse = createBatchOperationResponse;
// ============================================================================
// 11. SCHEMA VALIDATION & TRANSFORMATION
// ============================================================================
/**
 * 40. Creates schema with conditional validation rules.
 *
 * @param {SwaggerSchemaBuilder} baseSchema - Base schema
 * @param {Record<string, any>} conditions - Conditional rules
 * @returns {Record<string, any>} Conditional schema
 *
 * @example
 * ```typescript
 * const schema = createConditionalSchema(
 *   { type: 'object', properties: { type: { type: 'string' } } },
 *   {
 *     if: { properties: { type: { const: 'email' } } },
 *     then: { properties: { emailAddress: { type: 'string', format: 'email' } } },
 *     else: { properties: { phoneNumber: { type: 'string' } } }
 *   }
 * );
 * ```
 */
const createConditionalSchema = (baseSchema, conditions) => {
    return {
        ...(0, exports.buildOpenApiSchema)(baseSchema),
        ...conditions,
    };
};
exports.createConditionalSchema = createConditionalSchema;
/**
 * 41. Creates schema with custom format validators.
 *
 * @param {string} format - Custom format name
 * @param {string} pattern - Regex pattern for validation
 * @param {string} description - Format description
 * @param {string} example - Example value
 * @returns {Record<string, any>} Custom format schema
 *
 * @example
 * ```typescript
 * const schema = createCustomFormatSchema(
 *   'medical-record-number',
 *   '^MRN-[0-9]{8}$',
 *   'Medical Record Number format: MRN-########',
 *   'MRN-12345678'
 * );
 * ```
 */
const createCustomFormatSchema = (format, pattern, description, example) => {
    return {
        type: 'string',
        format,
        pattern,
        description,
        example,
        'x-custom-format': true,
    };
};
exports.createCustomFormatSchema = createCustomFormatSchema;
/**
 * 42. Creates readonly/writeonly field configurations.
 *
 * @param {Record<string, SwaggerSchemaBuilder>} properties - Object properties
 * @param {string[]} [readOnlyFields] - Fields that are read-only
 * @param {string[]} [writeOnlyFields] - Fields that are write-only
 * @returns {Record<string, any>} Schema with access modifiers
 *
 * @example
 * ```typescript
 * const schema = createAccessModifierSchema({
 *   id: { type: 'string', format: 'uuid' },
 *   password: { type: 'string', format: 'password' },
 *   name: { type: 'string' }
 * }, ['id'], ['password']);
 * ```
 */
const createAccessModifierSchema = (properties, readOnlyFields, writeOnlyFields) => {
    const processedProperties = Object.entries(properties).reduce((acc, [key, schema]) => {
        const processed = (0, exports.buildOpenApiSchema)(schema);
        if (readOnlyFields?.includes(key)) {
            processed.readOnly = true;
        }
        if (writeOnlyFields?.includes(key)) {
            processed.writeOnly = true;
        }
        return {
            ...acc,
            [key]: processed,
        };
    }, {});
    return {
        type: 'object',
        properties: processedProperties,
    };
};
exports.createAccessModifierSchema = createAccessModifierSchema;
// ============================================================================
// 12. HEALTH CHECK & MONITORING
// ============================================================================
/**
 * 43. Creates comprehensive health check response schema.
 *
 * @param {string[]} dependencies - Service dependencies to check
 * @returns {Record<string, any>} Health check schema
 *
 * @example
 * ```typescript
 * const healthSchema = createHealthCheckSchema(['database', 'redis', 'rabbitmq', 's3']);
 * ```
 */
const createHealthCheckSchema = (dependencies) => {
    return {
        type: 'object',
        properties: {
            status: {
                type: 'string',
                enum: ['ok', 'degraded', 'down'],
                description: 'Overall system health status',
                example: 'ok',
            },
            version: {
                type: 'string',
                description: 'Application version',
                example: '1.0.0',
            },
            timestamp: {
                type: 'string',
                format: 'date-time',
                description: 'Health check timestamp',
                example: '2024-01-01T12:00:00Z',
            },
            uptime: {
                type: 'number',
                description: 'System uptime in seconds',
                example: 3600,
            },
            dependencies: {
                type: 'object',
                properties: dependencies.reduce((acc, dep) => ({
                    ...acc,
                    [dep]: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'string',
                                enum: ['ok', 'degraded', 'down'],
                                example: 'ok',
                            },
                            responseTime: {
                                type: 'number',
                                description: 'Response time in milliseconds',
                                example: 25,
                            },
                            message: {
                                type: 'string',
                                nullable: true,
                                description: 'Additional status information',
                            },
                        },
                    },
                }), {}),
            },
        },
        required: ['status', 'timestamp', 'uptime', 'dependencies'],
    };
};
exports.createHealthCheckSchema = createHealthCheckSchema;
/**
 * 44. Creates metrics endpoint response schema.
 *
 * @param {string[]} metricNames - Metrics to document
 * @returns {Record<string, any>} Metrics schema
 *
 * @example
 * ```typescript
 * const metricsSchema = createMetricsSchema([
 *   'http_requests_total',
 *   'http_request_duration_seconds',
 *   'database_connections_active'
 * ]);
 * ```
 */
const createMetricsSchema = (metricNames) => {
    return {
        type: 'object',
        properties: {
            metrics: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            enum: metricNames,
                            description: 'Metric name',
                        },
                        type: {
                            type: 'string',
                            enum: ['counter', 'gauge', 'histogram', 'summary'],
                            description: 'Metric type',
                        },
                        value: {
                            type: 'number',
                            description: 'Current metric value',
                        },
                        labels: {
                            type: 'object',
                            additionalProperties: { type: 'string' },
                            description: 'Metric labels',
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Metric timestamp',
                        },
                    },
                },
            },
        },
    };
};
exports.createMetricsSchema = createMetricsSchema;
// ============================================================================
// 13. RATE LIMITING & QUOTA DOCUMENTATION
// ============================================================================
/**
 * 45. Creates rate limit headers documentation.
 *
 * @param {number} limit - Rate limit (requests per window)
 * @param {string} window - Time window (e.g., '1h', '1m', '1d')
 * @returns {Record<string, any>} Rate limit headers
 *
 * @example
 * ```typescript
 * const rateLimitHeaders = createRateLimitHeaders(100, '1h');
 * // Add to response documentation
 * ```
 */
const createRateLimitHeaders = (limit, window) => {
    return {
        'X-RateLimit-Limit': {
            description: `Maximum requests allowed per ${window}`,
            schema: { type: 'integer', example: limit },
        },
        'X-RateLimit-Remaining': {
            description: 'Remaining requests in current window',
            schema: { type: 'integer', example: Math.floor(limit * 0.75) },
        },
        'X-RateLimit-Reset': {
            description: 'Unix timestamp when rate limit resets',
            schema: { type: 'integer', example: Math.floor(Date.now() / 1000) + 3600 },
        },
        'X-RateLimit-Window': {
            description: 'Rate limit time window',
            schema: { type: 'string', example: window },
        },
        'Retry-After': {
            description: 'Seconds to wait before retrying (when rate limited)',
            schema: { type: 'integer', example: 60 },
        },
    };
};
exports.createRateLimitHeaders = createRateLimitHeaders;
/**
 * 46. Creates quota usage response schema.
 *
 * @param {string[]} quotaTypes - Types of quotas to document
 * @returns {Record<string, any>} Quota usage schema
 *
 * @example
 * ```typescript
 * const quotaSchema = createQuotaUsageSchema(['api_calls', 'storage', 'bandwidth']);
 * ```
 */
const createQuotaUsageSchema = (quotaTypes) => {
    return {
        type: 'object',
        properties: {
            quotas: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        type: {
                            type: 'string',
                            enum: quotaTypes,
                            description: 'Quota type',
                        },
                        limit: {
                            type: 'number',
                            description: 'Maximum allowed usage',
                        },
                        used: {
                            type: 'number',
                            description: 'Current usage',
                        },
                        remaining: {
                            type: 'number',
                            description: 'Remaining quota',
                        },
                        resetAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'When quota resets',
                        },
                        unit: {
                            type: 'string',
                            description: 'Unit of measurement',
                            example: 'requests',
                        },
                    },
                },
            },
        },
    };
};
exports.createQuotaUsageSchema = createQuotaUsageSchema;
/**
 * 47. Creates API cost/billing information schema.
 *
 * @param {string} currency - Currency code (e.g., 'USD', 'EUR')
 * @returns {Record<string, any>} Billing schema
 *
 * @example
 * ```typescript
 * const billingSchema = createApiCostSchema('USD');
 * ```
 */
const createApiCostSchema = (currency = 'USD') => {
    return {
        type: 'object',
        properties: {
            requestCost: {
                type: 'number',
                description: `Cost per request in ${currency}`,
                example: 0.001,
            },
            currency: {
                type: 'string',
                description: 'Currency code',
                example: currency,
            },
            billingPeriod: {
                type: 'string',
                description: 'Billing period',
                example: 'monthly',
            },
            currentUsage: {
                type: 'object',
                properties: {
                    requests: {
                        type: 'number',
                        description: 'Total requests in current period',
                    },
                    cost: {
                        type: 'number',
                        description: 'Total cost in current period',
                    },
                },
            },
        },
    };
};
exports.createApiCostSchema = createApiCostSchema;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Schema Builders
    buildOpenApiSchema: exports.buildOpenApiSchema,
    createSchemaReference: exports.createSchemaReference,
    createPolymorphicSchema: exports.createPolymorphicSchema,
    createComposedSchema: exports.createComposedSchema,
    createNestedObjectSchema: exports.createNestedObjectSchema,
    // Decorator Factories
    createApiPropertyWithValidation: exports.createApiPropertyWithValidation,
    createCommonPropertyDecorator: exports.createCommonPropertyDecorator,
    createEnumPropertyDecorator: exports.createEnumPropertyDecorator,
    createArrayPropertyDecorator: exports.createArrayPropertyDecorator,
    // Response Documentation
    createSuccessResponses: exports.createSuccessResponses,
    createStandardErrorResponses: exports.createStandardErrorResponses,
    createPaginatedResponse: exports.createPaginatedResponse,
    createFileDownloadResponse: exports.createFileDownloadResponse,
    createMultiContentResponse: exports.createMultiContentResponse,
    // Request Documentation
    createPaginationParams: exports.createPaginationParams,
    createSearchFilterParams: exports.createSearchFilterParams,
    createDateRangeParams: exports.createDateRangeParams,
    createFileUploadBody: exports.createFileUploadBody,
    createMultipartFormBody: exports.createMultipartFormBody,
    // Security
    createBearerSecurityScheme: exports.createBearerSecurityScheme,
    createApiKeySecurityScheme: exports.createApiKeySecurityScheme,
    createOAuth2SecurityScheme: exports.createOAuth2SecurityScheme,
    createOpenIdConnectScheme: exports.createOpenIdConnectScheme,
    createCombinedSecurityRequirements: exports.createCombinedSecurityRequirements,
    // UI Customization
    createSwaggerUIConfiguration: exports.createSwaggerUIConfiguration,
    createOpenApiInfo: exports.createOpenApiInfo,
    createServerConfigurations: exports.createServerConfigurations,
    createApiTagGroups: exports.createApiTagGroups,
    // Examples & Validation
    createNamedExamples: exports.createNamedExamples,
    generateExampleFromSchema: exports.generateExampleFromSchema,
    createValidationDocumentation: exports.createValidationDocumentation,
    // Versioning & Deprecation
    createApiVersionInfo: exports.createApiVersionInfo,
    createEndpointDeprecation: exports.createEndpointDeprecation,
    createVersionedOperation: exports.createVersionedOperation,
    // Webhooks & Callbacks
    createWebhookDocumentation: exports.createWebhookDocumentation,
    createCallbackDocumentation: exports.createCallbackDocumentation,
    // Advanced Response Patterns
    createHATEOASLinks: exports.createHATEOASLinks,
    createEventStreamResponse: exports.createEventStreamResponse,
    createBatchOperationResponse: exports.createBatchOperationResponse,
    // Schema Validation
    createConditionalSchema: exports.createConditionalSchema,
    createCustomFormatSchema: exports.createCustomFormatSchema,
    createAccessModifierSchema: exports.createAccessModifierSchema,
    // Health & Monitoring
    createHealthCheckSchema: exports.createHealthCheckSchema,
    createMetricsSchema: exports.createMetricsSchema,
    // Rate Limiting & Quotas
    createRateLimitHeaders: exports.createRateLimitHeaders,
    createQuotaUsageSchema: exports.createQuotaUsageSchema,
    createApiCostSchema: exports.createApiCostSchema,
};
//# sourceMappingURL=swagger-openapi-kit.js.map