/**
 * Audit Retention Service
 * Handles retention policy execution for audit logs based on compliance requirements
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AuditLog, ComplianceType } from '../models/audit-log.model';

import { BaseService } from '@/common/base';
/**
 * Interface for retention policy execution results
 */
export interface RetentionPolicyResult {
  deleted: number;
  retained: number;
  details: Record<string, number>;
}

/**
 * Audit Retention Service
 *
 * Provides retention policy management:
 * - HIPAA retention (7 years)
 * - FERPA retention (5 years)
 * - General retention (3 years)
 * - Dry-run mode for safe testing
 * - Detailed reporting of expired logs
 */
@Injectable()
export class AuditRetentionService extends BaseService {
  constructor(
    @InjectModel(AuditLog)
    private readonly auditLogModel: typeof AuditLog,
  ) {}

  /**
   * Execute retention policy (delete old audit logs based on compliance requirements)
   *
   * Retention periods:
   * - HIPAA: 7 years
   * - FERPA: 5 years
   * - GENERAL: 3 years
   *
   * @param dryRun - If true, only reports what would be deleted without actually deleting
   * @returns Statistics about deleted and retained logs
   */
  async executeRetentionPolicy(dryRun: boolean = true): Promise<RetentionPolicyResult> {
    try {
      const now = new Date();
      const details: Record<string, number> = {};

      // HIPAA: 7 years
      const hipaaRetentionDate = new Date(now);
      hipaaRetentionDate.setFullYear(hipaaRetentionDate.getFullYear() - 7);

      const hipaaExpired = await this.auditLogModel.findAll({
        where: {
          complianceType: ComplianceType.HIPAA,
          createdAt: { [Op.lt]: hipaaRetentionDate },
        },
      });
      details['HIPAA_expired'] = hipaaExpired.length;

      // FERPA: 5 years
      const ferpaRetentionDate = new Date(now);
      ferpaRetentionDate.setFullYear(ferpaRetentionDate.getFullYear() - 5);

      const ferpaExpired = await this.auditLogModel.findAll({
        where: {
          complianceType: ComplianceType.FERPA,
          createdAt: { [Op.lt]: ferpaRetentionDate },
        },
      });
      details['FERPA_expired'] = ferpaExpired.length;

      // General: 3 years
      const generalRetentionDate = new Date(now);
      generalRetentionDate.setFullYear(generalRetentionDate.getFullYear() - 3);

      const generalExpired = await this.auditLogModel.findAll({
        where: {
          complianceType: ComplianceType.GENERAL,
          createdAt: { [Op.lt]: generalRetentionDate },
        },
      });
      details['GENERAL_expired'] = generalExpired.length;

      const totalToDelete =
        hipaaExpired.length + ferpaExpired.length + generalExpired.length;
      const totalLogs = await this.auditLogModel.count();
      const retained = totalLogs - totalToDelete;

      if (!dryRun && totalToDelete > 0) {
        // Actually delete the logs
        await this.auditLogModel.destroy({
          where: {
            [Op.or]: [
              {
                complianceType: ComplianceType.HIPAA,
                createdAt: { [Op.lt]: hipaaRetentionDate },
              },
              {
                complianceType: ComplianceType.FERPA,
                createdAt: { [Op.lt]: ferpaRetentionDate },
              },
              {
                complianceType: ComplianceType.GENERAL,
                createdAt: { [Op.lt]: generalRetentionDate },
              },
            ],
          },
        });

        this.logInfo(
          `Retention policy executed: deleted ${totalToDelete} logs, retained ${retained} logs`,
        );
      } else {
        this.logInfo(
          `Retention policy dry run: would delete ${totalToDelete} logs, retain ${retained} logs`,
        );
      }

      return {
        deleted: totalToDelete,
        retained,
        details,
      };
    } catch (error) {
      this.logError(
        `Failed to execute retention policy: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
