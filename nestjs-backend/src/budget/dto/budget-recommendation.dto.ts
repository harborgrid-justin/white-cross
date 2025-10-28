/**
 * DTO for budget recommendation response
 */
export class BudgetRecommendationDto {
  categoryName: string;
  currentAllocated: number;
  currentSpent: number;
  currentUtilization: number;
  recommendation: 'INCREASE' | 'DECREASE' | 'MAINTAIN';
  suggestedAmount: number;
  reason: string;
}
