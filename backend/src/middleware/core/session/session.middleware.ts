/**
 * LOC: WC-MID-SESS-001
 * WC-MID-SESS-001 | Framework-Agnostic Session Management Middleware
 *
 * UPSTREAM (imports from):
 *   - utils/logger (logging utilities)
 *
 * DOWNSTREAM (imported by):
 *   - adapters/hapi/session.adapter.ts
 *   - adapters/express/session.adapter.ts
 */

/**
 * WC-MID-SESS-001 | Framework-Agnostic Session Management Middleware
 * Purpose: HIPAA-compliant session management, timeout handling, and security
 * Upstream: utils/logger, Redis client, authentication middleware
 * Downstream: All authenticated routes | Called by: Framework adapters
 * Related: authentication/jwt.middleware.ts, security/headers/security-headers.middleware.ts
 * Exports: SessionMiddleware class, session configs | Key Services: Session lifecycle, timeout management
 * Last Updated: 2025-10-21 | Dependencies: Framework-agnostic with Redis support
 * Critical Path: Session creation → Activity tracking → Timeout validation → Session cleanup
 * LLM Context: HIPAA compliance, healthcare session security, automatic logout
 */

/**
 * Framework-agnostic Session Management Middleware
 * Manages user sessions with HIPAA-compliant security and timeouts
 *
 * Security: OWASP Session Management, HIPAA access control requirements
 * Healthcare: Automatic session timeout, audit logging, PHI access tracking
 */

import { logger } from '../../../utils/logger';

/**
 * Session configuration interface
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

/**
 * In-memory session store implementation
 */
export class MemorySessionStore implements SessionStore {
  private sessions = new Map<string, SessionData>();
  private userSessions = new Map<string, Set<string>>();

  async create(session: SessionData): Promise<void> {
    this.sessions.set(session.sessionId, session);
    
    if (!this.userSessions.has(session.userId)) {
      this.userSessions.set(session.userId, new Set());
    }
    this.userSessions.get(session.userId)!.add(session.sessionId);
  }

  async get(sessionId: string): Promise<SessionData | null> {
    return this.sessions.get(sessionId) || null;
  }

  async update(sessionId: string, data: Partial<SessionData>): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      Object.assign(session, data);
    }
  }

  async delete(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      this.sessions.delete(sessionId);
      const userSessions = this.userSessions.get(session.userId);
      if (userSessions) {
        userSessions.delete(sessionId);
        if (userSessions.size === 0) {
          this.userSessions.delete(session.userId);
        }
      }
    }
  }

  async getUserSessions(userId: string): Promise<SessionData[]> {
    const sessionIds = this.userSessions.get(userId);
    if (!sessionIds) return [];
    
    const sessions: SessionData[] = [];
    for (const sessionId of sessionIds) {
      const session = this.sessions.get(sessionId);
      if (session) {
        sessions.push(session);
      }
    }
    return sessions;
  }

  async cleanup(): Promise<number> {
    const now = Date.now();
    let cleaned = 0;
    
    const entries = Array.from(this.sessions.entries());
    for (const [sessionId, session] of entries) {
      // Clean up inactive sessions older than 24 hours
      if (!session.isActive && (now - session.lastActivity) > 24 * 60 * 60 * 1000) {
        await this.delete(sessionId);
        cleaned++;
      }
    }
    
    return cleaned;
  }
}

/**
 * Redis-based session store implementation
 */
export class RedisSessionStore implements SessionStore {
  private redisClient: any;
  private keyPrefix: string;

  constructor(redisClient: any, keyPrefix = 'session:') {
    this.redisClient = redisClient;
    this.keyPrefix = keyPrefix;
  }

  private getSessionKey(sessionId: string): string {
    return `${this.keyPrefix}${sessionId}`;
  }

  private getUserSessionsKey(userId: string): string {
    return `${this.keyPrefix}user:${userId}`;
  }

  async create(session: SessionData): Promise<void> {
    try {
      const sessionKey = this.getSessionKey(session.sessionId);
      const userSessionsKey = this.getUserSessionsKey(session.userId);

      await this.redisClient.multi()
        .setEx(sessionKey, 24 * 60 * 60, JSON.stringify(session)) // 24 hour expiry
        .sAdd(userSessionsKey, session.sessionId)
        .expire(userSessionsKey, 24 * 60 * 60)
        .exec();
    } catch (error) {
      logger.error('Failed to create session in Redis', {
        error: error instanceof Error ? error.message : 'Unknown error',
        sessionId: session.sessionId,
        userId: session.userId
      });
      throw error;
    }
  }

  async get(sessionId: string): Promise<SessionData | null> {
    try {
      const sessionKey = this.getSessionKey(sessionId);
      const data = await this.redisClient.get(sessionKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Failed to get session from Redis', {
        error: error instanceof Error ? error.message : 'Unknown error',
        sessionId
      });
      return null;
    }
  }

  async update(sessionId: string, data: Partial<SessionData>): Promise<void> {
    try {
      const session = await this.get(sessionId);
      if (session) {
        const updatedSession = { ...session, ...data };
        const sessionKey = this.getSessionKey(sessionId);
        await this.redisClient.setEx(sessionKey, 24 * 60 * 60, JSON.stringify(updatedSession));
      }
    } catch (error) {
      logger.error('Failed to update session in Redis', {
        error: error instanceof Error ? error.message : 'Unknown error',
        sessionId
      });
      throw error;
    }
  }

  async delete(sessionId: string): Promise<void> {
    try {
      const session = await this.get(sessionId);
      if (session) {
        const sessionKey = this.getSessionKey(sessionId);
        const userSessionsKey = this.getUserSessionsKey(session.userId);
        
        await this.redisClient.multi()
          .del(sessionKey)
          .sRem(userSessionsKey, sessionId)
          .exec();
      }
    } catch (error) {
      logger.error('Failed to delete session from Redis', {
        error: error instanceof Error ? error.message : 'Unknown error',
        sessionId
      });
      throw error;
    }
  }

  async getUserSessions(userId: string): Promise<SessionData[]> {
    try {
      const userSessionsKey = this.getUserSessionsKey(userId);
      const sessionIds = await this.redisClient.sMembers(userSessionsKey);
      
      const sessions: SessionData[] = [];
      for (const sessionId of sessionIds) {
        const session = await this.get(sessionId);
        if (session) {
          sessions.push(session);
        }
      }
      return sessions;
    } catch (error) {
      logger.error('Failed to get user sessions from Redis', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId
      });
      return [];
    }
  }

  async cleanup(): Promise<number> {
    // Redis handles cleanup automatically with TTL
    return 0;
  }
}

/**
 * Session Management Middleware Class
 */
export class SessionMiddleware {
  private config: SessionConfig;
  private store: SessionStore;

  constructor(config: SessionConfig) {
    this.config = config;
    this.store = config.store || new MemorySessionStore();

    // Start cleanup timer for memory store
    if (this.store instanceof MemorySessionStore) {
      setInterval(() => {
        this.store.cleanup().then(cleaned => {
          if (cleaned > 0) {
            logger.debug('Cleaned up expired sessions', { count: cleaned });
          }
        });
      }, 60 * 60 * 1000); // Cleanup every hour
    }
  }

  /**
   * Create a new session
   */
  async createSession(
    userId: string,
    email: string,
    role: string,
    ipAddress: string,
    userAgent: string,
    permissions?: string[]
  ): Promise<SessionData> {
    // Check concurrent session limit
    const userSessions = await this.store.getUserSessions(userId);
    const activeSessions = userSessions.filter(s => s.isActive);
    
    if (activeSessions.length >= this.config.maxConcurrentSessions) {
      // Deactivate oldest session
      const oldestSession = activeSessions.sort((a, b) => a.lastActivity - b.lastActivity)[0];
      await this.store.update(oldestSession.sessionId, { isActive: false });
      
      if (this.config.auditSessions) {
        logger.info('Deactivated session due to concurrent limit', {
          userId,
          deactivatedSessionId: oldestSession.sessionId,
          newSessionCreated: true
        });
      }
    }

    // Generate session ID
    const sessionId = this.generateSessionId();
    const now = Date.now();

    const session: SessionData = {
      sessionId,
      userId,
      email,
      role,
      createdAt: now,
      lastActivity: now,
      ipAddress,
      userAgent,
      isActive: true,
      permissions
    };

    await this.store.create(session);

    if (this.config.auditSessions) {
      logger.info('Session created', {
        sessionId,
        userId,
        email,
        role,
        ipAddress,
        userAgent: userAgent.substring(0, 100) // Truncate for logging
      });
    }

    return session;
  }

  /**
   * Validate session and check timeout
   */
  async validateSession(sessionId: string): Promise<SessionResult> {
    try {
      const session = await this.store.get(sessionId);
      
      if (!session) {
        return {
          valid: false,
          error: {
            code: 'SESSION_NOT_FOUND',
            message: 'Session not found'
          }
        };
      }

      if (!session.isActive) {
        return {
          valid: false,
          error: {
            code: 'SESSION_INACTIVE',
            message: 'Session is no longer active'
          }
        };
      }

      const now = Date.now();
      const timeSinceActivity = now - session.lastActivity;

      // Check if session has expired
      if (timeSinceActivity > this.config.sessionTimeout) {
        await this.store.update(sessionId, { isActive: false });
        
        if (this.config.auditSessions) {
          logger.info('Session expired', {
            sessionId,
            userId: session.userId,
            timeSinceActivity,
            sessionTimeout: this.config.sessionTimeout
          });
        }

        return {
          valid: false,
          error: {
            code: 'SESSION_EXPIRED',
            message: 'Session has expired'
          }
        };
      }

      // Update last activity if tracking is enabled
      if (this.config.trackActivity) {
        await this.store.update(sessionId, { lastActivity: now });
      }

      // Check if warning should be shown
      const timeRemaining = this.config.sessionTimeout - timeSinceActivity;
      const warning = timeRemaining <= this.config.warningTime ? {
        message: 'Your session will expire soon',
        timeRemaining
      } : undefined;

      return {
        valid: true,
        session,
        warning
      };

    } catch (error) {
      logger.error('Session validation failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        sessionId
      });

      return {
        valid: false,
        error: {
          code: 'SESSION_VALIDATION_ERROR',
          message: 'Session validation failed'
        }
      };
    }
  }

  /**
   * End session
   */
  async endSession(sessionId: string): Promise<void> {
    try {
      const session = await this.store.get(sessionId);
      if (session) {
        await this.store.update(sessionId, { isActive: false });
        
        if (this.config.auditSessions) {
          logger.info('Session ended', {
            sessionId,
            userId: session.userId,
            duration: Date.now() - session.createdAt
          });
        }
      }
    } catch (error) {
      logger.error('Failed to end session', {
        error: error instanceof Error ? error.message : 'Unknown error',
        sessionId
      });
    }
  }

  /**
   * End all user sessions
   */
  async endUserSessions(userId: string): Promise<void> {
    try {
      const sessions = await this.store.getUserSessions(userId);
      
      for (const session of sessions) {
        if (session.isActive) {
          await this.store.update(session.sessionId, { isActive: false });
        }
      }

      if (this.config.auditSessions) {
        logger.info('All user sessions ended', {
          userId,
          sessionCount: sessions.length
        });
      }
    } catch (error) {
      logger.error('Failed to end user sessions', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId
      });
    }
  }

  /**
   * Extend session (refresh timeout)
   */
  async extendSession(sessionId: string): Promise<SessionResult> {
    const result = await this.validateSession(sessionId);
    if (result.valid && result.session) {
      await this.store.update(sessionId, { lastActivity: Date.now() });
      
      if (this.config.auditSessions) {
        logger.debug('Session extended', {
          sessionId,
          userId: result.session.userId
        });
      }
    }
    return result;
  }

  /**
   * Get session statistics
   */
  async getSessionStats(userId?: string): Promise<{
    totalSessions: number;
    activeSessions: number;
    userSessions?: number;
  }> {
    try {
      if (userId) {
        const userSessions = await this.store.getUserSessions(userId);
        const activeSessions = userSessions.filter(s => s.isActive).length;
        
        return {
          totalSessions: userSessions.length,
          activeSessions,
          userSessions: userSessions.length
        };
      }
      
      // For memory store, we can provide stats
      if (this.store instanceof MemorySessionStore) {
        // Access private members for stats (in real implementation, add public methods)
        return {
          totalSessions: 0, // Would need to expose this from store
          activeSessions: 0  // Would need to expose this from store
        };
      }
      
      return {
        totalSessions: 0,
        activeSessions: 0
      };
    } catch (error) {
      logger.error('Failed to get session stats', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId
      });
      
      return {
        totalSessions: 0,
        activeSessions: 0
      };
    }
  }

  /**
   * Generate secure session ID
   */
  private generateSessionId(): string {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Factory method
   */
  static create(config: SessionConfig): SessionMiddleware {
    return new SessionMiddleware(config);
  }
}

/**
 * Factory functions
 */
export function createSessionMiddleware(config: SessionConfig): SessionMiddleware {
  return SessionMiddleware.create(config);
}

export function createHealthcareSession(store?: SessionStore): SessionMiddleware {
  return new SessionMiddleware({
    ...SESSION_CONFIGS.healthcare,
    store
  });
}

export function createAdminSession(store?: SessionStore): SessionMiddleware {
  return new SessionMiddleware({
    ...SESSION_CONFIGS.admin,
    store
  });
}

export function createRedisSession(redisClient: any, config = SESSION_CONFIGS.healthcare): SessionMiddleware {
  return new SessionMiddleware({
    ...config,
    store: new RedisSessionStore(redisClient)
  });
}

/**
 * Default export
 */
export default SessionMiddleware;
