import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';
import { IncidentReport } from '../../incident-report/entities/incident-report.entity';
import { IncidentStatisticsReport } from '../interfaces/report-types.interface';
import { IncidentStatisticsDto } from '../dto/incident-statistics.dto';

/**
 * Incident Reports Service
 * Handles incident statistics, safety analytics, and compliance monitoring
 */
@Injectable()
export class IncidentReportsService {
  private readonly logger = new Logger(IncidentReportsService.name);

  constructor(
    @InjectRepository(IncidentReport)
    private incidentReportRepository: Repository<IncidentReport>,
    @InjectDataSource()
    private dataSource: DataSource,
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
        if (startDate) whereClause.occurredAt = Between(startDate, endDate || new Date());
      }

      if (incidentType) {
        whereClause.type = incidentType;
      }

      if (severity) {
        whereClause.severity = severity;
      }

      // Get incident reports with student details
      const incidents = await this.incidentReportRepository.find({
        where: whereClause,
        relations: ['student', 'reportedBy'],
        order: { occurredAt: 'DESC' },
      });

      // Group by type
      const incidentsByTypeRaw = await this.incidentReportRepository
        .createQueryBuilder('ir')
        .select('ir.type', 'type')
        .addSelect('COUNT(ir.id)', 'count')
        .where(whereClause)
        .groupBy('ir.type')
        .getRawMany();

      const incidentsByType = incidentsByTypeRaw.map((record: any) => ({
        type: record.type,
        count: parseInt(record.count, 10),
      }));

      // Group by severity
      const incidentsBySeverityRaw = await this.incidentReportRepository
        .createQueryBuilder('ir')
        .select('ir.severity', 'severity')
        .addSelect('COUNT(ir.id)', 'count')
        .where(whereClause)
        .groupBy('ir.severity')
        .getRawMany();

      const incidentsBySeverity = incidentsBySeverityRaw.map((record: any) => ({
        severity: record.severity,
        count: parseInt(record.count, 10),
      }));

      // Get incidents by month
      const defaultStartDate =
        startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      const defaultEndDate = endDate || new Date();

      const incidentsByMonthRaw = await this.dataSource.query(
        `SELECT
          DATE_TRUNC('month', "occurredAt") as month,
          type,
          COUNT(*)::integer as count
        FROM incident_reports
        WHERE "occurredAt" >= $1
          AND "occurredAt" <= $2
        GROUP BY month, type
        ORDER BY month DESC`,
        [defaultStartDate, defaultEndDate],
      );

      const incidentsByMonth = incidentsByMonthRaw.map((record: any) => ({
        month: new Date(record.month),
        type: record.type,
        count: parseInt(String(record.count), 10),
      }));

      // Get injury types distribution (type + severity)
      const injuryStatsRaw = await this.incidentReportRepository
        .createQueryBuilder('ir')
        .select('ir.type', 'type')
        .addSelect('ir.severity', 'severity')
        .addSelect('COUNT(ir.id)', 'count')
        .where(whereClause)
        .groupBy('ir.type')
        .addGroupBy('ir.severity')
        .getRawMany();

      const injuryStats = injuryStatsRaw.map((record: any) => ({
        type: record.type,
        severity: record.severity,
        count: parseInt(record.count, 10),
      }));

      // Get parent notification rate
      const notificationStatsRaw = await this.incidentReportRepository
        .createQueryBuilder('ir')
        .select('ir.parentNotified', 'parentNotified')
        .addSelect('COUNT(ir.id)', 'count')
        .where(whereClause)
        .groupBy('ir.parentNotified')
        .getRawMany();

      const notificationStats = notificationStatsRaw.map((record: any) => ({
        parentNotified: record.parentNotified as boolean,
        count: parseInt(record.count, 10),
      }));

      // Safety compliance metrics
      const complianceStatsRaw = await this.incidentReportRepository
        .createQueryBuilder('ir')
        .select('ir.legalComplianceStatus', 'legalComplianceStatus')
        .addSelect('COUNT(ir.id)', 'count')
        .where(whereClause)
        .groupBy('ir.legalComplianceStatus')
        .getRawMany();

      const complianceStats = complianceStatsRaw.map((record: any) => ({
        legalComplianceStatus: record.legalComplianceStatus,
        count: parseInt(record.count, 10),
      }));

      this.logger.log(
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
      this.logger.error('Error getting incident statistics:', error);
      throw error;
    }
  }
}
