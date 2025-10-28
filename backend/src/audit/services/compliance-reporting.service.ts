import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AuditLog } from '../entities';

/**
 * ComplianceReportingService - HIPAA compliance reporting
 *
 * HIPAA Compliance: Generates comprehensive compliance reports for audit purposes
 * and regulatory compliance. Provides detailed analytics on PHI access patterns
 * and system usage for compliance officers and auditors.
 */
@Injectable()
export class ComplianceReportingService {
  private readonly logger = new Logger(ComplianceReportingService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  /**
   * Get compliance report for HIPAA
   *
   * @param startDate - Start date for the report period
   * @param endDate - End date for the report period
   * @returns Promise with compliance report data
   */
  async getComplianceReport(startDate: Date, endDate: Date): Promise<any> {
    try {
      const phiLogs = await this.auditLogRepository
        .createQueryBuilder('audit_log')
        .where('audit_log.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
        .andWhere("audit_log.changes->>'isPHIAccess' = :isPHIAccess", { isPHIAccess: 'true' })
        .getMany();

      const totalAccess = phiLogs.length;
      const failedAccess = phiLogs.filter((log) => log.changes?.['success'] === false).length;

      // Group by access type
      const accessByType: Record<string, number> = {};
      phiLogs.forEach((log) => {
        const type = log.changes?.['accessType'] || 'UNKNOWN';
        accessByType[type] = (accessByType[type] || 0) + 1;
      });

      // Group by data category
      const accessByCategory: Record<string, number> = {};
      phiLogs.forEach((log) => {
        const category = log.changes?.['dataCategory'] || 'UNKNOWN';
        accessByCategory[category] = (accessByCategory[category] || 0) + 1;
      });

      return {
        period: {
          start: startDate,
          end: endDate,
        },
        summary: {
          totalAccess,
          failedAccess,
          successRate: totalAccess > 0 ? ((totalAccess - failedAccess) / totalAccess) * 100 : 0,
        },
        accessByType: Object.entries(accessByType).map(([type, count]) => ({ type, count })),
        accessByCategory: Object.entries(accessByCategory).map(([category, count]) => ({ category, count })),
      };
    } catch (error) {
      this.logger.error('Error generating compliance report:', error);
      throw new Error('Failed to generate compliance report');
    }
  }

  /**
   * Get PHI access summary for a specific period
   *
   * @param startDate - Start date for the summary period
   * @param endDate - End date for the summary period
   * @returns Promise with PHI access summary data
   */
  async getPHIAccessSummary(startDate: Date, endDate: Date): Promise<any> {
    try {
      const phiLogs = await this.auditLogRepository
        .createQueryBuilder('audit_log')
        .where('audit_log.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
        .andWhere("audit_log.changes->>'isPHIAccess' = :isPHIAccess", { isPHIAccess: 'true' })
        .getMany();

      const totalAccess = phiLogs.length;
      const successfulAccess = phiLogs.filter((log) => log.changes?.['success'] !== false).length;
      const failedAccess = totalAccess - successfulAccess;

      return {
        period: { start: startDate, end: endDate },
        totalAccess,
        successfulAccess,
        failedAccess,
        successRate: totalAccess > 0 ? (successfulAccess / totalAccess) * 100 : 0,
      };
    } catch (error) {
      this.logger.error('Error generating PHI access summary:', error);
      throw new Error('Failed to generate PHI access summary');
    }
  }
}
