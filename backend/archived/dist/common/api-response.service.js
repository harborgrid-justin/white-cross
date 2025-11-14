"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentType = void 0;
exports.createApiResponse = createApiResponse;
exports.formatSuccessResponse = formatSuccessResponse;
exports.sendJsonResponse = sendJsonResponse;
exports.createNoContentResponse = createNoContentResponse;
exports.sendCreatedResponse = sendCreatedResponse;
exports.sendNoContentResponse = sendNoContentResponse;
exports.createErrorResponse = createErrorResponse;
exports.formatValidationErrorResponse = formatValidationErrorResponse;
exports.sendBadRequestError = sendBadRequestError;
exports.sendUnauthorizedError = sendUnauthorizedError;
exports.sendForbiddenError = sendForbiddenError;
exports.sendNotFoundError = sendNotFoundError;
exports.sendConflictError = sendConflictError;
exports.sendInternalServerError = sendInternalServerError;
exports.createPaginationMetadata = createPaginationMetadata;
exports.formatPaginatedResponse = formatPaginatedResponse;
exports.generatePaginationLinks = generatePaginationLinks;
exports.calculatePaginationOffset = calculatePaginationOffset;
exports.createResourceLinks = createResourceLinks;
exports.generateCrudLinks = generateCrudLinks;
exports.createRelatedResourceLinks = createRelatedResourceLinks;
exports.extractApiVersion = extractApiVersion;
exports.setApiVersionHeaders = setApiVersionHeaders;
exports.sendVersionedResponse = sendVersionedResponse;
exports.negotiateContentType = negotiateContentType;
exports.formatAsJson = formatAsJson;
exports.formatAsXml = formatAsXml;
exports.formatAsCsv = formatAsCsv;
exports.sendNegotiatedResponse = sendNegotiatedResponse;
exports.shouldCompressResponse = shouldCompressResponse;
exports.createGzipStream = createGzipStream;
exports.createBrotliStream = createBrotliStream;
exports.sendCompressedResponse = sendCompressedResponse;
exports.generateETag = generateETag;
exports.validateETag = validateETag;
exports.handleETagValidation = handleETagValidation;
exports.validateIfMatch = validateIfMatch;
exports.buildCacheControlHeader = buildCacheControlHeader;
exports.setCacheHeadersPublic = setCacheHeadersPublic;
exports.setCacheHeadersPrivate = setCacheHeadersPrivate;
exports.setNoCacheHeaders = setNoCacheHeaders;
exports.setCorsHeaders = setCorsHeaders;
exports.createDefaultCorsOptions = createDefaultCorsOptions;
exports.handlePreflightRequest = handlePreflightRequest;
exports.setRateLimitHeaders = setRateLimitHeaders;
exports.sendRateLimitExceededResponse = sendRateLimitExceededResponse;
exports.calculateRateLimitReset = calculateRateLimitReset;
exports.setDeprecationHeaders = setDeprecationHeaders;
exports.sendDeprecatedResponse = sendDeprecatedResponse;
exports.isSunset = isSunset;
exports.streamJsonResponse = streamJsonResponse;
exports.initializeSseStream = initializeSseStream;
exports.sendSseEvent = sendSseEvent;
exports.sendChunkedResponse = sendChunkedResponse;
const crypto_1 = require("crypto");
const zlib = __importStar(require("zlib"));
var ContentType;
(function (ContentType) {
    ContentType["JSON"] = "application/json";
    ContentType["XML"] = "application/xml";
    ContentType["CSV"] = "text/csv";
    ContentType["HTML"] = "text/html";
    ContentType["PLAIN"] = "text/plain";
    ContentType["STREAM"] = "application/octet-stream";
})(ContentType || (exports.ContentType = ContentType = {}));
function createApiResponse(success, data, metadata, links, version) {
    return {
        success,
        data,
        metadata,
        links,
        timestamp: new Date().toISOString(),
        version,
    };
}
function formatSuccessResponse(data, metadata, links, version = 'v1') {
    return createApiResponse(true, data, metadata, links, version);
}
function sendJsonResponse(res, statusCode, responseData) {
    res.status(statusCode).json(responseData);
}
function createNoContentResponse(message = 'Operation completed successfully', version = 'v1') {
    return formatSuccessResponse({ message }, undefined, undefined, version);
}
function sendCreatedResponse(res, data, resourceUrl, version = 'v1') {
    const response = formatSuccessResponse(data, undefined, { self: resourceUrl }, version);
    res.status(201).location(resourceUrl).json(response);
}
function sendNoContentResponse(res) {
    res.status(204).send();
}
function createErrorResponse(code, message, details, field, includeStack = false, version = 'v1') {
    const error = {
        code,
        message,
        details,
        field,
    };
    if (includeStack && details instanceof Error) {
        error.stack = details.stack;
    }
    return {
        success: false,
        error,
        timestamp: new Date().toISOString(),
        version,
    };
}
function formatValidationErrorResponse(validationErrors, version = 'v1') {
    return createErrorResponse('VALIDATION_ERROR', 'Request validation failed', validationErrors, undefined, false, version);
}
function sendBadRequestError(res, message = 'Bad Request', details, version = 'v1') {
    const response = createErrorResponse('BAD_REQUEST', message, details, undefined, false, version);
    res.status(400).json(response);
}
function sendUnauthorizedError(res, message = 'Unauthorized', realm = 'API', version = 'v1') {
    const response = createErrorResponse('UNAUTHORIZED', message, undefined, undefined, false, version);
    res.status(401).header('WWW-Authenticate', `Bearer realm="${realm}"`).json(response);
}
function sendForbiddenError(res, message = 'Forbidden', version = 'v1') {
    const response = createErrorResponse('FORBIDDEN', message, undefined, undefined, false, version);
    res.status(403).json(response);
}
function sendNotFoundError(res, resource = 'Resource', identifier, version = 'v1') {
    const message = identifier
        ? `${resource} with identifier '${identifier}' not found`
        : `${resource} not found`;
    const response = createErrorResponse('NOT_FOUND', message, undefined, undefined, false, version);
    res.status(404).json(response);
}
function sendConflictError(res, message = 'Resource conflict', conflictDetails, version = 'v1') {
    const response = createErrorResponse('CONFLICT', message, conflictDetails, undefined, false, version);
    res.status(409).json(response);
}
function sendInternalServerError(res, error, includeStack = false, version = 'v1') {
    const response = createErrorResponse('INTERNAL_SERVER_ERROR', 'An unexpected error occurred', error, undefined, includeStack, version);
    res.status(500).json(response);
}
function createPaginationMetadata(params) {
    const { page, pageSize, totalItems } = params;
    const totalPages = Math.ceil(totalItems / pageSize);
    return {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
    };
}
function formatPaginatedResponse(data, params, baseUrl, version = 'v1') {
    const metadata = createPaginationMetadata(params);
    const links = generatePaginationLinks(params, baseUrl);
    return formatSuccessResponse(data, metadata, links, version);
}
function generatePaginationLinks(params, baseUrl) {
    const { page, pageSize, totalItems } = params;
    const totalPages = Math.ceil(totalItems / pageSize);
    const links = {
        self: `${baseUrl}?page=${page}&pageSize=${pageSize}`,
        first: `${baseUrl}?page=1&pageSize=${pageSize}`,
        last: `${baseUrl}?page=${totalPages}&pageSize=${pageSize}`,
    };
    if (page > 1) {
        links.previous = `${baseUrl}?page=${page - 1}&pageSize=${pageSize}`;
    }
    if (page < totalPages) {
        links.next = `${baseUrl}?page=${page + 1}&pageSize=${pageSize}`;
    }
    return links;
}
function calculatePaginationOffset(page, pageSize) {
    return {
        offset: (page - 1) * pageSize,
        limit: pageSize,
    };
}
function createResourceLinks(resourceId, resourceType, baseUrl, additionalLinks) {
    const links = {
        self: `${baseUrl}/${resourceType}/${resourceId}`,
        collection: `${baseUrl}/${resourceType}`,
        ...additionalLinks,
    };
    return links;
}
function generateCrudLinks(resourceId, resourceType, baseUrl, operations = ['read', 'update', 'delete']) {
    const resourceUrl = `${baseUrl}/${resourceType}/${resourceId}`;
    const collectionUrl = `${baseUrl}/${resourceType}`;
    const links = {
        self: resourceUrl,
    };
    if (operations.includes('read')) {
        links.read = resourceUrl;
    }
    if (operations.includes('update')) {
        links.update = resourceUrl;
    }
    if (operations.includes('delete')) {
        links.delete = resourceUrl;
    }
    if (operations.includes('create')) {
        links.create = collectionUrl;
    }
    return links;
}
function createRelatedResourceLinks(resourceId, resourceType, baseUrl, relations) {
    const links = {
        self: `${baseUrl}/${resourceType}/${resourceId}`,
    };
    relations.forEach((relation) => {
        links[relation] = `${baseUrl}/${resourceType}/${resourceId}/${relation}`;
    });
    return links;
}
function extractApiVersion(acceptHeader, urlVersion, defaultVersion = 'v1') {
    if (urlVersion) {
        return urlVersion;
    }
    if (acceptHeader) {
        const versionMatch = acceptHeader.match(/version=(\d+)/);
        if (versionMatch) {
            return `v${versionMatch[1]}`;
        }
    }
    return defaultVersion;
}
function setApiVersionHeaders(res, version, deprecatedVersion = false, sunsetDate) {
    res.setHeader('API-Version', version);
    if (deprecatedVersion) {
        res.setHeader('Deprecation', 'true');
        if (sunsetDate) {
            res.setHeader('Sunset', sunsetDate.toUTCString());
        }
    }
}
function sendVersionedResponse(res, data, version = 'v1', deprecatedVersion = false, sunsetDate) {
    setApiVersionHeaders(res, version, deprecatedVersion, sunsetDate);
    const response = formatSuccessResponse(data, undefined, undefined, version);
    res.status(200).json(response);
}
function negotiateContentType(acceptHeader, supportedTypes = [ContentType.JSON], defaultType = ContentType.JSON) {
    if (!acceptHeader) {
        return defaultType;
    }
    const acceptedTypes = acceptHeader.split(',').map((type) => type.trim().split(';')[0]);
    for (const accepted of acceptedTypes) {
        const matched = supportedTypes.find((supported) => supported === accepted);
        if (matched) {
            return matched;
        }
    }
    return defaultType;
}
function formatAsJson(data, pretty = false) {
    return JSON.stringify(data, null, pretty ? 2 : 0);
}
function formatAsXml(data, rootElement = 'response') {
    const toXml = (obj, indent = '') => {
        if (Array.isArray(obj)) {
            return obj.map((item) => `${indent}<item>\n${toXml(item, indent + '  ')}${indent}</item>`).join('\n');
        }
        if (typeof obj === 'object' && obj !== null) {
            return Object.entries(obj)
                .map(([key, value]) => {
                if (typeof value === 'object') {
                    return `${indent}<${key}>\n${toXml(value, indent + '  ')}${indent}</${key}>`;
                }
                return `${indent}<${key}>${value}</${key}>`;
            })
                .join('\n');
        }
        return `${indent}${obj}`;
    };
    return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootElement}>\n${toXml(data, '  ')}</${rootElement}>`;
}
function formatAsCsv(data, headers) {
    if (data.length === 0) {
        return '';
    }
    const columnHeaders = headers || Object.keys(data[0]);
    const csvHeaders = columnHeaders.join(',');
    const csvRows = data.map((row) => {
        return columnHeaders
            .map((header) => {
            const value = row[header];
            const stringValue = value !== null && value !== undefined ? String(value) : '';
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        })
            .join(',');
    });
    return [csvHeaders, ...csvRows].join('\n');
}
function sendNegotiatedResponse(res, data, acceptHeader, supportedTypes = [ContentType.JSON, ContentType.XML, ContentType.CSV]) {
    const contentType = negotiateContentType(acceptHeader, supportedTypes);
    res.setHeader('Content-Type', contentType);
    switch (contentType) {
        case ContentType.JSON:
            res.status(200).json(data);
            break;
        case ContentType.XML:
            const xml = formatAsXml(data);
            res.status(200).send(xml);
            break;
        case ContentType.CSV:
            const csv = formatAsCsv(Array.isArray(data) ? data : [data]);
            res.status(200).send(csv);
            break;
        default:
            res.status(200).json(data);
    }
}
function shouldCompressResponse(contentType, contentLength, threshold = 1024) {
    if (contentLength < threshold) {
        return false;
    }
    const compressibleTypes = [
        'text/',
        'application/json',
        'application/xml',
        'application/javascript',
        'application/x-javascript',
    ];
    return compressibleTypes.some((type) => contentType.includes(type));
}
function createGzipStream(level = 6) {
    return zlib.createGzip({ level });
}
function createBrotliStream(quality = 6) {
    return zlib.createBrotliCompress({
        params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: quality,
        },
    });
}
function sendCompressedResponse(res, data, acceptEncoding, compressionLevel = 6) {
    const encoding = acceptEncoding?.toLowerCase() || '';
    if (encoding.includes('br')) {
        res.setHeader('Content-Encoding', 'br');
        const compressed = zlib.brotliCompressSync(data, {
            params: {
                [zlib.constants.BROTLI_PARAM_QUALITY]: compressionLevel,
            },
        });
        res.status(200).send(compressed);
    }
    else if (encoding.includes('gzip')) {
        res.setHeader('Content-Encoding', 'gzip');
        const compressed = zlib.gzipSync(data, { level: compressionLevel });
        res.status(200).send(compressed);
    }
    else if (encoding.includes('deflate')) {
        res.setHeader('Content-Encoding', 'deflate');
        const compressed = zlib.deflateSync(data, { level: compressionLevel });
        res.status(200).send(compressed);
    }
    else {
        res.status(200).send(data);
    }
}
function generateETag(data, weak = false) {
    const content = typeof data === 'string' ? data : JSON.stringify(data);
    const hash = (0, crypto_1.createHash)('md5').update(content).digest('hex');
    return weak ? `W/"${hash}"` : `"${hash}"`;
}
function validateETag(requestETag, currentETag) {
    if (!requestETag) {
        return false;
    }
    const requestETags = requestETag.split(',').map((tag) => tag.trim());
    return requestETags.includes(currentETag) || requestETags.includes('*');
}
function handleETagValidation(res, data, ifNoneMatch) {
    const etag = generateETag(data);
    res.setHeader('ETag', etag);
    if (validateETag(ifNoneMatch, etag)) {
        res.status(304).send();
        return true;
    }
    return false;
}
function validateIfMatch(ifMatch, currentETag) {
    if (!ifMatch) {
        return true;
    }
    const requestETags = ifMatch.split(',').map((tag) => tag.trim());
    return requestETags.includes(currentETag) || requestETags.includes('*');
}
function buildCacheControlHeader(options) {
    const directives = [];
    if (options.public) {
        directives.push('public');
    }
    if (options.private) {
        directives.push('private');
    }
    if (options.noCache) {
        directives.push('no-cache');
    }
    if (options.noStore) {
        directives.push('no-store');
    }
    if (options.mustRevalidate) {
        directives.push('must-revalidate');
    }
    if (options.proxyRevalidate) {
        directives.push('proxy-revalidate');
    }
    if (options.immutable) {
        directives.push('immutable');
    }
    if (options.maxAge !== undefined) {
        directives.push(`max-age=${options.maxAge}`);
    }
    if (options.sMaxAge !== undefined) {
        directives.push(`s-maxage=${options.sMaxAge}`);
    }
    return directives.join(', ');
}
function setCacheHeadersPublic(res, maxAge = 3600, immutable = false) {
    const cacheControl = buildCacheControlHeader({
        public: true,
        maxAge,
        immutable,
    });
    res.setHeader('Cache-Control', cacheControl);
}
function setCacheHeadersPrivate(res, maxAge = 300) {
    const cacheControl = buildCacheControlHeader({
        private: true,
        maxAge,
    });
    res.setHeader('Cache-Control', cacheControl);
}
function setNoCacheHeaders(res) {
    const cacheControl = buildCacheControlHeader({
        noCache: true,
        noStore: true,
        mustRevalidate: true,
    });
    res.setHeader('Cache-Control', cacheControl);
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
}
function setCorsHeaders(res, options) {
    const origin = Array.isArray(options.origin) ? options.origin.join(', ') : options.origin || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    if (options.methods && options.methods.length > 0) {
        res.setHeader('Access-Control-Allow-Methods', options.methods.join(', '));
    }
    if (options.allowedHeaders && options.allowedHeaders.length > 0) {
        res.setHeader('Access-Control-Allow-Headers', options.allowedHeaders.join(', '));
    }
    if (options.exposedHeaders && options.exposedHeaders.length > 0) {
        res.setHeader('Access-Control-Expose-Headers', options.exposedHeaders.join(', '));
    }
    if (options.credentials) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    if (options.maxAge !== undefined) {
        res.setHeader('Access-Control-Max-Age', options.maxAge.toString());
    }
}
function createDefaultCorsOptions() {
    return {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        exposedHeaders: ['X-Total-Count', 'X-Page-Number', 'Link'],
        credentials: false,
        maxAge: 86400,
    };
}
function handlePreflightRequest(res, options) {
    setCorsHeaders(res, options);
    res.status(204).send();
}
function setRateLimitHeaders(res, rateLimitInfo) {
    res.setHeader('X-RateLimit-Limit', rateLimitInfo.limit.toString());
    res.setHeader('X-RateLimit-Remaining', rateLimitInfo.remaining.toString());
    res.setHeader('X-RateLimit-Reset', rateLimitInfo.reset.toString());
    if (rateLimitInfo.retryAfter !== undefined) {
        res.setHeader('Retry-After', rateLimitInfo.retryAfter.toString());
    }
}
function sendRateLimitExceededResponse(res, rateLimitInfo, version = 'v1') {
    setRateLimitHeaders(res, rateLimitInfo);
    const resetTime = new Date(rateLimitInfo.reset * 1000).toISOString();
    const response = createErrorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests. Please try again later.', { resetTime, limit: rateLimitInfo.limit }, undefined, false, version);
    res.status(429).json(response);
}
function calculateRateLimitReset(windowSeconds) {
    return Math.floor(Date.now() / 1000) + windowSeconds;
}
function setDeprecationHeaders(res, sunsetDate, alternativeUrl, deprecationMessage) {
    res.setHeader('Deprecation', 'true');
    res.setHeader('Sunset', sunsetDate.toUTCString());
    if (alternativeUrl) {
        res.setHeader('Link', `<${alternativeUrl}>; rel="alternate"`);
    }
    if (deprecationMessage) {
        res.setHeader('X-API-Warn', deprecationMessage);
    }
}
function sendDeprecatedResponse(res, data, sunsetDate, alternativeUrl, version = 'v1') {
    const message = alternativeUrl
        ? `This endpoint is deprecated and will be removed on ${sunsetDate.toISOString()}. Use ${alternativeUrl} instead.`
        : `This endpoint is deprecated and will be removed on ${sunsetDate.toISOString()}.`;
    setDeprecationHeaders(res, sunsetDate, alternativeUrl, message);
    const response = formatSuccessResponse(data, undefined, undefined, version);
    res.status(200).json(response);
}
function isSunset(sunsetDate) {
    return new Date() > sunsetDate;
}
function streamJsonResponse(res, dataStream, transform) {
    res.setHeader('Content-Type', ContentType.JSON);
    res.write('[');
    let first = true;
    dataStream.on('data', (chunk) => {
        const item = transform ? transform(chunk) : chunk;
        const prefix = first ? '' : ',';
        first = false;
        res.write(`${prefix}${JSON.stringify(item)}`);
    });
    dataStream.on('end', () => {
        res.write(']');
        res.end();
    });
    dataStream.on('error', (error) => {
        res.end();
    });
}
function initializeSseStream(res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
}
function sendSseEvent(res, eventName, data, id) {
    if (id !== undefined) {
        res.write(`id: ${id}\n`);
    }
    res.write(`event: ${eventName}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
}
async function sendChunkedResponse(res, chunks, contentType = ContentType.JSON, delayMs = 0) {
    res.setHeader('Content-Type', contentType);
    res.setHeader('Transfer-Encoding', 'chunked');
    for (const chunk of chunks) {
        const data = typeof chunk === 'string' ? chunk : JSON.stringify(chunk);
        res.write(data);
        if (delayMs > 0) {
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }
    res.end();
}
//# sourceMappingURL=api-response.service.js.map