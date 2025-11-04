/**
 * Cache configuration constants for compliance domain queries.
 *
 * Optimized cache timing for different compliance data types based on update
 * frequency and data sensitivity. Balances freshness requirements with
 * performance optimization.
 *
 * @module hooks/domains/compliance/cache-config
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
