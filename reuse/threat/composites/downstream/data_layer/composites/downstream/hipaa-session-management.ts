/**
 * HIPAA-Compliant Session Management Service
 *
 * Implements HIPAA Technical Safeguard: Automatic Logoff (§164.312(a)(2)(iii))
 *
 * Features:
 * - Redis-backed session storage
 * - Automatic idle timeout (15 minutes default)
 * - Activity-based session refresh
 * - Concurrent session limits
 * - Session invalidation on password change
 * - Comprehensive audit logging
 * - HIPAA-compliant session lifecycle
 *
 * @module hipaa-session-management
 * @hipaa-requirement §164.312(a)(2)(iii) - Automatic Logoff
 */

import {
  Injectable,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import * as crypto from 'crypto';

// ============================================================================
// Type Definitions
// ============================================================================

export interface SessionConfig {
  /** Session TTL in seconds (default: 15 minutes) */
  sessionTTL: number;
  /** Idle timeout in seconds (default: 15 minutes) */
  idleTimeout: number;
  /** Warning before logout in seconds (default: 2 minutes) */
  warningBeforeLogout: number;
  /** Maximum concurrent sessions per user (default: 3) */
  maxConcurrentSessions: number;
  /** Enable sliding session expiration */
  slidingExpiration: boolean;
}

export interface SessionMetadata {
  userId: string;
  sessionId: string;
  email: string;
  roles: string[];
  permissions: string[];
  tenantId?: string;
  ipAddress: string;
  userAgent: string;
  deviceId?: string;
  createdAt: Date;
  lastActivity: Date;
  expiresAt: Date;
  active: boolean;
  mfaVerified: boolean;
}

export interface SessionValidationResult {
  valid: boolean;
  session?: SessionMetadata;
  reason?: string;
  warningSeconds?: number;
}

export interface SessionActivity {
  timestamp: Date;
  action: string;
  resource?: string;
  ipAddress: string;
}

// ============================================================================
// Session Management Service
// ============================================================================

@Injectable()
export class HIPAASessionManagementService {
  private readonly logger = new Logger(HIPAASessionManagementService.name);

  private readonly config: SessionConfig = {
    sessionTTL: parseInt(process.env.SESSION_TTL || '900', 10), // 15 minutes
    idleTimeout: parseInt(process.env.IDLE_TIMEOUT || '900', 10), // 15 minutes
    warningBeforeLogout: parseInt(process.env.WARNING_BEFORE_LOGOUT || '120', 10), // 2 minutes
    maxConcurrentSessions: parseInt(process.env.MAX_CONCURRENT_SESSIONS || '3', 10),
    slidingExpiration: process.env.SLIDING_SESSION === 'true',
  };

  constructor(
    @InjectRedis() private readonly redis: Redis,
  ) {
    this.logger.log('HIPAA Session Management initialized with config:', this.config);
  }

  /**
   * Create a new session for a user
   * HIPAA: Track user sessions for audit purposes
   */
  async createSession(params: {
    userId: string;
    email: string;
    roles: string[];
    permissions: string[];
    tenantId?: string;
    ipAddress: string;
    userAgent: string;
    deviceId?: string;
    mfaVerified: boolean;
  }): Promise<SessionMetadata> {
    const sessionId = crypto.randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.config.sessionTTL * 1000);

    // Check concurrent session limit
    await this.enforceConcurrentSessionLimit(params.userId);

    const session: SessionMetadata = {
      sessionId,
      userId: params.userId,
      email: params.email,
      roles: params.roles,
      permissions: params.permissions,
      tenantId: params.tenantId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      deviceId: params.deviceId,
      createdAt: now,
      lastActivity: now,
      expiresAt,
      active: true,
      mfaVerified: params.mfaVerified,
    };

    // Store session in Redis
    const sessionKey = `session:${sessionId}`;
    await this.redis.setex(
      sessionKey,
      this.config.sessionTTL,
      JSON.stringify(session),
    );

    // Track active sessions for user
    await this.redis.sadd(`user:${params.userId}:sessions`, sessionId);
    await this.redis.expire(`user:${params.userId}:sessions`, this.config.sessionTTL);

    // Log session creation for HIPAA audit
    await this.logSessionEvent({
      userId: params.userId,
      sessionId,
      action: 'SESSION_CREATED',
      ipAddress: params.ipAddress,
      metadata: {
        deviceId: params.deviceId,
        mfaVerified: params.mfaVerified,
      },
    });

    this.logger.log(`Session created for user ${params.userId}: ${sessionId}`);
    return session;
  }

  /**
   * Validate session and check for idle timeout
   * HIPAA: Automatic logoff after idle period
   */
  async validateSession(sessionId: string): Promise<SessionValidationResult> {
    const sessionKey = `session:${sessionId}`;
    const sessionData = await this.redis.get(sessionKey);

    if (!sessionData) {
      return {
        valid: false,
        reason: 'Session not found or expired',
      };
    }

    const session: SessionMetadata = JSON.parse(sessionData);

    // Check if session is active
    if (!session.active) {
      return {
        valid: false,
        reason: 'Session has been terminated',
      };
    }

    // Check idle timeout
    const now = new Date();
    const lastActivity = new Date(session.lastActivity);
    const idleSeconds = (now.getTime() - lastActivity.getTime()) / 1000;

    if (idleSeconds > this.config.idleTimeout) {
      // Session idle timeout - terminate session
      await this.terminateSession(sessionId, 'Idle timeout exceeded');

      await this.logSessionEvent({
        userId: session.userId,
        sessionId,
        action: 'SESSION_IDLE_TIMEOUT',
        ipAddress: session.ipAddress,
        metadata: { idleSeconds },
      });

      return {
        valid: false,
        reason: 'Session terminated due to inactivity',
      };
    }

    // Check if approaching timeout (for warning)
    const remainingSeconds = this.config.idleTimeout - idleSeconds;
    const warningThreshold = this.config.warningBeforeLogout;

    if (remainingSeconds <= warningThreshold && remainingSeconds > 0) {
      return {
        valid: true,
        session,
        warningSeconds: Math.floor(remainingSeconds),
      };
    }

    return {
      valid: true,
      session,
    };
  }

  /**
   * Refresh session activity
   * HIPAA: Update last activity timestamp
   */
  async refreshSession(sessionId: string, activity?: SessionActivity): Promise<void> {
    const sessionKey = `session:${sessionId}`;
    const sessionData = await this.redis.get(sessionKey);

    if (!sessionData) {
      throw new UnauthorizedException('Session not found');
    }

    const session: SessionMetadata = JSON.parse(sessionData);

    // Update last activity
    session.lastActivity = new Date();

    // Extend TTL if sliding expiration enabled
    const ttl = this.config.slidingExpiration
      ? this.config.sessionTTL
      : await this.redis.ttl(sessionKey);

    await this.redis.setex(sessionKey, ttl, JSON.stringify(session));

    // Track activity
    if (activity) {
      const activityKey = `session:${sessionId}:activity`;
      await this.redis.lpush(activityKey, JSON.stringify(activity));
      await this.redis.ltrim(activityKey, 0, 99); // Keep last 100 activities
      await this.redis.expire(activityKey, this.config.sessionTTL);
    }

    this.logger.debug(`Session refreshed: ${sessionId}`);
  }

  /**
   * Terminate session (logout)
   * HIPAA: Secure session termination with audit
   */
  async terminateSession(sessionId: string, reason?: string): Promise<void> {
    const sessionKey = `session:${sessionId}`;
    const sessionData = await this.redis.get(sessionKey);

    if (!sessionData) {
      this.logger.warn(`Attempted to terminate non-existent session: ${sessionId}`);
      return;
    }

    const session: SessionMetadata = JSON.parse(sessionData);

    // Mark session as inactive
    session.active = false;
    await this.redis.setex(sessionKey, 3600, JSON.stringify(session)); // Keep for audit

    // Remove from active sessions
    await this.redis.srem(`user:${session.userId}:sessions`, sessionId);

    // Log session termination
    await this.logSessionEvent({
      userId: session.userId,
      sessionId,
      action: 'SESSION_TERMINATED',
      ipAddress: session.ipAddress,
      metadata: { reason: reason || 'User logout' },
    });

    this.logger.log(`Session terminated: ${sessionId} - ${reason || 'User logout'}`);
  }

  /**
   * Terminate all sessions for a user
   * HIPAA: Required on password change, security breach, or account lockout
   */
  async terminateAllUserSessions(
    userId: string,
    reason: string,
  ): Promise<number> {
    const sessionsKey = `user:${userId}:sessions`;
    const sessionIds = await this.redis.smembers(sessionsKey);

    let terminated = 0;
    for (const sessionId of sessionIds) {
      await this.terminateSession(sessionId, reason);
      terminated++;
    }

    // Clear user sessions set
    await this.redis.del(sessionsKey);

    this.logger.warn(`Terminated ${terminated} sessions for user ${userId}: ${reason}`);
    return terminated;
  }

  /**
   * Get active sessions for a user
   * HIPAA: Required for monitoring concurrent sessions
   */
  async getUserSessions(userId: string): Promise<SessionMetadata[]> {
    const sessionsKey = `user:${userId}:sessions`;
    const sessionIds = await this.redis.smembers(sessionsKey);

    const sessions: SessionMetadata[] = [];
    for (const sessionId of sessionIds) {
      const sessionData = await this.redis.get(`session:${sessionId}`);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (session.active) {
          sessions.push(session);
        }
      }
    }

    return sessions;
  }

  /**
   * Enforce concurrent session limit
   * HIPAA: Prevent session hijacking and abuse
   */
  private async enforceConcurrentSessionLimit(userId: string): Promise<void> {
    const sessions = await this.getUserSessions(userId);

    if (sessions.length >= this.config.maxConcurrentSessions) {
      // Terminate oldest session
      const oldestSession = sessions.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )[0];

      await this.terminateSession(
        oldestSession.sessionId,
        'Concurrent session limit exceeded',
      );

      this.logger.warn(
        `Terminated oldest session for user ${userId} due to concurrent session limit`,
      );
    }
  }

  /**
   * Get session activity history
   * HIPAA: Track user actions during session
   */
  async getSessionActivity(sessionId: string): Promise<SessionActivity[]> {
    const activityKey = `session:${sessionId}:activity`;
    const activities = await this.redis.lrange(activityKey, 0, -1);

    return activities.map(a => JSON.parse(a));
  }

  /**
   * Check if session is approaching timeout
   * HIPAA: Warn user before automatic logoff
   */
  async checkSessionTimeout(sessionId: string): Promise<{
    approaching: boolean;
    secondsRemaining: number;
  }> {
    const validation = await this.validateSession(sessionId);

    if (!validation.valid) {
      return { approaching: false, secondsRemaining: 0 };
    }

    if (validation.warningSeconds !== undefined) {
      return {
        approaching: true,
        secondsRemaining: validation.warningSeconds,
      };
    }

    return { approaching: false, secondsRemaining: this.config.idleTimeout };
  }

  /**
   * Extend session manually (keep-alive)
   * HIPAA: Allow users to stay logged in if actively working
   */
  async extendSession(sessionId: string): Promise<void> {
    await this.refreshSession(sessionId);

    const sessionData = await this.redis.get(`session:${sessionId}`);
    if (sessionData) {
      const session = JSON.parse(sessionData);
      await this.logSessionEvent({
        userId: session.userId,
        sessionId,
        action: 'SESSION_EXTENDED',
        ipAddress: session.ipAddress,
      });
    }
  }

  /**
   * Log session events for HIPAA audit
   */
  private async logSessionEvent(event: {
    userId: string;
    sessionId: string;
    action: string;
    ipAddress: string;
    metadata?: any;
  }): Promise<void> {
    const auditKey = `audit:session:${event.userId}`;
    const auditEntry = {
      timestamp: new Date().toISOString(),
      ...event,
    };

    await this.redis.lpush(auditKey, JSON.stringify(auditEntry));
    await this.redis.ltrim(auditKey, 0, 999); // Keep last 1000 events
    await this.redis.expire(auditKey, 86400 * 90); // 90 days retention
  }

  /**
   * Get session statistics for monitoring
   * HIPAA: Monitor session usage patterns
   */
  async getSessionStatistics(): Promise<{
    totalActiveSessions: number;
    sessionsPerUser: Record<string, number>;
    averageSessionDuration: number;
    expiringSoon: number;
  }> {
    const userKeys = await this.redis.keys('user:*:sessions');
    const stats = {
      totalActiveSessions: 0,
      sessionsPerUser: {} as Record<string, number>,
      averageSessionDuration: 0,
      expiringSoon: 0,
    };

    for (const key of userKeys) {
      const userId = key.split(':')[1];
      const sessionIds = await this.redis.smembers(key);
      stats.sessionsPerUser[userId] = sessionIds.length;
      stats.totalActiveSessions += sessionIds.length;

      // Check expiring sessions
      for (const sessionId of sessionIds) {
        const ttl = await this.redis.ttl(`session:${sessionId}`);
        if (ttl > 0 && ttl <= this.config.warningBeforeLogout) {
          stats.expiringSoon++;
        }
      }
    }

    return stats;
  }

  /**
   * Cleanup expired sessions (maintenance task)
   * HIPAA: Ensure no orphaned sessions remain
   */
  async cleanupExpiredSessions(): Promise<number> {
    let cleaned = 0;
    const userKeys = await this.redis.keys('user:*:sessions');

    for (const key of userKeys) {
      const sessionIds = await this.redis.smembers(key);

      for (const sessionId of sessionIds) {
        const sessionExists = await this.redis.exists(`session:${sessionId}`);
        if (!sessionExists) {
          await this.redis.srem(key, sessionId);
          cleaned++;
        }
      }
    }

    if (cleaned > 0) {
      this.logger.log(`Cleaned up ${cleaned} expired sessions`);
    }

    return cleaned;
  }
}

// ============================================================================
// Session Guard
// ============================================================================

/**
 * NestJS Guard for session validation
 * HIPAA: Enforce automatic logoff and session management
 */
@Injectable()
export class HIPAASessionGuard {
  private readonly logger = new Logger(HIPAASessionGuard.name);

  constructor(
    private readonly sessionService: HIPAASessionManagementService,
  ) {}

  async canActivate(context: any): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionId = request.headers['x-session-id'] || request.user?.sessionId;

    if (!sessionId) {
      throw new UnauthorizedException('No session ID provided');
    }

    const validation = await this.sessionService.validateSession(sessionId);

    if (!validation.valid) {
      throw new UnauthorizedException(validation.reason || 'Invalid session');
    }

    // Attach session to request
    request.session = validation.session;

    // Refresh session on activity
    await this.sessionService.refreshSession(sessionId, {
      timestamp: new Date(),
      action: `${request.method} ${request.path}`,
      ipAddress: request.ip,
    });

    // Warn if session expiring soon
    if (validation.warningSeconds !== undefined) {
      request.sessionWarning = {
        message: 'Session will expire soon due to inactivity',
        secondsRemaining: validation.warningSeconds,
      };
    }

    return true;
  }
}

// ============================================================================
// Composable Functions
// ============================================================================

/**
 * Create session for user
 */
export async function createHIPAASession(
  redis: Redis,
  params: {
    userId: string;
    email: string;
    roles: string[];
    permissions: string[];
    tenantId?: string;
    ipAddress: string;
    userAgent: string;
    deviceId?: string;
    mfaVerified: boolean;
  },
): Promise<SessionMetadata> {
  const service = new HIPAASessionManagementService(redis);
  return service.createSession(params);
}

/**
 * Validate session
 */
export async function validateHIPAASession(
  redis: Redis,
  sessionId: string,
): Promise<SessionValidationResult> {
  const service = new HIPAASessionManagementService(redis);
  return service.validateSession(sessionId);
}

/**
 * Terminate session
 */
export async function terminateHIPAASession(
  redis: Redis,
  sessionId: string,
  reason?: string,
): Promise<void> {
  const service = new HIPAASessionManagementService(redis);
  return service.terminateSession(sessionId, reason);
}

/**
 * Terminate all user sessions
 */
export async function terminateAllUserHIPAASessions(
  redis: Redis,
  userId: string,
  reason: string,
): Promise<number> {
  const service = new HIPAASessionManagementService(redis);
  return service.terminateAllUserSessions(userId, reason);
}

// ============================================================================
// Export
// ============================================================================

export default {
  HIPAASessionManagementService,
  HIPAASessionGuard,
  createHIPAASession,
  validateHIPAASession,
  terminateHIPAASession,
  terminateAllUserHIPAASessions,
};
