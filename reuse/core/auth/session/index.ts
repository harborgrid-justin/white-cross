/**
 * @fileoverview Session Management Utilities
 * @module core/auth/session
 *
 * Session creation, validation, and lifecycle management.
 */

// Re-export session-specific functions
export {
  createSession,
  validateSession,
  updateSessionActivity,
  generateSessionId,
  getSessionTimeRemaining,
  isSessionExpired,
} from '../authentication-kit';

// Re-export session types
export type {
  SessionConfig,
  SessionData,
} from '../authentication-kit';
