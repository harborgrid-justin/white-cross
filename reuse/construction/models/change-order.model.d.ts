import { Model } from 'sequelize-typescript';
import { ConstructionProject } from './project.model';
export declare enum ChangeOrderStatus {
    DRAFT = "DRAFT",
    SUBMITTED = "SUBMITTED",
    UNDER_REVIEW = "UNDER_REVIEW",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    IMPLEMENTED = "IMPLEMENTED"
}
export declare enum ChangeOrderType {
    SCOPE = "SCOPE",
    SCHEDULE = "SCHEDULE",
    COST = "COST",
    COMBINED = "COMBINED"
}
export declare class ChangeOrder extends Model<ChangeOrder> {
    id: string;
    projectId: string;
    changeOrderNumber: string;
    title: string;
    description: string;
    changeType: ChangeOrderType;
    requestedBy: string;
    costImpact: number;
    scheduleImpact: number;
    status: ChangeOrderStatus;
    implementedDate?: Date;
    project: ConstructionProject;
}
//# sourceMappingURL=change-order.model.d.ts.map