/**
 * WC-GEN-219 | auditStatisticsService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../shared/logging/logger, ../../database/models, ./types | Dependencies: sequelize, ../../shared/logging/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op } from 'sequelize';
import { logger } from '../../shared/logging/logger';
import { AuditLog, sequelize } from '../../database/models';
import { AuditStatistics } from './types';

/**
 * AuditStatisticsService - Statistical analysis for audit data
 * 
 * Provides comprehensive statistical analysis of audit logs including
 * distribution analysis, trending, and performance metrics for
 * administrative dashboards and compliance reporting.
 */
export class AuditStatisticsService {
  /**
   * Get audit statistics for a time period
   *
   * @param startDate - Start date for statistics
   * @param endDate - End date for statistics
   * @returns Promise with audit statistics
   */
  static async getAuditStatistics(startDate: Date, endDate: Date): Promise<AuditStatistics> {
    try {
      const totalLogs = await AuditLog.count({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      });

      // Get action distribution
      const actionCounts = await AuditLog.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        },
        attributes: [
          'action',
          [sequelize.fn('COUNT', sequelize.col('action')), 'count']
        ],
        group: ['action'],
        raw: true
      });

      // Get entity type distribution
      const entityTypeCounts = await AuditLog.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        },
        attributes: [
          'entityType',
          [sequelize.fn('COUNT', sequelize.col('entityType')), 'count']
        ],
        group: ['entityType'],
        raw: true
      });

      // Get unique users count
      const uniqueUsers = await AuditLog.count({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          },
          userId: { [Op.ne]: null }
        },
        distinct: true,
        col: 'userId'
      });

      return {
        period: {
          start: startDate,
          end: endDate
        },
        totalLogs,
        uniqueUsers,
        actionDistribution: actionCounts.map((item: any) => ({
          action: item.action,
          count: parseInt(item.count, 10)
        })),
        entityTypeDistribution: entityTypeCounts.map((item: any) => ({
          entityType: item.entityType,
          count: parseInt(item.count, 10)
        }))
      };
    } catch (error) {
      logger.error('Error getting audit statistics:', error);
      throw new Error('Failed to get audit statistics');
    }
  }

  /**
   * Get daily audit log counts for trend analysis
   *
   * @param startDate - Start date for the trend analysis
   * @param endDate - End date for the trend analysis
   * @returns Promise with daily audit log counts
   */
  static async getDailyAuditTrend(startDate: Date, endDate: Date) {
    try {
      const dailyCounts = await AuditLog.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        },
        attributes: [
          [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
        order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
        raw: true
      });

      return {
        period: { start: startDate, end: endDate },
        dailyTrend: dailyCounts.map((item: any) => ({
          date: item.date,
          count: parseInt(item.count, 10)
        }))
      };
    } catch (error) {
      logger.error('Error getting daily audit trend:', error);
      throw new Error('Failed to get daily audit trend');
    }
  }

  /**
   * Get hourly distribution of audit logs
   *
   * @param startDate - Start date for the analysis
   * @param endDate - End date for the analysis
   * @returns Promise with hourly distribution data
   */
  static async getHourlyDistribution(startDate: Date, endDate: Date) {
    try {
      const hourlyCounts = await AuditLog.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        },
        attributes: [
          [sequelize.fn('EXTRACT', sequelize.literal('HOUR FROM "createdAt"')), 'hour'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: [sequelize.fn('EXTRACT', sequelize.literal('HOUR FROM "createdAt"'))],
        order: [[sequelize.fn('EXTRACT', sequelize.literal('HOUR FROM "createdAt"')), 'ASC']],
        raw: true
      }) as any[];

      // Fill in missing hours with 0 count
      const hourlyData = Array.from({ length: 24 }, (_, hour) => {
        const found = hourlyCounts.find((item: any) => parseInt(item.hour) === hour);
        return {
          hour,
          count: found ? parseInt(found.count, 10) : 0
        };
      });

      return {
        period: { start: startDate, end: endDate },
        hourlyDistribution: hourlyData
      };
    } catch (error) {
      logger.error('Error getting hourly distribution:', error);
      throw new Error('Failed to get hourly distribution');
    }
  }

  /**
   * Get top users by audit log count
   *
   * @param startDate - Start date for the analysis
   * @param endDate - End date for the analysis
   * @param limit - Number of top users to return
   * @returns Promise with top users data
   */
  static async getTopUsersByActivity(startDate: Date, endDate: Date, limit: number = 10) {
    try {
      const topUsers = await AuditLog.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          },
          userId: { [Op.ne]: null }
        },
        attributes: [
          'userId',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['userId'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit,
        raw: true
      });

      return {
        period: { start: startDate, end: endDate },
        topUsers: topUsers.map((item: any) => ({
          userId: item.userId,
          count: parseInt(item.count, 10)
        }))
      };
    } catch (error) {
      logger.error('Error getting top users by activity:', error);
      throw new Error('Failed to get top users by activity');
    }
  }

  /**
   * Get failed action statistics
   *
   * @param startDate - Start date for the analysis
   * @param endDate - End date for the analysis
   * @returns Promise with failed action statistics
   */
  static async getFailedActionStatistics(startDate: Date, endDate: Date) {
    try {
      const totalActions = await AuditLog.count({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      });

      const failedActions = await AuditLog.count({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          },
          [Op.and]: [
            sequelize.literal("(changes->>'success')::boolean = false")
          ]
        }
      });

      const successRate = totalActions > 0 ? ((totalActions - failedActions) / totalActions) * 100 : 0;

      // Get failed actions by type
      const failedActionsByType = await AuditLog.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          },
          [Op.and]: [
            sequelize.literal("(changes->>'success')::boolean = false")
          ]
        },
        attributes: [
          'action',
          [sequelize.fn('COUNT', sequelize.col('action')), 'count']
        ],
        group: ['action'],
        order: [[sequelize.fn('COUNT', sequelize.col('action')), 'DESC']],
        raw: true
      });

      return {
        period: { start: startDate, end: endDate },
        totalActions,
        failedActions,
        successRate,
        failureRate: totalActions > 0 ? (failedActions / totalActions) * 100 : 0,
        failedActionsByType: failedActionsByType.map((item: any) => ({
          action: item.action,
          count: parseInt(item.count, 10)
        }))
      };
    } catch (error) {
      logger.error('Error getting failed action statistics:', error);
      throw new Error('Failed to get failed action statistics');
    }
  }

  /**
   * Get audit log volume metrics
   *
   * @param startDate - Start date for the analysis
   * @param endDate - End date for the analysis
   * @returns Promise with volume metrics
   */
  static async getVolumeMetrics(startDate: Date, endDate: Date) {
    try {
      const totalLogs = await AuditLog.count({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      });

      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const averagePerDay = daysDiff > 0 ? totalLogs / daysDiff : 0;

      // Get peak day
      const dailyCounts = await AuditLog.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        },
        attributes: [
          [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: 1,
        raw: true
      }) as any[];

      const peakDay = dailyCounts.length > 0 ? {
        date: dailyCounts[0].date,
        count: parseInt(dailyCounts[0].count, 10)
      } : null;

      return {
        period: { start: startDate, end: endDate },
        totalLogs,
        averagePerDay: Math.round(averagePerDay * 100) / 100,
        peakDay
      };
    } catch (error) {
      logger.error('Error getting volume metrics:', error);
      throw new Error('Failed to get volume metrics');
    }
  }

  /**
   * Get comprehensive audit dashboard statistics
   *
   * @param startDate - Start date for the dashboard period
   * @param endDate - End date for the dashboard period
   * @returns Promise with comprehensive dashboard data
   */
  static async getAuditDashboard(startDate: Date, endDate: Date) {
    try {
      const [
        basicStats,
        dailyTrend,
        hourlyDistribution,
        topUsers,
        failedStats,
        volumeMetrics
      ] = await Promise.all([
        this.getAuditStatistics(startDate, endDate),
        this.getDailyAuditTrend(startDate, endDate),
        this.getHourlyDistribution(startDate, endDate),
        this.getTopUsersByActivity(startDate, endDate, 5),
        this.getFailedActionStatistics(startDate, endDate),
        this.getVolumeMetrics(startDate, endDate)
      ]);

      return {
        period: { start: startDate, end: endDate },
        overview: {
          totalLogs: basicStats.totalLogs,
          uniqueUsers: basicStats.uniqueUsers,
          successRate: failedStats.successRate,
          averagePerDay: volumeMetrics.averagePerDay
        },
        trends: {
          daily: dailyTrend.dailyTrend,
          hourly: hourlyDistribution.hourlyDistribution
        },
        distributions: {
          actions: basicStats.actionDistribution,
          entityTypes: basicStats.entityTypeDistribution
        },
        insights: {
          topUsers: topUsers.topUsers,
          peakDay: volumeMetrics.peakDay,
          failedActions: failedStats.failedActionsByType
        }
      };
    } catch (error) {
      logger.error('Error getting audit dashboard:', error);
      throw new Error('Failed to get audit dashboard');
    }
  }
}
