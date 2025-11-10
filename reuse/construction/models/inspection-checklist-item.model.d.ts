import { Model } from 'sequelize-typescript';
import { ConstructionInspection } from './construction-inspection.model';
export declare class InspectionChecklistItem extends Model {
    id: string;
    inspectionId: string;
    sequence: number;
    category: string;
    itemText: string;
    description: string;
    isRequired: boolean;
    isCompliant: boolean;
    isNotApplicable: boolean;
    notes: string;
    codeReference: string;
    photos: string[];
    checkedAt: Date;
    checkedBy: string;
    inspection: ConstructionInspection;
}
//# sourceMappingURL=inspection-checklist-item.model.d.ts.map