/**
 * @fileoverview Enterprise Revenue Recognition Kit - Production-Grade ASC 606/IFRS 15 Compliance
 *
 * @module RevenueRecognitionKit
 * @description Comprehensive revenue recognition system implementing ASC 606 and IFRS 15 standards
 * for contract-based revenue management, deferred revenue tracking, and performance obligation allocation.
 *
 * Features:
 * - ASC 606 / IFRS 15 full compliance framework
 * - Contract identification and management
 * - Performance obligation tracking and allocation
 * - Transaction price determination and allocation
 * - Multiple recognition methods (straight-line, milestone, percentage completion)
 * - Deferred and unbilled revenue management
 * - Multi-element arrangement handling
 * - Variable consideration and constraint analysis
 * - Contract modification tracking
 * - Revenue forecasting and projections
 * - Comprehensive audit trails and compliance reporting
 * - Automated revenue schedules and waterfall calculations
 * - SSP (Standalone Selling Price) estimation
 * - Revenue reallocation for contract changes
 * - Cancellation and refund processing
 *
 * Competes with: Zuora RevPro, NetSuite SuiteBilling, SAP RAR, Oracle RMCS
 *
 * Standards Compliance:
 * - ASC 606: Revenue from Contracts with Customers
 * - IFRS 15: Revenue from Contracts with Customers
 * - SOX Controls: Automated revenue recognition controls
 * - GAAP: Generally Accepted Accounting Principles
 *
 * Architecture:
 * - NestJS 10.x Injectable Services
 * - Sequelize 6.x ORM with PostgreSQL
 * - TypeScript 5.x strict mode
 * - Decimal.js for precise financial calculations
 * - Bull Queue for async revenue processing
 * - Redis caching for performance optimization
 *
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 * @since 2025-Q1
 * @license MIT
 *
 * @requires @nestjs/common ^10.0.0
 * @requires sequelize ^6.0.0
 * @requires sequelize-typescript ^2.1.0
 * @requires @nestjs/swagger ^7.0.0
 * @requires decimal.js ^10.4.0
 * @requires date-fns ^2.30.0
 *
 * LOC: FIN-REVR-001
 *
 * @example Basic Usage
 * ```typescript
 * // Inject the service
 * constructor(private readonly revenueService: RevenueRecognitionService) {}
 *
 * // Create a contract with performance obligations
 * const contract = await this.revenueService.createRevenueContract({
 *   customerId: 'CUST-001',
 *   contractNumber: 'CONTRACT-2025-001',
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-12-31'),
 *   totalContractValue: new Decimal('120000.00'),
 *   currency: 'USD'
 * });
 *
 * // Add performance obligations
 * const obligation = await this.revenueService.addPerformanceObligation(contract.id, {
 *   description: 'Software License',
 *   allocatedAmount: new Decimal('80000.00'),
 *   recognitionMethod: 'STRAIGHT_LINE',
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-12-31')
 * });
 *
 * // Generate revenue schedule
 * const schedule = await this.revenueService.generateRevenueSchedule(obligation.id);
 *
 * // Recognize revenue for the period
 * const recognized = await this.revenueService.recognizeRevenueForPeriod(
 *   contract.id,
 *   new Date('2025-01-31')
 * );
 * ```
 *
 * @example Multi-Element Arrangement
 * ```typescript
 * // Create multi-element contract
 * const multiContract = await this.revenueService.createMultiElementContract({
 *   customerId: 'CUST-002',
 *   elements: [
 *     { description: 'Software', price: 100000, ssp: 120000 },
 *     { description: 'Implementation', price: 50000, ssp: 60000 },
 *     { description: 'Support', price: 30000, ssp: 35000 }
 *   ]
 * });
 *
 * // Allocate transaction price using relative SSP
 * const allocation = await this.revenueService.allocateTransactionPrice(
 *   multiContract.id,
 *   'RELATIVE_SSP'
 * );
 * ```
 *
 * @example Variable Consideration
 * ```typescript
 * // Handle variable consideration with constraint
 * const variable = await this.revenueService.calculateVariableConsideration({
 *   contractId: contract.id,
 *   baseAmount: new Decimal('100000'),
 *   variableElements: [
 *     { type: 'BONUS', estimatedAmount: 20000, probability: 0.7 },
 *     { type: 'PENALTY', estimatedAmount: -5000, probability: 0.3 }
 *   ],
 *   constraintMethod: 'MOST_LIKELY'
 * });
 * ```
 */
import { Model, Sequelize } from 'sequelize';
import Decimal from 'decimal.js';
/**
 * Revenue recognition method types per ASC 606
 */
export declare enum RecognitionMethod {
    STRAIGHT_LINE = "STRAIGHT_LINE",// Ratably over time
    MILESTONE = "MILESTONE",// Milestone-based recognition
    PERCENTAGE_COMPLETION = "PERCENTAGE_COMPLETION",// Percentage of completion
    POINT_IN_TIME = "POINT_IN_TIME",// One-time recognition
    OUTPUT_METHOD = "OUTPUT_METHOD",// Output-based (units delivered)
    INPUT_METHOD = "INPUT_METHOD",// Input-based (costs incurred)
    USAGE_BASED = "USAGE_BASED",// Consumption-based
    SUBSCRIPTION = "SUBSCRIPTION",// Recurring subscription
    CUSTOM = "CUSTOM"
}
/**
 * Contract status enumeration
 */
export declare enum ContractStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    AMENDED = "AMENDED",
    SUSPENDED = "SUSPENDED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED",
    TERMINATED = "TERMINATED"
}
/**
 * Performance obligation status
 */
export declare enum ObligationStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    PARTIALLY_SATISFIED = "PARTIALLY_SATISFIED",
    SATISFIED = "SATISFIED",
    CANCELLED = "CANCELLED"
}
/**
 * Revenue schedule entry status
 */
export declare enum ScheduleEntryStatus {
    SCHEDULED = "SCHEDULED",
    RECOGNIZED = "RECOGNIZED",
    DEFERRED = "DEFERRED",
    REVERSED = "REVERSED",
    ADJUSTED = "ADJUSTED"
}
/**
 * Transaction price allocation method
 */
export declare enum AllocationMethod {
    RELATIVE_SSP = "RELATIVE_SSP",// Relative standalone selling price
    ADJUSTED_MARKET = "ADJUSTED_MARKET",// Adjusted market assessment
    EXPECTED_COST_PLUS = "EXPECTED_COST_PLUS",// Expected cost plus margin
    RESIDUAL = "RESIDUAL",// Residual approach
    CONTRACTED_PRICE = "CONTRACTED_PRICE"
}
/**
 * Variable consideration estimation method
 */
export declare enum VariableEstimationMethod {
    EXPECTED_VALUE = "EXPECTED_VALUE",// Probability-weighted amount
    MOST_LIKELY = "MOST_LIKELY",// Single most likely amount
    CONSERVATIVE = "CONSERVATIVE"
}
/**
 * Contract modification type
 */
export declare enum ModificationType {
    SEPARATE_CONTRACT = "SEPARATE_CONTRACT",// Separate new contract
    TERMINATION_NEW = "TERMINATION_NEW",// Terminate and create new
    PROSPECTIVE = "PROSPECTIVE",// Prospective adjustment
    CUMULATIVE_CATCHUP = "CUMULATIVE_CATCHUP",// Cumulative catch-up
    RETROSPECTIVE = "RETROSPECTIVE"
}
/**
 * Revenue contract model
 */
export interface RevenueContract {
    id: string;
    contractNumber: string;
    customerId: string;
    customerName: string;
    description?: string;
    contractDate: Date;
    startDate: Date;
    endDate: Date;
    totalContractValue: Decimal;
    allocatedValue: Decimal;
    recognizedRevenue: Decimal;
    deferredRevenue: Decimal;
    unbilledRevenue: Decimal;
    currency: string;
    status: ContractStatus;
    parentContractId?: string;
    modificationCount: number;
    lastModifiedDate?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy?: string;
}
/**
 * Performance obligation model
 */
export interface PerformanceObligation {
    id: string;
    contractId: string;
    obligationNumber: string;
    description: string;
    allocatedAmount: Decimal;
    recognizedAmount: Decimal;
    remainingAmount: Decimal;
    percentComplete: number;
    recognitionMethod: RecognitionMethod;
    startDate: Date;
    endDate: Date;
    estimatedCompletionDate?: Date;
    actualCompletionDate?: Date;
    status: ObligationStatus;
    standaloneSellingPrice?: Decimal;
    isSeparate: boolean;
    parentObligationId?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Revenue schedule entry
 */
export interface RevenueScheduleEntry {
    id: string;
    obligationId: string;
    contractId: string;
    scheduleDate: Date;
    periodStartDate: Date;
    periodEndDate: Date;
    scheduledAmount: Decimal;
    recognizedAmount: Decimal;
    deferredAmount: Decimal;
    cumulativeRecognized: Decimal;
    status: ScheduleEntryStatus;
    recognitionDate?: Date;
    journalEntryId?: string;
    reversalEntryId?: string;
    notes?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Revenue schedule summary
 */
export interface RevenueSchedule {
    obligationId: string;
    contractId: string;
    totalScheduled: Decimal;
    totalRecognized: Decimal;
    totalDeferred: Decimal;
    totalRemaining: Decimal;
    scheduleEntries: RevenueScheduleEntry[];
    recognitionMethod: RecognitionMethod;
    startDate: Date;
    endDate: Date;
    generatedAt: Date;
}
/**
 * Transaction price allocation result
 */
export interface TransactionPriceAllocation {
    contractId: string;
    totalTransactionPrice: Decimal;
    allocationMethod: AllocationMethod;
    allocations: Array<{
        obligationId: string;
        description: string;
        standaloneSellingPrice: Decimal;
        allocationPercentage: number;
        allocatedAmount: Decimal;
    }>;
    residualAmount?: Decimal;
    allocationDate: Date;
}
/**
 * Variable consideration calculation
 */
export interface VariableConsideration {
    contractId: string;
    baseAmount: Decimal;
    variableAmount: Decimal;
    constrainedAmount: Decimal;
    estimationMethod: VariableEstimationMethod;
    constraintApplied: boolean;
    constraintReason?: string;
    variableElements: Array<{
        type: string;
        description: string;
        estimatedAmount: Decimal;
        probability?: number;
        constraintFactor?: number;
    }>;
    calculatedAt: Date;
}
/**
 * Contract modification record
 */
export interface ContractModification {
    id: string;
    contractId: string;
    modificationNumber: string;
    modificationType: ModificationType;
    modificationDate: Date;
    effectiveDate: Date;
    description: string;
    originalValue: Decimal;
    modifiedValue: Decimal;
    valueChange: Decimal;
    impactedObligations: string[];
    reallocationRequired: boolean;
    cumulativeAdjustment?: Decimal;
    approvedBy: string;
    approvedAt: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
}
/**
 * Deferred revenue summary
 */
export interface DeferredRevenueSummary {
    contractId?: string;
    customerId?: string;
    totalDeferred: Decimal;
    currentPeriodDeferred: Decimal;
    longTermDeferred: Decimal;
    deferredByContract: Array<{
        contractId: string;
        contractNumber: string;
        deferredAmount: Decimal;
        startDate: Date;
        endDate: Date;
    }>;
    deferredByRecognitionMethod: Map<RecognitionMethod, Decimal>;
    asOfDate: Date;
}
/**
 * Revenue forecast
 */
export interface RevenueForecast {
    forecastId: string;
    contractId?: string;
    customerId?: string;
    forecastPeriod: {
        startDate: Date;
        endDate: Date;
    };
    forecastedRevenue: Decimal;
    recognizedToDate: Decimal;
    remainingToRecognize: Decimal;
    confidenceLevel: number;
    monthlyForecasts: Array<{
        month: string;
        forecastedAmount: Decimal;
        probability: number;
    }>;
    assumptions: string[];
    risks: string[];
    generatedAt: Date;
}
/**
 * Revenue audit trail entry
 */
export interface RevenueAuditEntry {
    id: string;
    entityType: 'CONTRACT' | 'OBLIGATION' | 'SCHEDULE' | 'MODIFICATION';
    entityId: string;
    action: string;
    performedBy: string;
    performedAt: Date;
    changes: Record<string, {
        old: any;
        new: any;
    }>;
    reason?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
}
/**
 * SSP estimation result
 */
export interface SSPEstimation {
    obligationId: string;
    description: string;
    estimatedSSP: Decimal;
    estimationMethod: 'MARKET_RATE' | 'COST_PLUS' | 'HISTORICAL' | 'RESIDUAL';
    dataPoints: number;
    confidenceLevel: number;
    adjustments: Array<{
        reason: string;
        adjustment: Decimal;
    }>;
    estimatedAt: Date;
}
/**
 * Revenue waterfall calculation
 */
export interface RevenueWaterfall {
    contractId: string;
    periodStart: Date;
    periodEnd: Date;
    openingDeferred: Decimal;
    billedAmount: Decimal;
    recognizedRevenue: Decimal;
    closingDeferred: Decimal;
    unbilledRevenue: Decimal;
    steps: Array<{
        step: string;
        description: string;
        amount: Decimal;
        runningBalance: Decimal;
    }>;
    calculatedAt: Date;
}
export declare class RevenueRecognitionService {
    private readonly contractModel;
    private readonly obligationModel;
    private readonly scheduleModel;
    private readonly modificationModel;
    private readonly auditModel;
    private readonly sequelize;
    private readonly logger;
    constructor(contractModel: typeof Model, obligationModel: typeof Model, scheduleModel: typeof Model, modificationModel: typeof Model, auditModel: typeof Model, sequelize: Sequelize);
    /**
     * Creates a new revenue contract
     * @param contractData Contract creation data
     * @returns Created revenue contract
     */
    createRevenueContract(contractData: {
        contractNumber: string;
        customerId: string;
        customerName: string;
        description?: string;
        contractDate: Date;
        startDate: Date;
        endDate: Date;
        totalContractValue: Decimal;
        currency: string;
        metadata?: Record<string, any>;
        createdBy: string;
    }): Promise<RevenueContract>;
    /**
     * Retrieves a revenue contract by ID
     * @param contractId Contract identifier
     * @returns Revenue contract
     */
    getRevenueContract(contractId: string): Promise<RevenueContract>;
    /**
     * Updates revenue contract status
     * @param contractId Contract identifier
     * @param status New status
     * @param userId User performing the update
     * @returns Updated contract
     */
    updateContractStatus(contractId: string, status: ContractStatus, userId: string): Promise<RevenueContract>;
    /**
     * Searches revenue contracts by criteria
     * @param criteria Search criteria
     * @returns List of matching contracts
     */
    searchContracts(criteria: {
        customerId?: string;
        status?: ContractStatus;
        startDateFrom?: Date;
        startDateTo?: Date;
        minValue?: Decimal;
        maxValue?: Decimal;
        limit?: number;
        offset?: number;
    }): Promise<{
        contracts: RevenueContract[];
        total: number;
    }>;
    /**
     * Activates a contract and begins revenue recognition
     * @param contractId Contract identifier
     * @param userId User activating the contract
     * @returns Activated contract
     */
    activateContract(contractId: string, userId: string): Promise<RevenueContract>;
    /**
     * Adds a performance obligation to a contract
     * @param contractId Contract identifier
     * @param obligationData Obligation data
     * @returns Created performance obligation
     */
    addPerformanceObligation(contractId: string, obligationData: {
        description: string;
        allocatedAmount: Decimal;
        recognitionMethod: RecognitionMethod;
        startDate: Date;
        endDate: Date;
        standaloneSellingPrice?: Decimal;
        isSeparate?: boolean;
        metadata?: Record<string, any>;
    }): Promise<PerformanceObligation>;
    /**
     * Retrieves performance obligations for a contract
     * @param contractId Contract identifier
     * @returns List of performance obligations
     */
    getPerformanceObligations(contractId: string): Promise<PerformanceObligation[]>;
    /**
     * Updates performance obligation completion status
     * @param obligationId Obligation identifier
     * @param percentComplete Completion percentage (0-100)
     * @returns Updated obligation
     */
    updateObligationProgress(obligationId: string, percentComplete: number): Promise<PerformanceObligation>;
    /**
     * Marks a performance obligation as satisfied
     * @param obligationId Obligation identifier
     * @param userId User marking as satisfied
     * @returns Updated obligation
     */
    satisfyPerformanceObligation(obligationId: string, userId: string): Promise<PerformanceObligation>;
    /**
     * Allocates transaction price across performance obligations
     * @param contractId Contract identifier
     * @param method Allocation method
     * @returns Allocation result
     */
    allocateTransactionPrice(contractId: string, method: AllocationMethod): Promise<TransactionPriceAllocation>;
    /**
     * Allocates price using relative standalone selling price method
     * @private
     */
    private allocateByRelativeSSP;
    /**
     * Allocates price using contracted prices (no allocation)
     * @private
     */
    private allocateByContractedPrice;
    /**
     * Allocates price using residual approach
     * @private
     */
    private allocateByResidual;
    /**
     * Estimates standalone selling price for an obligation
     * @param obligationId Obligation identifier
     * @param method Estimation method
     * @returns SSP estimation
     */
    estimateStandaloneSellingPrice(obligationId: string, method: SSPEstimation['estimationMethod']): Promise<SSPEstimation>;
    /**
     * Generates revenue recognition schedule for an obligation
     * @param obligationId Obligation identifier
     * @returns Revenue schedule
     */
    generateRevenueSchedule(obligationId: string): Promise<RevenueSchedule>;
    /**
     * Internal schedule generation with transaction support
     * @private
     */
    private generateRevenueScheduleInternal;
    /**
     * Generates straight-line recognition schedule
     * @private
     */
    private generateStraightLineSchedule;
    /**
     * Generates milestone-based recognition schedule
     * @private
     */
    private generateMilestoneSchedule;
    /**
     * Generates percentage completion schedule
     * @private
     */
    private generatePercentageCompletionSchedule;
    /**
     * Generates point-in-time recognition schedule
     * @private
     */
    private generatePointInTimeSchedule;
    /**
     * Generates subscription-based schedule
     * @private
     */
    private generateSubscriptionSchedule;
    /**
     * Generates default quarterly milestones
     * @private
     */
    private generateDefaultMilestones;
    /**
     * Retrieves revenue schedule for an obligation
     * @param obligationId Obligation identifier
     * @returns Revenue schedule
     */
    getRevenueSchedule(obligationId: string): Promise<RevenueSchedule>;
    /**
     * Recognizes revenue for a specific period
     * @param contractId Contract identifier
     * @param periodEndDate End date of the recognition period
     * @returns Amount recognized
     */
    recognizeRevenueForPeriod(contractId: string, periodEndDate: Date): Promise<{
        contractId: string;
        periodEndDate: Date;
        amountRecognized: Decimal;
    }>;
    /**
     * Recognizes revenue based on percentage completion
     * @param obligationId Obligation identifier
     * @param percentComplete Current completion percentage
     * @returns Amount recognized
     */
    recognizeRevenueByCompletion(obligationId: string, percentComplete: number): Promise<{
        obligationId: string;
        amountRecognized: Decimal;
    }>;
    /**
     * Recognizes revenue for a milestone achievement
     * @param obligationId Obligation identifier
     * @param milestoneId Milestone identifier
     * @returns Amount recognized
     */
    recognizeMilestoneRevenue(obligationId: string, milestoneId: string): Promise<{
        obligationId: string;
        milestoneId: string;
        amountRecognized: Decimal;
    }>;
    /**
     * Retrieves deferred revenue summary
     * @param criteria Filter criteria
     * @returns Deferred revenue summary
     */
    getDeferredRevenueSummary(criteria: {
        contractId?: string;
        customerId?: string;
        asOfDate?: Date;
    }): Promise<DeferredRevenueSummary>;
    /**
     * Records unbilled revenue (contract asset)
     * @param contractId Contract identifier
     * @param amount Unbilled amount
     * @param description Description of unbilled revenue
     * @returns Updated contract
     */
    recordUnbilledRevenue(contractId: string, amount: Decimal, description: string): Promise<RevenueContract>;
    /**
     * Converts unbilled revenue to billed (upon invoicing)
     * @param contractId Contract identifier
     * @param amount Amount being billed
     * @returns Updated contract
     */
    billUnbilledRevenue(contractId: string, amount: Decimal): Promise<RevenueContract>;
    /**
     * Calculates variable consideration with constraint
     * @param data Variable consideration data
     * @returns Variable consideration calculation
     */
    calculateVariableConsideration(data: {
        contractId: string;
        baseAmount: Decimal;
        variableElements: Array<{
            type: string;
            description: string;
            estimatedAmount: Decimal;
            probability?: number;
            constraintFactor?: number;
        }>;
        estimationMethod: VariableEstimationMethod;
    }): Promise<VariableConsideration>;
    /**
     * Determines if constraint should be applied to variable consideration
     * @private
     */
    private shouldApplyConstraint;
    /**
     * Updates contract with variable consideration
     * @param contractId Contract identifier
     * @param variableConsideration Variable consideration calculation
     * @returns Updated contract
     */
    applyVariableConsideration(contractId: string, variableConsideration: VariableConsideration): Promise<RevenueContract>;
    /**
     * Records a contract modification
     * @param modificationData Modification details
     * @returns Contract modification record
     */
    recordContractModification(modificationData: {
        contractId: string;
        modificationType: ModificationType;
        modificationDate: Date;
        effectiveDate: Date;
        description: string;
        originalValue: Decimal;
        modifiedValue: Decimal;
        impactedObligations: string[];
        approvedBy: string;
        metadata?: Record<string, any>;
    }): Promise<ContractModification>;
    /**
     * Applies contract modification and reallocates revenue
     * @param modificationId Modification identifier
     * @returns Updated contract
     */
    applyContractModification(modificationId: string): Promise<RevenueContract>;
    /**
     * Applies prospective modification (future periods only)
     * @private
     */
    private applyProspectiveModification;
    /**
     * Applies cumulative catch-up modification
     * @private
     */
    private applyCumulativeCatchupModification;
    /**
     * Applies retrospective modification (restate prior periods)
     * @private
     */
    private applyRetrospectiveModification;
    /**
     * Generates revenue forecast for a contract or customer
     * @param criteria Forecast criteria
     * @returns Revenue forecast
     */
    generateRevenueForecast(criteria: {
        contractId?: string;
        customerId?: string;
        forecastPeriod: {
            startDate: Date;
            endDate: Date;
        };
    }): Promise<RevenueForecast>;
    /**
     * Calculates forecast probability for a specific month
     * @private
     */
    private calculateForecastProbability;
    /**
     * Calculates overall forecast confidence
     * @private
     */
    private calculateOverallConfidence;
    /**
     * Generates revenue waterfall for a period
     * @param contractId Contract identifier
     * @param periodStart Period start date
     * @param periodEnd Period end date
     * @returns Revenue waterfall
     */
    generateRevenueWaterfall(contractId: string, periodStart: Date, periodEnd: Date): Promise<RevenueWaterfall>;
    /**
     * Generates comprehensive revenue analytics
     * @param criteria Analysis criteria
     * @returns Revenue analytics
     */
    getRevenueAnalytics(criteria: {
        customerId?: string;
        startDate: Date;
        endDate: Date;
    }): Promise<{
        totalContracts: number;
        totalContractValue: Decimal;
        totalRecognized: Decimal;
        totalDeferred: Decimal;
        recognitionRate: number;
        byRecognitionMethod: Map<RecognitionMethod, {
            count: number;
            value: Decimal;
        }>;
        byStatus: Map<ContractStatus, {
            count: number;
            value: Decimal;
        }>;
        monthlyTrend: Array<{
            month: string;
            recognized: Decimal;
            deferred: Decimal;
        }>;
    }>;
    /**
     * Creates an audit trail entry
     * @private
     */
    private createAuditEntry;
    /**
     * Retrieves audit trail for an entity
     * @param entityType Entity type
     * @param entityId Entity identifier
     * @returns Audit entries
     */
    getAuditTrail(entityType: RevenueAuditEntry['entityType'], entityId: string): Promise<RevenueAuditEntry[]>;
    /**
     * Validates ASC 606 compliance for a contract
     * @param contractId Contract identifier
     * @returns Compliance validation result
     */
    validateASC606Compliance(contractId: string): Promise<{
        isCompliant: boolean;
        validations: Array<{
            criterion: string;
            passed: boolean;
            message: string;
        }>;
    }>;
    /**
     * Generates ASC 606 disclosure report
     * @param criteria Report criteria
     * @returns Disclosure report data
     */
    generateASC606DisclosureReport(criteria: {
        reportingPeriod: {
            startDate: Date;
            endDate: Date;
        };
        customerId?: string;
    }): Promise<{
        reportingPeriod: {
            startDate: Date;
            endDate: Date;
        };
        revenueRecognized: Decimal;
        contractAssets: Decimal;
        contractLiabilities: Decimal;
        performanceObligationsSummary: Array<{
            description: string;
            timing: string;
            method: RecognitionMethod;
            allocatedValue: Decimal;
            remainingValue: Decimal;
        }>;
        significantJudgments: string[];
    }>;
    /**
     * Gets timing description for recognition method
     * @private
     */
    private getTimingDescription;
    /**
     * Validates contract status transition
     * @private
     */
    private validateStatusTransition;
    /**
     * Maps database model to RevenueContract
     * @private
     */
    private mapToRevenueContract;
    /**
     * Maps database model to PerformanceObligation
     * @private
     */
    private mapToPerformanceObligation;
    /**
     * Maps database model to RevenueScheduleEntry
     * @private
     */
    private mapToScheduleEntry;
    /**
     * Maps database model to ContractModification
     * @private
     */
    private mapToContractModification;
}
//# sourceMappingURL=revenue-recognition-kit.d.ts.map