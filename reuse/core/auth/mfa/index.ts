/**
 * @fileoverview Multi-Factor Authentication Utilities
 * @module core/auth/mfa
 *
 * TOTP, backup codes, and MFA challenge management.
 */

// Re-export MFA-specific functions
export {
  generateTOTPSetup,
  generateTOTPCode,
  verifyTOTPCode,
  generateBackupCodes,
  hashBackupCode,
  verifyBackupCode,
  generateMFAChallenge,
} from '../../../authentication-kit';

// Re-export MFA types
export type {
  TOTPConfig,
  TOTPSetupResult,
} from '../../../authentication-kit';
