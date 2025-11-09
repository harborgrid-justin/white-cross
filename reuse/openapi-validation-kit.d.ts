/**
 * LOC: OPV1234567
 * File: /reuse/openapi-validation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - API validation middleware
 *   - OpenAPI spec validators
 *   - Request/response validators
 *   - Schema validation services
 */
/**
 * File: /reuse/openapi-validation-kit.ts
 * Locator: WC-UTL-OPV-001
 * Purpose: OpenAPI Validation Kit - OpenAPI spec validation, request/response validation, and schema validators
 *
 * Upstream: Independent utility module for OpenAPI validation
 * Downstream: ../backend/*, Validation middleware, API testing, Schema validation
 * Dependencies: TypeScript 5.x, Node 18+, OpenAPI 3.0+
 * Exports: 45 utility functions for comprehensive OpenAPI validation and testing
 *
 * LLM Context: Comprehensive OpenAPI validation toolkit for White Cross healthcare system.
 * Provides OpenAPI spec validators, request/response validation, format validators,
 * custom validation decorators, schema validators, error formatters, and contract testing utilities.
 * Essential for maintaining API contract compliance and data integrity.
 */
interface ValidationError {
    field: string;
    message: string;
    value?: any;
    code: string;
    path?: string;
}
interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings?: string[];
}
interface OpenAPISpec {
    openapi: string;
    info: any;
    paths: Record<string, any>;
    components?: any;
    servers?: any[];
    tags?: any[];
    security?: any[];
}
interface SchemaValidationOptions {
    strict?: boolean;
    coerceTypes?: boolean;
    removeAdditional?: boolean;
    allowUnknownFormats?: boolean;
}
interface RequestValidationContext {
    method: string;
    path: string;
    body?: any;
    query?: Record<string, any>;
    params?: Record<string, any>;
    headers?: Record<string, string>;
}
interface ResponseValidationContext {
    statusCode: number;
    body?: any;
    headers?: Record<string, string>;
}
/**
 * Validates OpenAPI specification structure and required fields.
 *
 * @param {OpenAPISpec} spec - OpenAPI specification object
 * @returns {ValidationResult} Validation result with errors
 *
 * @example
 * ```typescript
 * const spec = loadOpenAPISpec();
 * const result = validateOpenAPISpec(spec);
 * if (!result.isValid) {
 *   console.error('Invalid spec:', result.errors);
 * }
 * ```
 */
export declare const validateOpenAPISpec: (spec: OpenAPISpec) => ValidationResult;
/**
 * Validates all paths in OpenAPI spec for completeness.
 *
 * @param {OpenAPISpec} spec - OpenAPI specification object
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validatePaths(spec);
 * result.errors.forEach(err => console.log(`Path error: ${err.path} - ${err.message}`));
 * ```
 */
export declare const validatePaths: (spec: OpenAPISpec) => ValidationResult;
/**
 * Validates schema definitions in components section.
 *
 * @param {OpenAPISpec} spec - OpenAPI specification object
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateSchemas(spec);
 * if (!result.isValid) {
 *   console.error('Schema validation errors:', result.errors);
 * }
 * ```
 */
export declare const validateSchemas: (spec: OpenAPISpec) => ValidationResult;
/**
 * Validates security schemes in OpenAPI spec.
 *
 * @param {OpenAPISpec} spec - OpenAPI specification object
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateSecuritySchemes(spec);
 * ```
 */
export declare const validateSecuritySchemes: (spec: OpenAPISpec) => ValidationResult;
/**
 * Validates all $ref references in the spec are resolvable.
 *
 * @param {OpenAPISpec} spec - OpenAPI specification object
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateReferences(spec);
 * if (!result.isValid) {
 *   result.errors.forEach(err => console.log(`Broken reference: ${err.value}`));
 * }
 * ```
 */
export declare const validateReferences: (spec: OpenAPISpec) => ValidationResult;
/**
 * Validates request body against OpenAPI schema.
 *
 * @param {any} body - Request body to validate
 * @param {any} schema - OpenAPI schema definition
 * @param {SchemaValidationOptions} [options] - Validation options
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateRequestBody(req.body, patientSchema, { strict: true });
 * if (!result.isValid) {
 *   return res.status(400).json({ errors: result.errors });
 * }
 * ```
 */
export declare const validateRequestBody: (body: any, schema: any, options?: SchemaValidationOptions) => ValidationResult;
/**
 * Validates query parameters against OpenAPI parameter definitions.
 *
 * @param {Record<string, any>} query - Query parameters object
 * @param {any[]} parameterSchemas - Array of parameter schemas
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateQueryParameters(req.query, operationParameters);
 * if (!result.isValid) {
 *   return res.status(400).json({ errors: result.errors });
 * }
 * ```
 */
export declare const validateQueryParameters: (query: Record<string, any>, parameterSchemas: any[]) => ValidationResult;
/**
 * Validates path parameters against OpenAPI parameter definitions.
 *
 * @param {Record<string, any>} params - Path parameters object
 * @param {any[]} parameterSchemas - Array of parameter schemas
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validatePathParameters(req.params, operationParameters);
 * if (!result.isValid) {
 *   return res.status(404).json({ errors: result.errors });
 * }
 * ```
 */
export declare const validatePathParameters: (params: Record<string, any>, parameterSchemas: any[]) => ValidationResult;
/**
 * Validates request headers against OpenAPI parameter definitions.
 *
 * @param {Record<string, string>} headers - Request headers object
 * @param {any[]} parameterSchemas - Array of parameter schemas
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateHeaders(req.headers, operationParameters);
 * if (!result.isValid) {
 *   return res.status(400).json({ errors: result.errors });
 * }
 * ```
 */
export declare const validateHeaders: (headers: Record<string, string>, parameterSchemas: any[]) => ValidationResult;
/**
 * Validates complete request against OpenAPI operation definition.
 *
 * @param {RequestValidationContext} context - Request context
 * @param {any} operation - OpenAPI operation object
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateRequest({
 *   method: 'POST',
 *   path: '/patients',
 *   body: req.body,
 *   query: req.query,
 *   params: req.params,
 *   headers: req.headers
 * }, operation);
 * ```
 */
export declare const validateRequest: (context: RequestValidationContext, operation: any) => ValidationResult;
/**
 * Validates response body against OpenAPI response schema.
 *
 * @param {any} body - Response body to validate
 * @param {any} schema - OpenAPI schema definition
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateResponseBody(response.data, responseSchema);
 * if (!result.isValid) {
 *   console.error('Response validation failed:', result.errors);
 * }
 * ```
 */
export declare const validateResponseBody: (body: any, schema: any) => ValidationResult;
/**
 * Validates response status code is documented in OpenAPI spec.
 *
 * @param {number} statusCode - HTTP status code
 * @param {any} responses - OpenAPI responses object
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateResponseStatus(res.statusCode, operation.responses);
 * if (!result.isValid) {
 *   console.warn('Undocumented status code:', statusCode);
 * }
 * ```
 */
export declare const validateResponseStatus: (statusCode: number, responses: any) => ValidationResult;
/**
 * Validates response headers against OpenAPI response definition.
 *
 * @param {Record<string, string>} headers - Response headers
 * @param {any} responseSchema - OpenAPI response schema
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateResponseHeaders(res.headers, responseDefinition);
 * ```
 */
export declare const validateResponseHeaders: (headers: Record<string, string>, responseSchema: any) => ValidationResult;
/**
 * Validates complete response against OpenAPI operation definition.
 *
 * @param {ResponseValidationContext} context - Response context
 * @param {any} operation - OpenAPI operation object
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateResponse({
 *   statusCode: res.statusCode,
 *   body: res.data,
 *   headers: res.headers
 * }, operation);
 * ```
 */
export declare const validateResponse: (context: ResponseValidationContext, operation: any) => ValidationResult;
/**
 * Validates object against OpenAPI object schema.
 *
 * @param {any} obj - Object to validate
 * @param {any} schema - OpenAPI object schema
 * @param {string} [path] - Current validation path
 * @param {SchemaValidationOptions} [options] - Validation options
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateObjectSchema(data, patientSchema, 'patient', { strict: true });
 * ```
 */
export declare const validateObjectSchema: (obj: any, schema: any, path?: string, options?: SchemaValidationOptions) => ValidationResult;
/**
 * Validates array against OpenAPI array schema.
 *
 * @param {any} arr - Array to validate
 * @param {any} schema - OpenAPI array schema
 * @param {string} [path] - Current validation path
 * @param {SchemaValidationOptions} [options] - Validation options
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateArraySchema(data, arraySchema, 'items');
 * ```
 */
export declare const validateArraySchema: (arr: any, schema: any, path?: string, options?: SchemaValidationOptions) => ValidationResult;
/**
 * Validates value against OpenAPI schema (generic).
 *
 * @param {any} value - Value to validate
 * @param {any} schema - OpenAPI schema
 * @param {string} [path] - Current validation path
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateValueAgainstSchema(42, { type: 'number', minimum: 0, maximum: 100 }, 'age');
 * ```
 */
export declare const validateValueAgainstSchema: (value: any, schema: any, path?: string) => ValidationResult;
/**
 * Validates string format according to OpenAPI format specifications.
 *
 * @param {string} value - Value to validate
 * @param {string} format - OpenAPI format (email, uuid, date, date-time, etc.)
 * @param {string} [path] - Validation path
 * @returns {ValidationResult} Validation result
 *
 * @example
 * ```typescript
 * const result = validateFormat('user@example.com', 'email', 'user.email');
 * ```
 */
export declare const validateFormat: (value: string, format: string, path?: string) => ValidationResult;
/**
 * Validates email format.
 *
 * @param {string} value - Email to validate
 * @returns {boolean} True if valid email format
 *
 * @example
 * ```typescript
 * validateEmailFormat('user@example.com'); // true
 * ```
 */
export declare const validateEmailFormat: (value: string) => boolean;
/**
 * Validates UUID format (v4).
 *
 * @param {string} value - UUID to validate
 * @returns {boolean} True if valid UUID format
 *
 * @example
 * ```typescript
 * validateUuidFormat('123e4567-e89b-12d3-a456-426614174000'); // true
 * ```
 */
export declare const validateUuidFormat: (value: string) => boolean;
/**
 * Validates ISO date format (YYYY-MM-DD).
 *
 * @param {string} value - Date string to validate
 * @returns {boolean} True if valid date format
 *
 * @example
 * ```typescript
 * validateDateFormat('2024-03-15'); // true
 * ```
 */
export declare const validateDateFormat: (value: string) => boolean;
/**
 * Validates ISO 8601 date-time format.
 *
 * @param {string} value - Date-time string to validate
 * @returns {boolean} True if valid date-time format
 *
 * @example
 * ```typescript
 * validateDateTimeFormat('2024-03-15T10:30:00Z'); // true
 * ```
 */
export declare const validateDateTimeFormat: (value: string) => boolean;
/**
 * Validates URL format.
 *
 * @param {string} value - URL to validate
 * @returns {boolean} True if valid URL format
 *
 * @example
 * ```typescript
 * validateUrlFormat('https://example.com'); // true
 * ```
 */
export declare const validateUrlFormat: (value: string) => boolean;
/**
 * Validates IPv4 address format.
 *
 * @param {string} value - IP address to validate
 * @returns {boolean} True if valid IPv4 format
 *
 * @example
 * ```typescript
 * validateIPv4Format('192.168.1.1'); // true
 * ```
 */
export declare const validateIPv4Format: (value: string) => boolean;
/**
 * Validates IPv6 address format.
 *
 * @param {string} value - IP address to validate
 * @returns {boolean} True if valid IPv6 format
 *
 * @example
 * ```typescript
 * validateIPv6Format('2001:0db8:85a3:0000:0000:8a2e:0370:7334'); // true
 * ```
 */
export declare const validateIPv6Format: (value: string) => boolean;
/**
 * Formats validation errors for API response.
 *
 * @param {ValidationError[]} errors - Array of validation errors
 * @returns {object} Formatted error response
 *
 * @example
 * ```typescript
 * const formatted = formatValidationErrors(result.errors);
 * return res.status(400).json(formatted);
 * ```
 */
export declare const formatValidationErrors: (errors: ValidationError[]) => {
    statusCode: number;
    error: string;
    message: string;
    details: {
        rejectedValue?: any;
        path?: string | undefined;
        field: string;
        message: string;
        code: string;
    }[];
};
/**
 * Formats validation errors in JSON Schema format.
 *
 * @param {ValidationError[]} errors - Array of validation errors
 * @returns {object} JSON Schema formatted errors
 *
 * @example
 * ```typescript
 * const formatted = formatJsonSchemaErrors(result.errors);
 * ```
 */
export declare const formatJsonSchemaErrors: (errors: ValidationError[]) => {
    instancePath: string;
    schemaPath: string;
    keyword: string;
    message: string;
    params: {
        value: any;
    } | {
        value?: undefined;
    };
}[];
/**
 * Creates human-readable error message from validation errors.
 *
 * @param {ValidationError[]} errors - Array of validation errors
 * @returns {string} Human-readable error message
 *
 * @example
 * ```typescript
 * const message = createErrorMessage(result.errors);
 * // "Validation failed: email is invalid, age must be at least 18"
 * ```
 */
export declare const createErrorMessage: (errors: ValidationError[]) => string;
/**
 * Groups validation errors by field path.
 *
 * @param {ValidationError[]} errors - Array of validation errors
 * @returns {Record<string, ValidationError[]>} Errors grouped by field
 *
 * @example
 * ```typescript
 * const grouped = groupErrorsByField(result.errors);
 * // { 'user.email': [error1, error2], 'user.age': [error3] }
 * ```
 */
export declare const groupErrorsByField: (errors: ValidationError[]) => Record<string, ValidationError[]>;
/**
 * Creates a validation middleware function for Express/NestJS.
 *
 * @param {any} schema - OpenAPI schema to validate against
 * @param {SchemaValidationOptions} [options] - Validation options
 * @returns {Function} Middleware function
 *
 * @example
 * ```typescript
 * const validatePatient = createValidationMiddleware(patientSchema, { strict: true });
 * app.post('/patients', validatePatient, createPatientHandler);
 * ```
 */
export declare const createValidationMiddleware: (schema: any, options?: SchemaValidationOptions) => (req: any, res: any, next: any) => any;
/**
 * Checks if validation result has errors.
 *
 * @param {ValidationResult} result - Validation result
 * @returns {boolean} True if has errors
 *
 * @example
 * ```typescript
 * if (hasValidationErrors(result)) {
 *   throw new ValidationException(result.errors);
 * }
 * ```
 */
export declare const hasValidationErrors: (result: ValidationResult) => boolean;
/**
 * Extracts first validation error.
 *
 * @param {ValidationResult} result - Validation result
 * @returns {ValidationError | null} First error or null
 *
 * @example
 * ```typescript
 * const firstError = getFirstError(result);
 * if (firstError) {
 *   console.log(`First error: ${firstError.message}`);
 * }
 * ```
 */
export declare const getFirstError: (result: ValidationResult) => ValidationError | null;
/**
 * Filters errors by error code.
 *
 * @param {ValidationError[]} errors - Array of validation errors
 * @param {string} code - Error code to filter by
 * @returns {ValidationError[]} Filtered errors
 *
 * @example
 * ```typescript
 * const requiredErrors = filterErrorsByCode(result.errors, 'MISSING_REQUIRED_PROPERTY');
 * ```
 */
export declare const filterErrorsByCode: (errors: ValidationError[], code: string) => ValidationError[];
/**
 * Checks if errors contain specific error code.
 *
 * @param {ValidationError[]} errors - Array of validation errors
 * @param {string} code - Error code to check
 * @returns {boolean} True if code exists in errors
 *
 * @example
 * ```typescript
 * if (hasErrorCode(result.errors, 'TYPE_MISMATCH')) {
 *   console.log('Type validation failed');
 * }
 * ```
 */
export declare const hasErrorCode: (errors: ValidationError[], code: string) => boolean;
declare const _default: {
    validateOpenAPISpec: (spec: OpenAPISpec) => ValidationResult;
    validatePaths: (spec: OpenAPISpec) => ValidationResult;
    validateSchemas: (spec: OpenAPISpec) => ValidationResult;
    validateSecuritySchemes: (spec: OpenAPISpec) => ValidationResult;
    validateReferences: (spec: OpenAPISpec) => ValidationResult;
    validateRequestBody: (body: any, schema: any, options?: SchemaValidationOptions) => ValidationResult;
    validateQueryParameters: (query: Record<string, any>, parameterSchemas: any[]) => ValidationResult;
    validatePathParameters: (params: Record<string, any>, parameterSchemas: any[]) => ValidationResult;
    validateHeaders: (headers: Record<string, string>, parameterSchemas: any[]) => ValidationResult;
    validateRequest: (context: RequestValidationContext, operation: any) => ValidationResult;
    validateResponseBody: (body: any, schema: any) => ValidationResult;
    validateResponseStatus: (statusCode: number, responses: any) => ValidationResult;
    validateResponseHeaders: (headers: Record<string, string>, responseSchema: any) => ValidationResult;
    validateResponse: (context: ResponseValidationContext, operation: any) => ValidationResult;
    validateObjectSchema: (obj: any, schema: any, path?: string, options?: SchemaValidationOptions) => ValidationResult;
    validateArraySchema: (arr: any, schema: any, path?: string, options?: SchemaValidationOptions) => ValidationResult;
    validateValueAgainstSchema: (value: any, schema: any, path?: string) => ValidationResult;
    validateFormat: (value: string, format: string, path?: string) => ValidationResult;
    validateEmailFormat: (value: string) => boolean;
    validateUuidFormat: (value: string) => boolean;
    validateDateFormat: (value: string) => boolean;
    validateDateTimeFormat: (value: string) => boolean;
    validateUrlFormat: (value: string) => boolean;
    validateIPv4Format: (value: string) => boolean;
    validateIPv6Format: (value: string) => boolean;
    formatValidationErrors: (errors: ValidationError[]) => {
        statusCode: number;
        error: string;
        message: string;
        details: {
            rejectedValue?: any;
            path?: string | undefined;
            field: string;
            message: string;
            code: string;
        }[];
    };
    formatJsonSchemaErrors: (errors: ValidationError[]) => {
        instancePath: string;
        schemaPath: string;
        keyword: string;
        message: string;
        params: {
            value: any;
        } | {
            value?: undefined;
        };
    }[];
    createErrorMessage: (errors: ValidationError[]) => string;
    groupErrorsByField: (errors: ValidationError[]) => Record<string, ValidationError[]>;
    createValidationMiddleware: (schema: any, options?: SchemaValidationOptions) => (req: any, res: any, next: any) => any;
    hasValidationErrors: (result: ValidationResult) => boolean;
    getFirstError: (result: ValidationResult) => ValidationError | null;
    filterErrorsByCode: (errors: ValidationError[], code: string) => ValidationError[];
    hasErrorCode: (errors: ValidationError[], code: string) => boolean;
};
export default _default;
//# sourceMappingURL=openapi-validation-kit.d.ts.map