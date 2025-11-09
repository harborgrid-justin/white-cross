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
export * from '../../authentication-kit';
export * from '../../authorization-kit';
export * from '../../auth-security-kit';
export * from './jwt';
export * from './oauth';
export * from './rbac';
export * from './session';
export * from './mfa';
export type { JWTPayload, JWTConfig, TokenPair, TokenValidationResult, RefreshTokenConfig, SessionConfig, SessionData, OAuth2Config, OAuth2AuthResult, OAuth2TokenResponse, TOTPConfig, TOTPSetupResult, PasswordPolicy, PasswordValidationResult, ApiKeyConfig, ApiKeyData, BlacklistEntry, LoginCredentials, LoginResult, } from './authentication-kit';
//# sourceMappingURL=index.d.ts.map