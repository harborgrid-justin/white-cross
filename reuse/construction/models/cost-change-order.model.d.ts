import { Model } from 'sequelize-typescript';
import { ChangeOrderStatus } from '../types/cost.types';
export declare class CostChangeOrder extends Model<CostChangeOrder> {
    id: string;
    projectId: string;
    changeOrderNumber: string;
    changeOrderDate: Date;
    requestedBy: string;
    description: string;
    justification: string;
    costImpact: number;
    scheduleImpact: number;
    status: ChangeOrderStatus;
    approvedBy?: string;
    approvalDate?: Date;
    rejectedBy?: string;
    rejectionReason?: string;
    affectedCostCodes: string[];
    originalEstimate: number;
    revisedEstimate: number;
    actualCost: number;
    incorporatedDate?: Date;
    metadata: Record<string, any>;
}
//# sourceMappingURL=cost-change-order.model.d.ts.map