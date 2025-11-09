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
/**
 * File: /reuse/swagger-documentation-kit.ts
 * Locator: WC-UTL-SWD-001
 * Purpose: Swagger Documentation Kit - NestJS Swagger decorators, schema builders, and API documentation utilities
 *
 * Upstream: Independent utility module for Swagger/OpenAPI documentation
 * Downstream: ../backend/*, NestJS controllers, DTO validation, API documentation
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/swagger 7.x
 * Exports: 45 utility functions for comprehensive API documentation with NestJS Swagger
 *
 * LLM Context: Comprehensive Swagger documentation toolkit for White Cross healthcare system.
 * Provides NestJS decorator helpers, schema generators, response builders, parameter documentation,
 * security definitions, example generators, tag management, and operation documentation.
 * Essential for maintaining consistent, comprehensive API documentation across the system.
 */
interface ApiPropertyOptions {
    description?: string;
    example?: unknown;
    type?: string | Function | [Function];
    required?: boolean;
    enum?: Array<string | number | boolean>;
    format?: string;
    minimum?: number;
    maximum?: number;
    default?: unknown;
    nullable?: boolean;
    isArray?: boolean;
}
interface ApiResponseOptions {
    status: number;
    description: string;
    type?: Function;
    isArray?: boolean;
    schema?: Record<string, unknown>;
}
interface ApiOperationOptions {
    summary: string;
    description?: string;
    operationId?: string;
    deprecated?: boolean;
    tags?: string[];
}
interface ApiSecurityOptions {
    name: string;
    scopes?: string[];
}
interface PaginationMetadata {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
interface ApiTagOptions {
    name: string;
    description: string;
    externalDocs?: {
        description?: string;
        url: string;
    };
}
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
export declare const createStringProperty: (description: string, example?: string, minLength?: number, maxLength?: number, pattern?: string) => ApiPropertyOptions;
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
export declare const createNumberProperty: (description: string, example?: number, min?: number, max?: number, isInteger?: boolean) => ApiPropertyOptions;
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
export declare const createBooleanProperty: (description: string, example?: boolean, defaultValue?: boolean) => ApiPropertyOptions;
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
export declare const createEnumProperty: (description: string, enumValues: Array<string | number | boolean>, example?: string | number | boolean) => ApiPropertyOptions;
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
export declare const createArrayProperty: (description: string, itemType: Function, example?: unknown[], minItems?: number, maxItems?: number) => ApiPropertyOptions;
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
export declare const createDateProperty: (description: string, includeTime?: boolean, example?: string) => ApiPropertyOptions;
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
export declare const createUuidProperty: (description: string, example?: string) => ApiPropertyOptions;
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
export declare const createEmailProperty: (description: string, example?: string) => ApiPropertyOptions;
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
export declare const createUrlProperty: (description: string, example?: string) => ApiPropertyOptions;
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
export declare const createOptionalProperty: (baseOptions: ApiPropertyOptions, defaultValue?: unknown) => ApiPropertyOptions;
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
export declare const createSuccessResponse: (status: number, description: string, type?: Function, isArray?: boolean) => ApiResponseOptions;
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
export declare const createErrorResponse: (status: number, description: string, errorSchema?: Record<string, unknown>) => ApiResponseOptions;
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
export declare const createPaginatedResponse: (description: string, itemType: Function & {
    name: string;
}) => ApiResponseOptions;
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
export declare const createCrudResponses: (dtoType: Function, resourceName: string) => ApiResponseOptions[];
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
export declare const createFileUploadResponse: (description: string) => ApiResponseOptions;
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
export declare const createAsyncJobResponse: (description: string) => ApiResponseOptions;
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
export declare const createOperation: (summary: string, description?: string, tags?: string[], deprecated?: boolean) => ApiOperationOptions;
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
export declare const createCrudOperations: (resourceName: string, tag: string) => {
    create: ApiOperationOptions;
    findAll: ApiOperationOptions;
    findOne: ApiOperationOptions;
    update: ApiOperationOptions;
    delete: ApiOperationOptions;
};
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
export declare const createSearchOperation: (resourceName: string, searchFields: string[], tag: string) => ApiOperationOptions;
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
export declare const createBulkOperation: (action: string, resourceName: string, tag: string) => ApiOperationOptions;
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
export declare const createPathParam: (name: string, description: string, type?: string, example?: string) => {
    name: string;
    description: string;
    type: string;
    required: boolean;
    example: string;
};
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
export declare const createQueryParam: (name: string, description: string, required?: boolean, type?: string, example?: any) => {
    name: string;
    description: string;
    required: boolean;
    type: string;
    example: any;
};
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
export declare const createPaginationParams: () => {
    name: string;
    description: string;
    required: boolean;
    type: string;
    example: any;
}[];
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
export declare const createFilterParam: (filterableFields: string[]) => {
    name: string;
    description: string;
    required: boolean;
    type: string;
    example: string;
};
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
export declare const createDateRangeParams: (fieldName: string) => {
    name: string;
    description: string;
    required: boolean;
    type: string;
    example: any;
}[];
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
export declare const createBearerAuth: (name?: string, description?: string) => {
    name: string;
    type: string;
    scheme: string;
    bearerFormat: string;
    description: string;
};
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
export declare const createApiKeyAuth: (keyName: string, location: "header" | "query", description?: string) => {
    type: string;
    in: "query" | "header";
    name: string;
    description: string;
};
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
export declare const createOAuth2Security: (scopes: string[], authUrl?: string, tokenUrl?: string) => {
    type: string;
    flows: {
        authorizationCode: {
            authorizationUrl: string;
            tokenUrl: string;
            scopes: {};
        };
    };
};
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
export declare const createSecurityRequirement: (schemeName: string, scopes?: string[]) => ApiSecurityOptions;
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
export declare const createRequestExample: (exampleData: object, description?: string) => {
    description: string;
    value: object;
};
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
export declare const createMultipleExamples: (examples: Record<string, unknown>) => Record<string, {
    summary: string;
    value: unknown;
}>;
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
export declare const generateExampleByType: (type: string, format?: string) => string | number | boolean | unknown[] | Record<string, unknown> | null;
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
export declare const createPaginationExample: (page?: number, limit?: number, total?: number) => PaginationMetadata;
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
export declare const createErrorExample: (statusCode: number, message: string, error?: string) => {
    statusCode: number;
    message: string;
    error: string;
    timestamp: string;
    path: string;
};
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
export declare const createApiTag: (name: string, description: string, externalDocsUrl?: string) => ApiTagOptions;
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
export declare const createResourceTags: (resourceName: string) => ApiTagOptions[];
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
export declare const createModuleTags: (moduleNames: string[]) => ApiTagOptions[];
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
export declare const createNestedSchema: (description: string, properties: Record<string, unknown>, required?: string[]) => Record<string, unknown>;
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
export declare const createSchemaRef: (schemaName: string) => {
    $ref: string;
};
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
export declare const createOneOfSchema: (schemaNames: string[], discriminator?: string) => {
    oneOf: {
        $ref: string;
    }[];
} | {
    discriminator: {
        propertyName: string;
        mapping: {};
    };
    oneOf: {
        $ref: string;
    }[];
};
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
export declare const createAllOfSchema: (schemaNames: string[], additionalProperties?: Record<string, unknown>) => {
    allOf: Array<Record<string, unknown>>;
};
declare const _default: {
    createStringProperty: (description: string, example?: string, minLength?: number, maxLength?: number, pattern?: string) => ApiPropertyOptions;
    createNumberProperty: (description: string, example?: number, min?: number, max?: number, isInteger?: boolean) => ApiPropertyOptions;
    createBooleanProperty: (description: string, example?: boolean, defaultValue?: boolean) => ApiPropertyOptions;
    createEnumProperty: (description: string, enumValues: Array<string | number | boolean>, example?: string | number | boolean) => ApiPropertyOptions;
    createArrayProperty: (description: string, itemType: Function, example?: unknown[], minItems?: number, maxItems?: number) => ApiPropertyOptions;
    createDateProperty: (description: string, includeTime?: boolean, example?: string) => ApiPropertyOptions;
    createUuidProperty: (description: string, example?: string) => ApiPropertyOptions;
    createEmailProperty: (description: string, example?: string) => ApiPropertyOptions;
    createUrlProperty: (description: string, example?: string) => ApiPropertyOptions;
    createOptionalProperty: (baseOptions: ApiPropertyOptions, defaultValue?: unknown) => ApiPropertyOptions;
    createSuccessResponse: (status: number, description: string, type?: Function, isArray?: boolean) => ApiResponseOptions;
    createErrorResponse: (status: number, description: string, errorSchema?: Record<string, unknown>) => ApiResponseOptions;
    createPaginatedResponse: (description: string, itemType: Function & {
        name: string;
    }) => ApiResponseOptions;
    createCrudResponses: (dtoType: Function, resourceName: string) => ApiResponseOptions[];
    createFileUploadResponse: (description: string) => ApiResponseOptions;
    createAsyncJobResponse: (description: string) => ApiResponseOptions;
    createOperation: (summary: string, description?: string, tags?: string[], deprecated?: boolean) => ApiOperationOptions;
    createCrudOperations: (resourceName: string, tag: string) => {
        create: ApiOperationOptions;
        findAll: ApiOperationOptions;
        findOne: ApiOperationOptions;
        update: ApiOperationOptions;
        delete: ApiOperationOptions;
    };
    createSearchOperation: (resourceName: string, searchFields: string[], tag: string) => ApiOperationOptions;
    createBulkOperation: (action: string, resourceName: string, tag: string) => ApiOperationOptions;
    createPathParam: (name: string, description: string, type?: string, example?: string) => {
        name: string;
        description: string;
        type: string;
        required: boolean;
        example: string;
    };
    createQueryParam: (name: string, description: string, required?: boolean, type?: string, example?: any) => {
        name: string;
        description: string;
        required: boolean;
        type: string;
        example: any;
    };
    createPaginationParams: () => {
        name: string;
        description: string;
        required: boolean;
        type: string;
        example: any;
    }[];
    createFilterParam: (filterableFields: string[]) => {
        name: string;
        description: string;
        required: boolean;
        type: string;
        example: string;
    };
    createDateRangeParams: (fieldName: string) => {
        name: string;
        description: string;
        required: boolean;
        type: string;
        example: any;
    }[];
    createBearerAuth: (name?: string, description?: string) => {
        name: string;
        type: string;
        scheme: string;
        bearerFormat: string;
        description: string;
    };
    createApiKeyAuth: (keyName: string, location: "header" | "query", description?: string) => {
        type: string;
        in: "query" | "header";
        name: string;
        description: string;
    };
    createOAuth2Security: (scopes: string[], authUrl?: string, tokenUrl?: string) => {
        type: string;
        flows: {
            authorizationCode: {
                authorizationUrl: string;
                tokenUrl: string;
                scopes: {};
            };
        };
    };
    createSecurityRequirement: (schemeName: string, scopes?: string[]) => ApiSecurityOptions;
    createRequestExample: (exampleData: object, description?: string) => {
        description: string;
        value: object;
    };
    createMultipleExamples: (examples: Record<string, unknown>) => Record<string, {
        summary: string;
        value: unknown;
    }>;
    generateExampleByType: (type: string, format?: string) => string | number | boolean | unknown[] | Record<string, unknown> | null;
    createPaginationExample: (page?: number, limit?: number, total?: number) => PaginationMetadata;
    createErrorExample: (statusCode: number, message: string, error?: string) => {
        statusCode: number;
        message: string;
        error: string;
        timestamp: string;
        path: string;
    };
    createApiTag: (name: string, description: string, externalDocsUrl?: string) => ApiTagOptions;
    createResourceTags: (resourceName: string) => ApiTagOptions[];
    createModuleTags: (moduleNames: string[]) => ApiTagOptions[];
    createNestedSchema: (description: string, properties: Record<string, unknown>, required?: string[]) => Record<string, unknown>;
    createSchemaRef: (schemaName: string) => {
        $ref: string;
    };
    createOneOfSchema: (schemaNames: string[], discriminator?: string) => {
        oneOf: {
            $ref: string;
        }[];
    } | {
        discriminator: {
            propertyName: string;
            mapping: {};
        };
        oneOf: {
            $ref: string;
        }[];
    };
    createAllOfSchema: (schemaNames: string[], additionalProperties?: Record<string, unknown>) => {
        allOf: Array<Record<string, unknown>>;
    };
};
export default _default;
//# sourceMappingURL=swagger-documentation-kit.d.ts.map