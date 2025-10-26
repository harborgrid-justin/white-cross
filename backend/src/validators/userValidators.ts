/**
 * LOC: B5147CE9EF
 * WC-VAL-USR-061 | userValidators.ts - User Authentication Validation Re-exports
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-VAL-USR-061 | userValidators.ts - User Authentication Validation Re-exports
 * Purpose: Legacy compatibility layer for user validation schemas with deprecation notice
 * Upstream: ../shared/validation/schemas, ../shared/validation/middleware | Dependencies: shared validation utilities
 * Downstream: ../routes/users.ts, ../routes/auth.ts | Called by: authentication endpoints (legacy)
 * Related: ../shared/validation/schemas.ts, ../middleware/auth-sequelize.ts, ../services/userService.ts
 * Exports: validateRequest, validateQuery, validateParams, shared validation schemas | Key Services: User validation re-exports
 * Last Updated: 2025-10-18 | File Type: .ts | Pattern: Legacy Compatibility Layer
 * Critical Path: Legacy import → Shared validation → Authentication → Authorization
 * LLM Context: Deprecated user validators with migration path to shared utilities, maintains backward compatibility for authentication flows
 */

/**
 * User and Authentication Validation Schemas
 *
 * @deprecated This file is being migrated to shared utilities.
 * Import from '../middleware/core/validation/validation.middleware' instead for new code.
 */

// Re-export from middleware for backward compatibility
export type {
  ValidationRule,
  ValidationError,
  ValidationResult,
  ValidationConfig
} from '../middleware/core/validation/validation.middleware';

export {
  HEALTHCARE_PATTERNS,
  VALIDATION_CONFIGS,
  HEALTHCARE_VALIDATION_RULES
} from '../middleware/core/validation/validation.middleware';

// Stub exports for validateRequest, validateQuery, validateParams
// These should be imported from the appropriate middleware adapter
export const validateRequest = (schema: any) => {
  console.warn('validateRequest is deprecated. Use middleware adapters instead.');
  return (request: any, h: any) => h.continue;
};

export const validateQuery = (schema: any) => {
  console.warn('validateQuery is deprecated. Use middleware adapters instead.');
  return (request: any, h: any) => h.continue;
};

export const validateParams = (schema: any) => {
  console.warn('validateParams is deprecated. Use middleware adapters instead.');
  return (request: any, h: any) => h.continue;
};
