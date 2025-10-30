/**
 * @fileoverview PHI Access Logger Service
 * @module health-record/services
 * @description Specialized logging service for Protected Health Information (PHI) access
 * 
 * HIPAA CRITICAL - This service provides structured PHI access logging
 * 
 * @compliance HIPAA Privacy Rule §164.308, HIPAA Security Rule §164.312
 * @compliance 45 CFR 164.312(b) - Audit controls
 */

import { Injectable, Logger } from '@nestjs/common';

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
 * with compliance tracking and security incident monitoring
 */
@Injectable()
export class PHIAccessLogger {
  private readonly logger = new Logger(PHIAccessLogger.name);
  private phiAccessLog: PHIAccessLogEntry[] = [];
  private securityIncidents: SecurityIncidentEntry[] = [];
  private readonly maxLogEntries = 10000; // In production, use persistent storage

  /**
   * Log PHI access with structured details
   */
  logPHIAccess(entry: PHIAccessLogEntry): void {
    // Add to in-memory log (in production, write to secure database)
    this.phiAccessLog.push(entry);
    
    // Maintain log size limit
    if (this.phiAccessLog.length > this.maxLogEntries) {
      this.phiAccessLog.shift();
    }

    // Create structured log message
    const logMessage = this.formatPHIAccessLog(entry);
    
    // Log with appropriate level based on sensitivity
    if (entry.sensitivityLevel === 'SENSITIVE_PHI') {
      this.logger.warn(`[PHI_SENSITIVE] ${logMessage}`);
    } else {
      this.logger.log(`[PHI_ACCESS] ${logMessage}`);
    }

    // Check for suspicious patterns
    this.detectSuspiciousActivity(entry);

    // Log to compliance system (placeholder for actual implementation)
    this.logToComplianceSystem(entry);
  }

  /**
   * Log security incidents related to PHI access
   */
  logSecurityIncident(incident: SecurityIncidentEntry): void {
    // Add to security incidents log
    this.securityIncidents.push(incident);
    
    // Maintain incidents log size
    if (this.securityIncidents.length > this.maxLogEntries) {
      this.securityIncidents.shift();
    }

    // Log with severity-appropriate level
    const logLevel = this.getLogLevelForSeverity(incident.severity);
    const logMessage = this.formatSecurityIncident(incident);
    
    this.logger[logLevel](`[SECURITY_INCIDENT] ${logMessage}`);

    // Alert security team for high/critical incidents
    if (incident.severity === 'HIGH' || incident.severity === 'CRITICAL') {
      this.alertSecurityTeam(incident);
    }

    // Log to security monitoring system
    this.logToSecuritySystem(incident);
  }

  /**
   * Get PHI access statistics for compliance reporting
   */
  getPHIAccessStatistics(
    startDate: Date = new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
    endDate: Date = new Date()
  ): PHIAccessStatistics {
    const filteredEntries = this.phiAccessLog.filter(
      entry => entry.timestamp >= startDate && entry.timestamp <= endDate
    );

    const uniqueUsers = new Set(filteredEntries.map(e => e.userId).filter(Boolean)).size;
    const uniqueStudents = new Set(filteredEntries.map(e => e.studentId).filter(Boolean)).size;

    // Count operations
    const operationCounts: Record<string, number> = {};
    filteredEntries.forEach(entry => {
      operationCounts[entry.operation] = (operationCounts[entry.operation] || 0) + 1;
    });

    // Count data types
    const dataTypeCounts: Record<string, number> = {};
    filteredEntries.forEach(entry => {
      entry.dataTypes.forEach(dataType => {
        dataTypeCounts[dataType] = (dataTypeCounts[dataType] || 0) + 1;
      });
    });

    // Count security incidents in period
    const securityIncidents = this.securityIncidents.filter(
      incident => incident.timestamp >= startDate && incident.timestamp <= endDate
    ).length;

    return {
      totalAccesses: filteredEntries.length,
      uniqueUsers,
      uniqueStudents,
      operationCounts,
      dataTypeCounts,
      securityIncidents,
      period: {
        start: startDate,
        end: endDate,
      },
    };
  }

  /**
   * Get recent PHI access entries for audit review
   */
  getRecentPHIAccesses(limit: number = 100): PHIAccessLogEntry[] {
    return this.phiAccessLog
      .slice(-limit)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get security incidents for review
   */
  getSecurityIncidents(limit: number = 50): SecurityIncidentEntry[] {
    return this.securityIncidents
      .slice(-limit)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Search PHI access logs by criteria
   */
  searchPHIAccessLogs(criteria: {
    userId?: string;
    studentId?: string;
    operation?: string;
    dataType?: string;
    startDate?: Date;
    endDate?: Date;
    sensitivityLevel?: PHIAccessLogEntry['sensitivityLevel'];
  }): PHIAccessLogEntry[] {
    return this.phiAccessLog.filter(entry => {
      if (criteria.userId && entry.userId !== criteria.userId) return false;
      if (criteria.studentId && entry.studentId !== criteria.studentId) return false;
      if (criteria.operation && entry.operation !== criteria.operation) return false;
      if (criteria.dataType && !entry.dataTypes.includes(criteria.dataType)) return false;
      if (criteria.startDate && entry.timestamp < criteria.startDate) return false;
      if (criteria.endDate && entry.timestamp > criteria.endDate) return false;
      if (criteria.sensitivityLevel && entry.sensitivityLevel !== criteria.sensitivityLevel) return false;
      return true;
    });
  }

  /**
   * Generate compliance report for HIPAA audit
   */
  generateComplianceReport(
    startDate: Date,
    endDate: Date
  ): {
    summary: PHIAccessStatistics;
    detailedLogs: PHIAccessLogEntry[];
    securityIncidents: SecurityIncidentEntry[];
    complianceMetrics: {
      auditTrailCompleteness: number;
      accessControlViolations: number;
      unauthorizedAttempts: number;
      dataBreachIndicators: number;
    };
  } {
    const summary = this.getPHIAccessStatistics(startDate, endDate);
    const detailedLogs = this.searchPHIAccessLogs({ startDate, endDate });
    const securityIncidents = this.securityIncidents.filter(
      incident => incident.timestamp >= startDate && incident.timestamp <= endDate
    );

    // Calculate compliance metrics
    const complianceMetrics = {
      auditTrailCompleteness: this.calculateAuditCompleteness(detailedLogs),
      accessControlViolations: securityIncidents.filter(i => 
        i.incidentType.includes('ACCESS_VIOLATION')
      ).length,
      unauthorizedAttempts: securityIncidents.filter(i => 
        i.incidentType.includes('UNAUTHORIZED')
      ).length,
      dataBreachIndicators: securityIncidents.filter(i => 
        i.severity === 'CRITICAL'
      ).length,
    };

    return {
      summary,
      detailedLogs,
      securityIncidents,
      complianceMetrics,
    };
  }

  /**
   * Format PHI access log entry for structured logging
   */
  private formatPHIAccessLog(entry: PHIAccessLogEntry): string {
    return [
      `CorrelationID: ${entry.correlationId}`,
      `User: ${entry.userId || 'Anonymous'}`,
      `Student: ${entry.studentId || 'N/A'}`,
      `Operation: ${entry.operation}`,
      `DataTypes: [${entry.dataTypes.join(', ')}]`,
      `Records: ${entry.recordCount}`,
      `Sensitivity: ${entry.sensitivityLevel}`,
      `IP: ${entry.ipAddress}`,
      `Success: ${entry.success}`,
      `Timestamp: ${entry.timestamp.toISOString()}`,
    ].join(' | ');
  }

  /**
   * Format security incident for logging
   */
  private formatSecurityIncident(incident: SecurityIncidentEntry): string {
    return [
      `CorrelationID: ${incident.correlationId}`,
      `Type: ${incident.incidentType}`,
      `User: ${incident.userId || 'Anonymous'}`,
      `IP: ${incident.ipAddress}`,
      `Operation: ${incident.operation}`,
      `Severity: ${incident.severity}`,
      `Error: ${incident.errorMessage}`,
      `Timestamp: ${incident.timestamp.toISOString()}`,
    ].join(' | ');
  }

  /**
   * Get appropriate log level for security incident severity
   */
  private getLogLevelForSeverity(severity: SecurityIncidentEntry['severity']): 'debug' | 'log' | 'warn' | 'error' {
    switch (severity) {
      case 'LOW': return 'debug';
      case 'MEDIUM': return 'log';
      case 'HIGH': return 'warn';
      case 'CRITICAL': return 'error';
      default: return 'log';
    }
  }

  /**
   * Detect suspicious activity patterns
   */
  private detectSuspiciousActivity(entry: PHIAccessLogEntry): void {
    // Check for rapid successive accesses by same user
    const recentAccesses = this.phiAccessLog.filter(log => 
      log.userId === entry.userId && 
      log.timestamp > new Date(Date.now() - 60000) // Last minute
    );

    if (recentAccesses.length > 10) {
      this.logSecurityIncident({
        correlationId: entry.correlationId,
        timestamp: new Date(),
        incidentType: 'RAPID_PHI_ACCESS',
        userId: entry.userId,
        ipAddress: entry.ipAddress,
        operation: entry.operation,
        errorMessage: `Rapid PHI access detected: ${recentAccesses.length} accesses in 1 minute`,
        severity: 'MEDIUM',
      });
    }

    // Check for unusual data volume access
    if (entry.recordCount > 100) {
      this.logSecurityIncident({
        correlationId: entry.correlationId,
        timestamp: new Date(),
        incidentType: 'BULK_PHI_ACCESS',
        userId: entry.userId,
        ipAddress: entry.ipAddress,
        operation: entry.operation,
        errorMessage: `Large volume PHI access: ${entry.recordCount} records`,
        severity: 'MEDIUM',
      });
    }

    // Check for access outside business hours (placeholder - would use actual business hours)
    const hour = entry.timestamp.getHours();
    if (hour < 6 || hour > 22) {
      this.logSecurityIncident({
        correlationId: entry.correlationId,
        timestamp: new Date(),
        incidentType: 'AFTER_HOURS_PHI_ACCESS',
        userId: entry.userId,
        ipAddress: entry.ipAddress,
        operation: entry.operation,
        errorMessage: `PHI access outside business hours: ${hour}:00`,
        severity: 'LOW',
      });
    }
  }

  /**
   * Alert security team for high-severity incidents
   */
  private alertSecurityTeam(incident: SecurityIncidentEntry): void {
    // Placeholder for actual security team alerting system
    this.logger.error(
      `[SECURITY_ALERT] High-severity incident requires immediate attention: ${incident.incidentType}`
    );
    
    // In production, this would:
    // - Send email alerts
    // - Create security tickets
    // - Integrate with SIEM systems
    // - Trigger automated responses
  }

  /**
   * Log to compliance system
   */
  private logToComplianceSystem(entry: PHIAccessLogEntry): void {
    // Placeholder for compliance system integration
    this.logger.debug(
      `[COMPLIANCE_LOG] PHI access logged for audit trail: ${entry.correlationId}`
    );
    
    // In production, this would integrate with:
    // - HIPAA compliance databases
    // - Audit management systems
    // - Legal compliance platforms
  }

  /**
   * Log to security monitoring system
   */
  private logToSecuritySystem(incident: SecurityIncidentEntry): void {
    // Placeholder for security system integration
    this.logger.debug(
      `[SECURITY_LOG] Security incident logged: ${incident.correlationId}`
    );
    
    // In production, this would integrate with:
    // - SIEM systems (Splunk, ELK, etc.)
    // - Security orchestration platforms
    // - Threat intelligence systems
  }

  /**
   * Calculate audit trail completeness percentage
   */
  private calculateAuditCompleteness(logs: PHIAccessLogEntry[]): number {
    if (logs.length === 0) return 100;
    
    // Check for required fields in audit logs
    const requiredFields = ['correlationId', 'userId', 'operation', 'timestamp'];
    let completeEntries = 0;
    
    logs.forEach(log => {
      const hasAllFields = requiredFields.every(field => 
        log[field as keyof PHIAccessLogEntry] != null
      );
      if (hasAllFields) completeEntries++;
    });
    
    return Math.round((completeEntries / logs.length) * 100);
  }

  /**
   * Clear logs (for testing/maintenance - use with extreme caution)
   */
  clearLogs(): void {
    this.logger.warn('[MAINTENANCE] Clearing PHI access logs - This should only be done during maintenance');
    this.phiAccessLog = [];
    this.securityIncidents = [];
  }
}
