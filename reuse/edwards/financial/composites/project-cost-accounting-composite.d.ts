/**
 * LOC: PRJCOSTACCT001
 * File: /reuse/edwards/financial/composites/project-cost-accounting-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../project-accounting-costing-kit
 *   - ../cost-accounting-allocation-kit
 *   - ../allocation-engines-rules-kit
 *   - ../budget-management-control-kit
 *   - ../commitment-control-kit
 *   - ../encumbrance-accounting-kit
 *
 * DOWNSTREAM (imported by):
 *   - Backend project management modules
 *   - Project costing REST API controllers
 *   - Project billing services
 *   - Earned value management systems
 *   - Project analytics dashboards
 */
import { Transaction } from 'sequelize';
import { type ProjectHeader, type WorkBreakdownStructure, type ProjectBudget, type ProjectCost, type EarnedValueMetrics } from '../project-accounting-costing-kit';
import { type CostAllocation } from '../cost-accounting-allocation-kit';
import { type AllocationRule, type AllocationEngine } from '../allocation-engines-rules-kit';
import { type Budget, type BudgetVersion } from '../budget-management-control-kit';
import { type Commitment } from '../commitment-control-kit';
import { type Encumbrance } from '../encumbrance-accounting-kit';
/**
 * Complete project setup configuration
 */
export interface ProjectSetupConfig {
    projectData: {
        projectNumber: string;
        projectName: string;
        projectType: 'capital' | 'operating' | 'research' | 'construction';
        projectManager: string;
        startDate: Date;
        plannedEndDate: Date;
        totalBudget: number;
    };
    wbsStructure: {
        levels: number;
        wbsElements: any[];
    };
    budgetData: {
        budgetType: 'original' | 'revised' | 'baseline';
        budgetByWBS: any[];
        budgetByPeriod: any[];
    };
    billingMethod: 'time-and-materials' | 'fixed-price' | 'cost-plus' | 'milestone';
    controlSettings: {
        budgetControl: boolean;
        commitmentControl: boolean;
        encumbranceTracking: boolean;
    };
}
/**
 * Project setup result
 */
export interface ProjectSetupResult {
    project: ProjectHeader;
    wbsElements: WorkBreakdownStructure[];
    budget: ProjectBudget;
    commitments: Commitment[];
    setupComplete: boolean;
}
/**
 * Project cost snapshot
 */
export interface ProjectCostSnapshot {
    projectId: number;
    snapshotDate: Date;
    budgeted: {
        laborBudget: number;
        materialBudget: number;
        equipmentBudget: number;
        indirectBudget: number;
        totalBudget: number;
    };
    actual: {
        laborActual: number;
        materialActual: number;
        equipmentActual: number;
        indirectActual: number;
        totalActual: number;
    };
    commitments: {
        laborCommitments: number;
        materialCommitments: number;
        equipmentCommitments: number;
        totalCommitments: number;
    };
    variance: {
        budgetVariance: number;
        variancePercent: number;
    };
    forecast: {
        costToComplete: number;
        estimateAtCompletion: number;
        varianceAtCompletion: number;
    };
}
/**
 * Earned value analysis
 */
export interface EarnedValueAnalysis {
    projectId: number;
    analysisDate: Date;
    metrics: EarnedValueMetrics;
    performance: {
        cpi: number;
        spi: number;
        cpiTrend: 'improving' | 'stable' | 'declining';
        spiTrend: 'improving' | 'stable' | 'declining';
    };
    forecast: {
        eac: number;
        etc: number;
        vac: number;
        tcpi: number;
    };
    status: 'on-track' | 'at-risk' | 'critical';
    recommendations: string[];
}
/**
 * Project billing package
 */
export interface ProjectBillingPackage {
    projectId: number;
    billingPeriod: {
        start: Date;
        end: Date;
    };
    billingMethod: string;
    costs: {
        laborCosts: number;
        materialCosts: number;
        equipmentCosts: number;
        indirectCosts: number;
    };
    markup: {
        laborMarkup: number;
        materialMarkup: number;
        fixedFee: number;
    };
    totalBillable: number;
    previouslyBilled: number;
    currentBilling: number;
    retainage: number;
    netInvoiceAmount: number;
}
/**
 * Complete project setup with WBS and budget
 * Composes: createProjectHeader, createWorkBreakdownStructure, createProjectBudget, createCommitment
 */
export declare class ProjectCostAccountingService {
    private readonly logger;
    setupCompleteProject(config: ProjectSetupConfig, transaction?: Transaction): Promise<ProjectSetupResult>;
}
/**
 * Update project with budget revision
 * Composes: updateProjectHeader, revisebudget, createBudgetVersion, updateCommitment
 */
export declare const updateProjectWithBudgetRevision: (projectId: number, revisionData: any, newBudget: number, transaction?: Transaction) => Promise<{
    project: ProjectHeader;
    budget: Budget;
    version: BudgetVersion;
    commitment: Commitment;
}>;
/**
 * Close project with final cost reconciliation
 * Composes: closeProject, reconcileCommitments, reconcileEncumbrances, generateProjectReport
 */
export declare const closeProjectWithReconciliation: (projectId: number, transaction?: Transaction) => Promise<{
    closed: boolean;
    finalCost: number;
    variance: number;
    report: any;
}>;
/**
 * Create WBS with budget allocation
 * Composes: createWorkBreakdownStructure, createProjectBudget, createAllocationRule
 */
export declare const createWBSWithBudgetAllocation: (projectId: number, wbsData: any, budgetAmount: number, transaction?: Transaction) => Promise<{
    wbs: WorkBreakdownStructure;
    budget: ProjectBudget;
    allocationRule: AllocationRule;
}>;
/**
 * Update WBS with cost reallocation
 * Composes: updateWBS, createCostAllocation, executeAllocationRule
 */
export declare const updateWBSWithCostReallocation: (wbsId: number, updateData: any, reallocateCosts: boolean, transaction?: Transaction) => Promise<{
    wbs: WorkBreakdownStructure;
    allocated: boolean;
    amount: number;
}>;
/**
 * Create and allocate project cost
 * Composes: createProjectCost, allocateProjectCost, createCostAllocation, validateCostAllocation
 */
export declare const createAndAllocateProjectCost: (projectId: number, costData: any, allocationMethod: "direct" | "proportional" | "driver-based", transaction?: Transaction) => Promise<{
    cost: ProjectCost;
    allocated: boolean;
    allocations: CostAllocation[];
}>;
/**
 * Allocate indirect costs to projects
 * Composes: createCostPool, allocateIndirectCosts, createCostDriver, calculateAllocationRate
 */
export declare const allocateIndirectCostsToProjects: (costPoolId: number, projectIds: number[], allocationBasis: "direct-labor" | "direct-cost" | "headcount", transaction?: Transaction) => Promise<{
    allocated: number;
    projectAllocations: any[];
    rate: number;
}>;
/**
 * Process time entry with cost allocation
 * Composes: createTimeEntry, approveTimeEntry, createProjectCost, allocateProjectCost
 */
export declare const processTimeEntryWithCostAllocation: (timeData: any, hourlyRate: number, transaction?: Transaction) => Promise<{
    timeEntry: any;
    cost: ProjectCost;
    allocated: boolean;
}>;
/**
 * Process expense entry with cost allocation
 * Composes: createExpenseEntry, approveExpenseEntry, createProjectCost, allocateProjectCost
 */
export declare const processExpenseEntryWithCostAllocation: (expenseData: any, transaction?: Transaction) => Promise<{
    expenseEntry: any;
    cost: ProjectCost;
    allocated: boolean;
}>;
/**
 * Check and reserve budget funds
 * Composes: checkBudgetAvailability, reserveBudgetFunds, createEncumbrance
 */
export declare const checkAndReserveBudgetFunds: (projectId: number, wbsId: number, requestedAmount: number, transaction?: Transaction) => Promise<{
    available: boolean;
    reserved: boolean;
    encumbrance?: Encumbrance;
}>;
/**
 * Consume budget with encumbrance liquidation
 * Composes: consumeBudgetFunds, liquidateEncumbrance, createProjectCost
 */
export declare const consumeBudgetWithEncumbranceLiquidation: (projectId: number, wbsId: number, encumbranceId: number, actualAmount: number, transaction?: Transaction) => Promise<{
    consumed: boolean;
    liquidated: boolean;
    variance: number;
}>;
/**
 * Analyze budget variance with forecasting
 * Composes: analyzeBudgetVariance, forecastBudgetConsumption, generateBudgetReport
 */
export declare const analyzeBudgetVarianceWithForecast: (projectId: number, periodEnd: Date, transaction?: Transaction) => Promise<{
    variance: any;
    forecast: any;
    report: any;
    status: "good" | "warning" | "critical";
}>;
/**
 * Create commitment with encumbrance
 * Composes: createCommitment, createEncumbrance, reserveBudgetFunds
 */
export declare const createCommitmentWithEncumbrance: (projectId: number, commitmentData: any, transaction?: Transaction) => Promise<{
    commitment: Commitment;
    encumbrance: Encumbrance;
    budgetReserved: boolean;
}>;
/**
 * Liquidate commitment with cost creation
 * Composes: liquidateCommitment, liquidateEncumbrance, createProjectCost, consumeBudgetFunds
 */
export declare const liquidateCommitmentWithCost: (commitmentId: number, encumbranceId: number, actualAmount: number, costData: any, transaction?: Transaction) => Promise<{
    liquidated: boolean;
    cost: ProjectCost;
    budgetConsumed: boolean;
    variance: number;
}>;
/**
 * Track commitment balance
 * Composes: trackCommitmentBalance, reconcileCommitments, generateCommitmentReport
 */
export declare const trackAndReconcileCommitments: (projectId: number, transaction?: Transaction) => Promise<{
    balance: any;
    reconciliation: any;
    report: any;
}>;
/**
 * Calculate comprehensive earned value metrics
 * Composes: calculateEarnedValue, calculateCostVariance, calculateScheduleVariance, calculateCostPerformanceIndex
 */
export declare const calculateComprehensiveEarnedValue: (projectId: number, analysisDate: Date, transaction?: Transaction) => Promise<EarnedValueAnalysis>;
/**
 * Forecast project cost with EVM
 * Composes: forecastProjectCost, calculateCostToComplete, calculateEarnedValue
 */
export declare const forecastProjectCostWithEVM: (projectId: number, forecastDate: Date, transaction?: Transaction) => Promise<{
    forecast: any;
    costToComplete: number;
    eac: number;
    confidence: number;
}>;
/**
 * Create project billing package
 * Composes: createProjectBilling, allocateIndirectCosts, calculateAllocationRate
 */
export declare const createProjectBillingPackage: (projectId: number, billingPeriod: {
    start: Date;
    end: Date;
}, billingMethod: "time-and-materials" | "fixed-price" | "cost-plus", transaction?: Transaction) => Promise<ProjectBillingPackage>;
/**
 * Process project invoice with revenue recognition
 * Composes: processProjectInvoice, createProjectTransaction, postProjectTransaction
 */
export declare const processProjectInvoiceWithRevenue: (billingId: number, invoiceData: any, transaction?: Transaction) => Promise<{
    invoice: any;
    transactionPosted: boolean;
    revenueRecognized: number;
}>;
/**
 * Analyze comprehensive project profitability
 * Composes: analyzeProjectProfitability, calculateEarnedValue, forecastProjectCost
 */
export declare const analyzeComprehensiveProjectProfitability: (projectId: number, analysisDate: Date, transaction?: Transaction) => Promise<{
    revenue: number;
    costs: number;
    grossProfit: number;
    grossMargin: number;
    earnedValue: EarnedValueMetrics;
    forecast: any;
    profitability: string;
}>;
/**
 * Generate comprehensive project cost snapshot
 * Composes: Multiple cost, budget, and commitment functions
 */
export declare const generateProjectCostSnapshot: (projectId: number, snapshotDate: Date, transaction?: Transaction) => Promise<ProjectCostSnapshot>;
/**
 * Generate comprehensive project report
 * Composes: generateProjectReport, generateBudgetReport, generateCommitmentReport, generateEncumbranceReport
 */
export declare const generateComprehensiveProjectReport: (projectId: number, reportType: "status" | "financial" | "final", transaction?: Transaction) => Promise<{
    projectReport: any;
    budgetReport: any;
    commitmentReport: any;
    encumbranceReport: any;
}>;
/**
 * Create and run project cost allocation engine
 * Composes: createAllocationEngine, createAllocationRule, runAllocationEngine, validateAllocationResults
 */
export declare const createAndRunProjectAllocationEngine: (projectId: number, allocationRules: any[], transaction?: Transaction) => Promise<{
    engine: AllocationEngine;
    rulesCreated: number;
    executed: boolean;
    validated: boolean;
}>;
export { ProjectCostAccountingService, updateProjectWithBudgetRevision, closeProjectWithReconciliation, createWBSWithBudgetAllocation, updateWBSWithCostReallocation, createAndAllocateProjectCost, allocateIndirectCostsToProjects, processTimeEntryWithCostAllocation, processExpenseEntryWithCostAllocation, checkAndReserveBudgetFunds, consumeBudgetWithEncumbranceLiquidation, analyzeBudgetVarianceWithForecast, createCommitmentWithEncumbrance, liquidateCommitmentWithCost, trackAndReconcileCommitments, calculateComprehensiveEarnedValue, forecastProjectCostWithEVM, createProjectBillingPackage, processProjectInvoiceWithRevenue, analyzeComprehensiveProjectProfitability, generateProjectCostSnapshot, generateComprehensiveProjectReport, createAndRunProjectAllocationEngine, };
//# sourceMappingURL=project-cost-accounting-composite.d.ts.map