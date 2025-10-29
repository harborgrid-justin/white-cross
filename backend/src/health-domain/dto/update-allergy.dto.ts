import { PartialType } from '@nestjs/swagger';
import { CreateAllergyDto } from './create-allergy.dto';

export class HealthDomainUpdateAllergyDto extends PartialType(CreateAllergyDto) {}
