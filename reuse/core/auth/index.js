"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// ============================================================================
// MAIN AUTHENTICATION & AUTHORIZATION
// ============================================================================
__exportStar(require("../../authentication-kit"), exports);
__exportStar(require("../../authorization-kit"), exports);
__exportStar(require("../../auth-security-kit"), exports);
// ============================================================================
// JWT UTILITIES
// ============================================================================
__exportStar(require("./jwt"), exports);
// ============================================================================
// OAUTH UTILITIES
// ============================================================================
__exportStar(require("./oauth"), exports);
// ============================================================================
// RBAC UTILITIES
// ============================================================================
__exportStar(require("./rbac"), exports);
// ============================================================================
// SESSION MANAGEMENT
// ============================================================================
__exportStar(require("./session"), exports);
// ============================================================================
// MULTI-FACTOR AUTHENTICATION
// ============================================================================
__exportStar(require("./mfa"), exports);
// ============================================================================
// DEFAULT EXPORT
// ============================================================================
// Note: Default exports are not available from kit files
// Import individual functions/classes as needed from the specific subdirectories
//# sourceMappingURL=index.js.map