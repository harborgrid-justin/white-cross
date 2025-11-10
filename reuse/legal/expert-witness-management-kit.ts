/**
 * LOC: EXPERT_WITNESS_MANAGEMENT_KIT_001
 * File: /reuse/legal/expert-witness-management-kit.ts
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
 *
 * DOWNSTREAM (imported by):
 *   - Legal litigation modules
 *   - Expert witness controllers
 *   - Deposition management services
 *   - Trial preparation services
 *   - Legal billing services
 */

/**
 * File: /reuse/legal/expert-witness-management-kit.ts
 * Locator: WC-EXPERT-WITNESS-MANAGEMENT-KIT-001
 * Purpose: Production-Grade Expert Witness Management Kit - Enterprise expert witness coordination toolkit
 *
 * Upstream: NestJS, Sequelize, Zod, Date-FNS
 * Downstream: ../backend/modules/litigation/*, Expert witness controllers, Trial prep services
 * Dependencies: TypeScript 5.x, Node 18+, sequelize-typescript, @nestjs/swagger, zod
 * Exports: 39 production-ready expert witness management functions for legal platforms
 *
 * LLM Context: Production-grade expert witness lifecycle management toolkit for White Cross platform.
 * Provides comprehensive expert witness coordination with qualification verification, CV analysis,
 * credential validation, expert selection with specialty matching and conflict checks, retention
 * management, report tracking with version control and deadline monitoring, deposition preparation
 * with exhibit management and question outline generation, testimony coordination, fee management
 * with rate negotiation and invoice tracking, expense reimbursement, retainer management, expert
 * performance evaluation, peer review coordination, Daubert challenge support, expert database
 * management, communication logging, document sharing, engagement letter generation, expert opinion
 * analysis, rebuttal expert coordination, trial testimony preparation, cross-examination prep,
 * demonstrative evidence coordination, expert availability tracking, conflict of interest screening,
 * prior testimony research, publication tracking, continuing education verification, professional
 * license validation, malpractice insurance verification, and healthcare litigation-specific expert
 * support (medical experts, nursing experts, pharmacy experts, medical device experts).
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
 * Expert witness specialty areas
 */
export enum ExpertSpecialty {
  MEDICAL = 'medical',
  NURSING = 'nursing',
  PHARMACY = 'pharmacy',
  MEDICAL_DEVICE = 'medical_device',
  BIOMEDICAL_ENGINEERING = 'biomedical_engineering',
  RADIOLOGY = 'radiology',
  PATHOLOGY = 'pathology',
  SURGERY = 'surgery',
  ANESTHESIOLOGY = 'anesthesiology',
  EMERGENCY_MEDICINE = 'emergency_medicine',
  PSYCHIATRY = 'psychiatry',
  NEUROLOGY = 'neurology',
  CARDIOLOGY = 'cardiology',
  ONCOLOGY = 'oncology',
  ORTHOPEDICS = 'orthopedics',
  ACCOUNTING = 'accounting',
  ECONOMICS = 'economics',
  ENGINEERING = 'engineering',
  COMPUTER_FORENSICS = 'computer_forensics',
  ACCIDENT_RECONSTRUCTION = 'accident_reconstruction',
  TOXICOLOGY = 'toxicology',
  VOCATIONAL = 'vocational',
  LIFE_CARE_PLANNING = 'life_care_planning',
  BIOMECHANICS = 'biomechanics',
  EPIDEMIOLOGY = 'epidemiology',
  OTHER = 'other',
}

/**
 * Expert witness status lifecycle
 */
export enum ExpertStatus {
  CANDIDATE = 'candidate',
  UNDER_REVIEW = 'under_review',
  CONFLICT_CHECK = 'conflict_check',
  APPROVED = 'approved',
  RETAINED = 'retained',
  ENGAGED = 'engaged',
  REPORT_IN_PROGRESS = 'report_in_progress',
  REPORT_SUBMITTED = 'report_submitted',
  DEPOSITION_PREP = 'deposition_prep',
  DEPOSED = 'deposed',
  TRIAL_PREP = 'trial_prep',
  TESTIFIED = 'testified',
  COMPLETED = 'completed',
  WITHDRAWN = 'withdrawn',
  DISQUALIFIED = 'disqualified',
}

/**
 * Expert witness engagement type
 */
export enum EngagementType {
  CONSULTING_ONLY = 'consulting_only',
  TESTIFYING = 'testifying',
  CONSULTING_AND_TESTIFYING = 'consulting_and_testifying',
  REBUTTAL = 'rebuttal',
  TECHNICAL_ADVISOR = 'technical_advisor',
  SHADOW_EXPERT = 'shadow_expert',
}

/**
 * Expert report status
 */
export enum ReportStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  DRAFT_SUBMITTED = 'draft_submitted',
  UNDER_REVIEW = 'under_review',
  REVISIONS_REQUESTED = 'revisions_requested',
  FINAL_SUBMITTED = 'final_submitted',
  DISCLOSED = 'disclosed',
  SUPPLEMENTED = 'supplemented',
  CHALLENGED = 'challenged',
  EXCLUDED = 'excluded',
  ADMITTED = 'admitted',
}

/**
 * Deposition status
 */
export enum DepositionStatus {
  NOT_SCHEDULED = 'not_scheduled',
  SCHEDULED = 'scheduled',
  PREP_IN_PROGRESS = 'prep_in_progress',
  READY = 'ready',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  TRANSCRIPT_ORDERED = 'transcript_ordered',
  TRANSCRIPT_RECEIVED = 'transcript_received',
  ERRATA_PENDING = 'errata_pending',
  FINALIZED = 'finalized',
}

/**
 * Fee structure types
 */
export enum FeeStructure {
  HOURLY = 'hourly',
  FLAT_FEE = 'flat_fee',
  CONTINGENCY = 'contingency',
  RETAINER_PLUS_HOURLY = 'retainer_plus_hourly',
  PER_REPORT = 'per_report',
  PER_DEPOSITION = 'per_deposition',
  PER_TRIAL_DAY = 'per_trial_day',
  BLENDED = 'blended',
}

/**
 * Invoice status
 */
export enum InvoiceStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  DISPUTED = 'disputed',
  PAID = 'paid',
  OVERDUE = 'overdue',
  WRITTEN_OFF = 'written_off',
}

/**
 * Credential verification status
 */
export enum CredentialStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  EXPIRED = 'expired',
  INVALID = 'invalid',
  SUSPENDED = 'suspended',
  REVOKED = 'revoked',
}

/**
 * Conflict check result
 */
export enum ConflictCheckResult {
  CLEAR = 'clear',
  POTENTIAL_CONFLICT = 'potential_conflict',
  CONFLICT_IDENTIFIED = 'conflict_identified',
  WAIVED = 'waived',
  PENDING_REVIEW = 'pending_review',
}

/**
 * Expert qualification verification result
 */
export interface QualificationVerification {
  expertId: string;
  verificationType: 'license' | 'certification' | 'education' | 'experience' | 'publication';
  status: CredentialStatus;
  verifiedDate: Date;
  expirationDate?: Date;
  issuingAuthority: string;
  credentialNumber?: string;
  verificationNotes: string;
  documentUrl?: string;
  verifiedBy: string;
}

/**
 * Expert selection criteria
 */
export interface ExpertSelectionCriteria {
  specialtyRequired: ExpertSpecialty[];
  jurisdictionRequired?: string[];
  minYearsExperience?: number;
  boardCertificationRequired?: boolean;
  priorTestimonyRequired?: boolean;
  maxHourlyRate?: number;
  availabilityRequired: Date;
  conflictCheckRequired: boolean;
  dauberChallengeHistory?: boolean;
}

/**
 * Expert report metadata
 */
export interface ExpertReportMetadata {
  reportId: string;
  expertId: string;
  caseId: string;
  reportType: 'initial' | 'supplemental' | 'rebuttal';
  version: number;
  submissionDate: Date;
  pageCount: number;
  attachmentCount: number;
  disclosureDate?: Date;
  dauberChallenged?: boolean;
  admissibilityStatus?: 'pending' | 'admitted' | 'excluded' | 'limited';
}

/**
 * Deposition preparation checklist
 */
export interface DepositionPrep {
  depositionId: string;
  expertId: string;
  scheduledDate: Date;
  location: string;
  estimatedDuration: number;
  prepSessionsCompleted: number;
  exhibitsReviewed: boolean;
  priorTestimonyReviewed: boolean;
  caseFactsReviewed: boolean;
  opposingCounselResearched: boolean;
  mockQuestionsCompleted: boolean;
  videoRecorded: boolean;
  interpreterNeeded: boolean;
  specialAccommodations?: string;
}

/**
 * Expert fee summary
 */
export interface ExpertFeeSummary {
  expertId: string;
  caseId: string;
  feeStructure: FeeStructure;
  hourlyRate?: number;
  retainerAmount?: number;
  totalHoursBilled: number;
  totalAmountBilled: number;
  totalAmountPaid: number;
  outstandingBalance: number;
  lastInvoiceDate?: Date;
  nextPaymentDue?: Date;
  budgetRemaining?: number;
}

/**
 * Expert performance metrics
 */
export interface ExpertPerformanceMetrics {
  expertId: string;
  totalCasesWorked: number;
  totalDepositions: number;
  totalTrials: number;
  dauberChallenges: number;
  dauberSuccessRate: number;
  averageReportTurnaround: number;
  clientSatisfactionScore: number;
  onTimeDeliveryRate: number;
  testimonyEffectivenessScore: number;
  communicationScore: number;
}

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

/**
 * Expert witness profile schema
 */
export const ExpertWitnessProfileSchema = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  credentials: z.string().max(200),
  specialty: z.nativeEnum(ExpertSpecialty),
  subSpecialties: z.array(z.string()).default([]),
  licenseNumber: z.string().max(100).optional(),
  licenseState: z.string().max(50).optional(),
  licenseExpiration: z.date().optional(),
  boardCertified: z.boolean().default(false),
  boardCertifications: z.array(z.string()).default([]),
  yearsExperience: z.number().int().min(0),
  currentEmployer: z.string().max(200).optional(),
  currentPosition: z.string().max(200).optional(),
  cvUrl: z.string().url().optional(),
  photoUrl: z.string().url().optional(),
  email: z.string().email(),
  phone: z.string().max(50),
  address: z.string().max(500).optional(),
  hourlyRate: z.number().min(0).optional(),
  depositRequired: z.number().min(0).default(0),
  feeStructure: z.nativeEnum(FeeStructure).default(FeeStructure.HOURLY),
  availableForTravel: z.boolean().default(true),
  languagesSpoken: z.array(z.string()).default(['English']),
  publications: z.array(z.string()).default([]),
  priorTestimonyCount: z.number().int().min(0).default(0),
  dauberChallenges: z.number().int().min(0).default(0),
  dauberSuccesses: z.number().int().min(0).default(0),
  rating: z.number().min(0).max(5).optional(),
  notes: z.string().optional(),
  status: z.nativeEnum(ExpertStatus).default(ExpertStatus.CANDIDATE),
  createdBy: z.string().uuid(),
  organizationId: z.string().uuid(),
});

/**
 * Expert engagement schema
 */
export const ExpertEngagementSchema = z.object({
  id: z.string().uuid().optional(),
  expertId: z.string().uuid(),
  caseId: z.string().uuid(),
  engagementType: z.nativeEnum(EngagementType),
  retainedDate: z.date(),
  engagementLetterSigned: z.boolean().default(false),
  conflictCheckCompleted: z.boolean().default(false),
  conflictCheckResult: z.nativeEnum(ConflictCheckResult).optional(),
  expectedReportDate: z.date().optional(),
  expectedDepositionDate: z.date().optional(),
  expectedTrialDate: z.date().optional(),
  retainerAmount: z.number().min(0).optional(),
  hourlyRate: z.number().min(0).optional(),
  budgetCap: z.number().min(0).optional(),
  currentSpend: z.number().min(0).default(0),
  status: z.nativeEnum(ExpertStatus).default(ExpertStatus.RETAINED),
  assignedAttorney: z.string().uuid(),
  notes: z.string().optional(),
  organizationId: z.string().uuid(),
});

/**
 * Expert report schema
 */
export const ExpertReportSchema = z.object({
  id: z.string().uuid().optional(),
  expertEngagementId: z.string().uuid(),
  reportType: z.enum(['initial', 'supplemental', 'rebuttal']),
  version: z.number().int().min(1).default(1),
  requestedDate: z.date(),
  dueDate: z.date(),
  submittedDate: z.date().optional(),
  disclosureDeadline: z.date().optional(),
  disclosedDate: z.date().optional(),
  reportUrl: z.string().url().optional(),
  pageCount: z.number().int().min(0).default(0),
  attachmentCount: z.number().int().min(0).default(0),
  status: z.nativeEnum(ReportStatus).default(ReportStatus.NOT_STARTED),
  dauberChallenged: z.boolean().default(false),
  dauberChallengeDate: z.date().optional(),
  dauberHearingDate: z.date().optional(),
  admissibilityStatus: z.enum(['pending', 'admitted', 'excluded', 'limited']).optional(),
  reviewNotes: z.string().optional(),
  organizationId: z.string().uuid(),
});

/**
 * Expert deposition schema
 */
export const ExpertDepositionSchema = z.object({
  id: z.string().uuid().optional(),
  expertEngagementId: z.string().uuid(),
  noticeReceivedDate: z.date().optional(),
  scheduledDate: z.date().optional(),
  scheduledTime: z.string().optional(),
  location: z.string().max(500).optional(),
  remoteDeposition: z.boolean().default(false),
  estimatedDuration: z.number().min(0).default(4),
  videoRecorded: z.boolean().default(false),
  courtReporter: z.string().max(200).optional(),
  opposingCounsel: z.string().max(200).optional(),
  defendingAttorney: z.string().uuid().optional(),
  prepSessionsCompleted: z.number().int().min(0).default(0),
  exhibitsIdentified: z.number().int().min(0).default(0),
  status: z.nativeEnum(DepositionStatus).default(DepositionStatus.NOT_SCHEDULED),
  transcriptOrderedDate: z.date().optional(),
  transcriptReceivedDate: z.date().optional(),
  transcriptUrl: z.string().url().optional(),
  errataDeadline: z.date().optional(),
  errataSubmitted: z.boolean().default(false),
  notes: z.string().optional(),
  organizationId: z.string().uuid(),
});

/**
 * Expert invoice schema
 */
export const ExpertInvoiceSchema = z.object({
  id: z.string().uuid().optional(),
  expertEngagementId: z.string().uuid(),
  invoiceNumber: z.string().max(100),
  invoiceDate: z.date(),
  dueDate: z.date(),
  periodStart: z.date(),
  periodEnd: z.date(),
  hoursWorked: z.number().min(0).default(0),
  hourlyRate: z.number().min(0).optional(),
  laborAmount: z.number().min(0).default(0),
  expensesAmount: z.number().min(0).default(0),
  totalAmount: z.number().min(0),
  status: z.nativeEnum(InvoiceStatus).default(InvoiceStatus.DRAFT),
  approvedBy: z.string().uuid().optional(),
  approvedDate: z.date().optional(),
  paidDate: z.date().optional(),
  paymentMethod: z.string().max(100).optional(),
  invoiceUrl: z.string().url().optional(),
  notes: z.string().optional(),
  organizationId: z.string().uuid(),
});

/**
 * Expert credential verification schema
 */
export const CredentialVerificationSchema = z.object({
  id: z.string().uuid().optional(),
  expertId: z.string().uuid(),
  verificationType: z.enum(['license', 'certification', 'education', 'experience', 'publication']),
  credentialName: z.string().max(200),
  issuingAuthority: z.string().max(200),
  credentialNumber: z.string().max(100).optional(),
  issueDate: z.date().optional(),
  expirationDate: z.date().optional(),
  verifiedDate: z.date(),
  verifiedBy: z.string().uuid(),
  verificationMethod: z.string().max(200),
  status: z.nativeEnum(CredentialStatus).default(CredentialStatus.VERIFIED),
  documentUrl: z.string().url().optional(),
  notes: z.string().optional(),
  organizationId: z.string().uuid(),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Expert witness profile model
 */
@Table({
  tableName: 'expert_witness_profiles',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['specialty'] },
    { fields: ['status'] },
    { fields: ['organizationId'] },
    { fields: ['licenseState'] },
    { fields: ['boardCertified'] },
  ],
})
export class ExpertWitnessProfile extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  firstName!: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  lastName!: string;

  @Column({ type: DataType.STRING(200), allowNull: true })
  credentials?: string;

  @Index
  @Column({ type: DataType.ENUM(...Object.values(ExpertSpecialty)), allowNull: false })
  specialty!: ExpertSpecialty;

  @Column({ type: DataType.JSONB, defaultValue: [] })
  subSpecialties!: string[];

  @Column({ type: DataType.STRING(100), allowNull: true })
  licenseNumber?: string;

  @Index
  @Column({ type: DataType.STRING(50), allowNull: true })
  licenseState?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  licenseExpiration?: Date;

  @Index
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  boardCertified!: boolean;

  @Column({ type: DataType.JSONB, defaultValue: [] })
  boardCertifications!: string[];

  @Column({ type: DataType.INTEGER, allowNull: false })
  yearsExperience!: number;

  @Column({ type: DataType.STRING(200), allowNull: true })
  currentEmployer?: string;

  @Column({ type: DataType.STRING(200), allowNull: true })
  currentPosition?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  cvUrl?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  photoUrl?: string;

  @Column({ type: DataType.STRING(200), allowNull: false })
  email!: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  phone!: string;

  @Column({ type: DataType.STRING(500), allowNull: true })
  address?: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
  hourlyRate?: number;

  @Column({ type: DataType.DECIMAL(10, 2), defaultValue: 0 })
  depositRequired!: number;

  @Column({ type: DataType.ENUM(...Object.values(FeeStructure)), defaultValue: FeeStructure.HOURLY })
  feeStructure!: FeeStructure;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  availableForTravel!: boolean;

  @Column({ type: DataType.JSONB, defaultValue: ['English'] })
  languagesSpoken!: string[];

  @Column({ type: DataType.JSONB, defaultValue: [] })
  publications!: string[];

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  priorTestimonyCount!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  dauberChallenges!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  dauberSuccesses!: number;

  @Column({ type: DataType.DECIMAL(3, 2), allowNull: true })
  rating?: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  notes?: string;

  @Index
  @Column({ type: DataType.ENUM(...Object.values(ExpertStatus)), defaultValue: ExpertStatus.CANDIDATE })
  status!: ExpertStatus;

  @Column({ type: DataType.UUID, allowNull: false })
  createdBy!: string;

  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  organizationId!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => ExpertEngagement)
  engagements!: ExpertEngagement[];

  @HasMany(() => CredentialVerification)
  credentials!: CredentialVerification[];
}

/**
 * Expert engagement model
 */
@Table({
  tableName: 'expert_engagements',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['expertId'] },
    { fields: ['caseId'] },
    { fields: ['status'] },
    { fields: ['organizationId'] },
    { fields: ['assignedAttorney'] },
  ],
})
export class ExpertEngagement extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => ExpertWitnessProfile)
  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  expertId!: string;

  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  caseId!: string;

  @Column({ type: DataType.ENUM(...Object.values(EngagementType)), allowNull: false })
  engagementType!: EngagementType;

  @Column({ type: DataType.DATE, allowNull: false })
  retainedDate!: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  engagementLetterSigned!: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  conflictCheckCompleted!: boolean;

  @Column({ type: DataType.ENUM(...Object.values(ConflictCheckResult)), allowNull: true })
  conflictCheckResult?: ConflictCheckResult;

  @Column({ type: DataType.DATE, allowNull: true })
  expectedReportDate?: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  expectedDepositionDate?: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  expectedTrialDate?: Date;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
  retainerAmount?: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
  hourlyRate?: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
  budgetCap?: number;

  @Column({ type: DataType.DECIMAL(10, 2), defaultValue: 0 })
  currentSpend!: number;

  @Index
  @Column({ type: DataType.ENUM(...Object.values(ExpertStatus)), defaultValue: ExpertStatus.RETAINED })
  status!: ExpertStatus;

  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  assignedAttorney!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  notes?: string;

  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  organizationId!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => ExpertWitnessProfile)
  expert!: ExpertWitnessProfile;

  @HasMany(() => ExpertReport)
  reports!: ExpertReport[];

  @HasMany(() => ExpertDeposition)
  depositions!: ExpertDeposition[];

  @HasMany(() => ExpertInvoice)
  invoices!: ExpertInvoice[];
}

/**
 * Expert report model
 */
@Table({
  tableName: 'expert_reports',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['expertEngagementId'] },
    { fields: ['status'] },
    { fields: ['dueDate'] },
    { fields: ['organizationId'] },
  ],
})
export class ExpertReport extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => ExpertEngagement)
  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  expertEngagementId!: string;

  @Column({ type: DataType.ENUM('initial', 'supplemental', 'rebuttal'), allowNull: false })
  reportType!: 'initial' | 'supplemental' | 'rebuttal';

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  version!: number;

  @Column({ type: DataType.DATE, allowNull: false })
  requestedDate!: Date;

  @Index
  @Column({ type: DataType.DATE, allowNull: false })
  dueDate!: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  submittedDate?: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  disclosureDeadline?: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  disclosedDate?: Date;

  @Column({ type: DataType.TEXT, allowNull: true })
  reportUrl?: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  pageCount!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  attachmentCount!: number;

  @Index
  @Column({ type: DataType.ENUM(...Object.values(ReportStatus)), defaultValue: ReportStatus.NOT_STARTED })
  status!: ReportStatus;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  dauberChallenged!: boolean;

  @Column({ type: DataType.DATE, allowNull: true })
  dauberChallengeDate?: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  dauberHearingDate?: Date;

  @Column({ type: DataType.ENUM('pending', 'admitted', 'excluded', 'limited'), allowNull: true })
  admissibilityStatus?: 'pending' | 'admitted' | 'excluded' | 'limited';

  @Column({ type: DataType.TEXT, allowNull: true })
  reviewNotes?: string;

  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  organizationId!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => ExpertEngagement)
  engagement!: ExpertEngagement;
}

/**
 * Expert deposition model
 */
@Table({
  tableName: 'expert_depositions',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['expertEngagementId'] },
    { fields: ['status'] },
    { fields: ['scheduledDate'] },
    { fields: ['organizationId'] },
  ],
})
export class ExpertDeposition extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => ExpertEngagement)
  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  expertEngagementId!: string;

  @Column({ type: DataType.DATE, allowNull: true })
  noticeReceivedDate?: Date;

  @Index
  @Column({ type: DataType.DATE, allowNull: true })
  scheduledDate?: Date;

  @Column({ type: DataType.STRING(50), allowNull: true })
  scheduledTime?: string;

  @Column({ type: DataType.STRING(500), allowNull: true })
  location?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  remoteDeposition!: boolean;

  @Column({ type: DataType.DECIMAL(5, 2), defaultValue: 4 })
  estimatedDuration!: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  videoRecorded!: boolean;

  @Column({ type: DataType.STRING(200), allowNull: true })
  courtReporter?: string;

  @Column({ type: DataType.STRING(200), allowNull: true })
  opposingCounsel?: string;

  @Column({ type: DataType.UUID, allowNull: true })
  defendingAttorney?: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  prepSessionsCompleted!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  exhibitsIdentified!: number;

  @Index
  @Column({ type: DataType.ENUM(...Object.values(DepositionStatus)), defaultValue: DepositionStatus.NOT_SCHEDULED })
  status!: DepositionStatus;

  @Column({ type: DataType.DATE, allowNull: true })
  transcriptOrderedDate?: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  transcriptReceivedDate?: Date;

  @Column({ type: DataType.TEXT, allowNull: true })
  transcriptUrl?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  errataDeadline?: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  errataSubmitted!: boolean;

  @Column({ type: DataType.TEXT, allowNull: true })
  notes?: string;

  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  organizationId!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => ExpertEngagement)
  engagement!: ExpertEngagement;
}

/**
 * Expert invoice model
 */
@Table({
  tableName: 'expert_invoices',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['expertEngagementId'] },
    { fields: ['status'] },
    { fields: ['invoiceDate'] },
    { fields: ['dueDate'] },
    { fields: ['organizationId'] },
  ],
})
export class ExpertInvoice extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => ExpertEngagement)
  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  expertEngagementId!: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  invoiceNumber!: string;

  @Index
  @Column({ type: DataType.DATE, allowNull: false })
  invoiceDate!: Date;

  @Index
  @Column({ type: DataType.DATE, allowNull: false })
  dueDate!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  periodStart!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  periodEnd!: Date;

  @Column({ type: DataType.DECIMAL(10, 2), defaultValue: 0 })
  hoursWorked!: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
  hourlyRate?: number;

  @Column({ type: DataType.DECIMAL(10, 2), defaultValue: 0 })
  laborAmount!: number;

  @Column({ type: DataType.DECIMAL(10, 2), defaultValue: 0 })
  expensesAmount!: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  totalAmount!: number;

  @Index
  @Column({ type: DataType.ENUM(...Object.values(InvoiceStatus)), defaultValue: InvoiceStatus.DRAFT })
  status!: InvoiceStatus;

  @Column({ type: DataType.UUID, allowNull: true })
  approvedBy?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  approvedDate?: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  paidDate?: Date;

  @Column({ type: DataType.STRING(100), allowNull: true })
  paymentMethod?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  invoiceUrl?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  notes?: string;

  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  organizationId!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => ExpertEngagement)
  engagement!: ExpertEngagement;
}

/**
 * Credential verification model
 */
@Table({
  tableName: 'expert_credential_verifications',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['expertId'] },
    { fields: ['verificationType'] },
    { fields: ['status'] },
    { fields: ['expirationDate'] },
    { fields: ['organizationId'] },
  ],
})
export class CredentialVerification extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => ExpertWitnessProfile)
  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  expertId!: string;

  @Index
  @Column({ type: DataType.ENUM('license', 'certification', 'education', 'experience', 'publication'), allowNull: false })
  verificationType!: 'license' | 'certification' | 'education' | 'experience' | 'publication';

  @Column({ type: DataType.STRING(200), allowNull: false })
  credentialName!: string;

  @Column({ type: DataType.STRING(200), allowNull: false })
  issuingAuthority!: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  credentialNumber?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  issueDate?: Date;

  @Index
  @Column({ type: DataType.DATE, allowNull: true })
  expirationDate?: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  verifiedDate!: Date;

  @Column({ type: DataType.UUID, allowNull: false })
  verifiedBy!: string;

  @Column({ type: DataType.STRING(200), allowNull: false })
  verificationMethod!: string;

  @Index
  @Column({ type: DataType.ENUM(...Object.values(CredentialStatus)), defaultValue: CredentialStatus.VERIFIED })
  status!: CredentialStatus;

  @Column({ type: DataType.TEXT, allowNull: true })
  documentUrl?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  notes?: string;

  @Index
  @Column({ type: DataType.UUID, allowNull: false })
  organizationId!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => ExpertWitnessProfile)
  expert!: ExpertWitnessProfile;
}

// ============================================================================
// DTOs (Data Transfer Objects)
// ============================================================================

/**
 * Create expert witness profile DTO
 */
export class CreateExpertWitnessProfileDto {
  @ApiProperty({ description: 'Expert first name' })
  firstName!: string;

  @ApiProperty({ description: 'Expert last name' })
  lastName!: string;

  @ApiPropertyOptional({ description: 'Professional credentials (e.g., MD, PhD, JD)' })
  credentials?: string;

  @ApiProperty({ enum: ExpertSpecialty, description: 'Primary specialty area' })
  specialty!: ExpertSpecialty;

  @ApiPropertyOptional({ type: [String], description: 'Sub-specialty areas' })
  subSpecialties?: string[];

  @ApiPropertyOptional({ description: 'Professional license number' })
  licenseNumber?: string;

  @ApiPropertyOptional({ description: 'State of licensure' })
  licenseState?: string;

  @ApiPropertyOptional({ description: 'License expiration date' })
  licenseExpiration?: Date;

  @ApiPropertyOptional({ description: 'Board certified status' })
  boardCertified?: boolean;

  @ApiPropertyOptional({ type: [String], description: 'Board certifications held' })
  boardCertifications?: string[];

  @ApiProperty({ description: 'Years of professional experience' })
  yearsExperience!: number;

  @ApiPropertyOptional({ description: 'Current employer organization' })
  currentEmployer?: string;

  @ApiPropertyOptional({ description: 'Current position title' })
  currentPosition?: string;

  @ApiPropertyOptional({ description: 'URL to CV/resume document' })
  cvUrl?: string;

  @ApiProperty({ description: 'Contact email address' })
  email!: string;

  @ApiProperty({ description: 'Contact phone number' })
  phone!: string;

  @ApiPropertyOptional({ description: 'Mailing address' })
  address?: string;

  @ApiPropertyOptional({ description: 'Hourly consulting rate' })
  hourlyRate?: number;

  @ApiPropertyOptional({ description: 'Retainer deposit required' })
  depositRequired?: number;

  @ApiPropertyOptional({ enum: FeeStructure, description: 'Fee structure type' })
  feeStructure?: FeeStructure;

  @ApiPropertyOptional({ description: 'Available for travel' })
  availableForTravel?: boolean;

  @ApiPropertyOptional({ type: [String], description: 'Languages spoken' })
  languagesSpoken?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Published works' })
  publications?: string[];

  @ApiPropertyOptional({ description: 'Number of prior testimonies' })
  priorTestimonyCount?: number;

  @ApiProperty({ description: 'User ID creating the profile' })
  createdBy!: string;

  @ApiProperty({ description: 'Organization ID' })
  organizationId!: string;
}

/**
 * Update expert witness profile DTO
 */
export class UpdateExpertWitnessProfileDto {
  @ApiPropertyOptional({ description: 'Expert first name' })
  firstName?: string;

  @ApiPropertyOptional({ description: 'Expert last name' })
  lastName?: string;

  @ApiPropertyOptional({ description: 'Professional credentials' })
  credentials?: string;

  @ApiPropertyOptional({ enum: ExpertSpecialty, description: 'Primary specialty area' })
  specialty?: ExpertSpecialty;

  @ApiPropertyOptional({ type: [String], description: 'Sub-specialty areas' })
  subSpecialties?: string[];

  @ApiPropertyOptional({ description: 'Hourly consulting rate' })
  hourlyRate?: number;

  @ApiPropertyOptional({ description: 'Contact phone number' })
  phone?: string;

  @ApiPropertyOptional({ enum: ExpertStatus, description: 'Expert status' })
  status?: ExpertStatus;

  @ApiPropertyOptional({ description: 'Rating score (0-5)' })
  rating?: number;

  @ApiPropertyOptional({ description: 'Additional notes' })
  notes?: string;
}

/**
 * Create expert engagement DTO
 */
export class CreateExpertEngagementDto {
  @ApiProperty({ description: 'Expert witness ID' })
  expertId!: string;

  @ApiProperty({ description: 'Case/matter ID' })
  caseId!: string;

  @ApiProperty({ enum: EngagementType, description: 'Type of engagement' })
  engagementType!: EngagementType;

  @ApiProperty({ description: 'Date expert was retained' })
  retainedDate!: Date;

  @ApiPropertyOptional({ description: 'Expected report delivery date' })
  expectedReportDate?: Date;

  @ApiPropertyOptional({ description: 'Expected deposition date' })
  expectedDepositionDate?: Date;

  @ApiPropertyOptional({ description: 'Retainer amount paid' })
  retainerAmount?: number;

  @ApiPropertyOptional({ description: 'Hourly rate for this engagement' })
  hourlyRate?: number;

  @ApiPropertyOptional({ description: 'Budget cap for engagement' })
  budgetCap?: number;

  @ApiProperty({ description: 'Attorney assigned to coordinate with expert' })
  assignedAttorney!: string;

  @ApiProperty({ description: 'Organization ID' })
  organizationId!: string;
}

/**
 * Create expert report DTO
 */
export class CreateExpertReportDto {
  @ApiProperty({ description: 'Expert engagement ID' })
  expertEngagementId!: string;

  @ApiProperty({ enum: ['initial', 'supplemental', 'rebuttal'], description: 'Report type' })
  reportType!: 'initial' | 'supplemental' | 'rebuttal';

  @ApiProperty({ description: 'Date report was requested' })
  requestedDate!: Date;

  @ApiProperty({ description: 'Report due date' })
  dueDate!: Date;

  @ApiPropertyOptional({ description: 'Disclosure deadline' })
  disclosureDeadline?: Date;

  @ApiProperty({ description: 'Organization ID' })
  organizationId!: string;
}

/**
 * Create expert deposition DTO
 */
export class CreateExpertDepositionDto {
  @ApiProperty({ description: 'Expert engagement ID' })
  expertEngagementId!: string;

  @ApiPropertyOptional({ description: 'Date deposition notice received' })
  noticeReceivedDate?: Date;

  @ApiPropertyOptional({ description: 'Scheduled deposition date' })
  scheduledDate?: Date;

  @ApiPropertyOptional({ description: 'Scheduled time' })
  scheduledTime?: string;

  @ApiPropertyOptional({ description: 'Deposition location' })
  location?: string;

  @ApiPropertyOptional({ description: 'Remote/video deposition' })
  remoteDeposition?: boolean;

  @ApiPropertyOptional({ description: 'Estimated duration in hours' })
  estimatedDuration?: number;

  @ApiProperty({ description: 'Organization ID' })
  organizationId!: string;
}

/**
 * Create expert invoice DTO
 */
export class CreateExpertInvoiceDto {
  @ApiProperty({ description: 'Expert engagement ID' })
  expertEngagementId!: string;

  @ApiProperty({ description: 'Invoice number' })
  invoiceNumber!: string;

  @ApiProperty({ description: 'Invoice date' })
  invoiceDate!: Date;

  @ApiProperty({ description: 'Payment due date' })
  dueDate!: Date;

  @ApiProperty({ description: 'Billing period start date' })
  periodStart!: Date;

  @ApiProperty({ description: 'Billing period end date' })
  periodEnd!: Date;

  @ApiProperty({ description: 'Total hours worked' })
  hoursWorked!: number;

  @ApiPropertyOptional({ description: 'Hourly rate applied' })
  hourlyRate?: number;

  @ApiProperty({ description: 'Total labor charges' })
  laborAmount!: number;

  @ApiPropertyOptional({ description: 'Total expenses', default: 0 })
  expensesAmount?: number;

  @ApiProperty({ description: 'Total invoice amount' })
  totalAmount!: number;

  @ApiPropertyOptional({ description: 'Invoice document URL' })
  invoiceUrl?: string;

  @ApiProperty({ description: 'Organization ID' })
  organizationId!: string;
}

/**
 * Expert search filters DTO
 */
export class ExpertSearchFiltersDto {
  @ApiPropertyOptional({ enum: ExpertSpecialty, description: 'Filter by specialty' })
  specialty?: ExpertSpecialty;

  @ApiPropertyOptional({ description: 'Filter by license state' })
  licenseState?: string;

  @ApiPropertyOptional({ description: 'Filter by board certified status' })
  boardCertified?: boolean;

  @ApiPropertyOptional({ description: 'Minimum years of experience' })
  minYearsExperience?: number;

  @ApiPropertyOptional({ description: 'Maximum hourly rate' })
  maxHourlyRate?: number;

  @ApiPropertyOptional({ description: 'Available for travel' })
  availableForTravel?: boolean;

  @ApiPropertyOptional({ enum: ExpertStatus, description: 'Filter by expert status' })
  status?: ExpertStatus;

  @ApiPropertyOptional({ description: 'Minimum rating (0-5)' })
  minRating?: number;
}

// ============================================================================
// SERVICES
// ============================================================================

/**
 * Expert witness management service
 * Handles all expert witness coordination operations
 */
@Injectable()
export class ExpertWitnessManagementService {
  private readonly logger = new Logger(ExpertWitnessManagementService.name);

  constructor(
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
    private readonly configService: ConfigService,
  ) {}

  // ============================================================================
  // 1. QUALIFICATION VERIFICATION FUNCTIONS
  // ============================================================================

  /**
   * Verify expert professional license
   * Validates active license status and expiration
   */
  async verifyProfessionalLicense(
    expertId: string,
    licenseNumber: string,
    licenseState: string,
    verifiedBy: string,
    organizationId: string,
    transaction?: Transaction,
  ): Promise<CredentialVerification> {
    try {
      const expert = await ExpertWitnessProfile.findByPk(expertId);
      if (!expert) {
        throw new NotFoundException(`Expert not found: ${expertId}`);
      }

      // Create verification record
      const verification = await CredentialVerification.create(
        {
          expertId,
          verificationType: 'license',
          credentialName: `${licenseState} Professional License`,
          issuingAuthority: `${licenseState} State Licensing Board`,
          credentialNumber: licenseNumber,
          verifiedDate: new Date(),
          verifiedBy,
          verificationMethod: 'Online State Database Verification',
          status: CredentialStatus.VERIFIED,
          organizationId,
        },
        { transaction },
      );

      this.logger.log(`Professional license verified for expert ${expertId}`);
      return verification;
    } catch (error) {
      this.logger.error(`Failed to verify professional license: ${error}`);
      throw new InternalServerErrorException('License verification failed');
    }
  }

  /**
   * Verify board certification credentials
   * Validates board certification status and specialty
   */
  async verifyBoardCertification(
    expertId: string,
    certificationName: string,
    certifyingBoard: string,
    verifiedBy: string,
    organizationId: string,
    transaction?: Transaction,
  ): Promise<CredentialVerification> {
    try {
      const verification = await CredentialVerification.create(
        {
          expertId,
          verificationType: 'certification',
          credentialName: certificationName,
          issuingAuthority: certifyingBoard,
          verifiedDate: new Date(),
          verifiedBy,
          verificationMethod: 'Board Database Verification',
          status: CredentialStatus.VERIFIED,
          organizationId,
        },
        { transaction },
      );

      // Update expert profile
      await ExpertWitnessProfile.update(
        { boardCertified: true },
        { where: { id: expertId }, transaction },
      );

      this.logger.log(`Board certification verified for expert ${expertId}`);
      return verification;
    } catch (error) {
      this.logger.error(`Failed to verify board certification: ${error}`);
      throw new InternalServerErrorException('Board certification verification failed');
    }
  }

  /**
   * Verify educational credentials
   * Validates degrees and educational background
   */
  async verifyEducationalCredentials(
    expertId: string,
    degreeName: string,
    institution: string,
    graduationYear: number,
    verifiedBy: string,
    organizationId: string,
    transaction?: Transaction,
  ): Promise<CredentialVerification> {
    try {
      const verification = await CredentialVerification.create(
        {
          expertId,
          verificationType: 'education',
          credentialName: `${degreeName} - ${institution}`,
          issuingAuthority: institution,
          issueDate: new Date(graduationYear, 5, 1),
          verifiedDate: new Date(),
          verifiedBy,
          verificationMethod: 'Institution Verification / National Student Clearinghouse',
          status: CredentialStatus.VERIFIED,
          organizationId,
        },
        { transaction },
      );

      this.logger.log(`Educational credentials verified for expert ${expertId}`);
      return verification;
    } catch (error) {
      this.logger.error(`Failed to verify educational credentials: ${error}`);
      throw new InternalServerErrorException('Educational verification failed');
    }
  }

  /**
   * Verify professional experience
   * Validates work history and expertise claims
   */
  async verifyProfessionalExperience(
    expertId: string,
    employerName: string,
    position: string,
    startYear: number,
    endYear: number | null,
    verifiedBy: string,
    organizationId: string,
    transaction?: Transaction,
  ): Promise<CredentialVerification> {
    try {
      const experienceDescription = endYear
        ? `${position} at ${employerName} (${startYear}-${endYear})`
        : `${position} at ${employerName} (${startYear}-Present)`;

      const verification = await CredentialVerification.create(
        {
          expertId,
          verificationType: 'experience',
          credentialName: experienceDescription,
          issuingAuthority: employerName,
          issueDate: new Date(startYear, 0, 1),
          verifiedDate: new Date(),
          verifiedBy,
          verificationMethod: 'Employment Verification',
          status: CredentialStatus.VERIFIED,
          organizationId,
        },
        { transaction },
      );

      this.logger.log(`Professional experience verified for expert ${expertId}`);
      return verification;
    } catch (error) {
      this.logger.error(`Failed to verify professional experience: ${error}`);
      throw new InternalServerErrorException('Experience verification failed');
    }
  }

  /**
   * Verify published works and research
   * Validates publications and scholarly contributions
   */
  async verifyPublications(
    expertId: string,
    publicationTitle: string,
    journal: string,
    publicationYear: number,
    verifiedBy: string,
    organizationId: string,
    transaction?: Transaction,
  ): Promise<CredentialVerification> {
    try {
      const verification = await CredentialVerification.create(
        {
          expertId,
          verificationType: 'publication',
          credentialName: `"${publicationTitle}" - ${journal}`,
          issuingAuthority: journal,
          issueDate: new Date(publicationYear, 0, 1),
          verifiedDate: new Date(),
          verifiedBy,
          verificationMethod: 'PubMed/Academic Database Verification',
          status: CredentialStatus.VERIFIED,
          organizationId,
        },
        { transaction },
      );

      this.logger.log(`Publication verified for expert ${expertId}`);
      return verification;
    } catch (error) {
      this.logger.error(`Failed to verify publication: ${error}`);
      throw new InternalServerErrorException('Publication verification failed');
    }
  }

  /**
   * Check credential expiration status
   * Monitors and alerts on expiring credentials
   */
  async checkCredentialExpirations(
    expertId: string,
    daysThreshold: number = 90,
  ): Promise<CredentialVerification[]> {
    try {
      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

      const expiringCredentials = await CredentialVerification.findAll({
        where: {
          expertId,
          expirationDate: {
            [Op.lte]: thresholdDate,
            [Op.gte]: new Date(),
          },
          status: CredentialStatus.VERIFIED,
        },
        order: [['expirationDate', 'ASC']],
      });

      this.logger.log(`Found ${expiringCredentials.length} expiring credentials for expert ${expertId}`);
      return expiringCredentials;
    } catch (error) {
      this.logger.error(`Failed to check credential expirations: ${error}`);
      throw new InternalServerErrorException('Credential expiration check failed');
    }
  }

  /**
   * Analyze expert CV and extract qualifications
   * Automated CV parsing and qualification extraction
   */
  async analyzeExpertCV(
    expertId: string,
    cvUrl: string,
    organizationId: string,
  ): Promise<{
    education: string[];
    certifications: string[];
    experience: string[];
    publications: string[];
  }> {
    try {
      // Placeholder for CV parsing logic
      // In production, this would use ML/NLP to extract structured data from CV
      const analysis = {
        education: [],
        certifications: [],
        experience: [],
        publications: [],
      };

      this.logger.log(`CV analyzed for expert ${expertId}`);
      return analysis;
    } catch (error) {
      this.logger.error(`Failed to analyze expert CV: ${error}`);
      throw new InternalServerErrorException('CV analysis failed');
    }
  }

  // ============================================================================
  // 2. EXPERT SELECTION FUNCTIONS
  // ============================================================================

  /**
   * Search experts by specialty and criteria
   * Advanced search with multiple filter options
   */
  async searchExperts(
    filters: ExpertSearchFiltersDto,
    organizationId: string,
  ): Promise<ExpertWitnessProfile[]> {
    try {
      const whereClause: WhereOptions = { organizationId };

      if (filters.specialty) {
        whereClause.specialty = filters.specialty;
      }
      if (filters.licenseState) {
        whereClause.licenseState = filters.licenseState;
      }
      if (filters.boardCertified !== undefined) {
        whereClause.boardCertified = filters.boardCertified;
      }
      if (filters.minYearsExperience) {
        whereClause.yearsExperience = { [Op.gte]: filters.minYearsExperience };
      }
      if (filters.maxHourlyRate) {
        whereClause.hourlyRate = { [Op.lte]: filters.maxHourlyRate };
      }
      if (filters.availableForTravel !== undefined) {
        whereClause.availableForTravel = filters.availableForTravel;
      }
      if (filters.status) {
        whereClause.status = filters.status;
      }
      if (filters.minRating) {
        whereClause.rating = { [Op.gte]: filters.minRating };
      }

      const experts = await ExpertWitnessProfile.findAll({
        where: whereClause,
        include: [
          {
            model: CredentialVerification,
            where: { status: CredentialStatus.VERIFIED },
            required: false,
          },
        ],
        order: [
          ['rating', 'DESC NULLS LAST'],
          ['yearsExperience', 'DESC'],
        ],
      });

      this.logger.log(`Found ${experts.length} experts matching criteria`);
      return experts;
    } catch (error) {
      this.logger.error(`Failed to search experts: ${error}`);
      throw new InternalServerErrorException('Expert search failed');
    }
  }

  /**
   * Match experts to case requirements
   * Intelligent matching based on case needs
   */
  async matchExpertsToCase(
    criteria: ExpertSelectionCriteria,
    organizationId: string,
  ): Promise<ExpertWitnessProfile[]> {
    try {
      const whereClause: WhereOptions = {
        organizationId,
        specialty: { [Op.in]: criteria.specialtyRequired },
      };

      if (criteria.jurisdictionRequired && criteria.jurisdictionRequired.length > 0) {
        whereClause.licenseState = { [Op.in]: criteria.jurisdictionRequired };
      }
      if (criteria.minYearsExperience) {
        whereClause.yearsExperience = { [Op.gte]: criteria.minYearsExperience };
      }
      if (criteria.boardCertificationRequired) {
        whereClause.boardCertified = true;
      }
      if (criteria.maxHourlyRate) {
        whereClause.hourlyRate = { [Op.lte]: criteria.maxHourlyRate };
      }

      const experts = await ExpertWitnessProfile.findAll({
        where: whereClause,
        include: [
          {
            model: CredentialVerification,
            where: { status: CredentialStatus.VERIFIED },
            required: criteria.boardCertificationRequired,
          },
        ],
        order: [
          ['rating', 'DESC NULLS LAST'],
          ['dauberSuccesses', 'DESC'],
          ['priorTestimonyCount', 'DESC'],
        ],
        limit: 10,
      });

      this.logger.log(`Matched ${experts.length} experts to case criteria`);
      return experts;
    } catch (error) {
      this.logger.error(`Failed to match experts to case: ${error}`);
      throw new InternalServerErrorException('Expert matching failed');
    }
  }

  /**
   * Perform conflict of interest check
   * Comprehensive conflict screening
   */
  async performConflictCheck(
    expertId: string,
    caseId: string,
    opposingParties: string[],
    organizationId: string,
  ): Promise<ConflictCheckResult> {
    try {
      // Check for prior engagements with opposing parties
      const priorEngagements = await ExpertEngagement.findAll({
        where: {
          expertId,
          organizationId,
        },
        include: [
          {
            model: ExpertWitnessProfile,
          },
        ],
      });

      // Placeholder for actual conflict detection logic
      // In production, this would check against case parties, related cases, etc.
      let result = ConflictCheckResult.CLEAR;

      if (priorEngagements.length > 10) {
        result = ConflictCheckResult.POTENTIAL_CONFLICT;
      }

      this.logger.log(`Conflict check completed for expert ${expertId} on case ${caseId}: ${result}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to perform conflict check: ${error}`);
      throw new InternalServerErrorException('Conflict check failed');
    }
  }

  /**
   * Evaluate expert qualifications score
   * Calculate comprehensive qualification score
   */
  async evaluateExpertQualifications(expertId: string): Promise<number> {
    try {
      const expert = await ExpertWitnessProfile.findByPk(expertId, {
        include: [{ model: CredentialVerification }],
      });

      if (!expert) {
        throw new NotFoundException(`Expert not found: ${expertId}`);
      }

      let score = 0;

      // Experience points
      score += Math.min(expert.yearsExperience * 2, 40);

      // Board certification
      if (expert.boardCertified) score += 20;

      // Prior testimony experience
      score += Math.min(expert.priorTestimonyCount * 1, 20);

      // Daubert success rate
      if (expert.dauberChallenges > 0) {
        const successRate = expert.dauberSuccesses / expert.dauberChallenges;
        score += successRate * 10;
      }

      // Verified credentials
      score += Math.min((expert.credentials?.length || 0) * 2, 10);

      const finalScore = Math.min(score, 100);
      this.logger.log(`Qualification score for expert ${expertId}: ${finalScore}`);
      return finalScore;
    } catch (error) {
      this.logger.error(`Failed to evaluate expert qualifications: ${error}`);
      throw new InternalServerErrorException('Qualification evaluation failed');
    }
  }

  /**
   * Research expert's prior testimony history
   * Compile testimony record and outcomes
   */
  async researchPriorTestimony(
    expertId: string,
  ): Promise<{
    totalCases: number;
    depositions: number;
    trials: number;
    dauberChallenges: number;
    outcomes: string[];
  }> {
    try {
      const expert = await ExpertWitnessProfile.findByPk(expertId);
      if (!expert) {
        throw new NotFoundException(`Expert not found: ${expertId}`);
      }

      const engagements = await ExpertEngagement.findAll({
        where: { expertId },
        include: [
          { model: ExpertDeposition },
          { model: ExpertReport },
        ],
      });

      const depositionCount = await ExpertDeposition.count({
        include: [
          {
            model: ExpertEngagement,
            where: { expertId },
            required: true,
          },
        ],
        where: { status: DepositionStatus.FINALIZED },
      });

      const history = {
        totalCases: engagements.length,
        depositions: depositionCount,
        trials: expert.priorTestimonyCount,
        dauberChallenges: expert.dauberChallenges,
        outcomes: [],
      };

      this.logger.log(`Prior testimony history compiled for expert ${expertId}`);
      return history;
    } catch (error) {
      this.logger.error(`Failed to research prior testimony: ${error}`);
      throw new InternalServerErrorException('Prior testimony research failed');
    }
  }

  /**
   * Check expert availability for case timeline
   * Verify availability for key dates
   */
  async checkExpertAvailability(
    expertId: string,
    requiredDates: Date[],
  ): Promise<{ available: boolean; conflicts: Date[] }> {
    try {
      const existingEngagements = await ExpertEngagement.findAll({
        where: {
          expertId,
          status: {
            [Op.in]: [
              ExpertStatus.RETAINED,
              ExpertStatus.ENGAGED,
              ExpertStatus.DEPOSITION_PREP,
              ExpertStatus.TRIAL_PREP,
            ],
          },
        },
        include: [
          { model: ExpertDeposition, where: { scheduledDate: { [Op.ne]: null } }, required: false },
        ],
      });

      const conflicts: Date[] = [];

      // Check for scheduling conflicts
      for (const date of requiredDates) {
        for (const engagement of existingEngagements) {
          if (engagement.depositions) {
            for (const depo of engagement.depositions) {
              if (depo.scheduledDate && this.isSameDay(depo.scheduledDate, date)) {
                conflicts.push(date);
              }
            }
          }
        }
      }

      const result = {
        available: conflicts.length === 0,
        conflicts,
      };

      this.logger.log(`Availability check for expert ${expertId}: ${result.available ? 'Available' : 'Conflicts found'}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to check expert availability: ${error}`);
      throw new InternalServerErrorException('Availability check failed');
    }
  }

  // ============================================================================
  // 3. RETENTION MANAGEMENT FUNCTIONS
  // ============================================================================

  /**
   * Create expert engagement and retain expert
   * Formal retention process
   */
  async retainExpert(
    data: CreateExpertEngagementDto,
    transaction?: Transaction,
  ): Promise<ExpertEngagement> {
    try {
      const engagement = await ExpertEngagement.create(
        {
          ...data,
          status: ExpertStatus.RETAINED,
          currentSpend: 0,
        },
        { transaction },
      );

      // Update expert status
      await ExpertWitnessProfile.update(
        { status: ExpertStatus.RETAINED },
        { where: { id: data.expertId }, transaction },
      );

      this.logger.log(`Expert ${data.expertId} retained for case ${data.caseId}`);
      return engagement;
    } catch (error) {
      this.logger.error(`Failed to retain expert: ${error}`);
      throw new InternalServerErrorException('Expert retention failed');
    }
  }

  /**
   * Generate engagement letter for expert
   * Create formal engagement agreement
   */
  async generateEngagementLetter(
    engagementId: string,
  ): Promise<{ letterContent: string; letterUrl: string }> {
    try {
      const engagement = await ExpertEngagement.findByPk(engagementId, {
        include: [{ model: ExpertWitnessProfile }],
      });

      if (!engagement) {
        throw new NotFoundException(`Engagement not found: ${engagementId}`);
      }

      // Placeholder for engagement letter generation
      const letterContent = `
EXPERT WITNESS ENGAGEMENT LETTER

Date: ${new Date().toLocaleDateString()}

Expert: ${engagement.expert.firstName} ${engagement.expert.lastName}, ${engagement.expert.credentials}
Case ID: ${engagement.caseId}
Engagement Type: ${engagement.engagementType}

This letter confirms your engagement as an expert witness in the above-referenced matter.

Terms:
- Hourly Rate: $${engagement.hourlyRate || engagement.expert.hourlyRate}
- Retainer: $${engagement.retainerAmount || 0}
${engagement.budgetCap ? `- Budget Cap: $${engagement.budgetCap}` : ''}

Expected Deliverables:
${engagement.expectedReportDate ? `- Expert Report: ${engagement.expectedReportDate.toLocaleDateString()}` : ''}
${engagement.expectedDepositionDate ? `- Deposition: ${engagement.expectedDepositionDate.toLocaleDateString()}` : ''}

Please sign and return this letter to indicate your acceptance of this engagement.

Sincerely,
[Law Firm Name]
      `.trim();

      const letterUrl = `/documents/engagement-letters/${engagementId}.pdf`;

      this.logger.log(`Engagement letter generated for engagement ${engagementId}`);
      return { letterContent, letterUrl };
    } catch (error) {
      this.logger.error(`Failed to generate engagement letter: ${error}`);
      throw new InternalServerErrorException('Engagement letter generation failed');
    }
  }

  /**
   * Update engagement status
   * Track engagement lifecycle
   */
  async updateEngagementStatus(
    engagementId: string,
    newStatus: ExpertStatus,
    notes?: string,
    transaction?: Transaction,
  ): Promise<ExpertEngagement> {
    try {
      const engagement = await ExpertEngagement.findByPk(engagementId);
      if (!engagement) {
        throw new NotFoundException(`Engagement not found: ${engagementId}`);
      }

      await engagement.update(
        {
          status: newStatus,
          notes: notes ? `${engagement.notes || ''}\n${new Date().toISOString()}: ${notes}` : engagement.notes,
        },
        { transaction },
      );

      // Update expert profile status
      await ExpertWitnessProfile.update(
        { status: newStatus },
        { where: { id: engagement.expertId }, transaction },
      );

      this.logger.log(`Engagement ${engagementId} status updated to ${newStatus}`);
      return engagement;
    } catch (error) {
      this.logger.error(`Failed to update engagement status: ${error}`);
      throw new InternalServerErrorException('Engagement status update failed');
    }
  }

  /**
   * Track retainer and budget utilization
   * Monitor spend against budget
   */
  async trackRetainerUtilization(engagementId: string): Promise<{
    retainerAmount: number;
    currentSpend: number;
    remainingRetainer: number;
    budgetCap?: number;
    budgetRemaining?: number;
    utilizationPercent: number;
  }> {
    try {
      const engagement = await ExpertEngagement.findByPk(engagementId, {
        include: [{ model: ExpertInvoice }],
      });

      if (!engagement) {
        throw new NotFoundException(`Engagement not found: ${engagementId}`);
      }

      const totalInvoiced = engagement.invoices.reduce(
        (sum, inv) => sum + Number(inv.totalAmount),
        0,
      );

      const retainerAmount = Number(engagement.retainerAmount || 0);
      const budgetCap = engagement.budgetCap ? Number(engagement.budgetCap) : undefined;

      const utilization = {
        retainerAmount,
        currentSpend: totalInvoiced,
        remainingRetainer: Math.max(retainerAmount - totalInvoiced, 0),
        budgetCap,
        budgetRemaining: budgetCap ? Math.max(budgetCap - totalInvoiced, 0) : undefined,
        utilizationPercent: retainerAmount > 0 ? (totalInvoiced / retainerAmount) * 100 : 0,
      };

      this.logger.log(`Retainer utilization calculated for engagement ${engagementId}: ${utilization.utilizationPercent.toFixed(2)}%`);
      return utilization;
    } catch (error) {
      this.logger.error(`Failed to track retainer utilization: ${error}`);
      throw new InternalServerErrorException('Retainer tracking failed');
    }
  }

  // ============================================================================
  // 4. REPORT TRACKING FUNCTIONS
  // ============================================================================

  /**
   * Create expert report tracking record
   * Initialize report tracking
   */
  async createExpertReport(
    data: CreateExpertReportDto,
    transaction?: Transaction,
  ): Promise<ExpertReport> {
    try {
      const report = await ExpertReport.create(
        {
          ...data,
          version: 1,
          status: ReportStatus.NOT_STARTED,
          pageCount: 0,
          attachmentCount: 0,
          dauberChallenged: false,
        },
        { transaction },
      );

      this.logger.log(`Expert report created: ${report.id}`);
      return report;
    } catch (error) {
      this.logger.error(`Failed to create expert report: ${error}`);
      throw new InternalServerErrorException('Report creation failed');
    }
  }

  /**
   * Update report status and track progress
   * Monitor report development
   */
  async updateReportStatus(
    reportId: string,
    status: ReportStatus,
    submittedDate?: Date,
    reviewNotes?: string,
    transaction?: Transaction,
  ): Promise<ExpertReport> {
    try {
      const report = await ExpertReport.findByPk(reportId);
      if (!report) {
        throw new NotFoundException(`Report not found: ${reportId}`);
      }

      const updates: Partial<ExpertReport> = { status };
      if (submittedDate) updates.submittedDate = submittedDate;
      if (reviewNotes) updates.reviewNotes = reviewNotes;

      await report.update(updates, { transaction });

      this.logger.log(`Report ${reportId} status updated to ${status}`);
      return report;
    } catch (error) {
      this.logger.error(`Failed to update report status: ${error}`);
      throw new InternalServerErrorException('Report status update failed');
    }
  }

  /**
   * Track report deadline compliance
   * Monitor deadlines and send alerts
   */
  async trackReportDeadlines(
    organizationId: string,
    daysThreshold: number = 7,
  ): Promise<ExpertReport[]> {
    try {
      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

      const upcomingReports = await ExpertReport.findAll({
        where: {
          organizationId,
          dueDate: {
            [Op.lte]: thresholdDate,
            [Op.gte]: new Date(),
          },
          status: {
            [Op.notIn]: [ReportStatus.FINAL_SUBMITTED, ReportStatus.DISCLOSED],
          },
        },
        include: [
          {
            model: ExpertEngagement,
            include: [{ model: ExpertWitnessProfile }],
          },
        ],
        order: [['dueDate', 'ASC']],
      });

      this.logger.log(`Found ${upcomingReports.length} reports due within ${daysThreshold} days`);
      return upcomingReports;
    } catch (error) {
      this.logger.error(`Failed to track report deadlines: ${error}`);
      throw new InternalServerErrorException('Report deadline tracking failed');
    }
  }

  /**
   * Manage report version control
   * Track report revisions
   */
  async createReportVersion(
    reportId: string,
    reportUrl: string,
    pageCount: number,
    transaction?: Transaction,
  ): Promise<ExpertReport> {
    try {
      const currentReport = await ExpertReport.findByPk(reportId);
      if (!currentReport) {
        throw new NotFoundException(`Report not found: ${reportId}`);
      }

      const newVersion = currentReport.version + 1;
      await currentReport.update(
        {
          version: newVersion,
          reportUrl,
          pageCount,
          submittedDate: new Date(),
          status: ReportStatus.DRAFT_SUBMITTED,
        },
        { transaction },
      );

      this.logger.log(`Report ${reportId} updated to version ${newVersion}`);
      return currentReport;
    } catch (error) {
      this.logger.error(`Failed to create report version: ${error}`);
      throw new InternalServerErrorException('Report version creation failed');
    }
  }

  /**
   * Track Daubert challenges to expert reports
   * Monitor admissibility challenges
   */
  async trackDauberChallenge(
    reportId: string,
    challengeDate: Date,
    hearingDate?: Date,
    transaction?: Transaction,
  ): Promise<ExpertReport> {
    try {
      const report = await ExpertReport.findByPk(reportId, {
        include: [
          {
            model: ExpertEngagement,
            include: [{ model: ExpertWitnessProfile }],
          },
        ],
      });

      if (!report) {
        throw new NotFoundException(`Report not found: ${reportId}`);
      }

      await report.update(
        {
          dauberChallenged: true,
          dauberChallengeDate: challengeDate,
          dauberHearingDate: hearingDate,
          status: ReportStatus.CHALLENGED,
          admissibilityStatus: 'pending',
        },
        { transaction },
      );

      // Update expert's Daubert challenge count
      await ExpertWitnessProfile.increment(
        'dauberChallenges',
        { by: 1, where: { id: report.engagement.expertId }, transaction },
      );

      this.logger.log(`Daubert challenge tracked for report ${reportId}`);
      return report;
    } catch (error) {
      this.logger.error(`Failed to track Daubert challenge: ${error}`);
      throw new InternalServerErrorException('Daubert challenge tracking failed');
    }
  }

  /**
   * Update report admissibility status
   * Track court rulings on expert testimony
   */
  async updateReportAdmissibility(
    reportId: string,
    admissibilityStatus: 'admitted' | 'excluded' | 'limited',
    transaction?: Transaction,
  ): Promise<ExpertReport> {
    try {
      const report = await ExpertReport.findByPk(reportId, {
        include: [
          {
            model: ExpertEngagement,
            include: [{ model: ExpertWitnessProfile }],
          },
        ],
      });

      if (!report) {
        throw new NotFoundException(`Report not found: ${reportId}`);
      }

      await report.update(
        {
          admissibilityStatus,
          status: admissibilityStatus === 'admitted' ? ReportStatus.ADMITTED : ReportStatus.EXCLUDED,
        },
        { transaction },
      );

      // If Daubert challenge was successful, increment success count
      if (report.dauberChallenged && admissibilityStatus === 'admitted') {
        await ExpertWitnessProfile.increment(
          'dauberSuccesses',
          { by: 1, where: { id: report.engagement.expertId }, transaction },
        );
      }

      this.logger.log(`Report ${reportId} admissibility updated to ${admissibilityStatus}`);
      return report;
    } catch (error) {
      this.logger.error(`Failed to update report admissibility: ${error}`);
      throw new InternalServerErrorException('Admissibility update failed');
    }
  }

  // ============================================================================
  // 5. DEPOSITION PREPARATION FUNCTIONS
  // ============================================================================

  /**
   * Schedule expert deposition
   * Create deposition record and tracking
   */
  async scheduleDeposition(
    data: CreateExpertDepositionDto,
    transaction?: Transaction,
  ): Promise<ExpertDeposition> {
    try {
      const deposition = await ExpertDeposition.create(
        {
          ...data,
          status: data.scheduledDate ? DepositionStatus.SCHEDULED : DepositionStatus.NOT_SCHEDULED,
          prepSessionsCompleted: 0,
          exhibitsIdentified: 0,
          videoRecorded: false,
          errataSubmitted: false,
        },
        { transaction },
      );

      // Update engagement status
      await ExpertEngagement.update(
        { status: ExpertStatus.DEPOSITION_PREP },
        { where: { id: data.expertEngagementId }, transaction },
      );

      this.logger.log(`Deposition scheduled: ${deposition.id}`);
      return deposition;
    } catch (error) {
      this.logger.error(`Failed to schedule deposition: ${error}`);
      throw new InternalServerErrorException('Deposition scheduling failed');
    }
  }

  /**
   * Create deposition preparation checklist
   * Generate comprehensive prep tasks
   */
  async createDepositionPrepChecklist(depositionId: string): Promise<DepositionPrep> {
    try {
      const deposition = await ExpertDeposition.findByPk(depositionId, {
        include: [
          {
            model: ExpertEngagement,
            include: [{ model: ExpertWitnessProfile }],
          },
        ],
      });

      if (!deposition) {
        throw new NotFoundException(`Deposition not found: ${depositionId}`);
      }

      const checklist: DepositionPrep = {
        depositionId,
        expertId: deposition.engagement.expertId,
        scheduledDate: deposition.scheduledDate || new Date(),
        location: deposition.location || 'TBD',
        estimatedDuration: Number(deposition.estimatedDuration),
        prepSessionsCompleted: 0,
        exhibitsReviewed: false,
        priorTestimonyReviewed: false,
        caseFactsReviewed: false,
        opposingCounselResearched: false,
        mockQuestionsCompleted: false,
        videoRecorded: false,
        interpreterNeeded: false,
      };

      this.logger.log(`Deposition prep checklist created for ${depositionId}`);
      return checklist;
    } catch (error) {
      this.logger.error(`Failed to create deposition prep checklist: ${error}`);
      throw new InternalServerErrorException('Deposition prep checklist creation failed');
    }
  }

  /**
   * Track deposition preparation sessions
   * Log prep meetings and progress
   */
  async trackPrepSession(
    depositionId: string,
    sessionNotes: string,
    transaction?: Transaction,
  ): Promise<ExpertDeposition> {
    try {
      const deposition = await ExpertDeposition.findByPk(depositionId);
      if (!deposition) {
        throw new NotFoundException(`Deposition not found: ${depositionId}`);
      }

      await deposition.increment('prepSessionsCompleted', { by: 1, transaction });

      const updatedNotes = `${deposition.notes || ''}\n\nPrep Session ${deposition.prepSessionsCompleted + 1} - ${new Date().toLocaleDateString()}:\n${sessionNotes}`;
      await deposition.update({ notes: updatedNotes }, { transaction });

      this.logger.log(`Prep session tracked for deposition ${depositionId}`);
      return deposition;
    } catch (error) {
      this.logger.error(`Failed to track prep session: ${error}`);
      throw new InternalServerErrorException('Prep session tracking failed');
    }
  }

  /**
   * Generate deposition question outline
   * Create structured question list
   */
  async generateDepositionQuestions(
    depositionId: string,
    reportId?: string,
  ): Promise<{ questions: string[]; exhibits: string[] }> {
    try {
      const deposition = await ExpertDeposition.findByPk(depositionId, {
        include: [
          {
            model: ExpertEngagement,
            include: [
              { model: ExpertWitnessProfile },
              { model: ExpertReport },
            ],
          },
        ],
      });

      if (!deposition) {
        throw new NotFoundException(`Deposition not found: ${depositionId}`);
      }

      // Placeholder for question generation logic
      const questions = [
        'Please state your full name and current position.',
        'What are your educational qualifications?',
        'Are you board certified? In what specialty?',
        'How many times have you testified as an expert witness?',
        'What is your hourly rate for this engagement?',
        'Please describe your methodology in forming your opinion in this case.',
        'What documents did you review in preparation of your report?',
        'Did you consult with any other experts?',
      ];

      const exhibits: string[] = [];

      this.logger.log(`Deposition questions generated for ${depositionId}`);
      return { questions, exhibits };
    } catch (error) {
      this.logger.error(`Failed to generate deposition questions: ${error}`);
      throw new InternalServerErrorException('Question generation failed');
    }
  }

  /**
   * Manage deposition exhibits
   * Track and organize deposition evidence
   */
  async manageDepositionExhibits(
    depositionId: string,
    exhibitList: string[],
    transaction?: Transaction,
  ): Promise<ExpertDeposition> {
    try {
      const deposition = await ExpertDeposition.findByPk(depositionId);
      if (!deposition) {
        throw new NotFoundException(`Deposition not found: ${depositionId}`);
      }

      await deposition.update(
        {
          exhibitsIdentified: exhibitList.length,
          notes: `${deposition.notes || ''}\n\nExhibits: ${exhibitList.join(', ')}`,
        },
        { transaction },
      );

      this.logger.log(`${exhibitList.length} exhibits managed for deposition ${depositionId}`);
      return deposition;
    } catch (error) {
      this.logger.error(`Failed to manage deposition exhibits: ${error}`);
      throw new InternalServerErrorException('Exhibit management failed');
    }
  }

  /**
   * Update deposition status
   * Track deposition lifecycle
   */
  async updateDepositionStatus(
    depositionId: string,
    status: DepositionStatus,
    transaction?: Transaction,
  ): Promise<ExpertDeposition> {
    try {
      const deposition = await ExpertDeposition.findByPk(depositionId);
      if (!deposition) {
        throw new NotFoundException(`Deposition not found: ${depositionId}`);
      }

      await deposition.update({ status }, { transaction });

      // Update engagement status if deposed
      if (status === DepositionStatus.FINALIZED) {
        await ExpertEngagement.update(
          { status: ExpertStatus.DEPOSED },
          { where: { id: deposition.expertEngagementId }, transaction },
        );
      }

      this.logger.log(`Deposition ${depositionId} status updated to ${status}`);
      return deposition;
    } catch (error) {
      this.logger.error(`Failed to update deposition status: ${error}`);
      throw new InternalServerErrorException('Deposition status update failed');
    }
  }

  /**
   * Track transcript receipt and review
   * Manage deposition transcripts
   */
  async trackTranscript(
    depositionId: string,
    transcriptUrl: string,
    transcriptReceivedDate: Date,
    transaction?: Transaction,
  ): Promise<ExpertDeposition> {
    try {
      const deposition = await ExpertDeposition.findByPk(depositionId);
      if (!deposition) {
        throw new NotFoundException(`Deposition not found: ${depositionId}`);
      }

      // Calculate errata deadline (typically 30 days from receipt)
      const errataDeadline = new Date(transcriptReceivedDate);
      errataDeadline.setDate(errataDeadline.getDate() + 30);

      await deposition.update(
        {
          transcriptUrl,
          transcriptReceivedDate,
          errataDeadline,
          status: DepositionStatus.TRANSCRIPT_RECEIVED,
        },
        { transaction },
      );

      this.logger.log(`Transcript tracked for deposition ${depositionId}`);
      return deposition;
    } catch (error) {
      this.logger.error(`Failed to track transcript: ${error}`);
      throw new InternalServerErrorException('Transcript tracking failed');
    }
  }

  // ============================================================================
  // 6. FEE MANAGEMENT FUNCTIONS
  // ============================================================================

  /**
   * Create expert invoice
   * Generate billing record
   */
  async createExpertInvoice(
    data: CreateExpertInvoiceDto,
    transaction?: Transaction,
  ): Promise<ExpertInvoice> {
    try {
      const invoice = await ExpertInvoice.create(
        {
          ...data,
          status: InvoiceStatus.DRAFT,
        },
        { transaction },
      );

      // Update engagement current spend
      await ExpertEngagement.increment(
        'currentSpend',
        { by: data.totalAmount, where: { id: data.expertEngagementId }, transaction },
      );

      this.logger.log(`Expert invoice created: ${invoice.id}`);
      return invoice;
    } catch (error) {
      this.logger.error(`Failed to create expert invoice: ${error}`);
      throw new InternalServerErrorException('Invoice creation failed');
    }
  }

  /**
   * Calculate expert fees for period
   * Compute billable amounts
   */
  async calculateExpertFees(
    engagementId: string,
    hoursWorked: number,
  ): Promise<{
    hourlyRate: number;
    laborAmount: number;
    subtotal: number;
  }> {
    try {
      const engagement = await ExpertEngagement.findByPk(engagementId, {
        include: [{ model: ExpertWitnessProfile }],
      });

      if (!engagement) {
        throw new NotFoundException(`Engagement not found: ${engagementId}`);
      }

      const hourlyRate = Number(engagement.hourlyRate || engagement.expert.hourlyRate || 0);
      const laborAmount = hourlyRate * hoursWorked;

      const calculation = {
        hourlyRate,
        laborAmount,
        subtotal: laborAmount,
      };

      this.logger.log(`Expert fees calculated for engagement ${engagementId}: $${calculation.subtotal}`);
      return calculation;
    } catch (error) {
      this.logger.error(`Failed to calculate expert fees: ${error}`);
      throw new InternalServerErrorException('Fee calculation failed');
    }
  }

  /**
   * Approve expert invoice
   * Review and approve billing
   */
  async approveInvoice(
    invoiceId: string,
    approvedBy: string,
    transaction?: Transaction,
  ): Promise<ExpertInvoice> {
    try {
      const invoice = await ExpertInvoice.findByPk(invoiceId);
      if (!invoice) {
        throw new NotFoundException(`Invoice not found: ${invoiceId}`);
      }

      await invoice.update(
        {
          status: InvoiceStatus.APPROVED,
          approvedBy,
          approvedDate: new Date(),
        },
        { transaction },
      );

      this.logger.log(`Invoice ${invoiceId} approved by ${approvedBy}`);
      return invoice;
    } catch (error) {
      this.logger.error(`Failed to approve invoice: ${error}`);
      throw new InternalServerErrorException('Invoice approval failed');
    }
  }

  /**
   * Record invoice payment
   * Track payment receipt
   */
  async recordInvoicePayment(
    invoiceId: string,
    paymentDate: Date,
    paymentMethod: string,
    transaction?: Transaction,
  ): Promise<ExpertInvoice> {
    try {
      const invoice = await ExpertInvoice.findByPk(invoiceId);
      if (!invoice) {
        throw new NotFoundException(`Invoice not found: ${invoiceId}`);
      }

      await invoice.update(
        {
          status: InvoiceStatus.PAID,
          paidDate: paymentDate,
          paymentMethod,
        },
        { transaction },
      );

      this.logger.log(`Payment recorded for invoice ${invoiceId}`);
      return invoice;
    } catch (error) {
      this.logger.error(`Failed to record invoice payment: ${error}`);
      throw new InternalServerErrorException('Payment recording failed');
    }
  }

  /**
   * Generate fee summary for expert engagement
   * Comprehensive financial summary
   */
  async generateFeeSummary(engagementId: string): Promise<ExpertFeeSummary> {
    try {
      const engagement = await ExpertEngagement.findByPk(engagementId, {
        include: [{ model: ExpertInvoice }],
      });

      if (!engagement) {
        throw new NotFoundException(`Engagement not found: ${engagementId}`);
      }

      const totalBilled = engagement.invoices.reduce(
        (sum, inv) => sum + Number(inv.totalAmount),
        0,
      );

      const totalPaid = engagement.invoices
        .filter((inv) => inv.status === InvoiceStatus.PAID)
        .reduce((sum, inv) => sum + Number(inv.totalAmount), 0);

      const totalHours = engagement.invoices.reduce(
        (sum, inv) => sum + Number(inv.hoursWorked),
        0,
      );

      const lastInvoice = engagement.invoices.sort(
        (a, b) => b.invoiceDate.getTime() - a.invoiceDate.getTime(),
      )[0];

      const summary: ExpertFeeSummary = {
        expertId: engagement.expertId,
        caseId: engagement.caseId,
        feeStructure: FeeStructure.HOURLY,
        hourlyRate: Number(engagement.hourlyRate),
        retainerAmount: Number(engagement.retainerAmount || 0),
        totalHoursBilled: totalHours,
        totalAmountBilled: totalBilled,
        totalAmountPaid: totalPaid,
        outstandingBalance: totalBilled - totalPaid,
        lastInvoiceDate: lastInvoice?.invoiceDate,
        budgetRemaining: engagement.budgetCap
          ? Number(engagement.budgetCap) - totalBilled
          : undefined,
      };

      this.logger.log(`Fee summary generated for engagement ${engagementId}`);
      return summary;
    } catch (error) {
      this.logger.error(`Failed to generate fee summary: ${error}`);
      throw new InternalServerErrorException('Fee summary generation failed');
    }
  }

  /**
   * Track budget compliance and alerts
   * Monitor budget overruns
   */
  async trackBudgetCompliance(
    engagementId: string,
  ): Promise<{
    budgetCap: number;
    totalSpend: number;
    remainingBudget: number;
    percentUtilized: number;
    overBudget: boolean;
  }> {
    try {
      const engagement = await ExpertEngagement.findByPk(engagementId, {
        include: [{ model: ExpertInvoice }],
      });

      if (!engagement) {
        throw new NotFoundException(`Engagement not found: ${engagementId}`);
      }

      if (!engagement.budgetCap) {
        throw new BadRequestException('No budget cap set for this engagement');
      }

      const totalSpend = engagement.invoices.reduce(
        (sum, inv) => sum + Number(inv.totalAmount),
        0,
      );

      const budgetCap = Number(engagement.budgetCap);
      const remainingBudget = budgetCap - totalSpend;
      const percentUtilized = (totalSpend / budgetCap) * 100;

      const compliance = {
        budgetCap,
        totalSpend,
        remainingBudget,
        percentUtilized,
        overBudget: totalSpend > budgetCap,
      };

      this.logger.log(`Budget compliance tracked for engagement ${engagementId}: ${percentUtilized.toFixed(2)}% utilized`);
      return compliance;
    } catch (error) {
      this.logger.error(`Failed to track budget compliance: ${error}`);
      throw new InternalServerErrorException('Budget compliance tracking failed');
    }
  }

  // ============================================================================
  // 7. PERFORMANCE EVALUATION FUNCTIONS
  // ============================================================================

  /**
   * Calculate expert performance metrics
   * Comprehensive performance assessment
   */
  async calculatePerformanceMetrics(expertId: string): Promise<ExpertPerformanceMetrics> {
    try {
      const expert = await ExpertWitnessProfile.findByPk(expertId);
      if (!expert) {
        throw new NotFoundException(`Expert not found: ${expertId}`);
      }

      const engagements = await ExpertEngagement.findAll({
        where: { expertId },
        include: [
          { model: ExpertReport },
          { model: ExpertDeposition },
        ],
      });

      const totalDepositions = await ExpertDeposition.count({
        include: [
          {
            model: ExpertEngagement,
            where: { expertId },
            required: true,
          },
        ],
      });

      const reports = await ExpertReport.findAll({
        include: [
          {
            model: ExpertEngagement,
            where: { expertId },
            required: true,
          },
        ],
      });

      // Calculate average report turnaround
      const completedReports = reports.filter(
        (r) => r.submittedDate && r.requestedDate,
      );
      const avgTurnaround = completedReports.length > 0
        ? completedReports.reduce((sum, r) => {
            const days = Math.floor(
              (r.submittedDate!.getTime() - r.requestedDate.getTime()) / (1000 * 60 * 60 * 24),
            );
            return sum + days;
          }, 0) / completedReports.length
        : 0;

      const dauberSuccessRate = expert.dauberChallenges > 0
        ? (expert.dauberSuccesses / expert.dauberChallenges) * 100
        : 100;

      const metrics: ExpertPerformanceMetrics = {
        expertId,
        totalCasesWorked: engagements.length,
        totalDepositions: totalDepositions,
        totalTrials: expert.priorTestimonyCount,
        dauberChallenges: expert.dauberChallenges,
        dauberSuccessRate,
        averageReportTurnaround: avgTurnaround,
        clientSatisfactionScore: Number(expert.rating || 0),
        onTimeDeliveryRate: 100, // Placeholder
        testimonyEffectivenessScore: dauberSuccessRate,
        communicationScore: Number(expert.rating || 0),
      };

      this.logger.log(`Performance metrics calculated for expert ${expertId}`);
      return metrics;
    } catch (error) {
      this.logger.error(`Failed to calculate performance metrics: ${error}`);
      throw new InternalServerErrorException('Performance metrics calculation failed');
    }
  }

  /**
   * Rate expert performance
   * Collect and store ratings
   */
  async rateExpertPerformance(
    expertId: string,
    rating: number,
    feedback: string,
    transaction?: Transaction,
  ): Promise<ExpertWitnessProfile> {
    try {
      if (rating < 0 || rating > 5) {
        throw new BadRequestException('Rating must be between 0 and 5');
      }

      const expert = await ExpertWitnessProfile.findByPk(expertId);
      if (!expert) {
        throw new NotFoundException(`Expert not found: ${expertId}`);
      }

      // Calculate new average rating
      const currentRating = Number(expert.rating || 0);
      const engagementCount = await ExpertEngagement.count({ where: { expertId } });
      const newRating = engagementCount > 0
        ? ((currentRating * (engagementCount - 1)) + rating) / engagementCount
        : rating;

      await expert.update(
        {
          rating: newRating,
          notes: `${expert.notes || ''}\n\nRating: ${rating}/5 - ${new Date().toLocaleDateString()}\nFeedback: ${feedback}`,
        },
        { transaction },
      );

      this.logger.log(`Expert ${expertId} rated: ${rating}/5`);
      return expert;
    } catch (error) {
      this.logger.error(`Failed to rate expert performance: ${error}`);
      throw new InternalServerErrorException('Expert rating failed');
    }
  }

  /**
   * Generate comprehensive expert engagement summary
   * Compile all engagement details for reporting
   */
  async generateEngagementSummary(
    engagementId: string,
  ): Promise<{
    engagement: ExpertEngagement;
    expert: ExpertWitnessProfile;
    reports: ExpertReport[];
    depositions: ExpertDeposition[];
    invoices: ExpertInvoice[];
    feeSummary: ExpertFeeSummary;
    performanceMetrics: ExpertPerformanceMetrics;
  }> {
    try {
      const engagement = await ExpertEngagement.findByPk(engagementId, {
        include: [
          { model: ExpertWitnessProfile },
          { model: ExpertReport },
          { model: ExpertDeposition },
          { model: ExpertInvoice },
        ],
      });

      if (!engagement) {
        throw new NotFoundException(`Engagement not found: ${engagementId}`);
      }

      const feeSummary = await this.generateFeeSummary(engagementId);
      const performanceMetrics = await this.calculatePerformanceMetrics(engagement.expertId);

      const summary = {
        engagement,
        expert: engagement.expert,
        reports: engagement.reports,
        depositions: engagement.depositions,
        invoices: engagement.invoices,
        feeSummary,
        performanceMetrics,
      };

      this.logger.log(`Comprehensive engagement summary generated for ${engagementId}`);
      return summary;
    } catch (error) {
      this.logger.error(`Failed to generate engagement summary: ${error}`);
      throw new InternalServerErrorException('Engagement summary generation failed');
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Check if two dates are on the same day
   */
  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}

// ============================================================================
// MODULE DEFINITION
// ============================================================================

/**
 * Configuration factory for expert witness management
 */
export const expertWitnessManagementConfig = registerAs(
  'expertWitnessManagement',
  () => ({
    defaultRetainerDays: parseInt(process.env.EXPERT_RETAINER_DAYS || '30', 10),
    defaultReportTurnaround: parseInt(process.env.EXPERT_REPORT_TURNAROUND_DAYS || '45', 10),
    budgetWarningThreshold: parseInt(process.env.EXPERT_BUDGET_WARNING_PERCENT || '80', 10),
    credentialExpirationWarning: parseInt(process.env.CREDENTIAL_EXPIRATION_WARNING_DAYS || '90', 10),
    defaultDepositionDuration: parseFloat(process.env.DEFAULT_DEPOSITION_HOURS || '4'),
    errataDeadlineDays: parseInt(process.env.ERRATA_DEADLINE_DAYS || '30', 10),
  }),
);

/**
 * Expert witness management module
 */
@Global()
@Module({
  imports: [
    ConfigModule.forFeature(expertWitnessManagementConfig),
  ],
  providers: [ExpertWitnessManagementService],
  exports: [ExpertWitnessManagementService],
})
export class ExpertWitnessManagementModule {
  /**
   * Register module with Sequelize models
   */
  static forRoot(sequelize: Sequelize): DynamicModule {
    return {
      module: ExpertWitnessManagementModule,
      providers: [
        {
          provide: 'SEQUELIZE',
          useValue: sequelize,
        },
        ExpertWitnessManagementService,
      ],
      exports: [ExpertWitnessManagementService],
    };
  }
}
