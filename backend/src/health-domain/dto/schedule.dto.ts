/**
 * @fileoverview CDC Schedule and Reporting DTOs
 * @module health-domain/dto/schedule
 * @description Data transfer objects for CDC vaccination schedules, compliance reporting,
 * and state registry integration
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
  IsUUID,
  IsArray,
  IsDate,
  IsBoolean,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Age unit for schedule queries
 */
export enum AgeUnit {
  MONTHS = 'MONTHS',
  YEARS = 'YEARS',
}

/**
 * School grade levels
 */
export enum GradeLevel {
  PRE_K = 'PRE_K',
  KINDERGARTEN = 'KINDERGARTEN',
  GRADE_1 = 'GRADE_1',
  GRADE_2 = 'GRADE_2',
  GRADE_3 = 'GRADE_3',
  GRADE_4 = 'GRADE_4',
  GRADE_5 = 'GRADE_5',
  GRADE_6 = 'GRADE_6',
  GRADE_7 = 'GRADE_7',
  GRADE_8 = 'GRADE_8',
  GRADE_9 = 'GRADE_9',
  GRADE_10 = 'GRADE_10',
  GRADE_11 = 'GRADE_11',
  GRADE_12 = 'GRADE_12',
}

/**
 * State reporting format
 */
export enum ReportFormat {
  CSV = 'CSV',
  HL7 = 'HL7',
  JSON = 'JSON',
  XML = 'XML',
}

/**
 * Get Schedule by Age DTO
 */
export class GetScheduleByAgeDto {
  @ApiProperty({
    description: 'Age value',
    example: 12,
    minimum: 0,
    maximum: 240,
  })
  @IsInt()
  @Min(0)
  @Max(240)
  age: number;

  @ApiProperty({
    description: 'Age unit',
    enum: AgeUnit,
    example: AgeUnit.MONTHS,
    default: AgeUnit.MONTHS,
  })
  @IsEnum(AgeUnit)
  ageUnit: AgeUnit;

  @ApiProperty({
    description: 'State code for state-specific requirements',
    example: 'CA',
    required: false,
    maxLength: 2,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  stateCode?: string;
}

/**
 * Get Catch-Up Schedule DTO
 */
export class GetCatchUpScheduleDto {
  @ApiProperty({
    description: 'Student UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4')
  studentId: string;

  @ApiProperty({
    description: 'Current age in months',
    example: 84,
    minimum: 0,
    maximum: 240,
  })
  @IsInt()
  @Min(0)
  @Max(240)
  currentAgeMonths: number;

  @ApiProperty({
    description: 'Include accelerated catch-up schedules',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includeAccelerated?: boolean;
}

/**
 * School Entry Requirements DTO
 */
export class SchoolEntryRequirementsDto {
  @ApiProperty({
    description: 'Grade level for entry requirements',
    enum: GradeLevel,
    example: GradeLevel.KINDERGARTEN,
  })
  @IsEnum(GradeLevel)
  gradeLevel: GradeLevel;

  @ApiProperty({
    description: 'State code (US)',
    example: 'CA',
    maxLength: 2,
  })
  @IsString()
  @MaxLength(2)
  stateCode: string;

  @ApiProperty({
    description: 'School year',
    example: '2025-2026',
    required: false,
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  schoolYear?: string;
}

/**
 * Check Contraindications DTO
 */
export class CheckContraindicationsDto {
  @ApiProperty({
    description: 'Student UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4')
  studentId: string;

  @ApiProperty({
    description: 'CVX code of vaccine to check',
    example: '03',
    maxLength: 10,
  })
  @IsString()
  @MaxLength(10)
  cvxCode: string;

  @ApiProperty({
    description: 'Include precautions (not absolute contraindications)',
    example: true,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includePrecautions?: boolean;
}

/**
 * Vaccination Rates Query DTO
 */
export class VaccinationRatesQueryDto {
  @ApiProperty({
    description: 'School ID to filter by',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  schoolId?: string;

  @ApiProperty({
    description: 'Grade level to filter by',
    enum: GradeLevel,
    required: false,
  })
  @IsOptional()
  @IsEnum(GradeLevel)
  gradeLevel?: GradeLevel;

  @ApiProperty({
    description: 'Specific vaccine to report on',
    example: 'MMR',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  vaccineName?: string;

  @ApiProperty({
    description: 'Start date for date range',
    example: '2025-01-01',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiProperty({
    description: 'End date for date range',
    example: '2025-12-31',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}

/**
 * State Reporting Export DTO
 */
export class StateReportingExportDto {
  @ApiProperty({
    description: 'State code for reporting',
    example: 'CA',
    maxLength: 2,
  })
  @IsString()
  @MaxLength(2)
  stateCode: string;

  @ApiProperty({
    description: 'Report format',
    enum: ReportFormat,
    example: ReportFormat.HL7,
  })
  @IsEnum(ReportFormat)
  format: ReportFormat;

  @ApiProperty({
    description: 'School IDs to include (empty = all schools)',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  schoolIds?: string[];

  @ApiProperty({
    description: 'Start date for report',
    example: '2025-01-01',
  })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: 'End date for report',
    example: '2025-12-31',
  })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({
    description: 'Include only compliant students',
    example: false,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  compliantOnly?: boolean;

  @ApiProperty({
    description: 'Include exemptions in report',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includeExemptions?: boolean;
}

/**
 * Overdue Vaccinations Query DTO
 */
export class OverdueVaccinationsQueryDto {
  @ApiProperty({
    description: 'School ID to filter by',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  schoolId?: string;

  @ApiProperty({
    description: 'Grade level to filter by',
    enum: GradeLevel,
    required: false,
  })
  @IsOptional()
  @IsEnum(GradeLevel)
  gradeLevel?: GradeLevel;

  @ApiProperty({
    description: 'Days overdue threshold (default: 0)',
    example: 30,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  daysOverdue?: number;

  @ApiProperty({
    description: 'Specific vaccine name',
    example: 'MMR',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  vaccineName?: string;
}
