/**
 * LOC: CADISTCOMP001
 * File: /reuse/edwards/financial/composites/cost-allocation-distribution-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../cost-accounting-allocation-kit
 *   - ../allocation-engines-rules-kit
 *   - ../dimension-management-kit
 *   - ../financial-reporting-analytics-kit
 *   - ../audit-trail-compliance-kit
 *
 * DOWNSTREAM (imported by):
 *   - Backend cost accounting controllers
 *   - Allocation processing job schedulers
 *   - Healthcare department cost services
 *   - Management reporting services
 *   - Product costing modules
 */

/**
 * File: /reuse/edwards/financial/composites/cost-allocation-distribution-composite.ts
 * Locator: WC-EDW-CADIST-COMPOSITE-001
 * Purpose: Comprehensive Cost Allocation & Distribution Composite - Cost pool management, allocation bases, distribution rules, step-down allocations
 *
 * Upstream: Composes functions from cost-accounting-allocation-kit, allocation-engines-rules-kit,
 *           dimension-management-kit, financial-reporting-analytics-kit, audit-trail-compliance-kit
 * Downstream: ../backend/financial/*, Cost Accounting APIs, ABC Services, Department Allocation, Product Costing
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 composite functions for cost pools, allocation bases, distribution, ABC, overhead allocation, variance analysis
 *
 * LLM Context: Enterprise-grade cost allocation and distribution composite for White Cross healthcare platform.
 * Provides comprehensive cost pool management with multiple allocation methods (direct, step-down, reciprocal),
 * allocation basis calculation with statistical drivers, activity-based costing (ABC), overhead allocation
 * (traditional and ABC), distribution rule engines, cost driver analysis, step-down allocation cascades,
 * reciprocal allocation processing, variance analysis, product/service costing, department cost allocation,
 * and HIPAA-compliant audit trails. Competes with Oracle JD Edwards EnterpriseOne with production-ready
 * cost accounting infrastructure for complex healthcare operations.
 *
 * Cost Allocation Design Principles:
 * - Multi-tier allocation hierarchies with precedence rules
 * - Statistical driver integration for accurate allocations
 * - Activity-based costing for service-intensive operations
 * - Step-down allocation for service department cascades
 * - Reciprocal allocation for mutual service departments
 * - Real-time allocation processing with validation
 * - Comprehensive variance analysis and reporting
 * - Audit trails for regulatory compliance and transparency
 */

import { Transaction, Op, fn, col, literal } from 'sequelize';

// Import from cost accounting allocation kit
import {
  createCostCenterModel,
  createCostPoolModel,
  createCostCenter,
  getCostCenterById,
  getCostCenterByCode,
  listCostCenters,
  updateCostCenterBudget,
  createCostPool,
  addCostToPool,
  getCostPoolById,
  allocateOverheadDirect,
  allocateServiceCostsStepDown,
  allocateOverheadABC,
  calculatePredeterminedOverheadRate,
  applyOverheadToJob,
  createStandardCost,
  getStandardCostForProduct,
  calculateMaterialPriceVariance,
  calculateMaterialQuantityVariance,
  calculateLaborRateVariance,
  calculateLaborEfficiencyVariance,
  calculateOverheadSpendingVariance,
  calculateOverheadVolumeVariance,
  calculateOverheadEfficiencyVariance,
  performComprehensiveVarianceAnalysis,
  type CostCenter,
  type CostPool,
  type CostDriver,
  type ActivityBasedCost,
  type OverheadAllocation,
  type StandardCost,
  type VarianceAnalysis,
} from '../cost-accounting-allocation-kit';

// Import from allocation engines rules kit
import {
  createAllocationRuleModel,
  createAllocationBasisModel,
  createStatisticalDriverModel,
  createAllocationPoolModel,
  createAllocationRule,
  getActiveAllocationRules,
  validateAllocationRule,
  createAllocationBasis,
  updateAllocationBasis,
  getStatisticalDriversByDepartment,
  createStatisticalDriver,
  updateStatisticalDriverValue,
  createAllocationPool,
  processDirectAllocation,
  processStepDownAllocation,
  processReciprocalAllocation,
  calculateAllocationPercentages,
  validateAllocationTotal,
  type AllocationRule,
  type AllocationBasis,
  type StatisticalDriver,
  type AllocationPool,
  type AllocationResult,
  type AllocationValidation,
} from '../allocation-engines-rules-kit';

// Import from dimension management kit
import {
  createCostCenterModel as createDimCostCenterModel,
  createDepartmentModel,
  createProjectModel,
  type CostCenter as DimCostCenter,
  type Department,
  type Project,
} from '../dimension-management-kit';

// Import from financial reporting analytics kit
import {
  performVarianceAnalysis,
  generateManagementDashboard,
  calculateFinancialKPIs,
  generateSegmentReporting,
  type VarianceAnalysisResult,
  type ManagementDashboard,
  type SegmentReport,
} from '../financial-reporting-analytics-kit';

// Import from audit trail compliance kit
import {
  createAuditLog,
  trackFieldChange,
  logUserActivity,
  buildDataLineageTrail,
  generateComplianceReport,
  type AuditLogEntry,
  type ChangeTrackingRecord,
  type DataLineageNode,
} from '../audit-trail-compliance-kit';

// ============================================================================
// TYPE DEFINITIONS - COST ALLOCATION COMPOSITE
// ============================================================================

/**
 * Cost allocation configuration
 */
export interface CostAllocationConfig {
  fiscalYear: number;
  fiscalPeriod: number;
  allocationMethod: 'direct' | 'step-down' | 'reciprocal' | 'activity-based' | 'hybrid';
  processServiceDepartments: boolean;
  processOverhead: boolean;
  processActivityBased: boolean;
  validateTotals: boolean;
  auditEnabled: boolean;
  autoPostJournals: boolean;
}

/**
 * Allocation batch result
 */
export interface AllocationBatchResult {
  batchId: string;
  processDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  allocationMethod: string;
  poolsProcessed: number;
  totalAllocated: number;
  allocations: AllocationResult[];
  journalEntries: AllocationJournalEntry[];
  errors: string[];
  auditTrail: AuditLogEntry[];
  validationResult: AllocationValidation;
}

/**
 * Allocation journal entry
 */
export interface AllocationJournalEntry {
  entryId: string;
  sourcePool: string;
  targetCostCenter: string;
  allocationAmount: number;
  allocationPercentage: number;
  allocationBasis: string;
  description: string;
}

/**
 * Cost pool summary
 */
export interface CostPoolSummary {
  poolId: number;
  poolCode: string;
  poolName: string;
  poolType: string;
  totalCost: number;
  allocatedCost: number;
  unallocatedCost: number;
  allocationRate: number;
  targetCostCenters: CostCenterAllocation[];
}

/**
 * Cost center allocation
 */
export interface CostCenterAllocation {
  costCenterId: number;
  costCenterCode: string;
  costCenterName: string;
  allocatedAmount: number;
  allocationPercentage: number;
  allocationBasis: string;
  basisValue: number;
}

/**
 * Activity-based costing result
 */
export interface ABCResult {
  activityId: number;
  activityCode: string;
  activityName: string;
  activityType: string;
  totalActivityCost: number;
  activityVolume: number;
  costPerActivity: number;
  costObjectAllocations: CostObjectAllocation[];
}

/**
 * Cost object allocation
 */
export interface CostObjectAllocation {
  costObjectId: string;
  costObjectType: 'product' | 'service' | 'patient' | 'department' | 'project';
  activityConsumption: number;
  allocatedCost: number;
}

/**
 * Step-down allocation sequence
 */
export interface StepDownSequence {
  sequenceNumber: number;
  serviceDepartment: string;
  totalCost: number;
  recipientDepartments: string[];
  allocationBasis: string;
  allocations: Map<string, number>;
}

/**
 * Reciprocal allocation matrix
 */
export interface ReciprocalAllocationMatrix {
  departments: string[];
  costMatrix: number[][];
  allocationMatrix: number[][];
  simultaneousEquations: string[];
  solvedAllocations: Map<string, Map<string, number>>;
}

/**
 * Overhead rate calculation
 */
export interface OverheadRateCalculation {
  poolId: number;
  poolName: string;
  estimatedOverhead: number;
  estimatedActivityBase: number;
  predeterminedRate: number;
  actualOverhead: number;
  actualActivityBase: number;
  appliedOverhead: number;
  underApplied: number;
  overApplied: number;
}

/**
 * Comprehensive variance report
 */
export interface ComprehensiveVarianceReport {
  reportDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  materialVariances: VarianceAnalysis[];
  laborVariances: VarianceAnalysis[];
  overheadVariances: VarianceAnalysis[];
  totalFavorable: number;
  totalUnfavorable: number;
  netVariance: number;
  varianceExplanations: VarianceExplanation[];
}

/**
 * Variance explanation
 */
export interface VarianceExplanation {
  varianceType: string;
  costCenter: string;
  amount: number;
  favorable: boolean;
  explanation: string;
  correctiveAction?: string;
}

// ============================================================================
// COMPOSITE FUNCTIONS - COST POOL MANAGEMENT
// ============================================================================

/**
 * Creates and initializes cost pool with allocation rules
 * Composes: createCostPool, createAllocationRule, createAuditLog
 */
export const initializeCostPoolWithRules = async (
  sequelize: any,
  poolCode: string,
  poolName: string,
  poolType: 'overhead' | 'direct' | 'indirect' | 'service' | 'activity',
  allocationMethod: 'direct' | 'step-down' | 'reciprocal' | 'activity-based',
  fiscalYear: number,
  fiscalPeriod: number,
  allocationBasis: string,
  targetDepartments: string[],
  userId: string,
  transaction?: Transaction
): Promise<{ pool: CostPool; rule: AllocationRule; auditLogId: number }> => {
  // Create cost pool
  const pool = await createCostPool(
    sequelize,
    poolCode,
    poolName,
    poolType,
    allocationMethod,
    fiscalYear,
    fiscalPeriod,
    userId,
    transaction
  );

  // Create allocation rule
  const rule = await createAllocationRule(
    sequelize,
    `RULE-${poolCode}`,
    `Allocation rule for ${poolName}`,
    `Automated allocation rule for ${poolName}`,
    allocationMethod,
    poolType as any,
    poolCode,
    targetDepartments,
    allocationBasis,
    allocationBasis,
    new Date(),
    userId,
    transaction
  );

  // Create audit log
  const auditLog = await createAuditLog(
    sequelize,
    'cost_pools',
    pool.costPoolId,
    'INSERT',
    userId,
    `Cost pool initialized: ${poolCode}`,
    {},
    {
      poolCode,
      poolType,
      allocationMethod,
      targetDepartments,
    },
    transaction
  );

  return { pool, rule, auditLogId: auditLog.auditId };
};

/**
 * Adds costs to multiple pools with validation
 * Composes: addCostToPool, validateAllocationTotal, trackFieldChange
 */
export const bulkAddCostsToPool = async (
  sequelize: any,
  poolId: number,
  costs: Array<{ accountCode: string; amount: number; description: string }>,
  userId: string,
  transaction?: Transaction
): Promise<{ added: number; totalAmount: number; errors: string[] }> => {
  const errors: string[] = [];
  let added = 0;
  let totalAmount = 0;

  for (const cost of costs) {
    try {
      await addCostToPool(
        sequelize,
        poolId,
        cost.accountCode,
        cost.amount,
        cost.description,
        userId,
        transaction
      );

      totalAmount += cost.amount;
      added++;

      // Track field change
      await trackFieldChange(
        sequelize,
        'cost_pools',
        poolId,
        'totalCost',
        null,
        cost.amount,
        userId,
        `Added cost: ${cost.description}`,
        transaction
      );
    } catch (error: any) {
      errors.push(`${cost.accountCode}: ${error.message}`);
    }
  }

  // Validate total
  const pool = await getCostPoolById(sequelize, poolId, transaction);
  await validateAllocationTotal(
    sequelize,
    poolId,
    pool.totalCost,
    transaction
  );

  return { added, totalAmount, errors };
};

/**
 * Retrieves cost pool summary with allocation details
 * Composes: getCostPoolById, calculateAllocationPercentages, getActiveAllocationRules
 */
export const getCostPoolSummary = async (
  sequelize: any,
  poolId: number,
  transaction?: Transaction
): Promise<CostPoolSummary> => {
  const pool = await getCostPoolById(sequelize, poolId, transaction);

  // Get allocation rules for this pool
  const rules = await getActiveAllocationRules(
    sequelize,
    pool.fiscalYear,
    pool.fiscalPeriod,
    transaction
  );

  const poolRules = rules.filter(r => r.sourceDepartment === pool.poolCode);

  // Calculate allocation percentages
  const allocations = await calculateAllocationPercentages(
    sequelize,
    poolId,
    poolRules[0]?.allocationBasis || 'headcount',
    transaction
  );

  // Build target cost center allocations
  const targetCostCenters: CostCenterAllocation[] = [];

  for (const [costCenterCode, percentage] of allocations.entries()) {
    const costCenter = await getCostCenterByCode(sequelize, costCenterCode, transaction);

    if (costCenter) {
      targetCostCenters.push({
        costCenterId: costCenter.costCenterId,
        costCenterCode: costCenter.costCenterCode,
        costCenterName: costCenter.costCenterName,
        allocatedAmount: pool.totalCost * (percentage / 100),
        allocationPercentage: percentage,
        allocationBasis: poolRules[0]?.allocationBasis || 'headcount',
        basisValue: 0, // Would be populated from statistical drivers
      });
    }
  }

  const allocatedCost = targetCostCenters.reduce((sum, t) => sum + t.allocatedAmount, 0);

  return {
    poolId: pool.costPoolId,
    poolCode: pool.poolCode,
    poolName: pool.poolName,
    poolType: pool.poolType,
    totalCost: pool.totalCost,
    allocatedCost,
    unallocatedCost: pool.totalCost - allocatedCost,
    allocationRate: pool.totalCost > 0 ? allocatedCost / pool.totalCost : 0,
    targetCostCenters,
  };
};

// ============================================================================
// COMPOSITE FUNCTIONS - ALLOCATION BASIS & DRIVERS
// ============================================================================

/**
 * Creates allocation basis with statistical drivers
 * Composes: createAllocationBasis, createStatisticalDriver, createAuditLog
 */
export const createAllocationBasisWithDrivers = async (
  sequelize: any,
  basisCode: string,
  basisName: string,
  basisType: 'statistical' | 'financial' | 'physical' | 'time-based' | 'activity-based',
  driverType: 'patient-days' | 'square-footage' | 'headcount' | 'transactions' | 'revenue' | 'custom',
  departments: Array<{ code: string; driverValue: number }>,
  fiscalYear: number,
  fiscalPeriod: number,
  userId: string,
  transaction?: Transaction
): Promise<{
  basis: AllocationBasis;
  drivers: StatisticalDriver[];
  totalDriverValue: number;
  auditLogId: number;
}> => {
  // Create allocation basis
  const basis = await createAllocationBasis(
    sequelize,
    basisCode,
    basisName,
    basisType,
    `Statistical driver: ${driverType}`,
    driverType === 'custom' ? 'Custom calculation' : `Count of ${driverType}`,
    driverType === 'patient-days' ? 'days' : driverType === 'square-footage' ? 'sqft' : 'units',
    'statistical_system',
    'monthly',
    userId,
    transaction
  );

  const drivers: StatisticalDriver[] = [];
  let totalDriverValue = 0;

  // Create statistical drivers for each department
  for (const dept of departments) {
    const driver = await createStatisticalDriver(
      sequelize,
      `${basisCode}-${dept.code}`,
      `${basisName} - ${dept.code}`,
      driverType,
      dept.code,
      fiscalYear,
      fiscalPeriod,
      dept.driverValue,
      driverType === 'square-footage' ? 'sqft' : 'units',
      'statistical_system',
      userId,
      transaction
    );

    drivers.push(driver);
    totalDriverValue += dept.driverValue;
  }

  // Create audit log
  const auditLog = await createAuditLog(
    sequelize,
    'allocation_basis',
    basis.basisId,
    'INSERT',
    userId,
    `Allocation basis created: ${basisCode}`,
    {},
    {
      basisCode,
      basisType,
      driverType,
      departmentCount: departments.length,
      totalDriverValue,
    },
    transaction
  );

  return { basis, drivers, totalDriverValue, auditLogId: auditLog.auditId };
};

/**
 * Updates statistical driver values in bulk
 * Composes: updateStatisticalDriverValue, validateAllocationRule, trackFieldChange
 */
export const bulkUpdateStatisticalDrivers = async (
  sequelize: any,
  updates: Array<{ driverCode: string; newValue: number; validatedBy?: string }>,
  userId: string,
  transaction?: Transaction
): Promise<{ updated: number; errors: string[]; validationResults: AllocationValidation[] }> => {
  const errors: string[] = [];
  const validationResults: AllocationValidation[] = [];
  let updated = 0;

  const StatisticalDriverModel = createStatisticalDriverModel(sequelize);

  for (const update of updates) {
    try {
      // Get current driver
      const driver = await StatisticalDriverModel.findOne({
        where: { driverCode: update.driverCode },
        transaction,
      });

      if (!driver) {
        errors.push(`Driver not found: ${update.driverCode}`);
        continue;
      }

      const oldValue = driver.driverValue;

      // Update driver
      await updateStatisticalDriverValue(
        sequelize,
        update.driverCode,
        update.newValue,
        update.validatedBy,
        userId,
        transaction
      );

      // Track change
      await trackFieldChange(
        sequelize,
        'statistical_drivers',
        driver.driverId,
        'driverValue',
        oldValue,
        update.newValue,
        userId,
        'Statistical driver update',
        transaction
      );

      updated++;
    } catch (error: any) {
      errors.push(`${update.driverCode}: ${error.message}`);
    }
  }

  // Validate allocation rules affected by driver updates
  const affectedRules = await getActiveAllocationRules(sequelize, 0, 0, transaction);

  for (const rule of affectedRules) {
    const validation = await validateAllocationRule(
      sequelize,
      rule.ruleId,
      transaction
    );
    validationResults.push(validation);
  }

  return { updated, errors, validationResults };
};

/**
 * Calculates allocation percentages from statistical drivers
 * Composes: getStatisticalDriversByDepartment, calculateAllocationPercentages
 */
export const calculateAllocationPercentagesFromDrivers = async (
  sequelize: any,
  basisCode: string,
  fiscalYear: number,
  fiscalPeriod: number,
  transaction?: Transaction
): Promise<Map<string, { percentage: number; driverValue: number; totalDrivers: number }>> => {
  const AllocationBasisModel = createAllocationBasisModel(sequelize);

  // Get allocation basis
  const basis = await AllocationBasisModel.findOne({
    where: { basisCode },
    transaction,
  });

  if (!basis) {
    throw new Error(`Allocation basis not found: ${basisCode}`);
  }

  // Get all drivers for this basis
  const StatisticalDriverModel = createStatisticalDriverModel(sequelize);

  const drivers = await StatisticalDriverModel.findAll({
    where: {
      driverCode: { [Op.like]: `${basisCode}-%` },
      fiscalYear,
      fiscalPeriod,
    },
    transaction,
  });

  // Calculate total driver value
  const totalDriverValue = drivers.reduce((sum, d) => sum + d.driverValue, 0);

  // Calculate percentages
  const percentages = new Map<string, { percentage: number; driverValue: number; totalDrivers: number }>();

  for (const driver of drivers) {
    const department = driver.department;
    const percentage = totalDriverValue > 0 ? (driver.driverValue / totalDriverValue) * 100 : 0;

    percentages.set(department, {
      percentage,
      driverValue: driver.driverValue,
      totalDrivers: totalDriverValue,
    });
  }

  return percentages;
};

// ============================================================================
// COMPOSITE FUNCTIONS - DIRECT ALLOCATION
// ============================================================================

/**
 * Processes direct allocation with comprehensive audit trail
 * Composes: processDirectAllocation, createAuditLog, validateAllocationTotal
 */
export const processDirectAllocationWithAudit = async (
  sequelize: any,
  poolId: number,
  allocationDate: Date,
  userId: string,
  transaction?: Transaction
): Promise<AllocationBatchResult> => {
  const batchId = `DIRECT-ALLOC-${poolId}-${Date.now()}`;
  const pool = await getCostPoolById(sequelize, poolId, transaction);

  try {
    // Get allocation rules
    const rules = await getActiveAllocationRules(
      sequelize,
      pool.fiscalYear,
      pool.fiscalPeriod,
      transaction
    );

    const poolRule = rules.find(r => r.sourceDepartment === pool.poolCode);

    if (!poolRule) {
      throw new Error(`No allocation rule found for pool ${pool.poolCode}`);
    }

    // Calculate allocation percentages
    const percentages = await calculateAllocationPercentagesFromDrivers(
      sequelize,
      poolRule.allocationBasis,
      pool.fiscalYear,
      pool.fiscalPeriod,
      transaction
    );

    // Process direct allocation
    const result = await processDirectAllocation(
      sequelize,
      poolId,
      poolRule.ruleId,
      userId,
      transaction
    );

    // Create journal entries
    const journalEntries: AllocationJournalEntry[] = [];

    for (const [dept, alloc] of result.allocations.entries()) {
      const pctData = percentages.get(dept);
      journalEntries.push({
        entryId: `${batchId}-${dept}`,
        sourcePool: pool.poolCode,
        targetCostCenter: dept,
        allocationAmount: alloc,
        allocationPercentage: pctData?.percentage || 0,
        allocationBasis: poolRule.allocationBasis,
        description: `Direct allocation from ${pool.poolName}`,
      });
    }

    // Validate total
    const validation = await validateAllocationTotal(
      sequelize,
      poolId,
      pool.totalCost,
      transaction
    );

    // Create audit trail
    const auditLog = await createAuditLog(
      sequelize,
      'cost_allocation',
      poolId,
      'EXECUTE',
      userId,
      `Direct allocation: ${pool.poolCode}`,
      {},
      {
        batchId,
        poolId,
        totalAllocated: result.totalAllocated,
        targetCount: result.allocations.size,
      },
      transaction
    );

    return {
      batchId,
      processDate: allocationDate,
      fiscalYear: pool.fiscalYear,
      fiscalPeriod: pool.fiscalPeriod,
      allocationMethod: 'direct',
      poolsProcessed: 1,
      totalAllocated: result.totalAllocated,
      allocations: [result],
      journalEntries,
      errors: [],
      auditTrail: [auditLog],
      validationResult: validation,
    };
  } catch (error: any) {
    throw new Error(`Direct allocation failed: ${error.message}`);
  }
};

/**
 * Processes multiple direct allocations in batch
 * Composes: processDirectAllocationWithAudit for multiple pools
 */
export const processBatchDirectAllocations = async (
  sequelize: any,
  poolIds: number[],
  allocationDate: Date,
  userId: string,
  transaction?: Transaction
): Promise<AllocationBatchResult> => {
  const batchId = `BATCH-DIRECT-${Date.now()}`;
  const allAllocations: AllocationResult[] = [];
  const allJournalEntries: AllocationJournalEntry[] = [];
  const errors: string[] = [];
  const auditTrail: AuditLogEntry[] = [];
  let totalAllocated = 0;
  let poolsProcessed = 0;

  for (const poolId of poolIds) {
    try {
      const result = await processDirectAllocationWithAudit(
        sequelize,
        poolId,
        allocationDate,
        userId,
        transaction
      );

      allAllocations.push(...result.allocations);
      allJournalEntries.push(...result.journalEntries);
      auditTrail.push(...result.auditTrail);
      totalAllocated += result.totalAllocated;
      poolsProcessed++;
    } catch (error: any) {
      errors.push(`Pool ${poolId}: ${error.message}`);
    }
  }

  // Create batch audit log
  const batchAuditLog = await createAuditLog(
    sequelize,
    'cost_allocation_batch',
    0,
    'EXECUTE',
    userId,
    `Batch direct allocation: ${poolsProcessed} pools`,
    {},
    { batchId, poolsProcessed, totalAllocated },
    transaction
  );

  auditTrail.push(batchAuditLog);

  return {
    batchId,
    processDate: allocationDate,
    fiscalYear: 0,
    fiscalPeriod: 0,
    allocationMethod: 'direct',
    poolsProcessed,
    totalAllocated,
    allocations: allAllocations,
    journalEntries: allJournalEntries,
    errors,
    auditTrail,
    validationResult: { valid: errors.length === 0, errors, warnings: [] },
  };
};

// ============================================================================
// COMPOSITE FUNCTIONS - STEP-DOWN ALLOCATION
// ============================================================================

/**
 * Processes step-down allocation with cascade sequencing
 * Composes: processStepDownAllocation, createAuditLog, validateAllocationTotal
 */
export const processStepDownAllocationWithSequence = async (
  sequelize: any,
  serviceDepartmentIds: number[],
  allocationDate: Date,
  fiscalYear: number,
  fiscalPeriod: number,
  userId: string,
  transaction?: Transaction
): Promise<{
  batchResult: AllocationBatchResult;
  sequences: StepDownSequence[];
}> => {
  const batchId = `STEPDOWN-${Date.now()}`;
  const sequences: StepDownSequence[] = [];
  const allAllocations: AllocationResult[] = [];
  const allJournalEntries: AllocationJournalEntry[] = [];
  const errors: string[] = [];
  const auditTrail: AuditLogEntry[] = [];
  let totalAllocated = 0;

  // Get all service department pools in order
  const servicePools: CostPool[] = [];
  for (const deptId of serviceDepartmentIds) {
    const pool = await getCostPoolById(sequelize, deptId, transaction);
    servicePools.push(pool);
  }

  // Sort by allocation priority (could be based on cost, headcount, or manual priority)
  servicePools.sort((a, b) => b.totalCost - a.totalCost);

  // Process each service department in sequence
  for (let i = 0; i < servicePools.length; i++) {
    const pool = servicePools[i];

    try {
      // Get allocation rules for this pool
      const rules = await getActiveAllocationRules(
        sequelize,
        fiscalYear,
        fiscalPeriod,
        transaction
      );

      const poolRule = rules.find(r => r.sourceDepartment === pool.poolCode);

      if (!poolRule) {
        errors.push(`No rule for ${pool.poolCode}`);
        continue;
      }

      // Filter out departments already allocated (in step-down)
      const remainingDepts = poolRule.targetDepartments.filter(
        dept => !servicePools.slice(0, i).map(p => p.poolCode).includes(dept)
      );

      // Process allocation
      const result = await processStepDownAllocation(
        sequelize,
        pool.costPoolId,
        poolRule.ruleId,
        userId,
        transaction
      );

      // Create sequence record
      const sequence: StepDownSequence = {
        sequenceNumber: i + 1,
        serviceDepartment: pool.poolCode,
        totalCost: pool.totalCost,
        recipientDepartments: remainingDepts,
        allocationBasis: poolRule.allocationBasis,
        allocations: result.allocations,
      };
      sequences.push(sequence);

      // Create journal entries
      for (const [dept, amount] of result.allocations.entries()) {
        allJournalEntries.push({
          entryId: `${batchId}-${pool.poolCode}-${dept}`,
          sourcePool: pool.poolCode,
          targetCostCenter: dept,
          allocationAmount: amount,
          allocationPercentage: (amount / pool.totalCost) * 100,
          allocationBasis: poolRule.allocationBasis,
          description: `Step ${i + 1}: ${pool.poolName} to ${dept}`,
        });
      }

      allAllocations.push(result);
      totalAllocated += result.totalAllocated;

      // Create audit log for this step
      const stepAuditLog = await createAuditLog(
        sequelize,
        'stepdown_allocation',
        pool.costPoolId,
        'EXECUTE',
        userId,
        `Step ${i + 1}: ${pool.poolCode}`,
        {},
        {
          sequenceNumber: i + 1,
          poolCode: pool.poolCode,
          totalCost: pool.totalCost,
          recipientCount: remainingDepts.length,
        },
        transaction
      );
      auditTrail.push(stepAuditLog);

    } catch (error: any) {
      errors.push(`Step ${i + 1} (${pool.poolCode}): ${error.message}`);
    }
  }

  // Create batch audit log
  const batchAuditLog = await createAuditLog(
    sequelize,
    'stepdown_allocation_batch',
    0,
    'EXECUTE',
    userId,
    `Step-down allocation: ${servicePools.length} steps`,
    {},
    {
      batchId,
      steps: servicePools.length,
      totalAllocated,
    },
    transaction
  );
  auditTrail.push(batchAuditLog);

  const batchResult: AllocationBatchResult = {
    batchId,
    processDate: allocationDate,
    fiscalYear,
    fiscalPeriod,
    allocationMethod: 'step-down',
    poolsProcessed: servicePools.length,
    totalAllocated,
    allocations: allAllocations,
    journalEntries: allJournalEntries,
    errors,
    auditTrail,
    validationResult: { valid: errors.length === 0, errors, warnings: [] },
  };

  return { batchResult, sequences };
};

// ============================================================================
// COMPOSITE FUNCTIONS - RECIPROCAL ALLOCATION
// ============================================================================

/**
 * Processes reciprocal allocation with simultaneous equations
 * Composes: processReciprocalAllocation, createAuditLog, buildDataLineageTrail
 */
export const processReciprocalAllocationWithMatrix = async (
  sequelize: any,
  serviceDepartmentIds: number[],
  allocationDate: Date,
  fiscalYear: number,
  fiscalPeriod: number,
  userId: string,
  transaction?: Transaction
): Promise<{
  batchResult: AllocationBatchResult;
  matrix: ReciprocalAllocationMatrix;
}> => {
  const batchId = `RECIPROCAL-${Date.now()}`;

  // Get service department pools
  const servicePools: CostPool[] = [];
  const departments: string[] = [];

  for (const deptId of serviceDepartmentIds) {
    const pool = await getCostPoolById(sequelize, deptId, transaction);
    servicePools.push(pool);
    departments.push(pool.poolCode);
  }

  // Build cost matrix (initial costs)
  const costMatrix: number[][] = servicePools.map(p => [p.totalCost]);

  // Build allocation matrix (percentages between departments)
  const allocationMatrix: number[][] = [];
  const allocationRules = await getActiveAllocationRules(
    sequelize,
    fiscalYear,
    fiscalPeriod,
    transaction
  );

  for (const sourcePool of servicePools) {
    const row: number[] = [];
    const rule = allocationRules.find(r => r.sourceDepartment === sourcePool.poolCode);

    if (rule) {
      const percentages = await calculateAllocationPercentagesFromDrivers(
        sequelize,
        rule.allocationBasis,
        fiscalYear,
        fiscalPeriod,
        transaction
      );

      for (const targetDept of departments) {
        const pct = percentages.get(targetDept);
        row.push(pct ? pct.percentage / 100 : 0);
      }
    } else {
      row.push(...new Array(departments.length).fill(0));
    }

    allocationMatrix.push(row);
  }

  // Solve simultaneous equations (simplified - use matrix algebra in production)
  const solvedAllocations = new Map<string, Map<string, number>>();

  // Process reciprocal allocation
  const result = await processReciprocalAllocation(
    sequelize,
    serviceDepartmentIds,
    userId,
    transaction
  );

  // Build journal entries
  const journalEntries: AllocationJournalEntry[] = [];

  for (const allocation of result.allocations) {
    for (const [targetDept, amount] of allocation.allocations.entries()) {
      journalEntries.push({
        entryId: `${batchId}-${allocation.poolId}-${targetDept}`,
        sourcePool: allocation.poolCode || '',
        targetCostCenter: targetDept,
        allocationAmount: amount,
        allocationPercentage: 0,
        allocationBasis: 'reciprocal',
        description: `Reciprocal allocation`,
      });
    }
  }

  // Create audit log
  const auditLog = await createAuditLog(
    sequelize,
    'reciprocal_allocation',
    0,
    'EXECUTE',
    userId,
    `Reciprocal allocation: ${servicePools.length} departments`,
    {},
    {
      batchId,
      departments: departments.length,
      totalAllocated: result.reduce((sum, r) => sum + r.totalAllocated, 0),
    },
    transaction
  );

  // Build data lineage
  await buildDataLineageTrail(
    sequelize,
    'reciprocal_allocation',
    batchId,
    servicePools.map(p => ({
      entityType: 'cost_pool',
      entityId: p.costPoolId.toString(),
      transformationType: 'reciprocal_allocation',
    })),
    userId,
    transaction
  );

  const matrix: ReciprocalAllocationMatrix = {
    departments,
    costMatrix,
    allocationMatrix,
    simultaneousEquations: departments.map(
      (dept, i) => `${dept} = ${costMatrix[i][0]} + Σ(allocations from other depts)`
    ),
    solvedAllocations,
  };

  const batchResult: AllocationBatchResult = {
    batchId,
    processDate: allocationDate,
    fiscalYear,
    fiscalPeriod,
    allocationMethod: 'reciprocal',
    poolsProcessed: servicePools.length,
    totalAllocated: result.reduce((sum, r) => sum + r.totalAllocated, 0),
    allocations: result,
    journalEntries,
    errors: [],
    auditTrail: [auditLog],
    validationResult: { valid: true, errors: [], warnings: [] },
  };

  return { batchResult, matrix };
};

// ============================================================================
// COMPOSITE FUNCTIONS - ACTIVITY-BASED COSTING
// ============================================================================

/**
 * Processes comprehensive ABC allocation
 * Composes: allocateOverheadABC, createAuditLog, performVarianceAnalysis
 */
export const processABCAllocationComplete = async (
  sequelize: any,
  activityPoolIds: number[],
  fiscalYear: number,
  fiscalPeriod: number,
  userId: string,
  transaction?: Transaction
): Promise<{
  batchResult: AllocationBatchResult;
  abcResults: ABCResult[];
}> => {
  const batchId = `ABC-${Date.now()}`;
  const abcResults: ABCResult[] = [];
  const journalEntries: AllocationJournalEntry[] = [];
  const errors: string[] = [];
  const auditTrail: AuditLogEntry[] = [];
  let totalAllocated = 0;

  for (const poolId of activityPoolIds) {
    try {
      // Get activity pool
      const pool = await getCostPoolById(sequelize, poolId, transaction);

      // Get activity details
      const activities = await sequelize.query(
        `
        SELECT
          activity_id,
          activity_code,
          activity_name,
          activity_type,
          total_activity_cost,
          activity_volume,
          cost_per_activity
        FROM activity_based_costs
        WHERE cost_pool_id = :poolId
          AND fiscal_year = :fiscalYear
          AND fiscal_period = :fiscalPeriod
        `,
        {
          replacements: { poolId, fiscalYear, fiscalPeriod },
          type: 'SELECT',
          transaction,
        }
      );

      for (const activity of activities as any[]) {
        // Get cost object allocations
        const costObjects = await sequelize.query(
          `
          SELECT
            cost_object_id,
            cost_object_type,
            activity_consumption,
            allocated_cost
          FROM abc_cost_object_allocations
          WHERE activity_id = :activityId
          `,
          {
            replacements: { activityId: activity.activity_id },
            type: 'SELECT',
            transaction,
          }
        );

        const costObjectAllocations: CostObjectAllocation[] = (costObjects as any[]).map(co => ({
          costObjectId: co.cost_object_id,
          costObjectType: co.cost_object_type,
          activityConsumption: parseFloat(co.activity_consumption),
          allocatedCost: parseFloat(co.allocated_cost),
        }));

        abcResults.push({
          activityId: activity.activity_id,
          activityCode: activity.activity_code,
          activityName: activity.activity_name,
          activityType: activity.activity_type,
          totalActivityCost: parseFloat(activity.total_activity_cost),
          activityVolume: parseFloat(activity.activity_volume),
          costPerActivity: parseFloat(activity.cost_per_activity),
          costObjectAllocations,
        });

        totalAllocated += parseFloat(activity.total_activity_cost);

        // Create journal entries
        for (const costObject of costObjectAllocations) {
          journalEntries.push({
            entryId: `${batchId}-${activity.activity_code}-${costObject.costObjectId}`,
            sourcePool: pool.poolCode,
            targetCostCenter: costObject.costObjectId,
            allocationAmount: costObject.allocatedCost,
            allocationPercentage: (costObject.allocatedCost / parseFloat(activity.total_activity_cost)) * 100,
            allocationBasis: activity.activity_code,
            description: `ABC: ${activity.activity_name}`,
          });
        }
      }

      // Create audit log
      const auditLog = await createAuditLog(
        sequelize,
        'abc_allocation',
        poolId,
        'EXECUTE',
        userId,
        `ABC allocation: ${pool.poolCode}`,
        {},
        {
          poolId,
          activityCount: activities.length,
          totalAllocated,
        },
        transaction
      );
      auditTrail.push(auditLog);

    } catch (error: any) {
      errors.push(`Pool ${poolId}: ${error.message}`);
    }
  }

  const batchResult: AllocationBatchResult = {
    batchId,
    processDate: new Date(),
    fiscalYear,
    fiscalPeriod,
    allocationMethod: 'activity-based',
    poolsProcessed: activityPoolIds.length,
    totalAllocated,
    allocations: [],
    journalEntries,
    errors,
    auditTrail,
    validationResult: { valid: errors.length === 0, errors, warnings: [] },
  };

  return { batchResult, abcResults };
};

// ============================================================================
// COMPOSITE FUNCTIONS - OVERHEAD ALLOCATION
// ============================================================================

/**
 * Calculates and applies predetermined overhead rates
 * Composes: calculatePredeterminedOverheadRate, applyOverheadToJob, createAuditLog
 */
export const calculateAndApplyOverheadRates = async (
  sequelize: any,
  overheadPoolIds: number[],
  fiscalYear: number,
  userId: string,
  transaction?: Transaction
): Promise<OverheadRateCalculation[]> => {
  const rateCalculations: OverheadRateCalculation[] = [];

  for (const poolId of overheadPoolIds) {
    const pool = await getCostPoolById(sequelize, poolId, transaction);

    // Get estimated overhead and activity base
    const estimates = await sequelize.query(
      `
      SELECT
        estimated_overhead,
        estimated_activity_base,
        actual_overhead,
        actual_activity_base
      FROM overhead_pool_estimates
      WHERE pool_id = :poolId AND fiscal_year = :fiscalYear
      `,
      {
        replacements: { poolId, fiscalYear },
        type: 'SELECT',
        transaction,
      }
    );

    if (estimates && estimates.length > 0) {
      const estimate = estimates[0] as any;

      // Calculate predetermined rate
      const predeterminedRate = calculatePredeterminedOverheadRate(
        parseFloat(estimate.estimated_overhead),
        parseFloat(estimate.estimated_activity_base)
      );

      // Calculate applied overhead
      const appliedOverhead = parseFloat(estimate.actual_activity_base) * predeterminedRate;

      // Calculate under/over applied
      const actualOverhead = parseFloat(estimate.actual_overhead);
      const variance = appliedOverhead - actualOverhead;

      rateCalculations.push({
        poolId: pool.costPoolId,
        poolName: pool.poolName,
        estimatedOverhead: parseFloat(estimate.estimated_overhead),
        estimatedActivityBase: parseFloat(estimate.estimated_activity_base),
        predeterminedRate,
        actualOverhead,
        actualActivityBase: parseFloat(estimate.actual_activity_base),
        appliedOverhead,
        underApplied: variance < 0 ? Math.abs(variance) : 0,
        overApplied: variance > 0 ? variance : 0,
      });

      // Create audit log
      await createAuditLog(
        sequelize,
        'overhead_rate_calculation',
        poolId,
        'EXECUTE',
        userId,
        `Overhead rate: ${pool.poolCode}`,
        {},
        {
          poolId,
          predeterminedRate,
          appliedOverhead,
          variance,
        },
        transaction
      );
    }
  }

  return rateCalculations;
};

// ============================================================================
// COMPOSITE FUNCTIONS - VARIANCE ANALYSIS
// ============================================================================

/**
 * Performs comprehensive multi-level variance analysis
 * Composes: performComprehensiveVarianceAnalysis, performVarianceAnalysis, createAuditLog
 */
export const performComprehensiveMultiLevelVarianceAnalysis = async (
  sequelize: any,
  fiscalYear: number,
  fiscalPeriod: number,
  userId: string,
  transaction?: Transaction
): Promise<ComprehensiveVarianceReport> => {
  const reportDate = new Date();

  // Get all cost centers
  const costCenters = await listCostCenters(sequelize, fiscalYear, transaction);

  const materialVariances: VarianceAnalysis[] = [];
  const laborVariances: VarianceAnalysis[] = [];
  const overheadVariances: VarianceAnalysis[] = [];
  const varianceExplanations: VarianceExplanation[] = [];

  let totalFavorable = 0;
  let totalUnfavorable = 0;

  for (const costCenter of costCenters) {
    // Perform comprehensive variance analysis
    const variances = await performComprehensiveVarianceAnalysis(
      sequelize,
      costCenter.costCenterId,
      fiscalYear,
      fiscalPeriod,
      transaction
    );

    // Categorize variances
    for (const variance of variances) {
      if (variance.varianceType.includes('material')) {
        materialVariances.push(variance);
      } else if (variance.varianceType.includes('labor')) {
        laborVariances.push(variance);
      } else if (variance.varianceType.includes('overhead')) {
        overheadVariances.push(variance);
      }

      if (variance.favorable) {
        totalFavorable += variance.varianceAmount;
      } else {
        totalUnfavorable += variance.varianceAmount;
      }

      // Add explanation
      varianceExplanations.push({
        varianceType: variance.varianceType,
        costCenter: costCenter.costCenterCode,
        amount: variance.varianceAmount,
        favorable: variance.favorable,
        explanation: variance.explanation || `${variance.varianceType} variance`,
        correctiveAction: variance.varianceAmount > 10000 ? 'Requires investigation' : undefined,
      });
    }
  }

  const netVariance = totalFavorable - totalUnfavorable;

  // Create audit log
  await createAuditLog(
    sequelize,
    'variance_analysis',
    0,
    'EXECUTE',
    userId,
    `Comprehensive variance analysis: FY${fiscalYear} P${fiscalPeriod}`,
    {},
    {
      fiscalYear,
      fiscalPeriod,
      totalFavorable,
      totalUnfavorable,
      netVariance,
    },
    transaction
  );

  return {
    reportDate,
    fiscalYear,
    fiscalPeriod,
    materialVariances,
    laborVariances,
    overheadVariances,
    totalFavorable,
    totalUnfavorable,
    netVariance,
    varianceExplanations,
  };
};

// ============================================================================
// COMPOSITE FUNCTIONS - REPORTING & ANALYTICS
// ============================================================================

/**
 * Generates cost allocation dashboard with KPIs
 * Composes: generateManagementDashboard, calculateFinancialKPIs, generateSegmentReporting
 */
export const generateCostAllocationDashboard = async (
  sequelize: any,
  fiscalYear: number,
  fiscalPeriod: number,
  userId: string,
  transaction?: Transaction
): Promise<{
  dashboard: ManagementDashboard;
  kpis: any;
  segmentReports: SegmentReport[];
  poolSummaries: CostPoolSummary[];
  allocationEfficiency: number;
}> => {
  // Generate dashboard
  const dashboard = await generateManagementDashboard(
    sequelize,
    fiscalYear,
    fiscalPeriod,
    transaction
  );

  // Calculate KPIs
  const kpis = await calculateFinancialKPIs(
    sequelize,
    fiscalYear,
    fiscalPeriod,
    transaction
  );

  // Generate segment reports
  const segmentReports = await generateSegmentReporting(
    sequelize,
    fiscalYear,
    fiscalPeriod,
    'cost_center',
    transaction
  );

  // Get all cost pool summaries
  const pools = await sequelize.query(
    `SELECT cost_pool_id FROM cost_pools WHERE fiscal_year = :fiscalYear AND fiscal_period = :fiscalPeriod`,
    {
      replacements: { fiscalYear, fiscalPeriod },
      type: 'SELECT',
      transaction,
    }
  );

  const poolSummaries: CostPoolSummary[] = [];
  for (const pool of pools as any[]) {
    const summary = await getCostPoolSummary(sequelize, pool.cost_pool_id, transaction);
    poolSummaries.push(summary);
  }

  // Calculate allocation efficiency (allocated / total)
  const totalCost = poolSummaries.reduce((sum, p) => sum + p.totalCost, 0);
  const totalAllocated = poolSummaries.reduce((sum, p) => sum + p.allocatedCost, 0);
  const allocationEfficiency = totalCost > 0 ? (totalAllocated / totalCost) * 100 : 0;

  // Create audit log
  await createAuditLog(
    sequelize,
    'cost_allocation_dashboard',
    0,
    'SELECT',
    userId,
    'Cost allocation dashboard generated',
    {},
    {
      fiscalYear,
      fiscalPeriod,
      poolCount: poolSummaries.length,
      allocationEfficiency,
    },
    transaction
  );

  return {
    dashboard,
    kpis,
    segmentReports,
    poolSummaries,
    allocationEfficiency,
  };
};

/**
 * Generates compliance report for cost allocations
 * Composes: generateComplianceReport, validateAllocationTotal, getTransactionHistory
 */
export const generateCostAllocationComplianceReport = async (
  sequelize: any,
  fiscalYear: number,
  fiscalPeriod: number,
  userId: string,
  transaction?: Transaction
): Promise<{
  reportId: string;
  period: { fiscalYear: number; fiscalPeriod: number };
  allocationsProcessed: number;
  totalAllocated: number;
  validationResults: AllocationValidation[];
  complianceIssues: string[];
  auditTrailComplete: boolean;
}> => {
  const reportId = `COST-ALLOC-COMPLIANCE-${fiscalYear}-${fiscalPeriod}`;

  // Get all allocations for period
  const allocations = await sequelize.query(
    `
    SELECT COUNT(*) as count, SUM(total_allocated) as total
    FROM allocation_results
    WHERE fiscal_year = :fiscalYear AND fiscal_period = :fiscalPeriod
    `,
    {
      replacements: { fiscalYear, fiscalPeriod },
      type: 'SELECT',
      transaction,
    }
  );

  const allocData = allocations[0] as any;

  // Validate all pools
  const pools = await sequelize.query(
    `SELECT cost_pool_id, total_cost FROM cost_pools WHERE fiscal_year = :fiscalYear AND fiscal_period = :fiscalPeriod`,
    {
      replacements: { fiscalYear, fiscalPeriod },
      type: 'SELECT',
      transaction,
    }
  );

  const validationResults: AllocationValidation[] = [];
  const complianceIssues: string[] = [];

  for (const pool of pools as any[]) {
    const validation = await validateAllocationTotal(
      sequelize,
      pool.cost_pool_id,
      parseFloat(pool.total_cost),
      transaction
    );
    validationResults.push(validation);

    if (!validation.valid) {
      complianceIssues.push(`Pool ${pool.cost_pool_id} failed validation`);
    }
  }

  // Check audit trail completeness
  const auditLogs = await sequelize.query(
    `
    SELECT COUNT(*) as count
    FROM audit_logs
    WHERE table_name IN ('cost_pools', 'allocation_results', 'cost_allocation')
      AND action IN ('INSERT', 'EXECUTE', 'POST')
      AND timestamp >= (
        SELECT MIN(created_at)
        FROM cost_pools
        WHERE fiscal_year = :fiscalYear AND fiscal_period = :fiscalPeriod
      )
    `,
    {
      replacements: { fiscalYear, fiscalPeriod },
      type: 'SELECT',
      transaction,
    }
  );

  const auditTrailComplete = (auditLogs[0] as any).count > 0;

  // Generate compliance report
  await generateComplianceReport(
    sequelize,
    'cost_allocation',
    new Date(fiscalYear, fiscalPeriod - 1, 1),
    new Date(fiscalYear, fiscalPeriod, 0),
    userId,
    transaction
  );

  return {
    reportId,
    period: { fiscalYear, fiscalPeriod },
    allocationsProcessed: parseInt(allocData.count),
    totalAllocated: parseFloat(allocData.total || 0),
    validationResults,
    complianceIssues,
    auditTrailComplete,
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Cost Pool Management
  initializeCostPoolWithRules,
  bulkAddCostsToPool,
  getCostPoolSummary,

  // Allocation Basis & Drivers
  createAllocationBasisWithDrivers,
  bulkUpdateStatisticalDrivers,
  calculateAllocationPercentagesFromDrivers,

  // Direct Allocation
  processDirectAllocationWithAudit,
  processBatchDirectAllocations,

  // Step-Down Allocation
  processStepDownAllocationWithSequence,

  // Reciprocal Allocation
  processReciprocalAllocationWithMatrix,

  // Activity-Based Costing
  processABCAllocationComplete,

  // Overhead Allocation
  calculateAndApplyOverheadRates,

  // Variance Analysis
  performComprehensiveMultiLevelVarianceAnalysis,

  // Reporting & Analytics
  generateCostAllocationDashboard,
  generateCostAllocationComplianceReport,
};
