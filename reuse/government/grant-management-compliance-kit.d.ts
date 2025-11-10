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
import { Sequelize, Transaction } from 'sequelize';
/**
 * Grant status enumeration
 */
export declare enum GrantStatus {
    DRAFT = "DRAFT",
    SUBMITTED = "SUBMITTED",
    UNDER_REVIEW = "UNDER_REVIEW",
    AWARDED = "AWARDED",
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
    CLOSED = "CLOSED",
    TERMINATED = "TERMINATED"
}
/**
 * Grant type enumeration
 */
export declare enum GrantType {
    FEDERAL = "FEDERAL",
    STATE = "STATE",
    LOCAL = "LOCAL",
    FOUNDATION = "FOUNDATION",
    PRIVATE = "PRIVATE"
}
/**
 * Compliance status enumeration
 */
export declare enum ComplianceStatus {
    COMPLIANT = "COMPLIANT",
    NEEDS_ATTENTION = "NEEDS_ATTENTION",
    NON_COMPLIANT = "NON_COMPLIANT",
    UNDER_REVIEW = "UNDER_REVIEW",
    REMEDIATED = "REMEDIATED"
}
/**
 * Deliverable status enumeration
 */
export declare enum DeliverableStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    SUBMITTED = "SUBMITTED",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    OVERDUE = "OVERDUE"
}
/**
 * Reimbursement status enumeration
 */
export declare enum ReimbursementStatus {
    DRAFT = "DRAFT",
    SUBMITTED = "SUBMITTED",
    UNDER_REVIEW = "UNDER_REVIEW",
    APPROVED = "APPROVED",
    PAID = "PAID",
    REJECTED = "REJECTED"
}
/**
 * Match type enumeration
 */
export declare enum MatchType {
    CASH = "CASH",
    IN_KIND = "IN_KIND",
    VOLUNTEER = "VOLUNTEER",
    FACILITY = "FACILITY"
}
/**
 * Sub-recipient risk level
 */
export declare enum RiskLevel {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
/**
 * Grant interface
 */
export interface IGrant {
    id: string;
    grantNumber: string;
    grantType: GrantType;
    title: string;
    description: string;
    fundingAgency: string;
    cfda: string;
    awardAmount: number;
    matchRequired: number;
    matchPercent: number;
    periodStart: Date;
    periodEnd: Date;
    status: GrantStatus;
    projectDirector: string;
    fiscalOfficer: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Grant budget interface
 */
export interface IGrantBudget {
    id: string;
    grantId: string;
    budgetCategory: string;
    budgetLineItem: string;
    federalAmount: number;
    matchAmount: number;
    totalAmount: number;
    expendedAmount: number;
    availableAmount: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Grant milestone interface
 */
export interface IGrantMilestone {
    id: string;
    grantId: string;
    milestoneNumber: number;
    description: string;
    dueDate: Date;
    completedDate?: Date;
    status: DeliverableStatus;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Grant deliverable interface
 */
export interface IGrantDeliverable {
    id: string;
    grantId: string;
    deliverableType: string;
    description: string;
    dueDate: Date;
    submittedDate?: Date;
    approvedDate?: Date;
    status: DeliverableStatus;
    submittedBy?: string;
    documentUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Grant reimbursement interface
 */
export interface IGrantReimbursement {
    id: string;
    grantId: string;
    requestNumber: number;
    requestDate: Date;
    periodStart: Date;
    periodEnd: Date;
    federalShare: number;
    matchShare: number;
    totalAmount: number;
    status: ReimbursementStatus;
    submittedBy: string;
    approvedBy?: string;
    paidDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Match contribution interface
 */
export interface IMatchContribution {
    id: string;
    grantId: string;
    matchType: MatchType;
    description: string;
    contributionDate: Date;
    amount: number;
    valuation?: string;
    documentedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Sub-recipient interface
 */
export interface ISubRecipient {
    id: string;
    name: string;
    ein: string;
    dunsNumber?: string;
    uei?: string;
    address: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    riskLevel: RiskLevel;
    lastAuditDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Sub-recipient monitoring interface
 */
export interface ISubRecipientMonitoring {
    id: string;
    subRecipientId: string;
    grantId: string;
    monitoringDate: Date;
    monitoringType: string;
    findings?: string;
    correctiveActions?: string;
    followUpDate?: Date;
    completedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Compliance check interface
 */
export interface IComplianceCheck {
    id: string;
    grantId: string;
    checkType: string;
    checkDate: Date;
    status: ComplianceStatus;
    findings?: string;
    recommendations?: string;
    completedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Indirect cost rate interface
 */
export interface IIndirectCostRate {
    id: string;
    fiscalYear: number;
    rateType: string;
    rate: number;
    baseType: string;
    effectiveDate: Date;
    expirationDate: Date;
    approvedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
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
export declare function createGrant(sequelize: Sequelize, grantNumber: string, grantType: GrantType, title: string, description: string, fundingAgency: string, cfda: string, awardAmount: number, matchPercent: number, periodStart: Date, periodEnd: Date, projectDirector: string, fiscalOfficer: string): Promise<IGrant>;
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
export declare function submitGrantApplication(sequelize: Sequelize, grantId: string, submittedBy: string): Promise<IGrant>;
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
export declare function awardGrant(sequelize: Sequelize, grantId: string, awardDate: Date): Promise<IGrant>;
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
export declare function activateGrant(sequelize: Sequelize, grantId: string): Promise<IGrant>;
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
export declare function getActiveGrants(sequelize: Sequelize): Promise<IGrant[]>;
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
export declare function getExpiringGrants(sequelize: Sequelize, daysThreshold: number): Promise<IGrant[]>;
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
export declare function createGrantBudget(sequelize: Sequelize, grantId: string, budgetCategory: string, budgetLineItem: string, federalAmount: number, matchAmount: number): Promise<IGrantBudget>;
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
export declare function recordGrantExpenditure(sequelize: Sequelize, budgetId: string, amount: number, transaction?: Transaction): Promise<IGrantBudget>;
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
export declare function calculateGrantBudgetUtilization(sequelize: Sequelize, grantId: string): Promise<number>;
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
export declare function getGrantBudgetSummary(sequelize: Sequelize, grantId: string): Promise<any[]>;
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
export declare function createGrantMilestone(sequelize: Sequelize, grantId: string, milestoneNumber: number, description: string, dueDate: Date): Promise<IGrantMilestone>;
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
export declare function updateMilestoneStatus(sequelize: Sequelize, milestoneId: string, status: DeliverableStatus, notes?: string): Promise<IGrantMilestone>;
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
export declare function getOverdueMilestones(sequelize: Sequelize, grantId?: string): Promise<IGrantMilestone[]>;
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
export declare function calculateMilestoneCompletion(sequelize: Sequelize, grantId: string): Promise<number>;
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
export declare function createGrantDeliverable(sequelize: Sequelize, grantId: string, deliverableType: string, description: string, dueDate: Date): Promise<IGrantDeliverable>;
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
export declare function submitGrantDeliverable(sequelize: Sequelize, deliverableId: string, submittedBy: string, documentUrl: string): Promise<IGrantDeliverable>;
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
export declare function approveGrantDeliverable(sequelize: Sequelize, deliverableId: string): Promise<IGrantDeliverable>;
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
export declare function getUpcomingDeliverables(sequelize: Sequelize, daysAhead: number): Promise<IGrantDeliverable[]>;
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
export declare function createReimbursementRequest(sequelize: Sequelize, grantId: string, requestNumber: number, periodStart: Date, periodEnd: Date, federalShare: number, matchShare: number, submittedBy: string): Promise<IGrantReimbursement>;
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
export declare function submitReimbursementRequest(sequelize: Sequelize, reimbursementId: string): Promise<IGrantReimbursement>;
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
export declare function approveReimbursementRequest(sequelize: Sequelize, reimbursementId: string, approvedBy: string): Promise<IGrantReimbursement>;
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
export declare function recordReimbursementPayment(sequelize: Sequelize, reimbursementId: string, paidDate: Date): Promise<IGrantReimbursement>;
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
export declare function calculateTotalReimbursements(sequelize: Sequelize, grantId: string): Promise<number>;
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
export declare function recordMatchContribution(sequelize: Sequelize, grantId: string, matchType: MatchType, description: string, contributionDate: Date, amount: number, valuation: string | null, documentedBy: string): Promise<IMatchContribution>;
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
export declare function calculateTotalMatch(sequelize: Sequelize, grantId: string): Promise<number>;
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
export declare function validateMatchRequirement(sequelize: Sequelize, grantId: string): Promise<boolean>;
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
export declare function getMatchBreakdown(sequelize: Sequelize, grantId: string): Promise<any[]>;
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
export declare function createSubRecipient(sequelize: Sequelize, name: string, ein: string, dunsNumber: string | null, uei: string | null, address: string, contactName: string, contactEmail: string, contactPhone: string, riskLevel: RiskLevel): Promise<ISubRecipient>;
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
export declare function recordSubRecipientMonitoring(sequelize: Sequelize, subRecipientId: string, grantId: string, monitoringDate: Date, monitoringType: string, findings: string | null, correctiveActions: string | null, followUpDate: Date | null, completedBy: string): Promise<ISubRecipientMonitoring>;
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
export declare function getHighRiskSubRecipients(sequelize: Sequelize): Promise<ISubRecipient[]>;
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
export declare function recordComplianceCheck(sequelize: Sequelize, grantId: string, checkType: string, checkDate: Date, status: ComplianceStatus, findings: string | null, recommendations: string | null, completedBy: string): Promise<IComplianceCheck>;
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
export declare function getNonCompliantGrants(sequelize: Sequelize): Promise<any[]>;
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
export declare function createIndirectCostRate(sequelize: Sequelize, fiscalYear: number, rateType: string, rate: number, baseType: string, effectiveDate: Date, expirationDate: Date, approvedBy: string): Promise<IIndirectCostRate>;
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
export declare function calculateIndirectCosts(sequelize: Sequelize, directCosts: number, fiscalYear: number): Promise<number>;
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
export declare function initiateGrantCloseout(sequelize: Sequelize, grantId: string): Promise<IGrant>;
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
export declare function closeGrant(sequelize: Sequelize, grantId: string): Promise<IGrant>;
declare const _default: {
    createGrant: typeof createGrant;
    submitGrantApplication: typeof submitGrantApplication;
    awardGrant: typeof awardGrant;
    activateGrant: typeof activateGrant;
    getActiveGrants: typeof getActiveGrants;
    getExpiringGrants: typeof getExpiringGrants;
    createGrantBudget: typeof createGrantBudget;
    recordGrantExpenditure: typeof recordGrantExpenditure;
    calculateGrantBudgetUtilization: typeof calculateGrantBudgetUtilization;
    getGrantBudgetSummary: typeof getGrantBudgetSummary;
    createGrantMilestone: typeof createGrantMilestone;
    updateMilestoneStatus: typeof updateMilestoneStatus;
    getOverdueMilestones: typeof getOverdueMilestones;
    calculateMilestoneCompletion: typeof calculateMilestoneCompletion;
    createGrantDeliverable: typeof createGrantDeliverable;
    submitGrantDeliverable: typeof submitGrantDeliverable;
    approveGrantDeliverable: typeof approveGrantDeliverable;
    getUpcomingDeliverables: typeof getUpcomingDeliverables;
    createReimbursementRequest: typeof createReimbursementRequest;
    submitReimbursementRequest: typeof submitReimbursementRequest;
    approveReimbursementRequest: typeof approveReimbursementRequest;
    recordReimbursementPayment: typeof recordReimbursementPayment;
    calculateTotalReimbursements: typeof calculateTotalReimbursements;
    recordMatchContribution: typeof recordMatchContribution;
    calculateTotalMatch: typeof calculateTotalMatch;
    validateMatchRequirement: typeof validateMatchRequirement;
    getMatchBreakdown: typeof getMatchBreakdown;
    createSubRecipient: typeof createSubRecipient;
    recordSubRecipientMonitoring: typeof recordSubRecipientMonitoring;
    getHighRiskSubRecipients: typeof getHighRiskSubRecipients;
    recordComplianceCheck: typeof recordComplianceCheck;
    getNonCompliantGrants: typeof getNonCompliantGrants;
    createIndirectCostRate: typeof createIndirectCostRate;
    calculateIndirectCosts: typeof calculateIndirectCosts;
    initiateGrantCloseout: typeof initiateGrantCloseout;
    closeGrant: typeof closeGrant;
};
export default _default;
//# sourceMappingURL=grant-management-compliance-kit.d.ts.map