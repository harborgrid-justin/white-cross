import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for checking medication-allergy conflicts
 * CRITICAL SAFETY FEATURE - Prevents allergic reactions
 */
export class CheckMedicationConflictsDto {
  @ApiProperty({
    description: 'Student UUID to check allergies against',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  studentId: string;

  @ApiProperty({
    description: 'Medication name to check for conflicts',
    example: 'Amoxicillin',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  medicationName: string;
}

/**
 * Response DTO for medication conflict checking
 */
export class MedicationConflictResponseDto {
  @ApiProperty({
    description: 'Whether any conflicts were found',
    example: true,
  })
  hasConflicts: boolean;

  @ApiProperty({
    description: 'List of conflicts with severity levels',
    example: [
      {
        allergen: 'Penicillin',
        severity: 'SEVERE',
        reaction: 'Anaphylaxis, hives, difficulty breathing',
        conflictType: 'DIRECT_MATCH',
      },
    ],
    type: 'array',
  })
  conflicts: Array<{
    allergen: string;
    severity: string;
    reaction: string;
    conflictType: 'DIRECT_MATCH' | 'CATEGORY_MATCH' | 'POTENTIAL';
  }>;

  @ApiProperty({
    description: 'Recommended action based on severity',
    example: 'DO_NOT_ADMINISTER',
    enum: ['SAFE', 'CONSULT_PHYSICIAN', 'DO_NOT_ADMINISTER'],
  })
  recommendation: 'SAFE' | 'CONSULT_PHYSICIAN' | 'DO_NOT_ADMINISTER';

  @ApiProperty({
    description: 'Additional warnings or notes',
    example:
      'Patient has life-threatening allergy to penicillin. Amoxicillin is a penicillin derivative.',
    required: false,
  })
  warning?: string;
}
