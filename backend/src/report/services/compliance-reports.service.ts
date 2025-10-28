import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, Between, In } from 'typeorm';
import { AuditLog } from '../../audit/entities/audit-log.entity';
import { StudentMedication } from '../../medication/entities/student-medication.entity';
import { IncidentReport } from '../../incident-report/entities/incident-report.entity';
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
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
    @InjectRepository(StudentMedication)
    private studentMedicationRepository: Repository<StudentMedication>,
    @InjectRepository(IncidentReport)
    private incidentReportRepository: Repository<IncidentReport>,
    @InjectDataSource()
    private dataSource: DataSource,
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
        if (startDate) whereClause.createdAt = Between(startDate, endDate || new Date());
      }

      // Get HIPAA-related audit logs
      const hipaaLogs = await this.auditLogRepository.find({
        where: {
          ...whereClause,
          action: In(['VIEW', 'EXPORT', 'ACCESS']),
        },
        order: { createdAt: 'DESC' },
        take: 100,
      });

      // Get medication compliance statistics
      const medicationComplianceRaw = await this.studentMedicationRepository
        .createQueryBuilder('sm')
        .select('sm.isActive', 'isActive')
        .addSelect('COUNT(sm.id)', 'count')
        .groupBy('sm.isActive')
        .getRawMany();

      const medicationCompliance = medicationComplianceRaw.map((record: any) => ({
        isActive: record.isActive as boolean,
        count: parseInt(record.count, 10),
      }));

      // Get incident compliance statistics
      const incidentComplianceRaw = await this.incidentReportRepository
        .createQueryBuilder('ir')
        .select('ir.legalComplianceStatus', 'legalComplianceStatus')
        .addSelect('COUNT(ir.id)', 'count')
        .where(whereClause)
        .groupBy('ir.legalComplianceStatus')
        .getRawMany();

      const incidentCompliance = incidentComplianceRaw.map((record: any) => ({
        legalComplianceStatus: record.legalComplianceStatus,
        count: parseInt(record.count, 10),
      }));

      // Get vaccination record count
      const vaccinationRecords = await this.dataSource.query(
        `SELECT COUNT(*)::integer as count FROM vaccinations ${startDate || endDate ? 'WHERE' : ''} ${startDate ? '"createdAt" >= $1' : ''} ${startDate && endDate ? 'AND' : ''} ${endDate && startDate ? '"createdAt" <= $2' : endDate ? '"createdAt" <= $1' : ''}`,
        [startDate, endDate].filter(v => v !== undefined),
      );

      this.logger.log('Compliance report generated successfully');

      return {
        hipaaLogs,
        medicationCompliance,
        incidentCompliance,
        vaccinationRecords: vaccinationRecords[0]?.count || 0,
      };
    } catch (error) {
      this.logger.error('Error generating compliance report:', error);
      throw error;
    }
  }
}
