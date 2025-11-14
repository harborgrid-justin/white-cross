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
 * Original Purpose: Comprehensive appointment type definitions for healthcare platform
 * New Structure: Modular architecture with separation of concerns by domain
 * 
 * Migration Path:
 * OLD: import { Appointment } from '@/types/domain/appointments'
 * NEW: import { Appointment } from '@/types/domain/appointments' (still works!)
 * BETTER: import { Appointment } from '@/types/domain/appointments/core'
 */

// ==================== RE-EXPORTS FROM MODULAR STRUCTURE ====================

/**
 * Re-export all appointment types from the new modular structure
 * This maintains backward compatibility for existing code
 */
export * from './appointments/index';

// ==================== LEGACY COMPATIBILITY NOTICE ====================

/**
 * @deprecated_notice
 * This file has been refactored into a modular structure located at:
 * - Core Types: frontend/src/types/domain/appointments/core.ts (~300 lines)
 * - API Types: frontend/src/types/domain/appointments/api.ts (~300 lines)  
 * - Utilities: frontend/src/types/domain/appointments/utils.ts (~300 lines)
 * - Main index: frontend/src/types/domain/appointments/index.ts (re-exports)
 * 
 * Benefits of new structure:
 * ✅ Each module under 500 lines (was 896 lines total)
 * ✅ Better separation of concerns by domain
 * ✅ Improved maintainability and navigation
 * ✅ Easier to find related types and utilities
 * ✅ Backward compatibility maintained
 * 
 * To migrate your imports:
 * 1. Keep existing imports working: import { Appointment } from '@/types/domain/appointments'
 * 2. Or use specific imports: import { Appointment } from '@/types/domain/appointments/core'
 * 3. All types remain available with the same names and signatures
 * 4. No code changes needed beyond import statements (optional)
 */

// ==================== VERSION TRACKING ====================

/**
 * Legacy file version for tracking the refactoring
 */
export const LEGACY_APPOINTMENTS_VERSION = '1.0.0-legacy';

/**
 * Migration completion marker
 */
export const REFACTORING_COMPLETED = true;

/**
 * Original file size for reference
 */
export const ORIGINAL_LINE_COUNT = 896;

/**
 * New modular structure line counts
 */
export const MODULAR_STRUCTURE = {
  'core.ts': '~300 lines - Core entities, enums, validation constants',
  'api.ts': '~300 lines - API request/response types, endpoint parameters', 
  'utils.ts': '~300 lines - Validation helpers, utilities, type guards',
  'index.ts': 'Re-exports and compatibility'
} as const;
