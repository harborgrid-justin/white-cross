/**
 * @fileoverview Enterprise-grade API validation utilities for RESTful services
 * @module reuse/data/api-validation
 * @description Production-ready validators, sanitizers, DTO validation, schema validation,
 * business rules, and error formatting following REST and OpenAPI standards
 */

import { Request, Response, NextFunction } from 'express';
import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
}

/**
 * Validation error structure
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
  constraints?: Record<string, any>;
}

/**
 * Validation rule interface
 */
export interface ValidationRule {
  field: string;
  validator: (value: any) => boolean | Promise<boolean>;
  message: string;
  code?: string;
}

/**
 * Sanitization options
 */
export interface SanitizationOptions {
  trim?: boolean;
  lowercase?: boolean;
  uppercase?: boolean;
  escape?: boolean;
  maxLength?: number;
}

/**
 * Query parameter constraints
 */
export interface QueryConstraints {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'array';
  pattern?: RegExp;
  min?: number;
  max?: number;
  enum?: any[];
}

/**
 * Business rule configuration
 */
export interface BusinessRule {
  name: string;
  validate: (data: any) => boolean | Promise<boolean>;
  errorMessage: string;
  errorCode?: string;
}

/**
 * Cross-field validation rule
 */
export interface CrossFieldRule {
  fields: string[];
  validate: (values: any[]) => boolean;
  message: string;
  code?: string;
}

// Initialize AJV for JSON Schema validation
const ajv = new Ajv({ allErrors: true, removeAdditional: true });
addFormats(ajv);

// ============================================================================
// Request Body Validators
// ============================================================================

/**
 * Validates that request body exists and is not empty.
 * Checks for null, undefined, and empty objects.
 *
 * @param body - Request body to validate
 * @returns ValidationResult with valid=true if body exists, otherwise includes error details
 *
 * @example
 * ```typescript
 * const result = validateBodyExists(req.body);
 * if (!result.valid) {
 *   return res.status(400).json({ errors: result.errors });
 * }
 * ```
 */
export function validateBodyExists(body: any): ValidationResult {
  if (!body || (typeof body === 'object' && Object.keys(body).length === 0)) {
    return {
      valid: false,
      errors: [
        {
          field: 'body',
          message: 'Request body is required',
          code: 'BODY_REQUIRED',
        },
      ],
    };
  }

  return { valid: true };
}

/**
 * Validates that required fields are present in request body.
 * Checks for null, undefined, and empty string values.
 *
 * @param body - Request body object to validate
 * @param requiredFields - Array of required field names
 * @returns ValidationResult with errors for each missing field
 *
 * @example
 * ```typescript
 * const result = validateRequiredFields(req.body, ['email', 'password', 'name']);
 * if (!result.valid) {
 *   return res.status(400).json({ errors: result.errors });
 * }
 * ```
 */
export function validateRequiredFields(body: any, requiredFields: string[]): ValidationResult {
  const errors: ValidationError[] = [];

  for (const field of requiredFields) {
    if (!(field in body) || body[field] === null || body[field] === undefined || body[field] === '') {
      errors.push({
        field,
        message: `Field '${field}' is required`,
        code: 'FIELD_REQUIRED',
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Validates field types in request body
 * @param body - Request body
 * @param typeDefinitions - Map of field names to expected types
 * @returns Validation result
 */
export function validateFieldTypes(
  body: any,
  typeDefinitions: Record<string, 'string' | 'number' | 'boolean' | 'object' | 'array'>
): ValidationResult {
  const errors: ValidationError[] = [];

  for (const [field, expectedType] of Object.entries(typeDefinitions)) {
    if (!(field in body)) {
      continue; // Skip missing fields (use validateRequiredFields for required checks)
    }

    const value = body[field];
    let actualType = typeof value;

    if (Array.isArray(value)) {
      actualType = 'array';
    } else if (value === null) {
      actualType = 'null';
    }

    if (actualType !== expectedType) {
      errors.push({
        field,
        message: `Field '${field}' must be of type ${expectedType}, got ${actualType}`,
        code: 'INVALID_TYPE',
        value,
        constraints: { expectedType, actualType },
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Validates request body against allowed fields (whitelist)
 * @param body - Request body
 * @param allowedFields - Array of allowed field names
 * @returns Validation result
 */
export function validateAllowedFields(body: any, allowedFields: string[]): ValidationResult {
  const errors: ValidationError[] = [];
  const bodyFields = Object.keys(body);

  for (const field of bodyFields) {
    if (!allowedFields.includes(field)) {
      errors.push({
        field,
        message: `Field '${field}' is not allowed`,
        code: 'FIELD_NOT_ALLOWED',
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

// ============================================================================
// Query Parameter Validators
// ============================================================================

/**
 * Validates query parameter against constraints
 * @param paramName - Parameter name
 * @param paramValue - Parameter value
 * @param constraints - Validation constraints
 * @returns Validation result
 */
export function validateQueryParameter(
  paramName: string,
  paramValue: any,
  constraints: QueryConstraints
): ValidationResult {
  const errors: ValidationError[] = [];

  // Required check
  if (constraints.required && (paramValue === undefined || paramValue === null || paramValue === '')) {
    errors.push({
      field: paramName,
      message: `Query parameter '${paramName}' is required`,
      code: 'PARAM_REQUIRED',
    });
    return { valid: false, errors };
  }

  // Skip further validation if not required and not provided
  if (!constraints.required && (paramValue === undefined || paramValue === null || paramValue === '')) {
    return { valid: true };
  }

  // Type validation
  if (constraints.type) {
    let valid = true;

    switch (constraints.type) {
      case 'number':
        const num = Number(paramValue);
        if (isNaN(num)) {
          valid = false;
        }
        break;

      case 'boolean':
        if (paramValue !== 'true' && paramValue !== 'false' && paramValue !== true && paramValue !== false) {
          valid = false;
        }
        break;

      case 'array':
        if (!Array.isArray(paramValue)) {
          valid = false;
        }
        break;
    }

    if (!valid) {
      errors.push({
        field: paramName,
        message: `Query parameter '${paramName}' must be of type ${constraints.type}`,
        code: 'INVALID_PARAM_TYPE',
        value: paramValue,
      });
    }
  }

  // Pattern validation
  if (constraints.pattern && !constraints.pattern.test(String(paramValue))) {
    errors.push({
      field: paramName,
      message: `Query parameter '${paramName}' does not match required pattern`,
      code: 'INVALID_PARAM_PATTERN',
      value: paramValue,
    });
  }

  // Min/Max validation for numbers
  if (constraints.type === 'number') {
    const num = Number(paramValue);

    if (constraints.min !== undefined && num < constraints.min) {
      errors.push({
        field: paramName,
        message: `Query parameter '${paramName}' must be at least ${constraints.min}`,
        code: 'PARAM_TOO_SMALL',
        value: paramValue,
        constraints: { min: constraints.min },
      });
    }

    if (constraints.max !== undefined && num > constraints.max) {
      errors.push({
        field: paramName,
        message: `Query parameter '${paramName}' must be at most ${constraints.max}`,
        code: 'PARAM_TOO_LARGE',
        value: paramValue,
        constraints: { max: constraints.max },
      });
    }
  }

  // Enum validation
  if (constraints.enum && !constraints.enum.includes(paramValue)) {
    errors.push({
      field: paramName,
      message: `Query parameter '${paramName}' must be one of: ${constraints.enum.join(', ')}`,
      code: 'INVALID_PARAM_ENUM',
      value: paramValue,
      constraints: { allowedValues: constraints.enum },
    });
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Validates pagination query parameters
 * @param query - Query object
 * @param defaults - Default pagination values
 * @returns Validation result with parsed values
 */
export function validatePaginationParams(
  query: any,
  defaults: { page?: number; pageSize?: number; maxPageSize?: number } = {}
): ValidationResult & { parsed?: { page: number; pageSize: number } } {
  const errors: ValidationError[] = [];
  const defaultPage = defaults.page || 1;
  const defaultPageSize = defaults.pageSize || 20;
  const maxPageSize = defaults.maxPageSize || 100;

  let page = defaultPage;
  let pageSize = defaultPageSize;

  // Validate page
  if (query.page !== undefined) {
    const pageNum = parseInt(query.page, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      errors.push({
        field: 'page',
        message: 'Page must be a positive integer',
        code: 'INVALID_PAGE',
        value: query.page,
      });
    } else {
      page = pageNum;
    }
  }

  // Validate pageSize
  if (query.pageSize !== undefined) {
    const pageSizeNum = parseInt(query.pageSize, 10);
    if (isNaN(pageSizeNum) || pageSizeNum < 1) {
      errors.push({
        field: 'pageSize',
        message: 'Page size must be a positive integer',
        code: 'INVALID_PAGE_SIZE',
        value: query.pageSize,
      });
    } else if (pageSizeNum > maxPageSize) {
      errors.push({
        field: 'pageSize',
        message: `Page size cannot exceed ${maxPageSize}`,
        code: 'PAGE_SIZE_TOO_LARGE',
        value: query.pageSize,
        constraints: { maxPageSize },
      });
    } else {
      pageSize = pageSizeNum;
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    parsed: errors.length === 0 ? { page, pageSize } : undefined,
  };
}

/**
 * Validates sorting query parameters
 * @param sortBy - Sort field
 * @param sortOrder - Sort order (asc/desc)
 * @param allowedFields - Allowed fields for sorting
 * @returns Validation result
 */
export function validateSortParams(
  sortBy: string | undefined,
  sortOrder: string | undefined,
  allowedFields: string[]
): ValidationResult {
  const errors: ValidationError[] = [];

  if (sortBy && !allowedFields.includes(sortBy)) {
    errors.push({
      field: 'sortBy',
      message: `Sort field must be one of: ${allowedFields.join(', ')}`,
      code: 'INVALID_SORT_FIELD',
      value: sortBy,
      constraints: { allowedFields },
    });
  }

  if (sortOrder && !['asc', 'desc', 'ASC', 'DESC'].includes(sortOrder)) {
    errors.push({
      field: 'sortOrder',
      message: "Sort order must be 'asc' or 'desc'",
      code: 'INVALID_SORT_ORDER',
      value: sortOrder,
    });
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Validates filter query parameters
 * @param filters - Filter object
 * @param allowedFilters - Allowed filter fields
 * @returns Validation result
 */
export function validateFilterParams(
  filters: Record<string, any>,
  allowedFilters: string[]
): ValidationResult {
  const errors: ValidationError[] = [];

  for (const filterKey of Object.keys(filters)) {
    if (!allowedFilters.includes(filterKey)) {
      errors.push({
        field: filterKey,
        message: `Filter field '${filterKey}' is not allowed`,
        code: 'INVALID_FILTER_FIELD',
        constraints: { allowedFilters },
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

// ============================================================================
// Path Parameter Validators
// ============================================================================

/**
 * Validates UUID path parameter format and optionally checks version.
 * Uses the 'uuid' library for validation.
 *
 * @param paramName - Parameter name for error reporting
 * @param paramValue - UUID string value to validate
 * @param version - Optional required UUID version (1, 2, 3, 4, or 5)
 * @returns ValidationResult with error if UUID is invalid or wrong version
 *
 * @example
 * ```typescript
 * // Validate any UUID version
 * const result = validateUuidParam('userId', req.params.id);
 *
 * // Validate UUID v4 only
 * const result = validateUuidParam('userId', req.params.id, 4);
 *
 * if (!result.valid) {
 *   return res.status(400).json({ errors: result.errors });
 * }
 * ```
 */
export function validateUuidParam(
  paramName: string,
  paramValue: string,
  version?: 1 | 2 | 3 | 4 | 5
): ValidationResult {
  if (!uuidValidate(paramValue)) {
    return {
      valid: false,
      errors: [
        {
          field: paramName,
          message: `Parameter '${paramName}' must be a valid UUID`,
          code: 'INVALID_UUID',
          value: paramValue,
        },
      ],
    };
  }

  if (version && uuidVersion(paramValue) !== version) {
    return {
      valid: false,
      errors: [
        {
          field: paramName,
          message: `Parameter '${paramName}' must be a UUID version ${version}`,
          code: 'INVALID_UUID_VERSION',
          value: paramValue,
          constraints: { requiredVersion: version },
        },
      ],
    };
  }

  return { valid: true };
}

/**
 * Validates numeric ID path parameter
 * @param paramName - Parameter name
 * @param paramValue - Numeric ID value
 * @param options - Validation options (min, max)
 * @returns Validation result
 */
export function validateNumericIdParam(
  paramName: string,
  paramValue: string | number,
  options: { min?: number; max?: number } = {}
): ValidationResult {
  const errors: ValidationError[] = [];
  const numValue = typeof paramValue === 'string' ? parseInt(paramValue, 10) : paramValue;

  if (isNaN(numValue) || numValue < 1) {
    errors.push({
      field: paramName,
      message: `Parameter '${paramName}' must be a positive integer`,
      code: 'INVALID_ID',
      value: paramValue,
    });
    return { valid: false, errors };
  }

  if (options.min !== undefined && numValue < options.min) {
    errors.push({
      field: paramName,
      message: `Parameter '${paramName}' must be at least ${options.min}`,
      code: 'ID_TOO_SMALL',
      value: paramValue,
      constraints: { min: options.min },
    });
  }

  if (options.max !== undefined && numValue > options.max) {
    errors.push({
      field: paramName,
      message: `Parameter '${paramName}' must be at most ${options.max}`,
      code: 'ID_TOO_LARGE',
      value: paramValue,
      constraints: { max: options.max },
    });
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Validates slug path parameter
 * @param paramName - Parameter name
 * @param paramValue - Slug value
 * @returns Validation result
 */
export function validateSlugParam(paramName: string, paramValue: string): ValidationResult {
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  if (!slugPattern.test(paramValue)) {
    return {
      valid: false,
      errors: [
        {
          field: paramName,
          message: `Parameter '${paramName}' must be a valid slug (lowercase alphanumeric with hyphens)`,
          code: 'INVALID_SLUG',
          value: paramValue,
        },
      ],
    };
  }

  return { valid: true };
}

// ============================================================================
// Header Validators
// ============================================================================

/**
 * Validates required headers
 * @param headers - Request headers
 * @param requiredHeaders - Array of required header names
 * @returns Validation result
 */
export function validateRequiredHeaders(
  headers: Record<string, any>,
  requiredHeaders: string[]
): ValidationResult {
  const errors: ValidationError[] = [];

  for (const header of requiredHeaders) {
    const headerLower = header.toLowerCase();
    if (!headers[headerLower]) {
      errors.push({
        field: header,
        message: `Header '${header}' is required`,
        code: 'HEADER_REQUIRED',
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Validates Content-Type header
 * @param contentType - Content-Type header value
 * @param allowedTypes - Array of allowed content types
 * @returns Validation result
 */
export function validateContentType(
  contentType: string | undefined,
  allowedTypes: string[]
): ValidationResult {
  if (!contentType) {
    return {
      valid: false,
      errors: [
        {
          field: 'Content-Type',
          message: 'Content-Type header is required',
          code: 'CONTENT_TYPE_REQUIRED',
        },
      ],
    };
  }

  const baseType = contentType.split(';')[0].trim();

  if (!allowedTypes.includes(baseType)) {
    return {
      valid: false,
      errors: [
        {
          field: 'Content-Type',
          message: `Content-Type must be one of: ${allowedTypes.join(', ')}`,
          code: 'INVALID_CONTENT_TYPE',
          value: contentType,
          constraints: { allowedTypes },
        },
      ],
    };
  }

  return { valid: true };
}

/**
 * Validates Authorization header format
 * @param authorization - Authorization header value
 * @param scheme - Expected auth scheme (Bearer, Basic, etc.)
 * @returns Validation result
 */
export function validateAuthorizationHeader(
  authorization: string | undefined,
  scheme: string = 'Bearer'
): ValidationResult {
  if (!authorization) {
    return {
      valid: false,
      errors: [
        {
          field: 'Authorization',
          message: 'Authorization header is required',
          code: 'AUTHORIZATION_REQUIRED',
        },
      ],
    };
  }

  const pattern = new RegExp(`^${scheme}\\s+\\S+$`, 'i');

  if (!pattern.test(authorization)) {
    return {
      valid: false,
      errors: [
        {
          field: 'Authorization',
          message: `Authorization header must follow format: ${scheme} <token>`,
          code: 'INVALID_AUTHORIZATION_FORMAT',
          value: authorization,
        },
      ],
    };
  }

  return { valid: true };
}

// ============================================================================
// Schema Validators (JSON Schema)
// ============================================================================

/**
 * Validates data against JSON Schema using AJV (Another JSON Validator).
 * Supports full JSON Schema draft-07 specification with format validation.
 *
 * @param data - Data object to validate
 * @param schema - JSON Schema (JSONSchemaType) definition
 * @returns ValidationResult with detailed error information for each validation failure
 *
 * @example
 * ```typescript
 * const userSchema: JSONSchemaType<User> = {
 *   type: 'object',
 *   properties: {
 *     name: { type: 'string', minLength: 1 },
 *     email: { type: 'string', format: 'email' },
 *     age: { type: 'number', minimum: 0 }
 *   },
 *   required: ['name', 'email'],
 *   additionalProperties: false
 * };
 *
 * const result = validateJsonSchema(userData, userSchema);
 * if (!result.valid) {
 *   return res.status(400).json({ errors: result.errors });
 * }
 * ```
 */
export function validateJsonSchema<T>(data: any, schema: JSONSchemaType<T>): ValidationResult {
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid && validate.errors) {
    const errors: ValidationError[] = validate.errors.map((error) => ({
      field: error.instancePath.replace(/^\//, '').replace(/\//g, '.') || 'root',
      message: error.message || 'Validation failed',
      code: error.keyword.toUpperCase(),
      constraints: error.params,
    }));

    return { valid: false, errors };
  }

  return { valid: true };
}

/**
 * Creates a cached JSON schema validator
 * @param schema - JSON schema
 * @returns Validation function
 */
export function createSchemaValidator<T>(
  schema: JSONSchemaType<T>
): (data: any) => ValidationResult {
  const validate = ajv.compile(schema);

  return (data: any): ValidationResult => {
    const valid = validate(data);

    if (!valid && validate.errors) {
      const errors: ValidationError[] = validate.errors.map((error) => ({
        field: error.instancePath.replace(/^\//, '').replace(/\//g, '.') || 'root',
        message: error.message || 'Validation failed',
        code: error.keyword.toUpperCase(),
        constraints: error.params,
      }));

      return { valid: false, errors };
    }

    return { valid: true };
  };
}

/**
 * Validates OpenAPI request body
 * @param body - Request body
 * @param schema - OpenAPI schema
 * @returns Validation result
 */
export function validateOpenApiSchema(body: any, schema: any): ValidationResult {
  return validateJsonSchema(body, schema);
}

/**
 * Combines multiple schema validators with AND logic
 * @param validators - Array of validator functions
 * @returns Combined validator
 */
export function combineSchemaValidators(
  validators: Array<(data: any) => ValidationResult>
): (data: any) => ValidationResult {
  return (data: any): ValidationResult => {
    const allErrors: ValidationError[] = [];

    for (const validator of validators) {
      const result = validator(data);
      if (!result.valid && result.errors) {
        allErrors.push(...result.errors);
      }
    }

    return {
      valid: allErrors.length === 0,
      errors: allErrors.length > 0 ? allErrors : undefined,
    };
  };
}

// ============================================================================
// Business Rule Validators
// ============================================================================

/**
 * Applies business rule validation
 * @param data - Data to validate
 * @param rule - Business rule
 * @returns Validation result
 */
export async function applyBusinessRule(data: any, rule: BusinessRule): Promise<ValidationResult> {
  const isValid = await Promise.resolve(rule.validate(data));

  if (!isValid) {
    return {
      valid: false,
      errors: [
        {
          field: 'businessRule',
          message: rule.errorMessage,
          code: rule.errorCode || 'BUSINESS_RULE_VIOLATION',
        },
      ],
    };
  }

  return { valid: true };
}

/**
 * Applies multiple business rules
 * @param data - Data to validate
 * @param rules - Array of business rules
 * @returns Validation result
 */
export async function applyBusinessRules(
  data: any,
  rules: BusinessRule[]
): Promise<ValidationResult> {
  const errors: ValidationError[] = [];

  for (const rule of rules) {
    const result = await applyBusinessRule(data, rule);
    if (!result.valid && result.errors) {
      errors.push(...result.errors);
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Creates a business rule validator
 * @param name - Rule name
 * @param validateFn - Validation function
 * @param errorMessage - Error message
 * @param errorCode - Error code
 * @returns Business rule object
 */
export function createBusinessRule(
  name: string,
  validateFn: (data: any) => boolean | Promise<boolean>,
  errorMessage: string,
  errorCode?: string
): BusinessRule {
  return {
    name,
    validate: validateFn,
    errorMessage,
    errorCode,
  };
}

/**
 * Validates uniqueness constraint (for checking if value exists)
 * @param value - Value to check
 * @param checkExists - Async function to check if value exists
 * @param field - Field name
 * @returns Validation result
 */
export async function validateUniqueness(
  value: any,
  checkExists: (value: any) => Promise<boolean>,
  field: string
): Promise<ValidationResult> {
  const exists = await checkExists(value);

  if (exists) {
    return {
      valid: false,
      errors: [
        {
          field,
          message: `Value '${value}' already exists`,
          code: 'DUPLICATE_VALUE',
          value,
        },
      ],
    };
  }

  return { valid: true };
}

// ============================================================================
// Cross-Field Validation
// ============================================================================

/**
 * Validates cross-field rules
 * @param data - Data object
 * @param rule - Cross-field validation rule
 * @returns Validation result
 */
export function validateCrossFields(data: any, rule: CrossFieldRule): ValidationResult {
  const values = rule.fields.map((field) => data[field]);
  const isValid = rule.validate(values);

  if (!isValid) {
    return {
      valid: false,
      errors: [
        {
          field: rule.fields.join(', '),
          message: rule.message,
          code: rule.code || 'CROSS_FIELD_VALIDATION_FAILED',
        },
      ],
    };
  }

  return { valid: true };
}

/**
 * Validates date range (startDate must be before endDate)
 * @param startDate - Start date
 * @param endDate - End date
 * @param startFieldName - Start field name
 * @param endFieldName - End field name
 * @returns Validation result
 */
export function validateDateRange(
  startDate: Date | string,
  endDate: Date | string,
  startFieldName: string = 'startDate',
  endFieldName: string = 'endDate'
): ValidationResult {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      valid: false,
      errors: [
        {
          field: `${startFieldName}, ${endFieldName}`,
          message: 'Invalid date format',
          code: 'INVALID_DATE_FORMAT',
        },
      ],
    };
  }

  if (start >= end) {
    return {
      valid: false,
      errors: [
        {
          field: `${startFieldName}, ${endFieldName}`,
          message: `${startFieldName} must be before ${endFieldName}`,
          code: 'INVALID_DATE_RANGE',
        },
      ],
    };
  }

  return { valid: true };
}

/**
 * Validates password confirmation matches
 * @param password - Password field
 * @param confirmation - Confirmation field
 * @returns Validation result
 */
export function validatePasswordConfirmation(
  password: string,
  confirmation: string
): ValidationResult {
  if (password !== confirmation) {
    return {
      valid: false,
      errors: [
        {
          field: 'passwordConfirmation',
          message: 'Password confirmation does not match',
          code: 'PASSWORD_MISMATCH',
        },
      ],
    };
  }

  return { valid: true };
}

// ============================================================================
// Async Validators
// ============================================================================

/**
 * Validates email uniqueness by checking database
 * @param email - Email to validate
 * @param checkEmailExists - Async function to check email existence
 * @returns Validation result
 */
export async function validateEmailUniqueness(
  email: string,
  checkEmailExists: (email: string) => Promise<boolean>
): Promise<ValidationResult> {
  const exists = await checkEmailExists(email);

  if (exists) {
    return {
      valid: false,
      errors: [
        {
          field: 'email',
          message: 'Email address is already in use',
          code: 'EMAIL_ALREADY_EXISTS',
          value: email,
        },
      ],
    };
  }

  return { valid: true };
}

/**
 * Validates username uniqueness by checking database
 * @param username - Username to validate
 * @param checkUsernameExists - Async function to check username existence
 * @returns Validation result
 */
export async function validateUsernameUniqueness(
  username: string,
  checkUsernameExists: (username: string) => Promise<boolean>
): Promise<ValidationResult> {
  const exists = await checkUsernameExists(username);

  if (exists) {
    return {
      valid: false,
      errors: [
        {
          field: 'username',
          message: 'Username is already taken',
          code: 'USERNAME_ALREADY_EXISTS',
          value: username,
        },
      ],
    };
  }

  return { valid: true };
}

/**
 * Validates resource existence by ID
 * @param resourceId - Resource ID
 * @param checkResourceExists - Async function to check resource existence
 * @param resourceName - Resource type name
 * @returns Validation result
 */
export async function validateResourceExists(
  resourceId: string | number,
  checkResourceExists: (id: string | number) => Promise<boolean>,
  resourceName: string = 'Resource'
): Promise<ValidationResult> {
  const exists = await checkResourceExists(resourceId);

  if (!exists) {
    return {
      valid: false,
      errors: [
        {
          field: 'resourceId',
          message: `${resourceName} with ID '${resourceId}' does not exist`,
          code: 'RESOURCE_NOT_FOUND',
          value: resourceId,
        },
      ],
    };
  }

  return { valid: true };
}

// ============================================================================
// Validation Error Formatters
// ============================================================================

/**
 * Formats validation errors for API response
 * @param errors - Array of validation errors
 * @returns Formatted error object
 */
export function formatValidationErrors(errors: ValidationError[]): {
  message: string;
  errors: ValidationError[];
} {
  return {
    message: 'Validation failed',
    errors,
  };
}

/**
 * Converts validation result to HTTP response format
 * @param result - Validation result
 * @returns HTTP-friendly error object
 */
export function toHttpErrorFormat(result: ValidationResult): {
  statusCode: number;
  error: string;
  message: string;
  details: ValidationError[];
} | null {
  if (result.valid) {
    return null;
  }

  return {
    statusCode: 400,
    error: 'Bad Request',
    message: 'Request validation failed',
    details: result.errors || [],
  };
}

/**
 * Groups validation errors by field
 * @param errors - Array of validation errors
 * @returns Errors grouped by field
 */
export function groupErrorsByField(
  errors: ValidationError[]
): Record<string, ValidationError[]> {
  return errors.reduce((acc, error) => {
    if (!acc[error.field]) {
      acc[error.field] = [];
    }
    acc[error.field].push(error);
    return acc;
  }, {} as Record<string, ValidationError[]>);
}

/**
 * Extracts first error message for each field
 * @param errors - Array of validation errors
 * @returns Map of field to first error message
 */
export function extractFirstErrors(errors: ValidationError[]): Record<string, string> {
  const grouped = groupErrorsByField(errors);
  return Object.entries(grouped).reduce((acc, [field, fieldErrors]) => {
    acc[field] = fieldErrors[0].message;
    return acc;
  }, {} as Record<string, string>);
}

// ============================================================================
// Validation Middleware Chains
// ============================================================================

/**
 * Creates Express middleware for validating request data (body, query, or params).
 * Returns 400 Bad Request with error details if validation fails.
 *
 * @param validator - Validation function that returns ValidationResult or Promise<ValidationResult>
 * @param target - Request property to validate: 'body', 'query', or 'params'
 * @returns Express middleware function
 *
 * @example
 * ```typescript
 * // Create middleware for body validation
 * const validateUserBody = createValidationMiddleware(
 *   (data) => validateRequiredFields(data, ['email', 'password']),
 *   'body'
 * );
 *
 * // Use in route
 * app.post('/users', validateUserBody, createUserHandler);
 *
 * // With async validator
 * const validateUniqueEmail = createValidationMiddleware(
 *   async (data) => await validateEmailUniqueness(data.email, checkEmailExists),
 *   'body'
 * );
 * ```
 */
export function createValidationMiddleware(
  validator: (data: any) => ValidationResult | Promise<ValidationResult>,
  target: 'body' | 'query' | 'params' = 'body'
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data = req[target];
    const result = await Promise.resolve(validator(data));

    if (!result.valid) {
      const errorResponse = toHttpErrorFormat(result);
      res.status(400).json(errorResponse);
      return;
    }

    next();
  };
}

/**
 * Chains multiple validation middleware functions
 * @param validators - Array of validator functions
 * @param target - Validation target
 * @returns Chained middleware
 */
export function chainValidators(
  validators: Array<(data: any) => ValidationResult | Promise<ValidationResult>>,
  target: 'body' | 'query' | 'params' = 'body'
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data = req[target];
    const allErrors: ValidationError[] = [];

    for (const validator of validators) {
      const result = await Promise.resolve(validator(data));
      if (!result.valid && result.errors) {
        allErrors.push(...result.errors);
      }
    }

    if (allErrors.length > 0) {
      res.status(400).json({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Request validation failed',
        details: allErrors,
      });
      return;
    }

    next();
  };
}

/**
 * Creates comprehensive request validator middleware that validates multiple request parts.
 * Validates body, query parameters, path parameters, and headers in a single middleware.
 * Accumulates all validation errors before responding.
 *
 * @param options - Validation options object with optional validators for each request part
 * @param options.body - Optional body validation function
 * @param options.query - Optional query parameters validation function
 * @param options.params - Optional path parameters validation function
 * @param options.headers - Optional headers validation function
 * @returns Express middleware function that validates all specified parts
 *
 * @example
 * ```typescript
 * const validateCreateUser = validateRequest({
 *   body: (data) => validateRequiredFields(data, ['email', 'password', 'name']),
 *   query: (data) => validatePaginationParams(data),
 *   params: (data) => validateUuidParam('userId', data.userId),
 *   headers: (data) => validateRequiredHeaders(data, ['Authorization'])
 * });
 *
 * app.post('/users/:userId', validateCreateUser, createUserHandler);
 *
 * // With async validators
 * const validateUpdateUser = validateRequest({
 *   body: async (data) => {
 *     const schemaResult = validateJsonSchema(data, userUpdateSchema);
 *     if (!schemaResult.valid) return schemaResult;
 *     return await validateEmailUniqueness(data.email, checkEmailExists);
 *   },
 *   params: (data) => validateUuidParam('id', data.id, 4)
 * });
 * ```
 */
export function validateRequest(options: {
  body?: (data: any) => ValidationResult | Promise<ValidationResult>;
  query?: (data: any) => ValidationResult | Promise<ValidationResult>;
  params?: (data: any) => ValidationResult | Promise<ValidationResult>;
  headers?: (data: any) => ValidationResult | Promise<ValidationResult>;
}): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const allErrors: ValidationError[] = [];

    if (options.body) {
      const result = await Promise.resolve(options.body(req.body));
      if (!result.valid && result.errors) {
        allErrors.push(...result.errors);
      }
    }

    if (options.query) {
      const result = await Promise.resolve(options.query(req.query));
      if (!result.valid && result.errors) {
        allErrors.push(...result.errors);
      }
    }

    if (options.params) {
      const result = await Promise.resolve(options.params(req.params));
      if (!result.valid && result.errors) {
        allErrors.push(...result.errors);
      }
    }

    if (options.headers) {
      const result = await Promise.resolve(options.headers(req.headers));
      if (!result.valid && result.errors) {
        allErrors.push(...result.errors);
      }
    }

    if (allErrors.length > 0) {
      res.status(400).json({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Request validation failed',
        details: allErrors,
      });
      return;
    }

    next();
  };
}

// ============================================================================
// Sanitization Functions
// ============================================================================

/**
 * Sanitizes string input by applying various transformations and safety measures.
 * Helps prevent XSS attacks and ensures consistent data formatting.
 *
 * @param value - String value to sanitize
 * @param options - Sanitization options object
 * @param options.trim - Remove leading/trailing whitespace
 * @param options.lowercase - Convert to lowercase
 * @param options.uppercase - Convert to uppercase
 * @param options.escape - Escape HTML special characters to prevent XSS
 * @param options.maxLength - Truncate to maximum length
 * @returns Sanitized string
 *
 * @example
 * ```typescript
 * // Basic sanitization
 * const clean = sanitizeString('  Hello World  ', { trim: true });
 * // Result: 'Hello World'
 *
 * // XSS prevention
 * const safe = sanitizeString('<script>alert("xss")</script>', { escape: true });
 * // Result: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 *
 * // Email normalization
 * const email = sanitizeString(' User@Example.COM ', { trim: true, lowercase: true });
 * // Result: 'user@example.com'
 *
 * // Length limiting
 * const limited = sanitizeString('Very long text...', { maxLength: 10 });
 * // Result: 'Very long '
 * ```
 */
export function sanitizeString(value: string, options: SanitizationOptions = {}): string {
  let sanitized = value;

  if (options.trim) {
    sanitized = sanitized.trim();
  }

  if (options.lowercase) {
    sanitized = sanitized.toLowerCase();
  }

  if (options.uppercase) {
    sanitized = sanitized.toUpperCase();
  }

  if (options.escape) {
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  if (options.maxLength && sanitized.length > options.maxLength) {
    sanitized = sanitized.substring(0, options.maxLength);
  }

  return sanitized;
}

/**
 * Sanitizes email address
 * @param email - Email to sanitize
 * @returns Sanitized email
 */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Removes HTML tags from string
 * @param value - String with potential HTML
 * @returns String without HTML tags
 */
export function stripHtmlTags(value: string): string {
  return value.replace(/<[^>]*>/g, '');
}

/**
 * Sanitizes object by removing null/undefined values
 * @param obj - Object to sanitize
 * @param recursive - Whether to sanitize nested objects
 * @returns Sanitized object
 */
export function sanitizeObject(obj: any, recursive: boolean = true): any {
  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== null && item !== undefined)
      .map((item) => (recursive && typeof item === 'object' ? sanitizeObject(item, recursive) : item));
  }

  if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined) {
        acc[key] = recursive && typeof value === 'object' ? sanitizeObject(value, recursive) : value;
      }
      return acc;
    }, {} as any);
  }

  return obj;
}

/**
 * Normalizes phone number format
 * @param phone - Phone number string
 * @returns Normalized phone number (digits only)
 */
export function normalizePhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

// ============================================================================
// Whitelist/Blacklist Validators
// ============================================================================

/**
 * Validates value against whitelist
 * @param value - Value to validate
 * @param whitelist - Array of allowed values
 * @param field - Field name
 * @returns Validation result
 */
export function validateWhitelist(
  value: any,
  whitelist: any[],
  field: string
): ValidationResult {
  if (!whitelist.includes(value)) {
    return {
      valid: false,
      errors: [
        {
          field,
          message: `Value must be one of: ${whitelist.join(', ')}`,
          code: 'INVALID_VALUE',
          value,
          constraints: { allowedValues: whitelist },
        },
      ],
    };
  }

  return { valid: true };
}

/**
 * Validates value against blacklist
 * @param value - Value to validate
 * @param blacklist - Array of forbidden values
 * @param field - Field name
 * @returns Validation result
 */
export function validateBlacklist(
  value: any,
  blacklist: any[],
  field: string
): ValidationResult {
  if (blacklist.includes(value)) {
    return {
      valid: false,
      errors: [
        {
          field,
          message: `Value '${value}' is not allowed`,
          code: 'FORBIDDEN_VALUE',
          value,
          constraints: { forbiddenValues: blacklist },
        },
      ],
    };
  }

  return { valid: true };
}

/**
 * Validates array contains only whitelisted values
 * @param values - Array of values
 * @param whitelist - Array of allowed values
 * @param field - Field name
 * @returns Validation result
 */
export function validateArrayWhitelist(
  values: any[],
  whitelist: any[],
  field: string
): ValidationResult {
  const invalidValues = values.filter((v) => !whitelist.includes(v));

  if (invalidValues.length > 0) {
    return {
      valid: false,
      errors: [
        {
          field,
          message: `Array contains invalid values: ${invalidValues.join(', ')}`,
          code: 'INVALID_ARRAY_VALUES',
          value: invalidValues,
          constraints: { allowedValues: whitelist },
        },
      ],
    };
  }

  return { valid: true };
}

/**
 * Validates API key format
 * @param apiKey - API key to validate
 * @param pattern - Expected pattern (default: alphanumeric with min length)
 * @param minLength - Minimum key length
 * @returns Validation result
 */
export function validateApiKey(
  apiKey: string | undefined,
  pattern?: RegExp,
  minLength: number = 32
): ValidationResult {
  if (!apiKey) {
    return {
      valid: false,
      errors: [
        {
          field: 'apiKey',
          message: 'API key is required',
          code: 'API_KEY_REQUIRED',
        },
      ],
    };
  }

  if (apiKey.length < minLength) {
    return {
      valid: false,
      errors: [
        {
          field: 'apiKey',
          message: `API key must be at least ${minLength} characters`,
          code: 'API_KEY_TOO_SHORT',
          value: apiKey,
          constraints: { minLength },
        },
      ],
    };
  }

  const defaultPattern = /^[A-Za-z0-9_-]+$/;
  const validationPattern = pattern || defaultPattern;

  if (!validationPattern.test(apiKey)) {
    return {
      valid: false,
      errors: [
        {
          field: 'apiKey',
          message: 'API key contains invalid characters',
          code: 'INVALID_API_KEY_FORMAT',
          value: apiKey,
        },
      ],
    };
  }

  return { valid: true };
}
