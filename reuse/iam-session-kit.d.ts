/**
 * @fileoverview IAM Session Kit - Comprehensive Sequelize-based session management
 * @module reuse/iam-session-kit
 * @description Complete session management solution with Sequelize queries for secure
 * session handling, tracking, expiration, device management, and security controls.
 *
 * Key Features:
 * - Advanced session management with Sequelize
 * - Active session tracking and monitoring
 * - Session storage and retrieval optimization
 * - Automatic session expiration handling
 * - Concurrent session limit enforcement
 * - Secure session invalidation
 * - Multi-device session tracking
 * - Session security controls and validation
 * - Refresh token management
 * - Cross-device session synchronization
 * - Session hijacking prevention
 * - Idle timeout management
 * - Remember-me functionality
 * - Session activity logging
 *
 * @target Sequelize v6.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - OWASP session management best practices
 * - Secure session ID generation (cryptographically random)
 * - Session fixation prevention
 * - Session hijacking detection
 * - XSS and CSRF protection
 * - Secure cookie attributes (HttpOnly, Secure, SameSite)
 * - Session data encryption
 * - Automatic session rotation
 *
 * @example Basic session management
 * ```typescript
 * import { createSession, getActiveSession, invalidateSession } from './iam-session-kit';
 *
 * // Create new session
 * const session = await createSession(sequelize, {
 *   userId: 'user-123',
 *   ipAddress: '192.168.1.1',
 *   userAgent: 'Mozilla/5.0...',
 *   expiresIn: 3600 // 1 hour
 * });
 *
 * // Get active session
 * const activeSession = await getActiveSession(sequelize, session.id);
 *
 * // Invalidate session
 * await invalidateSession(sequelize, session.id);
 * ```
 *
 * @example Advanced session features
 * ```typescript
 * import {
 *   enforceConcurrentSessionLimit,
 *   detectSessionHijacking,
 *   refreshSession,
 *   getDeviceSessions
 * } from './iam-session-kit';
 *
 * // Enforce concurrent session limit
 * await enforceConcurrentSessionLimit(sequelize, userId, 3);
 *
 * // Detect session hijacking
 * const isHijacked = await detectSessionHijacking(sequelize, sessionId, {
 *   ipAddress: '192.168.1.1',
 *   userAgent: 'Mozilla/5.0...'
 * });
 *
 * // Refresh session
 * await refreshSession(sequelize, sessionId);
 *
 * // Get all device sessions
 * const devices = await getDeviceSessions(sequelize, userId);
 * ```
 *
 * LOC: IAM-SES-001
 * UPSTREAM: sequelize, @types/sequelize
 * DOWNSTREAM: auth services, session middleware, API guards
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
import { Sequelize, Transaction } from 'sequelize';
/**
 * @enum SessionStatus
 * @description Session lifecycle statuses
 */
export declare enum SessionStatus {
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    REVOKED = "REVOKED",
    INVALIDATED = "INVALIDATED",
    SUSPENDED = "SUSPENDED"
}
/**
 * @enum SessionType
 * @description Types of sessions
 */
export declare enum SessionType {
    STANDARD = "STANDARD",
    REMEMBER_ME = "REMEMBER_ME",
    SSO = "SSO",
    API = "API",
    MOBILE = "MOBILE",
    TEMPORARY = "TEMPORARY"
}
/**
 * @enum DeviceType
 * @description Types of devices
 */
export declare enum DeviceType {
    DESKTOP = "DESKTOP",
    MOBILE = "MOBILE",
    TABLET = "TABLET",
    API_CLIENT = "API_CLIENT",
    UNKNOWN = "UNKNOWN"
}
/**
 * @interface SessionData
 * @description Complete session information
 */
export interface SessionData {
    id?: string;
    userId: string;
    sessionToken: string;
    refreshToken?: string;
    status: SessionStatus;
    type: SessionType;
    ipAddress?: string;
    userAgent?: string;
    deviceId?: string;
    deviceType?: DeviceType;
    deviceName?: string;
    location?: string;
    createdAt: Date;
    lastActivityAt: Date;
    expiresAt: Date;
    idleTimeout?: number;
    metadata?: Record<string, any>;
    securityFingerprint?: string;
}
/**
 * @interface CreateSessionOptions
 * @description Options for creating a new session
 */
export interface CreateSessionOptions {
    userId: string;
    ipAddress?: string;
    userAgent?: string;
    deviceId?: string;
    deviceType?: DeviceType;
    deviceName?: string;
    location?: string;
    expiresIn?: number;
    idleTimeout?: number;
    type?: SessionType;
    rememberMe?: boolean;
    metadata?: Record<string, any>;
}
/**
 * @interface SessionQueryOptions
 * @description Options for querying sessions
 */
export interface SessionQueryOptions {
    userId?: string;
    status?: SessionStatus | SessionStatus[];
    type?: SessionType | SessionType[];
    deviceId?: string;
    deviceType?: DeviceType;
    activeOnly?: boolean;
    includeExpired?: boolean;
    limit?: number;
    offset?: number;
    orderBy?: string;
    orderDirection?: 'ASC' | 'DESC';
}
/**
 * @interface SessionValidationResult
 * @description Result of session validation
 */
export interface SessionValidationResult {
    valid: boolean;
    session?: SessionData;
    reason?: string;
    requiresRefresh?: boolean;
}
/**
 * @interface SessionSecurityContext
 * @description Security context for session validation
 */
export interface SessionSecurityContext {
    ipAddress: string;
    userAgent: string;
    location?: string;
    timestamp?: Date;
}
/**
 * @interface SessionActivity
 * @description Session activity tracking
 */
export interface SessionActivity {
    sessionId: string;
    action: string;
    timestamp: Date;
    ipAddress?: string;
    metadata?: Record<string, any>;
}
/**
 * @interface DeviceSession
 * @description Device-specific session information
 */
export interface DeviceSession {
    deviceId: string;
    deviceType: DeviceType;
    deviceName?: string;
    activeSessions: number;
    lastActive: Date;
    sessions: SessionData[];
}
/**
 * @interface SessionStats
 * @description Session statistics
 */
export interface SessionStats {
    totalSessions: number;
    activeSessions: number;
    expiredSessions: number;
    revokedSessions: number;
    uniqueUsers: number;
    uniqueDevices: number;
    averageSessionDuration: number;
    sessionsByType: Record<SessionType, number>;
    sessionsByDevice: Record<DeviceType, number>;
}
/**
 * Creates a new session with secure token generation
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateSessionOptions} options - Session creation options
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SessionData>} Created session
 *
 * @example
 * ```typescript
 * const session = await createSession(sequelize, {
 *   userId: 'user-123',
 *   ipAddress: '192.168.1.1',
 *   userAgent: 'Mozilla/5.0...',
 *   expiresIn: 3600,
 *   rememberMe: true
 * });
 * ```
 */
export declare const createSession: (sequelize: Sequelize, options: CreateSessionOptions, transaction?: Transaction) => Promise<SessionData>;
/**
 * Retrieves an active session by session token
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sessionToken - Session token
 * @returns {Promise<SessionData | null>} Session data or null
 *
 * @example
 * ```typescript
 * const session = await getActiveSession(sequelize, 'session-token-123');
 * ```
 */
export declare const getActiveSession: (sequelize: Sequelize, sessionToken: string) => Promise<SessionData | null>;
/**
 * Retrieves a session by ID
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sessionId - Session ID
 * @returns {Promise<SessionData | null>} Session data or null
 *
 * @example
 * ```typescript
 * const session = await getSessionById(sequelize, 'session-uuid');
 * ```
 */
export declare const getSessionById: (sequelize: Sequelize, sessionId: string) => Promise<SessionData | null>;
/**
 * Updates session last activity timestamp
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sessionToken - Session token
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await updateSessionActivity(sequelize, 'session-token-123');
 * ```
 */
export declare const updateSessionActivity: (sequelize: Sequelize, sessionToken: string, transaction?: Transaction) => Promise<boolean>;
/**
 * Invalidates a session (logout)
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sessionToken - Session token
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await invalidateSession(sequelize, 'session-token-123');
 * ```
 */
export declare const invalidateSession: (sequelize: Sequelize, sessionToken: string, transaction?: Transaction) => Promise<boolean>;
/**
 * Invalidates all sessions for a user
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @param {string} [exceptSessionId] - Optional session ID to keep active
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of sessions invalidated
 *
 * @example
 * ```typescript
 * const count = await invalidateAllUserSessions(sequelize, 'user-123', 'current-session-id');
 * ```
 */
export declare const invalidateAllUserSessions: (sequelize: Sequelize, userId: string, exceptSessionId?: string, transaction?: Transaction) => Promise<number>;
/**
 * Revokes a session (admin action)
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sessionId - Session ID
 * @param {string} reason - Revocation reason
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await revokeSession(sequelize, 'session-id', 'Security policy violation');
 * ```
 */
export declare const revokeSession: (sequelize: Sequelize, sessionId: string, reason: string, transaction?: Transaction) => Promise<boolean>;
/**
 * Validates a session with security checks
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sessionToken - Session token
 * @param {SessionSecurityContext} context - Security context
 * @returns {Promise<SessionValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateSession(sequelize, 'session-token', {
 *   ipAddress: '192.168.1.1',
 *   userAgent: 'Mozilla/5.0...'
 * });
 * ```
 */
export declare const validateSession: (sequelize: Sequelize, sessionToken: string, context: SessionSecurityContext) => Promise<SessionValidationResult>;
/**
 * Refreshes a session using refresh token
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} refreshToken - Refresh token
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SessionData | null>} New session or null
 *
 * @example
 * ```typescript
 * const newSession = await refreshSession(sequelize, 'refresh-token-123');
 * ```
 */
export declare const refreshSession: (sequelize: Sequelize, refreshToken: string, transaction?: Transaction) => Promise<SessionData | null>;
/**
 * Extends session expiration time
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sessionToken - Session token
 * @param {number} additionalSeconds - Additional seconds to add
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} Success status
 *
 * @example
 * ```typescript
 * await extendSessionExpiration(sequelize, 'session-token', 3600);
 * ```
 */
export declare const extendSessionExpiration: (sequelize: Sequelize, sessionToken: string, additionalSeconds: number, transaction?: Transaction) => Promise<boolean>;
/**
 * Detects potential session hijacking
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sessionToken - Session token
 * @param {SessionSecurityContext} context - Current security context
 * @returns {Promise<boolean>} True if hijacking detected
 *
 * @example
 * ```typescript
 * const isHijacked = await detectSessionHijacking(sequelize, 'session-token', {
 *   ipAddress: '192.168.1.1',
 *   userAgent: 'Mozilla/5.0...'
 * });
 * ```
 */
export declare const detectSessionHijacking: (sequelize: Sequelize, sessionToken: string, context: SessionSecurityContext) => Promise<boolean>;
/**
 * Suspends a session due to security concerns
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sessionToken - Session token
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} Success status
 */
export declare const suspendSession: (sequelize: Sequelize, sessionToken: string, transaction?: Transaction) => Promise<boolean>;
/**
 * Enforces concurrent session limit for a user
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @param {number} maxSessions - Maximum allowed concurrent sessions
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of sessions terminated
 *
 * @example
 * ```typescript
 * const terminated = await enforceConcurrentSessionLimit(sequelize, 'user-123', 3);
 * ```
 */
export declare const enforceConcurrentSessionLimit: (sequelize: Sequelize, userId: string, maxSessions: number, transaction?: Transaction) => Promise<number>;
/**
 * Gets all active sessions for a user
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @returns {Promise<SessionData[]>} Active sessions
 *
 * @example
 * ```typescript
 * const sessions = await getUserActiveSessions(sequelize, 'user-123');
 * ```
 */
export declare const getUserActiveSessions: (sequelize: Sequelize, userId: string) => Promise<SessionData[]>;
/**
 * Gets count of active sessions for a user
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @returns {Promise<number>} Active session count
 *
 * @example
 * ```typescript
 * const count = await getActiveSessionCount(sequelize, 'user-123');
 * ```
 */
export declare const getActiveSessionCount: (sequelize: Sequelize, userId: string) => Promise<number>;
/**
 * Gets all sessions grouped by device
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @returns {Promise<DeviceSession[]>} Device sessions
 *
 * @example
 * ```typescript
 * const devices = await getDeviceSessions(sequelize, 'user-123');
 * ```
 */
export declare const getDeviceSessions: (sequelize: Sequelize, userId: string) => Promise<DeviceSession[]>;
/**
 * Invalidates all sessions for a specific device
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @param {string} deviceId - Device ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of sessions invalidated
 *
 * @example
 * ```typescript
 * const count = await invalidateDeviceSessions(sequelize, 'user-123', 'device-456');
 * ```
 */
export declare const invalidateDeviceSessions: (sequelize: Sequelize, userId: string, deviceId: string, transaction?: Transaction) => Promise<number>;
/**
 * Registers a new device for a user
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @param {object} deviceInfo - Device information
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Device ID
 */
export declare const registerDevice: (sequelize: Sequelize, userId: string, deviceInfo: {
    deviceType: DeviceType;
    deviceName?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
}, transaction?: Transaction) => Promise<string>;
/**
 * Marks a device as trusted
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} deviceId - Device ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} Success status
 */
export declare const trustDevice: (sequelize: Sequelize, deviceId: string, transaction?: Transaction) => Promise<boolean>;
/**
 * Expires a session
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sessionToken - Session token
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} Success status
 */
export declare const expireSession: (sequelize: Sequelize, sessionToken: string, transaction?: Transaction) => Promise<boolean>;
/**
 * Cleans up expired sessions (batch operation)
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of sessions cleaned up
 *
 * @example
 * ```typescript
 * const cleaned = await cleanupExpiredSessions(sequelize);
 * console.log(`Cleaned up ${cleaned} expired sessions`);
 * ```
 */
export declare const cleanupExpiredSessions: (sequelize: Sequelize, transaction?: Transaction) => Promise<number>;
/**
 * Deletes old sessions beyond retention period
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} retentionDays - Retention period in days
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of sessions deleted
 *
 * @example
 * ```typescript
 * const deleted = await deleteOldSessions(sequelize, 90);
 * ```
 */
export declare const deleteOldSessions: (sequelize: Sequelize, retentionDays?: number, transaction?: Transaction) => Promise<number>;
/**
 * Cleans up idle sessions based on timeout
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of sessions cleaned up
 */
export declare const cleanupIdleSessions: (sequelize: Sequelize, transaction?: Transaction) => Promise<number>;
/**
 * Gets comprehensive session statistics
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} [startDate] - Optional start date filter
 * @param {Date} [endDate] - Optional end date filter
 * @returns {Promise<SessionStats>} Session statistics
 *
 * @example
 * ```typescript
 * const stats = await getSessionStatistics(sequelize);
 * ```
 */
export declare const getSessionStatistics: (sequelize: Sequelize, startDate?: Date, endDate?: Date) => Promise<SessionStats>;
/**
 * Gets session activity timeline for a user
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @param {number} [days=30] - Number of days to look back
 * @returns {Promise<any[]>} Activity timeline
 */
export declare const getSessionActivityTimeline: (sequelize: Sequelize, userId: string, days?: number) => Promise<any[]>;
/**
 * Generates a cryptographically secure session token
 *
 * @returns {string} Secure random token
 */
export declare const generateSecureToken: () => string;
/**
 * Generates security fingerprint from context
 *
 * @param {Partial<SessionSecurityContext>} context - Security context
 * @returns {string} Security fingerprint hash
 */
export declare const generateSecurityFingerprint: (context: Partial<SessionSecurityContext>) => string;
/**
 * Parses User-Agent to detect device type
 *
 * @param {string} userAgent - User agent string
 * @returns {DeviceType} Detected device type
 */
export declare const parseDeviceType: (userAgent: string) => DeviceType;
/**
 * Queries sessions with advanced filtering
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {SessionQueryOptions} options - Query options
 * @returns {Promise<SessionData[]>} Matching sessions
 */
export declare const querySessions: (sequelize: Sequelize, options: SessionQueryOptions) => Promise<SessionData[]>;
/**
 * Gets sessions expiring soon (within specified hours)
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} withinHours - Hours threshold
 * @returns {Promise<SessionData[]>} Expiring sessions
 *
 * @example
 * ```typescript
 * const expiring = await getExpiringSessions(sequelize, 24);
 * ```
 */
export declare const getExpiringSessions: (sequelize: Sequelize, withinHours?: number) => Promise<SessionData[]>;
/**
 * Gets sessions by location
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} location - Location string
 * @returns {Promise<SessionData[]>} Sessions from location
 */
export declare const getSessionsByLocation: (sequelize: Sequelize, location: string) => Promise<SessionData[]>;
/**
 * Gets session history for a specific user with pagination
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @param {number} [limit=50] - Result limit
 * @param {number} [offset=0] - Result offset
 * @returns {Promise<SessionData[]>} Session history
 */
export declare const getSessionHistory: (sequelize: Sequelize, userId: string, limit?: number, offset?: number) => Promise<SessionData[]>;
/**
 * Gets long-running sessions (active beyond threshold)
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} thresholdHours - Hours threshold
 * @returns {Promise<SessionData[]>} Long-running sessions
 */
export declare const getLongRunningSessions: (sequelize: Sequelize, thresholdHours?: number) => Promise<SessionData[]>;
/**
 * Gets sessions with suspicious IP changes
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [days=7] - Days to look back
 * @returns {Promise<any[]>} Sessions with IP changes
 */
export declare const getSessionsWithIPChanges: (sequelize: Sequelize, days?: number) => Promise<any[]>;
/**
 * Gets remember-me sessions
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} [userId] - Optional user ID filter
 * @returns {Promise<SessionData[]>} Remember-me sessions
 */
export declare const getRememberMeSessions: (sequelize: Sequelize, userId?: string) => Promise<SessionData[]>;
/**
 * Gets API sessions
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<SessionData[]>} API sessions
 */
export declare const getAPISessions: (sequelize: Sequelize) => Promise<SessionData[]>;
/**
 * Gets mobile sessions
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} [userId] - Optional user ID filter
 * @returns {Promise<SessionData[]>} Mobile sessions
 */
export declare const getMobileSessions: (sequelize: Sequelize, userId?: string) => Promise<SessionData[]>;
/**
 * Rotates session token for security
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} currentToken - Current session token
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string | null>} New session token or null
 */
export declare const rotateSessionToken: (sequelize: Sequelize, currentToken: string, transaction?: Transaction) => Promise<string | null>;
/**
 * Updates session metadata
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sessionToken - Session token
 * @param {Record<string, any>} metadata - Metadata to merge
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} Success status
 */
export declare const updateSessionMetadata: (sequelize: Sequelize, sessionToken: string, metadata: Record<string, any>, transaction?: Transaction) => Promise<boolean>;
/**
 * Gets sessions grouped by status
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} [startDate] - Optional start date
 * @returns {Promise<any[]>} Sessions grouped by status
 */
export declare const getSessionsByStatus: (sequelize: Sequelize, startDate?: Date) => Promise<any[]>;
/**
 * Gets average session duration by user
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @returns {Promise<number>} Average duration in seconds
 */
export declare const getAverageSessionDuration: (sequelize: Sequelize, userId: string) => Promise<number>;
/**
 * Gets concurrent sessions peak count
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} date - Date to analyze
 * @returns {Promise<any[]>} Peak concurrent sessions by hour
 */
export declare const getConcurrentSessionsPeak: (sequelize: Sequelize, date: Date) => Promise<any[]>;
/**
 * Terminates all sessions for security incident
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reason - Termination reason
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of sessions terminated
 */
export declare const terminateAllSessions: (sequelize: Sequelize, reason: string, transaction?: Transaction) => Promise<number>;
/**
 * Gets session duration distribution
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [days=30] - Days to analyze
 * @returns {Promise<any[]>} Duration distribution buckets
 */
export declare const getSessionDurationDistribution: (sequelize: Sequelize, days?: number) => Promise<any[]>;
/**
 * Checks if user has reached session limit
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @param {number} limit - Session limit
 * @returns {Promise<boolean>} True if limit reached
 */
export declare const hasReachedSessionLimit: (sequelize: Sequelize, userId: string, limit: number) => Promise<boolean>;
/**
 * Gets sessions without recent activity (potentially stale)
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} inactiveMinutes - Minutes of inactivity threshold
 * @returns {Promise<SessionData[]>} Inactive sessions
 */
export declare const getInactiveSessions: (sequelize: Sequelize, inactiveMinutes?: number) => Promise<SessionData[]>;
//# sourceMappingURL=iam-session-kit.d.ts.map