import { IsDateString, IsEnum, IsObject, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ComplianceReportType, ComplianceStatus } from '@/database/models';

export class CreateComplianceReportDto {
  @ApiProperty({
    enum: ComplianceReportType,
    description: 'Type of compliance report',
  })
  @IsEnum(ComplianceReportType)
  reportType: ComplianceReportType;

  @ApiProperty({
    description: 'Report title (5-200 chars)',
    minLength: 5,
    maxLength: 200,
  })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({ description: 'Detailed report description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Reporting period (e.g., 2024-Q1)' })
  @IsString()
  period: string;

  @ApiPropertyOptional({ description: 'Report due date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

export class UpdateComplianceReportDto {
  @ApiPropertyOptional({
    enum: ComplianceStatus,
    description: 'Updated status',
  })
  @IsOptional()
  @IsEnum(ComplianceStatus)
  status?: ComplianceStatus;

  @ApiPropertyOptional({ description: 'Structured findings data' })
  @IsOptional()
  @IsObject()
  findings?: any;

  @ApiPropertyOptional({ description: 'Structured recommendations' })
  @IsOptional()
  @IsObject()
  recommendations?: any;

  @ApiPropertyOptional({ description: 'Reviewer user ID' })
  @IsOptional()
  @IsString()
  reviewedBy?: string;
}

export class ComplianceGenerateReportDto {
  @ApiProperty({
    enum: ComplianceReportType,
    description: 'Report type to generate',
  })
  @IsEnum(ComplianceReportType)
  reportType: ComplianceReportType;

  @ApiProperty({ description: 'Reporting period' })
  @IsString()
  period: string;

  @ApiPropertyOptional({
    description: 'Start date for data collection (ISO 8601)',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date for data collection (ISO 8601)',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Include automated recommendations',
    default: true,
  })
  @IsOptional()
  includeRecommendations?: boolean;
}

export class QueryComplianceReportDto {
  @ApiPropertyOptional({
    enum: ComplianceReportType,
    description: 'Filter by report type',
  })
  @IsOptional()
  @IsEnum(ComplianceReportType)
  reportType?: ComplianceReportType;

  @ApiPropertyOptional({
    enum: ComplianceStatus,
    description: 'Filter by status',
  })
  @IsOptional()
  @IsEnum(ComplianceStatus)
  status?: ComplianceStatus;

  @ApiPropertyOptional({ description: 'Filter by period' })
  @IsOptional()
  @IsString()
  period?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @IsOptional()
  limit?: number;
}
