/**
 * Financial Compliance Audit Kit (FIN-COMP-001)
 *
 * Comprehensive suite of 35 functions for enterprise financial compliance, audit trail management,
 * and regulatory adherence. Supports SOX, GAAP/IFRS, internal controls, segregation of duties,
 * and security standards (SOC2, ISO 27001).
 *
 * Target Platforms: AuditBoard, Workiva
 * Stack: NestJS 10.x, Sequelize 6.x, TypeScript 5.x
 *
 * Categories:
 * - SOX Compliance (4 functions)
 * - GAAP/IFRS Validation (4 functions)
 * - Audit Trail Management (4 functions)
 * - Internal Controls (4 functions)
 * - Segregation of Duties (4 functions)
 * - Access Control (4 functions)
 * - Change Tracking & Versioning (4 functions)
 * - Risk Assessment (3 functions)
 * - Security & Compliance (4 functions)
 *
 * @module financial-compliance-audit-kit
 * @version 1.0.0
 */
/**
 * Audit trail entry for compliance tracking
 */
interface AuditEntry {
    id: string;
    timestamp: Date;
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    oldValue?: Record<string, unknown>;
    newValue?: Record<string, unknown>;
    ipAddress: string;
    status: 'success' | 'failure';
    errorMessage?: string;
    hash?: string;
}
/**
 * SOX compliance deficiency record
 */
interface ComplianceDeficiency {
    id: string;
    controlId: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    detectedDate: Date;
    dueDate: Date;
    remediationPlan: string;
    status: 'open' | 'in-progress' | 'resolved' | 'verified';
    owner: string;
}
/**
 * Internal control test result
 */
interface ControlTestResult {
    id: string;
    controlId: string;
    testDate: Date;
    testMethod: string;
    sampleSize: number;
    deviations: number;
    effectiveness: number;
    notes: string;
    tester: string;
}
/**
 * Segregation of duties violation record
 */
interface SODViolation {
    id: string;
    userId: string;
    conflictingRoles: string[];
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    detectedDate: Date;
    status: 'active' | 'waived' | 'resolved';
    waiverExpiryDate?: Date;
}
/**
 * Access control anomaly detection
 */
interface AccessAnomaly {
    id: string;
    userId: string;
    resourceAccessed: string;
    anomalyType: string;
    riskScore: number;
    timestamp: Date;
    details: Record<string, unknown>;
    investigated: boolean;
}
/**
 * Risk assessment record
 */
interface RiskAssessment {
    id: string;
    processId: string;
    riskDescription: string;
    likelihood: number;
    impact: number;
    riskScore: number;
    mitigation: string;
    owner: string;
    reviewDate: Date;
}
/**
 * Compliance report summary
 */
interface ComplianceReport {
    id: string;
    reportType: 'SOX' | 'GAAP' | 'IFRS' | 'SOC2' | 'ISO27001';
    periodStart: Date;
    periodEnd: Date;
    findings: number;
    remediations: number;
    status: 'draft' | 'submitted' | 'approved';
    preparedBy: string;
    approvedBy?: string;
}
/**
 * Change log for version tracking
 */
interface ChangeLog {
    id: string;
    documentId: string;
    version: number;
    changedBy: string;
    changedAt: Date;
    changeType: 'create' | 'update' | 'delete';
    fieldChanges: Record<string, {
        old: unknown;
        new: unknown;
    }>;
    changeHash: string;
}
/**
 * Test SOX Section 404 control effectiveness
 */
export declare function testSOXControl(controlId: string, testSampleSize: number, deviations: number): ControlTestResult;
/**
 * Document SOX control evidence
 */
export declare function documentSOXEvidence(controlId: string, description: string, evidenceData: Record<string, unknown>): {
    id: string;
    controlId: string;
    timestamp: Date;
    evidenceHash: string;
};
/**
 * Report SOX compliance deficiencies
 */
export declare function reportSOXDeficiency(controlId: string, severity: 'critical' | 'high' | 'medium' | 'low', description: string, daysToRemediate: number): ComplianceDeficiency;
/**
 * Remediate SOX control deficiency
 */
export declare function remediateSOXControl(deficiencyId: string, remediationPlan: string, verificationEvidence: Record<string, unknown>): {
    id: string;
    status: 'verified';
    verificationHash: string;
};
/**
 * Validate GAAP/IFRS accounting standards
 */
export declare function validateAccountingStandard(transaction: Record<string, unknown>, standard: 'GAAP' | 'IFRS'): {
    valid: boolean;
    violations: string[];
};
/**
 * Check financial disclosure requirements
 */
export declare function checkDisclosureRequirements(financialData: Record<string, unknown>, reportType: 'GAAP' | 'IFRS'): {
    disclosuresNeeded: string[];
    completeness: number;
};
/**
 * Verify financial calculations for accuracy
 */
export declare function verifyFinancialCalculations(source: {
    debits: number;
    credits: number;
    netIncome: number;
}): {
    balanced: boolean;
    tolerance: number;
    discrepancy?: number;
};
/**
 * Generate GAAP/IFRS compliance report
 */
export declare function generateAccountingComplianceReport(periodStart: Date, periodEnd: Date, findings: number): ComplianceReport;
/**
 * Create immutable audit entry with HMAC signature
 */
export declare function createAuditEntry(userId: string, action: string, entityType: string, entityId: string, newValue: Record<string, unknown>, ipAddress: string, secret: string): AuditEntry;
/**
 * Query audit trail with time-based filtering
 */
export declare function queryAuditTrail(entries: AuditEntry[], filters: {
    userId?: string;
    entityType?: string;
    startDate?: Date;
    endDate?: Date;
}): AuditEntry[];
/**
 * Analyze audit trail for suspicious patterns
 */
export declare function analyzeAuditTrailPatterns(entries: AuditEntry[]): {
    suspiciousUsers: string[];
    unusualTimes: number;
    bulkOperations: number;
};
/**
 * Export audit trail in compliance format
 */
export declare function exportAuditTrail(entries: AuditEntry[], format: 'csv' | 'json'): string;
/**
 * Define new internal control with ownership
 */
export declare function defineInternalControl(controlName: string, controlType: string, owner: string, testingFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'): {
    id: string;
    createdAt: Date;
    status: 'active';
};
/**
 * Test control effectiveness with statistical analysis
 */
export declare function testControlEffectiveness(controlId: string, sampleSize: number, deviations: number): {
    controlId: string;
    effectiveness: number;
    compliant: boolean;
};
/**
 * Document control testing results and methodology
 */
export declare function documentControlTesting(controlId: string, testMethod: string, sampleSize: number, results: {
    deviations: number;
    notes: string;
}): ControlTestResult;
/**
 * Monitor control performance over time
 */
export declare function monitorControlPerformance(controlId: string, historicalResults: ControlTestResult[]): {
    currentEffectiveness: number;
    trend: 'improving' | 'stable' | 'declining';
};
/**
 * Validate user role combinations for SOD compliance
 */
export declare function validateSegregationOfDuties(userId: string, userRoles: string[], conflictingRolePairs: string[][]): {
    compliant: boolean;
    conflicts: string[];
};
/**
 * Detect SOD violations in user access matrix
 */
export declare function detectSODViolations(userRoles: Map<string, string[]>, conflictingPairs: string[][]): SODViolation[];
/**
 * Report SOD violations to compliance team
 */
export declare function reportSODViolations(violations: SODViolation[]): {
    totalViolations: number;
    critical: number;
    requiresAction: boolean;
};
/**
 * Remediate SOD violation (waiver or role removal)
 */
export declare function remediateSODViolation(violationId: string, remediationType: 'waiver' | 'remove-role', waiverExpiryDays?: number): {
    violationId: string;
    status: 'active' | 'waived';
    expiryDate?: Date;
};
/**
 * Audit user access patterns and permissions
 */
export declare function auditAccessControl(userId: string, accessRecords: {
    timestamp: Date;
    resource: string;
    action: string;
}[]): {
    accessCount: number;
    uniqueResources: number;
    lastAccess: Date;
};
/**
 * Detect access anomalies using behavioral analysis
 */
export declare function detectAccessAnomalies(userId: string, accessRecords: {
    timestamp: Date;
    resource: string;
    ipAddress: string;
}[], baselinePatterns: {
    avgAccessesPerDay: number;
    usualIPs: string[];
}): AccessAnomaly[];
/**
 * Review access changes and privilege escalations
 */
export declare function reviewAccessChanges(userId: string, previousRoles: string[], currentRoles: string[]): {
    rolesAdded: string[];
    rolesRemoved: string[];
    reviewRequired: boolean;
};
/**
 * Generate access control report for period
 */
export declare function generateAccessControlReport(periodStart: Date, periodEnd: Date, accessChanges: number, anomalies: number): ComplianceReport;
/**
 * Log document change with full history
 */
export declare function logDocumentChange(documentId: string, version: number, changedBy: string, changeType: 'create' | 'update' | 'delete', fieldChanges: Record<string, {
    old: unknown;
    new: unknown;
}>): ChangeLog;
/**
 * Compare two document versions for differences
 */
export declare function compareDocumentVersions(v1: Record<string, unknown>, v2: Record<string, unknown>): Record<string, {
    old: unknown;
    new: unknown;
}>;
/**
 * Rollback document to previous version
 */
export declare function rollbackDocumentVersion(documentId: string, targetVersion: number, changelog: ChangeLog[]): {
    documentId: string;
    rolledBackToVersion: number;
    timestamp: Date;
};
/**
 * Audit change log for integrity
 */
export declare function auditChangeLogIntegrity(changelog: ChangeLog[], secret: string): {
    valid: boolean;
    tamperedEntries: string[];
};
/**
 * Assess operational risk for process
 */
export declare function assessOperationalRisk(processId: string, riskDescription: string, likelihood: number, impact: number): RiskAssessment;
/**
 * Score risk using standardized matrix
 */
export declare function scoreRisk(assessment: RiskAssessment): {
    score: number;
    category: 'critical' | 'high' | 'medium' | 'low';
};
/**
 * Prioritize risks for mitigation planning
 */
export declare function prioritizeRisks(assessments: RiskAssessment[]): {
    critical: RiskAssessment[];
    high: RiskAssessment[];
    medium: RiskAssessment[];
    low: RiskAssessment[];
};
/**
 * Encrypt sensitive compliance data with AES-256-GCM
 */
export declare function encryptComplianceData(data: Record<string, unknown>, encryptionKey: Buffer): {
    encrypted: string;
    iv: string;
    authTag: string;
};
/**
 * Verify compliance data integrity
 */
export declare function verifyComplianceDataIntegrity(data: Record<string, unknown>, expectedHash: string): {
    valid: boolean;
    checksum: string;
};
/**
 * Generate SOC2 Type II compliance report
 */
export declare function generateSOC2Report(auditPeriodStart: Date, auditPeriodEnd: Date, testResults: ControlTestResult[]): ComplianceReport;
/**
 * Generate ISO 27001 information security report
 */
export declare function generateISO27001Report(auditPeriodStart: Date, auditPeriodEnd: Date, findings: number, remediations: number): ComplianceReport;
export {};
//# sourceMappingURL=financial-compliance-audit-kit.d.ts.map