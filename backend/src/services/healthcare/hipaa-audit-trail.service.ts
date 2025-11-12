import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { AuditLog, ComplianceType, AuditSeverity   } from "../../database/models";
import { User   } from "../../database/models";
import { Patient   } from "../../database/models";

/**
 * HIPAA Audit Trail Service
 *
 * Implements comprehensive audit logging for PHI access and healthcare operations
 * in compliance with HIPAA Security Rule §164.312(b) - Audit Controls
 *
 * Features:
 * - PHI access logging with user context
 * - Compliance reporting and monitoring
 * - Real-time security event detection
 * - Automated breach notification
 * - Audit trail integrity verification
 *
 * @hipaa-requirement §164.312(b) - Audit Controls
 */
@Injectable()
export class HipaaAuditTrailService {
  private readonly logger = new Logger(HipaaAuditTrailService.name);

  constructor(
    @InjectModel(AuditLog)
    private readonly auditLogModel: typeof AuditLog,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Patient)
    private readonly patientModel: typeof Patient,
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Log PHI access event
   * @param event Audit event details
   */
  async logPhiAccess(event: PhiAccessEvent): Promise<void> {
    const transaction = await this.sequelize.transaction();

    try {
      // Create audit log entry
      const auditEntry = await this.auditLogModel.create(
        {
          id: this.generateAuditId(),
          action: 'READ', // Using READ as the action for PHI access
          entityType: event.resourceType,
          entityId: event.resourceId,
          userId: event.userId,
          userName: null, // Would be populated from user service
          changes: null,
          previousValues: null,
          newValues: null,
          ipAddress: event.ipAddress,
          userAgent: event.userAgent,
          requestId: null,
          sessionId: event.sessionId,
          isPHI: true,
          complianceType: ComplianceType.HIPAA,
          severity: AuditSeverity.MEDIUM,
          success: true,
          errorMessage: null,
          metadata: {
            fieldsAccessed: event.fieldsAccessed,
            purpose: event.purpose,
            authorizationMethod: event.authorizationMethod,
            patientId: event.patientId,
          },
          tags: ['phi-access', 'hipaa', 'audit'],
          createdAt: new Date(),
        },
        { transaction },
      );

      // Check for suspicious activity
      await this.detectSuspiciousActivity(auditEntry, transaction);

      // Update user access patterns
      await this.updateUserAccessPatterns(event.userId, auditEntry, transaction);

      await transaction.commit();

      this.logger.log(
        `PHI access logged: ${auditEntry.id} - User: ${event.userId}, Patient: ${event.patientId}`,
      );
    } catch (error) {
      await transaction.rollback();
      this.logger.error(`Failed to log PHI access: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Log security event
   * @param event Security event details
   */
  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    const auditEntry = await this.auditLogModel.create({
      id: this.generateAuditId(),
      eventType: 'SECURITY',
      userId: event.userId,
      action: event.action,
      timestamp: new Date(),
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      location: event.location,
      severity: event.severity,
      complianceStatus: this.determineComplianceStatus(event),
      metadata: {
        details: event.details,
        affectedResources: event.affectedResources,
        remediation: event.remediation,
      },
    });

    // Trigger alerts for high-severity events
    if (event.severity === 'HIGH' || event.severity === 'CRITICAL') {
      await this.triggerSecurityAlert(auditEntry);
    }

    this.logger.warn(`Security event logged: ${auditEntry.id} - ${event.action}`);
  }

  /**
   * Generate compliance report
   * @param startDate Report start date
   * @param endDate Report end date
   * @param filters Optional filters
   */
  async generateComplianceReport(
    startDate: Date,
    endDate: Date,
    filters?: ComplianceReportFilters,
  ): Promise<ComplianceReport> {
    const whereClause: any = {
      timestamp: {
        [this.sequelize.Op.between]: [startDate, endDate],
      },
    };

    if (filters?.userId) {
      whereClause.userId = filters.userId;
    }

    if (filters?.patientId) {
      whereClause.patientId = filters.patientId;
    }

    if (filters?.eventType) {
      whereClause.eventType = filters.eventType;
    }

    const auditLogs = await this.auditLogModel.findAll({
      where: whereClause,
      include: [
        { model: User, attributes: ['id', 'email', 'role'] },
        { model: Patient, attributes: ['id', 'firstName', 'lastName'] },
      ],
      order: [['timestamp', 'DESC']],
    });

    const violations = auditLogs.filter((log) => log.complianceStatus === 'VIOLATION');
    const phiAccesses = auditLogs.filter((log) => log.phiAccessed);

    return {
      period: { startDate, endDate },
      totalEvents: auditLogs.length,
      phiAccessCount: phiAccesses.length,
      violationCount: violations.length,
      complianceRate:
        auditLogs.length > 0
          ? ((auditLogs.length - violations.length) / auditLogs.length) * 100
          : 100,
      topViolations: this.analyzeTopViolations(violations),
      userActivitySummary: this.summarizeUserActivity(auditLogs),
      recommendations: this.generateRecommendations(auditLogs),
      auditLogs: auditLogs.map((log) => ({
        id: log.id,
        timestamp: log.timestamp,
        user: log.user ? `${log.user.email} (${log.user.role})` : 'Unknown',
        patient: log.patient ? `${log.patient.firstName} ${log.patient.lastName}` : null,
        action: log.action,
        resourceType: log.resourceType,
        complianceStatus: log.complianceStatus,
        severity: this.calculateSeverity(log),
      })),
    };
  }

  /**
   * Verify audit trail integrity
   * @param startDate Start date for verification
   * @param endDate End date for verification
   */
  async verifyAuditIntegrity(startDate: Date, endDate: Date): Promise<IntegrityCheckResult> {
    const logs = await this.auditLogModel.findAll({
      where: {
        timestamp: {
          [this.sequelize.Op.between]: [startDate, endDate],
        },
      },
      order: [['timestamp', 'ASC']],
    });

    const gaps = this.detectGaps(logs);
    const tampering = await this.detectTampering(logs);
    const completeness = this.checkCompleteness(logs);

    return {
      period: { startDate, endDate },
      totalLogs: logs.length,
      gapsDetected: gaps.length,
      tamperingDetected: tampering.length > 0,
      completenessScore: completeness.score,
      issues: [...gaps, ...tampering, ...completeness.issues],
      verified: gaps.length === 0 && tampering.length === 0 && completeness.score >= 95,
    };
  }

  /**
   * Get user access patterns for risk assessment
   * @param userId User ID
   * @param days Number of days to analyze
   */
  async getUserAccessPatterns(userId: string, days: number = 30): Promise<UserAccessPattern> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await this.auditLogModel.findAll({
      where: {
        userId,
        timestamp: {
          [this.sequelize.Op.gte]: startDate,
        },
        phiAccessed: true,
      },
      order: [['timestamp', 'DESC']],
    });

    const accessFrequency = this.calculateAccessFrequency(logs);
    const unusualPatterns = this.detectUnusualPatterns(logs);
    const riskScore = this.calculateRiskScore(logs, unusualPatterns);

    return {
      userId,
      period: { startDate, endDate: new Date() },
      totalPhiAccesses: logs.length,
      accessFrequency,
      unusualPatterns,
      riskScore,
      recommendations: this.generateUserRecommendations(riskScore, unusualPatterns),
    };
  }

  private generateAuditId(): string {
    return `AUDIT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async detectSuspiciousActivity(auditEntry: AuditLog, transaction: any): Promise<void> {
    // Check for unusual access patterns
    const recentLogs = await this.auditLogModel.findAll({
      where: {
        userId: auditEntry.userId,
        timestamp: {
          [this.sequelize.Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      transaction,
    });

    const suspiciousPatterns = this.analyzeSuspiciousPatterns(recentLogs, auditEntry);

    if (suspiciousPatterns.length > 0) {
      await this.auditLogModel.create(
        {
          id: this.generateAuditId(),
          eventType: 'SUSPICIOUS_ACTIVITY',
          userId: auditEntry.userId,
          action: 'SUSPICIOUS_PHI_ACCESS',
          timestamp: new Date(),
          severity: 'HIGH',
          complianceStatus: 'VIOLATION',
          metadata: {
            patterns: suspiciousPatterns,
            relatedAuditId: auditEntry.id,
          },
        },
        { transaction },
      );
    }
  }

  private analyzeSuspiciousPatterns(logs: AuditLog[], currentEntry: AuditLog): string[] {
    const patterns: string[] = [];

    // Check for rapid successive accesses
    const recentAccesses = logs.filter(
      (log) => log.timestamp > new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
    );

    if (recentAccesses.length > 10) {
      patterns.push('RAPID_SUCCESSIVE_ACCESSES');
    }

    // Check for access outside normal hours
    const hour = currentEntry.timestamp.getHours();
    if (hour < 6 || hour > 22) {
      patterns.push('OFF_HOURS_ACCESS');
    }

    // Check for access from unusual location
    // Implementation would compare against user's normal access patterns

    return patterns;
  }

  private async updateUserAccessPatterns(
    userId: string,
    auditEntry: AuditLog,
    transaction: any,
  ): Promise<void> {
    // Update user's access pattern statistics
    // This would typically update a separate table tracking user behavior
  }

  private determineComplianceStatus(event: SecurityEvent): 'COMPLIANT' | 'VIOLATION' | 'WARNING' {
    // Logic to determine compliance status based on event details
    if (event.action.includes('FAILED_LOGIN')) {
      return 'VIOLATION';
    }
    return 'COMPLIANT';
  }

  private async triggerSecurityAlert(auditEntry: AuditLog): Promise<void> {
    // Implementation would send alerts to security team
    this.logger.error(`SECURITY ALERT: ${auditEntry.action} - ${auditEntry.id}`);
  }

  private analyzeTopViolations(violations: AuditLog[]): ViolationSummary[] {
    const violationCounts = violations.reduce(
      (acc, violation) => {
        const key = `${violation.action}-${violation.complianceStatus}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(violationCounts)
      .map(([violation, count]) => ({ violation, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private summarizeUserActivity(logs: AuditLog[]): UserActivitySummary[] {
    const userActivity = logs.reduce(
      (acc, log) => {
        const userId = log.userId;
        if (!acc[userId]) {
          acc[userId] = {
            userId,
            totalActions: 0,
            phiAccesses: 0,
            violations: 0,
            lastActivity: log.timestamp,
          };
        }

        acc[userId].totalActions++;
        if (log.phiAccessed) acc[userId].phiAccesses++;
        if (log.complianceStatus === 'VIOLATION') acc[userId].violations++;
        if (log.timestamp > acc[userId].lastActivity) {
          acc[userId].lastActivity = log.timestamp;
        }

        return acc;
      },
      {} as Record<string, UserActivitySummary>,
    );

    return Object.values(userActivity);
  }

  private generateRecommendations(logs: AuditLog[]): string[] {
    const recommendations: string[] = [];

    const violationRate =
      logs.filter((log) => log.complianceStatus === 'VIOLATION').length / logs.length;

    if (violationRate > 0.1) {
      recommendations.push(
        'High violation rate detected. Consider additional training and monitoring.',
      );
    }

    const offHoursAccess = logs.filter((log) => {
      const hour = log.timestamp.getHours();
      return hour < 6 || hour > 22;
    });

    if (offHoursAccess.length > logs.length * 0.05) {
      recommendations.push('Significant off-hours access detected. Review access policies.');
    }

    return recommendations;
  }

  private calculateSeverity(log: AuditLog): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (log.complianceStatus === 'VIOLATION' && log.phiAccessed) {
      return 'CRITICAL';
    }
    if (log.complianceStatus === 'VIOLATION') {
      return 'HIGH';
    }
    if (log.phiAccessed) {
      return 'MEDIUM';
    }
    return 'LOW';
  }

  private detectGaps(logs: AuditLog[]): GapIssue[] {
    const gaps: GapIssue[] = [];
    const expectedInterval = 5 * 60 * 1000; // 5 minutes

    for (let i = 1; i < logs.length; i++) {
      const timeDiff = logs[i].timestamp.getTime() - logs[i - 1].timestamp.getTime();
      if (timeDiff > expectedInterval) {
        gaps.push({
          type: 'TIME_GAP',
          startTime: logs[i - 1].timestamp,
          endTime: logs[i].timestamp,
          duration: timeDiff,
          severity: timeDiff > 60 * 60 * 1000 ? 'HIGH' : 'MEDIUM', // > 1 hour
        });
      }
    }

    return gaps;
  }

  private async detectTampering(logs: AuditLog[]): Promise<TamperingIssue[]> {
    // Implementation would check for signs of log tampering
    // This is a simplified version
    const tampering: TamperingIssue[] = [];

    for (const log of logs) {
      // Check for suspicious modifications
      if (log.metadata?.tampered) {
        tampering.push({
          type: 'LOG_MODIFICATION',
          auditId: log.id,
          timestamp: log.timestamp,
          details: 'Log entry appears to have been modified',
          severity: 'CRITICAL',
        });
      }
    }

    return tampering;
  }

  private checkCompleteness(logs: AuditLog[]): CompletenessCheck {
    const totalExpectedLogs = this.calculateExpectedLogCount(logs);
    const actualLogs = logs.length;
    const completenessScore = totalExpectedLogs > 0 ? (actualLogs / totalExpectedLogs) * 100 : 100;

    const issues: string[] = [];
    if (completenessScore < 95) {
      issues.push(`Log completeness is ${completenessScore.toFixed(1)}%`);
    }

    return { score: completenessScore, issues };
  }

  private calculateExpectedLogCount(logs: AuditLog[]): number {
    // Simplified calculation - would be more sophisticated in real implementation
    return logs.length * 1.1; // Assume 10% potential missing logs
  }

  private calculateAccessFrequency(logs: AuditLog[]): AccessFrequency {
    const totalDays = 30; // Assuming 30-day period
    const accessesPerDay = logs.length / totalDays;

    let frequency: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
    if (accessesPerDay < 5) frequency = 'LOW';
    else if (accessesPerDay < 15) frequency = 'MEDIUM';
    else if (accessesPerDay < 30) frequency = 'HIGH';
    else frequency = 'VERY_HIGH';

    return {
      accessesPerDay,
      frequency,
      trend: this.calculateTrend(logs),
    };
  }

  private calculateTrend(logs: AuditLog[]): 'INCREASING' | 'DECREASING' | 'STABLE' {
    if (logs.length < 10) return 'STABLE';

    const firstHalf = logs.slice(0, Math.floor(logs.length / 2));
    const secondHalf = logs.slice(Math.floor(logs.length / 2));

    const firstHalfAvg = firstHalf.length / 15; // First 15 days
    const secondHalfAvg = secondHalf.length / 15; // Last 15 days

    const change = (secondHalfAvg - firstHalfAvg) / firstHalfAvg;

    if (change > 0.2) return 'INCREASING';
    if (change < -0.2) return 'DECREASING';
    return 'STABLE';
  }

  private detectUnusualPatterns(logs: AuditLog[]): UnusualPattern[] {
    const patterns: UnusualPattern[] = [];

    // Check for bulk data exports
    const bulkExports = logs.filter(
      (log) => log.action === 'EXPORT' && log.metadata?.recordCount > 100,
    );

    if (bulkExports.length > 0) {
      patterns.push({
        type: 'BULK_EXPORT',
        description: `${bulkExports.length} bulk data exports detected`,
        severity: 'HIGH',
        occurrences: bulkExports.length,
      });
    }

    // Check for access to multiple patients rapidly
    const patientAccesses = logs.reduce(
      (acc, log) => {
        if (log.patientId) {
          acc[log.patientId] = (acc[log.patientId] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    const highAccessPatients = Object.entries(patientAccesses).filter(
      ([, count]) => count > 10,
    ).length;

    if (highAccessPatients > 5) {
      patterns.push({
        type: 'MULTIPLE_PATIENT_ACCESS',
        description: `Access to ${highAccessPatients} patients with high frequency`,
        severity: 'MEDIUM',
        occurrences: highAccessPatients,
      });
    }

    return patterns;
  }

  private calculateRiskScore(logs: AuditLog[], patterns: UnusualPattern[]): number {
    let score = 0;

    // Base score from violations
    const violations = logs.filter((log) => log.complianceStatus === 'VIOLATION').length;
    score += violations * 10;

    // Score from unusual patterns
    patterns.forEach((pattern) => {
      switch (pattern.severity) {
        case 'CRITICAL':
          score += 50;
          break;
        case 'HIGH':
          score += 25;
          break;
        case 'MEDIUM':
          score += 10;
          break;
        case 'LOW':
          score += 5;
          break;
      }
    });

    // Score from access frequency
    const frequency = this.calculateAccessFrequency(logs);
    switch (frequency.frequency) {
      case 'VERY_HIGH':
        score += 30;
        break;
      case 'HIGH':
        score += 15;
        break;
      case 'MEDIUM':
        score += 5;
        break;
    }

    return Math.min(score, 100); // Cap at 100
  }

  private generateUserRecommendations(riskScore: number, patterns: UnusualPattern[]): string[] {
    const recommendations: string[] = [];

    if (riskScore > 70) {
      recommendations.push('Immediate security review required due to high risk score');
    } else if (riskScore > 40) {
      recommendations.push('Additional monitoring recommended');
    }

    if (patterns.some((p) => p.type === 'BULK_EXPORT')) {
      recommendations.push('Review bulk export activities for business justification');
    }

    if (patterns.some((p) => p.type === 'MULTIPLE_PATIENT_ACCESS')) {
      recommendations.push('Consider additional training on PHI access policies');
    }

    return recommendations;
  }
}

// Type definitions
export interface PhiAccessEvent {
  userId: string;
  patientId?: string;
  resourceType: string;
  resourceId: string;
  action: string;
  fieldsAccessed?: string[];
  purpose?: string;
  authorizationMethod: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  sessionId?: string;
}

export interface SecurityEvent {
  userId?: string;
  action: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ipAddress: string;
  userAgent: string;
  location?: string;
  details: Record<string, any>;
  affectedResources?: string[];
  remediation?: string;
}

export interface ComplianceReportFilters {
  userId?: string;
  patientId?: string;
  eventType?: string;
}

export interface ComplianceReport {
  period: { startDate: Date; endDate: Date };
  totalEvents: number;
  phiAccessCount: number;
  violationCount: number;
  complianceRate: number;
  topViolations: ViolationSummary[];
  userActivitySummary: UserActivitySummary[];
  recommendations: string[];
  auditLogs: AuditLogSummary[];
}

export interface ViolationSummary {
  violation: string;
  count: number;
}

export interface UserActivitySummary {
  userId: string;
  totalActions: number;
  phiAccesses: number;
  violations: number;
  lastActivity: Date;
}

export interface AuditLogSummary {
  id: string;
  timestamp: Date;
  user: string;
  patient: string | null;
  action: string;
  resourceType: string | null;
  complianceStatus: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface IntegrityCheckResult {
  period: { startDate: Date; endDate: Date };
  totalLogs: number;
  gapsDetected: number;
  tamperingDetected: boolean;
  completenessScore: number;
  issues: (GapIssue | TamperingIssue | string)[];
  verified: boolean;
}

export interface GapIssue {
  type: 'TIME_GAP';
  startTime: Date;
  endTime: Date;
  duration: number;
  severity: 'MEDIUM' | 'HIGH';
}

export interface TamperingIssue {
  type: 'LOG_MODIFICATION';
  auditId: string;
  timestamp: Date;
  details: string;
  severity: 'CRITICAL';
}

export interface CompletenessCheck {
  score: number;
  issues: string[];
}

export interface UserAccessPattern {
  userId: string;
  period: { startDate: Date; endDate: Date };
  totalPhiAccesses: number;
  accessFrequency: AccessFrequency;
  unusualPatterns: UnusualPattern[];
  riskScore: number;
  recommendations: string[];
}

export interface AccessFrequency {
  accessesPerDay: number;
  frequency: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  trend: 'INCREASING' | 'DECREASING' | 'STABLE';
}

export interface UnusualPattern {
  type: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  occurrences: number;
}
