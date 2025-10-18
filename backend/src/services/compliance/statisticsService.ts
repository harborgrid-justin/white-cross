/**
 * WC-GEN-242 | statisticsService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ../../database/types/enums | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import {
  ComplianceReport,
  ComplianceChecklistItem
} from '../../database/models';
import {
  ComplianceStatus,
  ChecklistItemStatus
} from '../../database/types/enums';
import { ComplianceStatistics } from './types';

export class StatisticsService {
  /**
   * Get compliance statistics
   */
  static async getComplianceStatistics(period?: string): Promise<ComplianceStatistics> {
    try {
      const whereClause: any = {};
      if (period) {
        whereClause.period = period;
      }

      const [
        totalReports,
        compliantReports,
        pendingReports,
        nonCompliantReports,
        totalChecklistItems,
        completedItems,
        overdueItems
      ] = await Promise.all([
        ComplianceReport.count({ where: whereClause }),
        ComplianceReport.count({
          where: { ...whereClause, status: ComplianceStatus.COMPLIANT }
        }),
        ComplianceReport.count({
          where: { ...whereClause, status: ComplianceStatus.PENDING }
        }),
        ComplianceReport.count({
          where: { ...whereClause, status: ComplianceStatus.NON_COMPLIANT }
        }),
        ComplianceChecklistItem.count(),
        ComplianceChecklistItem.count({
          where: { status: ChecklistItemStatus.COMPLETED }
        }),
        ComplianceChecklistItem.count({
          where: {
            status: {
              [Op.ne]: ChecklistItemStatus.COMPLETED
            },
            dueDate: {
              [Op.lt]: new Date()
            }
          }
        })
      ]);

      const statistics: ComplianceStatistics = {
        reports: {
          total: totalReports,
          compliant: compliantReports,
          pending: pendingReports,
          nonCompliant: nonCompliantReports
        },
        checklistItems: {
          total: totalChecklistItems,
          completed: completedItems,
          overdue: overdueItems,
          completionRate:
            totalChecklistItems > 0
              ? Math.round((completedItems / totalChecklistItems) * 100)
              : 0
        }
      };

      logger.info('Retrieved compliance statistics');
      return statistics;
    } catch (error) {
      logger.error('Error getting compliance statistics:', error);
      throw new Error('Failed to fetch compliance statistics');
    }
  }

  /**
   * Get detailed compliance metrics by report type
   */
  static async getComplianceMetricsByType(): Promise<{
    [reportType: string]: {
      total: number;
      compliant: number;
      pending: number;
      nonCompliant: number;
      completionRate: number;
    };
  }> {
    try {
      const reports = await ComplianceReport.findAll({
        attributes: ['reportType', 'status'],
        raw: true
      });

      const metrics: { [key: string]: any } = {};

      reports.forEach((report: any) => {
        const type = report.reportType;
        if (!metrics[type]) {
          metrics[type] = {
            total: 0,
            compliant: 0,
            pending: 0,
            nonCompliant: 0,
            completionRate: 0
          };
        }

        metrics[type].total++;
        switch (report.status) {
          case ComplianceStatus.COMPLIANT:
            metrics[type].compliant++;
            break;
          case ComplianceStatus.PENDING:
            metrics[type].pending++;
            break;
          case ComplianceStatus.NON_COMPLIANT:
            metrics[type].nonCompliant++;
            break;
        }
      });

      // Calculate completion rates
      Object.keys(metrics).forEach(type => {
        const metric = metrics[type];
        metric.completionRate = metric.total > 0 
          ? Math.round((metric.compliant / metric.total) * 100)
          : 0;
      });

      logger.info(`Retrieved compliance metrics for ${Object.keys(metrics).length} report types`);
      return metrics;
    } catch (error) {
      logger.error('Error getting compliance metrics by type:', error);
      throw error;
    }
  }

  /**
   * Get compliance trends over time
   */
  static async getComplianceTrends(
    startDate: Date,
    endDate: Date
  ): Promise<{
    daily: { date: string; compliant: number; pending: number; nonCompliant: number }[];
    monthly: { month: string; compliant: number; pending: number; nonCompliant: number }[];
  }> {
    try {
      const reports = await ComplianceReport.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        },
        attributes: ['status', 'createdAt'],
        order: [['createdAt', 'ASC']],
        raw: true
      });

      const dailyTrends: { [key: string]: any } = {};
      const monthlyTrends: { [key: string]: any } = {};

      reports.forEach((report: any) => {
        const date = report.createdAt.toISOString().split('T')[0];
        const month = report.createdAt.toISOString().substring(0, 7); // YYYY-MM

        // Daily trends
        if (!dailyTrends[date]) {
          dailyTrends[date] = { date, compliant: 0, pending: 0, nonCompliant: 0 };
        }
        switch (report.status) {
          case ComplianceStatus.COMPLIANT:
            dailyTrends[date].compliant++;
            break;
          case ComplianceStatus.PENDING:
            dailyTrends[date].pending++;
            break;
          case ComplianceStatus.NON_COMPLIANT:
            dailyTrends[date].nonCompliant++;
            break;
        }

        // Monthly trends
        if (!monthlyTrends[month]) {
          monthlyTrends[month] = { month, compliant: 0, pending: 0, nonCompliant: 0 };
        }
        switch (report.status) {
          case ComplianceStatus.COMPLIANT:
            monthlyTrends[month].compliant++;
            break;
          case ComplianceStatus.PENDING:
            monthlyTrends[month].pending++;
            break;
          case ComplianceStatus.NON_COMPLIANT:
            monthlyTrends[month].nonCompliant++;
            break;
        }
      });

      const daily = Object.values(dailyTrends).sort((a: any, b: any) => 
        a.date.localeCompare(b.date)
      );
      const monthly = Object.values(monthlyTrends).sort((a: any, b: any) => 
        a.month.localeCompare(b.month)
      );

      logger.info(`Retrieved compliance trends: ${daily.length} daily points, ${monthly.length} monthly points`);
      return { daily, monthly };
    } catch (error) {
      logger.error('Error getting compliance trends:', error);
      throw error;
    }
  }

  /**
   * Get checklist completion statistics by category
   */
  static async getChecklistStatsByCategory(): Promise<{
    [category: string]: {
      total: number;
      completed: number;
      pending: number;
      overdue: number;
      completionRate: number;
    };
  }> {
    try {
      const items = await ComplianceChecklistItem.findAll({
        attributes: ['category', 'status', 'dueDate'],
        raw: true
      });

      const stats: { [key: string]: any } = {};
      const now = new Date();

      items.forEach((item: any) => {
        const category = item.category;
        if (!stats[category]) {
          stats[category] = {
            total: 0,
            completed: 0,
            pending: 0,
            overdue: 0,
            completionRate: 0
          };
        }

        stats[category].total++;

        switch (item.status) {
          case ChecklistItemStatus.COMPLETED:
            stats[category].completed++;
            break;
          case ChecklistItemStatus.PENDING:
            stats[category].pending++;
            // Check if overdue
            if (item.dueDate && new Date(item.dueDate) < now) {
              stats[category].overdue++;
            }
            break;
        }
      });

      // Calculate completion rates
      Object.keys(stats).forEach(category => {
        const stat = stats[category];
        stat.completionRate = stat.total > 0 
          ? Math.round((stat.completed / stat.total) * 100)
          : 0;
      });

      logger.info(`Retrieved checklist stats for ${Object.keys(stats).length} categories`);
      return stats;
    } catch (error) {
      logger.error('Error getting checklist stats by category:', error);
      throw error;
    }
  }

  /**
   * Get overdue items summary
   */
  static async getOverdueItemsSummary(): Promise<{
    totalOverdue: number;
    byCategory: { [category: string]: number };
    byPriority: { critical: number; high: number; medium: number; low: number };
    oldestOverdue: {
      id: string;
      requirement: string;
      dueDate: Date;
      daysOverdue: number;
    } | null;
  }> {
    try {
      const now = new Date();
      const overdueItems = await ComplianceChecklistItem.findAll({
        where: {
          status: {
            [Op.ne]: ChecklistItemStatus.COMPLETED
          },
          dueDate: {
            [Op.lt]: now
          }
        },
        attributes: ['id', 'requirement', 'category', 'dueDate'],
        order: [['dueDate', 'ASC']],
        raw: true
      });

      const byCategory: { [key: string]: number } = {};
      const byPriority = { critical: 0, high: 0, medium: 0, low: 0 };

      overdueItems.forEach((item: any) => {
        // Category breakdown
        byCategory[item.category] = (byCategory[item.category] || 0) + 1;

        // Priority breakdown based on days overdue
        const daysOverdue = Math.floor((now.getTime() - new Date(item.dueDate).getTime()) / (1000 * 60 * 60 * 24));
        if (daysOverdue > 30) {
          byPriority.critical++;
        } else if (daysOverdue > 14) {
          byPriority.high++;
        } else if (daysOverdue > 7) {
          byPriority.medium++;
        } else {
          byPriority.low++;
        }
      });

      const oldestOverdue = overdueItems.length > 0 ? {
        id: overdueItems[0].id,
        requirement: overdueItems[0].requirement,
        dueDate: overdueItems[0].dueDate,
        daysOverdue: Math.floor((now.getTime() - new Date(overdueItems[0].dueDate).getTime()) / (1000 * 60 * 60 * 24))
      } : null;

      logger.info(`Retrieved overdue items summary: ${overdueItems.length} total overdue`);
      return {
        totalOverdue: overdueItems.length,
        byCategory,
        byPriority,
        oldestOverdue
      };
    } catch (error) {
      logger.error('Error getting overdue items summary:', error);
      throw error;
    }
  }

  /**
   * Get compliance dashboard summary
   */
  static async getComplianceDashboard(): Promise<{
    overview: ComplianceStatistics;
    recentActivity: {
      reportsCreated: number;
      itemsCompleted: number;
      policiesAcknowledged: number;
    };
    alerts: {
      overdueItems: number;
      expiringSoon: number;
      criticalIssues: number;
    };
    trends: {
      complianceRate: number;
      weeklyChange: number;
    };
  }> {
    try {
      const now = new Date();
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Get overview statistics
      const overview = await this.getComplianceStatistics();

      // Get recent activity (last 7 days)
      const [reportsCreated, itemsCompleted] = await Promise.all([
        ComplianceReport.count({
          where: {
            createdAt: {
              [Op.gte]: lastWeek
            }
          }
        }),
        ComplianceChecklistItem.count({
          where: {
            status: ChecklistItemStatus.COMPLETED,
            completedAt: {
              [Op.gte]: lastWeek
            }
          }
        })
      ]);

      // Get alerts
      const [overdueItems, expiringSoon, criticalIssues] = await Promise.all([
        ComplianceChecklistItem.count({
          where: {
            status: {
              [Op.ne]: ChecklistItemStatus.COMPLETED
            },
            dueDate: {
              [Op.lt]: now
            }
          }
        }),
        ComplianceChecklistItem.count({
          where: {
            status: {
              [Op.ne]: ChecklistItemStatus.COMPLETED
            },
            dueDate: {
              [Op.gte]: now,
              [Op.lte]: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
            }
          }
        }),
        ComplianceReport.count({
          where: {
            status: ComplianceStatus.NON_COMPLIANT,
            createdAt: {
              [Op.gte]: lastMonth
            }
          }
        })
      ]);

      // Calculate trends
      const currentCompliance = overview.reports.total > 0 
        ? (overview.reports.compliant / overview.reports.total) * 100
        : 0;

      const lastWeekReports = await ComplianceReport.count({
        where: {
          createdAt: {
            [Op.gte]: new Date(lastWeek.getTime() - 7 * 24 * 60 * 60 * 1000),
            [Op.lt]: lastWeek
          }
        }
      });

      const lastWeekCompliant = await ComplianceReport.count({
        where: {
          status: ComplianceStatus.COMPLIANT,
          createdAt: {
            [Op.gte]: new Date(lastWeek.getTime() - 7 * 24 * 60 * 60 * 1000),
            [Op.lt]: lastWeek
          }
        }
      });

      const lastWeekCompliance = lastWeekReports > 0 
        ? (lastWeekCompliant / lastWeekReports) * 100
        : 0;

      const weeklyChange = currentCompliance - lastWeekCompliance;

      logger.info('Retrieved compliance dashboard summary');
      return {
        overview,
        recentActivity: {
          reportsCreated,
          itemsCompleted,
          policiesAcknowledged: 0 // Would need PolicyAcknowledgment model query
        },
        alerts: {
          overdueItems,
          expiringSoon,
          criticalIssues
        },
        trends: {
          complianceRate: Math.round(currentCompliance),
          weeklyChange: Math.round(weeklyChange * 10) / 10 // Round to 1 decimal
        }
      };
    } catch (error) {
      logger.error('Error getting compliance dashboard:', error);
      throw error;
    }
  }
}
