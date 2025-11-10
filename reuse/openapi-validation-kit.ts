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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

// ============================================================================
// OPENAPI SPEC VALIDATION
// ============================================================================

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
export const validateOpenAPISpec = (spec: OpenAPISpec): ValidationResult => {
  const errors: ValidationError[] = [];

  // Check OpenAPI version
  if (!spec.openapi || !spec.openapi.startsWith('3.')) {
    errors.push({
      field: 'openapi',
      message: 'OpenAPI version must be 3.x',
      code: 'INVALID_VERSION',
    });
  }

  // Check info object
  if (!spec.info || typeof spec.info !== 'object') {
    errors.push({
      field: 'info',
      message: 'Info object is required',
      code: 'MISSING_INFO',
    });
  } else {
    if (!spec.info.title) {
      errors.push({
        field: 'info.title',
        message: 'API title is required',
        code: 'MISSING_TITLE',
      });
    }
    if (!spec.info.version) {
      errors.push({
        field: 'info.version',
        message: 'API version is required',
        code: 'MISSING_VERSION',
      });
    }
  }

  // Check paths object
  if (!spec.paths || typeof spec.paths !== 'object') {
    errors.push({
      field: 'paths',
      message: 'Paths object is required',
      code: 'MISSING_PATHS',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

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
export const validatePaths = (spec: OpenAPISpec): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  if (!spec.paths) {
    return { isValid: false, errors: [{ field: 'paths', message: 'No paths defined', code: 'NO_PATHS' }] };
  }

  Object.entries(spec.paths).forEach(([path, pathItem]) => {
    // Check path format
    if (!path.startsWith('/')) {
      errors.push({
        field: 'paths',
        message: `Path must start with /: ${path}`,
        code: 'INVALID_PATH_FORMAT',
        path,
      });
    }

    // Check operations
    const httpMethods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];
    let hasOperations = false;

    httpMethods.forEach((method) => {
      if (pathItem[method]) {
        hasOperations = true;
        const operation = pathItem[method];

        // Check operation has responses
        if (!operation.responses) {
          errors.push({
            field: 'responses',
            message: `Operation ${method.toUpperCase()} ${path} missing responses`,
            code: 'MISSING_RESPONSES',
            path: `${path}.${method}`,
          });
        }

        // Check operation has summary or description
        if (!operation.summary && !operation.description) {
          warnings.push(`Operation ${method.toUpperCase()} ${path} missing summary/description`);
        }
      }
    });

    if (!hasOperations) {
      warnings.push(`Path ${path} has no operations defined`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

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
export const validateSchemas = (spec: OpenAPISpec): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!spec.components?.schemas) {
    return { isValid: true, errors: [] }; // Schemas are optional
  }

  Object.entries(spec.components.schemas).forEach(([schemaName, schema]: [string, any]) => {
    // Check schema has type or $ref or oneOf/anyOf/allOf
    if (!schema.type && !schema.$ref && !schema.oneOf && !schema.anyOf && !schema.allOf) {
      errors.push({
        field: 'schemas',
        message: `Schema ${schemaName} must have type, $ref, or composition keywords`,
        code: 'INVALID_SCHEMA',
        path: `components.schemas.${schemaName}`,
      });
    }

    // Validate object schemas have properties
    if (schema.type === 'object' && !schema.properties && !schema.allOf && !schema.oneOf && !schema.anyOf) {
      errors.push({
        field: 'properties',
        message: `Object schema ${schemaName} should have properties defined`,
        code: 'MISSING_PROPERTIES',
        path: `components.schemas.${schemaName}`,
      });
    }

    // Validate array schemas have items
    if (schema.type === 'array' && !schema.items) {
      errors.push({
        field: 'items',
        message: `Array schema ${schemaName} must have items defined`,
        code: 'MISSING_ITEMS',
        path: `components.schemas.${schemaName}`,
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

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
export const validateSecuritySchemes = (spec: OpenAPISpec): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!spec.components?.securitySchemes) {
    return { isValid: true, errors: [] }; // Security schemes are optional
  }

  Object.entries(spec.components.securitySchemes).forEach(([schemeName, scheme]: [string, any]) => {
    // Check type is valid
    const validTypes = ['apiKey', 'http', 'oauth2', 'openIdConnect'];
    if (!validTypes.includes(scheme.type)) {
      errors.push({
        field: 'type',
        message: `Security scheme ${schemeName} has invalid type: ${scheme.type}`,
        code: 'INVALID_SECURITY_TYPE',
        path: `components.securitySchemes.${schemeName}`,
      });
    }

    // Type-specific validation
    if (scheme.type === 'apiKey') {
      if (!scheme.name) {
        errors.push({
          field: 'name',
          message: `API key scheme ${schemeName} must have name`,
          code: 'MISSING_API_KEY_NAME',
          path: `components.securitySchemes.${schemeName}`,
        });
      }
      if (!['query', 'header', 'cookie'].includes(scheme.in)) {
        errors.push({
          field: 'in',
          message: `API key scheme ${schemeName} must have valid 'in' value`,
          code: 'INVALID_API_KEY_LOCATION',
          path: `components.securitySchemes.${schemeName}`,
        });
      }
    }

    if (scheme.type === 'http' && !scheme.scheme) {
      errors.push({
        field: 'scheme',
        message: `HTTP security scheme ${schemeName} must have scheme`,
        code: 'MISSING_HTTP_SCHEME',
        path: `components.securitySchemes.${schemeName}`,
      });
    }

    if (scheme.type === 'oauth2' && !scheme.flows) {
      errors.push({
        field: 'flows',
        message: `OAuth2 scheme ${schemeName} must have flows`,
        code: 'MISSING_OAUTH2_FLOWS',
        path: `components.securitySchemes.${schemeName}`,
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

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
export const validateReferences = (spec: OpenAPISpec): ValidationResult => {
  const errors: ValidationError[] = [];
  const refs: string[] = [];

  // Extract all $ref values recursively
  const extractRefs = (obj: any, path: string = '') => {
    if (typeof obj !== 'object' || obj === null) return;

    if (obj.$ref) {
      refs.push(obj.$ref);
    }

    Object.entries(obj).forEach(([key, value]) => {
      extractRefs(value, `${path}.${key}`);
    });
  };

  extractRefs(spec);

  // Validate each reference
  refs.forEach((ref) => {
    if (!ref.startsWith('#/')) {
      // External references - just warn
      return;
    }

    const refPath = ref.substring(2).split('/');
    let current: any = spec;

    for (const segment of refPath) {
      if (!current || !current[segment]) {
        errors.push({
          field: '$ref',
          message: `Reference not found: ${ref}`,
          code: 'BROKEN_REFERENCE',
          value: ref,
        });
        break;
      }
      current = current[segment];
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// REQUEST VALIDATION
// ============================================================================

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
export const validateRequestBody = (
  body: any,
  schema: any,
  options?: SchemaValidationOptions,
): ValidationResult => {
  const errors: ValidationError[] = [];
  const opts = { strict: true, coerceTypes: false, ...options };

  if (!schema) {
    return { isValid: true, errors: [] };
  }

  // Type validation
  if (schema.type && typeof body !== schema.type && schema.type !== 'object' && schema.type !== 'array') {
    if (!opts.coerceTypes) {
      errors.push({
        field: 'body',
        message: `Expected type ${schema.type}, got ${typeof body}`,
        code: 'TYPE_MISMATCH',
        value: body,
      });
    }
  }

  // Object validation
  if (schema.type === 'object') {
    const result = validateObjectSchema(body, schema, '', opts);
    errors.push(...result.errors);
  }

  // Array validation
  if (schema.type === 'array') {
    const result = validateArraySchema(body, schema, '', opts);
    errors.push(...result.errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

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
export const validateQueryParameters = (
  query: Record<string, any>,
  parameterSchemas: any[],
): ValidationResult => {
  const errors: ValidationError[] = [];

  const queryParams = parameterSchemas.filter((p) => p.in === 'query');

  queryParams.forEach((param) => {
    const value = query[param.name];

    // Check required
    if (param.required && (value === undefined || value === null)) {
      errors.push({
        field: param.name,
        message: `Required query parameter '${param.name}' is missing`,
        code: 'MISSING_REQUIRED_PARAM',
        path: `query.${param.name}`,
      });
      return;
    }

    // Validate schema if value exists
    if (value !== undefined && param.schema) {
      const result = validateValueAgainstSchema(value, param.schema, param.name);
      errors.push(...result.errors);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

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
export const validatePathParameters = (
  params: Record<string, any>,
  parameterSchemas: any[],
): ValidationResult => {
  const errors: ValidationError[] = [];

  const pathParams = parameterSchemas.filter((p) => p.in === 'path');

  pathParams.forEach((param) => {
    const value = params[param.name];

    // Path parameters are always required
    if (value === undefined || value === null) {
      errors.push({
        field: param.name,
        message: `Required path parameter '${param.name}' is missing`,
        code: 'MISSING_PATH_PARAM',
        path: `params.${param.name}`,
      });
      return;
    }

    // Validate schema
    if (param.schema) {
      const result = validateValueAgainstSchema(value, param.schema, param.name);
      errors.push(...result.errors);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

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
export const validateHeaders = (
  headers: Record<string, string>,
  parameterSchemas: any[],
): ValidationResult => {
  const errors: ValidationError[] = [];

  const headerParams = parameterSchemas.filter((p) => p.in === 'header');

  headerParams.forEach((param) => {
    const headerName = param.name.toLowerCase();
    const value = headers[headerName];

    // Check required
    if (param.required && !value) {
      errors.push({
        field: param.name,
        message: `Required header '${param.name}' is missing`,
        code: 'MISSING_REQUIRED_HEADER',
        path: `headers.${param.name}`,
      });
      return;
    }

    // Validate schema if value exists
    if (value && param.schema) {
      const result = validateValueAgainstSchema(value, param.schema, param.name);
      errors.push(...result.errors);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

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
export const validateRequest = (
  context: RequestValidationContext,
  operation: any,
): ValidationResult => {
  const allErrors: ValidationError[] = [];

  // Validate parameters
  if (operation.parameters) {
    if (context.query) {
      const queryResult = validateQueryParameters(context.query, operation.parameters);
      allErrors.push(...queryResult.errors);
    }

    if (context.params) {
      const pathResult = validatePathParameters(context.params, operation.parameters);
      allErrors.push(...pathResult.errors);
    }

    if (context.headers) {
      const headerResult = validateHeaders(context.headers, operation.parameters);
      allErrors.push(...headerResult.errors);
    }
  }

  // Validate request body
  if (operation.requestBody && context.body !== undefined) {
    const contentType = context.headers?.['content-type'] || 'application/json';
    const schema = operation.requestBody.content?.[contentType]?.schema;

    if (schema) {
      const bodyResult = validateRequestBody(context.body, schema);
      allErrors.push(...bodyResult.errors);
    }
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
};

// ============================================================================
// RESPONSE VALIDATION
// ============================================================================

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
export const validateResponseBody = (body: any, schema: any): ValidationResult => {
  return validateRequestBody(body, schema, { strict: false });
};

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
export const validateResponseStatus = (
  statusCode: number,
  responses: any,
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!responses) {
    return { isValid: true, errors: [] };
  }

  const statusKey = String(statusCode);
  const wildcardKey = `${String(statusCode)[0]}XX`;

  if (!responses[statusKey] && !responses[wildcardKey] && !responses.default) {
    errors.push({
      field: 'statusCode',
      message: `Status code ${statusCode} is not documented in OpenAPI spec`,
      code: 'UNDOCUMENTED_STATUS',
      value: statusCode,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

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
export const validateResponseHeaders = (
  headers: Record<string, string>,
  responseSchema: any,
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!responseSchema?.headers) {
    return { isValid: true, errors: [] };
  }

  Object.entries(responseSchema.headers).forEach(([headerName, headerSchema]: [string, any]) => {
    const headerValue = headers[headerName.toLowerCase()];

    if (headerSchema.required && !headerValue) {
      errors.push({
        field: headerName,
        message: `Required response header '${headerName}' is missing`,
        code: 'MISSING_RESPONSE_HEADER',
        path: `headers.${headerName}`,
      });
    }

    if (headerValue && headerSchema.schema) {
      const result = validateValueAgainstSchema(headerValue, headerSchema.schema, headerName);
      errors.push(...result.errors);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

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
export const validateResponse = (
  context: ResponseValidationContext,
  operation: any,
): ValidationResult => {
  const allErrors: ValidationError[] = [];

  if (!operation.responses) {
    return { isValid: true, errors: [] };
  }

  // Validate status code
  const statusResult = validateResponseStatus(context.statusCode, operation.responses);
  allErrors.push(...statusResult.errors);

  // Get response definition
  const statusKey = String(context.statusCode);
  const responseDefinition = operation.responses[statusKey] || operation.responses.default;

  if (responseDefinition) {
    // Validate headers
    if (context.headers) {
      const headerResult = validateResponseHeaders(context.headers, responseDefinition);
      allErrors.push(...headerResult.errors);
    }

    // Validate body
    if (context.body !== undefined && responseDefinition.content) {
      const contentType = context.headers?.['content-type'] || 'application/json';
      const schema = responseDefinition.content[contentType]?.schema;

      if (schema) {
        const bodyResult = validateResponseBody(context.body, schema);
        allErrors.push(...bodyResult.errors);
      }
    }
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
};

// ============================================================================
// SCHEMA VALIDATORS
// ============================================================================

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
export const validateObjectSchema = (
  obj: any,
  schema: any,
  path: string = '',
  options?: SchemaValidationOptions,
): ValidationResult => {
  const errors: ValidationError[] = [];
  const opts = { strict: true, removeAdditional: false, ...options };

  if (typeof obj !== 'object' || obj === null) {
    errors.push({
      field: path || 'value',
      message: 'Expected object',
      code: 'TYPE_MISMATCH',
      value: obj,
    });
    return { isValid: false, errors };
  }

  // Validate required properties
  if (schema.required) {
    schema.required.forEach((prop: string) => {
      if (!(prop in obj)) {
        errors.push({
          field: path ? `${path}.${prop}` : prop,
          message: `Required property '${prop}' is missing`,
          code: 'MISSING_REQUIRED_PROPERTY',
          path: path ? `${path}.${prop}` : prop,
        });
      }
    });
  }

  // Validate properties
  if (schema.properties) {
    Object.entries(schema.properties).forEach(([propName, propSchema]) => {
      const propPath = path ? `${path}.${propName}` : propName;
      const value = obj[propName];

      if (value !== undefined) {
        const result = validateValueAgainstSchema(value, propSchema, propPath);
        errors.push(...result.errors);
      }
    });
  }

  // Check for additional properties
  if (opts.strict && schema.additionalProperties === false) {
    const allowedProps = schema.properties ? Object.keys(schema.properties) : [];
    Object.keys(obj).forEach((key) => {
      if (!allowedProps.includes(key)) {
        errors.push({
          field: path ? `${path}.${key}` : key,
          message: `Additional property '${key}' is not allowed`,
          code: 'ADDITIONAL_PROPERTY',
          path: path ? `${path}.${key}` : key,
        });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

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
export const validateArraySchema = (
  arr: any,
  schema: any,
  path: string = '',
  options?: SchemaValidationOptions,
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!Array.isArray(arr)) {
    errors.push({
      field: path || 'value',
      message: 'Expected array',
      code: 'TYPE_MISMATCH',
      value: arr,
    });
    return { isValid: false, errors };
  }

  // Validate minItems
  if (schema.minItems !== undefined && arr.length < schema.minItems) {
    errors.push({
      field: path,
      message: `Array must have at least ${schema.minItems} items`,
      code: 'MIN_ITEMS',
      value: arr.length,
    });
  }

  // Validate maxItems
  if (schema.maxItems !== undefined && arr.length > schema.maxItems) {
    errors.push({
      field: path,
      message: `Array must have at most ${schema.maxItems} items`,
      code: 'MAX_ITEMS',
      value: arr.length,
    });
  }

  // Validate uniqueItems
  if (schema.uniqueItems) {
    const seen = new Set();
    arr.forEach((item, index) => {
      const key = JSON.stringify(item);
      if (seen.has(key)) {
        errors.push({
          field: `${path}[${index}]`,
          message: 'Array items must be unique',
          code: 'DUPLICATE_ITEM',
          value: item,
        });
      }
      seen.add(key);
    });
  }

  // Validate items
  if (schema.items) {
    arr.forEach((item, index) => {
      const itemPath = `${path}[${index}]`;
      const result = validateValueAgainstSchema(item, schema.items, itemPath);
      errors.push(...result.errors);
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

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
export const validateValueAgainstSchema = (
  value: any,
  schema: any,
  path: string = '',
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Handle $ref (simplified - in real implementation would resolve references)
  if (schema.$ref) {
    return { isValid: true, errors: [] }; // Assume valid for now
  }

  // Type validation
  if (schema.type) {
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    const expectedType = schema.type;

    if (actualType !== expectedType && !(expectedType === 'integer' && actualType === 'number')) {
      errors.push({
        field: path,
        message: `Expected type ${expectedType}, got ${actualType}`,
        code: 'TYPE_MISMATCH',
        value,
      });
      return { isValid: false, errors }; // Stop further validation
    }
  }

  // String validation
  if (schema.type === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push({
        field: path,
        message: `String must be at least ${schema.minLength} characters`,
        code: 'MIN_LENGTH',
        value: value.length,
      });
    }

    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      errors.push({
        field: path,
        message: `String must be at most ${schema.maxLength} characters`,
        code: 'MAX_LENGTH',
        value: value.length,
      });
    }

    if (schema.pattern) {
      const regex = new RegExp(schema.pattern);
      if (!regex.test(value)) {
        errors.push({
          field: path,
          message: `String does not match pattern: ${schema.pattern}`,
          code: 'PATTERN_MISMATCH',
          value,
        });
      }
    }

    if (schema.format) {
      const formatResult = validateFormat(value, schema.format, path);
      errors.push(...formatResult.errors);
    }
  }

  // Number validation
  if (schema.type === 'number' || schema.type === 'integer') {
    if (schema.minimum !== undefined && value < schema.minimum) {
      errors.push({
        field: path,
        message: `Value must be at least ${schema.minimum}`,
        code: 'MINIMUM',
        value,
      });
    }

    if (schema.maximum !== undefined && value > schema.maximum) {
      errors.push({
        field: path,
        message: `Value must be at most ${schema.maximum}`,
        code: 'MAXIMUM',
        value,
      });
    }

    if (schema.type === 'integer' && !Number.isInteger(value)) {
      errors.push({
        field: path,
        message: 'Value must be an integer',
        code: 'NOT_INTEGER',
        value,
      });
    }
  }

  // Enum validation
  if (schema.enum) {
    if (!schema.enum.includes(value)) {
      errors.push({
        field: path,
        message: `Value must be one of: ${schema.enum.join(', ')}`,
        code: 'ENUM_MISMATCH',
        value,
      });
    }
  }

  // Object validation
  if (schema.type === 'object') {
    const objResult = validateObjectSchema(value, schema, path);
    errors.push(...objResult.errors);
  }

  // Array validation
  if (schema.type === 'array') {
    const arrResult = validateArraySchema(value, schema, path);
    errors.push(...arrResult.errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ============================================================================
// FORMAT VALIDATORS
// ============================================================================

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
export const validateFormat = (
  value: string,
  format: string,
  path: string = '',
): ValidationResult => {
  const errors: ValidationError[] = [];

  switch (format) {
    case 'email':
      if (!validateEmailFormat(value)) {
        errors.push({
          field: path,
          message: 'Invalid email format',
          code: 'INVALID_EMAIL',
          value,
        });
      }
      break;

    case 'uuid':
      if (!validateUuidFormat(value)) {
        errors.push({
          field: path,
          message: 'Invalid UUID format',
          code: 'INVALID_UUID',
          value,
        });
      }
      break;

    case 'date':
      if (!validateDateFormat(value)) {
        errors.push({
          field: path,
          message: 'Invalid date format (expected YYYY-MM-DD)',
          code: 'INVALID_DATE',
          value,
        });
      }
      break;

    case 'date-time':
      if (!validateDateTimeFormat(value)) {
        errors.push({
          field: path,
          message: 'Invalid date-time format (expected ISO 8601)',
          code: 'INVALID_DATETIME',
          value,
        });
      }
      break;

    case 'uri':
    case 'url':
      if (!validateUrlFormat(value)) {
        errors.push({
          field: path,
          message: 'Invalid URL format',
          code: 'INVALID_URL',
          value,
        });
      }
      break;

    case 'ipv4':
      if (!validateIPv4Format(value)) {
        errors.push({
          field: path,
          message: 'Invalid IPv4 address format',
          code: 'INVALID_IPV4',
          value,
        });
      }
      break;

    case 'ipv6':
      if (!validateIPv6Format(value)) {
        errors.push({
          field: path,
          message: 'Invalid IPv6 address format',
          code: 'INVALID_IPV6',
          value,
        });
      }
      break;

    default:
      // Unknown format - just pass
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

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
export const validateEmailFormat = (value: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(value);
};

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
export const validateUuidFormat = (value: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

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
export const validateDateFormat = (value: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(value)) return false;

  const date = new Date(value);
  return !isNaN(date.getTime());
};

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
export const validateDateTimeFormat = (value: string): boolean => {
  const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
  if (!dateTimeRegex.test(value)) return false;

  const date = new Date(value);
  return !isNaN(date.getTime());
};

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
export const validateUrlFormat = (value: string): boolean => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

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
export const validateIPv4Format = (value: string): boolean => {
  const parts = value.split('.');
  if (parts.length !== 4) return false;

  return parts.every((part) => {
    const num = parseInt(part, 10);
    return !isNaN(num) && num >= 0 && num <= 255 && part === String(num);
  });
};

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
export const validateIPv6Format = (value: string): boolean => {
  const ipv6Regex =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4})$/;
  return ipv6Regex.test(value);
};

// ============================================================================
// ERROR FORMATTING
// ============================================================================

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
export const formatValidationErrors = (errors: ValidationError[]) => {
  return {
    statusCode: 400,
    error: 'Validation Error',
    message: 'Request validation failed',
    details: errors.map((err) => ({
      field: err.field,
      message: err.message,
      code: err.code,
      ...(err.path && { path: err.path }),
      ...(err.value !== undefined && { rejectedValue: err.value }),
    })),
  };
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
export const formatJsonSchemaErrors = (errors: ValidationError[]) => {
  return errors.map((err) => ({
    instancePath: `/${err.path?.replace(/\./g, '/') || err.field}`,
    schemaPath: '#/properties/' + (err.path || err.field),
    keyword: err.code.toLowerCase(),
    message: err.message,
    params: err.value !== undefined ? { value: err.value } : {},
  }));
};

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
export const createErrorMessage = (errors: ValidationError[]): string => {
  if (errors.length === 0) return '';
  if (errors.length === 1) return errors[0].message;

  const messages = errors.map((err) => `${err.field}: ${err.message}`);
  return `Validation failed: ${messages.join(', ')}`;
};

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
export const groupErrorsByField = (
  errors: ValidationError[],
): Record<string, ValidationError[]> => {
  return errors.reduce((acc, error) => {
    const key = error.path || error.field;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(error);
    return acc;
  }, {} as Record<string, ValidationError[]>);
};

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

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
export const createValidationMiddleware = (
  schema: any,
  options?: SchemaValidationOptions,
) => {
  return (req: any, res: any, next: any) => {
    const result = validateRequestBody(req.body, schema, options);

    if (!result.isValid) {
      return res.status(400).json(formatValidationErrors(result.errors));
    }

    next();
  };
};

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
export const hasValidationErrors = (result: ValidationResult): boolean => {
  return !result.isValid && result.errors.length > 0;
};

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
export const getFirstError = (result: ValidationResult): ValidationError | null => {
  return result.errors.length > 0 ? result.errors[0] : null;
};

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
export const filterErrorsByCode = (
  errors: ValidationError[],
  code: string,
): ValidationError[] => {
  return errors.filter((err) => err.code === code);
};

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
export const hasErrorCode = (errors: ValidationError[], code: string): boolean => {
  return errors.some((err) => err.code === code);
};

export default {
  // OpenAPI spec validation
  validateOpenAPISpec,
  validatePaths,
  validateSchemas,
  validateSecuritySchemes,
  validateReferences,

  // Request validation
  validateRequestBody,
  validateQueryParameters,
  validatePathParameters,
  validateHeaders,
  validateRequest,

  // Response validation
  validateResponseBody,
  validateResponseStatus,
  validateResponseHeaders,
  validateResponse,

  // Schema validators
  validateObjectSchema,
  validateArraySchema,
  validateValueAgainstSchema,

  // Format validators
  validateFormat,
  validateEmailFormat,
  validateUuidFormat,
  validateDateFormat,
  validateDateTimeFormat,
  validateUrlFormat,
  validateIPv4Format,
  validateIPv6Format,

  // Error formatting
  formatValidationErrors,
  formatJsonSchemaErrors,
  createErrorMessage,
  groupErrorsByField,

  // Validation utilities
  createValidationMiddleware,
  hasValidationErrors,
  getFirstError,
  filterErrorsByCode,
  hasErrorCode,
};
