"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.createDeviceBasedSecurity = createDeviceBasedSecurity;
exports.createConditionalSecurity = createConditionalSecurity;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function createHmacAuthentication(options = {}) {
    const { algorithm = 'sha256', signatureHeader = 'X-Signature', timestampHeader = 'X-Timestamp', clockSkewTolerance = 300, } = options;
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('hmac'), (0, swagger_1.ApiHeader)({
        name: signatureHeader,
        description: `HMAC ${algorithm.toUpperCase()} signature`,
        required: true,
        schema: {
            type: 'string',
            pattern: '^[a-f0-9]{64,128}$',
        },
    }), (0, swagger_1.ApiHeader)({
        name: timestampHeader,
        description: 'Request timestamp',
        required: true,
        schema: {
            type: 'string',
            format: 'date-time',
        },
    }), (0, swagger_1.ApiExtension)('x-hmac-signature', {
        algorithm,
        signatureHeader,
        timestampHeader,
        clockSkewTolerance,
        description: `Request must be signed with HMAC-${algorithm.toUpperCase()}`,
    }), (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing HMAC signature',
    }), (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Clock skew tolerance exceeded',
    }));
}
function createMutualTlsAuthentication(options = {}) {
    const { validationLevel = 'basic', trustedCAs = [], clientCertRequired = true } = options;
    return (0, common_1.applyDecorators)((0, swagger_1.ApiSecurity)('mutualTLS'), (0, swagger_1.ApiExtension)('x-mtls-authentication', {
        validationLevel,
        trustedCAs,
        clientCertRequired,
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
function createDeviceBasedSecurity(options = {}) {
    const { requireTrustedDevice = true, deviceIdHeader = 'X-Device-ID', enableFingerprinting = false, } = options;
    return (0, common_1.applyDecorators)((0, swagger_1.ApiHeader)({
        name: deviceIdHeader,
        description: 'Device identifier',
        required: requireTrustedDevice,
    }), (0, swagger_1.ApiExtension)('x-device-security', {
        requireTrusted: requireTrustedDevice,
        deviceIdHeader,
        enableFingerprinting,
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
//# sourceMappingURL=advanced-auth.js.map