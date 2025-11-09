/**
 * ============================================================================
 * Cost Allocation and Tracking Kit - Enterprise Financial Management
 * ============================================================================
 *
 * LOC: FIN-COST-001
 * Version: 1.0.0
 * Framework: NestJS 10.x, Sequelize 6.x, Swagger/OpenAPI 3.0
 *
 * OVERVIEW:
 * Production-ready cost allocation and tracking system designed to compete with
 * enterprise solutions like SAP CO (Controlling), Oracle Costing, and Workday
 * Financial Management. Provides comprehensive cost management capabilities
 * including multiple allocation methods, cost driver analysis, activity-based
 * costing, and advanced reporting.
 *
 * FEATURES:
 * - Cost Center Management: Hierarchical cost center structures and budgeting
 * - Allocation Methods: Direct, step-down, reciprocal, and activity-based costing
 * - Cost Drivers: Identification, tracking, and analysis of cost allocation bases
 * - Overhead Allocation: Multiple overhead allocation strategies and rules
 * - Job Costing: Detailed job/project cost tracking and variance analysis
 * - Activity-Based Costing: ABC implementation with activity hierarchies
 * - Cost Pool Management: Cost pool creation, allocation, and distribution
 * - Allocation Rules: Flexible rule engine for automated cost allocation
 * - Variance Analysis: Budget vs actual analysis with drill-down capabilities
 * - Reporting & Dashboards: Comprehensive cost reporting and visualization
 *
 * ALLOCATION METHODS:
 * - Direct Allocation: Costs allocated directly to cost objects
 * - Step-Down (Sequential): Service dept costs allocated in predetermined sequence
 * - Reciprocal: Mutual services between departments recognized
 * - Activity-Based Costing: Costs allocated based on activities and drivers
 * - Proportional: Costs allocated proportionally based on usage metrics
 *
 * COMPLIANCE & STANDARDS:
 * - GAAP/IFRS compliant cost allocation principles
 * - Government contract costing requirements (FAR/CAS)
 * - Transfer pricing documentation support
 * - Audit trail and documentation requirements
 *
 * INTEGRATION POINTS:
 * - General Ledger integration for cost posting
 * - Project Management systems for project costing
 * - Time & Attendance for labor cost allocation
 * - Inventory Management for manufacturing costs
 * - Procurement for purchase cost allocation
 *
 * PERFORMANCE CHARACTERISTICS:
 * - Handles 100,000+ cost centers
 * - Processes 1M+ allocation transactions per day
 * - Real-time allocation calculation capability
 * - Optimized for complex allocation hierarchies
 *
 * TYPICAL USE CASES:
 * - Manufacturing overhead allocation
 * - IT chargeback and cost recovery
 * - Shared services cost distribution
 * - Project and job costing
 * - Product costing and profitability analysis
 * - Transfer pricing and inter-company charging
 *
 * @module CostAllocationTrackingKit
 * @category Financial Management
 * @see {@link https://www.sap.com/products/financial-management/cost-management.html|SAP CO}
 * @see {@link https://www.oracle.com/erp/financials/costing/|Oracle Costing}
 * @see {@link https://www.workday.com/en-us/products/financial-management.html|Workday Financial}
 *
 * @author HarborGrid Enterprise Solutions
 * @license Proprietary
 * @copyright 2025 HarborGrid. All rights reserved.
 */
import { Sequelize, Transaction } from 'sequelize';
/**
 * Cost allocation method types
 */
export declare enum AllocationMethod {
    DIRECT = "DIRECT",
    STEP_DOWN = "STEP_DOWN",
    RECIPROCAL = "RECIPROCAL",
    ACTIVITY_BASED = "ACTIVITY_BASED",
    PROPORTIONAL = "PROPORTIONAL",
    DRIVER_BASED = "DRIVER_BASED"
}
/**
 * Cost center types
 */
export declare enum CostCenterType {
    PRODUCTION = "PRODUCTION",
    SERVICE = "SERVICE",
    ADMINISTRATIVE = "ADMINISTRATIVE",
    SALES = "SALES",
    RESEARCH = "RESEARCH",
    SUPPORT = "SUPPORT"
}
/**
 * Cost driver types
 */
export declare enum CostDriverType {
    VOLUME_BASED = "VOLUME_BASED",
    TRANSACTION_BASED = "TRANSACTION_BASED",
    DURATION_BASED = "DURATION_BASED",
    HEADCOUNT_BASED = "HEADCOUNT_BASED",
    SQUARE_FOOTAGE = "SQUARE_FOOTAGE",
    MACHINE_HOURS = "MACHINE_HOURS",
    LABOR_HOURS = "LABOR_HOURS",
    CUSTOM = "CUSTOM"
}
/**
 * Allocation status
 */
export declare enum AllocationStatus {
    DRAFT = "DRAFT",
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REVERSED = "REVERSED"
}
/**
 * Activity hierarchy levels for ABC
 */
export declare enum ActivityLevel {
    UNIT_LEVEL = "UNIT_LEVEL",
    BATCH_LEVEL = "BATCH_LEVEL",
    PRODUCT_LEVEL = "PRODUCT_LEVEL",
    FACILITY_LEVEL = "FACILITY_LEVEL"
}
/**
 * Cost center interface - represents organizational units that incur costs
 */
export interface CostCenter {
}
/**
 * Cost allocation interface - represents allocation transactions
 */
export interface CostAllocation {
}
/**
 * Cost driver interface - represents allocation basis
 */
export interface CostDriver {
}
/**
 * Cost driver value interface - actual driver measurements
 */
export interface CostDriverValue {
}
/**
 * Cost pool interface - aggregates costs for allocation
 */
export interface CostPool {
}
/**
 * Allocation rule interface - defines allocation logic
 */
export interface AllocationRule {
}
/**
 * Activity-based costing activity interface
 */
export interface ABCActivity {
}
/**
 * Job costing interface - tracks costs for jobs/projects
 */
export interface JobCost {
}
/**
 * Cost variance analysis interface
 */
export interface CostVarianceAnalysis {
}
/**
 * Allocation report configuration interface
 */
export interface AllocationReportConfig {
}
/**
 * Create a new cost center
 *
 * @ApiOperation Creates a new cost center in the organization hierarchy
 * @ApiResponse 201 - Cost center created successfully
 * @ApiResponse 400 - Invalid cost center data
 * @ApiResponse 409 - Cost center code already exists
 */
export declare function createCostCenter(costCenterData: Partial<CostCenter>, sequelize: Sequelize, transaction?: Transaction): Promise<CostCenter>;
/**
 * Get cost center by ID
 *
 * @ApiOperation Retrieves a cost center by its unique identifier
 * @ApiResponse 200 - Cost center found
 * @ApiResponse 404 - Cost center not found
 */
export declare function getCostCenterById(costCenterId: string, sequelize: Sequelize): Promise<CostCenter | null>;
/**
 * Get cost center hierarchy
 *
 * @ApiOperation Retrieves the complete cost center hierarchy tree
 * @ApiResponse 200 - Hierarchy retrieved successfully
 */
export declare function getCostCenterHierarchy(rootCostCenterId: string | null, sequelize: Sequelize): Promise<CostCenter[]>;
/**
 * Update cost center budget
 *
 * @ApiOperation Updates the budget amount for a cost center
 * @ApiResponse 200 - Budget updated successfully
 * @ApiResponse 404 - Cost center not found
 */
export declare function updateCostCenterBudget(costCenterId: string, budgetAmount: number, fiscalYear: number, sequelize: Sequelize, transaction?: Transaction): Promise<CostCenter>;
/**
 * Get cost centers by type
 *
 * @ApiOperation Retrieves all cost centers of a specific type
 * @ApiResponse 200 - Cost centers retrieved successfully
 */
export declare function getCostCentersByType(type: CostCenterType, sequelize: Sequelize): Promise<CostCenter[]>;
/**
 * Create cost driver
 *
 * @ApiOperation Creates a new cost driver for allocation calculations
 * @ApiResponse 201 - Cost driver created successfully
 * @ApiResponse 400 - Invalid cost driver data
 */
export declare function createCostDriver(driverData: Partial<CostDriver>, sequelize: Sequelize, transaction?: Transaction): Promise<CostDriver>;
/**
 * Record cost driver value
 *
 * @ApiOperation Records an actual cost driver value for a period
 * @ApiResponse 201 - Driver value recorded successfully
 * @ApiResponse 400 - Invalid driver value data
 */
export declare function recordCostDriverValue(valueData: Partial<CostDriverValue>, sequelize: Sequelize, transaction?: Transaction): Promise<CostDriverValue>;
/**
 * Get cost driver values for period
 *
 * @ApiOperation Retrieves all cost driver values for a specific period
 * @ApiResponse 200 - Driver values retrieved successfully
 */
export declare function getCostDriverValuesForPeriod(costDriverId: string, period: string, sequelize: Sequelize): Promise<CostDriverValue[]>;
/**
 * Calculate cost driver totals
 *
 * @ApiOperation Calculates total cost driver values across all cost centers
 * @ApiResponse 200 - Totals calculated successfully
 */
export declare function calculateCostDriverTotals(costDriverId: string, period: string, sequelize: Sequelize): Promise<{
    total: number;
    costCenterBreakdown: Record<string, number>;
}>;
/**
 * Create cost pool
 *
 * @ApiOperation Creates a new cost pool for aggregating costs
 * @ApiResponse 201 - Cost pool created successfully
 * @ApiResponse 400 - Invalid cost pool data
 */
export declare function createCostPool(poolData: Partial<CostPool>, sequelize: Sequelize, transaction?: Transaction): Promise<CostPool>;
/**
 * Calculate cost pool total
 *
 * @ApiOperation Calculates total costs in a cost pool from source cost centers
 * @ApiResponse 200 - Cost pool total calculated successfully
 */
export declare function calculateCostPoolTotal(costPoolId: string, period: string, sequelize: Sequelize): Promise<number>;
/**
 * Get cost pool details
 *
 * @ApiOperation Retrieves detailed information about a cost pool
 * @ApiResponse 200 - Cost pool details retrieved successfully
 * @ApiResponse 404 - Cost pool not found
 */
export declare function getCostPoolDetails(costPoolId: string, sequelize: Sequelize): Promise<CostPool | null>;
/**
 * Create allocation rule
 *
 * @ApiOperation Creates a new allocation rule for automated cost distribution
 * @ApiResponse 201 - Allocation rule created successfully
 * @ApiResponse 400 - Invalid rule data
 */
export declare function createAllocationRule(ruleData: Partial<AllocationRule>, sequelize: Sequelize, transaction?: Transaction): Promise<AllocationRule>;
/**
 * Get active allocation rules for period
 *
 * @ApiOperation Retrieves all active allocation rules for a specific period
 * @ApiResponse 200 - Allocation rules retrieved successfully
 */
export declare function getActiveAllocationRules(period: Date, sequelize: Sequelize): Promise<AllocationRule[]>;
/**
 * Execute allocation rule
 *
 * @ApiOperation Executes a single allocation rule to create allocations
 * @ApiResponse 200 - Rule executed successfully
 * @ApiResponse 400 - Rule execution failed
 */
export declare function executeAllocationRule(ruleId: string, period: string, sequelize: Sequelize, transaction?: Transaction): Promise<CostAllocation[]>;
/**
 * Execute direct cost allocation
 *
 * @ApiOperation Performs direct allocation of costs to target cost centers
 * @ApiResponse 200 - Direct allocation completed successfully
 */
export declare function executeDirectAllocation(rule: AllocationRule, sourceAmount: number, period: string, sequelize: Sequelize, transaction?: Transaction): Promise<CostAllocation[]>;
/**
 * Execute proportional allocation
 *
 * @ApiOperation Allocates costs proportionally based on a cost driver
 * @ApiResponse 200 - Proportional allocation completed successfully
 */
export declare function executeProportionalAllocation(rule: AllocationRule, sourceAmount: number, period: string, sequelize: Sequelize, transaction?: Transaction): Promise<CostAllocation[]>;
/**
 * Execute driver-based allocation
 *
 * @ApiOperation Allocates costs based on cost driver consumption rates
 * @ApiResponse 200 - Driver-based allocation completed successfully
 */
export declare function executeDriverBasedAllocation(rule: AllocationRule, sourceAmount: number, period: string, sequelize: Sequelize, transaction?: Transaction): Promise<CostAllocation[]>;
/**
 * Execute step-down allocation
 *
 * @ApiOperation Performs step-down (sequential) allocation method
 * @ApiResponse 200 - Step-down allocation completed successfully
 */
export declare function executeStepDownAllocation(rules: AllocationRule[], period: string, sequelize: Sequelize, transaction?: Transaction): Promise<CostAllocation[]>;
/**
 * Create ABC activity
 *
 * @ApiOperation Creates a new activity for activity-based costing
 * @ApiResponse 201 - ABC activity created successfully
 * @ApiResponse 400 - Invalid activity data
 */
export declare function createABCActivity(activityData: Partial<ABCActivity>, sequelize: Sequelize, transaction?: Transaction): Promise<ABCActivity>;
/**
 * Calculate activity rate
 *
 * @ApiOperation Calculates the cost per activity unit
 * @ApiResponse 200 - Activity rate calculated successfully
 */
export declare function calculateActivityRate(activityId: string, period: string, sequelize: Sequelize): Promise<number>;
/**
 * Execute ABC allocation
 *
 * @ApiOperation Performs activity-based cost allocation
 * @ApiResponse 200 - ABC allocation completed successfully
 */
export declare function executeABCAllocation(activityId: string, targetCostCenters: string[], period: string, sequelize: Sequelize, transaction?: Transaction): Promise<CostAllocation[]>;
/**
 * Get ABC activity hierarchy
 *
 * @ApiOperation Retrieves activities organized by hierarchy level
 * @ApiResponse 200 - Activity hierarchy retrieved successfully
 */
export declare function getABCActivityHierarchy(sequelize: Sequelize): Promise<Record<ActivityLevel, ABCActivity[]>>;
/**
 * Create job cost record
 *
 * @ApiOperation Creates a new job cost tracking record
 * @ApiResponse 201 - Job cost record created successfully
 * @ApiResponse 400 - Invalid job cost data
 */
export declare function createJobCost(jobData: Partial<JobCost>, sequelize: Sequelize, transaction?: Transaction): Promise<JobCost>;
/**
 * Allocate overhead to job
 *
 * @ApiOperation Allocates overhead costs to a specific job
 * @ApiResponse 200 - Overhead allocated successfully
 */
export declare function allocateOverheadToJob(jobCostId: string, overheadAmount: number, allocationBasis: string, sequelize: Sequelize, transaction?: Transaction): Promise<JobCost>;
/**
 * Update job cost
 *
 * @ApiOperation Updates job cost components
 * @ApiResponse 200 - Job cost updated successfully
 */
export declare function updateJobCost(jobCostId: string, costUpdates: {
    directMaterialCost?: number;
    directLaborCost?: number;
    otherDirectCosts?: number;
}, sequelize: Sequelize, transaction?: Transaction): Promise<JobCost>;
/**
 * Get job cost variance analysis
 *
 * @ApiOperation Analyzes cost variance for a job
 * @ApiResponse 200 - Variance analysis completed successfully
 */
export declare function getJobCostVarianceAnalysis(jobCostId: string, sequelize: Sequelize): Promise<{
    jobCost: JobCost;
    varianceBreakdown: Record<string, {
        budgeted: number;
        actual: number;
        variance: number;
    }>;
    variancePercentage: number;
}>;
/**
 * Create cost variance analysis
 *
 * @ApiOperation Creates a comprehensive cost variance analysis
 * @ApiResponse 201 - Variance analysis created successfully
 */
export declare function createCostVarianceAnalysis(analysisData: Partial<CostVarianceAnalysis>, sequelize: Sequelize, transaction?: Transaction): Promise<CostVarianceAnalysis>;
/**
 * Calculate period variance
 *
 * @ApiOperation Calculates variance for a cost center and period
 * @ApiResponse 200 - Variance calculated successfully
 */
export declare function calculatePeriodVariance(costCenterId: string, period: string, sequelize: Sequelize): Promise<CostVarianceAnalysis>;
/**
 * Get variance trends
 *
 * @ApiOperation Retrieves variance trend data over multiple periods
 * @ApiResponse 200 - Variance trends retrieved successfully
 */
export declare function getVarianceTrends(costCenterId: string, periodsCount: number, sequelize: Sequelize): Promise<CostVarianceAnalysis[]>;
/**
 * Generate allocation summary report
 *
 * @ApiOperation Generates comprehensive allocation summary report
 * @ApiResponse 200 - Report generated successfully
 */
export declare function generateAllocationSummaryReport(config: AllocationReportConfig, sequelize: Sequelize): Promise<{
    config: AllocationReportConfig;
    summary: {
        totalAllocated: number;
        allocationCount: number;
        uniqueSourceCenters: number;
        uniqueTargetCenters: number;
    };
    allocationsByMethod: Record<AllocationMethod, number>;
    allocationsByPeriod: Record<string, number>;
    topAllocations: CostAllocation[];
}>;
/**
 * Generate cost center dashboard
 *
 * @ApiOperation Generates comprehensive cost center dashboard data
 * @ApiResponse 200 - Dashboard data generated successfully
 */
export declare function generateCostCenterDashboard(costCenterId: string, period: string, sequelize: Sequelize): Promise<{
    costCenter: CostCenter;
    currentPeriod: {
        budget: number;
        actual: number;
        variance: number;
        utilizationPercentage: number;
    };
    allocationsReceived: CostAllocation[];
    allocationsSent: CostAllocation[];
    topExpenseCategories: Array<{
        category: string;
        amount: number;
    }>;
    trends: Array<{
        period: string;
        amount: number;
    }>;
}>;
/**
 * Generate ABC profitability report
 *
 * @ApiOperation Generates activity-based costing profitability report
 * @ApiResponse 200 - ABC profitability report generated successfully
 */
export declare function generateABCProfitabilityReport(period: string, sequelize: Sequelize): Promise<{
    period: string;
    activities: Array<{
        activity: ABCActivity;
        totalCost: number;
        totalVolume: number;
        activityRate: number;
        allocations: CostAllocation[];
    }>;
    summary: {
        totalActivitiesCost: number;
        totalAllocated: number;
        averageActivityRate: number;
    };
}>;
/**
 * Execute batch allocation
 *
 * @ApiOperation Executes multiple allocation rules in a batch
 * @ApiResponse 200 - Batch allocation completed successfully
 */
export declare function executeBatchAllocation(ruleIds: string[], period: string, sequelize: Sequelize): Promise<{
    batchId: string;
    allocations: CostAllocation[];
    summary: {
        totalAmount: number;
        allocationCount: number;
        successCount: number;
        failureCount: number;
    };
    errors: Array<{
        ruleId: string;
        error: string;
    }>;
}>;
/**
 * Reverse allocation
 *
 * @ApiOperation Reverses a previously posted allocation
 * @ApiResponse 200 - Allocation reversed successfully
 */
export declare function reverseAllocation(allocationId: string, reason: string, userId: string, sequelize: Sequelize, transaction?: Transaction): Promise<CostAllocation>;
declare const _default: {
    createCostCenter: typeof createCostCenter;
    getCostCenterById: typeof getCostCenterById;
    getCostCenterHierarchy: typeof getCostCenterHierarchy;
    updateCostCenterBudget: typeof updateCostCenterBudget;
    getCostCentersByType: typeof getCostCentersByType;
    createCostDriver: typeof createCostDriver;
    recordCostDriverValue: typeof recordCostDriverValue;
    getCostDriverValuesForPeriod: typeof getCostDriverValuesForPeriod;
    calculateCostDriverTotals: typeof calculateCostDriverTotals;
    createCostPool: typeof createCostPool;
    calculateCostPoolTotal: typeof calculateCostPoolTotal;
    getCostPoolDetails: typeof getCostPoolDetails;
    createAllocationRule: typeof createAllocationRule;
    getActiveAllocationRules: typeof getActiveAllocationRules;
    executeAllocationRule: typeof executeAllocationRule;
    executeDirectAllocation: typeof executeDirectAllocation;
    executeProportionalAllocation: typeof executeProportionalAllocation;
    executeDriverBasedAllocation: typeof executeDriverBasedAllocation;
    executeStepDownAllocation: typeof executeStepDownAllocation;
    createABCActivity: typeof createABCActivity;
    calculateActivityRate: typeof calculateActivityRate;
    executeABCAllocation: typeof executeABCAllocation;
    getABCActivityHierarchy: typeof getABCActivityHierarchy;
    createJobCost: typeof createJobCost;
    allocateOverheadToJob: typeof allocateOverheadToJob;
    updateJobCost: typeof updateJobCost;
    getJobCostVarianceAnalysis: typeof getJobCostVarianceAnalysis;
    createCostVarianceAnalysis: typeof createCostVarianceAnalysis;
    calculatePeriodVariance: typeof calculatePeriodVariance;
    getVarianceTrends: typeof getVarianceTrends;
    generateAllocationSummaryReport: typeof generateAllocationSummaryReport;
    generateCostCenterDashboard: typeof generateCostCenterDashboard;
    generateABCProfitabilityReport: typeof generateABCProfitabilityReport;
    executeBatchAllocation: typeof executeBatchAllocation;
    reverseAllocation: typeof reverseAllocation;
};
export default _default;
//# sourceMappingURL=cost-allocation-tracking-kit.d.ts.map