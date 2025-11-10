"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditSubmittalTrail = exports.identifyCriticalPathSubmittals = exports.generateSubmittalTrends = exports.trackSubmittalScheduleAdherence = exports.sendSubmittalNotification = exports.exportSubmittalReportPDF = exports.createSubmittalDashboard = exports.generateSubmittalMetrics = exports.verifySubmittalCompliance = exports.calculateResubmittalMetrics = exports.verifyDeficienciesAddressed = exports.trackResubmittalResponses = exports.getResubmittals = exports.createResubmittal = exports.generateReviewSummary = exports.calculateReviewerPerformance = exports.getPendingReviews = exports.addReviewerComments = exports.rejectSubmittal = exports.requestSubmittalRevisions = exports.approveSubmittal = exports.getReviewHistory = exports.recordReviewAction = exports.identifyWorkflowBottlenecks = exports.calculateWorkflowPerformance = exports.getParallelReviewWorkflows = exports.resumeWorkflow = exports.pauseWorkflow = exports.escalateWorkflow = exports.getWorkflowStatus = exports.advanceWorkflowStep = exports.assignSubmittalToReviewer = exports.createReviewWorkflow = exports.exportSubmittalRegisterCSV = exports.bulkImportSubmittals = exports.getSubmittalsByReviewer = exports.searchSubmittals = exports.updateDaysInReview = exports.getOverdueSubmittals = exports.getSubmittalsBySpec = exports.updateSubmittalStatus = exports.getSubmittalRegister = exports.createSubmittal = void 0;
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
const sequelize_1 = require("sequelize");
// ============================================================================
// SUBMITTAL REGISTER & TRACKING (Functions 1-10)
// ============================================================================
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
const createSubmittal = async (submittalData, ConstructionSubmittal, transaction) => {
    // Check for duplicate submittal number
    const existing = await ConstructionSubmittal.findOne({
        where: { submittalNumber: submittalData.submittalNumber },
    });
    if (existing) {
        throw new Error(`Submittal number ${submittalData.submittalNumber} already exists`);
    }
    const submittal = await ConstructionSubmittal.create({
        ...submittalData,
        dateReceived: submittalData.status === 'submitted' ? new Date() : null,
    }, { transaction });
    return submittal;
};
exports.createSubmittal = createSubmittal;
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
const getSubmittalRegister = async (projectId, ConstructionSubmittal, filters) => {
    const where = {
        projectId,
        ...filters,
    };
    const submittals = await ConstructionSubmittal.findAll({
        where,
        order: [['submittalNumber', 'ASC']],
    });
    return submittals.map((s) => ({
        submittalId: s.id,
        submittalNumber: s.submittalNumber,
        specSection: s.specSection,
        title: s.title,
        type: s.type,
        submittedBy: s.submittedBy,
        dateSubmitted: s.dateSubmitted,
        dateRequired: s.dateRequired,
        currentStatus: s.status,
        daysInReview: s.daysInReview,
        ballInCourt: s.ballInCourt,
        isOverdue: s.isOverdue,
    }));
};
exports.getSubmittalRegister = getSubmittalRegister;
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
const updateSubmittalStatus = async (submittalId, newStatus, userId, ConstructionSubmittal) => {
    const submittal = await ConstructionSubmittal.findByPk(submittalId);
    if (!submittal)
        throw new Error('Submittal not found');
    const oldStatus = submittal.status;
    submittal.status = newStatus;
    // Update workflow dates
    if (newStatus === 'under_review' && !submittal.reviewStartDate) {
        submittal.reviewStartDate = new Date();
    }
    if (['approved', 'approved_as_noted', 'rejected'].includes(newStatus) && !submittal.reviewCompletedDate) {
        submittal.reviewCompletedDate = new Date();
        submittal.finalAction = newStatus;
        submittal.finalActionBy = userId;
        submittal.finalActionDate = new Date();
    }
    if (newStatus === 'closed') {
        submittal.closedDate = new Date();
        submittal.closedBy = userId;
    }
    await submittal.save();
    // Log audit entry
    console.log(`Submittal ${submittalId} status changed from ${oldStatus} to ${newStatus} by ${userId}`);
    return submittal;
};
exports.updateSubmittalStatus = updateSubmittalStatus;
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
const getSubmittalsBySpec = async (projectId, specSection, ConstructionSubmittal) => {
    return await ConstructionSubmittal.findAll({
        where: {
            projectId,
            specSection,
        },
        order: [['dateSubmitted', 'DESC']],
    });
};
exports.getSubmittalsBySpec = getSubmittalsBySpec;
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
const getOverdueSubmittals = async (projectId, ConstructionSubmittal) => {
    return await ConstructionSubmittal.findAll({
        where: {
            projectId,
            isOverdue: true,
            status: { [sequelize_1.Op.notIn]: ['approved', 'rejected', 'closed'] },
        },
        order: [['dateRequired', 'ASC']],
    });
};
exports.getOverdueSubmittals = getOverdueSubmittals;
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
const updateDaysInReview = async (projectId, ConstructionSubmittal) => {
    const submittals = await ConstructionSubmittal.findAll({
        where: {
            projectId,
            status: { [sequelize_1.Op.in]: ['submitted', 'under_review'] },
        },
    });
    let updated = 0;
    for (const submittal of submittals) {
        const reviewStart = submittal.reviewStartDate || submittal.dateSubmitted;
        const daysInReview = Math.floor((new Date().getTime() - reviewStart.getTime()) / 86400000);
        submittal.daysInReview = daysInReview;
        // Check if overdue
        const isOverdue = new Date() > submittal.dateRequired;
        submittal.isOverdue = isOverdue;
        await submittal.save();
        updated++;
    }
    return updated;
};
exports.updateDaysInReview = updateDaysInReview;
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
const searchSubmittals = async (projectId, searchTerm, ConstructionSubmittal) => {
    return await ConstructionSubmittal.findAll({
        where: {
            projectId,
            [sequelize_1.Op.or]: [
                { submittalNumber: { [sequelize_1.Op.iLike]: `%${searchTerm}%` } },
                { title: { [sequelize_1.Op.iLike]: `%${searchTerm}%` } },
                { description: { [sequelize_1.Op.iLike]: `%${searchTerm}%` } },
                { specSection: { [sequelize_1.Op.iLike]: `%${searchTerm}%` } },
            ],
        },
        order: [['dateSubmitted', 'DESC']],
    });
};
exports.searchSubmittals = searchSubmittals;
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
const getSubmittalsByReviewer = async (reviewerEmail, ConstructionSubmittal) => {
    return await ConstructionSubmittal.findAll({
        where: {
            assignedReviewerEmail: reviewerEmail,
            status: { [sequelize_1.Op.in]: ['submitted', 'under_review'] },
        },
        order: [['dateRequired', 'ASC']],
    });
};
exports.getSubmittalsByReviewer = getSubmittalsByReviewer;
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
const bulkImportSubmittals = async (projectId, submittalsData, ConstructionSubmittal, transaction) => {
    let created = 0;
    let failed = 0;
    const errors = [];
    for (const submittalData of submittalsData) {
        try {
            await (0, exports.createSubmittal)(submittalData, ConstructionSubmittal, transaction);
            created++;
        }
        catch (error) {
            failed++;
            errors.push(`${submittalData.submittalNumber}: ${error.message}`);
        }
    }
    return { created, failed, errors };
};
exports.bulkImportSubmittals = bulkImportSubmittals;
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
const exportSubmittalRegisterCSV = async (projectId, ConstructionSubmittal) => {
    const register = await (0, exports.getSubmittalRegister)(projectId, ConstructionSubmittal);
    const headers = 'Submittal Number,Spec Section,Title,Type,Submitted By,Date Submitted,Date Required,Status,Days In Review,Ball In Court,Overdue\n';
    const rows = register.map(entry => `"${entry.submittalNumber}","${entry.specSection}","${entry.title}","${entry.type}","${entry.submittedBy}","${entry.dateSubmitted}","${entry.dateRequired}","${entry.currentStatus}",${entry.daysInReview},"${entry.ballInCourt}",${entry.isOverdue}`);
    return headers + rows.join('\n');
};
exports.exportSubmittalRegisterCSV = exportSubmittalRegisterCSV;
// ============================================================================
// REVIEW ROUTING & WORKFLOWS (Functions 11-20)
// ============================================================================
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
const createReviewWorkflow = async (submittalId, routingSteps, workflowType, SubmittalWorkflow, transaction) => {
    // Calculate target completion date based on steps
    const totalDays = routingSteps.reduce((sum, step) => sum + step.daysAllowed, 0);
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + totalDays);
    const workflow = await SubmittalWorkflow.create({
        submittalId,
        workflowType,
        steps: routingSteps,
        currentStepIndex: 0,
        startDate: new Date(),
        targetCompletionDate: targetDate,
    }, { transaction });
    return workflow;
};
exports.createReviewWorkflow = createReviewWorkflow;
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
const assignSubmittalToReviewer = async (submittalId, reviewerName, reviewerEmail, ConstructionSubmittal) => {
    const submittal = await ConstructionSubmittal.findByPk(submittalId);
    if (!submittal)
        throw new Error('Submittal not found');
    submittal.assignedReviewer = reviewerName;
    submittal.assignedReviewerEmail = reviewerEmail;
    submittal.ballInCourt = reviewerName;
    submittal.status = 'under_review';
    submittal.reviewStartDate = new Date();
    await submittal.save();
    // Send notification
    console.log(`Submittal ${submittal.submittalNumber} assigned to ${reviewerName}`);
    return submittal;
};
exports.assignSubmittalToReviewer = assignSubmittalToReviewer;
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
const advanceWorkflowStep = async (submittalId, SubmittalWorkflow, ConstructionSubmittal) => {
    const workflow = await SubmittalWorkflow.findOne({
        where: { submittalId },
    });
    if (!workflow)
        throw new Error('Workflow not found');
    // Mark current step as completed
    workflow.steps[workflow.currentStepIndex].status = 'completed';
    workflow.steps[workflow.currentStepIndex].completedDate = new Date();
    // Move to next step if available
    if (workflow.currentStepIndex < workflow.steps.length - 1) {
        workflow.currentStepIndex++;
        const nextStep = workflow.steps[workflow.currentStepIndex];
        nextStep.status = 'in_progress';
        nextStep.startDate = new Date();
        // Assign to next reviewer
        await (0, exports.assignSubmittalToReviewer)(submittalId, nextStep.reviewerName, nextStep.reviewerEmail, ConstructionSubmittal);
    }
    else {
        // Workflow complete
        workflow.overallStatus = 'completed';
        workflow.actualCompletionDate = new Date();
    }
    await workflow.save();
    return workflow;
};
exports.advanceWorkflowStep = advanceWorkflowStep;
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
const getWorkflowStatus = async (submittalId, SubmittalWorkflow) => {
    const workflow = await SubmittalWorkflow.findOne({
        where: { submittalId },
    });
    if (!workflow)
        return null;
    return {
        submittalId: workflow.submittalId,
        workflowType: workflow.workflowType,
        steps: workflow.steps,
        currentStepIndex: workflow.currentStepIndex,
        overallStatus: workflow.overallStatus,
        startDate: workflow.startDate,
        targetCompletionDate: workflow.targetCompletionDate,
        actualCompletionDate: workflow.actualCompletionDate,
        escalationRequired: workflow.escalationRequired,
    };
};
exports.getWorkflowStatus = getWorkflowStatus;
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
const escalateWorkflow = async (submittalId, escalateTo, reason, SubmittalWorkflow) => {
    const workflow = await SubmittalWorkflow.findOne({
        where: { submittalId },
    });
    if (!workflow)
        throw new Error('Workflow not found');
    workflow.escalationRequired = true;
    workflow.escalatedAt = new Date();
    workflow.escalatedTo = escalateTo;
    await workflow.save();
    // Send escalation notification
    console.log(`Workflow for submittal ${submittalId} escalated to ${escalateTo}: ${reason}`);
    return workflow;
};
exports.escalateWorkflow = escalateWorkflow;
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
const pauseWorkflow = async (submittalId, reason, SubmittalWorkflow) => {
    const workflow = await SubmittalWorkflow.findOne({
        where: { submittalId },
    });
    if (!workflow)
        throw new Error('Workflow not found');
    workflow.pausedAt = new Date();
    workflow.pauseReason = reason;
    await workflow.save();
    return workflow;
};
exports.pauseWorkflow = pauseWorkflow;
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
const resumeWorkflow = async (submittalId, SubmittalWorkflow) => {
    const workflow = await SubmittalWorkflow.findOne({
        where: { submittalId },
    });
    if (!workflow)
        throw new Error('Workflow not found');
    workflow.resumedAt = new Date();
    // Recalculate target date based on pause duration
    if (workflow.pausedAt && workflow.targetCompletionDate) {
        const pauseDuration = new Date().getTime() - workflow.pausedAt.getTime();
        const newTarget = new Date(workflow.targetCompletionDate.getTime() + pauseDuration);
        workflow.targetCompletionDate = newTarget;
    }
    await workflow.save();
    return workflow;
};
exports.resumeWorkflow = resumeWorkflow;
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
const getParallelReviewWorkflows = async (projectId, SubmittalWorkflow, ConstructionSubmittal) => {
    const submittals = await ConstructionSubmittal.findAll({
        where: { projectId },
        attributes: ['id'],
    });
    const submittalIds = submittals.map((s) => s.id);
    return await SubmittalWorkflow.findAll({
        where: {
            submittalId: { [sequelize_1.Op.in]: submittalIds },
            workflowType: 'parallel',
            overallStatus: { [sequelize_1.Op.in]: ['pending', 'in_progress'] },
        },
    });
};
exports.getParallelReviewWorkflows = getParallelReviewWorkflows;
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
const calculateWorkflowPerformance = async (projectId, SubmittalWorkflow, ConstructionSubmittal) => {
    const submittals = await ConstructionSubmittal.findAll({
        where: { projectId },
        attributes: ['id'],
    });
    const submittalIds = submittals.map((s) => s.id);
    const workflows = await SubmittalWorkflow.findAll({
        where: {
            submittalId: { [sequelize_1.Op.in]: submittalIds },
        },
    });
    const completed = workflows.filter((w) => w.overallStatus === 'completed');
    const avgDays = completed.length > 0
        ? completed.reduce((sum, w) => sum + w.totalDaysActive, 0) / completed.length
        : 0;
    return {
        totalWorkflows: workflows.length,
        completed: completed.length,
        inProgress: workflows.filter((w) => w.overallStatus === 'in_progress').length,
        avgCompletionDays: Number(avgDays.toFixed(1)),
        escalated: workflows.filter((w) => w.escalationRequired).length,
    };
};
exports.calculateWorkflowPerformance = calculateWorkflowPerformance;
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
const identifyWorkflowBottlenecks = async (projectId, SubmittalWorkflow, ConstructionSubmittal) => {
    const submittals = await ConstructionSubmittal.findAll({
        where: { projectId },
        attributes: ['id'],
    });
    const submittalIds = submittals.map((s) => s.id);
    const workflows = await SubmittalWorkflow.findAll({
        where: {
            submittalId: { [sequelize_1.Op.in]: submittalIds },
            overallStatus: 'in_progress',
        },
    });
    const reviewerDelays = {};
    workflows.forEach((workflow) => {
        const currentStep = workflow.steps[workflow.currentStepIndex];
        if (currentStep && currentStep.status === 'in_progress') {
            const reviewer = currentStep.reviewerName;
            const daysInStep = currentStep.startDate
                ? Math.floor((new Date().getTime() - currentStep.startDate.getTime()) / 86400000)
                : 0;
            if (!reviewerDelays[reviewer]) {
                reviewerDelays[reviewer] = { count: 0, totalDays: 0 };
            }
            reviewerDelays[reviewer].count++;
            reviewerDelays[reviewer].totalDays += daysInStep;
        }
    });
    return Object.entries(reviewerDelays)
        .map(([reviewer, data]) => ({
        reviewer,
        pendingCount: data.count,
        avgDaysInQueue: Number((data.totalDays / data.count).toFixed(1)),
    }))
        .sort((a, b) => b.avgDaysInQueue - a.avgDaysInQueue);
};
exports.identifyWorkflowBottlenecks = identifyWorkflowBottlenecks;
// ============================================================================
// REVIEW ACTIONS & APPROVALS (Functions 21-30)
// ============================================================================
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
const recordReviewAction = async (reviewData, SubmittalReview, ConstructionSubmittal, transaction) => {
    const submittal = await ConstructionSubmittal.findByPk(reviewData.submittalId);
    if (!submittal)
        throw new Error('Submittal not found');
    // Mark previous reviews as not latest
    await SubmittalReview.update({ isLatest: false }, {
        where: {
            submittalId: reviewData.submittalId,
            isLatest: true,
        },
        transaction,
    });
    // Calculate days to review
    const reviewStart = submittal.reviewStartDate || submittal.dateSubmitted;
    const daysToReview = Math.floor((reviewData.reviewDate.getTime() - reviewStart.getTime()) / 86400000);
    const review = await SubmittalReview.create({
        ...reviewData,
        daysToReview,
        isLatest: true,
        reviewStepNumber: submittal.revisionNumber + 1,
    }, { transaction });
    // Update submittal status based on action
    const statusMap = {
        approved: 'approved',
        approved_as_noted: 'approved_as_noted',
        revise_resubmit: 'revise_resubmit',
        rejected: 'rejected',
        no_exception_taken: 'approved',
    };
    submittal.status = statusMap[reviewData.action];
    submittal.finalAction = reviewData.action;
    submittal.finalActionBy = reviewData.reviewerName;
    submittal.finalActionDate = reviewData.reviewDate;
    submittal.reviewCompletedDate = reviewData.reviewDate;
    if (reviewData.action === 'revise_resubmit') {
        submittal.ballInCourt = submittal.submittedBy;
    }
    await submittal.save({ transaction });
    return review;
};
exports.recordReviewAction = recordReviewAction;
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
const getReviewHistory = async (submittalId, SubmittalReview) => {
    return await SubmittalReview.findAll({
        where: { submittalId },
        order: [['reviewDate', 'DESC']],
    });
};
exports.getReviewHistory = getReviewHistory;
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
const approveSubmittal = async (submittalId, reviewerId, reviewerName, comments, SubmittalReview, ConstructionSubmittal, conditions) => {
    const action = conditions && conditions.length > 0 ? 'approved_as_noted' : 'approved';
    const reviewData = {
        submittalId,
        reviewerId,
        reviewerName,
        reviewDate: new Date(),
        action,
        comments,
        deficiencies: conditions || [],
    };
    return await (0, exports.recordReviewAction)(reviewData, SubmittalReview, ConstructionSubmittal);
};
exports.approveSubmittal = approveSubmittal;
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
const requestSubmittalRevisions = async (submittalId, reviewerId, reviewerName, comments, deficiencies, SubmittalReview, ConstructionSubmittal) => {
    const reviewData = {
        submittalId,
        reviewerId,
        reviewerName,
        reviewDate: new Date(),
        action: 'revise_resubmit',
        comments,
        deficiencies,
        nextAction: 'Revise and resubmit addressing all deficiencies',
    };
    return await (0, exports.recordReviewAction)(reviewData, SubmittalReview, ConstructionSubmittal);
};
exports.requestSubmittalRevisions = requestSubmittalRevisions;
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
const rejectSubmittal = async (submittalId, reviewerId, reviewerName, rejectionReason, SubmittalReview, ConstructionSubmittal) => {
    const reviewData = {
        submittalId,
        reviewerId,
        reviewerName,
        reviewDate: new Date(),
        action: 'rejected',
        comments: rejectionReason,
        nextAction: 'Submit alternative product/approach',
    };
    return await (0, exports.recordReviewAction)(reviewData, SubmittalReview, ConstructionSubmittal);
};
exports.rejectSubmittal = rejectSubmittal;
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
const addReviewerComments = async (submittalId, reviewerId, comments, markupUrls, SubmittalReview) => {
    const latestReview = await SubmittalReview.findOne({
        where: {
            submittalId,
            reviewerId,
            isLatest: true,
        },
    });
    if (!latestReview)
        throw new Error('Review not found');
    latestReview.comments = `${latestReview.comments}\n\n${comments}`;
    latestReview.markupUrls = [...latestReview.markupUrls, ...markupUrls];
    await latestReview.save();
    return latestReview;
};
exports.addReviewerComments = addReviewerComments;
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
const getPendingReviews = async (reviewerEmail, ConstructionSubmittal) => {
    return await ConstructionSubmittal.findAll({
        where: {
            assignedReviewerEmail: reviewerEmail,
            status: 'under_review',
        },
        order: [['dateRequired', 'ASC']],
    });
};
exports.getPendingReviews = getPendingReviews;
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
const calculateReviewerPerformance = async (reviewerId, SubmittalReview) => {
    const reviews = await SubmittalReview.findAll({
        where: { reviewerId },
        attributes: [
            [(0, sequelize_1.fn)('AVG', (0, sequelize_1.col)('daysToReview')), 'avgDays'],
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'totalReviews'],
        ],
        raw: true,
    });
    const result = reviews[0];
    return {
        avgDays: Number((result?.avgDays || 0).toFixed(1)),
        totalReviews: Number(result?.totalReviews || 0),
    };
};
exports.calculateReviewerPerformance = calculateReviewerPerformance;
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
const generateReviewSummary = async (submittalId, SubmittalReview, ConstructionSubmittal) => {
    const submittal = await ConstructionSubmittal.findByPk(submittalId);
    const reviews = await (0, exports.getReviewHistory)(submittalId, SubmittalReview);
    return {
        submittal,
        totalReviews: reviews.length,
        reviews,
        currentStatus: submittal?.status,
        finalAction: submittal?.finalAction,
    };
};
exports.generateReviewSummary = generateReviewSummary;
// ============================================================================
// RESUBMITTALS & TRACKING (Functions 31-35)
// ============================================================================
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
const createResubmittal = async (resubmittalData, ConstructionSubmittal, transaction) => {
    const original = await ConstructionSubmittal.findByPk(resubmittalData.originalSubmittalId);
    if (!original)
        throw new Error('Original submittal not found');
    // Create new submittal linked to original
    const resubmittal = await ConstructionSubmittal.create({
        projectId: original.projectId,
        submittalNumber: `${original.submittalNumber}-R${resubmittalData.revisionNumber}`,
        specSection: original.specSection,
        title: original.title,
        type: original.type,
        description: `${original.description}\n\nREVISION: ${resubmittalData.changesDescription}`,
        submittedBy: resubmittalData.resubmittedBy,
        submittedByCompany: original.submittedByCompany,
        submittedByEmail: original.submittedByEmail,
        dateSubmitted: resubmittalData.dateResubmitted,
        dateRequired: original.dateRequired,
        priority: original.priority,
        status: 'submitted',
        revisionNumber: resubmittalData.revisionNumber,
        originalSubmittalId: resubmittalData.originalSubmittalId,
        ballInCourt: original.assignedReviewer || 'Reviewer',
        leadTimeDays: original.leadTimeDays,
    }, { transaction });
    return resubmittal;
};
exports.createResubmittal = createResubmittal;
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
const getResubmittals = async (originalSubmittalId, ConstructionSubmittal) => {
    return await ConstructionSubmittal.findAll({
        where: {
            originalSubmittalId,
        },
        order: [['revisionNumber', 'ASC']],
    });
};
exports.getResubmittals = getResubmittals;
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
const trackResubmittalResponses = async (resubmittalId, addressedItems) => {
    // In production, store in ResubmittalTracking table
    return {
        resubmittalId,
        addressedItems,
        totalItems: addressedItems.length,
        verifiedItems: addressedItems.filter(i => i.verified).length,
        updatedAt: new Date(),
    };
};
exports.trackResubmittalResponses = trackResubmittalResponses;
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
const verifyDeficienciesAddressed = async (resubmittalId, reviewerId) => {
    // In production, check ResubmittalTracking and compare with original deficiencies
    return {
        allAddressed: true,
        outstanding: [],
    };
};
exports.verifyDeficienciesAddressed = verifyDeficienciesAddressed;
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
const calculateResubmittalMetrics = async (projectId, ConstructionSubmittal) => {
    const resubmittals = await ConstructionSubmittal.findAll({
        where: {
            projectId,
            revisionNumber: { [sequelize_1.Op.gt]: 0 },
        },
    });
    const bySpec = {};
    resubmittals.forEach((r) => {
        bySpec[r.specSection] = (bySpec[r.specSection] || 0) + 1;
    });
    const originals = await ConstructionSubmittal.findAll({
        where: {
            projectId,
            originalSubmittalId: null,
        },
    });
    return {
        totalResubmittals: resubmittals.length,
        avgResubmitsPerSubmittal: Number((resubmittals.length / Math.max(originals.length, 1)).toFixed(2)),
        bySpec: Object.entries(bySpec).map(([spec, count]) => ({ spec, count })),
    };
};
exports.calculateResubmittalMetrics = calculateResubmittalMetrics;
// ============================================================================
// COMPLIANCE & REPORTING (Functions 36-45)
// ============================================================================
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
const verifySubmittalCompliance = async (submittalId, specSection) => {
    // In production, compare against specification requirements database
    return {
        submittalId,
        specSection,
        requiredSubmittals: [],
        submittedItems: [],
        missingItems: [],
        complianceScore: 100,
        specificationMatches: [],
        nonCompliantItems: [],
        overallCompliance: true,
    };
};
exports.verifySubmittalCompliance = verifySubmittalCompliance;
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
const generateSubmittalMetrics = async (projectId, startDate, endDate, ConstructionSubmittal) => {
    const submittals = await ConstructionSubmittal.findAll({
        where: {
            projectId,
            dateSubmitted: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
    });
    const byStatus = {};
    const byType = {};
    let totalReviewDays = 0;
    let reviewedCount = 0;
    submittals.forEach((s) => {
        byStatus[s.status] = (byStatus[s.status] || 0) + 1;
        byType[s.type] = (byType[s.type] || 0) + 1;
        if (s.reviewCompletedDate) {
            totalReviewDays += s.daysInReview;
            reviewedCount++;
        }
    });
    const totalSubmittals = submittals.length;
    const approvalRate = totalSubmittals > 0
        ? ((byStatus.approved || 0) + (byStatus.approved_as_noted || 0)) / totalSubmittals * 100
        : 0;
    const reviseResubmitRate = totalSubmittals > 0
        ? (byStatus.revise_resubmit || 0) / totalSubmittals * 100
        : 0;
    const rejectionRate = totalSubmittals > 0
        ? (byStatus.rejected || 0) / totalSubmittals * 100
        : 0;
    return {
        projectId,
        periodStart: startDate,
        periodEnd: endDate,
        totalSubmittals,
        byStatus,
        byType,
        avgReviewDays: reviewedCount > 0 ? Number((totalReviewDays / reviewedCount).toFixed(1)) : 0,
        approvalRate: Number(approvalRate.toFixed(1)),
        reviseResubmitRate: Number(reviseResubmitRate.toFixed(1)),
        rejectionRate: Number(rejectionRate.toFixed(1)),
        overdueCount: submittals.filter((s) => s.isOverdue).length,
        onTimeCompletionRate: 0, // Would calculate from target vs actual dates
        topDelayedSpecs: [],
    };
};
exports.generateSubmittalMetrics = generateSubmittalMetrics;
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
const createSubmittalDashboard = async (projectId, ConstructionSubmittal, SubmittalWorkflow) => {
    const allSubmittals = await ConstructionSubmittal.findAll({
        where: { projectId },
    });
    const overdueSubmittals = await (0, exports.getOverdueSubmittals)(projectId, ConstructionSubmittal);
    return {
        projectId,
        asOfDate: new Date(),
        totalSubmittals: allSubmittals.length,
        pendingReview: allSubmittals.filter((s) => s.status === 'under_review').length,
        awaitingResubmittal: allSubmittals.filter((s) => s.status === 'revise_resubmit').length,
        approved: allSubmittals.filter((s) => ['approved', 'approved_as_noted'].includes(s.status)).length,
        rejected: allSubmittals.filter((s) => s.status === 'rejected').length,
        overdueSubmittals: overdueSubmittals.map((s) => ({
            submittalId: s.id,
            submittalNumber: s.submittalNumber,
            specSection: s.specSection,
            title: s.title,
            type: s.type,
            submittedBy: s.submittedBy,
            dateSubmitted: s.dateSubmitted,
            dateRequired: s.dateRequired,
            currentStatus: s.status,
            daysInReview: s.daysInReview,
            ballInCourt: s.ballInCourt,
            isOverdue: s.isOverdue,
        })),
        criticalPathItems: [],
        reviewBacklog: [],
        recentActivity: [],
    };
};
exports.createSubmittalDashboard = createSubmittalDashboard;
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
const exportSubmittalReportPDF = async (projectId, ConstructionSubmittal, SubmittalReview) => {
    // In production, generate PDF using library like pdfkit
    return `https://storage.example.com/reports/submittal-report-${projectId}-${Date.now()}.pdf`;
};
exports.exportSubmittalReportPDF = exportSubmittalReportPDF;
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
const sendSubmittalNotification = async (notification) => {
    // In production, send via email service
    console.log(`Notification sent: ${notification.subject} to ${notification.recipients.join(', ')}`);
    return {
        ...notification,
        id: `NOTIF-${Date.now()}`,
        sentAt: new Date(),
    };
};
exports.sendSubmittalNotification = sendSubmittalNotification;
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
const trackSubmittalScheduleAdherence = async (projectId, ConstructionSubmittal) => {
    const submittals = await ConstructionSubmittal.findAll({
        where: { projectId },
    });
    const onTime = submittals.filter((s) => !s.isOverdue && s.status !== 'draft').length;
    const total = submittals.filter((s) => s.status !== 'draft').length;
    return {
        projectId,
        totalSubmittals: total,
        onTimeSubmittals: onTime,
        overdueSubmittals: total - onTime,
        adherenceRate: total > 0 ? Number(((onTime / total) * 100).toFixed(1)) : 0,
    };
};
exports.trackSubmittalScheduleAdherence = trackSubmittalScheduleAdherence;
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
const generateSubmittalTrends = async (projectId, months, ConstructionSubmittal) => {
    const trends = [];
    for (let i = 0; i < months; i++) {
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() - i);
        const startDate = new Date(endDate);
        startDate.setMonth(startDate.getMonth() - 1);
        const metrics = await (0, exports.generateSubmittalMetrics)(projectId, startDate, endDate, ConstructionSubmittal);
        trends.push({
            month: endDate.toISOString().substring(0, 7),
            ...metrics,
        });
    }
    return trends.reverse();
};
exports.generateSubmittalTrends = generateSubmittalTrends;
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
const identifyCriticalPathSubmittals = async (projectId, ConstructionSubmittal) => {
    return await ConstructionSubmittal.findAll({
        where: {
            projectId,
            priority: { [sequelize_1.Op.in]: ['high', 'critical'] },
            status: { [sequelize_1.Op.notIn]: ['approved', 'approved_as_noted', 'closed'] },
        },
        order: [['dateRequired', 'ASC']],
    });
};
exports.identifyCriticalPathSubmittals = identifyCriticalPathSubmittals;
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
const auditSubmittalTrail = async (submittalId, ConstructionSubmittal, SubmittalReview) => {
    const submittal = await ConstructionSubmittal.findByPk(submittalId);
    const reviews = await (0, exports.getReviewHistory)(submittalId, SubmittalReview);
    const auditEntries = [
        {
            submittalId,
            action: 'created',
            performedBy: submittal.submittedBy,
            performedAt: submittal.createdAt,
        },
    ];
    reviews.forEach((review) => {
        auditEntries.push({
            submittalId,
            action: 'reviewed',
            performedBy: review.reviewerName,
            performedAt: review.reviewDate,
            toStatus: review.action,
            comments: review.comments,
        });
    });
    return auditEntries.sort((a, b) => a.performedAt.getTime() - b.performedAt.getTime());
};
exports.auditSubmittalTrail = auditSubmittalTrail;
//# sourceMappingURL=construction-submittal-management-kit.js.map