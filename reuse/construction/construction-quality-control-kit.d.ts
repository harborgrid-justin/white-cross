/**
 * LOC: QUALCTRL1234567
 * File: /reuse/construction/construction-quality-control-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend construction services
 *   - Quality control controllers
 *   - Inspection workflow engines
 */
/**
 * File: /reuse/construction/construction-quality-control-kit.ts
 * Locator: WC-CONST-QUAL-001
 * Purpose: Comprehensive Construction Quality Control & Inspection Management Utilities
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Quality controllers, inspection services, deficiency tracking, acceptance validation
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for quality planning, inspection scheduling, deficiency tracking, punch lists, testing, commissioning, non-conformance, corrective actions
 *
 * LLM Context: Enterprise-grade construction quality control system for White Cross healthcare facility construction.
 * Provides quality plan management, inspection scheduling, deficiency tracking, punch list workflows, testing and commissioning,
 * non-conformance reporting, corrective action management, quality metrics, acceptance criteria validation, compliance verification,
 * audit trails, quality documentation, contractor performance tracking, material testing, workmanship standards enforcement.
 */
import { Transaction } from 'sequelize';
import { InspectionType, DeficiencyStatus, DeficiencySeverity } from './types/quality.types';
/**
 * Creates a new quality control plan for a project.
 *
 * @param {QualityPlanData} planData - Quality plan data
 * @param {string} createdBy - User creating the plan
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Created quality plan
 *
 * @example
 * ```typescript
 * const plan = await createQualityPlan({
 *   projectId: 1,
 *   planNumber: 'QP-2025-001',
 *   title: 'Hospital Wing A Quality Control Plan',
 *   status: QualityPlanStatus.DRAFT
 * }, 'quality.manager');
 * ```
 */
export declare const createQualityPlan: (planData: Partial<QualityPlanData>, createdBy: string, transaction?: Transaction) => Promise<any>;
/**
 * Updates existing quality plan with version control.
 *
 * @param {number} planId - Quality plan ID
 * @param {Partial<QualityPlanData>} updates - Plan updates
 * @param {string} updatedBy - User updating the plan
 * @param {boolean} [incrementVersion=false] - Whether to increment version
 * @returns {Promise<object>} Updated quality plan
 *
 * @example
 * ```typescript
 * const updated = await updateQualityPlan(1, {
 *   status: QualityPlanStatus.APPROVED,
 *   approvedBy: 'director.smith'
 * }, 'quality.manager', true);
 * ```
 */
export declare const updateQualityPlan: (planId: number, updates: Partial<QualityPlanData>, updatedBy: string, incrementVersion?: boolean) => Promise<any>;
/**
 * Approves quality plan with approval workflow.
 *
 * @param {number} planId - Quality plan ID
 * @param {string} approver - User approving the plan
 * @param {string} [comments] - Approval comments
 * @returns {Promise<object>} Approved quality plan
 *
 * @example
 * ```typescript
 * const approved = await approveQualityPlan(1, 'director.smith', 'Plan meets all requirements');
 * ```
 */
export declare const approveQualityPlan: (planId: number, approver: string, comments?: string) => Promise<any>;
/**
 * Generates unique quality plan number.
 *
 * @param {number} projectId - Project ID
 * @returns {string} Generated plan number
 *
 * @example
 * ```typescript
 * const planNumber = generateQualityPlanNumber(1);
 * // Returns: 'QP-2025-001-P001'
 * ```
 */
export declare const generateQualityPlanNumber: (projectId: number) => string;
/**
 * Validates quality plan against project requirements and standards.
 *
 * @param {QualityPlanData} planData - Plan data to validate
 * @returns {Promise<{ valid: boolean; errors: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateQualityPlan(planData);
 * if (!validation.valid) {
 *   throw new Error(validation.errors.join(', '));
 * }
 * ```
 */
export declare const validateQualityPlan: (planData: Partial<QualityPlanData>) => Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
}>;
/**
 * Schedules a quality inspection with checklist and participants.
 *
 * @param {InspectionSchedule} scheduleData - Inspection schedule data
 * @param {string} scheduledBy - User scheduling the inspection
 * @returns {Promise<object>} Created inspection schedule
 *
 * @example
 * ```typescript
 * const inspection = await scheduleInspection({
 *   qualityPlanId: 1,
 *   inspectionType: InspectionType.IN_PROGRESS,
 *   scheduledDate: new Date('2025-03-15'),
 *   location: 'Wing A - 3rd Floor',
 *   inspector: 'john.inspector'
 * }, 'quality.manager');
 * ```
 */
export declare const scheduleInspection: (scheduleData: Partial<InspectionSchedule>, scheduledBy: string) => Promise<any>;
/**
 * Reschedules existing inspection to new date/time.
 *
 * @param {number} inspectionId - Inspection ID
 * @param {Date} newDate - New scheduled date
 * @param {string} newTime - New scheduled time
 * @param {string} reason - Reason for rescheduling
 * @returns {Promise<object>} Rescheduled inspection
 *
 * @example
 * ```typescript
 * const rescheduled = await rescheduleInspection(1, new Date('2025-03-20'), '10:00', 'Weather delay');
 * ```
 */
export declare const rescheduleInspection: (inspectionId: number, newDate: Date, newTime: string, reason: string) => Promise<any>;
/**
 * Retrieves upcoming inspections for a project or date range.
 *
 * @param {number} projectId - Project ID
 * @param {Date} [startDate] - Optional start date
 * @param {Date} [endDate] - Optional end date
 * @returns {Promise<object[]>} List of upcoming inspections
 *
 * @example
 * ```typescript
 * const upcoming = await getUpcomingInspections(1, new Date(), addDays(new Date(), 30));
 * ```
 */
export declare const getUpcomingInspections: (projectId: number, startDate?: Date, endDate?: Date) => Promise<any[]>;
/**
 * Assigns inspector(s) to scheduled inspection.
 *
 * @param {number} inspectionId - Inspection ID
 * @param {string} inspector - Lead inspector
 * @param {string[]} [participants] - Additional participants
 * @returns {Promise<object>} Updated inspection
 *
 * @example
 * ```typescript
 * const assigned = await assignInspector(1, 'john.inspector', ['contractor.rep', 'project.manager']);
 * ```
 */
export declare const assignInspector: (inspectionId: number, inspector: string, participants?: string[]) => Promise<any>;
/**
 * Generates inspection number based on type and date.
 *
 * @param {InspectionType} inspectionType - Type of inspection
 * @returns {string} Generated inspection number
 *
 * @example
 * ```typescript
 * const inspectionNumber = generateInspectionNumber(InspectionType.FINAL);
 * // Returns: 'INS-FINAL-2025-001'
 * ```
 */
export declare const generateInspectionNumber: (inspectionType: InspectionType) => string;
/**
 * Records a quality deficiency from inspection or observation.
 *
 * @param {DeficiencyRecord} deficiencyData - Deficiency details
 * @param {string} reportedBy - User reporting deficiency
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Created deficiency record
 *
 * @example
 * ```typescript
 * const deficiency = await recordDeficiency({
 *   projectId: 1,
 *   location: 'Room 301',
 *   description: 'Improper weld on steel beam',
 *   severity: DeficiencySeverity.MAJOR,
 *   assignedTo: 'steel.contractor'
 * }, 'inspector.jones');
 * ```
 */
export declare const recordDeficiency: (deficiencyData: Partial<DeficiencyRecord>, reportedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * Updates deficiency status and resolution information.
 *
 * @param {number} deficiencyId - Deficiency ID
 * @param {DeficiencyStatus} newStatus - New status
 * @param {object} updateData - Additional update data
 * @param {string} updatedBy - User updating deficiency
 * @returns {Promise<object>} Updated deficiency
 *
 * @example
 * ```typescript
 * const updated = await updateDeficiencyStatus(1, DeficiencyStatus.RESOLVED, {
 *   correctiveAction: 'Rework completed per specification',
 *   resolvedBy: 'contractor.smith'
 * }, 'inspector.jones');
 * ```
 */
export declare const updateDeficiencyStatus: (deficiencyId: number, newStatus: DeficiencyStatus, updateData: any, updatedBy: string) => Promise<any>;
/**
 * Assigns deficiency to contractor or responsible party.
 *
 * @param {number} deficiencyId - Deficiency ID
 * @param {string} assignedTo - Person/contractor to assign to
 * @param {Date} dueDate - Resolution due date
 * @param {string} [notes] - Assignment notes
 * @returns {Promise<object>} Updated deficiency
 *
 * @example
 * ```typescript
 * const assigned = await assignDeficiency(1, 'hvac.contractor', addDays(new Date(), 7), 'High priority - impacts schedule');
 * ```
 */
export declare const assignDeficiency: (deficiencyId: number, assignedTo: string, dueDate: Date, notes?: string) => Promise<any>;
/**
 * Retrieves all deficiencies for a project with filtering.
 *
 * @param {number} projectId - Project ID
 * @param {object} [filters] - Optional filters (status, severity, assignedTo)
 * @returns {Promise<DeficiencyRecord[]>} List of deficiencies
 *
 * @example
 * ```typescript
 * const openDeficiencies = await getDeficienciesByProject(1, {
 *   status: DeficiencyStatus.OPEN,
 *   severity: DeficiencySeverity.CRITICAL
 * });
 * ```
 */
export declare const getDeficienciesByProject: (projectId: number, filters?: any) => Promise<DeficiencyRecord[]>;
/**
 * Generates unique deficiency number based on severity.
 *
 * @param {DeficiencySeverity} severity - Deficiency severity
 * @returns {string} Generated deficiency number
 *
 * @example
 * ```typescript
 * const deficiencyNumber = generateDeficiencyNumber(DeficiencySeverity.CRITICAL);
 * // Returns: 'DEF-CRIT-2025-001'
 * ```
 */
export declare const generateDeficiencyNumber: (severity: DeficiencySeverity) => string;
/**
 * Creates punch list item from deficiency or new observation.
 *
 * @param {PunchListItem} itemData - Punch list item data
 * @param {string} createdBy - User creating item
 * @returns {Promise<object>} Created punch list item
 *
 * @example
 * ```typescript
 * const punchItem = await createPunchListItem({
 *   projectId: 1,
 *   location: 'Lobby',
 *   description: 'Touch up paint on walls',
 *   trade: 'Painting',
 *   priority: 'LOW',
 *   assignedContractor: 'paint.contractor'
 * }, 'project.manager');
 * ```
 */
export declare const createPunchListItem: (itemData: Partial<PunchListItem>, createdBy: string) => Promise<any>;
/**
 * Retrieves punch list for project with filtering and sorting.
 *
 * @param {number} projectId - Project ID
 * @param {object} [options] - Filter and sort options
 * @returns {Promise<PunchListItem[]>} Punch list items
 *
 * @example
 * ```typescript
 * const punchList = await getPunchList(1, {
 *   status: 'OPEN',
 *   priority: 'HIGH',
 *   sortBy: 'dueDate'
 * });
 * ```
 */
export declare const getPunchList: (projectId: number, options?: any) => Promise<PunchListItem[]>;
/**
 * Updates punch list item completion status.
 *
 * @param {number} itemId - Punch list item ID
 * @param {string} completedBy - User marking as complete
 * @param {string} [completionNotes] - Completion notes
 * @returns {Promise<object>} Updated punch list item
 *
 * @example
 * ```typescript
 * const completed = await completePunchListItem(1, 'contractor.smith', 'Rework completed per spec');
 * ```
 */
export declare const completePunchListItem: (itemId: number, completedBy: string, completionNotes?: string) => Promise<any>;
/**
 * Verifies punch list item completion.
 *
 * @param {number} itemId - Punch list item ID
 * @param {string} verifiedBy - User verifying completion
 * @param {boolean} accepted - Whether work is accepted
 * @param {string} [notes] - Verification notes
 * @returns {Promise<object>} Verified punch list item
 *
 * @example
 * ```typescript
 * const verified = await verifyPunchListItem(1, 'inspector.jones', true, 'Work meets specifications');
 * ```
 */
export declare const verifyPunchListItem: (itemId: number, verifiedBy: string, accepted: boolean, notes?: string) => Promise<any>;
/**
 * Generates unique punch list item number.
 *
 * @returns {string} Generated punch list number
 *
 * @example
 * ```typescript
 * const itemNumber = generatePunchListNumber();
 * // Returns: 'PL-2025-00001'
 * ```
 */
export declare const generatePunchListNumber: () => string;
/**
 * Creates testing protocol for system or component.
 *
 * @param {TestingProtocol} protocolData - Testing protocol data
 * @param {string} createdBy - User creating protocol
 * @returns {Promise<object>} Created testing protocol
 *
 * @example
 * ```typescript
 * const protocol = await createTestingProtocol({
 *   testName: 'HVAC System Balancing',
 *   testType: 'COMMISSIONING',
 *   specification: 'ASHRAE 111',
 *   acceptanceCriteria: { airflowVariance: '±10%' }
 * }, 'commissioning.agent');
 * ```
 */
export declare const createTestingProtocol: (protocolData: Partial<TestingProtocol>, createdBy: string) => Promise<any>;
/**
 * Records testing results with measurements and outcomes.
 *
 * @param {TestingRecord} testData - Test execution data
 * @param {string} testedBy - User conducting test
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Created test record
 *
 * @example
 * ```typescript
 * const testRecord = await recordTestingResults({
 *   protocolId: 'TP-2025-001',
 *   projectId: 1,
 *   location: 'Mechanical Room',
 *   results: { airflow: 2400, temperature: 72 },
 *   passed: true
 * }, 'tech.johnson');
 * ```
 */
export declare const recordTestingResults: (testData: Partial<TestingRecord>, testedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * Validates test results against acceptance criteria.
 *
 * @param {TestingRecord} testRecord - Test record to validate
 * @param {TestingProtocol} protocol - Associated testing protocol
 * @returns {Promise<{ passed: boolean; deviations: string[]; recommendations: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateTestResults(testRecord, protocol);
 * if (!validation.passed) {
 *   console.log('Deviations:', validation.deviations);
 * }
 * ```
 */
export declare const validateTestResults: (testRecord: Partial<TestingRecord>, protocol: TestingProtocol) => Promise<{
    passed: boolean;
    deviations: string[];
    recommendations: string[];
}>;
/**
 * Schedules retesting for failed tests.
 *
 * @param {string} testRecordId - Failed test record ID
 * @param {Date} scheduledDate - Retest scheduled date
 * @param {string} [notes] - Scheduling notes
 * @returns {Promise<object>} Scheduled retest
 *
 * @example
 * ```typescript
 * const retest = await scheduleRetesting('TR-2025-001', addDays(new Date(), 3), 'After HVAC adjustments');
 * ```
 */
export declare const scheduleRetesting: (testRecordId: string, scheduledDate: Date, notes?: string) => Promise<any>;
/**
 * Generates commissioning report for completed testing.
 *
 * @param {number} projectId - Project ID
 * @param {string} system - System being commissioned
 * @returns {Promise<object>} Commissioning report
 *
 * @example
 * ```typescript
 * const report = await generateCommissioningReport(1, 'HVAC System');
 * ```
 */
export declare const generateCommissioningReport: (projectId: number, system: string) => Promise<any>;
/**
 * Creates non-conformance report (NCR) for specification violations.
 *
 * @param {NonConformanceReport} ncrData - NCR data
 * @param {string} reportedBy - User reporting NCR
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<object>} Created NCR
 *
 * @example
 * ```typescript
 * const ncr = await createNonConformanceReport({
 *   projectId: 1,
 *   title: 'Concrete strength below spec',
 *   description: 'Test cylinders show 3500 psi vs 4000 psi required',
 *   severity: DeficiencySeverity.CRITICAL,
 *   specification: 'ACI 318'
 * }, 'inspector.brown');
 * ```
 */
export declare const createNonConformanceReport: (ncrData: Partial<NonConformanceReport>, reportedBy: string, transaction?: Transaction) => Promise<any>;
/**
 * Updates NCR with root cause analysis.
 *
 * @param {string} ncrNumber - NCR number
 * @param {string} rootCause - Root cause description
 * @param {string} analyzedBy - User performing analysis
 * @returns {Promise<object>} Updated NCR
 *
 * @example
 * ```typescript
 * const updated = await updateNCRRootCause('NCR-2025-001', 'Inadequate curing time during cold weather', 'quality.engineer');
 * ```
 */
export declare const updateNCRRootCause: (ncrNumber: string, rootCause: string, analyzedBy: string) => Promise<any>;
/**
 * Proposes disposition for non-conforming work.
 *
 * @param {string} ncrNumber - NCR number
 * @param {string} dispositionType - Disposition type (ACCEPT, REWORK, REPAIR, REJECT, SCRAP)
 * @param {string} justification - Disposition justification
 * @param {string} proposedBy - User proposing disposition
 * @returns {Promise<object>} NCR with disposition
 *
 * @example
 * ```typescript
 * const disposition = await proposeNCRDisposition('NCR-2025-001', 'REPAIR', 'Engineering analysis shows repair meets structural requirements', 'structural.engineer');
 * ```
 */
export declare const proposeNCRDisposition: (ncrNumber: string, dispositionType: string, justification: string, proposedBy: string) => Promise<any>;
/**
 * Retrieves NCRs with filtering by status, severity, date range.
 *
 * @param {number} projectId - Project ID
 * @param {object} [filters] - Optional filters
 * @returns {Promise<NonConformanceReport[]>} List of NCRs
 *
 * @example
 * ```typescript
 * const openNCRs = await getNonConformanceReports(1, {
 *   status: 'OPEN',
 *   severity: DeficiencySeverity.CRITICAL
 * });
 * ```
 */
export declare const getNonConformanceReports: (projectId: number, filters?: any) => Promise<NonConformanceReport[]>;
/**
 * Generates unique NCR number.
 *
 * @returns {string} Generated NCR number
 *
 * @example
 * ```typescript
 * const ncrNumber = generateNCRNumber();
 * // Returns: 'NCR-2025-0001'
 * ```
 */
export declare const generateNCRNumber: () => string;
/**
 * Creates corrective action plan for deficiency or NCR.
 *
 * @param {CorrectiveActionPlan} capData - CAP data
 * @param {string} createdBy - User creating CAP
 * @returns {Promise<object>} Created CAP
 *
 * @example
 * ```typescript
 * const cap = await createCorrectiveActionPlan({
 *   relatedNcrId: 'NCR-2025-001',
 *   problemStatement: 'Concrete strength below specification',
 *   correctiveActions: ['Remove and replace affected area', 'Review mix design'],
 *   responsiblePerson: 'concrete.contractor',
 *   targetCompletionDate: addDays(new Date(), 14)
 * }, 'quality.manager');
 * ```
 */
export declare const createCorrectiveActionPlan: (capData: Partial<CorrectiveActionPlan>, createdBy: string) => Promise<any>;
/**
 * Updates corrective action implementation status.
 *
 * @param {string} capId - CAP ID
 * @param {string} status - New status
 * @param {object} updateData - Additional update data
 * @returns {Promise<object>} Updated CAP
 *
 * @example
 * ```typescript
 * const updated = await updateCorrectiveActionStatus('CAP-2025-001', 'COMPLETED', {
 *   completionDate: new Date(),
 *   completionNotes: 'All actions implemented successfully'
 * });
 * ```
 */
export declare const updateCorrectiveActionStatus: (capId: string, status: string, updateData: any) => Promise<any>;
/**
 * Verifies effectiveness of corrective actions.
 *
 * @param {string} capId - CAP ID
 * @param {string} effectiveness - Effectiveness rating (EFFECTIVE, NOT_EFFECTIVE, PENDING)
 * @param {string} verifiedBy - User verifying effectiveness
 * @param {string} [notes] - Verification notes
 * @returns {Promise<object>} Verified CAP
 *
 * @example
 * ```typescript
 * const verified = await verifyCorrectiveActionEffectiveness('CAP-2025-001', 'EFFECTIVE', 'quality.manager', 'No recurrence observed after 30 days');
 * ```
 */
export declare const verifyCorrectiveActionEffectiveness: (capId: string, effectiveness: string, verifiedBy: string, notes?: string) => Promise<any>;
/**
 * Tracks corrective action implementation progress.
 *
 * @param {string} capId - CAP ID
 * @returns {Promise<object>} Implementation progress
 *
 * @example
 * ```typescript
 * const progress = await trackCorrectiveActionProgress('CAP-2025-001');
 * console.log(`Progress: ${progress.percentComplete}%`);
 * ```
 */
export declare const trackCorrectiveActionProgress: (capId: string) => Promise<any>;
/**
 * Generates unique CAP identifier.
 *
 * @returns {string} Generated CAP ID
 *
 * @example
 * ```typescript
 * const capId = generateCAPId();
 * // Returns: 'CAP-2025-001'
 * ```
 */
export declare const generateCAPId: () => string;
/**
 * Calculates comprehensive quality metrics for project.
 *
 * @param {number} projectId - Project ID
 * @param {string} period - Reporting period
 * @returns {Promise<QualityMetrics>} Quality metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateQualityMetrics(1, '2025-Q1');
 * console.log(`Pass rate: ${metrics.passRate}%`);
 * ```
 */
export declare const calculateQualityMetrics: (projectId: number, period: string) => Promise<QualityMetrics>;
/**
 * Generates quality trend analysis over time.
 *
 * @param {number} projectId - Project ID
 * @param {number} months - Number of months to analyze
 * @returns {Promise<object>} Trend analysis
 *
 * @example
 * ```typescript
 * const trends = await analyzeQualityTrends(1, 6);
 * ```
 */
export declare const analyzeQualityTrends: (projectId: number, months: number) => Promise<any>;
/**
 * Compares quality performance across contractors.
 *
 * @param {number} projectId - Project ID
 * @param {string[]} contractors - List of contractors to compare
 * @returns {Promise<object[]>} Contractor performance comparison
 *
 * @example
 * ```typescript
 * const comparison = await compareContractorQuality(1, ['Contractor A', 'Contractor B']);
 * ```
 */
export declare const compareContractorQuality: (projectId: number, contractors: string[]) => Promise<any[]>;
/**
 * Identifies quality risk areas requiring attention.
 *
 * @param {number} projectId - Project ID
 * @param {number} [thresholdScore=70] - Quality score threshold
 * @returns {Promise<object[]>} Risk areas
 *
 * @example
 * ```typescript
 * const risks = await identifyQualityRisks(1, 75);
 * ```
 */
export declare const identifyQualityRisks: (projectId: number, thresholdScore?: number) => Promise<any[]>;
/**
 * Generates quality dashboard data for visualization.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<object>} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generateQualityDashboard(1);
 * ```
 */
export declare const generateQualityDashboard: (projectId: number) => Promise<any>;
/**
 * Defines acceptance criteria for work package or deliverable.
 *
 * @param {AcceptanceCriteria} criteriaData - Acceptance criteria data
 * @param {string} definedBy - User defining criteria
 * @returns {Promise<object>} Created acceptance criteria
 *
 * @example
 * ```typescript
 * const criteria = await defineAcceptanceCriteria({
 *   projectId: 1,
 *   workPackage: 'Concrete Work',
 *   standard: 'ACI 318',
 *   parameter: 'Compressive Strength',
 *   acceptableRange: '4000 psi ± 500 psi',
 *   testMethod: 'ASTM C39'
 * }, 'structural.engineer');
 * ```
 */
export declare const defineAcceptanceCriteria: (criteriaData: Partial<AcceptanceCriteria>, definedBy: string) => Promise<any>;
/**
 * Validates work against defined acceptance criteria.
 *
 * @param {number} workPackageId - Work package ID
 * @param {object} measurements - Actual measurements
 * @returns {Promise<{ acceptable: boolean; deviations: string[]; criteria: AcceptanceCriteria[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateAgainstAcceptanceCriteria(1, {
 *   compressiveStrength: 4200,
 *   slump: 4
 * });
 * ```
 */
export declare const validateAgainstAcceptanceCriteria: (workPackageId: number, measurements: Record<string, any>) => Promise<{
    acceptable: boolean;
    deviations: string[];
    criteria: AcceptanceCriteria[];
}>;
/**
 * Retrieves acceptance criteria for project or work package.
 *
 * @param {number} projectId - Project ID
 * @param {string} [workPackage] - Optional work package filter
 * @returns {Promise<AcceptanceCriteria[]>} Acceptance criteria list
 *
 * @example
 * ```typescript
 * const criteria = await getAcceptanceCriteria(1, 'Concrete Work');
 * ```
 */
export declare const getAcceptanceCriteria: (projectId: number, workPackage?: string) => Promise<AcceptanceCriteria[]>;
/**
 * Updates acceptance criteria with change tracking.
 *
 * @param {string} criteriaId - Criteria ID
 * @param {Partial<AcceptanceCriteria>} updates - Criteria updates
 * @param {string} updatedBy - User updating criteria
 * @returns {Promise<object>} Updated criteria
 *
 * @example
 * ```typescript
 * const updated = await updateAcceptanceCriteria('AC-001', {
 *   acceptableRange: '4000 psi ± 600 psi'
 * }, 'engineer.smith');
 * ```
 */
export declare const updateAcceptanceCriteria: (criteriaId: string, updates: Partial<AcceptanceCriteria>, updatedBy: string) => Promise<any>;
/**
 * Generates comprehensive acceptance documentation for project closeout.
 *
 * @param {number} projectId - Project ID
 * @returns {Promise<object>} Acceptance documentation
 *
 * @example
 * ```typescript
 * const documentation = await generateAcceptanceDocumentation(1);
 * ```
 */
export declare const generateAcceptanceDocumentation: (projectId: number) => Promise<any>;
/**
 * Generates unique test protocol ID.
 *
 * @returns {string} Generated protocol ID
 */
export declare const generateTestProtocolId: () => string;
/**
 * Generates unique test record ID.
 *
 * @returns {string} Generated test record ID
 */
export declare const generateTestRecordId: () => string;
/**
 * Generates unique criteria ID.
 *
 * @returns {string} Generated criteria ID
 */
export declare const generateCriteriaId: () => string;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createQualityPlanModel: any;
    createQualityInspectionModel: any;
    createQualityDeficiencyModel: any;
    createQualityPlan: (planData: Partial<QualityPlanData>, createdBy: string, transaction?: Transaction) => Promise<any>;
    updateQualityPlan: (planId: number, updates: Partial<QualityPlanData>, updatedBy: string, incrementVersion?: boolean) => Promise<any>;
    approveQualityPlan: (planId: number, approver: string, comments?: string) => Promise<any>;
    generateQualityPlanNumber: (projectId: number) => string;
    validateQualityPlan: (planData: Partial<QualityPlanData>) => Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    scheduleInspection: (scheduleData: Partial<InspectionSchedule>, scheduledBy: string) => Promise<any>;
    rescheduleInspection: (inspectionId: number, newDate: Date, newTime: string, reason: string) => Promise<any>;
    getUpcomingInspections: (projectId: number, startDate?: Date, endDate?: Date) => Promise<any[]>;
    assignInspector: (inspectionId: number, inspector: string, participants?: string[]) => Promise<any>;
    generateInspectionNumber: (inspectionType: InspectionType) => string;
    recordDeficiency: (deficiencyData: Partial<DeficiencyRecord>, reportedBy: string, transaction?: Transaction) => Promise<any>;
    updateDeficiencyStatus: (deficiencyId: number, newStatus: DeficiencyStatus, updateData: any, updatedBy: string) => Promise<any>;
    assignDeficiency: (deficiencyId: number, assignedTo: string, dueDate: Date, notes?: string) => Promise<any>;
    getDeficienciesByProject: (projectId: number, filters?: any) => Promise<DeficiencyRecord[]>;
    generateDeficiencyNumber: (severity: DeficiencySeverity) => string;
    createPunchListItem: (itemData: Partial<PunchListItem>, createdBy: string) => Promise<any>;
    getPunchList: (projectId: number, options?: any) => Promise<PunchListItem[]>;
    completePunchListItem: (itemId: number, completedBy: string, completionNotes?: string) => Promise<any>;
    verifyPunchListItem: (itemId: number, verifiedBy: string, accepted: boolean, notes?: string) => Promise<any>;
    generatePunchListNumber: () => string;
    createTestingProtocol: (protocolData: Partial<TestingProtocol>, createdBy: string) => Promise<any>;
    recordTestingResults: (testData: Partial<TestingRecord>, testedBy: string, transaction?: Transaction) => Promise<any>;
    validateTestResults: (testRecord: Partial<TestingRecord>, protocol: TestingProtocol) => Promise<{
        passed: boolean;
        deviations: string[];
        recommendations: string[];
    }>;
    scheduleRetesting: (testRecordId: string, scheduledDate: Date, notes?: string) => Promise<any>;
    generateCommissioningReport: (projectId: number, system: string) => Promise<any>;
    createNonConformanceReport: (ncrData: Partial<NonConformanceReport>, reportedBy: string, transaction?: Transaction) => Promise<any>;
    updateNCRRootCause: (ncrNumber: string, rootCause: string, analyzedBy: string) => Promise<any>;
    proposeNCRDisposition: (ncrNumber: string, dispositionType: string, justification: string, proposedBy: string) => Promise<any>;
    getNonConformanceReports: (projectId: number, filters?: any) => Promise<NonConformanceReport[]>;
    generateNCRNumber: () => string;
    createCorrectiveActionPlan: (capData: Partial<CorrectiveActionPlan>, createdBy: string) => Promise<any>;
    updateCorrectiveActionStatus: (capId: string, status: string, updateData: any) => Promise<any>;
    verifyCorrectiveActionEffectiveness: (capId: string, effectiveness: string, verifiedBy: string, notes?: string) => Promise<any>;
    trackCorrectiveActionProgress: (capId: string) => Promise<any>;
    generateCAPId: () => string;
    calculateQualityMetrics: (projectId: number, period: string) => Promise<QualityMetrics>;
    analyzeQualityTrends: (projectId: number, months: number) => Promise<any>;
    compareContractorQuality: (projectId: number, contractors: string[]) => Promise<any[]>;
    identifyQualityRisks: (projectId: number, thresholdScore?: number) => Promise<any[]>;
    generateQualityDashboard: (projectId: number) => Promise<any>;
    defineAcceptanceCriteria: (criteriaData: Partial<AcceptanceCriteria>, definedBy: string) => Promise<any>;
    validateAgainstAcceptanceCriteria: (workPackageId: number, measurements: Record<string, any>) => Promise<{
        acceptable: boolean;
        deviations: string[];
        criteria: AcceptanceCriteria[];
    }>;
    getAcceptanceCriteria: (projectId: number, workPackage?: string) => Promise<AcceptanceCriteria[]>;
    updateAcceptanceCriteria: (criteriaId: string, updates: Partial<AcceptanceCriteria>, updatedBy: string) => Promise<any>;
    generateAcceptanceDocumentation: (projectId: number) => Promise<any>;
};
export default _default;
//# sourceMappingURL=construction-quality-control-kit.d.ts.map