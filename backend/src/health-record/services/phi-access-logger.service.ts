/**
 * @fileoverview PHI Access Logger Service
 * @module health-record/services
 * @description Specialized logging service for Protected Health Information (PHI) access with database persistence
 *
 * HIPAA CRITICAL - This service provides structured PHI access logging with persistent database storage
 *
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 * @compliance 45 CFR 164.312(b) - Audit controls
 */

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AuditLog, ComplianceType, AuditSeverity } from '../../database/models/audit-log.model';
import { AuditAction } from '../../database/types/database.enums';
import { PhiDisclosureAudit } from '../../database/models/phi-disclosure-audit.model';

export interface PHIAccessLogEntry {
  correlationId: string;
  timestamp: Date;
  userId?: string;
  studentId?: string;
  operation: string;
  dataTypes: string[];
  recordCount: number;
  sensitivityLevel: 'PUBLIC' | 'INTERNAL' | 'PHI' | 'SENSITIVE_PHI';
  ipAddress: string;
  userAgent: string;
  success: boolean;
}

export interface SecurityIncidentEntry {
  correlationId: string;
  timestamp: Date;
  incidentType: string;
  userId?: string;
  ipAddress: string;
  operation: string;
  errorMessage: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface PHIAccessStatistics {
  totalAccesses: number;
  uniqueUsers: number;
  uniqueStudents: number;
  operationCounts: Record<string, number>;
  dataTypeCounts: Record<string, number>;
  securityIncidents: number;
  period: {
    start: Date;
    end: Date;
  };
}

/**
 * PHI Access Logger Service
 *
 * Provides specialized logging for Protected Health Information access
 * with compliance tracking and persistent database storage
 */
@Injectable()
export class PHIAccessLogger implements OnModuleDestroy {
  private readonly logger = new Logger(PHIAccessLogger.name);

  constructor(
    @InjectModel(AuditLog) private readonly auditLogModel: typeof AuditLog,
    @InjectModel(PhiDisclosureAudit) private readonly phiDisclosureAuditModel: typeof PhiDisclosureAudit,
  ) {
    this.logger.log('PHI Access Logger Service initialized with database persistence');
  }

  /**
   * Log PHI access with structured details and database persistence
   */
  async logPHIAccess(entry: PHIAccessLogEntry): Promise<void> {
    try {
      // Create audit log entry for PHI access
      const auditEntry = {
        action: this.mapOperationToAuditAction(entry.operation),
        entityType: 'PHI_ACCESS',
        entityId: entry.studentId || entry.correlationId,
        userId: entry.userId || null,
        userName: null, // Would need to be populated from user service
        changes: {
          operation: entry.operation,
          dataTypes: entry.dataTypes,
          recordCount: entry.recordCount,
          sensitivityLevel: entry.sensitivityLevel,
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
          success: entry.success
        },
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
        isPHI: true,
        complianceType: ComplianceType.HIPAA,
        severity: this.determineSeverity(entry),
        success: entry.success,
        tags: ['phi-access', entry.sensitivityLevel.toLowerCase()],
        metadata: {
          correlationId: entry.correlationId,
          studentId: entry.studentId,
          dataTypes: entry.dataTypes,
          sensitivityLevel: entry.sensitivityLevel
        }
      };

      await this.auditLogModel.create(auditEntry);

      // Create structured log message
      const logMessage = this.formatPHIAccessLog(entry);

      // Log with appropriate level based on sensitivity
      if (entry.sensitivityLevel === 'SENSITIVE_PHI') {
        this.logger.warn(`[PHI_SENSITIVE] ${logMessage}`);
      } else {
        this.logger.log(`[PHI_ACCESS] ${logMessage}`);
      }

      // Check for suspicious patterns
      await this.detectSuspiciousActivity(entry);

      // Log to compliance system (placeholder for actual implementation)
      await this.logToComplianceSystem(entry);

    } catch (error) {
      this.logger.error(`Failed to log PHI access for correlationId ${entry.correlationId}:`, error);
      // Fallback to console logging if database logging fails
      console.error('PHI ACCESS LOGGING FAILURE:', entry);
    }
  }

  /**
   * Log security incidents related to PHI access with database persistence
   */
  async logSecurityIncident(incident: SecurityIncidentEntry): Promise<void> {
    try {
      // Create audit log entry for security incident
      const auditEntry = {
        action: AuditAction.UPDATE, // Using UPDATE as closest match for security incident
        entityType: 'PHI_SECURITY',
        entityId: incident.correlationId,
        userId: incident.userId || null,
        userName: null,
        changes: {
          incidentType: incident.incidentType,
          operation: incident.operation,
          errorMessage: incident.errorMessage,
          severity: incident.severity
        },
        ipAddress: incident.ipAddress,
        userAgent: null,
        isPHI: true,
        complianceType: ComplianceType.HIPAA,
        severity: this.mapIncidentSeverityToAuditSeverity(incident.severity),
        success: false,
        tags: ['security-incident', incident.severity.toLowerCase()],
        metadata: {
          incidentType: incident.incidentType,
          correlationId: incident.correlationId
        }
      };

      await this.auditLogModel.create(auditEntry);

      // Log security incident
      const incidentMessage = this.formatSecurityIncidentLog(incident);
      this.logger.error(`[SECURITY_INCIDENT] ${incidentMessage}`);

      // Additional security monitoring could be triggered here
      await this.triggerSecurityAlert(incident);

    } catch (error) {
      this.logger.error(`Failed to log security incident for correlationId ${incident.correlationId}:`, error);
      // Fallback logging
      console.error('SECURITY INCIDENT LOGGING FAILURE:', incident);
    }
  }

  /**
   * Get PHI access statistics from database
   */
  async getPHIAccessStatistics(
    startDate: Date,
    endDate: Date,
    userId?: string,
    studentId?: string
  ): Promise<PHIAccessStatistics> {
    try {
      const whereClause: any = {
        createdAt: {
          [Op.between]: [startDate, endDate]
        },
        entityType: 'PHI_ACCESS'
      };

      if (userId) {
        whereClause.userId = userId;
      }

      if (studentId) {
        whereClause.entityId = studentId;
      }

      const auditLogs = await this.auditLogModel.findAll({
        where: whereClause,
        attributes: [
          'userId',
          'entityId',
          'changes',
          'action'
        ]
      });

      // Aggregate statistics
      const uniqueUsers = new Set();
      const uniqueStudents = new Set();
      const operationCounts: Record<string, number> = {};
      const dataTypeCounts: Record<string, number> = {};

      auditLogs.forEach(log => {
        if (log.userId) uniqueUsers.add(log.userId);
        if (log.entityId) uniqueStudents.add(log.entityId);

        const changes = log.changes as any;
        if (changes?.operation) {
          operationCounts[changes.operation] = (operationCounts[changes.operation] || 0) + 1;
        }

        if (changes?.dataTypes) {
          changes.dataTypes.forEach((dataType: string) => {
            dataTypeCounts[dataType] = (dataTypeCounts[dataType] || 0) + 1;
          });
        }
      });

      // Get security incidents count
      const securityIncidents = await this.auditLogModel.count({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate]
          },
          action: AuditAction.UPDATE, // Using UPDATE for security incident logging
          entityType: 'PHI_SECURITY'
        }
      });

      return {
        totalAccesses: auditLogs.length,
        uniqueUsers: uniqueUsers.size,
        uniqueStudents: uniqueStudents.size,
        operationCounts,
        dataTypeCounts,
        securityIncidents,
        period: {
          start: startDate,
          end: endDate
        }
      };

    } catch (error) {
      this.logger.error('Failed to retrieve PHI access statistics:', error);
      return {
        totalAccesses: 0,
        uniqueUsers: 0,
        uniqueStudents: 0,
        operationCounts: {},
        dataTypeCounts: {},
        securityIncidents: 0,
        period: { start: startDate, end: endDate }
      };
    }
  }

  /**
   * Get recent PHI access logs with pagination
   */
  async getRecentPHIAccessLogs(
    limit: number = 100,
    offset: number = 0,
    userId?: string,
    studentId?: string
  ): Promise<PHIAccessLogEntry[]> {
    try {
      const whereClause: any = {
        entityType: 'PHI_ACCESS'
      };

      if (userId) {
        whereClause.userId = userId;
      }

      if (studentId) {
        whereClause.entityId = studentId;
      }

      const auditLogs = await this.auditLogModel.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });

      return auditLogs.map(log => {
        const changes = log.changes as any;
        return {
          correlationId: changes?.correlationId || log.id || '',
          timestamp: log.createdAt || new Date(),
          userId: log.userId || undefined,
          studentId: log.entityId || undefined,
          operation: changes?.operation || 'UNKNOWN',
          dataTypes: changes?.dataTypes || [],
          recordCount: changes?.recordCount || 1,
          sensitivityLevel: changes?.sensitivityLevel || 'PHI',
          ipAddress: changes?.ipAddress || log.ipAddress || '',
          userAgent: changes?.userAgent || log.userAgent || '',
          success: changes?.success !== false
        };
      });

    } catch (error) {
      this.logger.error('Failed to retrieve recent PHI access logs:', error);
      return [];
    }
  }

  /**
   * Log PHI disclosure for compliance tracking
   */
  async logPHIDisclosure(
    disclosureId: string,
    action: string,
    changes?: any,
    performedBy?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await this.phiDisclosureAuditModel.create({
        disclosureId,
        action,
        changes,
        performedBy: performedBy || 'system',
        ipAddress,
        userAgent
      });

      this.logger.log(`PHI disclosure logged: ${disclosureId}, action: ${action}`);

    } catch (error) {
      this.logger.error(`Failed to log PHI disclosure for ${disclosureId}:`, error);
    }
  }

  /**
   * Map operation string to AuditAction enum
   */
  private mapOperationToAuditAction(operation: string): AuditAction {
    const operationMap: Record<string, AuditAction> = {
      'READ': AuditAction.READ,
      'CREATE': AuditAction.CREATE,
      'UPDATE': AuditAction.UPDATE,
      'DELETE': AuditAction.DELETE,
      'EXPORT': AuditAction.EXPORT,
      'SEARCH': AuditAction.VIEW,
      'CACHE_READ': AuditAction.READ,
      'CACHE_WRITE': AuditAction.UPDATE
    };

    return operationMap[operation] || AuditAction.READ;
  }

  /**
   * Determine audit severity based on PHI access entry
   */
  private determineSeverity(entry: PHIAccessLogEntry): AuditSeverity {
    if (entry.sensitivityLevel === 'SENSITIVE_PHI') {
      return AuditSeverity.HIGH;
    }

    if (entry.recordCount > 100) {
      return AuditSeverity.MEDIUM;
    }

    if (!entry.success) {
      return AuditSeverity.MEDIUM;
    }

    return AuditSeverity.LOW;
  }

  /**
   * Map incident severity to audit severity
   */
  private mapIncidentSeverityToAuditSeverity(severity: string): AuditSeverity {
    const severityMap: Record<string, AuditSeverity> = {
      'LOW': AuditSeverity.LOW,
      'MEDIUM': AuditSeverity.MEDIUM,
      'HIGH': AuditSeverity.HIGH,
      'CRITICAL': AuditSeverity.CRITICAL
    };

    return severityMap[severity] || AuditSeverity.MEDIUM;
  }

  /**
   * Format PHI access log message
   */
  private formatPHIAccessLog(entry: PHIAccessLogEntry): string {
    return `PHI Access - User: ${entry.userId || 'unknown'}, Student: ${entry.studentId || 'unknown'}, ` +
           `Operation: ${entry.operation}, DataTypes: [${entry.dataTypes.join(', ')}], ` +
           `Records: ${entry.recordCount}, Level: ${entry.sensitivityLevel}, ` +
           `Success: ${entry.success}, IP: ${entry.ipAddress}`;
  }

  /**
   * Format security incident log message
   */
  private formatSecurityIncidentLog(incident: SecurityIncidentEntry): string {
    return `Security Incident - Type: ${incident.incidentType}, User: ${incident.userId || 'unknown'}, ` +
           `Operation: ${incident.operation}, Severity: ${incident.severity}, ` +
           `IP: ${incident.ipAddress}, Message: ${incident.errorMessage}`;
  }

  /**
   * Detect suspicious activity patterns
   */
  private async detectSuspiciousActivity(entry: PHIAccessLogEntry): Promise<void> {
    try {
      // Check for unusual access patterns
      const recentAccesses = await this.auditLogModel.count({
        where: {
          userId: entry.userId,
          entityType: 'PHI_ACCESS',
          createdAt: {
            [Op.gte]: new Date(Date.now() - 60 * 60 * 1000) // Last hour
          }
        }
      });

      // Flag high-frequency access
      if (recentAccesses > 50) {
        await this.logSecurityIncident({
          correlationId: entry.correlationId,
          timestamp: new Date(),
          incidentType: 'HIGH_FREQUENCY_PHI_ACCESS',
          userId: entry.userId,
          ipAddress: entry.ipAddress,
          operation: entry.operation,
          errorMessage: `High frequency PHI access detected: ${recentAccesses} accesses in last hour`,
          severity: 'MEDIUM'
        });
      }

      // Check for access to multiple students rapidly
      if (entry.studentId) {
        const studentAccesses = await this.auditLogModel.count({
          where: {
            userId: entry.userId,
            entityType: 'PHI_ACCESS',
            createdAt: {
              [Op.gte]: new Date(Date.now() - 30 * 60 * 1000) // Last 30 minutes
            }
          }
        });

        if (studentAccesses > 20) {
          await this.logSecurityIncident({
            correlationId: entry.correlationId,
            timestamp: new Date(),
            incidentType: 'MULTIPLE_STUDENT_ACCESS',
            userId: entry.userId,
            ipAddress: entry.ipAddress,
            operation: entry.operation,
            errorMessage: `Multiple student access detected: ${studentAccesses} students in last 30 minutes`,
            severity: 'HIGH'
          });
        }
      }

    } catch (error) {
      this.logger.error('Failed to detect suspicious activity:', error);
    }
  }

  /**
   * Log to external compliance system
   */
  private async logToComplianceSystem(entry: PHIAccessLogEntry): Promise<void> {
    // Placeholder for integration with external compliance systems
    // Could send to SIEM, compliance databases, etc.
    this.logger.debug(`Compliance system logging for PHI access: ${entry.correlationId}`);
  }

  /**
   * Trigger security alert for critical incidents
   */
  private async triggerSecurityAlert(incident: SecurityIncidentEntry): Promise<void> {
    // Placeholder for security alert system integration
    // Could send emails, SMS, trigger workflows, etc.
    this.logger.warn(`Security alert triggered for incident: ${incident.incidentType}`);
  }

  /**
   * Cleanup resources when service is destroyed
   */
  onModuleDestroy(): void {
    this.logger.log('PHI Access Logger Service destroyed');
  }
}