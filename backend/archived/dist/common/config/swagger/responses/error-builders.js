"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBadRequestError = createBadRequestError;
exports.createUnauthorizedError = createUnauthorizedError;
exports.createForbiddenError = createForbiddenError;
exports.createNotFoundError = createNotFoundError;
exports.createConflictError = createConflictError;
exports.createGoneError = createGoneError;
exports.createUnprocessableEntityError = createUnprocessableEntityError;
exports.createTooManyRequestsError = createTooManyRequestsError;
exports.createInternalServerError = createInternalServerError;
exports.createServiceUnavailableError = createServiceUnavailableError;
const swagger_1 = require("@nestjs/swagger");
function createBadRequestError(description = 'Bad Request - Invalid input data', includeValidationDetails = true) {
    const schema = {
        type: 'object',
        properties: {
            statusCode: { type: 'integer', example: 400 },
            message: {
                oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
                example: 'Validation failed',
            },
            error: { type: 'string', example: 'Bad Request' },
        },
    };
    if (includeValidationDetails) {
        schema.properties.validationErrors = {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    field: { type: 'string', description: 'Field name' },
                    message: { type: 'string', description: 'Validation error message' },
                    constraint: { type: 'string', description: 'Validation constraint violated' },
                    value: { description: 'Invalid value provided' },
                },
            },
        };
    }
    return (0, swagger_1.ApiResponse)({
        status: 400,
        description,
        schema,
    });
}
function createUnauthorizedError(description = 'Unauthorized - Authentication required or failed', authenticateHeader) {
    const headers = {};
    if (authenticateHeader) {
        headers['WWW-Authenticate'] = {
            description: 'Authentication challenge',
            schema: { type: 'string' },
            example: authenticateHeader,
        };
    }
    return (0, swagger_1.ApiResponse)({
        status: 401,
        description,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'integer', example: 401 },
                message: { type: 'string', example: 'Unauthorized' },
                error: { type: 'string', example: 'Unauthorized' },
            },
        },
        headers,
    });
}
function createForbiddenError(description = 'Forbidden - Insufficient permissions', reason) {
    const schema = {
        type: 'object',
        properties: {
            statusCode: { type: 'integer', example: 403 },
            message: { type: 'string', example: 'Forbidden resource' },
            error: { type: 'string', example: 'Forbidden' },
        },
    };
    if (reason) {
        schema.properties.reason = { type: 'string', example: reason };
    }
    return (0, swagger_1.ApiResponse)({
        status: 403,
        description,
        schema,
    });
}
function createNotFoundError(description = 'Not Found - Resource does not exist', resourceType) {
    const schema = {
        type: 'object',
        properties: {
            statusCode: { type: 'integer', example: 404 },
            message: { type: 'string', example: `${resourceType || 'Resource'} not found` },
            error: { type: 'string', example: 'Not Found' },
        },
    };
    if (resourceType) {
        schema.properties.resourceType = { type: 'string', example: resourceType };
    }
    return (0, swagger_1.ApiResponse)({
        status: 404,
        description,
        schema,
    });
}
function createConflictError(description = 'Conflict - Resource already exists or conflicts with current state', conflictField) {
    const schema = {
        type: 'object',
        properties: {
            statusCode: { type: 'integer', example: 409 },
            message: { type: 'string', example: 'Resource conflict' },
            error: { type: 'string', example: 'Conflict' },
        },
    };
    if (conflictField) {
        schema.properties.conflictingField = { type: 'string', example: conflictField };
    }
    return (0, swagger_1.ApiResponse)({
        status: 409,
        description,
        schema,
    });
}
function createGoneError(description = 'Gone - Resource permanently removed') {
    return (0, swagger_1.ApiResponse)({
        status: 410,
        description,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'integer', example: 410 },
                message: { type: 'string', example: 'Resource no longer available' },
                error: { type: 'string', example: 'Gone' },
                deletedAt: { type: 'string', format: 'date-time', description: 'Deletion timestamp' },
            },
        },
    });
}
function createUnprocessableEntityError(description = 'Unprocessable Entity - Semantic validation failed') {
    return (0, swagger_1.ApiResponse)({
        status: 422,
        description,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'integer', example: 422 },
                message: { type: 'string', example: 'Unprocessable entity' },
                error: { type: 'string', example: 'Unprocessable Entity' },
                validationErrors: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            field: { type: 'string' },
                            message: { type: 'string' },
                            constraint: { type: 'string' },
                        },
                    },
                },
            },
        },
    });
}
function createTooManyRequestsError(description = 'Too Many Requests - Rate limit exceeded', includeRetryAfter = true) {
    const headers = {
        'X-RateLimit-Limit': {
            description: 'Request limit per time window',
            schema: { type: 'integer' },
            example: 100,
        },
        'X-RateLimit-Remaining': {
            description: 'Remaining requests in current window',
            schema: { type: 'integer' },
            example: 0,
        },
        'X-RateLimit-Reset': {
            description: 'Time when rate limit resets (Unix timestamp)',
            schema: { type: 'integer' },
            example: 1640000000,
        },
    };
    if (includeRetryAfter) {
        headers['Retry-After'] = {
            description: 'Seconds to wait before retrying',
            schema: { type: 'integer' },
            example: 60,
        };
    }
    return (0, swagger_1.ApiResponse)({
        status: 429,
        description,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'integer', example: 429 },
                message: { type: 'string', example: 'Too many requests' },
                error: { type: 'string', example: 'Too Many Requests' },
            },
        },
        headers,
    });
}
function createInternalServerError(description = 'Internal Server Error - Unexpected server error occurred', includeTrackingId = true) {
    const schema = {
        type: 'object',
        properties: {
            statusCode: { type: 'integer', example: 500 },
            message: { type: 'string', example: 'Internal server error' },
            error: { type: 'string', example: 'Internal Server Error' },
            timestamp: { type: 'string', format: 'date-time' },
            path: { type: 'string', description: 'Request path' },
        },
    };
    if (includeTrackingId) {
        schema.properties.trackingId = {
            type: 'string',
            example: 'req-12345678-1234-1234-1234-123456789012',
            description: 'Request tracking identifier',
        };
    }
    return (0, swagger_1.ApiResponse)({
        status: 500,
        description,
        schema,
    });
}
function createServiceUnavailableError(description = 'Service Unavailable - Temporary unavailability', retryAfterSeconds) {
    const headers = {};
    if (retryAfterSeconds) {
        headers['Retry-After'] = {
            description: 'Seconds to wait before retrying',
            schema: { type: 'integer' },
            example: retryAfterSeconds,
        };
    }
    return (0, swagger_1.ApiResponse)({
        status: 503,
        description,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'integer', example: 503 },
                message: { type: 'string', example: 'Service Unavailable' },
                error: { type: 'string', example: 'Service Unavailable' },
                retryAfter: { type: 'integer', description: 'Retry after seconds' },
            },
        },
        headers,
    });
}
//# sourceMappingURL=error-builders.js.map