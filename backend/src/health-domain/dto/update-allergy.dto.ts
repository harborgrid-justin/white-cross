import { PartialType } from '@nestjs/swagger';
import { HealthDomainAllergyCreateDto } from './create-allergy.dto';

export class HealthDomainUpdateAllergyDto extends PartialType(HealthDomainAllergyCreateDto) {}
