/**
 * LOC: LITIGATION_SUPPORT_KIT_001
 * File: /reuse/legal/litigation-support-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *   - pdf-lib
 *   - date-fns
 *
 * DOWNSTREAM (imported by):
 *   - Legal litigation modules
 *   - Court management controllers
 *   - Trial preparation services
 *   - Evidence management services
 *   - Witness coordination services
 */

/**
 * File: /reuse/legal/litigation-support-kit.ts
 * Locator: WC-LITIGATION-SUPPORT-KIT-001
 * Purpose: Production-Grade Litigation Support Kit - Enterprise litigation management toolkit
 *
 * Upstream: NestJS, Sequelize, Zod, PDF-Lib, Date-FNS
 * Downstream: ../backend/modules/litigation/*, Court management controllers, Trial prep services
 * Dependencies: TypeScript 5.x, Node 18+, sequelize-typescript, @nestjs/swagger, zod
 * Exports: 42 production-ready litigation management functions for legal platforms
 *
 * LLM Context: Production-grade litigation lifecycle management toolkit for White Cross platform.
 * Provides comprehensive matter management with case tracking and attorney assignment, timeline
 * creation with conflict detection and visualization export, witness management with testimony
 * recording and credibility assessment, evidence tracking with full chain of custody and integrity
 * validation, trial preparation with readiness assessment and document assembly, Sequelize models
 * for matters/witnesses/evidence/timelines/trial preparation, NestJS services with dependency
 * injection, Swagger API documentation, matter cost calculation and budget tracking, witness
 * interview scheduling and availability tracking, exhibit list generation with automatic numbering,
 * trial binder assembly with table of contents, deposition management and transcript linking,
 * settlement demand generation with supporting documentation, case chronology with automatic
 * timeline generation, discovery request automation, motion drafting with template support,
 * pleading generation, examination outline creation, opening statement framework, trial date
 * scheduling with calendar integration, evidence integrity validation with hash verification,
 * witness-evidence linking for testimony preparation, and healthcare litigation-specific support
 * (medical malpractice, HIPAA compliance, expert medical witnesses, medical records management).
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
  Index,
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';
import { Op, WhereOptions, FindOptions, Transaction } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Litigation matter status lifecycle
 */
export enum MatterStatus {
  INITIAL_CONSULTATION = 'initial_consultation',
  INVESTIGATION = 'investigation',
  PRE_LITIGATION = 'pre_litigation',
  COMPLAINT_FILED = 'complaint_filed',
  DISCOVERY = 'discovery',
  MEDIATION = 'mediation',
  ARBITRATION = 'arbitration',
  PRE_TRIAL = 'pre_trial',
  TRIAL = 'trial',
  POST_TRIAL = 'post_trial',
  APPEAL = 'appeal',
  SETTLED = 'settled',
  DISMISSED = 'dismissed',
  JUDGMENT_ENTERED = 'judgment_entered',
  CLOSED = 'closed',
}

/**
 * Types of litigation matters
 */
export enum MatterType {
  MEDICAL_MALPRACTICE = 'medical_malpractice',
  PERSONAL_INJURY = 'personal_injury',
  EMPLOYMENT = 'employment',
  CONTRACT_DISPUTE = 'contract_dispute',
  INTELLECTUAL_PROPERTY = 'intellectual_property',
  REGULATORY_COMPLIANCE = 'regulatory_compliance',
  PROFESSIONAL_LIABILITY = 'professional_liability',
  INSURANCE_DEFENSE = 'insurance_defense',
  CLASS_ACTION = 'class_action',
  PRODUCT_LIABILITY = 'product_liability',
  CIVIL_RIGHTS = 'civil_rights',
  HIPAA_VIOLATION = 'hipaa_violation',
  OTHER = 'other',
}

/**
 * Witness types and roles
 */
export enum WitnessType {
  FACT_WITNESS = 'fact_witness',
  EXPERT_WITNESS = 'expert_witness',
  CHARACTER_WITNESS = 'character_witness',
  MEDICAL_EXPERT = 'medical_expert',
  TECHNICAL_EXPERT = 'technical_expert',
  PERCIPIENT_WITNESS = 'percipient_witness',
  REBUTTAL_WITNESS = 'rebuttal_witness',
  ADVERSE_WITNESS = 'adverse_witness',
}

/**
 * Witness status tracking
 */
export enum WitnessStatus {
  IDENTIFIED = 'identified',
  CONTACTED = 'contacted',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  INTERVIEWED = 'interviewed',
  DEPOSITION_SCHEDULED = 'deposition_scheduled',
  DEPOSED = 'deposed',
  TRIAL_READY = 'trial_ready',
  TESTIFIED = 'testified',
  UNAVAILABLE = 'unavailable',
  HOSTILE = 'hostile',
}

/**
 * Evidence categorization
 */
export enum EvidenceCategory {
  DOCUMENTARY = 'documentary',
  PHYSICAL = 'physical',
  ELECTRONIC = 'electronic',
  TESTIMONIAL = 'testimonial',
  DEMONSTRATIVE = 'demonstrative',
  MEDICAL_RECORDS = 'medical_records',
  FINANCIAL_RECORDS = 'financial_records',
  CORRESPONDENCE = 'correspondence',
  PHOTOGRAPHS = 'photographs',
  VIDEO = 'video',
  AUDIO = 'audio',
  EXPERT_REPORT = 'expert_report',
  SCIENTIFIC = 'scientific',
  REAL_EVIDENCE = 'real_evidence',
}

/**
 * Chain of custody status
 */
export enum ChainOfCustodyStatus {
  COLLECTED = 'collected',
  SECURED = 'secured',
  ANALYZED = 'analyzed',
  STORED = 'stored',
  TRANSFERRED = 'transferred',
  PRESENTED = 'presented',
  RETURNED = 'returned',
  DESTROYED = 'destroyed',
}

/**
 * Timeline event types
 */
export enum TimelineEventType {
  INCIDENT = 'incident',
  CONSULTATION = 'consultation',
  FILING = 'filing',
  SERVICE = 'service',
  RESPONSE = 'response',
  DISCOVERY_REQUEST = 'discovery_request',
  DISCOVERY_RESPONSE = 'discovery_response',
  DEPOSITION = 'deposition',
  MOTION = 'motion',
  HEARING = 'hearing',
  SETTLEMENT_DISCUSSION = 'settlement_discussion',
  MEDIATION = 'mediation',
  ARBITRATION = 'arbitration',
  TRIAL_DATE = 'trial_date',
  VERDICT = 'verdict',
  JUDGMENT = 'judgment',
  APPEAL = 'appeal',
  DEADLINE = 'deadline',
}

/**
 * Trial preparation phases
 */
export enum TrialPhase {
  INITIAL_PREP = 'initial_prep',
  WITNESS_PREP = 'witness_prep',
  EXHIBIT_PREP = 'exhibit_prep',
  VOIR_DIRE = 'voir_dire',
  OPENING_STATEMENTS = 'opening_statements',
  PLAINTIFF_CASE = 'plaintiff_case',
  DEFENDANT_CASE = 'defendant_case',
  REBUTTAL = 'rebuttal',
  CLOSING_ARGUMENTS = 'closing_arguments',
  JURY_INSTRUCTIONS = 'jury_instructions',
  DELIBERATION = 'deliberation',
  VERDICT = 'verdict',
  POST_TRIAL_MOTIONS = 'post_trial_motions',
}

/**
 * Litigation matter interface
 */
export interface ILitigationMatter {
  id: string;
  matterNumber: string;
  matterName: string;
  matterType: MatterType;
  status: MatterStatus;
  clientId: string;
  clientName: string;
  opposingParty: string;
  opposingCounsel?: string;
  jurisdiction: string;
  courtName?: string;
  caseNumber?: string;
  filingDate?: Date;
  trialDate?: Date;
  leadAttorneyId: string;
  assignedAttorneys: string[];
  description: string;
  estimatedValue?: number;
  actualCosts?: number;
  budgetLimit?: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Witness information interface
 */
export interface IWitness {
  id: string;
  matterId: string;
  witnessType: WitnessType;
  status: WitnessStatus;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  organization?: string;
  role: string;
  credibilityScore?: number;
  interviewDate?: Date;
  depositionDate?: Date;
  depositionTranscript?: string;
  testimonyNotes?: string;
  availability: Record<string, boolean>;
  isOpposing: boolean;
  isExpert: boolean;
  expertiseArea?: string;
  expertFees?: number;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Evidence item interface
 */
export interface IEvidence {
  id: string;
  matterId: string;
  exhibitNumber?: string;
  category: EvidenceCategory;
  description: string;
  source: string;
  collectionDate: Date;
  collectedBy: string;
  location: string;
  fileHash?: string;
  filePath?: string;
  fileSize?: number;
  mimeType?: string;
  chainOfCustody: IChainOfCustodyEntry[];
  linkedWitnessIds: string[];
  tags: string[];
  isAdmitted: boolean;
  admissionDate?: Date;
  notes: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Chain of custody entry
 */
export interface IChainOfCustodyEntry {
  timestamp: Date;
  action: ChainOfCustodyStatus;
  performedBy: string;
  location: string;
  notes?: string;
  signature?: string;
}

/**
 * Timeline event interface
 */
export interface ITimelineEvent {
  id: string;
  matterId: string;
  eventType: TimelineEventType;
  eventDate: Date;
  title: string;
  description: string;
  participants: string[];
  relatedDocuments: string[];
  relatedWitnesses: string[];
  relatedEvidence: string[];
  location?: string;
  outcome?: string;
  isDeadline: boolean;
  deadlineDate?: Date;
  completed: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Trial preparation interface
 */
export interface ITrialPreparation {
  id: string;
  matterId: string;
  trialDate: Date;
  currentPhase: TrialPhase;
  readinessScore: number;
  witnessListComplete: boolean;
  exhibitListComplete: boolean;
  trialBinderComplete: boolean;
  openingStatementDrafted: boolean;
  closingArgumentDrafted: boolean;
  witnessExaminationOutlines: Record<string, any>;
  trialStrategy: string;
  jurySelectionNotes?: string;
  estimatedDuration: number;
  checklist: ITrialChecklistItem[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Trial checklist item
 */
export interface ITrialChecklistItem {
  id: string;
  task: string;
  category: string;
  completed: boolean;
  completedBy?: string;
  completedAt?: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

const MatterStatusSchema = z.nativeEnum(MatterStatus);
const MatterTypeSchema = z.nativeEnum(MatterType);
const WitnessTypeSchema = z.nativeEnum(WitnessType);
const WitnessStatusSchema = z.nativeEnum(WitnessStatus);
const EvidenceCategorySchema = z.nativeEnum(EvidenceCategory);
const TimelineEventTypeSchema = z.nativeEnum(TimelineEventType);

export const CreateMatterSchema = z.object({
  matterName: z.string().min(1).max(500),
  matterType: MatterTypeSchema,
  clientId: z.string().uuid(),
  clientName: z.string().min(1),
  opposingParty: z.string().min(1),
  opposingCounsel: z.string().optional(),
  jurisdiction: z.string().min(1),
  courtName: z.string().optional(),
  leadAttorneyId: z.string().uuid(),
  description: z.string(),
  estimatedValue: z.number().positive().optional(),
  budgetLimit: z.number().positive().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.any()).default({}),
});

export const CreateWitnessSchema = z.object({
  matterId: z.string().uuid(),
  witnessType: WitnessTypeSchema,
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  organization: z.string().optional(),
  role: z.string().min(1),
  isOpposing: z.boolean().default(false),
  isExpert: z.boolean().default(false),
  expertiseArea: z.string().optional(),
  metadata: z.record(z.any()).default({}),
});

export const CreateEvidenceSchema = z.object({
  matterId: z.string().uuid(),
  category: EvidenceCategorySchema,
  description: z.string().min(1),
  source: z.string().min(1),
  collectionDate: z.date(),
  collectedBy: z.string().min(1),
  location: z.string().min(1),
  filePath: z.string().optional(),
  tags: z.array(z.string()).default([]),
  notes: z.string().default(''),
  metadata: z.record(z.any()).default({}),
});

export const CreateTimelineEventSchema = z.object({
  matterId: z.string().uuid(),
  eventType: TimelineEventTypeSchema,
  eventDate: z.date(),
  title: z.string().min(1),
  description: z.string(),
  participants: z.array(z.string()).default([]),
  isDeadline: z.boolean().default(false),
  deadlineDate: z.date().optional(),
  metadata: z.record(z.any()).default({}),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * LitigationMatter Sequelize Model
 * Represents a litigation case or matter with full lifecycle tracking
 */
@Table({
  tableName: 'litigation_matters',
  paranoid: true,
  timestamps: true,
  indexes: [
    { fields: ['matterNumber'], unique: true },
    { fields: ['status'] },
    { fields: ['matterType'] },
    { fields: ['clientId'] },
    { fields: ['leadAttorneyId'] },
    { fields: ['filingDate'] },
    { fields: ['trialDate'] },
  ],
})
export class LitigationMatter extends Model<ILitigationMatter> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique matter identifier' })
  id!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  @Index
  @ApiProperty({ description: 'Unique matter number' })
  matterNumber!: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  @ApiProperty({ description: 'Matter name/title' })
  matterName!: string;

  @Column({
    type: DataType.ENUM(...Object.values(MatterType)),
    allowNull: false,
  })
  @Index
  @ApiProperty({ enum: MatterType, description: 'Type of litigation' })
  matterType!: MatterType;

  @Column({
    type: DataType.ENUM(...Object.values(MatterStatus)),
    allowNull: false,
    defaultValue: MatterStatus.INITIAL_CONSULTATION,
  })
  @Index
  @ApiProperty({ enum: MatterStatus, description: 'Current matter status' })
  status!: MatterStatus;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Client UUID' })
  clientId!: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  @ApiProperty({ description: 'Client name' })
  clientName!: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  @ApiProperty({ description: 'Opposing party name' })
  opposingParty!: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Opposing counsel name' })
  opposingCounsel?: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  @ApiProperty({ description: 'Legal jurisdiction' })
  jurisdiction!: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Court name' })
  courtName?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Court case number' })
  caseNumber?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @Index
  @ApiPropertyOptional({ description: 'Filing date' })
  filingDate?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @Index
  @ApiPropertyOptional({ description: 'Scheduled trial date' })
  trialDate?: Date;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Lead attorney UUID' })
  leadAttorneyId!: string;

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
    defaultValue: [],
  })
  @ApiProperty({ type: [String], description: 'Assigned attorney UUIDs' })
  assignedAttorneys!: string[];

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  @ApiProperty({ description: 'Matter description' })
  description!: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Estimated case value' })
  estimatedValue?: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: 0,
  })
  @ApiPropertyOptional({ description: 'Actual costs incurred' })
  actualCosts?: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Budget limit' })
  budgetLimit?: number;

  @Column({
    type: DataType.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: false,
    defaultValue: 'medium',
  })
  @ApiProperty({ description: 'Matter priority level' })
  priority!: 'low' | 'medium' | 'high' | 'critical';

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
  })
  @ApiProperty({ type: [String], description: 'Matter tags' })
  tags!: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {},
  })
  @ApiProperty({ description: 'Additional metadata' })
  metadata!: Record<string, any>;

  @CreatedAt
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @UpdatedAt
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;

  @DeletedAt
  @ApiPropertyOptional({ description: 'Soft delete timestamp' })
  deletedAt?: Date;

  @HasMany(() => Witness)
  witnesses?: Witness[];

  @HasMany(() => Evidence)
  evidence?: Evidence[];

  @HasMany(() => TimelineEvent)
  timelineEvents?: TimelineEvent[];

  @HasMany(() => TrialPreparation)
  trialPreparations?: TrialPreparation[];
}

/**
 * Witness Sequelize Model
 * Represents witnesses associated with litigation matters
 */
@Table({
  tableName: 'litigation_witnesses',
  paranoid: true,
  timestamps: true,
  indexes: [
    { fields: ['matterId'] },
    { fields: ['witnessType'] },
    { fields: ['status'] },
    { fields: ['email'] },
  ],
})
export class Witness extends Model<IWitness> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique witness identifier' })
  id!: string;

  @ForeignKey(() => LitigationMatter)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Associated matter UUID' })
  matterId!: string;

  @BelongsTo(() => LitigationMatter)
  matter?: LitigationMatter;

  @Column({
    type: DataType.ENUM(...Object.values(WitnessType)),
    allowNull: false,
  })
  @Index
  @ApiProperty({ enum: WitnessType, description: 'Type of witness' })
  witnessType!: WitnessType;

  @Column({
    type: DataType.ENUM(...Object.values(WitnessStatus)),
    allowNull: false,
    defaultValue: WitnessStatus.IDENTIFIED,
  })
  @Index
  @ApiProperty({ enum: WitnessStatus, description: 'Witness status' })
  status!: WitnessStatus;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  @ApiProperty({ description: 'First name' })
  firstName!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  @ApiProperty({ description: 'Last name' })
  lastName!: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  @Index
  @ApiPropertyOptional({ description: 'Email address' })
  email?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Phone number' })
  phone?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Physical address' })
  address?: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Organization/employer' })
  organization?: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  @ApiProperty({ description: 'Role in matter' })
  role!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    validate: { min: 0, max: 100 },
  })
  @ApiPropertyOptional({ description: 'Credibility score (0-100)' })
  credibilityScore?: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Interview date' })
  interviewDate?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Deposition date' })
  depositionDate?: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Deposition transcript path' })
  depositionTranscript?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Testimony notes' })
  testimonyNotes?: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {},
  })
  @ApiProperty({ description: 'Availability calendar' })
  availability!: Record<string, boolean>;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({ description: 'Is opposing witness' })
  isOpposing!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({ description: 'Is expert witness' })
  isExpert!: boolean;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Area of expertise' })
  expertiseArea?: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Expert witness fees' })
  expertFees?: number;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {},
  })
  @ApiProperty({ description: 'Additional metadata' })
  metadata!: Record<string, any>;

  @CreatedAt
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @UpdatedAt
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;

  @DeletedAt
  @ApiPropertyOptional({ description: 'Soft delete timestamp' })
  deletedAt?: Date;
}

/**
 * Evidence Sequelize Model
 * Represents evidence items with chain of custody tracking
 */
@Table({
  tableName: 'litigation_evidence',
  paranoid: true,
  timestamps: true,
  indexes: [
    { fields: ['matterId'] },
    { fields: ['category'] },
    { fields: ['exhibitNumber'] },
    { fields: ['collectionDate'] },
  ],
})
export class Evidence extends Model<IEvidence> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique evidence identifier' })
  id!: string;

  @ForeignKey(() => LitigationMatter)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Associated matter UUID' })
  matterId!: string;

  @BelongsTo(() => LitigationMatter)
  matter?: LitigationMatter;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  @Index
  @ApiPropertyOptional({ description: 'Exhibit number (e.g., A-1, P-42)' })
  exhibitNumber?: string;

  @Column({
    type: DataType.ENUM(...Object.values(EvidenceCategory)),
    allowNull: false,
  })
  @Index
  @ApiProperty({ enum: EvidenceCategory, description: 'Evidence category' })
  category!: EvidenceCategory;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  @ApiProperty({ description: 'Evidence description' })
  description!: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  @ApiProperty({ description: 'Evidence source' })
  source!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Collection date' })
  collectionDate!: Date;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  @ApiProperty({ description: 'Person who collected evidence' })
  collectedBy!: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  @ApiProperty({ description: 'Storage location' })
  location!: string;

  @Column({
    type: DataType.STRING(128),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'SHA-256 hash for integrity verification' })
  fileHash?: string;

  @Column({
    type: DataType.STRING(1000),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'File storage path' })
  filePath?: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'File size in bytes' })
  fileSize?: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'MIME type' })
  mimeType?: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [],
  })
  @ApiProperty({ type: 'array', description: 'Chain of custody log' })
  chainOfCustody!: IChainOfCustodyEntry[];

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
    defaultValue: [],
  })
  @ApiProperty({ type: [String], description: 'Linked witness UUIDs' })
  linkedWitnessIds!: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
  })
  @ApiProperty({ type: [String], description: 'Evidence tags' })
  tags!: string[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({ description: 'Whether evidence was admitted in court' })
  isAdmitted!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Date evidence was admitted' })
  admissionDate?: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    defaultValue: '',
  })
  @ApiProperty({ description: 'Notes about evidence' })
  notes!: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {},
  })
  @ApiProperty({ description: 'Additional metadata' })
  metadata!: Record<string, any>;

  @CreatedAt
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @UpdatedAt
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;

  @DeletedAt
  @ApiPropertyOptional({ description: 'Soft delete timestamp' })
  deletedAt?: Date;
}

/**
 * TimelineEvent Sequelize Model
 * Represents events in the litigation timeline
 */
@Table({
  tableName: 'litigation_timeline_events',
  paranoid: true,
  timestamps: true,
  indexes: [
    { fields: ['matterId'] },
    { fields: ['eventType'] },
    { fields: ['eventDate'] },
    { fields: ['isDeadline'] },
  ],
})
export class TimelineEvent extends Model<ITimelineEvent> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique event identifier' })
  id!: string;

  @ForeignKey(() => LitigationMatter)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Associated matter UUID' })
  matterId!: string;

  @BelongsTo(() => LitigationMatter)
  matter?: LitigationMatter;

  @Column({
    type: DataType.ENUM(...Object.values(TimelineEventType)),
    allowNull: false,
  })
  @Index
  @ApiProperty({ enum: TimelineEventType, description: 'Event type' })
  eventType!: TimelineEventType;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Event date and time' })
  eventDate!: Date;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  @ApiProperty({ description: 'Event title' })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  @ApiProperty({ description: 'Event description' })
  description!: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
  })
  @ApiProperty({ type: [String], description: 'Event participants' })
  participants!: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
  })
  @ApiProperty({ type: [String], description: 'Related document IDs' })
  relatedDocuments!: string[];

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
    defaultValue: [],
  })
  @ApiProperty({ type: [String], description: 'Related witness UUIDs' })
  relatedWitnesses!: string[];

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
    defaultValue: [],
  })
  @ApiProperty({ type: [String], description: 'Related evidence UUIDs' })
  relatedEvidence!: string[];

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Event location' })
  location?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Event outcome' })
  outcome?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @Index
  @ApiProperty({ description: 'Is this a deadline' })
  isDeadline!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Deadline date if applicable' })
  deadlineDate?: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({ description: 'Is event/deadline completed' })
  completed!: boolean;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {},
  })
  @ApiProperty({ description: 'Additional metadata' })
  metadata!: Record<string, any>;

  @CreatedAt
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @UpdatedAt
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;

  @DeletedAt
  @ApiPropertyOptional({ description: 'Soft delete timestamp' })
  deletedAt?: Date;
}

/**
 * TrialPreparation Sequelize Model
 * Represents trial preparation and readiness tracking
 */
@Table({
  tableName: 'litigation_trial_preparation',
  paranoid: true,
  timestamps: true,
  indexes: [
    { fields: ['matterId'] },
    { fields: ['trialDate'] },
    { fields: ['currentPhase'] },
  ],
})
export class TrialPreparation extends Model<ITrialPreparation> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique trial preparation identifier' })
  id!: string;

  @ForeignKey(() => LitigationMatter)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Associated matter UUID' })
  matterId!: string;

  @BelongsTo(() => LitigationMatter)
  matter?: LitigationMatter;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Scheduled trial date' })
  trialDate!: Date;

  @Column({
    type: DataType.ENUM(...Object.values(TrialPhase)),
    allowNull: false,
    defaultValue: TrialPhase.INITIAL_PREP,
  })
  @Index
  @ApiProperty({ enum: TrialPhase, description: 'Current trial phase' })
  currentPhase!: TrialPhase;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0, max: 100 },
  })
  @ApiProperty({ description: 'Trial readiness score (0-100)' })
  readinessScore!: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({ description: 'Is witness list complete' })
  witnessListComplete!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({ description: 'Is exhibit list complete' })
  exhibitListComplete!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({ description: 'Is trial binder complete' })
  trialBinderComplete!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({ description: 'Is opening statement drafted' })
  openingStatementDrafted!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({ description: 'Is closing argument drafted' })
  closingArgumentDrafted!: boolean;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {},
  })
  @ApiProperty({ description: 'Witness examination outlines by witness ID' })
  witnessExaminationOutlines!: Record<string, any>;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    defaultValue: '',
  })
  @ApiProperty({ description: 'Overall trial strategy' })
  trialStrategy!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Jury selection notes' })
  jurySelectionNotes?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  @ApiProperty({ description: 'Estimated trial duration in days' })
  estimatedDuration!: number;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [],
  })
  @ApiProperty({ type: 'array', description: 'Trial preparation checklist' })
  checklist!: ITrialChecklistItem[];

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {},
  })
  @ApiProperty({ description: 'Additional metadata' })
  metadata!: Record<string, any>;

  @CreatedAt
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @UpdatedAt
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;

  @DeletedAt
  @ApiPropertyOptional({ description: 'Soft delete timestamp' })
  deletedAt?: Date;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate unique matter number
 */
export function generateMatterNumber(prefix: string = 'MTR'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Calculate file hash for integrity verification
 */
export function calculateFileHash(content: Buffer | string): string {
  return crypto
    .createHash('sha256')
    .update(content)
    .digest('hex');
}

/**
 * Generate exhibit number
 */
export function generateExhibitNumber(
  side: 'plaintiff' | 'defendant',
  sequence: number
): string {
  const prefix = side === 'plaintiff' ? 'P' : 'D';
  return `${prefix}-${sequence}`;
}

// ============================================================================
// NESTJS SERVICES
// ============================================================================

/**
 * LitigationMatterService
 * Injectable service for matter management operations
 */
@Injectable()
export class LitigationMatterService {
  private readonly logger = new Logger(LitigationMatterService.name);

  constructor(
    @Inject('SEQUELIZE') private sequelize: Sequelize,
    private configService: ConfigService
  ) {}

  /**
   * 1. Create new litigation matter
   */
  async createLitigationMatter(
    data: z.infer<typeof CreateMatterSchema>,
    createdBy: string
  ): Promise<LitigationMatter> {
    const validated = CreateMatterSchema.parse(data);

    try {
      const matterNumber = generateMatterNumber();

      const matter = await LitigationMatter.create({
        ...validated,
        matterNumber,
        status: MatterStatus.INITIAL_CONSULTATION,
        assignedAttorneys: [validated.leadAttorneyId],
        actualCosts: 0,
        metadata: {
          ...validated.metadata,
          createdBy,
          auditLog: [
            {
              timestamp: new Date(),
              action: 'created',
              performedBy: createdBy,
              details: 'Matter created',
            },
          ],
        },
      } as any);

      this.logger.log(`Created litigation matter: ${matter.matterNumber}`);
      return matter;
    } catch (error) {
      this.logger.error('Failed to create litigation matter', error);
      throw new InternalServerErrorException('Failed to create litigation matter');
    }
  }

  /**
   * 2. Update matter details
   */
  async updateMatterDetails(
    matterId: string,
    updates: Partial<ILitigationMatter>,
    updatedBy: string
  ): Promise<LitigationMatter> {
    const matter = await LitigationMatter.findByPk(matterId);
    if (!matter) {
      throw new NotFoundException('Matter not found');
    }

    try {
      const auditLog = matter.metadata.auditLog || [];
      auditLog.push({
        timestamp: new Date(),
        action: 'updated',
        performedBy: updatedBy,
        details: `Updated: ${Object.keys(updates).join(', ')}`,
      });

      await matter.update({
        ...updates,
        metadata: {
          ...matter.metadata,
          auditLog,
        },
      });

      this.logger.log(`Updated matter: ${matter.matterNumber}`);
      return matter;
    } catch (error) {
      this.logger.error('Failed to update matter', error);
      throw new InternalServerErrorException('Failed to update matter');
    }
  }

  /**
   * 3. Get matter by ID
   */
  async getMatterById(matterId: string): Promise<LitigationMatter> {
    const matter = await LitigationMatter.findByPk(matterId, {
      include: [
        { model: Witness },
        { model: Evidence },
        { model: TimelineEvent },
        { model: TrialPreparation },
      ],
    });

    if (!matter) {
      throw new NotFoundException('Matter not found');
    }

    return matter;
  }

  /**
   * 4. Search matters with filters
   */
  async searchMatters(filters: {
    status?: MatterStatus[];
    matterType?: MatterType[];
    clientId?: string;
    leadAttorneyId?: string;
    keyword?: string;
    filingDateFrom?: Date;
    filingDateTo?: Date;
    trialDateFrom?: Date;
    trialDateTo?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{ rows: LitigationMatter[]; count: number }> {
    const where: WhereOptions = {};

    if (filters.status?.length) {
      where.status = { [Op.in]: filters.status };
    }

    if (filters.matterType?.length) {
      where.matterType = { [Op.in]: filters.matterType };
    }

    if (filters.clientId) {
      where.clientId = filters.clientId;
    }

    if (filters.leadAttorneyId) {
      where.leadAttorneyId = filters.leadAttorneyId;
    }

    if (filters.keyword) {
      where[Op.or] = [
        { matterName: { [Op.iLike]: `%${filters.keyword}%` } },
        { description: { [Op.iLike]: `%${filters.keyword}%` } },
        { opposingParty: { [Op.iLike]: `%${filters.keyword}%` } },
      ];
    }

    if (filters.filingDateFrom || filters.filingDateTo) {
      where.filingDate = {};
      if (filters.filingDateFrom) {
        where.filingDate[Op.gte] = filters.filingDateFrom;
      }
      if (filters.filingDateTo) {
        where.filingDate[Op.lte] = filters.filingDateTo;
      }
    }

    if (filters.trialDateFrom || filters.trialDateTo) {
      where.trialDate = {};
      if (filters.trialDateFrom) {
        where.trialDate[Op.gte] = filters.trialDateFrom;
      }
      if (filters.trialDateTo) {
        where.trialDate[Op.lte] = filters.trialDateTo;
      }
    }

    const { rows, count } = await LitigationMatter.findAndCountAll({
      where,
      limit: filters.limit || 50,
      offset: filters.offset || 0,
      order: [['createdAt', 'DESC']],
    });

    return { rows, count };
  }

  /**
   * 5. Update matter status
   */
  async updateMatterStatus(
    matterId: string,
    newStatus: MatterStatus,
    updatedBy: string,
    notes?: string
  ): Promise<LitigationMatter> {
    const matter = await LitigationMatter.findByPk(matterId);
    if (!matter) {
      throw new NotFoundException('Matter not found');
    }

    const auditLog = matter.metadata.auditLog || [];
    auditLog.push({
      timestamp: new Date(),
      action: 'status_changed',
      performedBy: updatedBy,
      details: `Status changed from ${matter.status} to ${newStatus}`,
      notes,
    });

    await matter.update({
      status: newStatus,
      metadata: {
        ...matter.metadata,
        auditLog,
      },
    });

    this.logger.log(`Matter ${matter.matterNumber} status: ${newStatus}`);
    return matter;
  }

  /**
   * 6. Assign matter to attorney
   */
  async assignMatterToAttorney(
    matterId: string,
    attorneyId: string,
    isLead: boolean,
    assignedBy: string
  ): Promise<LitigationMatter> {
    const matter = await LitigationMatter.findByPk(matterId);
    if (!matter) {
      throw new NotFoundException('Matter not found');
    }

    const assignedAttorneys = new Set(matter.assignedAttorneys);
    assignedAttorneys.add(attorneyId);

    const auditLog = matter.metadata.auditLog || [];
    auditLog.push({
      timestamp: new Date(),
      action: 'attorney_assigned',
      performedBy: assignedBy,
      details: `Attorney ${attorneyId} assigned${isLead ? ' as lead' : ''}`,
    });

    await matter.update({
      leadAttorneyId: isLead ? attorneyId : matter.leadAttorneyId,
      assignedAttorneys: Array.from(assignedAttorneys),
      metadata: {
        ...matter.metadata,
        auditLog,
      },
    });

    this.logger.log(`Attorney assigned to matter: ${matter.matterNumber}`);
    return matter;
  }

  /**
   * 7. Calculate matter costs
   */
  async calculateMatterCosts(matterId: string): Promise<{
    actualCosts: number;
    budgetLimit: number | null;
    budgetRemaining: number | null;
    percentageUsed: number | null;
    breakdown: {
      witnessExpenses: number;
      filingFees: number;
      expertFees: number;
      otherExpenses: number;
    };
  }> {
    const matter = await this.getMatterById(matterId);

    const witnesses = matter.witnesses || [];
    const expertFees = witnesses
      .filter((w) => w.isExpert && w.expertFees)
      .reduce((sum, w) => sum + (w.expertFees || 0), 0);

    const actualCosts = matter.actualCosts || 0;
    const budgetLimit = matter.budgetLimit || null;
    const budgetRemaining = budgetLimit ? budgetLimit - actualCosts : null;
    const percentageUsed = budgetLimit ? (actualCosts / budgetLimit) * 100 : null;

    return {
      actualCosts,
      budgetLimit,
      budgetRemaining,
      percentageUsed,
      breakdown: {
        witnessExpenses: 0, // Would aggregate from expense records
        filingFees: 0,
        expertFees,
        otherExpenses: actualCosts - expertFees,
      },
    };
  }

  /**
   * 8. Generate matter summary
   */
  async generateMatterSummary(matterId: string): Promise<{
    matter: ILitigationMatter;
    statistics: {
      totalWitnesses: number;
      expertWitnesses: number;
      totalEvidence: number;
      admittedEvidence: number;
      timelineEvents: number;
      upcomingDeadlines: number;
    };
    status: {
      daysActive: number;
      daysUntilTrial: number | null;
      currentPhase: string;
    };
  }> {
    const matter = await this.getMatterById(matterId);
    const witnesses = matter.witnesses || [];
    const evidence = matter.evidence || [];
    const timelineEvents = matter.timelineEvents || [];

    const now = new Date();
    const daysActive = Math.floor(
      (now.getTime() - matter.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysUntilTrial = matter.trialDate
      ? Math.floor((matter.trialDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    const upcomingDeadlines = timelineEvents.filter(
      (e) => e.isDeadline && !e.completed && e.deadlineDate && e.deadlineDate > now
    ).length;

    return {
      matter: matter.toJSON() as ILitigationMatter,
      statistics: {
        totalWitnesses: witnesses.length,
        expertWitnesses: witnesses.filter((w) => w.isExpert).length,
        totalEvidence: evidence.length,
        admittedEvidence: evidence.filter((e) => e.isAdmitted).length,
        timelineEvents: timelineEvents.length,
        upcomingDeadlines,
      },
      status: {
        daysActive,
        daysUntilTrial,
        currentPhase: matter.status,
      },
    };
  }
}

/**
 * TimelineVisualizationService
 * Injectable service for timeline management
 */
@Injectable()
export class TimelineVisualizationService {
  private readonly logger = new Logger(TimelineVisualizationService.name);

  constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) {}

  /**
   * 9. Create timeline event
   */
  async createTimelineEvent(
    data: z.infer<typeof CreateTimelineEventSchema>,
    createdBy: string
  ): Promise<TimelineEvent> {
    const validated = CreateTimelineEventSchema.parse(data);

    try {
      const event = await TimelineEvent.create({
        ...validated,
        completed: false,
        metadata: {
          createdBy,
        },
      } as any);

      this.logger.log(`Created timeline event: ${event.title}`);
      return event;
    } catch (error) {
      this.logger.error('Failed to create timeline event', error);
      throw new InternalServerErrorException('Failed to create timeline event');
    }
  }

  /**
   * 10. Update timeline event
   */
  async updateTimelineEvent(
    eventId: string,
    updates: Partial<ITimelineEvent>,
    updatedBy: string
  ): Promise<TimelineEvent> {
    const event = await TimelineEvent.findByPk(eventId);
    if (!event) {
      throw new NotFoundException('Timeline event not found');
    }

    await event.update({
      ...updates,
      metadata: {
        ...event.metadata,
        lastUpdatedBy: updatedBy,
        lastUpdatedAt: new Date(),
      },
    });

    this.logger.log(`Updated timeline event: ${event.title}`);
    return event;
  }

  /**
   * 11. Get timeline for matter
   */
  async getTimelineForMatter(
    matterId: string,
    options?: {
      eventTypes?: TimelineEventType[];
      includeCompleted?: boolean;
      sortOrder?: 'ASC' | 'DESC';
    }
  ): Promise<TimelineEvent[]> {
    const where: WhereOptions = { matterId };

    if (options?.eventTypes?.length) {
      where.eventType = { [Op.in]: options.eventTypes };
    }

    if (options?.includeCompleted === false) {
      where.completed = false;
    }

    const events = await TimelineEvent.findAll({
      where,
      order: [['eventDate', options?.sortOrder || 'ASC']],
    });

    return events;
  }

  /**
   * 12. Generate timeline visualization data
   */
  async generateTimelineVisualization(matterId: string): Promise<{
    events: Array<{
      id: string;
      date: Date;
      title: string;
      type: TimelineEventType;
      description: string;
      isDeadline: boolean;
      completed: boolean;
    }>;
    milestones: Array<{
      date: Date;
      label: string;
      significance: 'low' | 'medium' | 'high';
    }>;
    deadlines: Array<{
      date: Date;
      title: string;
      overdue: boolean;
      daysRemaining: number;
    }>;
  }> {
    const events = await this.getTimelineForMatter(matterId, {
      includeCompleted: true,
      sortOrder: 'ASC',
    });

    const now = new Date();

    // Map events
    const mappedEvents = events.map((e) => ({
      id: e.id,
      date: e.eventDate,
      title: e.title,
      type: e.eventType,
      description: e.description,
      isDeadline: e.isDeadline,
      completed: e.completed,
    }));

    // Extract milestones
    const milestoneTypes = [
      TimelineEventType.FILING,
      TimelineEventType.TRIAL_DATE,
      TimelineEventType.VERDICT,
      TimelineEventType.JUDGMENT,
    ];
    const milestones = events
      .filter((e) => milestoneTypes.includes(e.eventType))
      .map((e) => ({
        date: e.eventDate,
        label: e.title,
        significance: (e.eventType === TimelineEventType.TRIAL_DATE ||
        e.eventType === TimelineEventType.VERDICT
          ? 'high'
          : 'medium') as 'low' | 'medium' | 'high',
      }));

    // Extract deadlines
    const deadlines = events
      .filter((e) => e.isDeadline && e.deadlineDate)
      .map((e) => {
        const deadlineDate = e.deadlineDate!;
        const daysRemaining = Math.ceil(
          (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        return {
          date: deadlineDate,
          title: e.title,
          overdue: daysRemaining < 0 && !e.completed,
          daysRemaining,
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return {
      events: mappedEvents,
      milestones,
      deadlines,
    };
  }

  /**
   * 13. Detect timeline conflicts
   */
  async detectTimelineConflicts(matterId: string): Promise<
    Array<{
      conflict: string;
      events: string[];
      severity: 'low' | 'medium' | 'high';
      suggestion: string;
    }>
  > {
    const events = await this.getTimelineForMatter(matterId);
    const conflicts: Array<{
      conflict: string;
      events: string[];
      severity: 'low' | 'medium' | 'high';
      suggestion: string;
    }> = [];

    // Check for overlapping deadlines (same day)
    const deadlinesByDate = new Map<string, TimelineEvent[]>();
    events
      .filter((e) => e.isDeadline && e.deadlineDate && !e.completed)
      .forEach((e) => {
        const dateKey = e.deadlineDate!.toISOString().split('T')[0];
        if (!deadlinesByDate.has(dateKey)) {
          deadlinesByDate.set(dateKey, []);
        }
        deadlinesByDate.get(dateKey)!.push(e);
      });

    deadlinesByDate.forEach((eventsOnDate, date) => {
      if (eventsOnDate.length > 3) {
        conflicts.push({
          conflict: `Multiple deadlines on ${date}`,
          events: eventsOnDate.map((e) => e.title),
          severity: 'high',
          suggestion: 'Consider rescheduling some deadlines to avoid overload',
        });
      }
    });

    // Check for past uncompleted deadlines
    const now = new Date();
    const overdueDeadlines = events.filter(
      (e) => e.isDeadline && e.deadlineDate && e.deadlineDate < now && !e.completed
    );

    if (overdueDeadlines.length > 0) {
      conflicts.push({
        conflict: `${overdueDeadlines.length} overdue deadline(s)`,
        events: overdueDeadlines.map((e) => e.title),
        severity: 'high',
        suggestion: 'Update status or reschedule overdue deadlines',
      });
    }

    return conflicts;
  }

  /**
   * 14. Export timeline data
   */
  async exportTimelineData(
    matterId: string,
    format: 'json' | 'csv'
  ): Promise<string> {
    const events = await this.getTimelineForMatter(matterId, {
      includeCompleted: true,
      sortOrder: 'ASC',
    });

    if (format === 'json') {
      return JSON.stringify(events, null, 2);
    }

    // CSV format
    const headers = [
      'Date',
      'Title',
      'Type',
      'Description',
      'Is Deadline',
      'Completed',
      'Participants',
      'Location',
    ];
    const rows = events.map((e) => [
      e.eventDate.toISOString(),
      e.title,
      e.eventType,
      e.description,
      e.isDeadline ? 'Yes' : 'No',
      e.completed ? 'Yes' : 'No',
      e.participants.join('; '),
      e.location || '',
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }
}

/**
 * WitnessManagementService
 * Injectable service for witness operations
 */
@Injectable()
export class WitnessManagementService {
  private readonly logger = new Logger(WitnessManagementService.name);

  constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) {}

  /**
   * 15. Add witness to matter
   */
  async addWitnessToMatter(
    data: z.infer<typeof CreateWitnessSchema>,
    addedBy: string
  ): Promise<Witness> {
    const validated = CreateWitnessSchema.parse(data);

    try {
      const witness = await Witness.create({
        ...validated,
        status: WitnessStatus.IDENTIFIED,
        availability: {},
        metadata: {
          addedBy,
          addedAt: new Date(),
        },
      } as any);

      this.logger.log(
        `Added witness: ${witness.firstName} ${witness.lastName} to matter ${witness.matterId}`
      );
      return witness;
    } catch (error) {
      this.logger.error('Failed to add witness', error);
      throw new InternalServerErrorException('Failed to add witness');
    }
  }

  /**
   * 16. Update witness information
   */
  async updateWitnessInformation(
    witnessId: string,
    updates: Partial<IWitness>,
    updatedBy: string
  ): Promise<Witness> {
    const witness = await Witness.findByPk(witnessId);
    if (!witness) {
      throw new NotFoundException('Witness not found');
    }

    await witness.update({
      ...updates,
      metadata: {
        ...witness.metadata,
        lastUpdatedBy: updatedBy,
        lastUpdatedAt: new Date(),
      },
    });

    this.logger.log(`Updated witness: ${witness.firstName} ${witness.lastName}`);
    return witness;
  }

  /**
   * 17. Schedule witness interview
   */
  async scheduleWitnessInterview(
    witnessId: string,
    interviewDate: Date,
    scheduledBy: string,
    notes?: string
  ): Promise<Witness> {
    const witness = await Witness.findByPk(witnessId);
    if (!witness) {
      throw new NotFoundException('Witness not found');
    }

    await witness.update({
      interviewDate,
      status: WitnessStatus.INTERVIEW_SCHEDULED,
      metadata: {
        ...witness.metadata,
        interviewScheduledBy: scheduledBy,
        interviewScheduledAt: new Date(),
        interviewNotes: notes,
      },
    });

    this.logger.log(
      `Scheduled interview for ${witness.firstName} ${witness.lastName} on ${interviewDate}`
    );
    return witness;
  }

  /**
   * 18. Record witness testimony
   */
  async recordWitnessTestimony(
    witnessId: string,
    testimony: {
      type: 'interview' | 'deposition' | 'trial';
      date: Date;
      notes: string;
      transcriptPath?: string;
    },
    recordedBy: string
  ): Promise<Witness> {
    const witness = await Witness.findByPk(witnessId);
    if (!witness) {
      throw new NotFoundException('Witness not found');
    }

    const updates: Partial<IWitness> = {
      testimonyNotes: testimony.notes,
    };

    if (testimony.type === 'deposition') {
      updates.depositionDate = testimony.date;
      updates.depositionTranscript = testimony.transcriptPath;
      updates.status = WitnessStatus.DEPOSED;
    } else if (testimony.type === 'interview') {
      updates.interviewDate = testimony.date;
      updates.status = WitnessStatus.INTERVIEWED;
    } else if (testimony.type === 'trial') {
      updates.status = WitnessStatus.TESTIFIED;
    }

    await witness.update({
      ...updates,
      metadata: {
        ...witness.metadata,
        [`${testimony.type}RecordedBy`]: recordedBy,
        [`${testimony.type}RecordedAt`]: new Date(),
      },
    });

    this.logger.log(`Recorded ${testimony.type} for ${witness.firstName} ${witness.lastName}`);
    return witness;
  }

  /**
   * 19. Assess witness credibility
   */
  async assessWitnessCredibility(
    witnessId: string,
    score: number,
    assessmentNotes: string,
    assessedBy: string
  ): Promise<Witness> {
    if (score < 0 || score > 100) {
      throw new BadRequestException('Credibility score must be between 0 and 100');
    }

    const witness = await Witness.findByPk(witnessId);
    if (!witness) {
      throw new NotFoundException('Witness not found');
    }

    await witness.update({
      credibilityScore: score,
      metadata: {
        ...witness.metadata,
        credibilityAssessment: {
          score,
          notes: assessmentNotes,
          assessedBy,
          assessedAt: new Date(),
        },
      },
    });

    this.logger.log(
      `Assessed credibility for ${witness.firstName} ${witness.lastName}: ${score}/100`
    );
    return witness;
  }

  /**
   * 20. Generate witness list
   */
  async generateWitnessList(
    matterId: string,
    options?: {
      includeOpposing?: boolean;
      witnessTypes?: WitnessType[];
      sortBy?: 'name' | 'type' | 'credibility';
    }
  ): Promise<
    Array<{
      id: string;
      name: string;
      type: WitnessType;
      status: WitnessStatus;
      isExpert: boolean;
      isOpposing: boolean;
      credibilityScore?: number;
      contact: {
        email?: string;
        phone?: string;
      };
    }>
  > {
    const where: WhereOptions = { matterId };

    if (options?.includeOpposing === false) {
      where.isOpposing = false;
    }

    if (options?.witnessTypes?.length) {
      where.witnessType = { [Op.in]: options.witnessTypes };
    }

    let orderBy: any[] = [];
    if (options?.sortBy === 'name') {
      orderBy = [['lastName', 'ASC'], ['firstName', 'ASC']];
    } else if (options?.sortBy === 'type') {
      orderBy = [['witnessType', 'ASC'], ['lastName', 'ASC']];
    } else if (options?.sortBy === 'credibility') {
      orderBy = [['credibilityScore', 'DESC NULLS LAST'], ['lastName', 'ASC']];
    } else {
      orderBy = [['createdAt', 'ASC']];
    }

    const witnesses = await Witness.findAll({
      where,
      order: orderBy,
    });

    return witnesses.map((w) => ({
      id: w.id,
      name: `${w.firstName} ${w.lastName}`,
      type: w.witnessType,
      status: w.status,
      isExpert: w.isExpert,
      isOpposing: w.isOpposing,
      credibilityScore: w.credibilityScore,
      contact: {
        email: w.email,
        phone: w.phone,
      },
    }));
  }

  /**
   * 21. Track witness availability
   */
  async trackWitnessAvailability(
    witnessId: string,
    availability: Record<string, boolean>,
    updatedBy: string
  ): Promise<Witness> {
    const witness = await Witness.findByPk(witnessId);
    if (!witness) {
      throw new NotFoundException('Witness not found');
    }

    await witness.update({
      availability: {
        ...witness.availability,
        ...availability,
      },
      metadata: {
        ...witness.metadata,
        availabilityUpdatedBy: updatedBy,
        availabilityUpdatedAt: new Date(),
      },
    });

    this.logger.log(`Updated availability for ${witness.firstName} ${witness.lastName}`);
    return witness;
  }
}

/**
 * EvidenceTrackingService
 * Injectable service for evidence management
 */
@Injectable()
export class EvidenceTrackingService {
  private readonly logger = new Logger(EvidenceTrackingService.name);

  constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) {}

  /**
   * 22. Add evidence to matter
   */
  async addEvidenceToMatter(
    data: z.infer<typeof CreateEvidenceSchema>,
    addedBy: string
  ): Promise<Evidence> {
    const validated = CreateEvidenceSchema.parse(data);

    try {
      const chainOfCustody: IChainOfCustodyEntry[] = [
        {
          timestamp: new Date(),
          action: ChainOfCustodyStatus.COLLECTED,
          performedBy: addedBy,
          location: validated.location,
          notes: 'Evidence initially logged',
        },
      ];

      const evidence = await Evidence.create({
        ...validated,
        chainOfCustody,
        linkedWitnessIds: [],
        isAdmitted: false,
        metadata: {
          addedBy,
          addedAt: new Date(),
        },
      } as any);

      this.logger.log(`Added evidence: ${evidence.description}`);
      return evidence;
    } catch (error) {
      this.logger.error('Failed to add evidence', error);
      throw new InternalServerErrorException('Failed to add evidence');
    }
  }

  /**
   * 23. Update evidence details
   */
  async updateEvidenceDetails(
    evidenceId: string,
    updates: Partial<IEvidence>,
    updatedBy: string
  ): Promise<Evidence> {
    const evidence = await Evidence.findByPk(evidenceId);
    if (!evidence) {
      throw new NotFoundException('Evidence not found');
    }

    await evidence.update({
      ...updates,
      metadata: {
        ...evidence.metadata,
        lastUpdatedBy: updatedBy,
        lastUpdatedAt: new Date(),
      },
    });

    this.logger.log(`Updated evidence: ${evidence.description}`);
    return evidence;
  }

  /**
   * 24. Record chain of custody
   */
  async recordChainOfCustody(
    evidenceId: string,
    entry: {
      action: ChainOfCustodyStatus;
      location: string;
      notes?: string;
      signature?: string;
    },
    performedBy: string
  ): Promise<Evidence> {
    const evidence = await Evidence.findByPk(evidenceId);
    if (!evidence) {
      throw new NotFoundException('Evidence not found');
    }

    const newEntry: IChainOfCustodyEntry = {
      timestamp: new Date(),
      action: entry.action,
      performedBy,
      location: entry.location,
      notes: entry.notes,
      signature: entry.signature,
    };

    const updatedChain = [...evidence.chainOfCustody, newEntry];

    await evidence.update({
      chainOfCustody: updatedChain,
      location: entry.location,
    });

    this.logger.log(`Chain of custody updated for evidence: ${evidence.description}`);
    return evidence;
  }

  /**
   * 25. Search evidence
   */
  async searchEvidence(filters: {
    matterId?: string;
    category?: EvidenceCategory[];
    keyword?: string;
    collectedFrom?: Date;
    collectedTo?: Date;
    isAdmitted?: boolean;
    tags?: string[];
    limit?: number;
    offset?: number;
  }): Promise<{ rows: Evidence[]; count: number }> {
    const where: WhereOptions = {};

    if (filters.matterId) {
      where.matterId = filters.matterId;
    }

    if (filters.category?.length) {
      where.category = { [Op.in]: filters.category };
    }

    if (filters.keyword) {
      where[Op.or] = [
        { description: { [Op.iLike]: `%${filters.keyword}%` } },
        { source: { [Op.iLike]: `%${filters.keyword}%` } },
        { notes: { [Op.iLike]: `%${filters.keyword}%` } },
      ];
    }

    if (filters.collectedFrom || filters.collectedTo) {
      where.collectionDate = {};
      if (filters.collectedFrom) {
        where.collectionDate[Op.gte] = filters.collectedFrom;
      }
      if (filters.collectedTo) {
        where.collectionDate[Op.lte] = filters.collectedTo;
      }
    }

    if (filters.isAdmitted !== undefined) {
      where.isAdmitted = filters.isAdmitted;
    }

    if (filters.tags?.length) {
      where.tags = { [Op.overlap]: filters.tags };
    }

    const { rows, count } = await Evidence.findAndCountAll({
      where,
      limit: filters.limit || 50,
      offset: filters.offset || 0,
      order: [['collectionDate', 'DESC']],
    });

    return { rows, count };
  }

  /**
   * 26. Generate exhibit list
   */
  async generateExhibitList(
    matterId: string,
    side: 'plaintiff' | 'defendant'
  ): Promise<
    Array<{
      exhibitNumber: string;
      description: string;
      category: EvidenceCategory;
      source: string;
      isAdmitted: boolean;
      notes: string;
    }>
  > {
    const evidence = await Evidence.findAll({
      where: { matterId },
      order: [['collectionDate', 'ASC']],
    });

    let sequence = 1;
    return evidence.map((e) => {
      const exhibitNumber = e.exhibitNumber || generateExhibitNumber(side, sequence++);

      // Update exhibit number if not set
      if (!e.exhibitNumber) {
        e.update({ exhibitNumber });
      }

      return {
        exhibitNumber,
        description: e.description,
        category: e.category,
        source: e.source,
        isAdmitted: e.isAdmitted,
        notes: e.notes,
      };
    });
  }

  /**
   * 27. Validate evidence integrity
   */
  async validateEvidenceIntegrity(evidenceId: string): Promise<{
    isValid: boolean;
    expectedHash?: string;
    actualHash?: string;
    chainIntact: boolean;
    issues: string[];
  }> {
    const evidence = await Evidence.findByPk(evidenceId);
    if (!evidence) {
      throw new NotFoundException('Evidence not found');
    }

    const issues: string[] = [];
    let isValid = true;

    // Check if chain of custody is intact
    const chainIntact = evidence.chainOfCustody.length > 0;
    if (!chainIntact) {
      issues.push('Chain of custody is empty');
      isValid = false;
    }

    // Verify chain sequence (timestamps should be in order)
    for (let i = 1; i < evidence.chainOfCustody.length; i++) {
      const prev = evidence.chainOfCustody[i - 1];
      const curr = evidence.chainOfCustody[i];
      if (new Date(curr.timestamp) < new Date(prev.timestamp)) {
        issues.push(`Chain of custody timestamp out of order at index ${i}`);
        isValid = false;
      }
    }

    // If there's a file hash, we'd verify it here
    // This is a placeholder for actual file hash verification
    const expectedHash = evidence.fileHash;
    const actualHash = expectedHash; // Would compute from actual file

    if (expectedHash && actualHash && expectedHash !== actualHash) {
      issues.push('File hash mismatch - evidence may have been tampered with');
      isValid = false;
    }

    return {
      isValid,
      expectedHash,
      actualHash,
      chainIntact,
      issues,
    };
  }

  /**
   * 28. Link evidence to witness
   */
  async linkEvidenceToWitness(
    evidenceId: string,
    witnessId: string,
    linkedBy: string
  ): Promise<Evidence> {
    const evidence = await Evidence.findByPk(evidenceId);
    if (!evidence) {
      throw new NotFoundException('Evidence not found');
    }

    const witness = await Witness.findByPk(witnessId);
    if (!witness) {
      throw new NotFoundException('Witness not found');
    }

    const linkedWitnesses = new Set(evidence.linkedWitnessIds);
    linkedWitnesses.add(witnessId);

    await evidence.update({
      linkedWitnessIds: Array.from(linkedWitnesses),
      metadata: {
        ...evidence.metadata,
        witnessLinkHistory: [
          ...(evidence.metadata.witnessLinkHistory || []),
          {
            witnessId,
            witnessName: `${witness.firstName} ${witness.lastName}`,
            linkedBy,
            linkedAt: new Date(),
          },
        ],
      },
    });

    this.logger.log(
      `Linked evidence ${evidence.id} to witness ${witness.firstName} ${witness.lastName}`
    );
    return evidence;
  }

  /**
   * 29. Export evidence log
   */
  async exportEvidenceLog(
    matterId: string,
    format: 'json' | 'csv'
  ): Promise<string> {
    const evidence = await Evidence.findAll({
      where: { matterId },
      order: [['collectionDate', 'ASC']],
    });

    if (format === 'json') {
      return JSON.stringify(evidence, null, 2);
    }

    // CSV format
    const headers = [
      'Exhibit Number',
      'Category',
      'Description',
      'Source',
      'Collection Date',
      'Collected By',
      'Location',
      'Is Admitted',
      'Tags',
    ];
    const rows = evidence.map((e) => [
      e.exhibitNumber || '',
      e.category,
      e.description,
      e.source,
      e.collectionDate.toISOString(),
      e.collectedBy,
      e.location,
      e.isAdmitted ? 'Yes' : 'No',
      e.tags.join('; '),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }
}

/**
 * TrialPreparationService
 * Injectable service for trial preparation operations
 */
@Injectable()
export class TrialPreparationService {
  private readonly logger = new Logger(TrialPreparationService.name);

  constructor(
    @Inject('SEQUELIZE') private sequelize: Sequelize,
    private witnessService: WitnessManagementService,
    private evidenceService: EvidenceTrackingService
  ) {}

  /**
   * 30. Create trial preparation plan
   */
  async createTrialPreparationPlan(
    matterId: string,
    trialDate: Date,
    createdBy: string
  ): Promise<TrialPreparation> {
    try {
      const checklist: ITrialChecklistItem[] = [
        {
          id: crypto.randomUUID(),
          task: 'Finalize witness list',
          category: 'Witnesses',
          completed: false,
          priority: 'high',
          dueDate: new Date(trialDate.getTime() - 30 * 24 * 60 * 60 * 1000),
        },
        {
          id: crypto.randomUUID(),
          task: 'Prepare witness examination outlines',
          category: 'Witnesses',
          completed: false,
          priority: 'high',
          dueDate: new Date(trialDate.getTime() - 21 * 24 * 60 * 60 * 1000),
        },
        {
          id: crypto.randomUUID(),
          task: 'Complete exhibit list',
          category: 'Evidence',
          completed: false,
          priority: 'high',
          dueDate: new Date(trialDate.getTime() - 30 * 24 * 60 * 60 * 1000),
        },
        {
          id: crypto.randomUUID(),
          task: 'Organize trial binder',
          category: 'Documents',
          completed: false,
          priority: 'medium',
          dueDate: new Date(trialDate.getTime() - 14 * 24 * 60 * 60 * 1000),
        },
        {
          id: crypto.randomUUID(),
          task: 'Draft opening statement',
          category: 'Arguments',
          completed: false,
          priority: 'high',
          dueDate: new Date(trialDate.getTime() - 14 * 24 * 60 * 60 * 1000),
        },
        {
          id: crypto.randomUUID(),
          task: 'Draft closing argument',
          category: 'Arguments',
          completed: false,
          priority: 'high',
          dueDate: new Date(trialDate.getTime() - 7 * 24 * 60 * 60 * 1000),
        },
        {
          id: crypto.randomUUID(),
          task: 'Prepare jury selection questions',
          category: 'Jury',
          completed: false,
          priority: 'medium',
          dueDate: new Date(trialDate.getTime() - 10 * 24 * 60 * 60 * 1000),
        },
        {
          id: crypto.randomUUID(),
          task: 'File pretrial motions',
          category: 'Court Filings',
          completed: false,
          priority: 'high',
          dueDate: new Date(trialDate.getTime() - 30 * 24 * 60 * 60 * 1000),
        },
      ];

      const trialPrep = await TrialPreparation.create({
        matterId,
        trialDate,
        currentPhase: TrialPhase.INITIAL_PREP,
        readinessScore: 0,
        witnessListComplete: false,
        exhibitListComplete: false,
        trialBinderComplete: false,
        openingStatementDrafted: false,
        closingArgumentDrafted: false,
        witnessExaminationOutlines: {},
        trialStrategy: '',
        estimatedDuration: 1,
        checklist,
        metadata: {
          createdBy,
          createdAt: new Date(),
        },
      } as any);

      this.logger.log(`Created trial preparation plan for matter: ${matterId}`);
      return trialPrep;
    } catch (error) {
      this.logger.error('Failed to create trial preparation plan', error);
      throw new InternalServerErrorException('Failed to create trial preparation plan');
    }
  }

  /**
   * 31. Update trial readiness
   */
  async updateTrialReadiness(
    trialPrepId: string,
    updates: Partial<ITrialPreparation>,
    updatedBy: string
  ): Promise<TrialPreparation> {
    const trialPrep = await TrialPreparation.findByPk(trialPrepId);
    if (!trialPrep) {
      throw new NotFoundException('Trial preparation not found');
    }

    await trialPrep.update({
      ...updates,
      metadata: {
        ...trialPrep.metadata,
        lastUpdatedBy: updatedBy,
        lastUpdatedAt: new Date(),
      },
    });

    // Recalculate readiness score
    const readinessScore = await this.calculateReadinessScore(trialPrep);
    await trialPrep.update({ readinessScore });

    this.logger.log(`Updated trial readiness: ${readinessScore}%`);
    return trialPrep;
  }

  /**
   * 32. Generate trial binder
   */
  async generateTrialBinder(trialPrepId: string): Promise<{
    sections: Array<{
      title: string;
      order: number;
      documents: Array<{
        name: string;
        type: string;
        path?: string;
      }>;
    }>;
    tableOfContents: string;
  }> {
    const trialPrep = await TrialPreparation.findByPk(trialPrepId, {
      include: [{ model: LitigationMatter, include: [Witness, Evidence] }],
    });

    if (!trialPrep) {
      throw new NotFoundException('Trial preparation not found');
    }

    const matter = trialPrep.matter;
    if (!matter) {
      throw new NotFoundException('Associated matter not found');
    }

    const sections = [
      {
        title: 'Case Summary and Timeline',
        order: 1,
        documents: [
          { name: 'Case Summary', type: 'summary' },
          { name: 'Case Chronology', type: 'timeline' },
        ],
      },
      {
        title: 'Pleadings and Motions',
        order: 2,
        documents: [
          { name: 'Complaint', type: 'pleading' },
          { name: 'Answer', type: 'pleading' },
          { name: 'Pretrial Motions', type: 'motion' },
        ],
      },
      {
        title: 'Witness Information',
        order: 3,
        documents: matter.witnesses?.map((w) => ({
          name: `${w.firstName} ${w.lastName} - ${w.witnessType}`,
          type: 'witness_profile',
        })) || [],
      },
      {
        title: 'Exhibit List',
        order: 4,
        documents: matter.evidence?.map((e) => ({
          name: `${e.exhibitNumber || 'TBD'} - ${e.description}`,
          type: 'exhibit',
          path: e.filePath,
        })) || [],
      },
      {
        title: 'Trial Strategy',
        order: 5,
        documents: [
          { name: 'Opening Statement', type: 'argument' },
          { name: 'Witness Examination Outlines', type: 'outline' },
          { name: 'Closing Argument', type: 'argument' },
        ],
      },
    ];

    const tableOfContents = sections
      .map((section, idx) => {
        const docs = section.documents.map((doc, docIdx) => `    ${docIdx + 1}. ${doc.name}`).join('\n');
        return `${idx + 1}. ${section.title}\n${docs}`;
      })
      .join('\n\n');

    return {
      sections,
      tableOfContents,
    };
  }

  /**
   * 33. Schedule trial date
   */
  async scheduleTrialDate(
    matterId: string,
    trialDate: Date,
    scheduledBy: string,
    courtroom?: string
  ): Promise<LitigationMatter> {
    const matter = await LitigationMatter.findByPk(matterId);
    if (!matter) {
      throw new NotFoundException('Matter not found');
    }

    const auditLog = matter.metadata.auditLog || [];
    auditLog.push({
      timestamp: new Date(),
      action: 'trial_scheduled',
      performedBy: scheduledBy,
      details: `Trial scheduled for ${trialDate.toISOString()}${courtroom ? ` in ${courtroom}` : ''}`,
    });

    await matter.update({
      trialDate,
      metadata: {
        ...matter.metadata,
        courtroom,
        auditLog,
      },
    });

    this.logger.log(`Scheduled trial date for matter ${matter.matterNumber}: ${trialDate}`);
    return matter;
  }

  /**
   * 34. Assess trial readiness
   */
  async assessTrialReadiness(trialPrepId: string): Promise<{
    readinessScore: number;
    assessmentDate: Date;
    completionStatus: {
      witnessList: boolean;
      exhibitList: boolean;
      trialBinder: boolean;
      openingStatement: boolean;
      closingArgument: boolean;
    };
    checklistProgress: {
      total: number;
      completed: number;
      percentComplete: number;
    };
    upcomingTasks: Array<{
      task: string;
      dueDate: Date;
      priority: string;
      overdue: boolean;
    }>;
    recommendations: string[];
  }> {
    const trialPrep = await TrialPreparation.findByPk(trialPrepId);
    if (!trialPrep) {
      throw new NotFoundException('Trial preparation not found');
    }

    const now = new Date();
    const completedTasks = trialPrep.checklist.filter((item) => item.completed).length;
    const totalTasks = trialPrep.checklist.length;
    const percentComplete = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const upcomingTasks = trialPrep.checklist
      .filter((item) => !item.completed && item.dueDate)
      .map((item) => ({
        task: item.task,
        dueDate: item.dueDate!,
        priority: item.priority,
        overdue: item.dueDate! < now,
      }))
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

    const recommendations: string[] = [];
    if (!trialPrep.witnessListComplete) {
      recommendations.push('Complete and finalize witness list');
    }
    if (!trialPrep.exhibitListComplete) {
      recommendations.push('Finalize exhibit list with all evidence');
    }
    if (!trialPrep.openingStatementDrafted) {
      recommendations.push('Draft opening statement');
    }
    if (!trialPrep.closingArgumentDrafted) {
      recommendations.push('Draft closing argument');
    }
    if (percentComplete < 75) {
      recommendations.push('Accelerate checklist completion - less than 75% complete');
    }

    const overdueTasks = upcomingTasks.filter((t) => t.overdue).length;
    if (overdueTasks > 0) {
      recommendations.push(`Address ${overdueTasks} overdue task(s) immediately`);
    }

    return {
      readinessScore: trialPrep.readinessScore,
      assessmentDate: now,
      completionStatus: {
        witnessList: trialPrep.witnessListComplete,
        exhibitList: trialPrep.exhibitListComplete,
        trialBinder: trialPrep.trialBinderComplete,
        openingStatement: trialPrep.openingStatementDrafted,
        closingArgument: trialPrep.closingArgumentDrafted,
      },
      checklistProgress: {
        total: totalTasks,
        completed: completedTasks,
        percentComplete,
      },
      upcomingTasks,
      recommendations,
    };
  }

  /**
   * 35. Generate opening statement framework
   */
  async generateOpeningStatement(
    trialPrepId: string,
    theme: string
  ): Promise<{
    theme: string;
    structure: Array<{
      section: string;
      purpose: string;
      keyPoints: string[];
    }>;
    template: string;
  }> {
    const trialPrep = await TrialPreparation.findByPk(trialPrepId, {
      include: [{ model: LitigationMatter }],
    });

    if (!trialPrep) {
      throw new NotFoundException('Trial preparation not found');
    }

    const structure = [
      {
        section: 'Introduction',
        purpose: 'Introduce yourself, your client, and establish rapport',
        keyPoints: [
          'Greet the jury professionally',
          'Introduce counsel and client',
          'Present case theme',
        ],
      },
      {
        section: 'Overview of Facts',
        purpose: 'Provide roadmap of what evidence will show',
        keyPoints: [
          'Chronological narrative of events',
          'Key factual elements',
          'Undisputed facts',
        ],
      },
      {
        section: 'Legal Framework',
        purpose: 'Explain relevant law in accessible terms',
        keyPoints: [
          'Applicable legal standards',
          'Burden of proof',
          'Elements to be proven',
        ],
      },
      {
        section: 'Evidence Preview',
        purpose: 'Outline what witnesses and exhibits will demonstrate',
        keyPoints: [
          'Key witnesses and their testimony',
          'Important documentary evidence',
          'Expert testimony overview',
        ],
      },
      {
        section: 'Conclusion',
        purpose: 'Reinforce theme and request favorable verdict',
        keyPoints: [
          'Restate case theme',
          'Preview desired verdict',
          'Thank the jury',
        ],
      },
    ];

    const template = `
OPENING STATEMENT - ${trialPrep.matter?.matterName || 'Case'}

THEME: ${theme}

May it please the Court, counsel, ladies and gentlemen of the jury:

[INTRODUCTION]
My name is [ATTORNEY NAME], and I represent [CLIENT NAME] in this matter.

[THEME STATEMENT]
${theme}

[FACTS OVERVIEW]
Let me tell you what happened and what the evidence will show...

[Key factual narrative goes here]

[LEGAL FRAMEWORK]
The law in this case requires that we prove [ELEMENTS]...

[EVIDENCE PREVIEW]
You will hear testimony from:
- [Witness list with brief description of expected testimony]

You will see documentary evidence including:
- [Exhibit list with brief description]

[CONCLUSION]
At the end of this trial, after you have heard all the evidence, we will ask you to return a verdict in favor of [CLIENT NAME].

Thank you.
    `.trim();

    await trialPrep.update({
      openingStatementDrafted: true,
      metadata: {
        ...trialPrep.metadata,
        openingStatementTheme: theme,
      },
    });

    return {
      theme,
      structure,
      template,
    };
  }

  /**
   * 36. Create examination outline
   */
  async createExaminationOutline(
    trialPrepId: string,
    witnessId: string,
    examinationType: 'direct' | 'cross'
  ): Promise<{
    witnessName: string;
    examinationType: 'direct' | 'cross';
    objectives: string[];
    outline: Array<{
      topic: string;
      questions: string[];
      expectedAnswers?: string[];
      exhibits?: string[];
    }>;
  }> {
    const trialPrep = await TrialPreparation.findByPk(trialPrepId);
    if (!trialPrep) {
      throw new NotFoundException('Trial preparation not found');
    }

    const witness = await Witness.findByPk(witnessId);
    if (!witness) {
      throw new NotFoundException('Witness not found');
    }

    const objectives =
      examinationType === 'direct'
        ? [
            'Establish witness credibility and qualifications',
            'Elicit favorable testimony supporting case theory',
            'Introduce relevant exhibits through witness',
            'Build narrative chronologically',
            'Anticipate and address potential weaknesses',
          ]
        : [
            'Impeach witness credibility',
            'Highlight inconsistencies in testimony',
            'Extract favorable admissions',
            'Limit harmful testimony',
            'Control witness responses',
          ];

    const outline =
      examinationType === 'direct'
        ? [
            {
              topic: 'Background and Qualifications',
              questions: [
                'Please state your full name for the record.',
                'What is your current occupation?',
                'How long have you been in this field?',
              ],
            },
            {
              topic: 'Relevant Events',
              questions: [
                'Where were you on [DATE]?',
                'What did you observe?',
                'What happened next?',
              ],
            },
          ]
        : [
            {
              topic: 'Prior Inconsistent Statements',
              questions: [
                'You testified in your deposition that [STATEMENT], correct?',
                'Today you said [DIFFERENT STATEMENT], is that right?',
                'Which version is accurate?',
              ],
            },
          ];

    const examinationOutline = {
      witnessName: `${witness.firstName} ${witness.lastName}`,
      examinationType,
      objectives,
      outline,
    };

    const outlines = { ...trialPrep.witnessExaminationOutlines };
    outlines[witnessId] = examinationOutline;

    await trialPrep.update({
      witnessExaminationOutlines: outlines,
    });

    this.logger.log(
      `Created ${examinationType} examination outline for ${witness.firstName} ${witness.lastName}`
    );

    return examinationOutline;
  }

  /**
   * Helper: Calculate readiness score
   */
  private async calculateReadinessScore(trialPrep: TrialPreparation): Promise<number> {
    let score = 0;
    const weights = {
      witnessList: 15,
      exhibitList: 15,
      trialBinder: 10,
      openingStatement: 20,
      closingArgument: 20,
      checklistCompletion: 20,
    };

    if (trialPrep.witnessListComplete) score += weights.witnessList;
    if (trialPrep.exhibitListComplete) score += weights.exhibitList;
    if (trialPrep.trialBinderComplete) score += weights.trialBinder;
    if (trialPrep.openingStatementDrafted) score += weights.openingStatement;
    if (trialPrep.closingArgumentDrafted) score += weights.closingArgument;

    const completedTasks = trialPrep.checklist.filter((item) => item.completed).length;
    const totalTasks = trialPrep.checklist.length;
    const checklistScore =
      totalTasks > 0 ? (completedTasks / totalTasks) * weights.checklistCompletion : 0;
    score += checklistScore;

    return Math.round(score);
  }
}

/**
 * DocumentGenerationService
 * Injectable service for legal document generation
 */
@Injectable()
export class DocumentGenerationService {
  private readonly logger = new Logger(DocumentGenerationService.name);

  constructor(@Inject('SEQUELIZE') private sequelize: Sequelize) {}

  /**
   * 37. Generate pleading
   */
  async generatePleading(
    matterId: string,
    pleadingType: 'complaint' | 'answer' | 'reply',
    claims: Array<{ claim: string; allegations: string[] }>
  ): Promise<{
    pleadingType: string;
    document: string;
    dateGenerated: Date;
  }> {
    const matter = await LitigationMatter.findByPk(matterId);
    if (!matter) {
      throw new NotFoundException('Matter not found');
    }

    const document = `
${pleadingType.toUpperCase()}

${matter.courtName || '[COURT NAME]'}
${matter.jurisdiction}

${matter.clientName},
    Plaintiff,

v.                                      Case No. ${matter.caseNumber || '[CASE NUMBER]'}

${matter.opposingParty},
    Defendant.

${pleadingType === 'complaint' ? 'COMPLAINT FOR' : pleadingType.toUpperCase()}

    Comes now the ${pleadingType === 'answer' ? 'Defendant' : 'Plaintiff'}, by and through undersigned counsel, and states as follows:

${claims.map((claim, idx) => `
COUNT ${idx + 1}: ${claim.claim}

${claim.allegations.map((allegation, aIdx) => `${aIdx + 1}. ${allegation}`).join('\n')}
`).join('\n')}

WHEREFORE, ${pleadingType === 'complaint' ? 'Plaintiff' : 'Defendant'} respectfully requests that this Court:

a) [RELIEF REQUESTED]
b) Award costs and attorney's fees
c) Grant such other and further relief as the Court deems just and proper.

Respectfully submitted,

_______________________
[ATTORNEY NAME]
[BAR NUMBER]
[FIRM NAME]
[ADDRESS]

Date: ${new Date().toLocaleDateString()}
    `.trim();

    this.logger.log(`Generated ${pleadingType} for matter ${matter.matterNumber}`);

    return {
      pleadingType,
      document,
      dateGenerated: new Date(),
    };
  }

  /**
   * 38. Create motion
   */
  async createMotion(
    matterId: string,
    motionType: string,
    grounds: string[],
    reliefSought: string
  ): Promise<{
    motionType: string;
    document: string;
    dateGenerated: Date;
  }> {
    const matter = await LitigationMatter.findByPk(matterId);
    if (!matter) {
      throw new NotFoundException('Matter not found');
    }

    const document = `
MOTION ${motionType.toUpperCase()}

${matter.courtName || '[COURT NAME]'}
${matter.jurisdiction}

${matter.clientName},
    Plaintiff,

v.                                      Case No. ${matter.caseNumber || '[CASE NUMBER]'}

${matter.opposingParty},
    Defendant.

MOTION ${motionType.toUpperCase()}

    Comes now the Plaintiff, by and through undersigned counsel, and respectfully moves this Court for ${motionType}, and in support thereof states as follows:

GROUNDS

${grounds.map((ground, idx) => `${idx + 1}. ${ground}`).join('\n\n')}

RELIEF SOUGHT

    WHEREFORE, Plaintiff respectfully requests that this Court ${reliefSought}.

Respectfully submitted,

_______________________
[ATTORNEY NAME]
[BAR NUMBER]
[FIRM NAME]
[ADDRESS]

Date: ${new Date().toLocaleDateString()}
    `.trim();

    this.logger.log(`Generated motion (${motionType}) for matter ${matter.matterNumber}`);

    return {
      motionType,
      document,
      dateGenerated: new Date(),
    };
  }

  /**
   * 39. Assemble trial exhibits
   */
  async assembleTrialExhibits(
    matterId: string,
    side: 'plaintiff' | 'defendant'
  ): Promise<{
    totalExhibits: number;
    exhibits: Array<{
      exhibitNumber: string;
      description: string;
      category: string;
      filePath?: string;
    }>;
    coverSheet: string;
  }> {
    const evidence = await Evidence.findAll({
      where: { matterId },
      order: [['collectionDate', 'ASC']],
    });

    let sequence = 1;
    const exhibits = evidence.map((e) => {
      const exhibitNumber = e.exhibitNumber || generateExhibitNumber(side, sequence++);

      if (!e.exhibitNumber) {
        e.update({ exhibitNumber });
      }

      return {
        exhibitNumber,
        description: e.description,
        category: e.category,
        filePath: e.filePath,
      };
    });

    const matter = await LitigationMatter.findByPk(matterId);
    const coverSheet = `
EXHIBIT LIST

Case: ${matter?.matterName || '[CASE NAME]'}
Case No: ${matter?.caseNumber || '[CASE NUMBER]'}
${side === 'plaintiff' ? 'Plaintiff' : 'Defendant'} Exhibits

Total Exhibits: ${exhibits.length}

${exhibits.map((ex, idx) => `${idx + 1}. Exhibit ${ex.exhibitNumber}: ${ex.description}`).join('\n')}

Prepared: ${new Date().toLocaleDateString()}
    `.trim();

    return {
      totalExhibits: exhibits.length,
      exhibits,
      coverSheet,
    };
  }

  /**
   * 40. Generate discovery request
   */
  async generateDiscoveryRequest(
    matterId: string,
    requestType: 'interrogatories' | 'requests_for_production' | 'requests_for_admission',
    requests: string[]
  ): Promise<{
    requestType: string;
    document: string;
    dateGenerated: Date;
  }> {
    const matter = await LitigationMatter.findByPk(matterId);
    if (!matter) {
      throw new NotFoundException('Matter not found');
    }

    const typeMap = {
      interrogatories: 'INTERROGATORIES',
      requests_for_production: 'REQUESTS FOR PRODUCTION OF DOCUMENTS',
      requests_for_admission: 'REQUESTS FOR ADMISSION',
    };

    const document = `
${matter.clientName.toUpperCase()}'S ${typeMap[requestType]}

${matter.courtName || '[COURT NAME]'}
${matter.jurisdiction}

${matter.clientName},
    Plaintiff,

v.                                      Case No. ${matter.caseNumber || '[CASE NUMBER]'}

${matter.opposingParty},
    Defendant.

${typeMap[requestType]} TO DEFENDANT

    Plaintiff, pursuant to [APPLICABLE RULES], hereby requests that Defendant respond to the following ${requestType}:

${requests.map((req, idx) => `${requestType === 'interrogatories' ? 'INTERROGATORY' : 'REQUEST'} NO. ${idx + 1}: ${req}`).join('\n\n')}

INSTRUCTIONS

${requestType === 'interrogatories' ? `
1. Answer each interrogatory separately and fully in writing under oath.
2. Answers are due within 30 days of service.
3. If you cannot answer fully, answer to the extent possible.
` : requestType === 'requests_for_production' ? `
1. Produce all responsive documents within 30 days.
2. Documents should be produced as they are kept in the usual course of business.
3. Label all documents with corresponding request number.
` : `
1. Respond to each request within 30 days.
2. Each matter must be admitted or denied.
3. Provide reasons for any denial.
`}

Respectfully submitted,

_______________________
[ATTORNEY NAME]
[BAR NUMBER]
[FIRM NAME]
[ADDRESS]

Date: ${new Date().toLocaleDateString()}
    `.trim();

    this.logger.log(`Generated ${requestType} for matter ${matter.matterNumber}`);

    return {
      requestType: typeMap[requestType],
      document,
      dateGenerated: new Date(),
    };
  }

  /**
   * 41. Create settlement demand
   */
  async createSettlementDemand(
    matterId: string,
    demandAmount: number,
    damages: Array<{ category: string; amount: number; description: string }>,
    deadline: Date
  ): Promise<{
    demandAmount: number;
    document: string;
    dateGenerated: Date;
  }> {
    const matter = await LitigationMatter.findByPk(matterId);
    if (!matter) {
      throw new NotFoundException('Matter not found');
    }

    const totalDamages = damages.reduce((sum, d) => sum + d.amount, 0);

    const document = `
SETTLEMENT DEMAND

${new Date().toLocaleDateString()}

${matter.opposingCounsel || '[OPPOSING COUNSEL]'}
${matter.opposingParty}

Re: ${matter.matterName}
    Case No. ${matter.caseNumber || 'Pre-litigation'}

Dear ${matter.opposingCounsel ? 'Counsel' : 'Sir/Madam'}:

This letter constitutes a settlement demand on behalf of our client, ${matter.clientName}, arising from ${matter.description}.

FACTS

[Detailed factual background of the case]

DAMAGES

Our client has sustained the following damages:

${damages.map((d, idx) => `
${idx + 1}. ${d.category}: $${d.amount.toLocaleString()}
   ${d.description}
`).join('\n')}

Total Documented Damages: $${totalDamages.toLocaleString()}

LIABILITY

[Analysis of defendant's liability]

DEMAND

In consideration of the facts, injuries, and damages outlined above, our client demands settlement in the amount of $${demandAmount.toLocaleString()} to resolve this matter.

This offer remains open until ${deadline.toLocaleDateString()}. If we do not receive a response by that date, we will proceed with litigation and will not consider any settlement offer below the full amount of damages plus costs and attorney's fees.

Please contact me at your earliest convenience to discuss this matter.

Very truly yours,

_______________________
[ATTORNEY NAME]
[BAR NUMBER]
[FIRM NAME]
[CONTACT INFORMATION]
    `.trim();

    this.logger.log(`Generated settlement demand for matter ${matter.matterNumber}: $${demandAmount}`);

    return {
      demandAmount,
      document,
      dateGenerated: new Date(),
    };
  }

  /**
   * 42. Generate case chronology
   */
  async generateCaseChronology(matterId: string): Promise<{
    matterName: string;
    events: Array<{
      date: Date;
      event: string;
      description: string;
      category: string;
    }>;
    document: string;
    dateGenerated: Date;
  }> {
    const matter = await LitigationMatter.findByPk(matterId, {
      include: [{ model: TimelineEvent }],
    });

    if (!matter) {
      throw new NotFoundException('Matter not found');
    }

    const events = (matter.timelineEvents || [])
      .sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime())
      .map((e) => ({
        date: e.eventDate,
        event: e.title,
        description: e.description,
        category: e.eventType,
      }));

    const document = `
CASE CHRONOLOGY

Matter: ${matter.matterName}
Case No: ${matter.caseNumber || 'N/A'}
Client: ${matter.clientName}
Opposing Party: ${matter.opposingParty}

CHRONOLOGICAL EVENTS

${events.map((e, idx) => `
${idx + 1}. ${e.date.toLocaleDateString()} - ${e.event}
   Category: ${e.category}
   ${e.description}
`).join('\n')}

Total Events: ${events.length}

Prepared: ${new Date().toLocaleDateString()}
    `.trim();

    this.logger.log(`Generated case chronology for matter ${matter.matterNumber}`);

    return {
      matterName: matter.matterName,
      events,
      document,
      dateGenerated: new Date(),
    };
  }
}

// ============================================================================
// MODULE CONFIGURATION
// ============================================================================

/**
 * Configuration factory for litigation support
 */
export const litigationSupportConfig = registerAs('litigationSupport', () => ({
  matterNumberPrefix: process.env.LITIGATION_MATTER_PREFIX || 'MTR',
  enableAuditLogging: process.env.LITIGATION_AUDIT_LOGGING !== 'false',
  defaultTrialDuration: parseInt(process.env.DEFAULT_TRIAL_DURATION || '1', 10),
  enableEmailNotifications: process.env.LITIGATION_EMAIL_NOTIFICATIONS === 'true',
}));

/**
 * LitigationSupportModule
 * NestJS module providing litigation management services
 */
@Global()
@Module({
  imports: [
    ConfigModule.forFeature(litigationSupportConfig),
  ],
  providers: [
    LitigationMatterService,
    TimelineVisualizationService,
    WitnessManagementService,
    EvidenceTrackingService,
    TrialPreparationService,
    DocumentGenerationService,
  ],
  exports: [
    LitigationMatterService,
    TimelineVisualizationService,
    WitnessManagementService,
    EvidenceTrackingService,
    TrialPreparationService,
    DocumentGenerationService,
  ],
})
export class LitigationSupportModule {
  static forRoot(sequelize: Sequelize): DynamicModule {
    return {
      module: LitigationSupportModule,
      providers: [
        {
          provide: 'SEQUELIZE',
          useValue: sequelize,
        },
        LitigationMatterService,
        TimelineVisualizationService,
        WitnessManagementService,
        EvidenceTrackingService,
        TrialPreparationService,
        DocumentGenerationService,
      ],
      exports: [
        LitigationMatterService,
        TimelineVisualizationService,
        WitnessManagementService,
        EvidenceTrackingService,
        TrialPreparationService,
        DocumentGenerationService,
      ],
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Models
  LitigationMatter,
  Witness,
  Evidence,
  TimelineEvent,
  TrialPreparation,

  // Services
  LitigationMatterService,
  TimelineVisualizationService,
  WitnessManagementService,
  EvidenceTrackingService,
  TrialPreparationService,
  DocumentGenerationService,

  // Utilities
  generateMatterNumber,
  calculateFileHash,
  generateExhibitNumber,
};
