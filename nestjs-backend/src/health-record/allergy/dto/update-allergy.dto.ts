import { PartialType } from '@nestjs/swagger';
import { CreateAllergyDto } from './create-allergy.dto';
import { OmitType } from '@nestjs/swagger';

/**
 * DTO for updating an allergy record
 * All fields optional except studentId which cannot be changed
 */
export class UpdateAllergyDto extends PartialType(
  OmitType(CreateAllergyDto, ['studentId'] as const)
) {}
