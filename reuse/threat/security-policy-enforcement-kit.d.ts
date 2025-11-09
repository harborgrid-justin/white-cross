/**
 * LOC: THREATPOLICY89013
 * File: /reuse/threat/security-policy-enforcement-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Policy management services
 *   - Compliance enforcement controllers
 *   - Security governance modules
 *   - Audit and reporting services
 */
/**
 * File: /reuse/threat/security-policy-enforcement-kit.ts
 * Locator: WC-THREAT-POLICY-001
 * Purpose: Enterprise Security Policy Enforcement - ISO 27001, NIST, CIS Controls compliant
 *
 * Upstream: Independent security policy enforcement utility module
 * Downstream: ../backend/*, Policy controllers, Compliance services, Security governance, Audit systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 38+ utility functions for policy definition, compliance checking, violation detection, enforcement automation, exception management
 *
 * LLM Context: Enterprise-grade security policy enforcement framework compliant with ISO 27001, NIST CSF, CIS Controls.
 * Provides comprehensive policy definition and management, policy compliance checking and validation, policy violation detection and alerting,
 * automated policy enforcement, exception request and approval workflows, policy audit reporting, security baseline enforcement,
 * configuration compliance verification, policy versioning and change management, role-based policy application,
 * policy effectiveness measurement, remediation tracking, continuous compliance monitoring, policy template library,
 * and integrated governance, risk, and compliance (GRC) workflows with full audit trails.
 */
import { Model, Sequelize, Transaction } from 'sequelize';
export declare enum PolicyFramework {
    ISO_27001 = "iso-27001",
    NIST_CSF = "nist-csf",
    CIS_CONTROLS = "cis-controls",
    HIPAA = "hipaa",
    PCI_DSS = "pci-dss",
    GDPR = "gdpr",
    SOC_2 = "soc-2",
    CUSTOM = "custom"
}
export declare enum PolicyCategory {
    ACCESS_CONTROL = "access-control",
    DATA_PROTECTION = "data-protection",
    NETWORK_SECURITY = "network-security",
    ENCRYPTION = "encryption",
    AUTHENTICATION = "authentication",
    INCIDENT_RESPONSE = "incident-response",
    CHANGE_MANAGEMENT = "change-management",
    ASSET_MANAGEMENT = "asset-management",
    VULNERABILITY_MANAGEMENT = "vulnerability-management",
    BACKUP_RECOVERY = "backup-recovery",
    MONITORING_LOGGING = "monitoring-logging",
    PHYSICAL_SECURITY = "physical-security"
}
export declare enum PolicySeverity {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    INFORMATIONAL = "informational"
}
export declare enum PolicyStatus {
    DRAFT = "draft",
    REVIEW = "review",
    APPROVED = "approved",
    ACTIVE = "active",
    SUSPENDED = "suspended",
    DEPRECATED = "deprecated",
    ARCHIVED = "archived"
}
export declare enum ComplianceStatus {
    COMPLIANT = "compliant",
    NON_COMPLIANT = "non-compliant",
    PARTIALLY_COMPLIANT = "partially-compliant",
    NOT_APPLICABLE = "not-applicable",
    PENDING_REVIEW = "pending-review",
    EXCEPTION_GRANTED = "exception-granted"
}
export declare enum ViolationSeverity {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
export declare enum ViolationStatus {
    DETECTED = "detected",
    INVESTIGATING = "investigating",
    REMEDIATION_IN_PROGRESS = "remediation-in-progress",
    REMEDIATED = "remediated",
    EXCEPTION_REQUESTED = "exception-requested",
    EXCEPTION_GRANTED = "exception-granted",
    FALSE_POSITIVE = "false-positive"
}
export declare enum EnforcementAction {
    ALERT = "alert",
    BLOCK = "block",
    QUARANTINE = "quarantine",
    DISABLE = "disable",
    TERMINATE = "terminate",
    NOTIFY = "notify",
    LOG_ONLY = "log-only"
}
export declare enum ExceptionStatus {
    REQUESTED = "requested",
    UNDER_REVIEW = "under-review",
    APPROVED = "approved",
    DENIED = "denied",
    EXPIRED = "expired",
    REVOKED = "revoked"
}
export declare enum PolicyScope {
    ORGANIZATION = "organization",
    DEPARTMENT = "department",
    TEAM = "team",
    APPLICATION = "application",
    SYSTEM = "system",
    USER = "user"
}
export declare class CreateSecurityPolicyDto {
    name: string;
    description: string;
    framework: PolicyFramework;
    category: PolicyCategory;
    severity: PolicySeverity;
    scope: PolicyScope;
    rules: Record<string, any>;
    enforcementAction: EnforcementAction;
    applicableRoles?: string[];
    metadata?: Record<string, any>;
}
export declare class CreateComplianceCheckDto {
    name: string;
    description: string;
    checkCriteria: Record<string, any>;
    frequency?: string;
    automated?: boolean;
}
export declare class CreateViolationDto {
    title: string;
    description: string;
    severity: ViolationSeverity;
    affectedEntity: string;
    evidence?: Record<string, any>;
}
export declare class CreateExceptionRequestDto {
    reason: string;
    justification: string;
    requestedExpiryDate: Date;
    metadata?: Record<string, any>;
}
export declare class PolicyComplianceReportDto {
    startDate: Date;
    endDate: Date;
    frameworks?: PolicyFramework[];
    categories?: PolicyCategory[];
}
export declare class SecurityPolicy extends Model {
    id: string;
    name: string;
    description: string;
    framework: PolicyFramework;
    category: PolicyCategory;
    severity: PolicySeverity;
    scope: PolicyScope;
    rules: Record<string, any>;
    enforcementAction: EnforcementAction;
    applicableRoles: string[];
    status: PolicyStatus;
    version: number;
    approvedBy: string;
    approvedAt: Date;
    effectiveDate: Date;
    expiryDate: Date;
    lastReviewDate: Date;
    nextReviewDate: Date;
    violationCount: number;
    complianceRate: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ComplianceCheck extends Model {
    id: string;
    policyId: string;
    name: string;
    description: string;
    checkCriteria: Record<string, any>;
    frequency: string;
    automated: boolean;
    lastCheckDate: Date;
    nextCheckDate: Date;
    lastCheckStatus: ComplianceStatus;
    passRate: number;
    failCount: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare class PolicyViolation extends Model {
    id: string;
    policyId: string;
    complianceCheckId: string;
    title: string;
    description: string;
    severity: ViolationSeverity;
    affectedEntity: string;
    evidence: Record<string, any>;
    status: ViolationStatus;
    detectedAt: Date;
    acknowledgedAt: Date;
    remediatedAt: Date;
    assignedTo: string;
    remediationNotes: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare class PolicyException extends Model {
    id: string;
    policyId: string;
    violationId: string;
    requestedBy: string;
    reason: string;
    justification: string;
    status: ExceptionStatus;
    reviewedBy: string;
    reviewedAt: Date;
    reviewNotes: string;
    approvedAt: Date;
    expiryDate: Date;
    conditions: Record<string, any>;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare class PolicyAuditLog extends Model {
    id: string;
    policyId: string;
    action: string;
    performedBy: string;
    changes: Record<string, any>;
    timestamp: Date;
    ipAddress: string;
    metadata: Record<string, any>;
    createdAt: Date;
}
/**
 * Initialize Security Policy model
 * @param sequelize Sequelize instance
 * @returns SecurityPolicy model
 */
export declare function initSecurityPolicyModel(sequelize: Sequelize): typeof SecurityPolicy;
/**
 * Initialize Compliance Check model
 * @param sequelize Sequelize instance
 * @returns ComplianceCheck model
 */
export declare function initComplianceCheckModel(sequelize: Sequelize): typeof ComplianceCheck;
/**
 * Initialize Policy Violation model
 * @param sequelize Sequelize instance
 * @returns PolicyViolation model
 */
export declare function initPolicyViolationModel(sequelize: Sequelize): typeof PolicyViolation;
/**
 * Initialize Policy Exception model
 * @param sequelize Sequelize instance
 * @returns PolicyException model
 */
export declare function initPolicyExceptionModel(sequelize: Sequelize): typeof PolicyException;
/**
 * Initialize Policy Audit Log model
 * @param sequelize Sequelize instance
 * @returns PolicyAuditLog model
 */
export declare function initPolicyAuditLogModel(sequelize: Sequelize): typeof PolicyAuditLog;
/**
 * Create a new security policy
 * @param data Policy data
 * @param transaction Optional transaction
 * @returns Created policy
 */
export declare function createSecurityPolicy(data: CreateSecurityPolicyDto, transaction?: Transaction): Promise<SecurityPolicy>;
/**
 * Update policy status
 * @param policyId Policy ID
 * @param status New status
 * @param approvedBy Approver user ID
 * @param transaction Optional transaction
 * @returns Updated policy
 */
export declare function updatePolicyStatus(policyId: string, status: PolicyStatus, approvedBy?: string, transaction?: Transaction): Promise<SecurityPolicy>;
/**
 * Create new policy version
 * @param policyId Policy ID
 * @param updates Policy updates
 * @param updatedBy User ID
 * @param transaction Optional transaction
 * @returns New policy version
 */
export declare function createPolicyVersion(policyId: string, updates: Partial<CreateSecurityPolicyDto>, updatedBy: string, transaction?: Transaction): Promise<SecurityPolicy>;
/**
 * Get policy by ID with full details
 * @param policyId Policy ID
 * @param transaction Optional transaction
 * @returns Policy with related data
 */
export declare function getPolicyWithDetails(policyId: string, transaction?: Transaction): Promise<{
    policy: SecurityPolicy;
    checks: ComplianceCheck[];
    activeViolations: PolicyViolation[];
    exceptions: PolicyException[];
}>;
/**
 * Get policies by framework
 * @param framework Policy framework
 * @param transaction Optional transaction
 * @returns Policies
 */
export declare function getPoliciesByFramework(framework: PolicyFramework, transaction?: Transaction): Promise<SecurityPolicy[]>;
/**
 * Create compliance check
 * @param policyId Policy ID
 * @param data Check data
 * @param transaction Optional transaction
 * @returns Created check
 */
export declare function createComplianceCheck(policyId: string, data: CreateComplianceCheckDto, transaction?: Transaction): Promise<ComplianceCheck>;
/**
 * Execute compliance check
 * @param checkId Check ID
 * @param checkFunction Function to perform the check
 * @param transaction Optional transaction
 * @returns Check results
 */
export declare function executeComplianceCheck(checkId: string, checkFunction: () => Promise<{
    passed: boolean;
    failedEntities: string[];
}>, transaction?: Transaction): Promise<ComplianceCheck>;
/**
 * Validate entity against policy rules
 * @param policy Security policy
 * @param entityData Entity data to validate
 * @returns Validation result
 */
export declare function validateAgainstPolicy(policy: SecurityPolicy, entityData: Record<string, any>): {
    compliant: boolean;
    violations: string[];
    details: Record<string, any>;
};
/**
 * Calculate policy compliance rate
 * @param policyId Policy ID
 * @param transaction Optional transaction
 * @returns Compliance rate
 */
export declare function calculatePolicyComplianceRate(policyId: string, transaction?: Transaction): Promise<number>;
/**
 * Create policy violation
 * @param policyId Policy ID
 * @param data Violation data
 * @param complianceCheckId Optional compliance check ID
 * @param transaction Optional transaction
 * @returns Created violation
 */
export declare function createPolicyViolation(policyId: string, data: CreateViolationDto, complianceCheckId?: string, transaction?: Transaction): Promise<PolicyViolation>;
/**
 * Update violation status
 * @param violationId Violation ID
 * @param status New status
 * @param assignedTo Assignee
 * @param notes Notes
 * @param transaction Optional transaction
 * @returns Updated violation
 */
export declare function updateViolationStatus(violationId: string, status: ViolationStatus, assignedTo?: string, notes?: string, transaction?: Transaction): Promise<PolicyViolation>;
/**
 * Detect violations for a specific policy
 * @param policyId Policy ID
 * @param entities Entities to check
 * @param transaction Optional transaction
 * @returns Detected violations
 */
export declare function detectPolicyViolations(policyId: string, entities: Array<{
    id: string;
    data: Record<string, any>;
}>, transaction?: Transaction): Promise<PolicyViolation[]>;
/**
 * Get critical violations
 * @param transaction Optional transaction
 * @returns Critical violations
 */
export declare function getCriticalViolations(transaction?: Transaction): Promise<PolicyViolation[]>;
/**
 * Execute enforcement action for violation
 * @param violationId Violation ID
 * @param transaction Optional transaction
 * @returns Enforcement result
 */
export declare function executeEnforcementAction(violationId: string, transaction?: Transaction): Promise<{
    action: EnforcementAction;
    success: boolean;
    details: string;
}>;
/**
 * Auto-remediate violations where possible
 * @param violationId Violation ID
 * @param remediationFunction Function to perform auto-remediation
 * @param transaction Optional transaction
 * @returns Remediation result
 */
export declare function autoRemediateViolation(violationId: string, remediationFunction: () => Promise<boolean>, transaction?: Transaction): Promise<PolicyViolation>;
/**
 * Schedule automated compliance check
 * @param checkId Compliance check ID
 * @param checkFunction Function to perform the check
 * @returns Scheduled task info
 */
export declare function scheduleAutomatedCheck(checkId: string, checkFunction: () => Promise<{
    passed: boolean;
    failedEntities: string[];
}>): {
    checkId: string;
    scheduled: boolean;
    nextRun: Date;
};
/**
 * Create exception request
 * @param policyId Policy ID
 * @param violationId Violation ID
 * @param requestedBy User ID
 * @param data Exception request data
 * @param transaction Optional transaction
 * @returns Created exception
 */
export declare function createExceptionRequest(policyId: string, violationId: string, requestedBy: string, data: CreateExceptionRequestDto, transaction?: Transaction): Promise<PolicyException>;
/**
 * Review exception request
 * @param exceptionId Exception ID
 * @param approved Whether approved
 * @param reviewedBy Reviewer user ID
 * @param reviewNotes Review notes
 * @param transaction Optional transaction
 * @returns Updated exception
 */
export declare function reviewExceptionRequest(exceptionId: string, approved: boolean, reviewedBy: string, reviewNotes: string, transaction?: Transaction): Promise<PolicyException>;
/**
 * Check for expired exceptions
 * @param transaction Optional transaction
 * @returns Expired exceptions
 */
export declare function findExpiredExceptions(transaction?: Transaction): Promise<PolicyException[]>;
/**
 * Revoke exception
 * @param exceptionId Exception ID
 * @param revokedBy User ID
 * @param reason Revocation reason
 * @param transaction Optional transaction
 * @returns Updated exception
 */
export declare function revokeException(exceptionId: string, revokedBy: string, reason: string, transaction?: Transaction): Promise<PolicyException>;
/**
 * Log policy action to audit log
 * @param policyId Policy ID
 * @param action Action performed
 * @param performedBy User ID
 * @param changes Changes made
 * @param transaction Optional transaction
 * @returns Created audit log entry
 */
export declare function logPolicyAction(policyId: string, action: string, performedBy: string, changes: Record<string, any>, transaction?: Transaction): Promise<PolicyAuditLog>;
/**
 * Generate compliance report
 * @param params Report parameters
 * @param transaction Optional transaction
 * @returns Compliance report
 */
export declare function generateComplianceReport(params: PolicyComplianceReportDto, transaction?: Transaction): Promise<{
    summary: {
        totalPolicies: number;
        compliantPolicies: number;
        nonCompliantPolicies: number;
        overallComplianceRate: number;
    };
    byFramework: Map<PolicyFramework, {
        policies: number;
        violations: number;
    }>;
    byCategory: Map<PolicyCategory, {
        policies: number;
        violations: number;
    }>;
    criticalViolations: number;
    openViolations: number;
    remediatedViolations: number;
}>;
/**
 * Get audit trail for policy
 * @param policyId Policy ID
 * @param startDate Start date
 * @param endDate End date
 * @param transaction Optional transaction
 * @returns Audit log entries
 */
export declare function getPolicyAuditTrail(policyId: string, startDate: Date, endDate: Date, transaction?: Transaction): Promise<PolicyAuditLog[]>;
/**
 * Define security baseline
 * @param name Baseline name
 * @param policies Policy IDs to include
 * @param transaction Optional transaction
 * @returns Baseline configuration
 */
export declare function defineSecurityBaseline(name: string, policies: string[], transaction?: Transaction): Promise<{
    name: string;
    policies: SecurityPolicy[];
    enforcementLevel: string;
}>;
/**
 * Validate system against security baseline
 * @param baselinePolicies Baseline policies
 * @param systemConfig System configuration
 * @returns Validation results
 */
export declare function validateSecurityBaseline(baselinePolicies: SecurityPolicy[], systemConfig: Record<string, any>): {
    compliant: boolean;
    passedPolicies: string[];
    failedPolicies: Array<{
        policyId: string;
        violations: string[];
    }>;
    complianceScore: number;
};
/**
 * Enforce security baseline on system
 * @param baselinePolicies Baseline policies
 * @param systemId System identifier
 * @param transaction Optional transaction
 * @returns Enforcement results
 */
export declare function enforceSecurityBaseline(baselinePolicies: SecurityPolicy[], systemId: string, transaction?: Transaction): Promise<{
    systemId: string;
    enforced: boolean;
    policiesApplied: number;
    violationsDetected: number;
}>;
/**
 * Check configuration compliance
 * @param config Configuration to check
 * @param policyId Policy ID
 * @param transaction Optional transaction
 * @returns Compliance result
 */
export declare function checkConfigurationCompliance(config: Record<string, any>, policyId: string, transaction?: Transaction): Promise<{
    compliant: boolean;
    policyName: string;
    violations: string[];
    recommendations: string[];
}>;
/**
 * Generate configuration hardening guide
 * @param policies Policies to include
 * @returns Hardening guide
 */
export declare function generateConfigurationHardeningGuide(policies: SecurityPolicy[]): {
    title: string;
    policies: Array<{
        category: string;
        name: string;
        requirements: string[];
        severity: string;
    }>;
    summary: string;
};
export declare class SecurityPolicyEnforcementService {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    createPolicy(data: CreateSecurityPolicyDto): Promise<SecurityPolicy>;
    createComplianceCheck(policyId: string, data: CreateComplianceCheckDto): Promise<ComplianceCheck>;
    detectViolations(policyId: string, entities: Array<{
        id: string;
        data: Record<string, any>;
    }>): Promise<PolicyViolation[]>;
    generateReport(params: PolicyComplianceReportDto): Promise<ReturnType<typeof generateComplianceReport>>;
    enforceBaseline(baselineName: string, policyIds: string[], systemId: string): Promise<ReturnType<typeof enforceSecurityBaseline>>;
}
declare const _default: {
    SecurityPolicy: typeof SecurityPolicy;
    ComplianceCheck: typeof ComplianceCheck;
    PolicyViolation: typeof PolicyViolation;
    PolicyException: typeof PolicyException;
    PolicyAuditLog: typeof PolicyAuditLog;
    initSecurityPolicyModel: typeof initSecurityPolicyModel;
    initComplianceCheckModel: typeof initComplianceCheckModel;
    initPolicyViolationModel: typeof initPolicyViolationModel;
    initPolicyExceptionModel: typeof initPolicyExceptionModel;
    initPolicyAuditLogModel: typeof initPolicyAuditLogModel;
    createSecurityPolicy: typeof createSecurityPolicy;
    updatePolicyStatus: typeof updatePolicyStatus;
    createPolicyVersion: typeof createPolicyVersion;
    getPolicyWithDetails: typeof getPolicyWithDetails;
    getPoliciesByFramework: typeof getPoliciesByFramework;
    createComplianceCheck: typeof createComplianceCheck;
    executeComplianceCheck: typeof executeComplianceCheck;
    validateAgainstPolicy: typeof validateAgainstPolicy;
    calculatePolicyComplianceRate: typeof calculatePolicyComplianceRate;
    createPolicyViolation: typeof createPolicyViolation;
    updateViolationStatus: typeof updateViolationStatus;
    detectPolicyViolations: typeof detectPolicyViolations;
    getCriticalViolations: typeof getCriticalViolations;
    executeEnforcementAction: typeof executeEnforcementAction;
    autoRemediateViolation: typeof autoRemediateViolation;
    scheduleAutomatedCheck: typeof scheduleAutomatedCheck;
    createExceptionRequest: typeof createExceptionRequest;
    reviewExceptionRequest: typeof reviewExceptionRequest;
    findExpiredExceptions: typeof findExpiredExceptions;
    revokeException: typeof revokeException;
    logPolicyAction: typeof logPolicyAction;
    generateComplianceReport: typeof generateComplianceReport;
    getPolicyAuditTrail: typeof getPolicyAuditTrail;
    defineSecurityBaseline: typeof defineSecurityBaseline;
    validateSecurityBaseline: typeof validateSecurityBaseline;
    enforceSecurityBaseline: typeof enforceSecurityBaseline;
    checkConfigurationCompliance: typeof checkConfigurationCompliance;
    generateConfigurationHardeningGuide: typeof generateConfigurationHardeningGuide;
    SecurityPolicyEnforcementService: typeof SecurityPolicyEnforcementService;
};
export default _default;
//# sourceMappingURL=security-policy-enforcement-kit.d.ts.map