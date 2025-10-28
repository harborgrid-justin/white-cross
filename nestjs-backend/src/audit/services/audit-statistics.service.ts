import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AuditLog } from '../entities';

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
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
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
      const totalLogs = await this.auditLogRepository.count({
        where: {
          createdAt: Between(startDate, endDate),
        },
      });

      const uniqueUsers = await this.auditLogRepository
        .createQueryBuilder('audit_log')
        .select('COUNT(DISTINCT audit_log.userId)', 'count')
        .where('audit_log.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
        .andWhere('audit_log.userId IS NOT NULL')
        .getRawOne();

      // Get action distribution
      const actionDistribution = await this.auditLogRepository
        .createQueryBuilder('audit_log')
        .select('audit_log.action', 'action')
        .addSelect('COUNT(*)', 'count')
        .where('audit_log.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
        .groupBy('audit_log.action')
        .getRawMany();

      // Get entity type distribution
      const entityTypeDistribution = await this.auditLogRepository
        .createQueryBuilder('audit_log')
        .select('audit_log.entityType', 'entityType')
        .addSelect('COUNT(*)', 'count')
        .where('audit_log.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
        .groupBy('audit_log.entityType')
        .getRawMany();

      return {
        period: {
          start: startDate,
          end: endDate,
        },
        totalLogs,
        uniqueUsers: parseInt(uniqueUsers?.count || '0', 10),
        actionDistribution: actionDistribution.map((item) => ({
          action: item.action,
          count: parseInt(item.count, 10),
        })),
        entityTypeDistribution: entityTypeDistribution.map((item) => ({
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
