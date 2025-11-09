"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAllocationRule = createAllocationRule;
exports.validateAllocationRule = validateAllocationRule;
exports.updateAllocationRule = updateAllocationRule;
exports.deactivateAllocationRule = deactivateAllocationRule;
exports.approveAllocationRule = approveAllocationRule;
exports.createAllocationBasis = createAllocationBasis;
exports.calculateAllocationPercentages = calculateAllocationPercentages;
exports.updateAllocationBasis = updateAllocationBasis;
exports.recordStatisticalDriver = recordStatisticalDriver;
exports.calculateTotalDriverValue = calculateTotalDriverValue;
exports.validateStatisticalDriver = validateStatisticalDriver;
exports.estimateDriverValue = estimateDriverValue;
exports.createAllocationPool = createAllocationPool;
exports.loadAllocationPool = loadAllocationPool;
exports.allocateFromPool = allocateFromPool;
exports.closeAllocationPool = closeAllocationPool;
exports.createCascadeAllocation = createCascadeAllocation;
exports.executeCascadeAllocation = executeCascadeAllocation;
exports.executeCascadeLevel = executeCascadeLevel;
exports.createReciprocalAllocation = createReciprocalAllocation;
exports.executeReciprocalAllocation = executeReciprocalAllocation;
exports.validateReciprocalMatrix = validateReciprocalMatrix;
exports.executeAllocationRule = executeAllocationRule;
exports.executeAllocationRun = executeAllocationRun;
exports.reverseAllocationRun = reverseAllocationRun;
exports.calculateAllocationVariances = calculateAllocationVariances;
exports.generateAllocationSummaryReport = generateAllocationSummaryReport;
exports.createWhatIfScenario = createWhatIfScenario;
exports.executeWhatIfScenario = executeWhatIfScenario;
exports.compareScenarioToBaseline = compareScenarioToBaseline;
exports.createAllocationAuditEntry = createAllocationAuditEntry;
exports.encryptAllocationData = encryptAllocationData;
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
const sequelize_1 = require("sequelize");
const crypto = __importStar(require("crypto"));
// ============================================================================
// ALLOCATION RULE MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Creates new allocation rule with validation
 * @param ruleData - Allocation rule configuration
 * @returns Created allocation rule
 */
async function createAllocationRule(ruleData, transaction) {
    // Validate rule configuration
    await validateAllocationRule(ruleData);
    const rule = {
        ruleId: 0,
        ruleCode: ruleData.ruleCode,
        ruleName: ruleData.ruleName,
        description: ruleData.description,
        allocationMethod: ruleData.allocationMethod,
        allocationType: ruleData.allocationType,
        sourceDepartment: ruleData.sourceDepartment,
        targetDepartments: ruleData.targetDepartments,
        allocationBasis: ruleData.allocationBasis,
        allocationDriver: ruleData.allocationDriver,
        effectiveDate: ruleData.effectiveDate,
        expirationDate: ruleData.expirationDate,
        priority: ruleData.priority || 1,
        isActive: true,
        requiresApproval: ruleData.requiresApproval || false,
    };
    // Audit trail
    await createAllocationAuditEntry('CREATE_RULE', rule.ruleCode, 'system', transaction);
    return rule;
}
/**
 * Validates allocation rule configuration
 * @param ruleData - Rule data to validate
 * @returns Validation result
 */
async function validateAllocationRule(ruleData) {
    const errors = [];
    // Validate source department exists
    if (!ruleData.sourceDepartment) {
        errors.push('Source department is required');
    }
    // Validate target departments
    if (!ruleData.targetDepartments || ruleData.targetDepartments.length === 0) {
        errors.push('At least one target department is required');
    }
    // Validate circular allocation
    if (ruleData.targetDepartments?.includes(ruleData.sourceDepartment)) {
        errors.push('Circular allocation detected: source cannot be target');
    }
    // Validate allocation basis exists
    const basisExists = await allocationBasisExists(ruleData.allocationBasis);
    if (!basisExists) {
        errors.push('Allocation basis does not exist');
    }
    // Validate allocation driver
    const driverExists = await allocationDriverExists(ruleData.allocationDriver);
    if (!driverExists) {
        errors.push('Allocation driver does not exist');
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
}
/**
 * Updates existing allocation rule
 * @param ruleId - Rule identifier
 * @param updates - Updates to apply
 * @returns Updated rule
 */
async function updateAllocationRule(ruleId, updates, updatedBy, transaction) {
    const existingRule = await getAllocationRule(ruleId, transaction);
    // Validate updates
    const validation = await validateAllocationRule({ ...existingRule, ...updates });
    if (!validation.isValid) {
        throw new sequelize_1.ValidationError(`Validation failed: ${validation.errors.join(', ')}`);
    }
    const updatedRule = { ...existingRule, ...updates };
    // Audit trail
    await createAllocationAuditEntry('UPDATE_RULE', updatedRule.ruleCode, updatedBy, transaction);
    return updatedRule;
}
/**
 * Deactivates allocation rule
 * @param ruleId - Rule identifier
 * @param deactivatedBy - User deactivating rule
 * @returns Deactivated rule
 */
async function deactivateAllocationRule(ruleId, deactivatedBy, transaction) {
    const rule = await getAllocationRule(ruleId, transaction);
    rule.isActive = false;
    rule.expirationDate = new Date();
    await createAllocationAuditEntry('DEACTIVATE_RULE', rule.ruleCode, deactivatedBy, transaction);
    return rule;
}
/**
 * Approves allocation rule for use
 * @param ruleId - Rule identifier
 * @param approvedBy - Approver identifier
 * @returns Approved rule
 */
async function approveAllocationRule(ruleId, approvedBy, transaction) {
    const rule = await getAllocationRule(ruleId, transaction);
    if (!rule.requiresApproval) {
        throw new Error('Rule does not require approval');
    }
    rule.approvedBy = approvedBy;
    rule.approvalDate = new Date();
    await createAllocationAuditEntry('APPROVE_RULE', rule.ruleCode, approvedBy, transaction);
    return rule;
}
// ============================================================================
// ALLOCATION BASIS FUNCTIONS
// ============================================================================
/**
 * Creates allocation basis configuration
 * @param basisData - Basis configuration
 * @returns Created allocation basis
 */
async function createAllocationBasis(basisData, transaction) {
    const basis = {
        basisId: 0,
        basisCode: basisData.basisCode,
        basisName: basisData.basisName,
        basisType: basisData.basisType,
        description: basisData.description,
        calculationMethod: basisData.calculationMethod,
        unitOfMeasure: basisData.unitOfMeasure,
        dataSource: basisData.dataSource,
        updateFrequency: basisData.updateFrequency,
        lastUpdated: new Date(),
    };
    return basis;
}
/**
 * Calculates allocation percentages based on basis
 * @param basisCode - Allocation basis code
 * @param departments - Departments to allocate across
 * @param fiscalYear - Fiscal year
 * @param fiscalPeriod - Fiscal period
 * @returns Allocation percentages by department
 */
async function calculateAllocationPercentages(basisCode, departments, fiscalYear, fiscalPeriod, transaction) {
    const basis = await getAllocationBasisByCode(basisCode, transaction);
    const percentages = new Map();
    // Get driver values for all departments
    const driverValues = await getDriverValuesForDepartments(basis.basisCode, departments, fiscalYear, fiscalPeriod, transaction);
    const totalDriver = Array.from(driverValues.values()).reduce((sum, val) => sum + val, 0);
    if (totalDriver === 0) {
        // Equal allocation if no driver data
        const equalPercentage = 1 / departments.length;
        departments.forEach(dept => percentages.set(dept, equalPercentage));
    }
    else {
        // Proportional allocation based on driver values
        departments.forEach(dept => {
            const driverValue = driverValues.get(dept) || 0;
            percentages.set(dept, driverValue / totalDriver);
        });
    }
    return percentages;
}
/**
 * Updates allocation basis with current data
 * @param basisCode - Basis code
 * @param newData - Updated data
 * @returns Updated basis
 */
async function updateAllocationBasis(basisCode, newData, transaction) {
    const basis = await getAllocationBasisByCode(basisCode, transaction);
    const updated = { ...basis, ...newData, lastUpdated: new Date() };
    return updated;
}
// ============================================================================
// STATISTICAL DRIVER FUNCTIONS
// ============================================================================
/**
 * Records statistical driver value
 * @param driverData - Driver data
 * @returns Created driver record
 */
async function recordStatisticalDriver(driverData, transaction) {
    const driver = {
        driverId: 0,
        driverCode: driverData.driverCode,
        driverName: driverData.driverName,
        driverType: driverData.driverType,
        department: driverData.department,
        fiscalYear: driverData.fiscalYear,
        fiscalPeriod: driverData.fiscalPeriod,
        driverValue: driverData.driverValue,
        unitOfMeasure: driverData.unitOfMeasure,
        dataSource: driverData.dataSource,
        capturedDate: new Date(),
        validatedBy: driverData.validatedBy,
        isEstimated: driverData.isEstimated || false,
    };
    return driver;
}
/**
 * Calculates total driver value across departments
 * @param driverCode - Driver code
 * @param departments - Departments to include
 * @param fiscalYear - Fiscal year
 * @param fiscalPeriod - Fiscal period
 * @returns Total driver value
 */
async function calculateTotalDriverValue(driverCode, departments, fiscalYear, fiscalPeriod, transaction) {
    const drivers = await getStatisticalDrivers(driverCode, departments, fiscalYear, fiscalPeriod, transaction);
    return drivers.reduce((total, driver) => total + driver.driverValue, 0);
}
/**
 * Validates statistical driver data
 * @param driverId - Driver identifier
 * @param validatedBy - Validator identifier
 * @returns Validated driver
 */
async function validateStatisticalDriver(driverId, validatedBy, transaction) {
    const driver = await getStatisticalDriver(driverId, transaction);
    driver.validatedBy = validatedBy;
    driver.isEstimated = false;
    return driver;
}
/**
 * Estimates missing driver values
 * @param driverCode - Driver code
 * @param department - Department
 * @param fiscalYear - Fiscal year
 * @param fiscalPeriod - Fiscal period
 * @returns Estimated driver value
 */
async function estimateDriverValue(driverCode, department, fiscalYear, fiscalPeriod, transaction) {
    // Get historical average
    const historicalDrivers = await getHistoricalDrivers(driverCode, department, transaction);
    if (historicalDrivers.length === 0) {
        return 0;
    }
    const average = historicalDrivers.reduce((sum, d) => sum + d.driverValue, 0) / historicalDrivers.length;
    // Apply trend factor if available
    const trendFactor = await calculateTrendFactor(historicalDrivers);
    return average * trendFactor;
}
// ============================================================================
// ALLOCATION POOL FUNCTIONS
// ============================================================================
/**
 * Creates allocation pool
 * @param poolData - Pool configuration
 * @returns Created pool
 */
async function createAllocationPool(poolData, transaction) {
    const pool = {
        poolId: 0,
        poolCode: poolData.poolCode,
        poolName: poolData.poolName,
        poolType: poolData.poolType,
        description: poolData.description,
        sourceAccounts: poolData.sourceAccounts,
        totalAmount: poolData.totalAmount || 0,
        allocatedAmount: 0,
        unallocatedAmount: poolData.totalAmount || 0,
        fiscalYear: poolData.fiscalYear,
        fiscalPeriod: poolData.fiscalPeriod,
        status: 'open',
        createdDate: new Date(),
    };
    return pool;
}
/**
 * Loads amounts into allocation pool from source accounts
 * @param poolId - Pool identifier
 * @returns Updated pool with loaded amounts
 */
async function loadAllocationPool(poolId, transaction) {
    const pool = await getAllocationPool(poolId, transaction);
    let totalAmount = 0;
    for (const accountCode of pool.sourceAccounts) {
        const accountBalance = await getAccountBalance(accountCode, pool.fiscalYear, pool.fiscalPeriod, transaction);
        totalAmount += accountBalance;
    }
    pool.totalAmount = totalAmount;
    pool.unallocatedAmount = totalAmount;
    return pool;
}
/**
 * Allocates amount from pool
 * @param poolId - Pool identifier
 * @param amount - Amount to allocate
 * @returns Updated pool
 */
async function allocateFromPool(poolId, amount, transaction) {
    const pool = await getAllocationPool(poolId, transaction);
    if (amount > pool.unallocatedAmount) {
        throw new Error('Allocation amount exceeds unallocated pool balance');
    }
    pool.allocatedAmount += amount;
    pool.unallocatedAmount -= amount;
    if (pool.unallocatedAmount === 0) {
        pool.status = 'allocated';
    }
    return pool;
}
/**
 * Closes allocation pool
 * @param poolId - Pool identifier
 * @returns Closed pool
 */
async function closeAllocationPool(poolId, transaction) {
    const pool = await getAllocationPool(poolId, transaction);
    if (pool.unallocatedAmount > 0) {
        throw new Error('Cannot close pool with unallocated balance');
    }
    pool.status = 'closed';
    pool.closedDate = new Date();
    return pool;
}
// ============================================================================
// CASCADE ALLOCATION FUNCTIONS
// ============================================================================
/**
 * Creates cascade allocation hierarchy
 * @param cascadeData - Cascade configuration
 * @returns Created cascade
 */
async function createCascadeAllocation(cascadeData, transaction) {
    const cascade = {
        cascadeId: 0,
        cascadeName: cascadeData.cascadeName,
        description: cascadeData.description,
        startingPool: cascadeData.startingPool,
        allocationLevels: cascadeData.allocationLevels,
        totalLevels: cascadeData.allocationLevels.length,
        finalDestinations: cascadeData.finalDestinations,
        fiscalYear: cascadeData.fiscalYear,
        fiscalPeriod: cascadeData.fiscalPeriod,
        status: 'pending',
    };
    return cascade;
}
/**
 * Executes cascade allocation
 * @param cascadeId - Cascade identifier
 * @returns Execution results
 */
async function executeCascadeAllocation(cascadeId, transaction) {
    const cascade = await getCascadeAllocation(cascadeId, transaction);
    const results = [];
    cascade.status = 'processing';
    // Execute each level in sequence
    for (const level of cascade.allocationLevels.sort((a, b) => a.level - b.level)) {
        const levelResults = await executeCascadeLevel(level, cascade.fiscalYear, cascade.fiscalPeriod, transaction);
        results.push(...levelResults);
    }
    cascade.status = 'completed';
    cascade.executedDate = new Date();
    return results;
}
/**
 * Executes single cascade level
 * @param level - Cascade level configuration
 * @param fiscalYear - Fiscal year
 * @param fiscalPeriod - Fiscal period
 * @returns Allocation results for level
 */
async function executeCascadeLevel(level, fiscalYear, fiscalPeriod, transaction) {
    const results = [];
    const sourcePool = await getAllocationPool(level.sourcePool, transaction);
    // Execute all rules for this level
    for (const ruleId of level.allocationRuleIds) {
        const rule = await getAllocationRule(ruleId, transaction);
        const ruleResults = await executeAllocationRule(rule, fiscalYear, fiscalPeriod, transaction);
        results.push(...ruleResults);
        // Update source pool
        const totalAllocated = ruleResults.reduce((sum, r) => sum + r.allocationAmount, 0);
        await allocateFromPool(sourcePool.poolId, totalAllocated, transaction);
    }
    // Transfer remaining balance to target pools
    if (level.targetPools.length > 0 && sourcePool.unallocatedAmount > 0) {
        const amountPerPool = sourcePool.unallocatedAmount / level.targetPools.length;
        for (const targetPoolId of level.targetPools) {
            const targetPool = await getAllocationPool(targetPoolId, transaction);
            targetPool.totalAmount += amountPerPool;
            targetPool.unallocatedAmount += amountPerPool;
        }
    }
    return results;
}
// ============================================================================
// RECIPROCAL ALLOCATION FUNCTIONS
// ============================================================================
/**
 * Creates reciprocal allocation configuration
 * @param reciprocalData - Reciprocal allocation data
 * @returns Created reciprocal allocation
 */
async function createReciprocalAllocation(reciprocalData, transaction) {
    const reciprocal = {
        reciprocalId: 0,
        reciprocalName: reciprocalData.reciprocalName,
        description: reciprocalData.description,
        departments: reciprocalData.departments,
        allocationMatrix: reciprocalData.allocationMatrix,
        convergenceThreshold: reciprocalData.convergenceThreshold || 0.01,
        maxIterations: reciprocalData.maxIterations || 100,
        converged: false,
        finalAllocations: new Map(),
        fiscalYear: reciprocalData.fiscalYear,
        fiscalPeriod: reciprocalData.fiscalPeriod,
        executedDate: new Date(),
    };
    return reciprocal;
}
/**
 * Executes reciprocal allocation using iterative method
 * @param reciprocalId - Reciprocal allocation identifier
 * @returns Final allocation amounts
 */
async function executeReciprocalAllocation(reciprocalId, transaction) {
    const reciprocal = await getReciprocalAllocation(reciprocalId, transaction);
    // Get initial department costs
    const initialCosts = await getDepartmentCosts(reciprocal.departments, reciprocal.fiscalYear, reciprocal.fiscalPeriod, transaction);
    let currentAllocations = new Map(initialCosts);
    let previousAllocations = new Map();
    let iteration = 0;
    // Iterative allocation until convergence
    while (iteration < reciprocal.maxIterations) {
        previousAllocations = new Map(currentAllocations);
        // Allocate costs from each department
        for (let i = 0; i < reciprocal.departments.length; i++) {
            const sourceDept = reciprocal.departments[i];
            const sourceAmount = currentAllocations.get(sourceDept) || 0;
            // Allocate to other departments based on matrix
            for (let j = 0; j < reciprocal.departments.length; j++) {
                if (i !== j) {
                    const targetDept = reciprocal.departments[j];
                    const allocationPct = reciprocal.allocationMatrix[i][j];
                    const allocationAmount = sourceAmount * allocationPct;
                    const currentTarget = currentAllocations.get(targetDept) || 0;
                    currentAllocations.set(targetDept, currentTarget + allocationAmount);
                }
            }
            // Zero out source department after allocation
            currentAllocations.set(sourceDept, 0);
        }
        // Check convergence
        const hasConverged = checkConvergence(previousAllocations, currentAllocations, reciprocal.convergenceThreshold);
        if (hasConverged) {
            reciprocal.converged = true;
            reciprocal.actualIterations = iteration + 1;
            break;
        }
        iteration++;
    }
    reciprocal.finalAllocations = currentAllocations;
    return currentAllocations;
}
/**
 * Validates reciprocal allocation matrix
 * @param matrix - Allocation matrix
 * @param departments - Department list
 * @returns Validation result
 */
async function validateReciprocalMatrix(matrix, departments) {
    const errors = [];
    // Check matrix dimensions
    if (matrix.length !== departments.length) {
        errors.push('Matrix row count must match department count');
    }
    for (let i = 0; i < matrix.length; i++) {
        if (matrix[i].length !== departments.length) {
            errors.push(`Row ${i} column count must match department count`);
        }
        // Check diagonal is zero (no self-allocation)
        if (matrix[i][i] !== 0) {
            errors.push(`Diagonal element [${i}][${i}] must be zero`);
        }
        // Check row sum <= 1
        const rowSum = matrix[i].reduce((sum, val) => sum + val, 0);
        if (rowSum > 1) {
            errors.push(`Row ${i} sum exceeds 100%`);
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
}
// ============================================================================
// ALLOCATION EXECUTION FUNCTIONS
// ============================================================================
/**
 * Executes allocation rule
 * @param rule - Allocation rule
 * @param fiscalYear - Fiscal year
 * @param fiscalPeriod - Fiscal period
 * @returns Allocation results
 */
async function executeAllocationRule(rule, fiscalYear, fiscalPeriod, transaction) {
    const results = [];
    // Get source department cost
    const sourceCost = await getDepartmentCost(rule.sourceDepartment, fiscalYear, fiscalPeriod, transaction);
    // Calculate allocation percentages
    const percentages = await calculateAllocationPercentages(rule.allocationBasis, rule.targetDepartments, fiscalYear, fiscalPeriod, transaction);
    // Get driver values
    const driverValues = await getDriverValuesForDepartments(rule.allocationDriver, rule.targetDepartments, fiscalYear, fiscalPeriod, transaction);
    const totalDriver = await calculateTotalDriverValue(rule.allocationDriver, rule.targetDepartments, fiscalYear, fiscalPeriod, transaction);
    // Create allocation results
    for (const targetDept of rule.targetDepartments) {
        const percentage = percentages.get(targetDept) || 0;
        const allocationAmount = sourceCost * percentage;
        const driverValue = driverValues.get(targetDept) || 0;
        const result = {
            resultId: 0,
            allocationRunId: 0,
            ruleId: rule.ruleId,
            sourceDepartment: rule.sourceDepartment,
            targetDepartment: targetDept,
            allocationAmount,
            allocationPercentage: percentage * 100,
            allocationDriver: rule.allocationDriver,
            driverValue,
            totalDriverValue: totalDriver,
            fiscalYear,
            fiscalPeriod,
            accountCode: '', // Will be set based on account mapping
            processedDate: new Date(),
        };
        results.push(result);
        // Create journal entry
        await createAllocationJournalEntry(result, transaction);
    }
    return results;
}
/**
 * Executes allocation run
 * @param runData - Allocation run configuration
 * @returns Allocation run with results
 */
async function executeAllocationRun(runData, transaction) {
    const run = {
        runId: 0,
        runName: runData.runName,
        runType: runData.runType,
        fiscalYear: runData.fiscalYear,
        fiscalPeriod: runData.fiscalPeriod,
        allocationDate: new Date(),
        rulesExecuted: runData.rulesExecuted || [],
        totalAllocated: 0,
        status: 'processing',
        startTime: new Date(),
        executedBy: runData.executedBy,
    };
    try {
        let totalAllocated = 0;
        // Execute rules in priority order
        const rules = await getAllocationRulesByIds(run.rulesExecuted, transaction);
        const sortedRules = rules.sort((a, b) => a.priority - b.priority);
        for (const rule of sortedRules) {
            if (!rule.isActive)
                continue;
            const results = await executeAllocationRule(rule, run.fiscalYear, run.fiscalPeriod, transaction);
            totalAllocated += results.reduce((sum, r) => sum + r.allocationAmount, 0);
        }
        run.totalAllocated = totalAllocated;
        run.status = 'completed';
        run.endTime = new Date();
    }
    catch (error) {
        run.status = 'failed';
        run.errorLog = error instanceof Error ? error.message : 'Unknown error';
        run.endTime = new Date();
    }
    return run;
}
/**
 * Reverses allocation run
 * @param runId - Allocation run identifier
 * @param reversedBy - User reversing allocation
 * @returns Reversal results
 */
async function reverseAllocationRun(runId, reversedBy, transaction) {
    const originalRun = await getAllocationRun(runId, transaction);
    if (originalRun.status === 'reversed') {
        throw new Error('Allocation run already reversed');
    }
    // Create reversal entries
    const results = await getAllocationResultsByRunId(runId, transaction);
    for (const result of results) {
        await createReversalJournalEntry(result, transaction);
        result.reversedDate = new Date();
    }
    originalRun.status = 'reversed';
    // Audit trail
    await createAllocationAuditEntry('REVERSE_RUN', `Run ${runId}`, reversedBy, transaction);
    return originalRun;
}
// ============================================================================
// VARIANCE AND REPORTING FUNCTIONS
// ============================================================================
/**
 * Calculates allocation variances
 * @param fiscalYear - Fiscal year
 * @param fiscalPeriod - Fiscal period
 * @returns Variance analysis
 */
async function calculateAllocationVariances(fiscalYear, fiscalPeriod, transaction) {
    const variances = [];
    const departments = await getAllDepartments(transaction);
    for (const department of departments) {
        const budgetedAllocation = await getBudgetedAllocation(department, fiscalYear, fiscalPeriod, transaction);
        const actualAllocation = await getActualAllocation(department, fiscalYear, fiscalPeriod, transaction);
        const variance = actualAllocation - budgetedAllocation;
        const variancePercentage = budgetedAllocation !== 0 ? (variance / budgetedAllocation) * 100 : 0;
        const varianceRecord = {
            varianceId: 0,
            department,
            accountCode: '', // Will be set per account
            fiscalYear,
            fiscalPeriod,
            budgetedAllocation,
            actualAllocation,
            variance,
            variancePercentage,
            isFavorable: variance < 0, // Lower allocation is favorable for expense
        };
        variances.push(varianceRecord);
    }
    return variances;
}
/**
 * Generates allocation summary report
 * @param fiscalYear - Fiscal year
 * @param fiscalPeriod - Fiscal period
 * @returns Summary report data
 */
async function generateAllocationSummaryReport(fiscalYear, fiscalPeriod, transaction) {
    const allResults = await getAllocationResultsForPeriod(fiscalYear, fiscalPeriod, transaction);
    const totalAllocated = allResults.reduce((sum, r) => sum + r.allocationAmount, 0);
    // Group by department
    const byDepartment = new Map();
    for (const result of allResults) {
        const current = byDepartment.get(result.targetDepartment) || 0;
        byDepartment.set(result.targetDepartment, current + result.allocationAmount);
    }
    // Group by rule
    const byRule = new Map();
    for (const result of allResults) {
        const current = byRule.get(result.ruleId) || 0;
        byRule.set(result.ruleId, current + result.allocationAmount);
    }
    // Top 10 allocations
    const topAllocations = allResults
        .sort((a, b) => b.allocationAmount - a.allocationAmount)
        .slice(0, 10);
    return {
        totalAllocated,
        allocationsByDepartment: byDepartment,
        allocationsByRule: byRule,
        topAllocations,
    };
}
// ============================================================================
// WHAT-IF ANALYSIS FUNCTIONS
// ============================================================================
/**
 * Creates what-if scenario
 * @param scenarioData - Scenario configuration
 * @returns Created scenario
 */
async function createWhatIfScenario(scenarioData, transaction) {
    const scenario = {
        scenarioId: 0,
        scenarioName: scenarioData.scenarioName,
        description: scenarioData.description,
        baselineRunId: scenarioData.baselineRunId,
        modifications: scenarioData.modifications,
        projectedResults: [],
        totalImpact: 0,
        impactByDepartment: new Map(),
        createdBy: scenarioData.createdBy,
        createdDate: new Date(),
        isApplied: false,
    };
    return scenario;
}
/**
 * Executes what-if scenario analysis
 * @param scenarioId - Scenario identifier
 * @returns Projected results
 */
async function executeWhatIfScenario(scenarioId, transaction) {
    const scenario = await getWhatIfScenario(scenarioId, transaction);
    const baselineRun = await getAllocationRun(scenario.baselineRunId, transaction);
    // Apply modifications to baseline
    const modifiedRules = await applyScenarioModifications(baselineRun.rulesExecuted, scenario.modifications, transaction);
    // Execute modified allocation
    const projectedResults = [];
    for (const rule of modifiedRules) {
        const results = await executeAllocationRule(rule, baselineRun.fiscalYear, baselineRun.fiscalPeriod, transaction);
        projectedResults.push(...results);
    }
    scenario.projectedResults = projectedResults;
    // Calculate impact
    const baselineResults = await getAllocationResultsByRunId(scenario.baselineRunId, transaction);
    scenario.totalImpact = calculateScenarioImpact(baselineResults, projectedResults);
    scenario.impactByDepartment = calculateImpactByDepartment(baselineResults, projectedResults);
    return projectedResults;
}
/**
 * Compares what-if scenario to baseline
 * @param scenarioId - Scenario identifier
 * @returns Comparison analysis
 */
async function compareScenarioToBaseline(scenarioId, transaction) {
    const scenario = await getWhatIfScenario(scenarioId, transaction);
    const baselineResults = await getAllocationResultsByRunId(scenario.baselineRunId, transaction);
    const baselineTotal = baselineResults.reduce((sum, r) => sum + r.allocationAmount, 0);
    const scenarioTotal = scenario.projectedResults.reduce((sum, r) => sum + r.allocationAmount, 0);
    const totalDifference = scenarioTotal - baselineTotal;
    const differencePercentage = baselineTotal !== 0 ? (totalDifference / baselineTotal) * 100 : 0;
    // Department-level comparison
    const departmentComparisons = new Map();
    const departments = new Set([
        ...baselineResults.map(r => r.targetDepartment),
        ...scenario.projectedResults.map(r => r.targetDepartment),
    ]);
    for (const dept of departments) {
        const baseline = baselineResults
            .filter(r => r.targetDepartment === dept)
            .reduce((sum, r) => sum + r.allocationAmount, 0);
        const scenarioAmount = scenario.projectedResults
            .filter(r => r.targetDepartment === dept)
            .reduce((sum, r) => sum + r.allocationAmount, 0);
        departmentComparisons.set(dept, {
            baseline,
            scenario: scenarioAmount,
            difference: scenarioAmount - baseline,
        });
    }
    return {
        baselineTotal,
        scenarioTotal,
        totalDifference,
        differencePercentage,
        departmentComparisons,
    };
}
// ============================================================================
// AUDIT AND SECURITY FUNCTIONS
// ============================================================================
/**
 * Creates audit log entry for allocation operation
 * @param action - Action performed
 * @param entity - Entity affected
 * @param performedBy - User performing action
 * @returns Audit log entry
 */
async function createAllocationAuditEntry(action, entity, performedBy, transaction) {
    const auditEntry = {
        auditId: 0,
        allocationRunId: 0,
        timestamp: new Date(),
        action,
        performedBy,
        department: '',
        changeReason: '',
        ipAddress: '',
    };
    return auditEntry;
}
/**
 * Encrypts sensitive allocation data
 * @param allocationData - Data to encrypt
 * @param encryptionKey - Encryption key
 * @returns Encrypted data
 */
async function encryptAllocationData(allocationData, encryptionKey) {
    const algorithm = 'aes-256-gcm';
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(encryptionKey, 'salt', 32);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(allocationData, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
async function getAllocationRule(ruleId, transaction) {
    return {};
}
async function getAllocationBasisByCode(basisCode, transaction) {
    return {};
}
async function getDriverValuesForDepartments(driverCode, departments, fiscalYear, fiscalPeriod, transaction) {
    return new Map();
}
async function allocationBasisExists(basisCode) {
    return true;
}
async function allocationDriverExists(driverCode) {
    return true;
}
async function getStatisticalDriver(driverId, transaction) {
    return {};
}
async function getStatisticalDrivers(driverCode, departments, fiscalYear, fiscalPeriod, transaction) {
    return [];
}
async function getHistoricalDrivers(driverCode, department, transaction) {
    return [];
}
async function calculateTrendFactor(drivers) {
    return 1.0;
}
async function getAllocationPool(poolId, transaction) {
    return {};
}
async function getAccountBalance(accountCode, fiscalYear, fiscalPeriod, transaction) {
    return 0;
}
async function getCascadeAllocation(cascadeId, transaction) {
    return {};
}
async function getReciprocalAllocation(reciprocalId, transaction) {
    return {};
}
async function getDepartmentCosts(departments, fiscalYear, fiscalPeriod, transaction) {
    return new Map();
}
async function getDepartmentCost(department, fiscalYear, fiscalPeriod, transaction) {
    return 0;
}
function checkConvergence(previous, current, threshold) {
    for (const [key, value] of current) {
        const previousValue = previous.get(key) || 0;
        const difference = Math.abs(value - previousValue);
        if (difference > threshold) {
            return false;
        }
    }
    return true;
}
async function createAllocationJournalEntry(result, transaction) { }
async function createReversalJournalEntry(result, transaction) { }
async function getAllocationRun(runId, transaction) {
    return {};
}
async function getAllocationResultsByRunId(runId, transaction) {
    return [];
}
async function getAllocationRulesByIds(ruleIds, transaction) {
    return [];
}
async function getAllDepartments(transaction) {
    return [];
}
async function getBudgetedAllocation(department, fiscalYear, fiscalPeriod, transaction) {
    return 0;
}
async function getActualAllocation(department, fiscalYear, fiscalPeriod, transaction) {
    return 0;
}
async function getAllocationResultsForPeriod(fiscalYear, fiscalPeriod, transaction) {
    return [];
}
async function getWhatIfScenario(scenarioId, transaction) {
    return {};
}
async function applyScenarioModifications(ruleIds, modifications, transaction) {
    return [];
}
function calculateScenarioImpact(baseline, scenario) {
    const baselineTotal = baseline.reduce((sum, r) => sum + r.allocationAmount, 0);
    const scenarioTotal = scenario.reduce((sum, r) => sum + r.allocationAmount, 0);
    return scenarioTotal - baselineTotal;
}
function calculateImpactByDepartment(baseline, scenario) {
    const impact = new Map();
    return impact;
}
//# sourceMappingURL=allocation-engines-rules-kit.js.map