"use strict";
/**
 * LOC: SWD1234567
 * File: /reuse/swagger-documentation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS controllers
 *   - API documentation modules
 *   - DTO classes
 *   - OpenAPI spec generators
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAllOfSchema = exports.createOneOfSchema = exports.createSchemaRef = exports.createNestedSchema = exports.createModuleTags = exports.createResourceTags = exports.createApiTag = exports.createErrorExample = exports.createPaginationExample = exports.generateExampleByType = exports.createMultipleExamples = exports.createRequestExample = exports.createSecurityRequirement = exports.createOAuth2Security = exports.createApiKeyAuth = exports.createBearerAuth = exports.createDateRangeParams = exports.createFilterParam = exports.createPaginationParams = exports.createQueryParam = exports.createPathParam = exports.createBulkOperation = exports.createSearchOperation = exports.createCrudOperations = exports.createOperation = exports.createAsyncJobResponse = exports.createFileUploadResponse = exports.createCrudResponses = exports.createPaginatedResponse = exports.createErrorResponse = exports.createSuccessResponse = exports.createOptionalProperty = exports.createUrlProperty = exports.createEmailProperty = exports.createUuidProperty = exports.createDateProperty = exports.createArrayProperty = exports.createEnumProperty = exports.createBooleanProperty = exports.createNumberProperty = exports.createStringProperty = void 0;
// ============================================================================
// NESTJS API PROPERTY DECORATORS
// ============================================================================
/**
 * Creates ApiProperty decorator configuration for string fields.
 *
 * @param {string} description - Field description
 * @param {string} [example] - Example value
 * @param {number} [minLength] - Minimum string length
 * @param {number} [maxLength] - Maximum string length
 * @param {string} [pattern] - Regex pattern
 * @returns {ApiPropertyOptions} ApiProperty configuration object
 *
 * @example
 * ```typescript
 * class CreateUserDto {
 *   @ApiProperty(createStringProperty('User email address', 'user@example.com'))
 *   email: string;
 * }
 * ```
 */
const createStringProperty = (description, example, minLength, maxLength, pattern) => {
    if (!description || description.trim().length === 0) {
        throw new Error('Description is required for string property');
    }
    const options = {
        type: String,
        description: description.trim(),
        example: example || 'example string',
    };
    if (minLength !== undefined) {
        if (minLength < 0) {
            throw new Error('minLength must be non-negative');
        }
        options.minimum = minLength;
    }
    if (maxLength !== undefined) {
        if (maxLength < 0) {
            throw new Error('maxLength must be non-negative');
        }
        if (minLength !== undefined && maxLength < minLength) {
            throw new Error('maxLength must be greater than or equal to minLength');
        }
        options.maximum = maxLength;
    }
    if (pattern && pattern.trim().length > 0) {
        options.format = pattern.trim();
    }
    return options;
};
exports.createStringProperty = createStringProperty;
/**
 * Creates ApiProperty decorator configuration for number fields.
 *
 * @param {string} description - Field description
 * @param {number} [example] - Example value
 * @param {number} [min] - Minimum value
 * @param {number} [max] - Maximum value
 * @param {boolean} [isInteger] - Whether value must be integer
 * @returns {ApiPropertyOptions} ApiProperty configuration object
 *
 * @example
 * ```typescript
 * class PatientDto {
 *   @ApiProperty(createNumberProperty('Patient age', 30, 0, 120, true))
 *   age: number;
 * }
 * ```
 */
const createNumberProperty = (description, example, min, max, isInteger) => {
    const options = {
        type: Number,
        description,
        example: example ?? 42,
    };
    if (min !== undefined)
        options.minimum = min;
    if (max !== undefined)
        options.maximum = max;
    if (isInteger)
        options.format = 'int32';
    return options;
};
exports.createNumberProperty = createNumberProperty;
/**
 * Creates ApiProperty decorator configuration for boolean fields.
 *
 * @param {string} description - Field description
 * @param {boolean} [example] - Example value
 * @param {boolean} [defaultValue] - Default value
 * @returns {ApiPropertyOptions} ApiProperty configuration object
 *
 * @example
 * ```typescript
 * class SettingsDto {
 *   @ApiProperty(createBooleanProperty('Enable notifications', true))
 *   notificationsEnabled: boolean;
 * }
 * ```
 */
const createBooleanProperty = (description, example, defaultValue) => {
    return {
        type: Boolean,
        description,
        example: example ?? true,
        default: defaultValue,
    };
};
exports.createBooleanProperty = createBooleanProperty;
/**
 * Creates ApiProperty decorator configuration for enum fields.
 *
 * @param {string} description - Field description
 * @param {any[]} enumValues - Array of allowed enum values
 * @param {any} [example] - Example value
 * @returns {ApiPropertyOptions} ApiProperty configuration object
 *
 * @example
 * ```typescript
 * class PatientDto {
 *   @ApiProperty(createEnumProperty('Patient status', ['active', 'inactive', 'pending'], 'active'))
 *   status: string;
 * }
 * ```
 */
const createEnumProperty = (description, enumValues, example) => {
    if (!description || description.trim().length === 0) {
        throw new Error('Description is required for enum property');
    }
    if (!Array.isArray(enumValues) || enumValues.length === 0) {
        throw new Error('enumValues must be a non-empty array');
    }
    const validExample = example !== undefined ? example : enumValues[0];
    if (!enumValues.includes(validExample)) {
        throw new Error('Example value must be one of the enum values');
    }
    return {
        description: description.trim(),
        enum: [...enumValues],
        example: validExample,
    };
};
exports.createEnumProperty = createEnumProperty;
/**
 * Creates ApiProperty decorator configuration for array fields.
 *
 * @param {string} description - Field description
 * @param {any} itemType - Type of array items
 * @param {any[]} [example] - Example array
 * @param {number} [minItems] - Minimum array length
 * @param {number} [maxItems] - Maximum array length
 * @returns {ApiPropertyOptions} ApiProperty configuration object
 *
 * @example
 * ```typescript
 * class CourseDto {
 *   @ApiProperty(createArrayProperty('Student IDs', String, ['uuid-1', 'uuid-2'], 1, 100))
 *   studentIds: string[];
 * }
 * ```
 */
const createArrayProperty = (description, itemType, example, minItems, maxItems) => {
    if (!description || description.trim().length === 0) {
        throw new Error('Description is required for array property');
    }
    if (typeof itemType !== 'function') {
        throw new Error('itemType must be a valid type constructor');
    }
    const options = {
        description: description.trim(),
        type: [itemType],
        isArray: true,
        example: Array.isArray(example) ? [...example] : [],
    };
    if (minItems !== undefined) {
        if (minItems < 0) {
            throw new Error('minItems must be non-negative');
        }
        options.minimum = minItems;
    }
    if (maxItems !== undefined) {
        if (maxItems < 0) {
            throw new Error('maxItems must be non-negative');
        }
        if (minItems !== undefined && maxItems < minItems) {
            throw new Error('maxItems must be greater than or equal to minItems');
        }
        options.maximum = maxItems;
    }
    return options;
};
exports.createArrayProperty = createArrayProperty;
/**
 * Creates ApiProperty decorator configuration for date/datetime fields.
 *
 * @param {string} description - Field description
 * @param {boolean} [includeTime] - Include time component (ISO 8601)
 * @param {string} [example] - Example date string
 * @returns {ApiPropertyOptions} ApiProperty configuration object
 *
 * @example
 * ```typescript
 * class AppointmentDto {
 *   @ApiProperty(createDateProperty('Appointment date and time', true))
 *   appointmentDateTime: Date;
 * }
 * ```
 */
const createDateProperty = (description, includeTime, example) => {
    return {
        type: Date,
        description,
        format: includeTime ? 'date-time' : 'date',
        example: example || (includeTime ? '2024-03-15T10:30:00Z' : '2024-03-15'),
    };
};
exports.createDateProperty = createDateProperty;
/**
 * Creates ApiProperty decorator configuration for UUID fields.
 *
 * @param {string} description - Field description
 * @param {string} [example] - Example UUID
 * @returns {ApiPropertyOptions} ApiProperty configuration object
 *
 * @example
 * ```typescript
 * class PatientDto {
 *   @ApiProperty(createUuidProperty('Patient unique identifier'))
 *   id: string;
 * }
 * ```
 */
const createUuidProperty = (description, example) => {
    return {
        type: String,
        description,
        format: 'uuid',
        example: example || '123e4567-e89b-12d3-a456-426614174000',
    };
};
exports.createUuidProperty = createUuidProperty;
/**
 * Creates ApiProperty decorator configuration for email fields.
 *
 * @param {string} description - Field description
 * @param {string} [example] - Example email
 * @returns {ApiPropertyOptions} ApiProperty configuration object
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @ApiProperty(createEmailProperty('User email address'))
 *   email: string;
 * }
 * ```
 */
const createEmailProperty = (description, example) => {
    return {
        type: String,
        description,
        format: 'email',
        example: example || 'user@example.com',
    };
};
exports.createEmailProperty = createEmailProperty;
/**
 * Creates ApiProperty decorator configuration for URL fields.
 *
 * @param {string} description - Field description
 * @param {string} [example] - Example URL
 * @returns {ApiPropertyOptions} ApiProperty configuration object
 *
 * @example
 * ```typescript
 * class ProfileDto {
 *   @ApiProperty(createUrlProperty('Profile website URL'))
 *   website: string;
 * }
 * ```
 */
const createUrlProperty = (description, example) => {
    return {
        type: String,
        description,
        format: 'uri',
        example: example || 'https://example.com',
    };
};
exports.createUrlProperty = createUrlProperty;
/**
 * Creates ApiProperty decorator configuration for optional fields.
 *
 * @param {ApiPropertyOptions} baseOptions - Base property options
 * @param {any} [defaultValue] - Default value if not provided
 * @returns {ApiPropertyOptions} ApiProperty configuration object
 *
 * @example
 * ```typescript
 * class UserDto {
 *   @ApiProperty(createOptionalProperty(createStringProperty('Middle name'), ''))
 *   middleName?: string;
 * }
 * ```
 */
const createOptionalProperty = (baseOptions, defaultValue) => {
    if (!baseOptions || typeof baseOptions !== 'object') {
        throw new Error('baseOptions must be a valid ApiPropertyOptions object');
    }
    return {
        ...baseOptions,
        required: false,
        nullable: true,
        default: defaultValue,
    };
};
exports.createOptionalProperty = createOptionalProperty;
// ============================================================================
// API RESPONSE DOCUMENTATION
// ============================================================================
/**
 * Creates ApiResponse decorator configuration for success responses.
 *
 * @param {number} status - HTTP status code
 * @param {string} description - Response description
 * @param {any} [type] - Response DTO class
 * @param {boolean} [isArray] - Whether response is an array
 * @returns {ApiResponseOptions} ApiResponse configuration object
 *
 * @example
 * ```typescript
 * @ApiResponse(createSuccessResponse(200, 'Patient retrieved successfully', PatientDto))
 * @Get(':id')
 * async getPatient(@Param('id') id: string) { }
 * ```
 */
const createSuccessResponse = (status, description, type, isArray) => {
    if (status < 200 || status >= 300) {
        throw new Error('Success response status must be in the 2xx range');
    }
    if (!description || description.trim().length === 0) {
        throw new Error('Description is required for success response');
    }
    return {
        status,
        description: description.trim(),
        type,
        isArray: isArray ?? false,
    };
};
exports.createSuccessResponse = createSuccessResponse;
/**
 * Creates ApiResponse decorator configuration for error responses.
 *
 * @param {number} status - HTTP status code
 * @param {string} description - Error description
 * @param {any} [errorSchema] - Custom error schema
 * @returns {ApiResponseOptions} ApiResponse configuration object
 *
 * @example
 * ```typescript
 * @ApiResponse(createErrorResponse(404, 'Patient not found'))
 * @ApiResponse(createErrorResponse(400, 'Invalid input data'))
 * @Get(':id')
 * async getPatient(@Param('id') id: string) { }
 * ```
 */
const createErrorResponse = (status, description, errorSchema) => {
    if (status < 400 || status >= 600) {
        throw new Error('Error response status must be in the 4xx or 5xx range');
    }
    if (!description || description.trim().length === 0) {
        throw new Error('Description is required for error response');
    }
    return {
        status,
        description: description.trim(),
        schema: errorSchema || {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: status },
                message: { type: 'string', example: description },
                error: { type: 'string' },
                timestamp: { type: 'string', format: 'date-time' },
            },
        },
    };
};
exports.createErrorResponse = createErrorResponse;
/**
 * Creates ApiResponse decorator configuration for paginated responses.
 *
 * @param {string} description - Response description
 * @param {any} itemType - Type of items in the data array
 * @returns {ApiResponseOptions} ApiResponse configuration object
 *
 * @example
 * ```typescript
 * @ApiResponse(createPaginatedResponse('List of patients', PatientDto))
 * @Get()
 * async getPatients(@Query() query: PaginationDto) { }
 * ```
 */
const createPaginatedResponse = (description, itemType) => {
    if (!description || description.trim().length === 0) {
        throw new Error('Description is required for paginated response');
    }
    if (typeof itemType !== 'function' || !itemType.name) {
        throw new Error('itemType must be a valid type constructor with a name property');
    }
    return {
        status: 200,
        description: description.trim(),
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: { $ref: `#/components/schemas/${itemType.name}` },
                },
                meta: {
                    type: 'object',
                    properties: {
                        page: { type: 'number', example: 1 },
                        limit: { type: 'number', example: 20 },
                        total: { type: 'number', example: 100 },
                        totalPages: { type: 'number', example: 5 },
                        hasNext: { type: 'boolean', example: true },
                        hasPrev: { type: 'boolean', example: false },
                    },
                },
            },
        },
    };
};
exports.createPaginatedResponse = createPaginatedResponse;
/**
 * Creates standard CRUD response configurations.
 *
 * @param {any} dtoType - DTO class type
 * @param {string} resourceName - Resource name (e.g., 'Patient', 'Appointment')
 * @returns {ApiResponseOptions[]} Array of ApiResponse configurations
 *
 * @example
 * ```typescript
 * const responses = createCrudResponses(PatientDto, 'Patient');
 * // Use with multiple @ApiResponse decorators
 * ```
 */
const createCrudResponses = (dtoType, resourceName) => {
    if (typeof dtoType !== 'function') {
        throw new Error('dtoType must be a valid type constructor');
    }
    if (!resourceName || resourceName.trim().length === 0) {
        throw new Error('resourceName is required');
    }
    const sanitizedResourceName = resourceName.trim();
    return [
        (0, exports.createSuccessResponse)(200, `${sanitizedResourceName} retrieved successfully`, dtoType),
        (0, exports.createSuccessResponse)(201, `${sanitizedResourceName} created successfully`, dtoType),
        (0, exports.createErrorResponse)(400, 'Invalid input data'),
        (0, exports.createErrorResponse)(404, `${sanitizedResourceName} not found`),
        (0, exports.createErrorResponse)(409, `${sanitizedResourceName} already exists`),
        (0, exports.createErrorResponse)(500, 'Internal server error'),
    ];
};
exports.createCrudResponses = createCrudResponses;
/**
 * Creates ApiResponse configuration for file upload responses.
 *
 * @param {string} description - Response description
 * @returns {ApiResponseOptions} ApiResponse configuration object
 *
 * @example
 * ```typescript
 * @ApiResponse(createFileUploadResponse('Medical record uploaded'))
 * @Post('upload')
 * async uploadFile(@UploadedFile() file: Express.Multer.File) { }
 * ```
 */
const createFileUploadResponse = (description) => {
    return {
        status: 201,
        description,
        schema: {
            type: 'object',
            properties: {
                filename: { type: 'string', example: 'medical-record.pdf' },
                size: { type: 'number', example: 1024000 },
                mimetype: { type: 'string', example: 'application/pdf' },
                url: { type: 'string', example: 'https://storage.example.com/file-id' },
                uploadedAt: { type: 'string', format: 'date-time' },
            },
        },
    };
};
exports.createFileUploadResponse = createFileUploadResponse;
/**
 * Creates ApiResponse configuration for async job responses.
 *
 * @param {string} description - Response description
 * @returns {ApiResponseOptions} ApiResponse configuration object
 *
 * @example
 * ```typescript
 * @ApiResponse(createAsyncJobResponse('Report generation started'))
 * @Post('generate-report')
 * async generateReport() { }
 * ```
 */
const createAsyncJobResponse = (description) => {
    return {
        status: 202,
        description,
        schema: {
            type: 'object',
            properties: {
                jobId: { type: 'string', example: 'job-uuid-123' },
                status: { type: 'string', example: 'pending' },
                message: { type: 'string', example: 'Job queued for processing' },
                estimatedCompletion: { type: 'string', format: 'date-time' },
                statusUrl: { type: 'string', example: '/api/jobs/job-uuid-123/status' },
            },
        },
    };
};
exports.createAsyncJobResponse = createAsyncJobResponse;
// ============================================================================
// API OPERATION DOCUMENTATION
// ============================================================================
/**
 * Creates ApiOperation decorator configuration.
 *
 * @param {string} summary - Short operation summary
 * @param {string} [description] - Detailed operation description
 * @param {string[]} [tags] - Operation tags
 * @param {boolean} [deprecated] - Whether operation is deprecated
 * @returns {ApiOperationOptions} ApiOperation configuration object
 *
 * @example
 * ```typescript
 * @ApiOperation(createOperation('Get patient by ID', 'Retrieves detailed patient information', ['Patients']))
 * @Get(':id')
 * async getPatient(@Param('id') id: string) { }
 * ```
 */
const createOperation = (summary, description, tags, deprecated) => {
    return {
        summary,
        description,
        tags,
        deprecated: deprecated || false,
    };
};
exports.createOperation = createOperation;
/**
 * Creates standardized CRUD operation configurations.
 *
 * @param {string} resourceName - Resource name (e.g., 'Patient')
 * @param {string} tag - API tag for grouping
 * @returns {object} Object with create, read, update, delete operations
 *
 * @example
 * ```typescript
 * const patientOps = createCrudOperations('Patient', 'Patients');
 * @ApiOperation(patientOps.create)
 * @Post()
 * async create() { }
 * ```
 */
const createCrudOperations = (resourceName, tag) => {
    return {
        create: (0, exports.createOperation)(`Create ${resourceName}`, `Creates a new ${resourceName} record`, [tag]),
        findAll: (0, exports.createOperation)(`Get all ${resourceName}s`, `Retrieves a paginated list of ${resourceName}s`, [tag]),
        findOne: (0, exports.createOperation)(`Get ${resourceName} by ID`, `Retrieves a single ${resourceName} by unique identifier`, [tag]),
        update: (0, exports.createOperation)(`Update ${resourceName}`, `Updates an existing ${resourceName} record`, [tag]),
        delete: (0, exports.createOperation)(`Delete ${resourceName}`, `Soft or hard deletes a ${resourceName} record`, [tag]),
    };
};
exports.createCrudOperations = createCrudOperations;
/**
 * Creates ApiOperation for search endpoints.
 *
 * @param {string} resourceName - Resource being searched
 * @param {string[]} searchFields - Fields that can be searched
 * @param {string} tag - API tag
 * @returns {ApiOperationOptions} ApiOperation configuration
 *
 * @example
 * ```typescript
 * @ApiOperation(createSearchOperation('Patient', ['name', 'email', 'medicalRecordNumber'], 'Patients'))
 * @Get('search')
 * async search(@Query() query: SearchDto) { }
 * ```
 */
const createSearchOperation = (resourceName, searchFields, tag) => {
    return {
        summary: `Search ${resourceName}s`,
        description: `Search ${resourceName}s by: ${searchFields.join(', ')}. Supports fuzzy matching and filters.`,
        tags: [tag],
    };
};
exports.createSearchOperation = createSearchOperation;
/**
 * Creates ApiOperation for bulk operations.
 *
 * @param {string} action - Action name (e.g., 'create', 'update', 'delete')
 * @param {string} resourceName - Resource name
 * @param {string} tag - API tag
 * @returns {ApiOperationOptions} ApiOperation configuration
 *
 * @example
 * ```typescript
 * @ApiOperation(createBulkOperation('create', 'Patient', 'Patients'))
 * @Post('bulk')
 * async bulkCreate(@Body() data: CreatePatientDto[]) { }
 * ```
 */
const createBulkOperation = (action, resourceName, tag) => {
    return {
        summary: `Bulk ${action} ${resourceName}s`,
        description: `Performs ${action} operation on multiple ${resourceName} records in a single request`,
        tags: [tag],
    };
};
exports.createBulkOperation = createBulkOperation;
// ============================================================================
// PARAMETER DOCUMENTATION
// ============================================================================
/**
 * Creates ApiParam decorator configuration for path parameters.
 *
 * @param {string} name - Parameter name
 * @param {string} description - Parameter description
 * @param {string} [type] - Parameter type
 * @param {string} [example] - Example value
 * @returns {object} ApiParam configuration
 *
 * @example
 * ```typescript
 * @ApiParam(createPathParam('id', 'Patient unique identifier', 'string', 'uuid-123'))
 * @Get(':id')
 * async getPatient(@Param('id') id: string) { }
 * ```
 */
const createPathParam = (name, description, type, example) => {
    return {
        name,
        description,
        type: type || 'string',
        required: true,
        example: example || 'example-value',
    };
};
exports.createPathParam = createPathParam;
/**
 * Creates ApiQuery decorator configuration for query parameters.
 *
 * @param {string} name - Parameter name
 * @param {string} description - Parameter description
 * @param {boolean} [required] - Whether parameter is required
 * @param {string} [type] - Parameter type
 * @param {any} [example] - Example value
 * @returns {object} ApiQuery configuration
 *
 * @example
 * ```typescript
 * @ApiQuery(createQueryParam('page', 'Page number', false, 'number', 1))
 * @Get()
 * async findAll(@Query('page') page: number) { }
 * ```
 */
const createQueryParam = (name, description, required, type, example) => {
    return {
        name,
        description,
        required: required || false,
        type: type || 'string',
        example: example || 'example-value',
    };
};
exports.createQueryParam = createQueryParam;
/**
 * Creates standard pagination query parameters.
 *
 * @returns {object[]} Array of pagination query parameter configurations
 *
 * @example
 * ```typescript
 * const paginationParams = createPaginationParams();
 * // Apply all with spread operator or individually
 * ```
 */
const createPaginationParams = () => {
    return [
        (0, exports.createQueryParam)('page', 'Page number (1-based)', false, 'number', 1),
        (0, exports.createQueryParam)('limit', 'Items per page', false, 'number', 20),
        (0, exports.createQueryParam)('sort', 'Sort field and direction (e.g., "createdAt:desc")', false, 'string', 'createdAt:desc'),
        (0, exports.createQueryParam)('search', 'Search query string', false, 'string', ''),
    ];
};
exports.createPaginationParams = createPaginationParams;
/**
 * Creates filter query parameter configuration.
 *
 * @param {string[]} filterableFields - Fields that can be filtered
 * @returns {object} ApiQuery configuration for filters
 *
 * @example
 * ```typescript
 * @ApiQuery(createFilterParam(['status', 'type', 'createdBy']))
 * @Get()
 * async findAll(@Query('filter') filter: string) { }
 * ```
 */
const createFilterParam = (filterableFields) => {
    return {
        name: 'filter',
        description: `Filter results by fields: ${filterableFields.join(', ')}. Format: field:value (e.g., status:active)`,
        required: false,
        type: 'string',
        example: `${filterableFields[0]}:example`,
    };
};
exports.createFilterParam = createFilterParam;
/**
 * Creates date range query parameters.
 *
 * @param {string} fieldName - Date field name
 * @returns {object[]} Array of date range parameter configurations
 *
 * @example
 * ```typescript
 * const dateParams = createDateRangeParams('createdAt');
 * // Generates startDate and endDate parameters
 * ```
 */
const createDateRangeParams = (fieldName) => {
    return [
        (0, exports.createQueryParam)(`${fieldName}From`, `Filter ${fieldName} from this date (inclusive)`, false, 'string', '2024-01-01'),
        (0, exports.createQueryParam)(`${fieldName}To`, `Filter ${fieldName} to this date (inclusive)`, false, 'string', '2024-12-31'),
    ];
};
exports.createDateRangeParams = createDateRangeParams;
// ============================================================================
// SECURITY SCHEME DOCUMENTATION
// ============================================================================
/**
 * Creates ApiBearerAuth configuration for JWT authentication.
 *
 * @param {string} [name] - Security scheme name
 * @param {string} [description] - Security description
 * @returns {object} Security configuration
 *
 * @example
 * ```typescript
 * @ApiBearerAuth(createBearerAuth('access-token', 'JWT access token from login'))
 * @UseGuards(JwtAuthGuard)
 * @Get('profile')
 * async getProfile() { }
 * ```
 */
const createBearerAuth = (name, description) => {
    return {
        name: name || 'bearer',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: description || 'JWT Bearer token authentication',
    };
};
exports.createBearerAuth = createBearerAuth;
/**
 * Creates ApiApiKey configuration for API key authentication.
 *
 * @param {string} keyName - API key header/query name
 * @param {'header' | 'query'} location - Where API key is sent
 * @param {string} [description] - Security description
 * @returns {object} Security configuration
 *
 * @example
 * ```typescript
 * @ApiSecurity(createApiKeyAuth('X-API-Key', 'header'))
 * @UseGuards(ApiKeyGuard)
 * @Get('public-data')
 * async getPublicData() { }
 * ```
 */
const createApiKeyAuth = (keyName, location, description) => {
    return {
        type: 'apiKey',
        in: location,
        name: keyName,
        description: description || `API key authentication via ${location}`,
    };
};
exports.createApiKeyAuth = createApiKeyAuth;
/**
 * Creates OAuth2 security configuration.
 *
 * @param {string[]} scopes - Required OAuth2 scopes
 * @param {string} [authUrl] - Authorization URL
 * @param {string} [tokenUrl] - Token URL
 * @returns {object} OAuth2 security configuration
 *
 * @example
 * ```typescript
 * const oauth = createOAuth2Security(['read:patients', 'write:patients']);
 * // Use with @ApiOAuth2 decorator
 * ```
 */
const createOAuth2Security = (scopes, authUrl, tokenUrl) => {
    return {
        type: 'oauth2',
        flows: {
            authorizationCode: {
                authorizationUrl: authUrl || 'https://auth.example.com/oauth/authorize',
                tokenUrl: tokenUrl || 'https://auth.example.com/oauth/token',
                scopes: scopes.reduce((acc, scope) => ({ ...acc, [scope]: scope }), {}),
            },
        },
    };
};
exports.createOAuth2Security = createOAuth2Security;
/**
 * Creates security requirement configuration with scopes.
 *
 * @param {string} schemeName - Security scheme name
 * @param {string[]} [scopes] - Required scopes
 * @returns {ApiSecurityOptions} Security requirement configuration
 *
 * @example
 * ```typescript
 * @ApiSecurity(createSecurityRequirement('bearer', ['admin']))
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Delete(':id')
 * async delete(@Param('id') id: string) { }
 * ```
 */
const createSecurityRequirement = (schemeName, scopes) => {
    return {
        name: schemeName,
        scopes: scopes || [],
    };
};
exports.createSecurityRequirement = createSecurityRequirement;
// ============================================================================
// EXAMPLE GENERATION
// ============================================================================
/**
 * Creates example request body for documentation.
 *
 * @param {object} exampleData - Example data object
 * @param {string} [description] - Example description
 * @returns {object} Example configuration
 *
 * @example
 * ```typescript
 * const example = createRequestExample(
 *   { email: 'patient@example.com', name: 'John Doe' },
 *   'Create patient request'
 * );
 * ```
 */
const createRequestExample = (exampleData, description) => {
    return {
        description: description || 'Example request',
        value: exampleData,
    };
};
exports.createRequestExample = createRequestExample;
/**
 * Creates multiple examples for a request/response.
 *
 * @param {Record<string, any>} examples - Named examples object
 * @returns {object} Examples configuration
 *
 * @example
 * ```typescript
 * const examples = createMultipleExamples({
 *   'activePatient': { status: 'active', name: 'John Doe' },
 *   'inactivePatient': { status: 'inactive', name: 'Jane Smith' }
 * });
 * ```
 */
const createMultipleExamples = (examples) => {
    if (!examples || typeof examples !== 'object' || Object.keys(examples).length === 0) {
        throw new Error('examples must be a non-empty object');
    }
    return Object.entries(examples).reduce((acc, [key, value]) => {
        if (!key || key.trim().length === 0) {
            throw new Error('Example key must be a non-empty string');
        }
        return {
            ...acc,
            [key]: {
                summary: key,
                value,
            },
        };
    }, {});
};
exports.createMultipleExamples = createMultipleExamples;
/**
 * Generates example value based on OpenAPI schema type.
 *
 * @param {string} type - Schema type
 * @param {string} [format] - Schema format
 * @returns {any} Generated example value
 *
 * @example
 * ```typescript
 * generateExampleByType('string', 'email'); // 'user@example.com'
 * generateExampleByType('number', 'int32'); // 42
 * generateExampleByType('boolean'); // true
 * ```
 */
const generateExampleByType = (type, format) => {
    if (!type || typeof type !== 'string') {
        throw new Error('Type must be a non-empty string');
    }
    const normalizedType = type.toLowerCase().trim();
    switch (normalizedType) {
        case 'string':
            if (format === 'email')
                return 'user@example.com';
            if (format === 'uuid')
                return '123e4567-e89b-12d3-a456-426614174000';
            if (format === 'date')
                return '2024-03-15';
            if (format === 'date-time')
                return '2024-03-15T10:30:00Z';
            if (format === 'uri')
                return 'https://example.com';
            return 'example string';
        case 'number':
        case 'integer':
            return 42;
        case 'boolean':
            return true;
        case 'array':
            return [];
        case 'object':
            return {};
        default:
            return null;
    }
};
exports.generateExampleByType = generateExampleByType;
/**
 * Creates pagination metadata example.
 *
 * @param {number} [page] - Current page
 * @param {number} [limit] - Items per page
 * @param {number} [total] - Total items
 * @returns {PaginationMetadata} Pagination metadata example
 *
 * @example
 * ```typescript
 * const paginationMeta = createPaginationExample(1, 20, 100);
 * // { page: 1, limit: 20, total: 100, totalPages: 5, hasNext: true, hasPrev: false }
 * ```
 */
const createPaginationExample = (page = 1, limit = 20, total = 100) => {
    const totalPages = Math.ceil(total / limit);
    return {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
    };
};
exports.createPaginationExample = createPaginationExample;
/**
 * Creates error response example.
 *
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {string} [error] - Error type
 * @returns {object} Error response example
 *
 * @example
 * ```typescript
 * const errorExample = createErrorExample(404, 'Patient not found', 'NotFoundError');
 * ```
 */
const createErrorExample = (statusCode, message, error) => {
    return {
        statusCode,
        message,
        error: error || 'Error',
        timestamp: new Date().toISOString(),
        path: '/api/resource/id',
    };
};
exports.createErrorExample = createErrorExample;
// ============================================================================
// TAG AND GROUPING UTILITIES
// ============================================================================
/**
 * Creates API tag configuration for grouping endpoints.
 *
 * @param {string} name - Tag name
 * @param {string} description - Tag description
 * @param {string} [externalDocsUrl] - External documentation URL
 * @returns {ApiTagOptions} Tag configuration
 *
 * @example
 * ```typescript
 * const tag = createApiTag('Patients', 'Patient management endpoints', 'https://docs.example.com/patients');
 * // Use in DocumentBuilder configuration
 * ```
 */
const createApiTag = (name, description, externalDocsUrl) => {
    const tag = { name, description };
    if (externalDocsUrl) {
        tag.externalDocs = {
            description: `${name} documentation`,
            url: externalDocsUrl,
        };
    }
    return tag;
};
exports.createApiTag = createApiTag;
/**
 * Creates standard CRUD endpoint tags.
 *
 * @param {string} resourceName - Resource name
 * @returns {ApiTagOptions[]} Array of tag configurations
 *
 * @example
 * ```typescript
 * const tags = createResourceTags('Patient');
 * // Generates tags for Patients, Patient Management, etc.
 * ```
 */
const createResourceTags = (resourceName) => {
    return [
        (0, exports.createApiTag)(`${resourceName}s`, `${resourceName} CRUD operations`),
        (0, exports.createApiTag)(`${resourceName} Management`, `Advanced ${resourceName} management features`),
    ];
};
exports.createResourceTags = createResourceTags;
/**
 * Creates tags for different API modules.
 *
 * @param {string[]} moduleNames - Module names
 * @returns {ApiTagOptions[]} Array of tag configurations
 *
 * @example
 * ```typescript
 * const tags = createModuleTags(['Authentication', 'Patients', 'Appointments', 'Billing']);
 * ```
 */
const createModuleTags = (moduleNames) => {
    return moduleNames.map((name) => (0, exports.createApiTag)(name, `${name} module endpoints`));
};
exports.createModuleTags = createModuleTags;
// ============================================================================
// SCHEMA COMPOSITION UTILITIES
// ============================================================================
/**
 * Creates a nested object schema definition.
 *
 * @param {string} description - Schema description
 * @param {Record<string, any>} properties - Schema properties
 * @param {string[]} [required] - Required property names
 * @returns {object} Nested schema configuration
 *
 * @example
 * ```typescript
 * const addressSchema = createNestedSchema(
 *   'Address information',
 *   { street: { type: 'string' }, city: { type: 'string' } },
 *   ['street', 'city']
 * );
 * ```
 */
const createNestedSchema = (description, properties, required) => {
    if (!description || description.trim().length === 0) {
        throw new Error('Description is required for nested schema');
    }
    if (!properties || typeof properties !== 'object' || Object.keys(properties).length === 0) {
        throw new Error('properties must be a non-empty object');
    }
    if (required && !Array.isArray(required)) {
        throw new Error('required must be an array');
    }
    return {
        type: 'object',
        description: description.trim(),
        properties: { ...properties },
        required: required ? [...required] : [],
    };
};
exports.createNestedSchema = createNestedSchema;
/**
 * Creates a schema reference to component schemas.
 *
 * @param {string} schemaName - Component schema name
 * @returns {object} Schema reference object
 *
 * @example
 * ```typescript
 * const patientRef = createSchemaRef('Patient');
 * // { $ref: '#/components/schemas/Patient' }
 * ```
 */
const createSchemaRef = (schemaName) => {
    return { $ref: `#/components/schemas/${schemaName}` };
};
exports.createSchemaRef = createSchemaRef;
/**
 * Creates a oneOf schema for polymorphic types.
 *
 * @param {string[]} schemaNames - Schema names to include
 * @param {string} [discriminator] - Discriminator property name
 * @returns {object} OneOf schema configuration
 *
 * @example
 * ```typescript
 * const paymentSchema = createOneOfSchema(['CreditCardPayment', 'BankTransferPayment'], 'type');
 * ```
 */
const createOneOfSchema = (schemaNames, discriminator) => {
    const schema = {
        oneOf: schemaNames.map((name) => (0, exports.createSchemaRef)(name)),
    };
    if (discriminator) {
        return {
            ...schema,
            discriminator: {
                propertyName: discriminator,
                mapping: schemaNames.reduce((acc, name) => ({ ...acc, [name.toLowerCase()]: (0, exports.createSchemaRef)(name) }), {}),
            },
        };
    }
    return schema;
};
exports.createOneOfSchema = createOneOfSchema;
/**
 * Creates an allOf schema for schema composition.
 *
 * @param {string[]} schemaNames - Schema names to compose
 * @param {object} [additionalProperties] - Additional properties to add
 * @returns {object} AllOf schema configuration
 *
 * @example
 * ```typescript
 * const extendedPatientSchema = createAllOfSchema(
 *   ['BasePatient'],
 *   { medicalHistory: { type: 'array' } }
 * );
 * ```
 */
const createAllOfSchema = (schemaNames, additionalProperties) => {
    if (!Array.isArray(schemaNames) || schemaNames.length === 0) {
        throw new Error('schemaNames must be a non-empty array');
    }
    const schemas = schemaNames.map((name) => {
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            throw new Error('Each schema name must be a non-empty string');
        }
        return (0, exports.createSchemaRef)(name);
    });
    if (additionalProperties && typeof additionalProperties === 'object') {
        schemas.push({
            type: 'object',
            properties: { ...additionalProperties },
        });
    }
    return { allOf: schemas };
};
exports.createAllOfSchema = createAllOfSchema;
exports.default = {
    // API Property decorators
    createStringProperty: exports.createStringProperty,
    createNumberProperty: exports.createNumberProperty,
    createBooleanProperty: exports.createBooleanProperty,
    createEnumProperty: exports.createEnumProperty,
    createArrayProperty: exports.createArrayProperty,
    createDateProperty: exports.createDateProperty,
    createUuidProperty: exports.createUuidProperty,
    createEmailProperty: exports.createEmailProperty,
    createUrlProperty: exports.createUrlProperty,
    createOptionalProperty: exports.createOptionalProperty,
    // API Response documentation
    createSuccessResponse: exports.createSuccessResponse,
    createErrorResponse: exports.createErrorResponse,
    createPaginatedResponse: exports.createPaginatedResponse,
    createCrudResponses: exports.createCrudResponses,
    createFileUploadResponse: exports.createFileUploadResponse,
    createAsyncJobResponse: exports.createAsyncJobResponse,
    // API Operation documentation
    createOperation: exports.createOperation,
    createCrudOperations: exports.createCrudOperations,
    createSearchOperation: exports.createSearchOperation,
    createBulkOperation: exports.createBulkOperation,
    // Parameter documentation
    createPathParam: exports.createPathParam,
    createQueryParam: exports.createQueryParam,
    createPaginationParams: exports.createPaginationParams,
    createFilterParam: exports.createFilterParam,
    createDateRangeParams: exports.createDateRangeParams,
    // Security scheme documentation
    createBearerAuth: exports.createBearerAuth,
    createApiKeyAuth: exports.createApiKeyAuth,
    createOAuth2Security: exports.createOAuth2Security,
    createSecurityRequirement: exports.createSecurityRequirement,
    // Example generation
    createRequestExample: exports.createRequestExample,
    createMultipleExamples: exports.createMultipleExamples,
    generateExampleByType: exports.generateExampleByType,
    createPaginationExample: exports.createPaginationExample,
    createErrorExample: exports.createErrorExample,
    // Tag and grouping utilities
    createApiTag: exports.createApiTag,
    createResourceTags: exports.createResourceTags,
    createModuleTags: exports.createModuleTags,
    // Schema composition utilities
    createNestedSchema: exports.createNestedSchema,
    createSchemaRef: exports.createSchemaRef,
    createOneOfSchema: exports.createOneOfSchema,
    createAllOfSchema: exports.createAllOfSchema,
};
//# sourceMappingURL=swagger-documentation-kit.js.map