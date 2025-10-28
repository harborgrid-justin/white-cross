/**
 * DTO for budget summary response
 */
export class BudgetSummaryDto {
  fiscalYear: number;
  totalAllocated: number;
  totalSpent: number;
  totalRemaining: number;
  utilizationPercentage: number;
  categoryCount: number;
  overBudgetCount: number;
}
