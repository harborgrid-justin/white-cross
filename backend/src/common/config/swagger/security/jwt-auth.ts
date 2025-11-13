/**
 * JWT Authentication Builders
 *
 * Functions for creating JWT-based authentication including
 * bearer tokens, refresh tokens, claims validation,
 * audience validation, issuer validation, and signature validation.
 *
 * @module swagger/security/jwt-auth
 * @version 1.0.0
 */

import { applyDecorators } from '@nestjs/common';
import { ApiSecurity, ApiHeader, ApiResponse, ApiExtension } from '@nestjs/swagger';
import { JwtSecurityOptions } from './types';

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
  const decorators: ReturnType<typeof applyDecorators>[] = [
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
      }),
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
    }),
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
export function createJwtWithRefreshToken(accessTokenExpiry = '15m', refreshTokenExpiry = '7d') {
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
    }),
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
  requiredClaims: Record<string, unknown>,
  optionalClaims: string[] = [],
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
    }),
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
export function createJwtAudienceValidation(allowedAudiences: string[], requireExactMatch = true) {
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
    }),
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
    }),
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
export function createJwtSignatureValidation(allowedAlgorithms: string[], publicKeyUrl?: string) {
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
    }),
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
export function createJwtExpirationValidation(maxAge: number, gracePeriod = 0) {
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
    }),
  );
}
