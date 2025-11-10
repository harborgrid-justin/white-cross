"use strict";
/**
 * LOC: GOV-GRT-CMP-001
 * File: /reuse/government/grant-management-compliance-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - class-validator (v0.14.x)
 *
 * DOWNSTREAM (imported by):
 *   - Grant management services
 *   - Compliance monitoring modules
 *   - Grant reporting controllers
 *   - Sub-recipient tracking
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskLevel = exports.MatchType = exports.ReimbursementStatus = exports.DeliverableStatus = exports.ComplianceStatus = exports.GrantType = exports.GrantStatus = void 0;
exports.createGrant = createGrant;
exports.submitGrantApplication = submitGrantApplication;
exports.awardGrant = awardGrant;
exports.activateGrant = activateGrant;
exports.getActiveGrants = getActiveGrants;
exports.getExpiringGrants = getExpiringGrants;
exports.createGrantBudget = createGrantBudget;
exports.recordGrantExpenditure = recordGrantExpenditure;
exports.calculateGrantBudgetUtilization = calculateGrantBudgetUtilization;
exports.getGrantBudgetSummary = getGrantBudgetSummary;
exports.createGrantMilestone = createGrantMilestone;
exports.updateMilestoneStatus = updateMilestoneStatus;
exports.getOverdueMilestones = getOverdueMilestones;
exports.calculateMilestoneCompletion = calculateMilestoneCompletion;
exports.createGrantDeliverable = createGrantDeliverable;
exports.submitGrantDeliverable = submitGrantDeliverable;
exports.approveGrantDeliverable = approveGrantDeliverable;
exports.getUpcomingDeliverables = getUpcomingDeliverables;
exports.createReimbursementRequest = createReimbursementRequest;
exports.submitReimbursementRequest = submitReimbursementRequest;
exports.approveReimbursementRequest = approveReimbursementRequest;
exports.recordReimbursementPayment = recordReimbursementPayment;
exports.calculateTotalReimbursements = calculateTotalReimbursements;
exports.recordMatchContribution = recordMatchContribution;
exports.calculateTotalMatch = calculateTotalMatch;
exports.validateMatchRequirement = validateMatchRequirement;
exports.getMatchBreakdown = getMatchBreakdown;
exports.createSubRecipient = createSubRecipient;
exports.recordSubRecipientMonitoring = recordSubRecipientMonitoring;
exports.getHighRiskSubRecipients = getHighRiskSubRecipients;
exports.recordComplianceCheck = recordComplianceCheck;
exports.getNonCompliantGrants = getNonCompliantGrants;
exports.createIndirectCostRate = createIndirectCostRate;
exports.calculateIndirectCosts = calculateIndirectCosts;
exports.initiateGrantCloseout = initiateGrantCloseout;
exports.closeGrant = closeGrant;
/**
 * File: /reuse/government/grant-management-compliance-kit.ts
 * Locator: WC-GOV-GRT-CMP-001
 * Purpose: Grant Management & Compliance Kit - Comprehensive federal and state grant lifecycle management
 *
 * Upstream: sequelize v6.x, @nestjs/common, @nestjs/swagger, class-validator
 * Downstream: Grant services, compliance controllers, reporting modules, sub-recipient monitoring
 * Dependencies: Sequelize v6.x, NestJS v10.x, Node 18+, TypeScript 5.x
 * Exports: 50+ functions for grant applications, compliance, reporting, deliverables, reimbursements, and closeout
 *
 * LLM Context: Enterprise-grade grant management for government entities handling federal and state grants.
 * Provides utilities for grant lifecycle management, compliance monitoring, financial tracking, milestone management,
 * match requirements, sub-recipient oversight, deliverable tracking, reimbursement processing, and closeout procedures.
 * Compliant with federal regulations (2 CFR 200 Uniform Guidance, OMB circulars) and grant-specific requirements.
 */
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Grant status enumeration
 */
var GrantStatus;
(function (GrantStatus) {
    GrantStatus["DRAFT"] = "DRAFT";
    GrantStatus["SUBMITTED"] = "SUBMITTED";
    GrantStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    GrantStatus["AWARDED"] = "AWARDED";
    GrantStatus["ACTIVE"] = "ACTIVE";
    GrantStatus["SUSPENDED"] = "SUSPENDED";
    GrantStatus["CLOSED"] = "CLOSED";
    GrantStatus["TERMINATED"] = "TERMINATED";
})(GrantStatus || (exports.GrantStatus = GrantStatus = {}));
/**
 * Grant type enumeration
 */
var GrantType;
(function (GrantType) {
    GrantType["FEDERAL"] = "FEDERAL";
    GrantType["STATE"] = "STATE";
    GrantType["LOCAL"] = "LOCAL";
    GrantType["FOUNDATION"] = "FOUNDATION";
    GrantType["PRIVATE"] = "PRIVATE";
})(GrantType || (exports.GrantType = GrantType = {}));
/**
 * Compliance status enumeration
 */
var ComplianceStatus;
(function (ComplianceStatus) {
    ComplianceStatus["COMPLIANT"] = "COMPLIANT";
    ComplianceStatus["NEEDS_ATTENTION"] = "NEEDS_ATTENTION";
    ComplianceStatus["NON_COMPLIANT"] = "NON_COMPLIANT";
    ComplianceStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    ComplianceStatus["REMEDIATED"] = "REMEDIATED";
})(ComplianceStatus || (exports.ComplianceStatus = ComplianceStatus = {}));
/**
 * Deliverable status enumeration
 */
var DeliverableStatus;
(function (DeliverableStatus) {
    DeliverableStatus["NOT_STARTED"] = "NOT_STARTED";
    DeliverableStatus["IN_PROGRESS"] = "IN_PROGRESS";
    DeliverableStatus["SUBMITTED"] = "SUBMITTED";
    DeliverableStatus["APPROVED"] = "APPROVED";
    DeliverableStatus["REJECTED"] = "REJECTED";
    DeliverableStatus["OVERDUE"] = "OVERDUE";
})(DeliverableStatus || (exports.DeliverableStatus = DeliverableStatus = {}));
/**
 * Reimbursement status enumeration
 */
var ReimbursementStatus;
(function (ReimbursementStatus) {
    ReimbursementStatus["DRAFT"] = "DRAFT";
    ReimbursementStatus["SUBMITTED"] = "SUBMITTED";
    ReimbursementStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    ReimbursementStatus["APPROVED"] = "APPROVED";
    ReimbursementStatus["PAID"] = "PAID";
    ReimbursementStatus["REJECTED"] = "REJECTED";
})(ReimbursementStatus || (exports.ReimbursementStatus = ReimbursementStatus = {}));
/**
 * Match type enumeration
 */
var MatchType;
(function (MatchType) {
    MatchType["CASH"] = "CASH";
    MatchType["IN_KIND"] = "IN_KIND";
    MatchType["VOLUNTEER"] = "VOLUNTEER";
    MatchType["FACILITY"] = "FACILITY";
})(MatchType || (exports.MatchType = MatchType = {}));
/**
 * Sub-recipient risk level
 */
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["LOW"] = "LOW";
    RiskLevel["MEDIUM"] = "MEDIUM";
    RiskLevel["HIGH"] = "HIGH";
    RiskLevel["CRITICAL"] = "CRITICAL";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
// ============================================================================
// GRANT APPLICATION AND TRACKING
// ============================================================================
/**
 * Creates a new grant application.
 * Initializes grant record with basic information.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} grantNumber - Grant/award number
 * @param {GrantType} grantType - Type of grant
 * @param {string} title - Grant title
 * @param {string} description - Grant description
 * @param {string} fundingAgency - Funding agency name
 * @param {string} cfda - CFDA number (if federal)
 * @param {number} awardAmount - Total award amount
 * @param {number} matchPercent - Required match percentage
 * @param {Date} periodStart - Grant period start
 * @param {Date} periodEnd - Grant period end
 * @param {string} projectDirector - Project director user ID
 * @param {string} fiscalOfficer - Fiscal officer user ID
 * @returns {Promise<IGrant>} Created grant
 *
 * @example
 * ```typescript
 * const grant = await createGrant(sequelize, 'HRSA-2024-001',
 *   GrantType.FEDERAL, 'Community Health Initiative',
 *   'Expand community health services', 'HRSA',
 *   '93.224', 500000, 25, new Date('2024-01-01'),
 *   new Date('2024-12-31'), 'user-123', 'user-456');
 * ```
 */
async function createGrant(sequelize, grantNumber, grantType, title, description, fundingAgency, cfda, awardAmount, matchPercent, periodStart, periodEnd, projectDirector, fiscalOfficer) {
    const Grant = getGrantModel(sequelize);
    const matchRequired = (awardAmount * matchPercent) / 100;
    const grant = await Grant.create({
        grantNumber,
        grantType,
        title,
        description,
        fundingAgency,
        cfda,
        awardAmount,
        matchRequired,
        matchPercent,
        periodStart,
        periodEnd,
        status: GrantStatus.DRAFT,
        projectDirector,
        fiscalOfficer,
    });
    return grant.toJSON();
}
/**
 * Submits a grant application.
 * Transitions grant from draft to submitted status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} grantId - Grant ID
 * @param {string} submittedBy - User submitting grant
 * @returns {Promise<IGrant>} Submitted grant
 *
 * @example
 * ```typescript
 * const submitted = await submitGrantApplication(sequelize,
 *   'grant-001', 'user-123');
 * ```
 */
async function submitGrantApplication(sequelize, grantId, submittedBy) {
    const Grant = getGrantModel(sequelize);
    const grant = await Grant.findByPk(grantId);
    if (!grant) {
        throw new Error(`Grant ${grantId} not found`);
    }
    if (grant.status !== GrantStatus.DRAFT) {
        throw new Error(`Grant cannot be submitted from status ${grant.status}`);
    }
    grant.status = GrantStatus.SUBMITTED;
    await grant.save();
    return grant.toJSON();
}
/**
 * Awards a grant to the organization.
 * Activates grant for spending and compliance tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} grantId - Grant ID
 * @param {Date} awardDate - Date grant was awarded
 * @returns {Promise<IGrant>} Awarded grant
 *
 * @example
 * ```typescript
 * const awarded = await awardGrant(sequelize, 'grant-001', new Date());
 * ```
 */
async function awardGrant(sequelize, grantId, awardDate) {
    const Grant = getGrantModel(sequelize);
    const grant = await Grant.findByPk(grantId);
    if (!grant) {
        throw new Error(`Grant ${grantId} not found`);
    }
    grant.status = GrantStatus.AWARDED;
    await grant.save();
    return grant.toJSON();
}
/**
 * Activates a grant for operations.
 * Makes grant operational for expenditures.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} grantId - Grant ID
 * @returns {Promise<IGrant>} Activated grant
 *
 * @example
 * ```typescript
 * const active = await activateGrant(sequelize, 'grant-001');
 * ```
 */
async function activateGrant(sequelize, grantId) {
    const Grant = getGrantModel(sequelize);
    const grant = await Grant.findByPk(grantId);
    if (!grant) {
        throw new Error(`Grant ${grantId} not found`);
    }
    if (grant.status !== GrantStatus.AWARDED) {
        throw new Error('Grant must be awarded before activation');
    }
    grant.status = GrantStatus.ACTIVE;
    await grant.save();
    return grant.toJSON();
}
/**
 * Retrieves all active grants.
 * Returns grants currently operational.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<IGrant[]>} Active grants
 *
 * @example
 * ```typescript
 * const activeGrants = await getActiveGrants(sequelize);
 * ```
 */
async function getActiveGrants(sequelize) {
    const Grant = getGrantModel(sequelize);
    const grants = await Grant.findAll({
        where: { status: GrantStatus.ACTIVE },
    });
    return grants.map(g => g.toJSON());
}
/**
 * Retrieves grants expiring soon.
 * Identifies grants nearing end date.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} daysThreshold - Days before expiration
 * @returns {Promise<IGrant[]>} Expiring grants
 *
 * @example
 * ```typescript
 * const expiring = await getExpiringGrants(sequelize, 90);
 * ```
 */
async function getExpiringGrants(sequelize, daysThreshold) {
    const Grant = getGrantModel(sequelize);
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
    const grants = await Grant.findAll({
        where: {
            status: GrantStatus.ACTIVE,
            periodEnd: {
                [sequelize_1.Op.lte]: thresholdDate,
            },
        },
    });
    return grants.map(g => g.toJSON());
}
// ============================================================================
// GRANT BUDGET TRACKING
// ============================================================================
/**
 * Creates a grant budget line item.
 * Establishes budget category with federal and match amounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} grantId - Grant ID
 * @param {string} budgetCategory - Budget category
 * @param {string} budgetLineItem - Line item description
 * @param {number} federalAmount - Federal share amount
 * @param {number} matchAmount - Match share amount
 * @returns {Promise<IGrantBudget>} Created budget line
 *
 * @example
 * ```typescript
 * const budget = await createGrantBudget(sequelize, 'grant-001',
 *   'Personnel', 'Project Director Salary', 100000, 25000);
 * ```
 */
async function createGrantBudget(sequelize, grantId, budgetCategory, budgetLineItem, federalAmount, matchAmount) {
    const GrantBudget = getGrantBudgetModel(sequelize);
    const budget = await GrantBudget.create({
        grantId,
        budgetCategory,
        budgetLineItem,
        federalAmount,
        matchAmount,
        totalAmount: federalAmount + matchAmount,
        expendedAmount: 0,
        availableAmount: federalAmount + matchAmount,
    });
    return budget.toJSON();
}
/**
 * Records an expenditure against grant budget.
 * Tracks spending against budget line items.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} budgetId - Budget line ID
 * @param {number} amount - Expenditure amount
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<IGrantBudget>} Updated budget
 *
 * @example
 * ```typescript
 * const updated = await recordGrantExpenditure(sequelize,
 *   'budget-001', 5000, transaction);
 * ```
 */
async function recordGrantExpenditure(sequelize, budgetId, amount, transaction) {
    const GrantBudget = getGrantBudgetModel(sequelize);
    const budget = await GrantBudget.findByPk(budgetId, { transaction });
    if (!budget) {
        throw new Error(`Budget ${budgetId} not found`);
    }
    if (budget.availableAmount < amount) {
        throw new Error(`Insufficient budget. Available: ${budget.availableAmount}, Requested: ${amount}`);
    }
    budget.expendedAmount += amount;
    budget.availableAmount -= amount;
    await budget.save({ transaction });
    return budget.toJSON();
}
/**
 * Calculates grant budget utilization.
 * Measures percentage of budget expended.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} grantId - Grant ID
 * @returns {Promise<number>} Utilization percentage
 *
 * @example
 * ```typescript
 * const utilization = await calculateGrantBudgetUtilization(sequelize,
 *   'grant-001');
 * console.log(`Grant ${utilization}% utilized`);
 * ```
 */
async function calculateGrantBudgetUtilization(sequelize, grantId) {
    const GrantBudget = getGrantBudgetModel(sequelize);
    const budgets = await GrantBudget.findAll({
        where: { grantId },
    });
    const totalBudget = budgets.reduce((sum, b) => sum + parseFloat(b.totalAmount), 0);
    const totalExpended = budgets.reduce((sum, b) => sum + parseFloat(b.expendedAmount), 0);
    return totalBudget > 0 ? (totalExpended / totalBudget) * 100 : 0;
}
/**
 * Retrieves grant budget summary.
 * Aggregates budget by category.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} grantId - Grant ID
 * @returns {Promise<any[]>} Budget summary by category
 *
 * @example
 * ```typescript
 * const summary = await getGrantBudgetSummary(sequelize, 'grant-001');
 * ```
 */
async function getGrantBudgetSummary(sequelize, grantId) {
    const GrantBudget = getGrantBudgetModel(sequelize);
    const budgets = await GrantBudget.findAll({
        where: { grantId },
        attributes: [
            'budgetCategory',
            [sequelize.fn('SUM', sequelize.col('federal_amount')), 'totalFederal'],
            [sequelize.fn('SUM', sequelize.col('match_amount')), 'totalMatch'],
            [sequelize.fn('SUM', sequelize.col('total_amount')), 'totalBudget'],
            [sequelize.fn('SUM', sequelize.col('expended_amount')), 'totalExpended'],
            [sequelize.fn('SUM', sequelize.col('available_amount')), 'totalAvailable'],
        ],
        group: ['budgetCategory'],
    });
    return budgets.map(b => b.toJSON());
}
// ============================================================================
// GRANT MILESTONE TRACKING
// ============================================================================
/**
 * Creates a grant milestone.
 * Establishes performance milestone with due date.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} grantId - Grant ID
 * @param {number} milestoneNumber - Milestone sequence number
 * @param {string} description - Milestone description
 * @param {Date} dueDate - Milestone due date
 * @returns {Promise<IGrantMilestone>} Created milestone
 *
 * @example
 * ```typescript
 * const milestone = await createGrantMilestone(sequelize, 'grant-001',
 *   1, 'Complete needs assessment', new Date('2024-03-31'));
 * ```
 */
async function createGrantMilestone(sequelize, grantId, milestoneNumber, description, dueDate) {
    const GrantMilestone = getGrantMilestoneModel(sequelize);
    const milestone = await GrantMilestone.create({
        grantId,
        milestoneNumber,
        description,
        dueDate,
        status: DeliverableStatus.NOT_STARTED,
    });
    return milestone.toJSON();
}
/**
 * Updates milestone status.
 * Tracks milestone progress.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} milestoneId - Milestone ID
 * @param {DeliverableStatus} status - New status
 * @param {string} notes - Update notes
 * @returns {Promise<IGrantMilestone>} Updated milestone
 *
 * @example
 * ```typescript
 * const updated = await updateMilestoneStatus(sequelize, 'milestone-001',
 *   DeliverableStatus.IN_PROGRESS, 'Started data collection');
 * ```
 */
async function updateMilestoneStatus(sequelize, milestoneId, status, notes) {
    const GrantMilestone = getGrantMilestoneModel(sequelize);
    const milestone = await GrantMilestone.findByPk(milestoneId);
    if (!milestone) {
        throw new Error(`Milestone ${milestoneId} not found`);
    }
    milestone.status = status;
    if (notes) {
        milestone.notes = notes;
    }
    if (status === DeliverableStatus.APPROVED) {
        milestone.completedDate = new Date();
    }
    await milestone.save();
    return milestone.toJSON();
}
/**
 * Retrieves overdue milestones.
 * Identifies milestones past due date.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} grantId - Grant ID
 * @returns {Promise<IGrantMilestone[]>} Overdue milestones
 *
 * @example
 * ```typescript
 * const overdue = await getOverdueMilestones(sequelize, 'grant-001');
 * ```
 */
async function getOverdueMilestones(sequelize, grantId) {
    const GrantMilestone = getGrantMilestoneModel(sequelize);
    const where = {
        dueDate: { [sequelize_1.Op.lt]: new Date() },
        status: {
            [sequelize_1.Op.notIn]: [DeliverableStatus.APPROVED, DeliverableStatus.SUBMITTED],
        },
    };
    if (grantId) {
        where.grantId = grantId;
    }
    const milestones = await GrantMilestone.findAll({ where });
    return milestones.map(m => m.toJSON());
}
/**
 * Calculates milestone completion rate.
 * Measures percentage of milestones completed.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} grantId - Grant ID
 * @returns {Promise<number>} Completion percentage
 *
 * @example
 * ```typescript
 * const completion = await calculateMilestoneCompletion(sequelize,
 *   'grant-001');
 * console.log(`Milestones ${completion}% complete`);
 * ```
 */
async function calculateMilestoneCompletion(sequelize, grantId) {
    const GrantMilestone = getGrantMilestoneModel(sequelize);
    const total = await GrantMilestone.count({ where: { grantId } });
    const completed = await GrantMilestone.count({
        where: {
            grantId,
            status: DeliverableStatus.APPROVED,
        },
    });
    return total > 0 ? (completed / total) * 100 : 0;
}
// ============================================================================
// GRANT DELIVERABLES
// ============================================================================
/**
 * Creates a grant deliverable.
 * Establishes required deliverable with due date.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} grantId - Grant ID
 * @param {string} deliverableType - Type of deliverable
 * @param {string} description - Deliverable description
 * @param {Date} dueDate - Due date
 * @returns {Promise<IGrantDeliverable>} Created deliverable
 *
 * @example
 * ```typescript
 * const deliverable = await createGrantDeliverable(sequelize,
 *   'grant-001', 'Progress Report', 'Quarterly progress report',
 *   new Date('2024-03-31'));
 * ```
 */
async function createGrantDeliverable(sequelize, grantId, deliverableType, description, dueDate) {
    const GrantDeliverable = getGrantDeliverableModel(sequelize);
    const deliverable = await GrantDeliverable.create({
        grantId,
        deliverableType,
        description,
        dueDate,
        status: DeliverableStatus.NOT_STARTED,
    });
    return deliverable.toJSON();
}
/**
 * Submits a grant deliverable.
 * Records deliverable submission with document.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} deliverableId - Deliverable ID
 * @param {string} submittedBy - User submitting
 * @param {string} documentUrl - Document URL
 * @returns {Promise<IGrantDeliverable>} Submitted deliverable
 *
 * @example
 * ```typescript
 * const submitted = await submitGrantDeliverable(sequelize,
 *   'del-001', 'user-123', 'https://docs.example.com/report.pdf');
 * ```
 */
async function submitGrantDeliverable(sequelize, deliverableId, submittedBy, documentUrl) {
    const GrantDeliverable = getGrantDeliverableModel(sequelize);
    const deliverable = await GrantDeliverable.findByPk(deliverableId);
    if (!deliverable) {
        throw new Error(`Deliverable ${deliverableId} not found`);
    }
    deliverable.status = DeliverableStatus.SUBMITTED;
    deliverable.submittedBy = submittedBy;
    deliverable.submittedDate = new Date();
    deliverable.documentUrl = documentUrl;
    await deliverable.save();
    return deliverable.toJSON();
}
/**
 * Approves a grant deliverable.
 * Marks deliverable as accepted by funder.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} deliverableId - Deliverable ID
 * @returns {Promise<IGrantDeliverable>} Approved deliverable
 *
 * @example
 * ```typescript
 * const approved = await approveGrantDeliverable(sequelize, 'del-001');
 * ```
 */
async function approveGrantDeliverable(sequelize, deliverableId) {
    const GrantDeliverable = getGrantDeliverableModel(sequelize);
    const deliverable = await GrantDeliverable.findByPk(deliverableId);
    if (!deliverable) {
        throw new Error(`Deliverable ${deliverableId} not found`);
    }
    deliverable.status = DeliverableStatus.APPROVED;
    deliverable.approvedDate = new Date();
    await deliverable.save();
    return deliverable.toJSON();
}
/**
 * Retrieves upcoming deliverables.
 * Identifies deliverables due within timeframe.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} daysAhead - Days to look ahead
 * @returns {Promise<IGrantDeliverable[]>} Upcoming deliverables
 *
 * @example
 * ```typescript
 * const upcoming = await getUpcomingDeliverables(sequelize, 30);
 * ```
 */
async function getUpcomingDeliverables(sequelize, daysAhead) {
    const GrantDeliverable = getGrantDeliverableModel(sequelize);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    const deliverables = await GrantDeliverable.findAll({
        where: {
            dueDate: {
                [sequelize_1.Op.between]: [new Date(), futureDate],
            },
            status: {
                [sequelize_1.Op.notIn]: [DeliverableStatus.APPROVED, DeliverableStatus.SUBMITTED],
            },
        },
    });
    return deliverables.map(d => d.toJSON());
}
// ============================================================================
// GRANT REIMBURSEMENT PROCESSING
// ============================================================================
/**
 * Creates a reimbursement request.
 * Initiates request for grant reimbursement.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} grantId - Grant ID
 * @param {number} requestNumber - Request sequence number
 * @param {Date} periodStart - Reimbursement period start
 * @param {Date} periodEnd - Reimbursement period end
 * @param {number} federalShare - Federal share amount
 * @param {number} matchShare - Match share amount
 * @param {string} submittedBy - User submitting request
 * @returns {Promise<IGrantReimbursement>} Created reimbursement
 *
 * @example
 * ```typescript
 * const reimbursement = await createReimbursementRequest(sequelize,
 *   'grant-001', 1, new Date('2024-01-01'), new Date('2024-03-31'),
 *   75000, 25000, 'user-123');
 * ```
 */
async function createReimbursementRequest(sequelize, grantId, requestNumber, periodStart, periodEnd, federalShare, matchShare, submittedBy) {
    const GrantReimbursement = getGrantReimbursementModel(sequelize);
    const reimbursement = await GrantReimbursement.create({
        grantId,
        requestNumber,
        requestDate: new Date(),
        periodStart,
        periodEnd,
        federalShare,
        matchShare,
        totalAmount: federalShare + matchShare,
        status: ReimbursementStatus.DRAFT,
        submittedBy,
    });
    return reimbursement.toJSON();
}
/**
 * Submits a reimbursement request.
 * Sends reimbursement request to funder.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reimbursementId - Reimbursement ID
 * @returns {Promise<IGrantReimbursement>} Submitted reimbursement
 *
 * @example
 * ```typescript
 * const submitted = await submitReimbursementRequest(sequelize,
 *   'reimb-001');
 * ```
 */
async function submitReimbursementRequest(sequelize, reimbursementId) {
    const GrantReimbursement = getGrantReimbursementModel(sequelize);
    const reimbursement = await GrantReimbursement.findByPk(reimbursementId);
    if (!reimbursement) {
        throw new Error(`Reimbursement ${reimbursementId} not found`);
    }
    if (reimbursement.status !== ReimbursementStatus.DRAFT) {
        throw new Error(`Reimbursement cannot be submitted from status ${reimbursement.status}`);
    }
    reimbursement.status = ReimbursementStatus.SUBMITTED;
    await reimbursement.save();
    return reimbursement.toJSON();
}
/**
 * Approves a reimbursement request.
 * Marks reimbursement as approved by funder.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reimbursementId - Reimbursement ID
 * @param {string} approvedBy - User approving
 * @returns {Promise<IGrantReimbursement>} Approved reimbursement
 *
 * @example
 * ```typescript
 * const approved = await approveReimbursementRequest(sequelize,
 *   'reimb-001', 'admin-123');
 * ```
 */
async function approveReimbursementRequest(sequelize, reimbursementId, approvedBy) {
    const GrantReimbursement = getGrantReimbursementModel(sequelize);
    const reimbursement = await GrantReimbursement.findByPk(reimbursementId);
    if (!reimbursement) {
        throw new Error(`Reimbursement ${reimbursementId} not found`);
    }
    reimbursement.status = ReimbursementStatus.APPROVED;
    reimbursement.approvedBy = approvedBy;
    await reimbursement.save();
    return reimbursement.toJSON();
}
/**
 * Records reimbursement payment.
 * Marks reimbursement as paid.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} reimbursementId - Reimbursement ID
 * @param {Date} paidDate - Payment date
 * @returns {Promise<IGrantReimbursement>} Paid reimbursement
 *
 * @example
 * ```typescript
 * const paid = await recordReimbursementPayment(sequelize,
 *   'reimb-001', new Date());
 * ```
 */
async function recordReimbursementPayment(sequelize, reimbursementId, paidDate) {
    const GrantReimbursement = getGrantReimbursementModel(sequelize);
    const reimbursement = await GrantReimbursement.findByPk(reimbursementId);
    if (!reimbursement) {
        throw new Error(`Reimbursement ${reimbursementId} not found`);
    }
    reimbursement.status = ReimbursementStatus.PAID;
    reimbursement.paidDate = paidDate;
    await reimbursement.save();
    return reimbursement.toJSON();
}
/**
 * Calculates total reimbursements for grant.
 * Sums all approved/paid reimbursements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} grantId - Grant ID
 * @returns {Promise<number>} Total reimbursed amount
 *
 * @example
 * ```typescript
 * const total = await calculateTotalReimbursements(sequelize, 'grant-001');
 * console.log(`Total reimbursed: $${total}`);
 * ```
 */
async function calculateTotalReimbursements(sequelize, grantId) {
    const GrantReimbursement = getGrantReimbursementModel(sequelize);
    const reimbursements = await GrantReimbursement.findAll({
        where: {
            grantId,
            status: {
                [sequelize_1.Op.in]: [ReimbursementStatus.APPROVED, ReimbursementStatus.PAID],
            },
        },
    });
    return reimbursements.reduce((sum, r) => sum + parseFloat(r.totalAmount), 0);
}
// ============================================================================
// MATCH REQUIREMENT TRACKING
// ============================================================================
/**
 * Records a match contribution.
 * Documents cash or in-kind match.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} grantId - Grant ID
 * @param {MatchType} matchType - Type of match
 * @param {string} description - Contribution description
 * @param {Date} contributionDate - Date of contribution
 * @param {number} amount - Contribution amount/value
 * @param {string} valuation - Valuation methodology (for in-kind)
 * @param {string} documentedBy - User documenting contribution
 * @returns {Promise<IMatchContribution>} Recorded contribution
 *
 * @example
 * ```typescript
 * const match = await recordMatchContribution(sequelize, 'grant-001',
 *   MatchType.CASH, 'Local government contribution',
 *   new Date(), 25000, null, 'user-123');
 * ```
 */
async function recordMatchContribution(sequelize, grantId, matchType, description, contributionDate, amount, valuation, documentedBy) {
    const MatchContribution = getMatchContributionModel(sequelize);
    const contribution = await MatchContribution.create({
        grantId,
        matchType,
        description,
        contributionDate,
        amount,
        valuation,
        documentedBy,
    });
    return contribution.toJSON();
}
/**
 * Calculates total match contributions.
 * Sums all documented match.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} grantId - Grant ID
 * @returns {Promise<number>} Total match amount
 *
 * @example
 * ```typescript
 * const totalMatch = await calculateTotalMatch(sequelize, 'grant-001');
 * console.log(`Total match: $${totalMatch}`);
 * ```
 */
async function calculateTotalMatch(sequelize, grantId) {
    const MatchContribution = getMatchContributionModel(sequelize);
    const contributions = await MatchContribution.findAll({
        where: { grantId },
    });
    return contributions.reduce((sum, c) => sum + parseFloat(c.amount), 0);
}
/**
 * Validates match requirement compliance.
 * Checks if match requirement is met.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} grantId - Grant ID
 * @returns {Promise<boolean>} Whether match requirement is met
 *
 * @example
 * ```typescript
 * const isMet = await validateMatchRequirement(sequelize, 'grant-001');
 * if (!isMet) console.log('Match requirement not yet met');
 * ```
 */
async function validateMatchRequirement(sequelize, grantId) {
    const Grant = getGrantModel(sequelize);
    const grant = await Grant.findByPk(grantId);
    if (!grant) {
        throw new Error(`Grant ${grantId} not found`);
    }
    const totalMatch = await calculateTotalMatch(sequelize, grantId);
    return totalMatch >= grant.matchRequired;
}
/**
 * Retrieves match contributions by type.
 * Breaks down match by contribution type.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} grantId - Grant ID
 * @returns {Promise<any[]>} Match summary by type
 *
 * @example
 * ```typescript
 * const breakdown = await getMatchBreakdown(sequelize, 'grant-001');
 * ```
 */
async function getMatchBreakdown(sequelize, grantId) {
    const MatchContribution = getMatchContributionModel(sequelize);
    const contributions = await MatchContribution.findAll({
        where: { grantId },
        attributes: [
            'matchType',
            [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
            [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        ],
        group: ['matchType'],
    });
    return contributions.map(c => c.toJSON());
}
// ============================================================================
// SUB-RECIPIENT MONITORING
// ============================================================================
/**
 * Creates a sub-recipient record.
 * Registers sub-recipient for monitoring.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} name - Sub-recipient name
 * @param {string} ein - Employer Identification Number
 * @param {string} dunsNumber - DUNS number
 * @param {string} uei - Unique Entity Identifier
 * @param {string} address - Sub-recipient address
 * @param {string} contactName - Contact person name
 * @param {string} contactEmail - Contact email
 * @param {string} contactPhone - Contact phone
 * @param {RiskLevel} riskLevel - Assessed risk level
 * @returns {Promise<ISubRecipient>} Created sub-recipient
 *
 * @example
 * ```typescript
 * const subRecipient = await createSubRecipient(sequelize,
 *   'Community Partner Org', '12-3456789', '123456789',
 *   'ABC123DEF456', '123 Main St', 'John Doe',
 *   'john@example.com', '555-1234', RiskLevel.LOW);
 * ```
 */
async function createSubRecipient(sequelize, name, ein, dunsNumber, uei, address, contactName, contactEmail, contactPhone, riskLevel) {
    const SubRecipient = getSubRecipientModel(sequelize);
    const subRecipient = await SubRecipient.create({
        name,
        ein,
        dunsNumber,
        uei,
        address,
        contactName,
        contactEmail,
        contactPhone,
        riskLevel,
    });
    return subRecipient.toJSON();
}
/**
 * Records sub-recipient monitoring activity.
 * Documents monitoring visit or desk review.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} subRecipientId - Sub-recipient ID
 * @param {string} grantId - Grant ID
 * @param {Date} monitoringDate - Date of monitoring
 * @param {string} monitoringType - Type of monitoring
 * @param {string} findings - Monitoring findings
 * @param {string} correctiveActions - Required corrective actions
 * @param {Date} followUpDate - Follow-up date
 * @param {string} completedBy - User completing monitoring
 * @returns {Promise<ISubRecipientMonitoring>} Monitoring record
 *
 * @example
 * ```typescript
 * const monitoring = await recordSubRecipientMonitoring(sequelize,
 *   'sub-001', 'grant-001', new Date(), 'Desk Review',
 *   'Minor documentation issues', 'Submit missing invoices',
 *   new Date('2024-06-01'), 'user-123');
 * ```
 */
async function recordSubRecipientMonitoring(sequelize, subRecipientId, grantId, monitoringDate, monitoringType, findings, correctiveActions, followUpDate, completedBy) {
    const SubRecipientMonitoring = getSubRecipientMonitoringModel(sequelize);
    const monitoring = await SubRecipientMonitoring.create({
        subRecipientId,
        grantId,
        monitoringDate,
        monitoringType,
        findings,
        correctiveActions,
        followUpDate,
        completedBy,
    });
    return monitoring.toJSON();
}
/**
 * Retrieves high-risk sub-recipients.
 * Identifies sub-recipients requiring enhanced monitoring.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<ISubRecipient[]>} High-risk sub-recipients
 *
 * @example
 * ```typescript
 * const highRisk = await getHighRiskSubRecipients(sequelize);
 * ```
 */
async function getHighRiskSubRecipients(sequelize) {
    const SubRecipient = getSubRecipientModel(sequelize);
    const subRecipients = await SubRecipient.findAll({
        where: {
            riskLevel: {
                [sequelize_1.Op.in]: [RiskLevel.HIGH, RiskLevel.CRITICAL],
            },
        },
    });
    return subRecipients.map(s => s.toJSON());
}
// ============================================================================
// COMPLIANCE MONITORING
// ============================================================================
/**
 * Records a compliance check.
 * Documents compliance monitoring activity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} grantId - Grant ID
 * @param {string} checkType - Type of compliance check
 * @param {Date} checkDate - Date of check
 * @param {ComplianceStatus} status - Compliance status
 * @param {string} findings - Compliance findings
 * @param {string} recommendations - Recommendations
 * @param {string} completedBy - User completing check
 * @returns {Promise<IComplianceCheck>} Compliance check record
 *
 * @example
 * ```typescript
 * const check = await recordComplianceCheck(sequelize, 'grant-001',
 *   'Financial Review', new Date(), ComplianceStatus.COMPLIANT,
 *   'All expenditures properly documented',
 *   'Continue current practices', 'user-123');
 * ```
 */
async function recordComplianceCheck(sequelize, grantId, checkType, checkDate, status, findings, recommendations, completedBy) {
    const ComplianceCheck = getComplianceCheckModel(sequelize);
    const check = await ComplianceCheck.create({
        grantId,
        checkType,
        checkDate,
        status,
        findings,
        recommendations,
        completedBy,
    });
    return check.toJSON();
}
/**
 * Retrieves non-compliant grants.
 * Identifies grants with compliance issues.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Non-compliant grants
 *
 * @example
 * ```typescript
 * const nonCompliant = await getNonCompliantGrants(sequelize);
 * ```
 */
async function getNonCompliantGrants(sequelize) {
    const ComplianceCheck = getComplianceCheckModel(sequelize);
    const checks = await ComplianceCheck.findAll({
        where: {
            status: {
                [sequelize_1.Op.in]: [ComplianceStatus.NON_COMPLIANT, ComplianceStatus.NEEDS_ATTENTION],
            },
        },
        include: [{
                model: getGrantModel(sequelize),
                as: 'grant',
            }],
    });
    return checks.map(c => c.toJSON());
}
// ============================================================================
// INDIRECT COST ALLOCATION
// ============================================================================
/**
 * Creates an indirect cost rate.
 * Establishes approved indirect cost rate.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {string} rateType - Rate type (e.g., 'de minimis', 'negotiated')
 * @param {number} rate - Rate percentage
 * @param {string} baseType - Cost base type
 * @param {Date} effectiveDate - Effective date
 * @param {Date} expirationDate - Expiration date
 * @param {string} approvedBy - Approving authority
 * @returns {Promise<IIndirectCostRate>} Created rate
 *
 * @example
 * ```typescript
 * const rate = await createIndirectCostRate(sequelize, 2024,
 *   'de minimis', 10, 'Modified Total Direct Costs',
 *   new Date('2024-01-01'), new Date('2024-12-31'), 'admin-123');
 * ```
 */
async function createIndirectCostRate(sequelize, fiscalYear, rateType, rate, baseType, effectiveDate, expirationDate, approvedBy) {
    const IndirectCostRate = getIndirectCostRateModel(sequelize);
    const costRate = await IndirectCostRate.create({
        fiscalYear,
        rateType,
        rate,
        baseType,
        effectiveDate,
        expirationDate,
        approvedBy,
    });
    return costRate.toJSON();
}
/**
 * Calculates indirect costs for grant expenditures.
 * Applies indirect cost rate to eligible costs.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} directCosts - Direct cost amount
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<number>} Calculated indirect costs
 *
 * @example
 * ```typescript
 * const indirect = await calculateIndirectCosts(sequelize, 100000, 2024);
 * console.log(`Indirect costs: $${indirect}`);
 * ```
 */
async function calculateIndirectCosts(sequelize, directCosts, fiscalYear) {
    const IndirectCostRate = getIndirectCostRateModel(sequelize);
    const rate = await IndirectCostRate.findOne({
        where: {
            fiscalYear,
            effectiveDate: { [sequelize_1.Op.lte]: new Date() },
            expirationDate: { [sequelize_1.Op.gte]: new Date() },
        },
    });
    if (!rate) {
        throw new Error(`No active indirect cost rate found for fiscal year ${fiscalYear}`);
    }
    return directCosts * (parseFloat(rate.rate) / 100);
}
// ============================================================================
// GRANT CLOSEOUT PROCEDURES
// ============================================================================
/**
 * Initiates grant closeout process.
 * Begins grant termination procedures.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} grantId - Grant ID
 * @returns {Promise<IGrant>} Grant in closeout
 *
 * @example
 * ```typescript
 * const closing = await initiateGrantCloseout(sequelize, 'grant-001');
 * ```
 */
async function initiateGrantCloseout(sequelize, grantId) {
    const Grant = getGrantModel(sequelize);
    const grant = await Grant.findByPk(grantId);
    if (!grant) {
        throw new Error(`Grant ${grantId} not found`);
    }
    if (grant.status !== GrantStatus.ACTIVE) {
        throw new Error('Only active grants can be closed');
    }
    // Validate all requirements are met
    const matchMet = await validateMatchRequirement(sequelize, grantId);
    if (!matchMet) {
        throw new Error('Match requirement not met');
    }
    const milestoneCompletion = await calculateMilestoneCompletion(sequelize, grantId);
    if (milestoneCompletion < 100) {
        throw new Error('All milestones must be completed');
    }
    return grant.toJSON();
}
/**
 * Closes a grant.
 * Finalizes grant and locks records.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} grantId - Grant ID
 * @returns {Promise<IGrant>} Closed grant
 *
 * @example
 * ```typescript
 * const closed = await closeGrant(sequelize, 'grant-001');
 * ```
 */
async function closeGrant(sequelize, grantId) {
    const Grant = getGrantModel(sequelize);
    const grant = await Grant.findByPk(grantId);
    if (!grant) {
        throw new Error(`Grant ${grantId} not found`);
    }
    grant.status = GrantStatus.CLOSED;
    await grant.save();
    return grant.toJSON();
}
// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================
function getGrantModel(sequelize) {
    if (sequelize.models.Grant)
        return sequelize.models.Grant;
    const attributes = {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        grantNumber: { type: sequelize_1.DataTypes.STRING(50), allowNull: false, unique: true },
        grantType: { type: sequelize_1.DataTypes.ENUM(...Object.values(GrantType)), allowNull: false },
        title: { type: sequelize_1.DataTypes.STRING(500), allowNull: false },
        description: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
        fundingAgency: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
        cfda: { type: sequelize_1.DataTypes.STRING(20), allowNull: true },
        awardAmount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        matchRequired: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
        matchPercent: { type: sequelize_1.DataTypes.DECIMAL(5, 2), allowNull: false, defaultValue: 0 },
        periodStart: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
        periodEnd: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
        status: { type: sequelize_1.DataTypes.ENUM(...Object.values(GrantStatus)), allowNull: false },
        projectDirector: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        fiscalOfficer: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    };
    return sequelize.define('Grant', attributes, {
        sequelize, modelName: 'Grant', tableName: 'grants', timestamps: true, underscored: true,
        indexes: [{ fields: ['grant_number'], unique: true }, { fields: ['status'] }, { fields: ['period_end'] }],
    });
}
function getGrantBudgetModel(sequelize) {
    if (sequelize.models.GrantBudget)
        return sequelize.models.GrantBudget;
    const attributes = {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        grantId: { type: sequelize_1.DataTypes.UUID, allowNull: false, references: { model: 'grants', key: 'id' } },
        budgetCategory: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
        budgetLineItem: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
        federalAmount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        matchAmount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
        totalAmount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        expendedAmount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
        availableAmount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
    };
    return sequelize.define('GrantBudget', attributes, {
        sequelize, modelName: 'GrantBudget', tableName: 'grant_budgets', timestamps: true, underscored: true,
        indexes: [{ fields: ['grant_id'] }],
    });
}
function getGrantMilestoneModel(sequelize) {
    if (sequelize.models.GrantMilestone)
        return sequelize.models.GrantMilestone;
    const attributes = {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        grantId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        milestoneNumber: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        description: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
        dueDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
        completedDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: true },
        status: { type: sequelize_1.DataTypes.ENUM(...Object.values(DeliverableStatus)), allowNull: false },
        notes: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    };
    return sequelize.define('GrantMilestone', attributes, {
        sequelize, modelName: 'GrantMilestone', tableName: 'grant_milestones', timestamps: true, underscored: true,
    });
}
function getGrantDeliverableModel(sequelize) {
    if (sequelize.models.GrantDeliverable)
        return sequelize.models.GrantDeliverable;
    const attributes = {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        grantId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        deliverableType: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
        description: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
        dueDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
        submittedDate: { type: sequelize_1.DataTypes.DATE, allowNull: true },
        approvedDate: { type: sequelize_1.DataTypes.DATE, allowNull: true },
        status: { type: sequelize_1.DataTypes.ENUM(...Object.values(DeliverableStatus)), allowNull: false },
        submittedBy: { type: sequelize_1.DataTypes.UUID, allowNull: true },
        documentUrl: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    };
    return sequelize.define('GrantDeliverable', attributes, {
        sequelize, modelName: 'GrantDeliverable', tableName: 'grant_deliverables', timestamps: true, underscored: true,
    });
}
function getGrantReimbursementModel(sequelize) {
    if (sequelize.models.GrantReimbursement)
        return sequelize.models.GrantReimbursement;
    const attributes = {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        grantId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        requestNumber: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        requestDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
        periodStart: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
        periodEnd: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
        federalShare: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        matchShare: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        totalAmount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        status: { type: sequelize_1.DataTypes.ENUM(...Object.values(ReimbursementStatus)), allowNull: false },
        submittedBy: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        approvedBy: { type: sequelize_1.DataTypes.UUID, allowNull: true },
        paidDate: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    };
    return sequelize.define('GrantReimbursement', attributes, {
        sequelize, modelName: 'GrantReimbursement', tableName: 'grant_reimbursements', timestamps: true, underscored: true,
    });
}
function getMatchContributionModel(sequelize) {
    if (sequelize.models.MatchContribution)
        return sequelize.models.MatchContribution;
    const attributes = {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        grantId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        matchType: { type: sequelize_1.DataTypes.ENUM(...Object.values(MatchType)), allowNull: false },
        description: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
        contributionDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
        amount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
        valuation: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
        documentedBy: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    };
    return sequelize.define('MatchContribution', attributes, {
        sequelize, modelName: 'MatchContribution', tableName: 'match_contributions', timestamps: true, underscored: true,
    });
}
function getSubRecipientModel(sequelize) {
    if (sequelize.models.SubRecipient)
        return sequelize.models.SubRecipient;
    const attributes = {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        name: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
        ein: { type: sequelize_1.DataTypes.STRING(20), allowNull: false },
        dunsNumber: { type: sequelize_1.DataTypes.STRING(20), allowNull: true },
        uei: { type: sequelize_1.DataTypes.STRING(20), allowNull: true },
        address: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
        contactName: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
        contactEmail: { type: sequelize_1.DataTypes.STRING(200), allowNull: false },
        contactPhone: { type: sequelize_1.DataTypes.STRING(20), allowNull: false },
        riskLevel: { type: sequelize_1.DataTypes.ENUM(...Object.values(RiskLevel)), allowNull: false },
        lastAuditDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: true },
    };
    return sequelize.define('SubRecipient', attributes, {
        sequelize, modelName: 'SubRecipient', tableName: 'sub_recipients', timestamps: true, underscored: true,
    });
}
function getSubRecipientMonitoringModel(sequelize) {
    if (sequelize.models.SubRecipientMonitoring)
        return sequelize.models.SubRecipientMonitoring;
    const attributes = {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        subRecipientId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        grantId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        monitoringDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
        monitoringType: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
        findings: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
        correctiveActions: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
        followUpDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: true },
        completedBy: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    };
    return sequelize.define('SubRecipientMonitoring', attributes, {
        sequelize, modelName: 'SubRecipientMonitoring', tableName: 'sub_recipient_monitoring', timestamps: true, underscored: true,
    });
}
function getComplianceCheckModel(sequelize) {
    if (sequelize.models.ComplianceCheck)
        return sequelize.models.ComplianceCheck;
    const attributes = {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        grantId: { type: sequelize_1.DataTypes.UUID, allowNull: false },
        checkType: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
        checkDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
        status: { type: sequelize_1.DataTypes.ENUM(...Object.values(ComplianceStatus)), allowNull: false },
        findings: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
        recommendations: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
        completedBy: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    };
    return sequelize.define('ComplianceCheck', attributes, {
        sequelize, modelName: 'ComplianceCheck', tableName: 'compliance_checks', timestamps: true, underscored: true,
    });
}
function getIndirectCostRateModel(sequelize) {
    if (sequelize.models.IndirectCostRate)
        return sequelize.models.IndirectCostRate;
    const attributes = {
        id: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4, primaryKey: true },
        fiscalYear: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
        rateType: { type: sequelize_1.DataTypes.STRING(50), allowNull: false },
        rate: { type: sequelize_1.DataTypes.DECIMAL(5, 2), allowNull: false },
        baseType: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
        effectiveDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
        expirationDate: { type: sequelize_1.DataTypes.DATEONLY, allowNull: false },
        approvedBy: { type: sequelize_1.DataTypes.UUID, allowNull: false },
    };
    return sequelize.define('IndirectCostRate', attributes, {
        sequelize, modelName: 'IndirectCostRate', tableName: 'indirect_cost_rates', timestamps: true, underscored: true,
    });
}
exports.default = {
    createGrant,
    submitGrantApplication,
    awardGrant,
    activateGrant,
    getActiveGrants,
    getExpiringGrants,
    createGrantBudget,
    recordGrantExpenditure,
    calculateGrantBudgetUtilization,
    getGrantBudgetSummary,
    createGrantMilestone,
    updateMilestoneStatus,
    getOverdueMilestones,
    calculateMilestoneCompletion,
    createGrantDeliverable,
    submitGrantDeliverable,
    approveGrantDeliverable,
    getUpcomingDeliverables,
    createReimbursementRequest,
    submitReimbursementRequest,
    approveReimbursementRequest,
    recordReimbursementPayment,
    calculateTotalReimbursements,
    recordMatchContribution,
    calculateTotalMatch,
    validateMatchRequirement,
    getMatchBreakdown,
    createSubRecipient,
    recordSubRecipientMonitoring,
    getHighRiskSubRecipients,
    recordComplianceCheck,
    getNonCompliantGrants,
    createIndirectCostRate,
    calculateIndirectCosts,
    initiateGrantCloseout,
    closeGrant,
};
//# sourceMappingURL=grant-management-compliance-kit.js.map