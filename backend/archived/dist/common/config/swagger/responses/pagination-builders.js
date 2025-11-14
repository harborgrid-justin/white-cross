"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCursorPaginatedResponse = createCursorPaginatedResponse;
exports.createOffsetPaginatedResponse = createOffsetPaginatedResponse;
exports.createLinkHeaderPaginatedResponse = createLinkHeaderPaginatedResponse;
exports.createKeysetPaginatedResponse = createKeysetPaginatedResponse;
exports.createInfiniteScrollResponse = createInfiniteScrollResponse;
exports.createBatchPaginatedResponse = createBatchPaginatedResponse;
exports.createGroupedPaginatedResponse = createGroupedPaginatedResponse;
exports.createAggregatedPaginatedResponse = createAggregatedPaginatedResponse;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function createCursorPaginatedResponse(type, description = 'Cursor-paginated response') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(type), (0, swagger_1.ApiResponse)({
        status: 200,
        description,
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: { $ref: (0, swagger_1.getSchemaPath)(type) },
                },
                pagination: {
                    type: 'object',
                    properties: {
                        nextCursor: { type: 'string', nullable: true, description: 'Cursor for next page' },
                        prevCursor: {
                            type: 'string',
                            nullable: true,
                            description: 'Cursor for previous page',
                        },
                        hasMore: { type: 'boolean', description: 'Whether more items exist' },
                    },
                },
            },
        },
    }));
}
function createOffsetPaginatedResponse(type, description = 'Offset-paginated response') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(type), (0, swagger_1.ApiResponse)({
        status: 200,
        description,
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: { $ref: (0, swagger_1.getSchemaPath)(type) },
                },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'integer', example: 1, description: 'Current page number' },
                        limit: { type: 'integer', example: 20, description: 'Items per page' },
                        total: { type: 'integer', example: 100, description: 'Total items' },
                        totalPages: { type: 'integer', example: 5, description: 'Total pages' },
                        hasNextPage: { type: 'boolean', example: true },
                        hasPreviousPage: { type: 'boolean', example: false },
                    },
                },
            },
        },
    }));
}
function createLinkHeaderPaginatedResponse(type, description = 'Paginated response with Link headers') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(type), (0, swagger_1.ApiResponse)({
        status: 200,
        description,
        schema: {
            type: 'array',
            items: { $ref: (0, swagger_1.getSchemaPath)(type) },
        },
        headers: {
            'Link': {
                description: 'Pagination links (RFC 5988)',
                schema: { type: 'string' },
                example: '</api/items?page=2>; rel="next", </api/items?page=1>; rel="prev"',
            },
            'X-Total-Count': {
                description: 'Total number of items',
                schema: { type: 'integer' },
                example: 100,
            },
        },
    }));
}
function createKeysetPaginatedResponse(type, description = 'Keyset-paginated response') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(type), (0, swagger_1.ApiResponse)({
        status: 200,
        description,
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: { $ref: (0, swagger_1.getSchemaPath)(type) },
                },
                pagination: {
                    type: 'object',
                    properties: {
                        after: { type: 'string', nullable: true, description: 'Key of last item' },
                        before: { type: 'string', nullable: true, description: 'Key of first item' },
                        hasMore: { type: 'boolean' },
                    },
                },
            },
        },
    }));
}
function createInfiniteScrollResponse(type, description = 'Infinite scroll response') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(type), (0, swagger_1.ApiResponse)({
        status: 200,
        description,
        schema: {
            type: 'object',
            properties: {
                items: {
                    type: 'array',
                    items: { $ref: (0, swagger_1.getSchemaPath)(type) },
                },
                nextToken: { type: 'string', nullable: true, description: 'Token for loading more' },
                hasMore: { type: 'boolean', description: 'Whether more items available' },
            },
        },
    }));
}
function createBatchPaginatedResponse(type, description = 'Paginated batch results') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(type), (0, swagger_1.ApiResponse)({
        status: 200,
        description,
        schema: {
            type: 'object',
            properties: {
                batchId: { type: 'string', format: 'uuid' },
                totalOperations: { type: 'integer' },
                successCount: { type: 'integer' },
                failureCount: { type: 'integer' },
                results: {
                    type: 'array',
                    items: { $ref: (0, swagger_1.getSchemaPath)(type) },
                },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        total: { type: 'integer' },
                    },
                },
            },
        },
    }));
}
function createGroupedPaginatedResponse(type, description = 'Grouped paginated response') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(type), (0, swagger_1.ApiResponse)({
        status: 200,
        description,
        schema: {
            type: 'object',
            properties: {
                groups: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            key: { type: 'string', description: 'Group key' },
                            count: { type: 'integer', description: 'Items in group' },
                            items: {
                                type: 'array',
                                items: { $ref: (0, swagger_1.getSchemaPath)(type) },
                            },
                        },
                    },
                },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        totalGroups: { type: 'integer' },
                        totalItems: { type: 'integer' },
                    },
                },
            },
        },
    }));
}
function createAggregatedPaginatedResponse(type, description = 'Paginated response with aggregates') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(type), (0, swagger_1.ApiResponse)({
        status: 200,
        description,
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: { $ref: (0, swagger_1.getSchemaPath)(type) },
                },
                aggregates: {
                    type: 'object',
                    properties: {
                        sum: { type: 'number', description: 'Sum of values' },
                        average: { type: 'number', description: 'Average value' },
                        min: { type: 'number', description: 'Minimum value' },
                        max: { type: 'number', description: 'Maximum value' },
                        count: { type: 'integer', description: 'Total count' },
                    },
                },
                pagination: {
                    type: 'object',
                    properties: {
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        total: { type: 'integer' },
                    },
                },
            },
        },
    }));
}
//# sourceMappingURL=pagination-builders.js.map