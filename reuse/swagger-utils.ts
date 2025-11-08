/**
 * LOC: SWG1234567
 * File: /reuse/swagger-utils.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - API documentation modules
 *   - NestJS controller decorators
 *   - OpenAPI specification builders
 */

/**
 * File: /reuse/swagger-utils.ts
 * Locator: WC-UTL-SWG-001
 * Purpose: Swagger/OpenAPI Documentation Utilities - Comprehensive API documentation helpers
 *
 * Upstream: Independent utility module for OpenAPI/Swagger specifications
 * Downstream: ../backend/*, API documentation generation, schema validation
 * Dependencies: TypeScript 5.x, Node 18+, OpenAPI 3.0+ compatible
 * Exports: 40 utility functions for OpenAPI spec generation and management
 *
 * LLM Context: Comprehensive Swagger/OpenAPI utilities for API documentation.
 * Provides schema builders, parameter helpers, security definitions, response builders,
 * and validation utilities. Essential for maintaining consistent API documentation
 * across the White Cross healthcare system.
 */

// ============================================================================
// SCHEMA GENERATION HELPERS
// ============================================================================

/**
 * Creates a basic OpenAPI schema object for primitive types.
 *
 * @param {string} type - The JSON schema type (string, number, boolean, integer, array, object)
 * @param {string} [format] - Optional format specifier (e.g., 'date-time', 'email', 'uuid')
 * @param {string} [description] - Optional description of the schema
 * @returns {object} OpenAPI schema object
 *
 * @example
 * ```typescript
 * const emailSchema = createBasicSchema('string', 'email', 'User email address');
 * // Result: { type: 'string', format: 'email', description: 'User email address' }
 *
 * const ageSchema = createBasicSchema('integer', undefined, 'Student age');
 * // Result: { type: 'integer', description: 'Student age' }
 * ```
 */
export const createBasicSchema = (
  type: string,
  format?: string,
  description?: string,
) => {
  const schema: Record<string, any> = { type };
  if (format) schema.format = format;
  if (description) schema.description = description;
  return schema;
};

/**
 * Creates an OpenAPI array schema with item type specification.
 *
 * @param {object} itemSchema - Schema definition for array items
 * @param {number} [minItems] - Minimum number of items
 * @param {number} [maxItems] - Maximum number of items
 * @param {boolean} [uniqueItems] - Whether items must be unique
 * @returns {object} OpenAPI array schema object
 *
 * @example
 * ```typescript
 * const stringArraySchema = createArraySchema({ type: 'string' }, 1, 10, true);
 * // Result: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 10, uniqueItems: true }
 *
 * const studentIdsSchema = createArraySchema({ type: 'string', format: 'uuid' });
 * // Result: { type: 'array', items: { type: 'string', format: 'uuid' } }
 * ```
 */
export const createArraySchema = (
  itemSchema: Record<string, any>,
  minItems?: number,
  maxItems?: number,
  uniqueItems?: boolean,
) => {
  const schema: Record<string, any> = {
    type: 'array',
    items: itemSchema,
  };
  if (minItems !== undefined) schema.minItems = minItems;
  if (maxItems !== undefined) schema.maxItems = maxItems;
  if (uniqueItems !== undefined) schema.uniqueItems = uniqueItems;
  return schema;
};

/**
 * Creates an OpenAPI object schema with required and optional properties.
 *
 * @param {Record<string, any>} properties - Object property schemas
 * @param {string[]} required - Array of required property names
 * @param {string} [description] - Optional description of the object
 * @returns {object} OpenAPI object schema
 *
 * @example
 * ```typescript
 * const studentSchema = createObjectSchema(
 *   {
 *     id: { type: 'string', format: 'uuid' },
 *     name: { type: 'string' },
 *     grade: { type: 'integer' }
 *   },
 *   ['id', 'name'],
 *   'Student information'
 * );
 * // Result: { type: 'object', properties: {...}, required: ['id', 'name'], description: '...' }
 * ```
 */
export const createObjectSchema = (
  properties: Record<string, any>,
  required: string[],
  description?: string,
) => {
  const schema: Record<string, any> = {
    type: 'object',
    properties,
    required,
  };
  if (description) schema.description = description;
  return schema;
};

/**
 * Creates an enum schema with allowed values and descriptions.
 *
 * @template T
 * @param {T[]} values - Array of allowed enum values
 * @param {string} type - The base type of enum values (string, number, integer)
 * @param {string} [description] - Optional description of the enum
 * @returns {object} OpenAPI enum schema
 *
 * @example
 * ```typescript
 * const statusEnum = createEnumSchema(['active', 'inactive', 'pending'], 'string', 'Student status');
 * // Result: { type: 'string', enum: ['active', 'inactive', 'pending'], description: 'Student status' }
 * ```
 */
export const createEnumSchema = <T>(
  values: T[],
  type: string,
  description?: string,
) => {
  const schema: Record<string, any> = {
    type,
    enum: values,
  };
  if (description) schema.description = description;
  return schema;
};

/**
 * Creates a reference schema pointing to a component schema.
 *
 * @param {string} componentName - Name of the component in #/components/schemas/
 * @returns {object} OpenAPI $ref object
 *
 * @example
 * ```typescript
 * const studentRef = createRefSchema('Student');
 * // Result: { $ref: '#/components/schemas/Student' }
 *
 * const errorRef = createRefSchema('ErrorResponse');
 * // Result: { $ref: '#/components/schemas/ErrorResponse' }
 * ```
 */
export const createRefSchema = (componentName: string) => {
  return { $ref: `#/components/schemas/${componentName}` };
};

/**
 * Creates a schema with validation constraints (min, max, pattern, etc.).
 *
 * @param {string} type - The JSON schema type
 * @param {object} constraints - Validation constraints object
 * @returns {object} OpenAPI schema with validation
 *
 * @example
 * ```typescript
 * const ageSchema = createValidatedSchema('integer', { minimum: 0, maximum: 120 });
 * // Result: { type: 'integer', minimum: 0, maximum: 120 }
 *
 * const nameSchema = createValidatedSchema('string', { minLength: 1, maxLength: 100, pattern: '^[a-zA-Z ]+$' });
 * // Result: { type: 'string', minLength: 1, maxLength: 100, pattern: '^[a-zA-Z ]+$' }
 * ```
 */
export const createValidatedSchema = (
  type: string,
  constraints: Record<string, any>,
) => {
  return { type, ...constraints };
};

/**
 * Creates a nullable schema (allows null value).
 *
 * @param {object} schema - Base schema to make nullable
 * @returns {object} OpenAPI schema that allows null
 *
 * @example
 * ```typescript
 * const nullableString = createNullableSchema({ type: 'string' });
 * // Result: { type: 'string', nullable: true }
 *
 * const nullableStudent = createNullableSchema({ $ref: '#/components/schemas/Student' });
 * // Result: { $ref: '#/components/schemas/Student', nullable: true }
 * ```
 */
export const createNullableSchema = (schema: Record<string, any>) => {
  return { ...schema, nullable: true };
};

/**
 * Creates a oneOf schema for polymorphic types.
 *
 * @param {object[]} schemas - Array of possible schemas
 * @param {string} [description] - Optional description
 * @returns {object} OpenAPI oneOf schema
 *
 * @example
 * ```typescript
 * const paymentSchema = createOneOfSchema([
 *   { $ref: '#/components/schemas/CreditCardPayment' },
 *   { $ref: '#/components/schemas/BankTransferPayment' }
 * ], 'Payment method details');
 * // Result: { oneOf: [...], description: 'Payment method details' }
 * ```
 */
export const createOneOfSchema = (
  schemas: Record<string, any>[],
  description?: string,
) => {
  const schema: Record<string, any> = { oneOf: schemas };
  if (description) schema.description = description;
  return schema;
};

// ============================================================================
// API DOCUMENTATION BUILDERS
// ============================================================================

/**
 * Creates an OpenAPI operation object for an endpoint.
 *
 * @param {string} summary - Short summary of the operation
 * @param {string} description - Detailed description of the operation
 * @param {string[]} tags - Array of tag names for grouping
 * @returns {object} OpenAPI operation object
 *
 * @example
 * ```typescript
 * const operation = createOperation(
 *   'Get student by ID',
 *   'Retrieves detailed student information including health records',
 *   ['Students', 'Health']
 * );
 * // Result: { summary: '...', description: '...', tags: ['Students', 'Health'] }
 * ```
 */
export const createOperation = (
  summary: string,
  description: string,
  tags: string[],
) => {
  return {
    summary,
    description,
    tags,
  };
};

/**
 * Creates an OpenAPI tag object for grouping endpoints.
 *
 * @param {string} name - Tag name
 * @param {string} description - Tag description
 * @param {string} [externalDocsUrl] - Optional external documentation URL
 * @returns {object} OpenAPI tag object
 *
 * @example
 * ```typescript
 * const tag = createTag('Students', 'Student management endpoints', 'https://docs.example.com/students');
 * // Result: { name: 'Students', description: '...', externalDocs: { url: '...' } }
 * ```
 */
export const createTag = (
  name: string,
  description: string,
  externalDocsUrl?: string,
) => {
  const tag: Record<string, any> = { name, description };
  if (externalDocsUrl) {
    tag.externalDocs = { url: externalDocsUrl };
  }
  return tag;
};

/**
 * Creates an OpenAPI info object for API metadata.
 *
 * @param {string} title - API title
 * @param {string} version - API version
 * @param {string} description - API description
 * @param {object} [contact] - Contact information
 * @returns {object} OpenAPI info object
 *
 * @example
 * ```typescript
 * const info = createApiInfo(
 *   'White Cross Healthcare API',
 *   '1.0.0',
 *   'Comprehensive API for healthcare management',
 *   { name: 'API Support', email: 'api@whitecross.com' }
 * );
 * ```
 */
export const createApiInfo = (
  title: string,
  version: string,
  description: string,
  contact?: Record<string, any>,
) => {
  const info: Record<string, any> = {
    title,
    version,
    description,
  };
  if (contact) info.contact = contact;
  return info;
};

/**
 * Creates an OpenAPI server object for different environments.
 *
 * @param {string} url - Server URL
 * @param {string} description - Server description
 * @param {Record<string, any>} [variables] - Server variables
 * @returns {object} OpenAPI server object
 *
 * @example
 * ```typescript
 * const server = createServer(
 *   'https://api.whitecross.com/v1',
 *   'Production server',
 *   { basePath: { default: 'v1', enum: ['v1', 'v2'] } }
 * );
 * ```
 */
export const createServer = (
  url: string,
  description: string,
  variables?: Record<string, any>,
) => {
  const server: Record<string, any> = { url, description };
  if (variables) server.variables = variables;
  return server;
};

/**
 * Creates an OpenAPI external documentation object.
 *
 * @param {string} url - Documentation URL
 * @param {string} [description] - Documentation description
 * @returns {object} OpenAPI external docs object
 *
 * @example
 * ```typescript
 * const docs = createExternalDocs('https://docs.whitecross.com', 'Full API documentation');
 * // Result: { url: 'https://docs.whitecross.com', description: 'Full API documentation' }
 * ```
 */
export const createExternalDocs = (url: string, description?: string) => {
  const docs: Record<string, any> = { url };
  if (description) docs.description = description;
  return docs;
};

/**
 * Creates a complete OpenAPI path item with multiple HTTP methods.
 *
 * @param {Record<string, any>} operations - Object mapping HTTP methods to operations
 * @returns {object} OpenAPI path item object
 *
 * @example
 * ```typescript
 * const pathItem = createPathItem({
 *   get: { summary: 'Get student', responses: {...} },
 *   put: { summary: 'Update student', requestBody: {...}, responses: {...} }
 * });
 * ```
 */
export const createPathItem = (operations: Record<string, any>) => {
  return operations;
};

/**
 * Creates an OpenAPI request body object.
 *
 * @param {object} content - Content type to schema mapping
 * @param {string} [description] - Request body description
 * @param {boolean} [required] - Whether request body is required
 * @returns {object} OpenAPI request body object
 *
 * @example
 * ```typescript
 * const requestBody = createRequestBody(
 *   { 'application/json': { schema: { $ref: '#/components/schemas/Student' } } },
 *   'Student data to create',
 *   true
 * );
 * ```
 */
export const createRequestBody = (
  content: Record<string, any>,
  description?: string,
  required?: boolean,
) => {
  const body: Record<string, any> = { content };
  if (description) body.description = description;
  if (required !== undefined) body.required = required;
  return body;
};

/**
 * Creates an OpenAPI callback object for webhooks.
 *
 * @param {string} expression - Callback URL expression
 * @param {Record<string, any>} operations - HTTP operations for the callback
 * @returns {object} OpenAPI callback object
 *
 * @example
 * ```typescript
 * const callback = createCallback(
 *   '{$request.body#/callbackUrl}',
 *   { post: { summary: 'Webhook notification', requestBody: {...} } }
 * );
 * ```
 */
export const createCallback = (
  expression: string,
  operations: Record<string, any>,
) => {
  return { [expression]: operations };
};

// ============================================================================
// RESPONSE TYPE BUILDERS
// ============================================================================

/**
 * Creates an OpenAPI response object with schema and description.
 *
 * @param {string} description - Response description
 * @param {object} [schema] - Response schema
 * @param {Record<string, any>} [headers] - Response headers
 * @returns {object} OpenAPI response object
 *
 * @example
 * ```typescript
 * const response = createResponse(
 *   'Student retrieved successfully',
 *   { $ref: '#/components/schemas/Student' },
 *   { 'X-Rate-Limit': { schema: { type: 'integer' } } }
 * );
 * ```
 */
export const createResponse = (
  description: string,
  schema?: Record<string, any>,
  headers?: Record<string, any>,
) => {
  const response: Record<string, any> = { description };
  if (schema) {
    response.content = {
      'application/json': { schema },
    };
  }
  if (headers) response.headers = headers;
  return response;
};

/**
 * Creates a standard success response (200 OK).
 *
 * @param {object} schema - Response data schema
 * @param {string} [description] - Custom description
 * @returns {object} OpenAPI 200 response object
 *
 * @example
 * ```typescript
 * const response = createSuccessResponse(
 *   { $ref: '#/components/schemas/Student' },
 *   'Student data retrieved'
 * );
 * ```
 */
export const createSuccessResponse = (
  schema: Record<string, any>,
  description?: string,
) => {
  return createResponse(description || 'Successful operation', schema);
};

/**
 * Creates a standard created response (201 Created).
 *
 * @param {object} schema - Created resource schema
 * @param {string} [description] - Custom description
 * @returns {object} OpenAPI 201 response object
 *
 * @example
 * ```typescript
 * const response = createCreatedResponse(
 *   { $ref: '#/components/schemas/Student' },
 *   'Student created successfully'
 * );
 * ```
 */
export const createCreatedResponse = (
  schema: Record<string, any>,
  description?: string,
) => {
  return createResponse(description || 'Resource created successfully', schema);
};

/**
 * Creates a standard error response with error schema.
 *
 * @param {number} statusCode - HTTP status code
 * @param {string} description - Error description
 * @param {object} [schema] - Error schema (defaults to standard error)
 * @returns {object} OpenAPI error response object
 *
 * @example
 * ```typescript
 * const response = createErrorResponse(404, 'Student not found');
 * const validationError = createErrorResponse(400, 'Validation failed', validationErrorSchema);
 * ```
 */
export const createErrorResponse = (
  statusCode: number,
  description: string,
  schema?: Record<string, any>,
) => {
  const errorSchema = schema || {
    type: 'object',
    properties: {
      statusCode: { type: 'integer' },
      message: { type: 'string' },
      error: { type: 'string' },
    },
  };
  return createResponse(description, errorSchema);
};

/**
 * Creates a paginated response schema with metadata.
 *
 * @param {object} itemSchema - Schema for individual items
 * @param {string} [description] - Response description
 * @returns {object} OpenAPI paginated response schema
 *
 * @example
 * ```typescript
 * const response = createPaginatedResponse(
 *   { $ref: '#/components/schemas/Student' },
 *   'Paginated list of students'
 * );
 * // Result includes data[], page, limit, total, totalPages
 * ```
 */
export const createPaginatedResponse = (
  itemSchema: Record<string, any>,
  description?: string,
) => {
  return createResponse(
    description || 'Paginated response',
    {
      type: 'object',
      properties: {
        data: { type: 'array', items: itemSchema },
        page: { type: 'integer', description: 'Current page number' },
        limit: { type: 'integer', description: 'Items per page' },
        total: { type: 'integer', description: 'Total number of items' },
        totalPages: { type: 'integer', description: 'Total number of pages' },
      },
    },
  );
};

/**
 * Creates a no-content response (204 No Content).
 *
 * @param {string} [description] - Custom description
 * @returns {object} OpenAPI 204 response object
 *
 * @example
 * ```typescript
 * const response = createNoContentResponse('Student deleted successfully');
 * ```
 */
export const createNoContentResponse = (description?: string) => {
  return { description: description || 'No content' };
};

// ============================================================================
// SECURITY DEFINITION HELPERS
// ============================================================================

/**
 * Creates a Bearer token (JWT) security scheme.
 *
 * @param {string} [description] - Security scheme description
 * @returns {object} OpenAPI Bearer security scheme
 *
 * @example
 * ```typescript
 * const bearerAuth = createBearerAuth('JWT token obtained from /auth/login');
 * // Result: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: '...' }
 * ```
 */
export const createBearerAuth = (description?: string) => {
  return {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: description || 'Bearer authentication with JWT token',
  };
};

/**
 * Creates an API key security scheme.
 *
 * @param {string} name - Header/query parameter name
 * @param {'header' | 'query' | 'cookie'} location - Where the API key is sent
 * @param {string} [description] - Security scheme description
 * @returns {object} OpenAPI API key security scheme
 *
 * @example
 * ```typescript
 * const apiKey = createApiKeyAuth('X-API-Key', 'header', 'API key for authentication');
 * // Result: { type: 'apiKey', in: 'header', name: 'X-API-Key', description: '...' }
 * ```
 */
export const createApiKeyAuth = (
  name: string,
  location: 'header' | 'query' | 'cookie',
  description?: string,
) => {
  return {
    type: 'apiKey',
    in: location,
    name,
    description: description || `API key sent in ${location}`,
  };
};

/**
 * Creates an OAuth2 security scheme with flows.
 *
 * @param {Record<string, any>} flows - OAuth2 flows configuration
 * @param {string} [description] - Security scheme description
 * @returns {object} OpenAPI OAuth2 security scheme
 *
 * @example
 * ```typescript
 * const oauth = createOAuth2Auth({
 *   authorizationCode: {
 *     authorizationUrl: 'https://auth.example.com/oauth/authorize',
 *     tokenUrl: 'https://auth.example.com/oauth/token',
 *     scopes: { 'read:students': 'Read student data' }
 *   }
 * });
 * ```
 */
export const createOAuth2Auth = (
  flows: Record<string, any>,
  description?: string,
) => {
  return {
    type: 'oauth2',
    flows,
    description: description || 'OAuth2 authentication',
  };
};

/**
 * Creates a Basic authentication security scheme.
 *
 * @param {string} [description] - Security scheme description
 * @returns {object} OpenAPI Basic auth security scheme
 *
 * @example
 * ```typescript
 * const basicAuth = createBasicAuth('Basic authentication with username and password');
 * // Result: { type: 'http', scheme: 'basic', description: '...' }
 * ```
 */
export const createBasicAuth = (description?: string) => {
  return {
    type: 'http',
    scheme: 'basic',
    description: description || 'Basic authentication',
  };
};

// ============================================================================
// PARAMETER DOCUMENTATION UTILITIES
// ============================================================================

/**
 * Creates a path parameter definition.
 *
 * @param {string} name - Parameter name
 * @param {object} schema - Parameter schema
 * @param {string} [description] - Parameter description
 * @returns {object} OpenAPI path parameter object
 *
 * @example
 * ```typescript
 * const idParam = createPathParameter('id', { type: 'string', format: 'uuid' }, 'Student ID');
 * // Result: { name: 'id', in: 'path', required: true, schema: {...}, description: '...' }
 * ```
 */
export const createPathParameter = (
  name: string,
  schema: Record<string, any>,
  description?: string,
) => {
  const param: Record<string, any> = {
    name,
    in: 'path',
    required: true,
    schema,
  };
  if (description) param.description = description;
  return param;
};

/**
 * Creates a query parameter definition.
 *
 * @param {string} name - Parameter name
 * @param {object} schema - Parameter schema
 * @param {boolean} [required] - Whether parameter is required
 * @param {string} [description] - Parameter description
 * @returns {object} OpenAPI query parameter object
 *
 * @example
 * ```typescript
 * const pageParam = createQueryParameter('page', { type: 'integer', default: 1 }, false, 'Page number');
 * // Result: { name: 'page', in: 'query', required: false, schema: {...}, description: '...' }
 * ```
 */
export const createQueryParameter = (
  name: string,
  schema: Record<string, any>,
  required?: boolean,
  description?: string,
) => {
  const param: Record<string, any> = {
    name,
    in: 'query',
    required: required || false,
    schema,
  };
  if (description) param.description = description;
  return param;
};

/**
 * Creates a header parameter definition.
 *
 * @param {string} name - Header name
 * @param {object} schema - Parameter schema
 * @param {boolean} [required] - Whether header is required
 * @param {string} [description] - Parameter description
 * @returns {object} OpenAPI header parameter object
 *
 * @example
 * ```typescript
 * const authHeader = createHeaderParameter('Authorization', { type: 'string' }, true, 'Bearer token');
 * ```
 */
export const createHeaderParameter = (
  name: string,
  schema: Record<string, any>,
  required?: boolean,
  description?: string,
) => {
  const param: Record<string, any> = {
    name,
    in: 'header',
    required: required || false,
    schema,
  };
  if (description) param.description = description;
  return param;
};

/**
 * Creates standard pagination query parameters (page, limit, sort).
 *
 * @returns {object[]} Array of OpenAPI pagination parameter objects
 *
 * @example
 * ```typescript
 * const paginationParams = createPaginationParameters();
 * // Result: [{ name: 'page', ... }, { name: 'limit', ... }, { name: 'sort', ... }]
 * ```
 */
export const createPaginationParameters = () => {
  return [
    createQueryParameter(
      'page',
      { type: 'integer', minimum: 1, default: 1 },
      false,
      'Page number for pagination',
    ),
    createQueryParameter(
      'limit',
      { type: 'integer', minimum: 1, maximum: 100, default: 20 },
      false,
      'Number of items per page',
    ),
    createQueryParameter(
      'sort',
      { type: 'string' },
      false,
      'Sort field and order (e.g., "createdAt:desc")',
    ),
  ];
};

/**
 * Creates a cookie parameter definition.
 *
 * @param {string} name - Cookie name
 * @param {object} schema - Parameter schema
 * @param {boolean} [required] - Whether cookie is required
 * @param {string} [description] - Parameter description
 * @returns {object} OpenAPI cookie parameter object
 *
 * @example
 * ```typescript
 * const sessionCookie = createCookieParameter('sessionId', { type: 'string' }, true);
 * ```
 */
export const createCookieParameter = (
  name: string,
  schema: Record<string, any>,
  required?: boolean,
  description?: string,
) => {
  const param: Record<string, any> = {
    name,
    in: 'cookie',
    required: required || false,
    schema,
  };
  if (description) param.description = description;
  return param;
};

/**
 * Creates a parameter reference to a component parameter.
 *
 * @param {string} parameterName - Name of the parameter in components
 * @returns {object} OpenAPI parameter $ref object
 *
 * @example
 * ```typescript
 * const idRef = createParameterRef('StudentId');
 * // Result: { $ref: '#/components/parameters/StudentId' }
 * ```
 */
export const createParameterRef = (parameterName: string) => {
  return { $ref: `#/components/parameters/${parameterName}` };
};

// ============================================================================
// EXAMPLE GENERATION FUNCTIONS
// ============================================================================

/**
 * Creates an example object for request/response documentation.
 *
 * @param {string} summary - Example summary
 * @param {any} value - Example value
 * @param {string} [description] - Example description
 * @returns {object} OpenAPI example object
 *
 * @example
 * ```typescript
 * const example = createExample(
 *   'Active student',
 *   { id: '123', name: 'John Doe', status: 'active' },
 *   'Example of an active student record'
 * );
 * ```
 */
export const createExample = (
  summary: string,
  value: any,
  description?: string,
) => {
  const example: Record<string, any> = { summary, value };
  if (description) example.description = description;
  return example;
};

/**
 * Creates multiple examples for a schema or media type.
 *
 * @param {Record<string, any>} examples - Object mapping example names to example objects
 * @returns {object} OpenAPI examples object
 *
 * @example
 * ```typescript
 * const examples = createExamples({
 *   activeStudent: { summary: 'Active', value: { status: 'active' } },
 *   inactiveStudent: { summary: 'Inactive', value: { status: 'inactive' } }
 * });
 * ```
 */
export const createExamples = (examples: Record<string, any>) => {
  return examples;
};

/**
 * Creates an example reference to a component example.
 *
 * @param {string} exampleName - Name of the example in components
 * @returns {object} OpenAPI example $ref object
 *
 * @example
 * ```typescript
 * const exampleRef = createExampleRef('StudentExample');
 * // Result: { $ref: '#/components/examples/StudentExample' }
 * ```
 */
export const createExampleRef = (exampleName: string) => {
  return { $ref: `#/components/examples/${exampleName}` };
};

/**
 * Generates a realistic example value based on schema type and format.
 *
 * @param {string} type - Schema type
 * @param {string} [format] - Schema format
 * @param {any} [enumValues] - Enum values if applicable
 * @returns {any} Generated example value
 *
 * @example
 * ```typescript
 * generateExampleValue('string', 'email'); // 'user@example.com'
 * generateExampleValue('string', 'uuid'); // '123e4567-e89b-12d3-a456-426614174000'
 * generateExampleValue('integer'); // 42
 * generateExampleValue('boolean'); // true
 * ```
 */
export const generateExampleValue = (
  type: string,
  format?: string,
  enumValues?: any[],
) => {
  if (enumValues && enumValues.length > 0) return enumValues[0];

  switch (type) {
    case 'string':
      switch (format) {
        case 'email':
          return 'user@example.com';
        case 'uuid':
          return '123e4567-e89b-12d3-a456-426614174000';
        case 'date':
          return '2024-01-01';
        case 'date-time':
          return '2024-01-01T12:00:00Z';
        case 'uri':
          return 'https://example.com';
        default:
          return 'example string';
      }
    case 'integer':
      return 42;
    case 'number':
      return 3.14;
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

// ============================================================================
// SCHEMA VALIDATION HELPERS
// ============================================================================

/**
 * Validates if a schema object has required OpenAPI properties.
 *
 * @param {object} schema - Schema to validate
 * @returns {boolean} True if schema is valid
 *
 * @example
 * ```typescript
 * const isValid = validateSchema({ type: 'string' }); // true
 * const isInvalid = validateSchema({ foo: 'bar' }); // false
 * ```
 */
export const validateSchema = (schema: Record<string, any>): boolean => {
  if (!schema || typeof schema !== 'object') return false;
  // Must have either type, $ref, oneOf, anyOf, or allOf
  return !!(
    schema.type ||
    schema.$ref ||
    schema.oneOf ||
    schema.anyOf ||
    schema.allOf
  );
};

/**
 * Validates if a parameter object has required OpenAPI properties.
 *
 * @param {object} parameter - Parameter to validate
 * @returns {boolean} True if parameter is valid
 *
 * @example
 * ```typescript
 * const isValid = validateParameter({ name: 'id', in: 'path', schema: { type: 'string' } }); // true
 * ```
 */
export const validateParameter = (parameter: Record<string, any>): boolean => {
  if (!parameter || typeof parameter !== 'object') return false;
  const validLocations = ['path', 'query', 'header', 'cookie'];
  return !!(
    parameter.name &&
    parameter.in &&
    validLocations.includes(parameter.in) &&
    (parameter.schema || parameter.content)
  );
};

/**
 * Validates if a response object has required OpenAPI properties.
 *
 * @param {object} response - Response to validate
 * @returns {boolean} True if response is valid
 *
 * @example
 * ```typescript
 * const isValid = validateResponse({ description: 'Success', content: {...} }); // true
 * ```
 */
export const validateResponse = (response: Record<string, any>): boolean => {
  if (!response || typeof response !== 'object') return false;
  return !!response.description;
};

/**
 * Extracts all schema references ($ref) from an object recursively.
 *
 * @param {any} obj - Object to search for references
 * @returns {string[]} Array of found $ref values
 *
 * @example
 * ```typescript
 * const refs = extractSchemaRefs({
 *   properties: {
 *     student: { $ref: '#/components/schemas/Student' },
 *     nurse: { $ref: '#/components/schemas/Nurse' }
 *   }
 * });
 * // Result: ['#/components/schemas/Student', '#/components/schemas/Nurse']
 * ```
 */
export const extractSchemaRefs = (obj: any): string[] => {
  const refs: string[] = [];

  const traverse = (current: any) => {
    if (!current || typeof current !== 'object') return;

    if (current.$ref && typeof current.$ref === 'string') {
      refs.push(current.$ref);
    }

    Object.values(current).forEach(traverse);
  };

  traverse(obj);
  return refs;
};

// ============================================================================
// COMPONENT UTILITIES
// ============================================================================

/**
 * Creates a components object structure for OpenAPI spec.
 *
 * @param {Record<string, any>} schemas - Schema definitions
 * @param {Record<string, any>} [responses] - Response definitions
 * @param {Record<string, any>} [parameters] - Parameter definitions
 * @param {Record<string, any>} [securitySchemes] - Security scheme definitions
 * @returns {object} OpenAPI components object
 *
 * @example
 * ```typescript
 * const components = createComponents(
 *   { Student: {...}, Nurse: {...} },
 *   { NotFound: {...}, Unauthorized: {...} },
 *   { StudentId: {...} },
 *   { bearerAuth: {...} }
 * );
 * ```
 */
export const createComponents = (
  schemas: Record<string, any>,
  responses?: Record<string, any>,
  parameters?: Record<string, any>,
  securitySchemes?: Record<string, any>,
) => {
  const components: Record<string, any> = { schemas };
  if (responses) components.responses = responses;
  if (parameters) components.parameters = parameters;
  if (securitySchemes) components.securitySchemes = securitySchemes;
  return components;
};

/**
 * Merges multiple OpenAPI components objects.
 *
 * @param {Record<string, any>[]} componentObjects - Array of components to merge
 * @returns {object} Merged components object
 *
 * @example
 * ```typescript
 * const merged = mergeComponents([
 *   { schemas: { Student: {...} } },
 *   { schemas: { Nurse: {...} }, responses: { NotFound: {...} } }
 * ]);
 * // Result: { schemas: { Student: {...}, Nurse: {...} }, responses: { NotFound: {...} } }
 * ```
 */
export const mergeComponents = (
  componentObjects: Record<string, any>[],
): Record<string, any> => {
  const merged: Record<string, any> = {
    schemas: {},
    responses: {},
    parameters: {},
    examples: {},
    requestBodies: {},
    headers: {},
    securitySchemes: {},
  };

  componentObjects.forEach((components) => {
    if (!components) return;

    Object.keys(merged).forEach((key) => {
      if (components[key]) {
        merged[key] = { ...merged[key], ...components[key] };
      }
    });
  });

  // Remove empty sections
  Object.keys(merged).forEach((key) => {
    if (Object.keys(merged[key]).length === 0) {
      delete merged[key];
    }
  });

  return merged;
};

/**
 * Creates a response reference to a component response.
 *
 * @param {string} responseName - Name of the response in components
 * @returns {object} OpenAPI response $ref object
 *
 * @example
 * ```typescript
 * const notFoundRef = createResponseRef('NotFound');
 * // Result: { $ref: '#/components/responses/NotFound' }
 * ```
 */
export const createResponseRef = (responseName: string) => {
  return { $ref: `#/components/responses/${responseName}` };
};

/**
 * Converts a TypeScript interface or type to OpenAPI schema.
 * Note: This is a simplified converter for basic types.
 *
 * @param {string} typeName - Name of the type
 * @param {Record<string, string>} properties - Property name to type mapping
 * @param {string[]} required - Required property names
 * @returns {object} OpenAPI schema object
 *
 * @example
 * ```typescript
 * const schema = convertTypeToSchema(
 *   'Student',
 *   { id: 'string', name: 'string', age: 'number', isActive: 'boolean' },
 *   ['id', 'name']
 * );
 * ```
 */
export const convertTypeToSchema = (
  typeName: string,
  properties: Record<string, string>,
  required: string[],
) => {
  const schemaProperties: Record<string, any> = {};

  Object.entries(properties).forEach(([key, type]) => {
    const tsType = type.toLowerCase();
    if (tsType === 'string') {
      schemaProperties[key] = { type: 'string' };
    } else if (tsType === 'number') {
      schemaProperties[key] = { type: 'number' };
    } else if (tsType === 'boolean') {
      schemaProperties[key] = { type: 'boolean' };
    } else if (tsType.endsWith('[]')) {
      const itemType = tsType.slice(0, -2);
      schemaProperties[key] = {
        type: 'array',
        items: { type: itemType },
      };
    } else {
      schemaProperties[key] = { $ref: `#/components/schemas/${type}` };
    }
  });

  return createObjectSchema(schemaProperties, required, `${typeName} schema`);
};

/**
 * Generates OpenAPI specification metadata for API versioning.
 *
 * @param {string} version - API version (e.g., '1.0.0', '2.1.0')
 * @param {string} [changelog] - Version changelog or release notes
 * @returns {object} Versioning metadata object
 *
 * @example
 * ```typescript
 * const versionInfo = createVersionInfo('2.0.0', 'Added student health records API');
 * ```
 */
export const createVersionInfo = (version: string, changelog?: string) => {
  const info: Record<string, any> = { version };
  if (changelog) info.changelog = changelog;
  return info;
};

export default {
  // Schema generation
  createBasicSchema,
  createArraySchema,
  createObjectSchema,
  createEnumSchema,
  createRefSchema,
  createValidatedSchema,
  createNullableSchema,
  createOneOfSchema,

  // API documentation builders
  createOperation,
  createTag,
  createApiInfo,
  createServer,
  createExternalDocs,
  createPathItem,
  createRequestBody,
  createCallback,

  // Response builders
  createResponse,
  createSuccessResponse,
  createCreatedResponse,
  createErrorResponse,
  createPaginatedResponse,
  createNoContentResponse,

  // Security definitions
  createBearerAuth,
  createApiKeyAuth,
  createOAuth2Auth,
  createBasicAuth,

  // Parameter utilities
  createPathParameter,
  createQueryParameter,
  createHeaderParameter,
  createPaginationParameters,
  createCookieParameter,
  createParameterRef,

  // Example generation
  createExample,
  createExamples,
  createExampleRef,
  generateExampleValue,

  // Schema validation
  validateSchema,
  validateParameter,
  validateResponse,
  extractSchemaRefs,

  // Component utilities
  createComponents,
  mergeComponents,
  createResponseRef,
  convertTypeToSchema,
  createVersionInfo,
};
