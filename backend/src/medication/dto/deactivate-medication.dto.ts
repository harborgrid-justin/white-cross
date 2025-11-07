import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Deactivation type categories for audit trail
 */
export enum DeactivationType {
  COMPLETED = 'COMPLETED',
  DISCONTINUED = 'DISCONTINUED',
  ADVERSE_REACTION = 'ADVERSE_REACTION',
  STUDENT_TRANSFERRED = 'STUDENT_TRANSFERRED',
  EXPIRED = 'EXPIRED',
  ERROR = 'ERROR',
  OTHER = 'OTHER',
}

/**
 * DTO for deactivating (soft deleting) a medication
 *
 * Requires detailed reason and type for complete audit trail.
 * Used when discontinuing medications while preserving historical records.
 */
export class DeactivateMedicationDto {
  @ApiProperty({
    description: 'Detailed reason for deactivation (for audit trail)',
    example: 'Treatment completed successfully. Full 10-day course finished.',
  })
  @IsString()
  @IsNotEmpty()
  reason!: string;

  @ApiProperty({
    description: 'Category of deactivation',
    enum: DeactivationType,
    example: DeactivationType.COMPLETED,
  })
  @IsEnum(DeactivationType)
  @IsNotEmpty()
  deactivationType!: DeactivationType;
}
