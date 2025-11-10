import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DEASchedule, DosageForm } from '../../interfaces/medication.interface';

/**
 * DTO for creating a new medication record
 * Used for medication catalog management
 */
export class HealthRecordCreateMedicationDto {
  @ApiProperty({
    description: 'Brand name of the medication',
    example: 'Advil',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Generic name of the medication',
    example: 'Ibuprofen',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  genericName?: string;

  @ApiProperty({
    description: 'Dosage form',
    enum: DosageForm,
    example: DosageForm.TABLET,
  })
  @IsEnum(DosageForm)
  dosageForm: DosageForm;

  @ApiProperty({
    description: 'Strength of the medication',
    example: '200mg',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  strength: string;

  @ApiPropertyOptional({
    description: 'Manufacturer of the medication',
    example: 'Pfizer',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  manufacturer?: string;

  @ApiPropertyOptional({
    description: 'National Drug Code (NDC)',
    example: '0009-0054-01',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  ndc?: string;

  @ApiProperty({
    description: 'Whether medication is a controlled substance',
    example: false,
  })
  @IsBoolean()
  isControlled: boolean;

  @ApiPropertyOptional({
    description: 'DEA schedule if controlled',
    enum: DEASchedule,
    example: DEASchedule.IV,
  })
  @IsOptional()
  @IsEnum(DEASchedule)
  deaSchedule?: DEASchedule;

  @ApiProperty({
    description: 'Whether administration requires a witness',
    example: false,
  })
  @IsBoolean()
  requiresWitness: boolean;
}
