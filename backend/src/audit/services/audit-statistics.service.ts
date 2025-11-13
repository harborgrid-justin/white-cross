import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { col, fn, Op } from 'sequelize';
import { AuditLog } from '@/database';
import { BaseService } from '../../common/base';
import {
  ActionDistributionQueryResult,
  AuditDashboard,
  AuditStatistics,
  EntityTypeDistributionQueryResult,
  UniqueUsersQueryResult,
} from '../types/audit.types';

/**
 * AuditStatisticsService - Statistical analysis for audit data
 *
 * Provides comprehensive statistical analysis of audit logs including
 * distribution analysis, trending, and performance metrics for
 * administrative dashboards and compliance reporting.
 */
@Injectable()
export class AuditStatisticsService extends BaseService {
  constructor(
    @InjectModel(AuditLog)
    private readonly auditLogModel: typeof AuditLog,
  ) {}

  /**
   * Get audit statistics for a time period
   *
   * @param startDate - Start date for statistics
   * @param endDate - End date for statistics
   * @returns Promise with audit statistics
   */
  async getAuditStatistics(startDate: Date, endDate: Date): Promise<AuditStatistics> {
    try {
      const totalLogs = await this.auditLogModel.count({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      const uniqueUsersResult = await this.auditLogModel.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
          userId: {
            [Op.ne]: null,
          },
        },
        attributes: [[fn('COUNT', fn('DISTINCT', col('userId'))), 'count']],
        raw: true,
      });

      // Get action distribution
      const actionDistribution = await this.auditLogModel.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        attributes: ['action', [fn('COUNT', col('*')), 'count']],
        group: ['action'],
        raw: true,
      });

      // Get entity type distribution
      const entityTypeDistribution = await this.auditLogModel.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        attributes: ['entityType', [fn('COUNT', col('*')), 'count']],
        group: ['entityType'],
        raw: true,
      });

      return {
        period: {
          start: startDate,
          end: endDate,
        },
        totalLogs,
        uniqueUsers: parseInt(
          String((uniqueUsersResult[0] as unknown as UniqueUsersQueryResult)?.count || '0'),
          10,
        ),
        actionDistribution: (actionDistribution as unknown as ActionDistributionQueryResult[]).map(
          (item) => ({
            action: item.action,
            count: typeof item.count === 'string' ? parseInt(item.count, 10) : item.count,
          }),
        ),
        entityTypeDistribution: (
          entityTypeDistribution as unknown as EntityTypeDistributionQueryResult[]
        ).map((item) => ({
          entityType: item.entityType,
          count: typeof item.count === 'string' ? parseInt(item.count, 10) : item.count,
        })),
      };
    } catch (error) {
      this.logError('Error getting audit statistics:', error);
      throw new Error('Failed to get audit statistics');
    }
  }

  /**
   * Get comprehensive audit dashboard statistics
   *
   * @param startDate - Start date for the dashboard period
   * @param endDate - End date for the dashboard period
   * @returns Promise with comprehensive dashboard data
   */
  async getAuditDashboard(startDate: Date, endDate: Date): Promise<AuditDashboard> {
    try {
      const stats = await this.getAuditStatistics(startDate, endDate);

      return {
        period: { start: startDate, end: endDate },
        overview: {
          totalLogs: stats.totalLogs,
          uniqueUsers: stats.uniqueUsers,
        },
        distributions: {
          actions: stats.actionDistribution,
          entityTypes: stats.entityTypeDistribution,
        },
      };
    } catch (error) {
      this.logError('Error getting audit dashboard:', error);
      throw new Error('Failed to get audit dashboard');
    }
  }
}
