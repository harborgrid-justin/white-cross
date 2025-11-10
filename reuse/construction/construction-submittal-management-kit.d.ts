/**
 * LOC: CNSU9876543
 * File: /reuse/construction/construction-submittal-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable construction utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend construction services
 *   - Submittal management modules
 *   - Document control services
 *   - Compliance tracking systems
 */
/**
 * File: /reuse/construction/construction-submittal-management-kit.ts
 * Locator: WC-CONST-SUBM-001
 * Purpose: Enterprise-grade Construction Submittal Management - submittal registers, tracking workflows, review routing, approval workflows, resubmittal processing, compliance verification, reporting
 *
 * Upstream: Independent utility module for construction submittal operations
 * Downstream: ../backend/construction/*, submittal controllers, document services, compliance modules
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ functions for submittal management competing with Procore and PlanGrid enterprise platforms
 *
 * LLM Context: Comprehensive construction submittal management utilities for production-ready applications.
 * Provides submittal register management, tracking workflows, automated review routing, multi-level approval workflows,
 * resubmittal processing, status tracking, compliance verification, specification matching, submittal reporting,
 * metrics and analytics, document version control, stakeholder notifications, and audit trail management.
 */
import { Transaction, WhereOptions } from 'sequelize';
/**
 * Creates new submittal with automatic numbering.
 *
 * @param {SubmittalData} submittalData - Submittal data
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created submittal
 *
 * @example
 * ```typescript
 * const submittal = await createSubmittal(submittalData, ConstructionSubmittal);
 * ```
 */
export declare const createSubmittal: (submittalData: SubmittalData, ConstructionSubmittal: any, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves complete submittal register with filtering.
 *
 * @param {string} projectId - Project identifier
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @param {WhereOptions} [filters] - Optional filters
 * @returns {Promise<SubmittalRegisterEntry[]>} Submittal register
 *
 * @example
 * ```typescript
 * const register = await getSubmittalRegister('PRJ-001', ConstructionSubmittal, { status: 'under_review' });
 * ```
 */
export declare const getSubmittalRegister: (projectId: string, ConstructionSubmittal: any, filters?: WhereOptions) => Promise<SubmittalRegisterEntry[]>;
/**
 * Updates submittal status with workflow progression.
 *
 * @param {string} submittalId - Submittal identifier
 * @param {string} newStatus - New status
 * @param {string} userId - User making change
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @returns {Promise<any>} Updated submittal
 *
 * @example
 * ```typescript
 * await updateSubmittalStatus('sub-123', 'under_review', 'user456', ConstructionSubmittal);
 * ```
 */
export declare const updateSubmittalStatus: (submittalId: string, newStatus: string, userId: string, ConstructionSubmittal: any) => Promise<any>;
/**
 * Retrieves submittals by specification section.
 *
 * @param {string} projectId - Project identifier
 * @param {string} specSection - Specification section
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @returns {Promise<any[]>} Submittals
 *
 * @example
 * ```typescript
 * const submittals = await getSubmittalsBySpec('PRJ-001', '03 30 00', ConstructionSubmittal);
 * ```
 */
export declare const getSubmittalsBySpec: (projectId: string, specSection: string, ConstructionSubmittal: any) => Promise<any[]>;
/**
 * Retrieves overdue submittals requiring immediate attention.
 *
 * @param {string} projectId - Project identifier
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @returns {Promise<any[]>} Overdue submittals
 *
 * @example
 * ```typescript
 * const overdue = await getOverdueSubmittals('PRJ-001', ConstructionSubmittal);
 * ```
 */
export declare const getOverdueSubmittals: (projectId: string, ConstructionSubmittal: any) => Promise<any[]>;
/**
 * Calculates and updates days in review for active submittals.
 *
 * @param {string} projectId - Project identifier
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @returns {Promise<number>} Number of submittals updated
 *
 * @example
 * ```typescript
 * await updateDaysInReview('PRJ-001', ConstructionSubmittal);
 * ```
 */
export declare const updateDaysInReview: (projectId: string, ConstructionSubmittal: any) => Promise<number>;
/**
 * Searches submittals by multiple criteria with full-text search.
 *
 * @param {string} projectId - Project identifier
 * @param {string} searchTerm - Search term
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @returns {Promise<any[]>} Matching submittals
 *
 * @example
 * ```typescript
 * const results = await searchSubmittals('PRJ-001', 'concrete', ConstructionSubmittal);
 * ```
 */
export declare const searchSubmittals: (projectId: string, searchTerm: string, ConstructionSubmittal: any) => Promise<any[]>;
/**
 * Retrieves submittals assigned to specific reviewer.
 *
 * @param {string} reviewerEmail - Reviewer email
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @returns {Promise<any[]>} Assigned submittals
 *
 * @example
 * ```typescript
 * const assigned = await getSubmittalsByReviewer('john.smith@example.com', ConstructionSubmittal);
 * ```
 */
export declare const getSubmittalsByReviewer: (reviewerEmail: string, ConstructionSubmittal: any) => Promise<any[]>;
/**
 * Bulk imports submittals from schedule or spreadsheet.
 *
 * @param {string} projectId - Project identifier
 * @param {SubmittalData[]} submittalsData - Array of submittal data
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ created: number; failed: number; errors: string[] }>} Import results
 *
 * @example
 * ```typescript
 * const result = await bulkImportSubmittals('PRJ-001', submittals, ConstructionSubmittal);
 * ```
 */
export declare const bulkImportSubmittals: (projectId: string, submittalsData: SubmittalData[], ConstructionSubmittal: any, transaction?: Transaction) => Promise<{
    created: number;
    failed: number;
    errors: string[];
}>;
/**
 * Exports submittal register to CSV format.
 *
 * @param {string} projectId - Project identifier
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @returns {Promise<string>} CSV formatted register
 *
 * @example
 * ```typescript
 * const csv = await exportSubmittalRegisterCSV('PRJ-001', ConstructionSubmittal);
 * ```
 */
export declare const exportSubmittalRegisterCSV: (projectId: string, ConstructionSubmittal: any) => Promise<string>;
/**
 * Creates review workflow for submittal with routing steps.
 *
 * @param {string} submittalId - Submittal identifier
 * @param {ReviewRoutingStep[]} routingSteps - Routing steps
 * @param {string} workflowType - Workflow type
 * @param {Model} SubmittalWorkflow - SubmittalWorkflow model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created workflow
 *
 * @example
 * ```typescript
 * const workflow = await createReviewWorkflow('sub-123', steps, 'sequential', SubmittalWorkflow);
 * ```
 */
export declare const createReviewWorkflow: (submittalId: string, routingSteps: ReviewRoutingStep[], workflowType: "sequential" | "parallel" | "hybrid", SubmittalWorkflow: any, transaction?: Transaction) => Promise<any>;
/**
 * Assigns submittal to reviewer with notification.
 *
 * @param {string} submittalId - Submittal identifier
 * @param {string} reviewerName - Reviewer name
 * @param {string} reviewerEmail - Reviewer email
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @returns {Promise<any>} Updated submittal
 *
 * @example
 * ```typescript
 * await assignSubmittalToReviewer('sub-123', 'John Smith', 'john@example.com', ConstructionSubmittal);
 * ```
 */
export declare const assignSubmittalToReviewer: (submittalId: string, reviewerName: string, reviewerEmail: string, ConstructionSubmittal: any) => Promise<any>;
/**
 * Advances workflow to next step based on type.
 *
 * @param {string} submittalId - Submittal identifier
 * @param {Model} SubmittalWorkflow - SubmittalWorkflow model
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @returns {Promise<any>} Updated workflow
 *
 * @example
 * ```typescript
 * await advanceWorkflowStep('sub-123', SubmittalWorkflow, ConstructionSubmittal);
 * ```
 */
export declare const advanceWorkflowStep: (submittalId: string, SubmittalWorkflow: any, ConstructionSubmittal: any) => Promise<any>;
/**
 * Retrieves workflow status with step details.
 *
 * @param {string} submittalId - Submittal identifier
 * @param {Model} SubmittalWorkflow - SubmittalWorkflow model
 * @returns {Promise<ApprovalWorkflowData | null>} Workflow data
 *
 * @example
 * ```typescript
 * const workflow = await getWorkflowStatus('sub-123', SubmittalWorkflow);
 * ```
 */
export declare const getWorkflowStatus: (submittalId: string, SubmittalWorkflow: any) => Promise<ApprovalWorkflowData | null>;
/**
 * Escalates overdue workflow to management.
 *
 * @param {string} submittalId - Submittal identifier
 * @param {string} escalateTo - Escalation recipient
 * @param {string} reason - Escalation reason
 * @param {Model} SubmittalWorkflow - SubmittalWorkflow model
 * @returns {Promise<any>} Updated workflow
 *
 * @example
 * ```typescript
 * await escalateWorkflow('sub-123', 'manager@example.com', 'Overdue by 5 days', SubmittalWorkflow);
 * ```
 */
export declare const escalateWorkflow: (submittalId: string, escalateTo: string, reason: string, SubmittalWorkflow: any) => Promise<any>;
/**
 * Pauses workflow with reason tracking.
 *
 * @param {string} submittalId - Submittal identifier
 * @param {string} reason - Pause reason
 * @param {Model} SubmittalWorkflow - SubmittalWorkflow model
 * @returns {Promise<any>} Updated workflow
 *
 * @example
 * ```typescript
 * await pauseWorkflow('sub-123', 'Waiting for additional information', SubmittalWorkflow);
 * ```
 */
export declare const pauseWorkflow: (submittalId: string, reason: string, SubmittalWorkflow: any) => Promise<any>;
/**
 * Resumes paused workflow.
 *
 * @param {string} submittalId - Submittal identifier
 * @param {Model} SubmittalWorkflow - SubmittalWorkflow model
 * @returns {Promise<any>} Updated workflow
 *
 * @example
 * ```typescript
 * await resumeWorkflow('sub-123', SubmittalWorkflow);
 * ```
 */
export declare const resumeWorkflow: (submittalId: string, SubmittalWorkflow: any) => Promise<any>;
/**
 * Retrieves parallel review workflows requiring coordination.
 *
 * @param {string} projectId - Project identifier
 * @param {Model} SubmittalWorkflow - SubmittalWorkflow model
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @returns {Promise<any[]>} Parallel workflows
 *
 * @example
 * ```typescript
 * const workflows = await getParallelReviewWorkflows('PRJ-001', SubmittalWorkflow, ConstructionSubmittal);
 * ```
 */
export declare const getParallelReviewWorkflows: (projectId: string, SubmittalWorkflow: any, ConstructionSubmittal: any) => Promise<any[]>;
/**
 * Calculates workflow performance metrics.
 *
 * @param {string} projectId - Project identifier
 * @param {Model} SubmittalWorkflow - SubmittalWorkflow model
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @returns {Promise<any>} Workflow metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateWorkflowPerformance('PRJ-001', SubmittalWorkflow, ConstructionSubmittal);
 * ```
 */
export declare const calculateWorkflowPerformance: (projectId: string, SubmittalWorkflow: any, ConstructionSubmittal: any) => Promise<any>;
/**
 * Identifies workflow bottlenecks by reviewer.
 *
 * @param {string} projectId - Project identifier
 * @param {Model} SubmittalWorkflow - SubmittalWorkflow model
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @returns {Promise<any[]>} Bottleneck analysis
 *
 * @example
 * ```typescript
 * const bottlenecks = await identifyWorkflowBottlenecks('PRJ-001', SubmittalWorkflow, ConstructionSubmittal);
 * ```
 */
export declare const identifyWorkflowBottlenecks: (projectId: string, SubmittalWorkflow: any, ConstructionSubmittal: any) => Promise<any[]>;
/**
 * Records review action with detailed tracking.
 *
 * @param {ReviewActionData} reviewData - Review action data
 * @param {Model} SubmittalReview - SubmittalReview model
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created review
 *
 * @example
 * ```typescript
 * const review = await recordReviewAction(reviewData, SubmittalReview, ConstructionSubmittal);
 * ```
 */
export declare const recordReviewAction: (reviewData: ReviewActionData, SubmittalReview: any, ConstructionSubmittal: any, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves review history for submittal.
 *
 * @param {string} submittalId - Submittal identifier
 * @param {Model} SubmittalReview - SubmittalReview model
 * @returns {Promise<any[]>} Review history
 *
 * @example
 * ```typescript
 * const history = await getReviewHistory('sub-123', SubmittalReview);
 * ```
 */
export declare const getReviewHistory: (submittalId: string, SubmittalReview: any) => Promise<any[]>;
/**
 * Approves submittal with conditions/notes.
 *
 * @param {string} submittalId - Submittal identifier
 * @param {string} reviewerId - Reviewer identifier
 * @param {string} reviewerName - Reviewer name
 * @param {string} comments - Approval comments
 * @param {Model} SubmittalReview - SubmittalReview model
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @param {string[]} [conditions] - Approval conditions
 * @returns {Promise<any>} Review record
 *
 * @example
 * ```typescript
 * await approveSubmittal('sub-123', 'REV-001', 'John Smith', 'Approved for construction', SubmittalReview, ConstructionSubmittal);
 * ```
 */
export declare const approveSubmittal: (submittalId: string, reviewerId: string, reviewerName: string, comments: string, SubmittalReview: any, ConstructionSubmittal: any, conditions?: string[]) => Promise<any>;
/**
 * Requests revisions for submittal with deficiencies.
 *
 * @param {string} submittalId - Submittal identifier
 * @param {string} reviewerId - Reviewer identifier
 * @param {string} reviewerName - Reviewer name
 * @param {string} comments - Revision comments
 * @param {string[]} deficiencies - List of deficiencies
 * @param {Model} SubmittalReview - SubmittalReview model
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @returns {Promise<any>} Review record
 *
 * @example
 * ```typescript
 * await requestSubmittalRevisions('sub-123', 'REV-001', 'John Smith', 'Revisions required', deficiencies, SubmittalReview, ConstructionSubmittal);
 * ```
 */
export declare const requestSubmittalRevisions: (submittalId: string, reviewerId: string, reviewerName: string, comments: string, deficiencies: string[], SubmittalReview: any, ConstructionSubmittal: any) => Promise<any>;
/**
 * Rejects submittal with detailed reasoning.
 *
 * @param {string} submittalId - Submittal identifier
 * @param {string} reviewerId - Reviewer identifier
 * @param {string} reviewerName - Reviewer name
 * @param {string} rejectionReason - Rejection reason
 * @param {Model} SubmittalReview - SubmittalReview model
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @returns {Promise<any>} Review record
 *
 * @example
 * ```typescript
 * await rejectSubmittal('sub-123', 'REV-001', 'John Smith', 'Does not meet specification', SubmittalReview, ConstructionSubmittal);
 * ```
 */
export declare const rejectSubmittal: (submittalId: string, reviewerId: string, reviewerName: string, rejectionReason: string, SubmittalReview: any, ConstructionSubmittal: any) => Promise<any>;
/**
 * Adds reviewer comments/markup to submittal.
 *
 * @param {string} submittalId - Submittal identifier
 * @param {string} reviewerId - Reviewer identifier
 * @param {string} comments - Comments
 * @param {string[]} markupUrls - Markup document URLs
 * @param {Model} SubmittalReview - SubmittalReview model
 * @returns {Promise<any>} Updated review
 *
 * @example
 * ```typescript
 * await addReviewerComments('sub-123', 'REV-001', 'See markup for details', ['url1'], SubmittalReview);
 * ```
 */
export declare const addReviewerComments: (submittalId: string, reviewerId: string, comments: string, markupUrls: string[], SubmittalReview: any) => Promise<any>;
/**
 * Retrieves pending reviews for user.
 *
 * @param {string} reviewerEmail - Reviewer email
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @returns {Promise<any[]>} Pending reviews
 *
 * @example
 * ```typescript
 * const pending = await getPendingReviews('john@example.com', ConstructionSubmittal);
 * ```
 */
export declare const getPendingReviews: (reviewerEmail: string, ConstructionSubmittal: any) => Promise<any[]>;
/**
 * Calculates average review time by reviewer.
 *
 * @param {string} reviewerId - Reviewer identifier
 * @param {Model} SubmittalReview - SubmittalReview model
 * @returns {Promise<{ avgDays: number; totalReviews: number }>} Review statistics
 *
 * @example
 * ```typescript
 * const stats = await calculateReviewerPerformance('REV-001', SubmittalReview);
 * ```
 */
export declare const calculateReviewerPerformance: (reviewerId: string, SubmittalReview: any) => Promise<{
    avgDays: number;
    totalReviews: number;
}>;
/**
 * Generates review summary report for submittal.
 *
 * @param {string} submittalId - Submittal identifier
 * @param {Model} SubmittalReview - SubmittalReview model
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @returns {Promise<any>} Review summary
 *
 * @example
 * ```typescript
 * const summary = await generateReviewSummary('sub-123', SubmittalReview, ConstructionSubmittal);
 * ```
 */
export declare const generateReviewSummary: (submittalId: string, SubmittalReview: any, ConstructionSubmittal: any) => Promise<any>;
/**
 * Creates resubmittal from original submittal.
 *
 * @param {ResubmittalData} resubmittalData - Resubmittal data
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created resubmittal
 *
 * @example
 * ```typescript
 * const resubmittal = await createResubmittal(resubmittalData, ConstructionSubmittal);
 * ```
 */
export declare const createResubmittal: (resubmittalData: ResubmittalData, ConstructionSubmittal: any, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves all resubmittals for original submittal.
 *
 * @param {string} originalSubmittalId - Original submittal identifier
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @returns {Promise<any[]>} Resubmittals
 *
 * @example
 * ```typescript
 * const resubmittals = await getResubmittals('sub-123', ConstructionSubmittal);
 * ```
 */
export declare const getResubmittals: (originalSubmittalId: string, ConstructionSubmittal: any) => Promise<any[]>;
/**
 * Tracks resubmittal response to original deficiencies.
 *
 * @param {string} resubmittalId - Resubmittal identifier
 * @param {AddressedItem[]} addressedItems - Addressed deficiency items
 * @returns {Promise<any>} Updated resubmittal tracking
 *
 * @example
 * ```typescript
 * await trackResubmittalResponses('sub-123-R1', addressedItems);
 * ```
 */
export declare const trackResubmittalResponses: (resubmittalId: string, addressedItems: AddressedItem[]) => Promise<any>;
/**
 * Verifies all deficiencies addressed in resubmittal.
 *
 * @param {string} resubmittalId - Resubmittal identifier
 * @param {string} reviewerId - Reviewer identifier
 * @returns {Promise<{ allAddressed: boolean; outstanding: string[] }>} Verification result
 *
 * @example
 * ```typescript
 * const result = await verifyDeficienciesAddressed('sub-123-R1', 'REV-001');
 * ```
 */
export declare const verifyDeficienciesAddressed: (resubmittalId: string, reviewerId: string) => Promise<{
    allAddressed: boolean;
    outstanding: string[];
}>;
/**
 * Calculates resubmittal metrics for project.
 *
 * @param {string} projectId - Project identifier
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @returns {Promise<{ totalResubmittals: number; avgResubmitsPerSubmittal: number; bySpec: any[] }>} Resubmittal metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateResubmittalMetrics('PRJ-001', ConstructionSubmittal);
 * ```
 */
export declare const calculateResubmittalMetrics: (projectId: string, ConstructionSubmittal: any) => Promise<{
    totalResubmittals: number;
    avgResubmitsPerSubmittal: number;
    bySpec: any[];
}>;
/**
 * Verifies submittal compliance with specifications.
 *
 * @param {string} submittalId - Submittal identifier
 * @param {string} specSection - Specification section
 * @returns {Promise<SubmittalComplianceCheck>} Compliance check result
 *
 * @example
 * ```typescript
 * const compliance = await verifySubmittalCompliance('sub-123', '03 30 00');
 * ```
 */
export declare const verifySubmittalCompliance: (submittalId: string, specSection: string) => Promise<SubmittalComplianceCheck>;
/**
 * Generates comprehensive submittal metrics report.
 *
 * @param {string} projectId - Project identifier
 * @param {Date} startDate - Period start date
 * @param {Date} endDate - Period end date
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @returns {Promise<SubmittalMetrics>} Submittal metrics
 *
 * @example
 * ```typescript
 * const metrics = await generateSubmittalMetrics('PRJ-001', startDate, endDate, ConstructionSubmittal);
 * ```
 */
export declare const generateSubmittalMetrics: (projectId: string, startDate: Date, endDate: Date, ConstructionSubmittal: any) => Promise<SubmittalMetrics>;
/**
 * Creates submittal dashboard view with key metrics.
 *
 * @param {string} projectId - Project identifier
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @param {Model} SubmittalWorkflow - SubmittalWorkflow model
 * @returns {Promise<SubmittalDashboard>} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await createSubmittalDashboard('PRJ-001', ConstructionSubmittal, SubmittalWorkflow);
 * ```
 */
export declare const createSubmittalDashboard: (projectId: string, ConstructionSubmittal: any, SubmittalWorkflow: any) => Promise<SubmittalDashboard>;
/**
 * Exports submittal report to PDF format.
 *
 * @param {string} projectId - Project identifier
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @param {Model} SubmittalReview - SubmittalReview model
 * @returns {Promise<string>} PDF report URL
 *
 * @example
 * ```typescript
 * const pdfUrl = await exportSubmittalReportPDF('PRJ-001', ConstructionSubmittal, SubmittalReview);
 * ```
 */
export declare const exportSubmittalReportPDF: (projectId: string, ConstructionSubmittal: any, SubmittalReview: any) => Promise<string>;
/**
 * Sends automated submittal notifications.
 *
 * @param {SubmittalNotification} notification - Notification data
 * @returns {Promise<any>} Notification record
 *
 * @example
 * ```typescript
 * await sendSubmittalNotification(notificationData);
 * ```
 */
export declare const sendSubmittalNotification: (notification: SubmittalNotification) => Promise<any>;
/**
 * Tracks submittal schedule adherence.
 *
 * @param {string} projectId - Project identifier
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @returns {Promise<any>} Schedule adherence metrics
 *
 * @example
 * ```typescript
 * const adherence = await trackSubmittalScheduleAdherence('PRJ-001', ConstructionSubmittal);
 * ```
 */
export declare const trackSubmittalScheduleAdherence: (projectId: string, ConstructionSubmittal: any) => Promise<any>;
/**
 * Generates submittal performance trends over time.
 *
 * @param {string} projectId - Project identifier
 * @param {number} months - Number of months to analyze
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @returns {Promise<any[]>} Performance trends
 *
 * @example
 * ```typescript
 * const trends = await generateSubmittalTrends('PRJ-001', 6, ConstructionSubmittal);
 * ```
 */
export declare const generateSubmittalTrends: (projectId: string, months: number, ConstructionSubmittal: any) => Promise<any[]>;
/**
 * Identifies critical path submittals requiring priority.
 *
 * @param {string} projectId - Project identifier
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @returns {Promise<any[]>} Critical path submittals
 *
 * @example
 * ```typescript
 * const critical = await identifyCriticalPathSubmittals('PRJ-001', ConstructionSubmittal);
 * ```
 */
export declare const identifyCriticalPathSubmittals: (projectId: string, ConstructionSubmittal: any) => Promise<any[]>;
/**
 * Audits submittal trail for compliance tracking.
 *
 * @param {string} submittalId - Submittal identifier
 * @param {Model} ConstructionSubmittal - ConstructionSubmittal model
 * @param {Model} SubmittalReview - SubmittalReview model
 * @returns {Promise<SubmittalAuditEntry[]>} Audit trail
 *
 * @example
 * ```typescript
 * const audit = await auditSubmittalTrail('sub-123', ConstructionSubmittal, SubmittalReview);
 * ```
 */
export declare const auditSubmittalTrail: (submittalId: string, ConstructionSubmittal: any, SubmittalReview: any) => Promise<SubmittalAuditEntry[]>;
//# sourceMappingURL=construction-submittal-management-kit.d.ts.map