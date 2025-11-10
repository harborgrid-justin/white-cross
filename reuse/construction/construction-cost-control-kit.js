"use strict";
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
exports.CostControlService = exports.generateContingencyReport = exports.forecastContingencyAdequacy = exports.analyzeContingencyUtilization = exports.drawContingency = exports.manageContingency = exports.generateChangeOrderLog = exports.calculateChangeOrderImpact = exports.incorporateChangeOrder = exports.approveChangeOrder = exports.createChangeOrder = exports.reconcileIndirectCosts = exports.trackIndirectCostBurnRate = exports.distributeGeneralConditions = exports.calculateOverheadRate = exports.allocateIndirectCosts = exports.simulateWhatIfScenario = exports.analyzeCostTrends = exports.calculateEstimateToComplete = exports.projectCashFlow = exports.generateCostForecast = exports.exportVarianceAnalysisPDF = exports.trackVarianceTrends = exports.generateVarianceReportByCategory = exports.performVarianceRootCauseAnalysis = exports.identifySignificantVariances = exports.generateEVMTrendAnalysis = exports.calculateEAC = exports.calculateCPI = exports.calculateSPI = exports.calculateEarnedValueMetrics = exports.updatePercentComplete = exports.getCostsByCategory = exports.calculateCostVariance = exports.recordCommittedCost = exports.recordActualCost = exports.exportBudgetReport = exports.transferBudget = exports.getBudgetSummary = exports.allocateBudgetByCategory = exports.createBudgetFromEstimate = exports.setEstimateAsBaseline = exports.reviseEstimate = exports.calculateContingency = exports.validateEstimateData = exports.createCostEstimate = void 0;
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
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
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
const createCostEstimate = async (estimateData, CostEstimate, transaction) => {
    const contingencyPercent = (estimateData.contingency / estimateData.totalEstimatedCost) * 100;
    const estimate = await CostEstimate.create({
        ...estimateData,
        contingencyPercent,
        revisionNumber: 0,
    }, { transaction });
    return estimate;
};
exports.createCostEstimate = createCostEstimate;
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
const validateEstimateData = async (estimateData) => {
    const errors = [];
    if (!estimateData.projectId)
        errors.push('Project ID is required');
    if (!estimateData.estimateNumber)
        errors.push('Estimate number is required');
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
exports.validateEstimateData = validateEstimateData;
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
const calculateContingency = (baseCost, projectType, complexity) => {
    let contingencyPercent = 5; // Default 5%
    // Adjust based on project type
    if (projectType === 'healthcare')
        contingencyPercent += 2;
    if (projectType === 'industrial')
        contingencyPercent += 3;
    if (projectType === 'infrastructure')
        contingencyPercent += 4;
    // Adjust based on complexity
    if (complexity === 'medium')
        contingencyPercent += 2;
    if (complexity === 'high')
        contingencyPercent += 5;
    if (complexity === 'critical')
        contingencyPercent += 8;
    const contingencyAmount = baseCost * (contingencyPercent / 100);
    return {
        contingencyAmount,
        contingencyPercent,
    };
};
exports.calculateContingency = calculateContingency;
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
const reviseEstimate = async (estimateId, updates, revisionReason, CostEstimate) => {
    const estimate = await CostEstimate.findByPk(estimateId);
    if (!estimate)
        throw new Error('Estimate not found');
    estimate.revisedEstimate = updates.totalEstimatedCost || estimate.totalEstimatedCost;
    estimate.revisionNumber += 1;
    estimate.revisionReason = revisionReason;
    if (updates.directCosts !== undefined)
        estimate.directCosts = updates.directCosts;
    if (updates.indirectCosts !== undefined)
        estimate.indirectCosts = updates.indirectCosts;
    if (updates.contingency !== undefined)
        estimate.contingency = updates.contingency;
    await estimate.save();
    return estimate;
};
exports.reviseEstimate = reviseEstimate;
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
const setEstimateAsBaseline = async (estimateId, approvedBy, CostEstimate) => {
    const estimate = await CostEstimate.findByPk(estimateId);
    if (!estimate)
        throw new Error('Estimate not found');
    estimate.status = 'baseline';
    estimate.baselineDate = new Date();
    estimate.approvedBy = approvedBy;
    estimate.approvalDate = new Date();
    await estimate.save();
    return estimate;
};
exports.setEstimateAsBaseline = setEstimateAsBaseline;
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
const createBudgetFromEstimate = async (estimateId, lineItems, CostEstimate, CostTracking, transaction) => {
    const estimate = await CostEstimate.findByPk(estimateId);
    if (!estimate)
        throw new Error('Estimate not found');
    const budgetItems = [];
    for (const item of lineItems) {
        const tracking = await CostTracking.create({
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
        }, { transaction });
        budgetItems.push(tracking);
    }
    return budgetItems;
};
exports.createBudgetFromEstimate = createBudgetFromEstimate;
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
const allocateBudgetByCategory = (projectId, totalBudget, allocation) => {
    const items = [];
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
exports.allocateBudgetByCategory = allocateBudgetByCategory;
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
const getBudgetSummary = async (projectId, CostTracking) => {
    const items = await CostTracking.findAll({
        where: { projectId },
    });
    const summary = items.reduce((acc, item) => {
        acc.totalBudget += parseFloat(item.budgetedCost);
        acc.totalCommitted += parseFloat(item.committedCost);
        acc.totalActual += parseFloat(item.actualCost);
        acc.totalProjected += parseFloat(item.projectedCost);
        acc.totalVariance += parseFloat(item.costVariance);
        return acc;
    }, { totalBudget: 0, totalCommitted: 0, totalActual: 0, totalProjected: 0, totalVariance: 0 });
    summary.variancePercent = summary.totalBudget > 0 ? (summary.totalVariance / summary.totalBudget) * 100 : 0;
    return summary;
};
exports.getBudgetSummary = getBudgetSummary;
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
const transferBudget = async (fromCostCodeId, toCostCodeId, amount, reason, CostTracking) => {
    const fromCode = await CostTracking.findOne({ where: { costCodeId: fromCostCodeId } });
    const toCode = await CostTracking.findOne({ where: { costCodeId: toCostCodeId } });
    if (!fromCode || !toCode)
        throw new Error('Cost code not found');
    if (fromCode.budgetedCost < amount)
        throw new Error('Insufficient budget');
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
exports.transferBudget = transferBudget;
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
const exportBudgetReport = async (projectId, CostTracking) => {
    const items = await CostTracking.findAll({
        where: { projectId },
        order: [['costCode', 'ASC']],
    });
    const headers = 'Cost Code,Description,Category,Budgeted,Committed,Actual,Projected,Variance,Variance %\n';
    const rows = items.map((item) => `${item.costCode},"${item.description}",${item.category},${item.budgetedCost},${item.committedCost},${item.actualCost},${item.projectedCost},${item.costVariance},${item.variancePercent}`);
    return headers + rows.join('\n');
};
exports.exportBudgetReport = exportBudgetReport;
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
const recordActualCost = async (costData, CostTracking, transaction) => {
    const tracking = await CostTracking.findOne({
        where: {
            projectId: costData.projectId,
            costCodeId: costData.costCodeId,
        },
    });
    if (!tracking)
        throw new Error('Cost code not found in tracking');
    tracking.actualCost += costData.totalCost;
    tracking.costVariance = tracking.budgetedCost - tracking.actualCost;
    tracking.variancePercent = tracking.budgetedCost > 0 ? (tracking.costVariance / tracking.budgetedCost) * 100 : 0;
    await tracking.save({ transaction });
    return tracking;
};
exports.recordActualCost = recordActualCost;
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
const recordCommittedCost = async (commitmentData, CostTracking, transaction) => {
    const tracking = await CostTracking.findOne({
        where: {
            projectId: commitmentData.projectId,
            costCodeId: commitmentData.costCodeId,
        },
    });
    if (!tracking)
        throw new Error('Cost code not found in tracking');
    tracking.committedCost += commitmentData.committedAmount;
    await tracking.save({ transaction });
    return tracking;
};
exports.recordCommittedCost = recordCommittedCost;
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
const calculateCostVariance = async (projectId, CostTracking) => {
    const items = await CostTracking.findAll({
        where: { projectId },
    });
    return items.map((item) => {
        const variance = parseFloat(item.budgetedCost) - parseFloat(item.actualCost);
        const variancePercent = item.budgetedCost > 0 ? (variance / parseFloat(item.budgetedCost)) * 100 : 0;
        let variantType = 'neutral';
        if (variance > 0)
            variantType = 'favorable';
        if (variance < 0)
            variantType = 'unfavorable';
        let impact = 'low';
        if (Math.abs(variancePercent) > 5)
            impact = 'medium';
        if (Math.abs(variancePercent) > 10)
            impact = 'high';
        if (Math.abs(variancePercent) > 20)
            impact = 'critical';
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
exports.calculateCostVariance = calculateCostVariance;
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
const getCostsByCategory = async (projectId, category, CostTracking) => {
    return await CostTracking.findAll({
        where: {
            projectId,
            category,
        },
        order: [['costCode', 'ASC']],
    });
};
exports.getCostsByCategory = getCostsByCategory;
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
const updatePercentComplete = async (costCodeId, percentComplete, CostTracking) => {
    const tracking = await CostTracking.findOne({ where: { costCodeId } });
    if (!tracking)
        throw new Error('Cost code not found');
    tracking.percentComplete = percentComplete;
    tracking.earnedValue = (tracking.budgetedCost * percentComplete) / 100;
    tracking.costPerformanceIndex = tracking.actualCost > 0 ? tracking.earnedValue / tracking.actualCost : 1;
    tracking.estimateAtCompletion = tracking.costPerformanceIndex > 0 ? tracking.budgetedCost / tracking.costPerformanceIndex : tracking.budgetedCost;
    tracking.estimateToComplete = tracking.estimateAtCompletion - tracking.actualCost;
    await tracking.save();
    return tracking;
};
exports.updatePercentComplete = updatePercentComplete;
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
const calculateEarnedValueMetrics = async (projectId, periodEndDate, CostTracking) => {
    const items = await CostTracking.findAll({
        where: { projectId },
    });
    const budgetAtCompletion = items.reduce((sum, item) => sum + parseFloat(item.budgetedCost), 0);
    const plannedValue = items.reduce((sum, item) => sum + parseFloat(item.budgetedCost) * 0.5, 0); // Simplified
    const earnedValue = items.reduce((sum, item) => sum + parseFloat(item.earnedValue), 0);
    const actualCost = items.reduce((sum, item) => sum + parseFloat(item.actualCost), 0);
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
exports.calculateEarnedValueMetrics = calculateEarnedValueMetrics;
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
const calculateSPI = (earnedValue, plannedValue) => {
    return plannedValue > 0 ? earnedValue / plannedValue : 1;
};
exports.calculateSPI = calculateSPI;
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
const calculateCPI = (earnedValue, actualCost) => {
    return actualCost > 0 ? earnedValue / actualCost : 1;
};
exports.calculateCPI = calculateCPI;
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
const calculateEAC = (budgetAtCompletion, costPerformanceIndex) => {
    return costPerformanceIndex > 0 ? budgetAtCompletion / costPerformanceIndex : budgetAtCompletion;
};
exports.calculateEAC = calculateEAC;
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
const generateEVMTrendAnalysis = async (projectId, startDate, endDate, CostTracking) => {
    const items = await CostTracking.findAll({
        where: {
            projectId,
            transactionDate: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
        order: [['transactionDate', 'ASC']],
    });
    const trendData = [];
    let cumulativeEV = 0;
    let cumulativeAC = 0;
    let cumulativePV = 0;
    items.forEach((item) => {
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
exports.generateEVMTrendAnalysis = generateEVMTrendAnalysis;
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
const identifySignificantVariances = async (projectId, thresholdPercent, CostTracking) => {
    const allVariances = await (0, exports.calculateCostVariance)(projectId, CostTracking);
    return allVariances.filter((v) => Math.abs(v.variancePercent) > thresholdPercent);
};
exports.identifySignificantVariances = identifySignificantVariances;
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
const performVarianceRootCauseAnalysis = async (variance, historicalData) => {
    const rootCauses = [];
    const recommendations = [];
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
exports.performVarianceRootCauseAnalysis = performVarianceRootCauseAnalysis;
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
const generateVarianceReportByCategory = async (projectId, CostTracking) => {
    const allVariances = await (0, exports.calculateCostVariance)(projectId, CostTracking);
    const byCategory = new Map();
    for (const variance of allVariances) {
        const tracking = await CostTracking.findOne({ where: { costCodeId: variance.costCodeId } });
        const category = tracking?.category || 'other';
        if (!byCategory.has(category)) {
            byCategory.set(category, []);
        }
        byCategory.get(category).push(variance);
    }
    return byCategory;
};
exports.generateVarianceReportByCategory = generateVarianceReportByCategory;
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
const trackVarianceTrends = async (projectId, numberOfPeriods, CostTracking) => {
    const trends = [];
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
        const totalVariance = items.reduce((sum, item) => sum + parseFloat(item.costVariance), 0);
        const avgVariancePercent = items.length > 0
            ? items.reduce((sum, item) => sum + parseFloat(item.variancePercent), 0) / items.length
            : 0;
        trends.push({
            period: `${periodEnd.getFullYear()}-${String(periodEnd.getMonth() + 1).padStart(2, '0')}`,
            totalVariance,
            avgVariancePercent,
        });
    }
    return trends.reverse();
};
exports.trackVarianceTrends = trackVarianceTrends;
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
const exportVarianceAnalysisPDF = async (projectId, variances) => {
    // TODO: Integrate with PDF generation library
    return Buffer.from('PDF content placeholder');
};
exports.exportVarianceAnalysisPDF = exportVarianceAnalysisPDF;
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
const generateCostForecast = async (projectId, CostTracking) => {
    const items = await CostTracking.findAll({
        where: { projectId },
    });
    return items.map((item) => ({
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
exports.generateCostForecast = generateCostForecast;
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
const projectCashFlow = async (projectId, numberOfMonths, CostTracking) => {
    const projections = [];
    const summary = await (0, exports.getBudgetSummary)(projectId, CostTracking);
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
exports.projectCashFlow = projectCashFlow;
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
const calculateEstimateToComplete = (budgetAtCompletion, earnedValue, actualCost, method = 'cpi') => {
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
exports.calculateEstimateToComplete = calculateEstimateToComplete;
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
const analyzeCostTrends = async (projectId, CostTracking) => {
    const items = await CostTracking.findAll({
        where: { projectId },
    });
    const avgCostVariance = items.reduce((sum, item) => sum + parseFloat(item.costVariance), 0) / items.length;
    const avgCPI = items.reduce((sum, item) => sum + parseFloat(item.costPerformanceIndex), 0) / items.length;
    const avgSPI = 1.0; // Simplified
    let trendDirection = 'stable';
    if (avgCPI > 1.05)
        trendDirection = 'improving';
    if (avgCPI < 0.95)
        trendDirection = 'degrading';
    let riskLevel = 'low';
    if (avgCPI < 0.90 || avgCostVariance < -100000)
        riskLevel = 'medium';
    if (avgCPI < 0.80 || avgCostVariance < -500000)
        riskLevel = 'high';
    const recommendations = [];
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
exports.analyzeCostTrends = analyzeCostTrends;
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
const simulateWhatIfScenario = async (projectId, costChanges, CostTracking) => {
    const currentSummary = await (0, exports.getBudgetSummary)(projectId, CostTracking);
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
exports.simulateWhatIfScenario = simulateWhatIfScenario;
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
const allocateIndirectCosts = async (allocationData, CostTracking) => {
    const items = await CostTracking.findAll({
        where: { projectId: allocationData.projectId },
    });
    const totalDirectCost = items.reduce((sum, item) => sum + parseFloat(item.actualCost), 0);
    const allocations = items.map((item) => {
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
exports.allocateIndirectCosts = allocateIndirectCosts;
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
const calculateOverheadRate = (totalOverhead, totalDirectCosts) => {
    return totalDirectCosts > 0 ? (totalOverhead / totalDirectCosts) * 100 : 0;
};
exports.calculateOverheadRate = calculateOverheadRate;
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
const distributeGeneralConditions = async (projectId, totalGeneralConditions, distributionMethod, CostTracking) => {
    const items = await CostTracking.findAll({
        where: { projectId },
    });
    const totalBudget = items.reduce((sum, item) => sum + parseFloat(item.budgetedCost), 0);
    return items.map((item) => {
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
exports.distributeGeneralConditions = distributeGeneralConditions;
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
const trackIndirectCostBurnRate = async (projectId, indirectCostType, CostTracking) => {
    const items = await CostTracking.findAll({
        where: {
            projectId,
            category: 'indirect',
        },
        order: [['transactionDate', 'ASC']],
    });
    const burnData = [];
    let cumulativeCost = 0;
    items.forEach((item) => {
        cumulativeCost += parseFloat(item.actualCost);
        burnData.push({
            date: item.transactionDate,
            periodCost: parseFloat(item.actualCost),
            cumulativeCost,
        });
    });
    return burnData;
};
exports.trackIndirectCostBurnRate = trackIndirectCostBurnRate;
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
const reconcileIndirectCosts = async (projectId, allocationPeriod, CostTracking) => {
    const indirectItems = await CostTracking.findAll({
        where: {
            projectId,
            category: 'indirect',
        },
    });
    const allocatedTotal = indirectItems.reduce((sum, item) => sum + parseFloat(item.budgetedCost), 0);
    const actualTotal = indirectItems.reduce((sum, item) => sum + parseFloat(item.actualCost), 0);
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
exports.reconcileIndirectCosts = reconcileIndirectCosts;
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
const createChangeOrder = async (changeOrderData, ChangeOrder, transaction) => {
    const changeOrder = await ChangeOrder.create({
        ...changeOrderData,
        status: 'pending',
        originalEstimate: changeOrderData.costImpact,
        revisedEstimate: changeOrderData.costImpact,
    }, { transaction });
    return changeOrder;
};
exports.createChangeOrder = createChangeOrder;
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
const approveChangeOrder = async (changeOrderId, approvedBy, ChangeOrder, CostTracking) => {
    const changeOrder = await ChangeOrder.findByPk(changeOrderId);
    if (!changeOrder)
        throw new Error('Change order not found');
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
exports.approveChangeOrder = approveChangeOrder;
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
const incorporateChangeOrder = async (changeOrderId, ChangeOrder, CostEstimate) => {
    const changeOrder = await ChangeOrder.findByPk(changeOrderId);
    if (!changeOrder)
        throw new Error('Change order not found');
    if (changeOrder.status !== 'approved')
        throw new Error('Change order not approved');
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
exports.incorporateChangeOrder = incorporateChangeOrder;
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
const calculateChangeOrderImpact = async (projectId, ChangeOrder) => {
    const changeOrders = await ChangeOrder.findAll({
        where: { projectId },
    });
    const totalCostImpact = changeOrders.reduce((sum, co) => {
        if (co.status === 'approved' || co.status === 'incorporated') {
            return sum + parseFloat(co.costImpact);
        }
        return sum;
    }, 0);
    const totalScheduleImpact = changeOrders.reduce((sum, co) => {
        if (co.status === 'approved' || co.status === 'incorporated') {
            return sum + co.scheduleImpact;
        }
        return sum;
    }, 0);
    return {
        projectId,
        totalChangeOrders: changeOrders.length,
        approvedChangeOrders: changeOrders.filter((co) => co.status === 'approved' || co.status === 'incorporated').length,
        totalCostImpact,
        totalScheduleImpact,
        pendingChangeOrders: changeOrders.filter((co) => co.status === 'pending').length,
    };
};
exports.calculateChangeOrderImpact = calculateChangeOrderImpact;
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
const generateChangeOrderLog = async (projectId, ChangeOrder) => {
    const changeOrders = await ChangeOrder.findAll({
        where: { projectId },
        order: [['changeOrderNumber', 'ASC']],
    });
    const headers = 'CO Number,Date,Requested By,Description,Cost Impact,Schedule Impact,Status,Approved By,Approval Date\n';
    const rows = changeOrders.map((co) => `${co.changeOrderNumber},${co.changeOrderDate.toISOString().split('T')[0]},"${co.requestedBy}","${co.description}",${co.costImpact},${co.scheduleImpact},${co.status},"${co.approvedBy || ''}","${co.approvalDate ? co.approvalDate.toISOString().split('T')[0] : ''}"`);
    return headers + rows.join('\n');
};
exports.generateChangeOrderLog = generateChangeOrderLog;
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
const manageContingency = async (projectId, CostEstimate) => {
    const estimate = await CostEstimate.findOne({
        where: {
            projectId,
            status: 'baseline',
        },
    });
    if (!estimate)
        throw new Error('Baseline estimate not found');
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
exports.manageContingency = manageContingency;
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
const drawContingency = async (projectId, amount, reason, approvedBy, CostEstimate) => {
    const estimate = await CostEstimate.findOne({
        where: {
            projectId,
            status: 'baseline',
        },
    });
    if (!estimate)
        throw new Error('Baseline estimate not found');
    const currentContingency = parseFloat(estimate.contingency);
    if (amount > currentContingency)
        throw new Error('Insufficient contingency');
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
exports.drawContingency = drawContingency;
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
const analyzeContingencyUtilization = async (projectId, CostEstimate) => {
    const estimate = await CostEstimate.findOne({
        where: {
            projectId,
            status: 'baseline',
        },
    });
    if (!estimate)
        throw new Error('Baseline estimate not found');
    const drawdowns = estimate.metadata?.drawdowns || [];
    const totalDrawn = drawdowns.reduce((sum, d) => sum + d.amount, 0);
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
exports.analyzeContingencyUtilization = analyzeContingencyUtilization;
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
const forecastContingencyAdequacy = async (projectId, projectCompletion, CostEstimate) => {
    const contingency = await (0, exports.manageContingency)(projectId, CostEstimate);
    const expectedUtilization = projectCompletion;
    const actualUtilization = contingency.utilizationPercent;
    const utilizationVariance = actualUtilization - expectedUtilization;
    let adequate = true;
    let recommendation = 'Contingency utilization is on track';
    if (utilizationVariance > 20) {
        adequate = false;
        recommendation = 'Contingency burn rate is too high - review and implement cost controls';
    }
    else if (utilizationVariance > 10) {
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
exports.forecastContingencyAdequacy = forecastContingencyAdequacy;
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
const generateContingencyReport = async (projectId, CostEstimate) => {
    const contingency = await (0, exports.manageContingency)(projectId, CostEstimate);
    const analysis = await (0, exports.analyzeContingencyUtilization)(projectId, CostEstimate);
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
exports.generateContingencyReport = generateContingencyReport;
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
let CostControlService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CostControlService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
        }
        async createEstimate(data) {
            const CostEstimate = createCostEstimateModel(this.sequelize);
            return (0, exports.createCostEstimate)(data, CostEstimate);
        }
        async calculateEVM(projectId, periodEndDate) {
            const CostTracking = createCostTrackingModel(this.sequelize);
            return (0, exports.calculateEarnedValueMetrics)(projectId, periodEndDate, CostTracking);
        }
        async generateForecast(projectId) {
            const CostTracking = createCostTrackingModel(this.sequelize);
            return (0, exports.generateCostForecast)(projectId, CostTracking);
        }
        async manageChangeOrders(projectId) {
            const ChangeOrder = createChangeOrderModel(this.sequelize);
            return (0, exports.calculateChangeOrderImpact)(projectId, ChangeOrder);
        }
    };
    __setFunctionName(_classThis, "CostControlService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CostControlService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CostControlService = _classThis;
})();
exports.CostControlService = CostControlService;
/**
 * Default export with all cost control utilities.
 */
exports.default = {
    // Models
    createCostEstimateModel,
    createCostTrackingModel,
    createChangeOrderModel,
    // Cost Estimating
    createCostEstimate: exports.createCostEstimate,
    validateEstimateData: exports.validateEstimateData,
    calculateContingency: exports.calculateContingency,
    reviseEstimate: exports.reviseEstimate,
    setEstimateAsBaseline: exports.setEstimateAsBaseline,
    // Budget Development
    createBudgetFromEstimate: exports.createBudgetFromEstimate,
    allocateBudgetByCategory: exports.allocateBudgetByCategory,
    getBudgetSummary: exports.getBudgetSummary,
    transferBudget: exports.transferBudget,
    exportBudgetReport: exports.exportBudgetReport,
    // Cost Tracking
    recordActualCost: exports.recordActualCost,
    recordCommittedCost: exports.recordCommittedCost,
    calculateCostVariance: exports.calculateCostVariance,
    getCostsByCategory: exports.getCostsByCategory,
    updatePercentComplete: exports.updatePercentComplete,
    // Earned Value Management
    calculateEarnedValueMetrics: exports.calculateEarnedValueMetrics,
    calculateSPI: exports.calculateSPI,
    calculateCPI: exports.calculateCPI,
    calculateEAC: exports.calculateEAC,
    generateEVMTrendAnalysis: exports.generateEVMTrendAnalysis,
    // Variance Analysis
    identifySignificantVariances: exports.identifySignificantVariances,
    performVarianceRootCauseAnalysis: exports.performVarianceRootCauseAnalysis,
    generateVarianceReportByCategory: exports.generateVarianceReportByCategory,
    trackVarianceTrends: exports.trackVarianceTrends,
    exportVarianceAnalysisPDF: exports.exportVarianceAnalysisPDF,
    // Forecasting
    generateCostForecast: exports.generateCostForecast,
    projectCashFlow: exports.projectCashFlow,
    calculateEstimateToComplete: exports.calculateEstimateToComplete,
    analyzeCostTrends: exports.analyzeCostTrends,
    simulateWhatIfScenario: exports.simulateWhatIfScenario,
    // Indirect Cost Allocation
    allocateIndirectCosts: exports.allocateIndirectCosts,
    calculateOverheadRate: exports.calculateOverheadRate,
    distributeGeneralConditions: exports.distributeGeneralConditions,
    trackIndirectCostBurnRate: exports.trackIndirectCostBurnRate,
    reconcileIndirectCosts: exports.reconcileIndirectCosts,
    // Change Order Management
    createChangeOrder: exports.createChangeOrder,
    approveChangeOrder: exports.approveChangeOrder,
    incorporateChangeOrder: exports.incorporateChangeOrder,
    calculateChangeOrderImpact: exports.calculateChangeOrderImpact,
    generateChangeOrderLog: exports.generateChangeOrderLog,
    // Contingency Management
    manageContingency: exports.manageContingency,
    drawContingency: exports.drawContingency,
    analyzeContingencyUtilization: exports.analyzeContingencyUtilization,
    forecastContingencyAdequacy: exports.forecastContingencyAdequacy,
    generateContingencyReport: exports.generateContingencyReport,
    // Service
    CostControlService,
};
//# sourceMappingURL=construction-cost-control-kit.js.map