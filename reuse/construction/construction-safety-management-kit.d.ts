/**
 * LOC: SAFEMGMT1234567
 * File: /reuse/construction/construction-safety-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend construction services
 *   - Safety management controllers
 *   - Incident tracking engines
 */
/**
 * File: /reuse/construction/construction-safety-management-kit.ts
 * Locator: WC-CONST-SAFE-001
 * Purpose: Comprehensive Construction Safety Management & Compliance Utilities
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Safety controllers, incident services, compliance tracking, OSHA reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for safety planning, hazard identification, incident reporting, investigation workflows, safety inspections, compliance tracking, PPE management, toolbox talks
 *
 * LLM Context: Enterprise-grade construction safety management system for White Cross healthcare facility construction.
 * Provides safety plan development, hazard identification and mitigation, incident reporting and investigation,
 * safety inspection scheduling, OSHA compliance tracking, PPE management, toolbox talk documentation, safety training,
 * near-miss reporting, emergency response, contractor safety performance, safety metrics and analytics, regulatory compliance.
 */
import { Transaction } from 'sequelize';
import { SafetyInspection } from './models/safety-inspection.model';
import { IncidentType, IncidentSeverity, IncidentStatus, ComplianceStatus, HazardSeverity } from './types/safety.types';
/**
 * Creates a comprehensive safety plan for a project.
 *
 * @param {SafetyPlanData} planData - Safety plan data
 * @param {string} createdBy - User creating the plan
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Created safety plan
 *
 * @example
 * ```typescript
 * const plan = await createSafetyPlan({
 *   projectId: 1,
 *   title: 'Hospital Construction Site Safety Plan',
 *   safetyOfficer: 'john.safety',
 *   applicableRegulations: ['OSHA 1926', 'OSHA 1910']
 * }, 'project.manager');
 * ```
 */
export declare const createSafetyPlan: (planData: Partial<SafetyPlanData>, createdBy: string, transaction?: Transaction) => Promise<any>;
/**
 * Updates safety plan with version control.
 *
 * @param {number} planId - Safety plan ID
 * @param {Partial<SafetyPlanData>} updates - Plan updates
 * @param {string} updatedBy - User updating the plan
 * @param {boolean} [incrementVersion=false] - Whether to increment version
 * @returns {Promise<object>} Updated safety plan
 *
 * @example
 * ```typescript
 * const updated = await updateSafetyPlan(1, {
 *   status: SafetyPlanStatus.APPROVED,
 *   approvedBy: 'director.jones'
 * }, 'safety.officer', true);
 * ```
 */
export declare const updateSafetyPlan: (planId: number, updates: Partial<SafetyPlanData>, updatedBy: string, incrementVersion?: boolean) => Promise<any>;
/**
 * Approves safety plan with approval workflow.
 *
 * @param {number} planId - Safety plan ID
 * @param {string} approver - User approving the plan
 * @param {string} [comments] - Approval comments
 * @returns {Promise<object>} Approved safety plan
 *
 * @example
 * ```typescript
 * const approved = await approveSafetyPlan(1, 'safety.director', 'Plan meets all OSHA requirements');
 * ```
 */
export declare const approveSafetyPlan: (planId: number, approver: string, comments?: string) => Promise<any>;
/**
 * Generates unique safety plan number.
 *
 * @param {number} projectId - Project ID
 * @returns {string} Generated plan number
 *
 * @example
 * ```typescript
 * const planNumber = generateSafetyPlanNumber(1);
 * // Returns: 'SP-2025-001-P001'
 * ```
 */
export declare const generateSafetyPlanNumber: (projectId: number) => string;
/**
 * Validates safety plan against OSHA and regulatory requirements.
 *
 * @param {SafetyPlanData} planData - Plan data to validate
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateSafetyPlan(planData);
 * if (!validation.valid) {
 *   throw new Error(validation.errors.join(', '));
 * }
 * ```
 */
export declare const validateSafetyPlan: (planData: Partial<SafetyPlanData>) => Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * Records identified hazard with risk assessment.
 *
 * @param {HazardIdentification} hazardData - Hazard details
 * @param {string} identifiedBy - User identifying hazard
 * @returns {Promise<object>} Created hazard record
 *
 * @example
 * ```typescript
 * const hazard = await identifyHazard({
 *   projectId: 1,
 *   location: 'Excavation Zone',
 *   hazardType: 'Cave-in',
 *   severity: HazardSeverity.SERIOUS,
 *   likelihood: 'LIKELY',
 *   controlMeasures: ['Shoring', 'Sloping', 'Competent person inspection']
 * }, 'site.supervisor');
 * ```
 */
export declare const identifyHazard: (hazardData: Partial<HazardIdentification>, identifiedBy: string) => Promise<any>;
/**
 * Calculates risk score based on severity and likelihood.
 *
 * @param {HazardSeverity} severity - Hazard severity
 * @param {string} likelihood - Likelihood of occurrence
 * @returns {number} Risk score (1-25)
 *
 * @example
 * ```typescript
 * const score = calculateRiskScore(HazardSeverity.SERIOUS, 'LIKELY');
 * // Returns: 20
 * ```
 */
export declare const calculateRiskScore: (severity: HazardSeverity, likelihood: string) => number;
/**
 * Updates hazard control measures and status.
 *
 * @param {string} hazardId - Hazard ID
 * @param {object} updates - Hazard updates
 * @param {string} updatedBy - User updating hazard
 * @returns {Promise<object>} Updated hazard
 *
 * @example
 * ```typescript
 * const updated = await updateHazardControls('HAZ-2025-001', {
 *   controlMeasures: ['Additional shoring installed'],
 *   status: 'CONTROLLED'
 * }, 'safety.officer');
 * ```
 */
export declare const updateHazardControls: (hazardId: string, updates: any, updatedBy: string) => Promise<any>;
/**
 * Retrieves high-risk hazards requiring immediate attention.
 *
 * @param {number} projectId - Project ID
 * @param {number} [minRiskScore=15] - Minimum risk score threshold
 * @returns {Promise<HazardIdentification[]>} High-risk hazards
 *
 * @example
 * ```typescript
 * const criticalHazards = await getHighRiskHazards(1, 20);
 * ```
 */
export declare const getHighRiskHazards: (projectId: number, minRiskScore?: number) => Promise<HazardIdentification[]>;
/**
 * Generates hazard register report for project.
 *
 * @param {number} projectId - Project ID
 * @param {object} [filters] - Optional filters
 * @returns {Promise<object>} Hazard register report
 *
 * @example
 * ```typescript
 * const register = await generateHazardRegister(1);
 * ```
 */
export declare const generateHazardRegister: (projectId: number, filters?: any) => Promise<any>;
/**
 * Reports a safety incident with immediate details.
 *
 * @param {IncidentReport} incidentData - Incident details
 * @param {string} reportedBy - User reporting incident
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Created incident report
 *
 * @example
 * ```typescript
 * const incident = await reportIncident({
 *   projectId: 1,
 *   incidentType: IncidentType.INJURY,
 *   severity: IncidentSeverity.FIRST_AID,
 *   location: 'Building A - 2nd Floor',
 *   description: 'Worker cut finger on sharp metal edge'
 * }, 'site.foreman');
 * ```
 */
export declare const reportIncident: (incidentData: Partial<IncidentReport>, reportedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * Determines if incident requires formal investigation.
 *
 * @param {IncidentSeverity} severity - Incident severity
 * @returns {boolean} Whether investigation required
 *
 * @example
 * ```typescript
 * const required = determineInvestigationRequired(IncidentSeverity.LOST_TIME);
 * // Returns: true
 * ```
 */
export declare const determineInvestigationRequired: (severity: IncidentSeverity) => boolean;
/**
 * Updates incident status and information.
 *
 * @param {string} incidentNumber - Incident number
 * @param {IncidentStatus} newStatus - New status
 * @param {object} updateData - Additional update data
 * @param {string} updatedBy - User updating incident
 * @returns {Promise<object>} Updated incident
 *
 * @example
 * ```typescript
 * const updated = await updateIncidentStatus('INC-2025-001', IncidentStatus.CLOSED, {
 *   closedBy: 'safety.manager',
 *   rootCause: 'Inadequate hazard communication'
 * }, 'safety.manager');
 * ```
 */
export declare const updateIncidentStatus: (incidentNumber: string, newStatus: IncidentStatus, updateData: any, updatedBy: string) => Promise<any>;
/**
 * Retrieves incidents by project with filtering.
 *
 * @param {number} projectId - Project ID
 * @param {object} [filters] - Optional filters (type, severity, date range)
 * @returns {Promise<IncidentReport[]>} List of incidents
 *
 * @example
 * ```typescript
 * const incidents = await getIncidentsByProject(1, {
 *   severity: IncidentSeverity.LOST_TIME,
 *   startDate: new Date('2025-01-01')
 * });
 * ```
 */
export declare const getIncidentsByProject: (projectId: number, filters?: any) => Promise<IncidentReport[]>;
/**
 * Generates unique incident number.
 *
 * @param {IncidentType} incidentType - Type of incident
 * @returns {string} Generated incident number
 *
 * @example
 * ```typescript
 * const incidentNumber = generateIncidentNumber(IncidentType.INJURY);
 * // Returns: 'INC-INJ-2025-0001'
 * ```
 */
export declare const generateIncidentNumber: (incidentType: IncidentType) => string;
/**
 * Initiates formal incident investigation.
 *
 * @param {IncidentInvestigation} investigationData - Investigation details
 * @param {string} investigator - Lead investigator
 * @returns {Promise<object>} Created investigation
 *
 * @example
 * ```typescript
 * const investigation = await initiateInvestigation({
 *   incidentNumber: 'INC-2025-001',
 *   investigator: 'safety.manager',
 *   methodsUsed: ['Root Cause Analysis', 'Witness Interviews']
 * }, 'safety.manager');
 * ```
 */
export declare const initiateInvestigation: (investigationData: Partial<IncidentInvestigation>, investigator: string) => Promise<any>;
/**
 * Conducts root cause analysis for incident.
 *
 * @param {string} investigationId - Investigation ID
 * @param {object} analysisData - Root cause analysis data
 * @returns {Promise<object>} Updated investigation with root cause
 *
 * @example
 * ```typescript
 * const analysis = await conductRootCauseAnalysis('INV-2025-001', {
 *   rootCause: 'Inadequate fall protection',
 *   contributingFactors: ['Lack of training', 'Missing guardrails'],
 *   findings: 'Multiple safety failures identified'
 * });
 * ```
 */
export declare const conductRootCauseAnalysis: (investigationId: string, analysisData: any) => Promise<any>;
/**
 * Documents corrective and preventive actions from investigation.
 *
 * @param {string} investigationId - Investigation ID
 * @param {string[]} correctiveActions - Corrective actions
 * @param {string[]} preventiveActions - Preventive actions
 * @returns {Promise<object>} Updated investigation
 *
 * @example
 * ```typescript
 * const actions = await documentInvestigationActions('INV-2025-001', [
 *   'Install permanent guardrails',
 *   'Provide fall protection training'
 * ], [
 *   'Implement daily safety inspections',
 *   'Update fall protection procedures'
 * ]);
 * ```
 */
export declare const documentInvestigationActions: (investigationId: string, correctiveActions: string[], preventiveActions: string[]) => Promise<any>;
/**
 * Closes investigation after completion and review.
 *
 * @param {string} investigationId - Investigation ID
 * @param {string} reviewedBy - User reviewing investigation
 * @param {string} [comments] - Review comments
 * @returns {Promise<object>} Closed investigation
 *
 * @example
 * ```typescript
 * const closed = await closeInvestigation('INV-2025-001', 'safety.director', 'Investigation thorough and complete');
 * ```
 */
export declare const closeInvestigation: (investigationId: string, reviewedBy: string, comments?: string) => Promise<any>;
/**
 * Generates investigation report with findings and recommendations.
 *
 * @param {string} investigationId - Investigation ID
 * @returns {Promise<object>} Investigation report
 *
 * @example
 * ```typescript
 * const report = await generateInvestigationReport('INV-2025-001');
 * ```
 */
export declare const generateInvestigationReport: (investigationId: string) => Promise<any>;
/**
 * Conducts safety inspection with checklist.
 *
 * @param {SafetyInspection} inspectionData - Inspection details
 * @param {string} inspector - Inspector name
 * @returns {Promise<object>} Created inspection record
 *
 * @example
 * ```typescript
 * const inspection = await conductSafetyInspection({
 *   safetyPlanId: 1,
 *   projectId: 1,
 *   inspectionType: InspectionType.WEEKLY_SITE,
 *   location: 'Main Construction Site',
 *   checklistUsed: 'OSHA General Site Checklist'
 * }, 'john.inspector');
 * ```
 */
export declare const conductSafetyInspection: (inspectionData: Partial<SafetyInspection>, inspector: string) => Promise<any>;
/**
 * Records inspection findings and violations.
 *
 * @param {string} inspectionNumber - Inspection number
 * @param {object} findings - Inspection findings
 * @returns {Promise<object>} Updated inspection
 *
 * @example
 * ```typescript
 * const recorded = await recordInspectionFindings('SI-2025-001', {
 *   safeItems: 45,
 *   unsafeItems: 5,
 *   totalItems: 50,
 *   violations: [{ code: 'OSHA 1926.451', description: 'Missing guardrails' }]
 * });
 * ```
 */
export declare const recordInspectionFindings: (inspectionNumber: string, findings: any) => Promise<any>;
/**
 * Schedules follow-up inspection for violations.
 *
 * @param {string} inspectionNumber - Original inspection number
 * @param {Date} followUpDate - Follow-up date
 * @param {string[]} itemsToReview - Items to review
 * @returns {Promise<object>} Scheduled follow-up inspection
 *
 * @example
 * ```typescript
 * const followUp = await scheduleFollowUpInspection('SI-2025-001', addDays(new Date(), 7), [
 *   'Guardrail installation',
 *   'Scaffolding repairs'
 * ]);
 * ```
 */
export declare const scheduleFollowUpInspection: (inspectionNumber: string, followUpDate: Date, itemsToReview: string[]) => Promise<any>;
/**
 * Retrieves inspection history for project.
 *
 * @param {number} projectId - Project ID
 * @param {object} [filters] - Optional filters
 * @returns {Promise<SafetyInspection[]>} Inspection history
 *
 * @example
 * ```typescript
 * const history = await getSafetyInspectionHistory(1, {
 *   inspectionType: InspectionType.WEEKLY_SITE,
 *   startDate: new Date('2025-01-01')
 * });
 * ```
 */
export declare const getSafetyInspectionHistory: (projectId: number, filters?: any) => Promise<SafetyInspection[]>;
/**
 * Generates unique safety inspection number.
 *
 * @returns {string} Generated inspection number
 *
 * @example
 * ```typescript
 * const inspectionNumber = generateSafetyInspectionNumber();
 * // Returns: 'SI-2025-00001'
 * ```
 */
export declare const generateSafetyInspectionNumber: () => string;
/**
 * Tracks OSHA compliance requirement.
 *
 * @param {ComplianceRequirement} requirementData - Compliance requirement
 * @param {string} createdBy - User creating requirement
 * @returns {Promise<object>} Created compliance requirement
 *
 * @example
 * ```typescript
 * const requirement = await trackComplianceRequirement({
 *   regulation: 'OSHA 1926.451',
 *   standard: 'Scaffolding Safety',
 *   description: 'Competent person inspection of scaffolds',
 *   frequency: 'Daily'
 * }, 'safety.manager');
 * ```
 */
export declare const trackComplianceRequirement: (requirementData: Partial<ComplianceRequirement>, createdBy: string) => Promise<any>;
/**
 * Verifies compliance with requirement.
 *
 * @param {string} requirementId - Requirement ID
 * @param {ComplianceStatus} status - Compliance status
 * @param {string} verifiedBy - User verifying compliance
 * @param {string[]} [evidence] - Evidence of compliance
 * @returns {Promise<object>} Updated compliance requirement
 *
 * @example
 * ```typescript
 * const verified = await verifyCompliance('COMP-001', ComplianceStatus.COMPLIANT, 'inspector.smith', [
 *   'Inspection report dated 2025-03-01',
 *   'Photo documentation'
 * ]);
 * ```
 */
export declare const verifyCompliance: (requirementId: string, status: ComplianceStatus, verifiedBy: string, evidence?: string[]) => Promise<any>;
/**
 * Generates compliance status report.
 *
 * @param {number} projectId - Project ID
 * @param {Date} [asOfDate] - Report date
 * @returns {Promise<object>} Compliance report
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport(1);
 * ```
 */
export declare const generateComplianceReport: (projectId: number, asOfDate?: Date) => Promise<any>;
/**
 * Identifies compliance gaps requiring attention.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<object[]>} Compliance gaps
 *
 * @example
 * ```typescript
 * const gaps = await identifyComplianceGaps(1);
 * ```
 */
export declare const identifyComplianceGaps: (projectId: number) => Promise<any[]>;
/**
 * Tracks regulatory citations and violations.
 *
 * @param {number} projectId - Project ID
 * @param {object} citationData - Citation details
 * @returns {Promise<object>} Created citation record
 *
 * @example
 * ```typescript
 * const citation = await trackRegulatoryCitation(1, {
 *   regulation: 'OSHA 1926.501',
 *   description: 'Inadequate fall protection',
 *   severity: 'SERIOUS',
 *   fineAmount: 15000
 * });
 * ```
 */
export declare const trackRegulatoryCitation: (projectId: number, citationData: any) => Promise<any>;
/**
 * Issues PPE to employee with tracking.
 *
 * @param {PPERecord} ppeData - PPE issuance data
 * @param {string} issuedBy - User issuing PPE
 * @returns {Promise<object>} Created PPE record
 *
 * @example
 * ```typescript
 * const ppe = await issuePPE({
 *   projectId: 1,
 *   employee: 'john.worker',
 *   ppeType: 'Full Body Harness',
 *   manufacturer: 'SafetyFirst',
 *   model: 'FBH-2000',
 *   inspectionFrequency: 'Daily'
 * }, 'safety.coordinator');
 * ```
 */
export declare const issuePPE: (ppeData: Partial<PPERecord>, issuedBy: string) => Promise<any>;
/**
 * Inspects PPE condition and records results.
 *
 * @param {string} recordId - PPE record ID
 * @param {string} condition - Current condition
 * @param {string} inspectedBy - Inspector
 * @param {string} [notes] - Inspection notes
 * @returns {Promise<object>} Updated PPE record
 *
 * @example
 * ```typescript
 * const inspected = await inspectPPE('PPE-2025-001', 'FAIR', 'john.supervisor', 'Minor wear, still serviceable');
 * ```
 */
export declare const inspectPPE: (recordId: string, condition: string, inspectedBy: string, notes?: string) => Promise<any>;
/**
 * Tracks PPE training completion.
 *
 * @param {string} recordId - PPE record ID
 * @param {string} employee - Employee name
 * @param {Date} trainingDate - Training completion date
 * @param {string} trainer - Trainer name
 * @returns {Promise<object>} Updated PPE record
 *
 * @example
 * ```typescript
 * const trained = await trackPPETraining('PPE-2025-001', 'john.worker', new Date(), 'safety.trainer');
 * ```
 */
export declare const trackPPETraining: (recordId: string, employee: string, trainingDate: Date, trainer: string) => Promise<any>;
/**
 * Identifies PPE requiring replacement.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<PPERecord[]>} PPE items requiring replacement
 *
 * @example
 * ```typescript
 * const replacements = await identifyPPEReplacements(1);
 * ```
 */
export declare const identifyPPEReplacements: (projectId: number) => Promise<PPERecord[]>;
/**
 * Generates PPE inventory report.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<object>} PPE inventory report
 *
 * @example
 * ```typescript
 * const inventory = await generatePPEInventoryReport(1);
 * ```
 */
export declare const generatePPEInventoryReport: (projectId: number) => Promise<any>;
/**
 * Documents toolbox talk with attendance.
 *
 * @param {ToolboxTalk} talkData - Toolbox talk details
 * @param {string} conductor - Talk conductor
 * @returns {Promise<object>} Created toolbox talk record
 *
 * @example
 * ```typescript
 * const talk = await documentToolboxTalk({
 *   projectId: 1,
 *   topic: 'Fall Protection Best Practices',
 *   date: new Date(),
 *   duration: 15,
 *   attendees: ['worker1', 'worker2', 'worker3'],
 *   keyPoints: ['Use proper anchorage', 'Inspect equipment daily']
 * }, 'site.foreman');
 * ```
 */
export declare const documentToolboxTalk: (talkData: Partial<ToolboxTalk>, conductor: string) => Promise<any>;
/**
 * Retrieves toolbox talk history for project.
 *
 * @param {number} projectId - Project ID
 * @param {object} [filters] - Optional filters
 * @returns {Promise<ToolboxTalk[]>} Toolbox talk history
 *
 * @example
 * ```typescript
 * const history = await getToolboxTalkHistory(1, {
 *   startDate: new Date('2025-01-01'),
 *   topic: 'Fall Protection'
 * });
 * ```
 */
export declare const getToolboxTalkHistory: (projectId: number, filters?: any) => Promise<ToolboxTalk[]>;
/**
 * Tracks employee toolbox talk attendance.
 *
 * @param {string} employee - Employee name
 * @param {number} projectId - Project ID
 * @returns {Promise<object>} Attendance summary
 *
 * @example
 * ```typescript
 * const attendance = await trackToolboxTalkAttendance('john.worker', 1);
 * ```
 */
export declare const trackToolboxTalkAttendance: (employee: string, projectId: number) => Promise<any>;
/**
 * Generates toolbox talk schedule for project.
 *
 * @param {number} projectId - Project ID
 * @param {Date} startDate - Schedule start date
 * @param {Date} endDate - Schedule end date
 * @returns {Promise<object[]>} Scheduled toolbox talks
 *
 * @example
 * ```typescript
 * const schedule = await generateToolboxTalkSchedule(1, new Date(), addMonths(new Date(), 1));
 * ```
 */
export declare const generateToolboxTalkSchedule: (projectId: number, startDate: Date, endDate: Date) => Promise<any[]>;
/**
 * Suggests toolbox talk topics based on project hazards.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<string[]>} Suggested topics
 *
 * @example
 * ```typescript
 * const topics = await suggestToolboxTalkTopics(1);
 * ```
 */
export declare const suggestToolboxTalkTopics: (projectId: number) => Promise<string[]>;
/**
 * Calculates comprehensive safety metrics.
 *
 * @param {number} projectId - Project ID
 * @param {string} period - Reporting period
 * @returns {Promise<SafetyMetrics>} Safety metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateSafetyMetrics(1, '2025-Q1');
 * console.log(`TRIR: ${metrics.totalRecordableIncidentRate}`);
 * ```
 */
export declare const calculateSafetyMetrics: (projectId: number, period: string) => Promise<SafetyMetrics>;
/**
 * Generates OSHA 300 log entries.
 *
 * @param {number} projectId - Project ID
 * @param {number} year - Calendar year
 * @returns {Promise<object[]>} OSHA 300 log entries
 *
 * @example
 * ```typescript
 * const log = await generateOSHA300Log(1, 2025);
 * ```
 */
export declare const generateOSHA300Log: (projectId: number, year: number) => Promise<any[]>;
/**
 * Generates OSHA 300A summary report.
 *
 * @param {number} projectId - Project ID
 * @param {number} year - Calendar year
 * @returns {Promise<object>} OSHA 300A summary
 *
 * @example
 * ```typescript
 * const summary = await generateOSHA300ASummary(1, 2025);
 * ```
 */
export declare const generateOSHA300ASummary: (projectId: number, year: number) => Promise<any>;
/**
 * Generates safety performance dashboard.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<object>} Safety dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generateSafetyDashboard(1);
 * ```
 */
export declare const generateSafetyDashboard: (projectId: number) => Promise<any>;
/**
 * Analyzes safety trends and performance.
 *
 * @param {number} projectId - Project ID
 * @param {number} months - Number of months to analyze
 * @returns {Promise<object>} Trend analysis
 *
 * @example
 * ```typescript
 * const trends = await analyzeSafetyTrends(1, 6);
 * ```
 */
export declare const analyzeSafetyTrends: (projectId: number, months: number) => Promise<any>;
/**
 * Generates unique hazard ID.
 *
 * @returns {string} Generated hazard ID
 */
export declare const generateHazardId: () => string;
/**
 * Generates unique investigation ID.
 *
 * @returns {string} Generated investigation ID
 */
export declare const generateInvestigationId: () => string;
/**
 * Generates unique compliance ID.
 *
 * @returns {string} Generated compliance ID
 */
export declare const generateComplianceId: () => string;
/**
 * Generates unique PPE record ID.
 *
 * @returns {string} Generated PPE record ID
 */
export declare const generatePPERecordId: () => string;
/**
 * Generates unique toolbox talk ID.
 *
 * @returns {string} Generated toolbox talk ID
 */
export declare const generateToolboxTalkId: () => string;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createSafetyPlanModel: any;
    createSafetyIncidentModel: any;
    createSafetyInspectionModel: any;
    createSafetyPlan: (planData: Partial<SafetyPlanData>, createdBy: string, transaction?: Transaction) => Promise<any>;
    updateSafetyPlan: (planId: number, updates: Partial<SafetyPlanData>, updatedBy: string, incrementVersion?: boolean) => Promise<any>;
    approveSafetyPlan: (planId: number, approver: string, comments?: string) => Promise<any>;
    generateSafetyPlanNumber: (projectId: number) => string;
    validateSafetyPlan: (planData: Partial<SafetyPlanData>) => Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    identifyHazard: (hazardData: Partial<HazardIdentification>, identifiedBy: string) => Promise<any>;
    calculateRiskScore: (severity: HazardSeverity, likelihood: string) => number;
    updateHazardControls: (hazardId: string, updates: any, updatedBy: string) => Promise<any>;
    getHighRiskHazards: (projectId: number, minRiskScore?: number) => Promise<HazardIdentification[]>;
    generateHazardRegister: (projectId: number, filters?: any) => Promise<any>;
    reportIncident: (incidentData: Partial<IncidentReport>, reportedBy: string, transaction?: Transaction) => Promise<any>;
    determineInvestigationRequired: (severity: IncidentSeverity) => boolean;
    updateIncidentStatus: (incidentNumber: string, newStatus: IncidentStatus, updateData: any, updatedBy: string) => Promise<any>;
    getIncidentsByProject: (projectId: number, filters?: any) => Promise<IncidentReport[]>;
    generateIncidentNumber: (incidentType: IncidentType) => string;
    initiateInvestigation: (investigationData: Partial<IncidentInvestigation>, investigator: string) => Promise<any>;
    conductRootCauseAnalysis: (investigationId: string, analysisData: any) => Promise<any>;
    documentInvestigationActions: (investigationId: string, correctiveActions: string[], preventiveActions: string[]) => Promise<any>;
    closeInvestigation: (investigationId: string, reviewedBy: string, comments?: string) => Promise<any>;
    generateInvestigationReport: (investigationId: string) => Promise<any>;
    conductSafetyInspection: (inspectionData: Partial<SafetyInspection>, inspector: string) => Promise<any>;
    recordInspectionFindings: (inspectionNumber: string, findings: any) => Promise<any>;
    scheduleFollowUpInspection: (inspectionNumber: string, followUpDate: Date, itemsToReview: string[]) => Promise<any>;
    getSafetyInspectionHistory: (projectId: number, filters?: any) => Promise<SafetyInspection[]>;
    generateSafetyInspectionNumber: () => string;
    trackComplianceRequirement: (requirementData: Partial<ComplianceRequirement>, createdBy: string) => Promise<any>;
    verifyCompliance: (requirementId: string, status: ComplianceStatus, verifiedBy: string, evidence?: string[]) => Promise<any>;
    generateComplianceReport: (projectId: number, asOfDate?: Date) => Promise<any>;
    identifyComplianceGaps: (projectId: number) => Promise<any[]>;
    trackRegulatoryCitation: (projectId: number, citationData: any) => Promise<any>;
    issuePPE: (ppeData: Partial<PPERecord>, issuedBy: string) => Promise<any>;
    inspectPPE: (recordId: string, condition: string, inspectedBy: string, notes?: string) => Promise<any>;
    trackPPETraining: (recordId: string, employee: string, trainingDate: Date, trainer: string) => Promise<any>;
    identifyPPEReplacements: (projectId: number) => Promise<PPERecord[]>;
    generatePPEInventoryReport: (projectId: number) => Promise<any>;
    documentToolboxTalk: (talkData: Partial<ToolboxTalk>, conductor: string) => Promise<any>;
    getToolboxTalkHistory: (projectId: number, filters?: any) => Promise<ToolboxTalk[]>;
    trackToolboxTalkAttendance: (employee: string, projectId: number) => Promise<any>;
    generateToolboxTalkSchedule: (projectId: number, startDate: Date, endDate: Date) => Promise<any[]>;
    suggestToolboxTalkTopics: (projectId: number) => Promise<string[]>;
    calculateSafetyMetrics: (projectId: number, period: string) => Promise<SafetyMetrics>;
    generateOSHA300Log: (projectId: number, year: number) => Promise<any[]>;
    generateOSHA300ASummary: (projectId: number, year: number) => Promise<any>;
    generateSafetyDashboard: (projectId: number) => Promise<any>;
    analyzeSafetyTrends: (projectId: number, months: number) => Promise<any>;
};
export default _default;
//# sourceMappingURL=construction-safety-management-kit.d.ts.map