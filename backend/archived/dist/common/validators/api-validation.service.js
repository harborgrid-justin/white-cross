"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBodyExists = validateBodyExists;
exports.validateRequiredFields = validateRequiredFields;
exports.validateFieldTypes = validateFieldTypes;
exports.validateAllowedFields = validateAllowedFields;
exports.validateQueryParameter = validateQueryParameter;
exports.validatePaginationParams = validatePaginationParams;
exports.validateSortParams = validateSortParams;
exports.validateFilterParams = validateFilterParams;
exports.validateUuidParam = validateUuidParam;
exports.validateNumericIdParam = validateNumericIdParam;
exports.validateSlugParam = validateSlugParam;
exports.validateRequiredHeaders = validateRequiredHeaders;
exports.validateContentType = validateContentType;
exports.validateAuthorizationHeader = validateAuthorizationHeader;
exports.validateJsonSchema = validateJsonSchema;
exports.createSchemaValidator = createSchemaValidator;
exports.validateOpenApiSchema = validateOpenApiSchema;
exports.combineSchemaValidators = combineSchemaValidators;
exports.applyBusinessRule = applyBusinessRule;
exports.applyBusinessRules = applyBusinessRules;
exports.createBusinessRule = createBusinessRule;
exports.validateUniqueness = validateUniqueness;
exports.validateCrossFields = validateCrossFields;
exports.validateDateRange = validateDateRange;
exports.validatePasswordConfirmation = validatePasswordConfirmation;
exports.validateEmailUniqueness = validateEmailUniqueness;
exports.validateUsernameUniqueness = validateUsernameUniqueness;
exports.validateResourceExists = validateResourceExists;
exports.formatValidationErrors = formatValidationErrors;
exports.toHttpErrorFormat = toHttpErrorFormat;
exports.groupErrorsByField = groupErrorsByField;
exports.extractFirstErrors = extractFirstErrors;
exports.createValidationMiddleware = createValidationMiddleware;
exports.chainValidators = chainValidators;
exports.validateRequest = validateRequest;
exports.sanitizeString = sanitizeString;
exports.sanitizeEmail = sanitizeEmail;
exports.stripHtmlTags = stripHtmlTags;
exports.sanitizeObject = sanitizeObject;
exports.normalizePhoneNumber = normalizePhoneNumber;
exports.validateWhitelist = validateWhitelist;
exports.validateBlacklist = validateBlacklist;
exports.validateArrayWhitelist = validateArrayWhitelist;
exports.validateApiKey = validateApiKey;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const uuid_1 = require("uuid");
const ajv = new ajv_1.default({ allErrors: true, removeAdditional: true });
(0, ajv_formats_1.default)(ajv);
function validateBodyExists(body) {
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
function validateRequiredFields(body, requiredFields) {
    const errors = [];
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
function validateFieldTypes(body, typeDefinitions) {
    const errors = [];
    for (const [field, expectedType] of Object.entries(typeDefinitions)) {
        if (!(field in body)) {
            continue;
        }
        const value = body[field];
        let actualType = typeof value;
        if (Array.isArray(value)) {
            actualType = 'array';
        }
        else if (value === null) {
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
function validateAllowedFields(body, allowedFields) {
    const errors = [];
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
function validateQueryParameter(paramName, paramValue, constraints) {
    const errors = [];
    if (constraints.required && (paramValue === undefined || paramValue === null || paramValue === '')) {
        errors.push({
            field: paramName,
            message: `Query parameter '${paramName}' is required`,
            code: 'PARAM_REQUIRED',
        });
        return { valid: false, errors };
    }
    if (!constraints.required && (paramValue === undefined || paramValue === null || paramValue === '')) {
        return { valid: true };
    }
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
    if (constraints.pattern && !constraints.pattern.test(String(paramValue))) {
        errors.push({
            field: paramName,
            message: `Query parameter '${paramName}' does not match required pattern`,
            code: 'INVALID_PARAM_PATTERN',
            value: paramValue,
        });
    }
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
function validatePaginationParams(query, defaults = {}) {
    const errors = [];
    const defaultPage = defaults.page || 1;
    const defaultPageSize = defaults.pageSize || 20;
    const maxPageSize = defaults.maxPageSize || 100;
    let page = defaultPage;
    let pageSize = defaultPageSize;
    if (query.page !== undefined) {
        const pageNum = parseInt(query.page, 10);
        if (isNaN(pageNum) || pageNum < 1) {
            errors.push({
                field: 'page',
                message: 'Page must be a positive integer',
                code: 'INVALID_PAGE',
                value: query.page,
            });
        }
        else {
            page = pageNum;
        }
    }
    if (query.pageSize !== undefined) {
        const pageSizeNum = parseInt(query.pageSize, 10);
        if (isNaN(pageSizeNum) || pageSizeNum < 1) {
            errors.push({
                field: 'pageSize',
                message: 'Page size must be a positive integer',
                code: 'INVALID_PAGE_SIZE',
                value: query.pageSize,
            });
        }
        else if (pageSizeNum > maxPageSize) {
            errors.push({
                field: 'pageSize',
                message: `Page size cannot exceed ${maxPageSize}`,
                code: 'PAGE_SIZE_TOO_LARGE',
                value: query.pageSize,
                constraints: { maxPageSize },
            });
        }
        else {
            pageSize = pageSizeNum;
        }
    }
    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
        parsed: errors.length === 0 ? { page, pageSize } : undefined,
    };
}
function validateSortParams(sortBy, sortOrder, allowedFields) {
    const errors = [];
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
function validateFilterParams(filters, allowedFilters) {
    const errors = [];
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
function validateUuidParam(paramName, paramValue, version) {
    if (!(0, uuid_1.validate)(paramValue)) {
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
    if (version && (0, uuid_1.version)(paramValue) !== version) {
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
function validateNumericIdParam(paramName, paramValue, options = {}) {
    const errors = [];
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
function validateSlugParam(paramName, paramValue) {
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
function validateRequiredHeaders(headers, requiredHeaders) {
    const errors = [];
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
function validateContentType(contentType, allowedTypes) {
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
function validateAuthorizationHeader(authorization, scheme = 'Bearer') {
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
function validateJsonSchema(data, schema) {
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (!valid && validate.errors) {
        const errors = validate.errors.map((error) => ({
            field: error.instancePath.replace(/^\//, '').replace(/\//g, '.') || 'root',
            message: error.message || 'Validation failed',
            code: error.keyword.toUpperCase(),
            constraints: error.params,
        }));
        return { valid: false, errors };
    }
    return { valid: true };
}
function createSchemaValidator(schema) {
    const validate = ajv.compile(schema);
    return (data) => {
        const valid = validate(data);
        if (!valid && validate.errors) {
            const errors = validate.errors.map((error) => ({
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
function validateOpenApiSchema(body, schema) {
    return validateJsonSchema(body, schema);
}
function combineSchemaValidators(validators) {
    return (data) => {
        const allErrors = [];
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
async function applyBusinessRule(data, rule) {
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
async function applyBusinessRules(data, rules) {
    const errors = [];
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
function createBusinessRule(name, validateFn, errorMessage, errorCode) {
    return {
        name,
        validate: validateFn,
        errorMessage,
        errorCode,
    };
}
async function validateUniqueness(value, checkExists, field) {
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
function validateCrossFields(data, rule) {
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
function validateDateRange(startDate, endDate, startFieldName = 'startDate', endFieldName = 'endDate') {
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
function validatePasswordConfirmation(password, confirmation) {
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
async function validateEmailUniqueness(email, checkEmailExists) {
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
async function validateUsernameUniqueness(username, checkUsernameExists) {
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
async function validateResourceExists(resourceId, checkResourceExists, resourceName = 'Resource') {
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
function formatValidationErrors(errors) {
    return {
        message: 'Validation failed',
        errors,
    };
}
function toHttpErrorFormat(result) {
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
function groupErrorsByField(errors) {
    return errors.reduce((acc, error) => {
        if (!acc[error.field]) {
            acc[error.field] = [];
        }
        acc[error.field].push(error);
        return acc;
    }, {});
}
function extractFirstErrors(errors) {
    const grouped = groupErrorsByField(errors);
    return Object.entries(grouped).reduce((acc, [field, fieldErrors]) => {
        acc[field] = fieldErrors[0].message;
        return acc;
    }, {});
}
function createValidationMiddleware(validator, target = 'body') {
    return async (req, res, next) => {
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
function chainValidators(validators, target = 'body') {
    return async (req, res, next) => {
        const data = req[target];
        const allErrors = [];
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
function validateRequest(options) {
    return async (req, res, next) => {
        const allErrors = [];
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
function sanitizeString(value, options = {}) {
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
function sanitizeEmail(email) {
    return email.trim().toLowerCase();
}
function stripHtmlTags(value) {
    return value.replace(/<[^>]*>/g, '');
}
function sanitizeObject(obj, recursive = true) {
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
        }, {});
    }
    return obj;
}
function normalizePhoneNumber(phone) {
    return phone.replace(/\D/g, '');
}
function validateWhitelist(value, whitelist, field) {
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
function validateBlacklist(value, blacklist, field) {
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
function validateArrayWhitelist(values, whitelist, field) {
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
function validateApiKey(apiKey, pattern, minLength = 32) {
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
//# sourceMappingURL=api-validation.service.js.map