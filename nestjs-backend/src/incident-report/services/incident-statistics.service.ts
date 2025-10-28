import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { IncidentReport } from '../entities/incident-report.entity';
import { IncidentType, IncidentSeverity } from '../enums';

@Injectable()
export class IncidentStatisticsService {
  private readonly logger = new Logger(IncidentStatisticsService.name);

  constructor(
    @InjectRepository(IncidentReport)
    private incidentReportRepository: Repository<IncidentReport>,
  ) {}

  /**
   * Get comprehensive incident statistics
   */
  async getIncidentStatistics(
    dateFrom?: Date,
    dateTo?: Date,
    studentId?: string,
  ) {
    try {
      const where: any = {};

      if (studentId) {
        where.studentId = studentId;
      }

      if (dateFrom && dateTo) {
        where.occurredAt = Between(dateFrom, dateTo);
      } else if (dateFrom) {
        where.occurredAt = MoreThanOrEqual(dateFrom);
      } else if (dateTo) {
        where.occurredAt = LessThanOrEqual(dateTo);
      }

      const reports = await this.incidentReportRepository.find({
        where,
        select: [
          'id',
          'type',
          'severity',
          'location',
          'parentNotified',
          'followUpRequired',
          'occurredAt',
          'createdAt',
        ],
      });

      const total = reports.length;

      // Group by type
      const byType: Record<string, number> = {};
      Object.values(IncidentType).forEach((type) => {
        byType[type] = 0;
      });
      reports.forEach((report) => {
        byType[report.type] = (byType[report.type] || 0) + 1;
      });

      // Group by severity
      const bySeverity: Record<string, number> = {};
      Object.values(IncidentSeverity).forEach((severity) => {
        bySeverity[severity] = 0;
      });
      reports.forEach((report) => {
        bySeverity[report.severity] = (bySeverity[report.severity] || 0) + 1;
      });

      // Group by location
      const byLocation: Record<string, number> = {};
      reports.forEach((report) => {
        byLocation[report.location] = (byLocation[report.location] || 0) + 1;
      });

      // Parent notification rate
      const parentNotifiedCount = reports.filter((r) => r.parentNotified).length;
      const parentNotificationRate = total > 0 ? (parentNotifiedCount / total) * 100 : 0;

      // Follow-up rate
      const followUpCount = reports.filter((r) => r.followUpRequired).length;
      const followUpRate = total > 0 ? (followUpCount / total) * 100 : 0;

      // Average response time (time between incident and report creation)
      let totalResponseTime = 0;
      reports.forEach((report) => {
        const responseTime =
          new Date(report.createdAt).getTime() - new Date(report.occurredAt).getTime();
        totalResponseTime += responseTime;
      });
      const averageResponseTime =
        total > 0 ? totalResponseTime / total / (1000 * 60) : 0; // in minutes

      return {
        total,
        byType,
        bySeverity,
        byLocation,
        parentNotificationRate,
        followUpRate,
        averageResponseTime: Math.round(averageResponseTime),
      };
    } catch (error) {
      this.logger.error('Error fetching incident statistics:', error);
      throw error;
    }
  }

  /**
   * Get incidents by type
   */
  async getIncidentsByType(dateFrom?: Date, dateTo?: Date) {
    try {
      const where: any = {};

      if (dateFrom && dateTo) {
        where.occurredAt = Between(dateFrom, dateTo);
      } else if (dateFrom) {
        where.occurredAt = MoreThanOrEqual(dateFrom);
      } else if (dateTo) {
        where.occurredAt = LessThanOrEqual(dateTo);
      }

      const reports = await this.incidentReportRepository.find({
        where,
        select: ['id', 'type'],
      });

      const byType: Record<string, number> = {};
      Object.values(IncidentType).forEach((type) => {
        byType[type] = 0;
      });

      reports.forEach((report) => {
        byType[report.type] = (byType[report.type] || 0) + 1;
      });

      return byType;
    } catch (error) {
      this.logger.error('Error fetching incidents by type:', error);
      throw error;
    }
  }

  /**
   * Get incidents by severity
   */
  async getIncidentsBySeverity(dateFrom?: Date, dateTo?: Date) {
    try {
      const where: any = {};

      if (dateFrom && dateTo) {
        where.occurredAt = Between(dateFrom, dateTo);
      } else if (dateFrom) {
        where.occurredAt = MoreThanOrEqual(dateFrom);
      } else if (dateTo) {
        where.occurredAt = LessThanOrEqual(dateTo);
      }

      const reports = await this.incidentReportRepository.find({
        where,
        select: ['id', 'severity'],
      });

      const bySeverity: Record<string, number> = {};
      Object.values(IncidentSeverity).forEach((severity) => {
        bySeverity[severity] = 0;
      });

      reports.forEach((report) => {
        bySeverity[report.severity] = (bySeverity[report.severity] || 0) + 1;
      });

      return bySeverity;
    } catch (error) {
      this.logger.error('Error fetching incidents by severity:', error);
      throw error;
    }
  }

  /**
   * Get severity trends over time
   */
  async getSeverityTrends(dateFrom: Date, dateTo: Date) {
    try {
      const reports = await this.incidentReportRepository.find({
        where: {
          occurredAt: Between(dateFrom, dateTo),
        },
        select: ['id', 'severity', 'occurredAt'],
        order: { occurredAt: 'ASC' },
      });

      // Group by month and severity
      const trendsByMonth: Record<string, Record<string, number>> = {};

      reports.forEach((report) => {
        const month = new Date(report.occurredAt).toISOString().substring(0, 7); // YYYY-MM
        if (!trendsByMonth[month]) {
          trendsByMonth[month] = {};
          Object.values(IncidentSeverity).forEach((severity) => {
            trendsByMonth[month][severity] = 0;
          });
        }
        trendsByMonth[month][report.severity] += 1;
      });

      return trendsByMonth;
    } catch (error) {
      this.logger.error('Error fetching severity trends:', error);
      throw error;
    }
  }
}
