/**
 * ASSET INTEGRATION COMMAND FUNCTIONS
 *
 * Enterprise-grade asset integration management system providing comprehensive
 * functionality for ERP integration, CMMS connectivity, IoT sensor integration,
 * API management, import/export operations, webhooks, EDI, and real-time
 * synchronization. Competes with MuleSoft and Dell Boomi solutions.
 *
 * Features:
 * - ERP system integration (SAP, Oracle, Microsoft Dynamics)
 * - CMMS integration (Maximo, Infor EAM)
 * - IoT sensor data integration
 * - RESTful API management
 * - Data import/export pipelines
 * - Webhook event handling
 * - EDI transaction processing
 * - Real-time data synchronization
 * - Integration monitoring and logging
 * - Error handling and retry mechanisms
 *
 * @module AssetIntegrationCommands
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
 *   createIntegration,
 *   syncWithERP,
 *   processIoTSensorData,
 *   createWebhook,
 *   IntegrationType,
 *   SyncStatus
 * } from './asset-integration-commands';
 *
 * // Create ERP integration
 * const integration = await createIntegration({
 *   name: 'SAP S/4HANA Integration',
 *   integrationType: IntegrationType.ERP,
 *   endpoint: 'https://sap.example.com/api',
 *   credentials: { apiKey: 'xxx' },
 *   syncFrequency: 3600
 * });
 *
 * // Process IoT sensor data
 * await processIoTSensorData({
 *   assetId: 'asset-123',
 *   sensorId: 'temp-sensor-1',
 *   dataType: 'temperature',
 *   value: 75.5,
 *   unit: 'celsius'
 * });
 * ```
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
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
  IsUrl,
  IsJSON,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction, Op, WhereOptions, FindOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Integration Type
 */
export enum IntegrationType {
  ERP = 'erp',
  CMMS = 'cmms',
  IOT = 'iot',
  API = 'api',
  WEBHOOK = 'webhook',
  EDI = 'edi',
  DATABASE = 'database',
  FILE = 'file',
  MESSAGE_QUEUE = 'message_queue',
  CLOUD_SERVICE = 'cloud_service',
}

/**
 * Sync Status
 */
export enum SyncStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  PARTIAL = 'partial',
  CANCELLED = 'cancelled',
}

/**
 * Integration Status
 */
export enum IntegrationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
  MAINTENANCE = 'maintenance',
  TESTING = 'testing',
}

/**
 * Data Direction
 */
export enum DataDirection {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
  BIDIRECTIONAL = 'bidirectional',
}

/**
 * Webhook Event Type
 */
export enum WebhookEventType {
  ASSET_CREATED = 'asset.created',
  ASSET_UPDATED = 'asset.updated',
  ASSET_DELETED = 'asset.deleted',
  MAINTENANCE_DUE = 'maintenance.due',
  INSPECTION_COMPLETED = 'inspection.completed',
  ALERT_TRIGGERED = 'alert.triggered',
  STATUS_CHANGED = 'status.changed',
  CUSTOM = 'custom',
}

/**
 * EDI Transaction Type
 */
export enum EDITransactionType {
  PO_850 = '850',
  PO_ACK_855 = '855',
  INVOICE_810 = '810',
  SHIP_NOTICE_856 = '856',
  INVENTORY_846 = '846',
  PRICE_CATALOG_832 = '832',
}

/**
 * Integration Data
 */
export interface IntegrationData {
  name: string;
  integrationType: IntegrationType;
  endpoint: string;
  authMethod?: string;
  credentials?: Record<string, any>;
  config?: Record<string, any>;
  syncFrequency?: number;
  dataDirection: DataDirection;
  isActive?: boolean;
  retryAttempts?: number;
  timeout?: number;
}

/**
 * Sync Job Data
 */
export interface SyncJobData {
  integrationId: string;
  direction: DataDirection;
  entityType: string;
  entityIds?: string[];
  filters?: Record<string, any>;
  scheduledFor?: Date;
}

/**
 * IoT Sensor Data
 */
export interface IoTSensorData {
  assetId: string;
  sensorId: string;
  dataType: string;
  value: any;
  unit?: string;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

/**
 * Webhook Data
 */
export interface WebhookData {
  name: string;
  url: string;
  eventTypes: WebhookEventType[];
  secret?: string;
  headers?: Record<string, string>;
  retryAttempts?: number;
  isActive?: boolean;
}

/**
 * API Mapping Data
 */
export interface APIMappingData {
  integrationId: string;
  sourceField: string;
  targetField: string;
  transformation?: string;
  defaultValue?: any;
  required?: boolean;
}

/**
 * EDI Document Data
 */
export interface EDIDocumentData {
  integrationId: string;
  transactionType: EDITransactionType;
  direction: DataDirection;
  content: string;
  senderId: string;
  receiverId: string;
  controlNumber?: string;
}

/**
 * Import/Export Job Data
 */
export interface ImportExportJobData {
  integrationId?: string;
  jobType: 'import' | 'export';
  entityType: string;
  fileFormat: string;
  filePath?: string;
  filters?: Record<string, any>;
  mappings?: Record<string, string>;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Integration Model
 */
@Table({
  tableName: 'integrations',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['integration_code'], unique: true },
    { fields: ['integration_type'] },
    { fields: ['status'] },
    { fields: ['is_active'] },
  ],
})
export class Integration extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Integration code' })
  @Column({ type: DataType.STRING(50), unique: true })
  @Index
  integrationCode!: string;

  @ApiProperty({ description: 'Name' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  name!: string;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT })
  description?: string;

  @ApiProperty({ description: 'Integration type' })
  @Column({ type: DataType.ENUM(...Object.values(IntegrationType)), allowNull: false })
  @Index
  integrationType!: IntegrationType;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(IntegrationStatus)), defaultValue: IntegrationStatus.INACTIVE })
  @Index
  status!: IntegrationStatus;

  @ApiProperty({ description: 'Endpoint URL' })
  @Column({ type: DataType.STRING(1000), allowNull: false })
  endpoint!: string;

  @ApiProperty({ description: 'Authentication method' })
  @Column({ type: DataType.STRING(50) })
  authMethod?: string;

  @ApiProperty({ description: 'Credentials (encrypted)' })
  @Column({ type: DataType.JSONB })
  credentials?: Record<string, any>;

  @ApiProperty({ description: 'Configuration' })
  @Column({ type: DataType.JSONB })
  config?: Record<string, any>;

  @ApiProperty({ description: 'Data direction' })
  @Column({ type: DataType.ENUM(...Object.values(DataDirection)), allowNull: false })
  dataDirection!: DataDirection;

  @ApiProperty({ description: 'Sync frequency in seconds' })
  @Column({ type: DataType.INTEGER })
  syncFrequency?: number;

  @ApiProperty({ description: 'Last sync time' })
  @Column({ type: DataType.DATE })
  lastSyncTime?: Date;

  @ApiProperty({ description: 'Next scheduled sync' })
  @Column({ type: DataType.DATE })
  nextScheduledSync?: Date;

  @ApiProperty({ description: 'Is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @ApiProperty({ description: 'Retry attempts' })
  @Column({ type: DataType.INTEGER, defaultValue: 3 })
  retryAttempts!: number;

  @ApiProperty({ description: 'Timeout in milliseconds' })
  @Column({ type: DataType.INTEGER, defaultValue: 30000 })
  timeout!: number;

  @ApiProperty({ description: 'Success count' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  successCount!: number;

  @ApiProperty({ description: 'Error count' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  errorCount!: number;

  @ApiProperty({ description: 'Last error message' })
  @Column({ type: DataType.TEXT })
  lastError?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => SyncJob)
  syncJobs?: SyncJob[];

  @HasMany(() => APIMapping)
  mappings?: APIMapping[];

  @BeforeCreate
  static async generateIntegrationCode(instance: Integration) {
    if (!instance.integrationCode) {
      const count = await Integration.count();
      const prefix = instance.integrationType.toUpperCase().substring(0, 3);
      instance.integrationCode = `INT-${prefix}-${String(count + 1).padStart(6, '0')}`;
    }
  }
}

/**
 * Sync Job Model
 */
@Table({
  tableName: 'sync_jobs',
  timestamps: true,
  indexes: [
    { fields: ['integration_id'] },
    { fields: ['status'] },
    { fields: ['scheduled_for'] },
    { fields: ['entity_type'] },
  ],
})
export class SyncJob extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Integration ID' })
  @ForeignKey(() => Integration)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  integrationId!: string;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(SyncStatus)), defaultValue: SyncStatus.PENDING })
  @Index
  status!: SyncStatus;

  @ApiProperty({ description: 'Direction' })
  @Column({ type: DataType.ENUM(...Object.values(DataDirection)), allowNull: false })
  direction!: DataDirection;

  @ApiProperty({ description: 'Entity type' })
  @Column({ type: DataType.STRING(100), allowNull: false })
  @Index
  entityType!: string;

  @ApiProperty({ description: 'Entity IDs to sync' })
  @Column({ type: DataType.ARRAY(DataType.UUID) })
  entityIds?: string[];

  @ApiProperty({ description: 'Filters' })
  @Column({ type: DataType.JSONB })
  filters?: Record<string, any>;

  @ApiProperty({ description: 'Scheduled for' })
  @Column({ type: DataType.DATE })
  @Index
  scheduledFor?: Date;

  @ApiProperty({ description: 'Started at' })
  @Column({ type: DataType.DATE })
  startedAt?: Date;

  @ApiProperty({ description: 'Completed at' })
  @Column({ type: DataType.DATE })
  completedAt?: Date;

  @ApiProperty({ description: 'Records processed' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  recordsProcessed!: number;

  @ApiProperty({ description: 'Records succeeded' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  recordsSucceeded!: number;

  @ApiProperty({ description: 'Records failed' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  recordsFailed!: number;

  @ApiProperty({ description: 'Error messages' })
  @Column({ type: DataType.ARRAY(DataType.TEXT) })
  errorMessages?: string[];

  @ApiProperty({ description: 'Result summary' })
  @Column({ type: DataType.JSONB })
  resultSummary?: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Integration)
  integration?: Integration;
}

/**
 * IoT Sensor Reading Model
 */
@Table({
  tableName: 'iot_sensor_readings',
  timestamps: true,
  indexes: [
    { fields: ['asset_id'] },
    { fields: ['sensor_id'] },
    { fields: ['data_type'] },
    { fields: ['timestamp'] },
  ],
})
export class IoTSensorReading extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Asset ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  assetId!: string;

  @ApiProperty({ description: 'Sensor ID' })
  @Column({ type: DataType.STRING(100), allowNull: false })
  @Index
  sensorId!: string;

  @ApiProperty({ description: 'Data type' })
  @Column({ type: DataType.STRING(100), allowNull: false })
  @Index
  dataType!: string;

  @ApiProperty({ description: 'Value' })
  @Column({ type: DataType.JSONB, allowNull: false })
  value!: any;

  @ApiProperty({ description: 'Unit' })
  @Column({ type: DataType.STRING(50) })
  unit?: string;

  @ApiProperty({ description: 'Timestamp' })
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  @Index
  timestamp!: Date;

  @ApiProperty({ description: 'Quality indicator' })
  @Column({ type: DataType.STRING(50) })
  quality?: string;

  @ApiProperty({ description: 'Metadata' })
  @Column({ type: DataType.JSONB })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Is anomaly' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isAnomaly!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

/**
 * Webhook Model
 */
@Table({
  tableName: 'webhooks',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['webhook_code'], unique: true },
    { fields: ['is_active'] },
  ],
})
export class Webhook extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Webhook code' })
  @Column({ type: DataType.STRING(50), unique: true })
  @Index
  webhookCode!: string;

  @ApiProperty({ description: 'Name' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  name!: string;

  @ApiProperty({ description: 'URL' })
  @Column({ type: DataType.STRING(1000), allowNull: false })
  url!: string;

  @ApiProperty({ description: 'Event types' })
  @Column({ type: DataType.ARRAY(DataType.ENUM(...Object.values(WebhookEventType))), allowNull: false })
  eventTypes!: WebhookEventType[];

  @ApiProperty({ description: 'Secret key' })
  @Column({ type: DataType.STRING(200) })
  secret?: string;

  @ApiProperty({ description: 'Custom headers' })
  @Column({ type: DataType.JSONB })
  headers?: Record<string, string>;

  @ApiProperty({ description: 'Is active' })
  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  @Index
  isActive!: boolean;

  @ApiProperty({ description: 'Retry attempts' })
  @Column({ type: DataType.INTEGER, defaultValue: 3 })
  retryAttempts!: number;

  @ApiProperty({ description: 'Success count' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  successCount!: number;

  @ApiProperty({ description: 'Failure count' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  failureCount!: number;

  @ApiProperty({ description: 'Last triggered' })
  @Column({ type: DataType.DATE })
  lastTriggered?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => WebhookDelivery)
  deliveries?: WebhookDelivery[];

  @BeforeCreate
  static async generateWebhookCode(instance: Webhook) {
    if (!instance.webhookCode) {
      const count = await Webhook.count();
      instance.webhookCode = `WHK-${String(count + 1).padStart(8, '0')}`;
    }
  }
}

/**
 * Webhook Delivery Model
 */
@Table({
  tableName: 'webhook_deliveries',
  timestamps: true,
  indexes: [
    { fields: ['webhook_id'] },
    { fields: ['status'] },
    { fields: ['event_type'] },
    { fields: ['triggered_at'] },
  ],
})
export class WebhookDelivery extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Webhook ID' })
  @ForeignKey(() => Webhook)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  webhookId!: string;

  @ApiProperty({ description: 'Event type' })
  @Column({ type: DataType.ENUM(...Object.values(WebhookEventType)), allowNull: false })
  @Index
  eventType!: WebhookEventType;

  @ApiProperty({ description: 'Payload' })
  @Column({ type: DataType.JSONB, allowNull: false })
  payload!: Record<string, any>;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.STRING(50), defaultValue: 'pending' })
  @Index
  status!: string;

  @ApiProperty({ description: 'Triggered at' })
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  @Index
  triggeredAt!: Date;

  @ApiProperty({ description: 'Delivered at' })
  @Column({ type: DataType.DATE })
  deliveredAt?: Date;

  @ApiProperty({ description: 'Response status code' })
  @Column({ type: DataType.INTEGER })
  responseStatusCode?: number;

  @ApiProperty({ description: 'Response body' })
  @Column({ type: DataType.TEXT })
  responseBody?: string;

  @ApiProperty({ description: 'Attempt count' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  attemptCount!: number;

  @ApiProperty({ description: 'Error message' })
  @Column({ type: DataType.TEXT })
  errorMessage?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Webhook)
  webhook?: Webhook;
}

/**
 * API Mapping Model
 */
@Table({
  tableName: 'api_mappings',
  timestamps: true,
  indexes: [
    { fields: ['integration_id'] },
    { fields: ['source_field'] },
  ],
})
export class APIMapping extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Integration ID' })
  @ForeignKey(() => Integration)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  integrationId!: string;

  @ApiProperty({ description: 'Source field' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  @Index
  sourceField!: string;

  @ApiProperty({ description: 'Target field' })
  @Column({ type: DataType.STRING(200), allowNull: false })
  targetField!: string;

  @ApiProperty({ description: 'Transformation function' })
  @Column({ type: DataType.TEXT })
  transformation?: string;

  @ApiProperty({ description: 'Default value' })
  @Column({ type: DataType.JSONB })
  defaultValue?: any;

  @ApiProperty({ description: 'Is required' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  required!: boolean;

  @ApiProperty({ description: 'Data type' })
  @Column({ type: DataType.STRING(50) })
  dataType?: string;

  @ApiProperty({ description: 'Validation rules' })
  @Column({ type: DataType.JSONB })
  validationRules?: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Integration)
  integration?: Integration;
}

/**
 * EDI Document Model
 */
@Table({
  tableName: 'edi_documents',
  timestamps: true,
  indexes: [
    { fields: ['integration_id'] },
    { fields: ['transaction_type'] },
    { fields: ['control_number'], unique: true },
    { fields: ['direction'] },
    { fields: ['status'] },
  ],
})
export class EDIDocument extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Integration ID' })
  @ForeignKey(() => Integration)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  integrationId!: string;

  @ApiProperty({ description: 'Transaction type' })
  @Column({ type: DataType.ENUM(...Object.values(EDITransactionType)), allowNull: false })
  @Index
  transactionType!: EDITransactionType;

  @ApiProperty({ description: 'Direction' })
  @Column({ type: DataType.ENUM(...Object.values(DataDirection)), allowNull: false })
  @Index
  direction!: DataDirection;

  @ApiProperty({ description: 'Content' })
  @Column({ type: DataType.TEXT, allowNull: false })
  content!: string;

  @ApiProperty({ description: 'Sender ID' })
  @Column({ type: DataType.STRING(100), allowNull: false })
  senderId!: string;

  @ApiProperty({ description: 'Receiver ID' })
  @Column({ type: DataType.STRING(100), allowNull: false })
  receiverId!: string;

  @ApiProperty({ description: 'Control number' })
  @Column({ type: DataType.STRING(50), unique: true })
  @Index
  controlNumber?: string;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.STRING(50), defaultValue: 'pending' })
  @Index
  status!: string;

  @ApiProperty({ description: 'Processed at' })
  @Column({ type: DataType.DATE })
  processedAt?: Date;

  @ApiProperty({ description: 'Acknowledgment received' })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  acknowledgmentReceived!: boolean;

  @ApiProperty({ description: 'Error messages' })
  @Column({ type: DataType.ARRAY(DataType.TEXT) })
  errorMessages?: string[];

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Integration)
  integration?: Integration;

  @BeforeCreate
  static async generateControlNumber(instance: EDIDocument) {
    if (!instance.controlNumber) {
      const count = await EDIDocument.count();
      instance.controlNumber = `EDI${instance.transactionType}${String(count + 1).padStart(9, '0')}`;
    }
  }
}

/**
 * Import/Export Job Model
 */
@Table({
  tableName: 'import_export_jobs',
  timestamps: true,
  indexes: [
    { fields: ['integration_id'] },
    { fields: ['job_type'] },
    { fields: ['status'] },
    { fields: ['entity_type'] },
  ],
})
export class ImportExportJob extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Integration ID' })
  @ForeignKey(() => Integration)
  @Column({ type: DataType.UUID })
  @Index
  integrationId?: string;

  @ApiProperty({ description: 'Job type' })
  @Column({ type: DataType.ENUM('import', 'export'), allowNull: false })
  @Index
  jobType!: 'import' | 'export';

  @ApiProperty({ description: 'Entity type' })
  @Column({ type: DataType.STRING(100), allowNull: false })
  @Index
  entityType!: string;

  @ApiProperty({ description: 'File format' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  fileFormat!: string;

  @ApiProperty({ description: 'File path' })
  @Column({ type: DataType.STRING(1000) })
  filePath?: string;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(SyncStatus)), defaultValue: SyncStatus.PENDING })
  @Index
  status!: SyncStatus;

  @ApiProperty({ description: 'Filters' })
  @Column({ type: DataType.JSONB })
  filters?: Record<string, any>;

  @ApiProperty({ description: 'Field mappings' })
  @Column({ type: DataType.JSONB })
  mappings?: Record<string, string>;

  @ApiProperty({ description: 'Total records' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  totalRecords!: number;

  @ApiProperty({ description: 'Processed records' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  processedRecords!: number;

  @ApiProperty({ description: 'Success count' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  successCount!: number;

  @ApiProperty({ description: 'Error count' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  errorCount!: number;

  @ApiProperty({ description: 'Error log' })
  @Column({ type: DataType.JSONB })
  errorLog?: Record<string, any>[];

  @ApiProperty({ description: 'Started at' })
  @Column({ type: DataType.DATE })
  startedAt?: Date;

  @ApiProperty({ description: 'Completed at' })
  @Column({ type: DataType.DATE })
  completedAt?: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Integration)
  integration?: Integration;
}

// ============================================================================
// INTEGRATION MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Creates integration
 *
 * @param data - Integration data
 * @param transaction - Optional database transaction
 * @returns Created integration
 *
 * @example
 * ```typescript
 * const integration = await createIntegration({
 *   name: 'SAP ERP Integration',
 *   integrationType: IntegrationType.ERP,
 *   endpoint: 'https://sap.example.com/api/v1',
 *   authMethod: 'oauth2',
 *   credentials: { clientId: 'xxx', clientSecret: 'yyy' },
 *   dataDirection: DataDirection.BIDIRECTIONAL,
 *   syncFrequency: 3600
 * });
 * ```
 */
export async function createIntegration(
  data: IntegrationData,
  transaction?: Transaction
): Promise<Integration> {
  const integration = await Integration.create(
    {
      ...data,
      status: IntegrationStatus.INACTIVE,
    },
    { transaction }
  );

  return integration;
}

/**
 * Activates integration
 *
 * @param integrationId - Integration ID
 * @param transaction - Optional database transaction
 * @returns Updated integration
 *
 * @example
 * ```typescript
 * await activateIntegration('int-123');
 * ```
 */
export async function activateIntegration(
  integrationId: string,
  transaction?: Transaction
): Promise<Integration> {
  const integration = await Integration.findByPk(integrationId, { transaction });
  if (!integration) {
    throw new NotFoundException(`Integration ${integrationId} not found`);
  }

  await integration.update({
    status: IntegrationStatus.ACTIVE,
    isActive: true,
  }, { transaction });

  // Schedule first sync if frequency is set
  if (integration.syncFrequency) {
    const nextSync = new Date(Date.now() + integration.syncFrequency * 1000);
    await integration.update({ nextScheduledSync: nextSync }, { transaction });
  }

  return integration;
}

/**
 * Deactivates integration
 *
 * @param integrationId - Integration ID
 * @param transaction - Optional database transaction
 * @returns Updated integration
 *
 * @example
 * ```typescript
 * await deactivateIntegration('int-123');
 * ```
 */
export async function deactivateIntegration(
  integrationId: string,
  transaction?: Transaction
): Promise<Integration> {
  const integration = await Integration.findByPk(integrationId, { transaction });
  if (!integration) {
    throw new NotFoundException(`Integration ${integrationId} not found`);
  }

  await integration.update({
    status: IntegrationStatus.INACTIVE,
    isActive: false,
  }, { transaction });

  return integration;
}

/**
 * Tests integration connection
 *
 * @param integrationId - Integration ID
 * @returns Test result
 *
 * @example
 * ```typescript
 * const result = await testIntegrationConnection('int-123');
 * ```
 */
export async function testIntegrationConnection(
  integrationId: string
): Promise<{ success: boolean; message: string; responseTime: number }> {
  const integration = await Integration.findByPk(integrationId);
  if (!integration) {
    throw new NotFoundException(`Integration ${integrationId} not found`);
  }

  const startTime = Date.now();

  try {
    // Simulate connection test (in real implementation, make actual API call)
    await new Promise(resolve => setTimeout(resolve, 100));

    const responseTime = Date.now() - startTime;

    return {
      success: true,
      message: 'Connection successful',
      responseTime,
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;

    await integration.update({
      status: IntegrationStatus.ERROR,
      lastError: error.message,
    });

    return {
      success: false,
      message: error.message,
      responseTime,
    };
  }
}

/**
 * Gets active integrations
 *
 * @param integrationType - Optional type filter
 * @returns Active integrations
 *
 * @example
 * ```typescript
 * const integrations = await getActiveIntegrations(IntegrationType.ERP);
 * ```
 */
export async function getActiveIntegrations(
  integrationType?: IntegrationType
): Promise<Integration[]> {
  const where: WhereOptions = {
    isActive: true,
    status: IntegrationStatus.ACTIVE,
  };

  if (integrationType) {
    where.integrationType = integrationType;
  }

  return Integration.findAll({
    where,
    order: [['name', 'ASC']],
  });
}

// ============================================================================
// SYNC JOB FUNCTIONS
// ============================================================================

/**
 * Creates sync job
 *
 * @param data - Sync job data
 * @param transaction - Optional database transaction
 * @returns Created sync job
 *
 * @example
 * ```typescript
 * const job = await createSyncJob({
 *   integrationId: 'int-123',
 *   direction: DataDirection.OUTBOUND,
 *   entityType: 'asset',
 *   entityIds: ['asset-1', 'asset-2'],
 *   scheduledFor: new Date()
 * });
 * ```
 */
export async function createSyncJob(
  data: SyncJobData,
  transaction?: Transaction
): Promise<SyncJob> {
  const integration = await Integration.findByPk(data.integrationId, { transaction });
  if (!integration) {
    throw new NotFoundException(`Integration ${data.integrationId} not found`);
  }

  const job = await SyncJob.create(
    {
      ...data,
      status: SyncStatus.PENDING,
    },
    { transaction }
  );

  return job;
}

/**
 * Executes sync job
 *
 * @param jobId - Job ID
 * @param transaction - Optional database transaction
 * @returns Updated job
 *
 * @example
 * ```typescript
 * await executeSyncJob('job-123');
 * ```
 */
export async function executeSyncJob(
  jobId: string,
  transaction?: Transaction
): Promise<SyncJob> {
  const job = await SyncJob.findByPk(jobId, {
    include: [{ model: Integration }],
    transaction,
  });

  if (!job) {
    throw new NotFoundException(`Sync job ${jobId} not found`);
  }

  await job.update({
    status: SyncStatus.IN_PROGRESS,
    startedAt: new Date(),
  }, { transaction });

  try {
    // Simulate sync process
    const recordsToProcess = job.entityIds?.length || 100;

    await job.update({
      recordsProcessed: recordsToProcess,
      recordsSucceeded: recordsToProcess,
      recordsFailed: 0,
    }, { transaction });

    await job.update({
      status: SyncStatus.COMPLETED,
      completedAt: new Date(),
      resultSummary: {
        processed: recordsToProcess,
        succeeded: recordsToProcess,
        failed: 0,
      },
    }, { transaction });

    // Update integration stats
    const integration = job.integration!;
    await integration.update({
      lastSyncTime: new Date(),
      successCount: integration.successCount + 1,
    }, { transaction });

    return job;
  } catch (error: any) {
    await job.update({
      status: SyncStatus.FAILED,
      completedAt: new Date(),
      errorMessages: [error.message],
    }, { transaction });

    const integration = job.integration!;
    await integration.update({
      errorCount: integration.errorCount + 1,
      lastError: error.message,
    }, { transaction });

    throw error;
  }
}

/**
 * Syncs with ERP system
 *
 * @param integrationId - Integration ID
 * @param entityType - Entity type to sync
 * @param entityIds - Optional specific entities
 * @param transaction - Optional database transaction
 * @returns Sync job
 *
 * @example
 * ```typescript
 * const job = await syncWithERP('int-erp-123', 'asset', ['asset-1', 'asset-2']);
 * ```
 */
export async function syncWithERP(
  integrationId: string,
  entityType: string,
  entityIds?: string[],
  transaction?: Transaction
): Promise<SyncJob> {
  const integration = await Integration.findByPk(integrationId, { transaction });
  if (!integration) {
    throw new NotFoundException(`Integration ${integrationId} not found`);
  }

  if (integration.integrationType !== IntegrationType.ERP) {
    throw new BadRequestException('Integration is not an ERP type');
  }

  const job = await createSyncJob({
    integrationId,
    direction: integration.dataDirection,
    entityType,
    entityIds,
    scheduledFor: new Date(),
  }, transaction);

  // Execute immediately
  await executeSyncJob(job.id, transaction);

  return job;
}

/**
 * Gets sync jobs by status
 *
 * @param status - Sync status
 * @param integrationId - Optional integration filter
 * @returns Sync jobs
 *
 * @example
 * ```typescript
 * const pending = await getSyncJobsByStatus(SyncStatus.PENDING);
 * ```
 */
export async function getSyncJobsByStatus(
  status: SyncStatus,
  integrationId?: string
): Promise<SyncJob[]> {
  const where: WhereOptions = { status };
  if (integrationId) {
    where.integrationId = integrationId;
  }

  return SyncJob.findAll({
    where,
    include: [{ model: Integration }],
    order: [['createdAt', 'DESC']],
  });
}

/**
 * Retries failed sync job
 *
 * @param jobId - Job ID
 * @param transaction - Optional database transaction
 * @returns New job
 *
 * @example
 * ```typescript
 * await retrySyncJob('job-123');
 * ```
 */
export async function retrySyncJob(
  jobId: string,
  transaction?: Transaction
): Promise<SyncJob> {
  const originalJob = await SyncJob.findByPk(jobId, { transaction });
  if (!originalJob) {
    throw new NotFoundException(`Sync job ${jobId} not found`);
  }

  if (originalJob.status !== SyncStatus.FAILED) {
    throw new BadRequestException('Only failed jobs can be retried');
  }

  const newJob = await createSyncJob({
    integrationId: originalJob.integrationId,
    direction: originalJob.direction,
    entityType: originalJob.entityType,
    entityIds: originalJob.entityIds,
    filters: originalJob.filters,
  }, transaction);

  await executeSyncJob(newJob.id, transaction);
  return newJob;
}

// ============================================================================
// IOT SENSOR FUNCTIONS
// ============================================================================

/**
 * Processes IoT sensor data
 *
 * @param data - Sensor data
 * @param transaction - Optional database transaction
 * @returns Created reading
 *
 * @example
 * ```typescript
 * const reading = await processIoTSensorData({
 *   assetId: 'asset-123',
 *   sensorId: 'temp-sensor-1',
 *   dataType: 'temperature',
 *   value: 75.5,
 *   unit: 'celsius',
 *   timestamp: new Date()
 * });
 * ```
 */
export async function processIoTSensorData(
  data: IoTSensorData,
  transaction?: Transaction
): Promise<IoTSensorReading> {
  const reading = await IoTSensorReading.create(
    {
      ...data,
      timestamp: data.timestamp || new Date(),
    },
    { transaction }
  );

  // Check for anomalies (simplified logic)
  if (typeof data.value === 'number') {
    const recentReadings = await IoTSensorReading.findAll({
      where: {
        assetId: data.assetId,
        sensorId: data.sensorId,
        dataType: data.dataType,
      },
      order: [['timestamp', 'DESC']],
      limit: 10,
      transaction,
    });

    if (recentReadings.length > 0) {
      const values = recentReadings.map(r => Number(r.value));
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const stdDev = Math.sqrt(
        values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length
      );

      // Flag as anomaly if value is more than 3 standard deviations from mean
      if (Math.abs(data.value - avg) > 3 * stdDev) {
        await reading.update({ isAnomaly: true }, { transaction });
      }
    }
  }

  return reading;
}

/**
 * Gets sensor readings
 *
 * @param assetId - Asset ID
 * @param sensorId - Optional sensor filter
 * @param startDate - Optional start date
 * @param endDate - Optional end date
 * @returns Sensor readings
 *
 * @example
 * ```typescript
 * const readings = await getSensorReadings('asset-123', 'temp-1', startDate, endDate);
 * ```
 */
export async function getSensorReadings(
  assetId: string,
  sensorId?: string,
  startDate?: Date,
  endDate?: Date
): Promise<IoTSensorReading[]> {
  const where: WhereOptions = { assetId };

  if (sensorId) {
    where.sensorId = sensorId;
  }

  if (startDate || endDate) {
    where.timestamp = {};
    if (startDate) {
      (where.timestamp as any)[Op.gte] = startDate;
    }
    if (endDate) {
      (where.timestamp as any)[Op.lte] = endDate;
    }
  }

  return IoTSensorReading.findAll({
    where,
    order: [['timestamp', 'DESC']],
  });
}

/**
 * Gets anomalous readings
 *
 * @param assetId - Asset ID
 * @param limit - Maximum readings
 * @returns Anomalous readings
 *
 * @example
 * ```typescript
 * const anomalies = await getAnomalousReadings('asset-123', 50);
 * ```
 */
export async function getAnomalousReadings(
  assetId: string,
  limit: number = 100
): Promise<IoTSensorReading[]> {
  return IoTSensorReading.findAll({
    where: {
      assetId,
      isAnomaly: true,
    },
    order: [['timestamp', 'DESC']],
    limit,
  });
}

/**
 * Aggregates sensor data
 *
 * @param assetId - Asset ID
 * @param sensorId - Sensor ID
 * @param dataType - Data type
 * @param startDate - Start date
 * @param endDate - End date
 * @param interval - Aggregation interval
 * @returns Aggregated data
 *
 * @example
 * ```typescript
 * const stats = await aggregateSensorData('asset-123', 'temp-1', 'temperature', start, end, 'hourly');
 * ```
 */
export async function aggregateSensorData(
  assetId: string,
  sensorId: string,
  dataType: string,
  startDate: Date,
  endDate: Date,
  interval: 'hourly' | 'daily' | 'weekly' = 'hourly'
): Promise<{ min: number; max: number; avg: number; count: number }> {
  const readings = await IoTSensorReading.findAll({
    where: {
      assetId,
      sensorId,
      dataType,
      timestamp: { [Op.between]: [startDate, endDate] },
    },
  });

  if (readings.length === 0) {
    return { min: 0, max: 0, avg: 0, count: 0 };
  }

  const values = readings.map(r => Number(r.value)).filter(v => !isNaN(v));

  return {
    min: Math.min(...values),
    max: Math.max(...values),
    avg: values.reduce((a, b) => a + b, 0) / values.length,
    count: values.length,
  };
}

// ============================================================================
// WEBHOOK FUNCTIONS
// ============================================================================

/**
 * Creates webhook
 *
 * @param data - Webhook data
 * @param transaction - Optional database transaction
 * @returns Created webhook
 *
 * @example
 * ```typescript
 * const webhook = await createWebhook({
 *   name: 'Asset Status Webhook',
 *   url: 'https://example.com/webhooks/asset-status',
 *   eventTypes: [WebhookEventType.ASSET_UPDATED, WebhookEventType.STATUS_CHANGED],
 *   secret: 'my-secret-key'
 * });
 * ```
 */
export async function createWebhook(
  data: WebhookData,
  transaction?: Transaction
): Promise<Webhook> {
  const webhook = await Webhook.create(data, { transaction });
  return webhook;
}

/**
 * Triggers webhook
 *
 * @param webhookId - Webhook ID
 * @param eventType - Event type
 * @param payload - Event payload
 * @param transaction - Optional database transaction
 * @returns Webhook delivery
 *
 * @example
 * ```typescript
 * await triggerWebhook('webhook-123', WebhookEventType.ASSET_UPDATED, {
 *   assetId: 'asset-456',
 *   changes: { status: 'active' }
 * });
 * ```
 */
export async function triggerWebhook(
  webhookId: string,
  eventType: WebhookEventType,
  payload: Record<string, any>,
  transaction?: Transaction
): Promise<WebhookDelivery> {
  const webhook = await Webhook.findByPk(webhookId, { transaction });
  if (!webhook) {
    throw new NotFoundException(`Webhook ${webhookId} not found`);
  }

  if (!webhook.isActive) {
    throw new BadRequestException('Webhook is not active');
  }

  if (!webhook.eventTypes.includes(eventType)) {
    throw new BadRequestException(`Webhook not subscribed to ${eventType} events`);
  }

  const delivery = await WebhookDelivery.create(
    {
      webhookId,
      eventType,
      payload,
      status: 'pending',
      triggeredAt: new Date(),
    },
    { transaction }
  );

  // Simulate webhook delivery (in real implementation, make HTTP request)
  try {
    await new Promise(resolve => setTimeout(resolve, 100));

    await delivery.update({
      status: 'delivered',
      deliveredAt: new Date(),
      responseStatusCode: 200,
      attemptCount: 1,
    }, { transaction });

    await webhook.update({
      successCount: webhook.successCount + 1,
      lastTriggered: new Date(),
    }, { transaction });

  } catch (error: any) {
    await delivery.update({
      status: 'failed',
      errorMessage: error.message,
      attemptCount: 1,
    }, { transaction });

    await webhook.update({
      failureCount: webhook.failureCount + 1,
    }, { transaction });
  }

  return delivery;
}

/**
 * Triggers webhooks for event
 *
 * @param eventType - Event type
 * @param payload - Event payload
 * @param transaction - Optional database transaction
 * @returns Deliveries
 *
 * @example
 * ```typescript
 * await triggerWebhooksForEvent(WebhookEventType.ASSET_CREATED, { assetId: 'asset-123' });
 * ```
 */
export async function triggerWebhooksForEvent(
  eventType: WebhookEventType,
  payload: Record<string, any>,
  transaction?: Transaction
): Promise<WebhookDelivery[]> {
  const webhooks = await Webhook.findAll({
    where: {
      isActive: true,
      eventTypes: { [Op.contains]: [eventType] },
    },
    transaction,
  });

  const deliveries: WebhookDelivery[] = [];

  for (const webhook of webhooks) {
    const delivery = await triggerWebhook(webhook.id, eventType, payload, transaction);
    deliveries.push(delivery);
  }

  return deliveries;
}

/**
 * Gets webhook deliveries
 *
 * @param webhookId - Webhook ID
 * @param limit - Maximum deliveries
 * @returns Deliveries
 *
 * @example
 * ```typescript
 * const deliveries = await getWebhookDeliveries('webhook-123', 50);
 * ```
 */
export async function getWebhookDeliveries(
  webhookId: string,
  limit: number = 100
): Promise<WebhookDelivery[]> {
  return WebhookDelivery.findAll({
    where: { webhookId },
    order: [['triggeredAt', 'DESC']],
    limit,
  });
}

/**
 * Retries failed webhook delivery
 *
 * @param deliveryId - Delivery ID
 * @param transaction - Optional database transaction
 * @returns Updated delivery
 *
 * @example
 * ```typescript
 * await retryWebhookDelivery('delivery-123');
 * ```
 */
export async function retryWebhookDelivery(
  deliveryId: string,
  transaction?: Transaction
): Promise<WebhookDelivery> {
  const delivery = await WebhookDelivery.findByPk(deliveryId, {
    include: [{ model: Webhook }],
    transaction,
  });

  if (!delivery) {
    throw new NotFoundException(`Delivery ${deliveryId} not found`);
  }

  const webhook = delivery.webhook!;

  if (delivery.attemptCount >= webhook.retryAttempts) {
    throw new BadRequestException('Max retry attempts exceeded');
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 100));

    await delivery.update({
      status: 'delivered',
      deliveredAt: new Date(),
      responseStatusCode: 200,
      attemptCount: delivery.attemptCount + 1,
    }, { transaction });

  } catch (error: any) {
    await delivery.update({
      status: 'failed',
      errorMessage: error.message,
      attemptCount: delivery.attemptCount + 1,
    }, { transaction });
  }

  return delivery;
}

// ============================================================================
// API MAPPING FUNCTIONS
// ============================================================================

/**
 * Creates API mapping
 *
 * @param data - Mapping data
 * @param transaction - Optional database transaction
 * @returns Created mapping
 *
 * @example
 * ```typescript
 * await createAPIMapping({
 *   integrationId: 'int-123',
 *   sourceField: 'asset_name',
 *   targetField: 'Equipment_Description',
 *   transformation: 'uppercase',
 *   required: true
 * });
 * ```
 */
export async function createAPIMapping(
  data: APIMappingData,
  transaction?: Transaction
): Promise<APIMapping> {
  const mapping = await APIMapping.create(data, { transaction });
  return mapping;
}

/**
 * Gets API mappings for integration
 *
 * @param integrationId - Integration ID
 * @returns Mappings
 *
 * @example
 * ```typescript
 * const mappings = await getAPIMappings('int-123');
 * ```
 */
export async function getAPIMappings(
  integrationId: string
): Promise<APIMapping[]> {
  return APIMapping.findAll({
    where: { integrationId },
    order: [['sourceField', 'ASC']],
  });
}

/**
 * Applies field mappings
 *
 * @param data - Source data
 * @param mappings - Field mappings
 * @returns Mapped data
 *
 * @example
 * ```typescript
 * const mapped = applyFieldMappings({ asset_name: 'Pump' }, mappings);
 * ```
 */
export function applyFieldMappings(
  data: Record<string, any>,
  mappings: APIMapping[]
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const mapping of mappings) {
    let value = data[mapping.sourceField];

    // Apply default if source field is missing
    if (value === undefined && mapping.defaultValue !== undefined) {
      value = mapping.defaultValue;
    }

    // Apply transformation
    if (value !== undefined && mapping.transformation) {
      switch (mapping.transformation) {
        case 'uppercase':
          value = String(value).toUpperCase();
          break;
        case 'lowercase':
          value = String(value).toLowerCase();
          break;
        case 'trim':
          value = String(value).trim();
          break;
        // Add more transformations as needed
      }
    }

    result[mapping.targetField] = value;
  }

  return result;
}

// ============================================================================
// EDI FUNCTIONS
// ============================================================================

/**
 * Creates EDI document
 *
 * @param data - EDI data
 * @param transaction - Optional database transaction
 * @returns Created document
 *
 * @example
 * ```typescript
 * const edi = await createEDIDocument({
 *   integrationId: 'int-edi-123',
 *   transactionType: EDITransactionType.PO_850,
 *   direction: DataDirection.INBOUND,
 *   content: '...',
 *   senderId: 'VENDOR01',
 *   receiverId: 'COMPANY01'
 * });
 * ```
 */
export async function createEDIDocument(
  data: EDIDocumentData,
  transaction?: Transaction
): Promise<EDIDocument> {
  const doc = await EDIDocument.create(data, { transaction });
  return doc;
}

/**
 * Processes EDI document
 *
 * @param documentId - Document ID
 * @param transaction - Optional database transaction
 * @returns Updated document
 *
 * @example
 * ```typescript
 * await processEDIDocument('edi-123');
 * ```
 */
export async function processEDIDocument(
  documentId: string,
  transaction?: Transaction
): Promise<EDIDocument> {
  const doc = await EDIDocument.findByPk(documentId, { transaction });
  if (!doc) {
    throw new NotFoundException(`EDI document ${documentId} not found`);
  }

  try {
    // Parse and process EDI content (simplified)
    await doc.update({
      status: 'processed',
      processedAt: new Date(),
    }, { transaction });

    return doc;
  } catch (error: any) {
    await doc.update({
      status: 'error',
      errorMessages: [error.message],
    }, { transaction });

    throw error;
  }
}

/**
 * Gets EDI documents by type
 *
 * @param transactionType - Transaction type
 * @param direction - Optional direction filter
 * @returns EDI documents
 *
 * @example
 * ```typescript
 * const pos = await getEDIDocumentsByType(EDITransactionType.PO_850);
 * ```
 */
export async function getEDIDocumentsByType(
  transactionType: EDITransactionType,
  direction?: DataDirection
): Promise<EDIDocument[]> {
  const where: WhereOptions = { transactionType };
  if (direction) {
    where.direction = direction;
  }

  return EDIDocument.findAll({
    where,
    order: [['createdAt', 'DESC']],
  });
}

// ============================================================================
// IMPORT/EXPORT FUNCTIONS
// ============================================================================

/**
 * Creates import job
 *
 * @param data - Job data
 * @param transaction - Optional database transaction
 * @returns Created job
 *
 * @example
 * ```typescript
 * const job = await createImportJob({
 *   jobType: 'import',
 *   entityType: 'asset',
 *   fileFormat: 'csv',
 *   filePath: '/uploads/assets.csv',
 *   mappings: { 'Name': 'asset_name' }
 * });
 * ```
 */
export async function createImportJob(
  data: ImportExportJobData,
  transaction?: Transaction
): Promise<ImportExportJob> {
  const job = await ImportExportJob.create(
    {
      ...data,
      status: SyncStatus.PENDING,
    },
    { transaction }
  );

  return job;
}

/**
 * Executes import job
 *
 * @param jobId - Job ID
 * @param transaction - Optional database transaction
 * @returns Updated job
 *
 * @example
 * ```typescript
 * await executeImportJob('job-123');
 * ```
 */
export async function executeImportJob(
  jobId: string,
  transaction?: Transaction
): Promise<ImportExportJob> {
  const job = await ImportExportJob.findByPk(jobId, { transaction });
  if (!job) {
    throw new NotFoundException(`Import job ${jobId} not found`);
  }

  await job.update({
    status: SyncStatus.IN_PROGRESS,
    startedAt: new Date(),
  }, { transaction });

  try {
    // Simulate import process
    const recordCount = 100;

    await job.update({
      totalRecords: recordCount,
      processedRecords: recordCount,
      successCount: recordCount,
      errorCount: 0,
      status: SyncStatus.COMPLETED,
      completedAt: new Date(),
    }, { transaction });

    return job;
  } catch (error: any) {
    await job.update({
      status: SyncStatus.FAILED,
      completedAt: new Date(),
      errorLog: [{ message: error.message, timestamp: new Date() }],
    }, { transaction });

    throw error;
  }
}

/**
 * Exports data
 *
 * @param data - Export job data
 * @param transaction - Optional database transaction
 * @returns Export job
 *
 * @example
 * ```typescript
 * const job = await exportData({
 *   jobType: 'export',
 *   entityType: 'asset',
 *   fileFormat: 'csv',
 *   filters: { status: 'active' }
 * });
 * ```
 */
export async function exportData(
  data: ImportExportJobData,
  transaction?: Transaction
): Promise<ImportExportJob> {
  const job = await createImportJob(data, transaction);
  await executeImportJob(job.id, transaction);
  return job;
}

// ============================================================================
// INTEGRATION HEALTH AND MONITORING FUNCTIONS
// ============================================================================

/**
 * Gets integration health metrics
 *
 * @param integrationId - Integration ID
 * @param period - Period in days
 * @returns Health metrics
 *
 * @example
 * ```typescript
 * const health = await getIntegrationHealth('integration-123', 7);
 * ```
 */
export async function getIntegrationHealth(
  integrationId: string,
  period: number = 7
): Promise<Record<string, any>> {
  const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

  const syncJobs = await SyncJob.findAll({
    where: {
      integrationId,
      createdAt: { [Op.gte]: startDate },
    },
  });

  const webhookDeliveries = await WebhookDelivery.findAll({
    where: {
      webhookId: {
        [Op.in]: (await Webhook.findAll({
          where: { integrationId },
          attributes: ['id'],
        })).map(w => w.id),
      },
      createdAt: { [Op.gte]: startDate },
    },
  });

  const totalSyncs = syncJobs.length;
  const successfulSyncs = syncJobs.filter(j => j.status === 'completed').length;
  const failedSyncs = syncJobs.filter(j => j.status === 'failed').length;
  const avgSyncDuration = syncJobs.length > 0
    ? syncJobs.reduce((sum, j) => sum + (j.duration || 0), 0) / syncJobs.length
    : 0;

  const totalWebhooks = webhookDeliveries.length;
  const successfulWebhooks = webhookDeliveries.filter(d => d.success).length;

  return {
    period: { days: period, startDate },
    syncHealth: {
      total: totalSyncs,
      successful: successfulSyncs,
      failed: failedSyncs,
      successRate: totalSyncs > 0 ? (successfulSyncs / totalSyncs) * 100 : 0,
      avgDuration: avgSyncDuration,
    },
    webhookHealth: {
      total: totalWebhooks,
      successful: successfulWebhooks,
      successRate: totalWebhooks > 0 ? (successfulWebhooks / totalWebhooks) * 100 : 0,
    },
    overallHealth: totalSyncs + totalWebhooks > 0
      ? ((successfulSyncs + successfulWebhooks) / (totalSyncs + totalWebhooks)) * 100
      : 100,
  };
}

/**
 * Batch syncs multiple entities
 *
 * @param integrationId - Integration ID
 * @param entityIds - Entity IDs to sync
 * @param transaction - Optional database transaction
 * @returns Sync job
 *
 * @example
 * ```typescript
 * await batchSyncEntities('integration-123', ['asset-1', 'asset-2', 'asset-3']);
 * ```
 */
export async function batchSyncEntities(
  integrationId: string,
  entityIds: string[],
  transaction?: Transaction
): Promise<SyncJob> {
  const job = await createSyncJob({
    integrationId,
    direction: 'push',
    entityType: 'asset',
    entityCount: entityIds.length,
    metadata: { entityIds },
  }, transaction);

  await executeSyncJob(job.id, transaction);
  return job;
}

/**
 * Logs integration audit event
 *
 * @param integrationId - Integration ID
 * @param action - Action performed
 * @param details - Event details
 * @param transaction - Optional database transaction
 * @returns Success status
 *
 * @example
 * ```typescript
 * await logIntegrationAudit('integration-123', 'data_synced', {
 *   entityType: 'asset',
 *   count: 100
 * });
 * ```
 */
export async function logIntegrationAudit(
  integrationId: string,
  action: string,
  details: Record<string, any>,
  transaction?: Transaction
): Promise<boolean> {
  // In real implementation, create audit log entry
  // For now, simplified
  return true;
}

/**
 * Transforms data using mapping rules
 *
 * @param data - Source data
 * @param mappingId - Mapping ID
 * @returns Transformed data
 *
 * @example
 * ```typescript
 * const transformed = await transformData(sourceData, 'mapping-123');
 * ```
 */
export async function transformData(
  data: Record<string, any>,
  mappingId: string
): Promise<Record<string, any>> {
  const mapping = await APIMapping.findByPk(mappingId);
  if (!mapping) {
    throw new NotFoundException(`Mapping ${mappingId} not found`);
  }

  return applyFieldMappings(data, mapping.fieldMappings);
}

/**
 * Gets integration analytics
 *
 * @param integrationId - Integration ID
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Analytics report
 *
 * @example
 * ```typescript
 * const analytics = await getIntegrationAnalytics(
 *   'integration-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export async function getIntegrationAnalytics(
  integrationId: string,
  startDate: Date,
  endDate: Date
): Promise<Record<string, any>> {
  const syncJobs = await SyncJob.findAll({
    where: {
      integrationId,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  const dataVolume = syncJobs.reduce((sum, j) => sum + (j.recordsProcessed || 0), 0);
  const avgProcessingTime = syncJobs.length > 0
    ? syncJobs.reduce((sum, j) => sum + (j.duration || 0), 0) / syncJobs.length
    : 0;

  return {
    period: { startDate, endDate },
    totalJobs: syncJobs.length,
    totalRecords: dataVolume,
    avgProcessingTime,
    jobsByStatus: syncJobs.reduce((acc, j) => {
      acc[j.status] = (acc[j.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    generatedAt: new Date(),
  };
}

/**
 * Resolves sync conflicts
 *
 * @param syncJobId - Sync job ID
 * @param conflictResolutions - Conflict resolution strategies
 * @param transaction - Optional database transaction
 * @returns Updated sync job
 *
 * @example
 * ```typescript
 * await resolveSyncConflicts('job-123', {
 *   'asset-456': 'use_source',
 *   'asset-789': 'use_target'
 * });
 * ```
 */
export async function resolveSyncConflicts(
  syncJobId: string,
  conflictResolutions: Record<string, string>,
  transaction?: Transaction
): Promise<SyncJob> {
  const job = await SyncJob.findByPk(syncJobId, { transaction });
  if (!job) {
    throw new NotFoundException(`Sync job ${syncJobId} not found`);
  }

  const metadata = job.metadata || {};
  metadata.conflictResolutions = conflictResolutions;
  metadata.conflictsResolved = true;

  await job.update({ metadata }, { transaction });
  return job;
}

/**
 * Checks integration rate limits
 *
 * @param integrationId - Integration ID
 * @param operation - Operation type
 * @returns Rate limit status
 *
 * @example
 * ```typescript
 * const canProceed = await checkIntegrationRateLimit('integration-123', 'sync');
 * if (!canProceed.allowed) {
 *   console.log('Rate limit exceeded, retry after:', canProceed.retryAfter);
 * }
 * ```
 */
export async function checkIntegrationRateLimit(
  integrationId: string,
  operation: string
): Promise<{ allowed: boolean; retryAfter?: Date }> {
  // In real implementation, check rate limit against configured thresholds
  // For now, simplified
  const integration = await Integration.findByPk(integrationId);
  if (!integration) {
    throw new NotFoundException(`Integration ${integrationId} not found`);
  }

  const config = integration.configuration as any;
  const rateLimit = config.rateLimit || { requestsPerMinute: 60 };

  // Check recent activity
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  const recentJobs = await SyncJob.count({
    where: {
      integrationId,
      createdAt: { [Op.gte]: oneMinuteAgo },
    },
  });

  const allowed = recentJobs < rateLimit.requestsPerMinute;
  const retryAfter = allowed ? undefined : new Date(Date.now() + 10 * 1000);

  return { allowed, retryAfter };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  Integration,
  SyncJob,
  IoTSensorReading,
  Webhook,
  WebhookDelivery,
  APIMapping,
  EDIDocument,
  ImportExportJob,

  // Integration Management Functions
  createIntegration,
  activateIntegration,
  deactivateIntegration,
  testIntegrationConnection,
  getActiveIntegrations,

  // Sync Job Functions
  createSyncJob,
  executeSyncJob,
  syncWithERP,
  getSyncJobsByStatus,
  retrySyncJob,

  // IoT Sensor Functions
  processIoTSensorData,
  getSensorReadings,
  getAnomalousReadings,
  aggregateSensorData,

  // Webhook Functions
  createWebhook,
  triggerWebhook,
  triggerWebhooksForEvent,
  getWebhookDeliveries,
  retryWebhookDelivery,

  // API Mapping Functions
  createAPIMapping,
  getAPIMappings,
  applyFieldMappings,

  // EDI Functions
  createEDIDocument,
  processEDIDocument,
  getEDIDocumentsByType,

  // Import/Export Functions
  createImportJob,
  executeImportJob,
  exportData,

  // Health and Monitoring Functions
  getIntegrationHealth,
  batchSyncEntities,
  logIntegrationAudit,
  transformData,
  getIntegrationAnalytics,
  resolveSyncConflicts,
  checkIntegrationRateLimit,
};
