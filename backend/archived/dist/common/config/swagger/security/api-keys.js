"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiKeyHeader = createApiKeyHeader;
exports.createApiKeyQuery = createApiKeyQuery;
exports.createApiKeyCookie = createApiKeyCookie;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function createApiKeyHeader(options = {}) {
    const { keyName = 'X-API-Key', format, rateLimit } = options;
    const decorators = [
        (0, swagger_1.ApiSecurity)('api_key'),
        (0, swagger_1.ApiHeader)({
            name: keyName,
            description: `API key for authentication${format ? ` (format: ${format})` : ''}`,
            required: true,
            schema: {
                type: 'string',
                ...(format && { format }),
            },
        }),
    ];
    if (rateLimit) {
        decorators.push((0, swagger_1.ApiExtension)('x-api-key-rate-limit', {
            limit: rateLimit.limit,
            window: rateLimit.window,
            description: `Rate limit: ${rateLimit.limit} requests per ${rateLimit.window}`,
        }));
    }
    decorators.push((0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing API key',
    }), (0, swagger_1.ApiResponse)({
        status: 429,
        description: 'Too Many Requests - API key rate limit exceeded',
    }));
    return (0, common_1.applyDecorators)(...decorators);
}
function createApiKeyQuery(options = {}) {
    const { keyName = 'apikey', format } = options;
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('api_key'), (0, swagger_1.ApiQuery)({
        name: keyName,
        description: `API key for authentication${format ? ` (format: ${format})` : ''}`,
        required: true,
        schema: {
            type: 'string',
            ...(format && { format }),
        },
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing API key',
    }));
}
function createApiKeyCookie(options = {}) {
    const { keyName = 'api_session', format } = options;
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('cookie_auth'), (0, swagger_1.ApiExtension)('x-api-key-cookie', {
        name: keyName,
        format,
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        description: 'API key stored in secure HTTP-only cookie',
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing API key cookie',
    }));
}
//# sourceMappingURL=api-keys.js.map