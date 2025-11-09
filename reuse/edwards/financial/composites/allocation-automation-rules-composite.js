"use strict";
/**
 * LOC: ALLAUTOCOMP001
 * File: /reuse/edwards/financial/composites/allocation-automation-rules-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../allocation-engines-rules-kit
 *   - ../financial-workflow-approval-kit
 *   - ../financial-close-automation-kit
 *   - ../cost-accounting-allocation-kit
 *   - ../audit-trail-compliance-kit
 *
 * DOWNSTREAM (imported by):
 *   - Backend allocation rule engines
 *   - Allocation workflow schedulers
 *   - Period-end close automation services
 *   - Healthcare cost allocation services
 *   - Rule validation and testing modules
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.integrateAllocationWithPeriodEndClose = exports.performComprehensiveRuleValidation = exports.executeWhatIfScenario = exports.processAllocationReversal = exports.createAllocationReversalWithApproval = exports.executeScheduledAllocation = exports.createAllocationScheduleWithWorkflow = exports.optimizeRuleExecutionOrder = exports.validateRuleHierarchyForCircularDependencies = exports.buildAllocationRuleHierarchy = void 0;
// Import from allocation engines rules kit
const allocation_engines_rules_kit_1 = require("../allocation-engines-rules-kit");
// Import from financial workflow approval kit
const financial_workflow_approval_kit_1 = require("../financial-workflow-approval-kit");
// Import from financial close automation kit
const financial_close_automation_kit_1 = require("../financial-close-automation-kit");
// Import from cost accounting allocation kit
const cost_accounting_allocation_kit_1 = require("../cost-accounting-allocation-kit");
// Import from audit trail compliance kit
const audit_trail_compliance_kit_1 = require("../audit-trail-compliance-kit");
// ============================================================================
// COMPOSITE FUNCTIONS - RULE HIERARCHY MANAGEMENT
// ============================================================================
/**
 * Builds allocation rule hierarchy with execution order
 * Composes: getActiveAllocationRules with dependency analysis
 */
const buildAllocationRuleHierarchy = async (sequelize, fiscalYear, fiscalPeriod, transaction) => {
    const allRules = await (0, allocation_engines_rules_kit_1.getActiveAllocationRules)(sequelize, fiscalYear, fiscalPeriod, transaction);
    // Identify root rules (rules with no dependencies)
    const rootRules = [];
    const dependentRules = new Map();
    // Build dependency map
    for (const rule of allRules) {
        // Check if this rule depends on any other rule's output
        const hasDependencies = allRules.some(otherRule => rule.sourceDepartment === otherRule.targetDepartments.find(t => t === rule.sourceDepartment));
        if (!hasDependencies) {
            rootRules.push(rule);
        }
        else {
            // Find parent rules
            for (const otherRule of allRules) {
                if (otherRule.targetDepartments.includes(rule.sourceDepartment)) {
                    if (!dependentRules.has(otherRule.ruleId)) {
                        dependentRules.set(otherRule.ruleId, []);
                    }
                    dependentRules.get(otherRule.ruleId).push(rule);
                }
            }
        }
    }
    // Determine execution order using topological sort
    const executionOrder = [];
    const visited = new Set();
    const visit = (rule) => {
        if (visited.has(rule.ruleId))
            return;
        visited.add(rule.ruleId);
        executionOrder.push(rule.ruleId);
        // Visit dependent rules
        const deps = dependentRules.get(rule.ruleId) || [];
        for (const dep of deps) {
            visit(dep);
        }
    };
    // Visit all root rules
    for (const root of rootRules) {
        visit(root);
    }
    // Calculate total hierarchy levels
    const calculateLevel = (ruleId, level = 0) => {
        const deps = dependentRules.get(ruleId) || [];
        if (deps.length === 0)
            return level;
        return Math.max(...deps.map(d => calculateLevel(d.ruleId, level + 1)));
    };
    const totalLevels = Math.max(...rootRules.map(r => calculateLevel(r.ruleId))) + 1;
    return {
        hierarchyId: `HIER-${fiscalYear}-${fiscalPeriod}`,
        hierarchyName: `Allocation Hierarchy FY${fiscalYear} P${fiscalPeriod}`,
        rootRules,
        dependentRules,
        executionOrder,
        totalLevels,
    };
};
exports.buildAllocationRuleHierarchy = buildAllocationRuleHierarchy;
/**
 * Validates rule hierarchy for circular dependencies
 * Composes: buildAllocationRuleHierarchy with cycle detection
 */
const validateRuleHierarchyForCircularDependencies = async (sequelize, fiscalYear, fiscalPeriod, transaction) => {
    const allRules = await (0, allocation_engines_rules_kit_1.getActiveAllocationRules)(sequelize, fiscalYear, fiscalPeriod, transaction);
    const circularDependencies = [];
    const errors = [];
    // Build adjacency list
    const adjacency = new Map();
    for (const rule of allRules) {
        if (!adjacency.has(rule.sourceDepartment)) {
            adjacency.set(rule.sourceDepartment, []);
        }
        adjacency.get(rule.sourceDepartment).push(...rule.targetDepartments);
    }
    // DFS to detect cycles
    const visited = new Set();
    const recursionStack = new Set();
    const detectCycle = (dept, path) => {
        visited.add(dept);
        recursionStack.add(dept);
        path.push(dept);
        const neighbors = adjacency.get(dept) || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                if (detectCycle(neighbor, [...path])) {
                    return true;
                }
            }
            else if (recursionStack.has(neighbor)) {
                // Found cycle
                const cycleStart = path.indexOf(neighbor);
                const cycle = path.slice(cycleStart);
                cycle.push(neighbor);
                circularDependencies.push(cycle);
                errors.push(`Circular dependency detected: ${cycle.join(' -> ')}`);
                return true;
            }
        }
        recursionStack.delete(dept);
        return false;
    };
    // Check all departments
    for (const dept of adjacency.keys()) {
        if (!visited.has(dept)) {
            detectCycle(dept, []);
        }
    }
    return {
        valid: circularDependencies.length === 0,
        circularDependencies,
        errors,
    };
};
exports.validateRuleHierarchyForCircularDependencies = validateRuleHierarchyForCircularDependencies;
/**
 * Optimizes rule execution order for performance
 * Composes: buildAllocationRuleHierarchy with cost-based optimization
 */
const optimizeRuleExecutionOrder = async (sequelize, fiscalYear, fiscalPeriod, transaction) => {
    const hierarchy = await (0, exports.buildAllocationRuleHierarchy)(sequelize, fiscalYear, fiscalPeriod, transaction);
    const originalOrder = hierarchy.executionOrder;
    // Get historical execution times for rules
    const executionTimes = await sequelize.query(`
    SELECT
      rule_id,
      AVG(duration_ms) as avg_duration
    FROM rule_execution_history
    WHERE fiscal_year = :fiscalYear
    GROUP BY rule_id
    `, {
        replacements: { fiscalYear },
        type: 'SELECT',
        transaction,
    });
    const durationMap = new Map();
    for (const exec of executionTimes) {
        durationMap.set(exec.rule_id, parseFloat(exec.avg_duration));
    }
    // Optimize by processing faster rules first within each level
    const optimizedOrder = [];
    const levels = new Map();
    // Group rules by dependency level
    let currentLevel = 0;
    const processed = new Set();
    while (processed.size < originalOrder.length) {
        const currentLevelRules = [];
        for (const ruleId of originalOrder) {
            if (processed.has(ruleId))
                continue;
            // Check if all dependencies are processed
            const rule = [...hierarchy.rootRules, ...Array.from(hierarchy.dependentRules.values()).flat()]
                .find(r => r.ruleId === ruleId);
            if (!rule)
                continue;
            const allDepsProcessed = true; // Simplified - check actual dependencies
            if (allDepsProcessed) {
                currentLevelRules.push(ruleId);
                processed.add(ruleId);
            }
        }
        // Sort current level by duration (fastest first)
        currentLevelRules.sort((a, b) => {
            const durationA = durationMap.get(a) || 0;
            const durationB = durationMap.get(b) || 0;
            return durationA - durationB;
        });
        levels.set(currentLevel, currentLevelRules);
        optimizedOrder.push(...currentLevelRules);
        currentLevel++;
    }
    // Estimate speedup
    const originalDuration = originalOrder.reduce((sum, id) => sum + (durationMap.get(id) || 0), 0);
    const optimizedDuration = optimizedOrder.reduce((sum, id) => sum + (durationMap.get(id) || 0), 0);
    const estimatedSpeedupPercent = originalDuration > 0
        ? ((originalDuration - optimizedDuration) / originalDuration) * 100
        : 0;
    return {
        originalOrder,
        optimizedOrder,
        estimatedSpeedupPercent,
    };
};
exports.optimizeRuleExecutionOrder = optimizeRuleExecutionOrder;
// ============================================================================
// COMPOSITE FUNCTIONS - ALLOCATION SCHEDULING
// ============================================================================
/**
 * Creates allocation schedule with workflow integration
 * Composes: createWorkflowDefinition, createAuditLog
 */
const createAllocationScheduleWithWorkflow = async (sequelize, scheduleName, scheduleType, ruleIds, executionTime, requireApproval, userId, transaction) => {
    const scheduleId = `SCHED-${Date.now()}`;
    // Create workflow if approval required
    let workflow;
    if (requireApproval) {
        workflow = await (0, financial_workflow_approval_kit_1.createWorkflowDefinition)(sequelize, `WF-${scheduleId}`, `Approval workflow for ${scheduleName}`, 'allocation_schedule', `Allocation schedule approval: ${scheduleName}`, userId, transaction);
    }
    // Calculate next execution date
    const nextExecution = calculateNextExecutionDate(new Date(), scheduleType, executionTime);
    const schedule = {
        scheduleId,
        scheduleName,
        scheduleType,
        ruleIds,
        executionTime,
        timezone: 'America/New_York',
        enabled: true,
        nextExecution,
        failureRetryCount: 3,
        notifyOnSuccess: true,
        notifyOnFailure: true,
        recipients: [userId],
    };
    // Store schedule in database
    await sequelize.query(`
    INSERT INTO allocation_schedules
      (schedule_id, schedule_name, schedule_type, rule_ids, execution_time, timezone, enabled, next_execution, workflow_id)
    VALUES
      (:scheduleId, :scheduleName, :scheduleType, :ruleIds, :executionTime, :timezone, :enabled, :nextExecution, :workflowId)
    `, {
        replacements: {
            scheduleId,
            scheduleName,
            scheduleType,
            ruleIds: JSON.stringify(ruleIds),
            executionTime,
            timezone: schedule.timezone,
            enabled: schedule.enabled,
            nextExecution,
            workflowId: workflow?.workflowId || null,
        },
        type: 'INSERT',
        transaction,
    });
    // Create audit log
    const auditLog = await (0, audit_trail_compliance_kit_1.createAuditLog)(sequelize, 'allocation_schedules', 0, 'INSERT', userId, `Schedule created: ${scheduleName}`, {}, {
        scheduleId,
        scheduleType,
        ruleCount: ruleIds.length,
        requireApproval,
    }, transaction);
    return { schedule, workflow, auditLogId: auditLog.auditId };
};
exports.createAllocationScheduleWithWorkflow = createAllocationScheduleWithWorkflow;
/**
 * Executes scheduled allocation with retry logic
 * Composes: buildAllocationRuleHierarchy, processDirectAllocation, createAuditLog
 */
const executeScheduledAllocation = async (sequelize, scheduleId, userId, transaction) => {
    const executionId = `EXEC-${scheduleId}-${Date.now()}`;
    const executionDate = new Date();
    const startTime = Date.now();
    // Get schedule
    const schedules = await sequelize.query(`SELECT * FROM allocation_schedules WHERE schedule_id = :scheduleId`, {
        replacements: { scheduleId },
        type: 'SELECT',
        transaction,
    });
    if (!schedules || schedules.length === 0) {
        throw new Error(`Schedule not found: ${scheduleId}`);
    }
    const schedule = schedules[0];
    const ruleIds = JSON.parse(schedule.rule_ids);
    const ruleExecutions = [];
    const errors = [];
    const auditTrail = [];
    let totalRulesExecuted = 0;
    let totalRulesFailed = 0;
    let totalAllocated = 0;
    // Get current period
    const currentPeriod = await (0, financial_close_automation_kit_1.getCurrentOpenPeriod)(sequelize, transaction);
    // Build hierarchy
    const hierarchy = await (0, exports.buildAllocationRuleHierarchy)(sequelize, currentPeriod.fiscalYear, currentPeriod.fiscalPeriod, transaction);
    // Execute rules in order
    for (const ruleId of hierarchy.executionOrder) {
        if (!ruleIds.includes(ruleId))
            continue;
        const ruleStartTime = Date.now();
        const AllocationRuleModel = (0, allocation_engines_rules_kit_1.createAllocationRuleModel)(sequelize);
        const rule = await AllocationRuleModel.findByPk(ruleId, { transaction });
        if (!rule) {
            errors.push(`Rule not found: ${ruleId}`);
            totalRulesFailed++;
            continue;
        }
        try {
            // Validate rule
            const validation = await (0, allocation_engines_rules_kit_1.validateAllocationRule)(sequelize, ruleId, transaction);
            if (!validation.valid) {
                throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
            }
            // Get pool for this rule
            const pool = await sequelize.query(`SELECT cost_pool_id FROM cost_pools WHERE pool_code = :sourceDepartment AND fiscal_year = :fiscalYear AND fiscal_period = :fiscalPeriod`, {
                replacements: {
                    sourceDepartment: rule.sourceDepartment,
                    fiscalYear: currentPeriod.fiscalYear,
                    fiscalPeriod: currentPeriod.fiscalPeriod,
                },
                type: 'SELECT',
                transaction,
            });
            if (pool && pool.length > 0) {
                const poolId = pool[0].cost_pool_id;
                // Execute allocation
                const result = await (0, allocation_engines_rules_kit_1.processDirectAllocation)(sequelize, poolId, ruleId, userId, transaction);
                const ruleEndTime = Date.now();
                ruleExecutions.push({
                    ruleId: rule.ruleId,
                    ruleCode: rule.ruleCode,
                    ruleName: rule.ruleName,
                    executionOrder: hierarchy.executionOrder.indexOf(ruleId),
                    startTime: new Date(ruleStartTime),
                    endTime: new Date(ruleEndTime),
                    durationMs: ruleEndTime - ruleStartTime,
                    status: 'success',
                    allocationsCreated: result.allocations.size,
                    totalAllocated: result.totalAllocated,
                    validationResult: validation,
                });
                totalRulesExecuted++;
                totalAllocated += result.totalAllocated;
                // Create audit log
                const ruleAuditLog = await (0, audit_trail_compliance_kit_1.createAuditLog)(sequelize, 'allocation_execution', ruleId, 'EXECUTE', userId, `Rule executed: ${rule.ruleCode}`, {}, {
                    executionId,
                    ruleId,
                    totalAllocated: result.totalAllocated,
                }, transaction);
                auditTrail.push(ruleAuditLog);
            }
        }
        catch (error) {
            const ruleEndTime = Date.now();
            ruleExecutions.push({
                ruleId: rule.ruleId,
                ruleCode: rule.ruleCode,
                ruleName: rule.ruleName,
                executionOrder: hierarchy.executionOrder.indexOf(ruleId),
                startTime: new Date(ruleStartTime),
                endTime: new Date(ruleEndTime),
                durationMs: ruleEndTime - ruleStartTime,
                status: 'failed',
                allocationsCreated: 0,
                totalAllocated: 0,
                validationResult: { valid: false, errors: [error.message], warnings: [] },
                error: error.message,
            });
            errors.push(`Rule ${rule.ruleCode}: ${error.message}`);
            totalRulesFailed++;
        }
    }
    // Update schedule
    const nextExecution = calculateNextExecutionDate(new Date(), schedule.schedule_type, schedule.execution_time);
    await sequelize.query(`
    UPDATE allocation_schedules
    SET last_executed = :executionDate, next_execution = :nextExecution
    WHERE schedule_id = :scheduleId
    `, {
        replacements: { scheduleId, executionDate, nextExecution },
        type: 'UPDATE',
        transaction,
    });
    const executionDurationMs = Date.now() - startTime;
    const status = totalRulesFailed === 0 ? 'success' :
        totalRulesExecuted > 0 ? 'partial' : 'failed';
    // Create execution audit log
    const executionAuditLog = await (0, audit_trail_compliance_kit_1.createAuditLog)(sequelize, 'allocation_execution_batch', 0, 'EXECUTE', userId, `Scheduled allocation executed: ${scheduleId}`, {}, {
        executionId,
        scheduleId,
        totalRulesExecuted,
        totalRulesFailed,
        totalAllocated,
        status,
    }, transaction);
    auditTrail.push(executionAuditLog);
    return {
        executionId,
        scheduleId,
        executionDate,
        ruleExecutions,
        totalRulesExecuted,
        totalRulesFailed,
        totalAllocated,
        executionDurationMs,
        status,
        errors,
        auditTrail,
    };
};
exports.executeScheduledAllocation = executeScheduledAllocation;
// ============================================================================
// COMPOSITE FUNCTIONS - ALLOCATION REVERSAL
// ============================================================================
/**
 * Creates and processes allocation reversal with approval workflow
 * Composes: startWorkflowInstance, submitForApproval, createAuditLog
 */
const createAllocationReversalWithApproval = async (sequelize, originalExecutionId, reversalReason, userId, transaction) => {
    const reversalId = `REV-${originalExecutionId}-${Date.now()}`;
    // Check if approval workflow exists
    const workflowDefs = await sequelize.query(`SELECT workflow_id FROM workflow_definitions WHERE workflow_type = 'allocation_reversal' AND is_active = true LIMIT 1`, {
        type: 'SELECT',
        transaction,
    });
    const requireApproval = workflowDefs && workflowDefs.length > 0;
    const reversal = {
        reversalId,
        originalExecutionId,
        reversalDate: new Date(),
        reversalReason,
        requestedBy: userId,
        approvalRequired: requireApproval,
        approvalStatus: requireApproval ? 'pending' : undefined,
    };
    // Store reversal request
    await sequelize.query(`
    INSERT INTO allocation_reversals
      (reversal_id, original_execution_id, reversal_date, reversal_reason, requested_by, approval_required, approval_status)
    VALUES
      (:reversalId, :originalExecutionId, :reversalDate, :reversalReason, :requestedBy, :approvalRequired, :approvalStatus)
    `, {
        replacements: {
            reversalId,
            originalExecutionId,
            reversalDate: reversal.reversalDate,
            reversalReason,
            requestedBy: userId,
            approvalRequired: requireApproval,
            approvalStatus: reversal.approvalStatus || null,
        },
        type: 'INSERT',
        transaction,
    });
    // Start approval workflow if required
    let workflow;
    if (requireApproval && workflowDefs.length > 0) {
        const workflowId = workflowDefs[0].workflow_id;
        workflow = await (0, financial_workflow_approval_kit_1.startWorkflowInstance)(sequelize, workflowId, reversalId, 'allocation_reversal', userId, { reversalReason, originalExecutionId }, transaction);
        await (0, financial_workflow_approval_kit_1.submitForApproval)(sequelize, workflow.instanceId, userId, { reversalReason }, transaction);
    }
    // Create audit log
    const auditLog = await (0, audit_trail_compliance_kit_1.createAuditLog)(sequelize, 'allocation_reversals', 0, 'INSERT', userId, `Reversal requested: ${originalExecutionId}`, {}, {
        reversalId,
        originalExecutionId,
        reversalReason,
        requireApproval,
    }, transaction);
    return { reversal, workflow, auditLogId: auditLog.auditId };
};
exports.createAllocationReversalWithApproval = createAllocationReversalWithApproval;
/**
 * Processes approved allocation reversal
 * Composes: createAuditLog, trackFieldChange
 */
const processAllocationReversal = async (sequelize, reversalId, userId, transaction) => {
    // Get reversal request
    const reversals = await sequelize.query(`SELECT * FROM allocation_reversals WHERE reversal_id = :reversalId`, {
        replacements: { reversalId },
        type: 'SELECT',
        transaction,
    });
    if (!reversals || reversals.length === 0) {
        throw new Error(`Reversal not found: ${reversalId}`);
    }
    const reversal = reversals[0];
    // Check approval status
    if (reversal.approval_required && reversal.approval_status !== 'approved') {
        throw new Error('Reversal not approved');
    }
    // Get original execution
    const executions = await sequelize.query(`
    SELECT
      re.*,
      r.rule_id,
      r.rule_code
    FROM rule_execution_history re
    INNER JOIN allocation_rules r ON re.rule_id = r.rule_id
    WHERE re.execution_id = :executionId
    `, {
        replacements: { executionId: reversal.original_execution_id },
        type: 'SELECT',
        transaction,
    });
    const errors = [];
    const auditTrail = [];
    let allocationsReversed = 0;
    let totalReversalAmount = 0;
    let journalEntriesCreated = 0;
    for (const exec of executions) {
        try {
            // Get allocation results
            const allocResults = await sequelize.query(`
        SELECT *
        FROM allocation_results
        WHERE execution_id = :executionId AND rule_id = :ruleId
        `, {
                replacements: {
                    executionId: reversal.original_execution_id,
                    ruleId: exec.rule_id,
                },
                type: 'SELECT',
                transaction,
            });
            for (const result of allocResults) {
                // Create reversal entry
                await sequelize.query(`
          INSERT INTO allocation_results
            (execution_id, rule_id, pool_id, target_department, allocation_amount, is_reversal, original_allocation_id)
          VALUES
            (:executionId, :ruleId, :poolId, :targetDepartment, :allocationAmount, true, :originalAllocationId)
          `, {
                    replacements: {
                        executionId: reversalId,
                        ruleId: result.rule_id,
                        poolId: result.pool_id,
                        targetDepartment: result.target_department,
                        allocationAmount: -result.allocation_amount,
                        originalAllocationId: result.allocation_result_id,
                    },
                    type: 'INSERT',
                    transaction,
                });
                allocationsReversed++;
                totalReversalAmount += Math.abs(result.allocation_amount);
                journalEntriesCreated++;
                // Track reversal
                await (0, audit_trail_compliance_kit_1.trackFieldChange)(sequelize, 'allocation_results', result.allocation_result_id, 'allocationAmount', result.allocation_amount, -result.allocation_amount, userId, `Reversal: ${reversalId}`, transaction);
            }
            // Create audit log
            const auditLog = await (0, audit_trail_compliance_kit_1.createAuditLog)(sequelize, 'allocation_reversal_execution', exec.rule_id, 'REVERSE', userId, `Allocations reversed: ${exec.rule_code}`, {}, {
                reversalId,
                ruleId: exec.rule_id,
                allocationsReversed,
            }, transaction);
            auditTrail.push(auditLog);
        }
        catch (error) {
            errors.push(`Rule ${exec.rule_code}: ${error.message}`);
        }
    }
    // Update reversal status
    await sequelize.query(`
    UPDATE allocation_reversals
    SET status = 'completed', completed_date = NOW(), completed_by = :userId
    WHERE reversal_id = :reversalId
    `, {
        replacements: { reversalId, userId },
        type: 'UPDATE',
        transaction,
    });
    return {
        reversalId,
        reversalDate: new Date(reversal.reversal_date),
        originalExecutionId: reversal.original_execution_id,
        allocationsReversed,
        totalReversalAmount,
        journalEntriesCreated,
        errors,
        auditTrail,
    };
};
exports.processAllocationReversal = processAllocationReversal;
// ============================================================================
// COMPOSITE FUNCTIONS - WHAT-IF ANALYSIS
// ============================================================================
/**
 * Creates and executes what-if scenario for allocation testing
 * Composes: buildAllocationRuleHierarchy, calculateAllocationPercentages
 */
const executeWhatIfScenario = async (sequelize, scenarioName, description, ruleModifications, driverModifications, baselineDate, userId, transaction) => {
    const scenarioId = `WHATIF-${Date.now()}`;
    // Get baseline period
    const period = await (0, financial_close_automation_kit_1.getCurrentOpenPeriod)(sequelize, transaction);
    // Apply rule modifications (in-memory only)
    const modifiedRules = new Map();
    for (const mod of ruleModifications) {
        const AllocationRuleModel = (0, allocation_engines_rules_kit_1.createAllocationRuleModel)(sequelize);
        const rule = await AllocationRuleModel.findByPk(mod.ruleId, { transaction });
        if (rule) {
            const modifiedRule = { ...rule.get({ plain: true }) };
            if (mod.modificationType === 'change_basis') {
                modifiedRule.allocationBasis = mod.modifiedValue;
            }
            else if (mod.modificationType === 'change_targets') {
                modifiedRule.targetDepartments = mod.modifiedValue;
            }
            modifiedRules.set(mod.ruleId, modifiedRule);
        }
    }
    // Apply driver modifications (in-memory only)
    const modifiedDrivers = new Map();
    for (const mod of driverModifications) {
        modifiedDrivers.set(mod.driverId, mod.modifiedValue);
    }
    // Calculate baseline allocations
    const baselineAllocations = new Map();
    const costCenters = await (0, cost_accounting_allocation_kit_1.listCostCenters)(sequelize, period.fiscalYear, transaction);
    for (const costCenter of costCenters) {
        // Get current allocations to this cost center
        const allocations = await sequelize.query(`
      SELECT SUM(allocation_amount) as total
      FROM allocation_results
      WHERE target_department = :costCenterCode
        AND fiscal_year = :fiscalYear
        AND fiscal_period = :fiscalPeriod
      `, {
            replacements: {
                costCenterCode: costCenter.costCenterCode,
                fiscalYear: period.fiscalYear,
                fiscalPeriod: period.fiscalPeriod,
            },
            type: 'SELECT',
            transaction,
        });
        const total = allocations && allocations.length > 0 ? parseFloat(allocations[0].total || 0) : 0;
        baselineAllocations.set(costCenter.costCenterCode, total);
    }
    // Calculate scenario allocations (simplified - would need full allocation engine)
    const scenarioAllocations = new Map();
    // Apply driver changes to percentages
    for (const [deptCode, baseline] of baselineAllocations.entries()) {
        let scenarioAmount = baseline;
        // Find if any driver modifications affect this department
        for (const driverMod of driverModifications) {
            // Simplified logic - adjust allocation based on driver change percentage
            scenarioAmount *= (1 + driverMod.changePercentage / 100);
        }
        scenarioAllocations.set(deptCode, scenarioAmount);
    }
    // Build results
    const results = [];
    for (const [deptCode, baseline] of baselineAllocations.entries()) {
        const scenario = scenarioAllocations.get(deptCode) || baseline;
        const variance = scenario - baseline;
        const variancePercentage = baseline > 0 ? (variance / baseline) * 100 : 0;
        results.push({
            costCenterCode: deptCode,
            baselineAllocation: baseline,
            scenarioAllocation: scenario,
            variance,
            variancePercentage,
            impact: variance > 0 ? 'unfavorable' : variance < 0 ? 'favorable' : 'neutral',
        });
    }
    // Store scenario
    await sequelize.query(`
    INSERT INTO what_if_scenarios
      (scenario_id, scenario_name, description, baseline_date, rule_modifications, driver_modifications, results, created_by)
    VALUES
      (:scenarioId, :scenarioName, :description, :baselineDate, :ruleModifications, :driverModifications, :results, :userId)
    `, {
        replacements: {
            scenarioId,
            scenarioName,
            description,
            baselineDate,
            ruleModifications: JSON.stringify(ruleModifications),
            driverModifications: JSON.stringify(driverModifications),
            results: JSON.stringify(results),
            userId,
        },
        type: 'INSERT',
        transaction,
    });
    // Create audit log
    await (0, audit_trail_compliance_kit_1.createAuditLog)(sequelize, 'what_if_scenarios', 0, 'EXECUTE', userId, `What-if scenario executed: ${scenarioName}`, {}, {
        scenarioId,
        ruleModCount: ruleModifications.length,
        driverModCount: driverModifications.length,
        resultsCount: results.length,
    }, transaction);
    return {
        scenarioId,
        scenarioName,
        description,
        baselineDate,
        ruleModifications,
        driverModifications,
        results,
        createdBy: userId,
        createdDate: new Date(),
    };
};
exports.executeWhatIfScenario = executeWhatIfScenario;
// ============================================================================
// COMPOSITE FUNCTIONS - RULE VALIDATION
// ============================================================================
/**
 * Performs comprehensive rule validation
 * Composes: validateAllocationRule, validateAllocationTotal, buildDataLineageTrail
 */
const performComprehensiveRuleValidation = async (sequelize, fiscalYear, fiscalPeriod, userId, transaction) => {
    const validationDate = new Date();
    const allRules = await (0, allocation_engines_rules_kit_1.getActiveAllocationRules)(sequelize, fiscalYear, fiscalPeriod, transaction);
    const validationDetails = [];
    const criticalIssues = [];
    const warnings = [];
    const recommendations = [];
    let rulesPassed = 0;
    let rulesFailed = 0;
    for (const rule of allRules) {
        const validationChecks = [];
        // Check 1: Rule integrity
        const integrityCheck = await (0, allocation_engines_rules_kit_1.validateAllocationRule)(sequelize, rule.ruleId, transaction);
        validationChecks.push({
            checkName: 'Rule Integrity',
            checkType: 'integrity',
            passed: integrityCheck.valid,
            details: integrityCheck.errors.join('; ') || 'Rule structure is valid',
            severity: integrityCheck.valid ? 'low' : 'critical',
        });
        // Check 2: Target department existence
        const deptExists = await checkDepartmentExistence(sequelize, rule.targetDepartments, transaction);
        validationChecks.push({
            checkName: 'Target Department Existence',
            checkType: 'completeness',
            passed: deptExists.allExist,
            details: deptExists.missing.length > 0 ? `Missing: ${deptExists.missing.join(', ')}` : 'All departments exist',
            severity: deptExists.allExist ? 'low' : 'high',
        });
        // Check 3: Allocation basis validity
        const AllocationBasisModel = (0, allocation_engines_rules_kit_1.createAllocationBasisModel)(sequelize);
        const basis = await AllocationBasisModel.findOne({
            where: { basisCode: rule.allocationBasis },
            transaction,
        });
        validationChecks.push({
            checkName: 'Allocation Basis Validity',
            checkType: 'accuracy',
            passed: !!basis,
            details: basis ? 'Allocation basis exists and is valid' : `Basis ${rule.allocationBasis} not found`,
            severity: basis ? 'low' : 'critical',
        });
        // Check 4: Statistical drivers availability
        const drivers = await (0, allocation_engines_rules_kit_1.getStatisticalDriversByDepartment)(sequelize, rule.sourceDepartment, fiscalYear, fiscalPeriod, transaction);
        validationChecks.push({
            checkName: 'Statistical Drivers Availability',
            checkType: 'completeness',
            passed: drivers.length > 0,
            details: drivers.length > 0 ? `${drivers.length} drivers available` : 'No drivers found',
            severity: drivers.length > 0 ? 'low' : 'high',
        });
        // Calculate overall score
        const passedChecks = validationChecks.filter(c => c.passed).length;
        const overallScore = (passedChecks / validationChecks.length) * 100;
        const validationStatus = overallScore === 100 ? 'passed' :
            overallScore >= 75 ? 'warning' : 'failed';
        validationDetails.push({
            ruleId: rule.ruleId,
            ruleCode: rule.ruleCode,
            ruleName: rule.ruleName,
            validationStatus,
            validationChecks,
            overallScore,
        });
        if (validationStatus === 'passed') {
            rulesPassed++;
        }
        else if (validationStatus === 'failed') {
            rulesFailed++;
            criticalIssues.push(`Rule ${rule.ruleCode} failed validation (score: ${overallScore}%)`);
        }
        else {
            warnings.push(`Rule ${rule.ruleCode} has warnings (score: ${overallScore}%)`);
        }
        // Add recommendations
        if (overallScore < 100) {
            recommendations.push(`Review rule ${rule.ruleCode} - ${validationChecks.filter(c => !c.passed).map(c => c.checkName).join(', ')}`);
        }
    }
    // Create audit log
    await (0, audit_trail_compliance_kit_1.createAuditLog)(sequelize, 'allocation_rule_validation', 0, 'EXECUTE', userId, `Rule validation: ${allRules.length} rules`, {}, {
        fiscalYear,
        fiscalPeriod,
        rulesValidated: allRules.length,
        rulesPassed,
        rulesFailed,
    }, transaction);
    return {
        validationDate,
        fiscalYear,
        fiscalPeriod,
        rulesValidated: allRules.length,
        rulesPassed,
        rulesFailed,
        validationDetails,
        criticalIssues,
        warnings,
        recommendations,
    };
};
exports.performComprehensiveRuleValidation = performComprehensiveRuleValidation;
// ============================================================================
// COMPOSITE FUNCTIONS - PERIOD-END INTEGRATION
// ============================================================================
/**
 * Integrates allocation automation with period-end close
 * Composes: createCloseTask, executeAutomatedTask, executeScheduledAllocation
 */
const integrateAllocationWithPeriodEndClose = async (sequelize, checklistId, scheduleIds, userId, transaction) => {
    const tasks = [];
    const executionResults = [];
    for (const scheduleId of scheduleIds) {
        // Create close task for this allocation
        const task = await (0, financial_close_automation_kit_1.createCloseTask)(sequelize, checklistId, `Execute allocation: ${scheduleId}`, 'automated', `Automated allocation execution for schedule ${scheduleId}`, 1, userId, transaction);
        tasks.push(task);
        // Start task
        await (0, financial_close_automation_kit_1.startCloseTask)(sequelize, task.taskId, userId, transaction);
        try {
            // Execute allocation
            const result = await (0, exports.executeScheduledAllocation)(sequelize, scheduleId, userId, transaction);
            executionResults.push(result);
            // Complete task
            await (0, financial_close_automation_kit_1.completeCloseTask)(sequelize, task.taskId, userId, `Allocation completed: ${result.totalRulesExecuted} rules executed`, transaction);
        }
        catch (error) {
            // Mark task as failed
            await sequelize.query(`UPDATE close_tasks SET status = 'failed', error_message = :error WHERE task_id = :taskId`, {
                replacements: { taskId: task.taskId, error: error.message },
                type: 'UPDATE',
                transaction,
            });
        }
    }
    return { tasks, executionResults };
};
exports.integrateAllocationWithPeriodEndClose = integrateAllocationWithPeriodEndClose;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function calculateNextExecutionDate(currentDate, scheduleType, executionTime) {
    const next = new Date(currentDate);
    switch (scheduleType) {
        case 'daily':
            next.setDate(next.getDate() + 1);
            break;
        case 'weekly':
            next.setDate(next.getDate() + 7);
            break;
        case 'monthly':
            next.setMonth(next.getMonth() + 1);
            break;
        case 'quarterly':
            next.setMonth(next.getMonth() + 3);
            break;
        case 'annual':
            next.setFullYear(next.getFullYear() + 1);
            break;
    }
    return next;
}
async function checkDepartmentExistence(sequelize, departments, transaction) {
    const missing = [];
    for (const dept of departments) {
        const result = await sequelize.query(`SELECT COUNT(*) as count FROM cost_centers WHERE cost_center_code = :dept`, {
            replacements: { dept },
            type: 'SELECT',
            transaction,
        });
        if (result && result.length > 0 && result[0].count === 0) {
            missing.push(dept);
        }
    }
    return { allExist: missing.length === 0, missing };
}
//# sourceMappingURL=allocation-automation-rules-composite.js.map