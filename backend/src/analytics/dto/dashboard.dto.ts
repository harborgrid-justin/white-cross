import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * Get Nurse Dashboard Query DTO
 */
export class GetNurseDashboardQueryDto {
  @ApiPropertyOptional({ description: 'School ID', default: 'default-school' })
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiPropertyOptional({
    description: 'Time range for dashboard data',
    enum: ['TODAY', 'WEEK', 'MONTH'],
    default: 'TODAY',
  })
  @IsOptional()
  @IsString()
  timeRange?: string;

  @ApiPropertyOptional({
    description: 'Include active health alerts',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeAlerts?: boolean;

  @ApiPropertyOptional({
    description: 'Include upcoming tasks and appointments',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeUpcoming?: boolean;
}

/**
 * Get Admin Dashboard Query DTO
 */
export class GetAdminDashboardQueryDto {
  @ApiPropertyOptional({
    description: 'District ID for district-wide analytics',
  })
  @IsOptional()
  @IsString()
  districtId?: string;

  @ApiPropertyOptional({ description: 'School ID', default: 'default-school' })
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiPropertyOptional({
    description: 'Time range for dashboard data',
    enum: ['TODAY', 'WEEK', 'MONTH', 'QUARTER', 'YEAR'],
    default: 'MONTH',
  })
  @IsOptional()
  @IsString()
  timeRange?: string;

  @ApiPropertyOptional({
    description: 'Include compliance metrics',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeComplianceMetrics?: boolean;

  @ApiPropertyOptional({
    description: 'Include financial data',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeFinancialData?: boolean;
}

/**
 * Get Platform Summary Query DTO
 */
export class GetPlatformSummaryQueryDto {
  @ApiPropertyOptional({ description: 'District ID for filtering' })
  @IsOptional()
  @IsString()
  districtId?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'School IDs to include in summary',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  schoolIds?: string[];

  @ApiPropertyOptional({ description: 'Start date for summary period' })
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({ description: 'End date for summary period' })
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Include detailed breakdown',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeDetails?: boolean;
}
