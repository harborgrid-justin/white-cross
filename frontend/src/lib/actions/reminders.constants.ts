/**
 * @fileoverview Reminders Constants
 * @module lib/actions/reminders/constants
 *
 * Runtime constant values for reminder system.
 * Separated from type definitions for proper type-only imports.
 */

// ==========================================
// CACHE CONFIGURATION
// ==========================================

/**
 * Cache tags for reminder operations
 */
export const REMINDER_CACHE_TAGS = {
  REMINDERS: 'reminders',
  TEMPLATES: 'reminder-templates',
  SCHEDULES: 'reminder-schedules',
  RECIPIENTS: 'reminder-recipients',
  LOGS: 'reminder-logs',
} as const;
