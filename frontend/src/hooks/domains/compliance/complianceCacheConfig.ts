/**
 * Compliance Domain Cache Configuration
 *
 * Optimized cache timing for different compliance data types based on update
 * frequency and data sensitivity. Balances freshness requirements with
 * performance optimization.
 *
 * @module hooks/domains/compliance/complianceCacheConfig
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 *
 * @see {@link https://tanstack.com/query/latest/docs/react/guides/caching} TanStack Query Caching Guide
 */

/**
 * Cache configuration constants for compliance domain queries.
 *
 * Optimized cache timing for different compliance data types based on update
 * frequency and data sensitivity. Balances freshness requirements with
 * performance optimization.
 *
 * @constant
 *
 * @property {number} DEFAULT_STALE_TIME - Default stale time for all compliance queries (5 minutes)
 * @property {number} DEFAULT_CACHE_TIME - Default cache retention time (10 minutes)
 * @property {number} AUDITS_STALE_TIME - Stale time for audit data (10 minutes)
 * @property {number} POLICIES_STALE_TIME - Stale time for policy data (30 minutes)
 * @property {number} TRAINING_STALE_TIME - Stale time for training data (15 minutes)
 * @property {number} INCIDENTS_STALE_TIME - Stale time for incident data (2 minutes)
 * @property {number} REPORTS_STALE_TIME - Stale time for report data (5 minutes)
 *
 * @example
 * ```typescript
 * // Use in query hook
 * useQuery({
 *   queryKey: COMPLIANCE_QUERY_KEYS.policiesList(),
 *   queryFn: fetchPolicies,
 *   staleTime: COMPLIANCE_CACHE_CONFIG.POLICIES_STALE_TIME,
 * });
 * ```
 *
 * @remarks
 * **Cache Time Rationale:**
 * - **Audits (10min)**: Audit data changes infrequently during audit execution
 * - **Policies (30min)**: Policies are relatively static after approval
 * - **Training (15min)**: Training records update moderately with completions
 * - **Incidents (2min)**: Incidents require near real-time updates during investigation
 * - **Reports (5min)**: Reports benefit from moderate caching for performance
 *
 * **Stale Time vs Cache Time:**
 * - Stale time: How long data is considered fresh (no refetch needed)
 * - Cache time: How long to retain unused data in memory
 * - Cache time is typically 2x stale time for smooth background updates
 *
 * @see {@link https://tanstack.com/query/latest/docs/react/guides/caching} TanStack Query Caching Guide
 */
export const COMPLIANCE_CACHE_CONFIG = {
  // Standard cache times
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  DEFAULT_CACHE_TIME: 10 * 60 * 1000, // 10 minutes

  // Specific configurations
  AUDITS_STALE_TIME: 10 * 60 * 1000, // 10 minutes
  POLICIES_STALE_TIME: 30 * 60 * 1000, // 30 minutes
  TRAINING_STALE_TIME: 15 * 60 * 1000, // 15 minutes
  INCIDENTS_STALE_TIME: 2 * 60 * 1000, // 2 minutes (more dynamic)
  REPORTS_STALE_TIME: 5 * 60 * 1000, // 5 minutes
} as const;
