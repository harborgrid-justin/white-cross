/**
 * LOC: REVREC001
 * File: /reuse/edwards/financial/revenue-recognition-billing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../../financial/general-ledger-operations-kit (GL posting)
 *
 * DOWNSTREAM (imported by):
 *   - Backend revenue modules
 *   - Contract management services
 *   - Billing and invoicing modules
 *   - Financial reporting modules
 */
/**
 * File: /reuse/edwards/financial/revenue-recognition-billing-kit.ts
 * Locator: WC-EDW-REVREC-001
 * Purpose: Comprehensive Revenue Recognition & Billing Operations - ASC 606 compliant revenue management, performance obligations, contract modifications
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit
 * Downstream: ../backend/revenue/*, Contract Services, Billing Services, Financial Reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 functions for ASC 606 compliance, performance obligations, revenue allocation, contract modifications, deferred/unbilled revenue, milestone billing, subscription management
 *
 * LLM Context: Enterprise-grade revenue recognition for Oracle JD Edwards EnterpriseOne compatibility.
 * Provides comprehensive ASC 606 revenue recognition, five-step model implementation, contract identification,
 * performance obligation tracking, transaction price allocation, revenue scheduling, contract modifications,
 * deferred revenue management, unbilled revenue tracking, milestone billing, subscription management,
 * variable consideration, contract assets/liabilities, revenue reversal, and multi-element arrangements.
 */
import { Sequelize, Transaction } from 'sequelize';
interface PerformanceObligation {
    obligationId: number;
    contractId: number;
    obligationNumber: string;
    description: string;
    obligationType: 'goods' | 'services' | 'license' | 'subscription';
    allocatedAmount: number;
    recognizedRevenue: number;
    remainingRevenue: number;
    startDate: Date;
    endDate: Date;
    completionPercent: number;
    status: 'not-started' | 'in-progress' | 'completed' | 'cancelled';
    satisfactionMethod: 'point-in-time' | 'over-time';
    transferOfControl: 'customer-accepted' | 'delivered' | 'continuous';
}
interface RevenueAllocation {
    allocationId: number;
    contractId: number;
    obligationId: number;
    standaloneSellingPrice: number;
    relativeSellingPrice: number;
    allocatedAmount: number;
    allocationPercent: number;
    allocationMethod: 'relative' | 'adjusted-market' | 'expected-cost-plus-margin' | 'residual';
    adjustmentReason?: string;
}
interface RevenueSchedule {
    scheduleId: number;
    contractId: number;
    obligationId: number;
    fiscalYear: number;
    fiscalPeriod: number;
    scheduleDate: Date;
    scheduledAmount: number;
    recognizedAmount: number;
    remainingAmount: number;
    status: 'scheduled' | 'recognized' | 'adjusted' | 'reversed';
    accountingEntryId?: number;
}
interface DeferredRevenue {
    deferredId: number;
    contractId: number;
    obligationId: number;
    invoiceId?: number;
    billedAmount: number;
    recognizedAmount: number;
    deferredAmount: number;
    deferralDate: Date;
    accountCode: string;
    liabilityAccountCode: string;
    status: 'deferred' | 'partially-recognized' | 'fully-recognized';
}
interface UnbilledRevenue {
    unbilledId: number;
    contractId: number;
    obligationId: number;
    recognizedAmount: number;
    billedAmount: number;
    unbilledAmount: number;
    recognitionDate: Date;
    assetAccountCode: string;
    revenueAccountCode: string;
    status: 'unbilled' | 'partially-billed' | 'fully-billed';
}
interface ContractModification {
    modificationId: number;
    contractId: number;
    modificationNumber: string;
    modificationDate: Date;
    modificationType: 'additional-goods' | 'price-change' | 'scope-change' | 'termination';
    accountingTreatment: 'separate-contract' | 'cumulative-catch-up' | 'prospective';
    originalValue: number;
    modifiedValue: number;
    valueChange: number;
    description: string;
    approvedBy: string;
    effectiveDate: Date;
}
interface SubscriptionRevenue {
    subscriptionId: number;
    contractId: number;
    customerId: number;
    subscriptionNumber: string;
    startDate: Date;
    endDate: Date;
    billingCycle: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
    periodicAmount: number;
    totalValue: number;
    recognizedRevenue: number;
    deferredRevenue: number;
    status: 'active' | 'suspended' | 'cancelled' | 'expired';
    autoRenew: boolean;
    renewalTerms?: string;
}
interface VariableConsideration {
    variableId: number;
    contractId: number;
    obligationId: number;
    considerationType: 'volume-discount' | 'performance-bonus' | 'penalty' | 'rebate' | 'royalty';
    estimatedAmount: number;
    constraintApplied: number;
    recognizedAmount: number;
    constraintMethod: 'most-likely' | 'expected-value';
    constraintReason: string;
    reassessmentDate: Date;
}
interface RevenueReconciliation {
    reconciliationId: number;
    fiscalYear: number;
    fiscalPeriod: number;
    billedRevenue: number;
    recognizedRevenue: number;
    deferredRevenue: number;
    unbilledRevenue: number;
    variance: number;
    variancePercent: number;
    status: 'balanced' | 'variance' | 'under-review';
    reconciledBy?: string;
    reconciledAt?: Date;
}
export declare class CreateRevenueContractDto {
    contractNumber: string;
    customerId: number;
    contractDate: Date;
    startDate: Date;
    endDate: Date;
    totalContractValue: number;
    recognitionMethod: string;
    contractType: string;
    performanceObligations: PerformanceObligation[];
}
export declare class CreatePerformanceObligationDto {
    contractId: number;
    description: string;
    obligationType: string;
    standaloneSellingPrice: number;
    startDate: Date;
    endDate: Date;
    satisfactionMethod: string;
}
export declare class RevenueRecognitionRequestDto {
    contractId: number;
    obligationId: number;
    recognitionDate: Date;
    recognitionAmount: number;
    userId: string;
}
export declare class ContractModificationDto {
    contractId: number;
    modificationType: string;
    accountingTreatment: string;
    modifiedValue: number;
    description: string;
    effectiveDate: Date;
}
/**
 * Sequelize model for Revenue Contracts with ASC 606 compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RevenueContract model
 *
 * @example
 * ```typescript
 * const RevenueContract = createRevenueContractModel(sequelize);
 * const contract = await RevenueContract.create({
 *   contractNumber: 'RC-2024-001',
 *   customerId: 100,
 *   totalContractValue: 100000,
 *   recognitionMethod: 'over-time'
 * });
 * ```
 */
export declare const createRevenueContractModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        contractNumber: string;
        customerId: number;
        customerName: string;
        contractDate: Date;
        startDate: Date;
        endDate: Date;
        totalContractValue: number;
        status: string;
        recognitionMethod: string;
        contractType: string;
        terms: string;
        metadata: Record<string, any>;
        createdBy: string;
        updatedBy: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Performance Obligations per ASC 606.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PerformanceObligation model
 *
 * @example
 * ```typescript
 * const PerformanceObligation = createPerformanceObligationModel(sequelize);
 * const obligation = await PerformanceObligation.create({
 *   contractId: 1,
 *   description: 'Software license',
 *   obligationType: 'license',
 *   allocatedAmount: 50000
 * });
 * ```
 */
export declare const createPerformanceObligationModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        contractId: number;
        obligationNumber: string;
        description: string;
        obligationType: string;
        allocatedAmount: number;
        recognizedRevenue: number;
        remainingRevenue: number;
        startDate: Date;
        endDate: Date;
        completionPercent: number;
        status: string;
        satisfactionMethod: string;
        transferOfControl: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Revenue Schedules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RevenueSchedule model
 *
 * @example
 * ```typescript
 * const RevenueSchedule = createRevenueScheduleModel(sequelize);
 * const schedule = await RevenueSchedule.create({
 *   contractId: 1,
 *   obligationId: 1,
 *   scheduleDate: new Date('2024-01-31'),
 *   scheduledAmount: 5000
 * });
 * ```
 */
export declare const createRevenueScheduleModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        contractId: number;
        obligationId: number;
        fiscalYear: number;
        fiscalPeriod: number;
        scheduleDate: Date;
        scheduledAmount: number;
        recognizedAmount: number;
        remainingAmount: number;
        status: string;
        accountingEntryId: number | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new revenue contract with ASC 606 compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateRevenueContractDto} contractData - Contract data
 * @param {string} userId - User creating the contract
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created revenue contract
 *
 * @example
 * ```typescript
 * const contract = await createRevenueContract(sequelize, {
 *   contractNumber: 'RC-2024-001',
 *   customerId: 100,
 *   contractDate: new Date(),
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   totalContractValue: 120000,
 *   recognitionMethod: 'over-time',
 *   contractType: 'subscription'
 * }, 'user123');
 * ```
 */
export declare const createRevenueContract: (sequelize: Sequelize, contractData: CreateRevenueContractDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Activates a revenue contract and initiates revenue recognition.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {string} userId - User activating the contract
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Activated contract
 *
 * @example
 * ```typescript
 * const activated = await activateRevenueContract(sequelize, 1, 'user123');
 * ```
 */
export declare const activateRevenueContract: (sequelize: Sequelize, contractId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Creates a performance obligation for a contract.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreatePerformanceObligationDto} obligationData - Obligation data
 * @param {string} userId - User creating the obligation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created performance obligation
 *
 * @example
 * ```typescript
 * const obligation = await createPerformanceObligation(sequelize, {
 *   contractId: 1,
 *   description: 'Software maintenance services',
 *   obligationType: 'services',
 *   standaloneSellingPrice: 60000,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   satisfactionMethod: 'over-time'
 * }, 'user123');
 * ```
 */
export declare const createPerformanceObligation: (sequelize: Sequelize, obligationData: CreatePerformanceObligationDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Allocates transaction price to performance obligations using relative standalone selling price method.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {string} userId - User performing allocation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<RevenueAllocation[]>} Revenue allocations
 *
 * @example
 * ```typescript
 * const allocations = await allocateTransactionPrice(sequelize, 1, 'user123');
 * ```
 */
export declare const allocateTransactionPrice: (sequelize: Sequelize, contractId: number, userId: string, transaction?: Transaction) => Promise<RevenueAllocation[]>;
/**
 * Updates performance obligation completion percentage.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} obligationId - Obligation ID
 * @param {number} completionPercent - Completion percentage (0-100)
 * @param {string} userId - User updating completion
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated obligation
 *
 * @example
 * ```typescript
 * const updated = await updatePerformanceObligationCompletion(sequelize, 1, 75, 'user123');
 * ```
 */
export declare const updatePerformanceObligationCompletion: (sequelize: Sequelize, obligationId: number, completionPercent: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Generates revenue recognition schedule for a performance obligation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} obligationId - Performance obligation ID
 * @param {string} userId - User generating schedule
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<RevenueSchedule[]>} Generated revenue schedules
 *
 * @example
 * ```typescript
 * const schedules = await generateRevenueSchedule(sequelize, 1, 'user123');
 * ```
 */
export declare const generateRevenueSchedule: (sequelize: Sequelize, obligationId: number, userId: string, transaction?: Transaction) => Promise<RevenueSchedule[]>;
/**
 * Recognizes revenue for a performance obligation based on completion percentage.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RevenueRecognitionRequestDto} recognitionData - Recognition data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Recognition result
 *
 * @example
 * ```typescript
 * const result = await recognizeRevenue(sequelize, {
 *   contractId: 1,
 *   obligationId: 1,
 *   recognitionDate: new Date(),
 *   recognitionAmount: 10000,
 *   userId: 'user123'
 * });
 * ```
 */
export declare const recognizeRevenue: (sequelize: Sequelize, recognitionData: RevenueRecognitionRequestDto, transaction?: Transaction) => Promise<any>;
/**
 * Recognizes revenue based on milestone completion.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} milestoneId - Milestone ID
 * @param {Date} recognitionDate - Recognition date
 * @param {string} userId - User recognizing revenue
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Recognition result
 *
 * @example
 * ```typescript
 * const result = await recognizeMilestoneRevenue(sequelize, 1, new Date(), 'user123');
 * ```
 */
export declare const recognizeMilestoneRevenue: (sequelize: Sequelize, milestoneId: number, recognitionDate: Date, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Processes automatic revenue recognition for scheduled amounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - Recognition cutoff date
 * @param {string} userId - User processing recognition
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Recognition processing result
 *
 * @example
 * ```typescript
 * const result = await processScheduledRevenueRecognition(sequelize, new Date('2024-01-31'), 'user123');
 * ```
 */
export declare const processScheduledRevenueRecognition: (sequelize: Sequelize, asOfDate: Date, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Reverses recognized revenue for a performance obligation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} scheduleId - Revenue schedule ID
 * @param {string} reversalReason - Reason for reversal
 * @param {string} userId - User reversing revenue
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reversal result
 *
 * @example
 * ```typescript
 * const result = await reverseRevenueRecognition(sequelize, 1, 'Customer contract cancelled', 'user123');
 * ```
 */
export declare const reverseRevenueRecognition: (sequelize: Sequelize, scheduleId: number, reversalReason: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Records deferred revenue when invoice exceeds recognized revenue.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {number} obligationId - Obligation ID
 * @param {number} invoiceId - Invoice ID
 * @param {number} billedAmount - Amount billed
 * @param {string} userId - User recording deferred revenue
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<DeferredRevenue>} Deferred revenue entry
 *
 * @example
 * ```typescript
 * const deferred = await recordDeferredRevenue(sequelize, 1, 1, 100, 50000, 'user123');
 * ```
 */
export declare const recordDeferredRevenue: (sequelize: Sequelize, contractId: number, obligationId: number, invoiceId: number, billedAmount: number, userId: string, transaction?: Transaction) => Promise<DeferredRevenue>;
/**
 * Records unbilled revenue (contract asset) when recognized revenue exceeds billing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {number} obligationId - Obligation ID
 * @param {number} recognizedAmount - Amount recognized
 * @param {number} billedAmount - Amount billed
 * @param {string} userId - User recording unbilled revenue
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<UnbilledRevenue>} Unbilled revenue entry
 *
 * @example
 * ```typescript
 * const unbilled = await recordUnbilledRevenue(sequelize, 1, 1, 50000, 30000, 'user123');
 * ```
 */
export declare const recordUnbilledRevenue: (sequelize: Sequelize, contractId: number, obligationId: number, recognizedAmount: number, billedAmount: number, userId: string, transaction?: Transaction) => Promise<UnbilledRevenue>;
/**
 * Reconciles deferred and unbilled revenue balances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} userId - User performing reconciliation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<RevenueReconciliation>} Reconciliation result
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileDeferredUnbilledRevenue(sequelize, 2024, 1, 'user123');
 * ```
 */
export declare const reconcileDeferredUnbilledRevenue: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, userId: string, transaction?: Transaction) => Promise<RevenueReconciliation>;
/**
 * Processes contract modification with appropriate accounting treatment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ContractModificationDto} modificationData - Modification data
 * @param {string} userId - User processing modification
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ContractModification>} Contract modification
 *
 * @example
 * ```typescript
 * const modification = await processContractModification(sequelize, {
 *   contractId: 1,
 *   modificationType: 'additional-goods',
 *   accountingTreatment: 'separate-contract',
 *   modifiedValue: 150000,
 *   description: 'Added premium support',
 *   effectiveDate: new Date('2024-06-01')
 * }, 'user123');
 * ```
 */
export declare const processContractModification: (sequelize: Sequelize, modificationData: ContractModificationDto, userId: string, transaction?: Transaction) => Promise<ContractModification>;
/**
 * Applies cumulative catch-up adjustment for contract modification.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} modificationId - Modification ID
 * @param {string} userId - User applying adjustment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Adjustment result
 *
 * @example
 * ```typescript
 * const result = await applyCumulativeCatchUpAdjustment(sequelize, 1, 'user123');
 * ```
 */
export declare const applyCumulativeCatchUpAdjustment: (sequelize: Sequelize, modificationId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Creates a subscription revenue contract.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {any} subscriptionData - Subscription data
 * @param {string} userId - User creating subscription
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SubscriptionRevenue>} Created subscription
 *
 * @example
 * ```typescript
 * const subscription = await createSubscriptionRevenue(sequelize, {
 *   customerId: 100,
 *   subscriptionNumber: 'SUB-2024-001',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   billingCycle: 'monthly',
 *   periodicAmount: 1000,
 *   autoRenew: true
 * }, 'user123');
 * ```
 */
export declare const createSubscriptionRevenue: (sequelize: Sequelize, subscriptionData: any, userId: string, transaction?: Transaction) => Promise<SubscriptionRevenue>;
/**
 * Processes subscription renewal.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} subscriptionId - Subscription ID
 * @param {Date} renewalDate - Renewal date
 * @param {string} userId - User processing renewal
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SubscriptionRevenue>} Renewed subscription
 *
 * @example
 * ```typescript
 * const renewed = await renewSubscription(sequelize, 1, new Date('2025-01-01'), 'user123');
 * ```
 */
export declare const renewSubscription: (sequelize: Sequelize, subscriptionId: number, renewalDate: Date, userId: string, transaction?: Transaction) => Promise<SubscriptionRevenue>;
/**
 * Cancels a subscription and handles revenue implications.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} subscriptionId - Subscription ID
 * @param {Date} cancellationDate - Cancellation date
 * @param {string} cancellationReason - Reason for cancellation
 * @param {string} userId - User cancelling subscription
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cancellation result
 *
 * @example
 * ```typescript
 * const result = await cancelSubscription(sequelize, 1, new Date(), 'Customer request', 'user123');
 * ```
 */
export declare const cancelSubscription: (sequelize: Sequelize, subscriptionId: number, cancellationDate: Date, cancellationReason: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Estimates variable consideration using expected value or most likely amount method.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {number} obligationId - Obligation ID
 * @param {any} variableData - Variable consideration data
 * @param {string} userId - User estimating consideration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<VariableConsideration>} Variable consideration estimate
 *
 * @example
 * ```typescript
 * const variable = await estimateVariableConsideration(sequelize, 1, 1, {
 *   considerationType: 'performance-bonus',
 *   scenarios: [
 *     { amount: 10000, probability: 0.3 },
 *     { amount: 5000, probability: 0.5 },
 *     { amount: 0, probability: 0.2 }
 *   ],
 *   constraintMethod: 'expected-value'
 * }, 'user123');
 * ```
 */
export declare const estimateVariableConsideration: (sequelize: Sequelize, contractId: number, obligationId: number, variableData: any, userId: string, transaction?: Transaction) => Promise<VariableConsideration>;
/**
 * Reassesses variable consideration estimates.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} variableId - Variable consideration ID
 * @param {any} updatedData - Updated estimate data
 * @param {string} userId - User reassessing
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<VariableConsideration>} Updated variable consideration
 *
 * @example
 * ```typescript
 * const updated = await reassessVariableConsideration(sequelize, 1, {
 *   scenarios: [
 *     { amount: 10000, probability: 0.6 },
 *     { amount: 5000, probability: 0.3 },
 *     { amount: 0, probability: 0.1 }
 *   ]
 * }, 'user123');
 * ```
 */
export declare const reassessVariableConsideration: (sequelize: Sequelize, variableId: number, updatedData: any, userId: string, transaction?: Transaction) => Promise<VariableConsideration>;
/**
 * Generates ASC 606 revenue roll-forward report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Revenue roll-forward
 *
 * @example
 * ```typescript
 * const rollforward = await generateRevenueRollforward(sequelize, 2024, 1);
 * ```
 */
export declare const generateRevenueRollforward: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<any>;
/**
 * Analyzes contract performance and revenue realization.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Contract performance analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeContractPerformance(sequelize, 1);
 * ```
 */
export declare const analyzeContractPerformance: (sequelize: Sequelize, contractId: number, transaction?: Transaction) => Promise<any>;
/**
 * Generates performance obligation summary by type.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - Reporting date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Performance obligation summary
 *
 * @example
 * ```typescript
 * const summary = await getPerformanceObligationSummary(sequelize, new Date());
 * ```
 */
export declare const getPerformanceObligationSummary: (sequelize: Sequelize, asOfDate: Date, transaction?: Transaction) => Promise<any[]>;
/**
 * Exports revenue recognition data for external reporting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} format - Export format
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Exported data
 *
 * @example
 * ```typescript
 * const exported = await exportRevenueRecognitionData(sequelize, 2024, 1, 'json');
 * ```
 */
export declare const exportRevenueRecognitionData: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, format: string, transaction?: Transaction) => Promise<any>;
/**
 * Validates contract against ASC 606 requirements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateASC606Compliance(sequelize, 1);
 * ```
 */
export declare const validateASC606Compliance: (sequelize: Sequelize, contractId: number, transaction?: Transaction) => Promise<any>;
/**
 * Calculates revenue forecast based on contract pipeline.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} forecastStartDate - Forecast start date
 * @param {Date} forecastEndDate - Forecast end date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Revenue forecast
 *
 * @example
 * ```typescript
 * const forecast = await calculateRevenueForecast(sequelize, new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export declare const calculateRevenueForecast: (sequelize: Sequelize, forecastStartDate: Date, forecastEndDate: Date, transaction?: Transaction) => Promise<any>;
/**
 * Analyzes revenue variance between actual and scheduled.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = await analyzeRevenueVariance(sequelize, 2024, 1);
 * ```
 */
export declare const analyzeRevenueVariance: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<any>;
/**
 * Gets contract backlog (future revenue to be recognized).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - Backlog calculation date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Contract backlog
 *
 * @example
 * ```typescript
 * const backlog = await getContractBacklog(sequelize, new Date());
 * ```
 */
export declare const getContractBacklog: (sequelize: Sequelize, asOfDate: Date, transaction?: Transaction) => Promise<any>;
/**
 * Tracks contract renewal probabilities and revenue impact.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} renewalPeriodStart - Renewal period start
 * @param {Date} renewalPeriodEnd - Renewal period end
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Renewal tracking
 *
 * @example
 * ```typescript
 * const renewals = await trackContractRenewals(sequelize, new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export declare const trackContractRenewals: (sequelize: Sequelize, renewalPeriodStart: Date, renewalPeriodEnd: Date, transaction?: Transaction) => Promise<any[]>;
/**
 * Generates ASC 606 disclosure report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} ASC 606 disclosure
 *
 * @example
 * ```typescript
 * const disclosure = await generateASC606Disclosure(sequelize, 2024);
 * ```
 */
export declare const generateASC606Disclosure: (sequelize: Sequelize, fiscalYear: number, transaction?: Transaction) => Promise<any>;
/**
 * Calculates revenue concentration by customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} topN - Number of top customers
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Customer concentration
 *
 * @example
 * ```typescript
 * const concentration = await calculateCustomerConcentration(sequelize, 2024, 10);
 * ```
 */
export declare const calculateCustomerConcentration: (sequelize: Sequelize, fiscalYear: number, topN: number, transaction?: Transaction) => Promise<any[]>;
/**
 * Identifies revenue recognition timing issues.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Timing issues
 *
 * @example
 * ```typescript
 * const issues = await identifyRevenueTimingIssues(sequelize, 2024, 1);
 * ```
 */
export declare const identifyRevenueTimingIssues: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<any[]>;
/**
 * Processes bulk revenue recognition for multiple obligations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number[]} obligationIds - Obligation IDs
 * @param {Date} recognitionDate - Recognition date
 * @param {string} userId - User processing recognition
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Bulk processing result
 *
 * @example
 * ```typescript
 * const result = await bulkRecognizeRevenue(sequelize, [1, 2, 3], new Date(), 'user123');
 * ```
 */
export declare const bulkRecognizeRevenue: (sequelize: Sequelize, obligationIds: number[], recognitionDate: Date, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Generates revenue waterfall report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Revenue waterfall
 *
 * @example
 * ```typescript
 * const waterfall = await generateRevenueWaterfall(sequelize, 1);
 * ```
 */
export declare const generateRevenueWaterfall: (sequelize: Sequelize, contractId: number, transaction?: Transaction) => Promise<any>;
/**
 * Calculates remaining performance obligations (RPO).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - RPO calculation date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} RPO summary
 *
 * @example
 * ```typescript
 * const rpo = await calculateRemainingPerformanceObligations(sequelize, new Date());
 * ```
 */
export declare const calculateRemainingPerformanceObligations: (sequelize: Sequelize, asOfDate: Date, transaction?: Transaction) => Promise<any>;
/**
 * Audits revenue recognition transactions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {Date} startDate - Audit start date
 * @param {Date} endDate - Audit end date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Audit trail
 *
 * @example
 * ```typescript
 * const audit = await auditRevenueRecognition(sequelize, 1, new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export declare const auditRevenueRecognition: (sequelize: Sequelize, contractId: number, startDate: Date, endDate: Date, transaction?: Transaction) => Promise<any>;
/**
 * Validates performance obligation allocation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePerformanceObligationAllocation(sequelize, 1);
 * ```
 */
export declare const validatePerformanceObligationAllocation: (sequelize: Sequelize, contractId: number, transaction?: Transaction) => Promise<any>;
/**
 * Processes contract termination and revenue adjustments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {Date} terminationDate - Termination date
 * @param {string} terminationReason - Reason for termination
 * @param {string} userId - User processing termination
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Termination result
 *
 * @example
 * ```typescript
 * const result = await terminateContract(sequelize, 1, new Date(), 'Customer breach', 'user123');
 * ```
 */
export declare const terminateContract: (sequelize: Sequelize, contractId: number, terminationDate: Date, terminationReason: string, userId: string, transaction?: Transaction) => Promise<any>;
export {};
//# sourceMappingURL=revenue-recognition-billing-kit.d.ts.map