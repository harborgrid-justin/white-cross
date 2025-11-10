import { Model } from 'sequelize-typescript';
import { RequisitionStatus } from '../types/material.types';
import { ConstructionMaterial } from './construction-material.model';
import { MaterialTransaction } from './material-transaction.model';
export declare class MaterialRequisition extends Model {
    id: string;
    requisitionNumber: string;
    materialId: string;
    material?: ConstructionMaterial;
    projectId: string;
    projectName?: string;
    quantityRequested: number;
    quantityApproved?: number;
    quantityOrdered?: number;
    quantityReceived: number;
    status: RequisitionStatus;
    requiredDate: Date;
    estimatedUnitCost?: number;
    estimatedTotalCost?: number;
    actualTotalCost?: number;
    deliveryLocation?: string;
    deliveryInstructions?: string;
    requestedBy?: string;
    approvedBy?: string;
    purchaseOrderNumber?: string;
    vendorId?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    transactions?: MaterialTransaction[];
}
//# sourceMappingURL=material-requisition.model.d.ts.map