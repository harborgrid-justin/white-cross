/**
 * Metrics DTOs for analytics domain
 * Manages metric definitions and calculations
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

export enum MetricCategory {
  ENROLLMENT = 'enrollment',
  RETENTION = 'retention',
  GRADUATION = 'graduation',
  ACADEMIC_PERFORMANCE = 'academic_performance',
  FINANCIAL = 'financial',
  STUDENT_SUCCESS = 'student_success',
  OPERATIONAL = 'operational',
}

export enum MetricType {
  COUNT = 'count',
  PERCENTAGE = 'percentage',
  AVERAGE = 'average',
  MEDIAN = 'median',
  RATIO = 'ratio',
  TREND = 'trend',
}

export enum MetricFrequency {
  REAL_TIME = 'real_time',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual',
}

/**
 * Metric definition DTO
 */
export class MetricDefinitionDto {
  @ApiProperty({
    description: 'Metric ID',
    example: 'METRIC-001',
  })
  @IsString()
  @IsNotEmpty()
  metricId: string;

  @ApiProperty({
    description: 'Metric name',
    example: 'Fall Enrollment',
  })
  @IsString()
  @IsNotEmpty()
  metricName: string;

  @ApiPropertyOptional({
    description: 'Metric description',
    example: 'Total number of students enrolled in Fall semester',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Metric category',
    enum: MetricCategory,
    example: MetricCategory.ENROLLMENT,
  })
  @IsEnum(MetricCategory)
  category: MetricCategory;

  @ApiProperty({
    description: 'Metric type',
    enum: MetricType,
    example: MetricType.COUNT,
  })
  @IsEnum(MetricType)
  metricType: MetricType;

  @ApiProperty({
    description: 'Data source query',
    example: 'SELECT COUNT(*) FROM enrollments WHERE semester = ?',
  })
  @IsString()
  @IsNotEmpty()
  dataSourceQuery: string;

  @ApiPropertyOptional({
    description: 'Unit of measurement',
    example: 'Students',
  })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({
    description: 'Calculation formula',
    example: 'SUM(enrollment_count) / COUNT(departments)',
  })
  @IsOptional()
  @IsString()
  formula?: string;

  @ApiProperty({
    description: 'Calculation frequency',
    enum: MetricFrequency,
    example: MetricFrequency.DAILY,
  })
  @IsEnum(MetricFrequency)
  calculationFrequency: MetricFrequency;

  @ApiPropertyOptional({
    description: 'Target benchmark value',
    example: 5500,
  })
  @IsOptional()
  @IsNumber()
  targetValue?: number;

  @ApiPropertyOptional({
    description: 'Acceptable variance percentage',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  acceptableVariance?: number;

  @ApiProperty({
    description: 'Metric is active',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Dimension filters for metric',
    type: [String],
    example: ['Semester', 'Department', 'Student Level'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dimensions?: string[];

  @ApiPropertyOptional({
    description: 'Created date',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdDate?: Date;
}

/**
 * Metric calculation result DTO
 */
export class MetricCalculationResultDto {
  @ApiProperty({
    description: 'Calculation ID',
    example: 'CALC-2025001',
  })
  @IsString()
  @IsNotEmpty()
  calculationId: string;

  @ApiProperty({
    description: 'Metric ID being calculated',
    example: 'METRIC-001',
  })
  @IsString()
  @IsNotEmpty()
  metricId: string;

  @ApiProperty({
    description: 'Metric name',
    example: 'Fall Enrollment',
  })
  @IsString()
  @IsNotEmpty()
  metricName: string;

  @ApiProperty({
    description: 'Calculated value',
    example: 5234,
  })
  @IsNumber()
  calculatedValue: number;

  @ApiPropertyOptional({
    description: 'Previous period value',
    example: 5100,
  })
  @IsOptional()
  @IsNumber()
  previousValue?: number;

  @ApiPropertyOptional({
    description: 'Target value',
    example: 5500,
  })
  @IsOptional()
  @IsNumber()
  targetValue?: number;

  @ApiPropertyOptional({
    description: 'Variance from target (percentage)',
    example: -4.8,
  })
  @IsOptional()
  @IsNumber()
  varianceFromTarget?: number;

  @ApiPropertyOptional({
    description: 'Change from previous period (percentage)',
    example: 2.6,
  })
  @IsOptional()
  @IsNumber()
  changeFromPrevious?: number;

  @ApiPropertyOptional({
    description: 'Status relative to benchmark',
    enum: ['on_track', 'at_risk', 'below_target', 'exceeds_target'],
    example: 'at_risk',
  })
  @IsOptional()
  @IsEnum(['on_track', 'at_risk', 'below_target', 'exceeds_target'])
  status?: string;

  @ApiProperty({
    description: 'Calculation timestamp',
    example: '2025-11-10T12:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  calculatedAt: Date;

  @ApiPropertyOptional({
    description: 'Period covered by calculation',
    example: 'Fall 2025',
  })
  @IsOptional()
  @IsString()
  period?: string;

  @ApiPropertyOptional({
    description: 'Applied filters for this calculation',
    type: 'object',
    example: { department: 'Engineering', semester: 'Fall2025' },
  })
  @IsOptional()
  appliedFilters?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Data quality indicators',
    type: 'object',
    example: { completeness: 98.5, accuracy: 99.2 },
  })
  @IsOptional()
  dataQuality?: Record<string, number>;

  @ApiPropertyOptional({
    description: 'Notes about calculation',
    example: 'Calculation includes late registrations',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

/**
 * Cohort metrics DTO
 */
export class CohortMetricsDto {
  @ApiProperty({
    description: 'Cohort ID',
    example: 'COHORT-FALL2025',
  })
  @IsString()
  @IsNotEmpty()
  cohortId: string;

  @ApiProperty({
    description: 'Cohort entry term',
    example: 'Fall 2025',
  })
  @IsString()
  @IsNotEmpty()
  cohortTerm: string;

  @ApiProperty({
    description: 'Initial cohort size',
    example: 500,
  })
  @IsNumber()
  @Min(0)
  initialSize: number;

  @ApiPropertyOptional({
    description: 'Current cohort size (still enrolled)',
    example: 485,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  currentSize?: number;

  @ApiPropertyOptional({
    description: 'Retention rate',
    example: 97.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  retentionRate?: number;

  @ApiPropertyOptional({
    description: 'Persistence rate',
    example: 98.2,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  persistenceRate?: number;

  @ApiPropertyOptional({
    description: 'Average GPA',
    example: 3.45,
  })
  @IsOptional()
  @IsNumber()
  averageGpa?: number;

  @ApiPropertyOptional({
    description: 'Graduation rate (if applicable)',
    example: 92.5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  graduationRate?: number;

  @ApiPropertyOptional({
    description: 'Time to degree (average)',
    example: 4.1,
  })
  @IsOptional()
  @IsNumber()
  timeToDegreYears?: number;

  @ApiPropertyOptional({
    description: 'Success rate (all progress metrics)',
    example: 85.3,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  overallSuccessRate?: number;

  @ApiPropertyOptional({
    description: 'At-risk student count',
    example: 42,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  atRiskCount?: number;

  @ApiPropertyOptional({
    description: 'Academic intervention count',
    example: 56,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  interventionCount?: number;

  @ApiPropertyOptional({
    description: 'Last updated timestamp',
    example: '2025-11-10T12:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastUpdated?: Date;
}

/**
 * Metric alert/threshold DTO
 */
export class MetricThresholdAlertDto {
  @ApiProperty({
    description: 'Alert ID',
    example: 'ALERT-2025001',
  })
  @IsString()
  @IsNotEmpty()
  alertId: string;

  @ApiProperty({
    description: 'Metric ID being monitored',
    example: 'METRIC-001',
  })
  @IsString()
  @IsNotEmpty()
  metricId: string;

  @ApiProperty({
    description: 'Threshold type',
    enum: ['minimum', 'maximum', 'range', 'change_percentage'],
    example: 'minimum',
  })
  @IsEnum(['minimum', 'maximum', 'range', 'change_percentage'])
  thresholdType: string;

  @ApiProperty({
    description: 'Threshold value',
    example: 5000,
  })
  @IsNumber()
  thresholdValue: number;

  @ApiPropertyOptional({
    description: 'Upper range limit (for range type)',
    example: 6000,
  })
  @IsOptional()
  @IsNumber()
  upperLimit?: number;

  @ApiProperty({
    description: 'Alert severity level',
    enum: ['info', 'warning', 'critical'],
    example: 'warning',
  })
  @IsEnum(['info', 'warning', 'critical'])
  severity: string;

  @ApiProperty({
    description: 'Alert is active',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Recipients for this alert',
    type: [String],
    example: ['provost@institution.edu', 'analytics@institution.edu'],
  })
  @IsArray()
  @IsString({ each: true })
  recipients: string[];

  @ApiPropertyOptional({
    description: 'Current alert status',
    enum: ['normal', 'triggered', 'acknowledged'],
    example: 'triggered',
  })
  @IsOptional()
  @IsEnum(['normal', 'triggered', 'acknowledged'])
  currentStatus?: string;

  @ApiPropertyOptional({
    description: 'Last triggered timestamp',
    example: '2025-11-10T11:30:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastTriggered?: Date;

  @ApiPropertyOptional({
    description: 'Alert message template',
    example: 'Enrollment has fallen below minimum threshold of 5000',
  })
  @IsOptional()
  @IsString()
  messageTemplate?: string;
}

/**
 * Benchmarking comparison DTO
 */
export class BenchmarkingComparisonDto {
  @ApiProperty({
    description: 'Comparison ID',
    example: 'BENCH-2025001',
  })
  @IsString()
  @IsNotEmpty()
  comparisonId: string;

  @ApiProperty({
    description: 'Institution metric value',
    example: 5234,
  })
  @IsNumber()
  institutionValue: number;

  @ApiPropertyOptional({
    description: 'Peer group average',
    example: 5100,
  })
  @IsOptional()
  @IsNumber()
  peerGroupAverage?: number;

  @ApiPropertyOptional({
    description: 'National average',
    example: 5050,
  })
  @IsOptional()
  @IsNumber()
  nationalAverage?: number;

  @ApiPropertyOptional({
    description: 'Institution percentile rank',
    example: 72,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentileRank?: number;

  @ApiPropertyOptional({
    description: 'Performance vs peers',
    enum: ['below_average', 'average', 'above_average'],
    example: 'above_average',
  })
  @IsOptional()
  @IsEnum(['below_average', 'average', 'above_average'])
  performanceVsPeers?: string;

  @ApiPropertyOptional({
    description: 'Benchmarking data year',
    example: 2024,
  })
  @IsOptional()
  @IsNumber()
  benchmarkYear?: number;

  @ApiPropertyOptional({
    description: 'Benchmark source',
    example: 'NSF IPEDS Database',
  })
  @IsOptional()
  @IsString()
  source?: string;
}
