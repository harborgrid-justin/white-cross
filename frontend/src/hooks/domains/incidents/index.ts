/**
 * Incidents Domain - Central Export Hub
 *
 * Enterprise hook architecture for incident management and reporting
 * with audit trail and compliance tracking.
 *
 * @module hooks/domains/incidents
 *
 * @remarks
 * This module provides:
 * - Optimistic update hooks for incidents
 * - TanStack Query integration with automatic caching and invalidation
 * - Permission-based workflows
 * - Real-time status tracking
 *
 * **Note**: Incident context providers (WitnessStatementProvider, FollowUpActionProvider)
 * have been moved to `@/contexts/incidents` for better organization.
 *
 * @example
 * ```typescript
 * // Use optimistic incident hooks
 * import { useOptimisticIncidents } from '@/hooks/domains/incidents';
 *
 * const { createIncident, isCreating } = useOptimisticIncidents();
 * createIncident.mutate({ studentId, type, description });
 *
 * // For context providers, import from @/contexts/incidents
 * import {
 *   WitnessStatementProvider,
 *   useWitnessStatements,
 *   FollowUpActionProvider,
 *   useFollowUpActions
 * } from '@/contexts/incidents';
 * ```
 */

// Incident Management Hooks with Optimistic Updates
export * from './mutations/useOptimisticIncidents';

// Note: Context providers have been moved to @/contexts/incidents
// Import from there for WitnessStatementProvider and FollowUpActionProvider
// For backward compatibility, re-export them here:
export {
  WitnessStatementProvider,
  useWitnessStatements,
  FollowUpActionProvider,
  useFollowUpActions,
} from '@/contexts/incidents';
