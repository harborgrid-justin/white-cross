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
 * Import from '../shared/validation' instead for new code.
 */

// Re-export from shared utilities for backward compatibility
export * from '../shared/validation/schemas';
export { validateRequest, validateQuery, validateParams } from '../shared/validation/middleware';
