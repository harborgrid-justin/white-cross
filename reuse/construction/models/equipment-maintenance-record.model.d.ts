import { Model } from 'sequelize-typescript';
import { MaintenanceType } from '../types/equipment.types';
import { ConstructionEquipment } from './construction-equipment.model';
export declare class EquipmentMaintenanceRecord extends Model {
    id: string;
    equipmentId: string;
    equipment?: ConstructionEquipment;
    maintenanceType: MaintenanceType;
    description: string;
    scheduledDate?: Date;
    completionDate?: Date;
    technicianName?: string;
    serviceProvider?: string;
    totalCost?: number;
    laborCost?: number;
    partsCost?: number;
    partsReplaced?: string[];
    operatingHoursAtService?: number;
    downtimeHours?: number;
    workOrderNumber?: string;
    findings?: string;
    followUpRequired: boolean;
    nextServiceDue?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
//# sourceMappingURL=equipment-maintenance-record.model.d.ts.map