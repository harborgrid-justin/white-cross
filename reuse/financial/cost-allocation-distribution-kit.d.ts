/**
 * LOC: COSTALOC001
 * File: /reuse/financial/cost-allocation-distribution-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - CEFMS financial modules
 *   - Cost accounting services
 *   - Budget allocation controllers
 *   - Activity-based costing engines
 */
/**
 * File: /reuse/financial/cost-allocation-distribution-kit.ts
 * Locator: WC-FIN-COST-001
 * Purpose: Comprehensive Cost Allocation & Distribution Utilities - USACE CEFMS-level enterprise cost center management, overhead allocation, activity-based costing
 *
 * Upstream: Independent financial utility module for cost allocation and distribution
 * Downstream: ../backend/*, CEFMS integration, cost controllers, financial reporting, management accounting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, Decimal.js
 * Exports: 45+ utility functions for cost centers, cost allocation, overhead distribution, ABC, cost pooling, driver analysis, variance analysis
 *
 * LLM Context: Enterprise-grade cost allocation utilities for USACE CEFMS-level financial management systems.
 * Provides comprehensive cost center management, multiple allocation methods (direct, step-down, reciprocal, activity-based),
 * overhead distribution, cost pooling, cost driver identification and analysis, service department allocation, joint cost
 * allocation, variance analysis, budget allocation, cost apportionment, absorption costing, standard costing, transfer pricing,
 * and complete audit trails for management accounting and cost control.
 */
import { Sequelize, Transaction } from 'sequelize';
import Decimal from 'decimal.js';
interface CostCenterMetadata {
    managerName?: string;
    managerEmployeeId?: string;
    departmentCode?: string;
    division?: string;
    businessUnit?: string;
    location?: string;
    accountingEntity?: string;
    budgetCode?: string;
    customAttributes?: Record<string, any>;
}
type CostCenterType = 'production' | 'service' | 'support' | 'administrative' | 'revenue' | 'cost' | 'profit' | 'investment';
type CostCenterStatus = 'active' | 'inactive' | 'closed' | 'pending-approval';
type AllocationMethod = 'direct' | 'step-down' | 'reciprocal' | 'activity-based' | 'proportional' | 'equal' | 'usage-based' | 'weighted-average';
type AllocationBasis = 'direct-labor-hours' | 'direct-labor-cost' | 'machine-hours' | 'square-footage' | 'headcount' | 'revenue' | 'units-produced' | 'custom';
interface AllocationRule {
    id: string;
    name: string;
    sourceCostCenterId: number;
    targetCostCenterIds: number[];
    method: AllocationMethod;
    basis: AllocationBasis;
    percentage?: number;
    priority?: number;
    effectiveDate: Date;
    expirationDate?: Date;
    conditions?: Record<string, any>;
}
interface CostPool {
    id: string;
    name: string;
    description: string;
    poolType: 'overhead' | 'service' | 'support' | 'joint' | 'indirect';
    totalCost: Decimal;
    costCenterIds: number[];
    allocationBasis: AllocationBasis;
    costDrivers: CostDriver[];
}
interface CostDriver {
    driverId: string;
    driverName: string;
    driverType: 'volume' | 'transaction' | 'duration' | 'complexity';
    measurementUnit: string;
    totalDriverQuantity: number;
    costPerDriver?: Decimal;
}
interface ActivityCost {
    activityId: string;
    activityName: string;
    activityCategory: 'unit-level' | 'batch-level' | 'product-level' | 'facility-level';
    totalCost: Decimal;
    costDriverId: string;
    costPerDriverUnit: Decimal;
}
interface AllocationResult {
    sourceCostCenter: string;
    targetCostCenter: string;
    allocationAmount: Decimal;
    allocationBasis: AllocationBasis;
    basisQuantity: number;
    rate: Decimal;
    percentage: number;
    fiscalPeriod: string;
}
interface CostVariance {
    costCenterId: number;
    fiscalPeriod: string;
    actualCost: Decimal;
    budgetedCost: Decimal;
    variance: Decimal;
    variancePercentage: number;
    isFavorable: boolean;
    varianceType: 'spending' | 'efficiency' | 'volume' | 'price';
}
interface ServiceDepartmentAllocation {
    serviceDepartmentId: number;
    productionDepartmentIds: number[];
    totalServiceCost: Decimal;
    allocationBasis: AllocationBasis;
    allocations: Map<number, Decimal>;
}
interface JointCostAllocation {
    jointProcessCost: Decimal;
    jointProducts: JointProduct[];
    allocationMethod: 'physical-units' | 'sales-value' | 'net-realizable-value' | 'constant-gross-margin';
    allocations: Map<string, Decimal>;
}
interface JointProduct {
    productId: string;
    productName: string;
    physicalUnits?: number;
    salesValue?: Decimal;
    additionalProcessingCost?: Decimal;
    finalSalesValue?: Decimal;
}
interface OverheadRate {
    rateId: string;
    rateName: string;
    costPoolId: string;
    rateType: 'predetermined' | 'actual' | 'standard';
    rateAmount: Decimal;
    rateBasis: AllocationBasis;
    fiscalPeriod: string;
    calculationDate: Date;
}
interface TransferPrice {
    fromCostCenterId: number;
    toCostCenterId: number;
    productOrServiceId: string;
    transferPriceMethod: 'market-based' | 'cost-based' | 'negotiated' | 'cost-plus';
    transferPriceAmount: Decimal;
    quantity: number;
    totalValue: Decimal;
    effectiveDate: Date;
}
interface AbsorptionCostingData {
    directMaterialCost: Decimal;
    directLaborCost: Decimal;
    variableOverhead: Decimal;
    fixedOverhead: Decimal;
    totalAbsorptionCost: Decimal;
    unitsProduced: number;
    costPerUnit: Decimal;
}
interface StandardCost {
    costElementId: string;
    costElementName: string;
    standardQuantity: number;
    standardPrice: Decimal;
    standardCost: Decimal;
    actualQuantity?: number;
    actualPrice?: Decimal;
    actualCost?: Decimal;
}
type CalculationResult<T> = {
    success: boolean;
    result?: T;
    error?: string;
    warnings?: string[];
    metadata?: Record<string, any>;
};
/**
 * Sequelize model for Cost Centers with hierarchical structure and management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CostCenter model
 *
 * @example
 * ```typescript
 * const CostCenter = createCostCenterModel(sequelize);
 * const center = await CostCenter.create({
 *   centerNumber: 'CC-1001',
 *   centerName: 'Manufacturing - Assembly Line 1',
 *   centerType: 'production',
 *   status: 'active',
 *   parentCenterId: null,
 *   budgetAmount: new Decimal('500000'),
 *   metadata: {
 *     managerName: 'John Smith',
 *     departmentCode: 'MFG-001'
 *   }
 * });
 * ```
 */
export declare const createCostCenterModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        centerNumber: string;
        centerName: string;
        centerType: CostCenterType;
        status: CostCenterStatus;
        description: string | null;
        parentCenterId: number | null;
        hierarchyLevel: number;
        hierarchyPath: string;
        isLeafNode: boolean;
        budgetAmount: number;
        actualCost: number;
        allocatedCost: number;
        totalCost: number;
        fiscalYear: number;
        metadata: CostCenterMetadata;
        allowDirectCharges: boolean;
        allowAllocations: boolean;
        isServiceDepartment: boolean;
        accountingCode: string | null;
        glAccountRange: string | null;
        costPoolIds: string[];
        effectiveDate: Date;
        terminationDate: Date | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Cost Allocations tracking all allocation transactions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CostAllocation model
 *
 * @example
 * ```typescript
 * const CostAllocation = createCostAllocationModel(sequelize);
 * const allocation = await CostAllocation.create({
 *   sourceCostCenterId: 100,
 *   targetCostCenterId: 200,
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   allocationAmount: new Decimal('15000'),
 *   allocationMethod: 'activity-based',
 *   allocationBasis: 'direct-labor-hours'
 * });
 * ```
 */
export declare const createCostAllocationModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        allocationNumber: string;
        sourceCostCenterId: number;
        targetCostCenterId: number;
        fiscalYear: number;
        fiscalPeriod: number;
        allocationDate: Date;
        allocationAmount: number;
        allocationMethod: AllocationMethod;
        allocationBasis: AllocationBasis;
        basisQuantity: number | null;
        allocationRate: number | null;
        allocationPercentage: number | null;
        costPoolId: string | null;
        activityId: string | null;
        ruleId: string | null;
        description: string | null;
        posted: boolean;
        postedDate: Date | null;
        postedBy: string | null;
        journalEntryId: string | null;
        reversalAllocationId: number | null;
        isReversal: boolean;
        approvedBy: string | null;
        approvalDate: Date | null;
        readonly createdAt: Date;
        readonly createdBy: string;
    };
};
/**
 * Sequelize model for Cost Pools grouping related costs for allocation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CostPool model
 */
export declare const createCostPoolModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        poolName: string;
        poolType: string;
        description: string | null;
        fiscalYear: number;
        totalPoolCost: number;
        allocatedCost: number;
        unallocatedCost: number;
        allocationBasis: AllocationBasis;
        costCenterIds: number[];
        costDrivers: CostDriver[];
        isActive: boolean;
        allocationFrequency: "monthly" | "quarterly" | "annual" | "on-demand";
        lastAllocationDate: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Activity-Based Costing activities and rates.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ABCActivity model
 */
export declare const createABCActivityModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        activityName: string;
        activityCategory: string;
        description: string | null;
        costPoolId: string;
        totalActivityCost: number;
        costDriverId: string;
        costDriverName: string;
        totalDriverQuantity: number;
        costPerDriverUnit: number;
        fiscalYear: number;
        fiscalPeriod: number;
        isActive: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new cost center with validation and hierarchy management.
 *
 * @param {any} centerData - Cost center data
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<CalculationResult<any>>} Created cost center
 *
 * @example
 * ```typescript
 * const result = await createCostCenter({
 *   centerNumber: 'CC-2001',
 *   centerName: 'IT Services',
 *   centerType: 'service',
 *   parentCenterId: 100,
 *   budgetAmount: new Decimal('250000'),
 *   fiscalYear: 2024
 * }, transaction);
 * ```
 */
export declare function createCostCenter(centerData: any, transaction: Transaction): Promise<CalculationResult<any>>;
/**
 * Updates cost center hierarchy when parent changes.
 *
 * @param {number} costCenterId - Cost center ID
 * @param {number | null} newParentId - New parent ID
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<CalculationResult<any>>} Update result
 */
export declare function updateCostCenterHierarchy(costCenterId: number, newParentId: number | null, transaction: Transaction): Promise<CalculationResult<any>>;
/**
 * Calculates total cost for a cost center including allocations.
 *
 * @param {number} costCenterId - Cost center ID
 * @param {Decimal} actualCost - Direct actual costs
 * @param {Decimal} allocatedCost - Allocated costs from other centers
 * @returns {CalculationResult<Decimal>} Total cost
 */
export declare function calculateTotalCostCenterCost(costCenterId: number, actualCost: Decimal, allocatedCost: Decimal): CalculationResult<Decimal>;
/**
 * Validates cost center data against business rules.
 *
 * @param {any} centerData - Cost center data
 * @returns {CalculationResult<boolean>} Validation result
 */
export declare function validateCostCenterData(centerData: any): CalculationResult<boolean>;
/**
 * Gets all child cost centers recursively.
 *
 * @param {number} parentCenterId - Parent cost center ID
 * @param {any[]} allCenters - All cost centers
 * @returns {any[]} Array of child cost centers
 */
export declare function getChildCostCenters(parentCenterId: number, allCenters: any[]): any[];
/**
 * Calculates cost center variance (actual vs. budget).
 *
 * @param {Decimal} actualCost - Actual cost
 * @param {Decimal} budgetedCost - Budgeted cost
 * @returns {CalculationResult<CostVariance>} Variance analysis
 */
export declare function calculateCostCenterVariance(actualCost: Decimal, budgetedCost: Decimal): CalculationResult<Omit<CostVariance, 'costCenterId' | 'fiscalPeriod' | 'varianceType'>>;
/**
 * Generates cost center hierarchy tree structure.
 *
 * @param {any[]} costCenters - All cost centers
 * @param {number | null} rootParentId - Root parent ID (null for top level)
 * @returns {any[]} Hierarchical tree structure
 */
export declare function buildCostCenterTree(costCenters: any[], rootParentId?: number | null): any[];
/**
 * Closes a cost center and transfers remaining costs.
 *
 * @param {number} costCenterId - Cost center to close
 * @param {number} transferToCenterId - Target cost center for cost transfer
 * @param {Date} closureDate - Closure date
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<CalculationResult<any>>} Closure result
 */
export declare function closeCostCenter(costCenterId: number, transferToCenterId: number, closureDate: Date, transaction: Transaction): Promise<CalculationResult<any>>;
/**
 * Performs direct cost allocation from source to target cost centers.
 *
 * @param {number} sourceCenterId - Source cost center
 * @param {number[]} targetCenterIds - Target cost centers
 * @param {Decimal} totalAmount - Total amount to allocate
 * @param {AllocationBasis} basis - Allocation basis
 * @param {Record<number, number>} basisQuantities - Basis quantities per target
 * @returns {CalculationResult<AllocationResult[]>} Allocation results
 *
 * @example
 * ```typescript
 * const allocation = performDirectAllocation(
 *   100, // IT Services
 *   [200, 201, 202], // Production departments
 *   new Decimal('50000'),
 *   'headcount',
 *   { 200: 25, 201: 30, 202: 20 }
 * );
 * ```
 */
export declare function performDirectAllocation(sourceCenterId: number, targetCenterIds: number[], totalAmount: Decimal, basis: AllocationBasis, basisQuantities: Record<number, number>): CalculationResult<AllocationResult[]>;
/**
 * Performs step-down allocation method for service departments.
 *
 * @param {ServiceDepartmentAllocation[]} serviceDepartments - Service departments in priority order
 * @param {number[]} productionDepartmentIds - Production departments
 * @param {Record<number, Record<number, number>>} basisMatrix - Basis quantities
 * @returns {CalculationResult<AllocationResult[]>} Step-down allocation results
 *
 * @example
 * ```typescript
 * const allocation = performStepDownAllocation(
 *   [
 *     { serviceDepartmentId: 100, totalServiceCost: new Decimal('30000'), ... },
 *     { serviceDepartmentId: 101, totalServiceCost: new Decimal('20000'), ... }
 *   ],
 *   [200, 201, 202],
 *   { 100: { 101: 10, 200: 20, 201: 25, 202: 15 }, ... }
 * );
 * ```
 */
export declare function performStepDownAllocation(serviceDepartments: ServiceDepartmentAllocation[], productionDepartmentIds: number[], basisMatrix: Record<number, Record<number, number>>): CalculationResult<AllocationResult[]>;
/**
 * Performs reciprocal allocation method using simultaneous equations.
 *
 * @param {ServiceDepartmentAllocation[]} serviceDepartments - Service departments
 * @param {number[]} productionDepartmentIds - Production departments
 * @param {Record<number, Record<number, number>>} serviceMatrix - Service percentages
 * @returns {CalculationResult<AllocationResult[]>} Reciprocal allocation results
 */
export declare function performReciprocalAllocation(serviceDepartments: ServiceDepartmentAllocation[], productionDepartmentIds: number[], serviceMatrix: Record<number, Record<number, number>>): CalculationResult<AllocationResult[]>;
/**
 * Performs activity-based costing allocation.
 *
 * @param {ActivityCost[]} activities - Activities with costs
 * @param {Record<string, Record<string, number>>} activityConsumption - Activity consumption by cost object
 * @returns {CalculationResult<AllocationResult[]>} ABC allocation results
 *
 * @example
 * ```typescript
 * const allocation = performActivityBasedAllocation(
 *   [
 *     {
 *       activityId: 'A001',
 *       activityName: 'Machine Setup',
 *       totalCost: new Decimal('15000'),
 *       costDriverId: 'setups',
 *       costPerDriverUnit: new Decimal('500')
 *     }
 *   ],
 *   { 'Product-A': { 'A001': 10 }, 'Product-B': { 'A001': 20 } }
 * );
 * ```
 */
export declare function performActivityBasedAllocation(activities: ActivityCost[], activityConsumption: Record<string, Record<string, number>>): CalculationResult<AllocationResult[]>;
/**
 * Allocates joint costs using specified method.
 *
 * @param {JointCostAllocation} jointCost - Joint cost data
 * @returns {CalculationResult<Map<string, Decimal>>} Allocated costs per product
 *
 * @example
 * ```typescript
 * const allocation = allocateJointCosts({
 *   jointProcessCost: new Decimal('100000'),
 *   jointProducts: [
 *     { productId: 'P1', physicalUnits: 5000, salesValue: new Decimal('80000') },
 *     { productId: 'P2', physicalUnits: 3000, salesValue: new Decimal('60000') }
 *   ],
 *   allocationMethod: 'sales-value'
 * });
 * ```
 */
export declare function allocateJointCosts(jointCost: JointCostAllocation): CalculationResult<Map<string, Decimal>>;
/**
 * Calculates predetermined overhead rate.
 *
 * @param {Decimal} estimatedOverhead - Estimated overhead costs
 * @param {number} estimatedBasisQuantity - Estimated basis (hours, units, etc.)
 * @param {AllocationBasis} basis - Allocation basis
 * @returns {CalculationResult<OverheadRate>} Predetermined overhead rate
 */
export declare function calculatePredeterminedOverheadRate(estimatedOverhead: Decimal, estimatedBasisQuantity: number, basis: AllocationBasis): CalculationResult<Partial<OverheadRate>>;
/**
 * Applies overhead to cost objects using predetermined rate.
 *
 * @param {OverheadRate} rate - Overhead rate
 * @param {Record<string, number>} actualBasisQuantities - Actual basis per cost object
 * @returns {CalculationResult<Record<string, Decimal>>} Applied overhead per cost object
 */
export declare function applyOverheadRate(rate: OverheadRate, actualBasisQuantities: Record<string, number>): CalculationResult<Record<string, Decimal>>;
/**
 * Calculates overhead variance (applied vs. actual).
 *
 * @param {Decimal} actualOverhead - Actual overhead incurred
 * @param {Decimal} appliedOverhead - Overhead applied to production
 * @returns {CalculationResult<{variance: Decimal; isOverApplied: boolean}>}
 */
export declare function calculateOverheadVariance(actualOverhead: Decimal, appliedOverhead: Decimal): CalculationResult<{
    variance: Decimal;
    isOverApplied: boolean;
    variancePercentage: number;
}>;
/**
 * Validates allocation rules for consistency and completeness.
 *
 * @param {AllocationRule[]} rules - Allocation rules to validate
 * @returns {CalculationResult<boolean>} Validation result with warnings
 */
export declare function validateAllocationRules(rules: AllocationRule[]): CalculationResult<boolean>;
/**
 * Generates allocation schedule based on rules and priorities.
 *
 * @param {AllocationRule[]} rules - Allocation rules
 * @returns {AllocationRule[]} Sorted allocation schedule
 */
export declare function generateAllocationSchedule(rules: AllocationRule[]): AllocationRule[];
/**
 * Reverses a cost allocation transaction.
 *
 * @param {number} allocationId - Original allocation ID
 * @param {string} reversalReason - Reason for reversal
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<CalculationResult<any>>} Reversal result
 */
export declare function reverseAllocation(allocationId: number, reversalReason: string, transaction: Transaction): Promise<CalculationResult<any>>;
/**
 * Performs proportional allocation based on percentages.
 *
 * @param {Decimal} totalAmount - Total amount to allocate
 * @param {Record<number, number>} percentages - Percentages per cost center
 * @returns {CalculationResult<Record<number, Decimal>>} Allocated amounts
 */
export declare function performProportionalAllocation(totalAmount: Decimal, percentages: Record<number, number>): CalculationResult<Record<number, Decimal>>;
/**
 * Calculates absorption cost per unit.
 *
 * @param {AbsorptionCostingData} data - Absorption costing data
 * @returns {CalculationResult<AbsorptionCostingData>} Complete absorption cost
 *
 * @example
 * ```typescript
 * const cost = calculateAbsorptionCost({
 *   directMaterialCost: new Decimal('50000'),
 *   directLaborCost: new Decimal('30000'),
 *   variableOverhead: new Decimal('15000'),
 *   fixedOverhead: new Decimal('25000'),
 *   unitsProduced: 1000
 * });
 * ```
 */
export declare function calculateAbsorptionCost(data: Omit<AbsorptionCostingData, 'totalAbsorptionCost' | 'costPerUnit'>): CalculationResult<AbsorptionCostingData>;
/**
 * Calculates variable costing (contribution margin approach).
 *
 * @param {Decimal} directMaterialCost - Direct materials
 * @param {Decimal} directLaborCost - Direct labor
 * @param {Decimal} variableOverhead - Variable overhead
 * @param {number} unitsProduced - Units produced
 * @returns {CalculationResult<{totalVariableCost: Decimal; costPerUnit: Decimal}>}
 */
export declare function calculateVariableCost(directMaterialCost: Decimal, directLaborCost: Decimal, variableOverhead: Decimal, unitsProduced: number): CalculationResult<{
    totalVariableCost: Decimal;
    costPerUnit: Decimal;
}>;
/**
 * Calculates standard cost variance (actual vs. standard).
 *
 * @param {StandardCost} standardCost - Standard cost data
 * @returns {CalculationResult<any>} Variance analysis
 */
export declare function calculateStandardCostVariance(standardCost: StandardCost): CalculationResult<any>;
/**
 * Calculates transfer price using specified method.
 *
 * @param {TransferPrice} transferData - Transfer price data
 * @param {Decimal} marketPrice - Market price (if applicable)
 * @param {Decimal} fullCost - Full cost (if applicable)
 * @returns {CalculationResult<TransferPrice>} Transfer price calculation
 */
export declare function calculateTransferPrice(transferData: Omit<TransferPrice, 'transferPriceAmount' | 'totalValue'>, marketPrice?: Decimal, fullCost?: Decimal): CalculationResult<TransferPrice>;
/**
 * Analyzes cost behavior (fixed vs. variable) using high-low method.
 *
 * @param {Array<{activity: number; cost: Decimal}>} data - Historical data points
 * @returns {CalculationResult<{fixedCost: Decimal; variableCostPerUnit: Decimal}>}
 */
export declare function analyzeCostBehavior(data: Array<{
    activity: number;
    cost: Decimal;
}>): CalculationResult<{
    fixedCost: Decimal;
    variableCostPerUnit: Decimal;
    equation: string;
}>;
/**
 * Calculates break-even point in units and revenue.
 *
 * @param {Decimal} fixedCosts - Total fixed costs
 * @param {Decimal} variableCostPerUnit - Variable cost per unit
 * @param {Decimal} sellingPricePerUnit - Selling price per unit
 * @returns {CalculationResult<{breakEvenUnits: Decimal; breakEvenRevenue: Decimal}>}
 */
export declare function calculateBreakEvenPoint(fixedCosts: Decimal, variableCostPerUnit: Decimal, sellingPricePerUnit: Decimal): CalculationResult<{
    breakEvenUnits: Decimal;
    breakEvenRevenue: Decimal;
    contributionMargin: Decimal;
}>;
/**
 * Performs cost-volume-profit (CVP) analysis.
 *
 * @param {Decimal} fixedCosts - Fixed costs
 * @param {Decimal} variableCostPerUnit - Variable cost per unit
 * @param {Decimal} sellingPricePerUnit - Selling price per unit
 * @param {number} targetProfit - Target profit
 * @returns {CalculationResult<any>} CVP analysis results
 */
export declare function performCVPAnalysis(fixedCosts: Decimal, variableCostPerUnit: Decimal, sellingPricePerUnit: Decimal, targetProfit: Decimal): CalculationResult<any>;
/**
 * Calculates cost driver rates for ABC system.
 *
 * @param {CostPool} costPool - Cost pool data
 * @returns {CalculationResult<CostDriver[]>} Cost drivers with rates
 */
export declare function calculateCostDriverRates(costPool: CostPool): CalculationResult<CostDriver[]>;
/**
 * Allocates support department costs using multiple methods.
 *
 * @param {number[]} supportDeptIds - Support department IDs
 * @param {number[]} operatingDeptIds - Operating department IDs
 * @param {Record<number, Decimal>} supportCosts - Support department costs
 * @param {AllocationMethod} method - Allocation method
 * @returns {CalculationResult<AllocationResult[]>} Allocation results
 */
export declare function allocateSupportDepartmentCosts(supportDeptIds: number[], operatingDeptIds: number[], supportCosts: Record<number, Decimal>, method: AllocationMethod): CalculationResult<AllocationResult[]>;
/**
 * Generates cost driver hierarchy for ABC implementation.
 *
 * @param {ActivityCost[]} activities - Activity costs
 * @returns {Record<string, ActivityCost[]>} Activities grouped by category
 */
export declare function generateCostDriverHierarchy(activities: ActivityCost[]): Record<string, ActivityCost[]>;
/**
 * Calculates activity-based cost per unit for a product.
 *
 * @param {string} productId - Product ID
 * @param {ActivityCost[]} activities - Activities consumed
 * @param {Record<string, number>} activityConsumption - Activity quantities consumed
 * @param {number} unitsProduced - Units produced
 * @returns {CalculationResult<{totalCost: Decimal; costPerUnit: Decimal}>}
 */
export declare function calculateActivityBasedCostPerUnit(productId: string, activities: ActivityCost[], activityConsumption: Record<string, number>, unitsProduced: number): CalculationResult<{
    totalCost: Decimal;
    costPerUnit: Decimal;
    activityBreakdown: Record<string, Decimal>;
}>;
/**
 * Performs make-or-buy cost analysis.
 *
 * @param {Decimal} makeCost - Total cost to make internally
 * @param {Decimal} buyCost - Total cost to buy externally
 * @param {Decimal} avoidableFixedCosts - Fixed costs that can be avoided
 * @returns {CalculationResult<{decision: string; savings: Decimal}>}
 */
export declare function performMakeOrBuyAnalysis(makeCost: Decimal, buyCost: Decimal, avoidableFixedCosts: Decimal): CalculationResult<{
    decision: string;
    savings: Decimal;
    relevantMakeCost: Decimal;
}>;
/**
 * Calculates capacity utilization and idle capacity cost.
 *
 * @param {number} actualCapacity - Actual capacity used
 * @param {number} totalCapacity - Total available capacity
 * @param {Decimal} totalFixedCost - Total fixed cost
 * @returns {CalculationResult<any>} Capacity analysis
 */
export declare function analyzeCapacityUtilization(actualCapacity: number, totalCapacity: number, totalFixedCost: Decimal): CalculationResult<any>;
/**
 * Performs incremental cost analysis for decision making.
 *
 * @param {Decimal} incrementalRevenue - Additional revenue
 * @param {Decimal} incrementalCosts - Additional costs
 * @returns {CalculationResult<{incrementalProfit: Decimal; acceptable: boolean}>}
 */
export declare function analyzeIncrementalCosts(incrementalRevenue: Decimal, incrementalCosts: Decimal): CalculationResult<{
    incrementalProfit: Decimal;
    acceptable: boolean;
    roi: number;
}>;
/**
 * Calculates relevant costs for decision making.
 *
 * @param {Decimal} totalCosts - Total costs
 * @param {Decimal} sunkCosts - Sunk costs (not relevant)
 * @param {Decimal} committedCosts - Committed costs (not relevant)
 * @returns {CalculationResult<Decimal>} Relevant costs
 */
export declare function calculateRelevantCosts(totalCosts: Decimal, sunkCosts: Decimal, committedCosts: Decimal): CalculationResult<Decimal>;
/**
 * Generates cost center performance report.
 *
 * @param {any[]} costCenters - Cost centers
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {CalculationResult<any[]>} Performance report
 */
export declare function generateCostCenterPerformanceReport(costCenters: any[], fiscalYear: number, fiscalPeriod: number): CalculationResult<any[]>;
/**
 * Generates allocation summary by method.
 *
 * @param {any[]} allocations - Allocation records
 * @param {number} fiscalYear - Fiscal year
 * @returns {CalculationResult<Record<AllocationMethod, any>>} Summary by method
 */
export declare function generateAllocationSummary(allocations: any[], fiscalYear: number): CalculationResult<Record<string, any>>;
/**
 * Generates cost pool utilization report.
 *
 * @param {any[]} costPools - Cost pools
 * @param {number} fiscalYear - Fiscal year
 * @returns {CalculationResult<any[]>} Utilization report
 */
export declare function generateCostPoolUtilizationReport(costPools: any[], fiscalYear: number): CalculationResult<any[]>;
/**
 * Generates activity cost analysis for ABC.
 *
 * @param {any[]} activities - ABC activities
 * @param {number} fiscalYear - Fiscal year
 * @returns {CalculationResult<any>} Activity analysis
 */
export declare function generateActivityCostAnalysis(activities: any[], fiscalYear: number): CalculationResult<any>;
/**
 * Exports cost allocation data to specified format.
 *
 * @param {any[]} allocations - Allocation data
 * @param {string} format - Export format
 * @returns {CalculationResult<any>} Exported data
 */
export declare function exportCostAllocationData(allocations: any[], format: 'csv' | 'json' | 'excel'): CalculationResult<any>;
/**
 * Calculates cost center ROI.
 *
 * @param {Decimal} revenue - Revenue generated
 * @param {Decimal} totalCost - Total cost
 * @returns {CalculationResult<{roi: number; margin: number}>}
 */
export declare function calculateCostCenterROI(revenue: Decimal, totalCost: Decimal): CalculationResult<{
    roi: number;
    margin: number;
    profit: Decimal;
}>;
/**
 * Generates budget vs. actual variance report.
 *
 * @param {any[]} costCenters - Cost centers with budget and actual
 * @param {number} fiscalYear - Fiscal year
 * @returns {CalculationResult<any[]>} Variance report
 */
export declare function generateBudgetVarianceReport(costCenters: any[], fiscalYear: number): CalculationResult<any[]>;
/**
 * Generates overhead absorption analysis.
 *
 * @param {Decimal} actualOverhead - Actual overhead
 * @param {Decimal} appliedOverhead - Applied overhead
 * @param {number} actualActivity - Actual activity level
 * @param {number} budgetedActivity - Budgeted activity level
 * @returns {CalculationResult<any>} Overhead analysis
 */
export declare function generateOverheadAbsorptionAnalysis(actualOverhead: Decimal, appliedOverhead: Decimal, actualActivity: number, budgetedActivity: number): CalculationResult<any>;
/**
 * Validates period-end cost allocations for completeness.
 *
 * @param {any[]} costCenters - Cost centers
 * @param {any[]} allocations - Allocations for period
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {CalculationResult<any>} Validation result
 */
export declare function validatePeriodEndAllocations(costCenters: any[], allocations: any[], fiscalYear: number, fiscalPeriod: number): CalculationResult<any>;
/**
 * Performs period-end cost allocation closing.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} transaction - Sequelize transaction
 * @returns {Promise<CalculationResult<any>>} Closing summary
 */
export declare function performPeriodEndClosing(fiscalYear: number, fiscalPeriod: number, transaction: Transaction): Promise<CalculationResult<any>>;
export {};
//# sourceMappingURL=cost-allocation-distribution-kit.d.ts.map