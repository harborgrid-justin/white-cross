"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCorsHeaders = createCorsHeaders;
exports.createCacheControlHeaders = createCacheControlHeaders;
exports.createSecurityHeaders = createSecurityHeaders;
exports.createContentDispositionHeader = createContentDispositionHeader;
exports.createETagHeader = createETagHeader;
exports.createLastModifiedHeader = createLastModifiedHeader;
exports.createTrackingHeaders = createTrackingHeaders;
exports.createRateLimitHeaders = createRateLimitHeaders;
exports.createPaginationHeaders = createPaginationHeaders;
exports.createDeprecationHeaders = createDeprecationHeaders;
const swagger_1 = require("@nestjs/swagger");
function createCorsHeaders(allowedOrigins, allowedMethods = ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders = ['Content-Type', 'Authorization']) {
    const headers = {
        'Access-Control-Allow-Origin': {
            description: 'Allowed origins',
            schema: { type: 'string' },
            example: allowedOrigins.join(', '),
        },
        'Access-Control-Allow-Methods': {
            description: 'Allowed HTTP methods',
            schema: { type: 'string' },
            example: allowedMethods.join(', '),
        },
        'Access-Control-Allow-Headers': {
            description: 'Allowed request headers',
            schema: { type: 'string' },
            example: allowedHeaders.join(', '),
        },
    };
    return (0, swagger_1.ApiExtension)('x-cors-headers', headers);
}
function createCacheControlHeaders(maxAge, isPublic = true, revalidate = false) {
    const directives = [isPublic ? 'public' : 'private', `max-age=${maxAge}`];
    if (revalidate) {
        directives.push('must-revalidate');
    }
    return (0, swagger_1.ApiExtension)('x-cache-control', {
        'Cache-Control': {
            description: 'Cache control directives',
            schema: { type: 'string' },
            example: directives.join(', '),
        },
        'ETag': {
            description: 'Entity tag for cache validation',
            schema: { type: 'string' },
        },
    });
}
function createSecurityHeaders(includeHsts = true, includeXssProtection = true) {
    const headers = {
        'X-Content-Type-Options': {
            description: 'Prevent MIME type sniffing',
            schema: { type: 'string' },
            example: 'nosniff',
        },
        'X-Frame-Options': {
            description: 'Clickjacking protection',
            schema: { type: 'string' },
            example: 'DENY',
        },
    };
    if (includeHsts) {
        headers['Strict-Transport-Security'] = {
            description: 'HSTS policy',
            schema: { type: 'string' },
            example: 'max-age=31536000; includeSubDomains',
        };
    }
    if (includeXssProtection) {
        headers['X-XSS-Protection'] = {
            description: 'XSS filter',
            schema: { type: 'string' },
            example: '1; mode=block',
        };
    }
    return (0, swagger_1.ApiExtension)('x-security-headers', headers);
}
function createContentDispositionHeader(filename, inline = false) {
    const disposition = inline ? 'inline' : 'attachment';
    return (0, swagger_1.ApiExtension)('x-content-disposition', {
        'Content-Disposition': {
            description: 'Content disposition',
            schema: { type: 'string' },
            example: `${disposition}; filename="${filename}"`,
        },
    });
}
function createETagHeader(strong = true) {
    return (0, swagger_1.ApiExtension)('x-etag', {
        'ETag': {
            description: strong ? 'Strong entity tag' : 'Weak entity tag',
            schema: { type: 'string' },
            example: strong ? '"33a64df551425fcc"' : 'W/"33a64df551425fcc"',
        },
    });
}
function createLastModifiedHeader() {
    return (0, swagger_1.ApiExtension)('x-last-modified', {
        'Last-Modified': {
            description: 'Resource last modification timestamp',
            schema: { type: 'string', format: 'date-time' },
            example: 'Wed, 21 Oct 2015 07:28:00 GMT',
        },
    });
}
function createTrackingHeaders(includeRequestId = true, includeCorrelationId = true) {
    const headers = {};
    if (includeRequestId) {
        headers['X-Request-ID'] = {
            description: 'Unique request identifier',
            schema: { type: 'string', format: 'uuid' },
        };
    }
    if (includeCorrelationId) {
        headers['X-Correlation-ID'] = {
            description: 'Correlation ID for distributed tracing',
            schema: { type: 'string', format: 'uuid' },
        };
    }
    return (0, swagger_1.ApiExtension)('x-tracking-headers', headers);
}
function createRateLimitHeaders(limit, window) {
    return (0, swagger_1.ApiExtension)('x-rate-limit-headers', {
        'X-RateLimit-Limit': {
            description: 'Request limit per window',
            schema: { type: 'integer' },
            example: limit,
        },
        'X-RateLimit-Remaining': {
            description: 'Remaining requests',
            schema: { type: 'integer' },
        },
        'X-RateLimit-Reset': {
            description: 'Reset timestamp',
            schema: { type: 'integer' },
        },
    });
}
function createPaginationHeaders() {
    return (0, swagger_1.ApiExtension)('x-pagination-headers', {
        'X-Total-Count': {
            description: 'Total number of items',
            schema: { type: 'integer' },
        },
        'X-Page': {
            description: 'Current page number',
            schema: { type: 'integer' },
        },
        'X-Per-Page': {
            description: 'Items per page',
            schema: { type: 'integer' },
        },
        'X-Total-Pages': {
            description: 'Total number of pages',
            schema: { type: 'integer' },
        },
    });
}
function createDeprecationHeaders(sunsetDate, alternativeUrl) {
    const headers = {
        'Deprecation': {
            description: 'Deprecation notice',
            schema: { type: 'string' },
            example: 'true',
        },
    };
    if (sunsetDate) {
        headers['Sunset'] = {
            description: 'Sunset date (RFC 8594)',
            schema: { type: 'string', format: 'date' },
            example: sunsetDate,
        };
    }
    if (alternativeUrl) {
        headers['Link'] = {
            description: 'Alternative endpoint',
            schema: { type: 'string' },
            example: `<${alternativeUrl}>; rel="alternate"`,
        };
    }
    return (0, swagger_1.ApiExtension)('x-deprecation-headers', headers);
}
//# sourceMappingURL=header-utilities.js.map