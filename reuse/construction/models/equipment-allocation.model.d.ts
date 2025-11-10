import { Model } from 'sequelize-typescript';
import { ConstructionEquipment } from './construction-equipment.model';
export declare class EquipmentAllocation extends Model {
    id: string;
    equipmentId: string;
    equipment?: ConstructionEquipment;
    projectId: string;
    projectName?: string;
    projectLocation?: string;
    startDate: Date;
    endDate?: Date;
    actualReturnDate?: Date;
    assignedOperatorId?: string;
    assignedOperatorName?: string;
    allocationStatus: string;
    dailyRate?: number;
    estimatedCost?: number;
    actualCost?: number;
    startingOperatingHours?: number;
    endingOperatingHours?: number;
    fuelConsumed?: number;
    purpose?: string;
    notes?: string;
    requestedBy?: string;
    approvedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
//# sourceMappingURL=equipment-allocation.model.d.ts.map