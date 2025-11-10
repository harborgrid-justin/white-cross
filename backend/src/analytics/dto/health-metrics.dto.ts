import { IsArray, IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * Get Health Metrics Query DTO
 */
export class GetHealthMetricsQueryDto {
  @ApiPropertyOptional({ description: 'School ID' })
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiPropertyOptional({ description: 'District ID' })
  @IsOptional()
  @IsString()
  districtId?: string;

  @ApiProperty({ description: 'Start date for metrics' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'End date for metrics' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiPropertyOptional({
    type: [String],
    description: 'Specific metric types to retrieve',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  metricTypes?: string[];

  @ApiPropertyOptional({
    description: 'Aggregation level',
    enum: ['SCHOOL', 'DISTRICT', 'GRADE'],
    default: 'SCHOOL',
  })
  @IsOptional()
  @IsString()
  aggregationLevel?: string;

  @ApiPropertyOptional({
    description: 'Include comparison with previous period',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  compareWithPrevious?: boolean;
}

/**
 * Get Health Trends Query DTO
 */
export class GetHealthTrendsQueryDto {
  @ApiPropertyOptional({ description: 'School ID' })
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiPropertyOptional({ description: 'District ID' })
  @IsOptional()
  @IsString()
  districtId?: string;

  @ApiProperty({ description: 'Start date for trend analysis' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'End date for trend analysis' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiPropertyOptional({
    description: 'Time period granularity',
    enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'],
    default: 'MONTHLY',
  })
  @IsOptional()
  @IsString()
  timePeriod?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Specific metrics to track',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  metrics?: string[];

  @ApiPropertyOptional({
    description: 'Include predictive forecasting',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeForecasting?: boolean;
}

/**
 * Get Student Health Metrics Param DTO
 */
export class GetStudentHealthMetricsParamDto {
  @ApiProperty({ description: 'Student ID' })
  @IsString()
  studentId: string;
}

/**
 * Get Student Health Metrics Query DTO
 */
export class GetStudentHealthMetricsQueryDto {
  @ApiPropertyOptional({ description: 'Start date for student metrics' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({ description: 'End date for student metrics' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Include historical data',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeHistory?: boolean;
}

/**
 * Get School Metrics Param DTO
 */
export class GetSchoolMetricsParamDto {
  @ApiProperty({ description: 'School ID' })
  @IsString()
  schoolId: string;
}

/**
 * Get School Metrics Query DTO
 */
export class GetSchoolMetricsQueryDto {
  @ApiProperty({ description: 'Start date for school metrics' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'End date for school metrics' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiPropertyOptional({ description: 'Filter by grade level' })
  @IsOptional()
  @IsString()
  gradeLevel?: string;

  @ApiPropertyOptional({
    description: 'Include comparisons with other schools',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeComparisons?: boolean;
}
