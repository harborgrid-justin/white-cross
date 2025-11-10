/**
 * ASSET CONFIGURATION COMMAND FUNCTIONS
 *
 * Enterprise-grade asset configuration management system providing comprehensive
 * functionality for configuration items, baselines, change management, version control,
 * configuration audits, CMDB integration, and drift detection. Competes with ServiceNow CMDB
 * and BMC Helix CMDB solutions.
 *
 * Features:
 * - Configuration Item (CI) management
 * - Configuration baselines and snapshots
 * - Change control and approval workflows
 * - Version control and history tracking
 * - Configuration drift detection
 * - CMDB integration and synchronization
 * - Relationship mapping (CI dependencies)
 * - Configuration audits and compliance
 * - Impact analysis
 * - Rollback and restore capabilities
 *
 * @module AssetConfigurationCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 *
 * @example
 * ```typescript
 * import {
 *   createConfigurationItem,
 *   createBaseline,
 *   detectConfigurationDrift,
 *   createChangeRequest,
 *   ConfigurationItem,
 *   ChangeRequestStatus
 * } from './asset-configuration-commands';
 *
 * // Create configuration item
 * const ci = await createConfigurationItem({
 *   assetId: 'asset-123',
 *   ciType: CIType.SERVER,
 *   attributes: {
 *     hostname: 'prod-web-01',
 *     os: 'Ubuntu 22.04',
 *     cpu: '8 cores',
 *     memory: '32GB'
 *   },
 *   version: '1.0.0'
 * });
 *
 * // Create baseline
 * const baseline = await createBaseline({
 *   name: 'Production Baseline Q4 2024',
 *   ciIds: ['ci-1', 'ci-2', 'ci-3'],
 *   approvedBy: 'manager-456'
 * });
 * ```
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import {
  IsString,
  IsNumber,
  IsDate,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsObject,
  IsUUID,
  IsArray,
  Min,
  Max,
  ValidateNested,
  IsJSON,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction, Op, WhereOptions, FindOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Configuration Item Type
 */
export enum CIType {
  SERVER = 'server',
  NETWORK_DEVICE = 'network_device',
  STORAGE = 'storage',
  DATABASE = 'database',
  APPLICATION = 'application',
  MIDDLEWARE = 'middleware',
  WORKSTATION = 'workstation',
  MOBILE_DEVICE = 'mobile_device',
  VIRTUAL_MACHINE = 'virtual_machine',
  CONTAINER = 'container',
  CLOUD_SERVICE = 'cloud_service',
  FACILITY = 'facility',
  MANUFACTURING_EQUIPMENT = 'manufacturing_equipment',
  VEHICLE = 'vehicle',
}

/**
 * CI Status
 */
export enum CIStatus {
  PLANNED = 'planned',
  IN_DEVELOPMENT = 'in_development',
  IN_TESTING = 'in_testing',
  OPERATIONAL = 'operational',
  MAINTENANCE = 'maintenance',
  RETIRED = 'retired',
  DECOMMISSIONED = 'decommissioned',
}

/**
 * Change Request Status
 */
export enum ChangeRequestStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ROLLED_BACK = 'rolled_back',
}

/**
 * Change Priority
 */
export enum ChangePriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

/**
 * Change Type
 */
export enum ChangeType {
  STANDARD = 'standard',
  NORMAL = 'normal',
  EMERGENCY = 'emergency',
  MAJOR = 'major',
}

/**
 * Relationship Type
 */
export enum RelationshipType {
  DEPENDS_ON = 'depends_on',
  HOSTED_ON = 'hosted_on',
  CONNECTED_TO = 'connected_to',
  USES = 'uses',
  PART_OF = 'part_of',
  MANAGES = 'manages',
  RUNS_ON = 'runs_on',
  BACKED_UP_BY = 'backed_up_by',
  REPLICATED_TO = 'replicated_to',
}

/**
 * Drift Status
 */
export enum DriftStatus {
  COMPLIANT = 'compliant',
  DRIFT_DETECTED = 'drift_detected',
  CRITICAL_DRIFT = 'critical_drift',
  REVIEWING = 'reviewing',
  REMEDIATED = 'remediated',
}

/**
 * Audit Status
 */
export enum AuditStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/**
 * Baseline Status
 */
export enum BaselineStatus {
  DRAFT = 'draft',
  APPROVED = 'approved',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DEPRECATED = 'deprecated',
}

/**
 * Configuration Item Data
 */
export interface ConfigurationItemData {
  assetId: string;
  ciType: CIType;
  name: string;
  description?: string;
  attributes: Record<string, any>;
  version: string;
  owner?: string;
  custodian?: string;
  location?: string;
  environment?: string;
  criticality?: string;
  tags?: string[];
}

/**
 * Baseline Data
 */
export interface BaselineData {
  name: string;
  description?: string;
  ciIds: string[];
  approvedBy: string;
  effectiveDate?: Date;
  expirationDate?: Date;
  tags?: string[];
}

/**
 * Change Request Data
 */
export interface ChangeRequestData {
  ciId: string;
  changeType: ChangeType;
  priority: ChangePriority;
  title: string;
  description: string;
  justification: string;
  requestedBy: string;
  proposedChanges: Record<string, any>;
  implementationPlan?: string;
  rollbackPlan?: string;
  scheduledStartDate?: Date;
  scheduledEndDate?: Date;
  impactedCIs?: string[];
  requiredApprovers?: string[];
  attachments?: string[];
}

/**
 * CI Relationship Data
 */
export interface CIRelationshipData {
  sourceCI: string;
  targetCI: string;
  relationshipType: RelationshipType;
  description?: string;
  attributes?: Record<string, any>;
}

/**
 * Configuration Snapshot Data
 */
export interface ConfigurationSnapshotData {
  ciId: string;
  snapshotType: string;
  configuration: Record<string, any>;
  capturedBy: string;
  reason?: string;
  tags?: string[];
}

/**
 * Drift Detection Data
 */
export interface DriftDetectionData {
  ciId: string;
  baselineId: string;
  detectedBy?: string;
  driftDetails: DriftDetail[];
  severity: string;
}

/**
 * Drift Detail
 */
export interface DriftDetail {
  attribute: string;
  expectedValue: any;
  actualValue: any;
  deviation: string;
  impact: string;
}

/**
 * Configuration Audit Data
 */
export interface ConfigurationAuditData {
  ciIds: string[];
  auditType: string;
  auditedBy: string;
  scheduledDate: Date;
  scope: string;
  checklistItems?: string[];
}

/**
 * Version History Entry
 */
export interface VersionHistoryEntry {
  version: string;
  timestamp: Date;
  changedBy: string;
  changeType: string;
  changes: Record<string, any>;
  reason?: string;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Configuration Item Model
 */
@Table({
  tableName: 'configuration_items',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['ci_number'], unique: true },
    { fields: ['asset_id'], unique: true },
    { fields: ['ci_type'] },
    { fields: ['status'] },
    { fields: ['environment'] },
    { fields: ['owner'] },
  ],
})
export class ConfigurationItem extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'CI number' })
  @Column({ type: DataType.STRING(50), unique: true })
  @Index
  ciNumber!: string;

  @ApiProperty({ description: 'Asset ID' })
  @Column({ type: DataType.UUID, unique: true, allowNull: false })
  @Index
  assetId!: string;

  @ApiProperty({ description: 'CI type' })
  @Column({ type: DataType.ENUM(...Object.values(CIType)), allowNull: false })
  @Index
  ciType!: CIType;

  @ApiProperty({ description: 'Name' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  name!: string;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT })
  description?: string;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(CIStatus)), defaultValue: CIStatus.PLANNED })
  @Index
  status!: CIStatus;

  @ApiProperty({ description: 'Configuration attributes' })
  @Column({ type: DataType.JSONB, allowNull: false })
  attributes!: Record<string, any>;

  @ApiProperty({ description: 'Version' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  version!: string;

  @ApiProperty({ description: 'Owner user ID' })
  @Column({ type: DataType.UUID })
  @Index
  owner?: string;

  @ApiProperty({ description: 'Custodian user ID' })
  @Column({ type: DataType.UUID })
  custodian?: string;

  @ApiProperty({ description: 'Location' })
  @Column({ type: DataType.STRING(200) })
  location?: string;

  @ApiProperty({ description: 'Environment' })
  @Column({ type: DataType.STRING(50) })
  @Index
  environment?: string;

  @ApiProperty({ description: 'Criticality level' })
  @Column({ type: DataType.STRING(50) })
  criticality?: string;

  @ApiProperty({ description: 'Tags' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  tags?: string[];

  @ApiProperty({ description: 'Last verified date' })
  @Column({ type: DataType.DATE })
  lastVerifiedDate?: Date;

  @ApiProperty({ description: 'Last modified by' })
  @Column({ type: DataType.UUID })
  lastModifiedBy?: string;

  @ApiProperty({ description: 'Checksum for drift detection' })
  @Column({ type: DataType.STRING(100) })
  checksum?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => ConfigurationSnapshot)
  snapshots?: ConfigurationSnapshot[];

  @HasMany(() => CIRelationship, 'sourceCI')
  outgoingRelationships?: CIRelationship[];

  @HasMany(() => CIRelationship, 'targetCI')
  incomingRelationships?: CIRelationship[];

  @HasMany(() => ChangeRequest)
  changeRequests?: ChangeRequest[];

  @BeforeCreate
  static async generateCINumber(instance: ConfigurationItem) {
    if (!instance.ciNumber) {
      const count = await ConfigurationItem.count();
      const prefix = instance.ciType.toUpperCase().substring(0, 3);
      instance.ciNumber = `CI-${prefix}-${String(count + 1).padStart(7, '0')}`;
    }
  }

  @BeforeUpdate
  static async updateChecksum(instance: ConfigurationItem) {
    if (instance.changed('attributes')) {
      const crypto = require('crypto');
      const hash = crypto.createHash('sha256');
      hash.update(JSON.stringify(instance.attributes));
      instance.checksum = hash.digest('hex');
    }
  }
}

/**
 * Configuration Baseline Model
 */
@Table({
  tableName: 'configuration_baselines',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['baseline_number'], unique: true },
    { fields: ['status'] },
    { fields: ['effective_date'] },
  ],
})
export class ConfigurationBaseline extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Baseline number' })
  @Column({ type: DataType.STRING(50), unique: true })
  @Index
  baselineNumber!: string;

  @ApiProperty({ description: 'Name' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  name!: string;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT })
  description?: string;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(BaselineStatus)), defaultValue: BaselineStatus.DRAFT })
  @Index
  status!: BaselineStatus;

  @ApiProperty({ description: 'Configuration snapshot' })
  @Column({ type: DataType.JSONB, allowNull: false })
  configurationSnapshot!: Record<string, any>;

  @ApiProperty({ description: 'Included CI IDs' })
  @Column({ type: DataType.ARRAY(DataType.UUID), allowNull: false })
  ciIds!: string[];

  @ApiProperty({ description: 'Approved by user ID' })
  @Column({ type: DataType.UUID })
  approvedBy?: string;

  @ApiProperty({ description: 'Approval date' })
  @Column({ type: DataType.DATE })
  approvalDate?: Date;

  @ApiProperty({ description: 'Effective date' })
  @Column({ type: DataType.DATE })
  @Index
  effectiveDate?: Date;

  @ApiProperty({ description: 'Expiration date' })
  @Column({ type: DataType.DATE })
  expirationDate?: Date;

  @ApiProperty({ description: 'Tags' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  tags?: string[];

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => DriftRecord)
  driftRecords?: DriftRecord[];

  @BeforeCreate
  static async generateBaselineNumber(instance: ConfigurationBaseline) {
    if (!instance.baselineNumber) {
      const count = await ConfigurationBaseline.count();
      const year = new Date().getFullYear();
      instance.baselineNumber = `BL-${year}-${String(count + 1).padStart(6, '0')}`;
    }
  }
}

/**
 * Change Request Model
 */
@Table({
  tableName: 'change_requests',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['change_number'], unique: true },
    { fields: ['ci_id'] },
    { fields: ['status'] },
    { fields: ['priority'] },
    { fields: ['requested_by'] },
    { fields: ['scheduled_start_date'] },
  ],
})
export class ChangeRequest extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Change number' })
  @Column({ type: DataType.STRING(50), unique: true })
  @Index
  changeNumber!: string;

  @ApiProperty({ description: 'Configuration Item ID' })
  @ForeignKey(() => ConfigurationItem)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  ciId!: string;

  @ApiProperty({ description: 'Change type' })
  @Column({ type: DataType.ENUM(...Object.values(ChangeType)), allowNull: false })
  changeType!: ChangeType;

  @ApiProperty({ description: 'Priority' })
  @Column({ type: DataType.ENUM(...Object.values(ChangePriority)), allowNull: false })
  @Index
  priority!: ChangePriority;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(ChangeRequestStatus)), defaultValue: ChangeRequestStatus.DRAFT })
  @Index
  status!: ChangeRequestStatus;

  @ApiProperty({ description: 'Title' })
  @Column({ type: DataType.STRING(300), allowNull: false })
  title!: string;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT, allowNull: false })
  description!: string;

  @ApiProperty({ description: 'Justification' })
  @Column({ type: DataType.TEXT, allowNull: false })
  justification!: string;

  @ApiProperty({ description: 'Requested by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  requestedBy!: string;

  @ApiProperty({ description: 'Proposed changes' })
  @Column({ type: DataType.JSONB, allowNull: false })
  proposedChanges!: Record<string, any>;

  @ApiProperty({ description: 'Implementation plan' })
  @Column({ type: DataType.TEXT })
  implementationPlan?: string;

  @ApiProperty({ description: 'Rollback plan' })
  @Column({ type: DataType.TEXT })
  rollbackPlan?: string;

  @ApiProperty({ description: 'Scheduled start date' })
  @Column({ type: DataType.DATE })
  @Index
  scheduledStartDate?: Date;

  @ApiProperty({ description: 'Scheduled end date' })
  @Column({ type: DataType.DATE })
  scheduledEndDate?: Date;

  @ApiProperty({ description: 'Actual start date' })
  @Column({ type: DataType.DATE })
  actualStartDate?: Date;

  @ApiProperty({ description: 'Actual end date' })
  @Column({ type: DataType.DATE })
  actualEndDate?: Date;

  @ApiProperty({ description: 'Impacted CI IDs' })
  @Column({ type: DataType.ARRAY(DataType.UUID) })
  impactedCIs?: string[];

  @ApiProperty({ description: 'Required approvers' })
  @Column({ type: DataType.ARRAY(DataType.UUID) })
  requiredApprovers?: string[];

  @ApiProperty({ description: 'Approvals' })
  @Column({ type: DataType.JSONB })
  approvals?: Record<string, any>[];

  @ApiProperty({ description: 'Attachments' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  attachments?: string[];

  @ApiProperty({ description: 'Risk assessment' })
  @Column({ type: DataType.TEXT })
  riskAssessment?: string;

  @ApiProperty({ description: 'Implemented by user ID' })
  @Column({ type: DataType.UUID })
  implementedBy?: string;

  @ApiProperty({ description: 'Implementation notes' })
  @Column({ type: DataType.TEXT })
  implementationNotes?: string;

  @ApiProperty({ description: 'Rollback performed' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  rollbackPerformed!: boolean;

  @ApiProperty({ description: 'Rollback reason' })
  @Column({ type: DataType.TEXT })
  rollbackReason?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => ConfigurationItem)
  configurationItem?: ConfigurationItem;

  @BeforeCreate
  static async generateChangeNumber(instance: ChangeRequest) {
    if (!instance.changeNumber) {
      const count = await ChangeRequest.count();
      const year = new Date().getFullYear();
      const prefix = instance.changeType.substring(0, 1).toUpperCase();
      instance.changeNumber = `CHG-${prefix}${year}-${String(count + 1).padStart(6, '0')}`;
    }
  }
}

/**
 * CI Relationship Model
 */
@Table({
  tableName: 'ci_relationships',
  timestamps: true,
  indexes: [
    { fields: ['source_ci'] },
    { fields: ['target_ci'] },
    { fields: ['relationship_type'] },
  ],
})
export class CIRelationship extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Source CI ID' })
  @ForeignKey(() => ConfigurationItem)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  sourceCI!: string;

  @ApiProperty({ description: 'Target CI ID' })
  @ForeignKey(() => ConfigurationItem)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  targetCI!: string;

  @ApiProperty({ description: 'Relationship type' })
  @Column({ type: DataType.ENUM(...Object.values(RelationshipType)), allowNull: false })
  @Index
  relationshipType!: RelationshipType;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT })
  description?: string;

  @ApiProperty({ description: 'Relationship attributes' })
  @Column({ type: DataType.JSONB })
  attributes?: Record<string, any>;

  @ApiProperty({ description: 'Is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive!: boolean;

  @ApiProperty({ description: 'Established date' })
  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  establishedDate!: Date;

  @ApiProperty({ description: 'Severed date' })
  @Column({ type: DataType.DATE })
  severedDate?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => ConfigurationItem, 'sourceCI')
  sourceConfiguration?: ConfigurationItem;

  @BelongsTo(() => ConfigurationItem, 'targetCI')
  targetConfiguration?: ConfigurationItem;
}

/**
 * Configuration Snapshot Model
 */
@Table({
  tableName: 'configuration_snapshots',
  timestamps: true,
  indexes: [
    { fields: ['ci_id'] },
    { fields: ['snapshot_type'] },
    { fields: ['captured_at'] },
  ],
})
export class ConfigurationSnapshot extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Configuration Item ID' })
  @ForeignKey(() => ConfigurationItem)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  ciId!: string;

  @ApiProperty({ description: 'Snapshot type' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  @Index
  snapshotType!: string;

  @ApiProperty({ description: 'Configuration data' })
  @Column({ type: DataType.JSONB, allowNull: false })
  configuration!: Record<string, any>;

  @ApiProperty({ description: 'Captured at' })
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  @Index
  capturedAt!: Date;

  @ApiProperty({ description: 'Captured by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  capturedBy!: string;

  @ApiProperty({ description: 'Reason for snapshot' })
  @Column({ type: DataType.TEXT })
  reason?: string;

  @ApiProperty({ description: 'Tags' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  tags?: string[];

  @ApiProperty({ description: 'Checksum' })
  @Column({ type: DataType.STRING(100) })
  checksum?: string;

  @ApiProperty({ description: 'Size in bytes' })
  @Column({ type: DataType.INTEGER })
  sizeBytes?: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => ConfigurationItem)
  configurationItem?: ConfigurationItem;
}

/**
 * Drift Record Model
 */
@Table({
  tableName: 'drift_records',
  timestamps: true,
  indexes: [
    { fields: ['ci_id'] },
    { fields: ['baseline_id'] },
    { fields: ['status'] },
    { fields: ['detected_at'] },
  ],
})
export class DriftRecord extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Configuration Item ID' })
  @ForeignKey(() => ConfigurationItem)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  ciId!: string;

  @ApiProperty({ description: 'Baseline ID' })
  @ForeignKey(() => ConfigurationBaseline)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  baselineId!: string;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(DriftStatus)), defaultValue: DriftStatus.DRIFT_DETECTED })
  @Index
  status!: DriftStatus;

  @ApiProperty({ description: 'Drift details' })
  @Column({ type: DataType.JSONB, allowNull: false })
  driftDetails!: DriftDetail[];

  @ApiProperty({ description: 'Severity level' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  severity!: string;

  @ApiProperty({ description: 'Detected at' })
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  @Index
  detectedAt!: Date;

  @ApiProperty({ description: 'Detected by user ID' })
  @Column({ type: DataType.UUID })
  detectedBy?: string;

  @ApiProperty({ description: 'Resolved at' })
  @Column({ type: DataType.DATE })
  resolvedAt?: Date;

  @ApiProperty({ description: 'Resolved by user ID' })
  @Column({ type: DataType.UUID })
  resolvedBy?: string;

  @ApiProperty({ description: 'Resolution notes' })
  @Column({ type: DataType.TEXT })
  resolutionNotes?: string;

  @ApiProperty({ description: 'Auto-remediated' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  autoRemediated!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => ConfigurationItem)
  configurationItem?: ConfigurationItem;

  @BelongsTo(() => ConfigurationBaseline)
  baseline?: ConfigurationBaseline;
}

/**
 * Configuration Audit Model
 */
@Table({
  tableName: 'configuration_audits',
  timestamps: true,
  indexes: [
    { fields: ['audit_number'], unique: true },
    { fields: ['status'] },
    { fields: ['scheduled_date'] },
    { fields: ['audited_by'] },
  ],
})
export class ConfigurationAudit extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Audit number' })
  @Column({ type: DataType.STRING(50), unique: true })
  @Index
  auditNumber!: string;

  @ApiProperty({ description: 'Audit type' })
  @Column({ type: DataType.STRING(100), allowNull: false })
  auditType!: string;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(AuditStatus)), defaultValue: AuditStatus.SCHEDULED })
  @Index
  status!: AuditStatus;

  @ApiProperty({ description: 'CI IDs to audit' })
  @Column({ type: DataType.ARRAY(DataType.UUID), allowNull: false })
  ciIds!: string[];

  @ApiProperty({ description: 'Scheduled date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  scheduledDate!: Date;

  @ApiProperty({ description: 'Started date' })
  @Column({ type: DataType.DATE })
  startedDate?: Date;

  @ApiProperty({ description: 'Completed date' })
  @Column({ type: DataType.DATE })
  completedDate?: Date;

  @ApiProperty({ description: 'Audited by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  auditedBy!: string;

  @ApiProperty({ description: 'Scope description' })
  @Column({ type: DataType.TEXT, allowNull: false })
  scope!: string;

  @ApiProperty({ description: 'Checklist items' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  checklistItems?: string[];

  @ApiProperty({ description: 'Findings' })
  @Column({ type: DataType.JSONB })
  findings?: Record<string, any>[];

  @ApiProperty({ description: 'Compliance score' })
  @Column({ type: DataType.DECIMAL(5, 2) })
  complianceScore?: number;

  @ApiProperty({ description: 'Recommendations' })
  @Column({ type: DataType.TEXT })
  recommendations?: string;

  @ApiProperty({ description: 'Attachments' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  attachments?: string[];

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BeforeCreate
  static async generateAuditNumber(instance: ConfigurationAudit) {
    if (!instance.auditNumber) {
      const count = await ConfigurationAudit.count();
      const year = new Date().getFullYear();
      instance.auditNumber = `AUD-${year}-${String(count + 1).padStart(6, '0')}`;
    }
  }
}

/**
 * Version History Model
 */
@Table({
  tableName: 'configuration_version_history',
  timestamps: true,
  indexes: [
    { fields: ['ci_id'] },
    { fields: ['version'] },
    { fields: ['changed_at'] },
  ],
})
export class ConfigurationVersionHistory extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Configuration Item ID' })
  @ForeignKey(() => ConfigurationItem)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  ciId!: string;

  @ApiProperty({ description: 'Version' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  @Index
  version!: string;

  @ApiProperty({ description: 'Previous version' })
  @Column({ type: DataType.STRING(50) })
  previousVersion?: string;

  @ApiProperty({ description: 'Changed at' })
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  @Index
  changedAt!: Date;

  @ApiProperty({ description: 'Changed by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  changedBy!: string;

  @ApiProperty({ description: 'Change type' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  changeType!: string;

  @ApiProperty({ description: 'Changes made' })
  @Column({ type: DataType.JSONB, allowNull: false })
  changes!: Record<string, any>;

  @ApiProperty({ description: 'Previous configuration' })
  @Column({ type: DataType.JSONB })
  previousConfiguration?: Record<string, any>;

  @ApiProperty({ description: 'New configuration' })
  @Column({ type: DataType.JSONB, allowNull: false })
  newConfiguration!: Record<string, any>;

  @ApiProperty({ description: 'Change reason' })
  @Column({ type: DataType.TEXT })
  reason?: string;

  @ApiProperty({ description: 'Change request ID' })
  @Column({ type: DataType.UUID })
  changeRequestId?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => ConfigurationItem)
  configurationItem?: ConfigurationItem;
}

// ============================================================================
// CONFIGURATION ITEM FUNCTIONS
// ============================================================================

/**
 * Creates a configuration item
 *
 * @param data - Configuration item data
 * @param transaction - Optional database transaction
 * @returns Created configuration item
 *
 * @example
 * ```typescript
 * const ci = await createConfigurationItem({
 *   assetId: 'asset-123',
 *   ciType: CIType.SERVER,
 *   name: 'Production Web Server 01',
 *   attributes: {
 *     hostname: 'prod-web-01',
 *     ipAddress: '10.0.1.50',
 *     os: 'Ubuntu 22.04 LTS',
 *     cpu: '16 cores',
 *     memory: '64GB'
 *   },
 *   version: '1.0.0',
 *   environment: 'production'
 * });
 * ```
 */
export async function createConfigurationItem(
  data: ConfigurationItemData,
  transaction?: Transaction
): Promise<ConfigurationItem> {
  const ci = await ConfigurationItem.create(
    {
      ...data,
      status: CIStatus.PLANNED,
    },
    { transaction }
  );

  // Create initial snapshot
  await createConfigurationSnapshot({
    ciId: ci.id,
    snapshotType: 'initial',
    configuration: ci.attributes,
    capturedBy: data.owner || 'system',
    reason: 'Initial configuration',
    tags: ['initial', 'baseline'],
  }, transaction);

  return ci;
}

/**
 * Updates configuration item
 *
 * @param ciId - CI identifier
 * @param updates - Fields to update
 * @param userId - User making the update
 * @param transaction - Optional database transaction
 * @returns Updated CI
 *
 * @example
 * ```typescript
 * await updateConfigurationItem('ci-123', {
 *   attributes: { memory: '128GB' },
 *   version: '1.1.0'
 * }, 'user-456');
 * ```
 */
export async function updateConfigurationItem(
  ciId: string,
  updates: Partial<ConfigurationItem>,
  userId: string,
  transaction?: Transaction
): Promise<ConfigurationItem> {
  const ci = await ConfigurationItem.findByPk(ciId, { transaction });
  if (!ci) {
    throw new NotFoundException(`Configuration item ${ciId} not found`);
  }

  const previousConfig = { ...ci.toJSON() };
  await ci.update({ ...updates, lastModifiedBy: userId }, { transaction });

  // Create version history entry
  if (updates.attributes || updates.version) {
    await ConfigurationVersionHistory.create({
      ciId: ci.id,
      version: updates.version || ci.version,
      previousVersion: previousConfig.version,
      changedAt: new Date(),
      changedBy: userId,
      changeType: 'update',
      changes: updates,
      previousConfiguration: previousConfig.attributes,
      newConfiguration: ci.attributes,
    }, { transaction });

    // Create snapshot
    await createConfigurationSnapshot({
      ciId: ci.id,
      snapshotType: 'update',
      configuration: ci.attributes,
      capturedBy: userId,
      reason: 'Configuration updated',
    }, transaction);
  }

  return ci;
}

/**
 * Gets configuration item by ID
 *
 * @param ciId - CI identifier
 * @param includeRelationships - Include relationships
 * @returns Configuration item
 *
 * @example
 * ```typescript
 * const ci = await getConfigurationItem('ci-123', true);
 * ```
 */
export async function getConfigurationItem(
  ciId: string,
  includeRelationships: boolean = false
): Promise<ConfigurationItem> {
  const include: any[] = [];

  if (includeRelationships) {
    include.push(
      { model: CIRelationship, as: 'outgoingRelationships' },
      { model: CIRelationship, as: 'incomingRelationships' }
    );
  }

  const ci = await ConfigurationItem.findByPk(ciId, { include });
  if (!ci) {
    throw new NotFoundException(`Configuration item ${ciId} not found`);
  }

  return ci;
}

/**
 * Gets CIs by type
 *
 * @param ciType - CI type
 * @param options - Query options
 * @returns Configuration items
 *
 * @example
 * ```typescript
 * const servers = await getConfigurationItemsByType(CIType.SERVER);
 * ```
 */
export async function getConfigurationItemsByType(
  ciType: CIType,
  options: FindOptions = {}
): Promise<ConfigurationItem[]> {
  return ConfigurationItem.findAll({
    where: { ciType },
    order: [['name', 'ASC']],
    ...options,
  });
}

/**
 * Gets CIs by environment
 *
 * @param environment - Environment name
 * @returns Configuration items
 *
 * @example
 * ```typescript
 * const prodCIs = await getConfigurationItemsByEnvironment('production');
 * ```
 */
export async function getConfigurationItemsByEnvironment(
  environment: string
): Promise<ConfigurationItem[]> {
  return ConfigurationItem.findAll({
    where: { environment },
    order: [['ciType', 'ASC'], ['name', 'ASC']],
  });
}

/**
 * Verifies configuration item
 *
 * @param ciId - CI identifier
 * @param userId - User verifying
 * @param transaction - Optional database transaction
 * @returns Updated CI
 *
 * @example
 * ```typescript
 * await verifyConfigurationItem('ci-123', 'user-456');
 * ```
 */
export async function verifyConfigurationItem(
  ciId: string,
  userId: string,
  transaction?: Transaction
): Promise<ConfigurationItem> {
  const ci = await ConfigurationItem.findByPk(ciId, { transaction });
  if (!ci) {
    throw new NotFoundException(`Configuration item ${ciId} not found`);
  }

  await ci.update({
    lastVerifiedDate: new Date(),
    lastModifiedBy: userId,
  }, { transaction });

  return ci;
}

/**
 * Decommissions configuration item
 *
 * @param ciId - CI identifier
 * @param userId - User decommissioning
 * @param transaction - Optional database transaction
 * @returns Updated CI
 *
 * @example
 * ```typescript
 * await decommissionConfigurationItem('ci-123', 'user-456');
 * ```
 */
export async function decommissionConfigurationItem(
  ciId: string,
  userId: string,
  transaction?: Transaction
): Promise<ConfigurationItem> {
  const ci = await ConfigurationItem.findByPk(ciId, { transaction });
  if (!ci) {
    throw new NotFoundException(`Configuration item ${ciId} not found`);
  }

  await ci.update({
    status: CIStatus.DECOMMISSIONED,
    lastModifiedBy: userId,
  }, { transaction });

  // Sever all relationships
  await CIRelationship.update(
    { isActive: false, severedDate: new Date() },
    {
      where: {
        [Op.or]: [{ sourceCI: ciId }, { targetCI: ciId }],
        isActive: true,
      },
      transaction,
    }
  );

  return ci;
}

// ============================================================================
// BASELINE FUNCTIONS
// ============================================================================

/**
 * Creates configuration baseline
 *
 * @param data - Baseline data
 * @param transaction - Optional database transaction
 * @returns Created baseline
 *
 * @example
 * ```typescript
 * const baseline = await createBaseline({
 *   name: 'Production Baseline Q4 2024',
 *   description: 'Quarterly production environment baseline',
 *   ciIds: ['ci-1', 'ci-2', 'ci-3'],
 *   approvedBy: 'manager-456',
 *   effectiveDate: new Date('2024-10-01')
 * });
 * ```
 */
export async function createBaseline(
  data: BaselineData,
  transaction?: Transaction
): Promise<ConfigurationBaseline> {
  // Fetch all CIs
  const cis = await ConfigurationItem.findAll({
    where: { id: { [Op.in]: data.ciIds } },
    transaction,
  });

  if (cis.length !== data.ciIds.length) {
    throw new BadRequestException('Some CIs not found');
  }

  // Create snapshot
  const snapshot: Record<string, any> = {};
  cis.forEach(ci => {
    snapshot[ci.id] = {
      ciNumber: ci.ciNumber,
      name: ci.name,
      ciType: ci.ciType,
      version: ci.version,
      attributes: ci.attributes,
      checksum: ci.checksum,
    };
  });

  const baseline = await ConfigurationBaseline.create(
    {
      ...data,
      configurationSnapshot: snapshot,
      status: BaselineStatus.DRAFT,
    },
    { transaction }
  );

  return baseline;
}

/**
 * Approves baseline
 *
 * @param baselineId - Baseline identifier
 * @param approverId - Approver user ID
 * @param transaction - Optional database transaction
 * @returns Updated baseline
 *
 * @example
 * ```typescript
 * await approveBaseline('baseline-123', 'manager-456');
 * ```
 */
export async function approveBaseline(
  baselineId: string,
  approverId: string,
  transaction?: Transaction
): Promise<ConfigurationBaseline> {
  const baseline = await ConfigurationBaseline.findByPk(baselineId, { transaction });
  if (!baseline) {
    throw new NotFoundException(`Baseline ${baselineId} not found`);
  }

  await baseline.update({
    status: BaselineStatus.APPROVED,
    approvedBy: approverId,
    approvalDate: new Date(),
  }, { transaction });

  return baseline;
}

/**
 * Activates baseline
 *
 * @param baselineId - Baseline identifier
 * @param transaction - Optional database transaction
 * @returns Updated baseline
 *
 * @example
 * ```typescript
 * await activateBaseline('baseline-123');
 * ```
 */
export async function activateBaseline(
  baselineId: string,
  transaction?: Transaction
): Promise<ConfigurationBaseline> {
  const baseline = await ConfigurationBaseline.findByPk(baselineId, { transaction });
  if (!baseline) {
    throw new NotFoundException(`Baseline ${baselineId} not found`);
  }

  if (baseline.status !== BaselineStatus.APPROVED) {
    throw new BadRequestException('Baseline must be approved before activation');
  }

  // Deactivate other active baselines for same CIs
  await ConfigurationBaseline.update(
    { status: BaselineStatus.ARCHIVED },
    {
      where: {
        status: BaselineStatus.ACTIVE,
        id: { [Op.ne]: baselineId },
      },
      transaction,
    }
  );

  await baseline.update({
    status: BaselineStatus.ACTIVE,
    effectiveDate: new Date(),
  }, { transaction });

  return baseline;
}

/**
 * Gets active baselines
 *
 * @returns Active baselines
 *
 * @example
 * ```typescript
 * const activeBaselines = await getActiveBaselines();
 * ```
 */
export async function getActiveBaselines(): Promise<ConfigurationBaseline[]> {
  return ConfigurationBaseline.findAll({
    where: { status: BaselineStatus.ACTIVE },
    order: [['effectiveDate', 'DESC']],
  });
}

/**
 * Compares CI against baseline
 *
 * @param ciId - CI identifier
 * @param baselineId - Baseline identifier
 * @returns Comparison result
 *
 * @example
 * ```typescript
 * const diff = await compareToBaseline('ci-123', 'baseline-456');
 * ```
 */
export async function compareToBaseline(
  ciId: string,
  baselineId: string
): Promise<{ matches: boolean; differences: DriftDetail[] }> {
  const ci = await ConfigurationItem.findByPk(ciId);
  if (!ci) {
    throw new NotFoundException(`CI ${ciId} not found`);
  }

  const baseline = await ConfigurationBaseline.findByPk(baselineId);
  if (!baseline) {
    throw new NotFoundException(`Baseline ${baselineId} not found`);
  }

  const baselineConfig = baseline.configurationSnapshot[ciId];
  if (!baselineConfig) {
    throw new BadRequestException('CI not included in baseline');
  }

  const differences: DriftDetail[] = [];

  // Compare version
  if (ci.version !== baselineConfig.version) {
    differences.push({
      attribute: 'version',
      expectedValue: baselineConfig.version,
      actualValue: ci.version,
      deviation: 'Version mismatch',
      impact: 'medium',
    });
  }

  // Compare attributes
  const baselineAttrs = baselineConfig.attributes;
  const currentAttrs = ci.attributes;

  for (const key in baselineAttrs) {
    if (JSON.stringify(baselineAttrs[key]) !== JSON.stringify(currentAttrs[key])) {
      differences.push({
        attribute: key,
        expectedValue: baselineAttrs[key],
        actualValue: currentAttrs[key],
        deviation: 'Attribute changed',
        impact: 'low',
      });
    }
  }

  return {
    matches: differences.length === 0,
    differences,
  };
}

// ============================================================================
// CHANGE REQUEST FUNCTIONS
// ============================================================================

/**
 * Creates change request
 *
 * @param data - Change request data
 * @param transaction - Optional database transaction
 * @returns Created change request
 *
 * @example
 * ```typescript
 * const change = await createChangeRequest({
 *   ciId: 'ci-123',
 *   changeType: ChangeType.NORMAL,
 *   priority: ChangePriority.MEDIUM,
 *   title: 'Upgrade OS to Ubuntu 24.04',
 *   description: 'Upgrade operating system for security patches',
 *   justification: 'Current version EOL in 3 months',
 *   requestedBy: 'user-456',
 *   proposedChanges: { os: 'Ubuntu 24.04 LTS' },
 *   implementationPlan: 'Take snapshot, upgrade, test, validate',
 *   rollbackPlan: 'Restore from snapshot'
 * });
 * ```
 */
export async function createChangeRequest(
  data: ChangeRequestData,
  transaction?: Transaction
): Promise<ChangeRequest> {
  const ci = await ConfigurationItem.findByPk(data.ciId, { transaction });
  if (!ci) {
    throw new NotFoundException(`CI ${data.ciId} not found`);
  }

  const changeRequest = await ChangeRequest.create(
    {
      ...data,
      status: ChangeRequestStatus.DRAFT,
    },
    { transaction }
  );

  return changeRequest;
}

/**
 * Submits change request for approval
 *
 * @param changeId - Change request ID
 * @param transaction - Optional database transaction
 * @returns Updated change request
 *
 * @example
 * ```typescript
 * await submitChangeRequest('change-123');
 * ```
 */
export async function submitChangeRequest(
  changeId: string,
  transaction?: Transaction
): Promise<ChangeRequest> {
  const change = await ChangeRequest.findByPk(changeId, { transaction });
  if (!change) {
    throw new NotFoundException(`Change request ${changeId} not found`);
  }

  if (change.status !== ChangeRequestStatus.DRAFT) {
    throw new BadRequestException('Only draft changes can be submitted');
  }

  await change.update({
    status: ChangeRequestStatus.SUBMITTED,
  }, { transaction });

  return change;
}

/**
 * Approves change request
 *
 * @param changeId - Change request ID
 * @param approverId - Approver user ID
 * @param comments - Approval comments
 * @param transaction - Optional database transaction
 * @returns Updated change request
 *
 * @example
 * ```typescript
 * await approveChangeRequest('change-123', 'manager-456', 'Approved for implementation');
 * ```
 */
export async function approveChangeRequest(
  changeId: string,
  approverId: string,
  comments?: string,
  transaction?: Transaction
): Promise<ChangeRequest> {
  const change = await ChangeRequest.findByPk(changeId, { transaction });
  if (!change) {
    throw new NotFoundException(`Change request ${changeId} not found`);
  }

  const approvals = change.approvals || [];
  approvals.push({
    approverId,
    approvedAt: new Date(),
    comments,
  });

  await change.update({
    approvals,
    status: ChangeRequestStatus.APPROVED,
  }, { transaction });

  return change;
}

/**
 * Rejects change request
 *
 * @param changeId - Change request ID
 * @param approverId - Approver user ID
 * @param reason - Rejection reason
 * @param transaction - Optional database transaction
 * @returns Updated change request
 *
 * @example
 * ```typescript
 * await rejectChangeRequest('change-123', 'manager-456', 'Insufficient testing plan');
 * ```
 */
export async function rejectChangeRequest(
  changeId: string,
  approverId: string,
  reason: string,
  transaction?: Transaction
): Promise<ChangeRequest> {
  const change = await ChangeRequest.findByPk(changeId, { transaction });
  if (!change) {
    throw new NotFoundException(`Change request ${changeId} not found`);
  }

  const approvals = change.approvals || [];
  approvals.push({
    approverId,
    rejectedAt: new Date(),
    reason,
  });

  await change.update({
    approvals,
    status: ChangeRequestStatus.REJECTED,
  }, { transaction });

  return change;
}

/**
 * Implements change request
 *
 * @param changeId - Change request ID
 * @param implementerId - User implementing
 * @param notes - Implementation notes
 * @param transaction - Optional database transaction
 * @returns Updated change request
 *
 * @example
 * ```typescript
 * await implementChangeRequest('change-123', 'tech-789', 'Upgrade completed successfully');
 * ```
 */
export async function implementChangeRequest(
  changeId: string,
  implementerId: string,
  notes?: string,
  transaction?: Transaction
): Promise<ChangeRequest> {
  const change = await ChangeRequest.findByPk(changeId, {
    include: [{ model: ConfigurationItem }],
    transaction,
  });

  if (!change) {
    throw new NotFoundException(`Change request ${changeId} not found`);
  }

  if (change.status !== ChangeRequestStatus.APPROVED && change.status !== ChangeRequestStatus.SCHEDULED) {
    throw new BadRequestException('Change must be approved or scheduled');
  }

  // Update CI with proposed changes
  const ci = change.configurationItem!;
  const newAttributes = { ...ci.attributes, ...change.proposedChanges };

  await updateConfigurationItem(
    ci.id,
    { attributes: newAttributes },
    implementerId,
    transaction
  );

  await change.update({
    status: ChangeRequestStatus.COMPLETED,
    actualStartDate: new Date(),
    actualEndDate: new Date(),
    implementedBy: implementerId,
    implementationNotes: notes,
  }, { transaction });

  return change;
}

/**
 * Rolls back change request
 *
 * @param changeId - Change request ID
 * @param userId - User performing rollback
 * @param reason - Rollback reason
 * @param transaction - Optional database transaction
 * @returns Updated change request
 *
 * @example
 * ```typescript
 * await rollbackChangeRequest('change-123', 'tech-789', 'Service degradation detected');
 * ```
 */
export async function rollbackChangeRequest(
  changeId: string,
  userId: string,
  reason: string,
  transaction?: Transaction
): Promise<ChangeRequest> {
  const change = await ChangeRequest.findByPk(changeId, { transaction });
  if (!change) {
    throw new NotFoundException(`Change request ${changeId} not found`);
  }

  if (change.status !== ChangeRequestStatus.COMPLETED) {
    throw new BadRequestException('Only completed changes can be rolled back');
  }

  // Find version history to restore
  const history = await ConfigurationVersionHistory.findOne({
    where: {
      ciId: change.ciId,
      changeRequestId: changeId,
    },
    transaction,
  });

  if (history && history.previousConfiguration) {
    await updateConfigurationItem(
      change.ciId,
      { attributes: history.previousConfiguration },
      userId,
      transaction
    );
  }

  await change.update({
    status: ChangeRequestStatus.ROLLED_BACK,
    rollbackPerformed: true,
    rollbackReason: reason,
  }, { transaction });

  return change;
}

/**
 * Gets change requests by status
 *
 * @param status - Change request status
 * @returns Change requests
 *
 * @example
 * ```typescript
 * const pending = await getChangeRequestsByStatus(ChangeRequestStatus.SUBMITTED);
 * ```
 */
export async function getChangeRequestsByStatus(
  status: ChangeRequestStatus
): Promise<ChangeRequest[]> {
  return ChangeRequest.findAll({
    where: { status },
    order: [['priority', 'DESC'], ['createdAt', 'ASC']],
    include: [{ model: ConfigurationItem }],
  });
}

/**
 * Analyzes change impact
 *
 * @param changeId - Change request ID
 * @returns Impact analysis
 *
 * @example
 * ```typescript
 * const impact = await analyzeChangeImpact('change-123');
 * ```
 */
export async function analyzeChangeImpact(
  changeId: string
): Promise<{
  directImpact: ConfigurationItem[];
  indirectImpact: ConfigurationItem[];
  totalImpacted: number;
}> {
  const change = await ChangeRequest.findByPk(changeId);
  if (!change) {
    throw new NotFoundException(`Change request ${changeId} not found`);
  }

  // Get direct relationships
  const directRelationships = await CIRelationship.findAll({
    where: {
      [Op.or]: [
        { sourceCI: change.ciId },
        { targetCI: change.ciId },
      ],
      isActive: true,
    },
    include: [
      { model: ConfigurationItem, as: 'sourceConfiguration' },
      { model: ConfigurationItem, as: 'targetConfiguration' },
    ],
  });

  const directImpact: ConfigurationItem[] = [];
  const directImpactIds = new Set<string>();

  directRelationships.forEach(rel => {
    if (rel.sourceCI === change.ciId && rel.targetConfiguration) {
      directImpact.push(rel.targetConfiguration);
      directImpactIds.add(rel.targetCI);
    } else if (rel.targetCI === change.ciId && rel.sourceConfiguration) {
      directImpact.push(rel.sourceConfiguration);
      directImpactIds.add(rel.sourceCI);
    }
  });

  // Get indirect relationships (2 levels deep)
  const indirectRelationships = await CIRelationship.findAll({
    where: {
      [Op.or]: [
        { sourceCI: { [Op.in]: Array.from(directImpactIds) } },
        { targetCI: { [Op.in]: Array.from(directImpactIds) } },
      ],
      isActive: true,
    },
    include: [
      { model: ConfigurationItem, as: 'sourceConfiguration' },
      { model: ConfigurationItem, as: 'targetConfiguration' },
    ],
  });

  const indirectImpact: ConfigurationItem[] = [];
  const indirectImpactIds = new Set<string>();

  indirectRelationships.forEach(rel => {
    if (!directImpactIds.has(rel.sourceCI) && !directImpactIds.has(rel.targetCI)) {
      if (rel.sourceConfiguration && !indirectImpactIds.has(rel.sourceCI)) {
        indirectImpact.push(rel.sourceConfiguration);
        indirectImpactIds.add(rel.sourceCI);
      }
      if (rel.targetConfiguration && !indirectImpactIds.has(rel.targetCI)) {
        indirectImpact.push(rel.targetConfiguration);
        indirectImpactIds.add(rel.targetCI);
      }
    }
  });

  return {
    directImpact,
    indirectImpact,
    totalImpacted: directImpact.length + indirectImpact.length,
  };
}

// ============================================================================
// RELATIONSHIP FUNCTIONS
// ============================================================================

/**
 * Creates CI relationship
 *
 * @param data - Relationship data
 * @param transaction - Optional database transaction
 * @returns Created relationship
 *
 * @example
 * ```typescript
 * await createCIRelationship({
 *   sourceCI: 'ci-app-1',
 *   targetCI: 'ci-db-1',
 *   relationshipType: RelationshipType.DEPENDS_ON,
 *   description: 'Application depends on database'
 * });
 * ```
 */
export async function createCIRelationship(
  data: CIRelationshipData,
  transaction?: Transaction
): Promise<CIRelationship> {
  // Verify CIs exist
  const sourceCi = await ConfigurationItem.findByPk(data.sourceCI, { transaction });
  const targetCi = await ConfigurationItem.findByPk(data.targetCI, { transaction });

  if (!sourceCi || !targetCi) {
    throw new NotFoundException('One or both CIs not found');
  }

  // Check for existing relationship
  const existing = await CIRelationship.findOne({
    where: {
      sourceCI: data.sourceCI,
      targetCI: data.targetCI,
      relationshipType: data.relationshipType,
      isActive: true,
    },
    transaction,
  });

  if (existing) {
    throw new ConflictException('Relationship already exists');
  }

  const relationship = await CIRelationship.create(data, { transaction });
  return relationship;
}

/**
 * Removes CI relationship
 *
 * @param relationshipId - Relationship ID
 * @param transaction - Optional database transaction
 * @returns Updated relationship
 *
 * @example
 * ```typescript
 * await removeCIRelationship('rel-123');
 * ```
 */
export async function removeCIRelationship(
  relationshipId: string,
  transaction?: Transaction
): Promise<CIRelationship> {
  const relationship = await CIRelationship.findByPk(relationshipId, { transaction });
  if (!relationship) {
    throw new NotFoundException(`Relationship ${relationshipId} not found`);
  }

  await relationship.update({
    isActive: false,
    severedDate: new Date(),
  }, { transaction });

  return relationship;
}

/**
 * Gets CI relationships
 *
 * @param ciId - CI identifier
 * @param direction - 'outgoing', 'incoming', or 'both'
 * @returns Relationships
 *
 * @example
 * ```typescript
 * const rels = await getCIRelationships('ci-123', 'both');
 * ```
 */
export async function getCIRelationships(
  ciId: string,
  direction: 'outgoing' | 'incoming' | 'both' = 'both'
): Promise<CIRelationship[]> {
  const where: WhereOptions = { isActive: true };

  if (direction === 'outgoing') {
    where.sourceCI = ciId;
  } else if (direction === 'incoming') {
    where.targetCI = ciId;
  } else {
    where[Op.or] = [{ sourceCI: ciId }, { targetCI: ciId }];
  }

  return CIRelationship.findAll({
    where,
    include: [
      { model: ConfigurationItem, as: 'sourceConfiguration' },
      { model: ConfigurationItem, as: 'targetConfiguration' },
    ],
  });
}

/**
 * Gets CI dependency tree
 *
 * @param ciId - CI identifier
 * @param depth - Maximum depth
 * @returns Dependency tree
 *
 * @example
 * ```typescript
 * const tree = await getCIDependencyTree('ci-123', 3);
 * ```
 */
export async function getCIDependencyTree(
  ciId: string,
  depth: number = 3
): Promise<any> {
  const visited = new Set<string>();

  async function buildTree(currentId: string, currentDepth: number): Promise<any> {
    if (currentDepth > depth || visited.has(currentId)) {
      return null;
    }

    visited.add(currentId);

    const ci = await ConfigurationItem.findByPk(currentId);
    if (!ci) return null;

    const dependencies = await CIRelationship.findAll({
      where: {
        sourceCI: currentId,
        relationshipType: RelationshipType.DEPENDS_ON,
        isActive: true,
      },
      include: [{ model: ConfigurationItem, as: 'targetConfiguration' }],
    });

    const children = await Promise.all(
      dependencies.map(dep => buildTree(dep.targetCI, currentDepth + 1))
    );

    return {
      ci: ci.toJSON(),
      dependencies: children.filter(c => c !== null),
    };
  }

  return buildTree(ciId, 0);
}

// ============================================================================
// SNAPSHOT FUNCTIONS
// ============================================================================

/**
 * Creates configuration snapshot
 *
 * @param data - Snapshot data
 * @param transaction - Optional database transaction
 * @returns Created snapshot
 *
 * @example
 * ```typescript
 * await createConfigurationSnapshot({
 *   ciId: 'ci-123',
 *   snapshotType: 'scheduled',
 *   configuration: currentConfig,
 *   capturedBy: 'user-456',
 *   reason: 'Weekly backup'
 * });
 * ```
 */
export async function createConfigurationSnapshot(
  data: ConfigurationSnapshotData,
  transaction?: Transaction
): Promise<ConfigurationSnapshot> {
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(data.configuration));
  const checksum = hash.digest('hex');

  const sizeBytes = Buffer.byteLength(JSON.stringify(data.configuration), 'utf8');

  const snapshot = await ConfigurationSnapshot.create(
    {
      ...data,
      checksum,
      sizeBytes,
    },
    { transaction }
  );

  return snapshot;
}

/**
 * Gets CI snapshots
 *
 * @param ciId - CI identifier
 * @param limit - Maximum snapshots to return
 * @returns Snapshots
 *
 * @example
 * ```typescript
 * const snapshots = await getCISnapshots('ci-123', 10);
 * ```
 */
export async function getCISnapshots(
  ciId: string,
  limit: number = 50
): Promise<ConfigurationSnapshot[]> {
  return ConfigurationSnapshot.findAll({
    where: { ciId },
    order: [['capturedAt', 'DESC']],
    limit,
  });
}

/**
 * Restores from snapshot
 *
 * @param snapshotId - Snapshot ID
 * @param userId - User restoring
 * @param transaction - Optional database transaction
 * @returns Updated CI
 *
 * @example
 * ```typescript
 * await restoreFromSnapshot('snapshot-123', 'user-456');
 * ```
 */
export async function restoreFromSnapshot(
  snapshotId: string,
  userId: string,
  transaction?: Transaction
): Promise<ConfigurationItem> {
  const snapshot = await ConfigurationSnapshot.findByPk(snapshotId, { transaction });
  if (!snapshot) {
    throw new NotFoundException(`Snapshot ${snapshotId} not found`);
  }

  const ci = await updateConfigurationItem(
    snapshot.ciId,
    { attributes: snapshot.configuration },
    userId,
    transaction
  );

  // Create new snapshot marking restore
  await createConfigurationSnapshot({
    ciId: ci.id,
    snapshotType: 'restore',
    configuration: snapshot.configuration,
    capturedBy: userId,
    reason: `Restored from snapshot ${snapshotId}`,
    tags: ['restore'],
  }, transaction);

  return ci;
}

// ============================================================================
// DRIFT DETECTION FUNCTIONS
// ============================================================================

/**
 * Detects configuration drift
 *
 * @param data - Drift detection data
 * @param transaction - Optional database transaction
 * @returns Drift record
 *
 * @example
 * ```typescript
 * const drift = await detectConfigurationDrift({
 *   ciId: 'ci-123',
 *   baselineId: 'baseline-456',
 *   driftDetails: [
 *     {
 *       attribute: 'memory',
 *       expectedValue: '64GB',
 *       actualValue: '32GB',
 *       deviation: 'Memory reduced',
 *       impact: 'high'
 *     }
 *   ],
 *   severity: 'high'
 * });
 * ```
 */
export async function detectConfigurationDrift(
  data: DriftDetectionData,
  transaction?: Transaction
): Promise<DriftRecord> {
  const drift = await DriftRecord.create(
    {
      ...data,
      status: DriftStatus.DRIFT_DETECTED,
      detectedAt: new Date(),
    },
    { transaction }
  );

  return drift;
}

/**
 * Scans for drift against baseline
 *
 * @param baselineId - Baseline ID
 * @returns Drift records
 *
 * @example
 * ```typescript
 * const drifts = await scanForDrift('baseline-123');
 * ```
 */
export async function scanForDrift(
  baselineId: string
): Promise<DriftRecord[]> {
  const baseline = await ConfigurationBaseline.findByPk(baselineId);
  if (!baseline) {
    throw new NotFoundException(`Baseline ${baselineId} not found`);
  }

  const drifts: DriftRecord[] = [];

  for (const ciId of baseline.ciIds) {
    const comparison = await compareToBaseline(ciId, baselineId);

    if (!comparison.matches) {
      const severity = comparison.differences.some(d => d.impact === 'high')
        ? 'high'
        : comparison.differences.some(d => d.impact === 'medium')
        ? 'medium'
        : 'low';

      const drift = await detectConfigurationDrift({
        ciId,
        baselineId: baseline.id,
        driftDetails: comparison.differences,
        severity,
      });

      drifts.push(drift);
    }
  }

  return drifts;
}

/**
 * Remediates drift
 *
 * @param driftId - Drift record ID
 * @param userId - User remediating
 * @param notes - Remediation notes
 * @param transaction - Optional database transaction
 * @returns Updated drift record
 *
 * @example
 * ```typescript
 * await remediateDrift('drift-123', 'user-456', 'Restored to baseline configuration');
 * ```
 */
export async function remediateDrift(
  driftId: string,
  userId: string,
  notes?: string,
  transaction?: Transaction
): Promise<DriftRecord> {
  const drift = await DriftRecord.findByPk(driftId, {
    include: [{ model: ConfigurationBaseline }],
    transaction,
  });

  if (!drift) {
    throw new NotFoundException(`Drift record ${driftId} not found`);
  }

  // Restore to baseline
  const baselineConfig = drift.baseline!.configurationSnapshot[drift.ciId];
  if (baselineConfig) {
    await updateConfigurationItem(
      drift.ciId,
      { attributes: baselineConfig.attributes },
      userId,
      transaction
    );
  }

  await drift.update({
    status: DriftStatus.REMEDIATED,
    resolvedAt: new Date(),
    resolvedBy: userId,
    resolutionNotes: notes,
  }, { transaction });

  return drift;
}

/**
 * Gets drift records by status
 *
 * @param status - Drift status
 * @returns Drift records
 *
 * @example
 * ```typescript
 * const activeDrifts = await getDriftRecordsByStatus(DriftStatus.DRIFT_DETECTED);
 * ```
 */
export async function getDriftRecordsByStatus(
  status: DriftStatus
): Promise<DriftRecord[]> {
  return DriftRecord.findAll({
    where: { status },
    order: [['severity', 'DESC'], ['detectedAt', 'DESC']],
    include: [
      { model: ConfigurationItem },
      { model: ConfigurationBaseline },
    ],
  });
}

// ============================================================================
// AUDIT FUNCTIONS
// ============================================================================

/**
 * Creates configuration audit
 *
 * @param data - Audit data
 * @param transaction - Optional database transaction
 * @returns Created audit
 *
 * @example
 * ```typescript
 * const audit = await createConfigurationAudit({
 *   ciIds: ['ci-1', 'ci-2', 'ci-3'],
 *   auditType: 'compliance',
 *   auditedBy: 'auditor-123',
 *   scheduledDate: new Date('2024-12-01'),
 *   scope: 'Production environment quarterly audit',
 *   checklistItems: ['Verify configuration', 'Check compliance', 'Review changes']
 * });
 * ```
 */
export async function createConfigurationAudit(
  data: ConfigurationAuditData,
  transaction?: Transaction
): Promise<ConfigurationAudit> {
  const audit = await ConfigurationAudit.create(
    {
      ...data,
      status: AuditStatus.SCHEDULED,
    },
    { transaction }
  );

  return audit;
}

/**
 * Starts configuration audit
 *
 * @param auditId - Audit ID
 * @param transaction - Optional database transaction
 * @returns Updated audit
 *
 * @example
 * ```typescript
 * await startConfigurationAudit('audit-123');
 * ```
 */
export async function startConfigurationAudit(
  auditId: string,
  transaction?: Transaction
): Promise<ConfigurationAudit> {
  const audit = await ConfigurationAudit.findByPk(auditId, { transaction });
  if (!audit) {
    throw new NotFoundException(`Audit ${auditId} not found`);
  }

  await audit.update({
    status: AuditStatus.IN_PROGRESS,
    startedDate: new Date(),
  }, { transaction });

  return audit;
}

/**
 * Completes configuration audit
 *
 * @param auditId - Audit ID
 * @param findings - Audit findings
 * @param complianceScore - Compliance score
 * @param recommendations - Recommendations
 * @param transaction - Optional database transaction
 * @returns Updated audit
 *
 * @example
 * ```typescript
 * await completeConfigurationAudit('audit-123', findings, 95.5, 'All items compliant');
 * ```
 */
export async function completeConfigurationAudit(
  auditId: string,
  findings: Record<string, any>[],
  complianceScore: number,
  recommendations?: string,
  transaction?: Transaction
): Promise<ConfigurationAudit> {
  const audit = await ConfigurationAudit.findByPk(auditId, { transaction });
  if (!audit) {
    throw new NotFoundException(`Audit ${auditId} not found`);
  }

  await audit.update({
    status: AuditStatus.COMPLETED,
    completedDate: new Date(),
    findings,
    complianceScore,
    recommendations,
  }, { transaction });

  return audit;
}

/**
 * Gets audits by status
 *
 * @param status - Audit status
 * @returns Audits
 *
 * @example
 * ```typescript
 * const scheduled = await getAuditsByStatus(AuditStatus.SCHEDULED);
 * ```
 */
export async function getAuditsByStatus(
  status: AuditStatus
): Promise<ConfigurationAudit[]> {
  return ConfigurationAudit.findAll({
    where: { status },
    order: [['scheduledDate', 'ASC']],
  });
}

// ============================================================================
// VERSION HISTORY FUNCTIONS
// ============================================================================

/**
 * Gets version history for CI
 *
 * @param ciId - CI identifier
 * @param limit - Maximum records
 * @returns Version history
 *
 * @example
 * ```typescript
 * const history = await getVersionHistory('ci-123', 20);
 * ```
 */
export async function getVersionHistory(
  ciId: string,
  limit: number = 50
): Promise<ConfigurationVersionHistory[]> {
  return ConfigurationVersionHistory.findAll({
    where: { ciId },
    order: [['changedAt', 'DESC']],
    limit,
  });
}

/**
 * Compares two versions
 *
 * @param ciId - CI identifier
 * @param version1 - First version
 * @param version2 - Second version
 * @returns Version comparison
 *
 * @example
 * ```typescript
 * const diff = await compareVersions('ci-123', '1.0.0', '2.0.0');
 * ```
 */
export async function compareVersions(
  ciId: string,
  version1: string,
  version2: string
): Promise<{ differences: any; added: string[]; removed: string[]; modified: string[] }> {
  const v1 = await ConfigurationVersionHistory.findOne({
    where: { ciId, version: version1 },
  });

  const v2 = await ConfigurationVersionHistory.findOne({
    where: { ciId, version: version2 },
  });

  if (!v1 || !v2) {
    throw new NotFoundException('One or both versions not found');
  }

  const config1 = v1.newConfiguration;
  const config2 = v2.newConfiguration;

  const differences: any = {};
  const added: string[] = [];
  const removed: string[] = [];
  const modified: string[] = [];

  // Check for added and modified
  for (const key in config2) {
    if (!(key in config1)) {
      added.push(key);
      differences[key] = { v1: undefined, v2: config2[key] };
    } else if (JSON.stringify(config1[key]) !== JSON.stringify(config2[key])) {
      modified.push(key);
      differences[key] = { v1: config1[key], v2: config2[key] };
    }
  }

  // Check for removed
  for (const key in config1) {
    if (!(key in config2)) {
      removed.push(key);
      differences[key] = { v1: config1[key], v2: undefined };
    }
  }

  return { differences, added, removed, modified };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  ConfigurationItem,
  ConfigurationBaseline,
  ChangeRequest,
  CIRelationship,
  ConfigurationSnapshot,
  DriftRecord,
  ConfigurationAudit,
  ConfigurationVersionHistory,

  // CI Functions
  createConfigurationItem,
  updateConfigurationItem,
  getConfigurationItem,
  getConfigurationItemsByType,
  getConfigurationItemsByEnvironment,
  verifyConfigurationItem,
  decommissionConfigurationItem,

  // Baseline Functions
  createBaseline,
  approveBaseline,
  activateBaseline,
  getActiveBaselines,
  compareToBaseline,

  // Change Request Functions
  createChangeRequest,
  submitChangeRequest,
  approveChangeRequest,
  rejectChangeRequest,
  implementChangeRequest,
  rollbackChangeRequest,
  getChangeRequestsByStatus,
  analyzeChangeImpact,

  // Relationship Functions
  createCIRelationship,
  removeCIRelationship,
  getCIRelationships,
  getCIDependencyTree,

  // Snapshot Functions
  createConfigurationSnapshot,
  getCISnapshots,
  restoreFromSnapshot,

  // Drift Detection Functions
  detectConfigurationDrift,
  scanForDrift,
  remediateDrift,
  getDriftRecordsByStatus,

  // Audit Functions
  createConfigurationAudit,
  startConfigurationAudit,
  completeConfigurationAudit,
  getAuditsByStatus,

  // Version History Functions
  getVersionHistory,
  compareVersions,
};
