"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSuccessResponse = formatSuccessResponse;
exports.formatCreatedResponse = formatCreatedResponse;
exports.formatNoContentResponse = formatNoContentResponse;
exports.formatAcceptedResponse = formatAcceptedResponse;
exports.formatBulkResponse = formatBulkResponse;
exports.formatPartialContentResponse = formatPartialContentResponse;
exports.formatErrorResponse = formatErrorResponse;
exports.formatValidationErrorResponse = formatValidationErrorResponse;
exports.formatNotFoundErrorResponse = formatNotFoundErrorResponse;
exports.formatUnauthorizedErrorResponse = formatUnauthorizedErrorResponse;
exports.formatForbiddenErrorResponse = formatForbiddenErrorResponse;
exports.formatConflictErrorResponse = formatConflictErrorResponse;
exports.formatPaginatedResponse = formatPaginatedResponse;
exports.calculatePaginationMeta = calculatePaginationMeta;
exports.generatePaginationLinks = generatePaginationLinks;
exports.formatCursorPaginatedResponse = formatCursorPaginatedResponse;
exports.formatOffsetPaginatedResponse = formatOffsetPaginatedResponse;
exports.addHateoasLinks = addHateoasLinks;
exports.generateSelfLink = generateSelfLink;
exports.generateCollectionLinks = generateCollectionLinks;
exports.generateRelatedLinks = generateRelatedLinks;
exports.formatHypermediaResponse = formatHypermediaResponse;
exports.formatResponseByContentType = formatResponseByContentType;
exports.convertToXML = convertToXML;
exports.convertToCSV = convertToCSV;
exports.convertToYAML = convertToYAML;
exports.negotiateContentType = negotiateContentType;
exports.compressResponse = compressResponse;
exports.shouldCompress = shouldCompress;
exports.addCompressionHeaders = addCompressionHeaders;
exports.calculateCompressionStats = calculateCompressionStats;
exports.selectCompressionAlgorithm = selectCompressionAlgorithm;
exports.formatSSEMessage = formatSSEMessage;
exports.formatChunkedResponse = formatChunkedResponse;
exports.formatStreamMetadata = formatStreamMetadata;
exports.generateStreamEndMessage = generateStreamEndMessage;
exports.transformResponseKeys = transformResponseKeys;
exports.filterResponseFields = filterResponseFields;
exports.enrichResponseData = enrichResponseData;
exports.sanitizeResponseData = sanitizeResponseData;
function formatSuccessResponse(data, metadata) {
    return {
        success: true,
        data,
        metadata: {
            timestamp: new Date().toISOString(),
            version: '1.0',
            ...metadata,
        },
    };
}
function formatCreatedResponse(data, resourceId, location) {
    return {
        success: true,
        data,
        id: resourceId,
        location: location || '/api/resource/' + resourceId,
        metadata: {
            timestamp: new Date().toISOString(),
            version: '1.0',
        },
    };
}
function formatNoContentResponse() {
    return {
        success: true,
        metadata: {
            timestamp: new Date().toISOString(),
            version: '1.0',
        },
    };
}
function formatAcceptedResponse(jobId, statusUrl) {
    return {
        success: true,
        data: {
            jobId,
            statusUrl,
        },
        metadata: {
            timestamp: new Date().toISOString(),
            version: '1.0',
        },
    };
}
function formatBulkResponse(results) {
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;
    return {
        success: failureCount === 0,
        totalProcessed: results.length,
        successCount,
        failureCount,
        results,
        metadata: {
            timestamp: new Date().toISOString(),
            version: '1.0',
        },
    };
}
function formatPartialContentResponse(data, range) {
    return {
        success: true,
        data,
        range,
        metadata: {
            timestamp: new Date().toISOString(),
            version: '1.0',
        },
    };
}
function formatErrorResponse(code, message, details, statusCode = 500) {
    return {
        success: false,
        error: {
            code,
            message,
            details,
            timestamp: new Date().toISOString(),
        },
        metadata: {
            timestamp: new Date().toISOString(),
            version: '1.0',
        },
    };
}
function formatValidationErrorResponse(validationErrors) {
    return {
        success: false,
        error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: {
                errors: validationErrors,
            },
            timestamp: new Date().toISOString(),
        },
        metadata: {
            timestamp: new Date().toISOString(),
            version: '1.0',
        },
    };
}
function formatNotFoundErrorResponse(resource, identifier) {
    return {
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: resource + ' with identifier \'' + identifier + '\' not found',
            timestamp: new Date().toISOString(),
        },
        metadata: {
            timestamp: new Date().toISOString(),
            version: '1.0',
        },
    };
}
function formatUnauthorizedErrorResponse(reason) {
    return {
        success: false,
        error: {
            code: 'UNAUTHORIZED',
            message: reason || 'Authentication required',
            timestamp: new Date().toISOString(),
        },
        metadata: {
            timestamp: new Date().toISOString(),
            version: '1.0',
        },
    };
}
function formatForbiddenErrorResponse(reason) {
    return {
        success: false,
        error: {
            code: 'FORBIDDEN',
            message: reason || 'Insufficient permissions',
            timestamp: new Date().toISOString(),
        },
        metadata: {
            timestamp: new Date().toISOString(),
            version: '1.0',
        },
    };
}
function formatConflictErrorResponse(conflictingField, message) {
    return {
        success: false,
        error: {
            code: 'CONFLICT',
            message: message || 'Resource conflict on field \'' + conflictingField + '\'',
            details: {
                conflictingField,
            },
            timestamp: new Date().toISOString(),
        },
        metadata: {
            timestamp: new Date().toISOString(),
            version: '1.0',
        },
    };
}
function formatPaginatedResponse(items, pagination) {
    return {
        success: true,
        data: items,
        pagination,
        metadata: {
            timestamp: new Date().toISOString(),
            version: '1.0',
        },
    };
}
function calculatePaginationMeta(page, limit, totalItems) {
    const totalPages = Math.ceil(totalItems / limit);
    return {
        page,
        limit,
        total: totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    };
}
function generatePaginationLinks(baseUrl, pagination) {
    const pageParam = pagination.page;
    const limitParam = pagination.limit;
    const links = {
        self: baseUrl + '?page=' + pageParam + '&limit=' + limitParam,
        first: baseUrl + '?page=1&limit=' + limitParam,
        last: baseUrl + '?page=' + pagination.totalPages + '&limit=' + limitParam,
    };
    if (pagination.hasNextPage) {
        links.next = baseUrl + '?page=' + (pageParam + 1) + '&limit=' + limitParam;
    }
    if (pagination.hasPreviousPage) {
        links.prev = baseUrl + '?page=' + (pageParam - 1) + '&limit=' + limitParam;
    }
    return links;
}
function formatCursorPaginatedResponse(items, cursor) {
    return {
        success: true,
        data: items,
        cursor,
        metadata: {
            timestamp: new Date().toISOString(),
            version: '1.0',
        },
    };
}
function formatOffsetPaginatedResponse(items, offset, limit, total) {
    return {
        success: true,
        data: items,
        pagination: {
            offset,
            limit,
            total,
            hasMore: offset + limit < total,
        },
        metadata: {
            timestamp: new Date().toISOString(),
            version: '1.0',
        },
    };
}
function addHateoasLinks(data, links) {
    const _links = {};
    links.forEach(link => {
        _links[link.rel] = link;
    });
    return {
        ...data,
        _links,
    };
}
function generateSelfLink(resourceUrl, method = 'GET') {
    return {
        href: resourceUrl,
        rel: 'self',
        method,
    };
}
function generateCollectionLinks(baseUrl, itemId) {
    return [
        {
            href: baseUrl + '/' + itemId,
            rel: 'self',
            method: 'GET',
        },
        {
            href: baseUrl + '/' + itemId,
            rel: 'update',
            method: 'PUT',
        },
        {
            href: baseUrl + '/' + itemId,
            rel: 'delete',
            method: 'DELETE',
        },
        {
            href: baseUrl,
            rel: 'collection',
            method: 'GET',
        },
    ];
}
function generateRelatedLinks(data, baseUrl, relations) {
    const links = [];
    relations.forEach(relation => {
        if (data[relation.field]) {
            links.push({
                href: baseUrl + relation.endpoint + '/' + data[relation.field],
                rel: relation.rel,
                method: 'GET',
            });
        }
    });
    return links;
}
function formatHypermediaResponse(data, selfUrl, additionalLinks = []) {
    const selfLink = generateSelfLink(selfUrl);
    const allLinks = [selfLink, ...additionalLinks];
    return {
        success: true,
        data: addHateoasLinks(data, allLinks),
        metadata: {
            timestamp: new Date().toISOString(),
            version: '1.0',
        },
    };
}
function formatResponseByContentType(data, contentType) {
    if (contentType.includes('application/json')) {
        return data;
    }
    if (contentType.includes('application/xml')) {
        return convertToXML(data);
    }
    if (contentType.includes('text/csv')) {
        return convertToCSV(data);
    }
    if (contentType.includes('text/yaml')) {
        return convertToYAML(data);
    }
    return data;
}
function convertToXML(data) {
    const toXML = (obj, indent = '') => {
        let xml = '';
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    xml += indent + '<' + key + '>\n' + toXML(value, indent + '  ') + '\n' + indent + '</' + key + '>\n';
                }
                else if (Array.isArray(value)) {
                    value.forEach(item => {
                        xml += indent + '<' + key + '>' + item + '</' + key + '>\n';
                    });
                }
                else {
                    xml += indent + '<' + key + '>' + value + '</' + key + '>\n';
                }
            }
        }
        return xml;
    };
    return '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n' + toXML(data, '  ') + '</root>';
}
function convertToCSV(data) {
    const items = Array.isArray(data) ? data : [data];
    if (items.length === 0) {
        return '';
    }
    const headers = Object.keys(items[0]);
    const headerRow = headers.join(',');
    const rows = items.map(item => {
        return headers.map(header => {
            const value = item[header];
            const stringValue = value === null || value === undefined ? '' : String(value);
            return stringValue.includes(',') ? '"' + stringValue + '"' : stringValue;
        }).join(',');
    });
    return [headerRow, ...rows].join('\n');
}
function convertToYAML(data) {
    const toYAML = (obj, indent = 0) => {
        const spaces = '  '.repeat(indent);
        let yaml = '';
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    yaml += spaces + key + ':\n' + toYAML(value, indent + 1);
                }
                else if (Array.isArray(value)) {
                    yaml += spaces + key + ':\n';
                    value.forEach(item => {
                        yaml += spaces + '  - ' + item + '\n';
                    });
                }
                else {
                    yaml += spaces + key + ': ' + value + '\n';
                }
            }
        }
        return yaml;
    };
    return toYAML(data);
}
function negotiateContentType(acceptHeader, supportedTypes) {
    const acceptedTypes = acceptHeader
        .split(',')
        .map(type => type.trim().split(';')[0])
        .filter(Boolean);
    for (const accepted of acceptedTypes) {
        if (supportedTypes.includes(accepted)) {
            return accepted;
        }
    }
    return null;
}
function compressResponse(data, algorithm = 'gzip') {
    const jsonString = JSON.stringify(data);
    const originalSize = Buffer.byteLength(jsonString);
    const compressed = jsonString;
    const compressedSize = Buffer.byteLength(compressed);
    return {
        compressed,
        originalSize,
        compressedSize,
        compressionRatio: compressedSize / originalSize,
        algorithm,
    };
}
function shouldCompress(contentLength, contentType, threshold = 1024) {
    if (contentLength < threshold) {
        return false;
    }
    const compressibleTypes = [
        'application/json',
        'text/html',
        'text/plain',
        'text/css',
        'application/javascript',
        'text/xml',
    ];
    return compressibleTypes.some(type => contentType.includes(type));
}
function addCompressionHeaders(headers, algorithm) {
    return {
        ...headers,
        'Content-Encoding': algorithm,
        'Vary': 'Accept-Encoding',
    };
}
function calculateCompressionStats(originalSize, compressedSize) {
    const savedBytes = originalSize - compressedSize;
    const compressionRatio = compressedSize / originalSize;
    const savingsPercent = ((savedBytes / originalSize) * 100);
    return {
        originalSize,
        compressedSize,
        savedBytes,
        compressionRatio,
        savingsPercent: Math.round(savingsPercent * 100) / 100,
    };
}
function selectCompressionAlgorithm(acceptEncoding, preferBrotli = true) {
    const encodings = acceptEncoding.toLowerCase().split(',').map(e => e.trim());
    if (preferBrotli && encodings.includes('br')) {
        return 'br';
    }
    if (encodings.includes('gzip')) {
        return 'gzip';
    }
    if (encodings.includes('deflate')) {
        return 'deflate';
    }
    return null;
}
function formatSSEMessage(data, event, id) {
    let message = '';
    if (id) {
        message += 'id: ' + id + '\n';
    }
    if (event) {
        message += 'event: ' + event + '\n';
    }
    message += 'data: ' + JSON.stringify(data) + '\n\n';
    return message;
}
function formatChunkedResponse(chunks, chunkSize = 1000) {
    const chunked = [];
    for (let i = 0; i < chunks.length; i += chunkSize) {
        chunked.push(chunks.slice(i, i + chunkSize));
    }
    return chunked;
}
function formatStreamMetadata(streamId, startTime) {
    return {
        streamId,
        startTime: startTime.toISOString(),
        isActive: true,
    };
}
function generateStreamEndMessage(streamId, totalEvents, duration) {
    return formatSSEMessage({
        streamId,
        totalEvents,
        duration,
        status: 'complete',
    }, 'end');
}
function transformResponseKeys(data, transformer) {
    if (Array.isArray(data)) {
        return data.map(item => transformResponseKeys(item, transformer));
    }
    if (typeof data !== 'object' || data === null) {
        return data;
    }
    const transformed = {};
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const newKey = transformer(key);
            const value = data[key];
            transformed[newKey] = typeof value === 'object' && value !== null
                ? transformResponseKeys(value, transformer)
                : value;
        }
    }
    return transformed;
}
function filterResponseFields(data, fields) {
    if (Array.isArray(data)) {
        return data.map(item => filterResponseFields(item, fields));
    }
    const filtered = {};
    fields.forEach(field => {
        if (field in data) {
            filtered[field] = data[field];
        }
    });
    return filtered;
}
function enrichResponseData(data, enrichments) {
    const enriched = { ...data };
    for (const key in enrichments) {
        if (enrichments.hasOwnProperty(key)) {
            enriched[key] = enrichments[key](data);
        }
    }
    return enriched;
}
function sanitizeResponseData(data, sensitiveFields) {
    if (Array.isArray(data)) {
        return data.map(item => sanitizeResponseData(item, sensitiveFields));
    }
    const sanitized = { ...data };
    sensitiveFields.forEach(field => {
        if (field in sanitized) {
            sanitized[field] = '***REDACTED***';
        }
    });
    return sanitized;
}
//# sourceMappingURL=openapi-response-formatters.service.js.map