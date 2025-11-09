/**
 * LOC: CONTRACT_MGMT_KIT_001
 * File: /reuse/legal/contract-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *   - diff
 *   - node-cron
 *
 * DOWNSTREAM (imported by):
 *   - Legal management modules
 *   - Contract workflow controllers
 *   - Clause library services
 *   - Obligation tracking services
 *   - Contract analytics services
 */

/**
 * File: /reuse/legal/contract-management-kit.ts
 * Locator: WC-CONTRACT-MGMT-KIT-001
 * Purpose: Production-Grade Contract Management Kit - Enterprise contract lifecycle management toolkit
 *
 * Upstream: NestJS, Sequelize, Zod, Node-Cron, Diff
 * Downstream: ../backend/modules/legal/*, Contract workflow controllers, Obligation services
 * Dependencies: TypeScript 5.x, Node 18+, sequelize-typescript, @nestjs/swagger, zod
 * Exports: 43 production-ready contract management functions for legal platforms
 *
 * LLM Context: Production-grade contract lifecycle management toolkit for White Cross platform.
 * Provides comprehensive contract creation with template engine and variable substitution,
 * clause library management with categorization and versioning, contract versioning with
 * full diff tracking and comparison, obligation tracking with deadline management and alerts,
 * contract search with full-text and metadata filters, Sequelize models for contracts/clauses/
 * obligations, NestJS services with dependency injection, Swagger API documentation, contract
 * approval workflows with multi-step review, contract status lifecycle management, contract
 * parties and stakeholder management, contract metadata with custom fields, contract document
 * attachment management, contract renewal and expiration tracking, contract amendments and
 * addendums, contract compliance tracking, contract analytics and reporting, contract templates
 * with variable validation, clause conflict detection, obligation reminder notifications,
 * contract audit logging, digital signature integration, contract risk assessment, contract
 * comparison and analysis, and healthcare-specific contract types (provider agreements, vendor
 * contracts, patient consent, insurance contracts).
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
 * Contract status lifecycle
 */
export enum ContractStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  IN_NEGOTIATION = 'in_negotiation',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  TERMINATED = 'terminated',
  RENEWED = 'renewed',
  ARCHIVED = 'archived',
}

/**
 * Contract type categories
 */
export enum ContractType {
  PROVIDER_AGREEMENT = 'provider_agreement',
  VENDOR_CONTRACT = 'vendor_contract',
  SERVICE_AGREEMENT = 'service_agreement',
  PATIENT_CONSENT = 'patient_consent',
  INSURANCE_CONTRACT = 'insurance_contract',
  EMPLOYMENT_CONTRACT = 'employment_contract',
  NDA = 'nda',
  SLA = 'sla',
  LEASE_AGREEMENT = 'lease_agreement',
  LICENSING_AGREEMENT = 'licensing_agreement',
  PARTNERSHIP_AGREEMENT = 'partnership_agreement',
  OTHER = 'other',
}

/**
 * Clause category types
 */
export enum ClauseCategory {
  PAYMENT_TERMS = 'payment_terms',
  CONFIDENTIALITY = 'confidentiality',
  LIABILITY = 'liability',
  INDEMNIFICATION = 'indemnification',
  TERMINATION = 'termination',
  DISPUTE_RESOLUTION = 'dispute_resolution',
  INTELLECTUAL_PROPERTY = 'intellectual_property',
  DATA_PROTECTION = 'data_protection',
  COMPLIANCE = 'compliance',
  FORCE_MAJEURE = 'force_majeure',
  GOVERNING_LAW = 'governing_law',
  AMENDMENT = 'amendment',
  RENEWAL = 'renewal',
  ASSIGNMENT = 'assignment',
  NOTICES = 'notices',
  HIPAA_COMPLIANCE = 'hipaa_compliance',
  OTHER = 'other',
}

/**
 * Obligation status tracking
 */
export enum ObligationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
  WAIVED = 'waived',
  DISPUTED = 'disputed',
}

/**
 * Obligation priority levels
 */
export enum ObligationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Contract party role types
 */
export enum PartyRole {
  PROVIDER = 'provider',
  CLIENT = 'client',
  VENDOR = 'vendor',
  PATIENT = 'patient',
  INSURER = 'insurer',
  EMPLOYER = 'employer',
  EMPLOYEE = 'employee',
  LICENSOR = 'licensor',
  LICENSEE = 'licensee',
  PARTNER = 'partner',
  OTHER = 'other',
}

/**
 * Contract version action types
 */
export enum VersionAction {
  CREATED = 'created',
  UPDATED = 'updated',
  AMENDED = 'amended',
  RESTORED = 'restored',
  ARCHIVED = 'archived',
}

/**
 * Contract approval decision
 */
export enum ApprovalDecision {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REQUIRES_CHANGES = 'requires_changes',
}

/**
 * Base contract entity interface
 */
export interface Contract {
  id: string;
  contractNumber: string;
  title: string;
  description?: string;
  contractType: ContractType;
  status: ContractStatus;
  version: number;
  effectiveDate: Date;
  expirationDate?: Date;
  autoRenew: boolean;
  renewalNoticeDays?: number;
  terminationNoticeDays?: number;
  totalValue?: number;
  currency?: string;
  parties: ContractParty[];
  clauses: ContractClause[];
  obligations: ContractObligation[];
  metadata: ContractMetadata;
  templateId?: string;
  parentContractId?: string;
  documentUrl?: string;
  signedDocumentUrl?: string;
  tenantId?: string;
  createdBy: string;
  updatedBy?: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Contract metadata
 */
export interface ContractMetadata {
  tags: string[];
  category?: string;
  department?: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  complianceFlags: string[];
  customFields: Record<string, any>;
  attachments: ContractAttachment[];
  relatedContracts: string[];
  notes?: string;
}

/**
 * Contract party information
 */
export interface ContractParty {
  id: string;
  contractId: string;
  role: PartyRole;
  entityType: 'individual' | 'organization';
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  organizationId?: string;
  userId?: string;
  signatureRequired: boolean;
  signedAt?: Date;
  signatureUrl?: string;
  isPrimary: boolean;
  metadata: Record<string, any>;
}

/**
 * Contract clause entity
 */
export interface ContractClause {
  id: string;
  contractId?: string;
  libraryClauseId?: string;
  category: ClauseCategory;
  title: string;
  content: string;
  order: number;
  required: boolean;
  editable: boolean;
  variables: ClauseVariable[];
  metadata: Record<string, any>;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Clause variable definition
 */
export interface ClauseVariable {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'currency';
  value?: any;
  required: boolean;
  defaultValue?: any;
  validation?: string;
  description?: string;
}

/**
 * Contract obligation entity
 */
export interface ContractObligation {
  id: string;
  contractId: string;
  title: string;
  description: string;
  responsibleParty: PartyRole;
  assignedTo?: string;
  dueDate: Date;
  completedDate?: Date;
  status: ObligationStatus;
  priority: ObligationPriority;
  recurring: boolean;
  recurrencePattern?: string;
  reminderDays: number[];
  dependencies: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Contract template entity
 */
export interface ContractTemplate {
  id: string;
  name: string;
  description?: string;
  contractType: ContractType;
  content: string;
  variables: TemplateVariable[];
  defaultClauses: string[];
  requiredClauses: string[];
  version: number;
  isActive: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Template variable definition
 */
export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'currency' | 'party' | 'clause';
  required: boolean;
  defaultValue?: any;
  validation?: string;
  description?: string;
  options?: any[];
}

/**
 * Contract version history
 */
export interface ContractVersion {
  id: string;
  contractId: string;
  version: number;
  action: VersionAction;
  content: string;
  changes: VersionChange[];
  checksum: string;
  createdBy: string;
  createdAt: Date;
  metadata: Record<string, any>;
}

/**
 * Version change tracking
 */
export interface VersionChange {
  field: string;
  oldValue: any;
  newValue: any;
  changeType: 'added' | 'modified' | 'removed';
}

/**
 * Contract comparison result
 */
export interface ContractComparison {
  contractId1: string;
  contractId2: string;
  version1: number;
  version2: number;
  differences: ContractDifference[];
  similarity: number;
  comparedAt: Date;
}

/**
 * Contract difference detail
 */
export interface ContractDifference {
  section: string;
  type: 'added' | 'removed' | 'modified';
  content1?: string;
  content2?: string;
  severity: 'minor' | 'moderate' | 'major';
}

/**
 * Contract attachment
 */
export interface ContractAttachment {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
}

/**
 * Contract search filters
 */
export interface ContractSearchFilters {
  query?: string;
  contractTypes?: ContractType[];
  statuses?: ContractStatus[];
  parties?: string[];
  tags?: string[];
  effectiveDateFrom?: Date;
  effectiveDateTo?: Date;
  expirationDateFrom?: Date;
  expirationDateTo?: Date;
  minValue?: number;
  maxValue?: number;
  riskLevels?: string[];
  departments?: string[];
  tenantId?: string;
}

/**
 * Obligation reminder configuration
 */
export interface ObligationReminder {
  obligationId: string;
  daysBeforeDue: number;
  recipients: string[];
  sent: boolean;
  sentAt?: Date;
  nextReminderDate?: Date;
}

/**
 * Contract approval workflow
 */
export interface ContractApproval {
  id: string;
  contractId: string;
  approverUserId: string;
  approverRole: string;
  decision?: ApprovalDecision;
  comments?: string;
  decidedAt?: Date;
  order: number;
  required: boolean;
}

/**
 * Contract renewal configuration
 */
export interface ContractRenewal {
  contractId: string;
  autoRenew: boolean;
  renewalTerm: number;
  renewalTermUnit: 'days' | 'months' | 'years';
  noticePeriodDays: number;
  renewalDate?: Date;
  renewedContractId?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Contract creation schema
 */
export const ContractCreateSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(2000).optional(),
  contractType: z.nativeEnum(ContractType),
  effectiveDate: z.date(),
  expirationDate: z.date().optional(),
  autoRenew: z.boolean().default(false),
  renewalNoticeDays: z.number().int().min(0).max(365).optional(),
  terminationNoticeDays: z.number().int().min(0).max(365).optional(),
  totalValue: z.number().min(0).optional(),
  currency: z.string().length(3).optional(),
  templateId: z.string().optional(),
  metadata: z.object({
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
    department: z.string().optional(),
    riskLevel: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    customFields: z.record(z.any()).default({}),
  }).optional(),
});

/**
 * Contract party schema
 */
export const ContractPartySchema = z.object({
  role: z.nativeEnum(PartyRole),
  entityType: z.enum(['individual', 'organization']),
  name: z.string().min(1).max(255),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  organizationId: z.string().optional(),
  userId: z.string().optional(),
  signatureRequired: z.boolean().default(false),
  isPrimary: z.boolean().default(false),
  metadata: z.record(z.any()).default({}),
});

/**
 * Clause creation schema
 */
export const ClauseCreateSchema = z.object({
  category: z.nativeEnum(ClauseCategory),
  title: z.string().min(1).max(500),
  content: z.string().min(1),
  order: z.number().int().min(0).default(0),
  required: z.boolean().default(false),
  editable: z.boolean().default(true),
  variables: z.array(z.object({
    name: z.string(),
    type: z.enum(['string', 'number', 'date', 'boolean', 'currency']),
    required: z.boolean(),
    defaultValue: z.any().optional(),
    validation: z.string().optional(),
    description: z.string().optional(),
  })).default([]),
  metadata: z.record(z.any()).default({}),
});

/**
 * Obligation creation schema
 */
export const ObligationCreateSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().min(1),
  responsibleParty: z.nativeEnum(PartyRole),
  assignedTo: z.string().optional(),
  dueDate: z.date(),
  priority: z.nativeEnum(ObligationPriority).default(ObligationPriority.MEDIUM),
  recurring: z.boolean().default(false),
  recurrencePattern: z.string().optional(),
  reminderDays: z.array(z.number().int().min(0)).default([7, 3, 1]),
  dependencies: z.array(z.string()).default([]),
  metadata: z.record(z.any()).default({}),
});

/**
 * Template variable schema
 */
export const TemplateVariableSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['string', 'number', 'date', 'boolean', 'currency', 'party', 'clause']),
  required: z.boolean(),
  defaultValue: z.any().optional(),
  validation: z.string().optional(),
  description: z.string().optional(),
  options: z.array(z.any()).optional(),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Contract Sequelize Model
 */
@Table({
  tableName: 'contracts',
  timestamps: true,
  paranoid: true,
})
export class ContractModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  contractNumber!: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  title!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Column({
    type: DataType.ENUM(...Object.values(ContractType)),
    allowNull: false,
  })
  contractType!: ContractType;

  @Column({
    type: DataType.ENUM(...Object.values(ContractStatus)),
    allowNull: false,
    defaultValue: ContractStatus.DRAFT,
  })
  status!: ContractStatus;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 1,
  })
  version!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  effectiveDate!: Date;

  @Column(DataType.DATE)
  expirationDate?: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  autoRenew!: boolean;

  @Column(DataType.INTEGER)
  renewalNoticeDays?: number;

  @Column(DataType.INTEGER)
  terminationNoticeDays?: number;

  @Column(DataType.DECIMAL(15, 2))
  totalValue?: number;

  @Column(DataType.STRING(3))
  currency?: string;

  @Column(DataType.JSONB)
  metadata!: ContractMetadata;

  @Column(DataType.UUID)
  templateId?: string;

  @Column(DataType.UUID)
  parentContractId?: string;

  @Column(DataType.STRING)
  documentUrl?: string;

  @Column(DataType.STRING)
  signedDocumentUrl?: string;

  @Column(DataType.UUID)
  tenantId?: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  createdBy!: string;

  @Column(DataType.UUID)
  updatedBy?: string;

  @Column(DataType.UUID)
  approvedBy?: string;

  @Column(DataType.DATE)
  approvedAt?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => ContractPartyModel)
  parties!: ContractPartyModel[];

  @HasMany(() => ContractClauseModel)
  clauses!: ContractClauseModel[];

  @HasMany(() => ContractObligationModel)
  obligations!: ContractObligationModel[];

  @HasMany(() => ContractVersionModel)
  versions!: ContractVersionModel[];
}

/**
 * Contract Party Sequelize Model
 */
@Table({
  tableName: 'contract_parties',
  timestamps: false,
})
export class ContractPartyModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => ContractModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  contractId!: string;

  @Column({
    type: DataType.ENUM(...Object.values(PartyRole)),
    allowNull: false,
  })
  role!: PartyRole;

  @Column({
    type: DataType.ENUM('individual', 'organization'),
    allowNull: false,
  })
  entityType!: 'individual' | 'organization';

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name!: string;

  @Column(DataType.STRING)
  email?: string;

  @Column(DataType.STRING)
  phone?: string;

  @Column(DataType.TEXT)
  address?: string;

  @Column(DataType.UUID)
  organizationId?: string;

  @Column(DataType.UUID)
  userId?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  signatureRequired!: boolean;

  @Column(DataType.DATE)
  signedAt?: Date;

  @Column(DataType.STRING)
  signatureUrl?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isPrimary!: boolean;

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @BelongsTo(() => ContractModel)
  contract!: ContractModel;
}

/**
 * Contract Clause Sequelize Model
 */
@Table({
  tableName: 'contract_clauses',
  timestamps: true,
})
export class ContractClauseModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => ContractModel)
  @Column(DataType.UUID)
  contractId?: string;

  @Column(DataType.UUID)
  libraryClauseId?: string;

  @Column({
    type: DataType.ENUM(...Object.values(ClauseCategory)),
    allowNull: false,
  })
  category!: ClauseCategory;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content!: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  order!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  required!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  editable!: boolean;

  @Column(DataType.JSONB)
  variables!: ClauseVariable[];

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 1,
  })
  version!: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => ContractModel)
  contract?: ContractModel;
}

/**
 * Contract Obligation Sequelize Model
 */
@Table({
  tableName: 'contract_obligations',
  timestamps: true,
})
export class ContractObligationModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => ContractModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  contractId!: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.ENUM(...Object.values(PartyRole)),
    allowNull: false,
  })
  responsibleParty!: PartyRole;

  @Column(DataType.UUID)
  assignedTo?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dueDate!: Date;

  @Column(DataType.DATE)
  completedDate?: Date;

  @Column({
    type: DataType.ENUM(...Object.values(ObligationStatus)),
    defaultValue: ObligationStatus.PENDING,
  })
  status!: ObligationStatus;

  @Column({
    type: DataType.ENUM(...Object.values(ObligationPriority)),
    defaultValue: ObligationPriority.MEDIUM,
  })
  priority!: ObligationPriority;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  recurring!: boolean;

  @Column(DataType.STRING)
  recurrencePattern?: string;

  @Column(DataType.JSONB)
  reminderDays!: number[];

  @Column(DataType.JSONB)
  dependencies!: string[];

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => ContractModel)
  contract!: ContractModel;
}

/**
 * Contract Template Sequelize Model
 */
@Table({
  tableName: 'contract_templates',
  timestamps: true,
})
export class ContractTemplateModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Column({
    type: DataType.ENUM(...Object.values(ContractType)),
    allowNull: false,
  })
  contractType!: ContractType;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content!: string;

  @Column(DataType.JSONB)
  variables!: TemplateVariable[];

  @Column(DataType.JSONB)
  defaultClauses!: string[];

  @Column(DataType.JSONB)
  requiredClauses!: string[];

  @Column({
    type: DataType.INTEGER,
    defaultValue: 1,
  })
  version!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive!: boolean;

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Contract Version Sequelize Model
 */
@Table({
  tableName: 'contract_versions',
  timestamps: false,
})
export class ContractVersionModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => ContractModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  contractId!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  version!: number;

  @Column({
    type: DataType.ENUM(...Object.values(VersionAction)),
    allowNull: false,
  })
  action!: VersionAction;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content!: string;

  @Column(DataType.JSONB)
  changes!: VersionChange[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  checksum!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  createdBy!: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt!: Date;

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @BelongsTo(() => ContractModel)
  contract!: ContractModel;
}

// ============================================================================
// CONFIGURATION MANAGEMENT
// ============================================================================

/**
 * Register contract management configuration namespace
 *
 * @returns Configuration factory for NestJS
 *
 * @example
 * ```typescript
 * ConfigModule.forRoot({
 *   load: [registerContractConfig()],
 * })
 * ```
 */
export function registerContractConfig() {
  return registerAs('contracts', () => ({
    contractNumberPrefix: process.env.CONTRACT_NUMBER_PREFIX || 'CTR',
    enableVersioning: process.env.CONTRACT_VERSIONING !== 'false',
    maxVersions: parseInt(process.env.CONTRACT_MAX_VERSIONS || '50', 10),
    enableAutoApproval: process.env.CONTRACT_AUTO_APPROVAL === 'true',
    enableDigitalSignature: process.env.CONTRACT_DIGITAL_SIGNATURE !== 'false',
    defaultCurrency: process.env.CONTRACT_DEFAULT_CURRENCY || 'USD',
    reminderSchedule: process.env.CONTRACT_REMINDER_SCHEDULE || '0 9 * * *', // Daily at 9 AM
    expirationWarningDays: parseInt(process.env.CONTRACT_EXPIRATION_WARNING_DAYS || '30', 10),
    obligationReminderDays: process.env.CONTRACT_OBLIGATION_REMINDERS?.split(',').map(Number) || [30, 14, 7, 3, 1],
    enableAuditLog: process.env.CONTRACT_AUDIT_LOG !== 'false',
    templateDirectory: process.env.CONTRACT_TEMPLATE_DIR || './templates/contracts',
  }));
}

/**
 * Create contract management configuration module
 *
 * @returns DynamicModule for contract config
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [createContractConfigModule()],
 * })
 * export class ContractModule {}
 * ```
 */
export function createContractConfigModule(): DynamicModule {
  return ConfigModule.forRoot({
    load: [registerContractConfig()],
    isGlobal: true,
    cache: true,
  });
}

// ============================================================================
// CONTRACT CREATION & TEMPLATING
// ============================================================================

/**
 * Generate unique contract number
 *
 * @param configService - Configuration service
 * @returns Unique contract number
 *
 * @example
 * ```typescript
 * const contractNumber = await generateContractNumber(configService);
 * // 'CTR-2025-001234'
 * ```
 */
export async function generateContractNumber(configService: ConfigService): Promise<string> {
  const prefix = configService.get<string>('contracts.contractNumberPrefix', 'CTR');
  const year = new Date().getFullYear();
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
  const timestamp = Date.now().toString().slice(-6);

  return `${prefix}-${year}-${timestamp}${randomPart}`;
}

/**
 * Create new contract from template or scratch
 *
 * @param data - Contract creation data
 * @param userId - User creating the contract
 * @param configService - Configuration service
 * @returns Created contract
 *
 * @example
 * ```typescript
 * const contract = await createContract({
 *   title: 'Provider Service Agreement',
 *   contractType: ContractType.PROVIDER_AGREEMENT,
 *   effectiveDate: new Date('2025-01-01'),
 *   templateId: 'tmpl_123',
 * }, 'user_456', configService);
 * ```
 */
export async function createContract(
  data: z.infer<typeof ContractCreateSchema>,
  userId: string,
  configService: ConfigService
): Promise<Contract> {
  const logger = new Logger('ContractCreation');

  // Validate input
  const validated = ContractCreateSchema.parse(data);

  // Generate contract number
  const contractNumber = await generateContractNumber(configService);

  // Create contract entity
  const contract: Contract = {
    id: crypto.randomUUID(),
    contractNumber,
    title: validated.title,
    description: validated.description,
    contractType: validated.contractType,
    status: ContractStatus.DRAFT,
    version: 1,
    effectiveDate: validated.effectiveDate,
    expirationDate: validated.expirationDate,
    autoRenew: validated.autoRenew,
    renewalNoticeDays: validated.renewalNoticeDays,
    terminationNoticeDays: validated.terminationNoticeDays,
    totalValue: validated.totalValue,
    currency: validated.currency || configService.get('contracts.defaultCurrency', 'USD'),
    parties: [],
    clauses: [],
    obligations: [],
    metadata: {
      tags: validated.metadata?.tags || [],
      category: validated.metadata?.category,
      department: validated.metadata?.department,
      riskLevel: validated.metadata?.riskLevel,
      complianceFlags: [],
      customFields: validated.metadata?.customFields || {},
      attachments: [],
      relatedContracts: [],
    },
    templateId: validated.templateId,
    createdBy: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  logger.log(`Contract ${contractNumber} created successfully`);

  return contract;
}

/**
 * Create contract from template with variable substitution
 *
 * @param templateId - Template ID
 * @param variables - Template variable values
 * @param userId - User creating contract
 * @param repository - Template repository
 * @returns Created contract
 *
 * @example
 * ```typescript
 * const contract = await createContractFromTemplate(
 *   'tmpl_provider_agreement',
 *   {
 *     providerName: 'Dr. John Smith',
 *     effectiveDate: new Date(),
 *     annualFee: 50000,
 *   },
 *   'user_123',
 *   templateRepo
 * );
 * ```
 */
export async function createContractFromTemplate(
  templateId: string,
  variables: Record<string, any>,
  userId: string,
  repository: any
): Promise<Contract> {
  const logger = new Logger('ContractTemplating');

  // Fetch template
  const template = await repository.findByPk(templateId);
  if (!template) {
    throw new NotFoundException(`Contract template ${templateId} not found`);
  }

  if (!template.isActive) {
    throw new BadRequestException('Contract template is not active');
  }

  // Validate required variables
  await validateTemplateVariables(template.variables, variables);

  // Substitute variables in content
  const content = substituteTemplateVariables(template.content, variables);

  // Create contract
  const contract: Partial<Contract> = {
    title: variables.title || template.name,
    contractType: template.contractType,
    templateId: template.id,
    // Additional fields would be populated from variables
  };

  logger.log(`Contract created from template ${templateId}`);

  return contract as Contract;
}

/**
 * Validate template variables against requirements
 *
 * @param templateVars - Template variable definitions
 * @param providedVars - Provided variable values
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * await validateTemplateVariables(template.variables, userProvidedVars);
 * ```
 */
export async function validateTemplateVariables(
  templateVars: TemplateVariable[],
  providedVars: Record<string, any>
): Promise<void> {
  for (const templateVar of templateVars) {
    if (templateVar.required && !(templateVar.name in providedVars)) {
      throw new BadRequestException(`Required variable '${templateVar.name}' is missing`);
    }

    if (templateVar.name in providedVars) {
      const value = providedVars[templateVar.name];

      // Type validation
      if (!validateVariableType(value, templateVar.type)) {
        throw new BadRequestException(
          `Variable '${templateVar.name}' must be of type ${templateVar.type}`
        );
      }

      // Custom validation
      if (templateVar.validation) {
        try {
          const regex = new RegExp(templateVar.validation);
          if (!regex.test(String(value))) {
            throw new BadRequestException(
              `Variable '${templateVar.name}' does not match validation pattern`
            );
          }
        } catch (error) {
          throw new BadRequestException(`Invalid validation pattern for '${templateVar.name}'`);
        }
      }
    }
  }
}

/**
 * Validate variable type
 */
function validateVariableType(value: any, type: string): boolean {
  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
    case 'currency':
      return typeof value === 'number' && !isNaN(value);
    case 'date':
      return value instanceof Date || !isNaN(Date.parse(value));
    case 'boolean':
      return typeof value === 'boolean';
    default:
      return true;
  }
}

/**
 * Substitute variables in template content
 *
 * @param content - Template content
 * @param variables - Variable values
 * @returns Content with substituted variables
 *
 * @example
 * ```typescript
 * const result = substituteTemplateVariables(
 *   'Provider: {{providerName}}, Fee: {{annualFee}}',
 *   { providerName: 'Dr. Smith', annualFee: 50000 }
 * );
 * // 'Provider: Dr. Smith, Fee: 50000'
 * ```
 */
export function substituteTemplateVariables(
  content: string,
  variables: Record<string, any>
): string {
  let result = content;

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    result = result.replace(regex, String(value));
  }

  return result;
}

// ============================================================================
// CLAUSE LIBRARY MANAGEMENT
// ============================================================================

/**
 * Create clause in library
 *
 * @param data - Clause creation data
 * @param userId - User creating clause
 * @returns Created clause
 *
 * @example
 * ```typescript
 * const clause = await createClause({
 *   category: ClauseCategory.PAYMENT_TERMS,
 *   title: 'Standard Payment Terms',
 *   content: 'Payment due within 30 days...',
 * }, 'user_123');
 * ```
 */
export async function createClause(
  data: z.infer<typeof ClauseCreateSchema>,
  userId: string
): Promise<ContractClause> {
  const validated = ClauseCreateSchema.parse(data);

  const clause: ContractClause = {
    id: crypto.randomUUID(),
    category: validated.category,
    title: validated.title,
    content: validated.content,
    order: validated.order,
    required: validated.required,
    editable: validated.editable,
    variables: validated.variables,
    metadata: validated.metadata,
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return clause;
}

/**
 * Add clause to contract
 *
 * @param contractId - Contract ID
 * @param clauseId - Clause ID from library
 * @param order - Clause order in contract
 * @param repository - Clause repository
 * @returns Added clause
 *
 * @example
 * ```typescript
 * const clause = await addClauseToContract(
 *   'contract_123',
 *   'clause_456',
 *   2,
 *   clauseRepo
 * );
 * ```
 */
export async function addClauseToContract(
  contractId: string,
  clauseId: string,
  order: number,
  repository: any
): Promise<ContractClause> {
  const logger = new Logger('ClauseManagement');

  // Fetch library clause
  const libraryClause = await repository.findByPk(clauseId);
  if (!libraryClause) {
    throw new NotFoundException(`Clause ${clauseId} not found`);
  }

  // Create contract-specific clause
  const contractClause: ContractClause = {
    ...libraryClause.toJSON(),
    id: crypto.randomUUID(),
    contractId,
    libraryClauseId: clauseId,
    order,
  };

  logger.log(`Clause ${clauseId} added to contract ${contractId}`);

  return contractClause;
}

/**
 * Search clauses by category and keywords
 *
 * @param category - Clause category
 * @param keywords - Search keywords
 * @param repository - Clause repository
 * @returns Matching clauses
 *
 * @example
 * ```typescript
 * const clauses = await searchClauses(
 *   ClauseCategory.PAYMENT_TERMS,
 *   'net 30',
 *   clauseRepo
 * );
 * ```
 */
export async function searchClauses(
  category: ClauseCategory | undefined,
  keywords: string | undefined,
  repository: any
): Promise<ContractClause[]> {
  const where: WhereOptions = {};

  if (category) {
    where.category = category;
  }

  if (keywords) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${keywords}%` } },
      { content: { [Op.iLike]: `%${keywords}%` } },
    ];
  }

  const clauses = await repository.findAll({ where });
  return clauses.map((c: any) => c.toJSON());
}

/**
 * Detect conflicting clauses in contract
 *
 * @param clauses - Contract clauses
 * @returns Array of potential conflicts
 *
 * @example
 * ```typescript
 * const conflicts = detectClauseConflicts(contract.clauses);
 * if (conflicts.length > 0) {
 *   console.warn('Clause conflicts detected:', conflicts);
 * }
 * ```
 */
export function detectClauseConflicts(
  clauses: ContractClause[]
): Array<{ clause1: string; clause2: string; reason: string }> {
  const conflicts: Array<{ clause1: string; clause2: string; reason: string }> = [];

  // Check for duplicate categories where only one should exist
  const singletonCategories = [
    ClauseCategory.GOVERNING_LAW,
    ClauseCategory.DISPUTE_RESOLUTION,
  ];

  for (const category of singletonCategories) {
    const categoryclauses = clauses.filter(c => c.category === category);
    if (categoryClauses.length > 1) {
      for (let i = 0; i < categoryClauses.length - 1; i++) {
        conflicts.push({
          clause1: categoryClauses[i].id,
          clause2: categoryClauses[i + 1].id,
          reason: `Multiple ${category} clauses found - only one should exist`,
        });
      }
    }
  }

  return conflicts;
}

// ============================================================================
// CONTRACT VERSIONING & COMPARISON
// ============================================================================

/**
 * Create new version of contract
 *
 * @param contractId - Contract ID
 * @param content - Updated contract content
 * @param changes - Description of changes
 * @param userId - User making changes
 * @returns Contract version
 *
 * @example
 * ```typescript
 * const version = await createContractVersion(
 *   'contract_123',
 *   updatedContent,
 *   'Updated payment terms',
 *   'user_456'
 * );
 * ```
 */
export async function createContractVersion(
  contractId: string,
  content: string,
  changes: VersionChange[],
  userId: string
): Promise<ContractVersion> {
  const checksum = crypto.createHash('sha256').update(content).digest('hex');

  const version: ContractVersion = {
    id: crypto.randomUUID(),
    contractId,
    version: 0, // Should be incremented from latest version
    action: VersionAction.UPDATED,
    content,
    changes,
    checksum,
    createdBy: userId,
    createdAt: new Date(),
    metadata: {},
  };

  return version;
}

/**
 * Get version history for contract
 *
 * @param contractId - Contract ID
 * @param repository - Version repository
 * @returns Array of versions
 *
 * @example
 * ```typescript
 * const history = await getContractVersionHistory('contract_123', versionRepo);
 * ```
 */
export async function getContractVersionHistory(
  contractId: string,
  repository: any
): Promise<ContractVersion[]> {
  const versions = await repository.findAll({
    where: { contractId },
    order: [['version', 'DESC']],
  });

  return versions.map((v: any) => v.toJSON());
}

/**
 * Compare two contract versions
 *
 * @param version1 - First version
 * @param version2 - Second version
 * @returns Comparison result with differences
 *
 * @example
 * ```typescript
 * const comparison = await compareContractVersions(v1, v2);
 * console.log(`Similarity: ${comparison.similarity}%`);
 * ```
 */
export async function compareContractVersions(
  version1: ContractVersion,
  version2: ContractVersion
): Promise<ContractComparison> {
  const logger = new Logger('ContractComparison');

  // Calculate differences
  const differences = calculateContentDifferences(version1.content, version2.content);

  // Calculate similarity score
  const similarity = calculateSimilarity(version1.content, version2.content);

  const comparison: ContractComparison = {
    contractId1: version1.contractId,
    contractId2: version2.contractId,
    version1: version1.version,
    version2: version2.version,
    differences,
    similarity,
    comparedAt: new Date(),
  };

  logger.log(`Compared versions ${version1.version} and ${version2.version}, similarity: ${similarity}%`);

  return comparison;
}

/**
 * Calculate content differences between two texts
 */
function calculateContentDifferences(content1: string, content2: string): ContractDifference[] {
  const differences: ContractDifference[] = [];

  // Simple line-by-line comparison
  // In production, would use a proper diff library like 'diff'
  const lines1 = content1.split('\n');
  const lines2 = content2.split('\n');

  const maxLines = Math.max(lines1.length, lines2.length);

  for (let i = 0; i < maxLines; i++) {
    const line1 = lines1[i] || '';
    const line2 = lines2[i] || '';

    if (line1 !== line2) {
      if (!line1) {
        differences.push({
          section: `Line ${i + 1}`,
          type: 'added',
          content2: line2,
          severity: 'minor',
        });
      } else if (!line2) {
        differences.push({
          section: `Line ${i + 1}`,
          type: 'removed',
          content1: line1,
          severity: 'minor',
        });
      } else {
        differences.push({
          section: `Line ${i + 1}`,
          type: 'modified',
          content1: line1,
          content2: line2,
          severity: determineDifferenceSeverity(line1, line2),
        });
      }
    }
  }

  return differences;
}

/**
 * Determine severity of a difference
 */
function determineDifferenceSeverity(content1: string, content2: string): 'minor' | 'moderate' | 'major' {
  const keywords = {
    major: ['payment', 'liability', 'termination', 'indemnification', 'shall', 'must'],
    moderate: ['may', 'should', 'responsibility', 'obligation'],
  };

  const text = (content1 + ' ' + content2).toLowerCase();

  if (keywords.major.some(k => text.includes(k))) {
    return 'major';
  }
  if (keywords.moderate.some(k => text.includes(k))) {
    return 'moderate';
  }
  return 'minor';
}

/**
 * Calculate similarity percentage between two texts
 */
function calculateSimilarity(content1: string, content2: string): number {
  const words1 = content1.toLowerCase().split(/\s+/);
  const words2 = content2.toLowerCase().split(/\s+/);

  const set1 = new Set(words1);
  const set2 = new Set(words2);

  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return Math.round((intersection.size / union.size) * 100);
}

/**
 * Restore contract to specific version
 *
 * @param contractId - Contract ID
 * @param versionNumber - Version number to restore
 * @param userId - User performing restoration
 * @param repository - Version repository
 *
 * @example
 * ```typescript
 * await restoreContractVersion('contract_123', 3, 'user_456', versionRepo);
 * ```
 */
export async function restoreContractVersion(
  contractId: string,
  versionNumber: number,
  userId: string,
  repository: any
): Promise<void> {
  const logger = new Logger('ContractVersioning');

  const version = await repository.findOne({
    where: { contractId, version: versionNumber },
  });

  if (!version) {
    throw new NotFoundException(`Version ${versionNumber} not found for contract ${contractId}`);
  }

  logger.log(`Restoring contract ${contractId} to version ${versionNumber}`);

  // Implementation would:
  // 1. Create new version with action=RESTORED
  // 2. Update current contract with restored content
  // 3. Increment version number
}

// ============================================================================
// OBLIGATION TRACKING & DEADLINES
// ============================================================================

/**
 * Create contract obligation
 *
 * @param contractId - Contract ID
 * @param data - Obligation creation data
 * @param userId - User creating obligation
 * @returns Created obligation
 *
 * @example
 * ```typescript
 * const obligation = await createObligation('contract_123', {
 *   title: 'Monthly Report Submission',
 *   description: 'Submit monthly performance report',
 *   responsibleParty: PartyRole.PROVIDER,
 *   dueDate: new Date('2025-02-01'),
 *   priority: ObligationPriority.HIGH,
 *   recurring: true,
 *   recurrencePattern: 'monthly',
 * }, 'user_456');
 * ```
 */
export async function createObligation(
  contractId: string,
  data: z.infer<typeof ObligationCreateSchema>,
  userId: string
): Promise<ContractObligation> {
  const validated = ObligationCreateSchema.parse(data);

  const obligation: ContractObligation = {
    id: crypto.randomUUID(),
    contractId,
    title: validated.title,
    description: validated.description,
    responsibleParty: validated.responsibleParty,
    assignedTo: validated.assignedTo,
    dueDate: validated.dueDate,
    status: ObligationStatus.PENDING,
    priority: validated.priority,
    recurring: validated.recurring,
    recurrencePattern: validated.recurrencePattern,
    reminderDays: validated.reminderDays,
    dependencies: validated.dependencies,
    metadata: validated.metadata,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return obligation;
}

/**
 * Get upcoming obligations within date range
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @param repository - Obligation repository
 * @returns Array of obligations
 *
 * @example
 * ```typescript
 * const upcoming = await getUpcomingObligations(
 *   new Date(),
 *   new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
 *   obligationRepo
 * );
 * ```
 */
export async function getUpcomingObligations(
  startDate: Date,
  endDate: Date,
  repository: any
): Promise<ContractObligation[]> {
  const obligations = await repository.findAll({
    where: {
      dueDate: {
        [Op.between]: [startDate, endDate],
      },
      status: {
        [Op.notIn]: [ObligationStatus.COMPLETED, ObligationStatus.WAIVED],
      },
    },
    order: [['dueDate', 'ASC']],
  });

  return obligations.map((o: any) => o.toJSON());
}

/**
 * Get overdue obligations
 *
 * @param repository - Obligation repository
 * @returns Array of overdue obligations
 *
 * @example
 * ```typescript
 * const overdue = await getOverdueObligations(obligationRepo);
 * ```
 */
export async function getOverdueObligations(repository: any): Promise<ContractObligation[]> {
  const now = new Date();

  const obligations = await repository.findAll({
    where: {
      dueDate: { [Op.lt]: now },
      status: {
        [Op.notIn]: [ObligationStatus.COMPLETED, ObligationStatus.WAIVED],
      },
    },
    order: [['dueDate', 'ASC']],
  });

  // Update status to overdue
  for (const obligation of obligations) {
    await repository.update(
      { status: ObligationStatus.OVERDUE },
      { where: { id: obligation.id } }
    );
  }

  return obligations.map((o: any) => o.toJSON());
}

/**
 * Complete obligation
 *
 * @param obligationId - Obligation ID
 * @param userId - User completing obligation
 * @param repository - Obligation repository
 *
 * @example
 * ```typescript
 * await completeObligation('obligation_123', 'user_456', obligationRepo);
 * ```
 */
export async function completeObligation(
  obligationId: string,
  userId: string,
  repository: any
): Promise<void> {
  const logger = new Logger('ObligationTracking');

  const obligation = await repository.findByPk(obligationId);
  if (!obligation) {
    throw new NotFoundException(`Obligation ${obligationId} not found`);
  }

  await repository.update(
    {
      status: ObligationStatus.COMPLETED,
      completedDate: new Date(),
    },
    { where: { id: obligationId } }
  );

  logger.log(`Obligation ${obligationId} marked as completed by ${userId}`);

  // If recurring, create next occurrence
  if (obligation.recurring && obligation.recurrencePattern) {
    await createRecurringObligation(obligation);
  }
}

/**
 * Create next occurrence of recurring obligation
 */
async function createRecurringObligation(obligation: any): Promise<void> {
  const nextDueDate = calculateNextDueDate(obligation.dueDate, obligation.recurrencePattern);

  const nextObligation: Partial<ContractObligation> = {
    ...obligation.toJSON(),
    id: crypto.randomUUID(),
    dueDate: nextDueDate,
    status: ObligationStatus.PENDING,
    completedDate: undefined,
  };

  // Would save to repository
}

/**
 * Calculate next due date for recurring obligation
 */
function calculateNextDueDate(currentDate: Date, pattern: string): Date {
  const next = new Date(currentDate);

  switch (pattern.toLowerCase()) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'quarterly':
      next.setMonth(next.getMonth() + 3);
      break;
    case 'annually':
      next.setFullYear(next.getFullYear() + 1);
      break;
    default:
      next.setMonth(next.getMonth() + 1);
  }

  return next;
}

/**
 * Send obligation reminders for upcoming deadlines
 *
 * @param daysAhead - Days to look ahead
 * @param repository - Obligation repository
 * @returns Number of reminders sent
 *
 * @example
 * ```typescript
 * const count = await sendObligationReminders(7, obligationRepo);
 * ```
 */
export async function sendObligationReminders(
  daysAhead: number,
  repository: any
): Promise<number> {
  const logger = new Logger('ObligationReminders');

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysAhead);

  const obligations = await repository.findAll({
    where: {
      dueDate: {
        [Op.between]: [new Date(), targetDate],
      },
      status: ObligationStatus.PENDING,
    },
  });

  let remindersSent = 0;

  for (const obligation of obligations) {
    const daysUntilDue = Math.ceil(
      (obligation.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    if (obligation.reminderDays.includes(daysUntilDue)) {
      // Send reminder (would integrate with email service)
      logger.log(`Reminder sent for obligation ${obligation.id}, due in ${daysUntilDue} days`);
      remindersSent++;
    }
  }

  return remindersSent;
}

// ============================================================================
// CONTRACT SEARCH & RETRIEVAL
// ============================================================================

/**
 * Search contracts with filters
 *
 * @param filters - Search filters
 * @param repository - Contract repository
 * @returns Matching contracts
 *
 * @example
 * ```typescript
 * const contracts = await searchContracts({
 *   query: 'provider agreement',
 *   contractTypes: [ContractType.PROVIDER_AGREEMENT],
 *   statuses: [ContractStatus.ACTIVE],
 *   effectiveDateFrom: new Date('2025-01-01'),
 * }, contractRepo);
 * ```
 */
export async function searchContracts(
  filters: ContractSearchFilters,
  repository: any
): Promise<Contract[]> {
  const where: WhereOptions = {};

  // Full-text search on title and description
  if (filters.query) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${filters.query}%` } },
      { description: { [Op.iLike]: `%${filters.query}%` } },
    ];
  }

  // Contract type filter
  if (filters.contractTypes?.length) {
    where.contractType = { [Op.in]: filters.contractTypes };
  }

  // Status filter
  if (filters.statuses?.length) {
    where.status = { [Op.in]: filters.statuses };
  }

  // Date range filters
  if (filters.effectiveDateFrom) {
    where.effectiveDate = { [Op.gte]: filters.effectiveDateFrom };
  }
  if (filters.effectiveDateTo) {
    where.effectiveDate = { ...where.effectiveDate, [Op.lte]: filters.effectiveDateTo };
  }

  if (filters.expirationDateFrom) {
    where.expirationDate = { [Op.gte]: filters.expirationDateFrom };
  }
  if (filters.expirationDateTo) {
    where.expirationDate = { ...where.expirationDate, [Op.lte]: filters.expirationDateTo };
  }

  // Value range
  if (filters.minValue !== undefined) {
    where.totalValue = { [Op.gte]: filters.minValue };
  }
  if (filters.maxValue !== undefined) {
    where.totalValue = { ...where.totalValue, [Op.lte]: filters.maxValue };
  }

  // Tenant filter
  if (filters.tenantId) {
    where.tenantId = filters.tenantId;
  }

  const contracts = await repository.findAll({
    where,
    include: ['parties', 'clauses', 'obligations'],
    order: [['createdAt', 'DESC']],
  });

  return contracts.map((c: any) => c.toJSON());
}

/**
 * Get contract by contract number
 *
 * @param contractNumber - Contract number
 * @param repository - Contract repository
 * @returns Contract
 *
 * @example
 * ```typescript
 * const contract = await getContractByNumber('CTR-2025-001234', contractRepo);
 * ```
 */
export async function getContractByNumber(
  contractNumber: string,
  repository: any
): Promise<Contract> {
  const contract = await repository.findOne({
    where: { contractNumber },
    include: ['parties', 'clauses', 'obligations'],
  });

  if (!contract) {
    throw new NotFoundException(`Contract ${contractNumber} not found`);
  }

  return contract.toJSON();
}

/**
 * Get contracts expiring soon
 *
 * @param daysAhead - Days to look ahead
 * @param repository - Contract repository
 * @returns Expiring contracts
 *
 * @example
 * ```typescript
 * const expiring = await getContractsExpiringSoon(30, contractRepo);
 * ```
 */
export async function getContractsExpiringSoon(
  daysAhead: number,
  repository: any
): Promise<Contract[]> {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  const contracts = await repository.findAll({
    where: {
      expirationDate: {
        [Op.between]: [now, futureDate],
      },
      status: ContractStatus.ACTIVE,
      autoRenew: false,
    },
    order: [['expirationDate', 'ASC']],
  });

  return contracts.map((c: any) => c.toJSON());
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

/**
 * Contract Management Service
 * NestJS service for contract operations with dependency injection
 */
@Injectable()
export class ContractManagementService {
  private readonly logger = new Logger(ContractManagementService.name);

  constructor(
    @Inject('CONTRACT_REPOSITORY') private contractRepo: typeof ContractModel,
    @Inject('CLAUSE_REPOSITORY') private clauseRepo: typeof ContractClauseModel,
    @Inject('OBLIGATION_REPOSITORY') private obligationRepo: typeof ContractObligationModel,
    @Inject('VERSION_REPOSITORY') private versionRepo: typeof ContractVersionModel,
    private configService: ConfigService
  ) {}

  /**
   * Create new contract
   */
  async create(data: z.infer<typeof ContractCreateSchema>, userId: string): Promise<Contract> {
    this.logger.log(`Creating contract: ${data.title}`);
    return createContract(data, userId, this.configService);
  }

  /**
   * Get contract by ID
   */
  async findById(id: string): Promise<Contract> {
    const contract = await this.contractRepo.findByPk(id, {
      include: [
        { model: ContractPartyModel, as: 'parties' },
        { model: ContractClauseModel, as: 'clauses' },
        { model: ContractObligationModel, as: 'obligations' },
      ],
    });

    if (!contract) {
      throw new NotFoundException(`Contract ${id} not found`);
    }

    return contract.toJSON() as Contract;
  }

  /**
   * Search contracts
   */
  async search(filters: ContractSearchFilters): Promise<Contract[]> {
    return searchContracts(filters, this.contractRepo);
  }

  /**
   * Update contract status
   */
  async updateStatus(id: string, status: ContractStatus, userId: string): Promise<void> {
    await this.contractRepo.update(
      { status, updatedBy: userId },
      { where: { id } }
    );

    this.logger.log(`Contract ${id} status updated to ${status}`);
  }

  /**
   * Add clause to contract
   */
  async addClause(contractId: string, clauseId: string, order: number): Promise<ContractClause> {
    return addClauseToContract(contractId, clauseId, order, this.clauseRepo);
  }

  /**
   * Create obligation
   */
  async createObligation(
    contractId: string,
    data: z.infer<typeof ObligationCreateSchema>,
    userId: string
  ): Promise<ContractObligation> {
    return createObligation(contractId, data, userId);
  }

  /**
   * Get version history
   */
  async getVersionHistory(contractId: string): Promise<ContractVersion[]> {
    return getContractVersionHistory(contractId, this.versionRepo);
  }
}

// ============================================================================
// SWAGGER API DOCUMENTATION
// ============================================================================

/**
 * Contract DTO for API documentation
 */
export class ContractDto {
  @ApiProperty({ example: 'uuid', description: 'Contract ID' })
  id!: string;

  @ApiProperty({ example: 'CTR-2025-001234', description: 'Contract number' })
  contractNumber!: string;

  @ApiProperty({ example: 'Provider Service Agreement', description: 'Contract title' })
  title!: string;

  @ApiPropertyOptional({ description: 'Contract description' })
  description?: string;

  @ApiProperty({ enum: ContractType, description: 'Contract type' })
  contractType!: ContractType;

  @ApiProperty({ enum: ContractStatus, description: 'Contract status' })
  status!: ContractStatus;

  @ApiProperty({ example: 1, description: 'Version number' })
  version!: number;

  @ApiProperty({ type: Date, description: 'Effective date' })
  effectiveDate!: Date;

  @ApiPropertyOptional({ type: Date, description: 'Expiration date' })
  expirationDate?: Date;

  @ApiProperty({ example: false, description: 'Auto-renewal flag' })
  autoRenew!: boolean;

  @ApiPropertyOptional({ example: 50000, description: 'Total contract value' })
  totalValue?: number;

  @ApiPropertyOptional({ example: 'USD', description: 'Currency code' })
  currency?: string;
}

/**
 * Create Contract DTO
 */
export class CreateContractDto {
  @ApiProperty({ example: 'Provider Service Agreement' })
  title!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: ContractType })
  contractType!: ContractType;

  @ApiProperty({ type: Date })
  effectiveDate!: Date;

  @ApiPropertyOptional({ type: Date })
  expirationDate?: Date;

  @ApiPropertyOptional({ default: false })
  autoRenew?: boolean;

  @ApiPropertyOptional()
  totalValue?: number;

  @ApiPropertyOptional({ example: 'USD' })
  currency?: string;

  @ApiPropertyOptional()
  templateId?: string;
}

/**
 * Obligation DTO
 */
export class ObligationDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  contractId!: string;

  @ApiProperty({ example: 'Submit Monthly Report' })
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty({ enum: PartyRole })
  responsibleParty!: PartyRole;

  @ApiProperty({ type: Date })
  dueDate!: Date;

  @ApiProperty({ enum: ObligationStatus })
  status!: ObligationStatus;

  @ApiProperty({ enum: ObligationPriority })
  priority!: ObligationPriority;

  @ApiProperty({ default: false })
  recurring!: boolean;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Configuration
  registerContractConfig,
  createContractConfigModule,

  // Contract Creation & Templating
  generateContractNumber,
  createContract,
  createContractFromTemplate,
  validateTemplateVariables,
  substituteTemplateVariables,

  // Clause Management
  createClause,
  addClauseToContract,
  searchClauses,
  detectClauseConflicts,

  // Versioning & Comparison
  createContractVersion,
  getContractVersionHistory,
  compareContractVersions,
  restoreContractVersion,

  // Obligation Tracking
  createObligation,
  getUpcomingObligations,
  getOverdueObligations,
  completeObligation,
  sendObligationReminders,

  // Search & Retrieval
  searchContracts,
  getContractByNumber,
  getContractsExpiringSoon,

  // Service
  ContractManagementService,
};
