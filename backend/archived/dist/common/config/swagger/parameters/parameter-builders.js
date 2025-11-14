"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PARAMETER_PRESETS = void 0;
exports.defineGlobalParameters = defineGlobalParameters;
exports.defineCommonQueryParams = defineCommonQueryParams;
exports.defineCommonHeaders = defineCommonHeaders;
exports.definePathParameters = definePathParameters;
exports.buildPaginationParameters = buildPaginationParameters;
exports.buildSearchParameters = buildSearchParameters;
exports.buildVersioningParameters = buildVersioningParameters;
function defineGlobalParameters(parameters) {
    const paramMap = {};
    parameters.forEach((param) => {
        paramMap[param.name] = {
            name: param.name,
            in: param.in,
            description: param.description || '',
            required: param.required || false,
            schema: param.schema || { type: 'string' },
        };
    });
    return paramMap;
}
function defineCommonQueryParams(includePagination = true, includeSorting = true, includeFiltering = false) {
    const params = {};
    if (includePagination) {
        params.page = {
            name: 'page',
            in: 'query',
            description: 'Page number for pagination (1-based)',
            required: false,
            schema: { type: 'integer', minimum: 1, default: 1 },
        };
        params.limit = {
            name: 'limit',
            in: 'query',
            description: 'Number of items per page',
            required: false,
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
        };
        params.offset = {
            name: 'offset',
            in: 'query',
            description: 'Number of items to skip (0-based)',
            required: false,
            schema: { type: 'integer', minimum: 0, default: 0 },
        };
    }
    if (includeSorting) {
        params.sortBy = {
            name: 'sortBy',
            in: 'query',
            description: 'Field name to sort by',
            required: false,
            schema: { type: 'string' },
        };
        params.sortOrder = {
            name: 'sortOrder',
            in: 'query',
            description: 'Sort order (ascending or descending)',
            required: false,
            schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' },
        };
        params.orderBy = {
            name: 'orderBy',
            in: 'query',
            description: 'Alternative sorting parameter with field:direction format',
            required: false,
            schema: { type: 'string', pattern: '^[a-zA-Z_][a-zA-Z0-9_]*:(asc|desc)$' },
        };
    }
    if (includeFiltering) {
        params.filter = {
            name: 'filter',
            in: 'query',
            description: 'Filter expression using query syntax',
            required: false,
            schema: { type: 'string' },
        };
        params.fields = {
            name: 'fields',
            in: 'query',
            description: 'Comma-separated list of fields to include in response',
            required: false,
            schema: { type: 'string', pattern: '^[a-zA-Z_][a-zA-Z0-9_]*(,[a-zA-Z_][a-zA-Z0-9_]*)*$' },
        };
        params.q = {
            name: 'q',
            in: 'query',
            description: 'Search query string',
            required: false,
            schema: { type: 'string' },
        };
    }
    return params;
}
function defineCommonHeaders(headers) {
    const headerMap = {};
    const headerDefinitions = {
        'X-Request-ID': {
            name: 'X-Request-ID',
            in: 'header',
            description: 'Unique request identifier for tracking and debugging',
            required: false,
            schema: { type: 'string', format: 'uuid' },
        },
        'X-Correlation-ID': {
            name: 'X-Correlation-ID',
            in: 'header',
            description: 'Correlation ID for distributed tracing across services',
            required: false,
            schema: { type: 'string', format: 'uuid' },
        },
        'X-API-Version': {
            name: 'X-API-Version',
            in: 'header',
            description: 'Specific API version to use for this request',
            required: false,
            schema: { type: 'string', pattern: '^v\\d+(\\.\\d+)?(\\.\\d+)?$' },
        },
        'Accept-Language': {
            name: 'Accept-Language',
            in: 'header',
            description: 'Preferred language for localized responses',
            required: false,
            schema: { type: 'string', example: 'en-US,en;q=0.9' },
        },
        'X-Client-Version': {
            name: 'X-Client-Version',
            in: 'header',
            description: 'Client application version',
            required: false,
            schema: { type: 'string' },
        },
        'X-User-Agent': {
            name: 'X-User-Agent',
            in: 'header',
            description: 'Custom user agent string',
            required: false,
            schema: { type: 'string' },
        },
    };
    headers.forEach((header) => {
        if (headerDefinitions[header]) {
            headerMap[header] = headerDefinitions[header];
        }
        else {
            headerMap[header] = {
                name: header,
                in: 'header',
                description: `${header} custom header`,
                required: false,
                schema: { type: 'string' },
            };
        }
    });
    return headerMap;
}
function definePathParameters(pathParams) {
    const paramMap = {};
    pathParams.forEach((param) => {
        paramMap[param.name] = {
            name: param.name,
            in: 'path',
            description: param.description || `${param.name} parameter`,
            required: true,
            schema: {
                type: param.type || 'string',
                ...(param.format && { format: param.format }),
                ...(param.pattern && { pattern: param.pattern }),
            },
        };
    });
    return paramMap;
}
exports.PARAMETER_PRESETS = {
    REST_API: () => ({
        ...defineCommonQueryParams(true, true, true),
        ...defineCommonHeaders(['X-Request-ID', 'Accept-Language']),
    }),
    PAGINATION_ONLY: () => defineCommonQueryParams(true, false, false),
    SEARCH_AND_FILTER: () => defineCommonQueryParams(false, false, true),
    COMPLETE_SET: () => ({
        ...defineCommonQueryParams(true, true, true),
        ...defineCommonHeaders(['X-Request-ID', 'X-Correlation-ID', 'X-API-Version', 'Accept-Language']),
    }),
    RESOURCE_MANAGEMENT: () => ({
        ...definePathParameters([
            { name: 'id', description: 'Resource identifier', format: 'uuid' },
        ]),
        ...defineCommonQueryParams(false, false, true),
        ...defineCommonHeaders(['X-Request-ID']),
    }),
};
function buildPaginationParameters(defaultLimit = 20, maxLimit = 100) {
    return {
        page: {
            name: 'page',
            in: 'query',
            description: 'Page number (1-based indexing)',
            required: false,
            schema: { type: 'integer', minimum: 1, default: 1 },
        },
        limit: {
            name: 'limit',
            in: 'query',
            description: `Number of items per page (max: ${maxLimit})`,
            required: false,
            schema: { type: 'integer', minimum: 1, maximum: maxLimit, default: defaultLimit },
        },
    };
}
function buildSearchParameters(includeFilters = false) {
    const params = {
        q: {
            name: 'q',
            in: 'query',
            description: 'Search query string',
            required: false,
            schema: { type: 'string' },
        },
        searchFields: {
            name: 'searchFields',
            in: 'query',
            description: 'Comma-separated list of fields to search in',
            required: false,
            schema: { type: 'string' },
        },
    };
    if (includeFilters) {
        params.category = {
            name: 'category',
            in: 'query',
            description: 'Filter by category',
            required: false,
            schema: { type: 'string' },
        };
        params.tags = {
            name: 'tags',
            in: 'query',
            description: 'Filter by tags (comma-separated)',
            required: false,
            schema: { type: 'string' },
        };
        params.dateFrom = {
            name: 'dateFrom',
            in: 'query',
            description: 'Filter records from this date (ISO 8601 format)',
            required: false,
            schema: { type: 'string', format: 'date' },
        };
        params.dateTo = {
            name: 'dateTo',
            in: 'query',
            description: 'Filter records up to this date (ISO 8601 format)',
            required: false,
            schema: { type: 'string', format: 'date' },
        };
    }
    return params;
}
function buildVersioningParameters(supportedVersions, defaultVersion) {
    return {
        'api-version': {
            name: 'api-version',
            in: 'query',
            description: 'API version to use for this request',
            required: false,
            schema: {
                type: 'string',
                enum: supportedVersions,
                ...(defaultVersion && { default: defaultVersion }),
            },
        },
        'X-API-Version': {
            name: 'X-API-Version',
            in: 'header',
            description: 'API version specified via header',
            required: false,
            schema: {
                type: 'string',
                enum: supportedVersions,
                ...(defaultVersion && { default: defaultVersion }),
            },
        },
    };
}
//# sourceMappingURL=parameter-builders.js.map