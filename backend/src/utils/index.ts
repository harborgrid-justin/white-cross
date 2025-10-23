/**
 * @fileoverview Security and Validation Utilities - Central Export
 * @module utils
 * @description Centralized exports for all security and validation utilities
 */

// Security utilities
export {
  generateSecurePassword,
  generateSecureToken,
  generateSecureNumericPIN,
  generateAlphanumericCode,
  validatePasswordStrength,
  isCommonPassword
} from './securityUtils';

// Validation utilities
export {
  ALLOWED_FREQUENCY_PATTERNS,
  validateMedicationFrequency,
  validateDateRange,
  sanitizeSearchInput,
  validateEmail,
  validateNumeric,
  validateStringLength,
  sanitizeHTML
} from './validationUtils';

// File validation utilities
export {
  ALLOWED_FILE_TYPES,
  validateFileUpload,
  detectPotentialPHI,
  type FileValidationResult
} from './fileValidation';

// JWT utilities
export {
  JWT_CONFIG,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  revokeToken,
  isTokenBlacklisted,
  clearExpiredTokens,
  isTokenValidAfterPasswordChange,
  type TokenPayload
} from './jwtUtils';
