/**
 * Audit Statistics Service
 * Handles statistical analysis and aggregation of audit logs
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AuditLog, AuditSeverity } from '../models/audit-log.model';

import { BaseService } from '../../common/base';
/**
 * Interface for audit statistics
 */
export interface AuditStatistics {
  totalLogs: number;
  phiAccessCount: number;
  failedOperations: number;
  byAction: Record<string, number>;
  byEntityType: Record<string, number>;
  byUser: Record<string, number>;
  bySeverity: Record<string, number>;
  byComplianceType: Record<string, number>;
}

/**
 * Audit Statistics Service
 *
 * Provides statistical analysis and aggregation:
 * - Total log counts
 * - PHI access statistics
 * - Failed operation counts
 * - Aggregation by action, entity type, user, severity, compliance type
 */
@Injectable()
export class AuditStatisticsService extends BaseService {
  constructor(
    @InjectModel(AuditLog)
    private readonly auditLogModel: typeof AuditLog,
  ) {}

  /**
   * Get audit statistics for a date range
   *
   * @param startDate - Start date of range
   * @param endDate - End date of range
   * @returns Comprehensive audit statistics
   */
  async getAuditStatistics(
    startDate: Date,
    endDate: Date,
  ): Promise<AuditStatistics> {
    try {
      const where = {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      };

      const [totalLogs, phiAccessCount, failedOperations] = await Promise.all([
        this.auditLogModel.count({ where }),
        this.auditLogModel.count({ where: { ...where, isPHI: true } }),
        this.auditLogModel.count({ where: { ...where, success: false } }),
      ]);

      // Get counts by action
      const actionCounts = await this.auditLogModel.findAll({
        where,
        attributes: [
          'action',
          [this.auditLogModel.sequelize!.fn('COUNT', '*'), 'count'],
        ],
        group: ['action'],
        raw: true,
      });

      const byAction: Record<string, number> = {};
      for (const row of actionCounts as any[]) {
        byAction[row.action] = parseInt(row.count, 10);
      }

      // Get counts by entity type
      const entityCounts = await this.auditLogModel.findAll({
        where,
        attributes: [
          'entityType',
          [this.auditLogModel.sequelize!.fn('COUNT', '*'), 'count'],
        ],
        group: ['entityType'],
        raw: true,
        limit: 10,
      });

      const byEntityType: Record<string, number> = {};
      for (const row of entityCounts as any[]) {
        byEntityType[row.entityType] = parseInt(row.count, 10);
      }

      // Get counts by user
      const userCounts = await this.auditLogModel.findAll({
        where: { ...where, userId: { [Op.ne]: null } },
        attributes: [
          'userId',
          [this.auditLogModel.sequelize!.fn('COUNT', '*'), 'count'],
        ],
        group: ['userId'],
        raw: true,
        limit: 10,
      });

      const byUser: Record<string, number> = {};
      for (const row of userCounts as any[]) {
        byUser[row.userId] = parseInt(row.count, 10);
      }

      // Get counts by severity
      const severityCounts = await this.auditLogModel.findAll({
        where,
        attributes: [
          'severity',
          [this.auditLogModel.sequelize!.fn('COUNT', '*'), 'count'],
        ],
        group: ['severity'],
        raw: true,
      });

      const bySeverity: Record<string, number> = {};
      for (const row of severityCounts as any[]) {
        bySeverity[row.severity] = parseInt(row.count, 10);
      }

      // Get counts by compliance type
      const complianceCounts = await this.auditLogModel.findAll({
        where,
        attributes: [
          'complianceType',
          [this.auditLogModel.sequelize!.fn('COUNT', '*'), 'count'],
        ],
        group: ['complianceType'],
        raw: true,
      });

      const byComplianceType: Record<string, number> = {};
      for (const row of complianceCounts as any[]) {
        byComplianceType[row.complianceType] = parseInt(row.count, 10);
      }

      return {
        totalLogs,
        phiAccessCount,
        failedOperations,
        byAction,
        byEntityType,
        byUser,
        bySeverity,
        byComplianceType,
      };
    } catch (error) {
      this.logError(
        `Failed to get audit statistics: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
