import { IsArray, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ReportFormat, ReportType } from '../enums';

/**
 * Generate Report Base DTO
 */
export class AnalyticsGenerateReportDto {
  @ApiProperty({ description: 'School ID' })
  @IsString()
  schoolId: string;

  @ApiProperty({ description: 'Period start date' })
  @IsDate()
  @Type(() => Date)
  periodStart: Date;

  @ApiProperty({ description: 'Period end date' })
  @IsDate()
  @Type(() => Date)
  periodEnd: Date;

  @ApiProperty({ enum: ReportFormat, description: 'Report format' })
  @IsEnum(ReportFormat)
  format: ReportFormat;

  @ApiProperty({ description: 'User ID generating report' })
  @IsString()
  generatedBy: string;
}

/**
 * Generate Immunization Report DTO
 */
export class GenerateImmunizationReportDto extends AnalyticsGenerateReportDto {}

/**
 * Generate Controlled Substance Report DTO
 */
export class GenerateControlledSubstanceReportDto extends AnalyticsGenerateReportDto {}

/**
 * Generate HIPAA Audit Report DTO
 */
export class GenerateHIPAAAuditReportDto extends AnalyticsGenerateReportDto {}

/**
 * Generate Screening Report DTO
 */
export class GenerateScreeningReportDto extends AnalyticsGenerateReportDto {}

/**
 * Schedule Recurring Report DTO
 */
export class ScheduleRecurringReportDto {
  @ApiProperty({ enum: ReportType, description: 'Report type' })
  @IsEnum(ReportType)
  reportType: ReportType;

  @ApiProperty({
    enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY'],
    description: 'Frequency',
  })
  @IsEnum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY'])
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';

  @ApiProperty({ enum: ReportFormat, description: 'Report format' })
  @IsEnum(ReportFormat)
  format: ReportFormat;

  @ApiProperty({
    type: [String],
    description: 'Email addresses for distribution',
  })
  @IsArray()
  @IsString({ each: true })
  distributionList: string[];

  @ApiProperty({ description: 'Active status', default: true })
  isActive: boolean = true;

  @ApiProperty({ description: 'User ID creating schedule' })
  @IsString()
  createdBy: string;
}

/**
 * Export Report DTO
 */
export class ExportReportDto {
  @ApiProperty({ enum: ReportFormat, description: 'Export format' })
  @IsEnum(ReportFormat)
  format: ReportFormat;
}

/**
 * Distribute Report DTO
 */
export class DistributeReportDto {
  @ApiProperty({ type: [String], description: 'Recipient email addresses' })
  @IsArray()
  @IsString({ each: true })
  recipients: string[];
}

/**
 * Get Reports Filter DTO
 */
export class GetReportsFilterDto {
  @ApiPropertyOptional({
    enum: ReportType,
    description: 'Filter by report type',
  })
  @IsOptional()
  @IsEnum(ReportType)
  reportType?: ReportType;

  @ApiPropertyOptional({ description: 'Filter by school ID' })
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiPropertyOptional({ description: 'Filter by start date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Filter by end date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}
