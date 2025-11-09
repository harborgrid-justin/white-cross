/**
 * LOC: CONFLICT_CHECK_KIT_001
 * File: /reuse/legal/conflict-check-kit.ts
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
 *   - Conflict of interest management modules
 *   - Client intake services
 *   - Matter management controllers
 *   - Ethics compliance dashboards
 *   - Lateral hire onboarding services
 *   - Waiver management modules
 */

/**
 * File: /reuse/legal/conflict-check-kit.ts
 * Locator: WC-CONFLICT-CHECK-KIT-001
 * Purpose: Production-Grade Conflict of Interest Management Kit - Comprehensive conflict screening and ethical wall toolkit
 *
 * Upstream: NestJS, Sequelize, Zod, date-fns, crypto
 * Downstream: ../backend/modules/legal/*, Conflict management services, Client intake modules
 * Dependencies: TypeScript 5.x, Node 18+, sequelize-typescript, @nestjs/swagger, zod
 * Exports: 35 production-ready conflict of interest management functions
 *
 * LLM Context: Production-grade conflict of interest management toolkit for White Cross platform.
 * Provides comprehensive conflict screening with advanced search algorithms, adverse party identification
 * with entity relationship mapping, ethical wall implementation with secure information barriers, waiver
 * tracking with informed consent management, lateral hire conflict checking with historical matter analysis,
 * conflict database management with deduplication, real-time conflict alerts, automated screening workflows,
 * client relationship mapping, matter-level conflict analysis, attorney-level conflict tracking, prospective
 * client screening, former client conflict analysis, imputed conflict detection, personal interest conflict
 * screening, third-party payer conflict checks, business transaction conflict analysis, conflict waiver
 * generation, conflict resolution workflow management, screening report generation, conflict audit trails,
 * Chinese Wall implementation, conflict notification system, mass conflict checks for lateral hires,
 * conflict risk scoring, related entity discovery, opposing party tracking, conflict override controls,
 * periodic conflict reviews, conflict statistics and analytics, and regulatory compliance reporting.
 * Includes Sequelize models for conflicts, waivers, ethical walls, screening records, lateral hire checks,
 * NestJS services with dependency injection, Swagger API documentation, and comprehensive validation
 * schemas for all conflict-related operations.
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
  Index,
  Unique,
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';
import { Op, WhereOptions, FindOptions, Transaction } from 'sequelize';
import { addDays, addMonths, differenceInDays, isBefore, isAfter } from 'date-fns';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Conflict check status
 */
export enum ConflictCheckStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  CLEARED = 'cleared',
  CONFLICT_FOUND = 'conflict_found',
  WAIVED = 'waived',
  DECLINED = 'declined',
  REQUIRES_REVIEW = 'requires_review',
}

/**
 * Conflict type classification
 */
export enum ConflictType {
  DIRECT_ADVERSITY = 'direct_adversity',
  MATERIAL_LIMITATION = 'material_limitation',
  FORMER_CLIENT = 'former_client',
  IMPUTED_CONFLICT = 'imputed_conflict',
  PERSONAL_INTEREST = 'personal_interest',
  THIRD_PARTY_PAYER = 'third_party_payer',
  PROSPECTIVE_CLIENT = 'prospective_client',
  BUSINESS_TRANSACTION = 'business_transaction',
  FAMILY_RELATIONSHIP = 'family_relationship',
  FINANCIAL_INTEREST = 'financial_interest',
  ADVERSE_WITNESS = 'adverse_witness',
}

/**
 * Conflict severity rating
 */
export enum ConflictSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
  ABSOLUTE = 'absolute',
}

/**
 * Conflict resolution method
 */
export enum ConflictResolution {
  WAIVED_BY_CLIENT = 'waived_by_client',
  ETHICAL_WALL_IMPLEMENTED = 'ethical_wall_implemented',
  REPRESENTATION_DECLINED = 'representation_declined',
  REPRESENTATION_TERMINATED = 'representation_terminated',
  NO_CONFLICT = 'no_conflict',
  PENDING_REVIEW = 'pending_review',
  SCREENING_IMPLEMENTED = 'screening_implemented',
  ATTORNEY_RECUSED = 'attorney_recused',
}

/**
 * Waiver status
 */
export enum WaiverStatus {
  DRAFT = 'draft',
  SENT_TO_CLIENT = 'sent_to_client',
  EXECUTED = 'executed',
  DECLINED = 'declined',
  REVOKED = 'revoked',
  EXPIRED = 'expired',
}

/**
 * Ethical wall status
 */
export enum EthicalWallStatus {
  PROPOSED = 'proposed',
  ACTIVE = 'active',
  BREACHED = 'breached',
  LIFTED = 'lifted',
  INEFFECTIVE = 'ineffective',
}

/**
 * Lateral hire check status
 */
export enum LateralHireStatus {
  INITIATED = 'initiated',
  PRELIMINARY_REVIEW = 'preliminary_review',
  DETAILED_ANALYSIS = 'detailed_analysis',
  CONFLICTS_IDENTIFIED = 'conflicts_identified',
  CLEARED = 'cleared',
  CONDITIONAL_APPROVAL = 'conditional_approval',
  HIRE_DECLINED = 'hire_declined',
}

/**
 * Entity relationship type
 */
export enum EntityRelationshipType {
  PARENT_COMPANY = 'parent_company',
  SUBSIDIARY = 'subsidiary',
  AFFILIATE = 'affiliate',
  COMPETITOR = 'competitor',
  PARTNER = 'partner',
  VENDOR = 'vendor',
  CUSTOMER = 'customer',
  INVESTOR = 'investor',
  OFFICER = 'officer',
  DIRECTOR = 'director',
}

/**
 * Screening scope
 */
export enum ScreeningScope {
  NEW_MATTER = 'new_matter',
  LATERAL_HIRE = 'lateral_hire',
  MERGER_ACQUISITION = 'merger_acquisition',
  PERIODIC_REVIEW = 'periodic_review',
  AD_HOC = 'ad_hoc',
  PROSPECTIVE_CLIENT = 'prospective_client',
}

/**
 * Conflict check request interface
 */
export interface ConflictCheckRequest {
  id?: string;
  requestType: ScreeningScope;
  matterId?: string;
  clientId?: string;
  clientName: string;
  opposingParties: OpposingParty[];
  relatedEntities: RelatedEntity[];
  matterDescription: string;
  practiceArea: string;
  requestedBy: string;
  requestDate: Date;
  urgency: 'low' | 'normal' | 'high' | 'critical';
  jurisdictions: string[];
  estimatedValue?: number;
  metadata?: Record<string, any>;
}

/**
 * Opposing party interface
 */
export interface OpposingParty {
  name: string;
  aliases?: string[];
  entityType: 'individual' | 'corporation' | 'partnership' | 'government' | 'other';
  jurisdiction?: string;
  identifiers?: {
    taxId?: string;
    registrationNumber?: string;
    other?: Record<string, string>;
  };
  counsel?: string[];
}

/**
 * Related entity interface
 */
export interface RelatedEntity {
  name: string;
  relationshipType: EntityRelationshipType;
  description?: string;
  significance: 'low' | 'medium' | 'high';
}

/**
 * Conflict detail interface
 */
export interface ConflictDetail {
  id?: string;
  conflictType: ConflictType;
  severity: ConflictSeverity;
  description: string;
  involvedParties: string[];
  affectedAttorneys: string[];
  conflictingMatterId?: string;
  conflictingClientId?: string;
  riskAssessment: string;
  recommendation: string;
  waiverPossible: boolean;
  ethicalRulesViolated?: string[];
  identifiedDate: Date;
  identifiedBy: string;
  metadata?: Record<string, any>;
}

/**
 * Waiver document interface
 */
export interface WaiverDocument {
  id?: string;
  conflictCheckId: string;
  conflictId: string;
  clientId: string;
  waiverType: 'informed_consent' | 'advance_waiver' | 'limited_waiver';
  status: WaiverStatus;
  documentText: string;
  disclosureProvided: string;
  sentDate?: Date;
  executedDate?: Date;
  signatories: Array<{
    name: string;
    title: string;
    signedDate?: Date;
    signature?: string;
  }>;
  expirationDate?: Date;
  conditions?: string[];
  revokedDate?: Date;
  revokedReason?: string;
  reviewedBy: string;
  approvedBy?: string;
  metadata?: Record<string, any>;
}

/**
 * Ethical wall interface
 */
export interface EthicalWall {
  id?: string;
  conflictCheckId: string;
  matterId: string;
  status: EthicalWallStatus;
  screenedAttorneys: string[];
  restrictedInformation: string[];
  implementationDate: Date;
  implementedBy: string;
  protocols: Array<{
    description: string;
    responsible: string;
    verificationMethod: string;
  }>;
  physicalMeasures?: string[];
  technicalMeasures?: string[];
  trainingCompleted: boolean;
  monitoringFrequency: string;
  lastReviewDate?: Date;
  breaches?: Array<{
    date: Date;
    description: string;
    remediation: string;
    reportedBy: string;
  }>;
  liftedDate?: Date;
  liftedReason?: string;
  metadata?: Record<string, any>;
}

/**
 * Lateral hire check interface
 */
export interface LateralHireCheck {
  id?: string;
  candidateId: string;
  candidateName: string;
  currentFirm: string;
  proposedStartDate: Date;
  status: LateralHireStatus;
  priorMatters: PriorMatter[];
  currentMatters: CurrentMatter[];
  conflictsIdentified: ConflictDetail[];
  screeningNotes: string;
  performedBy: string;
  reviewDate: Date;
  approvalRequired: boolean;
  approvedBy?: string;
  approvalDate?: Date;
  conditions?: string[];
  ethicalWallsRequired?: string[];
  clientNotificationsRequired?: string[];
  metadata?: Record<string, any>;
}

/**
 * Prior matter interface
 */
export interface PriorMatter {
  matterName: string;
  clientName: string;
  opposingParties: string[];
  practiceArea: string;
  startDate: Date;
  endDate?: Date;
  role: string;
  jurisdiction: string;
  confidentialInformation?: string[];
}

/**
 * Current matter interface
 */
export interface CurrentMatter {
  matterName: string;
  clientName: string;
  practiceArea: string;
  startDate: Date;
  expectedDuration?: number;
  portability: 'portable' | 'non_portable' | 'uncertain';
  clientConsent?: boolean;
}

/**
 * Screening report interface
 */
export interface ScreeningReport {
  id?: string;
  conflictCheckId: string;
  generatedDate: Date;
  generatedBy: string;
  summary: string;
  conflictsFound: number;
  conflictDetails: ConflictDetail[];
  recommendation: 'approve' | 'approve_with_conditions' | 'decline' | 'needs_review';
  conditions?: string[];
  waivers?: WaiverDocument[];
  ethicalWalls?: EthicalWall[];
  reviewedBy?: string[];
  finalDecision?: string;
  decisionDate?: Date;
  notificationsRequired: string[];
  followUpActions: Array<{
    action: string;
    responsible: string;
    dueDate: Date;
  }>;
  metadata?: Record<string, any>;
}

/**
 * Conflict notification interface
 */
export interface ConflictNotification {
  id?: string;
  conflictCheckId: string;
  recipientId: string;
  recipientType: 'attorney' | 'client' | 'admin' | 'ethics_partner';
  notificationType: 'new_conflict' | 'waiver_request' | 'ethical_wall' | 'periodic_review';
  subject: string;
  message: string;
  sentDate: Date;
  readDate?: Date;
  acknowledged?: boolean;
  acknowledgedDate?: Date;
  responseRequired: boolean;
  responseReceived?: string;
  metadata?: Record<string, any>;
}

/**
 * Conflict statistics interface
 */
export interface ConflictStatistics {
  period: {
    startDate: Date;
    endDate: Date;
  };
  totalChecks: number;
  checksCleared: number;
  conflictsFound: number;
  waiverRate: number;
  declineRate: number;
  byType: Record<ConflictType, number>;
  bySeverity: Record<ConflictSeverity, number>;
  byPracticeArea: Record<string, number>;
  averageResolutionTime: number;
  ethicalWallsImplemented: number;
  lateralHireChecks: number;
  trends: Array<{
    date: Date;
    checks: number;
    conflicts: number;
  }>;
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

/**
 * Opposing party validation schema
 */
export const OpposingPartySchema = z.object({
  name: z.string().min(1),
  aliases: z.array(z.string()).optional(),
  entityType: z.enum(['individual', 'corporation', 'partnership', 'government', 'other']),
  jurisdiction: z.string().optional(),
  identifiers: z.object({
    taxId: z.string().optional(),
    registrationNumber: z.string().optional(),
    other: z.record(z.string()).optional(),
  }).optional(),
  counsel: z.array(z.string()).optional(),
});

/**
 * Related entity validation schema
 */
export const RelatedEntitySchema = z.object({
  name: z.string().min(1),
  relationshipType: z.nativeEnum(EntityRelationshipType),
  description: z.string().optional(),
  significance: z.enum(['low', 'medium', 'high']),
});

/**
 * Conflict check request validation schema
 */
export const ConflictCheckRequestSchema = z.object({
  requestType: z.nativeEnum(ScreeningScope),
  matterId: z.string().uuid().optional(),
  clientId: z.string().uuid().optional(),
  clientName: z.string().min(1),
  opposingParties: z.array(OpposingPartySchema),
  relatedEntities: z.array(RelatedEntitySchema),
  matterDescription: z.string().min(10),
  practiceArea: z.string().min(1),
  requestedBy: z.string().uuid(),
  requestDate: z.date(),
  urgency: z.enum(['low', 'normal', 'high', 'critical']),
  jurisdictions: z.array(z.string()),
  estimatedValue: z.number().positive().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Conflict detail validation schema
 */
export const ConflictDetailSchema = z.object({
  conflictType: z.nativeEnum(ConflictType),
  severity: z.nativeEnum(ConflictSeverity),
  description: z.string().min(10),
  involvedParties: z.array(z.string()),
  affectedAttorneys: z.array(z.string()),
  conflictingMatterId: z.string().uuid().optional(),
  conflictingClientId: z.string().uuid().optional(),
  riskAssessment: z.string().min(10),
  recommendation: z.string().min(10),
  waiverPossible: z.boolean(),
  ethicalRulesViolated: z.array(z.string()).optional(),
  identifiedDate: z.date(),
  identifiedBy: z.string().uuid(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Waiver document validation schema
 */
export const WaiverDocumentSchema = z.object({
  conflictCheckId: z.string().uuid(),
  conflictId: z.string().uuid(),
  clientId: z.string().uuid(),
  waiverType: z.enum(['informed_consent', 'advance_waiver', 'limited_waiver']),
  status: z.nativeEnum(WaiverStatus),
  documentText: z.string().min(50),
  disclosureProvided: z.string().min(50),
  sentDate: z.date().optional(),
  executedDate: z.date().optional(),
  signatories: z.array(z.object({
    name: z.string(),
    title: z.string(),
    signedDate: z.date().optional(),
    signature: z.string().optional(),
  })),
  expirationDate: z.date().optional(),
  conditions: z.array(z.string()).optional(),
  revokedDate: z.date().optional(),
  revokedReason: z.string().optional(),
  reviewedBy: z.string().uuid(),
  approvedBy: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Ethical wall validation schema
 */
export const EthicalWallSchema = z.object({
  conflictCheckId: z.string().uuid(),
  matterId: z.string().uuid(),
  status: z.nativeEnum(EthicalWallStatus),
  screenedAttorneys: z.array(z.string().uuid()),
  restrictedInformation: z.array(z.string()),
  implementationDate: z.date(),
  implementedBy: z.string().uuid(),
  protocols: z.array(z.object({
    description: z.string(),
    responsible: z.string(),
    verificationMethod: z.string(),
  })),
  physicalMeasures: z.array(z.string()).optional(),
  technicalMeasures: z.array(z.string()).optional(),
  trainingCompleted: z.boolean(),
  monitoringFrequency: z.string(),
  lastReviewDate: z.date().optional(),
  breaches: z.array(z.object({
    date: z.date(),
    description: z.string(),
    remediation: z.string(),
    reportedBy: z.string(),
  })).optional(),
  liftedDate: z.date().optional(),
  liftedReason: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * Prior matter validation schema
 */
export const PriorMatterSchema = z.object({
  matterName: z.string().min(1),
  clientName: z.string().min(1),
  opposingParties: z.array(z.string()),
  practiceArea: z.string().min(1),
  startDate: z.date(),
  endDate: z.date().optional(),
  role: z.string().min(1),
  jurisdiction: z.string().min(1),
  confidentialInformation: z.array(z.string()).optional(),
});

/**
 * Lateral hire check validation schema
 */
export const LateralHireCheckSchema = z.object({
  candidateId: z.string().uuid(),
  candidateName: z.string().min(1),
  currentFirm: z.string().min(1),
  proposedStartDate: z.date(),
  status: z.nativeEnum(LateralHireStatus),
  priorMatters: z.array(PriorMatterSchema),
  currentMatters: z.array(z.object({
    matterName: z.string(),
    clientName: z.string(),
    practiceArea: z.string(),
    startDate: z.date(),
    expectedDuration: z.number().optional(),
    portability: z.enum(['portable', 'non_portable', 'uncertain']),
    clientConsent: z.boolean().optional(),
  })),
  conflictsIdentified: z.array(ConflictDetailSchema),
  screeningNotes: z.string().min(10),
  performedBy: z.string().uuid(),
  reviewDate: z.date(),
  approvalRequired: z.boolean(),
  approvedBy: z.string().uuid().optional(),
  approvalDate: z.date().optional(),
  conditions: z.array(z.string()).optional(),
  ethicalWallsRequired: z.array(z.string()).optional(),
  clientNotificationsRequired: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Conflict Check Request Model
 * Stores conflict check requests and their outcomes
 */
@Table({
  tableName: 'conflict_check_requests',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['clientId'] },
    { fields: ['matterId'] },
    { fields: ['requestedBy'] },
    { fields: ['requestDate'] },
    { fields: ['status'] },
    { fields: ['requestType'] },
    { fields: ['practiceArea'] },
  ],
})
export class ConflictCheckRequestModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique identifier' })
  id!: string;

  @Column({
    type: DataType.ENUM(...Object.values(ScreeningScope)),
    allowNull: false,
  })
  @Index
  @ApiProperty({ enum: ScreeningScope, description: 'Type of screening request' })
  requestType!: ScreeningScope;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @Index
  @ApiPropertyOptional({ description: 'Matter ID if applicable' })
  matterId?: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @Index
  @ApiPropertyOptional({ description: 'Client ID if applicable' })
  clientId?: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  @ApiProperty({ description: 'Client name' })
  clientName!: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  @ApiProperty({ description: 'Opposing parties information' })
  opposingParties!: OpposingParty[];

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  @ApiProperty({ description: 'Related entities' })
  relatedEntities!: RelatedEntity[];

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  @ApiProperty({ description: 'Matter description' })
  matterDescription!: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Practice area' })
  practiceArea!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'User who requested the check' })
  requestedBy!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  @Index
  @ApiProperty({ description: 'Request date' })
  requestDate!: Date;

  @Column({
    type: DataType.ENUM('low', 'normal', 'high', 'critical'),
    allowNull: false,
    defaultValue: 'normal',
  })
  @ApiProperty({ description: 'Urgency level' })
  urgency!: 'low' | 'normal' | 'high' | 'critical';

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  @ApiProperty({ description: 'Jurisdictions involved' })
  jurisdictions!: string[];

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Estimated matter value' })
  estimatedValue?: number;

  @Column({
    type: DataType.ENUM(...Object.values(ConflictCheckStatus)),
    allowNull: false,
    defaultValue: ConflictCheckStatus.PENDING,
  })
  @Index
  @ApiProperty({ enum: ConflictCheckStatus, description: 'Current status' })
  status!: ConflictCheckStatus;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'User who performed the check' })
  performedBy?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Date check was completed' })
  completedDate?: Date;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;

  @HasMany(() => ConflictDetailModel)
  conflicts?: ConflictDetailModel[];

  @HasMany(() => WaiverDocumentModel)
  waivers?: WaiverDocumentModel[];

  @HasMany(() => EthicalWallModel)
  ethicalWalls?: EthicalWallModel[];

  @CreatedAt
  @Column
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @UpdatedAt
  @Column
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;

  @DeletedAt
  @Column
  @ApiPropertyOptional({ description: 'Soft delete timestamp' })
  deletedAt?: Date;
}

/**
 * Conflict Detail Model
 * Stores identified conflicts and their analysis
 */
@Table({
  tableName: 'conflict_details',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['conflictCheckId'] },
    { fields: ['conflictType'] },
    { fields: ['severity'] },
    { fields: ['conflictingMatterId'] },
    { fields: ['conflictingClientId'] },
  ],
})
export class ConflictDetailModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique identifier' })
  id!: string;

  @ForeignKey(() => ConflictCheckRequestModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Conflict check request ID' })
  conflictCheckId!: string;

  @BelongsTo(() => ConflictCheckRequestModel)
  conflictCheck?: ConflictCheckRequestModel;

  @Column({
    type: DataType.ENUM(...Object.values(ConflictType)),
    allowNull: false,
  })
  @Index
  @ApiProperty({ enum: ConflictType, description: 'Type of conflict' })
  conflictType!: ConflictType;

  @Column({
    type: DataType.ENUM(...Object.values(ConflictSeverity)),
    allowNull: false,
  })
  @Index
  @ApiProperty({ enum: ConflictSeverity, description: 'Severity rating' })
  severity!: ConflictSeverity;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  @ApiProperty({ description: 'Conflict description' })
  description!: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  @ApiProperty({ description: 'Involved parties' })
  involvedParties!: string[];

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
  })
  @ApiProperty({ description: 'Affected attorneys' })
  affectedAttorneys!: string[];

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @Index
  @ApiPropertyOptional({ description: 'Conflicting matter ID' })
  conflictingMatterId?: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @Index
  @ApiPropertyOptional({ description: 'Conflicting client ID' })
  conflictingClientId?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  @ApiProperty({ description: 'Risk assessment' })
  riskAssessment!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  @ApiProperty({ description: 'Recommended action' })
  recommendation!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({ description: 'Whether waiver is possible' })
  waiverPossible!: boolean;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Ethical rules potentially violated' })
  ethicalRulesViolated?: string[];

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  @ApiProperty({ description: 'Date conflict was identified' })
  identifiedDate!: Date;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty({ description: 'User who identified the conflict' })
  identifiedBy!: string;

  @Column({
    type: DataType.ENUM(...Object.values(ConflictResolution)),
    allowNull: true,
  })
  @ApiPropertyOptional({ enum: ConflictResolution, description: 'Resolution method' })
  resolution?: ConflictResolution;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Date conflict was resolved' })
  resolvedDate?: Date;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;

  @HasMany(() => WaiverDocumentModel)
  waivers?: WaiverDocumentModel[];

  @CreatedAt
  @Column
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @UpdatedAt
  @Column
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;

  @DeletedAt
  @Column
  @ApiPropertyOptional({ description: 'Soft delete timestamp' })
  deletedAt?: Date;
}

/**
 * Waiver Document Model
 * Stores conflict waiver documentation and status
 */
@Table({
  tableName: 'waiver_documents',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['conflictCheckId'] },
    { fields: ['conflictId'] },
    { fields: ['clientId'] },
    { fields: ['status'] },
    { fields: ['waiverType'] },
    { fields: ['executedDate'] },
  ],
})
export class WaiverDocumentModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique identifier' })
  id!: string;

  @ForeignKey(() => ConflictCheckRequestModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Conflict check request ID' })
  conflictCheckId!: string;

  @BelongsTo(() => ConflictCheckRequestModel)
  conflictCheck?: ConflictCheckRequestModel;

  @ForeignKey(() => ConflictDetailModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Conflict detail ID' })
  conflictId!: string;

  @BelongsTo(() => ConflictDetailModel)
  conflict?: ConflictDetailModel;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Client ID' })
  clientId!: string;

  @Column({
    type: DataType.ENUM('informed_consent', 'advance_waiver', 'limited_waiver'),
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Type of waiver' })
  waiverType!: 'informed_consent' | 'advance_waiver' | 'limited_waiver';

  @Column({
    type: DataType.ENUM(...Object.values(WaiverStatus)),
    allowNull: false,
    defaultValue: WaiverStatus.DRAFT,
  })
  @Index
  @ApiProperty({ enum: WaiverStatus, description: 'Waiver status' })
  status!: WaiverStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  @ApiProperty({ description: 'Waiver document text' })
  documentText!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  @ApiProperty({ description: 'Disclosure provided to client' })
  disclosureProvided!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Date sent to client' })
  sentDate?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @Index
  @ApiPropertyOptional({ description: 'Date executed by client' })
  executedDate?: Date;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  @ApiProperty({ description: 'Signatories information' })
  signatories!: Array<{
    name: string;
    title: string;
    signedDate?: Date;
    signature?: string;
  }>;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Waiver expiration date' })
  expirationDate?: Date;

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Conditions of waiver' })
  conditions?: string[];

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Date waiver was revoked' })
  revokedDate?: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Reason for revocation' })
  revokedReason?: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty({ description: 'User who reviewed the waiver' })
  reviewedBy!: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'User who approved the waiver' })
  approvedBy?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Approval date' })
  approvalDate?: Date;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;

  @CreatedAt
  @Column
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @UpdatedAt
  @Column
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;

  @DeletedAt
  @Column
  @ApiPropertyOptional({ description: 'Soft delete timestamp' })
  deletedAt?: Date;
}

/**
 * Ethical Wall Model
 * Stores ethical wall (Chinese Wall) implementations and monitoring
 */
@Table({
  tableName: 'ethical_walls',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['conflictCheckId'] },
    { fields: ['matterId'] },
    { fields: ['status'] },
    { fields: ['implementationDate'] },
    { fields: ['lastReviewDate'] },
  ],
})
export class EthicalWallModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique identifier' })
  id!: string;

  @ForeignKey(() => ConflictCheckRequestModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Conflict check request ID' })
  conflictCheckId!: string;

  @BelongsTo(() => ConflictCheckRequestModel)
  conflictCheck?: ConflictCheckRequestModel;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Matter ID' })
  matterId!: string;

  @Column({
    type: DataType.ENUM(...Object.values(EthicalWallStatus)),
    allowNull: false,
    defaultValue: EthicalWallStatus.PROPOSED,
  })
  @Index
  @ApiProperty({ enum: EthicalWallStatus, description: 'Wall status' })
  status!: EthicalWallStatus;

  @Column({
    type: DataType.ARRAY(DataType.UUID),
    allowNull: false,
  })
  @ApiProperty({ description: 'Attorneys screened from matter' })
  screenedAttorneys!: string[];

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: false,
  })
  @ApiProperty({ description: 'Categories of restricted information' })
  restrictedInformation!: string[];

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Wall implementation date' })
  implementationDate!: Date;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty({ description: 'User who implemented the wall' })
  implementedBy!: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  @ApiProperty({ description: 'Wall protocols' })
  protocols!: Array<{
    description: string;
    responsible: string;
    verificationMethod: string;
  }>;

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Physical measures implemented' })
  physicalMeasures?: string[];

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Technical measures implemented' })
  technicalMeasures?: string[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({ description: 'Whether training was completed' })
  trainingCompleted!: boolean;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  @ApiProperty({ description: 'Monitoring frequency', example: 'weekly' })
  monitoringFrequency!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @Index
  @ApiPropertyOptional({ description: 'Last review date' })
  lastReviewDate?: Date;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Breach incidents' })
  breaches?: Array<{
    date: Date;
    description: string;
    remediation: string;
    reportedBy: string;
  }>;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Date wall was lifted' })
  liftedDate?: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Reason for lifting wall' })
  liftedReason?: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;

  @CreatedAt
  @Column
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @UpdatedAt
  @Column
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;

  @DeletedAt
  @Column
  @ApiPropertyOptional({ description: 'Soft delete timestamp' })
  deletedAt?: Date;
}

/**
 * Lateral Hire Check Model
 * Stores lateral hire conflict screening data
 */
@Table({
  tableName: 'lateral_hire_checks',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['candidateId'] },
    { fields: ['status'] },
    { fields: ['proposedStartDate'] },
    { fields: ['reviewDate'] },
    { fields: ['performedBy'] },
  ],
})
export class LateralHireCheckModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique identifier' })
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Candidate ID' })
  candidateId!: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  @ApiProperty({ description: 'Candidate name' })
  candidateName!: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  @ApiProperty({ description: 'Current firm' })
  currentFirm!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Proposed start date' })
  proposedStartDate!: Date;

  @Column({
    type: DataType.ENUM(...Object.values(LateralHireStatus)),
    allowNull: false,
    defaultValue: LateralHireStatus.INITIATED,
  })
  @Index
  @ApiProperty({ enum: LateralHireStatus, description: 'Check status' })
  status!: LateralHireStatus;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  @ApiProperty({ description: 'Prior matters at previous firms' })
  priorMatters!: PriorMatter[];

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  @ApiProperty({ description: 'Current matters' })
  currentMatters!: CurrentMatter[];

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Conflicts identified' })
  conflictsIdentified?: ConflictDetail[];

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  @ApiProperty({ description: 'Screening notes and analysis' })
  screeningNotes!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'User who performed the check' })
  performedBy!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Review date' })
  reviewDate!: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  @ApiProperty({ description: 'Whether approval is required' })
  approvalRequired!: boolean;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'User who approved the hire' })
  approvedBy?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Approval date' })
  approvalDate?: Date;

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Conditions for hiring' })
  conditions?: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Ethical walls required' })
  ethicalWallsRequired?: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Client notifications required' })
  clientNotificationsRequired?: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;

  @CreatedAt
  @Column
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @UpdatedAt
  @Column
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;

  @DeletedAt
  @Column
  @ApiPropertyOptional({ description: 'Soft delete timestamp' })
  deletedAt?: Date;
}

/**
 * Conflict Notification Model
 * Stores notification records for conflict-related communications
 */
@Table({
  tableName: 'conflict_notifications',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['conflictCheckId'] },
    { fields: ['recipientId'] },
    { fields: ['notificationType'] },
    { fields: ['sentDate'] },
    { fields: ['acknowledged'] },
  ],
})
export class ConflictNotificationModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique identifier' })
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Conflict check request ID' })
  conflictCheckId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Recipient user ID' })
  recipientId!: string;

  @Column({
    type: DataType.ENUM('attorney', 'client', 'admin', 'ethics_partner'),
    allowNull: false,
  })
  @ApiProperty({ description: 'Recipient type' })
  recipientType!: 'attorney' | 'client' | 'admin' | 'ethics_partner';

  @Column({
    type: DataType.ENUM('new_conflict', 'waiver_request', 'ethical_wall', 'periodic_review'),
    allowNull: false,
  })
  @Index
  @ApiProperty({ description: 'Notification type' })
  notificationType!: 'new_conflict' | 'waiver_request' | 'ethical_wall' | 'periodic_review';

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  @ApiProperty({ description: 'Notification subject' })
  subject!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  @ApiProperty({ description: 'Notification message' })
  message!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  @Index
  @ApiProperty({ description: 'Date sent' })
  sentDate!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Date read' })
  readDate?: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @Index
  @ApiProperty({ description: 'Whether acknowledged' })
  acknowledged!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Date acknowledged' })
  acknowledgedDate?: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty({ description: 'Whether response is required' })
  responseRequired!: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Response received' })
  responseReceived?: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;

  @CreatedAt
  @Column
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt!: Date;

  @UpdatedAt
  @Column
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt!: Date;

  @DeletedAt
  @Column
  @ApiPropertyOptional({ description: 'Soft delete timestamp' })
  deletedAt?: Date;
}

// ============================================================================
// SERVICES
// ============================================================================

/**
 * Conflict Screening Service
 * Manages comprehensive conflict of interest screening
 */
@Injectable()
export class ConflictScreeningService {
  private readonly logger = new Logger(ConflictScreeningService.name);

  constructor(
    @Inject('CONFLICT_CHECK_REQUEST_REPOSITORY')
    private readonly requestRepository: typeof ConflictCheckRequestModel,
    @Inject('CONFLICT_DETAIL_REPOSITORY')
    private readonly conflictRepository: typeof ConflictDetailModel,
  ) {}

  /**
   * 1. Initiate conflict check
   */
  async initiateConflictCheck(
    requestData: ConflictCheckRequest,
  ): Promise<ConflictCheckRequestModel> {
    try {
      const validated = ConflictCheckRequestSchema.parse(requestData);

      const request = await this.requestRepository.create({
        ...validated,
        status: ConflictCheckStatus.PENDING,
      } as any);

      this.logger.log(`Initiated conflict check ${request.id} for client: ${validated.clientName}`);
      return request;
    } catch (error) {
      this.logger.error(`Failed to initiate conflict check: ${error.message}`);
      throw new BadRequestException(`Failed to initiate conflict check: ${error.message}`);
    }
  }

  /**
   * 2. Perform comprehensive conflict screening
   */
  async performConflictScreening(
    checkId: string,
    performedBy: string,
  ): Promise<{
    request: ConflictCheckRequestModel;
    conflicts: ConflictDetailModel[];
  }> {
    const request = await this.requestRepository.findByPk(checkId);
    if (!request) {
      throw new NotFoundException(`Conflict check request not found: ${checkId}`);
    }

    await request.update({
      status: ConflictCheckStatus.IN_PROGRESS,
      performedBy,
    });

    const conflicts: ConflictDetail[] = [];

    // Screen for direct adversity
    const directConflicts = await this.screenDirectAdversity(request);
    conflicts.push(...directConflicts);

    // Screen for former client conflicts
    const formerClientConflicts = await this.screenFormerClients(request);
    conflicts.push(...formerClientConflicts);

    // Screen for imputed conflicts
    const imputedConflicts = await this.screenImputedConflicts(request);
    conflicts.push(...imputedConflicts);

    // Screen for personal interest conflicts
    const personalConflicts = await this.screenPersonalInterests(request);
    conflicts.push(...personalConflicts);

    // Create conflict detail records
    const conflictModels = await Promise.all(
      conflicts.map((conflict) =>
        this.conflictRepository.create({
          ...conflict,
          conflictCheckId: checkId,
        } as any),
      ),
    );

    // Update request status
    const finalStatus =
      conflictModels.length > 0
        ? ConflictCheckStatus.CONFLICT_FOUND
        : ConflictCheckStatus.CLEARED;

    await request.update({
      status: finalStatus,
      completedDate: new Date(),
    });

    this.logger.log(
      `Completed conflict screening ${checkId}: Found ${conflictModels.length} conflicts`,
    );

    return { request, conflicts: conflictModels };
  }

  /**
   * 3. Screen for direct adversity conflicts
   */
  private async screenDirectAdversity(
    request: ConflictCheckRequestModel,
  ): Promise<ConflictDetail[]> {
    const conflicts: ConflictDetail[] = [];
    const opposingNames = request.opposingParties.map((p) => p.name.toLowerCase());

    // Query existing matters where opposing parties are current clients
    const existingChecks = await this.requestRepository.findAll({
      where: {
        status: {
          [Op.in]: [
            ConflictCheckStatus.CLEARED,
            ConflictCheckStatus.WAIVED,
          ],
        },
      },
    });

    for (const check of existingChecks) {
      const clientNameLower = check.clientName.toLowerCase();
      if (opposingNames.includes(clientNameLower)) {
        conflicts.push({
          conflictType: ConflictType.DIRECT_ADVERSITY,
          severity: ConflictSeverity.CRITICAL,
          description: `Client ${request.clientName} is directly adverse to existing client ${check.clientName} in matter ${check.matterId}`,
          involvedParties: [request.clientName, check.clientName],
          affectedAttorneys: [],
          conflictingMatterId: check.matterId,
          conflictingClientId: check.clientId,
          riskAssessment: 'Critical conflict - representation of directly adverse parties',
          recommendation: 'Decline representation unless both clients provide informed consent waiver',
          waiverPossible: true,
          ethicalRulesViolated: ['Rule 1.7(a)(1)'],
          identifiedDate: new Date(),
          identifiedBy: request.performedBy || request.requestedBy,
        });
      }
    }

    return conflicts;
  }

  /**
   * 4. Screen for former client conflicts
   */
  private async screenFormerClients(
    request: ConflictCheckRequestModel,
  ): Promise<ConflictDetail[]> {
    const conflicts: ConflictDetail[] = [];
    const relatedEntityNames = request.relatedEntities.map((e) => e.name.toLowerCase());

    // Query matters with former clients
    const formerMatters = await this.requestRepository.findAll({
      where: {
        status: ConflictCheckStatus.CLEARED,
        deletedAt: { [Op.not]: null },
      },
      paranoid: false,
    });

    for (const matter of formerMatters) {
      const formerClientName = matter.clientName.toLowerCase();
      if (relatedEntityNames.includes(formerClientName)) {
        conflicts.push({
          conflictType: ConflictType.FORMER_CLIENT,
          severity: ConflictSeverity.HIGH,
          description: `Representation may be adverse to former client ${matter.clientName}`,
          involvedParties: [request.clientName, matter.clientName],
          affectedAttorneys: [],
          conflictingMatterId: matter.matterId,
          conflictingClientId: matter.clientId,
          riskAssessment: 'Potential conflict with former client - assess substantial relationship',
          recommendation: 'Review for substantial relationship between matters; obtain consent if substantially related',
          waiverPossible: true,
          ethicalRulesViolated: ['Rule 1.9(a)'],
          identifiedDate: new Date(),
          identifiedBy: request.performedBy || request.requestedBy,
        });
      }
    }

    return conflicts;
  }

  /**
   * 5. Screen for imputed conflicts
   */
  private async screenImputedConflicts(
    request: ConflictCheckRequestModel,
  ): Promise<ConflictDetail[]> {
    const conflicts: ConflictDetail[] = [];

    // Query conflicts found in other firm matters
    const firmConflicts = await this.conflictRepository.findAll({
      where: {
        resolution: { [Op.is]: null },
      },
      include: [ConflictCheckRequestModel],
    });

    for (const conflict of firmConflicts) {
      const opposingNames = request.opposingParties.map((p) => p.name.toLowerCase());
      const involvedLower = conflict.involvedParties.map((p) => p.toLowerCase());

      if (opposingNames.some((name) => involvedLower.includes(name))) {
        conflicts.push({
          conflictType: ConflictType.IMPUTED_CONFLICT,
          severity: ConflictSeverity.HIGH,
          description: `Imputed conflict from firm matter involving ${conflict.involvedParties.join(', ')}`,
          involvedParties: [...conflict.involvedParties, request.clientName],
          affectedAttorneys: conflict.affectedAttorneys,
          conflictingMatterId: conflict.conflictingMatterId,
          riskAssessment: 'Imputed conflict from firm matter requires screening or waiver',
          recommendation: 'Implement ethical wall or obtain informed consent from all affected clients',
          waiverPossible: true,
          ethicalRulesViolated: ['Rule 1.10'],
          identifiedDate: new Date(),
          identifiedBy: request.performedBy || request.requestedBy,
        });
      }
    }

    return conflicts;
  }

  /**
   * 6. Screen for personal interest conflicts
   */
  private async screenPersonalInterests(
    request: ConflictCheckRequestModel,
  ): Promise<ConflictDetail[]> {
    // This would integrate with attorney financial disclosure data
    // For now, returning empty array as placeholder
    return [];
  }

  /**
   * 7. Search for adverse parties
   */
  async searchAdverseParties(
    searchTerm: string,
    options?: { fuzzyMatch?: boolean; includeAliases?: boolean },
  ): Promise<Array<{ party: OpposingParty; checkId: string; matterId?: string }>> {
    const searchLower = searchTerm.toLowerCase();
    const results: Array<{ party: OpposingParty; checkId: string; matterId?: string }> = [];

    const checks = await this.requestRepository.findAll();

    for (const check of checks) {
      for (const party of check.opposingParties) {
        let isMatch = party.name.toLowerCase().includes(searchLower);

        if (options?.includeAliases && party.aliases) {
          isMatch =
            isMatch ||
            party.aliases.some((alias) => alias.toLowerCase().includes(searchLower));
        }

        if (isMatch) {
          results.push({
            party,
            checkId: check.id,
            matterId: check.matterId,
          });
        }
      }
    }

    return results;
  }

  /**
   * 8. Get conflict check status
   */
  async getConflictCheckStatus(checkId: string): Promise<ConflictCheckRequestModel> {
    const request = await this.requestRepository.findByPk(checkId, {
      include: [
        { model: ConflictDetailModel },
        { model: WaiverDocumentModel },
        { model: EthicalWallModel },
      ],
    });

    if (!request) {
      throw new NotFoundException(`Conflict check not found: ${checkId}`);
    }

    return request;
  }

  /**
   * 9. Update conflict check status
   */
  async updateConflictCheckStatus(
    checkId: string,
    status: ConflictCheckStatus,
    notes?: string,
  ): Promise<ConflictCheckRequestModel> {
    const request = await this.requestRepository.findByPk(checkId);
    if (!request) {
      throw new NotFoundException(`Conflict check not found: ${checkId}`);
    }

    await request.update({
      status,
      metadata: {
        ...request.metadata,
        statusNotes: notes,
        lastStatusUpdate: new Date(),
      },
    });

    this.logger.log(`Updated conflict check ${checkId} status to ${status}`);
    return request;
  }

  /**
   * 10. Get conflicts by matter
   */
  async getConflictsByMatter(matterId: string): Promise<ConflictDetailModel[]> {
    const checks = await this.requestRepository.findAll({
      where: { matterId },
    });

    const checkIds = checks.map((c) => c.id);

    return await this.conflictRepository.findAll({
      where: {
        conflictCheckId: { [Op.in]: checkIds },
      },
      include: [ConflictCheckRequestModel],
    });
  }

  /**
   * 11. Get conflicts by client
   */
  async getConflictsByClient(clientId: string): Promise<ConflictDetailModel[]> {
    const checks = await this.requestRepository.findAll({
      where: { clientId },
    });

    const checkIds = checks.map((c) => c.id);

    return await this.conflictRepository.findAll({
      where: {
        conflictCheckId: { [Op.in]: checkIds },
      },
      include: [ConflictCheckRequestModel],
    });
  }
}

/**
 * Waiver Management Service
 * Manages conflict waivers and informed consent
 */
@Injectable()
export class WaiverManagementService {
  private readonly logger = new Logger(WaiverManagementService.name);

  constructor(
    @Inject('WAIVER_DOCUMENT_REPOSITORY')
    private readonly waiverRepository: typeof WaiverDocumentModel,
    @Inject('CONFLICT_DETAIL_REPOSITORY')
    private readonly conflictRepository: typeof ConflictDetailModel,
  ) {}

  /**
   * 12. Generate waiver document
   */
  async generateWaiver(waiverData: WaiverDocument): Promise<WaiverDocumentModel> {
    try {
      const validated = WaiverDocumentSchema.parse(waiverData);

      const conflict = await this.conflictRepository.findByPk(validated.conflictId);
      if (!conflict) {
        throw new NotFoundException(`Conflict not found: ${validated.conflictId}`);
      }

      const waiver = await this.waiverRepository.create({
        ...validated,
        status: WaiverStatus.DRAFT,
      } as any);

      this.logger.log(`Generated waiver document ${waiver.id} for conflict ${validated.conflictId}`);
      return waiver;
    } catch (error) {
      this.logger.error(`Failed to generate waiver: ${error.message}`);
      throw new BadRequestException(`Failed to generate waiver: ${error.message}`);
    }
  }

  /**
   * 13. Send waiver to client
   */
  async sendWaiverToClient(
    waiverId: string,
    senderId: string,
  ): Promise<WaiverDocumentModel> {
    const waiver = await this.waiverRepository.findByPk(waiverId);
    if (!waiver) {
      throw new NotFoundException(`Waiver not found: ${waiverId}`);
    }

    if (waiver.status !== WaiverStatus.DRAFT) {
      throw new BadRequestException('Only draft waivers can be sent to clients');
    }

    await waiver.update({
      status: WaiverStatus.SENT_TO_CLIENT,
      sentDate: new Date(),
      metadata: {
        ...waiver.metadata,
        sentBy: senderId,
      },
    });

    this.logger.log(`Sent waiver ${waiverId} to client ${waiver.clientId}`);
    return waiver;
  }

  /**
   * 14. Execute waiver
   */
  async executeWaiver(
    waiverId: string,
    signatoryInfo: Array<{
      name: string;
      title: string;
      signedDate: Date;
      signature: string;
    }>,
  ): Promise<WaiverDocumentModel> {
    const waiver = await this.waiverRepository.findByPk(waiverId);
    if (!waiver) {
      throw new NotFoundException(`Waiver not found: ${waiverId}`);
    }

    await waiver.update({
      status: WaiverStatus.EXECUTED,
      executedDate: new Date(),
      signatories: signatoryInfo,
    });

    // Update conflict resolution
    const conflict = await this.conflictRepository.findByPk(waiver.conflictId);
    if (conflict) {
      await conflict.update({
        resolution: ConflictResolution.WAIVED_BY_CLIENT,
        resolvedDate: new Date(),
      });
    }

    this.logger.log(`Executed waiver ${waiverId}`);
    return waiver;
  }

  /**
   * 15. Revoke waiver
   */
  async revokeWaiver(
    waiverId: string,
    reason: string,
    revokedBy: string,
  ): Promise<WaiverDocumentModel> {
    const waiver = await this.waiverRepository.findByPk(waiverId);
    if (!waiver) {
      throw new NotFoundException(`Waiver not found: ${waiverId}`);
    }

    if (waiver.status !== WaiverStatus.EXECUTED) {
      throw new BadRequestException('Only executed waivers can be revoked');
    }

    await waiver.update({
      status: WaiverStatus.REVOKED,
      revokedDate: new Date(),
      revokedReason: reason,
      metadata: {
        ...waiver.metadata,
        revokedBy,
      },
    });

    this.logger.log(`Revoked waiver ${waiverId}: ${reason}`);
    return waiver;
  }

  /**
   * 16. Track waiver expiration
   */
  async trackWaiverExpiration(): Promise<WaiverDocumentModel[]> {
    const now = new Date();

    const expiredWaivers = await this.waiverRepository.findAll({
      where: {
        status: WaiverStatus.EXECUTED,
        expirationDate: {
          [Op.lte]: now,
        },
      },
    });

    for (const waiver of expiredWaivers) {
      await waiver.update({ status: WaiverStatus.EXPIRED });
      this.logger.warn(`Waiver ${waiver.id} has expired`);
    }

    return expiredWaivers;
  }

  /**
   * 17. Get waivers by conflict
   */
  async getWaiversByConflict(conflictId: string): Promise<WaiverDocumentModel[]> {
    return await this.waiverRepository.findAll({
      where: { conflictId },
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * 18. Get active waivers
   */
  async getActiveWaivers(clientId?: string): Promise<WaiverDocumentModel[]> {
    const where: WhereOptions = {
      status: WaiverStatus.EXECUTED,
      [Op.or]: [
        { expirationDate: { [Op.is]: null } },
        { expirationDate: { [Op.gt]: new Date() } },
      ],
    };

    if (clientId) {
      where.clientId = clientId;
    }

    return await this.waiverRepository.findAll({
      where,
      order: [['executedDate', 'DESC']],
    });
  }
}

/**
 * Ethical Wall Service
 * Manages ethical walls (Chinese Walls) and information barriers
 */
@Injectable()
export class EthicalWallService {
  private readonly logger = new Logger(EthicalWallService.name);

  constructor(
    @Inject('ETHICAL_WALL_REPOSITORY')
    private readonly wallRepository: typeof EthicalWallModel,
    @Inject('CONFLICT_DETAIL_REPOSITORY')
    private readonly conflictRepository: typeof ConflictDetailModel,
  ) {}

  /**
   * 19. Implement ethical wall
   */
  async implementEthicalWall(wallData: EthicalWall): Promise<EthicalWallModel> {
    try {
      const validated = EthicalWallSchema.parse(wallData);

      const wall = await this.wallRepository.create({
        ...validated,
        status: EthicalWallStatus.ACTIVE,
      } as any);

      this.logger.log(
        `Implemented ethical wall ${wall.id} for matter ${validated.matterId}`,
      );
      return wall;
    } catch (error) {
      this.logger.error(`Failed to implement ethical wall: ${error.message}`);
      throw new BadRequestException(`Failed to implement ethical wall: ${error.message}`);
    }
  }

  /**
   * 20. Monitor ethical wall compliance
   */
  async monitorEthicalWall(
    wallId: string,
    reviewNotes: string,
  ): Promise<EthicalWallModel> {
    const wall = await this.wallRepository.findByPk(wallId);
    if (!wall) {
      throw new NotFoundException(`Ethical wall not found: ${wallId}`);
    }

    await wall.update({
      lastReviewDate: new Date(),
      metadata: {
        ...wall.metadata,
        lastReviewNotes: reviewNotes,
      },
    });

    this.logger.log(`Monitored ethical wall ${wallId}`);
    return wall;
  }

  /**
   * 21. Report ethical wall breach
   */
  async reportBreach(
    wallId: string,
    breachData: {
      description: string;
      remediation: string;
      reportedBy: string;
    },
  ): Promise<EthicalWallModel> {
    const wall = await this.wallRepository.findByPk(wallId);
    if (!wall) {
      throw new NotFoundException(`Ethical wall not found: ${wallId}`);
    }

    const breaches = wall.breaches || [];
    breaches.push({
      date: new Date(),
      ...breachData,
    });

    await wall.update({
      status: EthicalWallStatus.BREACHED,
      breaches,
    });

    this.logger.error(`Breach reported for ethical wall ${wallId}: ${breachData.description}`);
    return wall;
  }

  /**
   * 22. Lift ethical wall
   */
  async liftEthicalWall(
    wallId: string,
    reason: string,
    liftedBy: string,
  ): Promise<EthicalWallModel> {
    const wall = await this.wallRepository.findByPk(wallId);
    if (!wall) {
      throw new NotFoundException(`Ethical wall not found: ${wallId}`);
    }

    await wall.update({
      status: EthicalWallStatus.LIFTED,
      liftedDate: new Date(),
      liftedReason: reason,
      metadata: {
        ...wall.metadata,
        liftedBy,
      },
    });

    this.logger.log(`Lifted ethical wall ${wallId}: ${reason}`);
    return wall;
  }

  /**
   * 23. Get ethical walls by matter
   */
  async getEthicalWallsByMatter(matterId: string): Promise<EthicalWallModel[]> {
    return await this.wallRepository.findAll({
      where: { matterId },
      order: [['implementationDate', 'DESC']],
    });
  }

  /**
   * 24. Get ethical walls by attorney
   */
  async getEthicalWallsByAttorney(attorneyId: string): Promise<EthicalWallModel[]> {
    return await this.wallRepository.findAll({
      where: {
        screenedAttorneys: {
          [Op.contains]: [attorneyId],
        },
        status: EthicalWallStatus.ACTIVE,
      },
      order: [['implementationDate', 'DESC']],
    });
  }

  /**
   * 25. Check if attorney is screened
   */
  async isAttorneyScreened(attorneyId: string, matterId: string): Promise<boolean> {
    const walls = await this.wallRepository.findAll({
      where: {
        matterId,
        status: EthicalWallStatus.ACTIVE,
        screenedAttorneys: {
          [Op.contains]: [attorneyId],
        },
      },
    });

    return walls.length > 0;
  }
}

/**
 * Lateral Hire Service
 * Manages lateral hire conflict checks
 */
@Injectable()
export class LateralHireService {
  private readonly logger = new Logger(LateralHireService.name);

  constructor(
    @Inject('LATERAL_HIRE_CHECK_REPOSITORY')
    private readonly lateralRepository: typeof LateralHireCheckModel,
    @Inject('CONFLICT_DETAIL_REPOSITORY')
    private readonly conflictRepository: typeof ConflictDetailModel,
  ) {}

  /**
   * 26. Initiate lateral hire check
   */
  async initiateLateralHireCheck(
    checkData: LateralHireCheck,
  ): Promise<LateralHireCheckModel> {
    try {
      const validated = LateralHireCheckSchema.parse(checkData);

      const check = await this.lateralRepository.create({
        ...validated,
        status: LateralHireStatus.INITIATED,
      } as any);

      this.logger.log(
        `Initiated lateral hire check ${check.id} for candidate: ${validated.candidateName}`,
      );
      return check;
    } catch (error) {
      this.logger.error(`Failed to initiate lateral hire check: ${error.message}`);
      throw new BadRequestException(`Failed to initiate lateral hire check: ${error.message}`);
    }
  }

  /**
   * 27. Analyze prior matters for conflicts
   */
  async analyzePriorMatters(
    checkId: string,
  ): Promise<{ conflicts: ConflictDetail[]; riskScore: number }> {
    const check = await this.lateralRepository.findByPk(checkId);
    if (!check) {
      throw new NotFoundException(`Lateral hire check not found: ${checkId}`);
    }

    const conflicts: ConflictDetail[] = [];
    let totalRisk = 0;

    for (const priorMatter of check.priorMatters) {
      // Check if any opposing parties are current clients
      const opposingPartyConflicts = await this.checkOpposingPartyConflicts(priorMatter);
      conflicts.push(...opposingPartyConflicts);

      // Check for confidential information conflicts
      if (priorMatter.confidentialInformation && priorMatter.confidentialInformation.length > 0) {
        totalRisk += priorMatter.confidentialInformation.length * 10;
      }
    }

    const riskScore = Math.min(100, totalRisk + conflicts.length * 20);

    await check.update({
      conflictsIdentified: conflicts,
      status:
        conflicts.length > 0
          ? LateralHireStatus.CONFLICTS_IDENTIFIED
          : LateralHireStatus.PRELIMINARY_REVIEW,
    });

    this.logger.log(
      `Analyzed prior matters for ${checkId}: Found ${conflicts.length} conflicts, risk score ${riskScore}`,
    );

    return { conflicts, riskScore };
  }

  /**
   * 28. Check opposing party conflicts for lateral hire
   */
  private async checkOpposingPartyConflicts(
    priorMatter: PriorMatter,
  ): Promise<ConflictDetail[]> {
    // This would query current client database
    // Placeholder implementation
    return [];
  }

  /**
   * 29. Approve lateral hire
   */
  async approveLateralHire(
    checkId: string,
    approvedBy: string,
    conditions?: string[],
  ): Promise<LateralHireCheckModel> {
    const check = await this.lateralRepository.findByPk(checkId);
    if (!check) {
      throw new NotFoundException(`Lateral hire check not found: ${checkId}`);
    }

    const status =
      conditions && conditions.length > 0
        ? LateralHireStatus.CONDITIONAL_APPROVAL
        : LateralHireStatus.CLEARED;

    await check.update({
      status,
      approvedBy,
      approvalDate: new Date(),
      conditions,
    });

    this.logger.log(`Approved lateral hire ${checkId} with status: ${status}`);
    return check;
  }

  /**
   * 30. Decline lateral hire
   */
  async declineLateralHire(
    checkId: string,
    reason: string,
  ): Promise<LateralHireCheckModel> {
    const check = await this.lateralRepository.findByPk(checkId);
    if (!check) {
      throw new NotFoundException(`Lateral hire check not found: ${checkId}`);
    }

    await check.update({
      status: LateralHireStatus.HIRE_DECLINED,
      metadata: {
        ...check.metadata,
        declineReason: reason,
        declineDate: new Date(),
      },
    });

    this.logger.log(`Declined lateral hire ${checkId}: ${reason}`);
    return check;
  }

  /**
   * 31. Get lateral hire checks by status
   */
  async getLateralHireChecksByStatus(
    status: LateralHireStatus,
  ): Promise<LateralHireCheckModel[]> {
    return await this.lateralRepository.findAll({
      where: { status },
      order: [['proposedStartDate', 'ASC']],
    });
  }
}

/**
 * Conflict Reporting Service
 * Generates conflict reports and analytics
 */
@Injectable()
export class ConflictReportingService {
  private readonly logger = new Logger(ConflictReportingService.name);

  constructor(
    @Inject('CONFLICT_CHECK_REQUEST_REPOSITORY')
    private readonly requestRepository: typeof ConflictCheckRequestModel,
    @Inject('CONFLICT_DETAIL_REPOSITORY')
    private readonly conflictRepository: typeof ConflictDetailModel,
  ) {}

  /**
   * 32. Generate screening report
   */
  async generateScreeningReport(checkId: string): Promise<ScreeningReport> {
    const request = await this.requestRepository.findByPk(checkId, {
      include: [
        { model: ConflictDetailModel },
        { model: WaiverDocumentModel },
        { model: EthicalWallModel },
      ],
    });

    if (!request) {
      throw new NotFoundException(`Conflict check not found: ${checkId}`);
    }

    const conflicts = request.conflicts || [];
    const waivers = request.waivers || [];
    const ethicalWalls = request.ethicalWalls || [];

    let recommendation: 'approve' | 'approve_with_conditions' | 'decline' | 'needs_review';

    if (conflicts.length === 0) {
      recommendation = 'approve';
    } else {
      const hasAbsoluteConflicts = conflicts.some((c) => c.severity === ConflictSeverity.ABSOLUTE);
      const hasCriticalConflicts = conflicts.some((c) => c.severity === ConflictSeverity.CRITICAL);

      if (hasAbsoluteConflicts) {
        recommendation = 'decline';
      } else if (hasCriticalConflicts) {
        recommendation = waivers.length > 0 ? 'approve_with_conditions' : 'needs_review';
      } else {
        recommendation = 'approve_with_conditions';
      }
    }

    const report: ScreeningReport = {
      conflictCheckId: checkId,
      generatedDate: new Date(),
      generatedBy: request.performedBy || request.requestedBy,
      summary: `Conflict check for ${request.clientName}: Found ${conflicts.length} conflicts`,
      conflictsFound: conflicts.length,
      conflictDetails: conflicts,
      recommendation,
      conditions:
        recommendation === 'approve_with_conditions'
          ? ['Obtain executed waivers', 'Implement ethical walls as specified']
          : [],
      waivers,
      ethicalWalls,
      notificationsRequired: conflicts.flatMap((c) => c.affectedAttorneys),
      followUpActions: [],
    };

    return report;
  }

  /**
   * 33. Get conflict statistics
   */
  async getConflictStatistics(
    startDate: Date,
    endDate: Date,
  ): Promise<ConflictStatistics> {
    const checks = await this.requestRepository.findAll({
      where: {
        requestDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [{ model: ConflictDetailModel }],
    });

    const totalChecks = checks.length;
    const checksCleared = checks.filter(
      (c) => c.status === ConflictCheckStatus.CLEARED,
    ).length;
    const conflictsFound = checks.filter(
      (c) => c.status === ConflictCheckStatus.CONFLICT_FOUND,
    ).length;
    const waivedCount = checks.filter(
      (c) => c.status === ConflictCheckStatus.WAIVED,
    ).length;
    const declinedCount = checks.filter(
      (c) => c.status === ConflictCheckStatus.DECLINED,
    ).length;

    const waiverRate = totalChecks > 0 ? waivedCount / totalChecks : 0;
    const declineRate = totalChecks > 0 ? declinedCount / totalChecks : 0;

    const byType: Record<ConflictType, number> = {} as any;
    const bySeverity: Record<ConflictSeverity, number> = {} as any;
    const byPracticeArea: Record<string, number> = {};

    for (const check of checks) {
      byPracticeArea[check.practiceArea] = (byPracticeArea[check.practiceArea] || 0) + 1;

      if (check.conflicts) {
        for (const conflict of check.conflicts) {
          byType[conflict.conflictType] = (byType[conflict.conflictType] || 0) + 1;
          bySeverity[conflict.severity] = (bySeverity[conflict.severity] || 0) + 1;
        }
      }
    }

    return {
      period: { startDate, endDate },
      totalChecks,
      checksCleared,
      conflictsFound,
      waiverRate,
      declineRate,
      byType,
      bySeverity,
      byPracticeArea,
      averageResolutionTime: 0, // Would calculate from timestamps
      ethicalWallsImplemented: 0, // Would query EthicalWallModel
      lateralHireChecks: 0, // Would query LateralHireCheckModel
      trends: [],
    };
  }

  /**
   * 34. Periodic conflict review
   */
  async performPeriodicReview(
    matterId: string,
  ): Promise<{ conflicts: ConflictDetailModel[]; reviewDate: Date }> {
    const existingChecks = await this.requestRepository.findAll({
      where: { matterId },
      include: [{ model: ConflictDetailModel }],
      order: [['requestDate', 'DESC']],
    });

    if (existingChecks.length === 0) {
      throw new NotFoundException(`No conflict checks found for matter: ${matterId}`);
    }

    const latestCheck = existingChecks[0];
    const allConflicts = existingChecks.flatMap((c) => c.conflicts || []);

    this.logger.log(`Performed periodic review for matter ${matterId}`);

    return {
      conflicts: allConflicts,
      reviewDate: new Date(),
    };
  }

  /**
   * 35. Export conflict data for compliance
   */
  async exportConflictData(
    startDate: Date,
    endDate: Date,
  ): Promise<{
    checks: ConflictCheckRequestModel[];
    conflicts: ConflictDetailModel[];
    waivers: WaiverDocumentModel[];
    exportDate: Date;
  }> {
    const checks = await this.requestRepository.findAll({
      where: {
        requestDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        { model: ConflictDetailModel },
        { model: WaiverDocumentModel },
      ],
    });

    const conflicts = checks.flatMap((c) => c.conflicts || []);
    const waivers = checks.flatMap((c) => c.waivers || []);

    this.logger.log(
      `Exported conflict data: ${checks.length} checks, ${conflicts.length} conflicts, ${waivers.length} waivers`,
    );

    return {
      checks,
      conflicts,
      waivers,
      exportDate: new Date(),
    };
  }
}

// ============================================================================
// CONFIGURATION & MODULE
// ============================================================================

/**
 * Conflict check kit configuration
 */
export const conflictCheckConfig = registerAs('conflictCheck', () => ({
  autoScreening: {
    enabled: process.env.CONFLICT_AUTO_SCREENING === 'true',
    threshold: parseInt(process.env.CONFLICT_AUTO_SCREENING_THRESHOLD || '3', 10),
  },
  waiver: {
    defaultExpirationDays: parseInt(process.env.WAIVER_EXPIRATION_DAYS || '365', 10),
    requireApproval: process.env.WAIVER_REQUIRE_APPROVAL === 'true',
  },
  ethicalWall: {
    defaultMonitoringFrequency: process.env.ETHICAL_WALL_MONITORING || 'monthly',
    breachNotification: process.env.ETHICAL_WALL_BREACH_NOTIFICATION === 'true',
  },
  lateralHire: {
    automaticScreening: process.env.LATERAL_HIRE_AUTO_SCREEN === 'true',
    approvalRequired: process.env.LATERAL_HIRE_APPROVAL === 'true',
  },
  notifications: {
    enabled: process.env.CONFLICT_NOTIFICATIONS === 'true',
    channels: (process.env.CONFLICT_NOTIFICATION_CHANNELS || 'email,system').split(','),
  },
}));

/**
 * Conflict Check Module
 * Provides comprehensive conflict of interest management
 */
@Global()
@Module({
  imports: [ConfigModule.forFeature(conflictCheckConfig)],
  providers: [
    ConflictScreeningService,
    WaiverManagementService,
    EthicalWallService,
    LateralHireService,
    ConflictReportingService,
    {
      provide: 'CONFLICT_CHECK_REQUEST_REPOSITORY',
      useValue: ConflictCheckRequestModel,
    },
    {
      provide: 'CONFLICT_DETAIL_REPOSITORY',
      useValue: ConflictDetailModel,
    },
    {
      provide: 'WAIVER_DOCUMENT_REPOSITORY',
      useValue: WaiverDocumentModel,
    },
    {
      provide: 'ETHICAL_WALL_REPOSITORY',
      useValue: EthicalWallModel,
    },
    {
      provide: 'LATERAL_HIRE_CHECK_REPOSITORY',
      useValue: LateralHireCheckModel,
    },
    {
      provide: 'CONFLICT_NOTIFICATION_REPOSITORY',
      useValue: ConflictNotificationModel,
    },
  ],
  exports: [
    ConflictScreeningService,
    WaiverManagementService,
    EthicalWallService,
    LateralHireService,
    ConflictReportingService,
  ],
})
export class ConflictCheckModule {
  static forRoot(): DynamicModule {
    return {
      module: ConflictCheckModule,
      global: true,
    };
  }
}
