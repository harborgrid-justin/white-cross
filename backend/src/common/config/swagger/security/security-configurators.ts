/**
 * OpenAPI Security Configuration Utilities
 *
 * Comprehensive security scheme configurators for OpenAPI documents.
 * Supports JWT, OAuth2, API Key, Basic Auth, and other authentication methods.
 *
 * @module swagger/security/security-configurators
 * @version 1.0.0
 */

import { DocumentBuilder } from '@nestjs/swagger';
import { OAuth2Flows } from '../types';

/**
 * Configures JWT Bearer token authentication scheme.
 *
 * @param builder - DocumentBuilder instance
 * @param name - Security scheme name
 * @param description - Scheme description
 * @param bearerFormat - Token format (e.g., 'JWT')
 * @returns DocumentBuilder instance with JWT security configured
 *
 * @example
 * ```typescript
 * const builder = configureJwtSecurity(
 *   baseBuilder,
 *   'bearer',
 *   'JWT authentication',
 *   'JWT'
 * );
 * ```
 */
export function configureJwtSecurity(
  builder: DocumentBuilder,
  name = 'bearer',
  description = 'JWT Bearer token authentication',
  bearerFormat = 'JWT',
): DocumentBuilder {
  return builder.addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat,
      description,
    },
    name,
  );
}

/**
 * Configures OAuth2 authentication with multiple flows.
 * Compliant with OpenAPI 3.0 OAuth2 Security Scheme.
 *
 * @param builder - DocumentBuilder instance
 * @param name - Security scheme name
 * @param flows - OAuth2 flow configurations (OAuth2Flows object)
 * @param description - Scheme description
 * @returns DocumentBuilder instance with OAuth2 configured
 *
 * @example
 * ```typescript
 * // Authorization Code Flow (recommended for web apps)
 * const builder = configureOAuth2Security(baseBuilder, 'oauth2', {
 *   authorizationCode: {
 *     authorizationUrl: 'https://example.com/oauth/authorize',
 *     tokenUrl: 'https://example.com/oauth/token',
 *     refreshUrl: 'https://example.com/oauth/refresh',
 *     scopes: {
 *       'read:users': 'Read user data',
 *       'write:users': 'Modify user data',
 *       'admin': 'Admin access'
 *     }
 *   }
 * }, 'OAuth2 Authorization Code Flow');
 * ```
 */
export function configureOAuth2Security(
  builder: DocumentBuilder,
  name = 'oauth2',
  flows: OAuth2Flows,
): DocumentBuilder {
  // Validate flows according to OpenAPI 3.0 specification
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

/**
 * Configures API key authentication (header, query, or cookie).
 *
 * @param builder - DocumentBuilder instance
 * @param name - Security scheme name
 * @param location - Where API key is provided
 * @param keyName - Name of the API key parameter
 * @param description - Scheme description
 * @returns DocumentBuilder instance with API key security configured
 *
 * @example
 * ```typescript
 * const builder = configureApiKeySecurity(
 *   baseBuilder,
 *   'api_key',
 *   'header',
 *   'X-API-Key'
 * );
 * ```
 */
export function configureApiKeySecurity(
  builder: DocumentBuilder,
  name = 'api_key',
  location: 'header' | 'query' | 'cookie' = 'header',
  keyName = 'X-API-Key',
  description = 'API Key authentication',
): DocumentBuilder {
  return builder.addApiKey(
    {
      type: 'apiKey',
      name: keyName,
      in: location,
      description,
    },
    name,
  );
}

/**
 * Configures HTTP Basic authentication scheme.
 *
 * @param builder - DocumentBuilder instance
 * @param name - Security scheme name
 * @param description - Scheme description
 * @returns DocumentBuilder instance with Basic auth configured
 *
 * @example
 * ```typescript
 * const builder = configureBasicAuthSecurity(
 *   baseBuilder,
 *   'basic',
 *   'HTTP Basic authentication'
 * );
 * ```
 */
export function configureBasicAuthSecurity(
  builder: DocumentBuilder,
  name = 'basic',
  description = 'HTTP Basic authentication',
): DocumentBuilder {
  return builder.addBasicAuth(
    {
      type: 'http',
      scheme: 'basic',
      description,
    },
    name,
  );
}

/**
 * Configures Bearer token authentication (generic).
 *
 * @param builder - DocumentBuilder instance
 * @param name - Security scheme name
 * @param bearerFormat - Token format
 * @param description - Scheme description
 * @returns DocumentBuilder instance with Bearer auth configured
 *
 * @example
 * ```typescript
 * const builder = configureBearerSecurity(
 *   baseBuilder,
 *   'bearer',
 *   'token',
 *   'Bearer token authentication'
 * );
 * ```
 */
export function configureBearerSecurity(
  builder: DocumentBuilder,
  name = 'bearer',
  bearerFormat?: string,
  description = 'Bearer token authentication',
): DocumentBuilder {
  return builder.addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      ...(bearerFormat && { bearerFormat }),
      description,
    },
    name,
  );
}

/**
 * Configures OpenID Connect authentication.
 *
 * @param builder - DocumentBuilder instance
 * @param name - Security scheme name
 * @param openIdConnectUrl - OpenID Connect discovery URL
 * @param description - Scheme description
 * @returns DocumentBuilder instance with OpenID Connect configured
 *
 * @example
 * ```typescript
 * const builder = configureOpenIdConnectSecurity(
 *   baseBuilder,
 *   'openid',
 *   'https://example.com/.well-known/openid-configuration'
 * );
 * ```
 */
export function configureOpenIdConnectSecurity(
  builder: DocumentBuilder,
  name = 'openid',
  openIdConnectUrl: string,
  description = 'OpenID Connect authentication',
): DocumentBuilder {
  return builder.addSecurity(name, {
    type: 'openIdConnect',
    openIdConnectUrl,
    description,
  });
}

/**
 * Configures cookie-based authentication.
 *
 * @param builder - DocumentBuilder instance
 * @param name - Security scheme name
 * @param cookieName - Name of the authentication cookie
 * @param description - Scheme description
 * @returns DocumentBuilder instance with cookie auth configured
 *
 * @example
 * ```typescript
 * const builder = configureCookieSecurity(
 *   baseBuilder,
 *   'session_cookie',
 *   'sessionId'
 * );
 * ```
 */
export function configureCookieSecurity(
  builder: DocumentBuilder,
  name = 'cookie_auth',
  cookieName = 'sessionId',
  description = 'Cookie-based authentication',
): DocumentBuilder {
  return builder.addCookieAuth(cookieName, name, description);
}

/**
 * Security scheme configuration interface
 */
interface SecuritySchemeConfig {
  type: 'jwt' | 'apiKey' | 'basic' | 'bearer' | 'oauth2' | 'cookie';
  name: string;
  location?: 'header' | 'query' | 'cookie';
  keyName?: string;
  bearerFormat?: string;
  flows?: OAuth2Flows;
  cookieName?: string;
  description?: string;
}

/**
 * Configures multiple security schemes simultaneously.
 *
 * @param builder - DocumentBuilder instance
 * @param schemes - Array of security scheme configurations
 * @returns DocumentBuilder instance with all security schemes configured
 *
 * @example
 * ```typescript
 * const builder = configureMultipleSecurity(baseBuilder, [
 *   { type: 'jwt', name: 'bearer' },
 *   { type: 'apiKey', name: 'api_key', location: 'header', keyName: 'X-API-Key' }
 * ]);
 * ```
 */
export function configureMultipleSecurity(
  builder: DocumentBuilder,
  schemes: SecuritySchemeConfig[],
): DocumentBuilder {
  let updatedBuilder = builder;

  schemes.forEach((scheme) => {
    switch (scheme.type) {
      case 'jwt':
        updatedBuilder = configureJwtSecurity(
          updatedBuilder,
          scheme.name,
          scheme.description,
          scheme.bearerFormat || 'JWT',
        );
        break;
      case 'apiKey':
        updatedBuilder = configureApiKeySecurity(
          updatedBuilder,
          scheme.name,
          scheme.location || 'header',
          scheme.keyName || 'X-API-Key',
          scheme.description,
        );
        break;
      case 'basic':
        updatedBuilder = configureBasicAuthSecurity(
          updatedBuilder,
          scheme.name,
          scheme.description,
        );
        break;
      case 'bearer':
        updatedBuilder = configureBearerSecurity(
          updatedBuilder,
          scheme.name,
          scheme.bearerFormat,
          scheme.description,
        );
        break;
      case 'oauth2':
        if (scheme.flows) {
          updatedBuilder = configureOAuth2Security(
            updatedBuilder,
            scheme.name,
            scheme.flows,
            scheme.description,
          );
        }
        break;
      case 'cookie':
        updatedBuilder = configureCookieSecurity(
          updatedBuilder,
          scheme.name,
          scheme.cookieName || 'sessionId',
          scheme.description,
        );
        break;
    }
  });

  return updatedBuilder;
}
