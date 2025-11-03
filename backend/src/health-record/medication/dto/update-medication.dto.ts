import { PartialType } from '@nestjs/swagger';
import { CreateMedicationDto } from './create-medication.dto';

/**
 * DTO for updating a medication record
 * All fields optional
 */
export class UpdateMedicationDto extends PartialType(CreateMedicationDto) {}