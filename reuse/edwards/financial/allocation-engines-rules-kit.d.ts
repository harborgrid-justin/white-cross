/**
 * LOC: ALLOCENG001
 * File: /reuse/edwards/financial/allocation-engines-rules-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - crypto (encryption for sensitive allocation data)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Cost accounting services
 *   - Healthcare department allocation services
 *   - Management reporting modules
 */
/**
 * File: /reuse/edwards/financial/allocation-engines-rules-kit.ts
 * Locator: WC-EDWARDS-ALLOCENG-001
 * Purpose: Comprehensive Cost Allocation Engine - Multi-tier allocation rules, statistical drivers, reciprocal allocations, cascade logic, what-if analysis
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, Node crypto
 * Downstream: ../backend/financial/*, Cost Accounting, Healthcare Department Services, Management Reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 functions for allocation rules, allocation basis, statistical drivers, reciprocal allocations, cascade allocations, allocation pools, reporting, what-if analysis
 *
 * LLM Context: Enterprise-grade cost allocation engine for White Cross Healthcare Platform competing with Oracle JD Edwards EnterpriseOne.
 * Provides comprehensive multi-tier allocation capabilities including allocation rule configuration, statistical driver management,
 * reciprocal allocation processing, cascade allocation hierarchies, allocation pool management, allocation basis calculation,
 * what-if scenario analysis, variance reporting, and audit trails. Supports healthcare-specific allocations: department costs,
 * overhead allocation, physician compensation, facility costs, shared services, administrative overhead.
 */
import { Transaction } from 'sequelize';
interface AllocationRule {
    ruleId: number;
    ruleCode: string;
    ruleName: string;
    description: string;
    allocationMethod: 'direct' | 'step-down' | 'reciprocal' | 'activity-based' | 'proportional';
    allocationType: 'cost' | 'revenue' | 'expense' | 'overhead' | 'shared-service';
    sourceDepartment: string;
    targetDepartments: string[];
    allocationBasis: string;
    allocationDriver: string;
    effectiveDate: Date;
    expirationDate?: Date;
    priority: number;
    isActive: boolean;
    requiresApproval: boolean;
    approvedBy?: string;
    approvalDate?: Date;
}
interface AllocationBasis {
    basisId: number;
    basisCode: string;
    basisName: string;
    basisType: 'statistical' | 'financial' | 'physical' | 'time-based' | 'activity-based';
    description: string;
    calculationMethod: string;
    unitOfMeasure: string;
    dataSource: string;
    updateFrequency: 'real-time' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
    lastUpdated: Date;
}
interface StatisticalDriver {
    driverId: number;
    driverCode: string;
    driverName: string;
    driverType: 'patient-days' | 'square-footage' | 'headcount' | 'transactions' | 'revenue' | 'custom';
    department: string;
    fiscalYear: number;
    fiscalPeriod: number;
    driverValue: number;
    unitOfMeasure: string;
    dataSource: string;
    capturedDate: Date;
    validatedBy?: string;
    isEstimated: boolean;
}
interface AllocationPool {
    poolId: number;
    poolCode: string;
    poolName: string;
    poolType: 'cost-pool' | 'revenue-pool' | 'overhead-pool' | 'service-pool';
    description: string;
    sourceAccounts: string[];
    totalAmount: number;
    allocatedAmount: number;
    unallocatedAmount: number;
    fiscalYear: number;
    fiscalPeriod: number;
    status: 'open' | 'allocated' | 'closed' | 'reversed';
    createdDate: Date;
    closedDate?: Date;
}
interface CascadeAllocation {
    cascadeId: number;
    cascadeName: string;
    description: string;
    startingPool: number;
    allocationLevels: CascadeLevel[];
    totalLevels: number;
    finalDestinations: string[];
    fiscalYear: number;
    fiscalPeriod: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    executedDate?: Date;
}
interface CascadeLevel {
    level: number;
    levelName: string;
    sourcePool: number;
    allocationRuleIds: number[];
    targetPools: number[];
    allocationPercentage: number;
}
interface ReciprocalAllocation {
    reciprocalId: number;
    reciprocalName: string;
    description: string;
    departments: string[];
    allocationMatrix: number[][];
    convergenceThreshold: number;
    maxIterations: number;
    actualIterations?: number;
    converged: boolean;
    finalAllocations: Map<string, number>;
    fiscalYear: number;
    fiscalPeriod: number;
    executedDate: Date;
}
interface AllocationResult {
    resultId: number;
    allocationRunId: number;
    ruleId: number;
    sourceDepartment: string;
    targetDepartment: string;
    allocationAmount: number;
    allocationPercentage: number;
    allocationDriver: string;
    driverValue: number;
    totalDriverValue: number;
    fiscalYear: number;
    fiscalPeriod: number;
    accountCode: string;
    processedDate: Date;
    reversedDate?: Date;
}
interface AllocationRun {
    runId: number;
    runName: string;
    runType: 'regular' | 'adjustment' | 'reversal' | 'what-if';
    fiscalYear: number;
    fiscalPeriod: number;
    allocationDate: Date;
    rulesExecuted: number[];
    totalAllocated: number;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'reversed';
    startTime: Date;
    endTime?: Date;
    executedBy: string;
    errorLog?: string;
}
interface AllocationVariance {
    varianceId: number;
    department: string;
    accountCode: string;
    fiscalYear: number;
    fiscalPeriod: number;
    budgetedAllocation: number;
    actualAllocation: number;
    variance: number;
    variancePercentage: number;
    varianceReason?: string;
    isFavorable: boolean;
}
interface WhatIfScenario {
    scenarioId: number;
    scenarioName: string;
    description: string;
    baselineRunId: number;
    modifications: ScenarioModification[];
    projectedResults: AllocationResult[];
    totalImpact: number;
    impactByDepartment: Map<string, number>;
    createdBy: string;
    createdDate: Date;
    isApplied: boolean;
}
interface ScenarioModification {
    modificationType: 'change-driver' | 'change-rule' | 'change-percentage' | 'add-department' | 'remove-department';
    targetEntity: string;
    originalValue: any;
    modifiedValue: any;
    description: string;
}
interface AllocationAuditLog {
    auditId: number;
    allocationRunId: number;
    timestamp: Date;
    action: string;
    performedBy: string;
    department: string;
    beforeValue?: number;
    afterValue?: number;
    changeReason: string;
    ipAddress: string;
}
/**
 * Creates new allocation rule with validation
 * @param ruleData - Allocation rule configuration
 * @returns Created allocation rule
 */
export declare function createAllocationRule(ruleData: Partial<AllocationRule>, transaction?: Transaction): Promise<AllocationRule>;
/**
 * Validates allocation rule configuration
 * @param ruleData - Rule data to validate
 * @returns Validation result
 */
export declare function validateAllocationRule(ruleData: Partial<AllocationRule>): Promise<{
    isValid: boolean;
    errors: string[];
}>;
/**
 * Updates existing allocation rule
 * @param ruleId - Rule identifier
 * @param updates - Updates to apply
 * @returns Updated rule
 */
export declare function updateAllocationRule(ruleId: number, updates: Partial<AllocationRule>, updatedBy: string, transaction?: Transaction): Promise<AllocationRule>;
/**
 * Deactivates allocation rule
 * @param ruleId - Rule identifier
 * @param deactivatedBy - User deactivating rule
 * @returns Deactivated rule
 */
export declare function deactivateAllocationRule(ruleId: number, deactivatedBy: string, transaction?: Transaction): Promise<AllocationRule>;
/**
 * Approves allocation rule for use
 * @param ruleId - Rule identifier
 * @param approvedBy - Approver identifier
 * @returns Approved rule
 */
export declare function approveAllocationRule(ruleId: number, approvedBy: string, transaction?: Transaction): Promise<AllocationRule>;
/**
 * Creates allocation basis configuration
 * @param basisData - Basis configuration
 * @returns Created allocation basis
 */
export declare function createAllocationBasis(basisData: Partial<AllocationBasis>, transaction?: Transaction): Promise<AllocationBasis>;
/**
 * Calculates allocation percentages based on basis
 * @param basisCode - Allocation basis code
 * @param departments - Departments to allocate across
 * @param fiscalYear - Fiscal year
 * @param fiscalPeriod - Fiscal period
 * @returns Allocation percentages by department
 */
export declare function calculateAllocationPercentages(basisCode: string, departments: string[], fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<Map<string, number>>;
/**
 * Updates allocation basis with current data
 * @param basisCode - Basis code
 * @param newData - Updated data
 * @returns Updated basis
 */
export declare function updateAllocationBasis(basisCode: string, newData: Partial<AllocationBasis>, transaction?: Transaction): Promise<AllocationBasis>;
/**
 * Records statistical driver value
 * @param driverData - Driver data
 * @returns Created driver record
 */
export declare function recordStatisticalDriver(driverData: Partial<StatisticalDriver>, transaction?: Transaction): Promise<StatisticalDriver>;
/**
 * Calculates total driver value across departments
 * @param driverCode - Driver code
 * @param departments - Departments to include
 * @param fiscalYear - Fiscal year
 * @param fiscalPeriod - Fiscal period
 * @returns Total driver value
 */
export declare function calculateTotalDriverValue(driverCode: string, departments: string[], fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<number>;
/**
 * Validates statistical driver data
 * @param driverId - Driver identifier
 * @param validatedBy - Validator identifier
 * @returns Validated driver
 */
export declare function validateStatisticalDriver(driverId: number, validatedBy: string, transaction?: Transaction): Promise<StatisticalDriver>;
/**
 * Estimates missing driver values
 * @param driverCode - Driver code
 * @param department - Department
 * @param fiscalYear - Fiscal year
 * @param fiscalPeriod - Fiscal period
 * @returns Estimated driver value
 */
export declare function estimateDriverValue(driverCode: string, department: string, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<number>;
/**
 * Creates allocation pool
 * @param poolData - Pool configuration
 * @returns Created pool
 */
export declare function createAllocationPool(poolData: Partial<AllocationPool>, transaction?: Transaction): Promise<AllocationPool>;
/**
 * Loads amounts into allocation pool from source accounts
 * @param poolId - Pool identifier
 * @returns Updated pool with loaded amounts
 */
export declare function loadAllocationPool(poolId: number, transaction?: Transaction): Promise<AllocationPool>;
/**
 * Allocates amount from pool
 * @param poolId - Pool identifier
 * @param amount - Amount to allocate
 * @returns Updated pool
 */
export declare function allocateFromPool(poolId: number, amount: number, transaction?: Transaction): Promise<AllocationPool>;
/**
 * Closes allocation pool
 * @param poolId - Pool identifier
 * @returns Closed pool
 */
export declare function closeAllocationPool(poolId: number, transaction?: Transaction): Promise<AllocationPool>;
/**
 * Creates cascade allocation hierarchy
 * @param cascadeData - Cascade configuration
 * @returns Created cascade
 */
export declare function createCascadeAllocation(cascadeData: Partial<CascadeAllocation>, transaction?: Transaction): Promise<CascadeAllocation>;
/**
 * Executes cascade allocation
 * @param cascadeId - Cascade identifier
 * @returns Execution results
 */
export declare function executeCascadeAllocation(cascadeId: number, transaction?: Transaction): Promise<AllocationResult[]>;
/**
 * Executes single cascade level
 * @param level - Cascade level configuration
 * @param fiscalYear - Fiscal year
 * @param fiscalPeriod - Fiscal period
 * @returns Allocation results for level
 */
export declare function executeCascadeLevel(level: CascadeLevel, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<AllocationResult[]>;
/**
 * Creates reciprocal allocation configuration
 * @param reciprocalData - Reciprocal allocation data
 * @returns Created reciprocal allocation
 */
export declare function createReciprocalAllocation(reciprocalData: Partial<ReciprocalAllocation>, transaction?: Transaction): Promise<ReciprocalAllocation>;
/**
 * Executes reciprocal allocation using iterative method
 * @param reciprocalId - Reciprocal allocation identifier
 * @returns Final allocation amounts
 */
export declare function executeReciprocalAllocation(reciprocalId: number, transaction?: Transaction): Promise<Map<string, number>>;
/**
 * Validates reciprocal allocation matrix
 * @param matrix - Allocation matrix
 * @param departments - Department list
 * @returns Validation result
 */
export declare function validateReciprocalMatrix(matrix: number[][], departments: string[]): Promise<{
    isValid: boolean;
    errors: string[];
}>;
/**
 * Executes allocation rule
 * @param rule - Allocation rule
 * @param fiscalYear - Fiscal year
 * @param fiscalPeriod - Fiscal period
 * @returns Allocation results
 */
export declare function executeAllocationRule(rule: AllocationRule, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<AllocationResult[]>;
/**
 * Executes allocation run
 * @param runData - Allocation run configuration
 * @returns Allocation run with results
 */
export declare function executeAllocationRun(runData: Partial<AllocationRun>, transaction?: Transaction): Promise<AllocationRun>;
/**
 * Reverses allocation run
 * @param runId - Allocation run identifier
 * @param reversedBy - User reversing allocation
 * @returns Reversal results
 */
export declare function reverseAllocationRun(runId: number, reversedBy: string, transaction?: Transaction): Promise<AllocationRun>;
/**
 * Calculates allocation variances
 * @param fiscalYear - Fiscal year
 * @param fiscalPeriod - Fiscal period
 * @returns Variance analysis
 */
export declare function calculateAllocationVariances(fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<AllocationVariance[]>;
/**
 * Generates allocation summary report
 * @param fiscalYear - Fiscal year
 * @param fiscalPeriod - Fiscal period
 * @returns Summary report data
 */
export declare function generateAllocationSummaryReport(fiscalYear: number, fiscalPeriod: number, transaction?: Transaction): Promise<{
    totalAllocated: number;
    allocationsByDepartment: Map<string, number>;
    allocationsByRule: Map<number, number>;
    topAllocations: AllocationResult[];
}>;
/**
 * Creates what-if scenario
 * @param scenarioData - Scenario configuration
 * @returns Created scenario
 */
export declare function createWhatIfScenario(scenarioData: Partial<WhatIfScenario>, transaction?: Transaction): Promise<WhatIfScenario>;
/**
 * Executes what-if scenario analysis
 * @param scenarioId - Scenario identifier
 * @returns Projected results
 */
export declare function executeWhatIfScenario(scenarioId: number, transaction?: Transaction): Promise<AllocationResult[]>;
/**
 * Compares what-if scenario to baseline
 * @param scenarioId - Scenario identifier
 * @returns Comparison analysis
 */
export declare function compareScenarioToBaseline(scenarioId: number, transaction?: Transaction): Promise<{
    baselineTotal: number;
    scenarioTotal: number;
    totalDifference: number;
    differencePercentage: number;
    departmentComparisons: Map<string, {
        baseline: number;
        scenario: number;
        difference: number;
    }>;
}>;
/**
 * Creates audit log entry for allocation operation
 * @param action - Action performed
 * @param entity - Entity affected
 * @param performedBy - User performing action
 * @returns Audit log entry
 */
export declare function createAllocationAuditEntry(action: string, entity: string, performedBy: string, transaction?: Transaction): Promise<AllocationAuditLog>;
/**
 * Encrypts sensitive allocation data
 * @param allocationData - Data to encrypt
 * @param encryptionKey - Encryption key
 * @returns Encrypted data
 */
export declare function encryptAllocationData(allocationData: string, encryptionKey: string): Promise<string>;
export {};
//# sourceMappingURL=allocation-engines-rules-kit.d.ts.map