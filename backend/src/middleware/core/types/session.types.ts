/**
 * @fileoverview Session Type Definitions for NestJS
 * @module middleware/core/types/session
 * @description Type-safe session management types for HIPAA-compliant healthcare platforms.
 * Migrated from backend/src/middleware/core/session/session.middleware.ts
 *
 * @security Critical session types - handles user session lifecycle
 * @compliance HIPAA - Session access control and audit logging
 */

/**
 * Session configuration interface
 *
 * @interface SessionConfig
 */
export interface SessionConfig {
  sessionTimeout: number;        // Session timeout in milliseconds
  warningTime: number;          // Warning time before timeout (ms)
  maxConcurrentSessions: number; // Max sessions per user
  requireReauth: boolean;       // Require re-authentication for sensitive operations
  trackActivity: boolean;       // Track user activity
  auditSessions: boolean;       // Enable session audit logging
  store?: SessionStore;         // Custom session store
}

/**
 * Session data interface
 *
 * @interface SessionData
 */
export interface SessionData {
  sessionId: string;
  userId: string;
  email: string;
  role: string;
  createdAt: number;
  lastActivity: number;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  permissions?: string[];
  metadata?: Record<string, any>;
}

/**
 * Session result interface
 *
 * @interface SessionResult
 */
export interface SessionResult {
  valid: boolean;
  session?: SessionData;
  warning?: {
    message: string;
    timeRemaining: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Session store interface
 *
 * @interface SessionStore
 */
export interface SessionStore {
  create(session: SessionData): Promise<void>;
  get(sessionId: string): Promise<SessionData | null>;
  update(sessionId: string, data: Partial<SessionData>): Promise<void>;
  delete(sessionId: string): Promise<void>;
  getUserSessions(userId: string): Promise<SessionData[]>;
  cleanup(): Promise<number>;
}

/**
 * Default session configurations for healthcare platform
 *
 * @constant SESSION_CONFIGS
 */
export const SESSION_CONFIGS = {
  // Standard healthcare session - HIPAA compliant
  healthcare: {
    sessionTimeout: 30 * 60 * 1000,    // 30 minutes
    warningTime: 5 * 60 * 1000,        // 5 minutes warning
    maxConcurrentSessions: 3,           // Allow multiple devices
    requireReauth: true,                // Require re-auth for sensitive ops
    trackActivity: true,                // Track all activity
    auditSessions: true                 // Full audit logging
  } as SessionConfig,

  // Administrative session - More restrictive
  admin: {
    sessionTimeout: 15 * 60 * 1000,    // 15 minutes
    warningTime: 2 * 60 * 1000,        // 2 minutes warning
    maxConcurrentSessions: 1,           // Single session only
    requireReauth: true,                // Always require re-auth
    trackActivity: true,                // Track all activity
    auditSessions: true                 // Full audit logging
  } as SessionConfig,

  // Emergency session - Extended for critical operations
  emergency: {
    sessionTimeout: 60 * 60 * 1000,    // 60 minutes
    warningTime: 10 * 60 * 1000,       // 10 minutes warning
    maxConcurrentSessions: 1,           // Single session
    requireReauth: false,               // No re-auth during emergency
    trackActivity: true,                // Track activity
    auditSessions: true                 // Audit everything
  } as SessionConfig,

  // Development session - Relaxed for testing
  development: {
    sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours
    warningTime: 30 * 60 * 1000,        // 30 minutes warning
    maxConcurrentSessions: 10,           // Multiple sessions
    requireReauth: false,                // No re-auth required
    trackActivity: false,                // Minimal tracking
    auditSessions: false                 // No audit logging
  } as SessionConfig
};
