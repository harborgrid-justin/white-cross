/**
 * Backward Compatibility Wrapper for incidentReportsApi
 *
 * ⚠️ **DO NOT USE** - This file exists ONLY for legacy backward compatibility.
 *
 * @deprecated DOUBLE DEPRECATED - Will be removed on 2026-06-30
 *
 * This file was replaced by `incidentsApi.ts`, which itself is now deprecated
 * in favor of Server Actions in `@/lib/actions/incidents.*`
 *
 * **MIGRATION PATH**:
 * 1. If you're using `incidentReportsApi` → Switch to `incidentsApi` (deprecated but works)
 * 2. Better: Migrate directly to Server Actions → `@/lib/actions/incidents.*`
 *
 * **RECOMMENDED MIGRATION** (skip incidentsApi, go straight to actions):
 * ```typescript
 * // ❌ VERY OLD: incidentReportsApi (this file)
 * import { incidentReportsApi } from '@/services/modules/incidentReportsApi';
 *
 * // ❌ OLD: incidentsApi (also deprecated)
 * import { incidentsApi } from '@/services/modules/incidentsApi';
 *
 * // ✅ NEW: Server Actions
 * import { getIncidents, createIncident } from '@/lib/actions/incidents.crud';
 * import { getFollowUpActions } from '@/lib/actions/incidents.followup';
 * import { getWitnessStatements } from '@/lib/actions/incidents.witnesses';
 * ```
 *
 * **REASON FOR DEPRECATION**:
 * - Old API path: `/incident-reports/*` (incorrect)
 * - Replaced with: `/incidents/*` (correct, aligns with backend)
 * - Both are now superseded by Server Actions pattern
 *
 * @see incidentsApi.ts (also deprecated, use @/lib/actions/incidents.* instead)
 * @see /src/services/modules/DEPRECATED.md
 */

// Re-export everything from the new incidentsApi
export * from './incidentsApi';

// Import the factory function and types
import { createIncidentsApi } from './incidentsApi';
import type { IIncidentsApi } from './incidentsApi';
import { apiClient } from '../core/ApiClient';

// Create an instance for backward compatibility
export const incidentReportsApi = createIncidentsApi(apiClient);

// Type alias for backward compatibility
export type IIncidentReportsApi = IIncidentsApi;
