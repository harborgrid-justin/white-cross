import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { AddDrugDto } from './add-drug.dto';
import { IsBoolean, IsOptional } from 'class-validator';

/**
 * Update Drug DTO
 * Used for updating existing drug information
 */
export class UpdateDrugDto extends PartialType(AddDrugDto) {
  @ApiPropertyOptional({
    description: 'Active status of the drug',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
