/**
 * @fileoverview JWT Token Management Utilities
 * @module core/auth/jwt
 *
 * JWT token generation, validation, and management utilities.
 */

// Re-export JWT-specific functions from main authentication kit
export {
  generateJWTToken,
  validateJWTToken,
  extractJWTPayload,
  isJWTExpired,
  getJWTTimeToExpiry,
  isJWTExpiringWithin,
  getJWTInfo,
  isValidJWTStructure,
} from '../../../authentication-kit';

// Re-export JWT types
export type {
  JWTPayload,
  JWTConfig,
  TokenValidationResult,
} from '../../../authentication-kit';
