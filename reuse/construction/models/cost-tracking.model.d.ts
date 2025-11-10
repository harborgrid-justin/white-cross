import { Model } from 'sequelize-typescript';
import { CostCategory } from '../types/cost.types';
export declare class CostTracking extends Model<CostTracking> {
    id: string;
    projectId: string;
    costCodeId: string;
    costCode: string;
    description: string;
    category: CostCategory;
    phase: string;
    transactionDate: Date;
    budgetedCost: number;
    originalBudget: number;
    revisedBudget: number;
    committedCost: number;
    actualCost: number;
    projectedCost: number;
    costVariance: number;
    variancePercent: number;
    earnedValue: number;
    percentComplete: number;
    costPerformanceIndex: number;
    estimateAtCompletion: number;
    estimateToComplete: number;
    fiscalPeriod: number;
    fiscalYear: number;
    lastUpdatedBy: string;
    metadata: Record<string, any>;
}
//# sourceMappingURL=cost-tracking.model.d.ts.map