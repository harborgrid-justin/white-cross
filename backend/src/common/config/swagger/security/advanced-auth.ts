/**
 * Advanced Authentication Builders
 *
 * Functions for creating advanced authentication schemes including
 * HMAC, mTLS, IP whitelisting, rotating keys, and custom auth strategies.
 *
 * @module swagger/security/advanced-auth
 * @version 1.0.0
 */

import { applyDecorators } from '@nestjs/common';
import { ApiSecurity, ApiHeader, ApiResponse, ApiExtension } from '@nestjs/swagger';
import {
  HmacOptions,
  MutualTlsOptions,
  DeviceSecurityOptions,
  ConditionalSecurityConditions,
} from './types';

/**
 * Creates HMAC signature authentication.
 * Request signing with HMAC for enhanced security.
 *
 * @param options - HMAC authentication options
 * @returns HMAC authentication configuration
 *
 * @example
 * ```typescript
 * @createHmacAuthentication({
 *   algorithm: 'sha256',
 *   signatureHeader: 'X-Signature',
 *   timestampHeader: 'X-Timestamp'
 * })
 * async hmacProtectedEndpoint() { }
 * ```
 */
export function createHmacAuthentication(options: HmacOptions = {}) {
  const {
    algorithm = 'sha256',
    signatureHeader = 'X-Signature',
    timestampHeader = 'X-Timestamp',
    clockSkewTolerance = 300,
  } = options;

  return applyDecorators(
    ApiSecurity('hmac'),
    ApiHeader({
      name: signatureHeader,
      description: `HMAC ${algorithm.toUpperCase()} signature`,
      required: true,
      schema: {
        type: 'string',
        pattern: '^[a-f0-9]{64,128}$',
      },
    }),
    ApiHeader({
      name: timestampHeader,
      description: 'Request timestamp',
      required: true,
      schema: {
        type: 'string',
        format: 'date-time',
      },
    }),
    ApiExtension('x-hmac-signature', {
      algorithm,
      signatureHeader,
      timestampHeader,
      clockSkewTolerance,
      description: `Request must be signed with HMAC-${algorithm.toUpperCase()}`,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing HMAC signature',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Clock skew tolerance exceeded',
    }),
  );
}

/**
 * Creates mutual TLS (mTLS) authentication.
 * Client certificate authentication for enhanced security.
 *
 * @param options - Mutual TLS options
 * @returns mTLS authentication configuration
 *
 * @example
 * ```typescript
 * @createMutualTlsAuthentication({
 *   validationLevel: 'strict',
 *   clientCertRequired: true
 * })
 * async mtlsProtectedEndpoint() { }
 * ```
 */
export function createMutualTlsAuthentication(options: MutualTlsOptions = {}) {
  const { validationLevel = 'basic', trustedCAs = [], clientCertRequired = true } = options;

  return applyDecorators(
    ApiSecurity('mutualTLS'),
    ApiExtension('x-mtls-authentication', {
      validationLevel,
      trustedCAs,
      clientCertRequired,
      description: 'Requires valid client certificate for mutual TLS authentication',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing client certificate',
    }),
    ApiResponse({
      status: 495,
      description: 'SSL Certificate Error - Client certificate verification failed',
    }),
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
export function createApiKeyWithIpWhitelist(keyName = 'X-API-Key', allowedIpRanges: string[] = []) {
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
    }),
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
  gracePeriod = '7d',
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
    }),
  );
}

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
    }),
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
  algorithm: 'MD5' | 'SHA-256' = 'SHA-256',
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
    }),
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
    }),
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
    }),
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
  validationEndpoint?: string,
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
    }),
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
  sameSite: 'strict' | 'lax' | 'none' = 'strict',
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
    }),
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
    }),
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
export function createTotpAuthentication(headerName = 'X-TOTP-Code', window = 30) {
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
    }),
  );
}

/**
 * Creates device-based security decorator.
 * Device fingerprinting and trusted device requirements.
 *
 * @param options - Device security options
 * @returns Device-based security configuration
 *
 * @example
 * ```typescript
 * @createDeviceBasedSecurity({
 *   requireTrustedDevice: true,
 *   deviceIdHeader: 'X-Device-ID',
 *   enableFingerprinting: true
 * })
 * async trustedDeviceEndpoint() { }
 * ```
 */
export function createDeviceBasedSecurity(options: DeviceSecurityOptions = {}) {
  const {
    requireTrustedDevice = true,
    deviceIdHeader = 'X-Device-ID',
    enableFingerprinting = false,
  } = options;

  return applyDecorators(
    ApiHeader({
      name: deviceIdHeader,
      description: 'Device identifier',
      required: requireTrustedDevice,
    }),
    ApiExtension('x-device-security', {
      requireTrusted: requireTrustedDevice,
      deviceIdHeader,
      enableFingerprinting,
      description: 'Device-based security and fingerprinting',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Untrusted or unrecognized device',
    }),
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
export function createConditionalSecurity(conditions: ConditionalSecurityConditions) {
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
    }),
  );
}
