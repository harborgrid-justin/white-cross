/**
 * LOC: CONST-CC-001
 * File: /reuse/construction/construction-cost-control-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable construction utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend construction services
 *   - Project cost management modules
 *   - Budget tracking systems
 *   - Financial reporting systems
 */
/**
 * File: /reuse/construction/construction-cost-control-kit.ts
 * Locator: WC-CONST-CC-001
 * Purpose: Enterprise-grade Construction Cost Control - cost estimating, budget development, variance analysis, earned value management, cash flow projections
 *
 * Upstream: Independent utility module for construction cost operations
 * Downstream: ../backend/construction/*, cost controllers, budget services, EVM processors, reporting modules
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ functions for cost control operations competing with Procore, PlanGrid enterprise construction management
 *
 * LLM Context: Comprehensive construction cost control utilities for production-ready project management applications.
 * Provides cost estimating, budget development, cost tracking, variance analysis, earned value management (EVM),
 * schedule performance index (SPI), cost performance index (CPI), estimate at completion (EAC), cash flow forecasting,
 * indirect cost allocation, contingency management, change order tracking, cost baseline comparison, and compliance reporting.
 */
import { Sequelize, Transaction } from 'sequelize';
/**
 * Creates a new cost estimate with validation.
 *
 * @param {CostEstimateData} estimateData - Estimate data
 * @param {Model} CostEstimate - CostEstimate model
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<any>} Created estimate
 *
 * @example
 * ```typescript
 * const estimate = await createCostEstimate({
 *   projectId: 'PRJ001',
 *   estimateNumber: 'EST-2024-001',
 *   estimateType: 'detailed',
 *   estimateDate: new Date(),
 *   totalEstimatedCost: 5000000.00,
 *   directCosts: 4000000.00,
 *   indirectCosts: 800000.00,
 *   contingency: 200000.00,
 *   estimatedBy: 'user123',
 *   status: 'draft'
 * }, CostEstimate);
 * ```
 */
export declare const createCostEstimate: (estimateData: CostEstimateData, CostEstimate: any, transaction?: Transaction) => Promise<any>;
/**
 * Validates cost estimate data against business rules.
 *
 * @param {CostEstimateData} estimateData - Estimate data to validate
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateEstimateData(estimateData);
 * if (!result.valid) {
 *   throw new Error(result.errors.join(', '));
 * }
 * ```
 */
export declare const validateEstimateData: (estimateData: CostEstimateData) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Calculates contingency based on project risk factors.
 *
 * @param {number} baseCost - Base project cost
 * @param {string} projectType - Project type
 * @param {string} complexity - Project complexity
 * @returns {{ contingencyAmount: number; contingencyPercent: number }} Calculated contingency
 *
 * @example
 * ```typescript
 * const contingency = calculateContingency(5000000, 'commercial', 'high');
 * console.log(`Contingency: ${contingency.contingencyAmount} (${contingency.contingencyPercent}%)`);
 * ```
 */
export declare const calculateContingency: (baseCost: number, projectType: string, complexity: string) => {
    contingencyAmount: number;
    contingencyPercent: number;
};
/**
 * Updates cost estimate and creates revision history.
 *
 * @param {string} estimateId - Estimate ID
 * @param {Partial<CostEstimateData>} updates - Updated data
 * @param {string} revisionReason - Reason for revision
 * @param {Model} CostEstimate - CostEstimate model
 * @returns {Promise<any>} Updated estimate
 *
 * @example
 * ```typescript
 * const updated = await reviseEstimate('est123', { totalEstimatedCost: 5500000 }, 'Scope change', CostEstimate);
 * ```
 */
export declare const reviseEstimate: (estimateId: string, updates: Partial<CostEstimateData>, revisionReason: string, CostEstimate: any) => Promise<any>;
/**
 * Sets estimate as project cost baseline.
 *
 * @param {string} estimateId - Estimate ID
 * @param {string} approvedBy - Approver identifier
 * @param {Model} CostEstimate - CostEstimate model
 * @returns {Promise<any>} Baselined estimate
 *
 * @example
 * ```typescript
 * const baseline = await setEstimateAsBaseline('est123', 'user456', CostEstimate);
 * ```
 */
export declare const setEstimateAsBaseline: (estimateId: string, approvedBy: string, CostEstimate: any) => Promise<any>;
/**
 * Creates budget line items from cost estimate.
 *
 * @param {string} estimateId - Estimate ID
 * @param {BudgetLineItem[]} lineItems - Budget line items
 * @param {Model} CostEstimate - CostEstimate model
 * @param {Model} CostTracking - CostTracking model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Created budget items
 *
 * @example
 * ```typescript
 * const budget = await createBudgetFromEstimate('est123', lineItems, CostEstimate, CostTracking);
 * ```
 */
export declare const createBudgetFromEstimate: (estimateId: string, lineItems: BudgetLineItem[], CostEstimate: any, CostTracking: any, transaction?: Transaction) => Promise<any[]>;
/**
 * Allocates budget across cost codes and phases.
 *
 * @param {string} projectId - Project ID
 * @param {number} totalBudget - Total budget amount
 * @param {Record<string, number>} allocation - Allocation percentages by code
 * @returns {BudgetLineItem[]} Allocated budget items
 *
 * @example
 * ```typescript
 * const allocation = { 'labor': 40, 'material': 35, 'equipment': 25 };
 * const items = allocateBudgetByCategory(projectId, 5000000, allocation);
 * ```
 */
export declare const allocateBudgetByCategory: (projectId: string, totalBudget: number, allocation: Record<string, number>) => BudgetLineItem[];
/**
 * Retrieves budget summary for project.
 *
 * @param {string} projectId - Project ID
 * @param {Model} CostTracking - CostTracking model
 * @returns {Promise<any>} Budget summary
 *
 * @example
 * ```typescript
 * const summary = await getBudgetSummary('PRJ001', CostTracking);
 * console.log(`Total Budget: ${summary.totalBudget}, Actual: ${summary.totalActual}`);
 * ```
 */
export declare const getBudgetSummary: (projectId: string, CostTracking: any) => Promise<any>;
/**
 * Transfers budget between cost codes.
 *
 * @param {string} fromCostCodeId - Source cost code
 * @param {string} toCostCodeId - Target cost code
 * @param {number} amount - Amount to transfer
 * @param {string} reason - Transfer reason
 * @param {Model} CostTracking - CostTracking model
 * @returns {Promise<{ from: any; to: any }>} Updated cost codes
 *
 * @example
 * ```typescript
 * await transferBudget('code1', 'code2', 50000, 'Reallocation', CostTracking);
 * ```
 */
export declare const transferBudget: (fromCostCodeId: string, toCostCodeId: string, amount: number, reason: string, CostTracking: any) => Promise<{
    from: any;
    to: any;
}>;
/**
 * Exports budget report to CSV format.
 *
 * @param {string} projectId - Project ID
 * @param {Model} CostTracking - CostTracking model
 * @returns {Promise<string>} CSV formatted budget report
 *
 * @example
 * ```typescript
 * const csv = await exportBudgetReport('PRJ001', CostTracking);
 * fs.writeFileSync('budget-report.csv', csv);
 * ```
 */
export declare const exportBudgetReport: (projectId: string, CostTracking: any) => Promise<string>;
/**
 * Records actual cost transaction against budget.
 *
 * @param {ActualCostData} costData - Actual cost data
 * @param {Model} CostTracking - CostTracking model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated cost tracking
 *
 * @example
 * ```typescript
 * const updated = await recordActualCost({
 *   projectId: 'PRJ001',
 *   costCodeId: 'code123',
 *   transactionDate: new Date(),
 *   quantity: 100,
 *   unitCost: 50,
 *   totalCost: 5000,
 *   costType: 'material'
 * }, CostTracking);
 * ```
 */
export declare const recordActualCost: (costData: ActualCostData, CostTracking: any, transaction?: Transaction) => Promise<any>;
/**
 * Records committed cost (PO, subcontract) against budget.
 *
 * @param {CommittedCostData} commitmentData - Commitment data
 * @param {Model} CostTracking - CostTracking model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated cost tracking
 *
 * @example
 * ```typescript
 * const updated = await recordCommittedCost({
 *   projectId: 'PRJ001',
 *   costCodeId: 'code123',
 *   commitmentType: 'purchase_order',
 *   commitmentNumber: 'PO-001',
 *   vendorId: 'VND001',
 *   commitmentDate: new Date(),
 *   committedAmount: 100000,
 *   status: 'active'
 * }, CostTracking);
 * ```
 */
export declare const recordCommittedCost: (commitmentData: CommittedCostData, CostTracking: any, transaction?: Transaction) => Promise<any>;
/**
 * Calculates cost variance for all cost codes.
 *
 * @param {string} projectId - Project ID
 * @param {Model} CostTracking - CostTracking model
 * @returns {Promise<VarianceAnalysis[]>} Variance analysis by cost code
 *
 * @example
 * ```typescript
 * const variances = await calculateCostVariance('PRJ001', CostTracking);
 * variances.forEach(v => console.log(`${v.costCode}: ${v.variance} (${v.variantType})`));
 * ```
 */
export declare const calculateCostVariance: (projectId: string, CostTracking: any) => Promise<VarianceAnalysis[]>;
/**
 * Retrieves cost tracking by category for reporting.
 *
 * @param {string} projectId - Project ID
 * @param {string} category - Cost category
 * @param {Model} CostTracking - CostTracking model
 * @returns {Promise<any[]>} Cost tracking items by category
 *
 * @example
 * ```typescript
 * const laborCosts = await getCostsByCategory('PRJ001', 'labor', CostTracking);
 * ```
 */
export declare const getCostsByCategory: (projectId: string, category: string, CostTracking: any) => Promise<any[]>;
/**
 * Updates percent complete and recalculates earned value.
 *
 * @param {string} costCodeId - Cost code ID
 * @param {number} percentComplete - Percent complete (0-100)
 * @param {Model} CostTracking - CostTracking model
 * @returns {Promise<any>} Updated cost tracking
 *
 * @example
 * ```typescript
 * const updated = await updatePercentComplete('code123', 75, CostTracking);
 * console.log(`Earned Value: ${updated.earnedValue}`);
 * ```
 */
export declare const updatePercentComplete: (costCodeId: string, percentComplete: number, CostTracking: any) => Promise<any>;
/**
 * Calculates earned value metrics for project.
 *
 * @param {string} projectId - Project ID
 * @param {Date} periodEndDate - Period end date
 * @param {Model} CostTracking - CostTracking model
 * @returns {Promise<EarnedValueMetrics>} EVM metrics
 *
 * @example
 * ```typescript
 * const evm = await calculateEarnedValueMetrics('PRJ001', new Date(), CostTracking);
 * console.log(`CPI: ${evm.costPerformanceIndex}, SPI: ${evm.schedulePerformanceIndex}`);
 * ```
 */
export declare const calculateEarnedValueMetrics: (projectId: string, periodEndDate: Date, CostTracking: any) => Promise<EarnedValueMetrics>;
/**
 * Calculates Schedule Performance Index (SPI).
 *
 * @param {number} earnedValue - Earned value
 * @param {number} plannedValue - Planned value
 * @returns {number} Schedule performance index
 *
 * @example
 * ```typescript
 * const spi = calculateSPI(500000, 550000);
 * console.log(spi > 1 ? 'Ahead of schedule' : 'Behind schedule');
 * ```
 */
export declare const calculateSPI: (earnedValue: number, plannedValue: number) => number;
/**
 * Calculates Cost Performance Index (CPI).
 *
 * @param {number} earnedValue - Earned value
 * @param {number} actualCost - Actual cost
 * @returns {number} Cost performance index
 *
 * @example
 * ```typescript
 * const cpi = calculateCPI(500000, 480000);
 * console.log(cpi > 1 ? 'Under budget' : 'Over budget');
 * ```
 */
export declare const calculateCPI: (earnedValue: number, actualCost: number) => number;
/**
 * Calculates Estimate at Completion (EAC) using CPI method.
 *
 * @param {number} budgetAtCompletion - Budget at completion
 * @param {number} costPerformanceIndex - Cost performance index
 * @returns {number} Estimate at completion
 *
 * @example
 * ```typescript
 * const eac = calculateEAC(5000000, 0.95);
 * console.log(`Projected final cost: ${eac}`);
 * ```
 */
export declare const calculateEAC: (budgetAtCompletion: number, costPerformanceIndex: number) => number;
/**
 * Generates earned value trend analysis over time.
 *
 * @param {string} projectId - Project ID
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @param {Model} CostTracking - CostTracking model
 * @returns {Promise<any[]>} Trend data points
 *
 * @example
 * ```typescript
 * const trend = await generateEVMTrendAnalysis('PRJ001', startDate, endDate, CostTracking);
 * ```
 */
export declare const generateEVMTrendAnalysis: (projectId: string, startDate: Date, endDate: Date, CostTracking: any) => Promise<any[]>;
/**
 * Identifies cost variances exceeding threshold.
 *
 * @param {string} projectId - Project ID
 * @param {number} thresholdPercent - Variance threshold percentage
 * @param {Model} CostTracking - CostTracking model
 * @returns {Promise<VarianceAnalysis[]>} Significant variances
 *
 * @example
 * ```typescript
 * const variances = await identifySignificantVariances('PRJ001', 10, CostTracking);
 * variances.forEach(v => console.log(`${v.costCode}: ${v.variancePercent}%`));
 * ```
 */
export declare const identifySignificantVariances: (projectId: string, thresholdPercent: number, CostTracking: any) => Promise<VarianceAnalysis[]>;
/**
 * Performs root cause analysis for cost variance.
 *
 * @param {VarianceAnalysis} variance - Variance data
 * @param {any} historicalData - Historical cost data
 * @returns {Promise<{ rootCauses: string[]; recommendations: string[] }>} Analysis result
 *
 * @example
 * ```typescript
 * const analysis = await performVarianceRootCauseAnalysis(variance, historicalData);
 * console.log('Root causes:', analysis.rootCauses);
 * ```
 */
export declare const performVarianceRootCauseAnalysis: (variance: VarianceAnalysis, historicalData: any) => Promise<{
    rootCauses: string[];
    recommendations: string[];
}>;
/**
 * Generates variance report by cost category.
 *
 * @param {string} projectId - Project ID
 * @param {Model} CostTracking - CostTracking model
 * @returns {Promise<Map<string, VarianceAnalysis[]>>} Variances by category
 *
 * @example
 * ```typescript
 * const report = await generateVarianceReportByCategory('PRJ001', CostTracking);
 * report.forEach((variances, category) => {
 *   console.log(`${category}:`, variances.length, 'variances');
 * });
 * ```
 */
export declare const generateVarianceReportByCategory: (projectId: string, CostTracking: any) => Promise<Map<string, VarianceAnalysis[]>>;
/**
 * Tracks variance trends over multiple periods.
 *
 * @param {string} projectId - Project ID
 * @param {number} numberOfPeriods - Number of periods to analyze
 * @param {Model} CostTracking - CostTracking model
 * @returns {Promise<any[]>} Variance trend data
 *
 * @example
 * ```typescript
 * const trends = await trackVarianceTrends('PRJ001', 6, CostTracking);
 * ```
 */
export declare const trackVarianceTrends: (projectId: string, numberOfPeriods: number, CostTracking: any) => Promise<any[]>;
/**
 * Exports variance analysis to PDF format.
 *
 * @param {string} projectId - Project ID
 * @param {VarianceAnalysis[]} variances - Variance data
 * @returns {Promise<Buffer>} PDF buffer
 *
 * @example
 * ```typescript
 * const pdf = await exportVarianceAnalysisPDF('PRJ001', variances);
 * fs.writeFileSync('variance-report.pdf', pdf);
 * ```
 */
export declare const exportVarianceAnalysisPDF: (projectId: string, variances: VarianceAnalysis[]) => Promise<Buffer>;
/**
 * Generates cost forecast at completion.
 *
 * @param {string} projectId - Project ID
 * @param {Model} CostTracking - CostTracking model
 * @returns {Promise<CostForecast[]>} Cost forecasts by code
 *
 * @example
 * ```typescript
 * const forecasts = await generateCostForecast('PRJ001', CostTracking);
 * forecasts.forEach(f => console.log(`${f.costCodeId}: EAC ${f.projectedCostAtCompletion}`));
 * ```
 */
export declare const generateCostForecast: (projectId: string, CostTracking: any) => Promise<CostForecast[]>;
/**
 * Projects cash flow requirements for upcoming periods.
 *
 * @param {string} projectId - Project ID
 * @param {number} numberOfMonths - Months to project
 * @param {Model} CostTracking - CostTracking model
 * @returns {Promise<CashFlowProjection[]>} Cash flow projections
 *
 * @example
 * ```typescript
 * const cashFlow = await projectCashFlow('PRJ001', 12, CostTracking);
 * cashFlow.forEach(cf => console.log(`${cf.periodStartDate}: ${cf.projectedCashFlow}`));
 * ```
 */
export declare const projectCashFlow: (projectId: string, numberOfMonths: number, CostTracking: any) => Promise<CashFlowProjection[]>;
/**
 * Calculates estimate to complete (ETC) using various methods.
 *
 * @param {number} budgetAtCompletion - BAC
 * @param {number} earnedValue - EV
 * @param {number} actualCost - AC
 * @param {string} method - Calculation method
 * @returns {number} Estimate to complete
 *
 * @example
 * ```typescript
 * const etc = calculateEstimateToComplete(5000000, 2500000, 2400000, 'cpi');
 * console.log(`Estimate to complete: ${etc}`);
 * ```
 */
export declare const calculateEstimateToComplete: (budgetAtCompletion: number, earnedValue: number, actualCost: number, method?: "cpi" | "remaining_budget" | "composite") => number;
/**
 * Identifies cost trends and predicts future performance.
 *
 * @param {string} projectId - Project ID
 * @param {Model} CostTracking - CostTracking model
 * @returns {Promise<CostTrendAnalysis>} Trend analysis
 *
 * @example
 * ```typescript
 * const trends = await analyzeCostTrends('PRJ001', CostTracking);
 * console.log(`Trend: ${trends.trendDirection}, Risk: ${trends.riskLevel}`);
 * ```
 */
export declare const analyzeCostTrends: (projectId: string, CostTracking: any) => Promise<CostTrendAnalysis>;
/**
 * Simulates what-if scenarios for cost changes.
 *
 * @param {string} projectId - Project ID
 * @param {Record<string, number>} costChanges - Proposed cost changes by code
 * @param {Model} CostTracking - CostTracking model
 * @returns {Promise<any>} Scenario analysis results
 *
 * @example
 * ```typescript
 * const scenario = await simulateWhatIfScenario('PRJ001', { 'labor': -50000, 'material': 30000 }, CostTracking);
 * console.log(`New EAC: ${scenario.projectedEAC}`);
 * ```
 */
export declare const simulateWhatIfScenario: (projectId: string, costChanges: Record<string, number>, CostTracking: any) => Promise<any>;
/**
 * Allocates indirect costs across projects or phases.
 *
 * @param {IndirectCostAllocation} allocationData - Allocation data
 * @param {Model} CostTracking - CostTracking model
 * @returns {Promise<any>} Allocation results
 *
 * @example
 * ```typescript
 * const allocation = await allocateIndirectCosts({
 *   projectId: 'PRJ001',
 *   allocationPeriod: '2024-Q1',
 *   indirectCostType: 'overhead',
 *   totalIndirectCost: 500000,
 *   allocationBasis: 'direct_cost',
 *   allocationRate: 0.15
 * }, CostTracking);
 * ```
 */
export declare const allocateIndirectCosts: (allocationData: IndirectCostAllocation, CostTracking: any) => Promise<any>;
/**
 * Calculates overhead rate based on direct costs.
 *
 * @param {number} totalOverhead - Total overhead amount
 * @param {number} totalDirectCosts - Total direct costs
 * @returns {number} Overhead rate as percentage
 *
 * @example
 * ```typescript
 * const rate = calculateOverheadRate(500000, 3000000);
 * console.log(`Overhead rate: ${rate}%`);
 * ```
 */
export declare const calculateOverheadRate: (totalOverhead: number, totalDirectCosts: number) => number;
/**
 * Distributes general conditions costs across work packages.
 *
 * @param {string} projectId - Project ID
 * @param {number} totalGeneralConditions - Total GC costs
 * @param {string} distributionMethod - Distribution method
 * @param {Model} CostTracking - CostTracking model
 * @returns {Promise<any[]>} Distribution results
 *
 * @example
 * ```typescript
 * const distribution = await distributeGeneralConditions('PRJ001', 250000, 'proportional', CostTracking);
 * ```
 */
export declare const distributeGeneralConditions: (projectId: string, totalGeneralConditions: number, distributionMethod: string, CostTracking: any) => Promise<any[]>;
/**
 * Tracks indirect cost burn rate over time.
 *
 * @param {string} projectId - Project ID
 * @param {string} indirectCostType - Type of indirect cost
 * @param {Model} CostTracking - CostTracking model
 * @returns {Promise<any[]>} Burn rate data
 *
 * @example
 * ```typescript
 * const burnRate = await trackIndirectCostBurnRate('PRJ001', 'overhead', CostTracking);
 * ```
 */
export declare const trackIndirectCostBurnRate: (projectId: string, indirectCostType: string, CostTracking: any) => Promise<any[]>;
/**
 * Reconciles allocated vs actual indirect costs.
 *
 * @param {string} projectId - Project ID
 * @param {string} allocationPeriod - Period identifier
 * @param {Model} CostTracking - CostTracking model
 * @returns {Promise<any>} Reconciliation results
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileIndirectCosts('PRJ001', '2024-Q1', CostTracking);
 * console.log(`Variance: ${reconciliation.variance}`);
 * ```
 */
export declare const reconcileIndirectCosts: (projectId: string, allocationPeriod: string, CostTracking: any) => Promise<any>;
/**
 * Creates change order with cost impact analysis.
 *
 * @param {ChangeOrderData} changeOrderData - Change order data
 * @param {Model} ChangeOrder - ChangeOrder model
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created change order
 *
 * @example
 * ```typescript
 * const co = await createChangeOrder({
 *   projectId: 'PRJ001',
 *   changeOrderNumber: 'CO-001',
 *   changeOrderDate: new Date(),
 *   requestedBy: 'user123',
 *   description: 'Add emergency power system',
 *   costImpact: 250000,
 *   scheduleImpact: 14,
 *   affectedCostCodes: ['electrical-001', 'equipment-002']
 * }, ChangeOrder);
 * ```
 */
export declare const createChangeOrder: (changeOrderData: ChangeOrderData, ChangeOrder: any, transaction?: Transaction) => Promise<any>;
/**
 * Approves change order and incorporates into budget.
 *
 * @param {string} changeOrderId - Change order ID
 * @param {string} approvedBy - Approver identifier
 * @param {Model} ChangeOrder - ChangeOrder model
 * @param {Model} CostTracking - CostTracking model
 * @returns {Promise<any>} Approved change order
 *
 * @example
 * ```typescript
 * const approved = await approveChangeOrder('co123', 'user456', ChangeOrder, CostTracking);
 * ```
 */
export declare const approveChangeOrder: (changeOrderId: string, approvedBy: string, ChangeOrder: any, CostTracking: any) => Promise<any>;
/**
 * Incorporates approved change order into cost baseline.
 *
 * @param {string} changeOrderId - Change order ID
 * @param {Model} ChangeOrder - ChangeOrder model
 * @param {Model} CostEstimate - CostEstimate model
 * @returns {Promise<any>} Incorporated change order
 *
 * @example
 * ```typescript
 * const incorporated = await incorporateChangeOrder('co123', ChangeOrder, CostEstimate);
 * ```
 */
export declare const incorporateChangeOrder: (changeOrderId: string, ChangeOrder: any, CostEstimate: any) => Promise<any>;
/**
 * Calculates cumulative change order impact on project.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ChangeOrder - ChangeOrder model
 * @returns {Promise<any>} Change order summary
 *
 * @example
 * ```typescript
 * const impact = await calculateChangeOrderImpact('PRJ001', ChangeOrder);
 * console.log(`Total cost impact: ${impact.totalCostImpact}`);
 * ```
 */
export declare const calculateChangeOrderImpact: (projectId: string, ChangeOrder: any) => Promise<any>;
/**
 * Generates change order log for reporting.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ChangeOrder - ChangeOrder model
 * @returns {Promise<string>} CSV formatted change order log
 *
 * @example
 * ```typescript
 * const log = await generateChangeOrderLog('PRJ001', ChangeOrder);
 * fs.writeFileSync('change-orders.csv', log);
 * ```
 */
export declare const generateChangeOrderLog: (projectId: string, ChangeOrder: any) => Promise<string>;
/**
 * Manages project contingency budget and drawdowns.
 *
 * @param {string} projectId - Project ID
 * @param {Model} CostEstimate - CostEstimate model
 * @returns {Promise<ContingencyManagement>} Contingency status
 *
 * @example
 * ```typescript
 * const contingency = await manageContingency('PRJ001', CostEstimate);
 * console.log(`Remaining: ${contingency.remainingContingency} (${contingency.utilizationPercent}%)`);
 * ```
 */
export declare const manageContingency: (projectId: string, CostEstimate: any) => Promise<ContingencyManagement>;
/**
 * Draws down contingency for approved change or risk event.
 *
 * @param {string} projectId - Project ID
 * @param {number} amount - Drawdown amount
 * @param {string} reason - Drawdown reason
 * @param {string} approvedBy - Approver identifier
 * @param {Model} CostEstimate - CostEstimate model
 * @returns {Promise<ContingencyDrawdown>} Drawdown record
 *
 * @example
 * ```typescript
 * const drawdown = await drawContingency('PRJ001', 50000, 'Unforeseen site conditions', 'user123', CostEstimate);
 * ```
 */
export declare const drawContingency: (projectId: string, amount: number, reason: string, approvedBy: string, CostEstimate: any) => Promise<ContingencyDrawdown>;
/**
 * Analyzes contingency utilization trends.
 *
 * @param {string} projectId - Project ID
 * @param {Model} CostEstimate - CostEstimate model
 * @returns {Promise<any>} Utilization analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeContingencyUtilization('PRJ001', CostEstimate);
 * console.log(`Burn rate: ${analysis.monthlyBurnRate}`);
 * ```
 */
export declare const analyzeContingencyUtilization: (projectId: string, CostEstimate: any) => Promise<any>;
/**
 * Forecasts contingency adequacy based on project risks.
 *
 * @param {string} projectId - Project ID
 * @param {number} projectCompletion - Percent complete
 * @param {Model} CostEstimate - CostEstimate model
 * @returns {Promise<any>} Adequacy forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastContingencyAdequacy('PRJ001', 65, CostEstimate);
 * console.log(`Adequacy: ${forecast.adequate ? 'Sufficient' : 'Insufficient'}`);
 * ```
 */
export declare const forecastContingencyAdequacy: (projectId: string, projectCompletion: number, CostEstimate: any) => Promise<any>;
/**
 * Generates contingency management report.
 *
 * @param {string} projectId - Project ID
 * @param {Model} CostEstimate - CostEstimate model
 * @returns {Promise<string>} Report content
 *
 * @example
 * ```typescript
 * const report = await generateContingencyReport('PRJ001', CostEstimate);
 * console.log(report);
 * ```
 */
export declare const generateContingencyReport: (projectId: string, CostEstimate: any) => Promise<string>;
/**
 * NestJS Injectable service for Construction Cost Control.
 *
 * @example
 * ```typescript
 * @Controller('cost-control')
 * export class CostControlController {
 *   constructor(private readonly costService: CostControlService) {}
 *
 *   @Post('estimates')
 *   async createEstimate(@Body() data: CostEstimateData) {
 *     return this.costService.createEstimate(data);
 *   }
 * }
 * ```
 */
export declare class CostControlService {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    createEstimate(data: CostEstimateData): Promise<any>;
    calculateEVM(projectId: string, periodEndDate: Date): Promise<EarnedValueMetrics>;
    generateForecast(projectId: string): Promise<CostForecast[]>;
    manageChangeOrders(projectId: string): Promise<any>;
}
/**
 * Default export with all cost control utilities.
 */
declare const _default: {
    createCostEstimateModel: any;
    createCostTrackingModel: any;
    createChangeOrderModel: any;
    createCostEstimate: (estimateData: CostEstimateData, CostEstimate: any, transaction?: Transaction) => Promise<any>;
    validateEstimateData: (estimateData: CostEstimateData) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
    calculateContingency: (baseCost: number, projectType: string, complexity: string) => {
        contingencyAmount: number;
        contingencyPercent: number;
    };
    reviseEstimate: (estimateId: string, updates: Partial<CostEstimateData>, revisionReason: string, CostEstimate: any) => Promise<any>;
    setEstimateAsBaseline: (estimateId: string, approvedBy: string, CostEstimate: any) => Promise<any>;
    createBudgetFromEstimate: (estimateId: string, lineItems: BudgetLineItem[], CostEstimate: any, CostTracking: any, transaction?: Transaction) => Promise<any[]>;
    allocateBudgetByCategory: (projectId: string, totalBudget: number, allocation: Record<string, number>) => BudgetLineItem[];
    getBudgetSummary: (projectId: string, CostTracking: any) => Promise<any>;
    transferBudget: (fromCostCodeId: string, toCostCodeId: string, amount: number, reason: string, CostTracking: any) => Promise<{
        from: any;
        to: any;
    }>;
    exportBudgetReport: (projectId: string, CostTracking: any) => Promise<string>;
    recordActualCost: (costData: ActualCostData, CostTracking: any, transaction?: Transaction) => Promise<any>;
    recordCommittedCost: (commitmentData: CommittedCostData, CostTracking: any, transaction?: Transaction) => Promise<any>;
    calculateCostVariance: (projectId: string, CostTracking: any) => Promise<VarianceAnalysis[]>;
    getCostsByCategory: (projectId: string, category: string, CostTracking: any) => Promise<any[]>;
    updatePercentComplete: (costCodeId: string, percentComplete: number, CostTracking: any) => Promise<any>;
    calculateEarnedValueMetrics: (projectId: string, periodEndDate: Date, CostTracking: any) => Promise<EarnedValueMetrics>;
    calculateSPI: (earnedValue: number, plannedValue: number) => number;
    calculateCPI: (earnedValue: number, actualCost: number) => number;
    calculateEAC: (budgetAtCompletion: number, costPerformanceIndex: number) => number;
    generateEVMTrendAnalysis: (projectId: string, startDate: Date, endDate: Date, CostTracking: any) => Promise<any[]>;
    identifySignificantVariances: (projectId: string, thresholdPercent: number, CostTracking: any) => Promise<VarianceAnalysis[]>;
    performVarianceRootCauseAnalysis: (variance: VarianceAnalysis, historicalData: any) => Promise<{
        rootCauses: string[];
        recommendations: string[];
    }>;
    generateVarianceReportByCategory: (projectId: string, CostTracking: any) => Promise<Map<string, VarianceAnalysis[]>>;
    trackVarianceTrends: (projectId: string, numberOfPeriods: number, CostTracking: any) => Promise<any[]>;
    exportVarianceAnalysisPDF: (projectId: string, variances: VarianceAnalysis[]) => Promise<Buffer>;
    generateCostForecast: (projectId: string, CostTracking: any) => Promise<CostForecast[]>;
    projectCashFlow: (projectId: string, numberOfMonths: number, CostTracking: any) => Promise<CashFlowProjection[]>;
    calculateEstimateToComplete: (budgetAtCompletion: number, earnedValue: number, actualCost: number, method?: "cpi" | "remaining_budget" | "composite") => number;
    analyzeCostTrends: (projectId: string, CostTracking: any) => Promise<CostTrendAnalysis>;
    simulateWhatIfScenario: (projectId: string, costChanges: Record<string, number>, CostTracking: any) => Promise<any>;
    allocateIndirectCosts: (allocationData: IndirectCostAllocation, CostTracking: any) => Promise<any>;
    calculateOverheadRate: (totalOverhead: number, totalDirectCosts: number) => number;
    distributeGeneralConditions: (projectId: string, totalGeneralConditions: number, distributionMethod: string, CostTracking: any) => Promise<any[]>;
    trackIndirectCostBurnRate: (projectId: string, indirectCostType: string, CostTracking: any) => Promise<any[]>;
    reconcileIndirectCosts: (projectId: string, allocationPeriod: string, CostTracking: any) => Promise<any>;
    createChangeOrder: (changeOrderData: ChangeOrderData, ChangeOrder: any, transaction?: Transaction) => Promise<any>;
    approveChangeOrder: (changeOrderId: string, approvedBy: string, ChangeOrder: any, CostTracking: any) => Promise<any>;
    incorporateChangeOrder: (changeOrderId: string, ChangeOrder: any, CostEstimate: any) => Promise<any>;
    calculateChangeOrderImpact: (projectId: string, ChangeOrder: any) => Promise<any>;
    generateChangeOrderLog: (projectId: string, ChangeOrder: any) => Promise<string>;
    manageContingency: (projectId: string, CostEstimate: any) => Promise<ContingencyManagement>;
    drawContingency: (projectId: string, amount: number, reason: string, approvedBy: string, CostEstimate: any) => Promise<ContingencyDrawdown>;
    analyzeContingencyUtilization: (projectId: string, CostEstimate: any) => Promise<any>;
    forecastContingencyAdequacy: (projectId: string, projectCompletion: number, CostEstimate: any) => Promise<any>;
    generateContingencyReport: (projectId: string, CostEstimate: any) => Promise<string>;
    CostControlService: typeof CostControlService;
};
export default _default;
//# sourceMappingURL=construction-cost-control-kit.d.ts.map