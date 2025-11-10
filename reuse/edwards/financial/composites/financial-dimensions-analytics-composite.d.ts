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
/**
 * File: /reuse/edwards/financial/composites/financial-dimensions-analytics-composite.ts
 * Locator: WC-EDW-FINAN-COMPOSITE-001
 * Purpose: Comprehensive Financial Dimensions Analytics Composite - Dimension management, segment hierarchies, cross-dimensional reporting, budgeting, consolidation
 *
 * Upstream: Composes functions from dimension-management-kit, financial-reporting-analytics-kit,
 *           cost-accounting-allocation-kit, intercompany-accounting-kit, audit-trail-compliance-kit
 * Downstream: ../backend/financial/*, Dimension Analytics APIs, Multi-Dimensional Reporting, Hierarchy Services, Drill-Down
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 42 composite functions for dimension management, hierarchies, cross-dimensional analytics, budgeting, consolidation, drill-down
 *
 * LLM Context: Enterprise-grade financial dimensions analytics composite for White Cross healthcare platform.
 * Provides comprehensive multi-dimensional financial analysis with dimension hierarchy management, segment hierarchies,
 * dimension validation, cross-dimensional reporting, dimensional budgeting, dimension consolidation, drill-down capabilities,
 * variance analysis across dimensions, KPI tracking by dimension, segment profitability, and HIPAA-compliant audit trails.
 * Competes with Oracle JD Edwards EnterpriseOne with production-ready multi-dimensional analytics infrastructure for
 * complex healthcare financial analysis and reporting.
 *
 * Financial Dimensions Design Principles:
 * - Multi-level hierarchical dimension structures
 * - Parent-child and level-based hierarchies
 * - Cross-dimensional analysis and reporting
 * - Dimension security and access control
 * - Drill-down and drill-across capabilities
 * - Dimensional budgeting and forecasting
 * - Segment profitability analysis
 * - Consolidation across dimension hierarchies
 * - Performance optimization for large dimension sets
 * - Comprehensive audit trails for dimension changes
 */
import { Transaction } from 'sequelize';
import { type EliminationEntry } from '../intercompany-accounting-kit';
import { type AuditLogEntry } from '../audit-trail-compliance-kit';
/**
 * Multi-dimensional analytics configuration
 */
export interface MultiDimensionalConfig {
    enabledDimensions: string[];
    defaultDimensions: string[];
    hierarchyDepthLimit: number;
    crossDimensionalAnalysis: boolean;
    dimensionSecurityEnabled: boolean;
    cachingEnabled: boolean;
    aggregationStrategy: 'on-the-fly' | 'pre-aggregated' | 'hybrid';
}
/**
 * Dimension hierarchy structure
 */
export interface DimensionHierarchyStructure {
    dimensionType: string;
    rootNodes: DimensionNode[];
    totalLevels: number;
    totalNodes: number;
    hierarchyType: 'parent_child' | 'level_based' | 'network';
}
/**
 * Dimension node
 */
export interface DimensionNode {
    nodeId: number;
    nodeCode: string;
    nodeName: string;
    level: number;
    parentNodeId?: number;
    parentNodeCode?: string;
    children: DimensionNode[];
    attributes: Record<string, any>;
    aggregatedValue?: number;
    isLeaf: boolean;
}
/**
 * Cross-dimensional analysis result
 */
export interface CrossDimensionalAnalysis {
    analysisId: string;
    analysisDate: Date;
    dimensions: string[];
    measures: string[];
    matrix: CrossDimensionalMatrix;
    insights: AnalysisInsight[];
    totalRecords: number;
}
/**
 * Cross-dimensional matrix
 */
export interface CrossDimensionalMatrix {
    rows: DimensionMember[];
    columns: DimensionMember[];
    cells: MatrixCell[][];
    rowTotals: number[];
    columnTotals: number[];
    grandTotal: number;
}
/**
 * Dimension member
 */
export interface DimensionMember {
    dimensionType: string;
    memberCode: string;
    memberName: string;
    level: number;
    parentCode?: string;
}
/**
 * Matrix cell
 */
export interface MatrixCell {
    rowIndex: number;
    columnIndex: number;
    value: number;
    formattedValue: string;
    drillDownAvailable: boolean;
    variance?: number;
    percentOfTotal?: number;
}
/**
 * Analysis insight
 */
export interface AnalysisInsight {
    insightType: 'trend' | 'anomaly' | 'opportunity' | 'risk';
    dimension: string;
    member: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    recommendation?: string;
}
/**
 * Dimensional budget
 */
export interface DimensionalBudget {
    budgetId: string;
    budgetName: string;
    fiscalYear: number;
    dimensions: Map<string, string[]>;
    budgetLines: BudgetLine[];
    totalBudget: number;
    status: 'draft' | 'submitted' | 'approved' | 'active' | 'closed';
}
/**
 * Budget line
 */
export interface BudgetLine {
    lineId: string;
    accountCode: string;
    dimensionValues: Map<string, string>;
    budgetAmount: number;
    actualAmount?: number;
    variance?: number;
    variancePercent?: number;
}
/**
 * Segment profitability
 */
export interface SegmentProfitability {
    segmentType: string;
    segmentCode: string;
    segmentName: string;
    revenue: number;
    directCosts: number;
    allocatedCosts: number;
    totalCosts: number;
    grossProfit: number;
    netProfit: number;
    profitMargin: number;
    contributionMargin: number;
    roi: number;
}
/**
 * Dimension drill-down path
 */
export interface DrillDownPath {
    pathId: string;
    startDimension: string;
    currentLevel: number;
    maxLevel: number;
    path: DrillDownStep[];
    currentValue: number;
    filters: Map<string, string[]>;
}
/**
 * Drill-down step
 */
export interface DrillDownStep {
    stepNumber: number;
    dimensionType: string;
    dimensionCode: string;
    dimensionName: string;
    level: number;
    value: number;
    percentOfParent: number;
    drillable: boolean;
}
/**
 * Dimension consolidation result
 */
export interface DimensionConsolidationResult {
    consolidationId: string;
    consolidationDate: Date;
    consolidationType: 'legal' | 'management' | 'statistical';
    dimensions: string[];
    entities: number[];
    consolidatedValues: Map<string, number>;
    eliminations: EliminationEntry[];
    minorityInterest?: number;
    auditTrail: AuditLogEntry[];
}
/**
 * Dimension variance analysis
 */
export interface DimensionalVarianceAnalysis {
    analysisDate: Date;
    fiscalYear: number;
    fiscalPeriod: number;
    dimensions: string[];
    variances: DimensionVariance[];
    totalFavorable: number;
    totalUnfavorable: number;
    significantVariances: DimensionVariance[];
}
/**
 * Dimension variance
 */
export interface DimensionVariance {
    dimensionType: string;
    dimensionCode: string;
    dimensionName: string;
    budgetAmount: number;
    actualAmount: number;
    variance: number;
    variancePercent: number;
    favorable: boolean;
    explanation?: string;
}
/**
 * Builds complete dimension hierarchy structure
 * Composes: getDimensionsByType, getChildDimensions, getParentDimensions
 */
export declare const buildDimensionHierarchyStructure: (sequelize: any, dimensionType: string, transaction?: Transaction) => Promise<DimensionHierarchyStructure>;
/**
 * Validates dimension hierarchy integrity
 * Composes: buildDimensionHierarchyStructure with validation checks
 */
export declare const validateDimensionHierarchyIntegrity: (sequelize: any, dimensionType: string, userId: string, transaction?: Transaction) => Promise<{
    valid: boolean;
    orphanedNodes: DimensionNode[];
    circularReferences: string[][];
    duplicateCodes: string[];
    errors: string[];
}>;
/**
 * Rebalances dimension hierarchy levels
 * Composes: getDimensionsByType, updateDimension, trackFieldChange
 */
export declare const rebalanceDimensionHierarchyLevels: (sequelize: any, dimensionType: string, userId: string, transaction?: Transaction) => Promise<{
    updated: number;
    levelChanges: Map<string, {
        oldLevel: number;
        newLevel: number;
    }>;
    errors: string[];
}>;
/**
 * Performs cross-dimensional matrix analysis
 * Composes: getDimensionsByType, generateSegmentReporting, performVarianceAnalysis
 */
export declare const performCrossDimensionalMatrixAnalysis: (sequelize: any, rowDimension: string, columnDimension: string, measure: "revenue" | "expense" | "profit" | "budget" | "actual", fiscalYear: number, fiscalPeriod: number, userId: string, transaction?: Transaction) => Promise<CrossDimensionalAnalysis>;
/**
 * Generates multi-dimensional pivot analysis
 * Composes: performCrossDimensionalMatrixAnalysis with multiple measures
 */
export declare const generateMultiDimensionalPivotAnalysis: (sequelize: any, dimensions: string[], measures: string[], fiscalYear: number, fiscalPeriod: number, userId: string, transaction?: Transaction) => Promise<CrossDimensionalAnalysis[]>;
/**
 * Creates dimensional budget with multi-dimensional allocation
 * Composes: createDimension, updateCostCenterBudget, createAuditLog
 */
export declare const createDimensionalBudgetWithAllocation: (sequelize: any, budgetName: string, fiscalYear: number, dimensions: Map<string, string[]>, budgetData: Array<{
    accountCode: string;
    dimensionValues: Map<string, string>;
    amount: number;
}>, userId: string, transaction?: Transaction) => Promise<DimensionalBudget>;
/**
 * Analyzes budget vs actual across dimensions
 * Composes: generateBudgetVsActual, performVarianceAnalysis
 */
export declare const analyzeBudgetVsActualByDimension: (sequelize: any, budgetId: string, fiscalYear: number, fiscalPeriod: number, dimensions: string[], userId: string, transaction?: Transaction) => Promise<DimensionalVarianceAnalysis>;
/**
 * Calculates segment profitability across dimensions
 * Composes: generateSegmentReporting, getCostCenterById, performVarianceAnalysis
 */
export declare const calculateDimensionalSegmentProfitability: (sequelize: any, segmentType: string, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<SegmentProfitability[]>;
/**
 * Creates drill-down path through dimension hierarchy
 * Composes: buildDimensionHierarchyStructure, getDrillDownTransactions
 */
export declare const createDimensionDrillDownPath: (sequelize: any, dimensionType: string, startDimensionCode: string, measure: string, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<DrillDownPath>;
/**
 * Drills down to next level in dimension hierarchy
 * Composes: createDimensionDrillDownPath, getChildDimensions
 */
export declare const drillDownToNextLevel: (sequelize: any, currentPath: DrillDownPath, transaction?: Transaction) => Promise<DrillDownPath>;
/**
 * Consolidates financial data across dimension hierarchies
 * Composes: initiateConsolidation, createEliminationEntry, generateConsolidatedStatement
 */
export declare const consolidateDimensionalFinancials: (sequelize: any, consolidationType: "legal" | "management" | "statistical", dimensions: string[], entityIds: number[], fiscalYear: number, fiscalPeriod: number, userId: string, transaction?: Transaction) => Promise<DimensionConsolidationResult>;
export { buildDimensionHierarchyStructure, validateDimensionHierarchyIntegrity, rebalanceDimensionHierarchyLevels, performCrossDimensionalMatrixAnalysis, generateMultiDimensionalPivotAnalysis, createDimensionalBudgetWithAllocation, analyzeBudgetVsActualByDimension, calculateDimensionalSegmentProfitability, createDimensionDrillDownPath, drillDownToNextLevel, consolidateDimensionalFinancials, };
//# sourceMappingURL=financial-dimensions-analytics-composite.d.ts.map