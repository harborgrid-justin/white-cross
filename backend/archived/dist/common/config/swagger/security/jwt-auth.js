"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJwtAuthentication = createJwtAuthentication;
exports.createJwtWithRefreshToken = createJwtWithRefreshToken;
exports.createJwtClaimsValidation = createJwtClaimsValidation;
exports.createJwtAudienceValidation = createJwtAudienceValidation;
exports.createJwtIssuerValidation = createJwtIssuerValidation;
exports.createJwtSignatureValidation = createJwtSignatureValidation;
exports.createJwtExpirationValidation = createJwtExpirationValidation;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function createJwtAuthentication(options = {}) {
    const decorators = [
        (0, swagger_1.ApiSecurity)('bearer', options.scopes || []),
        (0, swagger_1.ApiHeader)({
            name: 'Authorization',
            description: 'JWT Bearer token',
            required: true,
            schema: {
                type: 'string',
                pattern: '^Bearer [A-Za-z0-9-_=]+\\.[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_.+/=]*$',
                example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
        }),
    ];
    if (options.issuer || options.audience || options.requiredClaims) {
        decorators.push((0, swagger_1.ApiExtension)('x-jwt-requirements', {
            issuer: options.issuer,
            audience: options.audience,
            requiredClaims: options.requiredClaims,
            expiresIn: options.expiresIn,
        }));
    }
    decorators.push((0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing JWT token',
    }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - JWT token lacks required permissions',
    }));
    return (0, common_1.applyDecorators)(...decorators);
}
function createJwtWithRefreshToken(accessTokenExpiry = '15m', refreshTokenExpiry = '7d') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('bearer'), (0, swagger_1.ApiExtension)('x-jwt-refresh', {
        accessTokenExpiry,
        refreshTokenExpiry,
        refreshEndpoint: '/auth/refresh',
        description: 'Supports access token refresh using refresh tokens',
    }), (0, swagger_1.ApiHeader)({
        name: 'Authorization',
        description: 'JWT Bearer access token',
        required: true,
    }), (0, swagger_1.ApiHeader)({
        name: 'X-Refresh-Token',
        description: 'Refresh token for obtaining new access token',
        required: false,
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Access token expired or invalid',
    }));
}
function createJwtClaimsValidation(requiredClaims, optionalClaims = []) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('bearer'), (0, swagger_1.ApiExtension)('x-jwt-claims-validation', {
        required: requiredClaims,
        optional: optionalClaims,
        description: `Required claims: ${Object.keys(requiredClaims).join(', ')}`,
    }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: `Forbidden - JWT missing required claims: ${Object.keys(requiredClaims).join(', ')}`,
    }));
}
function createJwtAudienceValidation(allowedAudiences, requireExactMatch = true) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('bearer'), (0, swagger_1.ApiExtension)('x-jwt-audience-validation', {
        allowedAudiences,
        requireExactMatch,
        description: `JWT must have audience: ${allowedAudiences.join(' OR ')}`,
    }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: `Forbidden - JWT audience not in allowed list: ${allowedAudiences.join(', ')}`,
    }));
}
function createJwtIssuerValidation(trustedIssuers) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('bearer'), (0, swagger_1.ApiExtension)('x-jwt-issuer-validation', {
        trustedIssuers,
        description: `JWT must be issued by: ${trustedIssuers.join(' OR ')}`,
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: `Unauthorized - JWT issuer not trusted. Allowed: ${trustedIssuers.join(', ')}`,
    }));
}
function createJwtSignatureValidation(allowedAlgorithms, publicKeyUrl) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('bearer'), (0, swagger_1.ApiExtension)('x-jwt-signature-validation', {
        allowedAlgorithms,
        publicKeyUrl,
        description: `JWT must be signed with: ${allowedAlgorithms.join(' OR ')}`,
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid JWT signature',
    }));
}
function createJwtExpirationValidation(maxAge, gracePeriod = 0) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('bearer'), (0, swagger_1.ApiExtension)('x-jwt-expiration-validation', {
        maxAge,
        gracePeriod,
        description: `JWT must not be older than ${maxAge}s (grace period: ${gracePeriod}s)`,
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: `Unauthorized - JWT expired (max age: ${maxAge}s)`,
    }));
}
//# sourceMappingURL=jwt-auth.js.map