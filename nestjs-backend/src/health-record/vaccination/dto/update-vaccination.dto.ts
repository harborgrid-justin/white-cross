/**
 * @fileoverview Update Vaccination DTO
 * @module health-record/vaccination/dto/update-vaccination.dto
 * @description DTO for updating vaccination records
 */

import { PartialType } from '@nestjs/swagger';
import { CreateVaccinationDto } from './create-vaccination.dto';

export class UpdateVaccinationDto extends PartialType(CreateVaccinationDto) {}
