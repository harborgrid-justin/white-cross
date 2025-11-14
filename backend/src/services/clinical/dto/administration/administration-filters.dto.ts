import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum AdministrationStatus {
  ADMINISTERED = 'administered',
  REFUSED = 'refused',
  MISSED = 'missed',
  HELD = 'held',
  ERROR = 'error',
}

/**
 * Administration History Filters DTO
 * Used to query and filter medication administration logs
 */
export class AdministrationHistoryFiltersDto {
  @ApiProperty({
    description: 'Filter by student ID',
    example: '770e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiProperty({
    description: 'Filter by medication ID',
    example: '880e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsString()
  medicationId?: string;

  @ApiProperty({
    description: 'Filter by prescription ID',
    example: '660e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsString()
  prescriptionId?: string;

  @ApiProperty({
    description: 'Filter by administrator (nurse) ID',
    example: '990e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsString()
  administeredBy?: string;

  @ApiProperty({
    description: 'Filter by administration status',
    enum: AdministrationStatus,
    example: AdministrationStatus.ADMINISTERED,
    required: false,
  })
  @IsOptional()
  @IsEnum(AdministrationStatus)
  status?: AdministrationStatus;

  @ApiProperty({
    description: 'Filter by start date (ISO 8601)',
    example: '2025-11-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({
    description: 'Filter by end date (ISO 8601)',
    example: '2025-11-30T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 20,
    default: 20,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

/**
 * Check Safety DTO
 * Used to check allergies and interactions before administration
 */
export class CheckSafetyDto {
  @ApiProperty({
    description: 'Student ID to check',
    example: '770e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  studentId: string;

  @ApiProperty({
    description: 'Medication ID to check',
    example: '880e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  medicationId: string;
}

/**
 * Calculate Dose DTO
 * Used to calculate dose based on patient weight/age
 */
export class CalculateDoseDto {
  @ApiProperty({
    description: 'Prescription ID',
    example: '660e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  prescriptionId: string;

  @ApiProperty({
    description: 'Student ID',
    example: '770e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  studentId: string;
}
