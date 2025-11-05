/**
 * @fileoverview Session management validation schemas
 * @module schemas/user.auth.sessions
 *
 * Zod validation schemas for user session management and revocation.
 */

import { z } from 'zod';

// ==========================================
// SESSION MANAGEMENT SCHEMAS
// ==========================================

/**
 * Schema for retrieving user sessions
 *
 * Query user's active or all sessions.
 *
 * @example
 * const sessionQuery = {
 *   userId: '123e4567-e89b-12d3-a456-426614174000',
 *   activeOnly: true
 * };
 * getUserSessionsSchema.parse(sessionQuery);
 */
export const getUserSessionsSchema = z.object({
  /**
   * UUID of the user to get sessions for
   */
  userId: z.string().uuid('Invalid user ID'),

  /**
   * Whether to return only active sessions
   * Default: true
   */
  activeOnly: z.boolean().default(true),
});

/**
 * TypeScript type for getting user sessions input
 */
export type GetUserSessionsInput = z.infer<typeof getUserSessionsSchema>;

/**
 * Schema for revoking a specific user session
 *
 * Allows administrators to forcibly end a user session:
 * - Requires reason for audit trail
 * - Optional user notification
 *
 * @example
 * const revokeSession = {
 *   userId: '123e4567-e89b-12d3-a456-426614174000',
 *   sessionId: '987e6543-e21b-12d3-a456-426614174999',
 *   reason: 'Security incident detected',
 *   notifyUser: true
 * };
 * revokeUserSessionSchema.parse(revokeSession);
 */
export const revokeUserSessionSchema = z.object({
  /**
   * UUID of the user whose session to revoke
   */
  userId: z.string().uuid('Invalid user ID'),

  /**
   * UUID of the session to revoke
   */
  sessionId: z.string().uuid('Invalid session ID'),

  /**
   * Required reason for revoking session (audit trail)
   * Minimum 5 characters for meaningful explanation
   */
  reason: z.string().min(5, 'Reason must be at least 5 characters'),

  /**
   * Whether to notify user of session revocation
   * Default: true
   */
  notifyUser: z.boolean().default(true),
});

/**
 * TypeScript type for revoking user session input
 */
export type RevokeUserSessionInput = z.infer<typeof revokeUserSessionSchema>;

/**
 * Schema for revoking all user sessions
 *
 * Emergency action to terminate all active sessions:
 * - Requires reason for audit trail
 * - Optional exclusion of current session
 * - Optional user notification
 *
 * @example
 * const revokeAllSessions = {
 *   userId: '123e4567-e89b-12d3-a456-426614174000',
 *   reason: 'Password compromised',
 *   notifyUser: true,
 *   excludeCurrentSession: false
 * };
 * revokeAllUserSessionsSchema.parse(revokeAllSessions);
 */
export const revokeAllUserSessionsSchema = z.object({
  /**
   * UUID of the user whose sessions to revoke
   */
  userId: z.string().uuid('Invalid user ID'),

  /**
   * Required reason for revoking all sessions (audit trail)
   * Minimum 5 characters for meaningful explanation
   */
  reason: z.string().min(5, 'Reason must be at least 5 characters'),

  /**
   * Whether to notify user of session revocations
   * Default: true
   */
  notifyUser: z.boolean().default(true),

  /**
   * Whether to exclude the current session from revocation
   * Default: true (allows admin to stay logged in)
   */
  excludeCurrentSession: z.boolean().default(true),
});

/**
 * TypeScript type for revoking all user sessions input
 */
export type RevokeAllUserSessionsInput = z.infer<typeof revokeAllUserSessionsSchema>;
