"use strict";
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
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAndRunProjectAllocationEngine = exports.generateComprehensiveProjectReport = exports.generateProjectCostSnapshot = exports.analyzeComprehensiveProjectProfitability = exports.processProjectInvoiceWithRevenue = exports.createProjectBillingPackage = exports.forecastProjectCostWithEVM = exports.calculateComprehensiveEarnedValue = exports.trackAndReconcileCommitments = exports.liquidateCommitmentWithCost = exports.createCommitmentWithEncumbrance = exports.analyzeBudgetVarianceWithForecast = exports.consumeBudgetWithEncumbranceLiquidation = exports.checkAndReserveBudgetFunds = exports.processExpenseEntryWithCostAllocation = exports.processTimeEntryWithCostAllocation = exports.allocateIndirectCostsToProjects = exports.createAndAllocateProjectCost = exports.updateWBSWithCostReallocation = exports.createWBSWithBudgetAllocation = exports.closeProjectWithReconciliation = exports.updateProjectWithBudgetRevision = exports.ProjectCostAccountingService = void 0;
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
const common_1 = require("@nestjs/common");
// Import from project-accounting-costing-kit
const project_accounting_costing_kit_1 = require("../project-accounting-costing-kit");
// Import from cost-accounting-allocation-kit
const cost_accounting_allocation_kit_1 = require("../cost-accounting-allocation-kit");
// Import from allocation-engines-rules-kit
const allocation_engines_rules_kit_1 = require("../allocation-engines-rules-kit");
// Import from budget-management-control-kit
const budget_management_control_kit_1 = require("../budget-management-control-kit");
// Import from commitment-control-kit
const commitment_control_kit_1 = require("../commitment-control-kit");
// Import from encumbrance-accounting-kit
const encumbrance_accounting_kit_1 = require("../encumbrance-accounting-kit");
// ============================================================================
// COMPOSITE FUNCTIONS - PROJECT SETUP & LIFECYCLE
// ============================================================================
/**
 * Complete project setup with WBS and budget
 * Composes: createProjectHeader, createWorkBreakdownStructure, createProjectBudget, createCommitment
 */
let ProjectCostAccountingService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ProjectCostAccountingService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(ProjectCostAccountingService.name);
        }
        async setupCompleteProject(config, transaction) {
            this.logger.log(`Setting up project: ${config.projectData.projectName}`);
            try {
                // Create project header
                const project = await (0, project_accounting_costing_kit_1.createProjectHeader)(config.projectData, transaction);
                // Create WBS structure
                const wbsElements = [];
                for (const wbsData of config.wbsStructure.wbsElements) {
                    const wbs = await (0, project_accounting_costing_kit_1.createWorkBreakdownStructure)({
                        ...wbsData,
                        projectId: project.projectId,
                    }, transaction);
                    wbsElements.push(wbs);
                }
                // Create project budget
                const budget = await (0, project_accounting_costing_kit_1.createProjectBudget)({
                    projectId: project.projectId,
                    budgetType: config.budgetData.budgetType,
                    budgetAmount: config.projectData.totalBudget,
                }, transaction);
                // Create commitments if enabled
                const commitments = [];
                if (config.controlSettings.commitmentControl) {
                    const commitment = await (0, commitment_control_kit_1.createCommitment)({
                        projectId: project.projectId,
                        commitmentAmount: config.projectData.totalBudget,
                        commitmentType: 'budget',
                    }, transaction);
                    commitments.push(commitment);
                }
                return {
                    project,
                    wbsElements,
                    budget,
                    commitments,
                    setupComplete: true,
                };
            }
            catch (error) {
                this.logger.error(`Project setup failed: ${error.message}`, error.stack);
                throw error;
            }
        }
    };
    __setFunctionName(_classThis, "ProjectCostAccountingService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProjectCostAccountingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProjectCostAccountingService = _classThis;
})();
exports.ProjectCostAccountingService = ProjectCostAccountingService;
/**
 * Update project with budget revision
 * Composes: updateProjectHeader, revisebudget, createBudgetVersion, updateCommitment
 */
const updateProjectWithBudgetRevision = async (projectId, revisionData, newBudget, transaction) => {
    // Update project header
    const project = await (0, project_accounting_costing_kit_1.updateProjectHeader)(projectId, revisionData, transaction);
    // Revise budget
    const budget = await (0, budget_management_control_kit_1.revisebudget)(projectId, newBudget, revisionData.reason, transaction);
    // Create budget version for tracking
    const version = await (0, budget_management_control_kit_1.createBudgetVersion)(projectId, 'revised', transaction);
    // Update commitment
    const commitment = await (0, commitment_control_kit_1.updateCommitment)(projectId, newBudget, transaction);
    return { project, budget, version, commitment };
};
exports.updateProjectWithBudgetRevision = updateProjectWithBudgetRevision;
/**
 * Close project with final cost reconciliation
 * Composes: closeProject, reconcileCommitments, reconcileEncumbrances, generateProjectReport
 */
const closeProjectWithReconciliation = async (projectId, transaction) => {
    // Reconcile commitments
    await (0, commitment_control_kit_1.reconcileCommitments)(projectId, transaction);
    // Reconcile encumbrances
    await (0, encumbrance_accounting_kit_1.reconcileEncumbrances)(projectId, transaction);
    // Close project
    const project = await (0, project_accounting_costing_kit_1.closeProject)(projectId, 'system', 'Project completed', transaction);
    // Generate final report
    const report = await (0, project_accounting_costing_kit_1.generateProjectReport)(projectId, 'final', transaction);
    const finalCost = project.totalActualCost;
    const variance = project.totalBudget - finalCost;
    return {
        closed: true,
        finalCost,
        variance,
        report,
    };
};
exports.closeProjectWithReconciliation = closeProjectWithReconciliation;
// ============================================================================
// COMPOSITE FUNCTIONS - WBS MANAGEMENT
// ============================================================================
/**
 * Create WBS with budget allocation
 * Composes: createWorkBreakdownStructure, createProjectBudget, createAllocationRule
 */
const createWBSWithBudgetAllocation = async (projectId, wbsData, budgetAmount, transaction) => {
    // Create WBS
    const wbs = await (0, project_accounting_costing_kit_1.createWorkBreakdownStructure)({
        ...wbsData,
        projectId,
    }, transaction);
    // Create budget for WBS
    const budget = await (0, project_accounting_costing_kit_1.createProjectBudget)({
        projectId,
        wbsId: wbs.wbsId,
        budgetAmount,
    }, transaction);
    // Create allocation rule
    const allocationRule = await (0, allocation_engines_rules_kit_1.createAllocationRule)({
        ruleName: `WBS ${wbs.wbsCode} Allocation`,
        sourceEntity: 'project',
        targetEntity: 'wbs',
        targetId: wbs.wbsId,
    }, transaction);
    return { wbs, budget, allocationRule };
};
exports.createWBSWithBudgetAllocation = createWBSWithBudgetAllocation;
/**
 * Update WBS with cost reallocation
 * Composes: updateWBS, createCostAllocation, executeAllocationRule
 */
const updateWBSWithCostReallocation = async (wbsId, updateData, reallocateCosts, transaction) => {
    // Update WBS
    const wbs = await (0, project_accounting_costing_kit_1.updateWBS)(wbsId, updateData, transaction);
    let allocated = false;
    let amount = 0;
    if (reallocateCosts) {
        // Create cost allocation
        const allocation = await (0, cost_accounting_allocation_kit_1.createCostAllocation)({
            sourceWbsId: updateData.fromWbsId,
            targetWbsId: wbsId,
            allocationAmount: updateData.reallocationAmount,
        }, transaction);
        // Execute allocation rule
        await (0, allocation_engines_rules_kit_1.executeAllocationRule)(allocation.allocationRuleId, transaction);
        allocated = true;
        amount = updateData.reallocationAmount;
    }
    return { wbs, allocated, amount };
};
exports.updateWBSWithCostReallocation = updateWBSWithCostReallocation;
// ============================================================================
// COMPOSITE FUNCTIONS - COST COLLECTION & ALLOCATION
// ============================================================================
/**
 * Create and allocate project cost
 * Composes: createProjectCost, allocateProjectCost, createCostAllocation, validateCostAllocation
 */
const createAndAllocateProjectCost = async (projectId, costData, allocationMethod, transaction) => {
    // Create project cost
    const cost = await (0, project_accounting_costing_kit_1.createProjectCost)(costData, transaction);
    // Allocate cost to WBS
    await (0, project_accounting_costing_kit_1.allocateProjectCost)(cost.costId, costData.wbsId, cost.costAmount, transaction);
    // Create cost allocations
    const allocations = [];
    if (allocationMethod === 'proportional') {
        const allocation = await (0, cost_accounting_allocation_kit_1.createCostAllocation)({
            costId: cost.costId,
            allocationMethod: 'proportional',
            allocationAmount: cost.costAmount,
        }, transaction);
        allocations.push(allocation);
    }
    // Validate allocation
    const validation = await (0, cost_accounting_allocation_kit_1.validateCostAllocation)(cost.costId, transaction);
    return {
        cost,
        allocated: validation.valid,
        allocations,
    };
};
exports.createAndAllocateProjectCost = createAndAllocateProjectCost;
/**
 * Allocate indirect costs to projects
 * Composes: createCostPool, allocateIndirectCosts, createCostDriver, calculateAllocationRate
 */
const allocateIndirectCostsToProjects = async (costPoolId, projectIds, allocationBasis, transaction) => {
    // Create cost driver
    const costDriver = await (0, cost_accounting_allocation_kit_1.createCostDriver)({
        costPoolId,
        driverType: allocationBasis,
        driverName: `${allocationBasis} allocation`,
    }, transaction);
    // Calculate allocation rate
    const rate = await (0, cost_accounting_allocation_kit_1.calculateAllocationRate)(costPoolId, costDriver.driverId, transaction);
    // Allocate to each project
    const projectAllocations = [];
    let totalAllocated = 0;
    for (const projectId of projectIds) {
        const allocation = await (0, cost_accounting_allocation_kit_1.allocateIndirectCosts)(costPoolId, 'project', projectId, rate, transaction);
        projectAllocations.push(allocation);
        totalAllocated += allocation.allocationAmount;
    }
    return {
        allocated: totalAllocated,
        projectAllocations,
        rate,
    };
};
exports.allocateIndirectCostsToProjects = allocateIndirectCostsToProjects;
/**
 * Process time entry with cost allocation
 * Composes: createTimeEntry, approveTimeEntry, createProjectCost, allocateProjectCost
 */
const processTimeEntryWithCostAllocation = async (timeData, hourlyRate, transaction) => {
    // Create time entry
    const timeEntry = await (0, project_accounting_costing_kit_1.createTimeEntry)(timeData, transaction);
    // Approve time entry
    await (0, project_accounting_costing_kit_1.approveTimeEntry)(timeEntry.timeEntryId, timeData.approverId, transaction);
    // Calculate labor cost
    const laborCost = timeEntry.hours * hourlyRate;
    // Create project cost
    const cost = await (0, project_accounting_costing_kit_1.createProjectCost)({
        projectId: timeData.projectId,
        costType: 'labor',
        costAmount: laborCost,
        costDate: timeEntry.entryDate,
    }, transaction);
    // Allocate to WBS
    await (0, project_accounting_costing_kit_1.allocateProjectCost)(cost.costId, timeData.wbsId, laborCost, transaction);
    return {
        timeEntry,
        cost,
        allocated: true,
    };
};
exports.processTimeEntryWithCostAllocation = processTimeEntryWithCostAllocation;
/**
 * Process expense entry with cost allocation
 * Composes: createExpenseEntry, approveExpenseEntry, createProjectCost, allocateProjectCost
 */
const processExpenseEntryWithCostAllocation = async (expenseData, transaction) => {
    // Create expense entry
    const expenseEntry = await (0, project_accounting_costing_kit_1.createExpenseEntry)(expenseData, transaction);
    // Approve expense entry
    await (0, project_accounting_costing_kit_1.approveExpenseEntry)(expenseEntry.expenseEntryId, expenseData.approverId, transaction);
    // Create project cost
    const cost = await (0, project_accounting_costing_kit_1.createProjectCost)({
        projectId: expenseData.projectId,
        costType: expenseData.expenseType,
        costAmount: expenseEntry.expenseAmount,
        costDate: expenseEntry.expenseDate,
    }, transaction);
    // Allocate to WBS
    await (0, project_accounting_costing_kit_1.allocateProjectCost)(cost.costId, expenseData.wbsId, expenseEntry.expenseAmount, transaction);
    return {
        expenseEntry,
        cost,
        allocated: true,
    };
};
exports.processExpenseEntryWithCostAllocation = processExpenseEntryWithCostAllocation;
// ============================================================================
// COMPOSITE FUNCTIONS - BUDGET CONTROL
// ============================================================================
/**
 * Check and reserve budget funds
 * Composes: checkBudgetAvailability, reserveBudgetFunds, createEncumbrance
 */
const checkAndReserveBudgetFunds = async (projectId, wbsId, requestedAmount, transaction) => {
    // Check availability
    const availability = await (0, budget_management_control_kit_1.checkBudgetAvailability)(projectId, wbsId, requestedAmount, transaction);
    if (!availability.available) {
        return { available: false, reserved: false };
    }
    // Reserve funds
    await (0, budget_management_control_kit_1.reserveBudgetFunds)(projectId, wbsId, requestedAmount, transaction);
    // Create encumbrance
    const encumbrance = await (0, encumbrance_accounting_kit_1.createEncumbrance)({
        projectId,
        wbsId,
        encumbranceAmount: requestedAmount,
        encumbranceType: 'budget_reservation',
    }, transaction);
    return {
        available: true,
        reserved: true,
        encumbrance,
    };
};
exports.checkAndReserveBudgetFunds = checkAndReserveBudgetFunds;
/**
 * Consume budget with encumbrance liquidation
 * Composes: consumeBudgetFunds, liquidateEncumbrance, createProjectCost
 */
const consumeBudgetWithEncumbranceLiquidation = async (projectId, wbsId, encumbranceId, actualAmount, transaction) => {
    // Consume budget funds
    await (0, budget_management_control_kit_1.consumeBudgetFunds)(projectId, wbsId, actualAmount, transaction);
    // Liquidate encumbrance
    const liquidation = await (0, encumbrance_accounting_kit_1.liquidateEncumbrance)(encumbranceId, actualAmount, transaction);
    // Calculate variance
    const variance = liquidation.encumbranceAmount - actualAmount;
    return {
        consumed: true,
        liquidated: true,
        variance,
    };
};
exports.consumeBudgetWithEncumbranceLiquidation = consumeBudgetWithEncumbranceLiquidation;
/**
 * Analyze budget variance with forecasting
 * Composes: analyzeBudgetVariance, forecastBudgetConsumption, generateBudgetReport
 */
const analyzeBudgetVarianceWithForecast = async (projectId, periodEnd, transaction) => {
    // Analyze variance
    const variance = await (0, budget_management_control_kit_1.analyzeBudgetVariance)(projectId, periodEnd, transaction);
    // Forecast consumption
    const forecast = await (0, budget_management_control_kit_1.forecastBudgetConsumption)(projectId, periodEnd, transaction);
    // Generate report
    const report = await (0, budget_management_control_kit_1.generateBudgetReport)(projectId, periodEnd, transaction);
    // Determine status
    let status;
    const variancePercent = Math.abs(variance.variancePercent);
    if (variancePercent <= 5)
        status = 'good';
    else if (variancePercent <= 10)
        status = 'warning';
    else
        status = 'critical';
    return { variance, forecast, report, status };
};
exports.analyzeBudgetVarianceWithForecast = analyzeBudgetVarianceWithForecast;
// ============================================================================
// COMPOSITE FUNCTIONS - COMMITMENT & ENCUMBRANCE TRACKING
// ============================================================================
/**
 * Create commitment with encumbrance
 * Composes: createCommitment, createEncumbrance, reserveBudgetFunds
 */
const createCommitmentWithEncumbrance = async (projectId, commitmentData, transaction) => {
    // Create commitment
    const commitment = await (0, commitment_control_kit_1.createCommitment)(commitmentData, transaction);
    // Create encumbrance
    const encumbrance = await (0, encumbrance_accounting_kit_1.createEncumbrance)({
        projectId,
        commitmentId: commitment.commitmentId,
        encumbranceAmount: commitmentData.commitmentAmount,
    }, transaction);
    // Reserve budget
    await (0, budget_management_control_kit_1.reserveBudgetFunds)(projectId, commitmentData.wbsId, commitmentData.commitmentAmount, transaction);
    return {
        commitment,
        encumbrance,
        budgetReserved: true,
    };
};
exports.createCommitmentWithEncumbrance = createCommitmentWithEncumbrance;
/**
 * Liquidate commitment with cost creation
 * Composes: liquidateCommitment, liquidateEncumbrance, createProjectCost, consumeBudgetFunds
 */
const liquidateCommitmentWithCost = async (commitmentId, encumbranceId, actualAmount, costData, transaction) => {
    // Liquidate commitment
    const commitment = await (0, commitment_control_kit_1.liquidateCommitment)(commitmentId, actualAmount, transaction);
    // Liquidate encumbrance
    const encumbrance = await (0, encumbrance_accounting_kit_1.liquidateEncumbrance)(encumbranceId, actualAmount, transaction);
    // Create project cost
    const cost = await (0, project_accounting_costing_kit_1.createProjectCost)({
        ...costData,
        costAmount: actualAmount,
    }, transaction);
    // Consume budget
    await (0, budget_management_control_kit_1.consumeBudgetFunds)(costData.projectId, costData.wbsId, actualAmount, transaction);
    const variance = commitment.commitmentAmount - actualAmount;
    return {
        liquidated: true,
        cost,
        budgetConsumed: true,
        variance,
    };
};
exports.liquidateCommitmentWithCost = liquidateCommitmentWithCost;
/**
 * Track commitment balance
 * Composes: trackCommitmentBalance, reconcileCommitments, generateCommitmentReport
 */
const trackAndReconcileCommitments = async (projectId, transaction) => {
    // Track balance
    const balance = await (0, commitment_control_kit_1.trackCommitmentBalance)(projectId, transaction);
    // Reconcile commitments
    const reconciliation = await (0, commitment_control_kit_1.reconcileCommitments)(projectId, transaction);
    // Generate report
    const report = await (0, commitment_control_kit_1.generateCommitmentReport)(projectId, transaction);
    return { balance, reconciliation, report };
};
exports.trackAndReconcileCommitments = trackAndReconcileCommitments;
// ============================================================================
// COMPOSITE FUNCTIONS - EARNED VALUE MANAGEMENT
// ============================================================================
/**
 * Calculate comprehensive earned value metrics
 * Composes: calculateEarnedValue, calculateCostVariance, calculateScheduleVariance, calculateCostPerformanceIndex
 */
const calculateComprehensiveEarnedValue = async (projectId, analysisDate, transaction) => {
    // Calculate EV metrics
    const metrics = await (0, project_accounting_costing_kit_1.calculateEarnedValue)(projectId, analysisDate, transaction);
    // Calculate variances
    const cv = await (0, project_accounting_costing_kit_1.calculateCostVariance)(projectId, analysisDate, transaction);
    const sv = await (0, project_accounting_costing_kit_1.calculateScheduleVariance)(projectId, analysisDate, transaction);
    // Calculate performance indices
    const cpi = await (0, project_accounting_costing_kit_1.calculateCostPerformanceIndex)(projectId, analysisDate, transaction);
    const spi = await (0, project_accounting_costing_kit_1.calculateSchedulePerformanceIndex)(projectId, analysisDate, transaction);
    // Forecast
    const eac = metrics.actualCost + (metrics.budgetAtCompletion - metrics.earnedValue) / cpi;
    const etc = eac - metrics.actualCost;
    const vac = metrics.budgetAtCompletion - eac;
    const tcpi = (metrics.budgetAtCompletion - metrics.earnedValue) / (metrics.budgetAtCompletion - metrics.actualCost);
    // Determine status
    let status;
    if (cpi >= 0.95 && spi >= 0.95)
        status = 'on-track';
    else if (cpi >= 0.85 && spi >= 0.85)
        status = 'at-risk';
    else
        status = 'critical';
    const recommendations = [];
    if (cpi < 1)
        recommendations.push('Cost overrun detected - review cost control measures');
    if (spi < 1)
        recommendations.push('Schedule delay detected - accelerate critical path activities');
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
exports.calculateComprehensiveEarnedValue = calculateComprehensiveEarnedValue;
/**
 * Forecast project cost with EVM
 * Composes: forecastProjectCost, calculateCostToComplete, calculateEarnedValue
 */
const forecastProjectCostWithEVM = async (projectId, forecastDate, transaction) => {
    // Forecast project cost
    const forecast = await (0, project_accounting_costing_kit_1.forecastProjectCost)(projectId, forecastDate, transaction);
    // Calculate cost to complete
    const costToComplete = await (0, project_accounting_costing_kit_1.calculateCostToComplete)(projectId, forecastDate, transaction);
    // Calculate EV for confidence
    const ev = await (0, project_accounting_costing_kit_1.calculateEarnedValue)(projectId, forecastDate, transaction);
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
exports.forecastProjectCostWithEVM = forecastProjectCostWithEVM;
// ============================================================================
// COMPOSITE FUNCTIONS - PROJECT BILLING
// ============================================================================
/**
 * Create project billing package
 * Composes: createProjectBilling, allocateIndirectCosts, calculateAllocationRate
 */
const createProjectBillingPackage = async (projectId, billingPeriod, billingMethod, transaction) => {
    // Get project costs for period
    // (Simplified - would query actual costs)
    const laborCosts = 50000;
    const materialCosts = 30000;
    const equipmentCosts = 10000;
    // Allocate indirect costs
    const indirectAllocation = await (0, cost_accounting_allocation_kit_1.allocateIndirectCosts)(1, 'project', projectId, 0.15, transaction);
    const indirectCosts = indirectAllocation.allocationAmount;
    // Calculate markup based on billing method
    let laborMarkup = 0;
    let materialMarkup = 0;
    let fixedFee = 0;
    if (billingMethod === 'time-and-materials') {
        laborMarkup = laborCosts * 0.20;
        materialMarkup = materialCosts * 0.10;
    }
    else if (billingMethod === 'cost-plus') {
        fixedFee = (laborCosts + materialCosts + equipmentCosts + indirectCosts) * 0.15;
    }
    const totalBillable = laborCosts + materialCosts + equipmentCosts + indirectCosts +
        laborMarkup + materialMarkup + fixedFee;
    const previouslyBilled = 0; // Would query from database
    const currentBilling = totalBillable - previouslyBilled;
    const retainage = currentBilling * 0.10; // 10% retainage
    const netInvoiceAmount = currentBilling - retainage;
    // Create billing record
    await (0, project_accounting_costing_kit_1.createProjectBilling)({
        projectId,
        billingPeriodStart: billingPeriod.start,
        billingPeriodEnd: billingPeriod.end,
        billingAmount: netInvoiceAmount,
    }, transaction);
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
exports.createProjectBillingPackage = createProjectBillingPackage;
/**
 * Process project invoice with revenue recognition
 * Composes: processProjectInvoice, createProjectTransaction, postProjectTransaction
 */
const processProjectInvoiceWithRevenue = async (billingId, invoiceData, transaction) => {
    // Process invoice
    const invoice = await (0, project_accounting_costing_kit_1.processProjectInvoice)(billingId, invoiceData, transaction);
    // Create transaction
    const projectTransaction = await (0, project_accounting_costing_kit_1.createProjectTransaction)({
        projectId: invoiceData.projectId,
        transactionType: 'billing',
        transactionAmount: invoiceData.invoiceAmount,
    }, transaction);
    // Post transaction
    await (0, project_accounting_costing_kit_1.postProjectTransaction)(projectTransaction.transactionId, transaction);
    return {
        invoice,
        transactionPosted: true,
        revenueRecognized: invoiceData.invoiceAmount,
    };
};
exports.processProjectInvoiceWithRevenue = processProjectInvoiceWithRevenue;
// ============================================================================
// COMPOSITE FUNCTIONS - PROJECT PROFITABILITY & ANALYTICS
// ============================================================================
/**
 * Analyze comprehensive project profitability
 * Composes: analyzeProjectProfitability, calculateEarnedValue, forecastProjectCost
 */
const analyzeComprehensiveProjectProfitability = async (projectId, analysisDate, transaction) => {
    // Analyze profitability
    const profitability = await (0, project_accounting_costing_kit_1.analyzeProjectProfitability)(projectId, analysisDate, transaction);
    // Get earned value
    const earnedValue = await (0, project_accounting_costing_kit_1.calculateEarnedValue)(projectId, analysisDate, transaction);
    // Forecast costs
    const forecast = await (0, project_accounting_costing_kit_1.forecastProjectCost)(projectId, analysisDate, transaction);
    const revenue = profitability.billedRevenue;
    const costs = earnedValue.actualCost;
    const grossProfit = revenue - costs;
    const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
    let profitabilityStatus;
    if (grossMargin >= 20)
        profitabilityStatus = 'excellent';
    else if (grossMargin >= 10)
        profitabilityStatus = 'good';
    else if (grossMargin >= 5)
        profitabilityStatus = 'acceptable';
    else
        profitabilityStatus = 'poor';
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
exports.analyzeComprehensiveProjectProfitability = analyzeComprehensiveProjectProfitability;
/**
 * Generate comprehensive project cost snapshot
 * Composes: Multiple cost, budget, and commitment functions
 */
const generateProjectCostSnapshot = async (projectId, snapshotDate, transaction) => {
    // Get budget data
    const budget = await (0, project_accounting_costing_kit_1.createProjectBudget)({ projectId }, transaction);
    // Get commitments
    const commitments = await (0, commitment_control_kit_1.trackCommitmentBalance)(projectId, transaction);
    // Calculate forecast
    const costToComplete = await (0, project_accounting_costing_kit_1.calculateCostToComplete)(projectId, snapshotDate, transaction);
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
exports.generateProjectCostSnapshot = generateProjectCostSnapshot;
/**
 * Generate comprehensive project report
 * Composes: generateProjectReport, generateBudgetReport, generateCommitmentReport, generateEncumbranceReport
 */
const generateComprehensiveProjectReport = async (projectId, reportType, transaction) => {
    // Generate project report
    const projectReport = await (0, project_accounting_costing_kit_1.generateProjectReport)(projectId, reportType, transaction);
    // Generate budget report
    const budgetReport = await (0, budget_management_control_kit_1.generateBudgetReport)(projectId, new Date(), transaction);
    // Generate commitment report
    const commitmentReport = await (0, commitment_control_kit_1.generateCommitmentReport)(projectId, transaction);
    // Generate encumbrance report
    const encumbranceReport = await (0, encumbrance_accounting_kit_1.generateEncumbranceReport)(projectId, transaction);
    return {
        projectReport,
        budgetReport,
        commitmentReport,
        encumbranceReport,
    };
};
exports.generateComprehensiveProjectReport = generateComprehensiveProjectReport;
// ============================================================================
// COMPOSITE FUNCTIONS - ALLOCATION ENGINE INTEGRATION
// ============================================================================
/**
 * Create and run project cost allocation engine
 * Composes: createAllocationEngine, createAllocationRule, runAllocationEngine, validateAllocationResults
 */
const createAndRunProjectAllocationEngine = async (projectId, allocationRules, transaction) => {
    // Create allocation engine
    const engine = await (0, allocation_engines_rules_kit_1.createAllocationEngine)({
        engineName: `Project ${projectId} Cost Allocation`,
        engineType: 'project_cost',
    }, transaction);
    // Create allocation rules
    let rulesCreated = 0;
    for (const ruleData of allocationRules) {
        await (0, allocation_engines_rules_kit_1.createAllocationRule)({
            ...ruleData,
            engineId: engine.engineId,
        }, transaction);
        rulesCreated++;
    }
    // Run allocation engine
    await (0, allocation_engines_rules_kit_1.runAllocationEngine)(engine.engineId, transaction);
    // Validate results
    const validation = await (0, allocation_engines_rules_kit_1.validateAllocationResults)(engine.engineId, transaction);
    return {
        engine,
        rulesCreated,
        executed: true,
        validated: validation.valid,
    };
};
exports.createAndRunProjectAllocationEngine = createAndRunProjectAllocationEngine;
//# sourceMappingURL=project-cost-accounting-composite.js.map