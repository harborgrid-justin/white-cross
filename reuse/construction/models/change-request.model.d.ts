import { Model } from 'sequelize-typescript';
import { ConstructionProject } from './project.model';
import { ChangeRequestStatus, ChangeOrderType, ChangeCategory } from '../types/change-order.types';
export declare class ChangeRequest extends Model<ChangeRequest> {
    id: string;
    changeRequestNumber: string;
    projectId: string;
    projectName: string;
    contractId: string;
    contractNumber: string;
    title: string;
    description: string;
    status: ChangeRequestStatus;
    changeType: ChangeOrderType;
    changeCategory: ChangeCategory;
    requestedBy: string;
    requestedByName: string;
    requestDate: Date;
    requiredByDate?: Date;
    justification: string;
    affectedAreas: string[];
    relatedDrawings: string[];
    relatedSpecifications: string[];
    attachments: string[];
    urgency: 'low' | 'medium' | 'high' | 'critical';
    estimatedCostImpact?: number;
    estimatedTimeImpact?: number;
    metadata: Record<string, any>;
    project: ConstructionProject;
}
//# sourceMappingURL=change-request.model.d.ts.map