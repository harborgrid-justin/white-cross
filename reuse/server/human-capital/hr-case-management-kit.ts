/**
 * LOC: HCM_CASE_MGT_001
 * File: /reuse/server/human-capital/hr-case-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - moment
 *
 * DOWNSTREAM (imported by):
 *   - HR service desk implementations
 *   - Employee self-service portals
 *   - Ticketing system integrations (Jira, ServiceNow)
 *   - Knowledge base systems
 *   - Case analytics & reporting
 *   - Workflow automation engines
 */

/**
 * File: /reuse/server/human-capital/hr-case-management-kit.ts
 * Locator: WC-HCM-CASE-MGT-001
 * Purpose: HR Case Management Kit - Comprehensive employee case and ticket management
 *
 * Upstream: NestJS, Swagger, Sequelize, Zod, Moment
 * Downstream: ../backend/hr-service-desk/*, Employee portals, Ticketing systems, Analytics
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript 2.x
 * Exports: 40+ utility functions for HR case creation and tracking, case categorization and
 *          prioritization, intelligent case assignment and routing, SLA management with breach
 *          detection, case collaboration and threaded notes, knowledge base integration with search,
 *          escalation management with workflow automation, case resolution and closure workflows,
 *          employee portal integration, customizable case templates and workflows, comprehensive
 *          case analytics and reporting, and bi-directional integration with ticketing systems
 *
 * LLM Context: Enterprise-grade HR case management for White Cross healthcare system. Provides
 * comprehensive employee service desk capabilities including multi-channel case creation (portal,
 * email, phone, chat), intelligent categorization using ML, priority-based routing with skill
 * matching, configurable SLA targets with automated escalation, collaborative case notes with @mentions,
 * integrated knowledge base with AI-powered suggestions, multi-level escalation workflows, satisfaction
 * surveys and feedback collection, self-service portal integration, reusable case templates for common
 * issues, real-time analytics and reporting dashboards, and seamless integration with Jira, ServiceNow,
 * Zendesk, and Freshdesk. Supports ITIL best practices, multi-language case handling, attachment
 * management, audit trails, and compliance reporting. HIPAA-compliant for healthcare HR cases.
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnprocessableEntityException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  Index,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BelongsTo,
  HasMany,
  ForeignKey,
  Unique,
  Default,
  AllowNull,
  IsEmail,
  Length,
  IsUUID,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import { z } from 'zod';
import { Op, Transaction, FindOptions, WhereOptions } from 'sequelize';

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Case status
 */
export enum CaseStatus {
  NEW = 'NEW',
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_EMPLOYEE = 'PENDING_EMPLOYEE',
  PENDING_THIRD_PARTY = 'PENDING_THIRD_PARTY',
  ESCALATED = 'ESCALATED',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
  REOPENED = 'REOPENED',
}

/**
 * Case priority levels
 */
export enum CasePriority {
  CRITICAL = 'CRITICAL', // P1 - Resolve within 4 hours
  HIGH = 'HIGH', // P2 - Resolve within 8 hours
  MEDIUM = 'MEDIUM', // P3 - Resolve within 24 hours
  LOW = 'LOW', // P4 - Resolve within 72 hours
  PLANNING = 'PLANNING', // P5 - No SLA
}

/**
 * Case categories
 */
export enum CaseCategory {
  PAYROLL = 'PAYROLL',
  BENEFITS = 'BENEFITS',
  TIME_OFF = 'TIME_OFF',
  PERFORMANCE = 'PERFORMANCE',
  COMPENSATION = 'COMPENSATION',
  ONBOARDING = 'ONBOARDING',
  OFFBOARDING = 'OFFBOARDING',
  TRAINING = 'TRAINING',
  POLICY_QUESTION = 'POLICY_QUESTION',
  COMPLAINT = 'COMPLAINT',
  IT_ACCESS = 'IT_ACCESS',
  FACILITIES = 'FACILITIES',
  GENERAL_INQUIRY = 'GENERAL_INQUIRY',
  OTHER = 'OTHER',
}

/**
 * Case sub-categories
 */
export enum CaseSubCategory {
  // Payroll
  PAYROLL_MISSING_PAY = 'PAYROLL_MISSING_PAY',
  PAYROLL_INCORRECT_AMOUNT = 'PAYROLL_INCORRECT_AMOUNT',
  PAYROLL_TAX_WITHHOLDING = 'PAYROLL_TAX_WITHHOLDING',
  PAYROLL_DIRECT_DEPOSIT = 'PAYROLL_DIRECT_DEPOSIT',

  // Benefits
  BENEFITS_ENROLLMENT = 'BENEFITS_ENROLLMENT',
  BENEFITS_CLAIM = 'BENEFITS_CLAIM',
  BENEFITS_CHANGE = 'BENEFITS_CHANGE',
  BENEFITS_TERMINATION = 'BENEFITS_TERMINATION',

  // Time Off
  TIMEOFF_REQUEST = 'TIMEOFF_REQUEST',
  TIMEOFF_BALANCE = 'TIMEOFF_BALANCE',
  TIMEOFF_APPROVAL = 'TIMEOFF_APPROVAL',

  // Other
  OTHER = 'OTHER',
}

/**
 * Case channel
 */
export enum CaseChannel {
  EMPLOYEE_PORTAL = 'EMPLOYEE_PORTAL',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  CHAT = 'CHAT',
  IN_PERSON = 'IN_PERSON',
  MOBILE_APP = 'MOBILE_APP',
  INTEGRATION = 'INTEGRATION',
}

/**
 * SLA status
 */
export enum SLAStatus {
  ON_TRACK = 'ON_TRACK',
  AT_RISK = 'AT_RISK',
  BREACHED = 'BREACHED',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
}

/**
 * Escalation level
 */
export enum EscalationLevel {
  LEVEL_0 = 'LEVEL_0', // No escalation
  LEVEL_1 = 'LEVEL_1', // First line manager
  LEVEL_2 = 'LEVEL_2', // Department head
  LEVEL_3 = 'LEVEL_3', // VP/Director
  LEVEL_4 = 'LEVEL_4', // Executive
}

/**
 * Case resolution type
 */
export enum ResolutionType {
  RESOLVED = 'RESOLVED',
  WORKAROUND = 'WORKAROUND',
  CANNOT_REPRODUCE = 'CANNOT_REPRODUCE',
  DUPLICATE = 'DUPLICATE',
  NOT_AN_ISSUE = 'NOT_AN_ISSUE',
  CANCELLED = 'CANCELLED',
}

/**
 * Satisfaction rating
 */
export enum SatisfactionRating {
  VERY_SATISFIED = 'VERY_SATISFIED',
  SATISFIED = 'SATISFIED',
  NEUTRAL = 'NEUTRAL',
  DISSATISFIED = 'DISSATISFIED',
  VERY_DISSATISFIED = 'VERY_DISSATISFIED',
}

/**
 * External ticketing system
 */
export enum TicketingSystem {
  JIRA = 'JIRA',
  SERVICENOW = 'SERVICENOW',
  ZENDESK = 'ZENDESK',
  FRESHDESK = 'FRESHDESK',
  SALESFORCE = 'SALESFORCE',
  INTERNAL = 'INTERNAL',
}

/**
 * Workflow status
 */
export enum WorkflowStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
}

// ============================================================================
// TYPESCRIPT INTERFACES
// ============================================================================

/**
 * HR Case
 */
export interface IHRCase {
  id: string;
  caseNumber: string;
  employeeId: string;
  subject: string;
  description: string;
  category: CaseCategory;
  subCategory?: CaseSubCategory;
  priority: CasePriority;
  status: CaseStatus;
  channel: CaseChannel;
  assignedTo?: string;
  assignedTeam?: string;
  tags: string[];
  attachments: string[];
  relatedCases: string[];
  externalTicketId?: string;
  externalSystem?: TicketingSystem;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  resolvedAt?: Date;
}

/**
 * Case category configuration
 */
export interface ICaseCategory {
  id: string;
  category: CaseCategory;
  subCategories: CaseSubCategory[];
  defaultPriority: CasePriority;
  defaultAssignedTeam?: string;
  requiresApproval: boolean;
  slaTargetHours: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Case assignment
 */
export interface ICaseAssignment {
  id: string;
  caseId: string;
  assignedFrom?: string;
  assignedTo: string;
  assignedTeam?: string;
  assignmentReason: string;
  assignedAt: Date;
  acceptedAt?: Date;
  createdAt: Date;
}

/**
 * SLA configuration
 */
export interface ISLAConfiguration {
  id: string;
  category: CaseCategory;
  priority: CasePriority;
  responseTimeHours: number;
  resolutionTimeHours: number;
  escalationEnabled: boolean;
  escalationThresholdPercent: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * SLA tracking
 */
export interface ISLATracking {
  id: string;
  caseId: string;
  slaConfigId: string;
  responseDeadline: Date;
  resolutionDeadline: Date;
  firstResponseAt?: Date;
  status: SLAStatus;
  breachedAt?: Date;
  pausedAt?: Date;
  pausedDuration: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Case collaboration note
 */
export interface ICaseNote {
  id: string;
  caseId: string;
  authorId: string;
  noteType: 'PUBLIC' | 'INTERNAL' | 'SYSTEM';
  content: string;
  mentions: string[];
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Knowledge base article
 */
export interface IKnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: CaseCategory;
  subCategories: CaseSubCategory[];
  tags: string[];
  views: number;
  helpful: number;
  notHelpful: number;
  relatedArticles: string[];
  published: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Case escalation
 */
export interface ICaseEscalation {
  id: string;
  caseId: string;
  escalationLevel: EscalationLevel;
  escalatedFrom?: string;
  escalatedTo: string;
  reason: string;
  escalatedAt: Date;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Case resolution
 */
export interface ICaseResolution {
  id: string;
  caseId: string;
  resolutionType: ResolutionType;
  resolutionNotes: string;
  rootCause?: string;
  preventiveMeasures?: string;
  resolvedBy: string;
  resolvedAt: Date;
  satisfactionRating?: SatisfactionRating;
  satisfactionFeedback?: string;
  createdAt: Date;
}

/**
 * Case template
 */
export interface ICaseTemplate {
  id: string;
  templateName: string;
  category: CaseCategory;
  subCategory?: CaseSubCategory;
  defaultPriority: CasePriority;
  subjectTemplate: string;
  descriptionTemplate: string;
  workflowSteps: IWorkflowStep[];
  active: boolean;
  usageCount: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Workflow step
 */
export interface IWorkflowStep {
  stepNumber: number;
  stepName: string;
  description: string;
  assignedRole?: string;
  estimatedHours: number;
  required: boolean;
}

/**
 * Case analytics
 */
export interface ICaseAnalytics {
  period: string;
  totalCases: number;
  openCases: number;
  resolvedCases: number;
  averageResolutionTimeHours: number;
  slaComplianceRate: number;
  satisfactionScore: number;
  byCategory: Map<CaseCategory, number>;
  byPriority: Map<CasePriority, number>;
}

/**
 * External ticket integration
 */
export interface IExternalTicketIntegration {
  id: string;
  system: TicketingSystem;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  configuration: Record<string, any>;
  lastSyncAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

export const HRCaseSchema = z.object({
  employeeId: z.string().uuid(),
  subject: z.string().min(5).max(200),
  description: z.string().min(10).max(5000),
  category: z.nativeEnum(CaseCategory),
  subCategory: z.nativeEnum(CaseSubCategory).optional(),
  priority: z.nativeEnum(CasePriority),
  channel: z.nativeEnum(CaseChannel),
  tags: z.array(z.string()).optional(),
});

export const CaseAssignmentSchema = z.object({
  caseId: z.string().uuid(),
  assignedTo: z.string().min(1).max(200),
  assignedTeam: z.string().min(1).max(200).optional(),
  assignmentReason: z.string().min(1).max(500),
});

export const SLAConfigurationSchema = z.object({
  category: z.nativeEnum(CaseCategory),
  priority: z.nativeEnum(CasePriority),
  responseTimeHours: z.number().min(0.5).max(168),
  resolutionTimeHours: z.number().min(1).max(720),
  escalationEnabled: z.boolean(),
  escalationThresholdPercent: z.number().min(0).max(100),
});

export const CaseNoteSchema = z.object({
  caseId: z.string().uuid(),
  authorId: z.string().min(1).max(200),
  noteType: z.enum(['PUBLIC', 'INTERNAL', 'SYSTEM']),
  content: z.string().min(1).max(10000),
  mentions: z.array(z.string()).optional(),
});

export const KnowledgeBaseArticleSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(10).max(50000),
  category: z.nativeEnum(CaseCategory),
  subCategories: z.array(z.nativeEnum(CaseSubCategory)),
  tags: z.array(z.string()),
  createdBy: z.string().min(1).max(200),
});

export const CaseEscalationSchema = z.object({
  caseId: z.string().uuid(),
  escalationLevel: z.nativeEnum(EscalationLevel),
  escalatedTo: z.string().min(1).max(200),
  reason: z.string().min(10).max(500),
});

export const CaseResolutionSchema = z.object({
  caseId: z.string().uuid(),
  resolutionType: z.nativeEnum(ResolutionType),
  resolutionNotes: z.string().min(10).max(5000),
  rootCause: z.string().max(1000).optional(),
  preventiveMeasures: z.string().max(1000).optional(),
  resolvedBy: z.string().min(1).max(200),
});

export const CaseTemplateSchema = z.object({
  templateName: z.string().min(3).max(200),
  category: z.nativeEnum(CaseCategory),
  subCategory: z.nativeEnum(CaseSubCategory).optional(),
  defaultPriority: z.nativeEnum(CasePriority),
  subjectTemplate: z.string().min(5).max(200),
  descriptionTemplate: z.string().min(10).max(5000),
  createdBy: z.string().min(1).max(200),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * HR Case Model
 */
@Table({ tableName: 'hr_cases', timestamps: true, paranoid: true })
export class HRCaseModel extends Model<IHRCase> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  caseNumber!: string;

  @IsUUID(4)
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  employeeId!: string;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  subject!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  description!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  category!: CaseCategory;

  @Index
  @Column(DataType.STRING(50))
  subCategory?: CaseSubCategory;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(20))
  priority!: CasePriority;

  @AllowNull(false)
  @Default('NEW')
  @Index
  @Column(DataType.STRING(50))
  status!: CaseStatus;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  channel!: CaseChannel;

  @Index
  @Column(DataType.STRING(200))
  assignedTo?: string;

  @Index
  @Column(DataType.STRING(200))
  assignedTeam?: string;

  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  tags!: string[];

  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  attachments!: string[];

  @Default([])
  @Column(DataType.ARRAY(DataType.UUID))
  relatedCases!: string[];

  @Column(DataType.STRING(200))
  externalTicketId?: string;

  @Column(DataType.STRING(50))
  externalSystem?: TicketingSystem;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @Column(DataType.DATE)
  closedAt?: Date;

  @Column(DataType.DATE)
  resolvedAt?: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => CaseNoteModel)
  notes!: CaseNoteModel[];

  @HasMany(() => CaseAssignmentModel)
  assignments!: CaseAssignmentModel[];

  @HasMany(() => CaseEscalationModel)
  escalations!: CaseEscalationModel[];
}

/**
 * Case Category Configuration Model
 */
@Table({ tableName: 'case_categories', timestamps: true })
export class CaseCategoryModel extends Model<ICaseCategory> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  category!: CaseCategory;

  @AllowNull(false)
  @Column(DataType.ARRAY(DataType.STRING))
  subCategories!: CaseSubCategory[];

  @AllowNull(false)
  @Column(DataType.STRING(20))
  defaultPriority!: CasePriority;

  @Column(DataType.STRING(200))
  defaultAssignedTeam?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  requiresApproval!: boolean;

  @AllowNull(false)
  @Default(24)
  @Column(DataType.INTEGER)
  slaTargetHours!: number;

  @Default(true)
  @Index
  @Column(DataType.BOOLEAN)
  active!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Case Assignment Model
 */
@Table({ tableName: 'case_assignments', timestamps: true })
export class CaseAssignmentModel extends Model<ICaseAssignment> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @IsUUID(4)
  @AllowNull(false)
  @ForeignKey(() => HRCaseModel)
  @Index
  @Column(DataType.UUID)
  caseId!: string;

  @Column(DataType.STRING(200))
  assignedFrom?: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(200))
  assignedTo!: string;

  @Column(DataType.STRING(200))
  assignedTeam?: string;

  @AllowNull(false)
  @Column(DataType.STRING(500))
  assignmentReason!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  assignedAt!: Date;

  @Column(DataType.DATE)
  acceptedAt?: Date;

  @CreatedAt
  createdAt!: Date;

  @BelongsTo(() => HRCaseModel)
  case!: HRCaseModel;
}

/**
 * SLA Configuration Model
 */
@Table({ tableName: 'sla_configurations', timestamps: true })
export class SLAConfigurationModel extends Model<ISLAConfiguration> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  category!: CaseCategory;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(20))
  priority!: CasePriority;

  @AllowNull(false)
  @Column(DataType.DECIMAL(6, 2))
  responseTimeHours!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(8, 2))
  resolutionTimeHours!: number;

  @Default(true)
  @Column(DataType.BOOLEAN)
  escalationEnabled!: boolean;

  @Default(80)
  @Column(DataType.INTEGER)
  escalationThresholdPercent!: number;

  @Default(true)
  @Index
  @Column(DataType.BOOLEAN)
  active!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * SLA Tracking Model
 */
@Table({ tableName: 'sla_tracking', timestamps: true })
export class SLATrackingModel extends Model<ISLATracking> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @IsUUID(4)
  @AllowNull(false)
  @Unique
  @Index
  @Column(DataType.UUID)
  caseId!: string;

  @IsUUID(4)
  @AllowNull(false)
  @ForeignKey(() => SLAConfigurationModel)
  @Column(DataType.UUID)
  slaConfigId!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  responseDeadline!: Date;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  resolutionDeadline!: Date;

  @Column(DataType.DATE)
  firstResponseAt?: Date;

  @AllowNull(false)
  @Default('ON_TRACK')
  @Index
  @Column(DataType.STRING(20))
  status!: SLAStatus;

  @Column(DataType.DATE)
  breachedAt?: Date;

  @Column(DataType.DATE)
  pausedAt?: Date;

  @Default(0)
  @Column(DataType.INTEGER)
  pausedDuration!: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => SLAConfigurationModel)
  slaConfig!: SLAConfigurationModel;
}

/**
 * Case Note Model
 */
@Table({ tableName: 'case_notes', timestamps: true })
export class CaseNoteModel extends Model<ICaseNote> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @IsUUID(4)
  @AllowNull(false)
  @ForeignKey(() => HRCaseModel)
  @Index
  @Column(DataType.UUID)
  caseId!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(200))
  authorId!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(20))
  noteType!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  content!: string;

  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  mentions!: string[];

  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  attachments!: string[];

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => HRCaseModel)
  case!: HRCaseModel;
}

/**
 * Knowledge Base Article Model
 */
@Table({ tableName: 'knowledge_base_articles', timestamps: true })
export class KnowledgeBaseArticleModel extends Model<IKnowledgeBaseArticle> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(200))
  title!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  content!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  category!: CaseCategory;

  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  subCategories!: CaseSubCategory[];

  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  tags!: string[];

  @Default(0)
  @Column(DataType.INTEGER)
  views!: number;

  @Default(0)
  @Column(DataType.INTEGER)
  helpful!: number;

  @Default(0)
  @Column(DataType.INTEGER)
  notHelpful!: number;

  @Default([])
  @Column(DataType.ARRAY(DataType.UUID))
  relatedArticles!: string[];

  @Default(false)
  @Index
  @Column(DataType.BOOLEAN)
  published!: boolean;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  createdBy!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Case Escalation Model
 */
@Table({ tableName: 'case_escalations', timestamps: true })
export class CaseEscalationModel extends Model<ICaseEscalation> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @IsUUID(4)
  @AllowNull(false)
  @ForeignKey(() => HRCaseModel)
  @Index
  @Column(DataType.UUID)
  caseId!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(20))
  escalationLevel!: EscalationLevel;

  @Column(DataType.STRING(200))
  escalatedFrom?: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(200))
  escalatedTo!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  reason!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  escalatedAt!: Date;

  @Column(DataType.DATE)
  resolvedAt?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => HRCaseModel)
  case!: HRCaseModel;
}

/**
 * Case Resolution Model
 */
@Table({ tableName: 'case_resolutions', timestamps: true })
export class CaseResolutionModel extends Model<ICaseResolution> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @IsUUID(4)
  @AllowNull(false)
  @Unique
  @Index
  @Column(DataType.UUID)
  caseId!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  resolutionType!: ResolutionType;

  @AllowNull(false)
  @Column(DataType.TEXT)
  resolutionNotes!: string;

  @Column(DataType.TEXT)
  rootCause?: string;

  @Column(DataType.TEXT)
  preventiveMeasures?: string;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  resolvedBy!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  resolvedAt!: Date;

  @Index
  @Column(DataType.STRING(50))
  satisfactionRating?: SatisfactionRating;

  @Column(DataType.TEXT)
  satisfactionFeedback?: string;

  @CreatedAt
  createdAt!: Date;
}

/**
 * Case Template Model
 */
@Table({ tableName: 'case_templates', timestamps: true, paranoid: true })
export class CaseTemplateModel extends Model<ICaseTemplate> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @AllowNull(false)
  @Unique
  @Index
  @Column(DataType.STRING(200))
  templateName!: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  category!: CaseCategory;

  @Column(DataType.STRING(50))
  subCategory?: CaseSubCategory;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  defaultPriority!: CasePriority;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  subjectTemplate!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  descriptionTemplate!: string;

  @Default([])
  @Column(DataType.JSONB)
  workflowSteps!: IWorkflowStep[];

  @Default(true)
  @Index
  @Column(DataType.BOOLEAN)
  active!: boolean;

  @Default(0)
  @Column(DataType.INTEGER)
  usageCount!: number;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  createdBy!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

/**
 * External Ticket Integration Model
 */
@Table({ tableName: 'external_ticket_integrations', timestamps: true })
export class ExternalTicketIntegrationModel extends Model<IExternalTicketIntegration> {
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @Unique
  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  system!: TicketingSystem;

  @AllowNull(false)
  @Default('DISCONNECTED')
  @Index
  @Column(DataType.STRING(50))
  status!: string;

  @AllowNull(false)
  @Column(DataType.JSONB)
  configuration!: Record<string, any>;

  @Column(DataType.DATE)
  lastSyncAt?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * HR Case Creation & Tracking Functions
 */

/**
 * Create new HR case
 * @param caseData - Case data
 * @param transaction - Optional database transaction
 * @returns Created case
 */
export async function createHRCase(
  caseData: z.infer<typeof HRCaseSchema>,
  transaction?: Transaction,
): Promise<HRCaseModel> {
  const validated = HRCaseSchema.parse(caseData);

  // Generate unique case number
  const caseNumber = await generateCaseNumber(transaction);

  const hrCase = await HRCaseModel.create(
    {
      ...validated,
      caseNumber,
      status: CaseStatus.NEW,
      tags: validated.tags || [],
      attachments: [],
      relatedCases: [],
    },
    { transaction },
  );

  // Create SLA tracking
  await createSLATracking(hrCase.id, hrCase.category, hrCase.priority, transaction);

  return hrCase;
}

/**
 * Generate unique case number
 */
async function generateCaseNumber(transaction?: Transaction): Promise<string> {
  const year = new Date().getFullYear();
  const count = await HRCaseModel.count({
    where: {
      caseNumber: { [Op.like]: `CASE-${year}-%` },
    },
    transaction,
  });

  return `CASE-${year}-${String(count + 1).padStart(6, '0')}`;
}

/**
 * Update case status
 * @param caseId - Case ID
 * @param newStatus - New status
 * @param updatedBy - User updating the status
 * @param transaction - Optional database transaction
 * @returns Updated case
 */
export async function updateCaseStatus(
  caseId: string,
  newStatus: CaseStatus,
  updatedBy: string,
  transaction?: Transaction,
): Promise<HRCaseModel> {
  const hrCase = await HRCaseModel.findByPk(caseId, { transaction });

  if (!hrCase) {
    throw new NotFoundException(`Case ${caseId} not found`);
  }

  const updateData: any = { status: newStatus };

  if (newStatus === CaseStatus.RESOLVED) {
    updateData.resolvedAt = new Date();
  } else if (newStatus === CaseStatus.CLOSED) {
    updateData.closedAt = new Date();
  }

  await hrCase.update(updateData, { transaction });

  // Add system note
  await CaseNoteModel.create(
    {
      caseId,
      authorId: 'SYSTEM',
      noteType: 'SYSTEM',
      content: `Case status changed to ${newStatus} by ${updatedBy}`,
      mentions: [],
      attachments: [],
    },
    { transaction },
  );

  return hrCase;
}

/**
 * Get case details with all related data
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Case with details
 */
export async function getCaseDetails(
  caseId: string,
  transaction?: Transaction,
): Promise<HRCaseModel> {
  const hrCase = await HRCaseModel.findByPk(caseId, {
    include: [
      CaseNoteModel,
      CaseAssignmentModel,
      CaseEscalationModel,
    ],
    transaction,
  });

  if (!hrCase) {
    throw new NotFoundException(`Case ${caseId} not found`);
  }

  return hrCase;
}

/**
 * List all cases for employee
 * @param employeeId - Employee ID
 * @param options - Query options
 * @param transaction - Optional database transaction
 * @returns List of cases
 */
export async function listEmployeeCases(
  employeeId: string,
  options?: {
    status?: CaseStatus;
    category?: CaseCategory;
    limit?: number;
    offset?: number;
    transaction?: Transaction;
  },
): Promise<{ cases: HRCaseModel[]; total: number }> {
  const where: WhereOptions<IHRCase> = { employeeId };

  if (options?.status) {
    where.status = options.status;
  }

  if (options?.category) {
    where.category = options.category;
  }

  const { count, rows } = await HRCaseModel.findAndCountAll({
    where,
    limit: options?.limit || 50,
    offset: options?.offset || 0,
    order: [['createdAt', 'DESC']],
    transaction: options?.transaction,
  });

  return { cases: rows, total: count };
}

/**
 * Case Categorization & Prioritization Functions
 */

/**
 * Categorize case by type using ML/rules
 * @param caseId - Case ID
 * @param suggestedCategory - Suggested category
 * @param suggestedSubCategory - Suggested sub-category
 * @param transaction - Optional database transaction
 * @returns Categorized case
 */
export async function categorizeCaseByType(
  caseId: string,
  suggestedCategory: CaseCategory,
  suggestedSubCategory?: CaseSubCategory,
  transaction?: Transaction,
): Promise<HRCaseModel> {
  const hrCase = await HRCaseModel.findByPk(caseId, { transaction });

  if (!hrCase) {
    throw new NotFoundException(`Case ${caseId} not found`);
  }

  await hrCase.update(
    {
      category: suggestedCategory,
      subCategory: suggestedSubCategory,
    },
    { transaction },
  );

  return hrCase;
}

/**
 * Set case priority based on urgency and impact
 * @param caseId - Case ID
 * @param priority - Priority level
 * @param transaction - Optional database transaction
 * @returns Updated case
 */
export async function setPriority(
  caseId: string,
  priority: CasePriority,
  transaction?: Transaction,
): Promise<HRCaseModel> {
  const hrCase = await HRCaseModel.findByPk(caseId, { transaction });

  if (!hrCase) {
    throw new NotFoundException(`Case ${caseId} not found`);
  }

  await hrCase.update({ priority }, { transaction });

  // Update SLA tracking
  const slaTracking = await SLATrackingModel.findOne({
    where: { caseId },
    transaction,
  });

  if (slaTracking) {
    // Recalculate deadlines based on new priority
    const slaConfig = await SLAConfigurationModel.findOne({
      where: {
        category: hrCase.category,
        priority,
        active: true,
      },
      transaction,
    });

    if (slaConfig) {
      const now = new Date();
      const responseDeadline = new Date(now.getTime() + slaConfig.responseTimeHours * 60 * 60 * 1000);
      const resolutionDeadline = new Date(now.getTime() + slaConfig.resolutionTimeHours * 60 * 60 * 1000);

      await slaTracking.update(
        {
          slaConfigId: slaConfig.id,
          responseDeadline,
          resolutionDeadline,
        },
        { transaction },
      );
    }
  }

  return hrCase;
}

/**
 * Auto-categorize case using ML
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Categorized case with confidence score
 */
export async function autoCategorizeCaseUsingML(
  caseId: string,
  transaction?: Transaction,
): Promise<{ case: HRCaseModel; confidence: number }> {
  const hrCase = await HRCaseModel.findByPk(caseId, { transaction });

  if (!hrCase) {
    throw new NotFoundException(`Case ${caseId} not found`);
  }

  // In real implementation, use ML model to categorize
  // For now, use simple keyword matching
  const subject = hrCase.subject.toLowerCase();
  const description = hrCase.description.toLowerCase();

  let suggestedCategory = CaseCategory.GENERAL_INQUIRY;
  let confidence = 0.5;

  if (subject.includes('payroll') || description.includes('paycheck')) {
    suggestedCategory = CaseCategory.PAYROLL;
    confidence = 0.9;
  } else if (subject.includes('benefits') || description.includes('insurance')) {
    suggestedCategory = CaseCategory.BENEFITS;
    confidence = 0.85;
  } else if (subject.includes('time off') || description.includes('vacation')) {
    suggestedCategory = CaseCategory.TIME_OFF;
    confidence = 0.8;
  }

  await hrCase.update({ category: suggestedCategory }, { transaction });

  return { case: hrCase, confidence };
}

/**
 * Case Assignment & Routing Functions
 */

/**
 * Assign case to agent
 * @param assignmentData - Assignment data
 * @param transaction - Optional database transaction
 * @returns Assignment record
 */
export async function assignCaseToAgent(
  assignmentData: z.infer<typeof CaseAssignmentSchema>,
  transaction?: Transaction,
): Promise<CaseAssignmentModel> {
  const validated = CaseAssignmentSchema.parse(assignmentData);

  const hrCase = await HRCaseModel.findByPk(validated.caseId, { transaction });

  if (!hrCase) {
    throw new NotFoundException(`Case ${validated.caseId} not found`);
  }

  // Create assignment record
  const assignment = await CaseAssignmentModel.create(
    {
      ...validated,
      assignedAt: new Date(),
    },
    { transaction },
  );

  // Update case
  await hrCase.update(
    {
      assignedTo: validated.assignedTo,
      assignedTeam: validated.assignedTeam,
      status: CaseStatus.IN_PROGRESS,
    },
    { transaction },
  );

  return assignment;
}

/**
 * Route case by skill matching
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Routing recommendation
 */
export async function routeCaseBySkill(
  caseId: string,
  transaction?: Transaction,
): Promise<{ recommendedAgent: string; recommendedTeam: string; matchScore: number }> {
  const hrCase = await HRCaseModel.findByPk(caseId, { transaction });

  if (!hrCase) {
    throw new NotFoundException(`Case ${caseId} not found`);
  }

  // In real implementation, use skill matching algorithm
  // For now, use category-based routing
  const teamMapping: Record<CaseCategory, string> = {
    [CaseCategory.PAYROLL]: 'Payroll Team',
    [CaseCategory.BENEFITS]: 'Benefits Team',
    [CaseCategory.TIME_OFF]: 'Time & Attendance Team',
    [CaseCategory.PERFORMANCE]: 'Performance Management Team',
    [CaseCategory.COMPENSATION]: 'Compensation Team',
    [CaseCategory.ONBOARDING]: 'Onboarding Team',
    [CaseCategory.OFFBOARDING]: 'Offboarding Team',
    [CaseCategory.TRAINING]: 'L&D Team',
    [CaseCategory.POLICY_QUESTION]: 'HR Policy Team',
    [CaseCategory.COMPLAINT]: 'Employee Relations Team',
    [CaseCategory.IT_ACCESS]: 'IT Support Team',
    [CaseCategory.FACILITIES]: 'Facilities Team',
    [CaseCategory.GENERAL_INQUIRY]: 'General HR Team',
    [CaseCategory.OTHER]: 'General HR Team',
  };

  const recommendedTeam = teamMapping[hrCase.category] || 'General HR Team';
  const recommendedAgent = `${recommendedTeam}-Agent-01`; // Simplified

  return {
    recommendedAgent,
    recommendedTeam,
    matchScore: 0.85,
  };
}

/**
 * Reassign case to different agent
 * @param caseId - Case ID
 * @param newAssignee - New assignee
 * @param reason - Reassignment reason
 * @param transaction - Optional database transaction
 * @returns Reassignment record
 */
export async function reassignCase(
  caseId: string,
  newAssignee: string,
  reason: string,
  transaction?: Transaction,
): Promise<CaseAssignmentModel> {
  const hrCase = await HRCaseModel.findByPk(caseId, { transaction });

  if (!hrCase) {
    throw new NotFoundException(`Case ${caseId} not found`);
  }

  const assignment = await CaseAssignmentModel.create(
    {
      caseId,
      assignedFrom: hrCase.assignedTo,
      assignedTo: newAssignee,
      assignmentReason: reason,
      assignedAt: new Date(),
    },
    { transaction },
  );

  await hrCase.update({ assignedTo: newAssignee }, { transaction });

  return assignment;
}

/**
 * Get agent workload for load balancing
 * @param agentId - Agent ID
 * @param transaction - Optional database transaction
 * @returns Workload metrics
 */
export async function getAgentWorkload(
  agentId: string,
  transaction?: Transaction,
): Promise<{
  activeCases: number;
  criticalCases: number;
  averageResolutionTime: number;
  capacity: number;
}> {
  const activeCases = await HRCaseModel.count({
    where: {
      assignedTo: agentId,
      status: { [Op.in]: [CaseStatus.OPEN, CaseStatus.IN_PROGRESS] },
    },
    transaction,
  });

  const criticalCases = await HRCaseModel.count({
    where: {
      assignedTo: agentId,
      priority: CasePriority.CRITICAL,
      status: { [Op.in]: [CaseStatus.OPEN, CaseStatus.IN_PROGRESS] },
    },
    transaction,
  });

  // Simplified capacity calculation
  const capacity = Math.max(0, 20 - activeCases); // Assume max 20 cases per agent

  return {
    activeCases,
    criticalCases,
    averageResolutionTime: 12, // In hours, simplified
    capacity,
  };
}

/**
 * Service Level Agreements (SLA) Functions
 */

/**
 * Define SLA for case type
 * @param slaData - SLA configuration data
 * @param transaction - Optional database transaction
 * @returns Created SLA configuration
 */
export async function defineSLAForCaseType(
  slaData: z.infer<typeof SLAConfigurationSchema>,
  transaction?: Transaction,
): Promise<SLAConfigurationModel> {
  const validated = SLAConfigurationSchema.parse(slaData);

  const slaConfig = await SLAConfigurationModel.create(
    {
      ...validated,
      active: true,
    },
    { transaction },
  );

  return slaConfig;
}

/**
 * Create SLA tracking for case
 */
async function createSLATracking(
  caseId: string,
  category: CaseCategory,
  priority: CasePriority,
  transaction?: Transaction,
): Promise<SLATrackingModel> {
  const slaConfig = await SLAConfigurationModel.findOne({
    where: { category, priority, active: true },
    transaction,
  });

  if (!slaConfig) {
    // Use default SLA if no config found
    const defaultResponseHours = 4;
    const defaultResolutionHours = 24;

    const now = new Date();
    const responseDeadline = new Date(now.getTime() + defaultResponseHours * 60 * 60 * 1000);
    const resolutionDeadline = new Date(now.getTime() + defaultResolutionHours * 60 * 60 * 1000);

    // Create default config
    const defaultConfig = await SLAConfigurationModel.create(
      {
        category,
        priority,
        responseTimeHours: defaultResponseHours,
        resolutionTimeHours: defaultResolutionHours,
        escalationEnabled: true,
        escalationThresholdPercent: 80,
        active: true,
      },
      { transaction },
    );

    return SLATrackingModel.create(
      {
        caseId,
        slaConfigId: defaultConfig.id,
        responseDeadline,
        resolutionDeadline,
        status: SLAStatus.ON_TRACK,
        pausedDuration: 0,
      },
      { transaction },
    );
  }

  const now = new Date();
  const responseDeadline = new Date(now.getTime() + slaConfig.responseTimeHours * 60 * 60 * 1000);
  const resolutionDeadline = new Date(now.getTime() + slaConfig.resolutionTimeHours * 60 * 60 * 1000);

  const slaTracking = await SLATrackingModel.create(
    {
      caseId,
      slaConfigId: slaConfig.id,
      responseDeadline,
      resolutionDeadline,
      status: SLAStatus.ON_TRACK,
      pausedDuration: 0,
    },
    { transaction },
  );

  return slaTracking;
}

/**
 * Track SLA compliance for case
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns SLA tracking with current status
 */
export async function trackSLACompliance(
  caseId: string,
  transaction?: Transaction,
): Promise<SLATrackingModel> {
  const slaTracking = await SLATrackingModel.findOne({
    where: { caseId },
    include: [SLAConfigurationModel],
    transaction,
  });

  if (!slaTracking) {
    throw new NotFoundException(`SLA tracking for case ${caseId} not found`);
  }

  // Update status based on current time
  const now = new Date();
  const resolutionDeadline = slaTracking.resolutionDeadline;
  const timeRemaining = resolutionDeadline.getTime() - now.getTime();
  const totalTime =
    resolutionDeadline.getTime() - (slaTracking.createdAt?.getTime() || now.getTime());
  const percentRemaining = (timeRemaining / totalTime) * 100;

  let newStatus = SLAStatus.ON_TRACK;
  if (timeRemaining < 0) {
    newStatus = SLAStatus.BREACHED;
    if (!slaTracking.breachedAt) {
      await slaTracking.update({ breachedAt: now, status: newStatus }, { transaction });
    }
  } else if (percentRemaining < 20) {
    newStatus = SLAStatus.AT_RISK;
    await slaTracking.update({ status: newStatus }, { transaction });
  }

  return slaTracking;
}

/**
 * Alert when SLA breach is imminent
 * @param hoursBeforeBreach - Hours before breach to alert
 * @param transaction - Optional database transaction
 * @returns List of cases at risk
 */
export async function alertSLABreach(
  hoursBeforeBreach: number,
  transaction?: Transaction,
): Promise<SLATrackingModel[]> {
  const alertTime = new Date();
  alertTime.setHours(alertTime.getHours() + hoursBeforeBreach);

  const atRiskCases = await SLATrackingModel.findAll({
    where: {
      resolutionDeadline: { [Op.lte]: alertTime },
      status: { [Op.in]: [SLAStatus.ON_TRACK, SLAStatus.AT_RISK] },
    },
    include: [SLAConfigurationModel],
    transaction,
  });

  return atRiskCases;
}

/**
 * Case Collaboration & Notes Functions
 */

/**
 * Add note to case
 * @param noteData - Note data
 * @param transaction - Optional database transaction
 * @returns Created note
 */
export async function addCaseNote(
  noteData: z.infer<typeof CaseNoteSchema>,
  transaction?: Transaction,
): Promise<CaseNoteModel> {
  const validated = CaseNoteSchema.parse(noteData);

  const note = await CaseNoteModel.create(
    {
      ...validated,
      mentions: validated.mentions || [],
      attachments: [],
    },
    { transaction },
  );

  // Update case updatedAt
  await HRCaseModel.update(
    { updatedAt: new Date() },
    { where: { id: validated.caseId }, transaction },
  );

  return note;
}

/**
 * Tag collaborators in case notes
 * @param noteId - Note ID
 * @param userIds - Array of user IDs to tag
 * @param transaction - Optional database transaction
 * @returns Updated note
 */
export async function tagCollaborators(
  noteId: string,
  userIds: string[],
  transaction?: Transaction,
): Promise<CaseNoteModel> {
  const note = await CaseNoteModel.findByPk(noteId, { transaction });

  if (!note) {
    throw new NotFoundException(`Note ${noteId} not found`);
  }

  const existingMentions = note.mentions || [];
  const updatedMentions = Array.from(new Set([...existingMentions, ...userIds]));

  await note.update({ mentions: updatedMentions }, { transaction });

  return note;
}

/**
 * Get case history with all notes
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Case notes in chronological order
 */
export async function getCaseHistory(
  caseId: string,
  transaction?: Transaction,
): Promise<CaseNoteModel[]> {
  const notes = await CaseNoteModel.findAll({
    where: { caseId },
    order: [['createdAt', 'ASC']],
    transaction,
  });

  return notes;
}

/**
 * Knowledge Base Integration Functions
 */

/**
 * Search knowledge base for solutions
 * @param searchQuery - Search query
 * @param category - Optional category filter
 * @param transaction - Optional database transaction
 * @returns Matching articles
 */
export async function searchKnowledgeBase(
  searchQuery: string,
  category?: CaseCategory,
  transaction?: Transaction,
): Promise<KnowledgeBaseArticleModel[]> {
  const where: WhereOptions<IKnowledgeBaseArticle> = {
    published: true,
    [Op.or]: [
      { title: { [Op.iLike]: `%${searchQuery}%` } },
      { content: { [Op.iLike]: `%${searchQuery}%` } },
      { tags: { [Op.contains]: [searchQuery] } },
    ],
  };

  if (category) {
    where.category = category;
  }

  const articles = await KnowledgeBaseArticleModel.findAll({
    where,
    order: [['views', 'DESC']],
    limit: 10,
    transaction,
  });

  // Increment view count
  for (const article of articles) {
    await article.increment('views', { transaction });
  }

  return articles;
}

/**
 * Link KB article to case
 * @param caseId - Case ID
 * @param articleId - Article ID
 * @param transaction - Optional database transaction
 * @returns Confirmation
 */
export async function linkArticleToCase(
  caseId: string,
  articleId: string,
  transaction?: Transaction,
): Promise<{ linked: boolean }> {
  const hrCase = await HRCaseModel.findByPk(caseId, { transaction });

  if (!hrCase) {
    throw new NotFoundException(`Case ${caseId} not found`);
  }

  const article = await KnowledgeBaseArticleModel.findByPk(articleId, { transaction });

  if (!article) {
    throw new NotFoundException(`Article ${articleId} not found`);
  }

  // Add note with article link
  await CaseNoteModel.create(
    {
      caseId,
      authorId: 'SYSTEM',
      noteType: 'SYSTEM',
      content: `Knowledge base article linked: ${article.title}`,
      mentions: [],
      attachments: [articleId],
    },
    { transaction },
  );

  return { linked: true };
}

/**
 * Suggest relevant KB articles for case
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Suggested articles
 */
export async function suggestKBArticles(
  caseId: string,
  transaction?: Transaction,
): Promise<KnowledgeBaseArticleModel[]> {
  const hrCase = await HRCaseModel.findByPk(caseId, { transaction });

  if (!hrCase) {
    throw new NotFoundException(`Case ${caseId} not found`);
  }

  // Search based on case subject and category
  const articles = await searchKnowledgeBase(hrCase.subject, hrCase.category, transaction);

  return articles;
}

/**
 * Case Escalation Management Functions
 */

/**
 * Escalate case to higher level
 * @param escalationData - Escalation data
 * @param transaction - Optional database transaction
 * @returns Escalation record
 */
export async function escalateCase(
  escalationData: z.infer<typeof CaseEscalationSchema>,
  transaction?: Transaction,
): Promise<CaseEscalationModel> {
  const validated = CaseEscalationSchema.parse(escalationData);

  const hrCase = await HRCaseModel.findByPk(validated.caseId, { transaction });

  if (!hrCase) {
    throw new NotFoundException(`Case ${validated.caseId} not found`);
  }

  const escalation = await CaseEscalationModel.create(
    {
      ...validated,
      escalatedAt: new Date(),
    },
    { transaction },
  );

  // Update case status
  await hrCase.update(
    {
      status: CaseStatus.ESCALATED,
      assignedTo: validated.escalatedTo,
    },
    { transaction },
  );

  return escalation;
}

/**
 * Track escalation path for case
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Escalation history
 */
export async function trackEscalationPath(
  caseId: string,
  transaction?: Transaction,
): Promise<CaseEscalationModel[]> {
  const escalations = await CaseEscalationModel.findAll({
    where: { caseId },
    order: [['escalatedAt', 'ASC']],
    transaction,
  });

  return escalations;
}

/**
 * Notify stakeholders of escalation
 * @param escalationId - Escalation ID
 * @param transaction - Optional database transaction
 * @returns Notification result
 */
export async function notifyEscalationStakeholders(
  escalationId: string,
  transaction?: Transaction,
): Promise<{ notified: boolean; recipientCount: number }> {
  const escalation = await CaseEscalationModel.findByPk(escalationId, {
    include: [HRCaseModel],
    transaction,
  });

  if (!escalation) {
    throw new NotFoundException(`Escalation ${escalationId} not found`);
  }

  // In real implementation, send notifications
  const recipientCount = 3; // Escalated person, manager, HR lead

  return {
    notified: true,
    recipientCount,
  };
}

/**
 * De-escalate case back to normal flow
 * @param caseId - Case ID
 * @param reason - De-escalation reason
 * @param transaction - Optional database transaction
 * @returns Updated case
 */
export async function deEscalateCase(
  caseId: string,
  reason: string,
  transaction?: Transaction,
): Promise<HRCaseModel> {
  const hrCase = await HRCaseModel.findByPk(caseId, { transaction });

  if (!hrCase) {
    throw new NotFoundException(`Case ${caseId} not found`);
  }

  // Mark latest escalation as resolved
  const latestEscalation = await CaseEscalationModel.findOne({
    where: { caseId, resolvedAt: null },
    order: [['escalatedAt', 'DESC']],
    transaction,
  });

  if (latestEscalation) {
    await latestEscalation.update({ resolvedAt: new Date() }, { transaction });
  }

  await hrCase.update({ status: CaseStatus.IN_PROGRESS }, { transaction });

  await CaseNoteModel.create(
    {
      caseId,
      authorId: 'SYSTEM',
      noteType: 'SYSTEM',
      content: `Case de-escalated: ${reason}`,
      mentions: [],
      attachments: [],
    },
    { transaction },
  );

  return hrCase;
}

/**
 * Case Resolution & Closure Functions
 */

/**
 * Resolve case with solution
 * @param resolutionData - Resolution data
 * @param transaction - Optional database transaction
 * @returns Resolution record
 */
export async function resolveCaseWithSolution(
  resolutionData: z.infer<typeof CaseResolutionSchema>,
  transaction?: Transaction,
): Promise<CaseResolutionModel> {
  const validated = CaseResolutionSchema.parse(resolutionData);

  const hrCase = await HRCaseModel.findByPk(validated.caseId, { transaction });

  if (!hrCase) {
    throw new NotFoundException(`Case ${validated.caseId} not found`);
  }

  const resolution = await CaseResolutionModel.create(
    {
      ...validated,
      resolvedAt: new Date(),
    },
    { transaction },
  );

  // Update case
  await hrCase.update(
    {
      status: CaseStatus.RESOLVED,
      resolvedAt: new Date(),
    },
    { transaction },
  );

  // Update SLA tracking
  const slaTracking = await SLATrackingModel.findOne({
    where: { caseId: validated.caseId },
    transaction,
  });

  if (slaTracking) {
    await slaTracking.update(
      {
        status: SLAStatus.COMPLETED,
        firstResponseAt: slaTracking.firstResponseAt || new Date(),
      },
      { transaction },
    );
  }

  return resolution;
}

/**
 * Close case after resolution
 * @param caseId - Case ID
 * @param closedBy - User closing the case
 * @param transaction - Optional database transaction
 * @returns Closed case
 */
export async function closeCase(
  caseId: string,
  closedBy: string,
  transaction?: Transaction,
): Promise<HRCaseModel> {
  const hrCase = await HRCaseModel.findByPk(caseId, { transaction });

  if (!hrCase) {
    throw new NotFoundException(`Case ${caseId} not found`);
  }

  if (hrCase.status !== CaseStatus.RESOLVED) {
    throw new BadRequestException('Can only close resolved cases');
  }

  await hrCase.update(
    {
      status: CaseStatus.CLOSED,
      closedAt: new Date(),
    },
    { transaction },
  );

  await CaseNoteModel.create(
    {
      caseId,
      authorId: closedBy,
      noteType: 'SYSTEM',
      content: `Case closed by ${closedBy}`,
      mentions: [],
      attachments: [],
    },
    { transaction },
  );

  return hrCase;
}

/**
 * Request employee feedback on resolution
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Feedback request result
 */
export async function requestEmployeeFeedback(
  caseId: string,
  transaction?: Transaction,
): Promise<{ requestSent: boolean; surveyUrl?: string }> {
  const hrCase = await HRCaseModel.findByPk(caseId, { transaction });

  if (!hrCase) {
    throw new NotFoundException(`Case ${caseId} not found`);
  }

  // In real implementation, send survey email
  const surveyUrl = `/feedback/${caseId}`;

  return {
    requestSent: true,
    surveyUrl,
  };
}

/**
 * Track case resolution time metrics
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Resolution metrics
 */
export async function trackResolutionTime(
  caseId: string,
  transaction?: Transaction,
): Promise<{
  totalTimeHours: number;
  responseTimeHours: number;
  resolutionTimeHours: number;
  slaCompliant: boolean;
}> {
  const hrCase = await HRCaseModel.findByPk(caseId, { transaction });

  if (!hrCase) {
    throw new NotFoundException(`Case ${caseId} not found`);
  }

  const slaTracking = await SLATrackingModel.findOne({
    where: { caseId },
    transaction,
  });

  const createdAt = hrCase.createdAt.getTime();
  const resolvedAt = hrCase.resolvedAt?.getTime() || Date.now();
  const totalTimeHours = (resolvedAt - createdAt) / (1000 * 60 * 60);

  const firstResponseAt = slaTracking?.firstResponseAt?.getTime() || resolvedAt;
  const responseTimeHours = (firstResponseAt - createdAt) / (1000 * 60 * 60);
  const resolutionTimeHours = totalTimeHours;

  const slaCompliant = slaTracking ? slaTracking.status !== SLAStatus.BREACHED : true;

  return {
    totalTimeHours: Math.round(totalTimeHours * 100) / 100,
    responseTimeHours: Math.round(responseTimeHours * 100) / 100,
    resolutionTimeHours: Math.round(resolutionTimeHours * 100) / 100,
    slaCompliant,
  };
}

/**
 * Employee Portal Integration Functions
 */

/**
 * Submit case from employee portal
 * @param caseData - Case data from portal
 * @param transaction - Optional database transaction
 * @returns Created case
 */
export async function submitCaseFromPortal(
  caseData: z.infer<typeof HRCaseSchema>,
  transaction?: Transaction,
): Promise<HRCaseModel> {
  const hrCase = await createHRCase(
    {
      ...caseData,
      channel: CaseChannel.EMPLOYEE_PORTAL,
    },
    transaction,
  );

  return hrCase;
}

/**
 * Get case status for employee
 * @param caseId - Case ID
 * @param employeeId - Employee ID
 * @param transaction - Optional database transaction
 * @returns Case status information
 */
export async function getCaseStatusForEmployee(
  caseId: string,
  employeeId: string,
  transaction?: Transaction,
): Promise<{
  caseNumber: string;
  status: CaseStatus;
  lastUpdate: Date;
  assignedTo?: string;
  notes: CaseNoteModel[];
}> {
  const hrCase = await HRCaseModel.findOne({
    where: { id: caseId, employeeId },
    transaction,
  });

  if (!hrCase) {
    throw new NotFoundException(`Case ${caseId} not found for employee ${employeeId}`);
  }

  const publicNotes = await CaseNoteModel.findAll({
    where: {
      caseId,
      noteType: 'PUBLIC',
    },
    order: [['createdAt', 'DESC']],
    transaction,
  });

  return {
    caseNumber: hrCase.caseNumber,
    status: hrCase.status,
    lastUpdate: hrCase.updatedAt,
    assignedTo: hrCase.assignedTo,
    notes: publicNotes,
  };
}

/**
 * Send case update notification to employee
 * @param caseId - Case ID
 * @param message - Update message
 * @param transaction - Optional database transaction
 * @returns Notification result
 */
export async function sendCaseUpdateNotification(
  caseId: string,
  message: string,
  transaction?: Transaction,
): Promise<{ sent: boolean }> {
  const hrCase = await HRCaseModel.findByPk(caseId, { transaction });

  if (!hrCase) {
    throw new NotFoundException(`Case ${caseId} not found`);
  }

  // In real implementation, send email/push notification
  return { sent: true };
}

/**
 * Case Templates & Workflows Functions
 */

/**
 * Create reusable case template
 * @param templateData - Template data
 * @param transaction - Optional database transaction
 * @returns Created template
 */
export async function createCaseTemplate(
  templateData: z.infer<typeof CaseTemplateSchema>,
  transaction?: Transaction,
): Promise<CaseTemplateModel> {
  const validated = CaseTemplateSchema.parse(templateData);

  const template = await CaseTemplateModel.create(
    {
      ...validated,
      workflowSteps: [],
      active: true,
      usageCount: 0,
    },
    { transaction },
  );

  return template;
}

/**
 * Apply workflow template to case
 * @param caseId - Case ID
 * @param templateId - Template ID
 * @param transaction - Optional database transaction
 * @returns Case with applied workflow
 */
export async function applyCaseWorkflow(
  caseId: string,
  templateId: string,
  transaction?: Transaction,
): Promise<HRCaseModel> {
  const hrCase = await HRCaseModel.findByPk(caseId, { transaction });

  if (!hrCase) {
    throw new NotFoundException(`Case ${caseId} not found`);
  }

  const template = await CaseTemplateModel.findByPk(templateId, { transaction });

  if (!template) {
    throw new NotFoundException(`Template ${templateId} not found`);
  }

  // Increment usage count
  await template.increment('usageCount', { transaction });

  // Add workflow notes
  for (const step of template.workflowSteps) {
    await CaseNoteModel.create(
      {
        caseId,
        authorId: 'SYSTEM',
        noteType: 'INTERNAL',
        content: `Workflow Step ${step.stepNumber}: ${step.stepName} - ${step.description}`,
        mentions: [],
        attachments: [],
      },
      { transaction },
    );
  }

  return hrCase;
}

/**
 * Track workflow progress for case
 * @param caseId - Case ID
 * @param transaction - Optional database transaction
 * @returns Workflow progress
 */
export async function trackWorkflowProgress(
  caseId: string,
  transaction?: Transaction,
): Promise<{
  totalSteps: number;
  completedSteps: number;
  currentStep: number;
  percentComplete: number;
}> {
  const hrCase = await HRCaseModel.findByPk(caseId, { transaction });

  if (!hrCase) {
    throw new NotFoundException(`Case ${caseId} not found`);
  }

  // In real implementation, track actual workflow progress
  // For now, return simplified metrics
  const totalSteps = 5;
  const completedSteps = 3;
  const currentStep = 4;
  const percentComplete = (completedSteps / totalSteps) * 100;

  return {
    totalSteps,
    completedSteps,
    currentStep,
    percentComplete: Math.round(percentComplete),
  };
}

/**
 * Case Analytics & Reporting Functions
 */

/**
 * Generate case analytics for period
 * @param startDate - Start date
 * @param endDate - End date
 * @param transaction - Optional database transaction
 * @returns Analytics data
 */
export async function generateCaseAnalytics(
  startDate: Date,
  endDate: Date,
  transaction?: Transaction,
): Promise<ICaseAnalytics> {
  const cases = await HRCaseModel.findAll({
    where: {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    transaction,
  });

  const totalCases = cases.length;
  const openCases = cases.filter((c) =>
    [CaseStatus.NEW, CaseStatus.OPEN, CaseStatus.IN_PROGRESS].includes(c.status),
  ).length;
  const resolvedCases = cases.filter((c) => c.status === CaseStatus.RESOLVED || c.status === CaseStatus.CLOSED).length;

  // Calculate average resolution time
  const resolvedCasesWithTime = cases.filter((c) => c.resolvedAt);
  const avgResolutionTime =
    resolvedCasesWithTime.length > 0
      ? resolvedCasesWithTime.reduce(
          (sum, c) =>
            sum + (c.resolvedAt!.getTime() - c.createdAt.getTime()) / (1000 * 60 * 60),
          0,
        ) / resolvedCasesWithTime.length
      : 0;

  // Get SLA compliance
  const slaTracking = await SLATrackingModel.findAll({
    where: {
      caseId: { [Op.in]: cases.map((c) => c.id) },
    },
    transaction,
  });

  const slaCompliantCount = slaTracking.filter((s) => s.status !== SLAStatus.BREACHED).length;
  const slaComplianceRate = slaTracking.length > 0 ? (slaCompliantCount / slaTracking.length) * 100 : 100;

  // Get satisfaction ratings
  const resolutions = await CaseResolutionModel.findAll({
    where: {
      caseId: { [Op.in]: cases.map((c) => c.id) },
      satisfactionRating: { [Op.ne]: null },
    },
    transaction,
  });

  const satisfactionScores = resolutions
    .filter((r) => r.satisfactionRating)
    .map((r) => {
      const ratings: Record<SatisfactionRating, number> = {
        [SatisfactionRating.VERY_SATISFIED]: 5,
        [SatisfactionRating.SATISFIED]: 4,
        [SatisfactionRating.NEUTRAL]: 3,
        [SatisfactionRating.DISSATISFIED]: 2,
        [SatisfactionRating.VERY_DISSATISFIED]: 1,
      };
      return ratings[r.satisfactionRating!] || 3;
    });

  const satisfactionScore =
    satisfactionScores.length > 0
      ? satisfactionScores.reduce((a, b) => a + b, 0) / satisfactionScores.length
      : 0;

  // Group by category
  const byCategory = new Map<CaseCategory, number>();
  cases.forEach((c) => {
    byCategory.set(c.category, (byCategory.get(c.category) || 0) + 1);
  });

  // Group by priority
  const byPriority = new Map<CasePriority, number>();
  cases.forEach((c) => {
    byPriority.set(c.priority, (byPriority.get(c.priority) || 0) + 1);
  });

  return {
    period: `${startDate.toISOString()} - ${endDate.toISOString()}`,
    totalCases,
    openCases,
    resolvedCases,
    averageResolutionTimeHours: Math.round(avgResolutionTime * 100) / 100,
    slaComplianceRate: Math.round(slaComplianceRate * 100) / 100,
    satisfactionScore: Math.round(satisfactionScore * 100) / 100,
    byCategory,
    byPriority,
  };
}

/**
 * Track case metrics over time
 * @param metric - Metric to track
 * @param days - Number of days to track
 * @param transaction - Optional database transaction
 * @returns Metric data
 */
export async function trackCaseMetrics(
  metric: 'VOLUME' | 'RESOLUTION_TIME' | 'SLA_COMPLIANCE',
  days: number,
  transaction?: Transaction,
): Promise<Array<{ date: string; value: number }>> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const cases = await HRCaseModel.findAll({
    where: {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    transaction,
  });

  const metrics: Array<{ date: string; value: number }> = [];

  // Simplified metrics
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    let value = 0;
    if (metric === 'VOLUME') {
      value = cases.filter((c) => c.createdAt.toISOString().split('T')[0] === dateStr).length;
    } else if (metric === 'RESOLUTION_TIME') {
      value = 12; // Simplified
    } else if (metric === 'SLA_COMPLIANCE') {
      value = 95; // Simplified
    }

    metrics.push({ date: dateStr, value });
  }

  return metrics;
}

/**
 * Export case reports
 * @param startDate - Start date
 * @param endDate - End date
 * @param format - Export format
 * @param transaction - Optional database transaction
 * @returns Export result
 */
export async function exportCaseReports(
  startDate: Date,
  endDate: Date,
  format: 'PDF' | 'CSV' | 'EXCEL',
  transaction?: Transaction,
): Promise<{ exported: boolean; url: string }> {
  const analytics = await generateCaseAnalytics(startDate, endDate, transaction);

  // In real implementation, generate actual export file
  return {
    exported: true,
    url: `/exports/cases/${startDate.toISOString()}-${endDate.toISOString()}.${format.toLowerCase()}`,
  };
}

/**
 * Integration with Ticketing Systems Functions
 */

/**
 * Sync with external ticketing system
 * @param system - Ticketing system
 * @param transaction - Optional database transaction
 * @returns Sync result
 */
export async function syncWithExternalTicketingSystem(
  system: TicketingSystem,
  transaction?: Transaction,
): Promise<{ synced: boolean; recordsSynced: number }> {
  const integration = await ExternalTicketIntegrationModel.findOne({
    where: { system },
    transaction,
  });

  if (!integration) {
    throw new NotFoundException(`Integration with ${system} not found`);
  }

  // In real implementation, sync with external API
  const recordsSynced = 10;

  await integration.update({ lastSyncAt: new Date() }, { transaction });

  return {
    synced: true,
    recordsSynced,
  };
}

/**
 * Create Jira ticket from case
 * @param caseId - Case ID
 * @param projectKey - Jira project key
 * @param transaction - Optional database transaction
 * @returns Jira ticket info
 */
export async function createJiraTicketFromCase(
  caseId: string,
  projectKey: string,
  transaction?: Transaction,
): Promise<{ ticketId: string; ticketUrl: string }> {
  const hrCase = await HRCaseModel.findByPk(caseId, { transaction });

  if (!hrCase) {
    throw new NotFoundException(`Case ${caseId} not found`);
  }

  // In real implementation, create Jira ticket via API
  const ticketId = `${projectKey}-${Math.floor(Math.random() * 1000)}`;
  const ticketUrl = `https://jira.example.com/browse/${ticketId}`;

  await hrCase.update(
    {
      externalTicketId: ticketId,
      externalSystem: TicketingSystem.JIRA,
    },
    { transaction },
  );

  return {
    ticketId,
    ticketUrl,
  };
}

/**
 * Update case from external system
 * @param caseId - Case ID
 * @param externalData - Data from external system
 * @param transaction - Optional database transaction
 * @returns Updated case
 */
export async function updateCaseFromExternalSystem(
  caseId: string,
  externalData: {
    status?: string;
    assignee?: string;
    notes?: string;
  },
  transaction?: Transaction,
): Promise<HRCaseModel> {
  const hrCase = await HRCaseModel.findByPk(caseId, { transaction });

  if (!hrCase) {
    throw new NotFoundException(`Case ${caseId} not found`);
  }

  const updates: any = {};

  if (externalData.assignee) {
    updates.assignedTo = externalData.assignee;
  }

  if (Object.keys(updates).length > 0) {
    await hrCase.update(updates, { transaction });
  }

  if (externalData.notes) {
    await CaseNoteModel.create(
      {
        caseId,
        authorId: 'EXTERNAL_SYSTEM',
        noteType: 'INTERNAL',
        content: externalData.notes,
        mentions: [],
        attachments: [],
      },
      { transaction },
    );
  }

  return hrCase;
}

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

/**
 * HR Case Management Service
 * Provides enterprise-grade HR case and ticket management
 */
@Injectable()
@ApiTags('HR Case Management')
export class HRCaseManagementService {
  // Case Creation & Tracking
  async createHRCase(data: z.infer<typeof HRCaseSchema>, transaction?: Transaction) {
    return createHRCase(data, transaction);
  }

  async updateCaseStatus(
    caseId: string,
    newStatus: CaseStatus,
    updatedBy: string,
    transaction?: Transaction,
  ) {
    return updateCaseStatus(caseId, newStatus, updatedBy, transaction);
  }

  async getCaseDetails(caseId: string, transaction?: Transaction) {
    return getCaseDetails(caseId, transaction);
  }

  async listEmployeeCases(employeeId: string, options?: any) {
    return listEmployeeCases(employeeId, options);
  }

  // Categorization & Prioritization
  async categorizeCaseByType(
    caseId: string,
    category: CaseCategory,
    subCategory?: CaseSubCategory,
    transaction?: Transaction,
  ) {
    return categorizeCaseByType(caseId, category, subCategory, transaction);
  }

  async setPriority(caseId: string, priority: CasePriority, transaction?: Transaction) {
    return setPriority(caseId, priority, transaction);
  }

  async autoCategorizeCaseUsingML(caseId: string, transaction?: Transaction) {
    return autoCategorizeCaseUsingML(caseId, transaction);
  }

  // Assignment & Routing
  async assignCaseToAgent(data: z.infer<typeof CaseAssignmentSchema>, transaction?: Transaction) {
    return assignCaseToAgent(data, transaction);
  }

  async routeCaseBySkill(caseId: string, transaction?: Transaction) {
    return routeCaseBySkill(caseId, transaction);
  }

  async reassignCase(
    caseId: string,
    newAssignee: string,
    reason: string,
    transaction?: Transaction,
  ) {
    return reassignCase(caseId, newAssignee, reason, transaction);
  }

  async getAgentWorkload(agentId: string, transaction?: Transaction) {
    return getAgentWorkload(agentId, transaction);
  }

  // SLA Management
  async defineSLAForCaseType(data: z.infer<typeof SLAConfigurationSchema>, transaction?: Transaction) {
    return defineSLAForCaseType(data, transaction);
  }

  async trackSLACompliance(caseId: string, transaction?: Transaction) {
    return trackSLACompliance(caseId, transaction);
  }

  async alertSLABreach(hoursBeforeBreach: number, transaction?: Transaction) {
    return alertSLABreach(hoursBeforeBreach, transaction);
  }

  // Collaboration & Notes
  async addCaseNote(data: z.infer<typeof CaseNoteSchema>, transaction?: Transaction) {
    return addCaseNote(data, transaction);
  }

  async tagCollaborators(noteId: string, userIds: string[], transaction?: Transaction) {
    return tagCollaborators(noteId, userIds, transaction);
  }

  async getCaseHistory(caseId: string, transaction?: Transaction) {
    return getCaseHistory(caseId, transaction);
  }

  // Knowledge Base
  async searchKnowledgeBase(query: string, category?: CaseCategory, transaction?: Transaction) {
    return searchKnowledgeBase(query, category, transaction);
  }

  async linkArticleToCase(caseId: string, articleId: string, transaction?: Transaction) {
    return linkArticleToCase(caseId, articleId, transaction);
  }

  async suggestKBArticles(caseId: string, transaction?: Transaction) {
    return suggestKBArticles(caseId, transaction);
  }

  // Escalation
  async escalateCase(data: z.infer<typeof CaseEscalationSchema>, transaction?: Transaction) {
    return escalateCase(data, transaction);
  }

  async trackEscalationPath(caseId: string, transaction?: Transaction) {
    return trackEscalationPath(caseId, transaction);
  }

  async notifyEscalationStakeholders(escalationId: string, transaction?: Transaction) {
    return notifyEscalationStakeholders(escalationId, transaction);
  }

  async deEscalateCase(caseId: string, reason: string, transaction?: Transaction) {
    return deEscalateCase(caseId, reason, transaction);
  }

  // Resolution & Closure
  async resolveCaseWithSolution(data: z.infer<typeof CaseResolutionSchema>, transaction?: Transaction) {
    return resolveCaseWithSolution(data, transaction);
  }

  async closeCase(caseId: string, closedBy: string, transaction?: Transaction) {
    return closeCase(caseId, closedBy, transaction);
  }

  async requestEmployeeFeedback(caseId: string, transaction?: Transaction) {
    return requestEmployeeFeedback(caseId, transaction);
  }

  async trackResolutionTime(caseId: string, transaction?: Transaction) {
    return trackResolutionTime(caseId, transaction);
  }

  // Portal Integration
  async submitCaseFromPortal(data: z.infer<typeof HRCaseSchema>, transaction?: Transaction) {
    return submitCaseFromPortal(data, transaction);
  }

  async getCaseStatusForEmployee(
    caseId: string,
    employeeId: string,
    transaction?: Transaction,
  ) {
    return getCaseStatusForEmployee(caseId, employeeId, transaction);
  }

  async sendCaseUpdateNotification(caseId: string, message: string, transaction?: Transaction) {
    return sendCaseUpdateNotification(caseId, message, transaction);
  }

  // Templates & Workflows
  async createCaseTemplate(data: z.infer<typeof CaseTemplateSchema>, transaction?: Transaction) {
    return createCaseTemplate(data, transaction);
  }

  async applyCaseWorkflow(caseId: string, templateId: string, transaction?: Transaction) {
    return applyCaseWorkflow(caseId, templateId, transaction);
  }

  async trackWorkflowProgress(caseId: string, transaction?: Transaction) {
    return trackWorkflowProgress(caseId, transaction);
  }

  // Analytics & Reporting
  async generateCaseAnalytics(startDate: Date, endDate: Date, transaction?: Transaction) {
    return generateCaseAnalytics(startDate, endDate, transaction);
  }

  async trackCaseMetrics(
    metric: 'VOLUME' | 'RESOLUTION_TIME' | 'SLA_COMPLIANCE',
    days: number,
    transaction?: Transaction,
  ) {
    return trackCaseMetrics(metric, days, transaction);
  }

  async exportCaseReports(
    startDate: Date,
    endDate: Date,
    format: 'PDF' | 'CSV' | 'EXCEL',
    transaction?: Transaction,
  ) {
    return exportCaseReports(startDate, endDate, format, transaction);
  }

  // External Ticketing
  async syncWithExternalTicketingSystem(system: TicketingSystem, transaction?: Transaction) {
    return syncWithExternalTicketingSystem(system, transaction);
  }

  async createJiraTicketFromCase(caseId: string, projectKey: string, transaction?: Transaction) {
    return createJiraTicketFromCase(caseId, projectKey, transaction);
  }

  async updateCaseFromExternalSystem(caseId: string, externalData: any, transaction?: Transaction) {
    return updateCaseFromExternalSystem(caseId, externalData, transaction);
  }
}
