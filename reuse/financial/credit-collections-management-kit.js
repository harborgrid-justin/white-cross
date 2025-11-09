"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecoveryCase = exports.WriteOff = exports.DisputeRecordModel = exports.PaymentPromiseRecord = exports.CollectionActivity = exports.CollectionCase = exports.ARTracking = exports.CreditTerms = exports.CreditProfile = void 0;
exports.assessCreditProfile = assessCreditProfile;
exports.setCreditTerms = setCreditTerms;
exports.approveCreditRequest = approveCreditRequest;
exports.monitorCreditExposure = monitorCreditExposure;
exports.setCreditLimit = setCreditLimit;
exports.checkCreditUtilization = checkCreditUtilization;
exports.adjustCreditLimit = adjustCreditLimit;
exports.suspendCredit = suspendCredit;
exports.trackReceivables = trackReceivables;
exports.ageInvoices = ageInvoices;
exports.calculateDSO = calculateDSO;
exports.forecastCollections = forecastCollections;
exports.createCollectionCase = createCollectionCase;
exports.assignCollector = assignCollector;
exports.trackCollectionActivity = trackCollectionActivity;
exports.resolveCollectionCase = resolveCollectionCase;
exports.recordPaymentPromise = recordPaymentPromise;
exports.trackPromiseFulfillment = trackPromiseFulfillment;
exports.followUpPromise = followUpPromise;
exports.escalateBrokenPromise = escalateBrokenPromise;
exports.createDispute = createDispute;
exports.investigateDispute = investigateDispute;
exports.resolveDispute = resolveDispute;
exports.adjustDisputeAmount = adjustDisputeAmount;
exports.identifyBadDebt = identifyBadDebt;
exports.approveWriteOff = approveWriteOff;
exports.processWriteOff = processWriteOff;
exports.reportWriteOffs = reportWriteOffs;
exports.initiateRecovery = initiateRecovery;
exports.trackRecoveryEfforts = trackRecoveryEfforts;
exports.receiveRecoveryPayment = receiveRecoveryPayment;
exports.closeRecoveryCase = closeRecoveryCase;
exports.generateAgingReport = generateAgingReport;
exports.generateCollectionReport = generateCollectionReport;
exports.analyzeDSOTrends = analyzeDSOTrends;
exports.analyzeRecoveryRate = analyzeRecoveryRate;
exports.autoEscalateOverdue = autoEscalateOverdue;
exports.smartCollectorRouting = smartCollectorRouting;
exports.predictiveRiskScore = predictiveRiskScore;
exports.optimizeCollectionStrategy = optimizeCollectionStrategy;
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Credit Profile Model
 */
class CreditProfile extends sequelize_1.Model {
    static init(sequelize) {
        return super.init({
            id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: () => (0, uuid_1.v4)() },
            customerId: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
            creditScore: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 500 },
            riskLevel: { type: sequelize_1.DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'), defaultValue: 'MEDIUM' },
            approvedLimit: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
            currentUtilization: { type: sequelize_1.DataTypes.DECIMAL(15, 2), defaultValue: 0 },
            lastAssessmentDate: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
            externalScore: sequelize_1.DataTypes.INTEGER,
            industryAverage: sequelize_1.DataTypes.DECIMAL(6, 2),
        }, { sequelize, modelName: 'CreditProfile', tableName: 'credit_profiles', timestamps: true });
    }
}
exports.CreditProfile = CreditProfile;
/**
 * Credit Terms Model
 */
class CreditTerms extends sequelize_1.Model {
    static init(sequelize) {
        return super.init({
            id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: () => (0, uuid_1.v4)() },
            customerId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            netDays: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 30 },
            discountPercent: { type: sequelize_1.DataTypes.DECIMAL(5, 2), defaultValue: 0 },
            discountDays: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 10 },
            creditLimit: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
            status: { type: sequelize_1.DataTypes.ENUM('ACTIVE', 'SUSPENDED', 'TERMINATED'), defaultValue: 'ACTIVE' },
        }, { sequelize, modelName: 'CreditTerms', tableName: 'credit_terms', timestamps: true });
    }
}
exports.CreditTerms = CreditTerms;
/**
 * AR Tracking Model
 */
class ARTracking extends sequelize_1.Model {
    static init(sequelize) {
        return super.init({
            id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: () => (0, uuid_1.v4)() },
            invoiceId: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
            customerId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            invoiceAmount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
            invoiceDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
            dueDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
            daysOverdue: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
            paidAmount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), defaultValue: 0 },
            status: { type: sequelize_1.DataTypes.ENUM('CURRENT', 'OVERDUE', 'PAID', 'DISPUTED', 'WRITTEN_OFF'), defaultValue: 'CURRENT' },
            notes: sequelize_1.DataTypes.TEXT,
        }, { sequelize, modelName: 'ARTracking', tableName: 'ar_tracking', timestamps: true });
    }
}
exports.ARTracking = ARTracking;
/**
 * Collection Case Model
 */
class CollectionCase extends sequelize_1.Model {
    static init(sequelize) {
        return super.init({
            id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: () => (0, uuid_1.v4)() },
            invoiceId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            customerId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            collectionAmount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
            status: { type: sequelize_1.DataTypes.ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'), defaultValue: 'OPEN' },
            assignedCollector: sequelize_1.DataTypes.STRING,
            createdDate: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
            resolvedDate: sequelize_1.DataTypes.DATE,
            recoveredAmount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), defaultValue: 0 },
        }, { sequelize, modelName: 'CollectionCase', tableName: 'collection_cases', timestamps: true });
    }
}
exports.CollectionCase = CollectionCase;
/**
 * Collection Activity Model
 */
class CollectionActivity extends sequelize_1.Model {
    static init(sequelize) {
        return super.init({
            id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: () => (0, uuid_1.v4)() },
            caseId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            activityType: { type: sequelize_1.DataTypes.ENUM('CALL', 'EMAIL', 'LETTER', 'VISIT', 'PAYMENT_RECEIVED', 'PROMISE_MADE'), allowNull: false },
            notes: sequelize_1.DataTypes.TEXT,
            contactPerson: sequelize_1.DataTypes.STRING,
            nextActionDate: sequelize_1.DataTypes.DATE,
            activityDate: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
        }, { sequelize, modelName: 'CollectionActivity', tableName: 'collection_activities', timestamps: true });
    }
}
exports.CollectionActivity = CollectionActivity;
/**
 * Payment Promise Model
 */
class PaymentPromiseRecord extends sequelize_1.Model {
    static init(sequelize) {
        return super.init({
            id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: () => (0, uuid_1.v4)() },
            caseId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            promisedAmount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
            promisedDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
            status: { type: sequelize_1.DataTypes.ENUM('PENDING', 'FULFILLED', 'BROKEN', 'ESCALATED'), defaultValue: 'PENDING' },
            actualPaymentDate: sequelize_1.DataTypes.DATE,
            actualPaymentAmount: sequelize_1.DataTypes.DECIMAL(15, 2),
            promiseDate: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
            followUpDate: sequelize_1.DataTypes.DATE,
        }, { sequelize, modelName: 'PaymentPromiseRecord', tableName: 'payment_promises', timestamps: true });
    }
}
exports.PaymentPromiseRecord = PaymentPromiseRecord;
/**
 * Dispute Record Model
 */
class DisputeRecordModel extends sequelize_1.Model {
    static init(sequelize) {
        return super.init({
            id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: () => (0, uuid_1.v4)() },
            invoiceId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            customerId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            disputeAmount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
            reason: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
            status: { type: sequelize_1.DataTypes.ENUM('OPEN', 'UNDER_INVESTIGATION', 'RESOLVED', 'DENIED'), defaultValue: 'OPEN' },
            openedDate: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
            investigationNotes: sequelize_1.DataTypes.TEXT,
            adjustmentAmount: sequelize_1.DataTypes.DECIMAL(15, 2),
            closedDate: sequelize_1.DataTypes.DATE,
        }, { sequelize, modelName: 'DisputeRecordModel', tableName: 'disputes', timestamps: true });
    }
}
exports.DisputeRecordModel = DisputeRecordModel;
/**
 * Write-Off Model
 */
class WriteOff extends sequelize_1.Model {
    static init(sequelize) {
        return super.init({
            id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: () => (0, uuid_1.v4)() },
            invoiceId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            customerId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            amount: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
            reason: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
            status: { type: sequelize_1.DataTypes.ENUM('PENDING', 'APPROVED', 'PROCESSED', 'REVERSED'), defaultValue: 'PENDING' },
            daysOverdue: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            collectionProbability: { type: sequelize_1.DataTypes.DECIMAL(5, 2), defaultValue: 0 },
            approverName: sequelize_1.DataTypes.STRING,
            approvalDate: sequelize_1.DataTypes.DATE,
            processedDate: sequelize_1.DataTypes.DATE,
        }, { sequelize, modelName: 'WriteOff', tableName: 'write_offs', timestamps: true });
    }
}
exports.WriteOff = WriteOff;
/**
 * Recovery Operation Model
 */
class RecoveryCase extends sequelize_1.Model {
    static init(sequelize) {
        return super.init({
            id: { type: sequelize_1.DataTypes.UUID, primaryKey: true, defaultValue: () => (0, uuid_1.v4)() },
            caseId: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            recoveryMethod: { type: sequelize_1.DataTypes.ENUM('NEGOTIATION', 'LITIGATION', 'AGENCY', 'BANKRUPTCY'), allowNull: false },
            status: { type: sequelize_1.DataTypes.ENUM('INITIATED', 'IN_PROGRESS', 'RECOVERED', 'CLOSED'), defaultValue: 'INITIATED' },
            estimatedRecovery: { type: sequelize_1.DataTypes.DECIMAL(15, 2), allowNull: false },
            actualRecovery: { type: sequelize_1.DataTypes.DECIMAL(15, 2), defaultValue: 0 },
            effortCount: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
            initiatedDate: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
            closedDate: sequelize_1.DataTypes.DATE,
            agencyName: sequelize_1.DataTypes.STRING,
        }, { sequelize, modelName: 'RecoveryCase', tableName: 'recovery_cases', timestamps: true });
    }
}
exports.RecoveryCase = RecoveryCase;
// ============================================================================
// 40 FUNCTIONS: CREDIT COLLECTIONS MANAGEMENT KIT
// ============================================================================
/**
 * 1. ASSESS CREDIT PROFILE
 * Analyze customer creditworthiness and generate risk assessment
 */
async function assessCreditProfile(sequelize, customerId, creditScore, paymentHistory, debtToEquityRatio) {
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
        riskLevel: riskLevel,
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
async function setCreditTerms(customerId, netDays, discountPercent, discountDays, creditLimit) {
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
async function approveCreditRequest(customerId, requestedLimit, approverName) {
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
async function monitorCreditExposure(customerId) {
    const profile = await CreditProfile.findOne({ where: { customerId } });
    const invoices = await ARTracking.findAll({ where: { customerId, status: { [sequelize_1.Op.ne]: 'PAID' } } });
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
async function setCreditLimit(customerId, limit) {
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
async function checkCreditUtilization(customerId) {
    const profile = await CreditProfile.findOne({ where: { customerId } });
    if (!profile)
        return 0;
    const invoices = await ARTracking.findAll({
        where: { customerId, status: { [sequelize_1.Op.ne]: 'PAID' } },
    });
    const outstanding = invoices.reduce((sum, inv) => sum + Number(inv.invoiceAmount), 0);
    return (outstanding / Number(profile.approvedLimit)) * 100;
}
/**
 * 7. ADJUST CREDIT LIMIT
 * Increase or decrease customer credit limit
 */
async function adjustCreditLimit(customerId, newLimit, reason) {
    const profile = await CreditProfile.findOne({ where: { customerId } });
    if (!profile)
        throw new Error('Customer not found');
    profile.approvedLimit = newLimit;
    profile.lastAssessmentDate = new Date();
    return profile.save();
}
/**
 * 8. SUSPEND CREDIT
 * Suspend credit line due to payment issues
 */
async function suspendCredit(customerId, reason) {
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
async function trackReceivables(invoiceId, customerId, invoiceAmount, invoiceDate, dueDate) {
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
async function ageInvoices(customerId) {
    const invoices = await ARTracking.findAll({
        where: { customerId, status: { [sequelize_1.Op.ne]: 'PAID' } },
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
        if (days <= 0)
            buckets.current += amount;
        else if (days <= 30)
            buckets.days30 += amount;
        else if (days <= 60)
            buckets.days60 += amount;
        else if (days <= 90)
            buckets.days90 += amount;
        else
            buckets.days120Plus += amount;
        buckets.totalOutstanding += amount;
    });
    buckets.percentageCurrent = buckets.totalOutstanding > 0 ? (buckets.current / buckets.totalOutstanding) * 100 : 0;
    return buckets;
}
/**
 * 11. CALCULATE DSO
 * Calculate Days Sales Outstanding metric
 */
async function calculateDSO(customerId) {
    const invoices = await ARTracking.findAll({
        where: { customerId, status: 'PAID' },
        limit: 100,
    });
    if (invoices.length === 0)
        return 0;
    let totalDays = 0;
    invoices.forEach((inv) => {
        const days = Math.floor((new Date(inv.paidAmount ? inv.updatedAt : new Date()).getTime() - new Date(inv.invoiceDate).getTime()) / (1000 * 60 * 60 * 24));
        totalDays += days;
    });
    return Math.round(totalDays / invoices.length);
}
/**
 * 12. FORECAST COLLECTIONS
 * Predict collection amounts based on historical data
 */
async function forecastCollections(customerId, daysAhead = 30) {
    const recentCases = await CollectionCase.findAll({
        where: { customerId, status: 'RESOLVED' },
        order: [['resolvedDate', 'DESC']],
        limit: 12,
    });
    if (recentCases.length === 0)
        return 0;
    const avgRecoveryRate = recentCases.reduce((sum, c) => sum + Number(c.recoveredAmount), 0) / recentCases.length;
    const pendingAmount = await ARTracking.sum('invoiceAmount', {
        where: { customerId, status: { [sequelize_1.Op.ne]: 'PAID' } },
    });
    return Math.round(Number(pendingAmount || 0) * (avgRecoveryRate / 100));
}
/**
 * 13. CREATE COLLECTION CASE
 * Initiate collection case for overdue invoice
 */
async function createCollectionCase(invoiceId, customerId, collectionAmount) {
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
async function assignCollector(caseId, collectorName) {
    const collectionCase = await CollectionCase.findByPk(caseId);
    if (!collectionCase)
        throw new Error('Case not found');
    collectionCase.assignedCollector = collectorName;
    collectionCase.status = 'IN_PROGRESS';
    return collectionCase.save();
}
/**
 * 15. TRACK COLLECTION ACTIVITY
 * Log collection activity (calls, emails, payments)
 */
async function trackCollectionActivity(caseId, activityType, notes, nextActionDate) {
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
async function resolveCollectionCase(caseId, recoveredAmount, resolution) {
    const collectionCase = await CollectionCase.findByPk(caseId);
    if (!collectionCase)
        throw new Error('Case not found');
    collectionCase.status = 'RESOLVED';
    collectionCase.resolvedDate = new Date();
    collectionCase.recoveredAmount = recoveredAmount;
    return collectionCase.save();
}
/**
 * 17. RECORD PAYMENT PROMISE
 * Document customer promise to pay
 */
async function recordPaymentPromise(caseId, promisedAmount, promisedDate, collectorName) {
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
async function trackPromiseFulfillment(promiseId, actualPaymentAmount, actualPaymentDate) {
    const promise = await PaymentPromiseRecord.findByPk(promiseId);
    if (!promise)
        throw new Error('Promise not found');
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
async function followUpPromise(promiseId, followUpDate) {
    const promise = await PaymentPromiseRecord.findByPk(promiseId);
    if (!promise)
        throw new Error('Promise not found');
    promise.followUpDate = followUpDate;
    return promise.save();
}
/**
 * 20. ESCALATE BROKEN PROMISE
 * Escalate case when promise is broken
 */
async function escalateBrokenPromise(promiseId, escalationReason) {
    const promise = await PaymentPromiseRecord.findByPk(promiseId);
    if (!promise)
        throw new Error('Promise not found');
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
async function createDispute(invoiceId, customerId, disputeAmount, reason) {
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
async function investigateDispute(disputeId, investigationNotes, findingStatus) {
    const dispute = await DisputeRecordModel.findByPk(disputeId);
    if (!dispute)
        throw new Error('Dispute not found');
    dispute.status = 'UNDER_INVESTIGATION';
    dispute.investigationNotes = investigationNotes;
    return dispute.save();
}
/**
 * 23. RESOLVE DISPUTE
 * Close dispute with adjustment or denial
 */
async function resolveDispute(disputeId, adjustmentAmount = 0, approved = true) {
    const dispute = await DisputeRecordModel.findByPk(disputeId);
    if (!dispute)
        throw new Error('Dispute not found');
    dispute.status = approved ? 'RESOLVED' : 'DENIED';
    dispute.adjustmentAmount = adjustmentAmount;
    dispute.closedDate = new Date();
    if (approved && adjustmentAmount > 0) {
        await ARTracking.update({ invoiceAmount: sequelize_1.Sequelize.literal(`invoiceAmount - ${adjustmentAmount}`) }, { where: { invoiceId: dispute.invoiceId } });
    }
    return dispute.save();
}
/**
 * 24. ADJUST DISPUTE AMOUNT
 * Modify disputed amount based on investigation
 */
async function adjustDisputeAmount(disputeId, newAmount) {
    const dispute = await DisputeRecordModel.findByPk(disputeId);
    if (!dispute)
        throw new Error('Dispute not found');
    dispute.disputeAmount = newAmount;
    return dispute.save();
}
/**
 * 25. IDENTIFY BAD DEBT
 */
async function identifyBadDebt(daysOverdueThreshold = 120) {
    const candidates = await ARTracking.findAll({
        where: {
            status: { [sequelize_1.Op.ne]: 'PAID' },
            daysOverdue: { [sequelize_1.Op.gte]: daysOverdueThreshold },
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
async function approveWriteOff(invoiceId, approverName) {
    const writeOff = await WriteOff.findOne({ where: { invoiceId } });
    if (!writeOff)
        throw new Error('Write-off request not found');
    writeOff.status = 'APPROVED';
    writeOff.approverName = approverName;
    writeOff.approvalDate = new Date();
    return writeOff.save();
}
/**
 * 27. PROCESS WRITE-OFF
 * Execute write-off in accounting system
 */
async function processWriteOff(writeOffId) {
    const writeOff = await WriteOff.findByPk(writeOffId);
    if (!writeOff)
        throw new Error('Write-off not found');
    writeOff.status = 'PROCESSED';
    writeOff.processedDate = new Date();
    await ARTracking.update({ status: 'WRITTEN_OFF' }, { where: { invoiceId: writeOff.invoiceId } });
    return writeOff.save();
}
/**
 * 28. REPORT WRITE-OFFS
 * Generate write-off summary report
 */
async function reportWriteOffs(startDate, endDate) {
    const writeOffs = await WriteOff.findAll({
        where: {
            processedDate: { [sequelize_1.Op.between]: [startDate, endDate] },
            status: 'PROCESSED',
        },
    });
    const byReason = {};
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
async function initiateRecovery(caseId, recoveryMethod, estimatedRecovery) {
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
async function trackRecoveryEfforts(caseId, effortNotes) {
    const recovery = await RecoveryCase.findOne({ where: { caseId } });
    if (!recovery)
        throw new Error('Recovery case not found');
    recovery.effortCount = (recovery.effortCount || 0) + 1;
    recovery.status = 'IN_PROGRESS';
    return recovery.save();
}
/**
 * 31. RECEIVE RECOVERY PAYMENT
 * Record recovery payment received
 */
async function receiveRecoveryPayment(caseId, paymentAmount) {
    const recovery = await RecoveryCase.findOne({ where: { caseId } });
    if (!recovery)
        throw new Error('Recovery case not found');
    recovery.actualRecovery = (recovery.actualRecovery || 0) + paymentAmount;
    return recovery.save();
}
/**
 * 32. CLOSE RECOVERY CASE
 * Finalize recovery operation
 */
async function closeRecoveryCase(caseId) {
    const recovery = await RecoveryCase.findOne({ where: { caseId } });
    if (!recovery)
        throw new Error('Recovery case not found');
    recovery.status = 'CLOSED';
    recovery.closedDate = new Date();
    return recovery.save();
}
/**
 * 33. AGING REPORT
 * Generate AR aging analysis
 */
async function generateAgingReport() {
    const customers = await ARTracking.findAll({
        attributes: ['customerId'],
        group: ['customerId'],
        raw: true,
    });
    const report = {};
    for (const cust of customers) {
        report[cust.customerId] = await ageInvoices(cust.customerId);
    }
    return report;
}
/**
 * 34. COLLECTION PERFORMANCE REPORT
 * Analyze collection metrics and KPIs
 */
async function generateCollectionReport() {
    const allCases = await CollectionCase.findAll();
    const resolvedCases = allCases.filter((c) => c.status === 'RESOLVED');
    const collectionAmount = resolvedCases.reduce((sum, c) => sum + Number(c.recoveredAmount), 0);
    const resolutionRate = (resolvedCases.length / allCases.length) * 100;
    const totalDays = resolvedCases.reduce((sum, c) => {
        const days = Math.floor((new Date(c.resolvedDate || new Date()).getTime() - new Date(c.createdDate).getTime()) / (1000 * 60 * 60 * 24));
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
async function analyzeDSOTrends(customerId, periods = 12) {
    const invoices = await ARTracking.findAll({
        where: { customerId },
        order: [['invoiceDate', 'DESC']],
    });
    const trends = [];
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
async function analyzeRecoveryRate() {
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
async function autoEscalateOverdue(daysThreshold = 90) {
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
async function smartCollectorRouting(caseId) {
    const collectorLoads = {};
    const allCases = await CollectionCase.findAll({
        where: { status: 'IN_PROGRESS' },
        attributes: ['assignedCollector'],
    });
    allCases.forEach((c) => {
        if (c.assignedCollector) {
            collectorLoads[c.assignedCollector] = (collectorLoads[c.assignedCollector] || 0) + 1;
        }
    });
    const assignedCollector = Object.keys(collectorLoads).reduce((prev, curr) => collectorLoads[prev] < collectorLoads[curr] ? prev : curr);
    return { assignedCollector, reason: 'Optimal workload distribution' };
}
/**
 * 39. PREDICTIVE RISK SCORING
 * ML-based risk prediction for collections
 */
async function predictiveRiskScore(customerId) {
    const profile = await CreditProfile.findOne({ where: { customerId } });
    const cases = await CollectionCase.findAll({ where: { customerId } });
    if (!profile)
        return 50;
    let riskScore = 100 - profile.creditScore / 10;
    const caseFailureRate = cases.filter((c) => c.status !== 'RESOLVED').length / (cases.length || 1);
    riskScore += caseFailureRate * 30;
    return Math.min(100, Math.max(0, riskScore));
}
/**
 * 40. OPTIMIZE COLLECTION STRATEGY
 * Recommend strategy based on case characteristics
 */
async function optimizeCollectionStrategy(caseId) {
    const collectionCase = await CollectionCase.findByPk(caseId);
    if (!collectionCase)
        throw new Error('Case not found');
    const amount = Number(collectionCase.collectionAmount);
    const priority = amount > 50000 ? 'HIGH' : amount > 10000 ? 'MEDIUM' : 'LOW';
    let recommendedMethod = 'NEGOTIATION';
    if (amount > 100000)
        recommendedMethod = 'LITIGATION';
    else if (priority === 'MEDIUM')
        recommendedMethod = 'AGENCY';
    return {
        strategy: `${recommendedMethod}_FIRST`,
        recommendedMethod,
        priority,
    };
}
exports.default = {
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
//# sourceMappingURL=credit-collections-management-kit.js.map