import { Model } from 'sequelize-typescript';
import { InspectionType, InspectionStatus, InspectionResult, InspectorType } from '../types/inspection.types';
import { InspectionDeficiency } from './inspection-deficiency.model';
import { InspectionChecklistItem } from './inspection-checklist-item.model';
export declare class ConstructionInspection extends Model {
    id: string;
    inspectionNumber: string;
    inspectionType: InspectionType;
    projectId: string;
    location: string;
    building: string;
    level: string;
    zone: string;
    status: InspectionStatus;
    scheduledDate: Date;
    actualStartTime: Date;
    actualEndTime: Date;
    inspectorId: string;
    inspectorName: string;
    inspectorType: InspectorType;
    requestedBy: string;
    requestedAt: Date;
    description: string;
    result: InspectionResult;
    notes: string;
    comments: string;
    attachments: string[];
    permitId: string;
    checklistTemplateId: string;
    requiresReinspection: boolean;
    reinspectionOfId: string;
    deficiencyCount: number;
    metadata: Record<string, any>;
    deficiencies: InspectionDeficiency[];
    checklistItems: InspectionChecklistItem[];
}
//# sourceMappingURL=construction-inspection.model.d.ts.map