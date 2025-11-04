/**
 * Health Management Cache Configuration
 * TanStack Query cache settings for healthcare data management
 */

// ============================================================================
// CACHE CONFIGURATION
// ============================================================================

export const healthCacheConfig = {
  // Standard cache times
  staleTime: {
    short: 1 * 60 * 1000,      // 1 minute - for frequently changing data
    medium: 5 * 60 * 1000,     // 5 minutes - for moderate data
    long: 15 * 60 * 1000,      // 15 minutes - for stable data
    veryLong: 60 * 60 * 1000   // 1 hour - for rarely changing data
  },

  // Cache time by data type
  cacheTime: {
    patients: 15 * 60 * 1000,        // 15 minutes
    appointments: 5 * 60 * 1000,     // 5 minutes
    medicalRecords: 30 * 60 * 1000,  // 30 minutes
    providers: 60 * 60 * 1000,       // 1 hour
    facilities: 60 * 60 * 1000,      // 1 hour
    vitals: 5 * 60 * 1000,           // 5 minutes
    medications: 10 * 60 * 1000,     // 10 minutes
    allergies: 30 * 60 * 1000,       // 30 minutes
    labResults: 10 * 60 * 1000,      // 10 minutes
    clinicalAlerts: 2 * 60 * 1000,   // 2 minutes
    metrics: 5 * 60 * 1000           // 5 minutes
  },

  // Retry configuration
  retry: {
    default: 3,
    critical: 5,
    analytics: 1
  },

  // Refetch intervals for real-time data
  refetchInterval: {
    appointments: 60 * 1000,      // 1 minute
    clinicalAlerts: 30 * 1000,    // 30 seconds
    vitals: 2 * 60 * 1000,        // 2 minutes
    metrics: 5 * 60 * 1000        // 5 minutes
  }
} as const;
