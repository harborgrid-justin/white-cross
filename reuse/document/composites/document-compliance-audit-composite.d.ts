/**
 * LOC: DOCCOMPAUDIT001
 * File: /reuse/document/composites/document-compliance-audit-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ../document-compliance-advanced-kit
 *   - ../document-audit-trail-advanced-kit
 *   - ../document-security-kit
 *   - ../document-advanced-reporting-kit
 *   - ../document-lifecycle-management-kit
 *
 * DOWNSTREAM (imported by):
 *   - Compliance audit services
 *   - Regulatory reporting modules
 *   - HIPAA compliance dashboards
 *   - Audit trail management systems
 *   - Legal hold services
 */
/**
 * File: /reuse/document/composites/document-compliance-audit-composite.ts
 * Locator: WC-DOCUMENT-COMPLIANCE-AUDIT-001
 * Purpose: Comprehensive Document Compliance & Audit Toolkit - Production-ready compliance auditing and regulatory reporting
 *
 * Upstream: Composed from document-compliance-advanced-kit, document-audit-trail-advanced-kit, document-security-kit, document-advanced-reporting-kit, document-lifecycle-management-kit
 * Downstream: ../backend/*, Compliance audit services, Regulatory reporting, HIPAA dashboards, Legal holds
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto
 * Exports: 45 utility functions for HIPAA compliance, audit trails, regulatory reporting, legal holds, lifecycle management
 *
 * LLM Context: Enterprise-grade compliance and audit toolkit for White Cross healthcare platform.
 * Provides comprehensive HIPAA compliance auditing, FDA 21 CFR Part 11 validation, GDPR data protection,
 * SOX controls, audit trail generation and analysis, tamper-proof audit logs, compliance gap identification,
 * remediation tracking, legal hold management, retention policy enforcement, compliance posture assessment,
 * automated compliance reporting, and executive compliance dashboards. Composes functions from multiple
 * compliance and audit kits to provide unified operations for regulatory compliance, audit management,
 * and legal hold workflows in healthcare systems.
 */
import { Model } from 'sequelize-typescript';
/**
 * Compliance framework types
 *
 * Supported regulatory and compliance frameworks for healthcare document management.
 * Each framework has specific controls, requirements, and audit procedures.
 *
 * @property {string} HIPAA_PRIVACY - HIPAA Privacy Rule compliance for PHI protection
 * @property {string} HIPAA_SECURITY - HIPAA Security Rule for technical safeguards
 * @property {string} HIPAA_BREACH - HIPAA Breach Notification Rule compliance
 * @property {string} FDA_21CFR11 - FDA 21 CFR Part 11 electronic records and signatures
 * @property {string} GDPR - General Data Protection Regulation (EU)
 * @property {string} CCPA - California Consumer Privacy Act
 * @property {string} SOX - Sarbanes-Oxley Act financial controls
 * @property {string} eIDAS - Electronic Identification and Trust Services (EU)
 * @property {string} ISO27001 - Information security management standard
 * @property {string} NIST - NIST cybersecurity framework
 */
export declare enum ComplianceFramework {
    HIPAA_PRIVACY = "HIPAA_PRIVACY",
    HIPAA_SECURITY = "HIPAA_SECURITY",
    HIPAA_BREACH = "HIPAA_BREACH",
    FDA_21CFR11 = "FDA_21CFR11",
    GDPR = "GDPR",
    CCPA = "CCPA",
    SOX = "SOX",
    eIDAS = "eIDAS",
    ISO27001 = "ISO27001",
    NIST = "NIST"
}
/**
 * Compliance audit status
 *
 * Lifecycle states for compliance audit execution and results.
 *
 * @property {string} SCHEDULED - Audit scheduled but not yet started
 * @property {string} IN_PROGRESS - Audit currently executing
 * @property {string} COMPLETED - Audit finished execution (check complianceScore for pass/fail)
 * @property {string} FAILED - Audit execution failed due to technical error
 * @property {string} REMEDIATION_REQUIRED - Audit completed with findings requiring remediation
 * @property {string} PASSED - Audit completed successfully with passing score
 */
export declare enum ComplianceAuditStatus {
    SCHEDULED = "SCHEDULED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REMEDIATION_REQUIRED = "REMEDIATION_REQUIRED",
    PASSED = "PASSED"
}
/**
 * Compliance severity levels
 *
 * Risk severity classification for compliance findings and gaps.
 * Determines priority and SLA for remediation activities.
 *
 * @property {string} CRITICAL - Immediate action required; regulatory violation; high risk of breach
 * @property {string} HIGH - Significant control weakness; remediation within 7 days
 * @property {string} MEDIUM - Moderate control gap; remediation within 30 days
 * @property {string} LOW - Minor improvement opportunity; remediation within 90 days
 * @property {string} INFO - Informational finding; no remediation required
 */
export declare enum ComplianceSeverity {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    INFO = "INFO"
}
/**
 * Audit event types
 *
 * Categories of auditable events for compliance and security logging.
 * All events must be recorded in tamper-proof audit trail per HIPAA requirements.
 *
 * @property {string} DOCUMENT_CREATED - New document created in system
 * @property {string} DOCUMENT_ACCESSED - Document viewed or accessed by user
 * @property {string} DOCUMENT_MODIFIED - Document content or metadata changed
 * @property {string} DOCUMENT_DELETED - Document marked for deletion
 * @property {string} DOCUMENT_SHARED - Document shared with additional users
 * @property {string} DOCUMENT_ENCRYPTED - Document encryption applied
 * @property {string} DOCUMENT_DECRYPTED - Document decrypted for access
 * @property {string} PERMISSION_CHANGED - Access permissions modified
 * @property {string} COMPLIANCE_CHECK - Compliance audit executed
 * @property {string} LEGAL_HOLD_APPLIED - Legal hold placed on document
 * @property {string} LEGAL_HOLD_RELEASED - Legal hold removed from document
 */
export declare enum AuditEventType {
    DOCUMENT_CREATED = "DOCUMENT_CREATED",
    DOCUMENT_ACCESSED = "DOCUMENT_ACCESSED",
    DOCUMENT_MODIFIED = "DOCUMENT_MODIFIED",
    DOCUMENT_DELETED = "DOCUMENT_DELETED",
    DOCUMENT_SHARED = "DOCUMENT_SHARED",
    DOCUMENT_ENCRYPTED = "DOCUMENT_ENCRYPTED",
    DOCUMENT_DECRYPTED = "DOCUMENT_DECRYPTED",
    PERMISSION_CHANGED = "PERMISSION_CHANGED",
    COMPLIANCE_CHECK = "COMPLIANCE_CHECK",
    LEGAL_HOLD_APPLIED = "LEGAL_HOLD_APPLIED",
    LEGAL_HOLD_RELEASED = "LEGAL_HOLD_RELEASED"
}
/**
 * Legal hold status
 *
 * Status values for legal hold lifecycle management.
 * Documents under legal hold cannot be deleted or modified.
 *
 * @property {string} ACTIVE - Legal hold is currently in effect; preservation required
 * @property {string} PENDING - Legal hold requested but not yet approved
 * @property {string} RELEASED - Legal hold officially released; normal retention applies
 * @property {string} EXPIRED - Legal hold expired automatically (if end date configured)
 */
export declare enum LegalHoldStatus {
    ACTIVE = "ACTIVE",
    PENDING = "PENDING",
    RELEASED = "RELEASED",
    EXPIRED = "EXPIRED"
}
/**
 * Retention policy type
 *
 * Classification of document retention policies.
 * Determines how retention period is calculated and enforced.
 *
 * @property {string} TIME_BASED - Retention based on fixed time period (e.g., 7 years from creation)
 * @property {string} EVENT_BASED - Retention starts from specific event (e.g., patient discharge, contract end)
 * @property {string} PERMANENT - Document must be retained indefinitely
 * @property {string} CUSTOM - Custom retention logic defined by business rules
 */
export declare enum RetentionPolicyType {
    TIME_BASED = "TIME_BASED",
    EVENT_BASED = "EVENT_BASED",
    PERMANENT = "PERMANENT",
    CUSTOM = "CUSTOM"
}
/**
 * Compliance audit configuration
 *
 * Defines parameters for automated compliance audit execution.
 * Supports scheduled audits, automated remediation, and threshold-based alerting.
 *
 * @property {string} id - Unique audit configuration identifier
 * @property {string} name - Human-readable audit name
 * @property {ComplianceFramework} framework - Compliance framework to audit against
 * @property {boolean} enabled - Whether audit is currently active
 * @property {string} [scheduleExpression] - Cron expression for automated scheduling (e.g., "0 0 * * 0" for weekly)
 * @property {boolean} autoRemediate - Enable automatic remediation for known issues
 * @property {string[]} [notificationEmail] - Email addresses for audit result notifications
 * @property {ComplianceThresholds} thresholds - Compliance score and finding thresholds
 * @property {Record<string, any>} [metadata] - Additional configuration metadata
 */
export interface ComplianceAuditConfig {
    id: string;
    name: string;
    framework: ComplianceFramework;
    enabled: boolean;
    scheduleExpression?: string;
    autoRemediate: boolean;
    notificationEmail?: string[];
    thresholds: ComplianceThresholds;
    metadata?: Record<string, any>;
}
/**
 * Compliance thresholds
 *
 * Defines acceptable limits for compliance findings and remediation timeframes.
 * Exceeding thresholds triggers alerts and escalation workflows.
 *
 * @property {number} maxCriticalFindings - Maximum allowed critical findings before escalation
 * @property {number} maxHighFindings - Maximum allowed high-severity findings
 * @property {number} minComplianceScore - Minimum passing compliance score (0-100)
 * @property {number} remediationSLA - Service level agreement for remediation in hours
 */
export interface ComplianceThresholds {
    maxCriticalFindings: number;
    maxHighFindings: number;
    minComplianceScore: number;
    remediationSLA: number;
}
/**
 * Compliance audit result
 *
 * Comprehensive audit execution results including findings, scores, and remediation plans.
 * Provides actionable insights for compliance improvement and risk management.
 *
 * @property {string} id - Unique result identifier
 * @property {string} auditId - Reference to audit configuration
 * @property {Date} timestamp - Audit execution timestamp
 * @property {ComplianceFramework} framework - Framework audited
 * @property {ComplianceAuditStatus} status - Overall audit status
 * @property {number} complianceScore - Calculated compliance score (0-100)
 * @property {ComplianceFinding[]} findings - Detailed compliance findings and gaps
 * @property {number} passedControls - Number of controls that passed
 * @property {number} totalControls - Total number of controls evaluated
 * @property {RemediationItem[]} remediationItems - Required remediation actions
 * @property {string} executiveSummary - Executive-level summary of audit results
 * @property {Record<string, any>} [metadata] - Additional audit metadata and context
 */
export interface ComplianceAuditResult {
    id: string;
    auditId: string;
    timestamp: Date;
    framework: ComplianceFramework;
    status: ComplianceAuditStatus;
    complianceScore: number;
    findings: ComplianceFinding[];
    passedControls: number;
    totalControls: number;
    remediationItems: RemediationItem[];
    executiveSummary: string;
    metadata?: Record<string, any>;
}
/**
 * Compliance finding
 *
 * Detailed compliance gap or control failure identified during audit.
 * Includes evidence, recommendations, and remediation tracking.
 *
 * @property {string} id - Unique finding identifier
 * @property {string} controlId - Framework-specific control identifier (e.g., "HIPAA-SEC-164.312")
 * @property {string} controlName - Human-readable control name
 * @property {ComplianceSeverity} severity - Risk severity level
 * @property {string} finding - Detailed finding description
 * @property {string[]} evidence - Supporting evidence and documentation references
 * @property {string} recommendation - Recommended remediation actions
 * @property {'OPEN' | 'IN_REMEDIATION' | 'RESOLVED' | 'ACCEPTED_RISK'} status - Current finding status
 * @property {string} [assignedTo] - User or team assigned for remediation
 * @property {Date} [dueDate] - Remediation due date based on severity SLA
 * @property {Record<string, any>} [metadata] - Additional finding context
 */
export interface ComplianceFinding {
    id: string;
    controlId: string;
    controlName: string;
    severity: ComplianceSeverity;
    finding: string;
    evidence: string[];
    recommendation: string;
    status: 'OPEN' | 'IN_REMEDIATION' | 'RESOLVED' | 'ACCEPTED_RISK';
    assignedTo?: string;
    dueDate?: Date;
    metadata?: Record<string, any>;
}
/**
 * Remediation item
 *
 * Actionable task for addressing compliance finding.
 * Tracks remediation workflow from assignment through completion.
 *
 * @property {string} id - Unique remediation item identifier
 * @property {string} findingId - Reference to parent compliance finding
 * @property {string} title - Brief remediation task title
 * @property {string} description - Detailed remediation instructions
 * @property {ComplianceSeverity} priority - Remediation priority level
 * @property {string} [assignedTo] - User or team assigned to remediate
 * @property {Date} dueDate - Remediation completion deadline
 * @property {'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'} status - Current remediation status
 * @property {number} [estimatedEffort] - Estimated effort in hours
 * @property {Date} [completedDate] - Actual completion timestamp
 * @property {Record<string, any>} [metadata] - Additional remediation context
 */
export interface RemediationItem {
    id: string;
    findingId: string;
    title: string;
    description: string;
    priority: ComplianceSeverity;
    assignedTo?: string;
    dueDate: Date;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    estimatedEffort?: number;
    completedDate?: Date;
    metadata?: Record<string, any>;
}
/**
 * Audit trail entry
 *
 * Tamper-proof audit log entry with cryptographic integrity verification.
 * Implements blockchain-like chaining for immutable audit history per HIPAA requirements.
 *
 * @property {string} id - Unique audit entry identifier
 * @property {Date} timestamp - Event occurrence timestamp
 * @property {AuditEventType} eventType - Category of audited event
 * @property {string} userId - User who performed action
 * @property {string} userName - User's display name
 * @property {string} documentId - Affected document identifier
 * @property {string} documentName - Affected document name
 * @property {string} action - Detailed action description
 * @property {Record<string, any>} details - Event-specific details and context
 * @property {string} [ipAddress] - Source IP address
 * @property {string} [userAgent] - User agent string
 * @property {string} [sessionId] - Session identifier
 * @property {'SUCCESS' | 'FAILURE' | 'PARTIAL'} resultStatus - Action result status
 * @property {string} [errorMessage] - Error details if action failed
 * @property {AuditIntegrity} integrity - Cryptographic integrity verification data
 * @property {Record<string, any>} [metadata] - Additional audit metadata
 */
export interface AuditTrailEntry {
    id: string;
    timestamp: Date;
    eventType: AuditEventType;
    userId: string;
    userName: string;
    documentId: string;
    documentName: string;
    action: string;
    details: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    resultStatus: 'SUCCESS' | 'FAILURE' | 'PARTIAL';
    errorMessage?: string;
    integrity: AuditIntegrity;
    metadata?: Record<string, any>;
}
/**
 * Audit integrity verification
 *
 * Cryptographic data for verifying audit trail integrity and detecting tampering.
 * Uses blockchain-style chaining to ensure immutability.
 *
 * @property {string} hash - SHA-256 hash of current audit entry
 * @property {string} [previousHash] - Hash of previous entry in chain
 * @property {string} [signature] - Digital signature of entry (SHA-512 of hash)
 * @property {boolean} chainValid - Whether hash chain is intact
 * @property {Date} timestamp - Integrity verification timestamp
 */
export interface AuditIntegrity {
    hash: string;
    previousHash?: string;
    signature?: string;
    chainValid: boolean;
    timestamp: Date;
}
/**
 * Legal hold configuration
 *
 * Legal preservation directive preventing document deletion or modification.
 * Used for litigation, investigations, and regulatory matters.
 *
 * @property {string} id - Unique legal hold identifier
 * @property {string} name - Legal hold name or title
 * @property {string} description - Detailed hold description and scope
 * @property {string} [caseNumber] - Associated case or matter number
 * @property {LegalHoldStatus} status - Current hold status
 * @property {string[]} custodians - List of custodian IDs responsible for preservation
 * @property {LegalHoldFilters} documentFilters - Criteria for documents subject to hold
 * @property {Date} startDate - Hold effective start date
 * @property {Date} [endDate] - Scheduled hold end date (if known)
 * @property {Date} [releasedDate] - Actual release date when hold was lifted
 * @property {string} createdBy - User who initiated the legal hold
 * @property {string} [approvedBy] - Legal authority who approved the hold
 * @property {boolean} notificationSent - Whether custodians have been notified
 * @property {Record<string, any>} [metadata] - Additional hold metadata
 */
export interface LegalHold {
    id: string;
    name: string;
    description: string;
    caseNumber?: string;
    status: LegalHoldStatus;
    custodians: string[];
    documentFilters: LegalHoldFilters;
    startDate: Date;
    endDate?: Date;
    releasedDate?: Date;
    createdBy: string;
    approvedBy?: string;
    notificationSent: boolean;
    metadata?: Record<string, any>;
}
/**
 * Legal hold filters
 *
 * Query criteria for identifying documents subject to legal hold.
 * Multiple filters are combined with AND logic.
 *
 * @property {string[]} [documentTypes] - Document types to include (e.g., ['email', 'contract'])
 * @property {{ start: Date; end: Date }} [dateRange] - Date range for document creation/modification
 * @property {string[]} [keywords] - Keywords or phrases to search for in content
 * @property {string[]} [departments] - Departments whose documents to include
 * @property {string[]} [authors] - Document authors to include
 * @property {string[]} [tags] - Document tags to match
 */
export interface LegalHoldFilters {
    documentTypes?: string[];
    dateRange?: {
        start: Date;
        end: Date;
    };
    keywords?: string[];
    departments?: string[];
    authors?: string[];
    tags?: string[];
}
/**
 * Retention policy
 *
 * Document retention policy defining lifecycle and disposition rules.
 * Ensures regulatory compliance and efficient storage management.
 *
 * @property {string} id - Unique retention policy identifier
 * @property {string} name - Policy name
 * @property {string} description - Detailed policy description and rationale
 * @property {RetentionPolicyType} type - Retention policy type
 * @property {number} retentionPeriod - Retention period in days
 * @property {RetentionTrigger[]} [triggers] - Conditions that start retention period
 * @property {RetentionAction[]} actions - Actions to execute when retention expires
 * @property {boolean} enabled - Whether policy is currently active
 * @property {number} priority - Policy priority for conflict resolution (higher = higher priority)
 * @property {Record<string, any>} [metadata] - Additional policy metadata
 */
export interface RetentionPolicy {
    id: string;
    name: string;
    description: string;
    type: RetentionPolicyType;
    retentionPeriod: number;
    triggers?: RetentionTrigger[];
    actions: RetentionAction[];
    enabled: boolean;
    priority: number;
    metadata?: Record<string, any>;
}
/**
 * Retention trigger
 *
 * Event or condition that initiates retention period countdown.
 * Used for event-based retention policies.
 *
 * @property {'DATE' | 'EVENT' | 'CONDITION'} type - Trigger type
 * @property {string} [condition] - Condition expression for CONDITION type
 * @property {string} [eventType] - Event type that triggers retention for EVENT type
 */
export interface RetentionTrigger {
    type: 'DATE' | 'EVENT' | 'CONDITION';
    condition?: string;
    eventType?: string;
}
/**
 * Retention action
 *
 * Action to execute when retention period expires.
 * Multiple actions can be configured for a single policy.
 *
 * @property {'DELETE' | 'ARCHIVE' | 'NOTIFY' | 'REVIEW'} type - Action type to execute
 * @property {Record<string, any>} [configuration] - Action-specific configuration (e.g., archive location, notification recipients)
 */
export interface RetentionAction {
    type: 'DELETE' | 'ARCHIVE' | 'NOTIFY' | 'REVIEW';
    configuration?: Record<string, any>;
}
/**
 * Compliance report
 *
 * Comprehensive compliance reporting for executive review and regulatory filing.
 * Supports multiple report formats and customizable sections.
 *
 * @property {string} id - Unique report identifier
 * @property {ComplianceReportType} reportType - Report type and format
 * @property {ComplianceFramework} framework - Framework being reported on
 * @property {Date} generatedDate - Report generation timestamp
 * @property {{ start: Date; end: Date }} reportingPeriod - Time period covered by report
 * @property {ComplianceReportSummary} summary - Executive summary with key metrics
 * @property {ComplianceReportSection[]} sections - Detailed report sections
 * @property {string[]} recommendations - Actionable recommendations for improvement
 * @property {string[]} [attachments] - Supporting documentation references
 * @property {Record<string, any>} [metadata] - Additional report metadata
 */
export interface ComplianceReport {
    id: string;
    reportType: ComplianceReportType;
    framework: ComplianceFramework;
    generatedDate: Date;
    reportingPeriod: {
        start: Date;
        end: Date;
    };
    summary: ComplianceReportSummary;
    sections: ComplianceReportSection[];
    recommendations: string[];
    attachments?: string[];
    metadata?: Record<string, any>;
}
/**
 * Compliance report types
 *
 * Standard report formats for compliance reporting and analytics.
 *
 * @property {string} AUDIT_SUMMARY - High-level audit results summary
 * @property {string} FINDINGS_REPORT - Detailed findings with evidence and recommendations
 * @property {string} REMEDIATION_STATUS - Remediation progress tracking report
 * @property {string} EXECUTIVE_DASHBOARD - Executive-level compliance dashboard with KPIs
 * @property {string} REGULATORY_FILING - Formal report for regulatory submission
 * @property {string} TREND_ANALYSIS - Historical trend analysis and forecasting
 */
export declare enum ComplianceReportType {
    AUDIT_SUMMARY = "AUDIT_SUMMARY",
    FINDINGS_REPORT = "FINDINGS_REPORT",
    REMEDIATION_STATUS = "REMEDIATION_STATUS",
    EXECUTIVE_DASHBOARD = "EXECUTIVE_DASHBOARD",
    REGULATORY_FILING = "REGULATORY_FILING",
    TREND_ANALYSIS = "TREND_ANALYSIS"
}
/**
 * Compliance report summary
 *
 * Executive summary section with key compliance metrics and trends.
 *
 * @property {number} overallScore - Overall compliance score (0-100)
 * @property {number} totalAudits - Total number of audits conducted
 * @property {number} passedAudits - Number of audits that passed
 * @property {number} failedAudits - Number of audits that failed
 * @property {number} criticalFindings - Count of critical severity findings
 * @property {number} highFindings - Count of high severity findings
 * @property {number} mediumFindings - Count of medium severity findings
 * @property {number} lowFindings - Count of low severity findings
 * @property {number} openRemediations - Number of open remediation items
 * @property {'IMPROVING' | 'STABLE' | 'DECLINING'} complianceTrend - Trend direction over time
 */
export interface ComplianceReportSummary {
    overallScore: number;
    totalAudits: number;
    passedAudits: number;
    failedAudits: number;
    criticalFindings: number;
    highFindings: number;
    mediumFindings: number;
    lowFindings: number;
    openRemediations: number;
    complianceTrend: 'IMPROVING' | 'STABLE' | 'DECLINING';
}
/**
 * Compliance report section
 *
 * Individual section within compliance report.
 * Supports narrative content, tabular data, and visualizations.
 *
 * @property {string} title - Section title
 * @property {string} content - Section narrative content (markdown supported)
 * @property {any[]} [data] - Structured data tables for this section
 * @property {any[]} [charts] - Chart configurations for data visualization
 */
export interface ComplianceReportSection {
    title: string;
    content: string;
    data?: any[];
    charts?: any[];
}
/**
 * Compliance Audit Configuration Model
 * Stores configuration for compliance audits
 */
export declare class ComplianceAuditConfigModel extends Model {
    id: string;
    name: string;
    framework: ComplianceFramework;
    enabled: boolean;
    scheduleExpression?: string;
    autoRemediate: boolean;
    notificationEmail?: string[];
    thresholds: ComplianceThresholds;
    metadata?: Record<string, any>;
}
/**
 * Compliance Audit Result Model
 * Stores results from compliance audits
 */
export declare class ComplianceAuditResultModel extends Model {
    id: string;
    auditId: string;
    timestamp: Date;
    framework: ComplianceFramework;
    status: ComplianceAuditStatus;
    complianceScore: number;
    findings: ComplianceFinding[];
    passedControls: number;
    totalControls: number;
    remediationItems: RemediationItem[];
    executiveSummary: string;
    metadata?: Record<string, any>;
}
/**
 * Audit Trail Entry Model
 * Stores tamper-proof audit trail entries
 */
export declare class AuditTrailEntryModel extends Model {
    id: string;
    timestamp: Date;
    eventType: AuditEventType;
    userId: string;
    userName: string;
    documentId: string;
    documentName: string;
    action: string;
    details: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    resultStatus: 'SUCCESS' | 'FAILURE' | 'PARTIAL';
    errorMessage?: string;
    integrity: AuditIntegrity;
    metadata?: Record<string, any>;
}
/**
 * Legal Hold Model
 * Stores legal hold configurations and status
 */
export declare class LegalHoldModel extends Model {
    id: string;
    name: string;
    description: string;
    caseNumber?: string;
    status: LegalHoldStatus;
    custodians: string[];
    documentFilters: LegalHoldFilters;
    startDate: Date;
    endDate?: Date;
    releasedDate?: Date;
    createdBy: string;
    approvedBy?: string;
    notificationSent: boolean;
    metadata?: Record<string, any>;
}
/**
 * Retention Policy Model
 * Stores document retention policies
 */
export declare class RetentionPolicyModel extends Model {
    id: string;
    name: string;
    description: string;
    type: RetentionPolicyType;
    retentionPeriod: number;
    triggers?: RetentionTrigger[];
    actions: RetentionAction[];
    enabled: boolean;
    priority: number;
    metadata?: Record<string, any>;
}
/**
 * Performs comprehensive HIPAA compliance audit.
 * Validates HIPAA Privacy, Security, and Breach Notification Rules.
 *
 * Checks encryption, access controls, audit logging, and PHI protection measures
 * against HIPAA security rule requirements. Returns detailed audit results with
 * findings, remediation items, and compliance score.
 *
 * @param {string} documentId - Document identifier to audit
 * @param {Record<string, any>} documentMetadata - Document metadata including encryption status, access controls, audit logging config
 * @returns {Promise<ComplianceAuditResult>} Comprehensive audit result with findings, score, and remediation plan
 * @throws {TypeError} If documentId is invalid or documentMetadata is missing required properties
 * @throws {Error} If audit execution fails due to system error
 *
 * @example
 * ```typescript
 * // Audit document with complete metadata
 * const auditResult = await performHIPAAComplianceAudit('doc-12345', {
 *   encrypted: true,
 *   accessControls: { read: ['doctor-group'], write: ['admin-group'] },
 *   auditLoggingEnabled: true,
 *   containsPHI: true,
 *   documentType: 'patient-record'
 * });
 *
 * console.log(`Compliance Score: ${auditResult.complianceScore.toFixed(1)}%`);
 * console.log(`Status: ${auditResult.status}`);
 * console.log(`Findings: ${auditResult.findings.length} issues identified`);
 *
 * // Handle remediation items
 * if (auditResult.status === ComplianceAuditStatus.REMEDIATION_REQUIRED) {
 *   auditResult.remediationItems.forEach(item => {
 *     console.log(`- ${item.title} (Priority: ${item.priority}, Due: ${item.dueDate})`);
 *   });
 * }
 * ```
 */
export declare const performHIPAAComplianceAudit: (documentId: string, documentMetadata: Record<string, any>) => Promise<ComplianceAuditResult>;
/**
 * Creates tamper-proof audit trail entry with cryptographic chain.
 * Implements blockchain-like integrity verification.
 *
 * Generates SHA-256 hash of entry data and chains to previous entry's hash to create
 * an immutable audit trail. Includes SHA-512 signature for additional verification.
 * Required for HIPAA compliance and forensic evidence preservation.
 *
 * @param {Omit<AuditTrailEntry, 'id' | 'integrity'>} entry - Audit entry data
 * @param {string} [previousHash] - Hash of previous audit entry for blockchain chaining
 * @returns {Promise<AuditTrailEntry>} Created audit entry with complete integrity verification data
 * @throws {TypeError} If required entry fields (userId, documentId, eventType) are missing
 * @throws {Error} If cryptographic hash generation fails
 * @throws {Error} If previous hash is provided but invalid format
 *
 * @example
 * ```typescript
 * // Create first audit entry in chain
 * const entry1 = await createAuditTrailEntry({
 *   timestamp: new Date(),
 *   eventType: AuditEventType.DOCUMENT_CREATED,
 *   userId: 'user-123',
 *   userName: 'Dr. Smith',
 *   documentId: 'patient-record-456',
 *   documentName: 'John Doe Medical Record',
 *   action: 'CREATE',
 *   details: { documentType: 'patient-record', category: 'PHI' },
 *   ipAddress: '192.168.1.100',
 *   userAgent: 'Mozilla/5.0...',
 *   sessionId: 'session-789',
 *   resultStatus: 'SUCCESS'
 * });
 * console.log(`Entry created with hash: ${entry1.integrity.hash}`);
 *
 * // Create second entry chained to first
 * const entry2 = await createAuditTrailEntry({
 *   timestamp: new Date(),
 *   eventType: AuditEventType.DOCUMENT_ACCESSED,
 *   userId: 'user-456',
 *   userName: 'Nurse Johnson',
 *   documentId: 'patient-record-456',
 *   documentName: 'John Doe Medical Record',
 *   action: 'VIEW',
 *   details: { page: 1, accessReason: 'patient care' },
 *   resultStatus: 'SUCCESS'
 * }, entry1.integrity.hash);
 *
 * console.log(`Chain valid: ${entry2.integrity.chainValid}`);
 * ```
 */
export declare const createAuditTrailEntry: (entry: Omit<AuditTrailEntry, "id" | "integrity">, previousHash?: string) => Promise<AuditTrailEntry>;
/**
 * Verifies audit trail integrity by validating cryptographic chain.
 *
 * Validates blockchain-style hash chain to detect tampering or corruption in audit trail.
 * Checks both hash chain linkage (each entry's previousHash matches previous entry's hash)
 * and individual entry hash validity. Critical for regulatory compliance and forensic evidence.
 *
 * @param {AuditTrailEntry[]} auditTrail - Audit trail entries to verify (will be sorted by timestamp)
 * @returns {Promise<{ valid: boolean; invalidEntries: string[]; details: string }>} Verification result with list of compromised entries
 * @throws {TypeError} If auditTrail is not an array
 * @throws {Error} If hash verification algorithm fails
 *
 * @example
 * ```typescript
 * // Verify audit trail integrity
 * const auditEntries = await getAuditTrailForDocument('doc-123');
 * const verification = await verifyAuditTrailIntegrity(auditEntries);
 *
 * if (verification.valid) {
 *   console.log('✓ Audit trail integrity verified successfully');
 *   console.log(`  ${auditEntries.length} entries validated`);
 * } else {
 *   console.error('✗ Audit trail integrity check FAILED');
 *   console.error(`  ${verification.details}`);
 *   console.error('  Compromised entries:');
 *   verification.invalidEntries.forEach(entryId => {
 *     const entry = auditEntries.find(e => e.id === entryId);
 *     console.error(`    - ${entryId}: ${entry?.eventType} at ${entry?.timestamp}`);
 *   });
 *   // Trigger security alert for tampered audit trail
 *   await notifySecurityTeam('AUDIT_TRAIL_TAMPERING', verification);
 * }
 * ```
 */
export declare const verifyAuditTrailIntegrity: (auditTrail: AuditTrailEntry[]) => Promise<{
    valid: boolean;
    invalidEntries: string[];
    details: string;
}>;
/**
 * Applies legal hold to documents matching criteria.
 * Prevents deletion or modification of documents under legal hold.
 *
 * Queries database for documents matching the hold's filter criteria and applies hold metadata.
 * Documents under legal hold are protected from deletion, modification, and automatic retention
 * policy disposal until the hold is released. Custodians are notified of preservation obligations.
 *
 * @param {LegalHold} legalHold - Legal hold configuration with filters and custodian list
 * @returns {Promise<{ appliedCount: number; documentIds: string[] }>} Count and IDs of documents placed under legal hold
 * @throws {TypeError} If legalHold is missing required fields (id, name, status, custodians, documentFilters)
 * @throws {Error} If database query fails
 * @throws {Error} If legal hold status is not ACTIVE or PENDING
 *
 * @example
 * ```typescript
 * // Apply legal hold for litigation case
 * const result = await applyLegalHold({
 *   id: 'hold-2024-001',
 *   name: 'Case 2024-001: Smith v. Hospital',
 *   description: 'Medical malpractice case - preserve all patient records and communications',
 *   caseNumber: 'CV-2024-12345',
 *   status: LegalHoldStatus.ACTIVE,
 *   custodians: ['doctor-smith-123', 'nurse-johnson-456', 'admin-789'],
 *   documentFilters: {
 *     dateRange: {
 *       start: new Date('2023-06-01'),
 *       end: new Date('2024-01-31')
 *     },
 *     keywords: ['John Smith', 'procedure', 'complication'],
 *     departments: ['emergency', 'surgery'],
 *     documentTypes: ['patient-record', 'email', 'note']
 *   },
 *   startDate: new Date(),
 *   createdBy: 'legal-admin-001',
 *   approvedBy: 'general-counsel-002',
 *   notificationSent: false
 * });
 *
 * console.log(`Legal hold applied to ${result.appliedCount} documents`);
 * console.log(`Document IDs: ${result.documentIds.join(', ')}`);
 *
 * // Send custodian notifications
 * if (!legalHold.notificationSent) {
 *   await sendLegalHoldNotifications(legalHold.id, legalHold.custodians);
 * }
 * ```
 */
export declare const applyLegalHold: (legalHold: LegalHold) => Promise<{
    appliedCount: number;
    documentIds: string[];
}>;
/**
 * Releases legal hold and restores normal retention policies.
 *
 * Removes legal hold protection from documents and restores normal lifecycle and retention
 * policies. Documents are evaluated against active retention policies to determine disposition.
 * Creates audit trail entry documenting the release. Only authorized users (legal team) should
 * release holds.
 *
 * @param {string} legalHoldId - Legal hold identifier to release
 * @param {string} releasedBy - User ID of person releasing the hold (must have legal admin permission)
 * @param {string} reason - Business reason for releasing hold (e.g., "Case settled", "Matter closed")
 * @returns {Promise<{ releasedCount: number; documentIds: string[] }>} Count and IDs of documents released from legal hold
 * @throws {TypeError} If legalHoldId, releasedBy, or reason is missing or empty
 * @throws {Error} If legal hold not found
 * @throws {Error} If legal hold already released
 * @throws {Error} If user lacks permission to release legal hold
 * @throws {Error} If database update fails
 *
 * @example
 * ```typescript
 * // Release legal hold after case settlement
 * try {
 *   const result = await releaseLegalHold(
 *     'hold-2024-001',
 *     'legal-admin-001',
 *     'Case settled: Settlement agreement signed on 2024-06-15'
 *   );
 *
 *   console.log(`✓ Legal hold released successfully`);
 *   console.log(`  ${result.releasedCount} documents released`);
 *   console.log(`  Documents now subject to normal retention policies`);
 *
 *   // Log release for audit purposes
 *   await createAuditTrailEntry({
 *     timestamp: new Date(),
 *     eventType: AuditEventType.LEGAL_HOLD_RELEASED,
 *     userId: 'legal-admin-001',
 *     userName: 'Legal Administrator',
 *     documentId: result.documentIds[0], // First document for reference
 *     documentName: 'Legal Hold Release',
 *     action: 'RELEASE_LEGAL_HOLD',
 *     details: {
 *       holdId: 'hold-2024-001',
 *       documentCount: result.releasedCount,
 *       reason: 'Case settled'
 *     },
 *     resultStatus: 'SUCCESS'
 *   });
 *
 *   // Notify custodians of release
 *   await notifyCustodiansOfRelease('hold-2024-001', result.documentIds);
 *
 * } catch (error) {
 *   console.error(`Failed to release legal hold: ${error.message}`);
 *   // Handle authorization or validation errors
 * }
 * ```
 */
export declare const releaseLegalHold: (legalHoldId: string, releasedBy: string, reason: string) => Promise<{
    releasedCount: number;
    documentIds: string[];
}>;
/**
 * Generates comprehensive compliance report.
 * Includes executive summary, findings, trends, and recommendations.
 *
 * @param {ComplianceReportType} reportType - Type of report to generate
 * @param {ComplianceFramework} framework - Compliance framework
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<ComplianceReport>} Generated report
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport(
 *   ComplianceReportType.EXECUTIVE_DASHBOARD,
 *   ComplianceFramework.HIPAA_SECURITY,
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare const generateComplianceReport: (reportType: ComplianceReportType, framework: ComplianceFramework, startDate: Date, endDate: Date) => Promise<ComplianceReport>;
/**
 * Calculates compliance score based on control assessments.
 *
 * @param {number} passedControls - Number of passed controls
 * @param {number} totalControls - Total number of controls
 * @param {ComplianceFinding[]} findings - Compliance findings
 * @returns {number} Compliance score (0-100)
 *
 * @example
 * ```typescript
 * const score = calculateComplianceScore(12, 15, findings);
 * console.log(`Compliance Score: ${score}%`);
 * ```
 */
export declare const calculateComplianceScore: (passedControls: number, totalControls: number, findings: ComplianceFinding[]) => number;
/**
 * Identifies compliance gaps by comparing current state to framework requirements.
 *
 * @param {ComplianceFramework} framework - Framework to assess
 * @param {Record<string, any>} currentState - Current compliance state
 * @returns {Promise<ComplianceFinding[]>} Identified gaps
 *
 * @example
 * ```typescript
 * const gaps = await identifyComplianceGaps(ComplianceFramework.HIPAA_SECURITY, currentState);
 * ```
 */
export declare const identifyComplianceGaps: (framework: ComplianceFramework, currentState: Record<string, any>) => Promise<ComplianceFinding[]>;
/**
 * Tracks remediation progress for compliance findings.
 *
 * @param {string} findingId - Finding identifier
 * @param {string} status - New status
 * @param {string} updatedBy - User making update
 * @param {string} [notes] - Update notes
 * @returns {Promise<RemediationItem>} Updated remediation item
 *
 * @example
 * ```typescript
 * const item = await trackRemediationProgress('finding123', 'IN_PROGRESS', 'admin', 'Started implementation');
 * ```
 */
export declare const trackRemediationProgress: (findingId: string, status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED", updatedBy: string, notes?: string) => Promise<RemediationItem>;
/**
 * Enforces retention policy on documents.
 *
 * @param {RetentionPolicy} policy - Retention policy to enforce
 * @param {string[]} documentIds - Documents to evaluate
 * @returns {Promise<{ actionedDocuments: string[]; actions: string[] }>} Enforcement results
 *
 * @example
 * ```typescript
 * const result = await enforceRetentionPolicy(policy, ['doc1', 'doc2']);
 * ```
 */
export declare const enforceRetentionPolicy: (policy: RetentionPolicy, documentIds: string[]) => Promise<{
    actionedDocuments: string[];
    actions: string[];
}>;
/**
 * Validates FDA 21 CFR Part 11 compliance for electronic records.
 *
 * @param {string} documentId - Document identifier
 * @param {Record<string, any>} documentData - Document data
 * @returns {Promise<ComplianceAuditResult>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateFDA21CFR11Compliance('doc123', documentData);
 * ```
 */
export declare const validateFDA21CFR11Compliance: (documentId: string, documentData: Record<string, any>) => Promise<ComplianceAuditResult>;
/**
 * Assesses overall compliance posture across all frameworks.
 *
 * @param {ComplianceAuditResult[]} recentAudits - Recent audit results
 * @returns {Promise<{ score: number; trend: string; riskLevel: string; recommendations: string[] }>} Posture assessment
 *
 * @example
 * ```typescript
 * const posture = await assessCompliancePosture(auditResults);
 * console.log(`Risk Level: ${posture.riskLevel}, Score: ${posture.score}`);
 * ```
 */
export declare const assessCompliancePosture: (recentAudits: ComplianceAuditResult[]) => Promise<{
    score: number;
    trend: string;
    riskLevel: string;
    recommendations: string[];
}>;
/**
 * Generates executive compliance dashboard data.
 *
 * @param {Date} startDate - Dashboard start date
 * @param {Date} endDate - Dashboard end date
 * @returns {Promise<Record<string, any>>} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generateExecutiveDashboard(new Date('2024-01-01'), new Date());
 * ```
 */
export declare const generateExecutiveDashboard: (startDate: Date, endDate: Date) => Promise<Record<string, any>>;
/**
 * Searches audit trail for specific events or patterns.
 *
 * @param {Object} criteria - Search criteria
 * @param {AuditEventType} [criteria.eventType] - Event type
 * @param {string} [criteria.userId] - User ID
 * @param {string} [criteria.documentId] - Document ID
 * @param {Date} [criteria.startDate] - Start date
 * @param {Date} [criteria.endDate] - End date
 * @returns {Promise<AuditTrailEntry[]>} Matching audit entries
 *
 * @example
 * ```typescript
 * const entries = await searchAuditTrail({
 *   eventType: AuditEventType.DOCUMENT_ACCESSED,
 *   userId: 'user123',
 *   startDate: new Date('2024-01-01')
 * });
 * ```
 */
export declare const searchAuditTrail: (criteria: {
    eventType?: AuditEventType;
    userId?: string;
    documentId?: string;
    startDate?: Date;
    endDate?: Date;
}) => Promise<AuditTrailEntry[]>;
/**
 * Exports audit trail for external analysis or archival.
 *
 * @param {AuditTrailEntry[]} entries - Audit entries to export
 * @param {'json' | 'csv' | 'xml'} format - Export format
 * @returns {Promise<string>} Exported data
 *
 * @example
 * ```typescript
 * const csv = await exportAuditTrail(entries, 'csv');
 * ```
 */
export declare const exportAuditTrail: (entries: AuditTrailEntry[], format: "json" | "csv" | "xml") => Promise<string>;
/**
 * Archives old audit trail entries for long-term storage.
 *
 * @param {Date} cutoffDate - Archive entries before this date
 * @param {string} archiveLocation - Archive storage location
 * @returns {Promise<{ archivedCount: number; archiveId: string }>} Archive result
 *
 * @example
 * ```typescript
 * const result = await archiveAuditTrail(new Date('2023-01-01'), 's3://archives/audit');
 * ```
 */
export declare const archiveAuditTrail: (cutoffDate: Date, archiveLocation: string) => Promise<{
    archivedCount: number;
    archiveId: string;
}>;
/**
 * Validates GDPR compliance for data processing activities.
 *
 * @param {Record<string, any>} processingActivity - Data processing activity
 * @returns {Promise<ComplianceAuditResult>} GDPR validation result
 *
 * @example
 * ```typescript
 * const validation = await validateGDPRCompliance({
 *   purpose: 'Patient care',
 *   lawfulBasis: 'CONSENT',
 *   dataSubjects: ['patients'],
 *   retention: 365
 * });
 * ```
 */
export declare const validateGDPRCompliance: (processingActivity: Record<string, any>) => Promise<ComplianceAuditResult>;
/**
 * Schedules automated compliance audits.
 *
 * @param {ComplianceAuditConfig} config - Audit configuration
 * @returns {Promise<{ scheduleId: string; nextRun: Date }>} Schedule result
 *
 * @example
 * ```typescript
 * const schedule = await scheduleComplianceAudit({
 *   id: 'audit1',
 *   name: 'Monthly HIPAA Audit',
 *   framework: ComplianceFramework.HIPAA_SECURITY,
 *   enabled: true,
 *   scheduleExpression: '0 0 1 * *', // Monthly
 *   autoRemediate: false,
 *   thresholds: { maxCriticalFindings: 0, maxHighFindings: 2, minComplianceScore: 80, remediationSLA: 168 }
 * });
 * ```
 */
export declare const scheduleComplianceAudit: (config: ComplianceAuditConfig) => Promise<{
    scheduleId: string;
    nextRun: Date;
}>;
/**
 * Notifies stakeholders about compliance findings.
 *
 * @param {ComplianceFinding[]} findings - Findings to notify about
 * @param {string[]} recipients - Notification recipients
 * @returns {Promise<{ notificationId: string; sentCount: number }>} Notification result
 *
 * @example
 * ```typescript
 * const result = await notifyComplianceFindings(criticalFindings, ['admin@example.com']);
 * ```
 */
export declare const notifyComplianceFindings: (findings: ComplianceFinding[], recipients: string[]) => Promise<{
    notificationId: string;
    sentCount: number;
}>;
/**
 * Aggregates compliance data across multiple frameworks.
 *
 * @param {ComplianceFramework[]} frameworks - Frameworks to aggregate
 * @param {Date} startDate - Aggregation start date
 * @param {Date} endDate - Aggregation end date
 * @returns {Promise<Record<string, any>>} Aggregated data
 *
 * @example
 * ```typescript
 * const data = await aggregateComplianceData(
 *   [ComplianceFramework.HIPAA_SECURITY, ComplianceFramework.GDPR],
 *   new Date('2024-01-01'),
 *   new Date()
 * );
 * ```
 */
export declare const aggregateComplianceData: (frameworks: ComplianceFramework[], startDate: Date, endDate: Date) => Promise<Record<string, any>>;
/**
 * Compares compliance posture across time periods.
 *
 * @param {Date} period1Start - First period start
 * @param {Date} period1End - First period end
 * @param {Date} period2Start - Second period start
 * @param {Date} period2End - Second period end
 * @returns {Promise<Record<string, any>>} Comparison results
 *
 * @example
 * ```typescript
 * const comparison = await compareCompliancePeriods(
 *   new Date('2024-01-01'), new Date('2024-06-30'),
 *   new Date('2024-07-01'), new Date('2024-12-31')
 * );
 * ```
 */
export declare const compareCompliancePeriods: (period1Start: Date, period1End: Date, period2Start: Date, period2End: Date) => Promise<Record<string, any>>;
/**
 * Estimates remediation effort for compliance findings.
 *
 * @param {ComplianceFinding[]} findings - Findings to estimate
 * @returns {Promise<{ totalHours: number; byPriority: Record<string, number> }>} Effort estimates
 *
 * @example
 * ```typescript
 * const estimate = await estimateRemediationEffort(findings);
 * console.log(`Total effort: ${estimate.totalHours} hours`);
 * ```
 */
export declare const estimateRemediationEffort: (findings: ComplianceFinding[]) => Promise<{
    totalHours: number;
    byPriority: Record<string, number>;
}>;
/**
 * Prioritizes remediation items based on risk and compliance impact.
 *
 * @param {RemediationItem[]} items - Items to prioritize
 * @returns {RemediationItem[]} Prioritized items
 *
 * @example
 * ```typescript
 * const prioritized = prioritizeRemediationItems(remediationItems);
 * ```
 */
export declare const prioritizeRemediationItems: (items: RemediationItem[]) => RemediationItem[];
/**
 * Generates compliance trend analysis over time.
 *
 * @param {ComplianceAuditResult[]} historicalResults - Historical audit results
 * @returns {Promise<Record<string, any>>} Trend analysis
 *
 * @example
 * ```typescript
 * const trends = await analyzeComplianceTrends(auditResults);
 * ```
 */
export declare const analyzeComplianceTrends: (historicalResults: ComplianceAuditResult[]) => Promise<Record<string, any>>;
/**
 * Validates SOX compliance for financial document controls.
 *
 * @param {string} documentId - Document identifier
 * @param {Record<string, any>} controlData - Control data
 * @returns {Promise<ComplianceAuditResult>} SOX validation result
 *
 * @example
 * ```typescript
 * const validation = await validateSOXCompliance('doc123', controlData);
 * ```
 */
export declare const validateSOXCompliance: (documentId: string, controlData: Record<string, any>) => Promise<ComplianceAuditResult>;
/**
 * Monitors compliance in real-time and triggers alerts.
 *
 * @param {ComplianceFramework} framework - Framework to monitor
 * @param {Record<string, any>} event - Event to evaluate
 * @returns {Promise<{ alert: boolean; severity: ComplianceSeverity; message: string }>} Monitoring result
 *
 * @example
 * ```typescript
 * const result = await monitorComplianceRealtime(ComplianceFramework.HIPAA_SECURITY, accessEvent);
 * if (result.alert) {
 *   console.error(`Compliance alert: ${result.message}`);
 * }
 * ```
 */
export declare const monitorComplianceRealtime: (framework: ComplianceFramework, event: Record<string, any>) => Promise<{
    alert: boolean;
    severity: ComplianceSeverity;
    message: string;
}>;
/**
 * Benchmarks compliance performance against industry standards.
 *
 * @param {ComplianceFramework} framework - Framework to benchmark
 * @param {number} currentScore - Current compliance score
 * @returns {Promise<{ percentile: number; industryAverage: number; gap: number }>} Benchmark results
 *
 * @example
 * ```typescript
 * const benchmark = await benchmarkCompliance(ComplianceFramework.HIPAA_SECURITY, 85);
 * console.log(`Industry percentile: ${benchmark.percentile}%`);
 * ```
 */
export declare const benchmarkCompliance: (framework: ComplianceFramework, currentScore: number) => Promise<{
    percentile: number;
    industryAverage: number;
    gap: number;
}>;
/**
 * Generates automated remediation recommendations using AI.
 *
 * @param {ComplianceFinding} finding - Compliance finding
 * @returns {Promise<{ recommendations: string[]; estimatedEffort: number; priority: number }>} AI recommendations
 *
 * @example
 * ```typescript
 * const recommendations = await generateRemediationRecommendations(finding);
 * ```
 */
export declare const generateRemediationRecommendations: (finding: ComplianceFinding) => Promise<{
    recommendations: string[];
    estimatedEffort: number;
    priority: number;
}>;
/**
 * Tracks compliance certification renewals and expirations.
 *
 * @param {ComplianceFramework} framework - Framework to track
 * @returns {Promise<{ expirationDate: Date; daysRemaining: number; status: string }>} Certification status
 *
 * @example
 * ```typescript
 * const status = await trackCertificationRenewals(ComplianceFramework.ISO27001);
 * ```
 */
export declare const trackCertificationRenewals: (framework: ComplianceFramework) => Promise<{
    expirationDate: Date;
    daysRemaining: number;
    status: string;
}>;
/**
 * Automates compliance evidence collection for audits.
 *
 * @param {ComplianceFramework} framework - Framework requiring evidence
 * @param {string[]} controlIds - Control IDs to collect evidence for
 * @returns {Promise<Record<string, string[]>>} Collected evidence by control
 *
 * @example
 * ```typescript
 * const evidence = await collectComplianceEvidence(ComplianceFramework.HIPAA_SECURITY, ['164.312(a)(1)', '164.312(b)']);
 * ```
 */
export declare const collectComplianceEvidence: (framework: ComplianceFramework, controlIds: string[]) => Promise<Record<string, string[]>>;
/**
 * Simulates compliance audit to identify potential issues.
 *
 * @param {ComplianceFramework} framework - Framework to simulate
 * @param {Record<string, any>} configuration - System configuration
 * @returns {Promise<ComplianceAuditResult>} Simulation results
 *
 * @example
 * ```typescript
 * const simulation = await simulateComplianceAudit(ComplianceFramework.GDPR, systemConfig);
 * ```
 */
export declare const simulateComplianceAudit: (framework: ComplianceFramework, configuration: Record<string, any>) => Promise<ComplianceAuditResult>;
/**
 * Generates compliance attestation documents.
 *
 * @param {ComplianceFramework} framework - Framework to attest to
 * @param {string} attestor - Person providing attestation
 * @param {Date} attestationDate - Attestation date
 * @returns {Promise<{ documentId: string; content: string }>} Attestation document
 *
 * @example
 * ```typescript
 * const attestation = await generateComplianceAttestation(
 *   ComplianceFramework.HIPAA_SECURITY,
 *   'John Doe, CISO',
 *   new Date()
 * );
 * ```
 */
export declare const generateComplianceAttestation: (framework: ComplianceFramework, attestor: string, attestationDate: Date) => Promise<{
    documentId: string;
    content: string;
}>;
/**
 * Tracks compliance metrics over time for reporting.
 *
 * @param {ComplianceFramework} framework - Framework to track
 * @param {Date} startDate - Tracking start date
 * @param {Date} endDate - Tracking end date
 * @returns {Promise<Record<string, any>[]>} Time series metrics
 *
 * @example
 * ```typescript
 * const metrics = await trackComplianceMetrics(
 *   ComplianceFramework.HIPAA_SECURITY,
 *   new Date('2024-01-01'),
 *   new Date()
 * );
 * ```
 */
export declare const trackComplianceMetrics: (framework: ComplianceFramework, startDate: Date, endDate: Date) => Promise<Record<string, any>[]>;
/**
 * Validates compliance documentation completeness.
 *
 * @param {ComplianceFramework} framework - Framework to validate
 * @param {string[]} requiredDocuments - Required document types
 * @param {string[]} availableDocuments - Available document types
 * @returns {Promise<{ complete: boolean; missing: string[]; coverage: number }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateDocumentationCompleteness(
 *   ComplianceFramework.ISO27001,
 *   ['policy', 'procedure', 'audit_log'],
 *   ['policy', 'audit_log']
 * );
 * ```
 */
export declare const validateDocumentationCompleteness: (framework: ComplianceFramework, requiredDocuments: string[], availableDocuments: string[]) => Promise<{
    complete: boolean;
    missing: string[];
    coverage: number;
}>;
/**
 * Compliance Audit Service
 * Production-ready NestJS service for compliance audit operations
 */
export declare class ComplianceAuditService {
    /**
     * Performs comprehensive compliance audit
     */
    performAudit(framework: ComplianceFramework, documentId: string, metadata: Record<string, any>): Promise<ComplianceAuditResult>;
}
declare const _default: {
    ComplianceAuditConfigModel: typeof ComplianceAuditConfigModel;
    ComplianceAuditResultModel: typeof ComplianceAuditResultModel;
    AuditTrailEntryModel: typeof AuditTrailEntryModel;
    LegalHoldModel: typeof LegalHoldModel;
    RetentionPolicyModel: typeof RetentionPolicyModel;
    performHIPAAComplianceAudit: (documentId: string, documentMetadata: Record<string, any>) => Promise<ComplianceAuditResult>;
    createAuditTrailEntry: (entry: Omit<AuditTrailEntry, "id" | "integrity">, previousHash?: string) => Promise<AuditTrailEntry>;
    verifyAuditTrailIntegrity: (auditTrail: AuditTrailEntry[]) => Promise<{
        valid: boolean;
        invalidEntries: string[];
        details: string;
    }>;
    applyLegalHold: (legalHold: LegalHold) => Promise<{
        appliedCount: number;
        documentIds: string[];
    }>;
    releaseLegalHold: (legalHoldId: string, releasedBy: string, reason: string) => Promise<{
        releasedCount: number;
        documentIds: string[];
    }>;
    generateComplianceReport: (reportType: ComplianceReportType, framework: ComplianceFramework, startDate: Date, endDate: Date) => Promise<ComplianceReport>;
    calculateComplianceScore: (passedControls: number, totalControls: number, findings: ComplianceFinding[]) => number;
    identifyComplianceGaps: (framework: ComplianceFramework, currentState: Record<string, any>) => Promise<ComplianceFinding[]>;
    trackRemediationProgress: (findingId: string, status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED", updatedBy: string, notes?: string) => Promise<RemediationItem>;
    enforceRetentionPolicy: (policy: RetentionPolicy, documentIds: string[]) => Promise<{
        actionedDocuments: string[];
        actions: string[];
    }>;
    validateFDA21CFR11Compliance: (documentId: string, documentData: Record<string, any>) => Promise<ComplianceAuditResult>;
    assessCompliancePosture: (recentAudits: ComplianceAuditResult[]) => Promise<{
        score: number;
        trend: string;
        riskLevel: string;
        recommendations: string[];
    }>;
    generateExecutiveDashboard: (startDate: Date, endDate: Date) => Promise<Record<string, any>>;
    searchAuditTrail: (criteria: {
        eventType?: AuditEventType;
        userId?: string;
        documentId?: string;
        startDate?: Date;
        endDate?: Date;
    }) => Promise<AuditTrailEntry[]>;
    exportAuditTrail: (entries: AuditTrailEntry[], format: "json" | "csv" | "xml") => Promise<string>;
    archiveAuditTrail: (cutoffDate: Date, archiveLocation: string) => Promise<{
        archivedCount: number;
        archiveId: string;
    }>;
    validateGDPRCompliance: (processingActivity: Record<string, any>) => Promise<ComplianceAuditResult>;
    scheduleComplianceAudit: (config: ComplianceAuditConfig) => Promise<{
        scheduleId: string;
        nextRun: Date;
    }>;
    notifyComplianceFindings: (findings: ComplianceFinding[], recipients: string[]) => Promise<{
        notificationId: string;
        sentCount: number;
    }>;
    aggregateComplianceData: (frameworks: ComplianceFramework[], startDate: Date, endDate: Date) => Promise<Record<string, any>>;
    compareCompliancePeriods: (period1Start: Date, period1End: Date, period2Start: Date, period2End: Date) => Promise<Record<string, any>>;
    estimateRemediationEffort: (findings: ComplianceFinding[]) => Promise<{
        totalHours: number;
        byPriority: Record<string, number>;
    }>;
    prioritizeRemediationItems: (items: RemediationItem[]) => RemediationItem[];
    analyzeComplianceTrends: (historicalResults: ComplianceAuditResult[]) => Promise<Record<string, any>>;
    validateSOXCompliance: (documentId: string, controlData: Record<string, any>) => Promise<ComplianceAuditResult>;
    monitorComplianceRealtime: (framework: ComplianceFramework, event: Record<string, any>) => Promise<{
        alert: boolean;
        severity: ComplianceSeverity;
        message: string;
    }>;
    benchmarkCompliance: (framework: ComplianceFramework, currentScore: number) => Promise<{
        percentile: number;
        industryAverage: number;
        gap: number;
    }>;
    generateRemediationRecommendations: (finding: ComplianceFinding) => Promise<{
        recommendations: string[];
        estimatedEffort: number;
        priority: number;
    }>;
    trackCertificationRenewals: (framework: ComplianceFramework) => Promise<{
        expirationDate: Date;
        daysRemaining: number;
        status: string;
    }>;
    collectComplianceEvidence: (framework: ComplianceFramework, controlIds: string[]) => Promise<Record<string, string[]>>;
    simulateComplianceAudit: (framework: ComplianceFramework, configuration: Record<string, any>) => Promise<ComplianceAuditResult>;
    generateComplianceAttestation: (framework: ComplianceFramework, attestor: string, attestationDate: Date) => Promise<{
        documentId: string;
        content: string;
    }>;
    trackComplianceMetrics: (framework: ComplianceFramework, startDate: Date, endDate: Date) => Promise<Record<string, any>[]>;
    validateDocumentationCompleteness: (framework: ComplianceFramework, requiredDocuments: string[], availableDocuments: string[]) => Promise<{
        complete: boolean;
        missing: string[];
        coverage: number;
    }>;
    ComplianceAuditService: typeof ComplianceAuditService;
};
export default _default;
//# sourceMappingURL=document-compliance-audit-composite.d.ts.map