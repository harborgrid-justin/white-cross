import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsDate,
  IsUUID,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DEA Schedule classification for controlled substances
 */
export enum DEASchedule {
  SCHEDULE_II = 'II',
  SCHEDULE_III = 'III',
  SCHEDULE_IV = 'IV',
  SCHEDULE_V = 'V',
}

/**
 * DTO for creating a new medication record
 *
 * Validates all required fields for medication creation including
 * pharmaceutical metadata, prescribing details, and student assignment.
 */
export class CreateMedicationDto {
  @ApiProperty({
    description: 'Name of the medication with strength',
    example: 'Ibuprofen 200mg',
    minLength: 2,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  medicationName!: string;

  @ApiProperty({
    description: 'Dosage amount with unit',
    example: '200mg',
  })
  @IsString()
  @IsNotEmpty()
  dosage!: string;

  @ApiProperty({
    description: 'How often to administer the medication',
    example: 'Every 6 hours as needed',
  })
  @IsString()
  @IsNotEmpty()
  frequency!: string;

  @ApiProperty({
    description: 'Route of administration',
    example: 'Oral',
  })
  @IsString()
  @IsNotEmpty()
  route!: string;

  @ApiProperty({
    description: 'Name of prescribing physician',
    example: 'Dr. Smith',
  })
  @IsString()
  @IsNotEmpty()
  prescribedBy!: string;

  @ApiProperty({
    description: 'Start date for medication',
    example: '2025-10-23T00:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate!: Date;

  @ApiProperty({
    description: 'UUID of the student this medication is for',
    example: '660e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  studentId!: string;

  @ApiPropertyOptional({
    description: 'End date for medication (null if ongoing)',
    example: '2025-11-23T00:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Special administration instructions',
    example: 'Take with food',
  })
  @IsString()
  @IsOptional()
  instructions?: string;

  @ApiPropertyOptional({
    description: 'Known side effects',
    example: 'May cause drowsiness',
  })
  @IsString()
  @IsOptional()
  sideEffects?: string;

  @ApiPropertyOptional({
    description: 'Whether the medication is currently active',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'National Drug Code (11-digit format)',
    example: '00406-0486-01',
  })
  @IsString()
  @IsOptional()
  ndc?: string;

  @ApiPropertyOptional({
    description: 'Whether this is a controlled substance',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isControlled?: boolean;

  @ApiPropertyOptional({
    description: 'DEA schedule for controlled substances (II-V)',
    enum: DEASchedule,
    example: DEASchedule.SCHEDULE_II,
  })
  @IsEnum(DEASchedule)
  @IsOptional()
  deaSchedule?: DEASchedule;

  @ApiPropertyOptional({
    description: 'Whether witness verification is required for administration',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  requiresWitness?: boolean;

  @ApiPropertyOptional({
    description: 'Generic name of the medication',
    example: 'Ibuprofen',
  })
  @IsString()
  @IsOptional()
  genericName?: string;

  @ApiPropertyOptional({
    description: 'Dosage form (Tablet, Capsule, Solution, etc.)',
    example: 'Tablet',
  })
  @IsString()
  @IsOptional()
  dosageForm?: string;

  @ApiPropertyOptional({
    description: 'Manufacturer name',
    example: 'ABC Pharmaceuticals',
  })
  @IsString()
  @IsOptional()
  manufacturer?: string;
}
