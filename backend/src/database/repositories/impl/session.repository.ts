/**
 * Session Repository Implementation
 * Injectable NestJS repository for session tracking with expiration management
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { BaseRepository, RepositoryError } from '../base/base.repository';
import type { IAuditLogger } from '../../../database/interfaces/audit/audit-logger.interface';
import { sanitizeSensitiveData } from '../../../database/interfaces/audit/audit-logger.interface';
import type { ICacheManager } from '../../../database/interfaces/cache/cache-manager.interface';
import { ExecutionContext, QueryOptions } from '../../types';

export interface SessionAttributes {
  id: string;
  userId: string;
  token: string;
  refreshToken?: string;
  ipAddress: string;
  userAgent: string;
  expiresAt: Date;
  isActive: boolean;
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSessionDTO {
  userId: string;
  token: string;
  refreshToken?: string;
  ipAddress: string;
  userAgent: string;
  expiresAt: Date;
}

export interface UpdateSessionDTO {
  lastActivityAt?: Date;
  isActive?: boolean;
}

@Injectable()
export class SessionRepository extends BaseRepository<
  any,
  SessionAttributes,
  CreateSessionDTO
> {
  constructor(
    @InjectModel('' as any) model: any,
    @Inject('IAuditLogger') auditLogger: IAuditLogger,
    @Inject('ICacheManager') cacheManager: ICacheManager,
  ) {
    super(model, auditLogger, cacheManager, 'Session');
  }

  async findByToken(token: string): Promise<SessionAttributes | null> {
    try {
      const cacheKey = this.cacheKeyBuilder.summary(
        this.entityName,
        token,
        'by-token',
      );
      const cached = await this.cacheManager.get<SessionAttributes>(cacheKey);

      if (cached) {
        this.logger.debug(`Cache hit for session token`);
        return cached;
      }

      const session = await this.model.findOne({
        where: { token, isActive: true, expiresAt: { [Op.gt]: new Date() } },
      });

      if (!session) return null;

      const entity = this.mapToEntity(session);
      await this.cacheManager.set(cacheKey, entity, 900); // 15 minutes cache
      return entity;
    } catch (error) {
      this.logger.error('Error finding session by token:', error);
      throw new RepositoryError(
        'Failed to find session by token',
        'FIND_BY_TOKEN_ERROR',
        500,
        { error: (error as Error).message },
      );
    }
  }

  async findByUserId(userId: string): Promise<SessionAttributes[]> {
    try {
      const sessions = await this.model.findAll({
        where: {
          userId,
          isActive: true,
          expiresAt: { [Op.gt]: new Date() },
        },
        order: [['lastActivityAt', 'DESC']],
      });
      return sessions.map((s: Student) => this.mapToEntity(s));
    } catch (error) {
      this.logger.error('Error finding sessions by user:', error);
      throw new RepositoryError(
        'Failed to find sessions by user',
        'FIND_BY_USER_ERROR',
        500,
        { userId, error: (error as Error).message },
      );
    }
  }

  async updateActivity(sessionId: string): Promise<void> {
    try {
      await this.model.update(
        { lastActivityAt: new Date() },
        { where: { id: sessionId } },
      );

      const session = await this.model.findByPk(sessionId);
      if (session) {
        await this.invalidateCaches(session);
      }
    } catch (error) {
      this.logger.error('Error updating session activity:', error);
    }
  }

  async invalidateSession(
    sessionId: string,
    context: ExecutionContext,
  ): Promise<void> {
    try {
      await this.model.update(
        { isActive: false },
        { where: { id: sessionId } },
      );

      await this.auditLogger.logUpdate(this.entityName, sessionId, context, {
        isActive: { before: true, after: false },
      });

      const session = await this.model.findByPk(sessionId);
      if (session) {
        await this.invalidateCaches(session);
      }

      this.logger.log(`Invalidated session ${sessionId}`);
    } catch (error) {
      this.logger.error('Error invalidating session:', error);
      throw new RepositoryError(
        'Failed to invalidate session',
        'INVALIDATE_SESSION_ERROR',
        500,
        { sessionId, error: (error as Error).message },
      );
    }
  }

  async invalidateUserSessions(
    userId: string,
    context: ExecutionContext,
  ): Promise<void> {
    let transaction: Transaction | undefined;

    try {
      transaction = await this.model.sequelize!.transaction();

      await this.model.update(
        { isActive: false },
        { where: { userId, isActive: true }, transaction },
      );

      await this.auditLogger.logBulkOperation(
        'INVALIDATE_USER_SESSIONS',
        this.entityName,
        context,
        { userId },
      );

      if (transaction) {
        await transaction.commit();
      }

      await this.cacheManager.deletePattern(
        `white-cross:session:user:${userId}:*`,
      );

      this.logger.log(`Invalidated all sessions for user ${userId}`);
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }

      this.logger.error('Error invalidating user sessions:', error);
      throw new RepositoryError(
        'Failed to invalidate user sessions',
        'INVALIDATE_USER_SESSIONS_ERROR',
        500,
        { userId, error: (error as Error).message },
      );
    }
  }

  async cleanupExpiredSessions(): Promise<number> {
    try {
      const result = await this.model.destroy({
        where: {
          [Op.or]: [
            { expiresAt: { [Op.lt]: new Date() } },
            { isActive: false },
          ],
        },
      });

      this.logger.log(`Cleaned up ${result} expired sessions`);
      return result;
    } catch (error) {
      this.logger.error('Error cleaning up expired sessions:', error);
      return 0;
    }
  }

  protected async validateCreate(data: CreateSessionDTO): Promise<void> {
    // No validation needed for session creation
  }

  protected async validateUpdate(
    id: string,
    data: UpdateSessionDTO,
  ): Promise<void> {
    // No validation needed for session updates
  }

  protected async invalidateCaches(session: Session): Promise<void> {
    try {
      const sessionData = session.get();
      await this.cacheManager.delete(
        this.cacheKeyBuilder.entity(this.entityName, sessionData.id),
      );

      if (sessionData.token) {
        await this.cacheManager.delete(
          this.cacheKeyBuilder.summary(
            this.entityName,
            sessionData.token,
            'by-token',
          ),
        );
      }

      if (sessionData.userId) {
        await this.cacheManager.deletePattern(
          `white-cross:session:user:${sessionData.userId}:*`,
        );
      }
    } catch (error) {
      this.logger.warn('Error invalidating session caches:', error);
    }
  }

  protected sanitizeForAudit(data: Partial<SessionAttributes>): Record<string, unknown> {
    return sanitizeSensitiveData({
      ...data,
      token: '[REDACTED]',
      refreshToken: '[REDACTED]',
    });
  }
}
