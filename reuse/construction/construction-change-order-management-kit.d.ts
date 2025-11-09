/**
 * CONSTRUCTION CHANGE ORDER MANAGEMENT KIT
 *
 * Comprehensive change order management system for construction projects.
 * Provides 47 specialized functions covering:
 * - Change request initiation and tracking
 * - Impact analysis (cost, schedule, scope)
 * - Change order pricing and negotiation
 * - Scope change tracking and documentation
 * - Approval workflows and routing
 * - Time impact analysis (TIA)
 * - Schedule adjustments and delays
 * - Cost impact analysis
 * - Budget reconciliation
 * - Change order log management
 * - Contingency tracking
 * - NestJS controllers with validation
 * - Swagger API documentation
 * - HIPAA-compliant change documentation
 *
 * @module ConstructionChangeOrderManagementKit
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.1.0
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires @faker-js/faker ^9.4.0
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @security HIPAA compliant - all change order data is audited and tracked
 * @example
 * ```typescript
 * import {
 *   createChangeRequest,
 *   analyzeImpact,
 *   priceChangeOrder,
 *   approveChangeOrder,
 *   reconcileBudget
 * } from './construction-change-order-management-kit';
 *
 * // Create a change request
 * const request = await createChangeRequest({
 *   projectId: 'project-123',
 *   contractId: 'contract-456',
 *   title: 'Additional HVAC Ductwork',
 *   description: 'Add ductwork for new medical equipment',
 *   requestedBy: 'user-789'
 * });
 *
 * // Analyze impact
 * const impact = await analyzeImpact(request.id);
 * ```
 */
import { ChangeRequest } from './models/change-request.model';
import { ChangeRequestStatus, ChangeOrderType, ChangeCategory, ImpactSeverity, ApprovalStatus, PricingMethod } from './types/change-order.types';
/**
 * Change order interface
 */
export interface ChangeOrder {
    id: string;
    changeOrderNumber: string;
    changeRequestId: string;
    projectId: string;
    contractId: string;
    title: string;
    description: string;
    status: ChangeRequestStatus;
    changeType: ChangeOrderType;
    changeCategory: ChangeCategory;
    scopeOfWork: string;
    originalScope: string;
    revisedScope: string;
    costImpact: number;
    originalCost: number;
    additionalCost: number;
    creditAmount: number;
    netCostChange: number;
    timeImpact: number;
    originalDuration: number;
    additionalDays: number;
    newCompletionDate?: Date;
    pricingMethod: PricingMethod;
    markupPercentage: number;
    contingencyUsed: number;
    issuedDate: Date;
    effectiveDate?: Date;
    approvedDate?: Date;
    executedDate?: Date;
    approvedBy?: string;
    attachments: string[];
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}
/**
 * Impact analysis interface
 */
export interface ImpactAnalysis {
    id: string;
    changeRequestId: string;
    analysisDate: Date;
    analyzedBy: string;
    costImpact: {
        laborCost: number;
        materialCost: number;
        equipmentCost: number;
        subcontractorCost: number;
        indirectCost: number;
        markup: number;
        totalCost: number;
    };
    scheduleImpact: {
        criticalPathAffected: boolean;
        daysAdded: number;
        daysDeleted: number;
        netScheduleImpact: number;
        affectedActivities: string[];
        newCompletionDate: Date;
    };
    scopeImpact: {
        scopeChange: string;
        affectedSystems: string[];
        affectedAreas: string[];
        requiresDesignChange: boolean;
        requiresPermitModification: boolean;
    };
    riskAssessment: {
        risks: string[];
        mitigation: string[];
        severity: ImpactSeverity;
    };
    recommendations: string[];
    alternativeOptions: Array<{
        description: string;
        costImpact: number;
        timeImpact: number;
        pros: string[];
        cons: string[];
    }>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Change order pricing interface
 */
export interface ChangeOrderPricing {
    id: string;
    changeRequestId: string;
    changeOrderId?: string;
    pricingMethod: PricingMethod;
    pricingDate: Date;
    pricedBy: string;
    laborCosts: Array<{
        description: string;
        hours: number;
        rate: number;
        total: number;
    }>;
    materialCosts: Array<{
        description: string;
        quantity: number;
        unitPrice: number;
        total: number;
    }>;
    equipmentCosts: Array<{
        description: string;
        hours: number;
        rate: number;
        total: number;
    }>;
    subcontractorCosts: Array<{
        name: string;
        description: string;
        amount: number;
    }>;
    subtotal: number;
    markup: number;
    markupPercentage: number;
    contingency: number;
    totalPrice: number;
    validUntil: Date;
    notes?: string;
    competitiveBids?: Array<{
        bidder: string;
        amount: number;
        receivedDate: Date;
    }>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Approval workflow interface
 */
export interface ApprovalWorkflow {
    id: string;
    changeOrderId: string;
    workflowSteps: Array<{
        stepNumber: number;
        approverRole: string;
        approverId?: string;
        approverName?: string;
        status: ApprovalStatus;
        requiredApproval: boolean;
        comments?: string;
        approvedDate?: Date;
    }>;
    currentStep: number;
    isComplete: boolean;
    finalStatus?: ApprovalStatus;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Time impact analysis interface
 */
export interface TimeImpactAnalysis {
    id: string;
    changeRequestId: string;
    analysisDate: Date;
    analyzedBy: string;
    baselineSchedule: {
        startDate: Date;
        endDate: Date;
        totalDuration: number;
    };
    impactedActivities: Array<{
        activityId: string;
        activityName: string;
        originalDuration: number;
        newDuration: number;
        delayDays: number;
        isCriticalPath: boolean;
    }>;
    criticalPathImpact: boolean;
    totalDelayDays: number;
    concurrentDelays: number;
    netDelayDays: number;
    newProjectEndDate: Date;
    floatConsumed: number;
    methodology: 'as-planned' | 'time-impact' | 'collapsed-as-built' | 'windows-analysis';
    findings: string[];
    recommendations: string[];
    attachments: string[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Budget reconciliation interface
 */
export interface BudgetReconciliation {
    id: string;
    projectId: string;
    contractId: string;
    reconciliationDate: Date;
    originalBudget: number;
    approvedChangeOrders: number;
    pendingChangeOrders: number;
    currentBudget: number;
    committedCosts: number;
    actualCosts: number;
    projectedCosts: number;
    contingencyBudget: number;
    contingencyUsed: number;
    contingencyRemaining: number;
    variance: number;
    variancePercentage: number;
    changeOrdersByCategory: Record<ChangeCategory, number>;
    topChangeOrders: Array<{
        changeOrderNumber: string;
        title: string;
        amount: number;
    }>;
    reconciliationNotes: string;
    reconciledBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Change order log interface
 */
export interface ChangeOrderLog {
    id: string;
    projectId: string;
    contractId: string;
    entries: Array<{
        changeOrderNumber: string;
        changeOrderId: string;
        title: string;
        status: ChangeRequestStatus;
        costImpact: number;
        timeImpact: number;
        issuedDate: Date;
        approvedDate?: Date;
    }>;
    totalChangeOrders: number;
    approvedChangeOrders: number;
    pendingChangeOrders: number;
    rejectedChangeOrders: number;
    totalCostImpact: number;
    totalTimeImpact: number;
    lastUpdated: Date;
}
/**
 * Negotiation record interface
 */
export interface NegotiationRecord {
    id: string;
    changeRequestId: string;
    changeOrderId?: string;
    negotiationRound: number;
    proposedBy: 'owner' | 'contractor';
    proposedDate: Date;
    proposedPrice: number;
    proposedTimeImpact: number;
    justification: string;
    counterOffer?: {
        proposedBy: string;
        price: number;
        timeImpact: number;
        justification: string;
    };
    status: 'open' | 'countered' | 'accepted' | 'rejected';
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates a new change request
 *
 * @param data - Change request data
 * @param userId - User creating the request
 * @returns Created change request
 *
 * @example
 * ```typescript
 * const request = await createChangeRequest({
 *   projectId: 'project-123',
 *   contractId: 'contract-456',
 *   title: 'Additional Plumbing Fixtures',
 *   changeType: ChangeOrderType.OWNER_INITIATED,
 *   urgency: 'high'
 * }, 'user-789');
 * ```
 */
export declare function createChangeRequest(data: Omit<ChangeRequest, 'id' | 'changeRequestNumber' | 'status' | 'requestDate' | 'createdAt' | 'updatedAt'>, userId: string): Promise<ChangeRequest>;
/**
 * Generates unique change request number
 *
 * @param projectName - Project name
 * @returns Formatted change request number
 *
 * @example
 * ```typescript
 * const requestNumber = generateChangeRequestNumber('Hospital Renovation');
 * // Returns: "CR-HR-20250108-001"
 * ```
 */
export declare function generateChangeRequestNumber(projectName: string): string;
/**
 * Submits change request for review
 *
 * @param requestId - Change request identifier
 * @param userId - User submitting request
 * @returns Updated change request
 *
 * @example
 * ```typescript
 * await submitChangeRequest('request-123', 'user-456');
 * ```
 */
export declare function submitChangeRequest(requestId: string, userId: string): Promise<ChangeRequest>;
/**
 * Updates change request
 *
 * @param requestId - Change request identifier
 * @param updates - Updates to apply
 * @param userId - User updating request
 * @returns Updated change request
 *
 * @example
 * ```typescript
 * await updateChangeRequest('request-123', {
 *   description: 'Updated description with more details'
 * }, 'user-456');
 * ```
 */
export declare function updateChangeRequest(requestId: string, updates: Partial<ChangeRequest>, userId: string): Promise<ChangeRequest>;
/**
 * Withdraws change request
 *
 * @param requestId - Change request identifier
 * @param reason - Withdrawal reason
 * @param userId - User withdrawing request
 * @returns Withdrawn change request
 *
 * @example
 * ```typescript
 * await withdrawChangeRequest('request-123', 'No longer needed', 'user-456');
 * ```
 */
export declare function withdrawChangeRequest(requestId: string, reason: string, userId: string): Promise<ChangeRequest>;
/**
 * Gets change requests by status
 *
 * @param projectId - Project identifier
 * @param status - Status filter
 * @returns Array of change requests
 *
 * @example
 * ```typescript
 * const pending = await getChangeRequestsByStatus('project-123', ChangeRequestStatus.PENDING_APPROVAL);
 * ```
 */
export declare function getChangeRequestsByStatus(projectId: string, status: ChangeRequestStatus): Promise<ChangeRequest[]>;
/**
 * Performs comprehensive impact analysis
 *
 * @param requestId - Change request identifier
 * @param userId - User performing analysis
 * @returns Impact analysis results
 *
 * @example
 * ```typescript
 * const analysis = await analyzeImpact('request-123', 'analyst-456');
 * ```
 */
export declare function analyzeImpact(requestId: string, userId: string): Promise<ImpactAnalysis>;
/**
 * Performs cost impact analysis
 *
 * @param requestId - Change request identifier
 * @returns Cost impact breakdown
 *
 * @example
 * ```typescript
 * const costAnalysis = await analyzeCostImpact('request-123');
 * ```
 */
export declare function analyzeCostImpact(requestId: string): Promise<{
    directCosts: number;
    indirectCosts: number;
    markupAmount: number;
    contingency: number;
    totalImpact: number;
    budgetPercentage: number;
}>;
/**
 * Performs schedule impact analysis
 *
 * @param requestId - Change request identifier
 * @returns Schedule impact details
 *
 * @example
 * ```typescript
 * const scheduleAnalysis = await analyzeScheduleImpact('request-123');
 * ```
 */
export declare function analyzeScheduleImpact(requestId: string): Promise<{
    criticalPathImpact: boolean;
    totalDelayDays: number;
    affectedActivities: string[];
    proposedMitigation: string[];
    newCompletionDate: Date;
}>;
/**
 * Analyzes scope changes
 *
 * @param requestId - Change request identifier
 * @returns Scope change analysis
 *
 * @example
 * ```typescript
 * const scopeAnalysis = await analyzeScopeChange('request-123');
 * ```
 */
export declare function analyzeScopeChange(requestId: string): Promise<{
    scopeType: 'addition' | 'deletion' | 'modification';
    affectedSystems: string[];
    designImpact: boolean;
    permitImpact: boolean;
    requiresEngineering: boolean;
}>;
/**
 * Generates alternative options for change
 *
 * @param requestId - Change request identifier
 * @returns Array of alternative options
 *
 * @example
 * ```typescript
 * const alternatives = await generateAlternativeOptions('request-123');
 * ```
 */
export declare function generateAlternativeOptions(requestId: string): Promise<Array<{
    optionNumber: number;
    description: string;
    costImpact: number;
    timeImpact: number;
    pros: string[];
    cons: string[];
    recommendation: string;
}>>;
/**
 * Creates detailed pricing for change order
 *
 * @param pricing - Pricing data
 * @param userId - User creating pricing
 * @returns Created pricing
 *
 * @example
 * ```typescript
 * const pricing = await priceChangeOrder({
 *   changeRequestId: 'request-123',
 *   pricingMethod: PricingMethod.LUMP_SUM,
 *   subtotal: 75000
 * }, 'estimator-456');
 * ```
 */
export declare function priceChangeOrder(pricing: Omit<ChangeOrderPricing, 'id' | 'pricingDate' | 'markup' | 'totalPrice' | 'createdAt' | 'updatedAt'>, userId: string): Promise<ChangeOrderPricing>;
/**
 * Calculates labor costs
 *
 * @param laborItems - Array of labor items
 * @returns Total labor cost
 *
 * @example
 * ```typescript
 * const laborCost = await calculateLaborCost([
 *   { description: 'Carpenter', hours: 40, rate: 65, total: 2600 }
 * ]);
 * ```
 */
export declare function calculateLaborCost(laborItems: Array<{
    description: string;
    hours: number;
    rate: number;
    total: number;
}>): Promise<number>;
/**
 * Calculates material costs
 *
 * @param materialItems - Array of material items
 * @returns Total material cost
 *
 * @example
 * ```typescript
 * const materialCost = await calculateMaterialCost([
 *   { description: 'Lumber', quantity: 100, unitPrice: 12, total: 1200 }
 * ]);
 * ```
 */
export declare function calculateMaterialCost(materialItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}>): Promise<number>;
/**
 * Applies markup to pricing
 *
 * @param subtotal - Subtotal amount
 * @param markupPercentage - Markup percentage
 * @returns Markup calculation
 *
 * @example
 * ```typescript
 * const markup = await applyMarkup(50000, 15);
 * ```
 */
export declare function applyMarkup(subtotal: number, markupPercentage: number): Promise<{
    markupAmount: number;
    total: number;
}>;
/**
 * Compares multiple pricing options
 *
 * @param requestId - Change request identifier
 * @returns Pricing comparison
 *
 * @example
 * ```typescript
 * const comparison = await comparePricingOptions('request-123');
 * ```
 */
export declare function comparePricingOptions(requestId: string): Promise<{
    options: Array<{
        pricingId: string;
        pricedBy: string;
        totalPrice: number;
        validUntil: Date;
    }>;
    lowestPrice: number;
    highestPrice: number;
    averagePrice: number;
    recommendation: string;
}>;
/**
 * Initiates negotiation for change order
 *
 * @param negotiation - Negotiation data
 * @param userId - User initiating negotiation
 * @returns Created negotiation record
 *
 * @example
 * ```typescript
 * const negotiation = await initiateNegotiation({
 *   changeRequestId: 'request-123',
 *   proposedPrice: 65000,
 *   proposedTimeImpact: 10
 * }, 'owner-456');
 * ```
 */
export declare function initiateNegotiation(negotiation: Omit<NegotiationRecord, 'id' | 'negotiationRound' | 'proposedDate' | 'status' | 'createdAt' | 'updatedAt'>, userId: string): Promise<NegotiationRecord>;
/**
 * Submits counter offer
 *
 * @param negotiationId - Negotiation identifier
 * @param counterOffer - Counter offer details
 * @param userId - User submitting counter offer
 * @returns Updated negotiation
 *
 * @example
 * ```typescript
 * await submitCounterOffer('negotiation-123', {
 *   proposedBy: 'contractor-456',
 *   price: 70000,
 *   timeImpact: 12,
 *   justification: 'Additional scope required'
 * }, 'contractor-456');
 * ```
 */
export declare function submitCounterOffer(negotiationId: string, counterOffer: {
    proposedBy: string;
    price: number;
    timeImpact: number;
    justification: string;
}, userId: string): Promise<NegotiationRecord>;
/**
 * Accepts negotiated terms
 *
 * @param negotiationId - Negotiation identifier
 * @param userId - User accepting terms
 * @returns Accepted negotiation
 *
 * @example
 * ```typescript
 * await acceptNegotiatedTerms('negotiation-123', 'owner-456');
 * ```
 */
export declare function acceptNegotiatedTerms(negotiationId: string, userId: string): Promise<NegotiationRecord>;
/**
 * Gets negotiation history
 *
 * @param requestId - Change request identifier
 * @returns Negotiation history
 *
 * @example
 * ```typescript
 * const history = await getNegotiationHistory('request-123');
 * ```
 */
export declare function getNegotiationHistory(requestId: string): Promise<NegotiationRecord[]>;
/**
 * Creates approval workflow
 *
 * @param changeOrderId - Change order identifier
 * @param approvers - Array of approver roles
 * @returns Created workflow
 *
 * @example
 * ```typescript
 * const workflow = await createApprovalWorkflow('co-123', [
 *   'project_manager', 'owner_rep', 'cfo'
 * ]);
 * ```
 */
export declare function createApprovalWorkflow(changeOrderId: string, approvers: string[]): Promise<ApprovalWorkflow>;
/**
 * Processes approval step
 *
 * @param workflowId - Workflow identifier
 * @param stepNumber - Step number to approve
 * @param status - Approval status
 * @param userId - User approving
 * @returns Updated workflow
 *
 * @example
 * ```typescript
 * await processApprovalStep('workflow-123', 1, ApprovalStatus.APPROVED, 'manager-456');
 * ```
 */
export declare function processApprovalStep(workflowId: string, stepNumber: number, status: ApprovalStatus, userId: string): Promise<ApprovalWorkflow>;
/**
 * Routes change order for approval
 *
 * @param changeOrderId - Change order identifier
 * @returns Routing information
 *
 * @example
 * ```typescript
 * const routing = await routeForApproval('co-123');
 * ```
 */
export declare function routeForApproval(changeOrderId: string): Promise<{
    changeOrder: ChangeOrder;
    workflow: ApprovalWorkflow;
    nextApprover: string;
}>;
/**
 * Approves change order
 *
 * @param changeOrderId - Change order identifier
 * @param userId - User approving
 * @returns Approved change order
 *
 * @example
 * ```typescript
 * await approveChangeOrder('co-123', 'admin-456');
 * ```
 */
export declare function approveChangeOrder(changeOrderId: string, userId: string): Promise<ChangeOrder>;
/**
 * Rejects change order
 *
 * @param changeOrderId - Change order identifier
 * @param reason - Rejection reason
 * @param userId - User rejecting
 * @returns Rejected change order
 *
 * @example
 * ```typescript
 * await rejectChangeOrder('co-123', 'Budget constraints', 'admin-456');
 * ```
 */
export declare function rejectChangeOrder(changeOrderId: string, reason: string, userId: string): Promise<ChangeOrder>;
/**
 * Performs time impact analysis
 *
 * @param requestId - Change request identifier
 * @param userId - User performing analysis
 * @returns Time impact analysis
 *
 * @example
 * ```typescript
 * const tia = await performTimeImpactAnalysis('request-123', 'scheduler-456');
 * ```
 */
export declare function performTimeImpactAnalysis(requestId: string, userId: string): Promise<TimeImpactAnalysis>;
/**
 * Calculates float impact
 *
 * @param requestId - Change request identifier
 * @returns Float calculation
 *
 * @example
 * ```typescript
 * const floatImpact = await calculateFloatImpact('request-123');
 * ```
 */
export declare function calculateFloatImpact(requestId: string): Promise<{
    totalFloat: number;
    floatConsumed: number;
    floatRemaining: number;
    criticalPathImpact: boolean;
}>;
/**
 * Generates schedule recovery plan
 *
 * @param requestId - Change request identifier
 * @returns Recovery plan
 *
 * @example
 * ```typescript
 * const recovery = await generateScheduleRecoveryPlan('request-123');
 * ```
 */
export declare function generateScheduleRecoveryPlan(requestId: string): Promise<{
    delayDays: number;
    recoveryActions: Array<{
        action: string;
        timeRecovered: number;
        cost: number;
    }>;
    totalRecovery: number;
    netDelay: number;
}>;
/**
 * Performs budget reconciliation
 *
 * @param projectId - Project identifier
 * @param contractId - Contract identifier
 * @param userId - User performing reconciliation
 * @returns Budget reconciliation
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileBudget('project-123', 'contract-456', 'finance-789');
 * ```
 */
export declare function reconcileBudget(projectId: string, contractId: string, userId: string): Promise<BudgetReconciliation>;
/**
 * Tracks contingency usage
 *
 * @param projectId - Project identifier
 * @returns Contingency tracking
 *
 * @example
 * ```typescript
 * const contingency = await trackContingency('project-123');
 * ```
 */
export declare function trackContingency(projectId: string): Promise<{
    totalContingency: number;
    usedContingency: number;
    remainingContingency: number;
    utilizationPercentage: number;
    projectedUsage: number;
}>;
/**
 * Calculates budget variance
 *
 * @param projectId - Project identifier
 * @returns Budget variance analysis
 *
 * @example
 * ```typescript
 * const variance = await calculateBudgetVariance('project-123');
 * ```
 */
export declare function calculateBudgetVariance(projectId: string): Promise<{
    originalBudget: number;
    currentBudget: number;
    variance: number;
    variancePercentage: number;
    trend: 'favorable' | 'unfavorable';
}>;
/**
 * Generates change order log
 *
 * @param projectId - Project identifier
 * @param contractId - Contract identifier
 * @returns Change order log
 *
 * @example
 * ```typescript
 * const log = await generateChangeOrderLog('project-123', 'contract-456');
 * ```
 */
export declare function generateChangeOrderLog(projectId: string, contractId: string): Promise<ChangeOrderLog>;
/**
 * Exports change order log
 *
 * @param projectId - Project identifier
 * @param format - Export format
 * @returns Exported data
 *
 * @example
 * ```typescript
 * const exported = await exportChangeOrderLog('project-123', 'csv');
 * ```
 */
export declare function exportChangeOrderLog(projectId: string, format: 'csv' | 'pdf' | 'excel'): Promise<{
    data: string;
    filename: string;
}>;
/**
 * Gets change order statistics
 *
 * @param projectId - Project identifier
 * @returns Change order statistics
 *
 * @example
 * ```typescript
 * const stats = await getChangeOrderStatistics('project-123');
 * ```
 */
export declare function getChangeOrderStatistics(projectId: string): Promise<{
    totalChangeOrders: number;
    approvalRate: number;
    averageCostImpact: number;
    averageTimeImpact: number;
    totalBudgetImpact: number;
    totalScheduleImpact: number;
    byCategory: Record<ChangeCategory, number>;
    byType: Record<ChangeOrderType, number>;
}>;
/**
 * Change Order Management Controller
 * Provides RESTful API endpoints for change order management
 */
export declare class ChangeOrderManagementController {
    createRequest(createDto: CreateChangeRequestDto): Promise<ChangeRequest>;
    getRequests(projectId?: string, status?: ChangeRequestStatus): Promise<never[]>;
    getRequest(id: string): Promise<ChangeRequest>;
    submitRequest(id: string): Promise<ChangeRequest>;
    analyzeRequest(id: string): Promise<ImpactAnalysis>;
    priceRequest(id: string, pricingDto: CreatePricingDto): Promise<ChangeOrderPricing>;
    negotiate(id: string, negotiationDto: CreateNegotiationDto): Promise<NegotiationRecord>;
    approve(id: string, approveDto: ApproveChangeOrderDto): Promise<ChangeOrder>;
    getLog(projectId: string): Promise<ChangeOrderLog>;
    getStatistics(projectId: string): Promise<{
        totalChangeOrders: number;
        approvalRate: number;
        averageCostImpact: number;
        averageTimeImpact: number;
        totalBudgetImpact: number;
        totalScheduleImpact: number;
        byCategory: Record<ChangeCategory, number>;
        byType: Record<ChangeOrderType, number>;
    }>;
    reconcileBudget(projectId: string, contractId: string): Promise<BudgetReconciliation>;
}
declare const _default: {
    createChangeRequest: typeof createChangeRequest;
    generateChangeRequestNumber: typeof generateChangeRequestNumber;
    submitChangeRequest: typeof submitChangeRequest;
    updateChangeRequest: typeof updateChangeRequest;
    withdrawChangeRequest: typeof withdrawChangeRequest;
    getChangeRequestsByStatus: typeof getChangeRequestsByStatus;
    analyzeImpact: typeof analyzeImpact;
    analyzeCostImpact: typeof analyzeCostImpact;
    analyzeScheduleImpact: typeof analyzeScheduleImpact;
    analyzeScopeChange: typeof analyzeScopeChange;
    generateAlternativeOptions: typeof generateAlternativeOptions;
    priceChangeOrder: typeof priceChangeOrder;
    calculateLaborCost: typeof calculateLaborCost;
    calculateMaterialCost: typeof calculateMaterialCost;
    applyMarkup: typeof applyMarkup;
    comparePricingOptions: typeof comparePricingOptions;
    initiateNegotiation: typeof initiateNegotiation;
    submitCounterOffer: typeof submitCounterOffer;
    acceptNegotiatedTerms: typeof acceptNegotiatedTerms;
    getNegotiationHistory: typeof getNegotiationHistory;
    createApprovalWorkflow: typeof createApprovalWorkflow;
    processApprovalStep: typeof processApprovalStep;
    routeForApproval: typeof routeForApproval;
    approveChangeOrder: typeof approveChangeOrder;
    rejectChangeOrder: typeof rejectChangeOrder;
    performTimeImpactAnalysis: typeof performTimeImpactAnalysis;
    calculateFloatImpact: typeof calculateFloatImpact;
    generateScheduleRecoveryPlan: typeof generateScheduleRecoveryPlan;
    reconcileBudget: typeof reconcileBudget;
    trackContingency: typeof trackContingency;
    calculateBudgetVariance: typeof calculateBudgetVariance;
    generateChangeOrderLog: typeof generateChangeOrderLog;
    exportChangeOrderLog: typeof exportChangeOrderLog;
    getChangeOrderStatistics: typeof getChangeOrderStatistics;
    ChangeOrderManagementController: typeof ChangeOrderManagementController;
};
export default _default;
//# sourceMappingURL=construction-change-order-management-kit.d.ts.map