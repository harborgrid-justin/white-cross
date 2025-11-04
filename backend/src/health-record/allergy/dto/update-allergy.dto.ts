import { PartialType } from '@nestjs/swagger';
import { HealthRecordCreateAllergyDto } from './create-allergy.dto';
import { OmitType } from '@nestjs/swagger';

/**
 * DTO for updating an allergy record
 * All fields optional except studentId which cannot be changed
 */
export class HealthRecordUpdateAllergyDto extends PartialType(
  OmitType(HealthRecordCreateAllergyDto, ['studentId'] as const)
) {}
