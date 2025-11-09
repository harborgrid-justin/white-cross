/**
 * LOC: LEGAL_PROJECT_MANAGEMENT_KIT_001
 * File: /reuse/legal/legal-project-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *
 * DOWNSTREAM (imported by):
 *   - Legal project modules
 *   - Matter management controllers
 *   - Project tracking services
 *   - Resource allocation services
 *   - Budget management services
 */

/**
 * File: /reuse/legal/legal-project-management-kit.ts
 * Locator: WC-LEGAL-PROJECT-MANAGEMENT-KIT-001
 * Purpose: Production-Grade Legal Project Management Kit - Enterprise legal matter and project management toolkit
 *
 * Upstream: NestJS, Sequelize, Zod
 * Downstream: ../backend/modules/legal/*, Project controllers, Matter management services
 * Dependencies: TypeScript 5.x, Node 18+, sequelize-typescript, @nestjs/swagger, zod
 * Exports: 39 production-ready legal project management functions for legal platforms
 *
 * LLM Context: Production-grade legal project management toolkit for White Cross platform.
 * Provides comprehensive matter planning with project templates/scope/objectives, budgeting with
 * estimated vs actual cost tracking, task tracking with dependencies/assignments/deadlines,
 * milestone management with deliverable tracking, resource allocation with attorney/staff
 * assignments, status reporting with progress metrics, Sequelize models for matters/tasks/
 * milestones/budgets, NestJS services with dependency injection, Swagger API documentation,
 * project templates for common matter types, Gantt chart data generation, critical path analysis,
 * resource capacity planning, budget variance reporting, risk management, stakeholder communication,
 * matter collaboration tools, document versioning integration, conflict checking, matter lifecycle
 * management, billing integration, time tracking coordination, and healthcare legal project specifics
 * (medical malpractice case planning, regulatory compliance tracking, provider engagement).
 */

import * as crypto from 'crypto';
import {
  Injectable,
  Inject,
  Module,
  DynamicModule,
  Global,
  Logger,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
  registerAs,
} from '@nestjs/config';
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
  Sequelize,
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';
import { Op, WhereOptions, FindOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Matter status lifecycle
 */
export enum MatterStatus {
  PROSPECTIVE = 'prospective',
  INTAKE = 'intake',
  OPEN = 'open',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  PENDING_CLOSE = 'pending_close',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
  DECLINED = 'declined',
}

/**
 * Matter priority levels
 */
export enum MatterPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
  CRITICAL = 'critical',
}

/**
 * Matter types
 */
export enum MatterType {
  LITIGATION = 'litigation',
  TRANSACTIONAL = 'transactional',
  ADVISORY = 'advisory',
  COMPLIANCE = 'compliance',
  CORPORATE = 'corporate',
  REAL_ESTATE = 'real_estate',
  INTELLECTUAL_PROPERTY = 'intellectual_property',
  EMPLOYMENT = 'employment',
  MEDICAL_MALPRACTICE = 'medical_malpractice',
  REGULATORY = 'regulatory',
  OTHER = 'other',
}

/**
 * Task status lifecycle
 */
export enum TaskStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  BLOCKED = 'blocked',
  PENDING_REVIEW = 'pending_review',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Task priority levels
 */
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * Milestone status
 */
export enum MilestoneStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DELAYED = 'delayed',
  AT_RISK = 'at_risk',
  MISSED = 'missed',
}

/**
 * Resource allocation status
 */
export enum ResourceAllocationStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Budget status
 */
export enum BudgetStatus {
  DRAFT = 'draft',
  PROPOSED = 'proposed',
  APPROVED = 'approved',
  ACTIVE = 'active',
  EXCEEDED = 'exceeded',
  CLOSED = 'closed',
}

/**
 * Expense type
 */
export enum ExpenseType {
  LABOR = 'labor',
  EXPERT_WITNESS = 'expert_witness',
  COURT_COSTS = 'court_costs',
  FILING_FEES = 'filing_fees',
  TRAVEL = 'travel',
  RESEARCH = 'research',
  TECHNOLOGY = 'technology',
  VENDOR = 'vendor',
  OTHER = 'other',
}

/**
 * Report type
 */
export enum ReportType {
  STATUS = 'status',
  BUDGET_VARIANCE = 'budget_variance',
  RESOURCE_UTILIZATION = 'resource_utilization',
  MILESTONE_PROGRESS = 'milestone_progress',
  TASK_COMPLETION = 'task_completion',
  RISK_SUMMARY = 'risk_summary',
  EXECUTIVE_SUMMARY = 'executive_summary',
}

/**
 * Risk level
 */
export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Legal matter entity
 */
export interface LegalMatter {
  id: string;
  matterNumber: string;
  title: string;
  description: string;
  matterType: MatterType;
  status: MatterStatus;
  priority: MatterPriority;
  clientId: string;
  responsibleAttorneyId: string;
  practiceAreaId?: string;
  openDate: Date;
  closeDate?: Date;
  targetCloseDate?: Date;
  budgetAmount?: number;
  estimatedHours?: number;
  actualHours?: number;
  currency: string;
  conflictCheckStatus?: string;
  conflictCheckDate?: Date;
  billingArrangement?: string;
  objectives?: string[];
  scope?: string;
  constraints?: string[];
  assumptions?: string[];
  metadata: Record<string, any>;
  tenantId?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Project task entity
 */
export interface ProjectTask {
  id: string;
  matterId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedToId?: string;
  assignedById: string;
  parentTaskId?: string;
  startDate?: Date;
  dueDate?: Date;
  completedDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  percentComplete: number;
  dependencies?: string[];
  tags?: string[];
  checklistItems?: TaskChecklistItem[];
  blockers?: string[];
  metadata: Record<string, any>;
  tenantId?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Task checklist item
 */
export interface TaskChecklistItem {
  id: string;
  description: string;
  completed: boolean;
  completedAt?: Date;
  completedBy?: string;
}

/**
 * Milestone entity
 */
export interface Milestone {
  id: string;
  matterId: string;
  name: string;
  description?: string;
  status: MilestoneStatus;
  targetDate: Date;
  actualDate?: Date;
  deliverables?: string[];
  dependencies?: string[];
  criticalPath: boolean;
  percentComplete: number;
  ownerId?: string;
  metadata: Record<string, any>;
  tenantId?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Resource allocation entity
 */
export interface ResourceAllocation {
  id: string;
  matterId: string;
  resourceId: string;
  resourceType: 'attorney' | 'paralegal' | 'staff' | 'expert' | 'vendor';
  roleOnMatter: string;
  status: ResourceAllocationStatus;
  allocationPercentage?: number;
  startDate: Date;
  endDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  billableRate?: number;
  costRate?: number;
  metadata: Record<string, any>;
  tenantId?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Matter budget entity
 */
export interface MatterBudget {
  id: string;
  matterId: string;
  budgetType: 'overall' | 'phase' | 'task' | 'category';
  status: BudgetStatus;
  totalBudget: number;
  laborBudget?: number;
  expenseBudget?: number;
  actualSpent: number;
  committed: number;
  remaining: number;
  variance: number;
  variancePercentage: number;
  currency: string;
  periodStart?: Date;
  periodEnd?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  lastReviewDate?: Date;
  forecastAtCompletion?: number;
  metadata: Record<string, any>;
  tenantId?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Budget line item
 */
export interface BudgetLineItem {
  id: string;
  budgetId: string;
  category: string;
  expenseType: ExpenseType;
  description: string;
  budgetedAmount: number;
  actualAmount: number;
  committedAmount: number;
  variance: number;
  metadata: Record<string, any>;
}

/**
 * Status report entity
 */
export interface StatusReport {
  id: string;
  matterId: string;
  reportType: ReportType;
  reportDate: Date;
  periodStart: Date;
  periodEnd: Date;
  summary: string;
  accomplishments?: string[];
  upcomingTasks?: string[];
  issues?: string[];
  risks?: RiskItem[];
  budgetStatus?: BudgetStatusSummary;
  scheduleStatus?: ScheduleStatusSummary;
  resourceStatus?: ResourceStatusSummary;
  milestonesAchieved?: string[];
  nextMilestones?: string[];
  recommendations?: string[];
  attachments?: string[];
  recipientIds?: string[];
  metadata: Record<string, any>;
  tenantId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Risk item
 */
export interface RiskItem {
  id: string;
  description: string;
  level: RiskLevel;
  impact: string;
  mitigation?: string;
  owner?: string;
}

/**
 * Budget status summary
 */
export interface BudgetStatusSummary {
  budgeted: number;
  spent: number;
  committed: number;
  remaining: number;
  variance: number;
  variancePercentage: number;
  atRisk: boolean;
}

/**
 * Schedule status summary
 */
export interface ScheduleStatusSummary {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  delayedTasks: number;
  upcomingDeadlines: number;
  criticalPathStatus: 'on_track' | 'at_risk' | 'delayed';
}

/**
 * Resource status summary
 */
export interface ResourceStatusSummary {
  totalResources: number;
  activeResources: number;
  utilization: number;
  overallocated: number;
  underutilized: number;
}

/**
 * Project template entity
 */
export interface ProjectTemplate {
  id: string;
  name: string;
  matterType: MatterType;
  description?: string;
  defaultTasks?: TemplateTask[];
  defaultMilestones?: TemplateMilestone[];
  estimatedDuration?: number;
  estimatedBudget?: number;
  requiredRoles?: string[];
  metadata: Record<string, any>;
  tenantId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Template task
 */
export interface TemplateTask {
  title: string;
  description?: string;
  estimatedHours?: number;
  daysFromStart?: number;
  dependencies?: string[];
  assignedRole?: string;
}

/**
 * Template milestone
 */
export interface TemplateMilestone {
  name: string;
  description?: string;
  daysFromStart: number;
  deliverables?: string[];
}

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

export const CreateMatterSchema = z.object({
  matterNumber: z.string().optional(),
  title: z.string().min(1).max(500),
  description: z.string(),
  matterType: z.nativeEnum(MatterType),
  priority: z.nativeEnum(MatterPriority).default(MatterPriority.MEDIUM),
  clientId: z.string().uuid(),
  responsibleAttorneyId: z.string().uuid(),
  practiceAreaId: z.string().uuid().optional(),
  openDate: z.coerce.date().default(() => new Date()),
  targetCloseDate: z.coerce.date().optional(),
  budgetAmount: z.number().positive().optional(),
  estimatedHours: z.number().positive().optional(),
  currency: z.string().default('USD'),
  billingArrangement: z.string().optional(),
  objectives: z.array(z.string()).optional(),
  scope: z.string().optional(),
  constraints: z.array(z.string()).optional(),
  assumptions: z.array(z.string()).optional(),
  metadata: z.record(z.any()).default({}),
});

export const UpdateMatterSchema = CreateMatterSchema.partial();

export const CreateTaskSchema = z.object({
  matterId: z.string().uuid(),
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.NOT_STARTED),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  assignedToId: z.string().uuid().optional(),
  parentTaskId: z.string().uuid().optional(),
  startDate: z.coerce.date().optional(),
  dueDate: z.coerce.date().optional(),
  estimatedHours: z.number().positive().optional(),
  dependencies: z.array(z.string().uuid()).optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).default({}),
});

export const UpdateTaskSchema = CreateTaskSchema.partial();

export const CreateMilestoneSchema = z.object({
  matterId: z.string().uuid(),
  name: z.string().min(1).max(500),
  description: z.string().optional(),
  targetDate: z.coerce.date(),
  deliverables: z.array(z.string()).optional(),
  dependencies: z.array(z.string().uuid()).optional(),
  criticalPath: z.boolean().default(false),
  ownerId: z.string().uuid().optional(),
  metadata: z.record(z.any()).default({}),
});

export const UpdateMilestoneSchema = CreateMilestoneSchema.partial();

export const CreateResourceAllocationSchema = z.object({
  matterId: z.string().uuid(),
  resourceId: z.string().uuid(),
  resourceType: z.enum(['attorney', 'paralegal', 'staff', 'expert', 'vendor']),
  roleOnMatter: z.string(),
  allocationPercentage: z.number().min(0).max(100).optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  estimatedHours: z.number().positive().optional(),
  billableRate: z.number().nonnegative().optional(),
  costRate: z.number().nonnegative().optional(),
  metadata: z.record(z.any()).default({}),
});

export const UpdateResourceAllocationSchema = CreateResourceAllocationSchema.partial();

export const CreateBudgetSchema = z.object({
  matterId: z.string().uuid(),
  budgetType: z.enum(['overall', 'phase', 'task', 'category']),
  totalBudget: z.number().positive(),
  laborBudget: z.number().nonnegative().optional(),
  expenseBudget: z.number().nonnegative().optional(),
  currency: z.string().default('USD'),
  periodStart: z.coerce.date().optional(),
  periodEnd: z.coerce.date().optional(),
  metadata: z.record(z.any()).default({}),
});

export const UpdateBudgetSchema = CreateBudgetSchema.partial();

export const CreateStatusReportSchema = z.object({
  matterId: z.string().uuid(),
  reportType: z.nativeEnum(ReportType),
  periodStart: z.coerce.date(),
  periodEnd: z.coerce.date(),
  summary: z.string(),
  accomplishments: z.array(z.string()).optional(),
  upcomingTasks: z.array(z.string()).optional(),
  issues: z.array(z.string()).optional(),
  recommendations: z.array(z.string()).optional(),
  recipientIds: z.array(z.string().uuid()).optional(),
  metadata: z.record(z.any()).default({}),
});

// ============================================================================
// DTOs WITH SWAGGER DECORATORS
// ============================================================================

export class CreateMatterDto {
  @ApiPropertyOptional({ description: 'Matter number (auto-generated if not provided)' })
  matterNumber?: string;

  @ApiProperty({ description: 'Matter title' })
  title!: string;

  @ApiProperty({ description: 'Matter description' })
  description!: string;

  @ApiProperty({ enum: MatterType, description: 'Type of matter' })
  matterType!: MatterType;

  @ApiProperty({ enum: MatterPriority, default: MatterPriority.MEDIUM })
  priority!: MatterPriority;

  @ApiProperty({ description: 'Client UUID' })
  clientId!: string;

  @ApiProperty({ description: 'Responsible attorney UUID' })
  responsibleAttorneyId!: string;

  @ApiPropertyOptional({ description: 'Practice area UUID' })
  practiceAreaId?: string;

  @ApiProperty({ type: Date, default: () => new Date() })
  openDate!: Date;

  @ApiPropertyOptional({ type: Date })
  targetCloseDate?: Date;

  @ApiPropertyOptional({ description: 'Budget amount' })
  budgetAmount?: number;

  @ApiPropertyOptional({ description: 'Estimated hours' })
  estimatedHours?: number;

  @ApiProperty({ default: 'USD' })
  currency!: string;

  @ApiPropertyOptional({ description: 'Billing arrangement description' })
  billingArrangement?: string;

  @ApiPropertyOptional({ type: [String], description: 'Matter objectives' })
  objectives?: string[];

  @ApiPropertyOptional({ description: 'Matter scope' })
  scope?: string;

  @ApiPropertyOptional({ type: [String], description: 'Constraints' })
  constraints?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Assumptions' })
  assumptions?: string[];

  @ApiPropertyOptional({ type: Object })
  metadata?: Record<string, any>;
}

export class UpdateMatterDto {
  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional({ enum: MatterType })
  matterType?: MatterType;

  @ApiPropertyOptional({ enum: MatterStatus })
  status?: MatterStatus;

  @ApiPropertyOptional({ enum: MatterPriority })
  priority?: MatterPriority;

  @ApiPropertyOptional()
  responsibleAttorneyId?: string;

  @ApiPropertyOptional({ type: Date })
  targetCloseDate?: Date;

  @ApiPropertyOptional()
  budgetAmount?: number;

  @ApiPropertyOptional()
  estimatedHours?: number;

  @ApiPropertyOptional({ type: Object })
  metadata?: Record<string, any>;
}

export class CreateTaskDto {
  @ApiProperty({ description: 'Matter UUID' })
  matterId!: string;

  @ApiProperty({ description: 'Task title' })
  title!: string;

  @ApiPropertyOptional({ description: 'Task description' })
  description?: string;

  @ApiProperty({ enum: TaskStatus, default: TaskStatus.NOT_STARTED })
  status!: TaskStatus;

  @ApiProperty({ enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority!: TaskPriority;

  @ApiPropertyOptional({ description: 'Assigned user UUID' })
  assignedToId?: string;

  @ApiPropertyOptional({ description: 'Parent task UUID' })
  parentTaskId?: string;

  @ApiPropertyOptional({ type: Date })
  startDate?: Date;

  @ApiPropertyOptional({ type: Date })
  dueDate?: Date;

  @ApiPropertyOptional({ description: 'Estimated hours' })
  estimatedHours?: number;

  @ApiPropertyOptional({ type: [String], description: 'Dependent task UUIDs' })
  dependencies?: string[];

  @ApiPropertyOptional({ type: [String] })
  tags?: string[];

  @ApiPropertyOptional({ type: Object })
  metadata?: Record<string, any>;
}

export class UpdateTaskDto {
  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus })
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: TaskPriority })
  priority?: TaskPriority;

  @ApiPropertyOptional()
  assignedToId?: string;

  @ApiPropertyOptional({ type: Date })
  dueDate?: Date;

  @ApiPropertyOptional()
  estimatedHours?: number;

  @ApiPropertyOptional()
  actualHours?: number;

  @ApiPropertyOptional({ description: 'Percentage complete (0-100)' })
  percentComplete?: number;

  @ApiPropertyOptional({ type: Object })
  metadata?: Record<string, any>;
}

export class CreateMilestoneDto {
  @ApiProperty({ description: 'Matter UUID' })
  matterId!: string;

  @ApiProperty({ description: 'Milestone name' })
  name!: string;

  @ApiPropertyOptional({ description: 'Milestone description' })
  description?: string;

  @ApiProperty({ type: Date, description: 'Target date' })
  targetDate!: Date;

  @ApiPropertyOptional({ type: [String], description: 'Deliverables' })
  deliverables?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Dependent milestone UUIDs' })
  dependencies?: string[];

  @ApiProperty({ default: false, description: 'Is on critical path' })
  criticalPath!: boolean;

  @ApiPropertyOptional({ description: 'Owner UUID' })
  ownerId?: string;

  @ApiPropertyOptional({ type: Object })
  metadata?: Record<string, any>;
}

export class UpdateMilestoneDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional({ enum: MilestoneStatus })
  status?: MilestoneStatus;

  @ApiPropertyOptional({ type: Date })
  targetDate?: Date;

  @ApiPropertyOptional({ type: Date })
  actualDate?: Date;

  @ApiPropertyOptional({ description: 'Percentage complete (0-100)' })
  percentComplete?: number;

  @ApiPropertyOptional({ type: Object })
  metadata?: Record<string, any>;
}

export class CreateResourceAllocationDto {
  @ApiProperty({ description: 'Matter UUID' })
  matterId!: string;

  @ApiProperty({ description: 'Resource UUID' })
  resourceId!: string;

  @ApiProperty({ enum: ['attorney', 'paralegal', 'staff', 'expert', 'vendor'] })
  resourceType!: 'attorney' | 'paralegal' | 'staff' | 'expert' | 'vendor';

  @ApiProperty({ description: 'Role on matter' })
  roleOnMatter!: string;

  @ApiPropertyOptional({ description: 'Allocation percentage (0-100)' })
  allocationPercentage?: number;

  @ApiProperty({ type: Date })
  startDate!: Date;

  @ApiPropertyOptional({ type: Date })
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Estimated hours' })
  estimatedHours?: number;

  @ApiPropertyOptional({ description: 'Billable rate' })
  billableRate?: number;

  @ApiPropertyOptional({ description: 'Cost rate' })
  costRate?: number;

  @ApiPropertyOptional({ type: Object })
  metadata?: Record<string, any>;
}

export class UpdateResourceAllocationDto {
  @ApiPropertyOptional({ enum: ResourceAllocationStatus })
  status?: ResourceAllocationStatus;

  @ApiPropertyOptional()
  allocationPercentage?: number;

  @ApiPropertyOptional({ type: Date })
  endDate?: Date;

  @ApiPropertyOptional()
  actualHours?: number;

  @ApiPropertyOptional({ type: Object })
  metadata?: Record<string, any>;
}

export class CreateBudgetDto {
  @ApiProperty({ description: 'Matter UUID' })
  matterId!: string;

  @ApiProperty({ enum: ['overall', 'phase', 'task', 'category'] })
  budgetType!: 'overall' | 'phase' | 'task' | 'category';

  @ApiProperty({ description: 'Total budget amount' })
  totalBudget!: number;

  @ApiPropertyOptional({ description: 'Labor budget' })
  laborBudget?: number;

  @ApiPropertyOptional({ description: 'Expense budget' })
  expenseBudget?: number;

  @ApiProperty({ default: 'USD' })
  currency!: string;

  @ApiPropertyOptional({ type: Date })
  periodStart?: Date;

  @ApiPropertyOptional({ type: Date })
  periodEnd?: Date;

  @ApiPropertyOptional({ type: Object })
  metadata?: Record<string, any>;
}

export class UpdateBudgetDto {
  @ApiPropertyOptional({ enum: BudgetStatus })
  status?: BudgetStatus;

  @ApiPropertyOptional()
  totalBudget?: number;

  @ApiPropertyOptional()
  laborBudget?: number;

  @ApiPropertyOptional()
  expenseBudget?: number;

  @ApiPropertyOptional()
  actualSpent?: number;

  @ApiPropertyOptional()
  committed?: number;

  @ApiPropertyOptional({ type: Object })
  metadata?: Record<string, any>;
}

export class CreateStatusReportDto {
  @ApiProperty({ description: 'Matter UUID' })
  matterId!: string;

  @ApiProperty({ enum: ReportType })
  reportType!: ReportType;

  @ApiProperty({ type: Date })
  periodStart!: Date;

  @ApiProperty({ type: Date })
  periodEnd!: Date;

  @ApiProperty({ description: 'Report summary' })
  summary!: string;

  @ApiPropertyOptional({ type: [String] })
  accomplishments?: string[];

  @ApiPropertyOptional({ type: [String] })
  upcomingTasks?: string[];

  @ApiPropertyOptional({ type: [String] })
  issues?: string[];

  @ApiPropertyOptional({ type: [String] })
  recommendations?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Recipient UUIDs' })
  recipientIds?: string[];

  @ApiPropertyOptional({ type: Object })
  metadata?: Record<string, any>;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

@Table({ tableName: 'legal_matters', paranoid: true })
export class LegalMatterModel extends Model<LegalMatter> implements LegalMatter {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({ type: DataType.STRING, unique: true })
  matterNumber!: string;

  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column(DataType.ENUM(...Object.values(MatterType)))
  matterType!: MatterType;

  @Default(MatterStatus.PROSPECTIVE)
  @Column(DataType.ENUM(...Object.values(MatterStatus)))
  status!: MatterStatus;

  @Default(MatterPriority.MEDIUM)
  @Column(DataType.ENUM(...Object.values(MatterPriority)))
  priority!: MatterPriority;

  @Column(DataType.UUID)
  clientId!: string;

  @Column(DataType.UUID)
  responsibleAttorneyId!: string;

  @Column(DataType.UUID)
  practiceAreaId?: string;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  openDate!: Date;

  @Column(DataType.DATE)
  closeDate?: Date;

  @Column(DataType.DATE)
  targetCloseDate?: Date;

  @Column(DataType.DECIMAL(15, 2))
  budgetAmount?: number;

  @Column(DataType.DECIMAL(10, 2))
  estimatedHours?: number;

  @Default(0)
  @Column(DataType.DECIMAL(10, 2))
  actualHours?: number;

  @Default('USD')
  @Column(DataType.STRING)
  currency!: string;

  @Column(DataType.STRING)
  conflictCheckStatus?: string;

  @Column(DataType.DATE)
  conflictCheckDate?: Date;

  @Column(DataType.STRING)
  billingArrangement?: string;

  @Column(DataType.JSONB)
  objectives?: string[];

  @Column(DataType.TEXT)
  scope?: string;

  @Column(DataType.JSONB)
  constraints?: string[];

  @Column(DataType.JSONB)
  assumptions?: string[];

  @Default({})
  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @Column(DataType.UUID)
  tenantId?: string;

  @Column(DataType.UUID)
  createdBy!: string;

  @Column(DataType.UUID)
  updatedBy?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

@Table({ tableName: 'project_tasks', paranoid: true })
export class ProjectTaskModel extends Model<ProjectTask> implements ProjectTask {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => LegalMatterModel)
  @Column(DataType.UUID)
  matterId!: string;

  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Default(TaskStatus.NOT_STARTED)
  @Column(DataType.ENUM(...Object.values(TaskStatus)))
  status!: TaskStatus;

  @Default(TaskPriority.MEDIUM)
  @Column(DataType.ENUM(...Object.values(TaskPriority)))
  priority!: TaskPriority;

  @Column(DataType.UUID)
  assignedToId?: string;

  @Column(DataType.UUID)
  assignedById!: string;

  @Column(DataType.UUID)
  parentTaskId?: string;

  @Column(DataType.DATE)
  startDate?: Date;

  @Column(DataType.DATE)
  dueDate?: Date;

  @Column(DataType.DATE)
  completedDate?: Date;

  @Column(DataType.DECIMAL(10, 2))
  estimatedHours?: number;

  @Default(0)
  @Column(DataType.DECIMAL(10, 2))
  actualHours?: number;

  @Default(0)
  @Column(DataType.INTEGER)
  percentComplete!: number;

  @Column(DataType.JSONB)
  dependencies?: string[];

  @Column(DataType.JSONB)
  tags?: string[];

  @Column(DataType.JSONB)
  checklistItems?: TaskChecklistItem[];

  @Column(DataType.JSONB)
  blockers?: string[];

  @Default({})
  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @Column(DataType.UUID)
  tenantId?: string;

  @Column(DataType.UUID)
  createdBy!: string;

  @Column(DataType.UUID)
  updatedBy?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => LegalMatterModel)
  matter?: LegalMatterModel;
}

@Table({ tableName: 'milestones', paranoid: true })
export class MilestoneModel extends Model<Milestone> implements Milestone {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => LegalMatterModel)
  @Column(DataType.UUID)
  matterId!: string;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Default(MilestoneStatus.PENDING)
  @Column(DataType.ENUM(...Object.values(MilestoneStatus)))
  status!: MilestoneStatus;

  @Column(DataType.DATE)
  targetDate!: Date;

  @Column(DataType.DATE)
  actualDate?: Date;

  @Column(DataType.JSONB)
  deliverables?: string[];

  @Column(DataType.JSONB)
  dependencies?: string[];

  @Default(false)
  @Column(DataType.BOOLEAN)
  criticalPath!: boolean;

  @Default(0)
  @Column(DataType.INTEGER)
  percentComplete!: number;

  @Column(DataType.UUID)
  ownerId?: string;

  @Default({})
  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @Column(DataType.UUID)
  tenantId?: string;

  @Column(DataType.UUID)
  createdBy!: string;

  @Column(DataType.UUID)
  updatedBy?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => LegalMatterModel)
  matter?: LegalMatterModel;
}

@Table({ tableName: 'resource_allocations', paranoid: true })
export class ResourceAllocationModel extends Model<ResourceAllocation> implements ResourceAllocation {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => LegalMatterModel)
  @Column(DataType.UUID)
  matterId!: string;

  @Column(DataType.UUID)
  resourceId!: string;

  @Column(DataType.ENUM('attorney', 'paralegal', 'staff', 'expert', 'vendor'))
  resourceType!: 'attorney' | 'paralegal' | 'staff' | 'expert' | 'vendor';

  @Column(DataType.STRING)
  roleOnMatter!: string;

  @Default(ResourceAllocationStatus.REQUESTED)
  @Column(DataType.ENUM(...Object.values(ResourceAllocationStatus)))
  status!: ResourceAllocationStatus;

  @Column(DataType.DECIMAL(5, 2))
  allocationPercentage?: number;

  @Column(DataType.DATE)
  startDate!: Date;

  @Column(DataType.DATE)
  endDate?: Date;

  @Column(DataType.DECIMAL(10, 2))
  estimatedHours?: number;

  @Default(0)
  @Column(DataType.DECIMAL(10, 2))
  actualHours?: number;

  @Column(DataType.DECIMAL(10, 2))
  billableRate?: number;

  @Column(DataType.DECIMAL(10, 2))
  costRate?: number;

  @Default({})
  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @Column(DataType.UUID)
  tenantId?: string;

  @Column(DataType.UUID)
  createdBy!: string;

  @Column(DataType.UUID)
  updatedBy?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => LegalMatterModel)
  matter?: LegalMatterModel;
}

@Table({ tableName: 'matter_budgets', paranoid: true })
export class MatterBudgetModel extends Model<MatterBudget> implements MatterBudget {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => LegalMatterModel)
  @Column(DataType.UUID)
  matterId!: string;

  @Column(DataType.ENUM('overall', 'phase', 'task', 'category'))
  budgetType!: 'overall' | 'phase' | 'task' | 'category';

  @Default(BudgetStatus.DRAFT)
  @Column(DataType.ENUM(...Object.values(BudgetStatus)))
  status!: BudgetStatus;

  @Column(DataType.DECIMAL(15, 2))
  totalBudget!: number;

  @Column(DataType.DECIMAL(15, 2))
  laborBudget?: number;

  @Column(DataType.DECIMAL(15, 2))
  expenseBudget?: number;

  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  actualSpent!: number;

  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  committed!: number;

  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  remaining!: number;

  @Default(0)
  @Column(DataType.DECIMAL(15, 2))
  variance!: number;

  @Default(0)
  @Column(DataType.DECIMAL(5, 2))
  variancePercentage!: number;

  @Default('USD')
  @Column(DataType.STRING)
  currency!: string;

  @Column(DataType.DATE)
  periodStart?: Date;

  @Column(DataType.DATE)
  periodEnd?: Date;

  @Column(DataType.UUID)
  approvedBy?: string;

  @Column(DataType.DATE)
  approvedAt?: Date;

  @Column(DataType.DATE)
  lastReviewDate?: Date;

  @Column(DataType.DECIMAL(15, 2))
  forecastAtCompletion?: number;

  @Default({})
  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @Column(DataType.UUID)
  tenantId?: string;

  @Column(DataType.UUID)
  createdBy!: string;

  @Column(DataType.UUID)
  updatedBy?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => LegalMatterModel)
  matter?: LegalMatterModel;
}

@Table({ tableName: 'status_reports', paranoid: false })
export class StatusReportModel extends Model<StatusReport> implements StatusReport {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => LegalMatterModel)
  @Column(DataType.UUID)
  matterId!: string;

  @Column(DataType.ENUM(...Object.values(ReportType)))
  reportType!: ReportType;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  reportDate!: Date;

  @Column(DataType.DATE)
  periodStart!: Date;

  @Column(DataType.DATE)
  periodEnd!: Date;

  @Column(DataType.TEXT)
  summary!: string;

  @Column(DataType.JSONB)
  accomplishments?: string[];

  @Column(DataType.JSONB)
  upcomingTasks?: string[];

  @Column(DataType.JSONB)
  issues?: string[];

  @Column(DataType.JSONB)
  risks?: RiskItem[];

  @Column(DataType.JSONB)
  budgetStatus?: BudgetStatusSummary;

  @Column(DataType.JSONB)
  scheduleStatus?: ScheduleStatusSummary;

  @Column(DataType.JSONB)
  resourceStatus?: ResourceStatusSummary;

  @Column(DataType.JSONB)
  milestonesAchieved?: string[];

  @Column(DataType.JSONB)
  nextMilestones?: string[];

  @Column(DataType.JSONB)
  recommendations?: string[];

  @Column(DataType.JSONB)
  attachments?: string[];

  @Column(DataType.JSONB)
  recipientIds?: string[];

  @Default({})
  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @Column(DataType.UUID)
  tenantId?: string;

  @Column(DataType.UUID)
  createdBy!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => LegalMatterModel)
  matter?: LegalMatterModel;
}

@Table({ tableName: 'project_templates', paranoid: false })
export class ProjectTemplateModel extends Model<ProjectTemplate> implements ProjectTemplate {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.ENUM(...Object.values(MatterType)))
  matterType!: MatterType;

  @Column(DataType.TEXT)
  description?: string;

  @Column(DataType.JSONB)
  defaultTasks?: TemplateTask[];

  @Column(DataType.JSONB)
  defaultMilestones?: TemplateMilestone[];

  @Column(DataType.INTEGER)
  estimatedDuration?: number;

  @Column(DataType.DECIMAL(15, 2))
  estimatedBudget?: number;

  @Column(DataType.JSONB)
  requiredRoles?: string[];

  @Default({})
  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @Column(DataType.UUID)
  tenantId?: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

@Injectable()
export class LegalProjectManagementService {
  private readonly logger = new Logger(LegalProjectManagementService.name);

  constructor(
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {}

  // ========================================================================
  // MATTER PLANNING FUNCTIONS (Functions 1-7)
  // ========================================================================

  /**
   * Function 1: Create new legal matter
   */
  async createMatter(
    data: z.infer<typeof CreateMatterSchema>,
    userId: string,
    tenantId?: string,
  ): Promise<LegalMatter> {
    const validated = CreateMatterSchema.parse(data);

    // Generate matter number if not provided
    if (!validated.matterNumber) {
      validated.matterNumber = await this.generateMatterNumber(tenantId);
    }

    const matter = await LegalMatterModel.create({
      ...validated,
      status: MatterStatus.PROSPECTIVE,
      actualHours: 0,
      createdBy: userId,
      tenantId,
    });

    this.logger.log(`Matter created: ${matter.id} - ${matter.matterNumber}`);
    return matter.toJSON();
  }

  /**
   * Function 2: Update legal matter
   */
  async updateMatter(
    matterId: string,
    data: z.infer<typeof UpdateMatterSchema>,
    userId: string,
  ): Promise<LegalMatter> {
    const validated = UpdateMatterSchema.parse(data);

    const matter = await LegalMatterModel.findByPk(matterId);
    if (!matter) {
      throw new NotFoundException(`Matter ${matterId} not found`);
    }

    await matter.update({
      ...validated,
      updatedBy: userId,
    });

    this.logger.log(`Matter updated: ${matterId}`);
    return matter.toJSON();
  }

  /**
   * Function 3: Get matter details with related data
   */
  async getMatterDetails(matterId: string): Promise<LegalMatter & {
    tasks?: ProjectTask[];
    milestones?: Milestone[];
    resources?: ResourceAllocation[];
    budget?: MatterBudget;
  }> {
    const matter = await LegalMatterModel.findByPk(matterId, {
      include: [
        { model: ProjectTaskModel, as: 'tasks' },
        { model: MilestoneModel, as: 'milestones' },
        { model: ResourceAllocationModel, as: 'resources' },
        { model: MatterBudgetModel, as: 'budget' },
      ],
    });

    if (!matter) {
      throw new NotFoundException(`Matter ${matterId} not found`);
    }

    return matter.toJSON();
  }

  /**
   * Function 4: Create matter from template
   */
  async createMatterFromTemplate(
    templateId: string,
    matterData: z.infer<typeof CreateMatterSchema>,
    userId: string,
    tenantId?: string,
  ): Promise<LegalMatter> {
    const template = await ProjectTemplateModel.findByPk(templateId);
    if (!template) {
      throw new NotFoundException(`Template ${templateId} not found`);
    }

    const transaction = await this.sequelize.transaction();

    try {
      // Create matter
      const matter = await this.createMatter(matterData, userId, tenantId);

      // Create tasks from template
      if (template.defaultTasks && template.defaultTasks.length > 0) {
        const startDate = matter.openDate;
        for (const templateTask of template.defaultTasks) {
          const taskStartDate = new Date(startDate);
          if (templateTask.daysFromStart) {
            taskStartDate.setDate(taskStartDate.getDate() + templateTask.daysFromStart);
          }

          await ProjectTaskModel.create({
            matterId: matter.id,
            title: templateTask.title,
            description: templateTask.description,
            status: TaskStatus.NOT_STARTED,
            priority: TaskPriority.MEDIUM,
            assignedById: userId,
            startDate: taskStartDate,
            estimatedHours: templateTask.estimatedHours,
            dependencies: templateTask.dependencies,
            percentComplete: 0,
            metadata: {},
            createdBy: userId,
            tenantId,
          }, { transaction });
        }
      }

      // Create milestones from template
      if (template.defaultMilestones && template.defaultMilestones.length > 0) {
        const startDate = matter.openDate;
        for (const templateMilestone of template.defaultMilestones) {
          const milestoneDate = new Date(startDate);
          milestoneDate.setDate(milestoneDate.getDate() + templateMilestone.daysFromStart);

          await MilestoneModel.create({
            matterId: matter.id,
            name: templateMilestone.name,
            description: templateMilestone.description,
            status: MilestoneStatus.PENDING,
            targetDate: milestoneDate,
            deliverables: templateMilestone.deliverables,
            criticalPath: false,
            percentComplete: 0,
            metadata: {},
            createdBy: userId,
            tenantId,
          }, { transaction });
        }
      }

      await transaction.commit();
      this.logger.log(`Matter created from template: ${matter.id}`);
      return matter;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Function 5: Define matter scope and objectives
   */
  async updateMatterScope(
    matterId: string,
    scope: string,
    objectives: string[],
    constraints?: string[],
    assumptions?: string[],
    userId?: string,
  ): Promise<LegalMatter> {
    const matter = await LegalMatterModel.findByPk(matterId);
    if (!matter) {
      throw new NotFoundException(`Matter ${matterId} not found`);
    }

    await matter.update({
      scope,
      objectives,
      constraints,
      assumptions,
      updatedBy: userId,
    });

    this.logger.log(`Matter scope updated: ${matterId}`);
    return matter.toJSON();
  }

  /**
   * Function 6: List matters with filters
   */
  async listMatters(filters: {
    status?: MatterStatus;
    matterType?: MatterType;
    priority?: MatterPriority;
    clientId?: string;
    responsibleAttorneyId?: string;
    tenantId?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ matters: LegalMatter[]; total: number }> {
    const where: WhereOptions = {};

    if (filters.status) where['status'] = filters.status;
    if (filters.matterType) where['matterType'] = filters.matterType;
    if (filters.priority) where['priority'] = filters.priority;
    if (filters.clientId) where['clientId'] = filters.clientId;
    if (filters.responsibleAttorneyId) where['responsibleAttorneyId'] = filters.responsibleAttorneyId;
    if (filters.tenantId) where['tenantId'] = filters.tenantId;

    const { rows, count } = await LegalMatterModel.findAndCountAll({
      where,
      limit: filters.limit || 50,
      offset: filters.offset || 0,
      order: [['createdAt', 'DESC']],
    });

    return {
      matters: rows.map(r => r.toJSON()),
      total: count,
    };
  }

  /**
   * Function 7: Close matter
   */
  async closeMatter(
    matterId: string,
    userId: string,
  ): Promise<LegalMatter> {
    const matter = await LegalMatterModel.findByPk(matterId);
    if (!matter) {
      throw new NotFoundException(`Matter ${matterId} not found`);
    }

    await matter.update({
      status: MatterStatus.CLOSED,
      closeDate: new Date(),
      updatedBy: userId,
    });

    this.logger.log(`Matter closed: ${matterId}`);
    return matter.toJSON();
  }

  // ========================================================================
  // BUDGETING FUNCTIONS (Functions 8-13)
  // ========================================================================

  /**
   * Function 8: Create matter budget
   */
  async createBudget(
    data: z.infer<typeof CreateBudgetSchema>,
    userId: string,
    tenantId?: string,
  ): Promise<MatterBudget> {
    const validated = CreateBudgetSchema.parse(data);

    const budget = await MatterBudgetModel.create({
      ...validated,
      status: BudgetStatus.DRAFT,
      actualSpent: 0,
      committed: 0,
      remaining: validated.totalBudget,
      variance: 0,
      variancePercentage: 0,
      createdBy: userId,
      tenantId,
    });

    this.logger.log(`Budget created: ${budget.id} for matter ${data.matterId}`);
    return budget.toJSON();
  }

  /**
   * Function 9: Update budget actuals
   */
  async updateBudgetActuals(
    budgetId: string,
    actualSpent: number,
    committed: number,
    userId: string,
  ): Promise<MatterBudget> {
    const budget = await MatterBudgetModel.findByPk(budgetId);
    if (!budget) {
      throw new NotFoundException(`Budget ${budgetId} not found`);
    }

    const remaining = budget.totalBudget - actualSpent - committed;
    const variance = budget.totalBudget - actualSpent;
    const variancePercentage = (variance / budget.totalBudget) * 100;

    await budget.update({
      actualSpent,
      committed,
      remaining,
      variance,
      variancePercentage,
      status: actualSpent > budget.totalBudget ? BudgetStatus.EXCEEDED : budget.status,
      lastReviewDate: new Date(),
      updatedBy: userId,
    });

    this.logger.log(`Budget actuals updated: ${budgetId}`);
    return budget.toJSON();
  }

  /**
   * Function 10: Get budget variance report
   */
  async getBudgetVarianceReport(matterId: string): Promise<{
    budget: MatterBudget;
    variance: number;
    variancePercentage: number;
    isOverBudget: boolean;
    projectedOverrun?: number;
  }> {
    const budget = await MatterBudgetModel.findOne({
      where: { matterId, budgetType: 'overall' },
    });

    if (!budget) {
      throw new NotFoundException(`Budget for matter ${matterId} not found`);
    }

    const isOverBudget = budget.actualSpent > budget.totalBudget;
    const projectedOverrun = isOverBudget ? budget.actualSpent - budget.totalBudget : undefined;

    return {
      budget: budget.toJSON(),
      variance: budget.variance,
      variancePercentage: budget.variancePercentage,
      isOverBudget,
      projectedOverrun,
    };
  }

  /**
   * Function 11: Approve budget
   */
  async approveBudget(
    budgetId: string,
    approverId: string,
  ): Promise<MatterBudget> {
    const budget = await MatterBudgetModel.findByPk(budgetId);
    if (!budget) {
      throw new NotFoundException(`Budget ${budgetId} not found`);
    }

    await budget.update({
      status: BudgetStatus.APPROVED,
      approvedBy: approverId,
      approvedAt: new Date(),
      updatedBy: approverId,
    });

    this.logger.log(`Budget approved: ${budgetId}`);
    return budget.toJSON();
  }

  /**
   * Function 12: Calculate forecast at completion
   */
  async calculateForecastAtCompletion(budgetId: string): Promise<number> {
    const budget = await MatterBudgetModel.findByPk(budgetId);
    if (!budget) {
      throw new NotFoundException(`Budget ${budgetId} not found`);
    }

    const matter = await LegalMatterModel.findByPk(budget.matterId);
    if (!matter || !matter.estimatedHours || matter.actualHours === 0) {
      return budget.actualSpent;
    }

    // Calculate cost performance index
    const earnedValue = (matter.actualHours / matter.estimatedHours) * budget.totalBudget;
    const cpi = earnedValue / budget.actualSpent;

    // Forecast at completion = Actual + (Remaining / CPI)
    const forecast = budget.actualSpent + ((budget.totalBudget - earnedValue) / cpi);

    await budget.update({ forecastAtCompletion: forecast });

    return forecast;
  }

  /**
   * Function 13: Get budget summary by category
   */
  async getBudgetSummaryByCategory(matterId: string): Promise<{
    total: number;
    byCategory: Array<{
      category: string;
      budgeted: number;
      actual: number;
      variance: number;
    }>;
  }> {
    const budgets = await MatterBudgetModel.findAll({
      where: { matterId },
    });

    const total = budgets.reduce((sum, b) => sum + b.totalBudget, 0);
    const byCategory = budgets.map(b => ({
      category: b.budgetType,
      budgeted: b.totalBudget,
      actual: b.actualSpent,
      variance: b.variance,
    }));

    return { total, byCategory };
  }

  // ========================================================================
  // TASK TRACKING FUNCTIONS (Functions 14-20)
  // ========================================================================

  /**
   * Function 14: Create project task
   */
  async createTask(
    data: z.infer<typeof CreateTaskSchema>,
    userId: string,
    tenantId?: string,
  ): Promise<ProjectTask> {
    const validated = CreateTaskSchema.parse(data);

    const task = await ProjectTaskModel.create({
      ...validated,
      assignedById: userId,
      percentComplete: 0,
      actualHours: 0,
      createdBy: userId,
      tenantId,
    });

    this.logger.log(`Task created: ${task.id} for matter ${data.matterId}`);
    return task.toJSON();
  }

  /**
   * Function 15: Update task status
   */
  async updateTaskStatus(
    taskId: string,
    status: TaskStatus,
    percentComplete?: number,
    userId?: string,
  ): Promise<ProjectTask> {
    const task = await ProjectTaskModel.findByPk(taskId);
    if (!task) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }

    const updates: Partial<ProjectTask> = {
      status,
      updatedBy: userId,
    };

    if (percentComplete !== undefined) {
      updates.percentComplete = percentComplete;
    }

    if (status === TaskStatus.COMPLETED) {
      updates.completedDate = new Date();
      updates.percentComplete = 100;
    }

    await task.update(updates);

    this.logger.log(`Task status updated: ${taskId} -> ${status}`);
    return task.toJSON();
  }

  /**
   * Function 16: Assign task to user
   */
  async assignTask(
    taskId: string,
    assignedToId: string,
    assignedById: string,
  ): Promise<ProjectTask> {
    const task = await ProjectTaskModel.findByPk(taskId);
    if (!task) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }

    await task.update({
      assignedToId,
      assignedById,
      status: task.status === TaskStatus.NOT_STARTED ? TaskStatus.IN_PROGRESS : task.status,
      updatedBy: assignedById,
    });

    this.logger.log(`Task assigned: ${taskId} -> ${assignedToId}`);
    return task.toJSON();
  }

  /**
   * Function 17: Get task dependencies
   */
  async getTaskDependencies(taskId: string): Promise<ProjectTask[]> {
    const task = await ProjectTaskModel.findByPk(taskId);
    if (!task || !task.dependencies || task.dependencies.length === 0) {
      return [];
    }

    const dependencies = await ProjectTaskModel.findAll({
      where: {
        id: { [Op.in]: task.dependencies },
      },
    });

    return dependencies.map(d => d.toJSON());
  }

  /**
   * Function 18: Update task progress
   */
  async updateTaskProgress(
    taskId: string,
    percentComplete: number,
    actualHours?: number,
    userId?: string,
  ): Promise<ProjectTask> {
    const task = await ProjectTaskModel.findByPk(taskId);
    if (!task) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }

    const updates: Partial<ProjectTask> = {
      percentComplete,
      updatedBy: userId,
    };

    if (actualHours !== undefined) {
      updates.actualHours = actualHours;
    }

    if (percentComplete === 100 && task.status !== TaskStatus.COMPLETED) {
      updates.status = TaskStatus.COMPLETED;
      updates.completedDate = new Date();
    }

    await task.update(updates);

    this.logger.log(`Task progress updated: ${taskId} -> ${percentComplete}%`);
    return task.toJSON();
  }

  /**
   * Function 19: Get tasks by matter
   */
  async getTasksByMatter(
    matterId: string,
    filters?: {
      status?: TaskStatus;
      assignedToId?: string;
      priority?: TaskPriority;
    },
  ): Promise<ProjectTask[]> {
    const where: WhereOptions = { matterId };

    if (filters?.status) where['status'] = filters.status;
    if (filters?.assignedToId) where['assignedToId'] = filters.assignedToId;
    if (filters?.priority) where['priority'] = filters.priority;

    const tasks = await ProjectTaskModel.findAll({
      where,
      order: [['dueDate', 'ASC'], ['priority', 'DESC']],
    });

    return tasks.map(t => t.toJSON());
  }

  /**
   * Function 20: Get overdue tasks
   */
  async getOverdueTasks(tenantId?: string): Promise<ProjectTask[]> {
    const where: WhereOptions = {
      dueDate: { [Op.lt]: new Date() },
      status: { [Op.notIn]: [TaskStatus.COMPLETED, TaskStatus.CANCELLED] },
    };

    if (tenantId) where['tenantId'] = tenantId;

    const tasks = await ProjectTaskModel.findAll({
      where,
      order: [['dueDate', 'ASC']],
    });

    return tasks.map(t => t.toJSON());
  }

  // ========================================================================
  // MILESTONE MANAGEMENT FUNCTIONS (Functions 21-25)
  // ========================================================================

  /**
   * Function 21: Create milestone
   */
  async createMilestone(
    data: z.infer<typeof CreateMilestoneSchema>,
    userId: string,
    tenantId?: string,
  ): Promise<Milestone> {
    const validated = CreateMilestoneSchema.parse(data);

    const milestone = await MilestoneModel.create({
      ...validated,
      status: MilestoneStatus.PENDING,
      percentComplete: 0,
      createdBy: userId,
      tenantId,
    });

    this.logger.log(`Milestone created: ${milestone.id} for matter ${data.matterId}`);
    return milestone.toJSON();
  }

  /**
   * Function 22: Update milestone status
   */
  async updateMilestoneStatus(
    milestoneId: string,
    status: MilestoneStatus,
    actualDate?: Date,
    userId?: string,
  ): Promise<Milestone> {
    const milestone = await MilestoneModel.findByPk(milestoneId);
    if (!milestone) {
      throw new NotFoundException(`Milestone ${milestoneId} not found`);
    }

    const updates: Partial<Milestone> = {
      status,
      updatedBy: userId,
    };

    if (status === MilestoneStatus.COMPLETED) {
      updates.actualDate = actualDate || new Date();
      updates.percentComplete = 100;
    }

    await milestone.update(updates);

    this.logger.log(`Milestone status updated: ${milestoneId} -> ${status}`);
    return milestone.toJSON();
  }

  /**
   * Function 23: Get milestones by matter
   */
  async getMilestonesByMatter(matterId: string): Promise<Milestone[]> {
    const milestones = await MilestoneModel.findAll({
      where: { matterId },
      order: [['targetDate', 'ASC']],
    });

    return milestones.map(m => m.toJSON());
  }

  /**
   * Function 24: Get critical path milestones
   */
  async getCriticalPathMilestones(matterId: string): Promise<Milestone[]> {
    const milestones = await MilestoneModel.findAll({
      where: { matterId, criticalPath: true },
      order: [['targetDate', 'ASC']],
    });

    return milestones.map(m => m.toJSON());
  }

  /**
   * Function 25: Track milestone deliverables
   */
  async updateMilestoneDeliverables(
    milestoneId: string,
    deliverables: string[],
    userId?: string,
  ): Promise<Milestone> {
    const milestone = await MilestoneModel.findByPk(milestoneId);
    if (!milestone) {
      throw new NotFoundException(`Milestone ${milestoneId} not found`);
    }

    await milestone.update({
      deliverables,
      updatedBy: userId,
    });

    this.logger.log(`Milestone deliverables updated: ${milestoneId}`);
    return milestone.toJSON();
  }

  // ========================================================================
  // RESOURCE ALLOCATION FUNCTIONS (Functions 26-30)
  // ========================================================================

  /**
   * Function 26: Allocate resource to matter
   */
  async allocateResource(
    data: z.infer<typeof CreateResourceAllocationSchema>,
    userId: string,
    tenantId?: string,
  ): Promise<ResourceAllocation> {
    const validated = CreateResourceAllocationSchema.parse(data);

    const allocation = await ResourceAllocationModel.create({
      ...validated,
      status: ResourceAllocationStatus.REQUESTED,
      actualHours: 0,
      createdBy: userId,
      tenantId,
    });

    this.logger.log(`Resource allocated: ${allocation.id} for matter ${data.matterId}`);
    return allocation.toJSON();
  }

  /**
   * Function 27: Update resource allocation
   */
  async updateResourceAllocation(
    allocationId: string,
    data: z.infer<typeof UpdateResourceAllocationSchema>,
    userId: string,
  ): Promise<ResourceAllocation> {
    const validated = UpdateResourceAllocationSchema.parse(data);

    const allocation = await ResourceAllocationModel.findByPk(allocationId);
    if (!allocation) {
      throw new NotFoundException(`Resource allocation ${allocationId} not found`);
    }

    await allocation.update({
      ...validated,
      updatedBy: userId,
    });

    this.logger.log(`Resource allocation updated: ${allocationId}`);
    return allocation.toJSON();
  }

  /**
   * Function 28: Get resource allocations by matter
   */
  async getResourceAllocationsByMatter(matterId: string): Promise<ResourceAllocation[]> {
    const allocations = await ResourceAllocationModel.findAll({
      where: { matterId },
      order: [['startDate', 'ASC']],
    });

    return allocations.map(a => a.toJSON());
  }

  /**
   * Function 29: Calculate resource utilization
   */
  async calculateResourceUtilization(
    resourceId: string,
    periodStart: Date,
    periodEnd: Date,
  ): Promise<{
    totalAllocated: number;
    totalActual: number;
    utilizationRate: number;
    activeMatters: number;
  }> {
    const allocations = await ResourceAllocationModel.findAll({
      where: {
        resourceId,
        status: ResourceAllocationStatus.ACTIVE,
        startDate: { [Op.lte]: periodEnd },
        [Op.or]: [
          { endDate: { [Op.gte]: periodStart } },
          { endDate: null },
        ],
      },
    });

    const totalAllocated = allocations.reduce((sum, a) => sum + (a.estimatedHours || 0), 0);
    const totalActual = allocations.reduce((sum, a) => sum + (a.actualHours || 0), 0);
    const utilizationRate = totalAllocated > 0 ? (totalActual / totalAllocated) * 100 : 0;

    return {
      totalAllocated,
      totalActual,
      utilizationRate,
      activeMatters: allocations.length,
    };
  }

  /**
   * Function 30: Get resource capacity report
   */
  async getResourceCapacityReport(
    resourceIds: string[],
    periodStart: Date,
    periodEnd: Date,
  ): Promise<Array<{
    resourceId: string;
    allocated: number;
    available: number;
    overallocated: boolean;
  }>> {
    const assumedCapacity = 160; // hours per month

    const results = await Promise.all(
      resourceIds.map(async resourceId => {
        const allocations = await ResourceAllocationModel.findAll({
          where: {
            resourceId,
            status: ResourceAllocationStatus.ACTIVE,
            startDate: { [Op.lte]: periodEnd },
            [Op.or]: [
              { endDate: { [Op.gte]: periodStart } },
              { endDate: null },
            ],
          },
        });

        const allocated = allocations.reduce((sum, a) => sum + (a.estimatedHours || 0), 0);
        const available = assumedCapacity - allocated;

        return {
          resourceId,
          allocated,
          available,
          overallocated: allocated > assumedCapacity,
        };
      }),
    );

    return results;
  }

  // ========================================================================
  // STATUS REPORTING FUNCTIONS (Functions 31-35)
  // ========================================================================

  /**
   * Function 31: Create status report
   */
  async createStatusReport(
    data: z.infer<typeof CreateStatusReportSchema>,
    userId: string,
    tenantId?: string,
  ): Promise<StatusReport> {
    const validated = CreateStatusReportSchema.parse(data);

    const report = await StatusReportModel.create({
      ...validated,
      reportDate: new Date(),
      createdBy: userId,
      tenantId,
    });

    this.logger.log(`Status report created: ${report.id} for matter ${data.matterId}`);
    return report.toJSON();
  }

  /**
   * Function 32: Generate comprehensive status report
   */
  async generateComprehensiveStatusReport(
    matterId: string,
    periodStart: Date,
    periodEnd: Date,
    userId: string,
    tenantId?: string,
  ): Promise<StatusReport> {
    // Get matter details
    const matter = await LegalMatterModel.findByPk(matterId);
    if (!matter) {
      throw new NotFoundException(`Matter ${matterId} not found`);
    }

    // Get tasks summary
    const tasks = await ProjectTaskModel.findAll({ where: { matterId } });
    const scheduleStatus: ScheduleStatusSummary = {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
      inProgressTasks: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
      delayedTasks: tasks.filter(t => t.dueDate && t.dueDate < new Date() && t.status !== TaskStatus.COMPLETED).length,
      upcomingDeadlines: tasks.filter(t => {
        if (!t.dueDate) return false;
        const daysUntilDue = Math.floor((t.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return daysUntilDue >= 0 && daysUntilDue <= 7;
      }).length,
      criticalPathStatus: 'on_track' as const,
    };

    // Get budget summary
    const budget = await MatterBudgetModel.findOne({
      where: { matterId, budgetType: 'overall' },
    });

    const budgetStatus: BudgetStatusSummary | undefined = budget ? {
      budgeted: budget.totalBudget,
      spent: budget.actualSpent,
      committed: budget.committed,
      remaining: budget.remaining,
      variance: budget.variance,
      variancePercentage: budget.variancePercentage,
      atRisk: budget.actualSpent > budget.totalBudget * 0.9,
    } : undefined;

    // Get resource summary
    const resources = await ResourceAllocationModel.findAll({
      where: { matterId, status: ResourceAllocationStatus.ACTIVE },
    });

    const resourceStatus: ResourceStatusSummary = {
      totalResources: resources.length,
      activeResources: resources.length,
      utilization: 0, // Would calculate based on actual vs estimated hours
      overallocated: 0,
      underutilized: 0,
    };

    // Create comprehensive report
    const report = await StatusReportModel.create({
      matterId,
      reportType: ReportType.EXECUTIVE_SUMMARY,
      reportDate: new Date(),
      periodStart,
      periodEnd,
      summary: `Status report for ${matter.title} (${matter.matterNumber})`,
      scheduleStatus,
      budgetStatus,
      resourceStatus,
      metadata: {},
      createdBy: userId,
      tenantId,
    });

    this.logger.log(`Comprehensive status report generated: ${report.id}`);
    return report.toJSON();
  }

  /**
   * Function 33: Get status reports by matter
   */
  async getStatusReportsByMatter(
    matterId: string,
    reportType?: ReportType,
  ): Promise<StatusReport[]> {
    const where: WhereOptions = { matterId };
    if (reportType) where['reportType'] = reportType;

    const reports = await StatusReportModel.findAll({
      where,
      order: [['reportDate', 'DESC']],
    });

    return reports.map(r => r.toJSON());
  }

  /**
   * Function 34: Generate Gantt chart data
   */
  async generateGanttChartData(matterId: string): Promise<{
    tasks: Array<{
      id: string;
      name: string;
      start: Date;
      end: Date;
      progress: number;
      dependencies: string[];
    }>;
    milestones: Array<{
      id: string;
      name: string;
      date: Date;
    }>;
  }> {
    const tasks = await ProjectTaskModel.findAll({
      where: { matterId },
      order: [['startDate', 'ASC']],
    });

    const milestones = await MilestoneModel.findAll({
      where: { matterId },
      order: [['targetDate', 'ASC']],
    });

    return {
      tasks: tasks.map(t => ({
        id: t.id,
        name: t.title,
        start: t.startDate || t.createdAt,
        end: t.dueDate || t.createdAt,
        progress: t.percentComplete,
        dependencies: t.dependencies || [],
      })),
      milestones: milestones.map(m => ({
        id: m.id,
        name: m.name,
        date: m.targetDate,
      })),
    };
  }

  /**
   * Function 35: Calculate project health score
   */
  async calculateProjectHealthScore(matterId: string): Promise<{
    overallScore: number;
    scheduleHealth: number;
    budgetHealth: number;
    resourceHealth: number;
    riskLevel: RiskLevel;
  }> {
    // Get tasks and calculate schedule health
    const tasks = await ProjectTaskModel.findAll({ where: { matterId } });
    const completedOnTime = tasks.filter(t =>
      t.status === TaskStatus.COMPLETED &&
      (!t.dueDate || !t.completedDate || t.completedDate <= t.dueDate)
    ).length;
    const scheduleHealth = tasks.length > 0 ? (completedOnTime / tasks.length) * 100 : 100;

    // Get budget and calculate budget health
    const budget = await MatterBudgetModel.findOne({
      where: { matterId, budgetType: 'overall' },
    });
    const budgetHealth = budget
      ? Math.max(0, 100 - Math.abs(budget.variancePercentage))
      : 100;

    // Calculate resource health (simplified)
    const resources = await ResourceAllocationModel.findAll({
      where: { matterId, status: ResourceAllocationStatus.ACTIVE },
    });
    const resourceHealth = resources.length > 0 ? 75 : 50; // Simplified calculation

    // Overall score
    const overallScore = (scheduleHealth + budgetHealth + resourceHealth) / 3;

    // Determine risk level
    let riskLevel: RiskLevel;
    if (overallScore >= 80) riskLevel = RiskLevel.LOW;
    else if (overallScore >= 60) riskLevel = RiskLevel.MEDIUM;
    else if (overallScore >= 40) riskLevel = RiskLevel.HIGH;
    else riskLevel = RiskLevel.CRITICAL;

    return {
      overallScore,
      scheduleHealth,
      budgetHealth,
      resourceHealth,
      riskLevel,
    };
  }

  // ========================================================================
  // UTILITY FUNCTIONS (Functions 36-39)
  // ========================================================================

  /**
   * Function 36: Generate unique matter number
   */
  async generateMatterNumber(tenantId?: string): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = tenantId ? tenantId.substring(0, 4).toUpperCase() : 'MAT';

    // Count existing matters for this year
    const count = await LegalMatterModel.count({
      where: {
        matterNumber: { [Op.like]: `${prefix}-${year}-%` },
        ...(tenantId ? { tenantId } : {}),
      },
    });

    const sequence = String(count + 1).padStart(6, '0');
    return `${prefix}-${year}-${sequence}`;
  }

  /**
   * Function 37: Validate task dependencies
   */
  async validateTaskDependencies(taskId: string): Promise<{
    valid: boolean;
    blockedBy: string[];
    canStart: boolean;
  }> {
    const task = await ProjectTaskModel.findByPk(taskId);
    if (!task || !task.dependencies || task.dependencies.length === 0) {
      return { valid: true, blockedBy: [], canStart: true };
    }

    const dependencies = await ProjectTaskModel.findAll({
      where: { id: { [Op.in]: task.dependencies } },
    });

    const blockedBy = dependencies
      .filter(d => d.status !== TaskStatus.COMPLETED)
      .map(d => d.id);

    return {
      valid: blockedBy.length === 0,
      blockedBy,
      canStart: blockedBy.length === 0,
    };
  }

  /**
   * Function 38: Archive closed matters
   */
  async archiveClosedMatters(closedBeforeDate: Date, tenantId?: string): Promise<number> {
    const where: WhereOptions = {
      status: MatterStatus.CLOSED,
      closeDate: { [Op.lt]: closedBeforeDate },
    };

    if (tenantId) where['tenantId'] = tenantId;

    const [affectedCount] = await LegalMatterModel.update(
      { status: MatterStatus.ARCHIVED },
      { where },
    );

    this.logger.log(`Archived ${affectedCount} closed matters`);
    return affectedCount;
  }

  /**
   * Function 39: Get matter statistics
   */
  async getMatterStatistics(tenantId?: string): Promise<{
    totalMatters: number;
    byStatus: Record<MatterStatus, number>;
    byType: Record<MatterType, number>;
    byPriority: Record<MatterPriority, number>;
    averageBudget: number;
    totalBudget: number;
  }> {
    const where: WhereOptions = {};
    if (tenantId) where['tenantId'] = tenantId;

    const matters = await LegalMatterModel.findAll({ where });

    const byStatus = {} as Record<MatterStatus, number>;
    const byType = {} as Record<MatterType, number>;
    const byPriority = {} as Record<MatterPriority, number>;

    Object.values(MatterStatus).forEach(s => byStatus[s] = 0);
    Object.values(MatterType).forEach(t => byType[t] = 0);
    Object.values(MatterPriority).forEach(p => byPriority[p] = 0);

    let totalBudget = 0;
    let budgetCount = 0;

    matters.forEach(m => {
      byStatus[m.status]++;
      byType[m.matterType]++;
      byPriority[m.priority]++;
      if (m.budgetAmount) {
        totalBudget += m.budgetAmount;
        budgetCount++;
      }
    });

    return {
      totalMatters: matters.length,
      byStatus,
      byType,
      byPriority,
      averageBudget: budgetCount > 0 ? totalBudget / budgetCount : 0,
      totalBudget,
    };
  }
}

// ============================================================================
// NESTJS MODULE
// ============================================================================

@Global()
@Module({
  providers: [LegalProjectManagementService],
  exports: [LegalProjectManagementService],
})
export class LegalProjectManagementModule {
  static forRoot(): DynamicModule {
    return {
      module: LegalProjectManagementModule,
      providers: [LegalProjectManagementService],
      exports: [LegalProjectManagementService],
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  LegalProjectManagementService,
  LegalProjectManagementModule,
  // Models
  LegalMatterModel,
  ProjectTaskModel,
  MilestoneModel,
  ResourceAllocationModel,
  MatterBudgetModel,
  StatusReportModel,
  ProjectTemplateModel,
  // DTOs
  CreateMatterDto,
  UpdateMatterDto,
  CreateTaskDto,
  UpdateTaskDto,
  CreateMilestoneDto,
  UpdateMilestoneDto,
  CreateResourceAllocationDto,
  UpdateResourceAllocationDto,
  CreateBudgetDto,
  UpdateBudgetDto,
  CreateStatusReportDto,
  // Schemas
  CreateMatterSchema,
  UpdateMatterSchema,
  CreateTaskSchema,
  UpdateTaskSchema,
  CreateMilestoneSchema,
  UpdateMilestoneSchema,
  CreateResourceAllocationSchema,
  UpdateResourceAllocationSchema,
  CreateBudgetSchema,
  UpdateBudgetSchema,
  CreateStatusReportSchema,
  // Enums
  MatterStatus,
  MatterPriority,
  MatterType,
  TaskStatus,
  TaskPriority,
  MilestoneStatus,
  ResourceAllocationStatus,
  BudgetStatus,
  ExpenseType,
  ReportType,
  RiskLevel,
};
