import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, fn, col, literal } from 'sequelize';
import { AuditLog } from '../../database/models/audit-log.model';

/**
 * AuditStatisticsService - Statistical analysis for audit data
 *
 * Provides comprehensive statistical analysis of audit logs including
 * distribution analysis, trending, and performance metrics for
 * administrative dashboards and compliance reporting.
 */
@Injectable()
export class AuditStatisticsService {
  private readonly logger = new Logger(AuditStatisticsService.name);

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
  async getAuditStatistics(startDate: Date, endDate: Date): Promise<any> {
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
        uniqueUsers: parseInt((uniqueUsersResult[0] as any)?.count || '0', 10),
        actionDistribution: actionDistribution.map((item: any) => ({
          action: item.action,
          count: parseInt(item.count, 10),
        })),
        entityTypeDistribution: entityTypeDistribution.map((item: any) => ({
          entityType: item.entityType,
          count: parseInt(item.count, 10),
        })),
      };
    } catch (error) {
      this.logger.error('Error getting audit statistics:', error);
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
  async getAuditDashboard(startDate: Date, endDate: Date): Promise<any> {
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
      this.logger.error('Error getting audit dashboard:', error);
      throw new Error('Failed to get audit dashboard');
    }
  }
}
