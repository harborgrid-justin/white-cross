/**
 * Data Sync DTOs for integration domain
 * Manages data synchronization between systems
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsDate,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

export enum SyncDirection {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
  BIDIRECTIONAL = 'bidirectional',
}

export enum SyncStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  PARTIAL = 'partial',
  FAILED = 'failed',
  ROLLED_BACK = 'rolled_back',
}

export enum SyncFrequency {
  REAL_TIME = 'real_time',
  IMMEDIATE = 'immediate',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  ON_DEMAND = 'on_demand',
}

export enum DataEntityType {
  STUDENT = 'student',
  COURSE = 'course',
  ENROLLMENT = 'enrollment',
  GRADE = 'grade',
  TRANSCRIPT = 'transcript',
  FINANCIAL_AID = 'financial_aid',
  ACCOUNT = 'account',
  GENERAL = 'general',
}

/**
 * Data sync configuration DTO
 */
export class DataSyncConfigDto {
  @ApiProperty({
    description: 'Sync configuration ID',
    example: 'SYNC-CONFIG-001',
  })
  @IsString()
  @IsNotEmpty()
  configId: string;

  @ApiProperty({
    description: 'Source system ID',
    example: 'CONFIG-EXTERAL-001',
  })
  @IsString()
  @IsNotEmpty()
  sourceSystemId: string;

  @ApiProperty({
    description: 'Target system ID',
    example: 'LOCAL-DATABASE',
  })
  @IsString()
  @IsNotEmpty()
  targetSystemId: string;

  @ApiProperty({
    description: 'Data entity type being synced',
    enum: DataEntityType,
    example: DataEntityType.STUDENT,
  })
  @IsEnum(DataEntityType)
  entityType: DataEntityType;

  @ApiProperty({
    description: 'Sync direction',
    enum: SyncDirection,
    example: SyncDirection.INBOUND,
  })
  @IsEnum(SyncDirection)
  syncDirection: SyncDirection;

  @ApiProperty({
    description: 'Synchronization frequency',
    enum: SyncFrequency,
    example: SyncFrequency.DAILY,
  })
  @IsEnum(SyncFrequency)
  syncFrequency: SyncFrequency;

  @ApiPropertyOptional({
    description: 'Scheduled sync time (HH:mm format)',
    example: '02:00',
  })
  @IsOptional()
  @IsString()
  scheduledTime?: string;

  @ApiProperty({
    description: 'Configuration is active',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Field mappings for sync',
    type: [String],
    example: ['MAPPING-001', 'MAPPING-002', 'MAPPING-003'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fieldMappings?: string[];

  @ApiPropertyOptional({
    description: 'Conflict resolution strategy',
    enum: ['source_wins', 'target_wins', 'manual_review', 'merge'],
    example: 'source_wins',
  })
  @IsOptional()
  @IsEnum(['source_wins', 'target_wins', 'manual_review', 'merge'])
  conflictResolution?: string;

  @ApiPropertyOptional({
    description: 'Enable data validation before sync',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  validateBeforeSync?: boolean;

  @ApiPropertyOptional({
    description: 'Enable data transformation',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  enableTransformation?: boolean;

  @ApiPropertyOptional({
    description: 'Enable audit logging for synced data',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  enableAuditLogging?: boolean;

  @ApiPropertyOptional({
    description: 'Batch size for sync operations',
    example: 500,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  batchSize?: number;

  @ApiPropertyOptional({
    description: 'Maximum retry attempts',
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxRetries?: number;

  @ApiPropertyOptional({
    description: 'Created date',
    example: '2025-01-15',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdDate?: Date;

  @ApiPropertyOptional({
    description: 'Configuration notes',
    example: 'Daily sync of student enrollment data',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

/**
 * Data sync execution result DTO
 */
export class DataSyncExecutionResultDto {
  @ApiProperty({
    description: 'Sync execution ID',
    example: 'SYNC-EXEC-2025001',
  })
  @IsString()
  @IsNotEmpty()
  executionId: string;

  @ApiProperty({
    description: 'Sync configuration ID',
    example: 'SYNC-CONFIG-001',
  })
  @IsString()
  @IsNotEmpty()
  configId: string;

  @ApiProperty({
    description: 'Sync status',
    enum: SyncStatus,
    example: SyncStatus.COMPLETED,
  })
  @IsEnum(SyncStatus)
  status: SyncStatus;

  @ApiProperty({
    description: 'Sync start timestamp',
    example: '2025-11-10T02:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @ApiPropertyOptional({
    description: 'Sync completion timestamp',
    example: '2025-11-10T02:45:30Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endTime?: Date;

  @ApiPropertyOptional({
    description: 'Total records processed',
    example: 2450,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  recordsProcessed?: number;

  @ApiPropertyOptional({
    description: 'Records successfully synced',
    example: 2435,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  recordsSynced?: number;

  @ApiPropertyOptional({
    description: 'Records skipped',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  recordsSkipped?: number;

  @ApiPropertyOptional({
    description: 'Records failed',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  recordsFailed?: number;

  @ApiPropertyOptional({
    description: 'Success rate percentage',
    example: 99.4,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  successRate?: number;

  @ApiPropertyOptional({
    description: 'Data quality issues detected',
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  dataQualityIssues?: number;

  @ApiPropertyOptional({
    description: 'Error messages from sync',
    type: [String],
    example: ['Record ID-123 failed validation', 'Connection timeout on record 456'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  errorMessages?: string[];

  @ApiPropertyOptional({
    description: 'Warnings generated during sync',
    type: [String],
    example: ['12 records had data type conversions'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  warnings?: string[];

  @ApiPropertyOptional({
    description: 'Sync execution duration (seconds)',
    example: 2730,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  durationSeconds?: number;

  @ApiPropertyOptional({
    description: 'Data snapshot/summary',
    type: 'object',
  })
  @IsOptional()
  dataSummary?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Manual review required',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  requiresManualReview?: boolean;

  @ApiPropertyOptional({
    description: 'Rollback performed',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  rollbackPerformed?: boolean;
}

/**
 * Data sync conflict DTO
 */
export class DataSyncConflictDto {
  @ApiProperty({
    description: 'Conflict ID',
    example: 'CONFLICT-2025001',
  })
  @IsString()
  @IsNotEmpty()
  conflictId: string;

  @ApiProperty({
    description: 'Sync execution ID',
    example: 'SYNC-EXEC-2025001',
  })
  @IsString()
  @IsNotEmpty()
  executionId: string;

  @ApiProperty({
    description: 'Affected record ID',
    example: 'STU-2025001',
  })
  @IsString()
  @IsNotEmpty()
  recordId: string;

  @ApiProperty({
    description: 'Field with conflict',
    example: 'enrollment_status',
  })
  @IsString()
  @IsNotEmpty()
  fieldName: string;

  @ApiProperty({
    description: 'Source system value',
    example: 'active',
  })
  sourceValue: any;

  @ApiProperty({
    description: 'Target system value',
    example: 'enrolled',
  })
  targetValue: any;

  @ApiProperty({
    description: 'Source system last modified timestamp',
    example: '2025-11-10T10:30:00Z',
  })
  @IsDate()
  @Type(() => Date)
  sourceLastModified: Date;

  @ApiProperty({
    description: 'Target system last modified timestamp',
    example: '2025-11-09T15:45:00Z',
  })
  @IsDate()
  @Type(() => Date)
  targetLastModified: Date;

  @ApiPropertyOptional({
    description: 'Conflict resolution taken',
    enum: ['source_wins', 'target_wins', 'merged', 'manual_review'],
    example: 'source_wins',
  })
  @IsOptional()
  @IsEnum(['source_wins', 'target_wins', 'merged', 'manual_review'])
  resolutionMethod?: string;

  @ApiPropertyOptional({
    description: 'Resolved value',
    example: 'active',
  })
  @IsOptional()
  resolvedValue?: any;

  @ApiPropertyOptional({
    description: 'Conflict detected timestamp',
    example: '2025-11-10T02:30:15Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  detectedAt?: Date;

  @ApiPropertyOptional({
    description: 'Conflict resolved timestamp',
    example: '2025-11-10T10:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  resolvedAt?: Date;

  @ApiPropertyOptional({
    description: 'Resolution notes',
    example: 'Source data is more recent, applied source value',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

/**
 * Data validation report DTO
 */
export class DataValidationReportDto {
  @ApiProperty({
    description: 'Validation report ID',
    example: 'VALIDATION-2025001',
  })
  @IsString()
  @IsNotEmpty()
  reportId: string;

  @ApiProperty({
    description: 'Data entity type validated',
    enum: DataEntityType,
    example: DataEntityType.STUDENT,
  })
  @IsEnum(DataEntityType)
  entityType: DataEntityType;

  @ApiProperty({
    description: 'Total records validated',
    example: 2450,
  })
  @IsNumber()
  @Min(0)
  totalRecords: number;

  @ApiProperty({
    description: 'Records passing validation',
    example: 2435,
  })
  @IsNumber()
  @Min(0)
  validRecords: number;

  @ApiProperty({
    description: 'Records failing validation',
    example: 15,
  })
  @IsNumber()
  @Min(0)
  invalidRecords: number;

  @ApiProperty({
    description: 'Validation score (0-100)',
    example: 99.4,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  validationScore: number;

  @ApiPropertyOptional({
    description: 'Validation errors by type',
    type: 'object',
    example: { missing_required_field: 8, invalid_email_format: 5, duplicate_id: 2 },
  })
  @IsOptional()
  errorsSummary?: Record<string, number>;

  @ApiPropertyOptional({
    description: 'Detailed validation issues',
    type: [String],
    example: ['Record STU-001: Missing email address', 'Record STU-002: Invalid phone format'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  detailedIssues?: string[];

  @ApiPropertyOptional({
    description: 'Data quality metrics',
    type: 'object',
    example: { completeness: 98.5, accuracy: 99.2, consistency: 99.8 },
  })
  @IsOptional()
  dataQualityMetrics?: Record<string, number>;

  @ApiProperty({
    description: 'Validation timestamp',
    example: '2025-11-10T02:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  validatedAt: Date;

  @ApiPropertyOptional({
    description: 'Validation passed/failed',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  passed?: boolean;

  @ApiPropertyOptional({
    description: 'Validation report notes',
    example: 'Overall data quality is acceptable for sync',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

/**
 * Data sync schedule DTO
 */
export class DataSyncScheduleDto {
  @ApiProperty({
    description: 'Schedule ID',
    example: 'SCHEDULE-2025001',
  })
  @IsString()
  @IsNotEmpty()
  scheduleId: string;

  @ApiProperty({
    description: 'Sync configuration ID',
    example: 'SYNC-CONFIG-001',
  })
  @IsString()
  @IsNotEmpty()
  configId: string;

  @ApiProperty({
    description: 'Next scheduled sync time',
    example: '2025-11-11T02:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  nextSyncTime: Date;

  @ApiPropertyOptional({
    description: 'Last sync execution timestamp',
    example: '2025-11-10T02:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastSyncTime?: Date;

  @ApiPropertyOptional({
    description: 'Last sync status',
    enum: SyncStatus,
    example: SyncStatus.COMPLETED,
  })
  @IsOptional()
  @IsEnum(SyncStatus)
  lastSyncStatus?: SyncStatus;

  @ApiPropertyOptional({
    description: 'Days of week to sync (0=Sunday)',
    type: [Number],
    example: [1, 3, 5],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  daysOfWeek?: number[];

  @ApiProperty({
    description: 'Schedule is active',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Enable email notifications on completion',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  notifyOnCompletion?: boolean;

  @ApiPropertyOptional({
    description: 'Notification recipients',
    type: [String],
    example: ['admin@institution.edu'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  notificationRecipients?: string[];
}
