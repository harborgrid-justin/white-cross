import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { SessionEntity } from '../entities';
import { randomBytes } from 'crypto';

/**
 * Session Management Service
 * Manages user sessions for security tracking and concurrent session limits
 */
@Injectable()
export class SessionManagementService {
  private readonly logger = new Logger(SessionManagementService.name);
  private readonly MAX_CONCURRENT_SESSIONS = 5;
  private readonly SESSION_DURATION_HOURS = 24;

  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepo: Repository<SessionEntity>,
  ) {}

  /**
   * Create a new session
   */
  async createSession(data: {
    userId: string;
    ipAddress: string;
    userAgent?: string;
    metadata?: Record<string, any>;
  }): Promise<SessionEntity> {
    try {
      // Check concurrent session limit
      await this.enforceConcurrentSessionLimit(data.userId);

      const sessionToken = this.generateSessionToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + this.SESSION_DURATION_HOURS);

      const session = this.sessionRepo.create({
        sessionToken,
        userId: data.userId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        expiresAt,
        lastAccessedAt: new Date(),
        isActive: true,
        metadata: data.metadata,
      });

      const saved = await this.sessionRepo.save(session);
      this.logger.log('Session created', {
        userId: data.userId,
        sessionId: saved.id,
      });

      return saved;
    } catch (error) {
      this.logger.error('Error creating session', { error });
      throw error;
    }
  }

  /**
   * Validate and update session
   */
  async validateSession(sessionToken: string): Promise<SessionEntity | null> {
    try {
      const session = await this.sessionRepo.findOne({
        where: {
          sessionToken,
          isActive: true,
        },
      });

      if (!session) {
        return null;
      }

      // Check expiration
      if (session.expiresAt < new Date()) {
        await this.invalidateSession(session.id);
        return null;
      }

      // Update last accessed
      session.lastAccessedAt = new Date();
      await this.sessionRepo.save(session);

      return session;
    } catch (error) {
      this.logger.error('Error validating session', { error, sessionToken });
      return null;
    }
  }

  /**
   * Invalidate a session
   */
  async invalidateSession(sessionId: string): Promise<boolean> {
    try {
      await this.sessionRepo.update(sessionId, { isActive: false });
      this.logger.log('Session invalidated', { sessionId });
      return true;
    } catch (error) {
      this.logger.error('Error invalidating session', { error, sessionId });
      return false;
    }
  }

  /**
   * Invalidate all user sessions
   */
  async invalidateUserSessions(userId: string): Promise<number> {
    try {
      const result = await this.sessionRepo.update(
        { userId, isActive: true },
        { isActive: false },
      );

      this.logger.log('User sessions invalidated', {
        userId,
        count: result.affected || 0,
      });

      return result.affected || 0;
    } catch (error) {
      this.logger.error('Error invalidating user sessions', { error, userId });
      return 0;
    }
  }

  /**
   * Get active sessions for user
   */
  async getActiveSessions(userId: string): Promise<SessionEntity[]> {
    try {
      return await this.sessionRepo.find({
        where: {
          userId,
          isActive: true,
          expiresAt: MoreThan(new Date()),
        },
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      this.logger.error('Error fetching active sessions', { error, userId });
      return [];
    }
  }

  /**
   * Enforce concurrent session limit
   */
  private async enforceConcurrentSessionLimit(userId: string): Promise<void> {
    try {
      const activeSessions = await this.getActiveSessions(userId);

      if (activeSessions.length >= this.MAX_CONCURRENT_SESSIONS) {
        // Invalidate the oldest session
        const oldestSession = activeSessions[activeSessions.length - 1];
        await this.invalidateSession(oldestSession.id);
        this.logger.warn('Concurrent session limit reached, oldest session invalidated', {
          userId,
          limit: this.MAX_CONCURRENT_SESSIONS,
        });
      }
    } catch (error) {
      this.logger.error('Error enforcing session limit', { error, userId });
    }
  }

  /**
   * Generate secure session token
   */
  private generateSessionToken(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Cleanup expired sessions (should be called periodically)
   */
  async cleanupExpiredSessions(): Promise<number> {
    try {
      const result = await this.sessionRepo.update(
        {
          expiresAt: MoreThan(new Date()),
          isActive: true,
        },
        { isActive: false },
      );

      const cleaned = result.affected || 0;
      if (cleaned > 0) {
        this.logger.log('Expired sessions cleaned up', { count: cleaned });
      }

      return cleaned;
    } catch (error) {
      this.logger.error('Error cleaning up expired sessions', { error });
      return 0;
    }
  }
}
