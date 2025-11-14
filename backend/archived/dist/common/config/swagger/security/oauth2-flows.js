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
    const decorators = [(0, swagger_1.ApiExtension)('x-oauth2-flows', flows)];
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
//# sourceMappingURL=oauth2-flows.js.map