/**
 * @fileoverview Authentication & Authorization Barrel Export
 * @module core/auth
 *
 * Comprehensive authentication and authorization utilities for enterprise applications.
 * Provides JWT token management, OAuth 2.0 flows, RBAC, session management, MFA,
 * and security utilities.
 *
 * @example Basic JWT authentication
 * ```typescript
 * import { generateJWTToken, validateJWTToken } from '@reuse/core/auth';
 *
 * const token = generateJWTToken({
 *   sub: 'user-123',
 *   email: 'user@example.com',
 *   role: 'admin'
 * }, {
 *   secret: process.env.JWT_SECRET,
 *   expiresIn: '15m'
 * });
 *
 * const validation = validateJWTToken(token, {
 *   secret: process.env.JWT_SECRET
 * });
 * ```
 *
 * @example OAuth 2.0 with PKCE
 * ```typescript
 * import { generateOAuth2AuthUrl, validateOAuth2State } from '@reuse/core/auth';
 *
 * const { authorizationUrl, state, codeVerifier } = generateOAuth2AuthUrl({
 *   clientId: 'client-123',
 *   redirectUri: 'https://app.example.com/callback',
 *   authorizationEndpoint: 'https://oauth.provider.com/authorize',
 *   tokenEndpoint: 'https://oauth.provider.com/token',
 *   scope: ['openid', 'profile', 'email'],
 *   usePKCE: true
 * });
 * ```
 *
 * @example RBAC permission checking
 * ```typescript
 * import { checkPermission, hasRole } from '@reuse/core/auth';
 *
 * const hasAccess = checkPermission(user, 'users:write');
 * const isAdmin = hasRole(user, 'admin');
 * ```
 */

// ============================================================================
// MAIN AUTHENTICATION & AUTHORIZATION
// ============================================================================

export * from '../../authentication-kit';
export * from '../../authorization-kit';
export * from '../../auth-security-kit';

// ============================================================================
// JWT UTILITIES
// ============================================================================

export * from './jwt';

// ============================================================================
// OAUTH UTILITIES
// ============================================================================

export * from './oauth';

// ============================================================================
// RBAC UTILITIES
// ============================================================================

export * from './rbac';

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

export * from './session';

// ============================================================================
// MULTI-FACTOR AUTHENTICATION
// ============================================================================

export * from './mfa';

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type {
  JWTPayload,
  JWTConfig,
  TokenPair,
  TokenValidationResult,
  RefreshTokenConfig,
  SessionConfig,
  SessionData,
  OAuth2Config,
  OAuth2AuthResult,
  OAuth2TokenResponse,
  TOTPConfig,
  TOTPSetupResult,
  PasswordPolicy,
  PasswordValidationResult,
  ApiKeyConfig,
  ApiKeyData,
  BlacklistEntry,
  LoginCredentials,
  LoginResult,
} from './authentication-kit';

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

// Note: Default exports are not available from kit files
// Import individual functions/classes as needed from the specific subdirectories
