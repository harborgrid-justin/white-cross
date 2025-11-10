/**
 * Audit Trail DTOs for compliance domain
 * Logs all system activities for compliance and security purposes
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
  IsIP,
  Min,
} from 'class-validator';

export enum AuditAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  EXPORT = 'export',
  IMPORT = 'import',
  LOGIN = 'login',
  LOGOUT = 'logout',
  ACCESS_DENIED = 'access_denied',
  PERMISSION_CHANGE = 'permission_change',
}

export enum AuditEntity {
  STUDENT_RECORD = 'student_record',
  TRANSCRIPT = 'transcript',
  FINANCIAL_RECORD = 'financial_record',
  DISCIPLINARY_RECORD = 'disciplinary_record',
  HEALTH_RECORD = 'health_record',
  USER_ACCOUNT = 'user_account',
  SYSTEM_CONFIGURATION = 'system_configuration',
}

export enum AuditSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Audit log entry DTO
 */
export class AuditLogEntryDto {
  @ApiProperty({
    description: 'Audit log ID',
    example: 'AUDIT-2025001',
  })
  @IsString()
  @IsNotEmpty()
  auditId: string;

  @ApiProperty({
    description: 'Action performed',
    enum: AuditAction,
    example: AuditAction.UPDATE,
  })
  @IsEnum(AuditAction)
  action: AuditAction;

  @ApiProperty({
    description: 'Entity type affected',
    enum: AuditEntity,
    example: AuditEntity.STUDENT_RECORD,
  })
  @IsEnum(AuditEntity)
  entityType: AuditEntity;

  @ApiProperty({
    description: 'Entity ID that was affected',
    example: 'STU-2025001',
  })
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @ApiProperty({
    description: 'User who performed the action',
    example: 'jane.smith@institution.edu',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({
    description: 'User role at time of action',
    example: 'Registrar',
  })
  @IsOptional()
  @IsString()
  userRole?: string;

  @ApiProperty({
    description: 'Timestamp of action',
    example: '2025-11-10T14:30:00Z',
  })
  @IsDate()
  @Type(() => Date)
  timestamp: Date;

  @ApiPropertyOptional({
    description: 'IP address from which action was performed',
    example: '192.168.1.100',
  })
  @IsOptional()
  @IsIP()
  ipAddress?: string;

  @ApiPropertyOptional({
    description: 'Previous field values (for updates)',
    type: 'object',
  })
  @IsOptional()
  previousValues?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'New field values (for updates)',
    type: 'object',
  })
  @IsOptional()
  newValues?: Record<string, any>;

  @ApiProperty({
    description: 'Action severity level',
    enum: AuditSeverity,
    example: AuditSeverity.INFO,
  })
  @IsEnum(AuditSeverity)
  severity: AuditSeverity;

  @ApiPropertyOptional({
    description: 'Description of action taken',
    example: 'Updated student academic standing',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'System or application source',
    example: 'Student Information System',
  })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({
    description: 'Action status',
    enum: ['success', 'failure', 'partial'],
    example: 'success',
  })
  @IsOptional()
  @IsEnum(['success', 'failure', 'partial'])
  status?: string;

  @ApiPropertyOptional({
    description: 'Error message if action failed',
    example: 'Database connection timeout',
  })
  @IsOptional()
  @IsString()
  errorMessage?: string;

  @ApiPropertyOptional({
    description: 'Session ID for tracking related actions',
    example: 'SESSION-2025-ABC123',
  })
  @IsOptional()
  @IsString()
  sessionId?: string;
}

/**
 * Audit trail search query DTO
 */
export class AuditTrailSearchDto {
  @ApiPropertyOptional({
    description: 'Entity ID to search for',
    example: 'STU-2025001',
  })
  @IsOptional()
  @IsString()
  entityId?: string;

  @ApiPropertyOptional({
    description: 'Entity type filter',
    enum: AuditEntity,
    example: AuditEntity.STUDENT_RECORD,
  })
  @IsOptional()
  @IsEnum(AuditEntity)
  entityType?: AuditEntity;

  @ApiPropertyOptional({
    description: 'User ID to filter by',
    example: 'jane.smith@institution.edu',
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Action filter',
    enum: AuditAction,
    example: AuditAction.UPDATE,
  })
  @IsOptional()
  @IsEnum(AuditAction)
  action?: AuditAction;

  @ApiPropertyOptional({
    description: 'Start date for search range',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'End date for search range',
    example: '2025-11-10',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Severity filter',
    enum: AuditSeverity,
  })
  @IsOptional()
  @IsEnum(AuditSeverity)
  severity?: AuditSeverity;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Records per page',
    example: 50,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  pageSize?: number;
}

/**
 * Audit trail report DTO
 */
export class AuditTrailReportDto {
  @ApiProperty({
    description: 'Report ID',
    example: 'AUDIT-REPORT-2025001',
  })
  @IsString()
  @IsNotEmpty()
  reportId: string;

  @ApiProperty({
    description: 'Report title',
    example: 'Student Records Access Audit Report',
  })
  @IsString()
  @IsNotEmpty()
  reportTitle: string;

  @ApiProperty({
    description: 'Report period start',
    example: '2025-01-01',
  })
  @IsDate()
  @Type(() => Date)
  periodStart: Date;

  @ApiProperty({
    description: 'Report period end',
    example: '2025-11-10',
  })
  @IsDate()
  @Type(() => Date)
  periodEnd: Date;

  @ApiProperty({
    description: 'Total records in period',
    example: 5842,
  })
  @IsNumber()
  @Min(0)
  totalRecords: number;

  @ApiProperty({
    description: 'Records by action type',
    type: 'object',
  })
  @IsNotEmpty()
  recordsByAction: Record<AuditAction, number>;

  @ApiProperty({
    description: 'Records by entity type',
    type: 'object',
  })
  @IsNotEmpty()
  recordsByEntity: Record<AuditEntity, number>;

  @ApiPropertyOptional({
    description: 'Suspicious activities detected',
    type: [String],
    example: ['Bulk download of 200 student records by user X', 'Failed login attempts from IP Y'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  suspiciousActivities?: string[];

  @ApiPropertyOptional({
    description: 'Critical events',
    type: [AuditLogEntryDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AuditLogEntryDto)
  criticalEvents?: AuditLogEntryDto[];

  @ApiPropertyOptional({
    description: 'Report generated timestamp',
    example: '2025-11-10T15:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  generatedAt?: Date;

  @ApiPropertyOptional({
    description: 'Generated by user',
    example: 'compliance.officer@institution.edu',
  })
  @IsOptional()
  @IsString()
  generatedBy?: string;
}

/**
 * User activity summary DTO
 */
export class UserActivitySummaryDto {
  @ApiProperty({
    description: 'User ID',
    example: 'jane.smith@institution.edu',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'User full name',
    example: 'Jane Smith',
  })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({
    description: 'User role',
    example: 'Registrar',
  })
  @IsString()
  @IsNotEmpty()
  userRole: string;

  @ApiProperty({
    description: 'Department',
    example: 'Registrar Office',
  })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({
    description: 'Activity count in period',
    example: 234,
  })
  @IsNumber()
  @Min(0)
  activityCount: number;

  @ApiPropertyOptional({
    description: 'Last login timestamp',
    example: '2025-11-10T08:30:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastLogin?: Date;

  @ApiPropertyOptional({
    description: 'Data access count',
    example: 156,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  dataAccessCount?: number;

  @ApiPropertyOptional({
    description: 'Data modification count',
    example: 45,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  dataModificationCount?: number;

  @ApiPropertyOptional({
    description: 'Failed access attempts',
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  failedAttempts?: number;

  @ApiPropertyOptional({
    description: 'Risk assessment',
    enum: ['low', 'medium', 'high'],
    example: 'low',
  })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  riskAssessment?: string;

  @ApiPropertyOptional({
    description: 'Flagged for review',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  flaggedForReview?: boolean;
}
