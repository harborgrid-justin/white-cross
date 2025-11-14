import { PartialType } from '@nestjs/swagger';
import { CreatePrescriptionDto } from './create-prescription.dto';

/**
 * DTO for updating an existing prescription
 * All fields are optional for partial updates
 */
export class UpdatePrescriptionDto extends PartialType(CreatePrescriptionDto) {}
