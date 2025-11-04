/**
 * Emergency Domain Cache Configuration
 *
 * Defines stale time and cache time strategies for different types of emergency data.
 * Balances real-time requirements with network efficiency and server load.
 *
 * @module hooks/domains/emergency/emergencyCacheConfig
 *
 * @remarks
 * **Stale Time Strategy**:
 *
 * Stale time determines when cached data is considered outdated and a background refetch is triggered:
 *
 * - **Critical Real-Time (2 min)**: Active incidents, emergency alerts - requires frequent updates
 * - **Moderate Updates (15 min)**: Emergency plans, resources - balance between freshness and efficiency
 * - **Infrequent Changes (30-60 min)**: Contacts, procedures, training - optimize network usage
 *
 * **Cache Timing vs. Refetch Intervals**:
 *
 * Stale time works in conjunction with refetch intervals defined in query hooks:
 * - Incidents: 2-minute stale + 15-second refetch interval = near real-time monitoring
 * - Dashboard: 5-minute stale + 60-second refetch interval = periodic updates
 * - Static data: Long stale time + no refetch interval = manual refresh only
 *
 * **HIPAA Compliance**:
 *
 * Cache timing affects audit trail accuracy:
 * - Shorter stale times ensure recent PHI access is logged
 * - Automatic refetch intervals capture emergency status changes
 * - Cache invalidation on mutations maintains data integrity
 *
 * @example
 * ```typescript
 * // Use in incident queries (real-time requirement)
 * useQuery({
 *   queryKey: ['incident', id],
 *   queryFn: () => fetchIncident(id),
 *   staleTime: EMERGENCY_CACHE_CONFIG.INCIDENTS_STALE_TIME,
 *   refetchInterval: 15000, // 15 seconds for active monitoring
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Use in procedure queries (static data)
 * useQuery({
 *   queryKey: ['procedure', id],
 *   queryFn: () => fetchProcedure(id),
 *   staleTime: EMERGENCY_CACHE_CONFIG.PROCEDURES_STALE_TIME,
 *   // No refetch interval - procedures rarely change
 * });
 * ```
 *
 * @see {@link EMERGENCY_QUERY_KEYS} for query key structure
 * @see {@link useEmergencyQueries} for query implementations with cache config
 */

/**
 * Emergency Domain Cache Configuration
 *
 * @constant
 *
 * @property {number} DEFAULT_STALE_TIME - 5 minutes (300,000ms) - General purpose caching
 * @property {number} DEFAULT_CACHE_TIME - 10 minutes (600,000ms) - General purpose cache retention
 * @property {number} EMERGENCY_PLANS_STALE_TIME - 15 minutes (900,000ms) - Plans change infrequently
 * @property {number} INCIDENTS_STALE_TIME - 2 minutes (120,000ms) - Critical real-time data
 * @property {number} CONTACTS_STALE_TIME - 30 minutes (1,800,000ms) - Contacts change rarely
 * @property {number} PROCEDURES_STALE_TIME - 60 minutes (3,600,000ms) - Procedures are static
 * @property {number} RESOURCES_STALE_TIME - 15 minutes (900,000ms) - Resource availability updates moderately
 * @property {number} TRAINING_STALE_TIME - 30 minutes (1,800,000ms) - Training schedules change occasionally
 */
export const EMERGENCY_CACHE_CONFIG = {
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  DEFAULT_CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  EMERGENCY_PLANS_STALE_TIME: 15 * 60 * 1000, // 15 minutes
  INCIDENTS_STALE_TIME: 2 * 60 * 1000, // 2 minutes (real-time data)
  CONTACTS_STALE_TIME: 30 * 60 * 1000, // 30 minutes
  PROCEDURES_STALE_TIME: 60 * 60 * 1000, // 1 hour
  RESOURCES_STALE_TIME: 15 * 60 * 1000, // 15 minutes
  TRAINING_STALE_TIME: 30 * 60 * 1000, // 30 minutes
} as const;
