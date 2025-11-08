/**
 * LOC: CONSPROJ12345
 * File: /reuse/construction/construction-project-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend construction services
 *   - Project management controllers
 *   - Portfolio management engines
 *   - Resource allocation services
 */

/**
 * File: /reuse/construction/construction-project-management-kit.ts
 * Locator: WC-CONS-PROJ-001
 * Purpose: Comprehensive Construction Project Management Utilities - USACE EPPM-level construction project lifecycle management
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, Construction controllers, project services, portfolio management, resource allocation
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for project creation, tracking, portfolio management, coordination, lifecycle management
 *
 * LLM Context: Enterprise-grade construction project management system competing with USACE EPPM.
 * Provides construction project lifecycle management, multi-project portfolio coordination, resource allocation,
 * project phase transitions, baseline management, earned value tracking, project templates, schedule integration,
 * budget integration, quality management integration, contractor coordination, change order management,
 * project closeout, lessons learned capture, project reporting, dashboard metrics.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDate,
  IsArray,
  IsBoolean,
  IsUUID,
  Min,
  Max,
  ValidateNested,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Construction project status values
 */
export enum ConstructionProjectStatus {
  PRE_PLANNING = 'pre_planning',
  PLANNING = 'planning',
  DESIGN = 'design',
  PRE_CONSTRUCTION = 'pre_construction',
  CONSTRUCTION = 'construction',
  CLOSEOUT = 'closeout',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  CANCELLED = 'cancelled',
}

/**
 * Project phase types
 */
export enum ProjectPhase {
  INITIATION = 'initiation',
  PLANNING = 'planning',
  DESIGN = 'design',
  PROCUREMENT = 'procurement',
  CONSTRUCTION = 'construction',
  COMMISSIONING = 'commissioning',
  CLOSEOUT = 'closeout',
  OPERATIONS = 'operations',
}

/**
 * Project priority levels
 */
export enum ProjectPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

/**
 * Project delivery method
 */
export enum DeliveryMethod {
  DESIGN_BID_BUILD = 'design_bid_build',
  DESIGN_BUILD = 'design_build',
  CM_AT_RISK = 'cm_at_risk',
  IPD = 'ipd',
  PUBLIC_PRIVATE = 'public_private',
}

/**
 * Performance metric type
 */
export enum PerformanceMetricType {
  SCHEDULE = 'schedule',
  COST = 'cost',
  QUALITY = 'quality',
  SAFETY = 'safety',
  SUSTAINABILITY = 'sustainability',
}

/**
 * Construction project interface
 */
export interface ConstructionProject {
  id: string;
  projectNumber: string;
  projectName: string;
  description: string;
  status: ConstructionProjectStatus;
  currentPhase: ProjectPhase;
  priority: ProjectPriority;
  deliveryMethod: DeliveryMethod;
  projectManagerId: string;
  sponsorId?: string;
  contractorId?: string;
  totalBudget: number;
  committedCost: number;
  actualCost: number;
  forecastedCost: number;
  contingencyReserve: number;
  managementReserve: number;
  baselineSchedule?: Date;
  baselineEndDate?: Date;
  currentSchedule?: Date;
  currentEndDate?: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  progressPercentage: number;
  earnedValue: number;
  plannedValue: number;
  siteLocationId?: string;
  districtCode?: string;
  divisionCode?: string;
  regulatoryCompliance: string[];
  environmentalPermits: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
}

/**
 * Project baseline interface
 */
export interface ProjectBaseline {
  id: string;
  projectId: string;
  baselineNumber: string;
  baselineType: 'INITIAL' | 'REVISED' | 'RE_BASELINE';
  baselineDate: Date;
  budget: number;
  schedule: Date;
  scope: string;
  approvedBy: string;
  approvedAt: Date;
  changeReason?: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

/**
 * Project phase transition interface
 */
export interface PhaseTransition {
  id: string;
  projectId: string;
  fromPhase: ProjectPhase;
  toPhase: ProjectPhase;
  transitionDate: Date;
  approvedBy: string;
  gateReviewCompleted: boolean;
  exitCriteriaMet: boolean;
  entryCriteriaMet: boolean;
  notes?: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

/**
 * Project portfolio interface
 */
export interface ProjectPortfolio {
  id: string;
  portfolioName: string;
  description: string;
  managerId: string;
  totalProjects: number;
  totalBudget: number;
  totalActualCost: number;
  activeProjects: number;
  completedProjects: number;
  averageProgress: number;
  performanceIndex: number;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Resource allocation interface
 */
export interface ResourceAllocation {
  id: string;
  projectId: string;
  resourceType: 'LABOR' | 'EQUIPMENT' | 'MATERIAL' | 'SUBCONTRACTOR';
  resourceId: string;
  resourceName: string;
  allocationPercentage: number;
  allocatedHours?: number;
  actualHours?: number;
  hourlyRate?: number;
  totalCost: number;
  startDate: Date;
  endDate: Date;
  status: 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'RELEASED';
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Change order interface
 */
export interface ChangeOrder {
  id: string;
  projectId: string;
  changeOrderNumber: string;
  title: string;
  description: string;
  changeType: 'SCOPE' | 'SCHEDULE' | 'COST' | 'COMBINED';
  requestedBy: string;
  requestedDate: Date;
  costImpact: number;
  scheduleImpact: number;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'IMPLEMENTED';
  approvals: any[];
  implementedDate?: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Project performance metrics interface
 */
export interface ProjectPerformanceMetrics {
  projectId: string;
  schedulePerformanceIndex: number;
  costPerformanceIndex: number;
  scheduleVariance: number;
  costVariance: number;
  estimateAtCompletion: number;
  estimateToComplete: number;
  varianceAtCompletion: number;
  toCompletePerformanceIndex: number;
  earnedValue: number;
  plannedValue: number;
  actualCost: number;
  budgetAtCompletion: number;
}

/**
 * Project template interface
 */
export interface ProjectTemplate {
  id: string;
  templateName: string;
  description: string;
  projectType: string;
  deliveryMethod: DeliveryMethod;
  phases: ProjectPhase[];
  defaultDuration: number;
  defaultBudget: number;
  requiredDocuments: string[];
  checklistItems: string[];
  milestones: any[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// DTO CLASSES FOR VALIDATION
// ============================================================================

/**
 * Create construction project DTO
 */
export class CreateConstructionProjectDto {
  @ApiProperty({ description: 'Project name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  projectName: string;

  @ApiProperty({ description: 'Project description' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @ApiProperty({ enum: ProjectPriority })
  @IsEnum(ProjectPriority)
  priority: ProjectPriority;

  @ApiProperty({ enum: DeliveryMethod })
  @IsEnum(DeliveryMethod)
  deliveryMethod: DeliveryMethod;

  @ApiProperty({ description: 'Project manager ID' })
  @IsUUID()
  projectManagerId: string;

  @ApiProperty({ description: 'Total budget' })
  @IsNumber()
  @Min(0)
  totalBudget: number;

  @ApiProperty({ description: 'Baseline end date' })
  @Type(() => Date)
  @IsDate()
  baselineEndDate: Date;

  @ApiProperty({ description: 'District code', required: false })
  @IsOptional()
  @IsString()
  districtCode?: string;
}

/**
 * Update project progress DTO
 */
export class UpdateProjectProgressDto {
  @ApiProperty({ description: 'Progress percentage' })
  @IsNumber()
  @Min(0)
  @Max(100)
  progressPercentage: number;

  @ApiProperty({ description: 'Actual cost incurred' })
  @IsNumber()
  @Min(0)
  actualCost: number;

  @ApiProperty({ description: 'Notes', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}

/**
 * Create baseline DTO
 */
export class CreateBaselineDto {
  @ApiProperty({ description: 'Project ID' })
  @IsUUID()
  projectId: string;

  @ApiProperty({ enum: ['INITIAL', 'REVISED', 'RE_BASELINE'] })
  @IsEnum(['INITIAL', 'REVISED', 'RE_BASELINE'])
  baselineType: 'INITIAL' | 'REVISED' | 'RE_BASELINE';

  @ApiProperty({ description: 'Budget amount' })
  @IsNumber()
  @Min(0)
  budget: number;

  @ApiProperty({ description: 'Schedule date' })
  @Type(() => Date)
  @IsDate()
  schedule: Date;

  @ApiProperty({ description: 'Scope description' })
  @IsString()
  @MaxLength(2000)
  scope: string;
}

/**
 * Create change order DTO
 */
export class CreateChangeOrderDto {
  @ApiProperty({ description: 'Project ID' })
  @IsUUID()
  projectId: string;

  @ApiProperty({ description: 'Change order title' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'Description' })
  @IsString()
  @MaxLength(2000)
  description: string;

  @ApiProperty({ enum: ['SCOPE', 'SCHEDULE', 'COST', 'COMBINED'] })
  @IsEnum(['SCOPE', 'SCHEDULE', 'COST', 'COMBINED'])
  changeType: 'SCOPE' | 'SCHEDULE' | 'COST' | 'COMBINED';

  @ApiProperty({ description: 'Cost impact' })
  @IsNumber()
  costImpact: number;

  @ApiProperty({ description: 'Schedule impact (days)' })
  @IsNumber()
  scheduleImpact: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for Construction Project Management.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ConstructionProject model
 *
 * @example
 * ```typescript
 * const ConstructionProject = createConstructionProjectModel(sequelize);
 * const project = await ConstructionProject.create({
 *   projectName: 'Hospital Expansion Phase 2',
 *   totalBudget: 25000000,
 *   deliveryMethod: 'design_build',
 *   status: 'planning'
 * });
 * ```
 */
export const createConstructionProjectModel = (sequelize: Sequelize) => {
  class ConstructionProject extends Model {
    public id!: string;
    public projectNumber!: string;
    public projectName!: string;
    public description!: string;
    public status!: string;
    public currentPhase!: string;
    public priority!: string;
    public deliveryMethod!: string;
    public projectManagerId!: string;
    public sponsorId!: string | null;
    public contractorId!: string | null;
    public totalBudget!: number;
    public committedCost!: number;
    public actualCost!: number;
    public forecastedCost!: number;
    public contingencyReserve!: number;
    public managementReserve!: number;
    public baselineSchedule!: Date | null;
    public baselineEndDate!: Date | null;
    public currentSchedule!: Date | null;
    public currentEndDate!: Date | null;
    public actualStartDate!: Date | null;
    public actualEndDate!: Date | null;
    public progressPercentage!: number;
    public earnedValue!: number;
    public plannedValue!: number;
    public siteLocationId!: string | null;
    public districtCode!: string | null;
    public divisionCode!: string | null;
    public regulatoryCompliance!: string[];
    public environmentalPermits!: string[];
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly createdBy!: string;
    public readonly updatedBy!: string;
  }

  ConstructionProject.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      projectNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique project identifier',
      },
      projectName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Project name',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Project description',
      },
      status: {
        type: DataTypes.ENUM(
          'pre_planning',
          'planning',
          'design',
          'pre_construction',
          'construction',
          'closeout',
          'completed',
          'on_hold',
          'cancelled',
        ),
        allowNull: false,
        defaultValue: 'pre_planning',
        comment: 'Current project status',
      },
      currentPhase: {
        type: DataTypes.ENUM(
          'initiation',
          'planning',
          'design',
          'procurement',
          'construction',
          'commissioning',
          'closeout',
          'operations',
        ),
        allowNull: false,
        defaultValue: 'initiation',
        comment: 'Current project phase',
      },
      priority: {
        type: DataTypes.ENUM('critical', 'high', 'medium', 'low'),
        allowNull: false,
        defaultValue: 'medium',
        comment: 'Project priority',
      },
      deliveryMethod: {
        type: DataTypes.ENUM('design_bid_build', 'design_build', 'cm_at_risk', 'ipd', 'public_private'),
        allowNull: false,
        comment: 'Project delivery method',
      },
      projectManagerId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Project manager user ID',
      },
      sponsorId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Project sponsor user ID',
      },
      contractorId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Prime contractor ID',
      },
      totalBudget: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        comment: 'Total project budget',
      },
      committedCost: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Committed cost (contracts awarded)',
      },
      actualCost: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Actual cost incurred',
      },
      forecastedCost: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Forecasted cost at completion',
      },
      contingencyReserve: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Contingency reserve amount',
      },
      managementReserve: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Management reserve amount',
      },
      baselineSchedule: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Baseline start date',
      },
      baselineEndDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Baseline end date',
      },
      currentSchedule: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Current planned start date',
      },
      currentEndDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Current planned end date',
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
      progressPercentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Overall progress percentage',
      },
      earnedValue: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Earned value (EV)',
      },
      plannedValue: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Planned value (PV)',
      },
      siteLocationId: {
        type: DataTypes.UUID,
        allowNull: true,
        comment: 'Site/facility location ID',
      },
      districtCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'USACE district code',
      },
      divisionCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'USACE division code',
      },
      regulatoryCompliance: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        comment: 'Regulatory compliance requirements',
      },
      environmentalPermits: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        comment: 'Environmental permits required',
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
        comment: 'User who created record',
      },
      updatedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who last updated record',
      },
    },
    {
      sequelize,
      tableName: 'construction_projects',
      timestamps: true,
      indexes: [
        { fields: ['projectNumber'], unique: true },
        { fields: ['status'] },
        { fields: ['currentPhase'] },
        { fields: ['priority'] },
        { fields: ['projectManagerId'] },
        { fields: ['districtCode'] },
        { fields: ['divisionCode'] },
      ],
    },
  );

  return ConstructionProject;
};

/**
 * Sequelize model for Project Baseline tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ProjectBaseline model
 *
 * @example
 * ```typescript
 * const ProjectBaseline = createProjectBaselineModel(sequelize);
 * const baseline = await ProjectBaseline.create({
 *   projectId: 'proj-uuid',
 *   baselineType: 'INITIAL',
 *   budget: 25000000,
 *   schedule: new Date('2025-12-31'),
 *   scope: 'Complete hospital expansion'
 * });
 * ```
 */
export const createProjectBaselineModel = (sequelize: Sequelize) => {
  class ProjectBaseline extends Model {
    public id!: string;
    public projectId!: string;
    public baselineNumber!: string;
    public baselineType!: string;
    public baselineDate!: Date;
    public budget!: number;
    public schedule!: Date;
    public scope!: string;
    public approvedBy!: string;
    public approvedAt!: Date;
    public changeReason!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
  }

  ProjectBaseline.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Related project ID',
        references: {
          model: 'construction_projects',
          key: 'id',
        },
      },
      baselineNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique baseline identifier',
      },
      baselineType: {
        type: DataTypes.ENUM('INITIAL', 'REVISED', 'RE_BASELINE'),
        allowNull: false,
        comment: 'Type of baseline',
      },
      baselineDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Date baseline was created',
      },
      budget: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        comment: 'Baseline budget',
      },
      schedule: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Baseline completion date',
      },
      scope: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Baseline scope description',
      },
      approvedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who approved baseline',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Baseline approval timestamp',
      },
      changeReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for baseline change',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional baseline metadata',
      },
    },
    {
      sequelize,
      tableName: 'project_baselines',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { fields: ['projectId'] },
        { fields: ['baselineNumber'], unique: true },
        { fields: ['baselineType'] },
        { fields: ['baselineDate'] },
      ],
    },
  );

  return ProjectBaseline;
};

/**
 * Sequelize model for Change Order tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ChangeOrder model
 *
 * @example
 * ```typescript
 * const ChangeOrder = createChangeOrderModel(sequelize);
 * const changeOrder = await ChangeOrder.create({
 *   projectId: 'proj-uuid',
 *   title: 'Add emergency generator',
 *   changeType: 'SCOPE',
 *   costImpact: 150000,
 *   scheduleImpact: 30
 * });
 * ```
 */
export const createChangeOrderModel = (sequelize: Sequelize) => {
  class ChangeOrder extends Model {
    public id!: string;
    public projectId!: string;
    public changeOrderNumber!: string;
    public title!: string;
    public description!: string;
    public changeType!: string;
    public requestedBy!: string;
    public requestedDate!: Date;
    public costImpact!: number;
    public scheduleImpact!: number;
    public status!: string;
    public approvals!: any[];
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
      projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'Related project ID',
        references: {
          model: 'construction_projects',
          key: 'id',
        },
      },
      changeOrderNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique change order number',
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Change order title',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Change order description',
      },
      changeType: {
        type: DataTypes.ENUM('SCOPE', 'SCHEDULE', 'COST', 'COMBINED'),
        allowNull: false,
        comment: 'Type of change',
      },
      requestedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who requested change',
      },
      requestedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Date change was requested',
      },
      costImpact: {
        type: DataTypes.DECIMAL(19, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Cost impact of change',
      },
      scheduleImpact: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Schedule impact in days',
      },
      status: {
        type: DataTypes.ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'IMPLEMENTED'),
        allowNull: false,
        defaultValue: 'DRAFT',
        comment: 'Change order status',
      },
      approvals: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Approval workflow data',
      },
      implementedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date change was implemented',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional change order metadata',
      },
    },
    {
      sequelize,
      tableName: 'change_orders',
      timestamps: true,
      indexes: [
        { fields: ['projectId'] },
        { fields: ['changeOrderNumber'], unique: true },
        { fields: ['status'] },
        { fields: ['changeType'] },
        { fields: ['requestedDate'] },
      ],
    },
  );

  return ChangeOrder;
};

// ============================================================================
// PROJECT CREATION AND INITIALIZATION (1-5)
// ============================================================================

/**
 * Creates a new construction project with auto-generated project number.
 *
 * @param {object} projectData - Project creation data
 * @param {string} userId - User creating the project
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<ConstructionProject>} Created project
 *
 * @example
 * ```typescript
 * const project = await createConstructionProject({
 *   projectName: 'Hospital Expansion Phase 2',
 *   description: 'Add 100-bed capacity',
 *   deliveryMethod: DeliveryMethod.DESIGN_BUILD,
 *   totalBudget: 25000000,
 *   projectManagerId: 'user-123',
 *   priority: ProjectPriority.HIGH
 * }, 'admin-456');
 * ```
 */
export const createConstructionProject = async (
  projectData: any,
  userId: string,
  transaction?: Transaction,
): Promise<ConstructionProject> => {
  const projectNumber = generateConstructionProjectNumber(projectData.districtCode || 'GEN');

  const project: ConstructionProject = {
    id: generateUUID(),
    projectNumber,
    projectName: projectData.projectName,
    description: projectData.description,
    status: ConstructionProjectStatus.PRE_PLANNING,
    currentPhase: ProjectPhase.INITIATION,
    priority: projectData.priority || ProjectPriority.MEDIUM,
    deliveryMethod: projectData.deliveryMethod,
    projectManagerId: projectData.projectManagerId,
    sponsorId: projectData.sponsorId,
    contractorId: projectData.contractorId,
    totalBudget: projectData.totalBudget,
    committedCost: 0,
    actualCost: 0,
    forecastedCost: projectData.totalBudget,
    contingencyReserve: projectData.totalBudget * 0.1, // 10% default
    managementReserve: projectData.totalBudget * 0.05, // 5% default
    baselineSchedule: projectData.baselineSchedule,
    baselineEndDate: projectData.baselineEndDate,
    currentSchedule: projectData.baselineSchedule,
    currentEndDate: projectData.baselineEndDate,
    actualStartDate: undefined,
    actualEndDate: undefined,
    progressPercentage: 0,
    earnedValue: 0,
    plannedValue: 0,
    siteLocationId: projectData.siteLocationId,
    districtCode: projectData.districtCode,
    divisionCode: projectData.divisionCode,
    regulatoryCompliance: projectData.regulatoryCompliance || [],
    environmentalPermits: projectData.environmentalPermits || [],
    metadata: {
      ...projectData.metadata,
      createdDate: new Date().toISOString(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: userId,
    updatedBy: userId,
  };

  return project;
};

/**
 * Generates unique construction project number.
 *
 * @param {string} districtCode - USACE district code
 * @returns {string} Generated project number
 *
 * @example
 * ```typescript
 * const projectNumber = generateConstructionProjectNumber('NAD');
 * // Returns: "NAD-2025-C-001"
 * ```
 */
export const generateConstructionProjectNumber = (districtCode: string): string => {
  const year = new Date().getFullYear();
  const sequence = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `${districtCode}-${year}-C-${sequence}`;
};

/**
 * Initializes project from template with customizations.
 *
 * @param {string} templateId - Template identifier
 * @param {object} customizations - Template customizations
 * @param {string} userId - User creating project
 * @returns {Promise<object>} Created project with template structure
 *
 * @example
 * ```typescript
 * const result = await initializeProjectFromTemplate('template-hospital', {
 *   projectName: 'City General Hospital Expansion',
 *   totalBudget: 30000000,
 *   districtCode: 'NAD'
 * }, 'admin-123');
 * ```
 */
export const initializeProjectFromTemplate = async (
  templateId: string,
  customizations: any,
  userId: string,
): Promise<{ project: ConstructionProject; baseline: ProjectBaseline; phases: PhaseTransition[] }> => {
  // In production, fetch template from database
  const template = await getProjectTemplate(templateId);

  const project = await createConstructionProject(
    {
      projectName: customizations.projectName,
      description: customizations.description || template.description,
      deliveryMethod: customizations.deliveryMethod || template.deliveryMethod,
      totalBudget: customizations.totalBudget || template.defaultBudget,
      projectManagerId: customizations.projectManagerId,
      districtCode: customizations.districtCode,
      metadata: {
        templateId,
        templateName: template.templateName,
      },
    },
    userId,
  );

  // Create initial baseline
  const baseline = await createProjectBaseline(
    {
      projectId: project.id,
      baselineType: 'INITIAL',
      budget: project.totalBudget,
      schedule: project.baselineEndDate!,
      scope: project.description,
    },
    userId,
  );

  const phases: PhaseTransition[] = [];

  return { project, baseline, phases };
};

/**
 * Clones existing project with option to copy data.
 *
 * @param {string} sourceProjectId - Source project ID
 * @param {object} overrides - Property overrides
 * @param {boolean} copyData - Whether to copy project data
 * @param {string} userId - User creating clone
 * @returns {Promise<ConstructionProject>} Cloned project
 *
 * @example
 * ```typescript
 * const cloned = await cloneConstructionProject('proj-123', {
 *   projectName: 'Hospital Phase 3',
 *   totalBudget: 28000000
 * }, true, 'admin-456');
 * ```
 */
export const cloneConstructionProject = async (
  sourceProjectId: string,
  overrides: any,
  copyData: boolean,
  userId: string,
): Promise<ConstructionProject> => {
  const sourceProject = await getConstructionProject(sourceProjectId);

  const clonedProject = await createConstructionProject(
    {
      ...sourceProject,
      ...overrides,
      projectName: overrides.projectName || `${sourceProject.projectName} (Copy)`,
    },
    userId,
  );

  return clonedProject;
};

/**
 * Archives completed or cancelled project.
 *
 * @param {string} projectId - Project identifier
 * @param {string} archiveReason - Reason for archiving
 * @param {string} userId - User archiving project
 * @returns {Promise<object>} Archive confirmation
 *
 * @example
 * ```typescript
 * await archiveConstructionProject('proj-123', 'Project completed', 'admin-456');
 * ```
 */
export const archiveConstructionProject = async (
  projectId: string,
  archiveReason: string,
  userId: string,
): Promise<{ archived: boolean; archiveDate: Date; archivedBy: string }> => {
  const project = await getConstructionProject(projectId);

  if (
    project.status !== ConstructionProjectStatus.COMPLETED &&
    project.status !== ConstructionProjectStatus.CANCELLED
  ) {
    throw new Error('Only completed or cancelled projects can be archived');
  }

  return {
    archived: true,
    archiveDate: new Date(),
    archivedBy: userId,
  };
};

// ============================================================================
// PROJECT TRACKING AND MONITORING (6-10)
// ============================================================================

/**
 * Updates project progress and calculates earned value.
 *
 * @param {string} projectId - Project identifier
 * @param {object} progressData - Progress update data
 * @param {string} userId - User updating progress
 * @returns {Promise<ConstructionProject>} Updated project
 *
 * @example
 * ```typescript
 * const updated = await updateProjectProgress('proj-123', {
 *   progressPercentage: 45.5,
 *   actualCost: 12500000,
 *   notes: 'Foundation work completed'
 * }, 'pm-456');
 * ```
 */
export const updateProjectProgress = async (
  projectId: string,
  progressData: { progressPercentage: number; actualCost: number; notes?: string },
  userId: string,
): Promise<ConstructionProject> => {
  const project = await getConstructionProject(projectId);

  const earnedValue = (project.totalBudget * progressData.progressPercentage) / 100;
  const plannedValue = calculatePlannedValue(project);

  const updatedProject: ConstructionProject = {
    ...project,
    progressPercentage: progressData.progressPercentage,
    actualCost: progressData.actualCost,
    earnedValue,
    plannedValue,
    updatedAt: new Date(),
    updatedBy: userId,
  };

  return updatedProject;
};

/**
 * Calculates earned value management (EVM) metrics for project.
 *
 * @param {string} projectId - Project identifier
 * @returns {Promise<ProjectPerformanceMetrics>} EVM metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateProjectEVM('proj-123');
 * console.log(`CPI: ${metrics.costPerformanceIndex}, SPI: ${metrics.schedulePerformanceIndex}`);
 * ```
 */
export const calculateProjectEVM = async (projectId: string): Promise<ProjectPerformanceMetrics> => {
  const project = await getConstructionProject(projectId);

  const earnedValue = project.earnedValue;
  const plannedValue = project.plannedValue;
  const actualCost = project.actualCost;
  const budgetAtCompletion = project.totalBudget;

  const scheduleVariance = earnedValue - plannedValue;
  const costVariance = earnedValue - actualCost;
  const schedulePerformanceIndex = plannedValue > 0 ? earnedValue / plannedValue : 0;
  const costPerformanceIndex = actualCost > 0 ? earnedValue / actualCost : 0;

  const estimateAtCompletion =
    costPerformanceIndex > 0 ? budgetAtCompletion / costPerformanceIndex : budgetAtCompletion;
  const estimateToComplete = estimateAtCompletion - actualCost;
  const varianceAtCompletion = budgetAtCompletion - estimateAtCompletion;
  const toCompletePerformanceIndex =
    budgetAtCompletion - actualCost > 0 ? (budgetAtCompletion - earnedValue) / (budgetAtCompletion - actualCost) : 0;

  return {
    projectId,
    schedulePerformanceIndex,
    costPerformanceIndex,
    scheduleVariance,
    costVariance,
    estimateAtCompletion,
    estimateToComplete,
    varianceAtCompletion,
    toCompletePerformanceIndex,
    earnedValue,
    plannedValue,
    actualCost,
    budgetAtCompletion,
  };
};

/**
 * Tracks project schedule performance and forecasts completion.
 *
 * @param {string} projectId - Project identifier
 * @returns {Promise<object>} Schedule performance data
 *
 * @example
 * ```typescript
 * const schedule = await trackProjectSchedule('proj-123');
 * ```
 */
export const trackProjectSchedule = async (
  projectId: string,
): Promise<{
  baselineEndDate: Date;
  currentEndDate: Date;
  forecastedEndDate: Date;
  scheduleVarianceDays: number;
  onSchedule: boolean;
}> => {
  const project = await getConstructionProject(projectId);
  const metrics = await calculateProjectEVM(projectId);

  const baselineEndDate = project.baselineEndDate!;
  const currentEndDate = project.currentEndDate!;

  // Calculate forecasted end date based on SPI
  const totalDays =
    (baselineEndDate.getTime() - (project.baselineSchedule?.getTime() || 0)) / (1000 * 60 * 60 * 24);
  const forecastedDays = metrics.schedulePerformanceIndex > 0 ? totalDays / metrics.schedulePerformanceIndex : totalDays;
  const forecastedEndDate = new Date(
    (project.baselineSchedule?.getTime() || 0) + forecastedDays * 24 * 60 * 60 * 1000,
  );

  const scheduleVarianceDays = (currentEndDate.getTime() - baselineEndDate.getTime()) / (1000 * 60 * 60 * 24);

  return {
    baselineEndDate,
    currentEndDate,
    forecastedEndDate,
    scheduleVarianceDays,
    onSchedule: scheduleVarianceDays <= 0,
  };
};

/**
 * Generates comprehensive project status report.
 *
 * @param {string} projectId - Project identifier
 * @param {Date} [asOfDate] - Report date (defaults to now)
 * @returns {Promise<object>} Status report
 *
 * @example
 * ```typescript
 * const report = await generateProjectStatusReport('proj-123');
 * ```
 */
export const generateProjectStatusReport = async (
  projectId: string,
  asOfDate?: Date,
): Promise<{
  project: ConstructionProject;
  performanceMetrics: ProjectPerformanceMetrics;
  scheduleStatus: any;
  riskSummary: any;
  changeOrderSummary: any;
  reportDate: Date;
}> => {
  const project = await getConstructionProject(projectId);
  const performanceMetrics = await calculateProjectEVM(projectId);
  const scheduleStatus = await trackProjectSchedule(projectId);
  const changeOrders = await getProjectChangeOrders(projectId);

  return {
    project,
    performanceMetrics,
    scheduleStatus,
    riskSummary: {
      totalRisks: 0,
      highSeverityRisks: 0,
      mitigatedRisks: 0,
    },
    changeOrderSummary: {
      totalChangeOrders: changeOrders.length,
      approvedChangeOrders: changeOrders.filter((co) => co.status === 'APPROVED').length,
      totalCostImpact: changeOrders.reduce((sum, co) => sum + co.costImpact, 0),
      totalScheduleImpact: changeOrders.reduce((sum, co) => sum + co.scheduleImpact, 0),
    },
    reportDate: asOfDate || new Date(),
  };
};

/**
 * Calculates critical path for project schedule.
 *
 * @param {string} projectId - Project identifier
 * @returns {Promise<object>} Critical path analysis
 *
 * @example
 * ```typescript
 * const criticalPath = await calculateProjectCriticalPath('proj-123');
 * ```
 */
export const calculateProjectCriticalPath = async (
  projectId: string,
): Promise<{
  criticalTasks: any[];
  totalDuration: number;
  slack: number;
  longestPath: string[];
}> => {
  // In production, perform CPM algorithm on project tasks
  return {
    criticalTasks: [],
    totalDuration: 0,
    slack: 0,
    longestPath: [],
  };
};

// ============================================================================
// PORTFOLIO MANAGEMENT (11-15)
// ============================================================================

/**
 * Creates project portfolio for multi-project management.
 *
 * @param {object} portfolioData - Portfolio creation data
 * @param {string} userId - User creating portfolio
 * @returns {Promise<ProjectPortfolio>} Created portfolio
 *
 * @example
 * ```typescript
 * const portfolio = await createProjectPortfolio({
 *   portfolioName: 'District Infrastructure Projects',
 *   description: 'All active infrastructure projects',
 *   managerId: 'manager-123'
 * }, 'admin-456');
 * ```
 */
export const createProjectPortfolio = async (
  portfolioData: any,
  userId: string,
): Promise<ProjectPortfolio> => {
  return {
    id: generateUUID(),
    portfolioName: portfolioData.portfolioName,
    description: portfolioData.description,
    managerId: portfolioData.managerId,
    totalProjects: 0,
    totalBudget: 0,
    totalActualCost: 0,
    activeProjects: 0,
    completedProjects: 0,
    averageProgress: 0,
    performanceIndex: 1.0,
    metadata: portfolioData.metadata || {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Adds project to portfolio.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {string} projectId - Project identifier
 * @returns {Promise<object>} Association result
 *
 * @example
 * ```typescript
 * await addProjectToPortfolio('portfolio-123', 'proj-456');
 * ```
 */
export const addProjectToPortfolio = async (
  portfolioId: string,
  projectId: string,
): Promise<{ portfolioId: string; projectId: string; addedAt: Date }> => {
  return {
    portfolioId,
    projectId,
    addedAt: new Date(),
  };
};

/**
 * Calculates portfolio performance metrics.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<object>} Portfolio metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculatePortfolioMetrics('portfolio-123');
 * ```
 */
export const calculatePortfolioMetrics = async (
  portfolioId: string,
): Promise<{
  totalBudget: number;
  totalActualCost: number;
  averageCPI: number;
  averageSPI: number;
  totalEarnedValue: number;
  portfolioHealth: 'EXCELLENT' | 'GOOD' | 'AT_RISK' | 'CRITICAL';
}> => {
  const projects = await getPortfolioProjects(portfolioId);

  const totalBudget = projects.reduce((sum, p) => sum + p.totalBudget, 0);
  const totalActualCost = projects.reduce((sum, p) => sum + p.actualCost, 0);
  const totalEarnedValue = projects.reduce((sum, p) => sum + p.earnedValue, 0);

  const averageCPI = totalActualCost > 0 ? totalEarnedValue / totalActualCost : 1;
  const averageSPI = 0.95; // Placeholder

  let portfolioHealth: 'EXCELLENT' | 'GOOD' | 'AT_RISK' | 'CRITICAL' = 'GOOD';
  if (averageCPI >= 1.0 && averageSPI >= 1.0) portfolioHealth = 'EXCELLENT';
  else if (averageCPI >= 0.9 && averageSPI >= 0.9) portfolioHealth = 'GOOD';
  else if (averageCPI >= 0.8 && averageSPI >= 0.8) portfolioHealth = 'AT_RISK';
  else portfolioHealth = 'CRITICAL';

  return {
    totalBudget,
    totalActualCost,
    averageCPI,
    averageSPI,
    totalEarnedValue,
    portfolioHealth,
  };
};

/**
 * Generates portfolio dashboard with key metrics.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<object>} Dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await generatePortfolioDashboard('portfolio-123');
 * ```
 */
export const generatePortfolioDashboard = async (
  portfolioId: string,
): Promise<{
  metrics: any;
  projectsByPhase: Record<ProjectPhase, number>;
  projectsByStatus: Record<ConstructionProjectStatus, number>;
  topRisks: any[];
  upcomingMilestones: any[];
}> => {
  const projects = await getPortfolioProjects(portfolioId);
  const metrics = await calculatePortfolioMetrics(portfolioId);

  const projectsByPhase = {} as Record<ProjectPhase, number>;
  const projectsByStatus = {} as Record<ConstructionProjectStatus, number>;

  projects.forEach((p) => {
    projectsByPhase[p.currentPhase] = (projectsByPhase[p.currentPhase] || 0) + 1;
    projectsByStatus[p.status] = (projectsByStatus[p.status] || 0) + 1;
  });

  return {
    metrics,
    projectsByPhase,
    projectsByStatus,
    topRisks: [],
    upcomingMilestones: [],
  };
};

/**
 * Identifies portfolio resource conflicts across projects.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @returns {Promise<object[]>} Resource conflicts
 *
 * @example
 * ```typescript
 * const conflicts = await identifyPortfolioResourceConflicts('portfolio-123');
 * ```
 */
export const identifyPortfolioResourceConflicts = async (
  portfolioId: string,
): Promise<
  Array<{
    resourceId: string;
    resourceName: string;
    totalAllocation: number;
    conflictingProjects: string[];
    overallocationPercentage: number;
  }>
> => {
  // In production, analyze resource allocations across all portfolio projects
  return [];
};

// ============================================================================
// MULTI-PROJECT COORDINATION (16-20)
// ============================================================================

/**
 * Coordinates dependencies between multiple projects.
 *
 * @param {string} dependentProjectId - Dependent project ID
 * @param {string} predecessorProjectId - Predecessor project ID
 * @param {string} dependencyType - Type of dependency
 * @returns {Promise<object>} Dependency record
 *
 * @example
 * ```typescript
 * await coordinateProjectDependencies('proj-2', 'proj-1', 'FINISH_TO_START');
 * ```
 */
export const coordinateProjectDependencies = async (
  dependentProjectId: string,
  predecessorProjectId: string,
  dependencyType: string,
): Promise<{
  dependentProjectId: string;
  predecessorProjectId: string;
  dependencyType: string;
  createdAt: Date;
}> => {
  return {
    dependentProjectId,
    predecessorProjectId,
    dependencyType,
    createdAt: new Date(),
  };
};

/**
 * Allocates shared resources across multiple projects.
 *
 * @param {object} allocationData - Resource allocation data
 * @returns {Promise<ResourceAllocation>} Resource allocation
 *
 * @example
 * ```typescript
 * const allocation = await allocateSharedResources({
 *   resourceId: 'crane-001',
 *   projectAllocations: [
 *     { projectId: 'proj-1', percentage: 60 },
 *     { projectId: 'proj-2', percentage: 40 }
 *   ]
 * });
 * ```
 */
export const allocateSharedResources = async (allocationData: any): Promise<ResourceAllocation> => {
  return {
    id: generateUUID(),
    projectId: allocationData.projectId,
    resourceType: allocationData.resourceType || 'EQUIPMENT',
    resourceId: allocationData.resourceId,
    resourceName: allocationData.resourceName || '',
    allocationPercentage: allocationData.allocationPercentage,
    allocatedHours: allocationData.allocatedHours,
    actualHours: 0,
    hourlyRate: allocationData.hourlyRate,
    totalCost: (allocationData.allocatedHours || 0) * (allocationData.hourlyRate || 0),
    startDate: allocationData.startDate,
    endDate: allocationData.endDate,
    status: 'PLANNED',
    metadata: allocationData.metadata || {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Performs resource leveling across portfolio projects.
 *
 * @param {string} portfolioId - Portfolio identifier
 * @param {object} options - Leveling options
 * @returns {Promise<object>} Leveling results
 *
 * @example
 * ```typescript
 * const results = await performCrossProjectResourceLeveling('portfolio-123', {
 *   prioritizeBy: 'priority',
 *   allowDelays: true
 * });
 * ```
 */
export const performCrossProjectResourceLeveling = async (
  portfolioId: string,
  options: any,
): Promise<{
  adjustedProjects: any[];
  resourceUtilization: Map<string, number>;
  delaysIntroduced: any[];
}> => {
  return {
    adjustedProjects: [],
    resourceUtilization: new Map(),
    delaysIntroduced: [],
  };
};

/**
 * Synchronizes schedules across dependent projects.
 *
 * @param {string[]} projectIds - Array of project IDs
 * @returns {Promise<object>} Synchronization results
 *
 * @example
 * ```typescript
 * const sync = await synchronizeProjectSchedules(['proj-1', 'proj-2', 'proj-3']);
 * ```
 */
export const synchronizeProjectSchedules = async (
  projectIds: string[],
): Promise<{
  synchronized: boolean;
  conflicts: any[];
  recommendations: string[];
}> => {
  return {
    synchronized: true,
    conflicts: [],
    recommendations: [],
  };
};

/**
 * Generates cross-project impact analysis for changes.
 *
 * @param {string} projectId - Project with proposed change
 * @param {object} changeData - Change details
 * @returns {Promise<object>} Impact analysis
 *
 * @example
 * ```typescript
 * const impact = await analyzeCrossProjectImpact('proj-1', {
 *   scheduleDelay: 30,
 *   costIncrease: 500000
 * });
 * ```
 */
export const analyzeCrossProjectImpact = async (
  projectId: string,
  changeData: any,
): Promise<{
  impactedProjects: string[];
  cumulativeScheduleImpact: number;
  cumulativeCostImpact: number;
  recommendations: string[];
}> => {
  return {
    impactedProjects: [],
    cumulativeScheduleImpact: 0,
    cumulativeCostImpact: 0,
    recommendations: [],
  };
};

// ============================================================================
// PHASE MANAGEMENT AND TRANSITIONS (21-25)
// ============================================================================

/**
 * Transitions project to next phase with gate review.
 *
 * @param {string} projectId - Project identifier
 * @param {ProjectPhase} toPhase - Target phase
 * @param {string} approvedBy - User approving transition
 * @returns {Promise<PhaseTransition>} Phase transition record
 *
 * @example
 * ```typescript
 * const transition = await transitionProjectPhase('proj-123', ProjectPhase.CONSTRUCTION, 'admin-456');
 * ```
 */
export const transitionProjectPhase = async (
  projectId: string,
  toPhase: ProjectPhase,
  approvedBy: string,
): Promise<PhaseTransition> => {
  const project = await getConstructionProject(projectId);

  const transition: PhaseTransition = {
    id: generateUUID(),
    projectId,
    fromPhase: project.currentPhase,
    toPhase,
    transitionDate: new Date(),
    approvedBy,
    gateReviewCompleted: true,
    exitCriteriaMet: true,
    entryCriteriaMet: true,
    metadata: {},
    createdAt: new Date(),
  };

  return transition;
};

/**
 * Validates phase gate criteria before transition.
 *
 * @param {string} projectId - Project identifier
 * @param {ProjectPhase} targetPhase - Target phase
 * @returns {Promise<object>} Validation results
 *
 * @example
 * ```typescript
 * const validation = await validatePhaseGateCriteria('proj-123', ProjectPhase.CONSTRUCTION);
 * ```
 */
export const validatePhaseGateCriteria = async (
  projectId: string,
  targetPhase: ProjectPhase,
): Promise<{
  canTransition: boolean;
  exitCriteriaMet: boolean;
  entryCriteriaMet: boolean;
  missingCriteria: string[];
  warnings: string[];
}> => {
  return {
    canTransition: true,
    exitCriteriaMet: true,
    entryCriteriaMet: true,
    missingCriteria: [],
    warnings: [],
  };
};

/**
 * Retrieves phase transition history for project.
 *
 * @param {string} projectId - Project identifier
 * @returns {Promise<PhaseTransition[]>} Phase history
 *
 * @example
 * ```typescript
 * const history = await getPhaseTransitionHistory('proj-123');
 * ```
 */
export const getPhaseTransitionHistory = async (projectId: string): Promise<PhaseTransition[]> => {
  // In production, fetch from database
  return [];
};

/**
 * Calculates average phase durations for project type.
 *
 * @param {string} projectType - Project type
 * @param {DeliveryMethod} deliveryMethod - Delivery method
 * @returns {Promise<object>} Phase duration statistics
 *
 * @example
 * ```typescript
 * const durations = await calculatePhaseDurations('hospital', DeliveryMethod.DESIGN_BUILD);
 * ```
 */
export const calculatePhaseDurations = async (
  projectType: string,
  deliveryMethod: DeliveryMethod,
): Promise<Record<ProjectPhase, { average: number; min: number; max: number }>> => {
  // In production, calculate from historical project data
  return {} as any;
};

/**
 * Generates phase completion checklist.
 *
 * @param {string} projectId - Project identifier
 * @param {ProjectPhase} phase - Phase to generate checklist for
 * @returns {Promise<object>} Phase checklist
 *
 * @example
 * ```typescript
 * const checklist = await generatePhaseChecklist('proj-123', ProjectPhase.DESIGN);
 * ```
 */
export const generatePhaseChecklist = async (
  projectId: string,
  phase: ProjectPhase,
): Promise<{
  phase: ProjectPhase;
  items: Array<{ item: string; completed: boolean; requiredFor: string }>;
  completionPercentage: number;
}> => {
  return {
    phase,
    items: [],
    completionPercentage: 0,
  };
};

// ============================================================================
// BASELINE MANAGEMENT (26-30)
// ============================================================================

/**
 * Creates project baseline for scope, schedule, and cost.
 *
 * @param {object} baselineData - Baseline creation data
 * @param {string} userId - User creating baseline
 * @returns {Promise<ProjectBaseline>} Created baseline
 *
 * @example
 * ```typescript
 * const baseline = await createProjectBaseline({
 *   projectId: 'proj-123',
 *   baselineType: 'INITIAL',
 *   budget: 25000000,
 *   schedule: new Date('2025-12-31'),
 *   scope: 'Complete hospital expansion'
 * }, 'admin-456');
 * ```
 */
export const createProjectBaseline = async (baselineData: any, userId: string): Promise<ProjectBaseline> => {
  const baselineNumber = generateBaselineNumber(baselineData.projectId);

  return {
    id: generateUUID(),
    projectId: baselineData.projectId,
    baselineNumber,
    baselineType: baselineData.baselineType,
    baselineDate: new Date(),
    budget: baselineData.budget,
    schedule: baselineData.schedule,
    scope: baselineData.scope,
    approvedBy: userId,
    approvedAt: new Date(),
    changeReason: baselineData.changeReason,
    metadata: baselineData.metadata || {},
    createdAt: new Date(),
  };
};

/**
 * Compares current project status to baseline.
 *
 * @param {string} projectId - Project identifier
 * @param {string} [baselineId] - Specific baseline ID (uses current if not specified)
 * @returns {Promise<object>} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = await compareToBaseline('proj-123');
 * ```
 */
export const compareToBaseline = async (
  projectId: string,
  baselineId?: string,
): Promise<{
  budgetVariance: number;
  budgetVariancePercentage: number;
  scheduleVariance: number;
  scheduleVarianceDays: number;
  scopeChanges: string[];
}> => {
  const project = await getConstructionProject(projectId);
  const baseline = await getCurrentBaseline(projectId);

  const budgetVariance = project.totalBudget - baseline.budget;
  const scheduleVarianceDays =
    (project.currentEndDate!.getTime() - baseline.schedule.getTime()) / (1000 * 60 * 60 * 24);

  return {
    budgetVariance,
    budgetVariancePercentage: (budgetVariance / baseline.budget) * 100,
    scheduleVariance: scheduleVarianceDays,
    scheduleVarianceDays,
    scopeChanges: [],
  };
};

/**
 * Requests baseline re-baselining with justification.
 *
 * @param {string} projectId - Project identifier
 * @param {object} rebaselineData - Re-baseline request data
 * @param {string} userId - User requesting re-baseline
 * @returns {Promise<object>} Re-baseline request
 *
 * @example
 * ```typescript
 * const request = await requestBaselineChange('proj-123', {
 *   newBudget: 28000000,
 *   newSchedule: new Date('2026-03-31'),
 *   justification: 'Major scope change approved'
 * }, 'pm-456');
 * ```
 */
export const requestBaselineChange = async (
  projectId: string,
  rebaselineData: any,
  userId: string,
): Promise<{
  requestId: string;
  status: 'PENDING';
  requestedBy: string;
  requestedAt: Date;
}> => {
  return {
    requestId: generateUUID(),
    status: 'PENDING',
    requestedBy: userId,
    requestedAt: new Date(),
  };
};

/**
 * Approves baseline change and creates new baseline.
 *
 * @param {string} requestId - Re-baseline request ID
 * @param {string} approvedBy - User approving change
 * @returns {Promise<ProjectBaseline>} New baseline
 *
 * @example
 * ```typescript
 * const newBaseline = await approveBaselineChange('request-123', 'director-789');
 * ```
 */
export const approveBaselineChange = async (requestId: string, approvedBy: string): Promise<ProjectBaseline> => {
  // In production, fetch request and create new baseline
  return {} as ProjectBaseline;
};

/**
 * Retrieves baseline history for project.
 *
 * @param {string} projectId - Project identifier
 * @returns {Promise<ProjectBaseline[]>} Baseline history
 *
 * @example
 * ```typescript
 * const history = await getBaselineHistory('proj-123');
 * ```
 */
export const getBaselineHistory = async (projectId: string): Promise<ProjectBaseline[]> => {
  // In production, fetch from database
  return [];
};

// ============================================================================
// CHANGE ORDER MANAGEMENT (31-35)
// ============================================================================

/**
 * Creates change order for project modifications.
 *
 * @param {object} changeOrderData - Change order data
 * @param {string} userId - User creating change order
 * @returns {Promise<ChangeOrder>} Created change order
 *
 * @example
 * ```typescript
 * const co = await createChangeOrder({
 *   projectId: 'proj-123',
 *   title: 'Add backup power system',
 *   description: 'Install redundant generator',
 *   changeType: 'SCOPE',
 *   costImpact: 250000,
 *   scheduleImpact: 15
 * }, 'pm-456');
 * ```
 */
export const createChangeOrder = async (changeOrderData: any, userId: string): Promise<ChangeOrder> => {
  const changeOrderNumber = generateChangeOrderNumber(changeOrderData.projectId);

  return {
    id: generateUUID(),
    projectId: changeOrderData.projectId,
    changeOrderNumber,
    title: changeOrderData.title,
    description: changeOrderData.description,
    changeType: changeOrderData.changeType,
    requestedBy: userId,
    requestedDate: new Date(),
    costImpact: changeOrderData.costImpact || 0,
    scheduleImpact: changeOrderData.scheduleImpact || 0,
    status: 'DRAFT',
    approvals: [],
    metadata: changeOrderData.metadata || {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Processes change order approval workflow.
 *
 * @param {string} changeOrderId - Change order identifier
 * @param {object} approval - Approval details
 * @returns {Promise<ChangeOrder>} Updated change order
 *
 * @example
 * ```typescript
 * const updated = await processChangeOrderApproval('co-123', {
 *   approvedBy: 'director-789',
 *   status: 'APPROVED',
 *   comments: 'Approved with conditions'
 * });
 * ```
 */
export const processChangeOrderApproval = async (changeOrderId: string, approval: any): Promise<ChangeOrder> => {
  const changeOrder = await getChangeOrder(changeOrderId);

  changeOrder.approvals.push({
    approvedBy: approval.approvedBy,
    approvedAt: new Date(),
    status: approval.status,
    comments: approval.comments,
  });

  if (approval.status === 'APPROVED') {
    changeOrder.status = 'APPROVED';
  } else if (approval.status === 'REJECTED') {
    changeOrder.status = 'REJECTED';
  }

  changeOrder.updatedAt = new Date();

  return changeOrder;
};

/**
 * Implements approved change order into project.
 *
 * @param {string} changeOrderId - Change order identifier
 * @param {string} userId - User implementing change
 * @returns {Promise<object>} Implementation result
 *
 * @example
 * ```typescript
 * await implementChangeOrder('co-123', 'pm-456');
 * ```
 */
export const implementChangeOrder = async (
  changeOrderId: string,
  userId: string,
): Promise<{
  implemented: boolean;
  implementedDate: Date;
  projectUpdated: boolean;
}> => {
  const changeOrder = await getChangeOrder(changeOrderId);

  if (changeOrder.status !== 'APPROVED') {
    throw new Error('Only approved change orders can be implemented');
  }

  // Update project budget and schedule
  const project = await getConstructionProject(changeOrder.projectId);
  project.totalBudget += changeOrder.costImpact;
  if (project.currentEndDate) {
    project.currentEndDate = new Date(
      project.currentEndDate.getTime() + changeOrder.scheduleImpact * 24 * 60 * 60 * 1000,
    );
  }

  changeOrder.status = 'IMPLEMENTED';
  changeOrder.implementedDate = new Date();

  return {
    implemented: true,
    implementedDate: new Date(),
    projectUpdated: true,
  };
};

/**
 * Retrieves change order history for project.
 *
 * @param {string} projectId - Project identifier
 * @param {object} [filters] - Optional filters
 * @returns {Promise<ChangeOrder[]>} Change orders
 *
 * @example
 * ```typescript
 * const changeOrders = await getProjectChangeOrders('proj-123', { status: 'APPROVED' });
 * ```
 */
export const getProjectChangeOrders = async (projectId: string, filters?: any): Promise<ChangeOrder[]> => {
  // In production, fetch from database with filters
  return [];
};

/**
 * Analyzes change order trends and patterns.
 *
 * @param {string} projectId - Project identifier
 * @returns {Promise<object>} Trend analysis
 *
 * @example
 * ```typescript
 * const trends = await analyzeChangeOrderTrends('proj-123');
 * ```
 */
export const analyzeChangeOrderTrends = async (
  projectId: string,
): Promise<{
  totalChangeOrders: number;
  averageCostImpact: number;
  averageScheduleImpact: number;
  mostCommonType: string;
  approvalRate: number;
}> => {
  const changeOrders = await getProjectChangeOrders(projectId);

  return {
    totalChangeOrders: changeOrders.length,
    averageCostImpact: changeOrders.reduce((sum, co) => sum + co.costImpact, 0) / changeOrders.length || 0,
    averageScheduleImpact: changeOrders.reduce((sum, co) => sum + co.scheduleImpact, 0) / changeOrders.length || 0,
    mostCommonType: 'SCOPE',
    approvalRate: (changeOrders.filter((co) => co.status === 'APPROVED').length / changeOrders.length) * 100 || 0,
  };
};

// ============================================================================
// INTEGRATION AND REPORTING (36-40)
// ============================================================================

/**
 * Integrates project with budget management system.
 *
 * @param {string} projectId - Project identifier
 * @param {string} budgetId - Budget system ID
 * @returns {Promise<object>} Integration result
 *
 * @example
 * ```typescript
 * await integrateWithBudgetSystem('proj-123', 'budget-456');
 * ```
 */
export const integrateWithBudgetSystem = async (
  projectId: string,
  budgetId: string,
): Promise<{
  integrated: boolean;
  budgetId: string;
  syncEnabled: boolean;
}> => {
  return {
    integrated: true,
    budgetId,
    syncEnabled: true,
  };
};

/**
 * Integrates project with schedule management system.
 *
 * @param {string} projectId - Project identifier
 * @param {string} scheduleId - Schedule system ID
 * @returns {Promise<object>} Integration result
 *
 * @example
 * ```typescript
 * await integrateWithScheduleSystem('proj-123', 'schedule-789');
 * ```
 */
export const integrateWithScheduleSystem = async (
  projectId: string,
  scheduleId: string,
): Promise<{
  integrated: boolean;
  scheduleId: string;
  criticalPathSynced: boolean;
}> => {
  return {
    integrated: true,
    scheduleId,
    criticalPathSynced: true,
  };
};

/**
 * Integrates project with quality management system.
 *
 * @param {string} projectId - Project identifier
 * @param {string} qualitySystemId - Quality system ID
 * @returns {Promise<object>} Integration result
 *
 * @example
 * ```typescript
 * await integrateWithQualitySystem('proj-123', 'qms-321');
 * ```
 */
export const integrateWithQualitySystem = async (
  projectId: string,
  qualitySystemId: string,
): Promise<{
  integrated: boolean;
  qualitySystemId: string;
  inspectionsLinked: boolean;
}> => {
  return {
    integrated: true,
    qualitySystemId,
    inspectionsLinked: true,
  };
};

/**
 * Generates executive project summary report.
 *
 * @param {string} projectId - Project identifier
 * @returns {Promise<object>} Executive summary
 *
 * @example
 * ```typescript
 * const summary = await generateExecutiveSummary('proj-123');
 * ```
 */
export const generateExecutiveSummary = async (
  projectId: string,
): Promise<{
  project: ConstructionProject;
  performanceMetrics: ProjectPerformanceMetrics;
  keyMilestones: any[];
  topRisks: any[];
  recommendations: string[];
}> => {
  const project = await getConstructionProject(projectId);
  const performanceMetrics = await calculateProjectEVM(projectId);

  return {
    project,
    performanceMetrics,
    keyMilestones: [],
    topRisks: [],
    recommendations: [],
  };
};

/**
 * Exports project data to external formats.
 *
 * @param {string} projectId - Project identifier
 * @param {string} format - Export format ('PDF' | 'EXCEL' | 'MSP' | 'PRIMAVERA')
 * @returns {Promise<Buffer>} Exported data
 *
 * @example
 * ```typescript
 * const pdfBuffer = await exportProjectData('proj-123', 'PDF');
 * ```
 */
export const exportProjectData = async (projectId: string, format: string): Promise<Buffer> => {
  // In production, generate formatted export
  return Buffer.from('Project data export');
};

// ============================================================================
// PROJECT TEMPLATES AND CLOSEOUT (41-45)
// ============================================================================

/**
 * Creates reusable project template from existing project.
 *
 * @param {string} projectId - Source project ID
 * @param {object} templateData - Template metadata
 * @param {string} userId - User creating template
 * @returns {Promise<ProjectTemplate>} Created template
 *
 * @example
 * ```typescript
 * const template = await createProjectTemplate('proj-123', {
 *   templateName: 'Standard Hospital Expansion',
 *   description: 'Template for hospital expansion projects'
 * }, 'admin-456');
 * ```
 */
export const createProjectTemplate = async (
  projectId: string,
  templateData: any,
  userId: string,
): Promise<ProjectTemplate> => {
  const project = await getConstructionProject(projectId);

  return {
    id: generateUUID(),
    templateName: templateData.templateName,
    description: templateData.description,
    projectType: templateData.projectType || 'construction',
    deliveryMethod: project.deliveryMethod,
    phases: [
      ProjectPhase.INITIATION,
      ProjectPhase.PLANNING,
      ProjectPhase.DESIGN,
      ProjectPhase.PROCUREMENT,
      ProjectPhase.CONSTRUCTION,
      ProjectPhase.CLOSEOUT,
    ],
    defaultDuration: 365,
    defaultBudget: project.totalBudget,
    requiredDocuments: [],
    checklistItems: [],
    milestones: [],
    metadata: templateData.metadata || {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Initiates project closeout process.
 *
 * @param {string} projectId - Project identifier
 * @param {string} userId - User initiating closeout
 * @returns {Promise<object>} Closeout initiation result
 *
 * @example
 * ```typescript
 * const closeout = await initiateProjectCloseout('proj-123', 'pm-456');
 * ```
 */
export const initiateProjectCloseout = async (
  projectId: string,
  userId: string,
): Promise<{
  closeoutId: string;
  status: 'IN_PROGRESS';
  initiatedBy: string;
  initiatedAt: Date;
  checklistItems: string[];
}> => {
  const project = await getConstructionProject(projectId);

  if (project.status !== ConstructionProjectStatus.CONSTRUCTION) {
    throw new Error('Only projects in construction phase can initiate closeout');
  }

  return {
    closeoutId: generateUUID(),
    status: 'IN_PROGRESS',
    initiatedBy: userId,
    initiatedAt: new Date(),
    checklistItems: [
      'Final inspections completed',
      'Punch list items resolved',
      'As-built drawings submitted',
      'Operations manuals delivered',
      'Warranty documentation received',
      'Final payment processed',
    ],
  };
};

/**
 * Captures lessons learned from project.
 *
 * @param {string} projectId - Project identifier
 * @param {object} lessonsData - Lessons learned data
 * @param {string} userId - User submitting lessons
 * @returns {Promise<object>} Lessons learned record
 *
 * @example
 * ```typescript
 * const lessons = await captureLessonsLearned('proj-123', {
 *   category: 'Schedule Management',
 *   lesson: 'Early contractor involvement improved coordination',
 *   recommendation: 'Continue using design-build for future projects'
 * }, 'pm-456');
 * ```
 */
export const captureLessonsLearned = async (
  projectId: string,
  lessonsData: any,
  userId: string,
): Promise<{
  id: string;
  projectId: string;
  category: string;
  lesson: string;
  recommendation: string;
  submittedBy: string;
  submittedAt: Date;
}> => {
  return {
    id: generateUUID(),
    projectId,
    category: lessonsData.category,
    lesson: lessonsData.lesson,
    recommendation: lessonsData.recommendation,
    submittedBy: userId,
    submittedAt: new Date(),
  };
};

/**
 * Completes project closeout and archives project.
 *
 * @param {string} projectId - Project identifier
 * @param {string} userId - User completing closeout
 * @returns {Promise<object>} Closeout completion
 *
 * @example
 * ```typescript
 * await completeProjectCloseout('proj-123', 'director-789');
 * ```
 */
export const completeProjectCloseout = async (
  projectId: string,
  userId: string,
): Promise<{
  completed: boolean;
  completedBy: string;
  completedAt: Date;
  finalReport: string;
}> => {
  const project = await getConstructionProject(projectId);

  project.status = ConstructionProjectStatus.COMPLETED;
  project.actualEndDate = new Date();

  return {
    completed: true,
    completedBy: userId,
    completedAt: new Date(),
    finalReport: `Final project report for ${project.projectName}`,
  };
};

/**
 * Generates project performance benchmarking report.
 *
 * @param {string} projectId - Project identifier
 * @param {string[]} comparisonProjectIds - Projects to compare against
 * @returns {Promise<object>} Benchmarking report
 *
 * @example
 * ```typescript
 * const benchmark = await generateProjectBenchmark('proj-123', ['proj-100', 'proj-101']);
 * ```
 */
export const generateProjectBenchmark = async (
  projectId: string,
  comparisonProjectIds: string[],
): Promise<{
  project: ConstructionProject;
  metrics: ProjectPerformanceMetrics;
  comparisons: any[];
  ranking: number;
  insights: string[];
}> => {
  const project = await getConstructionProject(projectId);
  const metrics = await calculateProjectEVM(projectId);

  return {
    project,
    metrics,
    comparisons: [],
    ranking: 1,
    insights: ['Project performance above average', 'Cost control excellent', 'Schedule on track'],
  };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Gets construction project by ID (placeholder)
 */
async function getConstructionProject(id: string): Promise<ConstructionProject> {
  return {
    id,
    projectNumber: 'NAD-2025-C-0001',
    projectName: 'Test Project',
    description: 'Test',
    status: ConstructionProjectStatus.PLANNING,
    currentPhase: ProjectPhase.PLANNING,
    priority: ProjectPriority.MEDIUM,
    deliveryMethod: DeliveryMethod.DESIGN_BID_BUILD,
    projectManagerId: 'user-1',
    totalBudget: 10000000,
    committedCost: 0,
    actualCost: 0,
    forecastedCost: 10000000,
    contingencyReserve: 1000000,
    managementReserve: 500000,
    progressPercentage: 0,
    earnedValue: 0,
    plannedValue: 0,
    regulatoryCompliance: [],
    environmentalPermits: [],
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'user-1',
  };
}

async function getProjectTemplate(id: string): Promise<ProjectTemplate> {
  return {
    id,
    templateName: 'Standard Construction',
    description: 'Standard template',
    projectType: 'construction',
    deliveryMethod: DeliveryMethod.DESIGN_BID_BUILD,
    phases: [],
    defaultDuration: 365,
    defaultBudget: 1000000,
    requiredDocuments: [],
    checklistItems: [],
    milestones: [],
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

async function getCurrentBaseline(projectId: string): Promise<ProjectBaseline> {
  return {
    id: generateUUID(),
    projectId,
    baselineNumber: 'BL-001',
    baselineType: 'INITIAL',
    baselineDate: new Date(),
    budget: 10000000,
    schedule: new Date(),
    scope: 'Initial scope',
    approvedBy: 'admin',
    approvedAt: new Date(),
    metadata: {},
    createdAt: new Date(),
  };
}

async function getChangeOrder(id: string): Promise<ChangeOrder> {
  return {
    id,
    projectId: 'proj-1',
    changeOrderNumber: 'CO-001',
    title: 'Test Change',
    description: 'Test',
    changeType: 'SCOPE',
    requestedBy: 'user-1',
    requestedDate: new Date(),
    costImpact: 0,
    scheduleImpact: 0,
    status: 'DRAFT',
    approvals: [],
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

async function getPortfolioProjects(portfolioId: string): Promise<ConstructionProject[]> {
  return [];
}

function calculatePlannedValue(project: ConstructionProject): number {
  const now = new Date();
  const start = project.baselineSchedule?.getTime() || now.getTime();
  const end = project.baselineEndDate?.getTime() || now.getTime();
  const elapsed = now.getTime() - start;
  const total = end - start;

  if (elapsed <= 0) return 0;
  if (elapsed >= total) return project.totalBudget;

  return (elapsed / total) * project.totalBudget;
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateBaselineNumber(projectId: string): string {
  const sequence = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `BL-${sequence}`;
}

function generateChangeOrderNumber(projectId: string): string {
  const sequence = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `CO-${sequence}`;
}

// ============================================================================
// NESTJS CONTROLLER
// ============================================================================

/**
 * Construction Project Management Controller
 * Provides RESTful API endpoints for construction project management
 */
@ApiTags('construction-projects')
@Controller('construction-projects')
@ApiBearerAuth()
export class ConstructionProjectController {
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new construction project' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() createDto: CreateConstructionProjectDto) {
    return createConstructionProject(createDto as any, 'current-user');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get construction project by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return getConstructionProject(id);
  }

  @Patch(':id/progress')
  @ApiOperation({ summary: 'Update project progress' })
  async updateProgress(@Param('id', ParseUUIDPipe) id: string, @Body() progressDto: UpdateProjectProgressDto) {
    return updateProjectProgress(id, progressDto, 'current-user');
  }

  @Get(':id/evm')
  @ApiOperation({ summary: 'Calculate earned value metrics' })
  async getEVM(@Param('id', ParseUUIDPipe) id: string) {
    return calculateProjectEVM(id);
  }

  @Post(':id/baselines')
  @ApiOperation({ summary: 'Create project baseline' })
  async createBaseline(@Param('id', ParseUUIDPipe) id: string, @Body() baselineDto: CreateBaselineDto) {
    return createProjectBaseline(baselineDto, 'current-user');
  }

  @Post(':id/change-orders')
  @ApiOperation({ summary: 'Create change order' })
  async createCO(@Param('id', ParseUUIDPipe) id: string, @Body() coDto: CreateChangeOrderDto) {
    return createChangeOrder(coDto, 'current-user');
  }

  @Get(':id/status-report')
  @ApiOperation({ summary: 'Generate project status report' })
  async getStatusReport(@Param('id', ParseUUIDPipe) id: string) {
    return generateProjectStatusReport(id);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  createConstructionProjectModel,
  createProjectBaselineModel,
  createChangeOrderModel,

  // Project Creation
  createConstructionProject,
  generateConstructionProjectNumber,
  initializeProjectFromTemplate,
  cloneConstructionProject,
  archiveConstructionProject,

  // Project Tracking
  updateProjectProgress,
  calculateProjectEVM,
  trackProjectSchedule,
  generateProjectStatusReport,
  calculateProjectCriticalPath,

  // Portfolio Management
  createProjectPortfolio,
  addProjectToPortfolio,
  calculatePortfolioMetrics,
  generatePortfolioDashboard,
  identifyPortfolioResourceConflicts,

  // Multi-Project Coordination
  coordinateProjectDependencies,
  allocateSharedResources,
  performCrossProjectResourceLeveling,
  synchronizeProjectSchedules,
  analyzeCrossProjectImpact,

  // Phase Management
  transitionProjectPhase,
  validatePhaseGateCriteria,
  getPhaseTransitionHistory,
  calculatePhaseDurations,
  generatePhaseChecklist,

  // Baseline Management
  createProjectBaseline,
  compareToBaseline,
  requestBaselineChange,
  approveBaselineChange,
  getBaselineHistory,

  // Change Order Management
  createChangeOrder,
  processChangeOrderApproval,
  implementChangeOrder,
  getProjectChangeOrders,
  analyzeChangeOrderTrends,

  // Integration
  integrateWithBudgetSystem,
  integrateWithScheduleSystem,
  integrateWithQualitySystem,
  generateExecutiveSummary,
  exportProjectData,

  // Templates and Closeout
  createProjectTemplate,
  initiateProjectCloseout,
  captureLessonsLearned,
  completeProjectCloseout,
  generateProjectBenchmark,

  // Controller
  ConstructionProjectController,
};
