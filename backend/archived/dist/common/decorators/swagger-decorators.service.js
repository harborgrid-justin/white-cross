"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiOperationCustom = ApiOperationCustom;
exports.ApiOperationWithAuth = ApiOperationWithAuth;
exports.ApiOperationPaginated = ApiOperationPaginated;
exports.ApiOperationAsync = ApiOperationAsync;
exports.ApiOperationBulk = ApiOperationBulk;
exports.ApiOperationConditional = ApiOperationConditional;
exports.ApiOperationCached = ApiOperationCached;
exports.ApiOperationRateLimit = ApiOperationRateLimit;
exports.ApiResponseSchema = ApiResponseSchema;
exports.ApiResponsePaginated = ApiResponsePaginated;
exports.ApiResponseArray = ApiResponseArray;
exports.ApiResponseUnion = ApiResponseUnion;
exports.ApiResponseFile = ApiResponseFile;
exports.ApiResponseStream = ApiResponseStream;
exports.ApiResponseStandardErrors = ApiResponseStandardErrors;
exports.ApiResponseConflict = ApiResponseConflict;
exports.ApiResponseUnprocessableEntity = ApiResponseUnprocessableEntity;
exports.ApiBodySchema = ApiBodySchema;
exports.ApiBodyArray = ApiBodyArray;
exports.ApiBodyPartial = ApiBodyPartial;
exports.ApiBodyMultipart = ApiBodyMultipart;
exports.ApiBodyFileUpload = ApiBodyFileUpload;
exports.ApiBodyContentNegotiation = ApiBodyContentNegotiation;
exports.ApiQueryEnum = ApiQueryEnum;
exports.ApiQueryArray = ApiQueryArray;
exports.ApiQueryPagination = ApiQueryPagination;
exports.ApiQuerySearch = ApiQuerySearch;
exports.ApiPathId = ApiPathId;
exports.ApiPathUuid = ApiPathUuid;
exports.ApiHeaderAuth = ApiHeaderAuth;
exports.ApiHeaderCustom = ApiHeaderCustom;
exports.ApiSecurityJWT = ApiSecurityJWT;
exports.ApiSecurityApiKey = ApiSecurityApiKey;
exports.ApiSecurityOAuth2 = ApiSecurityOAuth2;
exports.ApiSecurityMultiple = ApiSecurityMultiple;
exports.ApiExampleRequest = ApiExampleRequest;
exports.ApiExampleResponse = ApiExampleResponse;
exports.ApiExampleMultiple = ApiExampleMultiple;
exports.ApiDeprecated = ApiDeprecated;
exports.ApiDeprecatedWithAlternative = ApiDeprecatedWithAlternative;
exports.ApiTagsCustom = ApiTagsCustom;
exports.ApiTagsGrouped = ApiTagsGrouped;
exports.ApiTagsVersioned = ApiTagsVersioned;
exports.ApiExternalDocs = ApiExternalDocs;
exports.ApiExternalDocsMultiple = ApiExternalDocsMultiple;
exports.ApiCallback = ApiCallback;
exports.ApiCallbackMultiple = ApiCallbackMultiple;
exports.ApiWebhook = ApiWebhook;
exports.ApiWebhookSecurity = ApiWebhookSecurity;
exports.ApiDiscriminator = ApiDiscriminator;
exports.ApiDiscriminatorMapping = ApiDiscriminatorMapping;
exports.ApiSchemaOneOf = ApiSchemaOneOf;
exports.ApiSchemaAnyOf = ApiSchemaAnyOf;
exports.ApiSchemaAllOf = ApiSchemaAllOf;
exports.ApiSchemaNot = ApiSchemaNot;
exports.ApiSchemaRef = ApiSchemaRef;
exports.ApiSchemaRefCircular = ApiSchemaRefCircular;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function ApiOperationCustom(summary, description, tags, deprecated = false) {
    const decorators = [
        (0, swagger_1.ApiOperation)({ summary, description, deprecated }),
    ];
    if (tags && tags.length > 0) {
        decorators.push((0, swagger_1.ApiTags)(...tags));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function ApiOperationWithAuth(summary, description, authSchemes, scopes = []) {
    const decorators = [
        (0, swagger_1.ApiOperation)({ summary, description }),
        ...authSchemes.map(scheme => scopes.length > 0
            ? (0, swagger_1.ApiSecurity)(scheme, scopes)
            : (0, swagger_1.ApiSecurity)(scheme)),
    ];
    return (0, common_1.applyDecorators)(...decorators);
}
function ApiOperationPaginated(summary, description, responseType, options = {}) {
    const { defaultPage = 1, defaultLimit = 20, maxLimit = 100, description: paginationDesc = 'Pagination parameters' } = options;
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary, description }), (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: `Page number (default: ${defaultPage})` }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: `Items per page (default: ${defaultLimit}, max: ${maxLimit})` }), (0, swagger_1.ApiExtraModels)(responseType), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated response',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: { $ref: (0, swagger_1.getSchemaPath)(responseType) },
                },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'number' },
                        limit: { type: 'number' },
                        total: { type: 'number' },
                        totalPages: { type: 'number' },
                    },
                },
            },
        },
    }));
}
function ApiOperationAsync(summary, description, streamType = 'sse') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary,
        description: `${description}\n\nStream Type: ${streamType}`
    }), (0, swagger_1.ApiExtension)('x-stream-type', streamType), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Streaming response',
        content: {
            'text/event-stream': {
                schema: { type: 'string' }
            }
        }
    }));
}
function ApiOperationBulk(summary, description, itemType, maxItems = 1000) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary,
        description: `${description}\n\nMax items: ${maxItems}`
    }), (0, swagger_1.ApiExtraModels)(itemType), (0, swagger_1.ApiBody)({
        description: `Array of items (max: ${maxItems})`,
        schema: {
            type: 'array',
            items: { $ref: (0, swagger_1.getSchemaPath)(itemType) },
            maxItems,
        },
    }), (0, swagger_1.ApiResponse)({
        status: 207,
        description: 'Multi-Status response with individual operation results',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'number' },
                failed: { type: 'number' },
                results: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            index: { type: 'number' },
                            status: { type: 'string' },
                            data: { type: 'object' },
                            error: { type: 'string' },
                        },
                    },
                },
            },
        },
    }));
}
function ApiOperationConditional(summary, description, condition) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary,
        description: `${description}\n\nCondition: ${condition}`
    }), (0, swagger_1.ApiHeader)({
        name: 'If-Match',
        required: false,
        description: 'ETag for conditional update',
    }), (0, swagger_1.ApiHeader)({
        name: 'If-None-Match',
        required: false,
        description: 'ETag for conditional creation',
    }), (0, swagger_1.ApiResponse)({ status: 304, description: 'Not Modified - Condition not met' }), (0, swagger_1.ApiResponse)({ status: 412, description: 'Precondition Failed - Condition check failed' }));
}
function ApiOperationCached(summary, description, cacheOptions) {
    const { ttl, key, description: cacheDesc } = cacheOptions;
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary,
        description: `${description}\n\nCache TTL: ${ttl}s${key ? ` | Key: ${key}` : ''}`
    }), (0, swagger_1.ApiExtension)('x-cache-ttl', ttl), key ? (0, swagger_1.ApiExtension)('x-cache-key', key) : () => { }, (0, swagger_1.ApiHeader)({
        name: 'Cache-Control',
        required: false,
        description: 'Cache control directives',
    }), (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Response may be served from cache',
        headers: {
            'Cache-Control': {
                description: 'Cache control directives',
                schema: { type: 'string' },
            },
            'ETag': {
                description: 'Entity tag for cache validation',
                schema: { type: 'string' },
            },
        },
    }));
}
function ApiOperationRateLimit(summary, description, rateLimitOptions) {
    const { limit, window, description: rateLimitDesc } = rateLimitOptions;
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({
        summary,
        description: `${description}\n\nRate Limit: ${limit} requests per ${window}`
    }), (0, swagger_1.ApiExtension)('x-rate-limit', { limit, window }), (0, swagger_1.ApiResponse)({
        status: 429,
        description: 'Too Many Requests - Rate limit exceeded',
        headers: {
            'X-RateLimit-Limit': {
                description: 'Request limit per time window',
                schema: { type: 'number' },
            },
            'X-RateLimit-Remaining': {
                description: 'Remaining requests in current window',
                schema: { type: 'number' },
            },
            'X-RateLimit-Reset': {
                description: 'Time when rate limit resets (Unix timestamp)',
                schema: { type: 'number' },
            },
        },
    }));
}
function ApiResponseSchema(status, type, description, isArray = false) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(type), (0, swagger_1.ApiResponse)({
        status,
        description,
        schema: isArray
            ? {
                type: 'array',
                items: { $ref: (0, swagger_1.getSchemaPath)(type) },
            }
            : { $ref: (0, swagger_1.getSchemaPath)(type) },
    }));
}
function ApiResponsePaginated(type, description = 'Paginated response') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(type), (0, swagger_1.ApiResponse)({
        status: 200,
        description,
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: { $ref: (0, swagger_1.getSchemaPath)(type) },
                    description: 'Array of items for the current page',
                },
                pagination: {
                    type: 'object',
                    description: 'Pagination metadata',
                    properties: {
                        page: { type: 'number', example: 1, description: 'Current page number (1-indexed)' },
                        limit: { type: 'number', example: 20, description: 'Number of items per page' },
                        total: { type: 'number', example: 100, description: 'Total number of items across all pages' },
                        totalPages: { type: 'number', example: 5, description: 'Total number of pages' },
                        hasNextPage: { type: 'boolean', example: true, description: 'Whether there is a next page available' },
                        hasPreviousPage: { type: 'boolean', example: false, description: 'Whether there is a previous page available' },
                    },
                    required: ['page', 'limit', 'total', 'totalPages', 'hasNextPage', 'hasPreviousPage'],
                },
            },
            required: ['data', 'pagination'],
        },
    }));
}
function ApiResponseArray(type, description = 'Array response', minItems, maxItems) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(type), (0, swagger_1.ApiResponse)({
        status: 200,
        description,
        schema: {
            type: 'array',
            items: { $ref: (0, swagger_1.getSchemaPath)(type) },
            ...(minItems !== undefined && { minItems }),
            ...(maxItems !== undefined && { maxItems }),
        },
    }));
}
function ApiResponseUnion(types, description = 'Union type response', discriminatorProperty) {
    const schemas = types.map(type => ({ $ref: (0, swagger_1.getSchemaPath)(type) }));
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(...types), (0, swagger_1.ApiResponse)({
        status: 200,
        description,
        schema: {
            oneOf: schemas,
            ...(discriminatorProperty && {
                discriminator: {
                    propertyName: discriminatorProperty,
                },
            }),
        },
    }));
}
function ApiResponseFile(options) {
    const { mimeType, filename, description = 'File download' } = options;
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({
        status: 200,
        description,
        content: {
            [mimeType]: {
                schema: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
        headers: {
            'Content-Type': {
                description: 'MIME type of the file',
                schema: { type: 'string', example: mimeType },
            },
            ...(filename && {
                'Content-Disposition': {
                    description: 'File download disposition',
                    schema: { type: 'string', example: `attachment; filename="${filename}"` },
                },
            }),
        },
    }));
}
function ApiResponseStream(description = 'Streaming response', contentType = 'text/event-stream') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({
        status: 200,
        description,
        content: {
            [contentType]: {
                schema: { type: 'string' },
            },
        },
        headers: {
            'Content-Type': {
                description: 'Stream content type',
                schema: { type: 'string', example: contentType },
            },
            'Cache-Control': {
                description: 'Cache control for streaming',
                schema: { type: 'string', example: 'no-cache' },
            },
            'Connection': {
                description: 'Connection type',
                schema: { type: 'string', example: 'keep-alive' },
            },
        },
    }));
}
function ApiResponseStandardErrors() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Invalid input data',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 400 },
                message: { type: 'string', example: 'Validation failed' },
                error: { type: 'string', example: 'Bad Request' },
            },
        },
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required or failed',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 401 },
                message: { type: 'string', example: 'Unauthorized' },
            },
        },
    }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 403 },
                message: { type: 'string', example: 'Forbidden resource' },
            },
        },
    }), (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not Found - Resource does not exist',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 404 },
                message: { type: 'string', example: 'Resource not found' },
            },
        },
    }), (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal Server Error - Unexpected server error',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 500 },
                message: { type: 'string', example: 'Internal server error' },
                timestamp: { type: 'string', format: 'date-time' },
            },
        },
    }));
}
function ApiResponseConflict(description = 'Conflict - Resource already exists or conflicts with current state') {
    return (0, swagger_1.ApiResponse)({
        status: 409,
        description,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 409 },
                message: { type: 'string', example: 'Resource conflict' },
                error: { type: 'string', example: 'Conflict' },
                conflictingField: { type: 'string', example: 'email', description: 'Field causing the conflict' },
            },
        },
    });
}
function ApiResponseUnprocessableEntity(description = 'Unprocessable Entity - Semantic validation failed') {
    return (0, swagger_1.ApiResponse)({
        status: 422,
        description,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 422 },
                message: { type: 'string', example: 'Unprocessable entity' },
                error: { type: 'string', example: 'Unprocessable Entity' },
                validationErrors: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            field: { type: 'string', example: 'orderDate' },
                            message: { type: 'string', example: 'Order date cannot be in the past' },
                            constraint: { type: 'string', example: 'futureDate' },
                        },
                    },
                },
            },
        },
    });
}
function ApiBodySchema(type, description = 'Request body', required = true) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(type), (0, swagger_1.ApiBody)({
        description,
        type,
        required,
    }));
}
function ApiBodyArray(type, description = 'Array request body', minItems = 1, maxItems = 1000) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(type), (0, swagger_1.ApiBody)({
        description: `${description} (min: ${minItems}, max: ${maxItems})`,
        schema: {
            type: 'array',
            items: { $ref: (0, swagger_1.getSchemaPath)(type) },
            minItems,
            maxItems,
        },
    }));
}
function ApiBodyPartial(type, description = 'Partial update body') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(type), (0, swagger_1.ApiBody)({
        description: `${description} (all fields optional)`,
        schema: {
            allOf: [
                { $ref: (0, swagger_1.getSchemaPath)(type) },
            ],
            properties: {},
            required: [],
        },
    }));
}
function ApiBodyMultipart(fields, description = 'Multipart form data') {
    const properties = {};
    Object.entries(fields).forEach(([name, type]) => {
        if (type === 'binary') {
            properties[name] = {
                type: 'string',
                format: 'binary',
                description: `Binary file data for field '${name}'`
            };
        }
        else if (type === 'array') {
            properties[name] = {
                type: 'array',
                items: { type: 'string' },
                description: `Array of values for field '${name}'`
            };
        }
        else {
            properties[name] = { type, description: `${type} value for field '${name}'` };
        }
    });
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBody)({
        description,
        schema: {
            type: 'object',
            properties,
        },
    }));
}
function ApiBodyFileUpload(fieldName = 'file', options = {}) {
    const { maxSize, allowedMimeTypes, description = 'File upload', required = true } = options;
    const constraints = [];
    if (maxSize) {
        constraints.push(`Max size: ${(maxSize / 1024 / 1024).toFixed(2)}MB`);
    }
    if (allowedMimeTypes && allowedMimeTypes.length > 0) {
        constraints.push(`Allowed types: ${allowedMimeTypes.join(', ')}`);
    }
    const fullDescription = constraints.length > 0
        ? `${description} | ${constraints.join(' | ')}`
        : description;
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBody)({
        description: fullDescription,
        required,
        schema: {
            type: 'object',
            properties: {
                [fieldName]: {
                    type: 'string',
                    format: 'binary',
                    description: fullDescription,
                },
            },
            ...(required && { required: [fieldName] }),
        },
    }));
}
function ApiBodyContentNegotiation(contentTypes, schemas, description = 'Request body with content negotiation') {
    const content = {};
    contentTypes.forEach(type => {
        if (schemas[type]) {
            content[type] = { schema: schemas[type] };
        }
    });
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBody)({
        description: `${description} | Supported: ${contentTypes.join(', ')}`,
        content,
    }));
}
function ApiQueryEnum(name, enumType, description = '', required = false) {
    return (0, swagger_1.ApiQuery)({
        name,
        enum: enumType,
        description: `${description} | Possible values: ${Object.values(enumType).join(', ')}`,
        required,
    });
}
function ApiQueryArray(name, description = '', required = false, itemType = 'string') {
    return (0, swagger_1.ApiQuery)({
        name,
        description: `${description} (comma-separated values)`,
        required,
        type: 'array',
        items: { type: itemType },
        style: 'form',
        explode: false,
    });
}
function ApiQueryPagination(options = {}) {
    const { defaultPage = 1, defaultLimit = 20, maxLimit = 100, } = options;
    return (0, common_1.applyDecorators)((0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: `Page number (default: ${defaultPage})`,
        example: defaultPage,
    }), (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: `Items per page (default: ${defaultLimit}, max: ${maxLimit})`,
        example: defaultLimit,
    }), (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        required: false,
        type: String,
        description: 'Field to sort by',
    }), (0, swagger_1.ApiQuery)({
        name: 'sortOrder',
        required: false,
        enum: ['asc', 'desc'],
        description: 'Sort order',
    }));
}
function ApiQuerySearch(searchFields, description = 'Search query') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiQuery)({
        name: 'q',
        required: false,
        type: String,
        description: `${description} | Searches in: ${searchFields.join(', ')}`,
    }), (0, swagger_1.ApiQuery)({
        name: 'searchFields',
        required: false,
        type: 'array',
        items: { type: 'string', enum: searchFields },
        description: 'Specific fields to search in',
    }));
}
function ApiPathId(name = 'id', description = 'Resource ID', format = 'uuid') {
    const schema = {};
    if (format === 'uuid') {
        schema.type = 'string';
        schema.format = 'uuid';
        schema.pattern = '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
    }
    else if (format === 'number') {
        schema.type = 'integer';
        schema.minimum = 1;
    }
    else {
        schema.type = 'string';
    }
    return (0, swagger_1.ApiParam)({
        name,
        description,
        schema,
    });
}
function ApiPathUuid(name, description = 'UUID parameter') {
    return (0, swagger_1.ApiParam)({
        name,
        description,
        schema: {
            type: 'string',
            format: 'uuid',
            pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
        },
    });
}
function ApiHeaderAuth(scheme = 'Bearer', description = 'Authentication header') {
    return (0, swagger_1.ApiHeader)({
        name: 'Authorization',
        description: `${description} | Format: ${scheme} <token>`,
        required: true,
        schema: {
            type: 'string',
            example: `${scheme} eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`,
        },
    });
}
function ApiHeaderCustom(name, description, required = false, example) {
    return (0, swagger_1.ApiHeader)({
        name,
        description,
        required,
        schema: {
            type: 'string',
            ...(example && { example }),
        },
    });
}
function ApiSecurityJWT(scopes = []) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('bearer', scopes), ApiHeaderAuth('Bearer', 'JWT authentication token'), (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Invalid or missing token' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Insufficient permissions' }));
}
function ApiSecurityApiKey(location = 'header', name = 'X-API-Key') {
    const decorators = [
        (0, swagger_1.ApiSecurity)('api_key'),
        (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Invalid or missing API key' }),
    ];
    if (location === 'header') {
        decorators.push((0, swagger_1.ApiHeader)({ name, description: 'API Key', required: true }));
    }
    else if (location === 'query') {
        decorators.push((0, swagger_1.ApiQuery)({ name, description: 'API Key', required: true }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function ApiSecurityOAuth2(scopes, flow = 'authorizationCode') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('oauth2', scopes), (0, swagger_1.ApiExtension)('x-oauth2-flow', flow), (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - OAuth2 authentication failed' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Insufficient OAuth2 scopes' }));
}
function ApiSecurityMultiple(schemes) {
    const decorators = schemes.map(scheme => (0, swagger_1.ApiSecurity)(scheme.name, scheme.scopes || []));
    decorators.push((0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Authentication required' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Insufficient permissions' }));
    return (0, common_1.applyDecorators)(...decorators);
}
function ApiExampleRequest(example, summary = 'Example request', description = '') {
    return (0, swagger_1.ApiExtension)('x-request-example', {
        summary,
        description,
        value: example,
    });
}
function ApiExampleResponse(status, example, summary = 'Example response', description = '') {
    return (0, swagger_1.ApiExtension)(`x-response-example-${status}`, {
        summary,
        description,
        value: example,
    });
}
function ApiExampleMultiple(examples) {
    const decorators = examples.map((example, index) => (0, swagger_1.ApiExtension)(`x-example-${index}`, {
        summary: example.summary,
        description: example.description,
        value: example.value,
    }));
    return (0, common_1.applyDecorators)(...decorators);
}
function ApiDeprecated(reason, sunsetDate) {
    const decorators = [
        (0, swagger_1.ApiOperation)({ deprecated: true }),
        (0, swagger_1.ApiExtension)('x-deprecation-reason', reason),
    ];
    if (sunsetDate) {
        decorators.push((0, swagger_1.ApiExtension)('x-sunset-date', sunsetDate));
        decorators.push((0, swagger_1.ApiHeader)({
            name: 'Sunset',
            required: false,
            description: 'Date when this endpoint will be removed',
            schema: { type: 'string', example: sunsetDate },
        }));
    }
    decorators.push((0, swagger_1.ApiResponse)({
        status: 299,
        description: `Deprecated - ${reason}`,
        headers: {
            'Deprecation': {
                description: 'Indicates that the endpoint is deprecated',
                schema: { type: 'string', example: 'true' },
            },
            'Link': {
                description: 'Link to alternative endpoint',
                schema: { type: 'string' },
            },
        },
    }));
    return (0, common_1.applyDecorators)(...decorators);
}
function ApiDeprecatedWithAlternative(alternativeEndpoint, reason, sunsetDate) {
    const decorators = [
        (0, swagger_1.ApiOperation)({
            deprecated: true,
            description: `**DEPRECATED**: ${reason}\n\nUse \`${alternativeEndpoint}\` instead.`
        }),
        (0, swagger_1.ApiExtension)('x-deprecation-reason', reason),
        (0, swagger_1.ApiExtension)('x-alternative-endpoint', alternativeEndpoint),
    ];
    if (sunsetDate) {
        decorators.push((0, swagger_1.ApiExtension)('x-sunset-date', sunsetDate));
    }
    decorators.push((0, swagger_1.ApiResponse)({
        status: 299,
        description: `Deprecated - ${reason}`,
        headers: {
            'Deprecation': {
                description: 'Indicates that the endpoint is deprecated',
                schema: { type: 'string', example: 'true' },
            },
            'Link': {
                description: 'Link to alternative endpoint',
                schema: { type: 'string', example: `<${alternativeEndpoint}>; rel="alternate"` },
            },
            ...(sunsetDate && {
                'Sunset': {
                    description: 'Date when this endpoint will be removed',
                    schema: { type: 'string', example: sunsetDate },
                },
            }),
        },
    }));
    return (0, common_1.applyDecorators)(...decorators);
}
function ApiTagsCustom(tags, description, externalDocs) {
    const decorators = [(0, swagger_1.ApiTags)(...tags)];
    if (description || externalDocs) {
        decorators.push((0, swagger_1.ApiExtension)('x-tags-metadata', {
            tags,
            description,
            externalDocs,
        }));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function ApiTagsGrouped(group, tags, priority = 0) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)(...tags), (0, swagger_1.ApiExtension)('x-tag-group', {
        name: group,
        tags,
        priority,
    }));
}
function ApiTagsVersioned(tags, version) {
    const versionedTags = tags.map(tag => `${version}/${tag}`);
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)(...versionedTags), (0, swagger_1.ApiExtension)('x-api-version', version), (0, swagger_1.ApiExtension)('x-original-tags', tags));
}
function ApiExternalDocs(url, description = 'External documentation') {
    return (0, swagger_1.ApiExtension)('x-external-docs', {
        description,
        url,
    });
}
function ApiExternalDocsMultiple(docs) {
    return (0, swagger_1.ApiExtension)('x-external-docs-multiple', docs);
}
function ApiCallback(name, url, method, requestBody) {
    const callback = {
        [url]: {
            [method]: {
                description: `${name} callback`,
                ...(requestBody && {
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: { $ref: (0, swagger_1.getSchemaPath)(requestBody) },
                            },
                        },
                    },
                }),
            },
        },
    };
    const decorators = [
        (0, swagger_1.ApiExtension)('x-callback', { name, callback }),
    ];
    if (requestBody) {
        decorators.push((0, swagger_1.ApiExtraModels)(requestBody));
    }
    return (0, common_1.applyDecorators)(...decorators);
}
function ApiCallbackMultiple(callbacks) {
    const decorators = callbacks.flatMap(callback => {
        const decs = [
            (0, swagger_1.ApiExtension)(`x-callback-${callback.name}`, {
                url: callback.url,
                method: callback.method,
            }),
        ];
        if (callback.requestBody) {
            decs.push((0, swagger_1.ApiExtraModels)(callback.requestBody));
        }
        return decs;
    });
    return (0, common_1.applyDecorators)(...decorators);
}
function ApiWebhook(name, method, payloadType, description = '') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtension)('x-webhook', {
        name,
        method,
        description,
    }), (0, swagger_1.ApiExtraModels)(payloadType), (0, swagger_1.ApiBody)({
        description: `${name} webhook payload`,
        type: payloadType,
    }));
}
function ApiWebhookSecurity(name, payloadType, signatureHeader = 'X-Webhook-Signature', algorithm = 'HMAC-SHA256') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtension)('x-webhook-security', {
        name,
        signatureHeader,
        algorithm,
    }), (0, swagger_1.ApiExtraModels)(payloadType), (0, swagger_1.ApiHeader)({
        name: signatureHeader,
        description: `Webhook signature for verification (${algorithm})`,
        required: true,
    }), (0, swagger_1.ApiBody)({
        description: `${name} webhook payload`,
        type: payloadType,
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid webhook signature',
    }));
}
function ApiDiscriminator(propertyName, types) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(...types), (0, swagger_1.ApiExtension)('x-discriminator', {
        propertyName,
        mapping: types.reduce((acc, type) => {
            acc[type.name] = (0, swagger_1.getSchemaPath)(type);
            return acc;
        }, {}),
    }));
}
function ApiDiscriminatorMapping(propertyName, mapping, types) {
    const schemaMapping = {};
    Object.entries(mapping).forEach(([key, type]) => {
        schemaMapping[key] = (0, swagger_1.getSchemaPath)(type);
    });
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(...types), (0, swagger_1.ApiExtension)('x-discriminator', {
        propertyName,
        mapping: schemaMapping,
    }));
}
function ApiSchemaOneOf(types, discriminator) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(...types), (0, swagger_1.ApiExtension)('x-schema-composition', {
        type: 'oneOf',
        schemas: types.map(type => (0, swagger_1.getSchemaPath)(type)),
        ...(discriminator && { discriminator: { propertyName: discriminator } }),
    }));
}
function ApiSchemaAnyOf(types) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(...types), (0, swagger_1.ApiExtension)('x-schema-composition', {
        type: 'anyOf',
        schemas: types.map(type => (0, swagger_1.getSchemaPath)(type)),
    }));
}
function ApiSchemaAllOf(types) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(...types), (0, swagger_1.ApiExtension)('x-schema-composition', {
        type: 'allOf',
        schemas: types.map(type => (0, swagger_1.getSchemaPath)(type)),
    }));
}
function ApiSchemaNot(type) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(type), (0, swagger_1.ApiExtension)('x-schema-composition', {
        type: 'not',
        schema: (0, swagger_1.getSchemaPath)(type),
    }));
}
function ApiSchemaRef(type, description = '') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(type), (0, swagger_1.ApiExtension)('x-schema-ref', {
        $ref: (0, swagger_1.getSchemaPath)(type),
        description,
    }));
}
function ApiSchemaRefCircular(type, propertyName) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(type), (0, swagger_1.ApiExtension)('x-circular-reference', {
        schema: (0, swagger_1.getSchemaPath)(type),
        property: propertyName,
        description: `Circular reference on property '${propertyName}'`,
    }));
}
//# sourceMappingURL=swagger-decorators.service.js.map