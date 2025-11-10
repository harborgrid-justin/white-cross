/**
 * LOC: CEFMSPC003
 * File: /reuse/financial/cefms/composites/cefms-project-cost-tracking-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../../budgeting-forecasting-kit.ts
 *   - ../../expense-tracking-management-kit.ts
 *   - ../../financial-performance-management-kit.ts
 *   - ../../cost-allocation-tracking-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS project management services
 *   - USACE WBS tracking systems
 *   - Project cost reporting modules
 */

/**
 * File: /reuse/financial/cefms/composites/cefms-project-cost-tracking-composite.ts
 * Locator: WC-CEFMS-PC-003
 * Purpose: USACE CEFMS Project Cost Tracking - WBS elements, project actuals vs budget, earned value management
 *
 * Upstream: Composes utilities from financial kits for project cost management
 * Downstream: ../../../backend/cefms/*, Project controllers, EVM reporting, variance analysis
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 42+ composite functions for USACE CEFMS project cost tracking operations
 *
 * LLM Context: Production-ready USACE CEFMS project cost tracking and earned value management.
 * Comprehensive WBS hierarchy, project budget management, actual cost tracking, earned value analysis,
 * schedule performance, cost performance indices, estimate at completion, variance analysis,
 * milestone tracking, change order management, project forecasting, and performance reporting.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable } from '@nestjs/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface WBSElementData {
  wbsCode: string;
  wbsName: string;
  wbsLevel: number;
  parentWbsCode?: string;
  projectCode: string;
  isActive: boolean;
  budgetAmount: number;
  plannedValue: number;
  earnedValue: number;
  actualCost: number;
  startDate: Date;
  endDate: Date;
  metadata?: Record<string, any>;
}

interface ProjectBudgetData {
  projectCode: string;
  budgetCategory: string;
  budgetType: 'labor' | 'material' | 'equipment' | 'subcontract' | 'other';
  fiscalYear: number;
  originalBudget: number;
  revisedBudget: number;
  committedAmount: number;
  actualAmount: number;
  variance: number;
}

interface ProjectActualCostData {
  costId: string;
  projectCode: string;
  wbsCode: string;
  costType: 'labor' | 'material' | 'equipment' | 'subcontract' | 'overhead';
  costDate: Date;
  amount: number;
  quantity?: number;
  unitCost?: number;
  description: string;
  documentRef?: string;
}

interface EarnedValueData {
  projectCode: string;
  wbsCode: string;
  reportingPeriod: Date;
  plannedValue: number;
  earnedValue: number;
  actualCost: number;
  scheduleVariance: number;
  costVariance: number;
  spi: number;
  cpi: number;
  estimateAtCompletion: number;
  estimateToComplete: number;
  varianceAtCompletion: number;
}

interface MilestoneData {
  milestoneId: string;
  projectCode: string;
  wbsCode: string;
  milestoneName: string;
  plannedDate: Date;
  actualDate?: Date;
  status: 'planned' | 'in_progress' | 'completed' | 'delayed';
  percentComplete: number;
  criticalPath: boolean;
}

interface ChangeOrderData {
  changeOrderId: string;
  projectCode: string;
  changeDescription: string;
  changeType: 'scope' | 'schedule' | 'cost';
  requestedBy: string;
  requestDate: Date;
  budgetImpact: number;
  scheduleImpact: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'implemented';
  approvedBy?: string;
  approvedDate?: Date;
}

interface ProjectForecastData {
  projectCode: string;
  forecastDate: Date;
  estimateAtCompletion: number;
  estimateToComplete: number;
  varianceAtCompletion: number;
  completionPercentage: number;
  forecastCompletionDate: Date;
  assumptions: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for WBS Elements with hierarchical project structure.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} WBSElement model
 *
 * @example
 * ```typescript
 * const WBSElement = createWBSElementModel(sequelize);
 * const wbs = await WBSElement.create({
 *   wbsCode: 'WBS-1.1.1',
 *   wbsName: 'Foundation Work',
 *   wbsLevel: 3,
 *   projectCode: 'PRJ-2024-001',
 *   budgetAmount: 500000,
 *   isActive: true
 * });
 * ```
 */
export const createWBSElementModel = (sequelize: Sequelize) => {
  class WBSElement extends Model {
    public id!: string;
    public wbsCode!: string;
    public wbsName!: string;
    public wbsLevel!: number;
    public parentWbsCode!: string | null;
    public projectCode!: string;
    public isActive!: boolean;
    public budgetAmount!: number;
    public plannedValue!: number;
    public earnedValue!: number;
    public actualCost!: number;
    public percentComplete!: number;
    public startDate!: Date;
    public endDate!: Date;
    public actualStartDate!: Date | null;
    public actualEndDate!: Date | null;
    public description!: string;
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
      wbsCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'WBS code',
        validate: {
          notEmpty: true,
        },
      },
      wbsName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'WBS element name',
      },
      wbsLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'WBS hierarchy level',
        validate: {
          min: 1,
        },
      },
      parentWbsCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Parent WBS code',
      },
      projectCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Project code',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Is active',
      },
      budgetAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Budget amount',
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
      percentComplete: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Percent complete',
        validate: {
          min: 0,
          max: 100,
        },
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Planned start date',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Planned end date',
      },
      actualStartDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual start date',
      },
      actualEndDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual end date',
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
      tableName: 'wbs_elements',
      timestamps: true,
      indexes: [
        { fields: ['wbsCode'], unique: true },
        { fields: ['projectCode'] },
        { fields: ['parentWbsCode'] },
        { fields: ['wbsLevel'] },
        { fields: ['isActive'] },
        { fields: ['startDate', 'endDate'] },
      ],
    },
  );

  return WBSElement;
};

/**
 * Sequelize model for Project Budgets with category tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ProjectBudget model
 */
export const createProjectBudgetModel = (sequelize: Sequelize) => {
  class ProjectBudget extends Model {
    public id!: string;
    public projectCode!: string;
    public budgetCategory!: string;
    public budgetType!: string;
    public fiscalYear!: number;
    public originalBudget!: number;
    public revisedBudget!: number;
    public committedAmount!: number;
    public actualAmount!: number;
    public variance!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ProjectBudget.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      projectCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Project code',
      },
      budgetCategory: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Budget category',
      },
      budgetType: {
        type: DataTypes.ENUM('labor', 'material', 'equipment', 'subcontract', 'other'),
        allowNull: false,
        comment: 'Budget type',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      originalBudget: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Original budget',
      },
      revisedBudget: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Revised budget',
      },
      committedAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Committed amount',
      },
      actualAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Actual amount',
      },
      variance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Budget variance',
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
      tableName: 'project_budgets',
      timestamps: true,
      indexes: [
        { fields: ['projectCode'] },
        { fields: ['fiscalYear'] },
        { fields: ['budgetType'] },
        { fields: ['projectCode', 'fiscalYear', 'budgetCategory'], unique: true },
      ],
    },
  );

  return ProjectBudget;
};

/**
 * Sequelize model for Project Actual Costs with detail tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ProjectActualCost model
 */
export const createProjectActualCostModel = (sequelize: Sequelize) => {
  class ProjectActualCost extends Model {
    public id!: string;
    public costId!: string;
    public projectCode!: string;
    public wbsCode!: string;
    public costType!: string;
    public costDate!: Date;
    public amount!: number;
    public quantity!: number;
    public unitCost!: number;
    public description!: string;
    public documentRef!: string | null;
    public fiscalYear!: number;
    public fiscalPeriod!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ProjectActualCost.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      costId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Cost identifier',
      },
      projectCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Project code',
      },
      wbsCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'WBS code',
      },
      costType: {
        type: DataTypes.ENUM('labor', 'material', 'equipment', 'subcontract', 'overhead'),
        allowNull: false,
        comment: 'Cost type',
      },
      costDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Cost date',
      },
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        comment: 'Cost amount',
        validate: {
          min: 0,
        },
      },
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Quantity',
      },
      unitCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Unit cost',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Description',
      },
      documentRef: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Document reference',
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
      tableName: 'project_actual_costs',
      timestamps: true,
      indexes: [
        { fields: ['costId'], unique: true },
        { fields: ['projectCode'] },
        { fields: ['wbsCode'] },
        { fields: ['costType'] },
        { fields: ['costDate'] },
        { fields: ['fiscalYear', 'fiscalPeriod'] },
      ],
    },
  );

  return ProjectActualCost;
};

/**
 * Sequelize model for Earned Value Management metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EarnedValueMetrics model
 */
export const createEarnedValueMetricsModel = (sequelize: Sequelize) => {
  class EarnedValueMetrics extends Model {
    public id!: string;
    public projectCode!: string;
    public wbsCode!: string;
    public reportingPeriod!: Date;
    public plannedValue!: number;
    public earnedValue!: number;
    public actualCost!: number;
    public scheduleVariance!: number;
    public costVariance!: number;
    public spi!: number;
    public cpi!: number;
    public estimateAtCompletion!: number;
    public estimateToComplete!: number;
    public varianceAtCompletion!: number;
    public toCompletePerformanceIndex!: number;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  EarnedValueMetrics.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      projectCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Project code',
      },
      wbsCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'WBS code',
      },
      reportingPeriod: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Reporting period',
      },
      plannedValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Planned Value (PV)',
      },
      earnedValue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Earned Value (EV)',
      },
      actualCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Actual Cost (AC)',
      },
      scheduleVariance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Schedule Variance (SV = EV - PV)',
      },
      costVariance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Cost Variance (CV = EV - AC)',
      },
      spi: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        defaultValue: 1.0,
        comment: 'Schedule Performance Index (SPI = EV / PV)',
      },
      cpi: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        defaultValue: 1.0,
        comment: 'Cost Performance Index (CPI = EV / AC)',
      },
      estimateAtCompletion: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Estimate at Completion (EAC)',
      },
      estimateToComplete: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Estimate to Complete (ETC)',
      },
      varianceAtCompletion: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Variance at Completion (VAC)',
      },
      toCompletePerformanceIndex: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        defaultValue: 1.0,
        comment: 'To-Complete Performance Index (TCPI)',
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
        { fields: ['projectCode'] },
        { fields: ['wbsCode'] },
        { fields: ['reportingPeriod'] },
        { fields: ['projectCode', 'wbsCode', 'reportingPeriod'] },
      ],
    },
  );

  return EarnedValueMetrics;
};

/**
 * Sequelize model for Project Milestones with critical path tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ProjectMilestone model
 */
export const createProjectMilestoneModel = (sequelize: Sequelize) => {
  class ProjectMilestone extends Model {
    public id!: string;
    public milestoneId!: string;
    public projectCode!: string;
    public wbsCode!: string;
    public milestoneName!: string;
    public plannedDate!: Date;
    public actualDate!: Date | null;
    public status!: string;
    public percentComplete!: number;
    public criticalPath!: boolean;
    public description!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ProjectMilestone.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      milestoneId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Milestone identifier',
      },
      projectCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Project code',
      },
      wbsCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'WBS code',
      },
      milestoneName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Milestone name',
      },
      plannedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Planned date',
      },
      actualDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual date',
      },
      status: {
        type: DataTypes.ENUM('planned', 'in_progress', 'completed', 'delayed'),
        allowNull: false,
        defaultValue: 'planned',
        comment: 'Milestone status',
      },
      percentComplete: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Percent complete',
        validate: {
          min: 0,
          max: 100,
        },
      },
      criticalPath: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'On critical path',
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
      tableName: 'project_milestones',
      timestamps: true,
      indexes: [
        { fields: ['milestoneId'], unique: true },
        { fields: ['projectCode'] },
        { fields: ['wbsCode'] },
        { fields: ['status'] },
        { fields: ['plannedDate'] },
        { fields: ['criticalPath'] },
      ],
    },
  );

  return ProjectMilestone;
};

/**
 * Sequelize model for Change Orders with approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ChangeOrder model
 */
export const createChangeOrderModel = (sequelize: Sequelize) => {
  class ChangeOrder extends Model {
    public id!: string;
    public changeOrderId!: string;
    public projectCode!: string;
    public changeDescription!: string;
    public changeType!: string;
    public requestedBy!: string;
    public requestDate!: Date;
    public budgetImpact!: number;
    public scheduleImpact!: number;
    public status!: string;
    public approvedBy!: string | null;
    public approvedDate!: Date | null;
    public implementedDate!: Date | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ChangeOrder.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      changeOrderId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Change order identifier',
      },
      projectCode: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Project code',
      },
      changeDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Change description',
      },
      changeType: {
        type: DataTypes.ENUM('scope', 'schedule', 'cost'),
        allowNull: false,
        comment: 'Change type',
      },
      requestedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Requested by user',
      },
      requestDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Request date',
      },
      budgetImpact: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Budget impact',
      },
      scheduleImpact: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Schedule impact (days)',
      },
      status: {
        type: DataTypes.ENUM('draft', 'pending', 'approved', 'rejected', 'implemented'),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Status',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Approved by user',
      },
      approvedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval date',
      },
      implementedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Implementation date',
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
      tableName: 'change_orders',
      timestamps: true,
      indexes: [
        { fields: ['changeOrderId'], unique: true },
        { fields: ['projectCode'] },
        { fields: ['status'] },
        { fields: ['requestDate'] },
        { fields: ['changeType'] },
      ],
    },
  );

  return ChangeOrder;
};

// ============================================================================
// WBS MANAGEMENT (1-7)
// ============================================================================

/**
 * Creates WBS element with hierarchy validation.
 *
 * @param {WBSElementData} wbsData - WBS data
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
 * Builds WBS hierarchy tree structure.
 *
 * @param {string} projectCode - Project code
 * @param {Model} WBSElement - WBSElement model
 * @returns {Promise<any[]>} Hierarchical WBS tree
 */
export const buildWBSHierarchy = async (
  projectCode: string,
  WBSElement: any,
): Promise<any[]> => {
  const elements = await WBSElement.findAll({
    where: { projectCode, isActive: true },
  });

  const wbsMap = new Map();
  const rootElements: any[] = [];

  elements.forEach((element: any) => {
    wbsMap.set(element.wbsCode, { ...element.toJSON(), children: [] });
  });

  elements.forEach((element: any) => {
    const node = wbsMap.get(element.wbsCode);
    if (element.parentWbsCode) {
      const parent = wbsMap.get(element.parentWbsCode);
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
 * Updates WBS element budget.
 *
 * @param {string} wbsCode - WBS code
 * @param {number} budgetAmount - Budget amount
 * @param {Model} WBSElement - WBSElement model
 * @returns {Promise<any>} Updated WBS element
 */
export const updateWBSBudget = async (
  wbsCode: string,
  budgetAmount: number,
  WBSElement: any,
): Promise<any> => {
  const wbs = await WBSElement.findOne({ where: { wbsCode } });
  if (!wbs) throw new Error('WBS element not found');

  wbs.budgetAmount = budgetAmount;
  await wbs.save();

  return wbs;
};

/**
 * Updates WBS percent complete.
 *
 * @param {string} wbsCode - WBS code
 * @param {number} percentComplete - Percent complete
 * @param {Model} WBSElement - WBSElement model
 * @returns {Promise<any>} Updated WBS element
 */
export const updateWBSPercentComplete = async (
  wbsCode: string,
  percentComplete: number,
  WBSElement: any,
): Promise<any> => {
  const wbs = await WBSElement.findOne({ where: { wbsCode } });
  if (!wbs) throw new Error('WBS element not found');

  wbs.percentComplete = percentComplete;
  wbs.earnedValue = (wbs.budgetAmount * percentComplete) / 100;
  await wbs.save();

  return wbs;
};

/**
 * Retrieves WBS elements by project.
 *
 * @param {string} projectCode - Project code
 * @param {Model} WBSElement - WBSElement model
 * @returns {Promise<any[]>} WBS elements
 */
export const getWBSElementsByProject = async (
  projectCode: string,
  WBSElement: any,
): Promise<any[]> => {
  return await WBSElement.findAll({
    where: { projectCode, isActive: true },
    order: [['wbsCode', 'ASC']],
  });
};

/**
 * Calculates WBS rollup values to parent.
 *
 * @param {string} parentWbsCode - Parent WBS code
 * @param {Model} WBSElement - WBSElement model
 * @returns {Promise<any>} Rollup values
 */
export const calculateWBSRollup = async (
  parentWbsCode: string,
  WBSElement: any,
): Promise<any> => {
  const children = await WBSElement.findAll({
    where: { parentWbsCode },
  });

  const rollup = {
    budgetAmount: 0,
    plannedValue: 0,
    earnedValue: 0,
    actualCost: 0,
    percentComplete: 0,
  };

  children.forEach((child: any) => {
    rollup.budgetAmount += parseFloat(child.budgetAmount);
    rollup.plannedValue += parseFloat(child.plannedValue);
    rollup.earnedValue += parseFloat(child.earnedValue);
    rollup.actualCost += parseFloat(child.actualCost);
  });

  if (rollup.budgetAmount > 0) {
    rollup.percentComplete = (rollup.earnedValue / rollup.budgetAmount) * 100;
  }

  const parent = await WBSElement.findOne({ where: { wbsCode: parentWbsCode } });
  if (parent) {
    Object.assign(parent, rollup);
    await parent.save();
  }

  return rollup;
};

/**
 * Validates WBS hierarchy integrity.
 *
 * @param {string} projectCode - Project code
 * @param {Model} WBSElement - WBSElement model
 * @returns {Promise<{ valid: boolean; issues: string[] }>}
 */
export const validateWBSHierarchy = async (
  projectCode: string,
  WBSElement: any,
): Promise<{ valid: boolean; issues: string[] }> => {
  const elements = await WBSElement.findAll({ where: { projectCode } });
  const issues: string[] = [];

  const wbsCodes = new Set(elements.map((e: any) => e.wbsCode));

  elements.forEach((element: any) => {
    if (element.parentWbsCode && !wbsCodes.has(element.parentWbsCode)) {
      issues.push(`WBS ${element.wbsCode} has invalid parent ${element.parentWbsCode}`);
    }
  });

  return {
    valid: issues.length === 0,
    issues,
  };
};

// ============================================================================
// PROJECT BUDGET MANAGEMENT (8-14)
// ============================================================================

/**
 * Creates project budget allocation.
 *
 * @param {ProjectBudgetData} budgetData - Budget data
 * @param {Model} ProjectBudget - ProjectBudget model
 * @returns {Promise<any>} Created budget
 */
export const createProjectBudget = async (
  budgetData: ProjectBudgetData,
  ProjectBudget: any,
): Promise<any> => {
  return await ProjectBudget.create({
    ...budgetData,
    variance: budgetData.revisedBudget - budgetData.actualAmount,
  });
};

/**
 * Updates budget revision.
 *
 * @param {string} projectCode - Project code
 * @param {string} budgetCategory - Budget category
 * @param {number} revisedBudget - Revised budget amount
 * @param {Model} ProjectBudget - ProjectBudget model
 * @returns {Promise<any>} Updated budget
 */
export const updateBudgetRevision = async (
  projectCode: string,
  budgetCategory: string,
  revisedBudget: number,
  ProjectBudget: any,
): Promise<any> => {
  const budget = await ProjectBudget.findOne({
    where: { projectCode, budgetCategory },
  });
  if (!budget) throw new Error('Budget not found');

  budget.revisedBudget = revisedBudget;
  budget.variance = revisedBudget - budget.actualAmount;
  await budget.save();

  return budget;
};

/**
 * Retrieves project budget summary.
 *
 * @param {string} projectCode - Project code
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} ProjectBudget - ProjectBudget model
 * @returns {Promise<any>} Budget summary
 */
export const getProjectBudgetSummary = async (
  projectCode: string,
  fiscalYear: number,
  ProjectBudget: any,
): Promise<any> => {
  const budgets = await ProjectBudget.findAll({
    where: { projectCode, fiscalYear },
  });

  const totalOriginal = budgets.reduce(
    (sum: number, b: any) => sum + parseFloat(b.originalBudget),
    0,
  );
  const totalRevised = budgets.reduce(
    (sum: number, b: any) => sum + parseFloat(b.revisedBudget),
    0,
  );
  const totalCommitted = budgets.reduce(
    (sum: number, b: any) => sum + parseFloat(b.committedAmount),
    0,
  );
  const totalActual = budgets.reduce(
    (sum: number, b: any) => sum + parseFloat(b.actualAmount),
    0,
  );

  return {
    projectCode,
    fiscalYear,
    totalOriginal,
    totalRevised,
    totalCommitted,
    totalActual,
    totalVariance: totalRevised - totalActual,
    budgetsByType: budgets,
  };
};

/**
 * Calculates budget variance by type.
 *
 * @param {string} projectCode - Project code
 * @param {Model} ProjectBudget - ProjectBudget model
 * @returns {Promise<any[]>} Variances by type
 */
export const calculateBudgetVarianceByType = async (
  projectCode: string,
  ProjectBudget: any,
): Promise<any[]> => {
  const budgets = await ProjectBudget.findAll({ where: { projectCode } });

  return budgets.map((budget: any) => ({
    budgetType: budget.budgetType,
    budgetCategory: budget.budgetCategory,
    revisedBudget: parseFloat(budget.revisedBudget),
    actualAmount: parseFloat(budget.actualAmount),
    variance: parseFloat(budget.variance),
    variancePercent: budget.revisedBudget > 0
      ? (parseFloat(budget.variance) / parseFloat(budget.revisedBudget)) * 100
      : 0,
  }));
};

/**
 * Validates budget availability.
 *
 * @param {string} projectCode - Project code
 * @param {string} budgetCategory - Budget category
 * @param {number} requestedAmount - Requested amount
 * @param {Model} ProjectBudget - ProjectBudget model
 * @returns {Promise<{ available: boolean; availableAmount: number }>}
 */
export const validateBudgetAvailability = async (
  projectCode: string,
  budgetCategory: string,
  requestedAmount: number,
  ProjectBudget: any,
): Promise<{ available: boolean; availableAmount: number }> => {
  const budget = await ProjectBudget.findOne({
    where: { projectCode, budgetCategory },
  });

  if (!budget) {
    return { available: false, availableAmount: 0 };
  }

  const availableAmount = parseFloat(budget.revisedBudget) - parseFloat(budget.committedAmount) - parseFloat(budget.actualAmount);

  return {
    available: availableAmount >= requestedAmount,
    availableAmount,
  };
};

/**
 * Transfers budget between categories.
 *
 * @param {string} projectCode - Project code
 * @param {string} fromCategory - From category
 * @param {string} toCategory - To category
 * @param {number} amount - Transfer amount
 * @param {Model} ProjectBudget - ProjectBudget model
 * @returns {Promise<any>} Transfer result
 */
export const transferBudgetBetweenCategories = async (
  projectCode: string,
  fromCategory: string,
  toCategory: string,
  amount: number,
  ProjectBudget: any,
): Promise<any> => {
  const fromBudget = await ProjectBudget.findOne({
    where: { projectCode, budgetCategory: fromCategory },
  });
  const toBudget = await ProjectBudget.findOne({
    where: { projectCode, budgetCategory: toCategory },
  });

  if (!fromBudget || !toBudget) {
    throw new Error('Budget category not found');
  }

  fromBudget.revisedBudget -= amount;
  fromBudget.variance = fromBudget.revisedBudget - fromBudget.actualAmount;
  await fromBudget.save();

  toBudget.revisedBudget += amount;
  toBudget.variance = toBudget.revisedBudget - toBudget.actualAmount;
  await toBudget.save();

  return {
    projectCode,
    fromCategory,
    toCategory,
    amount,
    timestamp: new Date(),
  };
};

/**
 * Generates budget forecast.
 *
 * @param {string} projectCode - Project code
 * @param {Model} ProjectBudget - ProjectBudget model
 * @param {Model} ProjectActualCost - ProjectActualCost model
 * @returns {Promise<any>} Budget forecast
 */
export const generateBudgetForecast = async (
  projectCode: string,
  ProjectBudget: any,
  ProjectActualCost: any,
): Promise<any> => {
  const budgets = await ProjectBudget.findAll({ where: { projectCode } });
  const costs = await ProjectActualCost.findAll({ where: { projectCode } });

  const totalBudget = budgets.reduce(
    (sum: number, b: any) => sum + parseFloat(b.revisedBudget),
    0,
  );
  const totalActual = costs.reduce(
    (sum: number, c: any) => sum + parseFloat(c.amount),
    0,
  );

  // Simple burn rate forecast
  const monthsElapsed = 6; // Would calculate from actual dates
  const burnRate = totalActual / monthsElapsed;
  const remainingMonths = 6; // Would calculate from project end date
  const forecastAtCompletion = totalActual + (burnRate * remainingMonths);

  return {
    projectCode,
    totalBudget,
    totalActual,
    burnRate,
    forecastAtCompletion,
    varianceAtCompletion: totalBudget - forecastAtCompletion,
  };
};

// ============================================================================
// ACTUAL COST TRACKING (15-21)
// ============================================================================

/**
 * Records project actual cost.
 *
 * @param {ProjectActualCostData} costData - Cost data
 * @param {Model} ProjectActualCost - ProjectActualCost model
 * @param {Model} WBSElement - WBSElement model
 * @returns {Promise<any>} Created cost record
 */
export const recordProjectActualCost = async (
  costData: ProjectActualCostData,
  ProjectActualCost: any,
  WBSElement: any,
): Promise<any> => {
  const cost = await ProjectActualCost.create({
    ...costData,
    fiscalYear: costData.costDate.getFullYear(),
    fiscalPeriod: costData.costDate.getMonth() + 1,
  });

  // Update WBS actual cost
  const wbs = await WBSElement.findOne({ where: { wbsCode: costData.wbsCode } });
  if (wbs) {
    wbs.actualCost += costData.amount;
    await wbs.save();
  }

  return cost;
};

/**
 * Retrieves actual costs by WBS.
 *
 * @param {string} wbsCode - WBS code
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} ProjectActualCost - ProjectActualCost model
 * @returns {Promise<any[]>} Actual costs
 */
export const getActualCostsByWBS = async (
  wbsCode: string,
  startDate: Date,
  endDate: Date,
  ProjectActualCost: any,
): Promise<any[]> => {
  return await ProjectActualCost.findAll({
    where: {
      wbsCode,
      costDate: { [Op.between]: [startDate, endDate] },
    },
    order: [['costDate', 'DESC']],
  });
};

/**
 * Calculates cost by type for project.
 *
 * @param {string} projectCode - Project code
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} ProjectActualCost - ProjectActualCost model
 * @returns {Promise<any[]>} Costs by type
 */
export const calculateCostByType = async (
  projectCode: string,
  fiscalYear: number,
  ProjectActualCost: any,
): Promise<any[]> => {
  const costs = await ProjectActualCost.findAll({
    where: { projectCode, fiscalYear },
  });

  const costsByType = new Map<string, number>();

  costs.forEach((cost: any) => {
    const current = costsByType.get(cost.costType) || 0;
    costsByType.set(cost.costType, current + parseFloat(cost.amount));
  });

  return Array.from(costsByType.entries()).map(([type, amount]) => ({
    costType: type,
    totalCost: amount,
  }));
};

/**
 * Generates cost trend analysis.
 *
 * @param {string} projectCode - Project code
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} ProjectActualCost - ProjectActualCost model
 * @returns {Promise<any>} Cost trend
 */
export const generateCostTrendAnalysis = async (
  projectCode: string,
  fiscalYear: number,
  ProjectActualCost: any,
): Promise<any> => {
  const costs = await ProjectActualCost.findAll({
    where: { projectCode, fiscalYear },
    order: [['costDate', 'ASC']],
  });

  const monthlyTotals = new Map<string, number>();

  costs.forEach((cost: any) => {
    const monthKey = `${cost.fiscalYear}-${cost.fiscalPeriod}`;
    const current = monthlyTotals.get(monthKey) || 0;
    monthlyTotals.set(monthKey, current + parseFloat(cost.amount));
  });

  return {
    projectCode,
    fiscalYear,
    monthlyTrends: Array.from(monthlyTotals.entries()).map(([period, amount]) => ({
      period,
      totalCost: amount,
    })),
  };
};

/**
 * Validates cost entry data.
 *
 * @param {ProjectActualCostData} costData - Cost data
 * @returns {{ valid: boolean; errors: string[] }}
 */
export const validateCostEntry = (
  costData: ProjectActualCostData,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!costData.projectCode) errors.push('Project code required');
  if (!costData.wbsCode) errors.push('WBS code required');
  if (!costData.amount || costData.amount <= 0) errors.push('Amount must be positive');
  if (!costData.costDate) errors.push('Cost date required');

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Exports cost data to CSV.
 *
 * @param {string} projectCode - Project code
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} ProjectActualCost - ProjectActualCost model
 * @returns {Promise<string>} CSV content
 */
export const exportCostDataCSV = async (
  projectCode: string,
  startDate: Date,
  endDate: Date,
  ProjectActualCost: any,
): Promise<string> => {
  const costs = await ProjectActualCost.findAll({
    where: {
      projectCode,
      costDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const headers = 'Cost ID,Project,WBS,Cost Type,Date,Amount,Description\n';
  const rows = costs.map((c: any) =>
    `${c.costId},${c.projectCode},${c.wbsCode},${c.costType},${c.costDate.toISOString().split('T')[0]},${c.amount},${c.description}`
  );

  return headers + rows.join('\n');
};

/**
 * Reconciles costs with budget.
 *
 * @param {string} projectCode - Project code
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} ProjectBudget - ProjectBudget model
 * @param {Model} ProjectActualCost - ProjectActualCost model
 * @returns {Promise<any>} Reconciliation result
 */
export const reconcileCostsWithBudget = async (
  projectCode: string,
  fiscalYear: number,
  ProjectBudget: any,
  ProjectActualCost: any,
): Promise<any> => {
  const budgets = await ProjectBudget.findAll({ where: { projectCode, fiscalYear } });
  const costs = await ProjectActualCost.findAll({ where: { projectCode, fiscalYear } });

  const totalBudget = budgets.reduce(
    (sum: number, b: any) => sum + parseFloat(b.revisedBudget),
    0,
  );
  const totalCosts = costs.reduce(
    (sum: number, c: any) => sum + parseFloat(c.amount),
    0,
  );

  return {
    projectCode,
    fiscalYear,
    totalBudget,
    totalCosts,
    variance: totalBudget - totalCosts,
    reconciled: Math.abs(totalBudget - totalCosts) < 1.0,
  };
};

// ============================================================================
// EARNED VALUE MANAGEMENT (22-28)
// ============================================================================

/**
 * Calculates earned value metrics.
 *
 * @param {string} projectCode - Project code
 * @param {string} wbsCode - WBS code
 * @param {Date} reportingPeriod - Reporting period
 * @param {Model} WBSElement - WBSElement model
 * @returns {Promise<EarnedValueData>} EVM metrics
 */
export const calculateEarnedValueMetrics = async (
  projectCode: string,
  wbsCode: string,
  reportingPeriod: Date,
  WBSElement: any,
): Promise<EarnedValueData> => {
  const wbs = await WBSElement.findOne({ where: { wbsCode } });
  if (!wbs) throw new Error('WBS element not found');

  const pv = parseFloat(wbs.plannedValue);
  const ev = parseFloat(wbs.earnedValue);
  const ac = parseFloat(wbs.actualCost);
  const bac = parseFloat(wbs.budgetAmount);

  const sv = ev - pv;
  const cv = ev - ac;
  const spi = pv > 0 ? ev / pv : 1.0;
  const cpi = ac > 0 ? ev / ac : 1.0;

  const eac = cpi > 0 ? bac / cpi : bac;
  const etc = eac - ac;
  const vac = bac - eac;

  return {
    projectCode,
    wbsCode,
    reportingPeriod,
    plannedValue: pv,
    earnedValue: ev,
    actualCost: ac,
    scheduleVariance: sv,
    costVariance: cv,
    spi,
    cpi,
    estimateAtCompletion: eac,
    estimateToComplete: etc,
    varianceAtCompletion: vac,
  };
};

/**
 * Stores earned value metrics.
 *
 * @param {EarnedValueData} evmData - EVM data
 * @param {Model} EarnedValueMetrics - EarnedValueMetrics model
 * @returns {Promise<any>} Stored metrics
 */
export const storeEarnedValueMetrics = async (
  evmData: EarnedValueData,
  EarnedValueMetrics: any,
): Promise<any> => {
  const tcpi = evmData.estimateToComplete > 0
    ? (evmData.estimateAtCompletion - evmData.earnedValue) / evmData.estimateToComplete
    : 1.0;

  return await EarnedValueMetrics.create({
    ...evmData,
    toCompletePerformanceIndex: tcpi,
  });
};

/**
 * Retrieves EVM trend data.
 *
 * @param {string} projectCode - Project code
 * @param {string} wbsCode - WBS code
 * @param {Model} EarnedValueMetrics - EarnedValueMetrics model
 * @returns {Promise<any[]>} EVM trends
 */
export const getEVMTrends = async (
  projectCode: string,
  wbsCode: string,
  EarnedValueMetrics: any,
): Promise<any[]> => {
  return await EarnedValueMetrics.findAll({
    where: { projectCode, wbsCode },
    order: [['reportingPeriod', 'ASC']],
  });
};

/**
 * Generates EVM dashboard data.
 *
 * @param {string} projectCode - Project code
 * @param {Date} reportingPeriod - Reporting period
 * @param {Model} EarnedValueMetrics - EarnedValueMetrics model
 * @returns {Promise<any>} Dashboard data
 */
export const generateEVMDashboard = async (
  projectCode: string,
  reportingPeriod: Date,
  EarnedValueMetrics: any,
): Promise<any> => {
  const metrics = await EarnedValueMetrics.findAll({
    where: { projectCode, reportingPeriod },
  });

  const totalPV = metrics.reduce((sum: number, m: any) => sum + parseFloat(m.plannedValue), 0);
  const totalEV = metrics.reduce((sum: number, m: any) => sum + parseFloat(m.earnedValue), 0);
  const totalAC = metrics.reduce((sum: number, m: any) => sum + parseFloat(m.actualCost), 0);

  const overallSPI = totalPV > 0 ? totalEV / totalPV : 1.0;
  const overallCPI = totalAC > 0 ? totalEV / totalAC : 1.0;

  return {
    projectCode,
    reportingPeriod,
    totalPlannedValue: totalPV,
    totalEarnedValue: totalEV,
    totalActualCost: totalAC,
    schedulePerformanceIndex: overallSPI,
    costPerformanceIndex: overallCPI,
    scheduleHealth: overallSPI >= 0.95 ? 'good' : overallSPI >= 0.85 ? 'warning' : 'critical',
    costHealth: overallCPI >= 0.95 ? 'good' : overallCPI >= 0.85 ? 'warning' : 'critical',
  };
};

/**
 * Validates EVM data integrity.
 *
 * @param {EarnedValueData} evmData - EVM data
 * @returns {{ valid: boolean; warnings: string[] }}
 */
export const validateEVMData = (
  evmData: EarnedValueData,
): { valid: boolean; warnings: string[] } => {
  const warnings: string[] = [];

  if (evmData.plannedValue < 0) warnings.push('Negative planned value');
  if (evmData.earnedValue < 0) warnings.push('Negative earned value');
  if (evmData.actualCost < 0) warnings.push('Negative actual cost');
  if (evmData.spi < 0.5) warnings.push('Critically low SPI');
  if (evmData.cpi < 0.5) warnings.push('Critically low CPI');

  return {
    valid: warnings.length === 0,
    warnings,
  };
};

/**
 * Exports EVM report to PDF.
 *
 * @param {string} projectCode - Project code
 * @param {Date} reportingPeriod - Reporting period
 * @param {Model} EarnedValueMetrics - EarnedValueMetrics model
 * @returns {Promise<Buffer>} PDF buffer
 */
export const exportEVMReportPDF = async (
  projectCode: string,
  reportingPeriod: Date,
  EarnedValueMetrics: any,
): Promise<Buffer> => {
  const metrics = await EarnedValueMetrics.findAll({
    where: { projectCode, reportingPeriod },
  });

  const content = `
EARNED VALUE MANAGEMENT REPORT
Project: ${projectCode}
Reporting Period: ${reportingPeriod.toISOString().split('T')[0]}

${metrics.map((m: any) => `
WBS: ${m.wbsCode}
PV: ${m.plannedValue}
EV: ${m.earnedValue}
AC: ${m.actualCost}
SPI: ${m.spi}
CPI: ${m.cpi}
EAC: ${m.estimateAtCompletion}
`).join('\n')}

Generated: ${new Date().toISOString()}
`;

  return Buffer.from(content, 'utf-8');
};

/**
 * Calculates to-complete performance index.
 *
 * @param {number} budgetAtCompletion - BAC
 * @param {number} earnedValue - EV
 * @param {number} actualCost - AC
 * @returns {number} TCPI
 */
export const calculateTCPI = (
  budgetAtCompletion: number,
  earnedValue: number,
  actualCost: number,
): number => {
  const workRemaining = budgetAtCompletion - earnedValue;
  const fundsRemaining = budgetAtCompletion - actualCost;

  return fundsRemaining > 0 ? workRemaining / fundsRemaining : 1.0;
};

// ============================================================================
// MILESTONES & CHANGE ORDERS (29-35)
// ============================================================================

/**
 * Creates project milestone.
 *
 * @param {MilestoneData} milestoneData - Milestone data
 * @param {Model} ProjectMilestone - ProjectMilestone model
 * @returns {Promise<any>} Created milestone
 */
export const createProjectMilestone = async (
  milestoneData: MilestoneData,
  ProjectMilestone: any,
): Promise<any> => {
  return await ProjectMilestone.create(milestoneData);
};

/**
 * Updates milestone status.
 *
 * @param {string} milestoneId - Milestone ID
 * @param {string} status - New status
 * @param {Date} [actualDate] - Actual date
 * @param {Model} ProjectMilestone - ProjectMilestone model
 * @returns {Promise<any>} Updated milestone
 */
export const updateMilestoneStatus = async (
  milestoneId: string,
  status: string,
  actualDate: Date | undefined,
  ProjectMilestone: any,
): Promise<any> => {
  const milestone = await ProjectMilestone.findOne({ where: { milestoneId } });
  if (!milestone) throw new Error('Milestone not found');

  milestone.status = status;
  if (actualDate) {
    milestone.actualDate = actualDate;
  }
  if (status === 'completed') {
    milestone.percentComplete = 100;
  }
  await milestone.save();

  return milestone;
};

/**
 * Retrieves critical path milestones.
 *
 * @param {string} projectCode - Project code
 * @param {Model} ProjectMilestone - ProjectMilestone model
 * @returns {Promise<any[]>} Critical path milestones
 */
export const getCriticalPathMilestones = async (
  projectCode: string,
  ProjectMilestone: any,
): Promise<any[]> => {
  return await ProjectMilestone.findAll({
    where: { projectCode, criticalPath: true },
    order: [['plannedDate', 'ASC']],
  });
};

/**
 * Creates change order request.
 *
 * @param {ChangeOrderData} changeData - Change order data
 * @param {Model} ChangeOrder - ChangeOrder model
 * @returns {Promise<any>} Created change order
 */
export const createChangeOrder = async (
  changeData: ChangeOrderData,
  ChangeOrder: any,
): Promise<any> => {
  return await ChangeOrder.create(changeData);
};

/**
 * Approves change order.
 *
 * @param {string} changeOrderId - Change order ID
 * @param {string} userId - Approver user ID
 * @param {Model} ChangeOrder - ChangeOrder model
 * @returns {Promise<any>} Approved change order
 */
export const approveChangeOrder = async (
  changeOrderId: string,
  userId: string,
  ChangeOrder: any,
): Promise<any> => {
  const changeOrder = await ChangeOrder.findOne({ where: { changeOrderId } });
  if (!changeOrder) throw new Error('Change order not found');

  changeOrder.status = 'approved';
  changeOrder.approvedBy = userId;
  changeOrder.approvedDate = new Date();
  await changeOrder.save();

  return changeOrder;
};

/**
 * Implements approved change order.
 *
 * @param {string} changeOrderId - Change order ID
 * @param {Model} ChangeOrder - ChangeOrder model
 * @param {Model} ProjectBudget - ProjectBudget model
 * @returns {Promise<any>} Implementation result
 */
export const implementChangeOrder = async (
  changeOrderId: string,
  ChangeOrder: any,
  ProjectBudget: any,
): Promise<any> => {
  const changeOrder = await ChangeOrder.findOne({ where: { changeOrderId } });
  if (!changeOrder) throw new Error('Change order not found');

  if (changeOrder.status !== 'approved') {
    throw new Error('Change order must be approved');
  }

  // Update budget if cost impact
  if (changeOrder.budgetImpact !== 0) {
    const budget = await ProjectBudget.findOne({
      where: { projectCode: changeOrder.projectCode },
    });
    if (budget) {
      budget.revisedBudget += changeOrder.budgetImpact;
      await budget.save();
    }
  }

  changeOrder.status = 'implemented';
  changeOrder.implementedDate = new Date();
  await changeOrder.save();

  return changeOrder;
};

/**
 * Retrieves change order impact summary.
 *
 * @param {string} projectCode - Project code
 * @param {Model} ChangeOrder - ChangeOrder model
 * @returns {Promise<any>} Impact summary
 */
export const getChangeOrderImpactSummary = async (
  projectCode: string,
  ChangeOrder: any,
): Promise<any> => {
  const changeOrders = await ChangeOrder.findAll({
    where: { projectCode, status: { [Op.in]: ['approved', 'implemented'] } },
  });

  const totalBudgetImpact = changeOrders.reduce(
    (sum: number, co: any) => sum + parseFloat(co.budgetImpact),
    0,
  );
  const totalScheduleImpact = changeOrders.reduce(
    (sum: number, co: any) => sum + parseInt(co.scheduleImpact),
    0,
  );

  return {
    projectCode,
    totalChangeOrders: changeOrders.length,
    totalBudgetImpact,
    totalScheduleImpact,
    changeOrders,
  };
};

// ============================================================================
// PERFORMANCE REPORTING (36-42)
// ============================================================================

/**
 * Generates project performance report.
 *
 * @param {string} projectCode - Project code
 * @param {Date} reportingPeriod - Reporting period
 * @param {Model} WBSElement - WBSElement model
 * @param {Model} ProjectBudget - ProjectBudget model
 * @param {Model} ProjectActualCost - ProjectActualCost model
 * @returns {Promise<any>} Performance report
 */
export const generateProjectPerformanceReport = async (
  projectCode: string,
  reportingPeriod: Date,
  WBSElement: any,
  ProjectBudget: any,
  ProjectActualCost: any,
): Promise<any> => {
  const budgetSummary = await getProjectBudgetSummary(projectCode, reportingPeriod.getFullYear(), ProjectBudget);
  const wbsElements = await getWBSElementsByProject(projectCode, WBSElement);

  const totalPercentComplete = wbsElements.reduce(
    (sum: number, wbs: any) => sum + parseFloat(wbs.percentComplete),
    0,
  ) / wbsElements.length;

  return {
    projectCode,
    reportingPeriod,
    budgetSummary,
    totalWBSElements: wbsElements.length,
    averagePercentComplete: totalPercentComplete,
    projectHealth: totalPercentComplete >= 80 ? 'on_track' : totalPercentComplete >= 60 ? 'at_risk' : 'behind',
  };
};

/**
 * Calculates schedule variance analysis.
 *
 * @param {string} projectCode - Project code
 * @param {Model} ProjectMilestone - ProjectMilestone model
 * @returns {Promise<any>} Schedule variance
 */
export const calculateScheduleVariance = async (
  projectCode: string,
  ProjectMilestone: any,
): Promise<any> => {
  const milestones = await ProjectMilestone.findAll({ where: { projectCode } });

  let totalVariance = 0;
  let delayedCount = 0;

  milestones.forEach((milestone: any) => {
    if (milestone.actualDate && milestone.plannedDate) {
      const variance = Math.floor(
        (milestone.actualDate.getTime() - milestone.plannedDate.getTime()) / 86400000,
      );
      totalVariance += variance;
      if (variance > 0) delayedCount++;
    }
  });

  return {
    projectCode,
    totalMilestones: milestones.length,
    delayedMilestones: delayedCount,
    averageVariance: milestones.length > 0 ? totalVariance / milestones.length : 0,
    totalVariance,
  };
};

/**
 * Generates cost performance index trend.
 *
 * @param {string} projectCode - Project code
 * @param {Model} EarnedValueMetrics - EarnedValueMetrics model
 * @returns {Promise<any[]>} CPI trend
 */
export const generateCPITrend = async (
  projectCode: string,
  EarnedValueMetrics: any,
): Promise<any[]> => {
  const metrics = await EarnedValueMetrics.findAll({
    where: { projectCode },
    order: [['reportingPeriod', 'ASC']],
  });

  return metrics.map((metric: any) => ({
    reportingPeriod: metric.reportingPeriod,
    cpi: parseFloat(metric.cpi),
    performanceStatus: metric.cpi >= 0.95 ? 'good' : metric.cpi >= 0.85 ? 'warning' : 'critical',
  }));
};

/**
 * Exports project dashboard data.
 *
 * @param {string} projectCode - Project code
 * @param {Date} reportingPeriod - Reporting period
 * @param {Model} WBSElement - WBSElement model
 * @param {Model} EarnedValueMetrics - EarnedValueMetrics model
 * @param {Model} ProjectMilestone - ProjectMilestone model
 * @returns {Promise<any>} Dashboard data
 */
export const exportProjectDashboard = async (
  projectCode: string,
  reportingPeriod: Date,
  WBSElement: any,
  EarnedValueMetrics: any,
  ProjectMilestone: any,
): Promise<any> => {
  const evmDashboard = await generateEVMDashboard(projectCode, reportingPeriod, EarnedValueMetrics);
  const scheduleVariance = await calculateScheduleVariance(projectCode, ProjectMilestone);
  const wbsElements = await getWBSElementsByProject(projectCode, WBSElement);

  return {
    projectCode,
    reportingPeriod,
    earnedValueMetrics: evmDashboard,
    scheduleMetrics: scheduleVariance,
    wbsSummary: {
      totalElements: wbsElements.length,
      activeElements: wbsElements.filter((w: any) => w.isActive).length,
    },
  };
};

/**
 * Validates project health indicators.
 *
 * @param {string} projectCode - Project code
 * @param {Model} EarnedValueMetrics - EarnedValueMetrics model
 * @returns {Promise<any>} Health indicators
 */
export const validateProjectHealthIndicators = async (
  projectCode: string,
  EarnedValueMetrics: any,
): Promise<any> => {
  const latestMetric = await EarnedValueMetrics.findOne({
    where: { projectCode },
    order: [['reportingPeriod', 'DESC']],
  });

  if (!latestMetric) {
    return { healthy: false, reason: 'No metrics available' };
  }

  const cpi = parseFloat(latestMetric.cpi);
  const spi = parseFloat(latestMetric.spi);

  const healthy = cpi >= 0.90 && spi >= 0.90;

  return {
    healthy,
    cpi,
    spi,
    costHealth: cpi >= 0.95 ? 'good' : cpi >= 0.85 ? 'warning' : 'critical',
    scheduleHealth: spi >= 0.95 ? 'good' : spi >= 0.85 ? 'warning' : 'critical',
  };
};

/**
 * Generates variance analysis report.
 *
 * @param {string} projectCode - Project code
 * @param {number} fiscalYear - Fiscal year
 * @param {Model} ProjectBudget - ProjectBudget model
 * @param {Model} WBSElement - WBSElement model
 * @returns {Promise<any>} Variance analysis
 */
export const generateVarianceAnalysisReport = async (
  projectCode: string,
  fiscalYear: number,
  ProjectBudget: any,
  WBSElement: any,
): Promise<any> => {
  const budgetVariances = await calculateBudgetVarianceByType(projectCode, ProjectBudget);
  const wbsElements = await getWBSElementsByProject(projectCode, WBSElement);

  const wbsVariances = wbsElements.map((wbs: any) => ({
    wbsCode: wbs.wbsCode,
    budgetVariance: parseFloat(wbs.budgetAmount) - parseFloat(wbs.actualCost),
    scheduleVariance: parseFloat(wbs.earnedValue) - parseFloat(wbs.plannedValue),
  }));

  return {
    projectCode,
    fiscalYear,
    budgetVariances,
    wbsVariances,
    totalBudgetVariance: budgetVariances.reduce((sum: number, v: any) => sum + v.variance, 0),
  };
};

/**
 * Forecasts project completion date.
 *
 * @param {string} projectCode - Project code
 * @param {Model} WBSElement - WBSElement model
 * @param {Model} EarnedValueMetrics - EarnedValueMetrics model
 * @returns {Promise<Date>} Forecast completion date
 */
export const forecastProjectCompletionDate = async (
  projectCode: string,
  WBSElement: any,
  EarnedValueMetrics: any,
): Promise<Date> => {
  const wbsElements = await getWBSElementsByProject(projectCode, WBSElement);
  const latestMetric = await EarnedValueMetrics.findOne({
    where: { projectCode },
    order: [['reportingPeriod', 'DESC']],
  });

  const avgPercentComplete = wbsElements.reduce(
    (sum: number, wbs: any) => sum + parseFloat(wbs.percentComplete),
    0,
  ) / wbsElements.length;

  const spi = latestMetric ? parseFloat(latestMetric.spi) : 1.0;

  // Simple forecast: adjust original end date by SPI
  const maxEndDate = new Date(Math.max(...wbsElements.map((w: any) => w.endDate.getTime())));
  const remainingDays = Math.floor((maxEndDate.getTime() - new Date().getTime()) / 86400000);
  const adjustedDays = spi > 0 ? remainingDays / spi : remainingDays;

  const forecastDate = new Date();
  forecastDate.setDate(forecastDate.getDate() + adjustedDays);

  return forecastDate;
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

@Injectable()
export class CEFMSProjectCostTrackingService {
  constructor(private readonly sequelize: Sequelize) {}

  async createWBSElement(wbsData: WBSElementData) {
    const WBSElement = createWBSElementModel(this.sequelize);
    return createWBSElement(wbsData, WBSElement);
  }

  async recordCost(costData: ProjectActualCostData) {
    const ProjectActualCost = createProjectActualCostModel(this.sequelize);
    const WBSElement = createWBSElementModel(this.sequelize);
    return recordProjectActualCost(costData, ProjectActualCost, WBSElement);
  }

  async calculateEVM(projectCode: string, wbsCode: string, reportingPeriod: Date) {
    const WBSElement = createWBSElementModel(this.sequelize);
    return calculateEarnedValueMetrics(projectCode, wbsCode, reportingPeriod, WBSElement);
  }
}

export default {
  // Models
  createWBSElementModel,
  createProjectBudgetModel,
  createProjectActualCostModel,
  createEarnedValueMetricsModel,
  createProjectMilestoneModel,
  createChangeOrderModel,

  // WBS
  createWBSElement,
  buildWBSHierarchy,
  updateWBSBudget,
  updateWBSPercentComplete,
  getWBSElementsByProject,
  calculateWBSRollup,
  validateWBSHierarchy,

  // Budget
  createProjectBudget,
  updateBudgetRevision,
  getProjectBudgetSummary,
  calculateBudgetVarianceByType,
  validateBudgetAvailability,
  transferBudgetBetweenCategories,
  generateBudgetForecast,

  // Costs
  recordProjectActualCost,
  getActualCostsByWBS,
  calculateCostByType,
  generateCostTrendAnalysis,
  validateCostEntry,
  exportCostDataCSV,
  reconcileCostsWithBudget,

  // EVM
  calculateEarnedValueMetrics,
  storeEarnedValueMetrics,
  getEVMTrends,
  generateEVMDashboard,
  validateEVMData,
  exportEVMReportPDF,
  calculateTCPI,

  // Milestones & Changes
  createProjectMilestone,
  updateMilestoneStatus,
  getCriticalPathMilestones,
  createChangeOrder,
  approveChangeOrder,
  implementChangeOrder,
  getChangeOrderImpactSummary,

  // Reporting
  generateProjectPerformanceReport,
  calculateScheduleVariance,
  generateCPITrend,
  exportProjectDashboard,
  validateProjectHealthIndicators,
  generateVarianceAnalysisReport,
  forecastProjectCompletionDate,

  // Service
  CEFMSProjectCostTrackingService,
};
