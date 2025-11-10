import { IsArray, IsBoolean, IsDateString, IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ConditionStatus } from '../../interfaces/chronic-condition.interface';

/**
 * DTO for creating a new chronic condition record
 * PHI-protected endpoint requiring authentication
 */
export class CreateChronicConditionDto {
  @ApiProperty({
    description: 'Student UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  studentId: string;

  @ApiProperty({
    description: 'Name of the chronic condition',
    example: 'Asthma',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  condition: string;

  @ApiPropertyOptional({
    description: 'ICD diagnostic code',
    example: 'J45.909',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  icdCode?: string;

  @ApiProperty({
    description: 'Date when condition was diagnosed (ISO 8601)',
    example: '2023-05-15',
  })
  @IsDateString()
  @Type(() => Date)
  diagnosedDate: Date;

  @ApiPropertyOptional({
    description: 'Healthcare provider who diagnosed',
    example: 'Dr. Sarah Johnson',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  diagnosedBy?: string;

  @ApiProperty({
    description: 'Current status of the condition',
    enum: ConditionStatus,
    example: ConditionStatus.ACTIVE,
  })
  @IsEnum(ConditionStatus)
  status: ConditionStatus;

  @ApiPropertyOptional({
    description: 'Severity level',
    example: 'Moderate',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  severity?: string;

  @ApiPropertyOptional({
    description: 'Additional clinical notes',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @ApiPropertyOptional({
    description: 'Care plan and management strategy',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  carePlan?: string;

  @ApiPropertyOptional({
    description: 'Associated medications',
    type: [String],
    example: ['Albuterol inhaler', 'Fluticasone nasal spray'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  medications?: string[];

  @ApiPropertyOptional({
    description: 'Activity restrictions',
    type: [String],
    example: ['No strenuous exercise', 'Avoid smoke exposure'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  restrictions?: string[];

  @ApiPropertyOptional({
    description: 'Known triggers',
    type: [String],
    example: ['Pollen', 'Cold air', 'Exercise'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  triggers?: string[];

  @ApiPropertyOptional({
    description: 'Required accommodations',
    type: [String],
    example: ['Extra time for assignments', 'Seating near exit'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  accommodations?: string[];

  @ApiPropertyOptional({
    description: 'Emergency action plan',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  emergencyActionPlan?: string;

  @ApiPropertyOptional({
    description: 'Review frequency in months',
    example: 6,
    minimum: 1,
    maximum: 24,
  })
  @IsOptional()
  @Type(() => Number)
  reviewFrequencyMonths?: number;

  @ApiPropertyOptional({
    description: 'Requires IEP accommodation',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  requiresIEP?: boolean;

  @ApiPropertyOptional({
    description: 'Requires 504 plan accommodation',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  requires504?: boolean;
}
