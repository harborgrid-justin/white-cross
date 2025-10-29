/**
 * Data Transfer Object for updating existing allergy records
 *
 * All fields are optional to support partial updates.
 */
import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAllergyDto } from './create-allergy.dto';

export class AllergyUpdateDto extends PartialType(CreateAllergyDto) {
  /**
   * Whether allergy has been clinically verified
   * Explicitly defined for update operations
   */
  @ApiPropertyOptional({
    description: 'Whether the allergy has been clinically verified by a healthcare professional',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  /**
   * Active status flag for soft-delete functionality
   */
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
