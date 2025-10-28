import { PartialType } from '@nestjs/swagger';
import { CreateAllergyDto } from './create-allergy.dto';

export class UpdateAllergyDto extends PartialType(CreateAllergyDto) {}
