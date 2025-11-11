/**
 * WF-COMP-327 | integrations.ts - LEGACY FILE - REFACTORED TO MODULAR STRUCTURE
 * 
 * @deprecated This file has been refactored into modular components for better maintainability.
 * New path: frontend/src/types/domain/integrations/
 * 
 * This file now serves as a legacy compatibility layer that re-exports all types
 * from the new modular structure. All new development should import from the 
 * new modular structure directly.
 * 
 * Original Purpose: Integration Hub Type Definitions for healthcare platform
 * New Structure: Modular architecture with separation of concerns
 * 
 * Migration Path:
 * OLD: import { IntegrationType } from '@/types/legacy/integrations'
 * NEW: import { IntegrationType } from '@/types/domain/integrations'
 */

// ==================== RE-EXPORTS FROM MODULAR STRUCTURE ====================

/**
 * Re-export all types from the new modular structure
 * This maintains backward compatibility for existing code
 */
export * from '../domain/integrations';

// ==================== LEGACY COMPATIBILITY NOTICE ====================

/**
 * @deprecated_notice
 * This file has been refactored into a modular structure located at:
 * - Core types: frontend/src/types/domain/integrations/core.ts (~300 lines)
 * - Configuration types: frontend/src/types/domain/integrations/config.ts (~300 lines)  
 * - Sync operations: frontend/src/types/domain/integrations/sync.ts (~280 lines)
 * - API types: frontend/src/types/domain/integrations/api.ts (~240 lines)
 * - Main index: frontend/src/types/domain/integrations/index.ts (re-exports)
 * 
 * Benefits of new structure:
 * ✅ Each module under 500 lines (was 905 lines total)
 * ✅ Better separation of concerns
 * ✅ Improved maintainability
 * ✅ Easier to navigate and understand
 * ✅ Backward compatibility maintained
 * 
 * To migrate your imports:
 * 1. Replace imports from this file with imports from @/types/domain/integrations
 * 2. All types and functions remain available with the same names
 * 3. No code changes needed beyond import statements
 */

// ==================== VERSION TRACKING ====================

/**
 * Legacy file version for tracking the refactoring
 */
export const LEGACY_INTEGRATIONS_VERSION = '1.0.0-legacy';

/**
 * Migration completion marker
 */
export const REFACTORING_COMPLETED = true;

/**
 * Original file size for reference
 */
export const ORIGINAL_LINE_COUNT = 905;

/**
 * New modular structure line counts
 */
export const MODULAR_STRUCTURE = {
  'core.ts': '~300 lines',
  'config.ts': '~300 lines', 
  'sync.ts': '~280 lines',
  'api.ts': '~240 lines',
  'index.ts': 'Re-exports'
} as const;
