import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsBoolean } from 'class-validator';
import { CreateBudgetCategoryDto } from './create-budget-category.dto';

/**
 * DTO for updating an existing budget category
 * All fields are optional
 */
export class UpdateBudgetCategoryDto extends PartialType(CreateBudgetCategoryDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
