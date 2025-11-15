/**
 * @fileoverview Analytics API Module - Backward Compatibility Wrapper
 * @module services/modules/analyticsApi
 * @category Services
 *
 * @deprecated This module is deprecated. Use server actions or new API client instead:
 *
 * **Migration Paths:**
 *
 * 1. **For Server Components and Server Actions** (RECOMMENDED):
 *    ```typescript
 *    import {
 *      getHealthMetrics,
 *      getMedicationCompliance,
 *      getAppointmentAnalytics,
 *      getIncidentTrends,
 *      generateReport
 *    } from '@/lib/actions/analytics.actions';
 *
 *    // In Server Component
 *    const metrics = await getHealthMetrics({ schoolId: '123' });
 *    const report = await generateReport({ type: 'health', dateRange: { start, end } });
 *    ```
 *
 * 2. **For Client Components** (with React Query):
 *    ```typescript
 *    import { useQuery } from '@tanstack/react-query';
 *    import { serverGet } from '@/lib/api/client';
 *
 *    function AnalyticsDashboard() {
 *      const { data: metrics } = useQuery({
 *        queryKey: ['analytics', 'health', schoolId],
 *        queryFn: () => serverGet('/api/analytics/health', { schoolId })
 *      });
 *    }
 *    ```
 *
 * 3. **For Direct API Calls** (client-side only):
 *    ```typescript
 *    import { apiClient } from '@/lib/api';
 *
 *    const metrics = await apiClient('/api/analytics/health', {
 *      method: 'GET'
 *    });
 *    ```
 *
 * ## Why This Module is Deprecated
 *
 * - **Server Actions**: Analytics functionality has been migrated to server actions at `@/lib/actions/analytics.actions.ts`
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
 * ## Current Module Structure (For Reference)
 *
 * This module maintains backward compatibility by re-exporting from the refactored
 * analytics subdirectory. All analytics functionality has been reorganized into
 * domain-specific modules:
 *
 * ```
 * services/modules/analytics/
 * ├── cacheUtils.ts           - Shared cache management (180 LOC)
 * ├── healthAnalytics.ts      - Health metrics (154 LOC)
 * ├── incidentAnalytics.ts    - Incident analytics (94 LOC)
 * ├── medicationAnalytics.ts  - Medication analytics (106 LOC)
 * ├── appointmentAnalytics.ts - Appointment analytics (98 LOC)
 * ├── dashboardAnalytics.ts   - Dashboard data (155 LOC)
 * ├── reportsAnalytics.ts     - Custom reports (220 LOC)
 * ├── advancedAnalytics.ts    - Advanced features (174 LOC)
 * └── index.ts                - Main aggregator (239 LOC)
 * ```
 *
 * ## Compatibility Guarantee
 *
 * All existing code using `analyticsApi` will continue to work without changes.
 * However, this is a legacy compatibility layer and should be migrated to the
 * new patterns outlined above.
 *
 * **Scheduled for Removal**: v2.0.0 (Q2 2025)
 *
 * @see {@link @/lib/actions/analytics.actions} for server actions (RECOMMENDED)
 * @see {@link @/lib/api/client} for client-side API utilities
 * @see {@link AnalyticsApi} for the unified API (legacy)
 * @see {@link analytics/index} for the modular structure (legacy)
 */

// Re-export everything from the new analytics module structure
export * from './analytics';

// Re-export default for backward compatibility
export { default } from './analytics';

// Named exports for convenience
export {
  analyticsApi,
  healthAnalytics,
  incidentAnalytics,
  medicationAnalytics,
  appointmentAnalytics,
  dashboardAnalytics,
  reportsAnalytics,
  advancedAnalytics,
  analyticsCache,
  CacheKeys,
  CacheTTL,
  AnalyticsApi,
  createAnalyticsApi
} from './analytics';
