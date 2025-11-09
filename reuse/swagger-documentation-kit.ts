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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
export const createStringProperty = (
  description: string,
  example?: string,
  minLength?: number,
  maxLength?: number,
  pattern?: string,
): ApiPropertyOptions => {
  if (!description || description.trim().length === 0) {
    throw new Error('Description is required for string property');
  }

  const options: ApiPropertyOptions = {
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
export const createNumberProperty = (
  description: string,
  example?: number,
  min?: number,
  max?: number,
  isInteger?: boolean,
): ApiPropertyOptions => {
  const options: ApiPropertyOptions = {
    type: Number,
    description,
    example: example ?? 42,
  };

  if (min !== undefined) options.minimum = min;
  if (max !== undefined) options.maximum = max;
  if (isInteger) options.format = 'int32';

  return options;
};

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
export const createBooleanProperty = (
  description: string,
  example?: boolean,
  defaultValue?: boolean,
): ApiPropertyOptions => {
  return {
    type: Boolean,
    description,
    example: example ?? true,
    default: defaultValue,
  };
};

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
export const createEnumProperty = (
  description: string,
  enumValues: Array<string | number | boolean>,
  example?: string | number | boolean,
): ApiPropertyOptions => {
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
export const createArrayProperty = (
  description: string,
  itemType: Function,
  example?: unknown[],
  minItems?: number,
  maxItems?: number,
): ApiPropertyOptions => {
  if (!description || description.trim().length === 0) {
    throw new Error('Description is required for array property');
  }
  if (typeof itemType !== 'function') {
    throw new Error('itemType must be a valid type constructor');
  }

  const options: ApiPropertyOptions = {
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
export const createDateProperty = (
  description: string,
  includeTime?: boolean,
  example?: string,
): ApiPropertyOptions => {
  return {
    type: Date,
    description,
    format: includeTime ? 'date-time' : 'date',
    example: example || (includeTime ? '2024-03-15T10:30:00Z' : '2024-03-15'),
  };
};

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
export const createUuidProperty = (
  description: string,
  example?: string,
): ApiPropertyOptions => {
  return {
    type: String,
    description,
    format: 'uuid',
    example: example || '123e4567-e89b-12d3-a456-426614174000',
  };
};

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
export const createEmailProperty = (
  description: string,
  example?: string,
): ApiPropertyOptions => {
  return {
    type: String,
    description,
    format: 'email',
    example: example || 'user@example.com',
  };
};

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
export const createUrlProperty = (
  description: string,
  example?: string,
): ApiPropertyOptions => {
  return {
    type: String,
    description,
    format: 'uri',
    example: example || 'https://example.com',
  };
};

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
export const createOptionalProperty = (
  baseOptions: ApiPropertyOptions,
  defaultValue?: unknown,
): ApiPropertyOptions => {
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
export const createSuccessResponse = (
  status: number,
  description: string,
  type?: Function,
  isArray?: boolean,
): ApiResponseOptions => {
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
export const createErrorResponse = (
  status: number,
  description: string,
  errorSchema?: Record<string, unknown>,
): ApiResponseOptions => {
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
export const createPaginatedResponse = (
  description: string,
  itemType: Function & { name: string },
): ApiResponseOptions => {
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
export const createCrudResponses = (
  dtoType: Function,
  resourceName: string,
): ApiResponseOptions[] => {
  if (typeof dtoType !== 'function') {
    throw new Error('dtoType must be a valid type constructor');
  }
  if (!resourceName || resourceName.trim().length === 0) {
    throw new Error('resourceName is required');
  }

  const sanitizedResourceName = resourceName.trim();
  return [
    createSuccessResponse(200, `${sanitizedResourceName} retrieved successfully`, dtoType),
    createSuccessResponse(201, `${sanitizedResourceName} created successfully`, dtoType),
    createErrorResponse(400, 'Invalid input data'),
    createErrorResponse(404, `${sanitizedResourceName} not found`),
    createErrorResponse(409, `${sanitizedResourceName} already exists`),
    createErrorResponse(500, 'Internal server error'),
  ];
};

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
export const createFileUploadResponse = (description: string): ApiResponseOptions => {
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
export const createAsyncJobResponse = (description: string): ApiResponseOptions => {
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
export const createOperation = (
  summary: string,
  description?: string,
  tags?: string[],
  deprecated?: boolean,
): ApiOperationOptions => {
  return {
    summary,
    description,
    tags,
    deprecated: deprecated || false,
  };
};

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
export const createCrudOperations = (resourceName: string, tag: string) => {
  return {
    create: createOperation(
      `Create ${resourceName}`,
      `Creates a new ${resourceName} record`,
      [tag],
    ),
    findAll: createOperation(
      `Get all ${resourceName}s`,
      `Retrieves a paginated list of ${resourceName}s`,
      [tag],
    ),
    findOne: createOperation(
      `Get ${resourceName} by ID`,
      `Retrieves a single ${resourceName} by unique identifier`,
      [tag],
    ),
    update: createOperation(
      `Update ${resourceName}`,
      `Updates an existing ${resourceName} record`,
      [tag],
    ),
    delete: createOperation(
      `Delete ${resourceName}`,
      `Soft or hard deletes a ${resourceName} record`,
      [tag],
    ),
  };
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
export const createSearchOperation = (
  resourceName: string,
  searchFields: string[],
  tag: string,
): ApiOperationOptions => {
  return {
    summary: `Search ${resourceName}s`,
    description: `Search ${resourceName}s by: ${searchFields.join(', ')}. Supports fuzzy matching and filters.`,
    tags: [tag],
  };
};

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
export const createBulkOperation = (
  action: string,
  resourceName: string,
  tag: string,
): ApiOperationOptions => {
  return {
    summary: `Bulk ${action} ${resourceName}s`,
    description: `Performs ${action} operation on multiple ${resourceName} records in a single request`,
    tags: [tag],
  };
};

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
export const createPathParam = (
  name: string,
  description: string,
  type?: string,
  example?: string,
) => {
  return {
    name,
    description,
    type: type || 'string',
    required: true,
    example: example || 'example-value',
  };
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
export const createQueryParam = (
  name: string,
  description: string,
  required?: boolean,
  type?: string,
  example?: any,
) => {
  return {
    name,
    description,
    required: required || false,
    type: type || 'string',
    example: example || 'example-value',
  };
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
export const createPaginationParams = () => {
  return [
    createQueryParam('page', 'Page number (1-based)', false, 'number', 1),
    createQueryParam('limit', 'Items per page', false, 'number', 20),
    createQueryParam('sort', 'Sort field and direction (e.g., "createdAt:desc")', false, 'string', 'createdAt:desc'),
    createQueryParam('search', 'Search query string', false, 'string', ''),
  ];
};

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
export const createFilterParam = (filterableFields: string[]) => {
  return {
    name: 'filter',
    description: `Filter results by fields: ${filterableFields.join(', ')}. Format: field:value (e.g., status:active)`,
    required: false,
    type: 'string',
    example: `${filterableFields[0]}:example`,
  };
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
export const createDateRangeParams = (fieldName: string) => {
  return [
    createQueryParam(
      `${fieldName}From`,
      `Filter ${fieldName} from this date (inclusive)`,
      false,
      'string',
      '2024-01-01',
    ),
    createQueryParam(
      `${fieldName}To`,
      `Filter ${fieldName} to this date (inclusive)`,
      false,
      'string',
      '2024-12-31',
    ),
  ];
};

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
export const createBearerAuth = (name?: string, description?: string) => {
  return {
    name: name || 'bearer',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: description || 'JWT Bearer token authentication',
  };
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
export const createApiKeyAuth = (
  keyName: string,
  location: 'header' | 'query',
  description?: string,
) => {
  return {
    type: 'apiKey',
    in: location,
    name: keyName,
    description: description || `API key authentication via ${location}`,
  };
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
export const createOAuth2Security = (
  scopes: string[],
  authUrl?: string,
  tokenUrl?: string,
) => {
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
export const createSecurityRequirement = (
  schemeName: string,
  scopes?: string[],
): ApiSecurityOptions => {
  return {
    name: schemeName,
    scopes: scopes || [],
  };
};

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
export const createRequestExample = (exampleData: object, description?: string) => {
  return {
    description: description || 'Example request',
    value: exampleData,
  };
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
export const createMultipleExamples = (examples: Record<string, unknown>): Record<string, { summary: string; value: unknown }> => {
  if (!examples || typeof examples !== 'object' || Object.keys(examples).length === 0) {
    throw new Error('examples must be a non-empty object');
  }

  return Object.entries(examples).reduce(
    (acc, [key, value]) => {
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
    },
    {} as Record<string, { summary: string; value: unknown }>,
  );
};

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
export const generateExampleByType = (type: string, format?: string): string | number | boolean | unknown[] | Record<string, unknown> | null => {
  if (!type || typeof type !== 'string') {
    throw new Error('Type must be a non-empty string');
  }

  const normalizedType = type.toLowerCase().trim();

  switch (normalizedType) {
    case 'string':
      if (format === 'email') return 'user@example.com';
      if (format === 'uuid') return '123e4567-e89b-12d3-a456-426614174000';
      if (format === 'date') return '2024-03-15';
      if (format === 'date-time') return '2024-03-15T10:30:00Z';
      if (format === 'uri') return 'https://example.com';
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
export const createPaginationExample = (
  page: number = 1,
  limit: number = 20,
  total: number = 100,
): PaginationMetadata => {
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
export const createErrorExample = (
  statusCode: number,
  message: string,
  error?: string,
) => {
  return {
    statusCode,
    message,
    error: error || 'Error',
    timestamp: new Date().toISOString(),
    path: '/api/resource/id',
  };
};

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
export const createApiTag = (
  name: string,
  description: string,
  externalDocsUrl?: string,
): ApiTagOptions => {
  const tag: ApiTagOptions = { name, description };
  if (externalDocsUrl) {
    tag.externalDocs = {
      description: `${name} documentation`,
      url: externalDocsUrl,
    };
  }
  return tag;
};

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
export const createResourceTags = (resourceName: string): ApiTagOptions[] => {
  return [
    createApiTag(`${resourceName}s`, `${resourceName} CRUD operations`),
    createApiTag(`${resourceName} Management`, `Advanced ${resourceName} management features`),
  ];
};

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
export const createModuleTags = (moduleNames: string[]): ApiTagOptions[] => {
  return moduleNames.map((name) => createApiTag(name, `${name} module endpoints`));
};

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
export const createNestedSchema = (
  description: string,
  properties: Record<string, unknown>,
  required?: string[],
): Record<string, unknown> => {
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
export const createSchemaRef = (schemaName: string) => {
  return { $ref: `#/components/schemas/${schemaName}` };
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
export const createOneOfSchema = (schemaNames: string[], discriminator?: string) => {
  const schema = {
    oneOf: schemaNames.map((name) => createSchemaRef(name)),
  };

  if (discriminator) {
    return {
      ...schema,
      discriminator: {
        propertyName: discriminator,
        mapping: schemaNames.reduce(
          (acc, name) => ({ ...acc, [name.toLowerCase()]: createSchemaRef(name) }),
          {},
        ),
      },
    };
  }

  return schema;
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
export const createAllOfSchema = (
  schemaNames: string[],
  additionalProperties?: Record<string, unknown>,
): { allOf: Array<Record<string, unknown>> } => {
  if (!Array.isArray(schemaNames) || schemaNames.length === 0) {
    throw new Error('schemaNames must be a non-empty array');
  }

  const schemas = schemaNames.map((name) => {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new Error('Each schema name must be a non-empty string');
    }
    return createSchemaRef(name);
  });

  if (additionalProperties && typeof additionalProperties === 'object') {
    schemas.push({
      type: 'object',
      properties: { ...additionalProperties },
    });
  }

  return { allOf: schemas };
};

export default {
  // API Property decorators
  createStringProperty,
  createNumberProperty,
  createBooleanProperty,
  createEnumProperty,
  createArrayProperty,
  createDateProperty,
  createUuidProperty,
  createEmailProperty,
  createUrlProperty,
  createOptionalProperty,

  // API Response documentation
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse,
  createCrudResponses,
  createFileUploadResponse,
  createAsyncJobResponse,

  // API Operation documentation
  createOperation,
  createCrudOperations,
  createSearchOperation,
  createBulkOperation,

  // Parameter documentation
  createPathParam,
  createQueryParam,
  createPaginationParams,
  createFilterParam,
  createDateRangeParams,

  // Security scheme documentation
  createBearerAuth,
  createApiKeyAuth,
  createOAuth2Security,
  createSecurityRequirement,

  // Example generation
  createRequestExample,
  createMultipleExamples,
  generateExampleByType,
  createPaginationExample,
  createErrorExample,

  // Tag and grouping utilities
  createApiTag,
  createResourceTags,
  createModuleTags,

  // Schema composition utilities
  createNestedSchema,
  createSchemaRef,
  createOneOfSchema,
  createAllOfSchema,
};
