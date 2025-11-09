/**
 * LOC: PRIVILEGE_REVIEW_KIT_001
 * File: /reuse/legal/privilege-review-kit.ts
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
 *   - Legal privilege modules
 *   - Document review controllers
 *   - Privilege logging services
 *   - Clawback management services
 *   - Quality control services
 */

/**
 * File: /reuse/legal/privilege-review-kit.ts
 * Locator: WC-PRIVILEGE-REVIEW-KIT-001
 * Purpose: Production-Grade Privilege Review Kit - Enterprise privilege protection toolkit
 *
 * Upstream: NestJS, Sequelize, Zod, Date-FNS
 * Downstream: ../backend/modules/privilege/*, Document review controllers, Privilege services
 * Dependencies: TypeScript 5.x, Node 18+, sequelize-typescript, @nestjs/swagger, zod
 * Exports: 42 production-ready privilege review functions for legal platforms
 *
 * LLM Context: Production-grade privilege review and protection toolkit for White Cross platform.
 * Provides comprehensive privilege tagging with multi-level classification (attorney-client, work
 * product, common interest, etc.), privilege log generation with automatic formatting and export,
 * clawback request management for inadvertent disclosure, privilege assertion workflow with
 * challenge/dispute resolution, review quality control with sampling and consistency validation,
 * Sequelize models for privilege tags/logs/assertions/clawback requests, NestJS services with
 * dependency injection, Swagger API documentation, privilege claim validation with legal basis
 * verification, batch document tagging for mass review, privilege log completeness checking,
 * inadvertent disclosure detection and remediation, clawback notice generation with template
 * support, assertion rationale documentation, privilege gap identification, QC metrics generation,
 * consistency validation across document sets, privilege hierarchy management, redaction
 * coordination, waiver tracking, and healthcare-specific privilege support (peer review privilege,
 * patient safety work product, quality improvement privilege, medical staff credentialing).
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
} from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';
import { Op, WhereOptions, FindOptions, Transaction } from 'sequelize';
import { addDays, differenceInDays, format, parseISO } from 'date-fns';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Types of legal privilege
 */
export enum PrivilegeType {
  ATTORNEY_CLIENT = 'attorney_client',
  WORK_PRODUCT = 'work_product',
  COMMON_INTEREST = 'common_interest',
  SETTLEMENT_NEGOTIATION = 'settlement_negotiation',
  JOINT_DEFENSE = 'joint_defense',
  MEDIATION = 'mediation',
  ATTORNEY_WORK_PRODUCT = 'attorney_work_product',
  SELF_CRITICAL_ANALYSIS = 'self_critical_analysis',
  PEER_REVIEW = 'peer_review',
  PATIENT_SAFETY_WORK_PRODUCT = 'patient_safety_work_product',
  QUALITY_IMPROVEMENT = 'quality_improvement',
  CREDENTIALING_PEER_REVIEW = 'credentialing_peer_review',
  EXECUTIVE_PRIVILEGE = 'executive_privilege',
  DELIBERATIVE_PROCESS = 'deliberative_process',
  OTHER = 'other',
}

/**
 * Privilege assertion status
 */
export enum PrivilegeAssertionStatus {
  PENDING_REVIEW = 'pending_review',
  UNDER_REVIEW = 'under_review',
  ASSERTED = 'asserted',
  CHALLENGED = 'challenged',
  DISPUTED = 'disputed',
  UPHELD = 'upheld',
  OVERRULED = 'overruled',
  WAIVED = 'waived',
  PARTIALLY_WAIVED = 'partially_waived',
  WITHDRAWN = 'withdrawn',
  RESOLVED = 'resolved',
}

/**
 * Legal basis for privilege claim
 */
export enum PrivilegeBasis {
  FEDERAL_RULE_EVIDENCE_501 = 'fre_501',
  STATE_ATTORNEY_CLIENT = 'state_attorney_client',
  FEDERAL_WORK_PRODUCT = 'federal_work_product',
  COMMON_LAW = 'common_law',
  STATUTORY = 'statutory',
  HIPAA_PATIENT_SAFETY = 'hipaa_patient_safety',
  PEER_REVIEW_STATUTE = 'peer_review_statute',
  CONTRACTUAL = 'contractual',
  PROTECTIVE_ORDER = 'protective_order',
  OTHER = 'other',
}

/**
 * Clawback request status
 */
export enum ClawbackStatus {
  DISCLOSED = 'disclosed',
  DETECTED = 'detected',
  REQUEST_INITIATED = 'request_initiated',
  NOTICE_SENT = 'notice_sent',
  RECIPIENT_ACKNOWLEDGED = 'recipient_acknowledged',
  DOCUMENTS_RETURNED = 'documents_returned',
  DOCUMENTS_DESTROYED = 'documents_destroyed',
  REFUSED = 'refused',
  LITIGATED = 'litigated',
  WAIVED = 'waived',
  RESOLVED = 'resolved',
}

/**
 * Inadvertent disclosure severity
 */
export enum DisclosureSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Quality control review status
 */
export enum QCReviewStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  PASSED = 'passed',
  FAILED = 'failed',
  NEEDS_REMEDIATION = 'needs_remediation',
  COMPLETED = 'completed',
}

/**
 * Privilege log format types
 */
export enum PrivilegeLogFormat {
  STANDARD = 'standard',
  DETAILED = 'detailed',
  SUMMARY = 'summary',
  EXCEL = 'excel',
  PDF = 'pdf',
  HTML = 'html',
}

/**
 * Document confidentiality level
 */
export enum ConfidentialityLevel {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  HIGHLY_CONFIDENTIAL = 'highly_confidential',
  PRIVILEGED = 'privileged',
  ATTORNEYS_EYES_ONLY = 'attorneys_eyes_only',
}

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

export const PrivilegeTagSchema = z.object({
  documentId: z.string().uuid(),
  privilegeType: z.nativeEnum(PrivilegeType),
  privilegeBasis: z.nativeEnum(PrivilegeBasis),
  assertionReason: z.string().min(10).max(5000),
  confidentialityLevel: z.nativeEnum(ConfidentialityLevel),
  reviewerId: z.string().uuid(),
  dateAsserted: z.date().optional(),
  notes: z.string().max(10000).optional(),
});

export const PrivilegeLogEntrySchema = z.object({
  documentIdentifier: z.string(),
  documentDate: z.date(),
  author: z.string(),
  recipients: z.array(z.string()),
  privilegeType: z.nativeEnum(PrivilegeType),
  description: z.string().min(20).max(2000),
  basisForClaim: z.string(),
  ccRecipients: z.array(z.string()).optional(),
});

export const ClawbackRequestSchema = z.object({
  documentId: z.string().uuid(),
  disclosureDate: z.date(),
  detectionDate: z.date(),
  recipientParty: z.string(),
  disclosureSeverity: z.nativeEnum(DisclosureSeverity),
  requestedAction: z.enum(['return', 'destroy', 'both']),
  legalBasis: z.string(),
  deadlineDate: z.date().optional(),
});

export const PrivilegeAssertionSchema = z.object({
  documentId: z.string().uuid(),
  privilegeType: z.nativeEnum(PrivilegeType),
  assertedBy: z.string().uuid(),
  assertionDate: z.date(),
  rationale: z.string().min(50).max(10000),
  supportingAuthority: z.string().optional(),
  status: z.nativeEnum(PrivilegeAssertionStatus),
});

export const QualityControlSchema = z.object({
  reviewBatchId: z.string().uuid(),
  sampleSize: z.number().int().positive(),
  reviewerId: z.string().uuid(),
  accuracyThreshold: z.number().min(0).max(100),
  consistencyThreshold: z.number().min(0).max(100),
});

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Privilege Tag Model - Stores privilege designations for documents
 */
@Table({
  tableName: 'privilege_tags',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['document_id'] },
    { fields: ['privilege_type'] },
    { fields: ['reviewer_id'] },
    { fields: ['created_at'] },
    { fields: ['assertion_status'] },
  ],
})
export class PrivilegeTag extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique identifier for privilege tag' })
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'document_id',
  })
  @ApiProperty({ description: 'Document being tagged as privileged' })
  documentId!: string;

  @Column({
    type: DataType.ENUM(...Object.values(PrivilegeType)),
    allowNull: false,
    field: 'privilege_type',
  })
  @ApiProperty({ enum: PrivilegeType, description: 'Type of privilege asserted' })
  privilegeType!: PrivilegeType;

  @Column({
    type: DataType.ENUM(...Object.values(PrivilegeBasis)),
    allowNull: false,
    field: 'privilege_basis',
  })
  @ApiProperty({ enum: PrivilegeBasis, description: 'Legal basis for privilege' })
  privilegeBasis!: PrivilegeBasis;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'assertion_reason',
  })
  @ApiProperty({ description: 'Detailed reason for privilege assertion' })
  assertionReason!: string;

  @Column({
    type: DataType.ENUM(...Object.values(ConfidentialityLevel)),
    allowNull: false,
    field: 'confidentiality_level',
  })
  @ApiProperty({ enum: ConfidentialityLevel, description: 'Confidentiality classification' })
  confidentialityLevel!: ConfidentialityLevel;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'reviewer_id',
  })
  @ApiProperty({ description: 'User who tagged the document' })
  reviewerId!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'date_asserted',
  })
  @ApiProperty({ description: 'Date privilege was asserted' })
  dateAsserted?: Date;

  @Column({
    type: DataType.ENUM(...Object.values(PrivilegeAssertionStatus)),
    allowNull: false,
    defaultValue: PrivilegeAssertionStatus.PENDING_REVIEW,
    field: 'assertion_status',
  })
  @ApiProperty({ enum: PrivilegeAssertionStatus, description: 'Current assertion status' })
  assertionStatus!: PrivilegeAssertionStatus;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiProperty({ description: 'Additional notes' })
  notes?: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  @ApiProperty({ description: 'Additional metadata' })
  metadata?: Record<string, any>;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  deletedAt?: Date;

  @HasMany(() => PrivilegeAssertion, 'privilegeTagId')
  assertions?: PrivilegeAssertion[];
}

/**
 * Privilege Log Model - Formal privilege log entries
 */
@Table({
  tableName: 'privilege_logs',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['matter_id'] },
    { fields: ['document_identifier'] },
    { fields: ['privilege_type'] },
    { fields: ['created_at'] },
  ],
})
export class PrivilegeLog extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique identifier for log entry' })
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'matter_id',
  })
  @ApiProperty({ description: 'Associated legal matter' })
  matterId!: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
    field: 'document_identifier',
  })
  @ApiProperty({ description: 'Document identifier (Bates, control number, etc.)' })
  documentIdentifier!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'document_date',
  })
  @ApiProperty({ description: 'Date of the document' })
  documentDate!: Date;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  @ApiProperty({ description: 'Document author' })
  author!: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  @ApiProperty({ description: 'Document recipients', type: [String] })
  recipients!: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
    field: 'cc_recipients',
  })
  @ApiProperty({ description: 'CC recipients', type: [String] })
  ccRecipients?: string[];

  @Column({
    type: DataType.ENUM(...Object.values(PrivilegeType)),
    allowNull: false,
    field: 'privilege_type',
  })
  @ApiProperty({ enum: PrivilegeType, description: 'Type of privilege' })
  privilegeType!: PrivilegeType;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  @ApiProperty({ description: 'General description of document' })
  description!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'basis_for_claim',
  })
  @ApiProperty({ description: 'Legal basis for privilege claim' })
  basisForClaim!: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    field: 'subject_matter',
  })
  @ApiProperty({ description: 'Subject matter of communication' })
  subjectMatter?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'page_count',
  })
  @ApiProperty({ description: 'Number of pages' })
  pageCount?: number;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  @ApiProperty({ description: 'Additional metadata' })
  metadata?: Record<string, any>;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  deletedAt?: Date;
}

/**
 * Privilege Assertion Model - Tracks privilege assertion workflow
 */
@Table({
  tableName: 'privilege_assertions',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['privilege_tag_id'] },
    { fields: ['asserted_by'] },
    { fields: ['status'] },
    { fields: ['assertion_date'] },
  ],
})
export class PrivilegeAssertion extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique identifier for assertion' })
  id!: string;

  @ForeignKey(() => PrivilegeTag)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'privilege_tag_id',
  })
  @ApiProperty({ description: 'Associated privilege tag' })
  privilegeTagId!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'asserted_by',
  })
  @ApiProperty({ description: 'User asserting privilege' })
  assertedBy!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'assertion_date',
  })
  @ApiProperty({ description: 'Date of assertion' })
  assertionDate!: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  @ApiProperty({ description: 'Detailed rationale for assertion' })
  rationale!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'supporting_authority',
  })
  @ApiProperty({ description: 'Legal authority supporting claim' })
  supportingAuthority?: string;

  @Column({
    type: DataType.ENUM(...Object.values(PrivilegeAssertionStatus)),
    allowNull: false,
    defaultValue: PrivilegeAssertionStatus.PENDING_REVIEW,
  })
  @ApiProperty({ enum: PrivilegeAssertionStatus, description: 'Assertion status' })
  status!: PrivilegeAssertionStatus;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'challenged_by',
  })
  @ApiProperty({ description: 'User challenging the assertion' })
  challengedBy?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'challenge_reason',
  })
  @ApiProperty({ description: 'Reason for challenge' })
  challengeReason?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'challenge_date',
  })
  @ApiProperty({ description: 'Date of challenge' })
  challengeDate?: Date;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'resolved_by',
  })
  @ApiProperty({ description: 'User resolving dispute' })
  resolvedBy?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiProperty({ description: 'Resolution details' })
  resolution?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'resolution_date',
  })
  @ApiProperty({ description: 'Date of resolution' })
  resolutionDate?: Date;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  @ApiProperty({ description: 'Additional metadata' })
  metadata?: Record<string, any>;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  deletedAt?: Date;

  @BelongsTo(() => PrivilegeTag)
  privilegeTag?: PrivilegeTag;
}

/**
 * Clawback Request Model - Tracks inadvertent disclosure and clawback
 */
@Table({
  tableName: 'clawback_requests',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['document_id'] },
    { fields: ['status'] },
    { fields: ['disclosure_date'] },
    { fields: ['recipient_party'] },
    { fields: ['severity'] },
  ],
})
export class ClawbackRequest extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique identifier for clawback request' })
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'document_id',
  })
  @ApiProperty({ description: 'Inadvertently disclosed document' })
  documentId!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'disclosure_date',
  })
  @ApiProperty({ description: 'Date of inadvertent disclosure' })
  disclosureDate!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'detection_date',
  })
  @ApiProperty({ description: 'Date disclosure was detected' })
  detectionDate!: Date;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
    field: 'recipient_party',
  })
  @ApiProperty({ description: 'Party who received the document' })
  recipientParty!: string;

  @Column({
    type: DataType.ENUM(...Object.values(DisclosureSeverity)),
    allowNull: false,
  })
  @ApiProperty({ enum: DisclosureSeverity, description: 'Severity of disclosure' })
  severity!: DisclosureSeverity;

  @Column({
    type: DataType.ENUM(...Object.values(ClawbackStatus)),
    allowNull: false,
    defaultValue: ClawbackStatus.DETECTED,
  })
  @ApiProperty({ enum: ClawbackStatus, description: 'Clawback request status' })
  status!: ClawbackStatus;

  @Column({
    type: DataType.ENUM('return', 'destroy', 'both'),
    allowNull: false,
    field: 'requested_action',
  })
  @ApiProperty({ description: 'Action requested (return/destroy/both)' })
  requestedAction!: 'return' | 'destroy' | 'both';

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'legal_basis',
  })
  @ApiProperty({ description: 'Legal basis for clawback' })
  legalBasis!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'notice_sent_date',
  })
  @ApiProperty({ description: 'Date clawback notice was sent' })
  noticeSentDate?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'deadline_date',
  })
  @ApiProperty({ description: 'Deadline for compliance' })
  deadlineDate?: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'recipient_response',
  })
  @ApiProperty({ description: 'Response from recipient' })
  recipientResponse?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'response_date',
  })
  @ApiProperty({ description: 'Date of recipient response' })
  responseDate?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'compliance_date',
  })
  @ApiProperty({ description: 'Date recipient complied' })
  complianceDate?: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  @ApiProperty({ description: 'Additional notes' })
  notes?: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  @ApiProperty({ description: 'Additional metadata' })
  metadata?: Record<string, any>;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  deletedAt?: Date;
}

// ============================================================================
// TYPESCRIPT INTERFACES
// ============================================================================

export interface PrivilegeTagData {
  documentId: string;
  privilegeType: PrivilegeType;
  privilegeBasis: PrivilegeBasis;
  assertionReason: string;
  confidentialityLevel: ConfidentialityLevel;
  reviewerId: string;
  dateAsserted?: Date;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface PrivilegeLogEntryData {
  matterId: string;
  documentIdentifier: string;
  documentDate: Date;
  author: string;
  recipients: string[];
  ccRecipients?: string[];
  privilegeType: PrivilegeType;
  description: string;
  basisForClaim: string;
  subjectMatter?: string;
  pageCount?: number;
  metadata?: Record<string, any>;
}

export interface ClawbackRequestData {
  documentId: string;
  disclosureDate: Date;
  detectionDate: Date;
  recipientParty: string;
  severity: DisclosureSeverity;
  requestedAction: 'return' | 'destroy' | 'both';
  legalBasis: string;
  deadlineDate?: Date;
  notes?: string;
}

export interface PrivilegeAssertionData {
  privilegeTagId: string;
  assertedBy: string;
  assertionDate: Date;
  rationale: string;
  supportingAuthority?: string;
  metadata?: Record<string, any>;
}

export interface QualityControlMetrics {
  totalReviewed: number;
  accuracyRate: number;
  consistencyRate: number;
  errorsFound: number;
  missingTags: number;
  inconsistentTags: number;
  recommendationsCount: number;
}

export interface PrivilegeLogExportOptions {
  format: PrivilegeLogFormat;
  includeMetadata: boolean;
  redactSensitiveInfo: boolean;
  groupByPrivilegeType: boolean;
  sortBy: 'date' | 'type' | 'identifier';
}

// ============================================================================
// PRIVILEGE TAGGING FUNCTIONS (8)
// ============================================================================

/**
 * Function 1: Create Privilege Tag
 * Tags a document with privilege designation
 */
export async function createPrivilegeTag(
  data: PrivilegeTagData,
  transaction?: Transaction
): Promise<PrivilegeTag> {
  try {
    // Validate input
    const validated = PrivilegeTagSchema.parse({
      ...data,
      dateAsserted: data.dateAsserted || new Date(),
    });

    // Create privilege tag
    const tag = await PrivilegeTag.create(
      {
        documentId: validated.documentId,
        privilegeType: validated.privilegeType,
        privilegeBasis: validated.privilegeBasis,
        assertionReason: validated.assertionReason,
        confidentialityLevel: validated.confidentialityLevel,
        reviewerId: validated.reviewerId,
        dateAsserted: validated.dateAsserted,
        assertionStatus: PrivilegeAssertionStatus.PENDING_REVIEW,
        notes: data.notes,
        metadata: data.metadata,
      },
      { transaction }
    );

    return tag;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }
    throw new InternalServerErrorException('Failed to create privilege tag');
  }
}

/**
 * Function 2: Update Privilege Tag
 * Modifies an existing privilege classification
 */
export async function updatePrivilegeTag(
  tagId: string,
  updates: Partial<PrivilegeTagData>,
  transaction?: Transaction
): Promise<PrivilegeTag> {
  try {
    const tag = await PrivilegeTag.findByPk(tagId, { transaction });
    if (!tag) {
      throw new NotFoundException('Privilege tag not found');
    }

    // Update fields
    await tag.update(updates, { transaction });

    return tag;
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to update privilege tag');
  }
}

/**
 * Function 3: Batch Tag Documents
 * Applies privilege tags to multiple documents at once
 */
export async function batchTagDocuments(
  documentIds: string[],
  privilegeData: Omit<PrivilegeTagData, 'documentId'>,
  transaction?: Transaction
): Promise<PrivilegeTag[]> {
  try {
    if (documentIds.length === 0) {
      throw new BadRequestException('No documents provided for tagging');
    }

    const tags: PrivilegeTag[] = [];

    for (const documentId of documentIds) {
      const tag = await createPrivilegeTag(
        { ...privilegeData, documentId },
        transaction
      );
      tags.push(tag);
    }

    return tags;
  } catch (error) {
    if (error instanceof BadRequestException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to batch tag documents');
  }
}

/**
 * Function 4: Validate Privilege Claim
 * Validates whether a privilege claim is legally sound
 */
export async function validatePrivilegeClaim(
  tagId: string
): Promise<{ valid: boolean; issues: string[]; recommendations: string[] }> {
  try {
    const tag = await PrivilegeTag.findByPk(tagId);
    if (!tag) {
      throw new NotFoundException('Privilege tag not found');
    }

    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check assertion reason length
    if (tag.assertionReason.length < 50) {
      issues.push('Assertion reason is too brief');
      recommendations.push('Provide more detailed justification for privilege claim');
    }

    // Check privilege type and basis consistency
    if (
      tag.privilegeType === PrivilegeType.ATTORNEY_CLIENT &&
      tag.privilegeBasis === PrivilegeBasis.FEDERAL_WORK_PRODUCT
    ) {
      issues.push('Privilege type and basis mismatch');
      recommendations.push('Ensure privilege type matches legal basis');
    }

    // Check confidentiality level appropriateness
    if (
      tag.privilegeType === PrivilegeType.ATTORNEY_CLIENT &&
      tag.confidentialityLevel === ConfidentialityLevel.INTERNAL
    ) {
      issues.push('Confidentiality level may be too low for attorney-client privilege');
      recommendations.push('Consider elevating to PRIVILEGED or ATTORNEYS_EYES_ONLY');
    }

    // Check for date assertion
    if (!tag.dateAsserted) {
      issues.push('Missing assertion date');
      recommendations.push('Add date when privilege was asserted');
    }

    return {
      valid: issues.length === 0,
      issues,
      recommendations,
    };
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to validate privilege claim');
  }
}

/**
 * Function 5: Get Privilege Tags by Document
 * Retrieves all privilege tags for a specific document
 */
export async function getPrivilegeTagsByDocument(
  documentId: string,
  includeDeleted: boolean = false
): Promise<PrivilegeTag[]> {
  try {
    const options: FindOptions = {
      where: { documentId },
      order: [['createdAt', 'DESC']],
    };

    if (includeDeleted) {
      options.paranoid = false;
    }

    const tags = await PrivilegeTag.findAll(options);
    return tags;
  } catch (error) {
    throw new InternalServerErrorException('Failed to retrieve privilege tags');
  }
}

/**
 * Function 6: Search Privileged Documents
 * Searches for documents by privilege criteria
 */
export async function searchPrivilegedDocuments(
  criteria: {
    privilegeType?: PrivilegeType;
    privilegeBasis?: PrivilegeBasis;
    assertionStatus?: PrivilegeAssertionStatus;
    reviewerId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  },
  limit: number = 100,
  offset: number = 0
): Promise<{ tags: PrivilegeTag[]; total: number }> {
  try {
    const where: WhereOptions = {};

    if (criteria.privilegeType) {
      where['privilegeType'] = criteria.privilegeType;
    }
    if (criteria.privilegeBasis) {
      where['privilegeBasis'] = criteria.privilegeBasis;
    }
    if (criteria.assertionStatus) {
      where['assertionStatus'] = criteria.assertionStatus;
    }
    if (criteria.reviewerId) {
      where['reviewerId'] = criteria.reviewerId;
    }
    if (criteria.dateFrom || criteria.dateTo) {
      where['dateAsserted'] = {};
      if (criteria.dateFrom) {
        where['dateAsserted'][Op.gte] = criteria.dateFrom;
      }
      if (criteria.dateTo) {
        where['dateAsserted'][Op.lte] = criteria.dateTo;
      }
    }

    const { rows, count } = await PrivilegeTag.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return { tags: rows, total: count };
  } catch (error) {
    throw new InternalServerErrorException('Failed to search privileged documents');
  }
}

/**
 * Function 7: Remove Privilege Tag
 * Removes privilege designation from a document
 */
export async function removePrivilegeTag(
  tagId: string,
  reason: string,
  removedBy: string,
  transaction?: Transaction
): Promise<void> {
  try {
    const tag = await PrivilegeTag.findByPk(tagId, { transaction });
    if (!tag) {
      throw new NotFoundException('Privilege tag not found');
    }

    // Update metadata with removal info
    await tag.update(
      {
        metadata: {
          ...tag.metadata,
          removedBy,
          removalReason: reason,
          removalDate: new Date(),
        },
        assertionStatus: PrivilegeAssertionStatus.WITHDRAWN,
      },
      { transaction }
    );

    // Soft delete
    await tag.destroy({ transaction });
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to remove privilege tag');
  }
}

/**
 * Function 8: Bulk Privilege Review
 * Performs mass privilege review with status updates
 */
export async function bulkPrivilegeReview(
  tagIds: string[],
  newStatus: PrivilegeAssertionStatus,
  reviewerId: string,
  notes?: string,
  transaction?: Transaction
): Promise<{ updated: number; failed: string[] }> {
  try {
    const failed: string[] = [];
    let updated = 0;

    for (const tagId of tagIds) {
      try {
        const tag = await PrivilegeTag.findByPk(tagId, { transaction });
        if (tag) {
          await tag.update(
            {
              assertionStatus: newStatus,
              notes: notes ? `${tag.notes || ''}\n[${new Date().toISOString()}] ${notes}` : tag.notes,
              metadata: {
                ...tag.metadata,
                lastReviewedBy: reviewerId,
                lastReviewedAt: new Date(),
              },
            },
            { transaction }
          );
          updated++;
        } else {
          failed.push(tagId);
        }
      } catch (err) {
        failed.push(tagId);
      }
    }

    return { updated, failed };
  } catch (error) {
    throw new InternalServerErrorException('Failed to perform bulk privilege review');
  }
}

// ============================================================================
// PRIVILEGE LOG GENERATION FUNCTIONS (7)
// ============================================================================

/**
 * Function 9: Generate Privilege Log
 * Creates comprehensive privilege log for matter
 */
export async function generatePrivilegeLog(
  matterId: string,
  options?: Partial<PrivilegeLogExportOptions>
): Promise<PrivilegeLog[]> {
  try {
    const logs = await PrivilegeLog.findAll({
      where: { matterId },
      order: [
        options?.sortBy === 'type' ? ['privilegeType', 'ASC'] :
        options?.sortBy === 'identifier' ? ['documentIdentifier', 'ASC'] :
        ['documentDate', 'DESC']
      ],
    });

    return logs;
  } catch (error) {
    throw new InternalServerErrorException('Failed to generate privilege log');
  }
}

/**
 * Function 10: Add Privilege Log Entry
 * Adds a single entry to the privilege log
 */
export async function addPrivilegeLogEntry(
  data: PrivilegeLogEntryData,
  transaction?: Transaction
): Promise<PrivilegeLog> {
  try {
    const validated = PrivilegeLogEntrySchema.parse({
      documentIdentifier: data.documentIdentifier,
      documentDate: data.documentDate,
      author: data.author,
      recipients: data.recipients,
      privilegeType: data.privilegeType,
      description: data.description,
      basisForClaim: data.basisForClaim,
      ccRecipients: data.ccRecipients,
    });

    const entry = await PrivilegeLog.create(
      {
        matterId: data.matterId,
        documentIdentifier: validated.documentIdentifier,
        documentDate: validated.documentDate,
        author: validated.author,
        recipients: validated.recipients,
        ccRecipients: validated.ccRecipients,
        privilegeType: validated.privilegeType,
        description: validated.description,
        basisForClaim: validated.basisForClaim,
        subjectMatter: data.subjectMatter,
        pageCount: data.pageCount,
        metadata: data.metadata,
      },
      { transaction }
    );

    return entry;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }
    throw new InternalServerErrorException('Failed to add privilege log entry');
  }
}

/**
 * Function 11: Format Privilege Log Export
 * Formats privilege log for export in various formats
 */
export async function formatPrivilegeLogExport(
  matterId: string,
  format: PrivilegeLogFormat = PrivilegeLogFormat.STANDARD,
  options?: Partial<PrivilegeLogExportOptions>
): Promise<string | Buffer> {
  try {
    const logs = await generatePrivilegeLog(matterId, options);

    if (format === PrivilegeLogFormat.STANDARD || format === PrivilegeLogFormat.HTML) {
      // Generate HTML table
      let html = `
        <html>
          <head>
            <style>
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #4CAF50; color: white; }
            </style>
          </head>
          <body>
            <h1>Privilege Log - Matter ${matterId}</h1>
            <table>
              <thead>
                <tr>
                  <th>Doc ID</th>
                  <th>Date</th>
                  <th>Author</th>
                  <th>Recipients</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Basis</th>
                </tr>
              </thead>
              <tbody>
      `;

      for (const log of logs) {
        const description = options?.redactSensitiveInfo
          ? log.description.substring(0, 100) + '...'
          : log.description;

        html += `
          <tr>
            <td>${log.documentIdentifier}</td>
            <td>${format(new Date(log.documentDate), 'yyyy-MM-dd')}</td>
            <td>${log.author}</td>
            <td>${log.recipients.join(', ')}</td>
            <td>${log.privilegeType}</td>
            <td>${description}</td>
            <td>${log.basisForClaim}</td>
          </tr>
        `;
      }

      html += `
              </tbody>
            </table>
          </body>
        </html>
      `;

      return html;
    }

    // Default to CSV format
    let csv = 'Document ID,Date,Author,Recipients,CC Recipients,Privilege Type,Description,Basis\n';
    for (const log of logs) {
      const description = options?.redactSensitiveInfo
        ? log.description.substring(0, 100)
        : log.description;

      csv += `"${log.documentIdentifier}","${format(new Date(log.documentDate), 'yyyy-MM-dd')}","${log.author}","${log.recipients.join('; ')}","${log.ccRecipients?.join('; ') || ''}","${log.privilegeType}","${description}","${log.basisForClaim}"\n`;
    }

    return csv;
  } catch (error) {
    throw new InternalServerErrorException('Failed to format privilege log export');
  }
}

/**
 * Function 12: Validate Privilege Log Completeness
 * Checks privilege log for missing or incomplete entries
 */
export async function validatePrivilegeLogCompleteness(
  matterId: string
): Promise<{ complete: boolean; issues: string[]; missingFields: Array<{ entryId: string; fields: string[] }> }> {
  try {
    const logs = await PrivilegeLog.findAll({ where: { matterId } });
    const issues: string[] = [];
    const missingFields: Array<{ entryId: string; fields: string[] }> = [];

    for (const log of logs) {
      const fields: string[] = [];

      if (!log.documentIdentifier) fields.push('documentIdentifier');
      if (!log.documentDate) fields.push('documentDate');
      if (!log.author) fields.push('author');
      if (!log.recipients || log.recipients.length === 0) fields.push('recipients');
      if (!log.privilegeType) fields.push('privilegeType');
      if (!log.description || log.description.length < 20) fields.push('description');
      if (!log.basisForClaim) fields.push('basisForClaim');

      if (fields.length > 0) {
        missingFields.push({ entryId: log.id, fields });
        issues.push(`Entry ${log.documentIdentifier} is missing: ${fields.join(', ')}`);
      }
    }

    return {
      complete: issues.length === 0,
      issues,
      missingFields,
    };
  } catch (error) {
    throw new InternalServerErrorException('Failed to validate privilege log completeness');
  }
}

/**
 * Function 13: Group Privilege Log by Type
 * Organizes privilege log entries by privilege type
 */
export async function groupPrivilegeLogByType(
  matterId: string
): Promise<Map<PrivilegeType, PrivilegeLog[]>> {
  try {
    const logs = await PrivilegeLog.findAll({
      where: { matterId },
      order: [['documentDate', 'DESC']],
    });

    const grouped = new Map<PrivilegeType, PrivilegeLog[]>();

    for (const log of logs) {
      if (!grouped.has(log.privilegeType)) {
        grouped.set(log.privilegeType, []);
      }
      grouped.get(log.privilegeType)!.push(log);
    }

    return grouped;
  } catch (error) {
    throw new InternalServerErrorException('Failed to group privilege log by type');
  }
}

/**
 * Function 14: Redact Privilege Log Information
 * Redacts sensitive information from privilege log
 */
export async function redactPrivilegeLogInfo(
  logId: string,
  redactionLevel: 'minimal' | 'moderate' | 'full'
): Promise<Partial<PrivilegeLog>> {
  try {
    const log = await PrivilegeLog.findByPk(logId);
    if (!log) {
      throw new NotFoundException('Privilege log entry not found');
    }

    const redacted: Partial<PrivilegeLog> = {
      id: log.id,
      documentIdentifier: log.documentIdentifier,
      privilegeType: log.privilegeType,
    };

    if (redactionLevel === 'minimal') {
      redacted.documentDate = log.documentDate;
      redacted.author = log.author.split(' ')[0] + ' [REDACTED]';
      redacted.recipients = log.recipients.map((r) => r.split(' ')[0] + ' [REDACTED]');
      redacted.description = log.description.substring(0, 50) + '... [REDACTED]';
      redacted.basisForClaim = log.basisForClaim;
    } else if (redactionLevel === 'moderate') {
      redacted.documentDate = log.documentDate;
      redacted.description = 'Communication regarding privileged matter [REDACTED]';
      redacted.basisForClaim = log.basisForClaim;
    } else {
      redacted.description = '[FULLY REDACTED - PRIVILEGED]';
    }

    return redacted;
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to redact privilege log information');
  }
}

/**
 * Function 15: Update Privilege Log Entry
 * Modifies an existing privilege log entry
 */
export async function updatePrivilegeLogEntry(
  logId: string,
  updates: Partial<PrivilegeLogEntryData>,
  transaction?: Transaction
): Promise<PrivilegeLog> {
  try {
    const log = await PrivilegeLog.findByPk(logId, { transaction });
    if (!log) {
      throw new NotFoundException('Privilege log entry not found');
    }

    await log.update(updates, { transaction });
    return log;
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to update privilege log entry');
  }
}

// ============================================================================
// CLAWBACK AND INADVERTENT DISCLOSURE FUNCTIONS (6)
// ============================================================================

/**
 * Function 16: Create Clawback Request
 * Initiates a clawback request for inadvertently disclosed document
 */
export async function createClawbackRequest(
  data: ClawbackRequestData,
  transaction?: Transaction
): Promise<ClawbackRequest> {
  try {
    const validated = ClawbackRequestSchema.parse({
      documentId: data.documentId,
      disclosureDate: data.disclosureDate,
      detectionDate: data.detectionDate,
      recipientParty: data.recipientParty,
      disclosureSeverity: data.severity,
      requestedAction: data.requestedAction,
      legalBasis: data.legalBasis,
      deadlineDate: data.deadlineDate,
    });

    const request = await ClawbackRequest.create(
      {
        documentId: validated.documentId,
        disclosureDate: validated.disclosureDate,
        detectionDate: validated.detectionDate,
        recipientParty: validated.recipientParty,
        severity: validated.disclosureSeverity,
        status: ClawbackStatus.DETECTED,
        requestedAction: validated.requestedAction,
        legalBasis: validated.legalBasis,
        deadlineDate: validated.deadlineDate,
        notes: data.notes,
      },
      { transaction }
    );

    return request;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }
    throw new InternalServerErrorException('Failed to create clawback request');
  }
}

/**
 * Function 17: Process Inadvertent Disclosure
 * Handles discovery of inadvertent privileged disclosure
 */
export async function processInadvertentDisclosure(
  documentId: string,
  disclosureDetails: {
    disclosureDate: Date;
    recipientParty: string;
    disclosureMethod: string;
    discoveredBy: string;
  },
  transaction?: Transaction
): Promise<{
  clawbackRequest: ClawbackRequest;
  severity: DisclosureSeverity;
  recommendedActions: string[];
}> {
  try {
    // Determine severity based on privilege tags
    const tags = await getPrivilegeTagsByDocument(documentId);

    let severity: DisclosureSeverity = DisclosureSeverity.LOW;
    const recommendedActions: string[] = [];

    if (tags.length === 0) {
      severity = DisclosureSeverity.LOW;
      recommendedActions.push('Verify if document is actually privileged');
    } else {
      const hasAttorneyClient = tags.some(
        (t) => t.privilegeType === PrivilegeType.ATTORNEY_CLIENT
      );
      const hasWorkProduct = tags.some(
        (t) => t.privilegeType === PrivilegeType.WORK_PRODUCT
      );

      if (hasAttorneyClient) {
        severity = DisclosureSeverity.CRITICAL;
        recommendedActions.push('Immediate clawback notice required');
        recommendedActions.push('Notify senior counsel and client');
        recommendedActions.push('Document preservation notice to recipient');
      } else if (hasWorkProduct) {
        severity = DisclosureSeverity.HIGH;
        recommendedActions.push('Send clawback notice within 48 hours');
        recommendedActions.push('Assess potential waiver implications');
      } else {
        severity = DisclosureSeverity.MEDIUM;
        recommendedActions.push('Review disclosure with counsel');
      }
    }

    recommendedActions.push('Update privilege log with disclosure notation');
    recommendedActions.push('Create audit trail of disclosure and response');

    // Create clawback request
    const clawbackRequest = await createClawbackRequest(
      {
        documentId,
        disclosureDate: disclosureDetails.disclosureDate,
        detectionDate: new Date(),
        recipientParty: disclosureDetails.recipientParty,
        severity,
        requestedAction: severity === DisclosureSeverity.CRITICAL ? 'both' : 'return',
        legalBasis: tags.length > 0 ? tags[0].assertionReason : 'Privileged communication',
        deadlineDate: addDays(new Date(), severity === DisclosureSeverity.CRITICAL ? 2 : 5),
        notes: `Discovered by ${disclosureDetails.discoveredBy} via ${disclosureDetails.disclosureMethod}`,
      },
      transaction
    );

    return {
      clawbackRequest,
      severity,
      recommendedActions,
    };
  } catch (error) {
    throw new InternalServerErrorException('Failed to process inadvertent disclosure');
  }
}

/**
 * Function 18: Validate Clawback Timeliness
 * Checks if clawback request was made within reasonable time
 */
export async function validateClawbackTimeliness(
  requestId: string
): Promise<{ timely: boolean; daysElapsed: number; assessment: string }> {
  try {
    const request = await ClawbackRequest.findByPk(requestId);
    if (!request) {
      throw new NotFoundException('Clawback request not found');
    }

    const daysElapsed = differenceInDays(request.detectionDate, request.disclosureDate);
    const noticeDelay = request.noticeSentDate
      ? differenceInDays(request.noticeSentDate, request.detectionDate)
      : null;

    let timely = true;
    let assessment = '';

    // FRE 502(b) factors: promptness of measures taken
    if (daysElapsed > 30) {
      timely = false;
      assessment = 'Significant delay between disclosure and detection may impact waiver analysis';
    } else if (daysElapsed > 7) {
      assessment = 'Moderate delay - should document reasons for detection timeline';
    } else {
      assessment = 'Timely detection of inadvertent disclosure';
    }

    if (noticeDelay !== null) {
      if (noticeDelay > 5) {
        timely = false;
        assessment += '. Delay in sending notice may suggest lack of reasonable measures to prevent disclosure';
      } else if (noticeDelay > 2) {
        assessment += '. Notice sent with moderate delay - document reasons';
      } else {
        assessment += '. Prompt notice sent after detection';
      }
    }

    return {
      timely,
      daysElapsed,
      assessment,
    };
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to validate clawback timeliness');
  }
}

/**
 * Function 19: Generate Clawback Notice
 * Creates formal clawback notice letter
 */
export async function generateClawbackNotice(
  requestId: string,
  additionalTerms?: string[]
): Promise<string> {
  try {
    const request = await ClawbackRequest.findByPk(requestId);
    if (!request) {
      throw new NotFoundException('Clawback request not found');
    }

    const noticeDate = format(new Date(), 'MMMM dd, yyyy');
    const deadline = request.deadlineDate
      ? format(new Date(request.deadlineDate), 'MMMM dd, yyyy')
      : format(addDays(new Date(), 5), 'MMMM dd, yyyy');

    let notice = `
RE: Notice of Inadvertent Production and Request for Return/Destruction of Privileged Materials

Date: ${noticeDate}

To: ${request.recipientParty}

Dear Counsel:

This letter serves as formal notice that privileged and confidential materials were inadvertently
disclosed to your office on or about ${format(new Date(request.disclosureDate), 'MMMM dd, yyyy')}.

IDENTIFICATION OF MATERIALS:
Document ID: ${request.documentId}

LEGAL BASIS:
${request.legalBasis}

The disclosure of these materials was inadvertent and does not constitute a waiver of the attorney-client
privilege, work product protection, or any other applicable privilege. We took reasonable steps to prevent
disclosure and are taking prompt action to rectify this inadvertent production.

Pursuant to Federal Rule of Evidence 502(b) and applicable state law, we hereby request that you:
`;

    if (request.requestedAction === 'return' || request.requestedAction === 'both') {
      notice += `\n1. Immediately return all copies of the privileged materials to our office;`;
    }
    if (request.requestedAction === 'destroy' || request.requestedAction === 'both') {
      notice += `\n2. Destroy all copies of the privileged materials in your possession;`;
    }

    notice += `
3. Confirm in writing that you have not reviewed, used, or disclosed the contents of these materials;
4. Confirm that no copies have been made or retained in any form;
5. Take all necessary steps to ensure the privileged materials are not used or disclosed.

Please provide written confirmation of your compliance with this request by ${deadline}.
`;

    if (additionalTerms && additionalTerms.length > 0) {
      notice += `\nADDITIONAL TERMS:\n${additionalTerms.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n`;
    }

    notice += `
We reserve all rights with respect to these privileged materials and this inadvertent disclosure does
not constitute a waiver of any privilege or protection.

Please contact us immediately if you have any questions regarding this matter.

Sincerely,
[Counsel Name]
`;

    return notice;
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to generate clawback notice');
  }
}

/**
 * Function 20: Track Clawback Compliance
 * Monitors recipient compliance with clawback request
 */
export async function trackClawbackCompliance(
  requestId: string,
  transaction?: Transaction
): Promise<{
  status: ClawbackStatus;
  compliant: boolean;
  overdue: boolean;
  daysUntilDeadline: number;
  followUpActions: string[];
}> {
  try {
    const request = await ClawbackRequest.findByPk(requestId, { transaction });
    if (!request) {
      throw new NotFoundException('Clawback request not found');
    }

    const now = new Date();
    const daysUntilDeadline = request.deadlineDate
      ? differenceInDays(request.deadlineDate, now)
      : 0;
    const overdue = daysUntilDeadline < 0;

    const compliant =
      request.status === ClawbackStatus.DOCUMENTS_RETURNED ||
      request.status === ClawbackStatus.DOCUMENTS_DESTROYED ||
      request.status === ClawbackStatus.RESOLVED;

    const followUpActions: string[] = [];

    if (!compliant && overdue) {
      followUpActions.push('Send follow-up notice immediately');
      followUpActions.push('Consider motion to compel return of privileged materials');
      followUpActions.push('Escalate to senior counsel');
    } else if (!compliant && daysUntilDeadline <= 2) {
      followUpActions.push('Send reminder notice');
      followUpActions.push('Prepare for potential motion practice');
    } else if (request.status === ClawbackStatus.REFUSED) {
      followUpActions.push('Evaluate motion for protective order');
      followUpActions.push('Document waiver analysis under FRE 502');
    }

    if (request.status === ClawbackStatus.RECIPIENT_ACKNOWLEDGED) {
      followUpActions.push('Request confirmation of return/destruction');
    }

    return {
      status: request.status,
      compliant,
      overdue,
      daysUntilDeadline,
      followUpActions,
    };
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to track clawback compliance');
  }
}

/**
 * Function 21: Close Clawback Request
 * Finalizes clawback request after resolution
 */
export async function closeClawbackRequest(
  requestId: string,
  resolution: {
    status: ClawbackStatus;
    recipientResponse?: string;
    complianceDate?: Date;
    notes?: string;
  },
  transaction?: Transaction
): Promise<ClawbackRequest> {
  try {
    const request = await ClawbackRequest.findByPk(requestId, { transaction });
    if (!request) {
      throw new NotFoundException('Clawback request not found');
    }

    await request.update(
      {
        status: resolution.status,
        recipientResponse: resolution.recipientResponse,
        complianceDate: resolution.complianceDate || new Date(),
        responseDate: new Date(),
        notes: resolution.notes
          ? `${request.notes || ''}\n[RESOLVED ${new Date().toISOString()}] ${resolution.notes}`
          : request.notes,
      },
      { transaction }
    );

    return request;
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to close clawback request');
  }
}

// ============================================================================
// PRIVILEGE ASSERTION WORKFLOW FUNCTIONS (8)
// ============================================================================

/**
 * Function 22: Initiate Privilege Assertion
 * Starts formal privilege assertion process
 */
export async function initiatePrivilegeAssertion(
  data: PrivilegeAssertionData,
  transaction?: Transaction
): Promise<PrivilegeAssertion> {
  try {
    const validated = PrivilegeAssertionSchema.parse({
      documentId: data.privilegeTagId,
      privilegeType: PrivilegeType.ATTORNEY_CLIENT,
      assertedBy: data.assertedBy,
      assertionDate: data.assertionDate,
      rationale: data.rationale,
      supportingAuthority: data.supportingAuthority,
      status: PrivilegeAssertionStatus.PENDING_REVIEW,
    });

    const assertion = await PrivilegeAssertion.create(
      {
        privilegeTagId: data.privilegeTagId,
        assertedBy: data.assertedBy,
        assertionDate: data.assertionDate,
        rationale: data.rationale,
        supportingAuthority: data.supportingAuthority,
        status: PrivilegeAssertionStatus.PENDING_REVIEW,
        metadata: data.metadata,
      },
      { transaction }
    );

    // Update privilege tag status
    await PrivilegeTag.update(
      { assertionStatus: PrivilegeAssertionStatus.ASSERTED },
      { where: { id: data.privilegeTagId }, transaction }
    );

    return assertion;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }
    throw new InternalServerErrorException('Failed to initiate privilege assertion');
  }
}

/**
 * Function 23: Assign Privilege Reviewer
 * Assigns reviewer to privilege assertion
 */
export async function assignPrivilegeReviewer(
  assertionId: string,
  reviewerId: string,
  transaction?: Transaction
): Promise<PrivilegeAssertion> {
  try {
    const assertion = await PrivilegeAssertion.findByPk(assertionId, { transaction });
    if (!assertion) {
      throw new NotFoundException('Privilege assertion not found');
    }

    await assertion.update(
      {
        status: PrivilegeAssertionStatus.UNDER_REVIEW,
        metadata: {
          ...assertion.metadata,
          assignedReviewer: reviewerId,
          assignedAt: new Date(),
        },
      },
      { transaction }
    );

    return assertion;
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to assign privilege reviewer');
  }
}

/**
 * Function 24: Submit Privilege Challenge
 * Challenges an asserted privilege claim
 */
export async function submitPrivilegeChallenge(
  assertionId: string,
  challengeData: {
    challengedBy: string;
    challengeReason: string;
    supportingArguments?: string;
  },
  transaction?: Transaction
): Promise<PrivilegeAssertion> {
  try {
    const assertion = await PrivilegeAssertion.findByPk(assertionId, { transaction });
    if (!assertion) {
      throw new NotFoundException('Privilege assertion not found');
    }

    if (challengeData.challengeReason.length < 50) {
      throw new BadRequestException('Challenge reason must be at least 50 characters');
    }

    await assertion.update(
      {
        status: PrivilegeAssertionStatus.CHALLENGED,
        challengedBy: challengeData.challengedBy,
        challengeReason: challengeData.challengeReason,
        challengeDate: new Date(),
        metadata: {
          ...assertion.metadata,
          supportingArguments: challengeData.supportingArguments,
        },
      },
      { transaction }
    );

    // Update privilege tag status
    await PrivilegeTag.update(
      { assertionStatus: PrivilegeAssertionStatus.CHALLENGED },
      { where: { id: assertion.privilegeTagId }, transaction }
    );

    return assertion;
  } catch (error) {
    if (error instanceof NotFoundException || error instanceof BadRequestException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to submit privilege challenge');
  }
}

/**
 * Function 25: Resolve Privilege Dispute
 * Resolves disputed privilege assertion
 */
export async function resolvePrivilegeDispute(
  assertionId: string,
  resolution: {
    resolvedBy: string;
    decision: 'upheld' | 'overruled' | 'modified';
    resolutionDetails: string;
    modifiedPrivilegeType?: PrivilegeType;
  },
  transaction?: Transaction
): Promise<PrivilegeAssertion> {
  try {
    const assertion = await PrivilegeAssertion.findByPk(assertionId, {
      include: [PrivilegeTag],
      transaction,
    });
    if (!assertion) {
      throw new NotFoundException('Privilege assertion not found');
    }

    const newStatus =
      resolution.decision === 'upheld'
        ? PrivilegeAssertionStatus.UPHELD
        : resolution.decision === 'overruled'
        ? PrivilegeAssertionStatus.OVERRULED
        : PrivilegeAssertionStatus.RESOLVED;

    await assertion.update(
      {
        status: newStatus,
        resolvedBy: resolution.resolvedBy,
        resolution: resolution.resolutionDetails,
        resolutionDate: new Date(),
      },
      { transaction }
    );

    // Update privilege tag
    if (resolution.decision === 'overruled') {
      await PrivilegeTag.update(
        { assertionStatus: PrivilegeAssertionStatus.OVERRULED },
        { where: { id: assertion.privilegeTagId }, transaction }
      );
    } else if (resolution.decision === 'upheld') {
      await PrivilegeTag.update(
        { assertionStatus: PrivilegeAssertionStatus.UPHELD },
        { where: { id: assertion.privilegeTagId }, transaction }
      );
    } else if (resolution.modifiedPrivilegeType) {
      await PrivilegeTag.update(
        {
          privilegeType: resolution.modifiedPrivilegeType,
          assertionStatus: PrivilegeAssertionStatus.RESOLVED,
        },
        { where: { id: assertion.privilegeTagId }, transaction }
      );
    }

    return assertion;
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to resolve privilege dispute');
  }
}

/**
 * Function 26: Escalate Privilege Issue
 * Escalates privilege assertion to senior counsel
 */
export async function escalatePrivilegeIssue(
  assertionId: string,
  escalationData: {
    escalatedBy: string;
    escalatedTo: string;
    reason: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
  },
  transaction?: Transaction
): Promise<PrivilegeAssertion> {
  try {
    const assertion = await PrivilegeAssertion.findByPk(assertionId, { transaction });
    if (!assertion) {
      throw new NotFoundException('Privilege assertion not found');
    }

    await assertion.update(
      {
        status: PrivilegeAssertionStatus.DISPUTED,
        metadata: {
          ...assertion.metadata,
          escalated: true,
          escalatedBy: escalationData.escalatedBy,
          escalatedTo: escalationData.escalatedTo,
          escalationReason: escalationData.reason,
          escalationUrgency: escalationData.urgency,
          escalatedAt: new Date(),
        },
      },
      { transaction }
    );

    return assertion;
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to escalate privilege issue');
  }
}

/**
 * Function 27: Document Assertion Rationale
 * Adds detailed rationale to privilege assertion
 */
export async function documentAssertionRationale(
  assertionId: string,
  additionalRationale: {
    legalAnalysis: string;
    factualBasis: string;
    caseAuthority?: string[];
    riskAssessment?: string;
  },
  transaction?: Transaction
): Promise<PrivilegeAssertion> {
  try {
    const assertion = await PrivilegeAssertion.findByPk(assertionId, { transaction });
    if (!assertion) {
      throw new NotFoundException('Privilege assertion not found');
    }

    const enhancedRationale = `
${assertion.rationale}

LEGAL ANALYSIS:
${additionalRationale.legalAnalysis}

FACTUAL BASIS:
${additionalRationale.factualBasis}

${additionalRationale.caseAuthority ? `CASE AUTHORITY:\n${additionalRationale.caseAuthority.join('\n')}` : ''}

${additionalRationale.riskAssessment ? `RISK ASSESSMENT:\n${additionalRationale.riskAssessment}` : ''}
`;

    await assertion.update(
      {
        rationale: enhancedRationale.trim(),
        supportingAuthority: additionalRationale.caseAuthority?.join('; ') || assertion.supportingAuthority,
      },
      { transaction }
    );

    return assertion;
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to document assertion rationale');
  }
}

/**
 * Function 28: Track Assertion Status
 * Monitors privilege assertion workflow status
 */
export async function trackAssertionStatus(
  assertionId: string
): Promise<{
  assertion: PrivilegeAssertion;
  timeline: Array<{ event: string; date: Date; actor?: string }>;
  nextSteps: string[];
}> {
  try {
    const assertion = await PrivilegeAssertion.findByPk(assertionId, {
      include: [PrivilegeTag],
    });
    if (!assertion) {
      throw new NotFoundException('Privilege assertion not found');
    }

    const timeline: Array<{ event: string; date: Date; actor?: string }> = [
      { event: 'Assertion Created', date: assertion.createdAt, actor: assertion.assertedBy },
    ];

    if (assertion.assertionDate) {
      timeline.push({ event: 'Privilege Asserted', date: assertion.assertionDate, actor: assertion.assertedBy });
    }

    if (assertion.challengeDate) {
      timeline.push({ event: 'Assertion Challenged', date: assertion.challengeDate, actor: assertion.challengedBy });
    }

    if (assertion.resolutionDate) {
      timeline.push({ event: 'Dispute Resolved', date: assertion.resolutionDate, actor: assertion.resolvedBy });
    }

    const nextSteps: string[] = [];

    switch (assertion.status) {
      case PrivilegeAssertionStatus.PENDING_REVIEW:
        nextSteps.push('Assign reviewer');
        nextSteps.push('Complete initial privilege review');
        break;
      case PrivilegeAssertionStatus.UNDER_REVIEW:
        nextSteps.push('Complete privilege analysis');
        nextSteps.push('Document rationale');
        nextSteps.push('Make assertion determination');
        break;
      case PrivilegeAssertionStatus.CHALLENGED:
        nextSteps.push('Review challenge arguments');
        nextSteps.push('Prepare response');
        nextSteps.push('Escalate if necessary');
        break;
      case PrivilegeAssertionStatus.DISPUTED:
        nextSteps.push('Senior counsel review');
        nextSteps.push('Resolve dispute');
        break;
      case PrivilegeAssertionStatus.UPHELD:
      case PrivilegeAssertionStatus.RESOLVED:
        nextSteps.push('Update privilege log');
        nextSteps.push('Close assertion workflow');
        break;
      case PrivilegeAssertionStatus.OVERRULED:
        nextSteps.push('Remove privilege tag');
        nextSteps.push('Produce document if required');
        break;
    }

    return {
      assertion,
      timeline: timeline.sort((a, b) => a.date.getTime() - b.date.getTime()),
      nextSteps,
    };
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to track assertion status');
  }
}

/**
 * Function 29: Finalize Privilege Assertion
 * Completes privilege assertion workflow
 */
export async function finalizePrivilegeAssertion(
  assertionId: string,
  finalDecision: {
    status: PrivilegeAssertionStatus;
    finalNotes?: string;
  },
  transaction?: Transaction
): Promise<PrivilegeAssertion> {
  try {
    const assertion = await PrivilegeAssertion.findByPk(assertionId, { transaction });
    if (!assertion) {
      throw new NotFoundException('Privilege assertion not found');
    }

    await assertion.update(
      {
        status: finalDecision.status,
        metadata: {
          ...assertion.metadata,
          finalizedAt: new Date(),
          finalNotes: finalDecision.finalNotes,
        },
      },
      { transaction }
    );

    // Update privilege tag with final status
    await PrivilegeTag.update(
      { assertionStatus: finalDecision.status },
      { where: { id: assertion.privilegeTagId }, transaction }
    );

    return assertion;
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to finalize privilege assertion');
  }
}

// ============================================================================
// QUALITY CONTROL FUNCTIONS (6)
// ============================================================================

/**
 * Function 30: Perform Quality Control Sample
 * Conducts QC sampling of privilege review
 */
export async function performQualityControlSample(
  reviewBatchId: string,
  sampleSize: number,
  reviewerId: string
): Promise<{
  sampleTags: PrivilegeTag[];
  reviewInstructions: string[];
}> {
  try {
    // Get all tags from batch
    const allTags = await PrivilegeTag.findAll({
      where: {
        metadata: {
          reviewBatchId,
        } as any,
      },
    });

    if (allTags.length === 0) {
      throw new NotFoundException('No tags found for review batch');
    }

    // Random sampling
    const shuffled = allTags.sort(() => 0.5 - Math.random());
    const sampleTags = shuffled.slice(0, Math.min(sampleSize, allTags.length));

    const reviewInstructions = [
      'Verify privilege type is correctly identified',
      'Confirm privilege basis is appropriate and well-documented',
      'Check assertion reason provides sufficient detail (minimum 50 characters)',
      'Validate confidentiality level matches privilege type',
      'Ensure all required fields are complete',
      'Look for consistency with similar documents',
      'Flag any questionable privilege claims',
      'Document any recommended changes',
    ];

    return {
      sampleTags,
      reviewInstructions,
    };
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to perform QC sample');
  }
}

/**
 * Function 31: Validate Privilege Consistency
 * Checks for consistent privilege tagging across similar documents
 */
export async function validatePrivilegeConsistency(
  documentIds: string[]
): Promise<{
  consistent: boolean;
  inconsistencies: Array<{ documentId: string; issue: string; recommendation: string }>;
  consistencyScore: number;
}> {
  try {
    const inconsistencies: Array<{ documentId: string; issue: string; recommendation: string }> = [];

    // Get all tags for documents
    const tags = await PrivilegeTag.findAll({
      where: {
        documentId: { [Op.in]: documentIds },
      },
    });

    // Group by document
    const tagsByDocument = new Map<string, PrivilegeTag[]>();
    for (const tag of tags) {
      if (!tagsByDocument.has(tag.documentId)) {
        tagsByDocument.set(tag.documentId, []);
      }
      tagsByDocument.get(tag.documentId)!.push(tag);
    }

    // Check for documents with multiple conflicting tags
    for (const [documentId, docTags] of tagsByDocument.entries()) {
      if (docTags.length > 1) {
        const privilegeTypes = new Set(docTags.map((t) => t.privilegeType));
        if (privilegeTypes.size > 1) {
          inconsistencies.push({
            documentId,
            issue: `Multiple privilege types assigned: ${Array.from(privilegeTypes).join(', ')}`,
            recommendation: 'Review and select primary privilege type',
          });
        }

        const confidentialityLevels = new Set(docTags.map((t) => t.confidentialityLevel));
        if (confidentialityLevels.size > 1) {
          inconsistencies.push({
            documentId,
            issue: `Inconsistent confidentiality levels: ${Array.from(confidentialityLevels).join(', ')}`,
            recommendation: 'Standardize confidentiality level',
          });
        }
      }
    }

    // Check for documents without tags
    for (const documentId of documentIds) {
      if (!tagsByDocument.has(documentId)) {
        inconsistencies.push({
          documentId,
          issue: 'No privilege tag found',
          recommendation: 'Review document and add appropriate privilege tag',
        });
      }
    }

    const consistencyScore = Math.max(
      0,
      100 - (inconsistencies.length / documentIds.length) * 100
    );

    return {
      consistent: inconsistencies.length === 0,
      inconsistencies,
      consistencyScore: Math.round(consistencyScore),
    };
  } catch (error) {
    throw new InternalServerErrorException('Failed to validate privilege consistency');
  }
}

/**
 * Function 32: Identify Privilege Gaps
 * Finds documents that may be missing privilege tags
 */
export async function identifyPrivilegeGaps(
  documentIds: string[],
  criteria: {
    authorPattern?: RegExp;
    recipientPattern?: RegExp;
    subjectPattern?: RegExp;
    dateRange?: { from: Date; to: Date };
  }
): Promise<{
  potentialGaps: Array<{ documentId: string; reason: string; confidence: number }>;
  reviewRecommendations: string[];
}> {
  try {
    const potentialGaps: Array<{ documentId: string; reason: string; confidence: number }> = [];

    // Get existing tags
    const existingTags = await PrivilegeTag.findAll({
      where: {
        documentId: { [Op.in]: documentIds },
      },
    });

    const taggedDocuments = new Set(existingTags.map((t) => t.documentId));

    // Identify untagged documents
    for (const documentId of documentIds) {
      if (!taggedDocuments.has(documentId)) {
        // In a real implementation, you would fetch document metadata
        // and apply pattern matching based on criteria
        potentialGaps.push({
          documentId,
          reason: 'Document not tagged - may require privilege review',
          confidence: 50,
        });
      }
    }

    const reviewRecommendations = [
      'Review documents with attorney involvement',
      'Check for legal advice or strategy discussions',
      'Identify documents created in anticipation of litigation',
      'Flag communications with counsel',
      'Review documents with "Privileged" or "Confidential" markings',
    ];

    return {
      potentialGaps,
      reviewRecommendations,
    };
  } catch (error) {
    throw new InternalServerErrorException('Failed to identify privilege gaps');
  }
}

/**
 * Function 33: Generate QC Metrics
 * Creates quality control metrics report
 */
export async function generateQCMetrics(
  reviewBatchId: string,
  qcResults: {
    reviewedTags: string[];
    errors: Array<{ tagId: string; errorType: string; severity: 'low' | 'medium' | 'high' }>;
    corrections: number;
  }
): Promise<QualityControlMetrics> {
  try {
    const allTags = await PrivilegeTag.findAll({
      where: {
        metadata: {
          reviewBatchId,
        } as any,
      },
    });

    const reviewedCount = qcResults.reviewedTags.length;
    const errorsFound = qcResults.errors.length;

    const accuracyRate = reviewedCount > 0
      ? ((reviewedCount - errorsFound) / reviewedCount) * 100
      : 100;

    // Check for missing required tags
    const missingTags = allTags.filter(
      (tag) => !tag.assertionReason || tag.assertionReason.length < 20
    ).length;

    // Check for inconsistent tags
    const inconsistentTags = qcResults.errors.filter(
      (e) => e.errorType === 'inconsistency'
    ).length;

    const totalIssues = errorsFound + missingTags + inconsistentTags;
    const consistencyRate = allTags.length > 0
      ? ((allTags.length - totalIssues) / allTags.length) * 100
      : 100;

    const recommendations = qcResults.errors
      .filter((e) => e.severity === 'high')
      .length;

    return {
      totalReviewed: reviewedCount,
      accuracyRate: Math.round(accuracyRate * 100) / 100,
      consistencyRate: Math.round(consistencyRate * 100) / 100,
      errorsFound,
      missingTags,
      inconsistentTags,
      recommendationsCount: recommendations,
    };
  } catch (error) {
    throw new InternalServerErrorException('Failed to generate QC metrics');
  }
}

/**
 * Function 34: Flag Inconsistent Privilege
 * Flags privilege tags that appear inconsistent
 */
export async function flagInconsistentPrivilege(
  tagId: string,
  inconsistencyDetails: {
    flaggedBy: string;
    issueType: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    suggestedCorrection?: string;
  },
  transaction?: Transaction
): Promise<PrivilegeTag> {
  try {
    const tag = await PrivilegeTag.findByPk(tagId, { transaction });
    if (!tag) {
      throw new NotFoundException('Privilege tag not found');
    }

    await tag.update(
      {
        metadata: {
          ...tag.metadata,
          qcFlag: {
            flagged: true,
            flaggedBy: inconsistencyDetails.flaggedBy,
            flaggedAt: new Date(),
            issueType: inconsistencyDetails.issueType,
            description: inconsistencyDetails.description,
            severity: inconsistencyDetails.severity,
            suggestedCorrection: inconsistencyDetails.suggestedCorrection,
          },
        },
      },
      { transaction }
    );

    return tag;
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to flag inconsistent privilege');
  }
}

/**
 * Function 35: Review Privilege Accuracy
 * Conducts accuracy review of privilege determinations
 */
export async function reviewPrivilegeAccuracy(
  tagIds: string[],
  reviewerId: string
): Promise<{
  accurate: number;
  inaccurate: number;
  needsReview: number;
  accuracyRate: number;
  issues: Array<{ tagId: string; issue: string; recommendation: string }>;
}> {
  try {
    let accurate = 0;
    let inaccurate = 0;
    let needsReview = 0;
    const issues: Array<{ tagId: string; issue: string; recommendation: string }> = [];

    for (const tagId of tagIds) {
      const result = await validatePrivilegeClaim(tagId);

      if (result.valid) {
        accurate++;
      } else if (result.issues.length > 2) {
        inaccurate++;
        issues.push({
          tagId,
          issue: result.issues.join('; '),
          recommendation: result.recommendations.join('; '),
        });
      } else {
        needsReview++;
        issues.push({
          tagId,
          issue: result.issues.join('; '),
          recommendation: result.recommendations.join('; '),
        });
      }
    }

    const totalReviewed = tagIds.length;
    const accuracyRate = totalReviewed > 0
      ? (accurate / totalReviewed) * 100
      : 0;

    return {
      accurate,
      inaccurate,
      needsReview,
      accuracyRate: Math.round(accuracyRate * 100) / 100,
      issues,
    };
  } catch (error) {
    throw new InternalServerErrorException('Failed to review privilege accuracy');
  }
}

// ============================================================================
// ADDITIONAL UTILITY FUNCTIONS (7)
// ============================================================================

/**
 * Function 36: Generate Privilege Statistics
 * Creates statistical overview of privilege review
 */
export async function generatePrivilegeStatistics(
  matterId?: string,
  dateRange?: { from: Date; to: Date }
): Promise<{
  totalPrivilegedDocuments: number;
  byPrivilegeType: Record<PrivilegeType, number>;
  byConfidentialityLevel: Record<ConfidentialityLevel, number>;
  byStatus: Record<PrivilegeAssertionStatus, number>;
  totalClawbacks: number;
  activeClawbacks: number;
}> {
  try {
    const where: WhereOptions = {};

    if (dateRange) {
      where['createdAt'] = {
        [Op.gte]: dateRange.from,
        [Op.lte]: dateRange.to,
      };
    }

    const tags = matterId
      ? await PrivilegeTag.findAll({ where })
      : await PrivilegeTag.findAll({ where });

    const byPrivilegeType = {} as Record<PrivilegeType, number>;
    const byConfidentialityLevel = {} as Record<ConfidentialityLevel, number>;
    const byStatus = {} as Record<PrivilegeAssertionStatus, number>;

    for (const tag of tags) {
      byPrivilegeType[tag.privilegeType] = (byPrivilegeType[tag.privilegeType] || 0) + 1;
      byConfidentialityLevel[tag.confidentialityLevel] =
        (byConfidentialityLevel[tag.confidentialityLevel] || 0) + 1;
      byStatus[tag.assertionStatus] = (byStatus[tag.assertionStatus] || 0) + 1;
    }

    const clawbackWhere: WhereOptions = {};
    if (dateRange) {
      clawbackWhere['createdAt'] = {
        [Op.gte]: dateRange.from,
        [Op.lte]: dateRange.to,
      };
    }

    const totalClawbacks = await ClawbackRequest.count({ where: clawbackWhere });
    const activeClawbacks = await ClawbackRequest.count({
      where: {
        ...clawbackWhere,
        status: {
          [Op.in]: [
            ClawbackStatus.DETECTED,
            ClawbackStatus.REQUEST_INITIATED,
            ClawbackStatus.NOTICE_SENT,
            ClawbackStatus.RECIPIENT_ACKNOWLEDGED,
          ],
        },
      },
    });

    return {
      totalPrivilegedDocuments: tags.length,
      byPrivilegeType,
      byConfidentialityLevel,
      byStatus,
      totalClawbacks,
      activeClawbacks,
    };
  } catch (error) {
    throw new InternalServerErrorException('Failed to generate privilege statistics');
  }
}

/**
 * Function 37: Export Privilege Review Data
 * Exports comprehensive privilege review data
 */
export async function exportPrivilegeReviewData(
  matterId: string,
  format: 'json' | 'csv' | 'excel' = 'json'
): Promise<string | Buffer> {
  try {
    const tags = await PrivilegeTag.findAll({
      where: {
        metadata: {
          matterId,
        } as any,
      },
      include: [
        {
          model: PrivilegeAssertion,
          as: 'assertions',
        },
      ],
    });

    if (format === 'json') {
      return JSON.stringify(tags, null, 2);
    }

    // CSV format
    let csv = 'Document ID,Privilege Type,Privilege Basis,Assertion Reason,Confidentiality Level,Status,Date Asserted\n';
    for (const tag of tags) {
      csv += `"${tag.documentId}","${tag.privilegeType}","${tag.privilegeBasis}","${tag.assertionReason}","${tag.confidentialityLevel}","${tag.assertionStatus}","${tag.dateAsserted ? format(new Date(tag.dateAsserted), 'yyyy-MM-dd') : ''}"\n`;
    }

    return csv;
  } catch (error) {
    throw new InternalServerErrorException('Failed to export privilege review data');
  }
}

/**
 * Function 38: Calculate Privilege Review Progress
 * Calculates review completion percentage
 */
export async function calculatePrivilegeReviewProgress(
  reviewBatchId: string
): Promise<{
  totalDocuments: number;
  reviewedDocuments: number;
  privilegedDocuments: number;
  nonPrivilegedDocuments: number;
  pendingReview: number;
  completionPercentage: number;
}> {
  try {
    const allTags = await PrivilegeTag.findAll({
      where: {
        metadata: {
          reviewBatchId,
        } as any,
      },
    });

    const reviewed = allTags.filter(
      (tag) =>
        tag.assertionStatus !== PrivilegeAssertionStatus.PENDING_REVIEW &&
        tag.assertionStatus !== PrivilegeAssertionStatus.UNDER_REVIEW
    );

    const privileged = allTags.filter(
      (tag) =>
        tag.assertionStatus === PrivilegeAssertionStatus.ASSERTED ||
        tag.assertionStatus === PrivilegeAssertionStatus.UPHELD
    );

    const pending = allTags.filter(
      (tag) =>
        tag.assertionStatus === PrivilegeAssertionStatus.PENDING_REVIEW ||
        tag.assertionStatus === PrivilegeAssertionStatus.UNDER_REVIEW
    );

    const totalDocuments = allTags.length;
    const completionPercentage =
      totalDocuments > 0 ? (reviewed.length / totalDocuments) * 100 : 0;

    return {
      totalDocuments,
      reviewedDocuments: reviewed.length,
      privilegedDocuments: privileged.length,
      nonPrivilegedDocuments: reviewed.length - privileged.length,
      pendingReview: pending.length,
      completionPercentage: Math.round(completionPercentage * 100) / 100,
    };
  } catch (error) {
    throw new InternalServerErrorException('Failed to calculate privilege review progress');
  }
}

/**
 * Function 39: Detect Privilege Waiver Risks
 * Identifies potential privilege waiver scenarios
 */
export async function detectPrivilegeWaiverRisks(
  documentId: string
): Promise<{
  waiverRisks: Array<{ risk: string; severity: 'low' | 'medium' | 'high'; mitigation: string }>;
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
}> {
  try {
    const tags = await getPrivilegeTagsByDocument(documentId);
    const clawbacks = await ClawbackRequest.findAll({ where: { documentId } });

    const waiverRisks: Array<{ risk: string; severity: 'low' | 'medium' | 'high'; mitigation: string }> = [];

    // Check for inadvertent disclosure
    if (clawbacks.length > 0) {
      const unresolvedClawbacks = clawbacks.filter(
        (c) =>
          c.status !== ClawbackStatus.DOCUMENTS_RETURNED &&
          c.status !== ClawbackStatus.DOCUMENTS_DESTROYED &&
          c.status !== ClawbackStatus.RESOLVED
      );

      if (unresolvedClawbacks.length > 0) {
        waiverRisks.push({
          risk: 'Inadvertent disclosure with unresolved clawback',
          severity: 'high',
          mitigation: 'Expedite clawback resolution and document reasonable precautions',
        });
      }
    }

    // Check for multiple privilege types (potential inconsistency)
    if (tags.length > 1) {
      const privilegeTypes = new Set(tags.map((t) => t.privilegeType));
      if (privilegeTypes.size > 1) {
        waiverRisks.push({
          risk: 'Multiple privilege types may indicate inconsistent treatment',
          severity: 'medium',
          mitigation: 'Clarify primary privilege basis and ensure consistent application',
        });
      }
    }

    // Check for challenged assertions
    const challenged = tags.filter(
      (tag) =>
        tag.assertionStatus === PrivilegeAssertionStatus.CHALLENGED ||
        tag.assertionStatus === PrivilegeAssertionStatus.DISPUTED
    );

    if (challenged.length > 0) {
      waiverRisks.push({
        risk: 'Privilege assertion is being challenged',
        severity: 'high',
        mitigation: 'Strengthen rationale and provide additional legal authority',
      });
    }

    // Determine overall risk level
    const highRisks = waiverRisks.filter((r) => r.severity === 'high').length;
    const mediumRisks = waiverRisks.filter((r) => r.severity === 'medium').length;

    let overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (highRisks >= 2) {
      overallRiskLevel = 'critical';
    } else if (highRisks >= 1) {
      overallRiskLevel = 'high';
    } else if (mediumRisks >= 2) {
      overallRiskLevel = 'medium';
    } else {
      overallRiskLevel = 'low';
    }

    return {
      waiverRisks,
      overallRiskLevel,
    };
  } catch (error) {
    throw new InternalServerErrorException('Failed to detect privilege waiver risks');
  }
}

/**
 * Function 40: Generate Privilege Review Report
 * Creates comprehensive privilege review report
 */
export async function generatePrivilegeReviewReport(
  matterId: string,
  includeDetails: boolean = true
): Promise<{
  summary: {
    totalDocuments: number;
    privilegedCount: number;
    privilegeRate: number;
    assertionsPending: number;
    assertionsChallenged: number;
    clawbackRequests: number;
  };
  details?: {
    privilegeBreakdown: Record<PrivilegeType, number>;
    qualityMetrics: QualityControlMetrics | null;
    topIssues: string[];
  };
  recommendations: string[];
}> {
  try {
    const stats = await generatePrivilegeStatistics(matterId);

    const assertions = await PrivilegeAssertion.findAll({
      include: [
        {
          model: PrivilegeTag,
          required: true,
          where: {
            metadata: {
              matterId,
            } as any,
          },
        },
      ],
    });

    const pending = assertions.filter(
      (a) => a.status === PrivilegeAssertionStatus.PENDING_REVIEW
    ).length;

    const challenged = assertions.filter(
      (a) =>
        a.status === PrivilegeAssertionStatus.CHALLENGED ||
        a.status === PrivilegeAssertionStatus.DISPUTED
    ).length;

    const clawbacks = await ClawbackRequest.count();

    const privilegedCount = stats.totalPrivilegedDocuments;
    const totalDocuments = privilegedCount; // In real scenario, would query total doc count
    const privilegeRate = totalDocuments > 0 ? (privilegedCount / totalDocuments) * 100 : 0;

    const summary = {
      totalDocuments,
      privilegedCount,
      privilegeRate: Math.round(privilegeRate * 100) / 100,
      assertionsPending: pending,
      assertionsChallenged: challenged,
      clawbackRequests: clawbacks,
    };

    const recommendations: string[] = [];

    if (pending > 0) {
      recommendations.push(`Review and finalize ${pending} pending privilege assertions`);
    }

    if (challenged > 0) {
      recommendations.push(`Address ${challenged} challenged privilege claims`);
    }

    if (clawbacks > 0) {
      recommendations.push('Monitor active clawback requests for timely resolution');
    }

    if (privilegeRate > 50) {
      recommendations.push(
        'High privilege rate - consider second-level review to ensure appropriate assertions'
      );
    }

    if (!includeDetails) {
      return { summary, recommendations };
    }

    const details = {
      privilegeBreakdown: stats.byPrivilegeType,
      qualityMetrics: null as QualityControlMetrics | null,
      topIssues: [] as string[],
    };

    if (challenged > 0) {
      details.topIssues.push('Multiple challenged assertions requiring resolution');
    }

    return {
      summary,
      details,
      recommendations,
    };
  } catch (error) {
    throw new InternalServerErrorException('Failed to generate privilege review report');
  }
}

/**
 * Function 41: Validate FRE 502 Compliance
 * Validates compliance with Federal Rule of Evidence 502
 */
export async function validateFRE502Compliance(
  clawbackRequestId: string
): Promise<{
  compliant: boolean;
  factors: Array<{ factor: string; satisfied: boolean; notes: string }>;
  recommendation: string;
}> {
  try {
    const request = await ClawbackRequest.findByPk(clawbackRequestId);
    if (!request) {
      throw new NotFoundException('Clawback request not found');
    }

    const factors: Array<{ factor: string; satisfied: boolean; notes: string }> = [];

    // FRE 502(b) factors
    // 1. Reasonableness of precautions
    const precautionsTaken = request.metadata?.precautionsTaken || false;
    factors.push({
      factor: 'Reasonable precautions to prevent disclosure',
      satisfied: precautionsTaken,
      notes: precautionsTaken
        ? 'Document review protocols in place'
        : 'Need to document precautions taken',
    });

    // 2. Promptness of measures to rectify
    const timeliness = await validateClawbackTimeliness(clawbackRequestId);
    factors.push({
      factor: 'Promptness of rectification measures',
      satisfied: timeliness.timely,
      notes: timeliness.assessment,
    });

    // 3. Scope of disclosure
    const scopeLimited = request.metadata?.singleDocument !== false;
    factors.push({
      factor: 'Limited scope of disclosure',
      satisfied: scopeLimited,
      notes: scopeLimited ? 'Single document disclosure' : 'Multiple documents disclosed',
    });

    // 4. Extent of disclosure
    const limitedRecipients = request.recipientParty.split(',').length === 1;
    factors.push({
      factor: 'Limited extent of disclosure',
      satisfied: limitedRecipients,
      notes: limitedRecipients ? 'Single recipient' : 'Multiple recipients',
    });

    // 5. Overriding interests of justice
    factors.push({
      factor: 'No overriding interest of justice favoring waiver',
      satisfied: true,
      notes: 'Standard privilege protection applies',
    });

    const satisfiedCount = factors.filter((f) => f.satisfied).length;
    const compliant = satisfiedCount >= 4; // Majority of factors satisfied

    const recommendation = compliant
      ? 'Disclosure appears to satisfy FRE 502(b) requirements for non-waiver'
      : 'Strengthen documentation of precautions and promptness to support non-waiver argument';

    return {
      compliant,
      factors,
      recommendation,
    };
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException('Failed to validate FRE 502 compliance');
  }
}

/**
 * Function 42: Archive Completed Privilege Review
 * Archives completed privilege review with full audit trail
 */
export async function archiveCompletedPrivilegeReview(
  reviewBatchId: string,
  archiveMetadata: {
    completedBy: string;
    finalReport?: string;
    retentionPeriod?: number; // in years
  },
  transaction?: Transaction
): Promise<{
  archived: boolean;
  archiveId: string;
  archiveSummary: {
    totalDocuments: number;
    privilegedDocuments: number;
    assertions: number;
    clawbacks: number;
    archiveDate: Date;
  };
}> {
  try {
    const archiveId = crypto.randomBytes(16).toString('hex');

    // Get all data for archive
    const tags = await PrivilegeTag.findAll({
      where: {
        metadata: {
          reviewBatchId,
        } as any,
      },
      paranoid: false,
      transaction,
    });

    const assertions = await PrivilegeAssertion.findAll({
      include: [
        {
          model: PrivilegeTag,
          required: true,
          where: {
            metadata: {
              reviewBatchId,
            } as any,
          },
        },
      ],
      paranoid: false,
      transaction,
    });

    const documentIds = tags.map((t) => t.documentId);
    const clawbacks = await ClawbackRequest.findAll({
      where: {
        documentId: { [Op.in]: documentIds },
      },
      paranoid: false,
      transaction,
    });

    // Update all records with archive metadata
    for (const tag of tags) {
      await tag.update(
        {
          metadata: {
            ...tag.metadata,
            archived: true,
            archiveId,
            archivedBy: archiveMetadata.completedBy,
            archivedAt: new Date(),
            retentionYears: archiveMetadata.retentionPeriod || 7,
          },
        },
        { transaction }
      );
    }

    const privilegedCount = tags.filter(
      (t) =>
        t.assertionStatus === PrivilegeAssertionStatus.ASSERTED ||
        t.assertionStatus === PrivilegeAssertionStatus.UPHELD
    ).length;

    const archiveSummary = {
      totalDocuments: tags.length,
      privilegedDocuments: privilegedCount,
      assertions: assertions.length,
      clawbacks: clawbacks.length,
      archiveDate: new Date(),
    };

    return {
      archived: true,
      archiveId,
      archiveSummary,
    };
  } catch (error) {
    throw new InternalServerErrorException('Failed to archive privilege review');
  }
}

// ============================================================================
// NESTJS SERVICES
// ============================================================================

/**
 * Privilege Review Service
 * Main service for privilege review operations
 */
@Injectable()
export class PrivilegeReviewService {
  private readonly logger = new Logger(PrivilegeReviewService.name);

  constructor(
    @Inject('SEQUELIZE') private readonly sequelize: typeof Model
  ) {}

  /**
   * Create privilege tag with validation
   */
  async createTag(data: PrivilegeTagData): Promise<PrivilegeTag> {
    this.logger.log(`Creating privilege tag for document: ${data.documentId}`);
    return createPrivilegeTag(data);
  }

  /**
   * Batch tag multiple documents
   */
  async batchTag(
    documentIds: string[],
    privilegeData: Omit<PrivilegeTagData, 'documentId'>
  ): Promise<PrivilegeTag[]> {
    this.logger.log(`Batch tagging ${documentIds.length} documents`);
    return batchTagDocuments(documentIds, privilegeData);
  }

  /**
   * Generate privilege log for matter
   */
  async generateLog(matterId: string): Promise<PrivilegeLog[]> {
    this.logger.log(`Generating privilege log for matter: ${matterId}`);
    return generatePrivilegeLog(matterId);
  }

  /**
   * Process inadvertent disclosure
   */
  async handleDisclosure(
    documentId: string,
    disclosureDetails: any
  ): Promise<any> {
    this.logger.warn(`Processing inadvertent disclosure for document: ${documentId}`);
    return processInadvertentDisclosure(documentId, disclosureDetails);
  }
}

/**
 * Clawback Management Service
 * Service for clawback request operations
 */
@Injectable()
export class ClawbackManagementService {
  private readonly logger = new Logger(ClawbackManagementService.name);

  /**
   * Create clawback request
   */
  async createRequest(data: ClawbackRequestData): Promise<ClawbackRequest> {
    this.logger.log(`Creating clawback request for document: ${data.documentId}`);
    return createClawbackRequest(data);
  }

  /**
   * Generate clawback notice
   */
  async generateNotice(requestId: string): Promise<string> {
    this.logger.log(`Generating clawback notice for request: ${requestId}`);
    return generateClawbackNotice(requestId);
  }

  /**
   * Track compliance
   */
  async trackCompliance(requestId: string): Promise<any> {
    this.logger.log(`Tracking clawback compliance for request: ${requestId}`);
    return trackClawbackCompliance(requestId);
  }
}

/**
 * Privilege Log Service
 * Service for privilege log operations
 */
@Injectable()
export class PrivilegeLogService {
  private readonly logger = new Logger(PrivilegeLogService.name);

  /**
   * Add log entry
   */
  async addEntry(data: PrivilegeLogEntryData): Promise<PrivilegeLog> {
    this.logger.log(`Adding privilege log entry for matter: ${data.matterId}`);
    return addPrivilegeLogEntry(data);
  }

  /**
   * Export privilege log
   */
  async exportLog(
    matterId: string,
    format: PrivilegeLogFormat
  ): Promise<string | Buffer> {
    this.logger.log(`Exporting privilege log for matter: ${matterId} in ${format} format`);
    return formatPrivilegeLogExport(matterId, format);
  }

  /**
   * Validate completeness
   */
  async validateCompleteness(matterId: string): Promise<any> {
    this.logger.log(`Validating privilege log completeness for matter: ${matterId}`);
    return validatePrivilegeLogCompleteness(matterId);
  }
}

// ============================================================================
// NESTJS MODULE
// ============================================================================

@Global()
@Module({
  imports: [],
  providers: [
    PrivilegeReviewService,
    ClawbackManagementService,
    PrivilegeLogService,
  ],
  exports: [
    PrivilegeReviewService,
    ClawbackManagementService,
    PrivilegeLogService,
  ],
})
export class PrivilegeReviewModule {
  static forRoot(): DynamicModule {
    return {
      module: PrivilegeReviewModule,
      providers: [
        PrivilegeReviewService,
        ClawbackManagementService,
        PrivilegeLogService,
      ],
      exports: [
        PrivilegeReviewService,
        ClawbackManagementService,
        PrivilegeLogService,
      ],
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  PrivilegeTag,
  PrivilegeLog,
  PrivilegeAssertion,
  ClawbackRequest,

  // Services
  PrivilegeReviewService,
  ClawbackManagementService,
  PrivilegeLogService,

  // Functions - Privilege Tagging (8)
  createPrivilegeTag,
  updatePrivilegeTag,
  batchTagDocuments,
  validatePrivilegeClaim,
  getPrivilegeTagsByDocument,
  searchPrivilegedDocuments,
  removePrivilegeTag,
  bulkPrivilegeReview,

  // Functions - Privilege Log Generation (7)
  generatePrivilegeLog,
  addPrivilegeLogEntry,
  formatPrivilegeLogExport,
  validatePrivilegeLogCompleteness,
  groupPrivilegeLogByType,
  redactPrivilegeLogInfo,
  updatePrivilegeLogEntry,

  // Functions - Clawback (6)
  createClawbackRequest,
  processInadvertentDisclosure,
  validateClawbackTimeliness,
  generateClawbackNotice,
  trackClawbackCompliance,
  closeClawbackRequest,

  // Functions - Assertion Workflow (8)
  initiatePrivilegeAssertion,
  assignPrivilegeReviewer,
  submitPrivilegeChallenge,
  resolvePrivilegeDispute,
  escalatePrivilegeIssue,
  documentAssertionRationale,
  trackAssertionStatus,
  finalizePrivilegeAssertion,

  // Functions - Quality Control (6)
  performQualityControlSample,
  validatePrivilegeConsistency,
  identifyPrivilegeGaps,
  generateQCMetrics,
  flagInconsistentPrivilege,
  reviewPrivilegeAccuracy,

  // Functions - Utilities (7)
  generatePrivilegeStatistics,
  exportPrivilegeReviewData,
  calculatePrivilegeReviewProgress,
  detectPrivilegeWaiverRisks,
  generatePrivilegeReviewReport,
  validateFRE502Compliance,
  archiveCompletedPrivilegeReview,

  // Module
  PrivilegeReviewModule,
};
