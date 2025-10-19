/**
 * LOC: 1EB0403DEC
 * WC-GEN-295 | incidentReports.ts - Incident statistics and safety analytics
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - models (database/models)
 *   - types.ts (services/report/types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/report/index.ts)
 */

/**
 * WC-GEN-295 | incidentReports.ts - Incident statistics and safety analytics
 * Purpose: Generate comprehensive incident statistics, safety analytics, and compliance tracking
 * Upstream: ../utils/logger, ../database/models, ./types | Dependencies: sequelize
 * Downstream: Report service index | Called by: ReportService
 * Related: Incident reports, student safety, compliance monitoring
 * Exports: IncidentReportsModule | Key Services: Incident analytics and safety compliance
 * Last Updated: 2025-10-19 | File Type: .ts
 * Critical Path: Query execution → Statistical analysis → Safety report generation
 * LLM Context: Safety incident tracking and regulatory compliance for school healthcare
 */

import { Op, fn, col, QueryTypes } from 'sequelize';
import { logger } from '../../utils/logger';
import {
  sequelize,
  IncidentReport,
  Student,
  User
} from '../../database/models';
import {
  IncidentType,
  IncidentSeverity,
  ComplianceStatus
} from '../../database/types/enums';
import { IncidentStatisticsReport } from './types';

/**
 * Incident Reports Module
 * Handles incident statistics, safety analytics, and compliance monitoring
 */
export class IncidentReportsModule {
  /**
   * Generate comprehensive incident statistics and safety analytics
   * @param startDate - Optional start date for filtering
   * @param endDate - Optional end date for filtering
   * @returns Detailed incident statistics and safety metrics
   * @throws Error if database query fails
   */
  static async getIncidentStatistics(startDate?: Date, endDate?: Date): Promise<IncidentStatisticsReport> {
    try {
      const whereClause: any = {};

      if (startDate || endDate) {
        whereClause.occurredAt = {};
        if (startDate) whereClause.occurredAt[Op.gte] = startDate;
        if (endDate) whereClause.occurredAt[Op.lte] = endDate;
      }

      // Get incident reports with student details
      const incidents = await IncidentReport.findAll({
        where: whereClause,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          },
          {
            model: User,
            as: 'reportedBy',
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        order: [['occurredAt', 'DESC']]
      });

      // Group by type
      const incidentsByTypeRaw = await IncidentReport.findAll({
        where: whereClause,
        attributes: [
          'type',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['type'],
        raw: true
      });

      const incidentsByType = incidentsByTypeRaw.map((record: any) => ({
        type: record.type as IncidentType,
        count: parseInt(record.count, 10)
      }));

      // Group by severity
      const incidentsBySeverityRaw = await IncidentReport.findAll({
        where: whereClause,
        attributes: [
          'severity',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['severity'],
        raw: true
      });

      const incidentsBySeverity = incidentsBySeverityRaw.map((record: any) => ({
        severity: record.severity as IncidentSeverity,
        count: parseInt(record.count, 10)
      }));

      // Get incidents by month
      const defaultStartDate = startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      const defaultEndDate = endDate || new Date();

      const incidentsByMonthRaw = await sequelize.query<{
        month: Date;
        type: IncidentType;
        count: number;
      }>(
        `SELECT
          DATE_TRUNC('month', "occurredAt") as month,
          type,
          COUNT(*)::integer as count
        FROM incident_reports
        WHERE "occurredAt" >= :startDate
          AND "occurredAt" <= :endDate
        GROUP BY month, type
        ORDER BY month DESC`,
        {
          replacements: {
            startDate: defaultStartDate,
            endDate: defaultEndDate
          },
          type: QueryTypes.SELECT
        }
      );

      const incidentsByMonth = incidentsByMonthRaw.map(record => ({
        month: new Date(record.month),
        type: record.type,
        count: parseInt(String(record.count), 10)
      }));

      // Get injury types distribution (type + severity)
      const injuryStatsRaw = await IncidentReport.findAll({
        where: whereClause,
        attributes: [
          'type',
          'severity',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['type', 'severity'],
        raw: true
      });

      const injuryStats = injuryStatsRaw.map((record: any) => ({
        type: record.type as IncidentType,
        severity: record.severity as IncidentSeverity,
        count: parseInt(record.count, 10)
      }));

      // Get parent notification rate
      const notificationStatsRaw = await IncidentReport.findAll({
        where: whereClause,
        attributes: [
          'parentNotified',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['parentNotified'],
        raw: true
      });

      const notificationStats = notificationStatsRaw.map((record: any) => ({
        parentNotified: record.parentNotified as boolean,
        count: parseInt(record.count, 10)
      }));

      // Safety compliance metrics
      const complianceStatsRaw = await IncidentReport.findAll({
        where: whereClause,
        attributes: [
          'legalComplianceStatus',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['legalComplianceStatus'],
        raw: true
      });

      const complianceStats = complianceStatsRaw.map((record: any) => ({
        legalComplianceStatus: record.legalComplianceStatus as ComplianceStatus,
        count: parseInt(record.count, 10)
      }));

      logger.info(`Incident statistics report generated: ${incidents.length} total incidents, ${incidentsByType.length} types, ${incidentsBySeverity.length} severity levels`);

      return {
        incidents,
        incidentsByType,
        incidentsBySeverity,
        incidentsByMonth,
        injuryStats,
        notificationStats,
        complianceStats,
        totalIncidents: incidents.length
      };
    } catch (error) {
      logger.error('Error getting incident statistics:', error);
      throw error;
    }
  }
}
