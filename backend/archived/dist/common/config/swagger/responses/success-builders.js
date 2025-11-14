"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSuccessResponse = createSuccessResponse;
exports.createCreatedResponse = createCreatedResponse;
exports.createAcceptedResponse = createAcceptedResponse;
exports.createNoContentResponse = createNoContentResponse;
exports.createPartialContentResponse = createPartialContentResponse;
exports.createMultiStatusResponse = createMultiStatusResponse;
exports.createNotModifiedResponse = createNotModifiedResponse;
exports.createSuccessResponseWithHeaders = createSuccessResponseWithHeaders;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function createSuccessResponse(type, description = 'Successful operation', isArray = false) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(type), (0, swagger_1.ApiResponse)({
        status: 200,
        description,
        schema: isArray
            ? {
                type: 'array',
                items: { $ref: (0, swagger_1.getSchemaPath)(type) },
            }
            : { $ref: (0, swagger_1.getSchemaPath)(type) },
    }));
}
function createCreatedResponse(type, description = 'Resource created successfully', locationHeader = true) {
    const headers = {};
    if (locationHeader) {
        headers['Location'] = {
            description: 'URI of the created resource',
            schema: { type: 'string', format: 'uri' },
            example: '/api/v1/users/123e4567-e89b-12d3-a456-426614174000',
        };
    }
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(type), (0, swagger_1.ApiResponse)({
        status: 201,
        description,
        schema: { $ref: (0, swagger_1.getSchemaPath)(type) },
        headers,
    }));
}
function createAcceptedResponse(description = 'Request accepted for processing', statusUrl = true) {
    const schema = {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: description },
            jobId: { type: 'string', format: 'uuid', description: 'Background job identifier' },
        },
    };
    if (statusUrl) {
        schema.properties.statusUrl = {
            type: 'string',
            format: 'uri',
            description: 'URL to check job status',
            example: '/api/v1/jobs/123e4567-e89b-12d3-a456-426614174000/status',
        };
    }
    return (0, swagger_1.ApiResponse)({
        status: 202,
        description,
        schema,
    });
}
function createNoContentResponse(description = 'Successful operation with no content') {
    return (0, swagger_1.ApiResponse)({
        status: 204,
        description,
    });
}
function createPartialContentResponse(type, description = 'Partial content') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(type), (0, swagger_1.ApiResponse)({
        status: 206,
        description,
        schema: { $ref: (0, swagger_1.getSchemaPath)(type) },
        headers: {
            'Content-Range': {
                description: 'Range of returned content',
                schema: { type: 'string' },
                example: 'bytes 0-1023/2048',
            },
            'Accept-Ranges': {
                description: 'Unit of ranges accepted',
                schema: { type: 'string' },
                example: 'bytes',
            },
        },
    }));
}
function createMultiStatusResponse(type, description = 'Multi-status response with individual operation results') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(type), (0, swagger_1.ApiResponse)({
        status: 207,
        description,
        schema: {
            type: 'object',
            properties: {
                success: { type: 'integer', description: 'Number of successful operations' },
                failed: { type: 'integer', description: 'Number of failed operations' },
                results: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            index: { type: 'integer', description: 'Index in batch' },
                            status: { type: 'integer', description: 'HTTP status code' },
                            data: { $ref: (0, swagger_1.getSchemaPath)(type) },
                            error: { type: 'string', description: 'Error message if failed' },
                        },
                    },
                },
            },
        },
    }));
}
function createNotModifiedResponse(description = 'Not Modified - Resource unchanged since last request') {
    return (0, swagger_1.ApiResponse)({
        status: 304,
        description,
        headers: {
            'ETag': {
                description: 'Entity tag for cache validation',
                schema: { type: 'string' },
                example: '"33a64df551425fcc55e4d42a148795d9f25f89d4"',
            },
            'Cache-Control': {
                description: 'Cache directives',
                schema: { type: 'string' },
                example: 'max-age=3600',
            },
        },
    });
}
function createSuccessResponseWithHeaders(type, headers, description = 'Successful operation with custom headers') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(type), (0, swagger_1.ApiResponse)({
        status: 200,
        description,
        schema: { $ref: (0, swagger_1.getSchemaPath)(type) },
        headers,
    }));
}
//# sourceMappingURL=success-builders.js.map