/**
 * Data Transfer Object for updating existing allergy records
 *
 * All fields are optional to support partial updates.
 */
import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateAllergyDto } from './create-allergy.dto';

export class UpdateAllergyDto extends PartialType(CreateAllergyDto) {
  /**
   * Active status flag for soft-delete functionality
   */
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
