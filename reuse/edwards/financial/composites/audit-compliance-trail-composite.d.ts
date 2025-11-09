/**
 * LOC: AUDCOMPCOMP001
 * File: /reuse/edwards/financial/composites/audit-compliance-trail-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../audit-trail-compliance-kit
 *   - ../financial-workflow-approval-kit
 *   - ../financial-reporting-analytics-kit
 *   - ../financial-close-automation-kit
 *   - ../dimension-management-kit
 *
 * DOWNSTREAM (imported by):
 *   - Backend audit and compliance controllers
 *   - SOX compliance reporting services
 *   - Security audit services
 *   - Regulatory reporting modules
 *   - Forensic analysis tools
 */
/**
 * File: /reuse/edwards/financial/composites/audit-compliance-trail-composite.ts
 * Locator: WC-EDW-AUDCOMP-COMPOSITE-001
 * Purpose: Comprehensive Audit & Compliance Trail Composite - Audit logging, change tracking, compliance reporting, SOX controls, segregation of duties
 *
 * Upstream: Composes functions from audit-trail-compliance-kit, financial-workflow-approval-kit,
 *           financial-reporting-analytics-kit, financial-close-automation-kit, dimension-management-kit
 * Downstream: ../backend/audit/*, Compliance Services, SOX Reporting, Security Audit, Regulatory Reporting, Forensic Analysis
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 composite functions for audit trails, compliance, SOX controls, change tracking, security audits, data retention, forensics
 *
 * LLM Context: Enterprise-grade audit and compliance trail composite for White Cross healthcare platform.
 * Provides comprehensive audit logging with complete change tracking, user activity monitoring, data lineage trails,
 * SOX 404 compliance reporting, FISMA compliance, segregation of duties enforcement, approval trail tracking,
 * compliance certifications, regulatory reporting, security audit trails, access control logging, transaction history,
 * forensic analysis capabilities, data retention policies, and HIPAA-compliant audit infrastructure. Competes with
 * Oracle JD Edwards EnterpriseOne with production-ready audit and compliance infrastructure for healthcare regulatory requirements.
 *
 * Audit & Compliance Design Principles:
 * - Complete audit trail for all financial transactions
 * - Immutable audit log entries with tamper detection
 * - Real-time change tracking with before/after values
 * - Comprehensive user activity monitoring
 * - SOX 404 control testing and documentation
 * - Automated segregation of duties checking
 * - Data lineage tracking for compliance
 * - Retention policy enforcement
 * - Forensic analysis and investigation support
 * - HIPAA and healthcare regulatory compliance
 */
import { Transaction } from 'sequelize';
import { type AuditLogEntry, type ChangeTrackingRecord, type UserActivityLog, type DataLineageNode, type SOXControl, type SOXControlTest, type SecurityAuditEvent, type AccessControlLog, type ComplianceCertification } from '../audit-trail-compliance-kit';
/**
 * Comprehensive audit configuration
 */
export interface AuditComplianceConfig {
    enableAuditLogging: boolean;
    enableChangeTracking: boolean;
    enableUserActivityMonitoring: boolean;
    enableDataLineageTracking: boolean;
    retentionPeriodDays: number;
    archiveAfterDays: number;
    soxComplianceEnabled: boolean;
    fismaComplianceEnabled: boolean;
    hipaaComplianceEnabled: boolean;
    realTimeMonitoring: boolean;
    alertingEnabled: boolean;
    alertRecipients: string[];
}
/**
 * Complete audit trail package
 */
export interface CompleteAuditTrailPackage {
    packageId: string;
    generatedDate: Date;
    period: {
        startDate: Date;
        endDate: Date;
    };
    auditLogs: AuditLogEntry[];
    changeRecords: ChangeTrackingRecord[];
    userActivities: UserActivityLog[];
    dataLineageTrails: DataLineageNode[][];
    soxControlTests: SOXControlTest[];
    securityEvents: SecurityAuditEvent[];
    accessControlLogs: AccessControlLog[];
    totalRecords: number;
    integrityValidation: {
        valid: boolean;
        errors: string[];
    };
}
/**
 * SOX compliance package
 */
export interface SOXCompliancePackage {
    packageId: string;
    fiscalYear: number;
    fiscalQuarter: number;
    controls: SOXControl[];
    controlTests: Map<number, SOXControlTest[]>;
    effectiveness: Map<number, 'effective' | 'ineffective' | 'not_tested'>;
    deficiencies: SOXDeficiency[];
    certifications: ComplianceCertification[];
    overallAssessment: 'effective' | 'material_weakness' | 'significant_deficiency';
}
/**
 * SOX deficiency
 */
export interface SOXDeficiency {
    deficiencyId: string;
    controlId: number;
    controlName: string;
    deficiencyType: 'material_weakness' | 'significant_deficiency' | 'control_deficiency';
    description: string;
    impact: string;
    remediation: string;
    remediationOwner: string;
    remediationDeadline: Date;
    status: 'open' | 'in_progress' | 'remediated' | 'accepted_risk';
}
/**
 * Segregation of duties report
 */
export interface SegregationOfDutiesReport {
    reportId: string;
    reportDate: Date;
    violations: SODViolation[];
    potentialConflicts: SODConflict[];
    userRoleMatrix: Map<string, string[]>;
    recommendations: string[];
    criticalViolations: number;
    highRiskConflicts: number;
}
/**
 * SOD violation
 */
export interface SODViolation {
    violationId: string;
    userId: string;
    userName: string;
    conflictingRoles: string[];
    conflictingPermissions: string[];
    severity: 'critical' | 'high' | 'medium' | 'low';
    firstDetected: Date;
    transactions: string[];
    recommendation: string;
}
/**
 * SOD conflict
 */
export interface SODConflict {
    conflictId: string;
    role1: string;
    role2: string;
    conflictType: string;
    description: string;
    risk: 'high' | 'medium' | 'low';
    mitigatingControls: string[];
}
/**
 * Compliance certification package
 */
export interface ComplianceCertificationPackage {
    certificationId: string;
    certificationType: 'SOX' | 'FISMA' | 'HIPAA' | 'GDPR' | 'SOC2';
    certificationPeriod: {
        startDate: Date;
        endDate: Date;
    };
    certifiedBy: string;
    certificationDate: Date;
    certificationStatus: 'certified' | 'certified_with_exceptions' | 'not_certified';
    certificationEvidence: CertificationEvidence[];
    exceptions: string[];
    nextReviewDate: Date;
}
/**
 * Certification evidence
 */
export interface CertificationEvidence {
    evidenceId: string;
    evidenceType: 'control_test' | 'audit_log' | 'report' | 'documentation';
    description: string;
    documentPath?: string;
    verifiedBy: string;
    verificationDate: Date;
}
/**
 * Forensic investigation
 */
export interface ForensicInvestigation {
    investigationId: string;
    investigationType: 'fraud' | 'unauthorized_access' | 'data_breach' | 'policy_violation' | 'anomaly';
    initiatedBy: string;
    initiatedDate: Date;
    status: 'open' | 'investigating' | 'findings_documented' | 'closed';
    scope: ForensicScope;
    findings: ForensicFinding[];
    evidence: ForensicEvidence[];
    timeline: ForensicTimelineEvent[];
    recommendations: string[];
    closedBy?: string;
    closedDate?: Date;
}
/**
 * Forensic scope
 */
export interface ForensicScope {
    entities: number[];
    users: string[];
    dateRange: {
        startDate: Date;
        endDate: Date;
    };
    transactionTypes: string[];
    accountCodes: string[];
    suspiciousPatterns: string[];
}
/**
 * Forensic finding
 */
export interface ForensicFinding {
    findingId: string;
    findingType: 'confirmed' | 'suspected' | 'ruled_out';
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    evidence: string[];
    impactAssessment: string;
    recommendation: string;
}
/**
 * Forensic evidence
 */
export interface ForensicEvidence {
    evidenceId: string;
    evidenceType: 'audit_log' | 'transaction' | 'change_record' | 'user_activity' | 'system_log';
    evidenceData: any;
    collectedDate: Date;
    collectedBy: string;
    chainOfCustody: ChainOfCustodyEntry[];
}
/**
 * Chain of custody entry
 */
export interface ChainOfCustodyEntry {
    timestamp: Date;
    action: 'collected' | 'transferred' | 'analyzed' | 'stored' | 'disposed';
    performedBy: string;
    notes: string;
}
/**
 * Forensic timeline event
 */
export interface ForensicTimelineEvent {
    eventId: string;
    timestamp: Date;
    eventType: string;
    description: string;
    involvedUsers: string[];
    involvedTransactions: string[];
    significance: 'critical' | 'high' | 'medium' | 'low';
}
/**
 * Data retention policy
 */
export interface DataRetentionPolicy {
    policyId: string;
    policyName: string;
    dataType: string;
    retentionPeriodDays: number;
    archiveAfterDays: number;
    purgeAfterDays: number;
    legalHoldExemption: boolean;
    regulatoryRequirement: string;
    approvedBy: string;
    effectiveDate: Date;
}
/**
 * Compliance metrics dashboard
 */
export interface ComplianceMetricsDashboard {
    dashboardId: string;
    generatedDate: Date;
    metrics: ComplianceMetric[];
    trends: ComplianceTrend[];
    alerts: ComplianceAlert[];
    recommendations: string[];
    overallScore: number;
    complianceLevel: 'excellent' | 'good' | 'needs_improvement' | 'critical';
}
/**
 * Compliance metric
 */
export interface ComplianceMetric {
    metricId: string;
    metricName: string;
    metricType: 'control_effectiveness' | 'audit_coverage' | 'issue_resolution' | 'user_compliance';
    currentValue: number;
    targetValue: number;
    threshold: number;
    status: 'on_target' | 'at_risk' | 'off_target';
    trend: 'improving' | 'stable' | 'declining';
}
/**
 * Compliance trend
 */
export interface ComplianceTrend {
    trendId: string;
    metricName: string;
    period: string;
    dataPoints: {
        date: Date;
        value: number;
    }[];
    trendDirection: 'up' | 'down' | 'stable';
    significantChange: boolean;
}
/**
 * Compliance alert
 */
export interface ComplianceAlert {
    alertId: string;
    alertType: 'violation' | 'threshold_breach' | 'control_failure' | 'anomaly';
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    detectedDate: Date;
    affectedControls: string[];
    requiredAction: string;
    assignedTo?: string;
    status: 'new' | 'acknowledged' | 'investigating' | 'resolved';
}
/**
 * Generates complete audit trail package for period
 * Composes: queryAuditLogs, trackFieldChange, logUserActivity, buildDataLineageTrail, validateDataIntegrity
 */
export declare const generateCompleteAuditTrailPackage: (sequelize: any, startDate: Date, endDate: Date, includeDataLineage: boolean, userId: string, transaction?: Transaction) => Promise<CompleteAuditTrailPackage>;
/**
 * Tracks comprehensive change with approval workflow integration
 * Composes: trackFieldChange, getWorkflowStatus, createAuditLog
 */
export declare const trackChangeWithApprovalWorkflow: (sequelize: any, tableName: string, recordId: number, fieldName: string, oldValue: any, newValue: any, userId: string, workflowInstanceId?: number, transaction?: Transaction) => Promise<{
    change: ChangeTrackingRecord;
    approvalStatus?: string;
    auditLogId: number;
}>;
/**
 * Generates comprehensive SOX compliance package
 * Composes: createSOXControl, recordSOXControlTest, performAutomatedControlTest, createComplianceCertification
 */
export declare const generateSOXCompliancePackage: (sequelize: any, fiscalYear: number, fiscalQuarter: number, userId: string, transaction?: Transaction) => Promise<SOXCompliancePackage>;
/**
 * Performs automated SOX control testing
 * Composes: performAutomatedControlTest, recordSOXControlTest, createAuditLog
 */
export declare const performAutomatedSOXControlTesting: (sequelize: any, controlIds: number[], testDate: Date, userId: string, transaction?: Transaction) => Promise<{
    testsPerformed: number;
    testsPassed: number;
    testsFailed: number;
    results: SOXControlTest[];
}>;
/**
 * Generates comprehensive segregation of duties report
 * Composes: detectSegregationOfDutiesViolations, createAuditLog
 */
export declare const generateSegregationOfDutiesReport: (sequelize: any, userId: string, transaction?: Transaction) => Promise<SegregationOfDutiesReport>;
/**
 * Initiates comprehensive forensic investigation
 * Composes: initiateForensicAnalysis, queryAuditLogs, getTransactionHistory, buildDataLineageTrail
 */
export declare const initiateComprehensiveForensicInvestigation: (sequelize: any, investigationType: "fraud" | "unauthorized_access" | "data_breach" | "policy_violation" | "anomaly", scope: ForensicScope, userId: string, transaction?: Transaction) => Promise<ForensicInvestigation>;
/**
 * Generates comprehensive compliance metrics dashboard
 * Composes: monitorComplianceMetrics, generateComplianceDashboard, calculateFinancialKPIs
 */
export declare const generateComprehensiveComplianceMetricsDashboard: (sequelize: any, userId: string, transaction?: Transaction) => Promise<ComplianceMetricsDashboard>;
/**
 * Exports comprehensive compliance data for external audit
 * Composes: exportComplianceData, generateCompleteAuditTrailPackage, generateSOXCompliancePackage
 */
export declare const exportComprehensiveComplianceDataForAudit: (sequelize: any, fiscalYear: number, exportFormat: "json" | "xml" | "csv", userId: string, transaction?: Transaction) => Promise<{
    exportId: string;
    auditTrailPackage: CompleteAuditTrailPackage;
    soxPackages: SOXCompliancePackage[];
    sodReport: SegregationOfDutiesReport;
    exportPath: string;
    exportSize: number;
}>;
export { generateCompleteAuditTrailPackage, trackChangeWithApprovalWorkflow, generateSOXCompliancePackage, performAutomatedSOXControlTesting, generateSegregationOfDutiesReport, initiateComprehensiveForensicInvestigation, generateComprehensiveComplianceMetricsDashboard, exportComprehensiveComplianceDataForAudit, };
//# sourceMappingURL=audit-compliance-trail-composite.d.ts.map