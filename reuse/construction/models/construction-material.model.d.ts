import { Model } from 'sequelize-typescript';
import { MaterialCategory, UnitOfMeasure, MaterialStatus } from '../types/material.types';
import { MaterialRequisition } from './material-requisition.model';
import { MaterialTransaction } from './material-transaction.model';
export declare class ConstructionMaterial extends Model {
    id: string;
    sku: string;
    name: string;
    description?: string;
    category: MaterialCategory;
    unitOfMeasure: UnitOfMeasure;
    stockQuantity: number;
    reorderPoint?: number;
    maxStockLevel?: number;
    status: MaterialStatus;
    unitCost: number;
    lastPurchasePrice?: number;
    averageCost?: number;
    vendorId?: string;
    vendorPartNumber?: string;
    manufacturer?: string;
    leadTimeDays?: number;
    storageLocation?: string;
    shelfLifeDays?: number;
    isHazardous: boolean;
    sdsUrl?: string;
    requiredCertifications?: string[];
    specifications?: Record<string, any>;
    notes?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    requisitions?: MaterialRequisition[];
    transactions?: MaterialTransaction[];
}
//# sourceMappingURL=construction-material.model.d.ts.map