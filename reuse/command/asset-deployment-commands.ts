/**
 * ASSET DEPLOYMENT COMMAND FUNCTIONS
 *
 * Enterprise-grade asset deployment and commissioning management system competing with
 * Oracle JD Edwards EnterpriseOne. Provides comprehensive functionality for:
 * - Deployment workflow orchestration
 * - Installation tracking and management
 * - Site preparation validation
 * - Resource allocation and scheduling
 * - Configuration setup and testing
 * - Commissioning procedures
 * - Acceptance testing workflows
 * - Go-live procedures and cutover
 * - Deployment rollback capabilities
 * - Post-deployment verification
 *
 * @module AssetDeploymentCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 *
 * @example
 * ```typescript
 * import {
 *   createDeploymentPlan,
 *   scheduleDeployment,
 *   allocateDeploymentResources,
 *   executeDeployment,
 *   DeploymentPlan,
 *   DeploymentStatus
 * } from './asset-deployment-commands';
 *
 * // Create deployment plan
 * const plan = await createDeploymentPlan({
 *   assetId: 'asset-123',
 *   siteId: 'site-456',
 *   plannedDate: new Date('2024-06-15'),
 *   deploymentType: DeploymentType.NEW_INSTALLATION,
 *   requiresSitePrep: true,
 *   estimatedDuration: 480 // minutes
 * });
 *
 * // Schedule deployment with resources
 * await scheduleDeployment(plan.id, {
 *   technicianIds: ['tech-1', 'tech-2'],
 *   equipmentIds: ['crane-1', 'tools-set-5']
 * });
 * ```
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BeforeCreate,
  AfterCreate,
} from 'sequelize-typescript';
import {
  IsString,
  IsNumber,
  IsDate,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsObject,
  IsUUID,
  IsArray,
  Min,
  Max,
  ValidateNested,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction, Op, WhereOptions, FindOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Deployment status
 */
export enum DeploymentStatus {
  PLANNED = 'planned',
  SCHEDULED = 'scheduled',
  SITE_PREP_IN_PROGRESS = 'site_prep_in_progress',
  READY_FOR_DEPLOYMENT = 'ready_for_deployment',
  IN_PROGRESS = 'in_progress',
  TESTING = 'testing',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
  ROLLED_BACK = 'rolled_back',
}

/**
 * Deployment type
 */
export enum DeploymentType {
  NEW_INSTALLATION = 'new_installation',
  REPLACEMENT = 'replacement',
  UPGRADE = 'upgrade',
  RELOCATION = 'relocation',
  EXPANSION = 'expansion',
  TEMPORARY = 'temporary',
}

/**
 * Site preparation status
 */
export enum SitePrepStatus {
  NOT_REQUIRED = 'not_required',
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

/**
 * Installation phase
 */
export enum InstallationPhase {
  PRE_INSTALLATION = 'pre_installation',
  PHYSICAL_INSTALLATION = 'physical_installation',
  ELECTRICAL_INSTALLATION = 'electrical_installation',
  NETWORK_INSTALLATION = 'network_installation',
  CONFIGURATION = 'configuration',
  CALIBRATION = 'calibration',
  TESTING = 'testing',
  DOCUMENTATION = 'documentation',
}

/**
 * Test status
 */
export enum TestStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  PASSED = 'passed',
  FAILED = 'failed',
  CONDITIONAL_PASS = 'conditional_pass',
}

/**
 * Acceptance status
 */
export enum AcceptanceStatus {
  PENDING = 'pending',
  CUSTOMER_REVIEW = 'customer_review',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  ACCEPTED_WITH_EXCEPTIONS = 'accepted_with_exceptions',
}

/**
 * Resource type
 */
export enum ResourceType {
  TECHNICIAN = 'technician',
  EQUIPMENT = 'equipment',
  TOOL = 'tool',
  MATERIAL = 'material',
  VEHICLE = 'vehicle',
  SPECIALIST = 'specialist',
}

/**
 * Commissioning status
 */
export enum CommissioningStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  DEFERRED = 'deferred',
}

/**
 * Deployment priority
 */
export enum DeploymentPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

/**
 * Deployment plan data
 */
export interface DeploymentPlanData {
  assetId: string;
  siteId: string;
  locationId: string;
  deploymentType: DeploymentType;
  priority: DeploymentPriority;
  plannedStartDate: Date;
  plannedEndDate: Date;
  estimatedDuration: number; // minutes
  requiresSitePrep: boolean;
  sitePrepRequirements?: string[];
  installationSteps?: InstallationStep[];
  requiredResources?: ResourceRequirement[];
  prerequisites?: string[];
  notes?: string;
}

/**
 * Installation step
 */
export interface InstallationStep {
  sequence: number;
  phase: InstallationPhase;
  description: string;
  estimatedDuration: number;
  requiredResources?: string[];
  prerequisites?: number[]; // sequence numbers
  safetyRequirements?: string[];
  qualityChecks?: string[];
}

/**
 * Resource requirement
 */
export interface ResourceRequirement {
  resourceType: ResourceType;
  resourceId?: string;
  quantity: number;
  requiredFrom: Date;
  requiredUntil: Date;
  skillsRequired?: string[];
  certificationRequired?: string[];
}

/**
 * Site preparation data
 */
export interface SitePreparationData {
  deploymentId: string;
  requirements: SitePrepRequirement[];
  assignedTo?: string;
  scheduledDate?: Date;
  notes?: string;
}

/**
 * Site prep requirement
 */
export interface SitePrepRequirement {
  category: string;
  description: string;
  completed: boolean;
  completedBy?: string;
  completedDate?: Date;
  verificationRequired: boolean;
  verifiedBy?: string;
  notes?: string;
}

/**
 * Resource allocation data
 */
export interface ResourceAllocationData {
  deploymentId: string;
  resourceType: ResourceType;
  resourceId: string;
  allocatedFrom: Date;
  allocatedUntil: Date;
  primaryAssignment: boolean;
  notes?: string;
}

/**
 * Installation progress data
 */
export interface InstallationProgressData {
  deploymentId: string;
  currentPhase: InstallationPhase;
  currentStep: number;
  completedSteps: number[];
  issues?: InstallationIssue[];
  percentComplete: number;
  updatedBy: string;
}

/**
 * Installation issue
 */
export interface InstallationIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  reportedBy: string;
  reportedAt: Date;
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
}

/**
 * Configuration data
 */
export interface ConfigurationData {
  deploymentId: string;
  configurationType: string;
  parameters: Record<string, any>;
  configuredBy: string;
  configurationDate: Date;
  backupCreated: boolean;
  validationRequired: boolean;
  notes?: string;
}

/**
 * Test execution data
 */
export interface TestExecutionData {
  deploymentId: string;
  testPlanId: string;
  testCases: TestCase[];
  executedBy: string;
  executionDate: Date;
  environment: string;
  notes?: string;
}

/**
 * Test case
 */
export interface TestCase {
  testId: string;
  name: string;
  description: string;
  expectedResult: string;
  actualResult?: string;
  status: TestStatus;
  executedAt?: Date;
  defects?: string[];
  evidence?: string[];
}

/**
 * Acceptance criteria data
 */
export interface AcceptanceCriteriaData {
  deploymentId: string;
  criteria: AcceptanceCriterion[];
  acceptedBy?: string;
  acceptanceDate?: Date;
  exceptions?: string[];
  notes?: string;
}

/**
 * Acceptance criterion
 */
export interface AcceptanceCriterion {
  criterionId: string;
  description: string;
  met: boolean;
  verifiedBy?: string;
  verificationDate?: Date;
  evidence?: string[];
  notes?: string;
}

/**
 * Go-live data
 */
export interface GoLiveData {
  deploymentId: string;
  goLiveDate: Date;
  cutoverPlan: CutoverStep[];
  rollbackPlan: RollbackStep[];
  stakeholderApprovals: string[];
  communicationPlan?: string;
  supportPlan?: string;
}

/**
 * Cutover step
 */
export interface CutoverStep {
  sequence: number;
  description: string;
  responsibleParty: string;
  estimatedDuration: number;
  dependencies?: number[];
  rollbackProcedure?: string;
  completedAt?: Date;
}

/**
 * Rollback step
 */
export interface RollbackStep {
  sequence: number;
  description: string;
  trigger: string;
  responsibleParty: string;
  estimatedDuration: number;
  criticalData?: string[];
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Deployment Plan Model
 */
@Table({
  tableName: 'deployment_plans',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['deployment_number'], unique: true },
    { fields: ['asset_id'] },
    { fields: ['site_id'] },
    { fields: ['status'] },
    { fields: ['priority'] },
    { fields: ['planned_start_date'] },
  ],
})
export class DeploymentPlan extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Deployment number' })
  @Column({ type: DataType.STRING(50), unique: true })
  @Index
  deploymentNumber!: string;

  @ApiProperty({ description: 'Asset ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  assetId!: string;

  @ApiProperty({ description: 'Site ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  siteId!: string;

  @ApiProperty({ description: 'Location ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  locationId!: string;

  @ApiProperty({ description: 'Deployment type' })
  @Column({ type: DataType.ENUM(...Object.values(DeploymentType)), allowNull: false })
  deploymentType!: DeploymentType;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(DeploymentStatus)), defaultValue: DeploymentStatus.PLANNED })
  @Index
  status!: DeploymentStatus;

  @ApiProperty({ description: 'Priority' })
  @Column({ type: DataType.ENUM(...Object.values(DeploymentPriority)), defaultValue: DeploymentPriority.MEDIUM })
  @Index
  priority!: DeploymentPriority;

  @ApiProperty({ description: 'Planned start date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  plannedStartDate!: Date;

  @ApiProperty({ description: 'Planned end date' })
  @Column({ type: DataType.DATE, allowNull: false })
  plannedEndDate!: Date;

  @ApiProperty({ description: 'Actual start date' })
  @Column({ type: DataType.DATE })
  actualStartDate?: Date;

  @ApiProperty({ description: 'Actual end date' })
  @Column({ type: DataType.DATE })
  actualEndDate?: Date;

  @ApiProperty({ description: 'Estimated duration in minutes' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  estimatedDuration!: number;

  @ApiProperty({ description: 'Actual duration in minutes' })
  @Column({ type: DataType.INTEGER })
  actualDuration?: number;

  @ApiProperty({ description: 'Requires site preparation' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  requiresSitePrep!: boolean;

  @ApiProperty({ description: 'Site prep requirements' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  sitePrepRequirements?: string[];

  @ApiProperty({ description: 'Installation steps' })
  @Column({ type: DataType.JSONB })
  installationSteps?: InstallationStep[];

  @ApiProperty({ description: 'Required resources' })
  @Column({ type: DataType.JSONB })
  requiredResources?: ResourceRequirement[];

  @ApiProperty({ description: 'Prerequisites' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  prerequisites?: string[];

  @ApiProperty({ description: 'Current phase' })
  @Column({ type: DataType.ENUM(...Object.values(InstallationPhase)) })
  currentPhase?: InstallationPhase;

  @ApiProperty({ description: 'Percent complete' })
  @Column({ type: DataType.DECIMAL(5, 2), defaultValue: 0 })
  percentComplete!: number;

  @ApiProperty({ description: 'Project manager ID' })
  @Column({ type: DataType.UUID })
  projectManagerId?: string;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @ApiProperty({ description: 'Attachments' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  attachments?: string[];

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => SitePreparation)
  sitePreparations?: SitePreparation[];

  @HasMany(() => ResourceAllocation)
  resourceAllocations?: ResourceAllocation[];

  @HasMany(() => DeploymentConfiguration)
  configurations?: DeploymentConfiguration[];

  @HasMany(() => DeploymentTest)
  tests?: DeploymentTest[];

  @BeforeCreate
  static async generateDeploymentNumber(instance: DeploymentPlan) {
    if (!instance.deploymentNumber) {
      const count = await DeploymentPlan.count();
      const year = new Date().getFullYear();
      instance.deploymentNumber = `DEP-${year}-${String(count + 1).padStart(6, '0')}`;
    }
  }
}

/**
 * Site Preparation Model
 */
@Table({
  tableName: 'site_preparations',
  timestamps: true,
  indexes: [
    { fields: ['deployment_id'] },
    { fields: ['status'] },
    { fields: ['scheduled_date'] },
  ],
})
export class SitePreparation extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Deployment ID' })
  @ForeignKey(() => DeploymentPlan)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  deploymentId!: string;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(SitePrepStatus)), defaultValue: SitePrepStatus.PENDING })
  @Index
  status!: SitePrepStatus;

  @ApiProperty({ description: 'Requirements' })
  @Column({ type: DataType.JSONB, allowNull: false })
  requirements!: SitePrepRequirement[];

  @ApiProperty({ description: 'Assigned to user ID' })
  @Column({ type: DataType.UUID })
  assignedTo?: string;

  @ApiProperty({ description: 'Scheduled date' })
  @Column({ type: DataType.DATE })
  @Index
  scheduledDate?: Date;

  @ApiProperty({ description: 'Started date' })
  @Column({ type: DataType.DATE })
  startedDate?: Date;

  @ApiProperty({ description: 'Completed date' })
  @Column({ type: DataType.DATE })
  completedDate?: Date;

  @ApiProperty({ description: 'Verification checklist' })
  @Column({ type: DataType.JSONB })
  verificationChecklist?: Record<string, any>;

  @ApiProperty({ description: 'Photos' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  photos?: string[];

  @ApiProperty({ description: 'Documents' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  documents?: string[];

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => DeploymentPlan)
  deployment?: DeploymentPlan;
}

/**
 * Resource Allocation Model
 */
@Table({
  tableName: 'resource_allocations',
  timestamps: true,
  indexes: [
    { fields: ['deployment_id'] },
    { fields: ['resource_type'] },
    { fields: ['resource_id'] },
    { fields: ['allocated_from'] },
    { fields: ['allocated_until'] },
  ],
})
export class ResourceAllocation extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Deployment ID' })
  @ForeignKey(() => DeploymentPlan)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  deploymentId!: string;

  @ApiProperty({ description: 'Resource type' })
  @Column({ type: DataType.ENUM(...Object.values(ResourceType)), allowNull: false })
  @Index
  resourceType!: ResourceType;

  @ApiProperty({ description: 'Resource ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  resourceId!: string;

  @ApiProperty({ description: 'Allocated from' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  allocatedFrom!: Date;

  @ApiProperty({ description: 'Allocated until' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  allocatedUntil!: Date;

  @ApiProperty({ description: 'Primary assignment' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  primaryAssignment!: boolean;

  @ApiProperty({ description: 'Utilization percentage' })
  @Column({ type: DataType.DECIMAL(5, 2) })
  utilizationPercentage?: number;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => DeploymentPlan)
  deployment?: DeploymentPlan;
}

/**
 * Installation Progress Model
 */
@Table({
  tableName: 'installation_progress',
  timestamps: true,
  indexes: [
    { fields: ['deployment_id'] },
    { fields: ['current_phase'] },
    { fields: ['updated_at'] },
  ],
})
export class InstallationProgress extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Deployment ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  deploymentId!: string;

  @ApiProperty({ description: 'Current phase' })
  @Column({ type: DataType.ENUM(...Object.values(InstallationPhase)), allowNull: false })
  @Index
  currentPhase!: InstallationPhase;

  @ApiProperty({ description: 'Current step' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  currentStep!: number;

  @ApiProperty({ description: 'Completed steps' })
  @Column({ type: DataType.ARRAY(DataType.INTEGER), defaultValue: [] })
  completedSteps!: number[];

  @ApiProperty({ description: 'Issues' })
  @Column({ type: DataType.JSONB })
  issues?: InstallationIssue[];

  @ApiProperty({ description: 'Percent complete' })
  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false })
  percentComplete!: number;

  @ApiProperty({ description: 'Updated by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  updatedBy!: string;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Deployment Configuration Model
 */
@Table({
  tableName: 'deployment_configurations',
  timestamps: true,
  indexes: [
    { fields: ['deployment_id'] },
    { fields: ['configuration_type'] },
    { fields: ['configuration_date'] },
  ],
})
export class DeploymentConfiguration extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Deployment ID' })
  @ForeignKey(() => DeploymentPlan)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  deploymentId!: string;

  @ApiProperty({ description: 'Configuration type' })
  @Column({ type: DataType.STRING(100), allowNull: false })
  @Index
  configurationType!: string;

  @ApiProperty({ description: 'Configuration parameters' })
  @Column({ type: DataType.JSONB, allowNull: false })
  parameters!: Record<string, any>;

  @ApiProperty({ description: 'Configured by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  configuredBy!: string;

  @ApiProperty({ description: 'Configuration date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  configurationDate!: Date;

  @ApiProperty({ description: 'Backup created' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  backupCreated!: boolean;

  @ApiProperty({ description: 'Backup location' })
  @Column({ type: DataType.STRING(500) })
  backupLocation?: string;

  @ApiProperty({ description: 'Validation required' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  validationRequired!: boolean;

  @ApiProperty({ description: 'Validated' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  validated!: boolean;

  @ApiProperty({ description: 'Validated by user ID' })
  @Column({ type: DataType.UUID })
  validatedBy?: string;

  @ApiProperty({ description: 'Validation date' })
  @Column({ type: DataType.DATE })
  validationDate?: Date;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => DeploymentPlan)
  deployment?: DeploymentPlan;
}

/**
 * Deployment Test Model
 */
@Table({
  tableName: 'deployment_tests',
  timestamps: true,
  indexes: [
    { fields: ['deployment_id'] },
    { fields: ['test_plan_id'] },
    { fields: ['overall_status'] },
    { fields: ['execution_date'] },
  ],
})
export class DeploymentTest extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Deployment ID' })
  @ForeignKey(() => DeploymentPlan)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  deploymentId!: string;

  @ApiProperty({ description: 'Test plan ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  testPlanId!: string;

  @ApiProperty({ description: 'Test cases' })
  @Column({ type: DataType.JSONB, allowNull: false })
  testCases!: TestCase[];

  @ApiProperty({ description: 'Overall status' })
  @Column({ type: DataType.ENUM(...Object.values(TestStatus)), defaultValue: TestStatus.NOT_STARTED })
  @Index
  overallStatus!: TestStatus;

  @ApiProperty({ description: 'Executed by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  executedBy!: string;

  @ApiProperty({ description: 'Execution date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  executionDate!: Date;

  @ApiProperty({ description: 'Environment' })
  @Column({ type: DataType.STRING(100), allowNull: false })
  environment!: string;

  @ApiProperty({ description: 'Test results summary' })
  @Column({ type: DataType.JSONB })
  resultsSummary?: {
    totalTests: number;
    passed: number;
    failed: number;
    conditionalPass: number;
    notStarted: number;
  };

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @ApiProperty({ description: 'Attachments' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  attachments?: string[];

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => DeploymentPlan)
  deployment?: DeploymentPlan;
}

/**
 * Deployment Acceptance Model
 */
@Table({
  tableName: 'deployment_acceptances',
  timestamps: true,
  indexes: [
    { fields: ['deployment_id'], unique: true },
    { fields: ['status'] },
    { fields: ['acceptance_date'] },
  ],
})
export class DeploymentAcceptance extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Deployment ID' })
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  @Index
  deploymentId!: string;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(AcceptanceStatus)), defaultValue: AcceptanceStatus.PENDING })
  @Index
  status!: AcceptanceStatus;

  @ApiProperty({ description: 'Acceptance criteria' })
  @Column({ type: DataType.JSONB, allowNull: false })
  criteria!: AcceptanceCriterion[];

  @ApiProperty({ description: 'Accepted by user ID' })
  @Column({ type: DataType.UUID })
  acceptedBy?: string;

  @ApiProperty({ description: 'Acceptance date' })
  @Column({ type: DataType.DATE })
  @Index
  acceptanceDate?: Date;

  @ApiProperty({ description: 'Exceptions' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  exceptions?: string[];

  @ApiProperty({ description: 'Sign-off documents' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  signOffDocuments?: string[];

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Go-Live Plan Model
 */
@Table({
  tableName: 'go_live_plans',
  timestamps: true,
  indexes: [
    { fields: ['deployment_id'], unique: true },
    { fields: ['go_live_date'] },
    { fields: ['status'] },
  ],
})
export class GoLivePlan extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Deployment ID' })
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  @Index
  deploymentId!: string;

  @ApiProperty({ description: 'Go-live date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  goLiveDate!: Date;

  @ApiProperty({ description: 'Actual go-live date' })
  @Column({ type: DataType.DATE })
  actualGoLiveDate?: Date;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM('planned', 'ready', 'in_progress', 'completed', 'aborted'), defaultValue: 'planned' })
  @Index
  status!: string;

  @ApiProperty({ description: 'Cutover plan' })
  @Column({ type: DataType.JSONB, allowNull: false })
  cutoverPlan!: CutoverStep[];

  @ApiProperty({ description: 'Rollback plan' })
  @Column({ type: DataType.JSONB, allowNull: false })
  rollbackPlan!: RollbackStep[];

  @ApiProperty({ description: 'Stakeholder approvals' })
  @Column({ type: DataType.ARRAY(DataType.UUID), allowNull: false })
  stakeholderApprovals!: string[];

  @ApiProperty({ description: 'All approvals received' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  allApprovalsReceived!: boolean;

  @ApiProperty({ description: 'Communication plan' })
  @Column({ type: DataType.TEXT })
  communicationPlan?: string;

  @ApiProperty({ description: 'Support plan' })
  @Column({ type: DataType.TEXT })
  supportPlan?: string;

  @ApiProperty({ description: 'Rollback triggered' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  rollbackTriggered!: boolean;

  @ApiProperty({ description: 'Rollback reason' })
  @Column({ type: DataType.TEXT })
  rollbackReason?: string;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Commissioning Record Model
 */
@Table({
  tableName: 'commissioning_records',
  timestamps: true,
  indexes: [
    { fields: ['deployment_id'] },
    { fields: ['status'] },
    { fields: ['commissioning_date'] },
  ],
})
export class CommissioningRecord extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Deployment ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  deploymentId!: string;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(CommissioningStatus)), defaultValue: CommissioningStatus.NOT_STARTED })
  @Index
  status!: CommissioningStatus;

  @ApiProperty({ description: 'Commissioning date' })
  @Column({ type: DataType.DATE })
  @Index
  commissioningDate?: Date;

  @ApiProperty({ description: 'Commissioned by user ID' })
  @Column({ type: DataType.UUID })
  commissionedBy?: string;

  @ApiProperty({ description: 'Commissioning checklist' })
  @Column({ type: DataType.JSONB })
  commissioningChecklist?: Record<string, any>;

  @ApiProperty({ description: 'Performance baseline' })
  @Column({ type: DataType.JSONB })
  performanceBaseline?: Record<string, any>;

  @ApiProperty({ description: 'Calibration results' })
  @Column({ type: DataType.JSONB })
  calibrationResults?: Record<string, any>;

  @ApiProperty({ description: 'Training completed' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  trainingCompleted!: boolean;

  @ApiProperty({ description: 'Documentation delivered' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  documentationDelivered!: boolean;

  @ApiProperty({ description: 'Warranty activated' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  warrantyActivated!: boolean;

  @ApiProperty({ description: 'Notes' })
  @Column({ type: DataType.TEXT })
  notes?: string;

  @ApiProperty({ description: 'Attachments' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  attachments?: string[];

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

// ============================================================================
// DEPLOYMENT PLANNING FUNCTIONS
// ============================================================================

/**
 * Creates a deployment plan
 *
 * @param data - Deployment plan data
 * @param transaction - Optional database transaction
 * @returns Created deployment plan
 *
 * @example
 * ```typescript
 * const plan = await createDeploymentPlan({
 *   assetId: 'asset-123',
 *   siteId: 'site-456',
 *   locationId: 'loc-789',
 *   deploymentType: DeploymentType.NEW_INSTALLATION,
 *   priority: DeploymentPriority.HIGH,
 *   plannedStartDate: new Date('2024-06-01'),
 *   plannedEndDate: new Date('2024-06-05'),
 *   estimatedDuration: 2400,
 *   requiresSitePrep: true
 * });
 * ```
 */
export async function createDeploymentPlan(
  data: DeploymentPlanData,
  transaction?: Transaction
): Promise<DeploymentPlan> {
  const plan = await DeploymentPlan.create(
    {
      ...data,
      status: DeploymentStatus.PLANNED,
      percentComplete: 0,
    },
    { transaction }
  );

  return plan;
}

/**
 * Updates deployment plan
 *
 * @param planId - Plan identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated plan
 *
 * @example
 * ```typescript
 * await updateDeploymentPlan('plan-123', {
 *   priority: DeploymentPriority.CRITICAL,
 *   plannedStartDate: new Date('2024-05-25')
 * });
 * ```
 */
export async function updateDeploymentPlan(
  planId: string,
  updates: Partial<DeploymentPlan>,
  transaction?: Transaction
): Promise<DeploymentPlan> {
  const plan = await DeploymentPlan.findByPk(planId, { transaction });
  if (!plan) {
    throw new NotFoundException(`Deployment plan ${planId} not found`);
  }

  if (plan.status === DeploymentStatus.COMPLETED || plan.status === DeploymentStatus.CANCELLED) {
    throw new BadRequestException('Cannot update completed or cancelled deployment');
  }

  await plan.update(updates, { transaction });
  return plan;
}

/**
 * Schedules a deployment
 *
 * @param planId - Plan identifier
 * @param scheduledDate - Scheduled start date
 * @param transaction - Optional database transaction
 * @returns Updated plan
 *
 * @example
 * ```typescript
 * await scheduleDeployment('plan-123', new Date('2024-06-01'));
 * ```
 */
export async function scheduleDeployment(
  planId: string,
  scheduledDate: Date,
  transaction?: Transaction
): Promise<DeploymentPlan> {
  const plan = await DeploymentPlan.findByPk(planId, { transaction });
  if (!plan) {
    throw new NotFoundException(`Deployment plan ${planId} not found`);
  }

  if (plan.status !== DeploymentStatus.PLANNED) {
    throw new BadRequestException('Can only schedule planned deployments');
  }

  await plan.update({
    status: DeploymentStatus.SCHEDULED,
    plannedStartDate: scheduledDate,
  }, { transaction });

  return plan;
}

/**
 * Gets deployment plans by status
 *
 * @param status - Deployment status
 * @param options - Query options
 * @returns Deployment plans
 *
 * @example
 * ```typescript
 * const scheduled = await getDeploymentsByStatus(DeploymentStatus.SCHEDULED);
 * ```
 */
export async function getDeploymentsByStatus(
  status: DeploymentStatus,
  options: FindOptions = {}
): Promise<DeploymentPlan[]> {
  return DeploymentPlan.findAll({
    where: { status },
    order: [['plannedStartDate', 'ASC']],
    ...options,
  });
}

/**
 * Gets deployments by site
 *
 * @param siteId - Site identifier
 * @param options - Query options
 * @returns Deployments
 *
 * @example
 * ```typescript
 * const siteDeployments = await getDeploymentsBySite('site-123');
 * ```
 */
export async function getDeploymentsBySite(
  siteId: string,
  options: FindOptions = {}
): Promise<DeploymentPlan[]> {
  return DeploymentPlan.findAll({
    where: { siteId },
    order: [['plannedStartDate', 'DESC']],
    ...options,
  });
}

/**
 * Gets deployments by asset
 *
 * @param assetId - Asset identifier
 * @returns Deployment history
 *
 * @example
 * ```typescript
 * const history = await getDeploymentsByAsset('asset-123');
 * ```
 */
export async function getDeploymentsByAsset(assetId: string): Promise<DeploymentPlan[]> {
  return DeploymentPlan.findAll({
    where: { assetId },
    order: [['createdAt', 'DESC']],
  });
}

/**
 * Cancels a deployment
 *
 * @param planId - Plan identifier
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Updated plan
 *
 * @example
 * ```typescript
 * await cancelDeployment('plan-123', 'Site not ready');
 * ```
 */
export async function cancelDeployment(
  planId: string,
  reason: string,
  transaction?: Transaction
): Promise<DeploymentPlan> {
  const plan = await DeploymentPlan.findByPk(planId, { transaction });
  if (!plan) {
    throw new NotFoundException(`Deployment plan ${planId} not found`);
  }

  if (plan.status === DeploymentStatus.COMPLETED) {
    throw new BadRequestException('Cannot cancel completed deployment');
  }

  await plan.update({
    status: DeploymentStatus.CANCELLED,
    notes: `${plan.notes || ''}\nCancelled: ${reason}`,
  }, { transaction });

  return plan;
}

// ============================================================================
// SITE PREPARATION FUNCTIONS
// ============================================================================

/**
 * Creates site preparation record
 *
 * @param data - Site prep data
 * @param transaction - Optional database transaction
 * @returns Created site preparation
 *
 * @example
 * ```typescript
 * const prep = await createSitePreparation({
 *   deploymentId: 'dep-123',
 *   requirements: [{
 *     category: 'Electrical',
 *     description: 'Install 220V outlet',
 *     completed: false,
 *     verificationRequired: true
 *   }],
 *   assignedTo: 'tech-456',
 *   scheduledDate: new Date('2024-05-28')
 * });
 * ```
 */
export async function createSitePreparation(
  data: SitePreparationData,
  transaction?: Transaction
): Promise<SitePreparation> {
  const deployment = await DeploymentPlan.findByPk(data.deploymentId, { transaction });
  if (!deployment) {
    throw new NotFoundException(`Deployment ${data.deploymentId} not found`);
  }

  const prep = await SitePreparation.create(
    {
      ...data,
      status: SitePrepStatus.PENDING,
    },
    { transaction }
  );

  return prep;
}

/**
 * Updates site preparation requirement
 *
 * @param prepId - Site prep identifier
 * @param requirementIndex - Index of requirement to update
 * @param updates - Requirement updates
 * @param transaction - Optional database transaction
 * @returns Updated site preparation
 *
 * @example
 * ```typescript
 * await updateSitePrepRequirement('prep-123', 0, {
 *   completed: true,
 *   completedBy: 'tech-456',
 *   completedDate: new Date()
 * });
 * ```
 */
export async function updateSitePrepRequirement(
  prepId: string,
  requirementIndex: number,
  updates: Partial<SitePrepRequirement>,
  transaction?: Transaction
): Promise<SitePreparation> {
  const prep = await SitePreparation.findByPk(prepId, { transaction });
  if (!prep) {
    throw new NotFoundException(`Site preparation ${prepId} not found`);
  }

  const requirements = [...prep.requirements];
  if (requirementIndex >= requirements.length) {
    throw new BadRequestException('Invalid requirement index');
  }

  requirements[requirementIndex] = { ...requirements[requirementIndex], ...updates };
  await prep.update({ requirements }, { transaction });

  // Check if all requirements completed
  const allCompleted = requirements.every(r => r.completed);
  if (allCompleted && prep.status !== SitePrepStatus.COMPLETED) {
    await prep.update({
      status: SitePrepStatus.COMPLETED,
      completedDate: new Date(),
    }, { transaction });

    // Update deployment status
    await DeploymentPlan.update(
      { status: DeploymentStatus.READY_FOR_DEPLOYMENT },
      { where: { id: prep.deploymentId }, transaction }
    );
  }

  return prep;
}

/**
 * Starts site preparation
 *
 * @param prepId - Site prep identifier
 * @param transaction - Optional database transaction
 * @returns Updated site preparation
 *
 * @example
 * ```typescript
 * await startSitePreparation('prep-123');
 * ```
 */
export async function startSitePreparation(
  prepId: string,
  transaction?: Transaction
): Promise<SitePreparation> {
  const prep = await SitePreparation.findByPk(prepId, { transaction });
  if (!prep) {
    throw new NotFoundException(`Site preparation ${prepId} not found`);
  }

  await prep.update({
    status: SitePrepStatus.IN_PROGRESS,
    startedDate: new Date(),
  }, { transaction });

  // Update deployment status
  await DeploymentPlan.update(
    { status: DeploymentStatus.SITE_PREP_IN_PROGRESS },
    { where: { id: prep.deploymentId }, transaction }
  );

  return prep;
}

/**
 * Completes site preparation
 *
 * @param prepId - Site prep identifier
 * @param verificationData - Verification checklist data
 * @param transaction - Optional database transaction
 * @returns Updated site preparation
 *
 * @example
 * ```typescript
 * await completeSitePreparation('prep-123', {
 *   electricalVerified: true,
 *   structuralVerified: true,
 *   safetyVerified: true
 * });
 * ```
 */
export async function completeSitePreparation(
  prepId: string,
  verificationData: Record<string, any>,
  transaction?: Transaction
): Promise<SitePreparation> {
  const prep = await SitePreparation.findByPk(prepId, { transaction });
  if (!prep) {
    throw new NotFoundException(`Site preparation ${prepId} not found`);
  }

  await prep.update({
    status: SitePrepStatus.COMPLETED,
    completedDate: new Date(),
    verificationChecklist: verificationData,
  }, { transaction });

  // Update deployment status
  await DeploymentPlan.update(
    { status: DeploymentStatus.READY_FOR_DEPLOYMENT },
    { where: { id: prep.deploymentId }, transaction }
  );

  return prep;
}

/**
 * Gets site preparation for deployment
 *
 * @param deploymentId - Deployment identifier
 * @returns Site preparation records
 *
 * @example
 * ```typescript
 * const preps = await getSitePreparationForDeployment('dep-123');
 * ```
 */
export async function getSitePreparationForDeployment(
  deploymentId: string
): Promise<SitePreparation[]> {
  return SitePreparation.findAll({
    where: { deploymentId },
    order: [['scheduledDate', 'ASC']],
  });
}

// ============================================================================
// RESOURCE ALLOCATION FUNCTIONS
// ============================================================================

/**
 * Allocates resource to deployment
 *
 * @param data - Resource allocation data
 * @param transaction - Optional database transaction
 * @returns Created allocation
 *
 * @example
 * ```typescript
 * const allocation = await allocateDeploymentResource({
 *   deploymentId: 'dep-123',
 *   resourceType: ResourceType.TECHNICIAN,
 *   resourceId: 'tech-456',
 *   allocatedFrom: new Date('2024-06-01 08:00'),
 *   allocatedUntil: new Date('2024-06-01 17:00'),
 *   primaryAssignment: true
 * });
 * ```
 */
export async function allocateDeploymentResource(
  data: ResourceAllocationData,
  transaction?: Transaction
): Promise<ResourceAllocation> {
  // Check for conflicts
  const conflicts = await ResourceAllocation.findAll({
    where: {
      resourceId: data.resourceId,
      [Op.or]: [
        {
          allocatedFrom: { [Op.between]: [data.allocatedFrom, data.allocatedUntil] },
        },
        {
          allocatedUntil: { [Op.between]: [data.allocatedFrom, data.allocatedUntil] },
        },
      ],
    },
    transaction,
  });

  if (conflicts.length > 0) {
    throw new ConflictException('Resource already allocated for this time period');
  }

  const allocation = await ResourceAllocation.create(data, { transaction });
  return allocation;
}

/**
 * Deallocates resource from deployment
 *
 * @param allocationId - Allocation identifier
 * @param transaction - Optional database transaction
 * @returns Deletion result
 *
 * @example
 * ```typescript
 * await deallocateDeploymentResource('alloc-123');
 * ```
 */
export async function deallocateDeploymentResource(
  allocationId: string,
  transaction?: Transaction
): Promise<boolean> {
  const allocation = await ResourceAllocation.findByPk(allocationId, { transaction });
  if (!allocation) {
    throw new NotFoundException(`Allocation ${allocationId} not found`);
  }

  await allocation.destroy({ transaction });
  return true;
}

/**
 * Gets resource allocations for deployment
 *
 * @param deploymentId - Deployment identifier
 * @returns Resource allocations
 *
 * @example
 * ```typescript
 * const resources = await getDeploymentResourceAllocations('dep-123');
 * ```
 */
export async function getDeploymentResourceAllocations(
  deploymentId: string
): Promise<ResourceAllocation[]> {
  return ResourceAllocation.findAll({
    where: { deploymentId },
    order: [['allocatedFrom', 'ASC']],
  });
}

/**
 * Gets resource availability
 *
 * @param resourceId - Resource identifier
 * @param startDate - Start of period
 * @param endDate - End of period
 * @returns Availability status
 *
 * @example
 * ```typescript
 * const available = await checkResourceAvailability(
 *   'tech-123',
 *   new Date('2024-06-01'),
 *   new Date('2024-06-05')
 * );
 * ```
 */
export async function checkResourceAvailability(
  resourceId: string,
  startDate: Date,
  endDate: Date
): Promise<{ available: boolean; allocations: ResourceAllocation[] }> {
  const allocations = await ResourceAllocation.findAll({
    where: {
      resourceId,
      [Op.or]: [
        {
          allocatedFrom: { [Op.between]: [startDate, endDate] },
        },
        {
          allocatedUntil: { [Op.between]: [startDate, endDate] },
        },
      ],
    },
  });

  return {
    available: allocations.length === 0,
    allocations,
  };
}

/**
 * Bulk allocates resources
 *
 * @param deploymentId - Deployment identifier
 * @param resources - Resource allocations
 * @param transaction - Optional database transaction
 * @returns Created allocations
 *
 * @example
 * ```typescript
 * await bulkAllocateResources('dep-123', [
 *   { resourceType: ResourceType.TECHNICIAN, resourceId: 'tech-1', ... },
 *   { resourceType: ResourceType.EQUIPMENT, resourceId: 'crane-1', ... }
 * ]);
 * ```
 */
export async function bulkAllocateResources(
  deploymentId: string,
  resources: ResourceAllocationData[],
  transaction?: Transaction
): Promise<ResourceAllocation[]> {
  const allocations: ResourceAllocation[] = [];

  for (const resource of resources) {
    try {
      const allocation = await allocateDeploymentResource(
        { ...resource, deploymentId },
        transaction
      );
      allocations.push(allocation);
    } catch (error: any) {
      // Continue with other resources, collect errors
      console.error(`Failed to allocate resource ${resource.resourceId}:`, error.message);
    }
  }

  return allocations;
}

// ============================================================================
// INSTALLATION EXECUTION FUNCTIONS
// ============================================================================

/**
 * Starts deployment execution
 *
 * @param deploymentId - Deployment identifier
 * @param startedBy - User starting deployment
 * @param transaction - Optional database transaction
 * @returns Updated deployment
 *
 * @example
 * ```typescript
 * await startDeploymentExecution('dep-123', 'pm-456');
 * ```
 */
export async function startDeploymentExecution(
  deploymentId: string,
  startedBy: string,
  transaction?: Transaction
): Promise<DeploymentPlan> {
  const deployment = await DeploymentPlan.findByPk(deploymentId, { transaction });
  if (!deployment) {
    throw new NotFoundException(`Deployment ${deploymentId} not found`);
  }

  if (deployment.status !== DeploymentStatus.READY_FOR_DEPLOYMENT &&
      deployment.status !== DeploymentStatus.SCHEDULED) {
    throw new BadRequestException('Deployment not ready for execution');
  }

  await deployment.update({
    status: DeploymentStatus.IN_PROGRESS,
    actualStartDate: new Date(),
    currentPhase: InstallationPhase.PRE_INSTALLATION,
  }, { transaction });

  return deployment;
}

/**
 * Updates installation progress
 *
 * @param data - Progress data
 * @param transaction - Optional database transaction
 * @returns Created progress record
 *
 * @example
 * ```typescript
 * await updateInstallationProgress({
 *   deploymentId: 'dep-123',
 *   currentPhase: InstallationPhase.PHYSICAL_INSTALLATION,
 *   currentStep: 3,
 *   completedSteps: [1, 2],
 *   percentComplete: 25,
 *   updatedBy: 'tech-456'
 * });
 * ```
 */
export async function updateInstallationProgress(
  data: InstallationProgressData,
  transaction?: Transaction
): Promise<InstallationProgress> {
  const progress = await InstallationProgress.create(data, { transaction });

  // Update deployment
  await DeploymentPlan.update(
    {
      currentPhase: data.currentPhase,
      percentComplete: data.percentComplete,
    },
    {
      where: { id: data.deploymentId },
      transaction,
    }
  );

  return progress;
}

/**
 * Records installation issue
 *
 * @param deploymentId - Deployment identifier
 * @param issue - Issue details
 * @param transaction - Optional database transaction
 * @returns Updated progress
 *
 * @example
 * ```typescript
 * await recordInstallationIssue('dep-123', {
 *   severity: 'high',
 *   description: 'Missing mounting hardware',
 *   reportedBy: 'tech-456',
 *   reportedAt: new Date()
 * });
 * ```
 */
export async function recordInstallationIssue(
  deploymentId: string,
  issue: InstallationIssue,
  transaction?: Transaction
): Promise<InstallationProgress> {
  const latestProgress = await InstallationProgress.findOne({
    where: { deploymentId },
    order: [['createdAt', 'DESC']],
    transaction,
  });

  if (!latestProgress) {
    throw new NotFoundException('No installation progress found');
  }

  const issues = latestProgress.issues || [];
  issues.push(issue);

  await latestProgress.update({ issues }, { transaction });

  // Update deployment status if critical
  if (issue.severity === 'critical') {
    await DeploymentPlan.update(
      { status: DeploymentStatus.ON_HOLD },
      { where: { id: deploymentId }, transaction }
    );
  }

  return latestProgress;
}

/**
 * Resolves installation issue
 *
 * @param deploymentId - Deployment identifier
 * @param issueIndex - Issue index
 * @param resolution - Resolution details
 * @param resolvedBy - User resolving issue
 * @param transaction - Optional database transaction
 * @returns Updated progress
 *
 * @example
 * ```typescript
 * await resolveInstallationIssue('dep-123', 0, 'Hardware procured and installed', 'tech-456');
 * ```
 */
export async function resolveInstallationIssue(
  deploymentId: string,
  issueIndex: number,
  resolution: string,
  resolvedBy: string,
  transaction?: Transaction
): Promise<InstallationProgress> {
  const latestProgress = await InstallationProgress.findOne({
    where: { deploymentId },
    order: [['createdAt', 'DESC']],
    transaction,
  });

  if (!latestProgress) {
    throw new NotFoundException('No installation progress found');
  }

  const issues = latestProgress.issues || [];
  if (issueIndex >= issues.length) {
    throw new BadRequestException('Invalid issue index');
  }

  issues[issueIndex] = {
    ...issues[issueIndex],
    resolution,
    resolvedBy,
    resolvedAt: new Date(),
  };

  await latestProgress.update({ issues }, { transaction });
  return latestProgress;
}

/**
 * Gets installation progress history
 *
 * @param deploymentId - Deployment identifier
 * @returns Progress records
 *
 * @example
 * ```typescript
 * const history = await getInstallationProgressHistory('dep-123');
 * ```
 */
export async function getInstallationProgressHistory(
  deploymentId: string
): Promise<InstallationProgress[]> {
  return InstallationProgress.findAll({
    where: { deploymentId },
    order: [['createdAt', 'ASC']],
  });
}

// ============================================================================
// CONFIGURATION MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Records deployment configuration
 *
 * @param data - Configuration data
 * @param transaction - Optional database transaction
 * @returns Created configuration
 *
 * @example
 * ```typescript
 * const config = await recordDeploymentConfiguration({
 *   deploymentId: 'dep-123',
 *   configurationType: 'network',
 *   parameters: { ip: '192.168.1.100', subnet: '255.255.255.0' },
 *   configuredBy: 'tech-456',
 *   configurationDate: new Date(),
 *   backupCreated: true,
 *   validationRequired: true
 * });
 * ```
 */
export async function recordDeploymentConfiguration(
  data: ConfigurationData,
  transaction?: Transaction
): Promise<DeploymentConfiguration> {
  const config = await DeploymentConfiguration.create(data, { transaction });
  return config;
}

/**
 * Validates configuration
 *
 * @param configId - Configuration identifier
 * @param validatedBy - User validating
 * @param transaction - Optional database transaction
 * @returns Updated configuration
 *
 * @example
 * ```typescript
 * await validateConfiguration('config-123', 'engineer-789');
 * ```
 */
export async function validateConfiguration(
  configId: string,
  validatedBy: string,
  transaction?: Transaction
): Promise<DeploymentConfiguration> {
  const config = await DeploymentConfiguration.findByPk(configId, { transaction });
  if (!config) {
    throw new NotFoundException(`Configuration ${configId} not found`);
  }

  await config.update({
    validated: true,
    validatedBy,
    validationDate: new Date(),
  }, { transaction });

  return config;
}

/**
 * Gets configurations for deployment
 *
 * @param deploymentId - Deployment identifier
 * @returns Configuration records
 *
 * @example
 * ```typescript
 * const configs = await getDeploymentConfigurations('dep-123');
 * ```
 */
export async function getDeploymentConfigurations(
  deploymentId: string
): Promise<DeploymentConfiguration[]> {
  return DeploymentConfiguration.findAll({
    where: { deploymentId },
    order: [['configurationDate', 'DESC']],
  });
}

// ============================================================================
// TESTING AND ACCEPTANCE FUNCTIONS
// ============================================================================

/**
 * Executes deployment tests
 *
 * @param data - Test execution data
 * @param transaction - Optional database transaction
 * @returns Created test record
 *
 * @example
 * ```typescript
 * const test = await executeDeploymentTests({
 *   deploymentId: 'dep-123',
 *   testPlanId: 'plan-456',
 *   testCases: [{
 *     testId: 'test-1',
 *     name: 'Power on test',
 *     description: 'Verify system powers on correctly',
 *     expectedResult: 'System starts within 30 seconds',
 *     status: TestStatus.NOT_STARTED
 *   }],
 *   executedBy: 'tester-789',
 *   executionDate: new Date(),
 *   environment: 'production'
 * });
 * ```
 */
export async function executeDeploymentTests(
  data: TestExecutionData,
  transaction?: Transaction
): Promise<DeploymentTest> {
  const test = await DeploymentTest.create(
    {
      ...data,
      overallStatus: TestStatus.IN_PROGRESS,
    },
    { transaction }
  );

  // Update deployment status
  await DeploymentPlan.update(
    { status: DeploymentStatus.TESTING },
    { where: { id: data.deploymentId }, transaction }
  );

  return test;
}

/**
 * Updates test case result
 *
 * @param testId - Test identifier
 * @param testCaseId - Test case identifier
 * @param result - Test result
 * @param transaction - Optional database transaction
 * @returns Updated test
 *
 * @example
 * ```typescript
 * await updateTestCaseResult('test-123', 'case-1', {
 *   actualResult: 'System started in 15 seconds',
 *   status: TestStatus.PASSED,
 *   executedAt: new Date()
 * });
 * ```
 */
export async function updateTestCaseResult(
  testId: string,
  testCaseId: string,
  result: Partial<TestCase>,
  transaction?: Transaction
): Promise<DeploymentTest> {
  const test = await DeploymentTest.findByPk(testId, { transaction });
  if (!test) {
    throw new NotFoundException(`Test ${testId} not found`);
  }

  const testCases = test.testCases.map(tc =>
    tc.testId === testCaseId ? { ...tc, ...result } : tc
  );

  // Calculate summary
  const summary = {
    totalTests: testCases.length,
    passed: testCases.filter(tc => tc.status === TestStatus.PASSED).length,
    failed: testCases.filter(tc => tc.status === TestStatus.FAILED).length,
    conditionalPass: testCases.filter(tc => tc.status === TestStatus.CONDITIONAL_PASS).length,
    notStarted: testCases.filter(tc => tc.status === TestStatus.NOT_STARTED).length,
  };

  // Determine overall status
  let overallStatus = test.overallStatus;
  if (summary.notStarted === 0) {
    if (summary.failed > 0) {
      overallStatus = TestStatus.FAILED;
    } else if (summary.conditionalPass > 0) {
      overallStatus = TestStatus.CONDITIONAL_PASS;
    } else {
      overallStatus = TestStatus.PASSED;
    }
  }

  await test.update({
    testCases,
    resultsSummary: summary,
    overallStatus,
  }, { transaction });

  return test;
}

/**
 * Creates acceptance criteria
 *
 * @param data - Acceptance data
 * @param transaction - Optional database transaction
 * @returns Created acceptance record
 *
 * @example
 * ```typescript
 * const acceptance = await createAcceptanceCriteria({
 *   deploymentId: 'dep-123',
 *   criteria: [{
 *     criterionId: 'crit-1',
 *     description: 'All tests passed',
 *     met: true,
 *     verifiedBy: 'qa-456',
 *     verificationDate: new Date()
 *   }]
 * });
 * ```
 */
export async function createAcceptanceCriteria(
  data: AcceptanceCriteriaData,
  transaction?: Transaction
): Promise<DeploymentAcceptance> {
  const acceptance = await DeploymentAcceptance.create(
    {
      ...data,
      status: AcceptanceStatus.PENDING,
    },
    { transaction }
  );

  return acceptance;
}

/**
 * Records acceptance decision
 *
 * @param deploymentId - Deployment identifier
 * @param accepted - Whether accepted
 * @param acceptedBy - User accepting
 * @param exceptions - Acceptance exceptions
 * @param transaction - Optional database transaction
 * @returns Updated acceptance
 *
 * @example
 * ```typescript
 * await recordAcceptanceDecision('dep-123', true, 'customer-789', []);
 * ```
 */
export async function recordAcceptanceDecision(
  deploymentId: string,
  accepted: boolean,
  acceptedBy: string,
  exceptions: string[] = [],
  transaction?: Transaction
): Promise<DeploymentAcceptance> {
  const acceptance = await DeploymentAcceptance.findOne({
    where: { deploymentId },
    transaction,
  });

  if (!acceptance) {
    throw new NotFoundException('Acceptance criteria not found');
  }

  const status = accepted
    ? (exceptions.length > 0 ? AcceptanceStatus.ACCEPTED_WITH_EXCEPTIONS : AcceptanceStatus.ACCEPTED)
    : AcceptanceStatus.REJECTED;

  await acceptance.update({
    status,
    acceptedBy,
    acceptanceDate: new Date(),
    exceptions,
  }, { transaction });

  // Update deployment status
  if (accepted) {
    await DeploymentPlan.update(
      { status: DeploymentStatus.COMPLETED, actualEndDate: new Date() },
      { where: { id: deploymentId }, transaction }
    );
  }

  return acceptance;
}

// ============================================================================
// GO-LIVE AND COMMISSIONING FUNCTIONS
// ============================================================================

/**
 * Creates go-live plan
 *
 * @param data - Go-live data
 * @param transaction - Optional database transaction
 * @returns Created go-live plan
 *
 * @example
 * ```typescript
 * const goLive = await createGoLivePlan({
 *   deploymentId: 'dep-123',
 *   goLiveDate: new Date('2024-06-15'),
 *   cutoverPlan: [...],
 *   rollbackPlan: [...],
 *   stakeholderApprovals: ['user-1', 'user-2']
 * });
 * ```
 */
export async function createGoLivePlan(
  data: GoLiveData,
  transaction?: Transaction
): Promise<GoLivePlan> {
  const plan = await GoLivePlan.create(
    {
      ...data,
      status: 'planned',
      allApprovalsReceived: false,
      rollbackTriggered: false,
    },
    { transaction }
  );

  return plan;
}

/**
 * Executes go-live
 *
 * @param planId - Go-live plan identifier
 * @param transaction - Optional database transaction
 * @returns Updated plan
 *
 * @example
 * ```typescript
 * await executeGoLive('plan-123');
 * ```
 */
export async function executeGoLive(
  planId: string,
  transaction?: Transaction
): Promise<GoLivePlan> {
  const plan = await GoLivePlan.findByPk(planId, { transaction });
  if (!plan) {
    throw new NotFoundException(`Go-live plan ${planId} not found`);
  }

  if (!plan.allApprovalsReceived) {
    throw new BadRequestException('Not all approvals received');
  }

  await plan.update({
    status: 'in_progress',
    actualGoLiveDate: new Date(),
  }, { transaction });

  return plan;
}

/**
 * Triggers rollback
 *
 * @param planId - Go-live plan identifier
 * @param reason - Rollback reason
 * @param transaction - Optional database transaction
 * @returns Updated plan
 *
 * @example
 * ```typescript
 * await triggerRollback('plan-123', 'Critical system error detected');
 * ```
 */
export async function triggerRollback(
  planId: string,
  reason: string,
  transaction?: Transaction
): Promise<GoLivePlan> {
  const plan = await GoLivePlan.findByPk(planId, { transaction });
  if (!plan) {
    throw new NotFoundException(`Go-live plan ${planId} not found`);
  }

  await plan.update({
    status: 'aborted',
    rollbackTriggered: true,
    rollbackReason: reason,
  }, { transaction });

  // Update deployment status
  const deployment = await DeploymentPlan.findByPk(plan.deploymentId, { transaction });
  if (deployment) {
    await deployment.update({
      status: DeploymentStatus.ROLLED_BACK,
    }, { transaction });
  }

  return plan;
}

/**
 * Creates commissioning record
 *
 * @param deploymentId - Deployment identifier
 * @param transaction - Optional database transaction
 * @returns Created commissioning record
 *
 * @example
 * ```typescript
 * const commissioning = await createCommissioningRecord('dep-123');
 * ```
 */
export async function createCommissioningRecord(
  deploymentId: string,
  transaction?: Transaction
): Promise<CommissioningRecord> {
  const record = await CommissioningRecord.create(
    {
      deploymentId,
      status: CommissioningStatus.NOT_STARTED,
      trainingCompleted: false,
      documentationDelivered: false,
      warrantyActivated: false,
    },
    { transaction }
  );

  return record;
}

/**
 * Completes commissioning
 *
 * @param recordId - Commissioning record identifier
 * @param commissionedBy - User completing commissioning
 * @param data - Commissioning data
 * @param transaction - Optional database transaction
 * @returns Updated record
 *
 * @example
 * ```typescript
 * await completeCommissioning('comm-123', 'engineer-456', {
 *   performanceBaseline: {...},
 *   calibrationResults: {...}
 * });
 * ```
 */
export async function completeCommissioning(
  recordId: string,
  commissionedBy: string,
  data: {
    commissioningChecklist?: Record<string, any>;
    performanceBaseline?: Record<string, any>;
    calibrationResults?: Record<string, any>;
  },
  transaction?: Transaction
): Promise<CommissioningRecord> {
  const record = await CommissioningRecord.findByPk(recordId, { transaction });
  if (!record) {
    throw new NotFoundException(`Commissioning record ${recordId} not found`);
  }

  await record.update({
    status: CommissioningStatus.COMPLETED,
    commissionedBy,
    commissioningDate: new Date(),
    ...data,
  }, { transaction });

  return record;
}

/**
 * Gets commissioning record for deployment
 *
 * @param deploymentId - Deployment identifier
 * @returns Commissioning record
 *
 * @example
 * ```typescript
 * const commissioning = await getCommissioningRecord('dep-123');
 * ```
 */
export async function getCommissioningRecord(
  deploymentId: string
): Promise<CommissioningRecord | null> {
  return CommissioningRecord.findOne({
    where: { deploymentId },
  });
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  DeploymentPlan,
  SitePreparation,
  ResourceAllocation,
  InstallationProgress,
  DeploymentConfiguration,
  DeploymentTest,
  DeploymentAcceptance,
  GoLivePlan,
  CommissioningRecord,

  // Planning Functions
  createDeploymentPlan,
  updateDeploymentPlan,
  scheduleDeployment,
  getDeploymentsByStatus,
  getDeploymentsBySite,
  getDeploymentsByAsset,
  cancelDeployment,

  // Site Preparation Functions
  createSitePreparation,
  updateSitePrepRequirement,
  startSitePreparation,
  completeSitePreparation,
  getSitePreparationForDeployment,

  // Resource Allocation Functions
  allocateDeploymentResource,
  deallocateDeploymentResource,
  getDeploymentResourceAllocations,
  checkResourceAvailability,
  bulkAllocateResources,

  // Installation Functions
  startDeploymentExecution,
  updateInstallationProgress,
  recordInstallationIssue,
  resolveInstallationIssue,
  getInstallationProgressHistory,

  // Configuration Functions
  recordDeploymentConfiguration,
  validateConfiguration,
  getDeploymentConfigurations,

  // Testing and Acceptance Functions
  executeDeploymentTests,
  updateTestCaseResult,
  createAcceptanceCriteria,
  recordAcceptanceDecision,

  // Go-Live and Commissioning Functions
  createGoLivePlan,
  executeGoLive,
  triggerRollback,
  createCommissioningRecord,
  completeCommissioning,
  getCommissioningRecord,
};
