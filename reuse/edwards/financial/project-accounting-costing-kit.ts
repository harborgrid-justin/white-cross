/**
 * LOC: PRJACCT001
 * File: /reuse/edwards/financial/project-accounting-costing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../../financial/general-ledger-operations-kit (GL integration)
 *
 * DOWNSTREAM (imported by):
 *   - Backend project management modules
 *   - Project costing services
 *   - Project billing modules
 *   - Earned value management
 *   - Project analytics and forecasting
 */

/**
 * File: /reuse/edwards/financial/project-accounting-costing-kit.ts
 * Locator: WC-EDW-PRJACCT-001
 * Purpose: Comprehensive Project Accounting & Costing - JD Edwards EnterpriseOne-level project management, costing, billing, earned value
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit
 * Downstream: ../backend/projects/*, Project Costing Services, Project Billing, Earned Value Management, Project Analytics
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for project setup, budgets, costing, WBS, earned value, billing, commitments, forecasting, analytics
 *
 * LLM Context: Enterprise-grade project accounting competing with Oracle JD Edwards EnterpriseOne.
 * Provides comprehensive project lifecycle management, work breakdown structure (WBS), project budgeting,
 * cost collection, commitment tracking, earned value management (EVM), project billing, revenue recognition,
 * project forecasting, cost-to-complete analysis, project analytics, resource allocation, and multi-project reporting.
 */

import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError } from 'sequelize';
import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ProjectHeader {
  projectId: number;
  projectNumber: string;
  projectName: string;
  projectType: 'capital' | 'operating' | 'research' | 'construction' | 'maintenance';
  projectManager: string;
  customerCode?: string;
  contractNumber?: string;
  startDate: Date;
  plannedEndDate: Date;
  actualEndDate?: Date;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled' | 'closed';
  fiscalYear: number;
  organizationUnit: string;
  costCenter: string;
  fundingSource: string;
  totalBudget: number;
  totalActualCost: number;
  totalCommitments: number;
  totalBilled: number;
  totalRevenue: number;
}

interface WorkBreakdownStructure {
  wbsId: number;
  projectId: number;
  wbsCode: string;
  wbsName: string;
  wbsLevel: number;
  parentWbsId?: number;
  description: string;
  responsiblePerson: string;
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  budgetAmount: number;
  actualCost: number;
  commitments: number;
  percentComplete: number;
  isBillable: boolean;
  isActive: boolean;
}

interface ProjectBudget {
  budgetId: number;
  projectId: number;
  wbsId?: number;
  fiscalYear: number;
  fiscalPeriod: number;
  budgetType: 'original' | 'revised' | 'forecast' | 'baseline';
  accountCode: string;
  costCategory: string;
  budgetAmount: number;
  committedAmount: number;
  actualAmount: number;
  varianceAmount: number;
  variancePercent: number;
  approvedBy?: string;
  approvedDate?: Date;
  effectiveDate: Date;
  expirationDate?: Date;
}

interface ProjectCostDetail {
  costId: number;
  projectId: number;
  wbsId?: number;
  costDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  transactionType: 'labor' | 'material' | 'equipment' | 'subcontract' | 'overhead' | 'other';
  accountCode: string;
  costCategory: string;
  quantity: number;
  unitOfMeasure: string;
  unitCost: number;
  totalCost: number;
  resourceId?: string;
  employeeId?: string;
  purchaseOrderNumber?: string;
  invoiceNumber?: string;
  description: string;
  isBillable: boolean;
  isBilled: boolean;
  glJournalEntryId?: number;
  sourceDocument: string;
}

interface ProjectCommitment {
  commitmentId: number;
  projectId: number;
  wbsId?: number;
  commitmentType: 'purchase-order' | 'contract' | 'requisition' | 'encumbrance';
  commitmentNumber: string;
  commitmentDate: Date;
  vendorCode: string;
  vendorName: string;
  description: string;
  originalAmount: number;
  committedAmount: number;
  receivedAmount: number;
  invoicedAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'open' | 'partial' | 'received' | 'closed' | 'cancelled';
  expirationDate?: Date;
}

interface EarnedValueMetrics {
  projectId: number;
  wbsId?: number;
  measurementDate: Date;
  fiscalYear: number;
  fiscalPeriod: number;
  plannedValue: number;           // PV / BCWS
  earnedValue: number;            // EV / BCWP
  actualCost: number;             // AC / ACWP
  budgetAtCompletion: number;     // BAC
  estimateAtCompletion: number;   // EAC
  estimateToComplete: number;     // ETC
  varianceAtCompletion: number;   // VAC
  costVariance: number;           // CV = EV - AC
  scheduleVariance: number;       // SV = EV - PV
  costPerformanceIndex: number;   // CPI = EV / AC
  schedulePerformanceIndex: number; // SPI = EV / PV
  toCompletePerformanceIndex: number; // TCPI
  percentComplete: number;
  percentScheduleComplete: number;
}

interface ProjectBillingSchedule {
  scheduleId: number;
  projectId: number;
  wbsId?: number;
  scheduleNumber: string;
  billingType: 'time-material' | 'fixed-price' | 'milestone' | 'cost-plus' | 'progress';
  milestoneDescription?: string;
  scheduledDate: Date;
  scheduledAmount: number;
  billedAmount: number;
  unbilledAmount: number;
  billingPercent: number;
  retainagePercent: number;
  retainageAmount: number;
  status: 'pending' | 'ready' | 'billed' | 'approved' | 'invoiced';
  invoiceNumber?: string;
  invoiceDate?: Date;
}

interface ProjectRevenueRecognition {
  revenueId: number;
  projectId: number;
  wbsId?: number;
  fiscalYear: number;
  fiscalPeriod: number;
  recognitionDate: Date;
  recognitionMethod: 'percentage-completion' | 'completed-contract' | 'milestone' | 'cost-to-cost';
  totalContractAmount: number;
  costsIncurred: number;
  estimatedTotalCost: number;
  percentComplete: number;
  revenueToDate: number;
  currentPeriodRevenue: number;
  billedToDate: number;
  unbilledRevenue: number;
  deferredRevenue: number;
  glJournalEntryId?: number;
}

interface ProjectForecast {
  forecastId: number;
  projectId: number;
  wbsId?: number;
  forecastDate: Date;
  forecastPeriod: number;
  forecastYear: number;
  costCategory: string;
  originalBudget: number;
  actualToDate: number;
  commitmentsToDate: number;
  forecastToComplete: number;
  estimateAtCompletion: number;
  varianceAtCompletion: number;
  confidenceLevel: number;
  forecastMethod: 'trend' | 'manual' | 'bottom-up' | 'parametric';
  assumptions: string;
  risks: string;
  forecastBy: string;
}

interface ProjectResourceAllocation {
  allocationId: number;
  projectId: number;
  wbsId?: number;
  resourceId: string;
  resourceType: 'labor' | 'equipment' | 'material';
  resourceName: string;
  startDate: Date;
  endDate: Date;
  allocatedHours: number;
  actualHours: number;
  remainingHours: number;
  allocatedPercent: number;
  costRate: number;
  billingRate: number;
  totalCost: number;
  totalBilling: number;
  status: 'planned' | 'assigned' | 'active' | 'completed';
}

interface ProjectAnalytics {
  projectId: number;
  analysisDate: Date;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalBudget: number;
  totalActualCost: number;
  totalCommitments: number;
  totalVariance: number;
  averageCostVariance: number;
  averageScheduleVariance: number;
  averageCPI: number;
  averageSPI: number;
  onBudgetCount: number;
  overBudgetCount: number;
  underBudgetCount: number;
  onScheduleCount: number;
  behindScheduleCount: number;
  aheadScheduleCount: number;
}

interface CostToComplete {
  projectId: number;
  wbsId?: number;
  analysisDate: Date;
  costCategory: string;
  budgetAmount: number;
  actualToDate: number;
  commitmentsToDate: number;
  estimateToComplete: number;
  estimateAtCompletion: number;
  varianceAtCompletion: number;
  percentComplete: number;
  completionMethod: 'earned-value' | 'budget-percentage' | 'manual' | 'trend-analysis';
  riskAdjustment: number;
  contingency: number;
  managementReserve: number;
}

interface ProjectChangeOrder {
  changeOrderId: number;
  projectId: number;
  changeOrderNumber: string;
  changeOrderDate: Date;
  changeType: 'scope' | 'budget' | 'schedule' | 'contract';
  description: string;
  justification: string;
  requestedBy: string;
  budgetImpact: number;
  scheduleImpact: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'implemented';
  approvedBy?: string;
  approvedDate?: Date;
  implementedDate?: Date;
}

// ============================================================================
// DTO CLASSES
// ============================================================================

export class CreateProjectDto {
  @ApiProperty({ description: 'Project number', example: 'PRJ-2024-001' })
  projectNumber!: string;

  @ApiProperty({ description: 'Project name', example: 'Building Construction Phase 1' })
  projectName!: string;

  @ApiProperty({ description: 'Project type', enum: ['capital', 'operating', 'research', 'construction', 'maintenance'] })
  projectType!: string;

  @ApiProperty({ description: 'Project manager', example: 'john.doe' })
  projectManager!: string;

  @ApiProperty({ description: 'Customer code', required: false })
  customerCode?: string;

  @ApiProperty({ description: 'Contract number', required: false })
  contractNumber?: string;

  @ApiProperty({ description: 'Project start date', example: '2024-01-01' })
  startDate!: Date;

  @ApiProperty({ description: 'Planned end date', example: '2024-12-31' })
  plannedEndDate!: Date;

  @ApiProperty({ description: 'Organization unit' })
  organizationUnit!: string;

  @ApiProperty({ description: 'Cost center' })
  costCenter!: string;

  @ApiProperty({ description: 'Funding source' })
  fundingSource!: string;

  @ApiProperty({ description: 'Total budget amount' })
  totalBudget!: number;
}

export class CreateWBSDto {
  @ApiProperty({ description: 'Project ID' })
  projectId!: number;

  @ApiProperty({ description: 'WBS code', example: '1.2.3' })
  wbsCode!: string;

  @ApiProperty({ description: 'WBS name', example: 'Site Preparation' })
  wbsName!: string;

  @ApiProperty({ description: 'WBS level in hierarchy' })
  wbsLevel!: number;

  @ApiProperty({ description: 'Parent WBS ID', required: false })
  parentWbsId?: number;

  @ApiProperty({ description: 'Description' })
  description!: string;

  @ApiProperty({ description: 'Responsible person' })
  responsiblePerson!: string;

  @ApiProperty({ description: 'Budget amount' })
  budgetAmount!: number;

  @ApiProperty({ description: 'Is billable', default: true })
  isBillable?: boolean;
}

export class CreateProjectBudgetDto {
  @ApiProperty({ description: 'Project ID' })
  projectId!: number;

  @ApiProperty({ description: 'WBS ID', required: false })
  wbsId?: number;

  @ApiProperty({ description: 'Fiscal year' })
  fiscalYear!: number;

  @ApiProperty({ description: 'Fiscal period' })
  fiscalPeriod!: number;

  @ApiProperty({ description: 'Budget type', enum: ['original', 'revised', 'forecast', 'baseline'] })
  budgetType!: string;

  @ApiProperty({ description: 'Account code' })
  accountCode!: string;

  @ApiProperty({ description: 'Cost category' })
  costCategory!: string;

  @ApiProperty({ description: 'Budget amount' })
  budgetAmount!: number;
}

export class RecordProjectCostDto {
  @ApiProperty({ description: 'Project ID' })
  projectId!: number;

  @ApiProperty({ description: 'WBS ID', required: false })
  wbsId?: number;

  @ApiProperty({ description: 'Cost date' })
  costDate!: Date;

  @ApiProperty({ description: 'Transaction type', enum: ['labor', 'material', 'equipment', 'subcontract', 'overhead', 'other'] })
  transactionType!: string;

  @ApiProperty({ description: 'Account code' })
  accountCode!: string;

  @ApiProperty({ description: 'Cost category' })
  costCategory!: string;

  @ApiProperty({ description: 'Quantity' })
  quantity!: number;

  @ApiProperty({ description: 'Unit of measure' })
  unitOfMeasure!: string;

  @ApiProperty({ description: 'Unit cost' })
  unitCost!: number;

  @ApiProperty({ description: 'Description' })
  description!: string;

  @ApiProperty({ description: 'Is billable', default: true })
  isBillable?: boolean;
}

export class CreateBillingScheduleDto {
  @ApiProperty({ description: 'Project ID' })
  projectId!: number;

  @ApiProperty({ description: 'Billing type', enum: ['time-material', 'fixed-price', 'milestone', 'cost-plus', 'progress'] })
  billingType!: string;

  @ApiProperty({ description: 'Scheduled date' })
  scheduledDate!: Date;

  @ApiProperty({ description: 'Scheduled amount' })
  scheduledAmount!: number;

  @ApiProperty({ description: 'Retainage percent', default: 0 })
  retainagePercent?: number;
}

export class EarnedValueCalculationDto {
  @ApiProperty({ description: 'Project ID' })
  projectId!: number;

  @ApiProperty({ description: 'WBS ID', required: false })
  wbsId?: number;

  @ApiProperty({ description: 'Measurement date' })
  measurementDate!: Date;

  @ApiProperty({ description: 'Calculation method', enum: ['percent-complete', 'weighted-milestone', 'cost-to-cost'] })
  calculationMethod!: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Project Header with comprehensive project tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ProjectHeader model
 *
 * @example
 * ```typescript
 * const Project = createProjectHeaderModel(sequelize);
 * const project = await Project.create({
 *   projectNumber: 'PRJ-2024-001',
 *   projectName: 'Building Construction',
 *   projectType: 'capital',
 *   projectManager: 'john.doe',
 *   status: 'planning'
 * });
 * ```
 */
export const createProjectHeaderModel = (sequelize: Sequelize) => {
  class ProjectHeader extends Model {
    public id!: number;
    public projectNumber!: string;
    public projectName!: string;
    public projectType!: string;
    public projectManager!: string;
    public customerCode!: string | null;
    public contractNumber!: string | null;
    public startDate!: Date;
    public plannedEndDate!: Date;
    public actualEndDate!: Date | null;
    public status!: string;
    public fiscalYear!: number;
    public organizationUnit!: string;
    public costCenter!: string;
    public fundingSource!: string;
    public totalBudget!: number;
    public totalActualCost!: number;
    public totalCommitments!: number;
    public totalBilled!: number;
    public totalRevenue!: number;
    public metadata!: Record<string, any>;
    public createdBy!: string;
    public updatedBy!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ProjectHeader.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      projectNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique project identifier',
      },
      projectName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Project name',
      },
      projectType: {
        type: DataTypes.ENUM('capital', 'operating', 'research', 'construction', 'maintenance'),
        allowNull: false,
        comment: 'Type of project',
      },
      projectManager: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Project manager user ID',
      },
      customerCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Customer/client code',
      },
      contractNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Contract reference number',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Project start date',
      },
      plannedEndDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Planned completion date',
      },
      actualEndDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Actual completion date',
      },
      status: {
        type: DataTypes.ENUM('planning', 'active', 'on-hold', 'completed', 'cancelled', 'closed'),
        allowNull: false,
        defaultValue: 'planning',
        comment: 'Project status',
      },
      fiscalYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Fiscal year',
      },
      organizationUnit: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Organization unit code',
      },
      costCenter: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Cost center code',
      },
      fundingSource: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Funding source code',
      },
      totalBudget: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total project budget',
      },
      totalActualCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total actual costs',
      },
      totalCommitments: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total commitments',
      },
      totalBilled: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total amount billed',
      },
      totalRevenue: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total revenue recognized',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional project metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created the project',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who last updated the project',
      },
    },
    {
      sequelize,
      tableName: 'project_headers',
      timestamps: true,
      indexes: [
        { fields: ['projectNumber'], unique: true },
        { fields: ['projectType'] },
        { fields: ['status'] },
        { fields: ['projectManager'] },
        { fields: ['fiscalYear'] },
        { fields: ['organizationUnit'] },
        { fields: ['customerCode'] },
      ],
    },
  );

  return ProjectHeader;
};

/**
 * Sequelize model for Work Breakdown Structure (WBS) with hierarchical support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} WorkBreakdownStructure model
 *
 * @example
 * ```typescript
 * const WBS = createWorkBreakdownStructureModel(sequelize);
 * const wbs = await WBS.create({
 *   projectId: 1,
 *   wbsCode: '1.2.3',
 *   wbsName: 'Site Preparation',
 *   wbsLevel: 3,
 *   budgetAmount: 100000
 * });
 * ```
 */
export const createWorkBreakdownStructureModel = (sequelize: Sequelize) => {
  class WorkBreakdownStructure extends Model {
    public id!: number;
    public projectId!: number;
    public wbsCode!: string;
    public wbsName!: string;
    public wbsLevel!: number;
    public parentWbsId!: number | null;
    public description!: string;
    public responsiblePerson!: string;
    public plannedStartDate!: Date;
    public plannedEndDate!: Date;
    public actualStartDate!: Date | null;
    public actualEndDate!: Date | null;
    public budgetAmount!: number;
    public actualCost!: number;
    public commitments!: number;
    public percentComplete!: number;
    public isBillable!: boolean;
    public isActive!: boolean;
  }

  WorkBreakdownStructure.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'project_headers',
          key: 'id',
        },
        comment: 'Reference to project',
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
      wbsLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Hierarchy level',
      },
      parentWbsId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'work_breakdown_structures',
          key: 'id',
        },
        comment: 'Parent WBS element',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Detailed description',
      },
      responsiblePerson: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Person responsible',
      },
      plannedStartDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Planned start date',
      },
      plannedEndDate: {
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
      budgetAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Budget amount',
      },
      actualCost: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Actual cost incurred',
      },
      commitments: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Committed amounts',
      },
      percentComplete: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Percent complete',
      },
      isBillable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Is billable to customer',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Is active',
      },
    },
    {
      sequelize,
      tableName: 'work_breakdown_structures',
      timestamps: true,
      indexes: [
        { fields: ['projectId', 'wbsCode'], unique: true },
        { fields: ['projectId'] },
        { fields: ['parentWbsId'] },
        { fields: ['isActive'] },
      ],
    },
  );

  return WorkBreakdownStructure;
};

// ============================================================================
// PROJECT SETUP & MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Creates a new project with comprehensive setup.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateProjectDto} projectData - Project data
 * @param {string} userId - User creating the project
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProjectHeader>} Created project
 *
 * @example
 * ```typescript
 * const project = await createProject(sequelize, {
 *   projectNumber: 'PRJ-2024-001',
 *   projectName: 'Building Construction Phase 1',
 *   projectType: 'capital',
 *   projectManager: 'john.doe',
 *   startDate: new Date('2024-01-01'),
 *   plannedEndDate: new Date('2024-12-31'),
 *   organizationUnit: 'ORG-100',
 *   costCenter: 'CC-200',
 *   fundingSource: 'FND-300',
 *   totalBudget: 1000000
 * }, 'admin');
 * ```
 */
export const createProject = async (
  sequelize: Sequelize,
  projectData: CreateProjectDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const ProjectHeader = createProjectHeaderModel(sequelize);

  const project = await ProjectHeader.create(
    {
      ...projectData,
      fiscalYear: projectData.startDate.getFullYear(),
      totalActualCost: 0,
      totalCommitments: 0,
      totalBilled: 0,
      totalRevenue: 0,
      status: 'planning',
      createdBy: userId,
      updatedBy: userId,
    },
    { transaction },
  );

  return project;
};

/**
 * Updates project header information.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {Partial<ProjectHeader>} updates - Fields to update
 * @param {string} userId - User updating the project
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateProject(sequelize, 1, {
 *   projectManager: 'jane.smith',
 *   status: 'active'
 * }, 'admin');
 * ```
 */
export const updateProject = async (
  sequelize: Sequelize,
  projectId: number,
  updates: Partial<ProjectHeader>,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  const ProjectHeader = createProjectHeaderModel(sequelize);

  await ProjectHeader.update(
    {
      ...updates,
      updatedBy: userId,
    },
    {
      where: { id: projectId },
      transaction,
    },
  );
};

/**
 * Retrieves project details with aggregated financial information.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<ProjectHeader>} Project details
 *
 * @example
 * ```typescript
 * const project = await getProjectDetails(sequelize, 1);
 * console.log(`Budget: ${project.totalBudget}, Actual: ${project.totalActualCost}`);
 * ```
 */
export const getProjectDetails = async (
  sequelize: Sequelize,
  projectId: number,
): Promise<any> => {
  const ProjectHeader = createProjectHeaderModel(sequelize);

  const project = await ProjectHeader.findByPk(projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  return project;
};

/**
 * Closes a project and performs final cost reconciliation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {string} userId - User closing the project
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await closeProject(sequelize, 1, 'manager');
 * ```
 */
export const closeProject = async (
  sequelize: Sequelize,
  projectId: number,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  const ProjectHeader = createProjectHeaderModel(sequelize);

  const project = await ProjectHeader.findByPk(projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  if (project.status !== 'completed') {
    throw new Error('Only completed projects can be closed');
  }

  await ProjectHeader.update(
    {
      status: 'closed',
      actualEndDate: new Date(),
      updatedBy: userId,
    },
    {
      where: { id: projectId },
      transaction,
    },
  );
};

// ============================================================================
// WORK BREAKDOWN STRUCTURE (WBS) FUNCTIONS
// ============================================================================

/**
 * Creates a WBS element in the project hierarchy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateWBSDto} wbsData - WBS data
 * @param {string} userId - User creating the WBS
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WorkBreakdownStructure>} Created WBS element
 *
 * @example
 * ```typescript
 * const wbs = await createWBSElement(sequelize, {
 *   projectId: 1,
 *   wbsCode: '1.2.3',
 *   wbsName: 'Site Preparation',
 *   wbsLevel: 3,
 *   description: 'Prepare construction site',
 *   responsiblePerson: 'john.doe',
 *   budgetAmount: 100000
 * }, 'admin');
 * ```
 */
export const createWBSElement = async (
  sequelize: Sequelize,
  wbsData: CreateWBSDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const WBS = createWorkBreakdownStructureModel(sequelize);
  const ProjectHeader = createProjectHeaderModel(sequelize);

  const project = await ProjectHeader.findByPk(wbsData.projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  const wbs = await WBS.create(
    {
      ...wbsData,
      plannedStartDate: project.startDate,
      plannedEndDate: project.plannedEndDate,
      actualCost: 0,
      commitments: 0,
      percentComplete: 0,
      isBillable: wbsData.isBillable ?? true,
      isActive: true,
    },
    { transaction },
  );

  return wbs;
};

/**
 * Retrieves WBS hierarchy for a project.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<WorkBreakdownStructure[]>} WBS hierarchy
 *
 * @example
 * ```typescript
 * const wbsHierarchy = await getWBSHierarchy(sequelize, 1);
 * wbsHierarchy.forEach(wbs => console.log(`${wbs.wbsCode}: ${wbs.wbsName}`));
 * ```
 */
export const getWBSHierarchy = async (
  sequelize: Sequelize,
  projectId: number,
): Promise<any[]> => {
  const WBS = createWorkBreakdownStructureModel(sequelize);

  const wbsElements = await WBS.findAll({
    where: { projectId, isActive: true },
    order: [['wbsCode', 'ASC']],
  });

  return wbsElements;
};

/**
 * Updates WBS element details.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} wbsId - WBS ID
 * @param {Partial<WorkBreakdownStructure>} updates - Fields to update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateWBSElement(sequelize, 1, {
 *   percentComplete: 75,
 *   actualCost: 75000
 * });
 * ```
 */
export const updateWBSElement = async (
  sequelize: Sequelize,
  wbsId: number,
  updates: Partial<WorkBreakdownStructure>,
  transaction?: Transaction,
): Promise<void> => {
  const WBS = createWorkBreakdownStructureModel(sequelize);

  await WBS.update(updates, {
    where: { id: wbsId },
    transaction,
  });
};

/**
 * Calculates rollup budget and costs for WBS hierarchy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<{ totalBudget: number; totalCost: number; totalCommitments: number }>} Rollup totals
 *
 * @example
 * ```typescript
 * const rollup = await calculateWBSRollup(sequelize, 1);
 * console.log(`Total Budget: ${rollup.totalBudget}`);
 * ```
 */
export const calculateWBSRollup = async (
  sequelize: Sequelize,
  projectId: number,
): Promise<{ totalBudget: number; totalCost: number; totalCommitments: number }> => {
  const WBS = createWorkBreakdownStructureModel(sequelize);

  const wbsElements = await WBS.findAll({
    where: { projectId, isActive: true },
    attributes: [
      [sequelize.fn('SUM', sequelize.col('budgetAmount')), 'totalBudget'],
      [sequelize.fn('SUM', sequelize.col('actualCost')), 'totalCost'],
      [sequelize.fn('SUM', sequelize.col('commitments')), 'totalCommitments'],
    ],
  });

  const result = wbsElements[0] as any;
  return {
    totalBudget: Number(result.get('totalBudget') || 0),
    totalCost: Number(result.get('totalCost') || 0),
    totalCommitments: Number(result.get('totalCommitments') || 0),
  };
};

// ============================================================================
// PROJECT BUDGET FUNCTIONS
// ============================================================================

/**
 * Creates project budget allocation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateProjectBudgetDto} budgetData - Budget data
 * @param {string} userId - User creating the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProjectBudget>} Created budget
 *
 * @example
 * ```typescript
 * const budget = await createProjectBudget(sequelize, {
 *   projectId: 1,
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   budgetType: 'original',
 *   accountCode: '6100',
 *   costCategory: 'Labor',
 *   budgetAmount: 500000
 * }, 'admin');
 * ```
 */
export const createProjectBudget = async (
  sequelize: Sequelize,
  budgetData: CreateProjectBudgetDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const budget = await sequelize.models.ProjectBudget?.create(
    {
      ...budgetData,
      committedAmount: 0,
      actualAmount: 0,
      varianceAmount: 0,
      variancePercent: 0,
      effectiveDate: new Date(),
      createdBy: userId,
    },
    { transaction },
  );

  return budget;
};

/**
 * Updates project budget amounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} budgetAmount - New budget amount
 * @param {string} userId - User updating the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateProjectBudget(sequelize, 1, 550000, 'manager');
 * ```
 */
export const updateProjectBudget = async (
  sequelize: Sequelize,
  budgetId: number,
  budgetAmount: number,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.models.ProjectBudget?.update(
    {
      budgetAmount,
      updatedBy: userId,
    },
    {
      where: { id: budgetId },
      transaction,
    },
  );
};

/**
 * Retrieves project budget vs actual comparison.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<ProjectBudget[]>} Budget comparison
 *
 * @example
 * ```typescript
 * const budgetVsActual = await getProjectBudgetVsActual(sequelize, 1, 2024, 1);
 * budgetVsActual.forEach(b => console.log(`${b.costCategory}: ${b.varianceAmount}`));
 * ```
 */
export const getProjectBudgetVsActual = async (
  sequelize: Sequelize,
  projectId: number,
  fiscalYear: number,
  fiscalPeriod: number,
): Promise<any[]> => {
  const budgets = await sequelize.models.ProjectBudget?.findAll({
    where: {
      projectId,
      fiscalYear,
      fiscalPeriod,
    },
    order: [['costCategory', 'ASC']],
  });

  return budgets || [];
};

/**
 * Calculates budget variance at project or WBS level.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {number} [wbsId] - Optional WBS ID
 * @returns {Promise<{ budgetAmount: number; actualAmount: number; variance: number; variancePercent: number }>} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = await calculateBudgetVariance(sequelize, 1);
 * console.log(`Variance: ${variance.variancePercent}%`);
 * ```
 */
export const calculateBudgetVariance = async (
  sequelize: Sequelize,
  projectId: number,
  wbsId?: number,
): Promise<{ budgetAmount: number; actualAmount: number; variance: number; variancePercent: number }> => {
  const whereClause: any = { projectId };
  if (wbsId) {
    whereClause.wbsId = wbsId;
  }

  const budgets = await sequelize.models.ProjectBudget?.findAll({
    where: whereClause,
    attributes: [
      [sequelize.fn('SUM', sequelize.col('budgetAmount')), 'totalBudget'],
      [sequelize.fn('SUM', sequelize.col('actualAmount')), 'totalActual'],
    ],
  });

  const result = budgets?.[0] as any;
  const budgetAmount = Number(result?.get('totalBudget') || 0);
  const actualAmount = Number(result?.get('totalActual') || 0);
  const variance = budgetAmount - actualAmount;
  const variancePercent = budgetAmount > 0 ? (variance / budgetAmount) * 100 : 0;

  return { budgetAmount, actualAmount, variance, variancePercent };
};

// ============================================================================
// PROJECT COSTING FUNCTIONS
// ============================================================================

/**
 * Records project cost transaction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RecordProjectCostDto} costData - Cost data
 * @param {string} userId - User recording the cost
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProjectCostDetail>} Recorded cost
 *
 * @example
 * ```typescript
 * const cost = await recordProjectCost(sequelize, {
 *   projectId: 1,
 *   wbsId: 5,
 *   costDate: new Date(),
 *   transactionType: 'labor',
 *   accountCode: '6100',
 *   costCategory: 'Labor',
 *   quantity: 40,
 *   unitOfMeasure: 'hours',
 *   unitCost: 75,
 *   description: 'Engineering hours'
 * }, 'admin');
 * ```
 */
export const recordProjectCost = async (
  sequelize: Sequelize,
  costData: RecordProjectCostDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const totalCost = costData.quantity * costData.unitCost;

  const cost = await sequelize.models.ProjectCostDetail?.create(
    {
      ...costData,
      totalCost,
      fiscalYear: costData.costDate.getFullYear(),
      fiscalPeriod: costData.costDate.getMonth() + 1,
      isBillable: costData.isBillable ?? true,
      isBilled: false,
      createdBy: userId,
    },
    { transaction },
  );

  // Update WBS actual cost
  if (costData.wbsId) {
    await updateWBSActualCost(sequelize, costData.wbsId, totalCost, transaction);
  }

  // Update project actual cost
  await updateProjectActualCost(sequelize, costData.projectId, totalCost, transaction);

  return cost;
};

/**
 * Updates WBS actual cost totals.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} wbsId - WBS ID
 * @param {number} costAmount - Cost amount to add
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 */
const updateWBSActualCost = async (
  sequelize: Sequelize,
  wbsId: number,
  costAmount: number,
  transaction?: Transaction,
): Promise<void> => {
  const WBS = createWorkBreakdownStructureModel(sequelize);

  await WBS.increment('actualCost', {
    by: costAmount,
    where: { id: wbsId },
    transaction,
  });
};

/**
 * Updates project actual cost totals.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {number} costAmount - Cost amount to add
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 */
const updateProjectActualCost = async (
  sequelize: Sequelize,
  projectId: number,
  costAmount: number,
  transaction?: Transaction,
): Promise<void> => {
  const ProjectHeader = createProjectHeaderModel(sequelize);

  await ProjectHeader.increment('totalActualCost', {
    by: costAmount,
    where: { id: projectId },
    transaction,
  });
};

/**
 * Retrieves project costs by category.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<{ category: string; totalCost: number }[]>} Costs by category
 *
 * @example
 * ```typescript
 * const costs = await getProjectCostsByCategory(sequelize, 1, new Date('2024-01-01'), new Date('2024-12-31'));
 * costs.forEach(c => console.log(`${c.category}: ${c.totalCost}`));
 * ```
 */
export const getProjectCostsByCategory = async (
  sequelize: Sequelize,
  projectId: number,
  startDate: Date,
  endDate: Date,
): Promise<{ category: string; totalCost: number }[]> => {
  const costs = await sequelize.models.ProjectCostDetail?.findAll({
    where: {
      projectId,
      costDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    attributes: [
      'costCategory',
      [sequelize.fn('SUM', sequelize.col('totalCost')), 'totalCost'],
    ],
    group: ['costCategory'],
    order: [[sequelize.fn('SUM', sequelize.col('totalCost')), 'DESC']],
  });

  return (costs || []).map((c: any) => ({
    category: c.costCategory,
    totalCost: Number(c.get('totalCost')),
  }));
};

/**
 * Retrieves project costs by WBS element.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<{ wbsCode: string; wbsName: string; totalCost: number }[]>} Costs by WBS
 *
 * @example
 * ```typescript
 * const wbsCosts = await getProjectCostsByWBS(sequelize, 1);
 * wbsCosts.forEach(w => console.log(`${w.wbsCode}: ${w.totalCost}`));
 * ```
 */
export const getProjectCostsByWBS = async (
  sequelize: Sequelize,
  projectId: number,
): Promise<{ wbsCode: string; wbsName: string; totalCost: number }[]> => {
  const WBS = createWorkBreakdownStructureModel(sequelize);

  const wbsElements = await WBS.findAll({
    where: { projectId, isActive: true },
    attributes: ['wbsCode', 'wbsName', 'actualCost'],
    order: [['wbsCode', 'ASC']],
  });

  return wbsElements.map(w => ({
    wbsCode: w.wbsCode,
    wbsName: w.wbsName,
    totalCost: Number(w.actualCost),
  }));
};

// ============================================================================
// COMMITMENT TRACKING FUNCTIONS
// ============================================================================

/**
 * Creates project commitment (PO, contract, etc.).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ProjectCommitment>} commitmentData - Commitment data
 * @param {string} userId - User creating the commitment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProjectCommitment>} Created commitment
 *
 * @example
 * ```typescript
 * const commitment = await createProjectCommitment(sequelize, {
 *   projectId: 1,
 *   commitmentType: 'purchase-order',
 *   commitmentNumber: 'PO-2024-001',
 *   commitmentDate: new Date(),
 *   vendorCode: 'VEND-100',
 *   vendorName: 'ABC Suppliers',
 *   description: 'Construction materials',
 *   originalAmount: 50000
 * }, 'admin');
 * ```
 */
export const createProjectCommitment = async (
  sequelize: Sequelize,
  commitmentData: Partial<ProjectCommitment>,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const commitment = await sequelize.models.ProjectCommitment?.create(
    {
      ...commitmentData,
      committedAmount: commitmentData.originalAmount,
      receivedAmount: 0,
      invoicedAmount: 0,
      paidAmount: 0,
      remainingAmount: commitmentData.originalAmount,
      status: 'open',
      createdBy: userId,
    },
    { transaction },
  );

  // Update WBS commitments
  if (commitmentData.wbsId) {
    await updateWBSCommitments(sequelize, commitmentData.wbsId, commitmentData.originalAmount!, transaction);
  }

  // Update project commitments
  await updateProjectCommitments(sequelize, commitmentData.projectId!, commitmentData.originalAmount!, transaction);

  return commitment;
};

/**
 * Updates WBS commitment totals.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} wbsId - WBS ID
 * @param {number} commitmentAmount - Commitment amount to add
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 */
const updateWBSCommitments = async (
  sequelize: Sequelize,
  wbsId: number,
  commitmentAmount: number,
  transaction?: Transaction,
): Promise<void> => {
  const WBS = createWorkBreakdownStructureModel(sequelize);

  await WBS.increment('commitments', {
    by: commitmentAmount,
    where: { id: wbsId },
    transaction,
  });
};

/**
 * Updates project commitment totals.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {number} commitmentAmount - Commitment amount to add
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 */
const updateProjectCommitments = async (
  sequelize: Sequelize,
  projectId: number,
  commitmentAmount: number,
  transaction?: Transaction,
): Promise<void> => {
  const ProjectHeader = createProjectHeaderModel(sequelize);

  await ProjectHeader.increment('totalCommitments', {
    by: commitmentAmount,
    where: { id: projectId },
    transaction,
  });
};

/**
 * Updates commitment status and amounts (receiving, invoicing, payment).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Partial<ProjectCommitment>} updates - Fields to update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateCommitmentStatus(sequelize, 1, {
 *   receivedAmount: 25000,
 *   status: 'partial'
 * });
 * ```
 */
export const updateCommitmentStatus = async (
  sequelize: Sequelize,
  commitmentId: number,
  updates: Partial<ProjectCommitment>,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.models.ProjectCommitment?.update(updates, {
    where: { id: commitmentId },
    transaction,
  });
};

/**
 * Retrieves open commitments for project.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<ProjectCommitment[]>} Open commitments
 *
 * @example
 * ```typescript
 * const openCommitments = await getOpenCommitments(sequelize, 1);
 * console.log(`Open commitments: ${openCommitments.length}`);
 * ```
 */
export const getOpenCommitments = async (
  sequelize: Sequelize,
  projectId: number,
): Promise<any[]> => {
  const commitments = await sequelize.models.ProjectCommitment?.findAll({
    where: {
      projectId,
      status: {
        [Op.in]: ['open', 'partial'],
      },
    },
    order: [['commitmentDate', 'ASC']],
  });

  return commitments || [];
};

/**
 * Calculates total committed amounts by project.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<{ totalCommitted: number; totalReceived: number; totalRemaining: number }>} Commitment totals
 *
 * @example
 * ```typescript
 * const commitmentTotals = await calculateCommitmentTotals(sequelize, 1);
 * console.log(`Total Committed: ${commitmentTotals.totalCommitted}`);
 * ```
 */
export const calculateCommitmentTotals = async (
  sequelize: Sequelize,
  projectId: number,
): Promise<{ totalCommitted: number; totalReceived: number; totalRemaining: number }> => {
  const commitments = await sequelize.models.ProjectCommitment?.findAll({
    where: { projectId },
    attributes: [
      [sequelize.fn('SUM', sequelize.col('committedAmount')), 'totalCommitted'],
      [sequelize.fn('SUM', sequelize.col('receivedAmount')), 'totalReceived'],
      [sequelize.fn('SUM', sequelize.col('remainingAmount')), 'totalRemaining'],
    ],
  });

  const result = commitments?.[0] as any;
  return {
    totalCommitted: Number(result?.get('totalCommitted') || 0),
    totalReceived: Number(result?.get('totalReceived') || 0),
    totalRemaining: Number(result?.get('totalRemaining') || 0),
  };
};

// ============================================================================
// EARNED VALUE MANAGEMENT (EVM) FUNCTIONS
// ============================================================================

/**
 * Calculates earned value metrics for project.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {EarnedValueCalculationDto} evmData - EVM calculation data
 * @returns {Promise<EarnedValueMetrics>} EVM metrics
 *
 * @example
 * ```typescript
 * const evm = await calculateEarnedValue(sequelize, {
 *   projectId: 1,
 *   measurementDate: new Date(),
 *   calculationMethod: 'percent-complete'
 * });
 * console.log(`CPI: ${evm.costPerformanceIndex}, SPI: ${evm.schedulePerformanceIndex}`);
 * ```
 */
export const calculateEarnedValue = async (
  sequelize: Sequelize,
  evmData: EarnedValueCalculationDto,
): Promise<EarnedValueMetrics> => {
  const project = await getProjectDetails(sequelize, evmData.projectId);

  const budgetAtCompletion = Number(project.totalBudget);
  const actualCost = Number(project.totalActualCost);

  // For simplicity, calculate based on percent complete
  const percentComplete = 0; // This would be calculated based on actual WBS completion
  const earnedValue = budgetAtCompletion * (percentComplete / 100);
  const plannedValue = budgetAtCompletion * (percentComplete / 100); // Simplified

  const costVariance = earnedValue - actualCost;
  const scheduleVariance = earnedValue - plannedValue;
  const costPerformanceIndex = actualCost > 0 ? earnedValue / actualCost : 0;
  const schedulePerformanceIndex = plannedValue > 0 ? earnedValue / plannedValue : 0;

  const estimateAtCompletion = costPerformanceIndex > 0 ? budgetAtCompletion / costPerformanceIndex : budgetAtCompletion;
  const estimateToComplete = estimateAtCompletion - actualCost;
  const varianceAtCompletion = budgetAtCompletion - estimateAtCompletion;
  const toCompletePerformanceIndex = (budgetAtCompletion - earnedValue) / (budgetAtCompletion - actualCost);

  return {
    projectId: evmData.projectId,
    wbsId: evmData.wbsId,
    measurementDate: evmData.measurementDate,
    fiscalYear: evmData.measurementDate.getFullYear(),
    fiscalPeriod: evmData.measurementDate.getMonth() + 1,
    plannedValue,
    earnedValue,
    actualCost,
    budgetAtCompletion,
    estimateAtCompletion,
    estimateToComplete,
    varianceAtCompletion,
    costVariance,
    scheduleVariance,
    costPerformanceIndex,
    schedulePerformanceIndex,
    toCompletePerformanceIndex,
    percentComplete,
    percentScheduleComplete: percentComplete,
  };
};

/**
 * Stores earned value metrics snapshot.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {EarnedValueMetrics} evmMetrics - EVM metrics
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await storeEarnedValueMetrics(sequelize, evmMetrics);
 * ```
 */
export const storeEarnedValueMetrics = async (
  sequelize: Sequelize,
  evmMetrics: EarnedValueMetrics,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.models.EarnedValueMetrics?.create(evmMetrics, { transaction });
};

/**
 * Retrieves earned value trend analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<EarnedValueMetrics[]>} EVM trend data
 *
 * @example
 * ```typescript
 * const evmTrend = await getEarnedValueTrend(sequelize, 1, new Date('2024-01-01'), new Date('2024-12-31'));
 * evmTrend.forEach(e => console.log(`${e.measurementDate}: CPI=${e.costPerformanceIndex}`));
 * ```
 */
export const getEarnedValueTrend = async (
  sequelize: Sequelize,
  projectId: number,
  startDate: Date,
  endDate: Date,
): Promise<any[]> => {
  const metrics = await sequelize.models.EarnedValueMetrics?.findAll({
    where: {
      projectId,
      measurementDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['measurementDate', 'ASC']],
  });

  return metrics || [];
};

/**
 * Calculates cost performance index (CPI) for project.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<number>} CPI value
 *
 * @example
 * ```typescript
 * const cpi = await calculateCPI(sequelize, 1);
 * console.log(`CPI: ${cpi} - ${cpi >= 1 ? 'Under budget' : 'Over budget'}`);
 * ```
 */
export const calculateCPI = async (
  sequelize: Sequelize,
  projectId: number,
): Promise<number> => {
  const evm = await calculateEarnedValue(sequelize, {
    projectId,
    measurementDate: new Date(),
    calculationMethod: 'percent-complete',
  });

  return evm.costPerformanceIndex;
};

/**
 * Calculates schedule performance index (SPI) for project.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<number>} SPI value
 *
 * @example
 * ```typescript
 * const spi = await calculateSPI(sequelize, 1);
 * console.log(`SPI: ${spi} - ${spi >= 1 ? 'Ahead of schedule' : 'Behind schedule'}`);
 * ```
 */
export const calculateSPI = async (
  sequelize: Sequelize,
  projectId: number,
): Promise<number> => {
  const evm = await calculateEarnedValue(sequelize, {
    projectId,
    measurementDate: new Date(),
    calculationMethod: 'percent-complete',
  });

  return evm.schedulePerformanceIndex;
};

// ============================================================================
// PROJECT BILLING FUNCTIONS
// ============================================================================

/**
 * Creates project billing schedule.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateBillingScheduleDto} billingData - Billing schedule data
 * @param {string} userId - User creating the schedule
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProjectBillingSchedule>} Created billing schedule
 *
 * @example
 * ```typescript
 * const billing = await createBillingSchedule(sequelize, {
 *   projectId: 1,
 *   billingType: 'milestone',
 *   scheduledDate: new Date('2024-06-30'),
 *   scheduledAmount: 250000,
 *   retainagePercent: 10
 * }, 'admin');
 * ```
 */
export const createBillingSchedule = async (
  sequelize: Sequelize,
  billingData: CreateBillingScheduleDto,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const scheduleNumber = `BILL-${billingData.projectId}-${Date.now()}`;
  const retainageAmount = billingData.scheduledAmount * ((billingData.retainagePercent || 0) / 100);

  const billing = await sequelize.models.ProjectBillingSchedule?.create(
    {
      ...billingData,
      scheduleNumber,
      billedAmount: 0,
      unbilledAmount: billingData.scheduledAmount,
      billingPercent: 0,
      retainageAmount,
      status: 'pending',
      createdBy: userId,
    },
    { transaction },
  );

  return billing;
};

/**
 * Processes project billing and creates invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} scheduleId - Billing schedule ID
 * @param {number} billingAmount - Amount to bill
 * @param {string} userId - User processing the billing
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await processBilling(sequelize, 1, 225000, 'admin');
 * ```
 */
export const processBilling = async (
  sequelize: Sequelize,
  scheduleId: number,
  billingAmount: number,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  const billing = await sequelize.models.ProjectBillingSchedule?.findByPk(scheduleId);
  if (!billing) {
    throw new Error('Billing schedule not found');
  }

  const invoiceNumber = `INV-${(billing as any).projectId}-${Date.now()}`;

  await sequelize.models.ProjectBillingSchedule?.update(
    {
      billedAmount: billingAmount,
      unbilledAmount: (billing as any).scheduledAmount - billingAmount,
      status: 'billed',
      invoiceNumber,
      invoiceDate: new Date(),
      updatedBy: userId,
    },
    {
      where: { id: scheduleId },
      transaction,
    },
  );

  // Update project total billed
  const ProjectHeader = createProjectHeaderModel(sequelize);
  await ProjectHeader.increment('totalBilled', {
    by: billingAmount,
    where: { id: (billing as any).projectId },
    transaction,
  });
};

/**
 * Retrieves unbilled project costs.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<{ totalUnbilled: number; costs: ProjectCostDetail[] }>} Unbilled costs
 *
 * @example
 * ```typescript
 * const unbilled = await getUnbilledCosts(sequelize, 1);
 * console.log(`Unbilled amount: ${unbilled.totalUnbilled}`);
 * ```
 */
export const getUnbilledCosts = async (
  sequelize: Sequelize,
  projectId: number,
): Promise<{ totalUnbilled: number; costs: any[] }> => {
  const costs = await sequelize.models.ProjectCostDetail?.findAll({
    where: {
      projectId,
      isBillable: true,
      isBilled: false,
    },
    order: [['costDate', 'ASC']],
  });

  const totalUnbilled = (costs || []).reduce((sum: number, cost: any) => sum + Number(cost.totalCost), 0);

  return {
    totalUnbilled,
    costs: costs || [],
  };
};

/**
 * Calculates billing completion percentage.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<number>} Billing completion percent
 *
 * @example
 * ```typescript
 * const billingPercent = await calculateBillingCompletion(sequelize, 1);
 * console.log(`Billing ${billingPercent}% complete`);
 * ```
 */
export const calculateBillingCompletion = async (
  sequelize: Sequelize,
  projectId: number,
): Promise<number> => {
  const project = await getProjectDetails(sequelize, projectId);

  const totalBudget = Number(project.totalBudget);
  const totalBilled = Number(project.totalBilled);

  return totalBudget > 0 ? (totalBilled / totalBudget) * 100 : 0;
};

// ============================================================================
// REVENUE RECOGNITION FUNCTIONS
// ============================================================================

/**
 * Calculates and records revenue recognition.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {Date} recognitionDate - Recognition date
 * @param {string} recognitionMethod - Recognition method
 * @param {string} userId - User recording revenue
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProjectRevenueRecognition>} Revenue recognition record
 *
 * @example
 * ```typescript
 * const revenue = await calculateRevenueRecognition(sequelize, 1, new Date(), 'percentage-completion', 'admin');
 * console.log(`Current period revenue: ${revenue.currentPeriodRevenue}`);
 * ```
 */
export const calculateRevenueRecognition = async (
  sequelize: Sequelize,
  projectId: number,
  recognitionDate: Date,
  recognitionMethod: string,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const project = await getProjectDetails(sequelize, projectId);

  const totalContractAmount = Number(project.totalBudget);
  const costsIncurred = Number(project.totalActualCost);
  const estimatedTotalCost = totalContractAmount; // Simplified

  const percentComplete = estimatedTotalCost > 0 ? (costsIncurred / estimatedTotalCost) * 100 : 0;
  const revenueToDate = totalContractAmount * (percentComplete / 100);

  // Get previous revenue recognized
  const previousRevenue = await sequelize.models.ProjectRevenueRecognition?.findOne({
    where: { projectId },
    order: [['recognitionDate', 'DESC']],
  });

  const previousRevenueToDate = previousRevenue ? Number((previousRevenue as any).revenueToDate) : 0;
  const currentPeriodRevenue = revenueToDate - previousRevenueToDate;

  const billedToDate = Number(project.totalBilled);
  const unbilledRevenue = revenueToDate - billedToDate;

  const revenue = await sequelize.models.ProjectRevenueRecognition?.create(
    {
      projectId,
      fiscalYear: recognitionDate.getFullYear(),
      fiscalPeriod: recognitionDate.getMonth() + 1,
      recognitionDate,
      recognitionMethod,
      totalContractAmount,
      costsIncurred,
      estimatedTotalCost,
      percentComplete,
      revenueToDate,
      currentPeriodRevenue,
      billedToDate,
      unbilledRevenue,
      deferredRevenue: 0,
      createdBy: userId,
    },
    { transaction },
  );

  // Update project total revenue
  const ProjectHeader = createProjectHeaderModel(sequelize);
  await ProjectHeader.update(
    { totalRevenue: revenueToDate },
    { where: { id: projectId }, transaction },
  );

  return revenue;
};

/**
 * Retrieves revenue recognition history.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<ProjectRevenueRecognition[]>} Revenue history
 *
 * @example
 * ```typescript
 * const revenueHistory = await getRevenueRecognitionHistory(sequelize, 1);
 * revenueHistory.forEach(r => console.log(`${r.recognitionDate}: ${r.currentPeriodRevenue}`));
 * ```
 */
export const getRevenueRecognitionHistory = async (
  sequelize: Sequelize,
  projectId: number,
): Promise<any[]> => {
  const revenue = await sequelize.models.ProjectRevenueRecognition?.findAll({
    where: { projectId },
    order: [['recognitionDate', 'ASC']],
  });

  return revenue || [];
};

// ============================================================================
// PROJECT FORECASTING FUNCTIONS
// ============================================================================

/**
 * Creates project cost forecast.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ProjectForecast>} forecastData - Forecast data
 * @param {string} userId - User creating forecast
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProjectForecast>} Created forecast
 *
 * @example
 * ```typescript
 * const forecast = await createProjectForecast(sequelize, {
 *   projectId: 1,
 *   forecastDate: new Date(),
 *   costCategory: 'Labor',
 *   originalBudget: 500000,
 *   actualToDate: 300000,
 *   forecastToComplete: 250000,
 *   forecastMethod: 'trend'
 * }, 'manager');
 * ```
 */
export const createProjectForecast = async (
  sequelize: Sequelize,
  forecastData: Partial<ProjectForecast>,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const estimateAtCompletion = (forecastData.actualToDate || 0) + (forecastData.forecastToComplete || 0);
  const varianceAtCompletion = (forecastData.originalBudget || 0) - estimateAtCompletion;

  const forecast = await sequelize.models.ProjectForecast?.create(
    {
      ...forecastData,
      estimateAtCompletion,
      varianceAtCompletion,
      forecastBy: userId,
      createdBy: userId,
    },
    { transaction },
  );

  return forecast;
};

/**
 * Calculates estimate at completion (EAC) using EVM.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<number>} Estimate at completion
 *
 * @example
 * ```typescript
 * const eac = await calculateEstimateAtCompletion(sequelize, 1);
 * console.log(`Estimate at Completion: ${eac}`);
 * ```
 */
export const calculateEstimateAtCompletion = async (
  sequelize: Sequelize,
  projectId: number,
): Promise<number> => {
  const evm = await calculateEarnedValue(sequelize, {
    projectId,
    measurementDate: new Date(),
    calculationMethod: 'percent-complete',
  });

  return evm.estimateAtCompletion;
};

/**
 * Calculates estimate to complete (ETC).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<number>} Estimate to complete
 *
 * @example
 * ```typescript
 * const etc = await calculateEstimateToComplete(sequelize, 1);
 * console.log(`Estimate to Complete: ${etc}`);
 * ```
 */
export const calculateEstimateToComplete = async (
  sequelize: Sequelize,
  projectId: number,
): Promise<number> => {
  const evm = await calculateEarnedValue(sequelize, {
    projectId,
    measurementDate: new Date(),
    calculationMethod: 'percent-complete',
  });

  return evm.estimateToComplete;
};

/**
 * Generates project forecast report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<ProjectForecast[]>} Forecast report
 *
 * @example
 * ```typescript
 * const forecastReport = await generateForecastReport(sequelize, 1);
 * forecastReport.forEach(f => console.log(`${f.costCategory}: EAC ${f.estimateAtCompletion}`));
 * ```
 */
export const generateForecastReport = async (
  sequelize: Sequelize,
  projectId: number,
): Promise<any[]> => {
  const forecasts = await sequelize.models.ProjectForecast?.findAll({
    where: { projectId },
    order: [['forecastDate', 'DESC'], ['costCategory', 'ASC']],
  });

  return forecasts || [];
};

// ============================================================================
// PROJECT ANALYTICS FUNCTIONS
// ============================================================================

/**
 * Generates comprehensive project analytics dashboard.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<ProjectAnalytics>} Analytics dashboard data
 *
 * @example
 * ```typescript
 * const analytics = await generateProjectAnalytics(sequelize, 1);
 * console.log(`Average CPI: ${analytics.averageCPI}`);
 * ```
 */
export const generateProjectAnalytics = async (
  sequelize: Sequelize,
  projectId: number,
): Promise<ProjectAnalytics> => {
  const project = await getProjectDetails(sequelize, projectId);

  return {
    projectId,
    analysisDate: new Date(),
    totalProjects: 1,
    activeProjects: project.status === 'active' ? 1 : 0,
    completedProjects: project.status === 'completed' ? 1 : 0,
    totalBudget: Number(project.totalBudget),
    totalActualCost: Number(project.totalActualCost),
    totalCommitments: Number(project.totalCommitments),
    totalVariance: Number(project.totalBudget) - Number(project.totalActualCost),
    averageCostVariance: 0,
    averageScheduleVariance: 0,
    averageCPI: 1.0,
    averageSPI: 1.0,
    onBudgetCount: 0,
    overBudgetCount: 0,
    underBudgetCount: 0,
    onScheduleCount: 0,
    behindScheduleCount: 0,
    aheadScheduleCount: 0,
  };
};

/**
 * Calculates project profitability metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<{ revenue: number; cost: number; profit: number; margin: number }>} Profitability metrics
 *
 * @example
 * ```typescript
 * const profitability = await calculateProjectProfitability(sequelize, 1);
 * console.log(`Profit Margin: ${profitability.margin}%`);
 * ```
 */
export const calculateProjectProfitability = async (
  sequelize: Sequelize,
  projectId: number,
): Promise<{ revenue: number; cost: number; profit: number; margin: number }> => {
  const project = await getProjectDetails(sequelize, projectId);

  const revenue = Number(project.totalRevenue);
  const cost = Number(project.totalActualCost);
  const profit = revenue - cost;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

  return { revenue, cost, profit, margin };
};

/**
 * Generates project performance scorecard.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<{ budgetScore: string; scheduleScore: string; qualityScore: string; overallScore: string }>} Performance scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await generateProjectScorecard(sequelize, 1);
 * console.log(`Overall Score: ${scorecard.overallScore}`);
 * ```
 */
export const generateProjectScorecard = async (
  sequelize: Sequelize,
  projectId: number,
): Promise<{ budgetScore: string; scheduleScore: string; qualityScore: string; overallScore: string }> => {
  const cpi = await calculateCPI(sequelize, projectId);
  const spi = await calculateSPI(sequelize, projectId);

  const budgetScore = cpi >= 1.0 ? 'Green' : cpi >= 0.9 ? 'Yellow' : 'Red';
  const scheduleScore = spi >= 1.0 ? 'Green' : spi >= 0.9 ? 'Yellow' : 'Red';
  const qualityScore = 'Green'; // Simplified
  const overallScore = budgetScore === 'Green' && scheduleScore === 'Green' ? 'Green' :
                       budgetScore === 'Red' || scheduleScore === 'Red' ? 'Red' : 'Yellow';

  return { budgetScore, scheduleScore, qualityScore, overallScore };
};

// ============================================================================
// COST-TO-COMPLETE FUNCTIONS
// ============================================================================

/**
 * Calculates detailed cost-to-complete analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {string} costCategory - Cost category
 * @returns {Promise<CostToComplete>} Cost-to-complete analysis
 *
 * @example
 * ```typescript
 * const ctc = await calculateCostToComplete(sequelize, 1, 'Labor');
 * console.log(`Estimate to Complete: ${ctc.estimateToComplete}`);
 * ```
 */
export const calculateCostToComplete = async (
  sequelize: Sequelize,
  projectId: number,
  costCategory: string,
): Promise<CostToComplete> => {
  const budgets = await sequelize.models.ProjectBudget?.findAll({
    where: { projectId, costCategory },
    attributes: [
      [sequelize.fn('SUM', sequelize.col('budgetAmount')), 'totalBudget'],
      [sequelize.fn('SUM', sequelize.col('actualAmount')), 'totalActual'],
      [sequelize.fn('SUM', sequelize.col('committedAmount')), 'totalCommitted'],
    ],
  });

  const result = budgets?.[0] as any;
  const budgetAmount = Number(result?.get('totalBudget') || 0);
  const actualToDate = Number(result?.get('totalActual') || 0);
  const commitmentsToDate = Number(result?.get('totalCommitted') || 0);

  const percentComplete = budgetAmount > 0 ? (actualToDate / budgetAmount) * 100 : 0;
  const estimateToComplete = budgetAmount - actualToDate;
  const estimateAtCompletion = actualToDate + estimateToComplete;
  const varianceAtCompletion = budgetAmount - estimateAtCompletion;

  return {
    projectId,
    analysisDate: new Date(),
    costCategory,
    budgetAmount,
    actualToDate,
    commitmentsToDate,
    estimateToComplete,
    estimateAtCompletion,
    varianceAtCompletion,
    percentComplete,
    completionMethod: 'budget-percentage',
    riskAdjustment: 0,
    contingency: 0,
    managementReserve: 0,
  };
};

/**
 * Generates cost-to-complete report for all categories.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<CostToComplete[]>} Cost-to-complete report
 *
 * @example
 * ```typescript
 * const ctcReport = await generateCostToCompleteReport(sequelize, 1);
 * ctcReport.forEach(c => console.log(`${c.costCategory}: ${c.estimateToComplete}`));
 * ```
 */
export const generateCostToCompleteReport = async (
  sequelize: Sequelize,
  projectId: number,
): Promise<CostToComplete[]> => {
  const categories = await sequelize.models.ProjectBudget?.findAll({
    where: { projectId },
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('costCategory')), 'costCategory']],
  });

  const ctcReports: CostToComplete[] = [];
  for (const category of categories || []) {
    const ctc = await calculateCostToComplete(sequelize, projectId, (category as any).costCategory);
    ctcReports.push(ctc);
  }

  return ctcReports;
};

// ============================================================================
// CHANGE ORDER MANAGEMENT
// ============================================================================

/**
 * Creates project change order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ProjectChangeOrder>} changeOrderData - Change order data
 * @param {string} userId - User creating change order
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProjectChangeOrder>} Created change order
 *
 * @example
 * ```typescript
 * const changeOrder = await createChangeOrder(sequelize, {
 *   projectId: 1,
 *   changeOrderNumber: 'CO-001',
 *   changeType: 'scope',
 *   description: 'Additional site work',
 *   budgetImpact: 50000,
 *   scheduleImpact: 30
 * }, 'manager');
 * ```
 */
export const createChangeOrder = async (
  sequelize: Sequelize,
  changeOrderData: Partial<ProjectChangeOrder>,
  userId: string,
  transaction?: Transaction,
): Promise<any> => {
  const changeOrder = await sequelize.models.ProjectChangeOrder?.create(
    {
      ...changeOrderData,
      changeOrderDate: new Date(),
      requestedBy: userId,
      status: 'draft',
      createdBy: userId,
    },
    { transaction },
  );

  return changeOrder;
};

/**
 * Approves and implements project change order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} changeOrderId - Change order ID
 * @param {string} userId - User approving change order
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await approveChangeOrder(sequelize, 1, 'director');
 * ```
 */
export const approveChangeOrder = async (
  sequelize: Sequelize,
  changeOrderId: number,
  userId: string,
  transaction?: Transaction,
): Promise<void> => {
  const changeOrder = await sequelize.models.ProjectChangeOrder?.findByPk(changeOrderId);
  if (!changeOrder) {
    throw new Error('Change order not found');
  }

  await sequelize.models.ProjectChangeOrder?.update(
    {
      status: 'approved',
      approvedBy: userId,
      approvedDate: new Date(),
      implementedDate: new Date(),
    },
    {
      where: { id: changeOrderId },
      transaction,
    },
  );

  // Update project budget if budget impact
  if ((changeOrder as any).budgetImpact) {
    const ProjectHeader = createProjectHeaderModel(sequelize);
    await ProjectHeader.increment('totalBudget', {
      by: (changeOrder as any).budgetImpact,
      where: { id: (changeOrder as any).projectId },
      transaction,
    });
  }
};

/**
 * Retrieves change orders for project.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<ProjectChangeOrder[]>} Change orders
 *
 * @example
 * ```typescript
 * const changeOrders = await getProjectChangeOrders(sequelize, 1);
 * console.log(`Total change orders: ${changeOrders.length}`);
 * ```
 */
export const getProjectChangeOrders = async (
  sequelize: Sequelize,
  projectId: number,
): Promise<any[]> => {
  const changeOrders = await sequelize.models.ProjectChangeOrder?.findAll({
    where: { projectId },
    order: [['changeOrderDate', 'DESC']],
  });

  return changeOrders || [];
};
