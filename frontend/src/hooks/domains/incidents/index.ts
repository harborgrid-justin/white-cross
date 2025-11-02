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
 * - Optimistic update hooks for incidents, witnesses, and follow-up actions
 * - React Context providers for witness statements and follow-up actions
 * - TanStack Query integration with automatic caching and invalidation
 * - Permission-based action assignment and verification workflows
 * - Real-time status tracking and overdue detection
 *
 * @example
 * ```typescript
 * // Use optimistic incident hooks
 * import { useOptimisticIncidents } from '@/hooks/domains/incidents';
 *
 * const { createIncident, isCreating } = useOptimisticIncidents();
 * createIncident.mutate({ studentId, type, description });
 *
 * // Use witness statement context
 * import { WitnessStatementProvider, useWitnessStatements } from '@/hooks/domains/incidents';
 *
 * <WitnessStatementProvider incidentId={id}>
 *   <WitnessStatementsComponent />
 * </WitnessStatementProvider>
 *
 * // Use follow-up actions context
 * import { FollowUpActionProvider, useFollowUpActions } from '@/hooks/domains/incidents';
 *
 * <FollowUpActionProvider initialIncidentId={id}>
 *   <FollowUpActionsComponent />
 * </FollowUpActionProvider>
 * ```
 */

// Incident Management Hooks with Optimistic Updates
export * from './mutations/useOptimisticIncidents';

// Context Providers and Hooks for State Management
export * from './WitnessStatementContext';
export * from '@/contexts/incidents/FollowUpActionContext';
