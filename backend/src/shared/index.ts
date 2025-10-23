/**
 * LOC: 55D129475C
 * WC-IDX-SHR-068 | index.ts - Shared Utilities Barrel Export
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - User.ts (database/models/core/User.ts)
 *   - 03-users-and-assignments.ts (database/seeders/03-users-and-assignments.ts)
 *   - UserService.ts (database/services/UserService.ts)
 *   - administration.ts (routes/administration.ts)
 *   - audit.ts (routes/audit.ts)
 *   - ... and 4 more
 */

/**
 * WC-IDX-SHR-068 | index.ts - Shared Utilities Barrel Export
 * Purpose: Central export point for all shared utilities, security, auth, validation, healthcare functions
 * Upstream: ./utils, ./security, ./auth, ./validation, ./database, ./healthcare | Dependencies: shared module exports
 * Downstream: ../routes/*.ts, ../services/*.ts, ../middleware/*.ts | Called by: application components
 * Related: ../types/index.ts, ../config/*.ts, ../validators/*.ts
 * Exports: Utility functions, security helpers, auth utilities, validation schemas, healthcare utilities | Key Services: Shared functionality aggregation
 * Last Updated: 2025-10-18 | File Type: .ts | Pattern: Barrel Export
 * Critical Path: Import request → Shared utility selection → Function execution → Code reusability
 * LLM Context: Healthcare platform shared utilities with security, authentication, validation, database helpers, medical functions, communication tools
 */

/**
 * Shared utilities and functions for White Cross backend
 * 
 * This module exports all shared functionality that can be used
 * across different parts of the application to reduce code duplication
 * and improve maintainability.
 * 
 * REORGANIZED FOR ENTERPRISE SOA COMPLIANCE:
 * - Consolidated utilities with proper naming conventions
 * - Removed duplicates between shared and middleware
 * - Applied enterprise best practices
 * - Separated business logic from infrastructure concerns
 */

// ==========================================
// ENTERPRISE UTILITIES (REORGANIZED)
// ==========================================

// Consolidated utility functions with proper naming
export {
  UTILITY_CONSTANTS,
  type UtilityResult,
  type PaginationOptions,
  hashPassword,
  comparePassword,
  validatePasswordComplexity,
  generateSecurePassword,
  PASSWORD_CONFIG
} from './utilities';

// Enterprise security services (consolidated from auth + security)
export {
  AuthenticationService,
  createAuthenticationService,
  type UserProfile,
  type TokenPayload,
  type AuthenticationConfig,
  type AuthenticationResult
} from './security/authentication.service';

export {
  ValidationService,
  createValidationService,
  createHealthcareValidation,
  createAdminValidation,
  HEALTHCARE_PATTERNS,
  VALIDATION_CONFIGS,
  HEALTHCARE_VALIDATION_RULES,
  type ValidationRule,
  type ValidationError,
  type ValidationResult as SecurityValidationResult,
  type ValidationConfig
} from './security/validation.service';

// Other security utilities
export * from './security/rate-limiting.service';
export * from './security/permission.utils';
export * from './security/sql-sanitizer.service';
export * from './security/headers';

// ==========================================
// BUSINESS DOMAIN SERVICES
// ==========================================

// Database utilities
export * from './database';

// Logging utilities  
export * from './logging';

// Healthcare utilities
export * from './healthcare';

// Communication utilities
export * from './communication';

// File utilities
export * from './files';

// Time and scheduling utilities
export * from './time';

// Performance monitoring utilities
export * from './monitoring';

// Configuration utilities
export * from './config';

// ==========================================
// LEGACY COMPATIBILITY (REMOVED)
// ==========================================
// The following legacy exports have been removed and consolidated:
// - './auth' -> Use './security/authentication.service' instead
// - './validation' -> Use './security/validation.service' instead
// - './utils/validation' -> Use './security/validation.service' instead

// Legacy utilities still available (but prefer utilities/* for new code)
export * from './utils';
