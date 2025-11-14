/**
 * WF-COMP-317 | appointments.ts - LEGACY FILE - REFACTORED TO MODULAR STRUCTURE
 * 
 * @deprecated This file has been refactored into modular components for better maintainability.
 * New path: frontend/src/types/domain/appointments/
 * 
 * This file now serves as a legacy compatibility layer that re-exports all types
 * from the new modular structure. All new development should import from the 
 * new modular structure directly.
 * 
 * Original Purpose: Legacy appointment type definitions for healthcare platform
 * New Structure: Modular architecture with separation of concerns by domain
 * 
 * Migration Path:
 * OLD: import { Appointment } from '@/types/legacy/appointments'
 * NEW: import { Appointment } from '@/types/domain/appointments' (recommended!)
 * BETTER: import { Appointment } from '@/types/domain/appointments/core'
 */

// ==================== RE-EXPORTS FROM MODULAR STRUCTURE ====================

/**
 * Re-export all appointment types from the new modular structure
 * This maintains backward compatibility for existing code
 */
export * from '../domain/appointments/index';

// ==================== LEGACY COMPATIBILITY NOTICE ====================

/**
 * @deprecated_notice
 * This legacy file has been refactored into a modular structure located at:
 * - Core Types: frontend/src/types/domain/appointments/core.ts (~300 lines)
 * - API Types: frontend/src/types/domain/appointments/api.ts (~300 lines)  
 * - Utilities: frontend/src/types/domain/appointments/utils.ts (~300 lines)
 * - Main index: frontend/src/types/domain/appointments/index.ts (re-exports)
 * 
 * Benefits of new structure:
 * ✅ Each module under 500 lines (was 884 lines total)
 * ✅ Better separation of concerns by domain
 * ✅ Improved maintainability and navigation
 * ✅ Easier to find related types and utilities
 * ✅ Backward compatibility maintained
 * ✅ No duplication with domain types
 * 
 * To migrate your imports:
 * 1. DEPRECATED: import { Appointment } from '@/types/legacy/appointments'
 * 2. RECOMMENDED: import { Appointment } from '@/types/domain/appointments'
 * 3. SPECIFIC: import { Appointment } from '@/types/domain/appointments/core'
 * 4. All types remain available with the same names and signatures
 * 5. Please update imports to use domain types instead of legacy types
 */

// ==================== VERSION TRACKING ====================

/**
 * Legacy file version for tracking the refactoring
 */
export const LEGACY_APPOINTMENTS_VERSION = '1.0.0-legacy-redirect';

/**
 * Migration completion marker
 */
export const REFACTORING_COMPLETED = true;

/**
 * Original file size for reference
 */
export const ORIGINAL_LINE_COUNT = 884;

/**
 * New modular structure line counts
 */
export const MODULAR_STRUCTURE = {
  'core.ts': '~300 lines - Core entities, enums, validation constants',
  'api.ts': '~300 lines - API request/response types, endpoint parameters', 
  'utils.ts': '~300 lines - Validation helpers, utilities, type guards',
  'index.ts': 'Re-exports and compatibility'
} as const;

/**
 * @deprecated Use domain types instead
 */
export const MIGRATION_NOTICE = 'This legacy file now redirects to domain types. Please update your imports to use @/types/domain/appointments instead of @/types/legacy/appointments';
