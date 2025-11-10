/**
 * @fileoverview Communications Constants
 * @module lib/actions/communications/constants
 *
 * Runtime constant values for communications management.
 * Separated from type definitions for proper type-only imports.
 */

// ==========================================
// CACHE CONFIGURATION
// ==========================================

// Custom cache tags for communications
export const COMMUNICATIONS_CACHE_TAGS = {
  MESSAGES: 'communications-messages',
  THREADS: 'communications-threads',
  TEMPLATES: 'communications-templates',
  CONTACTS: 'communications-contacts',
  ATTACHMENTS: 'communications-attachments',
} as const;
