import { Model } from 'sequelize-typescript';
export declare class LaborPlan extends Model {
    id: string;
    projectId: string;
    planName: string;
    startDate: Date;
    endDate: Date;
    totalLaborHours: number;
    budgetedLaborCost: number;
    actualLaborCost: number;
    craftMix: Record<string, number>;
    skillRequirements: Record<string, any>;
    peakHeadcount: number;
    isPrevailingWage: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=labor-plan.model.d.ts.map