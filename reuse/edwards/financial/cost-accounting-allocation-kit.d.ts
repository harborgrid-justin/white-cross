/**
 * LOC: COSTACCT001
 * File: /reuse/edwards/financial/cost-accounting-allocation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - date-fns (Date manipulation utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Cost allocation services
 *   - Activity-based costing services
 *   - Product costing modules
 *   - Variance analysis services
 *   - Management reporting modules
 */
/**
 * File: /reuse/edwards/financial/cost-accounting-allocation-kit.ts
 * Locator: WC-FIN-COSTACCT-001
 * Purpose: Comprehensive Cost Accounting and Allocation Management - JD Edwards EnterpriseOne-level cost allocation, ABC costing, variance analysis
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, date-fns 3.x
 * Downstream: ../backend/financial/*, Cost Allocation Services, ABC Services, Product Costing, Variance Analysis, Management Reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+, date-fns 3.x
 * Exports: 45 functions for cost allocation, activity-based costing, cost pools, cost drivers, overhead allocation, standard costing, variance analysis (price, quantity, efficiency), cost centers, product costing, job costing, process costing, service department allocation
 *
 * LLM Context: Enterprise-grade cost accounting and allocation management competing with Oracle JD Edwards EnterpriseOne.
 * Provides comprehensive cost allocation using multiple methods (direct, step-down, reciprocal), activity-based costing (ABC),
 * cost pool management, cost driver analysis, overhead allocation (traditional and ABC), standard costing with multi-level variance analysis
 * (material price/quantity, labor rate/efficiency, overhead spending/volume/efficiency), cost center accounting, product costing,
 * job order costing, process costing, service department cost allocation, transfer pricing, profitability analysis, and compliance reporting.
 */
import { Sequelize, Transaction } from 'sequelize';
export declare class CreateCostCenterDto {
    costCenterCode: string;
    costCenterName: string;
    costCenterType: string;
    departmentCode: string;
    fiscalYear: number;
    budgetAmount?: number;
    managerId?: string;
}
export declare class CreateCostPoolDto {
    costPoolCode: string;
    costPoolName: string;
    costPoolType: string;
    allocationMethod: string;
    fiscalYear: number;
    fiscalPeriod: number;
}
export declare class AllocateOverheadDto {
    costPoolId: number;
    fiscalYear: number;
    fiscalPeriod: number;
    allocationBasis: string;
    totalOverhead: number;
}
export declare class CreateStandardCostDto {
    productId: number;
    productCode: string;
    fiscalYear: number;
    effectiveDate: Date;
    standardMaterialCost: number;
    standardLaborCost: number;
    standardOverheadCost: number;
}
export declare class AnalyzeVarianceDto {
    fiscalYear: number;
    fiscalPeriod: number;
    varianceType: string;
    productCode?: string;
    costCenterCode: string;
    standardAmount: number;
    actualAmount: number;
}
export declare class CreateJobCostDto {
    jobNumber: string;
    jobName: string;
    jobType: string;
    startDate: Date;
    budgetedCost?: number;
    customerId?: number;
}
/**
 * Sequelize model for Cost Centers with budgeting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CostCenter model
 *
 * @example
 * ```typescript
 * const CostCenter = createCostCenterModel(sequelize);
 * const costCenter = await CostCenter.create({
 *   costCenterCode: 'CC-100',
 *   costCenterName: 'Manufacturing',
 *   costCenterType: 'production',
 *   fiscalYear: 2024
 * });
 * ```
 */
export declare const createCostCenterModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        costCenterCode: string;
        costCenterName: string;
        costCenterType: string;
        departmentId: number;
        departmentCode: string;
        isActive: boolean;
        managerId: string | null;
        budgetAmount: number | null;
        fiscalYear: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Cost Pools.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CostPool model
 *
 * @example
 * ```typescript
 * const CostPool = createCostPoolModel(sequelize);
 * const pool = await CostPool.create({
 *   costPoolCode: 'POOL-OH-001',
 *   costPoolName: 'Factory Overhead',
 *   costPoolType: 'overhead',
 *   allocationMethod: 'activity-based'
 * });
 * ```
 */
export declare const createCostPoolModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        costPoolCode: string;
        costPoolName: string;
        costPoolType: string;
        allocationMethod: string;
        fiscalYear: number;
        fiscalPeriod: number;
        totalCost: number;
        allocatedCost: number;
        unallocatedCost: number;
        isActive: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
    };
};
/**
 * Creates a new cost center.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateCostCenterDto} costCenterData - Cost center data
 * @param {string} userId - User creating the cost center
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created cost center
 *
 * @example
 * ```typescript
 * const costCenter = await createCostCenter(sequelize, {
 *   costCenterCode: 'CC-100',
 *   costCenterName: 'Manufacturing Department',
 *   costCenterType: 'production',
 *   departmentCode: 'DEPT-MFG',
 *   fiscalYear: 2024,
 *   budgetAmount: 500000
 * }, 'user123');
 * ```
 */
export declare const createCostCenter: (sequelize: Sequelize, costCenterData: CreateCostCenterDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves a cost center by ID.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} costCenterId - Cost center ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cost center record
 *
 * @example
 * ```typescript
 * const costCenter = await getCostCenterById(sequelize, 1);
 * ```
 */
export declare const getCostCenterById: (sequelize: Sequelize, costCenterId: number, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves a cost center by code.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} costCenterCode - Cost center code
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cost center record
 *
 * @example
 * ```typescript
 * const costCenter = await getCostCenterByCode(sequelize, 'CC-100');
 * ```
 */
export declare const getCostCenterByCode: (sequelize: Sequelize, costCenterCode: string, transaction?: Transaction) => Promise<any>;
/**
 * Lists all cost centers with optional filtering.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} [filters] - Filter criteria
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of cost centers
 *
 * @example
 * ```typescript
 * const costCenters = await listCostCenters(sequelize, {
 *   costCenterType: 'production',
 *   fiscalYear: 2024
 * });
 * ```
 */
export declare const listCostCenters: (sequelize: Sequelize, filters?: any, transaction?: Transaction) => Promise<any[]>;
/**
 * Updates cost center budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} costCenterId - Cost center ID
 * @param {number} budgetAmount - New budget amount
 * @param {string} userId - User updating the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated cost center
 *
 * @example
 * ```typescript
 * const updated = await updateCostCenterBudget(sequelize, 1, 550000, 'user123');
 * ```
 */
export declare const updateCostCenterBudget: (sequelize: Sequelize, costCenterId: number, budgetAmount: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Creates a new cost pool.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateCostPoolDto} poolData - Cost pool data
 * @param {string} userId - User creating the pool
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created cost pool
 *
 * @example
 * ```typescript
 * const pool = await createCostPool(sequelize, {
 *   costPoolCode: 'POOL-OH-001',
 *   costPoolName: 'Manufacturing Overhead',
 *   costPoolType: 'overhead',
 *   allocationMethod: 'activity-based',
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1
 * }, 'user123');
 * ```
 */
export declare const createCostPool: (sequelize: Sequelize, poolData: CreateCostPoolDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Adds cost to a cost pool.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} costPoolId - Cost pool ID
 * @param {number} costAmount - Amount to add
 * @param {string} userId - User adding cost
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated cost pool
 *
 * @example
 * ```typescript
 * const pool = await addCostToPool(sequelize, 1, 15000, 'user123');
 * ```
 */
export declare const addCostToPool: (sequelize: Sequelize, costPoolId: number, costAmount: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves a cost pool by ID.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} costPoolId - Cost pool ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cost pool record
 *
 * @example
 * ```typescript
 * const pool = await getCostPoolById(sequelize, 1);
 * ```
 */
export declare const getCostPoolById: (sequelize: Sequelize, costPoolId: number, transaction?: Transaction) => Promise<any>;
/**
 * Allocates overhead using direct method.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {AllocateOverheadDto} allocationData - Allocation data
 * @param {any[]} costCenters - Target cost centers with basis units
 * @param {string} userId - User performing allocation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Allocation record with lines
 *
 * @example
 * ```typescript
 * const allocation = await allocateOverheadDirect(sequelize, {
 *   costPoolId: 1,
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   allocationBasis: 'direct-labor-hours',
 *   totalOverhead: 100000
 * }, [
 *   { costCenterId: 1, costCenterCode: 'CC-100', basisUnits: 500 },
 *   { costCenterId: 2, costCenterCode: 'CC-200', basisUnits: 300 }
 * ], 'user123');
 * ```
 */
export declare const allocateOverheadDirect: (sequelize: Sequelize, allocationData: AllocateOverheadDto, costCenters: any[], userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Allocates service department costs using step-down method.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {any[]} serviceDepartments - Service departments with costs and allocation bases
 * @param {any[]} productionDepartments - Production departments
 * @param {string} userId - User performing allocation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Allocation records
 *
 * @example
 * ```typescript
 * const allocations = await allocateServiceCostsStepDown(
 *   sequelize,
 *   2024,
 *   1,
 *   [
 *     { departmentCode: 'SD-100', totalCost: 50000, allocationBasis: 'employees', sequence: 1 },
 *     { departmentCode: 'SD-200', totalCost: 30000, allocationBasis: 'square-feet', sequence: 2 }
 *   ],
 *   [
 *     { departmentCode: 'PD-100', employees: 50, squareFeet: 10000 },
 *     { departmentCode: 'PD-200', employees: 30, squareFeet: 8000 }
 *   ],
 *   'user123'
 * );
 * ```
 */
export declare const allocateServiceCostsStepDown: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, serviceDepartments: any[], productionDepartments: any[], userId: string, transaction?: Transaction) => Promise<any[]>;
/**
 * Allocates overhead using activity-based costing (ABC).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} costPoolId - Cost pool ID
 * @param {any[]} activities - Activities with costs and drivers
 * @param {any[]} products - Products with activity consumption
 * @param {string} userId - User performing allocation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} ABC allocation results
 *
 * @example
 * ```typescript
 * const abcAllocation = await allocateOverheadABC(
 *   sequelize,
 *   1,
 *   [
 *     { activityCode: 'SETUP', activityCost: 50000, driverUnits: 100, driverType: 'setups' },
 *     { activityCode: 'INSPECT', activityCost: 30000, driverUnits: 600, driverType: 'inspections' }
 *   ],
 *   [
 *     { productCode: 'PROD-A', setups: 40, inspections: 200 },
 *     { productCode: 'PROD-B', setups: 60, inspections: 400 }
 *   ],
 *   'user123'
 * );
 * ```
 */
export declare const allocateOverheadABC: (sequelize: Sequelize, costPoolId: number, activities: any[], products: any[], userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Calculates predetermined overhead rate.
 *
 * @param {number} estimatedOverhead - Estimated total overhead
 * @param {number} estimatedActivityBase - Estimated activity base (e.g., labor hours, machine hours)
 * @returns {number} Predetermined overhead rate
 *
 * @example
 * ```typescript
 * const rate = calculatePredeterminedOverheadRate(500000, 25000);
 * // Returns: 20 (per labor hour)
 * ```
 */
export declare const calculatePredeterminedOverheadRate: (estimatedOverhead: number, estimatedActivityBase: number) => number;
/**
 * Applies overhead to a job or product using predetermined rate.
 *
 * @param {number} predeterminedRate - Predetermined overhead rate
 * @param {number} actualActivityBase - Actual activity base consumed
 * @returns {number} Applied overhead amount
 *
 * @example
 * ```typescript
 * const appliedOverhead = applyOverheadToJob(20, 150);
 * // Returns: 3000 (for 150 labor hours at $20/hour)
 * ```
 */
export declare const applyOverheadToJob: (predeterminedRate: number, actualActivityBase: number) => number;
/**
 * Creates a standard cost record for a product.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateStandardCostDto} standardCostData - Standard cost data
 * @param {string} userId - User creating the standard cost
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created standard cost record
 *
 * @example
 * ```typescript
 * const standardCost = await createStandardCost(sequelize, {
 *   productId: 1,
 *   productCode: 'PROD-A',
 *   fiscalYear: 2024,
 *   effectiveDate: new Date('2024-01-01'),
 *   standardMaterialCost: 25.00,
 *   standardLaborCost: 15.00,
 *   standardOverheadCost: 10.00
 * }, 'user123');
 * ```
 */
export declare const createStandardCost: (sequelize: Sequelize, standardCostData: CreateStandardCostDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves current standard cost for a product.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} productId - Product ID
 * @param {Date} effectiveDate - Effective date for standard cost
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Standard cost record
 *
 * @example
 * ```typescript
 * const standardCost = await getStandardCostForProduct(
 *   sequelize,
 *   1,
 *   new Date('2024-06-01')
 * );
 * ```
 */
export declare const getStandardCostForProduct: (sequelize: Sequelize, productId: number, effectiveDate: Date, transaction?: Transaction) => Promise<any>;
/**
 * Calculates material price variance.
 *
 * @param {number} standardPrice - Standard price per unit
 * @param {number} actualPrice - Actual price per unit
 * @param {number} actualQuantity - Actual quantity purchased/used
 * @returns {any} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = calculateMaterialPriceVariance(5.00, 5.25, 1000);
 * // Returns: { variance: -250, favorableUnfavorable: 'unfavorable' }
 * ```
 */
export declare const calculateMaterialPriceVariance: (standardPrice: number, actualPrice: number, actualQuantity: number) => any;
/**
 * Calculates material quantity variance.
 *
 * @param {number} standardQuantity - Standard quantity allowed
 * @param {number} actualQuantity - Actual quantity used
 * @param {number} standardPrice - Standard price per unit
 * @returns {any} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = calculateMaterialQuantityVariance(950, 1000, 5.00);
 * // Returns: { variance: -250, favorableUnfavorable: 'unfavorable' }
 * ```
 */
export declare const calculateMaterialQuantityVariance: (standardQuantity: number, actualQuantity: number, standardPrice: number) => any;
/**
 * Calculates labor rate variance.
 *
 * @param {number} standardRate - Standard labor rate per hour
 * @param {number} actualRate - Actual labor rate per hour
 * @param {number} actualHours - Actual hours worked
 * @returns {any} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = calculateLaborRateVariance(20.00, 21.50, 500);
 * // Returns: { variance: -750, favorableUnfavorable: 'unfavorable' }
 * ```
 */
export declare const calculateLaborRateVariance: (standardRate: number, actualRate: number, actualHours: number) => any;
/**
 * Calculates labor efficiency variance.
 *
 * @param {number} standardHours - Standard hours allowed
 * @param {number} actualHours - Actual hours worked
 * @param {number} standardRate - Standard labor rate per hour
 * @returns {any} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = calculateLaborEfficiencyVariance(480, 500, 20.00);
 * // Returns: { variance: -400, favorableUnfavorable: 'unfavorable' }
 * ```
 */
export declare const calculateLaborEfficiencyVariance: (standardHours: number, actualHours: number, standardRate: number) => any;
/**
 * Calculates overhead spending variance.
 *
 * @param {number} budgetedOverhead - Budgeted overhead at actual hours
 * @param {number} actualOverhead - Actual overhead incurred
 * @returns {any} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = calculateOverheadSpendingVariance(12000, 12500);
 * // Returns: { variance: -500, favorableUnfavorable: 'unfavorable' }
 * ```
 */
export declare const calculateOverheadSpendingVariance: (budgetedOverhead: number, actualOverhead: number) => any;
/**
 * Calculates overhead volume variance.
 *
 * @param {number} standardHours - Standard hours allowed for actual production
 * @param {number} budgetedHours - Budgeted hours (denominator level)
 * @param {number} fixedOverheadRate - Fixed overhead rate per hour
 * @returns {any} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = calculateOverheadVolumeVariance(950, 1000, 10.00);
 * // Returns: { variance: -500, favorableUnfavorable: 'unfavorable' }
 * ```
 */
export declare const calculateOverheadVolumeVariance: (standardHours: number, budgetedHours: number, fixedOverheadRate: number) => any;
/**
 * Calculates overhead efficiency variance.
 *
 * @param {number} standardHours - Standard hours allowed
 * @param {number} actualHours - Actual hours worked
 * @param {number} variableOverheadRate - Variable overhead rate per hour
 * @returns {any} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = calculateOverheadEfficiencyVariance(480, 500, 8.00);
 * // Returns: { variance: -160, favorableUnfavorable: 'unfavorable' }
 * ```
 */
export declare const calculateOverheadEfficiencyVariance: (standardHours: number, actualHours: number, variableOverheadRate: number) => any;
/**
 * Performs comprehensive variance analysis for a product/job.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} productId - Product ID
 * @param {any} standardCosts - Standard costs
 * @param {any} actualCosts - Actual costs
 * @param {string} userId - User performing analysis
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Array of variance records
 *
 * @example
 * ```typescript
 * const variances = await performComprehensiveVarianceAnalysis(
 *   sequelize,
 *   1,
 *   {
 *     materialPrice: 5.00,
 *     materialQuantity: 950,
 *     laborRate: 20.00,
 *     laborHours: 480,
 *     overheadRate: 18.00
 *   },
 *   {
 *     materialPrice: 5.25,
 *     materialQuantity: 1000,
 *     laborRate: 21.50,
 *     laborHours: 500,
 *     actualOverhead: 9500
 *   },
 *   'user123'
 * );
 * ```
 */
export declare const performComprehensiveVarianceAnalysis: (sequelize: Sequelize, productId: number, standardCosts: any, actualCosts: any, userId: string, transaction?: Transaction) => Promise<any[]>;
/**
 * Creates a new job cost record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateJobCostDto} jobData - Job data
 * @param {string} userId - User creating the job
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created job cost record
 *
 * @example
 * ```typescript
 * const job = await createJobCost(sequelize, {
 *   jobNumber: 'JOB-2024-001',
 *   jobName: 'Custom Equipment Build',
 *   jobType: 'production',
 *   startDate: new Date('2024-01-15'),
 *   budgetedCost: 50000,
 *   customerId: 123
 * }, 'user123');
 * ```
 */
export declare const createJobCost: (sequelize: Sequelize, jobData: CreateJobCostDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Adds material cost to a job.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} jobId - Job ID
 * @param {number} materialCost - Material cost to add
 * @param {string} userId - User adding cost
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated job
 *
 * @example
 * ```typescript
 * const job = await addMaterialCostToJob(sequelize, 1, 5000, 'user123');
 * ```
 */
export declare const addMaterialCostToJob: (sequelize: Sequelize, jobId: number, materialCost: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Adds labor cost to a job.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} jobId - Job ID
 * @param {number} laborHours - Labor hours
 * @param {number} laborRate - Labor rate per hour
 * @param {string} userId - User adding cost
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated job
 *
 * @example
 * ```typescript
 * const job = await addLaborCostToJob(sequelize, 1, 40, 25.00, 'user123');
 * ```
 */
export declare const addLaborCostToJob: (sequelize: Sequelize, jobId: number, laborHours: number, laborRate: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Applies overhead to a job.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} jobId - Job ID
 * @param {number} overheadRate - Overhead rate
 * @param {number} allocationBase - Allocation base (e.g., labor hours)
 * @param {string} userId - User applying overhead
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated job
 *
 * @example
 * ```typescript
 * const job = await applyOverheadToJobCost(sequelize, 1, 15.00, 40, 'user123');
 * // Applies $600 overhead (40 hours * $15/hour)
 * ```
 */
export declare const applyOverheadToJobCost: (sequelize: Sequelize, jobId: number, overheadRate: number, allocationBase: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Calculates job cost variance (budget vs actual).
 *
 * @param {number} budgetedCost - Budgeted job cost
 * @param {number} actualCost - Actual job cost
 * @returns {any} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = calculateJobCostVariance(50000, 52500);
 * // Returns: { variance: -2500, variancePercent: -5.0 }
 * ```
 */
export declare const calculateJobCostVariance: (budgetedCost: number, actualCost: number) => any;
/**
 * Closes a completed job.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} jobId - Job ID
 * @param {Date} completionDate - Completion date
 * @param {string} userId - User closing the job
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Closed job
 *
 * @example
 * ```typescript
 * const job = await closeJob(sequelize, 1, new Date(), 'user123');
 * ```
 */
export declare const closeJob: (sequelize: Sequelize, jobId: number, completionDate: Date, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Calculates product cost using job-order costing.
 *
 * @param {number} directMaterialCost - Direct material cost
 * @param {number} directLaborCost - Direct labor cost
 * @param {number} overheadCost - Overhead cost
 * @param {number} quantityProduced - Quantity produced
 * @returns {any} Product cost details
 *
 * @example
 * ```typescript
 * const productCost = calculateProductCostJobOrder(
 *   10000,
 *   8000,
 *   6000,
 *   500
 * );
 * // Returns: { totalCost: 24000, unitCost: 48.00 }
 * ```
 */
export declare const calculateProductCostJobOrder: (directMaterialCost: number, directLaborCost: number, overheadCost: number, quantityProduced: number) => any;
/**
 * Calculates product cost using process costing.
 *
 * @param {number} totalCost - Total process cost
 * @param {number} equivalentUnits - Equivalent units of production
 * @returns {any} Product cost per equivalent unit
 *
 * @example
 * ```typescript
 * const processCost = calculateProductCostProcess(50000, 2000);
 * // Returns: { costPerEquivalentUnit: 25.00 }
 * ```
 */
export declare const calculateProductCostProcess: (totalCost: number, equivalentUnits: number) => any;
/**
 * Calculates equivalent units of production (weighted average method).
 *
 * @param {number} unitsCompleted - Units completed and transferred out
 * @param {number} endingWIPUnits - Ending work-in-process units
 * @param {number} endingWIPPercentComplete - Ending WIP percent complete
 * @returns {number} Equivalent units
 *
 * @example
 * ```typescript
 * const equivalentUnits = calculateEquivalentUnits(800, 200, 0.50);
 * // Returns: 900 (800 + 200 * 0.50)
 * ```
 */
export declare const calculateEquivalentUnits: (unitsCompleted: number, endingWIPUnits: number, endingWIPPercentComplete: number) => number;
/**
 * Analyzes cost behavior using high-low method.
 *
 * @param {number} highActivityLevel - High activity level
 * @param {number} highCost - Cost at high activity level
 * @param {number} lowActivityLevel - Low activity level
 * @param {number} lowCost - Cost at low activity level
 * @returns {any} Variable and fixed cost components
 *
 * @example
 * ```typescript
 * const costBehavior = analyzeCostBehaviorHighLow(1000, 15000, 400, 9000);
 * // Returns: { variableCostPerUnit: 10, fixedCost: 5000 }
 * ```
 */
export declare const analyzeCostBehaviorHighLow: (highActivityLevel: number, highCost: number, lowActivityLevel: number, lowCost: number) => any;
/**
 * Calculates contribution margin.
 *
 * @param {number} salesRevenue - Sales revenue
 * @param {number} variableCosts - Variable costs
 * @returns {any} Contribution margin details
 *
 * @example
 * ```typescript
 * const cm = calculateContributionMargin(100000, 60000);
 * // Returns: { contributionMargin: 40000, cmRatio: 0.40 }
 * ```
 */
export declare const calculateContributionMargin: (salesRevenue: number, variableCosts: number) => any;
/**
 * Calculates break-even point in units and dollars.
 *
 * @param {number} fixedCosts - Total fixed costs
 * @param {number} pricePerUnit - Selling price per unit
 * @param {number} variableCostPerUnit - Variable cost per unit
 * @returns {any} Break-even analysis
 *
 * @example
 * ```typescript
 * const breakEven = calculateBreakEvenPoint(50000, 100, 60);
 * // Returns: { breakEvenUnits: 1250, breakEvenDollars: 125000 }
 * ```
 */
export declare const calculateBreakEvenPoint: (fixedCosts: number, pricePerUnit: number, variableCostPerUnit: number) => any;
/**
 * Generates profitability report by product/service.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Profitability analysis by product
 *
 * @example
 * ```typescript
 * const profitability = await generateProfitabilityReport(sequelize, 2024, 1);
 * ```
 */
export declare const generateProfitabilityReport: (sequelize: Sequelize, fiscalYear: number, fiscalPeriod: number, transaction?: Transaction) => Promise<any[]>;
//# sourceMappingURL=cost-accounting-allocation-kit.d.ts.map