/**
 * LOC: COMPLMON4567890
 * File: /reuse/threat/compliance-monitoring-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS compliance services
 *   - Audit management modules
 *   - Regulatory compliance tracking
 *   - Control effectiveness testing
 *   - Certification management
 */
import { Model, Sequelize } from 'sequelize';
interface ComplianceFramework {
    id?: string;
    frameworkName: string;
    frameworkType: 'soc2' | 'iso27001' | 'nist' | 'hipaa' | 'gdpr' | 'pci_dss' | 'custom';
    version: string;
    description?: string;
    implementationDate?: Date;
    certificationRequired: boolean;
    certificationBody?: string;
    auditFrequency: 'monthly' | 'quarterly' | 'semi_annual' | 'annual' | 'biennial';
    nextAuditDate?: Date;
    status: 'planning' | 'implementing' | 'operational' | 'certified' | 'expired';
    owner: string;
    stakeholders: string[];
    domains: FrameworkDomain[];
    metadata?: Record<string, any>;
}
interface FrameworkDomain {
    domainId: string;
    domainName: string;
    description: string;
    controlCount: number;
    implementedCount: number;
    effectiveCount: number;
}
interface ComplianceControl {
    id?: string;
    frameworkId: string;
    controlId: string;
    controlName: string;
    controlType: 'preventive' | 'detective' | 'corrective' | 'directive';
    domain: string;
    description: string;
    objective: string;
    implementationGuidance?: string;
}
interface TestResult {
    testDate: Date;
    tester: string;
    testMethod: 'inspection' | 'observation' | 'inquiry' | 'reperformance' | 'automated';
    result: 'pass' | 'fail' | 'partial' | 'not_applicable';
    findings: string[];
    evidence: string[];
    notes?: string;
}
interface Audit {
    id?: string;
    auditName: string;
    auditType: 'internal' | 'external' | 'certification' | 'surveillance' | 'special';
    frameworkId?: string;
    scope: string[];
    startDate: Date;
    endDate?: Date;
    completedDate?: Date;
    status: 'planned' | 'in_progress' | 'fieldwork' | 'reporting' | 'completed' | 'cancelled';
    leadAuditor: string;
    auditTeam: string[];
    auditFirm?: string;
    objectives: string[];
    methodology?: string;
    findings: AuditFinding[];
    recommendations: string[];
    reportDate?: Date;
    reportUrl?: string;
    followUpDate?: Date;
    metadata?: Record<string, any>;
}
interface AuditFinding {
    findingId: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    controlId?: string;
    title: string;
    description: string;
    impact: string;
    recommendation: string;
    evidence: string[];
    status: 'open' | 'in_remediation' | 'resolved' | 'accepted_risk';
    assignedTo?: string;
    dueDate?: Date;
    resolvedDate?: Date;
    resolution?: string;
}
interface ComplianceGap {
    id?: string;
    frameworkId: string;
    gapType: 'control' | 'policy' | 'process' | 'documentation' | 'technical';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    currentState: string;
    requiredState: string;
    impactedControls: string[];
    businessImpact: string;
    remediationPlan?: string;
    estimatedEffort?: string;
    assignedTo?: string;
    targetDate?: Date;
    status: 'identified' | 'planning' | 'in_progress' | 'resolved' | 'accepted';
    identifiedDate: Date;
    resolvedDate?: Date;
    metadata?: Record<string, any>;
}
interface RegulatoryRequirement {
    id?: string;
    requirementId: string;
    regulatoryBody: string;
    regulationType: 'law' | 'regulation' | 'standard' | 'guideline' | 'best_practice';
    jurisdiction: string;
    title: string;
    description: string;
    effectiveDate: Date;
    expirationDate?: Date;
    applicability: string[];
    complianceDeadline?: Date;
    status: 'pending' | 'applicable' | 'compliant' | 'non_compliant' | 'not_applicable';
    owner: string;
    relatedControls: string[];
    evidenceRequired: string[];
    lastReviewed?: Date;
    nextReviewDate?: Date;
    metadata?: Record<string, any>;
}
interface Remediation {
    id?: string;
    findingId?: string;
    gapId?: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    assignedTo: string;
    assignedDate: Date;
    dueDate: Date;
    status: 'open' | 'in_progress' | 'pending_validation' | 'completed' | 'cancelled';
    completionPercentage: number;
    tasks: RemediationTask[];
    resources: string[];
    budget?: number;
    actualCost?: number;
    completedDate?: Date;
    validatedBy?: string;
    validatedDate?: Date;
    metadata?: Record<string, any>;
}
interface RemediationTask {
    taskId: string;
    taskName: string;
    description: string;
    assignedTo: string;
    dueDate: Date;
    status: 'pending' | 'in_progress' | 'completed';
    completedDate?: Date;
    notes?: string;
}
interface Certification {
    id?: string;
    frameworkId: string;
    certificationType: string;
    certificationBody: string;
    certificationNumber?: string;
    issueDate: Date;
    expirationDate: Date;
    status: 'active' | 'expiring_soon' | 'expired' | 'suspended' | 'revoked';
    scope: string[];
    certificationDocument?: string;
    auditId?: string;
    renewalRequired: boolean;
    renewalDate?: Date;
    cost?: number;
    contactPerson?: string;
    notes?: string;
    metadata?: Record<string, any>;
}
interface Evidence {
    id?: string;
    evidenceType: 'document' | 'screenshot' | 'log' | 'report' | 'attestation' | 'other';
    title: string;
    description?: string;
    relatedControlIds: string[];
    relatedAuditIds: string[];
    collectedDate: Date;
    collectedBy: string;
    validFrom?: Date;
    validUntil?: Date;
    fileUrl?: string;
    fileHash?: string;
    retentionPeriod?: number;
    confidentialityLevel: 'public' | 'internal' | 'confidential' | 'restricted';
    tags: string[];
    metadata?: Record<string, any>;
}
/**
 * Sequelize model for Compliance Frameworks.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ComplianceFramework model
 *
 * @example
 * const ComplianceFramework = defineComplianceFrameworkModel(sequelize);
 * await ComplianceFramework.create({
 *   frameworkName: 'SOC 2 Type II',
 *   frameworkType: 'soc2',
 *   version: '2024',
 *   certificationRequired: true,
 *   auditFrequency: 'annual',
 *   status: 'implementing',
 *   owner: 'user-123'
 * });
 */
export declare function defineComplianceFrameworkModel(sequelize: Sequelize): typeof Model;
/**
 * Sequelize model for Compliance Controls.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ComplianceControl model
 *
 * @example
 * const ComplianceControl = defineComplianceControlModel(sequelize);
 * await ComplianceControl.create({
 *   frameworkId: 'framework-123',
 *   controlId: 'CC6.1',
 *   controlName: 'Logical Access Controls',
 *   controlType: 'preventive',
 *   domain: 'Access Control',
 *   status: 'implemented'
 * });
 */
export declare function defineComplianceControlModel(sequelize: Sequelize): typeof Model;
/**
 * Sequelize model for Audits.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Audit model
 *
 * @example
 * const Audit = defineAuditModel(sequelize);
 * await Audit.create({
 *   auditName: 'SOC 2 Type II Audit 2024',
 *   auditType: 'certification',
 *   frameworkId: 'framework-123',
 *   startDate: new Date(),
 *   status: 'planned',
 *   leadAuditor: 'auditor-123'
 * });
 */
export declare function defineAuditModel(sequelize: Sequelize): typeof Model;
/**
 * Sequelize model for Compliance Gaps.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ComplianceGap model
 *
 * @example
 * const ComplianceGap = defineComplianceGapModel(sequelize);
 * await ComplianceGap.create({
 *   frameworkId: 'framework-123',
 *   gapType: 'control',
 *   severity: 'high',
 *   title: 'Missing MFA Implementation',
 *   currentState: 'Single factor authentication',
 *   requiredState: 'Multi-factor authentication',
 *   status: 'identified'
 * });
 */
export declare function defineComplianceGapModel(sequelize: Sequelize): typeof Model;
/**
 * Sequelize model for Certifications.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Certification model
 *
 * @example
 * const Certification = defineCertificationModel(sequelize);
 * await Certification.create({
 *   frameworkId: 'framework-123',
 *   certificationType: 'SOC 2 Type II',
 *   certificationBody: 'AICPA',
 *   issueDate: new Date(),
 *   expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
 *   status: 'active'
 * });
 */
export declare function defineCertificationModel(sequelize: Sequelize): typeof Model;
/**
 * Zod schema for compliance framework validation.
 */
export declare const complianceFrameworkSchema: any;
/**
 * Zod schema for compliance control validation.
 */
export declare const complianceControlSchema: any;
/**
 * Zod schema for audit validation.
 */
export declare const auditSchema: any;
/**
 * Zod schema for compliance gap validation.
 */
export declare const complianceGapSchema: any;
/**
 * Zod schema for certification validation.
 */
export declare const certificationSchema: any;
/**
 * Zod schema for test result validation.
 */
export declare const testResultSchema: any;
/**
 * Zod schema for audit finding validation.
 */
export declare const auditFindingSchema: any;
/**
 * Creates a new compliance framework.
 *
 * @param {typeof Model} frameworkModel - Framework model
 * @param {ComplianceFramework} framework - Framework data
 * @returns {Promise<any>} Created framework
 *
 * @example
 * await createComplianceFramework(ComplianceFramework, {
 *   frameworkName: 'SOC 2 Type II',
 *   frameworkType: 'soc2',
 *   version: '2024',
 *   certificationRequired: true,
 *   auditFrequency: 'annual',
 *   status: 'implementing',
 *   owner: 'user-123',
 *   stakeholders: ['user-456', 'user-789'],
 *   domains: []
 * });
 */
export declare function createComplianceFramework(frameworkModel: typeof Model, framework: ComplianceFramework): Promise<any>;
/**
 * Updates framework status and metadata.
 *
 * @param {typeof Model} frameworkModel - Framework model
 * @param {string} frameworkId - Framework ID
 * @param {Partial<ComplianceFramework>} updates - Framework updates
 * @returns {Promise<any>} Updated framework
 *
 * @example
 * await updateFrameworkStatus(ComplianceFramework, 'framework-123', {
 *   status: 'certified',
 *   nextAuditDate: new Date('2025-01-01')
 * });
 */
export declare function updateFrameworkStatus(frameworkModel: typeof Model, frameworkId: string, updates: Partial<ComplianceFramework>): Promise<any>;
/**
 * Gets framework with control statistics.
 *
 * @param {typeof Model} frameworkModel - Framework model
 * @param {typeof Model} controlModel - Control model
 * @param {string} frameworkId - Framework ID
 * @returns {Promise<any>} Framework with statistics
 *
 * @example
 * const framework = await getFrameworkWithStats(ComplianceFramework, ComplianceControl, 'framework-123');
 */
export declare function getFrameworkWithStats(frameworkModel: typeof Model, controlModel: typeof Model, frameworkId: string): Promise<any>;
/**
 * Lists all active frameworks.
 *
 * @param {typeof Model} frameworkModel - Framework model
 * @returns {Promise<any[]>} Active frameworks
 *
 * @example
 * const frameworks = await listActiveFrameworks(ComplianceFramework);
 */
export declare function listActiveFrameworks(frameworkModel: typeof Model): Promise<any[]>;
/**
 * Calculates framework maturity score.
 *
 * @param {any[]} controls - Framework controls
 * @returns {number} Maturity score (0-100)
 *
 * @example
 * const maturity = calculateFrameworkMaturity(controls);
 */
export declare function calculateFrameworkMaturity(controls: any[]): number;
/**
 * Gets frameworks requiring upcoming audits.
 *
 * @param {typeof Model} frameworkModel - Framework model
 * @param {number} daysAhead - Days to look ahead
 * @returns {Promise<any[]>} Frameworks needing audits
 *
 * @example
 * const upcoming = await getFrameworksNeedingAudit(ComplianceFramework, 60);
 */
export declare function getFrameworksNeedingAudit(frameworkModel: typeof Model, daysAhead?: number): Promise<any[]>;
/**
 * Creates a compliance control.
 *
 * @param {typeof Model} controlModel - Control model
 * @param {ComplianceControl} control - Control data
 * @returns {Promise<any>} Created control
 *
 * @example
 * await createComplianceControl(ComplianceControl, {
 *   frameworkId: 'framework-123',
 *   controlId: 'CC6.1',
 *   controlName: 'Logical Access Controls',
 *   controlType: 'preventive',
 *   domain: 'Access Control',
 *   description: 'Implement logical access controls',
 *   objective: 'Prevent unauthorized access',
 *   testingFrequency: 'quarterly',
 *   automationLevel: 'semi_automated',
 *   priority: 'high',
 *   status: 'not_implemented',
 *   owner: 'user-123'
 * });
 */
export declare function createComplianceControl(controlModel: typeof Model, control: ComplianceControl): Promise<any>;
/**
 * Performs control effectiveness testing.
 *
 * @param {typeof Model} controlModel - Control model
 * @param {string} controlId - Control ID
 * @param {TestResult} testResult - Test result data
 * @returns {Promise<any>} Updated control
 *
 * @example
 * await performControlTest(ComplianceControl, 'control-123', {
 *   testDate: new Date(),
 *   tester: 'user-456',
 *   testMethod: 'reperformance',
 *   result: 'pass',
 *   findings: [],
 *   evidence: ['evidence-1', 'evidence-2']
 * });
 */
export declare function performControlTest(controlModel: typeof Model, controlId: string, testResult: TestResult): Promise<any>;
/**
 * Calculates next test date based on frequency.
 *
 * @param {Date} lastTestDate - Last test date
 * @param {'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'} frequency - Testing frequency
 * @returns {Date} Next test date
 *
 * @example
 * const nextTest = calculateNextTestDate(new Date(), 'quarterly');
 */
export declare function calculateNextTestDate(lastTestDate: Date, frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'): Date;
/**
 * Gets controls requiring testing.
 *
 * @param {typeof Model} controlModel - Control model
 * @returns {Promise<any[]>} Controls due for testing
 *
 * @example
 * const dueControls = await getControlsDueForTesting(ComplianceControl);
 */
export declare function getControlsDueForTesting(controlModel: typeof Model): Promise<any[]>;
/**
 * Gets control effectiveness rate.
 *
 * @param {any[]} controls - Controls to analyze
 * @returns {number} Effectiveness rate percentage
 *
 * @example
 * const rate = getControlEffectivenessRate(controls);
 */
export declare function getControlEffectivenessRate(controls: any[]): number;
/**
 * Gets controls by domain.
 *
 * @param {typeof Model} controlModel - Control model
 * @param {string} frameworkId - Framework ID
 * @param {string} domain - Domain name
 * @returns {Promise<any[]>} Domain controls
 *
 * @example
 * const accessControls = await getControlsByDomain(ComplianceControl, 'framework-123', 'Access Control');
 */
export declare function getControlsByDomain(controlModel: typeof Model, frameworkId: string, domain: string): Promise<any[]>;
/**
 * Updates control implementation status.
 *
 * @param {typeof Model} controlModel - Control model
 * @param {string} controlId - Control ID
 * @param {'not_implemented' | 'in_progress' | 'implemented' | 'effective' | 'ineffective'} status - New status
 * @returns {Promise<any>} Updated control
 *
 * @example
 * await updateControlStatus(ComplianceControl, 'control-123', 'implemented');
 */
export declare function updateControlStatus(controlModel: typeof Model, controlId: string, status: 'not_implemented' | 'in_progress' | 'implemented' | 'effective' | 'ineffective'): Promise<any>;
/**
 * Gets critical controls with issues.
 *
 * @param {typeof Model} controlModel - Control model
 * @param {string} frameworkId - Framework ID
 * @returns {Promise<any[]>} Critical controls needing attention
 *
 * @example
 * const critical = await getCriticalControlsWithIssues(ComplianceControl, 'framework-123');
 */
export declare function getCriticalControlsWithIssues(controlModel: typeof Model, frameworkId: string): Promise<any[]>;
/**
 * Creates a new audit.
 *
 * @param {typeof Model} auditModel - Audit model
 * @param {Audit} audit - Audit data
 * @returns {Promise<any>} Created audit
 *
 * @example
 * await createAudit(Audit, {
 *   auditName: 'SOC 2 Type II Audit 2024',
 *   auditType: 'certification',
 *   frameworkId: 'framework-123',
 *   scope: ['All controls'],
 *   startDate: new Date(),
 *   status: 'planned',
 *   leadAuditor: 'auditor-123',
 *   auditTeam: ['auditor-456', 'auditor-789'],
 *   objectives: ['Assess control effectiveness']
 * });
 */
export declare function createAudit(auditModel: typeof Model, audit: Audit): Promise<any>;
/**
 * Adds audit finding.
 *
 * @param {typeof Model} auditModel - Audit model
 * @param {string} auditId - Audit ID
 * @param {AuditFinding} finding - Finding data
 * @returns {Promise<any>} Updated audit
 *
 * @example
 * await addAuditFinding(Audit, 'audit-123', {
 *   findingId: 'finding-1',
 *   severity: 'high',
 *   category: 'Access Control',
 *   title: 'Missing MFA',
 *   description: 'MFA not enabled for admin users',
 *   impact: 'Increased risk of unauthorized access',
 *   recommendation: 'Enable MFA for all administrative accounts',
 *   evidence: ['screenshot-1'],
 *   status: 'open'
 * });
 */
export declare function addAuditFinding(auditModel: typeof Model, auditId: string, finding: AuditFinding): Promise<any>;
/**
 * Updates audit status.
 *
 * @param {typeof Model} auditModel - Audit model
 * @param {string} auditId - Audit ID
 * @param {'planned' | 'in_progress' | 'fieldwork' | 'reporting' | 'completed' | 'cancelled'} status - New status
 * @returns {Promise<any>} Updated audit
 *
 * @example
 * await updateAuditStatus(Audit, 'audit-123', 'in_progress');
 */
export declare function updateAuditStatus(auditModel: typeof Model, auditId: string, status: 'planned' | 'in_progress' | 'fieldwork' | 'reporting' | 'completed' | 'cancelled'): Promise<any>;
/**
 * Gets audit findings by severity.
 *
 * @param {typeof Model} auditModel - Audit model
 * @param {string} auditId - Audit ID
 * @param {'low' | 'medium' | 'high' | 'critical'} severity - Severity level
 * @returns {Promise<AuditFinding[]>} Findings at severity level
 *
 * @example
 * const critical = await getAuditFindingsBySeverity(Audit, 'audit-123', 'critical');
 */
export declare function getAuditFindingsBySeverity(auditModel: typeof Model, auditId: string, severity: 'low' | 'medium' | 'high' | 'critical'): Promise<AuditFinding[]>;
/**
 * Gets active audits for a framework.
 *
 * @param {typeof Model} auditModel - Audit model
 * @param {string} frameworkId - Framework ID
 * @returns {Promise<any[]>} Active audits
 *
 * @example
 * const active = await getActiveAudits(Audit, 'framework-123');
 */
export declare function getActiveAudits(auditModel: typeof Model, frameworkId: string): Promise<any[]>;
/**
 * Closes audit with report.
 *
 * @param {typeof Model} auditModel - Audit model
 * @param {string} auditId - Audit ID
 * @param {string} reportUrl - Report URL
 * @param {string[]} recommendations - Audit recommendations
 * @returns {Promise<any>} Closed audit
 *
 * @example
 * await closeAudit(Audit, 'audit-123', 'https://reports.com/audit-123', ['Implement MFA', 'Update policies']);
 */
export declare function closeAudit(auditModel: typeof Model, auditId: string, reportUrl: string, recommendations: string[]): Promise<any>;
/**
 * Identifies compliance gap.
 *
 * @param {typeof Model} gapModel - Gap model
 * @param {ComplianceGap} gap - Gap data
 * @returns {Promise<any>} Created gap
 *
 * @example
 * await identifyComplianceGap(ComplianceGap, {
 *   frameworkId: 'framework-123',
 *   gapType: 'control',
 *   severity: 'high',
 *   title: 'Missing MFA Implementation',
 *   description: 'MFA not implemented for administrative access',
 *   currentState: 'Single factor authentication only',
 *   requiredState: 'Multi-factor authentication required',
 *   impactedControls: ['CC6.1'],
 *   businessImpact: 'Increased security risk',
 *   identifiedDate: new Date(),
 *   status: 'identified'
 * });
 */
export declare function identifyComplianceGap(gapModel: typeof Model, gap: ComplianceGap): Promise<any>;
/**
 * Updates gap remediation status.
 *
 * @param {typeof Model} gapModel - Gap model
 * @param {string} gapId - Gap ID
 * @param {'identified' | 'planning' | 'in_progress' | 'resolved' | 'accepted'} status - New status
 * @returns {Promise<any>} Updated gap
 *
 * @example
 * await updateGapStatus(ComplianceGap, 'gap-123', 'in_progress');
 */
export declare function updateGapStatus(gapModel: typeof Model, gapId: string, status: 'identified' | 'planning' | 'in_progress' | 'resolved' | 'accepted'): Promise<any>;
/**
 * Gets critical gaps requiring immediate attention.
 *
 * @param {typeof Model} gapModel - Gap model
 * @param {string} frameworkId - Framework ID
 * @returns {Promise<any[]>} Critical gaps
 *
 * @example
 * const critical = await getCriticalGaps(ComplianceGap, 'framework-123');
 */
export declare function getCriticalGaps(gapModel: typeof Model, frameworkId: string): Promise<any[]>;
/**
 * Generates gap analysis report.
 *
 * @param {typeof Model} gapModel - Gap model
 * @param {string} frameworkId - Framework ID
 * @returns {Promise<Record<string, any>>} Gap analysis summary
 *
 * @example
 * const report = await generateGapAnalysisReport(ComplianceGap, 'framework-123');
 */
export declare function generateGapAnalysisReport(gapModel: typeof Model, frameworkId: string): Promise<Record<string, any>>;
/**
 * Gets gaps by type.
 *
 * @param {typeof Model} gapModel - Gap model
 * @param {string} frameworkId - Framework ID
 * @param {'control' | 'policy' | 'process' | 'documentation' | 'technical'} gapType - Gap type
 * @returns {Promise<any[]>} Gaps of specified type
 *
 * @example
 * const controlGaps = await getGapsByType(ComplianceGap, 'framework-123', 'control');
 */
export declare function getGapsByType(gapModel: typeof Model, frameworkId: string, gapType: 'control' | 'policy' | 'process' | 'documentation' | 'technical'): Promise<any[]>;
/**
 * Assigns gap for remediation.
 *
 * @param {typeof Model} gapModel - Gap model
 * @param {string} gapId - Gap ID
 * @param {string} assignedTo - User ID
 * @param {Date} targetDate - Target completion date
 * @param {string} remediationPlan - Remediation plan
 * @returns {Promise<any>} Updated gap
 *
 * @example
 * await assignGapRemediation(ComplianceGap, 'gap-123', 'user-456', new Date('2024-12-31'), 'Implement MFA');
 */
export declare function assignGapRemediation(gapModel: typeof Model, gapId: string, assignedTo: string, targetDate: Date, remediationPlan: string): Promise<any>;
/**
 * Registers a new certification.
 *
 * @param {typeof Model} certificationModel - Certification model
 * @param {Certification} certification - Certification data
 * @returns {Promise<any>} Created certification
 *
 * @example
 * await registerCertification(Certification, {
 *   frameworkId: 'framework-123',
 *   certificationType: 'SOC 2 Type II',
 *   certificationBody: 'AICPA',
 *   issueDate: new Date(),
 *   expirationDate: new Date('2025-12-31'),
 *   status: 'active',
 *   scope: ['All controls'],
 *   renewalRequired: true
 * });
 */
export declare function registerCertification(certificationModel: typeof Model, certification: Certification): Promise<any>;
/**
 * Gets certifications expiring soon.
 *
 * @param {typeof Model} certificationModel - Certification model
 * @param {number} daysAhead - Days to look ahead
 * @returns {Promise<any[]>} Expiring certifications
 *
 * @example
 * const expiring = await getExpiringCertifications(Certification, 90);
 */
export declare function getExpiringCertifications(certificationModel: typeof Model, daysAhead?: number): Promise<any[]>;
/**
 * Updates certification status.
 *
 * @param {typeof Model} certificationModel - Certification model
 * @param {string} certificationId - Certification ID
 * @param {'active' | 'expiring_soon' | 'expired' | 'suspended' | 'revoked'} status - New status
 * @returns {Promise<any>} Updated certification
 *
 * @example
 * await updateCertificationStatus(Certification, 'cert-123', 'expiring_soon');
 */
export declare function updateCertificationStatus(certificationModel: typeof Model, certificationId: string, status: 'active' | 'expiring_soon' | 'expired' | 'suspended' | 'revoked'): Promise<any>;
/**
 * Schedules certification renewal.
 *
 * @param {typeof Model} certificationModel - Certification model
 * @param {string} certificationId - Certification ID
 * @param {Date} renewalDate - Renewal date
 * @returns {Promise<any>} Updated certification
 *
 * @example
 * await scheduleCertificationRenewal(Certification, 'cert-123', new Date('2024-10-01'));
 */
export declare function scheduleCertificationRenewal(certificationModel: typeof Model, certificationId: string, renewalDate: Date): Promise<any>;
/**
 * Gets active certifications for a framework.
 *
 * @param {typeof Model} certificationModel - Certification model
 * @param {string} frameworkId - Framework ID
 * @returns {Promise<any[]>} Active certifications
 *
 * @example
 * const certs = await getActiveCertifications(Certification, 'framework-123');
 */
export declare function getActiveCertifications(certificationModel: typeof Model, frameworkId: string): Promise<any[]>;
/**
 * Calculates certification coverage.
 *
 * @param {any[]} certifications - Active certifications
 * @param {any[]} frameworks - All frameworks
 * @returns {number} Coverage percentage
 *
 * @example
 * const coverage = calculateCertificationCoverage(certifications, frameworks);
 */
export declare function calculateCertificationCoverage(certifications: any[], frameworks: any[]): number;
/**
 * Tracks new regulatory requirement.
 *
 * @param {typeof Model} requirementModel - Regulatory requirement model (custom model)
 * @param {RegulatoryRequirement} requirement - Requirement data
 * @returns {Promise<any>} Created requirement
 *
 * @example
 * await trackRegulatoryRequirement(RegulatoryRequirement, {
 *   requirementId: 'HIPAA-164.308',
 *   regulatoryBody: 'HHS',
 *   regulationType: 'regulation',
 *   jurisdiction: 'USA',
 *   title: 'Administrative Safeguards',
 *   description: 'Implement administrative safeguards',
 *   effectiveDate: new Date(),
 *   applicability: ['Healthcare'],
 *   status: 'applicable',
 *   owner: 'user-123',
 *   relatedControls: ['control-456']
 * });
 */
export declare function trackRegulatoryRequirement(requirementModel: typeof Model, requirement: RegulatoryRequirement): Promise<any>;
/**
 * Collects compliance evidence.
 *
 * @param {typeof Model} evidenceModel - Evidence model (custom model)
 * @param {Evidence} evidence - Evidence data
 * @returns {Promise<any>} Created evidence
 *
 * @example
 * await collectEvidence(Evidence, {
 *   evidenceType: 'document',
 *   title: 'Security Policy Document',
 *   description: 'Annual security policy review',
 *   relatedControlIds: ['control-123'],
 *   relatedAuditIds: ['audit-456'],
 *   collectedDate: new Date(),
 *   collectedBy: 'user-789',
 *   fileUrl: 'https://docs.com/policy.pdf',
 *   confidentialityLevel: 'internal',
 *   tags: ['policy', 'security']
 * });
 */
export declare function collectEvidence(evidenceModel: typeof Model, evidence: Evidence): Promise<any>;
/**
 * Creates remediation plan for findings.
 *
 * @param {typeof Model} remediationModel - Remediation model (custom model)
 * @param {Remediation} remediation - Remediation data
 * @returns {Promise<any>} Created remediation plan
 *
 * @example
 * await createRemediationPlan(Remediation, {
 *   findingId: 'finding-123',
 *   title: 'Implement MFA',
 *   description: 'Enable multi-factor authentication for all users',
 *   priority: 'high',
 *   assignedTo: 'user-456',
 *   assignedDate: new Date(),
 *   dueDate: new Date('2024-12-31'),
 *   status: 'open',
 *   completionPercentage: 0,
 *   tasks: [],
 *   resources: ['IT Team', 'Security Team']
 * });
 */
export declare function createRemediationPlan(remediationModel: typeof Model, remediation: Remediation): Promise<any>;
/**
 * Generates compliance report.
 *
 * @param {typeof Model} reportModel - Report model (custom model)
 * @param {typeof Model} frameworkModel - Framework model
 * @param {typeof Model} controlModel - Control model
 * @param {string} frameworkId - Framework ID
 * @param {string} reportingPeriod - Reporting period
 * @param {string} generatedBy - User generating report
 * @returns {Promise<any>} Generated report
 *
 * @example
 * const report = await generateComplianceReport(
 *   ComplianceReport,
 *   ComplianceFramework,
 *   ComplianceControl,
 *   'framework-123',
 *   '2024-Q1',
 *   'user-456'
 * );
 */
export declare function generateComplianceReport(reportModel: typeof Model, frameworkModel: typeof Model, controlModel: typeof Model, frameworkId: string, reportingPeriod: string, generatedBy: string): Promise<any>;
/**
 * Automates control testing.
 *
 * @param {typeof Model} controlModel - Control model
 * @param {string} controlId - Control ID
 * @param {() => Promise<boolean>} automationScript - Automation script to execute
 * @returns {Promise<TestResult>} Test result
 *
 * @example
 * const result = await automateControlTest(
 *   ComplianceControl,
 *   'control-123',
 *   async () => {
 *     // Automated test logic
 *     return true;
 *   }
 * );
 */
export declare function automateControlTest(controlModel: typeof Model, controlId: string, automationScript: () => Promise<boolean>): Promise<TestResult>;
/**
 * Calculates compliance dashboard metrics.
 *
 * @param {typeof Model} frameworkModel - Framework model
 * @param {typeof Model} controlModel - Control model
 * @param {typeof Model} auditModel - Audit model
 * @param {typeof Model} gapModel - Gap model
 * @returns {Promise<Record<string, any>>} Dashboard metrics
 *
 * @example
 * const metrics = await getComplianceDashboard(
 *   ComplianceFramework,
 *   ComplianceControl,
 *   Audit,
 *   ComplianceGap
 * );
 */
export declare function getComplianceDashboard(frameworkModel: typeof Model, controlModel: typeof Model, auditModel: typeof Model, gapModel: typeof Model): Promise<Record<string, any>>;
/**
 * Monitors regulatory changes and updates.
 *
 * @param {typeof Model} requirementModel - Requirement model (custom model)
 * @param {string} jurisdiction - Jurisdiction to monitor
 * @param {Date} sinceDate - Monitor changes since date
 * @returns {Promise<any[]>} New or updated requirements
 *
 * @example
 * const changes = await monitorRegulatoryChanges(
 *   RegulatoryRequirement,
 *   'USA',
 *   new Date('2024-01-01')
 * );
 */
export declare function monitorRegulatoryChanges(requirementModel: typeof Model, jurisdiction: string, sinceDate: Date): Promise<any[]>;
export declare class CreateFrameworkDto {
    frameworkName: string;
    frameworkType: string;
    version: string;
    certificationRequired: boolean;
    auditFrequency: string;
    owner: string;
    stakeholders: string[];
}
export declare class CreateControlDto {
    frameworkId: string;
    controlId: string;
    controlName: string;
    controlType: string;
    domain: string;
    description: string;
    objective: string;
    testingFrequency: string;
    owner: string;
}
export declare class CreateAuditDto {
    auditName: string;
    auditType: string;
    frameworkId: string;
    scope: string[];
    startDate: Date;
    leadAuditor: string;
    objectives: string[];
}
export declare class CreateGapDto {
    frameworkId: string;
    gapType: string;
    severity: string;
    title: string;
    description: string;
    currentState: string;
    requiredState: string;
    impactedControls: string[];
    businessImpact: string;
}
export declare class CreateCertificationDto {
    frameworkId: string;
    certificationType: string;
    certificationBody: string;
    issueDate: Date;
    expirationDate: Date;
    scope: string[];
    renewalRequired: boolean;
}
export {};
//# sourceMappingURL=compliance-monitoring-kit.d.ts.map