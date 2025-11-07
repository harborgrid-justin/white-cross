import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

/**
 * Record Medication Refusal DTO
 * Used when a student refuses to take prescribed medication
 */
export class RecordRefusalDto {
  @ApiProperty({
    description: 'Prescription ID for the refused medication',
    example: '660e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  prescriptionId: string;

  @ApiProperty({
    description: 'Scheduled time for the medication',
    example: '2025-11-04T10:00:00Z',
  })
  @IsString()
  scheduledTime: string;

  @ApiProperty({
    description: 'Reason for refusal',
    example: 'Student stated medication makes them feel nauseous',
  })
  @IsString()
  reason: string;

  @ApiProperty({
    description: 'Additional notes about refusal',
    example: 'Parent notified, prescriber will be contacted',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

/**
 * Record Missed Dose DTO
 * Used when a scheduled dose was not administered (e.g., student absent)
 */
export class RecordMissedDoseDto {
  @ApiProperty({
    description: 'Prescription ID for the missed medication',
    example: '660e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  prescriptionId: string;

  @ApiProperty({
    description: 'Scheduled time for the medication',
    example: '2025-11-04T10:00:00Z',
  })
  @IsString()
  scheduledTime: string;

  @ApiProperty({
    description: 'Reason for missed dose',
    example: 'Student absent from school',
  })
  @IsString()
  reason: string;

  @ApiProperty({
    description: 'Additional notes about missed dose',
    example: 'Parent will administer at home',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

/**
 * Record Held Medication DTO
 * Used when a clinician decides to hold a medication for clinical reasons
 */
export class RecordHeldMedicationDto {
  @ApiProperty({
    description: 'Prescription ID for the held medication',
    example: '660e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  prescriptionId: string;

  @ApiProperty({
    description: 'Scheduled time for the medication',
    example: '2025-11-04T10:00:00Z',
  })
  @IsString()
  scheduledTime: string;

  @ApiProperty({
    description: 'Brief reason medication was held',
    example: 'Elevated blood pressure',
  })
  @IsString()
  reason: string;

  @ApiProperty({
    description: 'Detailed clinical rationale for holding medication',
    example:
      'BP 145/95, holding medication per protocol. Prescriber contacted.',
  })
  @IsString()
  clinicalRationale: string;
}
