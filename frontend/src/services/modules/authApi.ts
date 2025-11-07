/**
 * @fileoverview Authentication API Module - Services Layer Wrapper
 * @module services/modules/authApi
 * @category Services - Authentication & Security
 *
 * This module provides a unified authentication API for the services layer,
 * re-exporting from the identity-access module to maintain architectural consistency.
 *
 * This wrapper ensures that the services/api.ts aggregator can properly export
 * authentication functionality while keeping the core implementation in the
 * identity-access domain module.
 *
 * ## Architecture
 *
 * ```
 * services/modules/authApi.ts (this file)
 *   └── Re-exports from: identity-access/services/authApi.ts (implementation)
 * ```
 *
 * ## Usage
 *
 * **Recommended: Use from services/api aggregator**
 * ```typescript
 * import { authApi } from '@/services/api';
 * const response = await authApi.login({ email, password });
 * ```
 *
 * **Alternative: Direct import**
 * ```typescript
 * import { authApi } from '@/services/modules/authApi';
 * const user = await authApi.getCurrentUser();
 * ```
 *
 * ## Available Methods
 *
 * - `login(credentials)` - Authenticate with email/password
 * - `register(userData)` - Create new user account
 * - `logout()` - End user session
 * - `verifyToken()` - Validate current token
 * - `refreshToken()` - Renew access token
 * - `getCurrentUser()` - Get authenticated user
 * - `loginWithGoogle()` - OAuth login with Google
 * - `loginWithMicrosoft()` - OAuth login with Microsoft
 * - `forgotPassword(email)` - Request password reset
 * - `resetPassword(token, password)` - Reset password with token
 * - `isAuthenticated()` - Check authentication status
 * - `isTokenExpired()` - Check token expiration
 * - `getDevUsers()` - Get development users (dev only)
 *
 * @see {@link identity-access/services/authApi} for implementation details
 */

// Re-export all types and classes from the identity-access authApi
export type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  RefreshTokenResponse
} from '@/identity-access/services/authApi';

export {
  AuthApi,
  createAuthApi,
  authApi
} from '@/identity-access/services/authApi';

// Re-export as default for backward compatibility
export { authApi as default } from '@/identity-access/services/authApi';
