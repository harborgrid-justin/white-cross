import { Model } from 'sequelize-typescript';
import { InspectionType, InspectionStatus } from '../types/quality.types';
export declare class QualityInspection extends Model {
    id: number;
    qualityPlanId: number;
    projectId: number;
    inspectionNumber: string;
    inspectionType: InspectionType;
    title: string;
    location: string;
    scope: string;
    scheduledDate: Date;
    scheduledTime: string;
    inspector: string;
    participants: string[];
    checklistId?: number;
    actualDate?: Date;
    actualStartTime?: string;
    actualEndTime?: string;
    status: InspectionStatus;
    passedItems: number;
    failedItems: number;
    totalItems: number;
    passRate: number;
    findings?: string;
    observations: string[];
    deficienciesFound: number;
    recommendations: string[];
    nextInspectionDate?: Date;
    requiresFollowUp: boolean;
    attachments: string[];
    metadata: Record<string, any>;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=quality-inspection.model.d.ts.map