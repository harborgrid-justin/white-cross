import { PartialType } from '@nestjs/swagger';
import { CreateImmunizationDto } from './create-immunization.dto';

export class UpdateImmunizationDto extends PartialType(CreateImmunizationDto) {}
