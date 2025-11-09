import { Model } from 'sequelize-typescript';
import { EquipmentCategory, EquipmentStatus, OwnershipType, ConditionRating } from '../types/equipment.types';
import { EquipmentMaintenanceRecord } from './equipment-maintenance-record.model';
import { EquipmentAllocation } from './equipment-allocation.model';
export declare class ConstructionEquipment extends Model {
    id: string;
    equipmentNumber: string;
    category: EquipmentCategory;
    make: string;
    model: string;
    year?: number;
    serialNumber?: string;
    vin?: string;
    status: EquipmentStatus;
    conditionRating?: ConditionRating;
    ownershipType: OwnershipType;
    purchasePrice?: number;
    currentValue?: number;
    acquisitionDate?: Date;
    currentLocation?: string;
    gpsCoordinates?: {
        lat: number;
        lng: number;
    };
    operatingHours: number;
    odometer?: number;
    fuelCapacity?: number;
    fuelLevel?: number;
    nextMaintenanceDate?: Date;
    lastMaintenanceDate?: Date;
    warrantyExpiration?: Date;
    insuranceExpiration?: Date;
    certifications?: string[];
    assignedOperatorId?: string;
    assignedProjectId?: string;
    dailyRentalRate?: number;
    monthlyRentalRate?: number;
    specifications?: Record<string, any>;
    notes?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    maintenanceRecords?: EquipmentMaintenanceRecord[];
    allocations?: EquipmentAllocation[];
}
//# sourceMappingURL=construction-equipment.model.d.ts.map