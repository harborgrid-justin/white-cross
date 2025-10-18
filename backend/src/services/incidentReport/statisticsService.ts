/**
 * LOC: 96ACB6D7F7
 * WC-GEN-267 | statisticsService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - index.ts (database/models/index.ts)
 *   - types.ts (services/incidentReport/types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/incidentReport/index.ts)
 */

/**
 * WC-GEN-267 | statisticsService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ./types | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { IncidentReport, sequelize } from '../../database/models';
import { IncidentStatistics } from './types';

export class StatisticsService {
  /**
   * Get incident statistics
   */
  static async getIncidentStatistics(
    dateFrom?: Date,
    dateTo?: Date,
    studentId?: string
  ): Promise<IncidentStatistics> {
    try {
      const whereClause: any = {};

      if (dateFrom || dateTo) {
        whereClause.occurredAt = {};
        if (dateFrom) {
          whereClause.occurredAt[Op.gte] = dateFrom;
        }
        if (dateTo) {
          whereClause.occurredAt[Op.lte] = dateTo;
        }
      }

      if (studentId) {
        whereClause.studentId = studentId;
      }

      const [typeStats, severityStats, locationStats, totalReports, notifiedReports, followUpReports] = await Promise.all([
        IncidentReport.findAll({
          where: whereClause,
          attributes: [
            'type',
            [sequelize.fn('COUNT', sequelize.col('type')), 'count']
          ],
          group: ['type'],
          raw: true
        }),
        IncidentReport.findAll({
          where: whereClause,
          attributes: [
            'severity',
            [sequelize.fn('COUNT', sequelize.col('severity')), 'count']
          ],
          group: ['severity'],
          raw: true
        }),
        IncidentReport.findAll({
          where: whereClause,
          attributes: [
            'location',
            [sequelize.fn('COUNT', sequelize.col('location')), 'count']
          ],
          group: ['location'],
          raw: true
        }),
        IncidentReport.count({ where: whereClause }),
        IncidentReport.count({
          where: { ...whereClause, parentNotified: true }
        }),
        IncidentReport.count({
          where: { ...whereClause, followUpRequired: true }
        })
      ]);

      // Calculate average response time (simplified - time between occurredAt and createdAt)
      const reports = await IncidentReport.findAll({
        where: whereClause,
        attributes: ['occurredAt', 'createdAt'],
        raw: true
      });

      const avgResponseTime = reports.length > 0
        ? reports.reduce((sum: number, report: any) => {
            const responseTime = new Date(report.createdAt).getTime() - new Date(report.occurredAt).getTime();
            return sum + (responseTime / (1000 * 60)); // Convert to minutes
          }, 0) / reports.length
        : 0;

      return {
        total: totalReports,
        byType: typeStats.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.type] = parseInt(curr.count, 10);
          return acc;
        }, {}),
        bySeverity: severityStats.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.severity] = parseInt(curr.count, 10);
          return acc;
        }, {}),
        byLocation: locationStats.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.location] = parseInt(curr.count, 10);
          return acc;
        }, {}),
        parentNotificationRate: totalReports > 0 ? (notifiedReports / totalReports) * 100 : 0,
        followUpRate: totalReports > 0 ? (followUpReports / totalReports) * 100 : 0,
        averageResponseTime: Math.round(avgResponseTime * 100) / 100
      };
    } catch (error) {
      logger.error('Error fetching incident statistics:', error);
      throw error;
    }
  }

  /**
   * Get statistics by time period (daily, weekly, monthly)
   */
  static async getStatisticsByPeriod(
    period: 'daily' | 'weekly' | 'monthly',
    dateFrom: Date,
    dateTo: Date
  ) {
    try {
      let dateFormat: string;
      let groupBy: string;

      switch (period) {
        case 'daily':
          dateFormat = '%Y-%m-%d';
          groupBy = 'DATE(occurredAt)';
          break;
        case 'weekly':
          dateFormat = '%Y-Week-%u';
          groupBy = 'YEAR(occurredAt), WEEK(occurredAt)';
          break;
        case 'monthly':
          dateFormat = '%Y-%m';
          groupBy = 'YEAR(occurredAt), MONTH(occurredAt)';
          break;
        default:
          throw new Error('Invalid period specified');
      }

      const results = await IncidentReport.findAll({
        where: {
          occurredAt: {
            [Op.between]: [dateFrom, dateTo]
          }
        },
        attributes: [
          [sequelize.fn('DATE_FORMAT', sequelize.col('occurredAt'), dateFormat), 'period'],
          'type',
          'severity',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['type', 'severity'],
        order: [['period', 'ASC']],
        raw: true
      });

      // Group results by period
      const periodStats: Record<string, any> = {};

      results.forEach((result: any) => {
        const period = result.period;
        if (!periodStats[period]) {
          periodStats[period] = {
            period,
            total: 0,
            byType: {},
            bySeverity: {}
          };
        }

        const count = parseInt(result.count, 10);
        periodStats[period].total += count;
        periodStats[period].byType[result.type] = (periodStats[period].byType[result.type] || 0) + count;
        periodStats[period].bySeverity[result.severity] = (periodStats[period].bySeverity[result.severity] || 0) + count;
      });

      return Object.values(periodStats);
    } catch (error) {
      logger.error('Error fetching statistics by period:', error);
      throw error;
    }
  }

  /**
   * Get top locations by incident count
   */
  static async getTopLocations(limit: number = 10, dateFrom?: Date, dateTo?: Date) {
    try {
      const whereClause: any = {};

      if (dateFrom || dateTo) {
        whereClause.occurredAt = {};
        if (dateFrom) {
          whereClause.occurredAt[Op.gte] = dateFrom;
        }
        if (dateTo) {
          whereClause.occurredAt[Op.lte] = dateTo;
        }
      }

      const locations = await IncidentReport.findAll({
        where: whereClause,
        attributes: [
          'location',
          [sequelize.fn('COUNT', sequelize.col('location')), 'count']
        ],
        group: ['location'],
        order: [[sequelize.literal('count'), 'DESC']],
        limit,
        raw: true
      });

      return locations.map((location: any) => ({
        location: location.location,
        count: parseInt(location.count, 10)
      }));
    } catch (error) {
      logger.error('Error fetching top locations:', error);
      throw error;
    }
  }

  /**
   * Get incident trends over time
   */
  static async getIncidentTrends(days: number = 30) {
    try {
      const dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - days);

      const trends = await IncidentReport.findAll({
        where: {
          occurredAt: {
            [Op.gte]: dateFrom
          }
        },
        attributes: [
          [sequelize.fn('DATE', sequelize.col('occurredAt')), 'date'],
          'severity',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: [sequelize.literal('DATE(occurredAt)'), 'severity'],
        order: [['date', 'ASC']],
        raw: true
      });

      // Fill in missing dates with zero counts
      const trendMap: Record<string, any> = {};
      const currentDate = new Date(dateFrom);
      
      while (currentDate <= new Date()) {
        const dateStr = currentDate.toISOString().split('T')[0];
        trendMap[dateStr] = {
          date: dateStr,
          LOW: 0,
          MEDIUM: 0,
          HIGH: 0,
          CRITICAL: 0,
          total: 0
        };
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Populate actual data
      trends.forEach((trend: any) => {
        if (trendMap[trend.date]) {
          const count = parseInt(trend.count, 10);
          trendMap[trend.date][trend.severity] = count;
          trendMap[trend.date].total += count;
        }
      });

      return Object.values(trendMap);
    } catch (error) {
      logger.error('Error fetching incident trends:', error);
      throw error;
    }
  }

  /**
   * Get student incident frequency analysis
   */
  static async getStudentIncidentAnalysis(limit: number = 20) {
    try {
      const studentStats = await IncidentReport.findAll({
        attributes: [
          'studentId',
          [sequelize.fn('COUNT', sequelize.col('studentId')), 'incidentCount'],
          [sequelize.fn('MAX', sequelize.col('severity')), 'maxSeverity'],
          [sequelize.fn('MIN', sequelize.col('occurredAt')), 'firstIncident'],
          [sequelize.fn('MAX', sequelize.col('occurredAt')), 'lastIncident']
        ],
        group: ['studentId'],
        having: sequelize.literal('COUNT(studentId) > 1'), // Only students with multiple incidents
        order: [[sequelize.literal('incidentCount'), 'DESC']],
        limit,
        raw: true
      });

      return studentStats.map((stat: any) => ({
        studentId: stat.studentId,
        incidentCount: parseInt(stat.incidentCount, 10),
        maxSeverity: stat.maxSeverity,
        firstIncident: new Date(stat.firstIncident),
        lastIncident: new Date(stat.lastIncident),
        daysBetween: Math.ceil((new Date(stat.lastIncident).getTime() - new Date(stat.firstIncident).getTime()) / (1000 * 60 * 60 * 24))
      }));
    } catch (error) {
      logger.error('Error fetching student incident analysis:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive dashboard statistics
   */
  static async getDashboardStatistics() {
    try {
      const today = new Date();
      const thisWeek = new Date();
      thisWeek.setDate(today.getDate() - 7);
      const thisMonth = new Date();
      thisMonth.setDate(today.getDate() - 30);

      const [
        todayStats,
        weekStats,
        monthStats,
        pendingFollowUps,
        criticalIncidents,
        parentNotificationRate
      ] = await Promise.all([
        this.getIncidentStatistics(today, today),
        this.getIncidentStatistics(thisWeek, today),
        this.getIncidentStatistics(thisMonth, today),
        IncidentReport.count({
          where: { followUpRequired: true }
        }),
        IncidentReport.count({
          where: { 
            severity: 'CRITICAL',
            occurredAt: {
              [Op.gte]: thisMonth
            }
          }
        }),
        IncidentReport.findAll({
          where: {
            occurredAt: {
              [Op.gte]: thisMonth
            }
          },
          attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
            [sequelize.fn('SUM', sequelize.literal('CASE WHEN parentNotified = true THEN 1 ELSE 0 END')), 'notified']
          ],
          raw: true
        })
      ]);

      const notificationData = parentNotificationRate[0] as any;
      const notificationRate = notificationData.total > 0 
        ? (parseInt(notificationData.notified) / parseInt(notificationData.total)) * 100 
        : 0;

      return {
        today: todayStats,
        thisWeek: weekStats,
        thisMonth: monthStats,
        pendingFollowUps,
        criticalIncidents,
        parentNotificationRate: Math.round(notificationRate * 100) / 100,
        alerts: {
          highPriorityIncidents: criticalIncidents,
          pendingActions: pendingFollowUps,
          lowNotificationRate: notificationRate < 80
        }
      };
    } catch (error) {
      logger.error('Error fetching dashboard statistics:', error);
      throw error;
    }
  }

  /**
   * Export statistics to structured format
   */
  static async exportStatistics(dateFrom: Date, dateTo: Date) {
    try {
      const [
        overallStats,
        periodicStats,
        topLocations,
        studentAnalysis,
        trends
      ] = await Promise.all([
        this.getIncidentStatistics(dateFrom, dateTo),
        this.getStatisticsByPeriod('daily', dateFrom, dateTo),
        this.getTopLocations(20, dateFrom, dateTo),
        this.getStudentIncidentAnalysis(50),
        this.getIncidentTrends(Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24)))
      ]);

      return {
        exportDate: new Date(),
        period: {
          from: dateFrom,
          to: dateTo
        },
        summary: overallStats,
        dailyBreakdown: periodicStats,
        locationAnalysis: topLocations,
        studentAnalysis,
        trends,
        metadata: {
          totalRecords: overallStats.total,
          analysisMethod: 'comprehensive',
          dataQuality: 'verified'
        }
      };
    } catch (error) {
      logger.error('Error exporting statistics:', error);
      throw error;
    }
  }
}
