/**
 * LOC: LEGAL_REGCOMP_001
 * File: /reuse/legal/regulatory-compliance-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize
 *   - sequelize-typescript
 *   - zod
 *   - rxjs
 *
 * DOWNSTREAM (imported by):
 *   - Legal compliance controllers
 *   - Regulatory monitoring services
 *   - Compliance audit systems
 *   - Risk management dashboards
 *   - Regulatory reporting modules
 *   - Legal operations systems
 */
import { Model, Sequelize, Transaction } from 'sequelize';
/**
 * Regulatory framework enumeration
 */
export declare enum RegulatoryFramework {
    HIPAA = "HIPAA",
    HITECH = "HITECH",
    GDPR = "GDPR",
    CCPA = "CCPA",
    FDA = "FDA",
    CMS = "CMS",
    STARK_LAW = "STARK_LAW",
    ANTI_KICKBACK = "ANTI_KICKBACK",
    EMTALA = "EMTALA",
    STATE_HEALTH_BOARD = "STATE_HEALTH_BOARD",
    OSHA = "OSHA",
    DEA = "DEA",
    CLIA = "CLIA",
    CUSTOM = "CUSTOM"
}
/**
 * Compliance status enumeration
 */
export declare enum ComplianceStatus {
    COMPLIANT = "COMPLIANT",
    NON_COMPLIANT = "NON_COMPLIANT",
    PARTIALLY_COMPLIANT = "PARTIALLY_COMPLIANT",
    UNDER_REVIEW = "UNDER_REVIEW",
    REMEDIATION_IN_PROGRESS = "REMEDIATION_IN_PROGRESS",
    EXEMPTED = "EXEMPTED",
    NOT_APPLICABLE = "NOT_APPLICABLE"
}
/**
 * Regulation severity level
 */
export declare enum RegulationSeverity {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    INFORMATIONAL = "INFORMATIONAL"
}
/**
 * Jurisdiction type
 */
export declare enum JurisdictionType {
    FEDERAL = "FEDERAL",
    STATE = "STATE",
    COUNTY = "COUNTY",
    MUNICIPAL = "MUNICIPAL",
    INTERNATIONAL = "INTERNATIONAL"
}
/**
 * Regulatory change impact level
 */
export declare enum ImpactLevel {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    MINIMAL = "MINIMAL"
}
/**
 * Regulation metadata interface
 */
export interface RegulationMetadata {
    id?: string;
    regulationCode: string;
    title: string;
    description: string;
    framework: RegulatoryFramework;
    jurisdiction: string;
    jurisdictionType: JurisdictionType;
    effectiveDate: Date;
    expirationDate?: Date;
    severity: RegulationSeverity;
    category: string;
    subcategory?: string;
    requirements: string[];
    penalties?: string;
    citations?: string[];
    relatedRegulations?: string[];
    enforcingAuthority: string;
    metadata?: Record<string, any>;
    isActive: boolean;
    version: string;
    lastReviewedDate?: Date;
    nextReviewDate?: Date;
}
/**
 * Compliance rule definition
 */
export interface ComplianceRule {
    id?: string;
    ruleCode: string;
    name: string;
    description: string;
    regulationId: string;
    ruleType: 'validation' | 'monitoring' | 'reporting' | 'procedural';
    conditions: RuleCondition[];
    actions: RuleAction[];
    priority: number;
    enabled: boolean;
    automatedCheck: boolean;
    frequency?: 'realtime' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
    threshold?: Record<string, any>;
    metadata?: Record<string, any>;
}
/**
 * Rule condition for compliance evaluation
 */
export interface RuleCondition {
    field: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'between' | 'exists' | 'custom';
    value: any;
    logicalOperator?: 'AND' | 'OR';
}
/**
 * Rule action to execute on compliance events
 */
export interface RuleAction {
    type: 'alert' | 'escalate' | 'remediate' | 'log' | 'notify' | 'block';
    target: string;
    parameters?: Record<string, any>;
}
/**
 * Compliance audit record
 */
export interface ComplianceAudit {
    id?: string;
    auditType: 'scheduled' | 'triggered' | 'manual' | 'external';
    regulationId: string;
    entityType: string;
    entityId: string;
    auditorId?: string;
    status: ComplianceStatus;
    findings: ComplianceFinding[];
    score?: number;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
    startDate: Date;
    completionDate?: Date;
    dueDate?: Date;
    evidence?: Evidence[];
    recommendations?: string[];
    remediationPlan?: RemediationPlan;
    metadata?: Record<string, any>;
}
/**
 * Compliance finding from audit
 */
export interface ComplianceFinding {
    findingId: string;
    ruleId: string;
    description: string;
    severity: RegulationSeverity;
    status: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
    evidence?: string[];
    recommendation?: string;
    assignedTo?: string;
    dueDate?: Date;
}
/**
 * Evidence documentation
 */
export interface Evidence {
    type: 'document' | 'screenshot' | 'log' | 'testimony' | 'data_export';
    description: string;
    fileUrl?: string;
    collectedBy: string;
    collectedAt: Date;
    hash?: string;
}
/**
 * Remediation plan for non-compliance
 */
export interface RemediationPlan {
    planId: string;
    description: string;
    steps: RemediationStep[];
    assignedTo: string;
    targetDate: Date;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    completionPercentage: number;
}
/**
 * Remediation step
 */
export interface RemediationStep {
    stepNumber: number;
    description: string;
    assignedTo: string;
    status: 'pending' | 'in_progress' | 'completed';
    dueDate: Date;
    completedDate?: Date;
    notes?: string;
}
/**
 * Regulatory change notification
 */
export interface RegulatoryChange {
    id?: string;
    changeType: 'new_regulation' | 'amendment' | 'repeal' | 'interpretation' | 'enforcement_update';
    regulationId?: string;
    framework: RegulatoryFramework;
    jurisdiction: string;
    title: string;
    description: string;
    effectiveDate: Date;
    announcedDate: Date;
    impactLevel: ImpactLevel;
    affectedEntities?: string[];
    requiredActions?: string[];
    deadlines?: Date[];
    source: string;
    sourceUrl?: string;
    reviewed: boolean;
    reviewedBy?: string;
    reviewedAt?: Date;
    impactAssessment?: ImpactAssessment;
    metadata?: Record<string, any>;
}
/**
 * Impact assessment for regulatory changes
 */
export interface ImpactAssessment {
    assessmentId: string;
    changeId: string;
    impactAreas: string[];
    affectedProcesses: string[];
    estimatedCost?: number;
    estimatedEffort?: string;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
    mitigationStrategy?: string;
    implementationPlan?: string;
    assessedBy: string;
    assessedAt: Date;
}
/**
 * Jurisdiction-specific compliance requirement
 */
export interface JurisdictionRequirement {
    id?: string;
    jurisdiction: string;
    jurisdictionType: JurisdictionType;
    framework: RegulatoryFramework;
    requirementCode: string;
    description: string;
    applicability: string[];
    effectiveDate: Date;
    expirationDate?: Date;
    specificProvisions?: Record<string, any>;
    variations?: Record<string, any>;
    localAuthority: string;
    isActive: boolean;
}
/**
 * Compliance report configuration
 */
export interface ComplianceReportConfig {
    reportType: string;
    framework: RegulatoryFramework;
    jurisdiction?: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'on_demand';
    includedMetrics: string[];
    recipients: string[];
    format: 'pdf' | 'excel' | 'json' | 'html';
    automated: boolean;
    template?: string;
}
/**
 * Risk assessment result
 */
export interface RiskAssessment {
    assessmentId: string;
    entityType: string;
    entityId: string;
    framework: RegulatoryFramework;
    overallRiskScore: number;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
    riskFactors: RiskFactor[];
    assessedBy: string;
    assessedAt: Date;
    validUntil: Date;
    recommendations: string[];
}
/**
 * Risk factor in assessment
 */
export interface RiskFactor {
    factor: string;
    score: number;
    weight: number;
    description: string;
    mitigation?: string;
}
export declare const RegulationMetadataSchema: any;
export declare const ComplianceRuleSchema: any;
export declare const ComplianceAuditSchema: any;
export declare const RegulatoryChangeSchema: any;
/**
 * Sequelize model for Regulations with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} Regulation model
 *
 * @example
 * const Regulation = defineRegulationModel(sequelize);
 * await Regulation.create({
 *   regulationCode: 'HIPAA-164.502',
 *   title: 'Uses and Disclosures of PHI',
 *   framework: 'HIPAA',
 *   jurisdiction: 'United States',
 *   jurisdictionType: 'FEDERAL'
 * });
 */
export declare function defineRegulationModel(sequelize: Sequelize): typeof Model;
/**
 * Sequelize model for Compliance Rules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} ComplianceRule model
 *
 * @example
 * const ComplianceRule = defineComplianceRuleModel(sequelize);
 * await ComplianceRule.create({
 *   ruleCode: 'HIPAA-PHI-ENCRYPTION',
 *   name: 'PHI Encryption Validation',
 *   regulationId: 'regulation-uuid',
 *   ruleType: 'validation',
 *   enabled: true
 * });
 */
export declare function defineComplianceRuleModel(sequelize: Sequelize): typeof Model;
/**
 * Sequelize model for Compliance Audits.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} ComplianceAudit model
 *
 * @example
 * const ComplianceAudit = defineComplianceAuditModel(sequelize);
 * await ComplianceAudit.create({
 *   auditType: 'scheduled',
 *   regulationId: 'regulation-uuid',
 *   entityType: 'facility',
 *   entityId: 'facility-uuid',
 *   status: 'UNDER_REVIEW'
 * });
 */
export declare function defineComplianceAuditModel(sequelize: Sequelize): typeof Model;
/**
 * Sequelize model for Regulatory Changes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} RegulatoryChange model
 *
 * @example
 * const RegulatoryChange = defineRegulatoryChangeModel(sequelize);
 * await RegulatoryChange.create({
 *   changeType: 'amendment',
 *   framework: 'HIPAA',
 *   jurisdiction: 'United States',
 *   title: 'Updated Privacy Rule',
 *   impactLevel: 'HIGH'
 * });
 */
export declare function defineRegulatoryChangeModel(sequelize: Sequelize): typeof Model;
/**
 * Sequelize model for Jurisdiction Requirements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {typeof Model} JurisdictionRequirement model
 *
 * @example
 * const JurisdictionRequirement = defineJurisdictionRequirementModel(sequelize);
 * await JurisdictionRequirement.create({
 *   jurisdiction: 'California',
 *   jurisdictionType: 'STATE',
 *   framework: 'CCPA',
 *   requirementCode: 'CCPA-1798.100'
 * });
 */
export declare function defineJurisdictionRequirementModel(sequelize: Sequelize): typeof Model;
/**
 * Tracks a new regulation in the system.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RegulationMetadata} data - Regulation metadata
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created regulation record
 * @throws {BadRequestException} If validation fails
 * @throws {ConflictException} If regulation code already exists
 *
 * @example
 * const regulation = await trackRegulation(sequelize, {
 *   regulationCode: 'HIPAA-164.502',
 *   title: 'Uses and Disclosures of PHI',
 *   framework: RegulatoryFramework.HIPAA,
 *   jurisdiction: 'United States',
 *   jurisdictionType: JurisdictionType.FEDERAL,
 *   effectiveDate: new Date('2013-09-23'),
 *   severity: RegulationSeverity.HIGH,
 *   category: 'Privacy',
 *   requirements: ['Obtain patient consent', 'Limit disclosures'],
 *   enforcingAuthority: 'HHS/OCR',
 *   version: '1.0'
 * });
 */
export declare function trackRegulation(sequelize: Sequelize, data: RegulationMetadata, transaction?: Transaction): Promise<Model>;
/**
 * Retrieves regulations by framework and jurisdiction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RegulatoryFramework} framework - Regulatory framework
 * @param {string} [jurisdiction] - Optional jurisdiction filter
 * @param {boolean} [activeOnly=true] - Return only active regulations
 * @returns {Promise<Model[]>} List of matching regulations
 *
 * @example
 * const hipaaRegulations = await getRegulationsByFramework(
 *   sequelize,
 *   RegulatoryFramework.HIPAA,
 *   'United States',
 *   true
 * );
 */
export declare function getRegulationsByFramework(sequelize: Sequelize, framework: RegulatoryFramework, jurisdiction?: string, activeOnly?: boolean): Promise<Model[]>;
/**
 * Updates regulation metadata and creates audit trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} regulationId - Regulation ID
 * @param {Partial<RegulationMetadata>} updates - Fields to update
 * @param {string} updatedBy - User ID performing the update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated regulation record
 * @throws {NotFoundException} If regulation not found
 *
 * @example
 * const updated = await updateRegulation(
 *   sequelize,
 *   'regulation-uuid',
 *   { severity: RegulationSeverity.CRITICAL, lastReviewedDate: new Date() },
 *   'user-uuid'
 * );
 */
export declare function updateRegulation(sequelize: Sequelize, regulationId: string, updates: Partial<RegulationMetadata>, updatedBy: string, transaction?: Transaction): Promise<Model>;
/**
 * Monitors regulations for upcoming review dates.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [daysAhead=30] - Days ahead to check
 * @returns {Promise<Model[]>} Regulations due for review
 *
 * @example
 * const dueForReview = await monitorRegulationReviews(sequelize, 30);
 * console.log(`${dueForReview.length} regulations need review in next 30 days`);
 */
export declare function monitorRegulationReviews(sequelize: Sequelize, daysAhead?: number): Promise<Model[]>;
/**
 * Archives expired or superseded regulations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} regulationId - Regulation ID to archive
 * @param {string} reason - Reason for archiving
 * @param {string} archivedBy - User ID performing archival
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Archived regulation
 * @throws {NotFoundException} If regulation not found
 *
 * @example
 * await archiveRegulation(
 *   sequelize,
 *   'regulation-uuid',
 *   'Superseded by updated regulation',
 *   'user-uuid'
 * );
 */
export declare function archiveRegulation(sequelize: Sequelize, regulationId: string, reason: string, archivedBy: string, transaction?: Transaction): Promise<Model>;
/**
 * Searches regulations with full-text and filter capabilities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} filters - Search filters
 * @param {number} [limit=50] - Results limit
 * @param {number} [offset=0] - Results offset
 * @returns {Promise<{rows: Model[], count: number}>} Search results with count
 *
 * @example
 * const results = await searchRegulations(sequelize, {
 *   searchTerm: 'privacy',
 *   framework: RegulatoryFramework.HIPAA,
 *   severity: [RegulationSeverity.HIGH, RegulationSeverity.CRITICAL],
 *   category: 'Privacy'
 * }, 20, 0);
 */
export declare function searchRegulations(sequelize: Sequelize, filters: {
    searchTerm?: string;
    framework?: RegulatoryFramework;
    jurisdiction?: string;
    severity?: RegulationSeverity[];
    category?: string;
    activeOnly?: boolean;
}, limit?: number, offset?: number): Promise<{
    rows: Model[];
    count: number;
}>;
/**
 * Links related regulations for cross-referencing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} regulationId - Primary regulation ID
 * @param {string[]} relatedIds - Array of related regulation IDs
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated regulation with links
 * @throws {NotFoundException} If regulation not found
 *
 * @example
 * await linkRelatedRegulations(
 *   sequelize,
 *   'regulation-uuid-1',
 *   ['regulation-uuid-2', 'regulation-uuid-3']
 * );
 */
export declare function linkRelatedRegulations(sequelize: Sequelize, regulationId: string, relatedIds: string[], transaction?: Transaction): Promise<Model>;
/**
 * Creates a compliance rule with validation logic.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ComplianceRule} ruleData - Rule configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created compliance rule
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * const rule = await createComplianceRule(sequelize, {
 *   ruleCode: 'HIPAA-PHI-ENCRYPTION',
 *   name: 'PHI Data Encryption Check',
 *   description: 'Validates that PHI is encrypted at rest',
 *   regulationId: 'regulation-uuid',
 *   ruleType: 'validation',
 *   conditions: [{
 *     field: 'encryption.enabled',
 *     operator: 'equals',
 *     value: true
 *   }],
 *   actions: [{
 *     type: 'alert',
 *     target: 'security-team@example.com'
 *   }],
 *   priority: 95,
 *   enabled: true,
 *   automatedCheck: true,
 *   frequency: 'daily'
 * });
 */
export declare function createComplianceRule(sequelize: Sequelize, ruleData: ComplianceRule, transaction?: Transaction): Promise<Model>;
/**
 * Evaluates compliance rules against entity data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityType - Type of entity being evaluated
 * @param {string} entityId - Entity ID
 * @param {Record<string, any>} entityData - Entity data for evaluation
 * @returns {Promise<{passed: boolean, violations: any[], warnings: any[]}>} Evaluation results
 *
 * @example
 * const result = await evaluateComplianceRules(
 *   sequelize,
 *   'patient_record',
 *   'patient-uuid',
 *   {
 *     encryption: { enabled: true, algorithm: 'AES-256' },
 *     accessControls: { enabled: true },
 *     auditLogging: { enabled: true }
 *   }
 * );
 * if (!result.passed) {
 *   console.log('Compliance violations:', result.violations);
 * }
 */
export declare function evaluateComplianceRules(sequelize: Sequelize, entityType: string, entityId: string, entityData: Record<string, any>): Promise<{
    passed: boolean;
    violations: any[];
    warnings: any[];
}>;
/**
 * Retrieves rules by regulation and type.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} regulationId - Regulation ID
 * @param {string} [ruleType] - Optional rule type filter
 * @returns {Promise<Model[]>} Matching compliance rules
 *
 * @example
 * const validationRules = await getRulesByRegulation(
 *   sequelize,
 *   'regulation-uuid',
 *   'validation'
 * );
 */
export declare function getRulesByRegulation(sequelize: Sequelize, regulationId: string, ruleType?: string): Promise<Model[]>;
/**
 * Updates rule execution statistics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} ruleId - Rule ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated rule
 *
 * @example
 * await updateRuleExecutionStats(sequelize, 'rule-uuid');
 */
export declare function updateRuleExecutionStats(sequelize: Sequelize, ruleId: string, transaction?: Transaction): Promise<Model>;
/**
 * Enables or disables a compliance rule.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} ruleId - Rule ID
 * @param {boolean} enabled - Enable/disable flag
 * @param {string} modifiedBy - User ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated rule
 *
 * @example
 * await toggleComplianceRule(sequelize, 'rule-uuid', false, 'user-uuid');
 */
export declare function toggleComplianceRule(sequelize: Sequelize, ruleId: string, enabled: boolean, modifiedBy: string, transaction?: Transaction): Promise<Model>;
/**
 * Bulk evaluates multiple entities against compliance rules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Array<{entityType: string, entityId: string, data: Record<string, any>}>} entities - Entities to evaluate
 * @returns {Promise<Array<{entityId: string, passed: boolean, violations: any[]}>>} Bulk evaluation results
 *
 * @example
 * const results = await bulkEvaluateCompliance(sequelize, [
 *   { entityType: 'facility', entityId: 'facility-1', data: {...} },
 *   { entityType: 'facility', entityId: 'facility-2', data: {...} }
 * ]);
 */
export declare function bulkEvaluateCompliance(sequelize: Sequelize, entities: Array<{
    entityType: string;
    entityId: string;
    data: Record<string, any>;
}>): Promise<Array<{
    entityId: string;
    passed: boolean;
    violations: any[];
}>>;
/**
 * Retrieves high-priority active rules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [minPriority=80] - Minimum priority threshold
 * @returns {Promise<Model[]>} High-priority rules
 *
 * @example
 * const criticalRules = await getHighPriorityRules(sequelize, 90);
 */
export declare function getHighPriorityRules(sequelize: Sequelize, minPriority?: number): Promise<Model[]>;
/**
 * Initiates a compliance audit for an entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ComplianceAudit} auditData - Audit configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created audit record
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * const audit = await initiateComplianceAudit(sequelize, {
 *   auditType: 'scheduled',
 *   regulationId: 'regulation-uuid',
 *   entityType: 'facility',
 *   entityId: 'facility-uuid',
 *   auditorId: 'user-uuid',
 *   status: ComplianceStatus.UNDER_REVIEW,
 *   findings: [],
 *   riskLevel: 'medium',
 *   startDate: new Date(),
 *   dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
 * });
 */
export declare function initiateComplianceAudit(sequelize: Sequelize, auditData: ComplianceAudit, transaction?: Transaction): Promise<Model>;
/**
 * Records compliance findings during an audit.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} auditId - Audit ID
 * @param {ComplianceFinding[]} findings - Array of findings
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated audit with findings
 * @throws {NotFoundException} If audit not found
 *
 * @example
 * await recordComplianceFindings(sequelize, 'audit-uuid', [
 *   {
 *     findingId: 'finding-1',
 *     ruleId: 'rule-uuid',
 *     description: 'Missing encryption on PHI storage',
 *     severity: RegulationSeverity.CRITICAL,
 *     status: 'open',
 *     recommendation: 'Enable AES-256 encryption',
 *     dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
 *   }
 * ]);
 */
export declare function recordComplianceFindings(sequelize: Sequelize, auditId: string, findings: ComplianceFinding[], transaction?: Transaction): Promise<Model>;
/**
 * Completes a compliance audit with final assessment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} auditId - Audit ID
 * @param {number} score - Compliance score (0-100)
 * @param {ComplianceStatus} finalStatus - Final compliance status
 * @param {string[]} [recommendations] - Optional recommendations
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Completed audit
 * @throws {NotFoundException} If audit not found
 *
 * @example
 * await completeComplianceAudit(
 *   sequelize,
 *   'audit-uuid',
 *   85,
 *   ComplianceStatus.PARTIALLY_COMPLIANT,
 *   ['Implement encryption', 'Update access controls']
 * );
 */
export declare function completeComplianceAudit(sequelize: Sequelize, auditId: string, score: number, finalStatus: ComplianceStatus, recommendations?: string[], transaction?: Transaction): Promise<Model>;
/**
 * Creates a remediation plan for non-compliance findings.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} auditId - Audit ID
 * @param {RemediationPlan} plan - Remediation plan
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated audit with remediation plan
 * @throws {NotFoundException} If audit not found
 *
 * @example
 * await createRemediationPlan(sequelize, 'audit-uuid', {
 *   planId: 'plan-uuid',
 *   description: 'Address critical security gaps',
 *   steps: [
 *     {
 *       stepNumber: 1,
 *       description: 'Enable database encryption',
 *       assignedTo: 'user-uuid',
 *       status: 'pending',
 *       dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
 *     }
 *   ],
 *   assignedTo: 'manager-uuid',
 *   targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
 *   status: 'pending',
 *   completionPercentage: 0
 * });
 */
export declare function createRemediationPlan(sequelize: Sequelize, auditId: string, plan: RemediationPlan, transaction?: Transaction): Promise<Model>;
/**
 * Updates remediation step progress.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} auditId - Audit ID
 * @param {number} stepNumber - Step number to update
 * @param {'pending' | 'in_progress' | 'completed'} status - New status
 * @param {string} [notes] - Optional notes
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated audit
 *
 * @example
 * await updateRemediationStep(
 *   sequelize,
 *   'audit-uuid',
 *   1,
 *   'completed',
 *   'Encryption enabled on all databases'
 * );
 */
export declare function updateRemediationStep(sequelize: Sequelize, auditId: string, stepNumber: number, status: 'pending' | 'in_progress' | 'completed', notes?: string, transaction?: Transaction): Promise<Model>;
/**
 * Retrieves audits by entity with filtering.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {ComplianceStatus} [status] - Optional status filter
 * @returns {Promise<Model[]>} List of audits
 *
 * @example
 * const audits = await getAuditsByEntity(
 *   sequelize,
 *   'facility',
 *   'facility-uuid',
 *   ComplianceStatus.UNDER_REVIEW
 * );
 */
export declare function getAuditsByEntity(sequelize: Sequelize, entityType: string, entityId: string, status?: ComplianceStatus): Promise<Model[]>;
/**
 * Generates compliance audit summary statistics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date for report period
 * @param {Date} endDate - End date for report period
 * @returns {Promise<object>} Audit statistics
 *
 * @example
 * const stats = await getAuditStatistics(
 *   sequelize,
 *   new Date('2025-01-01'),
 *   new Date('2025-12-31')
 * );
 * console.log(`Compliance rate: ${stats.complianceRate}%`);
 */
export declare function getAuditStatistics(sequelize: Sequelize, startDate: Date, endDate: Date): Promise<{
    totalAudits: number;
    compliantCount: number;
    nonCompliantCount: number;
    averageScore: number;
    complianceRate: number;
    byRiskLevel: Record<string, number>;
}>;
/**
 * Registers a new regulatory change notification.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RegulatoryChange} changeData - Change notification data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created change record
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * const change = await registerRegulatoryChange(sequelize, {
 *   changeType: 'amendment',
 *   regulationId: 'regulation-uuid',
 *   framework: RegulatoryFramework.HIPAA,
 *   jurisdiction: 'United States',
 *   title: 'HIPAA Privacy Rule Update 2025',
 *   description: 'New requirements for patient consent forms',
 *   effectiveDate: new Date('2025-07-01'),
 *   announcedDate: new Date('2025-01-15'),
 *   impactLevel: ImpactLevel.HIGH,
 *   source: 'HHS/OCR',
 *   sourceUrl: 'https://www.hhs.gov/hipaa/updates',
 *   reviewed: false
 * });
 */
export declare function registerRegulatoryChange(sequelize: Sequelize, changeData: RegulatoryChange, transaction?: Transaction): Promise<Model>;
/**
 * Detects pending regulatory changes requiring review.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [daysUntilEffective=90] - Days until effective date threshold
 * @returns {Promise<Model[]>} Pending changes requiring attention
 *
 * @example
 * const pendingChanges = await detectPendingChanges(sequelize, 60);
 * console.log(`${pendingChanges.length} changes need review before effective date`);
 */
export declare function detectPendingChanges(sequelize: Sequelize, daysUntilEffective?: number): Promise<Model[]>;
/**
 * Performs impact assessment for regulatory change.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} changeId - Change ID
 * @param {ImpactAssessment} assessment - Impact assessment data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated change with assessment
 * @throws {NotFoundException} If change not found
 *
 * @example
 * await assessRegulatoryImpact(sequelize, 'change-uuid', {
 *   assessmentId: 'assessment-uuid',
 *   changeId: 'change-uuid',
 *   impactAreas: ['patient_consent', 'data_sharing', 'record_retention'],
 *   affectedProcesses: ['admissions', 'treatment', 'billing'],
 *   estimatedCost: 50000,
 *   estimatedEffort: '3-6 months',
 *   riskLevel: 'high',
 *   mitigationStrategy: 'Update consent forms and train staff',
 *   implementationPlan: 'Phase 1: Form updates, Phase 2: Training, Phase 3: Rollout',
 *   assessedBy: 'user-uuid',
 *   assessedAt: new Date()
 * });
 */
export declare function assessRegulatoryImpact(sequelize: Sequelize, changeId: string, assessment: ImpactAssessment, transaction?: Transaction): Promise<Model>;
/**
 * Marks regulatory change as reviewed.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} changeId - Change ID
 * @param {string} reviewedBy - User ID of reviewer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated change
 * @throws {NotFoundException} If change not found
 *
 * @example
 * await markChangeAsReviewed(sequelize, 'change-uuid', 'user-uuid');
 */
export declare function markChangeAsReviewed(sequelize: Sequelize, changeId: string, reviewedBy: string, transaction?: Transaction): Promise<Model>;
/**
 * Retrieves high-impact unreviewed changes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ImpactLevel[]} [impactLevels] - Impact levels to filter
 * @returns {Promise<Model[]>} High-impact changes needing review
 *
 * @example
 * const criticalChanges = await getHighImpactChanges(
 *   sequelize,
 *   [ImpactLevel.CRITICAL, ImpactLevel.HIGH]
 * );
 */
export declare function getHighImpactChanges(sequelize: Sequelize, impactLevels?: ImpactLevel[]): Promise<Model[]>;
/**
 * Retrieves changes by framework and date range.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RegulatoryFramework} framework - Regulatory framework
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Model[]>} Matching changes
 *
 * @example
 * const hipaaChanges = await getChangesByFramework(
 *   sequelize,
 *   RegulatoryFramework.HIPAA,
 *   new Date('2025-01-01'),
 *   new Date('2025-12-31')
 * );
 */
export declare function getChangesByFramework(sequelize: Sequelize, framework: RegulatoryFramework, startDate: Date, endDate: Date): Promise<Model[]>;
/**
 * Creates jurisdiction-specific requirement.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {JurisdictionRequirement} reqData - Requirement data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created requirement
 * @throws {BadRequestException} If validation fails
 *
 * @example
 * const requirement = await createJurisdictionRequirement(sequelize, {
 *   jurisdiction: 'California',
 *   jurisdictionType: JurisdictionType.STATE,
 *   framework: RegulatoryFramework.CCPA,
 *   requirementCode: 'CCPA-1798.100',
 *   description: 'Consumer right to know',
 *   applicability: ['healthcare_providers', 'covered_entities'],
 *   effectiveDate: new Date('2020-01-01'),
 *   localAuthority: 'California Attorney General',
 *   isActive: true
 * });
 */
export declare function createJurisdictionRequirement(sequelize: Sequelize, reqData: JurisdictionRequirement, transaction?: Transaction): Promise<Model>;
/**
 * Retrieves jurisdiction-specific requirements for entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} jurisdiction - Jurisdiction name
 * @param {RegulatoryFramework} [framework] - Optional framework filter
 * @param {boolean} [activeOnly=true] - Active requirements only
 * @returns {Promise<Model[]>} Applicable requirements
 *
 * @example
 * const californiaReqs = await getJurisdictionRequirements(
 *   sequelize,
 *   'California',
 *   RegulatoryFramework.CCPA,
 *   true
 * );
 */
export declare function getJurisdictionRequirements(sequelize: Sequelize, jurisdiction: string, framework?: RegulatoryFramework, activeOnly?: boolean): Promise<Model[]>;
/**
 * Checks multi-jurisdiction compliance for entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} jurisdictions - Array of jurisdictions
 * @param {string} entityType - Entity type
 * @param {Record<string, any>} entityData - Entity data
 * @returns {Promise<Record<string, {compliant: boolean, issues: any[]}>>} Compliance status by jurisdiction
 *
 * @example
 * const multiStateCompliance = await checkMultiJurisdictionCompliance(
 *   sequelize,
 *   ['California', 'New York', 'Texas'],
 *   'healthcare_facility',
 *   { hasDataPrivacyPolicy: true, encryptionEnabled: true }
 * );
 */
export declare function checkMultiJurisdictionCompliance(sequelize: Sequelize, jurisdictions: string[], entityType: string, entityData: Record<string, any>): Promise<Record<string, {
    compliant: boolean;
    issues: any[];
}>>;
/**
 * Identifies jurisdiction conflicts and variations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} jurisdictions - Jurisdictions to compare
 * @param {RegulatoryFramework} framework - Framework to analyze
 * @returns {Promise<{conflicts: any[], variations: any[]}>} Conflicts and variations
 *
 * @example
 * const analysis = await analyzeJurisdictionConflicts(
 *   sequelize,
 *   ['California', 'Texas', 'Florida'],
 *   RegulatoryFramework.HIPAA
 * );
 */
export declare function analyzeJurisdictionConflicts(sequelize: Sequelize, jurisdictions: string[], framework: RegulatoryFramework): Promise<{
    conflicts: any[];
    variations: any[];
}>;
/**
 * Generates jurisdiction compliance matrix.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string[]} jurisdictions - Jurisdictions to include
 * @param {RegulatoryFramework[]} frameworks - Frameworks to analyze
 * @returns {Promise<Record<string, Record<string, number>>>} Compliance matrix
 *
 * @example
 * const matrix = await generateJurisdictionMatrix(
 *   sequelize,
 *   ['California', 'New York', 'Texas'],
 *   [RegulatoryFramework.HIPAA, RegulatoryFramework.CCPA]
 * );
 */
export declare function generateJurisdictionMatrix(sequelize: Sequelize, jurisdictions: string[], frameworks: RegulatoryFramework[]): Promise<Record<string, Record<string, number>>>;
/**
 * Performs comprehensive regulatory risk assessment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {RegulatoryFramework} framework - Framework to assess
 * @param {string} assessedBy - Assessor user ID
 * @returns {Promise<RiskAssessment>} Risk assessment results
 *
 * @example
 * const riskAssessment = await performRiskAssessment(
 *   sequelize,
 *   'facility',
 *   'facility-uuid',
 *   RegulatoryFramework.HIPAA,
 *   'user-uuid'
 * );
 * console.log(`Overall risk: ${riskAssessment.riskLevel} (${riskAssessment.overallRiskScore}/100)`);
 */
export declare function performRiskAssessment(sequelize: Sequelize, entityType: string, entityId: string, framework: RegulatoryFramework, assessedBy: string): Promise<RiskAssessment>;
/**
 * Calculates compliance trend over time.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {number} [months=12] - Months to analyze
 * @returns {Promise<{trend: 'improving' | 'stable' | 'declining', data: any[]}>} Trend analysis
 *
 * @example
 * const trend = await calculateComplianceTrend(
 *   sequelize,
 *   'facility',
 *   'facility-uuid',
 *   12
 * );
 * console.log(`Compliance trend: ${trend.trend}`);
 */
export declare function calculateComplianceTrend(sequelize: Sequelize, entityType: string, entityId: string, months?: number): Promise<{
    trend: 'improving' | 'stable' | 'declining';
    data: any[];
}>;
/**
 * Generates regulatory compliance report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ComplianceReportConfig} config - Report configuration
 * @returns {Promise<{report: any, generatedAt: Date}>} Generated report
 *
 * @example
 * const report = await generateComplianceReport(sequelize, {
 *   reportType: 'quarterly_compliance',
 *   framework: RegulatoryFramework.HIPAA,
 *   jurisdiction: 'United States',
 *   frequency: 'quarterly',
 *   includedMetrics: ['audit_count', 'compliance_rate', 'risk_level'],
 *   recipients: ['compliance@example.com'],
 *   format: 'pdf',
 *   automated: true
 * });
 */
export declare function generateComplianceReport(sequelize: Sequelize, config: ComplianceReportConfig): Promise<{
    report: any;
    generatedAt: Date;
}>;
/**
 * Identifies compliance gaps and generates recommendations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {RegulatoryFramework} framework - Framework to analyze
 * @returns {Promise<{gaps: any[], recommendations: string[], priority: string}>} Gap analysis
 *
 * @example
 * const analysis = await identifyComplianceGaps(
 *   sequelize,
 *   'facility',
 *   'facility-uuid',
 *   RegulatoryFramework.HIPAA
 * );
 * console.log(`Found ${analysis.gaps.length} compliance gaps`);
 * console.log('Recommendations:', analysis.recommendations);
 */
export declare function identifyComplianceGaps(sequelize: Sequelize, entityType: string, entityId: string, framework: RegulatoryFramework): Promise<{
    gaps: any[];
    recommendations: string[];
    priority: string;
}>;
/**
 * NestJS service for regulatory compliance management.
 *
 * @example
 * @Injectable()
 * export class ComplianceService extends RegulatoryComplianceService {
 *   constructor(@Inject('SEQUELIZE') sequelize: Sequelize) {
 *     super(sequelize);
 *   }
 * }
 */
export declare class RegulatoryComplianceService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    trackRegulation(data: RegulationMetadata, transaction?: Transaction): Promise<Model>;
    createComplianceRule(ruleData: ComplianceRule, transaction?: Transaction): Promise<Model>;
    evaluateCompliance(entityType: string, entityId: string, entityData: Record<string, any>): Promise<{
        passed: boolean;
        violations: any[];
        warnings: any[];
    }>;
    initiateAudit(auditData: ComplianceAudit, transaction?: Transaction): Promise<Model>;
    assessRisk(entityType: string, entityId: string, framework: RegulatoryFramework, assessedBy: string): Promise<RiskAssessment>;
}
declare const _default: {
    RegulatoryFramework: typeof RegulatoryFramework;
    ComplianceStatus: typeof ComplianceStatus;
    RegulationSeverity: typeof RegulationSeverity;
    JurisdictionType: typeof JurisdictionType;
    ImpactLevel: typeof ImpactLevel;
    RegulationMetadataSchema: any;
    ComplianceRuleSchema: any;
    ComplianceAuditSchema: any;
    RegulatoryChangeSchema: any;
    defineRegulationModel: typeof defineRegulationModel;
    defineComplianceRuleModel: typeof defineComplianceRuleModel;
    defineComplianceAuditModel: typeof defineComplianceAuditModel;
    defineRegulatoryChangeModel: typeof defineRegulatoryChangeModel;
    defineJurisdictionRequirementModel: typeof defineJurisdictionRequirementModel;
    trackRegulation: typeof trackRegulation;
    getRegulationsByFramework: typeof getRegulationsByFramework;
    updateRegulation: typeof updateRegulation;
    monitorRegulationReviews: typeof monitorRegulationReviews;
    archiveRegulation: typeof archiveRegulation;
    searchRegulations: typeof searchRegulations;
    linkRelatedRegulations: typeof linkRelatedRegulations;
    createComplianceRule: typeof createComplianceRule;
    evaluateComplianceRules: typeof evaluateComplianceRules;
    getRulesByRegulation: typeof getRulesByRegulation;
    updateRuleExecutionStats: typeof updateRuleExecutionStats;
    toggleComplianceRule: typeof toggleComplianceRule;
    bulkEvaluateCompliance: typeof bulkEvaluateCompliance;
    getHighPriorityRules: typeof getHighPriorityRules;
    initiateComplianceAudit: typeof initiateComplianceAudit;
    recordComplianceFindings: typeof recordComplianceFindings;
    completeComplianceAudit: typeof completeComplianceAudit;
    createRemediationPlan: typeof createRemediationPlan;
    updateRemediationStep: typeof updateRemediationStep;
    getAuditsByEntity: typeof getAuditsByEntity;
    getAuditStatistics: typeof getAuditStatistics;
    registerRegulatoryChange: typeof registerRegulatoryChange;
    detectPendingChanges: typeof detectPendingChanges;
    assessRegulatoryImpact: typeof assessRegulatoryImpact;
    markChangeAsReviewed: typeof markChangeAsReviewed;
    getHighImpactChanges: typeof getHighImpactChanges;
    getChangesByFramework: typeof getChangesByFramework;
    createJurisdictionRequirement: typeof createJurisdictionRequirement;
    getJurisdictionRequirements: typeof getJurisdictionRequirements;
    checkMultiJurisdictionCompliance: typeof checkMultiJurisdictionCompliance;
    analyzeJurisdictionConflicts: typeof analyzeJurisdictionConflicts;
    generateJurisdictionMatrix: typeof generateJurisdictionMatrix;
    performRiskAssessment: typeof performRiskAssessment;
    calculateComplianceTrend: typeof calculateComplianceTrend;
    generateComplianceReport: typeof generateComplianceReport;
    identifyComplianceGaps: typeof identifyComplianceGaps;
    RegulatoryComplianceService: typeof RegulatoryComplianceService;
};
export default _default;
//# sourceMappingURL=regulatory-compliance-kit.d.ts.map