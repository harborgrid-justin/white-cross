/**
 * LOC: BPCCOMP001
 * File: /reuse/edwards/financial/composites/budget-planning-control-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../budget-management-control-kit
 *   - ../commitment-control-kit
 *   - ../encumbrance-accounting-kit
 *   - ../allocation-engines-rules-kit
 *   - ../dimension-management-kit
 *   - ../financial-reporting-analytics-kit
 *   - ../fund-grant-accounting-kit
 *   - ../financial-workflow-approval-kit
 *
 * DOWNSTREAM (imported by):
 *   - Budget REST API controllers
 *   - Budget planning GraphQL resolvers
 *   - Budget monitoring dashboards
 *   - Encumbrance tracking services
 *   - Variance analysis modules
 */
import { Transaction } from 'sequelize';
import { BudgetDefinition, BudgetScenario } from '../budget-management-control-kit';
import { EncumbranceType } from '../encumbrance-accounting-kit';
import { BudgetReport, VarianceReport, ForecastReport } from '../financial-reporting-analytics-kit';
/**
 * Budget planning request
 */
export interface BudgetPlanningRequest {
    fiscalYear: number;
    budgetType: 'operating' | 'capital' | 'project' | 'position' | 'flexible' | 'grant';
    budgetName: string;
    budgetDescription: string;
    totalAmount: number;
    startDate: Date;
    endDate: Date;
    organizationHierarchy: string[];
    dimensions: Record<string, string>;
    planningAssumptions: PlanningAssumption[];
}
/**
 * Planning assumption
 */
export interface PlanningAssumption {
    assumptionType: 'inflation' | 'growth' | 'headcount' | 'volume' | 'rate';
    description: string;
    value: number;
    unit: string;
    appliesTo: string[];
}
/**
 * Budget allocation result
 */
export interface BudgetAllocationResult {
    budgetId: number;
    totalAllocated: number;
    allocations: AllocationDetail[];
    unallocatedAmount: number;
    allocationPercent: number;
}
/**
 * Allocation detail
 */
export interface AllocationDetail {
    accountCode: string;
    accountName: string;
    departmentCode: string;
    departmentName: string;
    allocatedAmount: number;
    percentOfTotal: number;
    dimensions: Record<string, string>;
}
/**
 * Budget variance analysis
 */
export interface BudgetVarianceAnalysis {
    analysisDate: Date;
    fiscalYear: number;
    fiscalPeriod: number;
    budgetAmount: number;
    actualAmount: number;
    variance: number;
    variancePercent: number;
    favorableUnfavorable: 'favorable' | 'unfavorable' | 'neutral';
    variancesByDimension: DimensionalVariance[];
    significantVariances: SignificantVariance[];
    alerts: VarianceAlert[];
}
/**
 * Dimensional variance
 */
export interface DimensionalVariance {
    dimensionCode: string;
    dimensionValue: string;
    budgetAmount: number;
    actualAmount: number;
    variance: number;
    variancePercent: number;
}
/**
 * Significant variance
 */
export interface SignificantVariance {
    accountCode: string;
    accountName: string;
    variance: number;
    variancePercent: number;
    requiresExplanation: boolean;
    threshold: number;
    explanation?: string;
}
/**
 * Variance alert
 */
export interface VarianceAlert {
    alertLevel: 'info' | 'warning' | 'critical';
    accountCode: string;
    variance: number;
    threshold: number;
    message: string;
    recommendedAction: string;
}
/**
 * Budget forecast
 */
export interface BudgetForecast {
    forecastDate: Date;
    fiscalYear: number;
    originalBudget: number;
    revisedBudget: number;
    actualToDate: number;
    forecastToComplete: number;
    forecastAtCompletion: number;
    varianceAtCompletion: number;
    confidence: number;
    forecastMethod: 'trend' | 'linear' | 'seasonal' | 'ml';
    assumptions: string[];
}
/**
 * Encumbrance control result
 */
export interface EncumbranceControlResult {
    encumbranceId: number;
    budgetId: number;
    accountCode: string;
    encumberedAmount: number;
    budgetAvailable: number;
    budgetRemaining: number;
    utilizationPercent: number;
    controlPassed: boolean;
    warnings: string[];
}
/**
 * Budget amendment request
 */
export interface BudgetAmendmentRequest {
    budgetId: number;
    amendmentType: 'increase' | 'decrease' | 'reallocation' | 'supplemental';
    amendmentAmount: number;
    fromAccount?: string;
    toAccount?: string;
    justification: string;
    effectiveDate: Date;
    requester: string;
    supportingDocuments?: string[];
}
/**
 * Budget transfer request
 */
export interface BudgetTransferRequest {
    fiscalYear: number;
    fiscalPeriod: number;
    fromBudgetId: number;
    fromAccount: string;
    toBudgetId: number;
    toAccount: string;
    transferAmount: number;
    transferReason: string;
    approver: string;
}
/**
 * Budget compliance status
 */
export interface BudgetComplianceStatus {
    complianceDate: Date;
    overBudgetAccounts: number;
    totalAccounts: number;
    complianceRate: number;
    violations: ComplianceViolation[];
    remediation: RemediationPlan[];
}
/**
 * Compliance violation
 */
export interface ComplianceViolation {
    accountCode: string;
    budgetAmount: number;
    actualAmount: number;
    overageAmount: number;
    violationDate: Date;
    severity: 'low' | 'medium' | 'high';
}
/**
 * Remediation plan
 */
export interface RemediationPlan {
    violationId: number;
    accountCode: string;
    plannedAction: string;
    responsibleParty: string;
    targetDate: Date;
    status: 'planned' | 'in_progress' | 'completed';
}
export declare class BudgetPlanningControlComposite {
    /**
     * Creates comprehensive budget plan with allocation and approval workflow
     * Composes: createBudgetDefinition, allocateBudget, validateDimensionCombination, initiateApprovalWorkflow
     */
    createBudgetPlanWithWorkflow(request: BudgetPlanningRequest, transaction?: Transaction): Promise<{
        budgetId: number;
        allocationResult: BudgetAllocationResult;
        approvalId: number;
    }>;
    /**
     * Allocates budget hierarchically across organization
     * Composes: allocateBudget, createAllocationPool, rollupDimensionValues
     */
    allocateBudgetHierarchically(budgetId: number, organizationHierarchy: string[], allocationBasis: 'equal' | 'proportional' | 'formula', transaction?: Transaction): Promise<BudgetAllocationResult>;
    /**
     * Creates multi-year budget with planning assumptions
     * Composes: createBudgetDefinition, createBudgetScenario, compareBudgetScenarios
     */
    createMultiYearBudget(startYear: number, years: number, baselineAmount: number, assumptions: PlanningAssumption[], transaction?: Transaction): Promise<{
        budgets: BudgetDefinition[];
        scenarios: BudgetScenario[];
        projectedAmounts: number[];
    }>;
    /**
     * Processes budget amendment with approval workflow
     * Composes: createBudgetAmendment, initiateApprovalWorkflow, approveBudgetAmendment
     */
    processBudgetAmendment(request: BudgetAmendmentRequest, transaction?: Transaction): Promise<{
        amendmentId: number;
        approvalId: number;
        newBudgetAmount: number;
    }>;
    /**
     * Executes budget transfer between accounts
     * Composes: createBudgetTransfer, checkApprovalStatus, allocateBudget
     */
    executeBudgetTransfer(request: BudgetTransferRequest, transaction?: Transaction): Promise<{
        transferId: number;
        fromRemainingBudget: number;
        toNewBudget: number;
    }>;
    /**
     * Processes supplemental budget request
     * Composes: createBudgetAmendment, allocateBudget, initiateApprovalWorkflow
     */
    processSupplementalBudget(budgetId: number, supplementalAmount: number, justification: string, requester: string, transaction?: Transaction): Promise<{
        amendmentId: number;
        originalBudget: number;
        supplementalBudget: number;
        totalBudget: number;
        approvalRequired: boolean;
    }>;
    /**
     * Creates encumbrance with budget availability check
     * Composes: checkCommitmentAvailability, createEncumbrance, monitorBudgetUtilization
     */
    createEncumbranceWithBudgetCheck(budgetId: number, accountCode: string, encumbranceAmount: number, encumbranceType: EncumbranceType, transaction?: Transaction): Promise<EncumbranceControlResult>;
    /**
     * Liquidates encumbrance and updates budget
     * Composes: liquidateEncumbrance, getEncumbranceBalance, monitorBudgetUtilization
     */
    liquidateEncumbranceWithBudgetUpdate(encumbranceId: number, liquidationAmount: number, actualAmount: number, transaction?: Transaction): Promise<{
        liquidated: boolean;
        encumbranceReleased: number;
        budgetRestored: number;
        varianceAmount: number;
    }>;
    /**
     * Reconciles encumbrances to commitments
     * Composes: reconcileEncumbrances, reconcileCommitments, generateEncumbranceReport
     */
    reconcileEncumbrancesToCommitments(fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<{
        totalEncumbrances: number;
        totalCommitments: number;
        variance: number;
        reconciled: boolean;
        exceptions: any[];
    }>;
    /**
     * Performs comprehensive budget variance analysis
     * Composes: calculateBudgetVariance, rollupDimensionValues, generateBudgetVarianceReport
     */
    analyzeBudgetVariance(budgetId: number, fiscalYear: number, fiscalPeriod: number, dimensions: string[], transaction?: Transaction): Promise<BudgetVarianceAnalysis>;
    /**
     * Monitors budget utilization with threshold alerts
     * Composes: monitorBudgetUtilization, calculateBudgetVariance, generateBudgetUtilizationReport
     */
    monitorBudgetUtilizationWithAlerts(budgetId: number, alertThresholds: {
        warning: number;
        critical: number;
    }, transaction?: Transaction): Promise<{
        utilizationPercent: number;
        budgetRemaining: number;
        alerts: VarianceAlert[];
        utilizationTrend: string;
    }>;
    /**
     * Generates variance explanation requirements
     * Composes: calculateBudgetVariance, generateBudgetVarianceReport
     */
    generateVarianceExplanationRequirements(budgetId: number, fiscalYear: number, fiscalPeriod: number, explanationThreshold: number, transaction?: Transaction): Promise<{
        totalVariances: number;
        requireExplanation: number;
        variances: SignificantVariance[];
    }>;
    /**
     * Generates budget forecast with multiple methods
     * Composes: calculateBudgetVariance, createBudgetScenario, generateBudgetForecastReport
     */
    generateBudgetForecast(budgetId: number, fiscalYear: number, forecastMethod: 'trend' | 'linear' | 'seasonal' | 'ml', transaction?: Transaction): Promise<BudgetForecast>;
    /**
     * Compares budget scenarios for decision making
     * Composes: createBudgetScenario, compareBudgetScenarios, generateBudgetReport
     */
    compareBudgetScenariosForDecision(budgetId: number, scenarios: Array<{
        scenarioName: string;
        assumptions: PlanningAssumption[];
    }>, transaction?: Transaction): Promise<{
        scenarios: BudgetScenario[];
        comparison: ScenarioComparison;
        recommendation: string;
    }>;
    /**
     * Performs budget reforecasting based on actuals
     * Composes: calculateBudgetVariance, createBudgetAmendment, generateBudgetForecastReport
     */
    reforecastBudget(budgetId: number, fiscalYear: number, reforecastAssumptions: PlanningAssumption[], transaction?: Transaction): Promise<{
        originalForecast: BudgetForecast;
        revisedForecast: BudgetForecast;
        changes: ForecastChange[];
    }>;
    /**
     * Creates grant budget with compliance tracking
     * Composes: createGrantBudget, validateGrantCompliance, monitorGrantBudget
     */
    createGrantBudgetWithCompliance(grantId: number, budgetAmount: number, allowedCategories: string[], transaction?: Transaction): Promise<{
        grantBudgetId: number;
        budgetAmount: number;
        compliance: any;
        restrictions: string[];
    }>;
    /**
     * Monitors grant budget utilization and compliance
     * Composes: monitorGrantBudget, validateGrantCompliance, generateGrantReport
     */
    monitorGrantBudgetCompliance(grantId: number, transaction?: Transaction): Promise<{
        budgetUtilization: number;
        complianceStatus: string;
        violations: any[];
        reportPath: string;
    }>;
    /**
     * Validates budget compliance across organization
     * Composes: monitorBudgetUtilization, calculateBudgetVariance, generateBudgetReport
     */
    validateBudgetCompliance(fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<BudgetComplianceStatus>;
    /**
     * Generates comprehensive budget reporting package
     * Composes: generateBudgetReport, generateBudgetVarianceReport, generateBudgetForecastReport, exportBudgetReport
     */
    generateBudgetReportingPackage(budgetId: number, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<{
        budgetReport: BudgetReport;
        varianceReport: VarianceReport;
        forecastReport: ForecastReport;
        packagePath: string;
    }>;
    /**
     * Analyzes budget performance metrics
     * Composes: calculateBudgetVariance, monitorBudgetUtilization, generateBudgetReport
     */
    analyzeBudgetPerformanceMetrics(budgetId: number, fiscalYear: number, transaction?: Transaction): Promise<{
        accuracyScore: number;
        utilizationScore: number;
        complianceScore: number;
        forecastAccuracy: number;
        overallPerformance: number;
    }>;
}
interface ScenarioComparison {
    scenarios: number[];
    comparisonMetrics: any[];
    recommendedScenario: number;
}
interface ForecastChange {
    item: string;
    originalValue: number;
    revisedValue: number;
    change: number;
    changePercent: number;
}
export { BudgetPlanningRequest, PlanningAssumption, BudgetAllocationResult, AllocationDetail, BudgetVarianceAnalysis, DimensionalVariance, SignificantVariance, VarianceAlert, BudgetForecast, EncumbranceControlResult, BudgetAmendmentRequest, BudgetTransferRequest, BudgetComplianceStatus, ComplianceViolation, RemediationPlan, };
//# sourceMappingURL=budget-planning-control-composite.d.ts.map