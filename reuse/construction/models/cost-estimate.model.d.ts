import { Model } from 'sequelize-typescript';
import { EstimateType } from '../types/cost.types';
export declare class CostEstimate extends Model<CostEstimate> {
    id: string;
    projectId: string;
    estimateNumber: string;
    estimateType: EstimateType;
    estimateDate: Date;
    totalEstimatedCost: number;
    directCosts: number;
    indirectCosts: number;
    contingency: number;
    contingencyPercent: number;
    escalation: number;
    estimatedBy: string;
    status: 'draft' | 'submitted' | 'approved' | 'baseline' | 'superseded';
    baselineDate?: Date;
    revisedEstimate?: number;
    revisionNumber: number;
    revisionReason?: string;
    approvedBy?: string;
    approvalDate?: Date;
    metadata: Record<string, any>;
}
//# sourceMappingURL=cost-estimate.model.d.ts.map