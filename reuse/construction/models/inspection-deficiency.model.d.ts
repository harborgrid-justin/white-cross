import { Model } from 'sequelize-typescript';
import { DeficiencySeverity, DeficiencyStatus } from '../types/inspection.types';
import { ConstructionInspection } from './construction-inspection.model';
export declare class InspectionDeficiency extends Model {
    id: string;
    inspectionId: string;
    deficiencyNumber: string;
    title: string;
    description: string;
    location: string;
    severity: DeficiencySeverity;
    status: DeficiencyStatus;
    codeReference: string;
    requiredAction: string;
    dueDate: Date;
    assignedTo: string;
    assignedToName: string;
    assignedAt: Date;
    resolvedAt: Date;
    resolvedBy: string;
    resolutionNotes: string;
    photos: string[];
    verifiedAt: Date;
    verifiedBy: string;
    verificationNotes: string;
    inspection: ConstructionInspection;
}
//# sourceMappingURL=inspection-deficiency.model.d.ts.map