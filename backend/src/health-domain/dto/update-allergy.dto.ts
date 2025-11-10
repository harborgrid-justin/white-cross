import { PartialType } from '@nestjs/swagger';
import { HealthDomainCreateAllergyDto } from './create-allergy.dto';

export class HealthDomainUpdateAllergyDto extends PartialType(
  HealthDomainCreateAllergyDto,
) {}
