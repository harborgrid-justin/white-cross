import { PartialType } from '@nestjs/swagger';
import { CreateTreatmentPlanDto } from './create-treatment-plan.dto';

/**
 * DTO for updating an existing treatment plan
 * All fields are optional for partial updates
 */
export class UpdateTreatmentPlanDto extends PartialType(
  CreateTreatmentPlanDto,
) {}
