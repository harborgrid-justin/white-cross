import { PartialType } from '@nestjs/swagger';
import { HealthRecordCreateMedicationDto } from './create-medication.dto';

/**
 * DTO for updating a health record medication
 * All fields optional
 */
export class UpdateHealthRecordMedicationDto extends PartialType(HealthRecordCreateMedicationDto) {}