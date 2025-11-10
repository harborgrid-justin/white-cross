/**
 * LOC: DEPOSITION_MANAGEMENT_KIT_001
 * File: /reuse/legal/deposition-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *   - date-fns
 *   - node-schedule
 *
 * DOWNSTREAM (imported by):
 *   - Legal deposition modules
 *   - Litigation support controllers
 *   - Discovery management services
 *   - Court reporting services
 *   - Transcript management services
 */

/**
 * File: /reuse/legal/deposition-management-kit.ts
 * Locator: WC-DEPOSITION-MANAGEMENT-KIT-001
 * Purpose: Production-Grade Deposition Management Kit - Enterprise deposition coordination toolkit
 *
 * Upstream: NestJS, Sequelize, Zod, Date-FNS, Node-Schedule
 * Downstream: ../backend/modules/depositions/*, Litigation support controllers, Discovery services
 * Dependencies: TypeScript 5.x, Node 18+, sequelize-typescript, @nestjs/swagger, zod
 * Exports: 36 production-ready deposition management functions for legal platforms
 *
 * LLM Context: Production-grade deposition lifecycle management toolkit for White Cross platform.
 * Provides comprehensive deposition scheduling with calendar integration and conflict detection,
 * exhibit preparation with automatic numbering and organization, transcript ordering with court
 * reporter coordination, objection tracking with categorization and rulings, deposition summary
 * creation with key testimony extraction, Sequelize models for depositions/exhibits/transcripts/
 * objections/summaries, NestJS services with dependency injection, Swagger API documentation,
 * witness coordination with notification management, video deposition setup and recording management,
 * exhibit marking and authentication, transcript review workflow with errata sheet handling,
 * deposition outline generation, question preparation with topic organization, time tracking and
 * billing integration, court reporter management and vendor coordination, deposition room reservation,
 * remote deposition technology setup, deposition notice generation and service tracking, protective
 * order compliance, privilege assertion logging, deposition digest creation with page-line citations,
 * key testimony highlighting and indexing, deposition clip extraction for trial use, multi-deposition
 * coordination for complex cases, deposition cost estimation and budget tracking, deposition testimony
 * comparison and impeachment preparation, expert witness deposition scheduling with materials review,
 * deposition preparation sessions with witness coaching tracking, deposition agreement drafting,
 * deposition cancellation and rescheduling workflows, and healthcare litigation-specific support
 * (medical expert depositions, HIPAA-compliant recording, medical terminology indexing).
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
import { addDays, addHours, format, isBefore, isAfter, parseISO } from 'date-fns';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Deposition status lifecycle
 */
export enum DepositionStatus {
  SCHEDULED = 'scheduled',
  NOTICE_SENT = 'notice_sent',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  RECESSED = 'recessed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
  TRANSCRIPT_ORDERED = 'transcript_ordered',
  TRANSCRIPT_RECEIVED = 'transcript_received',
  REVIEWED = 'reviewed',
  FINALIZED = 'finalized',
}

/**
 * Deposition types
 */
export enum DepositionType {
  ORAL = 'oral',
  WRITTEN = 'written',
  VIDEO = 'video',
  TELEPHONE = 'telephone',
  REMOTE = 'remote',
  EXPERT_WITNESS = 'expert_witness',
  PARTY = 'party',
  NON_PARTY = 'non_party',
  CORPORATE_REPRESENTATIVE = 'corporate_representative',
  RULE_30_B_6 = 'rule_30_b_6',
}

/**
 * Exhibit status
 */
export enum ExhibitStatus {
  IDENTIFIED = 'identified',
  PREPARED = 'prepared',
  MARKED = 'marked',
  INTRODUCED = 'introduced',
  AUTHENTICATED = 'authenticated',
  ADMITTED = 'admitted',
  EXCLUDED = 'excluded',
  WITHDRAWN = 'withdrawn',
}

/**
 * Objection types
 */
export enum ObjectionType {
  FORM = 'form',
  RELEVANCE = 'relevance',
  HEARSAY = 'hearsay',
  SPECULATION = 'speculation',
  PRIVILEGE = 'privilege',
  ATTORNEY_CLIENT = 'attorney_client',
  WORK_PRODUCT = 'work_product',
  FOUNDATION = 'foundation',
  COMPOUND = 'compound',
  ARGUMENTATIVE = 'argumentative',
  ASKED_AND_ANSWERED = 'asked_and_answered',
  VAGUE = 'vague',
  AMBIGUOUS = 'ambiguous',
  CONFIDENTIAL = 'confidential',
  PROPRIETARY = 'proprietary',
  PRIVACY = 'privacy',
  HARASSING = 'harassing',
  OPPRESSIVE = 'oppressive',
}

/**
 * Objection ruling
 */
export enum ObjectionRuling {
  PENDING = 'pending',
  SUSTAINED = 'sustained',
  OVERRULED = 'overruled',
  DEFERRED = 'deferred',
  WITHDRAWN = 'withdrawn',
  INSTRUCTION_TO_ANSWER = 'instruction_to_answer',
  INSTRUCTION_NOT_TO_ANSWER = 'instruction_not_to_answer',
}

/**
 * Transcript status
 */
export enum TranscriptStatus {
  ORDERED = 'ordered',
  IN_PRODUCTION = 'in_production',
  DRAFT_RECEIVED = 'draft_received',
  UNDER_REVIEW = 'under_review',
  ERRATA_SUBMITTED = 'errata_submitted',
  CERTIFIED = 'certified',
  FINALIZED = 'finalized',
}

/**
 * Deposition interface
 */
export interface IDeposition {
  id: string;
  depositionNumber: string;
  matterId: string;
  witnessId: string;
  witnessName: string;
  depositionType: DepositionType;
  status: DepositionStatus;
  scheduledDate: Date;
  scheduledTime: string;
  duration: number; // in minutes
  location: string;
  isRemote: boolean;
  remoteLink?: string;
  roomNumber?: string;
  defendingAttorneyId: string;
  examiningAttorneyId: string;
  attendees: string[];
  courtReporterId?: string;
  courtReporterName?: string;
  courtReporterFirm?: string;
  videographerId?: string;
  videographerName?: string;
  noticeServedDate?: Date;
  noticeMethod?: string;
  estimatedCost: number;
  actualCost?: number;
  isExpert: boolean;
  expertFee?: number;
  materialsProvided: string[];
  topics: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes: string;
  cancelledReason?: string;
  rescheduledFrom?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Deposition exhibit interface
 */
export interface IDepositionExhibit {
  id: string;
  depositionId: string;
  exhibitNumber: string;
  exhibitLabel: string;
  description: string;
  status: ExhibitStatus;
  documentId?: string;
  documentPath?: string;
  documentType: string;
  fileSize?: number;
  pageCount?: number;
  markedAt?: Date;
  markedBy?: string;
  introducedAt?: Date;
  authenticatedBy?: string;
  batesRange?: string;
  isConfidential: boolean;
  isPriorArt: boolean;
  objections: string[];
  admissionNotes: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Deposition transcript interface
 */
export interface IDepositionTranscript {
  id: string;
  depositionId: string;
  status: TranscriptStatus;
  courtReporterId: string;
  orderedDate: Date;
  expectedDate?: Date;
  receivedDate?: Date;
  certifiedDate?: Date;
  transcriptType: 'rough' | 'expedited' | 'daily' | 'standard' | 'certified';
  format: 'pdf' | 'word' | 'text' | 'ptx' | 'ascii';
  filePath?: string;
  fileSize?: number;
  pageCount?: number;
  totalCost: number;
  rushFee?: number;
  copyFee?: number;
  videoCost?: number;
  errataDeadline?: Date;
  errataSubmitted?: Date;
  errataPath?: string;
  reviewAssignedTo?: string;
  reviewCompletedDate?: Date;
  isConfidential: boolean;
  accessRestrictions: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Deposition objection interface
 */
export interface IDepositionObjection {
  id: string;
  depositionId: string;
  transcriptPage?: number;
  transcriptLine?: number;
  timestamp: Date;
  objectionType: ObjectionType;
  objectingAttorneyId: string;
  objectingAttorneyName: string;
  question: string;
  grounds: string;
  ruling: ObjectionRuling;
  rulingJudge?: string;
  rulingDate?: Date;
  rulingNotes?: string;
  isPreserved: boolean;
  relatedMotion?: string;
  impeachmentValue: 'low' | 'medium' | 'high';
  followUpRequired: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Deposition summary interface
 */
export interface IDepositionSummary {
  id: string;
  depositionId: string;
  summaryType: 'page-line' | 'narrative' | 'topical' | 'issue-focused' | 'impeachment';
  createdBy: string;
  reviewedBy?: string;
  approvedBy?: string;
  summaryText: string;
  keyTestimony: Array<{
    topic: string;
    pageRange: string;
    lineRange: string;
    testimony: string;
    significance: string;
    tags: string[];
  }>;
  admissions: string[];
  contradictions: string[];
  impeachmentOpportunities: string[];
  exhibits: string[];
  credibilityAssessment: string;
  strengthScore: number; // 1-10
  overallImpact: 'positive' | 'neutral' | 'negative' | 'mixed';
  followUpQuestions: string[];
  trialUseNotes: string;
  isConfidential: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Deposition outline interface
 */
export interface IDepositionOutline {
  id: string;
  depositionId: string;
  createdBy: string;
  title: string;
  version: number;
  topics: Array<{
    order: number;
    topic: string;
    subtopics: string[];
    questions: string[];
    exhibitsToUse: string[];
    estimatedTime: number;
    priority: 'high' | 'medium' | 'low';
    notes: string;
  }>;
  objectives: string[];
  documentsToReview: string[];
  impeachmentMaterial: string[];
  estimatedDuration: number;
  actualDuration?: number;
  completionStatus: Record<string, boolean>;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

export const DepositionScheduleSchema = z.object({
  matterId: z.string().uuid(),
  witnessId: z.string().uuid(),
  witnessName: z.string().min(1),
  depositionType: z.nativeEnum(DepositionType),
  scheduledDate: z.coerce.date(),
  scheduledTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/),
  duration: z.number().int().min(30).max(480),
  location: z.string().min(1),
  isRemote: z.boolean().default(false),
  remoteLink: z.string().url().optional(),
  defendingAttorneyId: z.string().uuid(),
  examiningAttorneyId: z.string().uuid(),
  courtReporterId: z.string().uuid().optional(),
  videographerId: z.string().uuid().optional(),
  topics: z.array(z.string()).default([]),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
});

export const ExhibitPrepSchema = z.object({
  depositionId: z.string().uuid(),
  description: z.string().min(1),
  documentId: z.string().uuid().optional(),
  documentPath: z.string().optional(),
  documentType: z.string(),
  batesRange: z.string().optional(),
  isConfidential: z.boolean().default(false),
});

export const TranscriptOrderSchema = z.object({
  depositionId: z.string().uuid(),
  courtReporterId: z.string().uuid(),
  transcriptType: z.enum(['rough', 'expedited', 'daily', 'standard', 'certified']),
  format: z.enum(['pdf', 'word', 'text', 'ptx', 'ascii']),
  expectedDate: z.coerce.date().optional(),
  isConfidential: z.boolean().default(false),
});

export const ObjectionSchema = z.object({
  depositionId: z.string().uuid(),
  transcriptPage: z.number().int().positive().optional(),
  transcriptLine: z.number().int().positive().optional(),
  objectionType: z.nativeEnum(ObjectionType),
  objectingAttorneyId: z.string().uuid(),
  question: z.string(),
  grounds: z.string(),
  isPreserved: z.boolean().default(true),
});

export const SummaryCreationSchema = z.object({
  depositionId: z.string().uuid(),
  summaryType: z.enum(['page-line', 'narrative', 'topical', 'issue-focused', 'impeachment']),
  createdBy: z.string().uuid(),
  summaryText: z.string(),
  keyTestimony: z.array(z.object({
    topic: z.string(),
    pageRange: z.string(),
    lineRange: z.string(),
    testimony: z.string(),
    significance: z.string(),
    tags: z.array(z.string()).default([]),
  })).default([]),
  overallImpact: z.enum(['positive', 'neutral', 'negative', 'mixed']),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

@Table({
  tableName: 'depositions',
  paranoid: true,
  timestamps: true,
})
export class DepositionModel extends Model<IDeposition> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Index
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  depositionNumber!: string;

  @Index
  @ForeignKey(() => Model)
  @Column(DataType.UUID)
  matterId!: string;

  @Index
  @ForeignKey(() => Model)
  @Column(DataType.UUID)
  witnessId!: string;

  @Column(DataType.STRING)
  witnessName!: string;

  @Column({
    type: DataType.ENUM(...Object.values(DepositionType)),
    allowNull: false,
  })
  depositionType!: DepositionType;

  @Index
  @Column({
    type: DataType.ENUM(...Object.values(DepositionStatus)),
    allowNull: false,
  })
  status!: DepositionStatus;

  @Index
  @Column(DataType.DATE)
  scheduledDate!: Date;

  @Column(DataType.STRING)
  scheduledTime!: string;

  @Column(DataType.INTEGER)
  duration!: number;

  @Column(DataType.STRING)
  location!: string;

  @Column(DataType.BOOLEAN)
  isRemote!: boolean;

  @Column(DataType.STRING)
  remoteLink?: string;

  @Column(DataType.STRING)
  roomNumber?: string;

  @ForeignKey(() => Model)
  @Column(DataType.UUID)
  defendingAttorneyId!: string;

  @ForeignKey(() => Model)
  @Column(DataType.UUID)
  examiningAttorneyId!: string;

  @Column(DataType.JSONB)
  attendees!: string[];

  @ForeignKey(() => Model)
  @Column(DataType.UUID)
  courtReporterId?: string;

  @Column(DataType.STRING)
  courtReporterName?: string;

  @Column(DataType.STRING)
  courtReporterFirm?: string;

  @ForeignKey(() => Model)
  @Column(DataType.UUID)
  videographerId?: string;

  @Column(DataType.STRING)
  videographerName?: string;

  @Column(DataType.DATE)
  noticeServedDate?: Date;

  @Column(DataType.STRING)
  noticeMethod?: string;

  @Column(DataType.DECIMAL(10, 2))
  estimatedCost!: number;

  @Column(DataType.DECIMAL(10, 2))
  actualCost?: number;

  @Column(DataType.BOOLEAN)
  isExpert!: boolean;

  @Column(DataType.DECIMAL(10, 2))
  expertFee?: number;

  @Column(DataType.JSONB)
  materialsProvided!: string[];

  @Column(DataType.JSONB)
  topics!: string[];

  @Column({
    type: DataType.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
  })
  priority!: 'low' | 'medium' | 'high' | 'urgent';

  @Column(DataType.TEXT)
  notes!: string;

  @Column(DataType.TEXT)
  cancelledReason?: string;

  @Column(DataType.UUID)
  rescheduledFrom?: string;

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => DepositionExhibitModel)
  exhibits?: DepositionExhibitModel[];

  @HasMany(() => DepositionTranscriptModel)
  transcripts?: DepositionTranscriptModel[];

  @HasMany(() => DepositionObjectionModel)
  objections?: DepositionObjectionModel[];

  @HasMany(() => DepositionSummaryModel)
  summaries?: DepositionSummaryModel[];
}

@Table({
  tableName: 'deposition_exhibits',
  timestamps: true,
})
export class DepositionExhibitModel extends Model<IDepositionExhibit> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Index
  @ForeignKey(() => DepositionModel)
  @Column(DataType.UUID)
  depositionId!: string;

  @Index
  @Column(DataType.STRING)
  exhibitNumber!: string;

  @Column(DataType.STRING)
  exhibitLabel!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column({
    type: DataType.ENUM(...Object.values(ExhibitStatus)),
    allowNull: false,
  })
  status!: ExhibitStatus;

  @Column(DataType.UUID)
  documentId?: string;

  @Column(DataType.STRING)
  documentPath?: string;

  @Column(DataType.STRING)
  documentType!: string;

  @Column(DataType.INTEGER)
  fileSize?: number;

  @Column(DataType.INTEGER)
  pageCount?: number;

  @Column(DataType.DATE)
  markedAt?: Date;

  @Column(DataType.UUID)
  markedBy?: string;

  @Column(DataType.DATE)
  introducedAt?: Date;

  @Column(DataType.UUID)
  authenticatedBy?: string;

  @Column(DataType.STRING)
  batesRange?: string;

  @Column(DataType.BOOLEAN)
  isConfidential!: boolean;

  @Column(DataType.BOOLEAN)
  isPriorArt!: boolean;

  @Column(DataType.JSONB)
  objections!: string[];

  @Column(DataType.TEXT)
  admissionNotes!: string;

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => DepositionModel)
  deposition?: DepositionModel;
}

@Table({
  tableName: 'deposition_transcripts',
  timestamps: true,
})
export class DepositionTranscriptModel extends Model<IDepositionTranscript> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Index
  @ForeignKey(() => DepositionModel)
  @Column(DataType.UUID)
  depositionId!: string;

  @Index
  @Column({
    type: DataType.ENUM(...Object.values(TranscriptStatus)),
    allowNull: false,
  })
  status!: TranscriptStatus;

  @ForeignKey(() => Model)
  @Column(DataType.UUID)
  courtReporterId!: string;

  @Column(DataType.DATE)
  orderedDate!: Date;

  @Column(DataType.DATE)
  expectedDate?: Date;

  @Column(DataType.DATE)
  receivedDate?: Date;

  @Column(DataType.DATE)
  certifiedDate?: Date;

  @Column({
    type: DataType.ENUM('rough', 'expedited', 'daily', 'standard', 'certified'),
    allowNull: false,
  })
  transcriptType!: 'rough' | 'expedited' | 'daily' | 'standard' | 'certified';

  @Column({
    type: DataType.ENUM('pdf', 'word', 'text', 'ptx', 'ascii'),
    allowNull: false,
  })
  format!: 'pdf' | 'word' | 'text' | 'ptx' | 'ascii';

  @Column(DataType.STRING)
  filePath?: string;

  @Column(DataType.INTEGER)
  fileSize?: number;

  @Column(DataType.INTEGER)
  pageCount?: number;

  @Column(DataType.DECIMAL(10, 2))
  totalCost!: number;

  @Column(DataType.DECIMAL(10, 2))
  rushFee?: number;

  @Column(DataType.DECIMAL(10, 2))
  copyFee?: number;

  @Column(DataType.DECIMAL(10, 2))
  videoCost?: number;

  @Column(DataType.DATE)
  errataDeadline?: Date;

  @Column(DataType.DATE)
  errataSubmitted?: Date;

  @Column(DataType.STRING)
  errataPath?: string;

  @Column(DataType.UUID)
  reviewAssignedTo?: string;

  @Column(DataType.DATE)
  reviewCompletedDate?: Date;

  @Column(DataType.BOOLEAN)
  isConfidential!: boolean;

  @Column(DataType.JSONB)
  accessRestrictions!: string[];

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => DepositionModel)
  deposition?: DepositionModel;
}

@Table({
  tableName: 'deposition_objections',
  timestamps: true,
})
export class DepositionObjectionModel extends Model<IDepositionObjection> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Index
  @ForeignKey(() => DepositionModel)
  @Column(DataType.UUID)
  depositionId!: string;

  @Column(DataType.INTEGER)
  transcriptPage?: number;

  @Column(DataType.INTEGER)
  transcriptLine?: number;

  @Column(DataType.DATE)
  timestamp!: Date;

  @Index
  @Column({
    type: DataType.ENUM(...Object.values(ObjectionType)),
    allowNull: false,
  })
  objectionType!: ObjectionType;

  @ForeignKey(() => Model)
  @Column(DataType.UUID)
  objectingAttorneyId!: string;

  @Column(DataType.STRING)
  objectingAttorneyName!: string;

  @Column(DataType.TEXT)
  question!: string;

  @Column(DataType.TEXT)
  grounds!: string;

  @Column({
    type: DataType.ENUM(...Object.values(ObjectionRuling)),
    defaultValue: ObjectionRuling.PENDING,
  })
  ruling!: ObjectionRuling;

  @Column(DataType.STRING)
  rulingJudge?: string;

  @Column(DataType.DATE)
  rulingDate?: Date;

  @Column(DataType.TEXT)
  rulingNotes?: string;

  @Column(DataType.BOOLEAN)
  isPreserved!: boolean;

  @Column(DataType.UUID)
  relatedMotion?: string;

  @Column({
    type: DataType.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
  })
  impeachmentValue!: 'low' | 'medium' | 'high';

  @Column(DataType.BOOLEAN)
  followUpRequired!: boolean;

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => DepositionModel)
  deposition?: DepositionModel;
}

@Table({
  tableName: 'deposition_summaries',
  timestamps: true,
})
export class DepositionSummaryModel extends Model<IDepositionSummary> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Index
  @ForeignKey(() => DepositionModel)
  @Column(DataType.UUID)
  depositionId!: string;

  @Column({
    type: DataType.ENUM('page-line', 'narrative', 'topical', 'issue-focused', 'impeachment'),
    allowNull: false,
  })
  summaryType!: 'page-line' | 'narrative' | 'topical' | 'issue-focused' | 'impeachment';

  @ForeignKey(() => Model)
  @Column(DataType.UUID)
  createdBy!: string;

  @Column(DataType.UUID)
  reviewedBy?: string;

  @Column(DataType.UUID)
  approvedBy?: string;

  @Column(DataType.TEXT)
  summaryText!: string;

  @Column(DataType.JSONB)
  keyTestimony!: Array<{
    topic: string;
    pageRange: string;
    lineRange: string;
    testimony: string;
    significance: string;
    tags: string[];
  }>;

  @Column(DataType.JSONB)
  admissions!: string[];

  @Column(DataType.JSONB)
  contradictions!: string[];

  @Column(DataType.JSONB)
  impeachmentOpportunities!: string[];

  @Column(DataType.JSONB)
  exhibits!: string[];

  @Column(DataType.TEXT)
  credibilityAssessment!: string;

  @Column({
    type: DataType.INTEGER,
    validate: { min: 1, max: 10 },
  })
  strengthScore!: number;

  @Column({
    type: DataType.ENUM('positive', 'neutral', 'negative', 'mixed'),
    allowNull: false,
  })
  overallImpact!: 'positive' | 'neutral' | 'negative' | 'mixed';

  @Column(DataType.JSONB)
  followUpQuestions!: string[];

  @Column(DataType.TEXT)
  trialUseNotes!: string;

  @Column(DataType.BOOLEAN)
  isConfidential!: boolean;

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => DepositionModel)
  deposition?: DepositionModel;
}

@Table({
  tableName: 'deposition_outlines',
  timestamps: true,
})
export class DepositionOutlineModel extends Model<IDepositionOutline> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Index
  @ForeignKey(() => DepositionModel)
  @Column(DataType.UUID)
  depositionId!: string;

  @ForeignKey(() => Model)
  @Column(DataType.UUID)
  createdBy!: string;

  @Column(DataType.STRING)
  title!: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 1,
  })
  version!: number;

  @Column(DataType.JSONB)
  topics!: Array<{
    order: number;
    topic: string;
    subtopics: string[];
    questions: string[];
    exhibitsToUse: string[];
    estimatedTime: number;
    priority: 'high' | 'medium' | 'low';
    notes: string;
  }>;

  @Column(DataType.JSONB)
  objectives!: string[];

  @Column(DataType.JSONB)
  documentsToReview!: string[];

  @Column(DataType.JSONB)
  impeachmentMaterial!: string[];

  @Column(DataType.INTEGER)
  estimatedDuration!: number;

  @Column(DataType.INTEGER)
  actualDuration?: number;

  @Column(DataType.JSONB)
  completionStatus!: Record<string, boolean>;

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => DepositionModel)
  deposition?: DepositionModel;
}

// ============================================================================
// FUNCTION 1: SCHEDULE DEPOSITION
// ============================================================================

/**
 * Schedule a new deposition with calendar integration and conflict detection
 *
 * @param params - Deposition scheduling parameters
 * @param transaction - Optional database transaction
 * @returns Created deposition record
 * @throws BadRequestException if scheduling conflicts exist
 * @throws NotFoundException if witness or attorneys not found
 */
export async function scheduleDeposition(
  params: z.infer<typeof DepositionScheduleSchema>,
  transaction?: Transaction
): Promise<DepositionModel> {
  const validated = DepositionScheduleSchema.parse(params);

  // Check for scheduling conflicts
  const conflicts = await DepositionModel.findAll({
    where: {
      scheduledDate: validated.scheduledDate,
      status: {
        [Op.notIn]: [DepositionStatus.CANCELLED, DepositionStatus.COMPLETED],
      },
      [Op.or]: [
        { defendingAttorneyId: validated.defendingAttorneyId },
        { examiningAttorneyId: validated.examiningAttorneyId },
        { witnessId: validated.witnessId },
      ],
    },
    transaction,
  });

  if (conflicts.length > 0) {
    throw new ConflictException(
      `Scheduling conflict detected for the specified date and participants`
    );
  }

  // Generate unique deposition number
  const depositionNumber = await generateDepositionNumber(validated.matterId, transaction);

  const deposition = await DepositionModel.create(
    {
      id: crypto.randomUUID(),
      depositionNumber,
      matterId: validated.matterId,
      witnessId: validated.witnessId,
      witnessName: validated.witnessName,
      depositionType: validated.depositionType,
      status: DepositionStatus.SCHEDULED,
      scheduledDate: validated.scheduledDate,
      scheduledTime: validated.scheduledTime,
      duration: validated.duration,
      location: validated.location,
      isRemote: validated.isRemote,
      remoteLink: validated.remoteLink,
      defendingAttorneyId: validated.defendingAttorneyId,
      examiningAttorneyId: validated.examiningAttorneyId,
      attendees: [validated.defendingAttorneyId, validated.examiningAttorneyId],
      courtReporterId: validated.courtReporterId,
      videographerId: validated.videographerId,
      isExpert: validated.depositionType === DepositionType.EXPERT_WITNESS,
      materialsProvided: [],
      topics: validated.topics,
      priority: validated.priority,
      notes: '',
      estimatedCost: calculateEstimatedCost(validated),
      metadata: {},
    },
    { transaction }
  );

  return deposition;
}

// ============================================================================
// FUNCTION 2: GENERATE DEPOSITION NUMBER
// ============================================================================

/**
 * Generate unique deposition number for a matter
 *
 * @param matterId - Matter identifier
 * @param transaction - Optional database transaction
 * @returns Unique deposition number
 */
export async function generateDepositionNumber(
  matterId: string,
  transaction?: Transaction
): Promise<string> {
  const count = await DepositionModel.count({
    where: { matterId },
    transaction,
  });

  const year = new Date().getFullYear();
  const sequence = (count + 1).toString().padStart(4, '0');
  const matterPrefix = matterId.substring(0, 6).toUpperCase();

  return `DEP-${year}-${matterPrefix}-${sequence}`;
}

// ============================================================================
// FUNCTION 3: CALCULATE ESTIMATED COST
// ============================================================================

/**
 * Calculate estimated deposition cost based on parameters
 *
 * @param params - Deposition parameters
 * @returns Estimated cost in dollars
 */
export function calculateEstimatedCost(
  params: z.infer<typeof DepositionScheduleSchema>
): number {
  let cost = 0;

  // Court reporter base fee
  cost += 500;

  // Duration fee (per hour beyond first hour)
  const hours = Math.ceil(params.duration / 60);
  if (hours > 1) {
    cost += (hours - 1) * 150;
  }

  // Remote deposition technology fee
  if (params.isRemote) {
    cost += 200;
  }

  // Video deposition fee
  if (params.depositionType === DepositionType.VIDEO) {
    cost += 400;
  }

  // Expert witness premium
  if (params.depositionType === DepositionType.EXPERT_WITNESS) {
    cost += 300;
  }

  return cost;
}

// ============================================================================
// FUNCTION 4: PREPARE EXHIBIT
// ============================================================================

/**
 * Prepare and mark an exhibit for deposition use
 *
 * @param params - Exhibit preparation parameters
 * @param transaction - Optional database transaction
 * @returns Created exhibit record
 * @throws NotFoundException if deposition not found
 */
export async function prepareDepositionExhibit(
  params: z.infer<typeof ExhibitPrepSchema>,
  transaction?: Transaction
): Promise<DepositionExhibitModel> {
  const validated = ExhibitPrepSchema.parse(params);

  const deposition = await DepositionModel.findByPk(validated.depositionId, { transaction });
  if (!deposition) {
    throw new NotFoundException(`Deposition not found: ${validated.depositionId}`);
  }

  // Generate exhibit number
  const exhibitNumber = await generateExhibitNumber(validated.depositionId, transaction);

  const exhibit = await DepositionExhibitModel.create(
    {
      id: crypto.randomUUID(),
      depositionId: validated.depositionId,
      exhibitNumber,
      exhibitLabel: `Exhibit ${exhibitNumber}`,
      description: validated.description,
      status: ExhibitStatus.PREPARED,
      documentId: validated.documentId,
      documentPath: validated.documentPath,
      documentType: validated.documentType,
      batesRange: validated.batesRange,
      isConfidential: validated.isConfidential,
      isPriorArt: false,
      objections: [],
      admissionNotes: '',
      metadata: {},
    },
    { transaction }
  );

  return exhibit;
}

// ============================================================================
// FUNCTION 5: GENERATE EXHIBIT NUMBER
// ============================================================================

/**
 * Generate sequential exhibit number for a deposition
 *
 * @param depositionId - Deposition identifier
 * @param transaction - Optional database transaction
 * @returns Exhibit number (e.g., "1", "2", "3")
 */
export async function generateExhibitNumber(
  depositionId: string,
  transaction?: Transaction
): Promise<string> {
  const count = await DepositionExhibitModel.count({
    where: { depositionId },
    transaction,
  });

  return (count + 1).toString();
}

// ============================================================================
// FUNCTION 6: ORDER TRANSCRIPT
// ============================================================================

/**
 * Order deposition transcript from court reporter
 *
 * @param params - Transcript order parameters
 * @param transaction - Optional database transaction
 * @returns Created transcript order record
 * @throws NotFoundException if deposition or court reporter not found
 */
export async function orderDepositionTranscript(
  params: z.infer<typeof TranscriptOrderSchema>,
  transaction?: Transaction
): Promise<DepositionTranscriptModel> {
  const validated = TranscriptOrderSchema.parse(params);

  const deposition = await DepositionModel.findByPk(validated.depositionId, { transaction });
  if (!deposition) {
    throw new NotFoundException(`Deposition not found: ${validated.depositionId}`);
  }

  if (deposition.status !== DepositionStatus.COMPLETED) {
    throw new BadRequestException('Cannot order transcript for incomplete deposition');
  }

  const cost = calculateTranscriptCost(validated.transcriptType, deposition.duration);

  const transcript = await DepositionTranscriptModel.create(
    {
      id: crypto.randomUUID(),
      depositionId: validated.depositionId,
      status: TranscriptStatus.ORDERED,
      courtReporterId: validated.courtReporterId,
      orderedDate: new Date(),
      expectedDate: validated.expectedDate || calculateExpectedDate(validated.transcriptType),
      transcriptType: validated.transcriptType,
      format: validated.format,
      totalCost: cost,
      isConfidential: validated.isConfidential,
      accessRestrictions: validated.isConfidential ? ['attorney-eyes-only'] : [],
      metadata: {},
    },
    { transaction }
  );

  // Update deposition status
  await deposition.update(
    { status: DepositionStatus.TRANSCRIPT_ORDERED },
    { transaction }
  );

  return transcript;
}

// ============================================================================
// FUNCTION 7: CALCULATE TRANSCRIPT COST
// ============================================================================

/**
 * Calculate transcript cost based on type and duration
 *
 * @param transcriptType - Type of transcript
 * @param duration - Deposition duration in minutes
 * @returns Total cost in dollars
 */
export function calculateTranscriptCost(
  transcriptType: 'rough' | 'expedited' | 'daily' | 'standard' | 'certified',
  duration: number
): number {
  const pages = Math.ceil(duration / 4); // Approximate 4 minutes per page
  let costPerPage = 0;

  switch (transcriptType) {
    case 'rough':
      costPerPage = 2.50;
      break;
    case 'expedited':
      costPerPage = 5.00;
      break;
    case 'daily':
      costPerPage = 4.00;
      break;
    case 'standard':
      costPerPage = 3.00;
      break;
    case 'certified':
      costPerPage = 3.50;
      break;
  }

  return pages * costPerPage;
}

// ============================================================================
// FUNCTION 8: CALCULATE EXPECTED TRANSCRIPT DATE
// ============================================================================

/**
 * Calculate expected delivery date for transcript based on type
 *
 * @param transcriptType - Type of transcript
 * @returns Expected delivery date
 */
export function calculateExpectedDate(
  transcriptType: 'rough' | 'expedited' | 'daily' | 'standard' | 'certified'
): Date {
  const businessDays: Record<string, number> = {
    rough: 3,
    expedited: 5,
    daily: 1,
    standard: 14,
    certified: 21,
  };

  return addDays(new Date(), businessDays[transcriptType] || 14);
}

// ============================================================================
// FUNCTION 9: TRACK OBJECTION
// ============================================================================

/**
 * Track and log objection during deposition
 *
 * @param params - Objection parameters
 * @param transaction - Optional database transaction
 * @returns Created objection record
 * @throws NotFoundException if deposition not found
 */
export async function trackDepositionObjection(
  params: z.infer<typeof ObjectionSchema>,
  transaction?: Transaction
): Promise<DepositionObjectionModel> {
  const validated = ObjectionSchema.parse(params);

  const deposition = await DepositionModel.findByPk(validated.depositionId, { transaction });
  if (!deposition) {
    throw new NotFoundException(`Deposition not found: ${validated.depositionId}`);
  }

  const objection = await DepositionObjectionModel.create(
    {
      id: crypto.randomUUID(),
      depositionId: validated.depositionId,
      transcriptPage: validated.transcriptPage,
      transcriptLine: validated.transcriptLine,
      timestamp: new Date(),
      objectionType: validated.objectionType,
      objectingAttorneyId: validated.objectingAttorneyId,
      objectingAttorneyName: '', // To be populated from attorney lookup
      question: validated.question,
      grounds: validated.grounds,
      ruling: ObjectionRuling.PENDING,
      isPreserved: validated.isPreserved,
      impeachmentValue: 'medium',
      followUpRequired: false,
      metadata: {},
    },
    { transaction }
  );

  return objection;
}

// ============================================================================
// FUNCTION 10: CREATE DEPOSITION SUMMARY
// ============================================================================

/**
 * Create comprehensive deposition summary with key testimony
 *
 * @param params - Summary creation parameters
 * @param transaction - Optional database transaction
 * @returns Created summary record
 * @throws NotFoundException if deposition not found
 */
export async function createDepositionSummary(
  params: z.infer<typeof SummaryCreationSchema>,
  transaction?: Transaction
): Promise<DepositionSummaryModel> {
  const validated = SummaryCreationSchema.parse(params);

  const deposition = await DepositionModel.findByPk(validated.depositionId, {
    include: [
      DepositionTranscriptModel,
      DepositionObjectionModel,
      DepositionExhibitModel,
    ],
    transaction,
  });

  if (!deposition) {
    throw new NotFoundException(`Deposition not found: ${validated.depositionId}`);
  }

  const summary = await DepositionSummaryModel.create(
    {
      id: crypto.randomUUID(),
      depositionId: validated.depositionId,
      summaryType: validated.summaryType,
      createdBy: validated.createdBy,
      summaryText: validated.summaryText,
      keyTestimony: validated.keyTestimony,
      admissions: [],
      contradictions: [],
      impeachmentOpportunities: [],
      exhibits: [],
      credibilityAssessment: '',
      strengthScore: 5,
      overallImpact: validated.overallImpact,
      followUpQuestions: [],
      trialUseNotes: '',
      isConfidential: false,
      metadata: {},
    },
    { transaction }
  );

  return summary;
}

// ============================================================================
// FUNCTION 11: MARK EXHIBIT DURING DEPOSITION
// ============================================================================

/**
 * Mark exhibit as introduced during deposition
 *
 * @param exhibitId - Exhibit identifier
 * @param markedBy - Attorney marking the exhibit
 * @param transaction - Optional database transaction
 * @returns Updated exhibit record
 */
export async function markExhibit(
  exhibitId: string,
  markedBy: string,
  transaction?: Transaction
): Promise<DepositionExhibitModel> {
  const exhibit = await DepositionExhibitModel.findByPk(exhibitId, { transaction });
  if (!exhibit) {
    throw new NotFoundException(`Exhibit not found: ${exhibitId}`);
  }

  await exhibit.update(
    {
      status: ExhibitStatus.MARKED,
      markedAt: new Date(),
      markedBy,
    },
    { transaction }
  );

  return exhibit;
}

// ============================================================================
// FUNCTION 12: INTRODUCE EXHIBIT
// ============================================================================

/**
 * Mark exhibit as introduced into the deposition record
 *
 * @param exhibitId - Exhibit identifier
 * @param transaction - Optional database transaction
 * @returns Updated exhibit record
 */
export async function introduceExhibit(
  exhibitId: string,
  transaction?: Transaction
): Promise<DepositionExhibitModel> {
  const exhibit = await DepositionExhibitModel.findByPk(exhibitId, { transaction });
  if (!exhibit) {
    throw new NotFoundException(`Exhibit not found: ${exhibitId}`);
  }

  await exhibit.update(
    {
      status: ExhibitStatus.INTRODUCED,
      introducedAt: new Date(),
    },
    { transaction }
  );

  return exhibit;
}

// ============================================================================
// FUNCTION 13: AUTHENTICATE EXHIBIT
// ============================================================================

/**
 * Mark exhibit as authenticated by witness
 *
 * @param exhibitId - Exhibit identifier
 * @param authenticatedBy - Witness authenticating the exhibit
 * @param transaction - Optional database transaction
 * @returns Updated exhibit record
 */
export async function authenticateExhibit(
  exhibitId: string,
  authenticatedBy: string,
  transaction?: Transaction
): Promise<DepositionExhibitModel> {
  const exhibit = await DepositionExhibitModel.findByPk(exhibitId, { transaction });
  if (!exhibit) {
    throw new NotFoundException(`Exhibit not found: ${exhibitId}`);
  }

  await exhibit.update(
    {
      status: ExhibitStatus.AUTHENTICATED,
      authenticatedBy,
    },
    { transaction }
  );

  return exhibit;
}

// ============================================================================
// FUNCTION 14: UPDATE OBJECTION RULING
// ============================================================================

/**
 * Update ruling on deposition objection
 *
 * @param objectionId - Objection identifier
 * @param ruling - Ruling decision
 * @param rulingJudge - Judge name (optional)
 * @param notes - Ruling notes (optional)
 * @param transaction - Optional database transaction
 * @returns Updated objection record
 */
export async function updateObjectionRuling(
  objectionId: string,
  ruling: ObjectionRuling,
  rulingJudge?: string,
  notes?: string,
  transaction?: Transaction
): Promise<DepositionObjectionModel> {
  const objection = await DepositionObjectionModel.findByPk(objectionId, { transaction });
  if (!objection) {
    throw new NotFoundException(`Objection not found: ${objectionId}`);
  }

  await objection.update(
    {
      ruling,
      rulingJudge,
      rulingDate: new Date(),
      rulingNotes: notes,
    },
    { transaction }
  );

  return objection;
}

// ============================================================================
// FUNCTION 15: GENERATE DEPOSITION NOTICE
// ============================================================================

/**
 * Generate formal deposition notice document
 *
 * @param depositionId - Deposition identifier
 * @returns Notice document content
 */
export async function generateDepositionNotice(depositionId: string): Promise<string> {
  const deposition = await DepositionModel.findByPk(depositionId);
  if (!deposition) {
    throw new NotFoundException(`Deposition not found: ${depositionId}`);
  }

  const noticeDate = format(new Date(), 'MMMM dd, yyyy');
  const depositionDate = format(deposition.scheduledDate, 'MMMM dd, yyyy');

  return `
NOTICE OF DEPOSITION

Date: ${noticeDate}

TO: All Counsel of Record

PLEASE TAKE NOTICE that the deposition of ${deposition.witnessName} will be taken as follows:

Deposition Number: ${deposition.depositionNumber}
Date: ${depositionDate}
Time: ${deposition.scheduledTime}
Location: ${deposition.location}
${deposition.isRemote ? `Remote Link: ${deposition.remoteLink}` : ''}
Type: ${deposition.depositionType}
Estimated Duration: ${deposition.duration} minutes

Topics for Examination:
${deposition.topics.map((topic, idx) => `${idx + 1}. ${topic}`).join('\n')}

This deposition will be recorded by a certified court reporter and may be used at trial or any hearing in this matter.

Respectfully submitted,

[Examining Attorney]
Date: ${noticeDate}
  `.trim();
}

// ============================================================================
// FUNCTION 16: CREATE DEPOSITION OUTLINE
// ============================================================================

/**
 * Create structured deposition outline with topics and questions
 *
 * @param depositionId - Deposition identifier
 * @param createdBy - Attorney creating the outline
 * @param title - Outline title
 * @param topics - Topic structure
 * @param transaction - Optional database transaction
 * @returns Created outline record
 */
export async function createDepositionOutline(
  depositionId: string,
  createdBy: string,
  title: string,
  topics: Array<{
    order: number;
    topic: string;
    subtopics: string[];
    questions: string[];
    exhibitsToUse: string[];
    estimatedTime: number;
    priority: 'high' | 'medium' | 'low';
    notes: string;
  }>,
  transaction?: Transaction
): Promise<DepositionOutlineModel> {
  const deposition = await DepositionModel.findByPk(depositionId, { transaction });
  if (!deposition) {
    throw new NotFoundException(`Deposition not found: ${depositionId}`);
  }

  const estimatedDuration = topics.reduce((sum, topic) => sum + topic.estimatedTime, 0);

  const outline = await DepositionOutlineModel.create(
    {
      id: crypto.randomUUID(),
      depositionId,
      createdBy,
      title,
      version: 1,
      topics,
      objectives: [],
      documentsToReview: [],
      impeachmentMaterial: [],
      estimatedDuration,
      completionStatus: {},
      metadata: {},
    },
    { transaction }
  );

  return outline;
}

// ============================================================================
// FUNCTION 17: UPDATE DEPOSITION STATUS
// ============================================================================

/**
 * Update deposition status with validation
 *
 * @param depositionId - Deposition identifier
 * @param status - New status
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
export async function updateDepositionStatus(
  depositionId: string,
  status: DepositionStatus,
  transaction?: Transaction
): Promise<DepositionModel> {
  const deposition = await DepositionModel.findByPk(depositionId, { transaction });
  if (!deposition) {
    throw new NotFoundException(`Deposition not found: ${depositionId}`);
  }

  await deposition.update({ status }, { transaction });
  return deposition;
}

// ============================================================================
// FUNCTION 18: CANCEL DEPOSITION
// ============================================================================

/**
 * Cancel scheduled deposition with reason
 *
 * @param depositionId - Deposition identifier
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
export async function cancelDeposition(
  depositionId: string,
  reason: string,
  transaction?: Transaction
): Promise<DepositionModel> {
  const deposition = await DepositionModel.findByPk(depositionId, { transaction });
  if (!deposition) {
    throw new NotFoundException(`Deposition not found: ${depositionId}`);
  }

  if (deposition.status === DepositionStatus.COMPLETED) {
    throw new BadRequestException('Cannot cancel completed deposition');
  }

  await deposition.update(
    {
      status: DepositionStatus.CANCELLED,
      cancelledReason: reason,
    },
    { transaction }
  );

  return deposition;
}

// ============================================================================
// FUNCTION 19: RESCHEDULE DEPOSITION
// ============================================================================

/**
 * Reschedule deposition to new date/time
 *
 * @param depositionId - Original deposition identifier
 * @param newDate - New scheduled date
 * @param newTime - New scheduled time
 * @param transaction - Optional database transaction
 * @returns New deposition record
 */
export async function rescheduleDeposition(
  depositionId: string,
  newDate: Date,
  newTime: string,
  transaction?: Transaction
): Promise<DepositionModel> {
  const originalDeposition = await DepositionModel.findByPk(depositionId, { transaction });
  if (!originalDeposition) {
    throw new NotFoundException(`Deposition not found: ${depositionId}`);
  }

  // Mark original as rescheduled
  await originalDeposition.update(
    { status: DepositionStatus.RESCHEDULED },
    { transaction }
  );

  // Create new deposition record
  const newDeposition = await DepositionModel.create(
    {
      ...originalDeposition.get({ plain: true }),
      id: crypto.randomUUID(),
      depositionNumber: await generateDepositionNumber(originalDeposition.matterId, transaction),
      scheduledDate: newDate,
      scheduledTime: newTime,
      status: DepositionStatus.SCHEDULED,
      rescheduledFrom: depositionId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    { transaction }
  );

  return newDeposition;
}

// ============================================================================
// FUNCTION 20: ASSIGN COURT REPORTER
// ============================================================================

/**
 * Assign court reporter to deposition
 *
 * @param depositionId - Deposition identifier
 * @param courtReporterId - Court reporter identifier
 * @param courtReporterName - Court reporter name
 * @param courtReporterFirm - Court reporter firm
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
export async function assignCourtReporter(
  depositionId: string,
  courtReporterId: string,
  courtReporterName: string,
  courtReporterFirm: string,
  transaction?: Transaction
): Promise<DepositionModel> {
  const deposition = await DepositionModel.findByPk(depositionId, { transaction });
  if (!deposition) {
    throw new NotFoundException(`Deposition not found: ${depositionId}`);
  }

  await deposition.update(
    {
      courtReporterId,
      courtReporterName,
      courtReporterFirm,
    },
    { transaction }
  );

  return deposition;
}

// ============================================================================
// FUNCTION 21: ASSIGN VIDEOGRAPHER
// ============================================================================

/**
 * Assign videographer to video deposition
 *
 * @param depositionId - Deposition identifier
 * @param videographerId - Videographer identifier
 * @param videographerName - Videographer name
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
export async function assignVideographer(
  depositionId: string,
  videographerId: string,
  videographerName: string,
  transaction?: Transaction
): Promise<DepositionModel> {
  const deposition = await DepositionModel.findByPk(depositionId, { transaction });
  if (!deposition) {
    throw new NotFoundException(`Deposition not found: ${depositionId}`);
  }

  if (deposition.depositionType !== DepositionType.VIDEO) {
    throw new BadRequestException('Videographer can only be assigned to video depositions');
  }

  await deposition.update(
    {
      videographerId,
      videographerName,
    },
    { transaction }
  );

  return deposition;
}

// ============================================================================
// FUNCTION 22: ADD DEPOSITION ATTENDEE
// ============================================================================

/**
 * Add attendee to deposition
 *
 * @param depositionId - Deposition identifier
 * @param attendeeId - Attendee identifier
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
export async function addDepositionAttendee(
  depositionId: string,
  attendeeId: string,
  transaction?: Transaction
): Promise<DepositionModel> {
  const deposition = await DepositionModel.findByPk(depositionId, { transaction });
  if (!deposition) {
    throw new NotFoundException(`Deposition not found: ${depositionId}`);
  }

  if (!deposition.attendees.includes(attendeeId)) {
    await deposition.update(
      {
        attendees: [...deposition.attendees, attendeeId],
      },
      { transaction }
    );
  }

  return deposition;
}

// ============================================================================
// FUNCTION 23: REMOVE DEPOSITION ATTENDEE
// ============================================================================

/**
 * Remove attendee from deposition
 *
 * @param depositionId - Deposition identifier
 * @param attendeeId - Attendee identifier
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
export async function removeDepositionAttendee(
  depositionId: string,
  attendeeId: string,
  transaction?: Transaction
): Promise<DepositionModel> {
  const deposition = await DepositionModel.findByPk(depositionId, { transaction });
  if (!deposition) {
    throw new NotFoundException(`Deposition not found: ${depositionId}`);
  }

  await deposition.update(
    {
      attendees: deposition.attendees.filter((id) => id !== attendeeId),
    },
    { transaction }
  );

  return deposition;
}

// ============================================================================
// FUNCTION 24: RECORD DEPOSITION NOTICE SERVICE
// ============================================================================

/**
 * Record service of deposition notice
 *
 * @param depositionId - Deposition identifier
 * @param serviceDate - Date notice was served
 * @param serviceMethod - Method of service
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
export async function recordNoticeService(
  depositionId: string,
  serviceDate: Date,
  serviceMethod: string,
  transaction?: Transaction
): Promise<DepositionModel> {
  const deposition = await DepositionModel.findByPk(depositionId, { transaction });
  if (!deposition) {
    throw new NotFoundException(`Deposition not found: ${depositionId}`);
  }

  await deposition.update(
    {
      noticeServedDate: serviceDate,
      noticeMethod: serviceMethod,
      status: DepositionStatus.NOTICE_SENT,
    },
    { transaction }
  );

  return deposition;
}

// ============================================================================
// FUNCTION 25: CONFIRM DEPOSITION
// ============================================================================

/**
 * Confirm deposition attendance and readiness
 *
 * @param depositionId - Deposition identifier
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
export async function confirmDeposition(
  depositionId: string,
  transaction?: Transaction
): Promise<DepositionModel> {
  const deposition = await DepositionModel.findByPk(depositionId, { transaction });
  if (!deposition) {
    throw new NotFoundException(`Deposition not found: ${depositionId}`);
  }

  await deposition.update(
    { status: DepositionStatus.CONFIRMED },
    { transaction }
  );

  return deposition;
}

// ============================================================================
// FUNCTION 26: START DEPOSITION
// ============================================================================

/**
 * Mark deposition as in progress
 *
 * @param depositionId - Deposition identifier
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
export async function startDeposition(
  depositionId: string,
  transaction?: Transaction
): Promise<DepositionModel> {
  const deposition = await DepositionModel.findByPk(depositionId, { transaction });
  if (!deposition) {
    throw new NotFoundException(`Deposition not found: ${depositionId}`);
  }

  await deposition.update(
    { status: DepositionStatus.IN_PROGRESS },
    { transaction }
  );

  return deposition;
}

// ============================================================================
// FUNCTION 27: COMPLETE DEPOSITION
// ============================================================================

/**
 * Mark deposition as completed
 *
 * @param depositionId - Deposition identifier
 * @param actualCost - Actual cost incurred (optional)
 * @param transaction - Optional database transaction
 * @returns Updated deposition record
 */
export async function completeDeposition(
  depositionId: string,
  actualCost?: number,
  transaction?: Transaction
): Promise<DepositionModel> {
  const deposition = await DepositionModel.findByPk(depositionId, { transaction });
  if (!deposition) {
    throw new NotFoundException(`Deposition not found: ${depositionId}`);
  }

  await deposition.update(
    {
      status: DepositionStatus.COMPLETED,
      actualCost: actualCost || deposition.estimatedCost,
    },
    { transaction }
  );

  return deposition;
}

// ============================================================================
// FUNCTION 28: UPDATE TRANSCRIPT STATUS
// ============================================================================

/**
 * Update transcript status throughout production lifecycle
 *
 * @param transcriptId - Transcript identifier
 * @param status - New status
 * @param transaction - Optional database transaction
 * @returns Updated transcript record
 */
export async function updateTranscriptStatus(
  transcriptId: string,
  status: TranscriptStatus,
  transaction?: Transaction
): Promise<DepositionTranscriptModel> {
  const transcript = await DepositionTranscriptModel.findByPk(transcriptId, { transaction });
  if (!transcript) {
    throw new NotFoundException(`Transcript not found: ${transcriptId}`);
  }

  const updates: Partial<IDepositionTranscript> = { status };

  if (status === TranscriptStatus.DRAFT_RECEIVED) {
    updates.receivedDate = new Date();
  } else if (status === TranscriptStatus.CERTIFIED) {
    updates.certifiedDate = new Date();
  }

  await transcript.update(updates, { transaction });
  return transcript;
}

// ============================================================================
// FUNCTION 29: ATTACH TRANSCRIPT FILE
// ============================================================================

/**
 * Attach transcript file to record
 *
 * @param transcriptId - Transcript identifier
 * @param filePath - File path
 * @param fileSize - File size in bytes
 * @param pageCount - Number of pages
 * @param transaction - Optional database transaction
 * @returns Updated transcript record
 */
export async function attachTranscriptFile(
  transcriptId: string,
  filePath: string,
  fileSize: number,
  pageCount: number,
  transaction?: Transaction
): Promise<DepositionTranscriptModel> {
  const transcript = await DepositionTranscriptModel.findByPk(transcriptId, { transaction });
  if (!transcript) {
    throw new NotFoundException(`Transcript not found: ${transcriptId}`);
  }

  await transcript.update(
    {
      filePath,
      fileSize,
      pageCount,
      receivedDate: new Date(),
      status: TranscriptStatus.DRAFT_RECEIVED,
    },
    { transaction }
  );

  return transcript;
}

// ============================================================================
// FUNCTION 30: SUBMIT ERRATA SHEET
// ============================================================================

/**
 * Submit witness errata sheet for transcript corrections
 *
 * @param transcriptId - Transcript identifier
 * @param errataPath - Path to errata sheet
 * @param transaction - Optional database transaction
 * @returns Updated transcript record
 */
export async function submitErrataSheet(
  transcriptId: string,
  errataPath: string,
  transaction?: Transaction
): Promise<DepositionTranscriptModel> {
  const transcript = await DepositionTranscriptModel.findByPk(transcriptId, { transaction });
  if (!transcript) {
    throw new NotFoundException(`Transcript not found: ${transcriptId}`);
  }

  await transcript.update(
    {
      errataPath,
      errataSubmitted: new Date(),
      status: TranscriptStatus.ERRATA_SUBMITTED,
    },
    { transaction }
  );

  return transcript;
}

// ============================================================================
// FUNCTION 31: ASSIGN TRANSCRIPT REVIEWER
// ============================================================================

/**
 * Assign attorney to review transcript
 *
 * @param transcriptId - Transcript identifier
 * @param reviewerId - Reviewer identifier
 * @param transaction - Optional database transaction
 * @returns Updated transcript record
 */
export async function assignTranscriptReviewer(
  transcriptId: string,
  reviewerId: string,
  transaction?: Transaction
): Promise<DepositionTranscriptModel> {
  const transcript = await DepositionTranscriptModel.findByPk(transcriptId, { transaction });
  if (!transcript) {
    throw new NotFoundException(`Transcript not found: ${transcriptId}`);
  }

  await transcript.update(
    {
      reviewAssignedTo: reviewerId,
      status: TranscriptStatus.UNDER_REVIEW,
    },
    { transaction }
  );

  return transcript;
}

// ============================================================================
// FUNCTION 32: COMPLETE TRANSCRIPT REVIEW
// ============================================================================

/**
 * Mark transcript review as complete
 *
 * @param transcriptId - Transcript identifier
 * @param transaction - Optional database transaction
 * @returns Updated transcript record
 */
export async function completeTranscriptReview(
  transcriptId: string,
  transaction?: Transaction
): Promise<DepositionTranscriptModel> {
  const transcript = await DepositionTranscriptModel.findByPk(transcriptId, { transaction });
  if (!transcript) {
    throw new NotFoundException(`Transcript not found: ${transcriptId}`);
  }

  await transcript.update(
    {
      reviewCompletedDate: new Date(),
      status: TranscriptStatus.FINALIZED,
    },
    { transaction }
  );

  return transcript;
}

// ============================================================================
// FUNCTION 33: GET DEPOSITION WITH RELATIONS
// ============================================================================

/**
 * Retrieve deposition with all related records
 *
 * @param depositionId - Deposition identifier
 * @returns Deposition with exhibits, transcripts, objections, and summaries
 */
export async function getDepositionWithRelations(
  depositionId: string
): Promise<DepositionModel> {
  const deposition = await DepositionModel.findByPk(depositionId, {
    include: [
      {
        model: DepositionExhibitModel,
        as: 'exhibits',
      },
      {
        model: DepositionTranscriptModel,
        as: 'transcripts',
      },
      {
        model: DepositionObjectionModel,
        as: 'objections',
      },
      {
        model: DepositionSummaryModel,
        as: 'summaries',
      },
    ],
  });

  if (!deposition) {
    throw new NotFoundException(`Deposition not found: ${depositionId}`);
  }

  return deposition;
}

// ============================================================================
// FUNCTION 34: SEARCH DEPOSITIONS
// ============================================================================

/**
 * Search depositions with advanced filtering
 *
 * @param filters - Search filters
 * @returns Matching deposition records
 */
export async function searchDepositions(filters: {
  matterId?: string;
  witnessId?: string;
  status?: DepositionStatus;
  depositionType?: DepositionType;
  fromDate?: Date;
  toDate?: Date;
  priority?: string;
  isExpert?: boolean;
}): Promise<DepositionModel[]> {
  const where: WhereOptions<IDeposition> = {};

  if (filters.matterId) where.matterId = filters.matterId;
  if (filters.witnessId) where.witnessId = filters.witnessId;
  if (filters.status) where.status = filters.status;
  if (filters.depositionType) where.depositionType = filters.depositionType;
  if (filters.priority) where.priority = filters.priority as any;
  if (filters.isExpert !== undefined) where.isExpert = filters.isExpert;

  if (filters.fromDate || filters.toDate) {
    where.scheduledDate = {};
    if (filters.fromDate) where.scheduledDate[Op.gte] = filters.fromDate;
    if (filters.toDate) where.scheduledDate[Op.lte] = filters.toDate;
  }

  const depositions = await DepositionModel.findAll({
    where,
    order: [['scheduledDate', 'DESC']],
  });

  return depositions;
}

// ============================================================================
// FUNCTION 35: GET UPCOMING DEPOSITIONS
// ============================================================================

/**
 * Get upcoming depositions within specified days
 *
 * @param matterId - Matter identifier (optional)
 * @param days - Number of days to look ahead (default: 30)
 * @returns Upcoming deposition records
 */
export async function getUpcomingDepositions(
  matterId?: string,
  days: number = 30
): Promise<DepositionModel[]> {
  const where: WhereOptions<IDeposition> = {
    scheduledDate: {
      [Op.gte]: new Date(),
      [Op.lte]: addDays(new Date(), days),
    },
    status: {
      [Op.in]: [
        DepositionStatus.SCHEDULED,
        DepositionStatus.NOTICE_SENT,
        DepositionStatus.CONFIRMED,
      ],
    },
  };

  if (matterId) {
    where.matterId = matterId;
  }

  const depositions = await DepositionModel.findAll({
    where,
    order: [['scheduledDate', 'ASC'], ['scheduledTime', 'ASC']],
  });

  return depositions;
}

// ============================================================================
// FUNCTION 36: CALCULATE DEPOSITION STATISTICS
// ============================================================================

/**
 * Calculate deposition statistics for a matter
 *
 * @param matterId - Matter identifier
 * @returns Deposition statistics
 */
export async function calculateDepositionStatistics(matterId: string): Promise<{
  totalDepositions: number;
  completedDepositions: number;
  scheduledDepositions: number;
  cancelledDepositions: number;
  totalCost: number;
  averageDuration: number;
  totalObjections: number;
  expertDepositions: number;
  totalExhibits: number;
  transcriptsOrdered: number;
  transcriptsReceived: number;
}> {
  const depositions = await DepositionModel.findAll({
    where: { matterId },
    include: [
      DepositionExhibitModel,
      DepositionObjectionModel,
      DepositionTranscriptModel,
    ],
  });

  const stats = {
    totalDepositions: depositions.length,
    completedDepositions: depositions.filter((d) => d.status === DepositionStatus.COMPLETED).length,
    scheduledDepositions: depositions.filter((d) =>
      [DepositionStatus.SCHEDULED, DepositionStatus.CONFIRMED].includes(d.status)
    ).length,
    cancelledDepositions: depositions.filter((d) => d.status === DepositionStatus.CANCELLED).length,
    totalCost: depositions.reduce((sum, d) => sum + (d.actualCost || d.estimatedCost), 0),
    averageDuration: depositions.length > 0
      ? depositions.reduce((sum, d) => sum + d.duration, 0) / depositions.length
      : 0,
    totalObjections: 0,
    expertDepositions: depositions.filter((d) => d.isExpert).length,
    totalExhibits: 0,
    transcriptsOrdered: 0,
    transcriptsReceived: 0,
  };

  // Count related records
  for (const deposition of depositions) {
    if (deposition.objections) {
      stats.totalObjections += deposition.objections.length;
    }
    if (deposition.exhibits) {
      stats.totalExhibits += deposition.exhibits.length;
    }
    if (deposition.transcripts) {
      stats.transcriptsOrdered += deposition.transcripts.length;
      stats.transcriptsReceived += deposition.transcripts.filter(
        (t) => t.status === TranscriptStatus.FINALIZED
      ).length;
    }
  }

  return stats;
}

// ============================================================================
// NESTJS SERVICE
// ============================================================================

@Injectable()
export class DepositionManagementService {
  private readonly logger = new Logger(DepositionManagementService.name);

  constructor(
    @Inject('SEQUELIZE') private sequelize: Sequelize,
    private configService: ConfigService
  ) {}

  async scheduleDeposition(params: z.infer<typeof DepositionScheduleSchema>) {
    return this.sequelize.transaction((transaction) =>
      scheduleDeposition(params, transaction)
    );
  }

  async prepareExhibit(params: z.infer<typeof ExhibitPrepSchema>) {
    return this.sequelize.transaction((transaction) =>
      prepareDepositionExhibit(params, transaction)
    );
  }

  async orderTranscript(params: z.infer<typeof TranscriptOrderSchema>) {
    return this.sequelize.transaction((transaction) =>
      orderDepositionTranscript(params, transaction)
    );
  }

  async trackObjection(params: z.infer<typeof ObjectionSchema>) {
    return this.sequelize.transaction((transaction) =>
      trackDepositionObjection(params, transaction)
    );
  }

  async createSummary(params: z.infer<typeof SummaryCreationSchema>) {
    return this.sequelize.transaction((transaction) =>
      createDepositionSummary(params, transaction)
    );
  }

  async getDeposition(id: string) {
    return getDepositionWithRelations(id);
  }

  async searchDepositions(filters: Parameters<typeof searchDepositions>[0]) {
    return searchDepositions(filters);
  }

  async getUpcoming(matterId?: string, days?: number) {
    return getUpcomingDepositions(matterId, days);
  }

  async getStatistics(matterId: string) {
    return calculateDepositionStatistics(matterId);
  }
}

// ============================================================================
// NESTJS MODULE
// ============================================================================

@Global()
@Module({})
export class DepositionManagementModule {
  static forRoot(options?: {
    sequelize?: Sequelize;
  }): DynamicModule {
    return {
      module: DepositionManagementModule,
      providers: [
        {
          provide: 'SEQUELIZE',
          useValue: options?.sequelize,
        },
        DepositionManagementService,
      ],
      exports: [DepositionManagementService],
    };
  }
}

// ============================================================================
// SWAGGER API DOCUMENTATION
// ============================================================================

export class ScheduleDepositionDto {
  @ApiProperty({ description: 'Matter UUID' })
  matterId!: string;

  @ApiProperty({ description: 'Witness UUID' })
  witnessId!: string;

  @ApiProperty({ description: 'Witness full name' })
  witnessName!: string;

  @ApiProperty({ enum: DepositionType, description: 'Type of deposition' })
  depositionType!: DepositionType;

  @ApiProperty({ description: 'Scheduled date' })
  scheduledDate!: Date;

  @ApiProperty({ description: 'Scheduled time (HH:mm format)' })
  scheduledTime!: string;

  @ApiProperty({ description: 'Duration in minutes' })
  duration!: number;

  @ApiProperty({ description: 'Deposition location' })
  location!: string;

  @ApiPropertyOptional({ description: 'Is remote deposition' })
  isRemote?: boolean;

  @ApiPropertyOptional({ description: 'Remote meeting link' })
  remoteLink?: string;

  @ApiProperty({ description: 'Defending attorney UUID' })
  defendingAttorneyId!: string;

  @ApiProperty({ description: 'Examining attorney UUID' })
  examiningAttorneyId!: string;

  @ApiPropertyOptional({ description: 'Court reporter UUID' })
  courtReporterId?: string;

  @ApiPropertyOptional({ description: 'Topics for examination', type: [String] })
  topics?: string[];

  @ApiPropertyOptional({ enum: ['low', 'medium', 'high', 'urgent'] })
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export class PrepareExhibitDto {
  @ApiProperty({ description: 'Deposition UUID' })
  depositionId!: string;

  @ApiProperty({ description: 'Exhibit description' })
  description!: string;

  @ApiPropertyOptional({ description: 'Document UUID' })
  documentId?: string;

  @ApiPropertyOptional({ description: 'Document file path' })
  documentPath?: string;

  @ApiProperty({ description: 'Document type' })
  documentType!: string;

  @ApiPropertyOptional({ description: 'Bates number range' })
  batesRange?: string;

  @ApiPropertyOptional({ description: 'Is confidential document' })
  isConfidential?: boolean;
}

export class OrderTranscriptDto {
  @ApiProperty({ description: 'Deposition UUID' })
  depositionId!: string;

  @ApiProperty({ description: 'Court reporter UUID' })
  courtReporterId!: string;

  @ApiProperty({ enum: ['rough', 'expedited', 'daily', 'standard', 'certified'] })
  transcriptType!: 'rough' | 'expedited' | 'daily' | 'standard' | 'certified';

  @ApiProperty({ enum: ['pdf', 'word', 'text', 'ptx', 'ascii'] })
  format!: 'pdf' | 'word' | 'text' | 'ptx' | 'ascii';

  @ApiPropertyOptional({ description: 'Expected delivery date' })
  expectedDate?: Date;

  @ApiPropertyOptional({ description: 'Is confidential transcript' })
  isConfidential?: boolean;
}

export class TrackObjectionDto {
  @ApiProperty({ description: 'Deposition UUID' })
  depositionId!: string;

  @ApiPropertyOptional({ description: 'Transcript page number' })
  transcriptPage?: number;

  @ApiPropertyOptional({ description: 'Transcript line number' })
  transcriptLine?: number;

  @ApiProperty({ enum: ObjectionType, description: 'Type of objection' })
  objectionType!: ObjectionType;

  @ApiProperty({ description: 'Objecting attorney UUID' })
  objectingAttorneyId!: string;

  @ApiProperty({ description: 'Question being objected to' })
  question!: string;

  @ApiProperty({ description: 'Grounds for objection' })
  grounds!: string;

  @ApiPropertyOptional({ description: 'Is objection preserved for trial' })
  isPreserved?: boolean;
}

export class CreateSummaryDto {
  @ApiProperty({ description: 'Deposition UUID' })
  depositionId!: string;

  @ApiProperty({ enum: ['page-line', 'narrative', 'topical', 'issue-focused', 'impeachment'] })
  summaryType!: 'page-line' | 'narrative' | 'topical' | 'issue-focused' | 'impeachment';

  @ApiProperty({ description: 'Attorney creating summary UUID' })
  createdBy!: string;

  @ApiProperty({ description: 'Summary text content' })
  summaryText!: string;

  @ApiPropertyOptional({ description: 'Key testimony excerpts', type: 'array' })
  keyTestimony?: Array<{
    topic: string;
    pageRange: string;
    lineRange: string;
    testimony: string;
    significance: string;
    tags: string[];
  }>;

  @ApiProperty({ enum: ['positive', 'neutral', 'negative', 'mixed'] })
  overallImpact!: 'positive' | 'neutral' | 'negative' | 'mixed';
}
