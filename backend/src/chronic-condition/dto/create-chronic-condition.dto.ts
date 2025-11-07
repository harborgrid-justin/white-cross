import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
  IsArray,
  IsBoolean,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ConditionStatus } from '../enums';

/**
 * DTO for creating a new chronic condition record.
 *
 * Captures comprehensive chronic disease information including diagnosis details,
 * care management requirements, medications, restrictions, and educational
 * accommodation needs.
 */
export class ChronicConditionCreateDto {
  @ApiProperty({
    description: 'UUID of the student',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  studentId: string;

  @ApiPropertyOptional({
    description: 'UUID of associated health record',
    example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  })
  @IsOptional()
  @IsUUID()
  healthRecordId?: string;

  @ApiProperty({
    description: 'Condition name',
    example: 'Type 1 Diabetes',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  condition: string;

  @ApiPropertyOptional({
    description: 'ICD-10 diagnosis code',
    example: 'E10.9',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  icdCode?: string;

  @ApiProperty({
    description: 'Date of official diagnosis',
    example: '2024-01-15',
  })
  @IsDateString()
  diagnosedDate: string;

  @ApiPropertyOptional({
    description: 'Diagnosing healthcare provider name and credentials',
    example: 'Dr. Sarah Johnson, Pediatric Endocrinology',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  diagnosedBy?: string;

  @ApiProperty({
    description: 'Current management status',
    enum: ConditionStatus,
    example: ConditionStatus.ACTIVE,
  })
  @IsEnum(ConditionStatus)
  status: ConditionStatus;

  @ApiPropertyOptional({
    description: 'Severity level',
    example: 'High',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  severity?: string;

  @ApiPropertyOptional({
    description: 'Clinical notes and observations (maximum 5000 characters)',
    example: 'Patient requires close monitoring during physical activities',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'Notes cannot exceed 5000 characters' })
  notes?: string;

  @ApiPropertyOptional({
    description:
      'Comprehensive care plan documentation (maximum 10000 characters)',
    example:
      'Blood glucose monitoring 4x daily, insulin administration protocol...',
    maxLength: 10000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10000, { message: 'Care plan cannot exceed 10000 characters' })
  carePlan?: string;

  @ApiPropertyOptional({
    description:
      'List of prescribed medications for this condition (each max 200 characters)',
    example: ['Insulin - Humalog', 'Insulin - Lantus'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(200, {
    each: true,
    message: 'Each medication cannot exceed 200 characters',
  })
  medications?: string[];

  @ApiPropertyOptional({
    description: 'Activity or dietary restrictions (each max 200 characters)',
    example: ['No unsupervised activities until stable', 'No high-sugar foods'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(200, {
    each: true,
    message: 'Each restriction cannot exceed 200 characters',
  })
  restrictions?: string[];

  @ApiPropertyOptional({
    description:
      'Known triggers that worsen the condition (each max 200 characters)',
    example: ['Illness', 'Stress', 'Irregular meals'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(200, {
    each: true,
    message: 'Each trigger cannot exceed 200 characters',
  })
  triggers?: string[];

  @ApiPropertyOptional({
    description: 'Required school accommodations (each max 200 characters)',
    example: [
      'Blood sugar checks during class',
      'Snacks allowed',
      'Extra restroom breaks',
    ],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(200, {
    each: true,
    message: 'Each accommodation cannot exceed 200 characters',
  })
  accommodations?: string[];

  @ApiPropertyOptional({
    description: 'Emergency response procedures (maximum 2000 characters)',
    example: 'If blood sugar <70 or >300, contact parent and 911 immediately',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000, {
    message: 'Emergency protocol cannot exceed 2000 characters',
  })
  emergencyProtocol?: string;

  @ApiPropertyOptional({
    description: 'Date of most recent care plan review',
    example: '2024-01-15',
  })
  @IsOptional()
  @IsDateString()
  lastReviewDate?: string;

  @ApiPropertyOptional({
    description: 'Scheduled date for next review',
    example: '2024-04-15',
  })
  @IsOptional()
  @IsDateString()
  nextReviewDate?: string;

  @ApiPropertyOptional({
    description:
      'Whether condition requires IEP (Individualized Education Program)',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  requiresIEP?: boolean;

  @ApiPropertyOptional({
    description: 'Whether condition requires 504 accommodation plan',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  requires504?: boolean;
}
