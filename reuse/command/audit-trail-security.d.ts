/**
 * LOC: CMD_AUDIT_SEC_001
 * File: /reuse/command/audit-trail-security.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - crypto
 *   - winston
 *
 * DOWNSTREAM (imported by):
 *   - Audit services
 *   - Compliance services
 *   - Security monitoring
 *   - Forensic analysis
 *   - Reporting services
 *   - HIPAA compliance modules
 */
import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { z } from 'zod';
/**
 * Audit event types
 */
export declare enum AuditEventType {
    LOGIN = "auth.login",
    LOGOUT = "auth.logout",
    LOGIN_FAILED = "auth.login_failed",
    PASSWORD_CHANGE = "auth.password_change",
    MFA_ENABLED = "auth.mfa_enabled",
    MFA_DISABLED = "auth.mfa_disabled",
    ACCESS_GRANTED = "access.granted",
    ACCESS_DENIED = "access.denied",
    PRIVILEGE_ESCALATION = "access.privilege_escalation",
    EMERGENCY_OVERRIDE = "access.emergency_override",
    DATA_CREATE = "data.create",
    DATA_READ = "data.read",
    DATA_UPDATE = "data.update",
    DATA_DELETE = "data.delete",
    DATA_EXPORT = "data.export",
    PHI_ACCESS = "data.phi_access",
    PII_ACCESS = "data.pii_access",
    INCIDENT_CREATE = "incident.create",
    INCIDENT_UPDATE = "incident.update",
    INCIDENT_ASSIGN = "incident.assign",
    INCIDENT_CLOSE = "incident.close",
    INCIDENT_REOPEN = "incident.reopen",
    SECURITY_ALERT = "security.alert",
    SUSPICIOUS_ACTIVITY = "security.suspicious_activity",
    POLICY_VIOLATION = "security.policy_violation",
    ENCRYPTION_KEY_ROTATED = "security.key_rotated",
    COMPLIANCE_AUDIT = "compliance.audit",
    DATA_RETENTION = "compliance.retention",
    GDPR_REQUEST = "compliance.gdpr_request",
    HIPAA_BREACH = "compliance.hipaa_breach",
    SYSTEM_CONFIG_CHANGE = "system.config_change",
    SYSTEM_BACKUP = "system.backup",
    SYSTEM_RESTORE = "system.restore"
}
/**
 * Audit severity levels
 */
export declare enum AuditSeverity {
    INFO = "info",
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
/**
 * Compliance frameworks
 */
export declare enum ComplianceFramework {
    HIPAA = "hipaa",
    CJIS = "cjis",
    GDPR = "gdpr",
    PCI_DSS = "pci_dss",
    SOC2 = "soc2",
    ISO27001 = "iso27001"
}
/**
 * Retention policies
 */
export declare enum RetentionPolicy {
    DAYS_30 = 30,
    DAYS_90 = 90,
    DAYS_180 = 180,
    YEAR_1 = 365,
    YEARS_7 = 2555,
    PERMANENT = -1
}
/**
 * Audit log entry interface
 */
export interface IAuditLog {
    id: string;
    eventType: AuditEventType;
    severity: AuditSeverity;
    userId?: string;
    userName?: string;
    ipAddress: string;
    userAgent?: string;
    resource: string;
    resourceId?: string;
    action: string;
    outcome: 'success' | 'failure';
    details?: Record<string, any>;
    metadata?: Record<string, any>;
    timestamp: Date;
    sessionId?: string;
    requestId?: string;
    hash?: string;
    previousHash?: string;
}
/**
 * Change tracking entry
 */
export interface IChangeLog {
    id: string;
    entityType: string;
    entityId: string;
    operation: 'create' | 'update' | 'delete';
    userId: string;
    timestamp: Date;
    before?: Record<string, any>;
    after?: Record<string, any>;
    changes: IFieldChange[];
    reason?: string;
}
/**
 * Field change details
 */
export interface IFieldChange {
    field: string;
    oldValue: any;
    newValue: any;
    dataType: string;
}
/**
 * Access log entry
 */
export interface IAccessLog {
    id: string;
    userId: string;
    resource: string;
    resourceId: string;
    resourceType: string;
    accessType: 'read' | 'write' | 'delete' | 'export';
    timestamp: Date;
    duration?: number;
    ipAddress: string;
    location?: string;
    deviceInfo?: string;
    justification?: string;
}
/**
 * Security event
 */
export interface ISecurityEvent {
    id: string;
    eventType: string;
    severity: AuditSeverity;
    description: string;
    source: string;
    userId?: string;
    ipAddress?: string;
    timestamp: Date;
    resolved: boolean;
    resolvedAt?: Date;
    resolvedBy?: string;
    indicators: string[];
    mitigationActions?: string[];
}
/**
 * Compliance report
 */
export interface IComplianceReport {
    id: string;
    framework: ComplianceFramework;
    reportType: string;
    startDate: Date;
    endDate: Date;
    generatedAt: Date;
    generatedBy: string;
    findings: IComplianceFinding[];
    summary: Record<string, any>;
}
/**
 * Compliance finding
 */
export interface IComplianceFinding {
    control: string;
    description: string;
    severity: AuditSeverity;
    evidence: string[];
    status: 'compliant' | 'non_compliant' | 'partial';
    remediation?: string;
}
/**
 * Forensic snapshot
 */
export interface IForensicSnapshot {
    id: string;
    incidentId: string;
    capturedAt: Date;
    capturedBy: string;
    systemState: Record<string, any>;
    userSessions: any[];
    activeConnections: any[];
    recentLogs: IAuditLog[];
    hash: string;
}
/**
 * Audit log creation schema
 */
export declare const AuditLogSchema: any;
/**
 * Change log creation schema
 */
export declare const ChangeLogSchema: any;
/**
 * Security event schema
 */
export declare const SecurityEventSchema: any;
/**
 * 1. Create audit log entry
 */
export declare function createAuditLog(event: z.infer<typeof AuditLogSchema>, request: Request): IAuditLog;
/**
 * 2. Create tamper-proof audit chain
 */
export declare function createAuditChain(auditLog: IAuditLog, previousHash?: string): IAuditLog;
/**
 * 3. Verify audit chain integrity
 */
export declare function verifyAuditChain(logs: IAuditLog[]): {
    valid: boolean;
    brokenAt?: number;
};
/**
 * 4. Log PHI access
 */
export declare function logPHIAccess(userId: string, patientId: string, accessType: string, justification?: string, request?: Request): IAuditLog;
/**
 * 5. Log PII access
 */
export declare function logPIIAccess(userId: string, resourceType: string, resourceId: string, fields: string[], request?: Request): IAuditLog;
/**
 * 6. Create change log
 */
export declare function createChangeLog(change: z.infer<typeof ChangeLogSchema>): IChangeLog;
/**
 * 7. Calculate field changes
 */
export declare function calculateFieldChanges(before?: Record<string, any>, after?: Record<string, any>): IFieldChange[];
/**
 * 8. Log security event
 */
export declare function logSecurityEvent(event: z.infer<typeof SecurityEventSchema>): ISecurityEvent;
/**
 * 9. Detect anomalous access patterns
 */
export declare function detectAnomalousAccess(recentAccess: IAccessLog[], currentAccess: IAccessLog): {
    isAnomalous: boolean;
    reasons: string[];
    riskScore: number;
};
/**
 * 11. Generate compliance report
 */
export declare function generateComplianceReport(framework: ComplianceFramework, startDate: Date, endDate: Date, findings: IComplianceFinding[], generatedBy: string): IComplianceReport;
/**
 * 12. Check HIPAA compliance
 */
export declare function checkHIPAACompliance(auditLogs: IAuditLog[]): {
    compliant: boolean;
    violations: string[];
};
/**
 * 13. Check CJIS compliance
 */
export declare function checkCJISCompliance(auditLogs: IAuditLog[]): {
    compliant: boolean;
    violations: string[];
};
/**
 * 14. Apply retention policy
 */
export declare function applyRetentionPolicy(logs: IAuditLog[], policy: RetentionPolicy): {
    retained: IAuditLog[];
    archived: IAuditLog[];
    deleted: IAuditLog[];
};
/**
 * 16. Create forensic snapshot
 */
export declare function createForensicSnapshot(incidentId: string, capturedBy: string, systemState: Record<string, any>, userSessions: any[], activeConnections: any[], recentLogs: IAuditLog[]): IForensicSnapshot;
/**
 * 17. Verify forensic snapshot integrity
 */
export declare function verifyForensicSnapshot(snapshot: IForensicSnapshot): boolean;
/**
 * 18. Track chain of custody
 */
export declare function trackChainOfCustody(evidenceId: string, handler: string, action: string, previousCustody?: string): {
    id: string;
    evidenceId: string;
    handler: string;
    action: string;
    timestamp: Date;
    previousCustody?: string;
    hash: string;
};
/**
 * 19. Aggregate audit logs
 */
export declare function aggregateAuditLogs(logs: IAuditLog[], groupBy: 'user' | 'resource' | 'eventType' | 'hour'): Map<string, IAuditLog[]>;
/**
 * 20. Calculate audit statistics
 */
export declare function calculateAuditStatistics(logs: IAuditLog[]): {
    total: number;
    bySeverity: Record<string, number>;
    byOutcome: Record<string, number>;
    byEventType: Record<string, number>;
    uniqueUsers: number;
    uniqueResources: number;
    timeRange: {
        start: Date;
        end: Date;
    };
};
/**
 * 21. Correlate security events
 */
export declare function correlateSecurityEvents(events: ISecurityEvent[], timeWindow?: number): ISecurityEvent[][];
/**
 * 22. Generate audit summary report
 */
export declare function generateAuditSummary(logs: IAuditLog[], period: 'day' | 'week' | 'month'): {
    period: string;
    statistics: ReturnType<typeof calculateAuditStatistics>;
    topUsers: Array<{
        userId: string;
        count: number;
    }>;
    topResources: Array<{
        resource: string;
        count: number;
    }>;
    securityAlerts: number;
    failureRate: number;
};
/**
 * 23. Encrypt audit log
 */
export declare function encryptAuditLog(log: IAuditLog, encryptionKey: string): string;
/**
 * 24. Decrypt audit log
 */
export declare function decryptAuditLog(encryptedLog: string, encryptionKey: string): IAuditLog;
/**
 * 25. Redact sensitive audit data
 */
export declare function redactSensitiveAuditData(log: IAuditLog): IAuditLog;
/**
 * 26. Search audit logs
 */
export declare function searchAuditLogs(logs: IAuditLog[], criteria: {
    userId?: string;
    eventType?: AuditEventType;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    severity?: AuditSeverity;
    outcome?: 'success' | 'failure';
}): IAuditLog[];
/**
 * 27. Export audit logs
 */
export declare function exportAuditLogs(logs: IAuditLog[], format: 'json' | 'csv' | 'xml'): string;
/**
 * 28. Validate audit log completeness
 */
export declare function validateAuditLogCompleteness(log: IAuditLog): {
    valid: boolean;
    missingFields: string[];
};
/**
 * 29. Calculate compliance score
 */
export declare function calculateComplianceScore(auditLogs: IAuditLog[], framework: ComplianceFramework): {
    score: number;
    maxScore: number;
    percentage: number;
    details: Record<string, any>;
};
/**
 * 30. Generate regulatory report
 */
export declare function generateRegulatoryReport(auditLogs: IAuditLog[], framework: ComplianceFramework, period: {
    start: Date;
    end: Date;
}): {
    framework: ComplianceFramework;
    period: {
        start: Date;
        end: Date;
    };
    generatedAt: Date;
    complianceScore: ReturnType<typeof calculateComplianceScore>;
    criticalEvents: IAuditLog[];
    recommendations: string[];
};
/**
 * 31. Archive audit logs
 */
export declare function archiveAuditLogs(logs: IAuditLog[], compressionLevel?: 'none' | 'low' | 'high'): {
    archiveId: string;
    logCount: number;
    archiveSize: number;
    archiveDate: Date;
};
/**
 * 32. Monitor real-time security events
 */
export declare function monitorSecurityEvents(events: ISecurityEvent[], thresholds: {
    criticalCount: number;
    highCount: number;
    timeWindow: number;
}): {
    alertLevel: 'normal' | 'elevated' | 'high' | 'critical';
    reasons: string[];
};
/**
 * 33. Detect privilege escalation attempts
 */
export declare function detectPrivilegeEscalation(auditLogs: IAuditLog[]): {
    detected: boolean;
    suspiciousActivities: IAuditLog[];
    riskScore: number;
};
/**
 * 34. Generate audit digest
 */
export declare function generateAuditDigest(logs: IAuditLog[]): {
    digest: string;
    logCount: number;
    timestamp: Date;
};
/**
 * 35. Verify audit digest
 */
export declare function verifyAuditDigest(logs: IAuditLog[], expectedDigest: string): boolean;
/**
 * 36. Track data lineage
 */
export declare function trackDataLineage(dataId: string, operation: string, userId: string, changes: IFieldChange[]): {
    id: string;
    dataId: string;
    operation: string;
    userId: string;
    timestamp: Date;
    changes: IFieldChange[];
    lineageHash: string;
};
/**
 * 37. Generate compliance evidence package
 */
export declare function generateComplianceEvidence(auditLogs: IAuditLog[], framework: ComplianceFramework, controlId: string): {
    controlId: string;
    framework: ComplianceFramework;
    evidenceLogs: IAuditLog[];
    summary: string;
    generatedAt: Date;
};
/**
 * 38. Calculate audit coverage
 */
export declare function calculateAuditCoverage(auditLogs: IAuditLog[], totalOperations: number): {
    coverage: number;
    auditedOperations: number;
    totalOperations: number;
    gapAnalysis: string[];
};
/**
 * 39. Generate audit trail visualization data
 */
export declare function generateAuditVisualization(auditLogs: IAuditLog[]): {
    timeline: Array<{
        timestamp: Date;
        count: number;
    }>;
    heatmap: Array<{
        hour: number;
        day: number;
        count: number;
    }>;
    severityDistribution: Record<string, number>;
    userActivity: Array<{
        userId: string;
        activityCount: number;
    }>;
};
/**
 * 40. Detect compliance drift
 */
export declare function detectComplianceDrift(currentLogs: IAuditLog[], baselineLogs: IAuditLog[], framework: ComplianceFramework): {
    driftDetected: boolean;
    driftScore: number;
    changes: string[];
};
/**
 * 41. Create audit alert
 */
export declare function createAuditAlert(severity: AuditSeverity, message: string, logs: IAuditLog[]): {
    id: string;
    severity: AuditSeverity;
    message: string;
    logCount: number;
    createdAt: Date;
    requiresAction: boolean;
};
/**
 * 42. Sanitize audit export
 */
export declare function sanitizeAuditExport(logs: IAuditLog[]): IAuditLog[];
/**
 * 43. Generate audit hash chain
 */
export declare function generateAuditHashChain(logs: IAuditLog[]): IAuditLog[];
/**
 * 44. Calculate audit velocity
 */
export declare function calculateAuditVelocity(logs: IAuditLog[], windowMinutes?: number): {
    eventsPerHour: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    velocity: number;
};
/**
 * 45. Perform audit reconciliation
 */
export declare function performAuditReconciliation(expectedOperations: number, auditLogs: IAuditLog[]): {
    reconciled: boolean;
    discrepancy: number;
    missingLogs: number;
    duplicateLogs: number;
};
/**
 * 46. Generate incident investigation report
 */
export declare function generateIncidentInvestigationReport(incidentId: string, relatedLogs: IAuditLog[], securityEvents: ISecurityEvent[]): {
    incidentId: string;
    investigationId: string;
    timeline: IAuditLog[];
    securityEvents: ISecurityEvent[];
    affectedUsers: string[];
    affectedResources: string[];
    severity: AuditSeverity;
    generatedAt: Date;
};
/**
 * 47. Calculate mean time to detect (MTTD)
 */
export declare function calculateMTTD(securityEvents: ISecurityEvent[]): {
    mttdMinutes: number;
    averageDetectionTime: number;
    fastestDetection: number;
    slowestDetection: number;
};
/**
 * 48. Calculate mean time to respond (MTTR)
 */
export declare function calculateMTTR(securityEvents: ISecurityEvent[]): {
    mttrMinutes: number;
    averageResponseTime: number;
    fastestResponse: number;
    slowestResponse: number;
};
/**
 * 49. Generate executive audit summary
 */
export declare function generateExecutiveSummary(auditLogs: IAuditLog[], securityEvents: ISecurityEvent[], period: {
    start: Date;
    end: Date;
}): {
    period: {
        start: Date;
        end: Date;
    };
    totalEvents: number;
    securityIncidents: number;
    complianceScore: number;
    topRisks: string[];
    recommendations: string[];
    generatedAt: Date;
};
/**
 * 50. Validate audit trail completeness
 */
export declare function validateAuditTrailCompleteness(auditLogs: IAuditLog[], expectedSequence: string[]): {
    complete: boolean;
    missingEvents: string[];
    coverage: number;
};
/**
 * Audit logging interceptor
 */
export declare class AuditLoggingInterceptor implements NestInterceptor {
    private readonly logger;
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private mapMethodToEventType;
    private extractResource;
}
/**
 * Change tracking interceptor
 */
export declare class ChangeTrackingInterceptor implements NestInterceptor {
    private readonly logger;
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private extractEntityType;
    private extractEntityId;
}
//# sourceMappingURL=audit-trail-security.d.ts.map