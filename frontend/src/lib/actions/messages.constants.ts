/**
 * @fileoverview Messages Constants
 * @module lib/actions/messages/constants
 *
 * Runtime constant values for messaging system.
 * Separated from type definitions for proper type-only imports.
 */

// ==========================================
// CACHE CONFIGURATION
// ==========================================

/**
 * Cache tags for message operations
 */
export const MESSAGE_CACHE_TAGS = {
  MESSAGES: 'messages',
  THREADS: 'message-threads',
  CONVERSATIONS: 'conversations',
  ATTACHMENTS: 'message-attachments',
  TEMPLATES: 'message-templates',
} as const;

/**
 * Cache TTL constants (in seconds)
 */
export const CACHE_TTL = {
  SESSION: 300,  // 5 minutes
  STATIC: 3600,  // 1 hour
  STATS: 180,    // 3 minutes
} as const;
