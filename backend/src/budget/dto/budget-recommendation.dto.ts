import { ApiProperty } from '@nestjs/swagger';

/**
 * Recommendation action types for budget adjustments
 */
export enum BudgetRecommendationType {
  INCREASE = 'INCREASE',
  DECREASE = 'DECREASE',
  MAINTAIN = 'MAINTAIN',
}

/**
 * DTO for budget recommendation response
 */
export class BudgetRecommendationDto {
  @ApiProperty({
    description: 'Name of the budget category',
    example: 'Medical Supplies',
  })
  categoryName: string;

  @ApiProperty({
    description: 'Currently allocated amount for this category in dollars',
    example: 50000.0,
  })
  currentAllocated: number;

  @ApiProperty({
    description: 'Amount spent so far in dollars',
    example: 47500.0,
  })
  currentSpent: number;

  @ApiProperty({
    description: 'Current utilization percentage',
    example: 95.0,
  })
  currentUtilization: number;

  @ApiProperty({
    description: 'Recommended budget action',
    enum: BudgetRecommendationType,
    example: BudgetRecommendationType.INCREASE,
  })
  recommendation: BudgetRecommendationType;

  @ApiProperty({
    description: 'Suggested budget amount for next fiscal year in dollars',
    example: 60000.0,
  })
  suggestedAmount: number;

  @ApiProperty({
    description: 'Explanation for the recommendation',
    example:
      'Category consistently operates near capacity with 95% utilization. Suggest 20% increase to prevent budget overruns.',
  })
  reason: string;
}
