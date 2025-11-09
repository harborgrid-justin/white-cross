import { Model } from 'sequelize-typescript';
import { DeficiencySeverity, DeficiencyStatus } from '../types/quality.types';
export declare class QualityDeficiency extends Model {
    id: number;
    deficiencyNumber: string;
    inspectionId?: number;
    projectId: number;
    location: string;
    description: string;
    severity: DeficiencySeverity;
    category: string;
    trade: string;
    specification: string;
    identifiedBy: string;
    identifiedDate: Date;
    assignedTo: string;
    assignedDate: Date;
    dueDate: Date;
    status: DeficiencyStatus;
    rootCause?: string;
    correctiveAction?: string;
    resolvedBy?: string;
    resolvedDate?: Date;
    verifiedBy?: string;
    verifiedDate?: Date;
    photos: string[];
    attachments: string[];
    cost?: number;
    isPunchListItem: boolean;
    requiresRetest: boolean;
    escalationLevel: number;
    metadata: Record<string, any>;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=quality-deficiency.model.d.ts.map