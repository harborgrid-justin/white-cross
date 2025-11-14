"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUuidPathParam = createUuidPathParam;
exports.createIntegerPathParam = createIntegerPathParam;
exports.createStringPathParam = createStringPathParam;
exports.createEnumPathParam = createEnumPathParam;
exports.createDatePathParam = createDatePathParam;
exports.createSlugPathParam = createSlugPathParam;
exports.createVersionPathParam = createVersionPathParam;
exports.createCompositePathParams = createCompositePathParams;
exports.createPaginationQueryParams = createPaginationQueryParams;
exports.createSortingQueryParams = createSortingQueryParams;
exports.createSearchQueryParam = createSearchQueryParam;
exports.createFilterQueryParams = createFilterQueryParams;
exports.createDateRangeQueryParams = createDateRangeQueryParams;
exports.createArrayQueryParam = createArrayQueryParam;
exports.createBooleanQueryParam = createBooleanQueryParam;
exports.createEnumQueryParam = createEnumQueryParam;
exports.createRangeQueryParam = createRangeQueryParam;
exports.createFieldsQueryParam = createFieldsQueryParam;
exports.createApiKeyHeader = createApiKeyHeader;
exports.createAuthorizationHeader = createAuthorizationHeader;
exports.createRequestIdHeader = createRequestIdHeader;
exports.createContentTypeHeader = createContentTypeHeader;
exports.createAcceptHeader = createAcceptHeader;
exports.createAcceptLanguageHeader = createAcceptLanguageHeader;
exports.createETagHeader = createETagHeader;
exports.createUserAgentHeader = createUserAgentHeader;
exports.createSessionCookie = createSessionCookie;
exports.createAuthTokenCookie = createAuthTokenCookie;
exports.createCsrfTokenCookie = createCsrfTokenCookie;
exports.createPreferenceCookie = createPreferenceCookie;
exports.createTrackingCookie = createTrackingCookie;
exports.createConsentCookie = createConsentCookie;
exports.createValidatedStringParam = createValidatedStringParam;
exports.createValidatedNumberParam = createValidatedNumberParam;
exports.createValidatedArrayParam = createValidatedArrayParam;
exports.createConditionalParam = createConditionalParam;
exports.createMutuallyExclusiveParams = createMutuallyExclusiveParams;
exports.createDependentParams = createDependentParams;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function createUuidPathParam(name = 'id', description = 'UUID identifier', required = true) {
    return (0, swagger_1.ApiParam)({
        name,
        description,
        required,
        schema: {
            type: 'string',
            format: 'uuid',
            pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
            example: '123e4567-e89b-12d3-a456-426614174000',
        },
    });
}
function createIntegerPathParam(name, description, minimum, maximum) {
    const schema = {
        type: 'integer',
        example: minimum || 1,
    };
    if (minimum !== undefined)
        schema.minimum = minimum;
    if (maximum !== undefined)
        schema.maximum = maximum;
    return (0, swagger_1.ApiParam)({
        name,
        description,
        required: true,
        schema,
    });
}
function createStringPathParam(name, description, pattern, example) {
    const schema = {
        type: 'string',
        ...(example && { example }),
    };
    if (pattern)
        schema.pattern = pattern;
    return (0, swagger_1.ApiParam)({
        name,
        description,
        required: true,
        schema,
    });
}
function createEnumPathParam(name, enumValues, description) {
    return (0, swagger_1.ApiParam)({
        name,
        description: `${description} | Allowed values: ${enumValues.join(', ')}`,
        required: true,
        schema: {
            type: typeof enumValues[0],
            enum: enumValues,
            example: enumValues[0],
        },
    });
}
function createDatePathParam(name, description, format = 'date') {
    return (0, swagger_1.ApiParam)({
        name,
        description,
        required: true,
        schema: {
            type: 'string',
            format,
            example: format === 'date' ? '2024-01-15' : '2024-01-15T10:30:00Z',
        },
    });
}
function createSlugPathParam(name, description) {
    return (0, swagger_1.ApiParam)({
        name,
        description,
        required: true,
        schema: {
            type: 'string',
            pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
            example: 'my-article-slug',
        },
    });
}
function createVersionPathParam(name, supportedVersions, description = 'API version') {
    return (0, swagger_1.ApiParam)({
        name,
        description: `${description} | Supported: ${supportedVersions.join(', ')}`,
        required: true,
        schema: {
            type: 'string',
            enum: supportedVersions,
            pattern: '^v\\d+$',
            example: supportedVersions[supportedVersions.length - 1],
        },
    });
}
function createCompositePathParams(parameters) {
    const decorators = parameters.map(param => (0, swagger_1.ApiParam)({
        name: param.name,
        description: param.description,
        required: param.required !== false,
        schema: param.schema,
        ...(param.example && { example: param.example }),
        ...(param.deprecated && { deprecated: param.deprecated }),
    }));
    return (0, common_1.applyDecorators)(...decorators);
}
function createPaginationQueryParams(defaultPage = 1, defaultLimit = 20, maxLimit = 100) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: `Page number (default: ${defaultPage})`,
        schema: {
            type: 'integer',
            minimum: 1,
            default: defaultPage,
            example: defaultPage,
        },
    }), (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: `Items per page (default: ${defaultLimit}, max: ${maxLimit})`,
        schema: {
            type: 'integer',
            minimum: 1,
            maximum: maxLimit,
            default: defaultLimit,
            example: defaultLimit,
        },
    }));
}
function createSortingQueryParams(allowedFields, defaultField) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiQuery)({
        name: 'sortBy',
        required: false,
        type: String,
        description: `Field to sort by | Allowed: ${allowedFields.join(', ')}`,
        schema: {
            type: 'string',
            enum: allowedFields,
            ...(defaultField && { default: defaultField, example: defaultField }),
        },
    }), (0, swagger_1.ApiQuery)({
        name: 'sortOrder',
        required: false,
        type: String,
        description: 'Sort order',
        schema: {
            type: 'string',
            enum: ['asc', 'desc'],
            default: 'asc',
            example: 'asc',
        },
    }));
}
function createSearchQueryParam(searchableFields, minLength = 2) {
    return (0, swagger_1.ApiQuery)({
        name: 'q',
        required: false,
        type: String,
        description: `Search query | Searches in: ${searchableFields.join(', ')}`,
        schema: {
            type: 'string',
            minLength,
            example: 'search term',
        },
    });
}
function createFilterQueryParams(filters) {
    const decorators = Object.entries(filters).map(([name, config]) => {
        const schema = { type: config.type };
        if (config.enum)
            schema.enum = config.enum;
        if (config.minimum !== undefined)
            schema.minimum = config.minimum;
        if (config.maximum !== undefined)
            schema.maximum = config.maximum;
        return (0, swagger_1.ApiQuery)({
            name,
            required: false,
            description: `Filter by ${name}`,
            schema,
        });
    });
    return (0, common_1.applyDecorators)(...decorators);
}
function createDateRangeQueryParams(startName = 'startDate', endName = 'endDate', format = 'date') {
    const example = format === 'date' ? '2024-01-01' : '2024-01-01T00:00:00Z';
    return (0, common_1.applyDecorators)((0, swagger_1.ApiQuery)({
        name: startName,
        required: false,
        type: String,
        description: 'Start date for range filter',
        schema: {
            type: 'string',
            format,
            example,
        },
    }), (0, swagger_1.ApiQuery)({
        name: endName,
        required: false,
        type: String,
        description: 'End date for range filter',
        schema: {
            type: 'string',
            format,
            example,
        },
    }));
}
function createArrayQueryParam(name, itemType, description, required = false) {
    return (0, swagger_1.ApiQuery)({
        name,
        required,
        type: [itemType === 'string' ? String : itemType === 'number' ? Number : Boolean],
        description: `${description} (comma-separated)`,
        schema: {
            type: 'array',
            items: { type: itemType },
        },
        style: 'form',
        explode: false,
    });
}
function createBooleanQueryParam(name, description, defaultValue) {
    return (0, swagger_1.ApiQuery)({
        name,
        required: false,
        type: Boolean,
        description,
        schema: {
            type: 'boolean',
            ...(defaultValue !== undefined && { default: defaultValue }),
            example: defaultValue !== undefined ? defaultValue : true,
        },
    });
}
function createEnumQueryParam(name, enumValues, description, required = false) {
    return (0, swagger_1.ApiQuery)({
        name,
        required,
        description: `${description} | Allowed: ${enumValues.join(', ')}`,
        schema: {
            type: typeof enumValues[0],
            enum: enumValues,
            example: enumValues[0],
        },
    });
}
function createRangeQueryParam(name, description, minValue, maxValue) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiQuery)({
        name: `min${name.charAt(0).toUpperCase() + name.slice(1)}`,
        required: false,
        type: Number,
        description: `Minimum ${description}`,
        schema: {
            type: 'number',
            ...(minValue !== undefined && { minimum: minValue }),
            ...(maxValue !== undefined && { maximum: maxValue }),
        },
    }), (0, swagger_1.ApiQuery)({
        name: `max${name.charAt(0).toUpperCase() + name.slice(1)}`,
        required: false,
        type: Number,
        description: `Maximum ${description}`,
        schema: {
            type: 'number',
            ...(minValue !== undefined && { minimum: minValue }),
            ...(maxValue !== undefined && { maximum: maxValue }),
        },
    }));
}
function createFieldsQueryParam(availableFields, description = 'Fields to include in response') {
    return (0, swagger_1.ApiQuery)({
        name: 'fields',
        required: false,
        type: String,
        description: `${description} | Available: ${availableFields.join(', ')}`,
        schema: {
            type: 'string',
            pattern: `^(${availableFields.join('|')})(,(${availableFields.join('|')}))*$`,
            example: availableFields.slice(0, 3).join(','),
        },
    });
}
function createApiKeyHeader(headerName = 'X-API-Key', description = 'API authentication key', required = true) {
    return (0, swagger_1.ApiHeader)({
        name: headerName,
        description,
        required,
        schema: {
            type: 'string',
            example: 'your-api-key-here',
        },
    });
}
function createAuthorizationHeader(scheme = 'Bearer', description = 'Authentication token') {
    return (0, swagger_1.ApiHeader)({
        name: 'Authorization',
        description: `${description} | Format: ${scheme} <token>`,
        required: true,
        schema: {
            type: 'string',
            pattern: `^${scheme} .+$`,
            example: `${scheme} eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`,
        },
    });
}
function createRequestIdHeader(headerName = 'X-Request-ID', required = false) {
    return (0, swagger_1.ApiHeader)({
        name: headerName,
        description: 'Unique request identifier for tracking',
        required,
        schema: {
            type: 'string',
            format: 'uuid',
            example: '123e4567-e89b-12d3-a456-426614174000',
        },
    });
}
function createContentTypeHeader(allowedTypes = ['application/json']) {
    return (0, swagger_1.ApiHeader)({
        name: 'Content-Type',
        description: `Request content type | Allowed: ${allowedTypes.join(', ')}`,
        required: true,
        schema: {
            type: 'string',
            enum: allowedTypes,
            example: allowedTypes[0],
        },
    });
}
function createAcceptHeader(supportedTypes = ['application/json']) {
    return (0, swagger_1.ApiHeader)({
        name: 'Accept',
        description: `Desired response content type | Supported: ${supportedTypes.join(', ')}`,
        required: false,
        schema: {
            type: 'string',
            enum: supportedTypes,
            example: supportedTypes[0],
        },
    });
}
function createAcceptLanguageHeader(supportedLanguages = ['en-US']) {
    return (0, swagger_1.ApiHeader)({
        name: 'Accept-Language',
        description: `Preferred language | Supported: ${supportedLanguages.join(', ')}`,
        required: false,
        schema: {
            type: 'string',
            enum: supportedLanguages,
            example: supportedLanguages[0],
        },
    });
}
function createETagHeader(required = false) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiHeader)({
        name: 'If-Match',
        description: 'ETag for conditional update (optimistic locking)',
        required,
        schema: {
            type: 'string',
            pattern: '^"?[a-zA-Z0-9]+"?$',
            example: '"33a64df551425fcc"',
        },
    }), (0, swagger_1.ApiHeader)({
        name: 'If-None-Match',
        description: 'ETag for conditional GET (cache validation)',
        required: false,
        schema: {
            type: 'string',
            pattern: '^"?[a-zA-Z0-9]+"?$',
            example: '"33a64df551425fcc"',
        },
    }));
}
function createUserAgentHeader(required = false) {
    return (0, swagger_1.ApiHeader)({
        name: 'User-Agent',
        description: 'Client user agent string',
        required,
        schema: {
            type: 'string',
            example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
    });
}
function createSessionCookie(cookieName = 'sessionid', description = 'Session identifier', required = true) {
    return (0, swagger_1.ApiExtension)('x-cookie-param', {
        name: cookieName,
        description,
        required,
        schema: {
            type: 'string',
            format: 'uuid',
        },
        in: 'cookie',
    });
}
function createAuthTokenCookie(cookieName = 'auth_token', description = 'Authentication token') {
    return (0, swagger_1.ApiExtension)('x-cookie-param', {
        name: cookieName,
        description,
        required: true,
        schema: {
            type: 'string',
        },
        in: 'cookie',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });
}
function createCsrfTokenCookie(cookieName = 'csrf_token') {
    return (0, swagger_1.ApiExtension)('x-cookie-param', {
        name: cookieName,
        description: 'CSRF protection token',
        required: true,
        schema: {
            type: 'string',
            pattern: '^[a-zA-Z0-9-_]{32,}$',
        },
        in: 'cookie',
    });
}
function createPreferenceCookie(cookieName, description) {
    return (0, swagger_1.ApiExtension)('x-cookie-param', {
        name: cookieName,
        description,
        required: false,
        schema: {
            type: 'string',
        },
        in: 'cookie',
    });
}
function createTrackingCookie(cookieName, description) {
    return (0, swagger_1.ApiExtension)('x-cookie-param', {
        name: cookieName,
        description,
        required: false,
        schema: {
            type: 'string',
            format: 'uuid',
        },
        in: 'cookie',
    });
}
function createConsentCookie(cookieName = 'cookie_consent') {
    return (0, swagger_1.ApiExtension)('x-cookie-param', {
        name: cookieName,
        description: 'Cookie consent preferences',
        required: false,
        schema: {
            type: 'string',
            enum: ['accepted', 'rejected', 'partial'],
        },
        in: 'cookie',
    });
}
function createValidatedStringParam(name, location, validation) {
    const schema = {
        type: 'string',
        ...(validation.minLength && { minLength: validation.minLength }),
        ...(validation.maxLength && { maxLength: validation.maxLength }),
        ...(validation.pattern && { pattern: validation.pattern }),
        ...(validation.format && { format: validation.format }),
        ...(validation.enum && { enum: validation.enum }),
    };
    const decorator = location === 'path' ? swagger_1.ApiParam : location === 'query' ? swagger_1.ApiQuery : swagger_1.ApiHeader;
    return decorator({
        name,
        required: location === 'path',
        schema,
    });
}
function createValidatedNumberParam(name, location, validation) {
    const schema = {
        type: 'number',
        ...(validation.minimum !== undefined && { minimum: validation.minimum }),
        ...(validation.maximum !== undefined && { maximum: validation.maximum }),
    };
    const decorator = location === 'path' ? swagger_1.ApiParam : location === 'query' ? swagger_1.ApiQuery : swagger_1.ApiHeader;
    return decorator({
        name,
        required: location === 'path',
        schema,
    });
}
function createValidatedArrayParam(name, itemType, validation) {
    const schema = {
        type: 'array',
        items: {
            type: itemType,
            ...(validation.pattern && { pattern: validation.pattern }),
            ...(validation.enum && { enum: validation.enum }),
        },
    };
    return (0, swagger_1.ApiQuery)({
        name,
        required: false,
        schema,
        style: 'form',
        explode: false,
    });
}
function createConditionalParam(name, condition, validation) {
    const schema = {
        type: 'string',
        description: `Conditionally required: ${condition}`,
        ...(validation.format && { format: validation.format }),
        ...(validation.pattern && { pattern: validation.pattern }),
    };
    return (0, common_1.applyDecorators)((0, swagger_1.ApiQuery)({
        name,
        required: false,
        schema,
    }), (0, swagger_1.ApiExtension)('x-conditional-param', {
        name,
        condition,
    }));
}
function createMutuallyExclusiveParams(paramNames, description) {
    const decorators = paramNames.map(name => (0, swagger_1.ApiQuery)({
        name,
        required: false,
        type: String,
        description: `${description} (mutually exclusive with: ${paramNames.filter(p => p !== name).join(', ')})`,
    }));
    return (0, common_1.applyDecorators)(...decorators, (0, swagger_1.ApiExtension)('x-mutually-exclusive', {
        parameters: paramNames,
        description,
    }));
}
function createDependentParams(primaryParam, dependentParams) {
    const decorators = [
        (0, swagger_1.ApiQuery)({
            name: primaryParam,
            required: false,
            type: Boolean,
            description: `Enable advanced mode (requires: ${dependentParams.join(', ')})`,
        }),
        ...dependentParams.map(name => (0, swagger_1.ApiQuery)({
            name,
            required: false,
            type: String,
            description: `Required when ${primaryParam} is enabled`,
        })),
    ];
    return (0, common_1.applyDecorators)(...decorators, (0, swagger_1.ApiExtension)('x-dependent-params', {
        primary: primaryParam,
        dependent: dependentParams,
    }));
}
//# sourceMappingURL=swagger-parameter-decorators.service.js.map