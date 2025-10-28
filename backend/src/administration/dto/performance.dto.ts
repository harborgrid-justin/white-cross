import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
  IsDate,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MetricType } from '../enums/administration.enums';

/**
 * DTO for recording a performance metric
 */
export class RecordMetricDto {
  @ApiProperty({ description: 'Metric type', enum: MetricType })
  @IsEnum(MetricType)
  metricType: MetricType;

  @ApiProperty({ description: 'Metric value' })
  @IsNumber()
  value: number;

  @ApiPropertyOptional({ description: 'Unit of measurement (e.g., %, ms, count)' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ description: 'Additional metadata tags' })
  @IsOptional()
  @IsObject()
  tags?: Record<string, any>;

  @ApiPropertyOptional({ description: 'When metric was recorded' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  recordedAt?: Date;
}

/**
 * DTO for querying performance metrics
 */
export class MetricQueryDto {
  @ApiPropertyOptional({ description: 'Filter by metric type', enum: MetricType })
  @IsOptional()
  @IsEnum(MetricType)
  metricType?: MetricType;

  @ApiPropertyOptional({ description: 'Start date for filtering' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({ description: 'End date for filtering' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}
