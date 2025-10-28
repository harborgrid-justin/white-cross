import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AuditLog } from '../entities';

/**
 * SecurityAnalysisService - Security monitoring and threat detection
 *
 * Provides security-focused analysis of audit logs to detect potential
 * threats, unusual patterns, and security violations. Essential for
 * maintaining system security and detecting malicious activities.
 */
@Injectable()
export class SecurityAnalysisService {
  private readonly logger = new Logger(SecurityAnalysisService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  /**
   * Detect suspicious login patterns
   *
   * @param startDate - Start date for the analysis
   * @param endDate - End date for the analysis
   * @returns Promise with suspicious login patterns
   */
  async detectSuspiciousLogins(startDate: Date, endDate: Date): Promise<any> {
    try {
      const failedLogins = await this.auditLogRepository
        .createQueryBuilder('audit_log')
        .where('audit_log.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
        .andWhere('audit_log.action = :action', { action: 'LOGIN' })
        .andWhere("audit_log.changes->>'success' = :success", { success: 'false' })
        .andWhere('audit_log.ipAddress IS NOT NULL')
        .orderBy('audit_log.createdAt', 'DESC')
        .getMany();

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
      this.logger.error('Error detecting suspicious logins:', error);
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
  async generateSecurityReport(startDate: Date, endDate: Date): Promise<any> {
    try {
      const suspiciousLogins = await this.detectSuspiciousLogins(startDate, endDate);

      let overallRiskScore = 0;
      if (suspiciousLogins.riskLevel === 'HIGH') overallRiskScore += 3;
      else if (suspiciousLogins.riskLevel === 'MEDIUM') overallRiskScore += 2;
      else if (suspiciousLogins.riskLevel === 'LOW') overallRiskScore += 1;

      const riskLevel =
        overallRiskScore >= 10 ? 'CRITICAL' : overallRiskScore >= 6 ? 'HIGH' : overallRiskScore >= 3 ? 'MEDIUM' : 'LOW';

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
      this.logger.error('Error generating security report:', error);
      throw new Error('Failed to generate security report');
    }
  }
}
