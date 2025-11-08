import { IsArray, IsDate, IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ReportFormat } from '../enums/report-format.enum';

/**
 * Generate Custom Report DTO
 */
export class AnalyticsGenerateCustomReportDto {
  @ApiProperty({ description: 'Report name' })
  @IsString()
  reportName: string;

  @ApiProperty({
    description: 'Report type',
    enum: [
      'IMMUNIZATION_REPORT',
      'COMPLIANCE_STATUS',
      'STUDENT_HEALTH_SUMMARY',
      'MEDICATION_USAGE',
      'INCIDENT_ANALYSIS',
      'APPOINTMENT_SUMMARY',
      'HEALTH_METRICS',
    ],
  })
  @IsString()
  reportType: string;

  @ApiProperty({ description: 'Start date for report period' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'End date for report period' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiPropertyOptional({
    description: 'Report output format',
    enum: ReportFormat,
    default: ReportFormat.JSON,
  })
  @IsOptional()
  @IsEnum(ReportFormat)
  format?: ReportFormat;

  @ApiPropertyOptional({ description: 'Filter criteria for report' })
  @IsOptional()
  @IsObject()
  filters?: {
    schoolId?: string;
    districtId?: string;
    gradeLevel?: string;
    studentIds?: string[];
    [key: string]: any;
  };

  @ApiPropertyOptional({
    type: [String],
    description: 'Email recipients for report distribution',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recipients?: string[];

  @ApiPropertyOptional({
    description: 'Schedule configuration for recurring reports',
  })
  @IsOptional()
  @IsObject()
  schedule?: {
    frequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
    dayOfWeek?: number;
    dayOfMonth?: number;
    time?: string;
  };
}

/**
 * Get Report Param DTO
 */
export class GetReportParamDto {
  @ApiProperty({ description: 'Report ID' })
  @IsString()
  id: string;
}

/**
 * Get Report Query DTO
 */
export class GetReportQueryDto {
  @ApiPropertyOptional({
    description: 'Include full report data',
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  includeData?: boolean;

  @ApiPropertyOptional({
    description: 'Override output format for retrieval',
    enum: ReportFormat,
  })
  @IsOptional()
  @IsEnum(ReportFormat)
  format?: ReportFormat;
}
