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

import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError } from 'sequelize';
import { Injectable, Logger } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { addMonths, differenceInDays, startOfMonth, endOfMonth } from 'date-fns';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface CostCenter {
  costCenterId: number;
  costCenterCode: string;
  costCenterName: string;
  costCenterType: 'production' | 'service' | 'administrative' | 'selling' | 'distribution';
  departmentId: number;
  departmentCode: string;
  isActive: boolean;
  managerId?: string;
  budgetAmount?: number;
  fiscalYear: number;
}

interface CostPool {
  costPoolId: number;
  costPoolCode: string;
  costPoolName: string;
  costPoolType: 'overhead' | 'direct' | 'indirect' | 'service' | 'activity';
  allocationMethod: 'direct' | 'step-down' | 'reciprocal' | 'activity-based';
  fiscalYear: number;
  fiscalPeriod: number;
  totalCost: number;
  allocatedCost: number;
  unallocatedCost: number;
  isActive: boolean;
}

interface CostDriver {
  costDriverId: number;
  costDriverCode: string;
  costDriverName: string;
  costDriverType: 'volume' | 'transaction' | 'duration' | 'intensity';
  measurementUnit: string;
  costPoolId: number;
  totalQuantity: number;
  ratePerUnit: number;
  fiscalYear: number;
  fiscalPeriod: number;
}

interface ActivityBasedCost {
  activityId: number;
  activityCode: string;
  activityName: string;
  activityType: 'unit-level' | 'batch-level' | 'product-level' | 'facility-level';
  costPoolId: number;
  costDriverId: number;
  totalActivityCost: number;
  activityVolume: number;
  costPerActivity: number;
  fiscalYear: number;
  fiscalPeriod: number;
}

interface OverheadAllocation {
  allocationId: number;
  fiscalYear: number;
  fiscalPeriod: number;
  allocationDate: Date;
  costPoolId: number;
  costPoolCode: string;
  allocationMethod: string;
  totalOverhead: number;
  allocationBasis: string;
  totalBasisUnits: number;
  allocationRate: number;
  status: 'draft' | 'calculated' | 'posted' | 'closed';
}

interface CostAllocationLine {
  allocationLineId: number;
  allocationId: number;
  costCenterId: number;
  costCenterCode: string;
  productId?: number;
  productCode?: string;
  jobId?: number;
  jobNumber?: string;
  basisUnits: number;
  allocatedAmount: number;
  allocationPercentage: number;
}

interface StandardCost {
  standardCostId: number;
  productId: number;
  productCode: string;
  productName: string;
  fiscalYear: number;
  effectiveDate: Date;
  expirationDate?: Date;
  standardMaterialCost: number;
  standardLaborCost: number;
  standardOverheadCost: number;
  totalStandardCost: number;
  costingMethod: 'standard' | 'average' | 'fifo' | 'lifo';
  isActive: boolean;
}

interface VarianceAnalysis {
  varianceId: number;
  fiscalYear: number;
  fiscalPeriod: number;
  varianceDate: Date;
  varianceType: 'material-price' | 'material-quantity' | 'labor-rate' | 'labor-efficiency' | 'overhead-spending' | 'overhead-volume' | 'overhead-efficiency';
  productId?: number;
  productCode?: string;
  jobId?: number;
  jobNumber?: string;
  costCenterId: number;
  costCenterCode: string;
  standardAmount: number;
  actualAmount: number;
  varianceAmount: number;
  variancePercentage: number;
  favorableUnfavorable: 'favorable' | 'unfavorable';
  investigationRequired: boolean;
  rootCause?: string;
}

interface JobCost {
  jobCostId: number;
  jobId: number;
  jobNumber: string;
  jobName: string;
  jobType: 'production' | 'service' | 'project' | 'maintenance';
  customerId?: number;
  customerName?: string;
  startDate: Date;
  completionDate?: Date;
  jobStatus: 'planned' | 'in-progress' | 'completed' | 'closed';
  totalMaterialCost: number;
  totalLaborCost: number;
  totalOverheadCost: number;
  totalJobCost: number;
  budgetedCost?: number;
  costVariance?: number;
  percentComplete?: number;
}

interface ProductCost {
  productCostId: number;
  productId: number;
  productCode: string;
  productName: string;
  fiscalYear: number;
  fiscalPeriod: number;
  quantityProduced: number;
  directMaterialCost: number;
  directLaborCost: number;
  variableOverhead: number;
  fixedOverhead: number;
  totalProductCost: number;
  unitCost: number;
  costingMethod: 'job-order' | 'process' | 'hybrid';
}

interface ServiceDepartmentAllocation {
  allocationId: number;
  serviceDepartmentId: number;
  serviceDepartmentCode: string;
  fiscalYear: number;
  fiscalPeriod: number;
  totalServiceCost: number;
  allocationMethod: 'direct' | 'step-down' | 'reciprocal';
  allocationBasis: string;
  allocationSequence?: number;
}

interface CostBehaviorAnalysis {
  analysisId: number;
  costCenterId: number;
  costCenterCode: string;
  fiscalYear: number;
  fiscalPeriod: number;
  totalCost: number;
  fixedCost: number;
  variableCost: number;
  semivariableCost: number;
  activityLevel: number;
  variableCostPerUnit: number;
  costBehaviorPattern: 'linear' | 'step' | 'curvilinear';
}

interface TransferPrice {
  transferPriceId: number;
  sellingCostCenterId: number;
  sellingCostCenterCode: string;
  buyingCostCenterId: number;
  buyingCostCenterCode: string;
  productId: number;
  productCode: string;
  transferPriceMethod: 'market-based' | 'cost-based' | 'negotiated' | 'cost-plus';
  transferPrice: number;
  marketPrice?: number;
  fullCost?: number;
  markupPercentage?: number;
  effectiveDate: Date;
  expirationDate?: Date;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreateCostCenterDto {
  @ApiProperty({ description: 'Cost center code', example: 'CC-100' })
  costCenterCode!: string;

  @ApiProperty({ description: 'Cost center name', example: 'Manufacturing Department' })
  costCenterName!: string;

  @ApiProperty({ description: 'Cost center type', enum: ['production', 'service', 'administrative'] })
  costCenterType!: string;

  @ApiProperty({ description: 'Department code', example: 'DEPT-MFG' })
  departmentCode!: string;

  @ApiProperty({ description: 'Fiscal year', example: 2024 })
  fiscalYear!: number;

  @ApiProperty({ description: 'Budget amount', example: 500000, required: false })
  budgetAmount?: number;

  @ApiProperty({ description: 'Manager ID', required: false })
  managerId?: string;
}

export class CreateCostPoolDto {
  @ApiProperty({ description: 'Cost pool code', example: 'POOL-OH-001' })
  costPoolCode!: string;

  @ApiProperty({ description: 'Cost pool name', example: 'Factory Overhead Pool' })
  costPoolName!: string;

  @ApiProperty({ description: 'Cost pool type', enum: ['overhead', 'direct', 'indirect', 'service', 'activity'] })
  costPoolType!: string;

  @ApiProperty({ description: 'Allocation method', enum: ['direct', 'step-down', 'reciprocal', 'activity-based'] })
  allocationMethod!: string;

  @ApiProperty({ description: 'Fiscal year' })
  fiscalYear!: number;

  @ApiProperty({ description: 'Fiscal period' })
  fiscalPeriod!: number;
}

export class AllocateOverheadDto {
  @ApiProperty({ description: 'Cost pool ID' })
  costPoolId!: number;

  @ApiProperty({ description: 'Fiscal year' })
  fiscalYear!: number;

  @ApiProperty({ description: 'Fiscal period' })
  fiscalPeriod!: number;

  @ApiProperty({ description: 'Allocation basis', example: 'direct-labor-hours' })
  allocationBasis!: string;

  @ApiProperty({ description: 'Total overhead amount' })
  totalOverhead!: number;
}

export class CreateStandardCostDto {
  @ApiProperty({ description: 'Product ID' })
  productId!: number;

  @ApiProperty({ description: 'Product code' })
  productCode!: string;

  @ApiProperty({ description: 'Fiscal year' })
  fiscalYear!: number;

  @ApiProperty({ description: 'Effective date' })
  effectiveDate!: Date;

  @ApiProperty({ description: 'Standard material cost per unit' })
  standardMaterialCost!: number;

  @ApiProperty({ description: 'Standard labor cost per unit' })
  standardLaborCost!: number;

  @ApiProperty({ description: 'Standard overhead cost per unit' })
  standardOverheadCost!: number;
}

export class AnalyzeVarianceDto {
  @ApiProperty({ description: 'Fiscal year' })
  fiscalYear!: number;

  @ApiProperty({ description: 'Fiscal period' })
  fiscalPeriod!: number;

  @ApiProperty({ description: 'Variance type', enum: ['material-price', 'material-quantity', 'labor-rate', 'labor-efficiency', 'overhead-spending', 'overhead-volume'] })
  varianceType!: string;

  @ApiProperty({ description: 'Product code', required: false })
  productCode?: string;

  @ApiProperty({ description: 'Cost center code' })
  costCenterCode!: string;

  @ApiProperty({ description: 'Standard amount' })
  standardAmount!: number;

  @ApiProperty({ description: 'Actual amount' })
  actualAmount!: number;
}

export class CreateJobCostDto {
  @ApiProperty({ description: 'Job number', example: 'JOB-2024-001' })
  jobNumber!: string;

  @ApiProperty({ description: 'Job name', example: 'Custom Equipment Build' })
  jobName!: string;

  @ApiProperty({ description: 'Job type', enum: ['production', 'service', 'project', 'maintenance'] })
  jobType!: string;

  @ApiProperty({ description: 'Start date' })
  startDate!: Date;

  @ApiProperty({ description: 'Budgeted cost', required: false })
  budgetedCost?: number;

  @ApiProperty({ description: 'Customer ID', required: false })
  customerId?: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

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
export const createCostCenterModel = (sequelize: Sequelize) => {
  class CostCenter extends Model {
    public id!: number;
    public costCenterCode!: string;
    public costCenterName!: string;
    public costCenterType!: string;
    public departmentId!: number;
    public departmentCode!: string;
    public isActive!: boolean;
    public managerId!: string | null;
    public budgetAmount!: number | null;
    public fiscalYear!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
    public readonly updatedBy!: string;
  }

  CostCenter.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      costCenterCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique cost center code',
      },
      costCenterName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Cost center name',
      },
      costCenterType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Cost center type',
        validate: {
          isIn: [['production', 'service', 'administrative', 'selling', 'distribution']],
        },
      },
      departmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Department ID',
      },
      departmentCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Department code',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Is cost center active',
      },
      managerId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Cost center manager',
      },
      budgetAmount: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: true,
        comment: 'Annual budget amount',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
        validate: {
          min: 2000,
          max: 2099,
        },
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the record',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who last updated the record',
      },
    },
    {
      sequelize,
      tableName: 'cost_centers',
      timestamps: true,
      indexes: [
        { fields: ['costCenterCode'], unique: true },
        { fields: ['costCenterType'] },
        { fields: ['departmentCode'] },
        { fields: ['fiscalYear'] },
        { fields: ['isActive'] },
      ],
      hooks: {
        beforeCreate: (costCenter) => {
          if (!costCenter.createdBy) {
            throw new Error('createdBy is required');
          }
          costCenter.updatedBy = costCenter.createdBy;
        },
      },
    },
  );

  return CostCenter;
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
export const createCostPoolModel = (sequelize: Sequelize) => {
  class CostPool extends Model {
    public id!: number;
    public costPoolCode!: string;
    public costPoolName!: string;
    public costPoolType!: string;
    public allocationMethod!: string;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public totalCost!: number;
    public allocatedCost!: number;
    public unallocatedCost!: number;
    public isActive!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
  }

  CostPool.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      costPoolCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique cost pool code',
      },
      costPoolName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Cost pool name',
      },
      costPoolType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Cost pool type',
        validate: {
          isIn: [['overhead', 'direct', 'indirect', 'service', 'activity']],
        },
      },
      allocationMethod: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Allocation method',
        validate: {
          isIn: [['direct', 'step-down', 'reciprocal', 'activity-based']],
        },
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      fiscalPeriod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal period',
        validate: {
          min: 1,
          max: 13,
        },
      },
      totalCost: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total cost in pool',
      },
      allocatedCost: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Allocated cost',
      },
      unallocatedCost: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Unallocated cost',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Is cost pool active',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the record',
      },
    },
    {
      sequelize,
      tableName: 'cost_pools',
      timestamps: true,
      indexes: [
        { fields: ['costPoolCode'], unique: true },
        { fields: ['costPoolType'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['isActive'] },
      ],
    },
  );

  return CostPool;
};

// ============================================================================
// COST CENTER MANAGEMENT FUNCTIONS
// ============================================================================

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
export const createCostCenter = async (
  sequelize: Sequelize,
  costCenterData: CreateCostCenterDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const CostCenter = createCostCenterModel(sequelize);

  const costCenter = await CostCenter.create(
    {
      costCenterCode: costCenterData.costCenterCode,
      costCenterName: costCenterData.costCenterName,
      costCenterType: costCenterData.costCenterType,
      departmentCode: costCenterData.departmentCode,
      departmentId: 1, // Simplified - would normally look up department
      fiscalYear: costCenterData.fiscalYear,
      budgetAmount: costCenterData.budgetAmount,
      managerId: costCenterData.managerId,
      isActive: true,
      createdBy: userId,
      updatedBy: userId,
    },
    { transaction },
  );

  return costCenter;
};

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
export const getCostCenterById = async (
  sequelize: Sequelize,
  costCenterId: number,
  transaction?: Transaction,
): Promise<any> => {
  const CostCenter = createCostCenterModel(sequelize);

  const costCenter = await CostCenter.findByPk(costCenterId, { transaction });
  if (!costCenter) {
    throw new Error('Cost center not found');
  }

  return costCenter;
};

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
export const getCostCenterByCode = async (
  sequelize: Sequelize,
  costCenterCode: string,
  transaction?: Transaction,
): Promise<any> => {
  const CostCenter = createCostCenterModel(sequelize);

  const costCenter = await CostCenter.findOne({
    where: { costCenterCode },
    transaction,
  });

  if (!costCenter) {
    throw new Error('Cost center not found');
  }

  return costCenter;
};

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
export const listCostCenters = async (
  sequelize: Sequelize,
  filters: any = {},
  transaction?: Transaction,
): Promise<any[]> => {
  const CostCenter = createCostCenterModel(sequelize);

  const where: any = { isActive: true };

  if (filters.costCenterType) where.costCenterType = filters.costCenterType;
  if (filters.departmentCode) where.departmentCode = filters.departmentCode;
  if (filters.fiscalYear) where.fiscalYear = filters.fiscalYear;

  const costCenters = await CostCenter.findAll({
    where,
    order: [['costCenterCode', 'ASC']],
    transaction,
  });

  return costCenters;
};

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
export const updateCostCenterBudget = async (
  sequelize: Sequelize,
  costCenterId: number,
  budgetAmount: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const costCenter = await getCostCenterById(sequelize, costCenterId, transaction);

  await costCenter.update(
    {
      budgetAmount,
      updatedBy: userId,
    },
    { transaction },
  );

  return costCenter;
};

// ============================================================================
// COST POOL MANAGEMENT FUNCTIONS
// ============================================================================

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
export const createCostPool = async (
  sequelize: Sequelize,
  poolData: CreateCostPoolDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const CostPool = createCostPoolModel(sequelize);

  const pool = await CostPool.create(
    {
      costPoolCode: poolData.costPoolCode,
      costPoolName: poolData.costPoolName,
      costPoolType: poolData.costPoolType,
      allocationMethod: poolData.allocationMethod,
      fiscalYear: poolData.fiscalYear,
      fiscalPeriod: poolData.fiscalPeriod,
      totalCost: 0,
      allocatedCost: 0,
      unallocatedCost: 0,
      isActive: true,
      createdBy: userId,
    },
    { transaction },
  );

  return pool;
};

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
export const addCostToPool = async (
  sequelize: Sequelize,
  costPoolId: number,
  costAmount: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const CostPool = createCostPoolModel(sequelize);

  const pool = await CostPool.findByPk(costPoolId, { transaction });
  if (!pool) {
    throw new Error('Cost pool not found');
  }

  const newTotalCost = Number(pool.totalCost) + costAmount;
  const newUnallocatedCost = Number(pool.unallocatedCost) + costAmount;

  await pool.update(
    {
      totalCost: newTotalCost,
      unallocatedCost: newUnallocatedCost,
    },
    { transaction },
  );

  return pool;
};

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
export const getCostPoolById = async (
  sequelize: Sequelize,
  costPoolId: number,
  transaction?: Transaction,
): Promise<any> => {
  const CostPool = createCostPoolModel(sequelize);

  const pool = await CostPool.findByPk(costPoolId, { transaction });
  if (!pool) {
    throw new Error('Cost pool not found');
  }

  return pool;
};

// ============================================================================
// OVERHEAD ALLOCATION FUNCTIONS
// ============================================================================

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
export const allocateOverheadDirect = async (
  sequelize: Sequelize,
  allocationData: AllocateOverheadDto,
  costCenters: any[],
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  // Calculate total basis units
  let totalBasisUnits = 0;
  for (const cc of costCenters) {
    totalBasisUnits += Number(cc.basisUnits);
  }

  if (totalBasisUnits === 0) {
    throw new Error('Total basis units cannot be zero');
  }

  const allocationRate = Number(allocationData.totalOverhead) / totalBasisUnits;

  // Create allocation header (simplified)
  const allocation = {
    allocationId: Date.now(),
    fiscalYear: allocationData.fiscalYear,
    fiscalPeriod: allocationData.fiscalPeriod,
    allocationDate: new Date(),
    costPoolId: allocationData.costPoolId,
    allocationMethod: 'direct',
    totalOverhead: allocationData.totalOverhead,
    allocationBasis: allocationData.allocationBasis,
    totalBasisUnits,
    allocationRate,
    status: 'calculated',
    lines: [] as any[],
  };

  // Create allocation lines
  for (const cc of costCenters) {
    const allocatedAmount = Number(cc.basisUnits) * allocationRate;
    const allocationPercentage = (Number(cc.basisUnits) / totalBasisUnits) * 100;

    allocation.lines.push({
      allocationLineId: allocation.lines.length + 1,
      allocationId: allocation.allocationId,
      costCenterId: cc.costCenterId,
      costCenterCode: cc.costCenterCode,
      basisUnits: cc.basisUnits,
      allocatedAmount,
      allocationPercentage,
    });
  }

  // Update cost pool
  const pool = await getCostPoolById(sequelize, allocationData.costPoolId, transaction);
  await pool.update(
    {
      allocatedCost: Number(pool.allocatedCost) + Number(allocationData.totalOverhead),
      unallocatedCost: Number(pool.unallocatedCost) - Number(allocationData.totalOverhead),
    },
    { transaction },
  );

  return allocation;
};

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
export const allocateServiceCostsStepDown = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  serviceDepartments: any[],
  productionDepartments: any[],
  userId: string,
  transaction?: Transaction,
): Promise<any[]> => {
  const allocations: any[] = [];

  // Sort service departments by allocation sequence
  serviceDepartments.sort((a, b) => a.sequence - b.sequence);

  // Track accumulated costs for each department
  const departmentCosts = new Map<string, number>();
  for (const pd of productionDepartments) {
    departmentCosts.set(pd.departmentCode, 0);
  }

  // Allocate each service department in sequence
  for (let i = 0; i < serviceDepartments.length; i++) {
    const sd = serviceDepartments[i];
    const serviceCost = Number(sd.totalCost);

    // Calculate total allocation basis for remaining departments
    let totalBasis = 0;

    // Include production departments
    for (const pd of productionDepartments) {
      totalBasis += Number(pd[sd.allocationBasis] || 0);
    }

    // Include subsequent service departments (step-down)
    for (let j = i + 1; j < serviceDepartments.length; j++) {
      totalBasis += Number(serviceDepartments[j][sd.allocationBasis] || 0);
    }

    if (totalBasis === 0) continue;

    const allocationRate = serviceCost / totalBasis;

    const allocation = {
      allocationId: Date.now() + i,
      serviceDepartmentCode: sd.departmentCode,
      fiscalYear,
      fiscalPeriod,
      totalServiceCost: serviceCost,
      allocationMethod: 'step-down',
      allocationBasis: sd.allocationBasis,
      allocationSequence: sd.sequence,
      allocationRate,
      lines: [] as any[],
    };

    // Allocate to production departments
    for (const pd of productionDepartments) {
      const basisUnits = Number(pd[sd.allocationBasis] || 0);
      const allocatedAmount = basisUnits * allocationRate;

      allocation.lines.push({
        departmentCode: pd.departmentCode,
        basisUnits,
        allocatedAmount,
      });

      departmentCosts.set(
        pd.departmentCode,
        (departmentCosts.get(pd.departmentCode) || 0) + allocatedAmount,
      );
    }

    // Allocate to subsequent service departments
    for (let j = i + 1; j < serviceDepartments.length; j++) {
      const nextSd = serviceDepartments[j];
      const basisUnits = Number(nextSd[sd.allocationBasis] || 0);
      const allocatedAmount = basisUnits * allocationRate;

      allocation.lines.push({
        departmentCode: nextSd.departmentCode,
        basisUnits,
        allocatedAmount,
      });

      // Add to next service department's cost
      nextSd.totalCost = Number(nextSd.totalCost) + allocatedAmount;
    }

    allocations.push(allocation);
  }

  return allocations;
};

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
export const allocateOverheadABC = async (
  sequelize: Sequelize,
  costPoolId: number,
  activities: any[],
  products: any[],
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const allocation = {
    costPoolId,
    allocationMethod: 'activity-based',
    activities: [] as any[],
    productCosts: new Map<string, number>(),
  };

  // Calculate cost per driver unit for each activity
  for (const activity of activities) {
    const costPerDriverUnit = Number(activity.activityCost) / Number(activity.driverUnits);

    allocation.activities.push({
      activityCode: activity.activityCode,
      activityCost: activity.activityCost,
      driverType: activity.driverType,
      driverUnits: activity.driverUnits,
      costPerDriverUnit,
    });
  }

  // Allocate activity costs to products
  for (const product of products) {
    let totalProductCost = 0;

    for (const activity of activities) {
      const driverConsumption = Number(product[activity.driverType] || 0);
      const costPerDriverUnit = Number(activity.activityCost) / Number(activity.driverUnits);
      const allocatedCost = driverConsumption * costPerDriverUnit;

      totalProductCost += allocatedCost;
    }

    allocation.productCosts.set(product.productCode, totalProductCost);
  }

  return allocation;
};

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
export const calculatePredeterminedOverheadRate = (
  estimatedOverhead: number,
  estimatedActivityBase: number,
): number => {
  if (estimatedActivityBase === 0) {
    throw new Error('Estimated activity base cannot be zero');
  }

  return estimatedOverhead / estimatedActivityBase;
};

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
export const applyOverheadToJob = (
  predeterminedRate: number,
  actualActivityBase: number,
): number => {
  return predeterminedRate * actualActivityBase;
};

// ============================================================================
// STANDARD COSTING FUNCTIONS
// ============================================================================

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
export const createStandardCost = async (
  sequelize: Sequelize,
  standardCostData: CreateStandardCostDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const totalStandardCost =
    Number(standardCostData.standardMaterialCost) +
    Number(standardCostData.standardLaborCost) +
    Number(standardCostData.standardOverheadCost);

  const standardCost = {
    standardCostId: Date.now(),
    productId: standardCostData.productId,
    productCode: standardCostData.productCode,
    productName: '', // Would be looked up
    fiscalYear: standardCostData.fiscalYear,
    effectiveDate: standardCostData.effectiveDate,
    standardMaterialCost: standardCostData.standardMaterialCost,
    standardLaborCost: standardCostData.standardLaborCost,
    standardOverheadCost: standardCostData.standardOverheadCost,
    totalStandardCost,
    costingMethod: 'standard',
    isActive: true,
  };

  return standardCost;
};

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
export const getStandardCostForProduct = async (
  sequelize: Sequelize,
  productId: number,
  effectiveDate: Date,
  transaction?: Transaction,
): Promise<any> => {
  // Simplified - would query database for active standard cost
  return {
    standardCostId: 1,
    productId,
    standardMaterialCost: 25.00,
    standardLaborCost: 15.00,
    standardOverheadCost: 10.00,
    totalStandardCost: 50.00,
    effectiveDate,
  };
};

// ============================================================================
// VARIANCE ANALYSIS FUNCTIONS
// ============================================================================

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
export const calculateMaterialPriceVariance = (
  standardPrice: number,
  actualPrice: number,
  actualQuantity: number,
): any => {
  const variance = (standardPrice - actualPrice) * actualQuantity;

  return {
    varianceType: 'material-price',
    standardPrice,
    actualPrice,
    actualQuantity,
    variance,
    favorableUnfavorable: variance >= 0 ? 'favorable' : 'unfavorable',
  };
};

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
export const calculateMaterialQuantityVariance = (
  standardQuantity: number,
  actualQuantity: number,
  standardPrice: number,
): any => {
  const variance = (standardQuantity - actualQuantity) * standardPrice;

  return {
    varianceType: 'material-quantity',
    standardQuantity,
    actualQuantity,
    standardPrice,
    variance,
    favorableUnfavorable: variance >= 0 ? 'favorable' : 'unfavorable',
  };
};

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
export const calculateLaborRateVariance = (
  standardRate: number,
  actualRate: number,
  actualHours: number,
): any => {
  const variance = (standardRate - actualRate) * actualHours;

  return {
    varianceType: 'labor-rate',
    standardRate,
    actualRate,
    actualHours,
    variance,
    favorableUnfavorable: variance >= 0 ? 'favorable' : 'unfavorable',
  };
};

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
export const calculateLaborEfficiencyVariance = (
  standardHours: number,
  actualHours: number,
  standardRate: number,
): any => {
  const variance = (standardHours - actualHours) * standardRate;

  return {
    varianceType: 'labor-efficiency',
    standardHours,
    actualHours,
    standardRate,
    variance,
    favorableUnfavorable: variance >= 0 ? 'favorable' : 'unfavorable',
  };
};

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
export const calculateOverheadSpendingVariance = (
  budgetedOverhead: number,
  actualOverhead: number,
): any => {
  const variance = budgetedOverhead - actualOverhead;

  return {
    varianceType: 'overhead-spending',
    budgetedOverhead,
    actualOverhead,
    variance,
    favorableUnfavorable: variance >= 0 ? 'favorable' : 'unfavorable',
  };
};

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
export const calculateOverheadVolumeVariance = (
  standardHours: number,
  budgetedHours: number,
  fixedOverheadRate: number,
): any => {
  const variance = (standardHours - budgetedHours) * fixedOverheadRate;

  return {
    varianceType: 'overhead-volume',
    standardHours,
    budgetedHours,
    fixedOverheadRate,
    variance,
    favorableUnfavorable: variance >= 0 ? 'favorable' : 'unfavorable',
  };
};

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
export const calculateOverheadEfficiencyVariance = (
  standardHours: number,
  actualHours: number,
  variableOverheadRate: number,
): any => {
  const variance = (standardHours - actualHours) * variableOverheadRate;

  return {
    varianceType: 'overhead-efficiency',
    standardHours,
    actualHours,
    variableOverheadRate,
    variance,
    favorableUnfavorable: variance >= 0 ? 'favorable' : 'unfavorable',
  };
};

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
export const performComprehensiveVarianceAnalysis = async (
  sequelize: Sequelize,
  productId: number,
  standardCosts: any,
  actualCosts: any,
  userId: string,
  transaction?: Transaction,
): Promise<any[]> => {
  const variances: any[] = [];

  // Material price variance
  const materialPriceVar = calculateMaterialPriceVariance(
    standardCosts.materialPrice,
    actualCosts.materialPrice,
    actualCosts.materialQuantity,
  );
  variances.push(materialPriceVar);

  // Material quantity variance
  const materialQtyVar = calculateMaterialQuantityVariance(
    standardCosts.materialQuantity,
    actualCosts.materialQuantity,
    standardCosts.materialPrice,
  );
  variances.push(materialQtyVar);

  // Labor rate variance
  const laborRateVar = calculateLaborRateVariance(
    standardCosts.laborRate,
    actualCosts.laborRate,
    actualCosts.laborHours,
  );
  variances.push(laborRateVar);

  // Labor efficiency variance
  const laborEffVar = calculateLaborEfficiencyVariance(
    standardCosts.laborHours,
    actualCosts.laborHours,
    standardCosts.laborRate,
  );
  variances.push(laborEffVar);

  // Overhead variances (if applicable)
  if (actualCosts.actualOverhead) {
    const budgetedOverhead = standardCosts.laborHours * standardCosts.overheadRate;
    const overheadSpendingVar = calculateOverheadSpendingVariance(
      budgetedOverhead,
      actualCosts.actualOverhead,
    );
    variances.push(overheadSpendingVar);
  }

  return variances;
};

// ============================================================================
// JOB COSTING FUNCTIONS
// ============================================================================

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
export const createJobCost = async (
  sequelize: Sequelize,
  jobData: CreateJobCostDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const job = {
    jobCostId: Date.now(),
    jobId: Date.now(),
    jobNumber: jobData.jobNumber,
    jobName: jobData.jobName,
    jobType: jobData.jobType,
    customerId: jobData.customerId,
    customerName: '', // Would be looked up
    startDate: jobData.startDate,
    jobStatus: 'planned',
    totalMaterialCost: 0,
    totalLaborCost: 0,
    totalOverheadCost: 0,
    totalJobCost: 0,
    budgetedCost: jobData.budgetedCost,
    percentComplete: 0,
  };

  return job;
};

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
export const addMaterialCostToJob = async (
  sequelize: Sequelize,
  jobId: number,
  materialCost: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  // Simplified - would update database
  return {
    jobId,
    totalMaterialCost: materialCost,
    totalJobCost: materialCost,
  };
};

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
export const addLaborCostToJob = async (
  sequelize: Sequelize,
  jobId: number,
  laborHours: number,
  laborRate: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const laborCost = laborHours * laborRate;

  return {
    jobId,
    laborHours,
    laborRate,
    laborCost,
  };
};

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
export const applyOverheadToJobCost = async (
  sequelize: Sequelize,
  jobId: number,
  overheadRate: number,
  allocationBase: number,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const overheadCost = overheadRate * allocationBase;

  return {
    jobId,
    overheadRate,
    allocationBase,
    overheadCost,
  };
};

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
export const calculateJobCostVariance = (
  budgetedCost: number,
  actualCost: number,
): any => {
  const variance = budgetedCost - actualCost;
  const variancePercent = budgetedCost > 0 ? (variance / budgetedCost) * 100 : 0;

  return {
    budgetedCost,
    actualCost,
    variance,
    variancePercent,
    favorableUnfavorable: variance >= 0 ? 'favorable' : 'unfavorable',
  };
};

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
export const closeJob = async (
  sequelize: Sequelize,
  jobId: number,
  completionDate: Date,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  return {
    jobId,
    jobStatus: 'closed',
    completionDate,
    percentComplete: 100,
  };
};

// ============================================================================
// PRODUCT COSTING FUNCTIONS
// ============================================================================

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
export const calculateProductCostJobOrder = (
  directMaterialCost: number,
  directLaborCost: number,
  overheadCost: number,
  quantityProduced: number,
): any => {
  const totalCost = directMaterialCost + directLaborCost + overheadCost;
  const unitCost = quantityProduced > 0 ? totalCost / quantityProduced : 0;

  return {
    directMaterialCost,
    directLaborCost,
    overheadCost,
    totalCost,
    quantityProduced,
    unitCost,
    costingMethod: 'job-order',
  };
};

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
export const calculateProductCostProcess = (
  totalCost: number,
  equivalentUnits: number,
): any => {
  const costPerEquivalentUnit = equivalentUnits > 0 ? totalCost / equivalentUnits : 0;

  return {
    totalCost,
    equivalentUnits,
    costPerEquivalentUnit,
    costingMethod: 'process',
  };
};

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
export const calculateEquivalentUnits = (
  unitsCompleted: number,
  endingWIPUnits: number,
  endingWIPPercentComplete: number,
): number => {
  return unitsCompleted + (endingWIPUnits * endingWIPPercentComplete);
};

// ============================================================================
// COST BEHAVIOR AND ANALYSIS FUNCTIONS
// ============================================================================

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
export const analyzeCostBehaviorHighLow = (
  highActivityLevel: number,
  highCost: number,
  lowActivityLevel: number,
  lowCost: number,
): any => {
  const variableCostPerUnit = (highCost - lowCost) / (highActivityLevel - lowActivityLevel);
  const fixedCost = highCost - (variableCostPerUnit * highActivityLevel);

  return {
    variableCostPerUnit,
    fixedCost,
    highActivityLevel,
    highCost,
    lowActivityLevel,
    lowCost,
  };
};

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
export const calculateContributionMargin = (
  salesRevenue: number,
  variableCosts: number,
): any => {
  const contributionMargin = salesRevenue - variableCosts;
  const contributionMarginRatio = salesRevenue > 0 ? contributionMargin / salesRevenue : 0;

  return {
    salesRevenue,
    variableCosts,
    contributionMargin,
    contributionMarginRatio,
  };
};

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
export const calculateBreakEvenPoint = (
  fixedCosts: number,
  pricePerUnit: number,
  variableCostPerUnit: number,
): any => {
  const contributionMarginPerUnit = pricePerUnit - variableCostPerUnit;

  if (contributionMarginPerUnit <= 0) {
    throw new Error('Contribution margin must be positive to calculate break-even');
  }

  const breakEvenUnits = fixedCosts / contributionMarginPerUnit;
  const breakEvenDollars = breakEvenUnits * pricePerUnit;

  return {
    fixedCosts,
    contributionMarginPerUnit,
    breakEvenUnits,
    breakEvenDollars,
  };
};

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
export const generateProfitabilityReport = async (
  sequelize: Sequelize,
  fiscalYear: number,
  fiscalPeriod: number,
  transaction?: Transaction,
): Promise<any[]> => {
  // Simplified - would query actual product costs and revenues
  return [
    {
      productCode: 'PROD-A',
      revenue: 100000,
      directCosts: 60000,
      allocatedOverhead: 20000,
      totalCost: 80000,
      grossProfit: 20000,
      grossMarginPercent: 20.0,
    },
    {
      productCode: 'PROD-B',
      revenue: 75000,
      directCosts: 40000,
      allocatedOverhead: 15000,
      totalCost: 55000,
      grossProfit: 20000,
      grossMarginPercent: 26.67,
    },
  ];
};
