import { PartialType } from '@nestjs/swagger';
import { CreateChronicConditionDto } from './create-chronic-condition.dto';

/**
 * DTO for updating a chronic condition record
 * All fields optional except studentId which cannot be changed
 */
export class UpdateChronicConditionDto extends PartialType(
  CreateChronicConditionDto,
) {
  // Remove studentId from update operations
  studentId?: never;
}
