import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for creating a new budget category
 */
export class CreateBudgetCategoryDto {
  @ApiProperty({
    description: 'Name of the budget category',
    example: 'Medical Supplies',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the budget category',
    example: 'Budget allocation for bandages, medications, and first aid supplies',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Fiscal year for this budget category (YYYY)',
    example: 2025,
    minimum: 2000,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(2000)
  fiscalYear: number;

  @ApiProperty({
    description: 'Total amount allocated for this category in dollars',
    example: 50000.00,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  allocatedAmount: number;
}
