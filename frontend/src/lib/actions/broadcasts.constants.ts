/**
 * @fileoverview Broadcast Constants
 * @module lib/actions/broadcasts/constants
 *
 * Runtime constant values for broadcast communication management.
 * Separated from type definitions for proper type-only imports.
 */

// ==========================================
// CACHE CONFIGURATION
// ==========================================

/**
 * Custom cache tags for broadcasts
 */
export const BROADCAST_CACHE_TAGS = {
  BROADCASTS: 'broadcasts',
  TEMPLATES: 'broadcast-templates',
  RECIPIENTS: 'broadcast-recipients',
  ANALYTICS: 'broadcast-analytics',
  SCHEDULES: 'broadcast-schedules',
} as const;
