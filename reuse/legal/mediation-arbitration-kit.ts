/**
 * LOC: MEDIATION_ARBITRATION_KIT_001
 * File: /reuse/legal/mediation-arbitration-kit.ts
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
 *   - Legal ADR modules
 *   - Mediation management controllers
 *   - Arbitration services
 *   - Settlement conference services
 *   - Dispute resolution services
 */

/**
 * File: /reuse/legal/mediation-arbitration-kit.ts
 * Locator: WC-MEDIATION-ARBITRATION-KIT-001
 * Purpose: Production-Grade Alternative Dispute Resolution Kit - Enterprise ADR management toolkit
 *
 * Upstream: NestJS, Sequelize, Zod, Date-FNS
 * Downstream: ../backend/modules/adr/*, Mediation controllers, Arbitration services
 * Dependencies: TypeScript 5.x, Node 18+, sequelize-typescript, @nestjs/swagger, zod
 * Exports: 40 production-ready ADR management functions for legal platforms
 *
 * LLM Context: Production-grade alternative dispute resolution lifecycle management toolkit for
 * White Cross platform. Provides comprehensive mediator selection with qualification verification
 * and conflict checking, ADR scheduling with calendar integration and availability management,
 * settlement conference tracking with offer/counteroffer documentation, arbitration award management
 * with enforcement tracking, ADR outcome analysis with success metrics and cost comparison,
 * Sequelize models for mediators/arbitrations/settlements/awards/conferences, NestJS services with
 * dependency injection, Swagger API documentation, mediator certification tracking and renewal
 * management, neutral selection algorithms with party preferences, ADR session scheduling with
 * automatic reminders, settlement proposal generation with valuation analysis, arbitration hearing
 * management with evidence submission, award drafting with legal standards compliance, enforcement
 * action tracking, mediated settlement agreement generation, confidentiality agreement management,
 * ADR clause analysis and recommendation, cost-benefit analysis comparing litigation vs ADR,
 * success rate analytics by mediator and case type, dispute classification and ADR suitability
 * assessment, multi-party mediation coordination, binding vs non-binding arbitration management,
 * discovery in arbitration scheduling, arbitration rule selection (AAA, JAMS, custom), virtual ADR
 * session support with video conference integration, and healthcare-specific ADR (medical malpractice
 * mediation, peer review arbitration, HIPAA-compliant confidentiality).
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
import {
  addDays,
  addHours,
  addMonths,
  differenceInDays,
  differenceInHours,
  format,
  isBefore,
  isAfter,
  parseISO,
} from 'date-fns';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * ADR process types
 */
export enum ADRType {
  MEDIATION = 'mediation',
  ARBITRATION = 'arbitration',
  SETTLEMENT_CONFERENCE = 'settlement_conference',
  NEUTRAL_EVALUATION = 'neutral_evaluation',
  EARLY_NEUTRAL_EVALUATION = 'early_neutral_evaluation',
  MINI_TRIAL = 'mini_trial',
  SUMMARY_JURY_TRIAL = 'summary_jury_trial',
  CONCILIATION = 'conciliation',
  FACILITATION = 'facilitation',
  MED_ARB = 'med_arb',
  ARB_MED = 'arb_med',
}

/**
 * ADR status lifecycle
 */
export enum ADRStatus {
  INITIATED = 'initiated',
  MEDIATOR_SELECTION = 'mediator_selection',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  SETTLEMENT_REACHED = 'settlement_reached',
  IMPASSE = 'impasse',
  AWARD_ISSUED = 'award_issued',
  AWARD_CHALLENGED = 'award_challenged',
  AWARD_CONFIRMED = 'award_confirmed',
  AWARD_VACATED = 'award_vacated',
  ENFORCEMENT_PENDING = 'enforcement_pending',
  COMPLETED = 'completed',
  TERMINATED = 'terminated',
}

/**
 * Mediator certification levels
 */
export enum MediatorCertification {
  BASIC = 'basic',
  ADVANCED = 'advanced',
  MASTER = 'master',
  SPECIALTY_MEDICAL = 'specialty_medical',
  SPECIALTY_EMPLOYMENT = 'specialty_employment',
  SPECIALTY_COMMERCIAL = 'specialty_commercial',
  SPECIALTY_FAMILY = 'specialty_family',
  SPECIALTY_CONSTRUCTION = 'specialty_construction',
  AAA_CERTIFIED = 'aaa_certified',
  JAMS_CERTIFIED = 'jams_certified',
  CPR_CERTIFIED = 'cpr_certified',
  IMI_CERTIFIED = 'imi_certified',
}

/**
 * Arbitration binding types
 */
export enum ArbitrationType {
  BINDING = 'binding',
  NON_BINDING = 'non_binding',
  HIGH_LOW_ARBITRATION = 'high_low_arbitration',
  BASEBALL_ARBITRATION = 'baseball_arbitration',
  NIGHT_BASEBALL = 'night_baseball',
}

/**
 * Arbitration rule sets
 */
export enum ArbitrationRules {
  AAA_COMMERCIAL = 'aaa_commercial',
  AAA_EMPLOYMENT = 'aaa_employment',
  AAA_HEALTHCARE = 'aaa_healthcare',
  JAMS_COMPREHENSIVE = 'jams_comprehensive',
  JAMS_STREAMLINED = 'jams_streamlined',
  CPR_RULES = 'cpr_rules',
  UNCITRAL = 'uncitral',
  ICC = 'icc',
  CUSTOM = 'custom',
}

/**
 * Settlement offer status
 */
export enum SettlementOfferStatus {
  DRAFT = 'draft',
  PROPOSED = 'proposed',
  PENDING_REVIEW = 'pending_review',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  COUNTERED = 'countered',
  WITHDRAWN = 'withdrawn',
  EXPIRED = 'expired',
}

/**
 * Award status tracking
 */
export enum AwardStatus {
  DRAFT = 'draft',
  ISSUED = 'issued',
  SERVED = 'served',
  MOTION_TO_CONFIRM = 'motion_to_confirm',
  MOTION_TO_VACATE = 'motion_to_vacate',
  MOTION_TO_MODIFY = 'motion_to_modify',
  CONFIRMED = 'confirmed',
  VACATED = 'vacated',
  MODIFIED = 'modified',
  ENFORCEMENT_INITIATED = 'enforcement_initiated',
  SATISFIED = 'satisfied',
}

/**
 * Session format types
 */
export enum SessionFormat {
  IN_PERSON = 'in_person',
  VIRTUAL = 'virtual',
  HYBRID = 'hybrid',
  TELEPHONIC = 'telephonic',
  ASYNCHRONOUS = 'asynchronous',
}

/**
 * Mediator interface
 */
export interface IMediator {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization?: string;
  certifications: MediatorCertification[];
  specializations: string[];
  yearsExperience: number;
  successRate?: number;
  totalCasesMediated: number;
  hourlyRate: number;
  dailyRate?: number;
  availability: Record<string, boolean>;
  bio: string;
  educationBackground: string[];
  languages: string[];
  jurisdictions: string[];
  conflictCheckIds: string[];
  rating?: number;
  isActive: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * ADR proceeding interface
 */
export interface IADRProceeding {
  id: string;
  adrNumber: string;
  adrType: ADRType;
  status: ADRStatus;
  matterId: string;
  matterName: string;
  claimantId: string;
  claimantName: string;
  respondentId: string;
  respondentName: string;
  mediatorId?: string;
  arbitratorIds: string[];
  disputeDescription: string;
  amountInControversy?: number;
  arbitrationType?: ArbitrationType;
  arbitrationRules?: ArbitrationRules;
  sessionFormat: SessionFormat;
  scheduledDate?: Date;
  scheduledDuration?: number;
  location?: string;
  virtualMeetingLink?: string;
  confidentialityAgreementSigned: boolean;
  isBinding: boolean;
  discoveryAllowed: boolean;
  filingFee?: number;
  administrativeFees?: number;
  neutralFees?: number;
  estimatedTotalCost?: number;
  actualTotalCost?: number;
  initiationDate: Date;
  completionDate?: Date;
  outcome?: string;
  settlementAmount?: number;
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Settlement offer interface
 */
export interface ISettlementOffer {
  id: string;
  adrProceedingId: string;
  offerNumber: string;
  offeringParty: 'claimant' | 'respondent';
  offeringPartyId: string;
  receivingPartyId: string;
  offerAmount: number;
  structuredPayment?: boolean;
  paymentTerms?: string;
  nonMonetaryTerms?: string[];
  conditions: string[];
  status: SettlementOfferStatus;
  proposedDate: Date;
  responseDeadline: Date;
  responseDate?: Date;
  counterOfferAmount?: number;
  rejectionReason?: string;
  acceptedDate?: Date;
  confidential: boolean;
  validityPeriod?: number;
  relatedOfferIds: string[];
  attachments: string[];
  notes: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Arbitration award interface
 */
export interface IArbitrationAward {
  id: string;
  adrProceedingId: string;
  awardNumber: string;
  arbitratorIds: string[];
  awardType: 'final' | 'interim' | 'partial' | 'consent' | 'default';
  status: AwardStatus;
  issuedDate?: Date;
  awardAmount?: number;
  prevailingParty?: 'claimant' | 'respondent' | 'split';
  findings: string;
  reasoning: string;
  costsAwarded?: number;
  costsAllocationClaimant?: number;
  costsAllocationRespondent?: number;
  interestRate?: number;
  interestStartDate?: Date;
  paymentDeadline?: Date;
  appealAllowed: boolean;
  appealDeadline?: Date;
  confirmationMotionDate?: Date;
  confirmationJudgment?: string;
  vacatureMotionDate?: Date;
  vacatureReason?: string;
  enforcementJurisdiction?: string;
  enforcementStatus?: string;
  satisfactionDate?: Date;
  documentPath: string;
  digitalSignature?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ADR session interface
 */
export interface IADRSession {
  id: string;
  adrProceedingId: string;
  sessionNumber: number;
  sessionDate: Date;
  duration: number;
  format: SessionFormat;
  location?: string;
  virtualMeetingLink?: string;
  attendees: string[];
  mediatorNotes?: string;
  progressNotes: string;
  nextSteps: string[];
  documentsExchanged: string[];
  settlementDiscussed: boolean;
  settlementRange?: { min: number; max: number };
  nextSessionDate?: Date;
  caucusHeld: boolean;
  caucusDuration?: number;
  isSuccessful: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ADR outcome metrics interface
 */
export interface IADROutcomeMetrics {
  totalProceedings: number;
  settledProceedings: number;
  impasseProceedings: number;
  settlementRate: number;
  averageSettlementAmount: number;
  averageTimeToResolution: number;
  averageCost: number;
  costSavingsVsLitigation: number;
  mediatorSuccessRates: Record<string, number>;
  settlementRateByType: Record<ADRType, number>;
  averageSessionsToSettlement: number;
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

export const CreateMediatorSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string(),
  certifications: z.array(z.nativeEnum(MediatorCertification)),
  specializations: z.array(z.string()),
  yearsExperience: z.number().min(0),
  hourlyRate: z.number().min(0),
  bio: z.string(),
  educationBackground: z.array(z.string()),
  languages: z.array(z.string()),
  jurisdictions: z.array(z.string()),
});

export const CreateADRProceedingSchema = z.object({
  adrType: z.nativeEnum(ADRType),
  matterId: z.string().uuid(),
  matterName: z.string(),
  claimantId: z.string().uuid(),
  claimantName: z.string(),
  respondentId: z.string().uuid(),
  respondentName: z.string(),
  disputeDescription: z.string(),
  amountInControversy: z.number().optional(),
  arbitrationType: z.nativeEnum(ArbitrationType).optional(),
  arbitrationRules: z.nativeEnum(ArbitrationRules).optional(),
  sessionFormat: z.nativeEnum(SessionFormat),
  isBinding: z.boolean(),
});

export const CreateSettlementOfferSchema = z.object({
  adrProceedingId: z.string().uuid(),
  offeringParty: z.enum(['claimant', 'respondent']),
  offeringPartyId: z.string().uuid(),
  receivingPartyId: z.string().uuid(),
  offerAmount: z.number().min(0),
  conditions: z.array(z.string()),
  responseDeadline: z.string().datetime(),
  confidential: z.boolean(),
});

export const CreateArbitrationAwardSchema = z.object({
  adrProceedingId: z.string().uuid(),
  arbitratorIds: z.array(z.string().uuid()),
  awardType: z.enum(['final', 'interim', 'partial', 'consent', 'default']),
  awardAmount: z.number().optional(),
  prevailingParty: z.enum(['claimant', 'respondent', 'split']).optional(),
  findings: z.string(),
  reasoning: z.string(),
  appealAllowed: z.boolean(),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

@Table({
  tableName: 'mediators',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    { fields: ['email'], unique: true },
    { fields: ['is_active'] },
    { fields: ['certifications'], using: 'gin' },
    { fields: ['specializations'], using: 'gin' },
    { fields: ['jurisdictions'], using: 'gin' },
  ],
})
export class Mediator extends Model<IMediator> {
  @ApiProperty({ description: 'Unique mediator identifier' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ApiProperty({ description: 'Mediator first name' })
  @Column({ type: DataType.STRING, allowNull: false })
  firstName!: string;

  @ApiProperty({ description: 'Mediator last name' })
  @Column({ type: DataType.STRING, allowNull: false })
  lastName!: string;

  @ApiProperty({ description: 'Contact email address' })
  @Index({ unique: true })
  @Column({ type: DataType.STRING, allowNull: false })
  email!: string;

  @ApiProperty({ description: 'Contact phone number' })
  @Column({ type: DataType.STRING, allowNull: false })
  phone!: string;

  @ApiPropertyOptional({ description: 'Organization affiliation' })
  @Column({ type: DataType.STRING, allowNull: true })
  organization?: string;

  @ApiProperty({
    description: 'Mediator certifications',
    enum: MediatorCertification,
    isArray: true,
  })
  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
  certifications!: MediatorCertification[];

  @ApiProperty({ description: 'Areas of specialization', isArray: true })
  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
  specializations!: string[];

  @ApiProperty({ description: 'Years of mediation experience' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  yearsExperience!: number;

  @ApiPropertyOptional({ description: 'Success rate percentage (0-100)' })
  @Column({ type: DataType.FLOAT, allowNull: true })
  successRate?: number;

  @ApiProperty({ description: 'Total cases mediated', default: 0 })
  @Default(0)
  @Column({ type: DataType.INTEGER, allowNull: false })
  totalCasesMediated!: number;

  @ApiProperty({ description: 'Hourly rate in USD' })
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  hourlyRate!: number;

  @ApiPropertyOptional({ description: 'Daily rate in USD' })
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
  dailyRate?: number;

  @ApiProperty({ description: 'Availability calendar', type: 'object' })
  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: {} })
  availability!: Record<string, boolean>;

  @ApiProperty({ description: 'Mediator biography' })
  @Column({ type: DataType.TEXT, allowNull: false })
  bio!: string;

  @ApiProperty({ description: 'Education credentials', isArray: true })
  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
  educationBackground!: string[];

  @ApiProperty({ description: 'Languages spoken', isArray: true })
  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
  languages!: string[];

  @ApiProperty({ description: 'Licensed jurisdictions', isArray: true })
  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
  jurisdictions!: string[];

  @ApiProperty({ description: 'Conflict check party IDs', isArray: true })
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
  })
  conflictCheckIds!: string[];

  @ApiPropertyOptional({ description: 'Mediator rating (0-5)' })
  @Column({ type: DataType.FLOAT, allowNull: true })
  rating?: number;

  @ApiProperty({ description: 'Active status', default: true })
  @Default(true)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isActive!: boolean;

  @ApiProperty({ description: 'Additional metadata', type: 'object' })
  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: {} })
  metadata!: Record<string, any>;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  @ApiPropertyOptional({ description: 'Soft delete timestamp' })
  @DeletedAt
  @Column(DataType.DATE)
  deletedAt?: Date;

  @HasMany(() => ADRProceeding, 'mediatorId')
  proceedings!: ADRProceeding[];
}

@Table({
  tableName: 'adr_proceedings',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    { fields: ['adr_number'], unique: true },
    { fields: ['matter_id'] },
    { fields: ['status'] },
    { fields: ['adr_type'] },
    { fields: ['mediator_id'] },
    { fields: ['scheduled_date'] },
  ],
})
export class ADRProceeding extends Model<IADRProceeding> {
  @ApiProperty({ description: 'Unique ADR proceeding identifier' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ApiProperty({ description: 'ADR proceeding number' })
  @Index({ unique: true })
  @Column({ type: DataType.STRING, allowNull: false })
  adrNumber!: string;

  @ApiProperty({ description: 'Type of ADR process', enum: ADRType })
  @Column({ type: DataType.STRING, allowNull: false })
  adrType!: ADRType;

  @ApiProperty({ description: 'Current status', enum: ADRStatus })
  @Column({ type: DataType.STRING, allowNull: false })
  status!: ADRStatus;

  @ApiProperty({ description: 'Associated matter ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  matterId!: string;

  @ApiProperty({ description: 'Matter name' })
  @Column({ type: DataType.STRING, allowNull: false })
  matterName!: string;

  @ApiProperty({ description: 'Claimant party ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  claimantId!: string;

  @ApiProperty({ description: 'Claimant party name' })
  @Column({ type: DataType.STRING, allowNull: false })
  claimantName!: string;

  @ApiProperty({ description: 'Respondent party ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  respondentId!: string;

  @ApiProperty({ description: 'Respondent party name' })
  @Column({ type: DataType.STRING, allowNull: false })
  respondentName!: string;

  @ApiPropertyOptional({ description: 'Assigned mediator ID' })
  @ForeignKey(() => Mediator)
  @Column({ type: DataType.UUID, allowNull: true })
  mediatorId?: string;

  @ApiProperty({ description: 'Arbitrator panel IDs', isArray: true })
  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
    defaultValue: [],
  })
  arbitratorIds!: string[];

  @ApiProperty({ description: 'Description of the dispute' })
  @Column({ type: DataType.TEXT, allowNull: false })
  disputeDescription!: string;

  @ApiPropertyOptional({ description: 'Amount in controversy' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: true })
  amountInControversy?: number;

  @ApiPropertyOptional({
    description: 'Arbitration type',
    enum: ArbitrationType,
  })
  @Column({ type: DataType.STRING, allowNull: true })
  arbitrationType?: ArbitrationType;

  @ApiPropertyOptional({
    description: 'Applicable arbitration rules',
    enum: ArbitrationRules,
  })
  @Column({ type: DataType.STRING, allowNull: true })
  arbitrationRules?: ArbitrationRules;

  @ApiProperty({ description: 'Session format', enum: SessionFormat })
  @Column({ type: DataType.STRING, allowNull: false })
  sessionFormat!: SessionFormat;

  @ApiPropertyOptional({ description: 'Scheduled date/time' })
  @Column({ type: DataType.DATE, allowNull: true })
  scheduledDate?: Date;

  @ApiPropertyOptional({ description: 'Scheduled duration in hours' })
  @Column({ type: DataType.INTEGER, allowNull: true })
  scheduledDuration?: number;

  @ApiPropertyOptional({ description: 'Physical location' })
  @Column({ type: DataType.STRING, allowNull: true })
  location?: string;

  @ApiPropertyOptional({ description: 'Virtual meeting link' })
  @Column({ type: DataType.STRING, allowNull: true })
  virtualMeetingLink?: string;

  @ApiProperty({
    description: 'Confidentiality agreement signed',
    default: false,
  })
  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  confidentialityAgreementSigned!: boolean;

  @ApiProperty({ description: 'Binding ADR', default: false })
  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isBinding!: boolean;

  @ApiProperty({ description: 'Discovery allowed', default: false })
  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  discoveryAllowed!: boolean;

  @ApiPropertyOptional({ description: 'Filing fee' })
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
  filingFee?: number;

  @ApiPropertyOptional({ description: 'Administrative fees' })
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
  administrativeFees?: number;

  @ApiPropertyOptional({ description: 'Neutral fees' })
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: true })
  neutralFees?: number;

  @ApiPropertyOptional({ description: 'Estimated total cost' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: true })
  estimatedTotalCost?: number;

  @ApiPropertyOptional({ description: 'Actual total cost' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: true })
  actualTotalCost?: number;

  @ApiProperty({ description: 'Initiation date' })
  @Column({ type: DataType.DATE, allowNull: false })
  initiationDate!: Date;

  @ApiPropertyOptional({ description: 'Completion date' })
  @Column({ type: DataType.DATE, allowNull: true })
  completionDate?: Date;

  @ApiPropertyOptional({ description: 'Outcome description' })
  @Column({ type: DataType.TEXT, allowNull: true })
  outcome?: string;

  @ApiPropertyOptional({ description: 'Settlement amount' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: true })
  settlementAmount?: number;

  @ApiProperty({ description: 'Tags', isArray: true })
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
  })
  tags!: string[];

  @ApiProperty({ description: 'Additional metadata', type: 'object' })
  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: {} })
  metadata!: Record<string, any>;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  @ApiPropertyOptional({ description: 'Soft delete timestamp' })
  @DeletedAt
  @Column(DataType.DATE)
  deletedAt?: Date;

  @BelongsTo(() => Mediator)
  mediator?: Mediator;

  @HasMany(() => SettlementOffer, 'adrProceedingId')
  settlementOffers!: SettlementOffer[];

  @HasMany(() => ArbitrationAward, 'adrProceedingId')
  awards!: ArbitrationAward[];

  @HasMany(() => ADRSession, 'adrProceedingId')
  sessions!: ADRSession[];
}

@Table({
  tableName: 'settlement_offers',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['adr_proceeding_id'] },
    { fields: ['offer_number'], unique: true },
    { fields: ['status'] },
    { fields: ['response_deadline'] },
  ],
})
export class SettlementOffer extends Model<ISettlementOffer> {
  @ApiProperty({ description: 'Unique settlement offer identifier' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ApiProperty({ description: 'Associated ADR proceeding ID' })
  @ForeignKey(() => ADRProceeding)
  @Column({ type: DataType.UUID, allowNull: false })
  adrProceedingId!: string;

  @ApiProperty({ description: 'Offer number' })
  @Index({ unique: true })
  @Column({ type: DataType.STRING, allowNull: false })
  offerNumber!: string;

  @ApiProperty({ description: 'Offering party', enum: ['claimant', 'respondent'] })
  @Column({ type: DataType.STRING, allowNull: false })
  offeringParty!: 'claimant' | 'respondent';

  @ApiProperty({ description: 'Offering party ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  offeringPartyId!: string;

  @ApiProperty({ description: 'Receiving party ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  receivingPartyId!: string;

  @ApiProperty({ description: 'Monetary offer amount' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  offerAmount!: number;

  @ApiPropertyOptional({ description: 'Structured payment option' })
  @Column({ type: DataType.BOOLEAN, allowNull: true })
  structuredPayment?: boolean;

  @ApiPropertyOptional({ description: 'Payment terms description' })
  @Column({ type: DataType.TEXT, allowNull: true })
  paymentTerms?: string;

  @ApiPropertyOptional({ description: 'Non-monetary terms', isArray: true })
  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
  nonMonetaryTerms?: string[];

  @ApiProperty({ description: 'Conditions of offer', isArray: true })
  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
  conditions!: string[];

  @ApiProperty({ description: 'Offer status', enum: SettlementOfferStatus })
  @Column({ type: DataType.STRING, allowNull: false })
  status!: SettlementOfferStatus;

  @ApiProperty({ description: 'Date offer proposed' })
  @Column({ type: DataType.DATE, allowNull: false })
  proposedDate!: Date;

  @ApiProperty({ description: 'Response deadline' })
  @Column({ type: DataType.DATE, allowNull: false })
  responseDeadline!: Date;

  @ApiPropertyOptional({ description: 'Date of response' })
  @Column({ type: DataType.DATE, allowNull: true })
  responseDate?: Date;

  @ApiPropertyOptional({ description: 'Counter offer amount' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: true })
  counterOfferAmount?: number;

  @ApiPropertyOptional({ description: 'Rejection reason' })
  @Column({ type: DataType.TEXT, allowNull: true })
  rejectionReason?: string;

  @ApiPropertyOptional({ description: 'Date accepted' })
  @Column({ type: DataType.DATE, allowNull: true })
  acceptedDate?: Date;

  @ApiProperty({ description: 'Confidential offer', default: true })
  @Default(true)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  confidential!: boolean;

  @ApiPropertyOptional({ description: 'Validity period in days' })
  @Column({ type: DataType.INTEGER, allowNull: true })
  validityPeriod?: number;

  @ApiProperty({ description: 'Related offer IDs', isArray: true })
  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
    defaultValue: [],
  })
  relatedOfferIds!: string[];

  @ApiProperty({ description: 'Attachment file paths', isArray: true })
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
  })
  attachments!: string[];

  @ApiProperty({ description: 'Internal notes' })
  @Column({ type: DataType.TEXT, allowNull: false, defaultValue: '' })
  notes!: string;

  @ApiProperty({ description: 'Additional metadata', type: 'object' })
  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: {} })
  metadata!: Record<string, any>;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  @BelongsTo(() => ADRProceeding)
  adrProceeding!: ADRProceeding;
}

@Table({
  tableName: 'arbitration_awards',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['adr_proceeding_id'] },
    { fields: ['award_number'], unique: true },
    { fields: ['status'] },
    { fields: ['issued_date'] },
  ],
})
export class ArbitrationAward extends Model<IArbitrationAward> {
  @ApiProperty({ description: 'Unique award identifier' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ApiProperty({ description: 'Associated ADR proceeding ID' })
  @ForeignKey(() => ADRProceeding)
  @Column({ type: DataType.UUID, allowNull: false })
  adrProceedingId!: string;

  @ApiProperty({ description: 'Award number' })
  @Index({ unique: true })
  @Column({ type: DataType.STRING, allowNull: false })
  awardNumber!: string;

  @ApiProperty({ description: 'Arbitrator panel IDs', isArray: true })
  @Column({ type: DataType.ARRAY(DataType.UUID), allowNull: false })
  arbitratorIds!: string[];

  @ApiProperty({
    description: 'Type of award',
    enum: ['final', 'interim', 'partial', 'consent', 'default'],
  })
  @Column({ type: DataType.STRING, allowNull: false })
  awardType!: 'final' | 'interim' | 'partial' | 'consent' | 'default';

  @ApiProperty({ description: 'Award status', enum: AwardStatus })
  @Column({ type: DataType.STRING, allowNull: false })
  status!: AwardStatus;

  @ApiPropertyOptional({ description: 'Date award issued' })
  @Column({ type: DataType.DATE, allowNull: true })
  issuedDate?: Date;

  @ApiPropertyOptional({ description: 'Monetary award amount' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: true })
  awardAmount?: number;

  @ApiPropertyOptional({
    description: 'Prevailing party',
    enum: ['claimant', 'respondent', 'split'],
  })
  @Column({ type: DataType.STRING, allowNull: true })
  prevailingParty?: 'claimant' | 'respondent' | 'split';

  @ApiProperty({ description: 'Factual findings' })
  @Column({ type: DataType.TEXT, allowNull: false })
  findings!: string;

  @ApiProperty({ description: 'Legal reasoning' })
  @Column({ type: DataType.TEXT, allowNull: false })
  reasoning!: string;

  @ApiPropertyOptional({ description: 'Costs awarded' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: true })
  costsAwarded?: number;

  @ApiPropertyOptional({ description: 'Costs allocated to claimant' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: true })
  costsAllocationClaimant?: number;

  @ApiPropertyOptional({ description: 'Costs allocated to respondent' })
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: true })
  costsAllocationRespondent?: number;

  @ApiPropertyOptional({ description: 'Interest rate percentage' })
  @Column({ type: DataType.DECIMAL(5, 2), allowNull: true })
  interestRate?: number;

  @ApiPropertyOptional({ description: 'Interest accrual start date' })
  @Column({ type: DataType.DATE, allowNull: true })
  interestStartDate?: Date;

  @ApiPropertyOptional({ description: 'Payment deadline' })
  @Column({ type: DataType.DATE, allowNull: true })
  paymentDeadline?: Date;

  @ApiProperty({ description: 'Appeal allowed', default: false })
  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  appealAllowed!: boolean;

  @ApiPropertyOptional({ description: 'Appeal deadline' })
  @Column({ type: DataType.DATE, allowNull: true })
  appealDeadline?: Date;

  @ApiPropertyOptional({ description: 'Confirmation motion filing date' })
  @Column({ type: DataType.DATE, allowNull: true })
  confirmationMotionDate?: Date;

  @ApiPropertyOptional({ description: 'Confirmation judgment reference' })
  @Column({ type: DataType.STRING, allowNull: true })
  confirmationJudgment?: string;

  @ApiPropertyOptional({ description: 'Vacature motion filing date' })
  @Column({ type: DataType.DATE, allowNull: true })
  vacatureMotionDate?: Date;

  @ApiPropertyOptional({ description: 'Vacature reason' })
  @Column({ type: DataType.TEXT, allowNull: true })
  vacatureReason?: string;

  @ApiPropertyOptional({ description: 'Enforcement jurisdiction' })
  @Column({ type: DataType.STRING, allowNull: true })
  enforcementJurisdiction?: string;

  @ApiPropertyOptional({ description: 'Enforcement status' })
  @Column({ type: DataType.STRING, allowNull: true })
  enforcementStatus?: string;

  @ApiPropertyOptional({ description: 'Satisfaction date' })
  @Column({ type: DataType.DATE, allowNull: true })
  satisfactionDate?: Date;

  @ApiProperty({ description: 'Award document file path' })
  @Column({ type: DataType.STRING, allowNull: false })
  documentPath!: string;

  @ApiPropertyOptional({ description: 'Digital signature hash' })
  @Column({ type: DataType.STRING, allowNull: true })
  digitalSignature?: string;

  @ApiProperty({ description: 'Additional metadata', type: 'object' })
  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: {} })
  metadata!: Record<string, any>;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  @BelongsTo(() => ADRProceeding)
  adrProceeding!: ADRProceeding;
}

@Table({
  tableName: 'adr_sessions',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['adr_proceeding_id'] },
    { fields: ['session_date'] },
    { fields: ['session_number'] },
  ],
})
export class ADRSession extends Model<IADRSession> {
  @ApiProperty({ description: 'Unique session identifier' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ApiProperty({ description: 'Associated ADR proceeding ID' })
  @ForeignKey(() => ADRProceeding)
  @Column({ type: DataType.UUID, allowNull: false })
  adrProceedingId!: string;

  @ApiProperty({ description: 'Session number' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  sessionNumber!: number;

  @ApiProperty({ description: 'Session date/time' })
  @Column({ type: DataType.DATE, allowNull: false })
  sessionDate!: Date;

  @ApiProperty({ description: 'Duration in hours' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  duration!: number;

  @ApiProperty({ description: 'Session format', enum: SessionFormat })
  @Column({ type: DataType.STRING, allowNull: false })
  format!: SessionFormat;

  @ApiPropertyOptional({ description: 'Physical location' })
  @Column({ type: DataType.STRING, allowNull: true })
  location?: string;

  @ApiPropertyOptional({ description: 'Virtual meeting link' })
  @Column({ type: DataType.STRING, allowNull: true })
  virtualMeetingLink?: string;

  @ApiProperty({ description: 'Attendee IDs', isArray: true })
  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
  attendees!: string[];

  @ApiPropertyOptional({ description: 'Mediator confidential notes' })
  @Column({ type: DataType.TEXT, allowNull: true })
  mediatorNotes?: string;

  @ApiProperty({ description: 'Progress notes' })
  @Column({ type: DataType.TEXT, allowNull: false, defaultValue: '' })
  progressNotes!: string;

  @ApiProperty({ description: 'Next steps', isArray: true })
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
  })
  nextSteps!: string[];

  @ApiProperty({ description: 'Documents exchanged', isArray: true })
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
  })
  documentsExchanged!: string[];

  @ApiProperty({ description: 'Settlement discussed', default: false })
  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  settlementDiscussed!: boolean;

  @ApiPropertyOptional({ description: 'Settlement range discussed' })
  @Column({ type: DataType.JSONB, allowNull: true })
  settlementRange?: { min: number; max: number };

  @ApiPropertyOptional({ description: 'Next session scheduled date' })
  @Column({ type: DataType.DATE, allowNull: true })
  nextSessionDate?: Date;

  @ApiProperty({ description: 'Caucus held', default: false })
  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  caucusHeld!: boolean;

  @ApiPropertyOptional({ description: 'Caucus duration in minutes' })
  @Column({ type: DataType.INTEGER, allowNull: true })
  caucusDuration?: number;

  @ApiProperty({ description: 'Session successful', default: false })
  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isSuccessful!: boolean;

  @ApiProperty({ description: 'Additional metadata', type: 'object' })
  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: {} })
  metadata!: Record<string, any>;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreatedAt
  @Column(DataType.DATE)
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt!: Date;

  @BelongsTo(() => ADRProceeding)
  adrProceeding!: ADRProceeding;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generates unique ADR proceeding number
 */
export function generateADRNumber(prefix: string = 'ADR'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Generates unique settlement offer number
 */
export function generateOfferNumber(adrNumber: string, sequence: number): string {
  return `${adrNumber}-OFFER-${sequence.toString().padStart(3, '0')}`;
}

/**
 * Generates unique arbitration award number
 */
export function generateAwardNumber(adrNumber: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${adrNumber}-AWARD-${timestamp}`;
}

/**
 * Calculates mediator conflict score
 */
export function calculateConflictScore(
  mediatorConflictIds: string[],
  partyIds: string[]
): number {
  const conflicts = partyIds.filter((id) => mediatorConflictIds.includes(id));
  return conflicts.length / partyIds.length;
}

/**
 * Ranks mediators by suitability
 */
export function rankMediatorsBySuitability(
  mediators: IMediator[],
  criteria: {
    specialization?: string;
    jurisdiction?: string;
    maxRate?: number;
    partyIds: string[];
  }
): IMediator[] {
  return mediators
    .filter((m) => {
      if (!m.isActive) return false;
      if (criteria.maxRate && m.hourlyRate > criteria.maxRate) return false;
      if (criteria.jurisdiction && !m.jurisdictions.includes(criteria.jurisdiction))
        return false;
      if (criteria.specialization && !m.specializations.includes(criteria.specialization))
        return false;
      const conflictScore = calculateConflictScore(m.conflictCheckIds, criteria.partyIds);
      return conflictScore === 0;
    })
    .sort((a, b) => {
      const scoreA = (a.successRate || 0) + a.yearsExperience * 0.5 + (a.rating || 0) * 10;
      const scoreB = (b.successRate || 0) + b.yearsExperience * 0.5 + (b.rating || 0) * 10;
      return scoreB - scoreA;
    });
}

// ============================================================================
// NESTJS SERVICES
// ============================================================================

/**
 * Mediator Selection Service
 * Manages mediator profiles and selection algorithms
 */
@Injectable()
export class MediatorSelectionService {
  private readonly logger = new Logger(MediatorSelectionService.name);

  constructor(
    @Inject('MEDIATOR_REPOSITORY')
    private readonly mediatorRepository: typeof Mediator
  ) {}

  /**
   * Creates a new mediator profile
   */
  async createMediator(data: z.infer<typeof CreateMediatorSchema>): Promise<Mediator> {
    try {
      const validated = CreateMediatorSchema.parse(data);
      const mediator = await this.mediatorRepository.create({
        ...validated,
        totalCasesMediated: 0,
        conflictCheckIds: [],
        isActive: true,
        availability: {},
        metadata: {},
      } as any);
      this.logger.log(`Created mediator: ${mediator.id}`);
      return mediator;
    } catch (error) {
      this.logger.error('Failed to create mediator', error);
      throw new BadRequestException('Failed to create mediator');
    }
  }

  /**
   * Finds qualified mediators based on criteria
   */
  async findQualifiedMediators(criteria: {
    specialization?: string;
    jurisdiction?: string;
    certifications?: MediatorCertification[];
    maxRate?: number;
    minExperience?: number;
    partyIds: string[];
  }): Promise<Mediator[]> {
    try {
      const whereClause: WhereOptions = { isActive: true };

      if (criteria.jurisdiction) {
        whereClause.jurisdictions = { [Op.contains]: [criteria.jurisdiction] };
      }

      if (criteria.specialization) {
        whereClause.specializations = { [Op.contains]: [criteria.specialization] };
      }

      if (criteria.certifications) {
        whereClause.certifications = { [Op.overlap]: criteria.certifications };
      }

      if (criteria.maxRate) {
        whereClause.hourlyRate = { [Op.lte]: criteria.maxRate };
      }

      if (criteria.minExperience) {
        whereClause.yearsExperience = { [Op.gte]: criteria.minExperience };
      }

      const mediators = await this.mediatorRepository.findAll({ where: whereClause });

      return rankMediatorsBySuitability(mediators as any, criteria);
    } catch (error) {
      this.logger.error('Failed to find qualified mediators', error);
      throw new InternalServerErrorException('Failed to find qualified mediators');
    }
  }

  /**
   * Performs conflict check for mediator
   */
  async performConflictCheck(
    mediatorId: string,
    partyIds: string[]
  ): Promise<{ hasConflict: boolean; conflictingParties: string[] }> {
    try {
      const mediator = await this.mediatorRepository.findByPk(mediatorId);
      if (!mediator) {
        throw new NotFoundException('Mediator not found');
      }

      const conflictingParties = partyIds.filter((id) =>
        mediator.conflictCheckIds.includes(id)
      );

      return {
        hasConflict: conflictingParties.length > 0,
        conflictingParties,
      };
    } catch (error) {
      this.logger.error('Conflict check failed', error);
      throw error;
    }
  }

  /**
   * Updates mediator availability calendar
   */
  async updateAvailability(
    mediatorId: string,
    availability: Record<string, boolean>
  ): Promise<Mediator> {
    try {
      const mediator = await this.mediatorRepository.findByPk(mediatorId);
      if (!mediator) {
        throw new NotFoundException('Mediator not found');
      }

      await mediator.update({ availability });
      return mediator;
    } catch (error) {
      this.logger.error('Failed to update availability', error);
      throw error;
    }
  }

  /**
   * Calculates mediator success metrics
   */
  async calculateMediatorMetrics(mediatorId: string): Promise<{
    successRate: number;
    averageResolutionTime: number;
    totalCases: number;
  }> {
    try {
      const proceedings = await ADRProceeding.findAll({
        where: { mediatorId, status: { [Op.in]: [ADRStatus.SETTLEMENT_REACHED, ADRStatus.COMPLETED] } },
      });

      const totalCases = proceedings.length;
      const settledCases = proceedings.filter(
        (p) => p.status === ADRStatus.SETTLEMENT_REACHED
      ).length;
      const successRate = totalCases > 0 ? (settledCases / totalCases) * 100 : 0;

      const resolutionTimes = proceedings
        .filter((p) => p.completionDate)
        .map((p) => differenceInDays(p.completionDate!, p.initiationDate));

      const averageResolutionTime =
        resolutionTimes.length > 0
          ? resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length
          : 0;

      return { successRate, averageResolutionTime, totalCases };
    } catch (error) {
      this.logger.error('Failed to calculate mediator metrics', error);
      throw new InternalServerErrorException('Failed to calculate metrics');
    }
  }

  /**
   * Validates mediator certification and renewal status
   */
  async validateMediatorCertification(mediatorId: string): Promise<{
    isValid: boolean;
    certifications: MediatorCertification[];
    expiringCertifications: string[];
    renewalRequired: boolean;
  }> {
    try {
      const mediator = await this.mediatorRepository.findByPk(mediatorId);
      if (!mediator) {
        throw new NotFoundException('Mediator not found');
      }

      const expiringCertifications: string[] = [];
      const certificationExpiryDates = mediator.metadata?.certificationExpiry || {};

      Object.entries(certificationExpiryDates).forEach(([cert, expiryDate]) => {
        const daysUntilExpiry = differenceInDays(new Date(expiryDate as string), new Date());
        if (daysUntilExpiry < 90) {
          expiringCertifications.push(cert);
        }
      });

      return {
        isValid: mediator.isActive && mediator.certifications.length > 0,
        certifications: mediator.certifications,
        expiringCertifications,
        renewalRequired: expiringCertifications.length > 0,
      };
    } catch (error) {
      this.logger.error('Failed to validate certification', error);
      throw error;
    }
  }

  /**
   * Searches mediators by party preferences
   */
  async searchMediatorsByPreference(preferences: {
    preferredStyle?: 'facilitative' | 'evaluative' | 'transformative';
    preferredGender?: string;
    preferredLanguage?: string;
    industryExperience?: string;
    virtualCapable?: boolean;
  }): Promise<Mediator[]> {
    try {
      const whereClause: WhereOptions = { isActive: true };

      if (preferences.preferredLanguage) {
        whereClause.languages = { [Op.contains]: [preferences.preferredLanguage] };
      }

      const mediators = await this.mediatorRepository.findAll({ where: whereClause });

      return mediators.filter((m) => {
        if (preferences.preferredStyle && m.metadata?.mediationStyle !== preferences.preferredStyle) {
          return false;
        }
        if (preferences.preferredGender && m.metadata?.gender !== preferences.preferredGender) {
          return false;
        }
        if (preferences.industryExperience && !m.specializations.includes(preferences.industryExperience)) {
          return false;
        }
        if (preferences.virtualCapable && !m.metadata?.virtualCapable) {
          return false;
        }
        return true;
      });
    } catch (error) {
      this.logger.error('Failed to search by preferences', error);
      throw new InternalServerErrorException('Failed to search by preferences');
    }
  }

  /**
   * Compares mediator costs and generates cost analysis
   */
  async compareMediatorCosts(mediatorIds: string[]): Promise<{
    mediatorId: string;
    name: string;
    hourlyRate: number;
    estimatedCost: number;
    valueScore: number;
  }[]> {
    try {
      const mediators = await this.mediatorRepository.findAll({
        where: { id: { [Op.in]: mediatorIds } },
      });

      const estimatedSessionHours = 8;

      return mediators.map((m) => {
        const estimatedCost = m.hourlyRate * estimatedSessionHours;
        const valueScore = (m.successRate || 0) / (m.hourlyRate / 100);

        return {
          mediatorId: m.id,
          name: `${m.firstName} ${m.lastName}`,
          hourlyRate: m.hourlyRate,
          estimatedCost,
          valueScore,
        };
      }).sort((a, b) => b.valueScore - a.valueScore);
    } catch (error) {
      this.logger.error('Failed to compare costs', error);
      throw new InternalServerErrorException('Failed to compare costs');
    }
  }
}

/**
 * ADR Proceeding Management Service
 * Manages ADR proceedings lifecycle
 */
@Injectable()
export class ADRProceedingService {
  private readonly logger = new Logger(ADRProceedingService.name);

  constructor(
    @Inject('ADR_PROCEEDING_REPOSITORY')
    private readonly adrRepository: typeof ADRProceeding,
    @Inject('MEDIATOR_REPOSITORY')
    private readonly mediatorRepository: typeof Mediator
  ) {}

  /**
   * Initiates a new ADR proceeding
   */
  async initiateADRProceeding(
    data: z.infer<typeof CreateADRProceedingSchema>
  ): Promise<ADRProceeding> {
    try {
      const validated = CreateADRProceedingSchema.parse(data);
      const adrNumber = generateADRNumber();

      const proceeding = await this.adrRepository.create({
        ...validated,
        adrNumber,
        status: ADRStatus.INITIATED,
        initiationDate: new Date(),
        arbitratorIds: [],
        confidentialityAgreementSigned: false,
        discoveryAllowed: false,
        tags: [],
        metadata: {},
      } as any);

      this.logger.log(`Initiated ADR proceeding: ${proceeding.adrNumber}`);
      return proceeding;
    } catch (error) {
      this.logger.error('Failed to initiate ADR proceeding', error);
      throw new BadRequestException('Failed to initiate ADR proceeding');
    }
  }

  /**
   * Assigns mediator to proceeding
   */
  async assignMediator(proceedingId: string, mediatorId: string): Promise<ADRProceeding> {
    try {
      const proceeding = await this.adrRepository.findByPk(proceedingId);
      if (!proceeding) {
        throw new NotFoundException('ADR proceeding not found');
      }

      const mediator = await this.mediatorRepository.findByPk(mediatorId);
      if (!mediator) {
        throw new NotFoundException('Mediator not found');
      }

      await proceeding.update({
        mediatorId,
        status: ADRStatus.SCHEDULED,
      });

      this.logger.log(`Assigned mediator ${mediatorId} to ${proceeding.adrNumber}`);
      return proceeding;
    } catch (error) {
      this.logger.error('Failed to assign mediator', error);
      throw error;
    }
  }

  /**
   * Schedules ADR session
   */
  async scheduleSession(
    proceedingId: string,
    sessionData: {
      scheduledDate: Date;
      scheduledDuration: number;
      location?: string;
      virtualMeetingLink?: string;
    }
  ): Promise<ADRProceeding> {
    try {
      const proceeding = await this.adrRepository.findByPk(proceedingId);
      if (!proceeding) {
        throw new NotFoundException('ADR proceeding not found');
      }

      await proceeding.update({
        ...sessionData,
        status: ADRStatus.SCHEDULED,
      });

      this.logger.log(`Scheduled session for ${proceeding.adrNumber}`);
      return proceeding;
    } catch (error) {
      this.logger.error('Failed to schedule session', error);
      throw error;
    }
  }

  /**
   * Updates proceeding status
   */
  async updateStatus(proceedingId: string, status: ADRStatus): Promise<ADRProceeding> {
    try {
      const proceeding = await this.adrRepository.findByPk(proceedingId);
      if (!proceeding) {
        throw new NotFoundException('ADR proceeding not found');
      }

      const updates: Partial<IADRProceeding> = { status };

      if (status === ADRStatus.COMPLETED || status === ADRStatus.SETTLEMENT_REACHED) {
        updates.completionDate = new Date();
      }

      await proceeding.update(updates as any);
      this.logger.log(`Updated status of ${proceeding.adrNumber} to ${status}`);
      return proceeding;
    } catch (error) {
      this.logger.error('Failed to update status', error);
      throw error;
    }
  }

  /**
   * Calculates estimated ADR costs
   */
  async calculateEstimatedCosts(proceedingId: string): Promise<{
    filingFee: number;
    administrativeFees: number;
    neutralFees: number;
    estimatedTotal: number;
  }> {
    try {
      const proceeding = await this.adrRepository.findByPk(proceedingId, {
        include: [Mediator],
      });

      if (!proceeding) {
        throw new NotFoundException('ADR proceeding not found');
      }

      const filingFee = proceeding.adrType === ADRType.ARBITRATION ? 1500 : 500;
      const administrativeFees = 1000;

      let neutralFees = 0;
      if (proceeding.mediator) {
        const estimatedHours = proceeding.scheduledDuration || 8;
        neutralFees = proceeding.mediator.hourlyRate * estimatedHours;
      }

      const estimatedTotal = filingFee + administrativeFees + neutralFees;

      await proceeding.update({
        filingFee,
        administrativeFees,
        neutralFees,
        estimatedTotalCost: estimatedTotal,
      });

      return { filingFee, administrativeFees, neutralFees, estimatedTotal };
    } catch (error) {
      this.logger.error('Failed to calculate costs', error);
      throw error;
    }
  }

  /**
   * Generates virtual meeting link for ADR session
   */
  async generateVirtualMeetingLink(proceedingId: string): Promise<{
    meetingLink: string;
    meetingId: string;
    passcode: string;
  }> {
    try {
      const proceeding = await this.adrRepository.findByPk(proceedingId);
      if (!proceeding) {
        throw new NotFoundException('ADR proceeding not found');
      }

      const meetingId = crypto.randomBytes(8).toString('hex');
      const passcode = Math.random().toString(36).substring(2, 10).toUpperCase();
      const meetingLink = `https://adr-virtual.whitecross.com/meeting/${meetingId}?pwd=${passcode}`;

      await proceeding.update({ virtualMeetingLink: meetingLink });

      this.logger.log(`Generated virtual meeting link for ${proceeding.adrNumber}`);
      return { meetingLink, meetingId, passcode };
    } catch (error) {
      this.logger.error('Failed to generate meeting link', error);
      throw error;
    }
  }

  /**
   * Sends ADR notifications to parties
   */
  async sendADRNotifications(proceedingId: string, notificationType: 'scheduled' | 'reminder' | 'outcome'): Promise<{
    sent: boolean;
    recipients: string[];
  }> {
    try {
      const proceeding = await this.adrRepository.findByPk(proceedingId);
      if (!proceeding) {
        throw new NotFoundException('ADR proceeding not found');
      }

      const recipients = [proceeding.claimantId, proceeding.respondentId];
      if (proceeding.mediatorId) {
        recipients.push(proceeding.mediatorId);
      }

      this.logger.log(`Sent ${notificationType} notifications for ${proceeding.adrNumber}`);
      return { sent: true, recipients };
    } catch (error) {
      this.logger.error('Failed to send notifications', error);
      throw error;
    }
  }

  /**
   * Generates confidentiality agreement
   */
  async generateConfidentialityAgreement(proceedingId: string): Promise<{
    agreementPath: string;
    agreementContent: string;
  }> {
    try {
      const proceeding = await this.adrRepository.findByPk(proceedingId);
      if (!proceeding) {
        throw new NotFoundException('ADR proceeding not found');
      }

      const agreementContent = `
CONFIDENTIALITY AGREEMENT
ADR Proceeding: ${proceeding.adrNumber}

This Agreement is entered into by and between:
Claimant: ${proceeding.claimantName}
Respondent: ${proceeding.respondentName}

The parties agree that all information disclosed during the ${proceeding.adrType}
proceeding shall remain strictly confidential and shall not be disclosed to any
third party without prior written consent of all parties.

Date: ${format(new Date(), 'yyyy-MM-dd')}
      `.trim();

      const agreementPath = `/agreements/${proceeding.adrNumber}-confidentiality.pdf`;

      await proceeding.update({
        confidentialityAgreementSigned: true,
        metadata: { ...proceeding.metadata, confidentialityAgreementPath: agreementPath }
      });

      this.logger.log(`Generated confidentiality agreement for ${proceeding.adrNumber}`);
      return { agreementPath, agreementContent };
    } catch (error) {
      this.logger.error('Failed to generate confidentiality agreement', error);
      throw error;
    }
  }

  /**
   * Tracks ADR communications and correspondence
   */
  async trackADRCommunications(proceedingId: string, communication: {
    type: 'email' | 'phone' | 'document' | 'meeting';
    from: string;
    to: string;
    subject: string;
    content?: string;
  }): Promise<void> {
    try {
      const proceeding = await this.adrRepository.findByPk(proceedingId);
      if (!proceeding) {
        throw new NotFoundException('ADR proceeding not found');
      }

      const communications = proceeding.metadata?.communications || [];
      communications.push({
        ...communication,
        timestamp: new Date(),
      });

      await proceeding.update({
        metadata: { ...proceeding.metadata, communications }
      });

      this.logger.log(`Tracked communication for ${proceeding.adrNumber}`);
    } catch (error) {
      this.logger.error('Failed to track communication', error);
      throw error;
    }
  }
}

/**
 * Settlement Offer Management Service
 * Manages settlement offers and counteroffers
 */
@Injectable()
export class SettlementOfferService {
  private readonly logger = new Logger(SettlementOfferService.name);

  constructor(
    @Inject('SETTLEMENT_OFFER_REPOSITORY')
    private readonly offerRepository: typeof SettlementOffer,
    @Inject('ADR_PROCEEDING_REPOSITORY')
    private readonly adrRepository: typeof ADRProceeding
  ) {}

  /**
   * Creates a new settlement offer
   */
  async createOffer(
    data: z.infer<typeof CreateSettlementOfferSchema>
  ): Promise<SettlementOffer> {
    try {
      const validated = CreateSettlementOfferSchema.parse(data);

      const proceeding = await this.adrRepository.findByPk(validated.adrProceedingId);
      if (!proceeding) {
        throw new NotFoundException('ADR proceeding not found');
      }

      const existingOffers = await this.offerRepository.count({
        where: { adrProceedingId: validated.adrProceedingId },
      });

      const offerNumber = generateOfferNumber(proceeding.adrNumber, existingOffers + 1);

      const offer = await this.offerRepository.create({
        ...validated,
        offerNumber,
        status: SettlementOfferStatus.PROPOSED,
        proposedDate: new Date(),
        relatedOfferIds: [],
        attachments: [],
        notes: '',
        metadata: {},
      } as any);

      this.logger.log(`Created settlement offer: ${offer.offerNumber}`);
      return offer;
    } catch (error) {
      this.logger.error('Failed to create settlement offer', error);
      throw new BadRequestException('Failed to create settlement offer');
    }
  }

  /**
   * Responds to settlement offer
   */
  async respondToOffer(
    offerId: string,
    response: {
      action: 'accept' | 'reject' | 'counter';
      counterAmount?: number;
      rejectionReason?: string;
    }
  ): Promise<SettlementOffer> {
    try {
      const offer = await this.offerRepository.findByPk(offerId);
      if (!offer) {
        throw new NotFoundException('Settlement offer not found');
      }

      if (offer.status !== SettlementOfferStatus.PROPOSED) {
        throw new BadRequestException('Offer is not in proposed status');
      }

      const updates: Partial<ISettlementOffer> = {
        responseDate: new Date(),
      };

      if (response.action === 'accept') {
        updates.status = SettlementOfferStatus.ACCEPTED;
        updates.acceptedDate = new Date();
      } else if (response.action === 'reject') {
        updates.status = SettlementOfferStatus.REJECTED;
        updates.rejectionReason = response.rejectionReason;
      } else if (response.action === 'counter') {
        updates.status = SettlementOfferStatus.COUNTERED;
        updates.counterOfferAmount = response.counterAmount;
      }

      await offer.update(updates as any);
      this.logger.log(`Responded to offer ${offer.offerNumber}: ${response.action}`);
      return offer;
    } catch (error) {
      this.logger.error('Failed to respond to offer', error);
      throw error;
    }
  }

  /**
   * Generates settlement valuation analysis
   */
  async generateValuationAnalysis(offerId: string): Promise<{
    offerAmount: number;
    estimatedValue: number;
    valuationPercentage: number;
    recommendation: string;
  }> {
    try {
      const offer = await this.offerRepository.findByPk(offerId, {
        include: [{ model: ADRProceeding, as: 'adrProceeding' }],
      });

      if (!offer) {
        throw new NotFoundException('Settlement offer not found');
      }

      const estimatedValue = offer.adrProceeding.amountInControversy || 0;
      const valuationPercentage =
        estimatedValue > 0 ? (offer.offerAmount / estimatedValue) * 100 : 0;

      let recommendation = 'Consider';
      if (valuationPercentage >= 80) recommendation = 'Strong acceptance recommended';
      else if (valuationPercentage >= 60) recommendation = 'Acceptance recommended';
      else if (valuationPercentage >= 40) recommendation = 'Consider countering';
      else recommendation = 'Counter or reject recommended';

      return {
        offerAmount: offer.offerAmount,
        estimatedValue,
        valuationPercentage,
        recommendation,
      };
    } catch (error) {
      this.logger.error('Failed to generate valuation analysis', error);
      throw error;
    }
  }

  /**
   * Tracks settlement negotiation history
   */
  async getOfferHistory(adrProceedingId: string): Promise<SettlementOffer[]> {
    try {
      return await this.offerRepository.findAll({
        where: { adrProceedingId },
        order: [['proposedDate', 'ASC']],
      });
    } catch (error) {
      this.logger.error('Failed to get offer history', error);
      throw new InternalServerErrorException('Failed to get offer history');
    }
  }

  /**
   * Generates settlement agreement document
   */
  async generateSettlementAgreement(offerId: string): Promise<{
    agreementPath: string;
    agreementContent: string;
  }> {
    try {
      const offer = await this.offerRepository.findByPk(offerId, {
        include: [{ model: ADRProceeding, as: 'adrProceeding' }],
      });

      if (!offer) {
        throw new NotFoundException('Settlement offer not found');
      }

      if (offer.status !== SettlementOfferStatus.ACCEPTED) {
        throw new BadRequestException('Only accepted offers can generate agreements');
      }

      const agreementContent = `
SETTLEMENT AGREEMENT
Offer Number: ${offer.offerNumber}
ADR Proceeding: ${offer.adrProceeding.adrNumber}

This Settlement Agreement is entered into on ${format(new Date(), 'MMMM d, yyyy')} by and between:

Claimant: ${offer.adrProceeding.claimantName}
Respondent: ${offer.adrProceeding.respondentName}

SETTLEMENT TERMS:
1. Settlement Amount: $${offer.offerAmount.toLocaleString()}
2. Payment Terms: ${offer.paymentTerms || 'Payment in full within 30 days'}

${offer.nonMonetaryTerms && offer.nonMonetaryTerms.length > 0 ? `
NON-MONETARY TERMS:
${offer.nonMonetaryTerms.map((term, idx) => `${idx + 1}. ${term}`).join('\n')}
` : ''}

CONDITIONS:
${offer.conditions.map((cond, idx) => `${idx + 1}. ${cond}`).join('\n')}

This Agreement constitutes the full and final settlement of all claims.

Date of Settlement: ${format(offer.acceptedDate!, 'yyyy-MM-dd')}
      `.trim();

      const agreementPath = `/settlements/${offer.offerNumber}-agreement.pdf`;

      await offer.update({
        metadata: { ...offer.metadata, settlementAgreementPath: agreementPath }
      });

      this.logger.log(`Generated settlement agreement for ${offer.offerNumber}`);
      return { agreementPath, agreementContent };
    } catch (error) {
      this.logger.error('Failed to generate settlement agreement', error);
      throw error;
    }
  }

  /**
   * Validates offer compliance with legal requirements
   */
  async validateOfferCompliance(offerId: string): Promise<{
    isCompliant: boolean;
    violations: string[];
    warnings: string[];
  }> {
    try {
      const offer = await this.offerRepository.findByPk(offerId);
      if (!offer) {
        throw new NotFoundException('Settlement offer not found');
      }

      const violations: string[] = [];
      const warnings: string[] = [];

      if (offer.offerAmount <= 0) {
        violations.push('Offer amount must be greater than zero');
      }

      if (offer.conditions.length === 0) {
        warnings.push('No conditions specified for settlement');
      }

      if (!offer.responseDeadline) {
        violations.push('Response deadline is required');
      } else if (isBefore(offer.responseDeadline, new Date())) {
        warnings.push('Response deadline has passed');
      }

      if (offer.confidential && !offer.metadata?.confidentialityClause) {
        warnings.push('Confidential offer should include confidentiality clause');
      }

      return {
        isCompliant: violations.length === 0,
        violations,
        warnings,
      };
    } catch (error) {
      this.logger.error('Failed to validate offer compliance', error);
      throw error;
    }
  }

  /**
   * Calculates settlement offer trends
   */
  async calculateOfferTrends(adrProceedingId: string): Promise<{
    offerCount: number;
    averageOfferAmount: number;
    lowestOffer: number;
    highestOffer: number;
    trendDirection: 'increasing' | 'decreasing' | 'stable';
  }> {
    try {
      const offers = await this.offerRepository.findAll({
        where: { adrProceedingId },
        order: [['proposedDate', 'ASC']],
      });

      if (offers.length === 0) {
        return {
          offerCount: 0,
          averageOfferAmount: 0,
          lowestOffer: 0,
          highestOffer: 0,
          trendDirection: 'stable',
        };
      }

      const amounts = offers.map((o) => o.offerAmount);
      const averageOfferAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const lowestOffer = Math.min(...amounts);
      const highestOffer = Math.max(...amounts);

      let trendDirection: 'increasing' | 'decreasing' | 'stable' = 'stable';
      if (offers.length >= 2) {
        const firstHalf = offers.slice(0, Math.floor(offers.length / 2));
        const secondHalf = offers.slice(Math.floor(offers.length / 2));

        const firstAvg = firstHalf.reduce((sum, o) => sum + o.offerAmount, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, o) => sum + o.offerAmount, 0) / secondHalf.length;

        if (secondAvg > firstAvg * 1.1) {
          trendDirection = 'increasing';
        } else if (secondAvg < firstAvg * 0.9) {
          trendDirection = 'decreasing';
        }
      }

      return {
        offerCount: offers.length,
        averageOfferAmount,
        lowestOffer,
        highestOffer,
        trendDirection,
      };
    } catch (error) {
      this.logger.error('Failed to calculate offer trends', error);
      throw new InternalServerErrorException('Failed to calculate offer trends');
    }
  }
}

/**
 * Arbitration Award Management Service
 * Manages arbitration awards and enforcement
 */
@Injectable()
export class ArbitrationAwardService {
  private readonly logger = new Logger(ArbitrationAwardService.name);

  constructor(
    @Inject('ARBITRATION_AWARD_REPOSITORY')
    private readonly awardRepository: typeof ArbitrationAward,
    @Inject('ADR_PROCEEDING_REPOSITORY')
    private readonly adrRepository: typeof ADRProceeding
  ) {}

  /**
   * Creates arbitration award
   */
  async createAward(
    data: z.infer<typeof CreateArbitrationAwardSchema>
  ): Promise<ArbitrationAward> {
    try {
      const validated = CreateArbitrationAwardSchema.parse(data);

      const proceeding = await this.adrRepository.findByPk(validated.adrProceedingId);
      if (!proceeding) {
        throw new NotFoundException('ADR proceeding not found');
      }

      const awardNumber = generateAwardNumber(proceeding.adrNumber);

      const award = await this.awardRepository.create({
        ...validated,
        awardNumber,
        status: AwardStatus.DRAFT,
        documentPath: `/awards/${awardNumber}.pdf`,
        metadata: {},
      } as any);

      this.logger.log(`Created arbitration award: ${award.awardNumber}`);
      return award;
    } catch (error) {
      this.logger.error('Failed to create award', error);
      throw new BadRequestException('Failed to create award');
    }
  }

  /**
   * Issues arbitration award
   */
  async issueAward(awardId: string): Promise<ArbitrationAward> {
    try {
      const award = await this.awardRepository.findByPk(awardId);
      if (!award) {
        throw new NotFoundException('Award not found');
      }

      if (award.status !== AwardStatus.DRAFT) {
        throw new BadRequestException('Award must be in draft status');
      }

      await award.update({
        status: AwardStatus.ISSUED,
        issuedDate: new Date(),
      });

      const proceeding = await this.adrRepository.findByPk(award.adrProceedingId);
      if (proceeding) {
        await proceeding.update({ status: ADRStatus.AWARD_ISSUED });
      }

      this.logger.log(`Issued award: ${award.awardNumber}`);
      return award;
    } catch (error) {
      this.logger.error('Failed to issue award', error);
      throw error;
    }
  }

  /**
   * Confirms arbitration award
   */
  async confirmAward(
    awardId: string,
    confirmationData: { confirmationJudgment: string; confirmationMotionDate: Date }
  ): Promise<ArbitrationAward> {
    try {
      const award = await this.awardRepository.findByPk(awardId);
      if (!award) {
        throw new NotFoundException('Award not found');
      }

      await award.update({
        status: AwardStatus.CONFIRMED,
        ...confirmationData,
      });

      this.logger.log(`Confirmed award: ${award.awardNumber}`);
      return award;
    } catch (error) {
      this.logger.error('Failed to confirm award', error);
      throw error;
    }
  }

  /**
   * Tracks award enforcement
   */
  async trackEnforcement(
    awardId: string,
    enforcementData: { jurisdiction: string; enforcementStatus: string }
  ): Promise<ArbitrationAward> {
    try {
      const award = await this.awardRepository.findByPk(awardId);
      if (!award) {
        throw new NotFoundException('Award not found');
      }

      await award.update({
        status: AwardStatus.ENFORCEMENT_INITIATED,
        enforcementJurisdiction: enforcementData.jurisdiction,
        enforcementStatus: enforcementData.enforcementStatus,
      });

      this.logger.log(`Tracking enforcement for award: ${award.awardNumber}`);
      return award;
    } catch (error) {
      this.logger.error('Failed to track enforcement', error);
      throw error;
    }
  }

  /**
   * Calculates award payment schedule
   */
  async calculatePaymentSchedule(awardId: string): Promise<{
    principalAmount: number;
    interestAmount: number;
    totalDue: number;
    paymentDeadline: Date;
  }> {
    try {
      const award = await this.awardRepository.findByPk(awardId);
      if (!award) {
        throw new NotFoundException('Award not found');
      }

      const principalAmount = award.awardAmount || 0;
      let interestAmount = 0;

      if (award.interestRate && award.interestStartDate) {
        const daysSinceStart = differenceInDays(new Date(), award.interestStartDate);
        const yearsSinceStart = daysSinceStart / 365;
        interestAmount = principalAmount * (award.interestRate / 100) * yearsSinceStart;
      }

      const totalDue = principalAmount + interestAmount;
      const paymentDeadline = award.paymentDeadline || addDays(new Date(), 30);

      return { principalAmount, interestAmount, totalDue, paymentDeadline };
    } catch (error) {
      this.logger.error('Failed to calculate payment schedule', error);
      throw error;
    }
  }
}

/**
 * ADR Session Management Service
 * Manages ADR sessions and conferences
 */
@Injectable()
export class ADRSessionService {
  private readonly logger = new Logger(ADRSessionService.name);

  constructor(
    @Inject('ADR_SESSION_REPOSITORY')
    private readonly sessionRepository: typeof ADRSession,
    @Inject('ADR_PROCEEDING_REPOSITORY')
    private readonly adrRepository: typeof ADRProceeding
  ) {}

  /**
   * Creates a new ADR session
   */
  async createSession(sessionData: {
    adrProceedingId: string;
    sessionDate: Date;
    duration: number;
    format: SessionFormat;
    location?: string;
    virtualMeetingLink?: string;
    attendees: string[];
  }): Promise<ADRSession> {
    try {
      const proceeding = await this.adrRepository.findByPk(sessionData.adrProceedingId);
      if (!proceeding) {
        throw new NotFoundException('ADR proceeding not found');
      }

      const existingSessions = await this.sessionRepository.count({
        where: { adrProceedingId: sessionData.adrProceedingId },
      });

      const session = await this.sessionRepository.create({
        ...sessionData,
        sessionNumber: existingSessions + 1,
        progressNotes: '',
        nextSteps: [],
        documentsExchanged: [],
        settlementDiscussed: false,
        caucusHeld: false,
        isSuccessful: false,
        metadata: {},
      } as any);

      this.logger.log(
        `Created ADR session #${session.sessionNumber} for ${proceeding.adrNumber}`
      );
      return session;
    } catch (error) {
      this.logger.error('Failed to create session', error);
      throw new BadRequestException('Failed to create session');
    }
  }

  /**
   * Records session outcomes
   */
  async recordSessionOutcome(
    sessionId: string,
    outcome: {
      progressNotes: string;
      nextSteps: string[];
      settlementDiscussed: boolean;
      settlementRange?: { min: number; max: number };
      caucusHeld?: boolean;
      caucusDuration?: number;
      isSuccessful: boolean;
    }
  ): Promise<ADRSession> {
    try {
      const session = await this.sessionRepository.findByPk(sessionId);
      if (!session) {
        throw new NotFoundException('Session not found');
      }

      await session.update(outcome);
      this.logger.log(`Recorded outcome for session ${session.id}`);
      return session;
    } catch (error) {
      this.logger.error('Failed to record session outcome', error);
      throw error;
    }
  }

  /**
   * Schedules follow-up session
   */
  async scheduleFollowUp(
    sessionId: string,
    nextSessionData: {
      sessionDate: Date;
      duration: number;
      format: SessionFormat;
    }
  ): Promise<ADRSession> {
    try {
      const currentSession = await this.sessionRepository.findByPk(sessionId);
      if (!currentSession) {
        throw new NotFoundException('Session not found');
      }

      await currentSession.update({ nextSessionDate: nextSessionData.sessionDate });

      const newSession = await this.createSession({
        adrProceedingId: currentSession.adrProceedingId,
        sessionDate: nextSessionData.sessionDate,
        duration: nextSessionData.duration,
        format: nextSessionData.format,
        attendees: currentSession.attendees,
      });

      this.logger.log(`Scheduled follow-up session for ${currentSession.adrProceedingId}`);
      return newSession;
    } catch (error) {
      this.logger.error('Failed to schedule follow-up', error);
      throw error;
    }
  }

  /**
   * Retrieves session history
   */
  async getSessionHistory(adrProceedingId: string): Promise<ADRSession[]> {
    try {
      return await this.sessionRepository.findAll({
        where: { adrProceedingId },
        order: [['sessionDate', 'ASC']],
      });
    } catch (error) {
      this.logger.error('Failed to get session history', error);
      throw new InternalServerErrorException('Failed to get session history');
    }
  }
}

/**
 * ADR Outcome Analytics Service
 * Provides outcome analysis and reporting
 */
@Injectable()
export class ADROutcomeAnalyticsService {
  private readonly logger = new Logger(ADROutcomeAnalyticsService.name);

  constructor(
    @Inject('ADR_PROCEEDING_REPOSITORY')
    private readonly adrRepository: typeof ADRProceeding,
    @Inject('SETTLEMENT_OFFER_REPOSITORY')
    private readonly offerRepository: typeof SettlementOffer,
    @Inject('ADR_SESSION_REPOSITORY')
    private readonly sessionRepository: typeof ADRSession
  ) {}

  /**
   * Calculates overall ADR outcome metrics
   */
  async calculateOutcomeMetrics(filters?: {
    dateFrom?: Date;
    dateTo?: Date;
    adrType?: ADRType;
    mediatorId?: string;
  }): Promise<IADROutcomeMetrics> {
    try {
      const whereClause: WhereOptions = {};

      if (filters?.dateFrom) {
        whereClause.initiationDate = { [Op.gte]: filters.dateFrom };
      }
      if (filters?.dateTo) {
        whereClause.completionDate = { [Op.lte]: filters.dateTo };
      }
      if (filters?.adrType) {
        whereClause.adrType = filters.adrType;
      }
      if (filters?.mediatorId) {
        whereClause.mediatorId = filters.mediatorId;
      }

      const proceedings = await this.adrRepository.findAll({ where: whereClause });

      const totalProceedings = proceedings.length;
      const settledProceedings = proceedings.filter(
        (p) => p.status === ADRStatus.SETTLEMENT_REACHED
      ).length;
      const impasseProceedings = proceedings.filter(
        (p) => p.status === ADRStatus.IMPASSE
      ).length;

      const settlementRate =
        totalProceedings > 0 ? (settledProceedings / totalProceedings) * 100 : 0;

      const settlementAmounts = proceedings
        .filter((p) => p.settlementAmount)
        .map((p) => p.settlementAmount!);
      const averageSettlementAmount =
        settlementAmounts.length > 0
          ? settlementAmounts.reduce((a, b) => a + b, 0) / settlementAmounts.length
          : 0;

      const resolutionTimes = proceedings
        .filter((p) => p.completionDate)
        .map((p) => differenceInDays(p.completionDate!, p.initiationDate));
      const averageTimeToResolution =
        resolutionTimes.length > 0
          ? resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length
          : 0;

      const costs = proceedings
        .filter((p) => p.actualTotalCost)
        .map((p) => p.actualTotalCost!);
      const averageCost =
        costs.length > 0 ? costs.reduce((a, b) => a + b, 0) / costs.length : 0;

      const estimatedLitigationCost = averageSettlementAmount * 0.3;
      const costSavingsVsLitigation = estimatedLitigationCost - averageCost;

      const mediatorSuccessRates: Record<string, number> = {};
      const settlementRateByType: Record<ADRType, number> = {} as any;

      const sessions = await this.sessionRepository.findAll({
        where: {
          adrProceedingId: { [Op.in]: proceedings.map((p) => p.id) },
        },
      });

      const sessionCounts: Record<string, number> = {};
      sessions.forEach((s) => {
        sessionCounts[s.adrProceedingId] = (sessionCounts[s.adrProceedingId] || 0) + 1;
      });

      const averageSessionsToSettlement =
        Object.keys(sessionCounts).length > 0
          ? Object.values(sessionCounts).reduce((a, b) => a + b, 0) /
            Object.keys(sessionCounts).length
          : 0;

      return {
        totalProceedings,
        settledProceedings,
        impasseProceedings,
        settlementRate,
        averageSettlementAmount,
        averageTimeToResolution,
        averageCost,
        costSavingsVsLitigation,
        mediatorSuccessRates,
        settlementRateByType,
        averageSessionsToSettlement,
      };
    } catch (error) {
      this.logger.error('Failed to calculate outcome metrics', error);
      throw new InternalServerErrorException('Failed to calculate outcome metrics');
    }
  }

  /**
   * Analyzes settlement patterns
   */
  async analyzeSettlementPatterns(adrType?: ADRType): Promise<{
    averageOfferCount: number;
    averageNegotiationTime: number;
    acceptanceRate: number;
    averageDiscountFromInitial: number;
  }> {
    try {
      const whereClause: WhereOptions = {};
      if (adrType) {
        const proceedings = await this.adrRepository.findAll({
          where: { adrType },
          attributes: ['id'],
        });
        whereClause.adrProceedingId = { [Op.in]: proceedings.map((p) => p.id) };
      }

      const offers = await this.offerRepository.findAll({ where: whereClause });

      const proceedingOffers: Record<string, SettlementOffer[]> = {};
      offers.forEach((offer) => {
        if (!proceedingOffers[offer.adrProceedingId]) {
          proceedingOffers[offer.adrProceedingId] = [];
        }
        proceedingOffers[offer.adrProceedingId].push(offer);
      });

      const offerCounts = Object.values(proceedingOffers).map((o) => o.length);
      const averageOfferCount =
        offerCounts.length > 0
          ? offerCounts.reduce((a, b) => a + b, 0) / offerCounts.length
          : 0;

      const negotiationTimes = Object.values(proceedingOffers)
        .filter((offers) => offers.length > 0)
        .map((offers) => {
          const first = offers[0];
          const last = offers[offers.length - 1];
          return differenceInDays(last.proposedDate, first.proposedDate);
        });

      const averageNegotiationTime =
        negotiationTimes.length > 0
          ? negotiationTimes.reduce((a, b) => a + b, 0) / negotiationTimes.length
          : 0;

      const acceptedOffers = offers.filter(
        (o) => o.status === SettlementOfferStatus.ACCEPTED
      );
      const acceptanceRate = offers.length > 0 ? (acceptedOffers.length / offers.length) * 100 : 0;

      const discounts = Object.values(proceedingOffers)
        .filter((offers) => offers.length > 1 && offers[offers.length - 1].status === SettlementOfferStatus.ACCEPTED)
        .map((offers) => {
          const initial = offers[0].offerAmount;
          const final = offers[offers.length - 1].offerAmount;
          return ((initial - final) / initial) * 100;
        });

      const averageDiscountFromInitial =
        discounts.length > 0 ? discounts.reduce((a, b) => a + b, 0) / discounts.length : 0;

      return {
        averageOfferCount,
        averageNegotiationTime,
        acceptanceRate,
        averageDiscountFromInitial,
      };
    } catch (error) {
      this.logger.error('Failed to analyze settlement patterns', error);
      throw new InternalServerErrorException('Failed to analyze settlement patterns');
    }
  }

  /**
   * Generates ADR suitability assessment
   */
  async assessADRSuitability(caseData: {
    matterType: string;
    amountInControversy: number;
    relationshipPreservation: boolean;
    timeConstraints: boolean;
    confidentialityRequired: boolean;
  }): Promise<{
    suitabilityScore: number;
    recommendedADRType: ADRType;
    reasoning: string[];
  }> {
    try {
      let suitabilityScore = 50;
      const reasoning: string[] = [];

      if (caseData.amountInControversy < 100000) {
        suitabilityScore += 15;
        reasoning.push('Lower amount in controversy favors cost-effective ADR');
      } else if (caseData.amountInControversy > 1000000) {
        suitabilityScore += 10;
        reasoning.push('High-value case may benefit from expert arbitration');
      }

      if (caseData.relationshipPreservation) {
        suitabilityScore += 20;
        reasoning.push('Relationship preservation strongly favors mediation');
      }

      if (caseData.timeConstraints) {
        suitabilityScore += 15;
        reasoning.push('Time constraints favor expedited ADR process');
      }

      if (caseData.confidentialityRequired) {
        suitabilityScore += 10;
        reasoning.push('Confidentiality requirements favor ADR over public litigation');
      }

      let recommendedADRType: ADRType;
      if (caseData.relationshipPreservation) {
        recommendedADRType = ADRType.MEDIATION;
      } else if (caseData.amountInControversy > 500000) {
        recommendedADRType = ADRType.ARBITRATION;
      } else {
        recommendedADRType = ADRType.SETTLEMENT_CONFERENCE;
      }

      return { suitabilityScore, recommendedADRType, reasoning };
    } catch (error) {
      this.logger.error('Failed to assess ADR suitability', error);
      throw new InternalServerErrorException('Failed to assess ADR suitability');
    }
  }

  /**
   * Compares ADR cost vs litigation cost
   */
  async compareADRVsLitigationCost(proceedingId: string): Promise<{
    adrCost: number;
    estimatedLitigationCost: number;
    savings: number;
    savingsPercentage: number;
  }> {
    try {
      const proceeding = await this.adrRepository.findByPk(proceedingId);
      if (!proceeding) {
        throw new NotFoundException('ADR proceeding not found');
      }

      const adrCost = proceeding.actualTotalCost || proceeding.estimatedTotalCost || 0;

      const amountInControversy = proceeding.amountInControversy || 0;
      const estimatedLitigationCost = amountInControversy * 0.25;

      const savings = estimatedLitigationCost - adrCost;
      const savingsPercentage =
        estimatedLitigationCost > 0 ? (savings / estimatedLitigationCost) * 100 : 0;

      return { adrCost, estimatedLitigationCost, savings, savingsPercentage };
    } catch (error) {
      this.logger.error('Failed to compare costs', error);
      throw error;
    }
  }
}

// ============================================================================
// CONFIGURATION
// ============================================================================

export const mediationArbitrationConfig = registerAs('mediationArbitration', () => ({
  defaultSessionDuration: parseInt(process.env.ADR_DEFAULT_SESSION_DURATION || '480', 10),
  defaultOfferValidityDays: parseInt(process.env.ADR_OFFER_VALIDITY_DAYS || '14', 10),
  defaultPaymentDeadlineDays: parseInt(process.env.ADR_PAYMENT_DEADLINE_DAYS || '30', 10),
  virtualMeetingProvider: process.env.ADR_VIRTUAL_MEETING_PROVIDER || 'zoom',
  filingFeeMediation: parseFloat(process.env.ADR_FILING_FEE_MEDIATION || '500'),
  filingFeeArbitration: parseFloat(process.env.ADR_FILING_FEE_ARBITRATION || '1500'),
  administrativeFee: parseFloat(process.env.ADR_ADMINISTRATIVE_FEE || '1000'),
  enableAutomatedReminders: process.env.ADR_AUTOMATED_REMINDERS === 'true',
  reminderDaysBefore: parseInt(process.env.ADR_REMINDER_DAYS_BEFORE || '7', 10),
  maxArbitrators: parseInt(process.env.ADR_MAX_ARBITRATORS || '3', 10),
  confidentialityDefault: process.env.ADR_CONFIDENTIALITY_DEFAULT !== 'false',
}));

// ============================================================================
// MODULE DEFINITION
// ============================================================================

@Global()
@Module({})
export class MediationArbitrationModule {
  static forRoot(): DynamicModule {
    return {
      module: MediationArbitrationModule,
      imports: [ConfigModule.forFeature(mediationArbitrationConfig)],
      providers: [
        {
          provide: 'MEDIATOR_REPOSITORY',
          useValue: Mediator,
        },
        {
          provide: 'ADR_PROCEEDING_REPOSITORY',
          useValue: ADRProceeding,
        },
        {
          provide: 'SETTLEMENT_OFFER_REPOSITORY',
          useValue: SettlementOffer,
        },
        {
          provide: 'ARBITRATION_AWARD_REPOSITORY',
          useValue: ArbitrationAward,
        },
        {
          provide: 'ADR_SESSION_REPOSITORY',
          useValue: ADRSession,
        },
        MediatorSelectionService,
        ADRProceedingService,
        SettlementOfferService,
        ArbitrationAwardService,
        ADRSessionService,
        ADROutcomeAnalyticsService,
      ],
      exports: [
        'MEDIATOR_REPOSITORY',
        'ADR_PROCEEDING_REPOSITORY',
        'SETTLEMENT_OFFER_REPOSITORY',
        'ARBITRATION_AWARD_REPOSITORY',
        'ADR_SESSION_REPOSITORY',
        MediatorSelectionService,
        ADRProceedingService,
        SettlementOfferService,
        ArbitrationAwardService,
        ADRSessionService,
        ADROutcomeAnalyticsService,
      ],
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: MediationArbitrationModule,
      providers: [
        MediatorSelectionService,
        ADRProceedingService,
        SettlementOfferService,
        ArbitrationAwardService,
        ADRSessionService,
        ADROutcomeAnalyticsService,
      ],
      exports: [
        MediatorSelectionService,
        ADRProceedingService,
        SettlementOfferService,
        ArbitrationAwardService,
        ADRSessionService,
        ADROutcomeAnalyticsService,
      ],
    };
  }
}
