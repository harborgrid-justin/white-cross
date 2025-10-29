import { PartialType, OmitType } from '@nestjs/swagger';
import { AddAllergyDto } from './add-allergy.dto';

/**
 * Update Student Drug Allergy DTO
 * Used for updating existing allergy information
 * Omits studentId and drugId as they should not be changed
 */
export class ClinicalUpdateAllergyDto extends PartialType(
  OmitType(AddAllergyDto, ['studentId', 'drugId'] as const),
) {}
