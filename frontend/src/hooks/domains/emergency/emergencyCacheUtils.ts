/**
 * Emergency Domain Cache Invalidation Utility Functions
 *
 * Convenience functions for invalidating specific emergency domain query caches.
 * Use after mutations to ensure UI reflects latest server state.
 *
 * @module hooks/domains/emergency/emergencyCacheUtils
 *
 * @remarks
 * **When to Invalidate**:
 * - After successful mutations (create, update, delete)
 * - After emergency plan activation
 * - After incident status changes
 * - After resource allocation
 *
 * **Invalidation Scope**:
 * - Specific entity functions invalidate all queries for that entity (list + details)
 * - Use `invalidateAllEmergencyQueries` for cross-entity changes
 *
 * **Performance Considerations**:
 * - Invalidation triggers background refetch for all matching queries
 * - Use specific invalidation when possible to minimize refetches
 * - Consider setQueryData for optimistic updates before invalidation
 *
 * @example
 * ```typescript
 * // After creating an emergency plan
 * const { mutate } = useMutation({
 *   mutationFn: createPlan,
 *   onSuccess: () => {
 *     invalidateEmergencyPlansQueries(queryClient);
 *     toast.success('Plan created');
 *   },
 * });
 * ```
 *
 * @see {@link EMERGENCY_QUERY_KEYS} for query key structure
 */

import { QueryClient } from '@tanstack/react-query';
import { EMERGENCY_QUERY_KEYS } from './emergencyQueryKeys';

/**
 * Invalidates all emergency plans queries (lists and details)
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * Triggers refetch for:
 * - All emergency plans lists (with any filters)
 * - All emergency plan detail views
 * - Active plans queries
 *
 * Use after:
 * - Creating new emergency plan
 * - Updating plan status or content
 * - Activating or deactivating plan
 * - Deleting plan
 *
 * @example
 * ```typescript
 * // In a mutation hook
 * onSuccess: () => {
 *   invalidateEmergencyPlansQueries(queryClient);
 * }
 * ```
 */
export const invalidateEmergencyPlansQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.emergencyPlans });
};

/**
 * Invalidates all incidents queries (lists, details, and timelines)
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * Triggers refetch for:
 * - All incidents lists (with any filters)
 * - All incident detail views
 * - All incident timelines
 * - Active and critical incident queries
 *
 * Use after:
 * - Creating new incident
 * - Updating incident status or severity
 * - Adding timeline entry
 * - Closing incident
 * - Assigning incident commander
 *
 * **Real-Time Considerations**:
 * - Incidents have 2-minute stale time + 15-second refetch intervals
 * - Invalidation provides immediate update beyond automatic refetch
 * - Critical for severity changes and status transitions
 *
 * @example
 * ```typescript
 * // After updating incident severity
 * onSuccess: () => {
 *   invalidateIncidentsQueries(queryClient);
 *   // Also invalidate dashboard for real-time alert updates
 *   queryClient.invalidateQueries({ queryKey: ['emergency', 'dashboard'] });
 * }
 * ```
 */
export const invalidateIncidentsQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.incidents });
};

/**
 * Invalidates all emergency contacts queries
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * Triggers refetch for:
 * - All contacts lists
 * - All contact details
 * - Primary contacts queries
 * - 24x7 contacts queries
 *
 * Use after:
 * - Creating new emergency contact
 * - Updating contact information
 * - Changing contact priority
 * - Activating or deactivating contact
 * - Updating availability schedule
 *
 * @example
 * ```typescript
 * // After updating contact availability
 * onSuccess: () => {
 *   invalidateContactsQueries(queryClient);
 * }
 * ```
 */
export const invalidateContactsQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.contacts });
};

/**
 * Invalidates all emergency procedures queries
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * Triggers refetch for:
 * - All procedures lists
 * - All procedure details
 * - Category-specific procedure queries
 *
 * Use after:
 * - Creating new procedure
 * - Updating procedure steps
 * - Changing procedure version
 * - Activating or archiving procedure
 * - Updating required resources or roles
 *
 * @example
 * ```typescript
 * // After updating evacuation procedure
 * onSuccess: () => {
 *   invalidateProceduresQueries(queryClient);
 * }
 * ```
 */
export const invalidateProceduresQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.procedures });
};

/**
 * Invalidates all emergency resources queries
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * Triggers refetch for:
 * - All resources lists
 * - All resource details
 * - Available resources queries
 * - Location-specific resource queries
 *
 * Use after:
 * - Creating new resource
 * - Updating resource status or availability
 * - Allocating resource to incident
 * - Completing maintenance
 * - Changing resource location
 *
 * **Resource Availability Tracking**:
 * - Invalidation ensures accurate available quantity
 * - Critical for resource allocation decisions
 * - Supports multi-location resource management
 *
 * @example
 * ```typescript
 * // After allocating resource to incident
 * onSuccess: () => {
 *   invalidateResourcesQueries(queryClient);
 *   // Also invalidate incident to show allocated resources
 *   queryClient.invalidateQueries({
 *     queryKey: EMERGENCY_QUERY_KEYS.incidentDetails(incidentId)
 *   });
 * }
 * ```
 */
export const invalidateResourcesQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.resources });
};

/**
 * Invalidates all emergency training queries
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * Triggers refetch for:
 * - All training lists
 * - All training details
 * - Upcoming training queries
 * - Required training queries
 *
 * Use after:
 * - Creating new training
 * - Updating training schedule
 * - Completing training session
 * - Updating training requirements
 * - Issuing certifications
 *
 * @example
 * ```typescript
 * // After completing training drill
 * onSuccess: () => {
 *   invalidateTrainingQueries(queryClient);
 * }
 * ```
 */
export const invalidateTrainingQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.training });
};

/**
 * Invalidates ALL emergency domain queries
 *
 * @param {QueryClient} queryClient - TanStack Query client instance
 *
 * @remarks
 * **Use Sparingly**: This invalidates every emergency-related query in the cache.
 *
 * Triggers refetch for:
 * - All emergency plans
 * - All incidents
 * - All contacts
 * - All procedures
 * - All resources
 * - All training
 * - Dashboard and analytics
 *
 * Use only after:
 * - System-wide configuration changes
 * - Emergency plan activation (affects multiple entities)
 * - Major incident declaration (cascading effects)
 * - Database restoration or sync
 *
 * **Performance Impact**:
 * - Triggers multiple simultaneous refetches
 * - Can cause temporary UI loading states
 * - Prefer specific invalidation when possible
 *
 * @example
 * ```typescript
 * // After activating emergency plan (affects plans, resources, contacts)
 * onSuccess: () => {
 *   invalidateAllEmergencyQueries(queryClient);
 *   toast.success('Emergency plan activated - refreshing all data');
 * }
 * ```
 *
 * @see {@link invalidateEmergencyPlansQueries} for plan-specific invalidation
 * @see {@link invalidateIncidentsQueries} for incident-specific invalidation
 */
export const invalidateAllEmergencyQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ['emergency'] });
};
