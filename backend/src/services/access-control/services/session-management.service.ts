import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { AuditService } from '../../databa@/services/audit.service';
import { ExecutionContext } from '../../database/types/execution-context.interface';
import { CreateSessionDto } from '../dto/create-session.dto';
import { SessionInstance, SequelizeModelClass } from '../types/sequelize-models.types';

import { BaseService } from '@/common/base';
/**
 * Session Management Service
 *
 * Handles all session-related operations including:
 * - Session creation and deletion
 * - Session activity tracking
 * - User session retrieval
 * - Expired session cleanup
 * - Audit logging for session operations
 */
@Injectable()
export class SessionManagementService extends BaseService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject('IAuditLogger') private readonly auditService: AuditService,
  ) {}

  /**
   * Get Sequelize models dynamically
   */
  private getModel<T>(modelName: string): SequelizeModelClass<T> {
    return this.sequelize.models[modelName];
  }

  /**
   * Create a new session
   */
  async createSession(data: CreateSessionDto): Promise<SessionInstance> {
    try {
      const Session = this.getModel('Session');
      const session = await Session.create({
        userId: data.userId,
        token: data.token,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        expiresAt: data.expiresAt,
        lastActivity: new Date(),
      });

      this.logInfo(`Created session for user ${data.userId}`);
      return session;
    } catch (error) {
      this.logError('Error creating session:', error);
      throw error;
    }
  }

  /**
   * Get user sessions (only active ones)
   */
  async getUserSessions(userId: string): Promise<SessionInstance[]> {
    try {
      const Session = this.getModel('Session');
      const sessions = await Session.findAll({
        where: {
          userId,
          expiresAt: {
            [Op.gt]: new Date(),
          },
        },
        order: [['createdAt', 'DESC']],
      });

      this.logInfo(
        `Retrieved ${sessions.length} active sessions for user ${userId}`,
      );
      return sessions;
    } catch (error) {
      this.logError(`Error getting sessions for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Update session activity timestamp with audit logging
   */
  async updateSessionActivity(
    token: string,
    ipAddress?: string,
  ): Promise<void> {
    try {
      const Session = this.getModel('Session');
      const session = await Session.findOne({
        where: { token },
      });

      if (session) {
        await session.update({
          lastActivity: new Date(),
        });

        // Audit logging for session activity
        await this.auditService.logUpdate(
          'Session',
          session.id,
          {
            userId: session.userId,
            userName: 'User',
            userRole: 'USER' as 'USER',
            ipAddress: ipAddress || session.ipAddress,
            userAgent: session.userAgent,
            timestamp: new Date(),
          } as ExecutionContext,
          { lastActivity: { before: session.lastActivity, after: new Date() } },
        );
      }
    } catch (error) {
      this.logError('Error updating session activity:', error);
      // Don't throw - this is a background operation
    }
  }

  /**
   * Delete session
   */
  async deleteSession(token: string): Promise<{ success: boolean }> {
    try {
      const Session = this.getModel('Session');
      const deletedCount = await Session.destroy({
        where: { token },
      });

      if (deletedCount === 0) {
        throw new NotFoundException('Session not found');
      }

      this.logInfo('Session deleted');
      return { success: true };
    } catch (error) {
      this.logError('Error deleting session:', error);
      throw error;
    }
  }

  /**
   * Delete all user sessions
   */
  async deleteAllUserSessions(userId: string): Promise<{ deleted: number }> {
    try {
      const Session = this.getModel('Session');
      const deletedCount = await Session.destroy({
        where: { userId },
      });

      this.logInfo(`Deleted ${deletedCount} sessions for user ${userId}`);
      return { deleted: deletedCount };
    } catch (error) {
      this.logError(`Error deleting sessions for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Cleanup expired sessions
   */
  async cleanupExpiredSessions(): Promise<{ deleted: number }> {
    try {
      const Session = this.getModel('Session');
      const deletedCount = await Session.destroy({
        where: {
          expiresAt: {
            [Op.lt]: new Date(),
          },
        },
      });

      this.logInfo(`Cleaned up ${deletedCount} expired sessions`);
      return { deleted: deletedCount };
    } catch (error) {
      this.logError('Error cleaning up expired sessions:', error);
      throw error;
    }
  }
}
