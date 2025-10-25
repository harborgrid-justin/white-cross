/**
 * Optimistic Incidents Hooks - Convenience Export
 *
 * Re-exports optimistic update hooks for incident operations.
 * Provides a convenient top-level import path.
 */

export {
  useOptimisticIncidents,
  useOptimisticIncidentCreate,
  useOptimisticIncidentUpdate,
  useOptimisticIncidentDelete,
  useOptimisticWitnessCreate,
  useOptimisticFollowUpCreate,
  useOptimisticFollowUpComplete,
} from './domains/incidents/mutations/useOptimisticIncidents';
