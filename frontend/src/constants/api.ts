/**
 * @fileoverview API Endpoints Constants - LEGACY FILE - REFACTORED TO MODULAR STRUCTURE
 * 
 * @deprecated This file has been refactored into modular components for better maintainability.
 * New path: frontend/src/constants/api/
 * 
 * This file now serves as a legacy compatibility layer that re-exports all endpoints
 * from the new modular structure. All new development should import from the 
 * new modular structure directly.
 * 
 * Original Purpose: Centralized API endpoint definitions for healthcare platform
 * New Structure: Modular architecture with separation of concerns by domain
 * 
 * Migration Path:
 * OLD: import { API_ENDPOINTS } from '@/constants/api'
 * NEW: import { API_ENDPOINTS } from '@/constants/api' (still works!)
 * BETTER: import { AUTH_ENDPOINTS } from '@/constants/api/auth'
 */

// ==================== RE-EXPORTS FROM MODULAR STRUCTURE ====================

/**
 * Re-export all endpoints from the new modular structure
 * This maintains backward compatibility for existing code
 */
export * from './api/index';

/**
 * Default export for backward compatibility
 */
export { default } from './api/index';

// ==================== LEGACY COMPATIBILITY NOTICE ====================

/**
 * @deprecated_notice
 * This file has been refactored into a modular structure located at:
 * - Auth & Security: frontend/src/constants/api/auth.ts (~100 lines)
 * - Students: frontend/src/constants/api/students.ts (~200 lines)  
 * - Health: frontend/src/constants/api/health.ts (~300 lines)
 * - Communications: frontend/src/constants/api/communications.ts (~150 lines)
 * - Admin: frontend/src/constants/api/admin.ts (~400 lines)
 * - Main index: frontend/src/constants/api/index.ts (re-exports)
 * 
 * Benefits of new structure:
 * ✅ Each module under 500 lines (was 901 lines total)
 * ✅ Better separation of concerns by domain
 * ✅ Improved maintainability and navigation
 * ✅ Easier to find related endpoints
 * ✅ Backward compatibility maintained
 * 
 * To migrate your imports:
 * 1. Keep existing imports working: import { API_ENDPOINTS } from '@/constants/api'
 * 2. Or use domain-specific imports: import { AUTH_ENDPOINTS } from '@/constants/api/auth'
 * 3. All endpoints remain available with the same names and signatures
 * 4. No code changes needed beyond import statements (optional)
 */

// ==================== VERSION TRACKING ====================

/**
 * Legacy file version for tracking the refactoring
 */
export const LEGACY_API_VERSION = '1.0.0-legacy';

/**
 * Migration completion marker
 */
export const REFACTORING_COMPLETED = true;

/**
 * Original file size for reference
 */
export const ORIGINAL_LINE_COUNT = 901;

/**
 * New modular structure line counts
 */
export const MODULAR_STRUCTURE = {
  'auth.ts': '~100 lines',
  'students.ts': '~200 lines',
  'health.ts': '~300 lines', 
  'communications.ts': '~150 lines',
  'admin.ts': '~400 lines',
  'index.ts': 'Re-exports'
} as const;
