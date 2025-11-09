"use strict";
/**
 * LOC: FINANCOMP001
 * File: /reuse/edwards/financial/composites/financial-dimensions-analytics-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../dimension-management-kit
 *   - ../financial-reporting-analytics-kit
 *   - ../cost-accounting-allocation-kit
 *   - ../intercompany-accounting-kit
 *   - ../audit-trail-compliance-kit
 *
 * DOWNSTREAM (imported by):
 *   - Backend dimension analytics controllers
 *   - Financial reporting REST APIs
 *   - Multi-dimensional analytics dashboards
 *   - Hierarchy management services
 *   - Cross-dimensional drill-down services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.consolidateDimensionalFinancials = exports.drillDownToNextLevel = exports.createDimensionDrillDownPath = exports.calculateDimensionalSegmentProfitability = exports.analyzeBudgetVsActualByDimension = exports.createDimensionalBudgetWithAllocation = exports.generateMultiDimensionalPivotAnalysis = exports.performCrossDimensionalMatrixAnalysis = exports.rebalanceDimensionHierarchyLevels = exports.validateDimensionHierarchyIntegrity = exports.buildDimensionHierarchyStructure = void 0;
// Import from dimension management kit
const dimension_management_kit_1 = require("../dimension-management-kit");
// Import from cost accounting allocation kit
const cost_accounting_allocation_kit_1 = require("../cost-accounting-allocation-kit");
// Import from intercompany accounting kit
const intercompany_accounting_kit_1 = require("../intercompany-accounting-kit");
// Import from audit trail compliance kit
const audit_trail_compliance_kit_1 = require("../audit-trail-compliance-kit");
// ============================================================================
// COMPOSITE FUNCTIONS - DIMENSION HIERARCHY MANAGEMENT
// ============================================================================
/**
 * Builds complete dimension hierarchy structure
 * Composes: getDimensionsByType, getChildDimensions, getParentDimensions
 */
const buildDimensionHierarchyStructure = async (sequelize, dimensionType, transaction) => {
    const dimensions = await (0, dimension_management_kit_1.getDimensionsByType)(sequelize, dimensionType, transaction);
    // Find root nodes (nodes with no parent)
    const rootNodes = [];
    const nodeMap = new Map();
    // Create node map
    for (const dim of dimensions) {
        const node = {
            nodeId: dim.dimensionId,
            nodeCode: dim.dimensionCode,
            nodeName: dim.dimensionName,
            level: dim.level,
            parentNodeId: dim.parentDimensionId,
            children: [],
            attributes: {},
            isLeaf: true,
        };
        nodeMap.set(dim.dimensionId, node);
    }
    // Build hierarchy
    for (const dim of dimensions) {
        const node = nodeMap.get(dim.dimensionId);
        if (dim.parentDimensionId) {
            const parent = nodeMap.get(dim.parentDimensionId);
            if (parent) {
                parent.children.push(node);
                parent.isLeaf = false;
                node.parentNodeCode = parent.nodeCode;
            }
        }
        else {
            rootNodes.push(node);
        }
    }
    // Calculate aggregated values (if needed)
    const calculateAggregatedValue = async (node) => {
        if (node.children.length === 0) {
            // Get leaf value from transactions
            const result = await sequelize.query(`
        SELECT SUM(amount) as total
        FROM financial_transactions
        WHERE dimension_code = :dimensionCode
          AND dimension_type = :dimensionType
        `, {
                replacements: { dimensionCode: node.nodeCode, dimensionType },
                type: 'SELECT',
                transaction,
            });
            const total = result && result.length > 0 ? parseFloat(result[0].total || 0) : 0;
            node.aggregatedValue = total;
            return total;
        }
        else {
            // Aggregate children
            let total = 0;
            for (const child of node.children) {
                total += await calculateAggregatedValue(child);
            }
            node.aggregatedValue = total;
            return total;
        }
    };
    for (const root of rootNodes) {
        await calculateAggregatedValue(root);
    }
    // Calculate total levels
    const calculateMaxDepth = (node, currentDepth = 1) => {
        if (node.children.length === 0)
            return currentDepth;
        return Math.max(...node.children.map(c => calculateMaxDepth(c, currentDepth + 1)));
    };
    const totalLevels = Math.max(...rootNodes.map(r => calculateMaxDepth(r)));
    return {
        dimensionType,
        rootNodes,
        totalLevels,
        totalNodes: dimensions.length,
        hierarchyType: 'parent_child',
    };
};
exports.buildDimensionHierarchyStructure = buildDimensionHierarchyStructure;
/**
 * Validates dimension hierarchy integrity
 * Composes: buildDimensionHierarchyStructure with validation checks
 */
const validateDimensionHierarchyIntegrity = async (sequelize, dimensionType, userId, transaction) => {
    const dimensions = await (0, dimension_management_kit_1.getDimensionsByType)(sequelize, dimensionType, transaction);
    const orphanedNodes = [];
    const circularReferences = [];
    const duplicateCodes = [];
    const errors = [];
    // Check for duplicate codes
    const codeMap = new Map();
    for (const dim of dimensions) {
        const count = codeMap.get(dim.dimensionCode) || 0;
        codeMap.set(dim.dimensionCode, count + 1);
    }
    for (const [code, count] of codeMap.entries()) {
        if (count > 1) {
            duplicateCodes.push(code);
            errors.push(`Duplicate dimension code: ${code} (${count} occurrences)`);
        }
    }
    // Check for orphaned nodes (parent doesn't exist)
    for (const dim of dimensions) {
        if (dim.parentDimensionId) {
            const parentExists = dimensions.some(d => d.dimensionId === dim.parentDimensionId);
            if (!parentExists) {
                orphanedNodes.push({
                    nodeId: dim.dimensionId,
                    nodeCode: dim.dimensionCode,
                    nodeName: dim.dimensionName,
                    level: dim.level,
                    parentNodeId: dim.parentDimensionId,
                    children: [],
                    attributes: {},
                    isLeaf: true,
                });
                errors.push(`Orphaned node: ${dim.dimensionCode} (parent ${dim.parentDimensionId} not found)`);
            }
        }
    }
    // Check for circular references
    const visited = new Set();
    const recursionStack = new Set();
    const detectCircular = (dimId, path) => {
        visited.add(dimId);
        recursionStack.add(dimId);
        const dim = dimensions.find(d => d.dimensionId === dimId);
        if (dim) {
            path.push(dim.dimensionCode);
            if (dim.parentDimensionId) {
                if (recursionStack.has(dim.parentDimensionId)) {
                    const parent = dimensions.find(d => d.dimensionId === dim.parentDimensionId);
                    if (parent) {
                        path.push(parent.dimensionCode);
                        circularReferences.push([...path]);
                        errors.push(`Circular reference detected: ${path.join(' -> ')}`);
                    }
                    return true;
                }
                if (!visited.has(dim.parentDimensionId)) {
                    if (detectCircular(dim.parentDimensionId, [...path])) {
                        return true;
                    }
                }
            }
        }
        recursionStack.delete(dimId);
        return false;
    };
    for (const dim of dimensions) {
        if (!visited.has(dim.dimensionId)) {
            detectCircular(dim.dimensionId, []);
        }
    }
    // Create audit log
    await (0, audit_trail_compliance_kit_1.createAuditLog)(sequelize, 'dimension_hierarchy_validation', 0, 'EXECUTE', userId, `Dimension hierarchy validation: ${dimensionType}`, {}, {
        dimensionType,
        dimensionsChecked: dimensions.length,
        errorsFound: errors.length,
    }, transaction);
    return {
        valid: errors.length === 0,
        orphanedNodes,
        circularReferences,
        duplicateCodes,
        errors,
    };
};
exports.validateDimensionHierarchyIntegrity = validateDimensionHierarchyIntegrity;
/**
 * Rebalances dimension hierarchy levels
 * Composes: getDimensionsByType, updateDimension, trackFieldChange
 */
const rebalanceDimensionHierarchyLevels = async (sequelize, dimensionType, userId, transaction) => {
    const dimensions = await (0, dimension_management_kit_1.getDimensionsByType)(sequelize, dimensionType, transaction);
    const levelChanges = new Map();
    const errors = [];
    let updated = 0;
    // Calculate correct levels based on parent-child relationships
    const calculateLevel = (dimId, visited = new Set()) => {
        if (visited.has(dimId))
            return 0; // Circular reference protection
        visited.add(dimId);
        const dim = dimensions.find(d => d.dimensionId === dimId);
        if (!dim || !dim.parentDimensionId)
            return 1;
        const parentLevel = calculateLevel(dim.parentDimensionId, visited);
        return parentLevel + 1;
    };
    for (const dim of dimensions) {
        try {
            const correctLevel = calculateLevel(dim.dimensionId);
            if (correctLevel !== dim.level) {
                // Update dimension level
                await (0, dimension_management_kit_1.updateDimension)(sequelize, dim.dimensionId, { level: correctLevel }, userId, transaction);
                // Track change
                await (0, audit_trail_compliance_kit_1.trackFieldChange)(sequelize, 'dimensions', dim.dimensionId, 'level', dim.level, correctLevel, userId, 'Hierarchy level rebalancing', transaction);
                levelChanges.set(dim.dimensionCode, {
                    oldLevel: dim.level,
                    newLevel: correctLevel,
                });
                updated++;
            }
        }
        catch (error) {
            errors.push(`${dim.dimensionCode}: ${error.message}`);
        }
    }
    // Create audit log
    await (0, audit_trail_compliance_kit_1.createAuditLog)(sequelize, 'dimension_hierarchy_rebalance', 0, 'UPDATE', userId, `Hierarchy rebalanced: ${dimensionType}`, {}, {
        dimensionType,
        updated,
        totalDimensions: dimensions.length,
    }, transaction);
    return { updated, levelChanges, errors };
};
exports.rebalanceDimensionHierarchyLevels = rebalanceDimensionHierarchyLevels;
// ============================================================================
// COMPOSITE FUNCTIONS - CROSS-DIMENSIONAL ANALYSIS
// ============================================================================
/**
 * Performs cross-dimensional matrix analysis
 * Composes: getDimensionsByType, generateSegmentReporting, performVarianceAnalysis
 */
const performCrossDimensionalMatrixAnalysis = async (sequelize, rowDimension, columnDimension, measure, fiscalYear, fiscalPeriod, userId, transaction) => {
    const analysisId = `CROSSDIM-${Date.now()}`;
    // Get dimension members
    const rowDimensions = await (0, dimension_management_kit_1.getDimensionsByType)(sequelize, rowDimension, transaction);
    const columnDimensions = await (0, dimension_management_kit_1.getDimensionsByType)(sequelize, columnDimension, transaction);
    // Filter to leaf nodes only
    const rowMembers = rowDimensions
        .filter(d => !rowDimensions.some(child => child.parentDimensionId === d.dimensionId))
        .map(d => ({
        dimensionType: rowDimension,
        memberCode: d.dimensionCode,
        memberName: d.dimensionName,
        level: d.level,
        parentCode: rowDimensions.find(p => p.dimensionId === d.parentDimensionId)?.dimensionCode,
    }));
    const columnMembers = columnDimensions
        .filter(d => !columnDimensions.some(child => child.parentDimensionId === d.dimensionId))
        .map(d => ({
        dimensionType: columnDimension,
        memberCode: d.dimensionCode,
        memberName: d.dimensionName,
        level: d.level,
        parentCode: columnDimensions.find(p => p.dimensionId === d.parentDimensionId)?.dimensionCode,
    }));
    // Build matrix
    const cells = [];
    const rowTotals = new Array(rowMembers.length).fill(0);
    const columnTotals = new Array(columnMembers.length).fill(0);
    let grandTotal = 0;
    for (let rowIndex = 0; rowIndex < rowMembers.length; rowIndex++) {
        const cellRow = [];
        for (let colIndex = 0; colIndex < columnMembers.length; colIndex++) {
            const rowMember = rowMembers[rowIndex];
            const colMember = columnMembers[colIndex];
            // Query value
            const result = await sequelize.query(`
        SELECT SUM(amount) as total
        FROM financial_transactions
        WHERE ${rowDimension}_code = :rowCode
          AND ${columnDimension}_code = :colCode
          AND measure_type = :measure
          AND fiscal_year = :fiscalYear
          AND fiscal_period = :fiscalPeriod
        `, {
                replacements: {
                    rowCode: rowMember.memberCode,
                    colCode: colMember.memberCode,
                    measure,
                    fiscalYear,
                    fiscalPeriod,
                },
                type: 'SELECT',
                transaction,
            });
            const value = result && result.length > 0 ? parseFloat(result[0].total || 0) : 0;
            cellRow.push({
                rowIndex,
                columnIndex: colIndex,
                value,
                formattedValue: value.toFixed(2),
                drillDownAvailable: true,
                percentOfTotal: 0, // Will calculate after grand total known
            });
            rowTotals[rowIndex] += value;
            columnTotals[colIndex] += value;
            grandTotal += value;
        }
        cells.push(cellRow);
    }
    // Calculate percent of total
    for (const row of cells) {
        for (const cell of row) {
            cell.percentOfTotal = grandTotal > 0 ? (cell.value / grandTotal) * 100 : 0;
        }
    }
    const matrix = {
        rows: rowMembers,
        columns: columnMembers,
        cells,
        rowTotals,
        columnTotals,
        grandTotal,
    };
    // Generate insights
    const insights = [];
    // Find top performers (highest values)
    let maxValue = 0;
    let maxRow = 0;
    let maxCol = 0;
    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[i].length; j++) {
            if (cells[i][j].value > maxValue) {
                maxValue = cells[i][j].value;
                maxRow = i;
                maxCol = j;
            }
        }
    }
    if (maxValue > 0) {
        insights.push({
            insightType: 'opportunity',
            dimension: rowDimension,
            member: rowMembers[maxRow].memberCode,
            description: `Highest ${measure}: ${rowMembers[maxRow].memberName} x ${columnMembers[maxCol].memberName} = ${maxValue.toFixed(2)}`,
            impact: 'high',
            recommendation: 'Focus resources on this high-performing segment',
        });
    }
    // Find anomalies (values significantly different from average)
    const average = grandTotal / (rowMembers.length * columnMembers.length);
    const stdDev = Math.sqrt(cells.flat().reduce((sum, cell) => sum + Math.pow(cell.value - average, 2), 0) / cells.flat().length);
    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[i].length; j++) {
            const zScore = (cells[i][j].value - average) / stdDev;
            if (Math.abs(zScore) > 2) {
                insights.push({
                    insightType: 'anomaly',
                    dimension: rowDimension,
                    member: rowMembers[i].memberCode,
                    description: `Unusual ${measure} for ${rowMembers[i].memberName} x ${columnMembers[j].memberName}: ${cells[i][j].value.toFixed(2)} (${zScore.toFixed(2)} std devs from mean)`,
                    impact: Math.abs(zScore) > 3 ? 'high' : 'medium',
                    recommendation: 'Investigate root cause of variance',
                });
            }
        }
    }
    // Create audit log
    await (0, audit_trail_compliance_kit_1.createAuditLog)(sequelize, 'cross_dimensional_analysis', 0, 'EXECUTE', userId, `Cross-dimensional analysis: ${rowDimension} x ${columnDimension}`, {}, {
        analysisId,
        rowDimension,
        columnDimension,
        measure,
        totalRecords: cells.flat().length,
        insightsGenerated: insights.length,
    }, transaction);
    return {
        analysisId,
        analysisDate: new Date(),
        dimensions: [rowDimension, columnDimension],
        measures: [measure],
        matrix,
        insights,
        totalRecords: cells.flat().length,
    };
};
exports.performCrossDimensionalMatrixAnalysis = performCrossDimensionalMatrixAnalysis;
/**
 * Generates multi-dimensional pivot analysis
 * Composes: performCrossDimensionalMatrixAnalysis with multiple measures
 */
const generateMultiDimensionalPivotAnalysis = async (sequelize, dimensions, measures, fiscalYear, fiscalPeriod, userId, transaction) => {
    const analyses = [];
    // Generate analysis for each dimension pair and measure
    for (let i = 0; i < dimensions.length - 1; i++) {
        for (let j = i + 1; j < dimensions.length; j++) {
            for (const measure of measures) {
                const analysis = await (0, exports.performCrossDimensionalMatrixAnalysis)(sequelize, dimensions[i], dimensions[j], measure, fiscalYear, fiscalPeriod, userId, transaction);
                analyses.push(analysis);
            }
        }
    }
    return analyses;
};
exports.generateMultiDimensionalPivotAnalysis = generateMultiDimensionalPivotAnalysis;
// ============================================================================
// COMPOSITE FUNCTIONS - DIMENSIONAL BUDGETING
// ============================================================================
/**
 * Creates dimensional budget with multi-dimensional allocation
 * Composes: createDimension, updateCostCenterBudget, createAuditLog
 */
const createDimensionalBudgetWithAllocation = async (sequelize, budgetName, fiscalYear, dimensions, budgetData, userId, transaction) => {
    const budgetId = `BUDGET-${fiscalYear}-${Date.now()}`;
    const budgetLines = [];
    let totalBudget = 0;
    for (const item of budgetData) {
        const lineId = `${budgetId}-${budgetLines.length + 1}`;
        budgetLines.push({
            lineId,
            accountCode: item.accountCode,
            dimensionValues: item.dimensionValues,
            budgetAmount: item.amount,
        });
        totalBudget += item.amount;
        // Store budget line
        await sequelize.query(`
      INSERT INTO dimensional_budget_lines
        (budget_id, line_id, account_code, dimension_values, budget_amount, fiscal_year)
      VALUES
        (:budgetId, :lineId, :accountCode, :dimensionValues, :budgetAmount, :fiscalYear)
      `, {
            replacements: {
                budgetId,
                lineId,
                accountCode: item.accountCode,
                dimensionValues: JSON.stringify(Object.fromEntries(item.dimensionValues)),
                budgetAmount: item.amount,
                fiscalYear,
            },
            type: 'INSERT',
            transaction,
        });
        // Update cost center budget if applicable
        const costCenterCode = item.dimensionValues.get('cost_center');
        if (costCenterCode) {
            const costCenter = await sequelize.query(`SELECT cost_center_id FROM cost_centers WHERE cost_center_code = :code`, {
                replacements: { code: costCenterCode },
                type: 'SELECT',
                transaction,
            });
            if (costCenter && costCenter.length > 0) {
                await (0, cost_accounting_allocation_kit_1.updateCostCenterBudget)(sequelize, costCenter[0].cost_center_id, item.amount, userId, transaction);
            }
        }
    }
    // Store budget header
    await sequelize.query(`
    INSERT INTO dimensional_budgets
      (budget_id, budget_name, fiscal_year, dimensions, total_budget, status, created_by)
    VALUES
      (:budgetId, :budgetName, :fiscalYear, :dimensions, :totalBudget, 'draft', :userId)
    `, {
        replacements: {
            budgetId,
            budgetName,
            fiscalYear,
            dimensions: JSON.stringify(Object.fromEntries(dimensions)),
            totalBudget,
            userId,
        },
        type: 'INSERT',
        transaction,
    });
    // Create audit log
    await (0, audit_trail_compliance_kit_1.createAuditLog)(sequelize, 'dimensional_budgets', 0, 'INSERT', userId, `Dimensional budget created: ${budgetName}`, {}, {
        budgetId,
        fiscalYear,
        totalBudget,
        lineCount: budgetLines.length,
    }, transaction);
    return {
        budgetId,
        budgetName,
        fiscalYear,
        dimensions,
        budgetLines,
        totalBudget,
        status: 'draft',
    };
};
exports.createDimensionalBudgetWithAllocation = createDimensionalBudgetWithAllocation;
/**
 * Analyzes budget vs actual across dimensions
 * Composes: generateBudgetVsActual, performVarianceAnalysis
 */
const analyzeBudgetVsActualByDimension = async (sequelize, budgetId, fiscalYear, fiscalPeriod, dimensions, userId, transaction) => {
    const variances = [];
    // Get budget lines
    const budgetLines = await sequelize.query(`SELECT * FROM dimensional_budget_lines WHERE budget_id = :budgetId`, {
        replacements: { budgetId },
        type: 'SELECT',
        transaction,
    });
    for (const budgetLine of budgetLines) {
        const dimensionValues = JSON.parse(budgetLine.dimension_values);
        for (const dimension of dimensions) {
            const dimensionCode = dimensionValues[dimension];
            if (dimensionCode) {
                // Get actual amount
                const actuals = await sequelize.query(`
          SELECT SUM(amount) as total
          FROM financial_transactions
          WHERE ${dimension}_code = :dimensionCode
            AND account_code = :accountCode
            AND fiscal_year = :fiscalYear
            AND fiscal_period = :fiscalPeriod
          `, {
                    replacements: {
                        dimensionCode,
                        accountCode: budgetLine.account_code,
                        fiscalYear,
                        fiscalPeriod,
                    },
                    type: 'SELECT',
                    transaction,
                });
                const actualAmount = actuals && actuals.length > 0 ? parseFloat(actuals[0].total || 0) : 0;
                const budgetAmount = parseFloat(budgetLine.budget_amount);
                const variance = actualAmount - budgetAmount;
                const variancePercent = budgetAmount > 0 ? (variance / budgetAmount) * 100 : 0;
                // Get dimension name
                const dims = await (0, dimension_management_kit_1.getDimensionsByType)(sequelize, dimension, transaction);
                const dim = dims.find(d => d.dimensionCode === dimensionCode);
                variances.push({
                    dimensionType: dimension,
                    dimensionCode,
                    dimensionName: dim?.dimensionName || dimensionCode,
                    budgetAmount,
                    actualAmount,
                    variance,
                    variancePercent,
                    favorable: variance <= 0, // For expenses, under budget is favorable
                });
            }
        }
    }
    // Calculate totals
    const totalFavorable = variances.filter(v => v.favorable).reduce((sum, v) => sum + Math.abs(v.variance), 0);
    const totalUnfavorable = variances.filter(v => !v.favorable).reduce((sum, v) => sum + Math.abs(v.variance), 0);
    // Find significant variances (>10%)
    const significantVariances = variances.filter(v => Math.abs(v.variancePercent) > 10);
    // Create audit log
    await (0, audit_trail_compliance_kit_1.createAuditLog)(sequelize, 'dimensional_budget_variance', 0, 'EXECUTE', userId, `Budget vs actual analysis: ${budgetId}`, {}, {
        budgetId,
        fiscalYear,
        fiscalPeriod,
        totalFavorable,
        totalUnfavorable,
        significantCount: significantVariances.length,
    }, transaction);
    return {
        analysisDate: new Date(),
        fiscalYear,
        fiscalPeriod,
        dimensions,
        variances,
        totalFavorable,
        totalUnfavorable,
        significantVariances,
    };
};
exports.analyzeBudgetVsActualByDimension = analyzeBudgetVsActualByDimension;
// ============================================================================
// COMPOSITE FUNCTIONS - SEGMENT PROFITABILITY
// ============================================================================
/**
 * Calculates segment profitability across dimensions
 * Composes: generateSegmentReporting, getCostCenterById, performVarianceAnalysis
 */
const calculateDimensionalSegmentProfitability = async (sequelize, segmentType, fiscalYear, fiscalPeriod, transaction) => {
    const segments = [];
    // Get all segments of this type
    const dimensions = await (0, dimension_management_kit_1.getDimensionsByType)(sequelize, segmentType, transaction);
    for (const segment of dimensions) {
        // Get revenue
        const revenueResult = await sequelize.query(`
      SELECT SUM(amount) as total
      FROM financial_transactions
      WHERE ${segmentType}_code = :segmentCode
        AND account_type = 'revenue'
        AND fiscal_year = :fiscalYear
        AND fiscal_period = :fiscalPeriod
      `, {
            replacements: {
                segmentCode: segment.dimensionCode,
                fiscalYear,
                fiscalPeriod,
            },
            type: 'SELECT',
            transaction,
        });
        const revenue = revenueResult && revenueResult.length > 0 ? parseFloat(revenueResult[0].total || 0) : 0;
        // Get direct costs
        const directCostResult = await sequelize.query(`
      SELECT SUM(amount) as total
      FROM financial_transactions
      WHERE ${segmentType}_code = :segmentCode
        AND cost_type = 'direct'
        AND fiscal_year = :fiscalYear
        AND fiscal_period = :fiscalPeriod
      `, {
            replacements: {
                segmentCode: segment.dimensionCode,
                fiscalYear,
                fiscalPeriod,
            },
            type: 'SELECT',
            transaction,
        });
        const directCosts = directCostResult && directCostResult.length > 0 ? parseFloat(directCostResult[0].total || 0) : 0;
        // Get allocated costs
        const allocatedCostResult = await sequelize.query(`
      SELECT SUM(allocation_amount) as total
      FROM allocation_results
      WHERE target_department = :segmentCode
        AND fiscal_year = :fiscalYear
        AND fiscal_period = :fiscalPeriod
      `, {
            replacements: {
                segmentCode: segment.dimensionCode,
                fiscalYear,
                fiscalPeriod,
            },
            type: 'SELECT',
            transaction,
        });
        const allocatedCosts = allocatedCostResult && allocatedCostResult.length > 0 ? parseFloat(allocatedCostResult[0].total || 0) : 0;
        const totalCosts = directCosts + allocatedCosts;
        const grossProfit = revenue - directCosts;
        const netProfit = revenue - totalCosts;
        const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
        const contributionMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
        // Calculate ROI (simplified - would need asset base)
        const roi = totalCosts > 0 ? (netProfit / totalCosts) * 100 : 0;
        segments.push({
            segmentType,
            segmentCode: segment.dimensionCode,
            segmentName: segment.dimensionName,
            revenue,
            directCosts,
            allocatedCosts,
            totalCosts,
            grossProfit,
            netProfit,
            profitMargin,
            contributionMargin,
            roi,
        });
    }
    // Sort by profitability
    segments.sort((a, b) => b.netProfit - a.netProfit);
    return segments;
};
exports.calculateDimensionalSegmentProfitability = calculateDimensionalSegmentProfitability;
// ============================================================================
// COMPOSITE FUNCTIONS - DRILL-DOWN CAPABILITIES
// ============================================================================
/**
 * Creates drill-down path through dimension hierarchy
 * Composes: buildDimensionHierarchyStructure, getDrillDownTransactions
 */
const createDimensionDrillDownPath = async (sequelize, dimensionType, startDimensionCode, measure, fiscalYear, fiscalPeriod, transaction) => {
    const pathId = `DRILLDOWN-${Date.now()}`;
    // Get dimension hierarchy
    const hierarchy = await (0, exports.buildDimensionHierarchyStructure)(sequelize, dimensionType, transaction);
    // Find start node
    const findNode = (nodes, code) => {
        for (const node of nodes) {
            if (node.nodeCode === code)
                return node;
            const found = findNode(node.children, code);
            if (found)
                return found;
        }
        return null;
    };
    const startNode = findNode(hierarchy.rootNodes, startDimensionCode);
    if (!startNode) {
        throw new Error(`Dimension not found: ${startDimensionCode}`);
    }
    // Build path from root to this node
    const path = [];
    const buildPath = (node, currentPath = []) => {
        if (node.nodeCode === startDimensionCode) {
            // Found target - build steps
            currentPath.push(node);
            for (let i = 0; i < currentPath.length; i++) {
                const stepNode = currentPath[i];
                path.push({
                    stepNumber: i + 1,
                    dimensionType,
                    dimensionCode: stepNode.nodeCode,
                    dimensionName: stepNode.nodeName,
                    level: stepNode.level,
                    value: stepNode.aggregatedValue || 0,
                    percentOfParent: i > 0 && currentPath[i - 1].aggregatedValue
                        ? ((stepNode.aggregatedValue || 0) / currentPath[i - 1].aggregatedValue) * 100
                        : 100,
                    drillable: stepNode.children.length > 0,
                });
            }
            return true;
        }
        for (const child of node.children) {
            if (buildPath(child, [...currentPath, node])) {
                return true;
            }
        }
        return false;
    };
    for (const root of hierarchy.rootNodes) {
        if (buildPath(root))
            break;
    }
    const filters = new Map();
    filters.set(dimensionType, [startDimensionCode]);
    return {
        pathId,
        startDimension: dimensionType,
        currentLevel: startNode.level,
        maxLevel: hierarchy.totalLevels,
        path,
        currentValue: startNode.aggregatedValue || 0,
        filters,
    };
};
exports.createDimensionDrillDownPath = createDimensionDrillDownPath;
/**
 * Drills down to next level in dimension hierarchy
 * Composes: createDimensionDrillDownPath, getChildDimensions
 */
const drillDownToNextLevel = async (sequelize, currentPath, transaction) => {
    const currentDimCode = currentPath.path[currentPath.path.length - 1].dimensionCode;
    // Get dimension
    const dimensions = await (0, dimension_management_kit_1.getDimensionsByType)(sequelize, currentPath.startDimension, transaction);
    const currentDim = dimensions.find(d => d.dimensionCode === currentDimCode);
    if (!currentDim) {
        throw new Error(`Current dimension not found: ${currentDimCode}`);
    }
    // Get children
    const children = await (0, dimension_management_kit_1.getChildDimensions)(sequelize, currentDim.dimensionId, transaction);
    if (children.length === 0) {
        throw new Error('No child dimensions available for drill-down');
    }
    // Select first child (in practice, user would select)
    const nextDim = children[0];
    // Create new path
    return (0, exports.createDimensionDrillDownPath)(sequelize, currentPath.startDimension, nextDim.dimensionCode, 'amount', 0, 0, transaction);
};
exports.drillDownToNextLevel = drillDownToNextLevel;
// ============================================================================
// COMPOSITE FUNCTIONS - DIMENSION CONSOLIDATION
// ============================================================================
/**
 * Consolidates financial data across dimension hierarchies
 * Composes: initiateConsolidation, createEliminationEntry, generateConsolidatedStatement
 */
const consolidateDimensionalFinancials = async (sequelize, consolidationType, dimensions, entityIds, fiscalYear, fiscalPeriod, userId, transaction) => {
    const consolidationId = `CONSOL-${Date.now()}`;
    // Initiate consolidation process
    const consolidation = await (0, intercompany_accounting_kit_1.initiateConsolidation)(sequelize, entityIds, fiscalYear, fiscalPeriod, userId, transaction);
    // Collect values across dimensions
    const consolidatedValues = new Map();
    for (const dimension of dimensions) {
        const dims = await (0, dimension_management_kit_1.getDimensionsByType)(sequelize, dimension, transaction);
        for (const dim of dims) {
            // Get entity values for this dimension
            const result = await sequelize.query(`
        SELECT SUM(amount) as total
        FROM financial_transactions
        WHERE ${dimension}_code = :dimensionCode
          AND entity_id IN (:entityIds)
          AND fiscal_year = :fiscalYear
          AND fiscal_period = :fiscalPeriod
        `, {
                replacements: {
                    dimensionCode: dim.dimensionCode,
                    entityIds,
                    fiscalYear,
                    fiscalPeriod,
                },
                type: 'SELECT',
                transaction,
            });
            const total = result && result.length > 0 ? parseFloat(result[0].total || 0) : 0;
            consolidatedValues.set(`${dimension}:${dim.dimensionCode}`, total);
        }
    }
    // Create eliminations for intercompany transactions
    const eliminations = [];
    const intercompanyTxns = await sequelize.query(`
    SELECT * FROM intercompany_transactions
    WHERE source_entity_id IN (:entityIds)
      AND target_entity_id IN (:entityIds)
      AND fiscal_year = :fiscalYear
      AND fiscal_period = :fiscalPeriod
    `, {
        replacements: { entityIds, fiscalYear, fiscalPeriod },
        type: 'SELECT',
        transaction,
    });
    for (const ic of intercompanyTxns) {
        const elimination = await (0, intercompany_accounting_kit_1.createEliminationEntry)(sequelize, ic.transaction_id, 'intercompany_revenue', ic.amount, `Elimination of IC transaction ${ic.transaction_id}`, userId, transaction);
        eliminations.push(elimination);
    }
    // Generate consolidated statement
    const consolidatedStatement = await (0, intercompany_accounting_kit_1.generateConsolidatedStatement)(sequelize, consolidation.consolidationId, fiscalYear, fiscalPeriod, transaction);
    // Create audit trail
    const auditLog = await (0, audit_trail_compliance_kit_1.createAuditLog)(sequelize, 'dimension_consolidation', 0, 'EXECUTE', userId, `Dimensional consolidation: ${consolidationType}`, {}, {
        consolidationId,
        consolidationType,
        dimensions: dimensions.length,
        entities: entityIds.length,
        eliminations: eliminations.length,
    }, transaction);
    // Build data lineage
    await (0, audit_trail_compliance_kit_1.buildDataLineageTrail)(sequelize, 'dimension_consolidation', consolidationId, entityIds.map(id => ({
        entityType: 'financial_entity',
        entityId: id.toString(),
        transformationType: 'consolidation',
    })), userId, transaction);
    return {
        consolidationId,
        consolidationDate: new Date(),
        consolidationType,
        dimensions,
        entities: entityIds,
        consolidatedValues,
        eliminations,
        auditTrail: [auditLog],
    };
};
exports.consolidateDimensionalFinancials = consolidateDimensionalFinancials;
//# sourceMappingURL=financial-dimensions-analytics-composite.js.map