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

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { CostEstimate } from './models/cost-estimate.model';
import { CostTracking } from './models/cost-tracking.model';
import { CostChangeOrder } from './models/cost-change-order.model';
import { EstimateType, CostCategory, CostType, CommitmentType, ChangeOrderStatus } from './types/cost.types';

// ============================================================================
// COST ESTIMATING (1-5)
// ============================================================================

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
export const createCostEstimate = async (
  estimateData: CostEstimateData,
  CostEstimate: any,
  transaction?: Transaction,
): Promise<any> => {
  const contingencyPercent = (estimateData.contingency / estimateData.totalEstimatedCost) * 100;

  const estimate = await CostEstimate.create(
    {
      ...estimateData,
      contingencyPercent,
      revisionNumber: 0,
    },
    { transaction },
  );

  return estimate;
};

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
export const validateEstimateData = async (
  estimateData: CostEstimateData,
): Promise<{ valid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  if (!estimateData.projectId) errors.push('Project ID is required');
  if (!estimateData.estimateNumber) errors.push('Estimate number is required');
  if (!estimateData.totalEstimatedCost || estimateData.totalEstimatedCost <= 0) {
    errors.push('Total estimated cost must be positive');
  }

  const calculatedTotal = estimateData.directCosts + estimateData.indirectCosts + estimateData.contingency;
  if (Math.abs(calculatedTotal - estimateData.totalEstimatedCost) > 0.01) {
    errors.push('Total cost does not match sum of direct, indirect, and contingency');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

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
export const calculateContingency = (
  baseCost: number,
  projectType: string,
  complexity: string,
): { contingencyAmount: number; contingencyPercent: number } => {
  let contingencyPercent = 5; // Default 5%

  // Adjust based on project type
  if (projectType === 'healthcare') contingencyPercent += 2;
  if (projectType === 'industrial') contingencyPercent += 3;
  if (projectType === 'infrastructure') contingencyPercent += 4;

  // Adjust based on complexity
  if (complexity === 'medium') contingencyPercent += 2;
  if (complexity === 'high') contingencyPercent += 5;
  if (complexity === 'critical') contingencyPercent += 8;

  const contingencyAmount = baseCost * (contingencyPercent / 100);

  return {
    contingencyAmount,
    contingencyPercent,
  };
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
export const reviseEstimate = async (
  estimateId: string,
  updates: Partial<CostEstimateData>,
  revisionReason: string,
  CostEstimate: any,
): Promise<any> => {
  const estimate = await CostEstimate.findByPk(estimateId);
  if (!estimate) throw new Error('Estimate not found');

  estimate.revisedEstimate = updates.totalEstimatedCost || estimate.totalEstimatedCost;
  estimate.revisionNumber += 1;
  estimate.revisionReason = revisionReason;

  if (updates.directCosts !== undefined) estimate.directCosts = updates.directCosts;
  if (updates.indirectCosts !== undefined) estimate.indirectCosts = updates.indirectCosts;
  if (updates.contingency !== undefined) estimate.contingency = updates.contingency;

  await estimate.save();

  return estimate;
};

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
export const setEstimateAsBaseline = async (
  estimateId: string,
  approvedBy: string,
  CostEstimate: any,
): Promise<any> => {
  const estimate = await CostEstimate.findByPk(estimateId);
  if (!estimate) throw new Error('Estimate not found');

  estimate.status = 'baseline';
  estimate.baselineDate = new Date();
  estimate.approvedBy = approvedBy;
  estimate.approvalDate = new Date();

  await estimate.save();

  return estimate;
};

// ============================================================================
// BUDGET DEVELOPMENT (6-10)
// ============================================================================

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
export const createBudgetFromEstimate = async (
  estimateId: string,
  lineItems: BudgetLineItem[],
  CostEstimate: any,
  CostTracking: any,
  transaction?: Transaction,
): Promise<any[]> => {
  const estimate = await CostEstimate.findByPk(estimateId);
  if (!estimate) throw new Error('Estimate not found');

  const budgetItems = [];

  for (const item of lineItems) {
    const tracking = await CostTracking.create(
      {
        projectId: estimate.projectId,
        costCodeId: item.costCodeId,
        costCode: item.costCode,
        description: item.description,
        category: 'material', // Should be determined from item
        transactionDate: new Date(),
        budgetedCost: item.budgetedAmount,
        originalBudget: item.budgetedAmount,
        revisedBudget: item.budgetedAmount,
        fiscalPeriod: new Date().getMonth() + 1,
        fiscalYear: new Date().getFullYear(),
        lastUpdatedBy: estimate.estimatedBy,
      },
      { transaction },
    );
    budgetItems.push(tracking);
  }

  return budgetItems;
};

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
export const allocateBudgetByCategory = (
  projectId: string,
  totalBudget: number,
  allocation: Record<string, number>,
): BudgetLineItem[] => {
  const items: BudgetLineItem[] = [];

  Object.entries(allocation).forEach(([category, percent]) => {
    const budgetedAmount = totalBudget * (percent / 100);
    items.push({
      costCodeId: `${category}-001`,
      costCode: `${category.toUpperCase()}-001`,
      description: `${category} costs`,
      budgetedQuantity: 1,
      unitOfMeasure: 'LS',
      unitCost: budgetedAmount,
      budgetedAmount,
      committedAmount: 0,
      actualAmount: 0,
      projectedAmount: budgetedAmount,
      variance: 0,
      variancePercent: 0,
    });
  });

  return items;
};

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
export const getBudgetSummary = async (
  projectId: string,
  CostTracking: any,
): Promise<any> => {
  const items = await CostTracking.findAll({
    where: { projectId },
  });

  const summary = items.reduce(
    (acc: any, item: any) => {
      acc.totalBudget += parseFloat(item.budgetedCost);
      acc.totalCommitted += parseFloat(item.committedCost);
      acc.totalActual += parseFloat(item.actualCost);
      acc.totalProjected += parseFloat(item.projectedCost);
      acc.totalVariance += parseFloat(item.costVariance);
      return acc;
    },
    { totalBudget: 0, totalCommitted: 0, totalActual: 0, totalProjected: 0, totalVariance: 0 },
  );

  summary.variancePercent = summary.totalBudget > 0 ? (summary.totalVariance / summary.totalBudget) * 100 : 0;

  return summary;
};

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
export const transferBudget = async (
  fromCostCodeId: string,
  toCostCodeId: string,
  amount: number,
  reason: string,
  CostTracking: any,
): Promise<{ from: any; to: any }> => {
  const fromCode = await CostTracking.findOne({ where: { costCodeId: fromCostCodeId } });
  const toCode = await CostTracking.findOne({ where: { costCodeId: toCostCodeId } });

  if (!fromCode || !toCode) throw new Error('Cost code not found');
  if (fromCode.budgetedCost < amount) throw new Error('Insufficient budget');

  fromCode.budgetedCost -= amount;
  fromCode.revisedBudget = fromCode.budgetedCost;
  fromCode.metadata = { ...fromCode.metadata, lastTransfer: { amount: -amount, reason, date: new Date() } };

  toCode.budgetedCost += amount;
  toCode.revisedBudget = toCode.budgetedCost;
  toCode.metadata = { ...toCode.metadata, lastTransfer: { amount, reason, date: new Date() } };

  await fromCode.save();
  await toCode.save();

  return { from: fromCode, to: toCode };
};

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
export const exportBudgetReport = async (
  projectId: string,
  CostTracking: any,
): Promise<string> => {
  const items = await CostTracking.findAll({
    where: { projectId },
    order: [['costCode', 'ASC']],
  });

  const headers = 'Cost Code,Description,Category,Budgeted,Committed,Actual,Projected,Variance,Variance %\n';
  const rows = items.map(
    (item: any) =>
      `${item.costCode},"${item.description}",${item.category},${item.budgetedCost},${item.committedCost},${item.actualCost},${item.projectedCost},${item.costVariance},${item.variancePercent}`,
  );

  return headers + rows.join('\n');
};

// ============================================================================
// COST TRACKING (11-15)
// ============================================================================

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
export const recordActualCost = async (
  costData: ActualCostData,
  CostTracking: any,
  transaction?: Transaction,
): Promise<any> => {
  const tracking = await CostTracking.findOne({
    where: {
      projectId: costData.projectId,
      costCodeId: costData.costCodeId,
    },
  });

  if (!tracking) throw new Error('Cost code not found in tracking');

  tracking.actualCost += costData.totalCost;
  tracking.costVariance = tracking.budgetedCost - tracking.actualCost;
  tracking.variancePercent = tracking.budgetedCost > 0 ? (tracking.costVariance / tracking.budgetedCost) * 100 : 0;

  await tracking.save({ transaction });

  return tracking;
};

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
export const recordCommittedCost = async (
  commitmentData: CommittedCostData,
  CostTracking: any,
  transaction?: Transaction,
): Promise<any> => {
  const tracking = await CostTracking.findOne({
    where: {
      projectId: commitmentData.projectId,
      costCodeId: commitmentData.costCodeId,
    },
  });

  if (!tracking) throw new Error('Cost code not found in tracking');

  tracking.committedCost += commitmentData.committedAmount;

  await tracking.save({ transaction });

  return tracking;
};

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
export const calculateCostVariance = async (
  projectId: string,
  CostTracking: any,
): Promise<VarianceAnalysis[]> => {
  const items = await CostTracking.findAll({
    where: { projectId },
  });

  return items.map((item: any) => {
    const variance = parseFloat(item.budgetedCost) - parseFloat(item.actualCost);
    const variancePercent = item.budgetedCost > 0 ? (variance / parseFloat(item.budgetedCost)) * 100 : 0;

    let variantType: 'favorable' | 'unfavorable' | 'neutral' = 'neutral';
    if (variance > 0) variantType = 'favorable';
    if (variance < 0) variantType = 'unfavorable';

    let impact: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (Math.abs(variancePercent) > 5) impact = 'medium';
    if (Math.abs(variancePercent) > 10) impact = 'high';
    if (Math.abs(variancePercent) > 20) impact = 'critical';

    return {
      costCodeId: item.costCodeId,
      costCode: item.costCode,
      description: item.description,
      budgetedCost: parseFloat(item.budgetedCost),
      actualCost: parseFloat(item.actualCost),
      variance,
      variancePercent,
      variantType,
      impact,
    };
  });
};

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
export const getCostsByCategory = async (
  projectId: string,
  category: string,
  CostTracking: any,
): Promise<any[]> => {
  return await CostTracking.findAll({
    where: {
      projectId,
      category,
    },
    order: [['costCode', 'ASC']],
  });
};

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
export const updatePercentComplete = async (
  costCodeId: string,
  percentComplete: number,
  CostTracking: any,
): Promise<any> => {
  const tracking = await CostTracking.findOne({ where: { costCodeId } });
  if (!tracking) throw new Error('Cost code not found');

  tracking.percentComplete = percentComplete;
  tracking.earnedValue = (tracking.budgetedCost * percentComplete) / 100;
  tracking.costPerformanceIndex = tracking.actualCost > 0 ? tracking.earnedValue / tracking.actualCost : 1;
  tracking.estimateAtCompletion = tracking.costPerformanceIndex > 0 ? tracking.budgetedCost / tracking.costPerformanceIndex : tracking.budgetedCost;
  tracking.estimateToComplete = tracking.estimateAtCompletion - tracking.actualCost;

  await tracking.save();

  return tracking;
};

// ============================================================================
// EARNED VALUE MANAGEMENT (16-20)
// ============================================================================

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
export const calculateEarnedValueMetrics = async (
  projectId: string,
  periodEndDate: Date,
  CostTracking: any,
): Promise<EarnedValueMetrics> => {
  const items = await CostTracking.findAll({
    where: { projectId },
  });

  const budgetAtCompletion = items.reduce((sum: number, item: any) => sum + parseFloat(item.budgetedCost), 0);
  const plannedValue = items.reduce((sum: number, item: any) => sum + parseFloat(item.budgetedCost) * 0.5, 0); // Simplified
  const earnedValue = items.reduce((sum: number, item: any) => sum + parseFloat(item.earnedValue), 0);
  const actualCost = items.reduce((sum: number, item: any) => sum + parseFloat(item.actualCost), 0);

  const scheduleVariance = earnedValue - plannedValue;
  const costVariance = earnedValue - actualCost;
  const schedulePerformanceIndex = plannedValue > 0 ? earnedValue / plannedValue : 1;
  const costPerformanceIndex = actualCost > 0 ? earnedValue / actualCost : 1;
  const estimateAtCompletion = costPerformanceIndex > 0 ? budgetAtCompletion / costPerformanceIndex : budgetAtCompletion;
  const estimateToComplete = estimateAtCompletion - actualCost;
  const varianceAtCompletion = budgetAtCompletion - estimateAtCompletion;
  const toCompletePerformanceIndex = (budgetAtCompletion - earnedValue) / (budgetAtCompletion - actualCost);
  const percentComplete = budgetAtCompletion > 0 ? (earnedValue / budgetAtCompletion) * 100 : 0;

  return {
    projectId,
    periodEndDate,
    budgetAtCompletion,
    plannedValue,
    earnedValue,
    actualCost,
    scheduleVariance,
    costVariance,
    schedulePerformanceIndex,
    costPerformanceIndex,
    estimateAtCompletion,
    estimateToComplete,
    varianceAtCompletion,
    toCompletePerformanceIndex,
    percentComplete,
  };
};

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
export const calculateSPI = (earnedValue: number, plannedValue: number): number => {
  return plannedValue > 0 ? earnedValue / plannedValue : 1;
};

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
export const calculateCPI = (earnedValue: number, actualCost: number): number => {
  return actualCost > 0 ? earnedValue / actualCost : 1;
};

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
export const calculateEAC = (budgetAtCompletion: number, costPerformanceIndex: number): number => {
  return costPerformanceIndex > 0 ? budgetAtCompletion / costPerformanceIndex : budgetAtCompletion;
};

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
export const generateEVMTrendAnalysis = async (
  projectId: string,
  startDate: Date,
  endDate: Date,
  CostTracking: any,
): Promise<any[]> => {
  const items = await CostTracking.findAll({
    where: {
      projectId,
      transactionDate: { [Op.between]: [startDate, endDate] },
    },
    order: [['transactionDate', 'ASC']],
  });

  const trendData: any[] = [];
  let cumulativeEV = 0;
  let cumulativeAC = 0;
  let cumulativePV = 0;

  items.forEach((item: any) => {
    cumulativeEV += parseFloat(item.earnedValue);
    cumulativeAC += parseFloat(item.actualCost);
    cumulativePV += parseFloat(item.budgetedCost) * 0.5; // Simplified

    trendData.push({
      date: item.transactionDate,
      earnedValue: cumulativeEV,
      actualCost: cumulativeAC,
      plannedValue: cumulativePV,
      cpi: cumulativeAC > 0 ? cumulativeEV / cumulativeAC : 1,
      spi: cumulativePV > 0 ? cumulativeEV / cumulativePV : 1,
    });
  });

  return trendData;
};

// ============================================================================
// VARIANCE ANALYSIS (21-25)
// ============================================================================

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
export const identifySignificantVariances = async (
  projectId: string,
  thresholdPercent: number,
  CostTracking: any,
): Promise<VarianceAnalysis[]> => {
  const allVariances = await calculateCostVariance(projectId, CostTracking);

  return allVariances.filter((v) => Math.abs(v.variancePercent) > thresholdPercent);
};

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
export const performVarianceRootCauseAnalysis = async (
  variance: VarianceAnalysis,
  historicalData: any,
): Promise<{ rootCauses: string[]; recommendations: string[] }> => {
  const rootCauses: string[] = [];
  const recommendations: string[] = [];

  if (variance.variantType === 'unfavorable') {
    if (variance.variancePercent > 20) {
      rootCauses.push('Significant cost overrun detected');
      recommendations.push('Immediate corrective action required');
    }

    rootCauses.push('Higher than expected actual costs');
    recommendations.push('Review vendor pricing and labor productivity');
  }

  if (variance.variantType === 'favorable') {
    rootCauses.push('Lower than expected actual costs');
    recommendations.push('Validate budget estimates for future projects');
  }

  return { rootCauses, recommendations };
};

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
export const generateVarianceReportByCategory = async (
  projectId: string,
  CostTracking: any,
): Promise<Map<string, VarianceAnalysis[]>> => {
  const allVariances = await calculateCostVariance(projectId, CostTracking);

  const byCategory = new Map<string, VarianceAnalysis[]>();

  for (const variance of allVariances) {
    const tracking = await CostTracking.findOne({ where: { costCodeId: variance.costCodeId } });
    const category = tracking?.category || 'other';

    if (!byCategory.has(category)) {
      byCategory.set(category, []);
    }
    byCategory.get(category)!.push(variance);
  }

  return byCategory;
};

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
export const trackVarianceTrends = async (
  projectId: string,
  numberOfPeriods: number,
  CostTracking: any,
): Promise<any[]> => {
  const trends: any[] = [];

  for (let i = 0; i < numberOfPeriods; i++) {
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() - i);

    const items = await CostTracking.findAll({
      where: {
        projectId,
        fiscalPeriod: periodEnd.getMonth() + 1,
        fiscalYear: periodEnd.getFullYear(),
      },
    });

    const totalVariance = items.reduce((sum: number, item: any) => sum + parseFloat(item.costVariance), 0);
    const avgVariancePercent = items.length > 0
      ? items.reduce((sum: number, item: any) => sum + parseFloat(item.variancePercent), 0) / items.length
      : 0;

    trends.push({
      period: `${periodEnd.getFullYear()}-${String(periodEnd.getMonth() + 1).padStart(2, '0')}`,
      totalVariance,
      avgVariancePercent,
    });
  }

  return trends.reverse();
};

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
export const exportVarianceAnalysisPDF = async (
  projectId: string,
  variances: VarianceAnalysis[],
): Promise<Buffer> => {
  // TODO: Integrate with PDF generation library
  return Buffer.from('PDF content placeholder');
};

// ============================================================================
// FORECASTING (26-30)
// ============================================================================

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
export const generateCostForecast = async (
  projectId: string,
  CostTracking: any,
): Promise<CostForecast[]> => {
  const items = await CostTracking.findAll({
    where: { projectId },
  });

  return items.map((item: any) => ({
    projectId,
    forecastDate: new Date(),
    costCodeId: item.costCodeId,
    budgetedCost: parseFloat(item.budgetedCost),
    committedCost: parseFloat(item.committedCost),
    actualCostToDate: parseFloat(item.actualCost),
    projectedCostAtCompletion: parseFloat(item.estimateAtCompletion),
    estimateToComplete: parseFloat(item.estimateToComplete),
    forecastVariance: parseFloat(item.budgetedCost) - parseFloat(item.estimateAtCompletion),
    confidenceLevel: item.percentComplete > 50 ? 0.85 : 0.65,
    assumptions: ['Based on current CPI', 'Assumes no major scope changes'],
  }));
};

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
export const projectCashFlow = async (
  projectId: string,
  numberOfMonths: number,
  CostTracking: any,
): Promise<CashFlowProjection[]> => {
  const projections: CashFlowProjection[] = [];
  const summary = await getBudgetSummary(projectId, CostTracking);

  const monthlyBurn = summary.totalActual / 3; // Simplified assumption

  let cumulativeCashFlow = -summary.totalActual;

  for (let i = 0; i < numberOfMonths; i++) {
    const periodStart = new Date();
    periodStart.setMonth(periodStart.getMonth() + i);
    const periodEnd = new Date(periodStart);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const projectedCosts = monthlyBurn;
    const projectedRevenue = monthlyBurn * 1.1; // Simplified
    const projectedCashFlow = projectedRevenue - projectedCosts;
    cumulativeCashFlow += projectedCashFlow;

    projections.push({
      projectId,
      projectionDate: new Date(),
      periodStartDate: periodStart,
      periodEndDate: periodEnd,
      projectedCosts,
      projectedRevenue,
      projectedCashFlow,
      cumulativeCashFlow,
      requiredFunding: cumulativeCashFlow < 0 ? Math.abs(cumulativeCashFlow) : 0,
      confidence: 0.75,
    });
  }

  return projections;
};

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
export const calculateEstimateToComplete = (
  budgetAtCompletion: number,
  earnedValue: number,
  actualCost: number,
  method: 'cpi' | 'remaining_budget' | 'composite' = 'cpi',
): number => {
  const cpi = actualCost > 0 ? earnedValue / actualCost : 1;

  if (method === 'cpi') {
    const eac = budgetAtCompletion / cpi;
    return eac - actualCost;
  }

  if (method === 'remaining_budget') {
    return budgetAtCompletion - earnedValue;
  }

  if (method === 'composite') {
    const eacCPI = budgetAtCompletion / cpi;
    const eacRemaining = actualCost + (budgetAtCompletion - earnedValue);
    return ((eacCPI + eacRemaining) / 2) - actualCost;
  }

  return 0;
};

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
export const analyzeCostTrends = async (
  projectId: string,
  CostTracking: any,
): Promise<CostTrendAnalysis> => {
  const items = await CostTracking.findAll({
    where: { projectId },
  });

  const avgCostVariance = items.reduce((sum: number, item: any) => sum + parseFloat(item.costVariance), 0) / items.length;
  const avgCPI = items.reduce((sum: number, item: any) => sum + parseFloat(item.costPerformanceIndex), 0) / items.length;
  const avgSPI = 1.0; // Simplified

  let trendDirection: 'improving' | 'stable' | 'degrading' = 'stable';
  if (avgCPI > 1.05) trendDirection = 'improving';
  if (avgCPI < 0.95) trendDirection = 'degrading';

  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (avgCPI < 0.90 || avgCostVariance < -100000) riskLevel = 'medium';
  if (avgCPI < 0.80 || avgCostVariance < -500000) riskLevel = 'high';

  const recommendations: string[] = [];
  if (riskLevel === 'high') {
    recommendations.push('Implement immediate cost reduction measures');
    recommendations.push('Review all uncommitted costs');
  }

  return {
    projectId,
    trendPeriod: new Date().toISOString(),
    averageCostVariance: avgCostVariance,
    averageCPI: avgCPI,
    averageSPI: avgSPI,
    trendDirection,
    forecastAccuracy: 0.85,
    riskLevel,
    recommendations,
  };
};

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
export const simulateWhatIfScenario = async (
  projectId: string,
  costChanges: Record<string, number>,
  CostTracking: any,
): Promise<any> => {
  const currentSummary = await getBudgetSummary(projectId, CostTracking);

  let adjustedActual = currentSummary.totalActual;
  Object.values(costChanges).forEach(change => {
    adjustedActual += change;
  });

  const adjustedVariance = currentSummary.totalBudget - adjustedActual;
  const adjustedCPI = adjustedActual > 0 ? (currentSummary.totalBudget * 0.5) / adjustedActual : 1;
  const projectedEAC = currentSummary.totalBudget / adjustedCPI;

  return {
    scenario: 'what-if',
    currentEAC: currentSummary.totalProjected,
    projectedEAC,
    impact: projectedEAC - currentSummary.totalProjected,
    adjustedCPI,
    adjustedVariance,
  };
};

// ============================================================================
// INDIRECT COST ALLOCATION (31-35)
// ============================================================================

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
export const allocateIndirectCosts = async (
  allocationData: IndirectCostAllocation,
  CostTracking: any,
): Promise<any> => {
  const items = await CostTracking.findAll({
    where: { projectId: allocationData.projectId },
  });

  const totalDirectCost = items.reduce((sum: number, item: any) => sum + parseFloat(item.actualCost), 0);

  const allocations = items.map((item: any) => {
    const itemDirectCost = parseFloat(item.actualCost);
    const allocationAmount = (itemDirectCost / totalDirectCost) * allocationData.totalIndirectCost;

    return {
      costCodeId: item.costCodeId,
      costCode: item.costCode,
      directCost: itemDirectCost,
      indirectAllocation: allocationAmount,
      totalCost: itemDirectCost + allocationAmount,
    };
  });

  return {
    allocationPeriod: allocationData.allocationPeriod,
    indirectCostType: allocationData.indirectCostType,
    totalIndirectCost: allocationData.totalIndirectCost,
    allocations,
  };
};

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
export const calculateOverheadRate = (totalOverhead: number, totalDirectCosts: number): number => {
  return totalDirectCosts > 0 ? (totalOverhead / totalDirectCosts) * 100 : 0;
};

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
export const distributeGeneralConditions = async (
  projectId: string,
  totalGeneralConditions: number,
  distributionMethod: string,
  CostTracking: any,
): Promise<any[]> => {
  const items = await CostTracking.findAll({
    where: { projectId },
  });

  const totalBudget = items.reduce((sum: number, item: any) => sum + parseFloat(item.budgetedCost), 0);

  return items.map((item: any) => {
    const itemBudget = parseFloat(item.budgetedCost);
    const gcAllocation = (itemBudget / totalBudget) * totalGeneralConditions;

    return {
      costCodeId: item.costCodeId,
      costCode: item.costCode,
      budget: itemBudget,
      gcAllocation,
      totalWithGC: itemBudget + gcAllocation,
    };
  });
};

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
export const trackIndirectCostBurnRate = async (
  projectId: string,
  indirectCostType: string,
  CostTracking: any,
): Promise<any[]> => {
  const items = await CostTracking.findAll({
    where: {
      projectId,
      category: 'indirect',
    },
    order: [['transactionDate', 'ASC']],
  });

  const burnData: any[] = [];
  let cumulativeCost = 0;

  items.forEach((item: any) => {
    cumulativeCost += parseFloat(item.actualCost);
    burnData.push({
      date: item.transactionDate,
      periodCost: parseFloat(item.actualCost),
      cumulativeCost,
    });
  });

  return burnData;
};

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
export const reconcileIndirectCosts = async (
  projectId: string,
  allocationPeriod: string,
  CostTracking: any,
): Promise<any> => {
  const indirectItems = await CostTracking.findAll({
    where: {
      projectId,
      category: 'indirect',
    },
  });

  const allocatedTotal = indirectItems.reduce((sum: number, item: any) => sum + parseFloat(item.budgetedCost), 0);
  const actualTotal = indirectItems.reduce((sum: number, item: any) => sum + parseFloat(item.actualCost), 0);
  const variance = allocatedTotal - actualTotal;

  return {
    allocationPeriod,
    allocatedTotal,
    actualTotal,
    variance,
    variancePercent: allocatedTotal > 0 ? (variance / allocatedTotal) * 100 : 0,
    reconciliationDate: new Date(),
  };
};

// ============================================================================
// CHANGE ORDER MANAGEMENT (36-40)
// ============================================================================

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
export const createChangeOrder = async (
  changeOrderData: ChangeOrderData,
  ChangeOrder: any,
  transaction?: Transaction,
): Promise<any> => {
  const changeOrder = await ChangeOrder.create(
    {
      ...changeOrderData,
      status: 'pending',
      originalEstimate: changeOrderData.costImpact,
      revisedEstimate: changeOrderData.costImpact,
    },
    { transaction },
  );

  return changeOrder;
};

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
export const approveChangeOrder = async (
  changeOrderId: string,
  approvedBy: string,
  ChangeOrder: any,
  CostTracking: any,
): Promise<any> => {
  const changeOrder = await ChangeOrder.findByPk(changeOrderId);
  if (!changeOrder) throw new Error('Change order not found');

  changeOrder.status = 'approved';
  changeOrder.approvedBy = approvedBy;
  changeOrder.approvalDate = new Date();

  await changeOrder.save();

  // Update affected cost codes
  for (const costCode of changeOrder.affectedCostCodes) {
    const tracking = await CostTracking.findOne({ where: { costCode } });
    if (tracking) {
      tracking.revisedBudget = parseFloat(tracking.revisedBudget) + changeOrder.costImpact;
      tracking.budgetedCost = tracking.revisedBudget;
      await tracking.save();
    }
  }

  return changeOrder;
};

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
export const incorporateChangeOrder = async (
  changeOrderId: string,
  ChangeOrder: any,
  CostEstimate: any,
): Promise<any> => {
  const changeOrder = await ChangeOrder.findByPk(changeOrderId);
  if (!changeOrder) throw new Error('Change order not found');
  if (changeOrder.status !== 'approved') throw new Error('Change order not approved');

  changeOrder.status = 'incorporated';
  changeOrder.incorporatedDate = new Date();
  await changeOrder.save();

  // Update project baseline estimate
  const estimate = await CostEstimate.findOne({
    where: {
      projectId: changeOrder.projectId,
      status: 'baseline',
    },
  });

  if (estimate) {
    estimate.revisedEstimate = parseFloat(estimate.revisedEstimate || estimate.totalEstimatedCost) + changeOrder.costImpact;
    await estimate.save();
  }

  return changeOrder;
};

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
export const calculateChangeOrderImpact = async (
  projectId: string,
  ChangeOrder: any,
): Promise<any> => {
  const changeOrders = await ChangeOrder.findAll({
    where: { projectId },
  });

  const totalCostImpact = changeOrders.reduce((sum: number, co: any) => {
    if (co.status === 'approved' || co.status === 'incorporated') {
      return sum + parseFloat(co.costImpact);
    }
    return sum;
  }, 0);

  const totalScheduleImpact = changeOrders.reduce((sum: number, co: any) => {
    if (co.status === 'approved' || co.status === 'incorporated') {
      return sum + co.scheduleImpact;
    }
    return sum;
  }, 0);

  return {
    projectId,
    totalChangeOrders: changeOrders.length,
    approvedChangeOrders: changeOrders.filter((co: any) => co.status === 'approved' || co.status === 'incorporated').length,
    totalCostImpact,
    totalScheduleImpact,
    pendingChangeOrders: changeOrders.filter((co: any) => co.status === 'pending').length,
  };
};

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
export const generateChangeOrderLog = async (
  projectId: string,
  ChangeOrder: any,
): Promise<string> => {
  const changeOrders = await ChangeOrder.findAll({
    where: { projectId },
    order: [['changeOrderNumber', 'ASC']],
  });

  const headers = 'CO Number,Date,Requested By,Description,Cost Impact,Schedule Impact,Status,Approved By,Approval Date\n';
  const rows = changeOrders.map(
    (co: any) =>
      `${co.changeOrderNumber},${co.changeOrderDate.toISOString().split('T')[0]},"${co.requestedBy}","${co.description}",${co.costImpact},${co.scheduleImpact},${co.status},"${co.approvedBy || ''}","${co.approvalDate ? co.approvalDate.toISOString().split('T')[0] : ''}"`,
  );

  return headers + rows.join('\n');
};

// ============================================================================
// CONTINGENCY MANAGEMENT (41-45)
// ============================================================================

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
export const manageContingency = async (
  projectId: string,
  CostEstimate: any,
): Promise<ContingencyManagement> => {
  const estimate = await CostEstimate.findOne({
    where: {
      projectId,
      status: 'baseline',
    },
  });

  if (!estimate) throw new Error('Baseline estimate not found');

  const originalContingency = parseFloat(estimate.contingency);
  const committedContingency = 0; // TODO: Calculate from drawdown history
  const remainingContingency = originalContingency - committedContingency;
  const utilizationPercent = originalContingency > 0 ? (committedContingency / originalContingency) * 100 : 0;

  return {
    projectId,
    contingencyType: 'construction',
    originalContingency,
    committedContingency,
    remainingContingency,
    utilizationPercent,
    drawdownHistory: [],
  };
};

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
export const drawContingency = async (
  projectId: string,
  amount: number,
  reason: string,
  approvedBy: string,
  CostEstimate: any,
): Promise<ContingencyDrawdown> => {
  const estimate = await CostEstimate.findOne({
    where: {
      projectId,
      status: 'baseline',
    },
  });

  if (!estimate) throw new Error('Baseline estimate not found');

  const currentContingency = parseFloat(estimate.contingency);
  if (amount > currentContingency) throw new Error('Insufficient contingency');

  estimate.contingency = currentContingency - amount;
  estimate.metadata = {
    ...estimate.metadata,
    drawdowns: [
      ...(estimate.metadata.drawdowns || []),
      {
        drawdownDate: new Date(),
        amount,
        reason,
        approvedBy,
      },
    ],
  };

  await estimate.save();

  return {
    drawdownDate: new Date(),
    amount,
    reason,
    approvedBy,
  };
};

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
export const analyzeContingencyUtilization = async (
  projectId: string,
  CostEstimate: any,
): Promise<any> => {
  const estimate = await CostEstimate.findOne({
    where: {
      projectId,
      status: 'baseline',
    },
  });

  if (!estimate) throw new Error('Baseline estimate not found');

  const drawdowns = estimate.metadata?.drawdowns || [];
  const totalDrawn = drawdowns.reduce((sum: number, d: any) => sum + d.amount, 0);
  const originalContingency = parseFloat(estimate.contingency) + totalDrawn;

  const utilizationPercent = originalContingency > 0 ? (totalDrawn / originalContingency) * 100 : 0;

  const projectAge = Math.floor((new Date().getTime() - estimate.baselineDate.getTime()) / (30 * 86400000));
  const monthlyBurnRate = projectAge > 0 ? totalDrawn / projectAge : 0;

  return {
    projectId,
    originalContingency,
    totalDrawn,
    remainingContingency: parseFloat(estimate.contingency),
    utilizationPercent,
    monthlyBurnRate,
    projectedDepletionDate: monthlyBurnRate > 0 ? new Date(Date.now() + (parseFloat(estimate.contingency) / monthlyBurnRate) * 30 * 86400000) : null,
  };
};

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
export const forecastContingencyAdequacy = async (
  projectId: string,
  projectCompletion: number,
  CostEstimate: any,
): Promise<any> => {
  const contingency = await manageContingency(projectId, CostEstimate);

  const expectedUtilization = projectCompletion;
  const actualUtilization = contingency.utilizationPercent;

  const utilizationVariance = actualUtilization - expectedUtilization;

  let adequate = true;
  let recommendation = 'Contingency utilization is on track';

  if (utilizationVariance > 20) {
    adequate = false;
    recommendation = 'Contingency burn rate is too high - review and implement cost controls';
  } else if (utilizationVariance > 10) {
    recommendation = 'Monitor contingency closely - higher than expected utilization';
  }

  return {
    projectId,
    projectCompletion,
    expectedUtilization,
    actualUtilization,
    utilizationVariance,
    remainingContingency: contingency.remainingContingency,
    adequate,
    recommendation,
  };
};

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
export const generateContingencyReport = async (
  projectId: string,
  CostEstimate: any,
): Promise<string> => {
  const contingency = await manageContingency(projectId, CostEstimate);
  const analysis = await analyzeContingencyUtilization(projectId, CostEstimate);

  let report = `CONTINGENCY MANAGEMENT REPORT\n`;
  report += `Project: ${projectId}\n`;
  report += `Report Date: ${new Date().toISOString()}\n\n`;
  report += `Original Contingency: $${contingency.originalContingency.toLocaleString()}\n`;
  report += `Committed: $${contingency.committedContingency.toLocaleString()}\n`;
  report += `Remaining: $${contingency.remainingContingency.toLocaleString()}\n`;
  report += `Utilization: ${contingency.utilizationPercent.toFixed(2)}%\n\n`;
  report += `Monthly Burn Rate: $${analysis.monthlyBurnRate.toLocaleString()}\n`;

  if (analysis.projectedDepletionDate) {
    report += `Projected Depletion: ${analysis.projectedDepletionDate.toISOString().split('T')[0]}\n`;
  }

  return report;
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

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
@Injectable()
export class CostControlService {
  constructor(private readonly sequelize: Sequelize) {}

  async createEstimate(data: CostEstimateData) {
    const CostEstimate = createCostEstimateModel(this.sequelize);
    return createCostEstimate(data, CostEstimate);
  }

  async calculateEVM(projectId: string, periodEndDate: Date) {
    const CostTracking = createCostTrackingModel(this.sequelize);
    return calculateEarnedValueMetrics(projectId, periodEndDate, CostTracking);
  }

  async generateForecast(projectId: string) {
    const CostTracking = createCostTrackingModel(this.sequelize);
    return generateCostForecast(projectId, CostTracking);
  }

  async manageChangeOrders(projectId: string) {
    const ChangeOrder = createChangeOrderModel(this.sequelize);
    return calculateChangeOrderImpact(projectId, ChangeOrder);
  }
}

/**
 * Default export with all cost control utilities.
 */
export default {
  // Models
  createCostEstimateModel,
  createCostTrackingModel,
  createChangeOrderModel,

  // Cost Estimating
  createCostEstimate,
  validateEstimateData,
  calculateContingency,
  reviseEstimate,
  setEstimateAsBaseline,

  // Budget Development
  createBudgetFromEstimate,
  allocateBudgetByCategory,
  getBudgetSummary,
  transferBudget,
  exportBudgetReport,

  // Cost Tracking
  recordActualCost,
  recordCommittedCost,
  calculateCostVariance,
  getCostsByCategory,
  updatePercentComplete,

  // Earned Value Management
  calculateEarnedValueMetrics,
  calculateSPI,
  calculateCPI,
  calculateEAC,
  generateEVMTrendAnalysis,

  // Variance Analysis
  identifySignificantVariances,
  performVarianceRootCauseAnalysis,
  generateVarianceReportByCategory,
  trackVarianceTrends,
  exportVarianceAnalysisPDF,

  // Forecasting
  generateCostForecast,
  projectCashFlow,
  calculateEstimateToComplete,
  analyzeCostTrends,
  simulateWhatIfScenario,

  // Indirect Cost Allocation
  allocateIndirectCosts,
  calculateOverheadRate,
  distributeGeneralConditions,
  trackIndirectCostBurnRate,
  reconcileIndirectCosts,

  // Change Order Management
  createChangeOrder,
  approveChangeOrder,
  incorporateChangeOrder,
  calculateChangeOrderImpact,
  generateChangeOrderLog,

  // Contingency Management
  manageContingency,
  drawContingency,
  analyzeContingencyUtilization,
  forecastContingencyAdequacy,
  generateContingencyReport,

  // Service
  CostControlService,
};
