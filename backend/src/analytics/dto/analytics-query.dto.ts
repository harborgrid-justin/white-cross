import { IsArray, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TimePeriod } from '../enums/time-period.enum';

/**
 * Get Population Summary DTO
 */
export class GetPopulationSummaryDto {
  @ApiProperty({ description: 'School ID' })
  @IsString()
  schoolId: string;

  @ApiProperty({ enum: TimePeriod, description: 'Time period for analytics' })
  @IsEnum(TimePeriod)
  period: TimePeriod;

  @ApiPropertyOptional({ description: 'Custom range start date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  customStart?: Date;

  @ApiPropertyOptional({ description: 'Custom range end date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  customEnd?: Date;
}

/**
 * Get Condition Trends DTO
 */
export class GetConditionTrendsDto {
  @ApiProperty({ description: 'School ID' })
  @IsString()
  schoolId: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Specific conditions to track',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  conditions?: string[];

  @ApiPropertyOptional({
    enum: TimePeriod,
    description: 'Time period',
    default: TimePeriod.LAST_90_DAYS,
  })
  @IsOptional()
  @IsEnum(TimePeriod)
  period?: TimePeriod;
}

/**
 * Get Medication Trends DTO
 */
export class GetMedicationTrendsDto {
  @ApiProperty({ description: 'School ID' })
  @IsString()
  schoolId: string;

  @ApiPropertyOptional({
    enum: TimePeriod,
    description: 'Time period',
    default: TimePeriod.LAST_30_DAYS,
  })
  @IsOptional()
  @IsEnum(TimePeriod)
  period?: TimePeriod;
}

/**
 * Get Incident Analytics DTO
 */
export class GetIncidentAnalyticsDto {
  @ApiProperty({ description: 'School ID' })
  @IsString()
  schoolId: string;

  @ApiPropertyOptional({
    enum: TimePeriod,
    description: 'Time period',
    default: TimePeriod.LAST_90_DAYS,
  })
  @IsOptional()
  @IsEnum(TimePeriod)
  period?: TimePeriod;
}

/**
 * Get Immunization Dashboard DTO
 */
export class GetImmunizationDashboardDto {
  @ApiProperty({ description: 'School ID' })
  @IsString()
  schoolId: string;
}

/**
 * Get Absence Correlation DTO
 */
export class GetAbsenceCorrelationDto {
  @ApiProperty({ description: 'School ID' })
  @IsString()
  schoolId: string;

  @ApiPropertyOptional({
    enum: TimePeriod,
    description: 'Time period',
    default: TimePeriod.LAST_30_DAYS,
  })
  @IsOptional()
  @IsEnum(TimePeriod)
  period?: TimePeriod;
}

/**
 * Get Predictive Insights DTO
 */
export class GetPredictiveInsightsDto {
  @ApiProperty({ description: 'School ID' })
  @IsString()
  schoolId: string;
}

/**
 * Compare Cohorts DTO
 */
export class CompareCohort {
  @ApiProperty({ description: 'Cohort name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Filter criteria' })
  filter: any;
}

export class CompareCohortsDto {
  @ApiProperty({ description: 'School ID' })
  @IsString()
  schoolId: string;

  @ApiProperty({ type: [CompareCohort], description: 'Cohort definitions' })
  @IsArray()
  cohorts: CompareCohort[];
}

/**
 * Get Health Metrics DTO
 */
export class GetHealthMetricsDto {
  @ApiProperty({ description: 'School ID' })
  @IsString()
  schoolId: string;

  @ApiProperty({ enum: TimePeriod, description: 'Time period' })
  @IsEnum(TimePeriod)
  period: TimePeriod;
}
