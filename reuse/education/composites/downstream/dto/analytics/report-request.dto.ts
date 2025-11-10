/**
 * Report Request DTOs for analytics domain
 * Manages report generation requests and configurations
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
} from 'class-validator';

export enum ReportType {
  ENROLLMENT = 'enrollment',
  RETENTION = 'retention',
  GRADUATION = 'graduation',
  FINANCIAL_AID = 'financial_aid',
  ACADEMIC_PERFORMANCE = 'academic_performance',
  INSTITUTIONAL_RESEARCH = 'institutional_research',
  COMPLIANCE = 'compliance',
  CUSTOM = 'custom',
}

export enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json',
  HTML = 'html',
}

export enum ReportSchedule {
  ONE_TIME = 'one_time',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual',
}

/**
 * Report generation request DTO
 */
export class ReportGenerationRequestDto {
  @ApiProperty({
    description: 'Request ID',
    example: 'REPORT-REQ-2025001',
  })
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @ApiProperty({
    description: 'Report type',
    enum: ReportType,
    example: ReportType.ENROLLMENT,
  })
  @IsEnum(ReportType)
  reportType: ReportType;

  @ApiProperty({
    description: 'Requested by user',
    example: 'john.analyst@institution.edu',
  })
  @IsString()
  @IsNotEmpty()
  requestedBy: string;

  @ApiProperty({
    description: 'Report title',
    example: 'Fall 2025 Enrollment Report',
  })
  @IsString()
  @IsNotEmpty()
  reportTitle: string;

  @ApiPropertyOptional({
    description: 'Report description',
    example: 'Analysis of enrollment trends and patterns for Fall 2025 semester',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Output format',
    enum: ReportFormat,
    example: ReportFormat.PDF,
  })
  @IsEnum(ReportFormat)
  outputFormat: ReportFormat;

  @ApiPropertyOptional({
    description: 'Report parameters/filters',
    type: 'object',
    example: { semester: 'Fall2025', department: 'Engineering' },
  })
  @IsOptional()
  parameters?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Date range start',
    example: '2025-08-15',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateRangeStart?: Date;

  @ApiPropertyOptional({
    description: 'Date range end',
    example: '2025-12-15',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateRangeEnd?: Date;

  @ApiProperty({
    description: 'Request submission date',
    example: '2025-11-10',
  })
  @IsDate()
  @Type(() => Date)
  submissionDate: Date;

  @ApiProperty({
    description: 'Requested schedule',
    enum: ReportSchedule,
    example: ReportSchedule.ONE_TIME,
  })
  @IsEnum(ReportSchedule)
  schedule: ReportSchedule;

  @ApiPropertyOptional({
    description: 'Target completion date',
    example: '2025-11-17',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  targetCompletionDate?: Date;

  @ApiPropertyOptional({
    description: 'Priority level',
    enum: ['low', 'normal', 'high', 'urgent'],
    example: 'normal',
  })
  @IsOptional()
  @IsEnum(['low', 'normal', 'high', 'urgent'])
  priority?: string;

  @ApiPropertyOptional({
    description: 'Recipients for automated distribution',
    type: [String],
    example: ['director@institution.edu', 'provost@institution.edu'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recipients?: string[];

  @ApiPropertyOptional({
    description: 'Include chart visualizations',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  includeCharts?: boolean;

  @ApiPropertyOptional({
    description: 'Include detailed data tables',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  includeDataTables?: boolean;

  @ApiPropertyOptional({
    description: 'Include executive summary',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  includeExecutiveSummary?: boolean;
}

/**
 * Report parameters DTO
 */
export class ReportParametersDto {
  @ApiPropertyOptional({
    description: 'Academic term/semester',
    example: 'Fall2025',
  })
  @IsOptional()
  @IsString()
  semester?: string;

  @ApiPropertyOptional({
    description: 'Academic year',
    example: '2025-2026',
  })
  @IsOptional()
  @IsString()
  academicYear?: string;

  @ApiPropertyOptional({
    description: 'Department filter',
    example: 'College of Engineering',
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({
    description: 'Program filter',
    type: [String],
    example: ['Computer Science', 'Engineering'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  programs?: string[];

  @ApiPropertyOptional({
    description: 'Student level filter',
    enum: ['undergraduate', 'graduate', 'both'],
    example: 'both',
  })
  @IsOptional()
  @IsEnum(['undergraduate', 'graduate', 'both'])
  studentLevel?: string;

  @ApiPropertyOptional({
    description: 'Group by dimension',
    enum: ['semester', 'department', 'program', 'gender', 'ethnicity', 'class_year'],
    example: 'program',
  })
  @IsOptional()
  @IsEnum(['semester', 'department', 'program', 'gender', 'ethnicity', 'class_year'])
  groupBy?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: string;

  @ApiPropertyOptional({
    description: 'Additional filter conditions',
    type: 'object',
  })
  @IsOptional()
  customFilters?: Record<string, any>;
}

/**
 * Report generation status DTO
 */
export class ReportGenerationStatusDto {
  @ApiProperty({
    description: 'Request ID',
    example: 'REPORT-REQ-2025001',
  })
  @IsString()
  @IsNotEmpty()
  requestId: string;

  @ApiProperty({
    description: 'Report status',
    enum: ['queued', 'generating', 'completed', 'failed', 'cancelled'],
    example: 'generating',
  })
  @IsEnum(['queued', 'generating', 'completed', 'failed', 'cancelled'])
  status: string;

  @ApiPropertyOptional({
    description: 'Progress percentage',
    example: 45,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  progress?: number;

  @ApiPropertyOptional({
    description: 'Status message',
    example: 'Processing enrollment data...',
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({
    description: 'Estimated time remaining (seconds)',
    example: 120,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedTimeRemaining?: number;

  @ApiPropertyOptional({
    description: 'Date generation started',
    example: '2025-11-10T10:30:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startedAt?: Date;

  @ApiPropertyOptional({
    description: 'Date generation completed',
    example: '2025-11-10T11:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  completedAt?: Date;

  @ApiPropertyOptional({
    description: 'Error message if failed',
    example: 'Database connection timeout',
  })
  @IsOptional()
  @IsString()
  errorMessage?: string;

  @ApiPropertyOptional({
    description: 'Generated report file URL/path',
    example: 'https://reports.institution.edu/reports/2025/REPORT-REQ-2025001.pdf',
  })
  @IsOptional()
  @IsString()
  reportUrl?: string;

  @ApiPropertyOptional({
    description: 'Report file size in bytes',
    example: 2048576,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fileSizeBytes?: number;
}

/**
 * Scheduled report configuration DTO
 */
export class ScheduledReportConfigDto {
  @ApiProperty({
    description: 'Configuration ID',
    example: 'CONFIG-2025001',
  })
  @IsString()
  @IsNotEmpty()
  configId: string;

  @ApiProperty({
    description: 'Report type',
    enum: ReportType,
    example: ReportType.ENROLLMENT,
  })
  @IsEnum(ReportType)
  reportType: ReportType;

  @ApiProperty({
    description: 'Schedule frequency',
    enum: ReportSchedule,
    example: ReportSchedule.MONTHLY,
  })
  @IsEnum(ReportSchedule)
  schedule: ReportSchedule;

  @ApiPropertyOptional({
    description: 'Day of week for weekly reports (0=Sunday)',
    example: 1,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  dayOfWeek?: number;

  @ApiPropertyOptional({
    description: 'Day of month for monthly reports',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  dayOfMonth?: number;

  @ApiProperty({
    description: 'Time to generate report (HH:mm format)',
    example: '06:00',
  })
  @IsString()
  @IsNotEmpty()
  generationTime: string;

  @ApiProperty({
    description: 'Output format',
    enum: ReportFormat,
    example: ReportFormat.PDF,
  })
  @IsEnum(ReportFormat)
  outputFormat: ReportFormat;

  @ApiProperty({
    description: 'Distribution recipients',
    type: [String],
    example: ['analytics@institution.edu'],
  })
  @IsArray()
  @IsString({ each: true })
  distributionRecipients: string[];

  @ApiProperty({
    description: 'Configuration is active',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Last generation date',
    example: '2025-11-01',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastGeneratedDate?: Date;

  @ApiPropertyOptional({
    description: 'Next scheduled generation date',
    example: '2025-12-01',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  nextScheduledDate?: Date;

  @ApiPropertyOptional({
    description: 'Report parameters',
    type: ReportParametersDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ReportParametersDto)
  parameters?: ReportParametersDto;
}
