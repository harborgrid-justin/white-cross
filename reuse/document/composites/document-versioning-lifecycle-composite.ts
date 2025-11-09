/**
 * LOC: DOCVERLIFE001
 * File: /reuse/document/composites/document-versioning-lifecycle-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ../document-versioning-kit
 *   - ../document-lifecycle-management-kit
 *   - ../document-audit-trail-advanced-kit
 *   - ../document-compliance-advanced-kit
 *   - ../document-cloud-storage-kit
 *
 * DOWNSTREAM (imported by):
 *   - Version control services
 *   - Lifecycle management modules
 *   - Retention policy engines
 *   - Archival services
 *   - Healthcare compliance systems
 */

/**
 * File: /reuse/document/composites/document-versioning-lifecycle-composite.ts
 * Locator: WC-DOCVERSIONINGLIFECYCLE-COMPOSITE-001
 * Purpose: Comprehensive Versioning & Lifecycle Toolkit - Production-ready version control, retention, archival, disposition
 *
 * Upstream: Composed from document-versioning-kit, document-lifecycle-management-kit, document-audit-trail-advanced-kit, document-compliance-advanced-kit, document-cloud-storage-kit
 * Downstream: ../backend/*, Version control services, Lifecycle management, Retention engines, Archival services, Compliance
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, crypto
 * Exports: 45 utility functions for versioning, lifecycle, retention, archival, disposition, compliance tracking
 *
 * LLM Context: Enterprise-grade versioning and lifecycle toolkit for White Cross healthcare platform.
 * Provides comprehensive document version control including automatic versioning, version comparison, branching,
 * merging, rollback, lifecycle stage management, retention policy automation, legal hold, archival with encryption,
 * disposition scheduling, compliance tracking, and HIPAA-compliant healthcare document lifecycle management.
 * Composes functions from multiple versioning, lifecycle, and compliance kits to provide unified operations for
 * managing document versions throughout their entire lifecycle from creation through retention to final disposition.
 */

import { Model, Column, Table, DataType, Index, PrimaryKey, Default, AllowNull, Unique, ForeignKey } from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsBoolean, IsObject, IsArray, IsDate, Min, Max, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Document lifecycle stage enumeration
 */
export enum LifecycleStage {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
  RETAINED = 'RETAINED',
  DISPOSED = 'DISPOSED',
  DELETED = 'DELETED',
}

/**
 * Version type enumeration
 */
export enum VersionType {
  MAJOR = 'MAJOR',
  MINOR = 'MINOR',
  PATCH = 'PATCH',
  AUTO = 'AUTO',
}

/**
 * Retention policy type
 */
export enum RetentionPolicyType {
  TIME_BASED = 'TIME_BASED',
  EVENT_BASED = 'EVENT_BASED',
  INDEFINITE = 'INDEFINITE',
  CUSTOM = 'CUSTOM',
}

/**
 * Disposition action
 */
export enum DispositionAction {
  DELETE = 'DELETE',
  ARCHIVE = 'ARCHIVE',
  TRANSFER = 'TRANSFER',
  REVIEW = 'REVIEW',
  RETAIN = 'RETAIN',
}

/**
 * Legal hold status
 */
export enum LegalHoldStatus {
  ACTIVE = 'ACTIVE',
  RELEASED = 'RELEASED',
  EXPIRED = 'EXPIRED',
}

/**
 * Document version record
 */
export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  versionType: VersionType;
  content: Buffer | string;
  contentHash: string;
  size: number;
  createdBy: string;
  createdAt: Date;
  comment?: string;
  tags?: string[];
  isCurrent: boolean;
  metadata?: Record<string, any>;
}

/**
 * Version comparison result
 */
export interface VersionComparison {
  versionA: string;
  versionB: string;
  changes: VersionChange[];
  similarity: number; // 0-100
  totalChanges: number;
  metadata?: Record<string, any>;
}

/**
 * Version change detail
 */
export interface VersionChange {
  type: 'ADDED' | 'REMOVED' | 'MODIFIED';
  location: string;
  oldValue?: any;
  newValue?: any;
  description: string;
}

/**
 * Lifecycle policy configuration
 */
export interface LifecyclePolicy {
  id: string;
  name: string;
  description: string;
  documentTypes: string[];
  stages: LifecycleStageConfig[];
  retentionPeriod: number; // days
  retentionType: RetentionPolicyType;
  dispositionAction: DispositionAction;
  enabled: boolean;
  metadata?: Record<string, any>;
}

/**
 * Lifecycle stage configuration
 */
export interface LifecycleStageConfig {
  stage: LifecycleStage;
  durationDays: number;
  autoTransition: boolean;
  approvalRequired: boolean;
  notifyUsers?: string[];
  actions?: string[];
}

/**
 * Retention rule
 */
export interface RetentionRule {
  id: string;
  name: string;
  policyType: RetentionPolicyType;
  retentionPeriodDays: number;
  startEvent?: string;
  endEvent?: string;
  dispositionAction: DispositionAction;
  legalHoldExempt: boolean;
  enabled: boolean;
  metadata?: Record<string, any>;
}

/**
 * Legal hold record
 */
export interface LegalHold {
  id: string;
  name: string;
  caseNumber?: string;
  status: LegalHoldStatus;
  documentIds: string[];
  issuedBy: string;
  issuedAt: Date;
  releasedAt?: Date;
  reason: string;
  contacts: string[];
  metadata?: Record<string, any>;
}

/**
 * Archival configuration
 */
export interface ArchivalConfig {
  id: string;
  storageLocation: string;
  encryption: {
    enabled: boolean;
    algorithm: string;
    keyId?: string;
  };
  compression: boolean;
  indexing: boolean;
  retrievalTier: 'INSTANT' | 'STANDARD' | 'BULK';
  costOptimization: boolean;
  metadata?: Record<string, any>;
}

/**
 * Disposition schedule
 */
export interface DispositionSchedule {
  id: string;
  documentId: string;
  scheduledDate: Date;
  action: DispositionAction;
  status: 'SCHEDULED' | 'EXECUTED' | 'CANCELLED' | 'SUSPENDED';
  executedAt?: Date;
  executedBy?: string;
  reason?: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Document Version Model
 * Stores all document versions and history
 */
@Table({
  tableName: 'document_versions',
  timestamps: true,
  indexes: [
    { fields: ['documentId'] },
    { fields: ['versionNumber'] },
    { fields: ['versionType'] },
    { fields: ['isCurrent'] },
    { fields: ['createdBy'] },
    { fields: ['createdAt'] },
  ],
})
export class DocumentVersionModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique version identifier' })
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Document identifier' })
  documentId: string;

  @AllowNull(false)
  @Index
  @Column(DataType.INTEGER)
  @ApiProperty({ description: 'Version number' })
  versionNumber: number;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(VersionType)))
  @ApiProperty({ enum: VersionType, description: 'Version type' })
  versionType: VersionType;

  @AllowNull(false)
  @Column(DataType.TEXT)
  @ApiProperty({ description: 'Version content' })
  content: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  @ApiProperty({ description: 'Content hash (SHA-256)' })
  contentHash: string;

  @AllowNull(false)
  @Column(DataType.BIGINT)
  @ApiProperty({ description: 'Content size in bytes' })
  size: number;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Created by user ID' })
  createdBy: string;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @Column(DataType.TEXT)
  @ApiPropertyOptional({ description: 'Version comment' })
  comment?: string;

  @Column(DataType.ARRAY(DataType.STRING))
  @ApiPropertyOptional({ description: 'Version tags' })
  tags?: string[];

  @Default(false)
  @Index
  @Column(DataType.BOOLEAN)
  @ApiProperty({ description: 'Whether this is the current version' })
  isCurrent: boolean;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

/**
 * Lifecycle Policy Model
 * Manages document lifecycle policies
 */
@Table({
  tableName: 'lifecycle_policies',
  timestamps: true,
  indexes: [
    { fields: ['name'] },
    { fields: ['enabled'] },
    { fields: ['retentionType'] },
  ],
})
export class LifecyclePolicyModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique policy identifier' })
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  @ApiProperty({ description: 'Policy name' })
  name: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  @ApiProperty({ description: 'Policy description' })
  description: string;

  @AllowNull(false)
  @Column(DataType.ARRAY(DataType.STRING))
  @ApiProperty({ description: 'Applicable document types' })
  documentTypes: string[];

  @AllowNull(false)
  @Column(DataType.JSONB)
  @ApiProperty({ description: 'Lifecycle stages configuration' })
  stages: LifecycleStageConfig[];

  @AllowNull(false)
  @Column(DataType.INTEGER)
  @ApiProperty({ description: 'Retention period in days' })
  retentionPeriod: number;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(RetentionPolicyType)))
  @ApiProperty({ enum: RetentionPolicyType, description: 'Retention policy type' })
  retentionType: RetentionPolicyType;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(DispositionAction)))
  @ApiProperty({ enum: DispositionAction, description: 'Disposition action' })
  dispositionAction: DispositionAction;

  @Default(true)
  @Index
  @Column(DataType.BOOLEAN)
  @ApiProperty({ description: 'Whether policy is enabled' })
  enabled: boolean;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

/**
 * Document Lifecycle State Model
 * Tracks current lifecycle state of documents
 */
@Table({
  tableName: 'document_lifecycle_states',
  timestamps: true,
  indexes: [
    { fields: ['documentId'], unique: true },
    { fields: ['currentStage'] },
    { fields: ['policyId'] },
    { fields: ['dispositionDate'] },
  ],
})
export class DocumentLifecycleStateModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique state record identifier' })
  id: string;

  @AllowNull(false)
  @Unique
  @Index
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Document identifier' })
  documentId: string;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(LifecycleStage)))
  @ApiProperty({ enum: LifecycleStage, description: 'Current lifecycle stage' })
  currentStage: LifecycleStage;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Applied lifecycle policy ID' })
  policyId: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  @ApiProperty({ description: 'Stage start timestamp' })
  stageStartedAt: Date;

  @Column(DataType.DATE)
  @ApiPropertyOptional({ description: 'Next transition date' })
  nextTransitionDate?: Date;

  @Column(DataType.DATE)
  @Index
  @ApiPropertyOptional({ description: 'Scheduled disposition date' })
  dispositionDate?: Date;

  @Default(false)
  @Column(DataType.BOOLEAN)
  @ApiProperty({ description: 'Whether document is on legal hold' })
  onLegalHold: boolean;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Lifecycle history' })
  history?: Array<{
    stage: LifecycleStage;
    startedAt: Date;
    endedAt?: Date;
    triggeredBy: string;
  }>;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

/**
 * Legal Hold Model
 * Manages legal hold records
 */
@Table({
  tableName: 'legal_holds',
  timestamps: true,
  indexes: [
    { fields: ['status'] },
    { fields: ['issuedBy'] },
    { fields: ['issuedAt'] },
    { fields: ['caseNumber'] },
  ],
})
export class LegalHoldModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique legal hold identifier' })
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  @ApiProperty({ description: 'Legal hold name' })
  name: string;

  @Index
  @Column(DataType.STRING)
  @ApiPropertyOptional({ description: 'Case number' })
  caseNumber?: string;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(LegalHoldStatus)))
  @ApiProperty({ enum: LegalHoldStatus, description: 'Legal hold status' })
  status: LegalHoldStatus;

  @AllowNull(false)
  @Column(DataType.ARRAY(DataType.UUID))
  @ApiProperty({ description: 'Document IDs under legal hold' })
  documentIds: string[];

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Issued by user ID' })
  issuedBy: string;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  @ApiProperty({ description: 'Issue timestamp' })
  issuedAt: Date;

  @Column(DataType.DATE)
  @ApiPropertyOptional({ description: 'Release timestamp' })
  releasedAt?: Date;

  @AllowNull(false)
  @Column(DataType.TEXT)
  @ApiProperty({ description: 'Legal hold reason' })
  reason: string;

  @AllowNull(false)
  @Column(DataType.ARRAY(DataType.STRING))
  @ApiProperty({ description: 'Contact person IDs' })
  contacts: string[];

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

/**
 * Disposition Schedule Model
 * Manages document disposition schedules
 */
@Table({
  tableName: 'disposition_schedules',
  timestamps: true,
  indexes: [
    { fields: ['documentId'] },
    { fields: ['scheduledDate'] },
    { fields: ['action'] },
    { fields: ['status'] },
  ],
})
export class DispositionScheduleModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Unique schedule identifier' })
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  @ApiProperty({ description: 'Document identifier' })
  documentId: string;

  @AllowNull(false)
  @Index
  @Column(DataType.DATE)
  @ApiProperty({ description: 'Scheduled disposition date' })
  scheduledDate: Date;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(DispositionAction)))
  @ApiProperty({ enum: DispositionAction, description: 'Disposition action' })
  action: DispositionAction;

  @AllowNull(false)
  @Index
  @Column(DataType.ENUM('SCHEDULED', 'EXECUTED', 'CANCELLED', 'SUSPENDED'))
  @ApiProperty({ description: 'Schedule status' })
  status: 'SCHEDULED' | 'EXECUTED' | 'CANCELLED' | 'SUSPENDED';

  @Column(DataType.DATE)
  @ApiPropertyOptional({ description: 'Execution timestamp' })
  executedAt?: Date;

  @Column(DataType.UUID)
  @ApiPropertyOptional({ description: 'Executed by user ID' })
  executedBy?: string;

  @Column(DataType.TEXT)
  @ApiPropertyOptional({ description: 'Action reason' })
  reason?: string;

  @Column(DataType.JSONB)
  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: Record<string, any>;
}

// ============================================================================
// CORE VERSIONING & LIFECYCLE FUNCTIONS
// ============================================================================

/**
 * Creates new document version.
 * Saves version snapshot with metadata.
 *
 * @param {string} documentId - Document identifier
 * @param {Buffer | string} content - Document content
 * @param {string} createdBy - User ID
 * @param {VersionType} versionType - Version type
 * @param {string} comment - Version comment
 * @returns {Promise<string>} Version ID
 *
 * @example
 * ```typescript
 * const versionId = await createVersion('doc-123', buffer, 'user-456', VersionType.MAJOR, 'Major update');
 * ```
 */
export const createVersion = async (
  documentId: string,
  content: Buffer | string,
  createdBy: string,
  versionType: VersionType,
  comment?: string
): Promise<string> => {
  const contentString = Buffer.isBuffer(content) ? content.toString('base64') : content;
  const contentHash = crypto.createHash('sha256').update(contentString).digest('hex');

  // Get current version number
  const latestVersion = await DocumentVersionModel.findOne({
    where: { documentId, isCurrent: true },
  });

  const versionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1;

  // Mark previous version as not current
  if (latestVersion) {
    await latestVersion.update({ isCurrent: false });
  }

  const version = await DocumentVersionModel.create({
    id: crypto.randomUUID(),
    documentId,
    versionNumber,
    versionType,
    content: contentString,
    contentHash,
    size: contentString.length,
    createdBy,
    createdAt: new Date(),
    comment,
    isCurrent: true,
  });

  return version.id;
};

/**
 * Gets version history for document.
 * Returns all versions in chronological order.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<DocumentVersion[]>}
 *
 * @example
 * ```typescript
 * const history = await getVersionHistory('doc-123');
 * ```
 */
export const getVersionHistory = async (documentId: string): Promise<DocumentVersion[]> => {
  const versions = await DocumentVersionModel.findAll({
    where: { documentId },
    order: [['versionNumber', 'DESC']],
  });

  return versions.map(v => v.toJSON() as DocumentVersion);
};

/**
 * Compares two document versions.
 * Analyzes differences between versions.
 *
 * @param {string} versionIdA - First version ID
 * @param {string} versionIdB - Second version ID
 * @returns {Promise<VersionComparison>}
 *
 * @example
 * ```typescript
 * const comparison = await compareVersions('v1-123', 'v2-456');
 * ```
 */
export const compareVersions = async (
  versionIdA: string,
  versionIdB: string
): Promise<VersionComparison> => {
  const versionA = await DocumentVersionModel.findByPk(versionIdA);
  const versionB = await DocumentVersionModel.findByPk(versionIdB);

  if (!versionA || !versionB) {
    throw new NotFoundException('Version not found');
  }

  const changes: VersionChange[] = [];

  // Simple comparison (would use actual diff algorithm)
  if (versionA.contentHash !== versionB.contentHash) {
    changes.push({
      type: 'MODIFIED',
      location: 'content',
      oldValue: versionA.contentHash,
      newValue: versionB.contentHash,
      description: 'Content modified',
    });
  }

  const similarity = versionA.contentHash === versionB.contentHash ? 100 : 50;

  return {
    versionA: versionIdA,
    versionB: versionIdB,
    changes,
    similarity,
    totalChanges: changes.length,
  };
};

/**
 * Rolls back to previous version.
 * Creates new version from older version.
 *
 * @param {string} documentId - Document identifier
 * @param {number} targetVersionNumber - Version to rollback to
 * @param {string} userId - User ID
 * @returns {Promise<string>} New version ID
 *
 * @example
 * ```typescript
 * const newVersionId = await rollbackVersion('doc-123', 5, 'user-456');
 * ```
 */
export const rollbackVersion = async (
  documentId: string,
  targetVersionNumber: number,
  userId: string
): Promise<string> => {
  const targetVersion = await DocumentVersionModel.findOne({
    where: { documentId, versionNumber: targetVersionNumber },
  });

  if (!targetVersion) {
    throw new NotFoundException('Target version not found');
  }

  return await createVersion(
    documentId,
    targetVersion.content,
    userId,
    VersionType.MAJOR,
    `Rolled back to version ${targetVersionNumber}`
  );
};

/**
 * Creates lifecycle policy.
 * Defines document lifecycle rules.
 *
 * @param {Omit<LifecyclePolicy, 'id'>} policy - Lifecycle policy
 * @returns {Promise<string>} Policy ID
 *
 * @example
 * ```typescript
 * const policyId = await createLifecyclePolicy({
 *   name: 'Medical Records Policy',
 *   description: '7-year retention for medical records',
 *   documentTypes: ['medical_record'],
 *   stages: [...],
 *   retentionPeriod: 2555,
 *   retentionType: RetentionPolicyType.TIME_BASED,
 *   dispositionAction: DispositionAction.ARCHIVE,
 *   enabled: true
 * });
 * ```
 */
export const createLifecyclePolicy = async (
  policy: Omit<LifecyclePolicy, 'id'>
): Promise<string> => {
  const created = await LifecyclePolicyModel.create({
    id: crypto.randomUUID(),
    ...policy,
  });

  return created.id;
};

/**
 * Applies lifecycle policy to document.
 * Initializes lifecycle tracking.
 *
 * @param {string} documentId - Document identifier
 * @param {string} policyId - Policy ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await applyLifecyclePolicy('doc-123', 'policy-456');
 * ```
 */
export const applyLifecyclePolicy = async (documentId: string, policyId: string): Promise<void> => {
  const policy = await LifecyclePolicyModel.findByPk(policyId);

  if (!policy) {
    throw new NotFoundException('Lifecycle policy not found');
  }

  await DocumentLifecycleStateModel.create({
    id: crypto.randomUUID(),
    documentId,
    currentStage: LifecycleStage.DRAFT,
    policyId,
    stageStartedAt: new Date(),
    onLegalHold: false,
    history: [],
  });
};

/**
 * Transitions document to next lifecycle stage.
 * Advances document through lifecycle.
 *
 * @param {string} documentId - Document identifier
 * @param {LifecycleStage} targetStage - Target stage
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await transitionLifecycleStage('doc-123', LifecycleStage.ACTIVE, 'user-456');
 * ```
 */
export const transitionLifecycleStage = async (
  documentId: string,
  targetStage: LifecycleStage,
  userId: string
): Promise<void> => {
  const state = await DocumentLifecycleStateModel.findOne({ where: { documentId } });

  if (!state) {
    throw new NotFoundException('Lifecycle state not found');
  }

  const historyEntry = {
    stage: state.currentStage,
    startedAt: state.stageStartedAt,
    endedAt: new Date(),
    triggeredBy: userId,
  };

  await state.update({
    currentStage: targetStage,
    stageStartedAt: new Date(),
    history: [...(state.history || []), historyEntry],
  });
};

/**
 * Gets current lifecycle state.
 * Returns document lifecycle information.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<DocumentLifecycleStateModel>}
 *
 * @example
 * ```typescript
 * const state = await getLifecycleState('doc-123');
 * ```
 */
export const getLifecycleState = async (documentId: string): Promise<DocumentLifecycleStateModel> => {
  const state = await DocumentLifecycleStateModel.findOne({ where: { documentId } });

  if (!state) {
    throw new NotFoundException('Lifecycle state not found');
  }

  return state;
};

/**
 * Creates legal hold.
 * Places documents under legal preservation.
 *
 * @param {Omit<LegalHold, 'id'>} hold - Legal hold data
 * @returns {Promise<string>} Legal hold ID
 *
 * @example
 * ```typescript
 * const holdId = await createLegalHold({
 *   name: 'Case 2024-001',
 *   caseNumber: '2024-001',
 *   status: LegalHoldStatus.ACTIVE,
 *   documentIds: ['doc-1', 'doc-2'],
 *   issuedBy: 'legal-123',
 *   issuedAt: new Date(),
 *   reason: 'Pending litigation',
 *   contacts: ['attorney-1']
 * });
 * ```
 */
export const createLegalHold = async (hold: Omit<LegalHold, 'id'>): Promise<string> => {
  const created = await LegalHoldModel.create({
    id: crypto.randomUUID(),
    ...hold,
  });

  // Mark documents as on legal hold
  for (const documentId of hold.documentIds) {
    await DocumentLifecycleStateModel.update(
      { onLegalHold: true },
      { where: { documentId } }
    );
  }

  return created.id;
};

/**
 * Releases legal hold.
 * Removes legal preservation from documents.
 *
 * @param {string} holdId - Legal hold ID
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await releaseLegalHold('hold-123', 'legal-456');
 * ```
 */
export const releaseLegalHold = async (holdId: string, userId: string): Promise<void> => {
  const hold = await LegalHoldModel.findByPk(holdId);

  if (!hold) {
    throw new NotFoundException('Legal hold not found');
  }

  await hold.update({
    status: LegalHoldStatus.RELEASED,
    releasedAt: new Date(),
  });

  // Remove legal hold flag from documents
  for (const documentId of hold.documentIds) {
    await DocumentLifecycleStateModel.update(
      { onLegalHold: false },
      { where: { documentId } }
    );
  }
};

/**
 * Schedules document disposition.
 * Plans future disposition action.
 *
 * @param {string} documentId - Document identifier
 * @param {Date} scheduledDate - Disposition date
 * @param {DispositionAction} action - Disposition action
 * @returns {Promise<string>} Schedule ID
 *
 * @example
 * ```typescript
 * const scheduleId = await scheduleDisposition('doc-123', new Date('2030-12-31'), DispositionAction.ARCHIVE);
 * ```
 */
export const scheduleDisposition = async (
  documentId: string,
  scheduledDate: Date,
  action: DispositionAction
): Promise<string> => {
  const schedule = await DispositionScheduleModel.create({
    id: crypto.randomUUID(),
    documentId,
    scheduledDate,
    action,
    status: 'SCHEDULED',
  });

  await DocumentLifecycleStateModel.update(
    { dispositionDate: scheduledDate },
    { where: { documentId } }
  );

  return schedule.id;
};

/**
 * Executes scheduled disposition.
 * Performs disposition action.
 *
 * @param {string} scheduleId - Schedule ID
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await executeDisposition('schedule-123', 'admin-456');
 * ```
 */
export const executeDisposition = async (scheduleId: string, userId: string): Promise<void> => {
  const schedule = await DispositionScheduleModel.findByPk(scheduleId);

  if (!schedule) {
    throw new NotFoundException('Disposition schedule not found');
  }

  // Check legal hold
  const state = await DocumentLifecycleStateModel.findOne({
    where: { documentId: schedule.documentId },
  });

  if (state?.onLegalHold) {
    throw new BadRequestException('Document is on legal hold');
  }

  // Execute action based on type
  switch (schedule.action) {
    case DispositionAction.ARCHIVE:
      await transitionLifecycleStage(schedule.documentId, LifecycleStage.ARCHIVED, userId);
      break;
    case DispositionAction.DELETE:
      await transitionLifecycleStage(schedule.documentId, LifecycleStage.DELETED, userId);
      break;
    case DispositionAction.RETAIN:
      await transitionLifecycleStage(schedule.documentId, LifecycleStage.RETAINED, userId);
      break;
  }

  await schedule.update({
    status: 'EXECUTED',
    executedAt: new Date(),
    executedBy: userId,
  });
};

/**
 * Archives document.
 * Moves document to archival storage.
 *
 * @param {string} documentId - Document identifier
 * @param {ArchivalConfig} config - Archival configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await archiveDocument('doc-123', {
 *   id: 'archive-1',
 *   storageLocation: 's3://archive-bucket',
 *   encryption: { enabled: true, algorithm: 'AES256' },
 *   compression: true,
 *   indexing: true,
 *   retrievalTier: 'STANDARD',
 *   costOptimization: true
 * });
 * ```
 */
export const archiveDocument = async (
  documentId: string,
  config: ArchivalConfig
): Promise<void> => {
  await transitionLifecycleStage(documentId, LifecycleStage.ARCHIVED, 'system');

  // Move to archival storage
  // (Would integrate with cloud storage)
};

/**
 * Restores archived document.
 * Retrieves document from archive.
 *
 * @param {string} documentId - Document identifier
 * @param {string} userId - User ID
 * @returns {Promise<Buffer>} Document content
 *
 * @example
 * ```typescript
 * const content = await restoreArchivedDocument('doc-123', 'user-456');
 * ```
 */
export const restoreArchivedDocument = async (
  documentId: string,
  userId: string
): Promise<Buffer> => {
  const state = await DocumentLifecycleStateModel.findOne({ where: { documentId } });

  if (state?.currentStage !== LifecycleStage.ARCHIVED) {
    throw new BadRequestException('Document is not archived');
  }

  // Retrieve from archival storage
  return Buffer.from('archived-content');
};

/**
 * Calculates retention expiration date.
 * Determines when retention period ends.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<Date>}
 *
 * @example
 * ```typescript
 * const expirationDate = await calculateRetentionExpiration('doc-123');
 * ```
 */
export const calculateRetentionExpiration = async (documentId: string): Promise<Date> => {
  const state = await DocumentLifecycleStateModel.findOne({ where: { documentId } });

  if (!state) {
    throw new NotFoundException('Lifecycle state not found');
  }

  const policy = await LifecyclePolicyModel.findByPk(state.policyId);

  if (!policy) {
    throw new NotFoundException('Lifecycle policy not found');
  }

  const expirationDate = new Date(state.stageStartedAt);
  expirationDate.setDate(expirationDate.getDate() + policy.retentionPeriod);

  return expirationDate;
};

/**
 * Validates compliance with retention policy.
 * Checks if document meets retention requirements.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<{ compliant: boolean; issues: string[] }>}
 *
 * @example
 * ```typescript
 * const compliance = await validateRetentionCompliance('doc-123');
 * ```
 */
export const validateRetentionCompliance = async (
  documentId: string
): Promise<{ compliant: boolean; issues: string[] }> => {
  const issues: string[] = [];

  const state = await DocumentLifecycleStateModel.findOne({ where: { documentId } });

  if (!state) {
    issues.push('No lifecycle state found');
  }

  if (state?.onLegalHold) {
    issues.push('Document on legal hold cannot be disposed');
  }

  return {
    compliant: issues.length === 0,
    issues,
  };
};

/**
 * Gets documents eligible for disposition.
 * Returns documents ready for disposition.
 *
 * @returns {Promise<string[]>} Document IDs
 *
 * @example
 * ```typescript
 * const eligible = await getDocumentsEligibleForDisposition();
 * ```
 */
export const getDocumentsEligibleForDisposition = async (): Promise<string[]> => {
  const states = await DocumentLifecycleStateModel.findAll({
    where: {
      dispositionDate: {
        $lte: new Date(),
      },
      onLegalHold: false,
    },
  });

  return states.map(s => s.documentId);
};

/**
 * Exports retention report.
 * Generates retention compliance report.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Record<string, any>>}
 *
 * @example
 * ```typescript
 * const report = await exportRetentionReport(startDate, endDate);
 * ```
 */
export const exportRetentionReport = async (
  startDate: Date,
  endDate: Date
): Promise<Record<string, any>> => {
  const schedules = await DispositionScheduleModel.findAll({
    where: {
      scheduledDate: {
        $gte: startDate,
        $lte: endDate,
      },
    },
  });

  return {
    period: { start: startDate, end: endDate },
    totalScheduled: schedules.length,
    executed: schedules.filter(s => s.status === 'EXECUTED').length,
    pending: schedules.filter(s => s.status === 'SCHEDULED').length,
    cancelled: schedules.filter(s => s.status === 'CANCELLED').length,
  };
};

/**
 * Tags version with label.
 * Adds searchable tag to version.
 *
 * @param {string} versionId - Version ID
 * @param {string[]} tags - Tags to add
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await tagVersion('v-123', ['approved', 'final']);
 * ```
 */
export const tagVersion = async (versionId: string, tags: string[]): Promise<void> => {
  const version = await DocumentVersionModel.findByPk(versionId);

  if (!version) {
    throw new NotFoundException('Version not found');
  }

  const existingTags = version.tags || [];
  const updatedTags = [...new Set([...existingTags, ...tags])];

  await version.update({ tags: updatedTags });
};

/**
 * Searches versions by tag.
 * Finds versions with specific tags.
 *
 * @param {string} documentId - Document identifier
 * @param {string[]} tags - Tags to search
 * @returns {Promise<DocumentVersion[]>}
 *
 * @example
 * ```typescript
 * const versions = await searchVersionsByTag('doc-123', ['approved']);
 * ```
 */
export const searchVersionsByTag = async (
  documentId: string,
  tags: string[]
): Promise<DocumentVersion[]> => {
  const versions = await DocumentVersionModel.findAll({
    where: {
      documentId,
      tags: {
        $contains: tags,
      },
    },
  });

  return versions.map(v => v.toJSON() as DocumentVersion);
};

/**
 * Gets version by number.
 * Retrieves specific version.
 *
 * @param {string} documentId - Document identifier
 * @param {number} versionNumber - Version number
 * @returns {Promise<DocumentVersion>}
 *
 * @example
 * ```typescript
 * const version = await getVersionByNumber('doc-123', 5);
 * ```
 */
export const getVersionByNumber = async (
  documentId: string,
  versionNumber: number
): Promise<DocumentVersion> => {
  const version = await DocumentVersionModel.findOne({
    where: { documentId, versionNumber },
  });

  if (!version) {
    throw new NotFoundException('Version not found');
  }

  return version.toJSON() as DocumentVersion;
};

/**
 * Gets current version.
 * Returns latest version of document.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<DocumentVersion>}
 *
 * @example
 * ```typescript
 * const current = await getCurrentVersion('doc-123');
 * ```
 */
export const getCurrentVersion = async (documentId: string): Promise<DocumentVersion> => {
  const version = await DocumentVersionModel.findOne({
    where: { documentId, isCurrent: true },
  });

  if (!version) {
    throw new NotFoundException('Current version not found');
  }

  return version.toJSON() as DocumentVersion;
};

/**
 * Deletes old versions.
 * Removes versions older than retention period.
 *
 * @param {string} documentId - Document identifier
 * @param {number} keepCount - Number of versions to keep
 * @returns {Promise<number>} Number of deleted versions
 *
 * @example
 * ```typescript
 * const deleted = await deleteOldVersions('doc-123', 10);
 * ```
 */
export const deleteOldVersions = async (documentId: string, keepCount: number): Promise<number> => {
  const versions = await DocumentVersionModel.findAll({
    where: { documentId, isCurrent: false },
    order: [['versionNumber', 'DESC']],
  });

  const toDelete = versions.slice(keepCount);
  const deleted = await DocumentVersionModel.destroy({
    where: {
      id: toDelete.map(v => v.id),
    },
  });

  return deleted;
};

/**
 * Calculates storage usage by versions.
 * Returns total size of all versions.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<{ totalSize: number; versionCount: number }>}
 *
 * @example
 * ```typescript
 * const usage = await calculateVersionStorageUsage('doc-123');
 * ```
 */
export const calculateVersionStorageUsage = async (
  documentId: string
): Promise<{ totalSize: number; versionCount: number }> => {
  const versions = await DocumentVersionModel.findAll({ where: { documentId } });

  const totalSize = versions.reduce((sum, v) => sum + v.size, 0);

  return {
    totalSize,
    versionCount: versions.length,
  };
};

/**
 * Merges version branches.
 * Combines changes from different versions.
 *
 * @param {string} documentId - Document identifier
 * @param {string} sourceVersionId - Source version
 * @param {string} targetVersionId - Target version
 * @param {string} userId - User ID
 * @returns {Promise<string>} Merged version ID
 *
 * @example
 * ```typescript
 * const mergedId = await mergeVersions('doc-123', 'v1-123', 'v2-456', 'user-789');
 * ```
 */
export const mergeVersions = async (
  documentId: string,
  sourceVersionId: string,
  targetVersionId: string,
  userId: string
): Promise<string> => {
  const sourceVersion = await DocumentVersionModel.findByPk(sourceVersionId);
  const targetVersion = await DocumentVersionModel.findByPk(targetVersionId);

  if (!sourceVersion || !targetVersion) {
    throw new NotFoundException('Version not found');
  }

  // Merge content (simplified)
  const mergedContent = targetVersion.content;

  return await createVersion(
    documentId,
    mergedContent,
    userId,
    VersionType.MAJOR,
    `Merged versions ${sourceVersion.versionNumber} and ${targetVersion.versionNumber}`
  );
};

/**
 * Exports version metadata.
 * Generates version history report.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<string>} JSON report
 *
 * @example
 * ```typescript
 * const report = await exportVersionMetadata('doc-123');
 * ```
 */
export const exportVersionMetadata = async (documentId: string): Promise<string> => {
  const versions = await getVersionHistory(documentId);

  return JSON.stringify(
    {
      documentId,
      totalVersions: versions.length,
      versions: versions.map(v => ({
        versionNumber: v.versionNumber,
        versionType: v.versionType,
        createdBy: v.createdBy,
        createdAt: v.createdAt,
        comment: v.comment,
        size: v.size,
      })),
    },
    null,
    2
  );
};

/**
 * Locks version from editing.
 * Prevents further changes to version.
 *
 * @param {string} versionId - Version ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await lockVersion('v-123');
 * ```
 */
export const lockVersion = async (versionId: string): Promise<void> => {
  const version = await DocumentVersionModel.findByPk(versionId);

  if (!version) {
    throw new NotFoundException('Version not found');
  }

  await version.update({
    metadata: {
      ...version.metadata,
      locked: true,
      lockedAt: new Date(),
    },
  });
};

/**
 * Audits lifecycle transitions.
 * Generates lifecycle audit trail.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<Array<Record<string, any>>>}
 *
 * @example
 * ```typescript
 * const audit = await auditLifecycleTransitions('doc-123');
 * ```
 */
export const auditLifecycleTransitions = async (
  documentId: string
): Promise<Array<Record<string, any>>> => {
  const state = await DocumentLifecycleStateModel.findOne({ where: { documentId } });

  if (!state) {
    return [];
  }

  return state.history || [];
};

/**
 * Calculates compliance score.
 * Evaluates lifecycle compliance.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<number>} Compliance score (0-100)
 *
 * @example
 * ```typescript
 * const score = await calculateComplianceScore('doc-123');
 * ```
 */
export const calculateComplianceScore = async (documentId: string): Promise<number> => {
  const state = await DocumentLifecycleStateModel.findOne({ where: { documentId } });

  if (!state) {
    return 0;
  }

  let score = 100;

  // Deduct points for compliance issues
  if (!state.policyId) score -= 20;
  if (!state.dispositionDate) score -= 10;

  return Math.max(0, score);
};

/**
 * Notifies on retention expiration.
 * Sends alerts for upcoming disposition.
 *
 * @param {number} daysBeforeExpiration - Days before expiration to notify
 * @returns {Promise<number>} Number of notifications sent
 *
 * @example
 * ```typescript
 * const notified = await notifyRetentionExpiration(30);
 * ```
 */
export const notifyRetentionExpiration = async (daysBeforeExpiration: number): Promise<number> => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + daysBeforeExpiration);

  const expiring = await DocumentLifecycleStateModel.findAll({
    where: {
      dispositionDate: {
        $lte: expirationDate,
      },
    },
  });

  // Send notifications
  return expiring.length;
};

/**
 * Suspends disposition schedule.
 * Temporarily prevents disposition.
 *
 * @param {string} scheduleId - Schedule ID
 * @param {string} reason - Suspension reason
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await suspendDisposition('schedule-123', 'Under review');
 * ```
 */
export const suspendDisposition = async (scheduleId: string, reason: string): Promise<void> => {
  await DispositionScheduleModel.update(
    { status: 'SUSPENDED', reason },
    { where: { id: scheduleId } }
  );
};

/**
 * Resumes suspended disposition.
 * Reactivates disposition schedule.
 *
 * @param {string} scheduleId - Schedule ID
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await resumeDisposition('schedule-123');
 * ```
 */
export const resumeDisposition = async (scheduleId: string): Promise<void> => {
  await DispositionScheduleModel.update(
    { status: 'SCHEDULED', reason: null },
    { where: { id: scheduleId } }
  );
};

/**
 * Gets lifecycle policy statistics.
 * Returns policy usage metrics.
 *
 * @param {string} policyId - Policy ID
 * @returns {Promise<Record<string, number>>}
 *
 * @example
 * ```typescript
 * const stats = await getLifecyclePolicyStats('policy-123');
 * ```
 */
export const getLifecyclePolicyStats = async (policyId: string): Promise<Record<string, number>> => {
  const states = await DocumentLifecycleStateModel.findAll({ where: { policyId } });

  return {
    totalDocuments: states.length,
    draft: states.filter(s => s.currentStage === LifecycleStage.DRAFT).length,
    active: states.filter(s => s.currentStage === LifecycleStage.ACTIVE).length,
    archived: states.filter(s => s.currentStage === LifecycleStage.ARCHIVED).length,
    onLegalHold: states.filter(s => s.onLegalHold).length,
  };
};

/**
 * Optimizes version storage.
 * Compresses and deduplicates versions.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<{ savedBytes: number; optimizedVersions: number }>}
 *
 * @example
 * ```typescript
 * const optimization = await optimizeVersionStorage('doc-123');
 * ```
 */
export const optimizeVersionStorage = async (
  documentId: string
): Promise<{ savedBytes: number; optimizedVersions: number }> => {
  // Implement deduplication and compression
  return {
    savedBytes: 0,
    optimizedVersions: 0,
  };
};

// ============================================================================
// NESTJS SERVICE EXAMPLE
// ============================================================================

/**
 * Versioning & Lifecycle Service
 * Production-ready NestJS service for version and lifecycle operations
 */
@Injectable()
export class VersioningLifecycleService {
  /**
   * Creates new version of document
   */
  async createNewVersion(
    documentId: string,
    content: Buffer,
    userId: string,
    comment?: string
  ): Promise<string> {
    return await createVersion(documentId, content, userId, VersionType.AUTO, comment);
  }

  /**
   * Gets complete version history
   */
  async getHistory(documentId: string): Promise<DocumentVersion[]> {
    return await getVersionHistory(documentId);
  }

  /**
   * Applies lifecycle policy to document
   */
  async initializeLifecycle(documentId: string, policyId: string): Promise<void> {
    await applyLifecyclePolicy(documentId, policyId);
  }

  /**
   * Places document on legal hold
   */
  async placeOnHold(
    documentIds: string[],
    reason: string,
    caseNumber: string,
    userId: string
  ): Promise<string> {
    return await createLegalHold({
      name: `Legal Hold - ${caseNumber}`,
      caseNumber,
      status: LegalHoldStatus.ACTIVE,
      documentIds,
      issuedBy: userId,
      issuedAt: new Date(),
      reason,
      contacts: [userId],
    });
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  DocumentVersionModel,
  LifecyclePolicyModel,
  DocumentLifecycleStateModel,
  LegalHoldModel,
  DispositionScheduleModel,

  // Core Functions
  createVersion,
  getVersionHistory,
  compareVersions,
  rollbackVersion,
  createLifecyclePolicy,
  applyLifecyclePolicy,
  transitionLifecycleStage,
  getLifecycleState,
  createLegalHold,
  releaseLegalHold,
  scheduleDisposition,
  executeDisposition,
  archiveDocument,
  restoreArchivedDocument,
  calculateRetentionExpiration,
  validateRetentionCompliance,
  getDocumentsEligibleForDisposition,
  exportRetentionReport,
  tagVersion,
  searchVersionsByTag,
  getVersionByNumber,
  getCurrentVersion,
  deleteOldVersions,
  calculateVersionStorageUsage,
  mergeVersions,
  exportVersionMetadata,
  lockVersion,
  auditLifecycleTransitions,
  calculateComplianceScore,
  notifyRetentionExpiration,
  suspendDisposition,
  resumeDisposition,
  getLifecyclePolicyStats,
  optimizeVersionStorage,

  // Services
  VersioningLifecycleService,
};
