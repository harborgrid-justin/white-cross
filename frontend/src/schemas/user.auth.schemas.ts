/**
 * @fileoverview Authentication and security validation schemas
 * @module schemas/user.auth
 *
 * Barrel export for all authentication-related validation schemas including
 * password management, MFA, IP restrictions, and session management.
 */

// Password Management
export {
  resetUserPasswordSchema,
  resetPasswordSchema,
  type ResetUserPasswordInput,
  type ResetPasswordInput,
} from './user.auth.password.schemas';

// Multi-Factor Authentication
export {
  setupMFASchema,
  enableMFASchema,
  verifyMFASchema,
  disableMFASchema,
  type SetupMFAInput,
  type EnableMFAInput,
  type VerifyMFAInput,
  type DisableMFAInput,
} from './user.auth.mfa.schemas';

// IP Restrictions
export {
  updateIPRestrictionsSchema,
  removeIPRestrictionsSchema,
  type UpdateIPRestrictionsInput,
  type RemoveIPRestrictionsInput,
} from './user.auth.iprestrictions.schemas';

// Session Management
export {
  getUserSessionsSchema,
  revokeUserSessionSchema,
  revokeAllUserSessionsSchema,
  type GetUserSessionsInput,
  type RevokeUserSessionInput,
  type RevokeAllUserSessionsInput,
} from './user.auth.sessions.schemas';
