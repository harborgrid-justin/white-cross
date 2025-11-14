"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOAuth2AuthorizationCodeFlow = createOAuth2AuthorizationCodeFlow;
exports.createOAuth2ImplicitFlow = createOAuth2ImplicitFlow;
exports.createOAuth2PasswordFlow = createOAuth2PasswordFlow;
exports.createOAuth2ClientCredentialsFlow = createOAuth2ClientCredentialsFlow;
exports.createOAuth2MultipleFlows = createOAuth2MultipleFlows;
exports.createOAuth2PkceFlow = createOAuth2PkceFlow;
exports.createOAuth2DeviceFlow = createOAuth2DeviceFlow;
exports.createOAuth2ScopeValidation = createOAuth2ScopeValidation;
exports.createJwtAuthentication = createJwtAuthentication;
exports.createJwtWithRefreshToken = createJwtWithRefreshToken;
exports.createJwtClaimsValidation = createJwtClaimsValidation;
exports.createJwtAudienceValidation = createJwtAudienceValidation;
exports.createJwtIssuerValidation = createJwtIssuerValidation;
exports.createJwtSignatureValidation = createJwtSignatureValidation;
exports.createJwtExpirationValidation = createJwtExpirationValidation;
exports.createApiKeyHeader = createApiKeyHeader;
exports.createApiKeyQuery = createApiKeyQuery;
exports.createApiKeyCookie = createApiKeyCookie;
exports.createHmacAuthentication = createHmacAuthentication;
exports.createMutualTlsAuthentication = createMutualTlsAuthentication;
exports.createApiKeyWithIpWhitelist = createApiKeyWithIpWhitelist;
exports.createRotatingApiKey = createRotatingApiKey;
exports.createBasicAuthentication = createBasicAuthentication;
exports.createDigestAuthentication = createDigestAuthentication;
exports.createOpenIdConnect = createOpenIdConnect;
exports.createSamlAuthentication = createSamlAuthentication;
exports.createCustomTokenAuth = createCustomTokenAuth;
exports.createSessionCookieAuth = createSessionCookieAuth;
exports.createAwsSignatureV4 = createAwsSignatureV4;
exports.createTotpAuthentication = createTotpAuthentication;
exports.createMultipleSecurityOr = createMultipleSecurityOr;
exports.createMultipleSecurityAnd = createMultipleSecurityAnd;
exports.createRoleBasedSecurity = createRoleBasedSecurity;
exports.createPermissionBasedSecurity = createPermissionBasedSecurity;
exports.createTenantBasedSecurity = createTenantBasedSecurity;
exports.createRateLimitSecurity = createRateLimitSecurity;
exports.createIpBasedSecurity = createIpBasedSecurity;
exports.createTimeBasedSecurity = createTimeBasedSecurity;
exports.createDeviceBasedSecurity = createDeviceBasedSecurity;
exports.createConditionalSecurity = createConditionalSecurity;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function createOAuth2AuthorizationCodeFlow(authorizationUrl, tokenUrl, scopes, refreshUrl) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtension)('x-oauth2-flow', {
        type: 'authorizationCode',
        authorizationUrl,
        tokenUrl,
        refreshUrl,
        scopes,
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - OAuth2 authentication required',
    }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient OAuth2 scopes',
    }));
}
function createOAuth2ImplicitFlow(authorizationUrl, scopes) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtension)('x-oauth2-flow', {
        type: 'implicit',
        authorizationUrl,
        scopes,
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - OAuth2 implicit flow authentication required',
    }));
}
function createOAuth2PasswordFlow(tokenUrl, scopes, refreshUrl) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtension)('x-oauth2-flow', {
        type: 'password',
        tokenUrl,
        refreshUrl,
        scopes,
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid username or password',
    }));
}
function createOAuth2ClientCredentialsFlow(tokenUrl, scopes) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtension)('x-oauth2-flow', {
        type: 'clientCredentials',
        tokenUrl,
        scopes,
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid client credentials',
    }));
}
function createOAuth2MultipleFlows(flows, preferredFlow) {
    const decorators = [
        (0, swagger_1.ApiExtension)('x-oauth2-flows', flows),
    ];
    if (preferredFlow) {
        decorators.push((0, swagger_1.ApiExtension)('x-preferred-flow', preferredFlow));
    }
    decorators.push((0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - OAuth2 authentication required',
    }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient OAuth2 permissions',
    }));
    return (0, common_1.applyDecorators)(...decorators);
}
function createOAuth2PkceFlow(authorizationUrl, tokenUrl, scopes, codeChallengeMethod = 'S256') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtension)('x-oauth2-pkce-flow', {
        authorizationUrl,
        tokenUrl,
        scopes,
        codeChallengeMethod,
        description: 'OAuth2 with PKCE (Proof Key for Code Exchange)',
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid PKCE flow',
    }));
}
function createOAuth2DeviceFlow(deviceAuthorizationUrl, tokenUrl, scopes) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtension)('x-oauth2-device-flow', {
        deviceAuthorizationUrl,
        tokenUrl,
        scopes,
        description: 'OAuth2 device authorization flow for limited-input devices',
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Device authorization pending or denied',
    }), (0, swagger_1.ApiResponse)({
        status: 428,
        description: 'Precondition Required - User must authorize device',
    }));
}
function createOAuth2ScopeValidation(requiredScopes, requireAll = false) {
    const scopeLogic = requireAll ? 'AND' : 'OR';
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('oauth2', requiredScopes), (0, swagger_1.ApiExtension)('x-required-scopes', {
        scopes: requiredScopes,
        logic: scopeLogic,
        description: `Requires ${scopeLogic === 'AND' ? 'all' : 'any'} of: ${requiredScopes.join(', ')}`,
    }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: `Forbidden - Missing required OAuth2 scopes (${scopeLogic}: ${requiredScopes.join(', ')})`,
    }));
}
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
function createHmacAuthentication(algorithm = 'sha256', requiredHeaders = ['date']) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('hmac'), (0, swagger_1.ApiHeader)({
        name: 'X-Signature',
        description: `HMAC ${algorithm.toUpperCase()} signature`,
        required: true,
        schema: {
            type: 'string',
            pattern: '^[a-f0-9]{64,128}$',
        },
    }), (0, swagger_1.ApiHeader)({
        name: 'X-Signature-Algorithm',
        description: 'Signature algorithm',
        required: false,
        schema: {
            type: 'string',
            enum: ['hmac-sha256', 'hmac-sha512'],
        },
    }), (0, swagger_1.ApiExtension)('x-hmac-signature', {
        algorithm,
        requiredHeaders,
        description: `Request must be signed with HMAC-${algorithm.toUpperCase()}`,
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing HMAC signature',
    }));
}
function createMutualTlsAuthentication(requiredCertificateFields = {}) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('mutualTLS'), (0, swagger_1.ApiExtension)('x-mtls-authentication', {
        requiredFields: requiredCertificateFields,
        description: 'Requires valid client certificate for mutual TLS authentication',
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing client certificate',
    }), (0, swagger_1.ApiResponse)({
        status: 495,
        description: 'SSL Certificate Error - Client certificate verification failed',
    }));
}
function createApiKeyWithIpWhitelist(keyName = 'X-API-Key', allowedIpRanges = []) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('api_key'), (0, swagger_1.ApiHeader)({
        name: keyName,
        description: 'API key with IP address restrictions',
        required: true,
    }), (0, swagger_1.ApiExtension)('x-ip-whitelist', {
        allowedRanges: allowedIpRanges,
        description: `Access restricted to IP ranges: ${allowedIpRanges.join(', ')}`,
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid API key',
    }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - IP address not in whitelist',
    }));
}
function createRotatingApiKey(keyName = 'X-API-Key', rotationPeriod = '30d', gracePeriod = '7d') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('api_key'), (0, swagger_1.ApiHeader)({
        name: keyName,
        description: 'Rotating API key',
        required: true,
    }), (0, swagger_1.ApiExtension)('x-key-rotation', {
        rotationPeriod,
        gracePeriod,
        description: `Keys rotate every ${rotationPeriod} with ${gracePeriod} grace period`,
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - API key expired or invalid',
    }), (0, swagger_1.ApiResponse)({
        status: 410,
        description: 'Gone - API key rotation required',
        headers: {
            'X-Key-Rotation-Required': {
                description: 'Indicates key rotation is required',
                schema: { type: 'boolean' },
            },
        },
    }));
}
function createBasicAuthentication(realm = 'Secured Area') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('basic'), (0, swagger_1.ApiHeader)({
        name: 'Authorization',
        description: 'Basic authentication credentials',
        required: true,
        schema: {
            type: 'string',
            pattern: '^Basic [A-Za-z0-9+/=]+$',
            example: 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=',
        },
    }), (0, swagger_1.ApiExtension)('x-basic-auth', {
        realm,
        description: `HTTP Basic authentication for realm: ${realm}`,
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid credentials',
        headers: {
            'WWW-Authenticate': {
                description: 'Authentication challenge',
                schema: { type: 'string', example: `Basic realm="${realm}"` },
            },
        },
    }));
}
function createDigestAuthentication(realm = 'Secured Area', algorithm = 'SHA-256') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('digest'), (0, swagger_1.ApiHeader)({
        name: 'Authorization',
        description: 'Digest authentication credentials',
        required: true,
    }), (0, swagger_1.ApiExtension)('x-digest-auth', {
        realm,
        algorithm,
        qop: 'auth',
        description: `HTTP Digest authentication with ${algorithm}`,
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid digest credentials',
        headers: {
            'WWW-Authenticate': {
                description: 'Digest authentication challenge',
                schema: { type: 'string' },
            },
        },
    }));
}
function createOpenIdConnect(discoveryUrl, clientId) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('openid'), (0, swagger_1.ApiExtension)('x-openid-connect', {
        discoveryUrl,
        clientId,
        description: 'OpenID Connect authentication',
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - OpenID Connect authentication required',
    }));
}
function createSamlAuthentication(entityId, ssoUrl) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('saml'), (0, swagger_1.ApiExtension)('x-saml-authentication', {
        entityId,
        ssoUrl,
        binding: 'HTTP-POST',
        description: 'SAML 2.0 authentication',
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - SAML authentication required',
    }));
}
function createCustomTokenAuth(tokenHeaderName, tokenFormat, validationEndpoint) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('custom_token'), (0, swagger_1.ApiHeader)({
        name: tokenHeaderName,
        description: `Custom authentication token (format: ${tokenFormat})`,
        required: true,
    }), (0, swagger_1.ApiExtension)('x-custom-token', {
        headerName: tokenHeaderName,
        format: tokenFormat,
        validationEndpoint,
        description: 'Custom proprietary token authentication',
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid custom token',
    }));
}
function createSessionCookieAuth(cookieName = 'sessionid', secure = true, sameSite = 'strict') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('session'), (0, swagger_1.ApiExtension)('x-session-cookie', {
        name: cookieName,
        httpOnly: true,
        secure,
        sameSite,
        description: 'Session-based authentication with secure cookies',
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or expired session',
    }));
}
function createAwsSignatureV4(service, region) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('aws_sig_v4'), (0, swagger_1.ApiHeader)({
        name: 'Authorization',
        description: 'AWS Signature Version 4',
        required: true,
    }), (0, swagger_1.ApiHeader)({
        name: 'X-Amz-Date',
        description: 'Request timestamp',
        required: true,
    }), (0, swagger_1.ApiExtension)('x-aws-signature-v4', {
        service,
        region,
        description: `AWS Signature Version 4 for service: ${service}`,
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid AWS signature',
    }));
}
function createTotpAuthentication(headerName = 'X-TOTP-Code', window = 30) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('totp'), (0, swagger_1.ApiHeader)({
        name: headerName,
        description: 'Time-based one-time password (6 digits)',
        required: true,
        schema: {
            type: 'string',
            pattern: '^[0-9]{6}$',
        },
    }), (0, swagger_1.ApiExtension)('x-totp', {
        window,
        digits: 6,
        algorithm: 'SHA1',
        description: `TOTP authentication with ${window}s window`,
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid TOTP code',
    }));
}
function createMultipleSecurityOr(schemes) {
    return (0, common_1.applyDecorators)(...schemes.map(scheme => (0, swagger_1.ApiSecurity)(scheme)), (0, swagger_1.ApiExtension)('x-security-logic', 'OR'), (0, swagger_1.ApiOperation)({
        description: `Authentication: Any of ${schemes.join(', ')}`,
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: `Unauthorized - Requires one of: ${schemes.join(', ')}`,
    }));
}
function createMultipleSecurityAnd(schemes) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtension)('x-security-requirements', schemes), (0, swagger_1.ApiExtension)('x-security-logic', 'AND'), (0, swagger_1.ApiOperation)({
        description: `Authentication: All of ${schemes.map(s => s.name).join(' AND ')}`,
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: `Unauthorized - Requires all of: ${schemes.map(s => s.name).join(', ')}`,
    }));
}
function createRoleBasedSecurity(requiredRoles, requireAll = false) {
    const logic = requireAll ? 'AND' : 'OR';
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtension)('x-rbac', {
        roles: requiredRoles,
        logic,
        description: `Requires ${logic === 'AND' ? 'all' : 'any'} roles: ${requiredRoles.join(', ')}`,
    }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: `Forbidden - Missing required role(s): ${requiredRoles.join(', ')}`,
    }));
}
function createPermissionBasedSecurity(requiredPermissions, resource) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtension)('x-permissions', {
        required: requiredPermissions,
        resource,
        description: `Requires permissions: ${requiredPermissions.join(', ')}${resource ? ` on resource: ${resource}` : ''}`,
    }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: `Forbidden - Missing required permissions: ${requiredPermissions.join(', ')}`,
    }));
}
function createTenantBasedSecurity(tenantIdSource = 'header', requiredTenants) {
    const decorators = [
        (0, swagger_1.ApiExtension)('x-tenant-security', {
            source: tenantIdSource,
            allowedTenants: requiredTenants,
            description: 'Multi-tenant access control',
        }),
    ];
    if (tenantIdSource === 'header') {
        decorators.push((0, swagger_1.ApiHeader)({
            name: 'X-Tenant-ID',
            description: 'Tenant identifier',
            required: true,
        }));
    }
    else if (tenantIdSource === 'query') {
        decorators.push((0, swagger_1.ApiQuery)({
            name: 'tenantId',
            description: 'Tenant identifier',
            required: true,
        }));
    }
    decorators.push((0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Invalid or unauthorized tenant',
    }));
    return (0, common_1.applyDecorators)(...decorators);
}
function createRateLimitSecurity(limit, window, scope = 'per-user') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtension)('x-rate-limit-security', {
        limit,
        window,
        scope,
        description: `Rate limit: ${limit} requests per ${window} (${scope})`,
    }), (0, swagger_1.ApiResponse)({
        status: 429,
        description: 'Too Many Requests - Rate limit exceeded',
        headers: {
            'X-RateLimit-Limit': {
                description: 'Request limit',
                schema: { type: 'integer', example: limit },
            },
            'X-RateLimit-Remaining': {
                description: 'Remaining requests',
                schema: { type: 'integer' },
            },
            'X-RateLimit-Reset': {
                description: 'Reset timestamp',
                schema: { type: 'integer' },
            },
            'Retry-After': {
                description: 'Seconds until retry allowed',
                schema: { type: 'integer' },
            },
        },
    }));
}
function createIpBasedSecurity(allowedIps = [], allowedCountries = []) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtension)('x-ip-security', {
        allowedIps,
        allowedCountries,
        description: 'IP address and geolocation restrictions',
    }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - IP address or location not allowed',
    }));
}
function createTimeBasedSecurity(allowedTimeWindows, timezone = 'UTC') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtension)('x-time-based-security', {
        windows: allowedTimeWindows,
        timezone,
        description: 'Time-based access restrictions',
    }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Access not allowed at this time',
    }));
}
function createDeviceBasedSecurity(requireTrustedDevice = true, deviceIdHeader = 'X-Device-ID') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiHeader)({
        name: deviceIdHeader,
        description: 'Device identifier',
        required: requireTrustedDevice,
    }), (0, swagger_1.ApiExtension)('x-device-security', {
        requireTrusted: requireTrustedDevice,
        deviceIdHeader,
        description: 'Device-based security and fingerprinting',
    }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Untrusted or unrecognized device',
    }));
}
function createConditionalSecurity(conditions) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtension)('x-conditional-security', {
        conditions,
        description: 'Dynamic security requirements based on operation context',
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Security requirements not met for this operation',
    }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions for this operation',
    }));
}
//# sourceMappingURL=swagger-security-schemes.service.js.map