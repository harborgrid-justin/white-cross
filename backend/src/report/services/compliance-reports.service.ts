import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op, QueryTypes } from 'sequelize';
import { AuditLog } from '../../database/models/audit-log.model';
import { ComplianceReport } from '../interfaces/report-types.interface';
import { BaseReportDto } from '../dto/base-report.dto';

import { BaseService } from '../../common/base';
/**
 * Compliance Reports Service
 * Handles HIPAA compliance reporting and regulatory audit trails
 */
@Injectable()
export class ComplianceReportsService extends BaseService {
  constructor(
    @InjectModel(AuditLog)
    private auditLogModel: typeof AuditLog,
    @InjectConnection()
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

      // SECURITY FIX: Query is safe (no user input), but adding explicit type for clarity
      // Get medication compliance statistics
      const medicationComplianceRaw = await this.sequelize.query(
        `SELECT "isActive", COUNT("id")::integer as count FROM student_medications GROUP BY "isActive"`,
        {
          type: QueryTypes.SELECT,
          raw: true,
        },
      );

      const medicationCompliance = medicationComplianceRaw.map((record: any) => ({
        isActive: record.isActive as boolean,
        count: parseInt(record.count, 10),
      }));

      // SECURITY FIX: Replaced complex string concatenation with proper parameterized query
      // Get incident compliance statistics
      let incidentQuery = `
        SELECT "legalComplianceStatus", COUNT("id")::integer as count
        FROM incident_reports
      `;
      const incidentReplacements: any = {};

      if (startDate && endDate) {
        incidentQuery += ' WHERE "createdAt" >= :startDate AND "createdAt" <= :endDate';
        incidentReplacements.startDate = startDate;
        incidentReplacements.endDate = endDate;
      } else if (startDate) {
        incidentQuery += ' WHERE "createdAt" >= :startDate';
        incidentReplacements.startDate = startDate;
      } else if (endDate) {
        incidentQuery += ' WHERE "createdAt" <= :endDate';
        incidentReplacements.endDate = endDate;
      }

      incidentQuery += ' GROUP BY "legalComplianceStatus"';

      const incidentComplianceRaw = await this.sequelize.query(incidentQuery, {
        replacements: incidentReplacements,
        type: QueryTypes.SELECT,
        raw: true,
      });

      const incidentCompliance = incidentComplianceRaw.map((record: any) => ({
        legalComplianceStatus: record.legalComplianceStatus,
        count: parseInt(record.count, 10),
      }));

      // SECURITY FIX: Replaced string concatenation with parameterized query
      // Get vaccination record count
      let vaccinationQuery = 'SELECT COUNT(*)::integer as count FROM vaccinations';
      const vaccinationReplacements: any = {};

      if (startDate && endDate) {
        vaccinationQuery += ' WHERE "createdAt" >= :startDate AND "createdAt" <= :endDate';
        vaccinationReplacements.startDate = startDate;
        vaccinationReplacements.endDate = endDate;
      } else if (startDate) {
        vaccinationQuery += ' WHERE "createdAt" >= :startDate';
        vaccinationReplacements.startDate = startDate;
      } else if (endDate) {
        vaccinationQuery += ' WHERE "createdAt" <= :endDate';
        vaccinationReplacements.endDate = endDate;
      }

      const vaccinationRecords = await this.sequelize.query(vaccinationQuery, {
        replacements: vaccinationReplacements,
        type: QueryTypes.SELECT,
        raw: true,
      });

      this.logInfo('Compliance report generated successfully');

      return {
        hipaaLogs,
        medicationCompliance,
        incidentCompliance,
        vaccinationRecords: (vaccinationRecords as any)[0]?.count || 0,
      };
    } catch (error) {
      this.logError('Error generating compliance report:', error);
      throw error;
    }
  }
}
