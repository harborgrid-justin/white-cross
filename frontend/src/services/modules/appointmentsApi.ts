/**
 * @fileoverview Appointments API service - REFACTORED TO MODULAR STRUCTURE
 * @module services/modules/appointmentsApi
 * @category Services
 *
 * @deprecated This file has been refactored into modular components for better maintainability.
 * New path: frontend/src/services/modules/appointments/
 *
 * This file now serves as a legacy compatibility layer that re-exports all functionality
 * from the new modular structure. All new development should import from the modular
 * structure directly for better tree-shaking and clearer dependencies.
 *
 * **Original Purpose**: Comprehensive appointment management API including scheduling,
 * availability tracking, waitlist management, and reminder processing.
 *
 * **New Structure**: Modular architecture with separation by domain:
 * - Core: CRUD operations (appointmentsApi.core.ts)
 * - Availability: Scheduling and nurse availability (appointmentsApi.availability.ts)
 * - Waitlist: Waitlist and reminder management (appointmentsApi.waitlist.ts)
 * - Analytics: Statistics and reporting (appointmentsApi.analytics.ts)
 * - Index: Unified API composition (index.ts)
 *
 * **Migration Path**:
 * ```typescript
 * // OLD (still works):
 * import { appointmentsApi } from '@/services/modules/appointmentsApi'
 *
 * // NEW (preferred):
 * import { appointmentsApi } from '@/services/modules/appointments'
 *
 * // OR for specific features:
 * import { AppointmentsCoreApiImpl } from '@/services/modules/appointments/appointmentsApi.core'
 * ```
 *
 * **Benefits of New Structure**:
 * ✅ Each module under 400 lines (was 1085 lines total)
 * ✅ Better separation of concerns by domain
 * ✅ Improved maintainability and navigation
 * ✅ Easier to find related functionality
 * ✅ Better tree-shaking for optimized bundles
 * ✅ No TypeScript 'any' types (all properly typed)
 * ✅ Backward compatibility maintained
 *
 * **Type Safety Improvements**:
 * - Replaced `notification: any` with `NotificationDeliveryStatus`
 * - Replaced `trends: any[]` with `TrendDataPoint[]`
 * - Replaced `byStudent: any[]` with `StudentNoShowStat[]`
 * - Replaced `byDay: any[]` with `DailyUtilizationStat[]`
 */

// ==================== RE-EXPORTS FROM MODULAR STRUCTURE ====================

/**
 * Re-export all appointments API functionality from the new modular structure
 * This maintains backward compatibility for existing code
 */
export * from './appointments'

// ==================== LEGACY COMPATIBILITY NOTICE ====================

/**
 * @deprecated_notice
 * This file has been refactored into a modular structure located at:
 * - Core: frontend/src/services/modules/appointments/appointmentsApi.core.ts (~373 lines)
 * - Availability: frontend/src/services/modules/appointments/appointmentsApi.availability.ts (~365 lines)
 * - Waitlist: frontend/src/services/modules/appointments/appointmentsApi.waitlist.ts (~361 lines)
 * - Analytics: frontend/src/services/modules/appointments/appointmentsApi.analytics.ts (~338 lines)
 * - Index: frontend/src/services/modules/appointments/index.ts (~164 lines)
 *
 * Benefits of new structure:
 * ✅ All modules under 400 lines (was 1085 lines total)
 * ✅ Better separation of concerns by domain
 * ✅ Improved maintainability and navigation
 * ✅ Easier to find related functionality
 * ✅ All TypeScript 'any' types replaced with proper types
 * ✅ Backward compatibility maintained
 *
 * To migrate your imports:
 * 1. Keep existing imports working: import { appointmentsApi } from '@/services/modules/appointmentsApi'
 * 2. Or use new path: import { appointmentsApi } from '@/services/modules/appointments'
 * 3. Or import specific features: import { AppointmentsCoreApiImpl } from '@/services/modules/appointments/appointmentsApi.core'
 * 4. All types and functionality remain available with the same names and signatures
 * 5. No code changes needed beyond import statements (optional)
 */

// ==================== VERSION TRACKING ====================

/**
 * Legacy file version for tracking the refactoring
 */
export const LEGACY_APPOINTMENTS_API_VERSION = '1.0.0-legacy'

/**
 * Migration completion marker
 */
export const REFACTORING_COMPLETED = true

/**
 * Original file size for reference
 */
export const ORIGINAL_LINE_COUNT = 1085

/**
 * New modular structure line counts
 */
export const MODULAR_STRUCTURE = {
  'appointmentsApi.core.ts': '~373 lines - Core CRUD operations',
  'appointmentsApi.availability.ts': '~365 lines - Availability and scheduling',
  'appointmentsApi.waitlist.ts': '~361 lines - Waitlist and reminders',
  'appointmentsApi.analytics.ts': '~338 lines - Statistics and reporting',
  'index.ts': '~164 lines - API composition and exports'
} as const

/**
 * Type safety improvements
 */
export const TYPE_IMPROVEMENTS = {
  'notification: any': 'NotificationDeliveryStatus',
  'trends: any[]': 'TrendDataPoint[]',
  'byStudent: any[]': 'StudentNoShowStat[]',
  'byDay: any[]': 'DailyUtilizationStat[]'
} as const
