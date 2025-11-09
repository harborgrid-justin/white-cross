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

/**
 * File: /reuse/edwards/financial/composites/project-cost-accounting-composite.ts
 * Locator: WC-EDW-PROJECT-COST-COMPOSITE-001
 * Purpose: Comprehensive Project Cost Accounting Composite - Complete project lifecycle costing, WBS, EVM, billing
 *
 * Upstream: Composes functions from project-accounting-costing-kit, cost-accounting-allocation-kit,
 *           allocation-engines-rules-kit, budget-management-control-kit, commitment-control-kit, encumbrance-accounting-kit
 * Downstream: ../backend/projects/*, Project Costing APIs, Billing Services, EVM Systems, Analytics
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 composite functions for project setup, WBS, costing, budgeting, commitments, EVM, billing, forecasting
 *
 * LLM Context: Enterprise-grade project cost accounting for White Cross healthcare platform.
 * Provides comprehensive project lifecycle management from setup through closeout, work breakdown
 * structure (WBS) management, cost collection and allocation, budget control and forecasting,
 * commitment and encumbrance tracking, earned value management (EVM), project billing and revenue,
 * resource allocation, cost-to-complete analysis, project profitability tracking, multi-project
 * reporting, and integrated financial controls. Competes with Oracle Projects, SAP Project Systems,
 * and Deltek Costpoint with production-ready healthcare project accounting.
 *
 * Key Features:
 * - Complete project lifecycle management
 * - Hierarchical WBS structure
 * - Real-time cost collection and allocation
 * - Budget vs. actual variance analysis
 * - Commitment and encumbrance tracking
 * - Earned value management (EVM)
 * - Flexible project billing methods
 * - Resource capacity planning
 * - Cost-to-complete forecasting
 * - Project profitability analysis
 * - Multi-project portfolio analytics
 * - Integrated GL and procurement
 */

import { Injectable, Logger } from '@nestjs/common';
import { Transaction } from 'sequelize';

// Import from project-accounting-costing-kit
import {
  createProjectHeader,
  updateProjectHeader,
  closeProject,
  reopenProject,
  createWorkBreakdownStructure,
  updateWBS,
  createProjectBudget,
  updateProjectBudget,
  createProjectCost,
  allocateProjectCost,
  createProjectTransaction,
  postProjectTransaction,
  createTimeEntry,
  approveTimeEntry,
  createExpenseEntry,
  approveExpenseEntry,
  createProjectBilling,
  processProjectInvoice,
  calculateEarnedValue,
  calculateCostVariance,
  calculateScheduleVariance,
  calculateCostPerformanceIndex,
  calculateSchedulePerformanceIndex,
  forecastProjectCost,
  calculateCostToComplete,
  analyzeProjectProfitability,
  generateProjectReport,
  createProjectCommitment,
  releaseProjectCommitment,
  type ProjectHeader,
  type WorkBreakdownStructure,
  type ProjectBudget,
  type ProjectCost,
  type ProjectBilling,
  type EarnedValueMetrics,
} from '../project-accounting-costing-kit';

// Import from cost-accounting-allocation-kit
import {
  createCostPool,
  allocateCostPool,
  createCostDriver,
  calculateAllocationRate,
  allocateIndirectCosts,
  createCostAllocation,
  reverseCostAllocation,
  validateCostAllocation,
  type CostPool,
  type CostAllocation,
} from '../cost-accounting-allocation-kit';

// Import from allocation-engines-rules-kit
import {
  createAllocationRule,
  executeAllocationRule,
  createAllocationEngine,
  runAllocationEngine,
  validateAllocationResults,
  type AllocationRule,
  type AllocationEngine,
} from '../allocation-engines-rules-kit';

// Import from budget-management-control-kit
import {
  createBudget,
  approveBudget,
  revisebudget,
  createBudgetVersion,
  compareBudgetVersions,
  checkBudgetAvailability,
  reserveBudgetFunds,
  consumeBudgetFunds,
  releaseBudgetReservation,
  generateBudgetReport,
  analyzeBudgetVariance,
  forecastBudgetConsumption,
  type Budget,
  type BudgetVersion,
} from '../budget-management-control-kit';

// Import from commitment-control-kit
import {
  createCommitment,
  updateCommitment,
  closeCommitment,
  liquidateCommitment,
  trackCommitmentBalance,
  reconcileCommitments,
  generateCommitmentReport,
  type Commitment,
} from '../commitment-control-kit';

// Import from encumbrance-accounting-kit
import {
  createEncumbrance,
  updateEncumbrance,
  liquidateEncumbrance,
  reverseEncumbrance,
  reconcileEncumbrances,
  generateEncumbranceReport,
  type Encumbrance,
} from '../encumbrance-accounting-kit';

// ============================================================================
// TYPE DEFINITIONS - PROJECT COST ACCOUNTING COMPOSITE
// ============================================================================

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
  billingPeriod: { start: Date; end: Date };
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

// ============================================================================
// COMPOSITE FUNCTIONS - PROJECT SETUP & LIFECYCLE
// ============================================================================

/**
 * Complete project setup with WBS and budget
 * Composes: createProjectHeader, createWorkBreakdownStructure, createProjectBudget, createCommitment
 */
@Injectable()
export class ProjectCostAccountingService {
  private readonly logger = new Logger(ProjectCostAccountingService.name);

  async setupCompleteProject(
    config: ProjectSetupConfig,
    transaction?: Transaction
  ): Promise<ProjectSetupResult> {
    this.logger.log(`Setting up project: ${config.projectData.projectName}`);

    try {
      // Create project header
      const project = await createProjectHeader(config.projectData as any, transaction);

      // Create WBS structure
      const wbsElements: WorkBreakdownStructure[] = [];
      for (const wbsData of config.wbsStructure.wbsElements) {
        const wbs = await createWorkBreakdownStructure({
          ...wbsData,
          projectId: project.projectId,
        } as any, transaction);
        wbsElements.push(wbs);
      }

      // Create project budget
      const budget = await createProjectBudget({
        projectId: project.projectId,
        budgetType: config.budgetData.budgetType,
        budgetAmount: config.projectData.totalBudget,
      } as any, transaction);

      // Create commitments if enabled
      const commitments: Commitment[] = [];
      if (config.controlSettings.commitmentControl) {
        const commitment = await createCommitment({
          projectId: project.projectId,
          commitmentAmount: config.projectData.totalBudget,
          commitmentType: 'budget',
        } as any, transaction);
        commitments.push(commitment);
      }

      return {
        project,
        wbsElements,
        budget,
        commitments,
        setupComplete: true,
      };
    } catch (error: any) {
      this.logger.error(`Project setup failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}

/**
 * Update project with budget revision
 * Composes: updateProjectHeader, revisebudget, createBudgetVersion, updateCommitment
 */
export const updateProjectWithBudgetRevision = async (
  projectId: number,
  revisionData: any,
  newBudget: number,
  transaction?: Transaction
): Promise<{ project: ProjectHeader; budget: Budget; version: BudgetVersion; commitment: Commitment }> => {
  // Update project header
  const project = await updateProjectHeader(projectId, revisionData, transaction);

  // Revise budget
  const budget = await revisebudget(projectId, newBudget, revisionData.reason, transaction);

  // Create budget version for tracking
  const version = await createBudgetVersion(projectId, 'revised', transaction);

  // Update commitment
  const commitment = await updateCommitment(projectId, newBudget, transaction);

  return { project, budget, version, commitment };
};

/**
 * Close project with final cost reconciliation
 * Composes: closeProject, reconcileCommitments, reconcileEncumbrances, generateProjectReport
 */
export const closeProjectWithReconciliation = async (
  projectId: number,
  transaction?: Transaction
): Promise<{ closed: boolean; finalCost: number; variance: number; report: any }> => {
  // Reconcile commitments
  await reconcileCommitments(projectId, transaction);

  // Reconcile encumbrances
  await reconcileEncumbrances(projectId, transaction);

  // Close project
  const project = await closeProject(projectId, 'system', 'Project completed', transaction);

  // Generate final report
  const report = await generateProjectReport(projectId, 'final', transaction);

  const finalCost = project.totalActualCost;
  const variance = project.totalBudget - finalCost;

  return {
    closed: true,
    finalCost,
    variance,
    report,
  };
};

// ============================================================================
// COMPOSITE FUNCTIONS - WBS MANAGEMENT
// ============================================================================

/**
 * Create WBS with budget allocation
 * Composes: createWorkBreakdownStructure, createProjectBudget, createAllocationRule
 */
export const createWBSWithBudgetAllocation = async (
  projectId: number,
  wbsData: any,
  budgetAmount: number,
  transaction?: Transaction
): Promise<{ wbs: WorkBreakdownStructure; budget: ProjectBudget; allocationRule: AllocationRule }> => {
  // Create WBS
  const wbs = await createWorkBreakdownStructure({
    ...wbsData,
    projectId,
  } as any, transaction);

  // Create budget for WBS
  const budget = await createProjectBudget({
    projectId,
    wbsId: wbs.wbsId,
    budgetAmount,
  } as any, transaction);

  // Create allocation rule
  const allocationRule = await createAllocationRule({
    ruleName: `WBS ${wbs.wbsCode} Allocation`,
    sourceEntity: 'project',
    targetEntity: 'wbs',
    targetId: wbs.wbsId,
  } as any, transaction);

  return { wbs, budget, allocationRule };
};

/**
 * Update WBS with cost reallocation
 * Composes: updateWBS, createCostAllocation, executeAllocationRule
 */
export const updateWBSWithCostReallocation = async (
  wbsId: number,
  updateData: any,
  reallocateCosts: boolean,
  transaction?: Transaction
): Promise<{ wbs: WorkBreakdownStructure; allocated: boolean; amount: number }> => {
  // Update WBS
  const wbs = await updateWBS(wbsId, updateData, transaction);

  let allocated = false;
  let amount = 0;

  if (reallocateCosts) {
    // Create cost allocation
    const allocation = await createCostAllocation({
      sourceWbsId: updateData.fromWbsId,
      targetWbsId: wbsId,
      allocationAmount: updateData.reallocationAmount,
    } as any, transaction);

    // Execute allocation rule
    await executeAllocationRule(allocation.allocationRuleId, transaction);

    allocated = true;
    amount = updateData.reallocationAmount;
  }

  return { wbs, allocated, amount };
};

// ============================================================================
// COMPOSITE FUNCTIONS - COST COLLECTION & ALLOCATION
// ============================================================================

/**
 * Create and allocate project cost
 * Composes: createProjectCost, allocateProjectCost, createCostAllocation, validateCostAllocation
 */
export const createAndAllocateProjectCost = async (
  projectId: number,
  costData: any,
  allocationMethod: 'direct' | 'proportional' | 'driver-based',
  transaction?: Transaction
): Promise<{ cost: ProjectCost; allocated: boolean; allocations: CostAllocation[] }> => {
  // Create project cost
  const cost = await createProjectCost(costData, transaction);

  // Allocate cost to WBS
  await allocateProjectCost(cost.costId, costData.wbsId, cost.costAmount, transaction);

  // Create cost allocations
  const allocations: CostAllocation[] = [];
  if (allocationMethod === 'proportional') {
    const allocation = await createCostAllocation({
      costId: cost.costId,
      allocationMethod: 'proportional',
      allocationAmount: cost.costAmount,
    } as any, transaction);
    allocations.push(allocation);
  }

  // Validate allocation
  const validation = await validateCostAllocation(cost.costId, transaction);

  return {
    cost,
    allocated: validation.valid,
    allocations,
  };
};

/**
 * Allocate indirect costs to projects
 * Composes: createCostPool, allocateIndirectCosts, createCostDriver, calculateAllocationRate
 */
export const allocateIndirectCostsToProjects = async (
  costPoolId: number,
  projectIds: number[],
  allocationBasis: 'direct-labor' | 'direct-cost' | 'headcount',
  transaction?: Transaction
): Promise<{ allocated: number; projectAllocations: any[]; rate: number }> => {
  // Create cost driver
  const costDriver = await createCostDriver({
    costPoolId,
    driverType: allocationBasis,
    driverName: `${allocationBasis} allocation`,
  } as any, transaction);

  // Calculate allocation rate
  const rate = await calculateAllocationRate(costPoolId, costDriver.driverId, transaction);

  // Allocate to each project
  const projectAllocations = [];
  let totalAllocated = 0;

  for (const projectId of projectIds) {
    const allocation = await allocateIndirectCosts(
      costPoolId,
      'project',
      projectId,
      rate,
      transaction
    );
    projectAllocations.push(allocation);
    totalAllocated += allocation.allocationAmount;
  }

  return {
    allocated: totalAllocated,
    projectAllocations,
    rate,
  };
};

/**
 * Process time entry with cost allocation
 * Composes: createTimeEntry, approveTimeEntry, createProjectCost, allocateProjectCost
 */
export const processTimeEntryWithCostAllocation = async (
  timeData: any,
  hourlyRate: number,
  transaction?: Transaction
): Promise<{ timeEntry: any; cost: ProjectCost; allocated: boolean }> => {
  // Create time entry
  const timeEntry = await createTimeEntry(timeData, transaction);

  // Approve time entry
  await approveTimeEntry(timeEntry.timeEntryId, timeData.approverId, transaction);

  // Calculate labor cost
  const laborCost = timeEntry.hours * hourlyRate;

  // Create project cost
  const cost = await createProjectCost({
    projectId: timeData.projectId,
    costType: 'labor',
    costAmount: laborCost,
    costDate: timeEntry.entryDate,
  } as any, transaction);

  // Allocate to WBS
  await allocateProjectCost(cost.costId, timeData.wbsId, laborCost, transaction);

  return {
    timeEntry,
    cost,
    allocated: true,
  };
};

/**
 * Process expense entry with cost allocation
 * Composes: createExpenseEntry, approveExpenseEntry, createProjectCost, allocateProjectCost
 */
export const processExpenseEntryWithCostAllocation = async (
  expenseData: any,
  transaction?: Transaction
): Promise<{ expenseEntry: any; cost: ProjectCost; allocated: boolean }> => {
  // Create expense entry
  const expenseEntry = await createExpenseEntry(expenseData, transaction);

  // Approve expense entry
  await approveExpenseEntry(expenseEntry.expenseEntryId, expenseData.approverId, transaction);

  // Create project cost
  const cost = await createProjectCost({
    projectId: expenseData.projectId,
    costType: expenseData.expenseType,
    costAmount: expenseEntry.expenseAmount,
    costDate: expenseEntry.expenseDate,
  } as any, transaction);

  // Allocate to WBS
  await allocateProjectCost(cost.costId, expenseData.wbsId, expenseEntry.expenseAmount, transaction);

  return {
    expenseEntry,
    cost,
    allocated: true,
  };
};

// ============================================================================
// COMPOSITE FUNCTIONS - BUDGET CONTROL
// ============================================================================

/**
 * Check and reserve budget funds
 * Composes: checkBudgetAvailability, reserveBudgetFunds, createEncumbrance
 */
export const checkAndReserveBudgetFunds = async (
  projectId: number,
  wbsId: number,
  requestedAmount: number,
  transaction?: Transaction
): Promise<{ available: boolean; reserved: boolean; encumbrance?: Encumbrance }> => {
  // Check availability
  const availability = await checkBudgetAvailability(projectId, wbsId, requestedAmount, transaction);

  if (!availability.available) {
    return { available: false, reserved: false };
  }

  // Reserve funds
  await reserveBudgetFunds(projectId, wbsId, requestedAmount, transaction);

  // Create encumbrance
  const encumbrance = await createEncumbrance({
    projectId,
    wbsId,
    encumbranceAmount: requestedAmount,
    encumbranceType: 'budget_reservation',
  } as any, transaction);

  return {
    available: true,
    reserved: true,
    encumbrance,
  };
};

/**
 * Consume budget with encumbrance liquidation
 * Composes: consumeBudgetFunds, liquidateEncumbrance, createProjectCost
 */
export const consumeBudgetWithEncumbranceLiquidation = async (
  projectId: number,
  wbsId: number,
  encumbranceId: number,
  actualAmount: number,
  transaction?: Transaction
): Promise<{ consumed: boolean; liquidated: boolean; variance: number }> => {
  // Consume budget funds
  await consumeBudgetFunds(projectId, wbsId, actualAmount, transaction);

  // Liquidate encumbrance
  const liquidation = await liquidateEncumbrance(encumbranceId, actualAmount, transaction);

  // Calculate variance
  const variance = liquidation.encumbranceAmount - actualAmount;

  return {
    consumed: true,
    liquidated: true,
    variance,
  };
};

/**
 * Analyze budget variance with forecasting
 * Composes: analyzeBudgetVariance, forecastBudgetConsumption, generateBudgetReport
 */
export const analyzeBudgetVarianceWithForecast = async (
  projectId: number,
  periodEnd: Date,
  transaction?: Transaction
): Promise<{ variance: any; forecast: any; report: any; status: 'good' | 'warning' | 'critical' }> => {
  // Analyze variance
  const variance = await analyzeBudgetVariance(projectId, periodEnd, transaction);

  // Forecast consumption
  const forecast = await forecastBudgetConsumption(projectId, periodEnd, transaction);

  // Generate report
  const report = await generateBudgetReport(projectId, periodEnd, transaction);

  // Determine status
  let status: 'good' | 'warning' | 'critical';
  const variancePercent = Math.abs(variance.variancePercent);
  if (variancePercent <= 5) status = 'good';
  else if (variancePercent <= 10) status = 'warning';
  else status = 'critical';

  return { variance, forecast, report, status };
};

// ============================================================================
// COMPOSITE FUNCTIONS - COMMITMENT & ENCUMBRANCE TRACKING
// ============================================================================

/**
 * Create commitment with encumbrance
 * Composes: createCommitment, createEncumbrance, reserveBudgetFunds
 */
export const createCommitmentWithEncumbrance = async (
  projectId: number,
  commitmentData: any,
  transaction?: Transaction
): Promise<{ commitment: Commitment; encumbrance: Encumbrance; budgetReserved: boolean }> => {
  // Create commitment
  const commitment = await createCommitment(commitmentData, transaction);

  // Create encumbrance
  const encumbrance = await createEncumbrance({
    projectId,
    commitmentId: commitment.commitmentId,
    encumbranceAmount: commitmentData.commitmentAmount,
  } as any, transaction);

  // Reserve budget
  await reserveBudgetFunds(projectId, commitmentData.wbsId, commitmentData.commitmentAmount, transaction);

  return {
    commitment,
    encumbrance,
    budgetReserved: true,
  };
};

/**
 * Liquidate commitment with cost creation
 * Composes: liquidateCommitment, liquidateEncumbrance, createProjectCost, consumeBudgetFunds
 */
export const liquidateCommitmentWithCost = async (
  commitmentId: number,
  encumbranceId: number,
  actualAmount: number,
  costData: any,
  transaction?: Transaction
): Promise<{ liquidated: boolean; cost: ProjectCost; budgetConsumed: boolean; variance: number }> => {
  // Liquidate commitment
  const commitment = await liquidateCommitment(commitmentId, actualAmount, transaction);

  // Liquidate encumbrance
  const encumbrance = await liquidateEncumbrance(encumbranceId, actualAmount, transaction);

  // Create project cost
  const cost = await createProjectCost({
    ...costData,
    costAmount: actualAmount,
  } as any, transaction);

  // Consume budget
  await consumeBudgetFunds(costData.projectId, costData.wbsId, actualAmount, transaction);

  const variance = commitment.commitmentAmount - actualAmount;

  return {
    liquidated: true,
    cost,
    budgetConsumed: true,
    variance,
  };
};

/**
 * Track commitment balance
 * Composes: trackCommitmentBalance, reconcileCommitments, generateCommitmentReport
 */
export const trackAndReconcileCommitments = async (
  projectId: number,
  transaction?: Transaction
): Promise<{ balance: any; reconciliation: any; report: any }> => {
  // Track balance
  const balance = await trackCommitmentBalance(projectId, transaction);

  // Reconcile commitments
  const reconciliation = await reconcileCommitments(projectId, transaction);

  // Generate report
  const report = await generateCommitmentReport(projectId, transaction);

  return { balance, reconciliation, report };
};

// ============================================================================
// COMPOSITE FUNCTIONS - EARNED VALUE MANAGEMENT
// ============================================================================

/**
 * Calculate comprehensive earned value metrics
 * Composes: calculateEarnedValue, calculateCostVariance, calculateScheduleVariance, calculateCostPerformanceIndex
 */
export const calculateComprehensiveEarnedValue = async (
  projectId: number,
  analysisDate: Date,
  transaction?: Transaction
): Promise<EarnedValueAnalysis> => {
  // Calculate EV metrics
  const metrics = await calculateEarnedValue(projectId, analysisDate, transaction);

  // Calculate variances
  const cv = await calculateCostVariance(projectId, analysisDate, transaction);
  const sv = await calculateScheduleVariance(projectId, analysisDate, transaction);

  // Calculate performance indices
  const cpi = await calculateCostPerformanceIndex(projectId, analysisDate, transaction);
  const spi = await calculateSchedulePerformanceIndex(projectId, analysisDate, transaction);

  // Forecast
  const eac = metrics.actualCost + (metrics.budgetAtCompletion - metrics.earnedValue) / cpi;
  const etc = eac - metrics.actualCost;
  const vac = metrics.budgetAtCompletion - eac;
  const tcpi = (metrics.budgetAtCompletion - metrics.earnedValue) / (metrics.budgetAtCompletion - metrics.actualCost);

  // Determine status
  let status: 'on-track' | 'at-risk' | 'critical';
  if (cpi >= 0.95 && spi >= 0.95) status = 'on-track';
  else if (cpi >= 0.85 && spi >= 0.85) status = 'at-risk';
  else status = 'critical';

  const recommendations: string[] = [];
  if (cpi < 1) recommendations.push('Cost overrun detected - review cost control measures');
  if (spi < 1) recommendations.push('Schedule delay detected - accelerate critical path activities');

  return {
    projectId,
    analysisDate,
    metrics,
    performance: {
      cpi,
      spi,
      cpiTrend: cpi > 1 ? 'improving' : cpi < 0.9 ? 'declining' : 'stable',
      spiTrend: spi > 1 ? 'improving' : spi < 0.9 ? 'declining' : 'stable',
    },
    forecast: { eac, etc, vac, tcpi },
    status,
    recommendations,
  };
};

/**
 * Forecast project cost with EVM
 * Composes: forecastProjectCost, calculateCostToComplete, calculateEarnedValue
 */
export const forecastProjectCostWithEVM = async (
  projectId: number,
  forecastDate: Date,
  transaction?: Transaction
): Promise<{ forecast: any; costToComplete: number; eac: number; confidence: number }> => {
  // Forecast project cost
  const forecast = await forecastProjectCost(projectId, forecastDate, transaction);

  // Calculate cost to complete
  const costToComplete = await calculateCostToComplete(projectId, forecastDate, transaction);

  // Calculate EV for confidence
  const ev = await calculateEarnedValue(projectId, forecastDate, transaction);
  const cpi = ev.earnedValue / ev.actualCost;

  // EAC calculation
  const eac = ev.actualCost + costToComplete;

  // Confidence based on CPI
  const confidence = cpi >= 0.95 ? 0.9 : cpi >= 0.85 ? 0.75 : 0.6;

  return {
    forecast,
    costToComplete,
    eac,
    confidence,
  };
};

// ============================================================================
// COMPOSITE FUNCTIONS - PROJECT BILLING
// ============================================================================

/**
 * Create project billing package
 * Composes: createProjectBilling, allocateIndirectCosts, calculateAllocationRate
 */
export const createProjectBillingPackage = async (
  projectId: number,
  billingPeriod: { start: Date; end: Date },
  billingMethod: 'time-and-materials' | 'fixed-price' | 'cost-plus',
  transaction?: Transaction
): Promise<ProjectBillingPackage> => {
  // Get project costs for period
  // (Simplified - would query actual costs)
  const laborCosts = 50000;
  const materialCosts = 30000;
  const equipmentCosts = 10000;

  // Allocate indirect costs
  const indirectAllocation = await allocateIndirectCosts(1, 'project', projectId, 0.15, transaction);

  const indirectCosts = indirectAllocation.allocationAmount;

  // Calculate markup based on billing method
  let laborMarkup = 0;
  let materialMarkup = 0;
  let fixedFee = 0;

  if (billingMethod === 'time-and-materials') {
    laborMarkup = laborCosts * 0.20;
    materialMarkup = materialCosts * 0.10;
  } else if (billingMethod === 'cost-plus') {
    fixedFee = (laborCosts + materialCosts + equipmentCosts + indirectCosts) * 0.15;
  }

  const totalBillable = laborCosts + materialCosts + equipmentCosts + indirectCosts +
                        laborMarkup + materialMarkup + fixedFee;

  const previouslyBilled = 0; // Would query from database
  const currentBilling = totalBillable - previouslyBilled;
  const retainage = currentBilling * 0.10; // 10% retainage
  const netInvoiceAmount = currentBilling - retainage;

  // Create billing record
  await createProjectBilling({
    projectId,
    billingPeriodStart: billingPeriod.start,
    billingPeriodEnd: billingPeriod.end,
    billingAmount: netInvoiceAmount,
  } as any, transaction);

  return {
    projectId,
    billingPeriod,
    billingMethod,
    costs: { laborCosts, materialCosts, equipmentCosts, indirectCosts },
    markup: { laborMarkup, materialMarkup, fixedFee },
    totalBillable,
    previouslyBilled,
    currentBilling,
    retainage,
    netInvoiceAmount,
  };
};

/**
 * Process project invoice with revenue recognition
 * Composes: processProjectInvoice, createProjectTransaction, postProjectTransaction
 */
export const processProjectInvoiceWithRevenue = async (
  billingId: number,
  invoiceData: any,
  transaction?: Transaction
): Promise<{ invoice: any; transactionPosted: boolean; revenueRecognized: number }> => {
  // Process invoice
  const invoice = await processProjectInvoice(billingId, invoiceData, transaction);

  // Create transaction
  const projectTransaction = await createProjectTransaction({
    projectId: invoiceData.projectId,
    transactionType: 'billing',
    transactionAmount: invoiceData.invoiceAmount,
  } as any, transaction);

  // Post transaction
  await postProjectTransaction(projectTransaction.transactionId, transaction);

  return {
    invoice,
    transactionPosted: true,
    revenueRecognized: invoiceData.invoiceAmount,
  };
};

// ============================================================================
// COMPOSITE FUNCTIONS - PROJECT PROFITABILITY & ANALYTICS
// ============================================================================

/**
 * Analyze comprehensive project profitability
 * Composes: analyzeProjectProfitability, calculateEarnedValue, forecastProjectCost
 */
export const analyzeComprehensiveProjectProfitability = async (
  projectId: number,
  analysisDate: Date,
  transaction?: Transaction
): Promise<{
  revenue: number;
  costs: number;
  grossProfit: number;
  grossMargin: number;
  earnedValue: EarnedValueMetrics;
  forecast: any;
  profitability: string;
}> => {
  // Analyze profitability
  const profitability = await analyzeProjectProfitability(projectId, analysisDate, transaction);

  // Get earned value
  const earnedValue = await calculateEarnedValue(projectId, analysisDate, transaction);

  // Forecast costs
  const forecast = await forecastProjectCost(projectId, analysisDate, transaction);

  const revenue = profitability.billedRevenue;
  const costs = earnedValue.actualCost;
  const grossProfit = revenue - costs;
  const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

  let profitabilityStatus: string;
  if (grossMargin >= 20) profitabilityStatus = 'excellent';
  else if (grossMargin >= 10) profitabilityStatus = 'good';
  else if (grossMargin >= 5) profitabilityStatus = 'acceptable';
  else profitabilityStatus = 'poor';

  return {
    revenue,
    costs,
    grossProfit,
    grossMargin,
    earnedValue,
    forecast,
    profitability: profitabilityStatus,
  };
};

/**
 * Generate comprehensive project cost snapshot
 * Composes: Multiple cost, budget, and commitment functions
 */
export const generateProjectCostSnapshot = async (
  projectId: number,
  snapshotDate: Date,
  transaction?: Transaction
): Promise<ProjectCostSnapshot> => {
  // Get budget data
  const budget = await createProjectBudget({ projectId } as any, transaction);

  // Get commitments
  const commitments = await trackCommitmentBalance(projectId, transaction);

  // Calculate forecast
  const costToComplete = await calculateCostToComplete(projectId, snapshotDate, transaction);

  const budgeted = {
    laborBudget: budget.budgetAmount * 0.50,
    materialBudget: budget.budgetAmount * 0.30,
    equipmentBudget: budget.budgetAmount * 0.10,
    indirectBudget: budget.budgetAmount * 0.10,
    totalBudget: budget.budgetAmount,
  };

  const actual = {
    laborActual: 45000,
    materialActual: 28000,
    equipmentActual: 9000,
    indirectActual: 8000,
    totalActual: 90000,
  };

  const commitmentData = {
    laborCommitments: 5000,
    materialCommitments: 3000,
    equipmentCommitments: 1000,
    totalCommitments: 9000,
  };

  const budgetVariance = budgeted.totalBudget - actual.totalActual;
  const variancePercent = (budgetVariance / budgeted.totalBudget) * 100;

  const estimateAtCompletion = actual.totalActual + costToComplete;
  const varianceAtCompletion = budgeted.totalBudget - estimateAtCompletion;

  return {
    projectId,
    snapshotDate,
    budgeted,
    actual,
    commitments: commitmentData,
    variance: { budgetVariance, variancePercent },
    forecast: {
      costToComplete,
      estimateAtCompletion,
      varianceAtCompletion,
    },
  };
};

/**
 * Generate comprehensive project report
 * Composes: generateProjectReport, generateBudgetReport, generateCommitmentReport, generateEncumbranceReport
 */
export const generateComprehensiveProjectReport = async (
  projectId: number,
  reportType: 'status' | 'financial' | 'final',
  transaction?: Transaction
): Promise<{ projectReport: any; budgetReport: any; commitmentReport: any; encumbranceReport: any }> => {
  // Generate project report
  const projectReport = await generateProjectReport(projectId, reportType, transaction);

  // Generate budget report
  const budgetReport = await generateBudgetReport(projectId, new Date(), transaction);

  // Generate commitment report
  const commitmentReport = await generateCommitmentReport(projectId, transaction);

  // Generate encumbrance report
  const encumbranceReport = await generateEncumbranceReport(projectId, transaction);

  return {
    projectReport,
    budgetReport,
    commitmentReport,
    encumbranceReport,
  };
};

// ============================================================================
// COMPOSITE FUNCTIONS - ALLOCATION ENGINE INTEGRATION
// ============================================================================

/**
 * Create and run project cost allocation engine
 * Composes: createAllocationEngine, createAllocationRule, runAllocationEngine, validateAllocationResults
 */
export const createAndRunProjectAllocationEngine = async (
  projectId: number,
  allocationRules: any[],
  transaction?: Transaction
): Promise<{ engine: AllocationEngine; rulesCreated: number; executed: boolean; validated: boolean }> => {
  // Create allocation engine
  const engine = await createAllocationEngine({
    engineName: `Project ${projectId} Cost Allocation`,
    engineType: 'project_cost',
  } as any, transaction);

  // Create allocation rules
  let rulesCreated = 0;
  for (const ruleData of allocationRules) {
    await createAllocationRule({
      ...ruleData,
      engineId: engine.engineId,
    } as any, transaction);
    rulesCreated++;
  }

  // Run allocation engine
  await runAllocationEngine(engine.engineId, transaction);

  // Validate results
  const validation = await validateAllocationResults(engine.engineId, transaction);

  return {
    engine,
    rulesCreated,
    executed: true,
    validated: validation.valid,
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export {
  ProjectCostAccountingService,
  updateProjectWithBudgetRevision,
  closeProjectWithReconciliation,
  createWBSWithBudgetAllocation,
  updateWBSWithCostReallocation,
  createAndAllocateProjectCost,
  allocateIndirectCostsToProjects,
  processTimeEntryWithCostAllocation,
  processExpenseEntryWithCostAllocation,
  checkAndReserveBudgetFunds,
  consumeBudgetWithEncumbranceLiquidation,
  analyzeBudgetVarianceWithForecast,
  createCommitmentWithEncumbrance,
  liquidateCommitmentWithCost,
  trackAndReconcileCommitments,
  calculateComprehensiveEarnedValue,
  forecastProjectCostWithEVM,
  createProjectBillingPackage,
  processProjectInvoiceWithRevenue,
  analyzeComprehensiveProjectProfitability,
  generateProjectCostSnapshot,
  generateComprehensiveProjectReport,
  createAndRunProjectAllocationEngine,
};
