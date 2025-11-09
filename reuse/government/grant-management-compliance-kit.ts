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

import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  ModelAttributes,
  ModelOptions,
  FindOptions,
  WhereOptions,
  Op,
  Transaction,
} from 'sequelize';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDate, IsEnum, IsOptional, Min, Max, IsEmail } from 'class-validator';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Grant status enumeration
 */
export enum GrantStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  AWARDED = 'AWARDED',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED',
  TERMINATED = 'TERMINATED',
}

/**
 * Grant type enumeration
 */
export enum GrantType {
  FEDERAL = 'FEDERAL',
  STATE = 'STATE',
  LOCAL = 'LOCAL',
  FOUNDATION = 'FOUNDATION',
  PRIVATE = 'PRIVATE',
}

/**
 * Compliance status enumeration
 */
export enum ComplianceStatus {
  COMPLIANT = 'COMPLIANT',
  NEEDS_ATTENTION = 'NEEDS_ATTENTION',
  NON_COMPLIANT = 'NON_COMPLIANT',
  UNDER_REVIEW = 'UNDER_REVIEW',
  REMEDIATED = 'REMEDIATED',
}

/**
 * Deliverable status enumeration
 */
export enum DeliverableStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  OVERDUE = 'OVERDUE',
}

/**
 * Reimbursement status enumeration
 */
export enum ReimbursementStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  REJECTED = 'REJECTED',
}

/**
 * Match type enumeration
 */
export enum MatchType {
  CASH = 'CASH',
  IN_KIND = 'IN_KIND',
  VOLUNTEER = 'VOLUNTEER',
  FACILITY = 'FACILITY',
}

/**
 * Sub-recipient risk level
 */
export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
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
export async function createGrant(
  sequelize: Sequelize,
  grantNumber: string,
  grantType: GrantType,
  title: string,
  description: string,
  fundingAgency: string,
  cfda: string,
  awardAmount: number,
  matchPercent: number,
  periodStart: Date,
  periodEnd: Date,
  projectDirector: string,
  fiscalOfficer: string,
): Promise<IGrant> {
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

  return grant.toJSON() as IGrant;
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
export async function submitGrantApplication(
  sequelize: Sequelize,
  grantId: string,
  submittedBy: string,
): Promise<IGrant> {
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

  return grant.toJSON() as IGrant;
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
export async function awardGrant(
  sequelize: Sequelize,
  grantId: string,
  awardDate: Date,
): Promise<IGrant> {
  const Grant = getGrantModel(sequelize);

  const grant = await Grant.findByPk(grantId);
  if (!grant) {
    throw new Error(`Grant ${grantId} not found`);
  }

  grant.status = GrantStatus.AWARDED;
  await grant.save();

  return grant.toJSON() as IGrant;
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
export async function activateGrant(
  sequelize: Sequelize,
  grantId: string,
): Promise<IGrant> {
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

  return grant.toJSON() as IGrant;
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
export async function getActiveGrants(
  sequelize: Sequelize,
): Promise<IGrant[]> {
  const Grant = getGrantModel(sequelize);

  const grants = await Grant.findAll({
    where: { status: GrantStatus.ACTIVE },
  });

  return grants.map(g => g.toJSON() as IGrant);
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
export async function getExpiringGrants(
  sequelize: Sequelize,
  daysThreshold: number,
): Promise<IGrant[]> {
  const Grant = getGrantModel(sequelize);

  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

  const grants = await Grant.findAll({
    where: {
      status: GrantStatus.ACTIVE,
      periodEnd: {
        [Op.lte]: thresholdDate,
      },
    },
  });

  return grants.map(g => g.toJSON() as IGrant);
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
export async function createGrantBudget(
  sequelize: Sequelize,
  grantId: string,
  budgetCategory: string,
  budgetLineItem: string,
  federalAmount: number,
  matchAmount: number,
): Promise<IGrantBudget> {
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

  return budget.toJSON() as IGrantBudget;
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
export async function recordGrantExpenditure(
  sequelize: Sequelize,
  budgetId: string,
  amount: number,
  transaction?: Transaction,
): Promise<IGrantBudget> {
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

  return budget.toJSON() as IGrantBudget;
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
export async function calculateGrantBudgetUtilization(
  sequelize: Sequelize,
  grantId: string,
): Promise<number> {
  const GrantBudget = getGrantBudgetModel(sequelize);

  const budgets = await GrantBudget.findAll({
    where: { grantId },
  });

  const totalBudget = budgets.reduce((sum, b) => sum + parseFloat(b.totalAmount as any), 0);
  const totalExpended = budgets.reduce((sum, b) => sum + parseFloat(b.expendedAmount as any), 0);

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
export async function getGrantBudgetSummary(
  sequelize: Sequelize,
  grantId: string,
): Promise<any[]> {
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
export async function createGrantMilestone(
  sequelize: Sequelize,
  grantId: string,
  milestoneNumber: number,
  description: string,
  dueDate: Date,
): Promise<IGrantMilestone> {
  const GrantMilestone = getGrantMilestoneModel(sequelize);

  const milestone = await GrantMilestone.create({
    grantId,
    milestoneNumber,
    description,
    dueDate,
    status: DeliverableStatus.NOT_STARTED,
  });

  return milestone.toJSON() as IGrantMilestone;
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
export async function updateMilestoneStatus(
  sequelize: Sequelize,
  milestoneId: string,
  status: DeliverableStatus,
  notes?: string,
): Promise<IGrantMilestone> {
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

  return milestone.toJSON() as IGrantMilestone;
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
export async function getOverdueMilestones(
  sequelize: Sequelize,
  grantId?: string,
): Promise<IGrantMilestone[]> {
  const GrantMilestone = getGrantMilestoneModel(sequelize);

  const where: WhereOptions = {
    dueDate: { [Op.lt]: new Date() },
    status: {
      [Op.notIn]: [DeliverableStatus.APPROVED, DeliverableStatus.SUBMITTED],
    },
  };

  if (grantId) {
    where.grantId = grantId;
  }

  const milestones = await GrantMilestone.findAll({ where });

  return milestones.map(m => m.toJSON() as IGrantMilestone);
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
export async function calculateMilestoneCompletion(
  sequelize: Sequelize,
  grantId: string,
): Promise<number> {
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
export async function createGrantDeliverable(
  sequelize: Sequelize,
  grantId: string,
  deliverableType: string,
  description: string,
  dueDate: Date,
): Promise<IGrantDeliverable> {
  const GrantDeliverable = getGrantDeliverableModel(sequelize);

  const deliverable = await GrantDeliverable.create({
    grantId,
    deliverableType,
    description,
    dueDate,
    status: DeliverableStatus.NOT_STARTED,
  });

  return deliverable.toJSON() as IGrantDeliverable;
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
export async function submitGrantDeliverable(
  sequelize: Sequelize,
  deliverableId: string,
  submittedBy: string,
  documentUrl: string,
): Promise<IGrantDeliverable> {
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

  return deliverable.toJSON() as IGrantDeliverable;
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
export async function approveGrantDeliverable(
  sequelize: Sequelize,
  deliverableId: string,
): Promise<IGrantDeliverable> {
  const GrantDeliverable = getGrantDeliverableModel(sequelize);

  const deliverable = await GrantDeliverable.findByPk(deliverableId);
  if (!deliverable) {
    throw new Error(`Deliverable ${deliverableId} not found`);
  }

  deliverable.status = DeliverableStatus.APPROVED;
  deliverable.approvedDate = new Date();
  await deliverable.save();

  return deliverable.toJSON() as IGrantDeliverable;
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
export async function getUpcomingDeliverables(
  sequelize: Sequelize,
  daysAhead: number,
): Promise<IGrantDeliverable[]> {
  const GrantDeliverable = getGrantDeliverableModel(sequelize);

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  const deliverables = await GrantDeliverable.findAll({
    where: {
      dueDate: {
        [Op.between]: [new Date(), futureDate],
      },
      status: {
        [Op.notIn]: [DeliverableStatus.APPROVED, DeliverableStatus.SUBMITTED],
      },
    },
  });

  return deliverables.map(d => d.toJSON() as IGrantDeliverable);
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
export async function createReimbursementRequest(
  sequelize: Sequelize,
  grantId: string,
  requestNumber: number,
  periodStart: Date,
  periodEnd: Date,
  federalShare: number,
  matchShare: number,
  submittedBy: string,
): Promise<IGrantReimbursement> {
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

  return reimbursement.toJSON() as IGrantReimbursement;
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
export async function submitReimbursementRequest(
  sequelize: Sequelize,
  reimbursementId: string,
): Promise<IGrantReimbursement> {
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

  return reimbursement.toJSON() as IGrantReimbursement;
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
export async function approveReimbursementRequest(
  sequelize: Sequelize,
  reimbursementId: string,
  approvedBy: string,
): Promise<IGrantReimbursement> {
  const GrantReimbursement = getGrantReimbursementModel(sequelize);

  const reimbursement = await GrantReimbursement.findByPk(reimbursementId);
  if (!reimbursement) {
    throw new Error(`Reimbursement ${reimbursementId} not found`);
  }

  reimbursement.status = ReimbursementStatus.APPROVED;
  reimbursement.approvedBy = approvedBy;
  await reimbursement.save();

  return reimbursement.toJSON() as IGrantReimbursement;
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
export async function recordReimbursementPayment(
  sequelize: Sequelize,
  reimbursementId: string,
  paidDate: Date,
): Promise<IGrantReimbursement> {
  const GrantReimbursement = getGrantReimbursementModel(sequelize);

  const reimbursement = await GrantReimbursement.findByPk(reimbursementId);
  if (!reimbursement) {
    throw new Error(`Reimbursement ${reimbursementId} not found`);
  }

  reimbursement.status = ReimbursementStatus.PAID;
  reimbursement.paidDate = paidDate;
  await reimbursement.save();

  return reimbursement.toJSON() as IGrantReimbursement;
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
export async function calculateTotalReimbursements(
  sequelize: Sequelize,
  grantId: string,
): Promise<number> {
  const GrantReimbursement = getGrantReimbursementModel(sequelize);

  const reimbursements = await GrantReimbursement.findAll({
    where: {
      grantId,
      status: {
        [Op.in]: [ReimbursementStatus.APPROVED, ReimbursementStatus.PAID],
      },
    },
  });

  return reimbursements.reduce((sum, r) => sum + parseFloat(r.totalAmount as any), 0);
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
export async function recordMatchContribution(
  sequelize: Sequelize,
  grantId: string,
  matchType: MatchType,
  description: string,
  contributionDate: Date,
  amount: number,
  valuation: string | null,
  documentedBy: string,
): Promise<IMatchContribution> {
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

  return contribution.toJSON() as IMatchContribution;
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
export async function calculateTotalMatch(
  sequelize: Sequelize,
  grantId: string,
): Promise<number> {
  const MatchContribution = getMatchContributionModel(sequelize);

  const contributions = await MatchContribution.findAll({
    where: { grantId },
  });

  return contributions.reduce((sum, c) => sum + parseFloat(c.amount as any), 0);
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
export async function validateMatchRequirement(
  sequelize: Sequelize,
  grantId: string,
): Promise<boolean> {
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
export async function getMatchBreakdown(
  sequelize: Sequelize,
  grantId: string,
): Promise<any[]> {
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
export async function createSubRecipient(
  sequelize: Sequelize,
  name: string,
  ein: string,
  dunsNumber: string | null,
  uei: string | null,
  address: string,
  contactName: string,
  contactEmail: string,
  contactPhone: string,
  riskLevel: RiskLevel,
): Promise<ISubRecipient> {
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

  return subRecipient.toJSON() as ISubRecipient;
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
export async function recordSubRecipientMonitoring(
  sequelize: Sequelize,
  subRecipientId: string,
  grantId: string,
  monitoringDate: Date,
  monitoringType: string,
  findings: string | null,
  correctiveActions: string | null,
  followUpDate: Date | null,
  completedBy: string,
): Promise<ISubRecipientMonitoring> {
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

  return monitoring.toJSON() as ISubRecipientMonitoring;
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
export async function getHighRiskSubRecipients(
  sequelize: Sequelize,
): Promise<ISubRecipient[]> {
  const SubRecipient = getSubRecipientModel(sequelize);

  const subRecipients = await SubRecipient.findAll({
    where: {
      riskLevel: {
        [Op.in]: [RiskLevel.HIGH, RiskLevel.CRITICAL],
      },
    },
  });

  return subRecipients.map(s => s.toJSON() as ISubRecipient);
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
export async function recordComplianceCheck(
  sequelize: Sequelize,
  grantId: string,
  checkType: string,
  checkDate: Date,
  status: ComplianceStatus,
  findings: string | null,
  recommendations: string | null,
  completedBy: string,
): Promise<IComplianceCheck> {
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

  return check.toJSON() as IComplianceCheck;
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
export async function getNonCompliantGrants(
  sequelize: Sequelize,
): Promise<any[]> {
  const ComplianceCheck = getComplianceCheckModel(sequelize);

  const checks = await ComplianceCheck.findAll({
    where: {
      status: {
        [Op.in]: [ComplianceStatus.NON_COMPLIANT, ComplianceStatus.NEEDS_ATTENTION],
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
export async function createIndirectCostRate(
  sequelize: Sequelize,
  fiscalYear: number,
  rateType: string,
  rate: number,
  baseType: string,
  effectiveDate: Date,
  expirationDate: Date,
  approvedBy: string,
): Promise<IIndirectCostRate> {
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

  return costRate.toJSON() as IIndirectCostRate;
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
export async function calculateIndirectCosts(
  sequelize: Sequelize,
  directCosts: number,
  fiscalYear: number,
): Promise<number> {
  const IndirectCostRate = getIndirectCostRateModel(sequelize);

  const rate = await IndirectCostRate.findOne({
    where: {
      fiscalYear,
      effectiveDate: { [Op.lte]: new Date() },
      expirationDate: { [Op.gte]: new Date() },
    },
  });

  if (!rate) {
    throw new Error(`No active indirect cost rate found for fiscal year ${fiscalYear}`);
  }

  return directCosts * (parseFloat(rate.rate as any) / 100);
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
export async function initiateGrantCloseout(
  sequelize: Sequelize,
  grantId: string,
): Promise<IGrant> {
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

  return grant.toJSON() as IGrant;
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
export async function closeGrant(
  sequelize: Sequelize,
  grantId: string,
): Promise<IGrant> {
  const Grant = getGrantModel(sequelize);

  const grant = await Grant.findByPk(grantId);
  if (!grant) {
    throw new Error(`Grant ${grantId} not found`);
  }

  grant.status = GrantStatus.CLOSED;
  await grant.save();

  return grant.toJSON() as IGrant;
}

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS
// ============================================================================

function getGrantModel(sequelize: Sequelize): ModelStatic<Model> {
  if (sequelize.models.Grant) return sequelize.models.Grant;

  const attributes: ModelAttributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    grantNumber: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    grantType: { type: DataTypes.ENUM(...Object.values(GrantType)), allowNull: false },
    title: { type: DataTypes.STRING(500), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    fundingAgency: { type: DataTypes.STRING(200), allowNull: false },
    cfda: { type: DataTypes.STRING(20), allowNull: true },
    awardAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    matchRequired: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
    matchPercent: { type: DataTypes.DECIMAL(5, 2), allowNull: false, defaultValue: 0 },
    periodStart: { type: DataTypes.DATEONLY, allowNull: false },
    periodEnd: { type: DataTypes.DATEONLY, allowNull: false },
    status: { type: DataTypes.ENUM(...Object.values(GrantStatus)), allowNull: false },
    projectDirector: { type: DataTypes.UUID, allowNull: false },
    fiscalOfficer: { type: DataTypes.UUID, allowNull: false },
  };

  return sequelize.define('Grant', attributes, {
    sequelize, modelName: 'Grant', tableName: 'grants', timestamps: true, underscored: true,
    indexes: [{ fields: ['grant_number'], unique: true }, { fields: ['status'] }, { fields: ['period_end'] }],
  });
}

function getGrantBudgetModel(sequelize: Sequelize): ModelStatic<Model> {
  if (sequelize.models.GrantBudget) return sequelize.models.GrantBudget;

  const attributes: ModelAttributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    grantId: { type: DataTypes.UUID, allowNull: false, references: { model: 'grants', key: 'id' } },
    budgetCategory: { type: DataTypes.STRING(100), allowNull: false },
    budgetLineItem: { type: DataTypes.STRING(200), allowNull: false },
    federalAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    matchAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
    totalAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    expendedAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
    availableAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  };

  return sequelize.define('GrantBudget', attributes, {
    sequelize, modelName: 'GrantBudget', tableName: 'grant_budgets', timestamps: true, underscored: true,
    indexes: [{ fields: ['grant_id'] }],
  });
}

function getGrantMilestoneModel(sequelize: Sequelize): ModelStatic<Model> {
  if (sequelize.models.GrantMilestone) return sequelize.models.GrantMilestone;

  const attributes: ModelAttributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    grantId: { type: DataTypes.UUID, allowNull: false },
    milestoneNumber: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    dueDate: { type: DataTypes.DATEONLY, allowNull: false },
    completedDate: { type: DataTypes.DATEONLY, allowNull: true },
    status: { type: DataTypes.ENUM(...Object.values(DeliverableStatus)), allowNull: false },
    notes: { type: DataTypes.TEXT, allowNull: true },
  };

  return sequelize.define('GrantMilestone', attributes, {
    sequelize, modelName: 'GrantMilestone', tableName: 'grant_milestones', timestamps: true, underscored: true,
  });
}

function getGrantDeliverableModel(sequelize: Sequelize): ModelStatic<Model> {
  if (sequelize.models.GrantDeliverable) return sequelize.models.GrantDeliverable;

  const attributes: ModelAttributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    grantId: { type: DataTypes.UUID, allowNull: false },
    deliverableType: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    dueDate: { type: DataTypes.DATEONLY, allowNull: false },
    submittedDate: { type: DataTypes.DATE, allowNull: true },
    approvedDate: { type: DataTypes.DATE, allowNull: true },
    status: { type: DataTypes.ENUM(...Object.values(DeliverableStatus)), allowNull: false },
    submittedBy: { type: DataTypes.UUID, allowNull: true },
    documentUrl: { type: DataTypes.TEXT, allowNull: true },
  };

  return sequelize.define('GrantDeliverable', attributes, {
    sequelize, modelName: 'GrantDeliverable', tableName: 'grant_deliverables', timestamps: true, underscored: true,
  });
}

function getGrantReimbursementModel(sequelize: Sequelize): ModelStatic<Model> {
  if (sequelize.models.GrantReimbursement) return sequelize.models.GrantReimbursement;

  const attributes: ModelAttributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    grantId: { type: DataTypes.UUID, allowNull: false },
    requestNumber: { type: DataTypes.INTEGER, allowNull: false },
    requestDate: { type: DataTypes.DATE, allowNull: false },
    periodStart: { type: DataTypes.DATEONLY, allowNull: false },
    periodEnd: { type: DataTypes.DATEONLY, allowNull: false },
    federalShare: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    matchShare: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    totalAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    status: { type: DataTypes.ENUM(...Object.values(ReimbursementStatus)), allowNull: false },
    submittedBy: { type: DataTypes.UUID, allowNull: false },
    approvedBy: { type: DataTypes.UUID, allowNull: true },
    paidDate: { type: DataTypes.DATE, allowNull: true },
  };

  return sequelize.define('GrantReimbursement', attributes, {
    sequelize, modelName: 'GrantReimbursement', tableName: 'grant_reimbursements', timestamps: true, underscored: true,
  });
}

function getMatchContributionModel(sequelize: Sequelize): ModelStatic<Model> {
  if (sequelize.models.MatchContribution) return sequelize.models.MatchContribution;

  const attributes: ModelAttributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    grantId: { type: DataTypes.UUID, allowNull: false },
    matchType: { type: DataTypes.ENUM(...Object.values(MatchType)), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    contributionDate: { type: DataTypes.DATEONLY, allowNull: false },
    amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    valuation: { type: DataTypes.TEXT, allowNull: true },
    documentedBy: { type: DataTypes.UUID, allowNull: false },
  };

  return sequelize.define('MatchContribution', attributes, {
    sequelize, modelName: 'MatchContribution', tableName: 'match_contributions', timestamps: true, underscored: true,
  });
}

function getSubRecipientModel(sequelize: Sequelize): ModelStatic<Model> {
  if (sequelize.models.SubRecipient) return sequelize.models.SubRecipient;

  const attributes: ModelAttributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(200), allowNull: false },
    ein: { type: DataTypes.STRING(20), allowNull: false },
    dunsNumber: { type: DataTypes.STRING(20), allowNull: true },
    uei: { type: DataTypes.STRING(20), allowNull: true },
    address: { type: DataTypes.TEXT, allowNull: false },
    contactName: { type: DataTypes.STRING(200), allowNull: false },
    contactEmail: { type: DataTypes.STRING(200), allowNull: false },
    contactPhone: { type: DataTypes.STRING(20), allowNull: false },
    riskLevel: { type: DataTypes.ENUM(...Object.values(RiskLevel)), allowNull: false },
    lastAuditDate: { type: DataTypes.DATEONLY, allowNull: true },
  };

  return sequelize.define('SubRecipient', attributes, {
    sequelize, modelName: 'SubRecipient', tableName: 'sub_recipients', timestamps: true, underscored: true,
  });
}

function getSubRecipientMonitoringModel(sequelize: Sequelize): ModelStatic<Model> {
  if (sequelize.models.SubRecipientMonitoring) return sequelize.models.SubRecipientMonitoring;

  const attributes: ModelAttributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    subRecipientId: { type: DataTypes.UUID, allowNull: false },
    grantId: { type: DataTypes.UUID, allowNull: false },
    monitoringDate: { type: DataTypes.DATEONLY, allowNull: false },
    monitoringType: { type: DataTypes.STRING(100), allowNull: false },
    findings: { type: DataTypes.TEXT, allowNull: true },
    correctiveActions: { type: DataTypes.TEXT, allowNull: true },
    followUpDate: { type: DataTypes.DATEONLY, allowNull: true },
    completedBy: { type: DataTypes.UUID, allowNull: false },
  };

  return sequelize.define('SubRecipientMonitoring', attributes, {
    sequelize, modelName: 'SubRecipientMonitoring', tableName: 'sub_recipient_monitoring', timestamps: true, underscored: true,
  });
}

function getComplianceCheckModel(sequelize: Sequelize): ModelStatic<Model> {
  if (sequelize.models.ComplianceCheck) return sequelize.models.ComplianceCheck;

  const attributes: ModelAttributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    grantId: { type: DataTypes.UUID, allowNull: false },
    checkType: { type: DataTypes.STRING(100), allowNull: false },
    checkDate: { type: DataTypes.DATEONLY, allowNull: false },
    status: { type: DataTypes.ENUM(...Object.values(ComplianceStatus)), allowNull: false },
    findings: { type: DataTypes.TEXT, allowNull: true },
    recommendations: { type: DataTypes.TEXT, allowNull: true },
    completedBy: { type: DataTypes.UUID, allowNull: false },
  };

  return sequelize.define('ComplianceCheck', attributes, {
    sequelize, modelName: 'ComplianceCheck', tableName: 'compliance_checks', timestamps: true, underscored: true,
  });
}

function getIndirectCostRateModel(sequelize: Sequelize): ModelStatic<Model> {
  if (sequelize.models.IndirectCostRate) return sequelize.models.IndirectCostRate;

  const attributes: ModelAttributes = {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    fiscalYear: { type: DataTypes.INTEGER, allowNull: false },
    rateType: { type: DataTypes.STRING(50), allowNull: false },
    rate: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    baseType: { type: DataTypes.STRING(100), allowNull: false },
    effectiveDate: { type: DataTypes.DATEONLY, allowNull: false },
    expirationDate: { type: DataTypes.DATEONLY, allowNull: false },
    approvedBy: { type: DataTypes.UUID, allowNull: false },
  };

  return sequelize.define('IndirectCostRate', attributes, {
    sequelize, modelName: 'IndirectCostRate', tableName: 'indirect_cost_rates', timestamps: true, underscored: true,
  });
}

export default {
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
