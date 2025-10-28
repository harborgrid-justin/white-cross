import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDate,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DEASchedule } from './create-medication.dto';

/**
 * DTO for updating an existing medication record
 *
 * All fields are optional - only provided fields will be updated.
 * Used for dosage adjustments, frequency changes, and other medication modifications.
 */
export class UpdateMedicationDto {
  @ApiPropertyOptional({
    description: 'Name of the medication with strength',
    example: 'Ibuprofen 400mg',
    minLength: 2,
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(255)
  medicationName?: string;

  @ApiPropertyOptional({
    description: 'Dosage amount with unit',
    example: '400mg',
  })
  @IsString()
  @IsOptional()
  dosage?: string;

  @ApiPropertyOptional({
    description: 'How often to administer the medication',
    example: 'Every 8 hours as needed',
  })
  @IsString()
  @IsOptional()
  frequency?: string;

  @ApiPropertyOptional({
    description: 'Route of administration',
    example: 'Oral',
  })
  @IsString()
  @IsOptional()
  route?: string;

  @ApiPropertyOptional({
    description: 'Name of prescribing physician',
    example: 'Dr. Johnson',
  })
  @IsString()
  @IsOptional()
  prescribedBy?: string;

  @ApiPropertyOptional({
    description: 'Start date for medication',
    example: '2025-10-23T00:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

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
    example: 'Take with food and full glass of water',
  })
  @IsString()
  @IsOptional()
  instructions?: string;

  @ApiPropertyOptional({
    description: 'Known side effects',
    example: 'May cause drowsiness or dizziness',
  })
  @IsString()
  @IsOptional()
  sideEffects?: string;

  @ApiPropertyOptional({
    description: 'Whether the medication is currently active',
    example: true,
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
  })
  @IsBoolean()
  @IsOptional()
  isControlled?: boolean;

  @ApiPropertyOptional({
    description: 'DEA schedule for controlled substances (II-V)',
    enum: DEASchedule,
    example: DEASchedule.SCHEDULE_III,
  })
  @IsEnum(DEASchedule)
  @IsOptional()
  deaSchedule?: DEASchedule;

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
    example: 'XYZ Pharmaceuticals',
  })
  @IsString()
  @IsOptional()
  manufacturer?: string;
}
