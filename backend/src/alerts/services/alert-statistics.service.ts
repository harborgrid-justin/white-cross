/**
 * @fileoverview Alert Statistics Service
 * @module alerts/services
 * @description Handles alert statistics and reporting
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Alert } from '@/database';
import { Op } from 'sequelize';

import { BaseService } from '@/common/base';
export interface AlertStatistics {
  totalAlerts: number;
  bySeverity: Record<string, number>;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
  averageAcknowledgmentTime: number; // minutes
  averageResolutionTime: number; // minutes
  unacknowledgedCritical: number;
  escalatedAlerts: number;
}

@Injectable()
export class AlertStatisticsService extends BaseService {
  constructor(
    @InjectModel(Alert)
    private readonly alertModel: typeof Alert,
  ) {}

  /**
   * Get alert statistics
   */
  async getAlertStatistics(filters?: any): Promise<AlertStatistics> {
    this.logInfo('Calculating alert statistics');

    const where: any = {};
    if (filters) {
      if (filters.schoolId) where.schoolId = filters.schoolId;
      if (filters.startDate) where.createdAt = { [Op.gte]: filters.startDate };
      if (filters.endDate)
        where.createdAt = { ...where.createdAt, [Op.lte]: filters.endDate };
    }

    const alerts = await this.alertModel.findAll({ where });

    const stats: AlertStatistics = {
      totalAlerts: alerts.length,
      bySeverity: {},
      byCategory: {},
      byStatus: {},
      averageAcknowledgmentTime: 0,
      averageResolutionTime: 0,
      unacknowledgedCritical: 0,
      escalatedAlerts: 0,
    };

    let totalAckTime = 0;
    let ackCount = 0;
    let totalResTime = 0;
    let resCount = 0;

    for (const alert of alerts) {
      // Count by severity
      stats.bySeverity[alert.severity] =
        (stats.bySeverity[alert.severity] || 0) + 1;

      // Count by category
      stats.byCategory[alert.category] =
        (stats.byCategory[alert.category] || 0) + 1;

      // Count by status
      stats.byStatus[alert.status] = (stats.byStatus[alert.status] || 0) + 1;

      // Calculate acknowledgment time
      if (alert.acknowledgedAt && alert.createdAt) {
        const ackTime =
          (alert.acknowledgedAt.getTime() - alert.createdAt.getTime()) / 60000; // minutes
        totalAckTime += ackTime;
        ackCount++;
      }

      // Calculate resolution time
      if (alert.resolvedAt && alert.createdAt) {
        const resTime =
          (alert.resolvedAt.getTime() - alert.createdAt.getTime()) / 60000; // minutes
        totalResTime += resTime;
        resCount++;
      }

      // Count unacknowledged critical
      if (
        !alert.acknowledgedAt &&
        (alert.severity === 'CRITICAL' || alert.severity === 'EMERGENCY')
      ) {
        stats.unacknowledgedCritical++;
      }

      // Count escalated
      if (alert.escalationLevel && alert.escalationLevel > 0) {
        stats.escalatedAlerts++;
      }
    }

    stats.averageAcknowledgmentTime =
      ackCount > 0 ? totalAckTime / ackCount : 0;
    stats.averageResolutionTime = resCount > 0 ? totalResTime / resCount : 0;

    return stats;
  }

  /**
   * Get alert count by severity for a specific time period
   */
  async getAlertCountBySeverity(
    startDate: Date,
    endDate: Date,
    schoolId?: string,
  ): Promise<Record<string, number>> {
    const where: any = {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    };

    if (schoolId) {
      where.schoolId = schoolId;
    }

    const alerts = await this.alertModel.findAll({
      where,
      attributes: ['severity'],
    });

    const counts: Record<string, number> = {};
    for (const alert of alerts) {
      counts[alert.severity] = (counts[alert.severity] || 0) + 1;
    }

    return counts;
  }

  /**
   * Get alert count by category for a specific time period
   */
  async getAlertCountByCategory(
    startDate: Date,
    endDate: Date,
    schoolId?: string,
  ): Promise<Record<string, number>> {
    const where: any = {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    };

    if (schoolId) {
      where.schoolId = schoolId;
    }

    const alerts = await this.alertModel.findAll({
      where,
      attributes: ['category'],
    });

    const counts: Record<string, number> = {};
    for (const alert of alerts) {
      counts[alert.category] = (counts[alert.category] || 0) + 1;
    }

    return counts;
  }

  /**
   * Get alert resolution metrics
   */
  async getResolutionMetrics(
    startDate: Date,
    endDate: Date,
    schoolId?: string,
  ): Promise<{
    totalAlerts: number;
    resolvedAlerts: number;
    averageResolutionTime: number;
    resolutionRate: number;
  }> {
    const where: any = {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    };

    if (schoolId) {
      where.schoolId = schoolId;
    }

    const alerts = await this.alertModel.findAll({ where });
    const resolvedAlerts = alerts.filter((alert) => alert.resolvedAt);

    let totalResolutionTime = 0;
    for (const alert of resolvedAlerts) {
      if (alert.resolvedAt && alert.createdAt) {
        totalResolutionTime +=
          (alert.resolvedAt.getTime() - alert.createdAt.getTime()) / 60000; // minutes
      }
    }

    const averageResolutionTime =
      resolvedAlerts.length > 0 ? totalResolutionTime / resolvedAlerts.length : 0;

    const resolutionRate =
      alerts.length > 0 ? (resolvedAlerts.length / alerts.length) * 100 : 0;

    return {
      totalAlerts: alerts.length,
      resolvedAlerts: resolvedAlerts.length,
      averageResolutionTime,
      resolutionRate,
    };
  }

  /**
   * Get escalation statistics
   */
  async getEscalationStatistics(
    startDate: Date,
    endDate: Date,
    schoolId?: string,
  ): Promise<{
    totalAlerts: number;
    escalatedAlerts: number;
    escalationRate: number;
    averageEscalationLevel: number;
  }> {
    const where: any = {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    };

    if (schoolId) {
      where.schoolId = schoolId;
    }

    const alerts = await this.alertModel.findAll({ where });
    const escalatedAlerts = alerts.filter(
      (alert) => alert.escalationLevel && alert.escalationLevel > 0,
    );

    let totalEscalationLevel = 0;
    for (const alert of escalatedAlerts) {
      totalEscalationLevel += alert.escalationLevel || 0;
    }

    const averageEscalationLevel =
      escalatedAlerts.length > 0 ? totalEscalationLevel / escalatedAlerts.length : 0;

    const escalationRate =
      alerts.length > 0 ? (escalatedAlerts.length / alerts.length) * 100 : 0;

    return {
      totalAlerts: alerts.length,
      escalatedAlerts: escalatedAlerts.length,
      escalationRate,
      averageEscalationLevel,
    };
  }

  /**
   * Get daily alert trends
   */
  async getDailyAlertTrends(
    startDate: Date,
    endDate: Date,
    schoolId?: string,
  ): Promise<Array<{ date: string; count: number; severity: Record<string, number> }>> {
    const where: any = {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    };

    if (schoolId) {
      where.schoolId = schoolId;
    }

    const alerts = await this.alertModel.findAll({
      where,
      attributes: ['createdAt', 'severity'],
      order: [['createdAt', 'ASC']],
    });

    const dailyData: Record<string, { count: number; severity: Record<string, number> }> = {};

    for (const alert of alerts) {
      const date = alert.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD

      if (!dailyData[date]) {
        dailyData[date] = { count: 0, severity: {} };
      }

      dailyData[date].count++;
      dailyData[date].severity[alert.severity] =
        (dailyData[date].severity[alert.severity] || 0) + 1;
    }

    return Object.entries(dailyData).map(([date, data]) => ({
      date,
      count: data.count,
      severity: data.severity,
    }));
  }
}
