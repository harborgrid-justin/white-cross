"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureJwtSecurity = configureJwtSecurity;
exports.configureOAuth2Security = configureOAuth2Security;
exports.configureApiKeySecurity = configureApiKeySecurity;
exports.configureBasicAuthSecurity = configureBasicAuthSecurity;
exports.configureBearerSecurity = configureBearerSecurity;
exports.configureOpenIdConnectSecurity = configureOpenIdConnectSecurity;
exports.configureCookieSecurity = configureCookieSecurity;
exports.configureMultipleSecurity = configureMultipleSecurity;
function configureJwtSecurity(builder, name = 'bearer', description = 'JWT Bearer token authentication', bearerFormat = 'JWT') {
    return builder.addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat,
        description,
    }, name);
}
function configureOAuth2Security(builder, name = 'oauth2', flows) {
    if (flows.authorizationCode) {
        if (!flows.authorizationCode.authorizationUrl || !flows.authorizationCode.tokenUrl) {
            throw new Error('Authorization Code flow requires both authorizationUrl and tokenUrl');
        }
    }
    if (flows.implicit && !flows.implicit.authorizationUrl) {
        throw new Error('Implicit flow requires authorizationUrl');
    }
    if (flows.password && !flows.password.tokenUrl) {
        throw new Error('Password flow requires tokenUrl');
    }
    if (flows.clientCredentials && !flows.clientCredentials.tokenUrl) {
        throw new Error('Client Credentials flow requires tokenUrl');
    }
    return builder.addOAuth2(flows, name);
}
function configureApiKeySecurity(builder, name = 'api_key', location = 'header', keyName = 'X-API-Key', description = 'API Key authentication') {
    return builder.addApiKey({
        type: 'apiKey',
        name: keyName,
        in: location,
        description,
    }, name);
}
function configureBasicAuthSecurity(builder, name = 'basic', description = 'HTTP Basic authentication') {
    return builder.addBasicAuth({
        type: 'http',
        scheme: 'basic',
        description,
    }, name);
}
function configureBearerSecurity(builder, name = 'bearer', bearerFormat, description = 'Bearer token authentication') {
    return builder.addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        ...(bearerFormat && { bearerFormat }),
        description,
    }, name);
}
function configureOpenIdConnectSecurity(builder, name = 'openid', openIdConnectUrl, description = 'OpenID Connect authentication') {
    return builder.addSecurity(name, {
        type: 'openIdConnect',
        openIdConnectUrl,
        description,
    });
}
function configureCookieSecurity(builder, name = 'cookie_auth', cookieName = 'sessionId', description = 'Cookie-based authentication') {
    return builder.addCookieAuth(cookieName, name, description);
}
function configureMultipleSecurity(builder, schemes) {
    let updatedBuilder = builder;
    schemes.forEach((scheme) => {
        switch (scheme.type) {
            case 'jwt':
                updatedBuilder = configureJwtSecurity(updatedBuilder, scheme.name, scheme.description, scheme.bearerFormat || 'JWT');
                break;
            case 'apiKey':
                updatedBuilder = configureApiKeySecurity(updatedBuilder, scheme.name, scheme.location || 'header', scheme.keyName || 'X-API-Key', scheme.description);
                break;
            case 'basic':
                updatedBuilder = configureBasicAuthSecurity(updatedBuilder, scheme.name, scheme.description);
                break;
            case 'bearer':
                updatedBuilder = configureBearerSecurity(updatedBuilder, scheme.name, scheme.bearerFormat, scheme.description);
                break;
            case 'oauth2':
                if (scheme.flows) {
                    updatedBuilder = configureOAuth2Security(updatedBuilder, scheme.name, scheme.flows, scheme.description);
                }
                break;
            case 'cookie':
                updatedBuilder = configureCookieSecurity(updatedBuilder, scheme.name, scheme.cookieName || 'sessionId', scheme.description);
                break;
        }
    });
    return updatedBuilder;
}
//# sourceMappingURL=security-configurators.js.map