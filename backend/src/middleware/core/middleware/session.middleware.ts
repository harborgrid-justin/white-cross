/**
 * @fileoverview Session Management Middleware for NestJS
 * @module middleware/core/middleware/session
 * @description HIPAA-compliant session management middleware for NestJS.
 * Migrated from backend/src/middleware/core/session/session.middleware.ts
 *
 * @security Critical session middleware - handles user session lifecycle
 * @compliance HIPAA - Access control and audit logging
 */

import { Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import * as crypto from 'crypto';
import type { SessionConfig, SessionData, SessionResult, SessionStore } from '../types/session.types';
import { SESSION_CONFIGS } from '../types/session.types';

/**
 * In-memory session store implementation
 *
 * @class MemorySessionStore
 * @implements {SessionStore}
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
      if (
        !session.isActive &&
        now - session.lastActivity > 24 * 60 * 60 * 1000
      ) {
        await this.delete(sessionId);
        cleaned++;
      }
    }

    return cleaned;
  }
}

/**
 * Session Management Middleware
 *
 * @class SessionMiddleware
 * @implements {NestMiddleware}
 *
 * @description NestJS middleware for managing user sessions with HIPAA compliance.
 * Provides automatic timeouts, concurrent session limits, activity tracking, and audit logging.
 *
 * @example
 * // In module
 * export class AppModule implements NestModule {
 *   configure(consumer: MiddlewareConsumer) {
 *     consumer
 *       .apply(SessionMiddleware)
 *       .forRoutes('*');
 *   }
 * }
 */
@Injectable()
export class SessionMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SessionMiddleware.name);
  private config: SessionConfig;
  private readonly store: SessionStore;

  constructor() {
    this.config = SESSION_CONFIGS.healthcare;
    this.store = this.config.store || new MemorySessionStore();

    // Start cleanup timer for memory store
    if (this.store instanceof MemorySessionStore) {
      setInterval(
        () => {
          this.store.cleanup().then((cleaned) => {
            if (cleaned > 0) {
              this.logger.debug(`Cleaned up ${cleaned} expired sessions`);
            }
          });
        },
        60 * 60 * 1000,
      ); // Cleanup every hour
    }
  }

  /**
   * Update session configuration
   *
   * @param {SessionConfig} newConfig - New configuration
   */
  setConfig(newConfig: SessionConfig): void {
    this.config = newConfig;
  }

  /**
   * Middleware handler
   *
   * @param {Request} req - Express request
   * @param {Response} res - Express response
   * @param {NextFunction} next - Next middleware function
   */
  async use(req: Request, res: Response, next: NextFunction) {
    // Skip session validation for public routes
    if (this.isPublicRoute(req.path)) {
      return next();
    }

    // Get session ID from cookie or header
    const sessionId = this.extractSessionId(req);

    if (!sessionId) {
      // No session ID - might be handled by JWT auth
      return next();
    }

    try {
      // Validate session
      const result = await this.validateSession(sessionId);

      if (!result.valid) {
        throw new UnauthorizedException(
          result.error?.message || 'Invalid session',
        );
      }

      // Attach session to request
      (req as any).session = result.session;

      // Add warning header if session is expiring soon
      if (result.warning) {
        res.setHeader('X-Session-Warning', JSON.stringify(result.warning));
      }

      next();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.logger.error('Session middleware error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        sessionId,
      });

      throw new UnauthorizedException('Session validation failed');
    }
  }

  /**
   * Create a new user session
   *
   * @param {string} userId - User ID
   * @param {string} email - User email
   * @param {string} role - User role
   * @param {string} ipAddress - Client IP address
   * @param {string} userAgent - Client user agent
   * @param {string[]} [permissions] - User permissions
   * @returns {Promise<SessionData>} Created session
   */
  async createSession(
    userId: string,
    email: string,
    role: string,
    ipAddress: string,
    userAgent: string,
    permissions?: string[],
  ): Promise<SessionData> {
    // Check concurrent session limit
    const userSessions = await this.store.getUserSessions(userId);
    const activeSessions = userSessions.filter((s) => s.isActive);

    if (activeSessions.length >= this.config.maxConcurrentSessions) {
      // Deactivate oldest session
      const oldestSession = activeSessions.sort(
        (a, b) => a.lastActivity - b.lastActivity,
      )[0];
      await this.store.update(oldestSession.sessionId, { isActive: false });

      if (this.config.auditSessions) {
        this.logger.log('Deactivated session due to concurrent limit', {
          userId,
          deactivatedSessionId: oldestSession.sessionId,
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
      permissions,
    };

    await this.store.create(session);

    if (this.config.auditSessions) {
      this.logger.log('Session created', {
        sessionId,
        userId,
        email,
        role,
        ipAddress,
      });
    }

    return session;
  }

  /**
   * Validate session
   *
   * @private
   * @param {string} sessionId - Session ID
   * @returns {Promise<SessionResult>} Validation result
   */
  private async validateSession(sessionId: string): Promise<SessionResult> {
    try {
      const session = await this.store.get(sessionId);

      if (!session) {
        return {
          valid: false,
          error: {
            code: 'SESSION_NOT_FOUND',
            message: 'Session not found',
          },
        };
      }

      if (!session.isActive) {
        return {
          valid: false,
          error: {
            code: 'SESSION_INACTIVE',
            message: 'Session is no longer active',
          },
        };
      }

      const now = Date.now();
      const timeSinceActivity = now - session.lastActivity;

      // Check if session has expired
      if (timeSinceActivity > this.config.sessionTimeout) {
        await this.store.update(sessionId, { isActive: false });

        if (this.config.auditSessions) {
          this.logger.log('Session expired', {
            sessionId,
            userId: session.userId,
            timeSinceActivity,
          });
        }

        return {
          valid: false,
          error: {
            code: 'SESSION_EXPIRED',
            message: 'Session has expired',
          },
        };
      }

      // Update last activity if tracking is enabled
      if (this.config.trackActivity) {
        await this.store.update(sessionId, { lastActivity: now });
      }

      // Check if warning should be shown
      const timeRemaining = this.config.sessionTimeout - timeSinceActivity;
      const warning =
        timeRemaining <= this.config.warningTime
          ? {
              message: 'Your session will expire soon',
              timeRemaining,
            }
          : undefined;

      return {
        valid: true,
        session,
        warning,
      };
    } catch (error) {
      this.logger.error('Session validation failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        sessionId,
      });

      return {
        valid: false,
        error: {
          code: 'SESSION_VALIDATION_ERROR',
          message: 'Session validation failed',
        },
      };
    }
  }

  /**
   * Extract session ID from request
   *
   * @private
   * @param {Request} req - Express request
   * @returns {string | null} Session ID or null
   */
  private extractSessionId(req: Request): string | null {
    // Try to get from cookie
    if (req.cookies && req.cookies.sessionId) {
      return req.cookies.sessionId;
    }

    // Try to get from header
    const sessionHeader = req.headers['x-session-id'];
    if (sessionHeader && typeof sessionHeader === 'string') {
      return sessionHeader;
    }

    return null;
  }

  /**
   * Check if route is public
   *
   * @private
   * @param {string} path - Route path
   * @returns {boolean} True if public route
   */
  private isPublicRoute(path: string): boolean {
    const publicRoutes = [
      '/auth/login',
      '/auth/register',
      '/health',
      '/api/health',
    ];

    return publicRoutes.some((route) => path.startsWith(route));
  }

  /**
   * Generate secure session ID
   *
   * @private
   * @returns {string} Session ID
   */
  private generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * End session
   *
   * @param {string} sessionId - Session ID
   */
  async endSession(sessionId: string): Promise<void> {
    try {
      const session = await this.store.get(sessionId);
      if (session) {
        await this.store.update(sessionId, { isActive: false });

        if (this.config.auditSessions) {
          this.logger.log('Session ended', {
            sessionId,
            userId: session.userId,
            duration: Date.now() - session.createdAt,
          });
        }
      }
    } catch (error) {
      this.logger.error('Failed to end session', {
        error: error instanceof Error ? error.message : 'Unknown error',
        sessionId,
      });
    }
  }

  /**
   * End all user sessions
   *
   * @param {string} userId - User ID
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
        this.logger.log('All user sessions ended', {
          userId,
          sessionCount: sessions.length,
        });
      }
    } catch (error) {
      this.logger.error('Failed to end user sessions', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
    }
  }
}

/**
 * Factory function for creating healthcare session middleware
 *
 * @returns {SessionMiddleware} Middleware instance
 */
export function createHealthcareSessionMiddleware(): SessionMiddleware {
  const middleware = new SessionMiddleware();
  middleware.setConfig(SESSION_CONFIGS.healthcare);
  return middleware;
}

/**
 * Factory function for creating admin session middleware
 *
 * @returns {SessionMiddleware} Middleware instance
 */
export function createAdminSessionMiddleware(): SessionMiddleware {
  const middleware = new SessionMiddleware();
  middleware.setConfig(SESSION_CONFIGS.admin);
  return middleware;
}
