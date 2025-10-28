import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, MaxLength } from 'class-validator';

/**
 * DTO for creating a new budget category
 */
export class CreateBudgetCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(2000)
  fiscalYear: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  allocatedAmount: number;
}
