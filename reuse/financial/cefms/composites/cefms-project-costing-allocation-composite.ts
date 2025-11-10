/**
 * LOC: CEFMSPCA001
 * File: /reuse/financial/cefms/composites/cefms-project-costing-allocation-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../../../government/project-program-management-kit.ts
 *   - ../../../government/fund-accounting-operations-kit.ts
 *   - ../../../government/performance-metrics-kpi-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS project services
 *   - USACE project costing systems
 *   - Cost allocation modules
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-project-costing-allocation-composite.ts
 * Locator: WC-CEFMS-PCA-001
 * Purpose: USACE CEFMS Project Costing and Allocation - project cost tracking, cost allocation methodologies, indirect cost pools, overhead rates, labor distribution, material costs, subcontractor costs, variance analysis, earned value management
 *
 * Upstream: Composes utilities from government kits for comprehensive project costing
 * Downstream: ../../../backend/cefms/*, Project controllers, cost allocation engines, earned value reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 40+ composite functions for USACE CEFMS project costing operations
 *
 * LLM Context: Production-ready USACE CEFMS project costing and allocation system.
 * Comprehensive project cost management for USACE construction and engineering projects including direct costs,
 * indirect cost pools, overhead allocation, labor hour tracking, material cost tracking, subcontractor billing,
 * equipment usage costing, work breakdown structure (WBS) management, cost baseline establishment, variance analysis,
 * earned value management (EVM), budget at completion forecasting, estimate to complete calculations,
 * cost performance index tracking, schedule performance metrics, and comprehensive project financial reporting.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ProjectCostData {
  projectId: string;
  projectName: string;
  projectCode: string;
  projectType: 'construction' | 'engineering' | 'maintenance' | 'research';
  projectManager: string;
  budgetAtCompletion: number;
  plannedValue: number;
  earnedValue: number;
  actualCost: number;
  startDate: Date;
  plannedEndDate: Date;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
}

interface CostAllocationData {
  allocationId: string;
  projectId: string;
  costPoolId: string;
  allocationDate: Date;
  allocationAmount: number;
  allocationBasis: 'direct_labor' | 'machine_hours' | 'square_footage' | 'headcount';
  basisValue: number;
  allocationRate: number;
}

interface IndirectCostPoolData {
  poolId: string;
  poolName: string;
  poolType: 'overhead' | 'g_and_a' | 'facilities' | 'it_support';
  fiscalYear: number;
  totalPoolCost: number;
  allocationBase: number;
  poolRate: number;
}

interface LaborCostData {
  laborId: string;
  projectId: string;
  wbsElement: string;
  employeeId: string;
  hoursWorked: number;
  hourlyRate: number;
  laborCost: number;
  workDate: Date;
  laborType: 'direct' | 'overhead' | 'administrative';
}

interface MaterialCostData {
  materialId: string;
  projectId: string;
  wbsElement: string;
  materialDescription: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  vendor: string;
  receiptDate: Date;
  materialType: 'raw' | 'equipment' | 'supplies';
}

interface SubcontractorCostData {
  subcontractId: string;
  projectId: string;
  wbsElement: string;
  subcontractorName: string;
  contractAmount: number;
  billedToDate: number;
  retainageHeld: number;
  retainagePercent: number;
  contractStatus: 'active' | 'completed' | 'disputed';
}

interface EquipmentCostData {
  equipmentId: string;
  projectId: string;
  wbsElement: string;
  equipmentType: string;
  usageHours: number;
  hourlyRate: number;
  totalCost: number;
  usageDate: Date;
}

interface CostVarianceData {
  varianceId: string;
  projectId: string;
  wbsElement: string;
  varianceType: 'favorable' | 'unfavorable';
  plannedCost: number;
  actualCost: number;
  varianceAmount: number;
  variancePercent: number;
  varianceReason: string;
}

interface EarnedValueData {
  evmId: string;
  projectId: string;
  reportDate: Date;
  plannedValue: number;
  earnedValue: number;
  actualCost: number;
  costVariance: number;
  scheduleVariance: number;
  costPerformanceIndex: number;
  schedulePerformanceIndex: number;
  estimateAtCompletion: number;
  estimateToComplete: number;
  varianceAtCompletion: number;
}

interface WBSElementData {
  wbsId: string;
  projectId: string;
  wbsCode: string;
  wbsName: string;
  parentWbsId?: string;
  level: number;
  budgetAmount: number;
  actualCost: number;
  commitments: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Project Costs with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ProjectCost model
 *
 * @example
 * ```typescript
 * const ProjectCost = createProjectCostModel(sequelize);
 * const project = await ProjectCost.create({
 *   projectId: 'PROJ-2024-001',
 *   projectName: 'Dam Construction',
 *   projectCode: 'DAM-001',
 *   projectType: 'construction',
 *   budgetAtCompletion: 5000000
 * });
 * ```
 */
export const createProjectCostModel = (sequelize: Sequelize) => {
  class ProjectCost extends Model {
    public id!: string;
    public projectId!: string;
    public projectName!: string;
    public projectCode!: string;
    public projectType!: string;
    public projectManager!: string;
    public budgetAtCompletion!: number;
    public plannedValue!: number;
    public earnedValue!: number;
    public actualCost!: number;
    public startDate!: Date;
    public plannedEndDate!: Date;
    public actualEndDate!: Date | null;
    public status!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ProjectCost.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      projectId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Project identifier',
      },
      projectName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Project name',
      },
      projectCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Project code',
      },
      projectType: {
        type: DataTypes.ENUM('construction', 'engineering', 'maintenance', 'research'),
        allowNull: false,
        comment: 'Project type',
      },
      projectManager: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Project manager',
      },
      budgetAtCompletion: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Budget at completion (BAC)',
      },
      plannedValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Planned value (PV)',
      },
      earnedValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Earned value (EV)',
      },
      actualCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Actual cost (AC)',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Project start date',
      },
      plannedEndDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Planned end date',
      },
      actualEndDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual end date',
      },
      status: {
        type: DataTypes.ENUM('planning', 'active', 'on_hold', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'planning',
        comment: 'Project status',
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
      tableName: 'project_costs',
      timestamps: true,
      indexes: [
        { fields: ['projectId'], unique: true },
        { fields: ['projectCode'], unique: true },
        { fields: ['projectType'] },
        { fields: ['status'] },
        { fields: ['projectManager'] },
      ],
    },
  );

  return ProjectCost;
};

/**
 * Sequelize model for WBS Elements with hierarchy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} WBSElement model
 */
export const createWBSElementModel = (sequelize: Sequelize) => {
  class WBSElement extends Model {
    public id!: string;
    public wbsId!: string;
    public projectId!: string;
    public wbsCode!: string;
    public wbsName!: string;
    public parentWbsId!: string | null;
    public level!: number;
    public budgetAmount!: number;
    public actualCost!: number;
    public commitments!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  WBSElement.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      wbsId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'WBS element identifier',
      },
      projectId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Project identifier',
      },
      wbsCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'WBS code (e.g., 1.2.3)',
      },
      wbsName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'WBS element name',
      },
      parentWbsId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Parent WBS element',
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Hierarchy level',
      },
      budgetAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Budgeted amount',
      },
      actualCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Actual cost',
      },
      commitments: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Committed costs',
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
      tableName: 'wbs_elements',
      timestamps: true,
      indexes: [
        { fields: ['wbsId'], unique: true },
        { fields: ['projectId'] },
        { fields: ['wbsCode'] },
        { fields: ['parentWbsId'] },
        { fields: ['level'] },
      ],
    },
  );

  return WBSElement;
};

/**
 * Sequelize model for Labor Costs with timesheet integration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LaborCost model
 */
export const createLaborCostModel = (sequelize: Sequelize) => {
  class LaborCost extends Model {
    public id!: string;
    public laborId!: string;
    public projectId!: string;
    public wbsElement!: string;
    public employeeId!: string;
    public hoursWorked!: number;
    public hourlyRate!: number;
    public laborCost!: number;
    public workDate!: Date;
    public laborType!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  LaborCost.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      laborId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Labor cost identifier',
      },
      projectId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Project identifier',
      },
      wbsElement: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'WBS element code',
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Employee identifier',
      },
      hoursWorked: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Hours worked',
      },
      hourlyRate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Hourly rate',
      },
      laborCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total labor cost',
      },
      workDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Work date',
      },
      laborType: {
        type: DataTypes.ENUM('direct', 'overhead', 'administrative'),
        allowNull: false,
        comment: 'Labor type',
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
      tableName: 'labor_costs',
      timestamps: true,
      indexes: [
        { fields: ['laborId'], unique: true },
        { fields: ['projectId'] },
        { fields: ['wbsElement'] },
        { fields: ['employeeId'] },
        { fields: ['workDate'] },
        { fields: ['laborType'] },
      ],
    },
  );

  return LaborCost;
};

/**
 * Sequelize model for Material Costs with inventory tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} MaterialCost model
 */
export const createMaterialCostModel = (sequelize: Sequelize) => {
  class MaterialCost extends Model {
    public id!: string;
    public materialId!: string;
    public projectId!: string;
    public wbsElement!: string;
    public materialDescription!: string;
    public quantity!: number;
    public unitCost!: number;
    public totalCost!: number;
    public vendor!: string;
    public receiptDate!: Date;
    public materialType!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  MaterialCost.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      materialId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Material cost identifier',
      },
      projectId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Project identifier',
      },
      wbsElement: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'WBS element code',
      },
      materialDescription: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Material description',
      },
      quantity: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        comment: 'Quantity',
      },
      unitCost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Unit cost',
      },
      totalCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total cost',
      },
      vendor: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Vendor name',
      },
      receiptDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Receipt date',
      },
      materialType: {
        type: DataTypes.ENUM('raw', 'equipment', 'supplies'),
        allowNull: false,
        comment: 'Material type',
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
      tableName: 'material_costs',
      timestamps: true,
      indexes: [
        { fields: ['materialId'], unique: true },
        { fields: ['projectId'] },
        { fields: ['wbsElement'] },
        { fields: ['vendor'] },
        { fields: ['receiptDate'] },
        { fields: ['materialType'] },
      ],
    },
  );

  return MaterialCost;
};

/**
 * Sequelize model for Subcontractor Costs with retainage.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} SubcontractorCost model
 */
export const createSubcontractorCostModel = (sequelize: Sequelize) => {
  class SubcontractorCost extends Model {
    public id!: string;
    public subcontractId!: string;
    public projectId!: string;
    public wbsElement!: string;
    public subcontractorName!: string;
    public contractAmount!: number;
    public billedToDate!: number;
    public retainageHeld!: number;
    public retainagePercent!: number;
    public contractStatus!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  SubcontractorCost.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      subcontractId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Subcontract identifier',
      },
      projectId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Project identifier',
      },
      wbsElement: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'WBS element code',
      },
      subcontractorName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Subcontractor name',
      },
      contractAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Contract amount',
      },
      billedToDate: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Billed to date',
      },
      retainageHeld: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Retainage held',
      },
      retainagePercent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Retainage percentage',
      },
      contractStatus: {
        type: DataTypes.ENUM('active', 'completed', 'disputed'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Contract status',
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
      tableName: 'subcontractor_costs',
      timestamps: true,
      indexes: [
        { fields: ['subcontractId'], unique: true },
        { fields: ['projectId'] },
        { fields: ['wbsElement'] },
        { fields: ['subcontractorName'] },
        { fields: ['contractStatus'] },
      ],
    },
  );

  return SubcontractorCost;
};

/**
 * Sequelize model for Equipment Costs with usage tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EquipmentCost model
 */
export const createEquipmentCostModel = (sequelize: Sequelize) => {
  class EquipmentCost extends Model {
    public id!: string;
    public equipmentId!: string;
    public projectId!: string;
    public wbsElement!: string;
    public equipmentType!: string;
    public usageHours!: number;
    public hourlyRate!: number;
    public totalCost!: number;
    public usageDate!: Date;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  EquipmentCost.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      equipmentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Equipment identifier',
      },
      projectId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Project identifier',
      },
      wbsElement: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'WBS element code',
      },
      equipmentType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Equipment type',
      },
      usageHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Usage hours',
      },
      hourlyRate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Hourly rate',
      },
      totalCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total cost',
      },
      usageDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Usage date',
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
      tableName: 'equipment_costs',
      timestamps: true,
      indexes: [
        { fields: ['projectId'] },
        { fields: ['wbsElement'] },
        { fields: ['equipmentType'] },
        { fields: ['usageDate'] },
      ],
    },
  );

  return EquipmentCost;
};

/**
 * Sequelize model for Indirect Cost Pools with rate calculation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} IndirectCostPool model
 */
export const createIndirectCostPoolModel = (sequelize: Sequelize) => {
  class IndirectCostPool extends Model {
    public id!: string;
    public poolId!: string;
    public poolName!: string;
    public poolType!: string;
    public fiscalYear!: number;
    public totalPoolCost!: number;
    public allocationBase!: number;
    public poolRate!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  IndirectCostPool.init(
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
        type: DataTypes.ENUM('overhead', 'g_and_a', 'facilities', 'it_support'),
        allowNull: false,
        comment: 'Pool type',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      totalPoolCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Total pool cost',
      },
      allocationBase: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Allocation base',
      },
      poolRate: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        comment: 'Pool rate (cost / base)',
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
      tableName: 'indirect_cost_pools',
      timestamps: true,
      indexes: [
        { fields: ['poolId'], unique: true },
        { fields: ['poolType'] },
        { fields: ['fiscalYear'] },
      ],
    },
  );

  return IndirectCostPool;
};

/**
 * Sequelize model for Cost Allocations with basis tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CostAllocation model
 */
export const createCostAllocationModel = (sequelize: Sequelize) => {
  class CostAllocation extends Model {
    public id!: string;
    public allocationId!: string;
    public projectId!: string;
    public costPoolId!: string;
    public allocationDate!: Date;
    public allocationAmount!: number;
    public allocationBasis!: string;
    public basisValue!: number;
    public allocationRate!: number;
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
      projectId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Project identifier',
      },
      costPoolId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Cost pool identifier',
      },
      allocationDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Allocation date',
      },
      allocationAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Allocation amount',
      },
      allocationBasis: {
        type: DataTypes.ENUM('direct_labor', 'machine_hours', 'square_footage', 'headcount'),
        allowNull: false,
        comment: 'Allocation basis',
      },
      basisValue: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        comment: 'Basis value',
      },
      allocationRate: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        comment: 'Allocation rate',
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
        { fields: ['projectId'] },
        { fields: ['costPoolId'] },
        { fields: ['allocationDate'] },
      ],
    },
  );

  return CostAllocation;
};

/**
 * Sequelize model for Cost Variances with analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CostVariance model
 */
export const createCostVarianceModel = (sequelize: Sequelize) => {
  class CostVariance extends Model {
    public id!: string;
    public varianceId!: string;
    public projectId!: string;
    public wbsElement!: string;
    public varianceType!: string;
    public plannedCost!: number;
    public actualCost!: number;
    public varianceAmount!: number;
    public variancePercent!: number;
    public varianceReason!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CostVariance.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      varianceId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Variance identifier',
      },
      projectId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Project identifier',
      },
      wbsElement: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'WBS element code',
      },
      varianceType: {
        type: DataTypes.ENUM('favorable', 'unfavorable'),
        allowNull: false,
        comment: 'Variance type',
      },
      plannedCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Planned cost',
      },
      actualCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Actual cost',
      },
      varianceAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Variance amount',
      },
      variancePercent: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Variance percentage',
      },
      varianceReason: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Variance reason',
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
      tableName: 'cost_variances',
      timestamps: true,
      indexes: [
        { fields: ['varianceId'], unique: true },
        { fields: ['projectId'] },
        { fields: ['wbsElement'] },
        { fields: ['varianceType'] },
      ],
    },
  );

  return CostVariance;
};

/**
 * Sequelize model for Earned Value Management with EVM metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EarnedValue model
 */
export const createEarnedValueModel = (sequelize: Sequelize) => {
  class EarnedValue extends Model {
    public id!: string;
    public evmId!: string;
    public projectId!: string;
    public reportDate!: Date;
    public plannedValue!: number;
    public earnedValue!: number;
    public actualCost!: number;
    public costVariance!: number;
    public scheduleVariance!: number;
    public costPerformanceIndex!: number;
    public schedulePerformanceIndex!: number;
    public estimateAtCompletion!: number;
    public estimateToComplete!: number;
    public varianceAtCompletion!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  EarnedValue.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      evmId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'EVM identifier',
      },
      projectId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Project identifier',
      },
      reportDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Report date',
      },
      plannedValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Planned value (PV)',
      },
      earnedValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Earned value (EV)',
      },
      actualCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Actual cost (AC)',
      },
      costVariance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Cost variance (CV = EV - AC)',
      },
      scheduleVariance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Schedule variance (SV = EV - PV)',
      },
      costPerformanceIndex: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        comment: 'CPI (EV / AC)',
      },
      schedulePerformanceIndex: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        comment: 'SPI (EV / PV)',
      },
      estimateAtCompletion: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'EAC',
      },
      estimateToComplete: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'ETC',
      },
      varianceAtCompletion: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'VAC (BAC - EAC)',
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
      tableName: 'earned_value_metrics',
      timestamps: true,
      indexes: [
        { fields: ['evmId'], unique: true },
        { fields: ['projectId'] },
        { fields: ['reportDate'] },
      ],
    },
  );

  return EarnedValue;
};

// ============================================================================
// PROJECT SETUP & WBS (1-5)
// ============================================================================

/**
 * Creates new project with cost baseline.
 *
 * @param {ProjectCostData} projectData - Project data
 * @param {Model} ProjectCost - ProjectCost model
 * @returns {Promise<any>} Created project
 */
export const createProject = async (
  projectData: ProjectCostData,
  ProjectCost: any,
): Promise<any> => {
  return await ProjectCost.create(projectData);
};

/**
 * Creates WBS element for project.
 *
 * @param {WBSElementData} wbsData - WBS element data
 * @param {Model} WBSElement - WBSElement model
 * @returns {Promise<any>} Created WBS element
 */
export const createWBSElement = async (
  wbsData: WBSElementData,
  WBSElement: any,
): Promise<any> => {
  return await WBSElement.create(wbsData);
};

/**
 * Builds complete WBS hierarchy for project.
 *
 * @param {string} projectId - Project ID
 * @param {Model} WBSElement - WBSElement model
 * @returns {Promise<any[]>} WBS hierarchy
 */
export const buildWBSHierarchy = async (
  projectId: string,
  WBSElement: any,
): Promise<any[]> => {
  const elements = await WBSElement.findAll({
    where: { projectId },
    order: [['wbsCode', 'ASC']],
  });

  const elementMap = new Map();
  const rootElements: any[] = [];

  elements.forEach((elem: any) => {
    elementMap.set(elem.wbsId, { ...elem.toJSON(), children: [] });
  });

  elements.forEach((elem: any) => {
    const node = elementMap.get(elem.wbsId);
    if (elem.parentWbsId) {
      const parent = elementMap.get(elem.parentWbsId);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      rootElements.push(node);
    }
  });

  return rootElements;
};

/**
 * Updates WBS element budget allocation.
 *
 * @param {string} wbsId - WBS element ID
 * @param {number} budgetAmount - Budget amount
 * @param {Model} WBSElement - WBSElement model
 * @returns {Promise<any>} Updated WBS element
 */
export const updateWBSBudget = async (
  wbsId: string,
  budgetAmount: number,
  WBSElement: any,
): Promise<any> => {
  const wbs = await WBSElement.findOne({ where: { wbsId } });
  if (!wbs) throw new Error('WBS element not found');

  wbs.budgetAmount = budgetAmount;
  await wbs.save();

  return wbs;
};

/**
 * Retrieves project baseline information.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ProjectCost - ProjectCost model
 * @param {Model} WBSElement - WBSElement model
 * @returns {Promise<any>} Project baseline
 */
export const getProjectBaseline = async (
  projectId: string,
  ProjectCost: any,
  WBSElement: any,
): Promise<any> => {
  const project = await ProjectCost.findOne({ where: { projectId } });
  if (!project) throw new Error('Project not found');

  const wbsElements = await WBSElement.findAll({ where: { projectId } });

  const totalBudget = wbsElements.reduce(
    (sum: number, wbs: any) => sum + parseFloat(wbs.budgetAmount),
    0,
  );

  return {
    projectId,
    projectName: project.projectName,
    budgetAtCompletion: parseFloat(project.budgetAtCompletion),
    totalWBSBudget: totalBudget,
    startDate: project.startDate,
    plannedEndDate: project.plannedEndDate,
    wbsElementCount: wbsElements.length,
  };
};

// ============================================================================
// LABOR COST TRACKING (6-10)
// ============================================================================

/**
 * Records labor cost from timesheet.
 *
 * @param {LaborCostData} laborData - Labor cost data
 * @param {Model} LaborCost - LaborCost model
 * @param {Model} WBSElement - WBSElement model
 * @returns {Promise<any>} Created labor cost
 */
export const recordLaborCost = async (
  laborData: LaborCostData,
  LaborCost: any,
  WBSElement: any,
): Promise<any> => {
  const labor = await LaborCost.create(laborData);

  const wbs = await WBSElement.findOne({ where: { wbsCode: laborData.wbsElement, projectId: laborData.projectId } });
  if (wbs) {
    wbs.actualCost += laborData.laborCost;
    await wbs.save();
  }

  return labor;
};

/**
 * Calculates total labor cost for project.
 *
 * @param {string} projectId - Project ID
 * @param {Model} LaborCost - LaborCost model
 * @returns {Promise<number>} Total labor cost
 */
export const calculateTotalLaborCost = async (
  projectId: string,
  LaborCost: any,
): Promise<number> => {
  const laborCosts = await LaborCost.findAll({ where: { projectId } });
  return laborCosts.reduce((sum: number, labor: any) => sum + parseFloat(labor.laborCost), 0);
};

/**
 * Generates labor distribution report.
 *
 * @param {string} projectId - Project ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} LaborCost - LaborCost model
 * @returns {Promise<any>} Labor distribution
 */
export const generateLaborDistributionReport = async (
  projectId: string,
  startDate: Date,
  endDate: Date,
  LaborCost: any,
): Promise<any> => {
  const laborCosts = await LaborCost.findAll({
    where: {
      projectId,
      workDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const byWBS = new Map<string, number>();
  const byEmployee = new Map<string, number>();

  laborCosts.forEach((labor: any) => {
    byWBS.set(labor.wbsElement, (byWBS.get(labor.wbsElement) || 0) + parseFloat(labor.laborCost));
    byEmployee.set(labor.employeeId, (byEmployee.get(labor.employeeId) || 0) + parseFloat(labor.laborCost));
  });

  const totalLaborCost = laborCosts.reduce(
    (sum: number, labor: any) => sum + parseFloat(labor.laborCost),
    0,
  );

  return {
    projectId,
    period: { startDate, endDate },
    totalLaborCost,
    byWBS: Array.from(byWBS.entries()).map(([wbs, cost]) => ({ wbs, cost })),
    byEmployee: Array.from(byEmployee.entries()).map(([employeeId, cost]) => ({ employeeId, cost })),
  };
};

/**
 * Calculates labor burden rate.
 *
 * @param {number} directLaborCost - Direct labor cost
 * @param {number} overheadCost - Overhead cost
 * @returns {number} Labor burden rate
 */
export const calculateLaborBurdenRate = (
  directLaborCost: number,
  overheadCost: number,
): number => {
  return directLaborCost > 0 ? (overheadCost / directLaborCost) * 100 : 0;
};

/**
 * Validates labor cost against budget.
 *
 * @param {string} projectId - Project ID
 * @param {string} wbsElement - WBS element code
 * @param {Model} LaborCost - LaborCost model
 * @param {Model} WBSElement - WBSElement model
 * @returns {Promise<{ withinBudget: boolean; variance: number }>}
 */
export const validateLaborCostAgainstBudget = async (
  projectId: string,
  wbsElement: string,
  LaborCost: any,
  WBSElement: any,
): Promise<{ withinBudget: boolean; variance: number }> => {
  const laborCosts = await LaborCost.findAll({ where: { projectId, wbsElement } });
  const totalLabor = laborCosts.reduce((sum: number, labor: any) => sum + parseFloat(labor.laborCost), 0);

  const wbs = await WBSElement.findOne({ where: { projectId, wbsCode: wbsElement } });
  if (!wbs) throw new Error('WBS element not found');

  const variance = parseFloat(wbs.budgetAmount) - totalLabor;

  return {
    withinBudget: variance >= 0,
    variance,
  };
};

// ============================================================================
// MATERIAL & EQUIPMENT COSTS (11-15)
// ============================================================================

/**
 * Records material cost from purchase.
 *
 * @param {MaterialCostData} materialData - Material cost data
 * @param {Model} MaterialCost - MaterialCost model
 * @param {Model} WBSElement - WBSElement model
 * @returns {Promise<any>} Created material cost
 */
export const recordMaterialCost = async (
  materialData: MaterialCostData,
  MaterialCost: any,
  WBSElement: any,
): Promise<any> => {
  const material = await MaterialCost.create(materialData);

  const wbs = await WBSElement.findOne({ where: { wbsCode: materialData.wbsElement, projectId: materialData.projectId } });
  if (wbs) {
    wbs.actualCost += materialData.totalCost;
    await wbs.save();
  }

  return material;
};

/**
 * Records equipment usage cost.
 *
 * @param {EquipmentCostData} equipmentData - Equipment cost data
 * @param {Model} EquipmentCost - EquipmentCost model
 * @param {Model} WBSElement - WBSElement model
 * @returns {Promise<any>} Created equipment cost
 */
export const recordEquipmentCost = async (
  equipmentData: EquipmentCostData,
  EquipmentCost: any,
  WBSElement: any,
): Promise<any> => {
  const equipment = await EquipmentCost.create(equipmentData);

  const wbs = await WBSElement.findOne({ where: { wbsCode: equipmentData.wbsElement, projectId: equipmentData.projectId } });
  if (wbs) {
    wbs.actualCost += equipmentData.totalCost;
    await wbs.save();
  }

  return equipment;
};

/**
 * Calculates total material cost for project.
 *
 * @param {string} projectId - Project ID
 * @param {Model} MaterialCost - MaterialCost model
 * @returns {Promise<number>} Total material cost
 */
export const calculateTotalMaterialCost = async (
  projectId: string,
  MaterialCost: any,
): Promise<number> => {
  const materials = await MaterialCost.findAll({ where: { projectId } });
  return materials.reduce((sum: number, m: any) => sum + parseFloat(m.totalCost), 0);
};

/**
 * Calculates total equipment cost for project.
 *
 * @param {string} projectId - Project ID
 * @param {Model} EquipmentCost - EquipmentCost model
 * @returns {Promise<number>} Total equipment cost
 */
export const calculateTotalEquipmentCost = async (
  projectId: string,
  EquipmentCost: any,
): Promise<number> => {
  const equipment = await EquipmentCost.findAll({ where: { projectId } });
  return equipment.reduce((sum: number, e: any) => sum + parseFloat(e.totalCost), 0);
};

/**
 * Generates material usage report by vendor.
 *
 * @param {string} projectId - Project ID
 * @param {Model} MaterialCost - MaterialCost model
 * @returns {Promise<any>} Material usage report
 */
export const generateMaterialUsageReport = async (
  projectId: string,
  MaterialCost: any,
): Promise<any> => {
  const materials = await MaterialCost.findAll({ where: { projectId } });

  const byVendor = new Map<string, number>();
  const byType = new Map<string, number>();

  materials.forEach((m: any) => {
    byVendor.set(m.vendor, (byVendor.get(m.vendor) || 0) + parseFloat(m.totalCost));
    byType.set(m.materialType, (byType.get(m.materialType) || 0) + parseFloat(m.totalCost));
  });

  const totalMaterialCost = materials.reduce((sum: number, m: any) => sum + parseFloat(m.totalCost), 0);

  return {
    projectId,
    totalMaterialCost,
    materialCount: materials.length,
    byVendor: Array.from(byVendor.entries()).map(([vendor, cost]) => ({ vendor, cost })),
    byType: Array.from(byType.entries()).map(([type, cost]) => ({ type, cost })),
  };
};

// ============================================================================
// SUBCONTRACTOR COSTS (16-20)
// ============================================================================

/**
 * Records subcontractor billing.
 *
 * @param {SubcontractorCostData} subData - Subcontractor data
 * @param {Model} SubcontractorCost - SubcontractorCost model
 * @param {Model} WBSElement - WBSElement model
 * @returns {Promise<any>} Created subcontractor cost
 */
export const recordSubcontractorBilling = async (
  subData: SubcontractorCostData,
  SubcontractorCost: any,
  WBSElement: any,
): Promise<any> => {
  return await SubcontractorCost.create(subData);
};

/**
 * Processes subcontractor progress payment.
 *
 * @param {string} subcontractId - Subcontract ID
 * @param {number} paymentAmount - Payment amount
 * @param {Model} SubcontractorCost - SubcontractorCost model
 * @returns {Promise<any>} Updated subcontractor
 */
export const processSubcontractorPayment = async (
  subcontractId: string,
  paymentAmount: number,
  SubcontractorCost: any,
): Promise<any> => {
  const sub = await SubcontractorCost.findOne({ where: { subcontractId } });
  if (!sub) throw new Error('Subcontractor not found');

  const retainageAmount = paymentAmount * (parseFloat(sub.retainagePercent) / 100);
  const netPayment = paymentAmount - retainageAmount;

  sub.billedToDate += netPayment;
  sub.retainageHeld += retainageAmount;
  await sub.save();

  return sub;
};

/**
 * Releases subcontractor retainage.
 *
 * @param {string} subcontractId - Subcontract ID
 * @param {number} releaseAmount - Release amount
 * @param {Model} SubcontractorCost - SubcontractorCost model
 * @returns {Promise<any>} Updated subcontractor
 */
export const releaseSubcontractorRetainage = async (
  subcontractId: string,
  releaseAmount: number,
  SubcontractorCost: any,
): Promise<any> => {
  const sub = await SubcontractorCost.findOne({ where: { subcontractId } });
  if (!sub) throw new Error('Subcontractor not found');

  sub.retainageHeld -= releaseAmount;
  sub.billedToDate += releaseAmount;

  if (sub.retainageHeld <= 0) {
    sub.contractStatus = 'completed';
  }

  await sub.save();
  return sub;
};

/**
 * Calculates total subcontractor costs.
 *
 * @param {string} projectId - Project ID
 * @param {Model} SubcontractorCost - SubcontractorCost model
 * @returns {Promise<any>} Subcontractor cost summary
 */
export const calculateTotalSubcontractorCosts = async (
  projectId: string,
  SubcontractorCost: any,
): Promise<any> => {
  const subcontractors = await SubcontractorCost.findAll({ where: { projectId } });

  const totalContract = subcontractors.reduce(
    (sum: number, s: any) => sum + parseFloat(s.contractAmount),
    0,
  );
  const totalBilled = subcontractors.reduce(
    (sum: number, s: any) => sum + parseFloat(s.billedToDate),
    0,
  );
  const totalRetainage = subcontractors.reduce(
    (sum: number, s: any) => sum + parseFloat(s.retainageHeld),
    0,
  );

  return {
    projectId,
    subcontractorCount: subcontractors.length,
    totalContract,
    totalBilled,
    totalRetainage,
    remainingToBill: totalContract - totalBilled - totalRetainage,
  };
};

/**
 * Generates subcontractor status report.
 *
 * @param {string} projectId - Project ID
 * @param {Model} SubcontractorCost - SubcontractorCost model
 * @returns {Promise<any[]>} Subcontractor status
 */
export const generateSubcontractorStatusReport = async (
  projectId: string,
  SubcontractorCost: any,
): Promise<any[]> => {
  const subcontractors = await SubcontractorCost.findAll({
    where: { projectId },
    order: [['contractAmount', 'DESC']],
  });

  return subcontractors.map((sub: any) => ({
    subcontractorName: sub.subcontractorName,
    contractAmount: parseFloat(sub.contractAmount),
    billedToDate: parseFloat(sub.billedToDate),
    retainageHeld: parseFloat(sub.retainageHeld),
    percentComplete: (parseFloat(sub.billedToDate) / parseFloat(sub.contractAmount)) * 100,
    status: sub.contractStatus,
  }));
};

// ============================================================================
// INDIRECT COSTS & ALLOCATION (21-25)
// ============================================================================

/**
 * Creates indirect cost pool.
 *
 * @param {IndirectCostPoolData} poolData - Pool data
 * @param {Model} IndirectCostPool - IndirectCostPool model
 * @returns {Promise<any>} Created pool
 */
export const createIndirectCostPool = async (
  poolData: IndirectCostPoolData,
  IndirectCostPool: any,
): Promise<any> => {
  return await IndirectCostPool.create(poolData);
};

/**
 * Calculates indirect cost pool rate.
 *
 * @param {string} poolId - Pool ID
 * @param {Model} IndirectCostPool - IndirectCostPool model
 * @returns {Promise<number>} Pool rate
 */
export const calculatePoolRate = async (
  poolId: string,
  IndirectCostPool: any,
): Promise<number> => {
  const pool = await IndirectCostPool.findOne({ where: { poolId } });
  if (!pool) throw new Error('Cost pool not found');

  const rate = parseFloat(pool.allocationBase) > 0
    ? parseFloat(pool.totalPoolCost) / parseFloat(pool.allocationBase)
    : 0;

  pool.poolRate = rate;
  await pool.save();

  return rate;
};

/**
 * Allocates indirect costs to project.
 *
 * @param {CostAllocationData} allocationData - Allocation data
 * @param {Model} CostAllocation - CostAllocation model
 * @param {Model} ProjectCost - ProjectCost model
 * @returns {Promise<any>} Created allocation
 */
export const allocateIndirectCosts = async (
  allocationData: CostAllocationData,
  CostAllocation: any,
  ProjectCost: any,
): Promise<any> => {
  const allocation = await CostAllocation.create(allocationData);

  const project = await ProjectCost.findOne({ where: { projectId: allocationData.projectId } });
  if (project) {
    project.actualCost += allocationData.allocationAmount;
    await project.save();
  }

  return allocation;
};

/**
 * Calculates overhead allocation for project.
 *
 * @param {string} projectId - Project ID
 * @param {number} directLaborCost - Direct labor cost
 * @param {number} overheadRate - Overhead rate
 * @param {Model} CostAllocation - CostAllocation model
 * @param {Model} IndirectCostPool - IndirectCostPool model
 * @returns {Promise<any>} Overhead allocation
 */
export const calculateOverheadAllocation = async (
  projectId: string,
  directLaborCost: number,
  overheadRate: number,
  CostAllocation: any,
  IndirectCostPool: any,
): Promise<any> => {
  const overheadPool = await IndirectCostPool.findOne({
    where: { poolType: 'overhead' },
    order: [['fiscalYear', 'DESC']],
  });

  if (!overheadPool) throw new Error('Overhead pool not found');

  const overheadAmount = directLaborCost * overheadRate;

  return await allocateIndirectCosts(
    {
      allocationId: `OVHD-${projectId}-${Date.now()}`,
      projectId,
      costPoolId: overheadPool.poolId,
      allocationDate: new Date(),
      allocationAmount: overheadAmount,
      allocationBasis: 'direct_labor',
      basisValue: directLaborCost,
      allocationRate: overheadRate,
    },
    CostAllocation,
    null,
  );
};

/**
 * Generates cost allocation summary.
 *
 * @param {string} projectId - Project ID
 * @param {Model} CostAllocation - CostAllocation model
 * @returns {Promise<any>} Allocation summary
 */
export const generateCostAllocationSummary = async (
  projectId: string,
  CostAllocation: any,
): Promise<any> => {
  const allocations = await CostAllocation.findAll({ where: { projectId } });

  const byPool = new Map<string, number>();

  allocations.forEach((alloc: any) => {
    byPool.set(alloc.costPoolId, (byPool.get(alloc.costPoolId) || 0) + parseFloat(alloc.allocationAmount));
  });

  const totalAllocated = allocations.reduce(
    (sum: number, alloc: any) => sum + parseFloat(alloc.allocationAmount),
    0,
  );

  return {
    projectId,
    totalAllocated,
    allocationCount: allocations.length,
    byPool: Array.from(byPool.entries()).map(([poolId, amount]) => ({ poolId, amount })),
  };
};

// ============================================================================
// VARIANCE ANALYSIS & EVM (26-35)
// ============================================================================

/**
 * Calculates cost variance for project.
 *
 * @param {string} projectId - Project ID
 * @param {string} wbsElement - WBS element code
 * @param {Model} WBSElement - WBSElement model
 * @param {Model} CostVariance - CostVariance model
 * @returns {Promise<any>} Cost variance
 */
export const calculateCostVariance = async (
  projectId: string,
  wbsElement: string,
  WBSElement: any,
  CostVariance: any,
): Promise<any> => {
  const wbs = await WBSElement.findOne({ where: { projectId, wbsCode: wbsElement } });
  if (!wbs) throw new Error('WBS element not found');

  const plannedCost = parseFloat(wbs.budgetAmount);
  const actualCost = parseFloat(wbs.actualCost);
  const varianceAmount = plannedCost - actualCost;
  const variancePercent = plannedCost > 0 ? (varianceAmount / plannedCost) * 100 : 0;

  const variance = await CostVariance.create({
    varianceId: `VAR-${projectId}-${wbsElement}-${Date.now()}`,
    projectId,
    wbsElement,
    varianceType: varianceAmount >= 0 ? 'favorable' : 'unfavorable',
    plannedCost,
    actualCost,
    varianceAmount: Math.abs(varianceAmount),
    variancePercent: Math.abs(variancePercent),
    varianceReason: 'Calculated variance',
  });

  return variance;
};

/**
 * Calculates earned value metrics.
 *
 * @param {string} projectId - Project ID
 * @param {Date} reportDate - Report date
 * @param {Model} ProjectCost - ProjectCost model
 * @param {Model} EarnedValue - EarnedValue model
 * @returns {Promise<any>} EVM metrics
 */
export const calculateEarnedValueMetrics = async (
  projectId: string,
  reportDate: Date,
  ProjectCost: any,
  EarnedValue: any,
): Promise<any> => {
  const project = await ProjectCost.findOne({ where: { projectId } });
  if (!project) throw new Error('Project not found');

  const pv = parseFloat(project.plannedValue);
  const ev = parseFloat(project.earnedValue);
  const ac = parseFloat(project.actualCost);
  const bac = parseFloat(project.budgetAtCompletion);

  const cv = ev - ac; // Cost Variance
  const sv = ev - pv; // Schedule Variance
  const cpi = ac > 0 ? ev / ac : 0; // Cost Performance Index
  const spi = pv > 0 ? ev / pv : 0; // Schedule Performance Index

  const eac = cpi > 0 ? bac / cpi : bac; // Estimate at Completion
  const etc = eac - ac; // Estimate to Complete
  const vac = bac - eac; // Variance at Completion

  return await EarnedValue.create({
    evmId: `EVM-${projectId}-${Date.now()}`,
    projectId,
    reportDate,
    plannedValue: pv,
    earnedValue: ev,
    actualCost: ac,
    costVariance: cv,
    scheduleVariance: sv,
    costPerformanceIndex: cpi,
    schedulePerformanceIndex: spi,
    estimateAtCompletion: eac,
    estimateToComplete: etc,
    varianceAtCompletion: vac,
  });
};

/**
 * Updates project earned value.
 *
 * @param {string} projectId - Project ID
 * @param {number} earnedValue - Earned value
 * @param {Model} ProjectCost - ProjectCost model
 * @returns {Promise<any>} Updated project
 */
export const updateProjectEarnedValue = async (
  projectId: string,
  earnedValue: number,
  ProjectCost: any,
): Promise<any> => {
  const project = await ProjectCost.findOne({ where: { projectId } });
  if (!project) throw new Error('Project not found');

  project.earnedValue = earnedValue;
  await project.save();

  return project;
};

/**
 * Calculates estimate at completion (EAC).
 *
 * @param {number} budgetAtCompletion - Budget at completion
 * @param {number} actualCost - Actual cost
 * @param {number} costPerformanceIndex - CPI
 * @returns {number} Estimate at completion
 */
export const calculateEstimateAtCompletion = (
  budgetAtCompletion: number,
  actualCost: number,
  costPerformanceIndex: number,
): number => {
  return costPerformanceIndex > 0 ? actualCost + (budgetAtCompletion - actualCost) / costPerformanceIndex : budgetAtCompletion;
};

/**
 * Calculates estimate to complete (ETC).
 *
 * @param {number} estimateAtCompletion - EAC
 * @param {number} actualCost - Actual cost
 * @returns {number} Estimate to complete
 */
export const calculateEstimateToComplete = (
  estimateAtCompletion: number,
  actualCost: number,
): number => {
  return Math.max(0, estimateAtCompletion - actualCost);
};

/**
 * Generates variance analysis report.
 *
 * @param {string} projectId - Project ID
 * @param {Model} CostVariance - CostVariance model
 * @returns {Promise<any>} Variance analysis
 */
export const generateVarianceAnalysisReport = async (
  projectId: string,
  CostVariance: any,
): Promise<any> => {
  const variances = await CostVariance.findAll({
    where: { projectId },
    order: [['varianceAmount', 'DESC']],
  });

  const totalFavorable = variances
    .filter((v: any) => v.varianceType === 'favorable')
    .reduce((sum: number, v: any) => sum + parseFloat(v.varianceAmount), 0);

  const totalUnfavorable = variances
    .filter((v: any) => v.varianceType === 'unfavorable')
    .reduce((sum: number, v: any) => sum + parseFloat(v.varianceAmount), 0);

  return {
    projectId,
    varianceCount: variances.length,
    totalFavorable,
    totalUnfavorable,
    netVariance: totalFavorable - totalUnfavorable,
    variances,
  };
};

/**
 * Generates earned value trend analysis.
 *
 * @param {string} projectId - Project ID
 * @param {number} months - Number of months
 * @param {Model} EarnedValue - EarnedValue model
 * @returns {Promise<any[]>} EVM trend
 */
export const generateEarnedValueTrend = async (
  projectId: string,
  months: number,
  EarnedValue: any,
): Promise<any[]> => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const evmRecords = await EarnedValue.findAll({
    where: {
      projectId,
      reportDate: { [Op.gte]: startDate },
    },
    order: [['reportDate', 'ASC']],
  });

  return evmRecords.map((evm: any) => ({
    reportDate: evm.reportDate,
    cpi: parseFloat(evm.costPerformanceIndex),
    spi: parseFloat(evm.schedulePerformanceIndex),
    costVariance: parseFloat(evm.costVariance),
    scheduleVariance: parseFloat(evm.scheduleVariance),
  }));
};

/**
 * Identifies projects at risk based on CPI/SPI.
 *
 * @param {number} cpiThreshold - CPI threshold
 * @param {number} spiThreshold - SPI threshold
 * @param {Model} ProjectCost - ProjectCost model
 * @param {Model} EarnedValue - EarnedValue model
 * @returns {Promise<any[]>} At-risk projects
 */
export const identifyAtRiskProjects = async (
  cpiThreshold: number,
  spiThreshold: number,
  ProjectCost: any,
  EarnedValue: any,
): Promise<any[]> => {
  const activeProjects = await ProjectCost.findAll({
    where: { status: 'active' },
  });

  const atRisk: any[] = [];

  for (const project of activeProjects) {
    const latestEVM = await EarnedValue.findOne({
      where: { projectId: project.projectId },
      order: [['reportDate', 'DESC']],
    });

    if (latestEVM) {
      const cpi = parseFloat(latestEVM.costPerformanceIndex);
      const spi = parseFloat(latestEVM.schedulePerformanceIndex);

      if (cpi < cpiThreshold || spi < spiThreshold) {
        atRisk.push({
          projectId: project.projectId,
          projectName: project.projectName,
          cpi,
          spi,
          costVariance: parseFloat(latestEVM.costVariance),
          scheduleVariance: parseFloat(latestEVM.scheduleVariance),
        });
      }
    }
  }

  return atRisk;
};

/**
 * Forecasts project completion cost.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ProjectCost - ProjectCost model
 * @param {Model} EarnedValue - EarnedValue model
 * @returns {Promise<any>} Cost forecast
 */
export const forecastProjectCompletionCost = async (
  projectId: string,
  ProjectCost: any,
  EarnedValue: any,
): Promise<any> => {
  const project = await ProjectCost.findOne({ where: { projectId } });
  if (!project) throw new Error('Project not found');

  const latestEVM = await EarnedValue.findOne({
    where: { projectId },
    order: [['reportDate', 'DESC']],
  });

  if (!latestEVM) {
    return {
      projectId,
      forecastMethod: 'budget',
      estimateAtCompletion: parseFloat(project.budgetAtCompletion),
      varianceAtCompletion: 0,
    };
  }

  const eac = parseFloat(latestEVM.estimateAtCompletion);
  const vac = parseFloat(latestEVM.varianceAtCompletion);

  return {
    projectId,
    projectName: project.projectName,
    budgetAtCompletion: parseFloat(project.budgetAtCompletion),
    actualCostToDate: parseFloat(project.actualCost),
    estimateAtCompletion: eac,
    estimateToComplete: parseFloat(latestEVM.estimateToComplete),
    varianceAtCompletion: vac,
    costPerformanceIndex: parseFloat(latestEVM.costPerformanceIndex),
    forecastAccuracy: vac >= 0 ? 'on_budget' : 'over_budget',
  };
};

// ============================================================================
// REPORTING & ANALYTICS (36-40)
// ============================================================================

/**
 * Generates comprehensive project cost report.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ProjectCost - ProjectCost model
 * @param {Model} LaborCost - LaborCost model
 * @param {Model} MaterialCost - MaterialCost model
 * @param {Model} SubcontractorCost - SubcontractorCost model
 * @returns {Promise<any>} Project cost report
 */
export const generateProjectCostReport = async (
  projectId: string,
  ProjectCost: any,
  LaborCost: any,
  MaterialCost: any,
  SubcontractorCost: any,
): Promise<any> => {
  const project = await ProjectCost.findOne({ where: { projectId } });
  if (!project) throw new Error('Project not found');

  const totalLabor = await calculateTotalLaborCost(projectId, LaborCost);
  const totalMaterial = await calculateTotalMaterialCost(projectId, MaterialCost);
  const subcontractorSummary = await calculateTotalSubcontractorCosts(projectId, SubcontractorCost);

  return {
    projectId,
    projectName: project.projectName,
    budgetAtCompletion: parseFloat(project.budgetAtCompletion),
    actualCost: parseFloat(project.actualCost),
    laborCost: totalLabor,
    materialCost: totalMaterial,
    subcontractorCost: subcontractorSummary.totalBilled,
    variance: parseFloat(project.budgetAtCompletion) - parseFloat(project.actualCost),
    percentComplete: (parseFloat(project.earnedValue) / parseFloat(project.budgetAtCompletion)) * 100,
    status: project.status,
  };
};

/**
 * Generates cost breakdown by WBS.
 *
 * @param {string} projectId - Project ID
 * @param {Model} WBSElement - WBSElement model
 * @returns {Promise<any[]>} WBS cost breakdown
 */
export const generateCostBreakdownByWBS = async (
  projectId: string,
  WBSElement: any,
): Promise<any[]> => {
  const wbsElements = await WBSElement.findAll({
    where: { projectId },
    order: [['wbsCode', 'ASC']],
  });

  return wbsElements.map((wbs: any) => ({
    wbsCode: wbs.wbsCode,
    wbsName: wbs.wbsName,
    budgetAmount: parseFloat(wbs.budgetAmount),
    actualCost: parseFloat(wbs.actualCost),
    commitments: parseFloat(wbs.commitments),
    variance: parseFloat(wbs.budgetAmount) - parseFloat(wbs.actualCost),
    percentSpent: parseFloat(wbs.budgetAmount) > 0
      ? (parseFloat(wbs.actualCost) / parseFloat(wbs.budgetAmount)) * 100
      : 0,
  }));
};

/**
 * Exports project costing data to CSV.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ProjectCost - ProjectCost model
 * @param {Model} WBSElement - WBSElement model
 * @returns {Promise<string>} CSV content
 */
export const exportProjectCostingDataCSV = async (
  projectId: string,
  ProjectCost: any,
  WBSElement: any,
): Promise<string> => {
  const costBreakdown = await generateCostBreakdownByWBS(projectId, WBSElement);

  const headers = 'WBS Code,WBS Name,Budget,Actual Cost,Commitments,Variance,Percent Spent\n';
  const rows = costBreakdown.map(
    (wbs) =>
      `${wbs.wbsCode},${wbs.wbsName},${wbs.budgetAmount},${wbs.actualCost},${wbs.commitments},${wbs.variance},${wbs.percentSpent.toFixed(2)}`,
  );

  return headers + rows.join('\n');
};

/**
 * Generates project performance dashboard.
 *
 * @param {string} projectId - Project ID
 * @param {Model} ProjectCost - ProjectCost model
 * @param {Model} EarnedValue - EarnedValue model
 * @returns {Promise<any>} Performance dashboard
 */
export const generateProjectPerformanceDashboard = async (
  projectId: string,
  ProjectCost: any,
  EarnedValue: any,
): Promise<any> => {
  const project = await ProjectCost.findOne({ where: { projectId } });
  if (!project) throw new Error('Project not found');

  const latestEVM = await EarnedValue.findOne({
    where: { projectId },
    order: [['reportDate', 'DESC']],
  });

  const percentComplete = (parseFloat(project.earnedValue) / parseFloat(project.budgetAtCompletion)) * 100;
  const daysElapsed = Math.floor(
    (new Date().getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24),
  );
  const totalDays = Math.floor(
    (new Date(project.plannedEndDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24),
  );
  const schedulePercentComplete = (daysElapsed / totalDays) * 100;

  return {
    projectId,
    projectName: project.projectName,
    status: project.status,
    budgetAtCompletion: parseFloat(project.budgetAtCompletion),
    actualCost: parseFloat(project.actualCost),
    earnedValue: parseFloat(project.earnedValue),
    percentComplete,
    schedulePercentComplete,
    cpi: latestEVM ? parseFloat(latestEVM.costPerformanceIndex) : null,
    spi: latestEVM ? parseFloat(latestEVM.schedulePerformanceIndex) : null,
    estimateAtCompletion: latestEVM ? parseFloat(latestEVM.estimateAtCompletion) : null,
    health:
      latestEVM && parseFloat(latestEVM.costPerformanceIndex) >= 0.95 && parseFloat(latestEVM.schedulePerformanceIndex) >= 0.95
        ? 'healthy'
        : 'at_risk',
  };
};

/**
 * Generates multi-project portfolio summary.
 *
 * @param {string[]} projectIds - Project IDs
 * @param {Model} ProjectCost - ProjectCost model
 * @param {Model} EarnedValue - EarnedValue model
 * @returns {Promise<any>} Portfolio summary
 */
export const generatePortfolioSummary = async (
  projectIds: string[],
  ProjectCost: any,
  EarnedValue: any,
): Promise<any> => {
  const projects = await ProjectCost.findAll({
    where: { projectId: { [Op.in]: projectIds } },
  });

  const totalBudget = projects.reduce((sum: number, p: any) => sum + parseFloat(p.budgetAtCompletion), 0);
  const totalActual = projects.reduce((sum: number, p: any) => sum + parseFloat(p.actualCost), 0);
  const totalEarned = projects.reduce((sum: number, p: any) => sum + parseFloat(p.earnedValue), 0);

  const portfolioCPI = totalActual > 0 ? totalEarned / totalActual : 0;
  const portfolioSPI = totalBudget > 0 ? totalEarned / totalBudget : 0;

  return {
    projectCount: projects.length,
    totalBudget,
    totalActual,
    totalEarned,
    portfolioCPI,
    portfolioSPI,
    overallHealth: portfolioCPI >= 0.95 && portfolioSPI >= 0.95 ? 'healthy' : 'at_risk',
    projects: projects.map((p: any) => ({
      projectId: p.projectId,
      projectName: p.projectName,
      status: p.status,
      budgetAtCompletion: parseFloat(p.budgetAtCompletion),
      actualCost: parseFloat(p.actualCost),
    })),
  };
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

@Injectable()
export class CEFMSProjectCostingService {
  constructor(private readonly sequelize: Sequelize) {}

  async createProject(projectData: ProjectCostData) {
    const ProjectCost = createProjectCostModel(this.sequelize);
    return createProject(projectData, ProjectCost);
  }

  async recordLabor(laborData: LaborCostData) {
    const LaborCost = createLaborCostModel(this.sequelize);
    const WBSElement = createWBSElementModel(this.sequelize);
    return recordLaborCost(laborData, LaborCost, WBSElement);
  }

  async calculateEVM(projectId: string, reportDate: Date) {
    const ProjectCost = createProjectCostModel(this.sequelize);
    const EarnedValue = createEarnedValueModel(this.sequelize);
    return calculateEarnedValueMetrics(projectId, reportDate, ProjectCost, EarnedValue);
  }

  async getPerformanceDashboard(projectId: string) {
    const ProjectCost = createProjectCostModel(this.sequelize);
    const EarnedValue = createEarnedValueModel(this.sequelize);
    return generateProjectPerformanceDashboard(projectId, ProjectCost, EarnedValue);
  }
}

export default {
  // Models
  createProjectCostModel,
  createWBSElementModel,
  createLaborCostModel,
  createMaterialCostModel,
  createSubcontractorCostModel,
  createEquipmentCostModel,
  createIndirectCostPoolModel,
  createCostAllocationModel,
  createCostVarianceModel,
  createEarnedValueModel,

  // Project Setup & WBS
  createProject,
  createWBSElement,
  buildWBSHierarchy,
  updateWBSBudget,
  getProjectBaseline,

  // Labor Cost Tracking
  recordLaborCost,
  calculateTotalLaborCost,
  generateLaborDistributionReport,
  calculateLaborBurdenRate,
  validateLaborCostAgainstBudget,

  // Material & Equipment Costs
  recordMaterialCost,
  recordEquipmentCost,
  calculateTotalMaterialCost,
  calculateTotalEquipmentCost,
  generateMaterialUsageReport,

  // Subcontractor Costs
  recordSubcontractorBilling,
  processSubcontractorPayment,
  releaseSubcontractorRetainage,
  calculateTotalSubcontractorCosts,
  generateSubcontractorStatusReport,

  // Indirect Costs & Allocation
  createIndirectCostPool,
  calculatePoolRate,
  allocateIndirectCosts,
  calculateOverheadAllocation,
  generateCostAllocationSummary,

  // Variance Analysis & EVM
  calculateCostVariance,
  calculateEarnedValueMetrics,
  updateProjectEarnedValue,
  calculateEstimateAtCompletion,
  calculateEstimateToComplete,
  generateVarianceAnalysisReport,
  generateEarnedValueTrend,
  identifyAtRiskProjects,
  forecastProjectCompletionCost,

  // Reporting & Analytics
  generateProjectCostReport,
  generateCostBreakdownByWBS,
  exportProjectCostingDataCSV,
  generateProjectPerformanceDashboard,
  generatePortfolioSummary,

  // Service
  CEFMSProjectCostingService,
};
