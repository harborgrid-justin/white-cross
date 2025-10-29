import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op, QueryTypes } from 'sequelize';
import { AuditLog } from '../../database/models/audit-log.model';
import { StudentMedication } from '../../database/models/student-medication.model';
import { IncidentReport } from '../../database/models/incident-report.model';
import { ComplianceReport } from '../interfaces/report-types.interface';
import { BaseReportDto } from '../dto/base-report.dto';

/**
 * Compliance Reports Service
 * Handles HIPAA compliance reporting and regulatory audit trails
 */
@Injectable()
export class ComplianceReportsService {
  private readonly logger = new Logger(ComplianceReportsService.name);

  constructor(
    @InjectModel(AuditLog)
    private auditLogModel: typeof AuditLog,
    @InjectModel(StudentMedication)
    private studentMedicationModel: typeof StudentMedication,
    @InjectModel(IncidentReport)
    private incidentReportModel: typeof IncidentReport,
    @Inject('SEQUELIZE')
    private sequelize: Sequelize,
  ) {}

  /**
   * Get compliance report with HIPAA and medication compliance data
   */
  async getComplianceReport(dto: BaseReportDto): Promise<ComplianceReport> {
    try {
      const { startDate, endDate } = dto;
      const whereClause: any = {};

      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate && endDate) {
          whereClause.createdAt = { [Op.between]: [startDate, endDate] };
        } else if (startDate) {
          whereClause.createdAt = { [Op.gte]: startDate };
        } else if (endDate) {
          whereClause.createdAt = { [Op.lte]: endDate };
        }
      }

      // Get HIPAA-related audit logs
      const hipaaLogs = await this.auditLogModel.findAll({
        where: {
          ...whereClause,
          action: { [Op.in]: ['VIEW', 'EXPORT', 'ACCESS'] },
        },
        order: [['createdAt', 'DESC']],
        limit: 100,
      });

      // Get medication compliance statistics
      const medicationComplianceRaw = await this.sequelize.query(
        `SELECT "isActive", COUNT("id")::integer as count FROM student_medications GROUP BY "isActive"`,
        { type: QueryTypes.SELECT },
      );

      const medicationCompliance = medicationComplianceRaw.map((record: any) => ({
        isActive: record.isActive as boolean,
        count: parseInt(record.count, 10),
      }));

      // Get incident compliance statistics
      const incidentComplianceRaw = await this.sequelize.query(
        `SELECT "legalComplianceStatus", COUNT("id")::integer as count FROM incident_reports ${startDate || endDate ? 'WHERE' : ''} ${startDate ? '"createdAt" >= $1' : ''} ${startDate && endDate ? 'AND' : ''} ${endDate && startDate ? '"createdAt" <= $2' : endDate ? '"createdAt" <= $1' : ''} GROUP BY "legalComplianceStatus"`,
        {
          bind: [startDate, endDate].filter(v => v !== undefined),
          type: QueryTypes.SELECT,
        },
      );

      const incidentCompliance = incidentComplianceRaw.map((record: any) => ({
        legalComplianceStatus: record.legalComplianceStatus,
        count: parseInt(record.count, 10),
      }));

      // Get vaccination record count
      const vaccinationRecords = await this.sequelize.query(
        `SELECT COUNT(*)::integer as count FROM vaccinations ${startDate || endDate ? 'WHERE' : ''} ${startDate ? '"createdAt" >= $1' : ''} ${startDate && endDate ? 'AND' : ''} ${endDate && startDate ? '"createdAt" <= $2' : endDate ? '"createdAt" <= $1' : ''}`,
        {
          bind: [startDate, endDate].filter(v => v !== undefined),
          type: QueryTypes.SELECT,
        },
      );

      this.logger.log('Compliance report generated successfully');

      return {
        hipaaLogs,
        medicationCompliance,
        incidentCompliance,
        vaccinationRecords: (vaccinationRecords as any)[0]?.count || 0,
      };
    } catch (error) {
      this.logger.error('Error generating compliance report:', error);
      throw error;
    }
  }
}
