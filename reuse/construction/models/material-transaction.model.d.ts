import { Model } from 'sequelize-typescript';
import { InspectionStatus, WasteReason } from '../types/material.types';
import { ConstructionMaterial } from './construction-material.model';
import { MaterialRequisition } from './material-requisition.model';
export declare class MaterialTransaction extends Model {
    id: string;
    transactionNumber: string;
    materialId: string;
    material?: ConstructionMaterial;
    requisitionId?: string;
    requisition?: MaterialRequisition;
    transactionType: string;
    transactionDate: Date;
    quantity: number;
    unitCost?: number;
    totalCost?: number;
    projectId?: string;
    fromLocation?: string;
    toLocation?: string;
    wasteReason?: WasteReason;
    inspectionStatus: InspectionStatus;
    inspectorName?: string;
    inspectionNotes?: string;
    handledBy?: string;
    receiptNumber?: string;
    notes?: string;
    certificationDocuments?: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
//# sourceMappingURL=material-transaction.model.d.ts.map