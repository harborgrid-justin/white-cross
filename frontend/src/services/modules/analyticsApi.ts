/**
 * @fileoverview Analytics API Module - Backward Compatibility Wrapper
 * @module services/modules/analyticsApi
 * @category Services
 *
 * This module maintains backward compatibility by re-exporting from the refactored
 * analytics subdirectory. All analytics functionality has been reorganized into
 * domain-specific modules for better maintainability.
 *
 * ## Migration Notice
 *
 * **Original File**: 1,023 LOC (exceeded 300 LOC threshold)
 * **Refactored**: Split into 8 domain-specific modules
 *
 * ### New Module Structure
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
 * ### Recommended Import Patterns
 *
 * **Option 1: Unified API (Backward Compatible)**
 * ```typescript
 * import { analyticsApi } from '@/services/modules/analyticsApi';
 * const dashboard = await analyticsApi.getNurseDashboard('nurse-123');
 * ```
 *
 * **Option 2: Direct Module Access (New Pattern)**
 * ```typescript
 * import { healthAnalytics, dashboardAnalytics } from '@/services/modules/analytics';
 * const metrics = await healthAnalytics.getHealthMetrics({ schoolId: '123' });
 * const dashboard = await dashboardAnalytics.getNurseDashboard('nurse-123');
 * ```
 *
 * **Option 3: Granular Imports**
 * ```typescript
 * import { createHealthAnalytics } from '@/services/modules/analytics/healthAnalytics';
 * import { apiClient } from '@/services/core/ApiClient';
 * const healthAnalytics = createHealthAnalytics(apiClient);
 * ```
 *
 * ## Benefits of Refactoring
 *
 * - **Modularity**: Each domain has its own focused module
 * - **Maintainability**: Easier to locate and update specific functionality
 * - **Type Safety**: Better TypeScript inference with smaller modules
 * - **Performance**: Tree-shaking can eliminate unused modules
 * - **Testing**: Simpler unit testing with isolated modules
 * - **No Circular Dependencies**: Unidirectional dependency flow
 *
 * ## Compatibility Guarantee
 *
 * All existing code using `analyticsApi` will continue to work without changes.
 * The unified API delegates to the new modular structure transparently.
 *
 * @see {@link AnalyticsApi} for the unified API
 * @see {@link analytics/index} for the new modular structure
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
