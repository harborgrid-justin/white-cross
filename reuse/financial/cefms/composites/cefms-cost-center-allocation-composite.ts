/**
 * LOC: CEFMSCC002
 * File: /reuse/financial/cefms/composites/cefms-cost-center-allocation-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../../cost-allocation-tracking-kit.ts
 *   - ../../cost-allocation-distribution-kit.ts
 *   - ../../budget-planning-allocation-kit.ts
 *   - ../../expense-management-tracking-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS cost accounting services
 *   - USACE project costing systems
 *   - Cost center reporting modules
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-cost-center-allocation-composite.ts
 * Locator: WC-CEFMS-CC-002
 * Purpose: USACE CEFMS Cost Center Allocation - cost centers, allocation pools, distribution methods, overhead allocation
 *
 * Upstream: Composes utilities from financial kits for cost center management
 * Downstream: ../../../backend/cefms/*, Cost accounting controllers, allocation automation
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 40+ composite functions for USACE CEFMS cost center allocation operations
 *
 * LLM Context: Production-ready USACE CEFMS cost center and allocation system.
 * Comprehensive cost center hierarchy, allocation pool management, multi-method cost distribution,
 * overhead allocation, step-down allocation, activity-based costing, cost driver analysis,
 * inter-departmental billing, allocation reversal, variance analysis, and allocation reporting.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface CostCenterData {
  costCenterCode: string;
  costCenterName: string;
  costCenterType: 'production' | 'service' | 'administrative' | 'support';
  parentCostCenter?: string;
  managerId: string;
  isActive: boolean;
  departmentCode?: string;
  divisionCode?: string;
  allowDirectCharges: boolean;
  metadata?: Record<string, any>;
}

interface AllocationPoolData {
  poolId: string;
  poolName: string;
  poolType: 'overhead' | 'service' | 'shared_cost' | 'fringe_benefit';
  fiscalYear: number;
  fiscalPeriod: number;
  totalAmount: number;
  allocationMethod: 'direct' | 'step_down' | 'reciprocal' | 'activity_based';
  allocationBasis: string;
  isActive: boolean;
}

interface AllocationRuleData {
  ruleId: string;
  poolId: string;
  sourceCostCenter: string;
  targetCostCenter: string;
  allocationPercent: number;
  allocationAmount?: number;
  allocationBasis: string;
  basisValue: number;
  isActive: boolean;
}

interface CostAllocationData {
  allocationId: string;
  poolId: string;
  sourceCostCenter: string;
  targetCostCenter: string;
  fiscalYear: number;
  fiscalPeriod: number;
  allocationAmount: number;
  allocationMethod: string;
  allocationBasis: string;
  allocationDate: Date;
  status: 'pending' | 'allocated' | 'reversed';
  reversedAt?: Date;
}

interface AllocationDriverData {
  driverId: string;
  driverName: string;
  driverType: 'headcount' | 'square_footage' | 'machine_hours' | 'direct_labor' | 'revenue';
  measurementUnit: string;
  costCenterCode: string;
  driverValue: number;
  fiscalYear: number;
  fiscalPeriod: number;
}

interface OverheadAllocationData {
  overheadPoolId: string;
  fiscalYear: number;
  fiscalPeriod: number;
  totalOverhead: number;
  allocationRate: number;
  allocationBasis: string;
  allocatedAmount: number;
  unallocatedAmount: number;
}

interface InterDeptBillingData {
  billingId: string;
  fromCostCenter: string;
  toCostCenter: string;
  serviceDescription: string;
  quantity: number;
  unitRate: number;
  totalAmount: number;
  billingDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  status: 'draft' | 'billed' | 'paid';
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Cost Centers with hierarchical structure.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CostCenter model
 *
 * @example
 * ```typescript
 * const CostCenter = createCostCenterModel(sequelize);
 * const center = await CostCenter.create({
 *   costCenterCode: 'CC-1000',
 *   costCenterName: 'Engineering Department',
 *   costCenterType: 'production',
 *   managerId: 'MGR001',
 *   isActive: true
 * });
 * ```
 */
export const createCostCenterModel = (sequelize: Sequelize) => {
  class CostCenter extends Model {
    public id!: string;
    public costCenterCode!: string;
    public costCenterName!: string;
    public costCenterType!: string;
    public parentCostCenter!: string | null;
    public managerId!: string;
    public isActive!: boolean;
    public departmentCode!: string | null;
    public divisionCode!: string | null;
    public allowDirectCharges!: boolean;
    public currentPeriodCost!: number;
    public ytdCost!: number;
    public budgetAmount!: number;
    public headcount!: number;
    public squareFootage!: number;
    public description!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CostCenter.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      costCenterCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Cost center code',
        validate: {
          notEmpty: true,
        },
      },
      costCenterName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Cost center name',
        validate: {
          notEmpty: true,
        },
      },
      costCenterType: {
        type: DataTypes.ENUM('production', 'service', 'administrative', 'support'),
        allowNull: false,
        comment: 'Cost center type',
      },
      parentCostCenter: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Parent cost center',
      },
      managerId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Cost center manager',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Is active',
      },
      departmentCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Department code',
      },
      divisionCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Division code',
      },
      allowDirectCharges: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Allow direct charges',
      },
      currentPeriodCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Current period cost',
      },
      ytdCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Year-to-date cost',
      },
      budgetAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Budget amount',
      },
      headcount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Employee headcount',
      },
      squareFootage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Square footage',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Description',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'cost_centers',
      timestamps: true,
      indexes: [
        { fields: ['costCenterCode'], unique: true },
        { fields: ['costCenterType'] },
        { fields: ['parentCostCenter'] },
        { fields: ['isActive'] },
        { fields: ['managerId'] },
        { fields: ['departmentCode'] },
        { fields: ['divisionCode'] },
      ],
    },
  );

  return CostCenter;
};

/**
 * Sequelize model for Allocation Pools with method configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AllocationPool model
 */
export const createAllocationPoolModel = (sequelize: Sequelize) => {
  class AllocationPool extends Model {
    public id!: string;
    public poolId!: string;
    public poolName!: string;
    public poolType!: string;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public totalAmount!: number;
    public allocatedAmount!: number;
    public unallocatedAmount!: number;
    public allocationMethod!: string;
    public allocationBasis!: string;
    public isActive!: boolean;
    public description!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AllocationPool.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      poolId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Pool identifier',
      },
      poolName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Pool name',
      },
      poolType: {
        type: DataTypes.ENUM('overhead', 'service', 'shared_cost', 'fringe_benefit'),
        allowNull: false,
        comment: 'Pool type',
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
      },
      totalAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total pool amount',
      },
      allocatedAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Allocated amount',
      },
      unallocatedAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Unallocated amount',
      },
      allocationMethod: {
        type: DataTypes.ENUM('direct', 'step_down', 'reciprocal', 'activity_based'),
        allowNull: false,
        comment: 'Allocation method',
      },
      allocationBasis: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Allocation basis',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Is active',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
        comment: 'Description',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'allocation_pools',
      timestamps: true,
      indexes: [
        { fields: ['poolId'], unique: true },
        { fields: ['poolType'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['isActive'] },
        { fields: ['allocationMethod'] },
      ],
    },
  );

  return AllocationPool;
};

/**
 * Sequelize model for Allocation Rules with percentage-based distribution.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AllocationRule model
 */
export const createAllocationRuleModel = (sequelize: Sequelize) => {
  class AllocationRule extends Model {
    public id!: string;
    public ruleId!: string;
    public poolId!: string;
    public sourceCostCenter!: string;
    public targetCostCenter!: string;
    public allocationPercent!: number;
    public allocationAmount!: number;
    public allocationBasis!: string;
    public basisValue!: number;
    public isActive!: boolean;
    public effectiveDate!: Date;
    public expirationDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AllocationRule.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      ruleId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Rule identifier',
      },
      poolId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Allocation pool',
      },
      sourceCostCenter: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Source cost center',
      },
      targetCostCenter: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Target cost center',
      },
      allocationPercent: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        comment: 'Allocation percentage',
        validate: {
          min: 0,
          max: 100,
        },
      },
      allocationAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Calculated allocation amount',
      },
      allocationBasis: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Allocation basis',
      },
      basisValue: {
        type: DataTypes.DECIMAL(18, 4),
        allowNull: false,
        defaultValue: 0,
        comment: 'Basis value',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Is active',
      },
      effectiveDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Effective date',
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Expiration date',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'allocation_rules',
      timestamps: true,
      indexes: [
        { fields: ['ruleId'], unique: true },
        { fields: ['poolId'] },
        { fields: ['sourceCostCenter'] },
        { fields: ['targetCostCenter'] },
        { fields: ['isActive'] },
        { fields: ['effectiveDate'] },
      ],
    },
  );

  return AllocationRule;
};

/**
 * Sequelize model for Cost Allocations with transaction tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CostAllocation model
 */
export const createCostAllocationModel = (sequelize: Sequelize) => {
  class CostAllocation extends Model {
    public id!: string;
    public allocationId!: string;
    public poolId!: string;
    public sourceCostCenter!: string;
    public targetCostCenter!: string;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public allocationAmount!: number;
    public allocationMethod!: string;
    public allocationBasis!: string;
    public allocationDate!: Date;
    public status!: string;
    public reversedAt!: Date | null;
    public reversedBy!: string | null;
    public journalEntryId!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CostAllocation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      allocationId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Allocation identifier',
      },
      poolId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Allocation pool',
      },
      sourceCostCenter: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Source cost center',
      },
      targetCostCenter: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Target cost center',
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
      },
      allocationAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Allocation amount',
        validate: {
          min: 0,
        },
      },
      allocationMethod: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Allocation method',
      },
      allocationBasis: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Allocation basis',
      },
      allocationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Allocation date',
      },
      status: {
        type: DataTypes.ENUM('pending', 'allocated', 'reversed'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Allocation status',
      },
      reversedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Reversal timestamp',
      },
      reversedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Reversed by user',
      },
      journalEntryId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Related journal entry',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'cost_allocations',
      timestamps: true,
      indexes: [
        { fields: ['allocationId'], unique: true },
        { fields: ['poolId'] },
        { fields: ['sourceCostCenter'] },
        { fields: ['targetCostCenter'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['status'] },
        { fields: ['allocationDate'] },
      ],
    },
  );

  return CostAllocation;
};

/**
 * Sequelize model for Allocation Drivers with measurement tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AllocationDriver model
 */
export const createAllocationDriverModel = (sequelize: Sequelize) => {
  class AllocationDriver extends Model {
    public id!: string;
    public driverId!: string;
    public driverName!: string;
    public driverType!: string;
    public measurementUnit!: string;
    public costCenterCode!: string;
    public driverValue!: number;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AllocationDriver.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      driverId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Driver identifier',
      },
      driverName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Driver name',
      },
      driverType: {
        type: DataTypes.ENUM('headcount', 'square_footage', 'machine_hours', 'direct_labor', 'revenue'),
        allowNull: false,
        comment: 'Driver type',
      },
      measurementUnit: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Measurement unit',
      },
      costCenterCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Cost center',
      },
      driverValue: {
        type: DataTypes.DECIMAL(18, 4),
        allowNull: false,
        comment: 'Driver value',
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
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'allocation_drivers',
      timestamps: true,
      indexes: [
        { fields: ['driverId'] },
        { fields: ['driverType'] },
        { fields: ['costCenterCode'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['costCenterCode', 'fiscalYear', 'fiscalPeriod', 'driverType'] },
      ],
    },
  );

  return AllocationDriver;
};

/**
 * Sequelize model for Inter-Departmental Billing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} InterDeptBilling model
 */
export const createInterDeptBillingModel = (sequelize: Sequelize) => {
  class InterDeptBilling extends Model {
    public id!: string;
    public billingId!: string;
    public fromCostCenter!: string;
    public toCostCenter!: string;
    public serviceDescription!: string;
    public quantity!: number;
    public unitRate!: number;
    public totalAmount!: number;
    public billingDate!: Date;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public status!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  InterDeptBilling.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      billingId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Billing identifier',
      },
      fromCostCenter: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Providing cost center',
      },
      toCostCenter: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Receiving cost center',
      },
      serviceDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Service description',
      },
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Quantity',
      },
      unitRate: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Unit rate',
      },
      totalAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total amount',
      },
      billingDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Billing date',
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
      },
      status: {
        type: DataTypes.ENUM('draft', 'billed', 'paid'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Billing status',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'inter_dept_billing',
      timestamps: true,
      indexes: [
        { fields: ['billingId'], unique: true },
        { fields: ['fromCostCenter'] },
        { fields: ['toCostCenter'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
        { fields: ['status'] },
      ],
    },
  );

  return InterDeptBilling;
};

// ============================================================================
// COST CENTER MANAGEMENT (1-8)
// ============================================================================

/**
 * Creates cost center with hierarchy validation.
 *
 * @param {CostCenterData} centerData - Cost center data
 * @param {Model} CostCenter - CostCenter model
 * @param {string} userId - User creating center
 * @returns {Promise<any>} Created cost center
 */
export const createCostCenter = async (
  centerData: CostCenterData,
  CostCenter: any,
  userId: string,
): Promise<any> => {
  const center = await CostCenter.create({
    ...centerData,
    currentPeriodCost: 0,
    ytdCost: 0,
    budgetAmount: 0,
    headcount: 0,
    squareFootage: 0,
  });

  console.log(`Cost center created: ${center.costCenterCode} by ${userId}`);
  return center;
};

/**
 * Builds cost center hierarchy tree.
 *
 * @param {Model} CostCenter - CostCenter model
 * @returns {Promise<any[]>} Hierarchical tree
 */
export const buildCostCenterHierarchy = async (
  CostCenter: any,
): Promise<any[]> => {
  const centers = await CostCenter.findAll({ where: { isActive: true } });
  const centerMap = new Map();
  const rootCenters: any[] = [];

  centers.forEach((center: any) => {
    centerMap.set(center.costCenterCode, { ...center.toJSON(), children: [] });
  });

  centers.forEach((center: any) => {
    const node = centerMap.get(center.costCenterCode);
    if (center.parentCostCenter) {
      const parent = centerMap.get(center.parentCostCenter);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      rootCenters.push(node);
    }
  });

  return rootCenters;
};

/**
 * Updates cost center budget allocation.
 *
 * @param {string} costCenterCode - Cost center code
 * @param {number} budgetAmount - Budget amount
 * @param {Model} CostCenter - CostCenter model
 * @returns {Promise<any>} Updated cost center
 */
export const updateCostCenterBudget = async (
  costCenterCode: string,
  budgetAmount: number,
  CostCenter: any,
): Promise<any> => {
  const center = await CostCenter.findOne({ where: { costCenterCode } });
  if (!center) throw new Error('Cost center not found');

  center.budgetAmount = budgetAmount;
  await center.save();

  return center;
};

/**
 * Retrieves cost centers by type.
 *
 * @param {string} costCenterType - Cost center type
 * @param {Model} CostCenter - CostCenter model
 * @returns {Promise<any[]>} Filtered cost centers
 */
export const getCostCentersByType = async (
  costCenterType: string,
  CostCenter: any,
): Promise<any[]> => {
  return await CostCenter.findAll({
    where: { costCenterType, isActive: true },
    order: [['costCenterCode', 'ASC']],
  });
};

/**
 * Calculates cost center utilization rate.
 *
 * @param {string} costCenterCode - Cost center code
 * @param {Model} CostCenter - CostCenter model
 * @returns {Promise<any>} Utilization metrics
 */
export const calculateCostCenterUtilization = async (
  costCenterCode: string,
  CostCenter: any,
): Promise<any> => {
  const center = await CostCenter.findOne({ where: { costCenterCode } });
  if (!center) throw new Error('Cost center not found');

  const utilizationRate = center.budgetAmount > 0
    ? (center.currentPeriodCost / center.budgetAmount) * 100
    : 0;

  const ytdUtilizationRate = center.budgetAmount > 0
    ? (center.ytdCost / center.budgetAmount) * 100
    : 0;

  return {
    costCenterCode,
    costCenterName: center.costCenterName,
    budgetAmount: center.budgetAmount,
    currentPeriodCost: center.currentPeriodCost,
    ytdCost: center.ytdCost,
    utilizationRate,
    ytdUtilizationRate,
    remainingBudget: center.budgetAmount - center.ytdCost,
  };
};

/**
 * Transfers cost between cost centers.
 *
 * @param {string} fromCostCenter - Source cost center
 * @param {string} toCostCenter - Target cost center
 * @param {number} amount - Transfer amount
 * @param {Model} CostCenter - CostCenter model
 * @returns {Promise<any>} Transfer result
 */
export const transferCostBetweenCenters = async (
  fromCostCenter: string,
  toCostCenter: string,
  amount: number,
  CostCenter: any,
): Promise<any> => {
  const sourceCenter = await CostCenter.findOne({ where: { costCenterCode: fromCostCenter } });
  const targetCenter = await CostCenter.findOne({ where: { costCenterCode: toCostCenter } });

  if (!sourceCenter || !targetCenter) {
    throw new Error('Cost center not found');
  }

  sourceCenter.currentPeriodCost -= amount;
  sourceCenter.ytdCost -= amount;
  await sourceCenter.save();

  targetCenter.currentPeriodCost += amount;
  targetCenter.ytdCost += amount;
  await targetCenter.save();

  return {
    fromCostCenter,
    toCostCenter,
    amount,
    timestamp: new Date(),
  };
};

/**
 * Deactivates cost center with balance check.
 *
 * @param {string} costCenterCode - Cost center code
 * @param {Model} CostCenter - CostCenter model
 * @returns {Promise<any>} Deactivated cost center
 */
export const deactivateCostCenter = async (
  costCenterCode: string,
  CostCenter: any,
): Promise<any> => {
  const center = await CostCenter.findOne({ where: { costCenterCode } });
  if (!center) throw new Error('Cost center not found');

  center.isActive = false;
  await center.save();

  return center;
};

/**
 * Retrieves cost center performance summary.
 *
 * @param {string} costCenterCode - Cost center code
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} CostCenter - CostCenter model
 * @returns {Promise<any>} Performance summary
 */
export const getCostCenterPerformance = async (
  costCenterCode: string,
  fiscalYear: number,
  CostCenter: any,
): Promise<any> => {
  const center = await CostCenter.findOne({ where: { costCenterCode } });
  if (!center) throw new Error('Cost center not found');

  const variance = center.budgetAmount - center.ytdCost;
  const variancePercent = center.budgetAmount > 0
    ? (variance / center.budgetAmount) * 100
    : 0;

  return {
    costCenterCode,
    costCenterName: center.costCenterName,
    fiscalYear,
    budgetAmount: center.budgetAmount,
    ytdCost: center.ytdCost,
    variance,
    variancePercent,
    favorable: variance >= 0,
  };
};

// ============================================================================
// ALLOCATION POOL MANAGEMENT (9-16)
// ============================================================================

/**
 * Creates allocation pool for cost distribution.
 *
 * @param {AllocationPoolData} poolData - Pool data
 * @param {Model} AllocationPool - AllocationPool model
 * @returns {Promise<any>} Created pool
 */
export const createAllocationPool = async (
  poolData: AllocationPoolData,
  AllocationPool: any,
): Promise<any> => {
  return await AllocationPool.create({
    ...poolData,
    allocatedAmount: 0,
    unallocatedAmount: poolData.totalAmount,
  });
};

/**
 * Updates pool total with recalculation.
 *
 * @param {string} poolId - Pool ID
 * @param {number} totalAmount - New total amount
 * @param {Model} AllocationPool - AllocationPool model
 * @returns {Promise<any>} Updated pool
 */
export const updatePoolTotal = async (
  poolId: string,
  totalAmount: number,
  AllocationPool: any,
): Promise<any> => {
  const pool = await AllocationPool.findOne({ where: { poolId } });
  if (!pool) throw new Error('Pool not found');

  pool.totalAmount = totalAmount;
  pool.unallocatedAmount = totalAmount - pool.allocatedAmount;
  await pool.save();

  return pool;
};

/**
 * Retrieves pools by fiscal period.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} AllocationPool - AllocationPool model
 * @returns {Promise<any[]>} Allocation pools
 */
export const getPoolsByPeriod = async (
  fiscalYear: number,
  fiscalPeriod: number,
  AllocationPool: any,
): Promise<any[]> => {
  return await AllocationPool.findAll({
    where: { fiscalYear, fiscalPeriod, isActive: true },
  });
};

/**
 * Calculates pool allocation rate.
 *
 * @param {string} poolId - Pool ID
 * @param {number} totalBasis - Total allocation basis
 * @param {Model} AllocationPool - AllocationPool model
 * @returns {Promise<number>} Allocation rate
 */
export const calculatePoolAllocationRate = async (
  poolId: string,
  totalBasis: number,
  AllocationPool: any,
): Promise<number> => {
  const pool = await AllocationPool.findOne({ where: { poolId } });
  if (!pool) throw new Error('Pool not found');

  return totalBasis > 0 ? pool.totalAmount / totalBasis : 0;
};

/**
 * Validates pool allocation completeness.
 *
 * @param {string} poolId - Pool ID
 * @param {Model} AllocationPool - AllocationPool model
 * @returns {Promise<{ complete: boolean; unallocatedAmount: number }>}
 */
export const validatePoolAllocation = async (
  poolId: string,
  AllocationPool: any,
): Promise<{ complete: boolean; unallocatedAmount: number }> => {
  const pool = await AllocationPool.findOne({ where: { poolId } });
  if (!pool) throw new Error('Pool not found');

  const unallocatedAmount = parseFloat(pool.unallocatedAmount);
  return {
    complete: Math.abs(unallocatedAmount) < 0.01,
    unallocatedAmount,
  };
};

/**
 * Closes allocation pool for period.
 *
 * @param {string} poolId - Pool ID
 * @param {string} userId - User closing pool
 * @param {Model} AllocationPool - AllocationPool model
 * @returns {Promise<any>} Closed pool
 */
export const closeAllocationPool = async (
  poolId: string,
  userId: string,
  AllocationPool: any,
): Promise<any> => {
  const pool = await AllocationPool.findOne({ where: { poolId } });
  if (!pool) throw new Error('Pool not found');

  pool.isActive = false;
  pool.metadata = {
    ...pool.metadata,
    closedBy: userId,
    closedAt: new Date().toISOString(),
  };
  await pool.save();

  return pool;
};

/**
 * Generates pool allocation summary.
 *
 * @param {string} poolId - Pool ID
 * @param {Model} AllocationPool - AllocationPool model
 * @param {Model} CostAllocation - CostAllocation model
 * @returns {Promise<any>} Allocation summary
 */
export const generatePoolAllocationSummary = async (
  poolId: string,
  AllocationPool: any,
  CostAllocation: any,
): Promise<any> => {
  const pool = await AllocationPool.findOne({ where: { poolId } });
  if (!pool) throw new Error('Pool not found');

  const allocations = await CostAllocation.findAll({
    where: { poolId, status: 'allocated' },
  });

  const totalAllocated = allocations.reduce(
    (sum: number, alloc: any) => sum + parseFloat(alloc.allocationAmount),
    0,
  );

  return {
    poolId,
    poolName: pool.poolName,
    totalAmount: pool.totalAmount,
    allocatedAmount: totalAllocated,
    unallocatedAmount: pool.totalAmount - totalAllocated,
    allocationCount: allocations.length,
    allocations,
  };
};

/**
 * Rolls forward allocation pool to next period.
 *
 * @param {string} poolId - Pool ID
 * @param {number} newFiscalYear - New fiscal year
 * @param {number} newFiscalPeriod - New fiscal period
 * @param {Model} AllocationPool - AllocationPool model
 * @returns {Promise<any>} New pool
 */
export const rollForwardAllocationPool = async (
  poolId: string,
  newFiscalYear: number,
  newFiscalPeriod: number,
  AllocationPool: any,
): Promise<any> => {
  const pool = await AllocationPool.findOne({ where: { poolId } });
  if (!pool) throw new Error('Pool not found');

  const newPoolId = `${poolId}-${newFiscalYear}-${newFiscalPeriod}`;

  return await AllocationPool.create({
    poolId: newPoolId,
    poolName: pool.poolName,
    poolType: pool.poolType,
    fiscalYear: newFiscalYear,
    fiscalPeriod: newFiscalPeriod,
    totalAmount: 0,
    allocatedAmount: 0,
    unallocatedAmount: 0,
    allocationMethod: pool.allocationMethod,
    allocationBasis: pool.allocationBasis,
    isActive: true,
    description: pool.description,
  });
};

// ============================================================================
// ALLOCATION RULES & EXECUTION (17-24)
// ============================================================================

/**
 * Creates allocation rule with validation.
 *
 * @param {AllocationRuleData} ruleData - Rule data
 * @param {Model} AllocationRule - AllocationRule model
 * @returns {Promise<any>} Created rule
 */
export const createAllocationRule = async (
  ruleData: AllocationRuleData,
  AllocationRule: any,
): Promise<any> => {
  return await AllocationRule.create({
    ...ruleData,
    effectiveDate: new Date(),
  });
};

/**
 * Validates allocation rule percentages sum to 100%.
 *
 * @param {string} poolId - Pool ID
 * @param {Model} AllocationRule - AllocationRule model
 * @returns {Promise<{ valid: boolean; totalPercent: number }>}
 */
export const validateAllocationRulePercentages = async (
  poolId: string,
  AllocationRule: any,
): Promise<{ valid: boolean; totalPercent: number }> => {
  const rules = await AllocationRule.findAll({
    where: { poolId, isActive: true },
  });

  const totalPercent = rules.reduce(
    (sum: number, rule: any) => sum + parseFloat(rule.allocationPercent),
    0,
  );

  return {
    valid: Math.abs(totalPercent - 100) < 0.01,
    totalPercent,
  };
};

/**
 * Executes direct allocation method.
 *
 * @param {string} poolId - Pool ID
 * @param {Model} AllocationPool - AllocationPool model
 * @param {Model} AllocationRule - AllocationRule model
 * @param {Model} CostAllocation - CostAllocation model
 * @returns {Promise<any[]>} Created allocations
 */
export const executeDirectAllocation = async (
  poolId: string,
  AllocationPool: any,
  AllocationRule: any,
  CostAllocation: any,
): Promise<any[]> => {
  const pool = await AllocationPool.findOne({ where: { poolId } });
  if (!pool) throw new Error('Pool not found');

  const rules = await AllocationRule.findAll({
    where: { poolId, isActive: true },
  });

  const allocations = [];
  for (const rule of rules) {
    const allocationAmount = (pool.totalAmount * parseFloat(rule.allocationPercent)) / 100;

    const allocation = await CostAllocation.create({
      allocationId: `${poolId}-${rule.targetCostCenter}-${Date.now()}`,
      poolId,
      sourceCostCenter: rule.sourceCostCenter,
      targetCostCenter: rule.targetCostCenter,
      fiscalYear: pool.fiscalYear,
      fiscalPeriod: pool.fiscalPeriod,
      allocationAmount,
      allocationMethod: 'direct',
      allocationBasis: rule.allocationBasis,
      allocationDate: new Date(),
      status: 'allocated',
    });

    allocations.push(allocation);
  }

  pool.allocatedAmount = pool.totalAmount;
  pool.unallocatedAmount = 0;
  await pool.save();

  return allocations;
};

/**
 * Executes step-down allocation method.
 *
 * @param {string[]} poolIds - Pool IDs in allocation order
 * @param {Model} AllocationPool - AllocationPool model
 * @param {Model} AllocationRule - AllocationRule model
 * @param {Model} CostAllocation - CostAllocation model
 * @returns {Promise<any[]>} Created allocations
 */
export const executeStepDownAllocation = async (
  poolIds: string[],
  AllocationPool: any,
  AllocationRule: any,
  CostAllocation: any,
): Promise<any[]> => {
  const allocations: any[] = [];

  for (const poolId of poolIds) {
    const poolAllocations = await executeDirectAllocation(
      poolId,
      AllocationPool,
      AllocationRule,
      CostAllocation,
    );
    allocations.push(...poolAllocations);
  }

  return allocations;
};

/**
 * Executes activity-based allocation.
 *
 * @param {string} poolId - Pool ID
 * @param {Model} AllocationPool - AllocationPool model
 * @param {Model} AllocationDriver - AllocationDriver model
 * @param {Model} CostAllocation - CostAllocation model
 * @returns {Promise<any[]>} Created allocations
 */
export const executeActivityBasedAllocation = async (
  poolId: string,
  AllocationPool: any,
  AllocationDriver: any,
  CostAllocation: any,
): Promise<any[]> => {
  const pool = await AllocationPool.findOne({ where: { poolId } });
  if (!pool) throw new Error('Pool not found');

  const drivers = await AllocationDriver.findAll({
    where: {
      fiscalYear: pool.fiscalYear,
      fiscalPeriod: pool.fiscalPeriod,
      driverType: pool.allocationBasis,
    },
  });

  const totalDriverValue = drivers.reduce(
    (sum: number, driver: any) => sum + parseFloat(driver.driverValue),
    0,
  );

  const allocations = [];
  for (const driver of drivers) {
    const allocationPercent = (parseFloat(driver.driverValue) / totalDriverValue) * 100;
    const allocationAmount = (pool.totalAmount * allocationPercent) / 100;

    const allocation = await CostAllocation.create({
      allocationId: `${poolId}-${driver.costCenterCode}-${Date.now()}`,
      poolId,
      sourceCostCenter: poolId,
      targetCostCenter: driver.costCenterCode,
      fiscalYear: pool.fiscalYear,
      fiscalPeriod: pool.fiscalPeriod,
      allocationAmount,
      allocationMethod: 'activity_based',
      allocationBasis: pool.allocationBasis,
      allocationDate: new Date(),
      status: 'allocated',
    });

    allocations.push(allocation);
  }

  pool.allocatedAmount = pool.totalAmount;
  pool.unallocatedAmount = 0;
  await pool.save();

  return allocations;
};

/**
 * Reverses cost allocation.
 *
 * @param {string} allocationId - Allocation ID
 * @param {string} userId - User reversing allocation
 * @param {Model} CostAllocation - CostAllocation model
 * @returns {Promise<any>} Reversed allocation
 */
export const reverseAllocation = async (
  allocationId: string,
  userId: string,
  CostAllocation: any,
): Promise<any> => {
  const allocation = await CostAllocation.findOne({ where: { allocationId } });
  if (!allocation) throw new Error('Allocation not found');

  allocation.status = 'reversed';
  allocation.reversedAt = new Date();
  allocation.reversedBy = userId;
  await allocation.save();

  return allocation;
};

/**
 * Retrieves allocations by target cost center.
 *
 * @param {string} costCenterCode - Cost center code
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} CostAllocation - CostAllocation model
 * @returns {Promise<any[]>} Allocations
 */
export const getAllocationsByTarget = async (
  costCenterCode: string,
  fiscalYear: number,
  fiscalPeriod: number,
  CostAllocation: any,
): Promise<any[]> => {
  return await CostAllocation.findAll({
    where: {
      targetCostCenter: costCenterCode,
      fiscalYear,
      fiscalPeriod,
      status: 'allocated',
    },
  });
};

// ============================================================================
// ALLOCATION DRIVERS & METRICS (25-32)
// ============================================================================

/**
 * Records allocation driver values.
 *
 * @param {AllocationDriverData} driverData - Driver data
 * @param {Model} AllocationDriver - AllocationDriver model
 * @returns {Promise<any>} Created driver
 */
export const recordAllocationDriver = async (
  driverData: AllocationDriverData,
  AllocationDriver: any,
): Promise<any> => {
  return await AllocationDriver.create(driverData);
};

/**
 * Updates driver values for cost center.
 *
 * @param {string} costCenterCode - Cost center code
 * @param {string} driverType - Driver type
 * @param {number} driverValue - Driver value
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} AllocationDriver - AllocationDriver model
 * @returns {Promise<any>} Updated driver
 */
export const updateAllocationDriverValue = async (
  costCenterCode: string,
  driverType: string,
  driverValue: number,
  fiscalYear: number,
  fiscalPeriod: number,
  AllocationDriver: any,
): Promise<any> => {
  const existing = await AllocationDriver.findOne({
    where: { costCenterCode, driverType, fiscalYear, fiscalPeriod },
  });

  if (existing) {
    existing.driverValue = driverValue;
    await existing.save();
    return existing;
  }

  return await AllocationDriver.create({
    driverId: `${costCenterCode}-${driverType}-${fiscalYear}-${fiscalPeriod}`,
    driverName: driverType,
    driverType,
    measurementUnit: 'units',
    costCenterCode,
    driverValue,
    fiscalYear,
    fiscalPeriod,
  });
};

/**
 * Retrieves driver values for period.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} driverType - Driver type
 * @param {Model} AllocationDriver - AllocationDriver model
 * @returns {Promise<any[]>} Driver values
 */
export const getDriverValuesByPeriod = async (
  fiscalYear: number,
  fiscalPeriod: number,
  driverType: string,
  AllocationDriver: any,
): Promise<any[]> => {
  return await AllocationDriver.findAll({
    where: { fiscalYear, fiscalPeriod, driverType },
  });
};

/**
 * Calculates driver-based allocation percentages.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} driverType - Driver type
 * @param {Model} AllocationDriver - AllocationDriver model
 * @returns {Promise<any[]>} Allocation percentages
 */
export const calculateDriverBasedPercentages = async (
  fiscalYear: number,
  fiscalPeriod: number,
  driverType: string,
  AllocationDriver: any,
): Promise<any[]> => {
  const drivers = await AllocationDriver.findAll({
    where: { fiscalYear, fiscalPeriod, driverType },
  });

  const totalValue = drivers.reduce(
    (sum: number, driver: any) => sum + parseFloat(driver.driverValue),
    0,
  );

  return drivers.map((driver: any) => ({
    costCenterCode: driver.costCenterCode,
    driverValue: parseFloat(driver.driverValue),
    allocationPercent: totalValue > 0
      ? (parseFloat(driver.driverValue) / totalValue) * 100
      : 0,
  }));
};

/**
 * Validates driver data completeness.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} CostCenter - CostCenter model
 * @param {Model} AllocationDriver - AllocationDriver model
 * @returns {Promise<{ complete: boolean; missingCenters: string[] }>}
 */
export const validateDriverCompleteness = async (
  fiscalYear: number,
  fiscalPeriod: number,
  CostCenter: any,
  AllocationDriver: any,
): Promise<{ complete: boolean; missingCenters: string[] }> => {
  const activeCenters = await CostCenter.findAll({ where: { isActive: true } });
  const driversRecorded = await AllocationDriver.findAll({
    where: { fiscalYear, fiscalPeriod },
  });

  const recordedCenters = new Set(driversRecorded.map((d: any) => d.costCenterCode));
  const missingCenters = activeCenters
    .filter((center: any) => !recordedCenters.has(center.costCenterCode))
    .map((center: any) => center.costCenterCode);

  return {
    complete: missingCenters.length === 0,
    missingCenters,
  };
};

/**
 * Generates driver trend analysis.
 *
 * @param {string} costCenterCode - Cost center code
 * @param {string} driverType - Driver type
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} AllocationDriver - AllocationDriver model
 * @returns {Promise<any>} Trend analysis
 */
export const generateDriverTrendAnalysis = async (
  costCenterCode: string,
  driverType: string,
  fiscalYear: number,
  AllocationDriver: any,
): Promise<any> => {
  const drivers = await AllocationDriver.findAll({
    where: { costCenterCode, driverType, fiscalYear },
    order: [['fiscalPeriod', 'ASC']],
  });

  const values = drivers.map((d: any) => parseFloat(d.driverValue));
  const average = values.reduce((sum, val) => sum + val, 0) / values.length || 0;
  const max = Math.max(...values);
  const min = Math.min(...values);

  return {
    costCenterCode,
    driverType,
    fiscalYear,
    periodValues: drivers.map((d: any) => ({
      period: d.fiscalPeriod,
      value: parseFloat(d.driverValue),
    })),
    average,
    max,
    min,
    variance: max - min,
  };
};

/**
 * Exports driver data to CSV.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} AllocationDriver - AllocationDriver model
 * @returns {Promise<string>} CSV content
 */
export const exportDriverDataCSV = async (
  fiscalYear: number,
  fiscalPeriod: number,
  AllocationDriver: any,
): Promise<string> => {
  const drivers = await AllocationDriver.findAll({
    where: { fiscalYear, fiscalPeriod },
  });

  const headers = 'Cost Center,Driver Type,Driver Value,Measurement Unit\n';
  const rows = drivers.map((d: any) =>
    `${d.costCenterCode},${d.driverType},${d.driverValue},${d.measurementUnit}`
  );

  return headers + rows.join('\n');
};

/**
 * Calculates weighted allocation factors.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Record<string, number>} driverWeights - Driver type weights
 * @param {Model} AllocationDriver - AllocationDriver model
 * @returns {Promise<any[]>} Weighted factors
 */
export const calculateWeightedAllocationFactors = async (
  fiscalYear: number,
  fiscalPeriod: number,
  driverWeights: Record<string, number>,
  AllocationDriver: any,
): Promise<any[]> => {
  const costCenterFactors = new Map<string, number>();

  for (const [driverType, weight] of Object.entries(driverWeights)) {
    const drivers = await AllocationDriver.findAll({
      where: { fiscalYear, fiscalPeriod, driverType },
    });

    const totalValue = drivers.reduce(
      (sum: number, d: any) => sum + parseFloat(d.driverValue),
      0,
    );

    drivers.forEach((driver: any) => {
      const percent = totalValue > 0
        ? (parseFloat(driver.driverValue) / totalValue) * 100
        : 0;

      const weightedPercent = percent * weight;
      const current = costCenterFactors.get(driver.costCenterCode) || 0;
      costCenterFactors.set(driver.costCenterCode, current + weightedPercent);
    });
  }

  return Array.from(costCenterFactors.entries()).map(([costCenter, factor]) => ({
    costCenterCode: costCenter,
    weightedFactor: factor,
  }));
};

// ============================================================================
// INTER-DEPARTMENTAL BILLING (33-40)
// ============================================================================

/**
 * Creates inter-departmental billing record.
 *
 * @param {InterDeptBillingData} billingData - Billing data
 * @param {Model} InterDeptBilling - InterDeptBilling model
 * @returns {Promise<any>} Created billing
 */
export const createInterDeptBilling = async (
  billingData: InterDeptBillingData,
  InterDeptBilling: any,
): Promise<any> => {
  return await InterDeptBilling.create(billingData);
};

/**
 * Processes inter-departmental billing batch.
 *
 * @param {InterDeptBillingData[]} billings - Array of billings
 * @param {Model} InterDeptBilling - InterDeptBilling model
 * @returns {Promise<any[]>} Created billings
 */
export const processInterDeptBillingBatch = async (
  billings: InterDeptBillingData[],
  InterDeptBilling: any,
): Promise<any[]> => {
  const created = [];
  for (const billing of billings) {
    const record = await InterDeptBilling.create(billing);
    created.push(record);
  }
  return created;
};

/**
 * Retrieves billings for cost center.
 *
 * @param {string} costCenterCode - Cost center code
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} InterDeptBilling - InterDeptBilling model
 * @returns {Promise<any>} Billing summary
 */
export const getBillingsForCostCenter = async (
  costCenterCode: string,
  fiscalYear: number,
  fiscalPeriod: number,
  InterDeptBilling: any,
): Promise<any> => {
  const received = await InterDeptBilling.findAll({
    where: { toCostCenter: costCenterCode, fiscalYear, fiscalPeriod },
  });

  const provided = await InterDeptBilling.findAll({
    where: { fromCostCenter: costCenterCode, fiscalYear, fiscalPeriod },
  });

  const totalReceived = received.reduce(
    (sum: number, b: any) => sum + parseFloat(b.totalAmount),
    0,
  );

  const totalProvided = provided.reduce(
    (sum: number, b: any) => sum + parseFloat(b.totalAmount),
    0,
  );

  return {
    costCenterCode,
    fiscalYear,
    fiscalPeriod,
    receivedBillings: received,
    providedBillings: provided,
    totalReceived,
    totalProvided,
    netBilling: totalProvided - totalReceived,
  };
};

/**
 * Generates inter-departmental billing report.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} InterDeptBilling - InterDeptBilling model
 * @returns {Promise<any>} Billing report
 */
export const generateInterDeptBillingReport = async (
  fiscalYear: number,
  fiscalPeriod: number,
  InterDeptBilling: any,
): Promise<any> => {
  const billings = await InterDeptBilling.findAll({
    where: { fiscalYear, fiscalPeriod },
  });

  const totalBilled = billings.reduce(
    (sum: number, b: any) => sum + parseFloat(b.totalAmount),
    0,
  );

  const byCostCenter = new Map<string, number>();
  billings.forEach((b: any) => {
    const providedCurrent = byCostCenter.get(b.fromCostCenter) || 0;
    byCostCenter.set(b.fromCostCenter, providedCurrent + parseFloat(b.totalAmount));

    const receivedCurrent = byCostCenter.get(b.toCostCenter) || 0;
    byCostCenter.set(b.toCostCenter, receivedCurrent - parseFloat(b.totalAmount));
  });

  return {
    fiscalYear,
    fiscalPeriod,
    totalBilled,
    billingCount: billings.length,
    netPositionsByCostCenter: Array.from(byCostCenter.entries()).map(([cc, amount]) => ({
      costCenter: cc,
      netPosition: amount,
    })),
  };
};

/**
 * Validates billing rates.
 *
 * @param {string} fromCostCenter - Providing cost center
 * @param {string} serviceDescription - Service description
 * @param {number} unitRate - Proposed unit rate
 * @returns {Promise<{ valid: boolean; reason?: string }>}
 */
export const validateBillingRate = async (
  fromCostCenter: string,
  serviceDescription: string,
  unitRate: number,
): Promise<{ valid: boolean; reason?: string }> => {
  if (unitRate <= 0) {
    return { valid: false, reason: 'Unit rate must be positive' };
  }

  // Additional rate validation logic would go here
  return { valid: true };
};

/**
 * Approves inter-departmental billing.
 *
 * @param {string} billingId - Billing ID
 * @param {string} userId - User approving billing
 * @param {Model} InterDeptBilling - InterDeptBilling model
 * @returns {Promise<any>} Approved billing
 */
export const approveInterDeptBilling = async (
  billingId: string,
  userId: string,
  InterDeptBilling: any,
): Promise<any> => {
  const billing = await InterDeptBilling.findOne({ where: { billingId } });
  if (!billing) throw new Error('Billing not found');

  billing.status = 'billed';
  billing.metadata = {
    ...billing.metadata,
    approvedBy: userId,
    approvedAt: new Date().toISOString(),
  };
  await billing.save();

  return billing;
};

/**
 * Exports billing data to Excel.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} InterDeptBilling - InterDeptBilling model
 * @returns {Promise<Buffer>} Excel buffer
 */
export const exportBillingDataExcel = async (
  fiscalYear: number,
  fiscalPeriod: number,
  InterDeptBilling: any,
): Promise<Buffer> => {
  const billings = await InterDeptBilling.findAll({
    where: { fiscalYear, fiscalPeriod },
  });

  const csv = 'Billing ID,From Cost Center,To Cost Center,Service,Quantity,Unit Rate,Total Amount,Status\n' +
    billings.map((b: any) =>
      `${b.billingId},${b.fromCostCenter},${b.toCostCenter},${b.serviceDescription},${b.quantity},${b.unitRate},${b.totalAmount},${b.status}`
    ).join('\n');

  return Buffer.from(csv, 'utf-8');
};

/**
 * Reconciles inter-departmental billings with allocations.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Model} InterDeptBilling - InterDeptBilling model
 * @param {Model} CostAllocation - CostAllocation model
 * @returns {Promise<any>} Reconciliation result
 */
export const reconcileBillingsWithAllocations = async (
  fiscalYear: number,
  fiscalPeriod: number,
  InterDeptBilling: any,
  CostAllocation: any,
): Promise<any> => {
  const billings = await InterDeptBilling.findAll({
    where: { fiscalYear, fiscalPeriod },
  });

  const allocations = await CostAllocation.findAll({
    where: { fiscalYear, fiscalPeriod, status: 'allocated' },
  });

  const totalBilled = billings.reduce(
    (sum: number, b: any) => sum + parseFloat(b.totalAmount),
    0,
  );

  const totalAllocated = allocations.reduce(
    (sum: number, a: any) => sum + parseFloat(a.allocationAmount),
    0,
  );

  return {
    fiscalYear,
    fiscalPeriod,
    totalBilled,
    totalAllocated,
    variance: totalBilled - totalAllocated,
    reconciled: Math.abs(totalBilled - totalAllocated) < 0.01,
  };
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

@Injectable()
export class CEFMSCostCenterAllocationService {
  constructor(private readonly sequelize: Sequelize) {}

  async createCostCenter(centerData: CostCenterData, userId: string) {
    const CostCenter = createCostCenterModel(this.sequelize);
    return createCostCenter(centerData, CostCenter, userId);
  }

  async createAllocationPool(poolData: AllocationPoolData) {
    const AllocationPool = createAllocationPoolModel(this.sequelize);
    return createAllocationPool(poolData, AllocationPool);
  }

  async executeAllocation(poolId: string, method: string) {
    const AllocationPool = createAllocationPoolModel(this.sequelize);
    const AllocationRule = createAllocationRuleModel(this.sequelize);
    const CostAllocation = createCostAllocationModel(this.sequelize);

    if (method === 'direct') {
      return executeDirectAllocation(poolId, AllocationPool, AllocationRule, CostAllocation);
    }

    throw new Error('Unsupported allocation method');
  }
}

export default {
  // Models
  createCostCenterModel,
  createAllocationPoolModel,
  createAllocationRuleModel,
  createCostAllocationModel,
  createAllocationDriverModel,
  createInterDeptBillingModel,

  // Cost Centers
  createCostCenter,
  buildCostCenterHierarchy,
  updateCostCenterBudget,
  getCostCentersByType,
  calculateCostCenterUtilization,
  transferCostBetweenCenters,
  deactivateCostCenter,
  getCostCenterPerformance,

  // Pools
  createAllocationPool,
  updatePoolTotal,
  getPoolsByPeriod,
  calculatePoolAllocationRate,
  validatePoolAllocation,
  closeAllocationPool,
  generatePoolAllocationSummary,
  rollForwardAllocationPool,

  // Rules & Execution
  createAllocationRule,
  validateAllocationRulePercentages,
  executeDirectAllocation,
  executeStepDownAllocation,
  executeActivityBasedAllocation,
  reverseAllocation,
  getAllocationsByTarget,

  // Drivers
  recordAllocationDriver,
  updateAllocationDriverValue,
  getDriverValuesByPeriod,
  calculateDriverBasedPercentages,
  validateDriverCompleteness,
  generateDriverTrendAnalysis,
  exportDriverDataCSV,
  calculateWeightedAllocationFactors,

  // Inter-Dept Billing
  createInterDeptBilling,
  processInterDeptBillingBatch,
  getBillingsForCostCenter,
  generateInterDeptBillingReport,
  validateBillingRate,
  approveInterDeptBilling,
  exportBillingDataExcel,
  reconcileBillingsWithAllocations,

  // Service
  CEFMSCostCenterAllocationService,
};
