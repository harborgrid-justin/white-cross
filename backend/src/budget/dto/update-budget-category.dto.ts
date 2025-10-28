import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateBudgetCategoryDto } from './create-budget-category.dto';

/**
 * DTO for updating an existing budget category
 * All fields from CreateBudgetCategoryDto are optional (PartialType)
 */
export class UpdateBudgetCategoryDto extends PartialType(CreateBudgetCategoryDto) {
  @ApiPropertyOptional({
    description: 'Whether this budget category is currently active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
