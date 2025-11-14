import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for budget summary response
 */
export class BudgetSummaryDto {
  @ApiProperty({
    description: 'Fiscal year for this budget summary',
    example: 2025,
  })
  fiscalYear: number;

  @ApiProperty({
    description: 'Total amount allocated across all categories in dollars',
    example: 250000.0,
  })
  totalAllocated: number;

  @ApiProperty({
    description: 'Total amount spent across all categories in dollars',
    example: 187500.5,
  })
  totalSpent: number;

  @ApiProperty({
    description: 'Total remaining budget in dollars',
    example: 62499.5,
  })
  totalRemaining: number;

  @ApiProperty({
    description: 'Percentage of budget utilized',
    example: 75.0,
  })
  utilizationPercentage: number;

  @ApiProperty({
    description: 'Number of budget categories',
    example: 12,
  })
  categoryCount: number;

  @ApiProperty({
    description: 'Number of categories that have exceeded their budget',
    example: 2,
  })
  overBudgetCount: number;
}
