/**
 * Audit Compliance Service
 * Handles compliance reporting for HIPAA, FERPA, and other regulatory requirements
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AuditLog, AuditSeverity, ComplianceType } from '../models/audit-log.model';

import { BaseService } from '@/common/base';
/**
 * Interface for compliance report
 */
export interface ComplianceReport {
  period: { start: Date; end: Date };
  complianceType: ComplianceType;
  totalAccess: number;
  uniqueUsers: number;
  phiAccess: number;
  failedAccess: number;
  criticalEvents: number;
  topAccessedEntities: Array<{ entityType: string; count: number }>;
  userActivity: Array<{
    userId: string;
    userName: string;
    accessCount: number;
  }>;
}

/**
 * Audit Compliance Service
 *
 * Provides compliance reporting functionality:
 * - HIPAA compliance reports
 * - FERPA compliance reports
 * - General compliance reports
 * - User activity tracking
 * - Critical event monitoring
 */
@Injectable()
export class AuditComplianceService extends BaseService {
  constructor(
    @InjectModel(AuditLog)
    private readonly auditLogModel: typeof AuditLog,
  ) {}

  /**
   * Generate compliance report (HIPAA, FERPA, etc.)
   *
   * @param complianceType - Type of compliance report
   * @param startDate - Start date of reporting period
   * @param endDate - End date of reporting period
   * @returns Comprehensive compliance report
   */
  async generateComplianceReport(
    complianceType: ComplianceType,
    startDate: Date,
    endDate: Date,
  ): Promise<ComplianceReport> {
    try {
      const where = {
        complianceType,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      };

      const [totalAccess, phiAccess, failedAccess, criticalEvents] =
        await Promise.all([
          this.auditLogModel.count({ where }),
          this.auditLogModel.count({ where: { ...where, isPHI: true } }),
          this.auditLogModel.count({ where: { ...where, success: false } }),
          this.auditLogModel.count({
            where: { ...where, severity: AuditSeverity.CRITICAL },
          }),
        ]);

      // Get unique users
      const uniqueUsersResult = await this.auditLogModel.findAll({
        where: { ...where, userId: { [Op.ne]: null } },
        attributes: [
          [
            this.auditLogModel.sequelize!.fn(
              'COUNT',
              this.auditLogModel.sequelize!.fn(
                'DISTINCT',
                this.auditLogModel.sequelize!.col('userId'),
              ),
            ),
            'count',
          ],
        ],
        raw: true,
      });
      const uniqueUsers = parseInt((uniqueUsersResult[0] as any).count, 10);

      // Top accessed entities
      const entityCounts = await this.auditLogModel.findAll({
        where,
        attributes: [
          'entityType',
          [this.auditLogModel.sequelize!.fn('COUNT', '*'), 'count'],
        ],
        group: ['entityType'],
        order: [[this.auditLogModel.sequelize!.literal('count'), 'DESC']],
        limit: 10,
        raw: true,
      });

      const topAccessedEntities = (entityCounts as any[]).map((row) => ({
        entityType: row.entityType,
        count: parseInt(row.count, 10),
      }));

      // User activity
      const userActivity = await this.auditLogModel.findAll({
        where: { ...where, userId: { [Op.ne]: null } },
        attributes: [
          'userId',
          'userName',
          [this.auditLogModel.sequelize!.fn('COUNT', '*'), 'count'],
        ],
        group: ['userId', 'userName'],
        order: [[this.auditLogModel.sequelize!.literal('count'), 'DESC']],
        limit: 20,
        raw: true,
      });

      return {
        period: { start: startDate, end: endDate },
        complianceType,
        totalAccess,
        uniqueUsers,
        phiAccess,
        failedAccess,
        criticalEvents,
        topAccessedEntities,
        userActivity: (userActivity as any[]).map((row) => ({
          userId: row.userId,
          userName: row.userName || 'Unknown',
          accessCount: parseInt(row.count, 10),
        })),
      };
    } catch (error) {
      this.logError(
        `Failed to generate compliance report: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get HIPAA compliance report
   *
   * @param startDate - Start date of reporting period
   * @param endDate - End date of reporting period
   * @returns HIPAA compliance report
   */
  async getHIPAAReport(
    startDate: Date,
    endDate: Date,
  ): Promise<ComplianceReport> {
    return this.generateComplianceReport(
      ComplianceType.HIPAA,
      startDate,
      endDate,
    );
  }

  /**
   * Get FERPA compliance report
   *
   * @param startDate - Start date of reporting period
   * @param endDate - End date of reporting period
   * @returns FERPA compliance report
   */
  async getFERPAReport(
    startDate: Date,
    endDate: Date,
  ): Promise<ComplianceReport> {
    return this.generateComplianceReport(
      ComplianceType.FERPA,
      startDate,
      endDate,
    );
  }
}
