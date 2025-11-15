/**
 * @fileoverview Appointments API service - REFACTORED TO MODULAR STRUCTURE
 * @module services/modules/appointmentsApi
 * @category Services
 *
 * @deprecated This module is deprecated. Use server actions or new API client instead:
 *
 * **Migration Paths:**
 *
 * 1. **For Server Components and Server Actions** (RECOMMENDED):
 *    ```typescript
 *    import {
 *      getAppointments,
 *      getAppointment,
 *      createAppointment,
 *      updateAppointment,
 *      deleteAppointment,
 *      scheduleAppointment,
 *      rescheduleAppointment
 *    } from '@/lib/actions/appointments.actions';
 *
 *    // In Server Component
 *    const appointments = await getAppointments({ status: 'scheduled', nurseId });
 *    const appointment = await getAppointment(appointmentId);
 *
 *    // In Server Action
 *    const newAppt = await createAppointment({
 *      studentId,
 *      nurseId,
 *      scheduledAt: new Date(),
 *      type: 'checkup'
 *    });
 *    ```
 *
 * 2. **For Client Components** (with React Query):
 *    ```typescript
 *    import { useQuery, useMutation } from '@tanstack/react-query';
 *    import { getAppointments, createAppointment } from '@/lib/actions/appointments.actions';
 *
 *    function AppointmentsList() {
 *      const { data: appointments } = useQuery({
 *        queryKey: ['appointments', filters],
 *        queryFn: () => getAppointments(filters)
 *      });
 *
 *      const createMutation = useMutation({
 *        mutationFn: createAppointment,
 *        onSuccess: () => {
 *          queryClient.invalidateQueries({ queryKey: ['appointments'] });
 *        }
 *      });
 *    }
 *    ```
 *
 * 3. **For Direct API Calls** (client-side only):
 *    ```typescript
 *    import { apiClient } from '@/lib/api';
 *
 *    const appointments = await apiClient('/api/appointments', {
 *      method: 'GET'
 *    });
 *    ```
 *
 * ## Why This Module is Deprecated
 *
 * - **Server Actions**: Appointment functionality has been migrated to server actions at `@/lib/actions/appointments.actions.ts`
 * - **API Client**: New unified API client available at `@/lib/api/client` with better caching and type safety
 * - **Architectural Shift**: Moving from service layer to Next.js App Router patterns (Server Components + Server Actions)
 * - **Type Safety**: Server actions provide end-to-end type safety with React Server Components
 * - **Performance**: Server actions reduce client bundle size and improve initial page load
 * - **Caching**: Better integration with Next.js cache using React cache() and revalidation
 *
 * ## Migration Benefits
 *
 * - ✅ **Type Safety**: Full TypeScript inference from server to client
 * - ✅ **Performance**: Reduced bundle size, server-side execution
 * - ✅ **Caching**: Automatic request deduplication with React cache()
 * - ✅ **Security**: Data fetching happens on server, protecting sensitive logic
 * - ✅ **Simplicity**: No need for separate service layer abstractions
 * - ✅ **Consistency**: Unified pattern across all domains
 *
 * ## Current Modular Structure (For Reference)
 *
 * This file now serves as a legacy compatibility layer that re-exports all functionality
 * from the new modular structure:
 *
 * **New Structure**: Modular architecture with separation by domain:
 * - Core: CRUD operations (appointments-core.ts)
 * - Scheduling: Appointment scheduling (appointments-scheduling.ts)
 * - Status: Status management (appointments-status.ts)
 * - Availability: Nurse availability (availability.ts)
 * - Waitlist: Waitlist management (waitlist.ts)
 * - Reminders: Reminder system (reminders.ts)
 * - Validation: Input validation (validation-*.ts)
 * - Index: Unified API composition (index.ts)
 *
 * **Type Safety Improvements**:
 * - Replaced `notification: any` with `NotificationDeliveryStatus`
 * - Replaced `trends: any[]` with `TrendDataPoint[]`
 * - Replaced `byStudent: any[]` with `StudentNoShowStat[]`
 * - Replaced `byDay: any[]` with `DailyUtilizationStat[]`
 *
 * **Benefits of Refactored Structure**:
 * ✅ Each module under 400 lines (was 1085 lines total)
 * ✅ Better separation of concerns by domain
 * ✅ Improved maintainability and navigation
 * ✅ Easier to find related functionality
 * ✅ Better tree-shaking for optimized bundles
 * ✅ No TypeScript 'any' types (all properly typed)
 * ✅ Backward compatibility maintained
 *
 * ## Compatibility Guarantee
 *
 * All existing code using `appointmentsApi` will continue to work without changes.
 * However, this is a legacy compatibility layer and should be migrated to the
 * new patterns outlined above.
 *
 * **Scheduled for Removal**: v2.0.0 (Q2 2025)
 *
 * @see {@link @/lib/actions/appointments.actions} for server actions (RECOMMENDED)
 * @see {@link @/lib/api/client} for client-side API utilities
 * @see {@link appointmentsApi} for the unified API (legacy)
 * @see {@link appointments/index} for the modular structure (legacy)
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
