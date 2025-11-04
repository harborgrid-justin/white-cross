/**
 * Emergency Domain Query Keys Factory
 *
 * Hierarchical query key structure for TanStack Query cache management.
 * Enables precise cache invalidation and efficient query matching.
 *
 * @module hooks/domains/emergency/emergencyQueryKeys
 *
 * @remarks
 * Query keys follow the pattern: `[domain, entity, operation?, identifier?, filters?]`
 *
 * This structure enables:
 * - **Precise invalidation**: Invalidate specific entity or all related queries
 * - **Efficient matching**: TanStack Query matches keys using structural sharing
 * - **Filter support**: Different filter combinations create unique cache entries
 *
 * **Cache Invalidation Examples**:
 * ```typescript
 * // Invalidate all emergency plans
 * queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.emergencyPlans });
 *
 * // Invalidate specific plan
 * queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.emergencyPlanDetails('plan-123') });
 *
 * // Invalidate filtered list
 * queryClient.invalidateQueries({ queryKey: EMERGENCY_QUERY_KEYS.incidentsList({ status: 'ACTIVE' }) });
 * ```
 *
 * @example
 * ```typescript
 * // Use in query hooks
 * const { data } = useQuery({
 *   queryKey: EMERGENCY_QUERY_KEYS.incidentDetails(incidentId),
 *   queryFn: () => fetchIncident(incidentId),
 * });
 * ```
 *
 * @see {@link EMERGENCY_CACHE_CONFIG} for cache timing configuration
 */

/**
 * Emergency Domain Query Keys Factory
 *
 * @constant
 *
 * @property {readonly ['emergency', 'plans']} emergencyPlans - Base key for all emergency plans
 * @property {Function} emergencyPlansList - List query key with optional filters
 * @property {Function} emergencyPlanDetails - Detail query key for specific plan
 * @property {readonly ['emergency', 'incidents']} incidents - Base key for all incidents
 * @property {Function} incidentsList - List query key with optional filters
 * @property {Function} incidentDetails - Detail query key for specific incident
 * @property {Function} incidentTimeline - Timeline query key for incident history
 * @property {readonly ['emergency', 'contacts']} contacts - Base key for all emergency contacts
 * @property {Function} contactsList - List query key with optional filters
 * @property {Function} contactDetails - Detail query key for specific contact
 * @property {readonly ['emergency', 'procedures']} procedures - Base key for all procedures
 * @property {Function} proceduresList - List query key with optional filters
 * @property {Function} procedureDetails - Detail query key for specific procedure
 * @property {readonly ['emergency', 'resources']} resources - Base key for all resources
 * @property {Function} resourcesList - List query key with optional filters
 * @property {Function} resourceDetails - Detail query key for specific resource
 * @property {readonly ['emergency', 'training']} training - Base key for all training
 * @property {Function} trainingList - List query key with optional filters
 * @property {Function} trainingDetails - Detail query key for specific training
 */
export const EMERGENCY_QUERY_KEYS = {
  // Emergency Plans
  emergencyPlans: ['emergency', 'plans'] as const,
  emergencyPlansList: (filters?: any) => [...EMERGENCY_QUERY_KEYS.emergencyPlans, 'list', filters] as const,
  emergencyPlanDetails: (id: string) => [...EMERGENCY_QUERY_KEYS.emergencyPlans, 'detail', id] as const,

  // Emergency Incidents
  incidents: ['emergency', 'incidents'] as const,
  incidentsList: (filters?: any) => [...EMERGENCY_QUERY_KEYS.incidents, 'list', filters] as const,
  incidentDetails: (id: string) => [...EMERGENCY_QUERY_KEYS.incidents, 'detail', id] as const,
  incidentTimeline: (id: string) => [...EMERGENCY_QUERY_KEYS.incidents, id, 'timeline'] as const,

  // Emergency Contacts
  contacts: ['emergency', 'contacts'] as const,
  contactsList: (filters?: any) => [...EMERGENCY_QUERY_KEYS.contacts, 'list', filters] as const,
  contactDetails: (id: string) => [...EMERGENCY_QUERY_KEYS.contacts, 'detail', id] as const,

  // Emergency Procedures
  procedures: ['emergency', 'procedures'] as const,
  proceduresList: (filters?: any) => [...EMERGENCY_QUERY_KEYS.procedures, 'list', filters] as const,
  procedureDetails: (id: string) => [...EMERGENCY_QUERY_KEYS.procedures, 'detail', id] as const,

  // Emergency Resources
  resources: ['emergency', 'resources'] as const,
  resourcesList: (filters?: any) => [...EMERGENCY_QUERY_KEYS.resources, 'list', filters] as const,
  resourceDetails: (id: string) => [...EMERGENCY_QUERY_KEYS.resources, 'detail', id] as const,

  // Emergency Training
  training: ['emergency', 'training'] as const,
  trainingList: (filters?: any) => [...EMERGENCY_QUERY_KEYS.training, 'list', filters] as const,
  trainingDetails: (id: string) => [...EMERGENCY_QUERY_KEYS.training, 'detail', id] as const,
} as const;
