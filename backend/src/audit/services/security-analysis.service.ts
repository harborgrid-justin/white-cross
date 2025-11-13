import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { literal, Op } from 'sequelize';
import { AuditLog } from '@/database';
import { SecurityReport, SuspiciousLoginDetection } from '../types/audit.types';

import { BaseService } from '../../../common/base';
/**
 * SecurityAnalysisService - Security monitoring and threat detection
 *
 * Provides security-focused analysis of audit logs to detect potential
 * threats, unusual patterns, and security violations. Essential for
 * maintaining system security and detecting malicious activities.
 */
@Injectable()
export class SecurityAnalysisService extends BaseService {
  constructor(
    @InjectModel(AuditLog)
    private readonly auditLogModel: typeof AuditLog,
  ) {}

  /**
   * Detect suspicious login patterns
   *
   * @param startDate - Start date for the analysis
   * @param endDate - End date for the analysis
   * @returns Promise with suspicious login patterns
   */
  async detectSuspiciousLogins(startDate: Date, endDate: Date): Promise<SuspiciousLoginDetection> {
    try {
      const failedLogins = await this.auditLogModel.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
          action: 'LOGIN',
          [Op.and]: [literal(`changes->>'success' = 'false'`), { ipAddress: { [Op.ne]: null } }],
        },
        order: [['createdAt', 'DESC']],
      });

      // Group by IP address
      const ipFailureMap: Record<string, number> = {};
      failedLogins.forEach((log) => {
        if (log.ipAddress) {
          ipFailureMap[log.ipAddress] = (ipFailureMap[log.ipAddress] || 0) + 1;
        }
      });

      const suspiciousIPs = Object.entries(ipFailureMap)
        .filter(([_, count]) => count >= 5)
        .map(([ip, count]) => ({
          ipAddress: ip,
          failedAttempts: count,
        }));

      return {
        period: { start: startDate, end: endDate },
        totalFailedLogins: failedLogins.length,
        suspiciousIPs,
        riskLevel: suspiciousIPs.length > 0 ? 'HIGH' : failedLogins.length > 20 ? 'MEDIUM' : 'LOW',
      };
    } catch (error) {
      this.logError('Error detecting suspicious logins:', error);
      throw new Error('Failed to detect suspicious logins');
    }
  }

  /**
   * Generate comprehensive security report
   *
   * @param startDate - Start date for the security analysis
   * @param endDate - End date for the security analysis
   * @returns Promise with comprehensive security analysis
   */
  async generateSecurityReport(startDate: Date, endDate: Date): Promise<SecurityReport> {
    try {
      const suspiciousLogins = await this.detectSuspiciousLogins(startDate, endDate);

      let overallRiskScore = 0;
      if (suspiciousLogins.riskLevel === 'HIGH') overallRiskScore += 3;
      else if (suspiciousLogins.riskLevel === 'MEDIUM') overallRiskScore += 2;
      else if (suspiciousLogins.riskLevel === 'LOW') overallRiskScore += 1;

      const riskLevel =
        overallRiskScore >= 10
          ? 'CRITICAL'
          : overallRiskScore >= 6
            ? 'HIGH'
            : overallRiskScore >= 3
              ? 'MEDIUM'
              : 'LOW';

      return {
        period: { start: startDate, end: endDate },
        overallRiskLevel: riskLevel,
        overallRiskScore,
        findings: {
          suspiciousLogins,
        },
        summary: {
          totalSecurityEvents: suspiciousLogins.suspiciousIPs.length,
        },
      };
    } catch (error) {
      this.logError('Error generating security report:', error);
      throw new Error('Failed to generate security report');
    }
  }
}
