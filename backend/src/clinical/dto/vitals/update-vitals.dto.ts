import { PartialType } from '@nestjs/swagger';
import { RecordVitalsDto } from './record-vitals.dto';

/**
 * DTO for updating vital signs record
 * All fields are optional for partial updates
 */
export class UpdateVitalsDto extends PartialType(RecordVitalsDto) {}
