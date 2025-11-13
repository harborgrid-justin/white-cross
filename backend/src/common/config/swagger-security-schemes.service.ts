/**
 * Swagger/OpenAPI Security Schemes
 *
 * Production-ready TypeScript utilities for OAuth2, JWT, API keys,
 * custom authentication, and security requirements.
 * Compliant with OpenAPI 3.0/3.1 security scheme specifications.
 *
 * @module swagger-security-schemes
 * @version 1.0.0
 */

import { applyDecorators } from '@nestjs/common';
import {
  ApiSecurity,
  ApiHeader,
  ApiQuery,
  ApiResponse,
  ApiExtension,
  ApiOperation,
} from '@nestjs/swagger';

/**
 * Type definitions for security configuration
 */

export interface OAuth2FlowConfig {
  /** Authorization URL (required for authorizationCode and implicit flows) */
  authorizationUrl?: string;
  /** Token URL (required for authorizationCode, password, clientCredentials) */
  tokenUrl?: string;
  /** Refresh token URL */
  refreshUrl?: string;
  /** Available OAuth2 scopes */
  scopes: Record<string, string>;
}

export interface SecuritySchemeConfig {
  /** Security scheme name */
  name: string;
  /** Security scheme type */
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
  /** Scheme description */
  description?: string;
  /** API key location (for apiKey type) */
  in?: 'query' | 'header' | 'cookie';
  /** HTTP scheme (for http type) */
  scheme?: string;
  /** Bearer format (for http bearer) */
  bearerFormat?: string;
  /** OAuth2 flows (for oauth2 type) */
  flows?: {
    implicit?: OAuth2FlowConfig;
    password?: OAuth2FlowConfig;
    clientCredentials?: OAuth2FlowConfig;
    authorizationCode?: OAuth2FlowConfig;
  };
  /** OpenID Connect URL (for openIdConnect type) */
  openIdConnectUrl?: string;
}

export interface JwtSecurityOptions {
  /** Required scopes */
  scopes?: string[];
  /** JWT issuer */
  issuer?: string;
  /** JWT audience */
  audience?: string[];
  /** Token expiration time */
  expiresIn?: string;
  /** Custom claims required */
  requiredClaims?: string[];
}

export interface ApiKeyOptions {
  /** API key parameter name */
  keyName?: string;
  /** API key location */
  location?: 'header' | 'query' | 'cookie';
  /** Key format description */
  format?: string;
  /** Rate limit info */
  rateLimit?: { limit: number; window: string };
}

// ============================================================================
// OAUTH2 FLOW CONFIGURATORS (8 functions)
// ============================================================================

/**
 * Creates OAuth2 authorization code flow configuration.
 * The most common OAuth2 flow for web applications.
 *
 * @param authorizationUrl - Authorization endpoint URL
 * @param tokenUrl - Token endpoint URL
 * @param scopes - Available scopes with descriptions
 * @param refreshUrl - Optional refresh token URL
 * @returns OAuth2 authorization code flow configuration
 *
 * @example
 * ```typescript
 * @ApiSecurity('oauth2')
 * @createOAuth2AuthorizationCodeFlow(
 *   'https://auth.example.com/oauth/authorize',
 *   'https://auth.example.com/oauth/token',
 *   { 'read:users': 'Read user data', 'write:users': 'Modify user data' },
 *   'https://auth.example.com/oauth/refresh'
 * )
 * async protectedEndpoint() { }
 * ```
 */
export function createOAuth2AuthorizationCodeFlow(
  authorizationUrl: string,
  tokenUrl: string,
  scopes: Record<string, string>,
  refreshUrl?: string
) {
  return applyDecorators(
    ApiExtension('x-oauth2-flow', {
      type: 'authorizationCode',
      authorizationUrl,
      tokenUrl,
      refreshUrl,
      scopes,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - OAuth2 authentication required',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient OAuth2 scopes',
    })
  );
}

/**
 * Creates OAuth2 implicit flow configuration.
 * Simplified flow for browser-based applications.
 *
 * @param authorizationUrl - Authorization endpoint URL
 * @param scopes - Available scopes with descriptions
 * @returns OAuth2 implicit flow configuration
 *
 * @example
 * ```typescript
 * @createOAuth2ImplicitFlow(
 *   'https://auth.example.com/oauth/authorize',
 *   { 'read:data': 'Read access' }
 * )
 * async publicDataEndpoint() { }
 * ```
 */
export function createOAuth2ImplicitFlow(
  authorizationUrl: string,
  scopes: Record<string, string>
) {
  return applyDecorators(
    ApiExtension('x-oauth2-flow', {
      type: 'implicit',
      authorizationUrl,
      scopes,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - OAuth2 implicit flow authentication required',
    })
  );
}

/**
 * Creates OAuth2 password credentials flow configuration.
 * Flow for trusted applications with username/password.
 *
 * @param tokenUrl - Token endpoint URL
 * @param scopes - Available scopes with descriptions
 * @param refreshUrl - Optional refresh token URL
 * @returns OAuth2 password flow configuration
 *
 * @example
 * ```typescript
 * @createOAuth2PasswordFlow(
 *   'https://auth.example.com/oauth/token',
 *   { 'api:access': 'Full API access' }
 * )
 * async trustedAppEndpoint() { }
 * ```
 */
export function createOAuth2PasswordFlow(
  tokenUrl: string,
  scopes: Record<string, string>,
  refreshUrl?: string
) {
  return applyDecorators(
    ApiExtension('x-oauth2-flow', {
      type: 'password',
      tokenUrl,
      refreshUrl,
      scopes,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid username or password',
    })
  );
}

/**
 * Creates OAuth2 client credentials flow configuration.
 * Flow for machine-to-machine authentication.
 *
 * @param tokenUrl - Token endpoint URL
 * @param scopes - Available scopes with descriptions
 * @returns OAuth2 client credentials flow configuration
 *
 * @example
 * ```typescript
 * @createOAuth2ClientCredentialsFlow(
 *   'https://auth.example.com/oauth/token',
 *   { 'service:read': 'Service read access', 'service:write': 'Service write access' }
 * )
 * async serviceToServiceEndpoint() { }
 * ```
 */
export function createOAuth2ClientCredentialsFlow(
  tokenUrl: string,
  scopes: Record<string, string>
) {
  return applyDecorators(
    ApiExtension('x-oauth2-flow', {
      type: 'clientCredentials',
      tokenUrl,
      scopes,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid client credentials',
    })
  );
}

/**
 * Creates multiple OAuth2 flows configuration.
 * Supports multiple OAuth2 flows simultaneously.
 *
 * @param flows - Multiple flow configurations
 * @param preferredFlow - Preferred flow for documentation
 * @returns Multiple OAuth2 flows configuration
 *
 * @example
 * ```typescript
 * @createOAuth2MultipleFlows({
 *   authorizationCode: {
 *     authorizationUrl: 'https://auth.example.com/authorize',
 *     tokenUrl: 'https://auth.example.com/token',
 *     scopes: { 'read': 'Read', 'write': 'Write' }
 *   },
 *   clientCredentials: {
 *     tokenUrl: 'https://auth.example.com/token',
 *     scopes: { 'api': 'API Access' }
 *   }
 * }, 'authorizationCode')
 * async flexibleAuthEndpoint() { }
 * ```
 */
export function createOAuth2MultipleFlows(
  flows: {
    implicit?: OAuth2FlowConfig;
    password?: OAuth2FlowConfig;
    clientCredentials?: OAuth2FlowConfig;
    authorizationCode?: OAuth2FlowConfig;
  },
  preferredFlow?: string
) {
  const decorators: any[] = [
    ApiExtension('x-oauth2-flows', flows),
  ];

  if (preferredFlow) {
    decorators.push(ApiExtension('x-preferred-flow', preferredFlow));
  }

  decorators.push(
    ApiResponse({
      status: 401,
      description: 'Unauthorized - OAuth2 authentication required',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient OAuth2 permissions',
    })
  );

  return applyDecorators(...decorators);
}

/**
 * Creates OAuth2 PKCE flow configuration.
 * Authorization code flow with Proof Key for Code Exchange (enhanced security).
 *
 * @param authorizationUrl - Authorization endpoint URL
 * @param tokenUrl - Token endpoint URL
 * @param scopes - Available scopes with descriptions
 * @param codeChallengeMethod - PKCE challenge method (S256 or plain)
 * @returns OAuth2 PKCE flow configuration
 *
 * @example
 * ```typescript
 * @createOAuth2PkceFlow(
 *   'https://auth.example.com/oauth/authorize',
 *   'https://auth.example.com/oauth/token',
 *   { 'profile': 'User profile', 'email': 'Email address' },
 *   'S256'
 * )
 * async mobileAppEndpoint() { }
 * ```
 */
export function createOAuth2PkceFlow(
  authorizationUrl: string,
  tokenUrl: string,
  scopes: Record<string, string>,
  codeChallengeMethod: 'S256' | 'plain' = 'S256'
) {
  return applyDecorators(
    ApiExtension('x-oauth2-pkce-flow', {
      authorizationUrl,
      tokenUrl,
      scopes,
      codeChallengeMethod,
      description: 'OAuth2 with PKCE (Proof Key for Code Exchange)',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid PKCE flow',
    })
  );
}

/**
 * Creates OAuth2 device authorization flow configuration.
 * Flow for devices with limited input capabilities (IoT, smart TVs).
 *
 * @param deviceAuthorizationUrl - Device authorization endpoint
 * @param tokenUrl - Token endpoint URL
 * @param scopes - Available scopes with descriptions
 * @returns OAuth2 device flow configuration
 *
 * @example
 * ```typescript
 * @createOAuth2DeviceFlow(
 *   'https://auth.example.com/oauth/device',
 *   'https://auth.example.com/oauth/token',
 *   { 'device:access': 'Device access' }
 * )
 * async iotDeviceEndpoint() { }
 * ```
 */
export function createOAuth2DeviceFlow(
  deviceAuthorizationUrl: string,
  tokenUrl: string,
  scopes: Record<string, string>
) {
  return applyDecorators(
    ApiExtension('x-oauth2-device-flow', {
      deviceAuthorizationUrl,
      tokenUrl,
      scopes,
      description: 'OAuth2 device authorization flow for limited-input devices',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Device authorization pending or denied',
    }),
    ApiResponse({
      status: 428,
      description: 'Precondition Required - User must authorize device',
    })
  );
}

/**
 * Creates OAuth2 scope validation decorator.
 * Validates required OAuth2 scopes for endpoint access.
 *
 * @param requiredScopes - Array of required scope strings
 * @param requireAll - Whether all scopes are required (AND) or any (OR)
 * @returns OAuth2 scope validation configuration
 *
 * @example
 * ```typescript
 * @createOAuth2ScopeValidation(['read:users', 'write:users'], true)
 * async manageUsersEndpoint() { }
 * ```
 */
export function createOAuth2ScopeValidation(
  requiredScopes: string[],
  requireAll = false
) {
  const scopeLogic = requireAll ? 'AND' : 'OR';

  return applyDecorators(
    ApiSecurity('oauth2', requiredScopes),
    ApiExtension('x-required-scopes', {
      scopes: requiredScopes,
      logic: scopeLogic,
      description: `Requires ${scopeLogic === 'AND' ? 'all' : 'any'} of: ${requiredScopes.join(', ')}`,
    }),
    ApiResponse({
      status: 403,
      description: `Forbidden - Missing required OAuth2 scopes (${scopeLogic}: ${requiredScopes.join(', ')})`,
    })
  );
}

// ============================================================================
// JWT AUTHENTICATION BUILDERS (7 functions)
// ============================================================================

/**
 * Creates JWT bearer authentication decorator.
 * Standard JWT token authentication via Authorization header.
 *
 * @param options - JWT security options
 * @returns JWT authentication configuration
 *
 * @example
 * ```typescript
 * @createJwtAuthentication({
 *   scopes: ['admin'],
 *   issuer: 'https://auth.example.com',
 *   audience: ['api.example.com'],
 *   requiredClaims: ['sub', 'email']
 * })
 * async adminEndpoint() { }
 * ```
 */
export function createJwtAuthentication(options: JwtSecurityOptions = {}) {
  const decorators: any[] = [
    ApiSecurity('bearer', options.scopes || []),
    ApiHeader({
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
    decorators.push(
      ApiExtension('x-jwt-requirements', {
        issuer: options.issuer,
        audience: options.audience,
        requiredClaims: options.requiredClaims,
        expiresIn: options.expiresIn,
      })
    );
  }

  decorators.push(
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing JWT token',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - JWT token lacks required permissions',
    })
  );

  return applyDecorators(...decorators);
}

/**
 * Creates JWT with refresh token support.
 * JWT authentication with token refresh capabilities.
 *
 * @param accessTokenExpiry - Access token expiration time
 * @param refreshTokenExpiry - Refresh token expiration time
 * @returns JWT with refresh token configuration
 *
 * @example
 * ```typescript
 * @createJwtWithRefreshToken('15m', '7d')
 * async protectedEndpoint() { }
 * ```
 */
export function createJwtWithRefreshToken(
  accessTokenExpiry = '15m',
  refreshTokenExpiry = '7d'
) {
  return applyDecorators(
    ApiSecurity('bearer'),
    ApiExtension('x-jwt-refresh', {
      accessTokenExpiry,
      refreshTokenExpiry,
      refreshEndpoint: '/auth/refresh',
      description: 'Supports access token refresh using refresh tokens',
    }),
    ApiHeader({
      name: 'Authorization',
      description: 'JWT Bearer access token',
      required: true,
    }),
    ApiHeader({
      name: 'X-Refresh-Token',
      description: 'Refresh token for obtaining new access token',
      required: false,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Access token expired or invalid',
    })
  );
}

/**
 * Creates JWT claims validation decorator.
 * Validates specific JWT claims for endpoint access.
 *
 * @param requiredClaims - Map of claim names to expected values
 * @param optionalClaims - Optional claims to validate if present
 * @returns JWT claims validation configuration
 *
 * @example
 * ```typescript
 * @createJwtClaimsValidation(
 *   { role: 'admin', verified: true },
 *   ['department', 'tenant_id']
 * )
 * async restrictedEndpoint() { }
 * ```
 */
export function createJwtClaimsValidation(
  requiredClaims: Record<string, any>,
  optionalClaims: string[] = []
) {
  return applyDecorators(
    ApiSecurity('bearer'),
    ApiExtension('x-jwt-claims-validation', {
      required: requiredClaims,
      optional: optionalClaims,
      description: `Required claims: ${Object.keys(requiredClaims).join(', ')}`,
    }),
    ApiResponse({
      status: 403,
      description: `Forbidden - JWT missing required claims: ${Object.keys(requiredClaims).join(', ')}`,
    })
  );
}

/**
 * Creates JWT audience validation decorator.
 * Validates JWT audience claim for multi-tenant scenarios.
 *
 * @param allowedAudiences - Array of allowed audience values
 * @param requireExactMatch - Whether audience must match exactly
 * @returns JWT audience validation configuration
 *
 * @example
 * ```typescript
 * @createJwtAudienceValidation(['api.example.com', 'admin.example.com'], true)
 * async audienceRestrictedEndpoint() { }
 * ```
 */
export function createJwtAudienceValidation(
  allowedAudiences: string[],
  requireExactMatch = true
) {
  return applyDecorators(
    ApiSecurity('bearer'),
    ApiExtension('x-jwt-audience-validation', {
      allowedAudiences,
      requireExactMatch,
      description: `JWT must have audience: ${allowedAudiences.join(' OR ')}`,
    }),
    ApiResponse({
      status: 403,
      description: `Forbidden - JWT audience not in allowed list: ${allowedAudiences.join(', ')}`,
    })
  );
}

/**
 * Creates JWT issuer validation decorator.
 * Validates JWT issuer for trusted identity providers.
 *
 * @param trustedIssuers - Array of trusted issuer URLs
 * @returns JWT issuer validation configuration
 *
 * @example
 * ```typescript
 * @createJwtIssuerValidation(['https://auth.example.com', 'https://sso.example.com'])
 * async trustedIssuerEndpoint() { }
 * ```
 */
export function createJwtIssuerValidation(trustedIssuers: string[]) {
  return applyDecorators(
    ApiSecurity('bearer'),
    ApiExtension('x-jwt-issuer-validation', {
      trustedIssuers,
      description: `JWT must be issued by: ${trustedIssuers.join(' OR ')}`,
    }),
    ApiResponse({
      status: 401,
      description: `Unauthorized - JWT issuer not trusted. Allowed: ${trustedIssuers.join(', ')}`,
    })
  );
}

/**
 * Creates JWT signature validation decorator.
 * Documents JWT signature algorithm requirements.
 *
 * @param allowedAlgorithms - Array of allowed signature algorithms
 * @param publicKeyUrl - URL to fetch public keys (JWKS)
 * @returns JWT signature validation configuration
 *
 * @example
 * ```typescript
 * @createJwtSignatureValidation(
 *   ['RS256', 'RS384', 'RS512'],
 *   'https://auth.example.com/.well-known/jwks.json'
 * )
 * async signatureValidatedEndpoint() { }
 * ```
 */
export function createJwtSignatureValidation(
  allowedAlgorithms: string[],
  publicKeyUrl?: string
) {
  return applyDecorators(
    ApiSecurity('bearer'),
    ApiExtension('x-jwt-signature-validation', {
      allowedAlgorithms,
      publicKeyUrl,
      description: `JWT must be signed with: ${allowedAlgorithms.join(' OR ')}`,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid JWT signature',
    })
  );
}

/**
 * Creates JWT expiration validation decorator.
 * Documents JWT expiration requirements and grace periods.
 *
 * @param maxAge - Maximum token age in seconds
 * @param gracePeriod - Grace period for expired tokens in seconds
 * @returns JWT expiration validation configuration
 *
 * @example
 * ```typescript
 * @createJwtExpirationValidation(3600, 300)
 * async expirationCheckedEndpoint() { }
 * ```
 */
export function createJwtExpirationValidation(
  maxAge: number,
  gracePeriod = 0
) {
  return applyDecorators(
    ApiSecurity('bearer'),
    ApiExtension('x-jwt-expiration-validation', {
      maxAge,
      gracePeriod,
      description: `JWT must not be older than ${maxAge}s (grace period: ${gracePeriod}s)`,
    }),
    ApiResponse({
      status: 401,
      description: `Unauthorized - JWT expired (max age: ${maxAge}s)`,
    })
  );
}

// ============================================================================
// API KEY SCHEMES (7 functions)
// ============================================================================

/**
 * Creates API key header authentication.
 * Standard API key in custom header.
 *
 * @param options - API key options
 * @returns API key header authentication configuration
 *
 * @example
 * ```typescript
 * @createApiKeyHeader({ keyName: 'X-API-Key', format: 'uuid', rateLimit: { limit: 1000, window: '1h' } })
 * async apiKeyProtectedEndpoint() { }
 * ```
 */
export function createApiKeyHeader(options: ApiKeyOptions = {}) {
  const { keyName = 'X-API-Key', format, rateLimit } = options;

  const decorators: any[] = [
    ApiSecurity('api_key'),
    ApiHeader({
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
    decorators.push(
      ApiExtension('x-api-key-rate-limit', {
        limit: rateLimit.limit,
        window: rateLimit.window,
        description: `Rate limit: ${rateLimit.limit} requests per ${rateLimit.window}`,
      })
    );
  }

  decorators.push(
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing API key',
    }),
    ApiResponse({
      status: 429,
      description: 'Too Many Requests - API key rate limit exceeded',
    })
  );

  return applyDecorators(...decorators);
}

/**
 * Creates API key query parameter authentication.
 * API key passed as query parameter (less secure, for public APIs).
 *
 * @param options - API key options
 * @returns API key query authentication configuration
 *
 * @example
 * ```typescript
 * @createApiKeyQuery({ keyName: 'apikey' })
 * async publicApiEndpoint(@Query('apikey') apiKey: string) { }
 * ```
 */
export function createApiKeyQuery(options: ApiKeyOptions = {}) {
  const { keyName = 'apikey', format } = options;

  return applyDecorators(
    ApiSecurity('api_key'),
    ApiQuery({
      name: keyName,
      description: `API key for authentication${format ? ` (format: ${format})` : ''}`,
      required: true,
      schema: {
        type: 'string',
        ...(format && { format }),
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing API key',
    })
  );
}

/**
 * Creates API key cookie authentication.
 * API key stored in secure HTTP-only cookie.
 *
 * @param options - API key options
 * @returns API key cookie authentication configuration
 *
 * @example
 * ```typescript
 * @createApiKeyCookie({ keyName: 'api_session', format: 'uuid' })
 * async cookieAuthEndpoint() { }
 * ```
 */
export function createApiKeyCookie(options: ApiKeyOptions = {}) {
  const { keyName = 'api_session', format } = options;

  return applyDecorators(
    ApiSecurity('cookie_auth'),
    ApiExtension('x-api-key-cookie', {
      name: keyName,
      format,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      description: 'API key stored in secure HTTP-only cookie',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing API key cookie',
    })
  );
}

/**
 * Creates HMAC signature authentication.
 * Request signing with HMAC for enhanced security.
 *
 * @param algorithm - HMAC algorithm (sha256, sha512)
 * @param requiredHeaders - Headers to include in signature
 * @returns HMAC authentication configuration
 *
 * @example
 * ```typescript
 * @createHmacAuthentication('sha256', ['date', 'content-type', 'x-request-id'])
 * async hmacProtectedEndpoint() { }
 * ```
 */
export function createHmacAuthentication(
  algorithm: 'sha256' | 'sha512' = 'sha256',
  requiredHeaders: string[] = ['date']
) {
  return applyDecorators(
    ApiSecurity('hmac'),
    ApiHeader({
      name: 'X-Signature',
      description: `HMAC ${algorithm.toUpperCase()} signature`,
      required: true,
      schema: {
        type: 'string',
        pattern: '^[a-f0-9]{64,128}$',
      },
    }),
    ApiHeader({
      name: 'X-Signature-Algorithm',
      description: 'Signature algorithm',
      required: false,
      schema: {
        type: 'string',
        enum: ['hmac-sha256', 'hmac-sha512'],
      },
    }),
    ApiExtension('x-hmac-signature', {
      algorithm,
      requiredHeaders,
      description: `Request must be signed with HMAC-${algorithm.toUpperCase()}`,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing HMAC signature',
    })
  );
}

/**
 * Creates mutual TLS (mTLS) authentication.
 * Client certificate authentication for enhanced security.
 *
 * @param requiredCertificateFields - Required certificate fields
 * @returns mTLS authentication configuration
 *
 * @example
 * ```typescript
 * @createMutualTlsAuthentication({
 *   commonName: true,
 *   organization: true,
 *   serialNumber: true
 * })
 * async mtlsProtectedEndpoint() { }
 * ```
 */
export function createMutualTlsAuthentication(
  requiredCertificateFields: {
    commonName?: boolean;
    organization?: boolean;
    organizationalUnit?: boolean;
    serialNumber?: boolean;
  } = {}
) {
  return applyDecorators(
    ApiSecurity('mutualTLS'),
    ApiExtension('x-mtls-authentication', {
      requiredFields: requiredCertificateFields,
      description: 'Requires valid client certificate for mutual TLS authentication',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing client certificate',
    }),
    ApiResponse({
      status: 495,
      description: 'SSL Certificate Error - Client certificate verification failed',
    })
  );
}

/**
 * Creates API key with IP whitelist authentication.
 * API key authentication with IP address restrictions.
 *
 * @param keyName - API key parameter name
 * @param allowedIpRanges - Array of allowed IP ranges (CIDR notation)
 * @returns API key with IP whitelist configuration
 *
 * @example
 * ```typescript
 * @createApiKeyWithIpWhitelist('X-API-Key', ['192.168.1.0/24', '10.0.0.0/8'])
 * async ipRestrictedEndpoint() { }
 * ```
 */
export function createApiKeyWithIpWhitelist(
  keyName = 'X-API-Key',
  allowedIpRanges: string[] = []
) {
  return applyDecorators(
    ApiSecurity('api_key'),
    ApiHeader({
      name: keyName,
      description: 'API key with IP address restrictions',
      required: true,
    }),
    ApiExtension('x-ip-whitelist', {
      allowedRanges: allowedIpRanges,
      description: `Access restricted to IP ranges: ${allowedIpRanges.join(', ')}`,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid API key',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - IP address not in whitelist',
    })
  );
}

/**
 * Creates rotating API key authentication.
 * API key with automatic rotation support.
 *
 * @param keyName - API key parameter name
 * @param rotationPeriod - Key rotation period
 * @param gracePeriod - Grace period for old keys
 * @returns Rotating API key configuration
 *
 * @example
 * ```typescript
 * @createRotatingApiKey('X-API-Key', '30d', '7d')
 * async rotatingKeyEndpoint() { }
 * ```
 */
export function createRotatingApiKey(
  keyName = 'X-API-Key',
  rotationPeriod = '30d',
  gracePeriod = '7d'
) {
  return applyDecorators(
    ApiSecurity('api_key'),
    ApiHeader({
      name: keyName,
      description: 'Rotating API key',
      required: true,
    }),
    ApiExtension('x-key-rotation', {
      rotationPeriod,
      gracePeriod,
      description: `Keys rotate every ${rotationPeriod} with ${gracePeriod} grace period`,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - API key expired or invalid',
    }),
    ApiResponse({
      status: 410,
      description: 'Gone - API key rotation required',
      headers: {
        'X-Key-Rotation-Required': {
          description: 'Indicates key rotation is required',
          schema: { type: 'boolean' },
        },
      },
    })
  );
}

// ============================================================================
// CUSTOM AUTH STRATEGIES (8 functions)
// ============================================================================

/**
 * Creates Basic HTTP authentication decorator.
 * Standard HTTP Basic authentication (username:password).
 *
 * @param realm - Authentication realm
 * @returns Basic authentication configuration
 *
 * @example
 * ```typescript
 * @createBasicAuthentication('Admin Area')
 * async basicAuthEndpoint() { }
 * ```
 */
export function createBasicAuthentication(realm = 'Secured Area') {
  return applyDecorators(
    ApiSecurity('basic'),
    ApiHeader({
      name: 'Authorization',
      description: 'Basic authentication credentials',
      required: true,
      schema: {
        type: 'string',
        pattern: '^Basic [A-Za-z0-9+/=]+$',
        example: 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=',
      },
    }),
    ApiExtension('x-basic-auth', {
      realm,
      description: `HTTP Basic authentication for realm: ${realm}`,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid credentials',
      headers: {
        'WWW-Authenticate': {
          description: 'Authentication challenge',
          schema: { type: 'string', example: `Basic realm="${realm}"` },
        },
      },
    })
  );
}

/**
 * Creates Digest HTTP authentication decorator.
 * HTTP Digest authentication (more secure than Basic).
 *
 * @param realm - Authentication realm
 * @param algorithm - Digest algorithm (MD5, SHA-256)
 * @returns Digest authentication configuration
 *
 * @example
 * ```typescript
 * @createDigestAuthentication('API Access', 'SHA-256')
 * async digestAuthEndpoint() { }
 * ```
 */
export function createDigestAuthentication(
  realm = 'Secured Area',
  algorithm: 'MD5' | 'SHA-256' = 'SHA-256'
) {
  return applyDecorators(
    ApiSecurity('digest'),
    ApiHeader({
      name: 'Authorization',
      description: 'Digest authentication credentials',
      required: true,
    }),
    ApiExtension('x-digest-auth', {
      realm,
      algorithm,
      qop: 'auth',
      description: `HTTP Digest authentication with ${algorithm}`,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid digest credentials',
      headers: {
        'WWW-Authenticate': {
          description: 'Digest authentication challenge',
          schema: { type: 'string' },
        },
      },
    })
  );
}

/**
 * Creates OpenID Connect authentication decorator.
 * OpenID Connect authentication flow.
 *
 * @param discoveryUrl - OpenID Connect discovery URL
 * @param clientId - Client identifier
 * @returns OpenID Connect configuration
 *
 * @example
 * ```typescript
 * @createOpenIdConnect(
 *   'https://accounts.google.com/.well-known/openid-configuration',
 *   'my-client-id'
 * )
 * async oidcProtectedEndpoint() { }
 * ```
 */
export function createOpenIdConnect(discoveryUrl: string, clientId: string) {
  return applyDecorators(
    ApiSecurity('openid'),
    ApiExtension('x-openid-connect', {
      discoveryUrl,
      clientId,
      description: 'OpenID Connect authentication',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - OpenID Connect authentication required',
    })
  );
}

/**
 * Creates SAML authentication decorator.
 * SAML 2.0 authentication flow documentation.
 *
 * @param entityId - SAML entity ID
 * @param ssoUrl - Single Sign-On URL
 * @returns SAML authentication configuration
 *
 * @example
 * ```typescript
 * @createSamlAuthentication(
 *   'https://example.com/saml/metadata',
 *   'https://example.com/saml/sso'
 * )
 * async samlProtectedEndpoint() { }
 * ```
 */
export function createSamlAuthentication(entityId: string, ssoUrl: string) {
  return applyDecorators(
    ApiSecurity('saml'),
    ApiExtension('x-saml-authentication', {
      entityId,
      ssoUrl,
      binding: 'HTTP-POST',
      description: 'SAML 2.0 authentication',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - SAML authentication required',
    })
  );
}

/**
 * Creates custom token authentication decorator.
 * Custom proprietary token authentication.
 *
 * @param tokenHeaderName - Custom token header name
 * @param tokenFormat - Token format description
 * @param validationEndpoint - Token validation endpoint
 * @returns Custom token authentication configuration
 *
 * @example
 * ```typescript
 * @createCustomTokenAuth('X-Custom-Token', 'custom-v1', '/auth/validate')
 * async customTokenEndpoint() { }
 * ```
 */
export function createCustomTokenAuth(
  tokenHeaderName: string,
  tokenFormat: string,
  validationEndpoint?: string
) {
  return applyDecorators(
    ApiSecurity('custom_token'),
    ApiHeader({
      name: tokenHeaderName,
      description: `Custom authentication token (format: ${tokenFormat})`,
      required: true,
    }),
    ApiExtension('x-custom-token', {
      headerName: tokenHeaderName,
      format: tokenFormat,
      validationEndpoint,
      description: 'Custom proprietary token authentication',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid custom token',
    })
  );
}

/**
 * Creates session cookie authentication decorator.
 * Session-based authentication with HTTP-only cookies.
 *
 * @param cookieName - Session cookie name
 * @param secure - Whether cookie requires HTTPS
 * @param sameSite - SameSite cookie attribute
 * @returns Session cookie authentication configuration
 *
 * @example
 * ```typescript
 * @createSessionCookieAuth('sessionid', true, 'strict')
 * async sessionProtectedEndpoint() { }
 * ```
 */
export function createSessionCookieAuth(
  cookieName = 'sessionid',
  secure = true,
  sameSite: 'strict' | 'lax' | 'none' = 'strict'
) {
  return applyDecorators(
    ApiSecurity('session'),
    ApiExtension('x-session-cookie', {
      name: cookieName,
      httpOnly: true,
      secure,
      sameSite,
      description: 'Session-based authentication with secure cookies',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or expired session',
    })
  );
}

/**
 * Creates AWS Signature V4 authentication decorator.
 * AWS-style request signing (Signature Version 4).
 *
 * @param service - AWS service name
 * @param region - AWS region
 * @returns AWS Signature V4 configuration
 *
 * @example
 * ```typescript
 * @createAwsSignatureV4('execute-api', 'us-east-1')
 * async awsSignedEndpoint() { }
 * ```
 */
export function createAwsSignatureV4(service: string, region: string) {
  return applyDecorators(
    ApiSecurity('aws_sig_v4'),
    ApiHeader({
      name: 'Authorization',
      description: 'AWS Signature Version 4',
      required: true,
    }),
    ApiHeader({
      name: 'X-Amz-Date',
      description: 'Request timestamp',
      required: true,
    }),
    ApiExtension('x-aws-signature-v4', {
      service,
      region,
      description: `AWS Signature Version 4 for service: ${service}`,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid AWS signature',
    })
  );
}

/**
 * Creates time-based one-time password (TOTP) authentication.
 * Two-factor authentication with TOTP codes.
 *
 * @param headerName - TOTP code header name
 * @param window - Time window for code validity (seconds)
 * @returns TOTP authentication configuration
 *
 * @example
 * ```typescript
 * @createTotpAuthentication('X-TOTP-Code', 30)
 * async totpProtectedEndpoint() { }
 * ```
 */
export function createTotpAuthentication(
  headerName = 'X-TOTP-Code',
  window = 30
) {
  return applyDecorators(
    ApiSecurity('totp'),
    ApiHeader({
      name: headerName,
      description: 'Time-based one-time password (6 digits)',
      required: true,
      schema: {
        type: 'string',
        pattern: '^[0-9]{6}$',
      },
    }),
    ApiExtension('x-totp', {
      window,
      digits: 6,
      algorithm: 'SHA1',
      description: `TOTP authentication with ${window}s window`,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid TOTP code',
    })
  );
}

// ============================================================================
// SECURITY REQUIREMENT COMPOSERS (10 functions)
// ============================================================================

/**
 * Creates multiple security schemes (OR logic).
 * Endpoint accepts any of the specified auth methods.
 *
 * @param schemes - Array of security scheme names
 * @returns Multiple security schemes configuration (OR)
 *
 * @example
 * ```typescript
 * @createMultipleSecurityOr(['bearer', 'api_key', 'basic'])
 * async flexibleAuthEndpoint() { }
 * ```
 */
export function createMultipleSecurityOr(schemes: string[]) {
  return applyDecorators(
    ...schemes.map(scheme => ApiSecurity(scheme)),
    ApiExtension('x-security-logic', 'OR'),
    ApiOperation({
      description: `Authentication: Any of ${schemes.join(', ')}`,
    }),
    ApiResponse({
      status: 401,
      description: `Unauthorized - Requires one of: ${schemes.join(', ')}`,
    })
  );
}

/**
 * Creates multiple security schemes (AND logic).
 * Endpoint requires all specified auth methods.
 *
 * @param schemes - Array of security scheme configurations
 * @returns Multiple security schemes configuration (AND)
 *
 * @example
 * ```typescript
 * @createMultipleSecurityAnd([
 *   { name: 'bearer', scopes: ['read'] },
 *   { name: 'api_key', scopes: [] }
 * ])
 * async dualAuthEndpoint() { }
 * ```
 */
export function createMultipleSecurityAnd(
  schemes: Array<{ name: string; scopes?: string[] }>
) {
  return applyDecorators(
    ApiExtension('x-security-requirements', schemes),
    ApiExtension('x-security-logic', 'AND'),
    ApiOperation({
      description: `Authentication: All of ${schemes.map(s => s.name).join(' AND ')}`,
    }),
    ApiResponse({
      status: 401,
      description: `Unauthorized - Requires all of: ${schemes.map(s => s.name).join(', ')}`,
    })
  );
}

/**
 * Creates role-based access control (RBAC) decorator.
 * Validates user roles for endpoint access.
 *
 * @param requiredRoles - Array of required roles
 * @param requireAll - Whether all roles are required
 * @returns RBAC configuration
 *
 * @example
 * ```typescript
 * @createRoleBasedSecurity(['admin', 'moderator'], false)
 * async moderatedEndpoint() { }
 * ```
 */
export function createRoleBasedSecurity(
  requiredRoles: string[],
  requireAll = false
) {
  const logic = requireAll ? 'AND' : 'OR';

  return applyDecorators(
    ApiExtension('x-rbac', {
      roles: requiredRoles,
      logic,
      description: `Requires ${logic === 'AND' ? 'all' : 'any'} roles: ${requiredRoles.join(', ')}`,
    }),
    ApiResponse({
      status: 403,
      description: `Forbidden - Missing required role(s): ${requiredRoles.join(', ')}`,
    })
  );
}

/**
 * Creates permission-based access control decorator.
 * Validates specific permissions for endpoint access.
 *
 * @param requiredPermissions - Array of required permissions
 * @param resource - Resource type being accessed
 * @returns Permission-based access configuration
 *
 * @example
 * ```typescript
 * @createPermissionBasedSecurity(['read', 'write'], 'users')
 * async userManagementEndpoint() { }
 * ```
 */
export function createPermissionBasedSecurity(
  requiredPermissions: string[],
  resource?: string
) {
  return applyDecorators(
    ApiExtension('x-permissions', {
      required: requiredPermissions,
      resource,
      description: `Requires permissions: ${requiredPermissions.join(', ')}${resource ? ` on resource: ${resource}` : ''}`,
    }),
    ApiResponse({
      status: 403,
      description: `Forbidden - Missing required permissions: ${requiredPermissions.join(', ')}`,
    })
  );
}

/**
 * Creates tenant-based security decorator.
 * Multi-tenant access control.
 *
 * @param tenantIdSource - Where to extract tenant ID from (header, token, query)
 * @param requiredTenants - Optional specific tenant IDs allowed
 * @returns Tenant-based security configuration
 *
 * @example
 * ```typescript
 * @createTenantBasedSecurity('header', ['tenant1', 'tenant2'])
 * async tenantEndpoint() { }
 * ```
 */
export function createTenantBasedSecurity(
  tenantIdSource: 'header' | 'token' | 'query' = 'header',
  requiredTenants?: string[]
) {
  const decorators: any[] = [
    ApiExtension('x-tenant-security', {
      source: tenantIdSource,
      allowedTenants: requiredTenants,
      description: 'Multi-tenant access control',
    }),
  ];

  if (tenantIdSource === 'header') {
    decorators.push(
      ApiHeader({
        name: 'X-Tenant-ID',
        description: 'Tenant identifier',
        required: true,
      })
    );
  } else if (tenantIdSource === 'query') {
    decorators.push(
      ApiQuery({
        name: 'tenantId',
        description: 'Tenant identifier',
        required: true,
      })
    );
  }

  decorators.push(
    ApiResponse({
      status: 403,
      description: 'Forbidden - Invalid or unauthorized tenant',
    })
  );

  return applyDecorators(...decorators);
}

/**
 * Creates rate limit-based security decorator.
 * Rate limiting per authentication credential.
 *
 * @param limit - Maximum requests
 * @param window - Time window
 * @param scope - Rate limit scope (global, per-user, per-key)
 * @returns Rate limit security configuration
 *
 * @example
 * ```typescript
 * @createRateLimitSecurity(100, '1m', 'per-user')
 * async rateLimitedEndpoint() { }
 * ```
 */
export function createRateLimitSecurity(
  limit: number,
  window: string,
  scope: 'global' | 'per-user' | 'per-key' = 'per-user'
) {
  return applyDecorators(
    ApiExtension('x-rate-limit-security', {
      limit,
      window,
      scope,
      description: `Rate limit: ${limit} requests per ${window} (${scope})`,
    }),
    ApiResponse({
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
    })
  );
}

/**
 * Creates IP-based security decorator.
 * IP address filtering and geolocation restrictions.
 *
 * @param allowedIps - Array of allowed IP addresses/ranges
 * @param allowedCountries - Array of allowed country codes
 * @returns IP-based security configuration
 *
 * @example
 * ```typescript
 * @createIpBasedSecurity(['192.168.1.0/24'], ['US', 'CA'])
 * async geoRestrictedEndpoint() { }
 * ```
 */
export function createIpBasedSecurity(
  allowedIps: string[] = [],
  allowedCountries: string[] = []
) {
  return applyDecorators(
    ApiExtension('x-ip-security', {
      allowedIps,
      allowedCountries,
      description: 'IP address and geolocation restrictions',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - IP address or location not allowed',
    })
  );
}

/**
 * Creates time-based security decorator.
 * Access restrictions based on time windows.
 *
 * @param allowedTimeWindows - Array of allowed time windows
 * @param timezone - Timezone for time windows
 * @returns Time-based security configuration
 *
 * @example
 * ```typescript
 * @createTimeBasedSecurity([
 *   { start: '09:00', end: '17:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] }
 * ], 'America/New_York')
 * async businessHoursEndpoint() { }
 * ```
 */
export function createTimeBasedSecurity(
  allowedTimeWindows: Array<{ start: string; end: string; days?: string[] }>,
  timezone = 'UTC'
) {
  return applyDecorators(
    ApiExtension('x-time-based-security', {
      windows: allowedTimeWindows,
      timezone,
      description: 'Time-based access restrictions',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Access not allowed at this time',
    })
  );
}

/**
 * Creates device-based security decorator.
 * Device fingerprinting and trusted device requirements.
 *
 * @param requireTrustedDevice - Whether device must be trusted
 * @param deviceIdHeader - Header containing device identifier
 * @returns Device-based security configuration
 *
 * @example
 * ```typescript
 * @createDeviceBasedSecurity(true, 'X-Device-ID')
 * async trustedDeviceEndpoint() { }
 * ```
 */
export function createDeviceBasedSecurity(
  requireTrustedDevice = true,
  deviceIdHeader = 'X-Device-ID'
) {
  return applyDecorators(
    ApiHeader({
      name: deviceIdHeader,
      description: 'Device identifier',
      required: requireTrustedDevice,
    }),
    ApiExtension('x-device-security', {
      requireTrusted: requireTrustedDevice,
      deviceIdHeader,
      description: 'Device-based security and fingerprinting',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Untrusted or unrecognized device',
    })
  );
}

/**
 * Creates conditional security decorator.
 * Dynamic security requirements based on conditions.
 *
 * @param conditions - Security conditions and their requirements
 * @returns Conditional security configuration
 *
 * @example
 * ```typescript
 * @createConditionalSecurity({
 *   'admin_action': { schemes: ['bearer', 'totp'], roles: ['admin'] },
 *   'read_only': { schemes: ['api_key'] }
 * })
 * async conditionalSecurityEndpoint() { }
 * ```
 */
export function createConditionalSecurity(
  conditions: Record<string, { schemes?: string[]; roles?: string[]; permissions?: string[] }>
) {
  return applyDecorators(
    ApiExtension('x-conditional-security', {
      conditions,
      description: 'Dynamic security requirements based on operation context',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Security requirements not met for this operation',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions for this operation',
    })
  );
}
