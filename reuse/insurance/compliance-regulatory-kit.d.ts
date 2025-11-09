/**
 * LOC: INS-COMP-001
 * File: /reuse/insurance/compliance-regulatory-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - node-cron
 *   - nodemailer
 *   - axios
 *
 * DOWNSTREAM (imported by):
 *   - Insurance compliance controllers
 *   - Regulatory reporting services
 *   - License management modules
 *   - Audit trail services
 */
/**
 * File: /reuse/insurance/compliance-regulatory-kit.ts
 * Locator: WC-UTL-INSCOMP-001
 * Purpose: Insurance Compliance & Regulatory Kit - Comprehensive regulatory compliance utilities for NestJS
 *
 * Upstream: @nestjs/common, sequelize, node-cron, nodemailer, axios, bull (queue)
 * Downstream: Compliance controllers, regulatory services, license modules, audit services
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, Bull 4.x, Cron 3.x
 * Exports: 40 utility functions for state compliance, licensing, rate filing, NAIC reporting, market conduct, solvency monitoring
 *
 * LLM Context: Production-grade insurance regulatory compliance utilities for White Cross platform.
 * Provides state-by-state regulatory compliance tracking, producer licensing and appointment management,
 * form and rate filing workflows, NAIC reporting automation, market conduct examination support,
 * solvency ratio monitoring (RBC, risk-based capital), privacy regulation compliance (CCPA, GDPR),
 * data breach notification workflows, admitted/non-admitted market compliance, surplus lines tax tracking,
 * E&O insurance verification, and comprehensive audit trails for all regulatory activities.
 */
import { Sequelize } from 'sequelize';
/**
 * Compliance status types
 */
export type ComplianceStatus = 'compliant' | 'non_compliant' | 'pending_review' | 'under_investigation' | 'remediated';
/**
 * License status types
 */
export type LicenseStatus = 'active' | 'expired' | 'suspended' | 'revoked' | 'pending' | 'inactive';
/**
 * Filing status types
 */
export type FilingStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'withdrawn' | 'under_review';
/**
 * Regulatory authority types
 */
export type RegulatoryAuthority = 'state_doi' | 'naic' | 'federal' | 'international';
/**
 * Privacy regulation types
 */
export type PrivacyRegulation = 'hipaa' | 'ccpa' | 'gdpr' | 'glba' | 'state_privacy';
/**
 * Market type
 */
export type MarketType = 'admitted' | 'non_admitted' | 'surplus_lines' | 'unauthorized';
/**
 * Examination type
 */
export type ExaminationType = 'financial' | 'market_conduct' | 'targeted' | 'desk_review' | 'special';
/**
 * State regulatory compliance tracking
 */
export interface StateComplianceConfig {
    stateCode: string;
    regulationType: 'licensing' | 'rate_filing' | 'form_filing' | 'reporting' | 'market_conduct';
    requirements: ComplianceRequirement[];
    filingDeadlines: Date[];
    complianceOfficer: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    lastAuditDate?: Date;
    nextAuditDate?: Date;
}
/**
 * Compliance requirement
 */
export interface ComplianceRequirement {
    id: string;
    description: string;
    frequency: 'annual' | 'quarterly' | 'monthly' | 'event_driven' | 'continuous';
    dueDate?: Date;
    responsible: string[];
    documentRequired: boolean;
    automatedCheck: boolean;
    penaltyForNoncompliance?: string;
}
/**
 * Producer license configuration
 */
export interface ProducerLicenseConfig {
    producerId: string;
    stateCode: string;
    licenseType: 'resident' | 'non_resident';
    linesOfAuthority: string[];
    licenseNumber: string;
    issueDate: Date;
    expirationDate: Date;
    status: LicenseStatus;
    continuingEducationRequired: boolean;
    ceCreditsRequired?: number;
    ceCreditsCompleted?: number;
}
/**
 * Appointment tracking
 */
export interface AppointmentConfig {
    producerId: string;
    carrierId: string;
    stateCode: string;
    appointmentDate: Date;
    terminationDate?: Date;
    status: 'active' | 'terminated' | 'pending';
    linesOfBusiness: string[];
    commissionStructure?: Record<string, any>;
}
/**
 * Rate filing configuration
 */
export interface RateFilingConfig {
    stateCode: string;
    productLine: string;
    filingType: 'new' | 'revision' | 'withdrawal';
    effectiveDate: Date;
    proposedRateChange?: number;
    actuarialMemo: string;
    supportingDocuments: string[];
    priorApprovalRequired: boolean;
}
/**
 * Form filing configuration
 */
export interface FormFilingConfig {
    stateCode: string;
    formNumber: string;
    formName: string;
    formType: 'policy' | 'endorsement' | 'application' | 'disclosure';
    filingType: 'new' | 'revision' | 'withdrawal';
    effectiveDate: Date;
    supportingDocuments: string[];
}
/**
 * NAIC reporting configuration
 */
export interface NAICReportConfig {
    reportType: 'quarterly' | 'annual' | 'supplemental';
    reportingPeriod: string;
    dueDate: Date;
    schedules: string[];
    exhibits: string[];
    generalInterrogatoriesCompleted: boolean;
    signatureDate?: Date;
    certifiedBy?: string;
}
/**
 * Market conduct compliance
 */
export interface MarketConductConfig {
    complianceArea: 'sales_practices' | 'claims_handling' | 'underwriting' | 'rating' | 'advertising' | 'producer_oversight';
    standards: ComplianceStandard[];
    monitoringFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    lastReviewDate?: Date;
    findings?: MarketConductFinding[];
}
/**
 * Compliance standard
 */
export interface ComplianceStandard {
    id: string;
    description: string;
    regulatorySource: string;
    effectiveDate: Date;
    testProcedure: string;
    passingCriteria: string;
    automatedMonitoring: boolean;
}
/**
 * Market conduct finding
 */
export interface MarketConductFinding {
    id: string;
    area: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    identifiedDate: Date;
    remediationPlan?: string;
    remediationDeadline?: Date;
    status: ComplianceStatus;
}
/**
 * RBC (Risk-Based Capital) monitoring
 */
export interface RBCMonitoringConfig {
    reportingPeriod: string;
    totalAdjustedCapital: number;
    authorizedControlLevel: number;
    rbcRatio: number;
    actionLevel: 'no_action' | 'company_action' | 'regulatory_action' | 'authorized_control' | 'mandatory_control';
    trendAnalysis?: RBCTrend[];
    lastCalculationDate: Date;
}
/**
 * RBC trend analysis
 */
export interface RBCTrend {
    period: string;
    rbcRatio: number;
    changePercent: number;
    notes?: string;
}
/**
 * Privacy compliance configuration
 */
export interface PrivacyComplianceConfig {
    regulation: PrivacyRegulation;
    applicableJurisdictions: string[];
    dataInventoryComplete: boolean;
    privacyNoticeUpdated: boolean;
    lastPrivacyAudit?: Date;
    dataProcessingAgreements: string[];
    securityMeasures: string[];
    incidentResponsePlan: string;
}
/**
 * Data breach notification
 */
export interface DataBreachNotificationConfig {
    breachId: string;
    discoveryDate: Date;
    breachType: 'unauthorized_access' | 'unauthorized_disclosure' | 'data_loss' | 'ransomware' | 'other';
    affectedRecords: number;
    affectedDataTypes: string[];
    jurisdictions: string[];
    notificationDeadlines: Record<string, Date>;
    regulatorsToNotify: string[];
    individualNotificationRequired: boolean;
}
/**
 * Surplus lines compliance
 */
export interface SurplusLinesConfig {
    stateCode: string;
    policyNumber: string;
    carrierName: string;
    carrierEligible: boolean;
    diligentSearchConducted: boolean;
    stampingFeeRate: number;
    surplusTaxRate: number;
    exportList: string[];
    filingDeadline: Date;
}
/**
 * E&O insurance tracking
 */
export interface EOInsuranceConfig {
    carrierId?: string;
    producerId?: string;
    policyNumber: string;
    carrier: string;
    effectiveDate: Date;
    expirationDate: Date;
    coverageAmount: number;
    deductible: number;
    aggregateLimit: number;
    retroactiveDate?: Date;
    certificateOnFile: boolean;
}
/**
 * Regulatory examination
 */
export interface RegulatoryExaminationConfig {
    examinationType: ExaminationType;
    state: string;
    examPeriodStart: Date;
    examPeriodEnd: Date;
    examiners: string[];
    scope: string[];
    status: 'scheduled' | 'in_progress' | 'report_pending' | 'completed';
    findings?: ExaminationFinding[];
    responseDeadline?: Date;
}
/**
 * Examination finding
 */
export interface ExaminationFinding {
    id: string;
    category: string;
    severity: 'observation' | 'recommendation' | 'violation' | 'critical';
    description: string;
    statuteViolated?: string;
    correctiveAction: string;
    completionDeadline: Date;
    status: 'open' | 'in_progress' | 'completed' | 'disputed';
}
/**
 * Regulatory change tracking
 */
export interface RegulatoryChangeConfig {
    changeId: string;
    jurisdiction: string;
    regulationType: string;
    description: string;
    effectiveDate: Date;
    impactAssessmentComplete: boolean;
    affectedBusinessLines: string[];
    impactLevel: 'low' | 'medium' | 'high' | 'critical';
    actionItems: RegulatoryActionItem[];
}
/**
 * Regulatory action item
 */
export interface RegulatoryActionItem {
    id: string;
    description: string;
    responsible: string;
    dueDate: Date;
    status: 'pending' | 'in_progress' | 'completed';
    completionDate?: Date;
}
/**
 * StateCompliance model attributes
 */
export interface StateComplianceAttributes {
    id: string;
    stateCode: string;
    regulationType: string;
    status: ComplianceStatus;
    requirements: ComplianceRequirement[];
    complianceOfficer: string;
    riskLevel: string;
    lastAuditDate?: Date;
    nextAuditDate?: Date;
    findings?: Record<string, any>;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * ProducerLicense model attributes
 */
export interface ProducerLicenseAttributes {
    id: string;
    producerId: string;
    stateCode: string;
    licenseType: string;
    linesOfAuthority: string[];
    licenseNumber: string;
    issueDate: Date;
    expirationDate: Date;
    status: LicenseStatus;
    continuingEducationRequired: boolean;
    ceCreditsRequired?: number;
    ceCreditsCompleted?: number;
    renewalNotificationSent: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * RateFiling model attributes
 */
export interface RateFilingAttributes {
    id: string;
    stateCode: string;
    productLine: string;
    filingType: string;
    filingNumber?: string;
    status: FilingStatus;
    effectiveDate: Date;
    proposedRateChange?: number;
    actuarialMemo: string;
    supportingDocuments: string[];
    priorApprovalRequired: boolean;
    submissionDate?: Date;
    approvalDate?: Date;
    rejectionReason?: string;
    submittedBy: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates StateCompliance model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {any} StateCompliance model
 *
 * @example
 * ```typescript
 * const StateComplianceModel = createStateComplianceModel(sequelize);
 * const compliance = await StateComplianceModel.create({
 *   stateCode: 'CA',
 *   regulationType: 'rate_filing',
 *   status: 'compliant',
 *   complianceOfficer: 'officer-uuid',
 *   riskLevel: 'medium'
 * });
 * ```
 */
export declare const createStateComplianceModel: (sequelize: Sequelize) => any;
/**
 * Creates ProducerLicense model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {any} ProducerLicense model
 *
 * @example
 * ```typescript
 * const LicenseModel = createProducerLicenseModel(sequelize);
 * const license = await LicenseModel.create({
 *   producerId: 'producer-uuid',
 *   stateCode: 'NY',
 *   licenseType: 'resident',
 *   linesOfAuthority: ['life', 'health', 'accident'],
 *   licenseNumber: 'NY-12345678',
 *   issueDate: new Date('2023-01-01'),
 *   expirationDate: new Date('2025-12-31'),
 *   status: 'active'
 * });
 * ```
 */
export declare const createProducerLicenseModel: (sequelize: Sequelize) => any;
/**
 * Creates RateFiling model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {any} RateFiling model
 *
 * @example
 * ```typescript
 * const RateFilingModel = createRateFilingModel(sequelize);
 * const filing = await RateFilingModel.create({
 *   stateCode: 'TX',
 *   productLine: 'auto',
 *   filingType: 'revision',
 *   status: 'draft',
 *   effectiveDate: new Date('2025-01-01'),
 *   proposedRateChange: 5.5,
 *   submittedBy: 'user-uuid'
 * });
 * ```
 */
export declare const createRateFilingModel: (sequelize: Sequelize) => any;
/**
 * 1. Tracks state regulatory compliance status.
 *
 * @param {StateComplianceConfig} config - State compliance configuration
 * @returns {Promise<Partial<StateComplianceAttributes>>} Compliance record
 *
 * @example
 * ```typescript
 * const compliance = await trackStateCompliance({
 *   stateCode: 'CA',
 *   regulationType: 'rate_filing',
 *   requirements: [...],
 *   complianceOfficer: 'user-123',
 *   riskLevel: 'high'
 * });
 * ```
 */
export declare const trackStateCompliance: (config: StateComplianceConfig) => Promise<Partial<StateComplianceAttributes>>;
/**
 * 2. Updates compliance status for a state.
 *
 * @param {string} complianceId - Compliance record ID
 * @param {ComplianceStatus} status - New compliance status
 * @param {string} [notes] - Update notes
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateComplianceStatus('compliance-123', 'compliant', 'All requirements met for Q4 2024');
 * ```
 */
export declare const updateComplianceStatus: (complianceId: string, status: ComplianceStatus, notes?: string) => Promise<void>;
/**
 * 3. Generates compliance risk report by state.
 *
 * @param {string} stateCode - State code
 * @returns {Promise<Record<string, any>>} Risk report
 *
 * @example
 * ```typescript
 * const report = await generateStateRiskReport('CA');
 * console.log('High risk areas:', report.highRiskAreas);
 * ```
 */
export declare const generateStateRiskReport: (stateCode: string) => Promise<Record<string, any>>;
/**
 * 4. Schedules compliance audit.
 *
 * @param {string} complianceId - Compliance record ID
 * @param {Date} auditDate - Scheduled audit date
 * @param {string[]} auditors - Auditor user IDs
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await scheduleComplianceAudit('compliance-123', new Date('2025-03-15'), ['auditor-1', 'auditor-2']);
 * ```
 */
export declare const scheduleComplianceAudit: (complianceId: string, auditDate: Date, auditors: string[]) => Promise<void>;
/**
 * 5. Creates producer license record.
 *
 * @param {ProducerLicenseConfig} config - License configuration
 * @returns {Promise<Partial<ProducerLicenseAttributes>>} License record
 *
 * @example
 * ```typescript
 * const license = await createProducerLicense({
 *   producerId: 'producer-123',
 *   stateCode: 'NY',
 *   licenseType: 'resident',
 *   linesOfAuthority: ['life', 'health'],
 *   licenseNumber: 'NY-12345678',
 *   issueDate: new Date(),
 *   expirationDate: new Date('2026-12-31'),
 *   status: 'active',
 *   continuingEducationRequired: true
 * });
 * ```
 */
export declare const createProducerLicense: (config: ProducerLicenseConfig) => Promise<Partial<ProducerLicenseAttributes>>;
/**
 * 6. Verifies producer licensing status.
 *
 * @param {string} producerId - Producer ID
 * @param {string} stateCode - State code
 * @param {string[]} requiredLines - Required lines of authority
 * @returns {Promise<{valid: boolean; issues: string[]}>} Verification result
 *
 * @example
 * ```typescript
 * const verification = await verifyProducerLicense('producer-123', 'TX', ['life', 'health']);
 * if (!verification.valid) {
 *   console.log('License issues:', verification.issues);
 * }
 * ```
 */
export declare const verifyProducerLicense: (producerId: string, stateCode: string, requiredLines: string[]) => Promise<{
    valid: boolean;
    issues: string[];
}>;
/**
 * 7. Tracks license renewal deadline.
 *
 * @param {string} licenseId - License ID
 * @param {number} daysBeforeExpiration - Days before expiration to notify
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await trackLicenseRenewal('license-123', 60);
 * ```
 */
export declare const trackLicenseRenewal: (licenseId: string, daysBeforeExpiration: number) => Promise<void>;
/**
 * 8. Updates continuing education credits.
 *
 * @param {string} licenseId - License ID
 * @param {number} creditsCompleted - Credits completed
 * @param {string} courseId - Course ID
 * @param {Date} completionDate - Completion date
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateCECredits('license-123', 3, 'course-456', new Date());
 * ```
 */
export declare const updateCECredits: (licenseId: string, creditsCompleted: number, courseId: string, completionDate: Date) => Promise<void>;
/**
 * 9. Creates carrier appointment record.
 *
 * @param {AppointmentConfig} config - Appointment configuration
 * @returns {Promise<Record<string, any>>} Appointment record
 *
 * @example
 * ```typescript
 * const appointment = await createCarrierAppointment({
 *   producerId: 'producer-123',
 *   carrierId: 'carrier-456',
 *   stateCode: 'FL',
 *   appointmentDate: new Date(),
 *   status: 'active',
 *   linesOfBusiness: ['auto', 'home']
 * });
 * ```
 */
export declare const createCarrierAppointment: (config: AppointmentConfig) => Promise<Record<string, any>>;
/**
 * 10. Terminates producer appointment.
 *
 * @param {string} appointmentId - Appointment ID
 * @param {Date} terminationDate - Termination date
 * @param {string} reason - Termination reason
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await terminateAppointment('appointment-123', new Date(), 'Producer resignation');
 * ```
 */
export declare const terminateAppointment: (appointmentId: string, terminationDate: Date, reason: string) => Promise<void>;
/**
 * 11. Creates rate filing submission.
 *
 * @param {RateFilingConfig} config - Rate filing configuration
 * @param {string} userId - User creating filing
 * @returns {Promise<Partial<RateFilingAttributes>>} Filing record
 *
 * @example
 * ```typescript
 * const filing = await createRateFiling({
 *   stateCode: 'CA',
 *   productLine: 'homeowners',
 *   filingType: 'revision',
 *   effectiveDate: new Date('2025-07-01'),
 *   proposedRateChange: 8.5,
 *   actuarialMemo: 'Rate increase justified by...',
 *   supportingDocuments: ['doc-1', 'doc-2'],
 *   priorApprovalRequired: true
 * }, 'user-123');
 * ```
 */
export declare const createRateFiling: (config: RateFilingConfig, userId: string) => Promise<Partial<RateFilingAttributes>>;
/**
 * 12. Submits rate filing to state DOI.
 *
 * @param {string} filingId - Filing ID
 * @param {string} userId - User submitting filing
 * @returns {Promise<string>} Filing number
 *
 * @example
 * ```typescript
 * const filingNumber = await submitRateFiling('filing-123', 'user-456');
 * console.log('Filing number:', filingNumber);
 * ```
 */
export declare const submitRateFiling: (filingId: string, userId: string) => Promise<string>;
/**
 * 13. Tracks rate filing approval status.
 *
 * @param {string} filingId - Filing ID
 * @returns {Promise<FilingStatus>} Current filing status
 *
 * @example
 * ```typescript
 * const status = await trackFilingStatus('filing-123');
 * console.log('Filing status:', status);
 * ```
 */
export declare const trackFilingStatus: (filingId: string) => Promise<FilingStatus>;
/**
 * 14. Creates form filing submission.
 *
 * @param {FormFilingConfig} config - Form filing configuration
 * @param {string} userId - User creating filing
 * @returns {Promise<Record<string, any>>} Form filing record
 *
 * @example
 * ```typescript
 * const formFiling = await createFormFiling({
 *   stateCode: 'TX',
 *   formNumber: 'HO-001',
 *   formName: 'Homeowners Policy Form',
 *   formType: 'policy',
 *   filingType: 'revision',
 *   effectiveDate: new Date('2025-06-01'),
 *   supportingDocuments: ['doc-1']
 * }, 'user-123');
 * ```
 */
export declare const createFormFiling: (config: FormFilingConfig, userId: string) => Promise<Record<string, any>>;
/**
 * 15. Validates filing documents for completeness.
 *
 * @param {string} filingId - Filing ID
 * @param {string} filingType - Filing type (rate or form)
 * @returns {Promise<{valid: boolean; missingItems: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateFilingDocuments('filing-123', 'rate');
 * if (!validation.valid) {
 *   console.log('Missing:', validation.missingItems);
 * }
 * ```
 */
export declare const validateFilingDocuments: (filingId: string, filingType: string) => Promise<{
    valid: boolean;
    missingItems: string[];
}>;
/**
 * 16. Generates NAIC quarterly statement.
 *
 * @param {NAICReportConfig} config - NAIC report configuration
 * @returns {Promise<Record<string, any>>} NAIC report data
 *
 * @example
 * ```typescript
 * const report = await generateNAICQuarterlyStatement({
 *   reportType: 'quarterly',
 *   reportingPeriod: '2024-Q4',
 *   dueDate: new Date('2025-05-15'),
 *   schedules: ['A', 'B', 'D', 'P'],
 *   exhibits: ['1', '2'],
 *   generalInterrogatoriesCompleted: true
 * });
 * ```
 */
export declare const generateNAICQuarterlyStatement: (config: NAICReportConfig) => Promise<Record<string, any>>;
/**
 * 17. Submits annual statement to state DOI.
 *
 * @param {string} stateCode - State code
 * @param {string} reportId - Report ID
 * @param {string} certifiedBy - Certifying officer user ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await submitAnnualStatement('NY', 'report-123', 'officer-456');
 * ```
 */
export declare const submitAnnualStatement: (stateCode: string, reportId: string, certifiedBy: string) => Promise<void>;
/**
 * 18. Tracks financial reporting deadlines.
 *
 * @param {string} stateCode - State code
 * @param {number} year - Reporting year
 * @returns {Promise<Record<string, any>[]>} List of deadlines
 *
 * @example
 * ```typescript
 * const deadlines = await trackFinancialReportingDeadlines('CA', 2025);
 * deadlines.forEach(d => console.log(d.reportType, d.dueDate));
 * ```
 */
export declare const trackFinancialReportingDeadlines: (stateCode: string, year: number) => Promise<Record<string, any>[]>;
/**
 * 19. Generates Schedule P claims development data.
 *
 * @param {string} productLine - Product line
 * @param {number} years - Number of years to include
 * @returns {Promise<Record<string, any>>} Schedule P data
 *
 * @example
 * ```typescript
 * const scheduleP = await generateSchedulePData('auto', 10);
 * console.log('Loss development factors:', scheduleP.ldf);
 * ```
 */
export declare const generateSchedulePData: (productLine: string, years: number) => Promise<Record<string, any>>;
/**
 * 20. Validates NAIC code mapping.
 *
 * @param {string} internalCode - Internal product/transaction code
 * @returns {Promise<{naicCode: string; description: string}>} NAIC code mapping
 *
 * @example
 * ```typescript
 * const mapping = await validateNAICCodeMapping('PROD-AUTO-001');
 * console.log('NAIC code:', mapping.naicCode);
 * ```
 */
export declare const validateNAICCodeMapping: (internalCode: string) => Promise<{
    naicCode: string;
    description: string;
}>;
/**
 * 21. Configures market conduct monitoring.
 *
 * @param {MarketConductConfig} config - Market conduct configuration
 * @returns {Promise<Record<string, any>>} Monitoring configuration
 *
 * @example
 * ```typescript
 * const monitoring = await configureMarketConductMonitoring({
 *   complianceArea: 'claims_handling',
 *   standards: [...],
 *   monitoringFrequency: 'daily',
 *   lastReviewDate: new Date()
 * });
 * ```
 */
export declare const configureMarketConductMonitoring: (config: MarketConductConfig) => Promise<Record<string, any>>;
/**
 * 22. Records market conduct finding.
 *
 * @param {string} complianceArea - Compliance area
 * @param {MarketConductFinding} finding - Finding details
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await recordMarketConductFinding('claims_handling', {
 *   id: 'finding-123',
 *   area: 'claim_payment_timeliness',
 *   severity: 'medium',
 *   description: '15% of claims exceeded payment deadline',
 *   identifiedDate: new Date(),
 *   status: 'non_compliant'
 * });
 * ```
 */
export declare const recordMarketConductFinding: (complianceArea: string, finding: MarketConductFinding) => Promise<void>;
/**
 * 23. Generates market conduct report.
 *
 * @param {string} complianceArea - Compliance area
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<Record<string, any>>} Market conduct report
 *
 * @example
 * ```typescript
 * const report = await generateMarketConductReport('sales_practices', new Date('2024-01-01'), new Date('2024-12-31'));
 * console.log('Compliance rate:', report.complianceRate);
 * ```
 */
export declare const generateMarketConductReport: (complianceArea: string, startDate: Date, endDate: Date) => Promise<Record<string, any>>;
/**
 * 24. Monitors unfair claims practices.
 *
 * @param {string[]} claimIds - Claim IDs to analyze
 * @returns {Promise<{violations: string[]; riskScore: number}>} Analysis result
 *
 * @example
 * ```typescript
 * const analysis = await monitorUnfairClaimsPractices(['claim-1', 'claim-2', 'claim-3']);
 * if (analysis.violations.length > 0) {
 *   console.log('Potential violations:', analysis.violations);
 * }
 * ```
 */
export declare const monitorUnfairClaimsPractices: (claimIds: string[]) => Promise<{
    violations: string[];
    riskScore: number;
}>;
/**
 * 25. Audits sales practice compliance.
 *
 * @param {string} producerId - Producer ID
 * @param {Date} startDate - Audit start date
 * @param {Date} endDate - Audit end date
 * @returns {Promise<Record<string, any>>} Sales audit results
 *
 * @example
 * ```typescript
 * const audit = await auditSalesPractices('producer-123', new Date('2024-01-01'), new Date('2024-12-31'));
 * console.log('Compliance score:', audit.complianceScore);
 * ```
 */
export declare const auditSalesPractices: (producerId: string, startDate: Date, endDate: Date) => Promise<Record<string, any>>;
/**
 * 26. Calculates RBC ratio.
 *
 * @param {number} totalAdjustedCapital - Total adjusted capital
 * @param {number} authorizedControlLevel - Authorized control level RBC
 * @returns {Promise<RBCMonitoringConfig>} RBC monitoring data
 *
 * @example
 * ```typescript
 * const rbc = await calculateRBCRatio(50000000, 10000000);
 * console.log('RBC Ratio:', rbc.rbcRatio, 'Action Level:', rbc.actionLevel);
 * ```
 */
export declare const calculateRBCRatio: (totalAdjustedCapital: number, authorizedControlLevel: number) => Promise<Partial<RBCMonitoringConfig>>;
/**
 * 27. Monitors capital adequacy thresholds.
 *
 * @param {string} carrierId - Carrier ID
 * @returns {Promise<{adequate: boolean; alerts: string[]}>} Capital adequacy status
 *
 * @example
 * ```typescript
 * const status = await monitorCapitalAdequacy('carrier-123');
 * if (!status.adequate) {
 *   console.log('Capital alerts:', status.alerts);
 * }
 * ```
 */
export declare const monitorCapitalAdequacy: (carrierId: string) => Promise<{
    adequate: boolean;
    alerts: string[];
}>;
/**
 * 28. Tracks RBC trends over time.
 *
 * @param {string} carrierId - Carrier ID
 * @param {number} periods - Number of periods to analyze
 * @returns {Promise<RBCTrend[]>} RBC trend data
 *
 * @example
 * ```typescript
 * const trends = await trackRBCTrends('carrier-123', 8);
 * trends.forEach(t => console.log(t.period, t.rbcRatio, t.changePercent));
 * ```
 */
export declare const trackRBCTrends: (carrierId: string, periods: number) => Promise<RBCTrend[]>;
/**
 * 29. Generates solvency alert report.
 *
 * @param {string} carrierId - Carrier ID
 * @param {number} threshold - Alert threshold ratio
 * @returns {Promise<Record<string, any>>} Alert report
 *
 * @example
 * ```typescript
 * const report = await generateSolvencyAlertReport('carrier-123', 200);
 * if (report.alertTriggered) {
 *   console.log('Solvency concern:', report.reason);
 * }
 * ```
 */
export declare const generateSolvencyAlertReport: (carrierId: string, threshold: number) => Promise<Record<string, any>>;
/**
 * 30. Validates financial strength rating.
 *
 * @param {string} carrierId - Carrier ID
 * @param {string} ratingAgency - Rating agency (AM Best, S&P, Moody's)
 * @returns {Promise<{rating: string; outlook: string; lastUpdated: Date}>} Rating information
 *
 * @example
 * ```typescript
 * const rating = await validateFinancialStrengthRating('carrier-123', 'AM Best');
 * console.log('Rating:', rating.rating, 'Outlook:', rating.outlook);
 * ```
 */
export declare const validateFinancialStrengthRating: (carrierId: string, ratingAgency: string) => Promise<{
    rating: string;
    outlook: string;
    lastUpdated: Date;
}>;
/**
 * 31. Configures privacy compliance monitoring.
 *
 * @param {PrivacyComplianceConfig} config - Privacy compliance configuration
 * @returns {Promise<Record<string, any>>} Privacy compliance setup
 *
 * @example
 * ```typescript
 * const privacy = await configurePrivacyCompliance({
 *   regulation: 'ccpa',
 *   applicableJurisdictions: ['CA', 'VA', 'CO'],
 *   dataInventoryComplete: true,
 *   privacyNoticeUpdated: true,
 *   dataProcessingAgreements: ['dpa-1', 'dpa-2'],
 *   securityMeasures: ['encryption', 'access_control'],
 *   incidentResponsePlan: 'plan-123'
 * });
 * ```
 */
export declare const configurePrivacyCompliance: (config: PrivacyComplianceConfig) => Promise<Record<string, any>>;
/**
 * 32. Processes data subject access request.
 *
 * @param {string} requestId - Request ID
 * @param {string} subjectId - Data subject ID
 * @param {string} requestType - Request type (access, deletion, correction)
 * @returns {Promise<Record<string, any>>} Request processing result
 *
 * @example
 * ```typescript
 * const result = await processDataSubjectRequest('request-123', 'subject-456', 'access');
 * console.log('Data package:', result.dataPackage);
 * ```
 */
export declare const processDataSubjectRequest: (requestId: string, subjectId: string, requestType: string) => Promise<Record<string, any>>;
/**
 * 33. Validates consent management.
 *
 * @param {string} userId - User ID
 * @param {string} consentType - Consent type
 * @returns {Promise<{consentGiven: boolean; consentDate?: Date; canProcess: boolean}>} Consent status
 *
 * @example
 * ```typescript
 * const consent = await validateConsentManagement('user-123', 'marketing');
 * if (!consent.canProcess) {
 *   console.log('Cannot process without consent');
 * }
 * ```
 */
export declare const validateConsentManagement: (userId: string, consentType: string) => Promise<{
    consentGiven: boolean;
    consentDate?: Date;
    canProcess: boolean;
}>;
/**
 * 34. Initiates data breach notification workflow.
 *
 * @param {DataBreachNotificationConfig} config - Breach notification configuration
 * @returns {Promise<Record<string, any>>} Notification workflow
 *
 * @example
 * ```typescript
 * const workflow = await initiateBreachNotification({
 *   breachId: 'breach-123',
 *   discoveryDate: new Date(),
 *   breachType: 'unauthorized_access',
 *   affectedRecords: 5000,
 *   affectedDataTypes: ['SSN', 'DOB', 'address'],
 *   jurisdictions: ['CA', 'NY', 'TX'],
 *   notificationDeadlines: { CA: new Date('2025-01-15') },
 *   regulatorsToNotify: ['CA DOI', 'NY DFS'],
 *   individualNotificationRequired: true
 * });
 * ```
 */
export declare const initiateBreachNotification: (config: DataBreachNotificationConfig) => Promise<Record<string, any>>;
/**
 * 35. Generates privacy impact assessment.
 *
 * @param {string} processId - Data processing activity ID
 * @param {string[]} dataTypes - Types of data processed
 * @returns {Promise<Record<string, any>>} Privacy impact assessment
 *
 * @example
 * ```typescript
 * const pia = await generatePrivacyImpactAssessment('process-123', ['PII', 'health', 'financial']);
 * console.log('Risk level:', pia.riskLevel);
 * ```
 */
export declare const generatePrivacyImpactAssessment: (processId: string, dataTypes: string[]) => Promise<Record<string, any>>;
/**
 * 36. Validates surplus lines eligibility.
 *
 * @param {SurplusLinesConfig} config - Surplus lines configuration
 * @returns {Promise<{eligible: boolean; issues: string[]}>} Eligibility validation
 *
 * @example
 * ```typescript
 * const eligibility = await validateSurplusLinesEligibility({
 *   stateCode: 'FL',
 *   policyNumber: 'SL-12345',
 *   carrierName: 'Excess Carrier Inc',
 *   carrierEligible: true,
 *   diligentSearchConducted: true,
 *   stampingFeeRate: 0.003,
 *   surplusTaxRate: 0.05,
 *   exportList: ['doc-1', 'doc-2'],
 *   filingDeadline: new Date('2025-02-01')
 * });
 * ```
 */
export declare const validateSurplusLinesEligibility: (config: SurplusLinesConfig) => Promise<{
    eligible: boolean;
    issues: string[];
}>;
/**
 * 37. Calculates surplus lines tax.
 *
 * @param {number} premium - Policy premium
 * @param {string} stateCode - State code
 * @returns {Promise<{surplusTax: number; stampingFee: number; total: number}>} Tax calculation
 *
 * @example
 * ```typescript
 * const tax = await calculateSurplusLinesTax(10000, 'CA');
 * console.log('Total tax due:', tax.total);
 * ```
 */
export declare const calculateSurplusLinesTax: (premium: number, stateCode: string) => Promise<{
    surplusTax: number;
    stampingFee: number;
    total: number;
}>;
/**
 * 38. Files surplus lines affidavit.
 *
 * @param {string} policyId - Policy ID
 * @param {string} stateCode - State code
 * @param {string} brokerId - Surplus lines broker ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await fileSurplusLinesAffidavit('policy-123', 'TX', 'broker-456');
 * ```
 */
export declare const fileSurplusLinesAffidavit: (policyId: string, stateCode: string, brokerId: string) => Promise<void>;
/**
 * 39. Tracks E&O insurance compliance.
 *
 * @param {EOInsuranceConfig} config - E&O insurance configuration
 * @returns {Promise<{compliant: boolean; expirationWarning: boolean}>} E&O compliance status
 *
 * @example
 * ```typescript
 * const eoStatus = await trackEOInsurance({
 *   producerId: 'producer-123',
 *   policyNumber: 'EO-98765',
 *   carrier: 'Professional Liability Insurance Co',
 *   effectiveDate: new Date('2024-01-01'),
 *   expirationDate: new Date('2025-12-31'),
 *   coverageAmount: 1000000,
 *   deductible: 10000,
 *   aggregateLimit: 2000000,
 *   certificateOnFile: true
 * });
 * ```
 */
export declare const trackEOInsurance: (config: EOInsuranceConfig) => Promise<{
    compliant: boolean;
    expirationWarning: boolean;
}>;
/**
 * 40. Manages regulatory examination process.
 *
 * @param {RegulatoryExaminationConfig} config - Examination configuration
 * @returns {Promise<Record<string, any>>} Examination management record
 *
 * @example
 * ```typescript
 * const exam = await manageRegulatoryExamination({
 *   examinationType: 'market_conduct',
 *   state: 'NY',
 *   examPeriodStart: new Date('2020-01-01'),
 *   examPeriodEnd: new Date('2024-12-31'),
 *   examiners: ['examiner-1', 'examiner-2'],
 *   scope: ['claims_handling', 'underwriting', 'rating'],
 *   status: 'scheduled'
 * });
 * ```
 */
export declare const manageRegulatoryExamination: (config: RegulatoryExaminationConfig) => Promise<Record<string, any>>;
declare const _default: {
    trackStateCompliance: (config: StateComplianceConfig) => Promise<Partial<StateComplianceAttributes>>;
    updateComplianceStatus: (complianceId: string, status: ComplianceStatus, notes?: string) => Promise<void>;
    generateStateRiskReport: (stateCode: string) => Promise<Record<string, any>>;
    scheduleComplianceAudit: (complianceId: string, auditDate: Date, auditors: string[]) => Promise<void>;
    createProducerLicense: (config: ProducerLicenseConfig) => Promise<Partial<ProducerLicenseAttributes>>;
    verifyProducerLicense: (producerId: string, stateCode: string, requiredLines: string[]) => Promise<{
        valid: boolean;
        issues: string[];
    }>;
    trackLicenseRenewal: (licenseId: string, daysBeforeExpiration: number) => Promise<void>;
    updateCECredits: (licenseId: string, creditsCompleted: number, courseId: string, completionDate: Date) => Promise<void>;
    createCarrierAppointment: (config: AppointmentConfig) => Promise<Record<string, any>>;
    terminateAppointment: (appointmentId: string, terminationDate: Date, reason: string) => Promise<void>;
    createRateFiling: (config: RateFilingConfig, userId: string) => Promise<Partial<RateFilingAttributes>>;
    submitRateFiling: (filingId: string, userId: string) => Promise<string>;
    trackFilingStatus: (filingId: string) => Promise<FilingStatus>;
    createFormFiling: (config: FormFilingConfig, userId: string) => Promise<Record<string, any>>;
    validateFilingDocuments: (filingId: string, filingType: string) => Promise<{
        valid: boolean;
        missingItems: string[];
    }>;
    generateNAICQuarterlyStatement: (config: NAICReportConfig) => Promise<Record<string, any>>;
    submitAnnualStatement: (stateCode: string, reportId: string, certifiedBy: string) => Promise<void>;
    trackFinancialReportingDeadlines: (stateCode: string, year: number) => Promise<Record<string, any>[]>;
    generateSchedulePData: (productLine: string, years: number) => Promise<Record<string, any>>;
    validateNAICCodeMapping: (internalCode: string) => Promise<{
        naicCode: string;
        description: string;
    }>;
    configureMarketConductMonitoring: (config: MarketConductConfig) => Promise<Record<string, any>>;
    recordMarketConductFinding: (complianceArea: string, finding: MarketConductFinding) => Promise<void>;
    generateMarketConductReport: (complianceArea: string, startDate: Date, endDate: Date) => Promise<Record<string, any>>;
    monitorUnfairClaimsPractices: (claimIds: string[]) => Promise<{
        violations: string[];
        riskScore: number;
    }>;
    auditSalesPractices: (producerId: string, startDate: Date, endDate: Date) => Promise<Record<string, any>>;
    calculateRBCRatio: (totalAdjustedCapital: number, authorizedControlLevel: number) => Promise<Partial<RBCMonitoringConfig>>;
    monitorCapitalAdequacy: (carrierId: string) => Promise<{
        adequate: boolean;
        alerts: string[];
    }>;
    trackRBCTrends: (carrierId: string, periods: number) => Promise<RBCTrend[]>;
    generateSolvencyAlertReport: (carrierId: string, threshold: number) => Promise<Record<string, any>>;
    validateFinancialStrengthRating: (carrierId: string, ratingAgency: string) => Promise<{
        rating: string;
        outlook: string;
        lastUpdated: Date;
    }>;
    configurePrivacyCompliance: (config: PrivacyComplianceConfig) => Promise<Record<string, any>>;
    processDataSubjectRequest: (requestId: string, subjectId: string, requestType: string) => Promise<Record<string, any>>;
    validateConsentManagement: (userId: string, consentType: string) => Promise<{
        consentGiven: boolean;
        consentDate?: Date;
        canProcess: boolean;
    }>;
    initiateBreachNotification: (config: DataBreachNotificationConfig) => Promise<Record<string, any>>;
    generatePrivacyImpactAssessment: (processId: string, dataTypes: string[]) => Promise<Record<string, any>>;
    validateSurplusLinesEligibility: (config: SurplusLinesConfig) => Promise<{
        eligible: boolean;
        issues: string[];
    }>;
    calculateSurplusLinesTax: (premium: number, stateCode: string) => Promise<{
        surplusTax: number;
        stampingFee: number;
        total: number;
    }>;
    fileSurplusLinesAffidavit: (policyId: string, stateCode: string, brokerId: string) => Promise<void>;
    trackEOInsurance: (config: EOInsuranceConfig) => Promise<{
        compliant: boolean;
        expirationWarning: boolean;
    }>;
    manageRegulatoryExamination: (config: RegulatoryExaminationConfig) => Promise<Record<string, any>>;
    createStateComplianceModel: (sequelize: Sequelize) => any;
    createProducerLicenseModel: (sequelize: Sequelize) => any;
    createRateFilingModel: (sequelize: Sequelize) => any;
};
export default _default;
//# sourceMappingURL=compliance-regulatory-kit.d.ts.map