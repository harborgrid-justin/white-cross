import { IsString, IsOptional, IsDate, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * Get Medication Usage Query DTO
 */
export class GetMedicationUsageQueryDto {
  @ApiPropertyOptional({ description: 'School ID', default: 'default-school' })
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiProperty({ description: 'Start date for medication usage analysis' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'End date for medication usage analysis' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiPropertyOptional({ description: 'Filter by medication name' })
  @IsOptional()
  @IsString()
  medicationName?: string;

  @ApiPropertyOptional({ description: 'Filter by medication category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Include adherence rate calculation', default: true })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeAdherenceRate?: boolean;

  @ApiPropertyOptional({
    description: 'Group results by',
    enum: ['MEDICATION', 'CATEGORY', 'STUDENT', 'TIME'],
    default: 'MEDICATION',
  })
  @IsOptional()
  @IsString()
  groupBy?: string;
}

/**
 * Get Medication Adherence Query DTO
 */
export class GetMedicationAdherenceQueryDto {
  @ApiPropertyOptional({ description: 'School ID', default: 'default-school' })
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiProperty({ description: 'Start date for adherence analysis' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'End date for adherence analysis' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiPropertyOptional({ description: 'Filter by specific student ID' })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({ description: 'Filter by specific medication ID' })
  @IsOptional()
  @IsString()
  medicationId?: string;

  @ApiPropertyOptional({
    description: 'Adherence threshold percentage',
    default: 80,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  threshold?: number;
}
