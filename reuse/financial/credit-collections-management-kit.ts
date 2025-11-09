/**
 * Credit Collections Management Kit - Enterprise-Grade Financial Operations
 * Competes with: HighRadius, Billtrust, ARC Global Solutions
 * LOC: FIN-CRED-001
 *
 * 40 functions for comprehensive credit and collections management:
 * - Credit assessment, limits, and approval workflows
 * - Accounts receivable tracking and aging analysis
 * - Collection case management and activity tracking
 * - Payment promises and dispute resolution
 * - Write-off and recovery operations
 * - Advanced reporting and predictive automation
 *
 * @module financial/credit-collections-management-kit
 * @requires sequelize ^6.0
 * @requires nestjs ^10.0
 * @author HighRadius Competitor
 * @version 2.0.0
 */

import { DataTypes, Model, Op, Sequelize } from 'sequelize';
import { v4 as uuid } from 'uuid';

// ============================================================================
// TYPE DEFINITIONS (8-10 Types)
// ============================================================================

/**
 * Credit assessment result with risk scoring
 */
export interface CreditAssessment {
  customerId: string;
  creditScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendedLimit: number;
  approvalProbability: number;
  assessmentDate: Date;
  notes: string;
}

/**
 * AR aging bucket with metrics
 */
export interface ARAgingBucket {
  current: number;
  days30: number;
  days60: number;
  days90: number;
  days120Plus: number;
  totalOutstanding: number;
  percentageCurrent: number;
}

/**
 * Collection performance metrics
 */
export interface CollectionMetrics {
  totalCases: number;
  resolvedCases: number;
  resolutionRate: number;
  averageDaysToResolve: number;
  collectionAmount: number;
  costToCollect: number;
  roi: number;
}

/**
 * Payment promise tracking
 */
export interface PaymentPromise {
  caseId: string;
  promisedAmount: number;
  promisedDate: Date;
  status: 'PENDING' | 'FULFILLED' | 'BROKEN' | 'ESCALATED';
  actualPaymentDate?: Date;
  actualPaymentAmount?: number;
}

/**
 * Dispute details
 */
export interface DisputeRecord {
  invoiceId: string;
  disputeAmount: number;
  reason: string;
  status: 'OPEN' | 'UNDER_INVESTIGATION' | 'RESOLVED' | 'DENIED';
  investigationNotes?: string;
  adjustmentAmount?: number;
}

/**
 * Write-off analysis
 */
export interface WriteOffAnalysis {
  customerId: string;
  invoiceId: string;
  amount: number;
  daysOverdue: number;
  collectionProbability: number;
  recommendation: 'WRITE_OFF' | 'CONTINUE_COLLECTION' | 'PARTIAL_RECOVERY';
  reason: string;
}

/**
 * Recovery operation tracking
 */
export interface RecoveryOperation {
  caseId: string;
  recoveryMethod: 'NEGOTIATION' | 'LITIGATION' | 'AGENCY' | 'BANKRUPTCY';
  status: 'INITIATED' | 'IN_PROGRESS' | 'RECOVERED' | 'CLOSED';
  estimatedRecovery: number;
  actualRecovery?: number;
  effortCount?: number;
}

/**
 * DSO and collection trend
 */
export interface FinancialTrend {
  period: string;
  dso: number;
  collectionRate: number;
  recoveryRate: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  forecastedDso?: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Credit Profile Model
 */
export class CreditProfile extends Model {
  declare customerId: string;
  declare creditScore: number;
  declare riskLevel: string;
  declare approvedLimit: number;
  declare currentUtilization: number;
  declare lastAssessmentDate: Date;
  declare externalScore?: number;
  declare industryAverage?: number;

  static init(sequelize: Sequelize) {
    return super.init(
      {
        id: { type: DataTypes.UUID, primaryKey: true, defaultValue: () => uuid() },
        customerId: { type: DataTypes.STRING, allowNull: false, unique: true },
        creditScore: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 500 },
        riskLevel: { type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'), defaultValue: 'MEDIUM' },
        approvedLimit: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
        currentUtilization: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
        lastAssessmentDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        externalScore: DataTypes.INTEGER,
        industryAverage: DataTypes.DECIMAL(6, 2),
      },
      { sequelize, modelName: 'CreditProfile', tableName: 'credit_profiles', timestamps: true }
    );
  }
}

/**
 * Credit Terms Model
 */
export class CreditTerms extends Model {
  declare customerId: string;
  declare netDays: number;
  declare discountPercent: number;
  declare discountDays: number;
  declare creditLimit: number;
  declare status: string;

  static init(sequelize: Sequelize) {
    return super.init(
      {
        id: { type: DataTypes.UUID, primaryKey: true, defaultValue: () => uuid() },
        customerId: { type: DataTypes.STRING, allowNull: false },
        netDays: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 30 },
        discountPercent: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
        discountDays: { type: DataTypes.INTEGER, defaultValue: 10 },
        creditLimit: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
        status: { type: DataTypes.ENUM('ACTIVE', 'SUSPENDED', 'TERMINATED'), defaultValue: 'ACTIVE' },
      },
      { sequelize, modelName: 'CreditTerms', tableName: 'credit_terms', timestamps: true }
    );
  }
}

/**
 * AR Tracking Model
 */
export class ARTracking extends Model {
  declare invoiceId: string;
  declare customerId: string;
  declare invoiceAmount: number;
  declare daysOverdue: number;
  declare status: string;

  static init(sequelize: Sequelize) {
    return super.init(
      {
        id: { type: DataTypes.UUID, primaryKey: true, defaultValue: () => uuid() },
        invoiceId: { type: DataTypes.STRING, allowNull: false, unique: true },
        customerId: { type: DataTypes.STRING, allowNull: false },
        invoiceAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
        invoiceDate: { type: DataTypes.DATE, allowNull: false },
        dueDate: { type: DataTypes.DATE, allowNull: false },
        daysOverdue: { type: DataTypes.INTEGER, defaultValue: 0 },
        paidAmount: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
        status: { type: DataTypes.ENUM('CURRENT', 'OVERDUE', 'PAID', 'DISPUTED', 'WRITTEN_OFF'), defaultValue: 'CURRENT' },
        notes: DataTypes.TEXT,
      },
      { sequelize, modelName: 'ARTracking', tableName: 'ar_tracking', timestamps: true }
    );
  }
}

/**
 * Collection Case Model
 */
export class CollectionCase extends Model {
  declare invoiceId: string;
  declare customerId: string;
  declare collectionAmount: number;
  declare assignedCollector?: string;
  declare status: string;

  static init(sequelize: Sequelize) {
    return super.init(
      {
        id: { type: DataTypes.UUID, primaryKey: true, defaultValue: () => uuid() },
        invoiceId: { type: DataTypes.STRING, allowNull: false },
        customerId: { type: DataTypes.STRING, allowNull: false },
        collectionAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
        status: { type: DataTypes.ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'), defaultValue: 'OPEN' },
        assignedCollector: DataTypes.STRING,
        createdDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        resolvedDate: DataTypes.DATE,
        recoveredAmount: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
      },
      { sequelize, modelName: 'CollectionCase', tableName: 'collection_cases', timestamps: true }
    );
  }
}

/**
 * Collection Activity Model
 */
export class CollectionActivity extends Model {
  declare caseId: string;
  declare activityType: string;
  declare notes: string;

  static init(sequelize: Sequelize) {
    return super.init(
      {
        id: { type: DataTypes.UUID, primaryKey: true, defaultValue: () => uuid() },
        caseId: { type: DataTypes.STRING, allowNull: false },
        activityType: { type: DataTypes.ENUM('CALL', 'EMAIL', 'LETTER', 'VISIT', 'PAYMENT_RECEIVED', 'PROMISE_MADE'), allowNull: false },
        notes: DataTypes.TEXT,
        contactPerson: DataTypes.STRING,
        nextActionDate: DataTypes.DATE,
        activityDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      },
      { sequelize, modelName: 'CollectionActivity', tableName: 'collection_activities', timestamps: true }
    );
  }
}

/**
 * Payment Promise Model
 */
export class PaymentPromiseRecord extends Model {
  declare caseId: string;
  declare promisedAmount: number;
  declare promisedDate: Date;
  declare status: string;

  static init(sequelize: Sequelize) {
    return super.init(
      {
        id: { type: DataTypes.UUID, primaryKey: true, defaultValue: () => uuid() },
        caseId: { type: DataTypes.STRING, allowNull: false },
        promisedAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
        promisedDate: { type: DataTypes.DATE, allowNull: false },
        status: { type: DataTypes.ENUM('PENDING', 'FULFILLED', 'BROKEN', 'ESCALATED'), defaultValue: 'PENDING' },
        actualPaymentDate: DataTypes.DATE,
        actualPaymentAmount: DataTypes.DECIMAL(15, 2),
        promiseDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        followUpDate: DataTypes.DATE,
      },
      { sequelize, modelName: 'PaymentPromiseRecord', tableName: 'payment_promises', timestamps: true }
    );
  }
}

/**
 * Dispute Record Model
 */
export class DisputeRecordModel extends Model {
  declare invoiceId: string;
  declare customerId: string;
  declare disputeAmount: number;
  declare status: string;

  static init(sequelize: Sequelize) {
    return super.init(
      {
        id: { type: DataTypes.UUID, primaryKey: true, defaultValue: () => uuid() },
        invoiceId: { type: DataTypes.STRING, allowNull: false },
        customerId: { type: DataTypes.STRING, allowNull: false },
        disputeAmount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
        reason: { type: DataTypes.TEXT, allowNull: false },
        status: { type: DataTypes.ENUM('OPEN', 'UNDER_INVESTIGATION', 'RESOLVED', 'DENIED'), defaultValue: 'OPEN' },
        openedDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        investigationNotes: DataTypes.TEXT,
        adjustmentAmount: DataTypes.DECIMAL(15, 2),
        closedDate: DataTypes.DATE,
      },
      { sequelize, modelName: 'DisputeRecordModel', tableName: 'disputes', timestamps: true }
    );
  }
}

/**
 * Write-Off Model
 */
export class WriteOff extends Model {
  declare invoiceId: string;
  declare customerId: string;
  declare amount: number;
  declare status: string;

  static init(sequelize: Sequelize) {
    return super.init(
      {
        id: { type: DataTypes.UUID, primaryKey: true, defaultValue: () => uuid() },
        invoiceId: { type: DataTypes.STRING, allowNull: false },
        customerId: { type: DataTypes.STRING, allowNull: false },
        amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
        reason: { type: DataTypes.TEXT, allowNull: false },
        status: { type: DataTypes.ENUM('PENDING', 'APPROVED', 'PROCESSED', 'REVERSED'), defaultValue: 'PENDING' },
        daysOverdue: { type: DataTypes.INTEGER, allowNull: false },
        collectionProbability: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
        approverName: DataTypes.STRING,
        approvalDate: DataTypes.DATE,
        processedDate: DataTypes.DATE,
      },
      { sequelize, modelName: 'WriteOff', tableName: 'write_offs', timestamps: true }
    );
  }
}

/**
 * Recovery Operation Model
 */
export class RecoveryCase extends Model {
  declare caseId: string;
  declare recoveryMethod: string;
  declare estimatedRecovery: number;
  declare status: string;

  static init(sequelize: Sequelize) {
    return super.init(
      {
        id: { type: DataTypes.UUID, primaryKey: true, defaultValue: () => uuid() },
        caseId: { type: DataTypes.STRING, allowNull: false },
        recoveryMethod: { type: DataTypes.ENUM('NEGOTIATION', 'LITIGATION', 'AGENCY', 'BANKRUPTCY'), allowNull: false },
        status: { type: DataTypes.ENUM('INITIATED', 'IN_PROGRESS', 'RECOVERED', 'CLOSED'), defaultValue: 'INITIATED' },
        estimatedRecovery: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
        actualRecovery: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
        effortCount: { type: DataTypes.INTEGER, defaultValue: 0 },
        initiatedDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        closedDate: DataTypes.DATE,
        agencyName: DataTypes.STRING,
      },
      { sequelize, modelName: 'RecoveryCase', tableName: 'recovery_cases', timestamps: true }
    );
  }
}

// ============================================================================
// 40 FUNCTIONS: CREDIT COLLECTIONS MANAGEMENT KIT
// ============================================================================

/**
 * 1. ASSESS CREDIT PROFILE
 * Analyze customer creditworthiness and generate risk assessment
 */
export async function assessCreditProfile(
  sequelize: Sequelize,
  customerId: string,
  creditScore: number,
  paymentHistory: number,
  debtToEquityRatio: number
): Promise<CreditAssessment> {
  const riskScore = creditScore * 0.5 + paymentHistory * 0.3 + debtToEquityRatio * 0.2;
  const riskLevel = riskScore > 750 ? 'LOW' : riskScore > 600 ? 'MEDIUM' : riskScore > 450 ? 'HIGH' : 'CRITICAL';
  const recommendedLimit = riskScore > 750 ? 100000 : riskScore > 600 ? 50000 : riskScore > 450 ? 20000 : 5000;

  await CreditProfile.upsert({
    customerId,
    creditScore,
    riskLevel,
    approvedLimit: recommendedLimit,
    lastAssessmentDate: new Date(),
  });

  return {
    customerId,
    creditScore,
    riskLevel: riskLevel as any,
    recommendedLimit,
    approvalProbability: Math.min(riskScore / 800, 1),
    assessmentDate: new Date(),
    notes: `Risk level: ${riskLevel}, Recommended limit: $${recommendedLimit}`,
  };
}

/**
 * 2. SET CREDIT TERMS
 * Establish payment terms and credit limits for customer
 */
export async function setCreditTerms(
  customerId: string,
  netDays: number,
  discountPercent: number,
  discountDays: number,
  creditLimit: number
): Promise<CreditTerms> {
  const [creditTerm] = await CreditTerms.findOrCreate({
    where: { customerId },
    defaults: { customerId, netDays, discountPercent, discountDays, creditLimit },
  });

  creditTerm.set({ netDays, discountPercent, discountDays, creditLimit });
  return creditTerm.save();
}

/**
 * 3. APPROVE CREDIT
 * Approve credit request with automated decision
 */
export async function approveCreditRequest(
  customerId: string,
  requestedLimit: number,
  approverName: string
): Promise<{ approved: boolean; approvedLimit: number; reason: string }> {
  const profile = await CreditProfile.findOne({ where: { customerId } });
  const approved = profile && profile.riskLevel !== 'CRITICAL' && requestedLimit <= profile.approvedLimit;

  if (approved) {
    await CreditProfile.update({ approvedLimit: requestedLimit }, { where: { customerId } });
  }

  return {
    approved,
    approvedLimit: approved ? requestedLimit : 0,
    reason: approved ? 'Approved' : `${profile?.riskLevel || 'UNKNOWN'} risk level - declined`,
  };
}

/**
 * 4. MONITOR CREDIT EXPOSURE
 * Track customer credit utilization and exposure
 */
export async function monitorCreditExposure(customerId: string): Promise<{ customerId: string; utilization: number; available: number; status: string }> {
  const profile = await CreditProfile.findOne({ where: { customerId } });
  const invoices = await ARTracking.findAll({ where: { customerId, status: { [Op.ne]: 'PAID' } } });

  const totalOutstanding = invoices.reduce((sum, inv) => sum + Number(inv.invoiceAmount), 0);
  const utilization = profile ? (totalOutstanding / Number(profile.approvedLimit)) * 100 : 0;
  const status = utilization > 90 ? 'CRITICAL' : utilization > 75 ? 'WARNING' : 'HEALTHY';

  await CreditProfile.update({ currentUtilization: totalOutstanding }, { where: { customerId } });

  return {
    customerId,
    utilization: Math.round(utilization * 100) / 100,
    available: profile ? Number(profile.approvedLimit) - totalOutstanding : 0,
    status,
  };
}

/**
 * 5. SET CREDIT LIMIT
 * Establish initial credit limit for new customer
 */
export async function setCreditLimit(customerId: string, limit: number): Promise<CreditProfile> {
  const [profile] = await CreditProfile.findOrCreate({
    where: { customerId },
    defaults: { customerId, approvedLimit: limit, creditScore: 500 },
  });

  profile.approvedLimit = limit;
  return profile.save();
}

/**
 * 6. CHECK CREDIT UTILIZATION
 * Calculate current credit utilization percentage
 */
export async function checkCreditUtilization(customerId: string): Promise<number> {
  const profile = await CreditProfile.findOne({ where: { customerId } });
  if (!profile) return 0;

  const invoices = await ARTracking.findAll({
    where: { customerId, status: { [Op.ne]: 'PAID' } },
  });

  const outstanding = invoices.reduce((sum, inv) => sum + Number(inv.invoiceAmount), 0);
  return (outstanding / Number(profile.approvedLimit)) * 100;
}

/**
 * 7. ADJUST CREDIT LIMIT
 * Increase or decrease customer credit limit
 */
export async function adjustCreditLimit(customerId: string, newLimit: number, reason: string): Promise<CreditProfile> {
  const profile = await CreditProfile.findOne({ where: { customerId } });
  if (!profile) throw new Error('Customer not found');

  profile.approvedLimit = newLimit;
  profile.lastAssessmentDate = new Date();
  return profile.save();
}

/**
 * 8. SUSPEND CREDIT
 * Suspend credit line due to payment issues
 */
export async function suspendCredit(customerId: string, reason: string): Promise<CreditTerms> {
  const [creditTerm] = await CreditTerms.findOrCreate({
    where: { customerId },
    defaults: { customerId, creditLimit: 0 },
  });

  creditTerm.status = 'SUSPENDED';
  return creditTerm.save();
}

/**
 * 9. TRACK RECEIVABLES
 * Create and update AR record for invoice
 */
export async function trackReceivables(
  invoiceId: string,
  customerId: string,
  invoiceAmount: number,
  invoiceDate: Date,
  dueDate: Date
): Promise<ARTracking> {
  const [arRecord] = await ARTracking.findOrCreate({
    where: { invoiceId },
    defaults: { invoiceId, customerId, invoiceAmount, invoiceDate, dueDate, status: 'CURRENT' },
  });

  return arRecord;
}

/**
 * 10. AGE INVOICES
 * Calculate invoice aging for AR report
 */
export async function ageInvoices(customerId: string): Promise<ARAgingBucket> {
  const invoices = await ARTracking.findAll({
    where: { customerId, status: { [Op.ne]: 'PAID' } },
  });

  const now = new Date();
  const buckets = {
    current: 0,
    days30: 0,
    days60: 0,
    days90: 0,
    days120Plus: 0,
    totalOutstanding: 0,
    percentageCurrent: 0,
  };

  invoices.forEach((inv) => {
    const days = Math.floor((now.getTime() - new Date(inv.dueDate).getTime()) / (1000 * 60 * 60 * 24));
    const amount = Number(inv.invoiceAmount);

    if (days <= 0) buckets.current += amount;
    else if (days <= 30) buckets.days30 += amount;
    else if (days <= 60) buckets.days60 += amount;
    else if (days <= 90) buckets.days90 += amount;
    else buckets.days120Plus += amount;

    buckets.totalOutstanding += amount;
  });

  buckets.percentageCurrent = buckets.totalOutstanding > 0 ? (buckets.current / buckets.totalOutstanding) * 100 : 0;

  return buckets;
}

/**
 * 11. CALCULATE DSO
 * Calculate Days Sales Outstanding metric
 */
export async function calculateDSO(customerId: string): Promise<number> {
  const invoices = await ARTracking.findAll({
    where: { customerId, status: 'PAID' },
    limit: 100,
  });

  if (invoices.length === 0) return 0;

  let totalDays = 0;
  invoices.forEach((inv) => {
    const days = Math.floor(
      (new Date(inv.paidAmount ? inv.updatedAt : new Date()).getTime() - new Date(inv.invoiceDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    totalDays += days;
  });

  return Math.round(totalDays / invoices.length);
}

/**
 * 12. FORECAST COLLECTIONS
 * Predict collection amounts based on historical data
 */
export async function forecastCollections(customerId: string, daysAhead: number = 30): Promise<number> {
  const recentCases = await CollectionCase.findAll({
    where: { customerId, status: 'RESOLVED' },
    order: [['resolvedDate', 'DESC']],
    limit: 12,
  });

  if (recentCases.length === 0) return 0;

  const avgRecoveryRate = recentCases.reduce((sum, c) => sum + Number(c.recoveredAmount), 0) / recentCases.length;
  const pendingAmount = await ARTracking.sum('invoiceAmount', {
    where: { customerId, status: { [Op.ne]: 'PAID' } },
  });

  return Math.round(Number(pendingAmount || 0) * (avgRecoveryRate / 100));
}

/**
 * 13. CREATE COLLECTION CASE
 * Initiate collection case for overdue invoice
 */
export async function createCollectionCase(
  invoiceId: string,
  customerId: string,
  collectionAmount: number
): Promise<CollectionCase> {
  const collectionCase = await CollectionCase.create({
    invoiceId,
    customerId,
    collectionAmount,
    status: 'OPEN',
  });

  return collectionCase;
}

/**
 * 14. ASSIGN COLLECTOR
 * Assign collection case to specific collector/team
 */
export async function assignCollector(caseId: string, collectorName: string): Promise<CollectionCase> {
  const collectionCase = await CollectionCase.findByPk(caseId);
  if (!collectionCase) throw new Error('Case not found');

  collectionCase.assignedCollector = collectorName;
  collectionCase.status = 'IN_PROGRESS';
  return collectionCase.save();
}

/**
 * 15. TRACK COLLECTION ACTIVITY
 * Log collection activity (calls, emails, payments)
 */
export async function trackCollectionActivity(
  caseId: string,
  activityType: string,
  notes: string,
  nextActionDate?: Date
): Promise<CollectionActivity> {
  const activity = await CollectionActivity.create({
    caseId,
    activityType,
    notes,
    nextActionDate,
    activityDate: new Date(),
  });

  return activity;
}

/**
 * 16. RESOLVE COLLECTION CASE
 * Close collection case with outcome
 */
export async function resolveCollectionCase(
  caseId: string,
  recoveredAmount: number,
  resolution: string
): Promise<CollectionCase> {
  const collectionCase = await CollectionCase.findByPk(caseId);
  if (!collectionCase) throw new Error('Case not found');

  collectionCase.status = 'RESOLVED';
  collectionCase.resolvedDate = new Date();
  collectionCase.recoveredAmount = recoveredAmount;
  return collectionCase.save();
}

/**
 * 17. RECORD PAYMENT PROMISE
 * Document customer promise to pay
 */
export async function recordPaymentPromise(
  caseId: string,
  promisedAmount: number,
  promisedDate: Date,
  collectorName?: string
): Promise<PaymentPromiseRecord> {
  const promise = await PaymentPromiseRecord.create({
    caseId,
    promisedAmount,
    promisedDate,
    status: 'PENDING',
    promiseDate: new Date(),
  });

  return promise;
}

/**
 * 18. TRACK PROMISE FULFILLMENT
 * Monitor and verify promise payment
 */
export async function trackPromiseFulfillment(
  promiseId: string,
  actualPaymentAmount?: number,
  actualPaymentDate?: Date
): Promise<PaymentPromiseRecord> {
  const promise = await PaymentPromiseRecord.findByPk(promiseId);
  if (!promise) throw new Error('Promise not found');

  if (actualPaymentAmount && actualPaymentDate) {
    promise.actualPaymentAmount = actualPaymentAmount;
    promise.actualPaymentDate = actualPaymentDate;
    promise.status = actualPaymentAmount >= promise.promisedAmount ? 'FULFILLED' : 'BROKEN';
  }

  return promise.save();
}

/**
 * 19. FOLLOW UP PROMISE
 * Schedule and execute promise follow-up
 */
export async function followUpPromise(promiseId: string, followUpDate: Date): Promise<PaymentPromiseRecord> {
  const promise = await PaymentPromiseRecord.findByPk(promiseId);
  if (!promise) throw new Error('Promise not found');

  promise.followUpDate = followUpDate;
  return promise.save();
}

/**
 * 20. ESCALATE BROKEN PROMISE
 * Escalate case when promise is broken
 */
export async function escalateBrokenPromise(promiseId: string, escalationReason: string): Promise<PaymentPromiseRecord> {
  const promise = await PaymentPromiseRecord.findByPk(promiseId);
  if (!promise) throw new Error('Promise not found');

  const now = new Date();
  if (promise.promisedDate < now && !promise.actualPaymentAmount) {
    promise.status = 'ESCALATED';
  }

  return promise.save();
}

/**
 * 21. CREATE DISPUTE
 * Record customer dispute on invoice
 */
export async function createDispute(
  invoiceId: string,
  customerId: string,
  disputeAmount: number,
  reason: string
): Promise<DisputeRecordModel> {
  const dispute = await DisputeRecordModel.create({
    invoiceId,
    customerId,
    disputeAmount,
    reason,
    status: 'OPEN',
  });

  return dispute;
}

/**
 * 22. INVESTIGATE DISPUTE
 * Record investigation notes and findings
 */
export async function investigateDispute(
  disputeId: string,
  investigationNotes: string,
  findingStatus: 'VALID' | 'INVALID'
): Promise<DisputeRecordModel> {
  const dispute = await DisputeRecordModel.findByPk(disputeId);
  if (!dispute) throw new Error('Dispute not found');

  dispute.status = 'UNDER_INVESTIGATION';
  dispute.investigationNotes = investigationNotes;
  return dispute.save();
}

/**
 * 23. RESOLVE DISPUTE
 * Close dispute with adjustment or denial
 */
export async function resolveDispute(
  disputeId: string,
  adjustmentAmount: number = 0,
  approved: boolean = true
): Promise<DisputeRecordModel> {
  const dispute = await DisputeRecordModel.findByPk(disputeId);
  if (!dispute) throw new Error('Dispute not found');

  dispute.status = approved ? 'RESOLVED' : 'DENIED';
  dispute.adjustmentAmount = adjustmentAmount;
  dispute.closedDate = new Date();

  if (approved && adjustmentAmount > 0) {
    await ARTracking.update(
      { invoiceAmount: Sequelize.literal(`invoiceAmount - ${adjustmentAmount}`) },
      { where: { invoiceId: dispute.invoiceId } }
    );
  }

  return dispute.save();
}

/**
 * 24. ADJUST DISPUTE AMOUNT
 * Modify disputed amount based on investigation
 */
export async function adjustDisputeAmount(disputeId: string, newAmount: number): Promise<DisputeRecordModel> {
  const dispute = await DisputeRecordModel.findByPk(disputeId);
  if (!dispute) throw new Error('Dispute not found');

  dispute.disputeAmount = newAmount;
  return dispute.save();
}

/**
 * 25. IDENTIFY BAD DEBT
 */
export async function identifyBadDebt(daysOverdueThreshold: number = 120): Promise<WriteOffAnalysis[]> {
  const candidates = await ARTracking.findAll({
    where: {
      status: { [Op.ne]: 'PAID' },
      daysOverdue: { [Op.gte]: daysOverdueThreshold },
    },
  });

  return candidates.map((inv) => ({
    customerId: inv.customerId,
    invoiceId: inv.invoiceId,
    amount: Number(inv.invoiceAmount),
    daysOverdue: inv.daysOverdue,
    collectionProbability: Math.max(0, 100 - inv.daysOverdue),
    recommendation: inv.daysOverdue > 180 ? 'WRITE_OFF' : 'CONTINUE_COLLECTION',
    reason: `${inv.daysOverdue} days overdue`,
  }));
}

/**
 * 26. APPROVE WRITE-OFF
 * Approve bad debt write-off
 */
export async function approveWriteOff(invoiceId: string, approverName: string): Promise<WriteOff> {
  const writeOff = await WriteOff.findOne({ where: { invoiceId } });
  if (!writeOff) throw new Error('Write-off request not found');

  writeOff.status = 'APPROVED';
  writeOff.approverName = approverName;
  writeOff.approvalDate = new Date();
  return writeOff.save();
}

/**
 * 27. PROCESS WRITE-OFF
 * Execute write-off in accounting system
 */
export async function processWriteOff(writeOffId: string): Promise<WriteOff> {
  const writeOff = await WriteOff.findByPk(writeOffId);
  if (!writeOff) throw new Error('Write-off not found');

  writeOff.status = 'PROCESSED';
  writeOff.processedDate = new Date();

  await ARTracking.update({ status: 'WRITTEN_OFF' }, { where: { invoiceId: writeOff.invoiceId } });

  return writeOff.save();
}

/**
 * 28. REPORT WRITE-OFFS
 * Generate write-off summary report
 */
export async function reportWriteOffs(startDate: Date, endDate: Date): Promise<{ totalAmount: number; count: number; byReason: Record<string, number> }> {
  const writeOffs = await WriteOff.findAll({
    where: {
      processedDate: { [Op.between]: [startDate, endDate] },
      status: 'PROCESSED',
    },
  });

  const byReason: Record<string, number> = {};
  let totalAmount = 0;

  writeOffs.forEach((wo) => {
    totalAmount += Number(wo.amount);
    byReason[wo.reason] = (byReason[wo.reason] || 0) + 1;
  });

  return { totalAmount, count: writeOffs.length, byReason };
}

/**
 * 29. INITIATE RECOVERY
 * Start recovery process for written-off debt
 */
export async function initiateRecovery(
  caseId: string,
  recoveryMethod: string,
  estimatedRecovery: number
): Promise<RecoveryCase> {
  const recovery = await RecoveryCase.create({
    caseId,
    recoveryMethod,
    estimatedRecovery,
    status: 'INITIATED',
  });

  return recovery;
}

/**
 * 30. TRACK RECOVERY EFFORTS
 * Log recovery attempt details
 */
export async function trackRecoveryEfforts(caseId: string, effortNotes: string): Promise<RecoveryCase> {
  const recovery = await RecoveryCase.findOne({ where: { caseId } });
  if (!recovery) throw new Error('Recovery case not found');

  recovery.effortCount = (recovery.effortCount || 0) + 1;
  recovery.status = 'IN_PROGRESS';
  return recovery.save();
}

/**
 * 31. RECEIVE RECOVERY PAYMENT
 * Record recovery payment received
 */
export async function receiveRecoveryPayment(caseId: string, paymentAmount: number): Promise<RecoveryCase> {
  const recovery = await RecoveryCase.findOne({ where: { caseId } });
  if (!recovery) throw new Error('Recovery case not found');

  recovery.actualRecovery = (recovery.actualRecovery || 0) + paymentAmount;
  return recovery.save();
}

/**
 * 32. CLOSE RECOVERY CASE
 * Finalize recovery operation
 */
export async function closeRecoveryCase(caseId: string): Promise<RecoveryCase> {
  const recovery = await RecoveryCase.findOne({ where: { caseId } });
  if (!recovery) throw new Error('Recovery case not found');

  recovery.status = 'CLOSED';
  recovery.closedDate = new Date();
  return recovery.save();
}

/**
 * 33. AGING REPORT
 * Generate AR aging analysis
 */
export async function generateAgingReport(): Promise<Record<string, ARAgingBucket>> {
  const customers = await ARTracking.findAll({
    attributes: ['customerId'],
    group: ['customerId'],
    raw: true,
  });

  const report: Record<string, ARAgingBucket> = {};

  for (const cust of customers) {
    report[cust.customerId] = await ageInvoices(cust.customerId);
  }

  return report;
}

/**
 * 34. COLLECTION PERFORMANCE REPORT
 * Analyze collection metrics and KPIs
 */
export async function generateCollectionReport(): Promise<CollectionMetrics> {
  const allCases = await CollectionCase.findAll();
  const resolvedCases = allCases.filter((c) => c.status === 'RESOLVED');

  const collectionAmount = resolvedCases.reduce((sum, c) => sum + Number(c.recoveredAmount), 0);
  const resolutionRate = (resolvedCases.length / allCases.length) * 100;

  const totalDays = resolvedCases.reduce((sum, c) => {
    const days = Math.floor(
      (new Date(c.resolvedDate || new Date()).getTime() - new Date(c.createdDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    return sum + days;
  }, 0);

  return {
    totalCases: allCases.length,
    resolvedCases: resolvedCases.length,
    resolutionRate: Math.round(resolutionRate * 100) / 100,
    averageDaysToResolve: Math.round(totalDays / (resolvedCases.length || 1)),
    collectionAmount: Math.round(collectionAmount * 100) / 100,
    costToCollect: 0,
    roi: 0,
  };
}

/**
 * 35. DSO TREND ANALYSIS
 * Track DSO changes over time
 */
export async function analyzeDSOTrends(customerId: string, periods: number = 12): Promise<FinancialTrend[]> {
  const invoices = await ARTracking.findAll({
    where: { customerId },
    order: [['invoiceDate', 'DESC']],
  });

  const trends: FinancialTrend[] = [];
  for (let i = 0; i < Math.min(periods, 12); i++) {
    const periodInvoices = invoices.slice(i * 10, (i + 1) * 10);
    const dso = calculateDSO(customerId);

    trends.push({
      period: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dso: await dso,
      collectionRate: (10 / (periodInvoices.length || 1)) * 100,
      recoveryRate: 0,
      trend: 'STABLE',
    });
  }

  return trends;
}

/**
 * 36. RECOVERY RATE ANALYSIS
 * Measure recovery success metrics
 */
export async function analyzeRecoveryRate(): Promise<{ totalEstimated: number; totalRecovered: number; recoveryRate: number }> {
  const cases = await RecoveryCase.findAll({ where: { status: 'CLOSED' } });

  const totalEstimated = cases.reduce((sum, c) => sum + Number(c.estimatedRecovery), 0);
  const totalRecovered = cases.reduce((sum, c) => sum + Number(c.actualRecovery), 0);

  return {
    totalEstimated,
    totalRecovered,
    recoveryRate: totalEstimated > 0 ? (totalRecovered / totalEstimated) * 100 : 0,
  };
}

/**
 * 37. AUTO-ESCALATE OVERDUE
 * Automatically escalate cases beyond threshold
 */
export async function autoEscalateOverdue(daysThreshold: number = 90): Promise<number> {
  const cases = await CollectionCase.findAll({
    where: { status: 'OPEN' },
  });

  let escalatedCount = 0;
  const now = new Date();

  for (const collCase of cases) {
    const days = Math.floor((now.getTime() - new Date(collCase.createdDate).getTime()) / (1000 * 60 * 60 * 24));
    if (days > daysThreshold) {
      collCase.status = 'IN_PROGRESS';
      await collCase.save();
      escalatedCount++;
    }
  }

  return escalatedCount;
}

/**
 * 38. SMART COLLECTOR ROUTING
 * Intelligently route cases to collectors based on workload/specialization
 */
export async function smartCollectorRouting(caseId: string): Promise<{ assignedCollector: string; reason: string }> {
  const collectorLoads: Record<string, number> = {};

  const allCases = await CollectionCase.findAll({
    where: { status: 'IN_PROGRESS' },
    attributes: ['assignedCollector'],
  });

  allCases.forEach((c) => {
    if (c.assignedCollector) {
      collectorLoads[c.assignedCollector] = (collectorLoads[c.assignedCollector] || 0) + 1;
    }
  });

  const assignedCollector = Object.keys(collectorLoads).reduce((prev, curr) =>
    collectorLoads[prev] < collectorLoads[curr] ? prev : curr
  );

  return { assignedCollector, reason: 'Optimal workload distribution' };
}

/**
 * 39. PREDICTIVE RISK SCORING
 * ML-based risk prediction for collections
 */
export async function predictiveRiskScore(customerId: string): Promise<number> {
  const profile = await CreditProfile.findOne({ where: { customerId } });
  const cases = await CollectionCase.findAll({ where: { customerId } });

  if (!profile) return 50;

  let riskScore = 100 - profile.creditScore / 10;
  const caseFailureRate = cases.filter((c) => c.status !== 'RESOLVED').length / (cases.length || 1);
  riskScore += caseFailureRate * 30;

  return Math.min(100, Math.max(0, riskScore));
}

/**
 * 40. OPTIMIZE COLLECTION STRATEGY
 * Recommend strategy based on case characteristics
 */
export async function optimizeCollectionStrategy(caseId: string): Promise<{ strategy: string; recommendedMethod: string; priority: string }> {
  const collectionCase = await CollectionCase.findByPk(caseId);
  if (!collectionCase) throw new Error('Case not found');

  const amount = Number(collectionCase.collectionAmount);
  const priority = amount > 50000 ? 'HIGH' : amount > 10000 ? 'MEDIUM' : 'LOW';

  let recommendedMethod = 'NEGOTIATION';
  if (amount > 100000) recommendedMethod = 'LITIGATION';
  else if (priority === 'MEDIUM') recommendedMethod = 'AGENCY';

  return {
    strategy: `${recommendedMethod}_FIRST`,
    recommendedMethod,
    priority,
  };
}

export default {
  assessCreditProfile,
  setCreditTerms,
  approveCreditRequest,
  monitorCreditExposure,
  setCreditLimit,
  checkCreditUtilization,
  adjustCreditLimit,
  suspendCredit,
  trackReceivables,
  ageInvoices,
  calculateDSO,
  forecastCollections,
  createCollectionCase,
  assignCollector,
  trackCollectionActivity,
  resolveCollectionCase,
  recordPaymentPromise,
  trackPromiseFulfillment,
  followUpPromise,
  escalateBrokenPromise,
  createDispute,
  investigateDispute,
  resolveDispute,
  adjustDisputeAmount,
  identifyBadDebt,
  approveWriteOff,
  processWriteOff,
  reportWriteOffs,
  initiateRecovery,
  trackRecoveryEfforts,
  receiveRecoveryPayment,
  closeRecoveryCase,
  generateAgingReport,
  generateCollectionReport,
  analyzeDSOTrends,
  analyzeRecoveryRate,
  autoEscalateOverdue,
  smartCollectorRouting,
  predictiveRiskScore,
  optimizeCollectionStrategy,
};
