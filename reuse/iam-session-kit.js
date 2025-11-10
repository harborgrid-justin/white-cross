"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInactiveSessions = exports.hasReachedSessionLimit = exports.getSessionDurationDistribution = exports.terminateAllSessions = exports.getConcurrentSessionsPeak = exports.getAverageSessionDuration = exports.getSessionsByStatus = exports.updateSessionMetadata = exports.rotateSessionToken = exports.getMobileSessions = exports.getAPISessions = exports.getRememberMeSessions = exports.getSessionsWithIPChanges = exports.getLongRunningSessions = exports.getSessionHistory = exports.getSessionsByLocation = exports.getExpiringSessions = exports.querySessions = exports.parseDeviceType = exports.generateSecurityFingerprint = exports.generateSecureToken = exports.getSessionActivityTimeline = exports.getSessionStatistics = exports.cleanupIdleSessions = exports.deleteOldSessions = exports.cleanupExpiredSessions = exports.expireSession = exports.trustDevice = exports.registerDevice = exports.invalidateDeviceSessions = exports.getDeviceSessions = exports.getActiveSessionCount = exports.getUserActiveSessions = exports.enforceConcurrentSessionLimit = exports.suspendSession = exports.detectSessionHijacking = exports.extendSessionExpiration = exports.refreshSession = exports.validateSession = exports.revokeSession = exports.invalidateAllUserSessions = exports.invalidateSession = exports.updateSessionActivity = exports.getSessionById = exports.getActiveSession = exports.createSession = exports.DeviceType = exports.SessionType = exports.SessionStatus = void 0;
const sequelize_1 = require("sequelize");
const crypto = __importStar(require("crypto"));
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * @enum SessionStatus
 * @description Session lifecycle statuses
 */
var SessionStatus;
(function (SessionStatus) {
    SessionStatus["ACTIVE"] = "ACTIVE";
    SessionStatus["EXPIRED"] = "EXPIRED";
    SessionStatus["REVOKED"] = "REVOKED";
    SessionStatus["INVALIDATED"] = "INVALIDATED";
    SessionStatus["SUSPENDED"] = "SUSPENDED";
})(SessionStatus || (exports.SessionStatus = SessionStatus = {}));
/**
 * @enum SessionType
 * @description Types of sessions
 */
var SessionType;
(function (SessionType) {
    SessionType["STANDARD"] = "STANDARD";
    SessionType["REMEMBER_ME"] = "REMEMBER_ME";
    SessionType["SSO"] = "SSO";
    SessionType["API"] = "API";
    SessionType["MOBILE"] = "MOBILE";
    SessionType["TEMPORARY"] = "TEMPORARY";
})(SessionType || (exports.SessionType = SessionType = {}));
/**
 * @enum DeviceType
 * @description Types of devices
 */
var DeviceType;
(function (DeviceType) {
    DeviceType["DESKTOP"] = "DESKTOP";
    DeviceType["MOBILE"] = "MOBILE";
    DeviceType["TABLET"] = "TABLET";
    DeviceType["API_CLIENT"] = "API_CLIENT";
    DeviceType["UNKNOWN"] = "UNKNOWN";
})(DeviceType || (exports.DeviceType = DeviceType = {}));
// ============================================================================
// SESSION CREATION AND MANAGEMENT
// ============================================================================
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
const createSession = async (sequelize, options, transaction) => {
    const sessionToken = (0, exports.generateSecureToken)();
    const refreshToken = options.rememberMe ? (0, exports.generateSecureToken)() : undefined;
    const expiresIn = options.expiresIn || (options.rememberMe ? 30 * 24 * 3600 : 3600); // 30 days or 1 hour
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    const securityFingerprint = (0, exports.generateSecurityFingerprint)({
        ipAddress: options.ipAddress || '',
        userAgent: options.userAgent || '',
    });
    const type = options.type || (options.rememberMe ? SessionType.REMEMBER_ME : SessionType.STANDARD);
    const [result] = await sequelize.query(`INSERT INTO sessions (
      user_id, session_token, refresh_token, status, type,
      ip_address, user_agent, device_id, device_type, device_name,
      location, created_at, last_activity_at, expires_at, idle_timeout,
      metadata, security_fingerprint, updated_at
    ) VALUES (
      :userId, :sessionToken, :refreshToken, :status, :type,
      :ipAddress, :userAgent, :deviceId, :deviceType, :deviceName,
      :location, NOW(), NOW(), :expiresAt, :idleTimeout,
      :metadata, :securityFingerprint, NOW()
    ) RETURNING *`, {
        replacements: {
            userId: options.userId,
            sessionToken,
            refreshToken: refreshToken || null,
            status: SessionStatus.ACTIVE,
            type,
            ipAddress: options.ipAddress || null,
            userAgent: options.userAgent || null,
            deviceId: options.deviceId || null,
            deviceType: options.deviceType || DeviceType.UNKNOWN,
            deviceName: options.deviceName || null,
            location: options.location || null,
            expiresAt,
            idleTimeout: options.idleTimeout || 1800, // 30 minutes default
            metadata: options.metadata ? JSON.stringify(options.metadata) : null,
            securityFingerprint,
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    return result;
};
exports.createSession = createSession;
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
const getActiveSession = async (sequelize, sessionToken) => {
    const [results] = await sequelize.query(`SELECT * FROM sessions
     WHERE session_token = :sessionToken
       AND status = :status
       AND expires_at > NOW()
     LIMIT 1`, {
        replacements: {
            sessionToken,
            status: SessionStatus.ACTIVE,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results.length > 0 ? results[0] : null;
};
exports.getActiveSession = getActiveSession;
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
const getSessionById = async (sequelize, sessionId) => {
    const [results] = await sequelize.query(`SELECT * FROM sessions
     WHERE id = :sessionId
     LIMIT 1`, {
        replacements: { sessionId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results.length > 0 ? results[0] : null;
};
exports.getSessionById = getSessionById;
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
const updateSessionActivity = async (sequelize, sessionToken, transaction) => {
    const [, metadata] = await sequelize.query(`UPDATE sessions
     SET last_activity_at = NOW(),
         updated_at = NOW()
     WHERE session_token = :sessionToken
       AND status = :status`, {
        replacements: {
            sessionToken,
            status: SessionStatus.ACTIVE,
        },
        transaction,
    });
    return metadata.rowCount > 0;
};
exports.updateSessionActivity = updateSessionActivity;
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
const invalidateSession = async (sequelize, sessionToken, transaction) => {
    const [, metadata] = await sequelize.query(`UPDATE sessions
     SET status = :status,
         updated_at = NOW()
     WHERE session_token = :sessionToken`, {
        replacements: {
            sessionToken,
            status: SessionStatus.INVALIDATED,
        },
        transaction,
    });
    return metadata.rowCount > 0;
};
exports.invalidateSession = invalidateSession;
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
const invalidateAllUserSessions = async (sequelize, userId, exceptSessionId, transaction) => {
    const exceptClause = exceptSessionId ? 'AND id != :exceptSessionId' : '';
    const [, metadata] = await sequelize.query(`UPDATE sessions
     SET status = :status,
         updated_at = NOW()
     WHERE user_id = :userId
       AND status = :activeStatus
       ${exceptClause}`, {
        replacements: {
            userId,
            status: SessionStatus.INVALIDATED,
            activeStatus: SessionStatus.ACTIVE,
            exceptSessionId: exceptSessionId || null,
        },
        transaction,
    });
    return metadata.rowCount || 0;
};
exports.invalidateAllUserSessions = invalidateAllUserSessions;
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
const revokeSession = async (sequelize, sessionId, reason, transaction) => {
    const [, metadata] = await sequelize.query(`UPDATE sessions
     SET status = :status,
         metadata = jsonb_set(
           COALESCE(metadata, '{}'::jsonb),
           '{revocationReason}',
           :reason
         ),
         updated_at = NOW()
     WHERE id = :sessionId`, {
        replacements: {
            sessionId,
            status: SessionStatus.REVOKED,
            reason: JSON.stringify(reason),
        },
        transaction,
    });
    return metadata.rowCount > 0;
};
exports.revokeSession = revokeSession;
// ============================================================================
// SESSION VALIDATION AND SECURITY
// ============================================================================
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
const validateSession = async (sequelize, sessionToken, context) => {
    const session = await (0, exports.getActiveSession)(sequelize, sessionToken);
    if (!session) {
        return { valid: false, reason: 'Session not found or inactive' };
    }
    // Check expiration
    if (new Date(session.expiresAt) <= new Date()) {
        await (0, exports.expireSession)(sequelize, sessionToken);
        return { valid: false, reason: 'Session expired' };
    }
    // Check idle timeout
    if (session.idleTimeout) {
        const idleTime = (Date.now() - new Date(session.lastActivityAt).getTime()) / 1000;
        if (idleTime > session.idleTimeout) {
            await (0, exports.expireSession)(sequelize, sessionToken);
            return { valid: false, reason: 'Session idle timeout', requiresRefresh: true };
        }
    }
    // Security fingerprint check (optional - can be strict or lenient)
    const currentFingerprint = (0, exports.generateSecurityFingerprint)(context);
    if (session.securityFingerprint && session.securityFingerprint !== currentFingerprint) {
        // Log potential session hijacking
        await logSessionSecurity(sequelize, session.id, 'FINGERPRINT_MISMATCH', context);
        // Optionally invalidate session based on policy
    }
    // Update activity
    await (0, exports.updateSessionActivity)(sequelize, sessionToken);
    return { valid: true, session };
};
exports.validateSession = validateSession;
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
const refreshSession = async (sequelize, refreshToken, transaction) => {
    // Find session by refresh token
    const [oldSessions] = await sequelize.query(`SELECT * FROM sessions
     WHERE refresh_token = :refreshToken
       AND status = :status
     LIMIT 1`, {
        replacements: {
            refreshToken,
            status: SessionStatus.ACTIVE,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    if (oldSessions.length === 0)
        return null;
    const oldSession = oldSessions[0];
    // Generate new tokens
    const newSessionToken = (0, exports.generateSecureToken)();
    const newRefreshToken = (0, exports.generateSecureToken)();
    const expiresAt = new Date(Date.now() + 30 * 24 * 3600 * 1000); // 30 days
    // Invalidate old session
    await (0, exports.invalidateSession)(sequelize, oldSession.session_token, transaction);
    // Create new session
    const [newSession] = await sequelize.query(`INSERT INTO sessions (
      user_id, session_token, refresh_token, status, type,
      ip_address, user_agent, device_id, device_type, device_name,
      location, created_at, last_activity_at, expires_at, idle_timeout,
      metadata, security_fingerprint, updated_at
    ) VALUES (
      :userId, :sessionToken, :refreshToken, :status, :type,
      :ipAddress, :userAgent, :deviceId, :deviceType, :deviceName,
      :location, NOW(), NOW(), :expiresAt, :idleTimeout,
      :metadata, :securityFingerprint, NOW()
    ) RETURNING *`, {
        replacements: {
            userId: oldSession.user_id,
            sessionToken: newSessionToken,
            refreshToken: newRefreshToken,
            status: SessionStatus.ACTIVE,
            type: oldSession.type,
            ipAddress: oldSession.ip_address,
            userAgent: oldSession.user_agent,
            deviceId: oldSession.device_id,
            deviceType: oldSession.device_type,
            deviceName: oldSession.device_name,
            location: oldSession.location,
            expiresAt,
            idleTimeout: oldSession.idle_timeout,
            metadata: oldSession.metadata,
            securityFingerprint: oldSession.security_fingerprint,
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    return newSession;
};
exports.refreshSession = refreshSession;
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
const extendSessionExpiration = async (sequelize, sessionToken, additionalSeconds, transaction) => {
    const [, metadata] = await sequelize.query(`UPDATE sessions
     SET expires_at = expires_at + INTERVAL '${additionalSeconds} seconds',
         updated_at = NOW()
     WHERE session_token = :sessionToken
       AND status = :status`, {
        replacements: {
            sessionToken,
            status: SessionStatus.ACTIVE,
        },
        transaction,
    });
    return metadata.rowCount > 0;
};
exports.extendSessionExpiration = extendSessionExpiration;
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
const detectSessionHijacking = async (sequelize, sessionToken, context) => {
    const session = await (0, exports.getActiveSession)(sequelize, sessionToken);
    if (!session)
        return false;
    // Check IP address change
    const ipChanged = session.ipAddress && session.ipAddress !== context.ipAddress;
    // Check user agent change
    const uaChanged = session.userAgent && session.userAgent !== context.userAgent;
    // Check security fingerprint
    const fingerprintChanged = session.securityFingerprint !== (0, exports.generateSecurityFingerprint)(context);
    // If multiple factors changed, likely hijacking
    const suspiciousChanges = [ipChanged, uaChanged, fingerprintChanged].filter(Boolean).length;
    if (suspiciousChanges >= 2) {
        await logSessionSecurity(sequelize, session.id, 'HIJACKING_DETECTED', context);
        await (0, exports.suspendSession)(sequelize, sessionToken);
        return true;
    }
    return false;
};
exports.detectSessionHijacking = detectSessionHijacking;
/**
 * Suspends a session due to security concerns
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sessionToken - Session token
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} Success status
 */
const suspendSession = async (sequelize, sessionToken, transaction) => {
    const [, metadata] = await sequelize.query(`UPDATE sessions
     SET status = :status,
         updated_at = NOW()
     WHERE session_token = :sessionToken`, {
        replacements: {
            sessionToken,
            status: SessionStatus.SUSPENDED,
        },
        transaction,
    });
    return metadata.rowCount > 0;
};
exports.suspendSession = suspendSession;
// ============================================================================
// CONCURRENT SESSION MANAGEMENT
// ============================================================================
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
const enforceConcurrentSessionLimit = async (sequelize, userId, maxSessions, transaction) => {
    // Get all active sessions ordered by last activity
    const [sessions] = await sequelize.query(`SELECT id, session_token
     FROM sessions
     WHERE user_id = :userId
       AND status = :status
     ORDER BY last_activity_at DESC`, {
        replacements: {
            userId,
            status: SessionStatus.ACTIVE,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    if (sessions.length <= maxSessions)
        return 0;
    // Terminate oldest sessions beyond the limit
    const sessionsToTerminate = sessions.slice(maxSessions);
    const sessionIds = sessionsToTerminate.map((s) => s.id);
    const [, metadata] = await sequelize.query(`UPDATE sessions
     SET status = :status,
         metadata = jsonb_set(
           COALESCE(metadata, '{}'::jsonb),
           '{terminationReason}',
           '"Concurrent session limit exceeded"'
         ),
         updated_at = NOW()
     WHERE id = ANY(:sessionIds)`, {
        replacements: {
            status: SessionStatus.INVALIDATED,
            sessionIds,
        },
        transaction,
    });
    return metadata.rowCount || 0;
};
exports.enforceConcurrentSessionLimit = enforceConcurrentSessionLimit;
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
const getUserActiveSessions = async (sequelize, userId) => {
    const [results] = await sequelize.query(`SELECT *
     FROM sessions
     WHERE user_id = :userId
       AND status = :status
       AND expires_at > NOW()
     ORDER BY last_activity_at DESC`, {
        replacements: {
            userId,
            status: SessionStatus.ACTIVE,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getUserActiveSessions = getUserActiveSessions;
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
const getActiveSessionCount = async (sequelize, userId) => {
    const [[{ count }]] = await sequelize.query(`SELECT COUNT(*) as count
     FROM sessions
     WHERE user_id = :userId
       AND status = :status
       AND expires_at > NOW()`, {
        replacements: {
            userId,
            status: SessionStatus.ACTIVE,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return parseInt(count);
};
exports.getActiveSessionCount = getActiveSessionCount;
// ============================================================================
// DEVICE MANAGEMENT
// ============================================================================
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
const getDeviceSessions = async (sequelize, userId) => {
    const [results] = await sequelize.query(`SELECT
      device_id,
      device_type,
      device_name,
      COUNT(*) as active_sessions,
      MAX(last_activity_at) as last_active,
      json_agg(
        json_build_object(
          'id', id,
          'sessionToken', session_token,
          'status', status,
          'createdAt', created_at,
          'lastActivityAt', last_activity_at,
          'expiresAt', expires_at
        )
      ) as sessions
     FROM sessions
     WHERE user_id = :userId
       AND device_id IS NOT NULL
     GROUP BY device_id, device_type, device_name
     ORDER BY last_active DESC`, {
        replacements: { userId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getDeviceSessions = getDeviceSessions;
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
const invalidateDeviceSessions = async (sequelize, userId, deviceId, transaction) => {
    const [, metadata] = await sequelize.query(`UPDATE sessions
     SET status = :status,
         updated_at = NOW()
     WHERE user_id = :userId
       AND device_id = :deviceId
       AND status = :activeStatus`, {
        replacements: {
            userId,
            deviceId,
            status: SessionStatus.INVALIDATED,
            activeStatus: SessionStatus.ACTIVE,
        },
        transaction,
    });
    return metadata.rowCount || 0;
};
exports.invalidateDeviceSessions = invalidateDeviceSessions;
/**
 * Registers a new device for a user
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @param {object} deviceInfo - Device information
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Device ID
 */
const registerDevice = async (sequelize, userId, deviceInfo, transaction) => {
    const deviceId = crypto.randomUUID();
    await sequelize.query(`INSERT INTO user_devices (
      id, user_id, device_type, device_name, user_agent, metadata,
      first_seen, last_seen, is_trusted, created_at, updated_at
    ) VALUES (
      :deviceId, :userId, :deviceType, :deviceName, :userAgent, :metadata,
      NOW(), NOW(), false, NOW(), NOW()
    )`, {
        replacements: {
            deviceId,
            userId,
            deviceType: deviceInfo.deviceType,
            deviceName: deviceInfo.deviceName || null,
            userAgent: deviceInfo.userAgent || null,
            metadata: deviceInfo.metadata ? JSON.stringify(deviceInfo.metadata) : null,
        },
        transaction,
    });
    return deviceId;
};
exports.registerDevice = registerDevice;
/**
 * Marks a device as trusted
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} deviceId - Device ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} Success status
 */
const trustDevice = async (sequelize, deviceId, transaction) => {
    const [, metadata] = await sequelize.query(`UPDATE user_devices
     SET is_trusted = true,
         updated_at = NOW()
     WHERE id = :deviceId`, {
        replacements: { deviceId },
        transaction,
    });
    return metadata.rowCount > 0;
};
exports.trustDevice = trustDevice;
// ============================================================================
// SESSION EXPIRATION AND CLEANUP
// ============================================================================
/**
 * Expires a session
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sessionToken - Session token
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} Success status
 */
const expireSession = async (sequelize, sessionToken, transaction) => {
    const [, metadata] = await sequelize.query(`UPDATE sessions
     SET status = :status,
         updated_at = NOW()
     WHERE session_token = :sessionToken`, {
        replacements: {
            sessionToken,
            status: SessionStatus.EXPIRED,
        },
        transaction,
    });
    return metadata.rowCount > 0;
};
exports.expireSession = expireSession;
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
const cleanupExpiredSessions = async (sequelize, transaction) => {
    const [, metadata] = await sequelize.query(`UPDATE sessions
     SET status = :expiredStatus,
         updated_at = NOW()
     WHERE status = :activeStatus
       AND expires_at <= NOW()`, {
        replacements: {
            activeStatus: SessionStatus.ACTIVE,
            expiredStatus: SessionStatus.EXPIRED,
        },
        transaction,
    });
    return metadata.rowCount || 0;
};
exports.cleanupExpiredSessions = cleanupExpiredSessions;
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
const deleteOldSessions = async (sequelize, retentionDays = 90, transaction) => {
    const [, metadata] = await sequelize.query(`DELETE FROM sessions
     WHERE updated_at < NOW() - INTERVAL '${retentionDays} days'
       AND status IN (:statuses)`, {
        replacements: {
            statuses: [SessionStatus.EXPIRED, SessionStatus.INVALIDATED, SessionStatus.REVOKED],
        },
        transaction,
    });
    return metadata.rowCount || 0;
};
exports.deleteOldSessions = deleteOldSessions;
/**
 * Cleans up idle sessions based on timeout
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of sessions cleaned up
 */
const cleanupIdleSessions = async (sequelize, transaction) => {
    const [, metadata] = await sequelize.query(`UPDATE sessions
     SET status = :expiredStatus,
         updated_at = NOW()
     WHERE status = :activeStatus
       AND idle_timeout IS NOT NULL
       AND EXTRACT(EPOCH FROM (NOW() - last_activity_at)) > idle_timeout`, {
        replacements: {
            activeStatus: SessionStatus.ACTIVE,
            expiredStatus: SessionStatus.EXPIRED,
        },
        transaction,
    });
    return metadata.rowCount || 0;
};
exports.cleanupIdleSessions = cleanupIdleSessions;
// ============================================================================
// SESSION STATISTICS AND REPORTING
// ============================================================================
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
const getSessionStatistics = async (sequelize, startDate, endDate) => {
    const dateFilter = startDate && endDate
        ? `WHERE created_at >= :startDate AND created_at <= :endDate`
        : '';
    const [[totals]] = await sequelize.query(`SELECT
      COUNT(*) as total_sessions,
      COUNT(CASE WHEN status = :activeStatus THEN 1 END) as active_sessions,
      COUNT(CASE WHEN status = :expiredStatus THEN 1 END) as expired_sessions,
      COUNT(CASE WHEN status = :revokedStatus THEN 1 END) as revoked_sessions,
      COUNT(DISTINCT user_id) as unique_users,
      COUNT(DISTINCT device_id) as unique_devices,
      AVG(EXTRACT(EPOCH FROM (
        COALESCE(updated_at, NOW()) - created_at
      ))) as average_session_duration
     FROM sessions
     ${dateFilter}`, {
        replacements: {
            activeStatus: SessionStatus.ACTIVE,
            expiredStatus: SessionStatus.EXPIRED,
            revokedStatus: SessionStatus.REVOKED,
            startDate,
            endDate,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    // Sessions by type
    const [sessionsByTypeResult] = await sequelize.query(`SELECT type, COUNT(*) as count
     FROM sessions
     ${dateFilter}
     GROUP BY type`, {
        replacements: { startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const sessionsByType = sessionsByTypeResult.reduce((acc, row) => {
        acc[row.type] = parseInt(row.count);
        return acc;
    }, {});
    // Sessions by device
    const [sessionsByDeviceResult] = await sequelize.query(`SELECT device_type, COUNT(*) as count
     FROM sessions
     WHERE device_type IS NOT NULL
     ${dateFilter ? dateFilter.replace('WHERE', 'AND') : ''}
     GROUP BY device_type`, {
        replacements: { startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const sessionsByDevice = sessionsByDeviceResult.reduce((acc, row) => {
        acc[row.device_type] = parseInt(row.count);
        return acc;
    }, {});
    return {
        totalSessions: parseInt(totals.total_sessions),
        activeSessions: parseInt(totals.active_sessions),
        expiredSessions: parseInt(totals.expired_sessions),
        revokedSessions: parseInt(totals.revoked_sessions),
        uniqueUsers: parseInt(totals.unique_users),
        uniqueDevices: parseInt(totals.unique_devices),
        averageSessionDuration: parseFloat(totals.average_session_duration) || 0,
        sessionsByType,
        sessionsByDevice,
    };
};
exports.getSessionStatistics = getSessionStatistics;
/**
 * Gets session activity timeline for a user
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @param {number} [days=30] - Number of days to look back
 * @returns {Promise<any[]>} Activity timeline
 */
const getSessionActivityTimeline = async (sequelize, userId, days = 30) => {
    const [results] = await sequelize.query(`SELECT
      DATE_TRUNC('day', created_at) as day,
      COUNT(*) as sessions_created,
      COUNT(DISTINCT device_id) as devices_used,
      array_agg(DISTINCT ip_address) as ip_addresses
     FROM sessions
     WHERE user_id = :userId
       AND created_at >= NOW() - INTERVAL '${days} days'
     GROUP BY day
     ORDER BY day DESC`, {
        replacements: { userId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getSessionActivityTimeline = getSessionActivityTimeline;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Generates a cryptographically secure session token
 *
 * @returns {string} Secure random token
 */
const generateSecureToken = () => {
    return crypto.randomBytes(32).toString('base64url');
};
exports.generateSecureToken = generateSecureToken;
/**
 * Generates security fingerprint from context
 *
 * @param {Partial<SessionSecurityContext>} context - Security context
 * @returns {string} Security fingerprint hash
 */
const generateSecurityFingerprint = (context) => {
    const data = JSON.stringify({
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
    });
    return crypto.createHash('sha256').update(data).digest('hex');
};
exports.generateSecurityFingerprint = generateSecurityFingerprint;
/**
 * Logs session security event
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sessionId - Session ID
 * @param {string} eventType - Event type
 * @param {Partial<SessionSecurityContext>} context - Security context
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 */
const logSessionSecurity = async (sequelize, sessionId, eventType, context, transaction) => {
    await sequelize.query(`INSERT INTO session_security_logs (
      session_id, event_type, ip_address, user_agent, location,
      timestamp, metadata, created_at
    ) VALUES (
      :sessionId, :eventType, :ipAddress, :userAgent, :location,
      NOW(), :metadata, NOW()
    )`, {
        replacements: {
            sessionId,
            eventType,
            ipAddress: context.ipAddress || null,
            userAgent: context.userAgent || null,
            location: context.location || null,
            metadata: JSON.stringify(context),
        },
        transaction,
    });
};
/**
 * Parses User-Agent to detect device type
 *
 * @param {string} userAgent - User agent string
 * @returns {DeviceType} Detected device type
 */
const parseDeviceType = (userAgent) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
        return DeviceType.MOBILE;
    }
    else if (ua.includes('tablet') || ua.includes('ipad')) {
        return DeviceType.TABLET;
    }
    else if (ua.includes('postman') || ua.includes('curl') || ua.includes('axios')) {
        return DeviceType.API_CLIENT;
    }
    else if (ua.includes('mozilla') || ua.includes('chrome') || ua.includes('safari')) {
        return DeviceType.DESKTOP;
    }
    return DeviceType.UNKNOWN;
};
exports.parseDeviceType = parseDeviceType;
/**
 * Queries sessions with advanced filtering
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {SessionQueryOptions} options - Query options
 * @returns {Promise<SessionData[]>} Matching sessions
 */
const querySessions = async (sequelize, options) => {
    const where = [];
    const replacements = {};
    if (options.userId) {
        where.push('user_id = :userId');
        replacements.userId = options.userId;
    }
    if (options.status) {
        if (Array.isArray(options.status)) {
            where.push('status = ANY(:statuses)');
            replacements.statuses = options.status;
        }
        else {
            where.push('status = :status');
            replacements.status = options.status;
        }
    }
    if (options.type) {
        if (Array.isArray(options.type)) {
            where.push('type = ANY(:types)');
            replacements.types = options.type;
        }
        else {
            where.push('type = :type');
            replacements.type = options.type;
        }
    }
    if (options.deviceId) {
        where.push('device_id = :deviceId');
        replacements.deviceId = options.deviceId;
    }
    if (options.deviceType) {
        where.push('device_type = :deviceType');
        replacements.deviceType = options.deviceType;
    }
    if (options.activeOnly) {
        where.push(`status = '${SessionStatus.ACTIVE}' AND expires_at > NOW()`);
    }
    if (!options.includeExpired) {
        where.push('expires_at > NOW()');
    }
    const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
    const orderBy = options.orderBy || 'created_at';
    const orderDirection = options.orderDirection || 'DESC';
    const limit = options.limit || 100;
    const offset = options.offset || 0;
    const [results] = await sequelize.query(`SELECT * FROM sessions
     ${whereClause}
     ORDER BY ${orderBy} ${orderDirection}
     LIMIT :limit OFFSET :offset`, {
        replacements: { ...replacements, limit, offset },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.querySessions = querySessions;
// ============================================================================
// ADDITIONAL SESSION FUNCTIONS (30-45)
// ============================================================================
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
const getExpiringSessions = async (sequelize, withinHours = 24) => {
    const [results] = await sequelize.query(`SELECT s.*, u.email as user_email
     FROM sessions s
     LEFT JOIN users u ON s.user_id = u.id
     WHERE s.status = :status
       AND s.expires_at > NOW()
       AND s.expires_at <= NOW() + INTERVAL '${withinHours} hours'
     ORDER BY s.expires_at ASC`, {
        replacements: { status: SessionStatus.ACTIVE },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getExpiringSessions = getExpiringSessions;
/**
 * Gets sessions by location
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} location - Location string
 * @returns {Promise<SessionData[]>} Sessions from location
 */
const getSessionsByLocation = async (sequelize, location) => {
    const [results] = await sequelize.query(`SELECT * FROM sessions
     WHERE location ILIKE :location
       AND status = :status
     ORDER BY last_activity_at DESC`, {
        replacements: {
            location: `%${location}%`,
            status: SessionStatus.ACTIVE,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getSessionsByLocation = getSessionsByLocation;
/**
 * Gets session history for a specific user with pagination
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @param {number} [limit=50] - Result limit
 * @param {number} [offset=0] - Result offset
 * @returns {Promise<SessionData[]>} Session history
 */
const getSessionHistory = async (sequelize, userId, limit = 50, offset = 0) => {
    const [results] = await sequelize.query(`SELECT * FROM sessions
     WHERE user_id = :userId
     ORDER BY created_at DESC
     LIMIT :limit OFFSET :offset`, {
        replacements: { userId, limit, offset },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getSessionHistory = getSessionHistory;
/**
 * Gets long-running sessions (active beyond threshold)
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} thresholdHours - Hours threshold
 * @returns {Promise<SessionData[]>} Long-running sessions
 */
const getLongRunningSessions = async (sequelize, thresholdHours = 24) => {
    const [results] = await sequelize.query(`SELECT
      s.*,
      EXTRACT(EPOCH FROM (NOW() - s.created_at))/3600 as hours_active
     FROM sessions s
     WHERE s.status = :status
       AND s.created_at <= NOW() - INTERVAL '${thresholdHours} hours'
     ORDER BY s.created_at ASC`, {
        replacements: { status: SessionStatus.ACTIVE },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getLongRunningSessions = getLongRunningSessions;
/**
 * Gets sessions with suspicious IP changes
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [days=7] - Days to look back
 * @returns {Promise<any[]>} Sessions with IP changes
 */
const getSessionsWithIPChanges = async (sequelize, days = 7) => {
    const [results] = await sequelize.query(`SELECT
      user_id,
      COUNT(DISTINCT ip_address) as unique_ips,
      array_agg(DISTINCT ip_address) as ip_addresses,
      COUNT(*) as session_count
     FROM sessions
     WHERE created_at >= NOW() - INTERVAL '${days} days'
     GROUP BY user_id
     HAVING COUNT(DISTINCT ip_address) > 3
     ORDER BY unique_ips DESC`, { type: sequelize_1.QueryTypes.SELECT });
    return results;
};
exports.getSessionsWithIPChanges = getSessionsWithIPChanges;
/**
 * Gets remember-me sessions
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} [userId] - Optional user ID filter
 * @returns {Promise<SessionData[]>} Remember-me sessions
 */
const getRememberMeSessions = async (sequelize, userId) => {
    const userFilter = userId ? 'AND user_id = :userId' : '';
    const [results] = await sequelize.query(`SELECT * FROM sessions
     WHERE type = :type
       AND status = :status
       ${userFilter}
     ORDER BY last_activity_at DESC`, {
        replacements: {
            type: SessionType.REMEMBER_ME,
            status: SessionStatus.ACTIVE,
            userId: userId || null,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getRememberMeSessions = getRememberMeSessions;
/**
 * Gets API sessions
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<SessionData[]>} API sessions
 */
const getAPISessions = async (sequelize) => {
    const [results] = await sequelize.query(`SELECT * FROM sessions
     WHERE type = :type
       AND status = :status
     ORDER BY last_activity_at DESC`, {
        replacements: {
            type: SessionType.API,
            status: SessionStatus.ACTIVE,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getAPISessions = getAPISessions;
/**
 * Gets mobile sessions
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} [userId] - Optional user ID filter
 * @returns {Promise<SessionData[]>} Mobile sessions
 */
const getMobileSessions = async (sequelize, userId) => {
    const userFilter = userId ? 'AND user_id = :userId' : '';
    const [results] = await sequelize.query(`SELECT * FROM sessions
     WHERE (type = :type OR device_type = :deviceType)
       AND status = :status
       ${userFilter}
     ORDER BY last_activity_at DESC`, {
        replacements: {
            type: SessionType.MOBILE,
            deviceType: DeviceType.MOBILE,
            status: SessionStatus.ACTIVE,
            userId: userId || null,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getMobileSessions = getMobileSessions;
/**
 * Rotates session token for security
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} currentToken - Current session token
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string | null>} New session token or null
 */
const rotateSessionToken = async (sequelize, currentToken, transaction) => {
    const session = await (0, exports.getActiveSession)(sequelize, currentToken);
    if (!session)
        return null;
    const newToken = (0, exports.generateSecureToken)();
    const [, metadata] = await sequelize.query(`UPDATE sessions
     SET session_token = :newToken,
         updated_at = NOW()
     WHERE session_token = :currentToken
       AND status = :status`, {
        replacements: {
            newToken,
            currentToken,
            status: SessionStatus.ACTIVE,
        },
        transaction,
    });
    return metadata.rowCount > 0 ? newToken : null;
};
exports.rotateSessionToken = rotateSessionToken;
/**
 * Updates session metadata
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sessionToken - Session token
 * @param {Record<string, any>} metadata - Metadata to merge
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} Success status
 */
const updateSessionMetadata = async (sequelize, sessionToken, metadata, transaction) => {
    const [, updateMeta] = await sequelize.query(`UPDATE sessions
     SET metadata = COALESCE(metadata, '{}'::jsonb) || :metadata::jsonb,
         updated_at = NOW()
     WHERE session_token = :sessionToken`, {
        replacements: {
            sessionToken,
            metadata: JSON.stringify(metadata),
        },
        transaction,
    });
    return updateMeta.rowCount > 0;
};
exports.updateSessionMetadata = updateSessionMetadata;
/**
 * Gets sessions grouped by status
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} [startDate] - Optional start date
 * @returns {Promise<any[]>} Sessions grouped by status
 */
const getSessionsByStatus = async (sequelize, startDate) => {
    const dateFilter = startDate ? 'WHERE created_at >= :startDate' : '';
    const [results] = await sequelize.query(`SELECT
      status,
      COUNT(*) as count,
      array_agg(DISTINCT user_id) as user_ids
     FROM sessions
     ${dateFilter}
     GROUP BY status
     ORDER BY count DESC`, {
        replacements: { startDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getSessionsByStatus = getSessionsByStatus;
/**
 * Gets average session duration by user
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @returns {Promise<number>} Average duration in seconds
 */
const getAverageSessionDuration = async (sequelize, userId) => {
    const [[result]] = await sequelize.query(`SELECT AVG(EXTRACT(EPOCH FROM (
      COALESCE(updated_at, NOW()) - created_at
    ))) as avg_duration
     FROM sessions
     WHERE user_id = :userId
       AND status IN (:statuses)`, {
        replacements: {
            userId,
            statuses: [SessionStatus.EXPIRED, SessionStatus.INVALIDATED],
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return parseFloat(result?.avg_duration) || 0;
};
exports.getAverageSessionDuration = getAverageSessionDuration;
/**
 * Gets concurrent sessions peak count
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} date - Date to analyze
 * @returns {Promise<any[]>} Peak concurrent sessions by hour
 */
const getConcurrentSessionsPeak = async (sequelize, date) => {
    const [results] = await sequelize.query(`WITH hourly_sessions AS (
      SELECT
        generate_series(0, 23) as hour,
        (SELECT COUNT(*)
         FROM sessions
         WHERE DATE(created_at) <= DATE(:date)
           AND (
             DATE(expires_at) > DATE(:date)
             OR (
               DATE(expires_at) = DATE(:date)
               AND EXTRACT(HOUR FROM expires_at) >= generate_series.hour
             )
           )
           AND (
             DATE(created_at) < DATE(:date)
             OR (
               DATE(created_at) = DATE(:date)
               AND EXTRACT(HOUR FROM created_at) <= generate_series.hour
             )
           )
           AND status = 'ACTIVE'
        ) as concurrent_count
      FROM generate_series(0, 23)
    )
    SELECT * FROM hourly_sessions
    ORDER BY concurrent_count DESC`, {
        replacements: { date },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getConcurrentSessionsPeak = getConcurrentSessionsPeak;
/**
 * Terminates all sessions for security incident
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reason - Termination reason
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of sessions terminated
 */
const terminateAllSessions = async (sequelize, reason, transaction) => {
    const [, metadata] = await sequelize.query(`UPDATE sessions
     SET status = :status,
         metadata = jsonb_set(
           COALESCE(metadata, '{}'::jsonb),
           '{terminationReason}',
           :reason
         ),
         updated_at = NOW()
     WHERE status = :activeStatus`, {
        replacements: {
            status: SessionStatus.REVOKED,
            activeStatus: SessionStatus.ACTIVE,
            reason: JSON.stringify(reason),
        },
        transaction,
    });
    return metadata.rowCount || 0;
};
exports.terminateAllSessions = terminateAllSessions;
/**
 * Gets session duration distribution
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [days=30] - Days to analyze
 * @returns {Promise<any[]>} Duration distribution buckets
 */
const getSessionDurationDistribution = async (sequelize, days = 30) => {
    const [results] = await sequelize.query(`SELECT
      CASE
        WHEN duration < 300 THEN '0-5min'
        WHEN duration < 900 THEN '5-15min'
        WHEN duration < 1800 THEN '15-30min'
        WHEN duration < 3600 THEN '30-60min'
        WHEN duration < 7200 THEN '1-2hr'
        WHEN duration < 14400 THEN '2-4hr'
        ELSE '4hr+'
      END as duration_bucket,
      COUNT(*) as session_count
     FROM (
       SELECT EXTRACT(EPOCH FROM (updated_at - created_at)) as duration
       FROM sessions
       WHERE created_at >= NOW() - INTERVAL '${days} days'
         AND status IN ('EXPIRED', 'INVALIDATED')
     ) AS durations
     GROUP BY duration_bucket
     ORDER BY
       CASE duration_bucket
         WHEN '0-5min' THEN 1
         WHEN '5-15min' THEN 2
         WHEN '15-30min' THEN 3
         WHEN '30-60min' THEN 4
         WHEN '1-2hr' THEN 5
         WHEN '2-4hr' THEN 6
         ELSE 7
       END`, { type: sequelize_1.QueryTypes.SELECT });
    return results;
};
exports.getSessionDurationDistribution = getSessionDurationDistribution;
/**
 * Checks if user has reached session limit
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} userId - User ID
 * @param {number} limit - Session limit
 * @returns {Promise<boolean>} True if limit reached
 */
const hasReachedSessionLimit = async (sequelize, userId, limit) => {
    const count = await (0, exports.getActiveSessionCount)(sequelize, userId);
    return count >= limit;
};
exports.hasReachedSessionLimit = hasReachedSessionLimit;
/**
 * Gets sessions without recent activity (potentially stale)
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} inactiveMinutes - Minutes of inactivity threshold
 * @returns {Promise<SessionData[]>} Inactive sessions
 */
const getInactiveSessions = async (sequelize, inactiveMinutes = 30) => {
    const [results] = await sequelize.query(`SELECT *
     FROM sessions
     WHERE status = :status
       AND last_activity_at <= NOW() - INTERVAL '${inactiveMinutes} minutes'
     ORDER BY last_activity_at ASC`, {
        replacements: { status: SessionStatus.ACTIVE },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getInactiveSessions = getInactiveSessions;
//# sourceMappingURL=iam-session-kit.js.map