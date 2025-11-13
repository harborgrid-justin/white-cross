import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { col, fn, Op, QueryTypes } from 'sequelize';
import { IncidentReport } from '../../database/models/incident-report.model';
import { IncidentStatisticsReport } from '../interfaces/report-types.interface';
import { IncidentStatisticsDto } from '../dto/incident-statistics.dto';

import { BaseService } from '../../common/base';
/**
 * Incident Reports Service
 * Handles incident statistics, safety analytics, and compliance monitoring
 */
@Injectable()
export class IncidentReportsService extends BaseService {
  constructor(
    @InjectModel(IncidentReport)
    private incidentReportModel: typeof IncidentReport,
    @InjectConnection()
    private sequelize: Sequelize,
  ) {}

  /**
   * Generate comprehensive incident statistics and safety analytics
   */
  async getIncidentStatistics(
    dto: IncidentStatisticsDto,
  ): Promise<IncidentStatisticsReport> {
    try {
      const { startDate, endDate, incidentType, severity } = dto;
      const whereClause: any = {};

      if (startDate || endDate) {
        whereClause.occurredAt = {};
        if (startDate && endDate) {
          whereClause.occurredAt = { [Op.between]: [startDate, endDate] };
        } else if (startDate) {
          whereClause.occurredAt = { [Op.gte]: startDate };
        } else if (endDate) {
          whereClause.occurredAt = { [Op.lte]: endDate };
        }
      }

      if (incidentType) {
        whereClause.type = incidentType;
      }

      if (severity) {
        whereClause.severity = severity;
      }

      // Get incident reports with student details
      const incidents = await this.incidentReportModel.findAll({
        where: whereClause,
        include: ['student', 'reportedBy'],
        order: [['occurredAt', 'DESC']],
      });

      // Group by type
      const incidentsByTypeRaw = await this.incidentReportModel.findAll({
        where: whereClause,
        attributes: ['type', [fn('COUNT', col('id')), 'count']],
        group: ['type'],
        raw: true,
      });

      const incidentsByType = incidentsByTypeRaw.map((record: any) => ({
        type: record.type,
        count: parseInt(record.count, 10),
      }));

      // Group by severity
      const incidentsBySeverityRaw = await this.incidentReportModel.findAll({
        where: whereClause,
        attributes: ['severity', [fn('COUNT', col('id')), 'count']],
        group: ['severity'],
        raw: true,
      });

      const incidentsBySeverity = incidentsBySeverityRaw.map((record: any) => ({
        severity: record.severity,
        count: parseInt(record.count, 10),
      }));

      // Get incidents by month
      const defaultStartDate =
        startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      const defaultEndDate = endDate || new Date();

      const incidentsByMonthRaw = await this.sequelize.query(
        `SELECT
          DATE_TRUNC('month', "occurredAt") as month,
          type,
          COUNT(*)::integer as count
        FROM incident_reports
        WHERE "occurredAt" >= $1
          AND "occurredAt" <= $2
        GROUP BY month, type
        ORDER BY month DESC`,
        {
          bind: [defaultStartDate, defaultEndDate],
          type: QueryTypes.SELECT,
        },
      );

      const incidentsByMonth = incidentsByMonthRaw.map((record: any) => ({
        month: new Date(record.month),
        type: record.type,
        count: parseInt(String(record.count), 10),
      }));

      // Get injury types distribution (type + severity)
      const injuryStatsRaw = await this.incidentReportModel.findAll({
        where: whereClause,
        attributes: ['type', 'severity', [fn('COUNT', col('id')), 'count']],
        group: ['type', 'severity'],
        raw: true,
      });

      const injuryStats = injuryStatsRaw.map((record: any) => ({
        type: record.type,
        severity: record.severity,
        count: parseInt(record.count, 10),
      }));

      // Get parent notification rate
      const notificationStatsRaw = await this.incidentReportModel.findAll({
        where: whereClause,
        attributes: ['parentNotified', [fn('COUNT', col('id')), 'count']],
        group: ['parentNotified'],
        raw: true,
      });

      const notificationStats = notificationStatsRaw.map((record: any) => ({
        parentNotified: record.parentNotified as boolean,
        count: parseInt(record.count, 10),
      }));

      // Safety compliance metrics
      const complianceStatsRaw = await this.incidentReportModel.findAll({
        where: whereClause,
        attributes: [
          'legalComplianceStatus',
          [fn('COUNT', col('id')), 'count'],
        ],
        group: ['legalComplianceStatus'],
        raw: true,
      });

      const complianceStats = complianceStatsRaw.map((record: any) => ({
        legalComplianceStatus: record.legalComplianceStatus,
        count: parseInt(record.count, 10),
      }));

      this.logInfo(
        `Incident statistics report generated: ${incidents.length} total incidents, ${incidentsByType.length} types, ${incidentsBySeverity.length} severity levels`,
      );

      return {
        incidents,
        incidentsByType,
        incidentsBySeverity,
        incidentsByMonth,
        injuryStats,
        notificationStats,
        complianceStats,
        totalIncidents: incidents.length,
      };
    } catch (error) {
      this.logError('Error getting incident statistics:', error);
      throw error;
    }
  }
}
